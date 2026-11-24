export const UI = {
  pt: {
    title: 'Horizon — buracos negros e outros abismos do cosmos',
    desc: 'Explore em 3D um buraco negro, um pulsar, Betelgeuse, uma anã branca, um berçário estelar e uma galáxia espiral. Descubra como funcionam e tire fotos em 4K.',
    kicker: 'Uma viagem pelos objetos mais extremos do Universo',
    lead: 'Chegue perto de um buraco negro, veja a luz se curvar, atravesse o feixe de um pulsar e descubra como funcionam os corpos celestes mais intrigantes que conhecemos.',
    start: 'Iniciar viagem',
    controlsHint: 'Arraste para girar · role ou faça pinça para aproximar · melhor com fones',
    tabHow: 'Como funciona', tabNumbers: 'Números', tabFacts: 'Curiosidades',
    more: 'Saiba mais',
    note: 'Cena artística, fora de escala. Valores aproximados: as estimativas variam entre estudos.',
    hint: 'Toque nos pontos brilhantes para saber mais',
    sound: 'Som ambiente', photo: 'Modo foto', cinema: 'Modo contemplação', info: 'Mostrar ou ocultar informações',
    prev: 'Anterior', next: 'Próximo', exitCinema: 'Sair do modo contemplação', close: 'Fechar', lang: 'Idioma',
    pause: 'Pausar movimento', exit: 'Sair', shot: 'Salvar imagem em alta resolução',
    photoWorking: 'Gerando imagem em alta resolução…', photoSaved: 'Imagem salva:', photoFail: 'Não foi possível gerar a imagem neste dispositivo.', photoReady: 'Imagem pronta:', saveImage: 'Salvar imagem'
  },
  en: {
    title: 'Horizon — black holes and other cosmic abysses',
    desc: 'Explore a black hole, a pulsar, Betelgeuse, a white dwarf, a stellar nursery and a spiral galaxy in 3D. Learn how they work and take 4K photos.',
    kicker: 'A journey through the most extreme objects in the Universe',
    lead: 'Get close to a black hole, watch light bend, cross the beam of a pulsar and discover how the most intriguing celestial bodies we know actually work.',
    start: 'Start the journey',
    controlsHint: 'Drag to rotate · scroll or pinch to zoom · best with headphones',
    tabHow: 'How it works', tabNumbers: 'Numbers', tabFacts: 'Did you know',
    more: 'Learn more',
    note: 'Artistic scene, not to scale. Approximate values: estimates vary between studies.',
    hint: 'Tap the glowing points to learn more',
    sound: 'Ambient sound', photo: 'Photo mode', cinema: 'Contemplation mode', info: 'Show or hide information',
    prev: 'Previous', next: 'Next', exitCinema: 'Exit contemplation mode', close: 'Close', lang: 'Language',
    pause: 'Pause motion', exit: 'Exit', shot: 'Save high-resolution image',
    photoWorking: 'Rendering high-resolution image…', photoSaved: 'Image saved:', photoFail: 'Could not render the image on this device.', photoReady: 'Image ready:', saveImage: 'Save image'
  },
  es: {
    title: 'Horizon — agujeros negros y otros abismos del cosmos',
    desc: 'Explora en 3D un agujero negro, un púlsar, Betelgeuse, una enana blanca, una guardería estelar y una galaxia espiral. Descubre cómo funcionan y toma fotos en 4K.',
    kicker: 'Un viaje por los objetos más extremos del Universo',
    lead: 'Acércate a un agujero negro, mira cómo se curva la luz, atraviesa el haz de un púlsar y descubre cómo funcionan los cuerpos celestes más intrigantes que conocemos.',
    start: 'Iniciar el viaje',
    controlsHint: 'Arrastra para girar · desplaza o pellizca para acercar · mejor con auriculares',
    tabHow: 'Cómo funciona', tabNumbers: 'Números', tabFacts: 'Curiosidades',
    more: 'Saber más',
    note: 'Escena artística, fuera de escala. Valores aproximados: las estimaciones varían entre estudios.',
    hint: 'Toca los puntos brillantes para saber más',
    sound: 'Sonido ambiente', photo: 'Modo foto', cinema: 'Modo contemplación', info: 'Mostrar u ocultar información',
    prev: 'Anterior', next: 'Siguiente', exitCinema: 'Salir del modo contemplación', close: 'Cerrar', lang: 'Idioma',
    pause: 'Pausar movimiento', exit: 'Salir', shot: 'Guardar imagen en alta resolución',
    photoWorking: 'Generando imagen en alta resolución…', photoSaved: 'Imagen guardada:', photoFail: 'No se pudo generar la imagen en este dispositivo.', photoReady: 'Imagen lista:', saveImage: 'Guardar imagen'
  }
};

export const LANG_NAMES = { pt: 'Português', en: 'English', es: 'Español' };

export function detectLang() {
  const q = new URLSearchParams(location.search).get('lang');
  if (q && UI[q]) return q;
  try { const s = localStorage.getItem('horizon-lang'); if (s && UI[s]) return s; } catch (e) {}
  const n = (navigator.languages?.[0] || navigator.language || 'pt').slice(0, 2).toLowerCase();
  return UI[n] ? n : 'en';
}
