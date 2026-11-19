import{A as Ge,a as f,b as Re,c as M,d as jt,e as He,f as Be,g as Fe,h as Ct,i as Ve,j as Dt,k as v,l as re,m as Mt,n as P,o as G,p as q,q as qt,r as Z,s as Nt,t as le,u as Ot,v as ge,w as ze,y as Pt,z as It}from"./c-UPIIPZD5.js";import{a as Ue,b as $e}from"./c-XE2XNWEC.js";import{a as p}from"./c-SMTRSMWP.js";import{a as ve,d as K,e as ye,f as Lt,g as ce,i as we,j as Rt,k as Ht,l as _e,n as Ke}from"./c-7GHJ6BCK.js";import{c as St,f as s,g as At,h as Tt}from"./c-QLDEEBWZ.js";import{f as Le}from"./c-4OPZHBQG.js";import{A as h,C as _t,E as kt,G as fe,a as pt,b as z,c as _,d as k,e as ut,f as se,g as Pe,h as ht,i as j,j as me,k as F,l as x,m as ft,n as X,o as bt,p as pe,q as ne,r as gt,s as $t,t as vt,u as ue,v as U,w as yt,x as wt,y as he}from"./c-UWUJNFLO.js";import{a as A,b as xt,c as ie,d as be,l as Ie,m as Et}from"./c-3GA6RSWB.js";import{a as T}from"./c-W6W2IM5K.js";import"./c-VHNSBD2M.js";var Ea=(e,t)=>e&&t&&e[0]<t[1]&&t[0]<e[1],Y=e=>s.member(e)?.name||e,ke=e=>["shoot","meeting"].includes(A[e.type]?.kind);function Se(e,t){let a=[],o=P(),c=s.eventsOn(t,{person:e}).filter(n=>n.time&&n.status!=="feito");for(let n=0;n<c.length;n++)for(let m=n+1;m<c.length;m++){let d=c[n],i=c[m];if(!Ea(G(d),G(i)))continue;let l=ke(d)?d:ke(i)?i:null,u=l===d?i:d,g,y;l&&ie(u.type)?(g=`${Y(e)}: post durante ${A[l.type].label.toLowerCase()}`,y=`\u201C${q(u)}\u201D \xE0s ${x(u.time)} cai no meio de \u201C${q(l)}\u201D (${x(l.time)}\u2013${x(me(G(l)[1]))}).`):l&&ke(u)?(g=`${Y(e)} em dois lugares ao mesmo tempo`,y=`\u201C${q(d)}\u201D (${x(d.time)}) e \u201C${q(i)}\u201D (${x(i.time)}) se sobrep\xF5em.`):(g=`${Y(e)}: duas tarefas no mesmo hor\xE1rio`,y=`\u201C${q(d)}\u201D (${x(d.time)}) e \u201C${q(i)}\u201D (${x(i.time)}).`),a.push({level:"warn",kind:"conflict",icon:"alert",ids:[d.id,i.id],title:g,text:y,fixes:Nt(e,d,i)})}let r=c.filter(ke);for(let n=0;n<r.length-1;n++){let m=r[n],d=r[n+1],i=j(d.time)-G(m)[1];(m.location||m.companyId)!==(d.location||d.companyId)&&i>=0&&i<o.travelMin&&a.push({level:"warn",kind:"conflict",icon:"route",ids:[m.id,d.id],title:`${Y(e)}: pouco tempo de deslocamento`,text:`S\xF3 ${i} min entre \u201C${q(m)}\u201D e \u201C${q(d)}\u201D, em lugares diferentes (combinado: ${o.travelMin} min).`,fixes:[{label:`Mover para ${x(me(G(m)[1]+o.travelMin))}`,eventId:d.id,patch:{time:me(Math.ceil((G(m)[1]+o.travelMin)/15)*15)}}]})}return a}function Bt(e,t="all"){let a=[],o=t==="all"?s.team.map(i=>i.id):[t];o.forEach(i=>a.push(...Se(i,e)));let c=P(),r=s.eventsOn(e,{person:t}),n={};if(r.filter(i=>i.time&&["feed","reels","carrossel"].includes(i.type)).forEach(i=>(n[i.companyId]||=[]).push(i)),Object.values(n).forEach(i=>{for(let l=0;l<i.length-1;l++){let u=j(i[l+1].time)-j(i[l].time);u<180&&a.push({level:"info",icon:"clock",ids:[i[l].id,i[l+1].id],title:`${s.company(i[l].companyId)?.name||"Empresa"}: posts muito pr\xF3ximos`,text:`Dois posts de feed/Reels com s\xF3 ${U(u)} de diferen\xE7a. Espacem ao menos 3 h para um n\xE3o \u201Croubar\u201D o alcance do outro.`})}}),e===_()){let i=r.filter(l=>l.time&&l.status==="pendente"&&j(l.time)+15<F());i.length&&a.unshift({level:"warn",kind:"late",icon:"flag",ids:i.map(l=>l.id),title:i.length===1?"1 tarefa atrasada":`${i.length} tarefas atrasadas`,text:i.map(l=>`${x(l.time)} ${q(l)}`).join(" \xB7 ")+". Marque como feito ou reagende."})}let m=r.filter(i=>!(i.assignees||[]).length);if(m.length&&t==="all"&&a.push({level:"warn",icon:"user",ids:m.map(i=>i.id),title:"Tarefa sem respons\xE1vel",text:m.map(i=>`${x(i.time)} ${q(i)}`).join(" \xB7 ")+". Definam quem vai fazer."}),t==="all"&&s.team.length===2){let[i,l]=s.team,u=s.eventsOn(e,{person:i.id}).length,g=s.eventsOn(e,{person:l.id}).length;if(Math.abs(u-g)>=4){let[y,D]=u>g?[i,l]:[l,i];a.push({level:"info",icon:"users",title:"Dia desequilibrado",text:`${y.name} tem ${Math.max(u,g)} tarefas e ${D.name} tem ${Math.min(u,g)}. Que tal passar alguns stories para o ${D.name}?`})}}o.forEach(i=>{let l=Z(i,e),u=s.eventsOn(e,{person:i}).length;!l.dayOff&&l.minutes!=null&&u&&l.longest<45&&a.push({level:"info",kind:"rest",icon:"clock",title:`${Y(i)} est\xE1 sem pausa`,text:`O maior intervalo livre do dia \xE9 de ${U(l.longest)}. Programem posts com anteced\xEAncia para abrir espa\xE7o.`}),l.dayOff&&u&&a.push({level:"info",kind:"rest",icon:"clock",title:`${Y(i)}: dia de folga`,text:`H\xE1 ${u} tarefa${u>1?"s":""} marcada${u>1?"s":""} na folga. Posts podem ficar programados para ningu\xE9m trabalhar.`}),u>c.maxTasks&&a.push({level:"warn",kind:"rest",icon:"alert",title:`${Y(i)} sobrecarregado`,text:`${u} tarefas (limite combinado: ${c.maxTasks}).`})}),s.eventsOn(k(e,1),{person:t}).filter(i=>i.type==="captacao").forEach(i=>{let l=s.company(i.companyId);a.push({level:"prep",icon:"camera",ids:[i.id],title:`Amanh\xE3: capta\xE7\xE3o${l?" na "+l.name:""} \xE0s ${x(i.time)}`,text:"Hoje: carregue baterias, esvazie cart\xF5es de mem\xF3ria, confirme o hor\xE1rio com o cliente e defina o roteiro de tomadas."})}),!a.some(i=>i.kind==="conflict")&&r.length&&a.push({level:"ok",icon:"check",title:"Agenda sem conflitos",text:"Ningu\xE9m est\xE1 em dois lugares ao mesmo tempo."});let d=Math.abs(ht("2024-01-01",e))%Ie.length;return a.push({level:"tip",icon:"bulb",title:"Dica do dia",text:Ie[d]}),a}function Ft(e,t=14){let a=[],o=_();for(let c=0;c<t;c++){let r=k(o,c);Se(e,r).forEach(n=>a.push({...n,date:r}))}return a}function Vt(e="all"){let t=_(),a=F();return s.eventsOn(t,{person:e}).find(o=>o.time&&o.status!=="feito"&&j(o.time)+be(o)>a)||null}function zt(){return`<div class="seg" role="tablist">
    ${[{id:"all",name:"Todos"},...s.team].map(t=>`<button class="seg__btn${f.person===t.id?" is-on":""}" data-action="set-person" data-p="${t.id}">
      ${t.id==="all"?p("users",15):M(t.id,18)}<span>${h(t.name)}${s.me===t.id?"<em> (voc\xEA)</em>":""}</span></button>`).join("")}
  </div>`}function Aa(e,t=4){let a=[];return e.forEach(o=>{a.includes(o.companyId)||a.push(o.companyId)}),a.slice(0,t).map(o=>`<i style="background:${s.company(o)?.color||"#999"}"></i>`).join("")}function Ut(){let e=f.date,t=_(),a=s.eventsOn(e,{person:f.person}),o=Bt(e,f.person),c=o.filter($=>$.level==="warn"&&$.icon!=="flag").flatMap($=>$.ids||[]),r=s.member(s.me),n=ut(e),m=Array.from({length:7},($,E)=>k(n,E)),d=(()=>{let $=z(m[0]),E=z(m[6]);return $.getMonth()===E.getMonth()?`${$.getDate()}\u2013${E.getDate()} de ${pe[E.getMonth()]}`:`${$.getDate()} ${pe[$.getMonth()]} \u2013 ${E.getDate()} ${pe[E.getMonth()]}`})(),i=`
  <header class="hdr">
    <div class="hdr__row">
      <div class="hdr__titles">
        <p class="hdr__eyebrow">${e===t?`${wt()}${r?", "+h(r.name):""}`:h(ne(e))}</p>
        <h1>${h(vt(e))}${e===t?`<span class="hdr__date">${h(gt(e))}</span>`:""}</h1>
      </div>
      <div class="hdr__actions">
        ${e!==t?'<button class="chip chip--accent" data-action="go-today">Hoje</button>':""}
        <button class="iconbtn iconbtn--ai" data-action="assistant" aria-label="Assistente">${p("sparkle",20)}</button>
        <button class="iconbtn" data-action="tab" data-tab="ajustes" aria-label="Perfil">${r?M(r.id,34):p("user",20)}</button>
      </div>
    </div>
    ${zt()}
    <div class="week">
      <div class="week__bar">
        <button class="iconbtn iconbtn--sm" data-action="week" data-n="-7" aria-label="Semana anterior">${p("left",18)}</button>
        <span>${h(d)}</span>
        <button class="iconbtn iconbtn--sm" data-action="week" data-n="7" aria-label="Pr\xF3xima semana">${p("right",18)}</button>
      </div>
      <div class="week__days" data-swipe="week">
        ${m.map($=>{let E=z($),R=s.eventsOn($,{person:f.person}),S=R.filter(oe=>oe.status!=="feito").length;return`<button class="wday${$===e?" is-sel":""}${$===t?" is-today":""}" data-action="set-date" data-k="${$}">
            <span class="wday__l">${X[E.getDay()]}</span>
            <span class="wday__n">${E.getDate()}</span>
            <span class="wday__dots">${Aa(R,3)}${R.length?"":'<i class="none"></i>'}</span>
            ${S?`<span class="sr">${S} pendentes</span>`:""}
          </button>`}).join("")}
      </div>
    </div>
  </header>`,l={};a.forEach($=>l[$.type]=(l[$.type]||0)+1);let u=a.filter($=>$.status==="feito").length,g=a.length?Math.round(u/a.length*100):0,y=a.length?`<div class="summary">
        <div class="summary__progress">
          <div class="ring" style="--p:${g}"><span>${g}%</span></div>
          <div><strong>${u} de ${a.length}</strong><small>tarefas conclu\xEDdas</small></div>
        </div>
        <div class="summary__types">
          ${Object.entries(l).sort(($,E)=>E[1]-$[1]).map(([$,E])=>`<span class="tcount tbadge--${$}">${p(A[$].icon,13)}<b>${E}</b> ${A[$].label}</span>`).join("")}
        </div>
      </div>`:"",D=f.person==="all"?`<section class="block">
      <h2 class="block__title">${p("route",16)} Onde cada um vai estar</h2>
      <div class="team">${s.team.map($=>Ta($,e)).join("")}</div>
    </section>`:"",b="";if(e===t){let $=Vt(f.person);if($){let E=s.company($.companyId),R=j($.time)-F(),S=E?.color||"#555";b=`<button class="next" style="--cc:${S};--cc-soft:${_t(S,.12)}" data-action="open-event" data-id="${$.id}">
        <div class="next__label">${p("bell",14)} ${R>0?"Pr\xF3ximo \xB7 "+yt(R):"Acontecendo agora"}</div>
        <div class="next__row">
          ${He(E,44)}
          <div class="next__txt">
            <strong>${x($.time)} \xB7 ${h(A[$.type].label)} \xB7 ${h(E?.name||"")}</strong>
            <span>${h($.title||"")}</span>
          </div>
          ${jt($.assignees,26)}
        </div>
        ${$.location?`<div class="next__loc">${p("pin",13)} ${h($.location)}</div>`:""}
      </button>`}}let I=f.showAllTips?o:o.filter(($,E)=>$.level==="warn"||E<2),w=o.length-I.length,ae=`<section class="block">
    <h2 class="block__title">${p("bulb",16)} Dicas e alertas</h2>
    <div class="tips">${I.map(ja).join("")}</div>
    ${w>0?`<button class="btn-text btn-text--sm" data-action="toggle-tips">Ver mais ${w} dica${w>1?"s":""}</button>`:f.showAllTips&&o.length>2?'<button class="btn-text btn-text--sm" data-action="toggle-tips">Mostrar menos</button>':""}
  </section>`,B;if(!a.length)B=Fe("Dia livre",f.person==="all"?"Nada agendado para este dia.":`Nada agendado para ${s.member(f.person)?.name}.`,`<button class="btn btn--primary" data-action="new-event" data-date="${e}">${p("plus",18)} Adicionar</button>`);else{let $=[{k:"Manh\xE3",icon:"sun",items:a.filter(S=>S.time&&j(S.time)<720)},{k:"Tarde",items:a.filter(S=>S.time&&j(S.time)>=720&&j(S.time)<1080)},{k:"Noite",items:a.filter(S=>S.time&&j(S.time)>=1080)},{k:"Sem hor\xE1rio",items:a.filter(S=>!S.time)}],E=F(),R=e!==t;B=$.filter(S=>S.items.length).map(S=>`
      <div class="tl-group">
        <h3 class="tl-group__h">${S.k}<span>${S.items.length}</span></h3>
        ${S.items.map(oe=>{let mt="";return!R&&oe.time&&j(oe.time)>E&&(R=!0,mt=`<div class="nowline"><span>Agora \xB7 ${x(`${String(new Date().getHours()).padStart(2,"0")}:${String(new Date().getMinutes()).padStart(2,"0")}`)}</span></div>`),mt+Be(oe,{highlight:c})}).join("")}
      </div>`).join(""),!R&&e===t&&(B+=`<div class="nowline nowline--end"><span>Agora \xB7 ${x(`${String(new Date().getHours()).padStart(2,"0")}:${String(new Date().getMinutes()).padStart(2,"0")}`)} \xB7 fim da agenda</span></div>`)}let Ne=s.notesOn(e),Oe=`<section class="block">
    <h2 class="block__title">${p("note",16)} Bilhetes do dia</h2>
    <div class="notes">
      ${Ne.map($=>`<div class="note">
        <p>${h($.text)}</p>
        <footer>${M($.author,18)}<span>${h(s.member($.author)?.name||"")}</span>
          <button class="note__del" data-action="del-note" data-id="${$.id}" aria-label="Apagar bilhete">${p("x",14)}</button></footer>
      </div>`).join("")}
      <form class="note-add" data-form="note">
        <input name="text" placeholder="Escreva um bilhete para a dupla\u2026" autocomplete="off" maxlength="280">
        <button class="iconbtn iconbtn--accent" aria-label="Adicionar bilhete">${p("plus",18)}</button>
      </form>
    </div>
  </section>`;return`${i}
  <div class="page">
    ${s.demo?Ca():""}
    ${b}
    <button class="brief" data-action="assistant">
      <span class="brief__ic">${p("sparkle",18)}</span>
      <div><strong>Assistente</strong>${le(e,f.person).map($=>`<p>${h($)}</p>`).join("")}</div>
      ${p("right",18,"muted")}
    </button>
    ${D}
    <section class="block">
      <h2 class="block__title">${p("clock",16)} Agenda ${f.person==="all"?"da dupla":"de "+h(s.member(f.person)?.name||"")}</h2>
      ${y}
      ${B}
    </section>
    ${ae}
    ${Oe}
  </div>`}function Ta(e,t){let a=s.eventsOn(t,{person:e.id}),o=t===_()?F():-1,c=a.filter(i=>["shoot","meeting"].includes(A[i.type]?.kind)),r=a.filter(i=>ie(i.type)).length,n=a.find(i=>i.time&&i.status!=="feito"&&j(i.time)+be(i)>o),m=Z(e.id,t),d=m.dayOff?"Folga":`${U(Math.round(m.minutes/15)*15)||"0 min"} livres`;return`<button class="team__col" data-action="set-person" data-p="${e.id}">
    <span class="team__free ${m.dayOff?"is-off":m.minutes>=240?"is-good":m.minutes>=120?"is-mid":"is-low"}">${p("clock",12)} ${d}</span>
    <div class="team__head">${M(e.id,30)}<div><strong>${h(e.name)}</strong><small>${a.length} tarefa${a.length===1?"":"s"} \xB7 ${r} post${r===1?"":"s"}</small></div></div>
    <ul class="team__where">
      ${c.length?c.map(i=>`<li>${p(A[i.type].icon,13)}<span><b>${x(i.time)}</b> ${h(s.company(i.companyId)?.name||"")}</span></li>`).join(""):`<li class="muted">${p("building",13)}<span>Trabalho interno / remoto</span></li>`}
    </ul>
    ${n?`<div class="team__next">Pr\xF3ximo: <b>${x(n.time)}</b> ${h(A[n.type].label)} \xB7 ${h(s.company(n.companyId)?.name||"")}</div>`:`<div class="team__next muted">${a.length?"Tudo conclu\xEDdo \u2713":"Livre"}</div>`}
  </button>`}function ja(e){let t=e.fixes?.length?`<div class="fixes">${e.fixes.map(a=>`<button class="fixbtn" data-action="apply-fix" data-id="${a.eventId}" data-patch="${h(JSON.stringify(a.patch))}">${p("check",13)} ${h(a.label)}</button>`).join("")}</div>`:"";return`<div class="tip tip--${e.level}"${e.ids?.length===1&&!t?` data-action="open-event" data-id="${e.ids[0]}"`:""}>
    <span class="tip__ic">${p(e.icon,16)}</span>
    <div><strong>${h(e.title)}</strong><p>${h(e.text)}</p>${t}</div>
  </div>`}function Ca(){return`<div class="banner">
    ${p("sparkle",18)}
    <p><strong>Voc\xEA est\xE1 vendo dados de exemplo.</strong> Explore \xE0 vontade e, quando quiser come\xE7ar de verdade, apague os exemplos.</p>
    <button class="btn btn--soft btn--sm" data-action="clear-demo">Apagar exemplos</button>
  </div>`}function Gt(){let e=f.month,[t,a]=e.split("-").map(Number),o=new Date(t,a-1,1),c=k(pt(o),-o.getDay()),r=_(),n=Array.from({length:42},(w,ae)=>k(c,ae)),d=n.slice(35).some(w=>w.slice(0,7)===e)?n:n.slice(0,35),i={person:f.person,companyId:f.monthCompany},l=s.companiesSorted(),u=f.monthSel,g=s.eventsOn(u,i),y=s.eventsBetween(`${e}-01`,`${e}-31`,i),D=y.filter(w=>ie(w.type)).length,b=y.filter(w=>w.type==="captacao").length,I=y.filter(w=>w.type==="reuniao").length;return`
  <header class="hdr">
    <div class="hdr__row">
      <div class="hdr__titles">
        <p class="hdr__eyebrow">Calend\xE1rio</p>
        <h1>${h($t(e).split(" ")[0])}<span class="hdr__date">${e.slice(0,4)}</span></h1>
      </div>
      <div class="hdr__actions">
        <button class="iconbtn" data-action="month" data-n="-1" aria-label="M\xEAs anterior">${p("left",20)}</button>
        <button class="chip" data-action="month-today">Hoje</button>
        <button class="iconbtn" data-action="month" data-n="1" aria-label="Pr\xF3ximo m\xEAs">${p("right",20)}</button>
      </div>
    </div>
    ${zt()}
  </header>
  <div class="page">
    <div class="chips-scroll">
      <button class="chip${f.monthCompany?"":" is-on"}" data-action="month-company" data-id="">Todas as empresas</button>
      ${l.map(w=>`<button class="chip chip--co${f.monthCompany===w.id?" is-on":""}" style="--cc:${w.color}" data-action="month-company" data-id="${w.id}">${He(w,18,5)}${h(w.name)}</button>`).join("")}
    </div>

    <div class="mstats">
      <div><b>${D}</b><span>posts</span></div>
      <div><b>${b}</b><span>capta\xE7\xF5es</span></div>
      <div><b>${I}</b><span>reuni\xF5es</span></div>
      <div><b>${y.filter(w=>w.status==="feito").length}/${y.length}</b><span>conclu\xEDdos</span></div>
    </div>

    <div class="month" data-swipe="month">
      <div class="month__wd">${bt.map(w=>`<span>${w}</span>`).join("")}</div>
      <div class="month__grid">
        ${d.map(w=>{let ae=w.slice(0,7)===e,B=s.eventsOn(w,i),Ne=B.some(Oe=>Oe.type==="captacao");return`<button class="mday${ae?"":" is-out"}${w===r?" is-today":""}${w===u?" is-sel":""}" data-action="month-select" data-k="${w}">
            <span class="mday__n">${Number(w.slice(8))}</span>
            ${B.length?`<span class="mday__bars">${Da(B)}</span><span class="mday__count">${Ne?p("camera",10):""}${B.length}</span>`:""}
          </button>`}).join("")}
      </div>
    </div>

    <section class="block">
      <div class="block__row">
        <h2 class="block__title">${h(ue(u))}</h2>
        <button class="btn-text btn-text--sm" data-action="open-day" data-k="${u}">Abrir dia ${p("right",14)}</button>
      </div>
      ${g.length?g.map(w=>Be(w)).join(""):Fe("Nada neste dia","Toque no + para agendar.",`<button class="btn btn--soft" data-action="new-event" data-date="${u}">${p("plus",16)} Novo evento</button>`)}
    </section>

    ${l.length?`<section class="block">
      <h2 class="block__title">Legenda</h2>
      <div class="legend">${l.map(w=>`<span><i style="background:${w.color}"></i>${h(w.name)}</span>`).join("")}</div>
    </section>`:""}
  </div>`}function Da(e){let t={};return e.forEach(a=>t[a.companyId]=(t[a.companyId]||0)+1),Object.entries(t).slice(0,4).map(([a])=>`<i style="background:${s.company(a)?.color||"#999"}"></i>`).join("")}var Je="pauta.onboarded",xe="pauta.notifyAskedAt";function Yt(){if(!localStorage.getItem(Je))return We(s.me?["welcome","notify","done"]:["welcome","who","notify","done"]);if(!s.me&&s.mode==="local")return We(["who"]);let t=Number(localStorage.getItem(xe)||0);if(fe()&&K()==="default"&&Date.now()-t>3*864e5)return We(["notify"])}function Ye(e,t,a="agora"){return`<div class="nprev">
    <img src="icons/icon-192.png" alt="">
    <div><div class="nprev__top"><b>${h(T.appName.toUpperCase())}</b><span>${h(a)}</span></div>
    <strong>${h(e)}</strong><p>${h(t)}</p></div>
  </div>`}function Ma(e,t,a){let o=s.member(s.me),c=s.team.find(n=>n.id!==s.me)||s.team[1]||s.team[0],r=a>1?`<div class="ob__dots">${Array.from({length:a},(n,m)=>`<i class="${m===t?"is-on":""}"></i>`).join("")}</div>`:"";return e==="welcome"?`<div class="ob__art"><img class="ob__icon" src="icons/icon-512.png" alt=""></div>
      <h1>Bem-vindo ao ${h(T.appName)}</h1>
      <p>A agenda de conte\xFAdo de ${h(T.agencyName)}: posts, stories, reels e capta\xE7\xF5es de todas as empresas, num lugar s\xF3.</p>
      ${r}
      <button class="btn btn--primary btn--block" data-next>Come\xE7ar</button>`:e==="who"?`<div class="ob__art ob__art--sm">${p("user",34)}</div>
      <h1>Quem vai usar este celular?</h1>
      <p>Assim o app sabe de quem s\xE3o os lembretes e avisa o parceiro quando voc\xEA marcar algo.</p>
      <div class="whogrid ob__who">${s.team.map(n=>`<button class="whobtn${s.me===n.id?" is-on":""}" style="--mc:${n.color}" data-me="${n.id}">${M(n.id,36)}<span>${h(n.name)}</span><i class="whobtn__check">${p("check",14)}</i></button>`).join("")}</div>
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
    <h1>Tudo pronto${o?", "+h(o.name):""}!</h1>
    <ul class="ob__tips">
      <li>${p("plus",18)}<span>Toque no <b>+</b> para marcar posts, capta\xE7\xF5es e reuni\xF5es.</span></li>
      <li>${p("sparkle",18)}<span>O <b>Assistente</b> avisa conflitos e sugere os melhores hor\xE1rios.</span></li>
      <li>${p("link",18)}<span>Em <b>Empresas</b>, mande para cada cliente o link do cronograma dele.</span></li>
    </ul>
    ${r}
    <button class="btn btn--primary btn--block" data-next>Abrir a agenda</button>`}function We(e){if(document.querySelector(".ob"))return;let t=0,a=document.createElement("div");a.className="ob",a.innerHTML='<div class="ob__card"></div>',document.body.appendChild(a),requestAnimationFrame(()=>a.classList.add("is-in"));let o=a.querySelector(".ob__card"),c=()=>{(e.includes("welcome")||e.includes("done"))&&localStorage.setItem(Je,"1"),a.classList.remove("is-in"),setTimeout(()=>a.remove(),400)},r=d=>{if(d>=e.length)return c();t=d,o.classList.remove("is-shown"),setTimeout(()=>{o.innerHTML=Ma(e[t],t,e.length),m(),o.classList.add("is-shown")},o.innerHTML?180:0)},n=(d,i="info")=>{let l=o.querySelector("[data-notify-msg]");l&&(l.innerHTML=`<div class="ob__msg ob__msg--${i}">${d}</div>`)},m=()=>{o.querySelectorAll("[data-next]").forEach(l=>l.onclick=()=>r(t+1)),o.querySelectorAll("[data-me]").forEach(l=>l.onclick=()=>{s.setMe(l.dataset.me),o.querySelectorAll("[data-me]").forEach(u=>u.classList.toggle("is-on",u===l)),o.querySelector("[data-next]").disabled=!1});let d=o.querySelector("[data-skip]");d&&(d.onclick=()=>{localStorage.setItem(xe,String(Date.now())),r(t+1)});let i=o.querySelector("[data-enable]");i&&(i.onclick=async()=>{if(localStorage.setItem(xe,String(Date.now())),ye()){n(`<b>Primeiro instale o app.</b> No iPhone, as notifica\xE7\xF5es s\xF3 funcionam pelo \xEDcone da Tela de In\xEDcio:<br>
          1. Toque em ${p("share",14)} <b>Compartilhar</b><br>2. <b>Adicionar \xE0 Tela de In\xEDcio</b><br>3. Abra o ${h(T.appName)} pelo \xEDcone`,"warn"),i.outerHTML='<button class="btn btn--primary btn--block" data-next>Entendi</button>',m();return}i.disabled=!0,i.innerHTML="Aguardando permiss\xE3o\u2026";let l=await we().catch(()=>({ok:!1,reason:"error"}));l.ok?(l.local?n("Ativado neste celular. Para os avisos chegarem com o app fechado e no celular do parceiro, falta ligar o servidor de notifica\xE7\xF5es (Ajustes \u2192 Notifica\xE7\xF5es).","ok"):(n("Pronto! Voc\xEA vai receber uma notifica\xE7\xE3o de teste em instantes.","ok"),_e().catch(()=>{})),i.outerHTML='<button class="btn btn--primary btn--block" data-next>Continuar</button>',o.querySelector("[data-skip]")?.remove(),m()):l.reason==="server"?(n("Permiss\xE3o concedida! O servidor de notifica\xE7\xF5es ainda n\xE3o foi publicado; quando for, este celular \xE9 cadastrado sozinho.","ok"),i.outerHTML='<button class="btn btn--primary btn--block" data-next>Continuar</button>',m()):l.reason==="denied"?(n(`As notifica\xE7\xF5es foram bloqueadas. Para ligar depois: <b>Ajustes do iPhone \u2192 Notifica\xE7\xF5es \u2192 ${h(T.appName)}</b>.`,"warn"),i.outerHTML='<button class="btn btn--primary btn--block" data-next>Continuar</button>',m()):(n("Este aparelho n\xE3o aceita notifica\xE7\xF5es deste app.","warn"),i.disabled=!1,i.innerHTML="Tentar de novo")})};r(0)}function Wt(){localStorage.removeItem(Je),localStorage.removeItem(xe),v("A apresenta\xE7\xE3o aparece na pr\xF3xima abertura")}function Jt(){let e=s.member(s.me),t=s.mode==="cloud",a="Notification"in window&&Notification.permission==="granted";return`
  <header class="hdr">
    <div class="hdr__row"><div class="hdr__titles"><p class="hdr__eyebrow">${h(T.appName)} \xB7 ${h(T.agencyName)}</p><h1>Ajustes</h1></div></div>
  </header>
  <div class="page">
    <section class="block">
      <h2 class="block__title">${p("user",16)} Quem est\xE1 usando este celular?</h2>
      ${t?`<div class="card card--row">${e?M(e.id,40):p("user",24)}<div><strong>${h(e?.name||s.user?.email||"")}</strong><small>${h(s.user?.email||"")}</small></div>
            <button class="btn btn--soft btn--sm" data-action="logout">${p("logout",16)} Sair</button></div>`:`<div class="whogrid">${s.team.map(o=>`<button class="whobtn${s.me===o.id?" is-on":""}" style="--mc:${o.color}" data-action="set-me" data-p="${o.id}">${M(o.id,34)}<span>${h(o.name)}</span><i class="whobtn__check">${p("check",14)}</i></button>`).join("")}</div>
           <p class="fhelp">Usado para sauda\xE7\xE3o, \u201CCriado por\u201D e nos lembretes.</p>`}
    </section>

    ${Na()}

    <section class="block">
      <h2 class="block__title">${p("sparkle",16)} Assistente e Claude</h2>
      <div class="card card--row">
        ${p("sparkle",22)}
        <div><strong>Assistente autom\xE1tico ativo</strong><small>Confere conflitos, tempo livre e melhores hor\xE1rios sozinho, sem internet e sem chave.</small></div>
        <button class="btn btn--soft btn--sm" data-action="assistant">Abrir</button>
      </div>
      <p class="fhelp">Para perguntas abertas (ideias, reorganizar a semana), use \u201CPerguntar ao Claude\u201D no Assistente. Abre o Claude com o seu login normal, sem chave de API.</p>
    </section>

    ${qa()}

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

    ${fe()?"":`<section class="block">
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
          ${Et.map(o=>`<li><span class="tbadge tbadge--${o.type}">${p(A[o.type].icon,13)}${A[o.type].label}</span><span>${h(o.text)}</span></li>`).join("")}
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
    <p class="about">${h(T.appName)} \u2014 agenda de conte\xFAdo \xB7 v1.0</p>
  </div>`}function qa(){let e=K(),t=ye(),a=s.mode==="cloud",o=!!localStorage.getItem("pauta.device"),c=Lt(),r,n,m="";return t?(r="warn",n="No iPhone, as notifica\xE7\xF5es s\xF3 funcionam com o app instalado: Compartilhar \u2192 Adicionar \xE0 Tela de In\xEDcio, e abra pelo \xEDcone."):e==="unsupported"?(r="warn",n="Este navegador n\xE3o aceita notifica\xE7\xF5es."):e==="denied"?(r="warn",n=`Bloqueadas. Para ligar: Ajustes do iPhone \u2192 Notifica\xE7\xF5es \u2192 ${T.appName}.`):e!=="granted"?(r="warn",n="Desativadas neste celular.",m='<button class="btn btn--primary btn--sm" data-action="notify-enable">Ativar</button>'):a&&o?(r="ok",n="Ativadas. Os lembretes e os avisos do parceiro chegam mesmo com o app fechado.",m='<button class="btn btn--soft btn--sm" data-action="notify-enable">Recadastrar</button>'):a?(r="warn",n="Permiss\xE3o concedida, mas este celular ainda n\xE3o foi cadastrado no servidor. Toque em Cadastrar.",m='<button class="btn btn--primary btn--sm" data-action="notify-enable">Cadastrar</button>'):(r="warn",n="Ativadas s\xF3 com o app aberto. Para receber com o app fechado e no celular do parceiro, ligue a nuvem e o servidor (README)."),`<section class="block">
    <h2 class="block__title">${p("bell",16)} Notifica\xE7\xF5es</h2>
    <div class="card card--row ${r==="ok"?"card--ok":"card--warn"}">
      ${p("bell",22)}
      <div><strong>${r==="ok"?"Funcionando":"Aten\xE7\xE3o"}</strong><small>${h(n)}</small></div>
      ${m}
    </div>
    <form class="list notif-prefs" data-notify-form onsubmit="return false">
      <label class="list__row"><span><b>Lembretes dos meus posts</b><small>2h e 30 min antes, na hora e cobran\xE7a se atrasar</small></span><input type="checkbox" class="switch" name="reminders" ${c.reminders?"checked":""}></label>
      <label class="list__row"><span><b>Avisos do parceiro</b><small>quando marcar, mudar ou concluir algo</small></span><input type="checkbox" class="switch" name="partner" ${c.partner?"checked":""}></label>
      <label class="list__row"><span><b>Resumo do dia</b><small>\xE0s 8h (hoje) e \xE0s 20h (amanh\xE3)</small></span><input type="checkbox" class="switch" name="daily" ${c.daily?"checked":""}></label>
    </form>
    ${e==="granted"?`<button class="btn btn--soft btn--block" data-action="notify-test">${p("bell",16)} Enviar notifica\xE7\xE3o de teste</button>`:""}
    <button class="btn-text btn-text--sm" data-action="onboarding-again">Ver a apresenta\xE7\xE3o de novo</button>
  </section>`}function Na(){let e=P(),t=[0,15,30,45,60,90];return`<section class="block">
    <h2 class="block__title">${p("clock",16)} Rotina e tempo livre</h2>
    <form class="list" data-routine-form onsubmit="return false">
      <label class="list__row"><span>Expediente</span><input type="time" name="workStart" value="${e.workStart}"> <input type="time" name="workEnd" value="${e.workEnd}"></label>
      <label class="list__row"><span>Almo\xE7o</span><input type="time" name="lunchStart" value="${e.lunchStart}"> <input type="time" name="lunchEnd" value="${e.lunchEnd}"></label>
      <label class="list__row"><span>Deslocamento entre lugares</span><select name="travelMin">${t.map(a=>`<option value="${a}"${e.travelMin===a?" selected":""}>${a?a+" min":"n\xE3o considerar"}</option>`).join("")}</select></label>
      <label class="list__row"><span>M\xE1ximo de tarefas/dia</span><select name="maxTasks">${[4,5,6,7,8,10,12,15,20].map(a=>`<option value="${a}"${e.maxTasks===a?" selected":""}>${a}</option>`).join("")}</select></label>
      <div class="list__row list__row--col"><span>Dias de folga</span>
        <div class="daysoff">${X.map((a,o)=>`<label class="dayoff"><input type="checkbox" name="off" value="${o}"${e.daysOff.includes(o)?" checked":""}><span>${a}</span></label>`).join("")}</div>
      </div>
    </form>
    <p class="fhelp">O assistente usa isso para n\xE3o marcar nada em cima do almo\xE7o, da folga ou fora do expediente, e para proteger o tempo livre de voc\xEAs.</p>
  </section>`}var H={async notifyEnable(){let e=await we().catch(t=>({ok:!1,reason:"error",message:t.message}));e.ok?v(e.local?"Ativado (com o app aberto)":"Notifica\xE7\xF5es ativadas"):e.reason==="install"?v("Instale o app na Tela de In\xEDcio primeiro"):e.reason==="denied"?v("Bloqueado: libere em Ajustes do iPhone \u2192 Notifica\xE7\xF5es"):e.reason==="server"?v("Servidor de notifica\xE7\xF5es ainda n\xE3o publicado"):v(`N\xE3o foi poss\xEDvel ativar${e.message?": "+e.message:""}`,{ms:8e3}),s.emit()},async notifyTest(){let e;try{e=await _e()}catch(t){return v(`Falhou: ${t.message}`,{ms:8e3})}if(e.kind==="not-registered")return v('Este celular ainda n\xE3o est\xE1 cadastrado. Toque em "Ativar" acima.',{ms:7e3});if(e.kind==="local")return v("Notifica\xE7\xE3o local mostrada (servidor n\xE3o configurado)");if(e.sent>0)return v("Enviada! Deve chegar em alguns segundos. Bloqueie a tela para ver.",{ms:7e3});if(!e.devices)return v('O servidor n\xE3o tem este celular cadastrado. Toque em "Ativar" de novo.',{ms:7e3});v(`A Apple n\xE3o aceitou o envio (${(e.statuses||[]).join(", ")||"sem resposta"}). Toque em "Ativar" de novo.`,{ms:9e3})},async notifyPrefs(e){await Ht({reminders:e.reminders.checked,partner:e.partner.checked,daily:e.daily.checked}),v("Prefer\xEAncias salvas")},onboardingAgain(){Wt()},async routine(e){let t=(c,r)=>/^\d{2}:\d{2}$/.test(e[c].value)?e[c].value:r,a=P(),o={id:"routine",workStart:t("workStart",a.workStart),workEnd:t("workEnd",a.workEnd),lunchStart:t("lunchStart",a.lunchStart),lunchEnd:t("lunchEnd",a.lunchEnd),travelMin:Number(e.travelMin.value),maxTasks:Number(e.maxTasks.value),daysOff:[...e.querySelectorAll('input[name="off"]:checked')].map(c=>Number(c.value))};if(o.workEnd<=o.workStart)return v("O fim do expediente precisa ser depois do in\xEDcio");if(o.lunchEnd<=o.lunchStart)return v("O fim do almo\xE7o precisa ser depois do in\xEDcio");await s.upsert("settings",o),v("Rotina salva")},async ics(e){let t=e.dataset.who==="me"?s.me:"all";if(e.dataset.who==="me"&&!s.me)return v("Escolha primeiro quem est\xE1 usando este celular");let a=Number(e.dataset.days),o=_(),c=s.eventsBetween(o,k(o,a),{person:t}).filter(n=>n.status!=="feito");if(!c.length)return v("Nada agendado nesse per\xEDodo");let r=t==="all"?`${T.appName} \u2013 Dupla`:`${T.appName} \u2013 ${s.member(t).name}`;await Ot(c,`pauta-${t}-${o}.ics`,r)},export(){let e=new Blob([s.exportData()],{type:"application/json"}),t=document.createElement("a");t.href=URL.createObjectURL(e),t.download=`pauta-backup-${_()}.json`,document.body.appendChild(t),t.click(),t.remove(),v("Backup exportado")},async import(e){let t=e.files[0];if(t)try{let a=await t.text(),o=await Mt({title:"Importar backup",text:"Como deseja importar?",options:[{label:"Juntar com os dados atuais",value:"merge",primary:!0},{label:"Substituir tudo",value:"replace",danger:!0}]});if(!o)return;await s.importData(a,{replace:o==="replace"}),v("Backup importado")}catch{v("Arquivo inv\xE1lido")}finally{e.value=""}},async clearAll(){await re({title:"Apagar TUDO?",text:"Empresas, eventos e bilhetes ser\xE3o apagados. Exporte um backup antes, se precisar.",ok:"Apagar tudo",danger:!0})&&(await s.clearAll(),v("Tudo apagado"))}};var Qe=[{label:"Organize meu dia",q:"Analise a agenda de hoje e me diga, em ordem, o que fazer e quando. Aponte conflitos e onde d\xE1 para ganhar tempo livre."},{label:"Melhores hor\xE1rios da semana",q:"Sugira os melhores hor\xE1rios para os posts desta semana de cada empresa, sem conflitar com as capta\xE7\xF5es e respeitando o expediente e o almo\xE7o."},{label:"Equilibrar a dupla",q:"A carga de trabalho entre Henrique e Matheus est\xE1 equilibrada nos pr\xF3ximos 7 dias? Sugira trocas concretas de respons\xE1vel."},{label:"Ideias de conte\xFAdo",q:"Para cada empresa, sugira 3 ideias de posts (feed, reels e stories) para a pr\xF3xima semana, com legenda curta."}],Oa=(e=[])=>e.map(t=>s.member(t)?.name).filter(Boolean).join(" e ")||"sem respons\xE1vel";function Pa(e,t=14){let a=P(),o=_(),c=new Date,r=[];r.push(`Voc\xEA \xE9 o assistente de organiza\xE7\xE3o de uma dupla de social media (${s.team.map(d=>d.name).join(" e ")}) que cuida do Instagram de v\xE1rias empresas. Responda em portugu\xEAs do Brasil, de forma curta e direta (sem rodeios), com hor\xE1rios concretos e no m\xE1ximo uns 10 itens.`),r.push(""),r.push(`Agora: ${ne(o)}, ${c.toTimeString().slice(0,5)}.`),r.push(`Rotina combinada: expediente ${a.workStart}\u2013${a.workEnd}, almo\xE7o ${a.lunchStart}\u2013${a.lunchEnd}, folga: ${a.daysOff.map(d=>ft[d]).join(", ")||"nenhuma"}, deslocamento m\xEDnimo entre lugares: ${a.travelMin} min, m\xE1ximo de ${a.maxTasks} tarefas por pessoa/dia.`),r.push(`Empresas: ${s.companiesSorted().map(d=>d.name+(d.instagram?` (@${d.instagram})`:"")).join(", ")||"nenhuma"}.`),r.push(""),r.push(`Agenda (de hoje at\xE9 ${t} dias):`);let n=s.eventsBetween(k(o,-1),k(o,t)),m="";return n.forEach(d=>{d.date!==m&&(r.push(`
${ne(d.date)}:`),m=d.date);let i=s.company(d.companyId),l=d.duration?` (${d.duration} min)`:"";r.push(`- ${d.time||"sem hor\xE1rio"}${l} \xB7 ${A[d.type]?.label} \xB7 ${i?.name||"?"} \xB7 "${d.title||""}" \xB7 ${Oa(d.assignees)} \xB7 ${d.status==="feito"?"feito":d.status==="pronto"?"pronto":"a fazer"}${d.location?" \xB7 local: "+d.location:""}`)}),n.length||r.push("(nenhum compromisso)"),r.push(""),r.push(`Pergunta: ${e}`),r.join(`
`)}function Xe(e){let t=Pa(e);try{navigator.clipboard?.writeText(t).catch(()=>{})}catch{}let a=encodeURIComponent(t),o=a.length<7500?`https://claude.ai/new?q=${a}`:"https://claude.ai/new";window.open(o,"_blank","noopener"),v(a.length<7500?"Abrindo o Claude\u2026 (a agenda tamb\xE9m foi copiada)":"Agenda copiada: cole no Claude (segure no campo \u2192 Colar)",{ms:5e3})}var Zt="cal.chat",L=(()=>{try{return JSON.parse(localStorage.getItem(Zt)||"[]").slice(-30)}catch{return[]}})(),ee=!1,ea=!1;(async()=>{try{let{server:e}=await import("./c-YUYMP7XC.js");e()&&(ea=!!(await(await fetch(e()+"/health")).json()).chat)}catch{}})();var Ze=()=>{try{localStorage.setItem(Zt,JSON.stringify(L.slice(-30)))}catch{}},Ia=e=>h(e).replace(/\*\*(.+?)\*\*/g,"<b>$1</b>").replace(/^#{1,4}\s*(.+)$/gm,"<b>$1</b>").replace(/^\s*[-•*]\s+(.+)$/gm,'<span class="li">$1</span>').replace(/<\/span>\n+(?=<span class="li">)/g,"</span>").replace(/\n{2,}/g,`
`).replace(/\n/g,"<br>"),Qt={"functions/failed-precondition":null,"functions/permission-denied":"S\xF3 a equipe pode usar o assistente.","functions/resource-exhausted":null,"functions/unavailable":"Sem conex\xE3o com o assistente agora. Tente de novo.","functions/deadline-exceeded":"O assistente demorou demais. Tente de novo."};function La(e){return e?.code==="local"?"O assistente precisa da sincroniza\xE7\xE3o na nuvem ligada.":e?.code==="no-server"?"O assistente ainda n\xE3o foi ligado no servidor. Falta publicar o servidor gratuito (veja o README).":e?.status?e.message:e?.code in Qt?Qt[e.code]||e.message:e?.code==="functions/not-found"||e?.code==="functions/internal"&&!/assistente|Claude/.test(e.message||"")?"O assistente ainda n\xE3o foi ligado no servidor. Falta publicar o servidor com a chave do Claude (veja o README, se\xE7\xE3o 5).":e?.message||"N\xE3o consegui falar com o assistente."}function Xt(){return`<section class="block" data-chat>
    <h2 class="block__title">${p("sparkle",16)} Pergunte ao assistente</h2>
    <div class="chat">
      ${L.length?L.map(e=>`<div class="msg msg--${e.role}${e.error?" msg--err":""}">${Ia(e.text)}</div>`).join(""):'<div class="msg msg--assistant">Pergunte o que quiser sobre a agenda, por exemplo \u201Co que eu tenho amanh\xE3?\u201D ou \u201Cqual o melhor hor\xE1rio para um Reels da Pura Vida na sexta?\u201D. A pergunta abre no app do Claude, com o seu login, j\xE1 com a agenda inteira de voc\xEAs.</div>'}
      ${ee?'<div class="msg msg--assistant msg--typing"><i></i><i></i><i></i></div>':""}
    </div>
    <div class="presets">${Qe.map((e,t)=>`<button class="preset" data-preset="${t}">${h(e.label)}</button>`).join("")}</div>
    <form class="chat__form" data-chatform onsubmit="return false">
      <textarea class="input" rows="1" name="q" placeholder="Escreva sua pergunta\u2026" ${ee?"disabled":""}></textarea>
      <button class="iconbtn iconbtn--accent" type="submit" aria-label="Enviar" ${ee?"disabled":""}>${p("right",20)}</button>
    </form>
    <div class="chat__foot">
      ${L.length?'<button class="btn-text btn-text--sm" data-clearchat>Limpar conversa</button>':"<span></span>"}
      <button class="btn-text btn-text--sm" data-extclaude>Abrir no app do Claude</button>
    </div>
  </section>`}var Ra=e=>h(JSON.stringify(e));function Ha(e="all"){let t=_(),a=e==="all"?s.team.map(n=>n.id):[e],o=[],c=new Set;for(let n=0;n<7;n++){let m=k(t,n);a.forEach(i=>Se(i,m).forEach(l=>{let u=l.ids.slice().sort().join("|")+l.title;c.has(u)||(c.add(u),o.push({...l,date:m}))})),s.eventsOn(m).filter(i=>!(i.assignees||[]).length&&i.status!=="feito").forEach(i=>o.push({date:m,level:"warn",icon:"user",ids:[i.id],title:"Sem respons\xE1vel",text:`${x(i.time)} ${q(i)}`,fixes:s.team.map(l=>({label:`Dar para ${l.name}`,eventId:i.id,patch:{assignees:[l.id]}}))}))}let r=s.state.events.filter(n=>n.status==="pendente"&&(n.date<t||n.date===t&&n.time&&j(n.time)+15<F())&&n.date>=k(t,-7));return r.length&&o.unshift({date:t,level:"warn",icon:"flag",ids:r.map(n=>n.id),title:`${r.length} tarefa${r.length>1?"s":""} pendente${r.length>1?"s":""} no passado`,text:"Marquem como feito ou reagendem para o cronograma do cliente ficar correto."}),o}function ta(){let e={type:"feed",date:f.date>=_()?f.date:_(),q:""},t=()=>{let r=_(),n=Ha(),m=P(),d=Array.from({length:7},(l,u)=>k(r,u)),i={id:"__probe",type:e.type,date:e.date,assignees:[]};return`
    ${Dt("Assistente")}
    <div class="page page--sheet">
      <div class="assist-hero">
        <span class="assist-hero__ic">${p("sparkle",22)}</span>
        <div><strong>Analisando a agenda de voc\xEAs</strong><p>Funciona sozinho, sem internet. Confere conflitos, tempo livre e os melhores hor\xE1rios sempre que algo muda.</p></div>
      </div>

      ${Xt()}

      <section class="block">
        <h2 class="block__title">${p("today",16)} Hoje</h2>
        <div class="card">${le(r).map(l=>`<p>${h(l)}</p>`).join("")}</div>
        <h2 class="block__title">${p("calendar",16)} Amanh\xE3</h2>
        <div class="card">${le(k(r,1)).map(l=>`<p>${h(l)}</p>`).join("")}</div>
      </section>

      <section class="block">
        <h2 class="block__title">${p("alert",16)} Precisa de aten\xE7\xE3o (7 dias)</h2>
        ${n.length?`<div class="tips">${n.map(l=>`
          <div class="tip tip--${l.level}">
            <span class="tip__ic">${p(l.icon,16)}</span>
            <div>
              <small class="tip__date">${h(ue(l.date))}</small>
              <strong>${h(l.title)}</strong><p>${h(l.text)}</p>
              ${l.fixes?.length?`<div class="fixes">${l.fixes.map(u=>`<button class="fixbtn" data-action="apply-fix" data-id="${u.eventId}" data-patch="${Ra(u.patch)}">${p("check",13)} ${h(u.label)}</button>`).join("")}</div>`:""}
              ${l.ids?.length===1?`<button class="btn-text btn-text--sm" data-action="open-event" data-id="${l.ids[0]}">Ver evento</button>`:""}
            </div>
          </div>`).join("")}</div>`:`<div class="tip tip--ok"><span class="tip__ic">${p("check",16)}</span><div><strong>Tudo certo</strong><p>Nenhum conflito nos pr\xF3ximos 7 dias.</p></div></div>`}
      </section>

      <section class="block">
        <h2 class="block__title">${p("clock",16)} Tempo livre no expediente (${x(m.workStart)}\u2013${x(m.workEnd)})</h2>
        <div class="freegrid">
          <span></span>${d.map(l=>`<span class="freegrid__d">${X[z(l).getDay()]}<b>${z(l).getDate()}</b></span>`).join("")}
          ${s.team.map(l=>`${M(l.id,24)}${d.map(u=>{let g=Z(l.id,u);if(g.dayOff)return'<span class="freecell is-off">folga</span>';let y=g.minutes/60;return`<span class="freecell ${y>=4?"is-good":y>=2?"is-mid":"is-low"}">${U(Math.round(g.minutes/15)*15)||"0"}</span>`}).join("")}`).join("")}
        </div>
        <p class="fhelp">Verde: dia tranquilo \xB7 amarelo: apertado \xB7 vermelho: sem respiro. Ajuste a rotina em Ajustes.</p>
      </section>

      <section class="block">
        <h2 class="block__title">${p("bulb",16)} Encontrar o melhor hor\xE1rio</h2>
        <div class="card">
          <div class="row2">
            <select class="input" data-f="type">${xt.map(l=>`<option value="${l}"${e.type===l?" selected":""}>${A[l].label}</option>`).join("")}</select>
            <input class="input" type="date" data-f="date" value="${e.date}">
          </div>
          ${s.team.map(l=>{let u=qt({...i},{people:[l.id],limit:4});return`<div class="findrow">${M(l.id,26)}<div class="hintbox__times">${u.length?u.map(g=>`<button class="tchip" data-new="${l.id}|${g.time}">${x(g.time)}${g.peak?"<small>pico</small>":""}</button>`).join(""):'<span class="muted">Sem hor\xE1rio livre</span>'}</div></div>`}).join("")}
          <p class="fhelp">Toque num hor\xE1rio para j\xE1 criar o evento com a pessoa certa.</p>
        </div>
      </section>

    </div>`},a=Ct({className:"sheet--tall",html:t(),onMount:r=>{let n=r.el;n.querySelector('[data-f="type"]').onchange=d=>{e.type=d.target.value,r.set(t())},n.querySelector('[data-f="date"]').onchange=d=>{d.target.value&&(e.date=d.target.value,r.set(t()))},n.querySelectorAll("[data-new]").forEach(d=>d.onclick=async()=>{let[i,l]=d.dataset.new.split("|"),{openEventEditor:u}=await import("./c-XEU75X6K.js");u({date:e.date,type:e.type,time:l,assignees:[i]})}),c(r,async d=>{if(d=(d||"").trim(),!d||ee)return;if(!ea){Xe(d),L.push({role:"user",text:d}),L.push({role:"assistant",text:"Abri sua pergunta no **app do Claude**, com o seu login, j\xE1 com a agenda de voc\xEAs. \xC9 s\xF3 tocar em enviar l\xE1. A agenda tamb\xE9m foi copiada: se a mensagem aparecer vazia, segure no campo e toque em **Colar**."}),Ze(),o(r);return}let i=L.filter(l=>!l.error).map(l=>({role:l.role,text:l.text}));L.push({role:"user",text:d}),ee=!0,o(r);try{let l=await s.askAssistant(d,i);L.push({role:"assistant",text:l})}catch(l){L.push({role:"assistant",text:La(l),error:!0})}ee=!1,Ze(),o(r)})}});function o(r){let n=r.el.querySelector("[data-chat]");if(!n)return;n.outerHTML=Xt(),c(r,r.send);let m=r.el.querySelector(".chat");m&&m.lastElementChild?.scrollIntoView({block:"nearest",behavior:"smooth"})}function c(r,n){r.send=n;let m=r.el;m.querySelectorAll("[data-preset]").forEach(u=>u.onclick=()=>n(Qe[+u.dataset.preset].q));let d=m.querySelector("[data-chatform]"),i=d.q;i.oninput=()=>{i.style.height="auto",i.style.height=Math.min(i.scrollHeight,140)+"px"},i.onkeydown=u=>{u.key==="Enter"&&!u.shiftKey&&(u.preventDefault(),n(i.value))},d.onsubmit=u=>{u.preventDefault(),n(i.value)};let l=m.querySelector("[data-clearchat]");l&&(l.onclick=()=>{L=[],Ze(),o(r)}),m.querySelector("[data-extclaude]").onclick=()=>Xe(i.value.trim()||"Analise a agenda e me diga o que \xE9 mais importante agora.")}a.refresh=()=>{let r=document.activeElement;if(r&&a.el.contains(r)&&/INPUT|TEXTAREA|SELECT/.test(r.tagName))return;let n=a.el.scrollTop;a.set(t()),a.el.scrollTop=n}}var aa="seed-v1",oa=[{id:"c_puravida",name:"Pura Vida",color:"#15803D",logoFile:"pura-vida.jpg"},{id:"c_jggarcia",name:"JG Garcia",color:"#16A34A",logoFile:"jg-garcia.jpg"},{id:"c_garciahortifruti",name:"Garcia Hortifruti",color:"#65A30D",logoFile:"garcia-hortifruti.jpg"},{id:"c_tobiasbbq",name:"Tobia's BBQ",color:"#DC2626",logoFile:"tobias-bbq.jpg"},{id:"c_verdeerosa",name:"Verde e Rosa Multimarcas",color:"#DB2777",logoFile:"verde-e-rosa.jpg"},{id:"c_sophiafestas",name:"Sophia Festas",color:"#0284C7",logoFile:"sophia-festas.jpg"}],Ba=async e=>{let t=await(await fetch(e,{cache:"no-cache"})).blob();return new Promise((a,o)=>{let c=new FileReader;c.onload=()=>a(c.result),c.onerror=o,c.readAsDataURL(t)})},et=!1;async function sa(){if(!(et||!s.ready||s.state.settings.some(e=>e.id===aa))){et=!0;try{let e=oa.filter(a=>!s.company(a.id)&&!s.state.companies.some(o=>o.name.trim().toLowerCase()===a.name.toLowerCase())),t=[];for(let a of e){let o=null;try{o=await Ba(`media/logos/${a.logoFile}`)}catch{}t.push({id:a.id,name:a.name,color:a.color,logo:o,instagram:"",address:"",contact:"",notes:"",shareToken:null})}t.length&&await s.upsertMany("companies",t),await s.upsert("settings",{id:aa,done:oa.map(a=>a.id)})}finally{et=!1}}}var na="seed-garcia-nov-2026-v2",Fa=["seed-garcia-nov-2026","seed-garcia-nov-2026-ate14h"],ia="c_garciahortifruti",Va=["domingo","segunda","ter\xE7a","quarta","quinta","sexta","s\xE1bado"],za={"2026-11-09":"Marechal","2026-11-11":"Vila Valqueire","2026-11-13":"Marechal","2026-11-16":"Vila Valqueire","2026-11-18":"Marechal","2026-11-20":"Vila Valqueire","2026-11-23":"Marechal","2026-11-25":"Vila Valqueire","2026-11-27":"Marechal","2026-11-30":"Vila Valqueire"},Ua=[{date:"2026-11-20",text:"Garcia \xB7 Consci\xEAncia Negra: publica\xE7\xE3o institucional respeitosa e representativa."},{date:"2026-11-23",text:"Garcia \xB7 Black Friday (23 a 27/11): campanha principal de ofertas e chamadas di\xE1rias."},{date:"2026-11-28",text:"Garcia \xB7 Esquenta de Natal e ver\xE3o (28 a 30/11): frutas da esta\xE7\xE3o, receitas, saladas e planejamento das compras."}];function Ga(e="2026-11-19",t="2026-11-30"){let a=[];for(let o=new Date(e+"T12:00:00");o<=new Date(t+"T12:00:00");o.setDate(o.getDate()+1)){let c=`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}-${String(o.getDate()).padStart(2,"0")}`,r=o.getDay(),n={date:c,companyId:ia,assignees:["henrique"],status:"pendente",description:"",seedRoutine:2};if([1,3,5].includes(r)){let m=za[c]||"";a.push({...n,id:`e_garcia2_${c}_ceasa`,type:"outro",time:"07:00",duration:210,reminder:30,title:"CEASA",location:"CEASA",internalNote:"CEASA \u2014 07h \xE0s 10h30. Depois segue para a Garcia Hortifruti.",visibleToClient:!1}),a.push({...n,id:`e_garcia2_${c}_gravacao`,type:"captacao",time:"10:30",duration:210,reminder:60,title:`Grava\xE7\xE3o com o Gelado \u2014 ${m||"Garcia"}`,location:m?`Garcia Hortifruti \u2014 ${m}`:"Garcia Hortifruti",internalNote:"Sa\xEDda do CEASA por volta das 10h30. Personagem: Gelado (filmar para Reels, feed e stories). Ajustar conforme abastecimento, pre\xE7os e necessidades da unidade.",visibleToClient:!0})}else if(r===0)a.push({...n,id:`e_garcia2_${c}_plan`,type:"outro",time:"07:00",duration:420,reminder:30,title:"Planejamento da semana",location:"",internalNote:"Planejamento \u2014 07h \xE0s 14h.",visibleToClient:!1});else{let m=r===6;a.push({...n,id:`e_garcia2_${c}_ceasa`,type:"outro",time:"07:00",duration:m?300:420,reminder:30,title:`Somente CEASA (${Va[r]})`,location:"CEASA",internalNote:`Somente CEASA \u2014 07h \xE0s ${m?"12h":"14h"}.`,visibleToClient:!1})}}return a}var tt=!1;async function ra(){if(!(tt||!s.ready||s.state.settings.some(e=>e.id===na))&&s.company(ia)){tt=!0;try{let e=s.state.events.filter(o=>o.seedRoutine===!0||/^e_garcia_\d/.test(o.id)).map(o=>o.id);e.length&&await s.removeMany("events",e,{silent:!0});let t=Ga().filter(o=>!s.event(o.id));t.length&&await s.upsertMany("events",t);let a=Ua.filter(o=>!s.state.notes.some(c=>c.date===o.date&&c.text===o.text)).map(o=>({id:he("n_"),date:o.date,text:o.text,author:"henrique"}));a.length&&await s.upsertMany("notes",a);for(let o of[na,...Fa])await s.upsert("settings",{id:o,done:[]})}finally{tt=!1}}}var V={feed:"Feed",carrossel:"Carrossel",reels:"Reels",story:"Story",captacao:"Capta\xE7\xE3o",reuniao:"Reuni\xE3o",producao:"Edi\xE7\xE3o",outro:"Tarefa"},Ka=["feed","carrossel","reels","story"],Ae=e=>Ka.includes(e),la={feed:"publicar o feed",carrossel:"publicar o carrossel",reels:"postar o Reels",story:"postar o story",captacao:"a capta\xE7\xE3o",reuniao:"a reuni\xE3o",producao:"a edi\xE7\xE3o",outro:"a tarefa"},W=e=>e?e.replace(/^0/,"").replace(":00","h").replace(":","h"):"",Ya=e=>{let[t,a]=String(e).split(":").map(Number);return t*60+a},Ee=e=>Math.round(Date.UTC(+e.slice(0,4),+e.slice(5,7)-1,+e.slice(8,10))/864e5),Te=(e,t)=>new Date(Date.UTC(+e.slice(0,4),+e.slice(5,7)-1,+e.slice(8,10)+t)).toISOString().slice(0,10);function at(e){let t=Number.isFinite(e.reminder)?e.reminder:30,a;return Ae(e.type)?a=[120,30,0,-30]:e.type==="captacao"?a=[1440,120,45,-30]:e.type==="reuniao"?a=[1440,60,15]:a=[30,0],t>=0&&!a.includes(t)&&a.push(t),t<0&&(a=a.filter(o=>o<0)),[...new Set(a)].sort((o,c)=>c-o)}function ca(e,t,a=4){let o=Ee(t.date)*1440+t.minutes,c=[];return e.forEach(r=>{if(!r||!r.time||!r.date||r.status==="feito")return;let n=Ee(r.date)*1440+Ya(r.time);at(r).forEach(m=>{if(m<0&&r.status!=="pendente")return;let d=n-m;d<=o&&d>o-a&&c.push({ev:r,offset:m})})}),c}var Wa=(e,t)=>{let a=Ee(e)-Ee(t.date);return a===0?"hoje":a===1?"amanh\xE3":a===-1?"ontem":`${["domingo","segunda","ter\xE7a","quarta","quinta","sexta","s\xE1bado"][new Date(Date.UTC(+e.slice(0,4),+e.slice(5,7)-1,+e.slice(8,10))).getUTCDay()]}, ${e.slice(8,10)}/${e.slice(5,7)}`},Ja=e=>{if(e>=60){let t=Math.floor(e/60),a=e%60;return a?`${t}h${String(a).padStart(2,"0")}`:`${t}h`}return`${e} min`};function je(e,t,a=""){let o=`${V[e.type]||"Tarefa"}${a?" \xB7 "+a:""}`,c=e.title?`\u201C${e.title}\u201D`:"",r=W(e.time),n=e.location?` \xB7 ${e.location}`:"";return t>=1440?{title:`Amanh\xE3: ${o} \xE0s ${r}`,body:e.type==="captacao"?`Hoje: carregue baterias, esvazie os cart\xF5es e confirme com o cliente.${n}`:`${c}${n}`.trim()||"Confirme o hor\xE1rio com o cliente."}:t>0?{title:`Daqui a ${Ja(t)}: ${o}`,body:`${r} \u2014 ${la[e.type]||"a tarefa"}${c?" "+c:""}${n}`}:t===0?{title:`Agora: ${o}`,body:`Est\xE1 na hora de ${la[e.type]||"fazer a tarefa"}${c?" "+c:""}.`}:{title:Ae(e.type)?`J\xE1 postou? ${o}`:`J\xE1 fez? ${o}`,body:`Era \xE0s ${r}${c?" \u2014 "+c:""}. Toque para marcar como feito.`}}function Ce(e,t,{actor:a="Algu\xE9m",company:o="",recipient:c=null,now:r}={}){let m=`${V[(t||e).type]||"Tarefa"}${o?" \xB7 "+o:""}`,d=g=>`${Wa(g.date,r)}${g.time?", "+W(g.time):""}`,i=g=>c&&(g.assignees||[]).includes(c);if(!e&&t)return{title:i(t)?`${a} marcou para voc\xEA`:`${a} adicionou na agenda`,body:`${m} \u2014 ${d(t)}${t.title?" \xB7 "+t.title:""}`};if(e&&!t)return{title:`${a} removeu da agenda`,body:`${m} \u2014 ${d(e)}`};if(e.status!=="feito"&&t.status==="feito")return{title:`${a} concluiu \u2713`,body:`${m} \u2014 ${d(t)}`};let l=i(e),u=i(t);return!l&&u?{title:`${a} passou para voc\xEA`,body:`${m} \u2014 ${d(t)}${t.title?" \xB7 "+t.title:""}`}:l&&!u?{title:`${a} assumiu uma tarefa sua`,body:`${m} \u2014 ${d(t)}`}:e.date!==t.date||e.time!==t.time?{title:`${a} mudou o hor\xE1rio`,body:`${m}: ${d(e)} \u2192 ${d(t)}`}:null}function da(e,t,a,o){if(!a.length)return null;let c=[...a].sort((l,u)=>(l.time||"99").localeCompare(u.time||"99")),r=c.find(l=>l.time)||c[0],n=c.filter(l=>Ae(l.type)).length,m=c.filter(l=>l.type==="captacao"||l.type==="reuniao"),d=l=>`${W(l.time)} ${V[l.type]}${o(l)?" \xB7 "+o(l):""}`,i=[`${c.length} tarefa${c.length>1?"s":""} (${n} post${n===1?"":"s"})`,`primeira: ${d(r)}`];return m.length&&i.push(`sai para ${m.map(l=>`${o(l)||V[l.type]} \xE0s ${W(l.time)}`).join(" e ")}`),e==="morning"?{title:`Bom dia, ${t}! Seu dia hoje`,body:i.join(" \xB7 ")}:{title:`${t}, amanh\xE3 voc\xEA tem ${c.length} tarefa${c.length>1?"s":""}`,body:i.slice(1).join(" \xB7 ")}}var J=e=>s.member(e)?.name||"Algu\xE9m",N=e=>s.company(e)?.name||"",ot=()=>{let e=new Date;return{date:_(),minutes:e.getHours()*60+e.getMinutes()}},ma=(e,t)=>Date.parse(`${e}T${t}:00-03:00`),it=()=>s.mode==="cloud"&&!!ve()&&!!s.me,st=null,ua=e=>st=e;function nt(e,t,a,o="./",c=!1){return!t||!e.length?Promise.resolve(null):ce("/notify",{to:e,title:t.title,body:t.body,tag:a,url:o,includeSelf:c}).catch(r=>(console.warn("aviso",r.message),{error:r.message}))}var De=e=>{let t=_();return`${e.date===t?"hoje":e.date===k(t,1)?"amanh\xE3":`${e.date.slice(8,10)}/${e.date.slice(5,7)}`}${e.time?", "+e.time.replace(":00","h").replace(":","h").replace(/^0/,""):""}`};function ha(e,t){if(!it())return;let a=t||e,o=`${V[a.type]||"Tarefa"}${N(a.companyId)?" \xB7 "+N(a.companyId):""}`,c=(a.assignees||[]).map(J).join(" e ")||"sem respons\xE1vel",r=i=>({title:`${i} alterou: ${o}`,body:`${De(a)}${a.title?" \xB7 "+a.title:""} \xB7 ${c}`}),m=s.team.map(i=>i.id).filter(i=>i!==s.me).map(i=>{let l=Ce(e,t,{actor:J(s.me),company:N(a.companyId),recipient:i,now:ot()})||r(J(s.me));return nt([i],l,`ev-${a.id}`,`./#/e/${a.id}`).then(u=>({r:i,d:u}))}),d;!e&&t?d={title:`Novo na agenda: ${o}`,body:`${De(t)}${t.title?" \xB7 "+t.title:""} \xB7 ${c}`}:e&&t&&(e.date!==t.date||e.time!==t.time)?d={title:`Hor\xE1rio alterado: ${o}`,body:`${De(e)} \u2192 ${De(t)} \xB7 ${c}`}:d=Ce(e,t,{actor:"Voc\xEA",company:N(a.companyId),recipient:null,now:ot()})||r("Voc\xEA"),nt([s.me],d,`ev-${a.id}`,t?`./#/e/${a.id}`:"./",!0),m.length&&st&&Promise.all(m).then(i=>{let l=i.filter(y=>y.d&&!y.d.error&&y.d.results&&!y.d.results[y.r]).map(y=>J(y.r)),u=i.find(y=>y.d&&y.d.error),g=i.filter(y=>y.d&&y.d.results&&y.d.results[y.r]).map(y=>J(y.r));st({ok:g,missing:l,error:u?.d.error})}),te()}function fa(e){if(!it())return;let t=s.team.map(c=>c.id).filter(c=>c!==s.me),a=J(s.me),o=null;if(e.kind==="deleted"&&e.events?.length){let c=e.events[0];o=e.events.length===1?Ce(c,null,{actor:a,company:N(c.companyId),now:ot()}):{title:`${a} removeu ${e.events.length} itens da agenda`,body:`${N(c.companyId)?N(c.companyId)+" \xB7 ":""}a partir de ${c.date.slice(8,10)}/${c.date.slice(5,7)}`}}else e.kind==="series"?o={title:`${a} adicionou ${e.count} itens repetidos`,body:`${e.label||""}${N(e.sample?.companyId)?" \xB7 "+N(e.sample.companyId):""}`}:e.kind==="series-edit"?o={title:`${a} alterou ${e.count} itens repetidos`,body:`${e.label||""}${N(e.sample?.companyId)?" \xB7 "+N(e.sample.companyId):""}`}:e.kind==="import"&&(o={title:`${a} importou a agenda`,body:`${e.count||0} itens atualizados.`});nt(s.team.map(c=>c.id),o,`act-${e.id||Date.now()}`,"./",!0),te()}function Qa(e=Date.now()){let t=[],a=k(_(),-1),o=k(_(),4),c=s.eventsBetween(a,o).filter(n=>n.time&&n.status!=="feito"),r=(n,m)=>s.eventsOn(m,{person:n}).filter(d=>d.status!=="feito").length;c.forEach(n=>{let m=ma(n.date,n.time);at(n).forEach(d=>{if(d<0&&n.status!=="pendente")return;let i=m-d*6e4;if(i<e-10*6e4||i>e+4*864e5)return;let l=je(n,d,N(n.companyId)),u=(n.assignees||[]).map(J).join(" e ");s.team.map(g=>g.id).forEach(g=>t.push({id:`r_${n.id}_${d}_${n.date}${n.time.replace(":","")}_${g}`,at:i,member:g,title:l.title,body:u&&!(n.assignees.length===1&&n.assignees[0]===g)?`${l.body} \xB7 ${u}`:l.body,tag:`rem-${n.id}`,url:`./#/e/${n.id}`,kind:"reminders",badge:r(g,n.date)}))})});for(let n=0;n<4;n++){let m=k(_(),n);s.team.forEach(d=>{[["morning",m,"08:00"],["evening",k(m,1),"20:00"]].forEach(([i,l,u])=>{let g=ma(m,u);if(g<e-10*6e4)return;let y=s.eventsOn(l,{person:d.id}).filter(b=>b.status!=="feito"),D=da(i,d.name,y,b=>N(b.companyId));D&&t.push({id:`d_${i}_${l}_${d.id}`,at:g,member:d.id,title:D.title,body:D.body,tag:`daily-${i}`,url:"./",kind:"daily",badge:r(d.id,l)})})})}return t.sort((n,m)=>n.at-m.at)}var pa="",te=kt(async()=>{if(!it())return;let e=Qa(),t=JSON.stringify(e.map(a=>[a.id,a.at,a.title,a.body]));if(t!==pa)try{await ce("/schedule",{items:e}),pa=t}catch(a){console.warn("lista de lembretes",a.message)}},3e3);var ga=["domingo","segunda","ter\xE7a","quarta","quinta","sexta","s\xE1bado"],ba=e=>ga[new Date(Date.UTC(+e.slice(0,4),+e.slice(5,7)-1,+e.slice(8,10))).getUTCDay()],Xa={pendente:"a fazer",pronto:"pronto/agendado",feito:"feito"};function $a({events:e,companies:t,routine:a,notes:o,team:c,me:r,now:n}){let m=new Map(t.map(b=>[b.id,b.name])),d=b=>c.find(I=>I.id===b)?.name||b,i=Te(n.date,-7),l=Te(n.date,30),u=e.filter(b=>b.date>=i&&b.date<=l).sort((b,I)=>(b.date+(b.time||"")).localeCompare(I.date+(I.time||""))),g=[];g.push(`Agora: ${ba(n.date)}, ${n.date.split("-").reverse().join("/")}, ${W(`${String(Math.floor(n.minutes/60)).padStart(2,"0")}:${String(n.minutes%60).padStart(2,"0")}`)} (hor\xE1rio de Bras\xEDlia).`),g.push(`Quem pergunta: ${d(r)}. Equipe: ${c.map(b=>b.name).join(" e ")}.`),a&&g.push(`Rotina combinada: expediente ${a.workStart}\u2013${a.workEnd}, almo\xE7o ${a.lunchStart}\u2013${a.lunchEnd}, folga: ${(a.daysOff||[]).map(b=>ga[b]).join(", ")||"nenhuma"}, deslocamento m\xEDnimo ${a.travelMin} min, m\xE1ximo ${a.maxTasks} tarefas por pessoa/dia.`),g.push(`Empresas clientes: ${t.map(b=>b.name+(b.instagram?` (@${b.instagram})`:"")+(b.address?` \u2014 endere\xE7o: ${b.address}`:"")+(b.notes?` \u2014 observa\xE7\xF5es: ${b.notes}`:"")).join("; ")||"nenhuma"}.`),g.push("",`Agenda (de ${i.split("-").reverse().join("/")} a ${l.split("-").reverse().join("/")}):`);let y="";u.forEach(b=>{b.date!==y&&(g.push(`
