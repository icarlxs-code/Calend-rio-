import{a as I,b as H,h as W}from"./c-4WJ4TYVF.js";import{m as R,o as T,p as E}from"./c-ESQTIKOA.js";import{a as A}from"./c-CIJP7VMQ.js";import{f as M}from"./c-YJVOSJF5.js";import"./c-CID5JDJZ.js";import{B as t,d as O,e as F}from"./c-YEARXB46.js";import{a as x}from"./c-MYDFTVQQ.js";import"./c-U53RW4YL.js";import"./c-VHNSBD2M.js";var L=a=>!!a.online&&a.lastPing&&Date.now()-a.lastPing<15e4,N=a=>a?new Date(a).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):"\u2014",G=a=>{if(!a)return"\u2014";let i=Math.round((Date.now()-a)/6e4);if(i<2)return"agora";if(i<60)return`h\xE1 ${i} min`;let o=Math.round(i/60);if(o<24)return`h\xE1 ${o}h`;let l=Math.round(o/24);return l===1?"ontem":`h\xE1 ${l} dias`},Q=a=>a?new Date(a).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric"}):"\u2014",Y={ios:"iPhone","ios-other":"iPhone (Chrome)",android:"Android",samsung:"Android (Samsung)",desktop:"Computador"},Z={granted:"ligadas",denied:"bloqueadas",default:"n\xE3o ativadas",unsupported:"n\xE3o suportadas"};function X(a,i=44){let o=(a.name||a.email||"?").trim().charAt(0).toUpperCase();return`<span class="aface" style="--s:${i}px;background:${t(a.color||"#8E8E93")}">${a.photo?`<img src="${a.photo}" alt="">`:t(o)}</span>`}function aa(a){let i=O(),o=new Set(a.activeDays||[]);return Array.from({length:30},(l,n)=>F(i,n-29)).map(l=>`<i class="${o.has(l)?"on":""}" title="${l.split("-").reverse().join("/")}"></i>`).join("")}var h=()=>null,sa=a=>a?a.plan==="comp"?`Liberado at\xE9 ${new Date(a.compUntil).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"})}`:a.comp?"Cortesia":{trial:"Teste gr\xE1tis",monthly:"Mensal",lifetime:"Vital\xEDcio",expired:"Teste acabou",blocked:"Sem plano",none:"Sem plano"}[a.plan]||"Conta pr\xF3pria":"Conta pr\xF3pria";function ea(a,i){let o=a.counts||{},l=a.device||{},n=L(a),s=Math.max(a.lastPing||0,a.lastSeen||0);return`<div class="acct${i?" is-open":""}" data-uid="${t(a.uid)}">
    <button class="acct__top" data-toggle="${t(a.uid)}">
      ${X(a)}
      <div class="acct__id"><strong>${t(a.name||"Sem nome")}${n?' <span class="adot" title="Usando agora"></span>':""}</strong><small>${t(a.email||"")}</small></div>
      <div class="acct__last"><b class="${n?"is-live":""}">${n?"no app agora":t(`saiu ${G(s)}`)}</b><small>${a.workspace==="dupla"?"Dupla":a.workspace==="compartilhada"?"Convidado":sa(h(a.uid))}${h(a.uid)?.addon?.active?` + ${h(a.uid).addon.plan==="equipe"?"Equipe":"Dupla"}`:""}</small></div>
    </button>
    ${a.profile?.done?`<div class="acct__prof">${A("idcard",13)} <b>${t(a.profile.profession||"\u2014")}</b>${a.profile.age?` \xB7 ${t(a.profile.age)} anos`:""} \xB7 \xEDndice ${a.profile.index}/100</div>`:a.workspace!=="dupla"?`<div class="acct__prof is-off">${A("idcard",13)} Ficha n\xE3o preenchida</div>`:""}
    <div class="acct__chips">
      <span>${A("building",12)} ${o.companies||0} grupos</span>
      <span>${A("calendar",12)} ${o.myEvents||0} eventos</span>
      <span>${A("heart",12)} ${o.personal||0} pessoais</span>
      <span class="${l.notifications==="granted"&&l.registered?"ok":"warn"}">${A("bell",12)} ${l.notifications==="granted"&&l.registered?"avisos ok":"sem avisos"}</span>
    </div>
    ${i?`<div class="acct__more">
      <div class="agrid">
        <div><small>Conta criada</small><b>${t(Q(a.createdAt))}</b></div>
        <div><small>Agora</small><b>${n?"\u{1F7E2} Com o app aberto":"\u26AA App fechado"}</b></div>
        <div><small>\xDAltima vez que entrou</small><b>${t(N(a.lastOpen||a.lastSeen))}</b></div>
        <div><small>Saiu do app</small><b>${n?"\u2014":t(N(a.closedAt||s))}</b></div>
        <div><small>Vezes que abriu</small><b>${a.opens||0}</b></div>
        <div><small>Dias ativos (30 dias)</small><b>${(a.activeDays||[]).filter(r=>r>=F(O(),-29)).length}</b></div>
        <div><small>Aparelho</small><b>${t(Y[l.platform]||"\u2014")}</b></div>
        <div><small>Instalado na tela inicial</small><b>${l.installed?"Sim":"N\xE3o"}</b></div>
        <div><small>Notifica\xE7\xF5es</small><b>${t(Z[l.notifications]||"\u2014")}${l.registered?" \xB7 cadastrado":""}</b></div>
        <div><small>\xDAltimo modo usado</small><b>${a.space==="personal"?"Pessoal":"Trabalho"}</b></div>
      </div>
      ${a.profile?.done?`<h4>Ficha</h4>
      <div class="agrid">
        <div><small>Profiss\xE3o</small><b>${t(a.profile.profession||"\u2014")}</b></div>
        <div><small>\xC1rea</small><b>${t(a.profile.area||"\u2014")}</b></div>
        <div><small>Idade</small><b>${t(a.profile.age||"\u2014")}</b></div>
        <div><small>\xCDndice de esquecimento</small><b>${a.profile.index}/100 (marcou ${a.profile.forget}/5)</b></div>
        <div><small>Jornada</small><b>${t(H.find(r=>r.id===a.profile.journey)?.label||"\u2014")}</b></div>
        <div><small>Objetivo</small><b>${t(W.find(r=>r.id===a.profile.goal)?.label||"\u2014")}</b></div>
      </div>
      ${(a.profile.difficulties||[]).length?`<div class="adiffs">${a.profile.difficulties.map(r=>`<span>${t(I.find(p=>p.id===r)?.label||r)}</span>`).join("")}</div>`:""}`:""}
      <h4>Trabalho</h4>
      <div class="agrid">
        <div><small>Empresas / grupos</small><b>${o.companies||0}</b></div>
        <div><small>Eventos (total no espa\xE7o)</small><b>${o.events||0}</b></div>
        <div><small>Cadastrados pela pessoa</small><b>${o.myEvents||0}</b></div>
        <div><small>Pr\xF3ximos 7 dias</small><b>${o.thisWeek||0}</b></div>
        <div><small>Posts (30 dias)</small><b>${o.posts30||0}</b></div>
        <div><small>Feitos (30 dias)</small><b>${o.done30||0}</b></div>
        <div><small>Atrasados (30 dias)</small><b class="${o.late?"bad":""}">${o.late||0}</b></div>
        <div><small>Bilhetes</small><b>${o.notes||0}</b></div>
      </div>
      <h4>Pessoal <small>(s\xF3 quantidade; o conte\xFAdo \xE9 privado)</small></h4>
      <div class="agrid">
        <div><small>Anota\xE7\xF5es</small><b>${o.personal||0}</b></div>
        <div><small>Listas</small><b>${o.lists||0}</b></div>
        <div><small>Anivers\xE1rios</small><b>${o.birthdays||0}</b></div>
      </div>
      <h4>Uso nos \xFAltimos 30 dias</h4>
      <div class="adays">${aa(a)}</div>
      ${a.workspace==="proprio"?`<h4>Acesso</h4>
      ${h(a.uid)?.plan==="comp"?`<p class="fhelp">\u2705 Liberado at\xE9 <b>${t(N(h(a.uid).compUntil))}</b>. Depois disso a pessoa precisa assinar.</p>`:""}
      ${h(a.uid)?.comp&&h(a.uid)?.plan!=="comp"?`<button class="btn btn--soft btn--block" data-grant="${t(a.uid)}" data-on="0">Tirar o acesso cortesia</button>`:h(a.uid)?.plan==="lifetime"||h(a.uid)?.plan==="monthly"?'<p class="fhelp">Conta paga.</p>':`<div class="grantbox">
              <label class="fhelp">Liberar tudo, sem pagar, at\xE9:</label>
              <input type="datetime-local" class="input" data-until="${t(a.uid)}" value="${(()=>{let r=new Date(Date.now()+6048e5);return r.setMinutes(r.getMinutes()-r.getTimezoneOffset()),r.toISOString().slice(0,16)})()}">
              <button class="btn btn--primary btn--block" data-grant="${t(a.uid)}" data-on="1" data-dated="1">${h(a.uid)?.plan==="comp"?"Mudar a data":"Liberar at\xE9 essa data"}</button>
              ${h(a.uid)?.plan==="comp"?`<button class="btn btn--soft btn--block" data-grant="${t(a.uid)}" data-on="0">Tirar o acesso agora</button>`:""}
              <button class="btn-text btn--block" data-grant="${t(a.uid)}" data-on="1">Liberar para sempre (cortesia: revisor da loja, parceiro)</button>
            </div>`}`:""}
    </div>`:""}
  </div>`}function ta(a){let i=a.map(s=>s.profile).filter(s=>s&&s.done);if(!i.length)return"";let o=(s,r=5)=>Object.entries(s.reduce((p,u)=>(u&&(p[u]=(p[u]||0)+1),p),{})).sort((p,u)=>u[1]-p[1]).slice(0,r),l=([s,r],p=s)=>`<li><span>${t(p)}</span><i style="--w:${Math.round(r/i.length*100)}%"></i><b>${r}</b></li>`,n=Math.round(i.reduce((s,r)=>s+(r.index||0),0)/i.length);return`<div class="ainsights">
    <div class="ainsights__head"><b>${i.length} ficha${i.length>1?"s":""} preenchida${i.length>1?"s":""}</b><small>\xEDndice m\xE9dio de esquecimento ${n}/100</small></div>
    <h4>Profiss\xF5es</h4><ul class="abars">${o(i.map(s=>s.profession)).map(s=>l(s)).join("")}</ul>
    <h4>\xC1reas</h4><ul class="abars">${o(i.map(s=>s.area)).map(s=>l(s)).join("")}</ul>
    <h4>Maiores dificuldades</h4><ul class="abars">${o(i.flatMap(s=>s.difficulties||[])).map(s=>l(s,I.find(r=>r.id===s[0])?.label||s[0])).join("")}</ul>
  </div>`}function ia(a){let i=a.filter(n=>n.workspace==="proprio");if(!i.length)return"";let o={};for(let n of i){let s=n.origin||{},r=s.source?`${s.source}${s.campaign?" \xB7 "+s.campaign:""}`:"direto / sem marca\xE7\xE3o",p=h(n.uid),u=o[r]=o[r]||{n:0,paid:0,trial:0};u.n++,p&&(p.plan==="monthly"||p.plan==="lifetime"&&!p.comp)&&u.paid++,p&&p.plan==="trial"&&u.trial++}return`<h3 class="ah">De onde vieram</h3>
  <div class="agroup">${Object.entries(o).sort((n,s)=>s[1].n-n[1].n).slice(0,12).map(([n,s])=>`<div class="arow"><span>${t(n)}<small>${s.trial} em teste \xB7 ${s.paid} pagaram${s.n?` \xB7 ${Math.round(s.paid/s.n*100)}%`:""}</small></span><b>${s.n}</b></div>`).join("")}</div>
  <p class="fhelp">Use links com marca\xE7\xE3o nos an\xFAncios, ex.: <b>\u2026/conheca/?utm_source=instagram&amp;utm_campaign=dentistas</b>, para saber qual an\xFAncio traz quem paga.</p>`}function oa(a){return a===null?"":`<section class="block">
    ${a.length?`<div class="aerrs">${a.slice(0,40).map(i=>`<div class="aerr">
        <div class="aerr__top"><b>${t(i.msg)}</b><span>${i.count}\xD7</span></div>
        <small>${t(i.where||"\u2014")} \xB7 ${t(i.dev||"")} \xB7 vers\xE3o ${t(i.ver||"?")} \xB7 ${(i.users||[]).length} pessoa${(i.users||[]).length===1?"":"s"} \xB7 \xFAltimo ${t(G(i.last))}</small>
      </div>`).join("")}</div>
      <button class="btn btn--soft btn--sm" data-clear-errors>Limpar a lista (depois de corrigir)</button>`:'<p class="fhelp">Nenhum erro registrado. \u{1F389} Quando algo der errado no celular de algu\xE9m, aparece aqui.</p>'}
  </section>`}var y=a=>Number.isFinite(Number(a))?Number(a):0,$=(a,i=120)=>typeof a=="string"?a.slice(0,i):"";function la(a){let i=a.counts||{},o=a.device||{},l=a.profile||{};return{uid:$(a.uid,64),name:$(a.name,60),email:$(a.email,120),workspace:$(a.workspace,20),space:$(a.space,20),photo:typeof a.photo=="string"&&/^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(a.photo)?a.photo:null,color:/^#[0-9a-fA-F]{6}$/.test(a.color||"")?a.color:"#8E8E93",createdAt:y(a.createdAt),lastSeen:y(a.lastSeen),opens:y(a.opens),online:!!a.online,lastPing:y(a.lastPing),lastOpen:y(a.lastOpen),closedAt:y(a.closedAt),activeDays:Array.isArray(a.activeDays)?a.activeDays.filter(n=>/^\d{4}-\d{2}-\d{2}$/.test(n)).slice(-40):[],counts:Object.fromEntries(["companies","events","myEvents","thisWeek","done30","late","posts30","notes","personal","lists","birthdays"].map(n=>[n,y(i[n])])),device:{platform:$(o.platform,20),installed:!!o.installed,notifications:$(o.notifications,20),registered:!!o.registered},origin:a.origin&&typeof a.origin=="object"?{source:$(a.origin.source,60),medium:$(a.origin.medium,60),campaign:$(a.origin.campaign,60)}:null,profile:l.done?{done:!0,profession:$(l.profession,80),area:$(l.area,80),age:$(l.age,10),index:y(l.index),forget:y(l.forget),difficulties:Array.isArray(l.difficulties)?l.difficulties.filter(n=>typeof n=="string").slice(0,12).map(n=>n.slice(0,30)):[],goal:$(l.goal,30),journey:$(l.journey,30)}:{done:!1}}}async function ga(){let a=null,i=null,o=null,l="",n={},s=null,r="resumo",p=()=>{let c=T("Painel do dono",{right:'<button class="btn-text" data-reload>Atualizar</button>'});if(i)return`${c}<div class="page page--sheet"><div class="empty"><h3>N\xE3o consegui carregar</h3><p>${t(i)}</p></div></div>`;if(!a)return`${c}<div class="page page--sheet"><p class="fhelp">Carregando\u2026</p></div>`;let q=Date.now(),D=e=>a.filter(g=>g.lastSeen&&q-g.lastSeen<e*864e5).length,j=a.filter(e=>e.createdAt&&q-e.createdAt<7*864e5).length;h=e=>n[e]||null;let w=Object.values(n),v=w.filter(e=>e.plan==="monthly").length,d=w.filter(e=>e.plan==="lifetime"&&!e.comp).length,b=w.filter(e=>e.plan==="trial").length,m=w.filter(e=>e.addon&&e.addon.active),S=v*9.9+m.reduce((e,g)=>e+(g.addon.plan==="equipe"?g.plan==="lifetime"?9.9:14.9:g.plan==="lifetime"?4.9:6.9),0),C=w.filter(e=>e.plan!=="none"&&e.plan!=="team").length,J=C?Math.round((v+d)/C*100):0,U=e=>`R$ ${e.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}`,f=(e,g,k="")=>`<div class="arow"><span>${e}${k?`<small>${k}</small>`:""}</span><b>${g}</b></div>`,B=a.filter(e=>e.device?.installed).length,P=a.filter(e=>e.device?.notifications==="granted"&&e.device?.registered).length,V=e=>a.length?` \xB7 ${Math.round(e/a.length*100)}%`:"",K=`<div class="aseg" role="tablist">${[["resumo","Resumo"],["pessoas",`Pessoas \xB7 ${a.length}`],["erros",`Erros${s&&s.length?` \xB7 ${s.length}`:""}`]].map(([e,g])=>`<button role="tab" class="${r===e?"is-on":""}" data-tab-admin="${e}">${g}</button>`).join("")}</div>`,_="";if(r==="resumo")_=`
      <div class="ahero">
        <small>Receita por m\xEAs</small>
        <b>${U(S)}</b>
        <span>${v} ${v===1?"assinante mensal":"assinantes mensais"} \xB7 ${m.length} agenda${m.length===1?"":"s"} compartilhada${m.length===1?"":"s"}</span>
      </div>
      <div class="atiles">
        <div><b>${D(1)}</b><small>ativas hoje</small></div>
        <div><b>${v+d}</b><small>pagantes</small></div>
        <div><b>${b}</b><small>em teste</small></div>
      </div>
      <h3 class="ah">Dinheiro</h3>
      <div class="agroup">
        ${f("Vital\xEDcios vendidos",`${d}`,`${U(d*150)} no total`)}
        ${f("Assinantes do Mensal",`${v}`)}
        ${f("Agendas compartilhadas",`${m.length}`,`${m.filter(e=>e.addon.plan==="equipe").length} Equipe \xB7 ${m.filter(e=>e.addon.plan==="dupla").length} Dupla`)}
        ${f("Convers\xE3o do teste",`${J}%`,"quem pagou \xF7 quem testou")}
      </div>
      <h3 class="ah">Pessoas</h3>
      <div class="agroup">
        ${f("Contas",`${a.length}`,`${j} nova${j===1?"":"s"} nos \xFAltimos 7 dias`)}
        ${f("No app agora",`${a.filter(L).length}`)}
        ${f("Ativas na semana",`${D(7)}`)}
        ${f("Convidados (agenda de outra pessoa)",`${a.filter(e=>e.workspace==="compartilhada").length}`)}
      </div>
      <h3 class="ah">Sa\xFAde do app</h3>
      <div class="agroup">
        ${f("Instalaram na tela inicial",`${B}${V(B)}`)}
        ${f("Recebem notifica\xE7\xF5es",`${P}${V(P)}`,P<a.length?"sem isso, os lembretes n\xE3o chegam":"")}
        ${f("Compromissos criados",`${a.reduce((e,g)=>e+(g.counts?.myEvents||0),0)}`)}
        <button class="arow arow--btn" data-rank-admin><span>\u{1F3C6} Ranking (pontos e suspeitas)</span><b>abrir \u203A</b></button>
        <button class="arow arow--btn" data-support-inbox><span>\u{1F4AC} Mensagens de suporte</span><b>abrir \u203A</b></button>
        <button class="arow arow--btn" data-tab-admin="erros"><span>Erros do app</span><b class="${s&&s.length?"bad":"good"}">${s===null?"\u2014":s.length?`${s.length} \u203A`:"nenhum \u2713"}</b></button>
      </div>
      ${ia(a)}
      ${ta(a)}`;else if(r==="pessoas"){let e=a.filter(g=>!l||`${g.name} ${g.email} ${g.profile?.profession||""}`.toLowerCase().includes(l)).sort((g,k)=>L(k)-L(g)||Math.max(k.lastPing||0,k.lastSeen||0)-Math.max(g.lastPing||0,g.lastSeen||0));_=`<input class="input" type="search" placeholder="Buscar por nome, e-mail ou profiss\xE3o" data-q value="${t(l)}">
      <div class="accts">${e.map(g=>ea(g,g.uid===o)).join("")||'<p class="fhelp">Nenhuma conta encontrada.</p>'}</div>
      <p class="fhelp">Toque numa conta para ver os detalhes. Aparecem aqui as contas que j\xE1 abriram o app atualizado.</p>`}else _=oa(s)||'<p class="fhelp">N\xE3o consegui ler os erros agora.</p>';return`${c}<div class="page page--sheet apanel">${K}${_}</div>`},u=R({className:"sheet--tall",html:p(),onMount:c=>{c.el.querySelectorAll("[data-toggle]").forEach(d=>d.onclick=()=>{o=o===d.dataset.toggle?null:d.dataset.toggle,c.set(p())});let q=c.el.querySelector("[data-rank-admin]");q&&(q.onclick=async()=>{let{api:d}=await import("./c-O3YSDJJ4.js"),b=await d("/rank/admin",{}).catch(m=>({error:m.message}));R({className:"sheet--tall",html:`${T("Ranking \xB7 semana de "+t((b.week||"").split("-").reverse().join("/")),{left:'<button class="btn-text" data-close>Fechar</button>'})}<div class="page page--sheet">
          ${b.error?`<p class="fhelp">${t(b.error)}</p>`:(b.rows||[]).map((m,S)=>`<div class="arow"><span>${S+1}. ${t(m.i)} \xB7 <small>${t(m.ws)}</small>${m.flag?`<br><small class="bad">\u26A0\uFE0F fora do ranking: ${t(m.flag.why)}</small>`:""}</span><b>${m.pts} pts</b></div>`).join("")||'<p class="fhelp">Ningu\xE9m pontuou esta semana.</p>'}
          <h4>Campe\xF5es (m\xEAs gr\xE1tis)</h4>${(b.winners||[]).map(m=>`<div class="arow"><span>${t(m.month)} \xB7 ${t(m.i)} <small>${t(m.ws)}</small></span><b>${m.applied?"cupom aplicado \u2713":"n\xE3o aplicado"}</b></div>`).join("")||'<p class="fhelp">Ainda nenhum.</p>'}</div>`})});let D=c.el.querySelector("[data-support-inbox]");D&&(D.onclick=async()=>(await import("./c-HA2GI5PU.js")).openSupportInbox()),c.el.querySelectorAll("[data-tab-admin]").forEach(d=>d.onclick=()=>{r=d.dataset.tabAdmin,c.set(p()),c.el.scrollTop=0}),c.el.querySelectorAll("[data-grant]").forEach(d=>d.onclick=async()=>{d.disabled=!0;try{let{api:b}=await import("./c-O3YSDJJ4.js"),m=d.dataset.dated?c.el.querySelector(`[data-until="${d.dataset.grant}"]`):null,S=m?new Date(m.value).getTime():0;if(m&&!(S>Date.now())){E("Escolha uma data e hora no futuro");return}let C=await b("/admin/grant",{uid:d.dataset.grant,on:d.dataset.on==="1",until:S});n[d.dataset.grant]=C.status,E(d.dataset.on!=="1"?"Acesso retirado":S?`Liberado at\xE9 ${N(S)} \u2713`:"Acesso cortesia liberado \u2713"),c.set(p())}catch(b){d.disabled=!1,E(b.message||"N\xE3o consegui agora.")}});let j=c.el.querySelector("[data-reload]");j&&(j.onclick=()=>z());let w=c.el.querySelector("[data-clear-errors]");w&&(w.onclick=async()=>{try{let{api:d}=await import("./c-O3YSDJJ4.js");s=(await d("/admin/errors",{clear:!0})).errors||[],c.set(p())}catch{E("N\xE3o consegui limpar agora.")}});let v=c.el.querySelector("[data-q]");v&&(v.oninput=()=>{l=v.value.trim().toLowerCase();let d=v.selectionStart;c.set(p());let b=c.el.querySelector("[data-q]");b.focus(),b.setSelectionRange(d,d)})}}),z=async()=>{try{a=(await M.backendApi.listStats()).map(la),i=null;try{let{api:c}=await import("./c-O3YSDJJ4.js");n=(await c("/billing/all",{})).byWs||{}}catch{n={}}try{let{api:c}=await import("./c-O3YSDJJ4.js");s=(await c("/admin/errors",{})).errors||[]}catch{s=null}}catch(c){i=/permission/i.test(String(c.code||c.message))?"Falta atualizar as regras do Firebase (bloco \u201Cstats\u201D).":"Verifique a internet e toque em Atualizar."}u.set(p())};return z(),u}var $a=()=>!!M.user&&!!x.adminEmail&&(M.user.email||"").toLowerCase()===x.adminEmail.toLowerCase();export{$a as isOwner,ga as openAdmin};
