/* Sininho, o mascote do Lembra: desenhado em SVG com peças separadas (corpo, alça, aba, olhos, pupilas,
   pálpebras, sobrancelhas, boca, bracinhos e pezinhos), para cada parte se mexer sozinha.
   Humores: feliz, comemora, sono, desconfiado, amor, danca, bravo, triste. As animações ficam no CSS (.msc). */
const C = { body: '#FF6B3D', shade: '#F25A2B', rim: '#FF4F2E', arm: '#E64A19', foot: '#E64A19', ink: '#3B2620', blush: '#FF9C7A' };

const EYES = {
  feliz: { lid: 0, brow: 'up', pupil: [0, 0] },
  comemora: { lid: 0, brow: 'up', closed: true },
  sono: { lid: 0.55, brow: 'flat', pupil: [0, 4] },
  desconfiado: { lid: 0.42, brow: 'meh', pupil: [7, 2] },
  amor: { lid: 0, brow: 'up', closed: true },
  danca: { lid: 0, brow: 'up', closed: true },
  bravo: { lid: 0.2, brow: 'angry', pupil: [0, 2] },
  triste: { lid: 0, brow: 'sad', pupil: [0, 3], tears: true },
};
const MOUTH = {
  feliz: '<path d="M88 136 Q100 152 112 136 Q100 141 88 136Z" fill="#7A2318"/><path d="M93 141 Q100 147 107 141 Q100 143 93 141Z" fill="#FF5A4E"/>',
  comemora: '<path d="M86 134 Q100 158 114 134 Q100 139 86 134Z" fill="#7A2318"/><path d="M92 142 Q100 151 108 142 Q100 145 92 142Z" fill="#FF5A4E"/>',
  sono: '<ellipse cx="100" cy="140" rx="4" ry="5" fill="#7A2318"/>',
  desconfiado: '<path d="M92 142 Q100 137 108 142" stroke="#3B2620" stroke-width="3.5" fill="none" stroke-linecap="round"/>',
  amor: '<path d="M92 137 Q100 145 108 137" stroke="#3B2620" stroke-width="3.5" fill="none" stroke-linecap="round"/>',
  danca: '<path d="M87 134 Q100 154 113 134 Q100 139 87 134Z" fill="#7A2318"/><path d="M93 141 Q100 148 107 141 Q100 143 93 141Z" fill="#FF5A4E"/>',
  bravo: '<path d="M90 146 Q100 134 110 146" stroke="#A8180C" stroke-width="5" fill="none" stroke-linecap="round"/>',
  triste: '<path d="M91 147 Q100 137 109 147" stroke="#A8180C" stroke-width="5" fill="none" stroke-linecap="round"/>',
};
const BROW = {
  up: ['M64 80 Q76 70 88 78', 'M112 78 Q124 70 136 80'],
  flat: ['M64 82 Q76 78 88 82', 'M112 82 Q124 78 136 82'],
  meh: ['M64 84 Q76 82 90 84', 'M112 78 Q124 72 136 80'],
  angry: ['M64 76 L90 88', 'M136 76 L110 88'],
  sad: ['M64 86 Q74 76 88 78', 'M112 78 Q126 76 136 86'],
};
/* bracinhos: posição de cada um por humor (rotação em graus; os dois "nascem" nas laterais do sino) */
const ARMS = {
  feliz: [-10, -140], comemora: [-150, 150], sono: [-12, 12], desconfiado: [60, -60], amor: [55, -55],
  danca: [-120, 30], bravo: [40, -40], triste: [-110, 110],
};

