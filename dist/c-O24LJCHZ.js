import{a as F,b as U,h as z}from"./c-4WJ4TYVF.js";import{m as T,o as I,p as E}from"./c-E5A4TQYE.js";import{f as D}from"./c-EIA4XOOJ.js";import"./c-JKA3WHR5.js";import{a as y}from"./c-CIJP7VMQ.js";import{B as l,d as N,e as x}from"./c-YEARXB46.js";import{a as _}from"./c-MYDFTVQQ.js";import"./c-U53RW4YL.js";import"./c-VHNSBD2M.js";var B=a=>{if(!a)return"\u2014";let t=Math.round((Date.now()-a)/6e4);if(t<2)return"agora";if(t<60)return`h\xE1 ${t} min`;let i=Math.round(t/60);if(i<24)return`h\xE1 ${i}h`;let o=Math.round(i/24);return o===1?"ontem":`h\xE1 ${o} dias`},J=a=>a?new Date(a).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric"}):"\u2014",K={ios:"iPhone","ios-other":"iPhone (Chrome)",android:"Android",samsung:"Android (Samsung)",desktop:"Computador"},Q={granted:"ligadas",denied:"bloqueadas",default:"n\xE3o ativadas",unsupported:"n\xE3o suportadas"};function Y(a,t=44){let i=(a.name||a.email||"?").trim().charAt(0).toUpperCase();return`<span class="aface" style="--s:${t}px;background:${l(a.color||"#8E8E93")}">${a.photo?`<img src="${a.photo}" alt="">`:l(i)}</span>`}function Z(a){let t=N(),i=new Set(a.activeDays||[]);return Array.from({length:30},(o,n)=>x(t,n-29)).map(o=>`<i class="${i.has(o)?"on":""}" title="${o.split("-").reverse().join("/")}"></i>`).join("")}var f=()=>null,X=a=>a?a.comp?"Cortesia":{trial:"Teste gr\xE1tis",monthly:"Mensal",lifetime:"Vital\xEDcio",expired:"Teste acabou",blocked:"Sem plano",none:"Sem plano"}[a.plan]||"Conta pr\xF3pria":"Conta pr\xF3pria";function aa(a,t){let i=a.counts||{},o=a.device||{},n=a.lastSeen&&Date.now()-a.lastSeen<15*6e4;return`<div class="acct${t?" is-open":""}" data-uid="${l(a.uid)}">
    <button class="acct__top" data-toggle="${l(a.uid)}">
      ${Y(a)}
      <div class="acct__id"><strong>${l(a.name||"Sem nome")}${n?' <span class="adot" title="Usando agora"></span>':""}</strong><small>${l(a.email||"")}</small></div>
      <div class="acct__last"><b>${l(B(a.lastSeen))}</b><small>${a.workspace==="dupla"?"Dupla":a.workspace==="compartilhada"?"Convidado":X(f(a.uid))}${f(a.uid)?.addon?.active?` + ${f(a.uid).addon.plan==="equipe"?"Equipe":"Dupla"}`:""}</small></div>
    </button>
    ${a.profile?.done?`<div class="acct__prof">${y("idcard",13)} <b>${l(a.profile.profession||"\u2014")}</b>${a.profile.age?` \xB7 ${l(a.profile.age)} anos`:""} \xB7 \xEDndice ${a.profile.index}/100</div>`:a.workspace!=="dupla"?`<div class="acct__prof is-off">${y("idcard",13)} Ficha n\xE3o preenchida</div>`:""}
    <div class="acct__chips">
      <span>${y("building",12)} ${i.companies||0} grupos</span>
      <span>${y("calendar",12)} ${i.myEvents||0} eventos</span>
      <span>${y("heart",12)} ${i.personal||0} pessoais</span>
      <span class="${o.notifications==="granted"&&o.registered?"ok":"warn"}">${y("bell",12)} ${o.notifications==="granted"&&o.registered?"avisos ok":"sem avisos"}</span>
    </div>
    ${t?`<div class="acct__more">
      <div class="agrid">
        <div><small>Conta criada</small><b>${l(J(a.createdAt))}</b></div>
        <div><small>\xDAltimo acesso</small><b>${l(a.lastSeen?new Date(a.lastSeen).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):"\u2014")}</b></div>
        <div><small>Vezes que abriu</small><b>${a.opens||0}</b></div>
        <div><small>Dias ativos (30 dias)</small><b>${(a.activeDays||[]).filter(e=>e>=x(N(),-29)).length}</b></div>
        <div><small>Aparelho</small><b>${l(K[o.platform]||"\u2014")}</b></div>
        <div><small>Instalado na tela inicial</small><b>${o.installed?"Sim":"N\xE3o"}</b></div>
        <div><small>Notifica\xE7\xF5es</small><b>${l(Q[o.notifications]||"\u2014")}${o.registered?" \xB7 cadastrado":""}</b></div>
        <div><small>\xDAltimo modo usado</small><b>${a.space==="personal"?"Pessoal":"Trabalho"}</b></div>
      </div>
      ${a.profile?.done?`<h4>Ficha</h4>
      <div class="agrid">
        <div><small>Profiss\xE3o</small><b>${l(a.profile.profession||"\u2014")}</b></div>
        <div><small>\xC1rea</small><b>${l(a.profile.area||"\u2014")}</b></div>
        <div><small>Idade</small><b>${l(a.profile.age||"\u2014")}</b></div>
        <div><small>\xCDndice de esquecimento</small><b>${a.profile.index}/100 (marcou ${a.profile.forget}/5)</b></div>
        <div><small>Jornada</small><b>${l(U.find(e=>e.id===a.profile.journey)?.label||"\u2014")}</b></div>
        <div><small>Objetivo</small><b>${l(z.find(e=>e.id===a.profile.goal)?.label||"\u2014")}</b></div>
      </div>
      ${(a.profile.difficulties||[]).length?`<div class="adiffs">${a.profile.difficulties.map(e=>`<span>${l(F.find(m=>m.id===e)?.label||e)}</span>`).join("")}</div>`:""}`:""}
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
      <div class="adays">${Z(a)}</div>
      ${a.workspace==="proprio"?`<h4>Acesso</h4>
      ${f(a.uid)?.comp?`<button class="btn btn--soft btn--block" data-grant="${l(a.uid)}" data-on="0">Tirar o acesso cortesia</button>`:f(a.uid)?.plan==="lifetime"||f(a.uid)?.plan==="monthly"?'<p class="fhelp">Conta paga.</p>':`<button class="btn btn--primary btn--block" data-grant="${l(a.uid)}" data-on="1">Liberar acesso cortesia (revisor da loja, parceiro)</button>`}`:""}
    </div>`:""}
  </div>`}function ea(a){let t=a.map(e=>e.profile).filter(e=>e&&e.done);if(!t.length)return"";let i=(e,m=5)=>Object.entries(e.reduce((c,h)=>(h&&(c[h]=(c[h]||0)+1),c),{})).sort((c,h)=>h[1]-c[1]).slice(0,m),o=([e,m],c=e)=>`<li><span>${l(c)}</span><i style="--w:${Math.round(m/t.length*100)}%"></i><b>${m}</b></li>`,n=Math.round(t.reduce((e,m)=>e+(m.index||0),0)/t.length);return`<div class="ainsights">
    <div class="ainsights__head"><b>${t.length} ficha${t.length>1?"s":""} preenchida${t.length>1?"s":""}</b><small>\xEDndice m\xE9dio de esquecimento ${n}/100</small></div>
    <h4>Profiss\xF5es</h4><ul class="abars">${i(t.map(e=>e.profession)).map(e=>o(e)).join("")}</ul>
    <h4>\xC1reas</h4><ul class="abars">${i(t.map(e=>e.area)).map(e=>o(e)).join("")}</ul>
    <h4>Maiores dificuldades</h4><ul class="abars">${i(t.flatMap(e=>e.difficulties||[])).map(e=>o(e,F.find(m=>m.id===e[0])?.label||e[0])).join("")}</ul>
  </div>`}function sa(a){let t=a.filter(n=>n.workspace==="proprio");if(!t.length)return"";let i={};for(let n of t){let e=n.origin||{},m=e.source?`${e.source}${e.campaign?" \xB7 "+e.campaign:""}`:"direto / sem marca\xE7\xE3o",c=f(n.uid),h=i[m]=i[m]||{n:0,paid:0,trial:0};h.n++,c&&(c.plan==="monthly"||c.plan==="lifetime"&&!c.comp)&&h.paid++,c&&c.plan==="trial"&&h.trial++}return`<h3 class="ah">De onde vieram</h3>
  <div class="agroup">${Object.entries(i).sort((n,e)=>e[1].n-n[1].n).slice(0,12).map(([n,e])=>`<div class="arow"><span>${l(n)}<small>${e.trial} em teste \xB7 ${e.paid} pagaram${e.n?` \xB7 ${Math.round(e.paid/e.n*100)}%`:""}</small></span><b>${e.n}</b></div>`).join("")}</div>
  <p class="fhelp">Use links com marca\xE7\xE3o nos an\xFAncios, ex.: <b>\u2026/conheca/?utm_source=instagram&amp;utm_campaign=dentistas</b>, para saber qual an\xFAncio traz quem paga.</p>`}function ta(a){return a===null?"":`<section class="block">
    ${a.length?`<div class="aerrs">${a.slice(0,40).map(t=>`<div class="aerr">
        <div class="aerr__top"><b>${l(t.msg)}</b><span>${t.count}\xD7</span></div>
        <small>${l(t.where||"\u2014")} \xB7 ${l(t.dev||"")} \xB7 vers\xE3o ${l(t.ver||"?")} \xB7 ${(t.users||[]).length} pessoa${(t.users||[]).length===1?"":"s"} \xB7 \xFAltimo ${l(B(t.last))}</small>
      </div>`).join("")}</div>
      <button class="btn btn--soft btn--sm" data-clear-errors>Limpar a lista (depois de corrigir)</button>`:'<p class="fhelp">Nenhum erro registrado. \u{1F389} Quando algo der errado no celular de algu\xE9m, aparece aqui.</p>'}
  </section>`}var A=a=>Number.isFinite(Number(a))?Number(a):0,$=(a,t=120)=>typeof a=="string"?a.slice(0,t):"";function ia(a){let t=a.counts||{},i=a.device||{},o=a.profile||{};return{uid:$(a.uid,64),name:$(a.name,60),email:$(a.email,120),workspace:$(a.workspace,20),space:$(a.space,20),photo:typeof a.photo=="string"&&/^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(a.photo)?a.photo:null,color:/^#[0-9a-fA-F]{6}$/.test(a.color||"")?a.color:"#8E8E93",createdAt:A(a.createdAt),lastSeen:A(a.lastSeen),opens:A(a.opens),activeDays:Array.isArray(a.activeDays)?a.activeDays.filter(n=>/^\d{4}-\d{2}-\d{2}$/.test(n)).slice(-40):[],counts:Object.fromEntries(["companies","events","myEvents","thisWeek","done30","late","posts30","notes","personal","lists","birthdays"].map(n=>[n,A(t[n])])),device:{platform:$(i.platform,20),installed:!!i.installed,notifications:$(i.notifications,20),registered:!!i.registered},origin:a.origin&&typeof a.origin=="object"?{source:$(a.origin.source,60),medium:$(a.origin.medium,60),campaign:$(a.origin.campaign,60)}:null,profile:o.done?{done:!0,profession:$(o.profession,80),area:$(o.area,80),age:$(o.age,10),index:A(o.index),forget:A(o.forget),difficulties:Array.isArray(o.difficulties)?o.difficulties.filter(n=>typeof n=="string").slice(0,12).map(n=>n.slice(0,30)):[],goal:$(o.goal,30),journey:$(o.journey,30)}:{done:!1}}}async function pa(){let a=null,t=null,i=null,o="",n={},e=null,m="resumo",c=()=>{let d=I("Painel do dono",{right:'<button class="btn-text" data-reload>Atualizar</button>'});if(t)return`${d}<div class="page page--sheet"><div class="empty"><h3>N\xE3o consegui carregar</h3><p>${l(t)}</p></div></div>`;if(!a)return`${d}<div class="page page--sheet"><p class="fhelp">Carregando\u2026</p></div>`;let w=Date.now(),q=s=>a.filter(p=>p.lastSeen&&w-p.lastSeen<s*864e5).length,b=a.filter(s=>s.createdAt&&w-s.createdAt<7*864e5).length;f=s=>n[s]||null;let r=Object.values(n),g=r.filter(s=>s.plan==="monthly").length,S=r.filter(s=>s.plan==="lifetime"&&!s.comp).length,V=r.filter(s=>s.plan==="trial").length,u=r.filter(s=>s.addon&&s.addon.active),H=g*9.9+u.reduce((s,p)=>s+(p.addon.plan==="equipe"?p.plan==="lifetime"?9.9:14.9:p.plan==="lifetime"?4.9:6.9),0),M=r.filter(s=>s.plan!=="none"&&s.plan!=="team").length,W=M?Math.round((g+S)/M*100):0,P=s=>`R$ ${s.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}`,v=(s,p,k="")=>`<div class="arow"><span>${s}${k?`<small>${k}</small>`:""}</span><b>${p}</b></div>`,O=a.filter(s=>s.device?.installed).length,C=a.filter(s=>s.device?.notifications==="granted"&&s.device?.registered).length,R=s=>a.length?` \xB7 ${Math.round(s/a.length*100)}%`:"",G=`<div class="aseg" role="tablist">${[["resumo","Resumo"],["pessoas",`Pessoas \xB7 ${a.length}`],["erros",`Erros${e&&e.length?` \xB7 ${e.length}`:""}`]].map(([s,p])=>`<button role="tab" class="${m===s?"is-on":""}" data-tab-admin="${s}">${p}</button>`).join("")}</div>`,j="";if(m==="resumo")j=`
      <div class="ahero">
        <small>Receita por m\xEAs</small>
        <b>${P(H)}</b>
        <span>${g} ${g===1?"assinante mensal":"assinantes mensais"} \xB7 ${u.length} agenda${u.length===1?"":"s"} compartilhada${u.length===1?"":"s"}</span>
      </div>
      <div class="atiles">
        <div><b>${q(1)}</b><small>ativas hoje</small></div>
        <div><b>${g+S}</b><small>pagantes</small></div>
        <div><b>${V}</b><small>em teste</small></div>
      </div>
      <h3 class="ah">Dinheiro</h3>
      <div class="agroup">
        ${v("Vital\xEDcios vendidos",`${S}`,`${P(S*150)} no total`)}
        ${v("Assinantes do Mensal",`${g}`)}
        ${v("Agendas compartilhadas",`${u.length}`,`${u.filter(s=>s.addon.plan==="equipe").length} Equipe \xB7 ${u.filter(s=>s.addon.plan==="dupla").length} Dupla`)}
        ${v("Convers\xE3o do teste",`${W}%`,"quem pagou \xF7 quem testou")}
      </div>
      <h3 class="ah">Pessoas</h3>
      <div class="agroup">
        ${v("Contas",`${a.length}`,`${b} nova${b===1?"":"s"} nos \xFAltimos 7 dias`)}
        ${v("Usando agora",`${a.filter(s=>s.lastSeen&&w-s.lastSeen<15*6e4).length}`)}
        ${v("Ativas na semana",`${q(7)}`)}
        ${v("Convidados (agenda de outra pessoa)",`${a.filter(s=>s.workspace==="compartilhada").length}`)}
      </div>
      <h3 class="ah">Sa\xFAde do app</h3>
      <div class="agroup">
        ${v("Instalaram na tela inicial",`${O}${R(O)}`)}
        ${v("Recebem notifica\xE7\xF5es",`${C}${R(C)}`,C<a.length?"sem isso, os lembretes n\xE3o chegam":"")}
        ${v("Compromissos criados",`${a.reduce((s,p)=>s+(p.counts?.myEvents||0),0)}`)}
        <button class="arow arow--btn" data-tab-admin="erros"><span>Erros do app</span><b class="${e&&e.length?"bad":"good"}">${e===null?"\u2014":e.length?`${e.length} \u203A`:"nenhum \u2713"}</b></button>
      </div>
      ${sa(a)}
      ${ea(a)}`;else if(m==="pessoas"){let s=a.filter(p=>!o||`${p.name} ${p.email} ${p.profile?.profession||""}`.toLowerCase().includes(o)).sort((p,k)=>(k.lastSeen||0)-(p.lastSeen||0));j=`<input class="input" type="search" placeholder="Buscar por nome, e-mail ou profiss\xE3o" data-q value="${l(o)}">
      <div class="accts">${s.map(p=>aa(p,p.uid===i)).join("")||'<p class="fhelp">Nenhuma conta encontrada.</p>'}</div>
      <p class="fhelp">Toque numa conta para ver os detalhes. Aparecem aqui as contas que j\xE1 abriram o app atualizado.</p>`}else j=ta(e)||'<p class="fhelp">N\xE3o consegui ler os erros agora.</p>';return`${d}<div class="page page--sheet apanel">${G}${j}</div>`},h=T({className:"sheet--tall",html:c(),onMount:d=>{d.el.querySelectorAll("[data-toggle]").forEach(r=>r.onclick=()=>{i=i===r.dataset.toggle?null:r.dataset.toggle,d.set(c())}),d.el.querySelectorAll("[data-tab-admin]").forEach(r=>r.onclick=()=>{m=r.dataset.tabAdmin,d.set(c()),d.el.scrollTop=0}),d.el.querySelectorAll("[data-grant]").forEach(r=>r.onclick=async()=>{r.disabled=!0;try{let{api:g}=await import("./c-HY3LI2KY.js"),S=await g("/admin/grant",{uid:r.dataset.grant,on:r.dataset.on==="1"});n[r.dataset.grant]=S.status,E(r.dataset.on==="1"?"Acesso cortesia liberado \u2713":"Acesso cortesia retirado"),d.set(c())}catch(g){r.disabled=!1,E(g.message||"N\xE3o consegui agora.")}});let w=d.el.querySelector("[data-reload]");w&&(w.onclick=()=>L());let q=d.el.querySelector("[data-clear-errors]");q&&(q.onclick=async()=>{try{let{api:r}=await import("./c-HY3LI2KY.js");e=(await r("/admin/errors",{clear:!0})).errors||[],d.set(c())}catch{E("N\xE3o consegui limpar agora.")}});let b=d.el.querySelector("[data-q]");b&&(b.oninput=()=>{o=b.value.trim().toLowerCase();let r=b.selectionStart;d.set(c());let g=d.el.querySelector("[data-q]");g.focus(),g.setSelectionRange(r,r)})}}),L=async()=>{try{a=(await D.backendApi.listStats()).map(ia),t=null;try{let{api:d}=await import("./c-HY3LI2KY.js");n=(await d("/billing/all",{})).byWs||{}}catch{n={}}try{let{api:d}=await import("./c-HY3LI2KY.js");e=(await d("/admin/errors",{})).errors||[]}catch{e=null}}catch(d){t=/permission/i.test(String(d.code||d.message))?"Falta atualizar as regras do Firebase (bloco \u201Cstats\u201D).":"Verifique a internet e toque em Atualizar."}h.set(c())};return L(),h}var ma=()=>!!D.user&&!!_.adminEmail&&(D.user.email||"").toLowerCase()===_.adminEmail.toLowerCase();export{ma as isOwner,pa as openAdmin};
