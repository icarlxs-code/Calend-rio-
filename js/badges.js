/* Emblemas do Lembra: definições (104) e a arte em SVG com cara de medalha 3D.
   Cada emblema = formato (categoria) + esmalte (cor da categoria) + metal (raridade).
   Raridade: comum (bronze) · raro (prata) · épico (ouro) · lendário (prisma).
   Inspirado nos prêmios do Apple Fitness e nas conquistas do Duolingo: metal com reflexo, chanfro,
   esmalte com profundidade, ícone em relevo e brilho de vidro por cima. Sem imagens: leve e nítido em qualquer tela. */
import { iconPaths } from './icons.js';
import { g } from './persona.js';

/* ---------- cores ---------- */
const hex2 = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const toHex = (a) => '#' + a.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
const mix = (h, w, t) => { const a = hex2(h), b = hex2(w); return toHex(a.map((v, i) => v + (b[i] - v) * t)); };
const light = (h, t) => mix(h, '#ffffff', t);
const dark = (h, t) => mix(h, '#000000', t);

export const METALS = {
  glass: ['#FFFFFF', '#E3E8EF', '#A9B2C0', '#D6DCE5', '#FFFFFF'],
  bronze: ['#FFE1C2', '#D9935C', '#8A4B22', '#C47C46', '#F6C796'],
  silver: ['#FFFFFF', '#D8DDE4', '#8A93A1', '#C5CCD5', '#F8FAFC'],
  gold: ['#FFF7CF', '#F6C844', '#A8700A', '#E4AA2A', '#FFE89A'],
  prism: ['#FFFFFF', '#BDE3FF', '#B6A4FF', '#FFC2E4', '#D9FFF1'],
};
export const RARITY = {
  comum: { metal: 'bronze', label: 'Comum', fem: 'comum', xp: 20, color: '#C47C46' },
  raro: { metal: 'silver', label: 'Raro', fem: 'rara', xp: 50, color: '#8A93A1' },
  epico: { metal: 'gold', label: 'Épico', fem: 'épica', xp: 120, color: '#D99A12' },
  lendario: { metal: 'prism', label: 'Lendário', fem: 'lendária', xp: 300, color: '#9B7BFF' },
};

