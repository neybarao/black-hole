// GLSL compartilhado: ruído, céu procedural, buraco negro com lente gravitacional.

export const NOISE = /* glsl */`
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+10.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.5-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 105.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
float fbm(vec3 p){float a=0.5,s=0.0;for(int i=0;i<5;i++){s+=a*snoise(p);p*=2.03;a*=0.5;}return s;}
float fbm3(vec3 p){float a=0.5,s=0.0;for(int i=0;i<3;i++){s+=a*snoise(p);p*=2.03;a*=0.5;}return s;}
float hash13(vec3 p){p=fract(p*0.1031);p+=dot(p,p.zyx+31.32);return fract((p.x+p.y)*p.z);}
vec3 hash33(vec3 p){p=fract(p*vec3(0.1031,0.1030,0.0973));p+=dot(p,p.yxz+33.33);return fract((p.xxy+p.yxx)*p.zyx);}
`;

export const SKY = /* glsl */`
vec3 starTint(float h){
  return mix(vec3(1.0,0.72,0.5), vec3(0.7,0.82,1.0), smoothstep(0.2,0.9,h));
}
vec3 starLayer(vec3 d, float scale, float thr, float gain){
  vec3 p=d*scale;
  vec3 c=floor(p);
  vec3 f=fract(p);
  float h=hash13(c);
  if(h<thr) return vec3(0.0);
  vec3 o=hash33(c)*0.7+0.15;
  float dist=length(f-o);
  float b=pow(hash13(c+11.7),4.0)*gain+0.15*gain;
  return starTint(hash13(c+3.1))*b*exp(-dist*dist*90.0);
}
vec3 sky(vec3 d){
  vec3 n=normalize(vec3(0.35,1.0,0.25));
  float g=dot(d,n);
  vec3 core=normalize(vec3(-0.75,-0.25,-0.6));
  float toCore=max(dot(d,core),0.0);
  float band=exp(-g*g*14.0);
  float cloud=fbm(d*3.2)*0.5+0.5;
  float dust=smoothstep(0.15,0.7,fbm(d*7.5+3.0)*0.5+0.5)*exp(-g*g*90.0);
  vec3 mw=mix(vec3(0.42,0.5,0.75),vec3(1.0,0.82,0.62),pow(toCore,3.0));
  vec3 col=mw*band*cloud*(0.07+0.22*pow(toCore,4.0))*(1.0-dust*0.85);
  // nebulosidade colorida tênue
  float neb=fbm(d*1.6+7.0);
  col+=mix(vec3(0.05,0.02,0.09),vec3(0.0,0.05,0.08),smoothstep(-0.3,0.4,neb))*smoothstep(-0.1,0.6,neb)*0.5;
  // estrelas
  float dens=band*0.06;
  col+=starLayer(d,140.0,0.955-dens,3.2);
  col+=starLayer(d,380.0,0.86-dens*2.0,1.1)*(1.0-dust*0.7);
  col+=starLayer(d,900.0,0.80-dens*2.0,0.5)*band*(1.0-dust);
  return col;
}
`;

export const skyVert = /* glsl */`
varying vec3 vDir;
void main(){
  vDir=normalize(position);
  vec4 p=projectionMatrix*modelViewMatrix*vec4(position,1.0);
  gl_Position=p.xyww;
}`;
export const skyFrag = NOISE + SKY + /* glsl */`
varying vec3 vDir;
void main(){ gl_FragColor=vec4(sky(normalize(vDir)),1.0); }`;

// --------- Buraco negro (Schwarzschild, unidades: raio do horizonte = 1) ---------
export const bhVert = /* glsl */`
varying vec3 vWorld;
void main(){
  vec4 w=modelMatrix*vec4(position,1.0);
  vWorld=w.xyz;
  gl_Position=projectionMatrix*viewMatrix*w;
}`;

