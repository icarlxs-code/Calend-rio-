import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buscaMusica } from '../src/musica.js';
const kv = () => { const m = new Map(); return { m, get: async (k, t) => (m.has(k) ? (t === 'json' ? JSON.parse(m.get(k)) : m.get(k)) : null), put: async (k, v) => m.set(k, v) }; };
const resp = (o, ok = true) => ({ ok, status: ok ? 200 : 503, json: async () => o });

test('busca de música: Apple primeiro, Deezer se a Apple falhar, e guarda o resultado', async () => {
  const env = { CAL: kv() }; let chamadas = 0;
  const apple = async (u) => { chamadas++; return /itunes/.test(u) ? resp({ results: [{ trackId: 1, trackName: 'Infiel', artistName: 'Marília Mendonça', previewUrl: 'https://audio-ssl.itunes.apple.com/a.m4a', artworkUrl100: 'https://is1.mzstatic.com/100x100bb.jpg', trackViewUrl: 'https://music.apple.com/x' }] }) : resp({}, false); };
  const r = await buscaMusica(env, 'Marília', { fetcher: apple });
  assert.equal(r.musicas[0].titulo, 'Infiel'); assert.equal(r.musicas[0].fonte, 'apple'); assert.match(r.musicas[0].capa, /300x300bb/);
  await buscaMusica(env, 'marília', { fetcher: apple }); assert.equal(chamadas, 1, 'a segunda vez vem guardada');
  const semApple = async (u) => (/itunes/.test(u) ? resp({}, false) : resp({ data: [{ id: 9, title: 'Envolver', artist: { name: 'Anitta' }, preview: 'https://cdnt-preview.dzcdn.net/x.mp3', album: { cover_medium: 'https://cdn-images.dzcdn.net/c.jpg' }, link: 'https://www.deezer.com/track/9' }] }));
  const d = await buscaMusica({ CAL: kv() }, 'anitta', { fetcher: semApple });
  assert.equal(d.musicas[0].fonte, 'deezer'); assert.equal(d.musicas[0].id, 'dz9');
  await assert.rejects(buscaMusica({ CAL: kv() }, 'x y', { fetcher: async () => resp({}, false) }), /não respondeu/);
});