/* ---------- formatos (todos centrados em 60,60 numa caixa de 120) ---------- */
const scallop = (n, R) => {
  // borda ondulada: arcos entre pontos de um círculo, cada um "estufado" para fora (roseta de medalha)
  const pts = Array.from({ length: n }, (_, i) => { const a = (2 * Math.PI * i) / n - Math.PI / 2; return [60 + Math.cos(a) * R, 60 + Math.sin(a) * R]; });
  const rs = R * Math.sin(Math.PI / n) * 1.15;
  let d = `M${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
  for (let i = 1; i <= n; i++) { const q = pts[i % n]; d += `A${rs.toFixed(2)} ${rs.toFixed(2)} 0 0 1 ${q[0].toFixed(2)} ${q[1].toFixed(2)}`; }
  return d + 'Z';
};
const starPath = (n, r1, r2) => {
  let d = '';
  for (let i = 0; i < n * 2; i++) {
    const a = (Math.PI * i) / n - Math.PI / 2, r = i % 2 ? r2 : r1;
    d += `${i ? 'L' : 'M'}${(60 + Math.cos(a) * r).toFixed(2)} ${(60 + Math.sin(a) * r).toFixed(2)}`;
  }
  return d + 'Z';
};
const SHAPES = {
  circle: 'M60 7a53 53 0 1 1 0 106a53 53 0 1 1 0-106Z',
  shield: 'M60 6 101 19.5v36c0 27.5-16.5 46.5-41 58.5C35.5 102 19 83 19 55.5v-36Z',
  hex: 'M60 6.5 104.5 32v56L60 113.5 15.5 88V32Z',
  squircle: 'M60 8c36 0 52 16 52 52s-16 52-52 52S8 96 8 60 24 8 60 8Z',
  heart: 'M60 108C33 92 9 72 9 45 9 27 22 14 38 14c10 0 17 5 22 12 5-7 12-12 22-12 16 0 29 13 29 31 0 27-24 47-51 63Z',
  diamond: 'M60 5 115 60 60 115 5 60Z',
  rosette: scallop(16, 49),
  star: starPath(10, 56, 46),
  crest: 'M60 9 96 21v31c0 26-15 45-36 56C39 97 24 78 24 52V21Z',
};
const scaleAt = (k) => `translate(60 60) scale(${k}) translate(-60 -60)`;

let uidN = 0;
/* desenha um emblema. o = { shape, hue, metal, icon, text, rays, sparkles, laurel, crown, rainbow } */
export function medal(o, size = 96, { locked = false, cls = '' } = {}) {
  const id = `b${++uidN}`;
  const M = METALS[o.metal] || METALS.bronze;
  const hue = o.hue || '#0A84FF';
  const d = SHAPES[o.shape] || SHAPES.circle;
  const faceStops = o.rainbow
    ? `<stop offset="0" stop-color="#FF7AB6"/><stop offset=".35" stop-color="#8E7CFF"/><stop offset=".7" stop-color="#2FC7FF"/><stop offset="1" stop-color="#2BD9A4"/>`
    : `<stop offset="0" stop-color="${light(hue, 0.38)}"/><stop offset=".55" stop-color="${hue}"/><stop offset="1" stop-color="${dark(hue, 0.42)}"/>`;
  const rays = o.rays ? Array.from({ length: 16 }, (_, i) => {
    const a = (Math.PI * 2 * i) / 16, b = a + Math.PI / 32;
    return `<path d="M60 60L${(60 + Math.cos(a) * 60).toFixed(1)} ${(60 + Math.sin(a) * 60).toFixed(1)}L${(60 + Math.cos(b) * 60).toFixed(1)} ${(60 + Math.sin(b) * 60).toFixed(1)}Z"/>`;
  }).join('') : '';
  const laurel = o.laurel ? (() => {
    // dois ramos de louro: um caule fino e folhas pontudas alternadas (espinha de peixe), em metal com reflexo
    const leaf = 'M0-8.5C3.4-4.6 3.4 4.6 0 8.5-3.4 4.6-3.4-4.6 0-8.5Z';
    let out = '';
    for (const side of [-1, 1]) {
      const P = (th, r) => { const a = (th * Math.PI) / 180, x = 60 + Math.cos(a) * r; return [side < 0 ? x : 120 - x, 60 + Math.sin(a) * r]; };
      const [sx, sy] = P(98, 50), [ex, ey] = P(206, 50);
      out += `<path d="M${sx.toFixed(1)} ${sy.toFixed(1)}A50 50 0 0 ${side < 0 ? 1 : 0} ${ex.toFixed(1)} ${ey.toFixed(1)}" fill="none" stroke="url(#${id}m)" stroke-width="1.6" stroke-linecap="round"/>`;
      for (let i = 0; i < 7; i++) {
        const th = 104 + i * 15.5, outer = i % 2 === 0;
        const [x, y] = P(th, outer ? 55.5 : 45.5);
        const base = th + 90 + (outer ? -34 : 34); // folha acompanha o caule, aberta para fora ou para dentro
        const rot = side < 0 ? base : 180 - base;
        out += `<path d="${leaf}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(0)}) scale(${(1 - i * 0.045).toFixed(2)})" fill="url(#${id}m)" stroke="${dark(M[2], 0.3)}" stroke-width=".5"/>`;
      }
    }
    return `<g>${out}</g>`;
  })() : '';
  const crown = o.crown ? `<g transform="translate(60 9)"><path d="M-15 6-11-6-4 1 0-9 4 1 11-6 15 6Z" fill="url(#${id}m)" stroke="${dark(M[2], 0.3)}" stroke-width=".8" stroke-linejoin="round"/><circle cx="0" cy="-9" r="2.2" fill="#fff"/></g>` : '';
  const sparkles = o.sparkles ? `<g class="bdg__spark" fill="#fff">
      <path d="M100 18l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z"/><path d="M18 30l1.4 3.6 3.6 1.4-3.6 1.4L18 40l-1.4-3.6L13 35l3.6-1.4Z"/><path d="M104 92l1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2Z"/></g>` : '';
  const k = o.laurel ? 0.8 : 1; // com louro, a medalha encolhe para caber a coroa de folhas
  const center = o.text
    ? `<text x="60" y="${o.text.length > 2 ? 70 : 72}" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display',Inter,Arial,sans-serif" font-weight="900" font-size="${o.text.length > 2 ? 27 : 34}" fill="${dark(hue, 0.55)}" opacity=".45" transform="translate(0 1.6)">${o.text}</text>
       <text x="60" y="${o.text.length > 2 ? 70 : 72}" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display',Inter,Arial,sans-serif" font-weight="900" font-size="${o.text.length > 2 ? 27 : 34}" fill="url(#${id}i)">${o.text}</text>`
    : `<svg x="36" y="36" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <g stroke="${dark(o.rainbow ? '#5B3FD9' : hue, 0.55)}" stroke-width="2.6" opacity=".5" transform="translate(0 .55)">${iconPaths(o.icon)}</g>
        <g stroke="url(#${id}i)" stroke-width="2.3">${iconPaths(o.icon)}</g></svg>`;
  return `<svg class="bdg ${locked ? 'is-locked' : ''} ${o.sparkles ? 'is-legend' : ''} ${cls}" width="${size}" height="${size}" viewBox="0 0 120 120" aria-hidden="true">
    <defs>
      <linearGradient id="${id}m" x1="0" y1="0" x2="1" y2="1">${M.map((c, i) => `<stop offset="${(i / (M.length - 1)).toFixed(2)}" stop-color="${c}"/>`).join('')}</linearGradient>
      <linearGradient id="${id}n" x1="1" y1="1" x2="0" y2="0">${M.map((c, i) => `<stop offset="${(i / (M.length - 1)).toFixed(2)}" stop-color="${c}"/>`).join('')}</linearGradient>
      <radialGradient id="${id}f" cx=".34" cy=".28" r=".95">${faceStops}</radialGradient>
      <linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".62"/><stop offset=".55" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <linearGradient id="${id}i" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="${o.rainbow ? '#F1EAFF' : light(hue, 0.78)}"/></linearGradient>
      <clipPath id="${id}c"><path d="${d}" transform="${scaleAt(0.79 * k)}"/></clipPath>
    </defs>
    ${laurel}
    <g transform="${scaleAt(k)}">
      <path d="${d}" fill="url(#${id}m)"/>
      <path d="${d}" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.2" transform="${scaleAt(0.975)}"/>
      <path d="${d}" fill="url(#${id}n)" transform="${scaleAt(0.885)}"/>
    </g>
    <path d="${d}" fill="url(#${id}f)" transform="${scaleAt(0.79 * k)}"/>
    ${rays ? `<g clip-path="url(#${id}c)" fill="#fff" opacity=".09">${rays}</g>` : ''}
    <path d="${d}" fill="none" stroke="${dark(o.rainbow ? '#5B3FD9' : hue, 0.5)}" stroke-opacity=".35" stroke-width="2" transform="${scaleAt(0.79 * k)}"/>
    ${center}
    <g clip-path="url(#${id}c)"><ellipse cx="46" cy="22" rx="62" ry="40" fill="url(#${id}g)"/></g>
    ${crown}${sparkles}
  </svg>`;
}