export const bhFrag = NOISE + SKY + /* glsl */`
uniform vec3 uCenter;
uniform float uScale;
uniform float uRadius;
uniform float uTime;
varying vec3 vWorld;

const float DISK_IN=3.0;
const float DISK_OUT=13.0;

vec3 heat(float x){
  // rampa de cor de corpo negro aproximada
  x=clamp(x,0.0,2.0);
  vec3 c=mix(vec3(0.35,0.03,0.0),vec3(1.0,0.32,0.05),smoothstep(0.0,0.35,x));
  c=mix(c,vec3(1.0,0.78,0.45),smoothstep(0.3,0.75,x));
  c=mix(c,vec3(1.0,0.97,0.9),smoothstep(0.7,1.1,x));
  c=mix(c,vec3(0.72,0.84,1.0),smoothstep(1.1,1.7,x));
  return c;
}

vec4 disk(vec3 hit, float r, vec3 dir){
  float a=atan(hit.z,hit.x);
  float omega=1.6*pow(r,-1.5);
  float ang=a+uTime*omega;
  vec3 q=vec3(cos(ang)*2.4,sin(ang)*2.4,r*1.7);
  float n=fbm(q)*0.5+0.5;
  float streak=snoise(vec3(cos(ang)*0.9,sin(ang)*0.9,r*4.0))*0.5+0.5;
  float tex=mix(n,streak,0.45);
  tex=pow(clamp(tex,0.0,1.0),1.6)*1.9;

  float prof=pow(r/DISK_IN,-0.75)*pow(max(1.0-sqrt(DISK_IN/r),0.0),0.25)*2.6;
  // Doppler relativístico + desvio gravitacional
  vec3 vdir=normalize(vec3(hit.z,0.0,-hit.x));
  float beta=sqrt(0.5/(r-1.0));
  float gamma=1.0/sqrt(1.0-beta*beta);
  float delta=1.0/(gamma*(1.0+beta*dot(vdir,dir)));
  float shift=delta*sqrt(1.0-1.0/r);
  float I=prof*pow(shift,3.0)*tex;
  vec3 col=heat(prof*0.62*shift+0.08)*I*0.8;
  float edge=smoothstep(DISK_IN,DISK_IN+0.6,r)*(1.0-smoothstep(DISK_OUT-5.0,DISK_OUT,r));
  float alpha=clamp((0.25+tex*0.9)*edge,0.0,1.0);
  return vec4(col*edge,alpha);
}

void main(){
  vec3 ro=(cameraPosition-uCenter)/uScale;
  vec3 rd=normalize(vWorld-cameraPosition);
  float R=uRadius;
  float b=dot(ro,rd);
  float c=dot(ro,ro)-R*R;
  float h=b*b-c;
  vec3 p=ro;
  if(c>0.0){
    if(h<0.0){ gl_FragColor=vec4(sky(rd),1.0); return; }
    p=ro+rd*max(-b-sqrt(h),0.0);
  }
  vec3 v=rd;
  vec3 hv=cross(p,v);
  float h2=dot(hv,hv);
  vec3 col=vec3(0.0);
  float trans=1.0;
  bool captured=false;
  for(int i=0;i<STEPS;i++){
    float r=length(p);
    float dt=clamp(STEPK*r,0.04,1.4);
    vec3 acc=-1.5*h2*p/pow(r,5.0);
    vec3 prev=p;
    v+=acc*dt;
    p+=v*dt;
    if(prev.y*p.y<0.0){
      float f=prev.y/(prev.y-p.y);
      vec3 hit=mix(prev,p,f);
      float rr=length(hit.xz);
      if(rr>DISK_IN&&rr<DISK_OUT){
        vec4 d=disk(hit,rr,normalize(v));
        col+=trans*d.rgb*d.a;
        trans*=1.0-d.a;
      }
    }
    float rn=length(p);
    if(rn<1.0){captured=true;break;}
    if(rn>R&&dot(p,v)>0.0)break;
    if(trans<0.02)break;
  }
  if(!captured) col+=trans*sky(normalize(v));
  gl_FragColor=vec4(col,1.0);
}`;

