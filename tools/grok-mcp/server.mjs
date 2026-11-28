#!/usr/bin/env node
/* Servidor MCP (STDIO) do Grok Imagine, da xAI — uso interno do projeto Lembra.
   Sem dependências: fala o protocolo MCP (JSON-RPC 2.0, uma mensagem por linha) direto na entrada/saída padrão.
   - A chave vem SOMENTE da variável de ambiente XAI_API_KEY (nunca fica no código nem nos logs).
   - Salva os resultados em grok-imagens/ na raiz do projeto e devolve o caminho dos arquivos.
   - Só envia para a API a imagem de referência pedida (nenhum outro arquivo do projeto). */
import { readFile, writeFile, mkdir, appendFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, extname, basename, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const MODELO = 'grok-imagine-image-2.0';
const API = process.env.XAI_API_BASE || 'https://api.x.ai/v1'; // XAI_API_BASE só para testes locais
const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const PASTA = join(RAIZ, 'grok-imagens');
const LOG = join(PASTA, 'registro.jsonl');
const PROPORCOES = ['1:1', '16:9', '9:16', '4:3', '3:4', '3:2', '2:3'];
const MAX_REF_BYTES = 8 * 1024 * 1024;
const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' };

/** nunca devolve a chave: troca qualquer ocorrência por *** antes de qualquer texto sair do servidor */
const chave = () => process.env.XAI_API_KEY || '';
const limpa = (t) => { const k = chave(); let s = String(t ?? ''); if (k && k.length > 6) s = s.split(k).join('***'); return s; };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const slug = (s) => createHash('sha1').update(String(s)).digest('hex').slice(0, 8);

async function chamaApi(caminho, corpo) {
  if (!chave()) throw new Error('XAI_API_KEY não definida no ambiente. Defina a variável e reinicie o Claude Code.');
  let ultimo;
  for (let t = 0; t < 3; t++) {
    const r = await fetch(`${API}${caminho}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${chave()}` },
      body: JSON.stringify(corpo),
    });
    const txt = await r.text();
    let j = null; try { j = JSON.parse(txt); } catch { /* não é JSON */ }
    if (r.ok) return j;
    ultimo = `${r.status} ${limpa(j?.error || j?.code || txt.slice(0, 300))}`;
    if (r.status === 429 || r.status >= 500) { await sleep(1500 * (t + 1)); continue; }
    break;
  }
  throw new Error(`API da xAI recusou: ${ultimo}`);
}

async function baixa(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`não consegui baixar a imagem (${r.status})`);
  return Buffer.from(await r.arrayBuffer());
}