/* ---------- níveis 0–100: o brasão muda a cada 10 níveis ---------- */
const pr = () => (typeof window !== 'undefined' && window.__pronoun) || 'n';
export const TIERS = [
  { from: 0, name: () => 'Iniciante', hue: '#7C8597', metal: 'glass' },
  { from: 1, name: () => 'Aprendiz', hue: '#B4572E', metal: 'bronze' },
  { from: 10, name: () => g('Organizado', 'Organizada', 'Organização', pr()), hue: '#2F6FED', metal: 'silver', laurel: true },
  { from: 20, name: () => 'Pontual', hue: '#12A150', metal: 'gold', laurel: true },
  { from: 30, name: () => g('Focado', 'Focada', 'Foco total', pr()), hue: '#0E9AA7', metal: 'gold', laurel: true },
  { from: 40, name: () => g('Disciplinado', 'Disciplinada', 'Disciplina', pr()), hue: '#4F46E5', metal: 'gold', laurel: true, rays: true },
  { from: 50, name: () => 'Mestre do Tempo', hue: '#8B3FD9', metal: 'gold', laurel: true, rays: true },
  { from: 60, name: () => 'Imparável', hue: '#E5484D', metal: 'prism', laurel: true, rays: true },
  { from: 70, name: () => 'Lenda', hue: '#1F2937', metal: 'prism', laurel: true, rays: true, crown: true },
  { from: 80, name: () => 'Mente Blindada', hue: '#0F766E', metal: 'prism', laurel: true, rays: true, crown: true },
  { from: 90, name: () => 'Ícone', hue: '#C026D3', metal: 'prism', laurel: true, rays: true, crown: true, sparkles: true },
  { from: 100, name: () => 'Lembra Supremo', hue: '#8E7CFF', metal: 'prism', laurel: true, rays: true, crown: true, sparkles: true, rainbow: true },
];
export const tierOf = (level) => [...TIERS].reverse().find((t) => level >= t.from) || TIERS[0];
/* brasão do nível (o número fica no centro) */
/* arte nova (pacote "conquista"): cada brasão é uma imagem; não conquistado = preto e branco com cadeado */
const pad3 = (n) => String(n).padStart(3, '0');
const artImg = (src, size, opts, alt) => `<span class="bart${opts.locked ? ' is-locked' : ''}" style="--s:${size}px"><img src="${src}" alt="${alt || ''}" width="${size}" height="${size}" loading="lazy" decoding="async" draggable="false">${opts.locked ? '<i class="bart__lock" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg></i>' : ''}</span>`;
export const crestSrc = (level) => `media/emblemas/brasoes/nivel-${pad3(tierOf(level).from)}.webp`;
export const crest = (level, size = 96, opts = {}) => artImg(crestSrc(level), size, opts, tierOf(level).name());

