import{o as U,q as B,r as N,s as X}from"./c-AVUI3KSM.js";import{a as W,b as Y,h as Z}from"./c-FQJ5CCBF.js";import{b as q}from"./c-M4BGKEOZ.js";import{f as z}from"./c-R5QRQMLI.js";import{B as s,d as V,e as I}from"./c-ZUAJ4OTH.js";import{a as T}from"./c-PVDXWGYP.js";import"./c-ZL5OENJV.js";import"./c-LQRWGXTC.js";import"./c-I6N4A566.js";var _=a=>!!a.online&&a.lastPing&&Date.now()-a.lastPing<15e4,E=a=>a?new Date(a).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):"\u2014",aa=a=>{if(!a)return"\u2014";let i=Math.round((Date.now()-a)/6e4);if(i<2)return"agora";if(i<60)return`h\xE1 ${i} min`;let l=Math.round(i/60);if(l<24)return`h\xE1 ${l}h`;let n=Math.round(l/24);return n===1?"ontem":`h\xE1 ${n} dias`},oa=a=>a?new Date(a).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric"}):"\u2014",na={ios:"iPhone","ios-other":"iPhone (Chrome)",android:"Android",samsung:"Android (Samsung)",desktop:"Computador"},ra={granted:"ligadas",denied:"bloqueadas",default:"n\xE3o ativadas",unsupported:"n\xE3o suportadas"};function da(a,i=44){let l=(a.name||a.email||"?").trim().charAt(0).toUpperCase();return`<span class="aface" style="--s:${i}px;background:${s(a.color||"#8E8E93")}">${a.photo?`<img src="${a.photo}" alt="">`:s(l)}</span>`}function ca(a){let i=V(),l=new Set(a.activeDays||[]);return Array.from({length:30},(n,o)=>I(i,o-29)).map(n=>`<i class="${l.has(n)?"on":""}" title="${n.split("-").reverse().join("/")}"></i>`).join("")}var h=()=>null,pa=a=>a?a.plan==="comp"?`Liberado at\xE9 ${new Date(a.compUntil).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"})}`:a.vip?`Vital\xEDcio N\xBA ${String(a.vip.no).padStart(3,"0")}`:a.comp?"Cortesia":{trial:"Teste gr\xE1tis",monthly:"Mensal",lifetime:"Vital\xEDcio",expired:"Teste acabou",blocked:"Sem plano",none:"Sem plano"}[a.plan]||"Conta pr\xF3pria":"Conta pr\xF3pria",k=null,ma=(a,i)=>{let l=String(a||"0").split(".").map(Number),n=String(i||"0").split(".").map(Number);for(let o=0;o<3;o++)if((l[o]||0)!==(n[o]||0))return(l[o]||0)>(n[o]||0)?1:-1;return 0},C=a=>a.app?k?a.app.b===k.build||ma(a.app.v,k.version)>=0?{cls:"ok",label:`v${a.app.v} \u2713`,long:`v${a.app.v} (${a.app.b}) \u2014 a mais recente`,ok:!0}:{cls:"warn",label:`v${a.app.v} \xB7 desatualizada`,long:`v${a.app.v} (${a.app.b}) \u2014 a \xFAltima \xE9 a v${k.version}`,ok:!1}:{cls:"",label:`v${a.app.v}`,long:`v${a.app.v}`,ok:!0}:{cls:"warn",label:"vers\xE3o antiga",long:"Antes da 2.0.0 (ainda n\xE3o abriu o app atualizado)",ok:!1};function ga(a,i){let l=a.counts||{},n=a.device||{},o=_(a),t=Math.max(a.lastPing||0,a.lastSeen||0);return`<div class="acct${i?" is-open":""}" data-uid="${s(a.uid)}">
    <button class="acct__top" data-toggle="${s(a.uid)}">
      ${da(a)}
      <div class="acct__id"><strong>${s(a.name||"Sem nome")}${o?' <span class="adot" title="Usando agora"></span>':""}</strong><small>${s(a.email||"")}</small></div>
      <div class="acct__last"><b class="${o?"is-live":""}">${o?"no app agora":s(`saiu ${aa(t)}`)}</b><small>${a.workspace==="dupla"?"Dupla":a.workspace==="compartilhada"?"Convidado":pa(h(a.uid))}${h(a.uid)?.addon?.active?` + ${h(a.uid).addon.plan==="equipe"?"Equipe":"Dupla"}`:""}</small></div>
    </button>
    ${a.profile?.done?`<div class="acct__prof">${q("idcard",13)} <b>${s(a.profile.profession||"\u2014")}</b>${a.profile.age?` \xB7 ${s(a.profile.age)} anos`:""} \xB7 \xEDndice ${a.profile.index}/100</div>`:a.workspace!=="dupla"?`<div class="acct__prof is-off">${q("idcard",13)} Ficha n\xE3o preenchida</div>`:""}
    <div class="acct__chips">
      <span>${q("building",12)} ${l.companies||0} grupos</span>
      <span>${q("calendar",12)} ${l.myEvents||0} eventos</span>
      <span>${q("heart",12)} ${l.personal||0} pessoais</span>
      <span class="${n.notifications==="granted"&&n.registered?"ok":"warn"}">${q("bell",12)} ${n.notifications==="granted"&&n.registered?"avisos ok":"sem avisos"}</span>
      <span class="${C(a).cls}">${q("refresh",12)} ${s(C(a).label)}</span>
      ${a.game?`<span>${q("trophy",12)} n\xEDvel ${a.game.level}</span>`:""}
    </div>
    ${i?`<div class="acct__more">
      <div class="agrid">
        <div><small>Conta criada</small><b>${s(oa(a.createdAt))}</b></div>
        <div><small>Agora</small><b>${o?"\u{1F7E2} Com o app aberto":"\u26AA App fechado"}</b></div>
        <div><small>\xDAltima vez que entrou</small><b>${s(E(a.lastOpen||a.lastSeen))}</b></div>
        <div><small>Saiu do app</small><b>${o?"\u2014":s(E(a.closedAt||t))}</b></div>
        <div><small>Vezes que abriu</small><b>${a.opens||0}</b></div>
        <div><small>Dias ativos (30 dias)</small><b>${(a.activeDays||[]).filter(d=>d>=I(V(),-29)).length}</b></div>
        <div><small>Aparelho</small><b>${s(na[n.platform]||"\u2014")}</b></div>
        <div><small>Instalado na tela inicial</small><b>${n.installed?"Sim":"N\xE3o"}</b></div>
        <div><small>Notifica\xE7\xF5es</small><b>${s(ra[n.notifications]||"\u2014")}${n.registered?" \xB7 cadastrado":""}</b></div>
        <div><small>\xDAltimo modo usado</small><b>${a.space==="personal"?"Pessoal":"Trabalho"}</b></div>
        <div><small>Vers\xE3o do app</small><b class="${C(a).ok?"good":"bad"}">${s(C(a).long)}</b></div>
        <div><small>Recebeu esta vers\xE3o</small><b>${a.app?.since?s(E(a.app.since)):"\u2014"}</b></div>
        ${a.game?`<div><small>Conquistas</small><b>N\xEDvel ${a.game.level} \xB7 ${a.game.xp.toLocaleString("pt-BR")} XP \xB7 ${a.game.badges} emblemas</b></div>`:""}
      </div>
      ${C(a).ok?"":`<div class="aupd"><p>${a.lastOpen&&k?.builtAt&&a.lastOpen<Date.parse(k.builtAt)?"Ainda n\xE3o abriu o app desde a atualiza\xE7\xE3o: ela chega sozinha na pr\xF3xima vez que abrir.":"Abriu o app mas continua na vers\xE3o antiga (celular guardou a vers\xE3o velha)."}</p>
        <button class="btn btn--soft btn--sm" data-nudge-upd="${s(a.uid)}" data-email="${s(a.email)}">${q("bell",14)} Pedir para atualizar</button></div>`}
      ${a.profile?.done?`<h4>Ficha</h4>
      <div class="agrid">
        <div><small>Profiss\xE3o</small><b>${s(a.profile.profession||"\u2014")}</b></div>
        <div><small>\xC1rea</small><b>${s(a.profile.area||"\u2014")}</b></div>
        <div><small>Idade</small><b>${s(a.profile.age||"\u2014")}</b></div>
        <div><small>\xCDndice de esquecimento</small><b>${a.profile.index}/100 (marcou ${a.profile.forget}/5)</b></div>
        <div><small>Jornada</small><b>${s(Y.find(d=>d.id===a.profile.journey)?.label||"\u2014")}</b></div>
        <div><small>Objetivo</small><b>${s(Z.find(d=>d.id===a.profile.goal)?.label||"\u2014")}</b></div>
      </div>
      ${(a.profile.difficulties||[]).length?`<div class="adiffs">${a.profile.difficulties.map(d=>`<span>${s(W.find(m=>m.id===d)?.label||d)}</span>`).join("")}</div>`:""}`:""}
      <h4>Trabalho</h4>
      <div class="agrid">
        <div><small>Empresas / grupos</small><b>${l.companies||0}</b></div>
        <div><small>Eventos (total no espa\xE7o)</small><b>${l.events||0}</b></div>
        <div><small>Cadastrados pela pessoa</small><b>${l.myEvents||0}</b></div>
        <div><small>Pr\xF3ximos 7 dias</small><b>${l.thisWeek||0}</b></div>
        <div><small>Posts (30 dias)</small><b>${l.posts30||0}</b></div>
        <div><small>Feitos (30 dias)</small><b>${l.done30||0}</b></div>
        <div><small>Atrasados (30 dias)</small><b class="${l.late?"bad":""}">${l.late||0}</b></div>
        <div><small>Bilhetes</small><b>${l.notes||0}</b></div>
      </div>
      <h4>Pessoal <small>(s\xF3 quantidade; o conte\xFAdo \xE9 privado)</small></h4>
      <div class="agrid">
        <div><small>Anota\xE7\xF5es</small><b>${l.personal||0}</b></div>
        <div><small>Listas</small><b>${l.lists||0}</b></div>
        <div><small>Anivers\xE1rios</small><b>${l.birthdays||0}</b></div>
      </div>
      <h4>Uso nos \xFAltimos 30 dias</h4>
      <div class="adays">${ca(a)}</div>
      ${a.workspace==="proprio"?`<h4>Acesso</h4>
      ${h(a.uid)?.plan==="comp"?`<p class="fhelp">\u2705 Liberado at\xE9 <b>${s(E(h(a.uid).compUntil))}</b>. Depois disso a pessoa precisa assinar.</p>`:""}
      ${h(a.uid)?.vip?`<p class="fhelp">\u{1F451} Vital\xEDcio: membro <b>N\xBA ${String(h(a.uid).vip.no).padStart(3,"0")}</b> desde ${s(E(h(a.uid).vip.at))}.</p>`:""}
      ${h(a.uid)?.comp&&h(a.uid)?.plan!=="comp"?`<button class="btn btn--soft btn--block" data-grant="${s(a.uid)}" data-on="0">${h(a.uid)?.vip?"Tirar o acesso vital\xEDcio":"Tirar o acesso cortesia"}</button>`:h(a.uid)?.plan==="lifetime"||h(a.uid)?.plan==="monthly"?'<p class="fhelp">Conta paga.</p>':`<div class="grantbox">
              <button class="btn btn--primary btn--block" data-grant="${s(a.uid)}" data-on="1" data-vip="1">\u{1F451} Dar acesso vital\xEDcio</button>
              <p class="fhelp">A pessoa recebe um aviso no celular e, ao abrir o app, v\xEA a surpresa: cart\xE3o de membro com n\xFAmero \xFAnico, emblema lend\xE1rio e anel na foto.</p>
              <label class="fhelp">Ou liberar tudo, sem pagar, s\xF3 at\xE9:</label>
              <input type="datetime-local" class="input" data-until="${s(a.uid)}" value="${(()=>{let d=new Date(Date.now()+6048e5);return d.setMinutes(d.getMinutes()-d.getTimezoneOffset()),d.toISOString().slice(0,16)})()}">
              <button class="btn btn--primary btn--block" data-grant="${s(a.uid)}" data-on="1" data-dated="1">${h(a.uid)?.plan==="comp"?"Mudar a data":"Liberar at\xE9 essa data"}</button>
              ${h(a.uid)?.plan==="comp"?`<button class="btn btn--soft btn--block" data-grant="${s(a.uid)}" data-on="0">Tirar o acesso agora</button>`:""}
            </div>`}`:""}
    </div>`:""}
  </div>`}function $a(a){let i=a.map(t=>t.profile).filter(t=>t&&t.done);if(!i.length)return"";let l=(t,d=5)=>Object.entries(t.reduce((m,f)=>(f&&(m[f]=(m[f]||0)+1),m),{})).sort((m,f)=>f[1]-m[1]).slice(0,d),n=([t,d],m=t)=>`<li><span>${s(m)}</span><i style="--w:${Math.round(d/i.length*100)}%"></i><b>${d}</b></li>`,o=Math.round(i.reduce((t,d)=>t+(d.index||0),0)/i.length);return`<div class="ainsights">
    <div class="ainsights__head"><b>${i.length} ficha${i.length>1?"s":""} preenchida${i.length>1?"s":""}</b><small>\xEDndice m\xE9dio de esquecimento ${o}/100</small></div>
    <h4>Profiss\xF5es</h4><ul class="abars">${l(i.map(t=>t.profession)).map(t=>n(t)).join("")}</ul>
    <h4>\xC1reas</h4><ul class="abars">${l(i.map(t=>t.area)).map(t=>n(t)).join("")}</ul>
    <h4>Maiores dificuldades</h4><ul class="abars">${l(i.flatMap(t=>t.difficulties||[])).map(t=>n(t,W.find(d=>d.id===t[0])?.label||t[0])).join("")}</ul>
  </div>`}function va(a){let i=a.filter(o=>o.workspace==="proprio");if(!i.length)return"";let l={};for(let o of i){let t=o.origin||{},d=t.source?`${t.source}${t.campaign?" \xB7 "+t.campaign:""}`:"direto / sem marca\xE7\xE3o",m=h(o.uid),f=l[d]=l[d]||{n:0,paid:0,trial:0};f.n++,m&&(m.plan==="monthly"||m.plan==="lifetime"&&!m.comp)&&f.paid++,m&&m.plan==="trial"&&f.trial++}return`<h3 class="ah">De onde vieram</h3>
  <div class="agroup">${Object.entries(l).sort((o,t)=>t[1].n-o[1].n).slice(0,12).map(([o,t])=>`<div class="arow"><span>${s(o)}<small>${t.trial} em teste \xB7 ${t.paid} pagaram${t.n?` \xB7 ${Math.round(t.paid/t.n*100)}%`:""}</small></span><b>${t.n}</b></div>`).join("")}</div>
  <p class="fhelp">Use links com marca\xE7\xE3o nos an\xFAncios, ex.: <b>\u2026/conheca/?utm_source=instagram&amp;utm_campaign=dentistas</b>, para saber qual an\xFAncio traz quem paga.</p>`}function ba(a){return a===null?"":`<section class="block">
    ${a.length?`<div class="aerrs">${a.slice(0,40).map(i=>`<div class="aerr">
        <div class="aerr__top"><b>${s(i.msg)}</b><span>${i.count}\xD7</span></div>
        <small>${s(i.where||"\u2014")} \xB7 ${s(i.dev||"")} \xB7 vers\xE3o ${s(i.ver||"?")} \xB7 ${(i.users||[]).length} pessoa${(i.users||[]).length===1?"":"s"} \xB7 \xFAltimo ${s(aa(i.last))}</small>
      </div>`).join("")}</div>
      <button class="btn btn--soft btn--sm" data-clear-errors>Limpar a lista (depois de corrigir)</button>`:'<p class="fhelp">Nenhum erro registrado. \u{1F389} Quando algo der errado no celular de algu\xE9m, aparece aqui.</p>'}
  </section>`}var w=a=>Number.isFinite(Number(a))?Number(a):0,b=(a,i=120)=>typeof a=="string"?a.slice(0,i):"";function ha(a){let i=a.counts||{},l=a.device||{},n=a.profile||{};return{uid:b(a.uid,64),name:b(a.name,60),email:b(a.email,120),workspace:b(a.workspace,20),space:b(a.space,20),photo:typeof a.photo=="string"&&/^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(a.photo)?a.photo:null,color:/^#[0-9a-fA-F]{6}$/.test(a.color||"")?a.color:"#8E8E93",createdAt:w(a.createdAt),lastSeen:w(a.lastSeen),opens:w(a.opens),online:!!a.online,lastPing:w(a.lastPing),lastOpen:w(a.lastOpen),closedAt:w(a.closedAt),activeDays:Array.isArray(a.activeDays)?a.activeDays.filter(o=>/^\d{4}-\d{2}-\d{2}$/.test(o)).slice(-40):[],counts:Object.fromEntries(["companies","events","myEvents","thisWeek","done30","late","posts30","notes","personal","lists","birthdays"].map(o=>[o,w(i[o])])),device:{platform:b(l.platform,20),installed:!!l.installed,notifications:b(l.notifications,20),registered:!!l.registered},app:a.app&&typeof a.app=="object"&&/^\d+\.\d+\.\d+$/.test(a.app.v||"")?{v:b(a.app.v,20),b:b(a.app.b,12).replace(/[^a-z0-9]/gi,""),since:w(a.app.since)}:null,game:a.game&&typeof a.game=="object"?{level:Math.max(0,Math.min(100,Math.round(w(a.game.level)))),xp:w(a.game.xp),badges:w(a.game.badges)}:null,origin:a.origin&&typeof a.origin=="object"?{source:b(a.origin.source,60),medium:b(a.origin.medium,60),campaign:b(a.origin.campaign,60)}:null,profile:n.done?{done:!0,profession:b(n.profession,80),area:b(n.area,80),age:b(n.age,10),index:w(n.index),forget:w(n.forget),difficulties:Array.isArray(n.difficulties)?n.difficulties.filter(o=>typeof o=="string").slice(0,12).map(o=>o.slice(0,30)):[],goal:b(n.goal,30),journey:b(n.journey,30)}:{done:!1}}}async function qa(){let a=null,i=null,l=null,n="",o={},t=null,d="resumo",m=()=>{let p=B("Painel do dono",{right:'<button class="btn-text" data-reload>Atualizar</button>'});if(i)return`${p}<div class="page page--sheet"><div class="empty"><h3>N\xE3o consegui carregar</h3><p>${s(i)}</p></div></div>`;if(!a)return`${p}<div class="page page--sheet"><p class="fhelp">Carregando\u2026</p></div>`;let j=Date.now(),M=e=>a.filter(c=>c.lastSeen&&j-c.lastSeen<e*864e5).length,O=a.filter(e=>e.createdAt&&j-e.createdAt<7*864e5).length;h=e=>o[e]||null;let y=Object.values(o),A=y.filter(e=>e.plan==="monthly").length,r=y.filter(e=>e.plan==="lifetime"&&!e.comp).length,v=y.filter(e=>e.plan==="lifetime"&&e.founder&&!e.comp).length,$=e=>e.tier==="essencial"?e.interval==="year"?119.9/12:12.9:e.interval==="year"?179.9/12:19.9,D=y.filter(e=>e.plan==="trial").length,u=y.filter(e=>e.addon&&e.addon.active),sa=y.filter(e=>e.plan==="monthly").reduce((e,c)=>e+$(c),0)+u.reduce((e,c)=>e+(c.addon.plan==="equipe"?c.plan==="lifetime"?19.9:29.9:c.plan==="lifetime"?4.9:7.9),0),G=y.filter(e=>e.plan!=="none"&&e.plan!=="team").length,ta=G?Math.round((A+r)/G*100):0,J=e=>`R$ ${e.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}`,S=(e,c,g="")=>`<div class="arow"><span>${e}${g?`<small>${g}</small>`:""}</span><b>${c}</b></div>`,Q=a.filter(e=>e.device?.installed).length,R=a.filter(e=>e.device?.notifications==="granted"&&e.device?.registered).length,K=e=>a.length?` \xB7 ${Math.round(e/a.length*100)}%`:"",ia=`<div class="aseg" role="tablist">${[["resumo","Resumo"],["pessoas",`Pessoas \xB7 ${a.length}`],["ranking","\u{1F3C6} Ranking"],["erros",`Erros${t&&t.length?` \xB7 ${t.length}`:""}`]].map(([e,c])=>`<button role="tab" class="${d===e?"is-on":""}" data-tab-admin="${e}">${c}</button>`).join("")}</div>`,P="";if(d==="resumo")P=`
      <div class="ahero">
        <small>Receita por m\xEAs</small>
        <b>${J(sa)}</b>
        <span>${A} ${A===1?"assinante":"assinantes"} \xB7 ${u.length} agenda${u.length===1?"":"s"} compartilhada${u.length===1?"":"s"}</span>
      </div>
      <div class="atiles">
        <div><b>${M(1)}</b><small>ativas hoje</small></div>
        <div><b>${A+r}</b><small>pagantes</small></div>
        <div><b>${D}</b><small>em teste</small></div>
      </div>
      <h3 class="ah">Dinheiro</h3>
      <div class="agroup">
        ${S("Fundadores / vital\xEDcios vendidos",`${r}`,`${J(v*199+(r-v)*150)} no total`)}
        ${S("Assinantes (mensal e anual)",`${A}`,`${y.filter(e=>e.plan==="monthly"&&e.tier==="essencial").length} Essencial \xB7 ${y.filter(e=>e.plan==="monthly"&&e.tier!=="essencial").length} Profissional \xB7 ${y.filter(e=>e.plan==="monthly"&&e.interval==="year").length} anuais`)}
        ${S("Agendas compartilhadas",`${u.length}`,`${u.filter(e=>e.addon.plan==="equipe").length} Equipe \xB7 ${u.filter(e=>e.addon.plan==="dupla").length} Dupla`)}
        ${S("Convers\xE3o do teste",`${ta}%`,"quem pagou \xF7 quem testou")}
      </div>
      <h3 class="ah">Pessoas</h3>
      <div class="agroup">
        ${S("Contas",`${a.length}`,`${O} nova${O===1?"":"s"} nos \xFAltimos 7 dias`)}
        ${S("No app agora",`${a.filter(_).length}`)}
        ${S("Ativas na semana",`${M(7)}`)}
        ${S("Convidados (agenda de outra pessoa)",`${a.filter(e=>e.workspace==="compartilhada").length}`)}
      </div>
      <h3 class="ah">Sa\xFAde do app</h3>
      <div class="agroup">
        ${S(`Na vers\xE3o atual${k?` (v${s(k.version)})`:""}`,`${a.filter(e=>C(e).ok&&e.app).length} de ${a.length}`,(()=>{let e=a.filter(c=>!C(c).ok);return e.length?`desatualizados: ${e.slice(0,4).map(c=>s((c.name||c.email||"").split(" ")[0])).join(", ")}${e.length>4?` e mais ${e.length-4}`:""} \u2014 atualiza sozinho ao abrir`:"todo mundo atualizado \u2713"})())}
        ${S("Instalaram na tela inicial",`${Q}${K(Q)}`)}
        ${S("Recebem notifica\xE7\xF5es",`${R}${K(R)}`,R<a.length?"sem isso, os lembretes n\xE3o chegam":"")}
        ${S("Compromissos criados",`${a.reduce((e,c)=>e+(c.counts?.myEvents||0),0)}`)}
        <button class="arow arow--btn" data-rank-admin><span>\u{1F3C6} Ranking (pontos e suspeitas)</span><b>abrir \u203A</b></button>
        <button class="arow arow--btn" data-support-inbox><span>\u{1F4AC} Mensagens de suporte</span><b>abrir \u203A</b></button>
        <button class="arow arow--btn" data-tab-admin="erros"><span>Erros do app</span><b class="${t&&t.length?"bad":"good"}">${t===null?"\u2014":t.length?`${t.length} \u203A`:"nenhum \u2713"}</b></button>
      </div>
      ${va(a)}
      ${$a(a)}`;else if(d==="pessoas"){let e=a.filter(c=>!n||`${c.name} ${c.email} ${c.profile?.profession||""}`.toLowerCase().includes(n)).sort((c,g)=>_(g)-_(c)||Math.max(g.lastPing||0,g.lastSeen||0)-Math.max(c.lastPing||0,c.lastSeen||0));P=`<input class="input" type="search" placeholder="Buscar por nome, e-mail ou profiss\xE3o" data-q value="${s(n)}">
      <div class="accts">${e.map(c=>ga(c,c.uid===l)).join("")||'<p class="fhelp">Nenhuma conta encontrada.</p>'}</div>
      <p class="fhelp">Toque numa conta para ver os detalhes. Aparecem aqui as contas que j\xE1 abriram o app atualizado.</p>`}else if(d==="ranking"){let e=f,c=g=>(g||"").split("-").reverse().join("/");P=e?e.error?`<p class="fhelp">N\xE3o consegui ler o ranking: ${s(e.error)}</p>`:`
      <h3 class="ah">Semana de ${s(c(e.week))}</h3>
      <div class="agroup">${(e.rows||[]).length?e.rows.map((g,F)=>{let x=a.find(la=>la.uid===g.ws);return`<div class="arow"><span><b>${g.flag?"\u2014":F+1+"\xBA"}</b> ${s(x?.name||g.i)} <small>${s(x?.email||g.ws)}</small>${g.flag?`<br><small class="bad">\u26A0\uFE0F fora do ranking: ${s(g.flag.why)}</small>`:""}</span><b>${g.pts} pts</b></div>`}).join(""):'<p class="fhelp" style="padding:12px 16px">Ningu\xE9m pontuou esta semana ainda. S\xF3 contas no plano mensal participam.</p>'}</div>
      <h3 class="ah">Campe\xF5es do m\xEAs (m\xEAs gr\xE1tis)</h3>
      <div class="agroup">${(e.winners||[]).length?e.winners.map(g=>{let F=a.find(x=>x.uid===g.ws);return`<div class="arow"><span>${s(g.month.split("-").reverse().join("/"))} \xB7 ${s(F?.name||g.i)} <small>${g.pts} pts</small></span><b class="${g.applied?"good":"bad"}">${g.applied?"cupom aplicado \u2713":"cupom n\xE3o aplicado"}</b></div>`}).join(""):'<p class="fhelp" style="padding:12px 16px">Ainda nenhum campe\xE3o. O pr\xEAmio \xE9 calculado no dia 1\xBA de cada m\xEAs.</p>'}</div>
      <p class="fhelp">Aqui voc\xEA v\xEA nome e e-mail. Os participantes s\xF3 veem a inicial uns dos outros.</p>`:'<p class="fhelp">Carregando o ranking\u2026</p>',f||ea()}else P=ba(t)||'<p class="fhelp">N\xE3o consegui ler os erros agora.</p>';return`${p}<div class="page page--sheet apanel">${ia}${P}</div>`},f=null,ea=async()=>{let{api:p}=await import("./c-UIREVGSQ.js");f=await p("/rank/admin",{}).catch(j=>({error:j.message})),d==="ranking"&&L.set(m())},L=U({className:"sheet--tall",html:m(),onMount:p=>{p.el.querySelectorAll("[data-toggle]").forEach(r=>r.onclick=()=>{l=l===r.dataset.toggle?null:r.dataset.toggle,p.set(m())});let j=p.el.querySelector("[data-rank-admin]");j&&(j.onclick=async()=>{let{api:r}=await import("./c-UIREVGSQ.js"),v=await r("/rank/admin",{}).catch($=>({error:$.message}));U({className:"sheet--tall",html:`${B("Ranking \xB7 semana de "+s((v.week||"").split("-").reverse().join("/")),{left:'<button class="btn-text" data-close>Fechar</button>'})}<div class="page page--sheet">
          ${v.error?`<p class="fhelp">${s(v.error)}</p>`:(v.rows||[]).map(($,D)=>`<div class="arow"><span>${D+1}. ${s($.i)} \xB7 <small>${s($.ws)}</small>${$.flag?`<br><small class="bad">\u26A0\uFE0F fora do ranking: ${s($.flag.why)}</small>`:""}</span><b>${$.pts} pts</b></div>`).join("")||'<p class="fhelp">Ningu\xE9m pontuou esta semana.</p>'}
          <h4>Campe\xF5es (m\xEAs gr\xE1tis)</h4>${(v.winners||[]).map($=>`<div class="arow"><span>${s($.month)} \xB7 ${s($.i)} <small>${s($.ws)}</small></span><b>${$.applied?"cupom aplicado \u2713":"n\xE3o aplicado"}</b></div>`).join("")||'<p class="fhelp">Ainda nenhum.</p>'}</div>`})});let M=p.el.querySelector("[data-support-inbox]");M&&(M.onclick=async()=>(await import("./c-QO4M6URC.js")).openSupportInbox()),p.el.querySelectorAll("[data-tab-admin]").forEach(r=>r.onclick=()=>{d=r.dataset.tabAdmin,p.set(m()),p.el.scrollTop=0}),p.el.querySelectorAll("[data-grant]").forEach(r=>r.onclick=async()=>{if(!(r.dataset.vip&&!await X({title:"Dar acesso vital\xEDcio?",text:"A pessoa fica com tudo do Profissional para sempre, sem pagar, e recebe a surpresa do Vital\xEDcio.",ok:"Dar acesso vital\xEDcio"}))){r.disabled=!0;try{let{api:v}=await import("./c-UIREVGSQ.js"),$=r.dataset.dated?p.el.querySelector(`[data-until="${r.dataset.grant}"]`):null,D=$?new Date($.value).getTime():0;if($&&!(D>Date.now())){N("Escolha uma data e hora no futuro");return}let u=await v("/admin/grant",{uid:r.dataset.grant,on:r.dataset.on==="1",until:D});o[r.dataset.grant]=u.status,N(r.dataset.on!=="1"?"Acesso retirado":D?`Liberado at\xE9 ${E(D)} \u2713`:u.gifted?u.sent?`\u{1F451} Vital\xEDcio N\xBA ${String(u.status.vip.no).padStart(3,"0")} entregue. O aviso j\xE1 chegou no celular da pessoa.`:`\u{1F451} Vital\xEDcio N\xBA ${String(u.status.vip.no).padStart(3,"0")} entregue. A pessoa est\xE1 sem avisos ligados: ela v\xEA a surpresa quando abrir o app.`:"Acesso liberado \u2713",{ms:u.gifted?6e3:2600}),p.set(m())}catch(v){r.disabled=!1,N(v.message||"N\xE3o consegui agora.")}}}),p.el.querySelectorAll("[data-nudge-upd]").forEach(r=>r.onclick=async()=>{r.disabled=!0;try{let{api:v}=await import("./c-UIREVGSQ.js"),$=await v("/admin/nudge-update",{uid:r.dataset.nudgeUpd,email:r.dataset.email,version:k?.version||""});N($.sent?"Aviso enviado \u2713 Quando a pessoa tocar, o app abre j\xE1 atualizado.":"A pessoa n\xE3o ativou as notifica\xE7\xF5es: pe\xE7a pelo WhatsApp para abrir o app.",{ms:5e3})}catch(v){r.disabled=!1,N(v.message||"N\xE3o consegui agora.")}});let O=p.el.querySelector("[data-reload]");O&&(O.onclick=()=>H());let y=p.el.querySelector("[data-clear-errors]");y&&(y.onclick=async()=>{try{let{api:r}=await import("./c-UIREVGSQ.js");t=(await r("/admin/errors",{clear:!0})).errors||[],p.set(m())}catch{N("N\xE3o consegui limpar agora.")}});let A=p.el.querySelector("[data-q]");A&&(A.oninput=()=>{n=A.value.trim().toLowerCase();let r=A.selectionStart;p.set(m());let v=p.el.querySelector("[data-q]");v.focus(),v.setSelectionRange(r,r)})}}),H=async()=>{try{a=(await z.backendApi.listStats()).map(ha),i=null;try{k=await(await import("./c-NAP2WRSO.js")).fetchLatest()}catch{k=null}try{let{api:p}=await import("./c-UIREVGSQ.js");o=(await p("/billing/all",{})).byWs||{}}catch{o={}}try{let{api:p}=await import("./c-UIREVGSQ.js");t=(await p("/admin/errors",{})).errors||[]}catch{t=null}}catch(p){i=/permission/i.test(String(p.code||p.message))?"Falta atualizar as regras do Firebase (bloco \u201Cstats\u201D).":"Verifique a internet e toque em Atualizar."}L.set(m())};return H(),L}var Da=()=>!!z.user&&!!T.adminEmail&&(z.user.email||"").toLowerCase()===T.adminEmail.toLowerCase();export{Da as isOwner,qa as openAdmin};