${ba(b.date)} ${b.date.split("-").reverse().join("/")}:`),y=b.date);let I=b.duration?` (${b.duration} min)`:"",w=(b.assignees||[]).map(d).join(" e ")||"sem respons\xE1vel";g.push(`- ${b.time?W(b.time):"sem hor\xE1rio"}${I} \xB7 ${V[b.type]||b.type} \xB7 ${m.get(b.companyId)||"?"} \xB7 "${b.title||""}" \xB7 ${w} \xB7 ${Xa[b.status]||b.status}${b.location?" \xB7 local: "+b.location:""}${b.description?" \xB7 legenda: "+b.description.slice(0,160):""}${b.internalNote?" \xB7 nota interna: "+b.internalNote.slice(0,160):""}`)}),u.length||g.push("(nenhum compromisso)");let D=(o||[]).filter(b=>b.date>=Te(n.date,-2)).slice(-10);return D.length&&g.push("","Bilhetes recentes da dupla:",...D.map(b=>`- ${b.date.split("-").reverse().join("/")} ${d(b.author)}: ${b.text}`)),g.join(`
`)}var O=document.getElementById("app");window.__calStarted=!0;var Q=null;function Za(){O.innerHTML=`
    <main id="view" class="view"></main>
    <nav class="tabbar" aria-label="Navega\xE7\xE3o">
      ${Me("hoje","today","Hoje")}
      ${Me("mes","calendar","Calend\xE1rio")}
      <button class="tabbar__fab" data-action="new-event" aria-label="Novo evento">${p("plus",28)}</button>
      ${Me("empresas","building","Empresas")}
      ${Me("ajustes","settings","Ajustes")}
    </nav>`}var Me=(e,t,a)=>`<button class="tabbar__btn" data-action="tab" data-tab="${e}">${p(t,24)}<span>${a}</span></button>`;function C(){let e=document.getElementById("view");if(!e)return;let t=window.scrollY,a=e.querySelector('[data-form="note"] input'),o=a?a.value:"",c=a&&document.activeElement===a,r=f.tab==="mes"?Gt():f.tab==="empresas"?Pt():f.tab==="ajustes"?Jt():Ut();e.innerHTML=r,document.querySelectorAll(".tabbar__btn").forEach(m=>m.classList.toggle("is-on",m.dataset.tab===f.tab)),window.scrollTo(0,t);let n=e.querySelector('[data-form="note"] input');n&&o&&(n.value=o),n&&c&&n.focus({preventScroll:!0}),ao()}function eo(){C(),Ve().forEach(e=>e.refresh&&e.refresh())}function de(e){f.tab=e,Re(),C(),window.scrollTo(0,0)}var to={tab:e=>de(e.dataset.tab),"set-person":e=>{f.person=e.dataset.p,Re(),C()},"set-date":e=>{f.date=e.dataset.k,C()},"go-today":()=>{f.date=_(),C()},week:e=>{f.date=k(f.date,Number(e.dataset.n)),C()},month:e=>{f.month=Pe(f.month,Number(e.dataset.n)),f.monthSel=f.month===se(_())?_():`${f.month}-01`,C()},"month-today":()=>{f.month=se(_()),f.monthSel=_(),C()},"month-select":e=>{f.monthSel=e.dataset.k,se(e.dataset.k)!==f.month&&(f.month=se(e.dataset.k)),C()},"month-company":e=>{f.monthCompany=e.dataset.id||null,C()},"open-day":e=>{f.date=e.dataset.k,de("hoje")},"toggle-tips":()=>{f.showAllTips=!f.showAllTips,C()},"open-event":e=>ge(e.dataset.id),assistant:()=>ta(),"apply-fix":async e=>{let t=s.event(e.dataset.id);if(!t)return;let a;try{a=JSON.parse(e.dataset.patch)}catch{return}let o={};typeof a.time=="string"&&/^\d{2}:\d{2}$/.test(a.time)&&(o.time=a.time),Array.isArray(a.assignees)&&(o.assignees=a.assignees.filter(n=>s.member(n)));let{confirmMove:c}=await import("./c-XEU75X6K.js");if(!await c(t,o))return;let r={...t};await s.upsert("events",{...t,...o}),v("Pronto, ajustado",{action:"Desfazer",onAction:()=>s.upsert("events",r)})},"toggle-done":async e=>{let t=s.event(e.dataset.id);if(!t)return;let a=t.status==="feito"?"pendente":"feito";await s.upsert("events",{...t,status:a}),a==="feito"&&v(`${A[t.type].label} conclu\xEDdo`,{action:"Desfazer",onAction:()=>s.upsert("events",{...s.event(t.id),status:t.status})})},"new-event":e=>{if(!s.state.companies.length)return v("Cadastre uma empresa primeiro"),Ge(null,()=>ze({}));ze({date:e.dataset.date||null})},"open-company":e=>It(e.dataset.id),"new-company":()=>Ge(),"del-note":async e=>{let t=s.state.notes.find(a=>a.id===e.dataset.id);await s.remove("notes",e.dataset.id),t&&v("Bilhete apagado",{action:"Desfazer",onAction:()=>s.upsert("notes",t)})},"set-me":e=>{s.setMe(e.dataset.p),v(`Ol\xE1, ${s.member(e.dataset.p).name}!`)},"clear-demo":async()=>{await re({title:"Apagar os dados de exemplo?",text:"O calend\xE1rio ficar\xE1 vazio para voc\xEAs cadastrarem as empresas e eventos reais.",ok:"Apagar exemplos",danger:!0})&&(await s.clearDemo(),v("Pronto! Agora cadastre suas empresas."))},"clear-all":()=>H.clearAll(),ics:e=>H.ics(e),"notify-enable":()=>H.notifyEnable(),"notify-test":()=>H.notifyTest(),"onboarding-again":()=>H.onboardingAgain(),export:()=>H.export(),logout:async()=>{await re({title:"Sair da conta?",ok:"Sair"})&&(await Q.signOut(),location.reload())}};document.addEventListener("click",e=>{let t=e.target.closest("[data-action]");if(!t||document.body.classList.contains("is-client"))return;let a=to[t.dataset.action];a&&(e.preventDefault(),e.stopPropagation(),a(t))});document.addEventListener("change",e=>{e.target.matches('[data-action-change="import"]')&&H.import(e.target),e.target.closest("[data-notify-form]")&&H.notifyPrefs(e.target.closest("[data-notify-form]")),e.target.closest("[data-routine-form]")&&H.routine(e.target.closest("[data-routine-form]"))});document.addEventListener("submit",async e=>{let t=e.target.closest('[data-form="note"]');if(!t)return;e.preventDefault();let a=t.text.value.trim();if(a){if(!s.me){v("Escolha quem voc\xEA \xE9 em Ajustes");return}await s.upsert("notes",{id:he("n_"),date:f.date,text:a,author:s.me}),v("Bilhete adicionado")}});function ao(){document.querySelectorAll("[data-swipe]").forEach(e=>{let t=null,a=null;e.addEventListener("touchstart",o=>{t=o.touches[0].clientX,a=o.touches[0].clientY},{passive:!0}),e.addEventListener("touchend",o=>{if(t==null)return;let c=o.changedTouches[0].clientX-t,r=o.changedTouches[0].clientY-a;if(t=null,Math.abs(c)<50||Math.abs(c)<Math.abs(r)*1.5)return;let n=c<0?1:-1;e.dataset.swipe==="week"?f.date=k(f.date,7*n):(f.month=Pe(f.month,n),f.monthSel=`${f.month}-01`),C()})})}var va=new Set;function ya(){if(!s.me)return;let e=new Date,t={date:_(),minutes:e.getHours()*60+e.getMinutes()},a=s.eventsBetween(k(t.date,-1),k(t.date,1),{person:s.me}),o=s.mode==="cloud"&&!!localStorage.getItem("pauta.device");ca(a,t,2).forEach(({ev:c,offset:r})=>{let n=`${c.id}@${r}@${c.date}${c.time}`;if(va.has(n))return;va.add(n);let m=je(c,r,s.company(c.companyId)?.name||"");v(`${m.title}`,{ms:7e3,action:"Ver",onAction:()=>ge(c.id)}),!o&&K()==="granted"&&navigator.serviceWorker&&navigator.serviceWorker.ready.then(d=>d.showNotification(m.title,{body:m.body,tag:`rem-${c.id}`,icon:"icons/icon-192.png",badge:"icons/icon-192.png",data:{url:`./#/e/${c.id}`}})).catch(()=>{})}),Ke(s.eventsOn(t.date,{person:s.me}).filter(c=>c.status!=="feito").length)}function dt(e=location.hash){let t=/^#\/(e|d)\/([\w-]+)/.exec(e||"");return t?(history.replaceState(null,"",location.pathname+location.search),t[1]==="e"&&s.event(t[2])?(f.date=s.event(t[2]).date,de("hoje"),ge(t[2])):t[1]==="d"&&/^\d{4}-\d{2}-\d{2}$/.test(t[2])&&(f.date=t[2],de("hoje")),!0):!1}var wa={"auth/invalid-credential":"E-mail ou senha incorretos. Confira a senha (toque no olho para ver o que digitou).","auth/wrong-password":"Senha incorreta.","auth/user-not-found":"Este e-mail n\xE3o est\xE1 cadastrado no Firebase (Authentication \u2192 Usu\xE1rios).","auth/invalid-email":"E-mail inv\xE1lido.","auth/too-many-requests":'Muitas tentativas seguidas. Espere alguns minutos ou use "Esqueci minha senha".',"auth/network-request-failed":"Sem conex\xE3o com a internet. Verifique o Wi-Fi/4G e tente de novo.","auth/user-disabled":"Este usu\xE1rio foi desativado no Firebase.","auth/operation-not-allowed":"O login por e-mail/senha n\xE3o est\xE1 ativado no Firebase.","auth/api-key-not-valid":"Configura\xE7\xE3o do Firebase inv\xE1lida (apiKey)."},_a="",ct="";function qe(e=""){let t=e||ct;O.innerHTML=`
  <div class="login">
    <img src="icons/icon-192.png" alt="" width="84" height="84">
    <h1>${h(T.appName)}</h1>
    <p>Agenda de conte\xFAdo \xB7 ${h(T.agencyName)}</p>
    <form class="form" data-login novalidate>
      <div class="fgroup"><label class="flabel" for="l-email">E-mail</label><input id="l-email" class="input" type="email" name="email" value="${h(_a)}" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" inputmode="email"></div>
      <div class="fgroup"><label class="flabel" for="l-pass">Senha</label>
        <div class="input-eye"><input id="l-pass" class="input" type="password" name="pass" autocomplete="current-password" autocapitalize="none" autocorrect="off" spellcheck="false">
        <button type="button" class="iconbtn iconbtn--sm" data-eye aria-label="Mostrar senha">${p("eye",18)}</button></div>
      </div>
      ${t?`<p class="login__err">${h(t)}</p>`:""}
      <button class="btn btn--primary btn--block" type="submit" data-go>Entrar</button>
      <button class="btn-text btn-text--sm" type="button" data-reset>Esqueci minha senha</button>
    </form>
  </div>`;let a=O.querySelector("[data-login]");O.querySelector("[data-eye]").onclick=()=>{a.pass.type=a.pass.type==="password"?"text":"password"},a.onsubmit=async o=>{o.preventDefault();let c=a.email.value.trim().toLowerCase(),r=a.pass.value;if(_a=c,ct="",!c||!r)return qe("Preencha o e-mail e a senha.");let n=a.querySelector("[data-go]");n.disabled=!0,n.textContent="Entrando\u2026";try{await Promise.race([Q.signIn(c,r),new Promise((m,d)=>setTimeout(()=>d({code:"timeout"}),2e4))]),n.textContent="Abrindo\u2026"}catch(m){let d=m&&m.code;qe(d==="timeout"?"O servidor demorou para responder. Verifique a internet e tente de novo.":wa[d]||`N\xE3o foi poss\xEDvel entrar (${d||m?.message||"erro desconhecido"}).`)}},O.querySelector("[data-reset]").onclick=async()=>{let o=a.email.value.trim().toLowerCase();if(!o)return v("Digite seu e-mail primeiro");try{await Q.resetPassword(o),v("Enviamos um e-mail para criar uma nova senha (veja tamb\xE9m o spam)",{ms:6e3})}catch(c){v(wa[c?.code]||"N\xE3o foi poss\xEDvel enviar o e-mail")}}}function ka(e){document.querySelector("[data-login]")||document.getElementById("view")||(O.innerHTML=`<div class="splash">
    <img src="icons/icon-192.png" alt="" width="72" height="72">
    <h2>N\xE3o consegui conectar</h2>
    <p>Verifique a internet e tente de novo.</p>
    <button class="btn btn--primary" data-retry>Tentar de novo</button>
    <small class="muted">Detalhe: ${h(String(e&&(e.code||e.message)||e))}</small>
  </div>`,O.querySelector("[data-retry]").onclick=()=>location.reload())}function rt(e="Carregando\u2026"){O.innerHTML=`<div class="splash"><img src="icons/icon-192.png" alt="" width="72" height="72"><p>${h(e)}</p></div>`}function Sa(){Za(),C(),s.on(eo),s.onError=e=>{let t=e&&/quota/i.test(String(e.name||e.message)),a=e&&/permission/i.test(String(e.code||e.message));v(t?"Mem\xF3ria do aparelho cheia: use logos menores ou ative a nuvem":a?"Sem permiss\xE3o na nuvem: confira as regras do Firebase":"N\xE3o foi poss\xEDvel salvar. Verifique a conex\xE3o.",{ms:5e3})},xa(),s.on(xa),s.on(()=>Ke(s.me?s.eventsOn(_(),{person:s.me}).filter(e=>e.status!=="feito").length:0)),setInterval(()=>{let e=document.activeElement,t=e&&/INPUT|TEXTAREA|SELECT/.test(e.tagName);f.tab==="hoje"&&!Ve().length&&!t&&C(),ya()},6e4),ya(),document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&(f.date<_()&&f.tab==="hoje"&&(f.date=_()),C())}),s.mode==="cloud"&&ve()&&(s.hooks.eventChange=ha,ua(({ok:e,missing:t,error:a})=>{if(a)return v(`Aviso n\xE3o enviado: ${a}`,{ms:6e3});if(t.length)return v(`${t.join(" e ")} ainda n\xE3o ativou as notifica\xE7\xF5es no celular (Ajustes \u2192 Notifica\xE7\xF5es \u2192 Ativar)`,{ms:8e3});e.length&&v(`Aviso enviado para ${e.join(" e ")} \u2713`,{ms:3500})}),s.hooks.activity=fa,s.hooks.ask=async(e,t)=>{let a=new Date,o=$a({events:s.state.events,companies:s.state.companies,routine:P(),notes:s.state.notes,team:s.team,me:s.me,now:{date:_(),minutes:a.getHours()*60+a.getMinutes()}});return(await ce("/ask",{question:e,history:t,context:o})).answer},s.on(te),te(),setInterval(te,15*6e4)),sa().then(()=>setTimeout(()=>ra().catch(e=>console.warn("rotina",e)),1500)).catch(e=>console.warn("pr\xE9-cadastro",e)),setTimeout(Yt,600),s.mode==="cloud"&&K()==="granted"&&Rt().catch(()=>{}),setTimeout(()=>dt(),300)}var lt=null;function xa(){if(!s.me)return;let e=Ft(s.me,14),t=o=>o.date+":"+o.ids.slice().sort().join("|"),a=new Set(e.map(t));if(lt){let o=e.find(c=>!lt.has(t(c))&&c.ids.some(r=>s.event(r)?.updatedBy&&s.event(r).updatedBy!==s.me));o&&v(`Aten\xE7\xE3o: ${o.title} (${o.date.slice(8)}/${o.date.slice(5,7)})`,{action:"Ver",onAction:()=>{f.date=o.date,f.person="all",de("hoje")},ms:7e3})}lt=a}async function oo(){let e=location.hash||"",t=T.firebase;if(e.startsWith("#/c/")||e.startsWith("#/v/")){rt("Carregando cronograma\u2026");let r=!!(localStorage.getItem("pauta.me")||localStorage.getItem("cal.team"));try{if(e.startsWith("#/v/")){let d=await St(e.slice(4));return Ue(O,Le(d),{canGoBack:r})}if(!t)return $e(O,"Este link precisa da sincroniza\xE7\xE3o na nuvem ativada.");let{fetchPublic:n}=await import("./c-43VYY7Q5.js"),m=await n(t,e.slice(4));return m?Ue(O,Le(m),{canGoBack:r}):$e(O,"Este link n\xE3o existe mais. Pe\xE7a um novo link para a equipe.")}catch(n){return console.error(n),$e(O,"N\xE3o foi poss\xEDvel abrir o cronograma. Verifique a conex\xE3o e tente novamente.")}}if(!t)return await At(),Sa();rt("Conectando \xE0 nuvem\u2026");let a=(r,n)=>Promise.race([r,new Promise((m,d)=>setTimeout(()=>d(new Error("tempo esgotado")),n))]);try{let{connect:r}=await import("./c-43VYY7Q5.js");Q=await a(r(t),15e3)}catch(r){return console.error(r),ka(r)}let o=!1,c=!1;setTimeout(()=>{o||ka(new Error("o login n\xE3o respondeu"))},25e3),Q.onUser(async r=>{if(o=!0,!r)return c?location.reload():qe();if(c)return;if(!T.team.some(m=>m.email&&m.email.toLowerCase()===(r.email||"").toLowerCase()))return ct=`O e-mail ${r.email} n\xE3o faz parte da equipe deste app.`,await Q.signOut(),qe();c=!0;try{localStorage.setItem("cal.team","1")}catch{}rt("Entrando\u2026");try{await Promise.race([Tt(Q.backend,r),new Promise(m=>setTimeout(m,12e3))])}catch(m){console.error(m),setTimeout(()=>v("N\xE3o consegui carregar os dados agora. Verifique a internet.",{ms:6e3}),800)}Sa()})}navigator.serviceWorker?.addEventListener("message",e=>{if(e.data?.type==="open"&&e.data.url){let t=e.data.url.split("#")[1];t&&dt("#"+t)}});window.addEventListener("hashchange",()=>{if(/^#\/(e|d)\//.test(location.hash))return dt();/^#\/(c|v)\//.test(location.hash)&&location.reload()});"serviceWorker"in navigator&&location.protocol!=="file:"&&navigator.serviceWorker.register("sw.js").catch(()=>{});oo();
