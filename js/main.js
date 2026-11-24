import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import * as S from './shaders.js';
import { CONTENT, ORDER } from './content.js';

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const rand = (a, b) => a + Math.random() * (b - a);
const gauss = () => { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const easeIO = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const isMobile = matchMedia('(pointer:coarse)').matches || innerWidth < 760;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------------------------------------------------------------- renderer
const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
let pixelRatio = Math.min(devicePixelRatio, isMobile ? 1.25 : 1.75);
renderer.setPixelRatio(pixelRatio);
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 30000);
camera.position.set(0, 140, 1400);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.enablePan = false;
controls.rotateSpeed = 0.55;
controls.zoomSpeed = 0.9;
controls.autoRotateSpeed = 0.35;
controls.enabled = false;

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.7, 0.5, 0.85);
composer.addPass(bloom);
composer.addPass(new OutputPass());

const uTime = { value: 0 };
const uPx = { value: renderer.getPixelRatio() * (innerHeight / 900) };

// ---------------------------------------------------------------- helpers
const glowTexture = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(255,255,255,1)');
  gr.addColorStop(0.15, 'rgba(255,255,255,0.45)');
  gr.addColorStop(0.45, 'rgba(255,255,255,0.08)');
  gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
})();

function glowSprite(color, size, intensity = 1) {
  const m = new THREE.SpriteMaterial({ map: glowTexture, color: new THREE.Color(color).multiplyScalar(intensity), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true });
  const s = new THREE.Sprite(m); s.scale.set(size, size, 1); return s;
}

function makePoints(pos, col, size, { additive = true, alpha = 1, sharp = 14, spin = 0 } = {}) {
  const n = size.length;
  const g = new THREE.BufferGeometry();
  const seed = new Float32Array(n); for (let i = 0; i < n; i++) seed[i] = Math.random();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setAttribute('size', new THREE.Float32BufferAttribute(size, 1));
  g.setAttribute('seed', new THREE.Float32BufferAttribute(seed, 1));
  const m = new THREE.ShaderMaterial({
    vertexShader: S.pointsVert, fragmentShader: S.pointsFrag,
    uniforms: { uTime, uPx, uAlpha: { value: alpha }, uSharp: { value: sharp }, uSpin: { value: spin } },
    transparent: true, depthWrite: false,
    blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending
  });
  const p = new THREE.Points(g, m); p.frustumCulled = false; return p;
}

function starMaterial({ c1, c2, c3, scale, gain, limb }) {
  return new THREE.ShaderMaterial({
    vertexShader: S.starVert, fragmentShader: S.starFrag,
    uniforms: { uTime, uC1: { value: V(...c1) }, uC2: { value: V(...c2) }, uC3: { value: V(...c3) }, uScaleN: { value: scale }, uGain: { value: gain }, uLimb: { value: limb } }
  });
}