/* ---------- os 105 emblemas ---------- */
export const CATS = {
  inicio: { name: 'Primeiros passos', hue: '#0A84FF', shape: 'circle' },
  pontual: { name: 'Pontualidade', hue: '#1FAD55', shape: 'shield' },
  sequencia: { name: 'Sequência', hue: '#FF8A00', shape: 'hex' },
  perfeito: { name: 'Dias perfeitos', hue: '#E8A900', shape: 'rosette' },
  planejador: { name: 'Planejamento', hue: '#5856D6', shape: 'squircle' },
  horario: { name: 'Hora certa', hue: '#FF6B3D', shape: 'circle' },
  pessoal: { name: 'Vida pessoal', hue: '#FF2D55', shape: 'heart' },
  bilhetes: { name: 'Bilhetes', hue: '#D9A400', shape: 'squircle' },
  clientes: { name: 'Clientes', hue: '#0891B2', shape: 'shield' },
  constancia: { name: 'Constância', hue: '#AF52DE', shape: 'rosette' },
  nivel: { name: 'Níveis', hue: '#2F6FED', shape: 'crest' },
  equipe: { name: 'Equipe', hue: '#16A3B8', shape: 'hex' },
  ranking: { name: 'Ranking', hue: '#FF9F0A', shape: 'star' },
  especial: { name: 'Especiais', hue: '#BF5AF2', shape: 'diamond' },
};
const rarityAt = (i, n) => (n === 1 ? 'raro' : i / (n - 1) < 0.3 ? 'comum' : i / (n - 1) < 0.65 ? 'raro' : i / (n - 1) < 0.95 ? 'epico' : 'lendario');
const BADGES = [];
const add = (b) => BADGES.push({ hue: CATS[b.cat].hue, shape: CATS[b.cat].shape, ...b });
const series = (cat, key, metric, goals, names, icon, desc, extra = {}) => goals.forEach((goal, i) => add({
  id: `${key}${goal}`, cat, metric, goal, name: typeof names[i] === 'function' ? names[i] : () => names[i], icon: Array.isArray(icon) ? icon[i] : icon,
  desc: () => desc(goal), rarity: extra.rarity ? extra.rarity[i] : rarityAt(i, goals.length), ...(extra.hue ? { hue: extra.hue } : {}),
}));
const one = (cat, id, metric, goal, name, icon, desc, rarity = 'comum', extra = {}) => add({ id, cat, metric, goal, name: typeof name === 'function' ? name : () => name, icon, desc: () => desc, rarity, ...extra });
const gp = (m, f, n) => () => g(m, f, n, pr());

