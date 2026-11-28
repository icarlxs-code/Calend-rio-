import{a as ca}from"./c-ENUZBNMB.js";import{a as R,b as la}from"./c-CPV6EDIF.js";import{a as ia,d as ra}from"./c-T4ONIV3L.js";import{g as da}from"./c-SAYJUKSA.js";import{a as M}from"./c-SDVQCYF5.js";import{e as j,g as O}from"./c-XMNKMO7S.js";import{a as I,d as na}from"./c-IUW32YCK.js";import{a as ta}from"./c-6PVVLET6.js";import{a as sa}from"./c-5KDN44MS.js";import{a as N}from"./c-OC23PVYB.js";import{a as oa}from"./c-MPQC26Q2.js";import{d as q,e as x,f as J,j as E,m as X,n as Z,o as aa}from"./c-4L5JYTPA.js";import{d as w,v as c,w as P,x as ea}from"./c-RPEFTOFW.js";import{b as s}from"./c-6LZWOCXP.js";import{g as t}from"./c-WFYKSZFP.js";import{a as m}from"./c-AQ2ADUWO.js";import{a as $,b as S,c as v,f,g as Q,l as K,w as Y}from"./c-JRZKGWYQ.js";import{f as F}from"./c-S22CTDX7.js";import{B as r,H as k,d as D,e as W,o as G}from"./c-MPTN5RTT.js";var y=0,ma=(a=600)=>(y=Math.max(y,Date.now()+a),y),Pa=()=>y,La=()=>Date.now()<y;var V="lembra.theme",ua=[{id:"auto",label:"Autom\xE1tico",hint:"segue o celular"},{id:"light",label:"Claro",hint:"sempre claro"},{id:"dark",label:"Escuro",hint:"modo noturno"}],H=()=>{try{return localStorage.getItem(V)||"auto"}catch{return"auto"}};function ga(){let a=H();a==="light"||a==="dark"?document.documentElement.dataset.theme=a:delete document.documentElement.dataset.theme}function Fa(a){try{a==="light"||a==="dark"?localStorage.setItem(V,a):localStorage.removeItem(V)}catch{}ga()}var pa=(a,e)=>{let n=parseInt(a.slice(1),16);return`rgba(${n>>16&255}, ${n>>8&255}, ${n&255}, ${e})`};function Na(){let a=document.getElementById("proftheme"),e=v.theme;if(!e){a&&(a.textContent="");return}a||(a=document.createElement("style"),a.id="proftheme",document.head.appendChild(a));let n=`--brand:${e.accent};--brand-soft:${pa(e.accent,.1)}`,o=`--brand:${e.dark};--brand-soft:${pa(e.dark,.14)}`;a.textContent=`@media (prefers-color-scheme: light){:root[data-space="work"]:not([data-theme="dark"]){${n}}}
:root[data-space="work"][data-theme="light"]{${n}}
@media (prefers-color-scheme: dark){:root[data-space="work"]:not([data-theme="light"]){${o}}}
:root[data-space="work"][data-theme="dark"]{${o}}`}var L=a=>$[S[a]||"outro"]?.label||"Compromisso",ba=(a=3)=>S.slice(0,a).map(e=>$[e]?.label.toLowerCase()).join(", "),z="pauta.onboarded",C="pauta.notifyAskedAt";function Ua(){if(!localStorage.getItem(z))return U(t.solo?["notify","done"]:t.me?["welcome","notify","done"]:["welcome","who","notify","done"]);if(!t.me&&t.mode==="local")return U(["who"]);let e=Number(localStorage.getItem(C)||0);if(k()&&q()==="default"&&Date.now()-e>3*864e5)return U(["notify"])}function _(a,e,n="agora"){return`<div class="nprev">
    <img src="icons/icon-192.png" alt="">
    <div><div class="nprev__top"><b>${r(m.appName.toUpperCase())}</b><span>${r(n)}</span></div>
    <strong>${r(a)}</strong><p>${r(e)}</p></div>
  </div>`}function _a(a,e,n){let o=t.member(t.me),d=t.team.find(l=>l.id!==t.me)||t.team[1]||t.team[0],i=n>1?`<div class="ob__dots">${Array.from({length:n},(l,u)=>`<i class="${u===e?"is-on":""}"></i>`).join("")}</div>`:"";return a==="welcome"?`<div class="ob__art"><img class="ob__icon" src="icons/icon-512.png" alt=""></div>
      <h1>Bem-vindo ao ${r(m.appName)}</h1>
      <p>Eu lembro de tudo por voc\xEA: trabalho, estudos e vida pessoal, num lugar s\xF3.</p>
      ${i}
      <button class="btn btn--primary btn--block" data-next>Come\xE7ar</button>`:a==="who"?`<div class="ob__art ob__art--sm">${s("user",34)}</div>
      <h1>Quem vai usar este celular?</h1>
      <p>Assim o app sabe de quem s\xE3o os lembretes e avisa o parceiro quando voc\xEA marcar algo.</p>
      <div class="whogrid ob__who">${t.team.map(l=>`<button class="whobtn${t.me===l.id?" is-on":""}" style="--mc:${l.color}" data-me="${l.id}">${w(l.id,36)}<span>${r(l.name)}</span><i class="whobtn__check">${s("check",14)}</i></button>`).join("")}</div>
      ${i}
      <button class="btn btn--primary btn--block" data-next ${t.me?"":"disabled"}>Continuar</button>`:a==="notify"?f()?`<div class="ob__previews">
        ${_("Daqui a 2h: Reels \xB7 Caf\xE9 Aroma","18h \u2014 postar o Reels \u201CBastidores\u201D","agora")}
        ${_(`${d?.name||"Sua equipe"} marcou para voc\xEA`,"Story \xB7 Caf\xE9 Aroma \u2014 amanh\xE3, 16h","h\xE1 2 min")}
        ${_(`Bom dia, ${o?.name||"voc\xEA"}! Seu dia hoje`,"5 tarefas \xB7 primeira: 11h30 Feed \xB7 Studio Fit","8:00")}
      </div>
      <h1>Nunca mais esque\xE7a um post</h1>
      <p>Lembretes 2h e 30 min antes de cada post, aviso na v\xE9spera das capta\xE7\xF5es, cobran\xE7a se algo ficou para tr\xE1s e aviso quando o parceiro marcar algo para voc\xEA.</p>
      <div data-notify-msg></div>
      ${i}
      <button class="btn btn--primary btn--block" data-enable>${s("bell",18)} Ativar notifica\xE7\xF5es</button>`:`<div class="ob__previews">
        ${_(`Daqui a 1h: ${L(0)}`,`14h \u2014 ${L(0).toLowerCase()} marcada na sua agenda`,"agora")}
        ${_(`${$[S[0]]?.ask||"J\xE1 fez?"} ${L(0)}`,"Se j\xE1 resolveu, toque e marque como feito \u2713","14:00")}
        ${_(`Bom dia, ${o?.name||""}! Seu dia hoje`,`4 compromissos \xB7 primeiro: 8h ${L(1)}`,"7:20")}
      </div>
      <h1>Nunca mais esque\xE7a um compromisso</h1>
      <p>Avisos antes de cada ${r(ba(2))}, uma pergunta na hora exata e cobran\xE7a se algo ficar para tr\xE1s.</p>
      <div data-notify-msg></div>
      ${i}
      <button class="btn btn--primary btn--block" data-enable>${s("bell",18)} Ativar notifica\xE7\xF5es</button>`:`<div class="ob__art ob__art--ok">${s("check",40)}</div>
    <h1>Tudo pronto${o?", "+r(o.name):""}!</h1>
    <ul class="ob__tips">
      <li>${s("plus",18)}<span>Toque no <b>+</b> para marcar ${f()?"posts, capta\xE7\xF5es e reuni\xF5es":r(ba(3))}.</span></li>
      <li>${s("sparkle",18)}<span>O <b>Assistente</b> avisa conflitos e ${f()?"sugere os melhores hor\xE1rios":"marca as coisas por voc\xEA: \xE9 s\xF3 escrever"}.</span></li>
      ${f()?`<li>${s("link",18)}<span>Em <b>Empresas</b>, mande para cada cliente o link do cronograma dele.</span></li>`:`<li>${s(v.entity.icon,18)}<span>Em <b>${r(K(!0))}</b>, organize ${r(v.entity.hint||"seus compromissos por grupo")}.</span></li>`}
    </ul>
    ${i}
    <button class="btn btn--primary btn--block" data-next>Abrir a agenda</button>`}function U(a){if(document.querySelector(".ob"))return;let e=0,n=document.createElement("div");n.className="ob",n.innerHTML='<div class="ob__card"></div>',document.body.appendChild(n),requestAnimationFrame(()=>n.classList.add("is-in"));let o=n.querySelector(".ob__card"),d=()=>{(a.includes("welcome")||a.includes("done"))&&localStorage.setItem(z,"1"),n.classList.remove("is-in"),setTimeout(()=>n.remove(),400)},i=g=>{if(g>=a.length)return d();e=g,o.classList.remove("is-shown"),setTimeout(()=>{o.innerHTML=_a(a[e],e,a.length),u(),o.classList.add("is-shown")},o.innerHTML?180:0)},l=(g,h="info")=>{let b=o.querySelector("[data-notify-msg]");b&&(b.innerHTML=`<div class="ob__msg ob__msg--${h}">${g}</div>`)},u=()=>{o.querySelectorAll("[data-next]").forEach(b=>b.onclick=()=>i(e+1)),o.querySelectorAll("[data-me]").forEach(b=>b.onclick=()=>{t.setMe(b.dataset.me),o.querySelectorAll("[data-me]").forEach(A=>A.classList.toggle("is-on",A===b)),o.querySelector("[data-next]").disabled=!1});let g=o.querySelector("[data-skip]");g&&(g.onclick=()=>{localStorage.setItem(C,String(Date.now())),i(e+1)});let h=o.querySelector("[data-enable]");h&&(h.onclick=async()=>{if(localStorage.setItem(C,String(Date.now())),x()){l(`<b>Primeiro instale o app.</b> No iPhone, as notifica\xE7\xF5es s\xF3 funcionam pelo \xEDcone da Tela de In\xEDcio:<br>
          1. Toque em ${s("share",14)} <b>Compartilhar</b><br>2. <b>Adicionar \xE0 Tela de In\xEDcio</b><br>3. Abra o ${r(m.appName)} pelo \xEDcone`,"warn"),h.outerHTML='<button class="btn btn--primary btn--block" data-next>Entendi</button>',u();return}h.disabled=!0,h.innerHTML="Aguardando permiss\xE3o\u2026";let b=await E().catch(()=>({ok:!1,reason:"error"}));b.ok?(b.local?l("Ativado neste celular. Para os avisos chegarem com o app fechado e no celular do parceiro, falta ligar o servidor de notifica\xE7\xF5es (Ajustes \u2192 Notifica\xE7\xF5es).","ok"):(l("Pronto! Voc\xEA vai receber uma notifica\xE7\xE3o de teste em instantes.","ok"),import("./c-4KGZFEQ4.js").then(A=>A.checkup())),h.outerHTML='<button class="btn btn--primary btn--block" data-next>Continuar</button>',o.querySelector("[data-skip]")?.remove(),u()):b.reason==="server"?(l("Permiss\xE3o concedida! O servidor de notifica\xE7\xF5es ainda n\xE3o foi publicado; quando for, este celular \xE9 cadastrado sozinho.","ok"),h.outerHTML='<button class="btn btn--primary btn--block" data-next>Continuar</button>',u()):b.reason==="denied"?(l(`As notifica\xE7\xF5es foram bloqueadas. Para ligar depois: <b>Ajustes do iPhone \u2192 Notifica\xE7\xF5es \u2192 ${r(m.appName)}</b>.`,"warn"),h.outerHTML='<button class="btn btn--primary btn--block" data-next>Continuar</button>',u()):(l("Este aparelho n\xE3o aceita notifica\xE7\xF5es deste app.","warn"),h.disabled=!1,h.innerHTML="Tentar de novo")})};i(0)}function ha(){localStorage.removeItem(z),localStorage.removeItem(C),c("A apresenta\xE7\xE3o aparece na pr\xF3xima abertura")}var va=()=>!!t.user&&String(t.user.email||"").toLowerCase()===String(m.adminEmail||"").toLowerCase();function ve(){let a=t.member(t.me),e=t.mode==="cloud",n="Notification"in window&&Notification.permission==="granted";return e&&setTimeout(()=>{Sa(),la()},0),`
  <header class="hdr">
    <div class="hdr__row"><div class="hdr__titles"><p class="hdr__eyebrow">${r(m.appName)}</p><h1>Ajustes</h1></div></div>
  </header>
  <div class="page">
    ${t.solo?qa():""}
    <section class="block">
      <div class="glist">
        ${p({cls:"pbig--toPersonal",attrs:'data-action="space" data-space="personal"',ic:"heart",c:"#FF2D55",t:"Modo Pessoal",s:"Anivers\xE1rios, compromissos e listas \u2014 s\xF3 voc\xEA v\xEA"})}
        ${e?ya():""}
        ${e&&t.solo?p({cls:"pbig--share",attrs:'data-action="share"',ic:"users",c:"#34C759",t:"Agenda compartilhada",s:t.shared?`Voc\xEA est\xE1 na agenda de ${r(t.shared.ownerName)}`:t.billing?.addon?.active?`Plano ${t.billing.addon.plan==="equipe"?"Equipe":"Dupla"} ativo \xB7 convide e gerencie`:"Divida a agenda com s\xF3cio ou equipe \xB7 \xE0 parte"}):""}
        ${t.team.length>1?p({attrs:'data-action="team-board"',ic:"trophy",c:"#FF9F0A",t:"Placar da equipe",s:"Quem cumpriu o que marcou nesta semana"}):""}
        ${p({attrs:'data-action="profile"',ic:"crown",c:"#AF52DE",t:"Perfil e conquistas",s:"Seu n\xEDvel, XP e emblemas"})}
        ${e&&ca()?p({attrs:t.profile?.phoneVerified?"":'data-action="confirm-phone"',ic:"shield",c:t.profile?.phoneVerified?"#34C759":"#0A84FF",t:t.profile?.phoneVerified?"Celular confirmado \u2713":"Confirmar meu celular",s:t.profile?.phoneVerified?r(t.profile.phone||"")+" \xB7 d\xE1 para recuperar a senha por SMS":"Protege a conta e permite recuperar a senha por SMS"}):""}
        ${p({attrs:'data-action="guide"',ic:"sparkles",c:"#5856D6",t:"Como funciona o Lembra",s:"Trabalho e Pessoal em 1 minuto"})}
        ${p({attrs:'data-action="snh-toggle"',ic:"bell",c:"#FF6B1A",t:"Lembra na tela",s:(()=>{try{return localStorage.getItem("lembra.companheiroOff")==="1"}catch{return!1}})()?"Escondido \xB7 toque para ele voltar":"Aparecendo \xB7 arraste ele pra onde quiser"})}
        ${e?p({attrs:'data-action="ia-toggle"',ic:"sparkle",c:"#FF6B1A",t:"Intelig\xEAncia artificial",s:N()===!0?"Ativada \xB7 toque para desativar":N()===!1?"Desativada \xB7 nada \xE9 enviado para a IA":"Ainda n\xE3o decidiu \xB7 toque para ver como funciona"}):""}
        ${e?p({cls:"pbig--privacy",attrs:'data-action="privacy"',ic:"lock",c:"#8E8E93",t:"Privacidade e dados",s:"Termos, baixar ou apagar meus dados"}):""}
        ${e&&t.solo?p({attrs:'data-action="ranking"',ic:"trophy",c:"#FF9F0A",t:"Ranking da semana",s:t.billing?.plan==="monthly"&&t.billing?.tier!=="essencial"?"Ligas semanais \xB7 o n\xBA 1 do m\xEAs ganha o m\xEAs seguinte gr\xE1tis":"Plano Profissional \xB7 ligas e meses gr\xE1tis"}):""}
        ${e?(t.user?.email||"").toLowerCase()===(m.adminEmail||"").toLowerCase()?p({attrs:'data-action="support" data-allow-locked',ic:"headset",c:"#0A84FF",t:"Mensagens de suporte",s:"O que os clientes escreveram \xB7 toque para responder"}):p({attrs:'data-action="support" data-allow-locked',ic:"headset",c:"#0A84FF",t:"Falar com o suporte",s:"Chat com a equipe do Lembra \xB7 respondemos em at\xE9 24h"}):m.supportWhatsapp||m.supportEmail?p({attrs:'data-action="support"',ic:m.supportWhatsapp?"phone":"mail",c:m.supportWhatsapp?"#25D366":"#0A84FF",t:"Ajuda e atendimento",s:m.supportWhatsapp?"Fale com a gente no WhatsApp":"Fale com a gente por e-mail"}):""}
      </div>
    </section>
    ${e&&(t.user?.email||"").toLowerCase()===(m.adminEmail||"").toLowerCase()?`<section class="block"><div class="glist">${p({attrs:'data-action="admin"',ic:"chart",c:"#0A84FF",t:"Painel do dono",s:"Receita, pessoas e sa\xFAde do app"})}</div></section>`:""}
    ${e&&window.__equipe?.perms?.length?`<section class="block"><div class="glist">${p({attrs:'data-action="staff"',ic:"shield",c:"#5856D6",t:"Painel da equipe",s:"N\xFAmeros, suporte, den\xFAncias e equipe (conforme o seu cargo)"})}</div></section>`:""}
    <section class="block">
      <h2 class="block__title">${s("user",16)} ${e?"Sua conta":"Quem est\xE1 usando este celular?"}</h2>
      ${e?`<div class="card whocard">
            <div class="whocard__top">${a?w(a.id,48):s("user",24)}<div class="whocard__txt"><strong>${r(a?.name||t.user?.email||"")}${va()?`<span class="vbadge">${s("crown",12)} Propriet\xE1rio</span>`:t.billing?.plan==="lifetime"?`<span class="vbadge">${s("crown",12)} ${t.billing?.founderTeam||t.billing?.comp&&!t.billing?.vip&&m.team.some(o=>(o.email||"").toLowerCase()===(t.user?.email||"").toLowerCase())?"Fundador":"Vital\xEDcio"}</span>`:""}</strong><small>${r(t.user?.email||"")}</small></div></div>
            <div class="whocard__btns">${t.solo?`<button class="btn btn--soft btn--sm" data-action="edit-profile">${s("edit",16)} Editar perfil</button>`:""}
            <button class="btn btn--danger-soft btn--sm" data-action="logout">${s("logout",16)} Sair da conta</button></div></div>`:`<div class="whogrid">${t.team.map(o=>`<button class="whobtn${t.me===o.id?" is-on":""}" style="--mc:${o.color}" data-action="set-me" data-p="${o.id}">${w(o.id,34)}<span>${r(o.name)}</span><i class="whobtn__check">${s("check",14)}</i></button>`).join("")}</div>
           <p class="fhelp">Usado para sauda\xE7\xE3o, \u201CCriado por\u201D e nos lembretes.</p>`}
    </section>

    ${wa()}

    ${Ea()}

    <section class="block">
      <h2 class="block__title">${s("sparkle",16)} Assistente e Claude</h2>
      <div class="card card--row">
        ${s("sparkle",22)}
        <div><strong>Assistente autom\xE1tico ativo</strong><small>Confere conflitos, tempo livre e melhores hor\xE1rios sozinho, sem internet e sem chave.</small></div>
        <button class="btn btn--soft btn--sm" data-action="assistant">Abrir</button>
      </div>
      <p class="fhelp">Para perguntas abertas (ideias, reorganizar a semana), use \u201CPerguntar ao Claude\u201D no Assistente. Abre o Claude com o seu login normal, sem chave de API.</p>
    </section>

    ${Aa()}

    <section class="block">
      <h2 class="block__title">${s("calendar",16)} Lembretes no Calend\xE1rio do iPhone</h2>
      <div class="card">
        <p>Envie a agenda para o <b>Calend\xE1rio do iPhone</b> com alarmes. Assim o celular avisa na hora certa, mesmo com o app fechado.</p>
        <div class="btnrow">
          <button class="btn btn--primary btn--sm" data-action="ics" data-who="me" data-days="7">${s("download",16)} Minha semana</button>
          <button class="btn btn--soft btn--sm" data-action="ics" data-who="me" data-days="30">Meus 30 dias</button>
          ${t.team.length>1?`<button class="btn btn--soft btn--sm" data-action="ics" data-who="all" data-days="7">Semana da ${Q()}</button>`:""}
        </div>
        <p class="fhelp">No iPhone, toque em \u201CCalend\xE1rio\u201D ou abra o arquivo baixado e escolha \u201CAdicionar tudo\u201D. Se mudar algo depois, exporte de novo.</p>
      </div>
    </section>

    <section class="block">
      <h2 class="block__title">${s("cloud",16)} Sincroniza\xE7\xE3o</h2>
      <div class="card card--row ${e?"card--ok":"card--warn"}">
        ${s(e?"cloud":"phone",22)}
        <div><strong>${e?"Sincronizado na nuvem":"Salvo s\xF3 neste aparelho"}</strong>
        <small>${e?t.solo?"Sua agenda fica salva na sua conta e aparece igual em qualquer celular em que voc\xEA entrar.":"Sua equipe e os links dos clientes veem tudo em tempo real.":"Para ver a mesma agenda em celulares diferentes, ative a nuvem (gratuito). Veja o guia no README do projeto."}</small></div>
      </div>
    </section>

    ${k()?"":`<section class="block">
      <h2 class="block__title">${s("phone",16)} Instalar como app</h2>
      <div class="card">
        <ol class="steps">
          <li>Abra este endere\xE7o no <b>Safari</b>.</li>
          <li>Toque em ${s("share",15)} <b>Compartilhar</b>.</li>
          <li>Escolha <b>Adicionar \xE0 Tela de In\xEDcio</b>.</li>
        </ol>
        <p class="fhelp">O app abre em tela cheia, como um aplicativo normal.</p>
      </div>
    </section>`}

    ${f()?`<section class="block">
      <h2 class="block__title">${s("bulb",16)} Melhores hor\xE1rios (refer\xEAncia)</h2>
      <div class="card card--flush">
        <ul class="besttimes">
          ${Y.map(o=>`<li><span class="tbadge tbadge--${o.type}">${s($[o.type].icon,13)}${$[o.type].label}</span><span>${r(o.text)}</span></li>`).join("")}
        </ul>
        <p class="fhelp pad">M\xE9dias de mercado. Confiram os Insights do Instagram de cada cliente e ajustem: cada p\xFAblico tem seu hor\xE1rio de pico.</p>
      </div>
    </section>`:""}

    <section class="block">
      <h2 class="block__title">${s("download",16)} Dados e backup</h2>
      <div class="list">
        <button class="list__row" data-action="export">${s("download",18)}<span>Exportar backup (.json)</span>${s("right",16,"muted")}</button>
        <label class="list__row">${s("upload",18)}<span>Importar backup</span><input type="file" accept="application/json,.json" data-action-change="import" hidden>${s("right",16,"muted")}</label>
        ${t.demo?`<button class="list__row" data-action="clear-demo">${s("sparkle",18)}<span>Apagar dados de exemplo</span>${s("right",16,"muted")}</button>`:""}
        <button class="list__row" data-action="lixeira">${s("trash",18)}<span>Lixeira (24 horas)</span>${s("right",16,"muted")}</button>
        <button class="list__row is-danger" data-action="clear-all">${s("trash",18)}<span>Apagar tudo</span>${s("right",16,"muted")}</button>
      </div>
      <p class="fhelp">${t.state.companies.length} empresas \xB7 ${t.state.events.length} eventos \xB7 ${t.state.notes.length} bilhetes</p>
    </section>
    <section class="block">
      <h2 class="block__title">${s("refresh",16)} Vers\xE3o do app</h2>
      <div class="list">
        <div class="list__row list__row--static"><span><b>${r(m.appName)} ${r(I)}</b><small>Atualiza sozinho sempre que voc\xEA abre \xB7 c\xF3digo ${r(na)}</small></span><span class="verok">${s("check",14)} em dia</span></div>
        <button class="list__row" data-action="whatsnew">${s("sparkles",18)}<span>Novidades desta vers\xE3o</span>${s("right",16,"muted")}</button>
        <button class="list__row" data-action="check-update">${s("refresh",18)}<span>Procurar atualiza\xE7\xE3o agora</span>${s("right",16,"muted")}</button>
      </div>
    </section>
    ${e?`<section class="block">
      <button class="logoutbig" data-action="logout">${s("logout",20)}<span>Sair da conta</span></button>
      <p class="fhelp center">Conectado como ${r(t.user?.email||"")}</p>
    </section>`:""}
    <div class="about">${ta("palavra",{h:22,alt:r(m.appName)})}<small>vers\xE3o ${r(I)} \xB7 sua agenda de trabalho e pessoal</small></div>
  </div>`}var ka=()=>{try{return localStorage.getItem("lembra.motion")!=="0"}catch{return!0}};function wa(){let a=H();return`<section class="block">
    <h2 class="block__title">${s("sun",16)} Apar\xEAncia</h2>
    <div class="seg3">${ua.map(e=>`<button class="seg3__btn${a===e.id?" is-on":""}" data-action="theme" data-v="${e.id}">${s(e.id==="dark"?"moon":e.id==="light"?"sun":"phone",18)}<b>${e.label}</b><small>${e.hint}</small></button>`).join("")}</div>
    <div class="list" style="margin-top:10px"><label class="list__row"><span><b>Sons</b><small>Toque suave ao trocar de modo e ao concluir</small></span><input type="checkbox" class="switch" data-sound ${oa()?"checked":""}></label><label class="list__row"><span><b>Anima\xE7\xF5es</b><small>Trocas de tela, bot\xF5es e agendamento</small></span><input type="checkbox" class="switch" data-motion ${ka()?"checked":""}></label><label class="list__row"><span><b>Piadas do Lembra</b><small>Trocadilhos e brincadeiras nas falas e nos avisos</small></span><input type="checkbox" class="switch" data-humor ${sa()?"checked":""}></label></div>
    ${!f()&&v.theme?`<p class="fhelp">As cores do modo Trabalho combinam com a sua \xE1rea${v.profession?` (${r(F(v.profession,t.profile?.pronoun))})`:""}.</p>`:""}
  </section>`}var p=({cls:a="",attrs:e="",ic:n,c:o,t:d,s:i="",badge:l=""})=>`<button class="glist__row ${a}" ${e}><span class="glist__ic" style="--c:${o}">${s(n,18)}</span><span class="glist__txt"><b>${r(d)}</b>${i?`<small>${i}</small>`:""}</span>${l?`<span class="glist__badge">${r(l)}</span>`:""}${s("right",16)}</button>`;function ya(){let a=t.profile||{};return a.onboardedAt?p({cls:"pbig--ficha",attrs:'data-action="ficha"',ic:!f()&&v.badge?v.badge:"idcard",c:"#FF9500",t:"Sua ficha",s:`${r(F(a.profession,a.pronoun)||"Profiss\xE3o")} \xB7 \xEDndice ${Number(a.index)||0}/100`,badge:""}):p({cls:"pbig--ficha",attrs:'data-action="ficha"',ic:"idcard",c:"#FF9500",t:"Preencha sua ficha",s:"2 minutos: o Lembra se adapta a voc\xEA"})}function Aa(){let a=q(),e=x(),n=t.mode==="cloud",o=!!localStorage.getItem("pauta.device"),d=J(),i,l,u="";return e?(i="warn",l="No iPhone, as notifica\xE7\xF5es s\xF3 funcionam com o app instalado na Tela de In\xEDcio.",u='<button class="btn btn--primary btn--sm" data-action="install-guide">Como instalar</button>'):a==="unsupported"?(i="warn",l="Este navegador n\xE3o aceita notifica\xE7\xF5es."):a==="denied"?(i="warn",l=`Bloqueadas. Para ligar: Ajustes do iPhone \u2192 Notifica\xE7\xF5es \u2192 ${m.appName}.`):a!=="granted"?(i="warn",l="Desativadas neste celular.",u='<button class="btn btn--primary btn--sm" data-action="notify-enable">Ativar</button>'):n&&o?(i="ok",l=t.team.length>1?"Ativadas. Os lembretes e os avisos do parceiro chegam mesmo com o app fechado.":"Ativadas. Seus lembretes chegam mesmo com o app fechado.",u='<button class="btn btn--soft btn--sm" data-action="notify-enable">Recadastrar</button>'):n?(i="warn",l="Permiss\xE3o concedida, mas este celular ainda n\xE3o foi cadastrado no servidor. Toque em Cadastrar.",u='<button class="btn btn--primary btn--sm" data-action="notify-enable">Cadastrar</button>'):(i="warn",l="Ativadas s\xF3 com o app aberto. Para receber com o app fechado e no celular do parceiro, ligue a nuvem e o servidor (README)."),`<section class="block">
    <h2 class="block__title">${s("bell",16)} Notifica\xE7\xF5es</h2>
    <div class="card card--row ${i==="ok"?"card--ok":"card--warn"}">
      ${s("bell",22)}
      <div><strong>${i==="ok"?"Funcionando":"Aten\xE7\xE3o"}</strong><small>${r(l)}</small></div>
      ${u}
    </div>
    <form class="list notif-prefs" data-notify-form onsubmit="return false">
      <label class="list__row"><span><b>Lembretes dos meus compromissos</b><small>antes do hor\xE1rio (como calculado na sua ficha), na hora e cobran\xE7a se atrasar</small></span><input type="checkbox" class="switch" name="reminders" ${d.reminders?"checked":""}></label>
      <label class="list__row"${t.team.length<2?" hidden":""}><span><b>Avisos do parceiro</b><small>quando marcar, mudar ou concluir algo</small></span><input type="checkbox" class="switch" name="partner" ${d.partner?"checked":""}></label>
      <label class="list__row"><span><b>Dicas do trabalho</b><small>${f()?"ideias de conte\xFAdo, trends e cobran\xE7as por empresa":"dicas pr\xE1ticas da sua profiss\xE3o e motiva\xE7\xE3o"}, em hor\xE1rios variados</small></span><input type="checkbox" class="switch" name="coach" ${d.coach?"checked":""}></label>
      <label class="list__row"><span><b>Resumo do dia</b><small>\xE0s 8h (hoje) e \xE0s 20h (amanh\xE3)</small></span><input type="checkbox" class="switch" name="daily" ${d.daily?"checked":""}></label>
    </form>
    ${n?'<div class="list" data-devices><div class="list__row"><span><small>Conferindo celulares cadastrados\u2026</small></span></div></div>':""}
    ${a==="granted"?`<button class="btn btn--soft btn--block" data-action="notify-test">${s("bell",16)} Enviar notifica\xE7\xE3o de teste</button>`:""}
    ${R()?`<h3 class="block__sub">Uso de hoje (gr\xE1tis)</h3>${R()}`:""}
    ${a==="granted"&&n?'<button class="btn btn--soft btn--block" data-action="coach-test">\u2728 Receber uma dica agora</button>':""}
    ${k()?"":`<button class="btn btn--soft btn--block" data-action="install-guide">${s("phone",16)} Instalar na tela inicial</button>`}
    <button class="btn-text btn-text--sm" data-action="onboarding-again">Ver a apresenta\xE7\xE3o de novo</button>
  </section>`}function Sa(){aa().then(a=>{let e=document.querySelector("[data-devices]");if(e){if(!a){e.innerHTML='<div class="list__row"><span><small>N\xE3o deu para conferir os celulares agora.</small></span></div>';return}e.innerHTML=t.team.map(n=>{let o=a[n.id]||0;return`<div class="list__row devrow"><span><b>${r(n.name)}</b><small>${o?`${o} celular${o>1?"es":""} recebendo avisos`:"Nenhum celular cadastrado \u2014 n\xE3o recebe notifica\xE7\xF5es. Abra o app pelo \xEDcone \u2192 Ajustes \u2192 Notifica\xE7\xF5es \u2192 Ativar/Cadastrar."}</small></span><span>${o?"\u2705":"\u26A0\uFE0F"}</span></div>`}).join("")}})}function qa(){let a=t.billing||{},e={gratis:"Gr\xE1tis at\xE9 31/12/2026 (tudo liberado)",trial:"Teste gr\xE1tis (tudo liberado)",comp:"Acesso liberado",monthly:`${a.tier==="essencial"?"Essencial":"Profissional"} \xB7 ${a.prepaid?"12 meses no Pix":a.interval==="year"?"anual":"mensal"}`,lifetime:va()?"Propriet\xE1rio \xB7 acesso total":a.vip?"Lembra Vital\xEDcio":a.founder?"Fundadores \xB7 Profissional para sempre":"Vital\xEDcio",expired:"Teste encerrado",blocked:"Sem plano",none:"Sem plano",shared:"Agenda compartilhada",checking:"Conferindo\u2026",offline:"Sem conex\xE3o para conferir"}[a.plan]||"\u2014",n=a.plan==="gratis"?"Lan\xE7amento do Lembra: todos os recursos liberados, inclusive o assistente com IA. Ningu\xE9m \xE9 cobrado sem escolher assinar.":a.plan==="trial"?`Termina em ${da(a.trialEndsAt-Date.now())}`:a.plan==="monthly"?a.prepaid?`Pago at\xE9 ${new Date(a.paidUntil).toLocaleDateString("pt-BR")} \xB7 perto de vencer, \xE9 s\xF3 renovar`:a.cancelAt?`Cancelada: vale at\xE9 ${new Date(a.cancelAt).toLocaleDateString("pt-BR")}`:a.paidUntil?`Renova em ${new Date(a.paidUntil).toLocaleDateString("pt-BR")}`:"Ativa":a.plan==="lifetime"?a.vip?`Membro N\xBA ${String(a.vip.no).padStart(3,"0")} \xB7 desde ${new Date(a.vip.at).toLocaleDateString("pt-BR")}. Presente de cortesia do Lembra (veja os Termos de Uso).`:a.comp?"Acesso cortesia liberado pelo Lembra.":"Pago uma vez, para sempre. Obrigado!":a.plan==="comp"?`Acesso liberado pelo Lembra at\xE9 ${new Date(a.compUntil).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"})}. Depois disso, \xE9 s\xF3 escolher um plano.`:a.plan==="shared"?`Liberado pela agenda de ${t.shared?.ownerName||a.ownerName||"quem te convidou"}. Voc\xEA n\xE3o paga nada.`:"",o=i=>(a.plan==="lifetime"?{dupla:"4,90",equipe:"19,90"}:{dupla:"7,90",equipe:"29,90"})[i],d=a.addon&&a.addon.active?`<div class="card card--row"><div><strong>+ Agenda compartilhada ${a.addon.plan==="equipe"?`Equipe \xB7 R$ ${o("equipe")}/m\xEAs`:`Dupla \xB7 R$ ${o("dupla")}/m\xEAs`}</strong><small>${a.addon.cancelAt?`Cancelada: vale at\xE9 ${new Date(a.addon.cancelAt).toLocaleDateString("pt-BR")}`:"Complemento mensal, cobrado \xE0 parte"}</small></div><button class="btn btn--soft btn--sm" data-action="share">Ver</button></div>`:"";return`<section class="block">
    <h2 class="block__title">${s("card",16)} Seu plano</h2>
    <div class="card card--row"><div><strong>${r(e)}</strong>${n?`<small>${r(n)}</small>`:""}</div>
      ${a.plan==="lifetime"&&a.vip&&!a.addon?'<button class="btn btn--soft btn--sm" data-action="vip-card">Ver cart\xE3o</button>':a.plan==="monthly"&&a.prepaid?a.paidUntil-Date.now()<30*864e5?'<button class="btn btn--primary btn--sm" data-action="plans">Renovar</button>':"":a.plan==="monthly"||a.plan==="lifetime"&&a.addon?'<button class="btn btn--soft btn--sm" data-action="billing-portal">Gerenciar</button>':["lifetime","shared"].includes(a.plan)?"":'<button class="btn btn--primary btn--sm" data-action="plans">Assinar</button>'}
    </div>
    ${a.plan==="monthly"&&a.tier==="essencial"?`<button class="card card--row upgrade" data-action="billing-portal">${s("crown",20)}<div><strong>Passe para o Profissional</strong><small>Assistente com IA, cobran\xE7a de atraso e ranking com meses gr\xE1tis. Troque em \u201CGerenciar\u201D.</small></div>${s("right",16)}</button>`:""}
    ${a.plan==="monthly"&&(a.foundersLeft??0)>0?`<button class="card card--row upgrade" data-action="plans">${s("crown",20)}<div><strong>Vire Fundador</strong><small>R$ 199 uma vez: o Profissional para sempre. S\xF3 ${a.foundersLeft} vagas. A assinatura \xE9 cancelada na hora.</small></div>${s("right",16)}</button>`:""}
    ${d}
  </section>`}var T=a=>String(a||"").replace(/^0/,"").replace(":00","h").replace(":","h"),xa=["domingo","segunda","ter\xE7a","quarta","quinta","sexta","s\xE1bado"];function fa(a){let e=[...a.daysOff||[]].sort((n,o)=>n-o).map(n=>xa[n]);return`Voc\xEA trabalha das <b>${T(a.workStart)}</b> \xE0s <b>${T(a.workEnd)}</b>, almo\xE7a das <b>${T(a.lunchStart)}</b> \xE0s <b>${T(a.lunchEnd)}</b>${e.length?` e folga ${e.length===1?"no":"em"} <b>${e.join(", ").replace(/, ([^,]*)$/," e $1")}</b>`:" e n\xE3o tem dia de folga"}.`}function Ea(){let a=M(),e=[[0,"N\xE3o preciso de tempo entre eles"],[15,"15 minutos"],[30,"30 minutos"],[45,"45 minutos"],[60,"1 hora"],[90,"1 hora e meia"]];return`<section class="block">
    <h2 class="block__title">${s("clock",16)} Seu dia de trabalho</h2>
    <p class="rot__lead">Conte como \xE9 o seu dia. Com isso o Lembra <b>n\xE3o marca nada</b> no seu almo\xE7o, na sua folga ou fora do expediente, e avisa quando o dia estiver cheio demais.</p>
    <div class="rot__resumo">${s("sparkles",16)}<span data-rt-resumo>${fa(a)}</span></div>
    <form class="rot" data-routine-form onsubmit="return false">
      <div class="rot__card"><div class="rot__q"><span class="rot__ic" style="--c:#0A84FF">${s("briefcase",18)}</span><div><b>Que horas voc\xEA come\xE7a e termina de trabalhar?</b><small>Fora desse hor\xE1rio o Lembra n\xE3o marca compromisso de trabalho.</small></div></div>
        <div class="rot__times"><span>Das</span><input type="time" name="workStart" value="${a.workStart}" aria-label="Come\xE7o do expediente"><span>\xE0s</span><input type="time" name="workEnd" value="${a.workEnd}" aria-label="Fim do expediente"></div></div>
      <div class="rot__card"><div class="rot__q"><span class="rot__ic" style="--c:#FF9500">${s("utensils",18)}</span><div><b>Que horas \xE9 o seu almo\xE7o?</b><small>Esse hor\xE1rio fica livre: nada \xE9 marcado em cima dele.</small></div></div>
        <div class="rot__times"><span>Das</span><input type="time" name="lunchStart" value="${a.lunchStart}" aria-label="Come\xE7o do almo\xE7o"><span>\xE0s</span><input type="time" name="lunchEnd" value="${a.lunchEnd}" aria-label="Fim do almo\xE7o"></div></div>
      <div class="rot__card"><div class="rot__q"><span class="rot__ic" style="--c:#34C759">${s("sun",18)}</span><div><b>Em quais dias voc\xEA N\xC3O trabalha?</b><small>Toque nos dias de folga (eles ficam verdes). Nesses dias o Lembra deixa voc\xEA descansar.</small></div></div>
        <div class="rot__days">${G.map((n,o)=>`<label class="rot__day"><input type="checkbox" name="off" value="${o}"${a.daysOff.includes(o)?" checked":""}><span><b>${n}</b><small>${a.daysOff.includes(o)?"folga":"trabalho"}</small></span></label>`).join("")}</div></div>
      <div class="rot__card"><div class="rot__q"><span class="rot__ic" style="--c:#AF52DE">${s("car",18)}</span><div><b>Quanto tempo voc\xEA leva de um compromisso para o outro?</b><small>O Lembra deixa esse intervalo livre entre eles (tr\xE2nsito, deslocamento).</small></div></div>
        <select class="rot__sel" name="travelMin">${e.map(([n,o])=>`<option value="${n}"${a.travelMin===n?" selected":""}>${o}</option>`).join("")}</select></div>
      <div class="rot__card"><div class="rot__q"><span class="rot__ic" style="--c:#FF3B30">${s("listcheck",18)}</span><div><b>Quantos compromissos voc\xEA aguenta num dia?</b><small>Passou disso, o Lembra avisa que o dia est\xE1 pesado.</small></div></div>
        <select class="rot__sel" name="maxTasks">${[4,5,6,7,8,10,12,15,20].map(n=>`<option value="${n}"${a.maxTasks===n?" selected":""}>At\xE9 ${n} por dia</option>`).join("")}</select></div>
    </form>
    <p class="fhelp">Muda na hora, sem bot\xE3o de salvar.</p>
  </section>`}var fe={async notifyEnable(){let a=await E().catch(e=>({ok:!1,reason:"error",message:e.message}));a.ok?c(a.local?"Ativado (com o app aberto)":"Notifica\xE7\xF5es ativadas"):a.reason==="install"?c("Instale o app na Tela de In\xEDcio primeiro"):a.reason==="denied"?c("Bloqueado: libere em Ajustes do iPhone \u2192 Notifica\xE7\xF5es"):a.reason==="server"?c("Servidor de notifica\xE7\xF5es ainda n\xE3o publicado"):c(`N\xE3o foi poss\xEDvel ativar${a.message?": "+a.message:""}`,{ms:8e3}),t.emit()},async coachTest(){try{await ra(),c("Pronto! Uma dica chega em at\xE9 1 minuto (se for entre 8h30 e 21h30).",{ms:5e3})}catch{c("N\xE3o deu para pedir a dica agora. Verifique a conex\xE3o.")}},async notifyTest(){let a;try{a=await Z()}catch(e){return c(`Falhou: ${e.message}`,{ms:8e3})}if(a.kind==="not-registered")return c('Este celular ainda n\xE3o est\xE1 cadastrado. Toque em "Ativar" acima.',{ms:7e3});if(a.kind==="local")return c("Notifica\xE7\xE3o local mostrada (servidor n\xE3o configurado)");if(a.sent>0)return c("Enviada! Deve chegar em alguns segundos. Bloqueie a tela para ver.",{ms:7e3});if(!a.devices)return c('O servidor n\xE3o tem este celular cadastrado. Toque em "Ativar" de novo.',{ms:7e3});c(`A Apple n\xE3o aceitou o envio (${(a.statuses||[]).join(", ")||"sem resposta"}). Toque em "Ativar" de novo.`,{ms:9e3})},async notifyPrefs(a){await X({reminders:a.reminders.checked,partner:a.partner.checked,daily:a.daily.checked,coach:a.coach.checked}),c("Prefer\xEAncias salvas")},onboardingAgain(){ha()},async routine(a){let e=(i,l)=>/^\d{2}:\d{2}$/.test(a[i].value)?a[i].value:l,n=M(),o={id:"routine",workStart:e("workStart",n.workStart),workEnd:e("workEnd",n.workEnd),lunchStart:e("lunchStart",n.lunchStart),lunchEnd:e("lunchEnd",n.lunchEnd),travelMin:Number(a.travelMin.value),maxTasks:Number(a.maxTasks.value),daysOff:[...a.querySelectorAll('input[name="off"]:checked')].map(i=>Number(i.value))};if(o.workEnd<=o.workStart)return c("O fim do expediente precisa ser depois do in\xEDcio");if(o.lunchEnd<=o.lunchStart)return c("O fim do almo\xE7o precisa ser depois do in\xEDcio");ma(700),await t.upsert("settings",o);let d=a.closest(".block")?.querySelector("[data-rt-resumo]");d&&(d.innerHTML=fa(o)),a.querySelectorAll(".rot__day").forEach(i=>{let l=i.querySelector("input"),u=i.querySelector("small");l&&u&&(u.textContent=l.checked?"folga":"trabalho")})},async ics(a){let e=a.dataset.who==="me"?t.me:"all";if(a.dataset.who==="me"&&!t.me)return c("Escolha primeiro quem est\xE1 usando este celular");let n=Number(a.dataset.days),o=D(),d=t.eventsBetween(o,W(o,n),{person:e}).filter(l=>l.status!=="feito");if(!d.length)return c("Nada agendado nesse per\xEDodo");let i=e==="all"?`${m.appName} \u2013 Dupla`:`${m.appName} \u2013 ${t.member(e).name}`;await ia(d,`pauta-${e}-${o}.ics`,i)},export(){let a=new Blob([t.exportData()],{type:"application/json"}),e=document.createElement("a");e.href=URL.createObjectURL(a),e.download=`pauta-backup-${D()}.json`,document.body.appendChild(e),e.click(),e.remove(),c("Backup exportado")},async import(a){let e=a.files[0];if(e)try{let n=await e.text(),o=await ea({title:"Importar backup",text:"Como deseja importar?",options:[{label:"Juntar com os dados atuais",value:"merge",primary:!0},{label:"Substituir tudo",value:"replace",danger:!0}]});if(!o)return;if(o==="replace"){let i=t.state.events.length+t.state.companies.length+t.state.notes.length;if(i&&!await P({title:"Substituir tudo?",text:`${i} ${i===1?"item atual vai":"itens atuais v\xE3o"} para a lixeira por 24 horas e o backup entra no lugar.`,html:O([...t.state.events,...t.state.companies,...t.state.notes]),ok:"Substituir",danger:!0,digite:"APAGAR"}))return}let d=await t.importData(n,{replace:o==="replace"});d?j(d,"Backup importado \xB7 o que havia antes"):c("Backup importado")}catch{c("Arquivo inv\xE1lido")}finally{a.value=""}},async clearAll(){let a=[...t.state.events,...t.state.companies,...t.state.notes];if(!a.length)return c("N\xE3o h\xE1 nada para apagar.");await P({title:"Apagar TUDO?",text:`${a.length} ${a.length===1?"item vai":"itens v\xE3o"} para a lixeira por 24 horas. Depois disso, saem de vez.`,html:O(a),ok:"Continuar",danger:!0})&&await P({title:`Confirmar: apagar ${a.length} ${a.length===1?"item":"itens"}`,ok:`Apagar ${a.length}`,danger:!0,digite:"APAGAR"})&&j(await t.clearAll(),"Tudo apagado")}};export{Pa as a,La as b,Fa as c,Na as d,Ua as e,ve as f,p as g,fa as h,fe as i};