function glowShell(center, r, width, color, pow = 2.2, scale = 1) {
  const m = new THREE.ShaderMaterial({
    vertexShader: S.glowVert, fragmentShader: S.glowFrag,
    uniforms: { uCenter: { value: center }, uR: { value: r }, uW: { value: width }, uColor: { value: V(...color).multiplyScalar(scale) }, uPow: { value: pow } },
    side: THREE.BackSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(r + width, 64, 32), m);
  mesh.position.copy(center); return mesh;
}

const marker = (parent, x, y, z) => { const o = new THREE.Object3D(); o.position.set(x, y, z); parent.add(o); return o; };

// ---------------------------------------------------------------- céu
const sky = new THREE.Mesh(
  new THREE.SphereGeometry(12000, 64, 32),
  new THREE.ShaderMaterial({ vertexShader: S.skyVert, fragmentShader: S.skyFrag, side: THREE.BackSide, depthWrite: false })
);
sky.renderOrder = -10; sky.frustumCulled = false; scene.add(sky);

// estrelas próximas (paralaxe ao viajar)
{
  const n = isMobile ? 2500 : 5000, pos = [], col = [], size = [];
  for (let i = 0; i < n; i++) {
    const d = V(gauss(), gauss(), gauss()).normalize().multiplyScalar(rand(600, 5000));
    pos.push(d.x, d.y, d.z);
    const warm = Math.random();
    col.push(...(warm < 0.3 ? [1.4, 1.0, 0.75] : warm < 0.8 ? [1.2, 1.2, 1.3] : [0.8, 0.95, 1.6]));
    size.push(rand(1.5, 4.5));
  }
  scene.add(makePoints(pos, col, size, { sharp: 30 }));
}

// ---------------------------------------------------------------- corpos
const bodies = {};

// ---- Buraco negro
{
  const c = V(0, 0, 0), s = 2.2, R = 22;
  const mat = new THREE.ShaderMaterial({
    vertexShader: S.bhVert, fragmentShader: S.bhFrag, side: THREE.BackSide,
    uniforms: { uCenter: { value: c }, uScale: { value: s }, uRadius: { value: R }, uTime },
    defines: { STEPS: isMobile ? 110 : 180, STEPK: isMobile ? '0.14' : '0.09' }
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(R * s, 64, 32), mat);
  mesh.position.copy(c); scene.add(mesh);
  const tmp = V();
  const approachAngle = () => { tmp.copy(camera.position).sub(c); return Math.atan2(tmp.x, -tmp.z); };
  bodies['buraco-negro'] = {
    center: c, dir: V(0, 0.11, 1), dist: 46, min: 10, max: 600,
    occluders: [[c, 1.2 * s]],
    spots: {
      shadow: () => c.clone(),
      ring: ({ up }) => c.clone().addScaledVector(up, 2.75 * s),
      lens: ({ up }) => c.clone().addScaledVector(up, 4.9 * s),
      disk: () => { const a = approachAngle() + Math.PI; return c.clone().add(V(Math.cos(a), 0, Math.sin(a)).multiplyScalar(10.5 * s)); },
      doppler: () => { const a = approachAngle(); return c.clone().add(V(Math.cos(a), 0, Math.sin(a)).multiplyScalar(7 * s)); }
    }
  };
}

// ---- Pulsar
{
  const c = V(320, 40, -220);
  const g = new THREE.Group(); g.position.copy(c); scene.add(g);
  const spin = new THREE.Group(); g.add(spin);
  const tilt = new THREE.Group(); tilt.rotation.z = 0.55; spin.add(tilt);
  const star = new THREE.Mesh(new THREE.SphereGeometry(1.6, 64, 32), starMaterial({ c1: [0.5, 0.75, 1.8], c2: [1.6, 1.9, 2.8], c3: [3.2, 3.3, 3.8], scale: 3, gain: 1.4, limb: 0.35 }));
  spin.add(star);
  g.add(glowSprite('#7fa8ff', 34, 1.3));
  const flash = glowSprite('#d8e6ff', 90, 2.2); flash.material.opacity = 0; g.add(flash);

  const beamMat = new THREE.ShaderMaterial({
    vertexShader: S.beamVert, fragmentShader: S.beamFrag,
    uniforms: { uTime, uColor: { value: V(0.55, 0.7, 1.4) } },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide
  });
  const beamGeo = new THREE.CylinderGeometry(0.3, 7.5, 90, 48, 1, true); beamGeo.translate(0, -45, 0);
  const b1 = new THREE.Mesh(beamGeo, beamMat); b1.rotation.x = Math.PI;
  const b2 = new THREE.Mesh(beamGeo, beamMat);
  tilt.add(b1, b2);
  for (const y of [2.2, -2.2]) { const s = glowSprite('#bcd0ff', 8, 1.5); s.position.y = y; tilt.add(s); }

  const lineMat = new THREE.ShaderMaterial({
    vertexShader: S.lineVert, fragmentShader: S.lineFrag,
    uniforms: { uTime, uColor: { value: V(0.35, 0.6, 1.3) } },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
  });
  for (let k = 0; k < 8; k++) {
    const phi = k / 8 * Math.PI * 2;
    for (const L of [4.5, 7.5, 12.5]) {
      const tmin = Math.asin(Math.sqrt(1.6 / L)), pts = [], prog = [];
      for (let i = 0; i <= 80; i++) {
        const th = tmin + (Math.PI - 2 * tmin) * i / 80, r = L * Math.sin(th) ** 2;
        pts.push(r * Math.sin(th) * Math.cos(phi), r * Math.cos(th), r * Math.sin(th) * Math.sin(phi));
        prog.push(i / 80 + k * 0.13);
      }
      const lg = new THREE.BufferGeometry();
      lg.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
      lg.setAttribute('prog', new THREE.Float32BufferAttribute(prog, 1));
      tilt.add(new THREE.Line(lg, lineMat));
    }
  }
  const axisGeo = new THREE.BufferGeometry().setFromPoints([V(0, -16, 0), V(0, 16, 0)]);
  g.add(new THREE.Line(axisGeo, new THREE.LineDashedMaterial({ color: 0x8fa3c8, dashSize: 0.8, gapSize: 0.6, transparent: true, opacity: 0.45 })).computeLineDistances());

  // nebulosa de vento do pulsar
  const n = isMobile ? 1800 : 3500, pos = [], col = [], size = [];
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, r = 5 + Math.abs(gauss()) * 14;
    pos.push(Math.cos(a) * r, gauss() * (1.5 + r * 0.12), Math.sin(a) * r);
    const t = Math.random();
    col.push(0.25 + t * 0.4, 0.3 + t * 0.2, 0.9);
    size.push(rand(2, 6));
  }
  g.add(makePoints(pos, col, size, { alpha: 0.35 }));

  const beamMk = marker(tilt, 0, 30, 0), fieldMk = marker(tilt, 12.5, 0, 0), axisMk = marker(g, 0, 15, 0);
  const beamDir = V(), toCam = V();
  bodies['pulsar'] = {
    center: c, dir: V(0.9, 0.25, 1), dist: 42, min: 6, max: 400,
    occluders: [[c, 1.6]],
    spots: {
      star: ({ up }) => c.clone().addScaledVector(up, 2.8),
      beam: () => beamMk.getWorldPosition(V()),
      axis: () => axisMk.getWorldPosition(V()),
      field: () => fieldMk.getWorldPosition(V())
    },
    update(t) {
      spin.rotation.y = t * (Math.PI * 2 / 2.8);
      tilt.updateMatrixWorld();
      beamDir.set(0, 1, 0).transformDirection(tilt.matrixWorld);
      toCam.copy(camera.position).sub(c).normalize();
      const d = Math.abs(beamDir.dot(toCam));
      flash.material.opacity = smooth(0.94, 0.995, d);
    }
  };
}

// ---- Betelgeuse
{
  const c = V(-520, -40, -360), R = 40;
  const g = new THREE.Group(); g.position.copy(c); scene.add(g);
  const star = new THREE.Mesh(new THREE.SphereGeometry(R, 128, 64), starMaterial({ c1: [0.3, 0.035, 0.01], c2: [1.35, 0.26, 0.05], c3: [2.2, 0.85, 0.28], scale: 2.1, gain: 1.15, limb: 0.6 }));
  g.add(star);
  scene.add(glowShell(c, R * 0.985, R * 1.1, [1.0, 0.28, 0.07], 2.4, 0.85));

  const dustG = new THREE.Group(); g.add(dustG);
  const bias = V(0.4, -0.8, 0.45).normalize();
  const n = isMobile ? 4000 : 8000, pd = [], cd = [], sd = [], pl = [], cl = [], sl = [];
  for (let i = 0; i < n; i++) {
    const d = V(gauss(), gauss(), gauss()).normalize();
    if (d.dot(bias) < Math.random() * 1.6 - 0.75) continue;
    const r = R * (1.08 + Math.abs(gauss()) * 0.7);
    const p = d.multiplyScalar(r);
    if (Math.random() < 0.8) { pd.push(p.x, p.y, p.z); cd.push(0.1, 0.045, 0.03); sd.push(rand(8, 18)); }
    else { pl.push(p.x, p.y, p.z); cl.push(1.0, 0.42, 0.15); sl.push(rand(3, 8)); }
  }
  const dark = makePoints(pd, cd, sd, { additive: false, alpha: 0.42, sharp: 9 }); dark.renderOrder = 2; dustG.add(dark);
  const lit = makePoints(pl, cl, sl, { alpha: 0.25 }); lit.renderOrder = 3; dustG.add(lit);

  // órbita de Júpiter em escala (raio ~800 R☉ → 1 UA ≈ 10,75 unidades)
  const jr = 5.2 * 10.75, ring = [];
  for (let i = 0; i <= 256; i++) { const a = i / 256 * Math.PI * 2; ring.push(V(Math.cos(a) * jr, 0, Math.sin(a) * jr)); }
  const ringG = new THREE.Group(); ringG.rotation.set(0.32, 0, 0.12); g.add(ringG);
  ringG.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(ring), new THREE.LineDashedMaterial({ color: 0xa9c0e8, dashSize: 2, gapSize: 1.5, transparent: true, opacity: 0.55 })).computeLineDistances());
  const jup = new THREE.Mesh(new THREE.SphereGeometry(0.9, 24, 12), new THREE.MeshBasicMaterial({ color: 0xd8c3a0 }));
  ringG.add(jup);
  const dustMk = marker(dustG, ...bias.clone().multiplyScalar(R * 1.55).toArray());
  const e1 = V(), e2 = V(), tmp = V();
  bodies['betelgeuse'] = {
    center: c, dir: V(0.35, 0.18, 1), dist: 150, min: 55, max: 700,
    occluders: [[c, R]],
    spots: {
      cells: ({ up, toCam }) => c.clone().add(tmp.copy(toCam).addScaledVector(up, 0.9).normalize().multiplyScalar(R * 1.01)),
      dust: () => dustMk.getWorldPosition(V()),
      glow: ({ right }) => c.clone().addScaledVector(right, R * 1.22),
      jupiter: () => jup.getWorldPosition(V())
    },
    update(t, cam) {
      dustG.rotation.y = t * 0.01;
      // Júpiter acompanha o ponto do anel mais à direita da tela, para o rótulo ficar legível
      ringG.updateMatrixWorld();
      e1.set(1, 0, 0).transformDirection(ringG.matrixWorld);
      e2.set(0, 0, 1).transformDirection(ringG.matrixWorld);
      const a = Math.atan2(e2.dot(cam.right), e1.dot(cam.right));
      jup.position.set(Math.cos(a) * jr, 0, Math.sin(a) * jr);
    }
  };
}

