/* A IA grátis recebe a regra do "dia N" e as regras de contas; a regra precisa dar a MESMA data que o app calcula. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { calendarHelp } from '../src/freeai.js';
import { proximoDiaDoMes } from '../../js/frase-conta.js';

/* lê a regra escrita para a IA e aplica a um dia N, como o modelo faria */
function pelaRegra(texto, n) {
  const regra = /"dia N" sem mês = [^:]+: (.+)\.$/.exec(texto)[1];
  for (const parte of regra.split('; ')) {
    const m = /^dia (\d+)(?: a (\d+))? → (\d{4}-\d{2})(?:-N|-(\d{2}))/.exec(parte);
    const de = +m[1], ate = +(m[2] || m[1]);
    if (n < de || n > ate) continue;
    if (m[4]) return `${m[3]}-${m[4]}`;
    const ult = /em (\d{4}-\d{2}) o último dia é (\d+)/.exec(parte);
    return `${m[3]}-${String(ult && ult[1] === m[3] ? Math.min(n, +ult[2]) : n).padStart(2, '0')}`;
  }
  return null;
}
test('regra do "dia N" para a IA bate com o app em todo dia do mês (virada de mês, de ano e fevereiro)', () => {
  for (const hoje of ['2026-11-27', '2026-11-01', '2026-12-28', '2026-12-31', '2027-01-31', '2027-02-27', '2028-02-29', '2027-04-30']) {
    const txt = calendarHelp(hoje);
    for (let n = 1; n <= 31; n++) assert.equal(pelaRegra(txt, n), proximoDiaDoMes(n, hoje), `${hoje} dia ${n}`);
  }
});
test('regras de contas no prompt: categoria pagar, mensal com dia_mes, valor numérico e título limpo', () => {
  const src = readFileSync(new URL('../src/freeai.js', import.meta.url), 'utf8');
  assert.match(src, /"repetir":"monthly","dia_mes":10,"valor":1500/);
  assert.match(src, /Nunca copie o jeito de pedir/);
  assert.match(src, /"R\$ 1\.200,50" → 1200\.5/);
});
