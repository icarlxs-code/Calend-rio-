import{A as Fe,C as Mt,D as qt,E as ze,a as yt,b as s,c as kt,d as St,e as h,f as Ie,g as M,h as xt,i as Le,j as Re,k as Be,l as Et,m as He,n as At,o as v,p as le,q as Tt,r as N,s as G,t as q,u as jt,v as ee,w as Ct,x as de,y as Dt,z as $e}from"./c-EJYUXBR7.js";import{f as Pe}from"./c-4OPZHBQG.js";import{a as Ve,b as ve}from"./c-QNJTKFWY.js";import{A as f,C as $t,E as vt,G as Z,H as p,a as ct,b as U,c as w,d as _,e as lt,f as ie,g as Oe,h as dt,i as j,j as ue,k as F,l as S,m as mt,n as X,o as pt,p as fe,q as re,r as ut,s as ft,t as ht,u as he,v as K,w as gt,x as bt,y as ge}from"./c-SIJUFJQD.js";import{a as T,b as wt,c as ce,d as be,l as Ne,m as _t}from"./c-3GA6RSWB.js";import{a as A}from"./c-W6W2IM5K.js";import"./c-VHNSBD2M.js";var xa=(e,a)=>e&&a&&e[0]<a[1]&&a[0]<e[1],W=e=>s.member(e)?.name||e,ye=e=>["shoot","meeting"].includes(T[e.type]?.kind);function we(e,a){let t=[],o=N(),r=s.eventsOn(a,{person:e}).filter(n=>n.time&&n.status!=="feito");for(let n=0;n<r.length;n++)for(let m=n+1;m<r.length;m++){let d=r[n],l=r[m];if(!xa(G(d),G(l)))continue;let c=ye(d)?d:ye(l)?l:null,u=c===d?l:d,$,x;c&&ce(u.type)?($=`${W(e)}: post durante ${T[c.type].label.toLowerCase()}`,x=`\u201C${q(u)}\u201D \xE0s ${S(u.time)} cai no meio de \u201C${q(c)}\u201D (${S(c.time)}\u2013${S(ue(G(c)[1]))}).`):c&&ye(u)?($=`${W(e)} em dois lugares ao mesmo tempo`,x=`\u201C${q(d)}\u201D (${S(d.time)}) e \u201C${q(l)}\u201D (${S(l.time)}) se sobrep\xF5em.`):($=`${W(e)}: duas tarefas no mesmo hor\xE1rio`,x=`\u201C${q(d)}\u201D (${S(d.time)}) e \u201C${q(l)}\u201D (${S(l.time)}).`),t.push({level:"warn",kind:"conflict",icon:"alert",ids:[d.id,l.id],title:$,text:x,fixes:Ct(e,d,l)})}let i=r.filter(ye);for(let n=0;n<i.length-1;n++){let m=i[n],d=i[n+1],l=j(d.time)-G(m)[1];(m.location||m.companyId)!==(d.location||d.companyId)&&l>=0&&l<o.travelMin&&t.push({level:"warn",kind:"conflict",icon:"route",ids:[m.id,d.id],title:`${W(e)}: pouco tempo de deslocamento`,text:`S\xF3 ${l} min entre \u201C${q(m)}\u201D e \u201C${q(d)}\u201D, em lugares diferentes (combinado: ${o.travelMin} min).`,fixes:[{label:`Mover para ${S(ue(G(m)[1]+o.travelMin))}`,eventId:d.id,patch:{time:ue(Math.ceil((G(m)[1]+o.travelMin)/15)*15)}}]})}return t}function Ot(e,a="all"){let t=[],o=a==="all"?s.team.map(l=>l.id):[a];o.forEach(l=>t.push(...we(l,e)));let r=N(),i=s.eventsOn(e,{person:a}),n={};if(i.filter(l=>l.time&&["feed","reels","carrossel"].includes(l.type)).forEach(l=>(n[l.companyId]||=[]).push(l)),Object.values(n).forEach(l=>{for(let c=0;c<l.length-1;c++){let u=j(l[c+1].time)-j(l[c].time);u<180&&t.push({level:"info",icon:"clock",ids:[l[c].id,l[c+1].id],title:`${s.company(l[c].companyId)?.name||"Empresa"}: posts muito pr\xF3ximos`,text:`Dois posts de feed/Reels com s\xF3 ${K(u)} de diferen\xE7a. Espacem ao menos 3 h para um n\xE3o \u201Croubar\u201D o alcance do outro.`})}}),e===w()){let l=i.filter(c=>c.time&&c.status==="pendente"&&j(c.time)+15<F());l.length&&t.unshift({level:"warn",kind:"late",icon:"flag",ids:l.map(c=>c.id),title:l.length===1?"1 tarefa atrasada":`${l.length} tarefas atrasadas`,text:l.map(c=>`${S(c.time)} ${q(c)}`).join(" \xB7 ")+". Marque como feito ou reagende."})}let m=i.filter(l=>!(l.assignees||[]).length);if(m.length&&a==="all"&&t.push({level:"warn",icon:"user",ids:m.map(l=>l.id),title:"Tarefa sem respons\xE1vel",text:m.map(l=>`${S(l.time)} ${q(l)}`).join(" \xB7 ")+". Definam quem vai fazer."}),a==="all"&&s.team.length===2){let[l,c]=s.team,u=s.eventsOn(e,{person:l.id}).length,$=s.eventsOn(e,{person:c.id}).length;if(Math.abs(u-$)>=4){let[x,D]=u>$?[l,c]:[c,l];t.push({level:"info",icon:"users",title:"Dia desequilibrado",text:`${x.name} tem ${Math.max(u,$)} tarefas e ${D.name} tem ${Math.min(u,$)}. Que tal passar alguns stories para o ${D.name}?`})}}o.forEach(l=>{let c=ee(l,e),u=s.eventsOn(e,{person:l}).length;!c.dayOff&&c.minutes!=null&&u&&c.longest<45&&t.push({level:"info",kind:"rest",icon:"clock",title:`${W(l)} est\xE1 sem pausa`,text:`O maior intervalo livre do dia \xE9 de ${K(c.longest)}. Programem posts com anteced\xEAncia para abrir espa\xE7o.`}),c.dayOff&&u&&t.push({level:"info",kind:"rest",icon:"clock",title:`${W(l)}: dia de folga`,text:`H\xE1 ${u} tarefa${u>1?"s":""} marcada${u>1?"s":""} na folga. Posts podem ficar programados para ningu\xE9m trabalhar.`}),u>r.maxTasks&&t.push({level:"warn",kind:"rest",icon:"alert",title:`${W(l)} sobrecarregado`,text:`${u} tarefas (limite combinado: ${r.maxTasks}).`})}),s.eventsOn(_(e,1),{person:a}).filter(l=>l.type==="captacao").forEach(l=>{let c=s.company(l.companyId);t.push({level:"prep",icon:"camera",ids:[l.id],title:`Amanh\xE3: capta\xE7\xE3o${c?" na "+c.name:""} \xE0s ${S(l.time)}`,text:"Hoje: carregue baterias, esvazie cart\xF5es de mem\xF3ria, confirme o hor\xE1rio com o cliente e defina o roteiro de tomadas."})}),!t.some(l=>l.kind==="conflict")&&i.length&&t.push({level:"ok",icon:"check",title:"Agenda sem conflitos",text:"Ningu\xE9m est\xE1 em dois lugares ao mesmo tempo."});let d=Math.abs(dt("2024-01-01",e))%Ne.length;return t.push({level:"tip",icon:"bulb",title:"Dica do dia",text:Ne[d]}),t}function Nt(e,a=14){let t=[],o=w();for(let r=0;r<a;r++){let i=_(o,r);we(e,i).forEach(n=>t.push({...n,date:i}))}return t}function Pt(e="all"){let a=w(),t=F();return s.eventsOn(a,{person:e}).find(o=>o.time&&o.status!=="feito"&&j(o.time)+be(o)>t)||null}function It(){return`<div class="seg" role="tablist">
    ${[{id:"all",name:"Todos"},...s.team].map(a=>`<button class="seg__btn${h.person===a.id?" is-on":""}" data-action="set-person" data-p="${a.id}">
      ${a.id==="all"?p("users",15):M(a.id,18)}<span>${f(a.name)}${s.me===a.id?"<em> (voc\xEA)</em>":""}</span></button>`).join("")}
  </div>`}function Ea(e,a=4){let t=[];return e.forEach(o=>{t.includes(o.companyId)||t.push(o.companyId)}),t.slice(0,a).map(o=>`<i style="background:${s.company(o)?.color||"#999"}"></i>`).join("")}function Lt(){let e=h.date,a=w(),t=s.eventsOn(e,{person:h.person}),o=Ot(e,h.person),r=o.filter(b=>b.level==="warn"&&b.icon!=="flag").flatMap(b=>b.ids||[]),i=s.member(s.me),n=lt(e),m=Array.from({length:7},(b,E)=>_(n,E)),d=(()=>{let b=U(m[0]),E=U(m[6]);return b.getMonth()===E.getMonth()?`${b.getDate()}\u2013${E.getDate()} de ${fe[E.getMonth()]}`:`${b.getDate()} ${fe[b.getMonth()]} \u2013 ${E.getDate()} ${fe[E.getMonth()]}`})(),l=`
  <header class="hdr">
    <div class="hdr__row">
      <div class="hdr__titles">
        <p class="hdr__eyebrow">${e===a?`${bt()}${i?", "+f(i.name):""}`:f(re(e))}</p>
        <h1>${f(ht(e))}${e===a?`<span class="hdr__date">${f(ut(e))}</span>`:""}</h1>
      </div>
      <div class="hdr__actions">
        ${e!==a?'<button class="chip chip--accent" data-action="go-today">Hoje</button>':""}
        <button class="iconbtn iconbtn--ai" data-action="assistant" aria-label="Assistente">${p("sparkle",20)}</button>
        <button class="iconbtn" data-action="tab" data-tab="ajustes" aria-label="Perfil">${i?M(i.id,34):p("user",20)}</button>
      </div>
    </div>
    ${It()}
    <div class="week">
      <div class="week__bar">
        <button class="iconbtn iconbtn--sm" data-action="week" data-n="-7" aria-label="Semana anterior">${p("left",18)}</button>
        <span>${f(d)}</span>
        <button class="iconbtn iconbtn--sm" data-action="week" data-n="7" aria-label="Pr\xF3xima semana">${p("right",18)}</button>
      </div>
      <div class="week__days" data-swipe="week">
        ${m.map(b=>{let E=U(b),I=s.eventsOn(b,{person:h.person}),k=I.filter(ne=>ne.status!=="feito").length;return`<button class="wday${b===e?" is-sel":""}${b===a?" is-today":""}" data-action="set-date" data-k="${b}">
            <span class="wday__l">${X[E.getDay()]}</span>
            <span class="wday__n">${E.getDate()}</span>
            <span class="wday__dots">${Ea(I,3)}${I.length?"":'<i class="none"></i>'}</span>
            ${k?`<span class="sr">${k} pendentes</span>`:""}
          </button>`}).join("")}
      </div>
    </div>
  </header>`,c={};t.forEach(b=>c[b.type]=(c[b.type]||0)+1);let u=t.filter(b=>b.status==="feito").length,$=t.length?Math.round(u/t.length*100):0,x=t.length?`<div class="summary">
        <div class="summary__progress">
          <div class="ring" style="--p:${$}"><span>${$}%</span></div>
          <div><strong>${u} de ${t.length}</strong><small>tarefas conclu\xEDdas</small></div>
        </div>
        <div class="summary__types">
          ${Object.entries(c).sort((b,E)=>E[1]-b[1]).map(([b,E])=>`<span class="tcount tbadge--${b}">${p(T[b].icon,13)}<b>${E}</b> ${T[b].label}</span>`).join("")}
        </div>
      </div>`:"",D=h.person==="all"?`<section class="block">
      <h2 class="block__title">${p("route",16)} Onde cada um vai estar</h2>
      <div class="team">${s.team.map(b=>Aa(b,e)).join("")}</div>
    </section>`:"",g="";if(e===a){let b=Pt(h.person);if(b){let E=s.company(b.companyId),I=j(b.time)-F(),k=E?.color||"#555";g=`<button class="next" style="--cc:${k};--cc-soft:${$t(k,.12)}" data-action="open-event" data-id="${b.id}">
        <div class="next__label">${p("bell",14)} ${I>0?"Pr\xF3ximo \xB7 "+gt(I):"Acontecendo agora"}</div>
        <div class="next__row">
          ${Le(E,44)}
          <div class="next__txt">
            <strong>${S(b.time)} \xB7 ${f(T[b.type].label)} \xB7 ${f(E?.name||"")}</strong>
            <span>${f(b.title||"")}</span>
          </div>
          ${xt(b.assignees,26)}
        </div>
        ${b.location?`<div class="next__loc">${p("pin",13)} ${f(b.location)}</div>`:""}
      </button>`}}let P=h.showAllTips?o:o.filter((b,E)=>b.level==="warn"||E<2),y=o.length-P.length,se=`<section class="block">
    <h2 class="block__title">${p("bulb",16)} Dicas e alertas</h2>
    <div class="tips">${P.map(Ta).join("")}</div>
    ${y>0?`<button class="btn-text btn-text--sm" data-action="toggle-tips">Ver mais ${y} dica${y>1?"s":""}</button>`:h.showAllTips&&o.length>2?'<button class="btn-text btn-text--sm" data-action="toggle-tips">Mostrar menos</button>':""}
  </section>`,H;if(!t.length)H=Be("Dia livre",h.person==="all"?"Nada agendado para este dia.":`Nada agendado para ${s.member(h.person)?.name}.`,`<button class="btn btn--primary" data-action="new-event" data-date="${e}">${p("plus",18)} Adicionar</button>`);else{let b=[{k:"Manh\xE3",icon:"sun",items:t.filter(k=>k.time&&j(k.time)<720)},{k:"Tarde",items:t.filter(k=>k.time&&j(k.time)>=720&&j(k.time)<1080)},{k:"Noite",items:t.filter(k=>k.time&&j(k.time)>=1080)},{k:"Sem hor\xE1rio",items:t.filter(k=>!k.time)}],E=F(),I=e!==a;H=b.filter(k=>k.items.length).map(k=>`
      <div class="tl-group">
        <h3 class="tl-group__h">${k.k}<span>${k.items.length}</span></h3>
        ${k.items.map(ne=>{let rt="";return!I&&ne.time&&j(ne.time)>E&&(I=!0,rt=`<div class="nowline"><span>Agora \xB7 ${S(`${String(new Date().getHours()).padStart(2,"0")}:${String(new Date().getMinutes()).padStart(2,"0")}`)}</span></div>`),rt+Re(ne,{highlight:r})}).join("")}
      </div>`).join(""),!I&&e===a&&(H+=`<div class="nowline nowline--end"><span>Agora \xB7 ${S(`${String(new Date().getHours()).padStart(2,"0")}:${String(new Date().getMinutes()).padStart(2,"0")}`)} \xB7 fim da agenda</span></div>`)}let Me=s.notesOn(e),qe=`<section class="block">
    <h2 class="block__title">${p("note",16)} Bilhetes do dia</h2>
    <div class="notes">
      ${Me.map(b=>`<div class="note">
        <p>${f(b.text)}</p>
        <footer>${M(b.author,18)}<span>${f(s.member(b.author)?.name||"")}</span>
          <button class="note__del" data-action="del-note" data-id="${b.id}" aria-label="Apagar bilhete">${p("x",14)}</button></footer>
      </div>`).join("")}
      <form class="note-add" data-form="note">
        <input name="text" placeholder="Escreva um bilhete para a dupla\u2026" autocomplete="off" maxlength="280">
        <button class="iconbtn iconbtn--accent" aria-label="Adicionar bilhete">${p("plus",18)}</button>
      </form>
    </div>
  </section>`;return`${l}
  <div class="page">
    ${s.demo?ja():""}
    ${g}
    <button class="brief" data-action="assistant">
      <span class="brief__ic">${p("sparkle",18)}</span>
      <div><strong>Assistente</strong>${de(e,h.person).map(b=>`<p>${f(b)}</p>`).join("")}</div>
      ${p("right",18,"muted")}
    </button>
    ${D}
    <section class="block">
      <h2 class="block__title">${p("clock",16)} Agenda ${h.person==="all"?"da dupla":"de "+f(s.member(h.person)?.name||"")}</h2>
      ${x}
      ${H}
    </section>
    ${se}
    ${qe}
  </div>`}function Aa(e,a){let t=s.eventsOn(a,{person:e.id}),o=a===w()?F():-1,r=t.filter(l=>["shoot","meeting"].includes(T[l.type]?.kind)),i=t.filter(l=>ce(l.type)).length,n=t.find(l=>l.time&&l.status!=="feito"&&j(l.time)+be(l)>o),m=ee(e.id,a),d=m.dayOff?"Folga":`${K(Math.round(m.minutes/15)*15)||"0 min"} livres`;return`<button class="team__col" data-action="set-person" data-p="${e.id}">
    <span class="team__free ${m.dayOff?"is-off":m.minutes>=240?"is-good":m.minutes>=120?"is-mid":"is-low"}">${p("clock",12)} ${d}</span>
    <div class="team__head">${M(e.id,30)}<div><strong>${f(e.name)}</strong><small>${t.length} tarefa${t.length===1?"":"s"} \xB7 ${i} post${i===1?"":"s"}</small></div></div>
    <ul class="team__where">
      ${r.length?r.map(l=>`<li>${p(T[l.type].icon,13)}<span><b>${S(l.time)}</b> ${f(s.company(l.companyId)?.name||"")}</span></li>`).join(""):`<li class="muted">${p("building",13)}<span>Trabalho interno / remoto</span></li>`}
    </ul>
    ${n?`<div class="team__next">Pr\xF3ximo: <b>${S(n.time)}</b> ${f(T[n.type].label)} \xB7 ${f(s.company(n.companyId)?.name||"")}</div>`:`<div class="team__next muted">${t.length?"Tudo conclu\xEDdo \u2713":"Livre"}</div>`}
  </button>`}function Ta(e){let a=e.fixes?.length?`<div class="fixes">${e.fixes.map(t=>`<button class="fixbtn" data-action="apply-fix" data-id="${t.eventId}" data-patch="${f(JSON.stringify(t.patch))}">${p("check",13)} ${f(t.label)}</button>`).join("")}</div>`:"";return`<div class="tip tip--${e.level}"${e.ids?.length===1&&!a?` data-action="open-event" data-id="${e.ids[0]}"`:""}>
    <span class="tip__ic">${p(e.icon,16)}</span>
    <div><strong>${f(e.title)}</strong><p>${f(e.text)}</p>${a}</div>
  </div>`}function ja(){return`<div class="banner">
    ${p("sparkle",18)}
    <p><strong>Voc\xEA est\xE1 vendo dados de exemplo.</strong> Explore \xE0 vontade e, quando quiser come\xE7ar de verdade, apague os exemplos.</p>
    <button class="btn btn--soft btn--sm" data-action="clear-demo">Apagar exemplos</button>
  </div>`}function Rt(){let e=h.month,[a,t]=e.split("-").map(Number),o=new Date(a,t-1,1),r=_(ct(o),-o.getDay()),i=w(),n=Array.from({length:42},(y,se)=>_(r,se)),d=n.slice(35).some(y=>y.slice(0,7)===e)?n:n.slice(0,35),l={person:h.person,companyId:h.monthCompany},c=s.companiesSorted(),u=h.monthSel,$=s.eventsOn(u,l),x=s.eventsBetween(`${e}-01`,`${e}-31`,l),D=x.filter(y=>ce(y.type)).length,g=x.filter(y=>y.type==="captacao").length,P=x.filter(y=>y.type==="reuniao").length;return`
  <header class="hdr">
    <div class="hdr__row">
      <div class="hdr__titles">
        <p class="hdr__eyebrow">Calend\xE1rio</p>
        <h1>${f(ft(e).split(" ")[0])}<span class="hdr__date">${e.slice(0,4)}</span></h1>
      </div>
      <div class="hdr__actions">
        <button class="iconbtn" data-action="month" data-n="-1" aria-label="M\xEAs anterior">${p("left",20)}</button>
        <button class="chip" data-action="month-today">Hoje</button>
        <button class="iconbtn" data-action="month" data-n="1" aria-label="Pr\xF3ximo m\xEAs">${p("right",20)}</button>
      </div>
    </div>
    ${It()}
  </header>
  <div class="page">
    <div class="chips-scroll">
      <button class="chip${h.monthCompany?"":" is-on"}" data-action="month-company" data-id="">Todas as empresas</button>
      ${c.map(y=>`<button class="chip chip--co${h.monthCompany===y.id?" is-on":""}" style="--cc:${y.color}" data-action="month-company" data-id="${y.id}">${Le(y,18,5)}${f(y.name)}</button>`).join("")}
    </div>

    <div class="mstats">
      <div><b>${D}</b><span>posts</span></div>
      <div><b>${g}</b><span>capta\xE7\xF5es</span></div>
      <div><b>${P}</b><span>reuni\xF5es</span></div>
      <div><b>${x.filter(y=>y.status==="feito").length}/${x.length}</b><span>conclu\xEDdos</span></div>
    </div>

    <div class="month" data-swipe="month">
      <div class="month__wd">${pt.map(y=>`<span>${y}</span>`).join("")}</div>
      <div class="month__grid">
        ${d.map(y=>{let se=y.slice(0,7)===e,H=s.eventsOn(y,l),Me=H.some(qe=>qe.type==="captacao");return`<button class="mday${se?"":" is-out"}${y===i?" is-today":""}${y===u?" is-sel":""}" data-action="month-select" data-k="${y}">
            <span class="mday__n">${Number(y.slice(8))}</span>
            ${H.length?`<span class="mday__bars">${Ca(H)}</span><span class="mday__count">${Me?p("camera",10):""}${H.length}</span>`:""}
          </button>`}).join("")}
      </div>
    </div>

    <section class="block">
      <div class="block__row">
        <h2 class="block__title">${f(he(u))}</h2>
        <button class="btn-text btn-text--sm" data-action="open-day" data-k="${u}">Abrir dia ${p("right",14)}</button>
      </div>
      ${$.length?$.map(y=>Re(y)).join(""):Be("Nada neste dia","Toque no + para agendar.",`<button class="btn btn--soft" data-action="new-event" data-date="${u}">${p("plus",16)} Novo evento</button>`)}
    </section>

    ${c.length?`<section class="block">
      <h2 class="block__title">Legenda</h2>
      <div class="legend">${c.map(y=>`<span><i style="background:${y.color}"></i>${f(y.name)}</span>`).join("")}</div>
    </section>`:""}
  </div>`}function Ca(e){let a={};return e.forEach(t=>a[t.companyId]=(a[t.companyId]||0)+1),Object.entries(a).slice(0,4).map(([t])=>`<i style="background:${s.company(t)?.color||"#999"}"></i>`).join("")}var Ht="pauta.device",Ft="pauta.notifyPrefs",L=()=>{try{if(["localhost","127.0.0.1"].includes(location.hostname)&&localStorage.getItem("cal.pushServer"))return localStorage.getItem("cal.pushServer")}catch{}return(A.pushServer||"").replace(/\/+$/,"")},Da=()=>/iPhone|iPad|iPod/.test(navigator.userAgent)||navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1,Ma=()=>"serviceWorker"in navigator&&"PushManager"in window&&"Notification"in window,V=()=>"Notification"in window?Notification.permission:"unsupported",me=()=>Da()&&!Z(),Ue=()=>{try{return{reminders:!0,partner:!0,daily:!0,...JSON.parse(localStorage.getItem(Ft)||"{}")}}catch{return{reminders:!0,partner:!0,daily:!0}}},Bt=e=>{let a="=".repeat((4-e.length%4)%4),t=atob((e+a).replace(/-/g,"+").replace(/_/g,"/"));return Uint8Array.from(t,o=>o.charCodeAt(0))},qa=async e=>{let a=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(e));return"d_"+Array.from(new Uint8Array(a).slice(0,16),t=>t.toString(16).padStart(2,"0")).join("")};async function Y(e,a){if(!L())throw Object.assign(new Error("Servidor de avisos n\xE3o configurado."),{code:"no-server"});let t=await s.idToken();if(!t)throw Object.assign(new Error("Fa\xE7a login para usar."),{code:"no-login"});let o=await fetch(L()+e,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify(a||{})}),r=await o.json().catch(()=>({}));if(!o.ok)throw Object.assign(new Error(r.error||`Erro ${o.status}`),{status:o.status});return r}async function _e(){return me()?{ok:!1,reason:"install"}:Ma()?await Notification.requestPermission()!=="granted"?{ok:!1,reason:"denied"}:s.mode!=="cloud"||!L()?{ok:!0,local:!0}:ke():{ok:!1,reason:"unsupported"}}async function ke(){if(s.mode!=="cloud"||!L()||V()!=="granted"||!s.me)return{ok:!1,reason:"not-ready"};let e;try{e=(await(await fetch(L()+"/vapid")).json()).publicKey}catch{return{ok:!1,reason:"server"}}if(!e)return{ok:!1,reason:"server"};let a=await navigator.serviceWorker.ready,t=await a.pushManager.getSubscription();if(t&&t.options?.applicationServerKey){let i=new Uint8Array(t.options.applicationServerKey),n=Bt(e);(i.length!==n.length||i.some((m,d)=>m!==n[d]))&&(await t.unsubscribe(),t=null)}t||(t=await a.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:Bt(e)}));let o=t.toJSON(),r=await qa(o.endpoint);return await Y("/subscribe",{id:r,subscription:{endpoint:o.endpoint,keys:o.keys},prefs:Ue()}),localStorage.setItem(Ht,r),{ok:!0,id:r}}async function Vt(e){localStorage.setItem(Ft,JSON.stringify(e)),s.mode==="cloud"&&V()==="granted"&&await ke().catch(()=>{})}async function Se(){return s.mode==="cloud"&&L()?localStorage.getItem(Ht)?{kind:"server",...await Y("/test")}:{kind:"not-registered"}:(await(await navigator.serviceWorker.ready).showNotification("Notifica\xE7\xF5es ativadas \u2713",{body:"\xC9 assim que os lembretes v\xE3o chegar.",icon:"icons/icon-192.png",badge:"icons/icon-192.png",tag:"teste"}),{kind:"local"})}function Ke(e){try{if(!("setAppBadge"in navigator))return;e>0?navigator.setAppBadge(e).catch(()=>{}):navigator.clearAppBadge().catch(()=>{})}catch{}}var Je="pauta.onboarded",xe="pauta.notifyAskedAt";function zt(){if(!localStorage.getItem(Je))return Ye(s.me?["welcome","notify","done"]:["welcome","who","notify","done"]);if(!s.me&&s.mode==="local")return Ye(["who"]);let a=Number(localStorage.getItem(xe)||0);if(Z()&&V()==="default"&&Date.now()-a>3*864e5)return Ye(["notify"])}function We(e,a,t="agora"){return`<div class="nprev">
    <img src="icons/icon-192.png" alt="">
    <div><div class="nprev__top"><b>${f(A.appName.toUpperCase())}</b><span>${f(t)}</span></div>
    <strong>${f(e)}</strong><p>${f(a)}</p></div>
  </div>`}function Oa(e,a,t){let o=s.member(s.me),r=s.team.find(n=>n.id!==s.me)||s.team[1]||s.team[0],i=t>1?`<div class="ob__dots">${Array.from({length:t},(n,m)=>`<i class="${m===a?"is-on":""}"></i>`).join("")}</div>`:"";return e==="welcome"?`<div class="ob__art"><img class="ob__icon" src="icons/icon-512.png" alt=""></div>
      <h1>Bem-vindo ao ${f(A.appName)}</h1>
      <p>A agenda de conte\xFAdo de ${f(A.agencyName)}: posts, stories, reels e capta\xE7\xF5es de todas as empresas, num lugar s\xF3.</p>
      ${i}
      <button class="btn btn--primary btn--block" data-next>Come\xE7ar</button>`:e==="who"?`<div class="ob__art ob__art--sm">${p("user",34)}</div>
      <h1>Quem vai usar este celular?</h1>
      <p>Assim o app sabe de quem s\xE3o os lembretes e avisa o parceiro quando voc\xEA marcar algo.</p>
      <div class="whogrid ob__who">${s.team.map(n=>`<button class="whobtn${s.me===n.id?" is-on":""}" style="--mc:${n.color}" data-me="${n.id}">${M(n.id,36)}<span>${f(n.name)}</span><i class="whobtn__check">${p("check",14)}</i></button>`).join("")}</div>
      ${i}
      <button class="btn btn--primary btn--block" data-next ${s.me?"":"disabled"}>Continuar</button>`:e==="notify"?`<div class="ob__previews">
        ${We("Daqui a 2h: Reels \xB7 Pura Vida","18h \u2014 postar o Reels \u201CBastidores\u201D","agora")}
        ${We(`${r?.name||"Seu parceiro"} marcou para voc\xEA`,"Story \xB7 Caf\xE9 Aroma \u2014 amanh\xE3, 16h","h\xE1 2 min")}
        ${We(`Bom dia, ${o?.name||"Henrique"}! Seu dia hoje`,"5 tarefas \xB7 primeira: 11h30 Feed \xB7 Studio Fit","8:00")}
      </div>
      <h1>Nunca mais esque\xE7a um post</h1>
      <p>Lembretes 2h e 30 min antes de cada post, aviso na v\xE9spera das capta\xE7\xF5es, cobran\xE7a se algo ficou para tr\xE1s e aviso quando o parceiro marcar algo para voc\xEA.</p>
      <div data-notify-msg></div>
      ${i}
      <button class="btn btn--primary btn--block" data-enable>${p("bell",18)} Ativar notifica\xE7\xF5es</button>
      <button class="btn btn--ghost btn--block" data-skip>Agora n\xE3o</button>`:`<div class="ob__art ob__art--ok">${p("check",40)}</div>
    <h1>Tudo pronto${o?", "+f(o.name):""}!</h1>
    <ul class="ob__tips">
      <li>${p("plus",18)}<span>Toque no <b>+</b> para marcar posts, capta\xE7\xF5es e reuni\xF5es.</span></li>
      <li>${p("sparkle",18)}<span>O <b>Assistente</b> avisa conflitos e sugere os melhores hor\xE1rios.</span></li>
      <li>${p("link",18)}<span>Em <b>Empresas</b>, mande para cada cliente o link do cronograma dele.</span></li>
    </ul>
    ${i}
    <button class="btn btn--primary btn--block" data-next>Abrir a agenda</button>`}function Ye(e){if(document.querySelector(".ob"))return;let a=0,t=document.createElement("div");t.className="ob",t.innerHTML='<div class="ob__card"></div>',document.body.appendChild(t),requestAnimationFrame(()=>t.classList.add("is-in"));let o=t.querySelector(".ob__card"),r=()=>{(e.includes("welcome")||e.includes("done"))&&localStorage.setItem(Je,"1"),t.classList.remove("is-in"),setTimeout(()=>t.remove(),400)},i=d=>{if(d>=e.length)return r();a=d,o.classList.remove("is-shown"),setTimeout(()=>{o.innerHTML=Oa(e[a],a,e.length),m(),o.classList.add("is-shown")},o.innerHTML?180:0)},n=(d,l="info")=>{let c=o.querySelector("[data-notify-msg]");c&&(c.innerHTML=`<div class="ob__msg ob__msg--${l}">${d}</div>`)},m=()=>{o.querySelectorAll("[data-next]").forEach(c=>c.onclick=()=>i(a+1)),o.querySelectorAll("[data-me]").forEach(c=>c.onclick=()=>{s.setMe(c.dataset.me),o.querySelectorAll("[data-me]").forEach(u=>u.classList.toggle("is-on",u===c)),o.querySelector("[data-next]").disabled=!1});let d=o.querySelector("[data-skip]");d&&(d.onclick=()=>{localStorage.setItem(xe,String(Date.now())),i(a+1)});let l=o.querySelector("[data-enable]");l&&(l.onclick=async()=>{if(localStorage.setItem(xe,String(Date.now())),me()){n(`<b>Primeiro instale o app.</b> No iPhone, as notifica\xE7\xF5es s\xF3 funcionam pelo \xEDcone da Tela de In\xEDcio:<br>
          1. Toque em ${p("share",14)} <b>Compartilhar</b><br>2. <b>Adicionar \xE0 Tela de In\xEDcio</b><br>3. Abra o ${f(A.appName)} pelo \xEDcone`,"warn"),l.outerHTML='<button class="btn btn--primary btn--block" data-next>Entendi</button>',m();return}l.disabled=!0,l.innerHTML="Aguardando permiss\xE3o\u2026";let c=await _e().catch(()=>({ok:!1,reason:"error"}));c.ok?(c.local?n("Ativado neste celular. Para os avisos chegarem com o app fechado e no celular do parceiro, falta ligar o servidor de notifica\xE7\xF5es (Ajustes \u2192 Notifica\xE7\xF5es).","ok"):(n("Pronto! Voc\xEA vai receber uma notifica\xE7\xE3o de teste em instantes.","ok"),Se().catch(()=>{})),l.outerHTML='<button class="btn btn--primary btn--block" data-next>Continuar</button>',o.querySelector("[data-skip]")?.remove(),m()):c.reason==="server"?(n("Permiss\xE3o concedida! O servidor de notifica\xE7\xF5es ainda n\xE3o foi publicado; quando for, este celular \xE9 cadastrado sozinho.","ok"),l.outerHTML='<button class="btn btn--primary btn--block" data-next>Continuar</button>',m()):c.reason==="denied"?(n(`As notifica\xE7\xF5es foram bloqueadas. Para ligar depois: <b>Ajustes do iPhone \u2192 Notifica\xE7\xF5es \u2192 ${f(A.appName)}</b>.`,"warn"),l.outerHTML='<button class="btn btn--primary btn--block" data-next>Continuar</button>',m()):(n("Este aparelho n\xE3o aceita notifica\xE7\xF5es deste app.","warn"),l.disabled=!1,l.innerHTML="Tentar de novo")})};i(0)}function Ut(){localStorage.removeItem(Je),localStorage.removeItem(xe),v("A apresenta\xE7\xE3o aparece na pr\xF3xima abertura")}function Kt(){let e=s.member(s.me),a=s.mode==="cloud",t="Notification"in window&&Notification.permission==="granted";return`
  <header class="hdr">
    <div class="hdr__row"><div class="hdr__titles"><p class="hdr__eyebrow">${f(A.appName)} \xB7 ${f(A.agencyName)}</p><h1>Ajustes</h1></div></div>
  </header>
  <div class="page">
    <section class="block">
      <h2 class="block__title">${p("user",16)} Quem est\xE1 usando este celular?</h2>
      ${a?`<div class="card card--row">${e?M(e.id,40):p("user",24)}<div><strong>${f(e?.name||s.user?.email||"")}</strong><small>${f(s.user?.email||"")}</small></div>
            <button class="btn btn--soft btn--sm" data-action="logout">${p("logout",16)} Sair</button></div>`:`<div class="whogrid">${s.team.map(o=>`<button class="whobtn${s.me===o.id?" is-on":""}" style="--mc:${o.color}" data-action="set-me" data-p="${o.id}">${M(o.id,34)}<span>${f(o.name)}</span><i class="whobtn__check">${p("check",14)}</i></button>`).join("")}</div>
           <p class="fhelp">Usado para sauda\xE7\xE3o, \u201CCriado por\u201D e nos lembretes.</p>`}
    </section>

    ${Pa()}

    <section class="block">
      <h2 class="block__title">${p("sparkle",16)} Assistente e Claude</h2>
      <div class="card card--row">
        ${p("sparkle",22)}
        <div><strong>Assistente autom\xE1tico ativo</strong><small>Confere conflitos, tempo livre e melhores hor\xE1rios sozinho, sem internet e sem chave.</small></div>
        <button class="btn btn--soft btn--sm" data-action="assistant">Abrir</button>
      </div>
      <p class="fhelp">Para perguntas abertas (ideias, reorganizar a semana), use \u201CPerguntar ao Claude\u201D no Assistente. Abre o Claude com o seu login normal, sem chave de API.</p>
    </section>

    ${Na()}

    <section class="block">
      <h2 class="block__title">${p("calendar",16)} Lembretes no Calend\xE1rio do iPhone</h2>
      <div class="card">
        <p>Envie a agenda para o <b>Calend\xE1rio do iPhone</b> com alarmes. Assim o celular avisa na hora certa, mesmo com o app fechado.</p>
        <div class="btnrow">
          <button class="btn btn--primary btn--sm" data-action="ics" data-who="me" data-days="7">${p("download",16)} Minha semana</button>
          <button class="btn btn--soft btn--sm" data-action="ics" data-who="me" data-days="30">Meus 30 dias</button>
          <button class="btn btn--soft btn--sm" data-action="ics" data-who="all" data-days="7">Semana da dupla</button>
        </div>
        <p class="fhelp">No iPhone, toque em \u201CCalend\xE1rio\u201D ou abra o arquivo baixado e escolha \u201CAdicionar tudo\u201D. Se mudar algo depois, exporte de novo.</p>
      </div>
    </section>

    <section class="block">
      <h2 class="block__title">${p("cloud",16)} Sincroniza\xE7\xE3o</h2>
      <div class="card card--row ${a?"card--ok":"card--warn"}">
        ${p(a?"cloud":"phone",22)}
        <div><strong>${a?"Sincronizado na nuvem":"Salvo s\xF3 neste aparelho"}</strong>
        <small>${a?"Henrique, Matheus e os links dos clientes veem tudo em tempo real.":"Para Henrique e Matheus verem a mesma agenda em celulares diferentes, ative a nuvem (gratuito). Veja o guia no README do projeto."}</small></div>
      </div>
    </section>

    ${Z()?"":`<section class="block">
      <h2 class="block__title">${p("phone",16)} Instalar como app</h2>
      <div class="card">
        <ol class="steps">
          <li>Abra este endere\xE7o no <b>Safari</b>.</li>
          <li>Toque em ${p("share",15)} <b>Compartilhar</b>.</li>
          <li>Escolha <b>Adicionar \xE0 Tela de In\xEDcio</b>.</li>
        </ol>
        <p class="fhelp">O app abre em tela cheia, como um aplicativo normal.</p>
      </div>
    </section>`}

    <section class="block">
      <h2 class="block__title">${p("bulb",16)} Melhores hor\xE1rios (refer\xEAncia)</h2>
      <div class="card card--flush">
        <ul class="besttimes">
          ${_t.map(o=>`<li><span class="tbadge tbadge--${o.type}">${p(T[o.type].icon,13)}${T[o.type].label}</span><span>${f(o.text)}</span></li>`).join("")}
        </ul>
        <p class="fhelp pad">M\xE9dias de mercado. Confiram os Insights do Instagram de cada cliente e ajustem: cada p\xFAblico tem seu hor\xE1rio de pico.</p>
      </div>
    </section>

    <section class="block">
      <h2 class="block__title">${p("download",16)} Dados e backup</h2>
      <div class="list">
        <button class="list__row" data-action="export">${p("download",18)}<span>Exportar backup (.json)</span>${p("right",16,"muted")}</button>
        <label class="list__row">${p("upload",18)}<span>Importar backup</span><input type="file" accept="application/json,.json" data-action-change="import" hidden>${p("right",16,"muted")}</label>
        ${s.demo?`<button class="list__row" data-action="clear-demo">${p("sparkle",18)}<span>Apagar dados de exemplo</span>${p("right",16,"muted")}</button>`:""}
        <button class="list__row is-danger" data-action="clear-all">${p("trash",18)}<span>Apagar tudo</span>${p("right",16,"muted")}</button>
      </div>
      <p class="fhelp">${s.state.companies.length} empresas \xB7 ${s.state.events.length} eventos \xB7 ${s.state.notes.length} bilhetes</p>
    </section>
    <p class="about">${f(A.appName)} \u2014 agenda de conte\xFAdo \xB7 v1.0</p>
  </div>`}function Na(){let e=V(),a=me(),t=s.mode==="cloud",o=!!localStorage.getItem("pauta.device"),r=Ue(),i,n,m="";return a?(i="warn",n="No iPhone, as notifica\xE7\xF5es s\xF3 funcionam com o app instalado: Compartilhar \u2192 Adicionar \xE0 Tela de In\xEDcio, e abra pelo \xEDcone."):e==="unsupported"?(i="warn",n="Este navegador n\xE3o aceita notifica\xE7\xF5es."):e==="denied"?(i="warn",n=`Bloqueadas. Para ligar: Ajustes do iPhone \u2192 Notifica\xE7\xF5es \u2192 ${A.appName}.`):e!=="granted"?(i="warn",n="Desativadas neste celular.",m='<button class="btn btn--primary btn--sm" data-action="notify-enable">Ativar</button>'):t&&o?(i="ok",n="Ativadas. Os lembretes e os avisos do parceiro chegam mesmo com o app fechado.",m='<button class="btn btn--soft btn--sm" data-action="notify-enable">Recadastrar</button>'):t?(i="warn",n="Permiss\xE3o concedida, mas este celular ainda n\xE3o foi cadastrado no servidor. Toque em Cadastrar.",m='<button class="btn btn--primary btn--sm" data-action="notify-enable">Cadastrar</button>'):(i="warn",n="Ativadas s\xF3 com o app aberto. Para receber com o app fechado e no celular do parceiro, ligue a nuvem e o servidor (README)."),`<section class="block">
    <h2 class="block__title">${p("bell",16)} Notifica\xE7\xF5es</h2>
    <div class="card card--row ${i==="ok"?"card--ok":"card--warn"}">
      ${p("bell",22)}
      <div><strong>${i==="ok"?"Funcionando":"Aten\xE7\xE3o"}</strong><small>${f(n)}</small></div>
      ${m}
    </div>
    <form class="list notif-prefs" data-notify-form onsubmit="return false">
      <label class="list__row"><span><b>Lembretes dos meus posts</b><small>2h e 30 min antes, na hora e cobran\xE7a se atrasar</small></span><input type="checkbox" class="switch" name="reminders" ${r.reminders?"checked":""}></label>
      <label class="list__row"><span><b>Avisos do parceiro</b><small>quando marcar, mudar ou concluir algo</small></span><input type="checkbox" class="switch" name="partner" ${r.partner?"checked":""}></label>
      <label class="list__row"><span><b>Resumo do dia</b><small>\xE0s 8h (hoje) e \xE0s 20h (amanh\xE3)</small></span><input type="checkbox" class="switch" name="daily" ${r.daily?"checked":""}></label>
    </form>
    ${e==="granted"?`<button class="btn btn--soft btn--block" data-action="notify-test">${p("bell",16)} Enviar notifica\xE7\xE3o de teste</button>`:""}
    <button class="btn-text btn-text--sm" data-action="onboarding-again">Ver a apresenta\xE7\xE3o de novo</button>
  </section>`}function Pa(){let e=N(),a=[0,15,30,45,60,90];return`<section class="block">
    <h2 class="block__title">${p("clock",16)} Rotina e tempo livre</h2>
    <form class="list" data-routine-form onsubmit="return false">
      <label class="list__row"><span>Expediente</span><input type="time" name="workStart" value="${e.workStart}"> <input type="time" name="workEnd" value="${e.workEnd}"></label>
      <label class="list__row"><span>Almo\xE7o</span><input type="time" name="lunchStart" value="${e.lunchStart}"> <input type="time" name="lunchEnd" value="${e.lunchEnd}"></label>
      <label class="list__row"><span>Deslocamento entre lugares</span><select name="travelMin">${a.map(t=>`<option value="${t}"${e.travelMin===t?" selected":""}>${t?t+" min":"n\xE3o considerar"}</option>`).join("")}</select></label>
      <label class="list__row"><span>M\xE1ximo de tarefas/dia</span><select name="maxTasks">${[4,5,6,7,8,10,12,15,20].map(t=>`<option value="${t}"${e.maxTasks===t?" selected":""}>${t}</option>`).join("")}</select></label>
      <div class="list__row list__row--col"><span>Dias de folga</span>
        <div class="daysoff">${X.map((t,o)=>`<label class="dayoff"><input type="checkbox" name="off" value="${o}"${e.daysOff.includes(o)?" checked":""}><span>${t}</span></label>`).join("")}</div>
      </div>
    </form>
    <p class="fhelp">O assistente usa isso para n\xE3o marcar nada em cima do almo\xE7o, da folga ou fora do expediente, e para proteger o tempo livre de voc\xEAs.</p>
  </section>`}var R={async notifyEnable(){let e=await _e().catch(a=>({ok:!1,reason:"error",message:a.message}));e.ok?v(e.local?"Ativado (com o app aberto)":"Notifica\xE7\xF5es ativadas"):e.reason==="install"?v("Instale o app na Tela de In\xEDcio primeiro"):e.reason==="denied"?v("Bloqueado: libere em Ajustes do iPhone \u2192 Notifica\xE7\xF5es"):e.reason==="server"?v("Servidor de notifica\xE7\xF5es ainda n\xE3o publicado"):v(`N\xE3o foi poss\xEDvel ativar${e.message?": "+e.message:""}`,{ms:8e3}),s.emit()},async notifyTest(){let e;try{e=await Se()}catch(a){return v(`Falhou: ${a.message}`,{ms:8e3})}if(e.kind==="not-registered")return v('Este celular ainda n\xE3o est\xE1 cadastrado. Toque em "Ativar" acima.',{ms:7e3});if(e.kind==="local")return v("Notifica\xE7\xE3o local mostrada (servidor n\xE3o configurado)");if(e.sent>0)return v("Enviada! Deve chegar em alguns segundos. Bloqueie a tela para ver.",{ms:7e3});if(!e.devices)return v('O servidor n\xE3o tem este celular cadastrado. Toque em "Ativar" de novo.',{ms:7e3});v(`A Apple n\xE3o aceitou o envio (${(e.statuses||[]).join(", ")||"sem resposta"}). Toque em "Ativar" de novo.`,{ms:9e3})},async notifyPrefs(e){await Vt({reminders:e.reminders.checked,partner:e.partner.checked,daily:e.daily.checked}),v("Prefer\xEAncias salvas")},onboardingAgain(){Ut()},async routine(e){let a=(r,i)=>/^\d{2}:\d{2}$/.test(e[r].value)?e[r].value:i,t=N(),o={id:"routine",workStart:a("workStart",t.workStart),workEnd:a("workEnd",t.workEnd),lunchStart:a("lunchStart",t.lunchStart),lunchEnd:a("lunchEnd",t.lunchEnd),travelMin:Number(e.travelMin.value),maxTasks:Number(e.maxTasks.value),daysOff:[...e.querySelectorAll('input[name="off"]:checked')].map(r=>Number(r.value))};if(o.workEnd<=o.workStart)return v("O fim do expediente precisa ser depois do in\xEDcio");if(o.lunchEnd<=o.lunchStart)return v("O fim do almo\xE7o precisa ser depois do in\xEDcio");await s.upsert("settings",o),v("Rotina salva")},async ics(e){let a=e.dataset.who==="me"?s.me:"all";if(e.dataset.who==="me"&&!s.me)return v("Escolha primeiro quem est\xE1 usando este celular");let t=Number(e.dataset.days),o=w(),r=s.eventsBetween(o,_(o,t),{person:a}).filter(n=>n.status!=="feito");if(!r.length)return v("Nada agendado nesse per\xEDodo");let i=a==="all"?`${A.appName} \u2013 Dupla`:`${A.appName} \u2013 ${s.member(a).name}`;await Dt(r,`pauta-${a}-${o}.ics`,i)},export(){let e=new Blob([s.exportData()],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(e),a.download=`pauta-backup-${w()}.json`,document.body.appendChild(a),a.click(),a.remove(),v("Backup exportado")},async import(e){let a=e.files[0];if(a)try{let t=await a.text(),o=await Tt({title:"Importar backup",text:"Como deseja importar?",options:[{label:"Juntar com os dados atuais",value:"merge",primary:!0},{label:"Substituir tudo",value:"replace",danger:!0}]});if(!o)return;await s.importData(t,{replace:o==="replace"}),v("Backup importado")}catch{v("Arquivo inv\xE1lido")}finally{e.value=""}},async clearAll(){await le({title:"Apagar TUDO?",text:"Empresas, eventos e bilhetes ser\xE3o apagados. Exporte um backup antes, se precisar.",ok:"Apagar tudo",danger:!0})&&(await s.clearAll(),v("Tudo apagado"))}};var Qe=[{label:"Organize meu dia",q:"Analise a agenda de hoje e me diga, em ordem, o que fazer e quando. Aponte conflitos e onde d\xE1 para ganhar tempo livre."},{label:"Melhores hor\xE1rios da semana",q:"Sugira os melhores hor\xE1rios para os posts desta semana de cada empresa, sem conflitar com as capta\xE7\xF5es e respeitando o expediente e o almo\xE7o."},{label:"Equilibrar a dupla",q:"A carga de trabalho entre Henrique e Matheus est\xE1 equilibrada nos pr\xF3ximos 7 dias? Sugira trocas concretas de respons\xE1vel."},{label:"Ideias de conte\xFAdo",q:"Para cada empresa, sugira 3 ideias de posts (feed, reels e stories) para a pr\xF3xima semana, com legenda curta."}],Ia=(e=[])=>e.map(a=>s.member(a)?.name).filter(Boolean).join(" e ")||"sem respons\xE1vel";function La(e,a=14){let t=N(),o=w(),r=new Date,i=[];i.push(`Voc\xEA \xE9 o assistente de organiza\xE7\xE3o de uma dupla de social media (${s.team.map(d=>d.name).join(" e ")}) que cuida do Instagram de v\xE1rias empresas. Responda em portugu\xEAs do Brasil, de forma curta e direta (sem rodeios), com hor\xE1rios concretos e no m\xE1ximo uns 10 itens.`),i.push(""),i.push(`Agora: ${re(o)}, ${r.toTimeString().slice(0,5)}.`),i.push(`Rotina combinada: expediente ${t.workStart}\u2013${t.workEnd}, almo\xE7o ${t.lunchStart}\u2013${t.lunchEnd}, folga: ${t.daysOff.map(d=>mt[d]).join(", ")||"nenhuma"}, deslocamento m\xEDnimo entre lugares: ${t.travelMin} min, m\xE1ximo de ${t.maxTasks} tarefas por pessoa/dia.`),i.push(`Empresas: ${s.companiesSorted().map(d=>d.name+(d.instagram?` (@${d.instagram})`:"")).join(", ")||"nenhuma"}.`),i.push(""),i.push(`Agenda (de hoje at\xE9 ${a} dias):`);let n=s.eventsBetween(_(o,-1),_(o,a)),m="";return n.forEach(d=>{d.date!==m&&(i.push(`
${re(d.date)}:`),m=d.date);let l=s.company(d.companyId),c=d.duration?` (${d.duration} min)`:"";i.push(`- ${d.time||"sem hor\xE1rio"}${c} \xB7 ${T[d.type]?.label} \xB7 ${l?.name||"?"} \xB7 "${d.title||""}" \xB7 ${Ia(d.assignees)} \xB7 ${d.status==="feito"?"feito":d.status==="pronto"?"pronto":"a fazer"}${d.location?" \xB7 local: "+d.location:""}`)}),n.length||i.push("(nenhum compromisso)"),i.push(""),i.push(`Pergunta: ${e}`),i.join(`
`)}function Gt(e){let a=La(e);try{navigator.clipboard?.writeText(a).catch(()=>{})}catch{}let t=encodeURIComponent(a),o=t.length<7500?`https://claude.ai/new?q=${t}`:"https://claude.ai/new";window.open(o,"_blank","noopener"),v(t.length<7500?"Abrindo o Claude\u2026 (a agenda tamb\xE9m foi copiada)":"Agenda copiada: cole no Claude (segure no campo \u2192 Colar)",{ms:5e3})}var Qt="cal.chat",z=(()=>{try{return JSON.parse(localStorage.getItem(Qt)||"[]").slice(-30)}catch{return[]}})(),te=!1,Wt=()=>{try{localStorage.setItem(Qt,JSON.stringify(z.slice(-30)))}catch{}},Ra=e=>f(e).replace(/\*\*(.+?)\*\*/g,"<b>$1</b>").replace(/^#{1,4}\s*(.+)$/gm,"<b>$1</b>").replace(/^\s*[-•*]\s+(.+)$/gm,'<span class="li">$1</span>').replace(/<\/span>\n+(?=<span class="li">)/g,"</span>").replace(/\n{2,}/g,`
`).replace(/\n/g,"<br>"),Yt={"functions/failed-precondition":null,"functions/permission-denied":"S\xF3 a equipe pode usar o assistente.","functions/resource-exhausted":null,"functions/unavailable":"Sem conex\xE3o com o assistente agora. Tente de novo.","functions/deadline-exceeded":"O assistente demorou demais. Tente de novo."};function Ba(e){return e?.code==="local"?"O assistente precisa da sincroniza\xE7\xE3o na nuvem ligada.":e?.code==="no-server"?"O assistente ainda n\xE3o foi ligado no servidor. Falta publicar o servidor gratuito (veja o README).":e?.status?e.message:e?.code in Yt?Yt[e.code]||e.message:e?.code==="functions/not-found"||e?.code==="functions/internal"&&!/assistente|Claude/.test(e.message||"")?"O assistente ainda n\xE3o foi ligado no servidor. Falta publicar o servidor com a chave do Claude (veja o README, se\xE7\xE3o 5).":e?.message||"N\xE3o consegui falar com o assistente."}function Jt(){return`<section class="block" data-chat>
    <h2 class="block__title">${p("sparkle",16)} Pergunte ao assistente</h2>
    <div class="chat">
      ${z.length?z.map(e=>`<div class="msg msg--${e.role}${e.error?" msg--err":""}">${Ra(e.text)}</div>`).join(""):'<div class="msg msg--assistant">Oi! Eu vejo a agenda inteira de voc\xEAs: posts, capta\xE7\xF5es, reuni\xF5es, empresas e a rotina. Pergunte o que quiser, por exemplo \u201Co que eu tenho amanh\xE3?\u201D ou \u201Cqual o melhor hor\xE1rio para um Reels da Pura Vida na sexta?\u201D.</div>'}
      ${te?'<div class="msg msg--assistant msg--typing"><i></i><i></i><i></i></div>':""}
    </div>
    <div class="presets">${Qe.map((e,a)=>`<button class="preset" data-preset="${a}">${f(e.label)}</button>`).join("")}</div>
    <form class="chat__form" data-chatform onsubmit="return false">
      <textarea class="input" rows="1" name="q" placeholder="Escreva sua pergunta\u2026" ${te?"disabled":""}></textarea>
      <button class="iconbtn iconbtn--accent" type="submit" aria-label="Enviar" ${te?"disabled":""}>${p("right",20)}</button>
    </form>
    <div class="chat__foot">
      ${z.length?'<button class="btn-text btn-text--sm" data-clearchat>Limpar conversa</button>':"<span></span>"}
      <button class="btn-text btn-text--sm" data-extclaude>Abrir no app do Claude</button>
    </div>
  </section>`}var Ha=e=>f(JSON.stringify(e));function Fa(e="all"){let a=w(),t=e==="all"?s.team.map(n=>n.id):[e],o=[],r=new Set;for(let n=0;n<7;n++){let m=_(a,n);t.forEach(l=>we(l,m).forEach(c=>{let u=c.ids.slice().sort().join("|")+c.title;r.has(u)||(r.add(u),o.push({...c,date:m}))})),s.eventsOn(m).filter(l=>!(l.assignees||[]).length&&l.status!=="feito").forEach(l=>o.push({date:m,level:"warn",icon:"user",ids:[l.id],title:"Sem respons\xE1vel",text:`${S(l.time)} ${q(l)}`,fixes:s.team.map(c=>({label:`Dar para ${c.name}`,eventId:l.id,patch:{assignees:[c.id]}}))}))}let i=s.state.events.filter(n=>n.status==="pendente"&&(n.date<a||n.date===a&&n.time&&j(n.time)+15<F())&&n.date>=_(a,-7));return i.length&&o.unshift({date:a,level:"warn",icon:"flag",ids:i.map(n=>n.id),title:`${i.length} tarefa${i.length>1?"s":""} pendente${i.length>1?"s":""} no passado`,text:"Marquem como feito ou reagendem para o cronograma do cliente ficar correto."}),o}function Xt(){let e={type:"feed",date:h.date>=w()?h.date:w(),q:""},a=()=>{let i=w(),n=Fa(),m=N(),d=Array.from({length:7},(c,u)=>_(i,u)),l={id:"__probe",type:e.type,date:e.date,assignees:[]};return`
    ${At("Assistente")}
    <div class="page page--sheet">
      <div class="assist-hero">
        <span class="assist-hero__ic">${p("sparkle",22)}</span>
        <div><strong>Analisando a agenda de voc\xEAs</strong><p>Funciona sozinho, sem internet. Confere conflitos, tempo livre e os melhores hor\xE1rios sempre que algo muda.</p></div>
      </div>

      ${Jt()}

      <section class="block">
        <h2 class="block__title">${p("today",16)} Hoje</h2>
        <div class="card">${de(i).map(c=>`<p>${f(c)}</p>`).join("")}</div>
        <h2 class="block__title">${p("calendar",16)} Amanh\xE3</h2>
        <div class="card">${de(_(i,1)).map(c=>`<p>${f(c)}</p>`).join("")}</div>
      </section>

      <section class="block">
        <h2 class="block__title">${p("alert",16)} Precisa de aten\xE7\xE3o (7 dias)</h2>
        ${n.length?`<div class="tips">${n.map(c=>`
          <div class="tip tip--${c.level}">
            <span class="tip__ic">${p(c.icon,16)}</span>
            <div>
              <small class="tip__date">${f(he(c.date))}</small>
              <strong>${f(c.title)}</strong><p>${f(c.text)}</p>
              ${c.fixes?.length?`<div class="fixes">${c.fixes.map(u=>`<button class="fixbtn" data-action="apply-fix" data-id="${u.eventId}" data-patch="${Ha(u.patch)}">${p("check",13)} ${f(u.label)}</button>`).join("")}</div>`:""}
              ${c.ids?.length===1?`<button class="btn-text btn-text--sm" data-action="open-event" data-id="${c.ids[0]}">Ver evento</button>`:""}
            </div>
          </div>`).join("")}</div>`:`<div class="tip tip--ok"><span class="tip__ic">${p("check",16)}</span><div><strong>Tudo certo</strong><p>Nenhum conflito nos pr\xF3ximos 7 dias.</p></div></div>`}
      </section>

      <section class="block">
        <h2 class="block__title">${p("clock",16)} Tempo livre no expediente (${S(m.workStart)}\u2013${S(m.workEnd)})</h2>
        <div class="freegrid">
          <span></span>${d.map(c=>`<span class="freegrid__d">${X[U(c).getDay()]}<b>${U(c).getDate()}</b></span>`).join("")}
          ${s.team.map(c=>`${M(c.id,24)}${d.map(u=>{let $=ee(c.id,u);if($.dayOff)return'<span class="freecell is-off">folga</span>';let x=$.minutes/60;return`<span class="freecell ${x>=4?"is-good":x>=2?"is-mid":"is-low"}">${K(Math.round($.minutes/15)*15)||"0"}</span>`}).join("")}`).join("")}
        </div>
        <p class="fhelp">Verde: dia tranquilo \xB7 amarelo: apertado \xB7 vermelho: sem respiro. Ajuste a rotina em Ajustes.</p>
      </section>

      <section class="block">
        <h2 class="block__title">${p("bulb",16)} Encontrar o melhor hor\xE1rio</h2>
        <div class="card">
          <div class="row2">
            <select class="input" data-f="type">${wt.map(c=>`<option value="${c}"${e.type===c?" selected":""}>${T[c].label}</option>`).join("")}</select>
            <input class="input" type="date" data-f="date" value="${e.date}">
          </div>
          ${s.team.map(c=>{let u=jt({...l},{people:[c.id],limit:4});return`<div class="findrow">${M(c.id,26)}<div class="hintbox__times">${u.length?u.map($=>`<button class="tchip" data-new="${c.id}|${$.time}">${S($.time)}${$.peak?"<small>pico</small>":""}</button>`).join(""):'<span class="muted">Sem hor\xE1rio livre</span>'}</div></div>`}).join("")}
          <p class="fhelp">Toque num hor\xE1rio para j\xE1 criar o evento com a pessoa certa.</p>
        </div>
      </section>

    </div>`},t=Et({className:"sheet--tall",html:a(),onMount:i=>{let n=i.el;n.querySelector('[data-f="type"]').onchange=d=>{e.type=d.target.value,i.set(a())},n.querySelector('[data-f="date"]').onchange=d=>{d.target.value&&(e.date=d.target.value,i.set(a()))},n.querySelectorAll("[data-new]").forEach(d=>d.onclick=async()=>{let[l,c]=d.dataset.new.split("|"),{openEventEditor:u}=await import("./c-FJTSIK4O.js");u({date:e.date,type:e.type,time:c,assignees:[l]})}),r(i,async d=>{if(d=(d||"").trim(),!d||te)return;let l=z.filter(c=>!c.error).map(c=>({role:c.role,text:c.text}));z.push({role:"user",text:d}),te=!0,o(i);try{let c=await s.askAssistant(d,l);z.push({role:"assistant",text:c})}catch(c){z.push({role:"assistant",text:Ba(c),error:!0})}te=!1,Wt(),o(i)})}});function o(i){let n=i.el.querySelector("[data-chat]");if(!n)return;n.outerHTML=Jt(),r(i,i.send);let m=i.el.querySelector(".chat");m&&m.lastElementChild?.scrollIntoView({block:"nearest",behavior:"smooth"})}function r(i,n){i.send=n;let m=i.el;m.querySelectorAll("[data-preset]").forEach(u=>u.onclick=()=>n(Qe[+u.dataset.preset].q));let d=m.querySelector("[data-chatform]"),l=d.q;l.oninput=()=>{l.style.height="auto",l.style.height=Math.min(l.scrollHeight,140)+"px"},l.onkeydown=u=>{u.key==="Enter"&&!u.shiftKey&&(u.preventDefault(),n(l.value))},d.onsubmit=u=>{u.preventDefault(),n(l.value)};let c=m.querySelector("[data-clearchat]");c&&(c.onclick=()=>{z=[],Wt(),o(i)}),m.querySelector("[data-extclaude]").onclick=()=>Gt(l.value.trim()||"Analise a agenda e me diga o que \xE9 mais importante agora.")}t.refresh=()=>{let i=document.activeElement;if(i&&t.el.contains(i)&&/INPUT|TEXTAREA|SELECT/.test(i.tagName))return;let n=t.el.scrollTop;t.set(a()),t.el.scrollTop=n}}var Zt="seed-v1",ea=[{id:"c_puravida",name:"Pura Vida",color:"#15803D",logoFile:"pura-vida.jpg"},{id:"c_jggarcia",name:"JG Garcia",color:"#16A34A",logoFile:"jg-garcia.jpg"},{id:"c_garciahortifruti",name:"Garcia Hortifruti",color:"#65A30D",logoFile:"garcia-hortifruti.jpg"},{id:"c_tobiasbbq",name:"Tobia's BBQ",color:"#DC2626",logoFile:"tobias-bbq.jpg"},{id:"c_verdeerosa",name:"Verde e Rosa Multimarcas",color:"#DB2777",logoFile:"verde-e-rosa.jpg"},{id:"c_sophiafestas",name:"Sophia Festas",color:"#0284C7",logoFile:"sophia-festas.jpg"}],Va=async e=>{let a=await(await fetch(e,{cache:"no-cache"})).blob();return new Promise((t,o)=>{let r=new FileReader;r.onload=()=>t(r.result),r.onerror=o,r.readAsDataURL(a)})},Xe=!1;async function ta(){if(!(Xe||!s.ready||s.state.settings.some(e=>e.id===Zt))){Xe=!0;try{let e=ea.filter(t=>!s.company(t.id)&&!s.state.companies.some(o=>o.name.trim().toLowerCase()===t.name.toLowerCase())),a=[];for(let t of e){let o=null;try{o=await Va(`media/logos/${t.logoFile}`)}catch{}a.push({id:t.id,name:t.name,color:t.color,logo:o,instagram:"",address:"",contact:"",notes:"",shareToken:null})}a.length&&await s.upsertMany("companies",a),await s.upsert("settings",{id:Zt,done:ea.map(t=>t.id)})}finally{Xe=!1}}}var aa="seed-garcia-nov-2026-v2",za=["seed-garcia-nov-2026","seed-garcia-nov-2026-ate14h"],oa="c_garciahortifruti",Ua=["domingo","segunda","ter\xE7a","quarta","quinta","sexta","s\xE1bado"],Ka={"2026-11-09":"Marechal","2026-11-11":"Vila Valqueire","2026-11-13":"Marechal","2026-11-16":"Vila Valqueire","2026-11-18":"Marechal","2026-11-20":"Vila Valqueire","2026-11-23":"Marechal","2026-11-25":"Vila Valqueire","2026-11-27":"Marechal","2026-11-30":"Vila Valqueire"},Ga=[{date:"2026-11-20",text:"Garcia \xB7 Consci\xEAncia Negra: publica\xE7\xE3o institucional respeitosa e representativa."},{date:"2026-11-23",text:"Garcia \xB7 Black Friday (23 a 27/11): campanha principal de ofertas e chamadas di\xE1rias."},{date:"2026-11-28",text:"Garcia \xB7 Esquenta de Natal e ver\xE3o (28 a 30/11): frutas da esta\xE7\xE3o, receitas, saladas e planejamento das compras."}];function Wa(e="2026-11-19",a="2026-11-30"){let t=[];for(let o=new Date(e+"T12:00:00");o<=new Date(a+"T12:00:00");o.setDate(o.getDate()+1)){let r=`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}-${String(o.getDate()).padStart(2,"0")}`,i=o.getDay(),n={date:r,companyId:oa,assignees:["henrique"],status:"pendente",description:"",seedRoutine:2};if([1,3,5].includes(i)){let m=Ka[r]||"";t.push({...n,id:`e_garcia2_${r}_ceasa`,type:"outro",time:"07:00",duration:210,reminder:30,title:"CEASA",location:"CEASA",internalNote:"CEASA \u2014 07h \xE0s 10h30. Depois segue para a Garcia Hortifruti.",visibleToClient:!1}),t.push({...n,id:`e_garcia2_${r}_gravacao`,type:"captacao",time:"10:30",duration:210,reminder:60,title:`Grava\xE7\xE3o com o Gelado \u2014 ${m||"Garcia"}`,location:m?`Garcia Hortifruti \u2014 ${m}`:"Garcia Hortifruti",internalNote:"Sa\xEDda do CEASA por volta das 10h30. Personagem: Gelado (filmar para Reels, feed e stories). Ajustar conforme abastecimento, pre\xE7os e necessidades da unidade.",visibleToClient:!0})}else if(i===0)t.push({...n,id:`e_garcia2_${r}_plan`,type:"outro",time:"07:00",duration:420,reminder:30,title:"Planejamento da semana",location:"",internalNote:"Planejamento \u2014 07h \xE0s 14h.",visibleToClient:!1});else{let m=i===6;t.push({...n,id:`e_garcia2_${r}_ceasa`,type:"outro",time:"07:00",duration:m?300:420,reminder:30,title:`Somente CEASA (${Ua[i]})`,location:"CEASA",internalNote:`Somente CEASA \u2014 07h \xE0s ${m?"12h":"14h"}.`,visibleToClient:!1})}}return t}var Ze=!1;async function sa(){if(!(Ze||!s.ready||s.state.settings.some(e=>e.id===aa))&&s.company(oa)){Ze=!0;try{let e=s.state.events.filter(o=>o.seedRoutine===!0||/^e_garcia_\d/.test(o.id)).map(o=>o.id);e.length&&await s.removeMany("events",e,{silent:!0});let a=Wa().filter(o=>!s.event(o.id));a.length&&await s.upsertMany("events",a);let t=Ga.filter(o=>!s.state.notes.some(r=>r.date===o.date&&r.text===o.text)).map(o=>({id:ge("n_"),date:o.date,text:o.text,author:"henrique"}));t.length&&await s.upsertMany("notes",t);for(let o of[aa,...za])await s.upsert("settings",{id:o,done:[]})}finally{Ze=!1}}}var ae={feed:"Feed",carrossel:"Carrossel",reels:"Reels",story:"Story",captacao:"Capta\xE7\xE3o",reuniao:"Reuni\xE3o",producao:"Edi\xE7\xE3o",outro:"Tarefa"},Ya=["feed","carrossel","reels","story"],Ae=e=>Ya.includes(e),na={feed:"publicar o feed",carrossel:"publicar o carrossel",reels:"postar o Reels",story:"postar o story",captacao:"a capta\xE7\xE3o",reuniao:"a reuni\xE3o",producao:"a edi\xE7\xE3o",outro:"a tarefa"},J=e=>e?e.replace(/^0/,"").replace(":00","h").replace(":","h"):"",Ja=e=>{let[a,t]=String(e).split(":").map(Number);return a*60+t},Ee=e=>Math.round(Date.UTC(+e.slice(0,4),+e.slice(5,7)-1,+e.slice(8,10))/864e5),Te=(e,a)=>new Date(Date.UTC(+e.slice(0,4),+e.slice(5,7)-1,+e.slice(8,10)+a)).toISOString().slice(0,10);function et(e){let a=Number.isFinite(e.reminder)?e.reminder:30,t;return Ae(e.type)?t=[120,30,0,-30]:e.type==="captacao"?t=[1440,120,45,-30]:e.type==="reuniao"?t=[1440,60,15]:t=[30,0],a>=0&&!t.includes(a)&&t.push(a),a<0&&(t=t.filter(o=>o<0)),[...new Set(t)].sort((o,r)=>r-o)}function ia(e,a,t=4){let o=Ee(a.date)*1440+a.minutes,r=[];return e.forEach(i=>{if(!i||!i.time||!i.date||i.status==="feito")return;let n=Ee(i.date)*1440+Ja(i.time);et(i).forEach(m=>{if(m<0&&i.status!=="pendente")return;let d=n-m;d<=o&&d>o-t&&r.push({ev:i,offset:m})})}),r}var Qa=(e,a)=>{let t=Ee(e)-Ee(a.date);return t===0?"hoje":t===1?"amanh\xE3":t===-1?"ontem":`${["domingo","segunda","ter\xE7a","quarta","quinta","sexta","s\xE1bado"][new Date(Date.UTC(+e.slice(0,4),+e.slice(5,7)-1,+e.slice(8,10))).getUTCDay()]}, ${e.slice(8,10)}/${e.slice(5,7)}`},Xa=e=>{if(e>=60){let a=Math.floor(e/60),t=e%60;return t?`${a}h${String(t).padStart(2,"0")}`:`${a}h`}return`${e} min`};function je(e,a,t=""){let o=`${ae[e.type]||"Tarefa"}${t?" \xB7 "+t:""}`,r=e.title?`\u201C${e.title}\u201D`:"",i=J(e.time),n=e.location?` \xB7 ${e.location}`:"";return a>=1440?{title:`Amanh\xE3: ${o} \xE0s ${i}`,body:e.type==="captacao"?`Hoje: carregue baterias, esvazie os cart\xF5es e confirme com o cliente.${n}`:`${r}${n}`.trim()||"Confirme o hor\xE1rio com o cliente."}:a>0?{title:`Daqui a ${Xa(a)}: ${o}`,body:`${i} \u2014 ${na[e.type]||"a tarefa"}${r?" "+r:""}${n}`}:a===0?{title:`Agora: ${o}`,body:`Est\xE1 na hora de ${na[e.type]||"fazer a tarefa"}${r?" "+r:""}.`}:{title:Ae(e.type)?`J\xE1 postou? ${o}`:`J\xE1 fez? ${o}`,body:`Era \xE0s ${i}${r?" \u2014 "+r:""}. Toque para marcar como feito.`}}function tt(e,a,{actor:t="Algu\xE9m",company:o="",recipient:r=null,now:i}={}){let m=`${ae[(a||e).type]||"Tarefa"}${o?" \xB7 "+o:""}`,d=$=>`${Qa($.date,i)}${$.time?", "+J($.time):""}`,l=$=>r&&($.assignees||[]).includes(r);if(!e&&a)return{title:l(a)?`${t} marcou para voc\xEA`:`${t} adicionou na agenda`,body:`${m} \u2014 ${d(a)}${a.title?" \xB7 "+a.title:""}`};if(e&&!a)return{title:`${t} removeu da agenda`,body:`${m} \u2014 ${d(e)}`};if(e.status!=="feito"&&a.status==="feito")return{title:`${t} concluiu \u2713`,body:`${m} \u2014 ${d(a)}`};let c=l(e),u=l(a);return!c&&u?{title:`${t} passou para voc\xEA`,body:`${m} \u2014 ${d(a)}${a.title?" \xB7 "+a.title:""}`}:c&&!u?{title:`${t} assumiu uma tarefa sua`,body:`${m} \u2014 ${d(a)}`}:e.date!==a.date||e.time!==a.time?{title:`${t} mudou o hor\xE1rio`,body:`${m}: ${d(e)} \u2192 ${d(a)}`}:null}function ra(e,a,t,o){if(!t.length)return null;let r=[...t].sort((c,u)=>(c.time||"99").localeCompare(u.time||"99")),i=r.find(c=>c.time)||r[0],n=r.filter(c=>Ae(c.type)).length,m=r.filter(c=>c.type==="captacao"||c.type==="reuniao"),d=c=>`${J(c.time)} ${ae[c.type]}${o(c)?" \xB7 "+o(c):""}`,l=[`${r.length} tarefa${r.length>1?"s":""} (${n} post${n===1?"":"s"})`,`primeira: ${d(i)}`];return m.length&&l.push(`sai para ${m.map(c=>`${o(c)||ae[c.type]} \xE0s ${J(c.time)}`).join(" e ")}`),e==="morning"?{title:`Bom dia, ${a}! Seu dia hoje`,body:l.join(" \xB7 ")}:{title:`${a}, amanh\xE3 voc\xEA tem ${r.length} tarefa${r.length>1?"s":""}`,body:l.slice(1).join(" \xB7 ")}}var da=e=>s.member(e)?.name||"Algu\xE9m",B=e=>s.company(e)?.name||"",ma=()=>{let e=new Date;return{date:w(),minutes:e.getHours()*60+e.getMinutes()}},ca=(e,a)=>Date.parse(`${e}T${a}:00-03:00`),at=()=>s.mode==="cloud"&&!!L()&&!!s.me;function pa(e,a,t,o="./"){!a||!e.length||Y("/notify",{to:e,title:a.title,body:a.body,tag:t,url:o}).catch(r=>console.warn("aviso ao parceiro",r.message))}function ua(e,a){if(!at())return;let t=a||e;s.team.map(r=>r.id).filter(r=>r!==s.me).forEach(r=>{let i=tt(e,a,{actor:da(s.me),company:B(t.companyId),recipient:r,now:ma()});pa([r],i,`ev-${t.id}`,`./#/e/${t.id}`)}),oe()}function fa(e){if(!at())return;let a=s.team.map(r=>r.id).filter(r=>r!==s.me),t=da(s.me),o=null;if(e.kind==="deleted"&&e.events?.length){let r=e.events[0];o=e.events.length===1?tt(r,null,{actor:t,company:B(r.companyId),now:ma()}):{title:`${t} removeu ${e.events.length} itens da agenda`,body:`${B(r.companyId)?B(r.companyId)+" \xB7 ":""}a partir de ${r.date.slice(8,10)}/${r.date.slice(5,7)}`}}else e.kind==="series"?o={title:`${t} adicionou ${e.count} itens repetidos`,body:`${e.label||""}${B(e.sample?.companyId)?" \xB7 "+B(e.sample.companyId):""}`}:e.kind==="series-edit"?o={title:`${t} alterou ${e.count} itens repetidos`,body:`${e.label||""}${B(e.sample?.companyId)?" \xB7 "+B(e.sample.companyId):""}`}:e.kind==="import"&&(o={title:`${t} importou a agenda`,body:`${e.count||0} itens atualizados.`});pa(a,o,`act-${e.id||Date.now()}`),oe()}function Za(e=Date.now()){let a=[],t=_(w(),-1),o=_(w(),4),r=s.eventsBetween(t,o).filter(n=>n.time&&n.status!=="feito"),i=(n,m)=>s.eventsOn(m,{person:n}).filter(d=>d.status!=="feito").length;r.forEach(n=>{let m=ca(n.date,n.time);et(n).forEach(d=>{if(d<0&&n.status!=="pendente")return;let l=m-d*6e4;if(l<e-10*6e4||l>e+4*864e5)return;let c=je(n,d,B(n.companyId));(n.assignees?.length?n.assignees:s.team.map($=>$.id)).forEach($=>a.push({id:`r_${n.id}_${d}_${n.date}${n.time.replace(":","")}_${$}`,at:l,member:$,title:c.title,body:c.body,tag:`rem-${n.id}`,url:`./#/e/${n.id}`,kind:"reminders",badge:i($,n.date)}))})});for(let n=0;n<4;n++){let m=_(w(),n);s.team.forEach(d=>{[["morning",m,"08:00"],["evening",_(m,1),"20:00"]].forEach(([l,c,u])=>{let $=ca(m,u);if($<e-10*6e4)return;let x=s.eventsOn(c,{person:d.id}).filter(g=>g.status!=="feito"),D=ra(l,d.name,x,g=>B(g.companyId));D&&a.push({id:`d_${l}_${c}_${d.id}`,at:$,member:d.id,title:D.title,body:D.body,tag:`daily-${l}`,url:"./",kind:"daily",badge:i(d.id,c)})})})}return a.sort((n,m)=>n.at-m.at)}var la="",oe=vt(async()=>{if(!at())return;let e=Za(),a=JSON.stringify(e.map(t=>[t.id,t.at,t.title,t.body]));if(a!==la)try{await Y("/schedule",{items:e}),la=a}catch(t){console.warn("lista de lembretes",t.message)}},3e3);var ga=["domingo","segunda","ter\xE7a","quarta","quinta","sexta","s\xE1bado"],ha=e=>ga[new Date(Date.UTC(+e.slice(0,4),+e.slice(5,7)-1,+e.slice(8,10))).getUTCDay()],eo={pendente:"a fazer",pronto:"pronto/agendado",feito:"feito"};function ba({events:e,companies:a,routine:t,notes:o,team:r,me:i,now:n}){let m=new Map(a.map(g=>[g.id,g.name])),d=g=>r.find(P=>P.id===g)?.name||g,l=Te(n.date,-7),c=Te(n.date,30),u=e.filter(g=>g.date>=l&&g.date<=c).sort((g,P)=>(g.date+(g.time||"")).localeCompare(P.date+(P.time||""))),$=[];$.push(`Agora: ${ha(n.date)}, ${n.date.split("-").reverse().join("/")}, ${J(`${String(Math.floor(n.minutes/60)).padStart(2,"0")}:${String(n.minutes%60).padStart(2,"0")}`)} (hor\xE1rio de Bras\xEDlia).`),$.push(`Quem pergunta: ${d(i)}. Equipe: ${r.map(g=>g.name).join(" e ")}.`),t&&$.push(`Rotina combinada: expediente ${t.workStart}\u2013${t.workEnd}, almo\xE7o ${t.lunchStart}\u2013${t.lunchEnd}, folga: ${(t.daysOff||[]).map(g=>ga[g]).join(", ")||"nenhuma"}, deslocamento m\xEDnimo ${t.travelMin} min, m\xE1ximo ${t.maxTasks} tarefas por pessoa/dia.`),$.push(`Empresas clientes: ${a.map(g=>g.name+(g.instagram?` (@${g.instagram})`:"")+(g.address?` \u2014 endere\xE7o: ${g.address}`:"")+(g.notes?` \u2014 observa\xE7\xF5es: ${g.notes}`:"")).join("; ")||"nenhuma"}.`),$.push("",`Agenda (de ${l.split("-").reverse().join("/")} a ${c.split("-").reverse().join("/")}):`);let x="";u.forEach(g=>{g.date!==x&&($.push(`
${ha(g.date)} ${g.date.split("-").reverse().join("/")}:`),x=g.date);let P=g.duration?` (${g.duration} min)`:"",y=(g.assignees||[]).map(d).join(" e ")||"sem respons\xE1vel";$.push(`- ${g.time?J(g.time):"sem hor\xE1rio"}${P} \xB7 ${ae[g.type]||g.type} \xB7 ${m.get(g.companyId)||"?"} \xB7 "${g.title||""}" \xB7 ${y} \xB7 ${eo[g.status]||g.status}${g.location?" \xB7 local: "+g.location:""}${g.description?" \xB7 legenda: "+g.description.slice(0,160):""}${g.internalNote?" \xB7 nota interna: "+g.internalNote.slice(0,160):""}`)}),u.length||$.push("(nenhum compromisso)");let D=(o||[]).filter(g=>g.date>=Te(n.date,-2)).slice(-10);return D.length&&$.push("","Bilhetes recentes da dupla:",...D.map(g=>`- ${g.date.split("-").reverse().join("/")} ${d(g.author)}: ${g.text}`)),$.join(`
`)}var O=document.getElementById("app");window.__calStarted=!0;var Q=null;function to(){O.innerHTML=`
    <main id="view" class="view"></main>
    <nav class="tabbar" aria-label="Navega\xE7\xE3o">
      ${Ce("hoje","today","Hoje")}
      ${Ce("mes","calendar","Calend\xE1rio")}
      <button class="tabbar__fab" data-action="new-event" aria-label="Novo evento">${p("plus",28)}</button>
      ${Ce("empresas","building","Empresas")}
      ${Ce("ajustes","settings","Ajustes")}
    </nav>`}var Ce=(e,a,t)=>`<button class="tabbar__btn" data-action="tab" data-tab="${e}">${p(a,24)}<span>${t}</span></button>`;function C(){let e=document.getElementById("view");if(!e)return;let a=window.scrollY,t=e.querySelector('[data-form="note"] input'),o=t?t.value:"",r=t&&document.activeElement===t,i=h.tab==="mes"?Rt():h.tab==="empresas"?Mt():h.tab==="ajustes"?Kt():Lt();e.innerHTML=i,document.querySelectorAll(".tabbar__btn").forEach(m=>m.classList.toggle("is-on",m.dataset.tab===h.tab)),window.scrollTo(0,a);let n=e.querySelector('[data-form="note"] input');n&&o&&(n.value=o),n&&r&&n.focus({preventScroll:!0}),so()}function ao(){C(),He().forEach(e=>e.refresh&&e.refresh())}function pe(e){h.tab=e,Ie(),C(),window.scrollTo(0,0)}var oo={tab:e=>pe(e.dataset.tab),"set-person":e=>{h.person=e.dataset.p,Ie(),C()},"set-date":e=>{h.date=e.dataset.k,C()},"go-today":()=>{h.date=w(),C()},week:e=>{h.date=_(h.date,Number(e.dataset.n)),C()},month:e=>{h.month=Oe(h.month,Number(e.dataset.n)),h.monthSel=h.month===ie(w())?w():`${h.month}-01`,C()},"month-today":()=>{h.month=ie(w()),h.monthSel=w(),C()},"month-select":e=>{h.monthSel=e.dataset.k,ie(e.dataset.k)!==h.month&&(h.month=ie(e.dataset.k)),C()},"month-company":e=>{h.monthCompany=e.dataset.id||null,C()},"open-day":e=>{h.date=e.dataset.k,pe("hoje")},"toggle-tips":()=>{h.showAllTips=!h.showAllTips,C()},"open-event":e=>$e(e.dataset.id),assistant:()=>Xt(),"apply-fix":async e=>{let a=s.event(e.dataset.id);if(!a)return;let t;try{t=JSON.parse(e.dataset.patch)}catch{return}let o={};typeof t.time=="string"&&/^\d{2}:\d{2}$/.test(t.time)&&(o.time=t.time),Array.isArray(t.assignees)&&(o.assignees=t.assignees.filter(n=>s.member(n)));let{confirmMove:r}=await import("./c-FJTSIK4O.js");if(!await r(a,o))return;let i={...a};await s.upsert("events",{...a,...o}),v("Pronto, ajustado",{action:"Desfazer",onAction:()=>s.upsert("events",i)})},"toggle-done":async e=>{let a=s.event(e.dataset.id);if(!a)return;let t=a.status==="feito"?"pendente":"feito";await s.upsert("events",{...a,status:t}),t==="feito"&&v(`${T[a.type].label} conclu\xEDdo`,{action:"Desfazer",onAction:()=>s.upsert("events",{...s.event(a.id),status:a.status})})},"new-event":e=>{if(!s.state.companies.length)return v("Cadastre uma empresa primeiro"),ze(null,()=>Fe({}));Fe({date:e.dataset.date||null})},"open-company":e=>qt(e.dataset.id),"new-company":()=>ze(),"del-note":async e=>{let a=s.state.notes.find(t=>t.id===e.dataset.id);await s.remove("notes",e.dataset.id),a&&v("Bilhete apagado",{action:"Desfazer",onAction:()=>s.upsert("notes",a)})},"set-me":e=>{s.setMe(e.dataset.p),v(`Ol\xE1, ${s.member(e.dataset.p).name}!`)},"clear-demo":async()=>{await le({title:"Apagar os dados de exemplo?",text:"O calend\xE1rio ficar\xE1 vazio para voc\xEAs cadastrarem as empresas e eventos reais.",ok:"Apagar exemplos",danger:!0})&&(await s.clearDemo(),v("Pronto! Agora cadastre suas empresas."))},"clear-all":()=>R.clearAll(),ics:e=>R.ics(e),"notify-enable":()=>R.notifyEnable(),"notify-test":()=>R.notifyTest(),"onboarding-again":()=>R.onboardingAgain(),export:()=>R.export(),logout:async()=>{await le({title:"Sair da conta?",ok:"Sair"})&&(await Q.signOut(),location.reload())}};document.addEventListener("click",e=>{let a=e.target.closest("[data-action]");if(!a||document.body.classList.contains("is-client"))return;let t=oo[a.dataset.action];t&&(e.preventDefault(),e.stopPropagation(),t(a))});document.addEventListener("change",e=>{e.target.matches('[data-action-change="import"]')&&R.import(e.target),e.target.closest("[data-notify-form]")&&R.notifyPrefs(e.target.closest("[data-notify-form]")),e.target.closest("[data-routine-form]")&&R.routine(e.target.closest("[data-routine-form]"))});document.addEventListener("submit",async e=>{let a=e.target.closest('[data-form="note"]');if(!a)return;e.preventDefault();let t=a.text.value.trim();if(t){if(!s.me){v("Escolha quem voc\xEA \xE9 em Ajustes");return}await s.upsert("notes",{id:ge("n_"),date:h.date,text:t,author:s.me}),v("Bilhete adicionado")}});function so(){document.querySelectorAll("[data-swipe]").forEach(e=>{let a=null,t=null;e.addEventListener("touchstart",o=>{a=o.touches[0].clientX,t=o.touches[0].clientY},{passive:!0}),e.addEventListener("touchend",o=>{if(a==null)return;let r=o.changedTouches[0].clientX-a,i=o.changedTouches[0].clientY-t;if(a=null,Math.abs(r)<50||Math.abs(r)<Math.abs(i)*1.5)return;let n=r<0?1:-1;e.dataset.swipe==="week"?h.date=_(h.date,7*n):(h.month=Oe(h.month,n),h.monthSel=`${h.month}-01`),C()})})}var $a=new Set;function va(){if(!s.me)return;let e=new Date,a={date:w(),minutes:e.getHours()*60+e.getMinutes()},t=s.eventsBetween(_(a.date,-1),_(a.date,1),{person:s.me}),o=s.mode==="cloud"&&!!localStorage.getItem("pauta.device");ia(t,a,2).forEach(({ev:r,offset:i})=>{let n=`${r.id}@${i}@${r.date}${r.time}`;if($a.has(n))return;$a.add(n);let m=je(r,i,s.company(r.companyId)?.name||"");v(`${m.title}`,{ms:7e3,action:"Ver",onAction:()=>$e(r.id)}),!o&&V()==="granted"&&navigator.serviceWorker&&navigator.serviceWorker.ready.then(d=>d.showNotification(m.title,{body:m.body,tag:`rem-${r.id}`,icon:"icons/icon-192.png",badge:"icons/icon-192.png",data:{url:`./#/e/${r.id}`}})).catch(()=>{})}),Ke(s.eventsOn(a.date,{person:s.me}).filter(r=>r.status!=="feito").length)}function it(e=location.hash){let a=/^#\/(e|d)\/([\w-]+)/.exec(e||"");return a?(history.replaceState(null,"",location.pathname+location.search),a[1]==="e"&&s.event(a[2])?(h.date=s.event(a[2]).date,pe("hoje"),$e(a[2])):a[1]==="d"&&/^\d{4}-\d{2}-\d{2}$/.test(a[2])&&(h.date=a[2],pe("hoje")),!0):!1}var ya={"auth/invalid-credential":"E-mail ou senha incorretos. Confira a senha (toque no olho para ver o que digitou).","auth/wrong-password":"Senha incorreta.","auth/user-not-found":"Este e-mail n\xE3o est\xE1 cadastrado no Firebase (Authentication \u2192 Usu\xE1rios).","auth/invalid-email":"E-mail inv\xE1lido.","auth/too-many-requests":'Muitas tentativas seguidas. Espere alguns minutos ou use "Esqueci minha senha".',"auth/network-request-failed":"Sem conex\xE3o com a internet. Verifique o Wi-Fi/4G e tente de novo.","auth/user-disabled":"Este usu\xE1rio foi desativado no Firebase.","auth/operation-not-allowed":"O login por e-mail/senha n\xE3o est\xE1 ativado no Firebase.","auth/api-key-not-valid":"Configura\xE7\xE3o do Firebase inv\xE1lida (apiKey)."},wa="",nt="";function De(e=""){let a=e||nt;O.innerHTML=`
  <div class="login">
    <img src="icons/icon-192.png" alt="" width="84" height="84">
    <h1>${f(A.appName)}</h1>
    <p>Agenda de conte\xFAdo \xB7 ${f(A.agencyName)}</p>
    <form class="form" data-login novalidate>
      <div class="fgroup"><label class="flabel" for="l-email">E-mail</label><input id="l-email" class="input" type="email" name="email" value="${f(wa)}" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" inputmode="email"></div>
      <div class="fgroup"><label class="flabel" for="l-pass">Senha</label>
        <div class="input-eye"><input id="l-pass" class="input" type="password" name="pass" autocomplete="current-password" autocapitalize="none" autocorrect="off" spellcheck="false">
        <button type="button" class="iconbtn iconbtn--sm" data-eye aria-label="Mostrar senha">${p("eye",18)}</button></div>
      </div>
      ${a?`<p class="login__err">${f(a)}</p>`:""}
      <button class="btn btn--primary btn--block" type="submit" data-go>Entrar</button>
      <button class="btn-text btn-text--sm" type="button" data-reset>Esqueci minha senha</button>
    </form>
  </div>`;let t=O.querySelector("[data-login]");O.querySelector("[data-eye]").onclick=()=>{t.pass.type=t.pass.type==="password"?"text":"password"},t.onsubmit=async o=>{o.preventDefault();let r=t.email.value.trim().toLowerCase(),i=t.pass.value;if(wa=r,nt="",!r||!i)return De("Preencha o e-mail e a senha.");let n=t.querySelector("[data-go]");n.disabled=!0,n.textContent="Entrando\u2026";try{await Promise.race([Q.signIn(r,i),new Promise((m,d)=>setTimeout(()=>d({code:"timeout"}),2e4))]),n.textContent="Abrindo\u2026"}catch(m){let d=m&&m.code;De(d==="timeout"?"O servidor demorou para responder. Verifique a internet e tente de novo.":ya[d]||`N\xE3o foi poss\xEDvel entrar (${d||m?.message||"erro desconhecido"}).`)}},O.querySelector("[data-reset]").onclick=async()=>{let o=t.email.value.trim().toLowerCase();if(!o)return v("Digite seu e-mail primeiro");try{await Q.resetPassword(o),v("Enviamos um e-mail para criar uma nova senha (veja tamb\xE9m o spam)",{ms:6e3})}catch(r){v(ya[r?.code]||"N\xE3o foi poss\xEDvel enviar o e-mail")}}}function _a(e){document.querySelector("[data-login]")||document.getElementById("view")||(O.innerHTML=`<div class="splash">
    <img src="icons/icon-192.png" alt="" width="72" height="72">
    <h2>N\xE3o consegui conectar</h2>
    <p>Verifique a internet e tente de novo.</p>
    <button class="btn btn--primary" data-retry>Tentar de novo</button>
    <small class="muted">Detalhe: ${f(String(e&&(e.code||e.message)||e))}</small>
  </div>`,O.querySelector("[data-retry]").onclick=()=>location.reload())}function ot(e="Carregando\u2026"){O.innerHTML=`<div class="splash"><img src="icons/icon-192.png" alt="" width="72" height="72"><p>${f(e)}</p></div>`}function ka(){to(),C(),s.on(ao),s.onError=e=>{let a=e&&/quota/i.test(String(e.name||e.message)),t=e&&/permission/i.test(String(e.code||e.message));v(a?"Mem\xF3ria do aparelho cheia: use logos menores ou ative a nuvem":t?"Sem permiss\xE3o na nuvem: confira as regras do Firebase":"N\xE3o foi poss\xEDvel salvar. Verifique a conex\xE3o.",{ms:5e3})},Sa(),s.on(Sa),s.on(()=>Ke(s.me?s.eventsOn(w(),{person:s.me}).filter(e=>e.status!=="feito").length:0)),setInterval(()=>{let e=document.activeElement,a=e&&/INPUT|TEXTAREA|SELECT/.test(e.tagName);h.tab==="hoje"&&!He().length&&!a&&C(),va()},6e4),va(),document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&(h.date<w()&&h.tab==="hoje"&&(h.date=w()),C())}),s.mode==="cloud"&&L()&&(s.hooks.eventChange=ua,s.hooks.activity=fa,s.hooks.ask=async(e,a)=>{let t=new Date,o=ba({events:s.state.events,companies:s.state.companies,routine:N(),notes:s.state.notes,team:s.team,me:s.me,now:{date:w(),minutes:t.getHours()*60+t.getMinutes()}});return(await Y("/ask",{question:e,history:a,context:o})).answer},s.on(oe),oe(),setInterval(oe,15*6e4)),ta().then(()=>setTimeout(()=>sa().catch(e=>console.warn("rotina",e)),1500)).catch(e=>console.warn("pr\xE9-cadastro",e)),setTimeout(zt,600),s.mode==="cloud"&&V()==="granted"&&ke().catch(()=>{}),setTimeout(()=>it(),300)}var st=null;function Sa(){if(!s.me)return;let e=Nt(s.me,14),a=o=>o.date+":"+o.ids.slice().sort().join("|"),t=new Set(e.map(a));if(st){let o=e.find(r=>!st.has(a(r))&&r.ids.some(i=>s.event(i)?.updatedBy&&s.event(i).updatedBy!==s.me));o&&v(`Aten\xE7\xE3o: ${o.title} (${o.date.slice(8)}/${o.date.slice(5,7)})`,{action:"Ver",onAction:()=>{h.date=o.date,h.person="all",pe("hoje")},ms:7e3})}st=t}async function no(){let e=location.hash||"",a=A.firebase;if(e.startsWith("#/c/")||e.startsWith("#/v/")){ot("Carregando cronograma\u2026");let i=!!(localStorage.getItem("pauta.me")||localStorage.getItem("cal.team"));try{if(e.startsWith("#/v/")){let d=await yt(e.slice(4));return Ve(O,Pe(d),{canGoBack:i})}if(!a)return ve(O,"Este link precisa da sincroniza\xE7\xE3o na nuvem ativada.");let{fetchPublic:n}=await import("./c-43VYY7Q5.js"),m=await n(a,e.slice(4));return m?Ve(O,Pe(m),{canGoBack:i}):ve(O,"Este link n\xE3o existe mais. Pe\xE7a um novo link para a equipe.")}catch(n){return console.error(n),ve(O,"N\xE3o foi poss\xEDvel abrir o cronograma. Verifique a conex\xE3o e tente novamente.")}}if(!a)return await kt(),ka();ot("Conectando \xE0 nuvem\u2026");let t=(i,n)=>Promise.race([i,new Promise((m,d)=>setTimeout(()=>d(new Error("tempo esgotado")),n))]);try{let{connect:i}=await import("./c-43VYY7Q5.js");Q=await t(i(a),15e3)}catch(i){return console.error(i),_a(i)}let o=!1,r=!1;setTimeout(()=>{o||_a(new Error("o login n\xE3o respondeu"))},25e3),Q.onUser(async i=>{if(o=!0,!i)return r?location.reload():De();if(r)return;if(!A.team.some(m=>m.email&&m.email.toLowerCase()===(i.email||"").toLowerCase()))return nt=`O e-mail ${i.email} n\xE3o faz parte da equipe deste app.`,await Q.signOut(),De();r=!0;try{localStorage.setItem("cal.team","1")}catch{}ot("Entrando\u2026");try{await Promise.race([St(Q.backend,i),new Promise(m=>setTimeout(m,12e3))])}catch(m){console.error(m),setTimeout(()=>v("N\xE3o consegui carregar os dados agora. Verifique a internet.",{ms:6e3}),800)}ka()})}navigator.serviceWorker?.addEventListener("message",e=>{if(e.data?.type==="open"&&e.data.url){let a=e.data.url.split("#")[1];a&&it("#"+a)}});window.addEventListener("hashchange",()=>{if(/^#\/(e|d)\//.test(location.hash))return it();/^#\/(c|v)\//.test(location.hash)&&location.reload()});"serviceWorker"in navigator&&location.protocol!=="file:"&&navigator.serviceWorker.register("sw.js").catch(()=>{});no();