// ---- Anã branca + Terra em escala
{
  const c = V(260, -70, 380), R = 1.8;
  const g = new THREE.Group(); g.position.copy(c); scene.add(g);
  g.add(new THREE.Mesh(new THREE.SphereGeometry(R, 64, 32), starMaterial({ c1: [1.5, 1.7, 2.3], c2: [2.3, 2.5, 3.1], c3: [3.2, 3.3, 3.7], scale: 3, gain: 1.1, limb: 0.3 })));
  g.add(glowSprite('#b9d0ff', 24, 1.15));
  scene.add(glowShell(c, R * 0.98, R * 3, [0.55, 0.72, 1.2], 3.0, 0.9));

  const earthMat = new THREE.ShaderMaterial({ vertexShader: S.starVert, fragmentShader: S.earthFrag, uniforms: { uTime, uLight: { value: c } } });
  const earth = new THREE.Mesh(new THREE.SphereGeometry(R, 64, 32), earthMat);
  earth.position.set(12, 0.8, -3); earth.rotation.z = 0.41; g.add(earth);

  const n = isMobile ? 3000 : 6000, pos = [], col = [], size = [];
  for (let i = 0; i < n; i++) {
    const d = V(gauss(), gauss() * 1.25, gauss()).normalize();
    const r = 30 + gauss() * 2.5 + Math.sin(d.x * 6 + d.y * 4) * 3;
    const p = d.multiplyScalar(r); p.y *= 1.2;
    pos.push(p.x, p.y, p.z);
    const t = Math.random();
    col.push(...(t < 0.55 ? [0.15, 0.6, 0.65] : t < 0.85 ? [0.9, 0.3, 0.4] : [0.5, 0.4, 0.9]));
    size.push(rand(4, 10));
  }
  const shell = makePoints(pos, col, size, { alpha: 0.32 }); g.add(shell);
  const tmp = V();
  bodies['ana-branca'] = {
    center: c, dir: V(-0.55, 0.15, 1), dist: 21, min: 5, max: 260,
    occluders: [[c, R], [earth.getWorldPosition(V()), R]],
    spots: {
      star: ({ up }) => c.clone().addScaledVector(up, 3.0),
      earth: ({ up }) => earth.getWorldPosition(V()).addScaledVector(up, 3.0),
      shell: ({ up, right }) => c.clone().add(tmp.copy(right).add(up).normalize().multiplyScalar(30))
    },
    update(t) { earth.rotation.y = t * 0.08; shell.rotation.y = t * 0.006; }
  };
}

