import{a as j,b as E,f as O}from"./c-DIUQLQ5R.js";import{m as k,o as u,p as C}from"./c-CHDSXIXS.js";import{f as y}from"./c-3PEOD7JY.js";import"./c-EG64IY44.js";import{a as b}from"./c-X3PB6JZ2.js";import{B as t,d as q,e as _}from"./c-YEARXB46.js";import{a as w}from"./c-BYHTQNTY.js";import"./c-S6VVKE3W.js";import"./c-VHNSBD2M.js";var D=a=>{if(!a)return"\u2014";let l=Math.round((Date.now()-a)/6e4);if(l<2)return"agora";if(l<60)return`h\xE1 ${l} min`;let i=Math.round(l/60);if(i<24)return`h\xE1 ${i}h`;let o=Math.round(i/24);return o===1?"ontem":`h\xE1 ${o} dias`},x=a=>a?new Date(a).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric"}):"\u2014",F={ios:"iPhone","ios-other":"iPhone (Chrome)",android:"Android",samsung:"Android (Samsung)",desktop:"Computador"},M={granted:"ligadas",denied:"bloqueadas",default:"n\xE3o ativadas",unsupported:"n\xE3o suportadas"};function N(a,l=44){let i=(a.name||a.email||"?").trim().charAt(0).toUpperCase();return`<span class="aface" style="--s:${l}px;background:${t(a.color||"#8E8E93")}">${a.photo?`<img src="${a.photo}" alt="">`:t(i)}</span>`}function I(a){let l=q(),i=new Set(a.activeDays||[]);return Array.from({length:30},(o,d)=>_(l,d-29)).map(o=>`<i class="${i.has(o)?"on":""}" title="${o.split("-").reverse().join("/")}"></i>`).join("")}var S=()=>null,R=a=>a&&{trial:"Teste gr\xE1tis",monthly:"Mensal",lifetime:"Vital\xEDcio",expired:"Teste acabou",blocked:"Sem plano",none:"Sem plano"}[a.plan]||"Conta pr\xF3pria";function T(a,l){let i=a.counts||{},o=a.device||{},d=a.lastSeen&&Date.now()-a.lastSeen<15*6e4;return`<div class="acct${l?" is-open":""}" data-uid="${t(a.uid)}">
    <button class="acct__top" data-toggle="${t(a.uid)}">
      ${N(a)}
      <div class="acct__id"><strong>${t(a.name||"Sem nome")}${d?' <span class="adot" title="Usando agora"></span>':""}</strong><small>${t(a.email||"")}</small></div>
      <div class="acct__last"><b>${t(D(a.lastSeen))}</b><small>${a.workspace==="dupla"?"Dupla":a.workspace==="compartilhada"?"Convidado":R(S(a.uid))}${S(a.uid)?.addon?.active?` + ${S(a.uid).addon.plan==="equipe"?"Equipe":"Dupla"}`:""}</small></div>
    </button>
    ${a.profile?.done?`<div class="acct__prof">${b("idcard",13)} <b>${t(a.profile.profession||"\u2014")}</b>${a.profile.age?` \xB7 ${t(a.profile.age)} anos`:""} \xB7 \xEDndice ${a.profile.index}/100</div>`:a.workspace!=="dupla"?`<div class="acct__prof is-off">${b("idcard",13)} Ficha n\xE3o preenchida</div>`:""}
    <div class="acct__chips">
      <span>${b("building",12)} ${i.companies||0} grupos</span>
      <span>${b("calendar",12)} ${i.myEvents||0} eventos</span>
      <span>${b("heart",12)} ${i.personal||0} pessoais</span>
      <span class="${o.notifications==="granted"&&o.registered?"ok":"warn"}">${b("bell",12)} ${o.notifications==="granted"&&o.registered?"avisos ok":"sem avisos"}</span>
    </div>
    ${l?`<div class="acct__more">
      <div class="agrid">
        <div><small>Conta criada</small><b>${t(x(a.createdAt))}</b></div>
        <div><small>\xDAltimo acesso</small><b>${t(a.lastSeen?new Date(a.lastSeen).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):"\u2014")}</b></div>
        <div><small>Vezes que abriu</small><b>${a.opens||0}</b></div>
        <div><small>Dias ativos (30 dias)</small><b>${(a.activeDays||[]).filter(s=>s>=_(q(),-29)).length}</b></div>
        <div><small>Aparelho</small><b>${t(F[o.platform]||"\u2014")}</b></div>
        <div><small>Instalado na tela inicial</small><b>${o.installed?"Sim":"N\xE3o"}</b></div>
        <div><small>Notifica\xE7\xF5es</small><b>${t(M[o.notifications]||"\u2014")}${o.registered?" \xB7 cadastrado":""}</b></div>
        <div><small>\xDAltimo modo usado</small><b>${a.space==="personal"?"Pessoal":"Trabalho"}</b></div>
      </div>
      ${a.profile?.done?`<h4>Ficha</h4>
      <div class="agrid">
        <div><small>Profiss\xE3o</small><b>${t(a.profile.profession||"\u2014")}</b></div>
        <div><small>\xC1rea</small><b>${t(a.profile.area||"\u2014")}</b></div>
        <div><small>Idade</small><b>${t(a.profile.age||"\u2014")}</b></div>
        <div><small>\xCDndice de esquecimento</small><b>${a.profile.index}/100 (marcou ${a.profile.forget}/5)</b></div>
        <div><small>Jornada</small><b>${t(E.find(s=>s.id===a.profile.journey)?.label||"\u2014")}</b></div>
        <div><small>Objetivo</small><b>${t(O.find(s=>s.id===a.profile.goal)?.label||"\u2014")}</b></div>
      </div>
      ${(a.profile.difficulties||[]).length?`<div class="adiffs">${a.profile.difficulties.map(s=>`<span>${t(j.find(r=>r.id===s)?.label||s)}</span>`).join("")}</div>`:""}`:""}
      <h4>Trabalho</h4>
      <div class="agrid">
        <div><small>Empresas / grupos</small><b>${i.companies||0}</b></div>
        <div><small>Eventos (total no espa\xE7o)</small><b>${i.events||0}</b></div>
        <div><small>Cadastrados por ele(a)</small><b>${i.myEvents||0}</b></div>
        <div><small>Pr\xF3ximos 7 dias</small><b>${i.thisWeek||0}</b></div>
        <div><small>Posts (30 dias)</small><b>${i.posts30||0}</b></div>
        <div><small>Feitos (30 dias)</small><b>${i.done30||0}</b></div>
        <div><small>Atrasados (30 dias)</small><b class="${i.late?"bad":""}">${i.late||0}</b></div>
        <div><small>Bilhetes</small><b>${i.notes||0}</b></div>
      </div>
      <h4>Pessoal <small>(s\xF3 quantidade; o conte\xFAdo \xE9 privado)</small></h4>
      <div class="agrid">
        <div><small>Anota\xE7\xF5es</small><b>${i.personal||0}</b></div>
        <div><small>Listas</small><b>${i.lists||0}</b></div>
        <div><small>Anivers\xE1rios</small><b>${i.birthdays||0}</b></div>
      </div>
      <h4>Uso nos \xFAltimos 30 dias</h4>
      <div class="adays">${I(a)}</div>
    </div>`:""}
  </div>`}function z(a){let l=a.map(s=>s.profile).filter(s=>s&&s.done);if(!l.length)return"";let i=(s,r=5)=>Object.entries(s.reduce((m,p)=>(p&&(m[p]=(m[p]||0)+1),m),{})).sort((m,p)=>p[1]-m[1]).slice(0,r),o=([s,r],m=s)=>`<li><span>${t(m)}</span><i style="--w:${Math.round(r/l.length*100)}%"></i><b>${r}</b></li>`,d=Math.round(l.reduce((s,r)=>s+(r.index||0),0)/l.length);return`<div class="ainsights">
    <div class="ainsights__head"><b>${l.length} ficha${l.length>1?"s":""} preenchida${l.length>1?"s":""}</b><small>\xEDndice m\xE9dio de esquecimento ${d}/100</small></div>
    <h4>Profiss\xF5es</h4><ul class="abars">${i(l.map(s=>s.profession)).map(s=>o(s)).join("")}</ul>
    <h4>\xC1reas</h4><ul class="abars">${i(l.map(s=>s.area)).map(s=>o(s)).join("")}</ul>
    <h4>Maiores dificuldades</h4><ul class="abars">${i(l.flatMap(s=>s.difficulties||[])).map(s=>o(s,j.find(r=>r.id===s[0])?.label||s[0])).join("")}</ul>
  </div>`}function U(a){return a===null?"":`<section class="block">
    <h2 class="block__title">${b("alert",16)} Erros do app ${a.length?`<small>(${a.length})</small>`:""}</h2>
    ${a.length?`<div class="aerrs">${a.slice(0,40).map(l=>`<div class="aerr">
        <div class="aerr__top"><b>${t(l.msg)}</b><span>${l.count}\xD7</span></div>
        <small>${t(l.where||"\u2014")} \xB7 ${t(l.dev||"")} \xB7 vers\xE3o ${t(l.ver||"?")} \xB7 ${(l.users||[]).length} pessoa${(l.users||[]).length===1?"":"s"} \xB7 \xFAltimo ${t(D(l.last))}</small>
      </div>`).join("")}</div>
      <button class="btn btn--soft btn--sm" data-clear-errors>Limpar a lista (depois de corrigir)</button>`:'<p class="fhelp">Nenhum erro registrado. \u{1F389} Quando algo der errado no celular de algu\xE9m, aparece aqui.</p>'}
  </section>`}async function K(){let a=null,l=null,i=null,o="",d={},s=null,r=()=>{if(l)return`${u("Painel do dono")}<div class="page page--sheet"><div class="empty"><h3>N\xE3o consegui carregar</h3><p>${t(l)}</p></div></div>`;if(!a)return`${u("Painel do dono")}<div class="page page--sheet"><p class="fhelp">Carregando contas\u2026</p></div>`;let n=Date.now(),h=e=>a.filter(v=>v.lastSeen&&n-v.lastSeen<e*864e5).length,g=a.filter(e=>!o||`${e.name} ${e.email} ${e.profile?.profession||""}`.toLowerCase().includes(o)).sort((e,v)=>(v.lastSeen||0)-(e.lastSeen||0)),$=a.filter(e=>e.createdAt&&n-e.createdAt<7*864e5).length;S=e=>d[e]||null;let c=Object.values(d).filter(e=>e.plan==="monthly"||e.plan==="lifetime"),f=Object.values(d).filter(e=>e.addon&&e.addon.active),L=Object.values(d).filter(e=>e.plan==="monthly").length*9.9+f.reduce((e,v)=>e+(v.addon.plan==="equipe"?14.9:6.9),0),A=Object.values(d).filter(e=>e.plan!=="none"&&e.plan!=="team").length,P=A?Math.round(c.length/A*100):0;return`${u("Painel do dono",{right:'<button class="btn-text" data-reload>Atualizar</button>'})}
    <div class="page page--sheet">
      <div class="akpis">
        <div><b>${a.length}</b><small>contas</small></div>
        <div><b>${a.filter(e=>e.lastSeen&&n-e.lastSeen<15*6e4).length}</b><small>usando agora</small></div>
        <div><b>${h(1)}</b><small>ativas hoje</small></div>
        <div><b>${h(7)}</b><small>na semana</small></div>
        <div><b>${$}</b><small>novas (7 dias)</small></div>
        <div><b>${a.filter(e=>e.device?.installed).length}</b><small>instalaram</small></div>
        <div><b>${a.filter(e=>e.device?.notifications==="granted"&&e.device?.registered).length}</b><small>com avisos</small></div>
        <div><b>${a.reduce((e,v)=>e+(v.counts?.myEvents||0),0)}</b><small>eventos criados</small></div>
        <div><b>${c.length}</b><small>pagantes</small></div>
        <div><b>${Object.values(d).filter(e=>e.plan==="trial").length}</b><small>em teste</small></div>
        <div><b>${Object.values(d).filter(e=>e.plan==="lifetime").length}</b><small>vital\xEDcios</small></div>
        <div><b>${f.length}</b><small>agendas compartilhadas</small></div>
        <div><b>${a.filter(e=>e.workspace==="compartilhada").length}</b><small>convidados</small></div>
        <div><b>R$ ${L.toFixed(2).replace(".",",")}</b><small>por m\xEAs</small></div>
        <div><b>R$ ${(Object.values(d).filter(e=>e.plan==="lifetime").length*150).toLocaleString("pt-BR")}</b><small>vital\xEDcios (total)</small></div>
        <div><b>${P}%</b><small>convers\xE3o</small></div>
      </div>
      ${U(s)}
      ${z(a)}
      <input class="input" type="search" placeholder="Buscar por nome, e-mail ou profiss\xE3o" data-q value="${t(o)}">
      <div class="accts">${g.map(e=>T(e,e.uid===i)).join("")||'<p class="fhelp">Nenhuma conta encontrada.</p>'}</div>
      <p class="fhelp">As contas aparecem aqui depois de abrirem o app atualizado pelo menos uma vez. Toque numa conta para ver os detalhes.</p>
    </div>`},m=k({className:"sheet--tall",html:r(),onMount:n=>{n.el.querySelectorAll("[data-toggle]").forEach(c=>c.onclick=()=>{i=i===c.dataset.toggle?null:c.dataset.toggle,n.set(r())});let h=n.el.querySelector("[data-reload]");h&&(h.onclick=()=>p());let g=n.el.querySelector("[data-clear-errors]");g&&(g.onclick=async()=>{try{let{api:c}=await import("./c-SSA6DWOD.js");s=(await c("/admin/errors",{clear:!0})).errors||[],n.set(r())}catch{C("N\xE3o consegui limpar agora.")}});let $=n.el.querySelector("[data-q]");$&&($.oninput=()=>{o=$.value.trim().toLowerCase();let c=$.selectionStart;n.set(r());let f=n.el.querySelector("[data-q]");f.focus(),f.setSelectionRange(c,c)})}}),p=async()=>{try{a=await y.backendApi.listStats(),l=null;try{let{api:n}=await import("./c-SSA6DWOD.js");d=(await n("/billing/all",{})).byWs||{}}catch{d={}}try{let{api:n}=await import("./c-SSA6DWOD.js");s=(await n("/admin/errors",{})).errors||[]}catch{s=null}}catch(n){l=/permission/i.test(String(n.code||n.message))?"Falta atualizar as regras do Firebase (bloco \u201Cstats\u201D).":"Verifique a internet e toque em Atualizar."}m.set(r())};return p(),m}var Q=()=>!!y.user&&!!w.adminEmail&&(y.user.email||"").toLowerCase()===w.adminEmail.toLowerCase();export{Q as isOwner,K as openAdmin};
