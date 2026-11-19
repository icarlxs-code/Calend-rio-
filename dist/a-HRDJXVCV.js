import{A as Ge,a as h,b as Re,c as M,d as Tt,e as Be,f as He,g as Fe,h as jt,i as Ve,j as Ct,k as v,l as le,m as Dt,n as I,o as Y,p as q,q as Mt,r as ee,s as qt,t as ce,u as Nt,v as $e,w as ze,y as Ot,z as Pt}from"./c-UPIIPZD5.js";import{a as Ue,b as ve}from"./c-XE2XNWEC.js";import{a as p}from"./c-SMTRSMWP.js";import{a as ye,d as W,e as we,f as It,g as de,i as _e,j as Lt,k as Rt,l as ke,n as Ke}from"./c-7GHJ6BCK.js";import{c as kt,f as s,g as Et,h as At}from"./c-QLDEEBWZ.js";import{f as Le}from"./c-4OPZHBQG.js";import{A as f,C as wt,E as _t,G as be,a as mt,b as G,c as _,d as k,e as pt,f as ne,g as Pe,h as ut,i as j,j as pe,k as F,l as x,m as ht,n as Z,o as ft,p as ue,q as ie,r as bt,s as gt,t as $t,u as he,v as K,w as vt,x as yt,y as fe}from"./c-UWUJNFLO.js";import{a as A,b as St,c as re,d as ge,l as Ie,m as xt}from"./c-3GA6RSWB.js";import{a as T}from"./c-W6W2IM5K.js";import"./c-VHNSBD2M.js";var xa=(e,a)=>e&&a&&e[0]<a[1]&&a[0]<e[1],J=e=>s.member(e)?.name||e,Se=e=>["shoot","meeting"].includes(A[e.type]?.kind);function xe(e,a){let t=[],o=I(),c=s.eventsOn(a,{person:e}).filter(n=>n.time&&n.status!=="feito");for(let n=0;n<c.length;n++)for(let m=n+1;m<c.length;m++){let d=c[n],i=c[m];if(!xa(Y(d),Y(i)))continue;let l=Se(d)?d:Se(i)?i:null,u=l===d?i:d,$,y;l&&re(u.type)?($=`${J(e)}: post durante ${A[l.type].label.toLowerCase()}`,y=`\u201C${q(u)}\u201D \xE0s ${x(u.time)} cai no meio de \u201C${q(l)}\u201D (${x(l.time)}\u2013${x(pe(Y(l)[1]))}).`):l&&Se(u)?($=`${J(e)} em dois lugares ao mesmo tempo`,y=`\u201C${q(d)}\u201D (${x(d.time)}) e \u201C${q(i)}\u201D (${x(i.time)}) se sobrep\xF5em.`):($=`${J(e)}: duas tarefas no mesmo hor\xE1rio`,y=`\u201C${q(d)}\u201D (${x(d.time)}) e \u201C${q(i)}\u201D (${x(i.time)}).`),t.push({level:"warn",kind:"conflict",icon:"alert",ids:[d.id,i.id],title:$,text:y,fixes:qt(e,d,i)})}let r=c.filter(Se);for(let n=0;n<r.length-1;n++){let m=r[n],d=r[n+1],i=j(d.time)-Y(m)[1];(m.location||m.companyId)!==(d.location||d.companyId)&&i>=0&&i<o.travelMin&&t.push({level:"warn",kind:"conflict",icon:"route",ids:[m.id,d.id],title:`${J(e)}: pouco tempo de deslocamento`,text:`S\xF3 ${i} min entre \u201C${q(m)}\u201D e \u201C${q(d)}\u201D, em lugares diferentes (combinado: ${o.travelMin} min).`,fixes:[{label:`Mover para ${x(pe(Y(m)[1]+o.travelMin))}`,eventId:d.id,patch:{time:pe(Math.ceil((Y(m)[1]+o.travelMin)/15)*15)}}]})}return t}function Bt(e,a="all"){let t=[],o=a==="all"?s.team.map(i=>i.id):[a];o.forEach(i=>t.push(...xe(i,e)));let c=I(),r=s.eventsOn(e,{person:a}),n={};if(r.filter(i=>i.time&&["feed","reels","carrossel"].includes(i.type)).forEach(i=>(n[i.companyId]||=[]).push(i)),Object.values(n).forEach(i=>{for(let l=0;l<i.length-1;l++){let u=j(i[l+1].time)-j(i[l].time);u<180&&t.push({level:"info",icon:"clock",ids:[i[l].id,i[l+1].id],title:`${s.company(i[l].companyId)?.name||"Empresa"}: posts muito pr\xF3ximos`,text:`Dois posts de feed/Reels com s\xF3 ${K(u)} de diferen\xE7a. Espacem ao menos 3 h para um n\xE3o \u201Croubar\u201D o alcance do outro.`})}}),e===_()){let i=r.filter(l=>l.time&&l.status==="pendente"&&j(l.time)+15<F());i.length&&t.unshift({level:"warn",kind:"late",icon:"flag",ids:i.map(l=>l.id),title:i.length===1?"1 tarefa atrasada":`${i.length} tarefas atrasadas`,text:i.map(l=>`${x(l.time)} ${q(l)}`).join(" \xB7 ")+". Marque como feito ou reagende."})}let m=r.filter(i=>!(i.assignees||[]).length);if(m.length&&a==="all"&&t.push({level:"warn",icon:"user",ids:m.map(i=>i.id),title:"Tarefa sem respons\xE1vel",text:m.map(i=>`${x(i.time)} ${q(i)}`).join(" \xB7 ")+". Definam quem vai fazer."}),a==="all"&&s.team.length===2){let[i,l]=s.team,u=s.eventsOn(e,{person:i.id}).length,$=s.eventsOn(e,{person:l.id}).length;if(Math.abs(u-$)>=4){let[y,D]=u>$?[i,l]:[l,i];t.push({level:"info",icon:"users",title:"Dia desequilibrado",text:`${y.name} tem ${Math.max(u,$)} tarefas e ${D.name} tem ${Math.min(u,$)}. Que tal passar alguns stories para o ${D.name}?`})}}o.forEach(i=>{let l=ee(i,e),u=s.eventsOn(e,{person:i}).length;!l.dayOff&&l.minutes!=null&&u&&l.longest<45&&t.push({level:"info",kind:"rest",icon:"clock",title:`${J(i)} est\xE1 sem pausa`,text:l.longest>0?`O maior intervalo livre do dia \xE9 de ${K(l.longest)}. Programem posts com anteced\xEAncia para abrir espa\xE7o.`:"N\xE3o sobra nenhum intervalo livre no expediente. Programem posts com anteced\xEAncia para abrir espa\xE7o."}),l.dayOff&&u&&t.push({level:"info",kind:"rest",icon:"clock",title:`${J(i)}: dia de folga`,text:`H\xE1 ${u} tarefa${u>1?"s":""} marcada${u>1?"s":""} na folga. Posts podem ficar programados para ningu\xE9m trabalhar.`}),u>c.maxTasks&&t.push({level:"warn",kind:"rest",icon:"alert",title:`${J(i)} sobrecarregado`,text:`${u} tarefas (limite combinado: ${c.maxTasks}).`})}),s.eventsOn(k(e,1),{person:a}).filter(i=>i.type==="captacao").forEach(i=>{let l=s.company(i.companyId);t.push({level:"prep",icon:"camera",ids:[i.id],title:`Amanh\xE3: capta\xE7\xE3o${l?" na "+l.name:""} \xE0s ${x(i.time)}`,text:"Hoje: carregue baterias, esvazie cart\xF5es de mem\xF3ria, confirme o hor\xE1rio com o cliente e defina o roteiro de tomadas."})}),!t.some(i=>i.kind==="conflict")&&r.length&&t.push({level:"ok",icon:"check",title:"Agenda sem conflitos",text:"Ningu\xE9m est\xE1 em dois lugares ao mesmo tempo."});let d=Math.abs(ut("2024-01-01",e))%Ie.length;return t.push({level:"tip",icon:"bulb",title:"Dica do dia",text:Ie[d]}),t}function Ht(e,a=14){let t=[],o=_();for(let c=0;c<a;c++){let r=k(o,c);xe(e,r).forEach(n=>t.push({...n,date:r}))}return t}function Ft(e="all"){let a=_(),t=F();return s.eventsOn(a,{person:e}).find(o=>o.time&&o.status!=="feito"&&j(o.time)+ge(o)>t)||null}function Vt(){return`<div class="seg" role="tablist">
    ${[{id:"all",name:"Todos"},...s.team].map(a=>`<button class="seg__btn${h.person===a.id?" is-on":""}" data-action="set-person" data-p="${a.id}">
      ${a.id==="all"?p("users",15):M(a.id,18)}<span>${f(a.name)}${s.me===a.id?"<em> (voc\xEA)</em>":""}</span></button>`).join("")}
  </div>`}function Ea(e,a=4){let t=[];return e.forEach(o=>{t.includes(o.companyId)||t.push(o.companyId)}),t.slice(0,a).map(o=>`<i style="background:${s.company(o)?.color||"#999"}"></i>`).join("")}function zt(){let e=h.date,a=_(),t=s.eventsOn(e,{person:h.person}),o=Bt(e,h.person),c=o.filter(g=>g.level==="warn"&&g.icon!=="flag").flatMap(g=>g.ids||[]),r=s.member(s.me),n=pt(e),m=Array.from({length:7},(g,E)=>k(n,E)),d=(()=>{let g=G(m[0]),E=G(m[6]);return g.getMonth()===E.getMonth()?`${g.getDate()}\u2013${E.getDate()} de ${ue[E.getMonth()]}`:`${g.getDate()} ${ue[g.getMonth()]} \u2013 ${E.getDate()} ${ue[E.getMonth()]}`})(),i=`
  <header class="hdr">
    <div class="hdr__row">
      <div class="hdr__titles">
        <p class="hdr__eyebrow">${e===a?`${yt()}${r?", "+f(r.name):""}`:f(ie(e))}</p>
        <h1>${f($t(e))}${e===a?`<span class="hdr__date">${f(bt(e))}</span>`:""}</h1>
      </div>
      <div class="hdr__actions">
        ${e!==a?'<button class="chip chip--accent" data-action="go-today">Hoje</button>':""}
        <button class="iconbtn iconbtn--ai" data-action="assistant" aria-label="Assistente">${p("sparkle",20)}</button>
        <button class="iconbtn" data-action="tab" data-tab="ajustes" aria-label="Perfil">${r?M(r.id,34):p("user",20)}</button>
      </div>
    </div>
    ${Vt()}
    <div class="week">
      <div class="week__bar">
        <button class="iconbtn iconbtn--sm" data-action="week" data-n="-7" aria-label="Semana anterior">${p("left",18)}</button>
        <span>${f(d)}</span>
        <button class="iconbtn iconbtn--sm" data-action="week" data-n="7" aria-label="Pr\xF3xima semana">${p("right",18)}</button>
      </div>
      <div class="week__days" data-swipe="week">
        ${m.map(g=>{let E=G(g),B=s.eventsOn(g,{person:h.person}),S=B.filter(se=>se.status!=="feito").length;return`<button class="wday${g===e?" is-sel":""}${g===a?" is-today":""}" data-action="set-date" data-k="${g}">
            <span class="wday__l">${Z[E.getDay()]}</span>
            <span class="wday__n">${E.getDate()}</span>
            <span class="wday__dots">${Ea(B,3)}${B.length?"":'<i class="none"></i>'}</span>
            ${S?`<span class="sr">${S} pendentes</span>`:""}
          </button>`}).join("")}
      </div>
    </div>
  </header>`,l={};t.forEach(g=>l[g.type]=(l[g.type]||0)+1);let u=t.filter(g=>g.status==="feito").length,$=t.length?Math.round(u/t.length*100):0,y=t.length?`<div class="summary">
        <div class="summary__progress">
          <div class="ring" style="--p:${$}"><span>${$}%</span></div>
          <div><strong>${u} de ${t.length}</strong><small>tarefas conclu\xEDdas</small></div>
        </div>
        <div class="summary__types">
          ${Object.entries(l).sort((g,E)=>E[1]-g[1]).map(([g,E])=>`<span class="tcount tbadge--${g}">${p(A[g].icon,13)}<b>${E}</b> ${A[g].label}</span>`).join("")}
        </div>
      </div>`:"",D=h.person==="all"?`<section class="block">
      <h2 class="block__title">${p("route",16)} Onde cada um vai estar</h2>
      <div class="team">${s.team.map(g=>Aa(g,e)).join("")}</div>
    </section>`:"",b="";if(e===a){let g=Ft(h.person);if(g){let E=s.company(g.companyId),B=j(g.time)-F(),S=E?.color||"#555";b=`<button class="next" style="--cc:${S};--cc-soft:${wt(S,.12)}" data-action="open-event" data-id="${g.id}">
        <div class="next__label">${p("bell",14)} ${B>0?"Pr\xF3ximo \xB7 "+vt(B):"Acontecendo agora"}</div>
        <div class="next__row">
          ${Be(E,44)}
          <div class="next__txt">
            <strong>${x(g.time)} \xB7 ${f(A[g.type].label)} \xB7 ${f(E?.name||"")}</strong>
            <span>${f(g.title||"")}</span>
          </div>
          ${Tt(g.assignees,26)}
        </div>
        ${g.location?`<div class="next__loc">${p("pin",13)} ${f(g.location)}</div>`:""}
      </button>`}}let P=o.filter(g=>g.level==="warn").length,w=`<section class="block">
    <button class="tipsbar${h.showAllTips?" is-open":""}" data-action="toggle-tips">
      <span>${p("bulb",17)} Dicas e alertas</span>
      ${P?`<em class="tipsbar__warn">${P} ${P===1?"alerta":"alertas"}</em>`:`<em>${o.length}</em>`}
      ${p(h.showAllTips?"down":"right",16,"muted")}
    </button>
    ${h.showAllTips?`<div class="tips">${o.map(Ta).join("")}</div>`:""}
  </section>`,L;if(!t.length)L=Fe("Dia livre",h.person==="all"?"Nada agendado para este dia.":`Nada agendado para ${s.member(h.person)?.name}.`,`<button class="btn btn--primary" data-action="new-event" data-date="${e}">${p("plus",18)} Adicionar</button>`);else{let g=[{k:"Manh\xE3",icon:"sun",items:t.filter(S=>S.time&&j(S.time)<720)},{k:"Tarde",items:t.filter(S=>S.time&&j(S.time)>=720&&j(S.time)<1080)},{k:"Noite",items:t.filter(S=>S.time&&j(S.time)>=1080)},{k:"Sem hor\xE1rio",items:t.filter(S=>!S.time)}],E=F(),B=e!==a;L=g.filter(S=>S.items.length).map(S=>`
      <div class="tl-group">
        <h3 class="tl-group__h">${S.k}<span>${S.items.length}</span></h3>
        ${S.items.map(se=>{let dt="";return!B&&se.time&&j(se.time)>E&&(B=!0,dt=`<div class="nowline"><span>Agora \xB7 ${x(`${String(new Date().getHours()).padStart(2,"0")}:${String(new Date().getMinutes()).padStart(2,"0")}`)}</span></div>`),dt+He(se,{highlight:c})}).join("")}
      </div>`).join(""),!B&&e===a&&(L+=`<div class="nowline nowline--end"><span>Agora \xB7 ${x(`${String(new Date().getHours()).padStart(2,"0")}:${String(new Date().getMinutes()).padStart(2,"0")}`)} \xB7 fim da agenda</span></div>`)}let V=s.notesOn(e),oe=`<section class="block">
    <h2 class="block__title">${p("note",16)} Bilhetes do dia</h2>
    <div class="notes">
      ${V.map(g=>`<div class="note">
        <p>${f(g.text)}</p>
        <footer>${M(g.author,18)}<span>${f(s.member(g.author)?.name||"")}</span>
          <button class="note__del" data-action="del-note" data-id="${g.id}" aria-label="Apagar bilhete">${p("x",14)}</button></footer>
      </div>`).join("")}
      <form class="note-add" data-form="note">
        <input name="text" placeholder="Escreva um bilhete para a dupla\u2026" autocomplete="off" maxlength="280">
        <button class="iconbtn iconbtn--accent" aria-label="Adicionar bilhete">${p("plus",18)}</button>
      </form>
    </div>
  </section>`;return`${i}
  <div class="page">
    ${s.demo?ja():""}
    ${b}
    <button class="brief" data-action="assistant">
      <span class="brief__ic">${p("sparkle",18)}</span>
      <div><strong>Assistente</strong>${ce(e,h.person).map(g=>`<p>${f(g)}</p>`).join("")}</div>
      ${p("right",18,"muted")}
    </button>
    ${D}
    <section class="block">
      <h2 class="block__title">${p("clock",16)} Agenda ${h.person==="all"?"da dupla":"de "+f(s.member(h.person)?.name||"")}</h2>
      ${y}
      ${L}
    </section>
    ${w}
    ${oe}
  </div>`}function Aa(e,a){let t=s.eventsOn(a,{person:e.id}),o=a===_()?F():-1,c=t.filter(i=>["shoot","meeting"].includes(A[i.type]?.kind)),r=t.filter(i=>re(i.type)).length,n=t.find(i=>i.time&&i.status!=="feito"&&j(i.time)+ge(i)>o),m=ee(e.id,a),d=m.dayOff?"Folga":`${K(Math.round(m.minutes/15)*15)||"0 min"} livres`;return`<button class="team__col" data-action="set-person" data-p="${e.id}">
    <span class="team__free ${m.dayOff?"is-off":m.minutes>=240?"is-good":m.minutes>=120?"is-mid":"is-low"}">${p("clock",12)} ${d}</span>
    <div class="team__head">${M(e.id,30)}<div><strong>${f(e.name)}</strong><small>${t.length} tarefa${t.length===1?"":"s"} \xB7 ${r} post${r===1?"":"s"}</small></div></div>
    <ul class="team__where">
      ${c.length?c.map(i=>`<li>${p(A[i.type].icon,13)}<span><b>${x(i.time)}</b> ${f(s.company(i.companyId)?.name||"")}</span></li>`).join(""):`<li class="muted">${p("building",13)}<span>Trabalho interno / remoto</span></li>`}
    </ul>
    ${n?`<div class="team__next">Pr\xF3ximo: <b>${x(n.time)}</b> ${f(A[n.type].label)} \xB7 ${f(s.company(n.companyId)?.name||"")}</div>`:`<div class="team__next muted">${t.length?"Tudo conclu\xEDdo \u2713":"Livre"}</div>`}
  </button>`}function Ta(e){let a=e.fixes?.length?`<div class="fixes">${e.fixes.map(t=>`<button class="fixbtn" data-action="apply-fix" data-id="${t.eventId}" data-patch="${f(JSON.stringify(t.patch))}">${p("check",13)} ${f(t.label)}</button>`).join("")}</div>`:"";return`<div class="tip tip--${e.level}"${e.ids?.length===1&&!a?` data-action="open-event" data-id="${e.ids[0]}"`:""}>
    <span class="tip__ic">${p(e.icon,16)}</span>
    <div><strong>${f(e.title)}</strong><p>${f(e.text)}</p>${a}</div>
  </div>`}function ja(){return`<div class="banner">
    ${p("sparkle",18)}
    <p><strong>Voc\xEA est\xE1 vendo dados de exemplo.</strong> Explore \xE0 vontade e, quando quiser come\xE7ar de verdade, apague os exemplos.</p>
    <button class="btn btn--soft btn--sm" data-action="clear-demo">Apagar exemplos</button>
  </div>`}function Ut(){let e=h.month,[a,t]=e.split("-").map(Number),o=new Date(a,t-1,1),c=k(mt(o),-o.getDay()),r=_(),n=Array.from({length:42},(w,L)=>k(c,L)),d=n.slice(35).some(w=>w.slice(0,7)===e)?n:n.slice(0,35),i={person:h.person,companyId:h.monthCompany},l=s.companiesSorted(),u=h.monthSel,$=s.eventsOn(u,i),y=s.eventsBetween(`${e}-01`,`${e}-31`,i),D=y.filter(w=>re(w.type)).length,b=y.filter(w=>w.type==="captacao").length,P=y.filter(w=>w.type==="reuniao").length;return`
  <header class="hdr">
    <div class="hdr__row">
      <div class="hdr__titles">
        <p class="hdr__eyebrow">Calend\xE1rio</p>
        <h1>${f(gt(e).split(" ")[0])}<span class="hdr__date">${e.slice(0,4)}</span></h1>
      </div>
      <div class="hdr__actions">
        <button class="iconbtn" data-action="month" data-n="-1" aria-label="M\xEAs anterior">${p("left",20)}</button>
        <button class="chip" data-action="month-today">Hoje</button>
        <button class="iconbtn" data-action="month" data-n="1" aria-label="Pr\xF3ximo m\xEAs">${p("right",20)}</button>
      </div>
    </div>
    ${Vt()}
  </header>
  <div class="page">
    <div class="chips-scroll">
      <button class="chip${h.monthCompany?"":" is-on"}" data-action="month-company" data-id="">Todas as empresas</button>
      ${l.map(w=>`<button class="chip chip--co${h.monthCompany===w.id?" is-on":""}" style="--cc:${w.color}" data-action="month-company" data-id="${w.id}">${Be(w,18,5)}${f(w.name)}</button>`).join("")}
    </div>

    <div class="mstats">
      <div><b>${D}</b><span>posts</span></div>
      <div><b>${b}</b><span>capta\xE7\xF5es</span></div>
      <div><b>${P}</b><span>reuni\xF5es</span></div>
      <div><b>${y.filter(w=>w.status==="feito").length}/${y.length}</b><span>conclu\xEDdos</span></div>
    </div>

    <div class="month" data-swipe="month">
      <div class="month__wd">${ft.map(w=>`<span>${w}</span>`).join("")}</div>
      <div class="month__grid">
        ${d.map(w=>{let L=w.slice(0,7)===e,V=s.eventsOn(w,i),oe=V.some(g=>g.type==="captacao");return`<button class="mday${L?"":" is-out"}${w===r?" is-today":""}${w===u?" is-sel":""}" data-action="month-select" data-k="${w}">
            <span class="mday__n">${Number(w.slice(8))}</span>
            ${V.length?`<span class="mday__bars">${Ca(V)}</span><span class="mday__count">${oe?p("camera",10):""}${V.length}</span>`:""}
          </button>`}).join("")}
      </div>
    </div>

    <section class="block">
      <div class="block__row">
        <h2 class="block__title">${f(he(u))}</h2>
        <button class="btn-text btn-text--sm" data-action="open-day" data-k="${u}">Abrir dia ${p("right",14)}</button>
      </div>
      ${$.length?$.map(w=>He(w)).join(""):Fe("Nada neste dia","Toque no + para agendar.",`<button class="btn btn--soft" data-action="new-event" data-date="${u}">${p("plus",16)} Novo evento</button>`)}
    </section>

    ${l.length?`<section class="block">
      <h2 class="block__title">Legenda</h2>
      <div class="legend">${l.map(w=>`<span><i style="background:${w.color}"></i>${f(w.name)}</span>`).join("")}</div>
    </section>`:""}
  </div>`}function Ca(e){let a={};return e.forEach(t=>a[t.companyId]=(a[t.companyId]||0)+1),Object.entries(a).slice(0,4).map(([t])=>`<i style="background:${s.company(t)?.color||"#999"}"></i>`).join("")}var Je="pauta.onboarded",Ee="pauta.notifyAskedAt";function Kt(){if(!localStorage.getItem(Je))return We(s.me?["welcome","notify","done"]:["welcome","who","notify","done"]);if(!s.me&&s.mode==="local")return We(["who"]);let a=Number(localStorage.getItem(Ee)||0);if(be()&&W()==="default"&&Date.now()-a>3*864e5)return We(["notify"])}function Ye(e,a,t="agora"){return`<div class="nprev">
    <img src="icons/icon-192.png" alt="">
    <div><div class="nprev__top"><b>${f(T.appName.toUpperCase())}</b><span>${f(t)}</span></div>
    <strong>${f(e)}</strong><p>${f(a)}</p></div>
  </div>`}function Da(e,a,t){let o=s.member(s.me),c=s.team.find(n=>n.id!==s.me)||s.team[1]||s.team[0],r=t>1?`<div class="ob__dots">${Array.from({length:t},(n,m)=>`<i class="${m===a?"is-on":""}"></i>`).join("")}</div>`:"";return e==="welcome"?`<div class="ob__art"><img class="ob__icon" src="icons/icon-512.png" alt=""></div>
      <h1>Bem-vindo ao ${f(T.appName)}</h1>
      <p>A agenda de conte\xFAdo de ${f(T.agencyName)}: posts, stories, reels e capta\xE7\xF5es de todas as empresas, num lugar s\xF3.</p>
      ${r}
      <button class="btn btn--primary btn--block" data-next>Come\xE7ar</button>`:e==="who"?`<div class="ob__art ob__art--sm">${p("user",34)}</div>
      <h1>Quem vai usar este celular?</h1>
      <p>Assim o app sabe de quem s\xE3o os lembretes e avisa o parceiro quando voc\xEA marcar algo.</p>
      <div class="whogrid ob__who">${s.team.map(n=>`<button class="whobtn${s.me===n.id?" is-on":""}" style="--mc:${n.color}" data-me="${n.id}">${M(n.id,36)}<span>${f(n.name)}</span><i class="whobtn__check">${p("check",14)}</i></button>`).join("")}</div>
      ${r}
      <button class="btn btn--primary btn--block" data-next ${s.me?"":"disabled"}>Continuar</button>`:e==="notify"?`<div class="ob__previews">
        ${Ye("Daqui a 2h: Reels \xB7 Pura Vida","18h \u2014 postar o Reels \u201CBastidores\u201D","agora")}
        ${Ye(`${c?.name||"Seu parceiro"} marcou para voc\xEA`,"Story \xB7 Caf\xE9 Aroma \u2014 amanh\xE3, 16h","h\xE1 2 min")}
        ${Ye(`Bom dia, ${o?.name||"Henrique"}! Seu dia hoje`,"5 tarefas \xB7 primeira: 11h30 Feed \xB7 Studio Fit","8:00")}
      </div>
      <h1>Nunca mais esque\xE7a um post</h1>
      <p>Lembretes 2h e 30 min antes de cada post, aviso na v\xE9spera das capta\xE7\xF5es, cobran\xE7a se algo ficou para tr\xE1s e aviso quando o parceiro marcar algo para voc\xEA.</p>
      <div data-notify-msg></div>
      ${r}
      <button class="btn btn--primary btn--block" data-enable>${p("bell",18)} Ativar notifica\xE7\xF5es</button>
      <button class="btn btn--ghost btn--block" data-skip>Agora n\xE3o</button>`:`<div class="ob__art ob__art--ok">${p("check",40)}</div>
    <h1>Tudo pronto${o?", "+f(o.name):""}!</h1>
    <ul class="ob__tips">
      <li>${p("plus",18)}<span>Toque no <b>+</b> para marcar posts, capta\xE7\xF5es e reuni\xF5es.</span></li>
      <li>${p("sparkle",18)}<span>O <b>Assistente</b> avisa conflitos e sugere os melhores hor\xE1rios.</span></li>
      <li>${p("link",18)}<span>Em <b>Empresas</b>, mande para cada cliente o link do cronograma dele.</span></li>
    </ul>
    ${r}
    <button class="btn btn--primary btn--block" data-next>Abrir a agenda</button>`}function We(e){if(document.querySelector(".ob"))return;let a=0,t=document.createElement("div");t.className="ob",t.innerHTML='<div class="ob__card"></div>',document.body.appendChild(t),requestAnimationFrame(()=>t.classList.add("is-in"));let o=t.querySelector(".ob__card"),c=()=>{(e.includes("welcome")||e.includes("done"))&&localStorage.setItem(Je,"1"),t.classList.remove("is-in"),setTimeout(()=>t.remove(),400)},r=d=>{if(d>=e.length)return c();a=d,o.classList.remove("is-shown"),setTimeout(()=>{o.innerHTML=Da(e[a],a,e.length),m(),o.classList.add("is-shown")},o.innerHTML?180:0)},n=(d,i="info")=>{let l=o.querySelector("[data-notify-msg]");l&&(l.innerHTML=`<div class="ob__msg ob__msg--${i}">${d}</div>`)},m=()=>{o.querySelectorAll("[data-next]").forEach(l=>l.onclick=()=>r(a+1)),o.querySelectorAll("[data-me]").forEach(l=>l.onclick=()=>{s.setMe(l.dataset.me),o.querySelectorAll("[data-me]").forEach(u=>u.classList.toggle("is-on",u===l)),o.querySelector("[data-next]").disabled=!1});let d=o.querySelector("[data-skip]");d&&(d.onclick=()=>{localStorage.setItem(Ee,String(Date.now())),r(a+1)});let i=o.querySelector("[data-enable]");i&&(i.onclick=async()=>{if(localStorage.setItem(Ee,String(Date.now())),we()){n(`<b>Primeiro instale o app.</b> No iPhone, as notifica\xE7\xF5es s\xF3 funcionam pelo \xEDcone da Tela de In\xEDcio:<br>
          1. Toque em ${p("share",14)} <b>Compartilhar</b><br>2. <b>Adicionar \xE0 Tela de In\xEDcio</b><br>3. Abra o ${f(T.appName)} pelo \xEDcone`,"warn"),i.outerHTML='<button class="btn btn--primary btn--block" data-next>Entendi</button>',m();return}i.disabled=!0,i.innerHTML="Aguardando permiss\xE3o\u2026";let l=await _e().catch(()=>({ok:!1,reason:"error"}));l.ok?(l.local?n("Ativado neste celular. Para os avisos chegarem com o app fechado e no celular do parceiro, falta ligar o servidor de notifica\xE7\xF5es (Ajustes \u2192 Notifica\xE7\xF5es).","ok"):(n("Pronto! Voc\xEA vai receber uma notifica\xE7\xE3o de teste em instantes.","ok"),ke().catch(()=>{})),i.outerHTML='<button class="btn btn--primary btn--block" data-next>Continuar</button>',o.querySelector("[data-skip]")?.remove(),m()):l.reason==="server"?(n("Permiss\xE3o concedida! O servidor de notifica\xE7\xF5es ainda n\xE3o foi publicado; quando for, este celular \xE9 cadastrado sozinho.","ok"),i.outerHTML='<button class="btn btn--primary btn--block" data-next>Continuar</button>',m()):l.reason==="denied"?(n(`As notifica\xE7\xF5es foram bloqueadas. Para ligar depois: <b>Ajustes do iPhone \u2192 Notifica\xE7\xF5es \u2192 ${f(T.appName)}</b>.`,"warn"),i.outerHTML='<button class="btn btn--primary btn--block" data-next>Continuar</button>',m()):(n("Este aparelho n\xE3o aceita notifica\xE7\xF5es deste app.","warn"),i.disabled=!1,i.innerHTML="Tentar de novo")})};r(0)}function Yt(){localStorage.removeItem(Je),localStorage.removeItem(Ee),v("A apresenta\xE7\xE3o aparece na pr\xF3xima abertura")}function Wt(){let e=s.member(s.me),a=s.mode==="cloud",t="Notification"in window&&Notification.permission==="granted";return`
  <header class="hdr">
    <div class="hdr__row"><div class="hdr__titles"><p class="hdr__eyebrow">${f(T.appName)} \xB7 ${f(T.agencyName)}</p><h1>Ajustes</h1></div></div>
  </header>
  <div class="page">
    <section class="block">
      <h2 class="block__title">${p("user",16)} Quem est\xE1 usando este celular?</h2>
      ${a?`<div class="card card--row">${e?M(e.id,40):p("user",24)}<div><strong>${f(e?.name||s.user?.email||"")}</strong><small>${f(s.user?.email||"")}</small></div>
            <button class="btn btn--soft btn--sm" data-action="logout">${p("logout",16)} Sair</button></div>`:`<div class="whogrid">${s.team.map(o=>`<button class="whobtn${s.me===o.id?" is-on":""}" style="--mc:${o.color}" data-action="set-me" data-p="${o.id}">${M(o.id,34)}<span>${f(o.name)}</span><i class="whobtn__check">${p("check",14)}</i></button>`).join("")}</div>
           <p class="fhelp">Usado para sauda\xE7\xE3o, \u201CCriado por\u201D e nos lembretes.</p>`}
    </section>

    ${qa()}

    <section class="block">
      <h2 class="block__title">${p("sparkle",16)} Assistente e Claude</h2>
      <div class="card card--row">
        ${p("sparkle",22)}
        <div><strong>Assistente autom\xE1tico ativo</strong><small>Confere conflitos, tempo livre e melhores hor\xE1rios sozinho, sem internet e sem chave.</small></div>
        <button class="btn btn--soft btn--sm" data-action="assistant">Abrir</button>
      </div>
      <p class="fhelp">Para perguntas abertas (ideias, reorganizar a semana), use \u201CPerguntar ao Claude\u201D no Assistente. Abre o Claude com o seu login normal, sem chave de API.</p>
    </section>

    ${Ma()}

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

    ${be()?"":`<section class="block">
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
          ${xt.map(o=>`<li><span class="tbadge tbadge--${o.type}">${p(A[o.type].icon,13)}${A[o.type].label}</span><span>${f(o.text)}</span></li>`).join("")}
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
    <p class="about">${f(T.appName)} \u2014 agenda de conte\xFAdo \xB7 v1.0</p>
  </div>`}function Ma(){let e=W(),a=we(),t=s.mode==="cloud",o=!!localStorage.getItem("pauta.device"),c=It(),r,n,m="";return a?(r="warn",n="No iPhone, as notifica\xE7\xF5es s\xF3 funcionam com o app instalado: Compartilhar \u2192 Adicionar \xE0 Tela de In\xEDcio, e abra pelo \xEDcone."):e==="unsupported"?(r="warn",n="Este navegador n\xE3o aceita notifica\xE7\xF5es."):e==="denied"?(r="warn",n=`Bloqueadas. Para ligar: Ajustes do iPhone \u2192 Notifica\xE7\xF5es \u2192 ${T.appName}.`):e!=="granted"?(r="warn",n="Desativadas neste celular.",m='<button class="btn btn--primary btn--sm" data-action="notify-enable">Ativar</button>'):t&&o?(r="ok",n="Ativadas. Os lembretes e os avisos do parceiro chegam mesmo com o app fechado.",m='<button class="btn btn--soft btn--sm" data-action="notify-enable">Recadastrar</button>'):t?(r="warn",n="Permiss\xE3o concedida, mas este celular ainda n\xE3o foi cadastrado no servidor. Toque em Cadastrar.",m='<button class="btn btn--primary btn--sm" data-action="notify-enable">Cadastrar</button>'):(r="warn",n="Ativadas s\xF3 com o app aberto. Para receber com o app fechado e no celular do parceiro, ligue a nuvem e o servidor (README)."),`<section class="block">
    <h2 class="block__title">${p("bell",16)} Notifica\xE7\xF5es</h2>
    <div class="card card--row ${r==="ok"?"card--ok":"card--warn"}">
      ${p("bell",22)}
      <div><strong>${r==="ok"?"Funcionando":"Aten\xE7\xE3o"}</strong><small>${f(n)}</small></div>
      ${m}
    </div>
    <form class="list notif-prefs" data-notify-form onsubmit="return false">
      <label class="list__row"><span><b>Lembretes dos meus posts</b><small>2h e 30 min antes, na hora e cobran\xE7a se atrasar</small></span><input type="checkbox" class="switch" name="reminders" ${c.reminders?"checked":""}></label>
      <label class="list__row"><span><b>Avisos do parceiro</b><small>quando marcar, mudar ou concluir algo</small></span><input type="checkbox" class="switch" name="partner" ${c.partner?"checked":""}></label>
      <label class="list__row"><span><b>Resumo do dia</b><small>\xE0s 8h (hoje) e \xE0s 20h (amanh\xE3)</small></span><input type="checkbox" class="switch" name="daily" ${c.daily?"checked":""}></label>
    </form>
    ${e==="granted"?`<button class="btn btn--soft btn--block" data-action="notify-test">${p("bell",16)} Enviar notifica\xE7\xE3o de teste</button>`:""}
    <button class="btn-text btn-text--sm" data-action="onboarding-again">Ver a apresenta\xE7\xE3o de novo</button>
  </section>`}function qa(){let e=I(),a=[0,15,30,45,60,90];return`<section class="block">
    <h2 class="block__title">${p("clock",16)} Rotina e tempo livre</h2>
    <form class="list" data-routine-form onsubmit="return false">
      <label class="list__row"><span>Expediente</span><input type="time" name="workStart" value="${e.workStart}"> <input type="time" name="workEnd" value="${e.workEnd}"></label>
      <label class="list__row"><span>Almo\xE7o</span><input type="time" name="lunchStart" value="${e.lunchStart}"> <input type="time" name="lunchEnd" value="${e.lunchEnd}"></label>
      <label class="list__row"><span>Deslocamento entre lugares</span><select name="travelMin">${a.map(t=>`<option value="${t}"${e.travelMin===t?" selected":""}>${t?t+" min":"n\xE3o considerar"}</option>`).join("")}</select></label>
      <label class="list__row"><span>M\xE1ximo de tarefas/dia</span><select name="maxTasks">${[4,5,6,7,8,10,12,15,20].map(t=>`<option value="${t}"${e.maxTasks===t?" selected":""}>${t}</option>`).join("")}</select></label>
      <div class="list__row list__row--col"><span>Dias de folga</span>
        <div class="daysoff">${Z.map((t,o)=>`<label class="dayoff"><input type="checkbox" name="off" value="${o}"${e.daysOff.includes(o)?" checked":""}><span>${t}</span></label>`).join("")}</div>
      </div>
    </form>
    <p class="fhelp">O assistente usa isso para n\xE3o marcar nada em cima do almo\xE7o, da folga ou fora do expediente, e para proteger o tempo livre de voc\xEAs.</p>
  </section>`}var H={async notifyEnable(){let e=await _e().catch(a=>({ok:!1,reason:"error",message:a.message}));e.ok?v(e.local?"Ativado (com o app aberto)":"Notifica\xE7\xF5es ativadas"):e.reason==="install"?v("Instale o app na Tela de In\xEDcio primeiro"):e.reason==="denied"?v("Bloqueado: libere em Ajustes do iPhone \u2192 Notifica\xE7\xF5es"):e.reason==="server"?v("Servidor de notifica\xE7\xF5es ainda n\xE3o publicado"):v(`N\xE3o foi poss\xEDvel ativar${e.message?": "+e.message:""}`,{ms:8e3}),s.emit()},async notifyTest(){let e;try{e=await ke()}catch(a){return v(`Falhou: ${a.message}`,{ms:8e3})}if(e.kind==="not-registered")return v('Este celular ainda n\xE3o est\xE1 cadastrado. Toque em "Ativar" acima.',{ms:7e3});if(e.kind==="local")return v("Notifica\xE7\xE3o local mostrada (servidor n\xE3o configurado)");if(e.sent>0)return v("Enviada! Deve chegar em alguns segundos. Bloqueie a tela para ver.",{ms:7e3});if(!e.devices)return v('O servidor n\xE3o tem este celular cadastrado. Toque em "Ativar" de novo.',{ms:7e3});v(`A Apple n\xE3o aceitou o envio (${(e.statuses||[]).join(", ")||"sem resposta"}). Toque em "Ativar" de novo.`,{ms:9e3})},async notifyPrefs(e){await Rt({reminders:e.reminders.checked,partner:e.partner.checked,daily:e.daily.checked}),v("Prefer\xEAncias salvas")},onboardingAgain(){Yt()},async routine(e){let a=(c,r)=>/^\d{2}:\d{2}$/.test(e[c].value)?e[c].value:r,t=I(),o={id:"routine",workStart:a("workStart",t.workStart),workEnd:a("workEnd",t.workEnd),lunchStart:a("lunchStart",t.lunchStart),lunchEnd:a("lunchEnd",t.lunchEnd),travelMin:Number(e.travelMin.value),maxTasks:Number(e.maxTasks.value),daysOff:[...e.querySelectorAll('input[name="off"]:checked')].map(c=>Number(c.value))};if(o.workEnd<=o.workStart)return v("O fim do expediente precisa ser depois do in\xEDcio");if(o.lunchEnd<=o.lunchStart)return v("O fim do almo\xE7o precisa ser depois do in\xEDcio");await s.upsert("settings",o),v("Rotina salva")},async ics(e){let a=e.dataset.who==="me"?s.me:"all";if(e.dataset.who==="me"&&!s.me)return v("Escolha primeiro quem est\xE1 usando este celular");let t=Number(e.dataset.days),o=_(),c=s.eventsBetween(o,k(o,t),{person:a}).filter(n=>n.status!=="feito");if(!c.length)return v("Nada agendado nesse per\xEDodo");let r=a==="all"?`${T.appName} \u2013 Dupla`:`${T.appName} \u2013 ${s.member(a).name}`;await Nt(c,`pauta-${a}-${o}.ics`,r)},export(){let e=new Blob([s.exportData()],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(e),a.download=`pauta-backup-${_()}.json`,document.body.appendChild(a),a.click(),a.remove(),v("Backup exportado")},async import(e){let a=e.files[0];if(a)try{let t=await a.text(),o=await Dt({title:"Importar backup",text:"Como deseja importar?",options:[{label:"Juntar com os dados atuais",value:"merge",primary:!0},{label:"Substituir tudo",value:"replace",danger:!0}]});if(!o)return;await s.importData(t,{replace:o==="replace"}),v("Backup importado")}catch{v("Arquivo inv\xE1lido")}finally{e.value=""}},async clearAll(){await le({title:"Apagar TUDO?",text:"Empresas, eventos e bilhetes ser\xE3o apagados. Exporte um backup antes, se precisar.",ok:"Apagar tudo",danger:!0})&&(await s.clearAll(),v("Tudo apagado"))}};var Qe=[{label:"Organize meu dia",q:"Analise a agenda de hoje e me diga, em ordem, o que fazer e quando. Aponte conflitos e onde d\xE1 para ganhar tempo livre."},{label:"Melhores hor\xE1rios da semana",q:"Sugira os melhores hor\xE1rios para os posts desta semana de cada empresa, sem conflitar com as capta\xE7\xF5es e respeitando o expediente e o almo\xE7o."},{label:"Equilibrar a dupla",q:"A carga de trabalho entre Henrique e Matheus est\xE1 equilibrada nos pr\xF3ximos 7 dias? Sugira trocas concretas de respons\xE1vel."},{label:"Ideias de conte\xFAdo",q:"Para cada empresa, sugira 3 ideias de posts (feed, reels e stories) para a pr\xF3xima semana, com legenda curta."}],Na=(e=[])=>e.map(a=>s.member(a)?.name).filter(Boolean).join(" e ")||"sem respons\xE1vel";function Oa(e,a=14){let t=I(),o=_(),c=new Date,r=[];r.push(`Voc\xEA \xE9 o assistente de organiza\xE7\xE3o de uma dupla de social media (${s.team.map(d=>d.name).join(" e ")}) que cuida do Instagram de v\xE1rias empresas. Responda em portugu\xEAs do Brasil, de forma curta e direta (sem rodeios), com hor\xE1rios concretos e no m\xE1ximo uns 10 itens.`),r.push(""),r.push(`Agora: ${ie(o)}, ${c.toTimeString().slice(0,5)}.`),r.push(`Rotina combinada: expediente ${t.workStart}\u2013${t.workEnd}, almo\xE7o ${t.lunchStart}\u2013${t.lunchEnd}, folga: ${t.daysOff.map(d=>ht[d]).join(", ")||"nenhuma"}, deslocamento m\xEDnimo entre lugares: ${t.travelMin} min, m\xE1ximo de ${t.maxTasks} tarefas por pessoa/dia.`),r.push(`Empresas: ${s.companiesSorted().map(d=>d.name+(d.instagram?` (@${d.instagram})`:"")).join(", ")||"nenhuma"}.`),r.push(""),r.push(`Agenda (de hoje at\xE9 ${a} dias):`);let n=s.eventsBetween(k(o,-1),k(o,a)),m="";return n.forEach(d=>{d.date!==m&&(r.push(`
${ie(d.date)}:`),m=d.date);let i=s.company(d.companyId),l=d.duration?` (${d.duration} min)`:"";r.push(`- ${d.time||"sem hor\xE1rio"}${l} \xB7 ${A[d.type]?.label} \xB7 ${i?.name||"?"} \xB7 "${d.title||""}" \xB7 ${Na(d.assignees)} \xB7 ${d.status==="feito"?"feito":d.status==="pronto"?"pronto":"a fazer"}${d.location?" \xB7 local: "+d.location:""}`)}),n.length||r.push("(nenhum compromisso)"),r.push(""),r.push(`Pergunta: ${e}`),r.join(`
`)}function Xe(e){let a=Oa(e);try{navigator.clipboard?.writeText(a).catch(()=>{})}catch{}let t=encodeURIComponent(a),o=t.length<7500?`https://claude.ai/new?q=${t}`:"https://claude.ai/new";window.open(o,"_blank","noopener"),v(t.length<7500?"Abrindo o Claude\u2026 (a agenda tamb\xE9m foi copiada)":"Agenda copiada: cole no Claude (segure no campo \u2192 Colar)",{ms:5e3})}var Xt="cal.chat",R=(()=>{try{return JSON.parse(localStorage.getItem(Xt)||"[]").filter(e=>!e.error&&!/chave do Claude/.test(e.text||"")).slice(-30)}catch{return[]}})(),te=!1,Zt=!1;(async()=>{try{let{server:e}=await import("./c-YUYMP7XC.js");e()&&(Zt=!!(await(await fetch(e()+"/health")).json()).chat)}catch{}})();var Ze=()=>{try{localStorage.setItem(Xt,JSON.stringify(R.slice(-30)))}catch{}},Pa=e=>f(e).replace(/\*\*(.+?)\*\*/g,"<b>$1</b>").replace(/^#{1,4}\s*(.+)$/gm,"<b>$1</b>").replace(/^\s*[-•*]\s+(.+)$/gm,'<span class="li">$1</span>').replace(/<\/span>\n+(?=<span class="li">)/g,"</span>").replace(/\n{2,}/g,`
`).replace(/\n/g,"<br>"),Jt={"functions/failed-precondition":null,"functions/permission-denied":"S\xF3 a equipe pode usar o assistente.","functions/resource-exhausted":null,"functions/unavailable":"Sem conex\xE3o com o assistente agora. Tente de novo.","functions/deadline-exceeded":"O assistente demorou demais. Tente de novo."};function Ia(e){return e?.code==="local"?"O assistente precisa da sincroniza\xE7\xE3o na nuvem ligada.":e?.code==="no-server"?"O assistente ainda n\xE3o foi ligado no servidor. Falta publicar o servidor gratuito (veja o README).":e?.status?e.message:e?.code in Jt?Jt[e.code]||e.message:e?.code==="functions/not-found"||e?.code==="functions/internal"&&!/assistente|Claude/.test(e.message||"")?"O assistente ainda n\xE3o foi ligado no servidor. Falta publicar o servidor com a chave do Claude (veja o README, se\xE7\xE3o 5).":e?.message||"N\xE3o consegui falar com o assistente."}function Qt(){return`<section class="block" data-chat>
    <h2 class="block__title">${p("sparkle",16)} Pergunte ao assistente</h2>
    <div class="chat">
      ${R.length?R.map(e=>`<div class="msg msg--${e.role}${e.error?" msg--err":""}">${Pa(e.text)}</div>`).join(""):'<div class="msg msg--assistant">Oi! Eu vejo a agenda inteira de voc\xEAs: posts, capta\xE7\xF5es, reuni\xF5es, empresas e a rotina. Pergunte o que quiser, por exemplo \u201Co que eu tenho amanh\xE3?\u201D ou \u201Cqual o melhor hor\xE1rio para um Reels da Garcia na sexta?\u201D.</div>'}
      ${te?'<div class="msg msg--assistant msg--typing"><i></i><i></i><i></i></div>':""}
    </div>
    <div class="presets">${Qe.map((e,a)=>`<button class="preset" data-preset="${a}">${f(e.label)}</button>`).join("")}</div>
    <form class="chat__form" data-chatform onsubmit="return false">
      <textarea class="input" rows="1" name="q" placeholder="Escreva sua pergunta\u2026" ${te?"disabled":""}></textarea>
      <button class="iconbtn iconbtn--accent" type="submit" aria-label="Enviar" ${te?"disabled":""}>${p("right",20)}</button>
    </form>
    <div class="chat__foot">
      ${R.length?'<button class="btn-text btn-text--sm" data-clearchat>Limpar conversa</button>':"<span></span>"}
      <button class="btn-text btn-text--sm" data-extclaude>Abrir no app do Claude</button>
    </div>
  </section>`}var La=e=>f(JSON.stringify(e));function Ra(e="all"){let a=_(),t=e==="all"?s.team.map(n=>n.id):[e],o=[],c=new Set;for(let n=0;n<7;n++){let m=k(a,n);t.forEach(i=>xe(i,m).forEach(l=>{let u=l.ids.slice().sort().join("|")+l.title;c.has(u)||(c.add(u),o.push({...l,date:m}))})),s.eventsOn(m).filter(i=>!(i.assignees||[]).length&&i.status!=="feito").forEach(i=>o.push({date:m,level:"warn",icon:"user",ids:[i.id],title:"Sem respons\xE1vel",text:`${x(i.time)} ${q(i)}`,fixes:s.team.map(l=>({label:`Dar para ${l.name}`,eventId:i.id,patch:{assignees:[l.id]}}))}))}let r=s.state.events.filter(n=>n.status==="pendente"&&(n.date<a||n.date===a&&n.time&&j(n.time)+15<F())&&n.date>=k(a,-7));return r.length&&o.unshift({date:a,level:"warn",icon:"flag",ids:r.map(n=>n.id),title:`${r.length} tarefa${r.length>1?"s":""} pendente${r.length>1?"s":""} no passado`,text:"Marquem como feito ou reagendem para o cronograma do cliente ficar correto."}),o}function ea(){let e={type:"feed",date:h.date>=_()?h.date:_(),q:""},a=()=>{let r=_(),n=Ra(),m=I(),d=Array.from({length:7},(l,u)=>k(r,u)),i={id:"__probe",type:e.type,date:e.date,assignees:[]};return`
    ${Ct("Assistente")}
    <div class="page page--sheet">
      <div class="assist-hero">
        <span class="assist-hero__ic">${p("sparkle",22)}</span>
        <div><strong>Analisando a agenda de voc\xEAs</strong><p>Funciona sozinho, sem internet. Confere conflitos, tempo livre e os melhores hor\xE1rios sempre que algo muda.</p></div>
      </div>

      ${Qt()}

      <section class="block">
        <h2 class="block__title">${p("today",16)} Hoje</h2>
        <div class="card">${ce(r).map(l=>`<p>${f(l)}</p>`).join("")}</div>
        <h2 class="block__title">${p("calendar",16)} Amanh\xE3</h2>
        <div class="card">${ce(k(r,1)).map(l=>`<p>${f(l)}</p>`).join("")}</div>
      </section>

      <section class="block">
        <h2 class="block__title">${p("alert",16)} Precisa de aten\xE7\xE3o (7 dias)</h2>
        ${n.length?`<div class="tips">${n.map(l=>`
          <div class="tip tip--${l.level}">
            <span class="tip__ic">${p(l.icon,16)}</span>
            <div>
              <small class="tip__date">${f(he(l.date))}</small>
              <strong>${f(l.title)}</strong><p>${f(l.text)}</p>
              ${l.fixes?.length?`<div class="fixes">${l.fixes.map(u=>`<button class="fixbtn" data-action="apply-fix" data-id="${u.eventId}" data-patch="${La(u.patch)}">${p("check",13)} ${f(u.label)}</button>`).join("")}</div>`:""}
              ${l.ids?.length===1?`<button class="btn-text btn-text--sm" data-action="open-event" data-id="${l.ids[0]}">Ver evento</button>`:""}
            </div>
          </div>`).join("")}</div>`:`<div class="tip tip--ok"><span class="tip__ic">${p("check",16)}</span><div><strong>Tudo certo</strong><p>Nenhum conflito nos pr\xF3ximos 7 dias.</p></div></div>`}
      </section>

      <section class="block">
        <h2 class="block__title">${p("clock",16)} Tempo livre no expediente (${x(m.workStart)}\u2013${x(m.workEnd)})</h2>
        <div class="freegrid">
          <span></span>${d.map(l=>`<span class="freegrid__d">${Z[G(l).getDay()]}<b>${G(l).getDate()}</b></span>`).join("")}
          ${s.team.map(l=>`${M(l.id,24)}${d.map(u=>{let $=ee(l.id,u);if($.dayOff)return'<span class="freecell is-off">folga</span>';let y=$.minutes/60;return`<span class="freecell ${y>=4?"is-good":y>=2?"is-mid":"is-low"}">${K(Math.round($.minutes/15)*15)||"0"}</span>`}).join("")}`).join("")}
        </div>
        <p class="fhelp">Verde: dia tranquilo \xB7 amarelo: apertado \xB7 vermelho: sem respiro. Ajuste a rotina em Ajustes.</p>
      </section>

      <section class="block">
        <h2 class="block__title">${p("bulb",16)} Encontrar o melhor hor\xE1rio</h2>
        <div class="card">
          <div class="row2">
            <select class="input" data-f="type">${St.map(l=>`<option value="${l}"${e.type===l?" selected":""}>${A[l].label}</option>`).join("")}</select>
            <input class="input" type="date" data-f="date" value="${e.date}">
          </div>
          ${s.team.map(l=>{let u=Mt({...i},{people:[l.id],limit:4});return`<div class="findrow">${M(l.id,26)}<div class="hintbox__times">${u.length?u.map($=>`<button class="tchip" data-new="${l.id}|${$.time}">${x($.time)}${$.peak?"<small>pico</small>":""}</button>`).join(""):'<span class="muted">Sem hor\xE1rio livre</span>'}</div></div>`}).join("")}
          <p class="fhelp">Toque num hor\xE1rio para j\xE1 criar o evento com a pessoa certa.</p>
        </div>
      </section>

    </div>`},t=jt({className:"sheet--tall",html:a(),onMount:r=>{let n=r.el;n.querySelector('[data-f="type"]').onchange=d=>{e.type=d.target.value,r.set(a())},n.querySelector('[data-f="date"]').onchange=d=>{d.target.value&&(e.date=d.target.value,r.set(a()))},n.querySelectorAll("[data-new]").forEach(d=>d.onclick=async()=>{let[i,l]=d.dataset.new.split("|"),{openEventEditor:u}=await import("./c-XEU75X6K.js");u({date:e.date,type:e.type,time:l,assignees:[i]})}),c(r,async d=>{if(d=(d||"").trim(),!d||te)return;if(!Zt){Xe(d),R.push({role:"user",text:d}),R.push({role:"assistant",text:"Abri sua pergunta no **app do Claude**, com o seu login, j\xE1 com a agenda de voc\xEAs. \xC9 s\xF3 tocar em enviar l\xE1. A agenda tamb\xE9m foi copiada: se a mensagem aparecer vazia, segure no campo e toque em **Colar**."}),Ze(),o(r);return}let i=R.filter(l=>!l.error).map(l=>({role:l.role,text:l.text}));R.push({role:"user",text:d}),te=!0,o(r);try{let l=await s.askAssistant(d,i);R.push({role:"assistant",text:l})}catch(l){R.push({role:"assistant",text:Ia(l),error:!0})}te=!1,Ze(),o(r)})}});function o(r){let n=r.el.querySelector("[data-chat]");if(!n)return;n.outerHTML=Qt(),c(r,r.send);let m=r.el.querySelector(".chat");m&&m.lastElementChild?.scrollIntoView({block:"nearest",behavior:"smooth"})}function c(r,n){r.send=n;let m=r.el;m.querySelectorAll("[data-preset]").forEach(u=>u.onclick=()=>n(Qe[+u.dataset.preset].q));let d=m.querySelector("[data-chatform]"),i=d.q;i.oninput=()=>{i.style.height="auto",i.style.height=Math.min(i.scrollHeight,140)+"px"},i.onkeydown=u=>{u.key==="Enter"&&!u.shiftKey&&(u.preventDefault(),n(i.value))},d.onsubmit=u=>{u.preventDefault(),n(i.value)};let l=m.querySelector("[data-clearchat]");l&&(l.onclick=()=>{R=[],Ze(),o(r)}),m.querySelector("[data-extclaude]").onclick=()=>Xe(i.value.trim()||"Analise a agenda e me diga o que \xE9 mais importante agora.")}t.refresh=()=>{let r=document.activeElement;if(r&&t.el.contains(r)&&/INPUT|TEXTAREA|SELECT/.test(r.tagName))return;let n=t.el.scrollTop;t.set(a()),t.el.scrollTop=n}}var ta="seed-v1",aa=[{id:"c_puravida",name:"Pura Vida",color:"#15803D",logoFile:"pura-vida.jpg"},{id:"c_jggarcia",name:"JG Garcia",color:"#16A34A",logoFile:"jg-garcia.jpg"},{id:"c_garciahortifruti",name:"Garcia Hortifruti",color:"#65A30D",logoFile:"garcia-hortifruti.jpg"},{id:"c_tobiasbbq",name:"Tobia's BBQ",color:"#DC2626",logoFile:"tobias-bbq.jpg"},{id:"c_verdeerosa",name:"Verde e Rosa Multimarcas",color:"#DB2777",logoFile:"verde-e-rosa.jpg"},{id:"c_sophiafestas",name:"Sophia Festas",color:"#0284C7",logoFile:"sophia-festas.jpg"}],Ba=async e=>{let a=await(await fetch(e,{cache:"no-cache"})).blob();return new Promise((t,o)=>{let c=new FileReader;c.onload=()=>t(c.result),c.onerror=o,c.readAsDataURL(a)})},et=!1;async function oa(){if(!(et||!s.ready||s.state.settings.some(e=>e.id===ta))){et=!0;try{let e=aa.filter(t=>!s.company(t.id)&&!s.state.companies.some(o=>o.name.trim().toLowerCase()===t.name.toLowerCase())),a=[];for(let t of e){let o=null;try{o=await Ba(`media/logos/${t.logoFile}`)}catch{}a.push({id:t.id,name:t.name,color:t.color,logo:o,instagram:"",address:"",contact:"",notes:"",shareToken:null})}a.length&&await s.upsertMany("companies",a),await s.upsert("settings",{id:ta,done:aa.map(t=>t.id)})}finally{et=!1}}}var sa="seed-garcia-nov-2026-v2",Ha=["seed-garcia-nov-2026","seed-garcia-nov-2026-ate14h"],na="c_garciahortifruti",Fa=["domingo","segunda","ter\xE7a","quarta","quinta","sexta","s\xE1bado"],Va={"2026-11-09":"Marechal","2026-11-11":"Vila Valqueire","2026-11-13":"Marechal","2026-11-16":"Vila Valqueire","2026-11-18":"Marechal","2026-11-20":"Vila Valqueire","2026-11-23":"Marechal","2026-11-25":"Vila Valqueire","2026-11-27":"Marechal","2026-11-30":"Vila Valqueire"},za=[{date:"2026-11-20",text:"Garcia \xB7 Consci\xEAncia Negra: publica\xE7\xE3o institucional respeitosa e representativa."},{date:"2026-11-23",text:"Garcia \xB7 Black Friday (23 a 27/11): campanha principal de ofertas e chamadas di\xE1rias."},{date:"2026-11-28",text:"Garcia \xB7 Esquenta de Natal e ver\xE3o (28 a 30/11): frutas da esta\xE7\xE3o, receitas, saladas e planejamento das compras."}];function Ua(e="2026-11-19",a="2026-11-30"){let t=[];for(let o=new Date(e+"T12:00:00");o<=new Date(a+"T12:00:00");o.setDate(o.getDate()+1)){let c=`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}-${String(o.getDate()).padStart(2,"0")}`,r=o.getDay(),n={date:c,companyId:na,assignees:["henrique"],status:"pendente",description:"",seedRoutine:2};if([1,3,5].includes(r)){let m=Va[c]||"";t.push({...n,id:`e_garcia2_${c}_ceasa`,type:"outro",time:"07:00",duration:210,reminder:30,title:"CEASA",location:"CEASA",internalNote:"CEASA \u2014 07h \xE0s 10h30. Depois segue para a Garcia Hortifruti.",visibleToClient:!1}),t.push({...n,id:`e_garcia2_${c}_gravacao`,type:"captacao",time:"10:30",duration:210,reminder:60,title:`Grava\xE7\xE3o com o Gelado \u2014 ${m||"Garcia"}`,location:m?`Garcia Hortifruti \u2014 ${m}`:"Garcia Hortifruti",internalNote:"Sa\xEDda do CEASA por volta das 10h30. Personagem: Gelado (filmar para Reels, feed e stories). Ajustar conforme abastecimento, pre\xE7os e necessidades da unidade.",visibleToClient:!0})}else if(r===0)t.push({...n,id:`e_garcia2_${c}_plan`,type:"outro",time:"07:00",duration:420,reminder:30,title:"Planejamento da semana",location:"",internalNote:"Planejamento \u2014 07h \xE0s 14h.",visibleToClient:!1});else{let m=r===6;t.push({...n,id:`e_garcia2_${c}_ceasa`,type:"outro",time:"07:00",duration:m?300:420,reminder:30,title:`Somente CEASA (${Fa[r]})`,location:"CEASA",internalNote:`Somente CEASA \u2014 07h \xE0s ${m?"12h":"14h"}.`,visibleToClient:!1})}}return t}var tt=!1;async function ia(){if(!(tt||!s.ready||s.state.settings.some(e=>e.id===sa))&&s.company(na)){tt=!0;try{let e=s.state.events.filter(o=>o.seedRoutine===!0||/^e_garcia_\d/.test(o.id)).map(o=>o.id);e.length&&await s.removeMany("events",e,{silent:!0});let a=Ua().filter(o=>!s.event(o.id));a.length&&await s.upsertMany("events",a);let t=za.filter(o=>!s.state.notes.some(c=>c.date===o.date&&c.text===o.text)).map(o=>({id:fe("n_"),date:o.date,text:o.text,author:"henrique"}));t.length&&await s.upsertMany("notes",t);for(let o of[sa,...Ha])await s.upsert("settings",{id:o,done:[]})}finally{tt=!1}}}var z={feed:"Feed",carrossel:"Carrossel",reels:"Reels",story:"Story",captacao:"Capta\xE7\xE3o",reuniao:"Reuni\xE3o",producao:"Edi\xE7\xE3o",outro:"Tarefa"},Ga=["feed","carrossel","reels","story"],Te=e=>Ga.includes(e),ra={feed:"publicar o feed",carrossel:"publicar o carrossel",reels:"postar o Reels",story:"postar o story",captacao:"a capta\xE7\xE3o",reuniao:"a reuni\xE3o",producao:"a edi\xE7\xE3o",outro:"a tarefa"},U=e=>e?e.replace(/^0/,"").replace(":00","h").replace(":","h"):"",Ka=e=>{let[a,t]=String(e).split(":").map(Number);return a*60+t},Ae=e=>Math.round(Date.UTC(+e.slice(0,4),+e.slice(5,7)-1,+e.slice(8,10))/864e5),je=(e,a)=>new Date(Date.UTC(+e.slice(0,4),+e.slice(5,7)-1,+e.slice(8,10)+a)).toISOString().slice(0,10);function at(e){let a=Number.isFinite(e.reminder)?e.reminder:30,t;return Te(e.type)?t=[60,30,0,-30]:e.type==="captacao"?t=[1440,60,30,-30]:e.type==="reuniao"?t=[1440,60,15]:t=[60,30,0],a>=0&&!t.includes(a)&&t.push(a),a<0&&(t=t.filter(o=>o<0)),[...new Set(t)].sort((o,c)=>c-o)}function la(e,a,t=4){let o=Ae(a.date)*1440+a.minutes,c=[];return e.forEach(r=>{if(!r||!r.time||!r.date||r.status==="feito")return;let n=Ae(r.date)*1440+Ka(r.time);at(r).forEach(m=>{if(m<0&&r.status!=="pendente")return;let d=n-m;d<=o&&d>o-t&&c.push({ev:r,offset:m})})}),c}var Ya=(e,a)=>{let t=Ae(e)-Ae(a.date);return t===0?"hoje":t===1?"amanh\xE3":t===-1?"ontem":`${["domingo","segunda","ter\xE7a","quarta","quinta","sexta","s\xE1bado"][new Date(Date.UTC(+e.slice(0,4),+e.slice(5,7)-1,+e.slice(8,10))).getUTCDay()]}, ${e.slice(8,10)}/${e.slice(5,7)}`},Wa=e=>{if(e>=60){let a=Math.floor(e/60),t=e%60;return t?`${a}h${String(t).padStart(2,"0")}`:`${a}h`}return`${e} min`};function Ce(e,a,t=""){let o=`${z[e.type]||"Tarefa"}${t?" \xB7 "+t:""}`,c=e.title?`\u201C${e.title}\u201D`:"",r=U(e.time),n=e.location?` \xB7 ${e.location}`:"";return a>=1440?{title:`Amanh\xE3: ${o} \xE0s ${r}`,body:e.type==="captacao"?`Hoje: carregue baterias, esvazie os cart\xF5es e confirme com o cliente.${n}`:`${c}${n}`.trim()||"Confirme o hor\xE1rio com o cliente."}:a>0?{title:`Daqui a ${Wa(a)}: ${o}`,body:`${r} \u2014 ${ra[e.type]||"a tarefa"}${c?" "+c:""}${n}`}:a===0?{title:`Agora: ${o}`,body:`Est\xE1 na hora de ${ra[e.type]||"fazer a tarefa"}${c?" "+c:""}.`}:{title:Te(e.type)?`J\xE1 postou? ${o}`:`J\xE1 fez? ${o}`,body:`Era \xE0s ${r}${c?" \u2014 "+c:""}. Toque para marcar como feito.`}}function De(e,a,{actor:t="Algu\xE9m",company:o="",recipient:c=null,now:r}={}){let m=`${z[(a||e).type]||"Tarefa"}${o?" \xB7 "+o:""}`,d=$=>`${Ya($.date,r)}${$.time?", "+U($.time):""}`,i=$=>c&&($.assignees||[]).includes(c);if(!e&&a)return{title:i(a)?`${t} marcou para voc\xEA`:`${t} adicionou na agenda`,body:`${m} \u2014 ${d(a)}${a.title?" \xB7 "+a.title:""}`};if(e&&!a)return{title:`${t} removeu da agenda`,body:`${m} \u2014 ${d(e)}`};if(e.status!=="feito"&&a.status==="feito")return{title:`${t} concluiu \u2713`,body:`${m} \u2014 ${d(a)}`};let l=i(e),u=i(a);return!l&&u?{title:`${t} passou para voc\xEA`,body:`${m} \u2014 ${d(a)}${a.title?" \xB7 "+a.title:""}`}:l&&!u?{title:`${t} assumiu uma tarefa sua`,body:`${m} \u2014 ${d(a)}`}:e.date!==a.date||e.time!==a.time?{title:`${t} mudou o hor\xE1rio`,body:`${m}: ${d(e)} \u2192 ${d(a)}`}:null}function ca(e,a,t,o){if(!t.length)return null;let c=[...t].sort((l,u)=>(l.time||"99").localeCompare(u.time||"99")),r=c.find(l=>l.time)||c[0],n=c.filter(l=>Te(l.type)).length,m=c.filter(l=>l.type==="captacao"||l.type==="reuniao"),d=l=>`${U(l.time)} ${z[l.type]}${o(l)?" \xB7 "+o(l):""}`,i=[`${c.length} tarefa${c.length>1?"s":""} (${n} post${n===1?"":"s"})`,`primeira: ${d(r)}`];return m.length&&i.push(`sai para ${m.map(l=>`${o(l)||z[l.type]} \xE0s ${U(l.time)}`).join(" e ")}`),e==="morning"?{title:`Bom dia, ${a}! Seu dia hoje`,body:i.join(" \xB7 ")}:{title:`${a}, amanh\xE3 voc\xEA tem ${c.length} tarefa${c.length>1?"s":""}`,body:i.slice(1).join(" \xB7 ")}}var Q=e=>s.member(e)?.name||"Algu\xE9m",N=e=>s.company(e)?.name||"",ot=()=>{let e=new Date;return{date:_(),minutes:e.getHours()*60+e.getMinutes()}},da=(e,a)=>Date.parse(`${e}T${a}:00-03:00`),it=()=>s.mode==="cloud"&&!!ye()&&!!s.me,st=null,pa=e=>st=e;function nt(e,a,t,o="./",c=!1){return!a||!e.length?Promise.resolve(null):de("/notify",{to:e,title:a.title,body:a.body,tag:t,url:o,includeSelf:c}).catch(r=>(console.warn("aviso",r.message),{error:r.message}))}var Me=e=>{let a=_();return`${e.date===a?"hoje":e.date===k(a,1)?"amanh\xE3":`${e.date.slice(8,10)}/${e.date.slice(5,7)}`}${e.time?", "+e.time.replace(":00","h").replace(":","h").replace(/^0/,""):""}`};function ua(e,a){if(!it())return;let t=a||e,o=`${z[t.type]||"Tarefa"}${N(t.companyId)?" \xB7 "+N(t.companyId):""}`,c=(t.assignees||[]).map(Q).join(" e ")||"sem respons\xE1vel",r=i=>({title:`${i} alterou: ${o}`,body:`${Me(t)}${t.title?" \xB7 "+t.title:""} \xB7 ${c}`}),m=s.team.map(i=>i.id).filter(i=>i!==s.me).map(i=>{let l=De(e,a,{actor:Q(s.me),company:N(t.companyId),recipient:i,now:ot()})||r(Q(s.me));return nt([i],l,`ev-${t.id}`,`./#/e/${t.id}`).then(u=>({r:i,d:u}))}),d;!e&&a?d={title:`Novo na agenda: ${o}`,body:`${Me(a)}${a.title?" \xB7 "+a.title:""} \xB7 ${c}`}:e&&a&&(e.date!==a.date||e.time!==a.time)?d={title:`Hor\xE1rio alterado: ${o}`,body:`${Me(e)} \u2192 ${Me(a)} \xB7 ${c}`}:d=De(e,a,{actor:"Voc\xEA",company:N(t.companyId),recipient:null,now:ot()})||r("Voc\xEA"),nt([s.me],d,`ev-${t.id}`,a?`./#/e/${t.id}`:"./",!0),m.length&&st&&Promise.all(m).then(i=>{let l=i.filter(y=>y.d&&!y.d.error&&y.d.results&&!y.d.results[y.r]).map(y=>Q(y.r)),u=i.find(y=>y.d&&y.d.error),$=i.filter(y=>y.d&&y.d.results&&y.d.results[y.r]).map(y=>Q(y.r));st({ok:$,missing:l,error:u?.d.error})}),ae()}function ha(e){if(!it())return;let a=s.team.map(c=>c.id).filter(c=>c!==s.me),t=Q(s.me),o=null;if(e.kind==="deleted"&&e.events?.length){let c=e.events[0];o=e.events.length===1?De(c,null,{actor:t,company:N(c.companyId),now:ot()}):{title:`${t} removeu ${e.events.length} itens da agenda`,body:`${N(c.companyId)?N(c.companyId)+" \xB7 ":""}a partir de ${c.date.slice(8,10)}/${c.date.slice(5,7)}`}}else e.kind==="series"?o={title:`${t} adicionou ${e.count} itens repetidos`,body:`${e.label||""}${N(e.sample?.companyId)?" \xB7 "+N(e.sample.companyId):""}`}:e.kind==="series-edit"?o={title:`${t} alterou ${e.count} itens repetidos`,body:`${e.label||""}${N(e.sample?.companyId)?" \xB7 "+N(e.sample.companyId):""}`}:e.kind==="import"&&(o={title:`${t} importou a agenda`,body:`${e.count||0} itens atualizados.`});nt(s.team.map(c=>c.id),o,`act-${e.id||Date.now()}`,"./",!0),ae()}function Ja(e=Date.now()){let a=[],t=k(_(),-1),o=k(_(),4),c=s.eventsBetween(t,o).filter(n=>n.time&&n.status!=="feito"),r=(n,m)=>s.eventsOn(m,{person:n}).filter(d=>d.status!=="feito").length;c.forEach(n=>{let m=da(n.date,n.time);at(n).forEach(d=>{if(d<0&&n.status!=="pendente")return;let i=m-d*6e4;if(i<e-10*6e4||i>e+4*864e5)return;let l=Ce(n,d,N(n.companyId)),u=(n.assignees||[]).map(Q).join(" e ");s.team.map($=>$.id).forEach($=>a.push({id:`r_${n.id}_${d}_${n.date}${n.time.replace(":","")}_${$}`,at:i,member:$,title:l.title,body:u&&!(n.assignees.length===1&&n.assignees[0]===$)?`${l.body} \xB7 ${u}`:l.body,tag:`rem-${n.id}`,url:`./#/e/${n.id}`,kind:"reminders",badge:r($,n.date)}))})});for(let n=0;n<4;n++){let m=k(_(),n);s.team.forEach(d=>{[["morning",m,"08:00"],["evening",k(m,1),"20:00"]].forEach(([i,l,u])=>{let $=da(m,u);if($<e-10*6e4)return;let y=s.eventsOn(l,{person:d.id}).filter(b=>b.status!=="feito"),D=ca(i,d.name,y,b=>N(b.companyId));D&&a.push({id:`d_${i}_${l}_${d.id}`,at:$,member:d.id,title:D.title,body:D.body,tag:`daily-${i}`,url:"./",kind:"daily",badge:r(d.id,l)})})})}return a.sort((n,m)=>n.at-m.at)}var ma="",ae=_t(async()=>{if(!it())return;let e=Ja(),a=JSON.stringify(e.map(t=>[t.id,t.at,t.title,t.body]));if(a!==ma)try{await de("/schedule",{items:e}),ma=a}catch(t){console.warn("lista de lembretes",t.message)}},3e3);var ba=["domingo","segunda","ter\xE7a","quarta","quinta","sexta","s\xE1bado"],fa=e=>ba[new Date(Date.UTC(+e.slice(0,4),+e.slice(5,7)-1,+e.slice(8,10))).getUTCDay()];function ga({events:e,companies:a,routine:t,notes:o,team:c,me:r,now:n}){let m=new Map(a.map(b=>[b.id,b.name])),d=b=>c.find(P=>P.id===b)?.name||b,i=je(n.date,-7),l=je(n.date,30),u=e.filter(b=>b.date>=i&&b.date<=l).sort((b,P)=>(b.date+(b.time||"")).localeCompare(P.date+(P.time||""))),$=[];$.push(`Agora: ${fa(n.date)}, ${n.date.split("-").reverse().join("/")}, ${U(`${String(Math.floor(n.minutes/60)).padStart(2,"0")}:${String(n.minutes%60).padStart(2,"0")}`)} (hor\xE1rio de Bras\xEDlia).`),$.push(`Quem pergunta: ${d(r)}. Equipe: ${c.map(b=>b.name).join(" e ")}.`),t&&$.push(`Rotina combinada: expediente ${t.workStart}\u2013${t.workEnd}, almo\xE7o ${t.lunchStart}\u2013${t.lunchEnd}, folga: ${(t.daysOff||[]).map(b=>ba[b]).join(", ")||"nenhuma"}, deslocamento m\xEDnimo ${t.travelMin} min, m\xE1ximo ${t.maxTasks} tarefas por pessoa/dia.`),$.push(`Empresas clientes: ${a.map(b=>b.name+(b.instagram?` (@${b.instagram})`:"")+(b.address?` \u2014 endere\xE7o: ${b.address}`:"")+(b.notes?` \u2014 observa\xE7\xF5es: ${b.notes}`:"")).join("; ")||"nenhuma"}.`),$.push("",`Agenda (de ${i.split("-").reverse().join("/")} a ${l.split("-").reverse().join("/")}):`);let y="";u.forEach(b=>{b.date!==y&&($.push(`