// ---- Berçário estelar
{
  const c = V(-380, 160, 560);
  const g = new THREE.Group(); g.position.copy(c); scene.add(g);
  const pal = [[0.08, 0.5, 0.55], [0.9, 0.55, 0.22], [0.8, 0.22, 0.32], [0.25, 0.32, 0.85], [0.08, 0.5, 0.55]];
  const nGlow = isMobile ? 3500 : 8000, gp = [], gc = [], gs = [];
  const blobs = Array.from({ length: 26 }, () => ({ p: V(gauss() * 70, gauss() * 45 + 10, gauss() * 40 - 20), r: rand(22, 55), c: pal[Math.floor(Math.random() * pal.length)] }));
  for (let i = 0; i < nGlow; i++) {
    const b = blobs[i % blobs.length];
    gp.push(b.p.x + gauss() * b.r * 0.55, b.p.y + gauss() * b.r * 0.45, b.p.z + gauss() * b.r * 0.4);
    const k = rand(0.6, 1.2); gc.push(b.c[0] * k, b.c[1] * k, b.c[2] * k);
    gs.push(rand(18, 48));
  }
  const glow = makePoints(gp, gc, gs, { alpha: 0.13, sharp: 8 }); glow.renderOrder = 1; g.add(glow);

  const pillars = [
    { a: V(-45, -95, 0), b: V(-28, 45, 8), r0: 20, r1: 8 },
    { a: V(18, -95, -12), b: V(12, 5, -6), r0: 14, r1: 6 },
    { a: V(62, -95, 6), b: V(55, -30, 2), r0: 10, r1: 5 }
  ];
  const L = V(0.25, 0.85, 0.45).normalize();
  const nDust = isMobile ? 5000 : 11000, dp = [], dc = [], ds = [], rp = [], rc = [], rs = [];
  const ax = V(), u = V(), w = V(), q = V();
  for (let i = 0; i < nDust; i++) {
    const P = pillars[i % 3], t = Math.pow(Math.random(), 0.8);
    ax.copy(P.a).lerp(P.b, t); ax.x += Math.sin(t * 3.2) * 6;
    const rr = P.r0 + (P.r1 - P.r0) * t;
    const ang = Math.random() * Math.PI * 2;
    u.set(Math.cos(ang), 0, Math.sin(ang));
    const rad = rr * Math.min(Math.abs(gauss()) * 0.5, 1.1);
    q.copy(ax).addScaledVector(u, rad); q.y += gauss() * 2;
    dp.push(q.x, q.y, q.z); dc.push(0.075, 0.045, 0.035); ds.push(rand(7, 15));
    // borda iluminada voltada para as estrelas
    w.copy(u); w.y = 0.25;
    if (w.normalize().dot(L) > 0.25 && Math.random() < 0.55) {
      q.copy(ax).addScaledVector(u, rr * 0.95);
      rp.push(q.x, q.y, q.z); rc.push(1.0, 0.58, 0.3); rs.push(rand(3, 7));
    }
  }
  // topos iluminados
  for (const P of pillars) for (let i = 0; i < 400; i++) {
    const ang = Math.random() * Math.PI * 2, r = P.r1 * Math.sqrt(Math.random());
    rp.push(P.b.x + Math.sin(3.2) * 6 + Math.cos(ang) * r, P.b.y + rand(-1, 3), P.b.z + Math.sin(ang) * r);
    rc.push(1.1, 0.75, 0.45); rs.push(rand(3, 6));
  }
  const dust = makePoints(dp, dc, ds, { additive: false, alpha: 0.75, sharp: 8 }); dust.renderOrder = 2; g.add(dust);
  const rim = makePoints(rp, rc, rs, { alpha: 0.4 }); rim.renderOrder = 3; g.add(rim);

  const sp = [], sc = [], ss = [];
  for (let i = 0; i < 90; i++) {
    sp.push(gauss() * 80, gauss() * 50 + 20, gauss() * 40 - 10);
    const k = rand(1.5, 4); sc.push(0.9 * k, 0.95 * k, 1.2 * k); ss.push(rand(2, 5));
  }
  const stars = makePoints(sp, sc, ss, { sharp: 40 }); stars.renderOrder = 4; g.add(stars);
  const hot = [V(-10, 70, 30), V(40, 60, 10), V(-70, 50, 20)];
  for (const h of hot) { const s = glowSprite('#cfe2ff', 28, 1.4); s.position.copy(h); s.renderOrder = 5; g.add(s); }
  const pilMk = marker(g, pillars[0].b.x + Math.sin(3.2) * 6, pillars[0].b.y + 4, pillars[0].b.z);
  const starMk = marker(g, hot[0].x, hot[0].y, hot[0].z);
  const gasMk = marker(g, blobs[0].p.x, blobs[0].p.y, blobs[0].p.z);
  bodies['nebulosa'] = {
    center: c, dir: V(0.2, 0.12, 1), dist: 250, min: 60, max: 800, occluders: [],
    spots: { pillars: () => pilMk.getWorldPosition(V()), stars: () => starMk.getWorldPosition(V()), gas: () => gasMk.getWorldPosition(V()) },
    update(t) { g.rotation.y = Math.sin(t * 0.03) * 0.05; }
  };
}

