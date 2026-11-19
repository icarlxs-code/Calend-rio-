import{a as ve,b as Ue,d as Ge,e as Ve,f as r,i as pe,o as ye}from"./c-N7O36CIB.js";import{a as f}from"./c-DA3WSDQL.js";import{A as R,C as u,D as Be,E as B,F as Fe,H as He,c as j,d as S,e as M,f as Oe,g as re,i as qe,j as $,k as q,l as Q,m as w,n as Pe,s as je,u as Re,v as X,w as Z,x as Y}from"./c-DOOMBXLW.js";import{a as b,b as Je,c as E,d as I,e as ce,f as ge,h as de,i as Ye,j as be,k as $e}from"./c-3GA6RSWB.js";import{a as le}from"./c-LUBY74EX.js";var ee=(()=>{try{return JSON.parse(localStorage.getItem("pauta.ui")||"{}")}catch{return{}}})(),N={tab:ee.tab==="pessoal"?"hoje":ee.tab||"hoje",space:ee.space==="personal"?"personal":"work",ptab:ee.ptab||"p-hoje",pMonth:null,pSel:null,pView:"mes",person:ee.person||"all",date:S(),month:re(S()),monthSel:S(),monthCompany:null,showAllTips:!1};function Ct(){try{localStorage.setItem("pauta.ui",JSON.stringify({tab:N.tab,person:N.person,space:N.space,ptab:N.ptab}))}catch{}}var C=(e,t,s="#fff")=>`<svg viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="6" fill="${e}"/><g fill="none" stroke="${s}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${t}</g></svg>`,rt="url(#pf-ig)",we=[{id:"instagram",name:"Instagram",words:["instagram","insta"," ig ","feed","reels","reel","carrossel"],svg:`<svg viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="pf-ig" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#FEDA75"/><stop offset=".35" stop-color="#FA7E1E"/><stop offset=".6" stop-color="#D62976"/><stop offset="1" stop-color="#4F5BD5"/></linearGradient></defs><rect width="24" height="24" rx="6" fill="${rt}"/><g fill="none" stroke="#fff" stroke-width="1.9"><rect x="5" y="5" width="14" height="14" rx="4"/><circle cx="12" cy="12" r="3.3"/></g><circle cx="16.3" cy="7.7" r="1" fill="#fff"/></svg>`},{id:"tiktok",name:"TikTok",words:["tiktok","tik tok","tik-tok"],svg:C("#000",'<path d="M13 5v9.5a3 3 0 1 1-3-3" stroke="#25F4EE" transform="translate(-.7 -.5)"/><path d="M13 5v9.5a3 3 0 1 1-3-3" stroke="#FE2C55" transform="translate(.7 .5)"/><path d="M13 5v9.5a3 3 0 1 1-3-3M13 5c.4 2.2 1.8 3.6 4 3.8"/>')},{id:"youtube",name:"YouTube",words:["youtube","you tube","shorts"," yt "],svg:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="6" fill="#FF0000"/><path d="M10 8.5v7l6-3.5z" fill="#fff"/></svg>'},{id:"facebook",name:"Facebook",words:["facebook"," face "," fb "],svg:C("#1877F2",'<path d="M14.5 6.5H13a2.5 2.5 0 0 0-2.5 2.5v11M8.5 12h6"/>')},{id:"whatsapp",name:"WhatsApp",words:["whatsapp","whats","zap","wpp","status do whats"],svg:C("#25D366",'<path d="M6 18l1-3a6 6 0 1 1 2.3 2.2z"/><path d="M10 9.5c0 2 2.5 4.5 4.5 4.5" />')},{id:"linkedin",name:"LinkedIn",words:["linkedin","linked in"],svg:C("#0A66C2",'<path d="M8 10.5V17M8 7.3v.1M11.5 17v-6.5M11.5 13a2.5 2.5 0 0 1 5 0v4"/>')},{id:"x",name:"X (Twitter)",words:["twitter","tweet"," x "],svg:C("#000",'<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>')},{id:"threads",name:"Threads",words:["threads"],svg:C("#000",'<path d="M15.5 10.5c-.5-2.5-2-3.5-3.8-3.5C9 7 7.5 9.2 7.5 12s1.6 5 4.4 5c2.4 0 4-1.4 4-3.2 0-2-2.2-2.8-4-2.3-1.3.4-1.7 1.6-1 2.3.9.9 3.3.4 3.6-2.3"/>')},{id:"pinterest",name:"Pinterest",words:["pinterest","pin "],svg:C("#E60023",'<path d="M11 11l-2 8M9.5 14.5c.4.9 1.4 1.5 2.6 1.5 2.5 0 4-2.2 4-4.7C16.1 8.6 14.3 7 12 7a4.5 4.5 0 0 0-4.3 5.8"/>')},{id:"google",name:"Google Meu Neg\xF3cio",words:["google","meu neg\xF3cio","meu negocio","gmb","maps"],svg:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="6" fill="#fff" stroke="#ddd"/><g fill="none" stroke-width="2.4"><path d="M17.5 12.2H12" stroke="#4285F4"/><path d="M17.5 12.2a5.6 5.6 0 0 1-9.9 3.3" stroke="#34A853"/><path d="M7.6 15.5a5.6 5.6 0 0 1 0-7" stroke="#FBBC05"/><path d="M7.6 8.5a5.6 5.6 0 0 1 8.3-.6" stroke="#EA4335"/></g></svg>'},{id:"kwai",name:"Kwai",words:["kwai"],svg:C("#FF7E00",'<rect x="5" y="9" width="10" height="8" rx="2"/><path d="M15 12l4-2v6l-4-2"/><circle cx="8" cy="6.5" r="1.5"/><circle cx="12" cy="6.5" r="1.5"/>')},{id:"spotify",name:"Spotify",words:["spotify","podcast"],svg:C("#1DB954",'<path d="M7 9.5c3.5-1 7-.6 10 1M7.7 12.6c2.8-.7 5.6-.4 8 .9M8.4 15.5c2.2-.5 4.3-.3 6.1.7"/>')},{id:"telegram",name:"Telegram",words:["telegram"],svg:C("#26A5E4",'<path d="M5.5 11.5l12-5-2 11-4-3-2 2v-3.5l6-5"/>')},{id:"email",name:"E-mail",words:["e-mail","email","newsletter"],svg:C("#6B7280",'<rect x="5" y="7" width="14" height="10" rx="2"/><path d="m5.5 8 6.5 5 6.5-5"/>')},{id:"site",name:"Site / Blog",words:["site","blog","landing"],svg:C("#334155",'<circle cx="12" cy="12" r="6.5"/><path d="M5.5 12h13M12 5.5c2 2 2 11 0 13M12 5.5c-2 2-2 11 0 13"/>')}];function ct(e){let t=` ${[e?.title,e?.description,e?.internalNote].filter(Boolean).join(" ").toLowerCase()} `.replace(/[.,;:!?()/\-]/g," "),s=we.filter(a=>!["instagram"].includes(a.id)&&a.words.some(n=>t.includes((n.startsWith(" "),n))));return we[0].words.slice(0,3).some(a=>t.includes(a))&&s.unshift(we[0]),s}function ue(e,t=18){return(Array.isArray(e)?e:ct(e)).map(o=>`<span class="pf" style="width:${t}px;height:${t}px" title="${o.name}">${o.svg}</span>`).join("")}function K(e,t=26){let s=r.member(e);return s?s.photo?`<span class="avatar avatar--photo" style="--s:${t}px;background:${s.color}" title="${u(s.name)}"><img src="${s.photo}" alt="" loading="lazy"></span>`:`<span class="avatar" style="--s:${t}px;background:${s.color}" title="${u(s.name)}">${u(s.name[0])}</span>`:""}function dt(e=[],t=24){return e.length?`<span class="avatars">${e.map(s=>K(s,t)).join("")}</span>`:`<span class="avatar avatar--empty" style="--s:${t}px" title="Sem respons\xE1vel">?</span>`}var ae=(e=[])=>{let t=e.map(s=>r.member(s)?.name).filter(Boolean);return t.length?t.length===r.team.length&&t.length>1?"Os dois":t.join(" e "):"Sem respons\xE1vel"};function D(e,t=36,s=null){let o=s??Math.round(t*.28);return e?e.logo?`<span class="logo logo--img" style="--s:${t}px;--r:${o}px"><img src="${u(e.logo)}" alt=""></span>`:`<span class="logo" style="--s:${t}px;--r:${o}px;background:${e.color};color:${Fe(e.color)}">${u(Be(e.name))}</span>`:`<span class="logo" style="--s:${t}px;--r:${o}px;background:#999">?</span>`}function ke(e,{solid:t=!1}={}){let s=b[e]||b.outro;return`<span class="tbadge tbadge--${e}${t?" is-solid":""}">${f(s.icon,13)}${s.label}</span>`}function ze(e){if(!e.time)return"Dia todo";let t=b[e.type];return t&&(t.kind==="shoot"||t.kind==="meeting"||t.kind==="work"||e.duration)?t.kind==="post"&&!e.duration?w(e.time):`${w(e.time)}\u2013${w(q($(e.time)+I(e)))}`:w(e.time)}function xe(e,{showDate:t=!1,compact:s=!1,highlight:o=[]}={}){let a=r.company(e.companyId),n=a?.color||"#888",i=e.status==="feito",l=e.date===S()&&e.time&&$(e.time)+I(e)<Q()&&e.status==="pendente",m=o.includes(e.id);return`
  <article class="ecard${i?" is-done":""}${l?" is-late":""}${m?" is-flagged":""}${s?" is-compact":""}"
    style="--cc:${n};--cc-soft:${B(n,.1)}" data-action="open-event" data-id="${e.id}">
    <div class="ecard__time">
      <strong>${e.time?w(e.time):"\u2014"}</strong>
      ${t?`<small>${u(e.date.slice(8))}/${u(e.date.slice(5,7))}</small>`:e.time&&(b[e.type]?.kind!=="post"||e.duration)?`<small>${w(q($(e.time)+I(e)))}</small>`:""}
    </div>
    <div class="ecard__body">
      <div class="ecard__top">
        ${D(a,20,6)}
        <span class="ecard__company">${u(a?.name||"Sem empresa")}</span>
        ${ke(e.type)}
      </div>
      <div class="ecard__title"><span class="pfrow">${ue(e,17)}</span>${u(e.title||b[e.type]?.label||"Evento")}</div>
      ${s?"":`<div class="ecard__meta">
        ${dt(e.assignees,20)}<span>${u(ae(e.assignees))}</span>
        ${e.location?`<span class="ecard__loc">${f("pin",12)}${u(e.location)}</span>`:""}
        ${l?'<span class="ecard__late">Atrasado</span>':""}
        ${e.visibleToClient===!1?`<span class="ecard__private" title="N\xE3o aparece para o cliente">${f("eyeoff",12)}</span>`:""}
      </div>`}
    </div>
    ${r.canEdit("events",e)?`<button class="ecard__check${i?" is-on":""}" data-action="toggle-done" data-id="${e.id}" aria-label="${i?"Desmarcar":"Marcar como feito"}">
      ${f("check",16)}
    </button>`:""}
  </article>`}function _e(e,t,s=""){return`<div class="empty">${f("sparkle",28)}<h3>${u(e)}</h3><p>${u(t)}</p>${s}</div>`}var te=[];function O({html:e,onMount:t,className:s="",onClose:o}){let a=document.getElementById("sheets"),n=document.createElement("div");n.className="sheet-wrap",n.innerHTML=`<div class="sheet-backdrop" data-close></div>
    <section class="sheet ${s}" role="dialog" aria-modal="true">
      <div class="sheet__grab" data-grab><span></span></div>
      <div class="sheet__inner"></div>
    </section>`,a.appendChild(n);let i=n.querySelector(".sheet__inner"),p=n.querySelector(".sheet"),c={el:i,panel:p,set(d){i.innerHTML=d,t&&t(c)},close(){if(c.closed)return;c.closed=!0,n.classList.remove("is-open");let d=te.indexOf(c);d>=0&&te.splice(d,1),setTimeout(()=>n.remove(),280),o&&o(),document.body.classList.toggle("has-sheet",te.length>0)}};te.push(c),c.set(e),document.body.classList.add("has-sheet"),requestAnimationFrame(()=>requestAnimationFrame(()=>n.classList.add("is-open"))),n.addEventListener("click",d=>{d.target.closest("[data-close]")&&c.close()});let l=null,m=0,h=n.querySelector("[data-grab]"),g=d=>{!d.target.closest("[data-grab], .sheet__head")||d.target.closest("button, input, select, textarea")||(l=d.touches[0].clientY,m=0,p.style.transition="none")},T=d=>{l!=null&&(m=Math.max(0,d.touches[0].clientY-l),p.style.transform=`translateY(${m}px)`)},k=()=>{l!=null&&(p.style.transition="",p.style.transform="",m>110&&c.close(),l=null)};return p.addEventListener("touchstart",g,{passive:!0}),p.addEventListener("touchmove",T,{passive:!0}),p.addEventListener("touchend",k),h&&h.addEventListener("click",()=>{}),c}var jt=()=>te;function F(e,{left:t="",right:s=""}={}){return`<header class="sheet__head">
    <div class="sheet__head-l">${t||'<button class="btn-text" data-close>Fechar</button>'}</div>
    <h2>${u(e)}</h2>
    <div class="sheet__head-r">${s}</div>
  </header>`}var Ke;function _(e,{action:t,onAction:s,ms:o=2600}={}){let a=document.getElementById("toast");a.innerHTML=`<span>${u(e)}</span>${t?`<button>${u(t)}</button>`:""}`,a.classList.add("is-on"),t&&(a.querySelector("button").onclick=()=>{a.classList.remove("is-on"),s&&s()}),clearTimeout(Ke),Ke=setTimeout(()=>a.classList.remove("is-on"),o)}function H({title:e,text:t="",ok:s="Confirmar",danger:o=!1}){return new Promise(a=>O({className:"sheet--dialog",html:`<div class="dialog">
        <h3>${u(e)}</h3>${t?`<p>${u(t)}</p>`:""}
        <button class="btn ${o?"btn--danger":"btn--primary"} btn--block" data-ok>${u(s)}</button>
        <button class="btn btn--ghost btn--block" data-close>Cancelar</button>
      </div>`,onClose:()=>a(!1),onMount:i=>{i.el.querySelector("[data-ok]").onclick=()=>{a(!0),i.close()}}}))}function z({title:e,text:t="",bodyHtml:s="",options:o}){return new Promise(a=>{let n=null;O({className:"sheet--dialog",html:`<div class="dialog">
        <h3>${u(e)}</h3>${t?`<p>${u(t)}</p>`:""}${s}
        ${o.map((i,p)=>`<button class="btn ${i.danger?"btn--danger":i.primary?"btn--primary":"btn--soft"} btn--block" data-i="${p}">${u(i.label)}</button>`).join("")}
        <button class="btn btn--ghost btn--block" data-close>Cancelar</button>
      </div>`,onClose:()=>a(n),onMount:i=>{i.el.querySelectorAll("[data-i]").forEach(p=>p.onclick=()=>{n=o[+p.dataset.i].value,i.close()})}})})}var pt={workStart:"08:00",workEnd:"19:00",lunchStart:"12:00",lunchEnd:"13:00",daysOff:[0],travelMin:45,maxTasks:8},Me=()=>({...pt,...r.state.settings.find(e=>e.id==="routine")||{}}),L=e=>{let t=$(e.time);return t==null?null:[t,t+I(e)]},V=(e,t)=>e&&t&&e[0]<t[1]&&t[0]<e[1],W=e=>["shoot","meeting"].includes(b[e.type]?.kind),We=e=>!E(e.type),Se=e=>r.company(e.companyId)?.name||"",G=e=>`${b[e.type]?.label||"Evento"}${Se(e)?" \xB7 "+Se(e):""}`,U=e=>r.member(e)?.name||"\u2014",Ee=e=>E(e.type)&&!e.duration?`\xE0s ${w(e.time)}`:`das ${w(e.time)} \xE0s ${w(q(L(e)[1]))}`,Qe=(e,t)=>(e.location||e.companyId)===(t.location||t.companyId),se=(e,t,s)=>r.state.events.filter(o=>o.date===t&&o.id!==s&&o.time&&o.status!=="feito"&&(o.assignees||[]).includes(e));function oe(e,{isNew:t=!1}={}){let s=[];if(!e.date)return s;let o=Me(),a=e.time?[$(e.time),$(e.time)+I(e)]:null,n=e.assignees||[];if(a){n.forEach(l=>{se(l,e.date,e.id).forEach(m=>{if(!V(a,L(m)))return;let h=E(e.type)!==E(m.type)&&(E(e.type)||E(m.type));s.push({level:"block",code:"overlap",person:l,eventIds:[m.id],title:`${U(l)} j\xE1 tem compromisso nesse hor\xE1rio`,text:`${G(m)} ${Ee(m)}${m.createdBy?` (marcado por ${m.createdBy===r.me?"voc\xEA":U(m.createdBy)})`:""}.`+(h?" Se for manter, deixe o post programado antes.":"")})})}),r.state.events.filter(l=>l.id!==e.id&&l.date===e.date&&l.companyId===e.companyId&&l.type===e.type&&l.time&&Math.abs($(l.time)-a[0])<=30).forEach(l=>{s.some(m=>m.eventIds?.includes(l.id))||s.push({level:"block",code:"duplicate",eventIds:[l.id],title:"Parece que isso j\xE1 foi marcado",text:`J\xE1 existe ${G(l)} ${Ee(l)}, com ${(l.assignees||[]).map(U).join(" e ")||"ningu\xE9m"}${l.createdBy?`, marcado por ${l.createdBy===r.me?"voc\xEA":U(l.createdBy)}`:""}.`})}),W(e)&&n.forEach(l=>{se(l,e.date,e.id).filter(W).forEach(m=>{let h=L(m),g=a[0]>=h[1]?a[0]-h[1]:h[0]>=a[1]?h[0]-a[1]:-1;g>=0&&g<o.travelMin&&!Qe(e,m)&&s.push({level:"warn",code:"travel",person:l,eventIds:[m.id],title:`Pouco tempo de deslocamento para ${U(l)}`,text:`S\xF3 ${g} min entre isto e ${G(m)} (${w(m.time)}). O combinado \xE9 ${o.travelMin} min.`})})});let p=$(o.workStart),c=$(o.workEnd);We(e)&&(a[0]<p||a[1]>c)?s.push({level:"warn",code:"hours",title:"Fora do expediente",text:`O hor\xE1rio de trabalho de voc\xEAs \xE9 das ${w(o.workStart)} \xE0s ${w(o.workEnd)}. Preservar o tempo livre evita esgotamento.`}):E(e.type)&&(a[0]<p||a[0]>=c)&&s.push({level:"info",code:"hours",title:"Post fora do expediente",text:"Deixe programado no Meta Business Suite para ningu\xE9m precisar parar o descanso para postar."}),We(e)&&V(a,[$(o.lunchStart),$(o.lunchEnd)])&&s.push({level:"warn",code:"lunch",title:"Invade o almo\xE7o",text:`O almo\xE7o de voc\xEAs \xE9 das ${w(o.lunchStart)} \xE0s ${w(o.lunchEnd)}.`}),a[1]>1440&&s.push({level:"warn",code:"midnight",title:"Passa da meia-noite",text:"Confira a dura\xE7\xE3o."}),t&&(e.date<S()||e.date===S()&&a[0]<Q()-5)&&s.push({level:"warn",code:"past",title:"Esse hor\xE1rio j\xE1 passou",text:"Confira o dia e a hora."}),["feed","reels","carrossel"].includes(e.type)&&r.state.events.filter(l=>l.id!==e.id&&l.date===e.date&&l.companyId===e.companyId&&["feed","reels","carrossel"].includes(l.type)&&l.time).forEach(l=>{let m=Math.abs($(l.time)-a[0]);m>30&&m<180&&s.push({level:"warn",code:"spacing",eventIds:[l.id],title:"Posts da mesma empresa muito pr\xF3ximos",text:`${G(l)} \xE0s ${w(l.time)}. Espacem pelo menos 3 h.`})}),r.team.filter(l=>!n.includes(l.id)).forEach(l=>{se(l.id,e.date,e.id).filter(m=>V(a,L(m))).forEach(m=>{s.push({level:"info",code:"partner",person:l.id,eventIds:[m.id],title:`${l.name} nesse hor\xE1rio`,text:`${G(m)} ${Ee(m)}${m.location?" \xB7 "+m.location:""}.`})})})}let i=j(e.date).getDay();return o.daysOff.includes(i)&&!E(e.type)&&s.push({level:"warn",code:"dayoff",title:`${Pe[i]} \xE9 dia de folga`,text:"Se der, mude para um dia \xFAtil. Posts podem ficar programados."}),n.forEach(p=>{let c=r.state.events.filter(l=>l.date===e.date&&l.id!==e.id&&(l.assignees||[]).includes(p)).length+1;c>o.maxTasks&&s.push({level:"warn",code:"load",person:p,title:`${U(p)} ficaria sobrecarregado`,text:`${c} tarefas nesse dia (limite combinado: ${o.maxTasks}).`})}),s}function me(e,{limit:t=3,people:s=null}={}){if(!e.date)return[];let o=Me(),a=s||(e.assignees?.length?e.assignees:[]),n=I(e),i=E(e.type),p=i?420:$(o.workStart),c=i?1320:$(o.workEnd),l=[$(o.lunchStart),$(o.lunchEnd)],m=(b[e.type]?.best||[]).map($),h=e.date===S()?Math.ceil((Q()+15)/15)*15:0,g=r.state.events.filter(d=>d.id!==e.id&&d.date===e.date&&d.companyId&&d.companyId===e.companyId&&d.time&&(d.type===e.type||i&&E(d.type)&&d.type!=="story"&&e.type!=="story")).map(d=>({t:$(d.time),gap:d.type===e.type&&e.type==="story"?45:d.type===e.type?180:120})),T=[];for(let d=Math.max(p,h);d+n<=c;d+=15){let v=[d,d+n];if(!i&&V(v,l)||g.some(x=>Math.abs(x.t-d)<x.gap)||a.some(x=>se(x,e.date,e.id).some(A=>{let Le=L(A);return V(v,Le)?!0:W(e)&&W(A)&&!Qe(e,A)?V([v[0]-o.travelMin,v[1]+o.travelMin],Le):!1})))continue;let J=m.length?Math.min(...m.map(x=>Math.abs(x-d))):Math.abs(d-$(o.workStart)-60);T.push({time:q(d),score:J})}T.sort((d,v)=>d.score-v.score);let k=[];for(let d of T)if(k.every(v=>Math.abs($(v.time)-$(d.time))>=60)&&k.push(d),k.length>=t)break;return k.sort((d,v)=>$(d.time)-$(v.time)).map(d=>({...d,peak:d.score<=30}))}function fe(e){if(!e.time)return r.team.map(s=>s.id);let t=[$(e.time),$(e.time)+I(e)];return r.team.filter(s=>!se(s.id,e.date,e.id).some(o=>V(t,L(o)))).map(s=>s.id)}function ut(e,t){let s=Me();if(s.daysOff.includes(j(t).getDay()))return{minutes:null,longest:null,dayOff:!0};let o=$(s.workStart),a=$(s.workEnd),n=[[$(s.lunchStart),$(s.lunchEnd)]];r.eventsOn(t,{person:e}).filter(l=>l.time).forEach(l=>{let m=L(l);n.push([m[0],E(l.type)?m[0]+15:m[1]+(W(l)?30:0)])}),n.sort((l,m)=>l[0]-m[0]);let i=o,p=0,c=0;return n.forEach(([l,m])=>{if(l>=a||m<=o)return;let h=Math.max(l,o),g=Math.min(m,a);g<=i||(h>i&&(p+=h-i,c=Math.max(c,h-i)),i=Math.max(i,g))}),a>i&&(p+=a-i,c=Math.max(c,a-i)),{minutes:p,longest:c,dayOff:!1}}function Ut(e,t,s){let o=[],a=E(t.type)&&!E(s.type)?t:E(s.type)&&!E(t.type)?s:(t.createdAt||0)>(s.createdAt||0)?t:s,n=r.team.find(p=>p.id!==e);n&&fe(a).includes(n.id)&&(a.assignees||[]).length===1&&o.push({label:`Passar para ${n.name}`,eventId:a.id,patch:{assignees:[n.id]}});let i=me(a,{limit:1})[0];return i&&o.push({label:`Mover ${b[a.type].label.toLowerCase()} para ${w(i.time)}`,eventId:a.id,patch:{time:i.time}}),o}function Gt(e,t="all"){let s=t==="all"?r.team:r.team.filter(n=>n.id===t),o=[];return r.eventsOn(e,{person:t}).length?(s.forEach(n=>{let i=r.eventsOn(e,{person:n.id}),p=ut(n.id,e),c=i.filter(W),l=[`${i.length} tarefa${i.length===1?"":"s"}`];c.length&&l.push(`sai para ${c.map(m=>`${Se(m)} \xE0s ${w(m.time)}`).join(" e ")}`),p.dayOff?l.push("\xE9 dia de folga"):p.minutes!=null&&l.push(p.minutes>=30?`${Y(p.minutes)} livres no expediente (maior intervalo: ${Y(p.longest)})`:"quase sem tempo livre"),o.push(`${n.name}: ${l.join(", ")}.`)}),o):[`Nenhum compromisso${t==="all"?"":" para "+U(t)}. Bom dia para planejar a pauta ou adiantar edi\xE7\xF5es.`]}var mt={feed:"\u{1F5BC}\uFE0F",carrossel:"\u{1F5C2}\uFE0F",reels:"\u{1F3AC}",story:"\u2B55",captacao:"\u{1F4F8}",reuniao:"\u{1F91D}",producao:"\u2702\uFE0F",outro:"\u2022"},ne=e=>String(e||"").replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\r?\n/g,"\\n"),ft=e=>{let t=[];for(;e.length>74;)t.push(e.slice(0,74)),e=" "+e.slice(74);return t.push(e),t.join(`\r
`)},Xe=(e,t)=>e.replace(/-/g,"")+"T"+t.replace(":","")+"00",ht=()=>new Date().toISOString().replace(/[-:]/g,"").replace(/\.\d+/,"");function vt(e,t){let s=["BEGIN:VCALENDAR","VERSION:2.0",`PRODID:-//${le.appName}//PT-BR`,"CALSCALE:GREGORIAN","METHOD:PUBLISH",`X-WR-CALNAME:${ne(t)}`];return e.forEach(o=>{let a=r.company(o.companyId),n=(o.assignees||[]).map(l=>r.member(l)?.name).filter(Boolean).join(" e "),i=`${mt[o.type]||""} ${b[o.type]?.label||"Evento"} \xB7 ${a?.name||""}${o.title?" \u2014 "+o.title:""}`.trim(),p=[n&&`Respons\xE1vel: ${n}`,o.description,o.internalNote&&`Nota interna: ${o.internalNote}`].filter(Boolean).join(`
`);if(s.push("BEGIN:VEVENT",`UID:${o.id}@pauta`,`DTSTAMP:${ht()}`),o.time){let l=$(o.time)+I(o),m=l>=1440?M(o.date,1):o.date;s.push(`DTSTART:${Xe(o.date,o.time)}`,`DTEND:${Xe(m,q(l%1440))}`)}else s.push(`DTSTART;VALUE=DATE:${o.date.replace(/-/g,"")}`,`DTEND;VALUE=DATE:${M(o.date,1).replace(/-/g,"")}`);s.push(`SUMMARY:${ne(i)}`),p&&s.push(`DESCRIPTION:${ne(p)}`),o.location&&s.push(`LOCATION:${ne(o.location)}`);let c=o.reminder??30;c>=0&&s.push("BEGIN:VALARM","ACTION:DISPLAY",`DESCRIPTION:${ne(i)}`,`TRIGGER:-PT${c}M`,"END:VALARM"),s.push("END:VEVENT")}),s.push("END:VCALENDAR"),s.map(ft).join(`\r
`)}async function Ze(e,t,s){let o=vt(e,s),a=pe();if(a){let c=document.createElement("form");c.method="POST",c.action=a.replace(/\/$/,"")+"/ics",c.target="_blank",c.style.display="none";let l=document.createElement("textarea");l.name="ics",l.value=o,c.appendChild(l),document.body.appendChild(c),c.submit(),c.remove();return}let n=new File([o],t,{type:"text/calendar"});if(navigator.canShare&&navigator.canShare({files:[n]}))try{await navigator.share({files:[n],title:s});return}catch(c){if(c&&c.name==="AbortError")return}let i=URL.createObjectURL(n),p=document.createElement("a");p.href=i,p.download=t,document.body.appendChild(p),p.click(),p.remove(),setTimeout(()=>URL.revokeObjectURL(i),4e3)}var gt=[[/pura vida|hortifruti|jg garcia/i,"hortifruti: frutas, verduras e legumes frescos"],[/bbq|burger|hamb/i,"hamburgueria e churrasco (BBQ)"],[/multimarcas|moda|roupa/i,"loja de roupas multimarcas"],[/festa/i,"loja de artigos e decora\xE7\xE3o de festas"]];function Ie(e){if(e?.niche)return e.niche;let t=gt.find(([s])=>s.test(e?.name||""));return t?t[1]:""}function bt(){let e=S();return r.state.companies.map(t=>{let s=r.state.events.filter(i=>i.companyId===t.id&&b[i.type]?.kind==="post"),o=s.filter(i=>i.date<=e&&(i.status==="feito"||i.date<e)).map(i=>i.date).sort(),a=s.filter(i=>i.date>=e&&i.status!=="feito").map(i=>i.date).sort(),n=o[o.length-1]||"";return{name:t.name,niche:Ie(t)||"pequena empresa local",lastPost:n,nextPost:a[0]||"",daysSincePost:n?qe(n,e):null}})}var et=null,tt="";function aa(){r.mode!=="cloud"||!pe()||!r.ready||(clearTimeout(et),et=setTimeout(()=>{let e=bt(),t=JSON.stringify(e);t!==tt&&ye("/coach",{companies:e}).then(()=>tt=t).catch(()=>{})},4e3))}var sa=()=>ye("/coach-test",{});function fa(){let e=r.companiesSorted(),t=S(),s=Oe(t),o=M(s,6);return`
  <header class="hdr">
    <div class="hdr__row">
      <div class="hdr__titles"><p class="hdr__eyebrow">${e.length} cliente${e.length===1?"":"s"}</p><h1>Empresas</h1></div>
      <div class="hdr__actions"><button class="btn btn--primary btn--sm" data-action="new-company">${f("plus",16)} Nova</button></div>
    </div>
  </header>
  <div class="page">
    ${e.length?"":_e("Nenhuma empresa ainda","Cadastre os clientes com nome, cor e logomarca. Cada um ganha um link pr\xF3prio para ver s\xF3 o seu cronograma.",`<button class="btn btn--primary" data-action="new-company">${f("plus",18)} Cadastrar empresa</button>`)}
    <div class="colist">
      ${e.map(a=>{let n=r.eventsBetween(s,o,{companyId:a.id}),i=n.filter(l=>E(l.type)).length,p=n.filter(l=>l.type==="captacao").length,c=r.state.events.filter(l=>l.companyId===a.id&&l.date>=t&&l.status!=="feito").sort((l,m)=>(l.date+l.time).localeCompare(m.date+m.time))[0];return`<button class="cocard" style="--cc:${a.color};--cc-soft:${B(a.color,.1)}" data-action="open-company" data-id="${a.id}">
          <div class="cocard__top">
            ${D(a,48)}
            <div class="cocard__name"><strong>${u(a.name)}</strong>${a.instagram?`<small>${f("insta",12)} @${u(a.instagram)}</small>`:""}</div>
            ${f("right",18,"muted")}
          </div>
          <div class="cocard__stats">
            <span><b>${i}</b> posts</span><span><b>${p}</b> capta\xE7${p===1?"\xE3o":"\xF5es"}</span><span class="muted">nesta semana</span>
          </div>
          ${c?`<div class="cocard__next">${f(b[c.type].icon,14)} <b>${u(X(c.date))}${c.time?" "+c.time:""}</b> \xB7 ${u(b[c.type].label)} \u2014 ${u(c.title||"")}</div>`:'<div class="cocard__next muted">Nada agendado</div>'}
        </button>`}).join("")}
    </div>
  </div>`}function ha(e){let t=O({className:"sheet--tall",html:at(e),onMount:s=>$t(s,e)});t.refresh=()=>r.company(e)?t.set(at(e)):t.close()}function at(e){let t=r.company(e);if(!t)return"";let s=S(),o=re(s),a=r.eventsBetween(`${o}-01`,`${o}-31`,{companyId:e}),n=r.eventsBetween(s,M(s,30),{companyId:e}),i=r.eventsBetween(M(s,-14),M(s,-1),{companyId:e}).reverse(),p=h=>a.filter(g=>h.includes(g.type)).length,c=a.filter(h=>h.status==="feito").length,l="",m=n.map(h=>{let g=h.date!==l?`<h4 class="dayhead">${u(Z(h.date))}</h4>`:"";return l=h.date,g+xe(h)}).join("");return`
  ${F("",{right:r.canEdit("companies",t)?'<button class="btn-text" data-act="edit">Editar</button>':""})}
  <div class="cohero" style="--cc:${t.color};--cc-soft:${B(t.color,.14)}">
    ${D(t,72,20)}
    <h2>${u(t.name)}</h2>
    ${t.instagram?`<a class="cohero__ig" href="https://instagram.com/${encodeURIComponent(t.instagram)}" target="_blank" rel="noopener">${f("insta",14)} @${u(t.instagram)}</a>`:""}
    <div class="cohero__btns">
      <button class="btn btn--primary btn--sm" data-act="new">${f("plus",16)} Evento</button>
      <button class="btn btn--soft btn--sm" data-act="clientview">${f("eye",16)} P\xE1gina do cliente</button>
      <button class="btn btn--soft btn--sm" data-act="share">${f("share",16)} Enviar</button>
    </div>
  </div>

  <div class="page page--sheet">
    <section class="block">
      <h2 class="block__title">${u(Re(o))}</h2>
      <div class="mstats mstats--5">
        <div><b>${p(["feed","carrossel"])}</b><span>feed</span></div>
        <div><b>${p(["reels"])}</b><span>reels</span></div>
        <div><b>${p(["story"])}</b><span>stories</span></div>
        <div><b>${p(["captacao"])}</b><span>capta\xE7\xF5es</span></div>
        <div><b>${a.length?Math.round(c/a.length*100):0}%</b><span>feito</span></div>
      </div>
    </section>

    ${t.address||t.contact||t.notes?`<ul class="rows">
      ${t.address?`<li><span class="rows__k">${f("pin",16)} Endere\xE7o</span><a class="rows__v link" href="https://maps.apple.com/?q=${encodeURIComponent(t.address)}" target="_blank" rel="noopener">${u(t.address)}</a></li>`:""}
      ${t.contact?`<li><span class="rows__k">${f("user",16)} Contato</span><span class="rows__v">${u(t.contact)}</span></li>`:""}
      ${t.notes?`<li><span class="rows__k">${f("note",16)} Observa\xE7\xF5es</span><span class="rows__v">${u(t.notes)}</span></li>`:""}
    </ul>`:""}

    <section class="block">
      <h2 class="block__title">Pr\xF3ximos 30 dias</h2>
      ${m||_e("Nada agendado","Crie o cronograma de postagens desta empresa.")}
    </section>

    ${i.length?`<section class="block">
      <h2 class="block__title">\xDAltimas 2 semanas</h2>
      ${i.map(h=>xe(h,{showDate:!0,compact:!0})).join("")}
    </section>`:""}
  </div>`}function $t(e,t){let s=e.el;(s.querySelector('[data-act="edit"]')||{}).onclick=()=>Te(t),s.querySelector('[data-act="new"]').onclick=async()=>{let{openEventEditor:o}=await import("./c-RP46EQU3.js");o({companyId:t})},s.querySelector('[data-act="share"]').onclick=()=>Ce(t),s.querySelector('[data-act="clientview"]').onclick=()=>yt(t)}function Te(e=null,t=null){let s=e?r.company(e):null,o=r.state.companies.map(p=>p.color),a=s?{...s}:{id:R("c_"),name:"",color:de.find(p=>!o.includes(p))||de[0],logo:null,instagram:"",address:"",contact:"",notes:"",shareToken:null},n=()=>`
    ${F(s?"Editar empresa":"Nova empresa",{left:'<button class="btn-text" data-close>Cancelar</button>',right:'<button class="btn btn--primary btn--sm" data-save>Salvar</button>'})}
    <form class="form" onsubmit="return false">
      <div class="logopick">
        <div data-preview>${D({...a,name:a.name||"?"},88,24)}</div>
        <div class="logopick__btns">
          <label class="btn btn--soft btn--sm">${f("image",16)} ${a.logo?"Trocar logo":"Enviar logomarca"}<input type="file" accept="image/*" data-file hidden></label>
          ${a.logo?'<button type="button" class="btn-text btn-text--sm" data-rmlogo>Remover logo</button>':'<p class="fhelp">Opcional. Sem logo, usamos as iniciais na cor escolhida.</p>'}
        </div>
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-name">Nome da empresa</label>
        <input id="c-name" class="input" name="name" value="${u(a.name)}" placeholder="Ex.: Pura Vida" autocomplete="off" maxlength="60">
      </div>
      <div class="fgroup">
        <label class="flabel">Cor da empresa no calend\xE1rio</label>
        <div class="palette">
          ${de.map(p=>`<button type="button" class="swatch${a.color===p?" is-on":""}" style="background:${p}" data-color="${p}" aria-label="Cor ${p}">${f("check",16)}</button>`).join("")}
          <label class="swatch swatch--custom" title="Outra cor"><input type="color" value="${a.color}" data-customcolor>${f("plus",16)}</label>
        </div>
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-ig">Instagram</label>
        <div class="input-prefix"><span>@</span><input id="c-ig" class="input" name="instagram" value="${u(a.instagram||"")}" placeholder="usuario" autocomplete="off" autocapitalize="none"></div>
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-niche">O que a empresa faz (para as dicas)</label>
        <input id="c-niche" class="input" name="niche" value="${u(a.niche||Ie(a))}" placeholder="Ex.: hamburgueria artesanal, loja de roupas femininas" autocomplete="off" maxlength="160">
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-addr">Endere\xE7o (para capta\xE7\xF5es)</label>
        <input id="c-addr" class="input" name="address" value="${u(a.address||"")}" placeholder="Rua, n\xFAmero \u2013 bairro" autocomplete="off">
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-contact">Contato</label>
        <input id="c-contact" class="input" name="contact" value="${u(a.contact||"")}" placeholder="Nome e WhatsApp do respons\xE1vel" autocomplete="off">
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-notes">Observa\xE7\xF5es internas</label>
        <textarea id="c-notes" class="input" name="notes" rows="3" placeholder="Tom de voz, o que evitar, prefer\xEAncias\u2026">${u(a.notes||"")}</textarea>
      </div>
      ${s?`<button type="button" class="btn btn--danger-soft btn--block" data-delete>${f("trash",18)} Excluir empresa</button>`:""}
      <div class="form__spacer"></div>
    </form>`,i=p=>{let c=p.el,l=c.querySelector("form"),m=()=>{a.name=l.name.value.trim(),a.instagram=l.instagram.value.trim().replace(/^@/,""),a.niche=l.niche.value.trim(),a.address=l.address.value.trim(),a.contact=l.contact.value.trim(),a.notes=l.notes.value.trim()},h=()=>c.querySelector("[data-preview]").innerHTML=D({...a,name:l.name.value||"?"},88,24);l.name.addEventListener("input",h),c.querySelectorAll("[data-color]").forEach(k=>k.onclick=()=>{a.color=k.dataset.color,c.querySelectorAll("[data-color]").forEach(d=>d.classList.toggle("is-on",d===k)),h()}),c.querySelector("[data-customcolor]").oninput=k=>{a.color=k.target.value,c.querySelectorAll("[data-color]").forEach(d=>d.classList.remove("is-on")),h()},c.querySelector("[data-file]").onchange=async k=>{let d=k.target.files[0];if(d)try{m(),a.logo=await He(d,160),p.set(n())}catch{_("N\xE3o foi poss\xEDvel ler essa imagem")}};let g=c.querySelector("[data-rmlogo]");g&&(g.onclick=()=>{m(),a.logo=null,p.set(n())});let T=c.querySelector("[data-delete]");T&&(T.onclick=async()=>{let k=r.state.events.filter(v=>v.companyId===a.id);await H({title:`Excluir ${a.name}?`,text:k.length?`Os ${k.length} eventos desta empresa tamb\xE9m ser\xE3o apagados e o link do cliente deixar\xE1 de funcionar.`:"O link do cliente deixar\xE1 de funcionar.",ok:"Excluir empresa",danger:!0})&&(await r.removeMany("events",k.map(v=>v.id)),await r.remove("companies",a.id),p.close(),_("Empresa exclu\xEDda"))}),c.querySelector("[data-save]").onclick=async()=>{if(m(),!a.name)return l.name.focus(),_("Digite o nome da empresa");await r.upsert("companies",{...a}),p.close(),_(s?"Empresa atualizada":"Empresa cadastrada"),t&&t(r.company(a.id))}};O({className:"sheet--tall",html:n(),onMount:i})}async function Ce(e){let t=r.company(e),s=r.mode==="cloud",o="";s?(await r.ensureShareToken(t),await r.publishCompany(e),o=Ge(r.company(e).shareToken)):o=Ve(await Ue(ve(t,r.state.events,{maxFuture:90})));let a=`
    ${F("Link do cliente")}
    <div class="share">
      <div class="share__co">${D(t,56)}<div><strong>${u(t.name)}</strong><small>v\xEA somente o pr\xF3prio cronograma</small></div></div>
      <ul class="checks">
        <li>${f("check",16)} Somente os eventos da ${u(t.name)}</li>
        <li>${f("check",16)} Sem notas internas e sem outras empresas</li>
        <li>${f("check",16)} Somente leitura: o cliente n\xE3o consegue alterar nada</li>
        <li>${f(s?"check":"alert",16)} ${s?"Sempre atualizado: tudo que voc\xEAs mudarem aparece para o cliente":"Foto do cronograma atual (pr\xF3ximos 90 dias). Quando mudar algo, envie o link de novo"}</li>
      </ul>
      <div class="share__link"><input readonly value="${u(o)}" data-link></div>
      <div class="share__btns">
        <button class="btn btn--primary btn--block" data-sharebtn>${f("share",18)} Enviar para o cliente</button>
        <button class="btn btn--soft btn--block" data-copy>${f("copy",18)} Copiar link</button>
        <a class="btn btn--ghost btn--block" href="${u(o)}" target="_blank" rel="noopener">${f("eye",18)} Ver como o cliente v\xEA</a>
      </div>
      ${s?'<button class="btn-text btn-text--sm btn-text--danger" data-revoke>Gerar novo link (o antigo para de funcionar)</button>':'<p class="fhelp">Dica: ative a sincroniza\xE7\xE3o na nuvem (Ajustes) para o link ficar sempre atualizado automaticamente.</p>'}
    </div>`;O({html:a,onMount:n=>{let i=n.el;i.querySelector("[data-copy]").onclick=async()=>{try{await navigator.clipboard.writeText(o),_("Link copiado")}catch{i.querySelector("[data-link]").select(),_("Selecione e copie o link")}},i.querySelector("[data-sharebtn]").onclick=async()=>{let c=`Ol\xE1! Este \xE9 o cronograma de conte\xFAdo da ${t.name}. Por aqui voc\xEAs acompanham tudo o que est\xE1 planejado: posts, stories, reels e capta\xE7\xF5es.`;if(navigator.share)try{await navigator.share({title:`Cronograma \xB7 ${t.name}`,text:c,url:o})}catch{}else await navigator.clipboard?.writeText(`${c}
${o}`),_("Mensagem copiada")};let p=i.querySelector("[data-revoke]");p&&(p.onclick=async()=>{await H({title:"Gerar um novo link?",text:"Quem tiver o link antigo n\xE3o conseguir\xE1 mais ver o cronograma.",ok:"Gerar novo link",danger:!0})&&(await r.regenerateShareToken(r.company(e)),n.close(),Ce(e))})}})}async function yt(e){let t=r.company(e);if(!t)return;let{showClient:s}=await import("./c-3ZGAM64U.js"),{sanitizePayload:o}=await import("./c-WC5LJBRR.js"),a=o(ve(t,r.state.events)),n=document.createElement("div");n.className="client-preview",n.innerHTML=`<div class="client-preview__bar"><button class="btn btn--soft btn--sm" data-closepv>${f("left",16)} Voltar</button><span>Assim o cliente v\xEA</span><button class="btn btn--primary btn--sm" data-sendpv>${f("share",16)} Enviar</button></div><div class="client-preview__body"></div>`,document.body.appendChild(n),document.body.classList.add("has-sheet"),s(n.querySelector(".client-preview__body"),a,{canGoBack:!1,preview:!0});let i=()=>{n.remove(),document.body.classList.toggle("has-sheet",!!document.querySelector(".sheet-wrap"))};n.querySelector("[data-closepv]").onclick=i,n.querySelector("[data-sendpv]").onclick=()=>{i(),Ce(e)}}function Ca(e){let t=O({html:st(e),className:"sheet--tall",onMount:s=>wt(s,e)});t.refresh=()=>{if(!r.event(e))return t.close();t.set(st(e))}}function st(e){let t=r.event(e);if(!t)return"";let s=r.company(t.companyId),o=s?.color||"#666",a=be.find(c=>c.v===(t.reminder??30)),n=t.seriesId?r.state.events.filter(c=>c.seriesId===t.seriesId).length:0,i=r.canEdit("events",t),p=r.member(r.ownerOf("events",t))?.name||"o parceiro";return`
  ${F("",{right:i?'<button class="btn-text" data-act="edit">Editar</button>':""})}
  <div class="detail">
    <div class="detail__hero" style="--cc:${o};--cc-soft:${B(o,.12)}">
      <div class="detail__co">${D(s,40)}<div><strong>${u(s?.name||"Sem empresa")}</strong>${s?.instagram?`<small>@${u(s.instagram)}</small>`:""}</div>${ke(t.type,{solid:!0})}</div>
      <h2><span class="pfrow">${ue(t,24)}</span>${u(t.title||b[t.type].label)}</h2>
      <p class="detail__when">${f("calendar",15)} ${u(X(t.date))}, ${u(je(t.date).split(", ")[1])} \xB7 ${f("clock",15)} ${u(ze(t))}</p>
    </div>

    ${i?"":`<p class="detail__lock">${f("eye",14)} Cadastrado por ${u(p)} \u2014 voc\xEA s\xF3 pode ver. Use \u201CDuplicar\u201D para criar uma c\xF3pia sua.</p>`}
    <div class="seg seg--status"${i?"":" hidden"}>
      ${ge.map(c=>`<button class="seg__btn${t.status===c?" is-on":""} st-${c}" data-status="${c}">${c==="feito"?f("check",14):""}${ce[c].label}</button>`).join("")}
    </div>

    <ul class="rows">
      <li><span class="rows__k">${f("users",16)} Respons\xE1vel</span><span class="rows__v">${(t.assignees||[]).map(c=>K(c,22)).join("")} ${u(ae(t.assignees))}</span></li>
      ${t.location?`<li><span class="rows__k">${f("pin",16)} Local</span><a class="rows__v link" href="https://maps.apple.com/?q=${encodeURIComponent(t.location)}" target="_blank" rel="noopener">${u(t.location)}</a></li>`:""}
      ${b[t.type].kind!=="post"||t.duration?`<li><span class="rows__k">${f("clock",16)} Dura\xE7\xE3o</span><span class="rows__v">${u(Y(I(t)))}</span></li>`:""}
      <li><span class="rows__k">${f("bell",16)} Lembrete</span><span class="rows__v">${u(a?.label||"\u2014")}</span></li>
      ${n?`<li><span class="rows__k">${f("repeat",16)} Repeti\xE7\xE3o</span><span class="rows__v">${n} eventos na s\xE9rie</span></li>`:""}
      <li><span class="rows__k">${f(t.visibleToClient===!1?"eyeoff":"eye",16)} Cliente</span><span class="rows__v">${t.visibleToClient===!1?"N\xE3o aparece para o cliente":"Aparece no calend\xE1rio do cliente"}</span></li>
    </ul>

    ${t.description?`<div class="textbox"><h4>Descri\xE7\xE3o / legenda</h4><p>${u(t.description)}</p></div>`:""}
    ${t.internalNote?`<div class="textbox textbox--note"><h4>${f("eyeoff",13)} Nota interna (s\xF3 a equipe v\xEA)</h4><p>${u(t.internalNote)}</p></div>`:""}

    <div class="actions">
      <button data-act="ics">${f("bell",20)}<span>Lembrete no iPhone</span></button>
      ${i?`<button data-act="tomorrow">${f("right",20)}<span>Passar p/ amanh\xE3</span></button>`:""}
      <button data-act="dup">${f("copy",20)}<span>Duplicar</span></button>
      ${i?`<button data-act="del" class="is-danger">${f("trash",20)}<span>Excluir</span></button>`:""}
    </div>
    <p class="detail__meta">Criado por ${u(r.member(t.createdBy)?.name||"\u2014")}${t.updatedAt?" \xB7 atualizado "+new Date(t.updatedAt).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):""}</p>
  </div>`}function wt(e,t){let s=e.el;s.querySelectorAll("[data-status]").forEach(a=>a.onclick=async()=>{let n=r.event(t);await r.upsert("events",{...n,status:a.dataset.status})});let o=(a,n)=>{let i=s.querySelector(`[data-act="${a}"]`);i&&(i.onclick=n)};o("edit",()=>ot({id:t})),o("dup",async()=>{let n={...r.event(t),id:R("e_"),status:"pendente",seriesId:null,createdAt:null,createdBy:null};await r.upsert("events",n),e.close(),_("Evento duplicado"),ot({id:n.id})}),o("tomorrow",async()=>{let a=r.event(t);await Et(a,{date:M(a.date,1)})&&(await r.upsert("events",{...a,date:M(a.date,1)}),_("Movido para "+X(M(a.date,1)).toLowerCase(),{action:"Desfazer",onAction:()=>r.upsert("events",{...r.event(t),date:a.date})}))}),o("ics",()=>{let a=r.event(t);Ze([a],`${b[a.type].label}-${a.date}.ics`,le.appName)}),o("del",()=>it(t,e))}async function it(e,t){let s=r.event(e),o=[e];if(s.seriesId){let n=r.state.events.filter(i=>i.seriesId===s.seriesId&&i.date>=s.date).map(i=>i.id);if(n.length>1){let i=await z({title:"Excluir evento repetido",options:[{label:"S\xF3 este",value:"one",danger:!0},{label:`Este e os pr\xF3ximos (${n.length})`,value:"next",danger:!0}]});if(!i)return;i==="next"&&(o=n)}else if(!await H({title:"Excluir este evento?",ok:"Excluir",danger:!0}))return}else if(!await H({title:"Excluir este evento?",text:"Ele some para a dupla e para o cliente.",ok:"Excluir",danger:!0}))return;let a=o.map(n=>({...r.event(n)}));await r.removeMany("events",o),t&&t.close(),_(o.length>1?`${o.length} eventos exclu\xEDdos`:"Evento exclu\xEDdo",{action:"Desfazer",onAction:()=>r.upsertMany("events",a),ms:4500})}function ot({id:e=null,date:t=null,companyId:s=null,type:o=null,time:a=null,assignees:n=null}={}){let i=e?r.event(e):null;if(i&&!r.canEdit("events",i)){r._denied("events",i);return}let p=r.companiesSorted(),c=o||"feed",l=i?JSON.parse(JSON.stringify(i)):{id:R("e_"),type:c,companyId:s||N.monthCompany||(p.length===1?p[0].id:null),title:"",date:t||(N.tab==="mes"?N.monthSel:N.date)||S(),time:a||b[c].best[0]||"12:00",duration:["shoot","meeting","work","other"].includes(b[c].kind)?b[c].dur:null,assignees:n||(N.person!=="all"?[N.person]:r.me?[r.me]:[]),location:"",description:"",internalNote:"",reminder:30,visibleToClient:b[c].client,status:"pendente"},m=i?JSON.parse(JSON.stringify(i)):null,h={mode:"none",until:M(l.date,28)};return O({className:"sheet--tall",html:lt(l,!!i,h),onMount:T=>kt(T,l,m,h)})}function Ne(e,t){let s=(e.assignees||[]).includes(t.id);return e.notifyPartner===!1?s?`Sem aviso agora. Como ${t.name} \xE9 respons\xE1vel, ele ainda recebe os lembretes do hor\xE1rio.`:`${t.name} n\xE3o recebe aviso nem lembretes deste evento. Fica s\xF3 na agenda.`:`${t.name} recebe o aviso de que voc\xEA marcou e os lembretes do hor\xE1rio.`}var he=e=>["shoot","meeting","work","other"].includes(b[e].kind),ie=e=>["shoot","meeting"].includes(b[e].kind);function lt(e,t,s){let o=r.companiesSorted();return`
  ${F(t?"Editar evento":"Novo evento",{left:'<button class="btn-text" data-close>Cancelar</button>',right:'<button class="btn btn--primary btn--sm" data-save>Salvar</button>'})}
  <form class="form" data-editor onsubmit="return false">
    <div class="fgroup">
      <label class="flabel">O que \xE9?</label>
      <div class="typegrid">
        ${Je.map(a=>`<button type="button" class="typebtn tbadge--${a}${e.type===a?" is-on":""}" data-type="${a}">${f(b[a].icon,20)}<span>${b[a].label}</span></button>`).join("")}
      </div>
    </div>

    <div class="fgroup">
      <label class="flabel">Empresa</label>
      <div class="cogrid">
        ${o.map(a=>`<button type="button" class="cobtn${e.companyId===a.id?" is-on":""}" style="--cc:${a.color}" data-company="${a.id}">${D(a,26,7)}<span>${u(a.name)}</span></button>`).join("")}
        <button type="button" class="cobtn cobtn--add" data-newco>${f("plus",18)}<span>Nova empresa</span></button>
      </div>
    </div>

    <div class="fgroup">
      <label class="flabel" for="f-title">T\xEDtulo</label>
      <input id="f-title" class="input" name="title" value="${u(e.title)}" placeholder="${u(b[e.type].placeholder)}" autocomplete="off" maxlength="120">
    </div>

    <div class="fgroup row2">
      <div><label class="flabel" for="f-date">Dia</label><input id="f-date" class="input" type="date" name="date" value="${e.date}" required></div>
      <div><label class="flabel" for="f-time">Hor\xE1rio</label><input id="f-time" class="input" type="time" name="time" value="${e.time||""}" step="300"></div>
    </div>

    <div class="fgroup" data-when="duration" ${he(e.type)?"":"hidden"}>
      <label class="flabel" for="f-dur">Dura\xE7\xE3o</label>
      <select id="f-dur" class="input" name="duration">
        ${Ye.map(a=>`<option value="${a}"${(e.duration||b[e.type].dur)===a?" selected":""}>${Y(a)}</option>`).join("")}
      </select>
    </div>

    <div data-hint></div>

    <div class="fgroup">
      <label class="flabel">Quem vai fazer?</label>
      <div class="whogrid">
        ${r.team.map(a=>`<button type="button" class="whobtn${(e.assignees||[]).includes(a.id)?" is-on":""}" style="--mc:${a.color}" data-who="${a.id}">${K(a.id,30)}<span>${u(a.name)}</span><i class="whobtn__check">${f("check",14)}</i></button>`).join("")}
      </div>
      <p class="fhelp">Marque os dois se forem juntos.</p>
      ${r.team.filter(a=>a.id!==r.me).map(a=>`<label class="list__row notifyrow"><span><b>${f("bell",15)} Avisar ${a.name==="Matheus"||a.name==="Henrique"?"o ":""}${u(a.name)}</b><small data-notifyhelp>${Ne(e,a)}</small></span><input type="checkbox" class="switch" name="notifyPartner" ${e.notifyPartner!==!1?"checked":""}></label>`).join("")}
    </div>

    <div class="fgroup" data-when="location" ${ie(e.type)?"":"hidden"}>
      <label class="flabel" for="f-loc">Local</label>
      <input id="f-loc" class="input" name="location" value="${u(e.location||"")}" placeholder="Endere\xE7o ou nome do lugar" autocomplete="off">
      <button type="button" class="btn-text btn-text--sm" data-useaddr hidden>${f("pin",14)} Usar endere\xE7o da empresa</button>
    </div>

    <div class="fgroup">
      <label class="flabel" for="f-desc">Descri\xE7\xE3o / legenda <em class="tag">${f("eye",12)} cliente v\xEA</em></label>
      <textarea id="f-desc" class="input" name="description" rows="3" placeholder="Ideia do post, legenda, roteiro\u2026">${u(e.description||"")}</textarea>
    </div>
    <div class="fgroup">
      <label class="flabel" for="f-note">Nota interna <em class="tag tag--note">${f("eyeoff",12)} s\xF3 a equipe</em></label>
      <textarea id="f-note" class="input" name="internalNote" rows="2" placeholder="Equipamento, observa\xE7\xF5es, combinados\u2026">${u(e.internalNote||"")}</textarea>
    </div>

    <div class="list">
      <label class="list__row"><span>${f("bell",18)} Lembrete</span>
        <select name="reminder">${be.map(a=>`<option value="${a.v}"${(e.reminder??30)===a.v?" selected":""}>${a.label}</option>`).join("")}</select>
      </label>
      ${t?"":`<label class="list__row"><span>${f("repeat",18)} Repetir</span>
        <select name="repeat">${$e.map(a=>`<option value="${a.v}"${s.mode===a.v?" selected":""}>${a.label}</option>`).join("")}</select>
      </label>
      <label class="list__row" data-when="until" hidden><span>${f("calendar",18)} At\xE9</span>
        <input type="date" name="until" value="${s.until}">
      </label>`}
      <label class="list__row"><span>${f("eye",18)} Aparece para o cliente</span>
        <input type="checkbox" class="switch" name="visibleToClient" ${e.visibleToClient!==!1?"checked":""}>
      </label>
      ${t?`<label class="list__row"><span>${f("check",18)} Status</span>
        <select name="status">${ge.map(a=>`<option value="${a}"${e.status===a?" selected":""}>${ce[a].label}</option>`).join("")}</select>
      </label>`:""}
    </div>

    ${t?`<button type="button" class="btn btn--danger-soft btn--block" data-delete>${f("trash",18)} Excluir evento</button>`:""}
    <div class="form__spacer"></div>
  </form>`}function kt(e,t,s,o){let a=e.el,n=a.querySelector("[data-editor]"),i=d=>a.querySelector(d),p=()=>{let d=i("[data-hint]");d.innerHTML=_t(t,!s),d.querySelectorAll("[data-settime]").forEach(v=>v.onclick=()=>{t.time=v.dataset.settime,n.time.value=t.time,p()}),d.querySelectorAll("[data-setwho]").forEach(v=>v.onclick=()=>{t.assignees=[v.dataset.setwho],a.querySelectorAll("[data-who]").forEach(y=>y.classList.toggle("is-on",t.assignees.includes(y.dataset.who))),p()})},c=()=>{a.querySelector('[data-when="duration"]').hidden=!he(t.type),a.querySelector('[data-when="location"]').hidden=!ie(t.type);let d=r.company(t.companyId),v=i("[data-useaddr]");v.hidden=!(d&&d.address&&n.location.value!==d.address);let y=a.querySelector('[data-when="until"]');y&&(y.hidden=o.mode==="none")};a.querySelectorAll("[data-type]").forEach(d=>d.onclick=()=>{let v=t.type;if(t.type=d.dataset.type,a.querySelectorAll("[data-type]").forEach(y=>y.classList.toggle("is-on",y===d)),n.title.placeholder=b[t.type].placeholder,(!s||v!==t.type)&&(t.duration=he(t.type)?b[t.type].dur:null,n.duration.value=String(b[t.type].dur),s||(t.visibleToClient=b[t.type].client,n.visibleToClient.checked=t.visibleToClient)),ie(t.type)&&!n.location.value){let y=r.company(t.companyId);y?.address&&(n.location.value=y.address,t.location=y.address)}c(),p()}),a.querySelectorAll("[data-company]").forEach(d=>d.onclick=()=>{t.companyId=d.dataset.company,a.querySelectorAll("[data-company]").forEach(y=>y.classList.toggle("is-on",y===d));let v=r.company(t.companyId);ie(t.type)&&v?.address&&!n.location.value&&(n.location.value=v.address,t.location=v.address),c()}),i("[data-newco]").onclick=()=>{Te(null,d=>{t.companyId=d.id,m(),e.set(lt(t,!!s,o))})},a.querySelectorAll("[data-who]").forEach(d=>d.onclick=()=>{let v=d.dataset.who;t.assignees=t.assignees.includes(v)?t.assignees.filter(x=>x!==v):[...t.assignees,v],d.classList.toggle("is-on",t.assignees.includes(v)),p();let y=a.querySelector("[data-notifyhelp]"),J=r.team.find(x=>x.id!==r.me);y&&J&&(y.textContent=Ne(t,J))});let l=a.querySelector('input[name="notifyPartner"]');l&&(l.onchange=()=>{t.notifyPartner=l.checked;let d=a.querySelector("[data-notifyhelp]"),v=r.team.find(y=>y.id!==r.me);d&&v&&(d.textContent=Ne(t,v))}),i("[data-useaddr]").onclick=()=>{let d=r.company(t.companyId);n.location.value=d.address,t.location=d.address,c()};let m=()=>{t.title=n.title.value.trim(),t.date=n.date.value,t.time=n.time.value||"",t.duration=he(t.type)?Number(n.duration.value):null,t.location=ie(t.type)?n.location.value.trim():"",t.description=n.description.value.trim(),t.internalNote=n.internalNote.value.trim(),t.reminder=Number(n.reminder.value),t.visibleToClient=n.visibleToClient.checked,n.status&&(t.status=n.status.value),n.repeat&&(o.mode=n.repeat.value),n.until&&(o.until=n.until.value)};n.addEventListener("input",()=>{m(),c()}),n.addEventListener("change",()=>{m(),c(),p()});let h=i("[data-delete]");h&&(h.onclick=()=>it(t.id,null).then(()=>!r.event(t.id)&&e.close())),i("[data-save]").onclick=async()=>{if(m(),!g){if(!t.companyId){_("Escolha a empresa"),a.querySelector(".cogrid").scrollIntoView({behavior:"smooth",block:"center"});return}if(!t.date)return _("Escolha o dia");if(!(!t.assignees.length&&!await H({title:"Ningu\xE9m respons\xE1vel?",text:"Este evento ficar\xE1 sem respons\xE1vel. Deseja salvar assim mesmo?",ok:"Salvar assim"}))&&!g){g=!0;try{await T()}finally{g=!1}}}};let g=!1,T=async()=>{if(s){if(["date","time","duration","type","assignees","companyId"].some(v=>JSON.stringify(t[v])!==JSON.stringify(s[v]))&&!await De(t,!1,e,k))return;await It(t,s)}else if(o.mode!=="none"){let d=St(t.date,o),v=d.filter(x=>oe({...t,date:x},{isNew:!0}).some(A=>A.level==="block")),y=d;if(v.length){let x=await z({title:`${v.length} de ${d.length} datas j\xE1 t\xEAm compromisso nesse hor\xE1rio`,text:v.slice(0,6).map(A=>Z(A)).join(" \xB7 ")+(v.length>6?" \u2026":""),options:[{label:`Criar s\xF3 nas ${d.length-v.length} datas livres`,value:"free",primary:!0},{label:"Criar em todas mesmo assim",value:"all"}]});if(!x)return;if(x==="free"&&(y=d.filter(A=>!v.includes(A))),!y.length)return _("Nenhuma data livre")}let J=R("s_");await r.upsertMany("events",y.map((x,A)=>({...t,id:A===0?t.id:R("e_"),date:x,seriesId:J})),{activity:{notifyPartner:t.notifyPartner,kind:"series",count:y.length,label:`${b[t.type].label} ${$e.find(x=>x.v===o.mode)?.label.toLowerCase()||""} \xE0s ${w(t.time)}`,sample:{companyId:t.companyId,date:y[0]}}}),_(`${y.length} eventos criados`)}else{if(!await De(t,!0,e,k))return;await r.upsert("events",{...t}),_("Evento salvo")}e.close()};function k(){n.time.value=t.time||"",n.date.value=t.date,a.querySelectorAll("[data-who]").forEach(d=>d.classList.toggle("is-on",t.assignees.includes(d.dataset.who))),c(),p()}c(),p()}var Ae=420,nt=1380,P=e=>(Math.min(Math.max(e,Ae),nt)-Ae)/(nt-Ae)*100;function xt(e,t){let s=e.time?L(e):null,o=[8,10,12,14,16,18,20,22];return`<div class="lanes">
    <div class="lanes__head"><strong>Agenda dos dois em ${u(Z(e.date))}</strong></div>
    ${r.team.map(a=>{let n=r.eventsOn(e.date,{person:a.id}).filter(c=>c.id!==e.id&&c.time),i=(e.assignees||[]).includes(a.id),p=t.some(c=>c.level==="block"&&c.person===a.id);return`<div class="lane">
        <span class="lane__who">${K(a.id,22)}</span>
        <div class="lane__track">
          ${o.map(c=>`<i class="lane__tick" style="left:${P(c*60)}%"></i>`).join("")}
          ${n.map(c=>{let l=L(c),m=r.company(c.companyId);return`<span class="lane__ev" style="left:${P(l[0])}%;width:max(4px,${P(l[1])-P(l[0])}%);background:${m?.color||"#888"}" title="${u(G(c))}"></span>`}).join("")}
          ${s&&i?`<span class="lane__draft${p?" is-clash":""}" style="left:${P(s[0])}%;width:max(6px,${P(s[1])-P(s[0])}%)"></span>`:""}
        </div>
      </div>`}).join("")}
    <div class="lane lane--axis"><span class="lane__who"></span><div class="lane__track">${o.map(a=>`<small style="left:${P(a*60)}%">${a}h</small>`).join("")}</div></div>
  </div>`}function _t(e,t){if(!e.date)return"";let s=oe(e,{isNew:t}),o=s.filter(g=>g.level==="block"),a=s.filter(g=>g.level==="warn"),n=s.filter(g=>g.level==="info"),i=me(e,{limit:4}),p=fe(e),c=(e.assignees||[]).length===1?e.assignees[0]:null,l=o.length&&c?r.team.find(g=>g.id!==c&&p.includes(g.id)):null,m=b[e.type],h=g=>`<li class="issue issue--${g.level}">${f(g.level==="block"?"alert":g.level==="warn"?"flag":g.code==="partner"?"user":"bulb",15)}<div><strong>${u(g.title)}</strong><p>${u(g.text)}</p></div></li>`;return`
  <section class="assist">
    <header class="assist__head">${f("sparkle",16)} Assistente</header>
    ${xt(e,s)}
    ${s.length?`<ul class="issues">${[...o,...a,...n].map(h).join("")}</ul>`:e.time?`<p class="assist__ok">${f("check",15)} Hor\xE1rio livre para ${u(ae(e.assignees))}, sem conflitos.</p>`:""}
    ${l?`<button type="button" class="tchip tchip--wide" data-setwho="${l.id}">${K(l.id,18)} Passar para ${u(l.name)} (est\xE1 livre)</button>`:""}
    <div class="assist__sugg">
      <p>${u(m.tip)}</p>
      ${i.length?`<div class="hintbox__times">${i.map(g=>`<button type="button" class="tchip${e.time===g.time?" is-on":""}" data-settime="${g.time}">${w(g.time)}${g.peak?"<small>pico</small>":"<small>livre</small>"}</button>`).join("")}</div>`:`<p class="muted">Nenhum hor\xE1rio livre nesse dia${(e.assignees||[]).length?" para "+u(ae(e.assignees)):""}. Tente outro dia ou outra pessoa.</p>`}
    </div>
  </section>`}async function De(e,t,s,o){let n=oe(e,{isNew:t}).filter(h=>h.level==="block");if(!n.length)return!0;let i=me(e,{limit:2}),p=(e.assignees||[]).length===1?e.assignees[0]:null,c=p&&r.team.find(h=>h.id!==p&&fe(e).includes(h.id)),l=[...i.map(h=>({label:`Mudar para ${w(h.time)} (livre)`,value:"time:"+h.time,primary:!0})),...c?[{label:`Passar para ${c.name} (est\xE1 livre)`,value:"who:"+c.id,primary:!i.length}]:[],{label:"Marcar mesmo assim",value:"force"}],m=await z({title:n[0].code==="duplicate"?"Isso j\xE1 est\xE1 na agenda":"J\xE1 tem compromisso nesse hor\xE1rio",bodyHtml:`<ul class="issues issues--dialog">${n.map(h=>`<li class="issue issue--block">${f("alert",15)}<div><strong>${u(h.title)}</strong><p>${u(h.text)}</p></div></li>`).join("")}</ul>`,options:l});return m?m==="force"?!0:(m.startsWith("time:")&&(e.time=m.slice(5)),m.startsWith("who:")&&(e.assignees=[m.slice(4)]),o(),De(e,t,s,o)):!1}async function Et(e,t){let s={...e,...t},o=oe(s).filter(n=>n.level==="block");return o.length?await z({title:"J\xE1 tem compromisso nesse hor\xE1rio",bodyHtml:`<ul class="issues issues--dialog">${o.map(n=>`<li class="issue issue--block">${f("alert",15)}<div><strong>${u(n.title)}</strong><p>${u(n.text)}</p></div></li>`).join("")}</ul>`,options:[{label:"Mover mesmo assim",value:"force",primary:!0}]})==="force":!0}function St(e,t){let s=[],o=e,a=t.until&&t.until>=e?t.until:M(e,28);for(;o<=a&&s.length<150;){let n=j(o).getDay();(t.mode==="daily"||t.mode==="weekdays"&&n>=1&&n<=5||t.mode==="weekly"&&j(o).getDay()===j(e).getDay())&&s.push(o),o=M(o,1)}return s}var Mt=["type","companyId","title","time","duration","assignees","location","description","internalNote","reminder","visibleToClient"];async function It(e,t){let s=Mt.filter(o=>JSON.stringify(e[o])!==JSON.stringify(t[o]));if(e.seriesId&&s.length){let o=r.state.events.filter(a=>a.seriesId===e.seriesId&&a.date>t.date);if(o.length){let a=await z({title:"Evento repetido",text:"Aplicar as altera\xE7\xF5es a quais eventos?",options:[{label:"S\xF3 a este",value:"one",primary:!0},{label:`A este e aos pr\xF3ximos (${o.length+1})`,value:"next"}]});if(!a)return;if(a==="next"){let n=Object.fromEntries(s.map(i=>[i,e[i]]));await r.upsertMany("events",[{...e},...o.map(i=>({...i,...n}))],{activity:{kind:"series-edit",count:o.length+1,label:`${b[e.type].label} \xB7 a partir de ${e.date.slice(8)}/${e.date.slice(5,7)}`,sample:{companyId:e.companyId,date:e.date}}}),_("S\xE9rie atualizada");return}}}await r.upsert("events",{...e}),_("Altera\xE7\xF5es salvas")}export{aa as a,sa as b,K as c,dt as d,D as e,xe as f,_e as g,O as h,jt as i,F as j,_ as k,H as l,z as m,N as n,Ct as o,Me as p,L as q,G as r,me as s,ut as t,Ut as u,Gt as v,Ze as w,Ca as x,ot as y,Et as z,fa as A,ha as B,Te as C};