${fa(b.date)} ${b.date.split("-").reverse().join("/")}:`),y=b.date);let P=(b.assignees||[]).map(d).join(" e ")||"sem respons\xE1vel",w="sem hor\xE1rio";if(b.time&&(w=U(b.time),b.duration)){let[V,oe]=b.time.split(":").map(Number),g=V*60+oe+b.duration;w+=` \xE0s ${U(`${String(Math.floor(g/60)%24).padStart(2,"0")}:${String(g%60).padStart(2,"0")}`)}`}let L=[b.location&&`local ${b.location}`,b.description&&`legenda: ${b.description.slice(0,140)}`,b.internalNote&&`obs: ${b.internalNote.slice(0,140)}`].filter(Boolean).join("; ");$.push(`- ${w} \u2014 ${z[b.type]||b.type}: ${b.title||"sem t\xEDtulo"} \u2014 empresa ${m.get(b.companyId)||"?"} \u2014 respons\xE1vel ${P}${b.status==="feito"?" (j\xE1 feito)":""}${L?" \u2014 "+L:""}`)}),u.length||$.push("(nenhum compromisso)");let D=(o||[]).filter(b=>b.date>=je(n.date,-2)).slice(-10);return D.length&&$.push("","Bilhetes recentes da dupla:",...D.map(b=>`- ${b.date.split("-").reverse().join("/")} ${d(b.author)}: ${b.text}`)),$.join(`
`)}var O=document.getElementById("app");window.__calStarted=!0;var X=null;function Qa(){O.innerHTML=`
    <main id="view" class="view"></main>
    <nav class="tabbar" aria-label="Navega\xE7\xE3o">
      ${qe("hoje","today","Hoje")}
      ${qe("mes","calendar","Calend\xE1rio")}
      <button class="tabbar__fab" data-action="new-event" aria-label="Novo evento">${p("plus",28)}</button>
      ${qe("empresas","building","Empresas")}
      ${qe("ajustes","settings","Ajustes")}
    </nav>`}var qe=(e,a,t)=>`<button class="tabbar__btn" data-action="tab" data-tab="${e}">${p(a,24)}<span>${t}</span></button>`;function C(){let e=document.getElementById("view");if(!e)return;let a=window.scrollY,t=e.querySelector('[data-form="note"] input'),o=t?t.value:"",c=t&&document.activeElement===t,r=h.tab==="mes"?Ut():h.tab==="empresas"?Ot():h.tab==="ajustes"?Wt():zt();e.innerHTML=r,document.querySelectorAll(".tabbar__btn").forEach(m=>m.classList.toggle("is-on",m.dataset.tab===h.tab)),window.scrollTo(0,a);let n=e.querySelector('[data-form="note"] input');n&&o&&(n.value=o),n&&c&&n.focus({preventScroll:!0}),eo()}function Xa(){C(),Ve().forEach(e=>e.refresh&&e.refresh())}function me(e){h.tab=e,Re(),C(),window.scrollTo(0,0)}var Za={tab:e=>me(e.dataset.tab),"set-person":e=>{h.person=e.dataset.p,Re(),C()},"set-date":e=>{h.date=e.dataset.k,C()},"go-today":()=>{h.date=_(),C()},week:e=>{h.date=k(h.date,Number(e.dataset.n)),C()},month:e=>{h.month=Pe(h.month,Number(e.dataset.n)),h.monthSel=h.month===ne(_())?_():`${h.month}-01`,C()},"month-today":()=>{h.month=ne(_()),h.monthSel=_(),C()},"month-select":e=>{h.monthSel=e.dataset.k,ne(e.dataset.k)!==h.month&&(h.month=ne(e.dataset.k)),C()},"month-company":e=>{h.monthCompany=e.dataset.id||null,C()},"open-day":e=>{h.date=e.dataset.k,me("hoje")},"toggle-tips":()=>{h.showAllTips=!h.showAllTips,C()},"open-event":e=>$e(e.dataset.id),assistant:()=>ea(),"apply-fix":async e=>{let a=s.event(e.dataset.id);if(!a)return;let t;try{t=JSON.parse(e.dataset.patch)}catch{return}let o={};typeof t.time=="string"&&/^\d{2}:\d{2}$/.test(t.time)&&(o.time=t.time),Array.isArray(t.assignees)&&(o.assignees=t.assignees.filter(n=>s.member(n)));let{confirmMove:c}=await import("./c-XEU75X6K.js");if(!await c(a,o))return;let r={...a};await s.upsert("events",{...a,...o}),v("Pronto, ajustado",{action:"Desfazer",onAction:()=>s.upsert("events",r)})},"toggle-done":async e=>{let a=s.event(e.dataset.id);if(!a)return;let t=a.status==="feito"?"pendente":"feito";await s.upsert("events",{...a,status:t}),t==="feito"&&v(`${A[a.type].label} conclu\xEDdo`,{action:"Desfazer",onAction:()=>s.upsert("events",{...s.event(a.id),status:a.status})})},"new-event":e=>{if(!s.state.companies.length)return v("Cadastre uma empresa primeiro"),Ge(null,()=>ze({}));ze({date:e.dataset.date||null})},"open-company":e=>Pt(e.dataset.id),"new-company":()=>Ge(),"del-note":async e=>{let a=s.state.notes.find(t=>t.id===e.dataset.id);await s.remove("notes",e.dataset.id),a&&v("Bilhete apagado",{action:"Desfazer",onAction:()=>s.upsert("notes",a)})},"set-me":e=>{s.setMe(e.dataset.p),v(`Ol\xE1, ${s.member(e.dataset.p).name}!`)},"clear-demo":async()=>{await le({title:"Apagar os dados de exemplo?",text:"O calend\xE1rio ficar\xE1 vazio para voc\xEAs cadastrarem as empresas e eventos reais.",ok:"Apagar exemplos",danger:!0})&&(await s.clearDemo(),v("Pronto! Agora cadastre suas empresas."))},"clear-all":()=>H.clearAll(),ics:e=>H.ics(e),"notify-enable":()=>H.notifyEnable(),"notify-test":()=>H.notifyTest(),"onboarding-again":()=>H.onboardingAgain(),export:()=>H.export(),logout:async()=>{await le({title:"Sair da conta?",ok:"Sair"})&&(await X.signOut(),location.reload())}};document.addEventListener("click",e=>{let a=e.target.closest("[data-action]");if(!a||document.body.classList.contains("is-client"))return;let t=Za[a.dataset.action];t&&(e.preventDefault(),e.stopPropagation(),t(a))});document.addEventListener("change",e=>{e.target.matches('[data-action-change="import"]')&&H.import(e.target),e.target.closest("[data-notify-form]")&&H.notifyPrefs(e.target.closest("[data-notify-form]")),e.target.closest("[data-routine-form]")&&H.routine(e.target.closest("[data-routine-form]"))});document.addEventListener("submit",async e=>{let a=e.target.closest('[data-form="note"]');if(!a)return;e.preventDefault();let t=a.text.value.trim();if(t){if(!s.me){v("Escolha quem voc\xEA \xE9 em Ajustes");return}await s.upsert("notes",{id:fe("n_"),date:h.date,text:t,author:s.me}),v("Bilhete adicionado")}});function eo(){document.querySelectorAll("[data-swipe]").forEach(e=>{let a=null,t=null;e.addEventListener("touchstart",o=>{a=o.touches[0].clientX,t=o.touches[0].clientY},{passive:!0}),e.addEventListener("touchend",o=>{if(a==null)return;let c=o.changedTouches[0].clientX-a,r=o.changedTouches[0].clientY-t;if(a=null,Math.abs(c)<50||Math.abs(c)<Math.abs(r)*1.5)return;let n=c<0?1:-1;e.dataset.swipe==="week"?h.date=k(h.date,7*n):(h.month=Pe(h.month,n),h.monthSel=`${h.month}-01`),C()})})}var $a=new Set;function va(){if(!s.me)return;let e=new Date,a={date:_(),minutes:e.getHours()*60+e.getMinutes()},t=s.eventsBetween(k(a.date,-1),k(a.date,1),{person:s.me}),o=s.mode==="cloud"&&!!localStorage.getItem("pauta.device");la(t,a,2).forEach(({ev:c,offset:r})=>{let n=`${c.id}@${r}@${c.date}${c.time}`;if($a.has(n))return;$a.add(n);let m=Ce(c,r,s.company(c.companyId)?.name||"");v(`${m.title}`,{ms:7e3,action:"Ver",onAction:()=>$e(c.id)}),!o&&W()==="granted"&&navigator.serviceWorker&&navigator.serviceWorker.ready.then(d=>d.showNotification(m.title,{body:m.body,tag:`rem-${c.id}`,icon:"icons/icon-192.png",badge:"icons/icon-192.png",data:{url:`./#/e/${c.id}`}})).catch(()=>{})}),Ke(s.eventsOn(a.date,{person:s.me}).filter(c=>c.status!=="feito").length)}function Oe(e=location.hash,a=0){let t=/^#\/(e|d)\/([\w-]+)/.exec(e||"");return t?(window.PautaIntro&&window.PautaIntro.finish(),t[1]==="e"&&!s.event(t[2])&&a<20?(setTimeout(()=>Oe(e,a+1),500),!0):(history.replaceState(null,"",location.pathname+location.search),t[1]==="e"&&s.event(t[2])?(document.querySelectorAll(".sheet-wrap.is-open [data-close]").forEach(o=>o.closest(".sheet-wrap")&&o.click()),h.date=s.event(t[2]).date,me("hoje"),$e(t[2])):t[1]==="d"&&/^\d{4}-\d{2}-\d{2}$/.test(t[2])?(h.date=t[2],me("hoje")):t[1]==="e"&&v("Esse compromisso n\xE3o existe mais (foi removido)."),!0)):!1}var ya={"auth/invalid-credential":"E-mail ou senha incorretos. Confira a senha (toque no olho para ver o que digitou).","auth/wrong-password":"Senha incorreta.","auth/user-not-found":"Este e-mail n\xE3o est\xE1 cadastrado no Firebase (Authentication \u2192 Usu\xE1rios).","auth/invalid-email":"E-mail inv\xE1lido.","auth/too-many-requests":'Muitas tentativas seguidas. Espere alguns minutos ou use "Esqueci minha senha".',"auth/network-request-failed":"Sem conex\xE3o com a internet. Verifique o Wi-Fi/4G e tente de novo.","auth/user-disabled":"Este usu\xE1rio foi desativado no Firebase.","auth/operation-not-allowed":"O login por e-mail/senha n\xE3o est\xE1 ativado no Firebase.","auth/api-key-not-valid":"Configura\xE7\xE3o do Firebase inv\xE1lida (apiKey)."},wa="",ct="";function Ne(e=""){let a=e||ct;O.innerHTML=`
  <div class="login">
    <img src="icons/icon-192.png" alt="" width="84" height="84">
    <h1>${f(T.appName)}</h1>
    <p>Agenda de conte\xFAdo \xB7 ${f(T.agencyName)}</p>
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
  </div>`;let t=O.querySelector("[data-login]");O.querySelector("[data-eye]").onclick=()=>{t.pass.type=t.pass.type==="password"?"text":"password"},t.onsubmit=async o=>{o.preventDefault();let c=t.email.value.trim().toLowerCase(),r=t.pass.value;if(wa=c,ct="",!c||!r)return Ne("Preencha o e-mail e a senha.");let n=t.querySelector("[data-go]");n.disabled=!0,n.textContent="Entrando\u2026";try{await Promise.race([X.signIn(c,r),new Promise((m,d)=>setTimeout(()=>d({code:"timeout"}),2e4))]),n.textContent="Abrindo\u2026"}catch(m){let d=m&&m.code;Ne(d==="timeout"?"O servidor demorou para responder. Verifique a internet e tente de novo.":ya[d]||`N\xE3o foi poss\xEDvel entrar (${d||m?.message||"erro desconhecido"}).`)}},O.querySelector("[data-reset]").onclick=async()=>{let o=t.email.value.trim().toLowerCase();if(!o)return v("Digite seu e-mail primeiro");try{await X.resetPassword(o),v("Enviamos um e-mail para criar uma nova senha (veja tamb\xE9m o spam)",{ms:6e3})}catch(c){v(ya[c?.code]||"N\xE3o foi poss\xEDvel enviar o e-mail")}}}function _a(e){document.querySelector("[data-login]")||document.getElementById("view")||(O.innerHTML=`<div class="splash">
    <img src="icons/icon-192.png" alt="" width="72" height="72">
    <h2>N\xE3o consegui conectar</h2>
    <p>Verifique a internet e tente de novo.</p>
    <button class="btn btn--primary" data-retry>Tentar de novo</button>
    <small class="muted">Detalhe: ${f(String(e&&(e.code||e.message)||e))}</small>
  </div>`,O.querySelector("[data-retry]").onclick=()=>location.reload())}function rt(e="Carregando\u2026"){O.innerHTML=`<div class="splash"><img src="icons/icon-192.png" alt="" width="72" height="72"><p>${f(e)}</p></div>`}function ka(){Qa(),C(),s.on(Xa),s.onError=e=>{let a=e&&/quota/i.test(String(e.name||e.message)),t=e&&/permission/i.test(String(e.code||e.message));v(a?"Mem\xF3ria do aparelho cheia: use logos menores ou ative a nuvem":t?"Sem permiss\xE3o na nuvem: confira as regras do Firebase":"N\xE3o foi poss\xEDvel salvar. Verifique a conex\xE3o.",{ms:5e3})},Sa(),s.on(Sa),s.on(()=>Ke(s.me?s.eventsOn(_(),{person:s.me}).filter(e=>e.status!=="feito").length:0)),setInterval(()=>{let e=document.activeElement,a=e&&/INPUT|TEXTAREA|SELECT/.test(e.tagName);h.tab==="hoje"&&!Ve().length&&!a&&C(),va()},6e4),va(),document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&(h.date<_()&&h.tab==="hoje"&&(h.date=_()),C())}),s.mode==="cloud"&&ye()&&(s.hooks.eventChange=ua,pa(({ok:e,missing:a,error:t})=>{if(t)return v(`Aviso n\xE3o enviado: ${t}`,{ms:6e3});if(a.length)return v(`${a.join(" e ")} ainda n\xE3o ativou as notifica\xE7\xF5es no celular (Ajustes \u2192 Notifica\xE7\xF5es \u2192 Ativar)`,{ms:8e3});e.length&&v(`Aviso enviado para ${e.join(" e ")} \u2713`,{ms:3500})}),s.hooks.activity=ha,s.hooks.ask=async(e,a)=>{let t=new Date,o=ga({events:s.state.events,companies:s.state.companies,routine:I(),notes:s.state.notes,team:s.team,me:s.me,now:{date:_(),minutes:t.getHours()*60+t.getMinutes()}});return(await de("/ask",{question:e,history:a,context:o})).answer},s.on(ae),ae(),setInterval(ae,15*6e4)),oa().then(()=>setTimeout(()=>ia().catch(e=>console.warn("rotina",e)),1500)).catch(e=>console.warn("pr\xE9-cadastro",e)),setTimeout(Kt,600),s.mode==="cloud"&&W()==="granted"&&Lt().catch(()=>{}),setTimeout(()=>Oe(),300)}var lt=null;function Sa(){if(!s.me)return;let e=Ht(s.me,14),a=o=>o.date+":"+o.ids.slice().sort().join("|"),t=new Set(e.map(a));if(lt){let o=e.find(c=>!lt.has(a(c))&&c.ids.some(r=>s.event(r)?.updatedBy&&s.event(r).updatedBy!==s.me));o&&v(`Aten\xE7\xE3o: ${o.title} (${o.date.slice(8)}/${o.date.slice(5,7)})`,{action:"Ver",onAction:()=>{h.date=o.date,h.person="all",me("hoje")},ms:7e3})}lt=t}async function to(){let e=location.hash||"",a=T.firebase;if(e.startsWith("#/c/")||e.startsWith("#/v/")){rt("Carregando cronograma\u2026");let r=!!(localStorage.getItem("pauta.me")||localStorage.getItem("cal.team"));try{if(e.startsWith("#/v/")){let d=await kt(e.slice(4));return Ue(O,Le(d),{canGoBack:r})}if(!a)return ve(O,"Este link precisa da sincroniza\xE7\xE3o na nuvem ativada.");let{fetchPublic:n}=await import("./c-43VYY7Q5.js"),m=await n(a,e.slice(4));return m?Ue(O,Le(m),{canGoBack:r}):ve(O,"Este link n\xE3o existe mais. Pe\xE7a um novo link para a equipe.")}catch(n){return console.error(n),ve(O,"N\xE3o foi poss\xEDvel abrir o cronograma. Verifique a conex\xE3o e tente novamente.")}}if(!a)return await Et(),ka();rt("Conectando \xE0 nuvem\u2026");let t=(r,n)=>Promise.race([r,new Promise((m,d)=>setTimeout(()=>d(new Error("tempo esgotado")),n))]);try{let{connect:r}=await import("./c-43VYY7Q5.js");X=await t(r(a),15e3)}catch(r){return console.error(r),_a(r)}let o=!1,c=!1;setTimeout(()=>{o||_a(new Error("o login n\xE3o respondeu"))},25e3),X.onUser(async r=>{if(o=!0,!r)return c?location.reload():Ne();if(c)return;if(!T.team.some(m=>m.email&&m.email.toLowerCase()===(r.email||"").toLowerCase()))return ct=`O e-mail ${r.email} n\xE3o faz parte da equipe deste app.`,await X.signOut(),Ne();c=!0;try{localStorage.setItem("cal.team","1")}catch{}rt("Entrando\u2026");try{await Promise.race([At(X.backend,r),new Promise(m=>setTimeout(m,12e3))])}catch(m){console.error(m),setTimeout(()=>v("N\xE3o consegui carregar os dados agora. Verifique a internet.",{ms:6e3}),800)}ka()})}navigator.serviceWorker?.addEventListener("message",e=>{if(e.data?.type==="open"&&e.data.url){let a=e.data.url.split("#")[1];a&&Oe("#"+a)}});window.addEventListener("hashchange",()=>{if(/^#\/(e|d)\//.test(location.hash))return Oe();/^#\/(c|v)\//.test(location.hash)&&location.reload()});"serviceWorker"in navigator&&location.protocol!=="file:"&&navigator.serviceWorker.register("sw.js").catch(()=>{});to();
