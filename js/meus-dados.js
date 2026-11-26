/* "Baixar meus dados" em três formatos:
   - Relatório (.html): feito para a pessoa LER, com tudo em português e organizado por assunto;
   - Planilha (.csv): a agenda e o Pessoal para abrir no Excel, Planilhas Google ou Numbers;
   - Arquivo técnico (.json): a cópia fiel, para levar a outro aplicativo (portabilidade da LGPD).
   Tudo é montado no próprio aparelho. */
import { CONFIG } from '../config.js';
import { todayKey } from './utils.js';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const dataBR = (d) => { if (!d) return ''; const s = String(d); const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/); if (m) return `${m[3]}/${m[2]}/${m[1]}`; const t = Number(s) || Date.parse(s); return t ? new Date(t).toLocaleString('pt-BR') : s; };
const horaBR = (h) => (/^\d\d:\d\d/.test(h || '') ? h.slice(0, 5) : '');

/* nomes bonitos para os campos da ficha */
const ROTULO = {
  name: 'Nome', nickname: 'Apelido', birth: 'Nascimento', phone: 'Celular', email: 'E-mail',
  profession: 'Profissão', role: 'Cargo ou função', workplace: 'Onde trabalha', area: 'Área', arch: 'Tipo de rotina',
  gender: 'Gênero', pronoun: 'Tratamento', journey: 'Jornada', volume: 'Volume de compromissos', method: 'Como se organiza',
  goals: 'Objetivos', tone: 'Tom das mensagens', city: 'Cidade', bairro: 'Bairro', time: 'Time do coração', timeId: 'Time do coração',
  consentAt: 'Aceitou os termos em', termsVersion: 'Versão dos termos', termsAcceptedAt: 'Termos aceitos em', fichaConsentAt: 'Ficha preenchida em',
  newsVista: 'Última novidade vista', createdAt: 'Conta criada em', updatedAt: 'Atualizado em', id: 'Identificador', uid: 'Identificador',
  photo: 'Foto', teams: 'Agendas compartilhadas', dificuldades: 'Dificuldades', rotina: 'Rotina',
};
/* valores que o app guarda em código viram palavras */
const TRAD = {
  pronoun: { f: 'No feminino', m: 'No masculino', n: 'Neutro' },
  gender: { mulher: 'Mulher', homem: 'Homem', mulher_trans: 'Mulher trans', homem_trans: 'Homem trans', nao_binario: 'Não binário', nao_dizer: 'Prefiro não dizer' },
  plan: { monthly: 'Mensal', yearly: 'Anual', lifetime: 'Vitalício', shared: 'Agenda compartilhada', free: 'Grátis', blocked: 'Sem plano' },
  cat: { saude: 'Saúde', beleza: 'Beleza', compras: 'Compras', compromisso: 'Compromisso', lembrete: 'Lembrete', estudo: 'Estudos', casa: 'Casa', trabalho: 'Trabalho', financeiro: 'Dinheiro' },
  repeat: { none: 'Não repete', daily: 'Todo dia', weekly: 'Toda semana', biweekly: 'A cada 2 semanas', monthly: 'Todo mês', yearly: 'Todo ano' },
  arch: { marketing: 'Conteúdo e marketing', saude_plantao: 'Plantões', saude_clinica: 'Consultório', educacao: 'Educação', vendas: 'Vendas', obra: 'Obra', transporte: 'Transporte', beleza: 'Beleza', estudante: 'Estudos' },
};
const traduz = (k, v) => (TRAD[k] && TRAD[k][v]) || v;
const ESCONDE = new Set(['cpf', 'cpfHash', 'photo', 'pushTokens', 'devices']);
const rotulo = (k) => ROTULO[k] || k.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase());
const valor = (v) => {
  if (v == null || v === '') return '—';
  if (typeof v === 'boolean') return v ? 'sim' : 'não';
  if (Array.isArray(v)) return v.length ? v.map((x) => (typeof x === 'object' ? JSON.stringify(x) : String(x))).join(', ') : '—';
  if (typeof v === 'object') return Object.entries(v).map(([a, b]) => `${rotulo(a)}: ${typeof b === 'object' ? JSON.stringify(b) : b}`).join(' · ') || '—';
  if (typeof v === 'number' && v > 1e12) return dataBR(v);
  if (/^\d{4}-\d{2}-\d{2}/.test(String(v))) return dataBR(v);
  return String(v);
};
const linhas = (obj, pula = ESCONDE) => Object.entries(obj || {}).filter(([k, v]) => !pula.has(k) && v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && !v.length)).map(([k, v]) => `<tr><th>${esc(rotulo(k))}</th><td>${esc(valor(traduz(k, v)))}</td></tr>`).join('');

const ESTADO = { feito: 'Feito', pendente: 'Pendente', atrasado: 'Atrasado' };
const porData = (a, b) => `${a.date || ''}${a.time || ''}`.localeCompare(`${b.date || ''}${b.time || ''}`);

