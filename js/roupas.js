/* Guarda-roupa do Lembra. As peças são desenhadas DENTRO do boneco, nas medidas do corpo dele:
   quando ele inclina, achata ou pula, a peça vai junto (nada flutua).
   Medidas: centro do sino em x = 988; cúpula em y = 227; argola de 107 a 246; testa até 290. */
const C = { or: '#F4561A', esc: '#B93B0C', creme: '#FFF3E0', sol: '#FFB938', roxo: '#6B4FA8', lilas: '#9A7FD6', tinta: '#3A1D12', azul: '#4FA8E8', verde: '#39A96B', rosa: '#FF7FA6', cinza: '#E9DDD0' };
const X = 988;
const p2 = new Map(); const P = (d) => p2.get(d) || (p2.set(d, new Path2D(d)), p2.get(d));
const f = (c, cor, d) => { c.fillStyle = cor; c.fill(P(d)); };
const l = (c, cor, w, d) => { c.strokeStyle = cor; c.lineWidth = w; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke(P(d)); };
const el = (c, cor, x, y, a, b = a, r = 0) => { c.fillStyle = cor; c.beginPath(); c.ellipse(x, y, a, b, r, 0, 7); c.fill(); };
const rr = (c, cor, x, y, w, h, r) => { c.fillStyle = cor; c.beginPath(); c.roundRect(x, y, w, h, r); c.fill(); };
const texto = (c, t, x, y, s, cor) => { c.font = `900 ${s}px Nunito, system-ui, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = cor; c.fillText(t, x, y); };
const coracao = (c, cor, x, y, s) => { c.save(); c.translate(x, y); c.scale(s, s); f(c, cor, 'M0 34C-44 6-42-30-18-32-6-33 0-24 0-18 0-24 6-33 18-32 42-30 44 6 0 34Z'); c.restore(); };
const ABA = 'M780 290C850 226 918 206 988 206S1126 226 1196 290'; // a curva da testa: toda peça de cabeça assenta aqui

/* ---------- cabeça ---------- */
const CAB = {
  gorro(c, t) {
    const m = Math.sin(t * 1.6) * 6;
    f(c, C.roxo, 'M794 284C800 130 880 34 1010 36 1150 38 1262 96 1290 196 1296 220 1268 226 1254 208 1230 178 1204 166 1170 168 1180 206 1184 246 1182 284 1126 222 1052 206 988 206S850 226 794 284Z');
    f(c, C.lilas, 'M818 226C838 138 886 80 952 56L984 52C920 92 884 150 872 222ZM930 208C936 140 966 88 1022 48L1062 48C1010 90 984 146 980 206ZM1062 214C1062 150 1086 106 1136 82L1166 98C1128 124 1114 164 1118 232Z');
    el(c, '#E7D8C4', 1284, 214 + m, 38); el(c, C.creme, 1278, 208 + m, 36);
    l(c, '#E7D8C4', 62, ABA); l(c, C.creme, 54, 'M780 286C850 222 918 202 988 202S1126 222 1196 286');
  },
  festa(c) {
    f(c, C.roxo, 'M828 246C876 150 930 52 1000-34 1050 60 1098 150 1148 246 1100 214 1046 204 988 204S880 214 828 246Z');
    f(c, C.sol, 'M874 160L1042 46 1062 84 850 208ZM848 226L1096 148 1118 190 940 208Z'); el(c, C.rosa, 968, 66, 12); el(c, C.creme, 1030, 124, 13); el(c, C.rosa, 930, 184, 12);
    for (let i = 0; i < 9; i++) { const a = (i / 9) * 6.28; l(c, i % 2 ? C.sol : C.rosa, 15, `M1000-12L${1000 + Math.cos(a) * 32} ${-8 + Math.sin(a) * 26}`); } el(c, C.creme, 1000, -10, 13);
    l(c, C.creme, 22, 'M828 246C880 214 932 204 988 204S1096 214 1148 246');
  },
  palha(c) {
    f(c, '#E9B45C', 'M846 236C846 120 884 62 988 62S1130 120 1130 236C1084 212 1036 206 988 206S892 212 846 236Z'); f(c, C.or, 'M844 240C844 216 846 196 848 180 890 158 938 150 988 150S1086 158 1128 180C1130 196 1132 216 1132 240 1084 214 1036 208 988 208S892 214 844 240Z');
    f(c, '#D99B3F', 'M690 300C760 236 870 196 988 196S1216 236 1286 300C1230 290 1120 246 988 246S746 290 690 300Z'); l(c, '#F3CB85', 9, 'M722 284C800 234 892 212 988 212S1176 234 1254 284');
  },
  formatura(c) {
    f(c, '#2E2A4A', 'M826 262C826 220 836 178 846 150H1130C1140 178 1150 220 1150 262 1096 218 1044 206 988 206S880 218 826 262Z'); f(c, '#423C6B', 'M988 40L1268 122 988 198 708 122Z'); f(c, '#2E2A4A', 'M708 122L988 198 1268 122V134L988 212 708 134Z');
    l(c, C.sol, 10, 'M988 118L1196 146 1206 238'); f(c, C.sol, 'M1190 232H1224L1230 300H1184Z'); el(c, C.sol, 988, 118, 14, 8);
  },
  coroa(c, t) {
    f(c, C.sol, 'M810 256L796 78 896 154 988 34 1080 154 1180 78 1166 256C1106 218 1048 206 988 206S870 218 810 256Z'); l(c, '#E5902A', 26, 'M812 252C870 216 928 206 988 206S1106 216 1164 252');
    el(c, C.or, 988, 148, 22, 26); el(c, C.azul, 882, 188, 15, 18); el(c, C.azul, 1094, 188, 15, 18); [[796, 78], [988, 34], [1180, 78]].forEach(([x, y]) => el(c, C.creme, x, y, 19)); c.globalAlpha = 0.5 + 0.5 * Math.sin(t * 3); l(c, '#fff', 8, 'M1126 92V128M1108 110H1144'); c.globalAlpha = 1;
  },
  faixa(c) { l(c, '#fff', 66, ABA); l(c, C.or, 14, 'M776 302C848 242 916 220 988 220S1128 242 1200 302'); l(c, C.or, 14, 'M786 270C852 210 920 190 988 190S1124 210 1190 270'); },
  enfermeiro(c) { f(c, '#fff', 'M824 258C832 180 852 120 880 88H1096C1124 120 1144 180 1152 258 1098 218 1044 206 988 206S878 218 824 258Z'); l(c, C.cinza, 10, 'M826 252C880 214 932 204 988 204S1096 214 1150 252'); rr(c, '#E5383B', 972, 100, 32, 92, 8); rr(c, '#E5383B', 942, 130, 92, 32, 8); },
  chef(c) { f(c, '#fff', 'M842 246C840 214 838 190 836 166 780 152 772 76 838 62 862 2 940-14 988 16 1036-14 1114 2 1138 62 1204 76 1196 152 1140 166 1138 190 1136 214 1134 246 1086 214 1036 206 988 206S890 214 842 246Z'); l(c, C.cinza, 9, 'M900 180V120M988 168V108M1076 180V120'); l(c, '#F4E9DC', 22, 'M842 240C892 212 940 202 988 202S1084 212 1134 240'); },
  folha(c, t) { c.save(); c.translate(X, 112); c.rotate(Math.sin(t * 1.4) * 0.07); l(c, '#24804F', 12, 'M0 0C2-30 6-50 14-70'); f(c, C.verde, 'M14-62C-10-126-76-138-112-116-98-70-44-46 14-62Z'); f(c, '#4CC482', 'M14-62C22-128 84-148 124-128 116-78 68-48 14-62Z'); l(c, '#24804F', 6, 'M6-66C-26-88-60-98-92-104M22-68C50-92 78-106 104-114'); c.restore(); },
  capacete(c) { f(c, C.sol, 'M806 262C806 140 880 62 988 62S1170 140 1170 262C1108 220 1048 206 988 206S868 220 806 262Z'); f(c, '#E5902A', 'M956 64H1020L1028 206C1014 205 1002 206 988 206S962 205 948 206Z'); l(c, '#E5902A', 34, ABA); },
  pet(c) { f(c, '#9C5A2E', 'M858 176C776 92 720 120 712 206 708 262 742 292 782 272 826 250 856 218 858 176ZM1118 176C1200 92 1256 120 1264 206 1268 262 1234 292 1194 272 1150 250 1120 218 1118 176Z'); f(c, '#C98A5A', 'M836 180C784 134 748 152 744 206 742 240 762 256 786 244 814 230 834 208 836 180ZM1140 180C1192 134 1228 152 1232 206 1234 240 1214 256 1190 244 1162 230 1142 208 1140 180Z'); },
};
/* ---------- rosto ---------- */
const ROS = {
  sogra(c, t) { // língua de sogra: enrola e desenrola soprando
    const k = 0.3 + 0.7 * Math.max(0, Math.sin(t * 2.1)) ** 0.6, w = 60 + k * 230, r = 48 * (1 - k * 0.55); c.save(); c.translate(985, 628); c.rotate(-0.2 + k * 0.05); c.scale(1.35, 1.35);
    rr(c, C.creme, -22, -17, 74, 34, 15); rr(c, C.roxo, 44, -25, w, 50, 20); for (let i = 0; i * 46 < w - 24; i++) { c.save(); c.beginPath(); c.roundRect(44, -25, w, 50, 20); c.clip(); f(c, C.sol, `M${58 + i * 46}-30h18l-14 60h-18Z`); c.restore(); }
    el(c, C.roxo, 44 + w, 25 - r, r); el(c, C.sol, 44 + w, 25 - r, r * 0.62); el(c, C.roxo, 44 + w, 25 - r, r * 0.28); c.restore();
  },
  oculos(c) { [[848, 512], [1103, 518]].forEach(([x, y]) => { c.lineWidth = 17; c.strokeStyle = C.tinta; c.beginPath(); c.roundRect(x - 124, y - 102, 248, 204, 92); c.stroke(); }); l(c, C.tinta, 17, 'M968 500Q976 490 984 502'); },
  lendo(c) { [[848, 512], [1103, 518]].forEach(([x, y]) => { c.lineWidth = 40; c.strokeStyle = '#2B3A8C'; c.beginPath(); c.roundRect(x - 128, y - 106, 256, 212, 96); c.stroke(); }); l(c, '#2B3A8C', 40, 'M968 500Q976 490 984 502'); },
  escuros(c) { [[848, 508], [1103, 514]].forEach(([x, y]) => { f(c, '#2B1A2E', `M${x - 122} ${y - 78}H${x + 120}C${x + 122} ${y + 40} ${x + 60} ${y + 92} ${x} ${y + 92}S${x - 122} ${y + 40} ${x - 122} ${y - 78}Z`); c.globalAlpha = 0.28; f(c, '#fff', `M${x - 88} ${y - 56}h66l-74 96c-14-26-12-66 8-96Z`); c.globalAlpha = 1; }); l(c, '#2B1A2E', 20, 'M960 440H990'); },
  babador(c) { f(c, '#fff', 'M858 700C900 720 1070 720 1112 704L1096 812C1060 852 918 852 876 812Z'); l(c, C.or, 9, 'M884 806C924 838 1052 838 1088 806'); coracao(c, C.or, 984, 768, 0.9); },
  gravata(c) { c.translate(988, 704); c.scale(0.86, 0.86); c.translate(-988, -704); f(c, '#8C2A0B', 'M944 706H1032L1012 748H964Z'); f(c, '#A83410', 'M964 748H1012L1034 836 988 872 942 836Z'); },
  esteto(c) { l(c, '#4A3A52', 15, 'M800 660C806 780 900 806 960 800M1180 664C1176 770 1090 806 1016 800'); l(c, '#4A3A52', 15, 'M988 800V836'); el(c, '#B9C3CF', 988, 854, 32); el(c, '#E9EEF4', 988, 854, 19); },
  maos(c) { const g = c.createLinearGradient(0, 640, 0, 900); g.addColorStop(0, '#FF8A3A'); g.addColorStop(1, '#E24A08'); [-1, 1].forEach((k) => { c.save(); c.translate(988, 792); c.scale(k, 1); c.fillStyle = g; c.strokeStyle = 'rgb(176,52,0)'; c.lineWidth = 8; c.lineJoin = 'round'; c.fill(P('M2-118C34-122 58-92 62-54 68-8 150 32 196 58 214 92 176 122 138 110 84 92 30 74 2 70Z')); c.stroke(P('M2-118C34-122 58-92 62-54 68-8 150 32 196 58 214 92 176 122 138 110 84 92 30 74 2 70Z')); c.restore(); }); },
  laco(c) { f(c, C.rosa, 'M988 726C940 690 880 684 874 728S940 780 988 750C1036 780 1108 772 1102 728S1036 690 988 726Z'); el(c, '#E2588A', 988, 738, 24); },
};
/* ---------- na mão (o ponto 0,0 é a palma) ---------- */
const MAO = {
  celular(c, t) { c.save(); c.rotate(-0.1); rr(c, C.tinta, -74, -190, 148, 250, 28); rr(c, C.creme, -60, -172, 120, 214, 16); const k = (t * 0.55) % 1; [0, 1, 2].forEach((i) => { const w = Math.max(0, Math.min(1, k * 3.4 - i)) * (i === 2 ? 52 : 88); if (w > 8) rr(c, i % 2 ? '#F3D9C2' : C.or, -44, -152 + i * 40, w, 22, 11); }); rr(c, '#E9D8C6', -44, -20, 88, 46, 10); const p = Math.floor(t * 7) % 6; rr(c, C.or, -38 + (p % 3) * 28, -14 + Math.floor(p / 3) * 20, 20, 14, 5); c.restore(); },
  microfone(c, t) { c.save(); c.rotate(-0.12); rr(c, '#4A4E58', -22, -60, 44, 150, 18); rr(c, '#2B2E36', -58, -170, 116, 128, 56); c.globalAlpha = 0.5; [-132, -104, -76].forEach((y) => rr(c, '#8A90A0', -44, y, 88, 9, 4)); c.globalAlpha = 1; el(c, '#E5383B', 0, 6, 11 + Math.sin(t * 6) * 3); [0, 1].forEach((i) => { const k = (t * 1.1 + i * 0.5) % 1; c.globalAlpha = 1 - k; l(c, C.or, 13, `M${84 + k * 54} ${-150 - k * 18}Q${112 + k * 64}-106 ${84 + k * 54} ${-62 + k * 18}`); l(c, C.or, 13, `M${-84 - k * 54} ${-150 - k * 18}Q${-112 - k * 64}-106 ${-84 - k * 54} ${-62 + k * 18}`); }); c.restore(); },
  bandeira(c, t) { const s = Math.sin(t * 4) * 14; l(c, '#8C5A2E', 15, 'M0 60V-210'); f(c, '#2E6FE0', `M6-212C60-${232 + s} 120-${196 - s} 176-${214 + s}V-${104 + s}C120-${86 - s} 60-${122 + s} 6-104Z`); },
  mala(c) { l(c, C.tinta, 15, 'M-34 44V16Q-34-8 0-8T34 16V44'); rr(c, '#8C4A20', -104, 40, 208, 158, 26); rr(c, '#A85C2C', -104, 40, 208, 62, 26); rr(c, C.sol, -74, 40, 24, 158, 4); rr(c, C.sol, 50, 40, 24, 158, 4); el(c, C.creme, 0, 132, 27); coracao(c, C.or, 0, 133, 0.42); },
  copo(c, t) { c.save(); c.rotate(-0.08); f(c, 'rgba(255,255,255,.85)', 'M-56-118H56L42 46Q40 58 28 58H-28Q-40 58-42 46Z'); const y = -72 + Math.sin(t * 2.4) * 5; f(c, C.azul, `M-51-70Q-24 ${y - 12} 0-70T51-70L41 44Q39 52 28 52H-28Q-39 52-41 44Z`); l(c, C.or, 13, 'M14-40L40-186L80-196'); l(c, 'rgba(255,255,255,.8)', 9, 'M-34-52L-27 14'); c.restore(); },
  caneca(c, t) { l(c, '#A3340C', 19, 'M60-62Q108-62 108-28T60 6'); rr(c, '#C2410C', -62, -92, 124, 128, 22); coracao(c, C.creme, 0, -22, 0.75); el(c, '#6B3A1C', 0, -90, 54, 15); c.globalAlpha = 0.9; [-24, 4, 32].forEach((x, i) => { const s = Math.sin(t * 1.8 + i) * 9; l(c, '#C98A5A', 8, `M${x}-116Q${x + s}-138 ${x}-158T${x}-196`); }); c.globalAlpha = 1; },
  halter(c) { rr(c, '#7C828C', -104, -13, 208, 26, 13); [-112, 76].forEach((x) => rr(c, '#33363E', x, -62, 36, 124, 13)); [-142, 112].forEach((x) => rr(c, '#4A4E58', x, -44, 30, 88, 11)); },
  livro(c, t, cor = '#3B5FC0', cor2 = '#2A468F') { c.save(); c.rotate(-0.06); rr(c, cor2, -66, -158, 146, 176, 14); rr(c, C.creme, -58, -150, 130, 160, 8); l(c, '#D8C3A5', 4, 'M66-140V6M60-140V6'); rr(c, cor, -74, -164, 130, 176, 14); rr(c, cor2, -74, -164, 24, 176, 10); if (cor === '#3B5FC0') { rr(c, C.sol, -32, -132, 70, 46, 8); } c.restore(); },
  biblia(c, t) { MAO.livro(c, t, '#7A2415', '#571509'); c.save(); c.rotate(-0.06); rr(c, C.sol, -2, -134, 15, 92, 5); rr(c, C.sol, -27, -108, 65, 15, 5); c.restore(); },
  secador(c, t) { f(c, '#FF8FB8', 'M-70-92H50C92-92 112-64 112-38S92 16 50 16H-70Z'); rr(c, '#D9367A', -94, -84, 30, 92, 8); rr(c, '#D9367A', 10, 4, 46, 112, 18); el(c, C.creme, 60, -38, 25); c.globalAlpha = 0.8; [-70, -38, -6].forEach((y, i) => { const s = Math.sin(t * 9 + i) * 11; l(c, '#fff', 9, `M-110 ${y}Q-140 ${y + s} -168 ${y}T-220 ${y}`); }); c.globalAlpha = 1; },
  coracao(c, t) { const s = 2 + Math.sin(t * 4) * 0.14; coracao(c, '#E5304A', 0, -46, s); c.globalAlpha = 0.5; el(c, '#fff', -30, -82, 15, 10, -0.6); c.globalAlpha = 1; },
  trofeu(c) { l(c, '#E5902A', 16, 'M-60-120Q-118-116-104-66T-48-34M60-120Q118-116 104-66T48-34'); f(c, C.sol, 'M-74-140H74Q76-16 0-8-76-16-74-140Z'); rr(c, '#E5902A', -13, -16, 26, 48, 5); rr(c, '#8C4A20', -56, 28, 112, 32, 9); texto(c, '1', 0, -82, 66, '#fff'); },
  moeda(c, t) { const k = Math.abs(Math.cos(t * 2)); c.save(); c.translate(0, -56); c.scale(0.35 + 0.65 * k, 1); el(c, '#E5902A', 0, 0, 72); el(c, C.sol, 0, 0, 60); texto(c, 'R$', 0, 4, 50, '#8C4A20'); c.restore(); },
  maleta(c) { l(c, C.tinta, 15, 'M-30 44V20Q-30 2 0 2T30 20V44'); rr(c, '#5B3A29', -112, 42, 224, 146, 24); rr(c, '#74503A', -112, 42, 224, 68, 24); rr(c, C.sol, -24, 94, 48, 40, 8); },
  sacola(c) { l(c, C.tinta, 11, 'M-40 40V14Q-40-14 0-14T40 14V40'); f(c, C.creme, 'M-92 34H92L108 208Q108 218 96 218H-96Q-108 218-108 208Z'); f(c, C.verde, 'M-52 38C-70-6-52-36-30-32-14-30-16 6-18 38Z'); el(c, '#E5383B', 34, 30, 34); coracao(c, C.or, 0, 134, 1); },
  telefone(c, t) { rr(c, C.tinta, -56, -150, 112, 200, 22); rr(c, C.creme, -46, -136, 92, 170, 13); c.save(); c.translate(0, -52); c.rotate(Math.sin(t * 9) * 0.14); f(c, C.or, 'M0-44C28-44 34-20 36 6L48 24H-48L-36 6C-34-20-28-44 0-44Z'); el(c, C.or, 0, 32, 12); c.restore(); },
  presente(c) { rr(c, C.or, -82, -118, 164, 148, 14); rr(c, C.esc, -92, -136, 184, 44, 12); rr(c, C.sol, -15, -136, 30, 166, 0); f(c, C.sol, 'M0-134C-50-196-92-176-78-146-70-132-30-130 0-134ZM0-134C50-196 92-176 78-146 70-132 30-130 0-134Z'); },
  balao(c, t) { c.save(); c.scale(1 + Math.sin(t * 3) * 0.04, 1 + Math.sin(t * 3) * 0.04); f(c, '#fff', 'M-104-168C-104-210-72-232-30-232H62C106-232 134-206 134-166V-128C134-88 106-64 62-64H2L-46-18-40-64C-80-68-104-92-104-128Z'); [-46, 14, 74].forEach((x, i) => el(c, C.or, x, -148 + Math.sin(t * 5 + i) * 7, 17)); c.restore(); },
  bolha(c, t) { c.globalAlpha = 0.75 + 0.2 * Math.sin(t * 2); el(c, 'rgba(255,255,255,.9)', 0, -60, 62); c.globalAlpha = 1; texto(c, '😌', 0, -56, 70, '#000'); },
};
const CAPA = (c, t) => { const m = Math.sin(t * 2.2) * 16; f(c, '#A3200F', `M760 360C650 520 ${560 + m} 720 ${520 + m} 900C640 866 700 880 780 862H1196C1276 880 1336 866 ${1456 - m} 900C${1416 - m} 720 1326 520 1216 360Z`); f(c, '#C93018', `M780 360C690 520 ${620 + m} 720 ${590 + m} 872C680 850 720 860 780 850Z`); };
/* pose de cada mão: braço usado e ângulo (o mesmo dos gestos) */
const B = { baixo: 12, cima: 4, aberto: 22 };
/** Como o Lembra se veste em cada assunto */
export const ROUPAS = {
  aniversario: { mood: 'feliz', boca: 'o', cab: 'festa', ros: 'sogra', l: ['cima'], r: ['baixo'], mao: { l: 'presente' } },
  viagem: { mood: 'feliz', cab: 'palha', l: ['cima'], r: ['baixo', null, -34], mao: { r: 'mala' } },
  fe: { mood: 'amor', semBracos: true, ros: 'maos', l: ['baixo'], r: ['baixo'] },
  agua: { mood: 'feliz', l: ['baixo'], r: ['cima'], mao: { r: 'copo' } },
  comida: { mood: 'feliz', boca: 'lingua', cab: 'chef', ros: 'babador', l: ['cima'], r: ['baixo'] },
  treino: { mood: 'feliz', cab: 'faixa', l: ['cima'], r: ['cima'], mao: { r: 'halter' } },
  sono: { mood: 'sono', cab: 'gorro', l: ['baixo'], r: ['baixo'], zzz: true },
  saude: { mood: 'feliz', cab: 'enfermeiro', ros: 'esteto', l: ['baixo'], r: ['cima'], mao: { r: 'coracao' } },
  beleza: { mood: 'feliz', ros: 'laco', l: ['baixo'], r: ['cima'], mao: { r: 'secador' } },
  dinheiro: { mood: 'feliz', ros: 'escuros', l: ['baixo'], r: ['cima'], mao: { r: 'moeda' } },
  estudo: { mood: 'feliz', cab: 'formatura', ros: 'oculos', l: ['baixo'], r: ['cima'], mao: { r: 'livro' } },
  trabalho: { mood: 'feliz', ros: 'gravata', l: ['cima'], r: ['baixo', null, -34], mao: { r: 'maleta' } },
  amor: { mood: 'amor', l: ['baixo'], r: ['cima'], mao: { r: 'coracao' } },
  amigos: { mood: 'feliz', l: ['cima'], r: ['cima'], mao: { r: 'balao' } },
  conquista: { mood: 'feliz', boca: 'riso', cab: 'coroa', l: ['cima'], r: ['cima'], mao: { r: 'trofeu' } },
  calma: { mood: 'amor', cab: 'folha', l: ['baixo'], r: ['baixo'] },
  manha: { mood: 'feliz', l: ['cima'], r: ['cima'], mao: { r: 'caneca' } },
  compras: { mood: 'feliz', l: ['cima'], r: ['baixo', null, -34], mao: { r: 'sacola' } },
  pet: { mood: 'feliz', boca: 'lingua', cab: 'pet', l: ['cima'], r: ['baixo'] },
  obra: { mood: 'feliz', cab: 'capacete', l: ['cima'], r: ['baixo'] },
  digita: { mood: 'feliz', l: ['baixo'], r: ['cima'], mao: { r: 'celular' } },
  grava: { mood: 'feliz', boca: 'o', l: ['baixo'], r: ['cima'], mao: { r: 'microfone' } },
  le: { mood: 'feliz', ros: 'lendo', l: ['baixo'], r: ['baixo'] },
  torcida: { mood: 'feliz', boca: 'riso', l: ['baixo'], r: ['cima'], mao: { r: 'bandeira' } },
  forca: { mood: 'feliz', boca: 'riso', capa: true, l: ['aberto'], r: ['cima'] },
};
/** monta a roupa no formato que o boneco entende */
export function roupa(nome) {
  const r = ROUPAS[nome]; if (!r) return null;
  return { nome, mood: r.mood, semBracos: !!r.semBracos, boca: r.boca, l: r.l, r: r.r, atras: r.capa ? CAPA : null, cab: r.cab ? CAB[r.cab] : null, ros: r.ros ? ROS[r.ros] : null, mao: { l: r.mao?.l ? MAO[r.mao.l] : null, r: r.mao?.r ? MAO[r.mao.r] : null } };
}
/* cachecol liso, nas cores: nada de escudo, listra de uniforme ou símbolo de clube */
export const cachecol = ([a, b]) => (c) => {
  const on = 'M742 668C826 742 1150 742 1234 668L1252 730C1150 812 826 812 724 730Z', pt = 'M1080 742L1166 726 1192 884 1106 900Z';
  l(c, 'rgba(60,20,0,.3)', 12, pt); f(c, a, pt); f(c, b, 'M1099 852L1184 838 1192 884 1106 900Z');
  l(c, 'rgba(60,20,0,.3)', 12, on); f(c, a, on); l(c, b, 16, 'M738 712C826 786 1150 786 1238 712');
};
export const gorro = () => ({ cab: CAB.gorro });
/* palma de cada peça de braço (fração da imagem) */
export const PALMA = { 'baixo-l': [0.38, 0.84], 'baixo-r': [0.62, 0.84], 'cima-l': [0.66, 0.12], 'cima-r': [0.34, 0.12], 'aberto-l': [0.2, 0.22], 'aberto-r': [0.8, 0.22] };
export const ANG = B;