// --------- Partículas suaves ---------
export const pointsVert = /* glsl */`
attribute float size;
attribute vec3 color;
attribute float seed;
uniform float uTime;
uniform float uPx;
uniform float uSpin;
uniform float uMax;
varying vec3 vColor;
varying float vTw;
void main(){
  vec3 pos=position;
  if(uSpin>0.0){
    float r=length(pos.xz);
    float a=-uTime*uSpin*18.0/(r+25.0);
    float cs=cos(a), sn=sin(a);
    pos.xz=mat2(cs,-sn,sn,cs)*pos.xz;
  }
  vec4 mv=modelViewMatrix*vec4(pos,1.0);
  gl_PointSize=clamp(min(size*uPx*(300.0/-mv.z),uMax*uPx),0.0,256.0);
  vColor=color;
  vTw=0.75+0.25*sin(uTime*(0.6+seed*2.0)+seed*40.0);
  gl_Position=projectionMatrix*mv;
}`;
export const pointsFrag = /* glsl */`
uniform float uAlpha;
uniform float uSharp;
varying vec3 vColor;
varying float vTw;
void main(){
  vec2 c=gl_PointCoord-0.5;
  float d=dot(c,c);
  float a=exp(-d*uSharp);
  if(a<0.01) discard;
  gl_FragColor=vec4(vColor*vTw*a, a*uAlpha);
}`;

// --------- Estrela com superfície turbulenta (Betelgeuse / anã branca / pulsar) ---------
export const starVert = /* glsl */`
varying vec3 vPos;
varying vec3 vN;
varying vec3 vW;
void main(){
  vPos=position;
  vN=normalize(mat3(modelMatrix)*normal);
  vec4 w=modelMatrix*vec4(position,1.0);
  vW=w.xyz;
  gl_Position=projectionMatrix*viewMatrix*w;
}`;
export const starFrag = NOISE + /* glsl */`
uniform float uTime;
uniform vec3 uC1;
uniform vec3 uC2;
uniform vec3 uC3;
uniform float uScaleN;
uniform float uGain;
uniform float uLimb;
varying vec3 vPos;
varying vec3 vN;
varying vec3 vW;
void main(){
  vec3 d=normalize(vPos);
  float t=uTime;
  vec3 warp=vec3(fbm3(d*1.5+t*0.015),fbm3(d*1.5+5.0-t*0.012),fbm3(d*1.5+9.0))*0.6;
  float big=fbm(d*uScaleN+warp+t*0.01);
  float fine=fbm3(d*uScaleN*4.0-t*0.03);
  float cells=1.0-abs(snoise(d*uScaleN*1.6+warp*2.0+t*0.02));
  float x=clamp(0.5+big*0.8+fine*0.25+cells*0.25,0.0,1.4);
  vec3 col=mix(uC1,uC2,smoothstep(0.2,0.75,x));
  col=mix(col,uC3,smoothstep(0.8,1.25,x));
  vec3 V=normalize(cameraPosition-vW);
  float mu=clamp(dot(normalize(vN),V),0.0,1.0);
  float limb=pow(mu,uLimb);
  col*=mix(0.25,1.0,limb);
  col+=uC2*pow(1.0-mu,3.0)*0.6;
  gl_FragColor=vec4(col*uGain,1.0);
}`;

// --------- Brilho volumétrico ao redor de esferas ---------
export const glowVert = /* glsl */`
varying vec3 vW;
void main(){
  vec4 w=modelMatrix*vec4(position,1.0);
  vW=w.xyz;
  gl_Position=projectionMatrix*viewMatrix*w;
}`;
export const glowFrag = /* glsl */`
uniform vec3 uCenter;
uniform float uR;
uniform float uW;
uniform vec3 uColor;
uniform float uPow;
varying vec3 vW;
void main(){
  vec3 rd=normalize(vW-cameraPosition);
  vec3 oc=uCenter-cameraPosition;
  float t=dot(oc,rd);
  float d=length(oc-rd*t);
  float x=max(d-uR,0.0)/uW;
  float g=pow(clamp(1.0-x,0.0,1.0),uPow);
  if(t<0.0) g=0.0;
  gl_FragColor=vec4(uColor*g,1.0);
}`;

