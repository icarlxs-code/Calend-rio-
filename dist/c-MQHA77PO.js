import{m as z,o as U,p as E}from"./c-37XHBBFA.js";import{a as B,b as J,h as K}from"./c-ONIGGATC.js";import{f as M}from"./c-HBQGGPMI.js";import"./c-CID5JDJZ.js";import{a as q}from"./c-CIJP7VMQ.js";import{B as t,d as T,e as I}from"./c-YEARXB46.js";import{a as R}from"./c-T2S5JUFN.js";import"./c-U53RW4YL.js";import"./c-VHNSBD2M.js";var L=a=>!!a.online&&a.lastPing&&Date.now()-a.lastPing<15e4,O=a=>a?new Date(a).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):"\u2014",Q=a=>{if(!a)return"\u2014";let i=Math.round((Date.now()-a)/6e4);if(i<2)return"agora";if(i<60)return`h\xE1 ${i} min`;let o=Math.round(i/60);if(o<24)return`h\xE1 ${o}h`;let n=Math.round(o/24);return n===1?"ontem":`h\xE1 ${n} dias`},sa=a=>a?new Date(a).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric"}):"\u2014",ea={ios:"iPhone","ios-other":"iPhone (Chrome)",android:"Android",samsung:"Android (Samsung)",desktop:"Computador"},ta={granted:"ligadas",denied:"bloqueadas",default:"n\xE3o ativadas",unsupported:"n\xE3o suportadas"};function ia(a,i=44){let o=(a.name||a.email||"?").trim().charAt(0).toUpperCase();return`<span class="aface" style="--s:${i}px;background:${t(a.color||"#8E8E93")}">${a.photo?`<img src="${a.photo}" alt="">`:t(o)}</span>`}function oa(a){let i=T(),o=new Set(a.activeDays||[]);return Array.from({length:30},(n,l)=>I(i,l-29)).map(n=>`<i class="${o.has(n)?"on":""}" title="${n.split("-").reverse().join("/")}"></i>`).join("")}var v=()=>null,na=a=>a?a.plan==="comp"?`Liberado at\xE9 ${new Date(a.compUntil).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"})}`:a.comp?"Cortesia":{trial:"Teste gr\xE1tis",monthly:"Mensal",lifetime:"Vital\xEDcio",expired:"Teste acabou",blocked:"Sem plano",none:"Sem plano"}[a.plan]||"Conta pr\xF3pria":"Conta pr\xF3pria";function la(a,i){let o=a.counts||{},n=a.device||{},l=L(a),s=Math.max(a.lastPing||0,a.lastSeen||0);return`<div class="acct${i?" is-open":""}" data-uid="${t(a.uid)}">
    <button class="acct__top" data-toggle="${t(a.uid)}">
      ${ia(a)}
      <div class="acct__id"><strong>${t(a.name||"Sem nome")}${l?' <span class="adot" title="Usando agora"></span>':""}</strong><small>${t(a.email||"")}</small></div>
      <div class="acct__last"><b class="${l?"is-live":""}">${l?"no app agora":t(`saiu ${Q(s)}`)}</b><small>${a.workspace==="dupla"?"Dupla":a.workspace==="compartilhada"?"Convidado":na(v(a.uid))}${v(a.uid)?.addon?.active?` + ${v(a.uid).addon.plan==="equipe"?"Equipe":"Dupla"}`:""}</small></div>
    </button>
    ${a.profile?.done?`<div class="acct__prof">${q("idcard",13)} <b>${t(a.profile.profession||"\u2014")}</b>${a.profile.age?` \xB7 ${t(a.profile.age)} anos`:""} \xB7 \xEDndice ${a.profile.index}/100</div>`:a.workspace!=="dupla"?`<div class="acct__prof is-off">${q("idcard",13)} Ficha n\xE3o preenchida</div>`:""}
    <div class="acct__chips">
      <span>${q("building",12)} ${o.companies||0} grupos</span>
      <span>${q("calendar",12)} ${o.myEvents||0} eventos</span>
      <span>${q("heart",12)} ${o.personal||0} pessoais</span>
      <span class="${n.notifications==="granted"&&n.registered?"ok":"warn"}">${q("bell",12)} ${n.notifications==="granted"&&n.registered?"avisos ok":"sem avisos"}</span>
    </div>
    ${i?`<div class="acct__more">
      <div class="agrid">
        <div><small>Conta criada</small><b>${t(sa(a.createdAt))}</b></div>
        <div><small>Agora</small><b>${l?"\u{1F7E2} Com o app aberto":"\u26AA App fechado"}</b></div>
        <div><small>\xDAltima vez que entrou</small><b>${t(O(a.lastOpen||a.lastSeen))}</b></div>
        <div><small>Saiu do app</small><b>${l?"\u2014":t(O(a.closedAt||s))}</b></div>
        <div><small>Vezes que abriu</small><b>${a.opens||0}</b></div>
        <div><small>Dias ativos (30 dias)</small><b>${(a.activeDays||[]).filter(r=>r>=I(T(),-29)).length}</b></div>
        <div><small>Aparelho</small><b>${t(ea[n.platform]||"\u2014")}</b></div>
        <div><small>Instalado na tela inicial</small><b>${n.installed?"Sim":"N\xE3o"}</b></div>
        <div><small>Notifica\xE7\xF5es</small><b>${t(ta[n.notifications]||"\u2014")}${n.registered?" \xB7 cadastrado":""}</b></div>
        <div><small>\xDAltimo modo usado</small><b>${a.space==="personal"?"Pessoal":"Trabalho"}</b></div>
      </div>
      ${a.profile?.done?`<h4>Ficha</h4>
      <div class="agrid">
        <div><small>Profiss\xE3o</small><b>${t(a.profile.profession||"\u2014")}</b></div>
        <div><small>\xC1rea</small><b>${t(a.profile.area||"\u2014")}</b></div>
        <div><small>Idade</small><b>${t(a.profile.age||"\u2014")}</b></div>
        <div><small>\xCDndice de esquecimento</small><b>${a.profile.index}/100 (marcou ${a.profile.forget}/5)</b></div>
        <div><small>Jornada</small><b>${t(J.find(r=>r.id===a.profile.journey)?.label||"\u2014")}</b></div>
        <div><small>Objetivo</small><b>${t(K.find(r=>r.id===a.profile.goal)?.label||"\u2014")}</b></div>
      </div>
      ${(a.profile.difficulties||[]).length?`<div class="adiffs">${a.profile.difficulties.map(r=>`<span>${t(B.find(p=>p.id===r)?.label||r)}</span>`).join("")}</div>`:""}`:""}
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
      <div class="adays">${oa(a)}</div>
      ${a.workspace==="proprio"?`<h4>Acesso</h4>
      ${v(a.uid)?.plan==="comp"?`<p class="fhelp">\u2705 Liberado at\xE9 <b>${t(O(v(a.uid).compUntil))}</b>. Depois disso a pessoa precisa assinar.</p>`:""}
      ${v(a.uid)?.comp&&v(a.uid)?.plan!=="comp"?`<button class="btn btn--soft btn--block" data-grant="${t(a.uid)}" data-on="0">Tirar o acesso cortesia</button>`:v(a.uid)?.plan==="lifetime"||v(a.uid)?.plan==="monthly"?'<p class="fhelp">Conta paga.</p>':`<div class="grantbox">
              <label class="fhelp">Liberar tudo, sem pagar, at\xE9:</label>
              <input type="datetime-local" class="input" data-until="${t(a.uid)}" value="${(()=>{let r=new Date(Date.now()+6048e5);return r.setMinutes(r.getMinutes()-r.getTimezoneOffset()),r.toISOString().slice(0,16)})()}">
              <button class="btn btn--primary btn--block" data-grant="${t(a.uid)}" data-on="1" data-dated="1">${v(a.uid)?.plan==="comp"?"Mudar a data":"Liberar at\xE9 essa data"}</button>
              ${v(a.uid)?.plan==="comp"?`<button class="btn btn--soft btn--block" data-grant="${t(a.uid)}" data-on="0">Tirar o acesso agora</button>`:""}
              <button class="btn-text btn--block" data-grant="${t(a.uid)}" data-on="1">Liberar para sempre (cortesia: revisor da loja, parceiro)</button>
            </div>`}`:""}
    </div>`:""}
  </div>`}function ra(a){let i=a.map(s=>s.profile).filter(s=>s&&s.done);if(!i.length)return"";let o=(s,r=5)=>Object.entries(s.reduce((p,u)=>(u&&(p[u]=(p[u]||0)+1),p),{})).sort((p,u)=>u[1]-p[1]).slice(0,r),n=([s,r],p=s)=>`<li><span>${t(p)}</span><i style="--w:${Math.round(r/i.length*100)}%"></i><b>${r}</b></li>`,l=Math.round(i.reduce((s,r)=>s+(r.index||0),0)/i.length);return`<div class="ainsights">
    <div class="ainsights__head"><b>${i.length} ficha${i.length>1?"s":""} preenchida${i.length>1?"s":""}</b><small>\xEDndice m\xE9dio de esquecimento ${l}/100</small></div>
    <h4>Profiss\xF5es</h4><ul class="abars">${o(i.map(s=>s.profession)).map(s=>n(s)).join("")}</ul>
    <h4>\xC1reas</h4><ul class="abars">${o(i.map(s=>s.area)).map(s=>n(s)).join("")}</ul>
    <h4>Maiores dificuldades</h4><ul class="abars">${o(i.flatMap(s=>s.difficulties||[])).map(s=>n(s,B.find(r=>r.id===s[0])?.label||s[0])).join("")}</ul>
  </div>`}function da(a){let i=a.filter(l=>l.workspace==="proprio");if(!i.length)return"";let o={};for(let l of i){let s=l.origin||{},r=s.source?`${s.source}${s.campaign?" \xB7 "+s.campaign:""}`:"direto / sem marca\xE7\xE3o",p=v(l.uid),u=o[r]=o[r]||{n:0,paid:0,trial:0};u.n++,p&&(p.plan==="monthly"||p.plan==="lifetime"&&!p.comp)&&u.paid++,p&&p.plan==="trial"&&u.trial++}return`<h3 class="ah">De onde vieram</h3>
  <div class="agroup">${Object.entries(o).sort((l,s)=>s[1].n-l[1].n).slice(0,12).map(([l,s])=>`<div class="arow"><span>${t(l)}<small>${s.trial} em teste \xB7 ${s.paid} pagaram${s.n?` \xB7 ${Math.round(s.paid/s.n*100)}%`:""}</small></span><b>${s.n}</b></div>`).join("")}</div>
  <p class="fhelp">Use links com marca\xE7\xE3o nos an\xFAncios, ex.: <b>\u2026/conheca/?utm_source=instagram&amp;utm_campaign=dentistas</b>, para saber qual an\xFAncio traz quem paga.</p>`}function ca(a){return a===null?"":`<section class="block">
    ${a.length?`<div class="aerrs">${a.slice(0,40).map(i=>`<div class="aerr">
        <div class="aerr__top"><b>${t(i.msg)}</b><span>${i.count}\xD7</span></div>
        <small>${t(i.where||"\u2014")} \xB7 ${t(i.dev||"")} \xB7 vers\xE3o ${t(i.ver||"?")} \xB7 ${(i.users||[]).length} pessoa${(i.users||[]).length===1?"":"s"} \xB7 \xFAltimo ${t(Q(i.last))}</small>
      </div>`).join("")}</div>
      <button class="btn btn--soft btn--sm" data-clear-errors>Limpar a lista (depois de corrigir)</button>`:'<p class="fhelp">Nenhum erro registrado. \u{1F389} Quando algo der errado no celular de algu\xE9m, aparece aqui.</p>'}
  </section>`}var w=a=>Number.isFinite(Number(a))?Number(a):0,b=(a,i=120)=>typeof a=="string"?a.slice(0,i):"";function pa(a){let i=a.counts||{},o=a.device||{},n=a.profile||{};return{uid:b(a.uid,64),name:b(a.name,60),email:b(a.email,120),workspace:b(a.workspace,20),space:b(a.space,20),photo:typeof a.photo=="string"&&/^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(a.photo)?a.photo:null,color:/^#[0-9a-fA-F]{6}$/.test(a.color||"")?a.color:"#8E8E93",createdAt:w(a.createdAt),lastSeen:w(a.lastSeen),opens:w(a.opens),online:!!a.online,lastPing:w(a.lastPing),lastOpen:w(a.lastOpen),closedAt:w(a.closedAt),activeDays:Array.isArray(a.activeDays)?a.activeDays.filter(l=>/^\d{4}-\d{2}-\d{2}$/.test(l)).slice(-40):[],counts:Object.fromEntries(["companies","events","myEvents","thisWeek","done30","late","posts30","notes","personal","lists","birthdays"].map(l=>[l,w(i[l])])),device:{platform:b(o.platform,20),installed:!!o.installed,notifications:b(o.notifications,20),registered:!!o.registered},origin:a.origin&&typeof a.origin=="object"?{source:b(a.origin.source,60),medium:b(a.origin.medium,60),campaign:b(a.origin.campaign,60)}:null,profile:n.done?{done:!0,profession:b(n.profession,80),area:b(n.area,80),age:b(n.age,10),index:w(n.index),forget:w(n.forget),difficulties:Array.isArray(n.difficulties)?n.difficulties.filter(l=>typeof l=="string").slice(0,12).map(l=>l.slice(0,30)):[],goal:b(n.goal,30),journey:b(n.journey,30)}:{done:!1}}}async function va(){let a=null,i=null,o=null,n="",l={},s=null,r="resumo",p=()=>{let d=U("Painel do dono",{right:'<button class="btn-text" data-reload>Atualizar</button>'});if(i)return`${d}<div class="page page--sheet"><div class="empty"><h3>N\xE3o consegui carregar</h3><p>${t(i)}</p></div></div>`;if(!a)return`${d}<div class="page page--sheet"><p class="fhelp">Carregando\u2026</p></div>`;let A=Date.now(),j=e=>a.filter(m=>m.lastSeen&&A-m.lastSeen<e*864e5).length,D=a.filter(e=>e.createdAt&&A-e.createdAt<7*864e5).length;v=e=>l[e]||null;let k=Object.values(l),f=k.filter(e=>e.plan==="monthly").length,c=k.filter(e=>e.plan==="lifetime"&&!e.comp).length,h=k.filter(e=>e.plan==="trial").length,g=k.filter(e=>e.addon&&e.addon.active),S=f*9.9+g.reduce((e,m)=>e+(m.addon.plan==="equipe"?m.plan==="lifetime"?9.9:14.9:m.plan==="lifetime"?4.9:6.9),0),N=k.filter(e=>e.plan!=="none"&&e.plan!=="team").length,Z=N?Math.round((f+c)/N*100):0,H=e=>`R$ ${e.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}`,y=(e,m,$="")=>`<div class="arow"><span>${e}${$?`<small>${$}</small>`:""}</span><b>${m}</b></div>`,W=a.filter(e=>e.device?.installed).length,x=a.filter(e=>e.device?.notifications==="granted"&&e.device?.registered).length,G=e=>a.length?` \xB7 ${Math.round(e/a.length*100)}%`:"",X=`<div class="aseg" role="tablist">${[["resumo","Resumo"],["pessoas",`Pessoas \xB7 ${a.length}`],["ranking","\u{1F3C6} Ranking"],["erros",`Erros${s&&s.length?` \xB7 ${s.length}`:""}`]].map(([e,m])=>`<button role="tab" class="${r===e?"is-on":""}" data-tab-admin="${e}">${m}</button>`).join("")}</div>`,C="";if(r==="resumo")C=`
      <div class="ahero">
        <small>Receita por m\xEAs</small>
        <b>${H(S)}</b>
        <span>${f} ${f===1?"assinante mensal":"assinantes mensais"} \xB7 ${g.length} agenda${g.length===1?"":"s"} compartilhada${g.length===1?"":"s"}</span>
      </div>
      <div class="atiles">
        <div><b>${j(1)}</b><small>ativas hoje</small></div>
        <div><b>${f+c}</b><small>pagantes</small></div>
        <div><b>${h}</b><small>em teste</small></div>
      </div>
      <h3 class="ah">Dinheiro</h3>
      <div class="agroup">
        ${y("Vital\xEDcios vendidos",`${c}`,`${H(c*150)} no total`)}
        ${y("Assinantes do Mensal",`${f}`)}
        ${y("Agendas compartilhadas",`${g.length}`,`${g.filter(e=>e.addon.plan==="equipe").length} Equipe \xB7 ${g.filter(e=>e.addon.plan==="dupla").length} Dupla`)}
        ${y("Convers\xE3o do teste",`${Z}%`,"quem pagou \xF7 quem testou")}
      </div>
      <h3 class="ah">Pessoas</h3>
      <div class="agroup">
        ${y("Contas",`${a.length}`,`${D} nova${D===1?"":"s"} nos \xFAltimos 7 dias`)}
        ${y("No app agora",`${a.filter(L).length}`)}
        ${y("Ativas na semana",`${j(7)}`)}
        ${y("Convidados (agenda de outra pessoa)",`${a.filter(e=>e.workspace==="compartilhada").length}`)}
      </div>
      <h3 class="ah">Sa\xFAde do app</h3>
      <div class="agroup">
        ${y("Instalaram na tela inicial",`${W}${G(W)}`)}
        ${y("Recebem notifica\xE7\xF5es",`${x}${G(x)}`,x<a.length?"sem isso, os lembretes n\xE3o chegam":"")}
        ${y("Compromissos criados",`${a.reduce((e,m)=>e+(m.counts?.myEvents||0),0)}`)}
        <button class="arow arow--btn" data-rank-admin><span>\u{1F3C6} Ranking (pontos e suspeitas)</span><b>abrir \u203A</b></button>
        <button class="arow arow--btn" data-support-inbox><span>\u{1F4AC} Mensagens de suporte</span><b>abrir \u203A</b></button>
        <button class="arow arow--btn" data-tab-admin="erros"><span>Erros do app</span><b class="${s&&s.length?"bad":"good"}">${s===null?"\u2014":s.length?`${s.length} \u203A`:"nenhum \u2713"}</b></button>
      </div>
      ${da(a)}
      ${ra(a)}`;else if(r==="pessoas"){let e=a.filter(m=>!n||`${m.name} ${m.email} ${m.profile?.profession||""}`.toLowerCase().includes(n)).sort((m,$)=>L($)-L(m)||Math.max($.lastPing||0,$.lastSeen||0)-Math.max(m.lastPing||0,m.lastSeen||0));C=`<input class="input" type="search" placeholder="Buscar por nome, e-mail ou profiss\xE3o" data-q value="${t(n)}">
      <div class="accts">${e.map(m=>la(m,m.uid===o)).join("")||'<p class="fhelp">Nenhuma conta encontrada.</p>'}</div>
      <p class="fhelp">Toque numa conta para ver os detalhes. Aparecem aqui as contas que j\xE1 abriram o app atualizado.</p>`}else if(r==="ranking"){let e=u,m=$=>($||"").split("-").reverse().join("/");C=e?e.error?`<p class="fhelp">N\xE3o consegui ler o ranking: ${t(e.error)}</p>`:`
      <h3 class="ah">Semana de ${t(m(e.week))}</h3>
      <div class="agroup">${(e.rows||[]).length?e.rows.map(($,F)=>{let _=a.find(aa=>aa.uid===$.ws);return`<div class="arow"><span><b>${$.flag?"\u2014":F+1+"\xBA"}</b> ${t(_?.name||$.i)} <small>${t(_?.email||$.ws)}</small>${$.flag?`<br><small class="bad">\u26A0\uFE0F fora do ranking: ${t($.flag.why)}</small>`:""}</span><b>${$.pts} pts</b></div>`}).join(""):'<p class="fhelp" style="padding:12px 16px">Ningu\xE9m pontuou esta semana ainda. S\xF3 contas no plano mensal participam.</p>'}</div>
      <h3 class="ah">Campe\xF5es do m\xEAs (m\xEAs gr\xE1tis)</h3>
      <div class="agroup">${(e.winners||[]).length?e.winners.map($=>{let F=a.find(_=>_.uid===$.ws);return`<div class="arow"><span>${t($.month.split("-").reverse().join("/"))} \xB7 ${t(F?.name||$.i)} <small>${$.pts} pts</small></span><b class="${$.applied?"good":"bad"}">${$.applied?"cupom aplicado \u2713":"cupom n\xE3o aplicado"}</b></div>`}).join(""):'<p class="fhelp" style="padding:12px 16px">Ainda nenhum campe\xE3o. O pr\xEAmio \xE9 calculado no dia 1\xBA de cada m\xEAs.</p>'}</div>
      <p class="fhelp">Aqui voc\xEA v\xEA nome e e-mail. Os participantes s\xF3 veem a inicial uns dos outros.</p>`:'<p class="fhelp">Carregando o ranking\u2026</p>',u||Y()}else C=ca(s)||'<p class="fhelp">N\xE3o consegui ler os erros agora.</p>';return`${d}<div class="page page--sheet apanel">${X}${C}</div>`},u=null,Y=async()=>{let{api:d}=await import("./c-AT2QKSZ7.js");u=await d("/rank/admin",{}).catch(A=>({error:A.message})),r==="ranking"&&P.set(p())},P=z({className:"sheet--tall",html:p(),onMount:d=>{d.el.querySelectorAll("[data-toggle]").forEach(c=>c.onclick=()=>{o=o===c.dataset.toggle?null:c.dataset.toggle,d.set(p())});let A=d.el.querySelector("[data-rank-admin]");A&&(A.onclick=async()=>{let{api:c}=await import("./c-AT2QKSZ7.js"),h=await c("/rank/admin",{}).catch(g=>({error:g.message}));z({className:"sheet--tall",html:`${U("Ranking \xB7 semana de "+t((h.week||"").split("-").reverse().join("/")),{left:'<button class="btn-text" data-close>Fechar</button>'})}<div class="page page--sheet">
          ${h.error?`<p class="fhelp">${t(h.error)}</p>`:(h.rows||[]).map((g,S)=>`<div class="arow"><span>${S+1}. ${t(g.i)} \xB7 <small>${t(g.ws)}</small>${g.flag?`<br><small class="bad">\u26A0\uFE0F fora do ranking: ${t(g.flag.why)}</small>`:""}</span><b>${g.pts} pts</b></div>`).join("")||'<p class="fhelp">Ningu\xE9m pontuou esta semana.</p>'}
          <h4>Campe\xF5es (m\xEAs gr\xE1tis)</h4>${(h.winners||[]).map(g=>`<div class="arow"><span>${t(g.month)} \xB7 ${t(g.i)} <small>${t(g.ws)}</small></span><b>${g.applied?"cupom aplicado \u2713":"n\xE3o aplicado"}</b></div>`).join("")||'<p class="fhelp">Ainda nenhum.</p>'}</div>`})});let j=d.el.querySelector("[data-support-inbox]");j&&(j.onclick=async()=>(await import("./c-B7Q3BCPY.js")).openSupportInbox()),d.el.querySelectorAll("[data-tab-admin]").forEach(c=>c.onclick=()=>{r=c.dataset.tabAdmin,d.set(p()),d.el.scrollTop=0}),d.el.querySelectorAll("[data-grant]").forEach(c=>c.onclick=async()=>{c.disabled=!0;try{let{api:h}=await import("./c-AT2QKSZ7.js"),g=c.dataset.dated?d.el.querySelector(`[data-until="${c.dataset.grant}"]`):null,S=g?new Date(g.value).getTime():0;if(g&&!(S>Date.now())){E("Escolha uma data e hora no futuro");return}let N=await h("/admin/grant",{uid:c.dataset.grant,on:c.dataset.on==="1",until:S});l[c.dataset.grant]=N.status,E(c.dataset.on!=="1"?"Acesso retirado":S?`Liberado at\xE9 ${O(S)} \u2713`:"Acesso cortesia liberado \u2713"),d.set(p())}catch(h){c.disabled=!1,E(h.message||"N\xE3o consegui agora.")}});let D=d.el.querySelector("[data-reload]");D&&(D.onclick=()=>V());let k=d.el.querySelector("[data-clear-errors]");k&&(k.onclick=async()=>{try{let{api:c}=await import("./c-AT2QKSZ7.js");s=(await c("/admin/errors",{clear:!0})).errors||[],d.set(p())}catch{E("N\xE3o consegui limpar agora.")}});let f=d.el.querySelector("[data-q]");f&&(f.oninput=()=>{n=f.value.trim().toLowerCase();let c=f.selectionStart;d.set(p());let h=d.el.querySelector("[data-q]");h.focus(),h.setSelectionRange(c,c)})}}),V=async()=>{try{a=(await M.backendApi.listStats()).map(pa),i=null;try{let{api:d}=await import("./c-AT2QKSZ7.js");l=(await d("/billing/all",{})).byWs||{}}catch{l={}}try{let{api:d}=await import("./c-AT2QKSZ7.js");s=(await d("/admin/errors",{})).errors||[]}catch{s=null}}catch(d){i=/permission/i.test(String(d.code||d.message))?"Falta atualizar as regras do Firebase (bloco \u201Cstats\u201D).":"Verifique a internet e toque em Atualizar."}P.set(p())};return V(),P}var fa=()=>!!M.user&&!!R.adminEmail&&(M.user.email||"").toLowerCase()===R.adminEmail.toLowerCase();export{fa as isOwner,va as openAdmin};