function eye(cx, mood) {
  const e = EYES[mood] || EYES.feliz;
  if (e.closed) return `<path d="M${cx - 15} 106 Q${cx} 92 ${cx + 15} 106" stroke="${C.ink}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  const [px, py] = e.pupil || [0, 0];
  const lid = e.lid ? `<rect class="msc-lid" x="${cx - 26}" y="78" width="52" height="${Math.round(52 * e.lid)}" fill="${C.body}"/>` : '';
  return `<g class="msc-eye"><circle cx="${cx}" cy="104" r="24" fill="#fff"/>
    <g class="msc-pupil"><circle cx="${cx + px}" cy="${108 + py}" r="12" fill="${C.ink}"/><circle cx="${cx + px - 4}" cy="${104 + py}" r="3.6" fill="#fff"/></g>
    ${lid}<rect class="msc-blink" x="${cx - 26}" y="78" width="52" height="52" fill="${C.body}"/></g>`;
}

export function mascot(mood = 'feliz', size = 120, { label = 'Sininho, o mascote do Lembra' } = {}) {
  if (!EYES[mood]) mood = 'feliz';
  const [a1, a2] = ARMS[mood];
  const e = EYES[mood];
  const brow = BROW[e.brow].map((d) => `<path d="${d}" stroke="${C.ink}" stroke-width="5" fill="none" stroke-linecap="round"/>`).join('');
  const extras = {
    sono: '<g class="msc-zzz" fill="#FF6B3D" font-weight="900" font-family="system-ui"><text x="150" y="50" font-size="22">z</text><text x="166" y="32" font-size="28">Z</text></g>',
    amor: '<g class="msc-hearts" fill="#FF4D4D"><path d="M160 46c-6-8-18-2-12 8l12 12 12-12c6-10-6-16-12-8z"/><path d="M178 72c-3-4-9-1-6 4l6 6 6-6c3-5-3-8-6-4z" opacity=".7"/></g>',
    danca: '<g class="msc-notes" fill="#FF6B3D"><path d="M30 60v-26l16-4v24" stroke="#FF6B3D" stroke-width="4" fill="none"/><circle cx="26" cy="61" r="6"/><circle cx="42" cy="55" r="6"/><path d="M168 48v-20" stroke="#FF6B3D" stroke-width="4"/><circle cx="164" cy="49" r="6"/></g>',
    bravo: '<g class="msc-steam" fill="#FF9C7A"><circle cx="34" cy="50" r="10"/><circle cx="44" cy="40" r="8"/><circle cx="166" cy="50" r="10"/><circle cx="156" cy="40" r="8"/></g>',
    comemora: '<g class="msc-conf"><rect x="28" y="40" width="10" height="10" rx="2" fill="#FF6B3D" transform="rotate(20 33 45)"/><rect x="160" y="34" width="10" height="10" rx="2" fill="#FFB020" transform="rotate(-25 165 39)"/><rect x="48" y="16" width="8" height="8" rx="2" fill="#FF4D8D"/><rect x="146" y="12" width="8" height="8" rx="2" fill="#FF6B3D"/></g>',
  }[mood] || '';
  const tears = e.tears ? `<g class="msc-tears" fill="#9FDCFF"><ellipse cx="68" cy="122" rx="9" ry="6"/><ellipse cx="132" cy="122" rx="9" ry="6"/></g>` : '';
  const blush = ['amor', 'feliz', 'danca', 'comemora'].includes(mood) ? `<ellipse cx="62" cy="132" rx="10" ry="6" fill="${C.blush}" opacity=".55"/><ellipse cx="138" cy="132" rx="10" ry="6" fill="${C.blush}" opacity=".55"/>` : '';
  return `<span class="msc msc--${mood}" style="--s:${size}px" role="img" aria-label="${label}">
  <svg viewBox="0 0 200 220" width="${size}" height="${Math.round(size * 1.1)}" aria-hidden="true">
    <ellipse class="msc-shadow" cx="100" cy="210" rx="56" ry="7" fill="#000" opacity=".12"/>
    ${extras}
    <g class="msc-body">
      <g class="msc-feet"><ellipse class="msc-foot msc-foot--l" cx="78" cy="194" rx="18" ry="13" fill="${C.foot}"/><ellipse class="msc-foot msc-foot--r" cx="122" cy="194" rx="18" ry="13" fill="${C.foot}"/></g>
      <g class="msc-arm msc-arm--l" style="--r:${a1}deg"><ellipse cx="30" cy="124" rx="12" ry="17" fill="${C.arm}"/></g>
      <g class="msc-arm msc-arm--r" style="--r:${a2}deg"><ellipse cx="170" cy="124" rx="12" ry="17" fill="${C.arm}"/></g>
      <path fill-rule="evenodd" d="M78 52 V38 a22 22 0 0 1 44 0 V52 Z M90 52 V40 a10 10 0 0 1 20 0 V52 Z" fill="${C.body}"/>
      <path d="M100 48 C48 48 40 92 40 126 C40 146 32 156 24 166 L176 166 C168 156 160 146 160 126 C160 92 152 48 100 48Z" fill="${C.body}"/>
      <ellipse cx="100" cy="166" rx="76" ry="10" fill="${C.rim}"/><ellipse cx="100" cy="166" rx="68" ry="6" fill="#B8361A"/>
      <g class="msc-clap"><rect x="97" y="160" width="6" height="16" rx="3" fill="#B8361A"/><circle cx="100" cy="180" r="10" fill="${C.shade}"/></g>
      <path d="M64 78 C72 62 84 54 98 52" stroke="#fff" stroke-width="5" opacity=".25" fill="none" stroke-linecap="round"/>
      ${blush}
      <g class="msc-face">${eye(78, mood)}${eye(122, mood)}${brow}${MOUTH[mood]}${tears}</g>
    </g>
  </svg></span>`;
}
/* humor do Sininho pela hora do dia (tela inicial do Pessoal) */
export function moodNow(d = new Date()) {
  const h = d.getHours();
  return h >= 23 || h < 6 ? 'sono' : 'feliz';
}