/** o relatório que a pessoa abre e lê */
export function relatorio(d) {
  const app = d.app || 'Lembra';
  const ev = [...(d.trabalho?.compromissos || d.trabalho?.compromissosCadastradosPorVoce || [])].sort(porData);
  const grupos = d.trabalho?.grupos || [];
  const nomeGrupo = (id) => grupos.find((c) => c.id === id)?.name || '';
  const pes = d.pessoal || [];
  const itens = pes.filter((x) => x.kind === 'item' || !x.kind);
  const listas = pes.filter((x) => x.kind === 'list');
  const bilhetes = [...pes.filter((x) => x.kind === 'memo'), ...(d.trabalho?.bilhetes || d.trabalho?.bilhetesSeus || [])];
  const r = d.retrospectiva || {};
  const nome = (d.ficha?.nickname || d.ficha?.name || '').trim();
  const bloco = (titulo, corpo, vazio = 'Nada por aqui.') => `<section><h2>${esc(titulo)}</h2>${corpo || `<p class="vazio">${vazio}</p>`}</section>`;
  const tabela = (cab, corpo) => `<div class="rol"><table><thead><tr>${cab.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${corpo}</tbody></table></div>`;

  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Meus dados no ${esc(app)}</title><style>
  :root { color-scheme: light; --l: #EADBC8; --t: #2B1710; --t2: #6B5245; --ac: #C9400A; }
  * { box-sizing: border-box; }
  body { margin: 0; padding: 22px 16px 60px; background: #FFF6EA; color: var(--t); font: 16px/1.5 system-ui, -apple-system, 'Segoe UI', sans-serif; }
  .folha { max-width: 800px; margin: 0 auto; }
  h1 { margin: 0 0 4px; font-size: 27px; } h2 { margin: 30px 0 10px; font-size: 20px; border-bottom: 2px solid var(--l); padding-bottom: 6px; }
  .sub { color: var(--t2); margin: 0 0 18px; }
  .cartoes { display: flex; flex-wrap: wrap; gap: 10px; margin: 16px 0 4px; }
  .c { flex: 1 1 120px; padding: 12px 14px; border-radius: 14px; background: #fff; border: 1px solid var(--l); }
  .c b { display: block; font-size: 23px; color: var(--ac); } .c span { font-size: 13.5px; color: var(--t2); }
  table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 12px; overflow: hidden; font-size: 15px; }
  th, td { text-align: left; padding: 9px 12px; border-bottom: 1px solid var(--l); vertical-align: top; }
  thead th { background: #FFEFE0; font-size: 13.5px; text-transform: uppercase; letter-spacing: .02em; }
  tbody tr:last-child th, tbody tr:last-child td { border-bottom: 0; }
  table th { width: 42%; color: var(--t2); font-weight: 700; }
  thead th { width: auto; color: var(--t); }
  .rol { overflow-x: auto; border: 1px solid var(--l); border-radius: 12px; }
  .rol table { border-radius: 0; border: 0; } .vazio { color: var(--t2); font-style: italic; }
  .lista { margin: 0 0 14px; padding: 12px 14px; background: #fff; border: 1px solid var(--l); border-radius: 12px; }
  .lista b { display: block; margin-bottom: 6px; } .lista ul { margin: 0; padding-left: 20px; } .lista li.ok { color: var(--t2); text-decoration: line-through; }
  .nota { margin: 0 0 10px; padding: 12px 14px; background: #fff; border-left: 4px solid var(--ac); border-radius: 0 12px 12px 0; }
  .nota small { display: block; color: var(--t2); }
  footer { margin-top: 36px; padding-top: 14px; border-top: 1px solid var(--l); color: var(--t2); font-size: 13.5px; }
  @media print { body { background: #fff; } .c, table, .lista, .nota { border-color: #ccc; } }
</style></head><body><div class="folha">
<h1>Meus dados no ${esc(app)}</h1>
<p class="sub">${nome ? `${esc(nome)} · ` : ''}${esc(d.conta?.email || '')}<br>Gerado em ${esc(new Date(d.exportadoEm || Date.now()).toLocaleString('pt-BR'))}</p>
<div class="cartoes">
  <div class="c"><b>${ev.length}</b><span>compromissos</span></div>
  <div class="c"><b>${itens.length}</b><span>lembretes do Pessoal</span></div>
  <div class="c"><b>${listas.length}</b><span>listas</span></div>
  <div class="c"><b>${bilhetes.length}</b><span>bilhetes e notas</span></div>
</div>
${bloco('Minha ficha', linhas(d.ficha) ? `<table><tbody>${linhas(d.ficha)}</tbody></table>` : '', 'A ficha ainda não foi preenchida.')}
${bloco('Minha conta', `<table><tbody>${linhas({ 'E-mail': d.conta?.email, 'Conta criada em': d.conta?.criadaEm ? dataBR(d.conta.criadaEm) : '', Plano: d.plano?.plan ? traduz('plan', d.plano.plan) : 'sem plano ativo', 'Plano válido até': d.plano?.paidUntil ? dataBR(d.plano.paidUntil) : '' })}</tbody></table>`)}
${bloco('Agenda (Trabalho)', ev.length ? tabela(['Data', 'Hora', 'O quê', 'Grupo', 'Estado'], ev.map((e) => `<tr><td>${esc(dataBR(e.date))}</td><td>${esc(horaBR(e.time))}</td><td>${esc(e.title || '')}${e.description ? `<br><small>${esc(e.description)}</small>` : ''}</td><td>${esc(nomeGrupo(e.companyId))}</td><td>${esc(ESTADO[e.status] || e.status || '')}</td></tr>`).join('')) : '')}
${bloco('Pessoal — lembretes', itens.length ? tabela(['Data', 'Hora', 'Lembrete', 'Tipo', 'Repete', 'Feito'], itens.sort(porData).map((p) => `<tr><td>${esc(dataBR(p.date))}</td><td>${esc(horaBR(p.time))}</td><td>${esc(p.title || '')}</td><td>${esc(traduz('cat', p.cat) || '')}</td><td>${esc(p.repeat && p.repeat !== 'none' ? traduz('repeat', p.repeat) : '—')}</td><td>${p.done ? 'sim' : 'não'}</td></tr>`).join('')) : '')}
${bloco('Pessoal — listas', listas.map((l) => `<div class="lista"><b>${esc(l.name || 'Lista')}</b><ul>${(l.entries || []).map((e) => `<li class="${e.done ? 'ok' : ''}">${esc(e.text || '')}</li>`).join('') || '<li class="vazio">vazia</li>'}</ul></div>`).join(''))}
${bloco('Bilhetes e anotações', bilhetes.map((b) => `<div class="nota">${esc(b.text || b.body || '')}<small>${esc(dataBR(b.at || b.date || b.createdAt))}</small></div>`).join(''))}
${bloco('Grupos e empresas', grupos.length ? tabela(['Nome', 'Cor'], grupos.map((c) => `<tr><td>${esc(c.name || '')}</td><td>${esc(c.color || '')}</td></tr>`).join('')) : '')}
${bloco('Meu ano no ' + app, Object.keys(r).length ? `<table><tbody>${linhas(r)}</tbody></table>` : '', 'Ainda não há retrospectiva neste aparelho.')}
<footer>Este relatório foi montado no seu próprio aparelho, com os dados que o ${esc(app)} guarda sobre você.
Junto dele você pode baixar o arquivo técnico (.json), que serve para levar seus dados a outro aplicativo, e a planilha (.csv).
Dúvidas ou pedidos de correção e exclusão: ${esc(CONFIG.supportEmail || CONFIG.adminEmail || '')}.</footer>
</div></body></html>`;
}

/** a agenda e o Pessoal numa planilha */
export function planilha(d) {
  const asp = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const grupos = d.trabalho?.grupos || [];
  const nomeGrupo = (id) => grupos.find((c) => c.id === id)?.name || '';
  const L = [['Onde', 'Data', 'Hora', 'O quê', 'Grupo ou lista', 'Tipo', 'Estado'].join(';')];
  [...(d.trabalho?.compromissos || d.trabalho?.compromissosCadastradosPorVoce || [])].sort(porData)
    .forEach((e) => L.push(['Trabalho', dataBR(e.date), horaBR(e.time), e.title || '', nomeGrupo(e.companyId), e.type || '', ESTADO[e.status] || e.status || ''].map(asp).join(';')));
  (d.pessoal || []).filter((p) => p.kind === 'item' || !p.kind).sort(porData)
    .forEach((p) => L.push(['Pessoal', dataBR(p.date), horaBR(p.time), p.title || '', '', traduz('cat', p.cat) || '', p.done ? 'Feito' : 'Pendente'].map(asp).join(';')));
  (d.pessoal || []).filter((p) => p.kind === 'list').forEach((l) => (l.entries || []).forEach((e) => L.push(['Lista', '', '', e.text || '', l.name || '', 'item', e.done ? 'Feito' : 'Pendente'].map(asp).join(';'))));
  return '\ufeff' + L.join('\r\n');   // com BOM: o Excel abre com acento certo
}

/** salva (ou compartilha) um arquivo gerado aqui mesmo */
export async function baixa(nome, texto, tipo) {
  const blob = new Blob([texto], { type: `${tipo};charset=utf-8` });
  const file = typeof File === 'function' ? new File([blob], nome, { type: tipo }) : null;
  if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
    try { await navigator.share({ files: [file], title: nome }); return 'compartilhou'; } catch { /* cancelou: baixa */ }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = nome;
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
  return 'baixou';
}
export const nomeArquivo = (ext) => `meus-dados-lembra-${todayKey()}.${ext}`;