// ---- Galáxia espiral
{
  const c = V(200, 700, -1300), R = 330, K = 2.3, SPIN = 0.02;
  const g = new THREE.Group(); g.position.copy(c); g.rotation.set(-0.45, 0, 0.18); scene.add(g);
  const armAngle = (arm, r) => arm * Math.PI + K * Math.log(1 + r / 22);
  const N = isMobile ? 32000 : 85000, p = [], col = [], sz = [];
  const warm = [1.0, 0.8, 0.55], blue = [0.55, 0.72, 1.0];
  for (let i = 0; i < N; i++) {
    const roll = Math.random();
    if (roll < 0.16) {
      const d = V(gauss(), gauss() * 0.55, gauss()).multiplyScalar(26);
      p.push(d.x, d.y, d.z);
      const k = rand(0.7, 1.3); col.push(warm[0] * k * 1.2, warm[1] * k * 1.15, warm[2] * k);
      sz.push(rand(1.8, 3.6)); continue;
    }
    const r = Math.min(-Math.log(1 - Math.random() * 0.985) * R / 4.2 + 8, R * 1.1);
    const inArm = roll < 0.78;
    const th = inArm ? armAngle(Math.floor(Math.random() * 2), r) + gauss() * 0.12 : Math.random() * Math.PI * 2;
    const spread = inArm ? 5 + r * 0.09 : 4;
    const x = Math.cos(th) * r + gauss() * spread, z = Math.sin(th) * r + gauss() * spread;
    const y = gauss() * (2.5 + 7 * Math.exp(-r / 55));
    p.push(x, y, z);
    const t = smooth(0.04, 0.45, r / R);
    const k = rand(0.55, 1.1) * (inArm ? 1.1 : 0.7);
    if (inArm && Math.random() < 0.03 && r > 40) { col.push(1.3, 0.38, 0.55); sz.push(rand(3.5, 6)); continue; }
    col.push((warm[0] + (blue[0] - warm[0]) * t) * k, (warm[1] + (blue[1] - warm[1]) * t) * k, (warm[2] + (blue[2] - warm[2]) * t) * k);
    sz.push(rand(1.4, 3.2));
  }
  g.add(makePoints(p, col, sz, { alpha: 0.9, sharp: 18, spin: SPIN }));
  const ND = isMobile ? 7000 : 18000, dp = [], dc = [], ds = [];
  for (let i = 0; i < ND; i++) {
    const r = 25 + Math.random() * R * 0.85, th = armAngle(Math.floor(Math.random() * 2), r) - 0.2 + gauss() * 0.06;
    dp.push(Math.cos(th) * r + gauss() * 4, gauss() * 1.4, Math.sin(th) * r + gauss() * 4);
    dc.push(0.05, 0.035, 0.03); ds.push(rand(5, 10));
  }
  const dustP = makePoints(dp, dc, ds, { additive: false, alpha: 0.32, sharp: 9, spin: SPIN }); dustP.renderOrder = 2; g.add(dustP);
  g.add(glowSprite('#ffd9a8', 230, 0.75));
  g.add(glowSprite('#fff1dc', 50, 1.3));
  const mkBase = [[0, 0], [R * 0.36, 1], [R * 0.55, 0]].map(([r, arm]) => { const th = armAngle(arm, r); return [Math.cos(th) * r, Math.sin(th) * r, r]; });
  const mks = mkBase.map(([x, z]) => marker(g, x, 0, z));
  const bulgeMk = marker(g, 0, 26, 0);
  bodies['galaxia'] = {
    center: c, dir: V(0.15, 0.75, 1), dist: 470, min: 120, max: 2200, occluders: [],
    spots: {
      core: () => mks[0].getWorldPosition(V()),
      bulge: () => bulgeMk.getWorldPosition(V()),
      arm: () => mks[1].getWorldPosition(V()),
      sun: () => mks[2].getWorldPosition(V())
    },
    update(t) {
      mkBase.forEach(([x, z, r], i) => {
        const a = -t * SPIN * 18 / (r + 25), cs = Math.cos(a), sn = Math.sin(a);
        mks[i].position.set(cs * x + sn * z, 0, -sn * x + cs * z);
      });
    }
  };
}

