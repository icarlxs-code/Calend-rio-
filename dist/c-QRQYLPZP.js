import{a as F,b as U,h as z}from"./c-F4CQFADB.js";import{m as R,o as I,p as T}from"./c-B5GJXJUS.js";import{f as D}from"./c-A32SP4L4.js";import"./c-JKA3WHR5.js";import{a as u}from"./c-AUSHTMPE.js";import{B as o,d as k,e as N}from"./c-YEARXB46.js";import{a as _}from"./c-BYHTQNTY.js";import"./c-U53RW4YL.js";import"./c-VHNSBD2M.js";var B=a=>{if(!a)return"\u2014";let t=Math.round((Date.now()-a)/6e4);if(t<2)return"agora";if(t<60)return`h\xE1 ${t} min`;let i=Math.round(t/60);if(i<24)return`h\xE1 ${i}h`;let l=Math.round(i/24);return l===1?"ontem":`h\xE1 ${l} dias`},J=a=>a?new Date(a).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric"}):"\u2014",K={ios:"iPhone","ios-other":"iPhone (Chrome)",android:"Android",samsung:"Android (Samsung)",desktop:"Computador"},Q={granted:"ligadas",denied:"bloqueadas",default:"n\xE3o ativadas",unsupported:"n\xE3o suportadas"};function Y(a,t=44){let i=(a.name||a.email||"?").trim().charAt(0).toUpperCase();return`<span class="aface" style="--s:${t}px;background:${o(a.color||"#8E8E93")}">${a.photo?`<img src="${a.photo}" alt="">`:o(i)}</span>`}function Z(a){let t=k(),i=new Set(a.activeDays||[]);return Array.from({length:30},(l,d)=>N(t,d-29)).map(l=>`<i class="${i.has(l)?"on":""}" title="${l.split("-").reverse().join("/")}"></i>`).join("")}var j=()=>null,X=a=>a&&{trial:"Teste gr\xE1tis",monthly:"Mensal",lifetime:"Vital\xEDcio",expired:"Teste acabou",blocked:"Sem plano",none:"Sem plano"}[a.plan]||"Conta pr\xF3pria";function aa(a,t){let i=a.counts||{},l=a.device||{},d=a.lastSeen&&Date.now()-a.lastSeen<15*6e4;return`<div class="acct${t?" is-open":""}" data-uid="${o(a.uid)}">
    <button class="acct__top" data-toggle="${o(a.uid)}">
      ${Y(a)}
      <div class="acct__id"><strong>${o(a.name||"Sem nome")}${d?' <span class="adot" title="Usando agora"></span>':""}</strong><small>${o(a.email||"")}</small></div>
      <div class="acct__last"><b>${o(B(a.lastSeen))}</b><small>${a.workspace==="dupla"?"Dupla":a.workspace==="compartilhada"?"Convidado":X(j(a.uid))}${j(a.uid)?.addon?.active?` + ${j(a.uid).addon.plan==="equipe"?"Equipe":"Dupla"}`:""}</small></div>
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
        <div><small>Dias ativos (30 dias)</small><b>${(a.activeDays||[]).filter(s=>s>=N(k(),-29)).length}</b></div>
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
      ${(a.profile.difficulties||[]).length?`<div class="adiffs">${a.profile.difficulties.map(s=>`<span>${o(F.find(p=>p.id===s)?.label||s)}</span>`).join("")}</div>`:""}`:""}
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
    </div>`:""}
  </div>`}function ea(a){let t=a.map(s=>s.profile).filter(s=>s&&s.done);if(!t.length)return"";let i=(s,p=5)=>Object.entries(s.reduce((m,g)=>(g&&(m[g]=(m[g]||0)+1),m),{})).sort((m,g)=>g[1]-m[1]).slice(0,p),l=([s,p],m=s)=>`<li><span>${o(m)}</span><i style="--w:${Math.round(p/t.length*100)}%"></i><b>${p}</b></li>`,d=Math.round(t.reduce((s,p)=>s+(p.index||0),0)/t.length);return`<div class="ainsights">
    <div class="ainsights__head"><b>${t.length} ficha${t.length>1?"s":""} preenchida${t.length>1?"s":""}</b><small>\xEDndice m\xE9dio de esquecimento ${d}/100</small></div>
    <h4>Profiss\xF5es</h4><ul class="abars">${i(t.map(s=>s.profession)).map(s=>l(s)).join("")}</ul>
    <h4>\xC1reas</h4><ul class="abars">${i(t.map(s=>s.area)).map(s=>l(s)).join("")}</ul>
    <h4>Maiores dificuldades</h4><ul class="abars">${i(t.flatMap(s=>s.difficulties||[])).map(s=>l(s,F.find(p=>p.id===s[0])?.label||s[0])).join("")}</ul>
  </div>`}function sa(a){return a===null?"":`<section class="block">
    ${a.length?`<div class="aerrs">${a.slice(0,40).map(t=>`<div class="aerr">
        <div class="aerr__top"><b>${o(t.msg)}</b><span>${t.count}\xD7</span></div>
        <small>${o(t.where||"\u2014")} \xB7 ${o(t.dev||"")} \xB7 vers\xE3o ${o(t.ver||"?")} \xB7 ${(t.users||[]).length} pessoa${(t.users||[]).length===1?"":"s"} \xB7 \xFAltimo ${o(B(t.last))}</small>
      </div>`).join("")}</div>
      <button class="btn btn--soft btn--sm" data-clear-errors>Limpar a lista (depois de corrigir)</button>`:'<p class="fhelp">Nenhum erro registrado. \u{1F389} Quando algo der errado no celular de algu\xE9m, aparece aqui.</p>'}
  </section>`}var S=a=>Number.isFinite(Number(a))?Number(a):0,$=(a,t=120)=>typeof a=="string"?a.slice(0,t):"";function ta(a){let t=a.counts||{},i=a.device||{},l=a.profile||{};return{uid:$(a.uid,64),name:$(a.name,60),email:$(a.email,120),workspace:$(a.workspace,20),space:$(a.space,20),photo:typeof a.photo=="string"&&/^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(a.photo)?a.photo:null,color:/^#[0-9a-fA-F]{6}$/.test(a.color||"")?a.color:"#8E8E93",createdAt:S(a.createdAt),lastSeen:S(a.lastSeen),opens:S(a.opens),activeDays:Array.isArray(a.activeDays)?a.activeDays.filter(d=>/^\d{4}-\d{2}-\d{2}$/.test(d)).slice(-40):[],counts:Object.fromEntries(["companies","events","myEvents","thisWeek","done30","late","posts30","notes","personal","lists","birthdays"].map(d=>[d,S(t[d])])),device:{platform:$(i.platform,20),installed:!!i.installed,notifications:$(i.notifications,20),registered:!!i.registered},profile:l.done?{done:!0,profession:$(l.profession,80),area:$(l.area,80),age:$(l.age,10),index:S(l.index),forget:S(l.forget),difficulties:Array.isArray(l.difficulties)?l.difficulties.filter(d=>typeof d=="string").slice(0,12).map(d=>d.slice(0,30)):[],goal:$(l.goal,30),journey:$(l.journey,30)}:{done:!1}}}async function ca(){let a=null,t=null,i=null,l="",d={},s=null,p="resumo",m=()=>{let n=I("Painel do dono",{right:'<button class="btn-text" data-reload>Atualizar</button>'});if(t)return`${n}<div class="page page--sheet"><div class="empty"><h3>N\xE3o consegui carregar</h3><p>${o(t)}</p></div></div>`;if(!a)return`${n}<div class="page page--sheet"><p class="fhelp">Carregando\u2026</p></div>`;let y=Date.now(),w=e=>a.filter(r=>r.lastSeen&&y-r.lastSeen<e*864e5).length,f=a.filter(e=>e.createdAt&&y-e.createdAt<7*864e5).length;j=e=>d[e]||null;let c=Object.values(d),h=c.filter(e=>e.plan==="monthly").length,A=c.filter(e=>e.plan==="lifetime").length,V=c.filter(e=>e.plan==="trial").length,b=c.filter(e=>e.addon&&e.addon.active),W=h*9.9+b.reduce((e,r)=>e+(r.addon.plan==="equipe"?r.plan==="lifetime"?9.9:14.9:r.plan==="lifetime"?4.9:6.9),0),L=c.filter(e=>e.plan!=="none"&&e.plan!=="team").length,H=L?Math.round((h+A)/L*100):0,M=e=>`R$ ${e.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}`,v=(e,r,E="")=>`<div class="arow"><span>${e}${E?`<small>${E}</small>`:""}</span><b>${r}</b></div>`,P=a.filter(e=>e.device?.installed).length,C=a.filter(e=>e.device?.notifications==="granted"&&e.device?.registered).length,O=e=>a.length?` \xB7 ${Math.round(e/a.length*100)}%`:"",G=`<div class="aseg" role="tablist">${[["resumo","Resumo"],["pessoas",`Pessoas \xB7 ${a.length}`],["erros",`Erros${s&&s.length?` \xB7 ${s.length}`:""}`]].map(([e,r])=>`<button role="tab" class="${p===e?"is-on":""}" data-tab-admin="${e}">${r}</button>`).join("")}</div>`,q="";if(p==="resumo")q=`
      <div class="ahero">
        <small>Receita por m\xEAs</small>
        <b>${M(W)}</b>
        <span>${h} ${h===1?"assinante mensal":"assinantes mensais"} \xB7 ${b.length} agenda${b.length===1?"":"s"} compartilhada${b.length===1?"":"s"}</span>
      </div>
      <div class="atiles">
        <div><b>${w(1)}</b><small>ativas hoje</small></div>
        <div><b>${h+A}</b><small>pagantes</small></div>
        <div><b>${V}</b><small>em teste</small></div>
      </div>
      <h3 class="ah">Dinheiro</h3>
      <div class="agroup">
        ${v("Vital\xEDcios vendidos",`${A}`,`${M(A*150)} no total`)}
        ${v("Assinantes do Mensal",`${h}`)}
        ${v("Agendas compartilhadas",`${b.length}`,`${b.filter(e=>e.addon.plan==="equipe").length} Equipe \xB7 ${b.filter(e=>e.addon.plan==="dupla").length} Dupla`)}
        ${v("Convers\xE3o do teste",`${H}%`,"quem pagou \xF7 quem testou")}
      </div>
      <h3 class="ah">Pessoas</h3>
      <div class="agroup">
        ${v("Contas",`${a.length}`,`${f} nova${f===1?"":"s"} nos \xFAltimos 7 dias`)}
        ${v("Usando agora",`${a.filter(e=>e.lastSeen&&y-e.lastSeen<15*6e4).length}`)}
        ${v("Ativas na semana",`${w(7)}`)}
        ${v("Convidados (agenda de outra pessoa)",`${a.filter(e=>e.workspace==="compartilhada").length}`)}
      </div>
      <h3 class="ah">Sa\xFAde do app</h3>
      <div class="agroup">
        ${v("Instalaram na tela inicial",`${P}${O(P)}`)}
        ${v("Recebem notifica\xE7\xF5es",`${C}${O(C)}`,C<a.length?"sem isso, os lembretes n\xE3o chegam":"")}
        ${v("Compromissos criados",`${a.reduce((e,r)=>e+(r.counts?.myEvents||0),0)}`)}
        <button class="arow arow--btn" data-tab-admin="erros"><span>Erros do app</span><b class="${s&&s.length?"bad":"good"}">${s===null?"\u2014":s.length?`${s.length} \u203A`:"nenhum \u2713"}</b></button>
      </div>
      ${ea(a)}`;else if(p==="pessoas"){let e=a.filter(r=>!l||`${r.name} ${r.email} ${r.profile?.profession||""}`.toLowerCase().includes(l)).sort((r,E)=>(E.lastSeen||0)-(r.lastSeen||0));q=`<input class="input" type="search" placeholder="Buscar por nome, e-mail ou profiss\xE3o" data-q value="${o(l)}">
      <div class="accts">${e.map(r=>aa(r,r.uid===i)).join("")||'<p class="fhelp">Nenhuma conta encontrada.</p>'}</div>
      <p class="fhelp">Toque numa conta para ver os detalhes. Aparecem aqui as contas que j\xE1 abriram o app atualizado.</p>`}else q=sa(s)||'<p class="fhelp">N\xE3o consegui ler os erros agora.</p>';return`${n}<div class="page page--sheet apanel">${G}${q}</div>`},g=R({className:"sheet--tall",html:m(),onMount:n=>{n.el.querySelectorAll("[data-toggle]").forEach(c=>c.onclick=()=>{i=i===c.dataset.toggle?null:c.dataset.toggle,n.set(m())}),n.el.querySelectorAll("[data-tab-admin]").forEach(c=>c.onclick=()=>{p=c.dataset.tabAdmin,n.set(m()),n.el.scrollTop=0});let y=n.el.querySelector("[data-reload]");y&&(y.onclick=()=>x());let w=n.el.querySelector("[data-clear-errors]");w&&(w.onclick=async()=>{try{let{api:c}=await import("./c-ZRWETKYP.js");s=(await c("/admin/errors",{clear:!0})).errors||[],n.set(m())}catch{T("N\xE3o consegui limpar agora.")}});let f=n.el.querySelector("[data-q]");f&&(f.oninput=()=>{l=f.value.trim().toLowerCase();let c=f.selectionStart;n.set(m());let h=n.el.querySelector("[data-q]");h.focus(),h.setSelectionRange(c,c)})}}),x=async()=>{try{a=(await D.backendApi.listStats()).map(ta),t=null;try{let{api:n}=await import("./c-ZRWETKYP.js");d=(await n("/billing/all",{})).byWs||{}}catch{d={}}try{let{api:n}=await import("./c-ZRWETKYP.js");s=(await n("/admin/errors",{})).errors||[]}catch{s=null}}catch(n){t=/permission/i.test(String(n.code||n.message))?"Falta atualizar as regras do Firebase (bloco \u201Cstats\u201D).":"Verifique a internet e toque em Atualizar."}g.set(m())};return x(),g}var pa=()=>!!D.user&&!!_.adminEmail&&(D.user.email||"").toLowerCase()===_.adminEmail.toLowerCase();export{pa as isOwner,ca as openAdmin};
