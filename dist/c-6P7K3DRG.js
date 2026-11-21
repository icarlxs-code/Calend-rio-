import{a as M,b as U,h as B}from"./c-4WJ4TYVF.js";import{m as z,o as I,p as E}from"./c-2S5IMKUI.js";import{f as C}from"./c-B34SLPFY.js";import"./c-CID5JDJZ.js";import{a as w}from"./c-CIJP7VMQ.js";import{B as n,d as N,e as x}from"./c-YEARXB46.js";import{a as P}from"./c-MYDFTVQQ.js";import"./c-U53RW4YL.js";import"./c-VHNSBD2M.js";var D=a=>!!a.online&&a.lastPing&&Date.now()-a.lastPing<15e4,V=a=>a?new Date(a).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):"\u2014",H=a=>{if(!a)return"\u2014";let t=Math.round((Date.now()-a)/6e4);if(t<2)return"agora";if(t<60)return`h\xE1 ${t} min`;let i=Math.round(t/60);if(i<24)return`h\xE1 ${i}h`;let o=Math.round(i/24);return o===1?"ontem":`h\xE1 ${o} dias`},Q=a=>a?new Date(a).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric"}):"\u2014",Y={ios:"iPhone","ios-other":"iPhone (Chrome)",android:"Android",samsung:"Android (Samsung)",desktop:"Computador"},Z={granted:"ligadas",denied:"bloqueadas",default:"n\xE3o ativadas",unsupported:"n\xE3o suportadas"};function X(a,t=44){let i=(a.name||a.email||"?").trim().charAt(0).toUpperCase();return`<span class="aface" style="--s:${t}px;background:${n(a.color||"#8E8E93")}">${a.photo?`<img src="${a.photo}" alt="">`:n(i)}</span>`}function aa(a){let t=N(),i=new Set(a.activeDays||[]);return Array.from({length:30},(o,l)=>x(t,l-29)).map(o=>`<i class="${i.has(o)?"on":""}" title="${o.split("-").reverse().join("/")}"></i>`).join("")}var b=()=>null,sa=a=>a?a.comp?"Cortesia":{trial:"Teste gr\xE1tis",monthly:"Mensal",lifetime:"Vital\xEDcio",expired:"Teste acabou",blocked:"Sem plano",none:"Sem plano"}[a.plan]||"Conta pr\xF3pria":"Conta pr\xF3pria";function ea(a,t){let i=a.counts||{},o=a.device||{},l=D(a),s=Math.max(a.lastPing||0,a.lastSeen||0);return`<div class="acct${t?" is-open":""}" data-uid="${n(a.uid)}">
    <button class="acct__top" data-toggle="${n(a.uid)}">
      ${X(a)}
      <div class="acct__id"><strong>${n(a.name||"Sem nome")}${l?' <span class="adot" title="Usando agora"></span>':""}</strong><small>${n(a.email||"")}</small></div>
      <div class="acct__last"><b class="${l?"is-live":""}">${l?"no app agora":n(`saiu ${H(s)}`)}</b><small>${a.workspace==="dupla"?"Dupla":a.workspace==="compartilhada"?"Convidado":sa(b(a.uid))}${b(a.uid)?.addon?.active?` + ${b(a.uid).addon.plan==="equipe"?"Equipe":"Dupla"}`:""}</small></div>
    </button>
    ${a.profile?.done?`<div class="acct__prof">${w("idcard",13)} <b>${n(a.profile.profession||"\u2014")}</b>${a.profile.age?` \xB7 ${n(a.profile.age)} anos`:""} \xB7 \xEDndice ${a.profile.index}/100</div>`:a.workspace!=="dupla"?`<div class="acct__prof is-off">${w("idcard",13)} Ficha n\xE3o preenchida</div>`:""}
    <div class="acct__chips">
      <span>${w("building",12)} ${i.companies||0} grupos</span>
      <span>${w("calendar",12)} ${i.myEvents||0} eventos</span>
      <span>${w("heart",12)} ${i.personal||0} pessoais</span>
      <span class="${o.notifications==="granted"&&o.registered?"ok":"warn"}">${w("bell",12)} ${o.notifications==="granted"&&o.registered?"avisos ok":"sem avisos"}</span>
    </div>
    ${t?`<div class="acct__more">
      <div class="agrid">
        <div><small>Conta criada</small><b>${n(Q(a.createdAt))}</b></div>
        <div><small>Agora</small><b>${l?"\u{1F7E2} Com o app aberto":"\u26AA App fechado"}</b></div>
        <div><small>\xDAltima vez que entrou</small><b>${n(V(a.lastOpen||a.lastSeen))}</b></div>
        <div><small>Saiu do app</small><b>${l?"\u2014":n(V(a.closedAt||s))}</b></div>
        <div><small>Vezes que abriu</small><b>${a.opens||0}</b></div>
        <div><small>Dias ativos (30 dias)</small><b>${(a.activeDays||[]).filter(r=>r>=x(N(),-29)).length}</b></div>
        <div><small>Aparelho</small><b>${n(Y[o.platform]||"\u2014")}</b></div>
        <div><small>Instalado na tela inicial</small><b>${o.installed?"Sim":"N\xE3o"}</b></div>
        <div><small>Notifica\xE7\xF5es</small><b>${n(Z[o.notifications]||"\u2014")}${o.registered?" \xB7 cadastrado":""}</b></div>
        <div><small>\xDAltimo modo usado</small><b>${a.space==="personal"?"Pessoal":"Trabalho"}</b></div>
      </div>
      ${a.profile?.done?`<h4>Ficha</h4>
      <div class="agrid">
        <div><small>Profiss\xE3o</small><b>${n(a.profile.profession||"\u2014")}</b></div>
        <div><small>\xC1rea</small><b>${n(a.profile.area||"\u2014")}</b></div>
        <div><small>Idade</small><b>${n(a.profile.age||"\u2014")}</b></div>
        <div><small>\xCDndice de esquecimento</small><b>${a.profile.index}/100 (marcou ${a.profile.forget}/5)</b></div>
        <div><small>Jornada</small><b>${n(U.find(r=>r.id===a.profile.journey)?.label||"\u2014")}</b></div>
        <div><small>Objetivo</small><b>${n(B.find(r=>r.id===a.profile.goal)?.label||"\u2014")}</b></div>
      </div>
      ${(a.profile.difficulties||[]).length?`<div class="adiffs">${a.profile.difficulties.map(r=>`<span>${n(M.find(c=>c.id===r)?.label||r)}</span>`).join("")}</div>`:""}`:""}
      <h4>Trabalho</h4>
      <div class="agrid">
        <div><small>Empresas / grupos</small><b>${i.companies||0}</b></div>
        <div><small>Eventos (total no espa\xE7o)</small><b>${i.events||0}</b></div>
        <div><small>Cadastrados pela pessoa</small><b>${i.myEvents||0}</b></div>
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
      <div class="adays">${aa(a)}</div>
      ${a.workspace==="proprio"?`<h4>Acesso</h4>
      ${b(a.uid)?.comp?`<button class="btn btn--soft btn--block" data-grant="${n(a.uid)}" data-on="0">Tirar o acesso cortesia</button>`:b(a.uid)?.plan==="lifetime"||b(a.uid)?.plan==="monthly"?'<p class="fhelp">Conta paga.</p>':`<button class="btn btn--primary btn--block" data-grant="${n(a.uid)}" data-on="1">Liberar acesso cortesia (revisor da loja, parceiro)</button>`}`:""}
    </div>`:""}
  </div>`}function ta(a){let t=a.map(s=>s.profile).filter(s=>s&&s.done);if(!t.length)return"";let i=(s,r=5)=>Object.entries(s.reduce((c,h)=>(h&&(c[h]=(c[h]||0)+1),c),{})).sort((c,h)=>h[1]-c[1]).slice(0,r),o=([s,r],c=s)=>`<li><span>${n(c)}</span><i style="--w:${Math.round(r/t.length*100)}%"></i><b>${r}</b></li>`,l=Math.round(t.reduce((s,r)=>s+(r.index||0),0)/t.length);return`<div class="ainsights">
    <div class="ainsights__head"><b>${t.length} ficha${t.length>1?"s":""} preenchida${t.length>1?"s":""}</b><small>\xEDndice m\xE9dio de esquecimento ${l}/100</small></div>
    <h4>Profiss\xF5es</h4><ul class="abars">${i(t.map(s=>s.profession)).map(s=>o(s)).join("")}</ul>
    <h4>\xC1reas</h4><ul class="abars">${i(t.map(s=>s.area)).map(s=>o(s)).join("")}</ul>
    <h4>Maiores dificuldades</h4><ul class="abars">${i(t.flatMap(s=>s.difficulties||[])).map(s=>o(s,M.find(r=>r.id===s[0])?.label||s[0])).join("")}</ul>
  </div>`}function ia(a){let t=a.filter(l=>l.workspace==="proprio");if(!t.length)return"";let i={};for(let l of t){let s=l.origin||{},r=s.source?`${s.source}${s.campaign?" \xB7 "+s.campaign:""}`:"direto / sem marca\xE7\xE3o",c=b(l.uid),h=i[r]=i[r]||{n:0,paid:0,trial:0};h.n++,c&&(c.plan==="monthly"||c.plan==="lifetime"&&!c.comp)&&h.paid++,c&&c.plan==="trial"&&h.trial++}return`<h3 class="ah">De onde vieram</h3>
  <div class="agroup">${Object.entries(i).sort((l,s)=>s[1].n-l[1].n).slice(0,12).map(([l,s])=>`<div class="arow"><span>${n(l)}<small>${s.trial} em teste \xB7 ${s.paid} pagaram${s.n?` \xB7 ${Math.round(s.paid/s.n*100)}%`:""}</small></span><b>${s.n}</b></div>`).join("")}</div>
  <p class="fhelp">Use links com marca\xE7\xE3o nos an\xFAncios, ex.: <b>\u2026/conheca/?utm_source=instagram&amp;utm_campaign=dentistas</b>, para saber qual an\xFAncio traz quem paga.</p>`}function oa(a){return a===null?"":`<section class="block">
    ${a.length?`<div class="aerrs">${a.slice(0,40).map(t=>`<div class="aerr">
        <div class="aerr__top"><b>${n(t.msg)}</b><span>${t.count}\xD7</span></div>
        <small>${n(t.where||"\u2014")} \xB7 ${n(t.dev||"")} \xB7 vers\xE3o ${n(t.ver||"?")} \xB7 ${(t.users||[]).length} pessoa${(t.users||[]).length===1?"":"s"} \xB7 \xFAltimo ${n(H(t.last))}</small>
      </div>`).join("")}</div>
      <button class="btn btn--soft btn--sm" data-clear-errors>Limpar a lista (depois de corrigir)</button>`:'<p class="fhelp">Nenhum erro registrado. \u{1F389} Quando algo der errado no celular de algu\xE9m, aparece aqui.</p>'}
  </section>`}var f=a=>Number.isFinite(Number(a))?Number(a):0,g=(a,t=120)=>typeof a=="string"?a.slice(0,t):"";function la(a){let t=a.counts||{},i=a.device||{},o=a.profile||{};return{uid:g(a.uid,64),name:g(a.name,60),email:g(a.email,120),workspace:g(a.workspace,20),space:g(a.space,20),photo:typeof a.photo=="string"&&/^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(a.photo)?a.photo:null,color:/^#[0-9a-fA-F]{6}$/.test(a.color||"")?a.color:"#8E8E93",createdAt:f(a.createdAt),lastSeen:f(a.lastSeen),opens:f(a.opens),online:!!a.online,lastPing:f(a.lastPing),lastOpen:f(a.lastOpen),closedAt:f(a.closedAt),activeDays:Array.isArray(a.activeDays)?a.activeDays.filter(l=>/^\d{4}-\d{2}-\d{2}$/.test(l)).slice(-40):[],counts:Object.fromEntries(["companies","events","myEvents","thisWeek","done30","late","posts30","notes","personal","lists","birthdays"].map(l=>[l,f(t[l])])),device:{platform:g(i.platform,20),installed:!!i.installed,notifications:g(i.notifications,20),registered:!!i.registered},origin:a.origin&&typeof a.origin=="object"?{source:g(a.origin.source,60),medium:g(a.origin.medium,60),campaign:g(a.origin.campaign,60)}:null,profile:o.done?{done:!0,profession:g(o.profession,80),area:g(o.area,80),age:g(o.age,10),index:f(o.index),forget:f(o.forget),difficulties:Array.isArray(o.difficulties)?o.difficulties.filter(l=>typeof l=="string").slice(0,12).map(l=>l.slice(0,30)):[],goal:g(o.goal,30),journey:g(o.journey,30)}:{done:!1}}}async function ga(){let a=null,t=null,i=null,o="",l={},s=null,r="resumo",c=()=>{let p=I("Painel do dono",{right:'<button class="btn-text" data-reload>Atualizar</button>'});if(t)return`${p}<div class="page page--sheet"><div class="empty"><h3>N\xE3o consegui carregar</h3><p>${n(t)}</p></div></div>`;if(!a)return`${p}<div class="page page--sheet"><p class="fhelp">Carregando\u2026</p></div>`;let q=Date.now(),j=e=>a.filter(m=>m.lastSeen&&q-m.lastSeen<e*864e5).length,u=a.filter(e=>e.createdAt&&q-e.createdAt<7*864e5).length;b=e=>l[e]||null;let d=Object.values(l),$=d.filter(e=>e.plan==="monthly").length,A=d.filter(e=>e.plan==="lifetime"&&!e.comp).length,W=d.filter(e=>e.plan==="trial").length,y=d.filter(e=>e.addon&&e.addon.active),G=$*9.9+y.reduce((e,m)=>e+(m.addon.plan==="equipe"?m.plan==="lifetime"?9.9:14.9:m.plan==="lifetime"?4.9:6.9),0),F=d.filter(e=>e.plan!=="none"&&e.plan!=="team").length,J=F?Math.round(($+A)/F*100):0,L=e=>`R$ ${e.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}`,v=(e,m,S="")=>`<div class="arow"><span>${e}${S?`<small>${S}</small>`:""}</span><b>${m}</b></div>`,R=a.filter(e=>e.device?.installed).length,_=a.filter(e=>e.device?.notifications==="granted"&&e.device?.registered).length,T=e=>a.length?` \xB7 ${Math.round(e/a.length*100)}%`:"",K=`<div class="aseg" role="tablist">${[["resumo","Resumo"],["pessoas",`Pessoas \xB7 ${a.length}`],["erros",`Erros${s&&s.length?` \xB7 ${s.length}`:""}`]].map(([e,m])=>`<button role="tab" class="${r===e?"is-on":""}" data-tab-admin="${e}">${m}</button>`).join("")}</div>`,k="";if(r==="resumo")k=`
      <div class="ahero">
        <small>Receita por m\xEAs</small>
        <b>${L(G)}</b>
        <span>${$} ${$===1?"assinante mensal":"assinantes mensais"} \xB7 ${y.length} agenda${y.length===1?"":"s"} compartilhada${y.length===1?"":"s"}</span>
      </div>
      <div class="atiles">
        <div><b>${j(1)}</b><small>ativas hoje</small></div>
        <div><b>${$+A}</b><small>pagantes</small></div>
        <div><b>${W}</b><small>em teste</small></div>
      </div>
      <h3 class="ah">Dinheiro</h3>
      <div class="agroup">
        ${v("Vital\xEDcios vendidos",`${A}`,`${L(A*150)} no total`)}
        ${v("Assinantes do Mensal",`${$}`)}
        ${v("Agendas compartilhadas",`${y.length}`,`${y.filter(e=>e.addon.plan==="equipe").length} Equipe \xB7 ${y.filter(e=>e.addon.plan==="dupla").length} Dupla`)}
        ${v("Convers\xE3o do teste",`${J}%`,"quem pagou \xF7 quem testou")}
      </div>
      <h3 class="ah">Pessoas</h3>
      <div class="agroup">
        ${v("Contas",`${a.length}`,`${u} nova${u===1?"":"s"} nos \xFAltimos 7 dias`)}
        ${v("No app agora",`${a.filter(D).length}`)}
        ${v("Ativas na semana",`${j(7)}`)}
        ${v("Convidados (agenda de outra pessoa)",`${a.filter(e=>e.workspace==="compartilhada").length}`)}
      </div>
      <h3 class="ah">Sa\xFAde do app</h3>
      <div class="agroup">
        ${v("Instalaram na tela inicial",`${R}${T(R)}`)}
        ${v("Recebem notifica\xE7\xF5es",`${_}${T(_)}`,_<a.length?"sem isso, os lembretes n\xE3o chegam":"")}
        ${v("Compromissos criados",`${a.reduce((e,m)=>e+(m.counts?.myEvents||0),0)}`)}
        <button class="arow arow--btn" data-tab-admin="erros"><span>Erros do app</span><b class="${s&&s.length?"bad":"good"}">${s===null?"\u2014":s.length?`${s.length} \u203A`:"nenhum \u2713"}</b></button>
      </div>
      ${ia(a)}
      ${ta(a)}`;else if(r==="pessoas"){let e=a.filter(m=>!o||`${m.name} ${m.email} ${m.profile?.profession||""}`.toLowerCase().includes(o)).sort((m,S)=>D(S)-D(m)||Math.max(S.lastPing||0,S.lastSeen||0)-Math.max(m.lastPing||0,m.lastSeen||0));k=`<input class="input" type="search" placeholder="Buscar por nome, e-mail ou profiss\xE3o" data-q value="${n(o)}">
      <div class="accts">${e.map(m=>ea(m,m.uid===i)).join("")||'<p class="fhelp">Nenhuma conta encontrada.</p>'}</div>
      <p class="fhelp">Toque numa conta para ver os detalhes. Aparecem aqui as contas que j\xE1 abriram o app atualizado.</p>`}else k=oa(s)||'<p class="fhelp">N\xE3o consegui ler os erros agora.</p>';return`${p}<div class="page page--sheet apanel">${K}${k}</div>`},h=z({className:"sheet--tall",html:c(),onMount:p=>{p.el.querySelectorAll("[data-toggle]").forEach(d=>d.onclick=()=>{i=i===d.dataset.toggle?null:d.dataset.toggle,p.set(c())}),p.el.querySelectorAll("[data-tab-admin]").forEach(d=>d.onclick=()=>{r=d.dataset.tabAdmin,p.set(c()),p.el.scrollTop=0}),p.el.querySelectorAll("[data-grant]").forEach(d=>d.onclick=async()=>{d.disabled=!0;try{let{api:$}=await import("./c-I4VD5FQZ.js"),A=await $("/admin/grant",{uid:d.dataset.grant,on:d.dataset.on==="1"});l[d.dataset.grant]=A.status,E(d.dataset.on==="1"?"Acesso cortesia liberado \u2713":"Acesso cortesia retirado"),p.set(c())}catch($){d.disabled=!1,E($.message||"N\xE3o consegui agora.")}});let q=p.el.querySelector("[data-reload]");q&&(q.onclick=()=>O());let j=p.el.querySelector("[data-clear-errors]");j&&(j.onclick=async()=>{try{let{api:d}=await import("./c-I4VD5FQZ.js");s=(await d("/admin/errors",{clear:!0})).errors||[],p.set(c())}catch{E("N\xE3o consegui limpar agora.")}});let u=p.el.querySelector("[data-q]");u&&(u.oninput=()=>{o=u.value.trim().toLowerCase();let d=u.selectionStart;p.set(c());let $=p.el.querySelector("[data-q]");$.focus(),$.setSelectionRange(d,d)})}}),O=async()=>{try{a=(await C.backendApi.listStats()).map(la),t=null;try{let{api:p}=await import("./c-I4VD5FQZ.js");l=(await p("/billing/all",{})).byWs||{}}catch{l={}}try{let{api:p}=await import("./c-I4VD5FQZ.js");s=(await p("/admin/errors",{})).errors||[]}catch{s=null}}catch(p){t=/permission/i.test(String(p.code||p.message))?"Falta atualizar as regras do Firebase (bloco \u201Cstats\u201D).":"Verifique a internet e toque em Atualizar."}h.set(c())};return O(),h}var $a=()=>!!C.user&&!!P.adminEmail&&(C.user.email||"").toLowerCase()===P.adminEmail.toLowerCase();export{$a as isOwner,ga as openAdmin};
