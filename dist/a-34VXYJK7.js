import{A as Ue,C as It,D as Lt,E as Ge,a as xt,b as s,c as Tt,d as jt,e as h,f as Be,g as M,h as Ct,i as He,j as Fe,k as Ve,l as Dt,m as ze,n as Mt,o as v,p as de,q as qt,r as P,s as W,t as q,u as Nt,v as ae,w as Ot,x as me,y as Pt,z as ve}from"./c-EJYUXBR7.js";import{f as Re}from"./c-4OPZHBQG.js";import{a as Ke,b as ye}from"./c-QNJTKFWY.js";import{A as f,C as kt,E as St,G as te,H as p,a as ut,b as K,c as _,d as k,e as ft,f as re,g as Ie,h as ht,i as j,j as fe,k as F,l as x,m as gt,n as ee,o as bt,p as he,q as ce,r as $t,s as vt,t as yt,u as ge,v as G,w as wt,x as _t,y as be}from"./c-SIJUFJQD.js";import{a as T,b as Et,c as le,d as $e,l as Le,m as At}from"./c-3GA6RSWB.js";import{a as A}from"./c-W6W2IM5K.js";import"./c-VHNSBD2M.js";var Ta=(e,a)=>e&&a&&e[0]<a[1]&&a[0]<e[1],Y=e=>s.member(e)?.name||e,we=e=>["shoot","meeting"].includes(T[e.type]?.kind);function _e(e,a){let t=[],o=P(),l=s.eventsOn(a,{person:e}).filter(n=>n.time&&n.status!=="feito");for(let n=0;n<l.length;n++)for(let m=n+1;m<l.length;m++){let d=l[n],r=l[m];if(!Ta(W(d),W(r)))continue;let c=we(d)?d:we(r)?r:null,u=c===d?r:d,b,y;c&&le(u.type)?(b=`${Y(e)}: post durante ${T[c.type].label.toLowerCase()}`,y=`\u201C${q(u)}\u201D \xE0s ${x(u.time)} cai no meio de \u201C${q(c)}\u201D (${x(c.time)}\u2013${x(fe(W(c)[1]))}).`):c&&we(u)?(b=`${Y(e)} em dois lugares ao mesmo tempo`,y=`\u201C${q(d)}\u201D (${x(d.time)}) e \u201C${q(r)}\u201D (${x(r.time)}) se sobrep\xF5em.`):(b=`${Y(e)}: duas tarefas no mesmo hor\xE1rio`,y=`\u201C${q(d)}\u201D (${x(d.time)}) e \u201C${q(r)}\u201D (${x(r.time)}).`),t.push({level:"warn",kind:"conflict",icon:"alert",ids:[d.id,r.id],title:b,text:y,fixes:Ot(e,d,r)})}let i=l.filter(we);for(let n=0;n<i.length-1;n++){let m=i[n],d=i[n+1],r=j(d.time)-W(m)[1];(m.location||m.companyId)!==(d.location||d.companyId)&&r>=0&&r<o.travelMin&&t.push({level:"warn",kind:"conflict",icon:"route",ids:[m.id,d.id],title:`${Y(e)}: pouco tempo de deslocamento`,text:`S\xF3 ${r} min entre \u201C${q(m)}\u201D e \u201C${q(d)}\u201D, em lugares diferentes (combinado: ${o.travelMin} min).`,fixes:[{label:`Mover para ${x(fe(W(m)[1]+o.travelMin))}`,eventId:d.id,patch:{time:fe(Math.ceil((W(m)[1]+o.travelMin)/15)*15)}}]})}return t}function Rt(e,a="all"){let t=[],o=a==="all"?s.team.map(r=>r.id):[a];o.forEach(r=>t.push(..._e(r,e)));let l=P(),i=s.eventsOn(e,{person:a}),n={};if(i.filter(r=>r.time&&["feed","reels","carrossel"].includes(r.type)).forEach(r=>(n[r.companyId]||=[]).push(r)),Object.values(n).forEach(r=>{for(let c=0;c<r.length-1;c++){let u=j(r[c+1].time)-j(r[c].time);u<180&&t.push({level:"info",icon:"clock",ids:[r[c].id,r[c+1].id],title:`${s.company(r[c].companyId)?.name||"Empresa"}: posts muito pr\xF3ximos`,text:`Dois posts de feed/Reels com s\xF3 ${G(u)} de diferen\xE7a. Espacem ao menos 3 h para um n\xE3o \u201Croubar\u201D o alcance do outro.`})}}),e===_()){let r=i.filter(c=>c.time&&c.status==="pendente"&&j(c.time)+15<F());r.length&&t.unshift({level:"warn",kind:"late",icon:"flag",ids:r.map(c=>c.id),title:r.length===1?"1 tarefa atrasada":`${r.length} tarefas atrasadas`,text:r.map(c=>`${x(c.time)} ${q(c)}`).join(" \xB7 ")+". Marque como feito ou reagende."})}let m=i.filter(r=>!(r.assignees||[]).length);if(m.length&&a==="all"&&t.push({level:"warn",icon:"user",ids:m.map(r=>r.id),title:"Tarefa sem respons\xE1vel",text:m.map(r=>`${x(r.time)} ${q(r)}`).join(" \xB7 ")+". Definam quem vai fazer."}),a==="all"&&s.team.length===2){let[r,c]=s.team,u=s.eventsOn(e,{person:r.id}).length,b=s.eventsOn(e,{person:c.id}).length;if(Math.abs(u-b)>=4){let[y,D]=u>b?[r,c]:[c,r];t.push({level:"info",icon:"users",title:"Dia desequilibrado",text:`${y.name} tem ${Math.max(u,b)} tarefas e ${D.name} tem ${Math.min(u,b)}. Que tal passar alguns stories para o ${D.name}?`})}}o.forEach(r=>{let c=ae(r,e),u=s.eventsOn(e,{person:r}).length;!c.dayOff&&c.minutes!=null&&u&&c.longest<45&&t.push({level:"info",kind:"rest",icon:"clock",title:`${Y(r)} est\xE1 sem pausa`,text:`O maior intervalo livre do dia \xE9 de ${G(c.longest)}. Programem posts com anteced\xEAncia para abrir espa\xE7o.`}),c.dayOff&&u&&t.push({level:"info",kind:"rest",icon:"clock",title:`${Y(r)}: dia de folga`,text:`H\xE1 ${u} tarefa${u>1?"s":""} marcada${u>1?"s":""} na folga. Posts podem ficar programados para ningu\xE9m trabalhar.`}),u>l.maxTasks&&t.push({level:"warn",kind:"rest",icon:"alert",title:`${Y(r)} sobrecarregado`,text:`${u} tarefas (limite combinado: ${l.maxTasks}).`})}),s.eventsOn(k(e,1),{person:a}).filter(r=>r.type==="captacao").forEach(r=>{let c=s.company(r.companyId);t.push({level:"prep",icon:"camera",ids:[r.id],title:`Amanh\xE3: capta\xE7\xE3o${c?" na "+c.name:""} \xE0s ${x(r.time)}`,text:"Hoje: carregue baterias, esvazie cart\xF5es de mem\xF3ria, confirme o hor\xE1rio com o cliente e defina o roteiro de tomadas."})}),!t.some(r=>r.kind==="conflict")&&i.length&&t.push({level:"ok",icon:"check",title:"Agenda sem conflitos",text:"Ningu\xE9m est\xE1 em dois lugares ao mesmo tempo."});let d=Math.abs(ht("2024-01-01",e))%Le.length;return t.push({level:"tip",icon:"bulb",title:"Dica do dia",text:Le[d]}),t}function Bt(e,a=14){let t=[],o=_();for(let l=0;l<a;l++){let i=k(o,l);_e(e,i).forEach(n=>t.push({...n,date:i}))}return t}function Ht(e="all"){let a=_(),t=F();return s.eventsOn(a,{person:e}).find(o=>o.time&&o.status!=="feito"&&j(o.time)+$e(o)>t)||null}function Ft(){return`<div class="seg" role="tablist">
    ${[{id:"all",name:"Todos"},...s.team].map(a=>`<button class="seg__btn${h.person===a.id?" is-on":""}" data-action="set-person" data-p="${a.id}">
      ${a.id==="all"?p("users",15):M(a.id,18)}<span>${f(a.name)}${s.me===a.id?"<em> (voc\xEA)</em>":""}</span></button>`).join("")}
  </div>`}function ja(e,a=4){let t=[];return e.forEach(o=>{t.includes(o.companyId)||t.push(o.companyId)}),t.slice(0,a).map(o=>`<i style="background:${s.company(o)?.color||"#999"}"></i>`).join("")}function Vt(){let e=h.date,a=_(),t=s.eventsOn(e,{person:h.person}),o=Rt(e,h.person),l=o.filter($=>$.level==="warn"&&$.icon!=="flag").flatMap($=>$.ids||[]),i=s.member(s.me),n=ft(e),m=Array.from({length:7},($,E)=>k(n,E)),d=(()=>{let $=K(m[0]),E=K(m[6]);return $.getMonth()===E.getMonth()?`${$.getDate()}\u2013${E.getDate()} de ${he[E.getMonth()]}`:`${$.getDate()} ${he[$.getMonth()]} \u2013 ${E.getDate()} ${he[E.getMonth()]}`})(),r=`
  <header class="hdr">
    <div class="hdr__row">
      <div class="hdr__titles">
        <p class="hdr__eyebrow">${e===a?`${_t()}${i?", "+f(i.name):""}`:f(ce(e))}</p>
        <h1>${f(yt(e))}${e===a?`<span class="hdr__date">${f($t(e))}</span>`:""}</h1>
      </div>
      <div class="hdr__actions">
        ${e!==a?'<button class="chip chip--accent" data-action="go-today">Hoje</button>':""}
        <button class="iconbtn iconbtn--ai" data-action="assistant" aria-label="Assistente">${p("sparkle",20)}</button>
        <button class="iconbtn" data-action="tab" data-tab="ajustes" aria-label="Perfil">${i?M(i.id,34):p("user",20)}</button>
      </div>
    </div>
    ${Ft()}
    <div class="week">
      <div class="week__bar">
        <button class="iconbtn iconbtn--sm" data-action="week" data-n="-7" aria-label="Semana anterior">${p("left",18)}</button>
        <span>${f(d)}</span>
        <button class="iconbtn iconbtn--sm" data-action="week" data-n="7" aria-label="Pr\xF3xima semana">${p("right",18)}</button>
      </div>
      <div class="week__days" data-swipe="week">
        ${m.map($=>{let E=K($),L=s.eventsOn($,{person:h.person}),S=L.filter(ie=>ie.status!=="feito").length;return`<button class="wday${$===e?" is-sel":""}${$===a?" is-today":""}" data-action="set-date" data-k="${$}">
            <span class="wday__l">${ee[E.getDay()]}</span>
            <span class="wday__n">${E.getDate()}</span>
            <span class="wday__dots">${ja(L,3)}${L.length?"":'<i class="none"></i>'}</span>
            ${S?`<span class="sr">${S} pendentes</span>`:""}
          </button>`}).join("")}
      </div>
    </div>
  </header>`,c={};t.forEach($=>c[$.type]=(c[$.type]||0)+1);let u=t.filter($=>$.status==="feito").length,b=t.length?Math.round(u/t.length*100):0,y=t.length?`<div class="summary">
        <div class="summary__progress">
          <div class="ring" style="--p:${b}"><span>${b}%</span></div>
          <div><strong>${u} de ${t.length}</strong><small>tarefas conclu\xEDdas</small></div>
        </div>
        <div class="summary__types">
          ${Object.entries(c).sort(($,E)=>E[1]-$[1]).map(([$,E])=>`<span class="tcount tbadge--${$}">${p(T[$].icon,13)}<b>${E}</b> ${T[$].label}</span>`).join("")}
        </div>
      </div>`:"",D=h.person==="all"?`<section class="block">
      <h2 class="block__title">${p("route",16)} Onde cada um vai estar</h2>
      <div class="team">${s.team.map($=>Ca($,e)).join("")}</div>
    </section>`:"",g="";if(e===a){let $=Ht(h.person);if($){let E=s.company($.companyId),L=j($.time)-F(),S=E?.color||"#555";g=`<button class="next" style="--cc:${S};--cc-soft:${kt(S,.12)}" data-action="open-event" data-id="${$.id}">
        <div class="next__label">${p("bell",14)} ${L>0?"Pr\xF3ximo \xB7 "+wt(L):"Acontecendo agora"}</div>
        <div class="next__row">
          ${He(E,44)}
          <div class="next__txt">
            <strong>${x($.time)} \xB7 ${f(T[$.type].label)} \xB7 ${f(E?.name||"")}</strong>
            <span>${f($.title||"")}</span>
          </div>
          ${Ct($.assignees,26)}
        </div>
        ${$.location?`<div class="next__loc">${p("pin",13)} ${f($.location)}</div>`:""}
      </button>`}}let I=h.showAllTips?o:o.filter(($,E)=>$.level==="warn"||E<2),w=o.length-I.length,ne=`<section class="block">
    <h2 class="block__title">${p("bulb",16)} Dicas e alertas</h2>
    <div class="tips">${I.map(Da).join("")}</div>
    ${w>0?`<button class="btn-text btn-text--sm" data-action="toggle-tips">Ver mais ${w} dica${w>1?"s":""}</button>`:h.showAllTips&&o.length>2?'<button class="btn-text btn-text--sm" data-action="toggle-tips">Mostrar menos</button>':""}
  </section>`,H;if(!t.length)H=Ve("Dia livre",h.person==="all"?"Nada agendado para este dia.":`Nada agendado para ${s.member(h.person)?.name}.`,`<button class="btn btn--primary" data-action="new-event" data-date="${e}">${p("plus",18)} Adicionar</button>`);else{let $=[{k:"Manh\xE3",icon:"sun",items:t.filter(S=>S.time&&j(S.time)<720)},{k:"Tarde",items:t.filter(S=>S.time&&j(S.time)>=720&&j(S.time)<1080)},{k:"Noite",items:t.filter(S=>S.time&&j(S.time)>=1080)},{k:"Sem hor\xE1rio",items:t.filter(S=>!S.time)}],E=F(),L=e!==a;H=$.filter(S=>S.items.length).map(S=>`
      <div class="tl-group">
        <h3 class="tl-group__h">${S.k}<span>${S.items.length}</span></h3>
        ${S.items.map(ie=>{let pt="";return!L&&ie.time&&j(ie.time)>E&&(L=!0,pt=`<div class="nowline"><span>Agora \xB7 ${x(`${String(new Date().getHours()).padStart(2,"0")}:${String(new Date().getMinutes()).padStart(2,"0")}`)}</span></div>`),pt+Fe(ie,{highlight:l})}).join("")}
      </div>`).join(""),!L&&e===a&&(H+=`<div class="nowline nowline--end"><span>Agora \xB7 ${x(`${String(new Date().getHours()).padStart(2,"0")}:${String(new Date().getMinutes()).padStart(2,"0")}`)} \xB7 fim da agenda</span></div>`)}let Oe=s.notesOn(e),Pe=`<section class="block">
    <h2 class="block__title">${p("note",16)} Bilhetes do dia</h2>
    <div class="notes">
      ${Oe.map($=>`<div class="note">
        <p>${f($.text)}</p>
        <footer>${M($.author,18)}<span>${f(s.member($.author)?.name||"")}</span>
          <button class="note__del" data-action="del-note" data-id="${$.id}" aria-label="Apagar bilhete">${p("x",14)}</button></footer>
      </div>`).join("")}
      <form class="note-add" data-form="note">
        <input name="text" placeholder="Escreva um bilhete para a dupla\u2026" autocomplete="off" maxlength="280">
        <button class="iconbtn iconbtn--accent" aria-label="Adicionar bilhete">${p("plus",18)}</button>
      </form>
    </div>
  </section>`;return`${r}
  <div class="page">
    ${s.demo?Ma():""}
    ${g}
    <button class="brief" data-action="assistant">
      <span class="brief__ic">${p("sparkle",18)}</span>
      <div><strong>Assistente</strong>${me(e,h.person).map($=>`<p>${f($)}</p>`).join("")}</div>
      ${p("right",18,"muted")}
    </button>
    ${D}
    <section class="block">
      <h2 class="block__title">${p("clock",16)} Agenda ${h.person==="all"?"da dupla":"de "+f(s.member(h.person)?.name||"")}</h2>
      ${y}
      ${H}
    </section>
    ${ne}
    ${Pe}
  </div>`}function Ca(e,a){let t=s.eventsOn(a,{person:e.id}),o=a===_()?F():-1,l=t.filter(r=>["shoot","meeting"].includes(T[r.type]?.kind)),i=t.filter(r=>le(r.type)).length,n=t.find(r=>r.time&&r.status!=="feito"&&j(r.time)+$e(r)>o),m=ae(e.id,a),d=m.dayOff?"Folga":`${G(Math.round(m.minutes/15)*15)||"0 min"} livres`;return`<button class="team__col" data-action="set-person" data-p="${e.id}">
    <span class="team__free ${m.dayOff?"is-off":m.minutes>=240?"is-good":m.minutes>=120?"is-mid":"is-low"}">${p("clock",12)} ${d}</span>
    <div class="team__head">${M(e.id,30)}<div><strong>${f(e.name)}</strong><small>${t.length} tarefa${t.length===1?"":"s"} \xB7 ${i} post${i===1?"":"s"}</small></div></div>
    <ul class="team__where">
      ${l.length?l.map(r=>`<li>${p(T[r.type].icon,13)}<span><b>${x(r.time)}</b> ${f(s.company(r.companyId)?.name||"")}</span></li>`).join(""):`<li class="muted">${p("building",13)}<span>Trabalho interno / remoto</span></li>`}
    </ul>
    ${n?`<div class="team__next">Pr\xF3ximo: <b>${x(n.time)}</b> ${f(T[n.type].label)} \xB7 ${f(s.company(n.companyId)?.name||"")}</div>`:`<div class="team__next muted">${t.length?"Tudo conclu\xEDdo \u2713":"Livre"}</div>`}
  </button>`}function Da(e){let a=e.fixes?.length?`<div class="fixes">${e.fixes.map(t=>`<button class="fixbtn" data-action="apply-fix" data-id="${t.eventId}" data-patch="${f(JSON.stringify(t.patch))}">${p("check",13)} ${f(t.label)}</button>`).join("")}</div>`:"";return`<div class="tip tip--${e.level}"${e.ids?.length===1&&!a?` data-action="open-event" data-id="${e.ids[0]}"`:""}>
    <span class="tip__ic">${p(e.icon,16)}</span>
    <div><strong>${f(e.title)}</strong><p>${f(e.text)}</p>${a}</div>
  </div>`}function Ma(){return`<div class="banner">
    ${p("sparkle",18)}
    <p><strong>Voc\xEA est\xE1 vendo dados de exemplo.</strong> Explore \xE0 vontade e, quando quiser come\xE7ar de verdade, apague os exemplos.</p>
    <button class="btn btn--soft btn--sm" data-action="clear-demo">Apagar exemplos</button>
  </div>`}function zt(){let e=h.month,[a,t]=e.split("-").map(Number),o=new Date(a,t-1,1),l=k(ut(o),-o.getDay()),i=_(),n=Array.from({length:42},(w,ne)=>k(l,ne)),d=n.slice(35).some(w=>w.slice(0,7)===e)?n:n.slice(0,35),r={person:h.person,companyId:h.monthCompany},c=s.companiesSorted(),u=h.monthSel,b=s.eventsOn(u,r),y=s.eventsBetween(`${e}-01`,`${e}-31`,r),D=y.filter(w=>le(w.type)).length,g=y.filter(w=>w.type==="captacao").length,I=y.filter(w=>w.type==="reuniao").length;return`
  <header class="hdr">
    <div class="hdr__row">
      <div class="hdr__titles">
        <p class="hdr__eyebrow">Calend\xE1rio</p>
        <h1>${f(vt(e).split(" ")[0])}<span class="hdr__date">${e.slice(0,4)}</span></h1>
      </div>
      <div class="hdr__actions">
        <button class="iconbtn" data-action="month" data-n="-1" aria-label="M\xEAs anterior">${p("left",20)}</button>
        <button class="chip" data-action="month-today">Hoje</button>
        <button class="iconbtn" data-action="month" data-n="1" aria-label="Pr\xF3ximo m\xEAs">${p("right",20)}</button>
      </div>
    </div>
    ${Ft()}
  </header>
  <div class="page">
    <div class="chips-scroll">
      <button class="chip${h.monthCompany?"":" is-on"}" data-action="month-company" data-id="">Todas as empresas</button>
      ${c.map(w=>`<button class="chip chip--co${h.monthCompany===w.id?" is-on":""}" style="--cc:${w.color}" data-action="month-company" data-id="${w.id}">${He(w,18,5)}${f(w.name)}</button>`).join("")}
    </div>

    <div class="mstats">
      <div><b>${D}</b><span>posts</span></div>
      <div><b>${g}</b><span>capta\xE7\xF5es</span></div>
      <div><b>${I}</b><span>reuni\xF5es</span></div>
      <div><b>${y.filter(w=>w.status==="feito").length}/${y.length}</b><span>conclu\xEDdos</span></div>
    </div>

    <div class="month" data-swipe="month">
      <div class="month__wd">${bt.map(w=>`<span>${w}</span>`).join("")}</div>
      <div class="month__grid">
        ${d.map(w=>{let ne=w.slice(0,7)===e,H=s.eventsOn(w,r),Oe=H.some(Pe=>Pe.type==="captacao");return`<button class="mday${ne?"":" is-out"}${w===i?" is-today":""}${w===u?" is-sel":""}" data-action="month-select" data-k="${w}">
            <span class="mday__n">${Number(w.slice(8))}</span>
            ${H.length?`<span class="mday__bars">${qa(H)}</span><span class="mday__count">${Oe?p("camera",10):""}${H.length}</span>`:""}
          </button>`}).join("")}
      </div>
    </div>

    <section class="block">
      <div class="block__row">
        <h2 class="block__title">${f(ge(u))}</h2>
        <button class="btn-text btn-text--sm" data-action="open-day" data-k="${u}">Abrir dia ${p("right",14)}</button>
      </div>
      ${b.length?b.map(w=>Fe(w)).join(""):Ve("Nada neste dia","Toque no + para agendar.",`<button class="btn btn--soft" data-action="new-event" data-date="${u}">${p("plus",16)} Novo evento</button>`)}
    </section>

    ${c.length?`<section class="block">
      <h2 class="block__title">Legenda</h2>
      <div class="legend">${c.map(w=>`<span><i style="background:${w.color}"></i>${f(w.name)}</span>`).join("")}</div>
    </section>`:""}
  </div>`}function qa(e){let a={};return e.forEach(t=>a[t.companyId]=(a[t.companyId]||0)+1),Object.entries(a).slice(0,4).map(([t])=>`<i style="background:${s.company(t)?.color||"#999"}"></i>`).join("")}var Kt="pauta.device",Gt="pauta.notifyPrefs",R=()=>{try{if(["localhost","127.0.0.1"].includes(location.hostname)&&localStorage.getItem("cal.pushServer"))return localStorage.getItem("cal.pushServer")}catch{}return(A.pushServer||"").replace(/\/+$/,"")},Na=()=>/iPhone|iPad|iPod/.test(navigator.userAgent)||navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1,Oa=()=>"serviceWorker"in navigator&&"PushManager"in window&&"Notification"in window,V=()=>"Notification"in window?Notification.permission:"unsupported",pe=()=>Na()&&!te(),We=()=>{try{return{reminders:!0,partner:!0,daily:!0,...JSON.parse(localStorage.getItem(Gt)||"{}")}}catch{return{reminders:!0,partner:!0,daily:!0}}},Ut=e=>{let a="=".repeat((4-e.length%4)%4),t=atob((e+a).replace(/-/g,"+").replace(/_/g,"/"));return Uint8Array.from(t,o=>o.charCodeAt(0))},Pa=async e=>{let a=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(e));return"d_"+Array.from(new Uint8Array(a).slice(0,16),t=>t.toString(16).padStart(2,"0")).join("")};async function J(e,a){if(!R())throw Object.assign(new Error("Servidor de avisos n\xE3o configurado."),{code:"no-server"});let t=await s.idToken();if(!t)throw Object.assign(new Error("Fa\xE7a login para usar."),{code:"no-login"});let o=await fetch(R()+e,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify(a||{})}),l=await o.json().catch(()=>({}));if(!o.ok)throw Object.assign(new Error(l.error||`Erro ${o.status}`),{status:o.status});return l}async function ke(){return pe()?{ok:!1,reason:"install"}:Oa()?await Notification.requestPermission()!=="granted"?{ok:!1,reason:"denied"}:s.mode!=="cloud"||!R()?{ok:!0,local:!0}:Se():{ok:!1,reason:"unsupported"}}async function Se(){if(s.mode!=="cloud"||!R()||V()!=="granted"||!s.me)return{ok:!1,reason:"not-ready"};let e;try{e=(await(await fetch(R()+"/vapid")).json()).publicKey}catch{return{ok:!1,reason:"server"}}if(!e)return{ok:!1,reason:"server"};let a=await navigator.serviceWorker.ready,t=await a.pushManager.getSubscription();if(t&&t.options?.applicationServerKey){let i=new Uint8Array(t.options.applicationServerKey),n=Ut(e);(i.length!==n.length||i.some((m,d)=>m!==n[d]))&&(await t.unsubscribe(),t=null)}t||(t=await a.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:Ut(e)}));let o=t.toJSON(),l=await Pa(o.endpoint);return await J("/subscribe",{id:l,subscription:{endpoint:o.endpoint,keys:o.keys},prefs:We()}),localStorage.setItem(Kt,l),{ok:!0,id:l}}async function Wt(e){localStorage.setItem(Gt,JSON.stringify(e)),s.mode==="cloud"&&V()==="granted"&&await Se().catch(()=>{})}async function xe(){return s.mode==="cloud"&&R()?localStorage.getItem(Kt)?{kind:"server",...await J("/test")}:{kind:"not-registered"}:(await(await navigator.serviceWorker.ready).showNotification("Notifica\xE7\xF5es ativadas \u2713",{body:"\xC9 assim que os lembretes v\xE3o chegar.",icon:"icons/icon-192.png",badge:"icons/icon-192.png",tag:"teste"}),{kind:"local"})}function Ye(e){try{if(!("setAppBadge"in navigator))return;e>0?navigator.setAppBadge(e).catch(()=>{}):navigator.clearAppBadge().catch(()=>{})}catch{}}var Ze="pauta.onboarded",Ee="pauta.notifyAskedAt";function Yt(){if(!localStorage.getItem(Ze))return Xe(s.me?["welcome","notify","done"]:["welcome","who","notify","done"]);if(!s.me&&s.mode==="local")return Xe(["who"]);let a=Number(localStorage.getItem(Ee)||0);if(te()&&V()==="default"&&Date.now()-a>3*864e5)return Xe(["notify"])}function Qe(e,a,t="agora"){return`<div class="nprev">
    <img src="icons/icon-192.png" alt="">
    <div><div class="nprev__top"><b>${f(A.appName.toUpperCase())}</b><span>${f(t)}</span></div>
    <strong>${f(e)}</strong><p>${f(a)}</p></div>
  </div>`}function Ia(e,a,t){let o=s.member(s.me),l=s.team.find(n=>n.id!==s.me)||s.team[1]||s.team[0],i=t>1?`<div class="ob__dots">${Array.from({length:t},(n,m)=>`<i class="${m===a?"is-on":""}"></i>`).join("")}</div>`:"";return e==="welcome"?`<div class="ob__art"><img class="ob__icon" src="icons/icon-512.png" alt=""></div>
      <h1>Bem-vindo ao ${f(A.appName)}</h1>
      <p>A agenda de conte\xFAdo de ${f(A.agencyName)}: posts, stories, reels e capta\xE7\xF5es de todas as empresas, num lugar s\xF3.</p>
      ${i}
      <button class="btn btn--primary btn--block" data-next>Come\xE7ar</button>`:e==="who"?`<div class="ob__art ob__art--sm">${p("user",34)}</div>
      <h1>Quem vai usar este celular?</h1>
      <p>Assim o app sabe de quem s\xE3o os lembretes e avisa o parceiro quando voc\xEA marcar algo.</p>
      <div class="whogrid ob__who">${s.team.map(n=>`<button class="whobtn${s.me===n.id?" is-on":""}" style="--mc:${n.color}" data-me="${n.id}">${M(n.id,36)}<span>${f(n.name)}</span><i class="whobtn__check">${p("check",14)}</i></button>`).join("")}</div>
      ${i}
      <button class="btn btn--primary btn--block" data-next ${s.me?"":"disabled"}>Continuar</button>`:e==="notify"?`<div class="ob__previews">
        ${Qe("Daqui a 2h: Reels \xB7 Pura Vida","18h \u2014 postar o Reels \u201CBastidores\u201D","agora")}
        ${Qe(`${l?.name||"Seu parceiro"} marcou para voc\xEA`,"Story \xB7 Caf\xE9 Aroma \u2014 amanh\xE3, 16h","h\xE1 2 min")}
        ${Qe(`Bom dia, ${o?.name||"Henrique"}! Seu dia hoje`,"5 tarefas \xB7 primeira: 11h30 Feed \xB7 Studio Fit","8:00")}
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
    <button class="btn btn--primary btn--block" data-next>Abrir a agenda</button>`}function Xe(e){if(document.querySelector(".ob"))return;let a=0,t=document.createElement("div");t.className="ob",t.innerHTML='<div class="ob__card"></div>',document.body.appendChild(t),requestAnimationFrame(()=>t.classList.add("is-in"));let o=t.querySelector(".ob__card"),l=()=>{(e.includes("welcome")||e.includes("done"))&&localStorage.setItem(Ze,"1"),t.classList.remove("is-in"),setTimeout(()=>t.remove(),400)},i=d=>{if(d>=e.length)return l();a=d,o.classList.remove("is-shown"),setTimeout(()=>{o.innerHTML=Ia(e[a],a,e.length),m(),o.classList.add("is-shown")},o.innerHTML?180:0)},n=(d,r="info")=>{let c=o.querySelector("[data-notify-msg]");c&&(c.innerHTML=`<div class="ob__msg ob__msg--${r}">${d}</div>`)},m=()=>{o.querySelectorAll("[data-next]").forEach(c=>c.onclick=()=>i(a+1)),o.querySelectorAll("[data-me]").forEach(c=>c.onclick=()=>{s.setMe(c.dataset.me),o.querySelectorAll("[data-me]").forEach(u=>u.classList.toggle("is-on",u===c)),o.querySelector("[data-next]").disabled=!1});let d=o.querySelector("[data-skip]");d&&(d.onclick=()=>{localStorage.setItem(Ee,String(Date.now())),i(a+1)});let r=o.querySelector("[data-enable]");r&&(r.onclick=async()=>{if(localStorage.setItem(Ee,String(Date.now())),pe()){n(`<b>Primeiro instale o app.</b> No iPhone, as notifica\xE7\xF5es s\xF3 funcionam pelo \xEDcone da Tela de In\xEDcio:<br>
          1. Toque em ${p("share",14)} <b>Compartilhar</b><br>2. <b>Adicionar \xE0 Tela de In\xEDcio</b><br>3. Abra o ${f(A.appName)} pelo \xEDcone`,"warn"),r.outerHTML='<button class="btn btn--primary btn--block" data-next>Entendi</button>',m();return}r.disabled=!0,r.innerHTML="Aguardando permiss\xE3o\u2026";let c=await ke().catch(()=>({ok:!1,reason:"error"}));c.ok?(c.local?n("Ativado neste celular. Para os avisos chegarem com o app fechado e no celular do parceiro, falta ligar o servidor de notifica\xE7\xF5es (Ajustes \u2192 Notifica\xE7\xF5es).","ok"):(n("Pronto! Voc\xEA vai receber uma notifica\xE7\xE3o de teste em instantes.","ok"),xe().catch(()=>{})),r.outerHTML='<button class="btn btn--primary btn--block" data-next>Continuar</button>',o.querySelector("[data-skip]")?.remove(),m()):c.reason==="server"?(n("Permiss\xE3o concedida! O servidor de notifica\xE7\xF5es ainda n\xE3o foi publicado; quando for, este celular \xE9 cadastrado sozinho.","ok"),r.outerHTML='<button class="btn btn--primary btn--block" data-next>Continuar</button>',m()):c.reason==="denied"?(n(`As notifica\xE7\xF5es foram bloqueadas. Para ligar depois: <b>Ajustes do iPhone \u2192 Notifica\xE7\xF5es \u2192 ${f(A.appName)}</b>.`,"warn"),r.outerHTML='<button class="btn btn--primary btn--block" data-next>Continuar</button>',m()):(n("Este aparelho n\xE3o aceita notifica\xE7\xF5es deste app.","warn"),r.disabled=!1,r.innerHTML="Tentar de novo")})};i(0)}function Jt(){localStorage.removeItem(Ze),localStorage.removeItem(Ee),v("A apresenta\xE7\xE3o aparece na pr\xF3xima abertura")}function Qt(){let e=s.member(s.me),a=s.mode==="cloud",t="Notification"in window&&Notification.permission==="granted";return`
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

    ${Ra()}

    <section class="block">
      <h2 class="block__title">${p("sparkle",16)} Assistente e Claude</h2>
      <div class="card card--row">
        ${p("sparkle",22)}
        <div><strong>Assistente autom\xE1tico ativo</strong><small>Confere conflitos, tempo livre e melhores hor\xE1rios sozinho, sem internet e sem chave.</small></div>
        <button class="btn btn--soft btn--sm" data-action="assistant">Abrir</button>
      </div>
      <p class="fhelp">Para perguntas abertas (ideias, reorganizar a semana), use \u201CPerguntar ao Claude\u201D no Assistente. Abre o Claude com o seu login normal, sem chave de API.</p>
    </section>

    ${La()}

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

    ${te()?"":`<section class="block">
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
          ${At.map(o=>`<li><span class="tbadge tbadge--${o.type}">${p(T[o.type].icon,13)}${T[o.type].label}</span><span>${f(o.text)}</span></li>`).join("")}
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
  </div>`}function La(){let e=V(),a=pe(),t=s.mode==="cloud",o=!!localStorage.getItem("pauta.device"),l=We(),i,n,m="";return a?(i="warn",n="No iPhone, as notifica\xE7\xF5es s\xF3 funcionam com o app instalado: Compartilhar \u2192 Adicionar \xE0 Tela de In\xEDcio, e abra pelo \xEDcone."):e==="unsupported"?(i="warn",n="Este navegador n\xE3o aceita notifica\xE7\xF5es."):e==="denied"?(i="warn",n=`Bloqueadas. Para ligar: Ajustes do iPhone \u2192 Notifica\xE7\xF5es \u2192 ${A.appName}.`):e!=="granted"?(i="warn",n="Desativadas neste celular.",m='<button class="btn btn--primary btn--sm" data-action="notify-enable">Ativar</button>'):t&&o?(i="ok",n="Ativadas. Os lembretes e os avisos do parceiro chegam mesmo com o app fechado.",m='<button class="btn btn--soft btn--sm" data-action="notify-enable">Recadastrar</button>'):t?(i="warn",n="Permiss\xE3o concedida, mas este celular ainda n\xE3o foi cadastrado no servidor. Toque em Cadastrar.",m='<button class="btn btn--primary btn--sm" data-action="notify-enable">Cadastrar</button>'):(i="warn",n="Ativadas s\xF3 com o app aberto. Para receber com o app fechado e no celular do parceiro, ligue a nuvem e o servidor (README)."),`<section class="block">
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
  </section>`}function Ra(){let e=P(),a=[0,15,30,45,60,90];return`<section class="block">
    <h2 class="block__title">${p("clock",16)} Rotina e tempo livre</h2>
    <form class="list" data-routine-form onsubmit="return false">
      <label class="list__row"><span>Expediente</span><input type="time" name="workStart" value="${e.workStart}"> <input type="time" name="workEnd" value="${e.workEnd}"></label>
      <label class="list__row"><span>Almo\xE7o</span><input type="time" name="lunchStart" value="${e.lunchStart}"> <input type="time" name="lunchEnd" value="${e.lunchEnd}"></label>
      <label class="list__row"><span>Deslocamento entre lugares</span><select name="travelMin">${a.map(t=>`<option value="${t}"${e.travelMin===t?" selected":""}>${t?t+" min":"n\xE3o considerar"}</option>`).join("")}</select></label>
      <label class="list__row"><span>M\xE1ximo de tarefas/dia</span><select name="maxTasks">${[4,5,6,7,8,10,12,15,20].map(t=>`<option value="${t}"${e.maxTasks===t?" selected":""}>${t}</option>`).join("")}</select></label>
      <div class="list__row list__row--col"><span>Dias de folga</span>
        <div class="daysoff">${ee.map((t,o)=>`<label class="dayoff"><input type="checkbox" name="off" value="${o}"${e.daysOff.includes(o)?" checked":""}><span>${t}</span></label>`).join("")}</div>
      </div>
    </form>
    <p class="fhelp">O assistente usa isso para n\xE3o marcar nada em cima do almo\xE7o, da folga ou fora do expediente, e para proteger o tempo livre de voc\xEAs.</p>
  </section>`}var B={async notifyEnable(){let e=await ke().catch(a=>({ok:!1,reason:"error",message:a.message}));e.ok?v(e.local?"Ativado (com o app aberto)":"Notifica\xE7\xF5es ativadas"):e.reason==="install"?v("Instale o app na Tela de In\xEDcio primeiro"):e.reason==="denied"?v("Bloqueado: libere em Ajustes do iPhone \u2192 Notifica\xE7\xF5es"):e.reason==="server"?v("Servidor de notifica\xE7\xF5es ainda n\xE3o publicado"):v(`N\xE3o foi poss\xEDvel ativar${e.message?": "+e.message:""}`,{ms:8e3}),s.emit()},async notifyTest(){let e;try{e=await xe()}catch(a){return v(`Falhou: ${a.message}`,{ms:8e3})}if(e.kind==="not-registered")return v('Este celular ainda n\xE3o est\xE1 cadastrado. Toque em "Ativar" acima.',{ms:7e3});if(e.kind==="local")return v("Notifica\xE7\xE3o local mostrada (servidor n\xE3o configurado)");if(e.sent>0)return v("Enviada! Deve chegar em alguns segundos. Bloqueie a tela para ver.",{ms:7e3});if(!e.devices)return v('O servidor n\xE3o tem este celular cadastrado. Toque em "Ativar" de novo.',{ms:7e3});v(`A Apple n\xE3o aceitou o envio (${(e.statuses||[]).join(", ")||"sem resposta"}). Toque em "Ativar" de novo.`,{ms:9e3})},async notifyPrefs(e){await Wt({reminders:e.reminders.checked,partner:e.partner.checked,daily:e.daily.checked}),v("Prefer\xEAncias salvas")},onboardingAgain(){Jt()},async routine(e){let a=(l,i)=>/^\d{2}:\d{2}$/.test(e[l].value)?e[l].value:i,t=P(),o={id:"routine",workStart:a("workStart",t.workStart),workEnd:a("workEnd",t.workEnd),lunchStart:a("lunchStart",t.lunchStart),lunchEnd:a("lunchEnd",t.lunchEnd),travelMin:Number(e.travelMin.value),maxTasks:Number(e.maxTasks.value),daysOff:[...e.querySelectorAll('input[name="off"]:checked')].map(l=>Number(l.value))};if(o.workEnd<=o.workStart)return v("O fim do expediente precisa ser depois do in\xEDcio");if(o.lunchEnd<=o.lunchStart)return v("O fim do almo\xE7o precisa ser depois do in\xEDcio");await s.upsert("settings",o),v("Rotina salva")},async ics(e){let a=e.dataset.who==="me"?s.me:"all";if(e.dataset.who==="me"&&!s.me)return v("Escolha primeiro quem est\xE1 usando este celular");let t=Number(e.dataset.days),o=_(),l=s.eventsBetween(o,k(o,t),{person:a}).filter(n=>n.status!=="feito");if(!l.length)return v("Nada agendado nesse per\xEDodo");let i=a==="all"?`${A.appName} \u2013 Dupla`:`${A.appName} \u2013 ${s.member(a).name}`;await Pt(l,`pauta-${a}-${o}.ics`,i)},export(){let e=new Blob([s.exportData()],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(e),a.download=`pauta-backup-${_()}.json`,document.body.appendChild(a),a.click(),a.remove(),v("Backup exportado")},async import(e){let a=e.files[0];if(a)try{let t=await a.text(),o=await qt({title:"Importar backup",text:"Como deseja importar?",options:[{label:"Juntar com os dados atuais",value:"merge",primary:!0},{label:"Substituir tudo",value:"replace",danger:!0}]});if(!o)return;await s.importData(t,{replace:o==="replace"}),v("Backup importado")}catch{v("Arquivo inv\xE1lido")}finally{e.value=""}},async clearAll(){await de({title:"Apagar TUDO?",text:"Empresas, eventos e bilhetes ser\xE3o apagados. Exporte um backup antes, se precisar.",ok:"Apagar tudo",danger:!0})&&(await s.clearAll(),v("Tudo apagado"))}};var et=[{label:"Organize meu dia",q:"Analise a agenda de hoje e me diga, em ordem, o que fazer e quando. Aponte conflitos e onde d\xE1 para ganhar tempo livre."},{label:"Melhores hor\xE1rios da semana",q:"Sugira os melhores hor\xE1rios para os posts desta semana de cada empresa, sem conflitar com as capta\xE7\xF5es e respeitando o expediente e o almo\xE7o."},{label:"Equilibrar a dupla",q:"A carga de trabalho entre Henrique e Matheus est\xE1 equilibrada nos pr\xF3ximos 7 dias? Sugira trocas concretas de respons\xE1vel."},{label:"Ideias de conte\xFAdo",q:"Para cada empresa, sugira 3 ideias de posts (feed, reels e stories) para a pr\xF3xima semana, com legenda curta."}],Ba=(e=[])=>e.map(a=>s.member(a)?.name).filter(Boolean).join(" e ")||"sem respons\xE1vel";function Ha(e,a=14){let t=P(),o=_(),l=new Date,i=[];i.push(`Voc\xEA \xE9 o assistente de organiza\xE7\xE3o de uma dupla de social media (${s.team.map(d=>d.name).join(" e ")}) que cuida do Instagram de v\xE1rias empresas. Responda em portugu\xEAs do Brasil, de forma curta e direta (sem rodeios), com hor\xE1rios concretos e no m\xE1ximo uns 10 itens.`),i.push(""),i.push(`Agora: ${ce(o)}, ${l.toTimeString().slice(0,5)}.`),i.push(`Rotina combinada: expediente ${t.workStart}\u2013${t.workEnd}, almo\xE7o ${t.lunchStart}\u2013${t.lunchEnd}, folga: ${t.daysOff.map(d=>gt[d]).join(", ")||"nenhuma"}, deslocamento m\xEDnimo entre lugares: ${t.travelMin} min, m\xE1ximo de ${t.maxTasks} tarefas por pessoa/dia.`),i.push(`Empresas: ${s.companiesSorted().map(d=>d.name+(d.instagram?` (@${d.instagram})`:"")).join(", ")||"nenhuma"}.`),i.push(""),i.push(`Agenda (de hoje at\xE9 ${a} dias):`);let n=s.eventsBetween(k(o,-1),k(o,a)),m="";return n.forEach(d=>{d.date!==m&&(i.push(`
${ce(d.date)}:`),m=d.date);let r=s.company(d.companyId),c=d.duration?` (${d.duration} min)`:"";i.push(`- ${d.time||"sem hor\xE1rio"}${c} \xB7 ${T[d.type]?.label} \xB7 ${r?.name||"?"} \xB7 "${d.title||""}" \xB7 ${Ba(d.assignees)} \xB7 ${d.status==="feito"?"feito":d.status==="pronto"?"pronto":"a fazer"}${d.location?" \xB7 local: "+d.location:""}`)}),n.length||i.push("(nenhum compromisso)"),i.push(""),i.push(`Pergunta: ${e}`),i.join(`
`)}function Xt(e){let a=Ha(e);try{navigator.clipboard?.writeText(a).catch(()=>{})}catch{}let t=encodeURIComponent(a),o=t.length<7500?`https://claude.ai/new?q=${t}`:"https://claude.ai/new";window.open(o,"_blank","noopener"),v(t.length<7500?"Abrindo o Claude\u2026 (a agenda tamb\xE9m foi copiada)":"Agenda copiada: cole no Claude (segure no campo \u2192 Colar)",{ms:5e3})}var aa="cal.chat",z=(()=>{try{return JSON.parse(localStorage.getItem(aa)||"[]").slice(-30)}catch{return[]}})(),oe=!1,Zt=()=>{try{localStorage.setItem(aa,JSON.stringify(z.slice(-30)))}catch{}},Fa=e=>f(e).replace(/\*\*(.+?)\*\*/g,"<b>$1</b>").replace(/^#{1,4}\s*(.+)$/gm,"<b>$1</b>").replace(/^\s*[-•*]\s+(.+)$/gm,'<span class="li">$1</span>').replace(/<\/span>\n+(?=<span class="li">)/g,"</span>").replace(/\n{2,}/g,`
`).replace(/\n/g,"<br>"),ea={"functions/failed-precondition":null,"functions/permission-denied":"S\xF3 a equipe pode usar o assistente.","functions/resource-exhausted":null,"functions/unavailable":"Sem conex\xE3o com o assistente agora. Tente de novo.","functions/deadline-exceeded":"O assistente demorou demais. Tente de novo."};function Va(e){return e?.code==="local"?"O assistente precisa da sincroniza\xE7\xE3o na nuvem ligada.":e?.code==="no-server"?"O assistente ainda n\xE3o foi ligado no servidor. Falta publicar o servidor gratuito (veja o README).":e?.status?e.message:e?.code in ea?ea[e.code]||e.message:e?.code==="functions/not-found"||e?.code==="functions/internal"&&!/assistente|Claude/.test(e.message||"")?"O assistente ainda n\xE3o foi ligado no servidor. Falta publicar o servidor com a chave do Claude (veja o README, se\xE7\xE3o 5).":e?.message||"N\xE3o consegui falar com o assistente."}function ta(){return`<section class="block" data-chat>
    <h2 class="block__title">${p("sparkle",16)} Pergunte ao assistente</h2>
    <div class="chat">
      ${z.length?z.map(e=>`<div class="msg msg--${e.role}${e.error?" msg--err":""}">${Fa(e.text)}</div>`).join(""):'<div class="msg msg--assistant">Oi! Eu vejo a agenda inteira de voc\xEAs: posts, capta\xE7\xF5es, reuni\xF5es, empresas e a rotina. Pergunte o que quiser, por exemplo \u201Co que eu tenho amanh\xE3?\u201D ou \u201Cqual o melhor hor\xE1rio para um Reels da Pura Vida na sexta?\u201D.</div>'}
      ${oe?'<div class="msg msg--assistant msg--typing"><i></i><i></i><i></i></div>':""}
    </div>
    <div class="presets">${et.map((e,a)=>`<button class="preset" data-preset="${a}">${f(e.label)}</button>`).join("")}</div>
    <form class="chat__form" data-chatform onsubmit="return false">
      <textarea class="input" rows="1" name="q" placeholder="Escreva sua pergunta\u2026" ${oe?"disabled":""}></textarea>
      <button class="iconbtn iconbtn--accent" type="submit" aria-label="Enviar" ${oe?"disabled":""}>${p("right",20)}</button>
    </form>
    <div class="chat__foot">
      ${z.length?'<button class="btn-text btn-text--sm" data-clearchat>Limpar conversa</button>':"<span></span>"}
      <button class="btn-text btn-text--sm" data-extclaude>Abrir no app do Claude</button>
    </div>
  </section>`}var za=e=>f(JSON.stringify(e));function Ua(e="all"){let a=_(),t=e==="all"?s.team.map(n=>n.id):[e],o=[],l=new Set;for(let n=0;n<7;n++){let m=k(a,n);t.forEach(r=>_e(r,m).forEach(c=>{let u=c.ids.slice().sort().join("|")+c.title;l.has(u)||(l.add(u),o.push({...c,date:m}))})),s.eventsOn(m).filter(r=>!(r.assignees||[]).length&&r.status!=="feito").forEach(r=>o.push({date:m,level:"warn",icon:"user",ids:[r.id],title:"Sem respons\xE1vel",text:`${x(r.time)} ${q(r)}`,fixes:s.team.map(c=>({label:`Dar para ${c.name}`,eventId:r.id,patch:{assignees:[c.id]}}))}))}let i=s.state.events.filter(n=>n.status==="pendente"&&(n.date<a||n.date===a&&n.time&&j(n.time)+15<F())&&n.date>=k(a,-7));return i.length&&o.unshift({date:a,level:"warn",icon:"flag",ids:i.map(n=>n.id),title:`${i.length} tarefa${i.length>1?"s":""} pendente${i.length>1?"s":""} no passado`,text:"Marquem como feito ou reagendem para o cronograma do cliente ficar correto."}),o}function oa(){let e={type:"feed",date:h.date>=_()?h.date:_(),q:""},a=()=>{let i=_(),n=Ua(),m=P(),d=Array.from({length:7},(c,u)=>k(i,u)),r={id:"__probe",type:e.type,date:e.date,assignees:[]};return`
    ${Mt("Assistente")}
    <div class="page page--sheet">
      <div class="assist-hero">
        <span class="assist-hero__ic">${p("sparkle",22)}</span>
        <div><strong>Analisando a agenda de voc\xEAs</strong><p>Funciona sozinho, sem internet. Confere conflitos, tempo livre e os melhores hor\xE1rios sempre que algo muda.</p></div>
      </div>

      ${ta()}

      <section class="block">
        <h2 class="block__title">${p("today",16)} Hoje</h2>
        <div class="card">${me(i).map(c=>`<p>${f(c)}</p>`).join("")}</div>
        <h2 class="block__title">${p("calendar",16)} Amanh\xE3</h2>
        <div class="card">${me(k(i,1)).map(c=>`<p>${f(c)}</p>`).join("")}</div>
      </section>

      <section class="block">
        <h2 class="block__title">${p("alert",16)} Precisa de aten\xE7\xE3o (7 dias)</h2>
        ${n.length?`<div class="tips">${n.map(c=>`
          <div class="tip tip--${c.level}">
            <span class="tip__ic">${p(c.icon,16)}</span>
            <div>
              <small class="tip__date">${f(ge(c.date))}</small>
              <strong>${f(c.title)}</strong><p>${f(c.text)}</p>
              ${c.fixes?.length?`<div class="fixes">${c.fixes.map(u=>`<button class="fixbtn" data-action="apply-fix" data-id="${u.eventId}" data-patch="${za(u.patch)}">${p("check",13)} ${f(u.label)}</button>`).join("")}</div>`:""}
              ${c.ids?.length===1?`<button class="btn-text btn-text--sm" data-action="open-event" data-id="${c.ids[0]}">Ver evento</button>`:""}
            </div>
          </div>`).join("")}</div>`:`<div class="tip tip--ok"><span class="tip__ic">${p("check",16)}</span><div><strong>Tudo certo</strong><p>Nenhum conflito nos pr\xF3ximos 7 dias.</p></div></div>`}
      </section>

      <section class="block">
        <h2 class="block__title">${p("clock",16)} Tempo livre no expediente (${x(m.workStart)}\u2013${x(m.workEnd)})</h2>
        <div class="freegrid">
          <span></span>${d.map(c=>`<span class="freegrid__d">${ee[K(c).getDay()]}<b>${K(c).getDate()}</b></span>`).join("")}
          ${s.team.map(c=>`${M(c.id,24)}${d.map(u=>{let b=ae(c.id,u);if(b.dayOff)return'<span class="freecell is-off">folga</span>';let y=b.minutes/60;return`<span class="freecell ${y>=4?"is-good":y>=2?"is-mid":"is-low"}">${G(Math.round(b.minutes/15)*15)||"0"}</span>`}).join("")}`).join("")}
        </div>
        <p class="fhelp">Verde: dia tranquilo \xB7 amarelo: apertado \xB7 vermelho: sem respiro. Ajuste a rotina em Ajustes.</p>
      </section>

      <section class="block">
        <h2 class="block__title">${p("bulb",16)} Encontrar o melhor hor\xE1rio</h2>
        <div class="card">
          <div class="row2">
            <select class="input" data-f="type">${Et.map(c=>`<option value="${c}"${e.type===c?" selected":""}>${T[c].label}</option>`).join("")}</select>
            <input class="input" type="date" data-f="date" value="${e.date}">
          </div>
          ${s.team.map(c=>{let u=Nt({...r},{people:[c.id],limit:4});return`<div class="findrow">${M(c.id,26)}<div class="hintbox__times">${u.length?u.map(b=>`<button class="tchip" data-new="${c.id}|${b.time}">${x(b.time)}${b.peak?"<small>pico</small>":""}</button>`).join(""):'<span class="muted">Sem hor\xE1rio livre</span>'}</div></div>`}).join("")}
          <p class="fhelp">Toque num hor\xE1rio para j\xE1 criar o evento com a pessoa certa.</p>
        </div>
      </section>

    </div>`},t=Dt({className:"sheet--tall",html:a(),onMount:i=>{let n=i.el;n.querySelector('[data-f="type"]').onchange=d=>{e.type=d.target.value,i.set(a())},n.querySelector('[data-f="date"]').onchange=d=>{d.target.value&&(e.date=d.target.value,i.set(a()))},n.querySelectorAll("[data-new]").forEach(d=>d.onclick=async()=>{let[r,c]=d.dataset.new.split("|"),{openEventEditor:u}=await import("./c-FJTSIK4O.js");u({date:e.date,type:e.type,time:c,assignees:[r]})}),l(i,async d=>{if(d=(d||"").trim(),!d||oe)return;let r=z.filter(c=>!c.error).map(c=>({role:c.role,text:c.text}));z.push({role:"user",text:d}),oe=!0,o(i);try{let c=await s.askAssistant(d,r);z.push({role:"assistant",text:c})}catch(c){z.push({role:"assistant",text:Va(c),error:!0})}oe=!1,Zt(),o(i)})}});function o(i){let n=i.el.querySelector("[data-chat]");if(!n)return;n.outerHTML=ta(),l(i,i.send);let m=i.el.querySelector(".chat");m&&m.lastElementChild?.scrollIntoView({block:"nearest",behavior:"smooth"})}function l(i,n){i.send=n;let m=i.el;m.querySelectorAll("[data-preset]").forEach(u=>u.onclick=()=>n(et[+u.dataset.preset].q));let d=m.querySelector("[data-chatform]"),r=d.q;r.oninput=()=>{r.style.height="auto",r.style.height=Math.min(r.scrollHeight,140)+"px"},r.onkeydown=u=>{u.key==="Enter"&&!u.shiftKey&&(u.preventDefault(),n(r.value))},d.onsubmit=u=>{u.preventDefault(),n(r.value)};let c=m.querySelector("[data-clearchat]");c&&(c.onclick=()=>{z=[],Zt(),o(i)}),m.querySelector("[data-extclaude]").onclick=()=>Xt(r.value.trim()||"Analise a agenda e me diga o que \xE9 mais importante agora.")}t.refresh=()=>{let i=document.activeElement;if(i&&t.el.contains(i)&&/INPUT|TEXTAREA|SELECT/.test(i.tagName))return;let n=t.el.scrollTop;t.set(a()),t.el.scrollTop=n}}var sa="seed-v1",na=[{id:"c_puravida",name:"Pura Vida",color:"#15803D",logoFile:"pura-vida.jpg"},{id:"c_jggarcia",name:"JG Garcia",color:"#16A34A",logoFile:"jg-garcia.jpg"},{id:"c_garciahortifruti",name:"Garcia Hortifruti",color:"#65A30D",logoFile:"garcia-hortifruti.jpg"},{id:"c_tobiasbbq",name:"Tobia's BBQ",color:"#DC2626",logoFile:"tobias-bbq.jpg"},{id:"c_verdeerosa",name:"Verde e Rosa Multimarcas",color:"#DB2777",logoFile:"verde-e-rosa.jpg"},{id:"c_sophiafestas",name:"Sophia Festas",color:"#0284C7",logoFile:"sophia-festas.jpg"}],Ka=async e=>{let a=await(await fetch(e,{cache:"no-cache"})).blob();return new Promise((t,o)=>{let l=new FileReader;l.onload=()=>t(l.result),l.onerror=o,l.readAsDataURL(a)})},tt=!1;async function ia(){if(!(tt||!s.ready||s.state.settings.some(e=>e.id===sa))){tt=!0;try{let e=na.filter(t=>!s.company(t.id)&&!s.state.companies.some(o=>o.name.trim().toLowerCase()===t.name.toLowerCase())),a=[];for(let t of e){let o=null;try{o=await Ka(`media/logos/${t.logoFile}`)}catch{}a.push({id:t.id,name:t.name,color:t.color,logo:o,instagram:"",address:"",contact:"",notes:"",shareToken:null})}a.length&&await s.upsertMany("companies",a),await s.upsert("settings",{id:sa,done:na.map(t=>t.id)})}finally{tt=!1}}}var ra="seed-garcia-nov-2026-v2",Ga=["seed-garcia-nov-2026","seed-garcia-nov-2026-ate14h"],ca="c_garciahortifruti",Wa=["domingo","segunda","ter\xE7a","quarta","quinta","sexta","s\xE1bado"],Ya={"2026-11-09":"Marechal","2026-11-11":"Vila Valqueire","2026-11-13":"Marechal","2026-11-16":"Vila Valqueire","2026-11-18":"Marechal","2026-11-20":"Vila Valqueire","2026-11-23":"Marechal","2026-11-25":"Vila Valqueire","2026-11-27":"Marechal","2026-11-30":"Vila Valqueire"},Ja=[{date:"2026-11-20",text:"Garcia \xB7 Consci\xEAncia Negra: publica\xE7\xE3o institucional respeitosa e representativa."},{date:"2026-11-23",text:"Garcia \xB7 Black Friday (23 a 27/11): campanha principal de ofertas e chamadas di\xE1rias."},{date:"2026-11-28",text:"Garcia \xB7 Esquenta de Natal e ver\xE3o (28 a 30/11): frutas da esta\xE7\xE3o, receitas, saladas e planejamento das compras."}];function Qa(e="2026-11-19",a="2026-11-30"){let t=[];for(let o=new Date(e+"T12:00:00");o<=new Date(a+"T12:00:00");o.setDate(o.getDate()+1)){let l=`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}-${String(o.getDate()).padStart(2,"0")}`,i=o.getDay(),n={date:l,companyId:ca,assignees:["henrique"],status:"pendente",description:"",seedRoutine:2};if([1,3,5].includes(i)){let m=Ya[l]||"";t.push({...n,id:`e_garcia2_${l}_ceasa`,type:"outro",time:"07:00",duration:210,reminder:30,title:"CEASA",location:"CEASA",internalNote:"CEASA \u2014 07h \xE0s 10h30. Depois segue para a Garcia Hortifruti.",visibleToClient:!1}),t.push({...n,id:`e_garcia2_${l}_gravacao`,type:"captacao",time:"10:30",duration:210,reminder:60,title:`Grava\xE7\xE3o com o Gelado \u2014 ${m||"Garcia"}`,location:m?`Garcia Hortifruti \u2014 ${m}`:"Garcia Hortifruti",internalNote:"Sa\xEDda do CEASA por volta das 10h30. Personagem: Gelado (filmar para Reels, feed e stories). Ajustar conforme abastecimento, pre\xE7os e necessidades da unidade.",visibleToClient:!0})}else if(i===0)t.push({...n,id:`e_garcia2_${l}_plan`,type:"outro",time:"07:00",duration:420,reminder:30,title:"Planejamento da semana",location:"",internalNote:"Planejamento \u2014 07h \xE0s 14h.",visibleToClient:!1});else{let m=i===6;t.push({...n,id:`e_garcia2_${l}_ceasa`,type:"outro",time:"07:00",duration:m?300:420,reminder:30,title:`Somente CEASA (${Wa[i]})`,location:"CEASA",internalNote:`Somente CEASA \u2014 07h \xE0s ${m?"12h":"14h"}.`,visibleToClient:!1})}}return t}var at=!1;async function la(){if(!(at||!s.ready||s.state.settings.some(e=>e.id===ra))&&s.company(ca)){at=!0;try{let e=s.state.events.filter(o=>o.seedRoutine===!0||/^e_garcia_\d/.test(o.id)).map(o=>o.id);e.length&&await s.removeMany("events",e,{silent:!0});let a=Qa().filter(o=>!s.event(o.id));a.length&&await s.upsertMany("events",a);let t=Ja.filter(o=>!s.state.notes.some(l=>l.date===o.date&&l.text===o.text)).map(o=>({id:be("n_"),date:o.date,text:o.text,author:"henrique"}));t.length&&await s.upsertMany("notes",t);for(let o of[ra,...Ga])await s.upsert("settings",{id:o,done:[]})}finally{at=!1}}}var U={feed:"Feed",carrossel:"Carrossel",reels:"Reels",story:"Story",captacao:"Capta\xE7\xE3o",reuniao:"Reuni\xE3o",producao:"Edi\xE7\xE3o",outro:"Tarefa"},Xa=["feed","carrossel","reels","story"],Te=e=>Xa.includes(e),da={feed:"publicar o feed",carrossel:"publicar o carrossel",reels:"postar o Reels",story:"postar o story",captacao:"a capta\xE7\xE3o",reuniao:"a reuni\xE3o",producao:"a edi\xE7\xE3o",outro:"a tarefa"},Q=e=>e?e.replace(/^0/,"").replace(":00","h").replace(":","h"):"",Za=e=>{let[a,t]=String(e).split(":").map(Number);return a*60+t},Ae=e=>Math.round(Date.UTC(+e.slice(0,4),+e.slice(5,7)-1,+e.slice(8,10))/864e5),je=(e,a)=>new Date(Date.UTC(+e.slice(0,4),+e.slice(5,7)-1,+e.slice(8,10)+a)).toISOString().slice(0,10);function ot(e){let a=Number.isFinite(e.reminder)?e.reminder:30,t;return Te(e.type)?t=[120,30,0,-30]:e.type==="captacao"?t=[1440,120,45,-30]:e.type==="reuniao"?t=[1440,60,15]:t=[30,0],a>=0&&!t.includes(a)&&t.push(a),a<0&&(t=t.filter(o=>o<0)),[...new Set(t)].sort((o,l)=>l-o)}function ma(e,a,t=4){let o=Ae(a.date)*1440+a.minutes,l=[];return e.forEach(i=>{if(!i||!i.time||!i.date||i.status==="feito")return;let n=Ae(i.date)*1440+Za(i.time);ot(i).forEach(m=>{if(m<0&&i.status!=="pendente")return;let d=n-m;d<=o&&d>o-t&&l.push({ev:i,offset:m})})}),l}var eo=(e,a)=>{let t=Ae(e)-Ae(a.date);return t===0?"hoje":t===1?"amanh\xE3":t===-1?"ontem":`${["domingo","segunda","ter\xE7a","quarta","quinta","sexta","s\xE1bado"][new Date(Date.UTC(+e.slice(0,4),+e.slice(5,7)-1,+e.slice(8,10))).getUTCDay()]}, ${e.slice(8,10)}/${e.slice(5,7)}`},to=e=>{if(e>=60){let a=Math.floor(e/60),t=e%60;return t?`${a}h${String(t).padStart(2,"0")}`:`${a}h`}return`${e} min`};function Ce(e,a,t=""){let o=`${U[e.type]||"Tarefa"}${t?" \xB7 "+t:""}`,l=e.title?`\u201C${e.title}\u201D`:"",i=Q(e.time),n=e.location?` \xB7 ${e.location}`:"";return a>=1440?{title:`Amanh\xE3: ${o} \xE0s ${i}`,body:e.type==="captacao"?`Hoje: carregue baterias, esvazie os cart\xF5es e confirme com o cliente.${n}`:`${l}${n}`.trim()||"Confirme o hor\xE1rio com o cliente."}:a>0?{title:`Daqui a ${to(a)}: ${o}`,body:`${i} \u2014 ${da[e.type]||"a tarefa"}${l?" "+l:""}${n}`}:a===0?{title:`Agora: ${o}`,body:`Est\xE1 na hora de ${da[e.type]||"fazer a tarefa"}${l?" "+l:""}.`}:{title:Te(e.type)?`J\xE1 postou? ${o}`:`J\xE1 fez? ${o}`,body:`Era \xE0s ${i}${l?" \u2014 "+l:""}. Toque para marcar como feito.`}}function De(e,a,{actor:t="Algu\xE9m",company:o="",recipient:l=null,now:i}={}){let m=`${U[(a||e).type]||"Tarefa"}${o?" \xB7 "+o:""}`,d=b=>`${eo(b.date,i)}${b.time?", "+Q(b.time):""}`,r=b=>l&&(b.assignees||[]).includes(l);if(!e&&a)return{title:r(a)?`${t} marcou para voc\xEA`:`${t} adicionou na agenda`,body:`${m} \u2014 ${d(a)}${a.title?" \xB7 "+a.title:""}`};if(e&&!a)return{title:`${t} removeu da agenda`,body:`${m} \u2014 ${d(e)}`};if(e.status!=="feito"&&a.status==="feito")return{title:`${t} concluiu \u2713`,body:`${m} \u2014 ${d(a)}`};let c=r(e),u=r(a);return!c&&u?{title:`${t} passou para voc\xEA`,body:`${m} \u2014 ${d(a)}${a.title?" \xB7 "+a.title:""}`}:c&&!u?{title:`${t} assumiu uma tarefa sua`,body:`${m} \u2014 ${d(a)}`}:e.date!==a.date||e.time!==a.time?{title:`${t} mudou o hor\xE1rio`,body:`${m}: ${d(e)} \u2192 ${d(a)}`}:null}function pa(e,a,t,o){if(!t.length)return null;let l=[...t].sort((c,u)=>(c.time||"99").localeCompare(u.time||"99")),i=l.find(c=>c.time)||l[0],n=l.filter(c=>Te(c.type)).length,m=l.filter(c=>c.type==="captacao"||c.type==="reuniao"),d=c=>`${Q(c.time)} ${U[c.type]}${o(c)?" \xB7 "+o(c):""}`,r=[`${l.length} tarefa${l.length>1?"s":""} (${n} post${n===1?"":"s"})`,`primeira: ${d(i)}`];return m.length&&r.push(`sai para ${m.map(c=>`${o(c)||U[c.type]} \xE0s ${Q(c.time)}`).join(" e ")}`),e==="morning"?{title:`Bom dia, ${a}! Seu dia hoje`,body:r.join(" \xB7 ")}:{title:`${a}, amanh\xE3 voc\xEA tem ${l.length} tarefa${l.length>1?"s":""}`,body:r.slice(1).join(" \xB7 ")}}var X=e=>s.member(e)?.name||"Algu\xE9m",N=e=>s.company(e)?.name||"",st=()=>{let e=new Date;return{date:_(),minutes:e.getHours()*60+e.getMinutes()}},ua=(e,a)=>Date.parse(`${e}T${a}:00-03:00`),rt=()=>s.mode==="cloud"&&!!R()&&!!s.me,nt=null,ha=e=>nt=e;function it(e,a,t,o="./",l=!1){return!a||!e.length?Promise.resolve(null):J("/notify",{to:e,title:a.title,body:a.body,tag:t,url:o,includeSelf:l}).catch(i=>(console.warn("aviso",i.message),{error:i.message}))}var Me=e=>{let a=_();return`${e.date===a?"hoje":e.date===k(a,1)?"amanh\xE3":`${e.date.slice(8,10)}/${e.date.slice(5,7)}`}${e.time?", "+e.time.replace(":00","h").replace(":","h").replace(/^0/,""):""}`};function ga(e,a){if(!rt())return;let t=a||e,o=`${U[t.type]||"Tarefa"}${N(t.companyId)?" \xB7 "+N(t.companyId):""}`,l=(t.assignees||[]).map(X).join(" e ")||"sem respons\xE1vel",i=r=>({title:`${r} alterou: ${o}`,body:`${Me(t)}${t.title?" \xB7 "+t.title:""} \xB7 ${l}`}),m=s.team.map(r=>r.id).filter(r=>r!==s.me).map(r=>{let c=De(e,a,{actor:X(s.me),company:N(t.companyId),recipient:r,now:st()})||i(X(s.me));return it([r],c,`ev-${t.id}`,`./#/e/${t.id}`).then(u=>({r,d:u}))}),d;!e&&a?d={title:`Novo na agenda: ${o}`,body:`${Me(a)}${a.title?" \xB7 "+a.title:""} \xB7 ${l}`}:e&&a&&(e.date!==a.date||e.time!==a.time)?d={title:`Hor\xE1rio alterado: ${o}`,body:`${Me(e)} \u2192 ${Me(a)} \xB7 ${l}`}:d=De(e,a,{actor:"Voc\xEA",company:N(t.companyId),recipient:null,now:st()})||i("Voc\xEA"),it([s.me],d,`ev-${t.id}`,a?`./#/e/${t.id}`:"./",!0),m.length&&nt&&Promise.all(m).then(r=>{let c=r.filter(y=>y.d&&!y.d.error&&y.d.results&&!y.d.results[y.r]).map(y=>X(y.r)),u=r.find(y=>y.d&&y.d.error),b=r.filter(y=>y.d&&y.d.results&&y.d.results[y.r]).map(y=>X(y.r));nt({ok:b,missing:c,error:u?.d.error})}),se()}function ba(e){if(!rt())return;let a=s.team.map(l=>l.id).filter(l=>l!==s.me),t=X(s.me),o=null;if(e.kind==="deleted"&&e.events?.length){let l=e.events[0];o=e.events.length===1?De(l,null,{actor:t,company:N(l.companyId),now:st()}):{title:`${t} removeu ${e.events.length} itens da agenda`,body:`${N(l.companyId)?N(l.companyId)+" \xB7 ":""}a partir de ${l.date.slice(8,10)}/${l.date.slice(5,7)}`}}else e.kind==="series"?o={title:`${t} adicionou ${e.count} itens repetidos`,body:`${e.label||""}${N(e.sample?.companyId)?" \xB7 "+N(e.sample.companyId):""}`}:e.kind==="series-edit"?o={title:`${t} alterou ${e.count} itens repetidos`,body:`${e.label||""}${N(e.sample?.companyId)?" \xB7 "+N(e.sample.companyId):""}`}:e.kind==="import"&&(o={title:`${t} importou a agenda`,body:`${e.count||0} itens atualizados.`});it(s.team.map(l=>l.id),o,`act-${e.id||Date.now()}`,"./",!0),se()}function ao(e=Date.now()){let a=[],t=k(_(),-1),o=k(_(),4),l=s.eventsBetween(t,o).filter(n=>n.time&&n.status!=="feito"),i=(n,m)=>s.eventsOn(m,{person:n}).filter(d=>d.status!=="feito").length;l.forEach(n=>{let m=ua(n.date,n.time);ot(n).forEach(d=>{if(d<0&&n.status!=="pendente")return;let r=m-d*6e4;if(r<e-10*6e4||r>e+4*864e5)return;let c=Ce(n,d,N(n.companyId)),u=(n.assignees||[]).map(X).join(" e ");s.team.map(b=>b.id).forEach(b=>a.push({id:`r_${n.id}_${d}_${n.date}${n.time.replace(":","")}_${b}`,at:r,member:b,title:c.title,body:u&&!(n.assignees.length===1&&n.assignees[0]===b)?`${c.body} \xB7 ${u}`:c.body,tag:`rem-${n.id}`,url:`./#/e/${n.id}`,kind:"reminders",badge:i(b,n.date)}))})});for(let n=0;n<4;n++){let m=k(_(),n);s.team.forEach(d=>{[["morning",m,"08:00"],["evening",k(m,1),"20:00"]].forEach(([r,c,u])=>{let b=ua(m,u);if(b<e-10*6e4)return;let y=s.eventsOn(c,{person:d.id}).filter(g=>g.status!=="feito"),D=pa(r,d.name,y,g=>N(g.companyId));D&&a.push({id:`d_${r}_${c}_${d.id}`,at:b,member:d.id,title:D.title,body:D.body,tag:`daily-${r}`,url:"./",kind:"daily",badge:i(d.id,c)})})})}return a.sort((n,m)=>n.at-m.at)}var fa="",se=St(async()=>{if(!rt())return;let e=ao(),a=JSON.stringify(e.map(t=>[t.id,t.at,t.title,t.body]));if(a!==fa)try{await J("/schedule",{items:e}),fa=a}catch(t){console.warn("lista de lembretes",t.message)}},3e3);var va=["domingo","segunda","ter\xE7a","quarta","quinta","sexta","s\xE1bado"],$a=e=>va[new Date(Date.UTC(+e.slice(0,4),+e.slice(5,7)-1,+e.slice(8,10))).getUTCDay()],oo={pendente:"a fazer",pronto:"pronto/agendado",feito:"feito"};function ya({events:e,companies:a,routine:t,notes:o,team:l,me:i,now:n}){let m=new Map(a.map(g=>[g.id,g.name])),d=g=>l.find(I=>I.id===g)?.name||g,r=je(n.date,-7),c=je(n.date,30),u=e.filter(g=>g.date>=r&&g.date<=c).sort((g,I)=>(g.date+(g.time||"")).localeCompare(I.date+(I.time||""))),b=[];b.push(`Agora: ${$a(n.date)}, ${n.date.split("-").reverse().join("/")}, ${Q(`${String(Math.floor(n.minutes/60)).padStart(2,"0")}:${String(n.minutes%60).padStart(2,"0")}`)} (hor\xE1rio de Bras\xEDlia).`),b.push(`Quem pergunta: ${d(i)}. Equipe: ${l.map(g=>g.name).join(" e ")}.`),t&&b.push(`Rotina combinada: expediente ${t.workStart}\u2013${t.workEnd}, almo\xE7o ${t.lunchStart}\u2013${t.lunchEnd}, folga: ${(t.daysOff||[]).map(g=>va[g]).join(", ")||"nenhuma"}, deslocamento m\xEDnimo ${t.travelMin} min, m\xE1ximo ${t.maxTasks} tarefas por pessoa/dia.`),b.push(`Empresas clientes: ${a.map(g=>g.name+(g.instagram?` (@${g.instagram})`:"")+(g.address?` \u2014 endere\xE7o: ${g.address}`:"")+(g.notes?` \u2014 observa\xE7\xF5es: ${g.notes}`:"")).join("; ")||"nenhuma"}.`),b.push("",`Agenda (de ${r.split("-").reverse().join("/")} a ${c.split("-").reverse().join("/")}):`);let y="";u.forEach(g=>{g.date!==y&&(b.push(`
