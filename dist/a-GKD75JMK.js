import{A as He,C as Ot,D as Nt,E as ze,a as _t,b as o,c as xt,d as Et,e as h,f as Pe,g as M,h as At,i as Ie,j as Le,k as Re,l as Tt,m as Be,n as jt,o as v,p as le,q as Dt,r as N,s as W,t as q,u as Ct,v as ee,w as Mt,x as de,y as qt,z as be}from"./c-EJYUXBR7.js";import{f as Ne}from"./c-4OPZHBQG.js";import{a as Fe,b as $e}from"./c-QNJTKFWY.js";import{A as f,C as yt,E as wt,G as Z,H as p,a as lt,b as V,c as w,d as _,e as dt,f as ie,g as qe,h as mt,i as j,j as ue,k as F,l as S,m as pt,n as X,o as ut,p as fe,q as re,r as ft,s as ht,t as gt,u as he,v as K,w as bt,x as $t,y as vt}from"./c-SIJUFJQD.js";import{a as T,b as kt,c as ce,d as ge,l as Oe,m as St}from"./c-3GA6RSWB.js";import{a as A}from"./c-W6W2IM5K.js";import"./c-VHNSBD2M.js";var Ea=(e,t)=>e&&t&&e[0]<t[1]&&t[0]<e[1],G=e=>o.member(e)?.name||e,ve=e=>["shoot","meeting"].includes(T[e.type]?.kind);function ye(e,t){let a=[],s=N(),l=o.eventsOn(t,{person:e}).filter(n=>n.time&&n.status!=="feito");for(let n=0;n<l.length;n++)for(let m=n+1;m<l.length;m++){let d=l[n],r=l[m];if(!Ea(W(d),W(r)))continue;let c=ve(d)?d:ve(r)?r:null,u=c===d?r:d,$,x;c&&ce(u.type)?($=`${G(e)}: post durante ${T[c.type].label.toLowerCase()}`,x=`\u201C${q(u)}\u201D \xE0s ${S(u.time)} cai no meio de \u201C${q(c)}\u201D (${S(c.time)}\u2013${S(ue(W(c)[1]))}).`):c&&ve(u)?($=`${G(e)} em dois lugares ao mesmo tempo`,x=`\u201C${q(d)}\u201D (${S(d.time)}) e \u201C${q(r)}\u201D (${S(r.time)}) se sobrep\xF5em.`):($=`${G(e)}: duas tarefas no mesmo hor\xE1rio`,x=`\u201C${q(d)}\u201D (${S(d.time)}) e \u201C${q(r)}\u201D (${S(r.time)}).`),a.push({level:"warn",kind:"conflict",icon:"alert",ids:[d.id,r.id],title:$,text:x,fixes:Mt(e,d,r)})}let i=l.filter(ve);for(let n=0;n<i.length-1;n++){let m=i[n],d=i[n+1],r=j(d.time)-W(m)[1];(m.location||m.companyId)!==(d.location||d.companyId)&&r>=0&&r<s.travelMin&&a.push({level:"warn",kind:"conflict",icon:"route",ids:[m.id,d.id],title:`${G(e)}: pouco tempo de deslocamento`,text:`S\xF3 ${r} min entre \u201C${q(m)}\u201D e \u201C${q(d)}\u201D, em lugares diferentes (combinado: ${s.travelMin} min).`,fixes:[{label:`Mover para ${S(ue(W(m)[1]+s.travelMin))}`,eventId:d.id,patch:{time:ue(Math.ceil((W(m)[1]+s.travelMin)/15)*15)}}]})}return a}function Pt(e,t="all"){let a=[],s=t==="all"?o.team.map(r=>r.id):[t];s.forEach(r=>a.push(...ye(r,e)));let l=N(),i=o.eventsOn(e,{person:t}),n={};if(i.filter(r=>r.time&&["feed","reels","carrossel"].includes(r.type)).forEach(r=>(n[r.companyId]||=[]).push(r)),Object.values(n).forEach(r=>{for(let c=0;c<r.length-1;c++){let u=j(r[c+1].time)-j(r[c].time);u<180&&a.push({level:"info",icon:"clock",ids:[r[c].id,r[c+1].id],title:`${o.company(r[c].companyId)?.name||"Empresa"}: posts muito pr\xF3ximos`,text:`Dois posts de feed/Reels com s\xF3 ${K(u)} de diferen\xE7a. Espacem ao menos 3 h para um n\xE3o \u201Croubar\u201D o alcance do outro.`})}}),e===w()){let r=i.filter(c=>c.time&&c.status==="pendente"&&j(c.time)+15<F());r.length&&a.unshift({level:"warn",kind:"late",icon:"flag",ids:r.map(c=>c.id),title:r.length===1?"1 tarefa atrasada":`${r.length} tarefas atrasadas`,text:r.map(c=>`${S(c.time)} ${q(c)}`).join(" \xB7 ")+". Marque como feito ou reagende."})}let m=i.filter(r=>!(r.assignees||[]).length);if(m.length&&t==="all"&&a.push({level:"warn",icon:"user",ids:m.map(r=>r.id),title:"Tarefa sem respons\xE1vel",text:m.map(r=>`${S(r.time)} ${q(r)}`).join(" \xB7 ")+". Definam quem vai fazer."}),t==="all"&&o.team.length===2){let[r,c]=o.team,u=o.eventsOn(e,{person:r.id}).length,$=o.eventsOn(e,{person:c.id}).length;if(Math.abs(u-$)>=4){let[x,C]=u>$?[r,c]:[c,r];a.push({level:"info",icon:"users",title:"Dia desequilibrado",text:`${x.name} tem ${Math.max(u,$)} tarefas e ${C.name} tem ${Math.min(u,$)}. Que tal passar alguns stories para o ${C.name}?`})}}s.forEach(r=>{let c=ee(r,e),u=o.eventsOn(e,{person:r}).length;!c.dayOff&&c.minutes!=null&&u&&c.longest<45&&a.push({level:"info",kind:"rest",icon:"clock",title:`${G(r)} est\xE1 sem pausa`,text:`O maior intervalo livre do dia \xE9 de ${K(c.longest)}. Programem posts com anteced\xEAncia para abrir espa\xE7o.`}),c.dayOff&&u&&a.push({level:"info",kind:"rest",icon:"clock",title:`${G(r)}: dia de folga`,text:`H\xE1 ${u} tarefa${u>1?"s":""} marcada${u>1?"s":""} na folga. Posts podem ficar programados para ningu\xE9m trabalhar.`}),u>l.maxTasks&&a.push({level:"warn",kind:"rest",icon:"alert",title:`${G(r)} sobrecarregado`,text:`${u} tarefas (limite combinado: ${l.maxTasks}).`})}),o.eventsOn(_(e,1),{person:t}).filter(r=>r.type==="captacao").forEach(r=>{let c=o.company(r.companyId);a.push({level:"prep",icon:"camera",ids:[r.id],title:`Amanh\xE3: capta\xE7\xE3o${c?" na "+c.name:""} \xE0s ${S(r.time)}`,text:"Hoje: carregue baterias, esvazie cart\xF5es de mem\xF3ria, confirme o hor\xE1rio com o cliente e defina o roteiro de tomadas."})}),!a.some(r=>r.kind==="conflict")&&i.length&&a.push({level:"ok",icon:"check",title:"Agenda sem conflitos",text:"Ningu\xE9m est\xE1 em dois lugares ao mesmo tempo."});let d=Math.abs(mt("2024-01-01",e))%Oe.length;return a.push({level:"tip",icon:"bulb",title:"Dica do dia",text:Oe[d]}),a}function It(e,t=14){let a=[],s=w();for(let l=0;l<t;l++){let i=_(s,l);ye(e,i).forEach(n=>a.push({...n,date:i}))}return a}function Lt(e="all"){let t=w(),a=F();return o.eventsOn(t,{person:e}).find(s=>s.time&&s.status!=="feito"&&j(s.time)+ge(s)>a)||null}function Rt(){return`<div class="seg" role="tablist">
    ${[{id:"all",name:"Todos"},...o.team].map(t=>`<button class="seg__btn${h.person===t.id?" is-on":""}" data-action="set-person" data-p="${t.id}">
      ${t.id==="all"?p("users",15):M(t.id,18)}<span>${f(t.name)}${o.me===t.id?"<em> (voc\xEA)</em>":""}</span></button>`).join("")}
  </div>`}function Aa(e,t=4){let a=[];return e.forEach(s=>{a.includes(s.companyId)||a.push(s.companyId)}),a.slice(0,t).map(s=>`<i style="background:${o.company(s)?.color||"#999"}"></i>`).join("")}function Bt(){let e=h.date,t=w(),a=o.eventsOn(e,{person:h.person}),s=Pt(e,h.person),l=s.filter(b=>b.level==="warn"&&b.icon!=="flag").flatMap(b=>b.ids||[]),i=o.member(o.me),n=dt(e),m=Array.from({length:7},(b,E)=>_(n,E)),d=(()=>{let b=V(m[0]),E=V(m[6]);return b.getMonth()===E.getMonth()?`${b.getDate()}\u2013${E.getDate()} de ${fe[E.getMonth()]}`:`${b.getDate()} ${fe[b.getMonth()]} \u2013 ${E.getDate()} ${fe[E.getMonth()]}`})(),r=`
  <header class="hdr">
    <div class="hdr__row">
      <div class="hdr__titles">
        <p class="hdr__eyebrow">${e===t?`${$t()}${i?", "+f(i.name):""}`:f(re(e))}</p>
        <h1>${f(gt(e))}${e===t?`<span class="hdr__date">${f(ft(e))}</span>`:""}</h1>
      </div>
      <div class="hdr__actions">
        ${e!==t?'<button class="chip chip--accent" data-action="go-today">Hoje</button>':""}
        <button class="iconbtn iconbtn--ai" data-action="assistant" aria-label="Assistente">${p("sparkle",20)}</button>
        <button class="iconbtn" data-action="tab" data-tab="ajustes" aria-label="Perfil">${i?M(i.id,34):p("user",20)}</button>
      </div>
    </div>
    ${Rt()}
    <div class="week">
      <div class="week__bar">
        <button class="iconbtn iconbtn--sm" data-action="week" data-n="-7" aria-label="Semana anterior">${p("left",18)}</button>
        <span>${f(d)}</span>
        <button class="iconbtn iconbtn--sm" data-action="week" data-n="7" aria-label="Pr\xF3xima semana">${p("right",18)}</button>
      </div>
      <div class="week__days" data-swipe="week">
        ${m.map(b=>{let E=V(b),I=o.eventsOn(b,{person:h.person}),k=I.filter(ne=>ne.status!=="feito").length;return`<button class="wday${b===e?" is-sel":""}${b===t?" is-today":""}" data-action="set-date" data-k="${b}">
            <span class="wday__l">${X[E.getDay()]}</span>
            <span class="wday__n">${E.getDate()}</span>
            <span class="wday__dots">${Aa(I,3)}${I.length?"":'<i class="none"></i>'}</span>
            ${k?`<span class="sr">${k} pendentes</span>`:""}
          </button>`}).join("")}
      </div>
    </div>
  </header>`,c={};a.forEach(b=>c[b.type]=(c[b.type]||0)+1);let u=a.filter(b=>b.status==="feito").length,$=a.length?Math.round(u/a.length*100):0,x=a.length?`<div class="summary">
        <div class="summary__progress">
          <div class="ring" style="--p:${$}"><span>${$}%</span></div>
          <div><strong>${u} de ${a.length}</strong><small>tarefas conclu\xEDdas</small></div>
        </div>
        <div class="summary__types">
          ${Object.entries(c).sort((b,E)=>E[1]-b[1]).map(([b,E])=>`<span class="tcount tbadge--${b}">${p(T[b].icon,13)}<b>${E}</b> ${T[b].label}</span>`).join("")}
        </div>
      </div>`:"",C=h.person==="all"?`<section class="block">
      <h2 class="block__title">${p("route",16)} Onde cada um vai estar</h2>
      <div class="team">${o.team.map(b=>Ta(b,e)).join("")}</div>
    </section>`:"",g="";if(e===t){let b=Lt(h.person);if(b){let E=o.company(b.companyId),I=j(b.time)-F(),k=E?.color||"#555";g=`<button class="next" style="--cc:${k};--cc-soft:${yt(k,.12)}" data-action="open-event" data-id="${b.id}">
        <div class="next__label">${p("bell",14)} ${I>0?"Pr\xF3ximo \xB7 "+bt(I):"Acontecendo agora"}</div>
        <div class="next__row">
          ${Ie(E,44)}
          <div class="next__txt">
            <strong>${S(b.time)} \xB7 ${f(T[b.type].label)} \xB7 ${f(E?.name||"")}</strong>
            <span>${f(b.title||"")}</span>
          </div>
          ${At(b.assignees,26)}
        </div>
        ${b.location?`<div class="next__loc">${p("pin",13)} ${f(b.location)}</div>`:""}
      </button>`}}let P=h.showAllTips?s:s.filter((b,E)=>b.level==="warn"||E<2),y=s.length-P.length,se=`<section class="block">
    <h2 class="block__title">${p("bulb",16)} Dicas e alertas</h2>
    <div class="tips">${P.map(ja).join("")}</div>
    ${y>0?`<button class="btn-text btn-text--sm" data-action="toggle-tips">Ver mais ${y} dica${y>1?"s":""}</button>`:h.showAllTips&&s.length>2?'<button class="btn-text btn-text--sm" data-action="toggle-tips">Mostrar menos</button>':""}
  </section>`,H;if(!a.length)H=Re("Dia livre",h.person==="all"?"Nada agendado para este dia.":`Nada agendado para ${o.member(h.person)?.name}.`,`<button class="btn btn--primary" data-action="new-event" data-date="${e}">${p("plus",18)} Adicionar</button>`);else{let b=[{k:"Manh\xE3",icon:"sun",items:a.filter(k=>k.time&&j(k.time)<720)},{k:"Tarde",items:a.filter(k=>k.time&&j(k.time)>=720&&j(k.time)<1080)},{k:"Noite",items:a.filter(k=>k.time&&j(k.time)>=1080)},{k:"Sem hor\xE1rio",items:a.filter(k=>!k.time)}],E=F(),I=e!==t;H=b.filter(k=>k.items.length).map(k=>`
      <div class="tl-group">
        <h3 class="tl-group__h">${k.k}<span>${k.items.length}</span></h3>
        ${k.items.map(ne=>{let ct="";return!I&&ne.time&&j(ne.time)>E&&(I=!0,ct=`<div class="nowline"><span>Agora \xB7 ${S(`${String(new Date().getHours()).padStart(2,"0")}:${String(new Date().getMinutes()).padStart(2,"0")}`)}</span></div>`),ct+Le(ne,{highlight:l})}).join("")}
      </div>`).join(""),!I&&e===t&&(H+=`<div class="nowline nowline--end"><span>Agora \xB7 ${S(`${String(new Date().getHours()).padStart(2,"0")}:${String(new Date().getMinutes()).padStart(2,"0")}`)} \xB7 fim da agenda</span></div>`)}let Ce=o.notesOn(e),Me=`<section class="block">
    <h2 class="block__title">${p("note",16)} Bilhetes do dia</h2>
    <div class="notes">
      ${Ce.map(b=>`<div class="note">
        <p>${f(b.text)}</p>
        <footer>${M(b.author,18)}<span>${f(o.member(b.author)?.name||"")}</span>
          <button class="note__del" data-action="del-note" data-id="${b.id}" aria-label="Apagar bilhete">${p("x",14)}</button></footer>
      </div>`).join("")}
      <form class="note-add" data-form="note">
        <input name="text" placeholder="Escreva um bilhete para a dupla\u2026" autocomplete="off" maxlength="280">
        <button class="iconbtn iconbtn--accent" aria-label="Adicionar bilhete">${p("plus",18)}</button>
      </form>
    </div>
  </section>`;return`${r}
  <div class="page">
    ${o.demo?Da():""}
    ${g}
    <button class="brief" data-action="assistant">
      <span class="brief__ic">${p("sparkle",18)}</span>
      <div><strong>Assistente</strong>${de(e,h.person).map(b=>`<p>${f(b)}</p>`).join("")}</div>
      ${p("right",18,"muted")}
    </button>
    ${C}
    <section class="block">
      <h2 class="block__title">${p("clock",16)} Agenda ${h.person==="all"?"da dupla":"de "+f(o.member(h.person)?.name||"")}</h2>
      ${x}
      ${H}
    </section>
    ${se}
    ${Me}
  </div>`}function Ta(e,t){let a=o.eventsOn(t,{person:e.id}),s=t===w()?F():-1,l=a.filter(r=>["shoot","meeting"].includes(T[r.type]?.kind)),i=a.filter(r=>ce(r.type)).length,n=a.find(r=>r.time&&r.status!=="feito"&&j(r.time)+ge(r)>s),m=ee(e.id,t),d=m.dayOff?"Folga":`${K(Math.round(m.minutes/15)*15)||"0 min"} livres`;return`<button class="team__col" data-action="set-person" data-p="${e.id}">
    <span class="team__free ${m.dayOff?"is-off":m.minutes>=240?"is-good":m.minutes>=120?"is-mid":"is-low"}">${p("clock",12)} ${d}</span>
    <div class="team__head">${M(e.id,30)}<div><strong>${f(e.name)}</strong><small>${a.length} tarefa${a.length===1?"":"s"} \xB7 ${i} post${i===1?"":"s"}</small></div></div>
    <ul class="team__where">
      ${l.length?l.map(r=>`<li>${p(T[r.type].icon,13)}<span><b>${S(r.time)}</b> ${f(o.company(r.companyId)?.name||"")}</span></li>`).join(""):`<li class="muted">${p("building",13)}<span>Trabalho interno / remoto</span></li>`}
    </ul>
    ${n?`<div class="team__next">Pr\xF3ximo: <b>${S(n.time)}</b> ${f(T[n.type].label)} \xB7 ${f(o.company(n.companyId)?.name||"")}</div>`:`<div class="team__next muted">${a.length?"Tudo conclu\xEDdo \u2713":"Livre"}</div>`}
  </button>`}function ja(e){let t=e.fixes?.length?`<div class="fixes">${e.fixes.map(a=>`<button class="fixbtn" data-action="apply-fix" data-id="${a.eventId}" data-patch="${f(JSON.stringify(a.patch))}">${p("check",13)} ${f(a.label)}</button>`).join("")}</div>`:"";return`<div class="tip tip--${e.level}"${e.ids?.length===1&&!t?` data-action="open-event" data-id="${e.ids[0]}"`:""}>
    <span class="tip__ic">${p(e.icon,16)}</span>
    <div><strong>${f(e.title)}</strong><p>${f(e.text)}</p>${t}</div>
  </div>`}function Da(){return`<div class="banner">
    ${p("sparkle",18)}
    <p><strong>Voc\xEA est\xE1 vendo dados de exemplo.</strong> Explore \xE0 vontade e, quando quiser come\xE7ar de verdade, apague os exemplos.</p>
    <button class="btn btn--soft btn--sm" data-action="clear-demo">Apagar exemplos</button>
  </div>`}function Ht(){let e=h.month,[t,a]=e.split("-").map(Number),s=new Date(t,a-1,1),l=_(lt(s),-s.getDay()),i=w(),n=Array.from({length:42},(y,se)=>_(l,se)),d=n.slice(35).some(y=>y.slice(0,7)===e)?n:n.slice(0,35),r={person:h.person,companyId:h.monthCompany},c=o.companiesSorted(),u=h.monthSel,$=o.eventsOn(u,r),x=o.eventsBetween(`${e}-01`,`${e}-31`,r),C=x.filter(y=>ce(y.type)).length,g=x.filter(y=>y.type==="captacao").length,P=x.filter(y=>y.type==="reuniao").length;return`
  <header class="hdr">
    <div class="hdr__row">
      <div class="hdr__titles">
        <p class="hdr__eyebrow">Calend\xE1rio</p>
        <h1>${f(ht(e).split(" ")[0])}<span class="hdr__date">${e.slice(0,4)}</span></h1>
      </div>
      <div class="hdr__actions">
        <button class="iconbtn" data-action="month" data-n="-1" aria-label="M\xEAs anterior">${p("left",20)}</button>
        <button class="chip" data-action="month-today">Hoje</button>
        <button class="iconbtn" data-action="month" data-n="1" aria-label="Pr\xF3ximo m\xEAs">${p("right",20)}</button>
      </div>
    </div>
    ${Rt()}
  </header>
  <div class="page">
    <div class="chips-scroll">
      <button class="chip${h.monthCompany?"":" is-on"}" data-action="month-company" data-id="">Todas as empresas</button>
      ${c.map(y=>`<button class="chip chip--co${h.monthCompany===y.id?" is-on":""}" style="--cc:${y.color}" data-action="month-company" data-id="${y.id}">${Ie(y,18,5)}${f(y.name)}</button>`).join("")}
    </div>

    <div class="mstats">
      <div><b>${C}</b><span>posts</span></div>
      <div><b>${g}</b><span>capta\xE7\xF5es</span></div>
      <div><b>${P}</b><span>reuni\xF5es</span></div>
      <div><b>${x.filter(y=>y.status==="feito").length}/${x.length}</b><span>conclu\xEDdos</span></div>
    </div>

    <div class="month" data-swipe="month">
      <div class="month__wd">${ut.map(y=>`<span>${y}</span>`).join("")}</div>
      <div class="month__grid">
        ${d.map(y=>{let se=y.slice(0,7)===e,H=o.eventsOn(y,r),Ce=H.some(Me=>Me.type==="captacao");return`<button class="mday${se?"":" is-out"}${y===i?" is-today":""}${y===u?" is-sel":""}" data-action="month-select" data-k="${y}">
            <span class="mday__n">${Number(y.slice(8))}</span>
            ${H.length?`<span class="mday__bars">${Ca(H)}</span><span class="mday__count">${Ce?p("camera",10):""}${H.length}</span>`:""}
          </button>`}).join("")}
      </div>
    </div>

    <section class="block">
      <div class="block__row">
        <h2 class="block__title">${f(he(u))}</h2>
        <button class="btn-text btn-text--sm" data-action="open-day" data-k="${u}">Abrir dia ${p("right",14)}</button>
      </div>
      ${$.length?$.map(y=>Le(y)).join(""):Re("Nada neste dia","Toque no + para agendar.",`<button class="btn btn--soft" data-action="new-event" data-date="${u}">${p("plus",16)} Novo evento</button>`)}
    </section>

    ${c.length?`<section class="block">
      <h2 class="block__title">Legenda</h2>
      <div class="legend">${c.map(y=>`<span><i style="background:${y.color}"></i>${f(y.name)}</span>`).join("")}</div>
    </section>`:""}
  </div>`}function Ca(e){let t={};return e.forEach(a=>t[a.companyId]=(t[a.companyId]||0)+1),Object.entries(t).slice(0,4).map(([a])=>`<i style="background:${o.company(a)?.color||"#999"}"></i>`).join("")}var zt="pauta.device",Ut="pauta.notifyPrefs",L=()=>{try{if(["localhost","127.0.0.1"].includes(location.hostname)&&localStorage.getItem("cal.pushServer"))return localStorage.getItem("cal.pushServer")}catch{}return(A.pushServer||"").replace(/\/+$/,"")},Ma=()=>/iPhone|iPad|iPod/.test(navigator.userAgent)||navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1,qa=()=>"serviceWorker"in navigator&&"PushManager"in window&&"Notification"in window,z=()=>"Notification"in window?Notification.permission:"unsupported",me=()=>Ma()&&!Z(),Ue=()=>{try{return{reminders:!0,partner:!0,daily:!0,...JSON.parse(localStorage.getItem(Ut)||"{}")}}catch{return{reminders:!0,partner:!0,daily:!0}}},Ft=e=>{let t="=".repeat((4-e.length%4)%4),a=atob((e+t).replace(/-/g,"+").replace(/_/g,"/"));return Uint8Array.from(a,s=>s.charCodeAt(0))},Oa=async e=>{let t=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(e));return"d_"+Array.from(new Uint8Array(t).slice(0,16),a=>a.toString(16).padStart(2,"0")).join("")};async function Y(e,t){if(!L())throw Object.assign(new Error("Servidor de avisos n\xE3o configurado."),{code:"no-server"});let a=await o.idToken();if(!a)throw Object.assign(new Error("Fa\xE7a login para usar."),{code:"no-login"});let s=await fetch(L()+e,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${a}`},body:JSON.stringify(t||{})}),l=await s.json().catch(()=>({}));if(!s.ok)throw Object.assign(new Error(l.error||`Erro ${s.status}`),{status:s.status});return l}async function we(){return me()?{ok:!1,reason:"install"}:qa()?await Notification.requestPermission()!=="granted"?{ok:!1,reason:"denied"}:o.mode!=="cloud"||!L()?{ok:!0,local:!0}:_e():{ok:!1,reason:"unsupported"}}async function _e(){if(o.mode!=="cloud"||!L()||z()!=="granted"||!o.me)return{ok:!1,reason:"not-ready"};let e;try{e=(await(await fetch(L()+"/vapid")).json()).publicKey}catch{return{ok:!1,reason:"server"}}if(!e)return{ok:!1,reason:"server"};let t=await navigator.serviceWorker.ready,a=await t.pushManager.getSubscription();if(a&&a.options?.applicationServerKey){let i=new Uint8Array(a.options.applicationServerKey),n=Ft(e);(i.length!==n.length||i.some((m,d)=>m!==n[d]))&&(await a.unsubscribe(),a=null)}a||(a=await t.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:Ft(e)}));let s=a.toJSON(),l=await Oa(s.endpoint);return await Y("/subscribe",{id:l,subscription:{endpoint:s.endpoint,keys:s.keys},prefs:Ue()}),localStorage.setItem(zt,l),{ok:!0,id:l}}async function Vt(e){localStorage.setItem(Ut,JSON.stringify(e)),o.mode==="cloud"&&z()==="granted"&&await _e().catch(()=>{})}async function ke(){return o.mode==="cloud"&&L()?localStorage.getItem(zt)?{kind:"server",...await Y("/test")}:{kind:"not-registered"}:(await(await navigator.serviceWorker.ready).showNotification("Notifica\xE7\xF5es ativadas \u2713",{body:"\xC9 assim que os lembretes v\xE3o chegar.",icon:"icons/icon-192.png",badge:"icons/icon-192.png",tag:"teste"}),{kind:"local"})}function Ve(e){try{if(!("setAppBadge"in navigator))return;e>0?navigator.setAppBadge(e).catch(()=>{}):navigator.clearAppBadge().catch(()=>{})}catch{}}var Ye="pauta.onboarded",Se="pauta.notifyAskedAt";function Kt(){if(!localStorage.getItem(Ye))return Ge(o.me?["welcome","notify","done"]:["welcome","who","notify","done"]);if(!o.me&&o.mode==="local")return Ge(["who"]);let t=Number(localStorage.getItem(Se)||0);if(Z()&&z()==="default"&&Date.now()-t>3*864e5)return Ge(["notify"])}function We(e,t,a="agora"){return`<div class="nprev">
    <img src="icons/icon-192.png" alt="">
    <div><div class="nprev__top"><b>${f(A.appName.toUpperCase())}</b><span>${f(a)}</span></div>
    <strong>${f(e)}</strong><p>${f(t)}</p></div>
  </div>`}function Na(e,t,a){let s=o.member(o.me),l=o.team.find(n=>n.id!==o.me)||o.team[1]||o.team[0],i=a>1?`<div class="ob__dots">${Array.from({length:a},(n,m)=>`<i class="${m===t?"is-on":""}"></i>`).join("")}</div>`:"";return e==="welcome"?`<div class="ob__art"><img class="ob__icon" src="icons/icon-512.png" alt=""></div>
      <h1>Bem-vindo ao ${f(A.appName)}</h1>
      <p>A agenda de conte\xFAdo de ${f(A.agencyName)}: posts, stories, reels e capta\xE7\xF5es de todas as empresas, num lugar s\xF3.</p>
      ${i}
      <button class="btn btn--primary btn--block" data-next>Come\xE7ar</button>`:e==="who"?`<div class="ob__art ob__art--sm">${p("user",34)}</div>
      <h1>Quem vai usar este celular?</h1>
      <p>Assim o app sabe de quem s\xE3o os lembretes e avisa o parceiro quando voc\xEA marcar algo.</p>
      <div class="whogrid ob__who">${o.team.map(n=>`<button class="whobtn${o.me===n.id?" is-on":""}" style="--mc:${n.color}" data-me="${n.id}">${M(n.id,36)}<span>${f(n.name)}</span><i class="whobtn__check">${p("check",14)}</i></button>`).join("")}</div>
      ${i}
      <button class="btn btn--primary btn--block" data-next ${o.me?"":"disabled"}>Continuar</button>`:e==="notify"?`<div class="ob__previews">
        ${We("Daqui a 2h: Reels \xB7 Pura Vida","18h \u2014 postar o Reels \u201CBastidores\u201D","agora")}
        ${We(`${l?.name||"Seu parceiro"} marcou para voc\xEA`,"Story \xB7 Caf\xE9 Aroma \u2014 amanh\xE3, 16h","h\xE1 2 min")}
        ${We(`Bom dia, ${s?.name||"Henrique"}! Seu dia hoje`,"5 tarefas \xB7 primeira: 11h30 Feed \xB7 Studio Fit","8:00")}
      </div>
      <h1>Nunca mais esque\xE7a um post</h1>
      <p>Lembretes 2h e 30 min antes de cada post, aviso na v\xE9spera das capta\xE7\xF5es, cobran\xE7a se algo ficou para tr\xE1s e aviso quando o parceiro marcar algo para voc\xEA.</p>
      <div data-notify-msg></div>
      ${i}
      <button class="btn btn--primary btn--block" data-enable>${p("bell",18)} Ativar notifica\xE7\xF5es</button>
      <button class="btn btn--ghost btn--block" data-skip>Agora n\xE3o</button>`:`<div class="ob__art ob__art--ok">${p("check",40)}</div>
    <h1>Tudo pronto${s?", "+f(s.name):""}!</h1>
    <ul class="ob__tips">
      <li>${p("plus",18)}<span>Toque no <b>+</b> para marcar posts, capta\xE7\xF5es e reuni\xF5es.</span></li>
      <li>${p("sparkle",18)}<span>O <b>Assistente</b> avisa conflitos e sugere os melhores hor\xE1rios.</span></li>
      <li>${p("link",18)}<span>Em <b>Empresas</b>, mande para cada cliente o link do cronograma dele.</span></li>
    </ul>
    ${i}
    <button class="btn btn--primary btn--block" data-next>Abrir a agenda</button>`}function Ge(e){if(document.querySelector(".ob"))return;let t=0,a=document.createElement("div");a.className="ob",a.innerHTML='<div class="ob__card"></div>',document.body.appendChild(a),requestAnimationFrame(()=>a.classList.add("is-in"));let s=a.querySelector(".ob__card"),l=()=>{(e.includes("welcome")||e.includes("done"))&&localStorage.setItem(Ye,"1"),a.classList.remove("is-in"),setTimeout(()=>a.remove(),400)},i=d=>{if(d>=e.length)return l();t=d,s.classList.remove("is-shown"),setTimeout(()=>{s.innerHTML=Na(e[t],t,e.length),m(),s.classList.add("is-shown")},s.innerHTML?180:0)},n=(d,r="info")=>{let c=s.querySelector("[data-notify-msg]");c&&(c.innerHTML=`<div class="ob__msg ob__msg--${r}">${d}</div>`)},m=()=>{s.querySelectorAll("[data-next]").forEach(c=>c.onclick=()=>i(t+1)),s.querySelectorAll("[data-me]").forEach(c=>c.onclick=()=>{o.setMe(c.dataset.me),s.querySelectorAll("[data-me]").forEach(u=>u.classList.toggle("is-on",u===c)),s.querySelector("[data-next]").disabled=!1});let d=s.querySelector("[data-skip]");d&&(d.onclick=()=>{localStorage.setItem(Se,String(Date.now())),i(t+1)});let r=s.querySelector("[data-enable]");r&&(r.onclick=async()=>{if(localStorage.setItem(Se,String(Date.now())),me()){n(`<b>Primeiro instale o app.</b> No iPhone, as notifica\xE7\xF5es s\xF3 funcionam pelo \xEDcone da Tela de In\xEDcio:<br>
          1. Toque em ${p("share",14)} <b>Compartilhar</b><br>2. <b>Adicionar \xE0 Tela de In\xEDcio</b><br>3. Abra o ${f(A.appName)} pelo \xEDcone`,"warn"),r.outerHTML='<button class="btn btn--primary btn--block" data-next>Entendi</button>',m();return}r.disabled=!0,r.innerHTML="Aguardando permiss\xE3o\u2026";let c=await we().catch(()=>({ok:!1,reason:"error"}));c.ok?(c.local?n("Ativado neste celular. Para os avisos chegarem com o app fechado e no celular do parceiro, falta ligar o servidor de notifica\xE7\xF5es (Ajustes \u2192 Notifica\xE7\xF5es).","ok"):(n("Pronto! Voc\xEA vai receber uma notifica\xE7\xE3o de teste em instantes.","ok"),ke().catch(()=>{})),r.outerHTML='<button class="btn btn--primary btn--block" data-next>Continuar</button>',s.querySelector("[data-skip]")?.remove(),m()):c.reason==="server"?(n("Permiss\xE3o concedida! O servidor de notifica\xE7\xF5es ainda n\xE3o foi publicado; quando for, este celular \xE9 cadastrado sozinho.","ok"),r.outerHTML='<button class="btn btn--primary btn--block" data-next>Continuar</button>',m()):c.reason==="denied"?(n(`As notifica\xE7\xF5es foram bloqueadas. Para ligar depois: <b>Ajustes do iPhone \u2192 Notifica\xE7\xF5es \u2192 ${f(A.appName)}</b>.`,"warn"),r.outerHTML='<button class="btn btn--primary btn--block" data-next>Continuar</button>',m()):(n("Este aparelho n\xE3o aceita notifica\xE7\xF5es deste app.","warn"),r.disabled=!1,r.innerHTML="Tentar de novo")})};i(0)}function Wt(){localStorage.removeItem(Ye),localStorage.removeItem(Se),v("A apresenta\xE7\xE3o aparece na pr\xF3xima abertura")}function Gt(){let e=o.member(o.me),t=o.mode==="cloud",a="Notification"in window&&Notification.permission==="granted";return`
  <header class="hdr">
    <div class="hdr__row"><div class="hdr__titles"><p class="hdr__eyebrow">${f(A.appName)} \xB7 ${f(A.agencyName)}</p><h1>Ajustes</h1></div></div>
  </header>
  <div class="page">
    <section class="block">
      <h2 class="block__title">${p("user",16)} Quem est\xE1 usando este celular?</h2>
      ${t?`<div class="card card--row">${e?M(e.id,40):p("user",24)}<div><strong>${f(e?.name||o.user?.email||"")}</strong><small>${f(o.user?.email||"")}</small></div>
            <button class="btn btn--soft btn--sm" data-action="logout">${p("logout",16)} Sair</button></div>`:`<div class="whogrid">${o.team.map(s=>`<button class="whobtn${o.me===s.id?" is-on":""}" style="--mc:${s.color}" data-action="set-me" data-p="${s.id}">${M(s.id,34)}<span>${f(s.name)}</span><i class="whobtn__check">${p("check",14)}</i></button>`).join("")}</div>
           <p class="fhelp">Usado para sauda\xE7\xE3o, \u201CCriado por\u201D e nos lembretes.</p>`}
    </section>

    ${Ia()}

    <section class="block">
      <h2 class="block__title">${p("sparkle",16)} Assistente e Claude</h2>
      <div class="card card--row">
        ${p("sparkle",22)}
        <div><strong>Assistente autom\xE1tico ativo</strong><small>Confere conflitos, tempo livre e melhores hor\xE1rios sozinho, sem internet e sem chave.</small></div>
        <button class="btn btn--soft btn--sm" data-action="assistant">Abrir</button>
      </div>
      <p class="fhelp">Para perguntas abertas (ideias, reorganizar a semana), use \u201CPerguntar ao Claude\u201D no Assistente. Abre o Claude com o seu login normal, sem chave de API.</p>
    </section>

    ${Pa()}

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
      <div class="card card--row ${t?"card--ok":"card--warn"}">
        ${p(t?"cloud":"phone",22)}
        <div><strong>${t?"Sincronizado na nuvem":"Salvo s\xF3 neste aparelho"}</strong>
        <small>${t?"Henrique, Matheus e os links dos clientes veem tudo em tempo real.":"Para Henrique e Matheus verem a mesma agenda em celulares diferentes, ative a nuvem (gratuito). Veja o guia no README do projeto."}</small></div>
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
          ${St.map(s=>`<li><span class="tbadge tbadge--${s.type}">${p(T[s.type].icon,13)}${T[s.type].label}</span><span>${f(s.text)}</span></li>`).join("")}
        </ul>
        <p class="fhelp pad">M\xE9dias de mercado. Confiram os Insights do Instagram de cada cliente e ajustem: cada p\xFAblico tem seu hor\xE1rio de pico.</p>
      </div>
    </section>

    <section class="block">
      <h2 class="block__title">${p("download",16)} Dados e backup</h2>
      <div class="list">
        <button class="list__row" data-action="export">${p("download",18)}<span>Exportar backup (.json)</span>${p("right",16,"muted")}</button>
        <label class="list__row">${p("upload",18)}<span>Importar backup</span><input type="file" accept="application/json,.json" data-action-change="import" hidden>${p("right",16,"muted")}</label>
        ${o.demo?`<button class="list__row" data-action="clear-demo">${p("sparkle",18)}<span>Apagar dados de exemplo</span>${p("right",16,"muted")}</button>`:""}
        <button class="list__row is-danger" data-action="clear-all">${p("trash",18)}<span>Apagar tudo</span>${p("right",16,"muted")}</button>
      </div>
      <p class="fhelp">${o.state.companies.length} empresas \xB7 ${o.state.events.length} eventos \xB7 ${o.state.notes.length} bilhetes</p>
    </section>
    <p class="about">${f(A.appName)} \u2014 agenda de conte\xFAdo \xB7 v1.0</p>
  </div>`}function Pa(){let e=z(),t=me(),a=o.mode==="cloud",s=!!localStorage.getItem("pauta.device"),l=Ue(),i,n,m="";return t?(i="warn",n="No iPhone, as notifica\xE7\xF5es s\xF3 funcionam com o app instalado: Compartilhar \u2192 Adicionar \xE0 Tela de In\xEDcio, e abra pelo \xEDcone."):e==="unsupported"?(i="warn",n="Este navegador n\xE3o aceita notifica\xE7\xF5es."):e==="denied"?(i="warn",n=`Bloqueadas. Para ligar: Ajustes do iPhone \u2192 Notifica\xE7\xF5es \u2192 ${A.appName}.`):e!=="granted"?(i="warn",n="Desativadas neste celular.",m='<button class="btn btn--primary btn--sm" data-action="notify-enable">Ativar</button>'):a&&s?(i="ok",n="Ativadas. Os lembretes e os avisos do parceiro chegam mesmo com o app fechado.",m='<button class="btn btn--soft btn--sm" data-action="notify-enable">Recadastrar</button>'):a?(i="warn",n="Permiss\xE3o concedida, mas este celular ainda n\xE3o foi cadastrado no servidor. Toque em Cadastrar.",m='<button class="btn btn--primary btn--sm" data-action="notify-enable">Cadastrar</button>'):(i="warn",n="Ativadas s\xF3 com o app aberto. Para receber com o app fechado e no celular do parceiro, ligue a nuvem e o servidor (README)."),`<section class="block">
    <h2 class="block__title">${p("bell",16)} Notifica\xE7\xF5es</h2>
    <div class="card card--row ${i==="ok"?"card--ok":"card--warn"}">
      ${p("bell",22)}
      <div><strong>${i==="ok"?"Funcionando":"Aten\xE7\xE3o"}</strong><small>${f(n)}</small></div>
      ${m}
    </div>
    <form class="list notif-prefs" data-notify-form onsubmit="return false">
      <label class="list__row"><span><b>Lembretes dos meus posts</b><small>2h e 30 min antes, na hora e cobran\xE7a se atrasar</small></span><input type="checkbox" class="switch" name="reminders" ${l.reminders?"checked":""}></label>
      <label class="list__row"><span><b>Avisos do parceiro</b><small>quando marcar, mudar ou concluir algo</small></span><input type="checkbox" class="switch" name="partner" ${l.partner?"checked":""}></label>
      <label class="list__row"><span><b>Resumo do dia</b><small>\xE0s 8h (hoje) e \xE0s 20h (amanh\xE3)</small></span><input type="checkbox" class="switch" name="daily" ${l.daily?"checked":""}></label>
    </form>
    ${e==="granted"?`<button class="btn btn--soft btn--block" data-action="notify-test">${p("bell",16)} Enviar notifica\xE7\xE3o de teste</button>`:""}
    <button class="btn-text btn-text--sm" data-action="onboarding-again">Ver a apresenta\xE7\xE3o de novo</button>
  </section>`}function Ia(){let e=N(),t=[0,15,30,45,60,90];return`<section class="block">
    <h2 class="block__title">${p("clock",16)} Rotina e tempo livre</h2>
    <form class="list" data-routine-form onsubmit="return false">
      <label class="list__row"><span>Expediente</span><input type="time" name="workStart" value="${e.workStart}"> <input type="time" name="workEnd" value="${e.workEnd}"></label>
      <label class="list__row"><span>Almo\xE7o</span><input type="time" name="lunchStart" value="${e.lunchStart}"> <input type="time" name="lunchEnd" value="${e.lunchEnd}"></label>
      <label class="list__row"><span>Deslocamento entre lugares</span><select name="travelMin">${t.map(a=>`<option value="${a}"${e.travelMin===a?" selected":""}>${a?a+" min":"n\xE3o considerar"}</option>`).join("")}</select></label>
      <label class="list__row"><span>M\xE1ximo de tarefas/dia</span><select name="maxTasks">${[4,5,6,7,8,10,12,15,20].map(a=>`<option value="${a}"${e.maxTasks===a?" selected":""}>${a}</option>`).join("")}</select></label>
      <div class="list__row list__row--col"><span>Dias de folga</span>
        <div class="daysoff">${X.map((a,s)=>`<label class="dayoff"><input type="checkbox" name="off" value="${s}"${e.daysOff.includes(s)?" checked":""}><span>${a}</span></label>`).join("")}</div>
      </div>
    </form>
    <p class="fhelp">O assistente usa isso para n\xE3o marcar nada em cima do almo\xE7o, da folga ou fora do expediente, e para proteger o tempo livre de voc\xEAs.</p>
  </section>`}var R={async notifyEnable(){let e=await we().catch(t=>({ok:!1,reason:"error",message:t.message}));e.ok?v(e.local?"Ativado (com o app aberto)":"Notifica\xE7\xF5es ativadas"):e.reason==="install"?v("Instale o app na Tela de In\xEDcio primeiro"):e.reason==="denied"?v("Bloqueado: libere em Ajustes do iPhone \u2192 Notifica\xE7\xF5es"):e.reason==="server"?v("Servidor de notifica\xE7\xF5es ainda n\xE3o publicado"):v(`N\xE3o foi poss\xEDvel ativar${e.message?": "+e.message:""}`,{ms:8e3}),o.emit()},async notifyTest(){let e;try{e=await ke()}catch(t){return v(`Falhou: ${t.message}`,{ms:8e3})}if(e.kind==="not-registered")return v('Este celular ainda n\xE3o est\xE1 cadastrado. Toque em "Ativar" acima.',{ms:7e3});if(e.kind==="local")return v("Notifica\xE7\xE3o local mostrada (servidor n\xE3o configurado)");if(e.sent>0)return v("Enviada! Deve chegar em alguns segundos. Bloqueie a tela para ver.",{ms:7e3});if(!e.devices)return v('O servidor n\xE3o tem este celular cadastrado. Toque em "Ativar" de novo.',{ms:7e3});v(`A Apple n\xE3o aceitou o envio (${(e.statuses||[]).join(", ")||"sem resposta"}). Toque em "Ativar" de novo.`,{ms:9e3})},async notifyPrefs(e){await Vt({reminders:e.reminders.checked,partner:e.partner.checked,daily:e.daily.checked}),v("Prefer\xEAncias salvas")},onboardingAgain(){Wt()},async routine(e){let t=(l,i)=>/^\d{2}:\d{2}$/.test(e[l].value)?e[l].value:i,a=N(),s={id:"routine",workStart:t("workStart",a.workStart),workEnd:t("workEnd",a.workEnd),lunchStart:t("lunchStart",a.lunchStart),lunchEnd:t("lunchEnd",a.lunchEnd),travelMin:Number(e.travelMin.value),maxTasks:Number(e.maxTasks.value),daysOff:[...e.querySelectorAll('input[name="off"]:checked')].map(l=>Number(l.value))};if(s.workEnd<=s.workStart)return v("O fim do expediente precisa ser depois do in\xEDcio");if(s.lunchEnd<=s.lunchStart)return v("O fim do almo\xE7o precisa ser depois do in\xEDcio");await o.upsert("settings",s),v("Rotina salva")},async ics(e){let t=e.dataset.who==="me"?o.me:"all";if(e.dataset.who==="me"&&!o.me)return v("Escolha primeiro quem est\xE1 usando este celular");let a=Number(e.dataset.days),s=w(),l=o.eventsBetween(s,_(s,a),{person:t}).filter(n=>n.status!=="feito");if(!l.length)return v("Nada agendado nesse per\xEDodo");let i=t==="all"?`${A.appName} \u2013 Dupla`:`${A.appName} \u2013 ${o.member(t).name}`;await qt(l,`pauta-${t}-${s}.ics`,i)},export(){let e=new Blob([o.exportData()],{type:"application/json"}),t=document.createElement("a");t.href=URL.createObjectURL(e),t.download=`pauta-backup-${w()}.json`,document.body.appendChild(t),t.click(),t.remove(),v("Backup exportado")},async import(e){let t=e.files[0];if(t)try{let a=await t.text(),s=await Dt({title:"Importar backup",text:"Como deseja importar?",options:[{label:"Juntar com os dados atuais",value:"merge",primary:!0},{label:"Substituir tudo",value:"replace",danger:!0}]});if(!s)return;await o.importData(a,{replace:s==="replace"}),v("Backup importado")}catch{v("Arquivo inv\xE1lido")}finally{e.value=""}},async clearAll(){await le({title:"Apagar TUDO?",text:"Empresas, eventos e bilhetes ser\xE3o apagados. Exporte um backup antes, se precisar.",ok:"Apagar tudo",danger:!0})&&(await o.clearAll(),v("Tudo apagado"))}};var Je=[{label:"Organize meu dia",q:"Analise a agenda de hoje e me diga, em ordem, o que fazer e quando. Aponte conflitos e onde d\xE1 para ganhar tempo livre."},{label:"Melhores hor\xE1rios da semana",q:"Sugira os melhores hor\xE1rios para os posts desta semana de cada empresa, sem conflitar com as capta\xE7\xF5es e respeitando o expediente e o almo\xE7o."},{label:"Equilibrar a dupla",q:"A carga de trabalho entre Henrique e Matheus est\xE1 equilibrada nos pr\xF3ximos 7 dias? Sugira trocas concretas de respons\xE1vel."},{label:"Ideias de conte\xFAdo",q:"Para cada empresa, sugira 3 ideias de posts (feed, reels e stories) para a pr\xF3xima semana, com legenda curta."}],La=(e=[])=>e.map(t=>o.member(t)?.name).filter(Boolean).join(" e ")||"sem respons\xE1vel";function Ra(e,t=14){let a=N(),s=w(),l=new Date,i=[];i.push(`Voc\xEA \xE9 o assistente de organiza\xE7\xE3o de uma dupla de social media (${o.team.map(d=>d.name).join(" e ")}) que cuida do Instagram de v\xE1rias empresas. Responda em portugu\xEAs do Brasil, de forma curta e direta (sem rodeios), com hor\xE1rios concretos e no m\xE1ximo uns 10 itens.`),i.push(""),i.push(`Agora: ${re(s)}, ${l.toTimeString().slice(0,5)}.`),i.push(`Rotina combinada: expediente ${a.workStart}\u2013${a.workEnd}, almo\xE7o ${a.lunchStart}\u2013${a.lunchEnd}, folga: ${a.daysOff.map(d=>pt[d]).join(", ")||"nenhuma"}, deslocamento m\xEDnimo entre lugares: ${a.travelMin} min, m\xE1ximo de ${a.maxTasks} tarefas por pessoa/dia.`),i.push(`Empresas: ${o.companiesSorted().map(d=>d.name+(d.instagram?` (@${d.instagram})`:"")).join(", ")||"nenhuma"}.`),i.push(""),i.push(`Agenda (de hoje at\xE9 ${t} dias):`);let n=o.eventsBetween(_(s,-1),_(s,t)),m="";return n.forEach(d=>{d.date!==m&&(i.push(`
${re(d.date)}:`),m=d.date);let r=o.company(d.companyId),c=d.duration?` (${d.duration} min)`:"";i.push(`- ${d.time||"sem hor\xE1rio"}${c} \xB7 ${T[d.type]?.label} \xB7 ${r?.name||"?"} \xB7 "${d.title||""}" \xB7 ${La(d.assignees)} \xB7 ${d.status==="feito"?"feito":d.status==="pronto"?"pronto":"a fazer"}${d.location?" \xB7 local: "+d.location:""}`)}),n.length||i.push("(nenhum compromisso)"),i.push(""),i.push(`Pergunta: ${e}`),i.join(`
`)}function Yt(e){let t=Ra(e);try{navigator.clipboard?.writeText(t).catch(()=>{})}catch{}let a=encodeURIComponent(t),s=a.length<7500?`https://claude.ai/new?q=${a}`:"https://claude.ai/new";window.open(s,"_blank","noopener"),v(a.length<7500?"Abrindo o Claude\u2026 (a agenda tamb\xE9m foi copiada)":"Agenda copiada: cole no Claude (segure no campo \u2192 Colar)",{ms:5e3})}var Zt="cal.chat",U=(()=>{try{return JSON.parse(localStorage.getItem(Zt)||"[]").slice(-30)}catch{return[]}})(),te=!1,Jt=()=>{try{localStorage.setItem(Zt,JSON.stringify(U.slice(-30)))}catch{}},Ba=e=>f(e).replace(/\*\*(.+?)\*\*/g,"<b>$1</b>").replace(/^#{1,4}\s*(.+)$/gm,"<b>$1</b>").replace(/^\s*[-•*]\s+(.+)$/gm,'<span class="li">$1</span>').replace(/<\/span>\n+(?=<span class="li">)/g,"</span>").replace(/\n{2,}/g,`
`).replace(/\n/g,"<br>"),Qt={"functions/failed-precondition":null,"functions/permission-denied":"S\xF3 a equipe pode usar o assistente.","functions/resource-exhausted":null,"functions/unavailable":"Sem conex\xE3o com o assistente agora. Tente de novo.","functions/deadline-exceeded":"O assistente demorou demais. Tente de novo."};function Ha(e){return e?.code==="local"?"O assistente precisa da sincroniza\xE7\xE3o na nuvem ligada.":e?.code==="no-server"?"O assistente ainda n\xE3o foi ligado no servidor. Falta publicar o servidor gratuito (veja o README).":e?.status?e.message:e?.code in Qt?Qt[e.code]||e.message:e?.code==="functions/not-found"||e?.code==="functions/internal"&&!/assistente|Claude/.test(e.message||"")?"O assistente ainda n\xE3o foi ligado no servidor. Falta publicar o servidor com a chave do Claude (veja o README, se\xE7\xE3o 5).":e?.message||"N\xE3o consegui falar com o assistente."}function Xt(){return`<section class="block" data-chat>
    <h2 class="block__title">${p("sparkle",16)} Pergunte ao assistente</h2>
    <div class="chat">
      ${U.length?U.map(e=>`<div class="msg msg--${e.role}${e.error?" msg--err":""}">${Ba(e.text)}</div>`).join(""):'<div class="msg msg--assistant">Oi! Eu vejo a agenda inteira de voc\xEAs: posts, capta\xE7\xF5es, reuni\xF5es, empresas e a rotina. Pergunte o que quiser, por exemplo \u201Co que eu tenho amanh\xE3?\u201D ou \u201Cqual o melhor hor\xE1rio para um Reels da Pura Vida na sexta?\u201D.</div>'}
      ${te?'<div class="msg msg--assistant msg--typing"><i></i><i></i><i></i></div>':""}
    </div>
    <div class="presets">${Je.map((e,t)=>`<button class="preset" data-preset="${t}">${f(e.label)}</button>`).join("")}</div>
    <form class="chat__form" data-chatform onsubmit="return false">
      <textarea class="input" rows="1" name="q" placeholder="Escreva sua pergunta\u2026" ${te?"disabled":""}></textarea>
      <button class="iconbtn iconbtn--accent" type="submit" aria-label="Enviar" ${te?"disabled":""}>${p("right",20)}</button>
    </form>
    <div class="chat__foot">
      ${U.length?'<button class="btn-text btn-text--sm" data-clearchat>Limpar conversa</button>':"<span></span>"}
      <button class="btn-text btn-text--sm" data-extclaude>Abrir no app do Claude</button>
    </div>
  </section>`}var Fa=e=>f(JSON.stringify(e));function za(e="all"){let t=w(),a=e==="all"?o.team.map(n=>n.id):[e],s=[],l=new Set;for(let n=0;n<7;n++){let m=_(t,n);a.forEach(r=>ye(r,m).forEach(c=>{let u=c.ids.slice().sort().join("|")+c.title;l.has(u)||(l.add(u),s.push({...c,date:m}))})),o.eventsOn(m).filter(r=>!(r.assignees||[]).length&&r.status!=="feito").forEach(r=>s.push({date:m,level:"warn",icon:"user",ids:[r.id],title:"Sem respons\xE1vel",text:`${S(r.time)} ${q(r)}`,fixes:o.team.map(c=>({label:`Dar para ${c.name}`,eventId:r.id,patch:{assignees:[c.id]}}))}))}let i=o.state.events.filter(n=>n.status==="pendente"&&(n.date<t||n.date===t&&n.time&&j(n.time)+15<F())&&n.date>=_(t,-7));return i.length&&s.unshift({date:t,level:"warn",icon:"flag",ids:i.map(n=>n.id),title:`${i.length} tarefa${i.length>1?"s":""} pendente${i.length>1?"s":""} no passado`,text:"Marquem como feito ou reagendem para o cronograma do cliente ficar correto."}),s}function ea(){let e={type:"feed",date:h.date>=w()?h.date:w(),q:""},t=()=>{let i=w(),n=za(),m=N(),d=Array.from({length:7},(c,u)=>_(i,u)),r={id:"__probe",type:e.type,date:e.date,assignees:[]};return`
    ${jt("Assistente")}
    <div class="page page--sheet">
      <div class="assist-hero">
        <span class="assist-hero__ic">${p("sparkle",22)}</span>
        <div><strong>Analisando a agenda de voc\xEAs</strong><p>Funciona sozinho, sem internet. Confere conflitos, tempo livre e os melhores hor\xE1rios sempre que algo muda.</p></div>
      </div>

      ${Xt()}

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
              ${c.fixes?.length?`<div class="fixes">${c.fixes.map(u=>`<button class="fixbtn" data-action="apply-fix" data-id="${u.eventId}" data-patch="${Fa(u.patch)}">${p("check",13)} ${f(u.label)}</button>`).join("")}</div>`:""}
              ${c.ids?.length===1?`<button class="btn-text btn-text--sm" data-action="open-event" data-id="${c.ids[0]}">Ver evento</button>`:""}
            </div>
          </div>`).join("")}</div>`:`<div class="tip tip--ok"><span class="tip__ic">${p("check",16)}</span><div><strong>Tudo certo</strong><p>Nenhum conflito nos pr\xF3ximos 7 dias.</p></div></div>`}
      </section>

      <section class="block">
        <h2 class="block__title">${p("clock",16)} Tempo livre no expediente (${S(m.workStart)}\u2013${S(m.workEnd)})</h2>
        <div class="freegrid">
          <span></span>${d.map(c=>`<span class="freegrid__d">${X[V(c).getDay()]}<b>${V(c).getDate()}</b></span>`).join("")}
          ${o.team.map(c=>`${M(c.id,24)}${d.map(u=>{let $=ee(c.id,u);if($.dayOff)return'<span class="freecell is-off">folga</span>';let x=$.minutes/60;return`<span class="freecell ${x>=4?"is-good":x>=2?"is-mid":"is-low"}">${K(Math.round($.minutes/15)*15)||"0"}</span>`}).join("")}`).join("")}
        </div>
        <p class="fhelp">Verde: dia tranquilo \xB7 amarelo: apertado \xB7 vermelho: sem respiro. Ajuste a rotina em Ajustes.</p>
      </section>

      <section class="block">
        <h2 class="block__title">${p("bulb",16)} Encontrar o melhor hor\xE1rio</h2>
        <div class="card">
          <div class="row2">
            <select class="input" data-f="type">${kt.map(c=>`<option value="${c}"${e.type===c?" selected":""}>${T[c].label}</option>`).join("")}</select>
            <input class="input" type="date" data-f="date" value="${e.date}">
          </div>
          ${o.team.map(c=>{let u=Ct({...r},{people:[c.id],limit:4});return`<div class="findrow">${M(c.id,26)}<div class="hintbox__times">${u.length?u.map($=>`<button class="tchip" data-new="${c.id}|${$.time}">${S($.time)}${$.peak?"<small>pico</small>":""}</button>`).join(""):'<span class="muted">Sem hor\xE1rio livre</span>'}</div></div>`}).join("")}
          <p class="fhelp">Toque num hor\xE1rio para j\xE1 criar o evento com a pessoa certa.</p>
        </div>
      </section>

    </div>`},a=Tt({className:"sheet--tall",html:t(),onMount:i=>{let n=i.el;n.querySelector('[data-f="type"]').onchange=d=>{e.type=d.target.value,i.set(t())},n.querySelector('[data-f="date"]').onchange=d=>{d.target.value&&(e.date=d.target.value,i.set(t()))},n.querySelectorAll("[data-new]").forEach(d=>d.onclick=async()=>{let[r,c]=d.dataset.new.split("|"),{openEventEditor:u}=await import("./c-FJTSIK4O.js");u({date:e.date,type:e.type,time:c,assignees:[r]})}),l(i,async d=>{if(d=(d||"").trim(),!d||te)return;let r=U.filter(c=>!c.error).map(c=>({role:c.role,text:c.text}));U.push({role:"user",text:d}),te=!0,s(i);try{let c=await o.askAssistant(d,r);U.push({role:"assistant",text:c})}catch(c){U.push({role:"assistant",text:Ha(c),error:!0})}te=!1,Jt(),s(i)})}});function s(i){let n=i.el.querySelector("[data-chat]");if(!n)return;n.outerHTML=Xt(),l(i,i.send);let m=i.el.querySelector(".chat");m&&m.lastElementChild?.scrollIntoView({block:"nearest",behavior:"smooth"})}function l(i,n){i.send=n;let m=i.el;m.querySelectorAll("[data-preset]").forEach(u=>u.onclick=()=>n(Je[+u.dataset.preset].q));let d=m.querySelector("[data-chatform]"),r=d.q;r.oninput=()=>{r.style.height="auto",r.style.height=Math.min(r.scrollHeight,140)+"px"},r.onkeydown=u=>{u.key==="Enter"&&!u.shiftKey&&(u.preventDefault(),n(r.value))},d.onsubmit=u=>{u.preventDefault(),n(r.value)};let c=m.querySelector("[data-clearchat]");c&&(c.onclick=()=>{U=[],Jt(),s(i)}),m.querySelector("[data-extclaude]").onclick=()=>Yt(r.value.trim()||"Analise a agenda e me diga o que \xE9 mais importante agora.")}a.refresh=()=>{let i=document.activeElement;if(i&&a.el.contains(i)&&/INPUT|TEXTAREA|SELECT/.test(i.tagName))return;let n=a.el.scrollTop;a.set(t()),a.el.scrollTop=n}}var ta="seed-v1",aa=[{id:"c_puravida",name:"Pura Vida",color:"#15803D",logoFile:"pura-vida.jpg"},{id:"c_jggarcia",name:"JG Garcia",color:"#16A34A",logoFile:"jg-garcia.jpg"},{id:"c_garciahortifruti",name:"Garcia Hortifruti",color:"#65A30D",logoFile:"garcia-hortifruti.jpg"},{id:"c_tobiasbbq",name:"Tobia's BBQ",color:"#DC2626",logoFile:"tobias-bbq.jpg"},{id:"c_verdeerosa",name:"Verde e Rosa Multimarcas",color:"#DB2777",logoFile:"verde-e-rosa.jpg"},{id:"c_sophiafestas",name:"Sophia Festas",color:"#0284C7",logoFile:"sophia-festas.jpg"}],Ua=async e=>{let t=await(await fetch(e,{cache:"no-cache"})).blob();return new Promise((a,s)=>{let l=new FileReader;l.onload=()=>a(l.result),l.onerror=s,l.readAsDataURL(t)})},Qe=!1;async function oa(){if(!(Qe||!o.ready||o.state.settings.some(e=>e.id===ta))){Qe=!0;try{let e=aa.filter(a=>!o.company(a.id)&&!o.state.companies.some(s=>s.name.trim().toLowerCase()===a.name.toLowerCase())),t=[];for(let a of e){let s=null;try{s=await Ua(`media/logos/${a.logoFile}`)}catch{}t.push({id:a.id,name:a.name,color:a.color,logo:s,instagram:"",address:"",contact:"",notes:"",shareToken:null})}t.length&&await o.upsertMany("companies",t),await o.upsert("settings",{id:ta,done:aa.map(a=>a.id)})}finally{Qe=!1}}}var Xe="seed-garcia-nov-2026",sa="c_garciahortifruti",Va=["domingo","segunda","ter\xE7a","quarta","quinta","sexta","s\xE1bado"];function Ka(e="2026-11-19",t="2026-11-30"){let a=[],s=0,l=["Marechal","Vila Valqueire"];for(let i=new Date(e+"T12:00:00");i<=new Date(t+"T12:00:00");i.setDate(i.getDate()+1)){let n=`${i.getFullYear()}-${String(i.getMonth()+1).padStart(2,"0")}-${String(i.getDate()).padStart(2,"0")}`,m=i.getDay(),d={id:`e_garcia_${n}`,date:n,time:"07:00",companyId:sa,assignees:["henrique"],status:"pendente",description:"",seedRoutine:!0};if([1,3,5].includes(m)){let r=l[s++%2];a.push({...d,type:"captacao",duration:420,reminder:1440,title:`Grava\xE7\xE3o com o Gelado \u2014 unidade ${r}`,location:`Garcia Hortifruti \u2014 ${r}`,internalNote:"Rotina CEASA + grava\xE7\xE3o. Chegada \xE0s 07h. Personagem: Gelado (filmar para Reels e feed). Programa\xE7\xE3o pode mudar conforme abastecimento e disponibilidade do Gelado.",visibleToClient:!0})}else m===0?a.push({...d,type:"outro",duration:420,reminder:30,title:"Planejamento da semana",location:"",internalNote:"Planejamento \u2014 07h \xE0s 14h.",visibleToClient:!1}):a.push({...d,type:"outro",duration:420,reminder:30,title:`CEASA (${Va[m]})`,location:"CEASA",internalNote:"CEASA \u2014 07h \xE0s 14h.",visibleToClient:!1})}return a}var Ze=!1,et="seed-garcia-nov-2026-ate14h";async function na(){if(o.ready&&!o.state.settings.some(e=>e.id===et)&&o.state.settings.some(e=>e.id===Xe)){let e=o.state.events.filter(t=>t.seedRoutine&&t.duration===300).map(t=>({...t,duration:420,internalNote:"CEASA \u2014 07h \xE0s 14h."}));e.length&&await o.upsertMany("events",e),await o.upsert("settings",{id:et,done:[]})}if(!(Ze||!o.ready||o.state.settings.some(e=>e.id===Xe))&&o.company(sa)){Ze=!0;try{let e=Ka().filter(t=>!o.event(t.id));e.length&&await o.upsertMany("events",e),await o.upsert("settings",{id:Xe,done:[]}),await o.upsert("settings",{id:et,done:[]})}finally{Ze=!1}}}var ae={feed:"Feed",carrossel:"Carrossel",reels:"Reels",story:"Story",captacao:"Capta\xE7\xE3o",reuniao:"Reuni\xE3o",producao:"Edi\xE7\xE3o",outro:"Tarefa"},Wa=["feed","carrossel","reels","story"],Ee=e=>Wa.includes(e),ia={feed:"publicar o feed",carrossel:"publicar o carrossel",reels:"postar o Reels",story:"postar o story",captacao:"a capta\xE7\xE3o",reuniao:"a reuni\xE3o",producao:"a edi\xE7\xE3o",outro:"a tarefa"},J=e=>e?e.replace(/^0/,"").replace(":00","h").replace(":","h"):"",Ga=e=>{let[t,a]=String(e).split(":").map(Number);return t*60+a},xe=e=>Math.round(Date.UTC(+e.slice(0,4),+e.slice(5,7)-1,+e.slice(8,10))/864e5),Ae=(e,t)=>new Date(Date.UTC(+e.slice(0,4),+e.slice(5,7)-1,+e.slice(8,10)+t)).toISOString().slice(0,10);function tt(e){let t=Number.isFinite(e.reminder)?e.reminder:30,a;return Ee(e.type)?a=[120,30,0,-30]:e.type==="captacao"?a=[1440,120,45,-30]:e.type==="reuniao"?a=[1440,60,15]:a=[30,0],t>=0&&!a.includes(t)&&a.push(t),t<0&&(a=a.filter(s=>s<0)),[...new Set(a)].sort((s,l)=>l-s)}function ra(e,t,a=4){let s=xe(t.date)*1440+t.minutes,l=[];return e.forEach(i=>{if(!i||!i.time||!i.date||i.status==="feito")return;let n=xe(i.date)*1440+Ga(i.time);tt(i).forEach(m=>{if(m<0&&i.status!=="pendente")return;let d=n-m;d<=s&&d>s-a&&l.push({ev:i,offset:m})})}),l}var Ya=(e,t)=>{let a=xe(e)-xe(t.date);return a===0?"hoje":a===1?"amanh\xE3":a===-1?"ontem":`${["domingo","segunda","ter\xE7a","quarta","quinta","sexta","s\xE1bado"][new Date(Date.UTC(+e.slice(0,4),+e.slice(5,7)-1,+e.slice(8,10))).getUTCDay()]}, ${e.slice(8,10)}/${e.slice(5,7)}`},Ja=e=>{if(e>=60){let t=Math.floor(e/60),a=e%60;return a?`${t}h${String(a).padStart(2,"0")}`:`${t}h`}return`${e} min`};function Te(e,t,a=""){let s=`${ae[e.type]||"Tarefa"}${a?" \xB7 "+a:""}`,l=e.title?`\u201C${e.title}\u201D`:"",i=J(e.time),n=e.location?` \xB7 ${e.location}`:"";return t>=1440?{title:`Amanh\xE3: ${s} \xE0s ${i}`,body:e.type==="captacao"?`Hoje: carregue baterias, esvazie os cart\xF5es e confirme com o cliente.${n}`:`${l}${n}`.trim()||"Confirme o hor\xE1rio com o cliente."}:t>0?{title:`Daqui a ${Ja(t)}: ${s}`,body:`${i} \u2014 ${ia[e.type]||"a tarefa"}${l?" "+l:""}${n}`}:t===0?{title:`Agora: ${s}`,body:`Est\xE1 na hora de ${ia[e.type]||"fazer a tarefa"}${l?" "+l:""}.`}:{title:Ee(e.type)?`J\xE1 postou? ${s}`:`J\xE1 fez? ${s}`,body:`Era \xE0s ${i}${l?" \u2014 "+l:""}. Toque para marcar como feito.`}}function at(e,t,{actor:a="Algu\xE9m",company:s="",recipient:l=null,now:i}={}){let m=`${ae[(t||e).type]||"Tarefa"}${s?" \xB7 "+s:""}`,d=$=>`${Ya($.date,i)}${$.time?", "+J($.time):""}`,r=$=>l&&($.assignees||[]).includes(l);if(!e&&t)return{title:r(t)?`${a} marcou para voc\xEA`:`${a} adicionou na agenda`,body:`${m} \u2014 ${d(t)}${t.title?" \xB7 "+t.title:""}`};if(e&&!t)return{title:`${a} removeu da agenda`,body:`${m} \u2014 ${d(e)}`};if(e.status!=="feito"&&t.status==="feito")return{title:`${a} concluiu \u2713`,body:`${m} \u2014 ${d(t)}`};let c=r(e),u=r(t);return!c&&u?{title:`${a} passou para voc\xEA`,body:`${m} \u2014 ${d(t)}${t.title?" \xB7 "+t.title:""}`}:c&&!u?{title:`${a} assumiu uma tarefa sua`,body:`${m} \u2014 ${d(t)}`}:e.date!==t.date||e.time!==t.time?{title:`${a} mudou o hor\xE1rio`,body:`${m}: ${d(e)} \u2192 ${d(t)}`}:null}function ca(e,t,a,s){if(!a.length)return null;let l=[...a].sort((c,u)=>(c.time||"99").localeCompare(u.time||"99")),i=l.find(c=>c.time)||l[0],n=l.filter(c=>Ee(c.type)).length,m=l.filter(c=>c.type==="captacao"||c.type==="reuniao"),d=c=>`${J(c.time)} ${ae[c.type]}${s(c)?" \xB7 "+s(c):""}`,r=[`${l.length} tarefa${l.length>1?"s":""} (${n} post${n===1?"":"s"})`,`primeira: ${d(i)}`];return m.length&&r.push(`sai para ${m.map(c=>`${s(c)||ae[c.type]} \xE0s ${J(c.time)}`).join(" e ")}`),e==="morning"?{title:`Bom dia, ${t}! Seu dia hoje`,body:r.join(" \xB7 ")}:{title:`${t}, amanh\xE3 voc\xEA tem ${l.length} tarefa${l.length>1?"s":""}`,body:r.slice(1).join(" \xB7 ")}}var ma=e=>o.member(e)?.name||"Algu\xE9m",B=e=>o.company(e)?.name||"",pa=()=>{let e=new Date;return{date:w(),minutes:e.getHours()*60+e.getMinutes()}},la=(e,t)=>Date.parse(`${e}T${t}:00-03:00`),ot=()=>o.mode==="cloud"&&!!L()&&!!o.me;function ua(e,t,a,s="./"){!t||!e.length||Y("/notify",{to:e,title:t.title,body:t.body,tag:a,url:s}).catch(l=>console.warn("aviso ao parceiro",l.message))}function fa(e,t){if(!ot())return;let a=t||e;o.team.map(l=>l.id).filter(l=>l!==o.me).forEach(l=>{let i=at(e,t,{actor:ma(o.me),company:B(a.companyId),recipient:l,now:pa()});ua([l],i,`ev-${a.id}`,`./#/e/${a.id}`)}),oe()}function ha(e){if(!ot())return;let t=o.team.map(l=>l.id).filter(l=>l!==o.me),a=ma(o.me),s=null;if(e.kind==="deleted"&&e.events?.length){let l=e.events[0];s=e.events.length===1?at(l,null,{actor:a,company:B(l.companyId),now:pa()}):{title:`${a} removeu ${e.events.length} itens da agenda`,body:`${B(l.companyId)?B(l.companyId)+" \xB7 ":""}a partir de ${l.date.slice(8,10)}/${l.date.slice(5,7)}`}}else e.kind==="series"?s={title:`${a} adicionou ${e.count} itens repetidos`,body:`${e.label||""}${B(e.sample?.companyId)?" \xB7 "+B(e.sample.companyId):""}`}:e.kind==="series-edit"?s={title:`${a} alterou ${e.count} itens repetidos`,body:`${e.label||""}${B(e.sample?.companyId)?" \xB7 "+B(e.sample.companyId):""}`}:e.kind==="import"&&(s={title:`${a} importou a agenda`,body:`${e.count||0} itens atualizados.`});ua(t,s,`act-${e.id||Date.now()}`),oe()}function Qa(e=Date.now()){let t=[],a=_(w(),-1),s=_(w(),4),l=o.eventsBetween(a,s).filter(n=>n.time&&n.status!=="feito"),i=(n,m)=>o.eventsOn(m,{person:n}).filter(d=>d.status!=="feito").length;l.forEach(n=>{let m=la(n.date,n.time);tt(n).forEach(d=>{if(d<0&&n.status!=="pendente")return;let r=m-d*6e4;if(r<e-10*6e4||r>e+4*864e5)return;let c=Te(n,d,B(n.companyId));(n.assignees?.length?n.assignees:o.team.map($=>$.id)).forEach($=>t.push({id:`r_${n.id}_${d}_${n.date}${n.time.replace(":","")}_${$}`,at:r,member:$,title:c.title,body:c.body,tag:`rem-${n.id}`,url:`./#/e/${n.id}`,kind:"reminders",badge:i($,n.date)}))})});for(let n=0;n<4;n++){let m=_(w(),n);o.team.forEach(d=>{[["morning",m,"08:00"],["evening",_(m,1),"20:00"]].forEach(([r,c,u])=>{let $=la(m,u);if($<e-10*6e4)return;let x=o.eventsOn(c,{person:d.id}).filter(g=>g.status!=="feito"),C=ca(r,d.name,x,g=>B(g.companyId));C&&t.push({id:`d_${r}_${c}_${d.id}`,at:$,member:d.id,title:C.title,body:C.body,tag:`daily-${r}`,url:"./",kind:"daily",badge:i(d.id,c)})})})}return t.sort((n,m)=>n.at-m.at)}var da="",oe=wt(async()=>{if(!ot())return;let e=Qa(),t=JSON.stringify(e.map(a=>[a.id,a.at,a.title,a.body]));if(t!==da)try{await Y("/schedule",{items:e}),da=t}catch(a){console.warn("lista de lembretes",a.message)}},3e3);var ba=["domingo","segunda","ter\xE7a","quarta","quinta","sexta","s\xE1bado"],ga=e=>ba[new Date(Date.UTC(+e.slice(0,4),+e.slice(5,7)-1,+e.slice(8,10))).getUTCDay()],Xa={pendente:"a fazer",pronto:"pronto/agendado",feito:"feito"};function $a({events:e,companies:t,routine:a,notes:s,team:l,me:i,now:n}){let m=new Map(t.map(g=>[g.id,g.name])),d=g=>l.find(P=>P.id===g)?.name||g,r=Ae(n.date,-7),c=Ae(n.date,30),u=e.filter(g=>g.date>=r&&g.date<=c).sort((g,P)=>(g.date+(g.time||"")).localeCompare(P.date+(P.time||""))),$=[];$.push(`Agora: ${ga(n.date)}, ${n.date.split("-").reverse().join("/")}, ${J(`${String(Math.floor(n.minutes/60)).padStart(2,"0")}:${String(n.minutes%60).padStart(2,"0")}`)} (hor\xE1rio de Bras\xEDlia).`),$.push(`Quem pergunta: ${d(i)}. Equipe: ${l.map(g=>g.name).join(" e ")}.`),a&&$.push(`Rotina combinada: expediente ${a.workStart}\u2013${a.workEnd}, almo\xE7o ${a.lunchStart}\u2013${a.lunchEnd}, folga: ${(a.daysOff||[]).map(g=>ba[g]).join(", ")||"nenhuma"}, deslocamento m\xEDnimo ${a.travelMin} min, m\xE1ximo ${a.maxTasks} tarefas por pessoa/dia.`),$.push(`Empresas clientes: ${t.map(g=>g.name+(g.instagram?` (@${g.instagram})`:"")+(g.address?` \u2014 endere\xE7o: ${g.address}`:"")+(g.notes?` \u2014 observa\xE7\xF5es: ${g.notes}`:"")).join("; ")||"nenhuma"}.`),$.push("",`Agenda (de ${r.split("-").reverse().join("/")} a ${c.split("-").reverse().join("/")}):`);let x="";u.forEach(g=>{g.date!==x&&($.push(`
${ga(g.date)} ${g.date.split("-").reverse().join("/")}:`),x=g.date);let P=g.duration?` (${g.duration} min)`:"",y=(g.assignees||[]).map(d).join(" e ")||"sem respons\xE1vel";$.push(`- ${g.time?J(g.time):"sem hor\xE1rio"}${P} \xB7 ${ae[g.type]||g.type} \xB7 ${m.get(g.companyId)||"?"} \xB7 "${g.title||""}" \xB7 ${y} \xB7 ${Xa[g.status]||g.status}${g.location?" \xB7 local: "+g.location:""}${g.description?" \xB7 legenda: "+g.description.slice(0,160):""}${g.internalNote?" \xB7 nota interna: "+g.internalNote.slice(0,160):""}`)}),u.length||$.push("(nenhum compromisso)");let C=(s||[]).filter(g=>g.date>=Ae(n.date,-2)).slice(-10);return C.length&&$.push("","Bilhetes recentes da dupla:",...C.map(g=>`- ${g.date.split("-").reverse().join("/")} ${d(g.author)}: ${g.text}`)),$.join(`
`)}var O=document.getElementById("app");window.__calStarted=!0;var Q=null;function Za(){O.innerHTML=`
    <main id="view" class="view"></main>
    <nav class="tabbar" aria-label="Navega\xE7\xE3o">
      ${je("hoje","today","Hoje")}
      ${je("mes","calendar","Calend\xE1rio")}
      <button class="tabbar__fab" data-action="new-event" aria-label="Novo evento">${p("plus",28)}</button>
      ${je("empresas","building","Empresas")}
      ${je("ajustes","settings","Ajustes")}
    </nav>`}var je=(e,t,a)=>`<button class="tabbar__btn" data-action="tab" data-tab="${e}">${p(t,24)}<span>${a}</span></button>`;function D(){let e=document.getElementById("view");if(!e)return;let t=window.scrollY,a=e.querySelector('[data-form="note"] input'),s=a?a.value:"",l=a&&document.activeElement===a,i=h.tab==="mes"?Ht():h.tab==="empresas"?Ot():h.tab==="ajustes"?Gt():Bt();e.innerHTML=i,document.querySelectorAll(".tabbar__btn").forEach(m=>m.classList.toggle("is-on",m.dataset.tab===h.tab)),window.scrollTo(0,t);let n=e.querySelector('[data-form="note"] input');n&&s&&(n.value=s),n&&l&&n.focus({preventScroll:!0}),ao()}function eo(){D(),Be().forEach(e=>e.refresh&&e.refresh())}function pe(e){h.tab=e,Pe(),D(),window.scrollTo(0,0)}var to={tab:e=>pe(e.dataset.tab),"set-person":e=>{h.person=e.dataset.p,Pe(),D()},"set-date":e=>{h.date=e.dataset.k,D()},"go-today":()=>{h.date=w(),D()},week:e=>{h.date=_(h.date,Number(e.dataset.n)),D()},month:e=>{h.month=qe(h.month,Number(e.dataset.n)),h.monthSel=h.month===ie(w())?w():`${h.month}-01`,D()},"month-today":()=>{h.month=ie(w()),h.monthSel=w(),D()},"month-select":e=>{h.monthSel=e.dataset.k,ie(e.dataset.k)!==h.month&&(h.month=ie(e.dataset.k)),D()},"month-company":e=>{h.monthCompany=e.dataset.id||null,D()},"open-day":e=>{h.date=e.dataset.k,pe("hoje")},"toggle-tips":()=>{h.showAllTips=!h.showAllTips,D()},"open-event":e=>be(e.dataset.id),assistant:()=>ea(),"apply-fix":async e=>{let t=o.event(e.dataset.id);if(!t)return;let a;try{a=JSON.parse(e.dataset.patch)}catch{return}let s={};typeof a.time=="string"&&/^\d{2}:\d{2}$/.test(a.time)&&(s.time=a.time),Array.isArray(a.assignees)&&(s.assignees=a.assignees.filter(n=>o.member(n)));let{confirmMove:l}=await import("./c-FJTSIK4O.js");if(!await l(t,s))return;let i={...t};await o.upsert("events",{...t,...s}),v("Pronto, ajustado",{action:"Desfazer",onAction:()=>o.upsert("events",i)})},"toggle-done":async e=>{let t=o.event(e.dataset.id);if(!t)return;let a=t.status==="feito"?"pendente":"feito";await o.upsert("events",{...t,status:a}),a==="feito"&&v(`${T[t.type].label} conclu\xEDdo`,{action:"Desfazer",onAction:()=>o.upsert("events",{...o.event(t.id),status:t.status})})},"new-event":e=>{if(!o.state.companies.length)return v("Cadastre uma empresa primeiro"),ze(null,()=>He({}));He({date:e.dataset.date||null})},"open-company":e=>Nt(e.dataset.id),"new-company":()=>ze(),"del-note":async e=>{let t=o.state.notes.find(a=>a.id===e.dataset.id);await o.remove("notes",e.dataset.id),t&&v("Bilhete apagado",{action:"Desfazer",onAction:()=>o.upsert("notes",t)})},"set-me":e=>{o.setMe(e.dataset.p),v(`Ol\xE1, ${o.member(e.dataset.p).name}!`)},"clear-demo":async()=>{await le({title:"Apagar os dados de exemplo?",text:"O calend\xE1rio ficar\xE1 vazio para voc\xEAs cadastrarem as empresas e eventos reais.",ok:"Apagar exemplos",danger:!0})&&(await o.clearDemo(),v("Pronto! Agora cadastre suas empresas."))},"clear-all":()=>R.clearAll(),ics:e=>R.ics(e),"notify-enable":()=>R.notifyEnable(),"notify-test":()=>R.notifyTest(),"onboarding-again":()=>R.onboardingAgain(),export:()=>R.export(),logout:async()=>{await le({title:"Sair da conta?",ok:"Sair"})&&(await Q.signOut(),location.reload())}};document.addEventListener("click",e=>{let t=e.target.closest("[data-action]");if(!t||document.body.classList.contains("is-client"))return;let a=to[t.dataset.action];a&&(e.preventDefault(),e.stopPropagation(),a(t))});document.addEventListener("change",e=>{e.target.matches('[data-action-change="import"]')&&R.import(e.target),e.target.closest("[data-notify-form]")&&R.notifyPrefs(e.target.closest("[data-notify-form]")),e.target.closest("[data-routine-form]")&&R.routine(e.target.closest("[data-routine-form]"))});document.addEventListener("submit",async e=>{let t=e.target.closest('[data-form="note"]');if(!t)return;e.preventDefault();let a=t.text.value.trim();if(a){if(!o.me){v("Escolha quem voc\xEA \xE9 em Ajustes");return}await o.upsert("notes",{id:vt("n_"),date:h.date,text:a,author:o.me}),v("Bilhete adicionado")}});function ao(){document.querySelectorAll("[data-swipe]").forEach(e=>{let t=null,a=null;e.addEventListener("touchstart",s=>{t=s.touches[0].clientX,a=s.touches[0].clientY},{passive:!0}),e.addEventListener("touchend",s=>{if(t==null)return;let l=s.changedTouches[0].clientX-t,i=s.changedTouches[0].clientY-a;if(t=null,Math.abs(l)<50||Math.abs(l)<Math.abs(i)*1.5)return;let n=l<0?1:-1;e.dataset.swipe==="week"?h.date=_(h.date,7*n):(h.month=qe(h.month,n),h.monthSel=`${h.month}-01`),D()})})}var va=new Set;function ya(){if(!o.me)return;let e=new Date,t={date:w(),minutes:e.getHours()*60+e.getMinutes()},a=o.eventsBetween(_(t.date,-1),_(t.date,1),{person:o.me}),s=o.mode==="cloud"&&!!localStorage.getItem("pauta.device");ra(a,t,2).forEach(({ev:l,offset:i})=>{let n=`${l.id}@${i}@${l.date}${l.time}`;if(va.has(n))return;va.add(n);let m=Te(l,i,o.company(l.companyId)?.name||"");v(`${m.title}`,{ms:7e3,action:"Ver",onAction:()=>be(l.id)}),!s&&z()==="granted"&&navigator.serviceWorker&&navigator.serviceWorker.ready.then(d=>d.showNotification(m.title,{body:m.body,tag:`rem-${l.id}`,icon:"icons/icon-192.png",badge:"icons/icon-192.png",data:{url:`./#/e/${l.id}`}})).catch(()=>{})}),Ve(o.eventsOn(t.date,{person:o.me}).filter(l=>l.status!=="feito").length)}function rt(e=location.hash){let t=/^#\/(e|d)\/([\w-]+)/.exec(e||"");return t?(history.replaceState(null,"",location.pathname+location.search),t[1]==="e"&&o.event(t[2])?(h.date=o.event(t[2]).date,pe("hoje"),be(t[2])):t[1]==="d"&&/^\d{4}-\d{2}-\d{2}$/.test(t[2])&&(h.date=t[2],pe("hoje")),!0):!1}var wa={"auth/invalid-credential":"E-mail ou senha incorretos. Confira a senha (toque no olho para ver o que digitou).","auth/wrong-password":"Senha incorreta.","auth/user-not-found":"Este e-mail n\xE3o est\xE1 cadastrado no Firebase (Authentication \u2192 Usu\xE1rios).","auth/invalid-email":"E-mail inv\xE1lido.","auth/too-many-requests":'Muitas tentativas seguidas. Espere alguns minutos ou use "Esqueci minha senha".',"auth/network-request-failed":"Sem conex\xE3o com a internet. Verifique o Wi-Fi/4G e tente de novo.","auth/user-disabled":"Este usu\xE1rio foi desativado no Firebase.","auth/operation-not-allowed":"O login por e-mail/senha n\xE3o est\xE1 ativado no Firebase.","auth/api-key-not-valid":"Configura\xE7\xE3o do Firebase inv\xE1lida (apiKey)."},_a="",it="";function De(e=""){let t=e||it;O.innerHTML=`
  <div class="login">
    <img src="icons/icon-192.png" alt="" width="84" height="84">
    <h1>${f(A.appName)}</h1>
    <p>Agenda de conte\xFAdo \xB7 ${f(A.agencyName)}</p>
    <form class="form" data-login novalidate>
      <div class="fgroup"><label class="flabel" for="l-email">E-mail</label><input id="l-email" class="input" type="email" name="email" value="${f(_a)}" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" inputmode="email"></div>
      <div class="fgroup"><label class="flabel" for="l-pass">Senha</label>
        <div class="input-eye"><input id="l-pass" class="input" type="password" name="pass" autocomplete="current-password" autocapitalize="none" autocorrect="off" spellcheck="false">
        <button type="button" class="iconbtn iconbtn--sm" data-eye aria-label="Mostrar senha">${p("eye",18)}</button></div>
      </div>
      ${t?`<p class="login__err">${f(t)}</p>`:""}
      <button class="btn btn--primary btn--block" type="submit" data-go>Entrar</button>
      <button class="btn-text btn-text--sm" type="button" data-reset>Esqueci minha senha</button>
    </form>
  </div>`;let a=O.querySelector("[data-login]");O.querySelector("[data-eye]").onclick=()=>{a.pass.type=a.pass.type==="password"?"text":"password"},a.onsubmit=async s=>{s.preventDefault();let l=a.email.value.trim().toLowerCase(),i=a.pass.value;if(_a=l,it="",!l||!i)return De("Preencha o e-mail e a senha.");let n=a.querySelector("[data-go]");n.disabled=!0,n.textContent="Entrando\u2026";try{await Promise.race([Q.signIn(l,i),new Promise((m,d)=>setTimeout(()=>d({code:"timeout"}),2e4))]),n.textContent="Abrindo\u2026"}catch(m){let d=m&&m.code;De(d==="timeout"?"O servidor demorou para responder. Verifique a internet e tente de novo.":wa[d]||`N\xE3o foi poss\xEDvel entrar (${d||m?.message||"erro desconhecido"}).`)}},O.querySelector("[data-reset]").onclick=async()=>{let s=a.email.value.trim().toLowerCase();if(!s)return v("Digite seu e-mail primeiro");try{await Q.resetPassword(s),v("Enviamos um e-mail para criar uma nova senha (veja tamb\xE9m o spam)",{ms:6e3})}catch(l){v(wa[l?.code]||"N\xE3o foi poss\xEDvel enviar o e-mail")}}}function ka(e){document.querySelector("[data-login]")||document.getElementById("view")||(O.innerHTML=`<div class="splash">
    <img src="icons/icon-192.png" alt="" width="72" height="72">
    <h2>N\xE3o consegui conectar</h2>
    <p>Verifique a internet e tente de novo.</p>
    <button class="btn btn--primary" data-retry>Tentar de novo</button>
    <small class="muted">Detalhe: ${f(String(e&&(e.code||e.message)||e))}</small>
  </div>`,O.querySelector("[data-retry]").onclick=()=>location.reload())}function st(e="Carregando\u2026"){O.innerHTML=`<div class="splash"><img src="icons/icon-192.png" alt="" width="72" height="72"><p>${f(e)}</p></div>`}function Sa(){Za(),D(),o.on(eo),o.onError=e=>{let t=e&&/quota/i.test(String(e.name||e.message)),a=e&&/permission/i.test(String(e.code||e.message));v(t?"Mem\xF3ria do aparelho cheia: use logos menores ou ative a nuvem":a?"Sem permiss\xE3o na nuvem: confira as regras do Firebase":"N\xE3o foi poss\xEDvel salvar. Verifique a conex\xE3o.",{ms:5e3})},xa(),o.on(xa),o.on(()=>Ve(o.me?o.eventsOn(w(),{person:o.me}).filter(e=>e.status!=="feito").length:0)),setInterval(()=>{let e=document.activeElement,t=e&&/INPUT|TEXTAREA|SELECT/.test(e.tagName);h.tab==="hoje"&&!Be().length&&!t&&D(),ya()},6e4),ya(),document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&(h.date<w()&&h.tab==="hoje"&&(h.date=w()),D())}),o.mode==="cloud"&&L()&&(o.hooks.eventChange=fa,o.hooks.activity=ha,o.hooks.ask=async(e,t)=>{let a=new Date,s=$a({events:o.state.events,companies:o.state.companies,routine:N(),notes:o.state.notes,team:o.team,me:o.me,now:{date:w(),minutes:a.getHours()*60+a.getMinutes()}});return(await Y("/ask",{question:e,history:t,context:s})).answer},o.on(oe),oe(),setInterval(oe,15*6e4)),oa().then(()=>setTimeout(()=>na().catch(e=>console.warn("rotina",e)),1500)).catch(e=>console.warn("pr\xE9-cadastro",e)),setTimeout(Kt,600),o.mode==="cloud"&&z()==="granted"&&_e().catch(()=>{}),setTimeout(()=>rt(),300)}var nt=null;function xa(){if(!o.me)return;let e=It(o.me,14),t=s=>s.date+":"+s.ids.slice().sort().join("|"),a=new Set(e.map(t));if(nt){let s=e.find(l=>!nt.has(t(l))&&l.ids.some(i=>o.event(i)?.updatedBy&&o.event(i).updatedBy!==o.me));s&&v(`Aten\xE7\xE3o: ${s.title} (${s.date.slice(8)}/${s.date.slice(5,7)})`,{action:"Ver",onAction:()=>{h.date=s.date,h.person="all",pe("hoje")},ms:7e3})}nt=a}async function oo(){let e=location.hash||"",t=A.firebase;if(e.startsWith("#/c/")||e.startsWith("#/v/")){st("Carregando cronograma\u2026");let i=!!(localStorage.getItem("pauta.me")||localStorage.getItem("cal.team"));try{if(e.startsWith("#/v/")){let d=await _t(e.slice(4));return Fe(O,Ne(d),{canGoBack:i})}if(!t)return $e(O,"Este link precisa da sincroniza\xE7\xE3o na nuvem ativada.");let{fetchPublic:n}=await import("./c-43VYY7Q5.js"),m=await n(t,e.slice(4));return m?Fe(O,Ne(m),{canGoBack:i}):$e(O,"Este link n\xE3o existe mais. Pe\xE7a um novo link para a equipe.")}catch(n){return console.error(n),$e(O,"N\xE3o foi poss\xEDvel abrir o cronograma. Verifique a conex\xE3o e tente novamente.")}}if(!t)return await xt(),Sa();st("Conectando \xE0 nuvem\u2026");let a=(i,n)=>Promise.race([i,new Promise((m,d)=>setTimeout(()=>d(new Error("tempo esgotado")),n))]);try{let{connect:i}=await import("./c-43VYY7Q5.js");Q=await a(i(t),15e3)}catch(i){return console.error(i),ka(i)}let s=!1,l=!1;setTimeout(()=>{s||ka(new Error("o login n\xE3o respondeu"))},25e3),Q.onUser(async i=>{if(s=!0,!i)return l?location.reload():De();if(l)return;if(!A.team.some(m=>m.email&&m.email.toLowerCase()===(i.email||"").toLowerCase()))return it=`O e-mail ${i.email} n\xE3o faz parte da equipe deste app.`,await Q.signOut(),De();l=!0;try{localStorage.setItem("cal.team","1")}catch{}st("Entrando\u2026");try{await Promise.race([Et(Q.backend,i),new Promise(m=>setTimeout(m,12e3))])}catch(m){console.error(m),setTimeout(()=>v("N\xE3o consegui carregar os dados agora. Verifique a internet.",{ms:6e3}),800)}Sa()})}navigator.serviceWorker?.addEventListener("message",e=>{if(e.data?.type==="open"&&e.data.url){let t=e.data.url.split("#")[1];t&&rt("#"+t)}});window.addEventListener("hashchange",()=>{if(/^#\/(e|d)\//.test(location.hash))return rt();/^#\/(c|v)\//.test(location.hash)&&location.reload()});"serviceWorker"in navigator&&location.protocol!=="file:"&&navigator.serviceWorker.register("sw.js").catch(()=>{});oo();
