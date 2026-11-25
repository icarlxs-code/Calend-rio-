/* Nomes de remédios (princípios ativos e marcas vendidas no Brasil). Sem acento e em minúsculas.
   Serve só para esconder o nome na tela de bloqueio; não é orientação médica. Usado pelo app (via js/remedios-lista.js) e pelo servidor. */
export const REMEDIOS = `
losartana valsartana olmesartana candesartana telmisartana irbesartana enalapril captopril lisinopril ramipril perindopril anlodipino nifedipino diltiazem verapamil
atenolol propranolol metoprolol carvedilol bisoprolol nebivolol hidroclorotiazida clortalidona indapamida furosemida espironolactona clonidina metildopa hidralazina
sinvastatina atorvastatina rosuvastatina pravastatina ezetimiba ciprofibrato fenofibrato varfarina rivaroxabana apixabana dabigatrana clopidogrel cilostazol digoxina amiodarona isossorbida
metformina glibenclamida gliclazida glimepirida sitagliptina vildagliptina linagliptina empagliflozina dapagliflozina pioglitazona insulina semaglutida liraglutida tirzepatida dulaglutida
levotiroxina metimazol propiltiouracil omeprazol pantoprazol esomeprazol lansoprazol rabeprazol famotidina domperidona metoclopramida bromoprida ondansetrona simeticona loperamida lactulose bisacodil
dipirona paracetamol ibuprofeno diclofenaco nimesulida naproxeno cetoprofeno meloxicam celecoxibe cetorolaco acetilsalicilico ciclobenzaprina carisoprodol tramadol codeina morfina oxicodona
amoxicilina azitromicina cefalexina ciprofloxacino levofloxacino claritromicina sulfametoxazol metronidazol nitrofurantoina doxiciclina penicilina benzetacil fluconazol itraconazol nistatina cetoconazol ivermectina albendazol aciclovir valaciclovir oseltamivir
fluoxetina sertralina escitalopram citalopram paroxetina venlafaxina desvenlafaxina duloxetina bupropiona mirtazapina trazodona amitriptilina nortriptilina clomipramina imipramina vortioxetina
clonazepam alprazolam diazepam bromazepam lorazepam zolpidem melatonina quetiapina risperidona olanzapina aripiprazol haloperidol clozapina litio lamotrigina topiramato carbamazepina oxcarbazepina valproato fenitoina fenobarbital gabapentina pregabalina levetiracetam metilfenidato lisdexanfetamina atomoxetina
donepezila memantina rivastigmina levodopa pramipexol
loratadina desloratadina cetirizina levocetirizina fexofenadina dexclorfeniramina prednisona prednisolona dexametasona betametasona hidrocortisona budesonida salbutamol formoterol salmeterol montelucaste beclometasona ambroxol acetilcisteina
finasterida dutasterida tansulosina doxazosina sildenafila tadalafila alopurinol colchicina metotrexato hidroxicloroquina sulfassalazina alendronato risedronato calcitriol colecalciferol tamoxifeno anastrozol letrozol
anticoncepcional levonorgestrel etinilestradiol desogestrel drospirenona medroxiprogesterona estradiol progesterona isotretinoina
puran glifage rivotril euthyrox synthroid novalgina neosaldina dorflex tylenol buscopan buscofem advil alivium cataflam voltaren toragesic torsilax aspirina somalgin ecasil
frontal lexotan valium stilnox zoloft prozac lexapro exodus reconter pristiq effexor cymbalta wellbutrin remeron donaren seroquel zyprexa risperdal tegretol trileptal depakote depakene gardenal lamictal topamax lyrica ritalina venvanse
diovan micardis benicar atacand cozaar aradois renitec capoten norvasc selozok concor lasix aldactone crestor lipitor zocor vytorin xarelto eliquis pradaxa plavix marevan
januvia galvus trayenta jardiance forxiga xigduo ozempic wegovy rybelsus saxenda victoza mounjaro lantus tresiba novorapid humalog humulin
losec nexium pantozol plasil motilium luftal imosec dramin vonau clavulin amoxil zitromax keflex bactrim flagyl zovirax
claritin allegra-d polaramine zyrtec hixizine aerolin seretide symbicort alenia foraseq clenil singulair avamys nasonex predsim decadron diprospan
viagra cialis helleva avodart propecia roacutan microvlar ciclo21 diane35 mercilon cerazette depo-provera pilem
`.trim().split(/\s+/);
/* nomes que também são nome de gente ou palavra comum: só valem com contexto ("tomar", "remédio", dose…) */
export const AMBIGUOS = 'yasmin selene diane allegra concerta pondera level elani stezza siblima iumi jasmine floral sal ferro calcio magnesio zinco omega'.split(' ');
export const normaliza = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const esc = (x) => x.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&');
const RE = new RegExp(`(^|[^a-z0-9])(${[...REMEDIOS].sort((a, b) => b.length - a.length).map(esc).join('|')})(?=$|[^a-z0-9])`);
const CTX = new RegExp(`(^|[^a-z0-9])(?:tomar|tomei|toma|remedio|comprimido|capsula|pilula|dose de)\\s+(?:o |a |do |da |de |1 |um |uma )*(${AMBIGUOS.map(esc).join('|')})(?=$|[^a-z0-9])|(^|[^a-z0-9])(${AMBIGUOS.map(esc).join('|')})\\s+\\d+\\s?(?:mg|mcg|g|ml|ui)(?=$|[^a-z0-9])`);
/** o texto cita um remédio pelo nome? (devolve o nome achado, ou '') */
export function achaRemedio(texto) { const s = normaliza(texto), m = RE.exec(s); if (m) return m[2]; const c = CTX.exec(s); return c ? c[2] || c[4] : ''; }
const REG = new RegExp(RE.source, 'g');
/** troca o nome (e a dose colada nele) por "remédio". Para textos de aviso montados por versões antigas do app. */
export function escondeNome(texto) {
  const t = String(texto ?? ''), s = normaliza(t);
  if (s.length !== t.length || !RE.test(s)) return t; // sem nome, ou texto que muda de tamanho ao tirar acento
  let out = '', i = 0, m; REG.lastIndex = 0;
  while ((m = REG.exec(s))) { const a = m.index + m[1].length; let b = a + m[2].length; const d = /^\s+(?:t\d+|xr|\d+(?:[.,]\d+)?\s?(?:mg|mcg|ml|ui|g)?)(?![a-z0-9:h])/.exec(s.slice(b)); if (d) b += d[0].length; out += t.slice(i, a) + 'remédio'; i = b; REG.lastIndex = b; }
  return out + t.slice(i);
}