// 1) Primeiros passos (12)
one('inicio', 'ficha', 'ficha', 1, gp('Bem-vindo', 'Bem-vinda', 'Boas-vindas'), 'idcard', 'Completou a ficha do Lembra.');
one('inicio', 'foto', 'photo', 1, 'Cara nova', 'camera', 'Colocou uma foto no perfil.');
one('inicio', 'primeiro', 'created', 1, 'Primeiro passo', 'calendar', 'Marcou o primeiro compromisso.');
one('inicio', 'check1', 'doneAll', 1, 'Primeiro check', 'check', 'Concluiu a primeira tarefa.');
one('inicio', 'bilhete1', 'notes', 1, 'Recado dado', 'note', 'Escreveu o primeiro bilhete.');
one('inicio', 'avisos', 'notif', 1, gp('Ligado', 'Ligada', 'Sempre on'), 'bell', 'Ativou as notificações.');
one('inicio', 'instalado', 'installed', 1, 'Na tela de início', 'phone', 'Colocou o Lembra na tela do celular.');
one('inicio', 'pessoal1', 'personalItems', 1, 'Só meu', 'lock', 'Criou o primeiro lembrete no modo Pessoal.');
one('inicio', 'niver1', 'birthdays', 1, 'Não esqueço ninguém', 'cake', 'Salvou o primeiro aniversário.');
one('inicio', 'lista1', 'lists', 1, 'Lista na mão', 'listcheck', 'Criou a primeira lista.');
one('inicio', 'celular', 'phoneOk', 1, 'Número confirmado', 'shield', 'Confirmou o celular por SMS.', 'raro');
one('inicio', 'cliente1', 'companies', 1, 'Primeiro cadastro', 'building', 'Cadastrou o primeiro cliente ou empresa.');

// 2) Pontualidade (8)
series('pontual', 'pont', 'onTime', [1, 10, 25, 50, 100, 250, 500, 1000],
  ['Na hora', 'Pontual', 'Relógio suíço', 'Palavra dada', 'Cem por cento', 'Precisão', 'Mestre da pontualidade', 'Lenda da pontualidade'],
  ['clock', 'clock', 'clock', 'handshake', 'target', 'target', 'crown', 'crown'], (n) => `Concluiu ${n} ${n === 1 ? 'compromisso' : 'compromissos'} no horário.`);
// 3) Sequência (9)
series('sequencia', 'seq', 'bestStreak', [3, 7, 14, 21, 30, 60, 90, 180, 365],
  ['Faísca', 'Semana em chamas', 'Duas semanas', 'Hábito criado', 'Um mês inteiro', 'Dois meses', 'Trimestre de ferro', 'Meio ano', 'Um ano sem parar'],
  'flame', (n) => `${n} dias seguidos concluindo alguma coisa.`);
// 4) Dias perfeitos (6)
series('perfeito', 'perf', 'perfectDays', [1, 5, 10, 25, 50, 100],
  ['Dia redondo', 'Cinco estrelas', 'Dez dias perfeitos', 'Perfeccionista do bem', 'Cinquenta perfeitos', 'Cem dias perfeitos'],
  'star', (n) => `${n} ${n === 1 ? 'dia' : 'dias'} com 100% concluído.`);
// 5) Planejamento (7)
series('planejador', 'plan', 'created', [10, 25, 50, 100, 250, 500, 1000],
  [gp('Planejador', 'Planejadora', 'Planejamento'), 'Agenda cheia', gp('Arquiteto do dia', 'Arquiteta do dia', 'Arquitetura do dia'), 'Cem planos', 'Estrategista', gp('Visionário', 'Visionária', 'Visão de longe'), 'Mil compromissos'],
  ['calclock', 'calclock', 'blueprint', 'compass', 'route', 'rocket', 'crown'], (n) => `Marcou ${n} compromissos.`);
