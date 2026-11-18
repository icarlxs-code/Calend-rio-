import{$ as ht,A as u,B as st,C as fe,D as nt,E as te,F as it,G as E,H as rt,I as Y,J as ae,K as ct,L as Ae,M as lt,N as Te,O as n,P as dt,Q as mt,R as h,S as je,T as d,U as D,V as pt,W as Me,X as qe,Y as De,Z as ut,_ as Ce,a as A,aa as g,b as pe,ba as ce,c as F,ca as ft,d as v,da as I,e as y,ea as G,f as Je,fa as C,g as U,ga as bt,h as ne,ha as oe,i as Xe,ia as gt,j,ja as le,k as Z,ka as $t,l as B,la as be,m as w,ma as Pe,n as Qe,o as ee,oa as vt,p as ue,pa as yt,q as he,qa as Ne,r as ie,s as Ze,t as re,u as et,v as V,w as W,x as tt,y as at,z as ot}from"./c-5H7ASYQ4.js";import"./c-VHNSBD2M.js";var Jt=(e,t)=>e&&t&&e[0]<t[1]&&t[0]<e[1],J=e=>n.member(e)?.name||e,ge=e=>["shoot","meeting"].includes(E[e.type]?.kind);function $e(e,t){let a=[],o=I(),l=n.eventsOn(t,{person:e}).filter(i=>i.time&&i.status!=="feito");for(let i=0;i<l.length;i++)for(let m=i+1;m<l.length;m++){let c=l[i],r=l[m];if(!Jt(G(c),G(r)))continue;let p=ge(c)?c:ge(r)?r:null,b=p===c?r:c,_,x;p&&Y(b.type)?(_=`${J(e)}: post durante ${E[p.type].label.toLowerCase()}`,x=`\u201C${C(b)}\u201D \xE0s ${w(b.time)} cai no meio de \u201C${C(p)}\u201D (${w(p.time)}\u2013${w(Z(G(p)[1]))}).`):p&&ge(b)?(_=`${J(e)} em dois lugares ao mesmo tempo`,x=`\u201C${C(c)}\u201D (${w(c.time)}) e \u201C${C(r)}\u201D (${w(r.time)}) se sobrep\xF5em.`):(_=`${J(e)}: duas tarefas no mesmo hor\xE1rio`,x=`\u201C${C(c)}\u201D (${w(c.time)}) e \u201C${C(r)}\u201D (${w(r.time)}).`),a.push({level:"warn",kind:"conflict",icon:"alert",ids:[c.id,r.id],title:_,text:x,fixes:gt(e,c,r)})}let s=l.filter(ge);for(let i=0;i<s.length-1;i++){let m=s[i],c=s[i+1],r=j(c.time)-G(m)[1];(m.location||m.companyId)!==(c.location||c.companyId)&&r>=0&&r<o.travelMin&&a.push({level:"warn",kind:"conflict",icon:"route",ids:[m.id,c.id],title:`${J(e)}: pouco tempo de deslocamento`,text:`S\xF3 ${r} min entre \u201C${C(m)}\u201D e \u201C${C(c)}\u201D, em lugares diferentes (combinado: ${o.travelMin} min).`,fixes:[{label:`Mover para ${w(Z(G(m)[1]+o.travelMin))}`,eventId:c.id,patch:{time:Z(Math.ceil((G(m)[1]+o.travelMin)/15)*15)}}]})}return a}function wt(e,t="all"){let a=[],o=t==="all"?n.team.map(r=>r.id):[t];o.forEach(r=>a.push(...$e(r,e)));let l=I(),s=n.eventsOn(e,{person:t}),i={};if(s.filter(r=>r.time&&["feed","reels","carrossel"].includes(r.type)).forEach(r=>(i[r.companyId]||=[]).push(r)),Object.values(i).forEach(r=>{for(let p=0;p<r.length-1;p++){let b=j(r[p+1].time)-j(r[p].time);b<180&&a.push({level:"info",icon:"clock",ids:[r[p].id,r[p+1].id],title:`${n.company(r[p].companyId)?.name||"Empresa"}: posts muito pr\xF3ximos`,text:`Dois posts de feed/Reels com s\xF3 ${W(b)} de diferen\xE7a. Espacem ao menos 3 h para um n\xE3o \u201Croubar\u201D o alcance do outro.`})}}),e===v()){let r=s.filter(p=>p.time&&p.status==="pendente"&&j(p.time)+15<B());r.length&&a.unshift({level:"warn",kind:"late",icon:"flag",ids:r.map(p=>p.id),title:r.length===1?"1 tarefa atrasada":`${r.length} tarefas atrasadas`,text:r.map(p=>`${w(p.time)} ${C(p)}`).join(" \xB7 ")+". Marque como feito ou reagende."})}let m=s.filter(r=>!(r.assignees||[]).length);if(m.length&&t==="all"&&a.push({level:"warn",icon:"user",ids:m.map(r=>r.id),title:"Tarefa sem respons\xE1vel",text:m.map(r=>`${w(r.time)} ${C(r)}`).join(" \xB7 ")+". Definam quem vai fazer."}),t==="all"&&n.team.length===2){let[r,p]=n.team,b=n.eventsOn(e,{person:r.id}).length,_=n.eventsOn(e,{person:p.id}).length;if(Math.abs(b-_)>=4){let[x,z]=b>_?[r,p]:[p,r];a.push({level:"info",icon:"users",title:"Dia desequilibrado",text:`${x.name} tem ${Math.max(b,_)} tarefas e ${z.name} tem ${Math.min(b,_)}. Que tal passar alguns stories para o ${z.name}?`})}}o.forEach(r=>{let p=oe(r,e),b=n.eventsOn(e,{person:r}).length;!p.dayOff&&p.minutes!=null&&b&&p.longest<45&&a.push({level:"info",kind:"rest",icon:"clock",title:`${J(r)} est\xE1 sem pausa`,text:`O maior intervalo livre do dia \xE9 de ${W(p.longest)}. Programem posts com anteced\xEAncia para abrir espa\xE7o.`}),p.dayOff&&b&&a.push({level:"info",kind:"rest",icon:"clock",title:`${J(r)}: dia de folga`,text:`H\xE1 ${b} tarefa${b>1?"s":""} marcada${b>1?"s":""} na folga. Posts podem ficar programados para ningu\xE9m trabalhar.`}),b>l.maxTasks&&a.push({level:"warn",kind:"rest",icon:"alert",title:`${J(r)} sobrecarregado`,text:`${b} tarefas (limite combinado: ${l.maxTasks}).`})}),n.eventsOn(y(e,1),{person:t}).filter(r=>r.type==="captacao").forEach(r=>{let p=n.company(r.companyId);a.push({level:"prep",icon:"camera",ids:[r.id],title:`Amanh\xE3: capta\xE7\xE3o${p?" na "+p.name:""} \xE0s ${w(r.time)}`,text:"Hoje: carregue baterias, esvazie cart\xF5es de mem\xF3ria, confirme o hor\xE1rio com o cliente e defina o roteiro de tomadas."})}),!a.some(r=>r.kind==="conflict")&&s.length&&a.push({level:"ok",icon:"check",title:"Agenda sem conflitos",text:"Ningu\xE9m est\xE1 em dois lugares ao mesmo tempo."});let c=Math.abs(Xe("2024-01-01",e))%Ae.length;return a.push({level:"tip",icon:"bulb",title:"Dica do dia",text:Ae[c]}),a}function _t(e,t=14){let a=[],o=v();for(let l=0;l<t;l++){let s=y(o,l);$e(e,s).forEach(i=>a.push({...i,date:s}))}return a}function kt(e="all"){let t=v(),a=B();return n.eventsOn(t,{person:e}).find(o=>o.time&&o.status!=="feito"&&j(o.time)+ae(o)>a)||null}function xt(){return`<div class="seg" role="tablist">
    ${[{id:"all",name:"Todos"},...n.team].map(t=>`<button class="seg__btn${h.person===t.id?" is-on":""}" data-action="set-person" data-p="${t.id}">
      ${t.id==="all"?d("users",15):D(t.id,18)}<span>${u(t.name)}${n.me===t.id?"<em> (voc\xEA)</em>":""}</span></button>`).join("")}
  </div>`}function Xt(e,t=4){let a=[];return e.forEach(o=>{a.includes(o.companyId)||a.push(o.companyId)}),a.slice(0,t).map(o=>`<i style="background:${n.company(o)?.color||"#999"}"></i>`).join("")}function St(){let e=h.date,t=v(),a=n.eventsOn(e,{person:h.person}),o=wt(e,h.person),l=o.filter(f=>f.level==="warn"&&f.icon!=="flag").flatMap(f=>f.ids||[]),s=n.member(n.me),i=Je(e),m=Array.from({length:7},(f,S)=>y(i,S)),c=(()=>{let f=F(m[0]),S=F(m[6]);return f.getMonth()===S.getMonth()?`${f.getDate()}\u2013${S.getDate()} de ${he[S.getMonth()]}`:`${f.getDate()} ${he[f.getMonth()]} \u2013 ${S.getDate()} ${he[S.getMonth()]}`})(),r=`
  <header class="hdr">
    <div class="hdr__row">
      <div class="hdr__titles">
        <p class="hdr__eyebrow">${e===t?`${at()}${s?", "+u(s.name):""}`:u(ie(e))}</p>
        <h1>${u(et(e))}${e===t?`<span class="hdr__date">${u(Ze(e))}</span>`:""}</h1>
      </div>
      <div class="hdr__actions">
        ${e!==t?'<button class="chip chip--accent" data-action="go-today">Hoje</button>':""}
        <button class="iconbtn iconbtn--ai" data-action="assistant" aria-label="Assistente">${d("sparkle",20)}</button>
        <button class="iconbtn" data-action="tab" data-tab="ajustes" aria-label="Perfil">${s?D(s.id,34):d("user",20)}</button>
      </div>
    </div>
    ${xt()}
    <div class="week">
      <div class="week__bar">
        <button class="iconbtn iconbtn--sm" data-action="week" data-n="-7" aria-label="Semana anterior">${d("left",18)}</button>
        <span>${u(c)}</span>
        <button class="iconbtn iconbtn--sm" data-action="week" data-n="7" aria-label="Pr\xF3xima semana">${d("right",18)}</button>
      </div>
      <div class="week__days" data-swipe="week">
        ${m.map(f=>{let S=F(f),O=n.eventsOn(f,{person:h.person}),k=O.filter(se=>se.status!=="feito").length;return`<button class="wday${f===e?" is-sel":""}${f===t?" is-today":""}" data-action="set-date" data-k="${f}">
            <span class="wday__l">${ee[S.getDay()]}</span>
            <span class="wday__n">${S.getDate()}</span>
            <span class="wday__dots">${Xt(O,3)}${O.length?"":'<i class="none"></i>'}</span>
            ${k?`<span class="sr">${k} pendentes</span>`:""}
          </button>`}).join("")}
      </div>
    </div>
  </header>`,p={};a.forEach(f=>p[f.type]=(p[f.type]||0)+1);let b=a.filter(f=>f.status==="feito").length,_=a.length?Math.round(b/a.length*100):0,x=a.length?`<div class="summary">
        <div class="summary__progress">
          <div class="ring" style="--p:${_}"><span>${_}%</span></div>
          <div><strong>${b} de ${a.length}</strong><small>tarefas conclu\xEDdas</small></div>
        </div>
        <div class="summary__types">
          ${Object.entries(p).sort((f,S)=>S[1]-f[1]).map(([f,S])=>`<span class="tcount tbadge--${f}">${d(E[f].icon,13)}<b>${S}</b> ${E[f].label}</span>`).join("")}
        </div>
      </div>`:"",z=h.person==="all"?`<section class="block">
      <h2 class="block__title">${d("route",16)} Onde cada um vai estar</h2>
      <div class="team">${n.team.map(f=>Qt(f,e)).join("")}</div>
    </section>`:"",K="";if(e===t){let f=kt(h.person);if(f){let S=n.company(f.companyId),O=j(f.time)-B(),k=S?.color||"#555";K=`<button class="next" style="--cc:${k};--cc-soft:${fe(k,.12)}" data-action="open-event" data-id="${f.id}">
        <div class="next__label">${d("bell",14)} ${O>0?"Pr\xF3ximo \xB7 "+tt(O):"Acontecendo agora"}</div>
        <div class="next__row">
          ${Me(S,44)}
          <div class="next__txt">
            <strong>${w(f.time)} \xB7 ${u(E[f.type].label)} \xB7 ${u(S?.name||"")}</strong>
            <span>${u(f.title||"")}</span>
          </div>
          ${pt(f.assignees,26)}
        </div>
        ${f.location?`<div class="next__loc">${d("pin",13)} ${u(f.location)}</div>`:""}
      </button>`}}let Q=h.showAllTips?o:o.filter((f,S)=>f.level==="warn"||S<2),$=o.length-Q.length,T=`<section class="block">
    <h2 class="block__title">${d("bulb",16)} Dicas e alertas</h2>
    <div class="tips">${Q.map(Zt).join("")}</div>
    ${$>0?`<button class="btn-text btn-text--sm" data-action="toggle-tips">Ver mais ${$} dica${$>1?"s":""}</button>`:h.showAllTips&&o.length>2?'<button class="btn-text btn-text--sm" data-action="toggle-tips">Mostrar menos</button>':""}
  </section>`,q;if(!a.length)q=De("Dia livre",h.person==="all"?"Nada agendado para este dia.":`Nada agendado para ${n.member(h.person)?.name}.`,`<button class="btn btn--primary" data-action="new-event" data-date="${e}">${d("plus",18)} Adicionar</button>`);else{let f=[{k:"Manh\xE3",icon:"sun",items:a.filter(k=>k.time&&j(k.time)<720)},{k:"Tarde",items:a.filter(k=>k.time&&j(k.time)>=720&&j(k.time)<1080)},{k:"Noite",items:a.filter(k=>k.time&&j(k.time)>=1080)},{k:"Sem hor\xE1rio",items:a.filter(k=>!k.time)}],S=B(),O=e!==t;q=f.filter(k=>k.items.length).map(k=>`
      <div class="tl-group">
        <h3 class="tl-group__h">${k.k}<span>${k.items.length}</span></h3>
        ${k.items.map(se=>{let Ge="";return!O&&se.time&&j(se.time)>S&&(O=!0,Ge=`<div class="nowline"><span>Agora \xB7 ${w(`${String(new Date().getHours()).padStart(2,"0")}:${String(new Date().getMinutes()).padStart(2,"0")}`)}</span></div>`),Ge+qe(se,{highlight:l})}).join("")}
      </div>`).join(""),!O&&e===t&&(q+=`<div class="nowline nowline--end"><span>Agora \xB7 ${w(`${String(new Date().getHours()).padStart(2,"0")}:${String(new Date().getMinutes()).padStart(2,"0")}`)} \xB7 fim da agenda</span></div>`)}let R=n.notesOn(e),Ee=`<section class="block">
    <h2 class="block__title">${d("note",16)} Bilhetes do dia</h2>
    <div class="notes">
      ${R.map(f=>`<div class="note">
        <p>${u(f.text)}</p>
        <footer>${D(f.author,18)}<span>${u(n.member(f.author)?.name||"")}</span>
          <button class="note__del" data-action="del-note" data-id="${f.id}" aria-label="Apagar bilhete">${d("x",14)}</button></footer>
      </div>`).join("")}
      <form class="note-add" data-form="note">
        <input name="text" placeholder="Escreva um bilhete para a dupla\u2026" autocomplete="off" maxlength="280">
        <button class="iconbtn iconbtn--accent" aria-label="Adicionar bilhete">${d("plus",18)}</button>
      </form>
    </div>
  </section>`;return`${r}
  <div class="page">
    ${n.demo?ea():""}
    ${K}
    <button class="brief" data-action="assistant">
      <span class="brief__ic">${d("sparkle",18)}</span>
      <div><strong>Assistente</strong>${le(e,h.person).map(f=>`<p>${u(f)}</p>`).join("")}</div>
      ${d("right",18,"muted")}
    </button>
    ${z}
    <section class="block">
      <h2 class="block__title">${d("clock",16)} Agenda ${h.person==="all"?"da dupla":"de "+u(n.member(h.person)?.name||"")}</h2>
      ${x}
      ${q}
    </section>
    ${T}
    ${Ee}
  </div>`}function Qt(e,t){let a=n.eventsOn(t,{person:e.id}),o=t===v()?B():-1,l=a.filter(r=>["shoot","meeting"].includes(E[r.type]?.kind)),s=a.filter(r=>Y(r.type)).length,i=a.find(r=>r.time&&r.status!=="feito"&&j(r.time)+ae(r)>o),m=oe(e.id,t),c=m.dayOff?"Folga":`${W(Math.round(m.minutes/15)*15)||"0 min"} livres`;return`<button class="team__col" data-action="set-person" data-p="${e.id}">
    <span class="team__free ${m.dayOff?"is-off":m.minutes>=240?"is-good":m.minutes>=120?"is-mid":"is-low"}">${d("clock",12)} ${c}</span>
    <div class="team__head">${D(e.id,30)}<div><strong>${u(e.name)}</strong><small>${a.length} tarefa${a.length===1?"":"s"} \xB7 ${s} post${s===1?"":"s"}</small></div></div>
    <ul class="team__where">
      ${l.length?l.map(r=>`<li>${d(E[r.type].icon,13)}<span><b>${w(r.time)}</b> ${u(n.company(r.companyId)?.name||"")}</span></li>`).join(""):`<li class="muted">${d("building",13)}<span>Trabalho interno / remoto</span></li>`}
    </ul>
    ${i?`<div class="team__next">Pr\xF3ximo: <b>${w(i.time)}</b> ${u(E[i.type].label)} \xB7 ${u(n.company(i.companyId)?.name||"")}</div>`:`<div class="team__next muted">${a.length?"Tudo conclu\xEDdo \u2713":"Livre"}</div>`}
  </button>`}function Zt(e){let t=e.fixes?.length?`<div class="fixes">${e.fixes.map(a=>`<button class="fixbtn" data-action="apply-fix" data-id="${a.eventId}" data-patch="${u(JSON.stringify(a.patch))}">${d("check",13)} ${u(a.label)}</button>`).join("")}</div>`:"";return`<div class="tip tip--${e.level}"${e.ids?.length===1&&!t?` data-action="open-event" data-id="${e.ids[0]}"`:""}>
    <span class="tip__ic">${d(e.icon,16)}</span>
    <div><strong>${u(e.title)}</strong><p>${u(e.text)}</p>${t}</div>
  </div>`}function ea(){return`<div class="banner">
    ${d("sparkle",18)}
    <p><strong>Voc\xEA est\xE1 vendo dados de exemplo.</strong> Explore \xE0 vontade e, quando quiser come\xE7ar de verdade, apague os exemplos.</p>
    <button class="btn btn--soft btn--sm" data-action="clear-demo">Apagar exemplos</button>
  </div>`}function Et(){let e=h.month,[t,a]=e.split("-").map(Number),o=new Date(t,a-1,1),l=y(pe(o),-o.getDay()),s=v(),i=Array.from({length:42},($,T)=>y(l,T)),c=i.slice(35).some($=>$.slice(0,7)===e)?i:i.slice(0,35),r={person:h.person,companyId:h.monthCompany},p=n.companiesSorted(),b=h.monthSel,_=n.eventsOn(b,r),x=n.eventsBetween(`${e}-01`,`${e}-31`,r),z=x.filter($=>Y($.type)).length,K=x.filter($=>$.type==="captacao").length,Q=x.filter($=>$.type==="reuniao").length;return`
  <header class="hdr">
    <div class="hdr__row">
      <div class="hdr__titles">
        <p class="hdr__eyebrow">Calend\xE1rio</p>
        <h1>${u(re(e).split(" ")[0])}<span class="hdr__date">${e.slice(0,4)}</span></h1>
      </div>
      <div class="hdr__actions">
        <button class="iconbtn" data-action="month" data-n="-1" aria-label="M\xEAs anterior">${d("left",20)}</button>
        <button class="chip" data-action="month-today">Hoje</button>
        <button class="iconbtn" data-action="month" data-n="1" aria-label="Pr\xF3ximo m\xEAs">${d("right",20)}</button>
      </div>
    </div>
    ${xt()}
  </header>
  <div class="page">
    <div class="chips-scroll">
      <button class="chip${h.monthCompany?"":" is-on"}" data-action="month-company" data-id="">Todas as empresas</button>
      ${p.map($=>`<button class="chip chip--co${h.monthCompany===$.id?" is-on":""}" style="--cc:${$.color}" data-action="month-company" data-id="${$.id}">${Me($,18,5)}${u($.name)}</button>`).join("")}
    </div>

    <div class="mstats">
      <div><b>${z}</b><span>posts</span></div>
      <div><b>${K}</b><span>capta\xE7\xF5es</span></div>
      <div><b>${Q}</b><span>reuni\xF5es</span></div>
      <div><b>${x.filter($=>$.status==="feito").length}/${x.length}</b><span>conclu\xEDdos</span></div>
    </div>

    <div class="month" data-swipe="month">
      <div class="month__wd">${ue.map($=>`<span>${$}</span>`).join("")}</div>
      <div class="month__grid">
        ${c.map($=>{let T=$.slice(0,7)===e,q=n.eventsOn($,r),R=q.some(Ee=>Ee.type==="captacao");return`<button class="mday${T?"":" is-out"}${$===s?" is-today":""}${$===b?" is-sel":""}" data-action="month-select" data-k="${$}">
            <span class="mday__n">${Number($.slice(8))}</span>
            ${q.length?`<span class="mday__bars">${ta(q)}</span><span class="mday__count">${R?d("camera",10):""}${q.length}</span>`:""}
          </button>`}).join("")}
      </div>
    </div>

    <section class="block">
      <div class="block__row">
        <h2 class="block__title">${u(V(b))}</h2>
        <button class="btn-text btn-text--sm" data-action="open-day" data-k="${b}">Abrir dia ${d("right",14)}</button>
      </div>
      ${_.length?_.map($=>qe($)).join(""):De("Nada neste dia","Toque no + para agendar.",`<button class="btn btn--soft" data-action="new-event" data-date="${b}">${d("plus",16)} Novo evento</button>`)}
    </section>

    ${p.length?`<section class="block">
      <h2 class="block__title">Legenda</h2>
      <div class="legend">${p.map($=>`<span><i style="background:${$.color}"></i>${u($.name)}</span>`).join("")}</div>
    </section>`:""}
  </div>`}function ta(e){let t={};return e.forEach(a=>t[a.companyId]=(t[a.companyId]||0)+1),Object.entries(t).slice(0,4).map(([a])=>`<i style="background:${n.company(a)?.color||"#999"}"></i>`).join("")}var Tt="pauta.device",jt="pauta.notifyPrefs",Mt=()=>/iPhone|iPad|iPod/.test(navigator.userAgent)||navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1,aa=()=>"serviceWorker"in navigator&&"PushManager"in window&&"Notification"in window,H=()=>"Notification"in window?Notification.permission:"unsupported",de=()=>Mt()&&!te(),Oe=()=>{try{return{reminders:!0,partner:!0,daily:!0,...JSON.parse(localStorage.getItem(jt)||"{}")}}catch{return{reminders:!0,partner:!0,daily:!0}}},At=e=>{let t="=".repeat((4-e.length%4)%4),a=atob((e+t).replace(/-/g,"+").replace(/_/g,"/"));return Uint8Array.from(a,o=>o.charCodeAt(0))},oa=async e=>{let t=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(e));return"d_"+Array.from(new Uint8Array(t).slice(0,16),a=>a.toString(16).padStart(2,"0")).join("")};async function ve(){return de()?{ok:!1,reason:"install"}:aa()?await Notification.requestPermission()!=="granted"?{ok:!1,reason:"denied"}:n.mode!=="cloud"?{ok:!0,local:!0}:ye():{ok:!1,reason:"unsupported"}}async function ye(){if(n.mode!=="cloud"||H()!=="granted"||!n.me)return{ok:!1,reason:"not-ready"};let t=(await n.readDoc("meta/push"))?.vapidPublicKey;if(!t)return{ok:!1,reason:"server"};let a=await navigator.serviceWorker.ready,o=await a.pushManager.getSubscription();if(o&&o.options?.applicationServerKey){let i=new Uint8Array(o.options.applicationServerKey),m=At(t);(i.length!==m.length||i.some((c,r)=>c!==m[r]))&&(await o.unsubscribe(),o=null)}o||(o=await a.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:At(t)}));let l=o.toJSON(),s=await oa(l.endpoint);return n.writeRaw("devices",{id:s,member:n.me,subscription:{endpoint:l.endpoint,keys:l.keys},prefs:Oe(),device:Mt()?"iPhone":navigator.platform||"navegador",updatedAt:Date.now()}),localStorage.setItem(Tt,s),{ok:!0,id:s}}async function qt(e){localStorage.setItem(jt,JSON.stringify(e)),n.mode==="cloud"&&H()==="granted"&&await ye()}async function we(){let e=localStorage.getItem(Tt);return n.mode==="cloud"&&e?(n.writeRaw("pings",{id:"p_"+Date.now().toString(36),device:e,member:n.me,at:Date.now()}),"server"):(await(await navigator.serviceWorker.ready).showNotification("Notifica\xE7\xF5es ativadas \u2713",{body:"\xC9 assim que os lembretes v\xE3o chegar.",icon:"icons/icon-192.png",badge:"icons/icon-192.png",tag:"teste"}),"local")}function Ie(e){try{if(!("setAppBadge"in navigator))return;e>0?navigator.setAppBadge(e).catch(()=>{}):navigator.clearAppBadge().catch(()=>{})}catch{}}var He="pauta.onboarded",_e="pauta.notifyAskedAt";function Dt(){if(!localStorage.getItem(He))return Be(n.me?["welcome","notify","done"]:["welcome","who","notify","done"]);if(!n.me&&n.mode==="local")return Be(["who"]);let t=Number(localStorage.getItem(_e)||0);if(te()&&H()==="default"&&Date.now()-t>3*864e5)return Be(["notify"])}function Re(e,t,a="agora"){return`<div class="nprev">
    <img src="icons/icon-192.png" alt="">
    <div><div class="nprev__top"><b>${u(A.appName.toUpperCase())}</b><span>${u(a)}</span></div>
    <strong>${u(e)}</strong><p>${u(t)}</p></div>
  </div>`}function sa(e,t,a){let o=n.member(n.me),l=n.team.find(i=>i.id!==n.me)||n.team[1]||n.team[0],s=a>1?`<div class="ob__dots">${Array.from({length:a},(i,m)=>`<i class="${m===t?"is-on":""}"></i>`).join("")}</div>`:"";return e==="welcome"?`<div class="ob__art"><img class="ob__icon" src="icons/icon-512.png" alt=""></div>
      <h1>Bem-vindo ao ${u(A.appName)}</h1>
      <p>A agenda de conte\xFAdo de ${u(A.agencyName)}: posts, stories, reels e capta\xE7\xF5es de todas as empresas, num lugar s\xF3.</p>
      ${s}
      <button class="btn btn--primary btn--block" data-next>Come\xE7ar</button>`:e==="who"?`<div class="ob__art ob__art--sm">${d("user",34)}</div>
      <h1>Quem vai usar este celular?</h1>
      <p>Assim o app sabe de quem s\xE3o os lembretes e avisa o parceiro quando voc\xEA marcar algo.</p>
      <div class="whogrid ob__who">${n.team.map(i=>`<button class="whobtn${n.me===i.id?" is-on":""}" style="--mc:${i.color}" data-me="${i.id}">${D(i.id,36)}<span>${u(i.name)}</span><i class="whobtn__check">${d("check",14)}</i></button>`).join("")}</div>
      ${s}
      <button class="btn btn--primary btn--block" data-next ${n.me?"":"disabled"}>Continuar</button>`:e==="notify"?`<div class="ob__previews">
        ${Re("Daqui a 2h: Reels \xB7 Pura Vida","18h \u2014 postar o Reels \u201CBastidores\u201D","agora")}
        ${Re(`${l?.name||"Seu parceiro"} marcou para voc\xEA`,"Story \xB7 Caf\xE9 Aroma \u2014 amanh\xE3, 16h","h\xE1 2 min")}
        ${Re(`Bom dia, ${o?.name||"Henrique"}! Seu dia hoje`,"5 tarefas \xB7 primeira: 11h30 Feed \xB7 Studio Fit","8:00")}
      </div>
      <h1>Nunca mais esque\xE7a um post</h1>
      <p>Lembretes 2h e 30 min antes de cada post, aviso na v\xE9spera das capta\xE7\xF5es, cobran\xE7a se algo ficou para tr\xE1s e aviso quando o parceiro marcar algo para voc\xEA.</p>
      <div data-notify-msg></div>
      ${s}
      <button class="btn btn--primary btn--block" data-enable>${d("bell",18)} Ativar notifica\xE7\xF5es</button>
      <button class="btn btn--ghost btn--block" data-skip>Agora n\xE3o</button>`:`<div class="ob__art ob__art--ok">${d("check",40)}</div>
    <h1>Tudo pronto${o?", "+u(o.name):""}!</h1>
    <ul class="ob__tips">
      <li>${d("plus",18)}<span>Toque no <b>+</b> para marcar posts, capta\xE7\xF5es e reuni\xF5es.</span></li>
      <li>${d("sparkle",18)}<span>O <b>Assistente</b> avisa conflitos e sugere os melhores hor\xE1rios.</span></li>
      <li>${d("link",18)}<span>Em <b>Empresas</b>, mande para cada cliente o link do cronograma dele.</span></li>
    </ul>
    ${s}
    <button class="btn btn--primary btn--block" data-next>Abrir a agenda</button>`}function Be(e){if(document.querySelector(".ob"))return;let t=0,a=document.createElement("div");a.className="ob",a.innerHTML='<div class="ob__card"></div>',document.body.appendChild(a),requestAnimationFrame(()=>a.classList.add("is-in"));let o=a.querySelector(".ob__card"),l=()=>{(e.includes("welcome")||e.includes("done"))&&localStorage.setItem(He,"1"),a.classList.remove("is-in"),setTimeout(()=>a.remove(),400)},s=c=>{if(c>=e.length)return l();t=c,o.classList.remove("is-shown"),setTimeout(()=>{o.innerHTML=sa(e[t],t,e.length),m(),o.classList.add("is-shown")},o.innerHTML?180:0)},i=(c,r="info")=>{let p=o.querySelector("[data-notify-msg]");p&&(p.innerHTML=`<div class="ob__msg ob__msg--${r}">${c}</div>`)},m=()=>{o.querySelectorAll("[data-next]").forEach(p=>p.onclick=()=>s(t+1)),o.querySelectorAll("[data-me]").forEach(p=>p.onclick=()=>{n.setMe(p.dataset.me),o.querySelectorAll("[data-me]").forEach(b=>b.classList.toggle("is-on",b===p)),o.querySelector("[data-next]").disabled=!1});let c=o.querySelector("[data-skip]");c&&(c.onclick=()=>{localStorage.setItem(_e,String(Date.now())),s(t+1)});let r=o.querySelector("[data-enable]");r&&(r.onclick=async()=>{if(localStorage.setItem(_e,String(Date.now())),de()){i(`<b>Primeiro instale o app.</b> No iPhone, as notifica\xE7\xF5es s\xF3 funcionam pelo \xEDcone da Tela de In\xEDcio:<br>
          1. Toque em ${d("share",14)} <b>Compartilhar</b><br>2. <b>Adicionar \xE0 Tela de In\xEDcio</b><br>3. Abra o ${u(A.appName)} pelo \xEDcone`,"warn"),r.outerHTML='<button class="btn btn--primary btn--block" data-next>Entendi</button>',m();return}r.disabled=!0,r.innerHTML="Aguardando permiss\xE3o\u2026";let p=await ve().catch(()=>({ok:!1,reason:"error"}));p.ok?(p.local?i("Ativado neste celular. Para os avisos chegarem com o app fechado e no celular do parceiro, falta ligar o servidor de notifica\xE7\xF5es (Ajustes \u2192 Notifica\xE7\xF5es).","ok"):(i("Pronto! Voc\xEA vai receber uma notifica\xE7\xE3o de teste em instantes.","ok"),we().catch(()=>{})),r.outerHTML='<button class="btn btn--primary btn--block" data-next>Continuar</button>',o.querySelector("[data-skip]")?.remove(),m()):p.reason==="server"?(i("Permiss\xE3o concedida! O servidor de notifica\xE7\xF5es ainda n\xE3o foi publicado; quando for, este celular \xE9 cadastrado sozinho.","ok"),r.outerHTML='<button class="btn btn--primary btn--block" data-next>Continuar</button>',m()):p.reason==="denied"?(i(`As notifica\xE7\xF5es foram bloqueadas. Para ligar depois: <b>Ajustes do iPhone \u2192 Notifica\xE7\xF5es \u2192 ${u(A.appName)}</b>.`,"warn"),r.outerHTML='<button class="btn btn--primary btn--block" data-next>Continuar</button>',m()):(i("Este aparelho n\xE3o aceita notifica\xE7\xF5es deste app.","warn"),r.disabled=!1,r.innerHTML="Tentar de novo")})};s(0)}function Ct(){localStorage.removeItem(He),localStorage.removeItem(_e),g("A apresenta\xE7\xE3o aparece na pr\xF3xima abertura")}function Pt(){let e=n.member(n.me),t=n.mode==="cloud",a="Notification"in window&&Notification.permission==="granted";return`
  <header class="hdr">
    <div class="hdr__row"><div class="hdr__titles"><p class="hdr__eyebrow">${u(A.appName)} \xB7 ${u(A.agencyName)}</p><h1>Ajustes</h1></div></div>
  </header>
  <div class="page">
    <section class="block">
      <h2 class="block__title">${d("user",16)} Quem est\xE1 usando este celular?</h2>
      ${t?`<div class="card card--row">${e?D(e.id,40):d("user",24)}<div><strong>${u(e?.name||n.user?.email||"")}</strong><small>${u(n.user?.email||"")}</small></div>
            <button class="btn btn--soft btn--sm" data-action="logout">${d("logout",16)} Sair</button></div>`:`<div class="whogrid">${n.team.map(o=>`<button class="whobtn${n.me===o.id?" is-on":""}" style="--mc:${o.color}" data-action="set-me" data-p="${o.id}">${D(o.id,34)}<span>${u(o.name)}</span><i class="whobtn__check">${d("check",14)}</i></button>`).join("")}</div>
           <p class="fhelp">Usado para sauda\xE7\xE3o, \u201CCriado por\u201D e nos lembretes.</p>`}
    </section>

    ${ia()}

    <section class="block">
      <h2 class="block__title">${d("sparkle",16)} Assistente e Claude</h2>
      <div class="card card--row">
        ${d("sparkle",22)}
        <div><strong>Assistente autom\xE1tico ativo</strong><small>Confere conflitos, tempo livre e melhores hor\xE1rios sozinho, sem internet e sem chave.</small></div>
        <button class="btn btn--soft btn--sm" data-action="assistant">Abrir</button>
      </div>
      <p class="fhelp">Para perguntas abertas (ideias, reorganizar a semana), use \u201CPerguntar ao Claude\u201D no Assistente. Abre o Claude com o seu login normal, sem chave de API.</p>
    </section>

    ${na()}

    <section class="block">
      <h2 class="block__title">${d("calendar",16)} Lembretes no Calend\xE1rio do iPhone</h2>
      <div class="card">
        <p>Envie a agenda para o <b>Calend\xE1rio do iPhone</b> com alarmes. Assim o celular avisa na hora certa, mesmo com o app fechado.</p>
        <div class="btnrow">
          <button class="btn btn--primary btn--sm" data-action="ics" data-who="me" data-days="7">${d("download",16)} Minha semana</button>
          <button class="btn btn--soft btn--sm" data-action="ics" data-who="me" data-days="30">Meus 30 dias</button>
          <button class="btn btn--soft btn--sm" data-action="ics" data-who="all" data-days="7">Semana da dupla</button>
        </div>
        <p class="fhelp">No iPhone, toque em \u201CCalend\xE1rio\u201D ou abra o arquivo baixado e escolha \u201CAdicionar tudo\u201D. Se mudar algo depois, exporte de novo.</p>
      </div>
    </section>

    <section class="block">
      <h2 class="block__title">${d("cloud",16)} Sincroniza\xE7\xE3o</h2>
      <div class="card card--row ${t?"card--ok":"card--warn"}">
        ${d(t?"cloud":"phone",22)}
        <div><strong>${t?"Sincronizado na nuvem":"Salvo s\xF3 neste aparelho"}</strong>
        <small>${t?"Henrique, Matheus e os links dos clientes veem tudo em tempo real.":"Para Henrique e Matheus verem a mesma agenda em celulares diferentes, ative a nuvem (gratuito). Veja o guia no README do projeto."}</small></div>
      </div>
    </section>

    ${te()?"":`<section class="block">
      <h2 class="block__title">${d("phone",16)} Instalar como app</h2>
      <div class="card">
        <ol class="steps">
          <li>Abra este endere\xE7o no <b>Safari</b>.</li>
          <li>Toque em ${d("share",15)} <b>Compartilhar</b>.</li>
          <li>Escolha <b>Adicionar \xE0 Tela de In\xEDcio</b>.</li>
        </ol>
        <p class="fhelp">O app abre em tela cheia, como um aplicativo normal.</p>
      </div>
    </section>`}

    <section class="block">
      <h2 class="block__title">${d("bulb",16)} Melhores hor\xE1rios (refer\xEAncia)</h2>
      <div class="card card--flush">
        <ul class="besttimes">
          ${lt.map(o=>`<li><span class="tbadge tbadge--${o.type}">${d(E[o.type].icon,13)}${E[o.type].label}</span><span>${u(o.text)}</span></li>`).join("")}
        </ul>
        <p class="fhelp pad">M\xE9dias de mercado. Confiram os Insights do Instagram de cada cliente e ajustem: cada p\xFAblico tem seu hor\xE1rio de pico.</p>
      </div>
    </section>

    <section class="block">
      <h2 class="block__title">${d("download",16)} Dados e backup</h2>
      <div class="list">
        <button class="list__row" data-action="export">${d("download",18)}<span>Exportar backup (.json)</span>${d("right",16,"muted")}</button>
        <label class="list__row">${d("upload",18)}<span>Importar backup</span><input type="file" accept="application/json,.json" data-action-change="import" hidden>${d("right",16,"muted")}</label>
        ${n.demo?`<button class="list__row" data-action="clear-demo">${d("sparkle",18)}<span>Apagar dados de exemplo</span>${d("right",16,"muted")}</button>`:""}
        <button class="list__row is-danger" data-action="clear-all">${d("trash",18)}<span>Apagar tudo</span>${d("right",16,"muted")}</button>
      </div>
      <p class="fhelp">${n.state.companies.length} empresas \xB7 ${n.state.events.length} eventos \xB7 ${n.state.notes.length} bilhetes</p>
    </section>
    <p class="about">${u(A.appName)} \u2014 agenda de conte\xFAdo \xB7 v1.0</p>
  </div>`}function na(){let e=H(),t=de(),a=n.mode==="cloud",o=!!localStorage.getItem("pauta.device"),l=Oe(),s,i,m="";return t?(s="warn",i="No iPhone, as notifica\xE7\xF5es s\xF3 funcionam com o app instalado: Compartilhar \u2192 Adicionar \xE0 Tela de In\xEDcio, e abra pelo \xEDcone."):e==="unsupported"?(s="warn",i="Este navegador n\xE3o aceita notifica\xE7\xF5es."):e==="denied"?(s="warn",i=`Bloqueadas. Para ligar: Ajustes do iPhone \u2192 Notifica\xE7\xF5es \u2192 ${A.appName}.`):e!=="granted"?(s="warn",i="Desativadas neste celular.",m='<button class="btn btn--primary btn--sm" data-action="notify-enable">Ativar</button>'):a&&o?(s="ok",i="Ativadas. Os lembretes e os avisos do parceiro chegam mesmo com o app fechado."):a?(s="warn",i="Permiss\xE3o concedida, mas o servidor de notifica\xE7\xF5es ainda n\xE3o foi publicado (veja o README).",m='<button class="btn btn--soft btn--sm" data-action="notify-enable">Tentar</button>'):(s="warn",i="Ativadas s\xF3 com o app aberto. Para receber com o app fechado e no celular do parceiro, ligue a nuvem e o servidor (README)."),`<section class="block">
    <h2 class="block__title">${d("bell",16)} Notifica\xE7\xF5es</h2>
    <div class="card card--row ${s==="ok"?"card--ok":"card--warn"}">
      ${d("bell",22)}
      <div><strong>${s==="ok"?"Funcionando":"Aten\xE7\xE3o"}</strong><small>${u(i)}</small></div>
      ${m}
    </div>
    <form class="list notif-prefs" data-notify-form onsubmit="return false">
      <label class="list__row"><span><b>Lembretes dos meus posts</b><small>2h e 30 min antes, na hora e cobran\xE7a se atrasar</small></span><input type="checkbox" class="switch" name="reminders" ${l.reminders?"checked":""}></label>
      <label class="list__row"><span><b>Avisos do parceiro</b><small>quando marcar, mudar ou concluir algo</small></span><input type="checkbox" class="switch" name="partner" ${l.partner?"checked":""}></label>
      <label class="list__row"><span><b>Resumo do dia</b><small>\xE0s 8h (hoje) e \xE0s 20h (amanh\xE3)</small></span><input type="checkbox" class="switch" name="daily" ${l.daily?"checked":""}></label>
    </form>
    ${e==="granted"?`<button class="btn btn--soft btn--block" data-action="notify-test">${d("bell",16)} Enviar notifica\xE7\xE3o de teste</button>`:""}
    <button class="btn-text btn-text--sm" data-action="onboarding-again">Ver a apresenta\xE7\xE3o de novo</button>
  </section>`}function ia(){let e=I(),t=[0,15,30,45,60,90];return`<section class="block">
    <h2 class="block__title">${d("clock",16)} Rotina e tempo livre</h2>
    <form class="list" data-routine-form onsubmit="return false">
      <label class="list__row"><span>Expediente</span><input type="time" name="workStart" value="${e.workStart}"> <input type="time" name="workEnd" value="${e.workEnd}"></label>
      <label class="list__row"><span>Almo\xE7o</span><input type="time" name="lunchStart" value="${e.lunchStart}"> <input type="time" name="lunchEnd" value="${e.lunchEnd}"></label>
      <label class="list__row"><span>Deslocamento entre lugares</span><select name="travelMin">${t.map(a=>`<option value="${a}"${e.travelMin===a?" selected":""}>${a?a+" min":"n\xE3o considerar"}</option>`).join("")}</select></label>
      <label class="list__row"><span>M\xE1ximo de tarefas/dia</span><select name="maxTasks">${[4,5,6,7,8,10,12,15,20].map(a=>`<option value="${a}"${e.maxTasks===a?" selected":""}>${a}</option>`).join("")}</select></label>
      <div class="list__row list__row--col"><span>Dias de folga</span>
        <div class="daysoff">${ee.map((a,o)=>`<label class="dayoff"><input type="checkbox" name="off" value="${o}"${e.daysOff.includes(o)?" checked":""}><span>${a}</span></label>`).join("")}</div>
      </div>
    </form>
    <p class="fhelp">O assistente usa isso para n\xE3o marcar nada em cima do almo\xE7o, da folga ou fora do expediente, e para proteger o tempo livre de voc\xEAs.</p>
  </section>`}var L={async notifyEnable(){let e=await ve().catch(()=>({ok:!1,reason:"error"}));e.ok?g(e.local?"Ativado (com o app aberto)":"Notifica\xE7\xF5es ativadas"):e.reason==="install"?g("Instale o app na Tela de In\xEDcio primeiro"):e.reason==="denied"?g("Bloqueado: libere em Ajustes do iPhone \u2192 Notifica\xE7\xF5es"):e.reason==="server"?g("Servidor de notifica\xE7\xF5es ainda n\xE3o publicado"):g("N\xE3o foi poss\xEDvel ativar"),n.emit()},async notifyTest(){let e=await we().catch(()=>null);g(e==="server"?"Enviando\u2026 deve chegar em alguns segundos":e?"Notifica\xE7\xE3o enviada":"N\xE3o foi poss\xEDvel enviar")},async notifyPrefs(e){await qt({reminders:e.reminders.checked,partner:e.partner.checked,daily:e.daily.checked}),g("Prefer\xEAncias salvas")},onboardingAgain(){Ct()},async routine(e){let t=(l,s)=>/^\d{2}:\d{2}$/.test(e[l].value)?e[l].value:s,a=I(),o={id:"routine",workStart:t("workStart",a.workStart),workEnd:t("workEnd",a.workEnd),lunchStart:t("lunchStart",a.lunchStart),lunchEnd:t("lunchEnd",a.lunchEnd),travelMin:Number(e.travelMin.value),maxTasks:Number(e.maxTasks.value),daysOff:[...e.querySelectorAll('input[name="off"]:checked')].map(l=>Number(l.value))};if(o.workEnd<=o.workStart)return g("O fim do expediente precisa ser depois do in\xEDcio");if(o.lunchEnd<=o.lunchStart)return g("O fim do almo\xE7o precisa ser depois do in\xEDcio");await n.upsert("settings",o),g("Rotina salva")},async ics(e){let t=e.dataset.who==="me"?n.me:"all";if(e.dataset.who==="me"&&!n.me)return g("Escolha primeiro quem est\xE1 usando este celular");let a=Number(e.dataset.days),o=v(),l=n.eventsBetween(o,y(o,a),{person:t}).filter(i=>i.status!=="feito");if(!l.length)return g("Nada agendado nesse per\xEDodo");let s=t==="all"?`${A.appName} \u2013 Dupla`:`${A.appName} \u2013 ${n.member(t).name}`;await $t(l,`pauta-${t}-${o}.ics`,s)},export(){let e=new Blob([n.exportData()],{type:"application/json"}),t=document.createElement("a");t.href=URL.createObjectURL(e),t.download=`pauta-backup-${v()}.json`,document.body.appendChild(t),t.click(),t.remove(),g("Backup exportado")},async import(e){let t=e.files[0];if(t)try{let a=await t.text(),o=await ft({title:"Importar backup",text:"Como deseja importar?",options:[{label:"Juntar com os dados atuais",value:"merge",primary:!0},{label:"Substituir tudo",value:"replace",danger:!0}]});if(!o)return;await n.importData(a,{replace:o==="replace"}),g("Backup importado")}catch{g("Arquivo inv\xE1lido")}finally{e.value=""}},async clearAll(){await ce({title:"Apagar TUDO?",text:"Empresas, eventos e bilhetes ser\xE3o apagados. Exporte um backup antes, se precisar.",ok:"Apagar tudo",danger:!0})&&(await n.clearAll(),g("Tudo apagado"))}};var P={data:null,tab:"proximos",month:U(v()),sel:v()};function ze(e,t,{canGoBack:a=!1}={}){P.data=t,document.title=`${t.company.name} \xB7 Cronograma`;let o=document.querySelector('meta[name="theme-color"]');o&&o.setAttribute("content",t.company.color),document.body.classList.add("is-client");let l=()=>{e.innerHTML=ca(a),e.querySelectorAll("[data-c]").forEach(s=>s.onclick=()=>{let i=s.dataset.c;if(i==="tab"&&(P.tab=s.dataset.v),i==="month"&&(P.month=ne(P.month,Number(s.dataset.v))),i==="sel"&&(P.sel=s.dataset.v),i==="back"){location.hash="",location.reload();return}l()})};l()}function ke(e,t){document.body.classList.add("is-client"),e.innerHTML=`<div class="client-error">${d("link",36)}<h2>Link indispon\xEDvel</h2><p>${u(t)}</p></div>`}function ra(e,t){return e.logo?`<span class="logo logo--img" style="--s:${t}px;--r:${Math.round(t*.28)}px"><img src="${u(e.logo)}" alt=""></span>`:`<span class="logo" style="--s:${t}px;--r:${Math.round(t*.28)}px;background:#fff;color:${e.color}">${u(st(e.name))}</span>`}function Ot(e){let t=E[e.type]||E.outro,a=ct(e),o=!Y(e.type)&&e.time;return`<article class="ccard ccard--${e.status}">
    <div class="ccard__time"><strong>${e.time?w(e.time):"\u2014"}</strong>${o?`<small>${w(Z(j(e.time)+ae(e)))}</small>`:""}</div>
    <div class="ccard__body">
      <div class="ccard__top"><span class="tbadge tbadge--${e.type}">${d(t.icon,13)}${t.label}</span><span class="cstatus cstatus--${e.status}">${e.status==="feito"?d("check",12):""}${a}</span></div>
      <h4>${u(e.title||t.label)}</h4>
      ${e.description?`<p>${u(e.description)}</p>`:""}
      ${e.location?`<p class="ccard__loc">${d("pin",13)} ${u(e.location)}</p>`:""}
    </div>
  </article>`}function Nt(e){let t="";return e.map(a=>{let o=a.date!==t?`<h3 class="dayhead${a.date===v()?" is-today":""}">${u(V(a.date))}</h3>`:"";return t=a.date,o+Ot(a)}).join("")}function ca(e){let{company:t,events:a,updatedAt:o}=P.data,l=v(),s=t.color||"#333",i=P.month,m=a.filter(b=>b.date.slice(0,7)===i),c=b=>m.filter(_=>b.includes(_.type)).length,r=m.filter(b=>b.status==="feito").length,p;if(P.tab==="proximos"){let b=a.filter(x=>x.date>=l),_=a.filter(x=>x.date<l&&x.date>=y(l,-14)).reverse();p=`
      ${b.length?Nt(b):`<div class="empty">${d("calendar",28)}<h3>Nada programado ainda</h3><p>Assim que o cronograma for montado, ele aparece aqui.</p></div>`}
      ${_.length?`<h2 class="csection">\xDAltimos 14 dias</h2>${Nt(_)}`:""}`}else{let[b,_]=i.split("-").map(Number),x=new Date(b,_-1,1),z=y(pe(x),-x.getDay()),K=Array.from({length:42},(T,q)=>y(z,q)),Q=K.slice(35).some(T=>T.slice(0,7)===i)?K:K.slice(0,35),$=a.filter(T=>T.date===P.sel);p=`
      <div class="cmonth__nav">
        <button class="iconbtn" data-c="month" data-v="-1" aria-label="M\xEAs anterior">${d("left",20)}</button>
        <strong>${u(re(i))}</strong>
        <button class="iconbtn" data-c="month" data-v="1" aria-label="Pr\xF3ximo m\xEAs">${d("right",20)}</button>
      </div>
      <div class="month month--client">
        <div class="month__wd">${ue.map(T=>`<span>${T}</span>`).join("")}</div>
        <div class="month__grid">
          ${Q.map(T=>{let q=a.filter(R=>R.date===T);return`<button class="mday${T.slice(0,7)===i?"":" is-out"}${T===l?" is-today":""}${T===P.sel?" is-sel":""}" data-c="sel" data-v="${T}">
              <span class="mday__n">${Number(T.slice(8))}</span>
              ${q.length?`<span class="mday__types">${[...new Set(q.map(R=>R.type))].slice(0,3).map(R=>`<i class="tdot tdot--${R}"></i>`).join("")}</span>`:""}
            </button>`}).join("")}
        </div>
      </div>
      <h2 class="csection">${u(V(P.sel))}</h2>
      ${$.length?$.map(Ot).join(""):'<p class="muted center">Nada programado neste dia.</p>'}`}return`
  <div class="client" style="--cc:${s};--cc-on:${nt(s)};--cc-soft:${fe(s,.1)}">
    <header class="client__hero">
      ${e?`<button class="client__back" data-c="back">${d("left",18)} Voltar ao app</button>`:""}
      ${ra(t,76)}
      <h1>${u(t.name)}</h1>
      <p>Cronograma de conte\xFAdo${t.instagram?` \xB7 @${u(t.instagram)}`:""}</p>
    </header>
    <div class="client__body">
      <div class="cstats">
        <div><b>${c(["feed","carrossel"])}</b><span>Feed</span></div>
        <div><b>${c(["reels"])}</b><span>Reels</span></div>
        <div><b>${c(["story"])}</b><span>Stories</span></div>
        <div><b>${c(["captacao"])}</b><span>Capta\xE7\xF5es</span></div>
      </div>
      <p class="cstats__cap">${u(re(i))} \xB7 ${r} de ${m.length} j\xE1 publicados/realizados</p>

      <div class="seg seg--client">
        <button class="seg__btn${P.tab==="proximos"?" is-on":""}" data-c="tab" data-v="proximos">${d("clock",15)} Pr\xF3ximos</button>
        <button class="seg__btn${P.tab==="mes"?" is-on":""}" data-c="tab" data-v="mes">${d("calendar",15)} Calend\xE1rio</button>
      </div>

      ${p}

      <div class="clegend">
        <span><i class="cstatus cstatus--pendente"></i>Planejado</span>
        <span><i class="cstatus cstatus--pronto"></i>Agendado / confirmado</span>
        <span><i class="cstatus cstatus--feito"></i>Publicado / realizado</span>
      </div>
      <footer class="client__foot">
        Atualizado em ${new Date(o||Date.now()).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}<br>
        Gest\xE3o de conte\xFAdo: <b>${u(A.agencyName)}</b>
      </footer>
    </div>
  </div>`}var Ke=[{label:"Organize meu dia",q:"Analise a agenda de hoje e me diga, em ordem, o que fazer e quando. Aponte conflitos e onde d\xE1 para ganhar tempo livre."},{label:"Melhores hor\xE1rios da semana",q:"Sugira os melhores hor\xE1rios para os posts desta semana de cada empresa, sem conflitar com as capta\xE7\xF5es e respeitando o expediente e o almo\xE7o."},{label:"Equilibrar a dupla",q:"A carga de trabalho entre Henrique e Matheus est\xE1 equilibrada nos pr\xF3ximos 7 dias? Sugira trocas concretas de respons\xE1vel."},{label:"Ideias de conte\xFAdo",q:"Para cada empresa, sugira 3 ideias de posts (feed, reels e stories) para a pr\xF3xima semana, com legenda curta."}],la=(e=[])=>e.map(t=>n.member(t)?.name).filter(Boolean).join(" e ")||"sem respons\xE1vel";function da(e,t=14){let a=I(),o=v(),l=new Date,s=[];s.push(`Voc\xEA \xE9 o assistente de organiza\xE7\xE3o de uma dupla de social media (${n.team.map(c=>c.name).join(" e ")}) que cuida do Instagram de v\xE1rias empresas. Responda em portugu\xEAs do Brasil, de forma curta e direta (sem rodeios), com hor\xE1rios concretos e no m\xE1ximo uns 10 itens.`),s.push(""),s.push(`Agora: ${ie(o)}, ${l.toTimeString().slice(0,5)}.`),s.push(`Rotina combinada: expediente ${a.workStart}\u2013${a.workEnd}, almo\xE7o ${a.lunchStart}\u2013${a.lunchEnd}, folga: ${a.daysOff.map(c=>Qe[c]).join(", ")||"nenhuma"}, deslocamento m\xEDnimo entre lugares: ${a.travelMin} min, m\xE1ximo de ${a.maxTasks} tarefas por pessoa/dia.`),s.push(`Empresas: ${n.companiesSorted().map(c=>c.name+(c.instagram?` (@${c.instagram})`:"")).join(", ")||"nenhuma"}.`),s.push(""),s.push(`Agenda (de hoje at\xE9 ${t} dias):`);let i=n.eventsBetween(y(o,-1),y(o,t)),m="";return i.forEach(c=>{c.date!==m&&(s.push(`
${ie(c.date)}:`),m=c.date);let r=n.company(c.companyId),p=c.duration?` (${c.duration} min)`:"";s.push(`- ${c.time||"sem hor\xE1rio"}${p} \xB7 ${E[c.type]?.label} \xB7 ${r?.name||"?"} \xB7 "${c.title||""}" \xB7 ${la(c.assignees)} \xB7 ${c.status==="feito"?"feito":c.status==="pronto"?"pronto":"a fazer"}${c.location?" \xB7 local: "+c.location:""}`)}),i.length||s.push("(nenhum compromisso)"),s.push(""),s.push(`Pergunta: ${e}`),s.join(`
`)}function Fe(e){let t=da(e);try{navigator.clipboard?.writeText(t).catch(()=>{})}catch{}let a=encodeURIComponent(t),o=a.length<7500?`https://claude.ai/new?q=${a}`:"https://claude.ai/new";window.open(o,"_blank","noopener"),g(a.length<7500?"Abrindo o Claude\u2026 (a agenda tamb\xE9m foi copiada)":"Agenda copiada: cole no Claude (segure no campo \u2192 Colar)",{ms:5e3})}var ma=e=>u(JSON.stringify(e));function pa(e="all"){let t=v(),a=e==="all"?n.team.map(i=>i.id):[e],o=[],l=new Set;for(let i=0;i<7;i++){let m=y(t,i);a.forEach(r=>$e(r,m).forEach(p=>{let b=p.ids.slice().sort().join("|")+p.title;l.has(b)||(l.add(b),o.push({...p,date:m}))})),n.eventsOn(m).filter(r=>!(r.assignees||[]).length&&r.status!=="feito").forEach(r=>o.push({date:m,level:"warn",icon:"user",ids:[r.id],title:"Sem respons\xE1vel",text:`${w(r.time)} ${C(r)}`,fixes:n.team.map(p=>({label:`Dar para ${p.name}`,eventId:r.id,patch:{assignees:[p.id]}}))}))}let s=n.state.events.filter(i=>i.status==="pendente"&&(i.date<t||i.date===t&&i.time&&j(i.time)+15<B())&&i.date>=y(t,-7));return s.length&&o.unshift({date:t,level:"warn",icon:"flag",ids:s.map(i=>i.id),title:`${s.length} tarefa${s.length>1?"s":""} pendente${s.length>1?"s":""} no passado`,text:"Marquem como feito ou reagendem para o cronograma do cliente ficar correto."}),o}function It(){let e={type:"feed",date:h.date>=v()?h.date:v(),q:""},t=()=>{let o=v(),l=pa(),s=I(),i=Array.from({length:7},(c,r)=>y(o,r)),m={id:"__probe",type:e.type,date:e.date,assignees:[]};return`
    ${ht("Assistente")}
    <div class="page page--sheet">
      <div class="assist-hero">
        <span class="assist-hero__ic">${d("sparkle",22)}</span>
        <div><strong>Analisando a agenda de voc\xEAs</strong><p>Funciona sozinho, sem internet. Confere conflitos, tempo livre e os melhores hor\xE1rios sempre que algo muda.</p></div>
      </div>

      <section class="block">
        <h2 class="block__title">${d("today",16)} Hoje</h2>
        <div class="card">${le(o).map(c=>`<p>${u(c)}</p>`).join("")}</div>
        <h2 class="block__title">${d("calendar",16)} Amanh\xE3</h2>
        <div class="card">${le(y(o,1)).map(c=>`<p>${u(c)}</p>`).join("")}</div>
      </section>

      <section class="block">
        <h2 class="block__title">${d("alert",16)} Precisa de aten\xE7\xE3o (7 dias)</h2>
        ${l.length?`<div class="tips">${l.map(c=>`
          <div class="tip tip--${c.level}">
            <span class="tip__ic">${d(c.icon,16)}</span>
            <div>
              <small class="tip__date">${u(V(c.date))}</small>
              <strong>${u(c.title)}</strong><p>${u(c.text)}</p>
              ${c.fixes?.length?`<div class="fixes">${c.fixes.map(r=>`<button class="fixbtn" data-action="apply-fix" data-id="${r.eventId}" data-patch="${ma(r.patch)}">${d("check",13)} ${u(r.label)}</button>`).join("")}</div>`:""}
              ${c.ids?.length===1?`<button class="btn-text btn-text--sm" data-action="open-event" data-id="${c.ids[0]}">Ver evento</button>`:""}
            </div>
          </div>`).join("")}</div>`:`<div class="tip tip--ok"><span class="tip__ic">${d("check",16)}</span><div><strong>Tudo certo</strong><p>Nenhum conflito nos pr\xF3ximos 7 dias.</p></div></div>`}
      </section>

      <section class="block">
        <h2 class="block__title">${d("clock",16)} Tempo livre no expediente (${w(s.workStart)}\u2013${w(s.workEnd)})</h2>
        <div class="freegrid">
          <span></span>${i.map(c=>`<span class="freegrid__d">${ee[F(c).getDay()]}<b>${F(c).getDate()}</b></span>`).join("")}
          ${n.team.map(c=>`${D(c.id,24)}${i.map(r=>{let p=oe(c.id,r);if(p.dayOff)return'<span class="freecell is-off">folga</span>';let b=p.minutes/60;return`<span class="freecell ${b>=4?"is-good":b>=2?"is-mid":"is-low"}">${W(Math.round(p.minutes/15)*15)||"0"}</span>`}).join("")}`).join("")}
        </div>
        <p class="fhelp">Verde: dia tranquilo \xB7 amarelo: apertado \xB7 vermelho: sem respiro. Ajuste a rotina em Ajustes.</p>
      </section>

      <section class="block">
        <h2 class="block__title">${d("bulb",16)} Encontrar o melhor hor\xE1rio</h2>
        <div class="card">
          <div class="row2">
            <select class="input" data-f="type">${rt.map(c=>`<option value="${c}"${e.type===c?" selected":""}>${E[c].label}</option>`).join("")}</select>
            <input class="input" type="date" data-f="date" value="${e.date}">
          </div>
          ${n.team.map(c=>{let r=bt({...m},{people:[c.id],limit:4});return`<div class="findrow">${D(c.id,26)}<div class="hintbox__times">${r.length?r.map(p=>`<button class="tchip" data-new="${c.id}|${p.time}">${w(p.time)}${p.peak?"<small>pico</small>":""}</button>`).join(""):'<span class="muted">Sem hor\xE1rio livre</span>'}</div></div>`}).join("")}
          <p class="fhelp">Toque num hor\xE1rio para j\xE1 criar o evento com a pessoa certa.</p>
        </div>
      </section>

      <section class="block">
        <h2 class="block__title">${d("sparkle",16)} Perguntar ao Claude</h2>
        <div class="card">
          <p>Abre o Claude <b>com o seu login normal</b> (app ou site), j\xE1 com a agenda de voc\xEAs e a pergunta prontas. N\xE3o precisa de chave.</p>
          <div class="presets">${Ke.map((c,r)=>`<button class="preset" data-preset="${r}">${u(c.label)}</button>`).join("")}</div>
          <textarea class="input" rows="3" data-f="q" placeholder="Ou escreva sua pergunta\u2026 ex.: monte o cronograma da Pura Vida para dezembro">${u(e.q)}</textarea>
          <button class="btn btn--primary btn--block" data-ask>${d("sparkle",18)} Perguntar ao Claude</button>
          <p class="fhelp">A agenda tamb\xE9m \xE9 copiada. Se o Claude abrir vazio, toque e segure no campo de mensagem e escolha <b>Colar</b>.</p>
        </div>
      </section>
    </div>`},a=ut({className:"sheet--tall",html:t(),onMount:o=>{let l=o.el;l.querySelector('[data-f="type"]').onchange=s=>{e.type=s.target.value,o.set(t())},l.querySelector('[data-f="date"]').onchange=s=>{s.target.value&&(e.date=s.target.value,o.set(t()))},l.querySelector('[data-f="q"]').oninput=s=>e.q=s.target.value,l.querySelectorAll("[data-new]").forEach(s=>s.onclick=async()=>{let[i,m]=s.dataset.new.split("|"),{openEventEditor:c}=await import("./c-WI5IF7H2.js");c({date:e.date,type:e.type,time:m,assignees:[i]})}),l.querySelectorAll("[data-preset]").forEach(s=>s.onclick=()=>Fe(Ke[+s.dataset.preset].q)),l.querySelector("[data-ask]").onclick=()=>{if(!e.q.trim())return g("Escreva a pergunta ou escolha uma sugest\xE3o");Fe(e.q.trim())}}});a.refresh=()=>{let o=document.activeElement;if(o&&a.el.contains(o)&&/INPUT|TEXTAREA|SELECT/.test(o.tagName))return;let l=a.el.scrollTop;a.set(t()),a.el.scrollTop=l}}var ua={feed:"Feed",carrossel:"Carrossel",reels:"Reels",story:"Story",captacao:"Capta\xE7\xE3o",reuniao:"Reuni\xE3o",producao:"Edi\xE7\xE3o",outro:"Tarefa"},ha=["feed","carrossel","reels","story"],Bt=e=>ha.includes(e),Lt={feed:"publicar o feed",carrossel:"publicar o carrossel",reels:"postar o Reels",story:"postar o story",captacao:"a capta\xE7\xE3o",reuniao:"a reuni\xE3o",producao:"a edi\xE7\xE3o",outro:"a tarefa"},fa=e=>e?e.replace(/^0/,"").replace(":00","h").replace(":","h"):"",ba=e=>{let[t,a]=String(e).split(":").map(Number);return t*60+a},Rt=e=>Math.round(Date.UTC(+e.slice(0,4),+e.slice(5,7)-1,+e.slice(8,10))/864e5);function ga(e){let t=Number.isFinite(e.reminder)?e.reminder:30,a;return Bt(e.type)?a=[120,30,0,-30]:e.type==="captacao"?a=[1440,120,45,-30]:e.type==="reuniao"?a=[1440,60,15]:a=[30,0],t>=0&&!a.includes(t)&&a.push(t),t<0&&(a=a.filter(o=>o<0)),[...new Set(a)].sort((o,l)=>l-o)}function Ht(e,t,a=4){let o=Rt(t.date)*1440+t.minutes,l=[];return e.forEach(s=>{if(!s||!s.time||!s.date||s.status==="feito")return;let i=Rt(s.date)*1440+ba(s.time);ga(s).forEach(m=>{if(m<0&&s.status!=="pendente")return;let c=i-m;c<=o&&c>o-a&&l.push({ev:s,offset:m})})}),l}var $a=e=>{if(e>=60){let t=Math.floor(e/60),a=e%60;return a?`${t}h${String(a).padStart(2,"0")}`:`${t}h`}return`${e} min`};function zt(e,t,a=""){let o=`${ua[e.type]||"Tarefa"}${a?" \xB7 "+a:""}`,l=e.title?`\u201C${e.title}\u201D`:"",s=fa(e.time),i=e.location?` \xB7 ${e.location}`:"";return t>=1440?{title:`Amanh\xE3: ${o} \xE0s ${s}`,body:e.type==="captacao"?`Hoje: carregue baterias, esvazie os cart\xF5es e confirme com o cliente.${i}`:`${l}${i}`.trim()||"Confirme o hor\xE1rio com o cliente."}:t>0?{title:`Daqui a ${$a(t)}: ${o}`,body:`${s} \u2014 ${Lt[e.type]||"a tarefa"}${l?" "+l:""}${i}`}:t===0?{title:`Agora: ${o}`,body:`Est\xE1 na hora de ${Lt[e.type]||"fazer a tarefa"}${l?" "+l:""}.`}:{title:Bt(e.type)?`J\xE1 postou? ${o}`:`J\xE1 fez? ${o}`,body:`Era \xE0s ${s}${l?" \u2014 "+l:""}. Toque para marcar como feito.`}}var N=document.getElementById("app");window.__calStarted=!0;var X=null;function va(){N.innerHTML=`
    <main id="view" class="view"></main>
    <nav class="tabbar" aria-label="Navega\xE7\xE3o">
      ${xe("hoje","today","Hoje")}
      ${xe("mes","calendar","Calend\xE1rio")}
      <button class="tabbar__fab" data-action="new-event" aria-label="Novo evento">${d("plus",28)}</button>
      ${xe("empresas","building","Empresas")}
      ${xe("ajustes","settings","Ajustes")}
    </nav>`}var xe=(e,t,a)=>`<button class="tabbar__btn" data-action="tab" data-tab="${e}">${d(t,24)}<span>${a}</span></button>`;function M(){let e=document.getElementById("view");if(!e)return;let t=window.scrollY,a=e.querySelector('[data-form="note"] input'),o=a?a.value:"",l=a&&document.activeElement===a,s=h.tab==="mes"?Et():h.tab==="empresas"?vt():h.tab==="ajustes"?Pt():St();e.innerHTML=s,document.querySelectorAll(".tabbar__btn").forEach(m=>m.classList.toggle("is-on",m.dataset.tab===h.tab)),window.scrollTo(0,t);let i=e.querySelector('[data-form="note"] input');i&&o&&(i.value=o),i&&l&&i.focus({preventScroll:!0}),_a()}function ya(){M(),Ce().forEach(e=>e.refresh&&e.refresh())}function me(e){h.tab=e,je(),M(),window.scrollTo(0,0)}var wa={tab:e=>me(e.dataset.tab),"set-person":e=>{h.person=e.dataset.p,je(),M()},"set-date":e=>{h.date=e.dataset.k,M()},"go-today":()=>{h.date=v(),M()},week:e=>{h.date=y(h.date,Number(e.dataset.n)),M()},month:e=>{h.month=ne(h.month,Number(e.dataset.n)),h.monthSel=h.month===U(v())?v():`${h.month}-01`,M()},"month-today":()=>{h.month=U(v()),h.monthSel=v(),M()},"month-select":e=>{h.monthSel=e.dataset.k,U(e.dataset.k)!==h.month&&(h.month=U(e.dataset.k)),M()},"month-company":e=>{h.monthCompany=e.dataset.id||null,M()},"open-day":e=>{h.date=e.dataset.k,me("hoje")},"toggle-tips":()=>{h.showAllTips=!h.showAllTips,M()},"open-event":e=>be(e.dataset.id),assistant:()=>It(),"apply-fix":async e=>{let t=n.event(e.dataset.id);if(!t)return;let a;try{a=JSON.parse(e.dataset.patch)}catch{return}let o={};typeof a.time=="string"&&/^\d{2}:\d{2}$/.test(a.time)&&(o.time=a.time),Array.isArray(a.assignees)&&(o.assignees=a.assignees.filter(i=>n.member(i)));let{confirmMove:l}=await import("./c-WI5IF7H2.js");if(!await l(t,o))return;let s={...t};await n.upsert("events",{...t,...o}),g("Pronto, ajustado",{action:"Desfazer",onAction:()=>n.upsert("events",s)})},"toggle-done":async e=>{let t=n.event(e.dataset.id);if(!t)return;let a=t.status==="feito"?"pendente":"feito";await n.upsert("events",{...t,status:a}),a==="feito"&&g(`${E[t.type].label} conclu\xEDdo`,{action:"Desfazer",onAction:()=>n.upsert("events",{...n.event(t.id),status:t.status})})},"new-event":e=>{if(!n.state.companies.length)return g("Cadastre uma empresa primeiro"),Ne(null,()=>Pe({}));Pe({date:e.dataset.date||null})},"open-company":e=>yt(e.dataset.id),"new-company":()=>Ne(),"del-note":async e=>{let t=n.state.notes.find(a=>a.id===e.dataset.id);await n.remove("notes",e.dataset.id),t&&g("Bilhete apagado",{action:"Desfazer",onAction:()=>n.upsert("notes",t)})},"set-me":e=>{n.setMe(e.dataset.p),g(`Ol\xE1, ${n.member(e.dataset.p).name}!`)},"clear-demo":async()=>{await ce({title:"Apagar os dados de exemplo?",text:"O calend\xE1rio ficar\xE1 vazio para voc\xEAs cadastrarem as empresas e eventos reais.",ok:"Apagar exemplos",danger:!0})&&(await n.clearDemo(),g("Pronto! Agora cadastre suas empresas."))},"clear-all":()=>L.clearAll(),ics:e=>L.ics(e),"notify-enable":()=>L.notifyEnable(),"notify-test":()=>L.notifyTest(),"onboarding-again":()=>L.onboardingAgain(),export:()=>L.export(),logout:async()=>{await ce({title:"Sair da conta?",ok:"Sair"})&&(await X.signOut(),location.reload())}};document.addEventListener("click",e=>{let t=e.target.closest("[data-action]");if(!t||document.body.classList.contains("is-client"))return;let a=wa[t.dataset.action];a&&(e.preventDefault(),e.stopPropagation(),a(t))});document.addEventListener("change",e=>{e.target.matches('[data-action-change="import"]')&&L.import(e.target),e.target.closest("[data-notify-form]")&&L.notifyPrefs(e.target.closest("[data-notify-form]")),e.target.closest("[data-routine-form]")&&L.routine(e.target.closest("[data-routine-form]"))});document.addEventListener("submit",async e=>{let t=e.target.closest('[data-form="note"]');if(!t)return;e.preventDefault();let a=t.text.value.trim();if(a){if(!n.me){g("Escolha quem voc\xEA \xE9 em Ajustes");return}await n.upsert("notes",{id:ot("n_"),date:h.date,text:a,author:n.me}),g("Bilhete adicionado")}});function _a(){document.querySelectorAll("[data-swipe]").forEach(e=>{let t=null,a=null;e.addEventListener("touchstart",o=>{t=o.touches[0].clientX,a=o.touches[0].clientY},{passive:!0}),e.addEventListener("touchend",o=>{if(t==null)return;let l=o.changedTouches[0].clientX-t,s=o.changedTouches[0].clientY-a;if(t=null,Math.abs(l)<50||Math.abs(l)<Math.abs(s)*1.5)return;let i=l<0?1:-1;e.dataset.swipe==="week"?h.date=y(h.date,7*i):(h.month=ne(h.month,i),h.monthSel=`${h.month}-01`),M()})})}var Kt=new Set;function Ft(){if(!n.me)return;let e=new Date,t={date:v(),minutes:e.getHours()*60+e.getMinutes()},a=n.eventsBetween(y(t.date,-1),y(t.date,1),{person:n.me}),o=n.mode==="cloud"&&!!localStorage.getItem("pauta.device");Ht(a,t,2).forEach(({ev:l,offset:s})=>{let i=`${l.id}@${s}@${l.date}${l.time}`;if(Kt.has(i))return;Kt.add(i);let m=zt(l,s,n.company(l.companyId)?.name||"");g(`${m.title}`,{ms:7e3,action:"Ver",onAction:()=>be(l.id)}),!o&&H()==="granted"&&navigator.serviceWorker&&navigator.serviceWorker.ready.then(c=>c.showNotification(m.title,{body:m.body,tag:`rem-${l.id}`,icon:"icons/icon-192.png",badge:"icons/icon-192.png",data:{url:`./#/e/${l.id}`}})).catch(()=>{})}),Ie(n.eventsOn(t.date,{person:n.me}).filter(l=>l.status!=="feito").length)}function Ye(e=location.hash){let t=/^#\/(e|d)\/([\w-]+)/.exec(e||"");return t?(history.replaceState(null,"",location.pathname+location.search),t[1]==="e"&&n.event(t[2])?(h.date=n.event(t[2]).date,me("hoje"),be(t[2])):t[1]==="d"&&/^\d{4}-\d{2}-\d{2}$/.test(t[2])&&(h.date=t[2],me("hoje")),!0):!1}var Ut={"auth/invalid-credential":"E-mail ou senha incorretos. Confira a senha (toque no olho para ver o que digitou).","auth/wrong-password":"Senha incorreta.","auth/user-not-found":"Este e-mail n\xE3o est\xE1 cadastrado no Firebase (Authentication \u2192 Usu\xE1rios).","auth/invalid-email":"E-mail inv\xE1lido.","auth/too-many-requests":'Muitas tentativas seguidas. Espere alguns minutos ou use "Esqueci minha senha".',"auth/network-request-failed":"Sem conex\xE3o com a internet. Verifique o Wi-Fi/4G e tente de novo.","auth/user-disabled":"Este usu\xE1rio foi desativado no Firebase.","auth/operation-not-allowed":"O login por e-mail/senha n\xE3o est\xE1 ativado no Firebase.","auth/api-key-not-valid":"Configura\xE7\xE3o do Firebase inv\xE1lida (apiKey)."},Vt="",We="";function Se(e=""){let t=e||We;N.innerHTML=`
  <div class="login">
    <img src="icons/icon-192.png" alt="" width="84" height="84">
    <h1>${u(A.appName)}</h1>
    <p>Agenda de conte\xFAdo \xB7 ${u(A.agencyName)}</p>
    <form class="form" data-login novalidate>
      <div class="fgroup"><label class="flabel" for="l-email">E-mail</label><input id="l-email" class="input" type="email" name="email" value="${u(Vt)}" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" inputmode="email"></div>
      <div class="fgroup"><label class="flabel" for="l-pass">Senha</label>
        <div class="input-eye"><input id="l-pass" class="input" type="password" name="pass" autocomplete="current-password" autocapitalize="none" autocorrect="off" spellcheck="false">
        <button type="button" class="iconbtn iconbtn--sm" data-eye aria-label="Mostrar senha">${d("eye",18)}</button></div>
      </div>
      ${t?`<p class="login__err">${u(t)}</p>`:""}
      <button class="btn btn--primary btn--block" type="submit" data-go>Entrar</button>
      <button class="btn-text btn-text--sm" type="button" data-reset>Esqueci minha senha</button>
    </form>
  </div>`;let a=N.querySelector("[data-login]");N.querySelector("[data-eye]").onclick=()=>{a.pass.type=a.pass.type==="password"?"text":"password"},a.onsubmit=async o=>{o.preventDefault();let l=a.email.value.trim().toLowerCase(),s=a.pass.value;if(Vt=l,We="",!l||!s)return Se("Preencha o e-mail e a senha.");let i=a.querySelector("[data-go]");i.disabled=!0,i.textContent="Entrando\u2026";try{await Promise.race([X.signIn(l,s),new Promise((m,c)=>setTimeout(()=>c({code:"timeout"}),2e4))]),i.textContent="Abrindo\u2026"}catch(m){let c=m&&m.code;Se(c==="timeout"?"O servidor demorou para responder. Verifique a internet e tente de novo.":Ut[c]||`N\xE3o foi poss\xEDvel entrar (${c||m?.message||"erro desconhecido"}).`)}},N.querySelector("[data-reset]").onclick=async()=>{let o=a.email.value.trim().toLowerCase();if(!o)return g("Digite seu e-mail primeiro");try{await X.resetPassword(o),g("Enviamos um e-mail para criar uma nova senha (veja tamb\xE9m o spam)",{ms:6e3})}catch(l){g(Ut[l?.code]||"N\xE3o foi poss\xEDvel enviar o e-mail")}}}function Wt(e){document.querySelector("[data-login]")||document.getElementById("view")||(N.innerHTML=`<div class="splash">
    <img src="icons/icon-192.png" alt="" width="72" height="72">
    <h2>N\xE3o consegui conectar</h2>
    <p>Verifique a internet e tente de novo.</p>
    <button class="btn btn--primary" data-retry>Tentar de novo</button>
    <small class="muted">Detalhe: ${u(String(e&&(e.code||e.message)||e))}</small>
  </div>`,N.querySelector("[data-retry]").onclick=()=>location.reload())}function Ue(e="Carregando\u2026"){N.innerHTML=`<div class="splash"><img src="icons/icon-192.png" alt="" width="72" height="72"><p>${u(e)}</p></div>`}function Yt(){va(),M(),n.on(ya),n.onError=e=>{let t=e&&/quota/i.test(String(e.name||e.message)),a=e&&/permission/i.test(String(e.code||e.message));g(t?"Mem\xF3ria do aparelho cheia: use logos menores ou ative a nuvem":a?"Sem permiss\xE3o na nuvem: confira as regras do Firebase":"N\xE3o foi poss\xEDvel salvar. Verifique a conex\xE3o.",{ms:5e3})},Gt(),n.on(Gt),n.on(()=>Ie(n.me?n.eventsOn(v(),{person:n.me}).filter(e=>e.status!=="feito").length:0)),setInterval(()=>{let e=document.activeElement,t=e&&/INPUT|TEXTAREA|SELECT/.test(e.tagName);h.tab==="hoje"&&!Ce().length&&!t&&M(),Ft()},6e4),Ft(),document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&(h.date<v()&&h.tab==="hoje"&&(h.date=v()),M())}),setTimeout(Dt,600),n.mode==="cloud"&&H()==="granted"&&ye().catch(()=>{}),setTimeout(()=>Ye(),300)}var Ve=null;function Gt(){if(!n.me)return;let e=_t(n.me,14),t=o=>o.date+":"+o.ids.slice().sort().join("|"),a=new Set(e.map(t));if(Ve){let o=e.find(l=>!Ve.has(t(l))&&l.ids.some(s=>n.event(s)?.updatedBy&&n.event(s).updatedBy!==n.me));o&&g(`Aten\xE7\xE3o: ${o.title} (${o.date.slice(8)}/${o.date.slice(5,7)})`,{action:"Ver",onAction:()=>{h.date=o.date,h.person="all",me("hoje")},ms:7e3})}Ve=a}async function ka(){let e=location.hash||"",t=A.firebase;if(e.startsWith("#/c/")||e.startsWith("#/v/")){Ue("Carregando cronograma\u2026");let s=!!(localStorage.getItem("pauta.me")||localStorage.getItem("cal.team"));try{if(e.startsWith("#/v/")){let c=await it(e.slice(4));return ze(N,Te(c),{canGoBack:s})}if(!t)return ke(N,"Este link precisa da sincroniza\xE7\xE3o na nuvem ativada.");let{fetchPublic:i}=await import("./c-YH7LPRJG.js"),m=await i(t,e.slice(4));return m?ze(N,Te(m),{canGoBack:s}):ke(N,"Este link n\xE3o existe mais. Pe\xE7a um novo link para a equipe.")}catch(i){return console.error(i),ke(N,"N\xE3o foi poss\xEDvel abrir o cronograma. Verifique a conex\xE3o e tente novamente.")}}if(!t)return await dt(),Yt();Ue("Conectando \xE0 nuvem\u2026");let a=(s,i)=>Promise.race([s,new Promise((m,c)=>setTimeout(()=>c(new Error("tempo esgotado")),i))]);try{let{connect:s}=await import("./c-YH7LPRJG.js");X=await a(s(t),15e3)}catch(s){return console.error(s),Wt(s)}let o=!1,l=!1;setTimeout(()=>{o||Wt(new Error("o login n\xE3o respondeu"))},25e3),X.onUser(async s=>{if(o=!0,!s)return l?location.reload():Se();if(l)return;if(!A.team.some(m=>m.email&&m.email.toLowerCase()===(s.email||"").toLowerCase()))return We=`O e-mail ${s.email} n\xE3o faz parte da equipe deste app.`,await X.signOut(),Se();l=!0;try{localStorage.setItem("cal.team","1")}catch{}Ue("Entrando\u2026");try{await Promise.race([mt(X.backend,s),new Promise(m=>setTimeout(m,12e3))])}catch(m){console.error(m),setTimeout(()=>g("N\xE3o consegui carregar os dados agora. Verifique a internet.",{ms:6e3}),800)}Yt()})}navigator.serviceWorker?.addEventListener("message",e=>{if(e.data?.type==="open"&&e.data.url){let t=e.data.url.split("#")[1];t&&Ye("#"+t)}});window.addEventListener("hashchange",()=>{if(/^#\/(e|d)\//.test(location.hash))return Ye();/^#\/(c|v)\//.test(location.hash)&&location.reload()});"serviceWorker"in navigator&&location.protocol!=="file:"&&navigator.serviceWorker.register("sw.js").catch(()=>{});ka();