// ---------------------------------------------------------------- UI
const $ = s => document.querySelector(s);
const T = k => ({ photoWorking: 'Gerando imagem em alta resolução…', photoSaved: 'Imagem salva:', photoFail: 'Não foi possível gerar a imagem neste dispositivo.' })[k];
const panel = $('#panel'), chips = $('#chips'), spotsEl = $('#spots'), pop = $('#pop');
let current = null, flight = null, tab = 'how', lastInteract = performance.now();

chips.innerHTML = ORDER.map(id => `<button class="chip" data-id="${id}" aria-label="${CONTENT[id].name}"><span>${CONTENT[id].name}</span><small>${CONTENT[id].type}</small></button>`).join('');

function renderPanel() {
  const d = CONTENT[current];
  $('#p-type').textContent = d.type;
  $('#p-name').textContent = d.name;
  $('#p-intro').textContent = d.intro;
  document.querySelectorAll('.tab').forEach(b => b.setAttribute('aria-selected', b.dataset.tab === tab));
  const body = $('#p-body');
  if (tab === 'how') body.innerHTML = d.how.map(p => `<p>${p}</p>`).join('');
  else if (tab === 'numbers') body.innerHTML = `<dl class="nums">${d.numbers.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`;
  else body.innerHTML = `<ul class="facts">${d.facts.map(f => `<li>${f}</li>`).join('')}</ul>`;
  body.scrollTop = 0;
}

function buildSpots() {
  const d = CONTENT[current];
  spotsEl.innerHTML = Object.keys(bodies[current].spots).map(k => `<button class="spot" data-k="${k}"><i></i><span>${d.spots[k][0]}</span></button>`).join('');
  closePop();
}

function select(id, instant = false) {
  if (!bodies[id]) return;
  current = id;
  document.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c.dataset.id === id));
  chips.querySelector(`[data-id="${id}"]`)?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: instant ? 'auto' : 'smooth' });
  panel.classList.add('swap');
  setTimeout(() => { renderPanel(); panel.classList.remove('swap'); }, instant ? 0 : 220);
  buildSpots();
  if (location.hash.slice(1) !== id) history.replaceState(null, '', '#' + id);
  flyTo(id, instant);
}

function flyTo(id, instant) {
  const b = bodies[id];
  const endPos = b.center.clone().addScaledVector(b.dir.clone().normalize(), b.dist);
  controls.autoRotate = false;
  if (instant || reduceMotion) {
    camera.position.copy(endPos); controls.target.copy(b.center);
    finishFlight(b); return;
  }
  const startPos = camera.position.clone(), d = startPos.distanceTo(endPos);
  const mid = startPos.clone().lerp(endPos, 0.5).add(V(0, d * 0.18, 0));
  flight = { t0: performance.now(), dur: clamp(1600 + d * 1.6, 2200, 5200), startPos, endPos, mid, st: controls.target.clone(), et: b.center.clone(), b };
  controls.enabled = false;
  controls.minDistance = 0; controls.maxDistance = Infinity;
  document.body.classList.add('flying');
}

function finishFlight(b) {
  flight = null;
  camera.fov = 50; camera.updateProjectionMatrix();
  controls.minDistance = b.min; controls.maxDistance = b.max;
  controls.enabled = true; controls.update();
  document.body.classList.remove('flying');
  lastInteract = performance.now();
}

chips.addEventListener('click', e => { const c = e.target.closest('.chip'); if (c) select(c.dataset.id); });
const step = k => select(ORDER[(ORDER.indexOf(current) + k + ORDER.length) % ORDER.length]);
$('#prev').onclick = () => step(-1);
$('#next').onclick = () => step(1);
document.querySelectorAll('.tab').forEach(b => b.onclick = () => { tab = b.dataset.tab; renderPanel(); });
$('#more').onclick = () => panel.classList.toggle('open');
$('#info').onclick = () => document.body.classList.toggle('no-panel');
$('#cinema').onclick = () => { document.body.classList.add('cinema'); controls.autoRotate = !reduceMotion; closePop(); };
$('#exit-cinema').onclick = () => { document.body.classList.remove('cinema'); controls.autoRotate = false; };
addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') step(1);
  else if (e.key === 'ArrowLeft') step(-1);
  else if (e.key === 'Escape') { closePop(); document.body.classList.remove('cinema'); if (document.body.classList.contains('photo')) setPhoto(false); }
});
addEventListener('hashchange', () => { const id = location.hash.slice(1); if (id !== current && bodies[id]) select(id); });