// 6) Hora certa (9)
series('horario', 'cedo', 'early', [1, 10, 50], [gp('Madrugador', 'Madrugadora', 'Madrugada'), 'Sol nascente', 'Cinco da manhã'], 'sun', (n) => `Concluiu ${n === 1 ? 'algo' : n + ' coisas'} antes das 8h.`, { hue: '#FF8A3D' });
series('horario', 'noite', 'night', [1, 10, 50], ['Coruja', 'Turno da noite', 'Lua cheia'], 'moon', (n) => `Concluiu ${n === 1 ? 'algo' : n + ' coisas'} depois das 21h.`, { hue: '#4B55D6' });
series('horario', 'fds', 'weekend', [1, 10, 50], ['Sábado produtivo', 'Fim de semana ativo', 'Sem folga pro esquecimento'], 'sparkles', (n) => `Concluiu ${n === 1 ? 'algo' : n + ' coisas'} no fim de semana.`, { hue: '#FF3B7F' });
// 7) Vida pessoal (6)
series('pessoal', 'pes', 'personalDone', [1, 10, 50, 100, 250, 500], ['Cuidei de mim', 'Autocuidado', 'Vida em ordem', 'Equilíbrio', 'Bem-estar em dia', 'Zen'],
  ['heart', 'heart', 'leaf', 'scale', 'sprout', 'sun'], (n) => `Concluiu ${n} ${n === 1 ? 'lembrete' : 'lembretes'} do modo Pessoal.`);
