/* Busca de músicas para o story: o servidor pergunta ao catálogo da Apple Music e, se falhar, ao Deezer.
   (No iPhone a busca direto do app podia ser barrada; aqui não, e o resultado fica guardado um tempo.)
   Só volta o que o app precisa: título, artista, capa, trecho de 30 s e o link da música completa. */
const limpa = (x, n) => String(x || '').replace(/[<>]/g, '').slice(0, n);

async function daApple(termo, fetcher) {
  const u = `https://itunes.apple.com/search?term=${encodeURIComponent(termo)}&media=music&entity=song&country=BR&limit=30`;
  const r = await fetcher(u, { headers: { 'User-Agent': 'Mozilla/5.0 (Lembra)' } });
  if (!r.ok) throw new Error(`apple ${r.status}`);
  const j = await r.json();
  return (j.results || []).filter((x) => x.previewUrl).map((x) => ({
    id: String(x.trackId), titulo: limpa(x.trackName, 80), artista: limpa(x.artistName, 80),
    capa: String(x.artworkUrl100 || '').replace('100x100bb', '300x300bb'), preview: x.previewUrl, link: x.trackViewUrl,
    explicita: x.trackExplicitness === 'explicit', fonte: 'apple',
  }));
}
async function doDeezer(termo, fetcher) {
  const r = await fetcher(`https://api.deezer.com/search?q=${encodeURIComponent(termo)}&limit=30`);
  if (!r.ok) throw new Error(`deezer ${r.status}`);
  const j = await r.json();
  if (j.error) throw new Error('deezer');
  return (j.data || []).filter((x) => x.preview).map((x) => ({
    id: 'dz' + x.id, titulo: limpa(x.title, 80), artista: limpa(x.artist && x.artist.name, 80),
    capa: x.album && (x.album.cover_medium || x.album.cover), preview: x.preview, link: x.link,
    explicita: !!x.explicit_lyrics, fonte: 'deezer',
  }));
}

/** busca (com o resultado guardado por 6 h); devolve [] só se as duas fontes não acharem nada */
export async function buscaMusica(env, termo, { fetcher = fetch } = {}) {
  const q = String(termo || '').trim().toLowerCase().slice(0, 80);
  if (q.length < 2) return { musicas: [] };
  const chave = `mus:${q}`;
  const guardado = await env.CAL.get(chave, 'json');
  if (guardado) return guardado;
  let musicas = [], erros = 0;
  for (const fonte of [daApple, doDeezer]) {
    try { musicas = await fonte(q, fetcher); if (musicas.length) break; } catch (e) { erros++; console.log('busca de música', e.message); }
  }
  if (!musicas.length && erros === 2) throw Object.assign(new Error('A busca de músicas não respondeu agora. Tente de novo.'), { status: 503 });
  const out = { musicas };
  // o trecho do Deezer expira em algumas horas: guarda menos tempo
  await env.CAL.put(chave, JSON.stringify(out), { expirationTtl: musicas.some((m) => m.fonte === 'deezer') ? 3600 : 6 * 3600 });
  return out;
}

/** trecho novo de uma música do Deezer (o link antigo expira; o story dura 24 h) */
export async function trechoDeezer(id, { fetcher = fetch } = {}) {
  const n = String(id || '').replace(/^dz/, '');
  if (!/^\d{1,15}$/.test(n)) return null;
  const r = await fetcher(`https://api.deezer.com/track/${n}`);
  if (!r.ok) return null;
  const j = await r.json();
  return j && j.preview ? j.preview : null;
}
