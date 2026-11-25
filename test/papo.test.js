import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const guarda = {};
globalThis.localStorage = { getItem: (k) => guarda[k] ?? null, setItem: (k, v) => { guarda[k] = v; } };
const M = await import('../js/papo.js');
const profs = readFileSync(new URL('../functions/catalog.js', import.meta.url), 'utf8').split('\n').filter((l) => /^ {2}\.\.\.P\('/.test(l)).flatMap((l) => [...l.slice(l.indexOf('[')).matchAll(/'([^']+)'/g)].map((m) => m[1]));
test('papo: milhares de falas e toda profissão tem as suas', () => {
  const t = M.total(); assert.ok(t.soma > 30000 && t.menor > 500, JSON.stringify(t)); assert.ok(profs.length > 200);
  for (const p of profs) for (let i = 0; i < 12; i++) { const f = M.daProfissao({ prof: p, h: (i * 2) % 24, dow: i % 7, pron: 'fmn'[i % 3] }); assert.ok(f && !/[{}]|undefined|\b(pra|de|em) (o|a|os|as) (?=[a-z])/.test(f.replace(/pra a gente/g, '')), `${p}: ${f}`); }
});
test('papo: não repete em 300 falas', () => { const v = new Set(); let rep = 0; for (let i = 0; i < 300; i++) { const f = M.daProfissao({ prof: 'Médico', h: 9, dow: 3 }); if (v.has(f)) rep++; v.add(f); M.anota(f); } assert.ok(rep <= 6, String(rep)); });
test('papo: assunto sério não vira piada e senha não aparece', () => {
  for (const x of ['velório do tio', 'quimioterapia', 'senha do banco 1234', 'audiência de divórcio']) assert.equal(M.doQueMarcou([{ tipo: 'vem', x }]), null, x);
  assert.equal(M.trocadilho('hospital da mãe'), ''); assert.ok(M.trocadilho('comprar café'));
});
test('papo: par certo', () => { const w = (p) => M.profissaoDe(p).t[0]; assert.equal(w('Fisioterapeuta'), 'a faixa elástica'); assert.equal(w('Telemarketing'), 'a maquininha'); assert.equal(w('Biomédico'), 'o jaleco'); assert.equal(w('Lash designer'), 'a pinça'); assert.equal(w('Técnico em segurança do trabalho'), 'o capacete'); assert.equal(w('Domador de leões'), 'o celular'); });