// --------- Feixe do pulsar ---------
export const beamVert = /* glsl */`
varying vec2 vUv;
varying vec3 vN;
varying vec3 vW;
void main(){
  vUv=uv;
  vN=normalize(mat3(modelMatrix)*normal);
  vec4 w=modelMatrix*vec4(position,1.0);
  vW=w.xyz;
  gl_Position=projectionMatrix*viewMatrix*w;
}`;
export const beamFrag = NOISE + /* glsl */`
uniform float uTime;
uniform vec3 uColor;
uniform float uSoft;
varying vec2 vUv;
varying vec3 vN;
varying vec3 vW;
void main(){
  vec3 V=normalize(cameraPosition-vW);
  float facing=abs(dot(normalize(vN),V));
  float along=vUv.y; // 1 = ponta próxima à estrela
  float fade=pow(along,1.8)*smoothstep(1.0,0.97,along);
  // pulsos de partículas viajando para fora ao longo do feixe
  float pulse=clamp(snoise(vec3(along*16.0+uTime*3.5,0.0,0.0))*0.5+0.5,0.0,1.0);
  float fil=clamp(snoise(vec3(along*3.0,vW.x*0.05,vW.z*0.05))*0.5+0.5,0.0,1.0);
  float a=pow(facing,uSoft)*fade*(0.45+0.4*pulse+0.15*fil);
  gl_FragColor=vec4(max(uColor*a,vec3(0.0)),1.0);
}`;

