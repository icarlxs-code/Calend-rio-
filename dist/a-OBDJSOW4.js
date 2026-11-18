import{$ as ue,A as p,B as oe,C as ht,D as se,E as et,F as ne,G as E,H as ie,I as Y,J as at,K as re,L as Et,M as ce,N as At,O as s,P as le,Q as de,R as f,S as Tt,T as d,U as q,V as me,W as jt,X as Mt,Y as Dt,Z as pe,_ as qt,a as A,aa as g,b as pt,ba as ct,c as U,ca as fe,d as v,da as I,e as y,ea as J,f as Jt,fa as P,g as V,ga as he,h as nt,ha as ot,i as Gt,ia as be,j,ja as lt,k as Z,ka as ge,l as R,la as bt,m as w,ma as Pt,n as Xt,o as tt,oa as $e,p as ut,pa as ve,q as ft,qa as Ct,r as it,s as Qt,t as rt,u as Zt,v as W,w as F,x as te,y as ee,z as ae}from"./c-5H7ASYQ4.js";import"./c-VHNSBD2M.js";var Fe=(t,e)=>t&&e&&t[0]<e[1]&&e[0]<t[1],G=t=>s.member(t)?.name||t,gt=t=>["shoot","meeting"].includes(E[t.type]?.kind);function $t(t,e){let a=[],o=I(),c=s.eventsOn(e,{person:t}).filter(r=>r.time&&r.status!=="feito");for(let r=0;r<c.length;r++)for(let u=r+1;u<c.length;u++){let l=c[r],i=c[u];if(!Fe(J(l),J(i)))continue;let m=gt(l)?l:gt(i)?i:null,b=m===l?i:l,_,x;m&&Y(b.type)?(_=`${G(t)}: post durante ${E[m.type].label.toLowerCase()}`,x=`\u201C${P(b)}\u201D \xE0s ${w(b.time)} cai no meio de \u201C${P(m)}\u201D (${w(m.time)}\u2013${w(Z(J(m)[1]))}).`):m&&gt(b)?(_=`${G(t)} em dois lugares ao mesmo tempo`,x=`\u201C${P(l)}\u201D (${w(l.time)}) e \u201C${P(i)}\u201D (${w(i.time)}) se sobrep\xF5em.`):(_=`${G(t)}: duas tarefas no mesmo hor\xE1rio`,x=`\u201C${P(l)}\u201D (${w(l.time)}) e \u201C${P(i)}\u201D (${w(i.time)}).`),a.push({level:"warn",kind:"conflict",icon:"alert",ids:[l.id,i.id],title:_,text:x,fixes:be(t,l,i)})}let n=c.filter(gt);for(let r=0;r<n.length-1;r++){let u=n[r],l=n[r+1],i=j(l.time)-J(u)[1];(u.location||u.companyId)!==(l.location||l.companyId)&&i>=0&&i<o.travelMin&&a.push({level:"warn",kind:"conflict",icon:"route",ids:[u.id,l.id],title:`${G(t)}: pouco tempo de deslocamento`,text:`S\xF3 ${i} min entre \u201C${P(u)}\u201D e \u201C${P(l)}\u201D, em lugares diferentes (combinado: ${o.travelMin} min).`,fixes:[{label:`Mover para ${w(Z(J(u)[1]+o.travelMin))}`,eventId:l.id,patch:{time:Z(Math.ceil((J(u)[1]+o.travelMin)/15)*15)}}]})}return a}function ye(t,e="all"){let a=[],o=e==="all"?s.team.map(i=>i.id):[e];o.forEach(i=>a.push(...$t(i,t)));let c=I(),n=s.eventsOn(t,{person:e}),r={};if(n.filter(i=>i.time&&["feed","reels","carrossel"].includes(i.type)).forEach(i=>(r[i.companyId]||=[]).push(i)),Object.values(r).forEach(i=>{for(let m=0;m<i.length-1;m++){let b=j(i[m+1].time)-j(i[m].time);b<180&&a.push({level:"info",icon:"clock",ids:[i[m].id,i[m+1].id],title:`${s.company(i[m].companyId)?.name||"Empresa"}: posts muito pr\xF3ximos`,text:`Dois posts de feed/Reels com s\xF3 ${F(b)} de diferen\xE7a. Espacem ao menos 3 h para um n\xE3o \u201Croubar\u201D o alcance do outro.`})}}),t===v()){let i=n.filter(m=>m.time&&m.status==="pendente"&&j(m.time)+15<R());i.length&&a.unshift({level:"warn",kind:"late",icon:"flag",ids:i.map(m=>m.id),title:i.length===1?"1 tarefa atrasada":`${i.length} tarefas atrasadas`,text:i.map(m=>`${w(m.time)} ${P(m)}`).join(" \xB7 ")+". Marque como feito ou reagende."})}let u=n.filter(i=>!(i.assignees||[]).length);if(u.length&&e==="all"&&a.push({level:"warn",icon:"user",ids:u.map(i=>i.id),title:"Tarefa sem respons\xE1vel",text:u.map(i=>`${w(i.time)} ${P(i)}`).join(" \xB7 ")+". Definam quem vai fazer."}),e==="all"&&s.team.length===2){let[i,m]=s.team,b=s.eventsOn(t,{person:i.id}).length,_=s.eventsOn(t,{person:m.id}).length;if(Math.abs(b-_)>=4){let[x,z]=b>_?[i,m]:[m,i];a.push({level:"info",icon:"users",title:"Dia desequilibrado",text:`${x.name} tem ${Math.max(b,_)} tarefas e ${z.name} tem ${Math.min(b,_)}. Que tal passar alguns stories para o ${z.name}?`})}}o.forEach(i=>{let m=ot(i,t),b=s.eventsOn(t,{person:i}).length;!m.dayOff&&m.minutes!=null&&b&&m.longest<45&&a.push({level:"info",kind:"rest",icon:"clock",title:`${G(i)} est\xE1 sem pausa`,text:`O maior intervalo livre do dia \xE9 de ${F(m.longest)}. Programem posts com anteced\xEAncia para abrir espa\xE7o.`}),m.dayOff&&b&&a.push({level:"info",kind:"rest",icon:"clock",title:`${G(i)}: dia de folga`,text:`H\xE1 ${b} tarefa${b>1?"s":""} marcada${b>1?"s":""} na folga. Posts podem ficar programados para ningu\xE9m trabalhar.`}),b>c.maxTasks&&a.push({level:"warn",kind:"rest",icon:"alert",title:`${G(i)} sobrecarregado`,text:`${b} tarefas (limite combinado: ${c.maxTasks}).`})}),s.eventsOn(y(t,1),{person:e}).filter(i=>i.type==="captacao").forEach(i=>{let m=s.company(i.companyId);a.push({level:"prep",icon:"camera",ids:[i.id],title:`Amanh\xE3: capta\xE7\xE3o${m?" na "+m.name:""} \xE0s ${w(i.time)}`,text:"Hoje: carregue baterias, esvazie cart\xF5es de mem\xF3ria, confirme o hor\xE1rio com o cliente e defina o roteiro de tomadas."})}),!a.some(i=>i.kind==="conflict")&&n.length&&a.push({level:"ok",icon:"check",title:"Agenda sem conflitos",text:"Ningu\xE9m est\xE1 em dois lugares ao mesmo tempo."});let l=Math.abs(Gt("2024-01-01",t))%Et.length;return a.push({level:"tip",icon:"bulb",title:"Dica do dia",text:Et[l]}),a}function we(t,e=14){let a=[],o=v();for(let c=0;c<e;c++){let n=y(o,c);$t(t,n).forEach(r=>a.push({...r,date:n}))}return a}function _e(t="all"){let e=v(),a=R();return s.eventsOn(e,{person:t}).find(o=>o.time&&o.status!=="feito"&&j(o.time)+at(o)>a)||null}function ke(){return`<div class="seg" role="tablist">
    ${[{id:"all",name:"Todos"},...s.team].map(e=>`<button class="seg__btn${f.person===e.id?" is-on":""}" data-action="set-person" data-p="${e.id}">
      ${e.id==="all"?d("users",15):q(e.id,18)}<span>${p(e.name)}${s.me===e.id?"<em> (voc\xEA)</em>":""}</span></button>`).join("")}
  </div>`}function Ye(t,e=4){let a=[];return t.forEach(o=>{a.includes(o.companyId)||a.push(o.companyId)}),a.slice(0,e).map(o=>`<i style="background:${s.company(o)?.color||"#999"}"></i>`).join("")}function xe(){let t=f.date,e=v(),a=s.eventsOn(t,{person:f.person}),o=ye(t,f.person),c=o.filter(h=>h.level==="warn"&&h.icon!=="flag").flatMap(h=>h.ids||[]),n=s.member(s.me),r=Jt(t),u=Array.from({length:7},(h,S)=>y(r,S)),l=(()=>{let h=U(u[0]),S=U(u[6]);return h.getMonth()===S.getMonth()?`${h.getDate()}\u2013${S.getDate()} de ${ft[S.getMonth()]}`:`${h.getDate()} ${ft[h.getMonth()]} \u2013 ${S.getDate()} ${ft[S.getMonth()]}`})(),i=`
  <header class="hdr">
    <div class="hdr__row">
      <div class="hdr__titles">
        <p class="hdr__eyebrow">${t===e?`${ee()}${n?", "+p(n.name):""}`:p(it(t))}</p>
        <h1>${p(Zt(t))}${t===e?`<span class="hdr__date">${p(Qt(t))}</span>`:""}</h1>
      </div>
      <div class="hdr__actions">
        ${t!==e?'<button class="chip chip--accent" data-action="go-today">Hoje</button>':""}
        <button class="iconbtn iconbtn--ai" data-action="assistant" aria-label="Assistente">${d("sparkle",20)}</button>
        <button class="iconbtn" data-action="tab" data-tab="ajustes" aria-label="Perfil">${n?q(n.id,34):d("user",20)}</button>
      </div>
    </div>
    ${ke()}
    <div class="week">
      <div class="week__bar">
        <button class="iconbtn iconbtn--sm" data-action="week" data-n="-7" aria-label="Semana anterior">${d("left",18)}</button>
        <span>${p(l)}</span>
        <button class="iconbtn iconbtn--sm" data-action="week" data-n="7" aria-label="Pr\xF3xima semana">${d("right",18)}</button>
      </div>
      <div class="week__days" data-swipe="week">
        ${u.map(h=>{let S=U(h),O=s.eventsOn(h,{person:f.person}),k=O.filter(st=>st.status!=="feito").length;return`<button class="wday${h===t?" is-sel":""}${h===e?" is-today":""}" data-action="set-date" data-k="${h}">
            <span class="wday__l">${tt[S.getDay()]}</span>
            <span class="wday__n">${S.getDate()}</span>
            <span class="wday__dots">${Ye(O,3)}${O.length?"":'<i class="none"></i>'}</span>
            ${k?`<span class="sr">${k} pendentes</span>`:""}
          </button>`}).join("")}
      </div>
    </div>
  </header>`,m={};a.forEach(h=>m[h.type]=(m[h.type]||0)+1);let b=a.filter(h=>h.status==="feito").length,_=a.length?Math.round(b/a.length*100):0,x=a.length?`<div class="summary">
        <div class="summary__progress">
          <div class="ring" style="--p:${_}"><span>${_}%</span></div>
          <div><strong>${b} de ${a.length}</strong><small>tarefas conclu\xEDdas</small></div>
        </div>
        <div class="summary__types">
          ${Object.entries(m).sort((h,S)=>S[1]-h[1]).map(([h,S])=>`<span class="tcount tbadge--${h}">${d(E[h].icon,13)}<b>${S}</b> ${E[h].label}</span>`).join("")}
        </div>
      </div>`:"",z=f.person==="all"?`<section class="block">
      <h2 class="block__title">${d("route",16)} Onde cada um vai estar</h2>
      <div class="team">${s.team.map(h=>Je(h,t)).join("")}</div>
    </section>`:"",K="";if(t===e){let h=_e(f.person);if(h){let S=s.company(h.companyId),O=j(h.time)-R(),k=S?.color||"#555";K=`<button class="next" style="--cc:${k};--cc-soft:${ht(k,.12)}" data-action="open-event" data-id="${h.id}">
        <div class="next__label">${d("bell",14)} ${O>0?"Pr\xF3ximo \xB7 "+te(O):"Acontecendo agora"}</div>
        <div class="next__row">
          ${jt(S,44)}
          <div class="next__txt">
            <strong>${w(h.time)} \xB7 ${p(E[h.type].label)} \xB7 ${p(S?.name||"")}</strong>
            <span>${p(h.title||"")}</span>
          </div>
          ${me(h.assignees,26)}
        </div>
        ${h.location?`<div class="next__loc">${d("pin",13)} ${p(h.location)}</div>`:""}
      </button>`}}let Q=f.showAllTips?o:o.filter((h,S)=>h.level==="warn"||S<2),$=o.length-Q.length,T=`<section class="block">
    <h2 class="block__title">${d("bulb",16)} Dicas e alertas</h2>
    <div class="tips">${Q.map(Ge).join("")}</div>
    ${$>0?`<button class="btn-text btn-text--sm" data-action="toggle-tips">Ver mais ${$} dica${$>1?"s":""}</button>`:f.showAllTips&&o.length>2?'<button class="btn-text btn-text--sm" data-action="toggle-tips">Mostrar menos</button>':""}
  </section>`,D;if(!a.length)D=Dt("Dia livre",f.person==="all"?"Nada agendado para este dia.":`Nada agendado para ${s.member(f.person)?.name}.`,`<button class="btn btn--primary" data-action="new-event" data-date="${t}">${d("plus",18)} Adicionar</button>`);else{let h=[{k:"Manh\xE3",icon:"sun",items:a.filter(k=>k.time&&j(k.time)<720)},{k:"Tarde",items:a.filter(k=>k.time&&j(k.time)>=720&&j(k.time)<1080)},{k:"Noite",items:a.filter(k=>k.time&&j(k.time)>=1080)},{k:"Sem hor\xE1rio",items:a.filter(k=>!k.time)}],S=R(),O=t!==e;D=h.filter(k=>k.items.length).map(k=>`
      <div class="tl-group">
        <h3 class="tl-group__h">${k.k}<span>${k.items.length}</span></h3>
        ${k.items.map(st=>{let Yt="";return!O&&st.time&&j(st.time)>S&&(O=!0,Yt=`<div class="nowline"><span>Agora \xB7 ${w(`${String(new Date().getHours()).padStart(2,"0")}:${String(new Date().getMinutes()).padStart(2,"0")}`)}</span></div>`),Yt+Mt(st,{highlight:c})}).join("")}
      </div>`).join(""),!O&&t===e&&(D+=`<div class="nowline nowline--end"><span>Agora \xB7 ${w(`${String(new Date().getHours()).padStart(2,"0")}:${String(new Date().getMinutes()).padStart(2,"0")}`)} \xB7 fim da agenda</span></div>`)}let B=s.notesOn(t),St=`<section class="block">
    <h2 class="block__title">${d("note",16)} Bilhetes do dia</h2>
    <div class="notes">
      ${B.map(h=>`<div class="note">
        <p>${p(h.text)}</p>
        <footer>${q(h.author,18)}<span>${p(s.member(h.author)?.name||"")}</span>
          <button class="note__del" data-action="del-note" data-id="${h.id}" aria-label="Apagar bilhete">${d("x",14)}</button></footer>
      </div>`).join("")}
      <form class="note-add" data-form="note">
        <input name="text" placeholder="Escreva um bilhete para a dupla\u2026" autocomplete="off" maxlength="280">
        <button class="iconbtn iconbtn--accent" aria-label="Adicionar bilhete">${d("plus",18)}</button>
      </form>
    </div>
  </section>`;return`${i}
  <div class="page">
    ${s.demo?Xe():""}
    ${K}
    <button class="brief" data-action="assistant">
      <span class="brief__ic">${d("sparkle",18)}</span>
      <div><strong>Assistente</strong>${lt(t,f.person).map(h=>`<p>${p(h)}</p>`).join("")}</div>
      ${d("right",18,"muted")}
    </button>
    ${z}
    <section class="block">
      <h2 class="block__title">${d("clock",16)} Agenda ${f.person==="all"?"da dupla":"de "+p(s.member(f.person)?.name||"")}</h2>
      ${x}
      ${D}
    </section>
    ${T}
    ${St}
  </div>`}function Je(t,e){let a=s.eventsOn(e,{person:t.id}),o=e===v()?R():-1,c=a.filter(i=>["shoot","meeting"].includes(E[i.type]?.kind)),n=a.filter(i=>Y(i.type)).length,r=a.find(i=>i.time&&i.status!=="feito"&&j(i.time)+at(i)>o),u=ot(t.id,e),l=u.dayOff?"Folga":`${F(Math.round(u.minutes/15)*15)||"0 min"} livres`;return`<button class="team__col" data-action="set-person" data-p="${t.id}">
    <span class="team__free ${u.dayOff?"is-off":u.minutes>=240?"is-good":u.minutes>=120?"is-mid":"is-low"}">${d("clock",12)} ${l}</span>
    <div class="team__head">${q(t.id,30)}<div><strong>${p(t.name)}</strong><small>${a.length} tarefa${a.length===1?"":"s"} \xB7 ${n} post${n===1?"":"s"}</small></div></div>
    <ul class="team__where">
      ${c.length?c.map(i=>`<li>${d(E[i.type].icon,13)}<span><b>${w(i.time)}</b> ${p(s.company(i.companyId)?.name||"")}</span></li>`).join(""):`<li class="muted">${d("building",13)}<span>Trabalho interno / remoto</span></li>`}
    </ul>
    ${r?`<div class="team__next">Pr\xF3ximo: <b>${w(r.time)}</b> ${p(E[r.type].label)} \xB7 ${p(s.company(r.companyId)?.name||"")}</div>`:`<div class="team__next muted">${a.length?"Tudo conclu\xEDdo \u2713":"Livre"}</div>`}
  </button>`}function Ge(t){let e=t.fixes?.length?`<div class="fixes">${t.fixes.map(a=>`<button class="fixbtn" data-action="apply-fix" data-id="${a.eventId}" data-patch="${p(JSON.stringify(a.patch))}">${d("check",13)} ${p(a.label)}</button>`).join("")}</div>`:"";return`<div class="tip tip--${t.level}"${t.ids?.length===1&&!e?` data-action="open-event" data-id="${t.ids[0]}"`:""}>
    <span class="tip__ic">${d(t.icon,16)}</span>
    <div><strong>${p(t.title)}</strong><p>${p(t.text)}</p>${e}</div>
  </div>`}function Xe(){return`<div class="banner">
    ${d("sparkle",18)}
    <p><strong>Voc\xEA est\xE1 vendo dados de exemplo.</strong> Explore \xE0 vontade e, quando quiser come\xE7ar de verdade, apague os exemplos.</p>
    <button class="btn btn--soft btn--sm" data-action="clear-demo">Apagar exemplos</button>
  </div>`}function Se(){let t=f.month,[e,a]=t.split("-").map(Number),o=new Date(e,a-1,1),c=y(pt(o),-o.getDay()),n=v(),r=Array.from({length:42},($,T)=>y(c,T)),l=r.slice(35).some($=>$.slice(0,7)===t)?r:r.slice(0,35),i={person:f.person,companyId:f.monthCompany},m=s.companiesSorted(),b=f.monthSel,_=s.eventsOn(b,i),x=s.eventsBetween(`${t}-01`,`${t}-31`,i),z=x.filter($=>Y($.type)).length,K=x.filter($=>$.type==="captacao").length,Q=x.filter($=>$.type==="reuniao").length;return`
  <header class="hdr">
    <div class="hdr__row">
      <div class="hdr__titles">
        <p class="hdr__eyebrow">Calend\xE1rio</p>
        <h1>${p(rt(t).split(" ")[0])}<span class="hdr__date">${t.slice(0,4)}</span></h1>
      </div>
      <div class="hdr__actions">
        <button class="iconbtn" data-action="month" data-n="-1" aria-label="M\xEAs anterior">${d("left",20)}</button>
        <button class="chip" data-action="month-today">Hoje</button>
        <button class="iconbtn" data-action="month" data-n="1" aria-label="Pr\xF3ximo m\xEAs">${d("right",20)}</button>
      </div>
    </div>
    ${ke()}
  </header>
  <div class="page">
    <div class="chips-scroll">
      <button class="chip${f.monthCompany?"":" is-on"}" data-action="month-company" data-id="">Todas as empresas</button>
      ${m.map($=>`<button class="chip chip--co${f.monthCompany===$.id?" is-on":""}" style="--cc:${$.color}" data-action="month-company" data-id="${$.id}">${jt($,18,5)}${p($.name)}</button>`).join("")}
    </div>

    <div class="mstats">
      <div><b>${z}</b><span>posts</span></div>
      <div><b>${K}</b><span>capta\xE7\xF5es</span></div>
      <div><b>${Q}</b><span>reuni\xF5es</span></div>
      <div><b>${x.filter($=>$.status==="feito").length}/${x.length}</b><span>conclu\xEDdos</span></div>
    </div>

    <div class="month" data-swipe="month">
      <div class="month__wd">${ut.map($=>`<span>${$}</span>`).join("")}</div>
      <div class="month__grid">
        ${l.map($=>{let T=$.slice(0,7)===t,D=s.eventsOn($,i),B=D.some(St=>St.type==="captacao");return`<button class="mday${T?"":" is-out"}${$===n?" is-today":""}${$===b?" is-sel":""}" data-action="month-select" data-k="${$}">
            <span class="mday__n">${Number($.slice(8))}</span>
            ${D.length?`<span class="mday__bars">${Qe(D)}</span><span class="mday__count">${B?d("camera",10):""}${D.length}</span>`:""}
          </button>`}).join("")}
      </div>
    </div>

    <section class="block">
      <div class="block__row">
        <h2 class="block__title">${p(W(b))}</h2>
        <button class="btn-text btn-text--sm" data-action="open-day" data-k="${b}">Abrir dia ${d("right",14)}</button>
      </div>
      ${_.length?_.map($=>Mt($)).join(""):Dt("Nada neste dia","Toque no + para agendar.",`<button class="btn btn--soft" data-action="new-event" data-date="${b}">${d("plus",16)} Novo evento</button>`)}
    </section>

    ${m.length?`<section class="block">
      <h2 class="block__title">Legenda</h2>
      <div class="legend">${m.map($=>`<span><i style="background:${$.color}"></i>${p($.name)}</span>`).join("")}</div>
    </section>`:""}
  </div>`}function Qe(t){let e={};return t.forEach(a=>e[a.companyId]=(e[a.companyId]||0)+1),Object.entries(e).slice(0,4).map(([a])=>`<i style="background:${s.company(a)?.color||"#999"}"></i>`).join("")}var Ae="pauta.device",Te="pauta.notifyPrefs",je=()=>/iPhone|iPad|iPod/.test(navigator.userAgent)||navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1,Ze=()=>"serviceWorker"in navigator&&"PushManager"in window&&"Notification"in window,H=()=>"Notification"in window?Notification.permission:"unsupported",dt=()=>je()&&!et(),Nt=()=>{try{return{reminders:!0,partner:!0,daily:!0,...JSON.parse(localStorage.getItem(Te)||"{}")}}catch{return{reminders:!0,partner:!0,daily:!0}}},Ee=t=>{let e="=".repeat((4-t.length%4)%4),a=atob((t+e).replace(/-/g,"+").replace(/_/g,"/"));return Uint8Array.from(a,o=>o.charCodeAt(0))},ta=async t=>{let e=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(t));return"d_"+Array.from(new Uint8Array(e).slice(0,16),a=>a.toString(16).padStart(2,"0")).join("")};async function vt(){return dt()?{ok:!1,reason:"install"}:Ze()?await Notification.requestPermission()!=="granted"?{ok:!1,reason:"denied"}:s.mode!=="cloud"?{ok:!0,local:!0}:yt():{ok:!1,reason:"unsupported"}}async function yt(){if(s.mode!=="cloud"||H()!=="granted"||!s.me)return{ok:!1,reason:"not-ready"};let e=(await s.readDoc("meta/push"))?.vapidPublicKey;if(!e)return{ok:!1,reason:"server"};let a=await navigator.serviceWorker.ready,o=await a.pushManager.getSubscription();if(o&&o.options?.applicationServerKey){let r=new Uint8Array(o.options.applicationServerKey),u=Ee(e);(r.length!==u.length||r.some((l,i)=>l!==u[i]))&&(await o.unsubscribe(),o=null)}o||(o=await a.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:Ee(e)}));let c=o.toJSON(),n=await ta(c.endpoint);return s.writeRaw("devices",{id:n,member:s.me,subscription:{endpoint:c.endpoint,keys:c.keys},prefs:Nt(),device:je()?"iPhone":navigator.platform||"navegador",updatedAt:Date.now()}),localStorage.setItem(Ae,n),{ok:!0,id:n}}async function Me(t){localStorage.setItem(Te,JSON.stringify(t)),s.mode==="cloud"&&H()==="granted"&&await yt()}async function wt(){let t=localStorage.getItem(Ae);return s.mode==="cloud"&&t?(s.writeRaw("pings",{id:"p_"+Date.now().toString(36),device:t,member:s.me,at:Date.now()}),"server"):(await(await navigator.serviceWorker.ready).showNotification("Notifica\xE7\xF5es ativadas \u2713",{body:"\xC9 assim que os lembretes v\xE3o chegar.",icon:"icons/icon-192.png",badge:"icons/icon-192.png",tag:"teste"}),"local")}function Ot(t){try{if(!("setAppBadge"in navigator))return;t>0?navigator.setAppBadge(t).catch(()=>{}):navigator.clearAppBadge().catch(()=>{})}catch{}}var Rt="pauta.onboarded",_t="pauta.notifyAskedAt";function De(){if(!localStorage.getItem(Rt))return Bt(s.me?["welcome","notify","done"]:["welcome","who","notify","done"]);if(!s.me&&s.mode==="local")return Bt(["who"]);let e=Number(localStorage.getItem(_t)||0);if(et()&&H()==="default"&&Date.now()-e>3*864e5)return Bt(["notify"])}function Lt(t,e,a="agora"){return`<div class="nprev">
    <img src="icons/icon-192.png" alt="">
    <div><div class="nprev__top"><b>${p(A.appName.toUpperCase())}</b><span>${p(a)}</span></div>
    <strong>${p(t)}</strong><p>${p(e)}</p></div>
  </div>`}function ea(t,e,a){let o=s.member(s.me),c=s.team.find(r=>r.id!==s.me)||s.team[1]||s.team[0],n=a>1?`<div class="ob__dots">${Array.from({length:a},(r,u)=>`<i class="${u===e?"is-on":""}"></i>`).join("")}</div>`:"";return t==="welcome"?`<div class="ob__art"><img class="ob__icon" src="icons/icon-512.png" alt=""></div>
      <h1>Bem-vindo ao ${p(A.appName)}</h1>
      <p>A agenda de conte\xFAdo de ${p(A.agencyName)}: posts, stories, reels e capta\xE7\xF5es de todas as empresas, num lugar s\xF3.</p>
      ${n}
      <button class="btn btn--primary btn--block" data-next>Come\xE7ar</button>`:t==="who"?`<div class="ob__art ob__art--sm">${d("user",34)}</div>
      <h1>Quem vai usar este celular?</h1>
      <p>Assim o app sabe de quem s\xE3o os lembretes e avisa o parceiro quando voc\xEA marcar algo.</p>
      <div class="whogrid ob__who">${s.team.map(r=>`<button class="whobtn${s.me===r.id?" is-on":""}" style="--mc:${r.color}" data-me="${r.id}">${q(r.id,36)}<span>${p(r.name)}</span><i class="whobtn__check">${d("check",14)}</i></button>`).join("")}</div>
      ${n}
      <button class="btn btn--primary btn--block" data-next ${s.me?"":"disabled"}>Continuar</button>`:t==="notify"?`<div class="ob__previews">
        ${Lt("Daqui a 2h: Reels \xB7 Pura Vida","18h \u2014 postar o Reels \u201CBastidores\u201D","agora")}
        ${Lt(`${c?.name||"Seu parceiro"} marcou para voc\xEA`,"Story \xB7 Caf\xE9 Aroma \u2014 amanh\xE3, 16h","h\xE1 2 min")}
        ${Lt(`Bom dia, ${o?.name||"Henrique"}! Seu dia hoje`,"5 tarefas \xB7 primeira: 11h30 Feed \xB7 Studio Fit","8:00")}
      </div>
      <h1>Nunca mais esque\xE7a um post</h1>
      <p>Lembretes 2h e 30 min antes de cada post, aviso na v\xE9spera das capta\xE7\xF5es, cobran\xE7a se algo ficou para tr\xE1s e aviso quando o parceiro marcar algo para voc\xEA.</p>
      <div data-notify-msg></div>
      ${n}
      <button class="btn btn--primary btn--block" data-enable>${d("bell",18)} Ativar notifica\xE7\xF5es</button>
      <button class="btn btn--ghost btn--block" data-skip>Agora n\xE3o</button>`:`<div class="ob__art ob__art--ok">${d("check",40)}</div>
    <h1>Tudo pronto${o?", "+p(o.name):""}!</h1>
    <ul class="ob__tips">
      <li>${d("plus",18)}<span>Toque no <b>+</b> para marcar posts, capta\xE7\xF5es e reuni\xF5es.</span></li>
      <li>${d("sparkle",18)}<span>O <b>Assistente</b> avisa conflitos e sugere os melhores hor\xE1rios.</span></li>
      <li>${d("link",18)}<span>Em <b>Empresas</b>, mande para cada cliente o link do cronograma dele.</span></li>
    </ul>
    ${n}
    <button class="btn btn--primary btn--block" data-next>Abrir a agenda</button>`}function Bt(t){if(document.querySelector(".ob"))return;let e=0,a=document.createElement("div");a.className="ob",a.innerHTML='<div class="ob__card"></div>',document.body.appendChild(a),requestAnimationFrame(()=>a.classList.add("is-in"));let o=a.querySelector(".ob__card"),c=()=>{(t.includes("welcome")||t.includes("done"))&&localStorage.setItem(Rt,"1"),a.classList.remove("is-in"),setTimeout(()=>a.remove(),400)},n=l=>{if(l>=t.length)return c();e=l,o.classList.remove("is-shown"),setTimeout(()=>{o.innerHTML=ea(t[e],e,t.length),u(),o.classList.add("is-shown")},o.innerHTML?180:0)},r=(l,i="info")=>{let m=o.querySelector("[data-notify-msg]");m&&(m.innerHTML=`<div class="ob__msg ob__msg--${i}">${l}</div>`)},u=()=>{o.querySelectorAll("[data-next]").forEach(m=>m.onclick=()=>n(e+1)),o.querySelectorAll("[data-me]").forEach(m=>m.onclick=()=>{s.setMe(m.dataset.me),o.querySelectorAll("[data-me]").forEach(b=>b.classList.toggle("is-on",b===m)),o.querySelector("[data-next]").disabled=!1});let l=o.querySelector("[data-skip]");l&&(l.onclick=()=>{localStorage.setItem(_t,String(Date.now())),n(e+1)});let i=o.querySelector("[data-enable]");i&&(i.onclick=async()=>{if(localStorage.setItem(_t,String(Date.now())),dt()){r(`<b>Primeiro instale o app.</b> No iPhone, as notifica\xE7\xF5es s\xF3 funcionam pelo \xEDcone da Tela de In\xEDcio:<br>
          1. Toque em ${d("share",14)} <b>Compartilhar</b><br>2. <b>Adicionar \xE0 Tela de In\xEDcio</b><br>3. Abra o ${p(A.appName)} pelo \xEDcone`,"warn"),i.outerHTML='<button class="btn btn--primary btn--block" data-next>Entendi</button>',u();return}i.disabled=!0,i.innerHTML="Aguardando permiss\xE3o\u2026";let m=await vt().catch(()=>({ok:!1,reason:"error"}));m.ok?(m.local?r("Ativado neste celular. Para os avisos chegarem com o app fechado e no celular do parceiro, falta ligar o servidor de notifica\xE7\xF5es (Ajustes \u2192 Notifica\xE7\xF5es).","ok"):(r("Pronto! Voc\xEA vai receber uma notifica\xE7\xE3o de teste em instantes.","ok"),wt().catch(()=>{})),i.outerHTML='<button class="btn btn--primary btn--block" data-next>Continuar</button>',o.querySelector("[data-skip]")?.remove(),u()):m.reason==="server"?(r("Permiss\xE3o concedida! O servidor de notifica\xE7\xF5es ainda n\xE3o foi publicado; quando for, este celular \xE9 cadastrado sozinho.","ok"),i.outerHTML='<button class="btn btn--primary btn--block" data-next>Continuar</button>',u()):m.reason==="denied"?(r(`As notifica\xE7\xF5es foram bloqueadas. Para ligar depois: <b>Ajustes do iPhone \u2192 Notifica\xE7\xF5es \u2192 ${p(A.appName)}</b>.`,"warn"),i.outerHTML='<button class="btn btn--primary btn--block" data-next>Continuar</button>',u()):(r("Este aparelho n\xE3o aceita notifica\xE7\xF5es deste app.","warn"),i.disabled=!1,i.innerHTML="Tentar de novo")})};n(0)}function qe(){localStorage.removeItem(Rt),localStorage.removeItem(_t),g("A apresenta\xE7\xE3o aparece na pr\xF3xima abertura")}function Pe(){let t=s.member(s.me),e=s.mode==="cloud",a="Notification"in window&&Notification.permission==="granted";return`
  <header class="hdr">
    <div class="hdr__row"><div class="hdr__titles"><p class="hdr__eyebrow">${p(A.appName)} \xB7 ${p(A.agencyName)}</p><h1>Ajustes</h1></div></div>
  </header>
  <div class="page">
    <section class="block">
      <h2 class="block__title">${d("user",16)} Quem est\xE1 usando este celular?</h2>
      ${e?`<div class="card card--row">${t?q(t.id,40):d("user",24)}<div><strong>${p(t?.name||s.user?.email||"")}</strong><small>${p(s.user?.email||"")}</small></div>
            <button class="btn btn--soft btn--sm" data-action="logout">${d("logout",16)} Sair</button></div>`:`<div class="whogrid">${s.team.map(o=>`<button class="whobtn${s.me===o.id?" is-on":""}" style="--mc:${o.color}" data-action="set-me" data-p="${o.id}">${q(o.id,34)}<span>${p(o.name)}</span><i class="whobtn__check">${d("check",14)}</i></button>`).join("")}</div>
           <p class="fhelp">Usado para sauda\xE7\xE3o, \u201CCriado por\u201D e nos lembretes.</p>`}
    </section>

    ${oa()}

    <section class="block">
      <h2 class="block__title">${d("sparkle",16)} Assistente e Claude</h2>
      <div class="card card--row">
        ${d("sparkle",22)}
        <div><strong>Assistente autom\xE1tico ativo</strong><small>Confere conflitos, tempo livre e melhores hor\xE1rios sozinho, sem internet e sem chave.</small></div>
        <button class="btn btn--soft btn--sm" data-action="assistant">Abrir</button>
      </div>
      <p class="fhelp">Para perguntas abertas (ideias, reorganizar a semana), use \u201CPerguntar ao Claude\u201D no Assistente. Abre o Claude com o seu login normal, sem chave de API.</p>
    </section>

    ${aa()}

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
      <div class="card card--row ${e?"card--ok":"card--warn"}">
        ${d(e?"cloud":"phone",22)}
        <div><strong>${e?"Sincronizado na nuvem":"Salvo s\xF3 neste aparelho"}</strong>
        <small>${e?"Henrique, Matheus e os links dos clientes veem tudo em tempo real.":"Para Henrique e Matheus verem a mesma agenda em celulares diferentes, ative a nuvem (gratuito). Veja o guia no README do projeto."}</small></div>
      </div>
    </section>

    ${et()?"":`<section class="block">
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
          ${ce.map(o=>`<li><span class="tbadge tbadge--${o.type}">${d(E[o.type].icon,13)}${E[o.type].label}</span><span>${p(o.text)}</span></li>`).join("")}
        </ul>
        <p class="fhelp pad">M\xE9dias de mercado. Confiram os Insights do Instagram de cada cliente e ajustem: cada p\xFAblico tem seu hor\xE1rio de pico.</p>
      </div>
    </section>

    <section class="block">
      <h2 class="block__title">${d("download",16)} Dados e backup</h2>
      <div class="list">
        <button class="list__row" data-action="export">${d("download",18)}<span>Exportar backup (.json)</span>${d("right",16,"muted")}</button>
        <label class="list__row">${d("upload",18)}<span>Importar backup</span><input type="file" accept="application/json,.json" data-action-change="import" hidden>${d("right",16,"muted")}</label>
        ${s.demo?`<button class="list__row" data-action="clear-demo">${d("sparkle",18)}<span>Apagar dados de exemplo</span>${d("right",16,"muted")}</button>`:""}
        <button class="list__row is-danger" data-action="clear-all">${d("trash",18)}<span>Apagar tudo</span>${d("right",16,"muted")}</button>
      </div>
      <p class="fhelp">${s.state.companies.length} empresas \xB7 ${s.state.events.length} eventos \xB7 ${s.state.notes.length} bilhetes</p>
    </section>
    <p class="about">${p(A.appName)} \u2014 agenda de conte\xFAdo \xB7 v1.0</p>
  </div>`}function aa(){let t=H(),e=dt(),a=s.mode==="cloud",o=!!localStorage.getItem("pauta.device"),c=Nt(),n,r,u="";return e?(n="warn",r="No iPhone, as notifica\xE7\xF5es s\xF3 funcionam com o app instalado: Compartilhar \u2192 Adicionar \xE0 Tela de In\xEDcio, e abra pelo \xEDcone."):t==="unsupported"?(n="warn",r="Este navegador n\xE3o aceita notifica\xE7\xF5es."):t==="denied"?(n="warn",r=`Bloqueadas. Para ligar: Ajustes do iPhone \u2192 Notifica\xE7\xF5es \u2192 ${A.appName}.`):t!=="granted"?(n="warn",r="Desativadas neste celular.",u='<button class="btn btn--primary btn--sm" data-action="notify-enable">Ativar</button>'):a&&o?(n="ok",r="Ativadas. Os lembretes e os avisos do parceiro chegam mesmo com o app fechado."):a?(n="warn",r="Permiss\xE3o concedida, mas o servidor de notifica\xE7\xF5es ainda n\xE3o foi publicado (veja o README).",u='<button class="btn btn--soft btn--sm" data-action="notify-enable">Tentar</button>'):(n="warn",r="Ativadas s\xF3 com o app aberto. Para receber com o app fechado e no celular do parceiro, ligue a nuvem e o servidor (README)."),`<section class="block">
    <h2 class="block__title">${d("bell",16)} Notifica\xE7\xF5es</h2>
    <div class="card card--row ${n==="ok"?"card--ok":"card--warn"}">
      ${d("bell",22)}
      <div><strong>${n==="ok"?"Funcionando":"Aten\xE7\xE3o"}</strong><small>${p(r)}</small></div>
      ${u}
    </div>
    <form class="list notif-prefs" data-notify-form onsubmit="return false">
      <label class="list__row"><span><b>Lembretes dos meus posts</b><small>2h e 30 min antes, na hora e cobran\xE7a se atrasar</small></span><input type="checkbox" class="switch" name="reminders" ${c.reminders?"checked":""}></label>
      <label class="list__row"><span><b>Avisos do parceiro</b><small>quando marcar, mudar ou concluir algo</small></span><input type="checkbox" class="switch" name="partner" ${c.partner?"checked":""}></label>
      <label class="list__row"><span><b>Resumo do dia</b><small>\xE0s 8h (hoje) e \xE0s 20h (amanh\xE3)</small></span><input type="checkbox" class="switch" name="daily" ${c.daily?"checked":""}></label>
    </form>
    ${t==="granted"?`<button class="btn btn--soft btn--block" data-action="notify-test">${d("bell",16)} Enviar notifica\xE7\xE3o de teste</button>`:""}
    <button class="btn-text btn-text--sm" data-action="onboarding-again">Ver a apresenta\xE7\xE3o de novo</button>
  </section>`}function oa(){let t=I(),e=[0,15,30,45,60,90];return`<section class="block">
    <h2 class="block__title">${d("clock",16)} Rotina e tempo livre</h2>
    <form class="list" data-routine-form onsubmit="return false">
      <label class="list__row"><span>Expediente</span><input type="time" name="workStart" value="${t.workStart}"> <input type="time" name="workEnd" value="${t.workEnd}"></label>
      <label class="list__row"><span>Almo\xE7o</span><input type="time" name="lunchStart" value="${t.lunchStart}"> <input type="time" name="lunchEnd" value="${t.lunchEnd}"></label>
      <label class="list__row"><span>Deslocamento entre lugares</span><select name="travelMin">${e.map(a=>`<option value="${a}"${t.travelMin===a?" selected":""}>${a?a+" min":"n\xE3o considerar"}</option>`).join("")}</select></label>
      <label class="list__row"><span>M\xE1ximo de tarefas/dia</span><select name="maxTasks">${[4,5,6,7,8,10,12,15,20].map(a=>`<option value="${a}"${t.maxTasks===a?" selected":""}>${a}</option>`).join("")}</select></label>
      <div class="list__row list__row--col"><span>Dias de folga</span>
        <div class="daysoff">${tt.map((a,o)=>`<label class="dayoff"><input type="checkbox" name="off" value="${o}"${t.daysOff.includes(o)?" checked":""}><span>${a}</span></label>`).join("")}</div>
      </div>
    </form>
    <p class="fhelp">O assistente usa isso para n\xE3o marcar nada em cima do almo\xE7o, da folga ou fora do expediente, e para proteger o tempo livre de voc\xEAs.</p>
  </section>`}var L={async notifyEnable(){let t=await vt().catch(()=>({ok:!1,reason:"error"}));t.ok?g(t.local?"Ativado (com o app aberto)":"Notifica\xE7\xF5es ativadas"):t.reason==="install"?g("Instale o app na Tela de In\xEDcio primeiro"):t.reason==="denied"?g("Bloqueado: libere em Ajustes do iPhone \u2192 Notifica\xE7\xF5es"):t.reason==="server"?g("Servidor de notifica\xE7\xF5es ainda n\xE3o publicado"):g("N\xE3o foi poss\xEDvel ativar"),s.emit()},async notifyTest(){let t=await wt().catch(()=>null);g(t==="server"?"Enviando\u2026 deve chegar em alguns segundos":t?"Notifica\xE7\xE3o enviada":"N\xE3o foi poss\xEDvel enviar")},async notifyPrefs(t){await Me({reminders:t.reminders.checked,partner:t.partner.checked,daily:t.daily.checked}),g("Prefer\xEAncias salvas")},onboardingAgain(){qe()},async routine(t){let e=(c,n)=>/^\d{2}:\d{2}$/.test(t[c].value)?t[c].value:n,a=I(),o={id:"routine",workStart:e("workStart",a.workStart),workEnd:e("workEnd",a.workEnd),lunchStart:e("lunchStart",a.lunchStart),lunchEnd:e("lunchEnd",a.lunchEnd),travelMin:Number(t.travelMin.value),maxTasks:Number(t.maxTasks.value),daysOff:[...t.querySelectorAll('input[name="off"]:checked')].map(c=>Number(c.value))};if(o.workEnd<=o.workStart)return g("O fim do expediente precisa ser depois do in\xEDcio");if(o.lunchEnd<=o.lunchStart)return g("O fim do almo\xE7o precisa ser depois do in\xEDcio");await s.upsert("settings",o),g("Rotina salva")},async ics(t){let e=t.dataset.who==="me"?s.me:"all";if(t.dataset.who==="me"&&!s.me)return g("Escolha primeiro quem est\xE1 usando este celular");let a=Number(t.dataset.days),o=v(),c=s.eventsBetween(o,y(o,a),{person:e}).filter(r=>r.status!=="feito");if(!c.length)return g("Nada agendado nesse per\xEDodo");let n=e==="all"?`${A.appName} \u2013 Dupla`:`${A.appName} \u2013 ${s.member(e).name}`;await ge(c,`pauta-${e}-${o}.ics`,n)},export(){let t=new Blob([s.exportData()],{type:"application/json"}),e=document.createElement("a");e.href=URL.createObjectURL(t),e.download=`pauta-backup-${v()}.json`,document.body.appendChild(e),e.click(),e.remove(),g("Backup exportado")},async import(t){let e=t.files[0];if(e)try{let a=await e.text(),o=await fe({title:"Importar backup",text:"Como deseja importar?",options:[{label:"Juntar com os dados atuais",value:"merge",primary:!0},{label:"Substituir tudo",value:"replace",danger:!0}]});if(!o)return;await s.importData(a,{replace:o==="replace"}),g("Backup importado")}catch{g("Arquivo inv\xE1lido")}finally{t.value=""}},async clearAll(){await ct({title:"Apagar TUDO?",text:"Empresas, eventos e bilhetes ser\xE3o apagados. Exporte um backup antes, se precisar.",ok:"Apagar tudo",danger:!0})&&(await s.clearAll(),g("Tudo apagado"))}};var C={data:null,tab:"proximos",month:V(v()),sel:v()};function Ht(t,e,{canGoBack:a=!1}={}){C.data=e,document.title=`${e.company.name} \xB7 Cronograma`;let o=document.querySelector('meta[name="theme-color"]');o&&o.setAttribute("content",e.company.color),document.body.classList.add("is-client");let c=()=>{t.innerHTML=na(a),t.querySelectorAll("[data-c]").forEach(n=>n.onclick=()=>{let r=n.dataset.c;if(r==="tab"&&(C.tab=n.dataset.v),r==="month"&&(C.month=nt(C.month,Number(n.dataset.v))),r==="sel"&&(C.sel=n.dataset.v),r==="back"){location.hash="",location.reload();return}c()})};c()}function kt(t,e){document.body.classList.add("is-client"),t.innerHTML=`<div class="client-error">${d("link",36)}<h2>Link indispon\xEDvel</h2><p>${p(e)}</p></div>`}function sa(t,e){return t.logo?`<span class="logo logo--img" style="--s:${e}px;--r:${Math.round(e*.28)}px"><img src="${p(t.logo)}" alt=""></span>`:`<span class="logo" style="--s:${e}px;--r:${Math.round(e*.28)}px;background:#fff;color:${t.color}">${p(oe(t.name))}</span>`}function Ne(t){let e=E[t.type]||E.outro,a=re(t),o=!Y(t.type)&&t.time;return`<article class="ccard ccard--${t.status}">
    <div class="ccard__time"><strong>${t.time?w(t.time):"\u2014"}</strong>${o?`<small>${w(Z(j(t.time)+at(t)))}</small>`:""}</div>
    <div class="ccard__body">
      <div class="ccard__top"><span class="tbadge tbadge--${t.type}">${d(e.icon,13)}${e.label}</span><span class="cstatus cstatus--${t.status}">${t.status==="feito"?d("check",12):""}${a}</span></div>
      <h4>${p(t.title||e.label)}</h4>
      ${t.description?`<p>${p(t.description)}</p>`:""}
      ${t.location?`<p class="ccard__loc">${d("pin",13)} ${p(t.location)}</p>`:""}
    </div>
  </article>`}function Ce(t){let e="";return t.map(a=>{let o=a.date!==e?`<h3 class="dayhead${a.date===v()?" is-today":""}">${p(W(a.date))}</h3>`:"";return e=a.date,o+Ne(a)}).join("")}function na(t){let{company:e,events:a,updatedAt:o}=C.data,c=v(),n=e.color||"#333",r=C.month,u=a.filter(b=>b.date.slice(0,7)===r),l=b=>u.filter(_=>b.includes(_.type)).length,i=u.filter(b=>b.status==="feito").length,m;if(C.tab==="proximos"){let b=a.filter(x=>x.date>=c),_=a.filter(x=>x.date<c&&x.date>=y(c,-14)).reverse();m=`
      ${b.length?Ce(b):`<div class="empty">${d("calendar",28)}<h3>Nada programado ainda</h3><p>Assim que o cronograma for montado, ele aparece aqui.</p></div>`}
      ${_.length?`<h2 class="csection">\xDAltimos 14 dias</h2>${Ce(_)}`:""}`}else{let[b,_]=r.split("-").map(Number),x=new Date(b,_-1,1),z=y(pt(x),-x.getDay()),K=Array.from({length:42},(T,D)=>y(z,D)),Q=K.slice(35).some(T=>T.slice(0,7)===r)?K:K.slice(0,35),$=a.filter(T=>T.date===C.sel);m=`
      <div class="cmonth__nav">
        <button class="iconbtn" data-c="month" data-v="-1" aria-label="M\xEAs anterior">${d("left",20)}</button>
        <strong>${p(rt(r))}</strong>
        <button class="iconbtn" data-c="month" data-v="1" aria-label="Pr\xF3ximo m\xEAs">${d("right",20)}</button>
      </div>
      <div class="month month--client">
        <div class="month__wd">${ut.map(T=>`<span>${T}</span>`).join("")}</div>
        <div class="month__grid">
          ${Q.map(T=>{let D=a.filter(B=>B.date===T);return`<button class="mday${T.slice(0,7)===r?"":" is-out"}${T===c?" is-today":""}${T===C.sel?" is-sel":""}" data-c="sel" data-v="${T}">
              <span class="mday__n">${Number(T.slice(8))}</span>
              ${D.length?`<span class="mday__types">${[...new Set(D.map(B=>B.type))].slice(0,3).map(B=>`<i class="tdot tdot--${B}"></i>`).join("")}</span>`:""}
            </button>`}).join("")}
        </div>
      </div>
      <h2 class="csection">${p(W(C.sel))}</h2>
      ${$.length?$.map(Ne).join(""):'<p class="muted center">Nada programado neste dia.</p>'}`}return`
  <div class="client" style="--cc:${n};--cc-on:${se(n)};--cc-soft:${ht(n,.1)}">
    <header class="client__hero">
      ${t?`<button class="client__back" data-c="back">${d("left",18)} Voltar ao app</button>`:""}
      ${sa(e,76)}
      <h1>${p(e.name)}</h1>
      <p>Cronograma de conte\xFAdo${e.instagram?` \xB7 @${p(e.instagram)}`:""}</p>
    </header>
    <div class="client__body">
      <div class="cstats">
        <div><b>${l(["feed","carrossel"])}</b><span>Feed</span></div>
        <div><b>${l(["reels"])}</b><span>Reels</span></div>
        <div><b>${l(["story"])}</b><span>Stories</span></div>
        <div><b>${l(["captacao"])}</b><span>Capta\xE7\xF5es</span></div>
      </div>
      <p class="cstats__cap">${p(rt(r))} \xB7 ${i} de ${u.length} j\xE1 publicados/realizados</p>

      <div class="seg seg--client">
        <button class="seg__btn${C.tab==="proximos"?" is-on":""}" data-c="tab" data-v="proximos">${d("clock",15)} Pr\xF3ximos</button>
        <button class="seg__btn${C.tab==="mes"?" is-on":""}" data-c="tab" data-v="mes">${d("calendar",15)} Calend\xE1rio</button>
      </div>

      ${m}

      <div class="clegend">
        <span><i class="cstatus cstatus--pendente"></i>Planejado</span>
        <span><i class="cstatus cstatus--pronto"></i>Agendado / confirmado</span>
        <span><i class="cstatus cstatus--feito"></i>Publicado / realizado</span>
      </div>
      <footer class="client__foot">
        Atualizado em ${new Date(o||Date.now()).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}<br>
        Gest\xE3o de conte\xFAdo: <b>${p(A.agencyName)}</b>
      </footer>
    </div>
  </div>`}var zt=[{label:"Organize meu dia",q:"Analise a agenda de hoje e me diga, em ordem, o que fazer e quando. Aponte conflitos e onde d\xE1 para ganhar tempo livre."},{label:"Melhores hor\xE1rios da semana",q:"Sugira os melhores hor\xE1rios para os posts desta semana de cada empresa, sem conflitar com as capta\xE7\xF5es e respeitando o expediente e o almo\xE7o."},{label:"Equilibrar a dupla",q:"A carga de trabalho entre Henrique e Matheus est\xE1 equilibrada nos pr\xF3ximos 7 dias? Sugira trocas concretas de respons\xE1vel."},{label:"Ideias de conte\xFAdo",q:"Para cada empresa, sugira 3 ideias de posts (feed, reels e stories) para a pr\xF3xima semana, com legenda curta."}],ia=(t=[])=>t.map(e=>s.member(e)?.name).filter(Boolean).join(" e ")||"sem respons\xE1vel";function ra(t,e=14){let a=I(),o=v(),c=new Date,n=[];n.push(`Voc\xEA \xE9 o assistente de organiza\xE7\xE3o de uma dupla de social media (${s.team.map(l=>l.name).join(" e ")}) que cuida do Instagram de v\xE1rias empresas. Responda em portugu\xEAs do Brasil, de forma curta e direta (sem rodeios), com hor\xE1rios concretos e no m\xE1ximo uns 10 itens.`),n.push(""),n.push(`Agora: ${it(o)}, ${c.toTimeString().slice(0,5)}.`),n.push(`Rotina combinada: expediente ${a.workStart}\u2013${a.workEnd}, almo\xE7o ${a.lunchStart}\u2013${a.lunchEnd}, folga: ${a.daysOff.map(l=>Xt[l]).join(", ")||"nenhuma"}, deslocamento m\xEDnimo entre lugares: ${a.travelMin} min, m\xE1ximo de ${a.maxTasks} tarefas por pessoa/dia.`),n.push(`Empresas: ${s.companiesSorted().map(l=>l.name+(l.instagram?` (@${l.instagram})`:"")).join(", ")||"nenhuma"}.`),n.push(""),n.push(`Agenda (de hoje at\xE9 ${e} dias):`);let r=s.eventsBetween(y(o,-1),y(o,e)),u="";return r.forEach(l=>{l.date!==u&&(n.push(`
${it(l.date)}:`),u=l.date);let i=s.company(l.companyId),m=l.duration?` (${l.duration} min)`:"";n.push(`- ${l.time||"sem hor\xE1rio"}${m} \xB7 ${E[l.type]?.label} \xB7 ${i?.name||"?"} \xB7 "${l.title||""}" \xB7 ${ia(l.assignees)} \xB7 ${l.status==="feito"?"feito":l.status==="pronto"?"pronto":"a fazer"}${l.location?" \xB7 local: "+l.location:""}`)}),r.length||n.push("(nenhum compromisso)"),n.push(""),n.push(`Pergunta: ${t}`),n.join(`
`)}function Kt(t){let e=ra(t);try{navigator.clipboard?.writeText(e).catch(()=>{})}catch{}let a=encodeURIComponent(e),o=a.length<7500?`https://claude.ai/new?q=${a}`:"https://claude.ai/new";window.open(o,"_blank","noopener"),g(a.length<7500?"Abrindo o Claude\u2026 (a agenda tamb\xE9m foi copiada)":"Agenda copiada: cole no Claude (segure no campo \u2192 Colar)",{ms:5e3})}var ca=t=>p(JSON.stringify(t));function la(t="all"){let e=v(),a=t==="all"?s.team.map(r=>r.id):[t],o=[],c=new Set;for(let r=0;r<7;r++){let u=y(e,r);a.forEach(i=>$t(i,u).forEach(m=>{let b=m.ids.slice().sort().join("|")+m.title;c.has(b)||(c.add(b),o.push({...m,date:u}))})),s.eventsOn(u).filter(i=>!(i.assignees||[]).length&&i.status!=="feito").forEach(i=>o.push({date:u,level:"warn",icon:"user",ids:[i.id],title:"Sem respons\xE1vel",text:`${w(i.time)} ${P(i)}`,fixes:s.team.map(m=>({label:`Dar para ${m.name}`,eventId:i.id,patch:{assignees:[m.id]}}))}))}let n=s.state.events.filter(r=>r.status==="pendente"&&(r.date<e||r.date===e&&r.time&&j(r.time)+15<R())&&r.date>=y(e,-7));return n.length&&o.unshift({date:e,level:"warn",icon:"flag",ids:n.map(r=>r.id),title:`${n.length} tarefa${n.length>1?"s":""} pendente${n.length>1?"s":""} no passado`,text:"Marquem como feito ou reagendem para o cronograma do cliente ficar correto."}),o}function Oe(){let t={type:"feed",date:f.date>=v()?f.date:v(),q:""},e=()=>{let o=v(),c=la(),n=I(),r=Array.from({length:7},(l,i)=>y(o,i)),u={id:"__probe",type:t.type,date:t.date,assignees:[]};return`
    ${ue("Assistente")}
    <div class="page page--sheet">
      <div class="assist-hero">
        <span class="assist-hero__ic">${d("sparkle",22)}</span>
        <div><strong>Analisando a agenda de voc\xEAs</strong><p>Funciona sozinho, sem internet. Confere conflitos, tempo livre e os melhores hor\xE1rios sempre que algo muda.</p></div>
      </div>

      <section class="block">
        <h2 class="block__title">${d("today",16)} Hoje</h2>
        <div class="card">${lt(o).map(l=>`<p>${p(l)}</p>`).join("")}</div>
        <h2 class="block__title">${d("calendar",16)} Amanh\xE3</h2>
        <div class="card">${lt(y(o,1)).map(l=>`<p>${p(l)}</p>`).join("")}</div>
      </section>

      <section class="block">
        <h2 class="block__title">${d("alert",16)} Precisa de aten\xE7\xE3o (7 dias)</h2>
        ${c.length?`<div class="tips">${c.map(l=>`
          <div class="tip tip--${l.level}">
            <span class="tip__ic">${d(l.icon,16)}</span>
            <div>
              <small class="tip__date">${p(W(l.date))}</small>
              <strong>${p(l.title)}</strong><p>${p(l.text)}</p>
              ${l.fixes?.length?`<div class="fixes">${l.fixes.map(i=>`<button class="fixbtn" data-action="apply-fix" data-id="${i.eventId}" data-patch="${ca(i.patch)}">${d("check",13)} ${p(i.label)}</button>`).join("")}</div>`:""}
              ${l.ids?.length===1?`<button class="btn-text btn-text--sm" data-action="open-event" data-id="${l.ids[0]}">Ver evento</button>`:""}
            </div>
          </div>`).join("")}</div>`:`<div class="tip tip--ok"><span class="tip__ic">${d("check",16)}</span><div><strong>Tudo certo</strong><p>Nenhum conflito nos pr\xF3ximos 7 dias.</p></div></div>`}
      </section>

      <section class="block">
        <h2 class="block__title">${d("clock",16)} Tempo livre no expediente (${w(n.workStart)}\u2013${w(n.workEnd)})</h2>
        <div class="freegrid">
          <span></span>${r.map(l=>`<span class="freegrid__d">${tt[U(l).getDay()]}<b>${U(l).getDate()}</b></span>`).join("")}
          ${s.team.map(l=>`${q(l.id,24)}${r.map(i=>{let m=ot(l.id,i);if(m.dayOff)return'<span class="freecell is-off">folga</span>';let b=m.minutes/60;return`<span class="freecell ${b>=4?"is-good":b>=2?"is-mid":"is-low"}">${F(Math.round(m.minutes/15)*15)||"0"}</span>`}).join("")}`).join("")}
        </div>
        <p class="fhelp">Verde: dia tranquilo \xB7 amarelo: apertado \xB7 vermelho: sem respiro. Ajuste a rotina em Ajustes.</p>
      </section>

      <section class="block">
        <h2 class="block__title">${d("bulb",16)} Encontrar o melhor hor\xE1rio</h2>
        <div class="card">
          <div class="row2">
            <select class="input" data-f="type">${ie.map(l=>`<option value="${l}"${t.type===l?" selected":""}>${E[l].label}</option>`).join("")}</select>
            <input class="input" type="date" data-f="date" value="${t.date}">
          </div>
          ${s.team.map(l=>{let i=he({...u},{people:[l.id],limit:4});return`<div class="findrow">${q(l.id,26)}<div class="hintbox__times">${i.length?i.map(m=>`<button class="tchip" data-new="${l.id}|${m.time}">${w(m.time)}${m.peak?"<small>pico</small>":""}</button>`).join(""):'<span class="muted">Sem hor\xE1rio livre</span>'}</div></div>`}).join("")}
          <p class="fhelp">Toque num hor\xE1rio para j\xE1 criar o evento com a pessoa certa.</p>
        </div>
      </section>

      <section class="block">
        <h2 class="block__title">${d("sparkle",16)} Perguntar ao Claude</h2>
        <div class="card">
          <p>Abre o Claude <b>com o seu login normal</b> (app ou site), j\xE1 com a agenda de voc\xEAs e a pergunta prontas. N\xE3o precisa de chave.</p>
          <div class="presets">${zt.map((l,i)=>`<button class="preset" data-preset="${i}">${p(l.label)}</button>`).join("")}</div>
          <textarea class="input" rows="3" data-f="q" placeholder="Ou escreva sua pergunta\u2026 ex.: monte o cronograma da Pura Vida para dezembro">${p(t.q)}</textarea>
          <button class="btn btn--primary btn--block" data-ask>${d("sparkle",18)} Perguntar ao Claude</button>
          <p class="fhelp">A agenda tamb\xE9m \xE9 copiada. Se o Claude abrir vazio, toque e segure no campo de mensagem e escolha <b>Colar</b>.</p>
        </div>
      </section>
    </div>`},a=pe({className:"sheet--tall",html:e(),onMount:o=>{let c=o.el;c.querySelector('[data-f="type"]').onchange=n=>{t.type=n.target.value,o.set(e())},c.querySelector('[data-f="date"]').onchange=n=>{n.target.value&&(t.date=n.target.value,o.set(e()))},c.querySelector('[data-f="q"]').oninput=n=>t.q=n.target.value,c.querySelectorAll("[data-new]").forEach(n=>n.onclick=async()=>{let[r,u]=n.dataset.new.split("|"),{openEventEditor:l}=await import("./c-WI5IF7H2.js");l({date:t.date,type:t.type,time:u,assignees:[r]})}),c.querySelectorAll("[data-preset]").forEach(n=>n.onclick=()=>Kt(zt[+n.dataset.preset].q)),c.querySelector("[data-ask]").onclick=()=>{if(!t.q.trim())return g("Escreva a pergunta ou escolha uma sugest\xE3o");Kt(t.q.trim())}}});a.refresh=()=>{let o=document.activeElement;if(o&&a.el.contains(o)&&/INPUT|TEXTAREA|SELECT/.test(o.tagName))return;let c=a.el.scrollTop;a.set(e()),a.el.scrollTop=c}}var da={feed:"Feed",carrossel:"Carrossel",reels:"Reels",story:"Story",captacao:"Capta\xE7\xE3o",reuniao:"Reuni\xE3o",producao:"Edi\xE7\xE3o",outro:"Tarefa"},ma=["feed","carrossel","reels","story"],Be=t=>ma.includes(t),Ie={feed:"publicar o feed",carrossel:"publicar o carrossel",reels:"postar o Reels",story:"postar o story",captacao:"a capta\xE7\xE3o",reuniao:"a reuni\xE3o",producao:"a edi\xE7\xE3o",outro:"a tarefa"},pa=t=>t?t.replace(/^0/,"").replace(":00","h").replace(":","h"):"",ua=t=>{let[e,a]=String(t).split(":").map(Number);return e*60+a},Le=t=>Math.round(Date.UTC(+t.slice(0,4),+t.slice(5,7)-1,+t.slice(8,10))/864e5);function fa(t){let e=Number.isFinite(t.reminder)?t.reminder:30,a;return Be(t.type)?a=[120,30,0,-30]:t.type==="captacao"?a=[1440,120,45,-30]:t.type==="reuniao"?a=[1440,60,15]:a=[30,0],e>=0&&!a.includes(e)&&a.push(e),e<0&&(a=a.filter(o=>o<0)),[...new Set(a)].sort((o,c)=>c-o)}function Re(t,e,a=4){let o=Le(e.date)*1440+e.minutes,c=[];return t.forEach(n=>{if(!n||!n.time||!n.date||n.status==="feito")return;let r=Le(n.date)*1440+ua(n.time);fa(n).forEach(u=>{if(u<0&&n.status!=="pendente")return;let l=r-u;l<=o&&l>o-a&&c.push({ev:n,offset:u})})}),c}var ha=t=>{if(t>=60){let e=Math.floor(t/60),a=t%60;return a?`${e}h${String(a).padStart(2,"0")}`:`${e}h`}return`${t} min`};function He(t,e,a=""){let o=`${da[t.type]||"Tarefa"}${a?" \xB7 "+a:""}`,c=t.title?`\u201C${t.title}\u201D`:"",n=pa(t.time),r=t.location?` \xB7 ${t.location}`:"";return e>=1440?{title:`Amanh\xE3: ${o} \xE0s ${n}`,body:t.type==="captacao"?`Hoje: carregue baterias, esvazie os cart\xF5es e confirme com o cliente.${r}`:`${c}${r}`.trim()||"Confirme o hor\xE1rio com o cliente."}:e>0?{title:`Daqui a ${ha(e)}: ${o}`,body:`${n} \u2014 ${Ie[t.type]||"a tarefa"}${c?" "+c:""}${r}`}:e===0?{title:`Agora: ${o}`,body:`Est\xE1 na hora de ${Ie[t.type]||"fazer a tarefa"}${c?" "+c:""}.`}:{title:Be(t.type)?`J\xE1 postou? ${o}`:`J\xE1 fez? ${o}`,body:`Era \xE0s ${n}${c?" \u2014 "+c:""}. Toque para marcar como feito.`}}var N=document.getElementById("app"),X=null;function ba(){N.innerHTML=`
    <main id="view" class="view"></main>
    <nav class="tabbar" aria-label="Navega\xE7\xE3o">
      ${xt("hoje","today","Hoje")}
      ${xt("mes","calendar","Calend\xE1rio")}
      <button class="tabbar__fab" data-action="new-event" aria-label="Novo evento">${d("plus",28)}</button>
      ${xt("empresas","building","Empresas")}
      ${xt("ajustes","settings","Ajustes")}
    </nav>`}var xt=(t,e,a)=>`<button class="tabbar__btn" data-action="tab" data-tab="${t}">${d(e,24)}<span>${a}</span></button>`;function M(){let t=document.getElementById("view");if(!t)return;let e=window.scrollY,a=t.querySelector('[data-form="note"] input'),o=a?a.value:"",c=a&&document.activeElement===a,n=f.tab==="mes"?Se():f.tab==="empresas"?$e():f.tab==="ajustes"?Pe():xe();t.innerHTML=n,document.querySelectorAll(".tabbar__btn").forEach(u=>u.classList.toggle("is-on",u.dataset.tab===f.tab)),window.scrollTo(0,e);let r=t.querySelector('[data-form="note"] input');r&&o&&(r.value=o),r&&c&&r.focus({preventScroll:!0}),va()}function ga(){M(),qt().forEach(t=>t.refresh&&t.refresh())}function mt(t){f.tab=t,Tt(),M(),window.scrollTo(0,0)}var $a={tab:t=>mt(t.dataset.tab),"set-person":t=>{f.person=t.dataset.p,Tt(),M()},"set-date":t=>{f.date=t.dataset.k,M()},"go-today":()=>{f.date=v(),M()},week:t=>{f.date=y(f.date,Number(t.dataset.n)),M()},month:t=>{f.month=nt(f.month,Number(t.dataset.n)),f.monthSel=f.month===V(v())?v():`${f.month}-01`,M()},"month-today":()=>{f.month=V(v()),f.monthSel=v(),M()},"month-select":t=>{f.monthSel=t.dataset.k,V(t.dataset.k)!==f.month&&(f.month=V(t.dataset.k)),M()},"month-company":t=>{f.monthCompany=t.dataset.id||null,M()},"open-day":t=>{f.date=t.dataset.k,mt("hoje")},"toggle-tips":()=>{f.showAllTips=!f.showAllTips,M()},"open-event":t=>bt(t.dataset.id),assistant:()=>Oe(),"apply-fix":async t=>{let e=s.event(t.dataset.id);if(!e)return;let a;try{a=JSON.parse(t.dataset.patch)}catch{return}let o={};typeof a.time=="string"&&/^\d{2}:\d{2}$/.test(a.time)&&(o.time=a.time),Array.isArray(a.assignees)&&(o.assignees=a.assignees.filter(r=>s.member(r)));let{confirmMove:c}=await import("./c-WI5IF7H2.js");if(!await c(e,o))return;let n={...e};await s.upsert("events",{...e,...o}),g("Pronto, ajustado",{action:"Desfazer",onAction:()=>s.upsert("events",n)})},"toggle-done":async t=>{let e=s.event(t.dataset.id);if(!e)return;let a=e.status==="feito"?"pendente":"feito";await s.upsert("events",{...e,status:a}),a==="feito"&&g(`${E[e.type].label} conclu\xEDdo`,{action:"Desfazer",onAction:()=>s.upsert("events",{...s.event(e.id),status:e.status})})},"new-event":t=>{if(!s.state.companies.length)return g("Cadastre uma empresa primeiro"),Ct(null,()=>Pt({}));Pt({date:t.dataset.date||null})},"open-company":t=>ve(t.dataset.id),"new-company":()=>Ct(),"del-note":async t=>{let e=s.state.notes.find(a=>a.id===t.dataset.id);await s.remove("notes",t.dataset.id),e&&g("Bilhete apagado",{action:"Desfazer",onAction:()=>s.upsert("notes",e)})},"set-me":t=>{s.setMe(t.dataset.p),g(`Ol\xE1, ${s.member(t.dataset.p).name}!`)},"clear-demo":async()=>{await ct({title:"Apagar os dados de exemplo?",text:"O calend\xE1rio ficar\xE1 vazio para voc\xEAs cadastrarem as empresas e eventos reais.",ok:"Apagar exemplos",danger:!0})&&(await s.clearDemo(),g("Pronto! Agora cadastre suas empresas."))},"clear-all":()=>L.clearAll(),ics:t=>L.ics(t),"notify-enable":()=>L.notifyEnable(),"notify-test":()=>L.notifyTest(),"onboarding-again":()=>L.onboardingAgain(),export:()=>L.export(),logout:async()=>{await ct({title:"Sair da conta?",ok:"Sair"})&&(await X.signOut(),location.reload())}};document.addEventListener("click",t=>{let e=t.target.closest("[data-action]");if(!e||document.body.classList.contains("is-client"))return;let a=$a[e.dataset.action];a&&(t.preventDefault(),t.stopPropagation(),a(e))});document.addEventListener("change",t=>{t.target.matches('[data-action-change="import"]')&&L.import(t.target),t.target.closest("[data-notify-form]")&&L.notifyPrefs(t.target.closest("[data-notify-form]")),t.target.closest("[data-routine-form]")&&L.routine(t.target.closest("[data-routine-form]"))});document.addEventListener("submit",async t=>{let e=t.target.closest('[data-form="note"]');if(!e)return;t.preventDefault();let a=e.text.value.trim();if(a){if(!s.me){g("Escolha quem voc\xEA \xE9 em Ajustes");return}await s.upsert("notes",{id:ae("n_"),date:f.date,text:a,author:s.me}),g("Bilhete adicionado")}});function va(){document.querySelectorAll("[data-swipe]").forEach(t=>{let e=null,a=null;t.addEventListener("touchstart",o=>{e=o.touches[0].clientX,a=o.touches[0].clientY},{passive:!0}),t.addEventListener("touchend",o=>{if(e==null)return;let c=o.changedTouches[0].clientX-e,n=o.changedTouches[0].clientY-a;if(e=null,Math.abs(c)<50||Math.abs(c)<Math.abs(n)*1.5)return;let r=c<0?1:-1;t.dataset.swipe==="week"?f.date=y(f.date,7*r):(f.month=nt(f.month,r),f.monthSel=`${f.month}-01`),M()})})}var ze=new Set;function Ke(){if(!s.me)return;let t=new Date,e={date:v(),minutes:t.getHours()*60+t.getMinutes()},a=s.eventsBetween(y(e.date,-1),y(e.date,1),{person:s.me}),o=s.mode==="cloud"&&!!localStorage.getItem("pauta.device");Re(a,e,2).forEach(({ev:c,offset:n})=>{let r=`${c.id}@${n}@${c.date}${c.time}`;if(ze.has(r))return;ze.add(r);let u=He(c,n,s.company(c.companyId)?.name||"");g(`${u.title}`,{ms:7e3,action:"Ver",onAction:()=>bt(c.id)}),!o&&H()==="granted"&&navigator.serviceWorker&&navigator.serviceWorker.ready.then(l=>l.showNotification(u.title,{body:u.body,tag:`rem-${c.id}`,icon:"icons/icon-192.png",badge:"icons/icon-192.png",data:{url:`./#/e/${c.id}`}})).catch(()=>{})}),Ot(s.eventsOn(e.date,{person:s.me}).filter(c=>c.status!=="feito").length)}function Ft(t=location.hash){let e=/^#\/(e|d)\/([\w-]+)/.exec(t||"");return e?(history.replaceState(null,"",location.pathname+location.search),e[1]==="e"&&s.event(e[2])?(f.date=s.event(e[2]).date,mt("hoje"),bt(e[2])):e[1]==="d"&&/^\d{4}-\d{2}-\d{2}$/.test(e[2])&&(f.date=e[2],mt("hoje")),!0):!1}function Wt(t=""){N.innerHTML=`
  <div class="login">
    <img src="icons/icon-192.png" alt="" width="84" height="84">
    <h1>${p(A.appName)}</h1>
    <p>Agenda de conte\xFAdo \xB7 ${p(A.agencyName)}</p>
    <form class="form" data-login>
      <div class="fgroup"><label class="flabel" for="l-email">E-mail</label><input id="l-email" class="input" type="email" name="email" autocomplete="username" required></div>
      <div class="fgroup"><label class="flabel" for="l-pass">Senha</label><input id="l-pass" class="input" type="password" name="pass" autocomplete="current-password" required></div>
      ${t?`<p class="login__err">${p(t)}</p>`:""}
      <button class="btn btn--primary btn--block" type="submit">Entrar</button>
      <button class="btn-text btn-text--sm" type="button" data-reset>Esqueci minha senha</button>
    </form>
  </div>`;let e=N.querySelector("[data-login]");e.onsubmit=async a=>{a.preventDefault();try{await X.signIn(e.email.value.trim(),e.pass.value)}catch{Wt("E-mail ou senha incorretos.")}},N.querySelector("[data-reset]").onclick=async()=>{let a=e.email.value.trim();if(!a)return g("Digite seu e-mail primeiro");try{await X.resetPassword(a),g("Enviamos um e-mail para redefinir a senha")}catch{g("N\xE3o foi poss\xEDvel enviar o e-mail")}}}function Ue(t){document.querySelector("[data-login]")||document.getElementById("view")||(N.innerHTML=`<div class="splash">
    <img src="icons/icon-192.png" alt="" width="72" height="72">
    <h2>N\xE3o consegui conectar</h2>
    <p>Verifique a internet e tente de novo.</p>
    <button class="btn btn--primary" data-retry>Tentar de novo</button>
    <small class="muted">Detalhe: ${p(String(t&&(t.code||t.message)||t))}</small>
  </div>`,N.querySelector("[data-retry]").onclick=()=>location.reload())}function Ut(t="Carregando\u2026"){N.innerHTML=`<div class="splash"><img src="icons/icon-192.png" alt="" width="72" height="72"><p>${p(t)}</p></div>`}function Ve(){ba(),M(),s.on(ga),s.onError=t=>{let e=t&&/quota/i.test(String(t.name||t.message)),a=t&&/permission/i.test(String(t.code||t.message));g(e?"Mem\xF3ria do aparelho cheia: use logos menores ou ative a nuvem":a?"Sem permiss\xE3o na nuvem: confira as regras do Firebase":"N\xE3o foi poss\xEDvel salvar. Verifique a conex\xE3o.",{ms:5e3})},We(),s.on(We),s.on(()=>Ot(s.me?s.eventsOn(v(),{person:s.me}).filter(t=>t.status!=="feito").length:0)),setInterval(()=>{let t=document.activeElement,e=t&&/INPUT|TEXTAREA|SELECT/.test(t.tagName);f.tab==="hoje"&&!qt().length&&!e&&M(),Ke()},6e4),Ke(),document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&(f.date<v()&&f.tab==="hoje"&&(f.date=v()),M())}),setTimeout(De,600),s.mode==="cloud"&&H()==="granted"&&yt().catch(()=>{}),setTimeout(()=>Ft(),300)}var Vt=null;function We(){if(!s.me)return;let t=we(s.me,14),e=o=>o.date+":"+o.ids.slice().sort().join("|"),a=new Set(t.map(e));if(Vt){let o=t.find(c=>!Vt.has(e(c))&&c.ids.some(n=>s.event(n)?.updatedBy&&s.event(n).updatedBy!==s.me));o&&g(`Aten\xE7\xE3o: ${o.title} (${o.date.slice(8)}/${o.date.slice(5,7)})`,{action:"Ver",onAction:()=>{f.date=o.date,f.person="all",mt("hoje")},ms:7e3})}Vt=a}async function ya(){let t=location.hash||"",e=A.firebase;if(t.startsWith("#/c/")||t.startsWith("#/v/")){Ut("Carregando cronograma\u2026");let c=!!localStorage.getItem("pauta.me");try{if(t.startsWith("#/v/")){let u=await ne(t.slice(4));return Ht(N,At(u),{canGoBack:c})}if(!e)return kt(N,"Este link precisa da sincroniza\xE7\xE3o na nuvem ativada.");let{fetchPublic:n}=await import("./c-66S76OJ6.js"),r=await n(e,t.slice(4));return r?Ht(N,At(r),{canGoBack:c}):kt(N,"Este link n\xE3o existe mais. Pe\xE7a um novo link para a equipe.")}catch(n){return console.error(n),kt(N,"N\xE3o foi poss\xEDvel abrir o cronograma. Verifique a conex\xE3o e tente novamente.")}}if(!e)return await le(),Ve();Ut("Conectando \xE0 nuvem\u2026");let a=(c,n)=>Promise.race([c,new Promise((r,u)=>setTimeout(()=>u(new Error("tempo esgotado")),n))]);try{let{connect:c}=await import("./c-66S76OJ6.js");X=await a(c(e),15e3)}catch(c){return console.error(c),Ue(c)}let o=!1;setTimeout(()=>{o||Ue(new Error("o login n\xE3o respondeu"))},15e3),X.onUser(async c=>{if(o=!0,!c)return Wt();if(started)return;if(!A.team.some(r=>r.email&&r.email.toLowerCase()===(c.email||"").toLowerCase()))return await X.signOut(),Wt("Este e-mail n\xE3o faz parte da equipe (veja config.js).");started=!0,Ut("Sincronizando\u2026"),await Promise.race([de(X.backend,c),new Promise(r=>setTimeout(r,12e3))]),Ve()})}navigator.serviceWorker?.addEventListener("message",t=>{if(t.data?.type==="open"&&t.data.url){let e=t.data.url.split("#")[1];e&&Ft("#"+e)}});window.addEventListener("hashchange",()=>{if(/^#\/(e|d)\//.test(location.hash))return Ft();/^#\/(c|v)\//.test(location.hash)&&location.reload()});"serviceWorker"in navigator&&location.protocol!=="file:"&&navigator.serviceWorker.register("sw.js").catch(()=>{});ya();
