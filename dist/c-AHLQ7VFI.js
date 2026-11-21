import{a as oa,d as ia}from"./c-P4WAK25G.js";import{a as L}from"./c-SXFYS7I7.js";import{a as ta}from"./c-SHLXIQTW.js";import{a as D,d as sa}from"./c-JY3PP7AB.js";import{f as na}from"./c-J5YIHJUL.js";import{d as _,r as c,s as K,t as J}from"./c-DGBUYXTR.js";import{a as H}from"./c-6PVVLET6.js";import{a as Q,d as A,e as S,f as Y,g as X,i as x,l as Z,m as E,n as aa}from"./c-CKG5YU5N.js";import{a as ea}from"./c-XQMLTXRG.js";import{b as n}from"./c-M4BGKEOZ.js";import{f as t}from"./c-YTXRI5XI.js";import{B as i,H as w,d as T,e as V,o as U}from"./c-ZUAJ4OTH.js";import{a as d}from"./c-PVDXWGYP.js";import{D as G,f as C,h as $,i as y,j as f,m as v,n as z,s as W}from"./c-LQRWGXTC.js";var pa=()=>!!t.user&&!!d.adminEmail&&(t.user.email||"").toLowerCase()===d.adminEmail.toLowerCase(),F=()=>t.mode==="cloud"&&Q()&&pa()?'<div class="list" data-usage><div class="list__row"><span><small>Conferindo o uso de hoje\u2026</small></span></div></div>':"";async function ra(a=document){let e=a.querySelector("[data-usage]");if(!e)return;let o=null;try{o=await X("/usage",{})}catch{o=null}if(!e.isConnected)return;if(!o||!o.ok){e.innerHTML='<div class="list__row"><span><small>N\xE3o deu para conferir agora.</small></span></div>';return}let s=(l,r,m="")=>`<div class="list__row"><span><b>${i(l)}</b>${m?`<small>${i(m)}</small>`:""}</span><strong>${i(String(r))}</strong></div>`,p=o.lembretes+o.pessoais+o.amigo.sent+o.coach.sent;e.innerHTML=[s("Avisos enviados hoje",p,"tudo gr\xE1tis e sem limite pr\xE1tico"),s("Lembretes de trabalho",o.lembretes,'hor\xE1rios, "J\xE1 postou?" e atrasos'),s("Lembretes pessoais",o.pessoais),s("Mensagens de \xE2nimo, \xE1gua e vers\xEDculos",o.amigo.sent,`${o.amigo.ai} escritas pela IA`),s("Dicas do trabalho",o.coach.sent,`${o.coach.ai} escritas pela IA`),s("IA gr\xE1tis usada hoje",`${o.iaPercent}%`,o.iaPercent>=90?"quase no limite: as mensagens seguem, com textos prontos":"a cota renova todo dia")].join("")}var M="lembra.theme",la=[{id:"auto",label:"Autom\xE1tico",hint:"segue o celular"},{id:"light",label:"Claro",hint:"sempre claro"},{id:"dark",label:"Escuro",hint:"modo noturno"}],j=()=>{try{return localStorage.getItem(M)||"auto"}catch{return"auto"}};function ma(){let a=j();a==="light"||a==="dark"?document.documentElement.dataset.theme=a:delete document.documentElement.dataset.theme}function Pa(a){try{a==="light"||a==="dark"?localStorage.setItem(M,a):localStorage.removeItem(M)}catch{}ma()}var I=(a,e)=>{let o=parseInt(a.slice(1),16);return`rgba(${o>>16&255}, ${o>>8&255}, ${o&255}, ${e})`};function qa(){let a=document.getElementById("proftheme"),e=f.theme;if(!e){a&&(a.textContent="");return}a||(a=document.createElement("style"),a.id="proftheme",document.head.appendChild(a));let o=`--ink:${e.accent};--ink-on:#FFFFFF;--bg:${e.bg};--blur-bg:${I(e.bg,.84)};--brand:${e.accent};--brand-soft:${I(e.accent,.1)}`,s=`--ink:${e.dark};--ink-on:#06121A;--brand:${e.dark};--brand-soft:${I(e.dark,.14)}`;a.textContent=`@media (prefers-color-scheme: light){:root[data-space="work"]:not([data-theme="dark"]){${o}}}
:root[data-space="work"][data-theme="light"]{${o}}
@media (prefers-color-scheme: dark){:root[data-space="work"]:not([data-theme="light"]){${s}}}
:root[data-space="work"][data-theme="dark"]{${s}}`}var P=a=>$[y[a]||"outro"]?.label||"Compromisso",ca=(a=3)=>y.slice(0,a).map(e=>$[e]?.label.toLowerCase()).join(", "),O="pauta.onboarded",q="pauta.notifyAskedAt";function ja(){if(!localStorage.getItem(O))return R(t.solo?["notify","done"]:t.me?["welcome","notify","done"]:["welcome","who","notify","done"]);if(!t.me&&t.mode==="local")return R(["who"]);let e=Number(localStorage.getItem(q)||0);if(w()&&A()==="default"&&Date.now()-e>3*864e5)return R(["notify"])}function k(a,e,o="agora"){return`<div class="nprev">
    <img src="icons/icon-192.png" alt="">
    <div><div class="nprev__top"><b>${i(d.appName.toUpperCase())}</b><span>${i(o)}</span></div>
    <strong>${i(a)}</strong><p>${i(e)}</p></div>
  </div>`}function ba(a,e,o){let s=t.member(t.me),p=t.team.find(r=>r.id!==t.me)||t.team[1]||t.team[0],l=o>1?`<div class="ob__dots">${Array.from({length:o},(r,m)=>`<i class="${m===e?"is-on":""}"></i>`).join("")}</div>`:"";return a==="welcome"?`<div class="ob__art"><img class="ob__icon" src="icons/icon-512.png" alt=""></div>
      <h1>Bem-vindo ao ${i(d.appName)}</h1>
      <p>A agenda de conte\xFAdo de ${i(d.agencyName)}: posts, stories, reels e capta\xE7\xF5es de todas as empresas, num lugar s\xF3.</p>
      ${l}
      <button class="btn btn--primary btn--block" data-next>Come\xE7ar</button>`:a==="who"?`<div class="ob__art ob__art--sm">${n("user",34)}</div>
      <h1>Quem vai usar este celular?</h1>
      <p>Assim o app sabe de quem s\xE3o os lembretes e avisa o parceiro quando voc\xEA marcar algo.</p>
      <div class="whogrid ob__who">${t.team.map(r=>`<button class="whobtn${t.me===r.id?" is-on":""}" style="--mc:${r.color}" data-me="${r.id}">${_(r.id,36)}<span>${i(r.name)}</span><i class="whobtn__check">${n("check",14)}</i></button>`).join("")}</div>
      ${l}
      <button class="btn btn--primary btn--block" data-next ${t.me?"":"disabled"}>Continuar</button>`:a==="notify"?v()?`<div class="ob__previews">
        ${k("Daqui a 2h: Reels \xB7 Pura Vida","18h \u2014 postar o Reels \u201CBastidores\u201D","agora")}
        ${k(`${p?.name||"Seu parceiro"} marcou para voc\xEA`,"Story \xB7 Caf\xE9 Aroma \u2014 amanh\xE3, 16h","h\xE1 2 min")}
        ${k(`Bom dia, ${s?.name||"Henrique"}! Seu dia hoje`,"5 tarefas \xB7 primeira: 11h30 Feed \xB7 Studio Fit","8:00")}
      </div>
      <h1>Nunca mais esque\xE7a um post</h1>
      <p>Lembretes 2h e 30 min antes de cada post, aviso na v\xE9spera das capta\xE7\xF5es, cobran\xE7a se algo ficou para tr\xE1s e aviso quando o parceiro marcar algo para voc\xEA.</p>
      <div data-notify-msg></div>
      ${l}
      <button class="btn btn--primary btn--block" data-enable>${n("bell",18)} Ativar notifica\xE7\xF5es</button>
      <button class="btn btn--ghost btn--block" data-skip>Agora n\xE3o</button>`:`<div class="ob__previews">
        ${k(`Daqui a 1h: ${P(0)}`,`14h \u2014 ${P(0).toLowerCase()} marcada na sua agenda`,"agora")}
        ${k(`${$[y[0]]?.ask||"J\xE1 fez?"} ${P(0)}`,"Se j\xE1 resolveu, toque e marque como feito \u2713","14:00")}
        ${k(`Bom dia, ${s?.name||""}! Seu dia hoje`,`4 compromissos \xB7 primeiro: 8h ${P(1)}`,"7:20")}
      </div>
      <h1>Nunca mais esque\xE7a um compromisso</h1>
      <p>Avisos antes de cada ${i(ca(2))} \u2014 calculados pela sua ficha \u2014, uma pergunta na hora exata e cobran\xE7a se algo ficar para tr\xE1s.</p>
      <div data-notify-msg></div>
      ${l}
      <button class="btn btn--primary btn--block" data-enable>${n("bell",18)} Ativar notifica\xE7\xF5es</button>
      <button class="btn btn--ghost btn--block" data-skip>Agora n\xE3o</button>`:`<div class="ob__art ob__art--ok">${n("check",40)}</div>
    <h1>Tudo pronto${s?", "+i(s.name):""}!</h1>
    <ul class="ob__tips">
      <li>${n("plus",18)}<span>Toque no <b>+</b> para marcar ${v()?"posts, capta\xE7\xF5es e reuni\xF5es":i(ca(3))}.</span></li>
      <li>${n("sparkle",18)}<span>O <b>Assistente</b> avisa conflitos e ${v()?"sugere os melhores hor\xE1rios":"marca as coisas por voc\xEA: \xE9 s\xF3 escrever"}.</span></li>
      ${v()?`<li>${n("link",18)}<span>Em <b>Empresas</b>, mande para cada cliente o link do cronograma dele.</span></li>`:`<li>${n(f.entity.icon,18)}<span>Em <b>${i(W(!0))}</b>, organize ${i(f.entity.hint||"seus compromissos por grupo")}.</span></li>`}
    </ul>
    ${l}
    <button class="btn btn--primary btn--block" data-next>Abrir a agenda</button>`}function R(a){if(document.querySelector(".ob"))return;let e=0,o=document.createElement("div");o.className="ob",o.innerHTML='<div class="ob__card"></div>',document.body.appendChild(o),requestAnimationFrame(()=>o.classList.add("is-in"));let s=o.querySelector(".ob__card"),p=()=>{(a.includes("welcome")||a.includes("done"))&&localStorage.setItem(O,"1"),o.classList.remove("is-in"),setTimeout(()=>o.remove(),400)},l=g=>{if(g>=a.length)return p();e=g,s.classList.remove("is-shown"),setTimeout(()=>{s.innerHTML=ba(a[e],e,a.length),m(),s.classList.add("is-shown")},s.innerHTML?180:0)},r=(g,h="info")=>{let u=s.querySelector("[data-notify-msg]");u&&(u.innerHTML=`<div class="ob__msg ob__msg--${h}">${g}</div>`)},m=()=>{s.querySelectorAll("[data-next]").forEach(u=>u.onclick=()=>l(e+1)),s.querySelectorAll("[data-me]").forEach(u=>u.onclick=()=>{t.setMe(u.dataset.me),s.querySelectorAll("[data-me]").forEach(B=>B.classList.toggle("is-on",B===u)),s.querySelector("[data-next]").disabled=!1});let g=s.querySelector("[data-skip]");g&&(g.onclick=()=>{localStorage.setItem(q,String(Date.now())),l(e+1)});let h=s.querySelector("[data-enable]");h&&(h.onclick=async()=>{if(localStorage.setItem(q,String(Date.now())),S()){r(`<b>Primeiro instale o app.</b> No iPhone, as notifica\xE7\xF5es s\xF3 funcionam pelo \xEDcone da Tela de In\xEDcio:<br>
          1. Toque em ${n("share",14)} <b>Compartilhar</b><br>2. <b>Adicionar \xE0 Tela de In\xEDcio</b><br>3. Abra o ${i(d.appName)} pelo \xEDcone`,"warn"),h.outerHTML='<button class="btn btn--primary btn--block" data-next>Entendi</button>',m();return}h.disabled=!0,h.innerHTML="Aguardando permiss\xE3o\u2026";let u=await x().catch(()=>({ok:!1,reason:"error"}));u.ok?(u.local?r("Ativado neste celular. Para os avisos chegarem com o app fechado e no celular do parceiro, falta ligar o servidor de notifica\xE7\xF5es (Ajustes \u2192 Notifica\xE7\xF5es).","ok"):(r("Pronto! Voc\xEA vai receber uma notifica\xE7\xE3o de teste em instantes.","ok"),E().catch(()=>{})),h.outerHTML='<button class="btn btn--primary btn--block" data-next>Continuar</button>',s.querySelector("[data-skip]")?.remove(),m()):u.reason==="server"?(r("Permiss\xE3o concedida! O servidor de notifica\xE7\xF5es ainda n\xE3o foi publicado; quando for, este celular \xE9 cadastrado sozinho.","ok"),h.outerHTML='<button class="btn btn--primary btn--block" data-next>Continuar</button>',m()):u.reason==="denied"?(r(`As notifica\xE7\xF5es foram bloqueadas. Para ligar depois: <b>Ajustes do iPhone \u2192 Notifica\xE7\xF5es \u2192 ${i(d.appName)}</b>.`,"warn"),h.outerHTML='<button class="btn btn--primary btn--block" data-next>Continuar</button>',m()):(r("Este aparelho n\xE3o aceita notifica\xE7\xF5es deste app.","warn"),h.disabled=!1,h.innerHTML="Tentar de novo")})};l(0)}function da(){localStorage.removeItem(O),localStorage.removeItem(q),c("A apresenta\xE7\xE3o aparece na pr\xF3xima abertura")}function ie(){let a=t.member(t.me),e=t.mode==="cloud",o="Notification"in window&&Notification.permission==="granted";return e&&setTimeout(()=>{ga(),ra()},0),`
  <header class="hdr">
    <div class="hdr__row"><div class="hdr__titles"><p class="hdr__eyebrow">${i(d.appName)}${t.solo?"":" \xB7 "+i(d.agencyName)}</p><h1>Ajustes</h1></div></div>
  </header>
  <div class="page">
    ${t.solo?$a():""}
    <section class="block">
      <div class="glist">
        ${b({cls:"pbig--toPersonal",attrs:'data-action="space" data-space="personal"',ic:"heart",c:"#FF2D55",t:"Modo Pessoal",s:"Anivers\xE1rios, compromissos e listas \u2014 s\xF3 voc\xEA v\xEA"})}
        ${e?fa():""}
        ${e&&t.solo?b({cls:"pbig--share",attrs:'data-action="share"',ic:"users",c:"#34C759",t:"Agenda compartilhada",s:t.shared?`Voc\xEA est\xE1 na agenda de ${i(t.shared.ownerName)}`:t.billing?.addon?.active?`Plano ${t.billing.addon.plan==="equipe"?"Equipe":"Dupla"} ativo \xB7 convide e gerencie`:"Divida a agenda com s\xF3cio ou equipe \xB7 \xE0 parte"}):""}
        ${t.team.length>1?b({attrs:'data-action="team-board"',ic:"trophy",c:"#FF9F0A",t:"Placar da equipe",s:"Quem cumpriu o que marcou nesta semana"}):""}
        ${b({attrs:'data-action="profile"',ic:"crown",c:"#AF52DE",t:"Perfil e conquistas",s:"Seu n\xEDvel, XP e emblemas"})}
        ${e&&ta()?b({attrs:t.profile?.phoneVerified?"":'data-action="confirm-phone"',ic:"shield",c:t.profile?.phoneVerified?"#34C759":"#0A84FF",t:t.profile?.phoneVerified?"Celular confirmado \u2713":"Confirmar meu celular",s:t.profile?.phoneVerified?i(t.profile.phone||"")+" \xB7 d\xE1 para recuperar a senha por SMS":"Protege a conta e permite recuperar a senha por SMS"}):""}
        ${b({attrs:'data-action="guide"',ic:"sparkles",c:"#5856D6",t:"Como funciona o Lembra",s:"Trabalho e Pessoal em 1 minuto"})}
        ${e?b({cls:"pbig--privacy",attrs:'data-action="privacy"',ic:"lock",c:"#8E8E93",t:"Privacidade e dados",s:"Termos, baixar ou apagar meus dados"}):""}
        ${e&&t.solo?b({attrs:'data-action="ranking"',ic:"trophy",c:"#FF9F0A",t:"Ranking da semana",s:t.billing?.plan==="monthly"&&t.billing?.tier!=="essencial"?"Ligas semanais \xB7 o n\xBA 1 do m\xEAs ganha o m\xEAs seguinte gr\xE1tis":"Plano Profissional \xB7 ligas e meses gr\xE1tis"}):""}
        ${e?b({attrs:'data-action="support" data-allow-locked',ic:"headset",c:"#0A84FF",t:"Falar com o suporte",s:"Chat com a equipe do Lembra \xB7 respondemos em at\xE9 24h"}):d.supportWhatsapp||d.supportEmail?b({attrs:'data-action="support"',ic:d.supportWhatsapp?"phone":"mail",c:d.supportWhatsapp?"#25D366":"#0A84FF",t:"Ajuda e atendimento",s:d.supportWhatsapp?"Fale com a gente no WhatsApp":"Fale com a gente por e-mail"}):""}
      </div>
    </section>
    ${e&&(t.user?.email||"").toLowerCase()===(d.adminEmail||"").toLowerCase()?`<section class="block"><div class="glist">${b({attrs:'data-action="admin"',ic:"chart",c:"#0A84FF",t:"Painel do dono",s:"Receita, pessoas e sa\xFAde do app"})}</div></section>`:""}
    <section class="block">
      <h2 class="block__title">${n("user",16)} ${e?"Sua conta":"Quem est\xE1 usando este celular?"}</h2>
      ${e?`<div class="card whocard">
            <div class="whocard__top">${a?_(a.id,48):n("user",24)}<div class="whocard__txt"><strong>${i(a?.name||t.user?.email||"")}${t.billing?.plan==="lifetime"?`<span class="vbadge">${n("crown",12)} Vital\xEDcio</span>`:""}</strong><small>${i(t.user?.email||"")}</small></div></div>
            <div class="whocard__btns">${t.solo?`<button class="btn btn--soft btn--sm" data-action="edit-profile">${n("edit",16)} Editar perfil</button>`:""}
            <button class="btn btn--danger-soft btn--sm" data-action="logout">${n("logout",16)} Sair da conta</button></div></div>`:`<div class="whogrid">${t.team.map(s=>`<button class="whobtn${t.me===s.id?" is-on":""}" style="--mc:${s.color}" data-action="set-me" data-p="${s.id}">${_(s.id,34)}<span>${i(s.name)}</span><i class="whobtn__check">${n("check",14)}</i></button>`).join("")}</div>
           <p class="fhelp">Usado para sauda\xE7\xE3o, \u201CCriado por\u201D e nos lembretes.</p>`}
    </section>

    ${ha()}

    ${ka()}

    <section class="block">
      <h2 class="block__title">${n("sparkle",16)} Assistente e Claude</h2>
      <div class="card card--row">
        ${n("sparkle",22)}
        <div><strong>Assistente autom\xE1tico ativo</strong><small>Confere conflitos, tempo livre e melhores hor\xE1rios sozinho, sem internet e sem chave.</small></div>
        <button class="btn btn--soft btn--sm" data-action="assistant">Abrir</button>
      </div>
      <p class="fhelp">Para perguntas abertas (ideias, reorganizar a semana), use \u201CPerguntar ao Claude\u201D no Assistente. Abre o Claude com o seu login normal, sem chave de API.</p>
    </section>

    ${va()}

    <section class="block">
      <h2 class="block__title">${n("calendar",16)} Lembretes no Calend\xE1rio do iPhone</h2>
      <div class="card">
        <p>Envie a agenda para o <b>Calend\xE1rio do iPhone</b> com alarmes. Assim o celular avisa na hora certa, mesmo com o app fechado.</p>
        <div class="btnrow">
          <button class="btn btn--primary btn--sm" data-action="ics" data-who="me" data-days="7">${n("download",16)} Minha semana</button>
          <button class="btn btn--soft btn--sm" data-action="ics" data-who="me" data-days="30">Meus 30 dias</button>
          ${t.team.length>1?`<button class="btn btn--soft btn--sm" data-action="ics" data-who="all" data-days="7">Semana da ${z()}</button>`:""}
        </div>
        <p class="fhelp">No iPhone, toque em \u201CCalend\xE1rio\u201D ou abra o arquivo baixado e escolha \u201CAdicionar tudo\u201D. Se mudar algo depois, exporte de novo.</p>
      </div>
    </section>

    <section class="block">
      <h2 class="block__title">${n("cloud",16)} Sincroniza\xE7\xE3o</h2>
      <div class="card card--row ${e?"card--ok":"card--warn"}">
        ${n(e?"cloud":"phone",22)}
        <div><strong>${e?"Sincronizado na nuvem":"Salvo s\xF3 neste aparelho"}</strong>
        <small>${e?t.solo?"Sua agenda fica salva na sua conta e aparece igual em qualquer celular em que voc\xEA entrar.":"Henrique, Matheus e os links dos clientes veem tudo em tempo real.":"Para ver a mesma agenda em celulares diferentes, ative a nuvem (gratuito). Veja o guia no README do projeto."}</small></div>
      </div>
    </section>

    ${w()?"":`<section class="block">
      <h2 class="block__title">${n("phone",16)} Instalar como app</h2>
      <div class="card">
        <ol class="steps">
          <li>Abra este endere\xE7o no <b>Safari</b>.</li>
          <li>Toque em ${n("share",15)} <b>Compartilhar</b>.</li>
          <li>Escolha <b>Adicionar \xE0 Tela de In\xEDcio</b>.</li>
        </ol>
        <p class="fhelp">O app abre em tela cheia, como um aplicativo normal.</p>
      </div>
    </section>`}

    ${v()?`<section class="block">
      <h2 class="block__title">${n("bulb",16)} Melhores hor\xE1rios (refer\xEAncia)</h2>
      <div class="card card--flush">
        <ul class="besttimes">
          ${G.map(s=>`<li><span class="tbadge tbadge--${s.type}">${n($[s.type].icon,13)}${$[s.type].label}</span><span>${i(s.text)}</span></li>`).join("")}
        </ul>
        <p class="fhelp pad">M\xE9dias de mercado. Confiram os Insights do Instagram de cada cliente e ajustem: cada p\xFAblico tem seu hor\xE1rio de pico.</p>
      </div>
    </section>`:""}

    <section class="block">
      <h2 class="block__title">${n("download",16)} Dados e backup</h2>
      <div class="list">
        <button class="list__row" data-action="export">${n("download",18)}<span>Exportar backup (.json)</span>${n("right",16,"muted")}</button>
        <label class="list__row">${n("upload",18)}<span>Importar backup</span><input type="file" accept="application/json,.json" data-action-change="import" hidden>${n("right",16,"muted")}</label>
        ${t.demo?`<button class="list__row" data-action="clear-demo">${n("sparkle",18)}<span>Apagar dados de exemplo</span>${n("right",16,"muted")}</button>`:""}
        <button class="list__row is-danger" data-action="clear-all">${n("trash",18)}<span>Apagar tudo</span>${n("right",16,"muted")}</button>
      </div>
      <p class="fhelp">${t.state.companies.length} empresas \xB7 ${t.state.events.length} eventos \xB7 ${t.state.notes.length} bilhetes</p>
    </section>
    <section class="block">
      <h2 class="block__title">${n("refresh",16)} Vers\xE3o do app</h2>
      <div class="list">
        <div class="list__row list__row--static"><span><b>${i(d.appName)} ${i(D)}</b><small>Atualiza sozinho sempre que voc\xEA abre \xB7 c\xF3digo ${i(sa)}</small></span><span class="verok">${n("check",14)} em dia</span></div>
        <button class="list__row" data-action="whatsnew">${n("sparkles",18)}<span>Novidades desta vers\xE3o</span>${n("right",16,"muted")}</button>
        <button class="list__row" data-action="check-update">${n("refresh",18)}<span>Procurar atualiza\xE7\xE3o agora</span>${n("right",16,"muted")}</button>
      </div>
    </section>
    ${e?`<section class="block">
      <button class="logoutbig" data-action="logout">${n("logout",20)}<span>Sair da conta</span></button>
      <p class="fhelp center">Conectado como ${i(t.user?.email||"")}</p>
    </section>`:""}
    <div class="about">${H("palavra",{h:22,alt:i(d.appName)})}<small>vers\xE3o ${i(D)} \xB7 sua agenda de trabalho e pessoal</small></div>
  </div>`}function ha(){let a=j();return`<section class="block">
    <h2 class="block__title">${n("sun",16)} Apar\xEAncia</h2>
    <div class="seg3">${la.map(e=>`<button class="seg3__btn${a===e.id?" is-on":""}" data-action="theme" data-v="${e.id}">${n(e.id==="dark"?"moon":e.id==="light"?"sun":"phone",18)}<b>${e.label}</b><small>${e.hint}</small></button>`).join("")}</div>
    <div class="list" style="margin-top:10px"><label class="list__row"><span><b>Sons</b><small>Toque suave ao trocar de modo e ao concluir</small></span><input type="checkbox" class="switch" data-sound ${ea()?"checked":""}></label></div>
    ${!v()&&f.theme?`<p class="fhelp">As cores do modo Trabalho combinam com a sua \xE1rea${f.profession?` (${i(C(f.profession,t.profile?.pronoun))})`:""}.</p>`:""}
  </section>`}var b=({cls:a="",attrs:e="",ic:o,c:s,t:p,s:l="",badge:r=""})=>`<button class="glist__row ${a}" ${e}><span class="glist__ic" style="--c:${s}">${n(o,18)}</span><span class="glist__txt"><b>${i(p)}</b>${l?`<small>${l}</small>`:""}</span>${r?`<span class="glist__badge">${i(r)}</span>`:""}${n("right",16)}</button>`;function fa(){let a=t.profile||{};return a.onboardedAt?b({cls:"pbig--ficha",attrs:'data-action="ficha"',ic:!v()&&f.badge?f.badge:"idcard",c:"#FF9500",t:"Sua ficha",s:`${i(C(a.profession,a.pronoun)||"Profiss\xE3o")} \xB7 \xEDndice ${Number(a.index)||0}/100`,badge:""}):b({cls:"pbig--ficha",attrs:'data-action="ficha"',ic:"idcard",c:"#FF9500",t:"Preencha sua ficha",s:"2 minutos: o Lembra se adapta a voc\xEA"})}function va(){let a=A(),e=S(),o=t.mode==="cloud",s=!!localStorage.getItem("pauta.device"),p=Y(),l,r,m="";return e?(l="warn",r="No iPhone, as notifica\xE7\xF5es s\xF3 funcionam com o app instalado na Tela de In\xEDcio.",m='<button class="btn btn--primary btn--sm" data-action="install-guide">Como instalar</button>'):a==="unsupported"?(l="warn",r="Este navegador n\xE3o aceita notifica\xE7\xF5es."):a==="denied"?(l="warn",r=`Bloqueadas. Para ligar: Ajustes do iPhone \u2192 Notifica\xE7\xF5es \u2192 ${d.appName}.`):a!=="granted"?(l="warn",r="Desativadas neste celular.",m='<button class="btn btn--primary btn--sm" data-action="notify-enable">Ativar</button>'):o&&s?(l="ok",r=t.team.length>1?"Ativadas. Os lembretes e os avisos do parceiro chegam mesmo com o app fechado.":"Ativadas. Seus lembretes chegam mesmo com o app fechado.",m='<button class="btn btn--soft btn--sm" data-action="notify-enable">Recadastrar</button>'):o?(l="warn",r="Permiss\xE3o concedida, mas este celular ainda n\xE3o foi cadastrado no servidor. Toque em Cadastrar.",m='<button class="btn btn--primary btn--sm" data-action="notify-enable">Cadastrar</button>'):(l="warn",r="Ativadas s\xF3 com o app aberto. Para receber com o app fechado e no celular do parceiro, ligue a nuvem e o servidor (README)."),`<section class="block">
    <h2 class="block__title">${n("bell",16)} Notifica\xE7\xF5es</h2>
    <div class="card card--row ${l==="ok"?"card--ok":"card--warn"}">
      ${n("bell",22)}
      <div><strong>${l==="ok"?"Funcionando":"Aten\xE7\xE3o"}</strong><small>${i(r)}</small></div>
      ${m}
    </div>
    <form class="list notif-prefs" data-notify-form onsubmit="return false">
      <label class="list__row"><span><b>Lembretes dos meus compromissos</b><small>antes do hor\xE1rio (como calculado na sua ficha), na hora e cobran\xE7a se atrasar</small></span><input type="checkbox" class="switch" name="reminders" ${p.reminders?"checked":""}></label>
      <label class="list__row"${t.team.length<2?" hidden":""}><span><b>Avisos do parceiro</b><small>quando marcar, mudar ou concluir algo</small></span><input type="checkbox" class="switch" name="partner" ${p.partner?"checked":""}></label>
      <label class="list__row"><span><b>Dicas do trabalho</b><small>${v()?"ideias de conte\xFAdo, trends e cobran\xE7as por empresa":"dicas pr\xE1ticas da sua profiss\xE3o e motiva\xE7\xE3o"}, em hor\xE1rios variados</small></span><input type="checkbox" class="switch" name="coach" ${p.coach?"checked":""}></label>
      <label class="list__row"><span><b>Resumo do dia</b><small>\xE0s 8h (hoje) e \xE0s 20h (amanh\xE3)</small></span><input type="checkbox" class="switch" name="daily" ${p.daily?"checked":""}></label>
    </form>
    ${o?'<div class="list" data-devices><div class="list__row"><span><small>Conferindo celulares cadastrados\u2026</small></span></div></div>':""}
    ${a==="granted"?`<button class="btn btn--soft btn--block" data-action="notify-test">${n("bell",16)} Enviar notifica\xE7\xE3o de teste</button>`:""}
    ${F()?`<h3 class="block__sub">Uso de hoje (gr\xE1tis)</h3>${F()}`:""}
    ${a==="granted"&&o?'<button class="btn btn--soft btn--block" data-action="coach-test">\u2728 Receber uma dica agora</button>':""}
    ${w()?"":`<button class="btn btn--soft btn--block" data-action="install-guide">${n("phone",16)} Instalar na tela inicial</button>`}
    <button class="btn-text btn-text--sm" data-action="onboarding-again">Ver a apresenta\xE7\xE3o de novo</button>
  </section>`}function ga(){aa().then(a=>{let e=document.querySelector("[data-devices]");if(e){if(!a){e.innerHTML='<div class="list__row"><span><small>N\xE3o deu para conferir os celulares agora.</small></span></div>';return}e.innerHTML=t.team.map(o=>{let s=a[o.id]||0;return`<div class="list__row devrow"><span><b>${i(o.name)}</b><small>${s?`${s} celular${s>1?"es":""} recebendo avisos`:"Nenhum celular cadastrado \u2014 n\xE3o recebe notifica\xE7\xF5es. Abra o app pelo \xEDcone \u2192 Ajustes \u2192 Notifica\xE7\xF5es \u2192 Ativar/Cadastrar."}</small></span><span>${s?"\u2705":"\u26A0\uFE0F"}</span></div>`}).join("")}})}function $a(){let a=t.billing||{},e={trial:"Teste gr\xE1tis (tudo liberado)",comp:"Acesso liberado",monthly:`${a.tier==="essencial"?"Essencial":"Profissional"} \xB7 ${a.prepaid?"12 meses no Pix":a.interval==="year"?"anual":"mensal"}`,lifetime:a.vip?"Lembra Vital\xEDcio":a.founder?"Fundadores \xB7 Profissional para sempre":"Vital\xEDcio",expired:"Teste encerrado",blocked:"Sem plano",none:"Sem plano",shared:"Agenda compartilhada",checking:"Conferindo\u2026",offline:"Sem conex\xE3o para conferir"}[a.plan]||"\u2014",o=a.plan==="trial"?`Termina em ${na(a.trialEndsAt-Date.now())}`:a.plan==="monthly"?a.prepaid?`Pago at\xE9 ${new Date(a.paidUntil).toLocaleDateString("pt-BR")} \xB7 perto de vencer, \xE9 s\xF3 renovar`:a.cancelAt?`Cancelada: vale at\xE9 ${new Date(a.cancelAt).toLocaleDateString("pt-BR")}`:a.paidUntil?`Renova em ${new Date(a.paidUntil).toLocaleDateString("pt-BR")}`:"Ativa":a.plan==="lifetime"?a.vip?`Membro N\xBA ${String(a.vip.no).padStart(3,"0")} \xB7 desde ${new Date(a.vip.at).toLocaleDateString("pt-BR")}. Presente de cortesia do Lembra (veja os Termos de Uso).`:a.comp?"Acesso cortesia liberado pelo Lembra.":"Pago uma vez, para sempre. Obrigado!":a.plan==="comp"?`Acesso liberado pelo Lembra at\xE9 ${new Date(a.compUntil).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"})}. Depois disso, \xE9 s\xF3 escolher um plano.`:a.plan==="shared"?`Liberado pela agenda de ${t.shared?.ownerName||a.ownerName||"quem te convidou"}. Voc\xEA n\xE3o paga nada.`:"",s=l=>(a.plan==="lifetime"?{dupla:"4,90",equipe:"19,90"}:{dupla:"7,90",equipe:"29,90"})[l],p=a.addon&&a.addon.active?`<div class="card card--row"><div><strong>+ Agenda compartilhada ${a.addon.plan==="equipe"?`Equipe \xB7 R$ ${s("equipe")}/m\xEAs`:`Dupla \xB7 R$ ${s("dupla")}/m\xEAs`}</strong><small>${a.addon.cancelAt?`Cancelada: vale at\xE9 ${new Date(a.addon.cancelAt).toLocaleDateString("pt-BR")}`:"Complemento mensal, cobrado \xE0 parte"}</small></div><button class="btn btn--soft btn--sm" data-action="share">Ver</button></div>`:"";return`<section class="block">
    <h2 class="block__title">${n("card",16)} Seu plano</h2>
    <div class="card card--row"><div><strong>${i(e)}</strong>${o?`<small>${i(o)}</small>`:""}</div>
      ${a.plan==="lifetime"&&a.vip&&!a.addon?'<button class="btn btn--soft btn--sm" data-action="vip-card">Ver cart\xE3o</button>':a.plan==="monthly"&&a.prepaid?a.paidUntil-Date.now()<30*864e5?'<button class="btn btn--primary btn--sm" data-action="plans">Renovar</button>':"":a.plan==="monthly"||a.plan==="lifetime"&&a.addon?'<button class="btn btn--soft btn--sm" data-action="billing-portal">Gerenciar</button>':["lifetime","shared"].includes(a.plan)?"":'<button class="btn btn--primary btn--sm" data-action="plans">Assinar</button>'}
    </div>
    ${a.plan==="monthly"&&a.tier==="essencial"?`<button class="card card--row upgrade" data-action="billing-portal">${n("crown",20)}<div><strong>Passe para o Profissional</strong><small>Assistente com IA, cobran\xE7a de atraso e ranking com meses gr\xE1tis. Troque em \u201CGerenciar\u201D.</small></div>${n("right",16)}</button>`:""}
    ${a.plan==="monthly"&&(a.foundersLeft??0)>0?`<button class="card card--row upgrade" data-action="plans">${n("crown",20)}<div><strong>Vire Fundador</strong><small>R$ 199 uma vez: o Profissional para sempre. S\xF3 ${a.foundersLeft} vagas. A assinatura \xE9 cancelada na hora.</small></div>${n("right",16)}</button>`:""}
    ${p}
  </section>`}function ka(){let a=L(),e=[0,15,30,45,60,90];return`<section class="block">
    <h2 class="block__title">${n("clock",16)} Rotina e tempo livre</h2>
    <form class="list" data-routine-form onsubmit="return false">
      <label class="list__row"><span>Expediente</span><input type="time" name="workStart" value="${a.workStart}"> <input type="time" name="workEnd" value="${a.workEnd}"></label>
      <label class="list__row"><span>Almo\xE7o</span><input type="time" name="lunchStart" value="${a.lunchStart}"> <input type="time" name="lunchEnd" value="${a.lunchEnd}"></label>
      <label class="list__row"><span>Deslocamento entre lugares</span><select name="travelMin">${e.map(o=>`<option value="${o}"${a.travelMin===o?" selected":""}>${o?o+" min":"n\xE3o considerar"}</option>`).join("")}</select></label>
      <label class="list__row"><span>M\xE1ximo de tarefas/dia</span><select name="maxTasks">${[4,5,6,7,8,10,12,15,20].map(o=>`<option value="${o}"${a.maxTasks===o?" selected":""}>${o}</option>`).join("")}</select></label>
      <div class="list__row list__row--col"><span>Dias de folga</span>
        <div class="daysoff">${U.map((o,s)=>`<label class="dayoff"><input type="checkbox" name="off" value="${s}"${a.daysOff.includes(s)?" checked":""}><span>${o}</span></label>`).join("")}</div>
      </div>
    </form>
    <p class="fhelp">O assistente usa isso para n\xE3o marcar nada em cima do almo\xE7o, da folga ou fora do expediente, e para proteger o ${t.team.length>1?"tempo livre de voc\xEAs":"seu tempo livre"}.</p>
  </section>`}var re={async notifyEnable(){let a=await x().catch(e=>({ok:!1,reason:"error",message:e.message}));a.ok?c(a.local?"Ativado (com o app aberto)":"Notifica\xE7\xF5es ativadas"):a.reason==="install"?c("Instale o app na Tela de In\xEDcio primeiro"):a.reason==="denied"?c("Bloqueado: libere em Ajustes do iPhone \u2192 Notifica\xE7\xF5es"):a.reason==="server"?c("Servidor de notifica\xE7\xF5es ainda n\xE3o publicado"):c(`N\xE3o foi poss\xEDvel ativar${a.message?": "+a.message:""}`,{ms:8e3}),t.emit()},async coachTest(){try{await ia(),c("Pronto! Uma dica chega em at\xE9 1 minuto (se for entre 8h30 e 21h30).",{ms:5e3})}catch{c("N\xE3o deu para pedir a dica agora. Verifique a conex\xE3o.")}},async notifyTest(){let a;try{a=await E()}catch(e){return c(`Falhou: ${e.message}`,{ms:8e3})}if(a.kind==="not-registered")return c('Este celular ainda n\xE3o est\xE1 cadastrado. Toque em "Ativar" acima.',{ms:7e3});if(a.kind==="local")return c("Notifica\xE7\xE3o local mostrada (servidor n\xE3o configurado)");if(a.sent>0)return c("Enviada! Deve chegar em alguns segundos. Bloqueie a tela para ver.",{ms:7e3});if(!a.devices)return c('O servidor n\xE3o tem este celular cadastrado. Toque em "Ativar" de novo.',{ms:7e3});c(`A Apple n\xE3o aceitou o envio (${(a.statuses||[]).join(", ")||"sem resposta"}). Toque em "Ativar" de novo.`,{ms:9e3})},async notifyPrefs(a){await Z({reminders:a.reminders.checked,partner:a.partner.checked,daily:a.daily.checked,coach:a.coach.checked}),c("Prefer\xEAncias salvas")},onboardingAgain(){da()},async routine(a){let e=(p,l)=>/^\d{2}:\d{2}$/.test(a[p].value)?a[p].value:l,o=L(),s={id:"routine",workStart:e("workStart",o.workStart),workEnd:e("workEnd",o.workEnd),lunchStart:e("lunchStart",o.lunchStart),lunchEnd:e("lunchEnd",o.lunchEnd),travelMin:Number(a.travelMin.value),maxTasks:Number(a.maxTasks.value),daysOff:[...a.querySelectorAll('input[name="off"]:checked')].map(p=>Number(p.value))};if(s.workEnd<=s.workStart)return c("O fim do expediente precisa ser depois do in\xEDcio");if(s.lunchEnd<=s.lunchStart)return c("O fim do almo\xE7o precisa ser depois do in\xEDcio");await t.upsert("settings",s),c("Rotina salva")},async ics(a){let e=a.dataset.who==="me"?t.me:"all";if(a.dataset.who==="me"&&!t.me)return c("Escolha primeiro quem est\xE1 usando este celular");let o=Number(a.dataset.days),s=T(),p=t.eventsBetween(s,V(s,o),{person:e}).filter(r=>r.status!=="feito");if(!p.length)return c("Nada agendado nesse per\xEDodo");let l=e==="all"?`${d.appName} \u2013 Dupla`:`${d.appName} \u2013 ${t.member(e).name}`;await oa(p,`pauta-${e}-${s}.ics`,l)},export(){let a=new Blob([t.exportData()],{type:"application/json"}),e=document.createElement("a");e.href=URL.createObjectURL(a),e.download=`pauta-backup-${T()}.json`,document.body.appendChild(e),e.click(),e.remove(),c("Backup exportado")},async import(a){let e=a.files[0];if(e)try{let o=await e.text(),s=await J({title:"Importar backup",text:"Como deseja importar?",options:[{label:"Juntar com os dados atuais",value:"merge",primary:!0},{label:"Substituir tudo",value:"replace",danger:!0}]});if(!s)return;await t.importData(o,{replace:s==="replace"}),c("Backup importado")}catch{c("Arquivo inv\xE1lido")}finally{a.value=""}},async clearAll(){await K({title:"Apagar TUDO?",text:"Empresas, eventos e bilhetes ser\xE3o apagados. Exporte um backup antes, se precisar.",ok:"Apagar tudo",danger:!0})&&(await t.clearAll(),c("Tudo apagado"))}};export{F as a,ra as b,Pa as c,qa as d,ja as e,ie as f,b as g,re as h};
