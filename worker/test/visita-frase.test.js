import test from 'node:test';
import assert from 'node:assert/strict';
import { fraseVisita } from '../src/visita-frase.js';
test('primeira visita não revela o nome', () => { const f = fraseVisita({ nome: 'Nat Souza', hoje: 1, semente: 'a' }); assert.ok(!/Nat/.test(f.title + f.body)); });
test('visitas repetidas citam a pessoa e a contagem', () => { const f = fraseVisita({ nome: 'Nat Souza', hoje: 4, semente: 'b' }); assert.match(f.title + f.body, /Nat/); assert.ok(!/\{/.test(f.title + f.body)); });
test('nunca repete a última frase', () => { for (let k = 0; k < 50; k++) { const a = fraseVisita({ hoje: 3, semente: String(k) }); const b = fraseVisita({ hoje: 3, semente: String(k), ultima: a.idx }); assert.notEqual(a.idx, b.idx); } });