/** extensão pelo conteúdo (não pelo nome): PNG, JPG ou WEBP */
function formatoDe(b) {
  if (b.length > 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'png';
  if (b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'jpg';
  if (b.length > 12 && b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') return 'webp';
  return 'bin';
}

async function salvaImagens(lista, meta) {
  await mkdir(PASTA, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const arquivos = [];
  for (const [i, it] of lista.entries()) {
    const buf = it.b64_json ? Buffer.from(it.b64_json, 'base64') : it.url ? await baixa(it.url) : null;
    if (!buf) continue;
    const ext = formatoDe(buf);
    const nome = `${stamp}-${slug(meta.prompt + i)}-${i + 1}.${ext}`;
    const caminho = join(PASTA, nome);
    await writeFile(caminho, buf);
    arquivos.push({ arquivo: caminho, relativo: `grok-imagens/${nome}`, bytes: buf.length });
  }
  await appendFile(LOG, JSON.stringify({ quando: new Date().toISOString(), ...meta, arquivos: arquivos.map((a) => a.relativo) }) + '\n');
  return arquivos;
}

async function lerReferencia(p) {
  const abs = resolve(RAIZ, p);
  if (!abs.startsWith(RAIZ + '/') && abs !== RAIZ) throw new Error('a imagem de referência precisa estar dentro do projeto');
  if (!existsSync(abs)) throw new Error(`imagem de referência não encontrada: ${p}`);
  const mime = MIME[extname(abs).toLowerCase()];
  if (!mime) throw new Error('formato de referência não suportado (use PNG, JPG ou WEBP)');
  const buf = await readFile(abs);
  if (buf.length > MAX_REF_BYTES) throw new Error('imagem de referência acima de 8 MB');
  return `data:${mime};base64,${buf.toString('base64')}`;
}

/* ---------- ferramentas ---------- */
const FRASE_PT = 'Escreva o prompt em português do Brasil e descreva a cena com detalhes: sujeito, estilo, cores, luz e composição.';

const FERRAMENTAS = {
  gerar_imagem_grok: {
    descricao: `Gera imagens com o Grok Imagine (xAI) a partir de uma descrição. ${FRASE_PT} Salva em grok-imagens/ e devolve os caminhos.`,
    schema: {
      type: 'object',
      properties: {
        prompt: { type: 'string', description: 'O que gerar, em português do Brasil.' },
        proporcao: { type: 'string', enum: PROPORCOES, description: 'Proporção da imagem. Padrão 9:16 (formato de story).' },
        quantidade: { type: 'integer', minimum: 1, maximum: 4, description: 'Quantas variações (1 a 4).' },
        transparente: { type: 'boolean', description: 'Fundo transparente. Hoje NÃO é garantido por este modelo: a ferramenta recusa e explica, em vez de gerar com fundo branco.' },
      },
      required: ['prompt'],
    },
    async run(a) {
      if (a.transparente) return { erro: 'Fundo transparente não tem suporte confirmado para o grok-imagine-image-2.0 na documentação da xAI. Gere com fundo liso e recorte depois, ou use uma ferramenta que suporte PNG com alfa.' };
      const corpo = { model: MODELO, prompt: String(a.prompt), n: a.quantidade || 1, aspect_ratio: a.proporcao || '9:16', response_format: 'b64_json' };
      const r = await chamaApi('/images/generations', corpo);
      const arquivos = await salvaImagens(r.data || [], { ferramenta: 'gerar', prompt: corpo.prompt, proporcao: corpo.aspect_ratio });
      return { ok: true, modelo: MODELO, arquivos };
    },
  },
  editar_imagem_grok: {
    descricao: `Edita uma imagem de referência do projeto com o Grok Imagine (xAI). Use para trocar cenário, roupa, cores ou inserir elementos mantendo o personagem. ${FRASE_PT} Descreva o que MUDAR e o que PRESERVAR.`,
    schema: {
      type: 'object',
      properties: {
        imagem: { type: 'string', description: 'Caminho da imagem de referência, relativo à raiz do projeto (ex.: assets/mascot/x.png).' },
        prompt: { type: 'string', description: 'A edição, em português do Brasil. Diga o que preservar (ex.: "mantenha o mascote igual, troque o fundo por um estádio").' },
        proporcao: { type: 'string', enum: PROPORCOES },
        quantidade: { type: 'integer', minimum: 1, maximum: 4 },
      },
      required: ['imagem', 'prompt'],
    },
    async run(a) {
      const img = await lerReferencia(a.imagem);
      const corpo = { model: MODELO, prompt: String(a.prompt), image: { url: img, type: 'image_url' }, n: a.quantidade || 1, response_format: 'b64_json' };
      if (a.proporcao) corpo.aspect_ratio = a.proporcao;
      const r = await chamaApi('/images/edits', corpo);
      const arquivos = await salvaImagens(r.data || [], { ferramenta: 'editar', referencia: a.imagem, prompt: corpo.prompt });
      return { ok: true, modelo: MODELO, referencia: a.imagem, arquivos };
    },
  },
  refinar_imagem_grok: {
    descricao: `Refina uma imagem JÁ GERADA pelo Grok (um resultado de grok-imagens/) com novas instruções, em cima do próprio resultado. Use para ajustes sucessivos ("deixe o céu mais claro", "tire o texto de baixo"). ${FRASE_PT}`,
    schema: {
      type: 'object',
      properties: {
        resultado: { type: 'string', description: 'Caminho de um resultado gerado, ex.: grok-imagens/2026-....jpg' },
        ajuste: { type: 'string', description: 'O ajuste a aplicar, em português do Brasil.' },
      },
      required: ['resultado', 'ajuste'],
    },
    async run(a) {
      if (!String(a.resultado).startsWith('grok-imagens/')) throw new Error('refinar só funciona com resultados da pasta grok-imagens/');
      return FERRAMENTAS.editar_imagem_grok.run({ imagem: a.resultado, prompt: `${a.ajuste}. Mantenha o restante da imagem igual.` });
    },
  },
  consultar_geracao_grok: {
    descricao: 'Mostra o registro de gerações e edições feitas com o Grok neste projeto (o que foi pedido, de qual referência e onde estão os arquivos). Sem argumentos: as últimas 10.',
    schema: { type: 'object', properties: { quantidade: { type: 'integer', minimum: 1, maximum: 50 } } },
    async run(a) {
      if (!existsSync(LOG)) return { registros: [] };
      const linhas = (await readFile(LOG, 'utf8')).trim().split('\n').filter(Boolean).map((l) => JSON.parse(l));
      return { total: linhas.length, registros: linhas.slice(-(a.quantidade || 10)) };
    },
  },
};

/* ---------- protocolo MCP (STDIO) ---------- */
const enviar = (obj) => process.stdout.write(JSON.stringify(obj) + '\n');
const resposta = (id, result) => enviar({ jsonrpc: '2.0', id, result });
const erro = (id, code, message) => enviar({ jsonrpc: '2.0', id, error: { code, message } });

async function trata(msg) {
  const { id, method, params } = msg;
  if (method === 'initialize') return resposta(id, { protocolVersion: params?.protocolVersion || '2024-11-05', capabilities: { tools: {} }, serverInfo: { name: 'grok-imagine', version: '1.0.0' } });
  if (method === 'notifications/initialized' || method === 'notifications/cancelled') return;
  if (method === 'ping') return resposta(id, {});
  if (method === 'tools/list') return resposta(id, { tools: Object.entries(FERRAMENTAS).map(([name, t]) => ({ name, description: t.descricao, inputSchema: t.schema })) });
  if (method === 'tools/call') {
    const f = FERRAMENTAS[params?.name];
    if (!f) return erro(id, -32602, `ferramenta desconhecida: ${params?.name}`);
    try {
      const out = await f.run(params.arguments || {});
      return resposta(id, { content: [{ type: 'text', text: JSON.stringify(out, null, 2) }], isError: !!out?.erro });
    } catch (e) {
      return resposta(id, { content: [{ type: 'text', text: limpa(e.message) }], isError: true });
    }
  }
  if (id !== undefined) erro(id, -32601, `método não suportado: ${method}`);
}

let buf = '';
const pendentes = new Set();
let fechou = false;
const encerra = () => { if (fechou && pendentes.size === 0) process.exit(0); };
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  buf += chunk;
  let i;
  while ((i = buf.indexOf('\n')) >= 0) {
    const linha = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
    if (!linha) continue;
    let msg; try { msg = JSON.parse(linha); } catch { continue; }
    const p = trata(msg).catch((e) => { if (msg.id !== undefined) erro(msg.id, -32603, limpa(e.message)); }).finally(() => { pendentes.delete(p); encerra(); });
    pendentes.add(p);
  }
});
/* a entrada fechou: termina só depois das respostas que já estão em andamento */
process.stdin.on('end', () => { fechou = true; encerra(); });
