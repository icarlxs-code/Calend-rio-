/* Segura o redesenho da tela por um instante.
   Para quê: quando a pessoa mexe num campo que muda o resumo logo acima (como "Seu dia de trabalho"),
   redesenhar na hora faz os cartões subirem ou descerem debaixo do dedo — e o toque seguinte cai no lugar errado. */
let ate = 0;
export const seguraRender = (ms = 600) => { ate = Math.max(ate, Date.now() + ms); return ate; };
export const presoAte = () => ate;
export const renderPreso = () => Date.now() < ate;
export const soltaRender = () => { ate = 0; };
