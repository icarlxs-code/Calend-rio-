import{a as F,b as H,h as W}from"./c-4WJ4TYVF.js";import{m as B,o as V,p as E}from"./c-5V3HWSYU.js";import{f as C}from"./c-67L4P7HD.js";import"./c-CID5JDJZ.js";import{a as w}from"./c-CIJP7VMQ.js";import{B as l,d as N,e as O}from"./c-YEARXB46.js";import{a as P}from"./c-MYDFTVQQ.js";import"./c-U53RW4YL.js";import"./c-VHNSBD2M.js";var x=a=>!!a.online&&a.lastPing&&Date.now()-a.lastPing<15e4,_=a=>a?new Date(a).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):"\u2014",G=a=>{if(!a)return"\u2014";let t=Math.round((Date.now()-a)/6e4);if(t<2)return"agora";if(t<60)return`h\xE1 ${t} min`;let i=Math.round(t/60);if(i<24)return`h\xE1 ${i}h`;let o=Math.round(i/24);return o===1?"ontem":`h\xE1 ${o} dias`},Q=a=>a?new Date(a).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric"}):"\u2014",Y={ios:"iPhone","ios-other":"iPhone (Chrome)",android:"Android",samsung:"Android (Samsung)",desktop:"Computador"},Z={granted:"ligadas",denied:"bloqueadas",default:"n\xE3o ativadas",unsupported:"n\xE3o suportadas"};function X(a,t=44){let i=(a.name||a.email||"?").trim().charAt(0).toUpperCase();return`<span class="aface" style="--s:${t}px;background:${l(a.color||"#8E8E93")}">${a.photo?`<img src="${a.photo}" alt="">`:l(i)}</span>`}function aa(a){let t=N(),i=new Set(a.activeDays||[]);return Array.from({length:30},(o,n)=>O(t,n-29)).map(o=>`<i class="${i.has(o)?"on":""}" title="${o.split("-").reverse().join("/")}"></i>`).join("")}var $=()=>null,ea=a=>a?a.plan==="comp"?`Liberado at\xE9 ${new Date(a.compUntil).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"})}`:a.comp?"Cortesia":{trial:"Teste gr\xE1tis",monthly:"Mensal",lifetime:"Vital\xEDcio",expired:"Teste acabou",blocked:"Sem plano",none:"Sem plano"}[a.plan]||"Conta pr\xF3pria":"Conta pr\xF3pria";function sa(a,t){let i=a.counts||{},o=a.device||{},n=x(a),e=Math.max(a.lastPing||0,a.lastSeen||0);return`<div class="acct${t?" is-open":""}" data-uid="${l(a.uid)}">
    <button class="acct__top" data-toggle="${l(a.uid)}">
      ${X(a)}
      <div class="acct__id"><strong>${l(a.name||"Sem nome")}${n?' <span class="adot" title="Usando agora"></span>':""}</strong><small>${l(a.email||"")}</small></div>
      <div class="acct__last"><b class="${n?"is-live":""}">${n?"no app agora":l(`saiu ${G(e)}`)}</b><small>${a.workspace==="dupla"?"Dupla":a.workspace==="compartilhada"?"Convidado":ea($(a.uid))}${$(a.uid)?.addon?.active?` + ${$(a.uid).addon.plan==="equipe"?"Equipe":"Dupla"}`:""}</small></div>
    </button>
    ${a.profile?.done?`<div class="acct__prof">${w("idcard",13)} <b>${l(a.profile.profession||"\u2014")}</b>${a.profile.age?` \xB7 ${l(a.profile.age)} anos`:""} \xB7 \xEDndice ${a.profile.index}/100</div>`:a.workspace!=="dupla"?`<div class="acct__prof is-off">${w("idcard",13)} Ficha n\xE3o preenchida</div>`:""}
    <div class="acct__chips">
      <span>${w("building",12)} ${i.companies||0} grupos</span>
      <span>${w("calendar",12)} ${i.myEvents||0} eventos</span>
      <span>${w("heart",12)} ${i.personal||0} pessoais</span>
      <span class="${o.notifications==="granted"&&o.registered?"ok":"warn"}">${w("bell",12)} ${o.notifications==="granted"&&o.registered?"avisos ok":"sem avisos"}</span>
    </div>
    ${t?`<div class="acct__more">
      <div class="agrid">
        <div><small>Conta criada</small><b>${l(Q(a.createdAt))}</b></div>
        <div><small>Agora</small><b>${n?"\u{1F7E2} Com o app aberto":"\u26AA App fechado"}</b></div>
        <div><small>\xDAltima vez que entrou</small><b>${l(_(a.lastOpen||a.lastSeen))}</b></div>
        <div><small>Saiu do app</small><b>${n?"\u2014":l(_(a.closedAt||e))}</b></div>
        <div><small>Vezes que abriu</small><b>${a.opens||0}</b></div>
        <div><small>Dias ativos (30 dias)</small><b>${(a.activeDays||[]).filter(r=>r>=O(N(),-29)).length}</b></div>
        <div><small>Aparelho</small><b>${l(Y[o.platform]||"\u2014")}</b></div>
        <div><small>Instalado na tela inicial</small><b>${o.installed?"Sim":"N\xE3o"}</b></div>
        <div><small>Notifica\xE7\xF5es</small><b>${l(Z[o.notifications]||"\u2014")}${o.registered?" \xB7 cadastrado":""}</b></div>
        <div><small>\xDAltimo modo usado</small><b>${a.space==="personal"?"Pessoal":"Trabalho"}</b></div>
      </div>
      ${a.profile?.done?`<h4>Ficha</h4>
      <div class="agrid">
        <div><small>Profiss\xE3o</small><b>${l(a.profile.profession||"\u2014")}</b></div>
        <div><small>\xC1rea</small><b>${l(a.profile.area||"\u2014")}</b></div>
        <div><small>Idade</small><b>${l(a.profile.age||"\u2014")}</b></div>
        <div><small>\xCDndice de esquecimento</small><b>${a.profile.index}/100 (marcou ${a.profile.forget}/5)</b></div>
        <div><small>Jornada</small><b>${l(H.find(r=>r.id===a.profile.journey)?.label||"\u2014")}</b></div>
        <div><small>Objetivo</small><b>${l(W.find(r=>r.id===a.profile.goal)?.label||"\u2014")}</b></div>
      </div>
      ${(a.profile.difficulties||[]).length?`<div class="adiffs">${a.profile.difficulties.map(r=>`<span>${l(F.find(p=>p.id===r)?.label||r)}</span>`).join("")}</div>`:""}`:""}
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
      ${$(a.uid)?.plan==="comp"?`<p class="fhelp">\u2705 Liberado at\xE9 <b>${l(_($(a.uid).compUntil))}</b>. Depois disso a pessoa precisa assinar.</p>`:""}
      ${$(a.uid)?.comp&&$(a.uid)?.plan!=="comp"?`<button class="btn btn--soft btn--block" data-grant="${l(a.uid)}" data-on="0">Tirar o acesso cortesia</button>`:$(a.uid)?.plan==="lifetime"||$(a.uid)?.plan==="monthly"?'<p class="fhelp">Conta paga.</p>':`<div class="grantbox">
              <label class="fhelp">Liberar tudo, sem pagar, at\xE9:</label>
              <input type="datetime-local" class="input" data-until="${l(a.uid)}" value="${(()=>{let r=new Date(Date.now()+6048e5);return r.setMinutes(r.getMinutes()-r.getTimezoneOffset()),r.toISOString().slice(0,16)})()}">
              <button class="btn btn--primary btn--block" data-grant="${l(a.uid)}" data-on="1" data-dated="1">${$(a.uid)?.plan==="comp"?"Mudar a data":"Liberar at\xE9 essa data"}</button>
              ${$(a.uid)?.plan==="comp"?`<button class="btn btn--soft btn--block" data-grant="${l(a.uid)}" data-on="0">Tirar o acesso agora</button>`:""}
              <button class="btn-text btn--block" data-grant="${l(a.uid)}" data-on="1">Liberar para sempre (cortesia: revisor da loja, parceiro)</button>
            </div>`}`:""}
    </div>`:""}
  </div>`}function ta(a){let t=a.map(e=>e.profile).filter(e=>e&&e.done);if(!t.length)return"";let i=(e,r=5)=>Object.entries(e.reduce((p,b)=>(b&&(p[b]=(p[b]||0)+1),p),{})).sort((p,b)=>b[1]-p[1]).slice(0,r),o=([e,r],p=e)=>`<li><span>${l(p)}</span><i style="--w:${Math.round(r/t.length*100)}%"></i><b>${r}</b></li>`,n=Math.round(t.reduce((e,r)=>e+(r.index||0),0)/t.length);return`<div class="ainsights">
    <div class="ainsights__head"><b>${t.length} ficha${t.length>1?"s":""} preenchida${t.length>1?"s":""}</b><small>\xEDndice m\xE9dio de esquecimento ${n}/100</small></div>
    <h4>Profiss\xF5es</h4><ul class="abars">${i(t.map(e=>e.profession)).map(e=>o(e)).join("")}</ul>
    <h4>\xC1reas</h4><ul class="abars">${i(t.map(e=>e.area)).map(e=>o(e)).join("")}</ul>
    <h4>Maiores dificuldades</h4><ul class="abars">${i(t.flatMap(e=>e.difficulties||[])).map(e=>o(e,F.find(r=>r.id===e[0])?.label||e[0])).join("")}</ul>
  </div>`}function ia(a){let t=a.filter(n=>n.workspace==="proprio");if(!t.length)return"";let i={};for(let n of t){let e=n.origin||{},r=e.source?`${e.source}${e.campaign?" \xB7 "+e.campaign:""}`:"direto / sem marca\xE7\xE3o",p=$(n.uid),b=i[r]=i[r]||{n:0,paid:0,trial:0};b.n++,p&&(p.plan==="monthly"||p.plan==="lifetime"&&!p.comp)&&b.paid++,p&&p.plan==="trial"&&b.trial++}return`<h3 class="ah">De onde vieram</h3>
  <div class="agroup">${Object.entries(i).sort((n,e)=>e[1].n-n[1].n).slice(0,12).map(([n,e])=>`<div class="arow"><span>${l(n)}<small>${e.trial} em teste \xB7 ${e.paid} pagaram${e.n?` \xB7 ${Math.round(e.paid/e.n*100)}%`:""}</small></span><b>${e.n}</b></div>`).join("")}</div>
  <p class="fhelp">Use links com marca\xE7\xE3o nos an\xFAncios, ex.: <b>\u2026/conheca/?utm_source=instagram&amp;utm_campaign=dentistas</b>, para saber qual an\xFAncio traz quem paga.</p>`}function oa(a){return a===null?"":`<section class="block">
    ${a.length?`<div class="aerrs">${a.slice(0,40).map(t=>`<div class="aerr">
        <div class="aerr__top"><b>${l(t.msg)}</b><span>${t.count}\xD7</span></div>
        <small>${l(t.where||"\u2014")} \xB7 ${l(t.dev||"")} \xB7 vers\xE3o ${l(t.ver||"?")} \xB7 ${(t.users||[]).length} pessoa${(t.users||[]).length===1?"":"s"} \xB7 \xFAltimo ${l(G(t.last))}</small>
      </div>`).join("")}</div>
      <button class="btn btn--soft btn--sm" data-clear-errors>Limpar a lista (depois de corrigir)</button>`:'<p class="fhelp">Nenhum erro registrado. \u{1F389} Quando algo der errado no celular de algu\xE9m, aparece aqui.</p>'}
  </section>`}var y=a=>Number.isFinite(Number(a))?Number(a):0,g=(a,t=120)=>typeof a=="string"?a.slice(0,t):"";function la(a){let t=a.counts||{},i=a.device||{},o=a.profile||{};return{uid:g(a.uid,64),name:g(a.name,60),email:g(a.email,120),workspace:g(a.workspace,20),space:g(a.space,20),photo:typeof a.photo=="string"&&/^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(a.photo)?a.photo:null,color:/^#[0-9a-fA-F]{6}$/.test(a.color||"")?a.color:"#8E8E93",createdAt:y(a.createdAt),lastSeen:y(a.lastSeen),opens:y(a.opens),online:!!a.online,lastPing:y(a.lastPing),lastOpen:y(a.lastOpen),closedAt:y(a.closedAt),activeDays:Array.isArray(a.activeDays)?a.activeDays.filter(n=>/^\d{4}-\d{2}-\d{2}$/.test(n)).slice(-40):[],counts:Object.fromEntries(["companies","events","myEvents","thisWeek","done30","late","posts30","notes","personal","lists","birthdays"].map(n=>[n,y(t[n])])),device:{platform:g(i.platform,20),installed:!!i.installed,notifications:g(i.notifications,20),registered:!!i.registered},origin:a.origin&&typeof a.origin=="object"?{source:g(a.origin.source,60),medium:g(a.origin.medium,60),campaign:g(a.origin.campaign,60)}:null,profile:o.done?{done:!0,profession:g(o.profession,80),area:g(o.area,80),age:g(o.age,10),index:y(o.index),forget:y(o.forget),difficulties:Array.isArray(o.difficulties)?o.difficulties.filter(n=>typeof n=="string").slice(0,12).map(n=>n.slice(0,30)):[],goal:g(o.goal,30),journey:g(o.journey,30)}:{done:!1}}}async function ga(){let a=null,t=null,i=null,o="",n={},e=null,r="resumo",p=()=>{let c=V("Painel do dono",{right:'<button class="btn-text" data-reload>Atualizar</button>'});if(t)return`${c}<div class="page page--sheet"><div class="empty"><h3>N\xE3o consegui carregar</h3><p>${l(t)}</p></div></div>`;if(!a)return`${c}<div class="page page--sheet"><p class="fhelp">Carregando\u2026</p></div>`;let A=Date.now(),q=s=>a.filter(m=>m.lastSeen&&A-m.lastSeen<s*864e5).length,D=a.filter(s=>s.createdAt&&A-s.createdAt<7*864e5).length;$=s=>n[s]||null;let f=Object.values(n),d=f.filter(s=>s.plan==="monthly").length,v=f.filter(s=>s.plan==="lifetime"&&!s.comp).length,k=f.filter(s=>s.plan==="trial").length,h=f.filter(s=>s.addon&&s.addon.active),M=d*9.9+h.reduce((s,m)=>s+(m.addon.plan==="equipe"?m.plan==="lifetime"?9.9:14.9:m.plan==="lifetime"?4.9:6.9),0),I=f.filter(s=>s.plan!=="none"&&s.plan!=="team").length,J=I?Math.round((d+v)/I*100):0,R=s=>`R$ ${s.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}`,u=(s,m,S="")=>`<div class="arow"><span>${s}${S?`<small>${S}</small>`:""}</span><b>${m}</b></div>`,z=a.filter(s=>s.device?.installed).length,L=a.filter(s=>s.device?.notifications==="granted"&&s.device?.registered).length,U=s=>a.length?` \xB7 ${Math.round(s/a.length*100)}%`:"",K=`<div class="aseg" role="tablist">${[["resumo","Resumo"],["pessoas",`Pessoas \xB7 ${a.length}`],["erros",`Erros${e&&e.length?` \xB7 ${e.length}`:""}`]].map(([s,m])=>`<button role="tab" class="${r===s?"is-on":""}" data-tab-admin="${s}">${m}</button>`).join("")}</div>`,j="";if(r==="resumo")j=`
      <div class="ahero">
        <small>Receita por m\xEAs</small>
        <b>${R(M)}</b>
        <span>${d} ${d===1?"assinante mensal":"assinantes mensais"} \xB7 ${h.length} agenda${h.length===1?"":"s"} compartilhada${h.length===1?"":"s"}</span>
      </div>
      <div class="atiles">
        <div><b>${q(1)}</b><small>ativas hoje</small></div>
        <div><b>${d+v}</b><small>pagantes</small></div>
        <div><b>${k}</b><small>em teste</small></div>
      </div>
      <h3 class="ah">Dinheiro</h3>
      <div class="agroup">
        ${u("Vital\xEDcios vendidos",`${v}`,`${R(v*150)} no total`)}
        ${u("Assinantes do Mensal",`${d}`)}
        ${u("Agendas compartilhadas",`${h.length}`,`${h.filter(s=>s.addon.plan==="equipe").length} Equipe \xB7 ${h.filter(s=>s.addon.plan==="dupla").length} Dupla`)}
        ${u("Convers\xE3o do teste",`${J}%`,"quem pagou \xF7 quem testou")}
      </div>
      <h3 class="ah">Pessoas</h3>
      <div class="agroup">
        ${u("Contas",`${a.length}`,`${D} nova${D===1?"":"s"} nos \xFAltimos 7 dias`)}
        ${u("No app agora",`${a.filter(x).length}`)}
        ${u("Ativas na semana",`${q(7)}`)}
        ${u("Convidados (agenda de outra pessoa)",`${a.filter(s=>s.workspace==="compartilhada").length}`)}
      </div>
      <h3 class="ah">Sa\xFAde do app</h3>
      <div class="agroup">
        ${u("Instalaram na tela inicial",`${z}${U(z)}`)}
        ${u("Recebem notifica\xE7\xF5es",`${L}${U(L)}`,L<a.length?"sem isso, os lembretes n\xE3o chegam":"")}
        ${u("Compromissos criados",`${a.reduce((s,m)=>s+(m.counts?.myEvents||0),0)}`)}
        <button class="arow arow--btn" data-support-inbox><span>\u{1F4AC} Mensagens de suporte</span><b>abrir \u203A</b></button>
        <button class="arow arow--btn" data-tab-admin="erros"><span>Erros do app</span><b class="${e&&e.length?"bad":"good"}">${e===null?"\u2014":e.length?`${e.length} \u203A`:"nenhum \u2713"}</b></button>
      </div>
      ${ia(a)}
      ${ta(a)}`;else if(r==="pessoas"){let s=a.filter(m=>!o||`${m.name} ${m.email} ${m.profile?.profession||""}`.toLowerCase().includes(o)).sort((m,S)=>x(S)-x(m)||Math.max(S.lastPing||0,S.lastSeen||0)-Math.max(m.lastPing||0,m.lastSeen||0));j=`<input class="input" type="search" placeholder="Buscar por nome, e-mail ou profiss\xE3o" data-q value="${l(o)}">
      <div class="accts">${s.map(m=>sa(m,m.uid===i)).join("")||'<p class="fhelp">Nenhuma conta encontrada.</p>'}</div>
      <p class="fhelp">Toque numa conta para ver os detalhes. Aparecem aqui as contas que j\xE1 abriram o app atualizado.</p>`}else j=oa(e)||'<p class="fhelp">N\xE3o consegui ler os erros agora.</p>';return`${c}<div class="page page--sheet apanel">${K}${j}</div>`},b=B({className:"sheet--tall",html:p(),onMount:c=>{c.el.querySelectorAll("[data-toggle]").forEach(d=>d.onclick=()=>{i=i===d.dataset.toggle?null:d.dataset.toggle,c.set(p())});let A=c.el.querySelector("[data-support-inbox]");A&&(A.onclick=async()=>(await import("./c-N3YCX7LT.js")).openSupportInbox()),c.el.querySelectorAll("[data-tab-admin]").forEach(d=>d.onclick=()=>{r=d.dataset.tabAdmin,c.set(p()),c.el.scrollTop=0}),c.el.querySelectorAll("[data-grant]").forEach(d=>d.onclick=async()=>{d.disabled=!0;try{let{api:v}=await import("./c-LYDKAUYT.js"),k=d.dataset.dated?c.el.querySelector(`[data-until="${d.dataset.grant}"]`):null,h=k?new Date(k.value).getTime():0;if(k&&!(h>Date.now())){E("Escolha uma data e hora no futuro");return}let M=await v("/admin/grant",{uid:d.dataset.grant,on:d.dataset.on==="1",until:h});n[d.dataset.grant]=M.status,E(d.dataset.on!=="1"?"Acesso retirado":h?`Liberado at\xE9 ${_(h)} \u2713`:"Acesso cortesia liberado \u2713"),c.set(p())}catch(v){d.disabled=!1,E(v.message||"N\xE3o consegui agora.")}});let q=c.el.querySelector("[data-reload]");q&&(q.onclick=()=>T());let D=c.el.querySelector("[data-clear-errors]");D&&(D.onclick=async()=>{try{let{api:d}=await import("./c-LYDKAUYT.js");e=(await d("/admin/errors",{clear:!0})).errors||[],c.set(p())}catch{E("N\xE3o consegui limpar agora.")}});let f=c.el.querySelector("[data-q]");f&&(f.oninput=()=>{o=f.value.trim().toLowerCase();let d=f.selectionStart;c.set(p());let v=c.el.querySelector("[data-q]");v.focus(),v.setSelectionRange(d,d)})}}),T=async()=>{try{a=(await C.backendApi.listStats()).map(la),t=null;try{let{api:c}=await import("./c-LYDKAUYT.js");n=(await c("/billing/all",{})).byWs||{}}catch{n={}}try{let{api:c}=await import("./c-LYDKAUYT.js");e=(await c("/admin/errors",{})).errors||[]}catch{e=null}}catch(c){t=/permission/i.test(String(c.code||c.message))?"Falta atualizar as regras do Firebase (bloco \u201Cstats\u201D).":"Verifique a internet e toque em Atualizar."}b.set(p())};return T(),b}var $a=()=>!!C.user&&!!P.adminEmail&&(C.user.email||"").toLowerCase()===P.adminEmail.toLowerCase();export{$a as isOwner,ga as openAdmin};
