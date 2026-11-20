import{a as E,b as C,f as N}from"./c-DIUQLQ5R.js";import{m as D,o as S,p as O}from"./c-N6E6YQRF.js";import{f as w}from"./c-BEKBV4UA.js";import"./c-XXF3RBEU.js";import{a as f}from"./c-X3PB6JZ2.js";import{B as o,d as q,e as _}from"./c-YEARXB46.js";import{a as j}from"./c-BYHTQNTY.js";import"./c-S6VVKE3W.js";import"./c-VHNSBD2M.js";var x=a=>{if(!a)return"\u2014";let s=Math.round((Date.now()-a)/6e4);if(s<2)return"agora";if(s<60)return`h\xE1 ${s} min`;let i=Math.round(s/60);if(i<24)return`h\xE1 ${i}h`;let t=Math.round(i/24);return t===1?"ontem":`h\xE1 ${t} dias`},P=a=>a?new Date(a).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric"}):"\u2014",M={ios:"iPhone","ios-other":"iPhone (Chrome)",android:"Android",samsung:"Android (Samsung)",desktop:"Computador"},z={granted:"ligadas",denied:"bloqueadas",default:"n\xE3o ativadas",unsupported:"n\xE3o suportadas"};function I(a,s=44){let i=(a.name||a.email||"?").trim().charAt(0).toUpperCase();return`<span class="aface" style="--s:${s}px;background:${o(a.color||"#8E8E93")}">${a.photo?`<img src="${a.photo}" alt="">`:o(i)}</span>`}function R(a){let s=q(),i=new Set(a.activeDays||[]);return Array.from({length:30},(t,n)=>_(s,n-29)).map(t=>`<i class="${i.has(t)?"on":""}" title="${t.split("-").reverse().join("/")}"></i>`).join("")}var A=()=>null,T=a=>a&&{trial:"Teste gr\xE1tis",monthly:"Mensal",lifetime:"Vital\xEDcio",expired:"Teste acabou",blocked:"Sem plano",none:"Sem plano"}[a.plan]||"Conta pr\xF3pria";function U(a,s){let i=a.counts||{},t=a.device||{},n=a.lastSeen&&Date.now()-a.lastSeen<15*6e4;return`<div class="acct${s?" is-open":""}" data-uid="${o(a.uid)}">
    <button class="acct__top" data-toggle="${o(a.uid)}">
      ${I(a)}
      <div class="acct__id"><strong>${o(a.name||"Sem nome")}${n?' <span class="adot" title="Usando agora"></span>':""}</strong><small>${o(a.email||"")}</small></div>
      <div class="acct__last"><b>${o(x(a.lastSeen))}</b><small>${a.workspace==="dupla"?"Dupla":a.workspace==="compartilhada"?"Convidado":T(A(a.uid))}${A(a.uid)?.addon?.active?` + ${A(a.uid).addon.plan==="equipe"?"Equipe":"Dupla"}`:""}</small></div>
    </button>
    ${a.profile?.done?`<div class="acct__prof">${f("idcard",13)} <b>${o(a.profile.profession||"\u2014")}</b>${a.profile.age?` \xB7 ${o(a.profile.age)} anos`:""} \xB7 \xEDndice ${a.profile.index}/100</div>`:a.workspace!=="dupla"?`<div class="acct__prof is-off">${f("idcard",13)} Ficha n\xE3o preenchida</div>`:""}
    <div class="acct__chips">
      <span>${f("building",12)} ${i.companies||0} grupos</span>
      <span>${f("calendar",12)} ${i.myEvents||0} eventos</span>
      <span>${f("heart",12)} ${i.personal||0} pessoais</span>
      <span class="${t.notifications==="granted"&&t.registered?"ok":"warn"}">${f("bell",12)} ${t.notifications==="granted"&&t.registered?"avisos ok":"sem avisos"}</span>
    </div>
    ${s?`<div class="acct__more">
      <div class="agrid">
        <div><small>Conta criada</small><b>${o(P(a.createdAt))}</b></div>
        <div><small>\xDAltimo acesso</small><b>${o(a.lastSeen?new Date(a.lastSeen).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):"\u2014")}</b></div>
        <div><small>Vezes que abriu</small><b>${a.opens||0}</b></div>
        <div><small>Dias ativos (30 dias)</small><b>${(a.activeDays||[]).filter(l=>l>=_(q(),-29)).length}</b></div>
        <div><small>Aparelho</small><b>${o(M[t.platform]||"\u2014")}</b></div>
        <div><small>Instalado na tela inicial</small><b>${t.installed?"Sim":"N\xE3o"}</b></div>
        <div><small>Notifica\xE7\xF5es</small><b>${o(z[t.notifications]||"\u2014")}${t.registered?" \xB7 cadastrado":""}</b></div>
        <div><small>\xDAltimo modo usado</small><b>${a.space==="personal"?"Pessoal":"Trabalho"}</b></div>
      </div>
      ${a.profile?.done?`<h4>Ficha</h4>
      <div class="agrid">
        <div><small>Profiss\xE3o</small><b>${o(a.profile.profession||"\u2014")}</b></div>
        <div><small>\xC1rea</small><b>${o(a.profile.area||"\u2014")}</b></div>
        <div><small>Idade</small><b>${o(a.profile.age||"\u2014")}</b></div>
        <div><small>\xCDndice de esquecimento</small><b>${a.profile.index}/100 (marcou ${a.profile.forget}/5)</b></div>
        <div><small>Jornada</small><b>${o(C.find(l=>l.id===a.profile.journey)?.label||"\u2014")}</b></div>
        <div><small>Objetivo</small><b>${o(N.find(l=>l.id===a.profile.goal)?.label||"\u2014")}</b></div>
      </div>
      ${(a.profile.difficulties||[]).length?`<div class="adiffs">${a.profile.difficulties.map(l=>`<span>${o(E.find(d=>d.id===l)?.label||l)}</span>`).join("")}</div>`:""}`:""}
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
      <div class="adays">${R(a)}</div>
    </div>`:""}
  </div>`}function B(a){let s=a.map(l=>l.profile).filter(l=>l&&l.done);if(!s.length)return"";let i=(l,d=5)=>Object.entries(l.reduce((p,v)=>(v&&(p[v]=(p[v]||0)+1),p),{})).sort((p,v)=>v[1]-p[1]).slice(0,d),t=([l,d],p=l)=>`<li><span>${o(p)}</span><i style="--w:${Math.round(d/s.length*100)}%"></i><b>${d}</b></li>`,n=Math.round(s.reduce((l,d)=>l+(d.index||0),0)/s.length);return`<div class="ainsights">
    <div class="ainsights__head"><b>${s.length} ficha${s.length>1?"s":""} preenchida${s.length>1?"s":""}</b><small>\xEDndice m\xE9dio de esquecimento ${n}/100</small></div>
    <h4>Profiss\xF5es</h4><ul class="abars">${i(s.map(l=>l.profession)).map(l=>t(l)).join("")}</ul>
    <h4>\xC1reas</h4><ul class="abars">${i(s.map(l=>l.area)).map(l=>t(l)).join("")}</ul>
    <h4>Maiores dificuldades</h4><ul class="abars">${i(s.flatMap(l=>l.difficulties||[])).map(l=>t(l,E.find(d=>d.id===l[0])?.label||l[0])).join("")}</ul>
  </div>`}function V(a){return a===null?"":`<section class="block">
    <h2 class="block__title">${f("alert",16)} Erros do app ${a.length?`<small>(${a.length})</small>`:""}</h2>
    ${a.length?`<div class="aerrs">${a.slice(0,40).map(s=>`<div class="aerr">
        <div class="aerr__top"><b>${o(s.msg)}</b><span>${s.count}\xD7</span></div>
        <small>${o(s.where||"\u2014")} \xB7 ${o(s.dev||"")} \xB7 vers\xE3o ${o(s.ver||"?")} \xB7 ${(s.users||[]).length} pessoa${(s.users||[]).length===1?"":"s"} \xB7 \xFAltimo ${o(x(s.last))}</small>
      </div>`).join("")}</div>
      <button class="btn btn--soft btn--sm" data-clear-errors>Limpar a lista (depois de corrigir)</button>`:'<p class="fhelp">Nenhum erro registrado. \u{1F389} Quando algo der errado no celular de algu\xE9m, aparece aqui.</p>'}
  </section>`}var h=a=>Number.isFinite(Number(a))?Number(a):0,c=(a,s=120)=>typeof a=="string"?a.slice(0,s):"";function W(a){let s=a.counts||{},i=a.device||{},t=a.profile||{};return{uid:c(a.uid,64),name:c(a.name,60),email:c(a.email,120),workspace:c(a.workspace,20),space:c(a.space,20),photo:typeof a.photo=="string"&&/^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(a.photo)?a.photo:null,color:/^#[0-9a-fA-F]{6}$/.test(a.color||"")?a.color:"#8E8E93",createdAt:h(a.createdAt),lastSeen:h(a.lastSeen),opens:h(a.opens),activeDays:Array.isArray(a.activeDays)?a.activeDays.filter(n=>/^\d{4}-\d{2}-\d{2}$/.test(n)).slice(-40):[],counts:Object.fromEntries(["companies","events","myEvents","thisWeek","done30","late","posts30","notes","personal","lists","birthdays"].map(n=>[n,h(s[n])])),device:{platform:c(i.platform,20),installed:!!i.installed,notifications:c(i.notifications,20),registered:!!i.registered},profile:t.done?{done:!0,profession:c(t.profession,80),area:c(t.area,80),age:c(t.age,10),index:h(t.index),forget:h(t.forget),difficulties:Array.isArray(t.difficulties)?t.difficulties.filter(n=>typeof n=="string").slice(0,12).map(n=>n.slice(0,30)):[],goal:c(t.goal,30),journey:c(t.journey,30)}:{done:!1}}}async function Z(){let a=null,s=null,i=null,t="",n={},l=null,d=()=>{if(s)return`${S("Painel do dono")}<div class="page page--sheet"><div class="empty"><h3>N\xE3o consegui carregar</h3><p>${o(s)}</p></div></div>`;if(!a)return`${S("Painel do dono")}<div class="page page--sheet"><p class="fhelp">Carregando contas\u2026</p></div>`;let r=Date.now(),g=e=>a.filter(b=>b.lastSeen&&r-b.lastSeen<e*864e5).length,y=a.filter(e=>!t||`${e.name} ${e.email} ${e.profile?.profession||""}`.toLowerCase().includes(t)).sort((e,b)=>(b.lastSeen||0)-(e.lastSeen||0)),$=a.filter(e=>e.createdAt&&r-e.createdAt<7*864e5).length;A=e=>n[e]||null;let m=Object.values(n).filter(e=>e.plan==="monthly"||e.plan==="lifetime"),u=Object.values(n).filter(e=>e.addon&&e.addon.active),F=Object.values(n).filter(e=>e.plan==="monthly").length*9.9+u.reduce((e,b)=>e+(b.addon.plan==="equipe"?14.9:6.9),0),k=Object.values(n).filter(e=>e.plan!=="none"&&e.plan!=="team").length,L=k?Math.round(m.length/k*100):0;return`${S("Painel do dono",{right:'<button class="btn-text" data-reload>Atualizar</button>'})}
    <div class="page page--sheet">
      <div class="akpis">
        <div><b>${a.length}</b><small>contas</small></div>
        <div><b>${a.filter(e=>e.lastSeen&&r-e.lastSeen<15*6e4).length}</b><small>usando agora</small></div>
        <div><b>${g(1)}</b><small>ativas hoje</small></div>
        <div><b>${g(7)}</b><small>na semana</small></div>
        <div><b>${$}</b><small>novas (7 dias)</small></div>
        <div><b>${a.filter(e=>e.device?.installed).length}</b><small>instalaram</small></div>
        <div><b>${a.filter(e=>e.device?.notifications==="granted"&&e.device?.registered).length}</b><small>com avisos</small></div>
        <div><b>${a.reduce((e,b)=>e+(b.counts?.myEvents||0),0)}</b><small>eventos criados</small></div>
        <div><b>${m.length}</b><small>pagantes</small></div>
        <div><b>${Object.values(n).filter(e=>e.plan==="trial").length}</b><small>em teste</small></div>
        <div><b>${Object.values(n).filter(e=>e.plan==="lifetime").length}</b><small>vital\xEDcios</small></div>
        <div><b>${u.length}</b><small>agendas compartilhadas</small></div>
        <div><b>${a.filter(e=>e.workspace==="compartilhada").length}</b><small>convidados</small></div>
        <div><b>R$ ${F.toFixed(2).replace(".",",")}</b><small>por m\xEAs</small></div>
        <div><b>R$ ${(Object.values(n).filter(e=>e.plan==="lifetime").length*150).toLocaleString("pt-BR")}</b><small>vital\xEDcios (total)</small></div>
        <div><b>${L}%</b><small>convers\xE3o</small></div>
      </div>
      ${V(l)}
      ${B(a)}
      <input class="input" type="search" placeholder="Buscar por nome, e-mail ou profiss\xE3o" data-q value="${o(t)}">
      <div class="accts">${y.map(e=>U(e,e.uid===i)).join("")||'<p class="fhelp">Nenhuma conta encontrada.</p>'}</div>
      <p class="fhelp">As contas aparecem aqui depois de abrirem o app atualizado pelo menos uma vez. Toque numa conta para ver os detalhes.</p>
    </div>`},p=D({className:"sheet--tall",html:d(),onMount:r=>{r.el.querySelectorAll("[data-toggle]").forEach(m=>m.onclick=()=>{i=i===m.dataset.toggle?null:m.dataset.toggle,r.set(d())});let g=r.el.querySelector("[data-reload]");g&&(g.onclick=()=>v());let y=r.el.querySelector("[data-clear-errors]");y&&(y.onclick=async()=>{try{let{api:m}=await import("./c-UE252D6R.js");l=(await m("/admin/errors",{clear:!0})).errors||[],r.set(d())}catch{O("N\xE3o consegui limpar agora.")}});let $=r.el.querySelector("[data-q]");$&&($.oninput=()=>{t=$.value.trim().toLowerCase();let m=$.selectionStart;r.set(d());let u=r.el.querySelector("[data-q]");u.focus(),u.setSelectionRange(m,m)})}}),v=async()=>{try{a=(await w.backendApi.listStats()).map(W),s=null;try{let{api:r}=await import("./c-UE252D6R.js");n=(await r("/billing/all",{})).byWs||{}}catch{n={}}try{let{api:r}=await import("./c-UE252D6R.js");l=(await r("/admin/errors",{})).errors||[]}catch{l=null}}catch(r){s=/permission/i.test(String(r.code||r.message))?"Falta atualizar as regras do Firebase (bloco \u201Cstats\u201D).":"Verifique a internet e toque em Atualizar."}p.set(d())};return v(),p}var X=()=>!!w.user&&!!j.adminEmail&&(w.user.email||"").toLowerCase()===j.adminEmail.toLowerCase();export{X as isOwner,Z as openAdmin};