${$a(g.date)} ${g.date.split("-").reverse().join("/")}:`),y=g.date);let I=g.duration?` (${g.duration} min)`:"",w=(g.assignees||[]).map(d).join(" e ")||"sem respons\xE1vel";b.push(`- ${g.time?Q(g.time):"sem hor\xE1rio"}${I} \xB7 ${U[g.type]||g.type} \xB7 ${m.get(g.companyId)||"?"} \xB7 "${g.title||""}" \xB7 ${w} \xB7 ${oo[g.status]||g.status}${g.location?" \xB7 local: "+g.location:""}${g.description?" \xB7 legenda: "+g.description.slice(0,160):""}${g.internalNote?" \xB7 nota interna: "+g.internalNote.slice(0,160):""}`)}),u.length||b.push("(nenhum compromisso)");let D=(o||[]).filter(g=>g.date>=je(n.date,-2)).slice(-10);return D.length&&b.push("","Bilhetes recentes da dupla:",...D.map(g=>`- ${g.date.split("-").reverse().join("/")} ${d(g.author)}: ${g.text}`)),b.join(`
`)}var O=document.getElementById("app");window.__calStarted=!0;var Z=null;function so(){O.innerHTML=`
    <main id="view" class="view"></main>
    <nav class="tabbar" aria-label="Navega\xE7\xE3o">
      ${qe("hoje","today","Hoje")}
      ${qe("mes","calendar","Calend\xE1rio")}
      <button class="tabbar__fab" data-action="new-event" aria-label="Novo evento">${p("plus",28)}</button>
      ${qe("empresas","building","Empresas")}
      ${qe("ajustes","settings","Ajustes")}
    </nav>`}var qe=(e,a,t)=>`<button class="tabbar__btn" data-action="tab" data-tab="${e}">${p(a,24)}<span>${t}</span></button>`;function C(){let e=document.getElementById("view");if(!e)return;let a=window.scrollY,t=e.querySelector('[data-form="note"] input'),o=t?t.value:"",l=t&&document.activeElement===t,i=h.tab==="mes"?zt():h.tab==="empresas"?It():h.tab==="ajustes"?Qt():Vt();e.innerHTML=i,document.querySelectorAll(".tabbar__btn").forEach(m=>m.classList.toggle("is-on",m.dataset.tab===h.tab)),window.scrollTo(0,a);let n=e.querySelector('[data-form="note"] input');n&&o&&(n.value=o),n&&l&&n.focus({preventScroll:!0}),ro()}function no(){C(),ze().forEach(e=>e.refresh&&e.refresh())}function ue(e){h.tab=e,Be(),C(),window.scrollTo(0,0)}var io={tab:e=>ue(e.dataset.tab),"set-person":e=>{h.person=e.dataset.p,Be(),C()},"set-date":e=>{h.date=e.dataset.k,C()},"go-today":()=>{h.date=_(),C()},week:e=>{h.date=k(h.date,Number(e.dataset.n)),C()},month:e=>{h.month=Ie(h.month,Number(e.dataset.n)),h.monthSel=h.month===re(_())?_():`${h.month}-01`,C()},"month-today":()=>{h.month=re(_()),h.monthSel=_(),C()},"month-select":e=>{h.monthSel=e.dataset.k,re(e.dataset.k)!==h.month&&(h.month=re(e.dataset.k)),C()},"month-company":e=>{h.monthCompany=e.dataset.id||null,C()},"open-day":e=>{h.date=e.dataset.k,ue("hoje")},"toggle-tips":()=>{h.showAllTips=!h.showAllTips,C()},"open-event":e=>ve(e.dataset.id),assistant:()=>oa(),"apply-fix":async e=>{let a=s.event(e.dataset.id);if(!a)return;let t;try{t=JSON.parse(e.dataset.patch)}catch{return}let o={};typeof t.time=="string"&&/^\d{2}:\d{2}$/.test(t.time)&&(o.time=t.time),Array.isArray(t.assignees)&&(o.assignees=t.assignees.filter(n=>s.member(n)));let{confirmMove:l}=await import("./c-FJTSIK4O.js");if(!await l(a,o))return;let i={...a};await s.upsert("events",{...a,...o}),v("Pronto, ajustado",{action:"Desfazer",onAction:()=>s.upsert("events",i)})},"toggle-done":async e=>{let a=s.event(e.dataset.id);if(!a)return;let t=a.status==="feito"?"pendente":"feito";await s.upsert("events",{...a,status:t}),t==="feito"&&v(`${T[a.type].label} conclu\xEDdo`,{action:"Desfazer",onAction:()=>s.upsert("events",{...s.event(a.id),status:a.status})})},"new-event":e=>{if(!s.state.companies.length)return v("Cadastre uma empresa primeiro"),Ge(null,()=>Ue({}));Ue({date:e.dataset.date||null})},"open-company":e=>Lt(e.dataset.id),"new-company":()=>Ge(),"del-note":async e=>{let a=s.state.notes.find(t=>t.id===e.dataset.id);await s.remove("notes",e.dataset.id),a&&v("Bilhete apagado",{action:"Desfazer",onAction:()=>s.upsert("notes",a)})},"set-me":e=>{s.setMe(e.dataset.p),v(`Ol\xE1, ${s.member(e.dataset.p).name}!`)},"clear-demo":async()=>{await de({title:"Apagar os dados de exemplo?",text:"O calend\xE1rio ficar\xE1 vazio para voc\xEAs cadastrarem as empresas e eventos reais.",ok:"Apagar exemplos",danger:!0})&&(await s.clearDemo(),v("Pronto! Agora cadastre suas empresas."))},"clear-all":()=>B.clearAll(),ics:e=>B.ics(e),"notify-enable":()=>B.notifyEnable(),"notify-test":()=>B.notifyTest(),"onboarding-again":()=>B.onboardingAgain(),export:()=>B.export(),logout:async()=>{await de({title:"Sair da conta?",ok:"Sair"})&&(await Z.signOut(),location.reload())}};document.addEventListener("click",e=>{let a=e.target.closest("[data-action]");if(!a||document.body.classList.contains("is-client"))return;let t=io[a.dataset.action];t&&(e.preventDefault(),e.stopPropagation(),t(a))});document.addEventListener("change",e=>{e.target.matches('[data-action-change="import"]')&&B.import(e.target),e.target.closest("[data-notify-form]")&&B.notifyPrefs(e.target.closest("[data-notify-form]")),e.target.closest("[data-routine-form]")&&B.routine(e.target.closest("[data-routine-form]"))});document.addEventListener("submit",async e=>{let a=e.target.closest('[data-form="note"]');if(!a)return;e.preventDefault();let t=a.text.value.trim();if(t){if(!s.me){v("Escolha quem voc\xEA \xE9 em Ajustes");return}await s.upsert("notes",{id:be("n_"),date:h.date,text:t,author:s.me}),v("Bilhete adicionado")}});function ro(){document.querySelectorAll("[data-swipe]").forEach(e=>{let a=null,t=null;e.addEventListener("touchstart",o=>{a=o.touches[0].clientX,t=o.touches[0].clientY},{passive:!0}),e.addEventListener("touchend",o=>{if(a==null)return;let l=o.changedTouches[0].clientX-a,i=o.changedTouches[0].clientY-t;if(a=null,Math.abs(l)<50||Math.abs(l)<Math.abs(i)*1.5)return;let n=l<0?1:-1;e.dataset.swipe==="week"?h.date=k(h.date,7*n):(h.month=Ie(h.month,n),h.monthSel=`${h.month}-01`),C()})})}var wa=new Set;function _a(){if(!s.me)return;let e=new Date,a={date:_(),minutes:e.getHours()*60+e.getMinutes()},t=s.eventsBetween(k(a.date,-1),k(a.date,1),{person:s.me}),o=s.mode==="cloud"&&!!localStorage.getItem("pauta.device");ma(t,a,2).forEach(({ev:l,offset:i})=>{let n=`${l.id}@${i}@${l.date}${l.time}`;if(wa.has(n))return;wa.add(n);let m=Ce(l,i,s.company(l.companyId)?.name||"");v(`${m.title}`,{ms:7e3,action:"Ver",onAction:()=>ve(l.id)}),!o&&V()==="granted"&&navigator.serviceWorker&&navigator.serviceWorker.ready.then(d=>d.showNotification(m.title,{body:m.body,tag:`rem-${l.id}`,icon:"icons/icon-192.png",badge:"icons/icon-192.png",data:{url:`./#/e/${l.id}`}})).catch(()=>{})}),Ye(s.eventsOn(a.date,{person:s.me}).filter(l=>l.status!=="feito").length)}function mt(e=location.hash){let a=/^#\/(e|d)\/([\w-]+)/.exec(e||"");return a?(history.replaceState(null,"",location.pathname+location.search),a[1]==="e"&&s.event(a[2])?(h.date=s.event(a[2]).date,ue("hoje"),ve(a[2])):a[1]==="d"&&/^\d{4}-\d{2}-\d{2}$/.test(a[2])&&(h.date=a[2],ue("hoje")),!0):!1}var ka={"auth/invalid-credential":"E-mail ou senha incorretos. Confira a senha (toque no olho para ver o que digitou).","auth/wrong-password":"Senha incorreta.","auth/user-not-found":"Este e-mail n\xE3o est\xE1 cadastrado no Firebase (Authentication \u2192 Usu\xE1rios).","auth/invalid-email":"E-mail inv\xE1lido.","auth/too-many-requests":'Muitas tentativas seguidas. Espere alguns minutos ou use "Esqueci minha senha".',"auth/network-request-failed":"Sem conex\xE3o com a internet. Verifique o Wi-Fi/4G e tente de novo.","auth/user-disabled":"Este usu\xE1rio foi desativado no Firebase.","auth/operation-not-allowed":"O login por e-mail/senha n\xE3o est\xE1 ativado no Firebase.","auth/api-key-not-valid":"Configura\xE7\xE3o do Firebase inv\xE1lida (apiKey)."},Sa="",dt="";function Ne(e=""){let a=e||dt;O.innerHTML=`
  <div class="login">
    <img src="icons/icon-192.png" alt="" width="84" height="84">
    <h1>${f(A.appName)}</h1>
    <p>Agenda de conte\xFAdo \xB7 ${f(A.agencyName)}</p>
    <form class="form" data-login novalidate>
      <div class="fgroup"><label class="flabel" for="l-email">E-mail</label><input id="l-email" class="input" type="email" name="email" value="${f(Sa)}" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" inputmode="email"></div>
      <div class="fgroup"><label class="flabel" for="l-pass">Senha</label>
        <div class="input-eye"><input id="l-pass" class="input" type="password" name="pass" autocomplete="current-password" autocapitalize="none" autocorrect="off" spellcheck="false">
        <button type="button" class="iconbtn iconbtn--sm" data-eye aria-label="Mostrar senha">${p("eye",18)}</button></div>
      </div>
      ${a?`<p class="login__err">${f(a)}</p>`:""}
      <button class="btn btn--primary btn--block" type="submit" data-go>Entrar</button>
      <button class="btn-text btn-text--sm" type="button" data-reset>Esqueci minha senha</button>
    </form>
  </div>`;let t=O.querySelector("[data-login]");O.querySelector("[data-eye]").onclick=()=>{t.pass.type=t.pass.type==="password"?"text":"password"},t.onsubmit=async o=>{o.preventDefault();let l=t.email.value.trim().toLowerCase(),i=t.pass.value;if(Sa=l,dt="",!l||!i)return Ne("Preencha o e-mail e a senha.");let n=t.querySelector("[data-go]");n.disabled=!0,n.textContent="Entrando\u2026";try{await Promise.race([Z.signIn(l,i),new Promise((m,d)=>setTimeout(()=>d({code:"timeout"}),2e4))]),n.textContent="Abrindo\u2026"}catch(m){let d=m&&m.code;Ne(d==="timeout"?"O servidor demorou para responder. Verifique a internet e tente de novo.":ka[d]||`N\xE3o foi poss\xEDvel entrar (${d||m?.message||"erro desconhecido"}).`)}},O.querySelector("[data-reset]").onclick=async()=>{let o=t.email.value.trim().toLowerCase();if(!o)return v("Digite seu e-mail primeiro");try{await Z.resetPassword(o),v("Enviamos um e-mail para criar uma nova senha (veja tamb\xE9m o spam)",{ms:6e3})}catch(l){v(ka[l?.code]||"N\xE3o foi poss\xEDvel enviar o e-mail")}}}function xa(e){document.querySelector("[data-login]")||document.getElementById("view")||(O.innerHTML=`<div class="splash">
    <img src="icons/icon-192.png" alt="" width="72" height="72">
    <h2>N\xE3o consegui conectar</h2>
    <p>Verifique a internet e tente de novo.</p>
    <button class="btn btn--primary" data-retry>Tentar de novo</button>
    <small class="muted">Detalhe: ${f(String(e&&(e.code||e.message)||e))}</small>
  </div>`,O.querySelector("[data-retry]").onclick=()=>location.reload())}function ct(e="Carregando\u2026"){O.innerHTML=`<div class="splash"><img src="icons/icon-192.png" alt="" width="72" height="72"><p>${f(e)}</p></div>`}function Ea(){so(),C(),s.on(no),s.onError=e=>{let a=e&&/quota/i.test(String(e.name||e.message)),t=e&&/permission/i.test(String(e.code||e.message));v(a?"Mem\xF3ria do aparelho cheia: use logos menores ou ative a nuvem":t?"Sem permiss\xE3o na nuvem: confira as regras do Firebase":"N\xE3o foi poss\xEDvel salvar. Verifique a conex\xE3o.",{ms:5e3})},Aa(),s.on(Aa),s.on(()=>Ye(s.me?s.eventsOn(_(),{person:s.me}).filter(e=>e.status!=="feito").length:0)),setInterval(()=>{let e=document.activeElement,a=e&&/INPUT|TEXTAREA|SELECT/.test(e.tagName);h.tab==="hoje"&&!ze().length&&!a&&C(),_a()},6e4),_a(),document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&(h.date<_()&&h.tab==="hoje"&&(h.date=_()),C())}),s.mode==="cloud"&&R()&&(s.hooks.eventChange=ga,ha(({ok:e,missing:a,error:t})=>{if(t)return v(`Aviso n\xE3o enviado: ${t}`,{ms:6e3});if(a.length)return v(`${a.join(" e ")} ainda n\xE3o ativou as notifica\xE7\xF5es no celular (Ajustes \u2192 Notifica\xE7\xF5es \u2192 Ativar)`,{ms:8e3});e.length&&v(`Aviso enviado para ${e.join(" e ")} \u2713`,{ms:3500})}),s.hooks.activity=ba,s.hooks.ask=async(e,a)=>{let t=new Date,o=ya({events:s.state.events,companies:s.state.companies,routine:P(),notes:s.state.notes,team:s.team,me:s.me,now:{date:_(),minutes:t.getHours()*60+t.getMinutes()}});return(await J("/ask",{question:e,history:a,context:o})).answer},s.on(se),se(),setInterval(se,15*6e4)),ia().then(()=>setTimeout(()=>la().catch(e=>console.warn("rotina",e)),1500)).catch(e=>console.warn("pr\xE9-cadastro",e)),setTimeout(Yt,600),s.mode==="cloud"&&V()==="granted"&&Se().catch(()=>{}),setTimeout(()=>mt(),300)}var lt=null;function Aa(){if(!s.me)return;let e=Bt(s.me,14),a=o=>o.date+":"+o.ids.slice().sort().join("|"),t=new Set(e.map(a));if(lt){let o=e.find(l=>!lt.has(a(l))&&l.ids.some(i=>s.event(i)?.updatedBy&&s.event(i).updatedBy!==s.me));o&&v(`Aten\xE7\xE3o: ${o.title} (${o.date.slice(8)}/${o.date.slice(5,7)})`,{action:"Ver",onAction:()=>{h.date=o.date,h.person="all",ue("hoje")},ms:7e3})}lt=t}async function co(){let e=location.hash||"",a=A.firebase;if(e.startsWith("#/c/")||e.startsWith("#/v/")){ct("Carregando cronograma\u2026");let i=!!(localStorage.getItem("pauta.me")||localStorage.getItem("cal.team"));try{if(e.startsWith("#/v/")){let d=await xt(e.slice(4));return Ke(O,Re(d),{canGoBack:i})}if(!a)return ye(O,"Este link precisa da sincroniza\xE7\xE3o na nuvem ativada.");let{fetchPublic:n}=await import("./c-43VYY7Q5.js"),m=await n(a,e.slice(4));return m?Ke(O,Re(m),{canGoBack:i}):ye(O,"Este link n\xE3o existe mais. Pe\xE7a um novo link para a equipe.")}catch(n){return console.error(n),ye(O,"N\xE3o foi poss\xEDvel abrir o cronograma. Verifique a conex\xE3o e tente novamente.")}}if(!a)return await Tt(),Ea();ct("Conectando \xE0 nuvem\u2026");let t=(i,n)=>Promise.race([i,new Promise((m,d)=>setTimeout(()=>d(new Error("tempo esgotado")),n))]);try{let{connect:i}=await import("./c-43VYY7Q5.js");Z=await t(i(a),15e3)}catch(i){return console.error(i),xa(i)}let o=!1,l=!1;setTimeout(()=>{o||xa(new Error("o login n\xE3o respondeu"))},25e3),Z.onUser(async i=>{if(o=!0,!i)return l?location.reload():Ne();if(l)return;if(!A.team.some(m=>m.email&&m.email.toLowerCase()===(i.email||"").toLowerCase()))return dt=`O e-mail ${i.email} n\xE3o faz parte da equipe deste app.`,await Z.signOut(),Ne();l=!0;try{localStorage.setItem("cal.team","1")}catch{}ct("Entrando\u2026");try{await Promise.race([jt(Z.backend,i),new Promise(m=>setTimeout(m,12e3))])}catch(m){console.error(m),setTimeout(()=>v("N\xE3o consegui carregar os dados agora. Verifique a internet.",{ms:6e3}),800)}Ea()})}navigator.serviceWorker?.addEventListener("message",e=>{if(e.data?.type==="open"&&e.data.url){let a=e.data.url.split("#")[1];a&&mt("#"+a)}});window.addEventListener("hashchange",()=>{if(/^#\/(e|d)\//.test(location.hash))return mt();/^#\/(c|v)\//.test(location.hash)&&location.reload()});"serviceWorker"in navigator&&location.protocol!=="file:"&&navigator.serviceWorker.register("sw.js").catch(()=>{});co();
