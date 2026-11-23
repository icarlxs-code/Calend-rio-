import{a as ta}from"./c-HV67GW7C.js";import{f as sa}from"./c-PBWZ5J3K.js";import{a as D,b as oa}from"./c-ZB3O6CKG.js";import{a as ea,d as na}from"./c-XBWI27EQ.js";import{a as F}from"./c-VY2CZL5B.js";import{a as V}from"./c-6PVVLET6.js";import{a as N}from"./c-G7RZKR64.js";import{a as C,d as aa}from"./c-645ETJ2O.js";import{d as w,r as c,s as K,t as G}from"./c-EE3JTKGP.js";import{d as A,e as S,f as Y,j as q,m as J,n as E,o as X}from"./c-3V4UCZM4.js";import{b as t}from"./c-DWBEWQEH.js";import{a as Z}from"./c-XQMLTXRG.js";import{f as o}from"./c-GIINIAXM.js";import{a as d}from"./c-3VF3KZPI.js";import{B as r,H as k,d as L,e as H,o as U}from"./c-ZUAJ4OTH.js";import{a as $,b as y,c as v,f,g as z,l as W,w as Q}from"./c-JRZKGWYQ.js";import{f as T}from"./c-S22CTDX7.js";var M="lembra.theme",ra=[{id:"auto",label:"Autom\xE1tico",hint:"segue o celular"},{id:"light",label:"Claro",hint:"sempre claro"},{id:"dark",label:"Escuro",hint:"modo noturno"}],j=()=>{try{return localStorage.getItem(M)||"auto"}catch{return"auto"}};function ma(){let a=j();a==="light"||a==="dark"?document.documentElement.dataset.theme=a:delete document.documentElement.dataset.theme}function ka(a){try{a==="light"||a==="dark"?localStorage.setItem(M,a):localStorage.removeItem(M)}catch{}ma()}var I=(a,e)=>{let n=parseInt(a.slice(1),16);return`rgba(${n>>16&255}, ${n>>8&255}, ${n&255}, ${e})`};function wa(){let a=document.getElementById("proftheme"),e=v.theme;if(!e){a&&(a.textContent="");return}a||(a=document.createElement("style"),a.id="proftheme",document.head.appendChild(a));let n=`--ink:${e.accent};--ink-on:#FFFFFF;--bg:${e.bg};--blur-bg:${I(e.bg,.84)};--brand:${e.accent};--brand-soft:${I(e.accent,.1)}`,s=`--ink:${e.dark};--ink-on:#06121A;--brand:${e.dark};--brand-soft:${I(e.dark,.14)}`;a.textContent=`@media (prefers-color-scheme: light){:root[data-space="work"]:not([data-theme="dark"]){${n}}}
:root[data-space="work"][data-theme="light"]{${n}}
@media (prefers-color-scheme: dark){:root[data-space="work"]:not([data-theme="light"]){${s}}}
:root[data-space="work"][data-theme="dark"]{${s}}`}var x=a=>$[y[a]||"outro"]?.label||"Compromisso",la=(a=3)=>y.slice(0,a).map(e=>$[e]?.label.toLowerCase()).join(", "),R="pauta.onboarded",P="pauta.notifyAskedAt";function Ta(){if(!localStorage.getItem(R))return O(o.solo?["notify","done"]:o.me?["welcome","notify","done"]:["welcome","who","notify","done"]);if(!o.me&&o.mode==="local")return O(["who"]);let e=Number(localStorage.getItem(P)||0);if(k()&&A()==="default"&&Date.now()-e>3*864e5)return O(["notify"])}function _(a,e,n="agora"){return`<div class="nprev">
    <img src="icons/icon-192.png" alt="">
    <div><div class="nprev__top"><b>${r(d.appName.toUpperCase())}</b><span>${r(n)}</span></div>
    <strong>${r(a)}</strong><p>${r(e)}</p></div>
  </div>`}function ua(a,e,n){let s=o.member(o.me),m=o.team.find(i=>i.id!==o.me)||o.team[1]||o.team[0],l=n>1?`<div class="ob__dots">${Array.from({length:n},(i,p)=>`<i class="${p===e?"is-on":""}"></i>`).join("")}</div>`:"";return a==="welcome"?`<div class="ob__art"><img class="ob__icon" src="icons/icon-512.png" alt=""></div>
      <h1>Bem-vindo ao ${r(d.appName)}</h1>
      <p>A agenda de conte\xFAdo de ${r(d.agencyName)}: posts, stories, reels e capta\xE7\xF5es de todas as empresas, num lugar s\xF3.</p>
      ${l}
      <button class="btn btn--primary btn--block" data-next>Come\xE7ar</button>`:a==="who"?`<div class="ob__art ob__art--sm">${t("user",34)}</div>
      <h1>Quem vai usar este celular?</h1>
      <p>Assim o app sabe de quem s\xE3o os lembretes e avisa o parceiro quando voc\xEA marcar algo.</p>
      <div class="whogrid ob__who">${o.team.map(i=>`<button class="whobtn${o.me===i.id?" is-on":""}" style="--mc:${i.color}" data-me="${i.id}">${w(i.id,36)}<span>${r(i.name)}</span><i class="whobtn__check">${t("check",14)}</i></button>`).join("")}</div>
      ${l}
      <button class="btn btn--primary btn--block" data-next ${o.me?"":"disabled"}>Continuar</button>`:a==="notify"?f()?`<div class="ob__previews">
        ${_("Daqui a 2h: Reels \xB7 Pura Vida","18h \u2014 postar o Reels \u201CBastidores\u201D","agora")}
        ${_(`${m?.name||"Seu parceiro"} marcou para voc\xEA`,"Story \xB7 Caf\xE9 Aroma \u2014 amanh\xE3, 16h","h\xE1 2 min")}
        ${_(`Bom dia, ${s?.name||"Henrique"}! Seu dia hoje`,"5 tarefas \xB7 primeira: 11h30 Feed \xB7 Studio Fit","8:00")}
      </div>
      <h1>Nunca mais esque\xE7a um post</h1>
      <p>Lembretes 2h e 30 min antes de cada post, aviso na v\xE9spera das capta\xE7\xF5es, cobran\xE7a se algo ficou para tr\xE1s e aviso quando o parceiro marcar algo para voc\xEA.</p>
      <div data-notify-msg></div>
      ${l}
      <button class="btn btn--primary btn--block" data-enable>${t("bell",18)} Ativar notifica\xE7\xF5es</button>
      <button class="btn btn--ghost btn--block" data-skip>Agora n\xE3o</button>`:`<div class="ob__previews">
        ${_(`Daqui a 1h: ${x(0)}`,`14h \u2014 ${x(0).toLowerCase()} marcada na sua agenda`,"agora")}
        ${_(`${$[y[0]]?.ask||"J\xE1 fez?"} ${x(0)}`,"Se j\xE1 resolveu, toque e marque como feito \u2713","14:00")}
        ${_(`Bom dia, ${s?.name||""}! Seu dia hoje`,`4 compromissos \xB7 primeiro: 8h ${x(1)}`,"7:20")}
      </div>
      <h1>Nunca mais esque\xE7a um compromisso</h1>
      <p>Avisos antes de cada ${r(la(2))} \u2014 calculados pela sua ficha \u2014, uma pergunta na hora exata e cobran\xE7a se algo ficar para tr\xE1s.</p>
      <div data-notify-msg></div>
      ${l}
      <button class="btn btn--primary btn--block" data-enable>${t("bell",18)} Ativar notifica\xE7\xF5es</button>
      <button class="btn btn--ghost btn--block" data-skip>Agora n\xE3o</button>`:`<div class="ob__art ob__art--ok">${t("check",40)}</div>
    <h1>Tudo pronto${s?", "+r(s.name):""}!</h1>
    <ul class="ob__tips">
      <li>${t("plus",18)}<span>Toque no <b>+</b> para marcar ${f()?"posts, capta\xE7\xF5es e reuni\xF5es":r(la(3))}.</span></li>
      <li>${t("sparkle",18)}<span>O <b>Assistente</b> avisa conflitos e ${f()?"sugere os melhores hor\xE1rios":"marca as coisas por voc\xEA: \xE9 s\xF3 escrever"}.</span></li>
      ${f()?`<li>${t("link",18)}<span>Em <b>Empresas</b>, mande para cada cliente o link do cronograma dele.</span></li>`:`<li>${t(v.entity.icon,18)}<span>Em <b>${r(W(!0))}</b>, organize ${r(v.entity.hint||"seus compromissos por grupo")}.</span></li>`}
    </ul>
    ${l}
    <button class="btn btn--primary btn--block" data-next>Abrir a agenda</button>`}function O(a){if(document.querySelector(".ob"))return;let e=0,n=document.createElement("div");n.className="ob",n.innerHTML='<div class="ob__card"></div>',document.body.appendChild(n),requestAnimationFrame(()=>n.classList.add("is-in"));let s=n.querySelector(".ob__card"),m=()=>{(a.includes("welcome")||a.includes("done"))&&localStorage.setItem(R,"1"),n.classList.remove("is-in"),setTimeout(()=>n.remove(),400)},l=g=>{if(g>=a.length)return m();e=g,s.classList.remove("is-shown"),setTimeout(()=>{s.innerHTML=ua(a[e],e,a.length),p(),s.classList.add("is-shown")},s.innerHTML?180:0)},i=(g,h="info")=>{let b=s.querySelector("[data-notify-msg]");b&&(b.innerHTML=`<div class="ob__msg ob__msg--${h}">${g}</div>`)},p=()=>{s.querySelectorAll("[data-next]").forEach(b=>b.onclick=()=>l(e+1)),s.querySelectorAll("[data-me]").forEach(b=>b.onclick=()=>{o.setMe(b.dataset.me),s.querySelectorAll("[data-me]").forEach(B=>B.classList.toggle("is-on",B===b)),s.querySelector("[data-next]").disabled=!1});let g=s.querySelector("[data-skip]");g&&(g.onclick=()=>{localStorage.setItem(P,String(Date.now())),l(e+1)});let h=s.querySelector("[data-enable]");h&&(h.onclick=async()=>{if(localStorage.setItem(P,String(Date.now())),S()){i(`<b>Primeiro instale o app.</b> No iPhone, as notifica\xE7\xF5es s\xF3 funcionam pelo \xEDcone da Tela de In\xEDcio:<br>
          1. Toque em ${t("share",14)} <b>Compartilhar</b><br>2. <b>Adicionar \xE0 Tela de In\xEDcio</b><br>3. Abra o ${r(d.appName)} pelo \xEDcone`,"warn"),h.outerHTML='<button class="btn btn--primary btn--block" data-next>Entendi</button>',p();return}h.disabled=!0,h.innerHTML="Aguardando permiss\xE3o\u2026";let b=await q().catch(()=>({ok:!1,reason:"error"}));b.ok?(b.local?i("Ativado neste celular. Para os avisos chegarem com o app fechado e no celular do parceiro, falta ligar o servidor de notifica\xE7\xF5es (Ajustes \u2192 Notifica\xE7\xF5es).","ok"):(i("Pronto! Voc\xEA vai receber uma notifica\xE7\xE3o de teste em instantes.","ok"),E().catch(()=>{})),h.outerHTML='<button class="btn btn--primary btn--block" data-next>Continuar</button>',s.querySelector("[data-skip]")?.remove(),p()):b.reason==="server"?(i("Permiss\xE3o concedida! O servidor de notifica\xE7\xF5es ainda n\xE3o foi publicado; quando for, este celular \xE9 cadastrado sozinho.","ok"),h.outerHTML='<button class="btn btn--primary btn--block" data-next>Continuar</button>',p()):b.reason==="denied"?(i(`As notifica\xE7\xF5es foram bloqueadas. Para ligar depois: <b>Ajustes do iPhone \u2192 Notifica\xE7\xF5es \u2192 ${r(d.appName)}</b>.`,"warn"),h.outerHTML='<button class="btn btn--primary btn--block" data-next>Continuar</button>',p()):(i("Este aparelho n\xE3o aceita notifica\xE7\xF5es deste app.","warn"),h.disabled=!1,h.innerHTML="Tentar de novo")})};l(0)}function ca(){localStorage.removeItem(R),localStorage.removeItem(P),c("A apresenta\xE7\xE3o aparece na pr\xF3xima abertura")}var da=()=>!!o.user&&String(o.user.email||"").toLowerCase()===String(d.adminEmail||"").toLowerCase();function ae(){let a=o.member(o.me),e=o.mode==="cloud",n="Notification"in window&&Notification.permission==="granted";return e&&setTimeout(()=>{fa(),oa()},0),`
  <header class="hdr">
    <div class="hdr__row"><div class="hdr__titles"><p class="hdr__eyebrow">${r(d.appName)}${o.solo?"":" \xB7 "+r(d.agencyName)}</p><h1>Ajustes</h1></div></div>
  </header>
  <div class="page">
    ${o.solo?ga():""}
    <section class="block">
      <div class="glist">
        ${u({cls:"pbig--toPersonal",attrs:'data-action="space" data-space="personal"',ic:"heart",c:"#FF2D55",t:"Modo Pessoal",s:"Anivers\xE1rios, compromissos e listas \u2014 s\xF3 voc\xEA v\xEA"})}
        ${e?ha():""}
        ${e&&o.solo?u({cls:"pbig--share",attrs:'data-action="share"',ic:"users",c:"#34C759",t:"Agenda compartilhada",s:o.shared?`Voc\xEA est\xE1 na agenda de ${r(o.shared.ownerName)}`:o.billing?.addon?.active?`Plano ${o.billing.addon.plan==="equipe"?"Equipe":"Dupla"} ativo \xB7 convide e gerencie`:"Divida a agenda com s\xF3cio ou equipe \xB7 \xE0 parte"}):""}
        ${o.team.length>1?u({attrs:'data-action="team-board"',ic:"trophy",c:"#FF9F0A",t:"Placar da equipe",s:"Quem cumpriu o que marcou nesta semana"}):""}
        ${u({attrs:'data-action="profile"',ic:"crown",c:"#AF52DE",t:"Perfil e conquistas",s:"Seu n\xEDvel, XP e emblemas"})}
        ${e&&ta()?u({attrs:o.profile?.phoneVerified?"":'data-action="confirm-phone"',ic:"shield",c:o.profile?.phoneVerified?"#34C759":"#0A84FF",t:o.profile?.phoneVerified?"Celular confirmado \u2713":"Confirmar meu celular",s:o.profile?.phoneVerified?r(o.profile.phone||"")+" \xB7 d\xE1 para recuperar a senha por SMS":"Protege a conta e permite recuperar a senha por SMS"}):""}
        ${u({attrs:'data-action="guide"',ic:"sparkles",c:"#5856D6",t:"Como funciona o Lembra",s:"Trabalho e Pessoal em 1 minuto"})}
        ${u({attrs:'data-action="snh-toggle"',ic:"bell",c:"#FF6B1A",t:"Lembra na tela",s:(()=>{try{return localStorage.getItem("lembra.companheiroOff")==="1"}catch{return!1}})()?"Escondido \xB7 toque para ele voltar":"Aparecendo \xB7 arraste ele pra onde quiser"})}
        ${e?u({attrs:'data-action="ia-toggle"',ic:"sparkle",c:"#FF6B1A",t:"Intelig\xEAncia artificial",s:N()===!0?"Ativada \xB7 toque para desativar":N()===!1?"Desativada \xB7 nada \xE9 enviado para a IA":"Ainda n\xE3o decidiu \xB7 toque para ver como funciona"}):""}
        ${e?u({cls:"pbig--privacy",attrs:'data-action="privacy"',ic:"lock",c:"#8E8E93",t:"Privacidade e dados",s:"Termos, baixar ou apagar meus dados"}):""}
        ${e&&o.solo?u({attrs:'data-action="ranking"',ic:"trophy",c:"#FF9F0A",t:"Ranking da semana",s:o.billing?.plan==="monthly"&&o.billing?.tier!=="essencial"?"Ligas semanais \xB7 o n\xBA 1 do m\xEAs ganha o m\xEAs seguinte gr\xE1tis":"Plano Profissional \xB7 ligas e meses gr\xE1tis"}):""}
        ${e?(o.user?.email||"").toLowerCase()===(d.adminEmail||"").toLowerCase()?u({attrs:'data-action="support" data-allow-locked',ic:"headset",c:"#0A84FF",t:"Mensagens de suporte",s:"O que os clientes escreveram \xB7 toque para responder"}):u({attrs:'data-action="support" data-allow-locked',ic:"headset",c:"#0A84FF",t:"Falar com o suporte",s:"Chat com a equipe do Lembra \xB7 respondemos em at\xE9 24h"}):d.supportWhatsapp||d.supportEmail?u({attrs:'data-action="support"',ic:d.supportWhatsapp?"phone":"mail",c:d.supportWhatsapp?"#25D366":"#0A84FF",t:"Ajuda e atendimento",s:d.supportWhatsapp?"Fale com a gente no WhatsApp":"Fale com a gente por e-mail"}):""}
      </div>
    </section>
    ${e&&(o.user?.email||"").toLowerCase()===(d.adminEmail||"").toLowerCase()?`<section class="block"><div class="glist">${u({attrs:'data-action="admin"',ic:"chart",c:"#0A84FF",t:"Painel do dono",s:"Receita, pessoas e sa\xFAde do app"})}</div></section>`:""}
    <section class="block">
      <h2 class="block__title">${t("user",16)} ${e?"Sua conta":"Quem est\xE1 usando este celular?"}</h2>
      ${e?`<div class="card whocard">
            <div class="whocard__top">${a?w(a.id,48):t("user",24)}<div class="whocard__txt"><strong>${r(a?.name||o.user?.email||"")}${da()?`<span class="vbadge">${t("crown",12)} Propriet\xE1rio</span>`:o.billing?.plan==="lifetime"?`<span class="vbadge">${t("crown",12)} ${o.billing?.founderTeam||o.billing?.comp&&!o.billing?.vip&&d.team.some(s=>(s.email||"").toLowerCase()===(o.user?.email||"").toLowerCase())?"Fundador":"Vital\xEDcio"}</span>`:""}</strong><small>${r(o.user?.email||"")}</small></div></div>
            <div class="whocard__btns">${o.solo?`<button class="btn btn--soft btn--sm" data-action="edit-profile">${t("edit",16)} Editar perfil</button>`:""}
            <button class="btn btn--danger-soft btn--sm" data-action="logout">${t("logout",16)} Sair da conta</button></div></div>`:`<div class="whogrid">${o.team.map(s=>`<button class="whobtn${o.me===s.id?" is-on":""}" style="--mc:${s.color}" data-action="set-me" data-p="${s.id}">${w(s.id,34)}<span>${r(s.name)}</span><i class="whobtn__check">${t("check",14)}</i></button>`).join("")}</div>
           <p class="fhelp">Usado para sauda\xE7\xE3o, \u201CCriado por\u201D e nos lembretes.</p>`}
    </section>

    ${ba()}

    ${$a()}

    <section class="block">
      <h2 class="block__title">${t("sparkle",16)} Assistente e Claude</h2>
      <div class="card card--row">
        ${t("sparkle",22)}
        <div><strong>Assistente autom\xE1tico ativo</strong><small>Confere conflitos, tempo livre e melhores hor\xE1rios sozinho, sem internet e sem chave.</small></div>
        <button class="btn btn--soft btn--sm" data-action="assistant">Abrir</button>
      </div>
      <p class="fhelp">Para perguntas abertas (ideias, reorganizar a semana), use \u201CPerguntar ao Claude\u201D no Assistente. Abre o Claude com o seu login normal, sem chave de API.</p>
    </section>

    ${va()}

    <section class="block">
      <h2 class="block__title">${t("calendar",16)} Lembretes no Calend\xE1rio do iPhone</h2>
      <div class="card">
        <p>Envie a agenda para o <b>Calend\xE1rio do iPhone</b> com alarmes. Assim o celular avisa na hora certa, mesmo com o app fechado.</p>
        <div class="btnrow">
          <button class="btn btn--primary btn--sm" data-action="ics" data-who="me" data-days="7">${t("download",16)} Minha semana</button>
          <button class="btn btn--soft btn--sm" data-action="ics" data-who="me" data-days="30">Meus 30 dias</button>
          ${o.team.length>1?`<button class="btn btn--soft btn--sm" data-action="ics" data-who="all" data-days="7">Semana da ${z()}</button>`:""}
        </div>
        <p class="fhelp">No iPhone, toque em \u201CCalend\xE1rio\u201D ou abra o arquivo baixado e escolha \u201CAdicionar tudo\u201D. Se mudar algo depois, exporte de novo.</p>
      </div>
    </section>

    <section class="block">
      <h2 class="block__title">${t("cloud",16)} Sincroniza\xE7\xE3o</h2>
      <div class="card card--row ${e?"card--ok":"card--warn"}">
        ${t(e?"cloud":"phone",22)}
        <div><strong>${e?"Sincronizado na nuvem":"Salvo s\xF3 neste aparelho"}</strong>
        <small>${e?o.solo?"Sua agenda fica salva na sua conta e aparece igual em qualquer celular em que voc\xEA entrar.":"Henrique, Matheus e os links dos clientes veem tudo em tempo real.":"Para ver a mesma agenda em celulares diferentes, ative a nuvem (gratuito). Veja o guia no README do projeto."}</small></div>
      </div>
    </section>

    ${k()?"":`<section class="block">
      <h2 class="block__title">${t("phone",16)} Instalar como app</h2>
      <div class="card">
        <ol class="steps">
          <li>Abra este endere\xE7o no <b>Safari</b>.</li>
          <li>Toque em ${t("share",15)} <b>Compartilhar</b>.</li>
          <li>Escolha <b>Adicionar \xE0 Tela de In\xEDcio</b>.</li>
        </ol>
        <p class="fhelp">O app abre em tela cheia, como um aplicativo normal.</p>
      </div>
    </section>`}

    ${f()?`<section class="block">
      <h2 class="block__title">${t("bulb",16)} Melhores hor\xE1rios (refer\xEAncia)</h2>
      <div class="card card--flush">
        <ul class="besttimes">
          ${Q.map(s=>`<li><span class="tbadge tbadge--${s.type}">${t($[s.type].icon,13)}${$[s.type].label}</span><span>${r(s.text)}</span></li>`).join("")}
        </ul>
        <p class="fhelp pad">M\xE9dias de mercado. Confiram os Insights do Instagram de cada cliente e ajustem: cada p\xFAblico tem seu hor\xE1rio de pico.</p>
      </div>
    </section>`:""}

    <section class="block">
      <h2 class="block__title">${t("download",16)} Dados e backup</h2>
      <div class="list">
        <button class="list__row" data-action="export">${t("download",18)}<span>Exportar backup (.json)</span>${t("right",16,"muted")}</button>
        <label class="list__row">${t("upload",18)}<span>Importar backup</span><input type="file" accept="application/json,.json" data-action-change="import" hidden>${t("right",16,"muted")}</label>
        ${o.demo?`<button class="list__row" data-action="clear-demo">${t("sparkle",18)}<span>Apagar dados de exemplo</span>${t("right",16,"muted")}</button>`:""}
        <button class="list__row is-danger" data-action="clear-all">${t("trash",18)}<span>Apagar tudo</span>${t("right",16,"muted")}</button>
      </div>
      <p class="fhelp">${o.state.companies.length} empresas \xB7 ${o.state.events.length} eventos \xB7 ${o.state.notes.length} bilhetes</p>
    </section>
    <section class="block">
      <h2 class="block__title">${t("refresh",16)} Vers\xE3o do app</h2>
      <div class="list">
        <div class="list__row list__row--static"><span><b>${r(d.appName)} ${r(C)}</b><small>Atualiza sozinho sempre que voc\xEA abre \xB7 c\xF3digo ${r(aa)}</small></span><span class="verok">${t("check",14)} em dia</span></div>
        <button class="list__row" data-action="whatsnew">${t("sparkles",18)}<span>Novidades desta vers\xE3o</span>${t("right",16,"muted")}</button>
        <button class="list__row" data-action="check-update">${t("refresh",18)}<span>Procurar atualiza\xE7\xE3o agora</span>${t("right",16,"muted")}</button>
      </div>
    </section>
    ${e?`<section class="block">
      <button class="logoutbig" data-action="logout">${t("logout",20)}<span>Sair da conta</span></button>
      <p class="fhelp center">Conectado como ${r(o.user?.email||"")}</p>
    </section>`:""}
    <div class="about">${V("palavra",{h:22,alt:r(d.appName)})}<small>vers\xE3o ${r(C)} \xB7 sua agenda de trabalho e pessoal</small></div>
  </div>`}function ba(){let a=j();return`<section class="block">
    <h2 class="block__title">${t("sun",16)} Apar\xEAncia</h2>
    <div class="seg3">${ra.map(e=>`<button class="seg3__btn${a===e.id?" is-on":""}" data-action="theme" data-v="${e.id}">${t(e.id==="dark"?"moon":e.id==="light"?"sun":"phone",18)}<b>${e.label}</b><small>${e.hint}</small></button>`).join("")}</div>
    <div class="list" style="margin-top:10px"><label class="list__row"><span><b>Sons</b><small>Toque suave ao trocar de modo e ao concluir</small></span><input type="checkbox" class="switch" data-sound ${Z()?"checked":""}></label></div>
    ${!f()&&v.theme?`<p class="fhelp">As cores do modo Trabalho combinam com a sua \xE1rea${v.profession?` (${r(T(v.profession,o.profile?.pronoun))})`:""}.</p>`:""}
  </section>`}var u=({cls:a="",attrs:e="",ic:n,c:s,t:m,s:l="",badge:i=""})=>`<button class="glist__row ${a}" ${e}><span class="glist__ic" style="--c:${s}">${t(n,18)}</span><span class="glist__txt"><b>${r(m)}</b>${l?`<small>${l}</small>`:""}</span>${i?`<span class="glist__badge">${r(i)}</span>`:""}${t("right",16)}</button>`;function ha(){let a=o.profile||{};return a.onboardedAt?u({cls:"pbig--ficha",attrs:'data-action="ficha"',ic:!f()&&v.badge?v.badge:"idcard",c:"#FF9500",t:"Sua ficha",s:`${r(T(a.profession,a.pronoun)||"Profiss\xE3o")} \xB7 \xEDndice ${Number(a.index)||0}/100`,badge:""}):u({cls:"pbig--ficha",attrs:'data-action="ficha"',ic:"idcard",c:"#FF9500",t:"Preencha sua ficha",s:"2 minutos: o Lembra se adapta a voc\xEA"})}function va(){let a=A(),e=S(),n=o.mode==="cloud",s=!!localStorage.getItem("pauta.device"),m=Y(),l,i,p="";return e?(l="warn",i="No iPhone, as notifica\xE7\xF5es s\xF3 funcionam com o app instalado na Tela de In\xEDcio.",p='<button class="btn btn--primary btn--sm" data-action="install-guide">Como instalar</button>'):a==="unsupported"?(l="warn",i="Este navegador n\xE3o aceita notifica\xE7\xF5es."):a==="denied"?(l="warn",i=`Bloqueadas. Para ligar: Ajustes do iPhone \u2192 Notifica\xE7\xF5es \u2192 ${d.appName}.`):a!=="granted"?(l="warn",i="Desativadas neste celular.",p='<button class="btn btn--primary btn--sm" data-action="notify-enable">Ativar</button>'):n&&s?(l="ok",i=o.team.length>1?"Ativadas. Os lembretes e os avisos do parceiro chegam mesmo com o app fechado.":"Ativadas. Seus lembretes chegam mesmo com o app fechado.",p='<button class="btn btn--soft btn--sm" data-action="notify-enable">Recadastrar</button>'):n?(l="warn",i="Permiss\xE3o concedida, mas este celular ainda n\xE3o foi cadastrado no servidor. Toque em Cadastrar.",p='<button class="btn btn--primary btn--sm" data-action="notify-enable">Cadastrar</button>'):(l="warn",i="Ativadas s\xF3 com o app aberto. Para receber com o app fechado e no celular do parceiro, ligue a nuvem e o servidor (README)."),`<section class="block">
    <h2 class="block__title">${t("bell",16)} Notifica\xE7\xF5es</h2>
    <div class="card card--row ${l==="ok"?"card--ok":"card--warn"}">
      ${t("bell",22)}
      <div><strong>${l==="ok"?"Funcionando":"Aten\xE7\xE3o"}</strong><small>${r(i)}</small></div>
      ${p}
    </div>
    <form class="list notif-prefs" data-notify-form onsubmit="return false">
      <label class="list__row"><span><b>Lembretes dos meus compromissos</b><small>antes do hor\xE1rio (como calculado na sua ficha), na hora e cobran\xE7a se atrasar</small></span><input type="checkbox" class="switch" name="reminders" ${m.reminders?"checked":""}></label>
      <label class="list__row"${o.team.length<2?" hidden":""}><span><b>Avisos do parceiro</b><small>quando marcar, mudar ou concluir algo</small></span><input type="checkbox" class="switch" name="partner" ${m.partner?"checked":""}></label>
      <label class="list__row"><span><b>Dicas do trabalho</b><small>${f()?"ideias de conte\xFAdo, trends e cobran\xE7as por empresa":"dicas pr\xE1ticas da sua profiss\xE3o e motiva\xE7\xE3o"}, em hor\xE1rios variados</small></span><input type="checkbox" class="switch" name="coach" ${m.coach?"checked":""}></label>
      <label class="list__row"><span><b>Resumo do dia</b><small>\xE0s 8h (hoje) e \xE0s 20h (amanh\xE3)</small></span><input type="checkbox" class="switch" name="daily" ${m.daily?"checked":""}></label>
    </form>
    ${n?'<div class="list" data-devices><div class="list__row"><span><small>Conferindo celulares cadastrados\u2026</small></span></div></div>':""}
    ${a==="granted"?`<button class="btn btn--soft btn--block" data-action="notify-test">${t("bell",16)} Enviar notifica\xE7\xE3o de teste</button>`:""}
    ${D()?`<h3 class="block__sub">Uso de hoje (gr\xE1tis)</h3>${D()}`:""}
    ${a==="granted"&&n?'<button class="btn btn--soft btn--block" data-action="coach-test">\u2728 Receber uma dica agora</button>':""}
    ${k()?"":`<button class="btn btn--soft btn--block" data-action="install-guide">${t("phone",16)} Instalar na tela inicial</button>`}
    <button class="btn-text btn-text--sm" data-action="onboarding-again">Ver a apresenta\xE7\xE3o de novo</button>
  </section>`}function fa(){X().then(a=>{let e=document.querySelector("[data-devices]");if(e){if(!a){e.innerHTML='<div class="list__row"><span><small>N\xE3o deu para conferir os celulares agora.</small></span></div>';return}e.innerHTML=o.team.map(n=>{let s=a[n.id]||0;return`<div class="list__row devrow"><span><b>${r(n.name)}</b><small>${s?`${s} celular${s>1?"es":""} recebendo avisos`:"Nenhum celular cadastrado \u2014 n\xE3o recebe notifica\xE7\xF5es. Abra o app pelo \xEDcone \u2192 Ajustes \u2192 Notifica\xE7\xF5es \u2192 Ativar/Cadastrar."}</small></span><span>${s?"\u2705":"\u26A0\uFE0F"}</span></div>`}).join("")}})}function ga(){let a=o.billing||{},e={trial:"Teste gr\xE1tis (tudo liberado)",comp:"Acesso liberado",monthly:`${a.tier==="essencial"?"Essencial":"Profissional"} \xB7 ${a.prepaid?"12 meses no Pix":a.interval==="year"?"anual":"mensal"}`,lifetime:da()?"Propriet\xE1rio \xB7 acesso total":a.vip?"Lembra Vital\xEDcio":a.founder?"Fundadores \xB7 Profissional para sempre":"Vital\xEDcio",expired:"Teste encerrado",blocked:"Sem plano",none:"Sem plano",shared:"Agenda compartilhada",checking:"Conferindo\u2026",offline:"Sem conex\xE3o para conferir"}[a.plan]||"\u2014",n=a.plan==="trial"?`Termina em ${sa(a.trialEndsAt-Date.now())}`:a.plan==="monthly"?a.prepaid?`Pago at\xE9 ${new Date(a.paidUntil).toLocaleDateString("pt-BR")} \xB7 perto de vencer, \xE9 s\xF3 renovar`:a.cancelAt?`Cancelada: vale at\xE9 ${new Date(a.cancelAt).toLocaleDateString("pt-BR")}`:a.paidUntil?`Renova em ${new Date(a.paidUntil).toLocaleDateString("pt-BR")}`:"Ativa":a.plan==="lifetime"?a.vip?`Membro N\xBA ${String(a.vip.no).padStart(3,"0")} \xB7 desde ${new Date(a.vip.at).toLocaleDateString("pt-BR")}. Presente de cortesia do Lembra (veja os Termos de Uso).`:a.comp?"Acesso cortesia liberado pelo Lembra.":"Pago uma vez, para sempre. Obrigado!":a.plan==="comp"?`Acesso liberado pelo Lembra at\xE9 ${new Date(a.compUntil).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"})}. Depois disso, \xE9 s\xF3 escolher um plano.`:a.plan==="shared"?`Liberado pela agenda de ${o.shared?.ownerName||a.ownerName||"quem te convidou"}. Voc\xEA n\xE3o paga nada.`:"",s=l=>(a.plan==="lifetime"?{dupla:"4,90",equipe:"19,90"}:{dupla:"7,90",equipe:"29,90"})[l],m=a.addon&&a.addon.active?`<div class="card card--row"><div><strong>+ Agenda compartilhada ${a.addon.plan==="equipe"?`Equipe \xB7 R$ ${s("equipe")}/m\xEAs`:`Dupla \xB7 R$ ${s("dupla")}/m\xEAs`}</strong><small>${a.addon.cancelAt?`Cancelada: vale at\xE9 ${new Date(a.addon.cancelAt).toLocaleDateString("pt-BR")}`:"Complemento mensal, cobrado \xE0 parte"}</small></div><button class="btn btn--soft btn--sm" data-action="share">Ver</button></div>`:"";return`<section class="block">
    <h2 class="block__title">${t("card",16)} Seu plano</h2>
    <div class="card card--row"><div><strong>${r(e)}</strong>${n?`<small>${r(n)}</small>`:""}</div>
      ${a.plan==="lifetime"&&a.vip&&!a.addon?'<button class="btn btn--soft btn--sm" data-action="vip-card">Ver cart\xE3o</button>':a.plan==="monthly"&&a.prepaid?a.paidUntil-Date.now()<30*864e5?'<button class="btn btn--primary btn--sm" data-action="plans">Renovar</button>':"":a.plan==="monthly"||a.plan==="lifetime"&&a.addon?'<button class="btn btn--soft btn--sm" data-action="billing-portal">Gerenciar</button>':["lifetime","shared"].includes(a.plan)?"":'<button class="btn btn--primary btn--sm" data-action="plans">Assinar</button>'}
    </div>
    ${a.plan==="monthly"&&a.tier==="essencial"?`<button class="card card--row upgrade" data-action="billing-portal">${t("crown",20)}<div><strong>Passe para o Profissional</strong><small>Assistente com IA, cobran\xE7a de atraso e ranking com meses gr\xE1tis. Troque em \u201CGerenciar\u201D.</small></div>${t("right",16)}</button>`:""}
    ${a.plan==="monthly"&&(a.foundersLeft??0)>0?`<button class="card card--row upgrade" data-action="plans">${t("crown",20)}<div><strong>Vire Fundador</strong><small>R$ 199 uma vez: o Profissional para sempre. S\xF3 ${a.foundersLeft} vagas. A assinatura \xE9 cancelada na hora.</small></div>${t("right",16)}</button>`:""}
    ${m}
  </section>`}function $a(){let a=F(),e=i=>String(i||"").replace(/^0/,"").replace(":00","h").replace(":","h"),n=["domingo","segunda","ter\xE7a","quarta","quinta","sexta","s\xE1bado"],s=a.daysOff.map(i=>n[i]),m=`Voc\xEA trabalha das <b>${e(a.workStart)}</b> \xE0s <b>${e(a.workEnd)}</b>, almo\xE7a das <b>${e(a.lunchStart)}</b> \xE0s <b>${e(a.lunchEnd)}</b>${s.length?` e folga ${s.length===1?"no":"em"} <b>${s.join(", ").replace(/, ([^,]*)$/," e $1")}</b>`:" e n\xE3o tem dia de folga"}.`,l=[[0,"N\xE3o preciso de tempo entre eles"],[15,"15 minutos"],[30,"30 minutos"],[45,"45 minutos"],[60,"1 hora"],[90,"1 hora e meia"]];return`<section class="block">
    <h2 class="block__title">${t("clock",16)} Seu dia de trabalho</h2>
    <p class="rt__lead">Conte como \xE9 o seu dia. Com isso o Lembra <b>n\xE3o marca nada</b> no seu almo\xE7o, na sua folga ou fora do expediente, e avisa quando o dia estiver cheio demais.</p>
    <div class="rt__resumo">${t("sparkles",16)}<span>${m}</span></div>
    <form class="rt" data-routine-form onsubmit="return false">
      <div class="rt__card"><div class="rt__q"><span class="rt__ic" style="--c:#0A84FF">${t("briefcase",18)}</span><div><b>Que horas voc\xEA come\xE7a e termina de trabalhar?</b><small>Fora desse hor\xE1rio o Lembra n\xE3o marca compromisso de trabalho.</small></div></div>
        <div class="rt__times"><span>Das</span><input type="time" name="workStart" value="${a.workStart}" aria-label="Come\xE7o do expediente"><span>\xE0s</span><input type="time" name="workEnd" value="${a.workEnd}" aria-label="Fim do expediente"></div></div>
      <div class="rt__card"><div class="rt__q"><span class="rt__ic" style="--c:#FF9500">${t("utensils",18)}</span><div><b>Que horas \xE9 o seu almo\xE7o?</b><small>Esse hor\xE1rio fica livre: nada \xE9 marcado em cima dele.</small></div></div>
        <div class="rt__times"><span>Das</span><input type="time" name="lunchStart" value="${a.lunchStart}" aria-label="Come\xE7o do almo\xE7o"><span>\xE0s</span><input type="time" name="lunchEnd" value="${a.lunchEnd}" aria-label="Fim do almo\xE7o"></div></div>
      <div class="rt__card"><div class="rt__q"><span class="rt__ic" style="--c:#34C759">${t("sun",18)}</span><div><b>Em quais dias voc\xEA N\xC3O trabalha?</b><small>Toque nos dias de folga (eles ficam verdes). Nesses dias o Lembra deixa voc\xEA descansar.</small></div></div>
        <div class="rt__days">${U.map((i,p)=>`<label class="rt__day"><input type="checkbox" name="off" value="${p}"${a.daysOff.includes(p)?" checked":""}><span><b>${i}</b><small>${a.daysOff.includes(p)?"folga":"trabalho"}</small></span></label>`).join("")}</div></div>
      <div class="rt__card"><div class="rt__q"><span class="rt__ic" style="--c:#AF52DE">${t("car",18)}</span><div><b>Quanto tempo voc\xEA leva de um compromisso para o outro?</b><small>O Lembra deixa esse intervalo livre entre eles (tr\xE2nsito, deslocamento).</small></div></div>
        <select class="rt__sel" name="travelMin">${l.map(([i,p])=>`<option value="${i}"${a.travelMin===i?" selected":""}>${p}</option>`).join("")}</select></div>
      <div class="rt__card"><div class="rt__q"><span class="rt__ic" style="--c:#FF3B30">${t("listcheck",18)}</span><div><b>Quantos compromissos voc\xEA aguenta num dia?</b><small>Passou disso, o Lembra avisa que o dia est\xE1 pesado.</small></div></div>
        <select class="rt__sel" name="maxTasks">${[4,5,6,7,8,10,12,15,20].map(i=>`<option value="${i}"${a.maxTasks===i?" selected":""}>At\xE9 ${i} por dia</option>`).join("")}</select></div>
    </form>
    <p class="fhelp">Muda na hora, sem bot\xE3o de salvar.</p>
  </section>`}var ee={async notifyEnable(){let a=await q().catch(e=>({ok:!1,reason:"error",message:e.message}));a.ok?c(a.local?"Ativado (com o app aberto)":"Notifica\xE7\xF5es ativadas"):a.reason==="install"?c("Instale o app na Tela de In\xEDcio primeiro"):a.reason==="denied"?c("Bloqueado: libere em Ajustes do iPhone \u2192 Notifica\xE7\xF5es"):a.reason==="server"?c("Servidor de notifica\xE7\xF5es ainda n\xE3o publicado"):c(`N\xE3o foi poss\xEDvel ativar${a.message?": "+a.message:""}`,{ms:8e3}),o.emit()},async coachTest(){try{await na(),c("Pronto! Uma dica chega em at\xE9 1 minuto (se for entre 8h30 e 21h30).",{ms:5e3})}catch{c("N\xE3o deu para pedir a dica agora. Verifique a conex\xE3o.")}},async notifyTest(){let a;try{a=await E()}catch(e){return c(`Falhou: ${e.message}`,{ms:8e3})}if(a.kind==="not-registered")return c('Este celular ainda n\xE3o est\xE1 cadastrado. Toque em "Ativar" acima.',{ms:7e3});if(a.kind==="local")return c("Notifica\xE7\xE3o local mostrada (servidor n\xE3o configurado)");if(a.sent>0)return c("Enviada! Deve chegar em alguns segundos. Bloqueie a tela para ver.",{ms:7e3});if(!a.devices)return c('O servidor n\xE3o tem este celular cadastrado. Toque em "Ativar" de novo.',{ms:7e3});c(`A Apple n\xE3o aceitou o envio (${(a.statuses||[]).join(", ")||"sem resposta"}). Toque em "Ativar" de novo.`,{ms:9e3})},async notifyPrefs(a){await J({reminders:a.reminders.checked,partner:a.partner.checked,daily:a.daily.checked,coach:a.coach.checked}),c("Prefer\xEAncias salvas")},onboardingAgain(){ca()},async routine(a){let e=(m,l)=>/^\d{2}:\d{2}$/.test(a[m].value)?a[m].value:l,n=F(),s={id:"routine",workStart:e("workStart",n.workStart),workEnd:e("workEnd",n.workEnd),lunchStart:e("lunchStart",n.lunchStart),lunchEnd:e("lunchEnd",n.lunchEnd),travelMin:Number(a.travelMin.value),maxTasks:Number(a.maxTasks.value),daysOff:[...a.querySelectorAll('input[name="off"]:checked')].map(m=>Number(m.value))};if(s.workEnd<=s.workStart)return c("O fim do expediente precisa ser depois do in\xEDcio");if(s.lunchEnd<=s.lunchStart)return c("O fim do almo\xE7o precisa ser depois do in\xEDcio");await o.upsert("settings",s),c("Rotina salva")},async ics(a){let e=a.dataset.who==="me"?o.me:"all";if(a.dataset.who==="me"&&!o.me)return c("Escolha primeiro quem est\xE1 usando este celular");let n=Number(a.dataset.days),s=L(),m=o.eventsBetween(s,H(s,n),{person:e}).filter(i=>i.status!=="feito");if(!m.length)return c("Nada agendado nesse per\xEDodo");let l=e==="all"?`${d.appName} \u2013 Dupla`:`${d.appName} \u2013 ${o.member(e).name}`;await ea(m,`pauta-${e}-${s}.ics`,l)},export(){let a=new Blob([o.exportData()],{type:"application/json"}),e=document.createElement("a");e.href=URL.createObjectURL(a),e.download=`pauta-backup-${L()}.json`,document.body.appendChild(e),e.click(),e.remove(),c("Backup exportado")},async import(a){let e=a.files[0];if(e)try{let n=await e.text(),s=await G({title:"Importar backup",text:"Como deseja importar?",options:[{label:"Juntar com os dados atuais",value:"merge",primary:!0},{label:"Substituir tudo",value:"replace",danger:!0}]});if(!s)return;await o.importData(n,{replace:s==="replace"}),c("Backup importado")}catch{c("Arquivo inv\xE1lido")}finally{a.value=""}},async clearAll(){await K({title:"Apagar TUDO?",text:"Empresas, eventos e bilhetes ser\xE3o apagados. Exporte um backup antes, se precisar.",ok:"Apagar tudo",danger:!0})&&(await o.clearAll(),c("Tudo apagado"))}};export{ka as a,wa as b,Ta as c,ae as d,u as e,ee as f};
