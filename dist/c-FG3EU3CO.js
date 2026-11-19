import{l as S,n as $}from"./c-EXX2MQ62.js";import{f as b}from"./c-RGFQ4KJ7.js";import"./c-RXMPZOAJ.js";import{a as v}from"./c-AKZEKLBI.js";import{B as i,d as g,e as u}from"./c-YEARXB46.js";import"./c-3GA6RSWB.js";import{a as h}from"./c-UCBOIM2G.js";import"./c-VHNSBD2M.js";var y=a=>{if(!a)return"\u2014";let l=Math.round((Date.now()-a)/6e4);if(l<2)return"agora";if(l<60)return`h\xE1 ${l} min`;let s=Math.round(l/60);if(s<24)return`h\xE1 ${s}h`;let t=Math.round(s/24);return t===1?"ontem":`h\xE1 ${t} dias`},A=a=>a?new Date(a).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric"}):"\u2014",w={ios:"iPhone","ios-other":"iPhone (Chrome)",android:"Android",samsung:"Android (Samsung)",desktop:"Computador"},q={granted:"ligadas",denied:"bloqueadas",default:"n\xE3o ativadas",unsupported:"n\xE3o suportadas"};function C(a,l=44){let s=(a.name||a.email||"?").trim().charAt(0).toUpperCase();return`<span class="aface" style="--s:${l}px;background:${i(a.color||"#8E8E93")}">${a.photo?`<img src="${a.photo}" alt="">`:i(s)}</span>`}function D(a){let l=g(),s=new Set(a.activeDays||[]);return Array.from({length:30},(t,n)=>u(l,n-29)).map(t=>`<i class="${s.has(t)?"on":""}" title="${t.split("-").reverse().join("/")}"></i>`).join("")}function k(a,l){let s=a.counts||{},t=a.device||{},n=a.lastSeen&&Date.now()-a.lastSeen<15*6e4;return`<div class="acct${l?" is-open":""}" data-uid="${i(a.uid)}">
    <button class="acct__top" data-toggle="${i(a.uid)}">
      ${C(a)}
      <div class="acct__id"><strong>${i(a.name||"Sem nome")}${n?' <span class="adot" title="Usando agora"></span>':""}</strong><small>${i(a.email||"")}</small></div>
      <div class="acct__last"><b>${i(y(a.lastSeen))}</b><small>${a.workspace==="dupla"?"Dupla":"Conta pr\xF3pria"}</small></div>
    </button>
    <div class="acct__chips">
      <span>${v("building",12)} ${s.companies||0} empresas</span>
      <span>${v("calendar",12)} ${s.myEvents||0} eventos</span>
      <span>${v("heart",12)} ${s.personal||0} pessoais</span>
      <span class="${t.notifications==="granted"&&t.registered?"ok":"warn"}">${v("bell",12)} ${t.notifications==="granted"&&t.registered?"avisos ok":"sem avisos"}</span>
    </div>
    ${l?`<div class="acct__more">
      <div class="agrid">
        <div><small>Conta criada</small><b>${i(A(a.createdAt))}</b></div>
        <div><small>\xDAltimo acesso</small><b>${i(a.lastSeen?new Date(a.lastSeen).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):"\u2014")}</b></div>
        <div><small>Vezes que abriu</small><b>${a.opens||0}</b></div>
        <div><small>Dias ativos (30 dias)</small><b>${(a.activeDays||[]).filter(p=>p>=u(g(),-29)).length}</b></div>
        <div><small>Aparelho</small><b>${i(w[t.platform]||"\u2014")}</b></div>
        <div><small>Instalado na tela inicial</small><b>${t.installed?"Sim":"N\xE3o"}</b></div>
        <div><small>Notifica\xE7\xF5es</small><b>${i(q[t.notifications]||"\u2014")}${t.registered?" \xB7 cadastrado":""}</b></div>
        <div><small>\xDAltimo modo usado</small><b>${a.space==="personal"?"Pessoal":"Trabalho"}</b></div>
      </div>
      <h4>Trabalho</h4>
      <div class="agrid">
        <div><small>Empresas</small><b>${s.companies||0}</b></div>
        <div><small>Eventos (total no espa\xE7o)</small><b>${s.events||0}</b></div>
        <div><small>Cadastrados por ele(a)</small><b>${s.myEvents||0}</b></div>
        <div><small>Pr\xF3ximos 7 dias</small><b>${s.thisWeek||0}</b></div>
        <div><small>Posts (30 dias)</small><b>${s.posts30||0}</b></div>
        <div><small>Feitos (30 dias)</small><b>${s.done30||0}</b></div>
        <div><small>Atrasados (30 dias)</small><b class="${s.late?"bad":""}">${s.late||0}</b></div>
        <div><small>Bilhetes</small><b>${s.notes||0}</b></div>
      </div>
      <h4>Pessoal <small>(s\xF3 quantidade; o conte\xFAdo \xE9 privado)</small></h4>
      <div class="agrid">
        <div><small>Anota\xE7\xF5es</small><b>${s.personal||0}</b></div>
        <div><small>Listas</small><b>${s.lists||0}</b></div>
        <div><small>Anivers\xE1rios</small><b>${s.birthdays||0}</b></div>
      </div>
      <h4>Uso nos \xFAltimos 30 dias</h4>
      <div class="adays">${D(a)}</div>
    </div>`:""}
  </div>`}async function x(){let a=null,l=null,s=null,t="",n=()=>{if(l)return`${$("Painel do dono")}<div class="page page--sheet"><div class="empty"><h3>N\xE3o consegui carregar</h3><p>${i(l)}</p></div></div>`;if(!a)return`${$("Painel do dono")}<div class="page page--sheet"><p class="fhelp">Carregando contas\u2026</p></div>`;let o=Date.now(),m=e=>a.filter(c=>c.lastSeen&&o-c.lastSeen<e*864e5).length,r=a.filter(e=>!t||`${e.name} ${e.email}`.toLowerCase().includes(t)).sort((e,c)=>(c.lastSeen||0)-(e.lastSeen||0)),d=a.filter(e=>e.createdAt&&o-e.createdAt<7*864e5).length;return`${$("Painel do dono",{right:'<button class="btn-text" data-reload>Atualizar</button>'})}
    <div class="page page--sheet">
      <div class="akpis">
        <div><b>${a.length}</b><small>contas</small></div>
        <div><b>${a.filter(e=>e.lastSeen&&o-e.lastSeen<15*6e4).length}</b><small>usando agora</small></div>
        <div><b>${m(1)}</b><small>ativas hoje</small></div>
        <div><b>${m(7)}</b><small>na semana</small></div>
        <div><b>${d}</b><small>novas (7 dias)</small></div>
        <div><b>${a.filter(e=>e.device?.installed).length}</b><small>instalaram</small></div>
        <div><b>${a.filter(e=>e.device?.notifications==="granted"&&e.device?.registered).length}</b><small>com avisos</small></div>
        <div><b>${a.reduce((e,c)=>e+(c.counts?.myEvents||0),0)}</b><small>eventos criados</small></div>
      </div>
      <input class="input" type="search" placeholder="Buscar por nome ou e-mail" data-q value="${i(t)}">
      <div class="accts">${r.map(e=>k(e,e.uid===s)).join("")||'<p class="fhelp">Nenhuma conta encontrada.</p>'}</div>
      <p class="fhelp">As contas aparecem aqui depois de abrirem o app atualizado pelo menos uma vez. Toque numa conta para ver os detalhes.</p>
    </div>`},p=S({className:"sheet--tall",html:n(),onMount:o=>{o.el.querySelectorAll("[data-toggle]").forEach(d=>d.onclick=()=>{s=s===d.dataset.toggle?null:d.dataset.toggle,o.set(n())});let m=o.el.querySelector("[data-reload]");m&&(m.onclick=()=>f());let r=o.el.querySelector("[data-q]");r&&(r.oninput=()=>{t=r.value.trim().toLowerCase();let d=r.selectionStart;o.set(n());let e=o.el.querySelector("[data-q]");e.focus(),e.setSelectionRange(d,d)})}}),f=async()=>{try{a=await b.backendApi.listStats(),l=null}catch(o){l=/permission/i.test(String(o.code||o.message))?"Falta atualizar as regras do Firebase (bloco \u201Cstats\u201D).":"Verifique a internet e toque em Atualizar."}p.set(n())};return f(),p}var F=()=>!!b.user&&!!h.adminEmail&&(b.user.email||"").toLowerCase()===h.adminEmail.toLowerCase();export{F as isOwner,x as openAdmin};
