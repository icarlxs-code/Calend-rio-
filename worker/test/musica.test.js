import { test } from 'node:test';
import assert from 'node:assert/strict';
import { musicaOk } from '../src/index.js';

test('música do story: só trechos e capas da Apple, textos limpos, trecho dentro dos 30 s', () => {
  const m = musicaOk({ id: '1', titulo: 'Infiel <b>', artista: 'Marília', capa: 'https://is1-ssl.mzstatic.com/a.jpg', preview: 'https://audio-ssl.itunes.apple.com/x.m4a', link: 'https://music.apple.com/br/album/1', inicio: 99, estilo: 'mini', x: 2, y: 0.5 });
  assert.equal(m.titulo, 'Infiel b'); assert.equal(m.inicio, 15); assert.equal(m.x, 0.9); assert.equal(m.estilo, 'mini');
  assert.equal(musicaOk({ preview: 'https://evil.com/x.m4a' }), null);
  assert.equal(musicaOk({ preview: 'javascript:alert(1)' }), null);
  assert.equal(musicaOk({ preview: 'https://audio-ssl.itunes.apple.com/x.m4a', capa: 'https://evil.com/c.jpg' }).capa, null);
});
