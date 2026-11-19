import{a as q,b as j,c as C}from"./c-DQIQOUTK.js";import{m as _,o as f}from"./c-E7AVQA72.js";import{f as g}from"./c-6ROM2BX7.js";import"./c-ZGL2AU5Q.js";import{a as v}from"./c-CWX5SWSY.js";import{B as o,d as S,e as w}from"./c-YEARXB46.js";import{a as y}from"./c-UCBOIM2G.js";import"./c-35N3UWZE.js";import"./c-VHNSBD2M.js";var E=a=>{if(!a)return"\u2014";let i=Math.round((Date.now()-a)/6e4);if(i<2)return"agora";if(i<60)return`h\xE1 ${i} min`;let l=Math.round(i/60);if(l<24)return`h\xE1 ${l}h`;let t=Math.round(l/24);return t===1?"ontem":`h\xE1 ${t} dias`},k=a=>a?new Date(a).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric"}):"\u2014",O={ios:"iPhone","ios-other":"iPhone (Chrome)",android:"Android",samsung:"Android (Samsung)",desktop:"Computador"},P={granted:"ligadas",denied:"bloqueadas",default:"n\xE3o ativadas",unsupported:"n\xE3o suportadas"};function x(a,i=44){let l=(a.name||a.email||"?").trim().charAt(0).toUpperCase();return`<span class="aface" style="--s:${i}px;background:${o(a.color||"#8E8E93")}">${a.photo?`<img src="${a.photo}" alt="">`:o(l)}</span>`}function F(a){let i=S(),l=new Set(a.activeDays||[]);return Array.from({length:30},(t,d)=>w(i,d-29)).map(t=>`<i class="${l.has(t)?"on":""}" title="${t.split("-").reverse().join("/")}"></i>`).join("")}var u=()=>null,L=a=>a&&{trial:"Teste gr\xE1tis",monthly:"Mensal",lifetime:"Vital\xEDcio",expired:"Teste acabou",blocked:"Sem plano",none:"Sem plano"}[a.plan]||"Conta pr\xF3pria";function M(a,i){let l=a.counts||{},t=a.device||{},d=a.lastSeen&&Date.now()-a.lastSeen<15*6e4;return`<div class="acct${i?" is-open":""}" data-uid="${o(a.uid)}">
    <button class="acct__top" data-toggle="${o(a.uid)}">
      ${x(a)}
      <div class="acct__id"><strong>${o(a.name||"Sem nome")}${d?' <span class="adot" title="Usando agora"></span>':""}</strong><small>${o(a.email||"")}</small></div>
      <div class="acct__last"><b>${o(E(a.lastSeen))}</b><small>${a.workspace==="dupla"?"Dupla":a.workspace==="compartilhada"?"Convidado":L(u(a.uid))}${u(a.uid)?.addon?.active?` + ${u(a.uid).addon.plan==="equipe"?"Equipe":"Dupla"}`:""}</small></div>
    </button>
    ${a.profile?.done?`<div class="acct__prof">${v("idcard",13)} <b>${o(a.profile.profession||"\u2014")}</b>${a.profile.age?` \xB7 ${o(a.profile.age)} anos`:""} \xB7 \xEDndice ${a.profile.index}/100</div>`:a.workspace!=="dupla"?`<div class="acct__prof is-off">${v("idcard",13)} Ficha n\xE3o preenchida</div>`:""}
    <div class="acct__chips">
      <span>${v("building",12)} ${l.companies||0} grupos</span>
      <span>${v("calendar",12)} ${l.myEvents||0} eventos</span>
      <span>${v("heart",12)} ${l.personal||0} pessoais</span>
      <span class="${t.notifications==="granted"&&t.registered?"ok":"warn"}">${v("bell",12)} ${t.notifications==="granted"&&t.registered?"avisos ok":"sem avisos"}</span>
    </div>
    ${i?`<div class="acct__more">
      <div class="agrid">
        <div><small>Conta criada</small><b>${o(k(a.createdAt))}</b></div>
        <div><small>\xDAltimo acesso</small><b>${o(a.lastSeen?new Date(a.lastSeen).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):"\u2014")}</b></div>
        <div><small>Vezes que abriu</small><b>${a.opens||0}</b></div>
        <div><small>Dias ativos (30 dias)</small><b>${(a.activeDays||[]).filter(s=>s>=w(S(),-29)).length}</b></div>
        <div><small>Aparelho</small><b>${o(O[t.platform]||"\u2014")}</b></div>
        <div><small>Instalado na tela inicial</small><b>${t.installed?"Sim":"N\xE3o"}</b></div>
        <div><small>Notifica\xE7\xF5es</small><b>${o(P[t.notifications]||"\u2014")}${t.registered?" \xB7 cadastrado":""}</b></div>
        <div><small>\xDAltimo modo usado</small><b>${a.space==="personal"?"Pessoal":"Trabalho"}</b></div>
      </div>
      ${a.profile?.done?`<h4>Ficha</h4>
      <div class="agrid">
        <div><small>Profiss\xE3o</small><b>${o(a.profile.profession||"\u2014")}</b></div>
        <div><small>\xC1rea</small><b>${o(a.profile.area||"\u2014")}</b></div>
        <div><small>Idade</small><b>${o(a.profile.age||"\u2014")}</b></div>
        <div><small>\xCDndice de esquecimento</small><b>${a.profile.index}/100 (marcou ${a.profile.forget}/5)</b></div>
        <div><small>Jornada</small><b>${o(j.find(s=>s.id===a.profile.journey)?.label||"\u2014")}</b></div>
        <div><small>Objetivo</small><b>${o(C.find(s=>s.id===a.profile.goal)?.label||"\u2014")}</b></div>
      </div>
      ${(a.profile.difficulties||[]).length?`<div class="adiffs">${a.profile.difficulties.map(s=>`<span>${o(q.find(r=>r.id===s)?.label||s)}</span>`).join("")}</div>`:""}`:""}
      <h4>Trabalho</h4>
      <div class="agrid">
        <div><small>Empresas / grupos</small><b>${l.companies||0}</b></div>
        <div><small>Eventos (total no espa\xE7o)</small><b>${l.events||0}</b></div>
        <div><small>Cadastrados por ele(a)</small><b>${l.myEvents||0}</b></div>
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
      <div class="adays">${F(a)}</div>
    </div>`:""}
  </div>`}function N(a){let i=a.map(s=>s.profile).filter(s=>s&&s.done);if(!i.length)return"";let l=(s,r=5)=>Object.entries(s.reduce((c,n)=>(n&&(c[n]=(c[n]||0)+1),c),{})).sort((c,n)=>n[1]-c[1]).slice(0,r),t=([s,r],c=s)=>`<li><span>${o(c)}</span><i style="--w:${Math.round(r/i.length*100)}%"></i><b>${r}</b></li>`,d=Math.round(i.reduce((s,r)=>s+(r.index||0),0)/i.length);return`<div class="ainsights">
    <div class="ainsights__head"><b>${i.length} ficha${i.length>1?"s":""} preenchida${i.length>1?"s":""}</b><small>\xEDndice m\xE9dio de esquecimento ${d}/100</small></div>
    <h4>Profiss\xF5es</h4><ul class="abars">${l(i.map(s=>s.profession)).map(s=>t(s)).join("")}</ul>
    <h4>\xC1reas</h4><ul class="abars">${l(i.map(s=>s.area)).map(s=>t(s)).join("")}</ul>
    <h4>Maiores dificuldades</h4><ul class="abars">${l(i.flatMap(s=>s.difficulties||[])).map(s=>t(s,q.find(r=>r.id===s[0])?.label||s[0])).join("")}</ul>
  </div>`}async function W(){let a=null,i=null,l=null,t="",d={},s=()=>{if(i)return`${f("Painel do dono")}<div class="page page--sheet"><div class="empty"><h3>N\xE3o consegui carregar</h3><p>${o(i)}</p></div></div>`;if(!a)return`${f("Painel do dono")}<div class="page page--sheet"><p class="fhelp">Carregando contas\u2026</p></div>`;let n=Date.now(),$=e=>a.filter(p=>p.lastSeen&&n-p.lastSeen<e*864e5).length,b=a.filter(e=>!t||`${e.name} ${e.email} ${e.profile?.profession||""}`.toLowerCase().includes(t)).sort((e,p)=>(p.lastSeen||0)-(e.lastSeen||0)),m=a.filter(e=>e.createdAt&&n-e.createdAt<7*864e5).length;u=e=>d[e]||null;let h=Object.values(d).filter(e=>e.plan==="monthly"||e.plan==="lifetime"),A=Object.values(d).filter(e=>e.addon&&e.addon.active),D=Object.values(d).filter(e=>e.plan==="monthly").length*9.9+A.reduce((e,p)=>e+(p.addon.plan==="equipe"?14.9:6.9),0);return`${f("Painel do dono",{right:'<button class="btn-text" data-reload>Atualizar</button>'})}
    <div class="page page--sheet">
      <div class="akpis">
        <div><b>${a.length}</b><small>contas</small></div>
        <div><b>${a.filter(e=>e.lastSeen&&n-e.lastSeen<15*6e4).length}</b><small>usando agora</small></div>
        <div><b>${$(1)}</b><small>ativas hoje</small></div>
        <div><b>${$(7)}</b><small>na semana</small></div>
        <div><b>${m}</b><small>novas (7 dias)</small></div>
        <div><b>${a.filter(e=>e.device?.installed).length}</b><small>instalaram</small></div>
        <div><b>${a.filter(e=>e.device?.notifications==="granted"&&e.device?.registered).length}</b><small>com avisos</small></div>
        <div><b>${a.reduce((e,p)=>e+(p.counts?.myEvents||0),0)}</b><small>eventos criados</small></div>
        <div><b>${h.length}</b><small>pagantes</small></div>
        <div><b>${Object.values(d).filter(e=>e.plan==="trial").length}</b><small>em teste</small></div>
        <div><b>${Object.values(d).filter(e=>e.plan==="lifetime").length}</b><small>vital\xEDcios</small></div>
        <div><b>${A.length}</b><small>agendas compartilhadas</small></div>
        <div><b>${a.filter(e=>e.workspace==="compartilhada").length}</b><small>convidados</small></div>
        <div><b>R$ ${D.toFixed(2).replace(".",",")}</b><small>por m\xEAs</small></div>
      </div>
      ${N(a)}
      <input class="input" type="search" placeholder="Buscar por nome, e-mail ou profiss\xE3o" data-q value="${o(t)}">
      <div class="accts">${b.map(e=>M(e,e.uid===l)).join("")||'<p class="fhelp">Nenhuma conta encontrada.</p>'}</div>
      <p class="fhelp">As contas aparecem aqui depois de abrirem o app atualizado pelo menos uma vez. Toque numa conta para ver os detalhes.</p>
    </div>`},r=_({className:"sheet--tall",html:s(),onMount:n=>{n.el.querySelectorAll("[data-toggle]").forEach(m=>m.onclick=()=>{l=l===m.dataset.toggle?null:m.dataset.toggle,n.set(s())});let $=n.el.querySelector("[data-reload]");$&&($.onclick=()=>c());let b=n.el.querySelector("[data-q]");b&&(b.oninput=()=>{t=b.value.trim().toLowerCase();let m=b.selectionStart;n.set(s());let h=n.el.querySelector("[data-q]");h.focus(),h.setSelectionRange(m,m)})}}),c=async()=>{try{a=await g.backendApi.listStats(),i=null;try{let{api:n}=await import("./c-BQQGO3WY.js");d=(await n("/billing/all",{})).byWs||{}}catch{d={}}}catch(n){i=/permission/i.test(String(n.code||n.message))?"Falta atualizar as regras do Firebase (bloco \u201Cstats\u201D).":"Verifique a internet e toque em Atualizar."}r.set(s())};return c(),r}var G=()=>!!g.user&&!!y.adminEmail&&(g.user.email||"").toLowerCase()===y.adminEmail.toLowerCase();export{G as isOwner,W as openAdmin};
