// Contenido en español. Valores aproximados: las estimaciones varían entre estudios.
export const CONTENT_ES = {
  'buraco-negro': {
    name: 'Agujero negro',
    type: 'Colapso gravitacional',
    intro: 'Una región donde la gravedad es tan intensa que nada, ni siquiera la luz, puede escapar después de cruzar el horizonte de sucesos.',
    how: [
      'Cuando una estrella con decenas de veces la masa del Sol agota su combustible, el núcleo deja de resistir su propia gravedad y colapsa. Si la masa es suficientemente grande, ninguna fuerza conocida detiene la caída.',
      'El límite sin retorno se llama <b>horizonte de sucesos</b>. No es una superficie física: es la frontera a partir de la cual escapar exigiría ir más rápido que la luz.',
      'El gas que cae no se hunde directamente. Forma un <b>disco de acreción</b> que gira a velocidades altísimas y se calienta por fricción a millones de grados, brillando intensamente en rayos X.',
      'La gravedad curva la trayectoria de la luz. Por eso ves la parte trasera del disco por encima y por debajo de la sombra, como en esta escena. El lado del disco que viene hacia ti se ve más brillante y azulado: efecto Doppler relativista.'
    ],
    numbers: [
      ['Radio del horizonte', 'unos 3 km por masa solar'],
      ['Sagitario A*, centro de la Vía Láctea', 'unos 4 millones de masas solares'],
      ['M87*, el primero fotografiado', 'unos 6500 millones de masas solares'],
      ['Esfera de fotones', '1,5 × el radio del horizonte'],
      ['Órbita estable más interna', '3 × el radio del horizonte (sin rotación)']
    ],
    facts: [
      'En 2019, el Event Horizon Telescope publicó la primera imagen de un agujero negro, M87*. En 2022 llegó la de Sagitario A*, el del centro de nuestra galaxia.',
      'Los agujeros negros no "aspiran" todo a su alrededor. Si el Sol se convirtiera en un agujero negro de la misma masa, la órbita de la Tierra no cambiaría. Solo se volvería oscuro y frío.',
      'Cerca del horizonte, el tiempo pasa más despacio en comparación con un observador lejano, como predice la relatividad general.',
      'Un objeto que cayera en un agujero negro de masa estelar sería estirado por las fuerzas de marea. Los físicos lo llaman, literalmente, espaguetización.',
      'En 2015, LIGO detectó por primera vez ondas gravitacionales, producidas por la fusión de dos agujeros negros. El descubrimiento se anunció en 2016.',
      'Stephen Hawking predijo que los agujeros negros emiten una radiación débil y se evaporan muy lentamente. La teoría es aceptada, pero esa radiación nunca se ha observado.'
    ],
    spots: {
      shadow: ['Sombra', 'La región oscura es la sombra del agujero negro, unas 2,6 veces mayor que el horizonte de sucesos. Toda luz que pasa demasiado cerca queda atrapada.'],
      ring: ['Anillo de fotones', 'La luz que dio una o más vueltas alrededor del agujero negro antes de escapar forma este anillo fino y brillante.'],
      disk: ['Disco de acreción', 'Gas en órbita, calentado a millones de grados. En el borde interno alcanza cerca de la mitad de la velocidad de la luz.'],
      lens: ['Lente gravitacional', 'Esta franja superior es la parte trasera del disco. Su luz fue curvada por la gravedad y pasó por encima del agujero negro hasta llegar a ti.'],
      doppler: ['Lado que se acerca', 'El gas de este lado viene hacia ti. El efecto Doppler relativista lo vuelve más brillante y azulado; el lado opuesto se ve más tenue y rojizo.']
    }
  },
  'pulsar': {
    name: 'Púlsar',
    type: 'Estrella de neutrones',
    intro: 'El núcleo aplastado de una estrella que explotó como supernova: más masa que el Sol comprimida en una esfera del tamaño de una ciudad, girando como un faro.',
    how: [
      'Cuando una estrella masiva explota, su núcleo colapsa con tanta fuerza que protones y electrones se fusionan en neutrones. El resultado es uno de los objetos más densos del Universo.',
      'Al encogerse, la estrella gira mucho más rápido, como una patinadora que cierra los brazos. Algunos púlsares giran cientos de veces por segundo.',
      'El intenso campo magnético acelera partículas que emiten haces de radiación por los polos magnéticos. Como el eje magnético está inclinado respecto al de rotación, los haces barren el espacio.',
      'Si un haz cruza la Tierra, recibimos pulsos regulares, como la luz de un faro. En esta escena la rotación se ha ralentizado para que los haces sean visibles.'
    ],
    numbers: [
      ['Diámetro', 'unos 20 km'],
      ['Masa típica', 'entre 1,4 y 2 masas solares, aproximadamente'],
      ['Una cucharadita del material', 'del orden de miles de millones de toneladas'],
      ['El más rápido conocido', 'PSR J1748−2446ad, unas 716 vueltas por segundo'],
      ['Púlsar del Cangrejo', 'unas 30 vueltas por segundo']
    ],
    facts: [
      'El primer púlsar fue descubierto en 1967 por Jocelyn Bell Burnell. Los pulsos eran tan regulares que la señal recibió el apodo provisional de LGM-1, "little green men".',
      'Los magnetares son estrellas de neutrones con campos magnéticos cientos o miles de veces más fuertes que los de los púlsares comunes.',
      'En 2017, la colisión de dos estrellas de neutrones se detectó a la vez mediante ondas gravitacionales y con telescopios. Eventos así fabrican elementos pesados como el oro y el platino.',
      'La gravedad en la superficie es tan fuerte que, según las estimaciones, las "montañas" más altas medirían como mucho unos pocos milímetros.',
      'Algunos púlsares son tan estables que rivalizan con los relojes atómicos y se usan para intentar detectar ondas gravitacionales de muy baja frecuencia.'
    ],
    spots: {
      star: ['Estrella de neutrones', 'Unos 20 km de diámetro, con más masa que todo el Sol.'],
      beam: ['Haz de radiación', 'Partículas aceleradas por el campo magnético emiten radiación concentrada en los polos magnéticos.'],
      axis: ['Eje de rotación', 'El eje de rotación no coincide con el magnético. Esa inclinación hace que los haces giren como un faro.'],
      field: ['Campo magnético', 'Se estima en cerca de un billón de veces el campo de la Tierra en un púlsar típico.']
    }
  },
  'betelgeuse': {
    name: 'Betelgeuse',
    type: 'Supergigante roja',
    intro: 'Una de las estrellas más grandes visibles a simple vista, en el hombro de la constelación de Orión. Está en las etapas finales de su vida.',
    how: [
      'Las estrellas masivas, al agotar el hidrógeno del núcleo, empiezan a quemar elementos más pesados y se hinchan enormemente. Las capas externas se enfrían y la estrella se vuelve rojiza.',
      'La superficie está dominada por unas pocas celdas de convección gigantescas: burbujas de gas caliente que suben y bajan, haciendo variar el brillo.',
      'Pierde masa continuamente en vientos y nubes de polvo, que pueden ocultar parte de la estrella.',
      'Se espera que Betelgeuse termine como supernova, dejando una estrella de neutrones o, tal vez, un agujero negro.'
    ],
    numbers: [
      ['Radio', 'entre 700 y 1000 veces el del Sol (las estimaciones varían)'],
      ['Distancia', 'entre 550 y 700 años luz, aproximadamente'],
      ['Masa', 'entre 15 y 20 masas solares, aproximadamente'],
      ['Temperatura de la superficie', 'unos 3600 K (el Sol tiene unos 5800 K)']
    ],
    facts: [
      'Colocada en el lugar del Sol, su superficie sobrepasaría la órbita de Marte. El anillo de esta escena muestra la órbita de Júpiter a la misma escala.',
      'Entre 2019 y 2020 se oscureció visiblemente en el cielo: el "Gran Oscurecimiento". Los estudios lo atribuyeron a una nube de polvo expulsada por la estrella y a una zona más fría en su superficie.',
      'Cuando explote, probablemente en los próximos cien mil años, podría verse incluso de día durante semanas. Está lo bastante lejos como para no suponer peligro para la Tierra.',
      'En 2025, astrónomos informaron de indicios de una pequeña estrella compañera en órbita de Betelgeuse. La confirmación aún depende de nuevas observaciones.'
    ],
    spots: {
      cells: ['Celdas de convección', 'Burbujas de gas caliente del tamaño de planetas gigantes, o mayores, suben y bajan, cambiando el brillo de la estrella.'],
      dust: ['Nube de polvo', 'Material expulsado por la estrella. Una nube así contribuyó al Gran Oscurecimiento de 2019–2020.'],
      jupiter: ['Órbita de Júpiter', 'A la misma escala. Si Betelgeuse estuviera en el lugar del Sol, Mercurio, Venus, la Tierra y Marte quedarían dentro de ella.'],
      glow: ['Atmósfera extendida', 'Capas externas tenues y frías se extienden mucho más allá de la superficie visible.']
    }
  },
  'ana-branca': {
    name: 'Enana blanca',
    type: 'Remanente estelar',
    intro: 'Lo que queda de estrellas como el Sol: un núcleo con una masa comparable a la del Sol, pero del tamaño de la Tierra.',
    how: [
      'Al final de su vida, las estrellas de masa baja o media expulsan sus capas externas, que forman una nebulosa planetaria. El núcleo caliente queda expuesto.',
      'Allí ya no hay fusión nuclear. La enana blanca brilla solo por el calor residual y se va enfriando durante miles de millones de años.',
      'No colapsa gracias a un efecto cuántico: los electrones, comprimidos al máximo, se resisten a comprimirse más. Es la presión de degeneración.',
      'Si una enana blanca gana masa de una estrella vecina y supera unas 1,4 masas solares, el límite de Chandrasekhar, puede explotar como supernova de tipo Ia.'
    ],
    numbers: [
      ['Tamaño', 'parecido al de la Tierra'],
      ['Masa típica', 'unas 0,6 masas solares'],
      ['Una cucharadita del material', 'algunas toneladas'],
      ['Temperatura de la superficie', 'de más de 100 000 K, cuando es joven, a unos pocos miles de K'],
      ['La más cercana conocida', 'Sirio B, a unos 8,6 años luz']
    ],
    facts: [
      'El Sol se convertirá en una enana blanca dentro de algunos miles de millones de años, tras pasar por la fase de gigante roja.',
      'Al enfriarse, el interior de una enana blanca cristaliza. Datos del satélite Gaia, publicados en 2019, aportaron pruebas de este proceso.',
      'Las enanas negras, completamente frías, probablemente aún no existen: el Universo es demasiado joven para que alguna se haya enfriado tanto.',
      'Las supernovas de tipo Ia, causadas por enanas blancas, sirvieron para descubrir que la expansión del Universo se está acelerando. El hallazgo recibió el Nobel de Física de 2011.'
    ],
    spots: {
      star: ['Enana blanca', 'Una masa comparable a la del Sol en un volumen parecido al de la Tierra.'],
      earth: ['La Tierra, a la misma escala', 'La comparación muestra lo comprimida que está la materia: una masa parecida a la del Sol en un globo de este tamaño.'],
      shell: ['Nebulosa planetaria', 'Las capas externas expulsadas por la estrella se dispersan y brillan iluminadas por el núcleo caliente.']
    }
  },
  'nebulosa': {
    name: 'Guardería estelar',
    type: 'Nebulosa de emisión',
    intro: 'Nubes gigantes de gas y polvo donde nacen nuevas estrellas. Esta escena está inspirada en los Pilares de la Creación.',
    how: [
      'Las regiones más densas de la nube colapsan bajo su propia gravedad. El gas se calienta hasta que comienza la fusión nuclear: nace una estrella.',
      'Las estrellas jóvenes y calientes emiten radiación ultravioleta que ioniza el gas a su alrededor y lo hace brillar. El rojo procede sobre todo del hidrógeno; el verde azulado, del oxígeno.',
      'La misma radiación erosiona la nube poco a poco. Las partes más densas resisten más tiempo y quedan como pilares esculpidos.',
      'El polvo bloquea la luz visible, pero la infrarroja lo atraviesa. Por eso los telescopios infrarrojos revelan estrellas ocultas dentro de los pilares.'
    ],
    numbers: [
      ['Pilares de la Creación', 'en la Nebulosa del Águila, a unos 6500 a 7000 años luz'],
      ['Altura del pilar mayor', 'unos 4 años luz'],
      ['Nebulosa de Orión', 'unos 1300 a 1400 años luz, visible a simple vista']
    ],
    facts: [
      'El Hubble fotografió los Pilares de la Creación en 1995. En 2022, el James Webb los registró en infrarrojo, revelando estrellas jóvenes antes ocultas por el polvo.',
      'El Sol probablemente nació en un cúmulo de estrellas dentro de una nube parecida, hace unos 4600 millones de años.',
      'A pesar del nombre, las "nebulosas planetarias" no tienen nada que ver con planetas. El término es histórico: en los telescopios antiguos parecían discos de planetas.',
      'Los colores de muchas imágenes astronómicas representan elementos químicos concretos o luz invisible convertida en colores visibles.'
    ],
    spots: {
      pillars: ['Pilares de polvo', 'Columnas densas de gas y polvo, esculpidas por la radiación de las estrellas jóvenes cercanas.'],
      stars: ['Estrellas recién nacidas', 'Estrellas jóvenes y calientes. Su radiación ilumina y, poco a poco, disipa la nube donde nacieron.'],
      gas: ['Gas ionizado', 'Hidrógeno y oxígeno energizados por la radiación ultravioleta, brillando en colores característicos.']
    }
  },
  'galaxia': {
    name: 'Galaxia espiral',
    type: 'Isla de estrellas',
    intro: 'Cientos de miles de millones de estrellas, gas y polvo girando alrededor de un agujero negro supermasivo. La Vía Láctea es una galaxia así.',
    how: [
      'Los brazos espirales no son estructuras fijas. Son ondas de densidad: las estrellas entran y salen de ellos, como coches que atraviesan un tramo de tráfico lento.',
      'En los brazos, el gas se comprime y forma estrellas jóvenes, calientes y azuladas. Por eso brillan más.',
      'El centro tiene un bulbo de estrellas más viejas y amarillentas y, en su interior, un agujero negro supermasivo.',
      'Las estrellas de la periferia giran demasiado rápido para la cantidad de materia visible. Es uno de los principales indicios de la materia oscura.'
    ],
    numbers: [
      ['Diámetro de la Vía Láctea', 'unos 100 000 años luz (algunas estimaciones son mayores)'],
      ['Estrellas en la Vía Láctea', 'entre 100 000 y 400 000 millones, aproximadamente'],
      ['Distancia del Sol al centro', 'unos 26 000 años luz'],
      ['Una vuelta del Sol a la galaxia', 'unos 230 millones de años'],
      ['Materia oscura', 'cerca del 85 % de toda la materia del Universo']
    ],
    facts: [
      'La franja de la Vía Láctea que vemos en cielos oscuros es el disco de nuestra propia galaxia, visto desde dentro.',
      'Cuando las galaxias chocan, las estrellas casi nunca colisionan: el espacio entre ellas es inmenso.',
      'Andrómeda se acerca a la Vía Láctea. Durante mucho tiempo se dio por segura una colisión en unos 4500 millones de años; un estudio de 2025 estimó en torno al 50 % la probabilidad de fusión en los próximos 10 000 millones de años.',
      'La luz de las galaxias más lejanas observadas salió de ellas hace más de 13 000 millones de años. Mirar lejos es mirar al pasado.'
    ],
    spots: {
      core: ['Agujero negro supermasivo', 'En el centro de la Vía Láctea está Sagitario A*, con unos 4 millones de masas solares.'],
      bulge: ['Bulbo central', 'Una región densa de estrellas más viejas, de tono amarillento.'],
      arm: ['Brazo espiral', 'Región donde el gas se comprime y nacen estrellas jóvenes, azuladas y brillantes.'],
      sun: ['Aquí estaría el Sol', 'Si esta fuera la Vía Láctea, el Sol estaría a poco más de la mitad del camino entre el centro y el borde.']
    }
  }
};
