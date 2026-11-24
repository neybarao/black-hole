# Horizonte

Site 3D e interativo sobre buracos negros e outros corpos celestes intrigantes: pulsar, Betelgeuse, anã branca, berçário estelar e galáxia espiral.

- Buraco negro renderizado em tempo real com integração de raios de luz (métrica de Schwarzschild), disco de acreção com efeito Doppler relativístico e lente gravitacional
- Navegação livre ao redor de cada objeto, viagem animada entre eles e pontos de interesse clicáveis
- Textos educativos com valores aproximados (as estimativas variam entre estudos)

Feito com [three.js](https://threejs.org) r160 (incluído em `vendor/`, licença MIT). Sem etapa de build: o GitHub Actions publica a pasta no GitHub Pages a cada push na `main`.

Para rodar localmente: `python3 -m http.server` e abra `http://localhost:8000`.
