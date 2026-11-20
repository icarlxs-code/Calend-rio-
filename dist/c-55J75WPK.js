import{a as L,b as U,h as z}from"./c-4WJ4TYVF.js";import{m as T,o as I,p as D}from"./c-V7C77ZH7.js";import{f as j}from"./c-XSJKC2OU.js";import"./c-JKA3WHR5.js";import{a as u}from"./c-AUSHTMPE.js";import{B as o,d as N,e as F}from"./c-YEARXB46.js";import{a as _}from"./c-BYHTQNTY.js";import"./c-U53RW4YL.js";import"./c-VHNSBD2M.js";var B=a=>{if(!a)return"\u2014";let t=Math.round((Date.now()-a)/6e4);if(t<2)return"agora";if(t<60)return`h\xE1 ${t} min`;let i=Math.round(t/60);if(i<24)return`h\xE1 ${i}h`;let l=Math.round(i/24);return l===1?"ontem":`h\xE1 ${l} dias`},J=a=>a?new Date(a).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric"}):"\u2014",K={ios:"iPhone","ios-other":"iPhone (Chrome)",android:"Android",samsung:"Android (Samsung)",desktop:"Computador"},Q={granted:"ligadas",denied:"bloqueadas",default:"n\xE3o ativadas",unsupported:"n\xE3o suportadas"};function Y(a,t=44){let i=(a.name||a.email||"?").trim().charAt(0).toUpperCase();return`<span class="aface" style="--s:${t}px;background:${o(a.color||"#8E8E93")}">${a.photo?`<img src="${a.photo}" alt="">`:o(i)}</span>`}function Z(a){let t=N(),i=new Set(a.activeDays||[]);return Array.from({length:30},(l,c)=>F(t,c-29)).map(l=>`<i class="${i.has(l)?"on":""}" title="${l.split("-").reverse().join("/")}"></i>`).join("")}var y=()=>null,X=a=>a?a.comp?"Cortesia":{trial:"Teste gr\xE1tis",monthly:"Mensal",lifetime:"Vital\xEDcio",expired:"Teste acabou",blocked:"Sem plano",none:"Sem plano"}[a.plan]||"Conta pr\xF3pria":"Conta pr\xF3pria";function aa(a,t){let i=a.counts||{},l=a.device||{},c=a.lastSeen&&Date.now()-a.lastSeen<15*6e4;return`<div class="acct${t?" is-open":""}" data-uid="${o(a.uid)}">
    <button class="acct__top" data-toggle="${o(a.uid)}">
      ${Y(a)}
      <div class="acct__id"><strong>${o(a.name||"Sem nome")}${c?' <span class="adot" title="Usando agora"></span>':""}</strong><small>${o(a.email||"")}</small></div>
      <div class="acct__last"><b>${o(B(a.lastSeen))}</b><small>${a.workspace==="dupla"?"Dupla":a.workspace==="compartilhada"?"Convidado":X(y(a.uid))}${y(a.uid)?.addon?.active?` + ${y(a.uid).addon.plan==="equipe"?"Equipe":"Dupla"}`:""}</small></div>
    </button>
    ${a.profile?.done?`<div class="acct__prof">${u("idcard",13)} <b>${o(a.profile.profession||"\u2014")}</b>${a.profile.age?` \xB7 ${o(a.profile.age)} anos`:""} \xB7 \xEDndice ${a.profile.index}/100</div>`:a.workspace!=="dupla"?`<div class="acct__prof is-off">${u("idcard",13)} Ficha n\xE3o preenchida</div>`:""}
    <div class="acct__chips">
      <span>${u("building",12)} ${i.companies||0} grupos</span>
      <span>${u("calendar",12)} ${i.myEvents||0} eventos</span>
      <span>${u("heart",12)} ${i.personal||0} pessoais</span>
      <span class="${l.notifications==="granted"&&l.registered?"ok":"warn"}">${u("bell",12)} ${l.notifications==="granted"&&l.registered?"avisos ok":"sem avisos"}</span>
    </div>
    ${t?`<div class="acct__more">
      <div class="agrid">
        <div><small>Conta criada</small><b>${o(J(a.createdAt))}</b></div>
        <div><small>\xDAltimo acesso</small><b>${o(a.lastSeen?new Date(a.lastSeen).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):"\u2014")}</b></div>
        <div><small>Vezes que abriu</small><b>${a.opens||0}</b></div>
        <div><small>Dias ativos (30 dias)</small><b>${(a.activeDays||[]).filter(s=>s>=F(N(),-29)).length}</b></div>
        <div><small>Aparelho</small><b>${o(K[l.platform]||"\u2014")}</b></div>
        <div><small>Instalado na tela inicial</small><b>${l.installed?"Sim":"N\xE3o"}</b></div>
        <div><small>Notifica\xE7\xF5es</small><b>${o(Q[l.notifications]||"\u2014")}${l.registered?" \xB7 cadastrado":""}</b></div>
        <div><small>\xDAltimo modo usado</small><b>${a.space==="personal"?"Pessoal":"Trabalho"}</b></div>
      </div>
      ${a.profile?.done?`<h4>Ficha</h4>
      <div class="agrid">
        <div><small>Profiss\xE3o</small><b>${o(a.profile.profession||"\u2014")}</b></div>
        <div><small>\xC1rea</small><b>${o(a.profile.area||"\u2014")}</b></div>
        <div><small>Idade</small><b>${o(a.profile.age||"\u2014")}</b></div>
        <div><small>\xCDndice de esquecimento</small><b>${a.profile.index}/100 (marcou ${a.profile.forget}/5)</b></div>
        <div><small>Jornada</small><b>${o(U.find(s=>s.id===a.profile.journey)?.label||"\u2014")}</b></div>
        <div><small>Objetivo</small><b>${o(z.find(s=>s.id===a.profile.goal)?.label||"\u2014")}</b></div>
      </div>
      ${(a.profile.difficulties||[]).length?`<div class="adiffs">${a.profile.difficulties.map(s=>`<span>${o(L.find(p=>p.id===s)?.label||s)}</span>`).join("")}</div>`:""}`:""}
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
      ${y(a.uid)?.comp?`<button class="btn btn--soft btn--block" data-grant="${o(a.uid)}" data-on="0">Tirar o acesso cortesia</button>`:y(a.uid)?.plan==="lifetime"||y(a.uid)?.plan==="monthly"?'<p class="fhelp">Conta paga.</p>':`<button class="btn btn--primary btn--block" data-grant="${o(a.uid)}" data-on="1">Liberar acesso cortesia (revisor da loja, parceiro)</button>`}`:""}
    </div>`:""}
  </div>`}function ea(a){let t=a.map(s=>s.profile).filter(s=>s&&s.done);if(!t.length)return"";let i=(s,p=5)=>Object.entries(s.reduce((m,g)=>(g&&(m[g]=(m[g]||0)+1),m),{})).sort((m,g)=>g[1]-m[1]).slice(0,p),l=([s,p],m=s)=>`<li><span>${o(m)}</span><i style="--w:${Math.round(p/t.length*100)}%"></i><b>${p}</b></li>`,c=Math.round(t.reduce((s,p)=>s+(p.index||0),0)/t.length);return`<div class="ainsights">
    <div class="ainsights__head"><b>${t.length} ficha${t.length>1?"s":""} preenchida${t.length>1?"s":""}</b><small>\xEDndice m\xE9dio de esquecimento ${c}/100</small></div>
    <h4>Profiss\xF5es</h4><ul class="abars">${i(t.map(s=>s.profession)).map(s=>l(s)).join("")}</ul>
    <h4>\xC1reas</h4><ul class="abars">${i(t.map(s=>s.area)).map(s=>l(s)).join("")}</ul>
    <h4>Maiores dificuldades</h4><ul class="abars">${i(t.flatMap(s=>s.difficulties||[])).map(s=>l(s,L.find(p=>p.id===s[0])?.label||s[0])).join("")}</ul>
  </div>`}function sa(a){return a===null?"":`<section class="block">
    ${a.length?`<div class="aerrs">${a.slice(0,40).map(t=>`<div class="aerr">
        <div class="aerr__top"><b>${o(t.msg)}</b><span>${t.count}\xD7</span></div>
        <small>${o(t.where||"\u2014")} \xB7 ${o(t.dev||"")} \xB7 vers\xE3o ${o(t.ver||"?")} \xB7 ${(t.users||[]).length} pessoa${(t.users||[]).length===1?"":"s"} \xB7 \xFAltimo ${o(B(t.last))}</small>
      </div>`).join("")}</div>
      <button class="btn btn--soft btn--sm" data-clear-errors>Limpar a lista (depois de corrigir)</button>`:'<p class="fhelp">Nenhum erro registrado. \u{1F389} Quando algo der errado no celular de algu\xE9m, aparece aqui.</p>'}
  </section>`}var A=a=>Number.isFinite(Number(a))?Number(a):0,v=(a,t=120)=>typeof a=="string"?a.slice(0,t):"";function ta(a){let t=a.counts||{},i=a.device||{},l=a.profile||{};return{uid:v(a.uid,64),name:v(a.name,60),email:v(a.email,120),workspace:v(a.workspace,20),space:v(a.space,20),photo:typeof a.photo=="string"&&/^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(a.photo)?a.photo:null,color:/^#[0-9a-fA-F]{6}$/.test(a.color||"")?a.color:"#8E8E93",createdAt:A(a.createdAt),lastSeen:A(a.lastSeen),opens:A(a.opens),activeDays:Array.isArray(a.activeDays)?a.activeDays.filter(c=>/^\d{4}-\d{2}-\d{2}$/.test(c)).slice(-40):[],counts:Object.fromEntries(["companies","events","myEvents","thisWeek","done30","late","posts30","notes","personal","lists","birthdays"].map(c=>[c,A(t[c])])),device:{platform:v(i.platform,20),installed:!!i.installed,notifications:v(i.notifications,20),registered:!!i.registered},profile:l.done?{done:!0,profession:v(l.profession,80),area:v(l.area,80),age:v(l.age,10),index:A(l.index),forget:A(l.forget),difficulties:Array.isArray(l.difficulties)?l.difficulties.filter(c=>typeof c=="string").slice(0,12).map(c=>c.slice(0,30)):[],goal:v(l.goal,30),journey:v(l.journey,30)}:{done:!1}}}async function ca(){let a=null,t=null,i=null,l="",c={},s=null,p="resumo",m=()=>{let r=I("Painel do dono",{right:'<button class="btn-text" data-reload>Atualizar</button>'});if(t)return`${r}<div class="page page--sheet"><div class="empty"><h3>N\xE3o consegui carregar</h3><p>${o(t)}</p></div></div>`;if(!a)return`${r}<div class="page page--sheet"><p class="fhelp">Carregando\u2026</p></div>`;let S=Date.now(),q=e=>a.filter(d=>d.lastSeen&&S-d.lastSeen<e*864e5).length,f=a.filter(e=>e.createdAt&&S-e.createdAt<7*864e5).length;y=e=>c[e]||null;let n=Object.values(c),$=n.filter(e=>e.plan==="monthly").length,w=n.filter(e=>e.plan==="lifetime"&&!e.comp).length,V=n.filter(e=>e.plan==="trial").length,b=n.filter(e=>e.addon&&e.addon.active),W=$*9.9+b.reduce((e,d)=>e+(d.addon.plan==="equipe"?d.plan==="lifetime"?9.9:14.9:d.plan==="lifetime"?4.9:6.9),0),M=n.filter(e=>e.plan!=="none"&&e.plan!=="team").length,H=M?Math.round(($+w)/M*100):0,P=e=>`R$ ${e.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}`,h=(e,d,C="")=>`<div class="arow"><span>${e}${C?`<small>${C}</small>`:""}</span><b>${d}</b></div>`,O=a.filter(e=>e.device?.installed).length,k=a.filter(e=>e.device?.notifications==="granted"&&e.device?.registered).length,R=e=>a.length?` \xB7 ${Math.round(e/a.length*100)}%`:"",G=`<div class="aseg" role="tablist">${[["resumo","Resumo"],["pessoas",`Pessoas \xB7 ${a.length}`],["erros",`Erros${s&&s.length?` \xB7 ${s.length}`:""}`]].map(([e,d])=>`<button role="tab" class="${p===e?"is-on":""}" data-tab-admin="${e}">${d}</button>`).join("")}</div>`,E="";if(p==="resumo")E=`
      <div class="ahero">
        <small>Receita por m\xEAs</small>
        <b>${P(W)}</b>
        <span>${$} ${$===1?"assinante mensal":"assinantes mensais"} \xB7 ${b.length} agenda${b.length===1?"":"s"} compartilhada${b.length===1?"":"s"}</span>
      </div>
      <div class="atiles">
        <div><b>${q(1)}</b><small>ativas hoje</small></div>
        <div><b>${$+w}</b><small>pagantes</small></div>
        <div><b>${V}</b><small>em teste</small></div>
      </div>
      <h3 class="ah">Dinheiro</h3>
      <div class="agroup">
        ${h("Vital\xEDcios vendidos",`${w}`,`${P(w*150)} no total`)}
        ${h("Assinantes do Mensal",`${$}`)}
        ${h("Agendas compartilhadas",`${b.length}`,`${b.filter(e=>e.addon.plan==="equipe").length} Equipe \xB7 ${b.filter(e=>e.addon.plan==="dupla").length} Dupla`)}
        ${h("Convers\xE3o do teste",`${H}%`,"quem pagou \xF7 quem testou")}
      </div>
      <h3 class="ah">Pessoas</h3>
      <div class="agroup">
        ${h("Contas",`${a.length}`,`${f} nova${f===1?"":"s"} nos \xFAltimos 7 dias`)}
        ${h("Usando agora",`${a.filter(e=>e.lastSeen&&S-e.lastSeen<15*6e4).length}`)}
        ${h("Ativas na semana",`${q(7)}`)}
        ${h("Convidados (agenda de outra pessoa)",`${a.filter(e=>e.workspace==="compartilhada").length}`)}
      </div>
      <h3 class="ah">Sa\xFAde do app</h3>
      <div class="agroup">
        ${h("Instalaram na tela inicial",`${O}${R(O)}`)}
        ${h("Recebem notifica\xE7\xF5es",`${k}${R(k)}`,k<a.length?"sem isso, os lembretes n\xE3o chegam":"")}
        ${h("Compromissos criados",`${a.reduce((e,d)=>e+(d.counts?.myEvents||0),0)}`)}
        <button class="arow arow--btn" data-tab-admin="erros"><span>Erros do app</span><b class="${s&&s.length?"bad":"good"}">${s===null?"\u2014":s.length?`${s.length} \u203A`:"nenhum \u2713"}</b></button>
      </div>
      ${ea(a)}`;else if(p==="pessoas"){let e=a.filter(d=>!l||`${d.name} ${d.email} ${d.profile?.profession||""}`.toLowerCase().includes(l)).sort((d,C)=>(C.lastSeen||0)-(d.lastSeen||0));E=`<input class="input" type="search" placeholder="Buscar por nome, e-mail ou profiss\xE3o" data-q value="${o(l)}">
      <div class="accts">${e.map(d=>aa(d,d.uid===i)).join("")||'<p class="fhelp">Nenhuma conta encontrada.</p>'}</div>
      <p class="fhelp">Toque numa conta para ver os detalhes. Aparecem aqui as contas que j\xE1 abriram o app atualizado.</p>`}else E=sa(s)||'<p class="fhelp">N\xE3o consegui ler os erros agora.</p>';return`${r}<div class="page page--sheet apanel">${G}${E}</div>`},g=T({className:"sheet--tall",html:m(),onMount:r=>{r.el.querySelectorAll("[data-toggle]").forEach(n=>n.onclick=()=>{i=i===n.dataset.toggle?null:n.dataset.toggle,r.set(m())}),r.el.querySelectorAll("[data-tab-admin]").forEach(n=>n.onclick=()=>{p=n.dataset.tabAdmin,r.set(m()),r.el.scrollTop=0}),r.el.querySelectorAll("[data-grant]").forEach(n=>n.onclick=async()=>{n.disabled=!0;try{let{api:$}=await import("./c-ILBIMTU3.js"),w=await $("/admin/grant",{uid:n.dataset.grant,on:n.dataset.on==="1"});c[n.dataset.grant]=w.status,D(n.dataset.on==="1"?"Acesso cortesia liberado \u2713":"Acesso cortesia retirado"),r.set(m())}catch($){n.disabled=!1,D($.message||"N\xE3o consegui agora.")}});let S=r.el.querySelector("[data-reload]");S&&(S.onclick=()=>x());let q=r.el.querySelector("[data-clear-errors]");q&&(q.onclick=async()=>{try{let{api:n}=await import("./c-ILBIMTU3.js");s=(await n("/admin/errors",{clear:!0})).errors||[],r.set(m())}catch{D("N\xE3o consegui limpar agora.")}});let f=r.el.querySelector("[data-q]");f&&(f.oninput=()=>{l=f.value.trim().toLowerCase();let n=f.selectionStart;r.set(m());let $=r.el.querySelector("[data-q]");$.focus(),$.setSelectionRange(n,n)})}}),x=async()=>{try{a=(await j.backendApi.listStats()).map(ta),t=null;try{let{api:r}=await import("./c-ILBIMTU3.js");c=(await r("/billing/all",{})).byWs||{}}catch{c={}}try{let{api:r}=await import("./c-ILBIMTU3.js");s=(await r("/admin/errors",{})).errors||[]}catch{s=null}}catch(r){t=/permission/i.test(String(r.code||r.message))?"Falta atualizar as regras do Firebase (bloco \u201Cstats\u201D).":"Verifique a internet e toque em Atualizar."}g.set(m())};return x(),g}var pa=()=>!!j.user&&!!_.adminEmail&&(j.user.email||"").toLowerCase()===_.adminEmail.toLowerCase();export{pa as isOwner,ca as openAdmin};
