import{l as w,n as h}from"./c-EXX2MQ62.js";import{f as $}from"./c-RGFQ4KJ7.js";import"./c-RXMPZOAJ.js";import{a as p}from"./c-AKZEKLBI.js";import{B as o,d as u,e as f}from"./c-YEARXB46.js";import{a as g}from"./c-UCBOIM2G.js";import"./c-3GA6RSWB.js";import"./c-VHNSBD2M.js";var C=a=>{if(!a)return"\u2014";let t=Math.round((Date.now()-a)/6e4);if(t<2)return"agora";if(t<60)return`h\xE1 ${t} min`;let e=Math.round(t/60);if(e<24)return`h\xE1 ${e}h`;let l=Math.round(e/24);return l===1?"ontem":`h\xE1 ${l} dias`},k=a=>a?new Date(a).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric"}):"\u2014",D={ios:"iPhone","ios-other":"iPhone (Chrome)",android:"Android",samsung:"Android (Samsung)",desktop:"Computador"},E={granted:"ligadas",denied:"bloqueadas",default:"n\xE3o ativadas",unsupported:"n\xE3o suportadas"};function _(a,t=44){let e=(a.name||a.email||"?").trim().charAt(0).toUpperCase();return`<span class="aface" style="--s:${t}px;background:${o(a.color||"#8E8E93")}">${a.photo?`<img src="${a.photo}" alt="">`:o(e)}</span>`}function P(a){let t=u(),e=new Set(a.activeDays||[]);return Array.from({length:30},(l,n)=>f(t,n-29)).map(l=>`<i class="${e.has(l)?"on":""}" title="${l.split("-").reverse().join("/")}"></i>`).join("")}var A=()=>null,j=a=>a&&{trial:"Teste gr\xE1tis",monthly:"Mensal",lifetime:"Vital\xEDcio",expired:"Teste acabou",blocked:"Sem plano",none:"Sem plano"}[a.plan]||"Conta pr\xF3pria";function L(a,t){let e=a.counts||{},l=a.device||{},n=a.lastSeen&&Date.now()-a.lastSeen<15*6e4;return`<div class="acct${t?" is-open":""}" data-uid="${o(a.uid)}">
    <button class="acct__top" data-toggle="${o(a.uid)}">
      ${_(a)}
      <div class="acct__id"><strong>${o(a.name||"Sem nome")}${n?' <span class="adot" title="Usando agora"></span>':""}</strong><small>${o(a.email||"")}</small></div>
      <div class="acct__last"><b>${o(C(a.lastSeen))}</b><small>${a.workspace==="dupla"?"Dupla":j(A(a.uid))}</small></div>
    </button>
    <div class="acct__chips">
      <span>${p("building",12)} ${e.companies||0} empresas</span>
      <span>${p("calendar",12)} ${e.myEvents||0} eventos</span>
      <span>${p("heart",12)} ${e.personal||0} pessoais</span>
      <span class="${l.notifications==="granted"&&l.registered?"ok":"warn"}">${p("bell",12)} ${l.notifications==="granted"&&l.registered?"avisos ok":"sem avisos"}</span>
    </div>
    ${t?`<div class="acct__more">
      <div class="agrid">
        <div><small>Conta criada</small><b>${o(k(a.createdAt))}</b></div>
        <div><small>\xDAltimo acesso</small><b>${o(a.lastSeen?new Date(a.lastSeen).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):"\u2014")}</b></div>
        <div><small>Vezes que abriu</small><b>${a.opens||0}</b></div>
        <div><small>Dias ativos (30 dias)</small><b>${(a.activeDays||[]).filter(r=>r>=f(u(),-29)).length}</b></div>
        <div><small>Aparelho</small><b>${o(D[l.platform]||"\u2014")}</b></div>
        <div><small>Instalado na tela inicial</small><b>${l.installed?"Sim":"N\xE3o"}</b></div>
        <div><small>Notifica\xE7\xF5es</small><b>${o(E[l.notifications]||"\u2014")}${l.registered?" \xB7 cadastrado":""}</b></div>
        <div><small>\xDAltimo modo usado</small><b>${a.space==="personal"?"Pessoal":"Trabalho"}</b></div>
      </div>
      <h4>Trabalho</h4>
      <div class="agrid">
        <div><small>Empresas</small><b>${e.companies||0}</b></div>
        <div><small>Eventos (total no espa\xE7o)</small><b>${e.events||0}</b></div>
        <div><small>Cadastrados por ele(a)</small><b>${e.myEvents||0}</b></div>
        <div><small>Pr\xF3ximos 7 dias</small><b>${e.thisWeek||0}</b></div>
        <div><small>Posts (30 dias)</small><b>${e.posts30||0}</b></div>
        <div><small>Feitos (30 dias)</small><b>${e.done30||0}</b></div>
        <div><small>Atrasados (30 dias)</small><b class="${e.late?"bad":""}">${e.late||0}</b></div>
        <div><small>Bilhetes</small><b>${e.notes||0}</b></div>
      </div>
      <h4>Pessoal <small>(s\xF3 quantidade; o conte\xFAdo \xE9 privado)</small></h4>
      <div class="agrid">
        <div><small>Anota\xE7\xF5es</small><b>${e.personal||0}</b></div>
        <div><small>Listas</small><b>${e.lists||0}</b></div>
        <div><small>Anivers\xE1rios</small><b>${e.birthdays||0}</b></div>
      </div>
      <h4>Uso nos \xFAltimos 30 dias</h4>
      <div class="adays">${P(a)}</div>
    </div>`:""}
  </div>`}async function M(){let a=null,t=null,e=null,l="",n={},r=()=>{if(t)return`${h("Painel do dono")}<div class="page page--sheet"><div class="empty"><h3>N\xE3o consegui carregar</h3><p>${o(t)}</p></div></div>`;if(!a)return`${h("Painel do dono")}<div class="page page--sheet"><p class="fhelp">Carregando contas\u2026</p></div>`;let i=Date.now(),v=s=>a.filter(m=>m.lastSeen&&i-m.lastSeen<s*864e5).length,c=a.filter(s=>!l||`${s.name} ${s.email}`.toLowerCase().includes(l)).sort((s,m)=>(m.lastSeen||0)-(s.lastSeen||0)),d=a.filter(s=>s.createdAt&&i-s.createdAt<7*864e5).length;A=s=>n[s]||null;let b=Object.values(n).filter(s=>s.plan==="monthly"||s.plan==="lifetime"),q=Object.values(n).filter(s=>s.plan==="monthly").length*9.9;return`${h("Painel do dono",{right:'<button class="btn-text" data-reload>Atualizar</button>'})}
    <div class="page page--sheet">
      <div class="akpis">
        <div><b>${a.length}</b><small>contas</small></div>
        <div><b>${a.filter(s=>s.lastSeen&&i-s.lastSeen<15*6e4).length}</b><small>usando agora</small></div>
        <div><b>${v(1)}</b><small>ativas hoje</small></div>
        <div><b>${v(7)}</b><small>na semana</small></div>
        <div><b>${d}</b><small>novas (7 dias)</small></div>
        <div><b>${a.filter(s=>s.device?.installed).length}</b><small>instalaram</small></div>
        <div><b>${a.filter(s=>s.device?.notifications==="granted"&&s.device?.registered).length}</b><small>com avisos</small></div>
        <div><b>${a.reduce((s,m)=>s+(m.counts?.myEvents||0),0)}</b><small>eventos criados</small></div>
        <div><b>${b.length}</b><small>pagantes</small></div>
        <div><b>${Object.values(n).filter(s=>s.plan==="trial").length}</b><small>em teste</small></div>
        <div><b>${Object.values(n).filter(s=>s.plan==="lifetime").length}</b><small>vital\xEDcios</small></div>
        <div><b>R$ ${q.toFixed(2).replace(".",",")}</b><small>por m\xEAs</small></div>
      </div>
      <input class="input" type="search" placeholder="Buscar por nome ou e-mail" data-q value="${o(l)}">
      <div class="accts">${c.map(s=>L(s,s.uid===e)).join("")||'<p class="fhelp">Nenhuma conta encontrada.</p>'}</div>
      <p class="fhelp">As contas aparecem aqui depois de abrirem o app atualizado pelo menos uma vez. Toque numa conta para ver os detalhes.</p>
    </div>`},y=w({className:"sheet--tall",html:r(),onMount:i=>{i.el.querySelectorAll("[data-toggle]").forEach(d=>d.onclick=()=>{e=e===d.dataset.toggle?null:d.dataset.toggle,i.set(r())});let v=i.el.querySelector("[data-reload]");v&&(v.onclick=()=>S());let c=i.el.querySelector("[data-q]");c&&(c.oninput=()=>{l=c.value.trim().toLowerCase();let d=c.selectionStart;i.set(r());let b=i.el.querySelector("[data-q]");b.focus(),b.setSelectionRange(d,d)})}}),S=async()=>{try{a=await $.backendApi.listStats(),t=null;try{let{api:i}=await import("./c-7IL2T3Z2.js");n=(await i("/billing/all",{})).byWs||{}}catch{n={}}}catch(i){t=/permission/i.test(String(i.code||i.message))?"Falta atualizar as regras do Firebase (bloco \u201Cstats\u201D).":"Verifique a internet e toque em Atualizar."}y.set(r())};return S(),y}var B=()=>!!$.user&&!!g.adminEmail&&($.user.email||"").toLowerCase()===g.adminEmail.toLowerCase();export{B as isOwner,M as openAdmin};