// 8) Bilhetes (5)
series('bilhetes', 'bil', 'notes', [10, 50, 100], [gp('Recadeiro', 'Recadeira', 'Recados em dia'), gp('Comunicador', 'Comunicadora', 'Comunicação'), 'Correio do Lembra'], 'note', (n) => `Escreveu ${n} bilhetes.`);
series('bilhetes', 'men', 'mentions', [1, 10], ['Marcou alguém', 'Time conectado'], 'users', (n) => `Marcou ${n === 1 ? 'uma pessoa' : n + ' vezes alguém'} num bilhete.`);
// 9) Clientes (4)
series('clientes', 'cli', 'companies', [5, 10, 25, 50], ['Carteira crescendo', 'Dez na lista', 'Rede forte', 'Império'], ['building', 'building', 'store', 'crown'], (n) => `${n} clientes ou empresas cadastrados.`);
// 10) Constância (5)
series('constancia', 'mes', 'goodMonths', [1, 3, 6, 12], ['Mês constante', 'Trimestre constante', 'Semestre constante', 'Ano constante'], 'cal2', (n) => `${n} ${n === 1 ? 'mês' : 'meses'} usando o Lembra em 20 dias ou mais.`);
one('constancia', 'dias100', 'activeDays', 100, 'Cem dias de Lembra', 'calendar', 'Usou o Lembra em 100 dias diferentes.', 'epico');
// 11) Níveis (11)
[5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].forEach((L, i) => {
  const t = tierOf(L);
  add({ id: `nivel${L}`, cat: 'nivel', metric: 'level', goal: L, name: () => `Nível ${L}${L % 10 === 0 ? ' · ' + t.name() : ''}`, text: String(L), hue: t.hue,
    desc: () => `Chegou ao nível ${L}.`, rarity: i < 2 ? 'comum' : i < 5 ? 'raro' : i < 9 ? 'epico' : 'lendario', crestTier: true });
});
// 12) Equipe (4)
one('equipe', 'equipe', 'team', 1, 'Em equipe', 'users', 'Entrou numa agenda compartilhada.');
one('equipe', 'convite', 'invites', 1, gp('Recrutador', 'Recrutadora', 'Chamou o time'), 'handshake', 'Convidou alguém para a sua agenda.', 'raro');
one('equipe', 'time100', 'teamPerfectWeeks', 1, 'Time 100%', 'clipcheck', 'A equipe toda cumpriu a semana sem atraso.', 'epico');
one('equipe', 'lider', 'teamTop', 1, 'Líder do placar', 'trophy', 'Ficou em 1º no placar da equipe.', 'epico');
// 13) Ranking (4)
one('ranking', 'prata', 'league', 1, 'Liga Prata', 'trophy', 'Subiu para a Liga Prata do ranking.', 'raro');
one('ranking', 'ouro', 'league', 2, 'Liga Ouro', 'trophy', 'Chegou à Liga Ouro do ranking.', 'epico');
one('ranking', 'podio', 'podium', 1, 'Pódio', 'flag2', 'Terminou uma semana entre os 3 primeiros.', 'epico');
one('ranking', 'campeao', 'champion', 1, gp('Campeão do mês', 'Campeã do mês', 'Topo do mês'), 'crown', 'Primeiro lugar do mês no ranking.', 'lendario');
// 14) Especiais (14)
one('especial', 'relampago', 'blitz', 1, 'Relâmpago', 'bolt', 'Concluiu 5 coisas em menos de 1 hora.', 'raro');
one('especial', 'maratona', 'maxDay', 10, 'Maratona', 'dumbbell', 'Concluiu 10 coisas num dia só.', 'raro');
one('especial', 'zerado', 'zeroed', 1, 'Caixa zerada', 'clipcheck', 'Ficou sem nada atrasado, nem no trabalho nem no Pessoal.', 'raro');
one('especial', 'adiantado', 'ahead', 5, gp('Adiantado', 'Adiantada', 'Antes da hora'), 'rocket', 'Concluiu 5 compromissos com 1 hora ou mais de antecedência.', 'raro');
one('especial', 'namosca', 'exact', 1, 'Na mosca', 'target', 'Concluiu um compromisso exatamente na hora marcada.');
one('especial', 'volta', 'comebacks', 1, 'Volta por cima', 'refresh', 'Voltou depois de uns dias fora e já concluiu algo. Isso é força.', 'raro');
one('especial', 'resiliente', 'comebacks', 5, 'Resiliente', 'shield', 'Voltou por cima 5 vezes. Cair faz parte; voltar é o que conta.', 'epico');
one('especial', 'umano', 'accountYears', 1, 'Um ano de Lembra', 'cake', 'Completou 1 ano usando o Lembra.', 'epico');
one('especial', 'anonovo', 'newYear', 1, 'Ano novo, agenda nova', 'sparkles', 'Concluiu algo no dia 1º de janeiro.', 'raro');
one('especial', 'sextou', 'fridayClear', 1, 'Sextou em paz', 'sun', 'Chegou na sexta às 18h com a semana toda concluída.', 'raro');
one('especial', 'segunda', 'mondayEarly', 4, 'Segunda sem medo', 'bolt', 'Concluiu algo antes das 9h em 4 segundas.', 'raro');
one('especial', 'xp10k', 'xp', 10000, 'Dez mil XP', 'gem', 'Juntou 10.000 XP.', 'epico');
one('especial', 'xp50k', 'xp', 50000, 'Cinquenta mil XP', 'gem', 'Juntou 50.000 XP.', 'lendario');
add({ id: 'fundador', cat: 'especial', metric: 'founder', goal: 1, name: gp('Fundador', 'Fundadora', 'Desde o começo'), icon: 'crown', rarity: 'lendario',
  desc: () => g('Entrou no Lembra como Fundador: está aqui desde o começo.', 'Entrou no Lembra como Fundadora: está aqui desde o começo.', 'Entrou no Lembra no grupo dos Fundadores: está aqui desde o começo.', pr()) });
add({ id: 'vitalicio', cat: 'especial', metric: 'vip', goal: 1, name: () => 'Vitalício', icon: 'infinity', rarity: 'lendario', shape: 'rosette', hue: '#1C1C1E',
  desc: () => 'Recebeu o Lembra para sempre: um dos poucos membros Vitalícios do mundo.' });

export { BADGES };
export const badgeById = (id) => BADGES.find((b) => b.id === id);
/* desenha um emblema da lista (metal pela raridade) */
export const badgeSrc = (b) => `media/emblemas/${b.id}.webp`;
export function badgeArt(b, size = 96, opts = {}) { return artImg(badgeSrc(b), size, opts, b.name()); }