// pontos de interesse
let popKey = null;
spotsEl.addEventListener('click', e => {
  const b = e.target.closest('.spot'); if (!b) return;
  e.stopPropagation();
  if (popKey === b.dataset.k) return closePop();
  popKey = b.dataset.k;
  const [t, txt] = CONTENT[current].spots[popKey];
  $('#pop-t').textContent = t; $('#pop-x').textContent = txt;
  pop.hidden = false;
  placePop(b);
});
$('#pop-close').onclick = closePop;
canvas.addEventListener('pointerdown', () => { closePop(); lastInteract = performance.now(); controls.autoRotate = document.body.classList.contains('cinema') && !reduceMotion; $('#hint').classList.add('gone'); });
canvas.addEventListener('wheel', () => { lastInteract = performance.now(); $('#hint').classList.add('gone'); }, { passive: true });
function closePop() { pop.hidden = true; popKey = null; }
function placePop(btn) {
  if (innerWidth < 760) { pop.style.transform = ''; return; }
  const r = btn.getBoundingClientRect(), w = pop.offsetWidth, h = pop.offsetHeight;
  const x = clamp(r.left, 12, innerWidth - w - 12), y = r.bottom + h + 16 > innerHeight - 110 ? r.top - h - 10 : r.bottom + 10;
  pop.style.transform = `translate(${x}px,${y}px)`;
}

// som ambiente gerado na hora
let audio = null;
$('#sound').onclick = () => {
  if (!audio) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
    const buf = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate), d = buf.getChannelData(0);
    let last = 0; for (let i = 0; i < d.length; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = last * 3.2; }
    const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 320;
    const ng = ctx.createGain(); ng.gain.value = 0.5;
    src.connect(lp); lp.connect(ng); ng.connect(master); src.start();
    [55, 82.41, 110, 164.81].forEach((f, i) => {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f; o.detune.value = rand(-6, 6);
      const gg = ctx.createGain(); gg.gain.value = 0.06 / (i + 1);
      const lfo = ctx.createOscillator(); lfo.frequency.value = 0.04 + i * 0.025;
      const lg = ctx.createGain(); lg.gain.value = 0.045 / (i + 1);
      lfo.connect(lg); lg.connect(gg.gain); o.connect(gg); gg.connect(master); o.start(); lfo.start();
    });
    audio = { ctx, master, on: false };
  }
  audio.on = !audio.on; audio.ctx.resume();
  audio.master.gain.setTargetAtTime(audio.on ? 0.55 : 0, audio.ctx.currentTime, 0.8);
  $('#sound').setAttribute('aria-pressed', audio.on);
};


// ---------------------------------------------------------------- modo foto
const RATIOS = { '16:9': [3840, 2160], '9:16': [2160, 3840], '21:9': [5040, 2160] };
let ratio = innerWidth >= innerHeight ? '16:9' : '9:16', photoPaused = false, shooting = false;
const frameEl = $('#frame'), phStatus = $('#ph-status'), shotBtn = $('#ph-shot');
const gl = renderer.getContext();
const maxDim = Math.min(renderer.capabilities.maxTextureSize, gl.getParameter(gl.MAX_RENDERBUFFER_SIZE), ...gl.getParameter(gl.MAX_VIEWPORT_DIMS));
function outSize() {
  let [w, h] = RATIOS[ratio];
  const k = Math.min(1, maxDim / Math.max(w, h));
  return [Math.floor(w * k / 2) * 2, Math.floor(h * k / 2) * 2];
}
function guideRect() {
  const [w, h] = outSize(), a = w / h, small = innerWidth < 760;
  const mx = small ? 12 : 48, top = small ? 56 : 64, bottom = small ? 170 : 120;
  const aw = innerWidth - mx * 2, ah = innerHeight - top - bottom;
  let gw = aw, gh = gw / a; if (gh > ah) { gh = ah; gw = gh * a; }
  return { x: (innerWidth - gw) / 2, y: top + (ah - gh) / 2, w: gw, h: gh };
}
function layoutPhoto() {
  const g = guideRect();
  Object.assign(frameEl.style, { width: g.w + 'px', height: g.h + 'px', transform: `translate(${g.x}px,${g.y}px)` });
  document.querySelectorAll('.ratio').forEach(b => {
    b.setAttribute('aria-checked', b.dataset.r === ratio);
    if (b.dataset.r === ratio) { const [w, h] = outSize(); b.querySelector('small').textContent = `${w}×${h}`; }
  });
}
function setPhoto(on) {
  document.body.classList.toggle('photo', on);
  closePop(); controls.autoRotate = false; lastInteract = performance.now();
  if (on) layoutPhoto();
  else if (photoPaused) $('#ph-pause').click();
}
$('#photo-btn').onclick = () => setPhoto(true);
$('#ph-exit').onclick = () => setPhoto(false);
document.querySelectorAll('.ratio').forEach(b => b.onclick = () => { ratio = b.dataset.r; layoutPhoto(); });
$('#ph-pause').onclick = e => { photoPaused = !photoPaused; e.currentTarget.setAttribute('aria-pressed', photoPaused); };
shotBtn.onclick = shoot;

