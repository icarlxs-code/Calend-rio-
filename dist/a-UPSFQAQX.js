import{A as Ve,C as Ot,D as Pt,E as Ue,a as kt,b as s,c as Et,d as At,e as f,f as Le,g as M,h as Tt,i as Re,j as Be,k as He,l as jt,m as Fe,n as Ct,o as v,p as le,q as Dt,r as O,s as W,t as q,u as Mt,v as te,w as qt,x as de,y as Nt,z as ve}from"./c-EJYUXBR7.js";import{f as Ie}from"./c-4OPZHBQG.js";import{a as ze,b as ye}from"./c-QNJTKFWY.js";import{A as h,C as wt,E as _t,G as ee,H as u,a as mt,b as K,c as w,d as _,e as pt,f as ie,g as Oe,h as ut,i as j,j as he,k as F,l as S,m as ht,n as Z,o as ft,p as fe,q as re,r as gt,s as bt,t as $t,u as ge,v as G,w as vt,x as yt,y as be}from"./c-SIJUFJQD.js";import{a as T,b as St,c as ce,d as $e,l as Pe,m as xt}from"./c-3GA6RSWB.js";import{a as A}from"./c-W6W2IM5K.js";import"./c-VHNSBD2M.js";var Aa=(e,t)=>e&&t&&e[0]<t[1]&&t[0]<e[1],Y=e=>s.member(e)?.name||e,we=e=>["shoot","meeting"].includes(T[e.type]?.kind);function _e(e,t){let a=[],o=O(),l=s.eventsOn(t,{person:e}).filter(n=>n.time&&n.status!=="feito");for(let n=0;n<l.length;n++)for(let d=n+1;d<l.length;d++){let m=l[n],c=l[d];if(!Aa(W(m),W(c)))continue;let r=we(m)?m:we(c)?c:null,p=r===m?c:m,$,x;r&&ce(p.type)?($=`${Y(e)}: post durante ${T[r.type].label.toLowerCase()}`,x=`\u201C${q(p)}\u201D \xE0s ${S(p.time)} cai no meio de \u201C${q(r)}\u201D (${S(r.time)}\u2013${S(he(W(r)[1]))}).`):r&&we(p)?($=`${Y(e)} em dois lugares ao mesmo tempo`,x=`\u201C${q(m)}\u201D (${S(m.time)}) e \u201C${q(c)}\u201D (${S(c.time)}) se sobrep\xF5em.`):($=`${Y(e)}: duas tarefas no mesmo hor\xE1rio`,x=`\u201C${q(m)}\u201D (${S(m.time)}) e \u201C${q(c)}\u201D (${S(c.time)}).`),a.push({level:"warn",kind:"conflict",icon:"alert",ids:[m.id,c.id],title:$,text:x,fixes:qt(e,m,c)})}let i=l.filter(we);for(let n=0;n<i.length-1;n++){let d=i[n],m=i[n+1],c=j(m.time)-W(d)[1];(d.location||d.companyId)!==(m.location||m.companyId)&&c>=0&&c<o.travelMin&&a.push({level:"warn",kind:"conflict",icon:"route",ids:[d.id,m.id],title:`${Y(e)}: pouco tempo de deslocamento`,text:`S\xF3 ${c} min entre \u201C${q(d)}\u201D e \u201C${q(m)}\u201D, em lugares diferentes (combinado: ${o.travelMin} min).`,fixes:[{label:`Mover para ${S(he(W(d)[1]+o.travelMin))}`,eventId:m.id,patch:{time:he(Math.ceil((W(d)[1]+o.travelMin)/15)*15)}}]})}return a}function It(e,t="all"){let a=[],o=t==="all"?s.team.map(c=>c.id):[t];o.forEach(c=>a.push(..._e(c,e)));let l=O(),i=s.eventsOn(e,{person:t}),n={};if(i.filter(c=>c.time&&["feed","reels","carrossel"].includes(c.type)).forEach(c=>(n[c.companyId]||=[]).push(c)),Object.values(n).forEach(c=>{for(let r=0;r<c.length-1;r++){let p=j(c[r+1].time)-j(c[r].time);p<180&&a.push({level:"info",icon:"clock",ids:[c[r].id,c[r+1].id],title:`${s.company(c[r].companyId)?.name||"Empresa"}: posts muito pr\xF3ximos`,text:`Dois posts de feed/Reels com s\xF3 ${G(p)} de diferen\xE7a. Espacem ao menos 3 h para um n\xE3o \u201Croubar\u201D o alcance do outro.`})}}),e===w()){let c=i.filter(r=>r.time&&r.status==="pendente"&&j(r.time)+15<F());c.length&&a.unshift({level:"warn",kind:"late",icon:"flag",ids:c.map(r=>r.id),title:c.length===1?"1 tarefa atrasada":`${c.length} tarefas atrasadas`,text:c.map(r=>`${S(r.time)} ${q(r)}`).join(" \xB7 ")+". Marque como feito ou reagende."})}let d=i.filter(c=>!(c.assignees||[]).length);if(d.length&&t==="all"&&a.push({level:"warn",icon:"user",ids:d.map(c=>c.id),title:"Tarefa sem respons\xE1vel",text:d.map(c=>`${S(c.time)} ${q(c)}`).join(" \xB7 ")+". Definam quem vai fazer."}),t==="all"&&s.team.length===2){let[c,r]=s.team,p=s.eventsOn(e,{person:c.id}).length,$=s.eventsOn(e,{person:r.id}).length;if(Math.abs(p-$)>=4){let[x,D]=p>$?[c,r]:[r,c];a.push({level:"info",icon:"users",title:"Dia desequilibrado",text:`${x.name} tem ${Math.max(p,$)} tarefas e ${D.name} tem ${Math.min(p,$)}. Que tal passar alguns stories para o ${D.name}?`})}}o.forEach(c=>{let r=te(c,e),p=s.eventsOn(e,{person:c}).length;!r.dayOff&&r.minutes!=null&&p&&r.longest<45&&a.push({level:"info",kind:"rest",icon:"clock",title:`${Y(c)} est\xE1 sem pausa`,text:`O maior intervalo livre do dia \xE9 de ${G(r.longest)}. Programem posts com anteced\xEAncia para abrir espa\xE7o.`}),r.dayOff&&p&&a.push({level:"info",kind:"rest",icon:"clock",title:`${Y(c)}: dia de folga`,text:`H\xE1 ${p} tarefa${p>1?"s":""} marcada${p>1?"s":""} na folga. Posts podem ficar programados para ningu\xE9m trabalhar.`}),p>l.maxTasks&&a.push({level:"warn",kind:"rest",icon:"alert",title:`${Y(c)} sobrecarregado`,text:`${p} tarefas (limite combinado: ${l.maxTasks}).`})}),s.eventsOn(_(e,1),{person:t}).filter(c=>c.type==="captacao").forEach(c=>{let r=s.company(c.companyId);a.push({level:"prep",icon:"camera",ids:[c.id],title:`Amanh\xE3: capta\xE7\xE3o${r?" na "+r.name:""} \xE0s ${S(c.time)}`,text:"Hoje: carregue baterias, esvazie cart\xF5es de mem\xF3ria, confirme o hor\xE1rio com o cliente e defina o roteiro de tomadas."})}),!a.some(c=>c.kind==="conflict")&&i.length&&a.push({level:"ok",icon:"check",title:"Agenda sem conflitos",text:"Ningu\xE9m est\xE1 em dois lugares ao mesmo tempo."});let m=Math.abs(ut("2024-01-01",e))%Pe.length;return a.push({level:"tip",icon:"bulb",title:"Dica do dia",text:Pe[m]}),a}function Lt(e,t=14){let a=[],o=w();for(let l=0;l<t;l++){let i=_(o,l);_e(e,i).forEach(n=>a.push({...n,date:i}))}return a}function Rt(e="all"){let t=w(),a=F();return s.eventsOn(t,{person:e}).find(o=>o.time&&o.status!=="feito"&&j(o.time)+$e(o)>a)||null}function Bt(){return`<div class="seg" role="tablist">
    ${[{id:"all",name:"Todos"},...s.team].map(t=>`<button class="seg__btn${f.person===t.id?" is-on":""}" data-action="set-person" data-p="${t.id}">
      ${t.id==="all"?u("users",15):M(t.id,18)}<span>${h(t.name)}${s.me===t.id?"<em> (voc\xEA)</em>":""}</span></button>`).join("")}
  </div>`}function Ta(e,t=4){let a=[];return e.forEach(o=>{a.includes(o.companyId)||a.push(o.companyId)}),a.slice(0,t).map(o=>`<i style="background:${s.company(o)?.color||"#999"}"></i>`).join("")}function Ht(){let e=f.date,t=w(),a=s.eventsOn(e,{person:f.person}),o=It(e,f.person),l=o.filter(b=>b.level==="warn"&&b.icon!=="flag").flatMap(b=>b.ids||[]),i=s.member(s.me),n=pt(e),d=Array.from({length:7},(b,E)=>_(n,E)),m=(()=>{let b=K(d[0]),E=K(d[6]);return b.getMonth()===E.getMonth()?`${b.getDate()}\u2013${E.getDate()} de ${fe[E.getMonth()]}`:`${b.getDate()} ${fe[b.getMonth()]} \u2013 ${E.getDate()} ${fe[E.getMonth()]}`})(),c=`
  <header class="hdr">
    <div class="hdr__row">
      <div class="hdr__titles">
        <p class="hdr__eyebrow">${e===t?`${yt()}${i?", "+h(i.name):""}`:h(re(e))}</p>
        <h1>${h($t(e))}${e===t?`<span class="hdr__date">${h(gt(e))}</span>`:""}</h1>
      </div>
      <div class="hdr__actions">
        ${e!==t?'<button class="chip chip--accent" data-action="go-today">Hoje</button>':""}
        <button class="iconbtn iconbtn--ai" data-action="assistant" aria-label="Assistente">${u("sparkle",20)}</button>
        <button class="iconbtn" data-action="tab" data-tab="ajustes" aria-label="Perfil">${i?M(i.id,34):u("user",20)}</button>
      </div>
    </div>
    ${Bt()}
    <div class="week">
      <div class="week__bar">
        <button class="iconbtn iconbtn--sm" data-action="week" data-n="-7" aria-label="Semana anterior">${u("left",18)}</button>
        <span>${h(m)}</span>
        <button class="iconbtn iconbtn--sm" data-action="week" data-n="7" aria-label="Pr\xF3xima semana">${u("right",18)}</button>
      </div>
      <div class="week__days" data-swipe="week">
        ${d.map(b=>{let E=K(b),L=s.eventsOn(b,{person:f.person}),k=L.filter(ne=>ne.status!=="feito").length;return`<button class="wday${b===e?" is-sel":""}${b===t?" is-today":""}" data-action="set-date" data-k="${b}">
            <span class="wday__l">${Z[E.getDay()]}</span>
            <span class="wday__n">${E.getDate()}</span>
            <span class="wday__dots">${Ta(L,3)}${L.length?"":'<i class="none"></i>'}</span>
            ${k?`<span class="sr">${k} pendentes</span>`:""}
          </button>`}).join("")}
      </div>
    </div>
  </header>`,r={};a.forEach(b=>r[b.type]=(r[b.type]||0)+1);let p=a.filter(b=>b.status==="feito").length,$=a.length?Math.round(p/a.length*100):0,x=a.length?`<div class="summary">
        <div class="summary__progress">
          <div class="ring" style="--p:${$}"><span>${$}%</span></div>
          <div><strong>${p} de ${a.length}</strong><small>tarefas conclu\xEDdas</small></div>
        </div>
        <div class="summary__types">
          ${Object.entries(r).sort((b,E)=>E[1]-b[1]).map(([b,E])=>`<span class="tcount tbadge--${b}">${u(T[b].icon,13)}<b>${E}</b> ${T[b].label}</span>`).join("")}
        </div>
      </div>`:"",D=f.person==="all"?`<section class="block">
      <h2 class="block__title">${u("route",16)} Onde cada um vai estar</h2>
      <div class="team">${s.team.map(b=>ja(b,e)).join("")}</div>
    </section>`:"",g="";if(e===t){let b=Rt(f.person);if(b){let E=s.company(b.companyId),L=j(b.time)-F(),k=E?.color||"#555";g=`<button class="next" style="--cc:${k};--cc-soft:${wt(k,.12)}" data-action="open-event" data-id="${b.id}">
        <div class="next__label">${u("bell",14)} ${L>0?"Pr\xF3ximo \xB7 "+vt(L):"Acontecendo agora"}</div>
        <div class="next__row">
          ${Re(E,44)}
          <div class="next__txt">
            <strong>${S(b.time)} \xB7 ${h(T[b.type].label)} \xB7 ${h(E?.name||"")}</strong>
            <span>${h(b.title||"")}</span>
          </div>
          ${Tt(b.assignees,26)}
        </div>
        ${b.location?`<div class="next__loc">${u("pin",13)} ${h(b.location)}</div>`:""}
      </button>`}}let I=f.showAllTips?o:o.filter((b,E)=>b.level==="warn"||E<2),y=o.length-I.length,se=`<section class="block">
    <h2 class="block__title">${u("bulb",16)} Dicas e alertas</h2>
    <div class="tips">${I.map(Ca).join("")}</div>
    ${y>0?`<button class="btn-text btn-text--sm" data-action="toggle-tips">Ver mais ${y} dica${y>1?"s":""}</button>`:f.showAllTips&&o.length>2?'<button class="btn-text btn-text--sm" data-action="toggle-tips">Mostrar menos</button>':""}
  </section>`,H;if(!a.length)H=He("Dia livre",f.person==="all"?"Nada agendado para este dia.":`Nada agendado para ${s.member(f.person)?.name}.`,`<button class="btn btn--primary" data-action="new-event" data-date="${e}">${u("plus",18)} Adicionar</button>`);else{let b=[{k:"Manh\xE3",icon:"sun",items:a.filter(k=>k.time&&j(k.time)<720)},{k:"Tarde",items:a.filter(k=>k.time&&j(k.time)>=720&&j(k.time)<1080)},{k:"Noite",items:a.filter(k=>k.time&&j(k.time)>=1080)},{k:"Sem hor\xE1rio",items:a.filter(k=>!k.time)}],E=F(),L=e!==t;H=b.filter(k=>k.items.length).map(k=>`
      <div class="tl-group">
        <h3 class="tl-group__h">${k.k}<span>${k.items.length}</span></h3>
        ${k.items.map(ne=>{let dt="";return!L&&ne.time&&j(ne.time)>E&&(L=!0,dt=`<div class="nowline"><span>Agora \xB7 ${S(`${String(new Date().getHours()).padStart(2,"0")}:${String(new Date().getMinutes()).padStart(2,"0")}`)}</span></div>`),dt+Be(ne,{highlight:l})}).join("")}
      </div>`).join(""),!L&&e===t&&(H+=`<div class="nowline nowline--end"><span>Agora \xB7 ${S(`${String(new Date().getHours()).padStart(2,"0")}:${String(new Date().getMinutes()).padStart(2,"0")}`)} \xB7 fim da agenda</span></div>`)}let qe=s.notesOn(e),Ne=`<section class="block">
    <h2 class="block__title">${u("note",16)} Bilhetes do dia</h2>
    <div class="notes">
      ${qe.map(b=>`<div class="note">
        <p>${h(b.text)}</p>
        <footer>${M(b.author,18)}<span>${h(s.member(b.author)?.name||"")}</span>
          <button class="note__del" data-action="del-note" data-id="${b.id}" aria-label="Apagar bilhete">${u("x",14)}</button></footer>
      </div>`).join("")}
      <form class="note-add" data-form="note">
        <input name="text" placeholder="Escreva um bilhete para a dupla\u2026" autocomplete="off" maxlength="280">
        <button class="iconbtn iconbtn--accent" aria-label="Adicionar bilhete">${u("plus",18)}</button>
      </form>
    </div>
  </section>`;return`${c}
  <div class="page">
    ${s.demo?Da():""}
    ${g}
    <button class="brief" data-action="assistant">
      <span class="brief__ic">${u("sparkle",18)}</span>
      <div><strong>Assistente</strong>${de(e,f.person).map(b=>`<p>${h(b)}</p>`).join("")}</div>
      ${u("right",18,"muted")}
    </button>
    ${D}
    <section class="block">
      <h2 class="block__title">${u("clock",16)} Agenda ${f.person==="all"?"da dupla":"de "+h(s.member(f.person)?.name||"")}</h2>
      ${x}
      ${H}
    </section>
    ${se}
    ${Ne}
  </div>`}function ja(e,t){let a=s.eventsOn(t,{person:e.id}),o=t===w()?F():-1,l=a.filter(c=>["shoot","meeting"].includes(T[c.type]?.kind)),i=a.filter(c=>ce(c.type)).length,n=a.find(c=>c.time&&c.status!=="feito"&&j(c.time)+$e(c)>o),d=te(e.id,t),m=d.dayOff?"Folga":`${G(Math.round(d.minutes/15)*15)||"0 min"} livres`;return`<button class="team__col" data-action="set-person" data-p="${e.id}">
    <span class="team__free ${d.dayOff?"is-off":d.minutes>=240?"is-good":d.minutes>=120?"is-mid":"is-low"}">${u("clock",12)} ${m}</span>
    <div class="team__head">${M(e.id,30)}<div><strong>${h(e.name)}</strong><small>${a.length} tarefa${a.length===1?"":"s"} \xB7 ${i} post${i===1?"":"s"}</small></div></div>
    <ul class="team__where">
      ${l.length?l.map(c=>`<li>${u(T[c.type].icon,13)}<span><b>${S(c.time)}</b> ${h(s.company(c.companyId)?.name||"")}</span></li>`).join(""):`<li class="muted">${u("building",13)}<span>Trabalho interno / remoto</span></li>`}
    </ul>
    ${n?`<div class="team__next">Pr\xF3ximo: <b>${S(n.time)}</b> ${h(T[n.type].label)} \xB7 ${h(s.company(n.companyId)?.name||"")}</div>`:`<div class="team__next muted">${a.length?"Tudo conclu\xEDdo \u2713":"Livre"}</div>`}
  </button>`}function Ca(e){let t=e.fixes?.length?`<div class="fixes">${e.fixes.map(a=>`<button class="fixbtn" data-action="apply-fix" data-id="${a.eventId}" data-patch="${h(JSON.stringify(a.patch))}">${u("check",13)} ${h(a.label)}</button>`).join("")}</div>`:"";return`<div class="tip tip--${e.level}"${e.ids?.length===1&&!t?` data-action="open-event" data-id="${e.ids[0]}"`:""}>
    <span class="tip__ic">${u(e.icon,16)}</span>
    <div><strong>${h(e.title)}</strong><p>${h(e.text)}</p>${t}</div>
  </div>`}function Da(){return`<div class="banner">
    ${u("sparkle",18)}
    <p><strong>Voc\xEA est\xE1 vendo dados de exemplo.</strong> Explore \xE0 vontade e, quando quiser come\xE7ar de verdade, apague os exemplos.</p>
    <button class="btn btn--soft btn--sm" data-action="clear-demo">Apagar exemplos</button>
  </div>`}function Ft(){let e=f.month,[t,a]=e.split("-").map(Number),o=new Date(t,a-1,1),l=_(mt(o),-o.getDay()),i=w(),n=Array.from({length:42},(y,se)=>_(l,se)),m=n.slice(35).some(y=>y.slice(0,7)===e)?n:n.slice(0,35),c={person:f.person,companyId:f.monthCompany},r=s.companiesSorted(),p=f.monthSel,$=s.eventsOn(p,c),x=s.eventsBetween(`${e}-01`,`${e}-31`,c),D=x.filter(y=>ce(y.type)).length,g=x.filter(y=>y.type==="captacao").length,I=x.filter(y=>y.type==="reuniao").length;return`
  <header class="hdr">
    <div class="hdr__row">
      <div class="hdr__titles">
        <p class="hdr__eyebrow">Calend\xE1rio</p>
        <h1>${h(bt(e).split(" ")[0])}<span class="hdr__date">${e.slice(0,4)}</span></h1>
      </div>
      <div class="hdr__actions">
        <button class="iconbtn" data-action="month" data-n="-1" aria-label="M\xEAs anterior">${u("left",20)}</button>
        <button class="chip" data-action="month-today">Hoje</button>
        <button class="iconbtn" data-action="month" data-n="1" aria-label="Pr\xF3ximo m\xEAs">${u("right",20)}</button>
      </div>
    </div>
    ${Bt()}
  </header>
  <div class="page">
    <div class="chips-scroll">
      <button class="chip${f.monthCompany?"":" is-on"}" data-action="month-company" data-id="">Todas as empresas</button>
      ${r.map(y=>`<button class="chip chip--co${f.monthCompany===y.id?" is-on":""}" style="--cc:${y.color}" data-action="month-company" data-id="${y.id}">${Re(y,18,5)}${h(y.name)}</button>`).join("")}
    </div>

    <div class="mstats">
      <div><b>${D}</b><span>posts</span></div>
      <div><b>${g}</b><span>capta\xE7\xF5es</span></div>
      <div><b>${I}</b><span>reuni\xF5es</span></div>
      <div><b>${x.filter(y=>y.status==="feito").length}/${x.length}</b><span>conclu\xEDdos</span></div>
    </div>

    <div class="month" data-swipe="month">
      <div class="month__wd">${ft.map(y=>`<span>${y}</span>`).join("")}</div>
      <div class="month__grid">
        ${m.map(y=>{let se=y.slice(0,7)===e,H=s.eventsOn(y,c),qe=H.some(Ne=>Ne.type==="captacao");return`<button class="mday${se?"":" is-out"}${y===i?" is-today":""}${y===p?" is-sel":""}" data-action="month-select" data-k="${y}">
            <span class="mday__n">${Number(y.slice(8))}</span>
            ${H.length?`<span class="mday__bars">${Ma(H)}</span><span class="mday__count">${qe?u("camera",10):""}${H.length}</span>`:""}
          </button>`}).join("")}
      </div>
    </div>

    <section class="block">
      <div class="block__row">
        <h2 class="block__title">${h(ge(p))}</h2>
        <button class="btn-text btn-text--sm" data-action="open-day" data-k="${p}">Abrir dia ${u("right",14)}</button>
      </div>
      ${$.length?$.map(y=>Be(y)).join(""):He("Nada neste dia","Toque no + para agendar.",`<button class="btn btn--soft" data-action="new-event" data-date="${p}">${u("plus",16)} Novo evento</button>`)}
    </section>

    ${r.length?`<section class="block">
      <h2 class="block__title">Legenda</h2>
      <div class="legend">${r.map(y=>`<span><i style="background:${y.color}"></i>${h(y.name)}</span>`).join("")}</div>
    </section>`:""}
  </div>`}function Ma(e){let t={};return e.forEach(a=>t[a.companyId]=(t[a.companyId]||0)+1),Object.entries(t).slice(0,4).map(([a])=>`<i style="background:${s.company(a)?.color||"#999"}"></i>`).join("")}var zt="pauta.device",Ut="pauta.notifyPrefs",R=()=>{try{if(["localhost","127.0.0.1"].includes(location.hostname)&&localStorage.getItem("cal.pushServer"))return localStorage.getItem("cal.pushServer")}catch{}return(A.pushServer||"").replace(/\/+$/,"")},qa=()=>/iPhone|iPad|iPod/.test(navigator.userAgent)||navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1,Na=()=>"serviceWorker"in navigator&&"PushManager"in window&&"Notification"in window,V=()=>"Notification"in window?Notification.permission:"unsupported",me=()=>qa()&&!ee(),Ke=()=>{try{return{reminders:!0,partner:!0,daily:!0,...JSON.parse(localStorage.getItem(Ut)||"{}")}}catch{return{reminders:!0,partner:!0,daily:!0}}},Vt=e=>{let t="=".repeat((4-e.length%4)%4),a=atob((e+t).replace(/-/g,"+").replace(/_/g,"/"));return Uint8Array.from(a,o=>o.charCodeAt(0))},Oa=async e=>{let t=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(e));return"d_"+Array.from(new Uint8Array(t).slice(0,16),a=>a.toString(16).padStart(2,"0")).join("")};async function J(e,t){if(!R())throw Object.assign(new Error("Servidor de avisos n\xE3o configurado."),{code:"no-server"});let a=await s.idToken();if(!a)throw Object.assign(new Error("Fa\xE7a login para usar."),{code:"no-login"});let o=await fetch(R()+e,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${a}`},body:JSON.stringify(t||{})}),l=await o.json().catch(()=>({}));if(!o.ok)throw Object.assign(new Error(l.error||`Erro ${o.status}`),{status:o.status});return l}async function ke(){return me()?{ok:!1,reason:"install"}:Na()?await Notification.requestPermission()!=="granted"?{ok:!1,reason:"denied"}:s.mode!=="cloud"||!R()?{ok:!0,local:!0}:Se():{ok:!1,reason:"unsupported"}}async function Se(){if(s.mode!=="cloud"||!R()||V()!=="granted"||!s.me)return{ok:!1,reason:"not-ready"};let e;try{e=(await(await fetch(R()+"/vapid")).json()).publicKey}catch{return{ok:!1,reason:"server"}}if(!e)return{ok:!1,reason:"server"};let t=await navigator.serviceWorker.ready,a=await t.pushManager.getSubscription();if(a&&a.options?.applicationServerKey){let i=new Uint8Array(a.options.applicationServerKey),n=Vt(e);(i.length!==n.length||i.some((d,m)=>d!==n[m]))&&(await a.unsubscribe(),a=null)}a||(a=await t.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:Vt(e)}));let o=a.toJSON(),l=await Oa(o.endpoint);return await J("/subscribe",{id:l,subscription:{endpoint:o.endpoint,keys:o.keys},prefs:Ke()}),localStorage.setItem(zt,l),{ok:!0,id:l}}async function Kt(e){localStorage.setItem(Ut,JSON.stringify(e)),s.mode==="cloud"&&V()==="granted"&&await Se().catch(()=>{})}async function xe(){return s.mode==="cloud"&&R()?localStorage.getItem(zt)?{kind:"server",...await J("/test")}:{kind:"not-registered"}:(await(await navigator.serviceWorker.ready).showNotification("Notifica\xE7\xF5es ativadas \u2713",{body:"\xC9 assim que os lembretes v\xE3o chegar.",icon:"icons/icon-192.png",badge:"icons/icon-192.png",tag:"teste"}),{kind:"local"})}function Ge(e){try{if(!("setAppBadge"in navigator))return;e>0?navigator.setAppBadge(e).catch(()=>{}):navigator.clearAppBadge().catch(()=>{})}catch{}}var Qe="pauta.onboarded",Ee="pauta.notifyAskedAt";function Gt(){if(!localStorage.getItem(Qe))return Je(s.me?["welcome","notify","done"]:["welcome","who","notify","done"]);if(!s.me&&s.mode==="local")return Je(["who"]);let t=Number(localStorage.getItem(Ee)||0);if(ee()&&V()==="default"&&Date.now()-t>3*864e5)return Je(["notify"])}function Ye(e,t,a="agora"){return`<div class="nprev">
    <img src="icons/icon-192.png" alt="">
    <div><div class="nprev__top"><b>${h(A.appName.toUpperCase())}</b><span>${h(a)}</span></div>
    <strong>${h(e)}</strong><p>${h(t)}</p></div>
  </div>`}function Pa(e,t,a){let o=s.member(s.me),l=s.team.find(n=>n.id!==s.me)||s.team[1]||s.team[0],i=a>1?`<div class="ob__dots">${Array.from({length:a},(n,d)=>`<i class="${d===t?"is-on":""}"></i>`).join("")}</div>`:"";return e==="welcome"?`<div class="ob__art"><img class="ob__icon" src="icons/icon-512.png" alt=""></div>
      <h1>Bem-vindo ao ${h(A.appName)}</h1>
      <p>A agenda de conte\xFAdo de ${h(A.agencyName)}: posts, stories, reels e capta\xE7\xF5es de todas as empresas, num lugar s\xF3.</p>
      ${i}
      <button class="btn btn--primary btn--block" data-next>Come\xE7ar</button>`:e==="who"?`<div class="ob__art ob__art--sm">${u("user",34)}</div>
      <h1>Quem vai usar este celular?</h1>
      <p>Assim o app sabe de quem s\xE3o os lembretes e avisa o parceiro quando voc\xEA marcar algo.</p>
      <div class="whogrid ob__who">${s.team.map(n=>`<button class="whobtn${s.me===n.id?" is-on":""}" style="--mc:${n.color}" data-me="${n.id}">${M(n.id,36)}<span>${h(n.name)}</span><i class="whobtn__check">${u("check",14)}</i></button>`).join("")}</div>
      ${i}
      <button class="btn btn--primary btn--block" data-next ${s.me?"":"disabled"}>Continuar</button>`:e==="notify"?`<div class="ob__previews">
        ${Ye("Daqui a 2h: Reels \xB7 Pura Vida","18h \u2014 postar o Reels \u201CBastidores\u201D","agora")}
        ${Ye(`${l?.name||"Seu parceiro"} marcou para voc\xEA`,"Story \xB7 Caf\xE9 Aroma \u2014 amanh\xE3, 16h","h\xE1 2 min")}
        ${Ye(`Bom dia, ${o?.name||"Henrique"}! Seu dia hoje`,"5 tarefas \xB7 primeira: 11h30 Feed \xB7 Studio Fit","8:00")}
      </div>
      <h1>Nunca mais esque\xE7a um post</h1>
      <p>Lembretes 2h e 30 min antes de cada post, aviso na v\xE9spera das capta\xE7\xF5es, cobran\xE7a se algo ficou para tr\xE1s e aviso quando o parceiro marcar algo para voc\xEA.</p>
      <div data-notify-msg></div>
      ${i}
      <button class="btn btn--primary btn--block" data-enable>${u("bell",18)} Ativar notifica\xE7\xF5es</button>
      <button class="btn btn--ghost btn--block" data-skip>Agora n\xE3o</button>`:`<div class="ob__art ob__art--ok">${u("check",40)}</div>
    <h1>Tudo pronto${o?", "+h(o.name):""}!</h1>
    <ul class="ob__tips">
      <li>${u("plus",18)}<span>Toque no <b>+</b> para marcar posts, capta\xE7\xF5es e reuni\xF5es.</span></li>
      <li>${u("sparkle",18)}<span>O <b>Assistente</b> avisa conflitos e sugere os melhores hor\xE1rios.</span></li>
      <li>${u("link",18)}<span>Em <b>Empresas</b>, mande para cada cliente o link do cronograma dele.</span></li>
    </ul>
    ${i}
    <button class="btn btn--primary btn--block" data-next>Abrir a agenda</button>`}function Je(e){if(document.querySelector(".ob"))return;let t=0,a=document.createElement("div");a.className="ob",a.innerHTML='<div class="ob__card"></div>',document.body.appendChild(a),requestAnimationFrame(()=>a.classList.add("is-in"));let o=a.querySelector(".ob__card"),l=()=>{(e.includes("welcome")||e.includes("done"))&&localStorage.setItem(Qe,"1"),a.classList.remove("is-in"),setTimeout(()=>a.remove(),400)},i=m=>{if(m>=e.length)return l();t=m,o.classList.remove("is-shown"),setTimeout(()=>{o.innerHTML=Pa(e[t],t,e.length),d(),o.classList.add("is-shown")},o.innerHTML?180:0)},n=(m,c="info")=>{let r=o.querySelector("[data-notify-msg]");r&&(r.innerHTML=`<div class="ob__msg ob__msg--${c}">${m}</div>`)},d=()=>{o.querySelectorAll("[data-next]").forEach(r=>r.onclick=()=>i(t+1)),o.querySelectorAll("[data-me]").forEach(r=>r.onclick=()=>{s.setMe(r.dataset.me),o.querySelectorAll("[data-me]").forEach(p=>p.classList.toggle("is-on",p===r)),o.querySelector("[data-next]").disabled=!1});let m=o.querySelector("[data-skip]");m&&(m.onclick=()=>{localStorage.setItem(Ee,String(Date.now())),i(t+1)});let c=o.querySelector("[data-enable]");c&&(c.onclick=async()=>{if(localStorage.setItem(Ee,String(Date.now())),me()){n(`<b>Primeiro instale o app.</b> No iPhone, as notifica\xE7\xF5es s\xF3 funcionam pelo \xEDcone da Tela de In\xEDcio:<br>
          1. Toque em ${u("share",14)} <b>Compartilhar</b><br>2. <b>Adicionar \xE0 Tela de In\xEDcio</b><br>3. Abra o ${h(A.appName)} pelo \xEDcone`,"warn"),c.outerHTML='<button class="btn btn--primary btn--block" data-next>Entendi</button>',d();return}c.disabled=!0,c.innerHTML="Aguardando permiss\xE3o\u2026";let r=await ke().catch(()=>({ok:!1,reason:"error"}));r.ok?(r.local?n("Ativado neste celular. Para os avisos chegarem com o app fechado e no celular do parceiro, falta ligar o servidor de notifica\xE7\xF5es (Ajustes \u2192 Notifica\xE7\xF5es).","ok"):(n("Pronto! Voc\xEA vai receber uma notifica\xE7\xE3o de teste em instantes.","ok"),xe().catch(()=>{})),c.outerHTML='<button class="btn btn--primary btn--block" data-next>Continuar</button>',o.querySelector("[data-skip]")?.remove(),d()):r.reason==="server"?(n("Permiss\xE3o concedida! O servidor de notifica\xE7\xF5es ainda n\xE3o foi publicado; quando for, este celular \xE9 cadastrado sozinho.","ok"),c.outerHTML='<button class="btn btn--primary btn--block" data-next>Continuar</button>',d()):r.reason==="denied"?(n(`As notifica\xE7\xF5es foram bloqueadas. Para ligar depois: <b>Ajustes do iPhone \u2192 Notifica\xE7\xF5es \u2192 ${h(A.appName)}</b>.`,"warn"),c.outerHTML='<button class="btn btn--primary btn--block" data-next>Continuar</button>',d()):(n("Este aparelho n\xE3o aceita notifica\xE7\xF5es deste app.","warn"),c.disabled=!1,c.innerHTML="Tentar de novo")})};i(0)}function Wt(){localStorage.removeItem(Qe),localStorage.removeItem(Ee),v("A apresenta\xE7\xE3o aparece na pr\xF3xima abertura")}function Yt(){let e=s.member(s.me),t=s.mode==="cloud",a="Notification"in window&&Notification.permission==="granted";return`
  <header class="hdr">
    <div class="hdr__row"><div class="hdr__titles"><p class="hdr__eyebrow">${h(A.appName)} \xB7 ${h(A.agencyName)}</p><h1>Ajustes</h1></div></div>
  </header>
  <div class="page">
    <section class="block">
      <h2 class="block__title">${u("user",16)} Quem est\xE1 usando este celular?</h2>
      ${t?`<div class="card card--row">${e?M(e.id,40):u("user",24)}<div><strong>${h(e?.name||s.user?.email||"")}</strong><small>${h(s.user?.email||"")}</small></div>
            <button class="btn btn--soft btn--sm" data-action="logout">${u("logout",16)} Sair</button></div>`:`<div class="whogrid">${s.team.map(o=>`<button class="whobtn${s.me===o.id?" is-on":""}" style="--mc:${o.color}" data-action="set-me" data-p="${o.id}">${M(o.id,34)}<span>${h(o.name)}</span><i class="whobtn__check">${u("check",14)}</i></button>`).join("")}</div>
           <p class="fhelp">Usado para sauda\xE7\xE3o, \u201CCriado por\u201D e nos lembretes.</p>`}
    </section>

    ${La()}

    <section class="block">
      <h2 class="block__title">${u("sparkle",16)} Assistente e Claude</h2>
      <div class="card card--row">
        ${u("sparkle",22)}
        <div><strong>Assistente autom\xE1tico ativo</strong><small>Confere conflitos, tempo livre e melhores hor\xE1rios sozinho, sem internet e sem chave.</small></div>
        <button class="btn btn--soft btn--sm" data-action="assistant">Abrir</button>
      </div>
      <p class="fhelp">Para perguntas abertas (ideias, reorganizar a semana), use \u201CPerguntar ao Claude\u201D no Assistente. Abre o Claude com o seu login normal, sem chave de API.</p>
    </section>

    ${Ia()}

    <section class="block">
      <h2 class="block__title">${u("calendar",16)} Lembretes no Calend\xE1rio do iPhone</h2>
      <div class="card">
        <p>Envie a agenda para o <b>Calend\xE1rio do iPhone</b> com alarmes. Assim o celular avisa na hora certa, mesmo com o app fechado.</p>
        <div class="btnrow">
          <button class="btn btn--primary btn--sm" data-action="ics" data-who="me" data-days="7">${u("download",16)} Minha semana</button>
          <button class="btn btn--soft btn--sm" data-action="ics" data-who="me" data-days="30">Meus 30 dias</button>
          <button class="btn btn--soft btn--sm" data-action="ics" data-who="all" data-days="7">Semana da dupla</button>
        </div>
        <p class="fhelp">No iPhone, toque em \u201CCalend\xE1rio\u201D ou abra o arquivo baixado e escolha \u201CAdicionar tudo\u201D. Se mudar algo depois, exporte de novo.</p>
      </div>
    </section>

    <section class="block">
      <h2 class="block__title">${u("cloud",16)} Sincroniza\xE7\xE3o</h2>
      <div class="card card--row ${t?"card--ok":"card--warn"}">
        ${u(t?"cloud":"phone",22)}
        <div><strong>${t?"Sincronizado na nuvem":"Salvo s\xF3 neste aparelho"}</strong>
        <small>${t?"Henrique, Matheus e os links dos clientes veem tudo em tempo real.":"Para Henrique e Matheus verem a mesma agenda em celulares diferentes, ative a nuvem (gratuito). Veja o guia no README do projeto."}</small></div>
      </div>
    </section>

    ${ee()?"":`<section class="block">
      <h2 class="block__title">${u("phone",16)} Instalar como app</h2>
      <div class="card">
        <ol class="steps">
          <li>Abra este endere\xE7o no <b>Safari</b>.</li>
          <li>Toque em ${u("share",15)} <b>Compartilhar</b>.</li>
          <li>Escolha <b>Adicionar \xE0 Tela de In\xEDcio</b>.</li>
        </ol>
        <p class="fhelp">O app abre em tela cheia, como um aplicativo normal.</p>
      </div>
    </section>`}

    <section class="block">
      <h2 class="block__title">${u("bulb",16)} Melhores hor\xE1rios (refer\xEAncia)</h2>
      <div class="card card--flush">
        <ul class="besttimes">
          ${xt.map(o=>`<li><span class="tbadge tbadge--${o.type}">${u(T[o.type].icon,13)}${T[o.type].label}</span><span>${h(o.text)}</span></li>`).join("")}
        </ul>
        <p class="fhelp pad">M\xE9dias de mercado. Confiram os Insights do Instagram de cada cliente e ajustem: cada p\xFAblico tem seu hor\xE1rio de pico.</p>
      </div>
    </section>

    <section class="block">
      <h2 class="block__title">${u("download",16)} Dados e backup</h2>
      <div class="list">
        <button class="list__row" data-action="export">${u("download",18)}<span>Exportar backup (.json)</span>${u("right",16,"muted")}</button>
        <label class="list__row">${u("upload",18)}<span>Importar backup</span><input type="file" accept="application/json,.json" data-action-change="import" hidden>${u("right",16,"muted")}</label>
        ${s.demo?`<button class="list__row" data-action="clear-demo">${u("sparkle",18)}<span>Apagar dados de exemplo</span>${u("right",16,"muted")}</button>`:""}
        <button class="list__row is-danger" data-action="clear-all">${u("trash",18)}<span>Apagar tudo</span>${u("right",16,"muted")}</button>
      </div>
      <p class="fhelp">${s.state.companies.length} empresas \xB7 ${s.state.events.length} eventos \xB7 ${s.state.notes.length} bilhetes</p>
    </section>
    <p class="about">${h(A.appName)} \u2014 agenda de conte\xFAdo \xB7 v1.0</p>
  </div>`}function Ia(){let e=V(),t=me(),a=s.mode==="cloud",o=!!localStorage.getItem("pauta.device"),l=Ke(),i,n,d="";return t?(i="warn",n="No iPhone, as notifica\xE7\xF5es s\xF3 funcionam com o app instalado: Compartilhar \u2192 Adicionar \xE0 Tela de In\xEDcio, e abra pelo \xEDcone."):e==="unsupported"?(i="warn",n="Este navegador n\xE3o aceita notifica\xE7\xF5es."):e==="denied"?(i="warn",n=`Bloqueadas. Para ligar: Ajustes do iPhone \u2192 Notifica\xE7\xF5es \u2192 ${A.appName}.`):e!=="granted"?(i="warn",n="Desativadas neste celular.",d='<button class="btn btn--primary btn--sm" data-action="notify-enable">Ativar</button>'):a&&o?(i="ok",n="Ativadas. Os lembretes e os avisos do parceiro chegam mesmo com o app fechado.",d='<button class="btn btn--soft btn--sm" data-action="notify-enable">Recadastrar</button>'):a?(i="warn",n="Permiss\xE3o concedida, mas este celular ainda n\xE3o foi cadastrado no servidor. Toque em Cadastrar.",d='<button class="btn btn--primary btn--sm" data-action="notify-enable">Cadastrar</button>'):(i="warn",n="Ativadas s\xF3 com o app aberto. Para receber com o app fechado e no celular do parceiro, ligue a nuvem e o servidor (README)."),`<section class="block">
    <h2 class="block__title">${u("bell",16)} Notifica\xE7\xF5es</h2>
    <div class="card card--row ${i==="ok"?"card--ok":"card--warn"}">
      ${u("bell",22)}
      <div><strong>${i==="ok"?"Funcionando":"Aten\xE7\xE3o"}</strong><small>${h(n)}</small></div>
      ${d}
    </div>
    <form class="list notif-prefs" data-notify-form onsubmit="return false">
      <label class="list__row"><span><b>Lembretes dos meus posts</b><small>2h e 30 min antes, na hora e cobran\xE7a se atrasar</small></span><input type="checkbox" class="switch" name="reminders" ${l.reminders?"checked":""}></label>
      <label class="list__row"><span><b>Avisos do parceiro</b><small>quando marcar, mudar ou concluir algo</small></span><input type="checkbox" class="switch" name="partner" ${l.partner?"checked":""}></label>
      <label class="list__row"><span><b>Resumo do dia</b><small>\xE0s 8h (hoje) e \xE0s 20h (amanh\xE3)</small></span><input type="checkbox" class="switch" name="daily" ${l.daily?"checked":""}></label>
    </form>
    ${e==="granted"?`<button class="btn btn--soft btn--block" data-action="notify-test">${u("bell",16)} Enviar notifica\xE7\xE3o de teste</button>`:""}
    <button class="btn-text btn-text--sm" data-action="onboarding-again">Ver a apresenta\xE7\xE3o de novo</button>
  </section>`}function La(){let e=O(),t=[0,15,30,45,60,90];return`<section class="block">
    <h2 class="block__title">${u("clock",16)} Rotina e tempo livre</h2>
    <form class="list" data-routine-form onsubmit="return false">
      <label class="list__row"><span>Expediente</span><input type="time" name="workStart" value="${e.workStart}"> <input type="time" name="workEnd" value="${e.workEnd}"></label>
      <label class="list__row"><span>Almo\xE7o</span><input type="time" name="lunchStart" value="${e.lunchStart}"> <input type="time" name="lunchEnd" value="${e.lunchEnd}"></label>
      <label class="list__row"><span>Deslocamento entre lugares</span><select name="travelMin">${t.map(a=>`<option value="${a}"${e.travelMin===a?" selected":""}>${a?a+" min":"n\xE3o considerar"}</option>`).join("")}</select></label>
      <label class="list__row"><span>M\xE1ximo de tarefas/dia</span><select name="maxTasks">${[4,5,6,7,8,10,12,15,20].map(a=>`<option value="${a}"${e.maxTasks===a?" selected":""}>${a}</option>`).join("")}</select></label>
      <div class="list__row list__row--col"><span>Dias de folga</span>
        <div class="daysoff">${Z.map((a,o)=>`<label class="dayoff"><input type="checkbox" name="off" value="${o}"${e.daysOff.includes(o)?" checked":""}><span>${a}</span></label>`).join("")}</div>
      </div>
    </form>
    <p class="fhelp">O assistente usa isso para n\xE3o marcar nada em cima do almo\xE7o, da folga ou fora do expediente, e para proteger o tempo livre de voc\xEAs.</p>
  </section>`}var B={async notifyEnable(){let e=await ke().catch(t=>({ok:!1,reason:"error",message:t.message}));e.ok?v(e.local?"Ativado (com o app aberto)":"Notifica\xE7\xF5es ativadas"):e.reason==="install"?v("Instale o app na Tela de In\xEDcio primeiro"):e.reason==="denied"?v("Bloqueado: libere em Ajustes do iPhone \u2192 Notifica\xE7\xF5es"):e.reason==="server"?v("Servidor de notifica\xE7\xF5es ainda n\xE3o publicado"):v(`N\xE3o foi poss\xEDvel ativar${e.message?": "+e.message:""}`,{ms:8e3}),s.emit()},async notifyTest(){let e;try{e=await xe()}catch(t){return v(`Falhou: ${t.message}`,{ms:8e3})}if(e.kind==="not-registered")return v('Este celular ainda n\xE3o est\xE1 cadastrado. Toque em "Ativar" acima.',{ms:7e3});if(e.kind==="local")return v("Notifica\xE7\xE3o local mostrada (servidor n\xE3o configurado)");if(e.sent>0)return v("Enviada! Deve chegar em alguns segundos. Bloqueie a tela para ver.",{ms:7e3});if(!e.devices)return v('O servidor n\xE3o tem este celular cadastrado. Toque em "Ativar" de novo.',{ms:7e3});v(`A Apple n\xE3o aceitou o envio (${(e.statuses||[]).join(", ")||"sem resposta"}). Toque em "Ativar" de novo.`,{ms:9e3})},async notifyPrefs(e){await Kt({reminders:e.reminders.checked,partner:e.partner.checked,daily:e.daily.checked}),v("Prefer\xEAncias salvas")},onboardingAgain(){Wt()},async routine(e){let t=(l,i)=>/^\d{2}:\d{2}$/.test(e[l].value)?e[l].value:i,a=O(),o={id:"routine",workStart:t("workStart",a.workStart),workEnd:t("workEnd",a.workEnd),lunchStart:t("lunchStart",a.lunchStart),lunchEnd:t("lunchEnd",a.lunchEnd),travelMin:Number(e.travelMin.value),maxTasks:Number(e.maxTasks.value),daysOff:[...e.querySelectorAll('input[name="off"]:checked')].map(l=>Number(l.value))};if(o.workEnd<=o.workStart)return v("O fim do expediente precisa ser depois do in\xEDcio");if(o.lunchEnd<=o.lunchStart)return v("O fim do almo\xE7o precisa ser depois do in\xEDcio");await s.upsert("settings",o),v("Rotina salva")},async ics(e){let t=e.dataset.who==="me"?s.me:"all";if(e.dataset.who==="me"&&!s.me)return v("Escolha primeiro quem est\xE1 usando este celular");let a=Number(e.dataset.days),o=w(),l=s.eventsBetween(o,_(o,a),{person:t}).filter(n=>n.status!=="feito");if(!l.length)return v("Nada agendado nesse per\xEDodo");let i=t==="all"?`${A.appName} \u2013 Dupla`:`${A.appName} \u2013 ${s.member(t).name}`;await Nt(l,`pauta-${t}-${o}.ics`,i)},export(){let e=new Blob([s.exportData()],{type:"application/json"}),t=document.createElement("a");t.href=URL.createObjectURL(e),t.download=`pauta-backup-${w()}.json`,document.body.appendChild(t),t.click(),t.remove(),v("Backup exportado")},async import(e){let t=e.files[0];if(t)try{let a=await t.text(),o=await Dt({title:"Importar backup",text:"Como deseja importar?",options:[{label:"Juntar com os dados atuais",value:"merge",primary:!0},{label:"Substituir tudo",value:"replace",danger:!0}]});if(!o)return;await s.importData(a,{replace:o==="replace"}),v("Backup importado")}catch{v("Arquivo inv\xE1lido")}finally{e.value=""}},async clearAll(){await le({title:"Apagar TUDO?",text:"Empresas, eventos e bilhetes ser\xE3o apagados. Exporte um backup antes, se precisar.",ok:"Apagar tudo",danger:!0})&&(await s.clearAll(),v("Tudo apagado"))}};var Xe=[{label:"Organize meu dia",q:"Analise a agenda de hoje e me diga, em ordem, o que fazer e quando. Aponte conflitos e onde d\xE1 para ganhar tempo livre."},{label:"Melhores hor\xE1rios da semana",q:"Sugira os melhores hor\xE1rios para os posts desta semana de cada empresa, sem conflitar com as capta\xE7\xF5es e respeitando o expediente e o almo\xE7o."},{label:"Equilibrar a dupla",q:"A carga de trabalho entre Henrique e Matheus est\xE1 equilibrada nos pr\xF3ximos 7 dias? Sugira trocas concretas de respons\xE1vel."},{label:"Ideias de conte\xFAdo",q:"Para cada empresa, sugira 3 ideias de posts (feed, reels e stories) para a pr\xF3xima semana, com legenda curta."}],Ra=(e=[])=>e.map(t=>s.member(t)?.name).filter(Boolean).join(" e ")||"sem respons\xE1vel";function Ba(e,t=14){let a=O(),o=w(),l=new Date,i=[];i.push(`Voc\xEA \xE9 o assistente de organiza\xE7\xE3o de uma dupla de social media (${s.team.map(m=>m.name).join(" e ")}) que cuida do Instagram de v\xE1rias empresas. Responda em portugu\xEAs do Brasil, de forma curta e direta (sem rodeios), com hor\xE1rios concretos e no m\xE1ximo uns 10 itens.`),i.push(""),i.push(`Agora: ${re(o)}, ${l.toTimeString().slice(0,5)}.`),i.push(`Rotina combinada: expediente ${a.workStart}\u2013${a.workEnd}, almo\xE7o ${a.lunchStart}\u2013${a.lunchEnd}, folga: ${a.daysOff.map(m=>ht[m]).join(", ")||"nenhuma"}, deslocamento m\xEDnimo entre lugares: ${a.travelMin} min, m\xE1ximo de ${a.maxTasks} tarefas por pessoa/dia.`),i.push(`Empresas: ${s.companiesSorted().map(m=>m.name+(m.instagram?` (@${m.instagram})`:"")).join(", ")||"nenhuma"}.`),i.push(""),i.push(`Agenda (de hoje at\xE9 ${t} dias):`);let n=s.eventsBetween(_(o,-1),_(o,t)),d="";return n.forEach(m=>{m.date!==d&&(i.push(`
${re(m.date)}:`),d=m.date);let c=s.company(m.companyId),r=m.duration?` (${m.duration} min)`:"";i.push(`- ${m.time||"sem hor\xE1rio"}${r} \xB7 ${T[m.type]?.label} \xB7 ${c?.name||"?"} \xB7 "${m.title||""}" \xB7 ${Ra(m.assignees)} \xB7 ${m.status==="feito"?"feito":m.status==="pronto"?"pronto":"a fazer"}${m.location?" \xB7 local: "+m.location:""}`)}),n.length||i.push("(nenhum compromisso)"),i.push(""),i.push(`Pergunta: ${e}`),i.join(`
`)}function Jt(e){let t=Ba(e);try{navigator.clipboard?.writeText(t).catch(()=>{})}catch{}let a=encodeURIComponent(t),o=a.length<7500?`https://claude.ai/new?q=${a}`:"https://claude.ai/new";window.open(o,"_blank","noopener"),v(a.length<7500?"Abrindo o Claude\u2026 (a agenda tamb\xE9m foi copiada)":"Agenda copiada: cole no Claude (segure no campo \u2192 Colar)",{ms:5e3})}var ea="cal.chat",z=(()=>{try{return JSON.parse(localStorage.getItem(ea)||"[]").slice(-30)}catch{return[]}})(),ae=!1,Qt=()=>{try{localStorage.setItem(ea,JSON.stringify(z.slice(-30)))}catch{}},Ha=e=>h(e).replace(/\*\*(.+?)\*\*/g,"<b>$1</b>").replace(/^#{1,4}\s*(.+)$/gm,"<b>$1</b>").replace(/^\s*[-•*]\s+(.+)$/gm,'<span class="li">$1</span>').replace(/<\/span>\n+(?=<span class="li">)/g,"</span>").replace(/\n{2,}/g,`
`).replace(/\n/g,"<br>"),Xt={"functions/failed-precondition":null,"functions/permission-denied":"S\xF3 a equipe pode usar o assistente.","functions/resource-exhausted":null,"functions/unavailable":"Sem conex\xE3o com o assistente agora. Tente de novo.","functions/deadline-exceeded":"O assistente demorou demais. Tente de novo."};function Fa(e){return e?.code==="local"?"O assistente precisa da sincroniza\xE7\xE3o na nuvem ligada.":e?.code==="no-server"?"O assistente ainda n\xE3o foi ligado no servidor. Falta publicar o servidor gratuito (veja o README).":e?.status?e.message:e?.code in Xt?Xt[e.code]||e.message:e?.code==="functions/not-found"||e?.code==="functions/internal"&&!/assistente|Claude/.test(e.message||"")?"O assistente ainda n\xE3o foi ligado no servidor. Falta publicar o servidor com a chave do Claude (veja o README, se\xE7\xE3o 5).":e?.message||"N\xE3o consegui falar com o assistente."}function Zt(){return`<section class="block" data-chat>
    <h2 class="block__title">${u("sparkle",16)} Pergunte ao assistente</h2>
    <div class="chat">
      ${z.length?z.map(e=>`<div class="msg msg--${e.role}${e.error?" msg--err":""}">${Ha(e.text)}</div>`).join(""):'<div class="msg msg--assistant">Oi! Eu vejo a agenda inteira de voc\xEAs: posts, capta\xE7\xF5es, reuni\xF5es, empresas e a rotina. Pergunte o que quiser, por exemplo \u201Co que eu tenho amanh\xE3?\u201D ou \u201Cqual o melhor hor\xE1rio para um Reels da Pura Vida na sexta?\u201D.</div>'}
      ${ae?'<div class="msg msg--assistant msg--typing"><i></i><i></i><i></i></div>':""}
    </div>
    <div class="presets">${Xe.map((e,t)=>`<button class="preset" data-preset="${t}">${h(e.label)}</button>`).join("")}</div>
    <form class="chat__form" data-chatform onsubmit="return false">
      <textarea class="input" rows="1" name="q" placeholder="Escreva sua pergunta\u2026" ${ae?"disabled":""}></textarea>
      <button class="iconbtn iconbtn--accent" type="submit" aria-label="Enviar" ${ae?"disabled":""}>${u("right",20)}</button>
    </form>
    <div class="chat__foot">
      ${z.length?'<button class="btn-text btn-text--sm" data-clearchat>Limpar conversa</button>':"<span></span>"}
      <button class="btn-text btn-text--sm" data-extclaude>Abrir no app do Claude</button>
    </div>
  </section>`}var Va=e=>h(JSON.stringify(e));function za(e="all"){let t=w(),a=e==="all"?s.team.map(n=>n.id):[e],o=[],l=new Set;for(let n=0;n<7;n++){let d=_(t,n);a.forEach(c=>_e(c,d).forEach(r=>{let p=r.ids.slice().sort().join("|")+r.title;l.has(p)||(l.add(p),o.push({...r,date:d}))})),s.eventsOn(d).filter(c=>!(c.assignees||[]).length&&c.status!=="feito").forEach(c=>o.push({date:d,level:"warn",icon:"user",ids:[c.id],title:"Sem respons\xE1vel",text:`${S(c.time)} ${q(c)}`,fixes:s.team.map(r=>({label:`Dar para ${r.name}`,eventId:c.id,patch:{assignees:[r.id]}}))}))}let i=s.state.events.filter(n=>n.status==="pendente"&&(n.date<t||n.date===t&&n.time&&j(n.time)+15<F())&&n.date>=_(t,-7));return i.length&&o.unshift({date:t,level:"warn",icon:"flag",ids:i.map(n=>n.id),title:`${i.length} tarefa${i.length>1?"s":""} pendente${i.length>1?"s":""} no passado`,text:"Marquem como feito ou reagendem para o cronograma do cliente ficar correto."}),o}function ta(){let e={type:"feed",date:f.date>=w()?f.date:w(),q:""},t=()=>{let i=w(),n=za(),d=O(),m=Array.from({length:7},(r,p)=>_(i,p)),c={id:"__probe",type:e.type,date:e.date,assignees:[]};return`
    ${Ct("Assistente")}
    <div class="page page--sheet">
      <div class="assist-hero">
        <span class="assist-hero__ic">${u("sparkle",22)}</span>
        <div><strong>Analisando a agenda de voc\xEAs</strong><p>Funciona sozinho, sem internet. Confere conflitos, tempo livre e os melhores hor\xE1rios sempre que algo muda.</p></div>
      </div>

      ${Zt()}

      <section class="block">
        <h2 class="block__title">${u("today",16)} Hoje</h2>
        <div class="card">${de(i).map(r=>`<p>${h(r)}</p>`).join("")}</div>
        <h2 class="block__title">${u("calendar",16)} Amanh\xE3</h2>
        <div class="card">${de(_(i,1)).map(r=>`<p>${h(r)}</p>`).join("")}</div>
      </section>

      <section class="block">
        <h2 class="block__title">${u("alert",16)} Precisa de aten\xE7\xE3o (7 dias)</h2>
        ${n.length?`<div class="tips">${n.map(r=>`
          <div class="tip tip--${r.level}">
            <span class="tip__ic">${u(r.icon,16)}</span>
            <div>
              <small class="tip__date">${h(ge(r.date))}</small>
              <strong>${h(r.title)}</strong><p>${h(r.text)}</p>
              ${r.fixes?.length?`<div class="fixes">${r.fixes.map(p=>`<button class="fixbtn" data-action="apply-fix" data-id="${p.eventId}" data-patch="${Va(p.patch)}">${u("check",13)} ${h(p.label)}</button>`).join("")}</div>`:""}
              ${r.ids?.length===1?`<button class="btn-text btn-text--sm" data-action="open-event" data-id="${r.ids[0]}">Ver evento</button>`:""}
            </div>
          </div>`).join("")}</div>`:`<div class="tip tip--ok"><span class="tip__ic">${u("check",16)}</span><div><strong>Tudo certo</strong><p>Nenhum conflito nos pr\xF3ximos 7 dias.</p></div></div>`}
      </section>

      <section class="block">
        <h2 class="block__title">${u("clock",16)} Tempo livre no expediente (${S(d.workStart)}\u2013${S(d.workEnd)})</h2>
        <div class="freegrid">
          <span></span>${m.map(r=>`<span class="freegrid__d">${Z[K(r).getDay()]}<b>${K(r).getDate()}</b></span>`).join("")}
          ${s.team.map(r=>`${M(r.id,24)}${m.map(p=>{let $=te(r.id,p);if($.dayOff)return'<span class="freecell is-off">folga</span>';let x=$.minutes/60;return`<span class="freecell ${x>=4?"is-good":x>=2?"is-mid":"is-low"}">${G(Math.round($.minutes/15)*15)||"0"}</span>`}).join("")}`).join("")}
        </div>
        <p class="fhelp">Verde: dia tranquilo \xB7 amarelo: apertado \xB7 vermelho: sem respiro. Ajuste a rotina em Ajustes.</p>
      </section>

      <section class="block">
        <h2 class="block__title">${u("bulb",16)} Encontrar o melhor hor\xE1rio</h2>
        <div class="card">
          <div class="row2">
            <select class="input" data-f="type">${St.map(r=>`<option value="${r}"${e.type===r?" selected":""}>${T[r].label}</option>`).join("")}</select>
            <input class="input" type="date" data-f="date" value="${e.date}">
          </div>
          ${s.team.map(r=>{let p=Mt({...c},{people:[r.id],limit:4});return`<div class="findrow">${M(r.id,26)}<div class="hintbox__times">${p.length?p.map($=>`<button class="tchip" data-new="${r.id}|${$.time}">${S($.time)}${$.peak?"<small>pico</small>":""}</button>`).join(""):'<span class="muted">Sem hor\xE1rio livre</span>'}</div></div>`}).join("")}
          <p class="fhelp">Toque num hor\xE1rio para j\xE1 criar o evento com a pessoa certa.</p>
        </div>
      </section>

    </div>`},a=jt({className:"sheet--tall",html:t(),onMount:i=>{let n=i.el;n.querySelector('[data-f="type"]').onchange=m=>{e.type=m.target.value,i.set(t())},n.querySelector('[data-f="date"]').onchange=m=>{m.target.value&&(e.date=m.target.value,i.set(t()))},n.querySelectorAll("[data-new]").forEach(m=>m.onclick=async()=>{let[c,r]=m.dataset.new.split("|"),{openEventEditor:p}=await import("./c-FJTSIK4O.js");p({date:e.date,type:e.type,time:r,assignees:[c]})}),l(i,async m=>{if(m=(m||"").trim(),!m||ae)return;let c=z.filter(r=>!r.error).map(r=>({role:r.role,text:r.text}));z.push({role:"user",text:m}),ae=!0,o(i);try{let r=await s.askAssistant(m,c);z.push({role:"assistant",text:r})}catch(r){z.push({role:"assistant",text:Fa(r),error:!0})}ae=!1,Qt(),o(i)})}});function o(i){let n=i.el.querySelector("[data-chat]");if(!n)return;n.outerHTML=Zt(),l(i,i.send);let d=i.el.querySelector(".chat");d&&d.lastElementChild?.scrollIntoView({block:"nearest",behavior:"smooth"})}function l(i,n){i.send=n;let d=i.el;d.querySelectorAll("[data-preset]").forEach(p=>p.onclick=()=>n(Xe[+p.dataset.preset].q));let m=d.querySelector("[data-chatform]"),c=m.q;c.oninput=()=>{c.style.height="auto",c.style.height=Math.min(c.scrollHeight,140)+"px"},c.onkeydown=p=>{p.key==="Enter"&&!p.shiftKey&&(p.preventDefault(),n(c.value))},m.onsubmit=p=>{p.preventDefault(),n(c.value)};let r=d.querySelector("[data-clearchat]");r&&(r.onclick=()=>{z=[],Qt(),o(i)}),d.querySelector("[data-extclaude]").onclick=()=>Jt(c.value.trim()||"Analise a agenda e me diga o que \xE9 mais importante agora.")}a.refresh=()=>{let i=document.activeElement;if(i&&a.el.contains(i)&&/INPUT|TEXTAREA|SELECT/.test(i.tagName))return;let n=a.el.scrollTop;a.set(t()),a.el.scrollTop=n}}var aa="seed-v1",oa=[{id:"c_puravida",name:"Pura Vida",color:"#15803D",logoFile:"pura-vida.jpg"},{id:"c_jggarcia",name:"JG Garcia",color:"#16A34A",logoFile:"jg-garcia.jpg"},{id:"c_garciahortifruti",name:"Garcia Hortifruti",color:"#65A30D",logoFile:"garcia-hortifruti.jpg"},{id:"c_tobiasbbq",name:"Tobia's BBQ",color:"#DC2626",logoFile:"tobias-bbq.jpg"},{id:"c_verdeerosa",name:"Verde e Rosa Multimarcas",color:"#DB2777",logoFile:"verde-e-rosa.jpg"},{id:"c_sophiafestas",name:"Sophia Festas",color:"#0284C7",logoFile:"sophia-festas.jpg"}],Ua=async e=>{let t=await(await fetch(e,{cache:"no-cache"})).blob();return new Promise((a,o)=>{let l=new FileReader;l.onload=()=>a(l.result),l.onerror=o,l.readAsDataURL(t)})},Ze=!1;async function sa(){if(!(Ze||!s.ready||s.state.settings.some(e=>e.id===aa))){Ze=!0;try{let e=oa.filter(a=>!s.company(a.id)&&!s.state.companies.some(o=>o.name.trim().toLowerCase()===a.name.toLowerCase())),t=[];for(let a of e){let o=null;try{o=await Ua(`media/logos/${a.logoFile}`)}catch{}t.push({id:a.id,name:a.name,color:a.color,logo:o,instagram:"",address:"",contact:"",notes:"",shareToken:null})}t.length&&await s.upsertMany("companies",t),await s.upsert("settings",{id:aa,done:oa.map(a=>a.id)})}finally{Ze=!1}}}var na="seed-garcia-nov-2026-v2",Ka=["seed-garcia-nov-2026","seed-garcia-nov-2026-ate14h"],ia="c_garciahortifruti",Ga=["domingo","segunda","ter\xE7a","quarta","quinta","sexta","s\xE1bado"],Wa={"2026-11-09":"Marechal","2026-11-11":"Vila Valqueire","2026-11-13":"Marechal","2026-11-16":"Vila Valqueire","2026-11-18":"Marechal","2026-11-20":"Vila Valqueire","2026-11-23":"Marechal","2026-11-25":"Vila Valqueire","2026-11-27":"Marechal","2026-11-30":"Vila Valqueire"},Ya=[{date:"2026-11-20",text:"Garcia \xB7 Consci\xEAncia Negra: publica\xE7\xE3o institucional respeitosa e representativa."},{date:"2026-11-23",text:"Garcia \xB7 Black Friday (23 a 27/11): campanha principal de ofertas e chamadas di\xE1rias."},{date:"2026-11-28",text:"Garcia \xB7 Esquenta de Natal e ver\xE3o (28 a 30/11): frutas da esta\xE7\xE3o, receitas, saladas e planejamento das compras."}];function Ja(e="2026-11-19",t="2026-11-30"){let a=[];for(let o=new Date(e+"T12:00:00");o<=new Date(t+"T12:00:00");o.setDate(o.getDate()+1)){let l=`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}-${String(o.getDate()).padStart(2,"0")}`,i=o.getDay(),n={date:l,companyId:ia,assignees:["henrique"],status:"pendente",description:"",seedRoutine:2};if([1,3,5].includes(i)){let d=Wa[l]||"";a.push({...n,id:`e_garcia2_${l}_ceasa`,type:"outro",time:"07:00",duration:210,reminder:30,title:"CEASA",location:"CEASA",internalNote:"CEASA \u2014 07h \xE0s 10h30. Depois segue para a Garcia Hortifruti.",visibleToClient:!1}),a.push({...n,id:`e_garcia2_${l}_gravacao`,type:"captacao",time:"10:30",duration:210,reminder:60,title:`Grava\xE7\xE3o com o Gelado \u2014 ${d||"Garcia"}`,location:d?`Garcia Hortifruti \u2014 ${d}`:"Garcia Hortifruti",internalNote:"Sa\xEDda do CEASA por volta das 10h30. Personagem: Gelado (filmar para Reels, feed e stories). Ajustar conforme abastecimento, pre\xE7os e necessidades da unidade.",visibleToClient:!0})}else if(i===0)a.push({...n,id:`e_garcia2_${l}_plan`,type:"outro",time:"07:00",duration:420,reminder:30,title:"Planejamento da semana",location:"",internalNote:"Planejamento \u2014 07h \xE0s 14h.",visibleToClient:!1});else{let d=i===6;a.push({...n,id:`e_garcia2_${l}_ceasa`,type:"outro",time:"07:00",duration:d?300:420,reminder:30,title:`Somente CEASA (${Ga[i]})`,location:"CEASA",internalNote:`Somente CEASA \u2014 07h \xE0s ${d?"12h":"14h"}.`,visibleToClient:!1})}}return a}var et=!1;async function ra(){if(!(et||!s.ready||s.state.settings.some(e=>e.id===na))&&s.company(ia)){et=!0;try{let e=s.state.events.filter(o=>o.seedRoutine===!0||/^e_garcia_\d/.test(o.id)).map(o=>o.id);e.length&&await s.removeMany("events",e,{silent:!0});let t=Ja().filter(o=>!s.event(o.id));t.length&&await s.upsertMany("events",t);let a=Ya.filter(o=>!s.state.notes.some(l=>l.date===o.date&&l.text===o.text)).map(o=>({id:be("n_"),date:o.date,text:o.text,author:"henrique"}));a.length&&await s.upsertMany("notes",a);for(let o of[na,...Ka])await s.upsert("settings",{id:o,done:[]})}finally{et=!1}}}var U={feed:"Feed",carrossel:"Carrossel",reels:"Reels",story:"Story",captacao:"Capta\xE7\xE3o",reuniao:"Reuni\xE3o",producao:"Edi\xE7\xE3o",outro:"Tarefa"},Qa=["feed","carrossel","reels","story"],Te=e=>Qa.includes(e),ca={feed:"publicar o feed",carrossel:"publicar o carrossel",reels:"postar o Reels",story:"postar o story",captacao:"a capta\xE7\xE3o",reuniao:"a reuni\xE3o",producao:"a edi\xE7\xE3o",outro:"a tarefa"},Q=e=>e?e.replace(/^0/,"").replace(":00","h").replace(":","h"):"",Xa=e=>{let[t,a]=String(e).split(":").map(Number);return t*60+a},Ae=e=>Math.round(Date.UTC(+e.slice(0,4),+e.slice(5,7)-1,+e.slice(8,10))/864e5),je=(e,t)=>new Date(Date.UTC(+e.slice(0,4),+e.slice(5,7)-1,+e.slice(8,10)+t)).toISOString().slice(0,10);function tt(e){let t=Number.isFinite(e.reminder)?e.reminder:30,a;return Te(e.type)?a=[120,30,0,-30]:e.type==="captacao"?a=[1440,120,45,-30]:e.type==="reuniao"?a=[1440,60,15]:a=[30,0],t>=0&&!a.includes(t)&&a.push(t),t<0&&(a=a.filter(o=>o<0)),[...new Set(a)].sort((o,l)=>l-o)}function la(e,t,a=4){let o=Ae(t.date)*1440+t.minutes,l=[];return e.forEach(i=>{if(!i||!i.time||!i.date||i.status==="feito")return;let n=Ae(i.date)*1440+Xa(i.time);tt(i).forEach(d=>{if(d<0&&i.status!=="pendente")return;let m=n-d;m<=o&&m>o-a&&l.push({ev:i,offset:d})})}),l}var Za=(e,t)=>{let a=Ae(e)-Ae(t.date);return a===0?"hoje":a===1?"amanh\xE3":a===-1?"ontem":`${["domingo","segunda","ter\xE7a","quarta","quinta","sexta","s\xE1bado"][new Date(Date.UTC(+e.slice(0,4),+e.slice(5,7)-1,+e.slice(8,10))).getUTCDay()]}, ${e.slice(8,10)}/${e.slice(5,7)}`},eo=e=>{if(e>=60){let t=Math.floor(e/60),a=e%60;return a?`${t}h${String(a).padStart(2,"0")}`:`${t}h`}return`${e} min`};function Ce(e,t,a=""){let o=`${U[e.type]||"Tarefa"}${a?" \xB7 "+a:""}`,l=e.title?`\u201C${e.title}\u201D`:"",i=Q(e.time),n=e.location?` \xB7 ${e.location}`:"";return t>=1440?{title:`Amanh\xE3: ${o} \xE0s ${i}`,body:e.type==="captacao"?`Hoje: carregue baterias, esvazie os cart\xF5es e confirme com o cliente.${n}`:`${l}${n}`.trim()||"Confirme o hor\xE1rio com o cliente."}:t>0?{title:`Daqui a ${eo(t)}: ${o}`,body:`${i} \u2014 ${ca[e.type]||"a tarefa"}${l?" "+l:""}${n}`}:t===0?{title:`Agora: ${o}`,body:`Est\xE1 na hora de ${ca[e.type]||"fazer a tarefa"}${l?" "+l:""}.`}:{title:Te(e.type)?`J\xE1 postou? ${o}`:`J\xE1 fez? ${o}`,body:`Era \xE0s ${i}${l?" \u2014 "+l:""}. Toque para marcar como feito.`}}function at(e,t,{actor:a="Algu\xE9m",company:o="",recipient:l=null,now:i}={}){let d=`${U[(t||e).type]||"Tarefa"}${o?" \xB7 "+o:""}`,m=$=>`${Za($.date,i)}${$.time?", "+Q($.time):""}`,c=$=>l&&($.assignees||[]).includes(l);if(!e&&t)return{title:c(t)?`${a} marcou para voc\xEA`:`${a} adicionou na agenda`,body:`${d} \u2014 ${m(t)}${t.title?" \xB7 "+t.title:""}`};if(e&&!t)return{title:`${a} removeu da agenda`,body:`${d} \u2014 ${m(e)}`};if(e.status!=="feito"&&t.status==="feito")return{title:`${a} concluiu \u2713`,body:`${d} \u2014 ${m(t)}`};let r=c(e),p=c(t);return!r&&p?{title:`${a} passou para voc\xEA`,body:`${d} \u2014 ${m(t)}${t.title?" \xB7 "+t.title:""}`}:r&&!p?{title:`${a} assumiu uma tarefa sua`,body:`${d} \u2014 ${m(t)}`}:e.date!==t.date||e.time!==t.time?{title:`${a} mudou o hor\xE1rio`,body:`${d}: ${m(e)} \u2192 ${m(t)}`}:null}function da(e,t,a,o){if(!a.length)return null;let l=[...a].sort((r,p)=>(r.time||"99").localeCompare(p.time||"99")),i=l.find(r=>r.time)||l[0],n=l.filter(r=>Te(r.type)).length,d=l.filter(r=>r.type==="captacao"||r.type==="reuniao"),m=r=>`${Q(r.time)} ${U[r.type]}${o(r)?" \xB7 "+o(r):""}`,c=[`${l.length} tarefa${l.length>1?"s":""} (${n} post${n===1?"":"s"})`,`primeira: ${m(i)}`];return d.length&&c.push(`sai para ${d.map(r=>`${o(r)||U[r.type]} \xE0s ${Q(r.time)}`).join(" e ")}`),e==="morning"?{title:`Bom dia, ${t}! Seu dia hoje`,body:c.join(" \xB7 ")}:{title:`${t}, amanh\xE3 voc\xEA tem ${l.length} tarefa${l.length>1?"s":""}`,body:c.slice(1).join(" \xB7 ")}}var pe=e=>s.member(e)?.name||"Algu\xE9m",P=e=>s.company(e)?.name||"",ua=()=>{let e=new Date;return{date:w(),minutes:e.getHours()*60+e.getMinutes()}},ma=(e,t)=>Date.parse(`${e}T${t}:00-03:00`),nt=()=>s.mode==="cloud"&&!!R()&&!!s.me,ot=null,ha=e=>ot=e;function st(e,t,a,o="./",l=!1){return!t||!e.length?Promise.resolve(null):J("/notify",{to:e,title:t.title,body:t.body,tag:a,url:o,includeSelf:l}).catch(i=>(console.warn("aviso",i.message),{error:i.message}))}var to=e=>{let t=w();return`${e.date===t?"hoje":e.date===_(t,1)?"amanh\xE3":`${e.date.slice(8,10)}/${e.date.slice(5,7)}`}${e.time?", "+e.time.replace(":00","h").replace(":","h").replace(/^0/,""):""}`};function fa(e,t){if(!nt())return;let a=t||e,l=s.team.map(d=>d.id).filter(d=>d!==s.me).map(d=>{let m=at(e,t,{actor:pe(s.me),company:P(a.companyId),recipient:d,now:ua()});return m?st([d],m,`ev-${a.id}`,`./#/e/${a.id}`).then(c=>({r:d,d:c})):null}).filter(Boolean),i=!e&&t,n=e&&t&&(e.date!==t.date||e.time!==t.time);if(t&&(i||n)){let d=`${U[t.type]||"Tarefa"}${P(t.companyId)?" \xB7 "+P(t.companyId):""}`,m=(t.assignees||[]).map(pe).join(" e ")||"sem respons\xE1vel";st([s.me],{title:i?`Novo na agenda: ${d}`:`Hor\xE1rio alterado: ${d}`,body:`${to(t)}${t.title?" \xB7 "+t.title:""} \xB7 ${m}`},`ev-${t.id}`,`./#/e/${t.id}`,!0)}l.length&&ot&&Promise.all(l).then(d=>{let m=d.filter(p=>p.d&&!p.d.error&&p.d.results&&!p.d.results[p.r]).map(p=>pe(p.r)),c=d.find(p=>p.d&&p.d.error),r=d.filter(p=>p.d&&p.d.results&&p.d.results[p.r]).map(p=>pe(p.r));ot({ok:r,missing:m,error:c?.d.error})}),oe()}function ga(e){if(!nt())return;let t=s.team.map(l=>l.id).filter(l=>l!==s.me),a=pe(s.me),o=null;if(e.kind==="deleted"&&e.events?.length){let l=e.events[0];o=e.events.length===1?at(l,null,{actor:a,company:P(l.companyId),now:ua()}):{title:`${a} removeu ${e.events.length} itens da agenda`,body:`${P(l.companyId)?P(l.companyId)+" \xB7 ":""}a partir de ${l.date.slice(8,10)}/${l.date.slice(5,7)}`}}else e.kind==="series"?o={title:`${a} adicionou ${e.count} itens repetidos`,body:`${e.label||""}${P(e.sample?.companyId)?" \xB7 "+P(e.sample.companyId):""}`}:e.kind==="series-edit"?o={title:`${a} alterou ${e.count} itens repetidos`,body:`${e.label||""}${P(e.sample?.companyId)?" \xB7 "+P(e.sample.companyId):""}`}:e.kind==="import"&&(o={title:`${a} importou a agenda`,body:`${e.count||0} itens atualizados.`});st(t,o,`act-${e.id||Date.now()}`),oe()}function ao(e=Date.now()){let t=[],a=_(w(),-1),o=_(w(),4),l=s.eventsBetween(a,o).filter(n=>n.time&&n.status!=="feito"),i=(n,d)=>s.eventsOn(d,{person:n}).filter(m=>m.status!=="feito").length;l.forEach(n=>{let d=ma(n.date,n.time);tt(n).forEach(m=>{if(m<0&&n.status!=="pendente")return;let c=d-m*6e4;if(c<e-10*6e4||c>e+4*864e5)return;let r=Ce(n,m,P(n.companyId));(n.assignees?.length?n.assignees:s.team.map($=>$.id)).forEach($=>t.push({id:`r_${n.id}_${m}_${n.date}${n.time.replace(":","")}_${$}`,at:c,member:$,title:r.title,body:r.body,tag:`rem-${n.id}`,url:`./#/e/${n.id}`,kind:"reminders",badge:i($,n.date)}))})});for(let n=0;n<4;n++){let d=_(w(),n);s.team.forEach(m=>{[["morning",d,"08:00"],["evening",_(d,1),"20:00"]].forEach(([c,r,p])=>{let $=ma(d,p);if($<e-10*6e4)return;let x=s.eventsOn(r,{person:m.id}).filter(g=>g.status!=="feito"),D=da(c,m.name,x,g=>P(g.companyId));D&&t.push({id:`d_${c}_${r}_${m.id}`,at:$,member:m.id,title:D.title,body:D.body,tag:`daily-${c}`,url:"./",kind:"daily",badge:i(m.id,r)})})})}return t.sort((n,d)=>n.at-d.at)}var pa="",oe=_t(async()=>{if(!nt())return;let e=ao(),t=JSON.stringify(e.map(a=>[a.id,a.at,a.title,a.body]));if(t!==pa)try{await J("/schedule",{items:e}),pa=t}catch(a){console.warn("lista de lembretes",a.message)}},3e3);var $a=["domingo","segunda","ter\xE7a","quarta","quinta","sexta","s\xE1bado"],ba=e=>$a[new Date(Date.UTC(+e.slice(0,4),+e.slice(5,7)-1,+e.slice(8,10))).getUTCDay()],oo={pendente:"a fazer",pronto:"pronto/agendado",feito:"feito"};function va({events:e,companies:t,routine:a,notes:o,team:l,me:i,now:n}){let d=new Map(t.map(g=>[g.id,g.name])),m=g=>l.find(I=>I.id===g)?.name||g,c=je(n.date,-7),r=je(n.date,30),p=e.filter(g=>g.date>=c&&g.date<=r).sort((g,I)=>(g.date+(g.time||"")).localeCompare(I.date+(I.time||""))),$=[];$.push(`Agora: ${ba(n.date)}, ${n.date.split("-").reverse().join("/")}, ${Q(`${String(Math.floor(n.minutes/60)).padStart(2,"0")}:${String(n.minutes%60).padStart(2,"0")}`)} (hor\xE1rio de Bras\xEDlia).`),$.push(`Quem pergunta: ${m(i)}. Equipe: ${l.map(g=>g.name).join(" e ")}.`),a&&$.push(`Rotina combinada: expediente ${a.workStart}\u2013${a.workEnd}, almo\xE7o ${a.lunchStart}\u2013${a.lunchEnd}, folga: ${(a.daysOff||[]).map(g=>$a[g]).join(", ")||"nenhuma"}, deslocamento m\xEDnimo ${a.travelMin} min, m\xE1ximo ${a.maxTasks} tarefas por pessoa/dia.`),$.push(`Empresas clientes: ${t.map(g=>g.name+(g.instagram?` (@${g.instagram})`:"")+(g.address?` \u2014 endere\xE7o: ${g.address}`:"")+(g.notes?` \u2014 observa\xE7\xF5es: ${g.notes}`:"")).join("; ")||"nenhuma"}.`),$.push("",`Agenda (de ${c.split("-").reverse().join("/")} a ${r.split("-").reverse().join("/")}):`);let x="";p.forEach(g=>{g.date!==x&&($.push(`
${ba(g.date)} ${g.date.split("-").reverse().join("/")}:`),x=g.date);let I=g.duration?` (${g.duration} min)`:"",y=(g.assignees||[]).map(m).join(" e ")||"sem respons\xE1vel";$.push(`- ${g.time?Q(g.time):"sem hor\xE1rio"}${I} \xB7 ${U[g.type]||g.type} \xB7 ${d.get(g.companyId)||"?"} \xB7 "${g.title||""}" \xB7 ${y} \xB7 ${oo[g.status]||g.status}${g.location?" \xB7 local: "+g.location:""}${g.description?" \xB7 legenda: "+g.description.slice(0,160):""}${g.internalNote?" \xB7 nota interna: "+g.internalNote.slice(0,160):""}`)}),p.length||$.push("(nenhum compromisso)");let D=(o||[]).filter(g=>g.date>=je(n.date,-2)).slice(-10);return D.length&&$.push("","Bilhetes recentes da dupla:",...D.map(g=>`- ${g.date.split("-").reverse().join("/")} ${m(g.author)}: ${g.text}`)),$.join(`
`)}var N=document.getElementById("app");window.__calStarted=!0;var X=null;function so(){N.innerHTML=`
    <main id="view" class="view"></main>
    <nav class="tabbar" aria-label="Navega\xE7\xE3o">
      ${De("hoje","today","Hoje")}
      ${De("mes","calendar","Calend\xE1rio")}
      <button class="tabbar__fab" data-action="new-event" aria-label="Novo evento">${u("plus",28)}</button>
      ${De("empresas","building","Empresas")}
      ${De("ajustes","settings","Ajustes")}
    </nav>`}var De=(e,t,a)=>`<button class="tabbar__btn" data-action="tab" data-tab="${e}">${u(t,24)}<span>${a}</span></button>`;function C(){let e=document.getElementById("view");if(!e)return;let t=window.scrollY,a=e.querySelector('[data-form="note"] input'),o=a?a.value:"",l=a&&document.activeElement===a,i=f.tab==="mes"?Ft():f.tab==="empresas"?Ot():f.tab==="ajustes"?Yt():Ht();e.innerHTML=i,document.querySelectorAll(".tabbar__btn").forEach(d=>d.classList.toggle("is-on",d.dataset.tab===f.tab)),window.scrollTo(0,t);let n=e.querySelector('[data-form="note"] input');n&&o&&(n.value=o),n&&l&&n.focus({preventScroll:!0}),ro()}function no(){C(),Fe().forEach(e=>e.refresh&&e.refresh())}function ue(e){f.tab=e,Le(),C(),window.scrollTo(0,0)}var io={tab:e=>ue(e.dataset.tab),"set-person":e=>{f.person=e.dataset.p,Le(),C()},"set-date":e=>{f.date=e.dataset.k,C()},"go-today":()=>{f.date=w(),C()},week:e=>{f.date=_(f.date,Number(e.dataset.n)),C()},month:e=>{f.month=Oe(f.month,Number(e.dataset.n)),f.monthSel=f.month===ie(w())?w():`${f.month}-01`,C()},"month-today":()=>{f.month=ie(w()),f.monthSel=w(),C()},"month-select":e=>{f.monthSel=e.dataset.k,ie(e.dataset.k)!==f.month&&(f.month=ie(e.dataset.k)),C()},"month-company":e=>{f.monthCompany=e.dataset.id||null,C()},"open-day":e=>{f.date=e.dataset.k,ue("hoje")},"toggle-tips":()=>{f.showAllTips=!f.showAllTips,C()},"open-event":e=>ve(e.dataset.id),assistant:()=>ta(),"apply-fix":async e=>{let t=s.event(e.dataset.id);if(!t)return;let a;try{a=JSON.parse(e.dataset.patch)}catch{return}let o={};typeof a.time=="string"&&/^\d{2}:\d{2}$/.test(a.time)&&(o.time=a.time),Array.isArray(a.assignees)&&(o.assignees=a.assignees.filter(n=>s.member(n)));let{confirmMove:l}=await import("./c-FJTSIK4O.js");if(!await l(t,o))return;let i={...t};await s.upsert("events",{...t,...o}),v("Pronto, ajustado",{action:"Desfazer",onAction:()=>s.upsert("events",i)})},"toggle-done":async e=>{let t=s.event(e.dataset.id);if(!t)return;let a=t.status==="feito"?"pendente":"feito";await s.upsert("events",{...t,status:a}),a==="feito"&&v(`${T[t.type].label} conclu\xEDdo`,{action:"Desfazer",onAction:()=>s.upsert("events",{...s.event(t.id),status:t.status})})},"new-event":e=>{if(!s.state.companies.length)return v("Cadastre uma empresa primeiro"),Ue(null,()=>Ve({}));Ve({date:e.dataset.date||null})},"open-company":e=>Pt(e.dataset.id),"new-company":()=>Ue(),"del-note":async e=>{let t=s.state.notes.find(a=>a.id===e.dataset.id);await s.remove("notes",e.dataset.id),t&&v("Bilhete apagado",{action:"Desfazer",onAction:()=>s.upsert("notes",t)})},"set-me":e=>{s.setMe(e.dataset.p),v(`Ol\xE1, ${s.member(e.dataset.p).name}!`)},"clear-demo":async()=>{await le({title:"Apagar os dados de exemplo?",text:"O calend\xE1rio ficar\xE1 vazio para voc\xEAs cadastrarem as empresas e eventos reais.",ok:"Apagar exemplos",danger:!0})&&(await s.clearDemo(),v("Pronto! Agora cadastre suas empresas."))},"clear-all":()=>B.clearAll(),ics:e=>B.ics(e),"notify-enable":()=>B.notifyEnable(),"notify-test":()=>B.notifyTest(),"onboarding-again":()=>B.onboardingAgain(),export:()=>B.export(),logout:async()=>{await le({title:"Sair da conta?",ok:"Sair"})&&(await X.signOut(),location.reload())}};document.addEventListener("click",e=>{let t=e.target.closest("[data-action]");if(!t||document.body.classList.contains("is-client"))return;let a=io[t.dataset.action];a&&(e.preventDefault(),e.stopPropagation(),a(t))});document.addEventListener("change",e=>{e.target.matches('[data-action-change="import"]')&&B.import(e.target),e.target.closest("[data-notify-form]")&&B.notifyPrefs(e.target.closest("[data-notify-form]")),e.target.closest("[data-routine-form]")&&B.routine(e.target.closest("[data-routine-form]"))});document.addEventListener("submit",async e=>{let t=e.target.closest('[data-form="note"]');if(!t)return;e.preventDefault();let a=t.text.value.trim();if(a){if(!s.me){v("Escolha quem voc\xEA \xE9 em Ajustes");return}await s.upsert("notes",{id:be("n_"),date:f.date,text:a,author:s.me}),v("Bilhete adicionado")}});function ro(){document.querySelectorAll("[data-swipe]").forEach(e=>{let t=null,a=null;e.addEventListener("touchstart",o=>{t=o.touches[0].clientX,a=o.touches[0].clientY},{passive:!0}),e.addEventListener("touchend",o=>{if(t==null)return;let l=o.changedTouches[0].clientX-t,i=o.changedTouches[0].clientY-a;if(t=null,Math.abs(l)<50||Math.abs(l)<Math.abs(i)*1.5)return;let n=l<0?1:-1;e.dataset.swipe==="week"?f.date=_(f.date,7*n):(f.month=Oe(f.month,n),f.monthSel=`${f.month}-01`),C()})})}var ya=new Set;function wa(){if(!s.me)return;let e=new Date,t={date:w(),minutes:e.getHours()*60+e.getMinutes()},a=s.eventsBetween(_(t.date,-1),_(t.date,1),{person:s.me}),o=s.mode==="cloud"&&!!localStorage.getItem("pauta.device");la(a,t,2).forEach(({ev:l,offset:i})=>{let n=`${l.id}@${i}@${l.date}${l.time}`;if(ya.has(n))return;ya.add(n);let d=Ce(l,i,s.company(l.companyId)?.name||"");v(`${d.title}`,{ms:7e3,action:"Ver",onAction:()=>ve(l.id)}),!o&&V()==="granted"&&navigator.serviceWorker&&navigator.serviceWorker.ready.then(m=>m.showNotification(d.title,{body:d.body,tag:`rem-${l.id}`,icon:"icons/icon-192.png",badge:"icons/icon-192.png",data:{url:`./#/e/${l.id}`}})).catch(()=>{})}),Ge(s.eventsOn(t.date,{person:s.me}).filter(l=>l.status!=="feito").length)}function lt(e=location.hash){let t=/^#\/(e|d)\/([\w-]+)/.exec(e||"");return t?(history.replaceState(null,"",location.pathname+location.search),t[1]==="e"&&s.event(t[2])?(f.date=s.event(t[2]).date,ue("hoje"),ve(t[2])):t[1]==="d"&&/^\d{4}-\d{2}-\d{2}$/.test(t[2])&&(f.date=t[2],ue("hoje")),!0):!1}var _a={"auth/invalid-credential":"E-mail ou senha incorretos. Confira a senha (toque no olho para ver o que digitou).","auth/wrong-password":"Senha incorreta.","auth/user-not-found":"Este e-mail n\xE3o est\xE1 cadastrado no Firebase (Authentication \u2192 Usu\xE1rios).","auth/invalid-email":"E-mail inv\xE1lido.","auth/too-many-requests":'Muitas tentativas seguidas. Espere alguns minutos ou use "Esqueci minha senha".',"auth/network-request-failed":"Sem conex\xE3o com a internet. Verifique o Wi-Fi/4G e tente de novo.","auth/user-disabled":"Este usu\xE1rio foi desativado no Firebase.","auth/operation-not-allowed":"O login por e-mail/senha n\xE3o est\xE1 ativado no Firebase.","auth/api-key-not-valid":"Configura\xE7\xE3o do Firebase inv\xE1lida (apiKey)."},ka="",ct="";function Me(e=""){let t=e||ct;N.innerHTML=`
  <div class="login">
    <img src="icons/icon-192.png" alt="" width="84" height="84">
    <h1>${h(A.appName)}</h1>
    <p>Agenda de conte\xFAdo \xB7 ${h(A.agencyName)}</p>
    <form class="form" data-login novalidate>
      <div class="fgroup"><label class="flabel" for="l-email">E-mail</label><input id="l-email" class="input" type="email" name="email" value="${h(ka)}" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" inputmode="email"></div>
      <div class="fgroup"><label class="flabel" for="l-pass">Senha</label>
        <div class="input-eye"><input id="l-pass" class="input" type="password" name="pass" autocomplete="current-password" autocapitalize="none" autocorrect="off" spellcheck="false">
        <button type="button" class="iconbtn iconbtn--sm" data-eye aria-label="Mostrar senha">${u("eye",18)}</button></div>
      </div>
      ${t?`<p class="login__err">${h(t)}</p>`:""}
      <button class="btn btn--primary btn--block" type="submit" data-go>Entrar</button>
      <button class="btn-text btn-text--sm" type="button" data-reset>Esqueci minha senha</button>
    </form>
  </div>`;let a=N.querySelector("[data-login]");N.querySelector("[data-eye]").onclick=()=>{a.pass.type=a.pass.type==="password"?"text":"password"},a.onsubmit=async o=>{o.preventDefault();let l=a.email.value.trim().toLowerCase(),i=a.pass.value;if(ka=l,ct="",!l||!i)return Me("Preencha o e-mail e a senha.");let n=a.querySelector("[data-go]");n.disabled=!0,n.textContent="Entrando\u2026";try{await Promise.race([X.signIn(l,i),new Promise((d,m)=>setTimeout(()=>m({code:"timeout"}),2e4))]),n.textContent="Abrindo\u2026"}catch(d){let m=d&&d.code;Me(m==="timeout"?"O servidor demorou para responder. Verifique a internet e tente de novo.":_a[m]||`N\xE3o foi poss\xEDvel entrar (${m||d?.message||"erro desconhecido"}).`)}},N.querySelector("[data-reset]").onclick=async()=>{let o=a.email.value.trim().toLowerCase();if(!o)return v("Digite seu e-mail primeiro");try{await X.resetPassword(o),v("Enviamos um e-mail para criar uma nova senha (veja tamb\xE9m o spam)",{ms:6e3})}catch(l){v(_a[l?.code]||"N\xE3o foi poss\xEDvel enviar o e-mail")}}}function Sa(e){document.querySelector("[data-login]")||document.getElementById("view")||(N.innerHTML=`<div class="splash">
    <img src="icons/icon-192.png" alt="" width="72" height="72">
    <h2>N\xE3o consegui conectar</h2>
    <p>Verifique a internet e tente de novo.</p>
    <button class="btn btn--primary" data-retry>Tentar de novo</button>
    <small class="muted">Detalhe: ${h(String(e&&(e.code||e.message)||e))}</small>
  </div>`,N.querySelector("[data-retry]").onclick=()=>location.reload())}function it(e="Carregando\u2026"){N.innerHTML=`<div class="splash"><img src="icons/icon-192.png" alt="" width="72" height="72"><p>${h(e)}</p></div>`}function xa(){so(),C(),s.on(no),s.onError=e=>{let t=e&&/quota/i.test(String(e.name||e.message)),a=e&&/permission/i.test(String(e.code||e.message));v(t?"Mem\xF3ria do aparelho cheia: use logos menores ou ative a nuvem":a?"Sem permiss\xE3o na nuvem: confira as regras do Firebase":"N\xE3o foi poss\xEDvel salvar. Verifique a conex\xE3o.",{ms:5e3})},Ea(),s.on(Ea),s.on(()=>Ge(s.me?s.eventsOn(w(),{person:s.me}).filter(e=>e.status!=="feito").length:0)),setInterval(()=>{let e=document.activeElement,t=e&&/INPUT|TEXTAREA|SELECT/.test(e.tagName);f.tab==="hoje"&&!Fe().length&&!t&&C(),wa()},6e4),wa(),document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&(f.date<w()&&f.tab==="hoje"&&(f.date=w()),C())}),s.mode==="cloud"&&R()&&(s.hooks.eventChange=fa,ha(({ok:e,missing:t,error:a})=>{if(a)return v(`Aviso n\xE3o enviado: ${a}`,{ms:6e3});if(t.length)return v(`${t.join(" e ")} ainda n\xE3o ativou as notifica\xE7\xF5es no celular (Ajustes \u2192 Notifica\xE7\xF5es \u2192 Ativar)`,{ms:8e3});e.length&&v(`Aviso enviado para ${e.join(" e ")} \u2713`,{ms:3500})}),s.hooks.activity=ga,s.hooks.ask=async(e,t)=>{let a=new Date,o=va({events:s.state.events,companies:s.state.companies,routine:O(),notes:s.state.notes,team:s.team,me:s.me,now:{date:w(),minutes:a.getHours()*60+a.getMinutes()}});return(await J("/ask",{question:e,history:t,context:o})).answer},s.on(oe),oe(),setInterval(oe,15*6e4)),sa().then(()=>setTimeout(()=>ra().catch(e=>console.warn("rotina",e)),1500)).catch(e=>console.warn("pr\xE9-cadastro",e)),setTimeout(Gt,600),s.mode==="cloud"&&V()==="granted"&&Se().catch(()=>{}),setTimeout(()=>lt(),300)}var rt=null;function Ea(){if(!s.me)return;let e=Lt(s.me,14),t=o=>o.date+":"+o.ids.slice().sort().join("|"),a=new Set(e.map(t));if(rt){let o=e.find(l=>!rt.has(t(l))&&l.ids.some(i=>s.event(i)?.updatedBy&&s.event(i).updatedBy!==s.me));o&&v(`Aten\xE7\xE3o: ${o.title} (${o.date.slice(8)}/${o.date.slice(5,7)})`,{action:"Ver",onAction:()=>{f.date=o.date,f.person="all",ue("hoje")},ms:7e3})}rt=a}async function co(){let e=location.hash||"",t=A.firebase;if(e.startsWith("#/c/")||e.startsWith("#/v/")){it("Carregando cronograma\u2026");let i=!!(localStorage.getItem("pauta.me")||localStorage.getItem("cal.team"));try{if(e.startsWith("#/v/")){let m=await kt(e.slice(4));return ze(N,Ie(m),{canGoBack:i})}if(!t)return ye(N,"Este link precisa da sincroniza\xE7\xE3o na nuvem ativada.");let{fetchPublic:n}=await import("./c-43VYY7Q5.js"),d=await n(t,e.slice(4));return d?ze(N,Ie(d),{canGoBack:i}):ye(N,"Este link n\xE3o existe mais. Pe\xE7a um novo link para a equipe.")}catch(n){return console.error(n),ye(N,"N\xE3o foi poss\xEDvel abrir o cronograma. Verifique a conex\xE3o e tente novamente.")}}if(!t)return await Et(),xa();it("Conectando \xE0 nuvem\u2026");let a=(i,n)=>Promise.race([i,new Promise((d,m)=>setTimeout(()=>m(new Error("tempo esgotado")),n))]);try{let{connect:i}=await import("./c-43VYY7Q5.js");X=await a(i(t),15e3)}catch(i){return console.error(i),Sa(i)}let o=!1,l=!1;setTimeout(()=>{o||Sa(new Error("o login n\xE3o respondeu"))},25e3),X.onUser(async i=>{if(o=!0,!i)return l?location.reload():Me();if(l)return;if(!A.team.some(d=>d.email&&d.email.toLowerCase()===(i.email||"").toLowerCase()))return ct=`O e-mail ${i.email} n\xE3o faz parte da equipe deste app.`,await X.signOut(),Me();l=!0;try{localStorage.setItem("cal.team","1")}catch{}it("Entrando\u2026");try{await Promise.race([At(X.backend,i),new Promise(d=>setTimeout(d,12e3))])}catch(d){console.error(d),setTimeout(()=>v("N\xE3o consegui carregar os dados agora. Verifique a internet.",{ms:6e3}),800)}xa()})}navigator.serviceWorker?.addEventListener("message",e=>{if(e.data?.type==="open"&&e.data.url){let t=e.data.url.split("#")[1];t&&lt("#"+t)}});window.addEventListener("hashchange",()=>{if(/^#\/(e|d)\//.test(location.hash))return lt();/^#\/(c|v)\//.test(location.hash)&&location.reload()});"serviceWorker"in navigator&&location.protocol!=="file:"&&navigator.serviceWorker.register("sw.js").catch(()=>{});co();
