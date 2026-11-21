import{a as W,b as X,h as Y}from"./c-FQJ5CCBF.js";import{o as B,q as V,r as C}from"./c-LAHZC5TF.js";import{f as L}from"./c-2AO6QKH7.js";import{B as s,d as I,e as U}from"./c-ZUAJ4OTH.js";import{a as T}from"./c-PVDXWGYP.js";import"./c-ZL5OENJV.js";import"./c-LQRWGXTC.js";import{b as S}from"./c-7BGTL2PK.js";import"./c-RBD7V5PY.js";var O=a=>!!a.online&&a.lastPing&&Date.now()-a.lastPing<15e4,x=a=>a?new Date(a).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):"\u2014",Z=a=>{if(!a)return"\u2014";let i=Math.round((Date.now()-a)/6e4);if(i<2)return"agora";if(i<60)return`h\xE1 ${i} min`;let l=Math.round(i/60);if(l<24)return`h\xE1 ${l}h`;let o=Math.round(l/24);return o===1?"ontem":`h\xE1 ${o} dias`},la=a=>a?new Date(a).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric"}):"\u2014",na={ios:"iPhone","ios-other":"iPhone (Chrome)",android:"Android",samsung:"Android (Samsung)",desktop:"Computador"},oa={granted:"ligadas",denied:"bloqueadas",default:"n\xE3o ativadas",unsupported:"n\xE3o suportadas"};function ra(a,i=44){let l=(a.name||a.email||"?").trim().charAt(0).toUpperCase();return`<span class="aface" style="--s:${i}px;background:${s(a.color||"#8E8E93")}">${a.photo?`<img src="${a.photo}" alt="">`:s(l)}</span>`}function da(a){let i=I(),l=new Set(a.activeDays||[]);return Array.from({length:30},(o,n)=>U(i,n-29)).map(o=>`<i class="${l.has(o)?"on":""}" title="${o.split("-").reverse().join("/")}"></i>`).join("")}var y=()=>null,ca=a=>a?a.plan==="comp"?`Liberado at\xE9 ${new Date(a.compUntil).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"})}`:a.comp?"Cortesia":{trial:"Teste gr\xE1tis",monthly:"Mensal",lifetime:"Vital\xEDcio",expired:"Teste acabou",blocked:"Sem plano",none:"Sem plano"}[a.plan]||"Conta pr\xF3pria":"Conta pr\xF3pria",k=null,pa=(a,i)=>{let l=String(a||"0").split(".").map(Number),o=String(i||"0").split(".").map(Number);for(let n=0;n<3;n++)if((l[n]||0)!==(o[n]||0))return(l[n]||0)>(o[n]||0)?1:-1;return 0},E=a=>a.app?k?a.app.b===k.build||pa(a.app.v,k.version)>=0?{cls:"ok",label:`v${a.app.v} \u2713`,long:`v${a.app.v} (${a.app.b}) \u2014 a mais recente`,ok:!0}:{cls:"warn",label:`v${a.app.v} \xB7 desatualizada`,long:`v${a.app.v} (${a.app.b}) \u2014 a \xFAltima \xE9 a v${k.version}`,ok:!1}:{cls:"",label:`v${a.app.v}`,long:`v${a.app.v}`,ok:!0}:{cls:"warn",label:"vers\xE3o antiga",long:"Antes da 2.0.0 (ainda n\xE3o abriu o app atualizado)",ok:!1};function ma(a,i){let l=a.counts||{},o=a.device||{},n=O(a),t=Math.max(a.lastPing||0,a.lastSeen||0);return`<div class="acct${i?" is-open":""}" data-uid="${s(a.uid)}">
    <button class="acct__top" data-toggle="${s(a.uid)}">
      ${ra(a)}
      <div class="acct__id"><strong>${s(a.name||"Sem nome")}${n?' <span class="adot" title="Usando agora"></span>':""}</strong><small>${s(a.email||"")}</small></div>
      <div class="acct__last"><b class="${n?"is-live":""}">${n?"no app agora":s(`saiu ${Z(t)}`)}</b><small>${a.workspace==="dupla"?"Dupla":a.workspace==="compartilhada"?"Convidado":ca(y(a.uid))}${y(a.uid)?.addon?.active?` + ${y(a.uid).addon.plan==="equipe"?"Equipe":"Dupla"}`:""}</small></div>
    </button>
    ${a.profile?.done?`<div class="acct__prof">${S("idcard",13)} <b>${s(a.profile.profession||"\u2014")}</b>${a.profile.age?` \xB7 ${s(a.profile.age)} anos`:""} \xB7 \xEDndice ${a.profile.index}/100</div>`:a.workspace!=="dupla"?`<div class="acct__prof is-off">${S("idcard",13)} Ficha n\xE3o preenchida</div>`:""}
    <div class="acct__chips">
      <span>${S("building",12)} ${l.companies||0} grupos</span>
      <span>${S("calendar",12)} ${l.myEvents||0} eventos</span>
      <span>${S("heart",12)} ${l.personal||0} pessoais</span>
      <span class="${o.notifications==="granted"&&o.registered?"ok":"warn"}">${S("bell",12)} ${o.notifications==="granted"&&o.registered?"avisos ok":"sem avisos"}</span>
      <span class="${E(a).cls}">${S("refresh",12)} ${s(E(a).label)}</span>
      ${a.game?`<span>${S("trophy",12)} n\xEDvel ${a.game.level}</span>`:""}
    </div>
    ${i?`<div class="acct__more">
      <div class="agrid">
        <div><small>Conta criada</small><b>${s(la(a.createdAt))}</b></div>
        <div><small>Agora</small><b>${n?"\u{1F7E2} Com o app aberto":"\u26AA App fechado"}</b></div>
        <div><small>\xDAltima vez que entrou</small><b>${s(x(a.lastOpen||a.lastSeen))}</b></div>
        <div><small>Saiu do app</small><b>${n?"\u2014":s(x(a.closedAt||t))}</b></div>
        <div><small>Vezes que abriu</small><b>${a.opens||0}</b></div>
        <div><small>Dias ativos (30 dias)</small><b>${(a.activeDays||[]).filter(d=>d>=U(I(),-29)).length}</b></div>
        <div><small>Aparelho</small><b>${s(na[o.platform]||"\u2014")}</b></div>
        <div><small>Instalado na tela inicial</small><b>${o.installed?"Sim":"N\xE3o"}</b></div>
        <div><small>Notifica\xE7\xF5es</small><b>${s(oa[o.notifications]||"\u2014")}${o.registered?" \xB7 cadastrado":""}</b></div>
        <div><small>\xDAltimo modo usado</small><b>${a.space==="personal"?"Pessoal":"Trabalho"}</b></div>
        <div><small>Vers\xE3o do app</small><b class="${E(a).ok?"good":"bad"}">${s(E(a).long)}</b></div>
        <div><small>Recebeu esta vers\xE3o</small><b>${a.app?.since?s(x(a.app.since)):"\u2014"}</b></div>
        ${a.game?`<div><small>Conquistas</small><b>N\xEDvel ${a.game.level} \xB7 ${a.game.xp.toLocaleString("pt-BR")} XP \xB7 ${a.game.badges} emblemas</b></div>`:""}
      </div>
      ${E(a).ok?"":`<div class="aupd"><p>${a.lastOpen&&k?.builtAt&&a.lastOpen<Date.parse(k.builtAt)?"Ainda n\xE3o abriu o app desde a atualiza\xE7\xE3o: ela chega sozinha na pr\xF3xima vez que abrir.":"Abriu o app mas continua na vers\xE3o antiga (celular guardou a vers\xE3o velha)."}</p>
        <button class="btn btn--soft btn--sm" data-nudge-upd="${s(a.uid)}" data-email="${s(a.email)}">${S("bell",14)} Pedir para atualizar</button></div>`}
      ${a.profile?.done?`<h4>Ficha</h4>
      <div class="agrid">
        <div><small>Profiss\xE3o</small><b>${s(a.profile.profession||"\u2014")}</b></div>
        <div><small>\xC1rea</small><b>${s(a.profile.area||"\u2014")}</b></div>
        <div><small>Idade</small><b>${s(a.profile.age||"\u2014")}</b></div>
        <div><small>\xCDndice de esquecimento</small><b>${a.profile.index}/100 (marcou ${a.profile.forget}/5)</b></div>
        <div><small>Jornada</small><b>${s(X.find(d=>d.id===a.profile.journey)?.label||"\u2014")}</b></div>
        <div><small>Objetivo</small><b>${s(Y.find(d=>d.id===a.profile.goal)?.label||"\u2014")}</b></div>
      </div>
      ${(a.profile.difficulties||[]).length?`<div class="adiffs">${a.profile.difficulties.map(d=>`<span>${s(W.find(m=>m.id===d)?.label||d)}</span>`).join("")}</div>`:""}`:""}
      <h4>Trabalho</h4>
      <div class="agrid">
        <div><small>Empresas / grupos</small><b>${l.companies||0}</b></div>
        <div><small>Eventos (total no espa\xE7o)</small><b>${l.events||0}</b></div>
        <div><small>Cadastrados pela pessoa</small><b>${l.myEvents||0}</b></div>
        <div><small>Pr\xF3ximos 7 dias</small><b>${l.thisWeek||0}</b></div>
        <div><small>Posts (30 dias)</small><b>${l.posts30||0}</b></div>
        <div><small>Feitos (30 dias)</small><b>${l.done30||0}</b></div>
        <div><small>Atrasados (30 dias)</small><b class="${l.late?"bad":""}">${l.late||0}</b></div>
        <div><small>Bilhetes</small><b>${l.notes||0}</b></div>
      </div>
      <h4>Pessoal <small>(s\xF3 quantidade; o conte\xFAdo \xE9 privado)</small></h4>
      <div class="agrid">
        <div><small>Anota\xE7\xF5es</small><b>${l.personal||0}</b></div>
        <div><small>Listas</small><b>${l.lists||0}</b></div>
        <div><small>Anivers\xE1rios</small><b>${l.birthdays||0}</b></div>
      </div>
      <h4>Uso nos \xFAltimos 30 dias</h4>
      <div class="adays">${da(a)}</div>
      ${a.workspace==="proprio"?`<h4>Acesso</h4>
      ${y(a.uid)?.plan==="comp"?`<p class="fhelp">\u2705 Liberado at\xE9 <b>${s(x(y(a.uid).compUntil))}</b>. Depois disso a pessoa precisa assinar.</p>`:""}
      ${y(a.uid)?.comp&&y(a.uid)?.plan!=="comp"?`<button class="btn btn--soft btn--block" data-grant="${s(a.uid)}" data-on="0">Tirar o acesso cortesia</button>`:y(a.uid)?.plan==="lifetime"||y(a.uid)?.plan==="monthly"?'<p class="fhelp">Conta paga.</p>':`<div class="grantbox">
              <label class="fhelp">Liberar tudo, sem pagar, at\xE9:</label>
              <input type="datetime-local" class="input" data-until="${s(a.uid)}" value="${(()=>{let d=new Date(Date.now()+6048e5);return d.setMinutes(d.getMinutes()-d.getTimezoneOffset()),d.toISOString().slice(0,16)})()}">
              <button class="btn btn--primary btn--block" data-grant="${s(a.uid)}" data-on="1" data-dated="1">${y(a.uid)?.plan==="comp"?"Mudar a data":"Liberar at\xE9 essa data"}</button>
              ${y(a.uid)?.plan==="comp"?`<button class="btn btn--soft btn--block" data-grant="${s(a.uid)}" data-on="0">Tirar o acesso agora</button>`:""}
              <button class="btn-text btn--block" data-grant="${s(a.uid)}" data-on="1">Liberar para sempre (cortesia: revisor da loja, parceiro)</button>
            </div>`}`:""}
    </div>`:""}
  </div>`}function ga(a){let i=a.map(t=>t.profile).filter(t=>t&&t.done);if(!i.length)return"";let l=(t,d=5)=>Object.entries(t.reduce((m,h)=>(h&&(m[h]=(m[h]||0)+1),m),{})).sort((m,h)=>h[1]-m[1]).slice(0,d),o=([t,d],m=t)=>`<li><span>${s(m)}</span><i style="--w:${Math.round(d/i.length*100)}%"></i><b>${d}</b></li>`,n=Math.round(i.reduce((t,d)=>t+(d.index||0),0)/i.length);return`<div class="ainsights">
    <div class="ainsights__head"><b>${i.length} ficha${i.length>1?"s":""} preenchida${i.length>1?"s":""}</b><small>\xEDndice m\xE9dio de esquecimento ${n}/100</small></div>
    <h4>Profiss\xF5es</h4><ul class="abars">${l(i.map(t=>t.profession)).map(t=>o(t)).join("")}</ul>
    <h4>\xC1reas</h4><ul class="abars">${l(i.map(t=>t.area)).map(t=>o(t)).join("")}</ul>
    <h4>Maiores dificuldades</h4><ul class="abars">${l(i.flatMap(t=>t.difficulties||[])).map(t=>o(t,W.find(d=>d.id===t[0])?.label||t[0])).join("")}</ul>
  </div>`}function $a(a){let i=a.filter(n=>n.workspace==="proprio");if(!i.length)return"";let l={};for(let n of i){let t=n.origin||{},d=t.source?`${t.source}${t.campaign?" \xB7 "+t.campaign:""}`:"direto / sem marca\xE7\xE3o",m=y(n.uid),h=l[d]=l[d]||{n:0,paid:0,trial:0};h.n++,m&&(m.plan==="monthly"||m.plan==="lifetime"&&!m.comp)&&h.paid++,m&&m.plan==="trial"&&h.trial++}return`<h3 class="ah">De onde vieram</h3>
  <div class="agroup">${Object.entries(l).sort((n,t)=>t[1].n-n[1].n).slice(0,12).map(([n,t])=>`<div class="arow"><span>${s(n)}<small>${t.trial} em teste \xB7 ${t.paid} pagaram${t.n?` \xB7 ${Math.round(t.paid/t.n*100)}%`:""}</small></span><b>${t.n}</b></div>`).join("")}</div>
  <p class="fhelp">Use links com marca\xE7\xE3o nos an\xFAncios, ex.: <b>\u2026/conheca/?utm_source=instagram&amp;utm_campaign=dentistas</b>, para saber qual an\xFAncio traz quem paga.</p>`}function ba(a){return a===null?"":`<section class="block">
    ${a.length?`<div class="aerrs">${a.slice(0,40).map(i=>`<div class="aerr">
        <div class="aerr__top"><b>${s(i.msg)}</b><span>${i.count}\xD7</span></div>
        <small>${s(i.where||"\u2014")} \xB7 ${s(i.dev||"")} \xB7 vers\xE3o ${s(i.ver||"?")} \xB7 ${(i.users||[]).length} pessoa${(i.users||[]).length===1?"":"s"} \xB7 \xFAltimo ${s(Z(i.last))}</small>
      </div>`).join("")}</div>
      <button class="btn btn--soft btn--sm" data-clear-errors>Limpar a lista (depois de corrigir)</button>`:'<p class="fhelp">Nenhum erro registrado. \u{1F389} Quando algo der errado no celular de algu\xE9m, aparece aqui.</p>'}
  </section>`}var f=a=>Number.isFinite(Number(a))?Number(a):0,v=(a,i=120)=>typeof a=="string"?a.slice(0,i):"";function va(a){let i=a.counts||{},l=a.device||{},o=a.profile||{};return{uid:v(a.uid,64),name:v(a.name,60),email:v(a.email,120),workspace:v(a.workspace,20),space:v(a.space,20),photo:typeof a.photo=="string"&&/^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(a.photo)?a.photo:null,color:/^#[0-9a-fA-F]{6}$/.test(a.color||"")?a.color:"#8E8E93",createdAt:f(a.createdAt),lastSeen:f(a.lastSeen),opens:f(a.opens),online:!!a.online,lastPing:f(a.lastPing),lastOpen:f(a.lastOpen),closedAt:f(a.closedAt),activeDays:Array.isArray(a.activeDays)?a.activeDays.filter(n=>/^\d{4}-\d{2}-\d{2}$/.test(n)).slice(-40):[],counts:Object.fromEntries(["companies","events","myEvents","thisWeek","done30","late","posts30","notes","personal","lists","birthdays"].map(n=>[n,f(i[n])])),device:{platform:v(l.platform,20),installed:!!l.installed,notifications:v(l.notifications,20),registered:!!l.registered},app:a.app&&typeof a.app=="object"&&/^\d+\.\d+\.\d+$/.test(a.app.v||"")?{v:v(a.app.v,20),b:v(a.app.b,12).replace(/[^a-z0-9]/gi,""),since:f(a.app.since)}:null,game:a.game&&typeof a.game=="object"?{level:Math.max(0,Math.min(100,Math.round(f(a.game.level)))),xp:f(a.game.xp),badges:f(a.game.badges)}:null,origin:a.origin&&typeof a.origin=="object"?{source:v(a.origin.source,60),medium:v(a.origin.medium,60),campaign:v(a.origin.campaign,60)}:null,profile:o.done?{done:!0,profession:v(o.profession,80),area:v(o.area,80),age:v(o.age,10),index:f(o.index),forget:f(o.forget),difficulties:Array.isArray(o.difficulties)?o.difficulties.filter(n=>typeof n=="string").slice(0,12).map(n=>n.slice(0,30)):[],goal:v(o.goal,30),journey:v(o.journey,30)}:{done:!1}}}async function Sa(){let a=null,i=null,l=null,o="",n={},t=null,d="resumo",m=()=>{let p=V("Painel do dono",{right:'<button class="btn-text" data-reload>Atualizar</button>'});if(i)return`${p}<div class="page page--sheet"><div class="empty"><h3>N\xE3o consegui carregar</h3><p>${s(i)}</p></div></div>`;if(!a)return`${p}<div class="page page--sheet"><p class="fhelp">Carregando\u2026</p></div>`;let D=Date.now(),N=e=>a.filter(c=>c.lastSeen&&D-c.lastSeen<e*864e5).length,M=a.filter(e=>e.createdAt&&D-e.createdAt<7*864e5).length;y=e=>n[e]||null;let u=Object.values(n),A=u.filter(e=>e.plan==="monthly").length,r=u.filter(e=>e.plan==="lifetime"&&!e.comp).length,b=u.filter(e=>e.plan==="lifetime"&&e.founder&&!e.comp).length,$=e=>e.tier==="essencial"?e.interval==="year"?119.9/12:12.9:e.interval==="year"?179.9/12:19.9,j=u.filter(e=>e.plan==="trial").length,q=u.filter(e=>e.addon&&e.addon.active),ea=u.filter(e=>e.plan==="monthly").reduce((e,c)=>e+$(c),0)+q.reduce((e,c)=>e+(c.addon.plan==="equipe"?c.plan==="lifetime"?19.9:29.9:c.plan==="lifetime"?4.9:7.9),0),G=u.filter(e=>e.plan!=="none"&&e.plan!=="team").length,sa=G?Math.round((A+r)/G*100):0,J=e=>`R$ ${e.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}`,w=(e,c,g="")=>`<div class="arow"><span>${e}${g?`<small>${g}</small>`:""}</span><b>${c}</b></div>`,Q=a.filter(e=>e.device?.installed).length,R=a.filter(e=>e.device?.notifications==="granted"&&e.device?.registered).length,K=e=>a.length?` \xB7 ${Math.round(e/a.length*100)}%`:"",ta=`<div class="aseg" role="tablist">${[["resumo","Resumo"],["pessoas",`Pessoas \xB7 ${a.length}`],["ranking","\u{1F3C6} Ranking"],["erros",`Erros${t&&t.length?` \xB7 ${t.length}`:""}`]].map(([e,c])=>`<button role="tab" class="${d===e?"is-on":""}" data-tab-admin="${e}">${c}</button>`).join("")}</div>`,P="";if(d==="resumo")P=`
      <div class="ahero">
        <small>Receita por m\xEAs</small>
        <b>${J(ea)}</b>
        <span>${A} ${A===1?"assinante":"assinantes"} \xB7 ${q.length} agenda${q.length===1?"":"s"} compartilhada${q.length===1?"":"s"}</span>
      </div>
      <div class="atiles">
        <div><b>${N(1)}</b><small>ativas hoje</small></div>
        <div><b>${A+r}</b><small>pagantes</small></div>
        <div><b>${j}</b><small>em teste</small></div>
      </div>
      <h3 class="ah">Dinheiro</h3>
      <div class="agroup">
        ${w("Fundadores / vital\xEDcios vendidos",`${r}`,`${J(b*199+(r-b)*150)} no total`)}
        ${w("Assinantes (mensal e anual)",`${A}`,`${u.filter(e=>e.plan==="monthly"&&e.tier==="essencial").length} Essencial \xB7 ${u.filter(e=>e.plan==="monthly"&&e.tier!=="essencial").length} Profissional \xB7 ${u.filter(e=>e.plan==="monthly"&&e.interval==="year").length} anuais`)}
        ${w("Agendas compartilhadas",`${q.length}`,`${q.filter(e=>e.addon.plan==="equipe").length} Equipe \xB7 ${q.filter(e=>e.addon.plan==="dupla").length} Dupla`)}
        ${w("Convers\xE3o do teste",`${sa}%`,"quem pagou \xF7 quem testou")}
      </div>
      <h3 class="ah">Pessoas</h3>
      <div class="agroup">
        ${w("Contas",`${a.length}`,`${M} nova${M===1?"":"s"} nos \xFAltimos 7 dias`)}
        ${w("No app agora",`${a.filter(O).length}`)}
        ${w("Ativas na semana",`${N(7)}`)}
        ${w("Convidados (agenda de outra pessoa)",`${a.filter(e=>e.workspace==="compartilhada").length}`)}
      </div>
      <h3 class="ah">Sa\xFAde do app</h3>
      <div class="agroup">
        ${w(`Na vers\xE3o atual${k?` (v${s(k.version)})`:""}`,`${a.filter(e=>E(e).ok&&e.app).length} de ${a.length}`,(()=>{let e=a.filter(c=>!E(c).ok);return e.length?`desatualizados: ${e.slice(0,4).map(c=>s((c.name||c.email||"").split(" ")[0])).join(", ")}${e.length>4?` e mais ${e.length-4}`:""} \u2014 atualiza sozinho ao abrir`:"todo mundo atualizado \u2713"})())}
        ${w("Instalaram na tela inicial",`${Q}${K(Q)}`)}
        ${w("Recebem notifica\xE7\xF5es",`${R}${K(R)}`,R<a.length?"sem isso, os lembretes n\xE3o chegam":"")}
        ${w("Compromissos criados",`${a.reduce((e,c)=>e+(c.counts?.myEvents||0),0)}`)}
        <button class="arow arow--btn" data-rank-admin><span>\u{1F3C6} Ranking (pontos e suspeitas)</span><b>abrir \u203A</b></button>
        <button class="arow arow--btn" data-support-inbox><span>\u{1F4AC} Mensagens de suporte</span><b>abrir \u203A</b></button>
        <button class="arow arow--btn" data-tab-admin="erros"><span>Erros do app</span><b class="${t&&t.length?"bad":"good"}">${t===null?"\u2014":t.length?`${t.length} \u203A`:"nenhum \u2713"}</b></button>
      </div>
      ${$a(a)}
      ${ga(a)}`;else if(d==="pessoas"){let e=a.filter(c=>!o||`${c.name} ${c.email} ${c.profile?.profession||""}`.toLowerCase().includes(o)).sort((c,g)=>O(g)-O(c)||Math.max(g.lastPing||0,g.lastSeen||0)-Math.max(c.lastPing||0,c.lastSeen||0));P=`<input class="input" type="search" placeholder="Buscar por nome, e-mail ou profiss\xE3o" data-q value="${s(o)}">
      <div class="accts">${e.map(c=>ma(c,c.uid===l)).join("")||'<p class="fhelp">Nenhuma conta encontrada.</p>'}</div>
      <p class="fhelp">Toque numa conta para ver os detalhes. Aparecem aqui as contas que j\xE1 abriram o app atualizado.</p>`}else if(d==="ranking"){let e=h,c=g=>(g||"").split("-").reverse().join("/");P=e?e.error?`<p class="fhelp">N\xE3o consegui ler o ranking: ${s(e.error)}</p>`:`
      <h3 class="ah">Semana de ${s(c(e.week))}</h3>
      <div class="agroup">${(e.rows||[]).length?e.rows.map((g,F)=>{let z=a.find(ia=>ia.uid===g.ws);return`<div class="arow"><span><b>${g.flag?"\u2014":F+1+"\xBA"}</b> ${s(z?.name||g.i)} <small>${s(z?.email||g.ws)}</small>${g.flag?`<br><small class="bad">\u26A0\uFE0F fora do ranking: ${s(g.flag.why)}</small>`:""}</span><b>${g.pts} pts</b></div>`}).join(""):'<p class="fhelp" style="padding:12px 16px">Ningu\xE9m pontuou esta semana ainda. S\xF3 contas no plano mensal participam.</p>'}</div>
      <h3 class="ah">Campe\xF5es do m\xEAs (m\xEAs gr\xE1tis)</h3>
      <div class="agroup">${(e.winners||[]).length?e.winners.map(g=>{let F=a.find(z=>z.uid===g.ws);return`<div class="arow"><span>${s(g.month.split("-").reverse().join("/"))} \xB7 ${s(F?.name||g.i)} <small>${g.pts} pts</small></span><b class="${g.applied?"good":"bad"}">${g.applied?"cupom aplicado \u2713":"cupom n\xE3o aplicado"}</b></div>`}).join(""):'<p class="fhelp" style="padding:12px 16px">Ainda nenhum campe\xE3o. O pr\xEAmio \xE9 calculado no dia 1\xBA de cada m\xEAs.</p>'}</div>
      <p class="fhelp">Aqui voc\xEA v\xEA nome e e-mail. Os participantes s\xF3 veem a inicial uns dos outros.</p>`:'<p class="fhelp">Carregando o ranking\u2026</p>',h||aa()}else P=ba(t)||'<p class="fhelp">N\xE3o consegui ler os erros agora.</p>';return`${p}<div class="page page--sheet apanel">${ta}${P}</div>`},h=null,aa=async()=>{let{api:p}=await import("./c-NGXQQOOT.js");h=await p("/rank/admin",{}).catch(D=>({error:D.message})),d==="ranking"&&_.set(m())},_=B({className:"sheet--tall",html:m(),onMount:p=>{p.el.querySelectorAll("[data-toggle]").forEach(r=>r.onclick=()=>{l=l===r.dataset.toggle?null:r.dataset.toggle,p.set(m())});let D=p.el.querySelector("[data-rank-admin]");D&&(D.onclick=async()=>{let{api:r}=await import("./c-NGXQQOOT.js"),b=await r("/rank/admin",{}).catch($=>({error:$.message}));B({className:"sheet--tall",html:`${V("Ranking \xB7 semana de "+s((b.week||"").split("-").reverse().join("/")),{left:'<button class="btn-text" data-close>Fechar</button>'})}<div class="page page--sheet">
          ${b.error?`<p class="fhelp">${s(b.error)}</p>`:(b.rows||[]).map(($,j)=>`<div class="arow"><span>${j+1}. ${s($.i)} \xB7 <small>${s($.ws)}</small>${$.flag?`<br><small class="bad">\u26A0\uFE0F fora do ranking: ${s($.flag.why)}</small>`:""}</span><b>${$.pts} pts</b></div>`).join("")||'<p class="fhelp">Ningu\xE9m pontuou esta semana.</p>'}
          <h4>Campe\xF5es (m\xEAs gr\xE1tis)</h4>${(b.winners||[]).map($=>`<div class="arow"><span>${s($.month)} \xB7 ${s($.i)} <small>${s($.ws)}</small></span><b>${$.applied?"cupom aplicado \u2713":"n\xE3o aplicado"}</b></div>`).join("")||'<p class="fhelp">Ainda nenhum.</p>'}</div>`})});let N=p.el.querySelector("[data-support-inbox]");N&&(N.onclick=async()=>(await import("./c-T377DSC7.js")).openSupportInbox()),p.el.querySelectorAll("[data-tab-admin]").forEach(r=>r.onclick=()=>{d=r.dataset.tabAdmin,p.set(m()),p.el.scrollTop=0}),p.el.querySelectorAll("[data-grant]").forEach(r=>r.onclick=async()=>{r.disabled=!0;try{let{api:b}=await import("./c-NGXQQOOT.js"),$=r.dataset.dated?p.el.querySelector(`[data-until="${r.dataset.grant}"]`):null,j=$?new Date($.value).getTime():0;if($&&!(j>Date.now())){C("Escolha uma data e hora no futuro");return}let q=await b("/admin/grant",{uid:r.dataset.grant,on:r.dataset.on==="1",until:j});n[r.dataset.grant]=q.status,C(r.dataset.on!=="1"?"Acesso retirado":j?`Liberado at\xE9 ${x(j)} \u2713`:"Acesso cortesia liberado \u2713"),p.set(m())}catch(b){r.disabled=!1,C(b.message||"N\xE3o consegui agora.")}}),p.el.querySelectorAll("[data-nudge-upd]").forEach(r=>r.onclick=async()=>{r.disabled=!0;try{let{api:b}=await import("./c-NGXQQOOT.js"),$=await b("/admin/nudge-update",{uid:r.dataset.nudgeUpd,email:r.dataset.email,version:k?.version||""});C($.sent?"Aviso enviado \u2713 Quando a pessoa tocar, o app abre j\xE1 atualizado.":"A pessoa n\xE3o ativou as notifica\xE7\xF5es: pe\xE7a pelo WhatsApp para abrir o app.",{ms:5e3})}catch(b){r.disabled=!1,C(b.message||"N\xE3o consegui agora.")}});let M=p.el.querySelector("[data-reload]");M&&(M.onclick=()=>H());let u=p.el.querySelector("[data-clear-errors]");u&&(u.onclick=async()=>{try{let{api:r}=await import("./c-NGXQQOOT.js");t=(await r("/admin/errors",{clear:!0})).errors||[],p.set(m())}catch{C("N\xE3o consegui limpar agora.")}});let A=p.el.querySelector("[data-q]");A&&(A.oninput=()=>{o=A.value.trim().toLowerCase();let r=A.selectionStart;p.set(m());let b=p.el.querySelector("[data-q]");b.focus(),b.setSelectionRange(r,r)})}}),H=async()=>{try{a=(await L.backendApi.listStats()).map(va),i=null;try{k=await(await import("./c-J4PSMUUC.js")).fetchLatest()}catch{k=null}try{let{api:p}=await import("./c-NGXQQOOT.js");n=(await p("/billing/all",{})).byWs||{}}catch{n={}}try{let{api:p}=await import("./c-NGXQQOOT.js");t=(await p("/admin/errors",{})).errors||[]}catch{t=null}}catch(p){i=/permission/i.test(String(p.code||p.message))?"Falta atualizar as regras do Firebase (bloco \u201Cstats\u201D).":"Verifique a internet e toque em Atualizar."}_.set(m())};return H(),_}var qa=()=>!!L.user&&!!T.adminEmail&&(L.user.email||"").toLowerCase()===T.adminEmail.toLowerCase();export{qa as isOwner,Sa as openAdmin};
