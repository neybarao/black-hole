// Textos educativos. Valores aproximados: estimativas variam entre estudos.
export const CONTENT = {
  'buraco-negro': {
    name: 'Buraco negro',
    type: 'Colapso gravitacional',
    intro: 'Uma região onde a gravidade é tão intensa que nada, nem a luz, consegue escapar depois de cruzar o horizonte de eventos.',
    how: [
      'Quando uma estrela com dezenas de vezes a massa do Sol esgota seu combustível, o núcleo deixa de resistir à própria gravidade e colapsa. Se a massa for grande o bastante, nenhuma força conhecida interrompe a queda.',
      'O limite sem volta se chama <b>horizonte de eventos</b>. Ele não é uma superfície física: é a fronteira a partir da qual a velocidade necessária para escapar seria maior que a da luz.',
      'O gás que cai não mergulha direto. Ele forma um <b>disco de acreção</b>, girando a velocidades altíssimas e aquecido a milhões de graus pelo atrito, brilhando intensamente em raios X.',
      'A gravidade curva a trajetória da luz. Por isso você enxerga a parte de trás do disco por cima e por baixo da sombra, como nesta cena. O lado do disco que vem em sua direção parece mais brilhante e azulado, efeito Doppler relativístico.'
    ],
    numbers: [
      ['Raio do horizonte', 'cerca de 3 km por massa solar'],
      ['Sagitário A*, centro da Via Láctea', 'cerca de 4 milhões de massas solares'],
      ['M87*, primeiro fotografado', 'cerca de 6,5 bilhões de massas solares'],
      ['Esfera de fótons', '1,5 × o raio do horizonte'],
      ['Órbita estável mais interna', '3 × o raio do horizonte (sem rotação)']
    ],
    facts: [
      'Em 2019, o Event Horizon Telescope divulgou a primeira imagem de um buraco negro, o M87*. Em 2022, veio a imagem de Sagitário A*, o do centro da nossa galáxia.',
      'Buracos negros não "sugam" tudo ao redor. Se o Sol virasse um buraco negro com a mesma massa, a órbita da Terra não mudaria. Só ficaria escuro e frio.',
      'Perto do horizonte o tempo passa mais devagar em relação a quem observa de longe, uma previsão da relatividade geral.',
      'Um objeto caindo num buraco negro de massa estelar seria esticado pelas forças de maré. Os físicos chamam isso, literalmente, de espaguetificação.',
      'Em 2015, o LIGO detectou pela primeira vez ondas gravitacionais, vindas da fusão de dois buracos negros. A descoberta foi anunciada em 2016.',
      'Stephen Hawking previu que buracos negros emitem uma radiação fraca e evaporam muito lentamente. A teoria é aceita, mas essa radiação nunca foi observada.'
    ],
    spots: {
      shadow: ['Sombra', 'A região escura é a sombra do buraco negro, cerca de 2,6 vezes maior que o horizonte de eventos. Toda luz que passa perto demais é capturada.'],
      ring: ['Anel de fótons', 'Luz que chegou a dar uma ou mais voltas ao redor do buraco negro antes de escapar forma este anel fino e brilhante.'],
      disk: ['Disco de acreção', 'Gás em órbita, aquecido a milhões de graus. Na borda interna, ele chega a cerca de metade da velocidade da luz.'],
      lens: ['Lente gravitacional', 'Esta faixa por cima é a parte de trás do disco. A luz dela foi curvada pela gravidade e passou por cima do buraco negro até chegar a você.'],
      doppler: ['Lado que se aproxima', 'O gás deste lado vem em sua direção. O efeito Doppler relativístico o deixa mais brilhante e azulado; o lado oposto fica mais fraco e avermelhado.']
    }
  },

  'pulsar': {
    name: 'Pulsar',
    type: 'Estrela de nêutrons',
    intro: 'O núcleo esmagado de uma estrela que explodiu em supernova: mais massa que o Sol comprimida numa esfera do tamanho de uma cidade, girando como um farol.',
    how: [
      'Quando uma estrela massiva explode, seu núcleo colapsa com tanta força que prótons e elétrons se fundem em nêutrons. O resultado é um dos objetos mais densos do Universo.',
      'Ao encolher, a estrela passa a girar muito mais rápido, como uma patinadora que fecha os braços. Alguns pulsares giram centenas de vezes por segundo.',
      'O campo magnético intenso acelera partículas que emitem feixes de radiação pelos polos magnéticos. Como o eixo magnético é inclinado em relação ao de rotação, os feixes varrem o espaço.',
      'Se um feixe cruza a Terra, recebemos pulsos regulares, como a luz de um farol. Nesta cena a rotação foi desacelerada para que os feixes fiquem visíveis.'
    ],
    numbers: [
      ['Diâmetro', 'cerca de 20 km'],
      ['Massa típica', 'cerca de 1,4 a 2 massas solares'],
      ['Uma colher de chá do material', 'na ordem de bilhões de toneladas'],
      ['Mais rápido conhecido', 'PSR J1748−2446ad, cerca de 716 voltas por segundo'],
      ['Pulsar do Caranguejo', 'cerca de 30 voltas por segundo']
    ],
    facts: [
      'O primeiro pulsar foi descoberto em 1967 por Jocelyn Bell Burnell. Os pulsos eram tão regulares que o sinal ganhou o apelido provisório de LGM-1, "little green men".',
      'Magnetares são estrelas de nêutrons com campos magnéticos centenas a milhares de vezes mais fortes que os de pulsares comuns.',
      'Em 2017, a colisão de duas estrelas de nêutrons foi detectada ao mesmo tempo por ondas gravitacionais e por telescópios. Eventos assim fabricam elementos pesados como ouro e platina.',
      'A gravidade na superfície é tão forte que, segundo estimativas, as maiores "montanhas" teriam no máximo poucos milímetros de altura.',
      'Alguns pulsares são tão estáveis que rivalizam com relógios atômicos e são usados para tentar detectar ondas gravitacionais de baixíssima frequência.'
    ],
    spots: {
      star: ['Estrela de nêutrons', 'Cerca de 20 km de diâmetro, com mais massa que o Sol inteiro.'],
      beam: ['Feixe de radiação', 'Partículas aceleradas pelo campo magnético emitem radiação concentrada nos polos magnéticos.'],
      axis: ['Eixo de rotação', 'O eixo de rotação não coincide com o magnético. É essa inclinação que faz os feixes girarem como um farol.'],
      field: ['Campo magnético', 'Estimado em cerca de um trilhão de vezes o campo da Terra num pulsar típico.']
    }
  },

  'betelgeuse': {
    name: 'Betelgeuse',
    type: 'Supergigante vermelha',
    intro: 'Uma das maiores estrelas visíveis a olho nu, no ombro da constelação de Órion. Está nos estágios finais de sua vida.',
    how: [
      'Estrelas massivas, ao esgotar o hidrogênio do núcleo, passam a queimar elementos mais pesados e incham enormemente. As camadas externas esfriam e a estrela fica avermelhada.',
      'A superfície é dominada por poucas células de convecção gigantescas: bolhas de gás quente que sobem e afundam, fazendo o brilho variar.',
      'Ela perde massa continuamente em ventos e nuvens de poeira, que podem encobrir parte da estrela.',
      'Betelgeuse deve terminar como uma supernova, deixando para trás uma estrela de nêutrons ou, talvez, um buraco negro.'
    ],
    numbers: [
      ['Raio', 'cerca de 700 a 1.000 vezes o do Sol (estimativas variam)'],
      ['Distância', 'cerca de 550 a 700 anos-luz'],
      ['Massa', 'cerca de 15 a 20 massas solares'],
      ['Temperatura da superfície', 'cerca de 3.600 K (o Sol tem cerca de 5.800 K)']
    ],
    facts: [
      'Colocada no lugar do Sol, sua superfície passaria da órbita de Marte. O anel nesta cena mostra a órbita de Júpiter na mesma escala.',
      'Entre 2019 e 2020 ela escureceu de forma visível no céu, o "Grande Escurecimento". Estudos atribuíram o fenômeno a uma nuvem de poeira expelida pela estrela e a uma região mais fria na superfície.',
      'Quando explodir, provavelmente nos próximos cem mil anos, poderá ficar visível até de dia por semanas. Está longe o suficiente para não oferecer perigo à Terra.',
      'Em 2025, astrônomos relataram evidências de uma pequena estrela companheira orbitando Betelgeuse. A confirmação ainda depende de novas observações.'
    ],
    spots: {
      cells: ['Células de convecção', 'Bolhas de gás quente do tamanho de planetas gigantes, ou maiores, sobem e afundam, mudando o brilho da estrela.'],
      dust: ['Nuvem de poeira', 'Material expelido pela estrela. Uma nuvem assim ajudou a causar o Grande Escurecimento de 2019–2020.'],
      jupiter: ['Órbita de Júpiter', 'Na mesma escala. Se Betelgeuse estivesse no lugar do Sol, Mercúrio, Vênus, Terra e Marte estariam dentro dela.'],
      glow: ['Atmosfera estendida', 'Camadas externas rarefeitas e frias se espalham muito além da superfície visível.']
    }
  },

  'ana-branca': {
    name: 'Anã branca',
    type: 'Remanescente estelar',
    intro: 'O que sobra de estrelas como o Sol: um núcleo com massa comparável à do Sol, mas do tamanho da Terra.',
    how: [
      'Estrelas de massa baixa ou média, no fim da vida, expelem suas camadas externas, que formam uma nebulosa planetária. O núcleo quente fica exposto.',
      'Ali já não há fusão nuclear. A anã branca brilha apenas pelo calor que sobrou e vai esfriando ao longo de bilhões de anos.',
      'Ela não colapsa graças a um efeito quântico: os elétrons, espremidos ao máximo, resistem a ser comprimidos ainda mais. É a pressão de degenerescência.',
      'Se uma anã branca ganhar massa de uma estrela vizinha e passar de cerca de 1,4 massa solar, o limite de Chandrasekhar, pode explodir como supernova do tipo Ia.'
    ],
    numbers: [
      ['Tamanho', 'parecido com o da Terra'],
      ['Massa típica', 'cerca de 0,6 massa solar'],
      ['Uma colher de chá do material', 'algumas toneladas'],
      ['Temperatura da superfície', 'de mais de 100.000 K, quando jovem, a poucos milhares de K'],
      ['Mais próxima conhecida', 'Sirius B, a cerca de 8,6 anos-luz']
    ],
    facts: [
      'O Sol vai virar uma anã branca daqui a alguns bilhões de anos, depois de passar pela fase de gigante vermelha.',
      'Ao esfriar, o interior de uma anã branca cristaliza. Dados do satélite Gaia, publicados em 2019, trouxeram evidências desse processo.',
      'Anãs negras, completamente frias, provavelmente ainda não existem: o Universo é jovem demais para que alguma tenha esfriado tanto.',
      'Supernovas do tipo Ia, causadas por anãs brancas, serviram para descobrir que a expansão do Universo está acelerando. A descoberta rendeu o Nobel de Física de 2011.'
    ],
    spots: {
      star: ['Anã branca', 'Massa comparável à do Sol, num volume parecido com o da Terra.'],
      earth: ['Terra, na mesma escala', 'A comparação mostra o quanto a matéria está comprimida: uma massa parecida com a do Sol num globo deste tamanho.'],
      shell: ['Nebulosa planetária', 'As camadas externas expelidas pela estrela se espalham e brilham iluminadas pelo núcleo quente.']
    }
  },

  'nebulosa': {
    name: 'Berçário estelar',
    type: 'Nebulosa de emissão',
    intro: 'Nuvens gigantes de gás e poeira onde novas estrelas nascem. Esta cena é inspirada nos Pilares da Criação.',
    how: [
      'Regiões mais densas da nuvem colapsam sob a própria gravidade. O gás se aquece até que a fusão nuclear começa: nasce uma estrela.',
      'Estrelas jovens e quentes emitem radiação ultravioleta que ioniza o gás ao redor e o faz brilhar. O vermelho vem principalmente do hidrogênio; o verde-azulado, do oxigênio.',
      'A mesma radiação erode a nuvem aos poucos. As partes mais densas resistem por mais tempo e ficam como pilares esculpidos.',
      'A poeira bloqueia a luz visível, mas a luz infravermelha atravessa. Por isso telescópios infravermelhos revelam estrelas escondidas dentro dos pilares.'
    ],
    numbers: [
      ['Pilares da Criação', 'na Nebulosa da Águia, a cerca de 6.500 a 7.000 anos-luz'],
      ['Altura do pilar maior', 'cerca de 4 anos-luz'],
      ['Nebulosa de Órion', 'cerca de 1.300 a 1.400 anos-luz, visível a olho nu']
    ],
    facts: [
      'O Hubble fotografou os Pilares da Criação em 1995. Em 2022, o James Webb os registrou em infravermelho, revelando estrelas jovens antes ocultas pela poeira.',
      'O Sol provavelmente nasceu em um aglomerado de estrelas dentro de uma nuvem parecida, há cerca de 4,6 bilhões de anos.',
      'Apesar do nome, "nebulosa planetária" não tem nada a ver com planetas. O termo é histórico: em telescópios antigos, elas pareciam discos de planetas.',
      'As cores de muitas imagens astronômicas representam elementos químicos específicos ou luz invisível convertida em cores visíveis.'
    ],
    spots: {
      pillars: ['Pilares de poeira', 'Colunas densas de gás e poeira, esculpidas pela radiação das estrelas jovens ao redor.'],
      stars: ['Estrelas recém-nascidas', 'Estrelas jovens e quentes. Sua radiação ilumina e, aos poucos, dissipa a nuvem onde nasceram.'],
      gas: ['Gás ionizado', 'Hidrogênio e oxigênio energizados pela radiação ultravioleta, brilhando em cores características.']
    }
  },

  'galaxia': {
    name: 'Galáxia espiral',
    type: 'Ilha de estrelas',
    intro: 'Centenas de bilhões de estrelas, gás e poeira girando em torno de um buraco negro supermassivo. A Via Láctea é uma galáxia assim.',
    how: [
      'Os braços espirais não são estruturas fixas. São ondas de densidade: as estrelas entram e saem deles, como carros passando por um trecho de trânsito lento.',
      'Nos braços, o gás é comprimido e forma estrelas jovens, quentes e azuladas. Por isso eles brilham mais.',
      'O centro tem um bojo de estrelas mais velhas e amareladas e, no meio dele, um buraco negro supermassivo.',
      'As estrelas da periferia giram rápido demais para a quantidade de matéria visível. Esse é um dos principais indícios da matéria escura.'
    ],
    numbers: [
      ['Diâmetro da Via Láctea', 'cerca de 100 mil anos-luz (algumas estimativas são maiores)'],
      ['Estrelas na Via Láctea', 'cerca de 100 a 400 bilhões'],
      ['Distância do Sol ao centro', 'cerca de 26 mil anos-luz'],
      ['Uma volta do Sol na galáxia', 'cerca de 230 milhões de anos'],
      ['Matéria escura', 'cerca de 85% de toda a matéria do Universo']
    ],
    facts: [
      'A faixa da Via Láctea que vemos em céus escuros é o disco da nossa própria galáxia, visto de dentro.',
      'Quando galáxias colidem, estrelas quase nunca se chocam: o espaço entre elas é imenso.',
      'Andrômeda está se aproximando da Via Láctea. Por muito tempo uma colisão em cerca de 4,5 bilhões de anos foi dada como certa; um estudo de 2025 estimou em torno de 50% a chance de fusão nos próximos 10 bilhões de anos.',
      'A luz das galáxias mais distantes já observadas saiu delas há mais de 13 bilhões de anos. Olhar longe é olhar para o passado.'
    ],
    spots: {
      core: ['Buraco negro supermassivo', 'No centro da Via Láctea fica Sagitário A*, com cerca de 4 milhões de massas solares.'],
      bulge: ['Bojo central', 'Uma região densa de estrelas mais velhas, de tom amarelado.'],
      arm: ['Braço espiral', 'Região onde o gás é comprimido e nascem estrelas jovens, azuladas e brilhantes.'],
      sun: ['O Sol estaria aqui', 'Se esta fosse a Via Láctea, o Sol ficaria a pouco mais da metade do caminho entre o centro e a borda.']
    }
  }
};

export const ORDER = ['buraco-negro', 'pulsar', 'betelgeuse', 'ana-branca', 'nebulosa', 'galaxia'];