async function shoot() {
  if (shooting) return;
  shooting = true; shotBtn.disabled = true; phStatus.textContent = T('photoWorking');
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  const [W, H] = outSize(), g = guideRect();
  let blob = null;
  try {
    renderer.setPixelRatio(1); renderer.setSize(W, H, false);
    composer.setPixelRatio(1); composer.setSize(W, H);
    camera.aspect = innerWidth / innerHeight;
    camera.setViewOffset(innerWidth, innerHeight, g.x, g.y, g.w, g.h);
    camera.updateProjectionMatrix();
    uPx.value = (innerHeight / 900) * (H / g.h);
    sky.position.copy(camera.position);
    composer.render();
    const p = new Promise(r => renderer.domElement.toBlob(r, 'image/jpeg', 0.95));
    camera.clearViewOffset(); resize();
    blob = await p;
  } catch (err) { camera.clearViewOffset(); resize(); }
  shooting = false; shotBtn.disabled = false;
  if (!blob) { phStatus.textContent = T('photoFail'); setTimeout(() => phStatus.textContent = '', 3500); return; }
  document.body.classList.remove('flash'); void document.body.offsetWidth; document.body.classList.add('flash');
  const name = `horizonte-${current}-${W}x${H}.jpg`;
  const file = new File([blob], name, { type: 'image/jpeg' });
  let done = false;
  if (isMobile && navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file], title: 'Horizonte' }); done = true; } catch (e) { done = e.name === 'AbortError'; }
  }
  if (!done) {
    const url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }
  phStatus.textContent = T('photoSaved') + ` ${W}×${H}`;
  setTimeout(() => phStatus.textContent = '', 3000);
}

// ---------------------------------------------------------------- loop
const camBasis = { up: V(), right: V(), toCam: V() };
const proj = V(), seg = V(), oc = V();
function occluded(p, list) {
  seg.copy(p).sub(camera.position); const L = seg.length(); seg.divideScalar(L);
  for (const [c, r] of list) {
    oc.copy(c).sub(camera.position);
    const t = oc.dot(seg); if (t < 0 || t > L - r * 0.05) continue;
    if (oc.lengthSq() - t * t < r * r * 0.98) return true;
  }
  return false;
}

function updateSpots() {
  const b = bodies[current]; if (!b) return;
  const els = spotsEl.children; let i = 0;
  for (const k in b.spots) {
    const el = els[i++]; if (!el) break;
    const p = b.spots[k](camBasis);
    proj.copy(p).project(camera);
    const hidden = flight || proj.z > 1 || Math.abs(proj.x) > 1.05 || Math.abs(proj.y) > 1.05 || occluded(p, b.occluders);
    el.classList.toggle('hide', !!hidden);
    if (!hidden) el.style.transform = `translate(${(proj.x * 0.5 + 0.5) * innerWidth}px,${(-proj.y * 0.5 + 0.5) * innerHeight}px)`;
  }
  if (popKey && !pop.hidden && innerWidth >= 760) { const btn = spotsEl.querySelector(`[data-k="${popKey}"]`); if (btn && !btn.classList.contains('hide')) placePop(btn); }
}

let frames = 0, fpsT = performance.now(), started = false;
const clock = new THREE.Clock();
function frame(now) {
  requestAnimationFrame(frame);
  if (document.hidden) return;
  const dt = Math.min(clock.getDelta(), 0.1);
  if (!reduceMotion && !photoPaused) uTime.value += dt;
  const t = uTime.value;

  if (flight) {
    const k = clamp((now - flight.t0) / flight.dur, 0, 1), e = easeIO(k);
    const a = flight.startPos, m = flight.mid, z = flight.endPos, u = 1 - e;
    camera.position.set(u * u * a.x + 2 * u * e * m.x + e * e * z.x, u * u * a.y + 2 * u * e * m.y + e * e * z.y, u * u * a.z + 2 * u * e * m.z + e * e * z.z);
    controls.target.copy(flight.st).lerp(flight.et, easeIO(clamp(k * 1.35, 0, 1)));
    camera.fov = 50 + Math.sin(Math.PI * e) * 16; camera.updateProjectionMatrix();
    camera.lookAt(controls.target);
    if (k >= 1) finishFlight(flight.b);
  } else if (controls.enabled) {
    if (!controls.autoRotate && !reduceMotion && !document.body.classList.contains('photo') && now - lastInteract > 9000) controls.autoRotate = true;
    controls.update();
  }

  camera.updateMatrixWorld();
  camBasis.right.setFromMatrixColumn(camera.matrixWorld, 0);
  camBasis.up.setFromMatrixColumn(camera.matrixWorld, 1);
  if (current) camBasis.toCam.copy(camera.position).sub(bodies[current].center).normalize();
  for (const id in bodies) bodies[id].update?.(t, camBasis);
  sky.position.copy(camera.position);

  composer.render();
  updateSpots();

  if (!started) { started = true; document.body.classList.add('ready'); }
  frames++;
  if (now - fpsT > 2500) {
    const fps = frames * 1000 / (now - fpsT); frames = 0; fpsT = now;
    if (fps < 32 && pixelRatio > 0.7) { pixelRatio = Math.max(0.7, pixelRatio * 0.8); resize(); }
  }
}

function resize() {
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(innerWidth, innerHeight);
  composer.setPixelRatio(pixelRatio);
  composer.setSize(innerWidth, innerHeight);
  uPx.value = pixelRatio * (innerHeight / 900);
  if (document.body.classList.contains('photo')) layoutPhoto();
}
addEventListener('resize', resize);

// ---------------------------------------------------------------- início
camera.lookAt(0, 0, 0);
requestAnimationFrame(frame);
const startId = bodies[location.hash.slice(1)] ? location.hash.slice(1) : 'buraco-negro';
$('#start').onclick = () => {
  document.body.classList.add('started');
  select(startId);
};
window.__select = select;