// remove pixels inválidos (NaN/negativos) antes do bloom, que os espalharia em cruz
export const sanitizeShader = {
  uniforms: { tDiffuse: { value: null } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
  fragmentShader: 'uniform sampler2D tDiffuse; varying vec2 vUv; void main(){ vec4 c=texture2D(tDiffuse,vUv); if(any(isnan(c))||any(isinf(c))) c=vec4(0.0,0.0,0.0,1.0); gl_FragColor=vec4(clamp(c.rgb,0.0,60.0),1.0); }'
};

// --------- Linhas de campo ---------
export const lineVert = /* glsl */`
attribute float prog;
varying float vP;
void main(){ vP=prog; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`;
export const lineFrag = /* glsl */`
uniform float uTime;
uniform vec3 uColor;
varying float vP;
void main(){
  float pulse=pow(fract(vP*3.0-uTime*0.6),8.0);
  float a=0.22+pulse*1.2;
  gl_FragColor=vec4(uColor*a,1.0);
}`;

// --------- Terra procedural ---------
export const earthFrag = NOISE + /* glsl */`
uniform float uTime;
uniform vec3 uLight;
varying vec3 vPos;
varying vec3 vN;
varying vec3 vW;
void main(){
  vec3 d=normalize(vPos);
  float land=fbm(d*2.2+1.7);
  float lat=abs(d.y);
  vec3 ocean=mix(vec3(0.01,0.05,0.16),vec3(0.02,0.12,0.3),smoothstep(-0.4,0.0,land));
  vec3 ground=mix(vec3(0.08,0.2,0.06),vec3(0.42,0.33,0.18),smoothstep(0.1,0.35,land));
  vec3 col=land>0.03?ground:ocean;
  col=mix(col,vec3(0.9),smoothstep(0.78,0.86,lat));
  float cl=smoothstep(0.1,0.5,fbm(d*3.5+vec3(uTime*0.01,0.0,0.0)));
  col=mix(col,vec3(0.95),cl*0.75);
  vec3 N=normalize(vN);
  vec3 L=normalize(uLight-vW);
  float diff=clamp(dot(N,L),0.0,1.0);
  vec3 V=normalize(cameraPosition-vW);
  float rim=pow(1.0-clamp(dot(N,V),0.0,1.0),3.0);
  vec3 outc=col*(0.03+diff*1.15)+vec3(0.3,0.55,1.0)*rim*(0.25+diff*0.9);
  gl_FragColor=vec4(outc,1.0);
}`;

// --------- Nebulosa volumétrica (emissão + absorção, pilares de poeira) ---------
export const nebulaFrag = NOISE + /* glsl */`
uniform vec3 uCenter;
uniform float uR;
uniform float uTime;
uniform float uSteps;
varying vec3 vWorld;

float capsule(vec3 p, vec3 a, vec3 b, float ra, float rb){
  vec3 ba=b-a; float h=clamp(dot(p-a,ba)/dot(ba,ba),0.0,1.0);
  return length(p-a-ba*h)-mix(ra,rb,h);
}
float pillars(vec3 p){
  vec3 q=p; q.x-=sin((p.y+95.0)*0.022)*6.0;
  float d=capsule(q,vec3(-45.0,-120.0,0.0),vec3(-30.0,42.0,8.0),21.0,9.0);
  d=min(d,capsule(q,vec3(18.0,-120.0,-12.0),vec3(12.0,2.0,-6.0),15.0,7.0));
  d=min(d,capsule(q,vec3(62.0,-120.0,6.0),vec3(55.0,-32.0,2.0),11.0,5.5));
  return d+snoise(p*0.07)*4.5+snoise(p*0.18)*1.6;
}
void main(){
  vec3 ro=cameraPosition-uCenter;
  vec3 rd=normalize(vWorld-cameraPosition);
  float b=dot(ro,rd), c=dot(ro,ro)-uR*uR, h=b*b-c;
  if(h<0.0) discard;
  h=sqrt(h);
  float t0=max(-b-h,0.0), t1=-b+h;
  if(t1<=0.0) discard;
  float dt=(t1-t0)/uSteps;
  float t=t0+dt*hash13(vec3(gl_FragCoord.xy,1.0));
  vec3 col=vec3(0.0); float trans=1.0;
  for(int i=0;i<128;i++){
    if(float(i)>=uSteps||trans<0.02) break;
    vec3 p=ro+rd*t;
    float n=fbm3(p*0.011+vec3(0.0,uTime*0.004,0.0))*0.5+0.5;
    float r=length(p*vec3(1.0,1.3,1.5))/uR+(0.5-n)*0.45;
    float fall=smoothstep(0.95,0.3,r);
    if(fall>0.0){
      float det=snoise(p*0.045)*0.5+0.5;
      float gas=pow(max(n*0.9+det*0.32-0.55,0.0),1.3)*fall;
      float m=snoise(p*0.0075+3.0)*0.5+0.5;
      vec3 ec=mix(vec3(0.02,0.5,0.6),vec3(0.95,0.16,0.24),smoothstep(0.3,0.75,m));
      ec=mix(ec,vec3(1.0,0.6,0.18),smoothstep(0.55,0.95,snoise(p*0.012+9.0)*0.5+0.5)*0.75);
      float pd=pillars(p);
      float dust=smoothstep(1.0,-2.0,pd);
      // frente de ionização: borda dos pilares iluminada pelas estrelas jovens
      float rim=exp(-max(pd,0.0)*0.5)*(1.0-dust)*smoothstep(-110.0,40.0,p.y);
      vec3 emit=ec*gas*0.075+vec3(1.0,0.55,0.25)*rim*0.07;
      col+=trans*emit*dt;
      trans*=exp(-(dust*0.6+gas*0.012)*dt);
    }
    t+=dt;
  }
  gl_FragColor=vec4(col,1.0-trans);
}`;
