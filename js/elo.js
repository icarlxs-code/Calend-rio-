/* FreeSignal · elo direto: dois aparelhos conversando SEM internet e SEM servidor.
   Como: o aperto de mão do WebRTC (que normalmente passa por um servidor de sinalização) é espremido
   num cartão de poucos bytes e entregue pelo canal de som (ou por QR). Feito isso, os dois falam
   direto pela rede local — o Wi-Fi do roteador sem internet, o ponto de acesso de um dos celulares,
   a rede da escola. Nada sai para a internet; nem precisa existir internet.

   O cartão carrega só o indispensável: identificação da sessão (ufrag/pwd), a impressão digital do
   DTLS (a prova de que é o mesmo aparelho) e os endereços locais. O resto do SDP é remontado dos dois
   lados a partir de um molde, porque é igual em todo navegador moderno. */

const TXT = new TextEncoder(), DEC = new TextDecoder();
const b64 = (u8) => btoa(String.fromCharCode(...u8));
const deb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

/* ---------- cartão: campos → bytes ---------- */
export function montaCartao({ papel, ufrag, pwd, fp, cands }) {
  const partes = [];
  const poe = (tipo, bytes) => { partes.push(Uint8Array.from([tipo, bytes.length & 255, (bytes.length >> 8) & 255]), bytes); };
  poe(1, TXT.encode(ufrag));
  poe(2, TXT.encode(pwd));
  poe(3, Uint8Array.from(fp.split(':').map((h) => parseInt(h, 16))));      // 32 bytes, não 95 de texto
  for (const c of cands) poe(4, TXT.encode(`${c.host}:${c.port}:${c.typ || 'host'}:${c.proto || 'udp'}`));
  const total = partes.reduce((n, p) => n + p.length, 0), out = new Uint8Array(2 + total);
  out[0] = 1;                       // versão do formato
  out[1] = papel === 'oferta' ? 0 : 1;
  let k = 2; for (const p of partes) { out.set(p, k); k += p.length; }
  return out;
}
export function leCartao(u8) {
  if (!u8 || u8[0] !== 1) return null;
  const r = { papel: u8[1] === 0 ? 'oferta' : 'resposta', cands: [] };
  let i = 2;
  while (i + 3 <= u8.length) {
    const tipo = u8[i], n = u8[i + 1] | (u8[i + 2] << 8), corpo = u8.subarray(i + 3, i + 3 + n); i += 3 + n;
    if (tipo === 1) r.ufrag = DEC.decode(corpo);
    else if (tipo === 2) r.pwd = DEC.decode(corpo);
    else if (tipo === 3) r.fp = [...corpo].map((b) => b.toString(16).padStart(2, '0').toUpperCase()).join(':');
    else if (tipo === 4) { const [host, port, typ, proto] = DEC.decode(corpo).split(':'); r.cands.push({ host, port: Number(port), typ, proto }); }
  }
  return r.ufrag && r.pwd && r.fp ? r : null;
}
export const cartaoTexto = (u8) => b64(u8);
export const cartaoDeTexto = (s) => leCartao(deb64(s));

