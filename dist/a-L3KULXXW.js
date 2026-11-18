import{A as De,C as gt,D as vt,E as Ce,a as nt,b as s,c as ct,d as lt,e as f,f as Ee,g as M,h as dt,i as Ae,j as Te,k as je,l as mt,m as Me,n as pt,o as g,p as te,q as ut,r as P,s as z,t as D,u as ft,v as J,w as ht,x as ae,y as bt,z as me}from"./c-5JWPJPNQ.js";import{f as Se}from"./c-UCGQCTUQ.js";import{a as qe,b as pe}from"./c-2EU3FN6S.js";import{A as u,C as st,G as W,H as p,a as We,b as H,c as $,d as x,e as Je,f as X,g as ke,h as Ye,i as T,j as re,k as I,l as _,m as Ge,n as K,o as Qe,p as ce,q as Z,r as Xe,s as Ze,t as et,u as le,v as F,w as tt,x as at,y as ot}from"./c-SIJUFJQD.js";import{a as S,b as it,c as ee,d as de,l as xe,m as rt}from"./c-3GA6RSWB.js";import{a as E}from"./c-2FOMEGLL.js";import"./c-VHNSBD2M.js";var ea=(e,t)=>e&&t&&e[0]<t[1]&&t[0]<e[1],U=e=>s.member(e)?.name||e,ue=e=>["shoot","meeting"].includes(S[e.type]?.kind);function fe(e,t){let a=[],o=P(),l=s.eventsOn(t,{person:e}).filter(i=>i.time&&i.status!=="feito");for(let i=0;i<l.length;i++)for(let m=i+1;m<l.length;m++){let d=l[i],r=l[m];if(!ea(z(d),z(r)))continue;let c=ue(d)?d:ue(r)?r:null,h=c===d?r:d,y,A;c&&ee(h.type)?(y=`${U(e)}: post durante ${S[c.type].label.toLowerCase()}`,A=`\u201C${D(h)}\u201D \xE0s ${_(h.time)} cai no meio de \u201C${D(c)}\u201D (${_(c.time)}\u2013${_(re(z(c)[1]))}).`):c&&ue(h)?(y=`${U(e)} em dois lugares ao mesmo tempo`,A=`\u201C${D(d)}\u201D (${_(d.time)}) e \u201C${D(r)}\u201D (${_(r.time)}) se sobrep\xF5em.`):(y=`${U(e)}: duas tarefas no mesmo hor\xE1rio`,A=`\u201C${D(d)}\u201D (${_(d.time)}) e \u201C${D(r)}\u201D (${_(r.time)}).`),a.push({level:"warn",kind:"conflict",icon:"alert",ids:[d.id,r.id],title:y,text:A,fixes:ht(e,d,r)})}let n=l.filter(ue);for(let i=0;i<n.length-1;i++){let m=n[i],d=n[i+1],r=T(d.time)-z(m)[1];(m.location||m.companyId)!==(d.location||d.companyId)&&r>=0&&r<o.travelMin&&a.push({level:"warn",kind:"conflict",icon:"route",ids:[m.id,d.id],title:`${U(e)}: pouco tempo de deslocamento`,text:`S\xF3 ${r} min entre \u201C${D(m)}\u201D e \u201C${D(d)}\u201D, em lugares diferentes (combinado: ${o.travelMin} min).`,fixes:[{label:`Mover para ${_(re(z(m)[1]+o.travelMin))}`,eventId:d.id,patch:{time:re(Math.ceil((z(m)[1]+o.travelMin)/15)*15)}}]})}return a}function $t(e,t="all"){let a=[],o=t==="all"?s.team.map(r=>r.id):[t];o.forEach(r=>a.push(...fe(r,e)));let l=P(),n=s.eventsOn(e,{person:t}),i={};if(n.filter(r=>r.time&&["feed","reels","carrossel"].includes(r.type)).forEach(r=>(i[r.companyId]||=[]).push(r)),Object.values(i).forEach(r=>{for(let c=0;c<r.length-1;c++){let h=T(r[c+1].time)-T(r[c].time);h<180&&a.push({level:"info",icon:"clock",ids:[r[c].id,r[c+1].id],title:`${s.company(r[c].companyId)?.name||"Empresa"}: posts muito pr\xF3ximos`,text:`Dois posts de feed/Reels com s\xF3 ${F(h)} de diferen\xE7a. Espacem ao menos 3 h para um n\xE3o \u201Croubar\u201D o alcance do outro.`})}}),e===$()){let r=n.filter(c=>c.time&&c.status==="pendente"&&T(c.time)+15<I());r.length&&a.unshift({level:"warn",kind:"late",icon:"flag",ids:r.map(c=>c.id),title:r.length===1?"1 tarefa atrasada":`${r.length} tarefas atrasadas`,text:r.map(c=>`${_(c.time)} ${D(c)}`).join(" \xB7 ")+". Marque como feito ou reagende."})}let m=n.filter(r=>!(r.assignees||[]).length);if(m.length&&t==="all"&&a.push({level:"warn",icon:"user",ids:m.map(r=>r.id),title:"Tarefa sem respons\xE1vel",text:m.map(r=>`${_(r.time)} ${D(r)}`).join(" \xB7 ")+". Definam quem vai fazer."}),t==="all"&&s.team.length===2){let[r,c]=s.team,h=s.eventsOn(e,{person:r.id}).length,y=s.eventsOn(e,{person:c.id}).length;if(Math.abs(h-y)>=4){let[A,B]=h>y?[r,c]:[c,r];a.push({level:"info",icon:"users",title:"Dia desequilibrado",text:`${A.name} tem ${Math.max(h,y)} tarefas e ${B.name} tem ${Math.min(h,y)}. Que tal passar alguns stories para o ${B.name}?`})}}o.forEach(r=>{let c=J(r,e),h=s.eventsOn(e,{person:r}).length;!c.dayOff&&c.minutes!=null&&h&&c.longest<45&&a.push({level:"info",kind:"rest",icon:"clock",title:`${U(r)} est\xE1 sem pausa`,text:`O maior intervalo livre do dia \xE9 de ${F(c.longest)}. Programem posts com anteced\xEAncia para abrir espa\xE7o.`}),c.dayOff&&h&&a.push({level:"info",kind:"rest",icon:"clock",title:`${U(r)}: dia de folga`,text:`H\xE1 ${h} tarefa${h>1?"s":""} marcada${h>1?"s":""} na folga. Posts podem ficar programados para ningu\xE9m trabalhar.`}),h>l.maxTasks&&a.push({level:"warn",kind:"rest",icon:"alert",title:`${U(r)} sobrecarregado`,text:`${h} tarefas (limite combinado: ${l.maxTasks}).`})}),s.eventsOn(x(e,1),{person:t}).filter(r=>r.type==="captacao").forEach(r=>{let c=s.company(r.companyId);a.push({level:"prep",icon:"camera",ids:[r.id],title:`Amanh\xE3: capta\xE7\xE3o${c?" na "+c.name:""} \xE0s ${_(r.time)}`,text:"Hoje: carregue baterias, esvazie cart\xF5es de mem\xF3ria, confirme o hor\xE1rio com o cliente e defina o roteiro de tomadas."})}),!a.some(r=>r.kind==="conflict")&&n.length&&a.push({level:"ok",icon:"check",title:"Agenda sem conflitos",text:"Ningu\xE9m est\xE1 em dois lugares ao mesmo tempo."});let d=Math.abs(Ye("2024-01-01",e))%xe.length;return a.push({level:"tip",icon:"bulb",title:"Dica do dia",text:xe[d]}),a}function yt(e,t=14){let a=[],o=$();for(let l=0;l<t;l++){let n=x(o,l);fe(e,n).forEach(i=>a.push({...i,date:n}))}return a}function wt(e="all"){let t=$(),a=I();return s.eventsOn(t,{person:e}).find(o=>o.time&&o.status!=="feito"&&T(o.time)+de(o)>a)||null}function _t(){return`<div class="seg" role="tablist">
    ${[{id:"all",name:"Todos"},...s.team].map(t=>`<button class="seg__btn${f.person===t.id?" is-on":""}" data-action="set-person" data-p="${t.id}">
      ${t.id==="all"?p("users",15):M(t.id,18)}<span>${u(t.name)}${s.me===t.id?"<em> (voc\xEA)</em>":""}</span></button>`).join("")}
  </div>`}function ta(e,t=4){let a=[];return e.forEach(o=>{a.includes(o.companyId)||a.push(o.companyId)}),a.slice(0,t).map(o=>`<i style="background:${s.company(o)?.color||"#999"}"></i>`).join("")}function kt(){let e=f.date,t=$(),a=s.eventsOn(e,{person:f.person}),o=$t(e,f.person),l=o.filter(b=>b.level==="warn"&&b.icon!=="flag").flatMap(b=>b.ids||[]),n=s.member(s.me),i=Je(e),m=Array.from({length:7},(b,k)=>x(i,k)),d=(()=>{let b=H(m[0]),k=H(m[6]);return b.getMonth()===k.getMonth()?`${b.getDate()}\u2013${k.getDate()} de ${ce[k.getMonth()]}`:`${b.getDate()} ${ce[b.getMonth()]} \u2013 ${k.getDate()} ${ce[k.getMonth()]}`})(),r=`
  <header class="hdr">
    <div class="hdr__row">
      <div class="hdr__titles">
        <p class="hdr__eyebrow">${e===t?`${at()}${n?", "+u(n.name):""}`:u(Z(e))}</p>
        <h1>${u(et(e))}${e===t?`<span class="hdr__date">${u(Xe(e))}</span>`:""}</h1>
      </div>
      <div class="hdr__actions">
        ${e!==t?'<button class="chip chip--accent" data-action="go-today">Hoje</button>':""}
        <button class="iconbtn iconbtn--ai" data-action="assistant" aria-label="Assistente">${p("sparkle",20)}</button>
        <button class="iconbtn" data-action="tab" data-tab="ajustes" aria-label="Perfil">${n?M(n.id,34):p("user",20)}</button>
      </div>
    </div>
    ${_t()}
    <div class="week">
      <div class="week__bar">
        <button class="iconbtn iconbtn--sm" data-action="week" data-n="-7" aria-label="Semana anterior">${p("left",18)}</button>
        <span>${u(d)}</span>
        <button class="iconbtn iconbtn--sm" data-action="week" data-n="7" aria-label="Pr\xF3xima semana">${p("right",18)}</button>
      </div>
      <div class="week__days" data-swipe="week">
        ${m.map(b=>{let k=H(b),C=s.eventsOn(b,{person:f.person}),w=C.filter(Q=>Q.status!=="feito").length;return`<button class="wday${b===e?" is-sel":""}${b===t?" is-today":""}" data-action="set-date" data-k="${b}">
            <span class="wday__l">${K[k.getDay()]}</span>
            <span class="wday__n">${k.getDate()}</span>
            <span class="wday__dots">${ta(C,3)}${C.length?"":'<i class="none"></i>'}</span>
            ${w?`<span class="sr">${w} pendentes</span>`:""}
          </button>`}).join("")}
      </div>
    </div>
  </header>`,c={};a.forEach(b=>c[b.type]=(c[b.type]||0)+1);let h=a.filter(b=>b.status==="feito").length,y=a.length?Math.round(h/a.length*100):0,A=a.length?`<div class="summary">
        <div class="summary__progress">
          <div class="ring" style="--p:${y}"><span>${y}%</span></div>
          <div><strong>${h} de ${a.length}</strong><small>tarefas conclu\xEDdas</small></div>
        </div>
        <div class="summary__types">
          ${Object.entries(c).sort((b,k)=>k[1]-b[1]).map(([b,k])=>`<span class="tcount tbadge--${b}">${p(S[b].icon,13)}<b>${k}</b> ${S[b].label}</span>`).join("")}
        </div>
      </div>`:"",B=f.person==="all"?`<section class="block">
      <h2 class="block__title">${p("route",16)} Onde cada um vai estar</h2>
      <div class="team">${s.team.map(b=>aa(b,e)).join("")}</div>
    </section>`:"",ne="";if(e===t){let b=wt(f.person);if(b){let k=s.company(b.companyId),C=T(b.time)-I(),w=k?.color||"#555";ne=`<button class="next" style="--cc:${w};--cc-soft:${st(w,.12)}" data-action="open-event" data-id="${b.id}">
        <div class="next__label">${p("bell",14)} ${C>0?"Pr\xF3ximo \xB7 "+tt(C):"Acontecendo agora"}</div>
        <div class="next__row">
          ${Ae(k,44)}
          <div class="next__txt">
            <strong>${_(b.time)} \xB7 ${u(S[b.type].label)} \xB7 ${u(k?.name||"")}</strong>
            <span>${u(b.title||"")}</span>
          </div>
          ${dt(b.assignees,26)}
        </div>
        ${b.location?`<div class="next__loc">${p("pin",13)} ${u(b.location)}</div>`:""}
      </button>`}}let ie=f.showAllTips?o:o.filter((b,k)=>b.level==="warn"||k<2),v=o.length-ie.length,G=`<section class="block">
    <h2 class="block__title">${p("bulb",16)} Dicas e alertas</h2>
    <div class="tips">${ie.map(oa).join("")}</div>
    ${v>0?`<button class="btn-text btn-text--sm" data-action="toggle-tips">Ver mais ${v} dica${v>1?"s":""}</button>`:f.showAllTips&&o.length>2?'<button class="btn-text btn-text--sm" data-action="toggle-tips">Mostrar menos</button>':""}
  </section>`,O;if(!a.length)O=je("Dia livre",f.person==="all"?"Nada agendado para este dia.":`Nada agendado para ${s.member(f.person)?.name}.`,`<button class="btn btn--primary" data-action="new-event" data-date="${e}">${p("plus",18)} Adicionar</button>`);else{let b=[{k:"Manh\xE3",icon:"sun",items:a.filter(w=>w.time&&T(w.time)<720)},{k:"Tarde",items:a.filter(w=>w.time&&T(w.time)>=720&&T(w.time)<1080)},{k:"Noite",items:a.filter(w=>w.time&&T(w.time)>=1080)},{k:"Sem hor\xE1rio",items:a.filter(w=>!w.time)}],k=I(),C=e!==t;O=b.filter(w=>w.items.length).map(w=>`
      <div class="tl-group">
        <h3 class="tl-group__h">${w.k}<span>${w.items.length}</span></h3>
        ${w.items.map(Q=>{let Ke="";return!C&&Q.time&&T(Q.time)>k&&(C=!0,Ke=`<div class="nowline"><span>Agora \xB7 ${_(`${String(new Date().getHours()).padStart(2,"0")}:${String(new Date().getMinutes()).padStart(2,"0")}`)}</span></div>`),Ke+Te(Q,{highlight:l})}).join("")}
      </div>`).join(""),!C&&e===t&&(O+=`<div class="nowline nowline--end"><span>Agora \xB7 ${_(`${String(new Date().getHours()).padStart(2,"0")}:${String(new Date().getMinutes()).padStart(2,"0")}`)} \xB7 fim da agenda</span></div>`)}let we=s.notesOn(e),_e=`<section class="block">
    <h2 class="block__title">${p("note",16)} Bilhetes do dia</h2>
    <div class="notes">
      ${we.map(b=>`<div class="note">
        <p>${u(b.text)}</p>
        <footer>${M(b.author,18)}<span>${u(s.member(b.author)?.name||"")}</span>
          <button class="note__del" data-action="del-note" data-id="${b.id}" aria-label="Apagar bilhete">${p("x",14)}</button></footer>
      </div>`).join("")}
      <form class="note-add" data-form="note">
        <input name="text" placeholder="Escreva um bilhete para a dupla\u2026" autocomplete="off" maxlength="280">
        <button class="iconbtn iconbtn--accent" aria-label="Adicionar bilhete">${p("plus",18)}</button>
      </form>
    </div>
  </section>`;return`${r}
  <div class="page">
    ${s.demo?sa():""}
    ${ne}
    <button class="brief" data-action="assistant">
      <span class="brief__ic">${p("sparkle",18)}</span>
      <div><strong>Assistente</strong>${ae(e,f.person).map(b=>`<p>${u(b)}</p>`).join("")}</div>
      ${p("right",18,"muted")}
    </button>
    ${B}
    <section class="block">
      <h2 class="block__title">${p("clock",16)} Agenda ${f.person==="all"?"da dupla":"de "+u(s.member(f.person)?.name||"")}</h2>
      ${A}
      ${O}
    </section>
    ${G}
    ${_e}
  </div>`}function aa(e,t){let a=s.eventsOn(t,{person:e.id}),o=t===$()?I():-1,l=a.filter(r=>["shoot","meeting"].includes(S[r.type]?.kind)),n=a.filter(r=>ee(r.type)).length,i=a.find(r=>r.time&&r.status!=="feito"&&T(r.time)+de(r)>o),m=J(e.id,t),d=m.dayOff?"Folga":`${F(Math.round(m.minutes/15)*15)||"0 min"} livres`;return`<button class="team__col" data-action="set-person" data-p="${e.id}">
    <span class="team__free ${m.dayOff?"is-off":m.minutes>=240?"is-good":m.minutes>=120?"is-mid":"is-low"}">${p("clock",12)} ${d}</span>
    <div class="team__head">${M(e.id,30)}<div><strong>${u(e.name)}</strong><small>${a.length} tarefa${a.length===1?"":"s"} \xB7 ${n} post${n===1?"":"s"}</small></div></div>
    <ul class="team__where">
      ${l.length?l.map(r=>`<li>${p(S[r.type].icon,13)}<span><b>${_(r.time)}</b> ${u(s.company(r.companyId)?.name||"")}</span></li>`).join(""):`<li class="muted">${p("building",13)}<span>Trabalho interno / remoto</span></li>`}
    </ul>
    ${i?`<div class="team__next">Pr\xF3ximo: <b>${_(i.time)}</b> ${u(S[i.type].label)} \xB7 ${u(s.company(i.companyId)?.name||"")}</div>`:`<div class="team__next muted">${a.length?"Tudo conclu\xEDdo \u2713":"Livre"}</div>`}
  </button>`}function oa(e){let t=e.fixes?.length?`<div class="fixes">${e.fixes.map(a=>`<button class="fixbtn" data-action="apply-fix" data-id="${a.eventId}" data-patch="${u(JSON.stringify(a.patch))}">${p("check",13)} ${u(a.label)}</button>`).join("")}</div>`:"";return`<div class="tip tip--${e.level}"${e.ids?.length===1&&!t?` data-action="open-event" data-id="${e.ids[0]}"`:""}>
    <span class="tip__ic">${p(e.icon,16)}</span>
    <div><strong>${u(e.title)}</strong><p>${u(e.text)}</p>${t}</div>
  </div>`}function sa(){return`<div class="banner">
    ${p("sparkle",18)}
    <p><strong>Voc\xEA est\xE1 vendo dados de exemplo.</strong> Explore \xE0 vontade e, quando quiser come\xE7ar de verdade, apague os exemplos.</p>
    <button class="btn btn--soft btn--sm" data-action="clear-demo">Apagar exemplos</button>
  </div>`}function xt(){let e=f.month,[t,a]=e.split("-").map(Number),o=new Date(t,a-1,1),l=x(We(o),-o.getDay()),n=$(),i=Array.from({length:42},(v,G)=>x(l,G)),d=i.slice(35).some(v=>v.slice(0,7)===e)?i:i.slice(0,35),r={person:f.person,companyId:f.monthCompany},c=s.companiesSorted(),h=f.monthSel,y=s.eventsOn(h,r),A=s.eventsBetween(`${e}-01`,`${e}-31`,r),B=A.filter(v=>ee(v.type)).length,ne=A.filter(v=>v.type==="captacao").length,ie=A.filter(v=>v.type==="reuniao").length;return`
  <header class="hdr">
    <div class="hdr__row">
      <div class="hdr__titles">
        <p class="hdr__eyebrow">Calend\xE1rio</p>
        <h1>${u(Ze(e).split(" ")[0])}<span class="hdr__date">${e.slice(0,4)}</span></h1>
      </div>
      <div class="hdr__actions">
        <button class="iconbtn" data-action="month" data-n="-1" aria-label="M\xEAs anterior">${p("left",20)}</button>
        <button class="chip" data-action="month-today">Hoje</button>
        <button class="iconbtn" data-action="month" data-n="1" aria-label="Pr\xF3ximo m\xEAs">${p("right",20)}</button>
      </div>
    </div>
    ${_t()}
  </header>
  <div class="page">
    <div class="chips-scroll">
      <button class="chip${f.monthCompany?"":" is-on"}" data-action="month-company" data-id="">Todas as empresas</button>
      ${c.map(v=>`<button class="chip chip--co${f.monthCompany===v.id?" is-on":""}" style="--cc:${v.color}" data-action="month-company" data-id="${v.id}">${Ae(v,18,5)}${u(v.name)}</button>`).join("")}
    </div>

    <div class="mstats">
      <div><b>${B}</b><span>posts</span></div>
      <div><b>${ne}</b><span>capta\xE7\xF5es</span></div>
      <div><b>${ie}</b><span>reuni\xF5es</span></div>
      <div><b>${A.filter(v=>v.status==="feito").length}/${A.length}</b><span>conclu\xEDdos</span></div>
    </div>

    <div class="month" data-swipe="month">
      <div class="month__wd">${Qe.map(v=>`<span>${v}</span>`).join("")}</div>
      <div class="month__grid">
        ${d.map(v=>{let G=v.slice(0,7)===e,O=s.eventsOn(v,r),we=O.some(_e=>_e.type==="captacao");return`<button class="mday${G?"":" is-out"}${v===n?" is-today":""}${v===h?" is-sel":""}" data-action="month-select" data-k="${v}">
            <span class="mday__n">${Number(v.slice(8))}</span>
            ${O.length?`<span class="mday__bars">${na(O)}</span><span class="mday__count">${we?p("camera",10):""}${O.length}</span>`:""}
          </button>`}).join("")}
      </div>
    </div>

    <section class="block">
      <div class="block__row">
        <h2 class="block__title">${u(le(h))}</h2>
        <button class="btn-text btn-text--sm" data-action="open-day" data-k="${h}">Abrir dia ${p("right",14)}</button>
      </div>
      ${y.length?y.map(v=>Te(v)).join(""):je("Nada neste dia","Toque no + para agendar.",`<button class="btn btn--soft" data-action="new-event" data-date="${h}">${p("plus",16)} Novo evento</button>`)}
    </section>

    ${c.length?`<section class="block">
      <h2 class="block__title">Legenda</h2>
      <div class="legend">${c.map(v=>`<span><i style="background:${v.color}"></i>${u(v.name)}</span>`).join("")}</div>
    </section>`:""}
  </div>`}function na(e){let t={};return e.forEach(a=>t[a.companyId]=(t[a.companyId]||0)+1),Object.entries(t).slice(0,4).map(([a])=>`<i style="background:${s.company(a)?.color||"#999"}"></i>`).join("")}var Et="pauta.device",At="pauta.notifyPrefs",Tt=()=>/iPhone|iPad|iPod/.test(navigator.userAgent)||navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1,ia=()=>"serviceWorker"in navigator&&"PushManager"in window&&"Notification"in window,L=()=>"Notification"in window?Notification.permission:"unsupported",oe=()=>Tt()&&!W(),Pe=()=>{try{return{reminders:!0,partner:!0,daily:!0,...JSON.parse(localStorage.getItem(At)||"{}")}}catch{return{reminders:!0,partner:!0,daily:!0}}},St=e=>{let t="=".repeat((4-e.length%4)%4),a=atob((e+t).replace(/-/g,"+").replace(/_/g,"/"));return Uint8Array.from(a,o=>o.charCodeAt(0))},ra=async e=>{let t=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(e));return"d_"+Array.from(new Uint8Array(t).slice(0,16),a=>a.toString(16).padStart(2,"0")).join("")};async function he(){return oe()?{ok:!1,reason:"install"}:ia()?await Notification.requestPermission()!=="granted"?{ok:!1,reason:"denied"}:s.mode!=="cloud"?{ok:!0,local:!0}:be():{ok:!1,reason:"unsupported"}}async function be(){if(s.mode!=="cloud"||L()!=="granted"||!s.me)return{ok:!1,reason:"not-ready"};let t=(await s.readDoc("meta/push"))?.vapidPublicKey;if(!t)return{ok:!1,reason:"server"};let a=await navigator.serviceWorker.ready,o=await a.pushManager.getSubscription();if(o&&o.options?.applicationServerKey){let i=new Uint8Array(o.options.applicationServerKey),m=St(t);(i.length!==m.length||i.some((d,r)=>d!==m[r]))&&(await o.unsubscribe(),o=null)}o||(o=await a.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:St(t)}));let l=o.toJSON(),n=await ra(l.endpoint);return s.writeRaw("devices",{id:n,member:s.me,subscription:{endpoint:l.endpoint,keys:l.keys},prefs:Pe(),device:Tt()?"iPhone":navigator.platform||"navegador",updatedAt:Date.now()}),localStorage.setItem(Et,n),{ok:!0,id:n}}async function jt(e){localStorage.setItem(At,JSON.stringify(e)),s.mode==="cloud"&&L()==="granted"&&await be()}async function ge(){let e=localStorage.getItem(Et);return s.mode==="cloud"&&e?(s.writeRaw("pings",{id:"p_"+Date.now().toString(36),device:e,member:s.me,at:Date.now()}),"server"):(await(await navigator.serviceWorker.ready).showNotification("Notifica\xE7\xF5es ativadas \u2713",{body:"\xC9 assim que os lembretes v\xE3o chegar.",icon:"icons/icon-192.png",badge:"icons/icon-192.png",tag:"teste"}),"local")}function Ne(e){try{if(!("setAppBadge"in navigator))return;e>0?navigator.setAppBadge(e).catch(()=>{}):navigator.clearAppBadge().catch(()=>{})}catch{}}var Re="pauta.onboarded",ve="pauta.notifyAskedAt";function Mt(){if(!localStorage.getItem(Re))return Le(s.me?["welcome","notify","done"]:["welcome","who","notify","done"]);if(!s.me&&s.mode==="local")return Le(["who"]);let t=Number(localStorage.getItem(ve)||0);if(W()&&L()==="default"&&Date.now()-t>3*864e5)return Le(["notify"])}function Ie(e,t,a="agora"){return`<div class="nprev">
    <img src="icons/icon-192.png" alt="">
    <div><div class="nprev__top"><b>${u(E.appName.toUpperCase())}</b><span>${u(a)}</span></div>
    <strong>${u(e)}</strong><p>${u(t)}</p></div>
  </div>`}function ca(e,t,a){let o=s.member(s.me),l=s.team.find(i=>i.id!==s.me)||s.team[1]||s.team[0],n=a>1?`<div class="ob__dots">${Array.from({length:a},(i,m)=>`<i class="${m===t?"is-on":""}"></i>`).join("")}</div>`:"";return e==="welcome"?`<div class="ob__art"><img class="ob__icon" src="icons/icon-512.png" alt=""></div>
      <h1>Bem-vindo ao ${u(E.appName)}</h1>
      <p>A agenda de conte\xFAdo de ${u(E.agencyName)}: posts, stories, reels e capta\xE7\xF5es de todas as empresas, num lugar s\xF3.</p>
      ${n}
      <button class="btn btn--primary btn--block" data-next>Come\xE7ar</button>`:e==="who"?`<div class="ob__art ob__art--sm">${p("user",34)}</div>
      <h1>Quem vai usar este celular?</h1>
      <p>Assim o app sabe de quem s\xE3o os lembretes e avisa o parceiro quando voc\xEA marcar algo.</p>
      <div class="whogrid ob__who">${s.team.map(i=>`<button class="whobtn${s.me===i.id?" is-on":""}" style="--mc:${i.color}" data-me="${i.id}">${M(i.id,36)}<span>${u(i.name)}</span><i class="whobtn__check">${p("check",14)}</i></button>`).join("")}</div>
      ${n}
      <button class="btn btn--primary btn--block" data-next ${s.me?"":"disabled"}>Continuar</button>`:e==="notify"?`<div class="ob__previews">
        ${Ie("Daqui a 2h: Reels \xB7 Pura Vida","18h \u2014 postar o Reels \u201CBastidores\u201D","agora")}
        ${Ie(`${l?.name||"Seu parceiro"} marcou para voc\xEA`,"Story \xB7 Caf\xE9 Aroma \u2014 amanh\xE3, 16h","h\xE1 2 min")}
        ${Ie(`Bom dia, ${o?.name||"Henrique"}! Seu dia hoje`,"5 tarefas \xB7 primeira: 11h30 Feed \xB7 Studio Fit","8:00")}
      </div>
      <h1>Nunca mais esque\xE7a um post</h1>
      <p>Lembretes 2h e 30 min antes de cada post, aviso na v\xE9spera das capta\xE7\xF5es, cobran\xE7a se algo ficou para tr\xE1s e aviso quando o parceiro marcar algo para voc\xEA.</p>
      <div data-notify-msg></div>
      ${n}
      <button class="btn btn--primary btn--block" data-enable>${p("bell",18)} Ativar notifica\xE7\xF5es</button>
      <button class="btn btn--ghost btn--block" data-skip>Agora n\xE3o</button>`:`<div class="ob__art ob__art--ok">${p("check",40)}</div>
    <h1>Tudo pronto${o?", "+u(o.name):""}!</h1>
    <ul class="ob__tips">
      <li>${p("plus",18)}<span>Toque no <b>+</b> para marcar posts, capta\xE7\xF5es e reuni\xF5es.</span></li>
      <li>${p("sparkle",18)}<span>O <b>Assistente</b> avisa conflitos e sugere os melhores hor\xE1rios.</span></li>
      <li>${p("link",18)}<span>Em <b>Empresas</b>, mande para cada cliente o link do cronograma dele.</span></li>
    </ul>
    ${n}
    <button class="btn btn--primary btn--block" data-next>Abrir a agenda</button>`}function Le(e){if(document.querySelector(".ob"))return;let t=0,a=document.createElement("div");a.className="ob",a.innerHTML='<div class="ob__card"></div>',document.body.appendChild(a),requestAnimationFrame(()=>a.classList.add("is-in"));let o=a.querySelector(".ob__card"),l=()=>{(e.includes("welcome")||e.includes("done"))&&localStorage.setItem(Re,"1"),a.classList.remove("is-in"),setTimeout(()=>a.remove(),400)},n=d=>{if(d>=e.length)return l();t=d,o.classList.remove("is-shown"),setTimeout(()=>{o.innerHTML=ca(e[t],t,e.length),m(),o.classList.add("is-shown")},o.innerHTML?180:0)},i=(d,r="info")=>{let c=o.querySelector("[data-notify-msg]");c&&(c.innerHTML=`<div class="ob__msg ob__msg--${r}">${d}</div>`)},m=()=>{o.querySelectorAll("[data-next]").forEach(c=>c.onclick=()=>n(t+1)),o.querySelectorAll("[data-me]").forEach(c=>c.onclick=()=>{s.setMe(c.dataset.me),o.querySelectorAll("[data-me]").forEach(h=>h.classList.toggle("is-on",h===c)),o.querySelector("[data-next]").disabled=!1});let d=o.querySelector("[data-skip]");d&&(d.onclick=()=>{localStorage.setItem(ve,String(Date.now())),n(t+1)});let r=o.querySelector("[data-enable]");r&&(r.onclick=async()=>{if(localStorage.setItem(ve,String(Date.now())),oe()){i(`<b>Primeiro instale o app.</b> No iPhone, as notifica\xE7\xF5es s\xF3 funcionam pelo \xEDcone da Tela de In\xEDcio:<br>
          1. Toque em ${p("share",14)} <b>Compartilhar</b><br>2. <b>Adicionar \xE0 Tela de In\xEDcio</b><br>3. Abra o ${u(E.appName)} pelo \xEDcone`,"warn"),r.outerHTML='<button class="btn btn--primary btn--block" data-next>Entendi</button>',m();return}r.disabled=!0,r.innerHTML="Aguardando permiss\xE3o\u2026";let c=await he().catch(()=>({ok:!1,reason:"error"}));c.ok?(c.local?i("Ativado neste celular. Para os avisos chegarem com o app fechado e no celular do parceiro, falta ligar o servidor de notifica\xE7\xF5es (Ajustes \u2192 Notifica\xE7\xF5es).","ok"):(i("Pronto! Voc\xEA vai receber uma notifica\xE7\xE3o de teste em instantes.","ok"),ge().catch(()=>{})),r.outerHTML='<button class="btn btn--primary btn--block" data-next>Continuar</button>',o.querySelector("[data-skip]")?.remove(),m()):c.reason==="server"?(i("Permiss\xE3o concedida! O servidor de notifica\xE7\xF5es ainda n\xE3o foi publicado; quando for, este celular \xE9 cadastrado sozinho.","ok"),r.outerHTML='<button class="btn btn--primary btn--block" data-next>Continuar</button>',m()):c.reason==="denied"?(i(`As notifica\xE7\xF5es foram bloqueadas. Para ligar depois: <b>Ajustes do iPhone \u2192 Notifica\xE7\xF5es \u2192 ${u(E.appName)}</b>.`,"warn"),r.outerHTML='<button class="btn btn--primary btn--block" data-next>Continuar</button>',m()):(i("Este aparelho n\xE3o aceita notifica\xE7\xF5es deste app.","warn"),r.disabled=!1,r.innerHTML="Tentar de novo")})};n(0)}function Dt(){localStorage.removeItem(Re),localStorage.removeItem(ve),g("A apresenta\xE7\xE3o aparece na pr\xF3xima abertura")}function qt(){let e=s.member(s.me),t=s.mode==="cloud",a="Notification"in window&&Notification.permission==="granted";return`
  <header class="hdr">
    <div class="hdr__row"><div class="hdr__titles"><p class="hdr__eyebrow">${u(E.appName)} \xB7 ${u(E.agencyName)}</p><h1>Ajustes</h1></div></div>
  </header>
  <div class="page">
    <section class="block">
      <h2 class="block__title">${p("user",16)} Quem est\xE1 usando este celular?</h2>
      ${t?`<div class="card card--row">${e?M(e.id,40):p("user",24)}<div><strong>${u(e?.name||s.user?.email||"")}</strong><small>${u(s.user?.email||"")}</small></div>
            <button class="btn btn--soft btn--sm" data-action="logout">${p("logout",16)} Sair</button></div>`:`<div class="whogrid">${s.team.map(o=>`<button class="whobtn${s.me===o.id?" is-on":""}" style="--mc:${o.color}" data-action="set-me" data-p="${o.id}">${M(o.id,34)}<span>${u(o.name)}</span><i class="whobtn__check">${p("check",14)}</i></button>`).join("")}</div>
           <p class="fhelp">Usado para sauda\xE7\xE3o, \u201CCriado por\u201D e nos lembretes.</p>`}
    </section>

    ${da()}

    <section class="block">
      <h2 class="block__title">${p("sparkle",16)} Assistente e Claude</h2>
      <div class="card card--row">
        ${p("sparkle",22)}
        <div><strong>Assistente autom\xE1tico ativo</strong><small>Confere conflitos, tempo livre e melhores hor\xE1rios sozinho, sem internet e sem chave.</small></div>
        <button class="btn btn--soft btn--sm" data-action="assistant">Abrir</button>
      </div>
      <p class="fhelp">Para perguntas abertas (ideias, reorganizar a semana), use \u201CPerguntar ao Claude\u201D no Assistente. Abre o Claude com o seu login normal, sem chave de API.</p>
    </section>

    ${la()}

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

    ${W()?"":`<section class="block">
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
          ${rt.map(o=>`<li><span class="tbadge tbadge--${o.type}">${p(S[o.type].icon,13)}${S[o.type].label}</span><span>${u(o.text)}</span></li>`).join("")}
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
    <p class="about">${u(E.appName)} \u2014 agenda de conte\xFAdo \xB7 v1.0</p>
  </div>`}function la(){let e=L(),t=oe(),a=s.mode==="cloud",o=!!localStorage.getItem("pauta.device"),l=Pe(),n,i,m="";return t?(n="warn",i="No iPhone, as notifica\xE7\xF5es s\xF3 funcionam com o app instalado: Compartilhar \u2192 Adicionar \xE0 Tela de In\xEDcio, e abra pelo \xEDcone."):e==="unsupported"?(n="warn",i="Este navegador n\xE3o aceita notifica\xE7\xF5es."):e==="denied"?(n="warn",i=`Bloqueadas. Para ligar: Ajustes do iPhone \u2192 Notifica\xE7\xF5es \u2192 ${E.appName}.`):e!=="granted"?(n="warn",i="Desativadas neste celular.",m='<button class="btn btn--primary btn--sm" data-action="notify-enable">Ativar</button>'):a&&o?(n="ok",i="Ativadas. Os lembretes e os avisos do parceiro chegam mesmo com o app fechado."):a?(n="warn",i="Permiss\xE3o concedida, mas o servidor de notifica\xE7\xF5es ainda n\xE3o foi publicado (veja o README).",m='<button class="btn btn--soft btn--sm" data-action="notify-enable">Tentar</button>'):(n="warn",i="Ativadas s\xF3 com o app aberto. Para receber com o app fechado e no celular do parceiro, ligue a nuvem e o servidor (README)."),`<section class="block">
    <h2 class="block__title">${p("bell",16)} Notifica\xE7\xF5es</h2>
    <div class="card card--row ${n==="ok"?"card--ok":"card--warn"}">
      ${p("bell",22)}
      <div><strong>${n==="ok"?"Funcionando":"Aten\xE7\xE3o"}</strong><small>${u(i)}</small></div>
      ${m}
    </div>
    <form class="list notif-prefs" data-notify-form onsubmit="return false">
      <label class="list__row"><span><b>Lembretes dos meus posts</b><small>2h e 30 min antes, na hora e cobran\xE7a se atrasar</small></span><input type="checkbox" class="switch" name="reminders" ${l.reminders?"checked":""}></label>
      <label class="list__row"><span><b>Avisos do parceiro</b><small>quando marcar, mudar ou concluir algo</small></span><input type="checkbox" class="switch" name="partner" ${l.partner?"checked":""}></label>
      <label class="list__row"><span><b>Resumo do dia</b><small>\xE0s 8h (hoje) e \xE0s 20h (amanh\xE3)</small></span><input type="checkbox" class="switch" name="daily" ${l.daily?"checked":""}></label>
    </form>
    ${e==="granted"?`<button class="btn btn--soft btn--block" data-action="notify-test">${p("bell",16)} Enviar notifica\xE7\xE3o de teste</button>`:""}
    <button class="btn-text btn-text--sm" data-action="onboarding-again">Ver a apresenta\xE7\xE3o de novo</button>
  </section>`}function da(){let e=P(),t=[0,15,30,45,60,90];return`<section class="block">
    <h2 class="block__title">${p("clock",16)} Rotina e tempo livre</h2>
    <form class="list" data-routine-form onsubmit="return false">
      <label class="list__row"><span>Expediente</span><input type="time" name="workStart" value="${e.workStart}"> <input type="time" name="workEnd" value="${e.workEnd}"></label>
      <label class="list__row"><span>Almo\xE7o</span><input type="time" name="lunchStart" value="${e.lunchStart}"> <input type="time" name="lunchEnd" value="${e.lunchEnd}"></label>
      <label class="list__row"><span>Deslocamento entre lugares</span><select name="travelMin">${t.map(a=>`<option value="${a}"${e.travelMin===a?" selected":""}>${a?a+" min":"n\xE3o considerar"}</option>`).join("")}</select></label>
      <label class="list__row"><span>M\xE1ximo de tarefas/dia</span><select name="maxTasks">${[4,5,6,7,8,10,12,15,20].map(a=>`<option value="${a}"${e.maxTasks===a?" selected":""}>${a}</option>`).join("")}</select></label>
      <div class="list__row list__row--col"><span>Dias de folga</span>
        <div class="daysoff">${K.map((a,o)=>`<label class="dayoff"><input type="checkbox" name="off" value="${o}"${e.daysOff.includes(o)?" checked":""}><span>${a}</span></label>`).join("")}</div>
      </div>
    </form>
    <p class="fhelp">O assistente usa isso para n\xE3o marcar nada em cima do almo\xE7o, da folga ou fora do expediente, e para proteger o tempo livre de voc\xEAs.</p>
  </section>`}var N={async notifyEnable(){let e=await he().catch(()=>({ok:!1,reason:"error"}));e.ok?g(e.local?"Ativado (com o app aberto)":"Notifica\xE7\xF5es ativadas"):e.reason==="install"?g("Instale o app na Tela de In\xEDcio primeiro"):e.reason==="denied"?g("Bloqueado: libere em Ajustes do iPhone \u2192 Notifica\xE7\xF5es"):e.reason==="server"?g("Servidor de notifica\xE7\xF5es ainda n\xE3o publicado"):g("N\xE3o foi poss\xEDvel ativar"),s.emit()},async notifyTest(){let e=await ge().catch(()=>null);g(e==="server"?"Enviando\u2026 deve chegar em alguns segundos":e?"Notifica\xE7\xE3o enviada":"N\xE3o foi poss\xEDvel enviar")},async notifyPrefs(e){await jt({reminders:e.reminders.checked,partner:e.partner.checked,daily:e.daily.checked}),g("Prefer\xEAncias salvas")},onboardingAgain(){Dt()},async routine(e){let t=(l,n)=>/^\d{2}:\d{2}$/.test(e[l].value)?e[l].value:n,a=P(),o={id:"routine",workStart:t("workStart",a.workStart),workEnd:t("workEnd",a.workEnd),lunchStart:t("lunchStart",a.lunchStart),lunchEnd:t("lunchEnd",a.lunchEnd),travelMin:Number(e.travelMin.value),maxTasks:Number(e.maxTasks.value),daysOff:[...e.querySelectorAll('input[name="off"]:checked')].map(l=>Number(l.value))};if(o.workEnd<=o.workStart)return g("O fim do expediente precisa ser depois do in\xEDcio");if(o.lunchEnd<=o.lunchStart)return g("O fim do almo\xE7o precisa ser depois do in\xEDcio");await s.upsert("settings",o),g("Rotina salva")},async ics(e){let t=e.dataset.who==="me"?s.me:"all";if(e.dataset.who==="me"&&!s.me)return g("Escolha primeiro quem est\xE1 usando este celular");let a=Number(e.dataset.days),o=$(),l=s.eventsBetween(o,x(o,a),{person:t}).filter(i=>i.status!=="feito");if(!l.length)return g("Nada agendado nesse per\xEDodo");let n=t==="all"?`${E.appName} \u2013 Dupla`:`${E.appName} \u2013 ${s.member(t).name}`;await bt(l,`pauta-${t}-${o}.ics`,n)},export(){let e=new Blob([s.exportData()],{type:"application/json"}),t=document.createElement("a");t.href=URL.createObjectURL(e),t.download=`pauta-backup-${$()}.json`,document.body.appendChild(t),t.click(),t.remove(),g("Backup exportado")},async import(e){let t=e.files[0];if(t)try{let a=await t.text(),o=await ut({title:"Importar backup",text:"Como deseja importar?",options:[{label:"Juntar com os dados atuais",value:"merge",primary:!0},{label:"Substituir tudo",value:"replace",danger:!0}]});if(!o)return;await s.importData(a,{replace:o==="replace"}),g("Backup importado")}catch{g("Arquivo inv\xE1lido")}finally{e.value=""}},async clearAll(){await te({title:"Apagar TUDO?",text:"Empresas, eventos e bilhetes ser\xE3o apagados. Exporte um backup antes, se precisar.",ok:"Apagar tudo",danger:!0})&&(await s.clearAll(),g("Tudo apagado"))}};var Be=[{label:"Organize meu dia",q:"Analise a agenda de hoje e me diga, em ordem, o que fazer e quando. Aponte conflitos e onde d\xE1 para ganhar tempo livre."},{label:"Melhores hor\xE1rios da semana",q:"Sugira os melhores hor\xE1rios para os posts desta semana de cada empresa, sem conflitar com as capta\xE7\xF5es e respeitando o expediente e o almo\xE7o."},{label:"Equilibrar a dupla",q:"A carga de trabalho entre Henrique e Matheus est\xE1 equilibrada nos pr\xF3ximos 7 dias? Sugira trocas concretas de respons\xE1vel."},{label:"Ideias de conte\xFAdo",q:"Para cada empresa, sugira 3 ideias de posts (feed, reels e stories) para a pr\xF3xima semana, com legenda curta."}],ma=(e=[])=>e.map(t=>s.member(t)?.name).filter(Boolean).join(" e ")||"sem respons\xE1vel";function pa(e,t=14){let a=P(),o=$(),l=new Date,n=[];n.push(`Voc\xEA \xE9 o assistente de organiza\xE7\xE3o de uma dupla de social media (${s.team.map(d=>d.name).join(" e ")}) que cuida do Instagram de v\xE1rias empresas. Responda em portugu\xEAs do Brasil, de forma curta e direta (sem rodeios), com hor\xE1rios concretos e no m\xE1ximo uns 10 itens.`),n.push(""),n.push(`Agora: ${Z(o)}, ${l.toTimeString().slice(0,5)}.`),n.push(`Rotina combinada: expediente ${a.workStart}\u2013${a.workEnd}, almo\xE7o ${a.lunchStart}\u2013${a.lunchEnd}, folga: ${a.daysOff.map(d=>Ge[d]).join(", ")||"nenhuma"}, deslocamento m\xEDnimo entre lugares: ${a.travelMin} min, m\xE1ximo de ${a.maxTasks} tarefas por pessoa/dia.`),n.push(`Empresas: ${s.companiesSorted().map(d=>d.name+(d.instagram?` (@${d.instagram})`:"")).join(", ")||"nenhuma"}.`),n.push(""),n.push(`Agenda (de hoje at\xE9 ${t} dias):`);let i=s.eventsBetween(x(o,-1),x(o,t)),m="";return i.forEach(d=>{d.date!==m&&(n.push(`
${Z(d.date)}:`),m=d.date);let r=s.company(d.companyId),c=d.duration?` (${d.duration} min)`:"";n.push(`- ${d.time||"sem hor\xE1rio"}${c} \xB7 ${S[d.type]?.label} \xB7 ${r?.name||"?"} \xB7 "${d.title||""}" \xB7 ${ma(d.assignees)} \xB7 ${d.status==="feito"?"feito":d.status==="pronto"?"pronto":"a fazer"}${d.location?" \xB7 local: "+d.location:""}`)}),i.length||n.push("(nenhum compromisso)"),n.push(""),n.push(`Pergunta: ${e}`),n.join(`
`)}function Ct(e){let t=pa(e);try{navigator.clipboard?.writeText(t).catch(()=>{})}catch{}let a=encodeURIComponent(t),o=a.length<7500?`https://claude.ai/new?q=${a}`:"https://claude.ai/new";window.open(o,"_blank","noopener"),g(a.length<7500?"Abrindo o Claude\u2026 (a agenda tamb\xE9m foi copiada)":"Agenda copiada: cole no Claude (segure no campo \u2192 Colar)",{ms:5e3})}var It="cal.chat",R=(()=>{try{return JSON.parse(localStorage.getItem(It)||"[]").slice(-30)}catch{return[]}})(),Y=!1,Pt=()=>{try{localStorage.setItem(It,JSON.stringify(R.slice(-30)))}catch{}},ua=e=>u(e).replace(/\*\*(.+?)\*\*/g,"<b>$1</b>").replace(/^#{1,4}\s*(.+)$/gm,"<b>$1</b>").replace(/^\s*[-•*]\s+(.+)$/gm,'<span class="li">$1</span>').replace(/<\/span>\n+(?=<span class="li">)/g,"</span>").replace(/\n{2,}/g,`
`).replace(/\n/g,"<br>"),Nt={"functions/failed-precondition":null,"functions/permission-denied":"S\xF3 a equipe pode usar o assistente.","functions/resource-exhausted":null,"functions/unavailable":"Sem conex\xE3o com o assistente agora. Tente de novo.","functions/deadline-exceeded":"O assistente demorou demais. Tente de novo."};function fa(e){return e?.code==="local"?"O assistente precisa da sincroniza\xE7\xE3o na nuvem ligada.":e?.code in Nt?Nt[e.code]||e.message:e?.code==="functions/not-found"||e?.code==="functions/internal"&&!/assistente|Claude/.test(e.message||"")?"O assistente ainda n\xE3o foi ligado no servidor. Falta publicar o servidor com a chave do Claude (veja o README, se\xE7\xE3o 5).":e?.message||"N\xE3o consegui falar com o assistente."}function Ot(){return`<section class="block" data-chat>
    <h2 class="block__title">${p("sparkle",16)} Pergunte ao assistente</h2>
    <div class="chat">
      ${R.length?R.map(e=>`<div class="msg msg--${e.role}${e.error?" msg--err":""}">${ua(e.text)}</div>`).join(""):'<div class="msg msg--assistant">Oi! Eu vejo a agenda inteira de voc\xEAs: posts, capta\xE7\xF5es, reuni\xF5es, empresas e a rotina. Pergunte o que quiser, por exemplo \u201Co que eu tenho amanh\xE3?\u201D ou \u201Cqual o melhor hor\xE1rio para um Reels da Pura Vida na sexta?\u201D.</div>'}
      ${Y?'<div class="msg msg--assistant msg--typing"><i></i><i></i><i></i></div>':""}
    </div>
    <div class="presets">${Be.map((e,t)=>`<button class="preset" data-preset="${t}">${u(e.label)}</button>`).join("")}</div>
    <form class="chat__form" data-chatform onsubmit="return false">
      <textarea class="input" rows="1" name="q" placeholder="Escreva sua pergunta\u2026" ${Y?"disabled":""}></textarea>
      <button class="iconbtn iconbtn--accent" type="submit" aria-label="Enviar" ${Y?"disabled":""}>${p("right",20)}</button>
    </form>
    <div class="chat__foot">
      ${R.length?'<button class="btn-text btn-text--sm" data-clearchat>Limpar conversa</button>':"<span></span>"}
      <button class="btn-text btn-text--sm" data-extclaude>Abrir no app do Claude</button>
    </div>
  </section>`}var ha=e=>u(JSON.stringify(e));function ba(e="all"){let t=$(),a=e==="all"?s.team.map(i=>i.id):[e],o=[],l=new Set;for(let i=0;i<7;i++){let m=x(t,i);a.forEach(r=>fe(r,m).forEach(c=>{let h=c.ids.slice().sort().join("|")+c.title;l.has(h)||(l.add(h),o.push({...c,date:m}))})),s.eventsOn(m).filter(r=>!(r.assignees||[]).length&&r.status!=="feito").forEach(r=>o.push({date:m,level:"warn",icon:"user",ids:[r.id],title:"Sem respons\xE1vel",text:`${_(r.time)} ${D(r)}`,fixes:s.team.map(c=>({label:`Dar para ${c.name}`,eventId:r.id,patch:{assignees:[c.id]}}))}))}let n=s.state.events.filter(i=>i.status==="pendente"&&(i.date<t||i.date===t&&i.time&&T(i.time)+15<I())&&i.date>=x(t,-7));return n.length&&o.unshift({date:t,level:"warn",icon:"flag",ids:n.map(i=>i.id),title:`${n.length} tarefa${n.length>1?"s":""} pendente${n.length>1?"s":""} no passado`,text:"Marquem como feito ou reagendem para o cronograma do cliente ficar correto."}),o}function Lt(){let e={type:"feed",date:f.date>=$()?f.date:$(),q:""},t=()=>{let n=$(),i=ba(),m=P(),d=Array.from({length:7},(c,h)=>x(n,h)),r={id:"__probe",type:e.type,date:e.date,assignees:[]};return`
    ${pt("Assistente")}
    <div class="page page--sheet">
      <div class="assist-hero">
        <span class="assist-hero__ic">${p("sparkle",22)}</span>
        <div><strong>Analisando a agenda de voc\xEAs</strong><p>Funciona sozinho, sem internet. Confere conflitos, tempo livre e os melhores hor\xE1rios sempre que algo muda.</p></div>
      </div>

      ${Ot()}

      <section class="block">
        <h2 class="block__title">${p("today",16)} Hoje</h2>
        <div class="card">${ae(n).map(c=>`<p>${u(c)}</p>`).join("")}</div>
        <h2 class="block__title">${p("calendar",16)} Amanh\xE3</h2>
        <div class="card">${ae(x(n,1)).map(c=>`<p>${u(c)}</p>`).join("")}</div>
      </section>

      <section class="block">
        <h2 class="block__title">${p("alert",16)} Precisa de aten\xE7\xE3o (7 dias)</h2>
        ${i.length?`<div class="tips">${i.map(c=>`
          <div class="tip tip--${c.level}">
            <span class="tip__ic">${p(c.icon,16)}</span>
            <div>
              <small class="tip__date">${u(le(c.date))}</small>
              <strong>${u(c.title)}</strong><p>${u(c.text)}</p>
              ${c.fixes?.length?`<div class="fixes">${c.fixes.map(h=>`<button class="fixbtn" data-action="apply-fix" data-id="${h.eventId}" data-patch="${ha(h.patch)}">${p("check",13)} ${u(h.label)}</button>`).join("")}</div>`:""}
              ${c.ids?.length===1?`<button class="btn-text btn-text--sm" data-action="open-event" data-id="${c.ids[0]}">Ver evento</button>`:""}
            </div>
          </div>`).join("")}</div>`:`<div class="tip tip--ok"><span class="tip__ic">${p("check",16)}</span><div><strong>Tudo certo</strong><p>Nenhum conflito nos pr\xF3ximos 7 dias.</p></div></div>`}
      </section>

      <section class="block">
        <h2 class="block__title">${p("clock",16)} Tempo livre no expediente (${_(m.workStart)}\u2013${_(m.workEnd)})</h2>
        <div class="freegrid">
          <span></span>${d.map(c=>`<span class="freegrid__d">${K[H(c).getDay()]}<b>${H(c).getDate()}</b></span>`).join("")}
          ${s.team.map(c=>`${M(c.id,24)}${d.map(h=>{let y=J(c.id,h);if(y.dayOff)return'<span class="freecell is-off">folga</span>';let A=y.minutes/60;return`<span class="freecell ${A>=4?"is-good":A>=2?"is-mid":"is-low"}">${F(Math.round(y.minutes/15)*15)||"0"}</span>`}).join("")}`).join("")}
        </div>
        <p class="fhelp">Verde: dia tranquilo \xB7 amarelo: apertado \xB7 vermelho: sem respiro. Ajuste a rotina em Ajustes.</p>
      </section>

      <section class="block">
        <h2 class="block__title">${p("bulb",16)} Encontrar o melhor hor\xE1rio</h2>
        <div class="card">
          <div class="row2">
            <select class="input" data-f="type">${it.map(c=>`<option value="${c}"${e.type===c?" selected":""}>${S[c].label}</option>`).join("")}</select>
            <input class="input" type="date" data-f="date" value="${e.date}">
          </div>
          ${s.team.map(c=>{let h=ft({...r},{people:[c.id],limit:4});return`<div class="findrow">${M(c.id,26)}<div class="hintbox__times">${h.length?h.map(y=>`<button class="tchip" data-new="${c.id}|${y.time}">${_(y.time)}${y.peak?"<small>pico</small>":""}</button>`).join(""):'<span class="muted">Sem hor\xE1rio livre</span>'}</div></div>`}).join("")}
          <p class="fhelp">Toque num hor\xE1rio para j\xE1 criar o evento com a pessoa certa.</p>
        </div>
      </section>

    </div>`},a=mt({className:"sheet--tall",html:t(),onMount:n=>{let i=n.el;i.querySelector('[data-f="type"]').onchange=d=>{e.type=d.target.value,n.set(t())},i.querySelector('[data-f="date"]').onchange=d=>{d.target.value&&(e.date=d.target.value,n.set(t()))},i.querySelectorAll("[data-new]").forEach(d=>d.onclick=async()=>{let[r,c]=d.dataset.new.split("|"),{openEventEditor:h}=await import("./c-4NN64EFS.js");h({date:e.date,type:e.type,time:c,assignees:[r]})}),l(n,async d=>{if(d=(d||"").trim(),!d||Y)return;let r=R.filter(c=>!c.error).map(c=>({role:c.role,text:c.text}));R.push({role:"user",text:d}),Y=!0,o(n);try{let c=await s.askAssistant(d,r);R.push({role:"assistant",text:c})}catch(c){R.push({role:"assistant",text:fa(c),error:!0})}Y=!1,Pt(),o(n)})}});function o(n){let i=n.el.querySelector("[data-chat]");if(!i)return;i.outerHTML=Ot(),l(n,n.send);let m=n.el.querySelector(".chat");m&&m.lastElementChild?.scrollIntoView({block:"nearest",behavior:"smooth"})}function l(n,i){n.send=i;let m=n.el;m.querySelectorAll("[data-preset]").forEach(h=>h.onclick=()=>i(Be[+h.dataset.preset].q));let d=m.querySelector("[data-chatform]"),r=d.q;r.oninput=()=>{r.style.height="auto",r.style.height=Math.min(r.scrollHeight,140)+"px"},r.onkeydown=h=>{h.key==="Enter"&&!h.shiftKey&&(h.preventDefault(),i(r.value))},d.onsubmit=h=>{h.preventDefault(),i(r.value)};let c=m.querySelector("[data-clearchat]");c&&(c.onclick=()=>{R=[],Pt(),o(n)}),m.querySelector("[data-extclaude]").onclick=()=>Ct(r.value.trim()||"Analise a agenda e me diga o que \xE9 mais importante agora.")}a.refresh=()=>{let n=document.activeElement;if(n&&a.el.contains(n)&&/INPUT|TEXTAREA|SELECT/.test(n.tagName))return;let i=a.el.scrollTop;a.set(t()),a.el.scrollTop=i}}var Rt="seed-v1",Bt=[{id:"c_puravida",name:"Pura Vida",color:"#15803D",logoFile:"pura-vida.jpg"},{id:"c_jggarcia",name:"JG Garcia",color:"#16A34A",logoFile:"jg-garcia.jpg"},{id:"c_garciahortifruti",name:"Garcia Hortifruti",color:"#65A30D",logoFile:"garcia-hortifruti.jpg"},{id:"c_tobiasbbq",name:"Tobia's BBQ",color:"#DC2626",logoFile:"tobias-bbq.jpg"},{id:"c_verdeerosa",name:"Verde e Rosa Multimarcas",color:"#DB2777",logoFile:"verde-e-rosa.jpg"},{id:"c_sophiafestas",name:"Sophia Festas",color:"#0284C7",logoFile:"sophia-festas.jpg"}],ga=async e=>{let t=await(await fetch(e,{cache:"no-cache"})).blob();return new Promise((a,o)=>{let l=new FileReader;l.onload=()=>a(l.result),l.onerror=o,l.readAsDataURL(t)})},He=!1;async function Ht(){if(!(He||!s.ready||s.state.settings.some(e=>e.id===Rt))){He=!0;try{let e=Bt.filter(a=>!s.company(a.id)&&!s.state.companies.some(o=>o.name.trim().toLowerCase()===a.name.toLowerCase())),t=[];for(let a of e){let o=null;try{o=await ga(`media/logos/${a.logoFile}`)}catch{}t.push({id:a.id,name:a.name,color:a.color,logo:o,instagram:"",address:"",contact:"",notes:"",shareToken:null})}t.length&&await s.upsertMany("companies",t),await s.upsert("settings",{id:Rt,done:Bt.map(a=>a.id)})}finally{He=!1}}}var va={feed:"Feed",carrossel:"Carrossel",reels:"Reels",story:"Story",captacao:"Capta\xE7\xE3o",reuniao:"Reuni\xE3o",producao:"Edi\xE7\xE3o",outro:"Tarefa"},$a=["feed","carrossel","reels","story"],Ut=e=>$a.includes(e),Ft={feed:"publicar o feed",carrossel:"publicar o carrossel",reels:"postar o Reels",story:"postar o story",captacao:"a capta\xE7\xE3o",reuniao:"a reuni\xE3o",producao:"a edi\xE7\xE3o",outro:"a tarefa"},ya=e=>e?e.replace(/^0/,"").replace(":00","h").replace(":","h"):"",wa=e=>{let[t,a]=String(e).split(":").map(Number);return t*60+a},zt=e=>Math.round(Date.UTC(+e.slice(0,4),+e.slice(5,7)-1,+e.slice(8,10))/864e5);function _a(e){let t=Number.isFinite(e.reminder)?e.reminder:30,a;return Ut(e.type)?a=[120,30,0,-30]:e.type==="captacao"?a=[1440,120,45,-30]:e.type==="reuniao"?a=[1440,60,15]:a=[30,0],t>=0&&!a.includes(t)&&a.push(t),t<0&&(a=a.filter(o=>o<0)),[...new Set(a)].sort((o,l)=>l-o)}function Vt(e,t,a=4){let o=zt(t.date)*1440+t.minutes,l=[];return e.forEach(n=>{if(!n||!n.time||!n.date||n.status==="feito")return;let i=zt(n.date)*1440+wa(n.time);_a(n).forEach(m=>{if(m<0&&n.status!=="pendente")return;let d=i-m;d<=o&&d>o-a&&l.push({ev:n,offset:m})})}),l}var ka=e=>{if(e>=60){let t=Math.floor(e/60),a=e%60;return a?`${t}h${String(a).padStart(2,"0")}`:`${t}h`}return`${e} min`};function Kt(e,t,a=""){let o=`${va[e.type]||"Tarefa"}${a?" \xB7 "+a:""}`,l=e.title?`\u201C${e.title}\u201D`:"",n=ya(e.time),i=e.location?` \xB7 ${e.location}`:"";return t>=1440?{title:`Amanh\xE3: ${o} \xE0s ${n}`,body:e.type==="captacao"?`Hoje: carregue baterias, esvazie os cart\xF5es e confirme com o cliente.${i}`:`${l}${i}`.trim()||"Confirme o hor\xE1rio com o cliente."}:t>0?{title:`Daqui a ${ka(t)}: ${o}`,body:`${n} \u2014 ${Ft[e.type]||"a tarefa"}${l?" "+l:""}${i}`}:t===0?{title:`Agora: ${o}`,body:`Est\xE1 na hora de ${Ft[e.type]||"fazer a tarefa"}${l?" "+l:""}.`}:{title:Ut(e.type)?`J\xE1 postou? ${o}`:`J\xE1 fez? ${o}`,body:`Era \xE0s ${n}${l?" \u2014 "+l:""}. Toque para marcar como feito.`}}var q=document.getElementById("app");window.__calStarted=!0;var V=null;function xa(){q.innerHTML=`
    <main id="view" class="view"></main>
    <nav class="tabbar" aria-label="Navega\xE7\xE3o">
      ${$e("hoje","today","Hoje")}
      ${$e("mes","calendar","Calend\xE1rio")}
      <button class="tabbar__fab" data-action="new-event" aria-label="Novo evento">${p("plus",28)}</button>
      ${$e("empresas","building","Empresas")}
      ${$e("ajustes","settings","Ajustes")}
    </nav>`}var $e=(e,t,a)=>`<button class="tabbar__btn" data-action="tab" data-tab="${e}">${p(t,24)}<span>${a}</span></button>`;function j(){let e=document.getElementById("view");if(!e)return;let t=window.scrollY,a=e.querySelector('[data-form="note"] input'),o=a?a.value:"",l=a&&document.activeElement===a,n=f.tab==="mes"?xt():f.tab==="empresas"?gt():f.tab==="ajustes"?qt():kt();e.innerHTML=n,document.querySelectorAll(".tabbar__btn").forEach(m=>m.classList.toggle("is-on",m.dataset.tab===f.tab)),window.scrollTo(0,t);let i=e.querySelector('[data-form="note"] input');i&&o&&(i.value=o),i&&l&&i.focus({preventScroll:!0}),Aa()}function Sa(){j(),Me().forEach(e=>e.refresh&&e.refresh())}function se(e){f.tab=e,Ee(),j(),window.scrollTo(0,0)}var Ea={tab:e=>se(e.dataset.tab),"set-person":e=>{f.person=e.dataset.p,Ee(),j()},"set-date":e=>{f.date=e.dataset.k,j()},"go-today":()=>{f.date=$(),j()},week:e=>{f.date=x(f.date,Number(e.dataset.n)),j()},month:e=>{f.month=ke(f.month,Number(e.dataset.n)),f.monthSel=f.month===X($())?$():`${f.month}-01`,j()},"month-today":()=>{f.month=X($()),f.monthSel=$(),j()},"month-select":e=>{f.monthSel=e.dataset.k,X(e.dataset.k)!==f.month&&(f.month=X(e.dataset.k)),j()},"month-company":e=>{f.monthCompany=e.dataset.id||null,j()},"open-day":e=>{f.date=e.dataset.k,se("hoje")},"toggle-tips":()=>{f.showAllTips=!f.showAllTips,j()},"open-event":e=>me(e.dataset.id),assistant:()=>Lt(),"apply-fix":async e=>{let t=s.event(e.dataset.id);if(!t)return;let a;try{a=JSON.parse(e.dataset.patch)}catch{return}let o={};typeof a.time=="string"&&/^\d{2}:\d{2}$/.test(a.time)&&(o.time=a.time),Array.isArray(a.assignees)&&(o.assignees=a.assignees.filter(i=>s.member(i)));let{confirmMove:l}=await import("./c-4NN64EFS.js");if(!await l(t,o))return;let n={...t};await s.upsert("events",{...t,...o}),g("Pronto, ajustado",{action:"Desfazer",onAction:()=>s.upsert("events",n)})},"toggle-done":async e=>{let t=s.event(e.dataset.id);if(!t)return;let a=t.status==="feito"?"pendente":"feito";await s.upsert("events",{...t,status:a}),a==="feito"&&g(`${S[t.type].label} conclu\xEDdo`,{action:"Desfazer",onAction:()=>s.upsert("events",{...s.event(t.id),status:t.status})})},"new-event":e=>{if(!s.state.companies.length)return g("Cadastre uma empresa primeiro"),Ce(null,()=>De({}));De({date:e.dataset.date||null})},"open-company":e=>vt(e.dataset.id),"new-company":()=>Ce(),"del-note":async e=>{let t=s.state.notes.find(a=>a.id===e.dataset.id);await s.remove("notes",e.dataset.id),t&&g("Bilhete apagado",{action:"Desfazer",onAction:()=>s.upsert("notes",t)})},"set-me":e=>{s.setMe(e.dataset.p),g(`Ol\xE1, ${s.member(e.dataset.p).name}!`)},"clear-demo":async()=>{await te({title:"Apagar os dados de exemplo?",text:"O calend\xE1rio ficar\xE1 vazio para voc\xEAs cadastrarem as empresas e eventos reais.",ok:"Apagar exemplos",danger:!0})&&(await s.clearDemo(),g("Pronto! Agora cadastre suas empresas."))},"clear-all":()=>N.clearAll(),ics:e=>N.ics(e),"notify-enable":()=>N.notifyEnable(),"notify-test":()=>N.notifyTest(),"onboarding-again":()=>N.onboardingAgain(),export:()=>N.export(),logout:async()=>{await te({title:"Sair da conta?",ok:"Sair"})&&(await V.signOut(),location.reload())}};document.addEventListener("click",e=>{let t=e.target.closest("[data-action]");if(!t||document.body.classList.contains("is-client"))return;let a=Ea[t.dataset.action];a&&(e.preventDefault(),e.stopPropagation(),a(t))});document.addEventListener("change",e=>{e.target.matches('[data-action-change="import"]')&&N.import(e.target),e.target.closest("[data-notify-form]")&&N.notifyPrefs(e.target.closest("[data-notify-form]")),e.target.closest("[data-routine-form]")&&N.routine(e.target.closest("[data-routine-form]"))});document.addEventListener("submit",async e=>{let t=e.target.closest('[data-form="note"]');if(!t)return;e.preventDefault();let a=t.text.value.trim();if(a){if(!s.me){g("Escolha quem voc\xEA \xE9 em Ajustes");return}await s.upsert("notes",{id:ot("n_"),date:f.date,text:a,author:s.me}),g("Bilhete adicionado")}});function Aa(){document.querySelectorAll("[data-swipe]").forEach(e=>{let t=null,a=null;e.addEventListener("touchstart",o=>{t=o.touches[0].clientX,a=o.touches[0].clientY},{passive:!0}),e.addEventListener("touchend",o=>{if(t==null)return;let l=o.changedTouches[0].clientX-t,n=o.changedTouches[0].clientY-a;if(t=null,Math.abs(l)<50||Math.abs(l)<Math.abs(n)*1.5)return;let i=l<0?1:-1;e.dataset.swipe==="week"?f.date=x(f.date,7*i):(f.month=ke(f.month,i),f.monthSel=`${f.month}-01`),j()})})}var Wt=new Set;function Jt(){if(!s.me)return;let e=new Date,t={date:$(),minutes:e.getHours()*60+e.getMinutes()},a=s.eventsBetween(x(t.date,-1),x(t.date,1),{person:s.me}),o=s.mode==="cloud"&&!!localStorage.getItem("pauta.device");Vt(a,t,2).forEach(({ev:l,offset:n})=>{let i=`${l.id}@${n}@${l.date}${l.time}`;if(Wt.has(i))return;Wt.add(i);let m=Kt(l,n,s.company(l.companyId)?.name||"");g(`${m.title}`,{ms:7e3,action:"Ver",onAction:()=>me(l.id)}),!o&&L()==="granted"&&navigator.serviceWorker&&navigator.serviceWorker.ready.then(d=>d.showNotification(m.title,{body:m.body,tag:`rem-${l.id}`,icon:"icons/icon-192.png",badge:"icons/icon-192.png",data:{url:`./#/e/${l.id}`}})).catch(()=>{})}),Ne(s.eventsOn(t.date,{person:s.me}).filter(l=>l.status!=="feito").length)}function Ve(e=location.hash){let t=/^#\/(e|d)\/([\w-]+)/.exec(e||"");return t?(history.replaceState(null,"",location.pathname+location.search),t[1]==="e"&&s.event(t[2])?(f.date=s.event(t[2]).date,se("hoje"),me(t[2])):t[1]==="d"&&/^\d{4}-\d{2}-\d{2}$/.test(t[2])&&(f.date=t[2],se("hoje")),!0):!1}var Yt={"auth/invalid-credential":"E-mail ou senha incorretos. Confira a senha (toque no olho para ver o que digitou).","auth/wrong-password":"Senha incorreta.","auth/user-not-found":"Este e-mail n\xE3o est\xE1 cadastrado no Firebase (Authentication \u2192 Usu\xE1rios).","auth/invalid-email":"E-mail inv\xE1lido.","auth/too-many-requests":'Muitas tentativas seguidas. Espere alguns minutos ou use "Esqueci minha senha".',"auth/network-request-failed":"Sem conex\xE3o com a internet. Verifique o Wi-Fi/4G e tente de novo.","auth/user-disabled":"Este usu\xE1rio foi desativado no Firebase.","auth/operation-not-allowed":"O login por e-mail/senha n\xE3o est\xE1 ativado no Firebase.","auth/api-key-not-valid":"Configura\xE7\xE3o do Firebase inv\xE1lida (apiKey)."},Gt="",Ue="";function ye(e=""){let t=e||Ue;q.innerHTML=`
  <div class="login">
    <img src="icons/icon-192.png" alt="" width="84" height="84">
    <h1>${u(E.appName)}</h1>
    <p>Agenda de conte\xFAdo \xB7 ${u(E.agencyName)}</p>
    <form class="form" data-login novalidate>
      <div class="fgroup"><label class="flabel" for="l-email">E-mail</label><input id="l-email" class="input" type="email" name="email" value="${u(Gt)}" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" inputmode="email"></div>
      <div class="fgroup"><label class="flabel" for="l-pass">Senha</label>
        <div class="input-eye"><input id="l-pass" class="input" type="password" name="pass" autocomplete="current-password" autocapitalize="none" autocorrect="off" spellcheck="false">
        <button type="button" class="iconbtn iconbtn--sm" data-eye aria-label="Mostrar senha">${p("eye",18)}</button></div>
      </div>
      ${t?`<p class="login__err">${u(t)}</p>`:""}
      <button class="btn btn--primary btn--block" type="submit" data-go>Entrar</button>
      <button class="btn-text btn-text--sm" type="button" data-reset>Esqueci minha senha</button>
    </form>
  </div>`;let a=q.querySelector("[data-login]");q.querySelector("[data-eye]").onclick=()=>{a.pass.type=a.pass.type==="password"?"text":"password"},a.onsubmit=async o=>{o.preventDefault();let l=a.email.value.trim().toLowerCase(),n=a.pass.value;if(Gt=l,Ue="",!l||!n)return ye("Preencha o e-mail e a senha.");let i=a.querySelector("[data-go]");i.disabled=!0,i.textContent="Entrando\u2026";try{await Promise.race([V.signIn(l,n),new Promise((m,d)=>setTimeout(()=>d({code:"timeout"}),2e4))]),i.textContent="Abrindo\u2026"}catch(m){let d=m&&m.code;ye(d==="timeout"?"O servidor demorou para responder. Verifique a internet e tente de novo.":Yt[d]||`N\xE3o foi poss\xEDvel entrar (${d||m?.message||"erro desconhecido"}).`)}},q.querySelector("[data-reset]").onclick=async()=>{let o=a.email.value.trim().toLowerCase();if(!o)return g("Digite seu e-mail primeiro");try{await V.resetPassword(o),g("Enviamos um e-mail para criar uma nova senha (veja tamb\xE9m o spam)",{ms:6e3})}catch(l){g(Yt[l?.code]||"N\xE3o foi poss\xEDvel enviar o e-mail")}}}function Qt(e){document.querySelector("[data-login]")||document.getElementById("view")||(q.innerHTML=`<div class="splash">
    <img src="icons/icon-192.png" alt="" width="72" height="72">
    <h2>N\xE3o consegui conectar</h2>
    <p>Verifique a internet e tente de novo.</p>
    <button class="btn btn--primary" data-retry>Tentar de novo</button>
    <small class="muted">Detalhe: ${u(String(e&&(e.code||e.message)||e))}</small>
  </div>`,q.querySelector("[data-retry]").onclick=()=>location.reload())}function Fe(e="Carregando\u2026"){q.innerHTML=`<div class="splash"><img src="icons/icon-192.png" alt="" width="72" height="72"><p>${u(e)}</p></div>`}function Xt(){xa(),j(),s.on(Sa),s.onError=e=>{let t=e&&/quota/i.test(String(e.name||e.message)),a=e&&/permission/i.test(String(e.code||e.message));g(t?"Mem\xF3ria do aparelho cheia: use logos menores ou ative a nuvem":a?"Sem permiss\xE3o na nuvem: confira as regras do Firebase":"N\xE3o foi poss\xEDvel salvar. Verifique a conex\xE3o.",{ms:5e3})},Zt(),s.on(Zt),s.on(()=>Ne(s.me?s.eventsOn($(),{person:s.me}).filter(e=>e.status!=="feito").length:0)),setInterval(()=>{let e=document.activeElement,t=e&&/INPUT|TEXTAREA|SELECT/.test(e.tagName);f.tab==="hoje"&&!Me().length&&!t&&j(),Jt()},6e4),Jt(),document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&(f.date<$()&&f.tab==="hoje"&&(f.date=$()),j())}),Ht().catch(e=>console.warn("pr\xE9-cadastro",e)),setTimeout(Mt,600),s.mode==="cloud"&&L()==="granted"&&be().catch(()=>{}),setTimeout(()=>Ve(),300)}var ze=null;function Zt(){if(!s.me)return;let e=yt(s.me,14),t=o=>o.date+":"+o.ids.slice().sort().join("|"),a=new Set(e.map(t));if(ze){let o=e.find(l=>!ze.has(t(l))&&l.ids.some(n=>s.event(n)?.updatedBy&&s.event(n).updatedBy!==s.me));o&&g(`Aten\xE7\xE3o: ${o.title} (${o.date.slice(8)}/${o.date.slice(5,7)})`,{action:"Ver",onAction:()=>{f.date=o.date,f.person="all",se("hoje")},ms:7e3})}ze=a}async function Ta(){let e=location.hash||"",t=E.firebase;if(e.startsWith("#/c/")||e.startsWith("#/v/")){Fe("Carregando cronograma\u2026");let n=!!(localStorage.getItem("pauta.me")||localStorage.getItem("cal.team"));try{if(e.startsWith("#/v/")){let d=await nt(e.slice(4));return qe(q,Se(d),{canGoBack:n})}if(!t)return pe(q,"Este link precisa da sincroniza\xE7\xE3o na nuvem ativada.");let{fetchPublic:i}=await import("./c-MGTOXM5K.js"),m=await i(t,e.slice(4));return m?qe(q,Se(m),{canGoBack:n}):pe(q,"Este link n\xE3o existe mais. Pe\xE7a um novo link para a equipe.")}catch(i){return console.error(i),pe(q,"N\xE3o foi poss\xEDvel abrir o cronograma. Verifique a conex\xE3o e tente novamente.")}}if(!t)return await ct(),Xt();Fe("Conectando \xE0 nuvem\u2026");let a=(n,i)=>Promise.race([n,new Promise((m,d)=>setTimeout(()=>d(new Error("tempo esgotado")),i))]);try{let{connect:n}=await import("./c-MGTOXM5K.js");V=await a(n(t),15e3)}catch(n){return console.error(n),Qt(n)}let o=!1,l=!1;setTimeout(()=>{o||Qt(new Error("o login n\xE3o respondeu"))},25e3),V.onUser(async n=>{if(o=!0,!n)return l?location.reload():ye();if(l)return;if(!E.team.some(m=>m.email&&m.email.toLowerCase()===(n.email||"").toLowerCase()))return Ue=`O e-mail ${n.email} n\xE3o faz parte da equipe deste app.`,await V.signOut(),ye();l=!0;try{localStorage.setItem("cal.team","1")}catch{}Fe("Entrando\u2026");try{await Promise.race([lt(V.backend,n),new Promise(m=>setTimeout(m,12e3))])}catch(m){console.error(m),setTimeout(()=>g("N\xE3o consegui carregar os dados agora. Verifique a internet.",{ms:6e3}),800)}Xt()})}navigator.serviceWorker?.addEventListener("message",e=>{if(e.data?.type==="open"&&e.data.url){let t=e.data.url.split("#")[1];t&&Ve("#"+t)}});window.addEventListener("hashchange",()=>{if(/^#\/(e|d)\//.test(location.hash))return Ve();/^#\/(c|v)\//.test(location.hash)&&location.reload()});"serviceWorker"in navigator&&location.protocol!=="file:"&&navigator.serviceWorker.register("sw.js").catch(()=>{});Ta();