/* ---------- SDP: tira o essencial e remonta ---------- */
function espreme(sdp, papel) {
  const pega = (re) => (sdp.match(re) || [])[1] || '';
  const cands = [...sdp.matchAll(/a=candidate:\S+ \d+ (udp|tcp) \d+ (\S+) (\d+) typ (\w+)/gi)]
    .map((m) => ({ proto: m[1].toLowerCase(), host: m[2], port: Number(m[3]), typ: m[4] }))
    .filter((c) => c.typ === 'host' && c.proto === 'udp')
    .slice(0, 4);
  return { papel, ufrag: pega(/a=ice-ufrag:(\S+)/), pwd: pega(/a=ice-pwd:(\S+)/), fp: pega(/a=fingerprint:sha-256 (\S+)/), cands };
}
/** remonta um SDP válido a partir do cartão (o molde é igual em todo navegador atual) */
export function sdpDoCartao(c) {
  const sessao = ['v=0', 'o=- 1 1 IN IP4 127.0.0.1', 's=-', 't=0 0', 'a=group:BUNDLE 0', 'a=msid-semantic: WMS'];
  const linhas = [
    'm=application 9 UDP/DTLS/SCTP webrtc-datachannel',
    'c=IN IP4 0.0.0.0',
    'a=ice-options:trickle',
    `a=ice-ufrag:${c.ufrag}`,
    `a=ice-pwd:${c.pwd}`,
    `a=fingerprint:sha-256 ${c.fp}`,
    `a=setup:${c.papel === 'oferta' ? 'actpass' : 'active'}`,
    'a=mid:0',
    'a=sctp-port:5000',
    'a=max-message-size:262144',
  ];
  for (const [i, k] of (c.cands || []).entries()) linhas.push(`a=candidate:${i + 1} 1 udp ${2122260223 - i} ${k.host} ${k.port} typ ${k.typ || 'host'} generation 0`);
  linhas.push('a=end-of-candidates');
  return `${[...sessao, ...linhas].join('\r\n')}\r\n`;
}

const juntaCandidatos = (pc, prazo = 2500) => new Promise((pronto) => {
  if (pc.iceGatheringState === 'complete') return pronto();
  const t = setTimeout(fim, prazo);
  function fim() { clearTimeout(t); pc.removeEventListener('icegatheringstatechange', ver); pronto(); }
  function ver() { if (pc.iceGatheringState === 'complete') fim(); }
  pc.addEventListener('icegatheringstatechange', ver);
  pc.addEventListener('icecandidate', (e) => { if (!e.candidate) fim(); });
});

/** quem começa: cria o convite (cartão de oferta) */
export async function convida({ prazo = 2500 } = {}) {
  const pc = new RTCPeerConnection({ iceServers: [] });        // sem STUN: nada sai para a internet
  const canal = pc.createDataChannel('lembra', { ordered: true });
  const oferta = await pc.createOffer();
  await pc.setLocalDescription(oferta);
  await juntaCandidatos(pc, prazo);
  const cartao = montaCartao(espreme(pc.localDescription.sdp, 'oferta'));
  return { pc, canal, cartao, texto: cartaoTexto(cartao) };
}
/** quem recebe o convite: aplica e devolve o cartão de resposta */
export async function aceita(cartaoOferta, { prazo = 2500 } = {}) {
  const c = cartaoOferta instanceof Uint8Array ? leCartao(cartaoOferta) : cartaoDeTexto(String(cartaoOferta));
  if (!c) throw new Error('cartão inválido');
  const pc = new RTCPeerConnection({ iceServers: [] });
  const espera = new Promise((ok) => { pc.ondatachannel = (e) => ok(e.channel); });
  await pc.setRemoteDescription({ type: 'offer', sdp: sdpDoCartao({ ...c, papel: 'oferta' }) });
  const resp = await pc.createAnswer();
  await pc.setLocalDescription(resp);
  await juntaCandidatos(pc, prazo);
  const cartao = montaCartao(espreme(pc.localDescription.sdp, 'resposta'));
  return { pc, canal: espera, cartao, texto: cartaoTexto(cartao) };
}
/** quem começou aplica a resposta e o elo fecha */
export async function fecha(pc, cartaoResposta) {
  const c = cartaoResposta instanceof Uint8Array ? leCartao(cartaoResposta) : cartaoDeTexto(String(cartaoResposta));
  if (!c) throw new Error('cartão inválido');
  await pc.setRemoteDescription({ type: 'answer', sdp: sdpDoCartao({ ...c, papel: 'resposta' }) });
  return true;
}
/** espera o canal abrir de verdade (ou desiste) */
export const esperaAbrir = (canal, ms = 12000) => new Promise((ok, no) => {
  if (canal.readyState === 'open') return ok(canal);
  const t = setTimeout(() => no(new Error('o elo não abriu')), ms);
  canal.addEventListener('open', () => { clearTimeout(t); ok(canal); });
  canal.addEventListener('error', () => { clearTimeout(t); no(new Error('erro no elo')); });
});
