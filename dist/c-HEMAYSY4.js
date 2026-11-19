import{a as ge,b as Je,d as Ye,e as ze,f as c,i as pe,o as ke}from"./c-65MZAPVT.js";import{a as f}from"./c-DA3WSDQL.js";import{B as m,C as Ue,D as F,E as Ge,G as Ve,c as B,d as E,e as M,f as je,g as re,i as Be,j as $,k as P,l as Y,m as k,n as Re,r as Fe,t as He,u as X,v as Z,w as z,z as R}from"./c-YEARXB46.js";import{a as g,b as Ke,c as S,d as I,e as ce,f as $e,h as de,i as We,j as ye,k as we}from"./c-3GA6RSWB.js";import{a as le}from"./c-LUBY74EX.js";var ee=(()=>{try{return JSON.parse(localStorage.getItem("pauta.ui")||"{}")}catch{return{}}})(),N={tab:ee.tab==="pessoal"?"hoje":ee.tab||"hoje",space:ee.space==="personal"?"personal":"work",ptab:ee.ptab||"p-hoje",pMonth:null,pSel:null,pView:"mes",person:ee.person||"all",date:E(),month:re(E()),monthSel:E(),monthCompany:null,showAllTips:!1};function Ft(){try{localStorage.setItem("pauta.ui",JSON.stringify({tab:N.tab,person:N.person,space:N.space,ptab:N.ptab}))}catch{}}var A=(e,t,s="#fff")=>`<svg viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="6" fill="${e}"/><g fill="none" stroke="${s}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${t}</g></svg>`,vt="url(#pf-ig)",me=[{id:"instagram",name:"Instagram",words:["instagram","insta"," ig ","feed","reels","reel","carrossel"],svg:`<svg viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="pf-ig" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#FEDA75"/><stop offset=".35" stop-color="#FA7E1E"/><stop offset=".6" stop-color="#D62976"/><stop offset="1" stop-color="#4F5BD5"/></linearGradient></defs><rect width="24" height="24" rx="6" fill="${vt}"/><g fill="none" stroke="#fff" stroke-width="1.9"><rect x="5" y="5" width="14" height="14" rx="4"/><circle cx="12" cy="12" r="3.3"/></g><circle cx="16.3" cy="7.7" r="1" fill="#fff"/></svg>`},{id:"tiktok",name:"TikTok",words:["tiktok","tik tok","tik-tok"],svg:A("#000",'<path d="M13 5v9.5a3 3 0 1 1-3-3" stroke="#25F4EE" transform="translate(-.7 -.5)"/><path d="M13 5v9.5a3 3 0 1 1-3-3" stroke="#FE2C55" transform="translate(.7 .5)"/><path d="M13 5v9.5a3 3 0 1 1-3-3M13 5c.4 2.2 1.8 3.6 4 3.8"/>')},{id:"youtube",name:"YouTube",words:["youtube","you tube","shorts"," yt "],svg:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="6" fill="#FF0000"/><path d="M10 8.5v7l6-3.5z" fill="#fff"/></svg>'},{id:"facebook",name:"Facebook",words:["facebook"," face "," fb "],svg:A("#1877F2",'<path d="M14.5 6.5H13a2.5 2.5 0 0 0-2.5 2.5v11M8.5 12h6"/>')},{id:"whatsapp",name:"WhatsApp",words:["whatsapp","whats","zap","wpp","status do whats"],svg:A("#25D366",'<path d="M6 18l1-3a6 6 0 1 1 2.3 2.2z"/><path d="M10 9.5c0 2 2.5 4.5 4.5 4.5" />')},{id:"linkedin",name:"LinkedIn",words:["linkedin","linked in"],svg:A("#0A66C2",'<path d="M8 10.5V17M8 7.3v.1M11.5 17v-6.5M11.5 13a2.5 2.5 0 0 1 5 0v4"/>')},{id:"x",name:"X (Twitter)",words:["twitter","tweet"," x "],svg:A("#000",'<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>')},{id:"threads",name:"Threads",words:["threads"],svg:A("#000",'<path d="M15.5 10.5c-.5-2.5-2-3.5-3.8-3.5C9 7 7.5 9.2 7.5 12s1.6 5 4.4 5c2.4 0 4-1.4 4-3.2 0-2-2.2-2.8-4-2.3-1.3.4-1.7 1.6-1 2.3.9.9 3.3.4 3.6-2.3"/>')},{id:"pinterest",name:"Pinterest",words:["pinterest","pin "],svg:A("#E60023",'<path d="M11 11l-2 8M9.5 14.5c.4.9 1.4 1.5 2.6 1.5 2.5 0 4-2.2 4-4.7C16.1 8.6 14.3 7 12 7a4.5 4.5 0 0 0-4.3 5.8"/>')},{id:"google",name:"Google Meu Neg\xF3cio",words:["google","meu neg\xF3cio","meu negocio","gmb","maps"],svg:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="6" fill="#fff" stroke="#ddd"/><g fill="none" stroke-width="2.4"><path d="M17.5 12.2H12" stroke="#4285F4"/><path d="M17.5 12.2a5.6 5.6 0 0 1-9.9 3.3" stroke="#34A853"/><path d="M7.6 15.5a5.6 5.6 0 0 1 0-7" stroke="#FBBC05"/><path d="M7.6 8.5a5.6 5.6 0 0 1 8.3-.6" stroke="#EA4335"/></g></svg>'},{id:"kwai",name:"Kwai",words:["kwai"],svg:A("#FF7E00",'<rect x="5" y="9" width="10" height="8" rx="2"/><path d="M15 12l4-2v6l-4-2"/><circle cx="8" cy="6.5" r="1.5"/><circle cx="12" cy="6.5" r="1.5"/>')},{id:"spotify",name:"Spotify",words:["spotify","podcast"],svg:A("#1DB954",'<path d="M7 9.5c3.5-1 7-.6 10 1M7.7 12.6c2.8-.7 5.6-.4 8 .9M8.4 15.5c2.2-.5 4.3-.3 6.1.7"/>')},{id:"telegram",name:"Telegram",words:["telegram"],svg:A("#26A5E4",'<path d="M5.5 11.5l12-5-2 11-4-3-2 2v-3.5l6-5"/>')},{id:"email",name:"E-mail",words:["e-mail","email","newsletter"],svg:A("#6B7280",'<rect x="5" y="7" width="14" height="10" rx="2"/><path d="m5.5 8 6.5 5 6.5-5"/>')},{id:"site",name:"Site / Blog",words:["site","blog","landing"],svg:A("#334155",'<circle cx="12" cy="12" r="6.5"/><path d="M5.5 12h13M12 5.5c2 2 2 11 0 13M12 5.5c-2 2-2 11 0 13"/>')}];function bt(e){let t=` ${[e?.title,e?.description,e?.internalNote].filter(Boolean).join(" ").toLowerCase()} `.replace(/[.,;:!?()/\-]/g," "),s=me.filter(a=>!["instagram"].includes(a.id)&&a.words.some(n=>t.includes((n.startsWith(" "),n))));return me[0].words.slice(0,3).some(a=>t.includes(a))&&s.unshift(me[0]),s}var Qe=["instagram","tiktok","facebook","youtube","linkedin","whatsapp","pinterest","x"],ue=e=>me.find(t=>t.id===e);function gt(e){let t=bt(e),s=e?.platform?ue(e.platform):g[e?.type]?.kind==="post"?ue("instagram"):null;return s?[s,...t.filter(o=>o.id!==s.id)]:t}function fe(e,t=18){return(Array.isArray(e)?e:gt(e)).map(o=>`<span class="pf" style="width:${t}px;height:${t}px" title="${o.name}">${o.svg}</span>`).join("")}function K(e,t=26){let s=c.member(e);return s?s.photo?`<span class="avatar avatar--photo" style="--s:${t}px;background:${s.color}" title="${m(s.name)}"><img src="${s.photo}" alt="" loading="lazy"></span>`:`<span class="avatar" style="--s:${t}px;background:${s.color}" title="${m(s.name)}">${m(s.name[0])}</span>`:""}function $t(e=[],t=24){return e.length?`<span class="avatars">${e.map(s=>K(s,t)).join("")}</span>`:`<span class="avatar avatar--empty" style="--s:${t}px" title="Sem respons\xE1vel">?</span>`}var ae=(e=[])=>{let t=e.map(s=>c.member(s)?.name).filter(Boolean);return t.length?t.length===c.team.length&&t.length>1?"Os dois":t.join(" e "):"Sem respons\xE1vel"};function L(e,t=36,s=null){let o=s??Math.round(t*.28);return e?e.logo?`<span class="logo logo--img" style="--s:${t}px;--r:${o}px"><img src="${m(e.logo)}" alt=""></span>`:`<span class="logo" style="--s:${t}px;--r:${o}px;background:${e.color};color:${Ge(e.color)}">${m(Ue(e.name))}</span>`:`<span class="logo" style="--s:${t}px;--r:${o}px;background:#999">?</span>`}function xe(e,{solid:t=!1}={}){let s=g[e]||g.outro;return`<span class="tbadge tbadge--${e}${t?" is-solid":""}">${f(s.icon,13)}${s.label}</span>`}function Ze(e){if(!e.time)return"Dia todo";let t=g[e.type];return t&&(t.kind==="shoot"||t.kind==="meeting"||t.kind==="work"||e.duration)?t.kind==="post"&&!e.duration?k(e.time):`${k(e.time)}\u2013${k(P($(e.time)+I(e)))}`:k(e.time)}function _e(e,{showDate:t=!1,compact:s=!1,highlight:o=[]}={}){let a=c.company(e.companyId),n=a?.color||"#888",l=e.status==="feito",p=e.date===E(),r=E(),i=e.time?$(e.time):null,h=(e.date<r||p&&i!==null&&(g[e.type]?.kind==="post"?i:i+I(e))<Y())&&e.status==="pendente",v=h&&p&&i!==null?Y()-i:null,T=o.includes(e.id);return`
  <article class="ecard${l?" is-done":""}${h?" is-late":""}${T?" is-flagged":""}${s?" is-compact":""}"
    style="--cc:${n};--cc-soft:${F(n,.1)}" data-action="open-event" data-id="${e.id}">
    <div class="ecard__time">
      <strong>${e.time?k(e.time):"\u2014"}</strong>
      ${t?`<small>${m(e.date.slice(8))}/${m(e.date.slice(5,7))}</small>`:e.time&&(g[e.type]?.kind!=="post"||e.duration)?`<small>${k(P($(e.time)+I(e)))}</small>`:""}
    </div>
    <div class="ecard__body">
      <div class="ecard__top">
        ${L(a,20,6)}
        <span class="ecard__company">${m(a?.name||"Sem empresa")}</span>
        ${xe(e.type)}
      </div>
      <div class="ecard__title"><span class="pfrow">${fe(e,17)}</span>${m(e.title||g[e.type]?.label||"Evento")}</div>
        ${h?`<span class="ecard__late ecard__late--row">${f("alert",12)} Atrasado${v?` \xB7 ${v>=60?Math.floor(v/60)+"h"+(v%60?String(v%60).padStart(2,"0"):""):v+" min"}`:""}</span>`:""}
      ${s?"":`<div class="ecard__meta">
        ${$t(e.assignees,20)}<span>${m(ae(e.assignees))}</span>
        ${e.location?`<span class="ecard__loc">${f("pin",12)}${m(e.location)}</span>`:""}

        ${e.visibleToClient===!1?`<span class="ecard__private" title="N\xE3o aparece para o cliente">${f("eyeoff",12)}</span>`:""}
      </div>`}
    </div>
    ${c.canEdit("events",e)?`<button class="ecard__check${l?" is-on":""}" data-action="toggle-done" data-id="${e.id}" aria-label="${l?"Desmarcar":"Marcar como feito"}">
      ${f("check",16)}
    </button>`:""}
  </article>`}function Ee(e,t,s=""){return`<div class="empty">${f("sparkle",28)}<h3>${m(e)}</h3><p>${m(t)}</p>${s}</div>`}var te=[];function q({html:e,onMount:t,className:s="",onClose:o}){let a=document.getElementById("sheets"),n=document.createElement("div");n.className="sheet-wrap",n.innerHTML=`<div class="sheet-backdrop" data-close></div>
    <section class="sheet ${s}" role="dialog" aria-modal="true">
      <div class="sheet__grab" data-grab><span></span></div>
      <div class="sheet__inner"></div>
    </section>`,a.appendChild(n);let l=n.querySelector(".sheet__inner"),p=n.querySelector(".sheet"),r={el:l,panel:p,set(d){l.innerHTML=d,t&&t(r)},close(){if(r.closed)return;r.closed=!0,n.classList.remove("is-open");let d=te.indexOf(r);d>=0&&te.splice(d,1),setTimeout(()=>n.remove(),280),o&&o(),document.body.classList.toggle("has-sheet",te.length>0)}};te.push(r),r.set(e),document.body.classList.add("has-sheet"),requestAnimationFrame(()=>requestAnimationFrame(()=>n.classList.add("is-open"))),n.addEventListener("click",d=>{d.target.closest("[data-close]")&&r.close()});let i=null,u=0,h=n.querySelector("[data-grab]"),v=d=>{!d.target.closest("[data-grab], .sheet__head")||d.target.closest("button, input, select, textarea")||(i=d.touches[0].clientY,u=0,p.style.transition="none")},T=d=>{i!=null&&(u=Math.max(0,d.touches[0].clientY-i),p.style.transform=`translateY(${u}px)`)},w=()=>{i!=null&&(p.style.transition="",p.style.transform="",u>110&&r.close(),i=null)};return p.addEventListener("touchstart",v,{passive:!0}),p.addEventListener("touchmove",T,{passive:!0}),p.addEventListener("touchend",w),h&&h.addEventListener("click",()=>{}),r}var Wt=()=>te;function H(e,{left:t="",right:s=""}={}){return`<header class="sheet__head">
    <div class="sheet__head-l">${t||'<button class="btn-text" data-close>Fechar</button>'}</div>
    <h2>${m(e)}</h2>
    <div class="sheet__head-r">${s}</div>
  </header>`}var Xe;function _(e,{action:t,onAction:s,ms:o=2600}={}){let a=document.getElementById("toast");a.innerHTML=`<span>${m(e)}</span>${t?`<button>${m(t)}</button>`:""}`,a.classList.add("is-on"),t&&(a.querySelector("button").onclick=()=>{a.classList.remove("is-on"),s&&s()}),clearTimeout(Xe),Xe=setTimeout(()=>a.classList.remove("is-on"),o)}function U({title:e,text:t="",ok:s="Confirmar",danger:o=!1}){return new Promise(a=>q({className:"sheet--dialog",html:`<div class="dialog">
        <h3>${m(e)}</h3>${t?`<p>${m(t)}</p>`:""}
        <button class="btn ${o?"btn--danger":"btn--primary"} btn--block" data-ok>${m(s)}</button>
        <button class="btn btn--ghost btn--block" data-close>Cancelar</button>
      </div>`,onClose:()=>a(!1),onMount:l=>{l.el.querySelector("[data-ok]").onclick=()=>{a(!0),l.close()}}}))}function W({title:e,text:t="",bodyHtml:s="",options:o}){return new Promise(a=>{let n=null;q({className:"sheet--dialog",html:`<div class="dialog">
        <h3>${m(e)}</h3>${t?`<p>${m(t)}</p>`:""}${s}
        ${o.map((l,p)=>`<button class="btn ${l.danger?"btn--danger":l.primary?"btn--primary":"btn--soft"} btn--block" data-i="${p}">${m(l.label)}</button>`).join("")}
        <button class="btn btn--ghost btn--block" data-close>Cancelar</button>
      </div>`,onClose:()=>a(n),onMount:l=>{l.el.querySelectorAll("[data-i]").forEach(p=>p.onclick=()=>{n=o[+p.dataset.i].value,l.close()})}})})}var yt={workStart:"08:00",workEnd:"19:00",lunchStart:"12:00",lunchEnd:"13:00",daysOff:[0],travelMin:45,maxTasks:8},Te=()=>({...yt,...c.state.settings.find(e=>e.id==="routine")||{}}),O=e=>{let t=$(e.time);return t==null?null:[t,t+I(e)]},J=(e,t)=>e&&t&&e[0]<t[1]&&t[0]<e[1],Q=e=>["shoot","meeting"].includes(g[e.type]?.kind),et=e=>!S(e.type),Me=e=>c.company(e.companyId)?.name||"",V=e=>`${g[e.type]?.label||"Evento"}${Me(e)?" \xB7 "+Me(e):""}`,G=e=>c.member(e)?.name||"\u2014",Se=e=>S(e.type)&&!e.duration?`\xE0s ${k(e.time)}`:`das ${k(e.time)} \xE0s ${k(P(O(e)[1]))}`,tt=(e,t)=>(e.location||e.companyId)===(t.location||t.companyId),se=(e,t,s)=>c.state.events.filter(o=>o.date===t&&o.id!==s&&o.time&&o.status!=="feito"&&(o.assignees||[]).includes(e));function oe(e,{isNew:t=!1}={}){let s=[];if(!e.date)return s;let o=Te(),a=e.time?[$(e.time),$(e.time)+I(e)]:null,n=e.assignees||[];if(a){n.forEach(i=>{se(i,e.date,e.id).forEach(u=>{if(!J(a,O(u)))return;let h=S(e.type)!==S(u.type)&&(S(e.type)||S(u.type));s.push({level:"block",code:"overlap",person:i,eventIds:[u.id],title:`${G(i)} j\xE1 tem compromisso nesse hor\xE1rio`,text:`${V(u)} ${Se(u)}${u.createdBy?` (marcado por ${u.createdBy===c.me?"voc\xEA":G(u.createdBy)})`:""}.`+(h?" Se for manter, deixe o post programado antes.":"")})})}),c.state.events.filter(i=>i.id!==e.id&&i.date===e.date&&i.companyId===e.companyId&&i.type===e.type&&i.time&&Math.abs($(i.time)-a[0])<=30).forEach(i=>{s.some(u=>u.eventIds?.includes(i.id))||s.push({level:"block",code:"duplicate",eventIds:[i.id],title:"Parece que isso j\xE1 foi marcado",text:`J\xE1 existe ${V(i)} ${Se(i)}, com ${(i.assignees||[]).map(G).join(" e ")||"ningu\xE9m"}${i.createdBy?`, marcado por ${i.createdBy===c.me?"voc\xEA":G(i.createdBy)}`:""}.`})}),Q(e)&&n.forEach(i=>{se(i,e.date,e.id).filter(Q).forEach(u=>{let h=O(u),v=a[0]>=h[1]?a[0]-h[1]:h[0]>=a[1]?h[0]-a[1]:-1;v>=0&&v<o.travelMin&&!tt(e,u)&&s.push({level:"warn",code:"travel",person:i,eventIds:[u.id],title:`Pouco tempo de deslocamento para ${G(i)}`,text:`S\xF3 ${v} min entre isto e ${V(u)} (${k(u.time)}). O combinado \xE9 ${o.travelMin} min.`})})});let p=$(o.workStart),r=$(o.workEnd);et(e)&&(a[0]<p||a[1]>r)?s.push({level:"warn",code:"hours",title:"Fora do expediente",text:`O hor\xE1rio de trabalho de voc\xEAs \xE9 das ${k(o.workStart)} \xE0s ${k(o.workEnd)}. Preservar o tempo livre evita esgotamento.`}):S(e.type)&&(a[0]<p||a[0]>=r)&&s.push({level:"info",code:"hours",title:"Post fora do expediente",text:"Deixe programado no Meta Business Suite para ningu\xE9m precisar parar o descanso para postar."}),et(e)&&J(a,[$(o.lunchStart),$(o.lunchEnd)])&&s.push({level:"warn",code:"lunch",title:"Invade o almo\xE7o",text:`O almo\xE7o de voc\xEAs \xE9 das ${k(o.lunchStart)} \xE0s ${k(o.lunchEnd)}.`}),a[1]>1440&&s.push({level:"warn",code:"midnight",title:"Passa da meia-noite",text:"Confira a dura\xE7\xE3o."}),t&&(e.date<E()||e.date===E()&&a[0]<Y()-5)&&s.push({level:"warn",code:"past",title:"Esse hor\xE1rio j\xE1 passou",text:"Confira o dia e a hora."}),["feed","reels","carrossel"].includes(e.type)&&c.state.events.filter(i=>i.id!==e.id&&i.date===e.date&&i.companyId===e.companyId&&["feed","reels","carrossel"].includes(i.type)&&i.time).forEach(i=>{let u=Math.abs($(i.time)-a[0]);u>30&&u<180&&s.push({level:"warn",code:"spacing",eventIds:[i.id],title:"Posts da mesma empresa muito pr\xF3ximos",text:`${V(i)} \xE0s ${k(i.time)}. Espacem pelo menos 3 h.`})}),c.team.filter(i=>!n.includes(i.id)).forEach(i=>{se(i.id,e.date,e.id).filter(u=>J(a,O(u))).forEach(u=>{s.push({level:"info",code:"partner",person:i.id,eventIds:[u.id],title:`${i.name} nesse hor\xE1rio`,text:`${V(u)} ${Se(u)}${u.location?" \xB7 "+u.location:""}.`})})})}let l=B(e.date).getDay();return o.daysOff.includes(l)&&!S(e.type)&&s.push({level:"warn",code:"dayoff",title:`${Re[l]} \xE9 dia de folga`,text:"Se der, mude para um dia \xFAtil. Posts podem ficar programados."}),n.forEach(p=>{let r=c.state.events.filter(i=>i.date===e.date&&i.id!==e.id&&(i.assignees||[]).includes(p)).length+1;r>o.maxTasks&&s.push({level:"warn",code:"load",person:p,title:`${G(p)} ficaria sobrecarregado`,text:`${r} tarefas nesse dia (limite combinado: ${o.maxTasks}).`})}),s}function he(e,{limit:t=3,people:s=null}={}){if(!e.date)return[];let o=Te(),a=s||(e.assignees?.length?e.assignees:[]),n=I(e),l=S(e.type),p=l?420:$(o.workStart),r=l?1320:$(o.workEnd),i=[$(o.lunchStart),$(o.lunchEnd)],u=(g[e.type]?.best||[]).map($),h=e.date===E()?Math.ceil((Y()+15)/15)*15:0,v=c.state.events.filter(d=>d.id!==e.id&&d.date===e.date&&d.companyId&&d.companyId===e.companyId&&d.time&&(d.type===e.type||l&&S(d.type)&&d.type!=="story"&&e.type!=="story")).map(d=>({t:$(d.time),gap:d.type===e.type&&e.type==="story"?45:d.type===e.type?180:120})),T=[];for(let d=Math.max(p,h);d+n<=r;d+=15){let b=[d,d+n];if(!l&&J(b,i)||v.some(x=>Math.abs(x.t-d)<x.gap)||a.some(x=>se(x,e.date,e.id).some(C=>{let Pe=O(C);return J(b,Pe)?!0:Q(e)&&Q(C)&&!tt(e,C)?J([b[0]-o.travelMin,b[1]+o.travelMin],Pe):!1})))continue;let D=u.length?Math.min(...u.map(x=>Math.abs(x-d))):Math.abs(d-$(o.workStart)-60);T.push({time:P(d),score:D})}T.sort((d,b)=>d.score-b.score);let w=[];for(let d of T)if(w.every(b=>Math.abs($(b.time)-$(d.time))>=60)&&w.push(d),w.length>=t)break;return w.sort((d,b)=>$(d.time)-$(b.time)).map(d=>({...d,peak:d.score<=30}))}function ve(e){if(!e.time)return c.team.map(s=>s.id);let t=[$(e.time),$(e.time)+I(e)];return c.team.filter(s=>!se(s.id,e.date,e.id).some(o=>J(t,O(o)))).map(s=>s.id)}function wt(e,t){let s=Te();if(s.daysOff.includes(B(t).getDay()))return{minutes:null,longest:null,dayOff:!0};let o=$(s.workStart),a=$(s.workEnd),n=[[$(s.lunchStart),$(s.lunchEnd)]];c.eventsOn(t,{person:e}).filter(i=>i.time).forEach(i=>{let u=O(i);n.push([u[0],S(i.type)?u[0]+15:u[1]+(Q(i)?30:0)])}),n.sort((i,u)=>i[0]-u[0]);let l=o,p=0,r=0;return n.forEach(([i,u])=>{if(i>=a||u<=o)return;let h=Math.max(i,o),v=Math.min(u,a);v<=l||(h>l&&(p+=h-l,r=Math.max(r,h-l)),l=Math.max(l,v))}),a>l&&(p+=a-l,r=Math.max(r,a-l)),{minutes:p,longest:r,dayOff:!1}}function ta(e,t,s){let o=[],a=S(t.type)&&!S(s.type)?t:S(s.type)&&!S(t.type)?s:(t.createdAt||0)>(s.createdAt||0)?t:s,n=c.team.find(p=>p.id!==e);n&&ve(a).includes(n.id)&&(a.assignees||[]).length===1&&o.push({label:`Passar para ${n.name}`,eventId:a.id,patch:{assignees:[n.id]}});let l=he(a,{limit:1})[0];return l&&o.push({label:`Mover ${g[a.type].label.toLowerCase()} para ${k(l.time)}`,eventId:a.id,patch:{time:l.time}}),o}function aa(e,t="all"){let s=t==="all"?c.team:c.team.filter(n=>n.id===t),o=[];return c.eventsOn(e,{person:t}).length?(s.forEach(n=>{let l=c.eventsOn(e,{person:n.id}),p=wt(n.id,e),r=l.filter(Q),i=[`${l.length} tarefa${l.length===1?"":"s"}`];r.length&&i.push(`sai para ${r.map(u=>`${Me(u)} \xE0s ${k(u.time)}`).join(" e ")}`),p.dayOff?i.push("\xE9 dia de folga"):p.minutes!=null&&i.push(p.minutes>=30?`${z(p.minutes)} livres no expediente (maior intervalo: ${z(p.longest)})`:"quase sem tempo livre"),o.push(`${n.name}: ${i.join(", ")}.`)}),o):[`Nenhum compromisso${t==="all"?"":" para "+G(t)}. Bom dia para planejar a pauta ou adiantar edi\xE7\xF5es.`]}var kt={feed:"\u{1F5BC}\uFE0F",carrossel:"\u{1F5C2}\uFE0F",reels:"\u{1F3AC}",story:"\u2B55",captacao:"\u{1F4F8}",reuniao:"\u{1F91D}",producao:"\u2702\uFE0F",outro:"\u2022"},ne=e=>String(e||"").replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\r?\n/g,"\\n"),xt=e=>{let t=[];for(;e.length>74;)t.push(e.slice(0,74)),e=" "+e.slice(74);return t.push(e),t.join(`\r
`)},at=(e,t)=>e.replace(/-/g,"")+"T"+t.replace(":","")+"00",_t=()=>new Date().toISOString().replace(/[-:]/g,"").replace(/\.\d+/,"");function Et(e,t){let s=["BEGIN:VCALENDAR","VERSION:2.0",`PRODID:-//${le.appName}//PT-BR`,"CALSCALE:GREGORIAN","METHOD:PUBLISH",`X-WR-CALNAME:${ne(t)}`];return e.forEach(o=>{let a=c.company(o.companyId),n=(o.assignees||[]).map(i=>c.member(i)?.name).filter(Boolean).join(" e "),l=`${kt[o.type]||""} ${g[o.type]?.label||"Evento"} \xB7 ${a?.name||""}${o.title?" \u2014 "+o.title:""}`.trim(),p=[n&&`Respons\xE1vel: ${n}`,o.description,o.internalNote&&`Nota interna: ${o.internalNote}`].filter(Boolean).join(`
`);if(s.push("BEGIN:VEVENT",`UID:${o.id}@pauta`,`DTSTAMP:${_t()}`),o.time){let i=$(o.time)+I(o),u=i>=1440?M(o.date,1):o.date;s.push(`DTSTART:${at(o.date,o.time)}`,`DTEND:${at(u,P(i%1440))}`)}else s.push(`DTSTART;VALUE=DATE:${o.date.replace(/-/g,"")}`,`DTEND;VALUE=DATE:${M(o.date,1).replace(/-/g,"")}`);s.push(`SUMMARY:${ne(l)}`),p&&s.push(`DESCRIPTION:${ne(p)}`),o.location&&s.push(`LOCATION:${ne(o.location)}`);let r=o.reminder??30;r>=0&&s.push("BEGIN:VALARM","ACTION:DISPLAY",`DESCRIPTION:${ne(l)}`,`TRIGGER:-PT${r}M`,"END:VALARM"),s.push("END:VEVENT")}),s.push("END:VCALENDAR"),s.map(xt).join(`\r
`)}async function st(e,t,s){let o=Et(e,s),a=pe();if(a){let r=document.createElement("form");r.method="POST",r.action=a.replace(/\/$/,"")+"/ics",r.target="_blank",r.style.display="none";let i=document.createElement("textarea");i.name="ics",i.value=o,r.appendChild(i),document.body.appendChild(r),r.submit(),r.remove();return}let n=new File([o],t,{type:"text/calendar"});if(navigator.canShare&&navigator.canShare({files:[n]}))try{await navigator.share({files:[n],title:s});return}catch(r){if(r&&r.name==="AbortError")return}let l=URL.createObjectURL(n),p=document.createElement("a");p.href=l,p.download=t,document.body.appendChild(p),p.click(),p.remove(),setTimeout(()=>URL.revokeObjectURL(l),4e3)}var ot=new Set(["fazer","criar","postar","subir","publicar","gravar","post","postagem","publicacao","publica\xE7\xE3o","o","a","um","uma","no","na","do","da","de","dos","das","pro","pra","para","feed","reels","reel","story","stories","storie","storys","carrossel","carosel","carossel","instagram","insta","ig","sobre","com","e"]),St=[[/\bcouve flor\b/gi,"couve-flor"],[/\bpromocao\b/gi,"promo\xE7\xE3o"],[/\bpromoçao\b/gi,"promo\xE7\xE3o"],[/\bacao\b/gi,"a\xE7\xE3o"],[/\bpao\b/gi,"p\xE3o"],[/\blimao\b/gi,"lim\xE3o"],[/\bmamao\b/gi,"mam\xE3o"],[/\bmelao\b/gi,"mel\xE3o"],[/\bfeijao\b/gi,"feij\xE3o"],[/\bmaca\b/gi,"ma\xE7\xE3"],[/\bmaça\b/gi,"ma\xE7\xE3"],[/\babobora\b/gi,"ab\xF3bora"],[/\bpessego\b/gi,"p\xEAssego"],[/\bmaracuja\b/gi,"maracuj\xE1"],[/\babacate\b/gi,"abacate"],[/\babacaxi\b/gi,"abacaxi"],[/\bcafe\b/gi,"caf\xE9"],[/\bpromo\b/gi,"promo"],[/\bblack friday\b/gi,"Black Friday"],[/\bnatal\b/gi,"Natal"],[/\bano novo\b/gi,"Ano Novo"],[/\bdia das maes\b/gi,"Dia das M\xE3es"],[/\bdia dos pais\b/gi,"Dia dos Pais"],[/\bhamburguer\b/gi,"hamb\xFArguer"],[/\bhamburguers\b/gi,"hamb\xFArgueres"],[/\blancamento\b/gi,"lan\xE7amento"],[/\bcolecao\b/gi,"cole\xE7\xE3o"],[/\bvideo\b/gi,"v\xEDdeo"],[/\bsabado\b/gi,"s\xE1bado"],[/\bpromocoes\b/gi,"promo\xE7\xF5es"]],nt=e=>e.toLowerCase().replace(/[.,:;!]+$/,""),Mt={feed:"Post no feed",carrossel:"Carrossel",reels:"Reels",story:"Stories"},it=/^(post no feed|carrossel|reels|stories|story)\s+—\s+/i;function lt(e,t=null){let s=String(e||"").replace(/\s+/g," ").trim();if(!s)return s;let o=Mt[t];if(!o)return Ae(Ie(s));if(it.test(s))return`${o} \u2014 ${Ae(Ie(s.replace(it,"")))}`;let a=s.split(" ");for(;a.length>1&&ot.has(nt(a[0]));)a.shift();return s=a.join(" ").replace(/\s+(no|pro|pra|para o)\s+(instagram|insta|ig|feed)\s*$/i,"").trim(),ot.has(nt(s))?o:`${o} \u2014 ${Ae(Ie(s))}`}var Ie=e=>{for(let[t,s]of St)e=e.replace(t,s);return e},Ae=e=>e&&e.charAt(0).toLocaleUpperCase("pt-BR")+e.slice(1);var Tt=[[/pura vida|hortifruti|jg garcia/i,"hortifruti: frutas, verduras e legumes frescos"],[/bbq|burger|hamb/i,"hamburgueria e churrasco (BBQ)"],[/multimarcas|moda|roupa/i,"loja de roupas multimarcas"],[/festa/i,"loja de artigos e decora\xE7\xE3o de festas"]];function Ce(e){if(e?.niche)return e.niche;let t=Tt.find(([s])=>s.test(e?.name||""));return t?t[1]:""}function It(){let e=E();return c.state.companies.map(t=>{let s=c.state.events.filter(l=>l.companyId===t.id&&g[l.type]?.kind==="post"),o=s.filter(l=>l.date<=e&&(l.status==="feito"||l.date<e)).map(l=>l.date).sort(),a=s.filter(l=>l.date>=e&&l.status!=="feito").map(l=>l.date).sort(),n=o[o.length-1]||"";return{onlyFor:t.notifyOnly||null,name:t.name,niche:Ce(t)||"pequena empresa local",lastPost:n,nextPost:a[0]||"",daysSincePost:n?Be(n,e):null}})}var rt=null,ct="";function ha(){c.mode!=="cloud"||!pe()||!c.ready||(clearTimeout(rt),rt=setTimeout(()=>{let e=It(),t=JSON.stringify(e);t!==ct&&ke("/coach",{companies:e}).then(()=>ct=t).catch(()=>{})},4e3))}var va=()=>ke("/coach-test",{});function Ma(){let e=c.companiesSorted(),t=E(),s=je(t),o=M(s,6);return`
  <header class="hdr">
    <div class="hdr__row">
      <div class="hdr__titles"><p class="hdr__eyebrow">${e.length} cliente${e.length===1?"":"s"}</p><h1>Empresas</h1></div>
      <div class="hdr__actions"><button class="btn btn--primary btn--sm" data-action="new-company">${f("plus",16)} Nova</button></div>
    </div>
  </header>
  <div class="page">
    ${e.length?"":Ee("Nenhuma empresa ainda","Cadastre os clientes com nome, cor e logomarca. Cada um ganha um link pr\xF3prio para ver s\xF3 o seu cronograma.",`<button class="btn btn--primary" data-action="new-company">${f("plus",18)} Cadastrar empresa</button>`)}
    <div class="colist">
      ${e.map(a=>{let n=c.eventsBetween(s,o,{companyId:a.id}),l=n.filter(i=>S(i.type)).length,p=n.filter(i=>i.type==="captacao").length,r=c.state.events.filter(i=>i.companyId===a.id&&i.date>=t&&i.status!=="feito").sort((i,u)=>(i.date+i.time).localeCompare(u.date+u.time))[0];return`<button class="cocard" style="--cc:${a.color};--cc-soft:${F(a.color,.1)}" data-action="open-company" data-id="${a.id}">
          <div class="cocard__top">
            ${L(a,48)}
            <div class="cocard__name"><strong>${m(a.name)}</strong>${a.instagram?`<small>${f("insta",12)} @${m(a.instagram)}</small>`:""}</div>
            ${f("right",18,"muted")}
          </div>
          <div class="cocard__stats">
            <span><b>${l}</b> posts</span><span><b>${p}</b> capta\xE7${p===1?"\xE3o":"\xF5es"}</span><span class="muted">nesta semana</span>
          </div>
          ${r?`<div class="cocard__next">${f(g[r.type].icon,14)} <b>${m(X(r.date))}${r.time?" "+r.time:""}</b> \xB7 ${m(g[r.type].label)} \u2014 ${m(r.title||"")}</div>`:'<div class="cocard__next muted">Nada agendado</div>'}
        </button>`}).join("")}
    </div>
  </div>`}function Ta(e){let t=q({className:"sheet--tall",html:dt(e),onMount:s=>At(s,e)});t.refresh=()=>c.company(e)?t.set(dt(e)):t.close()}function dt(e){let t=c.company(e);if(!t)return"";let s=E(),o=re(s),a=c.eventsBetween(`${o}-01`,`${o}-31`,{companyId:e}),n=c.eventsBetween(s,M(s,30),{companyId:e}),l=c.eventsBetween(M(s,-14),M(s,-1),{companyId:e}).reverse(),p=h=>a.filter(v=>h.includes(v.type)).length,r=a.filter(h=>h.status==="feito").length,i="",u=n.map(h=>{let v=h.date!==i?`<h4 class="dayhead">${m(Z(h.date))}</h4>`:"";return i=h.date,v+_e(h)}).join("");return`
  ${H("",{right:c.canEdit("companies",t)?'<button class="btn-text" data-act="edit">Editar</button>':""})}
  <div class="cohero" style="--cc:${t.color};--cc-soft:${F(t.color,.14)}">
    ${L(t,72,20)}
    <h2>${m(t.name)}</h2>
    ${t.instagram?`<a class="cohero__ig" href="https://instagram.com/${encodeURIComponent(t.instagram)}" target="_blank" rel="noopener">${f("insta",14)} @${m(t.instagram)}</a>`:""}
    <div class="cohero__btns">
      <button class="btn btn--primary btn--sm" data-act="new">${f("plus",16)} Evento</button>
      <button class="btn btn--soft btn--sm" data-act="clientview">${f("eye",16)} P\xE1gina do cliente</button>
      <button class="btn btn--soft btn--sm" data-act="share">${f("share",16)} Enviar</button>
    </div>
  </div>

  <div class="page page--sheet">
    <section class="block">
      <h2 class="block__title">${m(He(o))}</h2>
      <div class="mstats mstats--5">
        <div><b>${p(["feed","carrossel"])}</b><span>feed</span></div>
        <div><b>${p(["reels"])}</b><span>reels</span></div>
        <div><b>${p(["story"])}</b><span>stories</span></div>
        <div><b>${p(["captacao"])}</b><span>capta\xE7\xF5es</span></div>
        <div><b>${a.length?Math.round(r/a.length*100):0}%</b><span>feito</span></div>
      </div>
    </section>

    ${t.address||t.contact||t.notes?`<ul class="rows">
      ${t.address?`<li><span class="rows__k">${f("pin",16)} Endere\xE7o</span><a class="rows__v link" href="https://maps.apple.com/?q=${encodeURIComponent(t.address)}" target="_blank" rel="noopener">${m(t.address)}</a></li>`:""}
      ${t.contact?`<li><span class="rows__k">${f("user",16)} Contato</span><span class="rows__v">${m(t.contact)}</span></li>`:""}
      ${t.notes?`<li><span class="rows__k">${f("note",16)} Observa\xE7\xF5es</span><span class="rows__v">${m(t.notes)}</span></li>`:""}
    </ul>`:""}

    <section class="block">
      <h2 class="block__title">Pr\xF3ximos 30 dias</h2>
      ${u||Ee("Nada agendado","Crie o cronograma de postagens desta empresa.")}
    </section>

    ${l.length?`<section class="block">
      <h2 class="block__title">\xDAltimas 2 semanas</h2>
      ${l.map(h=>_e(h,{showDate:!0,compact:!0})).join("")}
    </section>`:""}
  </div>`}function At(e,t){let s=e.el;(s.querySelector('[data-act="edit"]')||{}).onclick=()=>Ne(t),s.querySelector('[data-act="new"]').onclick=async()=>{let{openEventEditor:o}=await import("./c-UXJVM56T.js");o({companyId:t})},s.querySelector('[data-act="share"]').onclick=()=>Le(t),s.querySelector('[data-act="clientview"]').onclick=()=>Ct(t)}function Ne(e=null,t=null){let s=e?c.company(e):null,o=c.state.companies.map(p=>p.color),a=s?{...s}:{id:R("c_"),name:"",color:de.find(p=>!o.includes(p))||de[0],logo:null,instagram:"",address:"",contact:"",notes:"",shareToken:null},n=()=>`
    ${H(s?"Editar empresa":"Nova empresa",{left:'<button class="btn-text" data-close>Cancelar</button>',right:'<button class="btn btn--primary btn--sm" data-save>Salvar</button>'})}
    <form class="form" onsubmit="return false">
      <div class="logopick">
        <div data-preview>${L({...a,name:a.name||"?"},88,24)}</div>
        <div class="logopick__btns">
          <label class="btn btn--soft btn--sm">${f("image",16)} ${a.logo?"Trocar logo":"Enviar logomarca"}<input type="file" accept="image/*" data-file hidden></label>
          ${a.logo?'<button type="button" class="btn-text btn-text--sm" data-rmlogo>Remover logo</button>':'<p class="fhelp">Opcional. Sem logo, usamos as iniciais na cor escolhida.</p>'}
        </div>
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-name">Nome da empresa</label>
        <input id="c-name" class="input" name="name" value="${m(a.name)}" placeholder="Ex.: Pura Vida" autocomplete="off" maxlength="60">
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
        <div class="input-prefix"><span>@</span><input id="c-ig" class="input" name="instagram" value="${m(a.instagram||"")}" placeholder="usuario" autocomplete="off" autocapitalize="none"></div>
      </div>
      <div class="fgroup">
        <label class="flabel">Notifica\xE7\xF5es desta empresa v\xE3o para</label>
        <div class="seg seg--notify">${[["","Os dois"],...c.team.map(p=>[p.id,p.name])].map(([p,r])=>`<button type="button" class="seg__btn${(a.notifyOnly||"")===p?" is-on":""}" data-only="${p}">${m(r)}</button>`).join("")}</div>
        <p class="fhelp">Avisos, lembretes, \u201CJ\xE1 postou?\u201D, cobran\xE7as de atraso e dicas desta empresa chegam s\xF3 para quem estiver marcado.</p>
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-niche">O que a empresa faz (para as dicas)</label>
        <input id="c-niche" class="input" name="niche" value="${m(a.niche||Ce(a))}" placeholder="Ex.: hamburgueria artesanal, loja de roupas femininas" autocomplete="off" maxlength="160">
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-addr">Endere\xE7o (para capta\xE7\xF5es)</label>
        <input id="c-addr" class="input" name="address" value="${m(a.address||"")}" placeholder="Rua, n\xFAmero \u2013 bairro" autocomplete="off">
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-contact">Contato</label>
        <input id="c-contact" class="input" name="contact" value="${m(a.contact||"")}" placeholder="Nome e WhatsApp do respons\xE1vel" autocomplete="off">
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-notes">Observa\xE7\xF5es internas</label>
        <textarea id="c-notes" class="input" name="notes" rows="3" placeholder="Tom de voz, o que evitar, prefer\xEAncias\u2026">${m(a.notes||"")}</textarea>
      </div>
      ${s?`<button type="button" class="btn btn--danger-soft btn--block" data-delete>${f("trash",18)} Excluir empresa</button>`:""}
      <div class="form__spacer"></div>
    </form>`,l=p=>{let r=p.el,i=r.querySelector("form"),u=()=>{a.name=i.name.value.trim(),a.instagram=i.instagram.value.trim().replace(/^@/,""),a.niche=i.niche.value.trim(),a.notifyOnly=r.querySelector("[data-only].is-on")?.dataset.only||null,a.address=i.address.value.trim(),a.contact=i.contact.value.trim(),a.notes=i.notes.value.trim()},h=()=>r.querySelector("[data-preview]").innerHTML=L({...a,name:i.name.value||"?"},88,24);i.name.addEventListener("input",h),r.querySelectorAll("[data-only]").forEach(w=>w.onclick=()=>r.querySelectorAll("[data-only]").forEach(d=>d.classList.toggle("is-on",d===w))),r.querySelectorAll("[data-color]").forEach(w=>w.onclick=()=>{a.color=w.dataset.color,r.querySelectorAll("[data-color]").forEach(d=>d.classList.toggle("is-on",d===w)),h()}),r.querySelector("[data-customcolor]").oninput=w=>{a.color=w.target.value,r.querySelectorAll("[data-color]").forEach(d=>d.classList.remove("is-on")),h()},r.querySelector("[data-file]").onchange=async w=>{let d=w.target.files[0];if(d)try{u(),a.logo=await Ve(d,160),p.set(n())}catch{_("N\xE3o foi poss\xEDvel ler essa imagem")}};let v=r.querySelector("[data-rmlogo]");v&&(v.onclick=()=>{u(),a.logo=null,p.set(n())});let T=r.querySelector("[data-delete]");T&&(T.onclick=async()=>{let w=c.state.events.filter(b=>b.companyId===a.id);await U({title:`Excluir ${a.name}?`,text:w.length?`Os ${w.length} eventos desta empresa tamb\xE9m ser\xE3o apagados e o link do cliente deixar\xE1 de funcionar.`:"O link do cliente deixar\xE1 de funcionar.",ok:"Excluir empresa",danger:!0})&&(await c.removeMany("events",w.map(b=>b.id)),await c.remove("companies",a.id),p.close(),_("Empresa exclu\xEDda"))}),r.querySelector("[data-save]").onclick=async()=>{if(u(),!a.name)return i.name.focus(),_("Digite o nome da empresa");await c.upsert("companies",{...a}),p.close(),_(s?"Empresa atualizada":"Empresa cadastrada"),t&&t(c.company(a.id))}};q({className:"sheet--tall",html:n(),onMount:l})}async function Le(e){let t=c.company(e),s=c.mode==="cloud",o="";s?(await c.ensureShareToken(t),await c.publishCompany(e),o=Ye(c.company(e).shareToken)):o=ze(await Je(ge(t,c.state.events,{maxFuture:90})));let a=`
    ${H("Link do cliente")}
    <div class="share">
      <div class="share__co">${L(t,56)}<div><strong>${m(t.name)}</strong><small>v\xEA somente o pr\xF3prio cronograma</small></div></div>
      <ul class="checks">
        <li>${f("check",16)} Somente os eventos da ${m(t.name)}</li>
        <li>${f("check",16)} Sem notas internas e sem outras empresas</li>
        <li>${f("check",16)} Somente leitura: o cliente n\xE3o consegue alterar nada</li>
        <li>${f(s?"check":"alert",16)} ${s?"Sempre atualizado: tudo que voc\xEAs mudarem aparece para o cliente":"Foto do cronograma atual (pr\xF3ximos 90 dias). Quando mudar algo, envie o link de novo"}</li>
      </ul>
      <div class="share__link"><input readonly value="${m(o)}" data-link></div>
      <div class="share__btns">
        <button class="btn btn--primary btn--block" data-sharebtn>${f("share",18)} Enviar para o cliente</button>
        <button class="btn btn--soft btn--block" data-copy>${f("copy",18)} Copiar link</button>
        <a class="btn btn--ghost btn--block" href="${m(o)}" target="_blank" rel="noopener">${f("eye",18)} Ver como o cliente v\xEA</a>
      </div>
      ${s?'<button class="btn-text btn-text--sm btn-text--danger" data-revoke>Gerar novo link (o antigo para de funcionar)</button>':'<p class="fhelp">Dica: ative a sincroniza\xE7\xE3o na nuvem (Ajustes) para o link ficar sempre atualizado automaticamente.</p>'}
    </div>`;q({html:a,onMount:n=>{let l=n.el;l.querySelector("[data-copy]").onclick=async()=>{try{await navigator.clipboard.writeText(o),_("Link copiado")}catch{l.querySelector("[data-link]").select(),_("Selecione e copie o link")}},l.querySelector("[data-sharebtn]").onclick=async()=>{let r=`Ol\xE1! Este \xE9 o cronograma de conte\xFAdo da ${t.name}. Por aqui voc\xEAs acompanham tudo o que est\xE1 planejado: posts, stories, reels e capta\xE7\xF5es.`;if(navigator.share)try{await navigator.share({title:`Cronograma \xB7 ${t.name}`,text:r,url:o})}catch{}else await navigator.clipboard?.writeText(`${r}
${o}`),_("Mensagem copiada")};let p=l.querySelector("[data-revoke]");p&&(p.onclick=async()=>{await U({title:"Gerar um novo link?",text:"Quem tiver o link antigo n\xE3o conseguir\xE1 mais ver o cronograma.",ok:"Gerar novo link",danger:!0})&&(await c.regenerateShareToken(c.company(e)),n.close(),Le(e))})}})}async function Ct(e){let t=c.company(e);if(!t)return;let{showClient:s}=await import("./c-JEHUTABW.js"),{sanitizePayload:o}=await import("./c-IY6FCE6X.js"),a=o(ge(t,c.state.events)),n=document.createElement("div");n.className="client-preview",n.innerHTML=`<div class="client-preview__bar"><button class="btn btn--soft btn--sm" data-closepv>${f("left",16)} Voltar</button><span>Assim o cliente v\xEA</span><button class="btn btn--primary btn--sm" data-sendpv>${f("share",16)} Enviar</button></div><div class="client-preview__body"></div>`,document.body.appendChild(n),document.body.classList.add("has-sheet"),s(n.querySelector(".client-preview__body"),a,{canGoBack:!1,preview:!0});let l=()=>{n.remove(),document.body.classList.toggle("has-sheet",!!document.querySelector(".sheet-wrap"))};n.querySelector("[data-closepv]").onclick=l,n.querySelector("[data-sendpv]").onclick=()=>{l(),Le(e)}}function Va(e){let t=q({html:pt(e),className:"sheet--tall",onMount:s=>Nt(s,e)});t.refresh=()=>{if(!c.event(e))return t.close();t.set(pt(e))}}function pt(e){let t=c.event(e);if(!t)return"";let s=c.company(t.companyId),o=s?.color||"#666",a=ye.find(r=>r.v===(t.reminder??30)),n=t.seriesId?c.state.events.filter(r=>r.seriesId===t.seriesId).length:0,l=c.canEdit("events",t),p=c.member(c.ownerOf("events",t))?.name||"o parceiro";return`
  ${H("",{right:l?'<button class="btn-text" data-act="edit">Editar</button>':""})}
  <div class="detail">
    <div class="detail__hero" style="--cc:${o};--cc-soft:${F(o,.12)}">
      <div class="detail__co">${L(s,40)}<div><strong>${m(s?.name||"Sem empresa")}</strong>${s?.instagram?`<small>@${m(s.instagram)}</small>`:""}</div>${xe(t.type,{solid:!0})}</div>
      <h2><span class="pfrow">${fe(t,24)}</span>${m(t.title||g[t.type].label)}</h2>
      <p class="detail__when">${f("calendar",15)} ${m(X(t.date))}, ${m(Fe(t.date).split(", ")[1])} \xB7 ${f("clock",15)} ${m(Ze(t))}</p>
    </div>

    ${l?"":`<p class="detail__lock">${f("eye",14)} Cadastrado por ${m(p)} \u2014 voc\xEA s\xF3 pode ver. Use \u201CDuplicar\u201D para criar uma c\xF3pia sua.</p>`}
    <div class="seg seg--status"${l?"":" hidden"}>
      ${$e.map(r=>`<button class="seg__btn${t.status===r?" is-on":""} st-${r}" data-status="${r}">${r==="feito"?f("check",14):""}${ce[r].label}</button>`).join("")}
    </div>

    <ul class="rows">
      <li><span class="rows__k">${f("users",16)} Respons\xE1vel</span><span class="rows__v">${(t.assignees||[]).map(r=>K(r,22)).join("")} ${m(ae(t.assignees))}</span></li>
      ${t.location?`<li><span class="rows__k">${f("pin",16)} Local</span><a class="rows__v link" href="https://maps.apple.com/?q=${encodeURIComponent(t.location)}" target="_blank" rel="noopener">${m(t.location)}</a></li>`:""}
      ${g[t.type].kind!=="post"||t.duration?`<li><span class="rows__k">${f("clock",16)} Dura\xE7\xE3o</span><span class="rows__v">${m(z(I(t)))}</span></li>`:""}
      <li><span class="rows__k">${f("bell",16)} Lembrete</span><span class="rows__v">${m(a?.label||"\u2014")}</span></li>
      ${n?`<li><span class="rows__k">${f("repeat",16)} Repeti\xE7\xE3o</span><span class="rows__v">${n} eventos na s\xE9rie</span></li>`:""}
      <li><span class="rows__k">${f(t.visibleToClient===!1?"eyeoff":"eye",16)} Cliente</span><span class="rows__v">${t.visibleToClient===!1?"N\xE3o aparece para o cliente":"Aparece no calend\xE1rio do cliente"}</span></li>
    </ul>

    ${t.description?`<div class="textbox"><h4>Descri\xE7\xE3o / legenda</h4><p>${m(t.description)}</p></div>`:""}
    ${t.internalNote?`<div class="textbox textbox--note"><h4>${f("eyeoff",13)} Nota interna (s\xF3 a equipe v\xEA)</h4><p>${m(t.internalNote)}</p></div>`:""}

    <div class="actions">
      <button data-act="ics">${f("bell",20)}<span>Lembrete no iPhone</span></button>
      ${l?`<button data-act="tomorrow">${f("right",20)}<span>Passar p/ amanh\xE3</span></button>`:""}
      <button data-act="dup">${f("copy",20)}<span>Duplicar</span></button>
      ${l?`<button data-act="del" class="is-danger">${f("trash",20)}<span>Excluir</span></button>`:""}
    </div>
    <p class="detail__meta">Criado por ${m(c.member(t.createdBy)?.name||"\u2014")}${t.updatedAt?" \xB7 atualizado "+new Date(t.updatedAt).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):""}</p>
  </div>`}function Nt(e,t){let s=e.el;s.querySelectorAll("[data-status]").forEach(a=>a.onclick=async()=>{let n=c.event(t);await c.upsert("events",{...n,status:a.dataset.status})});let o=(a,n)=>{let l=s.querySelector(`[data-act="${a}"]`);l&&(l.onclick=n)};o("edit",()=>mt({id:t})),o("dup",async()=>{let n={...c.event(t),id:R("e_"),status:"pendente",seriesId:null,createdAt:null,createdBy:null};await c.upsert("events",n),e.close(),_("Evento duplicado"),mt({id:n.id})}),o("tomorrow",async()=>{let a=c.event(t);await qt(a,{date:M(a.date,1)})&&(await c.upsert("events",{...a,date:M(a.date,1)}),_("Movido para "+X(M(a.date,1)).toLowerCase(),{action:"Desfazer",onAction:()=>c.upsert("events",{...c.event(t),date:a.date})}))}),o("ics",()=>{let a=c.event(t);st([a],`${g[a.type].label}-${a.date}.ics`,le.appName)}),o("del",()=>ft(t,e))}async function ft(e,t){let s=c.event(e),o=[e];if(s.seriesId){let n=c.state.events.filter(l=>l.seriesId===s.seriesId&&l.date>=s.date).map(l=>l.id);if(n.length>1){let l=await W({title:"Excluir evento repetido",options:[{label:"S\xF3 este",value:"one",danger:!0},{label:`Este e os pr\xF3ximos (${n.length})`,value:"next",danger:!0}]});if(!l)return;l==="next"&&(o=n)}else if(!await U({title:"Excluir este evento?",ok:"Excluir",danger:!0}))return}else if(!await U({title:"Excluir este evento?",text:"Ele some para a dupla e para o cliente.",ok:"Excluir",danger:!0}))return;let a=o.map(n=>({...c.event(n)}));await c.removeMany("events",o),t&&t.close(),_(o.length>1?`${o.length} eventos exclu\xEDdos`:"Evento exclu\xEDdo",{action:"Desfazer",onAction:()=>c.upsertMany("events",a),ms:4500})}function mt({id:e=null,date:t=null,companyId:s=null,type:o=null,time:a=null,assignees:n=null}={}){let l=e?c.event(e):null;if(l&&!c.canEdit("events",l)){c._denied("events",l);return}let p=c.companiesSorted(),r=o||"feed",i=l?JSON.parse(JSON.stringify(l)):{id:R("e_"),type:r,companyId:s||N.monthCompany||(p.length===1?p[0].id:null),title:"",date:t||(N.tab==="mes"?N.monthSel:N.date)||E(),time:a||g[r].best[0]||"12:00",duration:["shoot","meeting","work","other"].includes(g[r].kind)?g[r].dur:null,assignees:n||(N.person!=="all"?[N.person]:c.me?[c.me]:[]),location:"",description:"",internalNote:"",reminder:30,visibleToClient:g[r].client,status:"pendente"},u=l?JSON.parse(JSON.stringify(l)):null,h={mode:"none",until:M(i.date,28)};return q({className:"sheet--tall",html:ht(i,!!l,h),onMount:T=>Lt(T,i,u,h)})}function De(e,t){let s=(e.assignees||[]).includes(t.id);return e.notifyPartner===!1?s?`Sem aviso agora. Como ${t.name} \xE9 respons\xE1vel, ele ainda recebe os lembretes do hor\xE1rio.`:`${t.name} n\xE3o recebe aviso nem lembretes deste evento. Fica s\xF3 na agenda.`:`${t.name} recebe o aviso de que voc\xEA marcou e os lembretes do hor\xE1rio.`}var be=e=>["shoot","meeting","work","other"].includes(g[e].kind),ie=e=>["shoot","meeting"].includes(g[e].kind);function ht(e,t,s){let o=c.companiesSorted();return`
  ${H(t?"Editar evento":"Novo evento",{left:'<button class="btn-text" data-close>Cancelar</button>',right:'<button class="btn btn--primary btn--sm" data-save>Salvar</button>'})}
  <form class="form" data-editor onsubmit="return false">
    <div class="fgroup">
      <label class="flabel">O que \xE9?</label>
      <div class="typegrid">
        ${Ke.map(a=>`<button type="button" class="typebtn tbadge--${a}${e.type===a?" is-on":""}" data-type="${a}">${f(g[a].icon,20)}<span>${g[a].label}</span></button>`).join("")}
      </div>
    </div>

    <div class="fgroup">
      <label class="flabel">Empresa</label>
      <div class="cogrid">
        ${o.map(a=>`<button type="button" class="cobtn${e.companyId===a.id?" is-on":""}" style="--cc:${a.color}" data-company="${a.id}">${L(a,26,7)}<span>${m(a.name)}</span></button>`).join("")}
        <button type="button" class="cobtn cobtn--add" data-newco>${f("plus",18)}<span>Nova empresa</span></button>
      </div>
    </div>

    <div class="fgroup" data-when="net" ${g[e.type].kind==="post"?"":"hidden"}>
      <label class="flabel">Onde vai postar?</label>
      <div class="netgrid">${Qe.map(a=>{let n=ue(a);return n?`<button type="button" class="netbtn${(e.platform||"instagram")===a?" is-on":""}" data-net="${a}"><span class="pf" style="width:22px;height:22px">${n.svg}</span><span>${m(n.name.replace(" (Twitter)",""))}</span></button>`:""}).join("")}</div>
    </div>

    <div class="fgroup">
      <label class="flabel" for="f-title">T\xEDtulo</label>
      <input id="f-title" class="input" name="title" value="${m(e.title)}" placeholder="${m(g[e.type].placeholder)}" autocomplete="off" maxlength="120">
    </div>

    <div class="fgroup row2">
      <div><label class="flabel" for="f-date">Dia</label><input id="f-date" class="input" type="date" name="date" value="${e.date}" required></div>
      <div><label class="flabel" for="f-time">Hor\xE1rio</label><input id="f-time" class="input" type="time" name="time" value="${e.time||""}" step="300"></div>
    </div>

    <div class="fgroup" data-when="duration" ${be(e.type)?"":"hidden"}>
      <label class="flabel" for="f-dur">Dura\xE7\xE3o</label>
      <select id="f-dur" class="input" name="duration">
        ${We.map(a=>`<option value="${a}"${(e.duration||g[e.type].dur)===a?" selected":""}>${z(a)}</option>`).join("")}
      </select>
    </div>

    <div data-hint></div>

    <div class="fgroup">
      <label class="flabel">Quem vai fazer?</label>
      <div class="whogrid">
        ${c.team.map(a=>`<button type="button" class="whobtn${(e.assignees||[]).includes(a.id)?" is-on":""}" style="--mc:${a.color}" data-who="${a.id}">${K(a.id,30)}<span>${m(a.name)}</span><i class="whobtn__check">${f("check",14)}</i></button>`).join("")}
      </div>
      <p class="fhelp">Marque os dois se forem juntos.</p>
      ${c.team.filter(a=>a.id!==c.me).map(a=>`<label class="list__row notifyrow"><span><b>${f("bell",15)} Avisar ${a.name==="Matheus"||a.name==="Henrique"?"o ":""}${m(a.name)}</b><small data-notifyhelp>${De(e,a)}</small></span><input type="checkbox" class="switch" name="notifyPartner" ${e.notifyPartner!==!1?"checked":""}></label>`).join("")}
    </div>

    <div class="fgroup" data-when="location" ${ie(e.type)?"":"hidden"}>
      <label class="flabel" for="f-loc">Local</label>
      <input id="f-loc" class="input" name="location" value="${m(e.location||"")}" placeholder="Endere\xE7o ou nome do lugar" autocomplete="off">
      <button type="button" class="btn-text btn-text--sm" data-useaddr hidden>${f("pin",14)} Usar endere\xE7o da empresa</button>
    </div>

    <div class="fgroup">
      <label class="flabel" for="f-desc">Descri\xE7\xE3o / legenda <em class="tag">${f("eye",12)} cliente v\xEA</em></label>
      <textarea id="f-desc" class="input" name="description" rows="3" placeholder="Ideia do post, legenda, roteiro\u2026">${m(e.description||"")}</textarea>
    </div>
    <div class="fgroup">
      <label class="flabel" for="f-note">Nota interna <em class="tag tag--note">${f("eyeoff",12)} s\xF3 a equipe</em></label>
      <textarea id="f-note" class="input" name="internalNote" rows="2" placeholder="Equipamento, observa\xE7\xF5es, combinados\u2026">${m(e.internalNote||"")}</textarea>
    </div>

    <div class="list">
      <label class="list__row"><span>${f("bell",18)} Lembrete</span>
        <select name="reminder">${ye.map(a=>`<option value="${a.v}"${(e.reminder??30)===a.v?" selected":""}>${a.label}</option>`).join("")}</select>
      </label>
      ${t?"":`<label class="list__row"><span>${f("repeat",18)} Repetir</span>
        <select name="repeat">${we.map(a=>`<option value="${a.v}"${s.mode===a.v?" selected":""}>${a.label}</option>`).join("")}</select>
      </label>
      <label class="list__row" data-when="until" hidden><span>${f("calendar",18)} At\xE9</span>
        <input type="date" name="until" value="${s.until}">
      </label>`}
      <label class="list__row"><span>${f("eye",18)} Aparece para o cliente</span>
        <input type="checkbox" class="switch" name="visibleToClient" ${e.visibleToClient!==!1?"checked":""}>
      </label>
      ${t?`<label class="list__row"><span>${f("check",18)} Status</span>
        <select name="status">${$e.map(a=>`<option value="${a}"${e.status===a?" selected":""}>${ce[a].label}</option>`).join("")}</select>
      </label>`:""}
    </div>

    ${t?`<button type="button" class="btn btn--danger-soft btn--block" data-delete>${f("trash",18)} Excluir evento</button>`:""}
    <div class="form__spacer"></div>
  </form>`}function Lt(e,t,s,o){let a=e.el,n=a.querySelector("[data-editor]"),l=d=>a.querySelector(d),p=()=>{let d=l("[data-hint]");d.innerHTML=Dt(t,!s),d.querySelectorAll("[data-settime]").forEach(b=>b.onclick=()=>{t.time=b.dataset.settime,n.time.value=t.time,p()}),d.querySelectorAll("[data-setwho]").forEach(b=>b.onclick=()=>{t.assignees=[b.dataset.setwho],a.querySelectorAll("[data-who]").forEach(y=>y.classList.toggle("is-on",t.assignees.includes(y.dataset.who))),p()})},r=()=>{a.querySelector('[data-when="duration"]').hidden=!be(t.type);let d=a.querySelector('[data-when="net"]');d&&(d.hidden=g[t.type].kind!=="post"),a.querySelector('[data-when="location"]').hidden=!ie(t.type);let b=c.company(t.companyId),y=l("[data-useaddr]");y.hidden=!(b&&b.address&&n.location.value!==b.address);let D=a.querySelector('[data-when="until"]');D&&(D.hidden=o.mode==="none")};a.querySelectorAll("[data-type]").forEach(d=>d.onclick=()=>{let b=t.type;if(t.type=d.dataset.type,a.querySelectorAll("[data-type]").forEach(y=>y.classList.toggle("is-on",y===d)),n.title.placeholder=g[t.type].placeholder,(!s||b!==t.type)&&(t.duration=be(t.type)?g[t.type].dur:null,n.duration.value=String(g[t.type].dur),s||(t.visibleToClient=g[t.type].client,n.visibleToClient.checked=t.visibleToClient)),ie(t.type)&&!n.location.value){let y=c.company(t.companyId);y?.address&&(n.location.value=y.address,t.location=y.address)}r(),p()}),a.querySelectorAll("[data-company]").forEach(d=>d.onclick=()=>{t.companyId=d.dataset.company,a.querySelectorAll("[data-company]").forEach(y=>y.classList.toggle("is-on",y===d));let b=c.company(t.companyId);ie(t.type)&&b?.address&&!n.location.value&&(n.location.value=b.address,t.location=b.address),r()}),l("[data-newco]").onclick=()=>{Ne(null,d=>{t.companyId=d.id,u(),e.set(ht(t,!!s,o))})},a.querySelectorAll("[data-who]").forEach(d=>d.onclick=()=>{let b=d.dataset.who;t.assignees=t.assignees.includes(b)?t.assignees.filter(x=>x!==b):[...t.assignees,b],d.classList.toggle("is-on",t.assignees.includes(b)),p();let y=a.querySelector("[data-notifyhelp]"),D=c.team.find(x=>x.id!==c.me);y&&D&&(y.textContent=De(t,D))});let i=a.querySelector('input[name="notifyPartner"]');i&&(i.onchange=()=>{t.notifyPartner=i.checked;let d=a.querySelector("[data-notifyhelp]"),b=c.team.find(y=>y.id!==c.me);d&&b&&(d.textContent=De(t,b))}),l("[data-useaddr]").onclick=()=>{let d=c.company(t.companyId);n.location.value=d.address,t.location=d.address,r()},a.querySelectorAll("[data-net]").forEach(d=>d.onclick=()=>{t.platform=d.dataset.net,a.querySelectorAll("[data-net]").forEach(b=>b.classList.toggle("is-on",b===d))});let u=()=>{t.title=lt(n.title.value.trim(),t.type),g[t.type].kind==="post"&&!t.platform&&(t.platform="instagram"),g[t.type].kind!=="post"&&(t.platform=null),t.date=n.date.value,t.time=n.time.value||"",t.duration=be(t.type)?Number(n.duration.value):null,t.location=ie(t.type)?n.location.value.trim():"",t.description=n.description.value.trim(),t.internalNote=n.internalNote.value.trim(),t.reminder=Number(n.reminder.value),t.visibleToClient=n.visibleToClient.checked,n.status&&(t.status=n.status.value),n.repeat&&(o.mode=n.repeat.value),n.until&&(o.until=n.until.value)};n.addEventListener("input",()=>{u(),r()}),n.addEventListener("change",()=>{u(),r(),p()});let h=l("[data-delete]");h&&(h.onclick=()=>ft(t.id,null).then(()=>!c.event(t.id)&&e.close())),l("[data-save]").onclick=async()=>{if(u(),!v){if(!t.companyId){_("Escolha a empresa"),a.querySelector(".cogrid").scrollIntoView({behavior:"smooth",block:"center"});return}if(!t.date)return _("Escolha o dia");if(!(!t.assignees.length&&!await U({title:"Ningu\xE9m respons\xE1vel?",text:"Este evento ficar\xE1 sem respons\xE1vel. Deseja salvar assim mesmo?",ok:"Salvar assim"}))&&!v){v=!0;try{await T()}finally{v=!1}}}};let v=!1,T=async()=>{if(s){if(["date","time","duration","type","assignees","companyId"].some(b=>JSON.stringify(t[b])!==JSON.stringify(s[b]))&&!await qe(t,!1,e,w))return;await Bt(t,s)}else if(o.mode!=="none"){let d=Pt(t.date,o),b=d.filter(x=>oe({...t,date:x},{isNew:!0}).some(C=>C.level==="block")),y=d;if(b.length){let x=await W({title:`${b.length} de ${d.length} datas j\xE1 t\xEAm compromisso nesse hor\xE1rio`,text:b.slice(0,6).map(C=>Z(C)).join(" \xB7 ")+(b.length>6?" \u2026":""),options:[{label:`Criar s\xF3 nas ${d.length-b.length} datas livres`,value:"free",primary:!0},{label:"Criar em todas mesmo assim",value:"all"}]});if(!x)return;if(x==="free"&&(y=d.filter(C=>!b.includes(C))),!y.length)return _("Nenhuma data livre")}let D=R("s_");await c.upsertMany("events",y.map((x,C)=>({...t,id:C===0?t.id:R("e_"),date:x,seriesId:D})),{activity:{notifyPartner:t.notifyPartner,kind:"series",count:y.length,label:`${g[t.type].label} ${we.find(x=>x.v===o.mode)?.label.toLowerCase()||""} \xE0s ${k(t.time)}`,sample:{companyId:t.companyId,date:y[0]}}}),_(`${y.length} eventos criados`)}else{if(!await qe(t,!0,e,w))return;await c.upsert("events",{...t}),_("Evento salvo")}e.close()};function w(){n.time.value=t.time||"",n.date.value=t.date,a.querySelectorAll("[data-who]").forEach(d=>d.classList.toggle("is-on",t.assignees.includes(d.dataset.who))),r(),p()}r(),p()}var Oe=420,ut=1380,j=e=>(Math.min(Math.max(e,Oe),ut)-Oe)/(ut-Oe)*100;function Ot(e,t){let s=e.time?O(e):null,o=[8,10,12,14,16,18,20,22];return`<div class="lanes">
    <div class="lanes__head"><strong>Agenda dos dois em ${m(Z(e.date))}</strong></div>
    ${c.team.map(a=>{let n=c.eventsOn(e.date,{person:a.id}).filter(r=>r.id!==e.id&&r.time),l=(e.assignees||[]).includes(a.id),p=t.some(r=>r.level==="block"&&r.person===a.id);return`<div class="lane">
        <span class="lane__who">${K(a.id,22)}</span>
        <div class="lane__track">
          ${o.map(r=>`<i class="lane__tick" style="left:${j(r*60)}%"></i>`).join("")}
          ${n.map(r=>{let i=O(r),u=c.company(r.companyId);return`<span class="lane__ev" style="left:${j(i[0])}%;width:max(4px,${j(i[1])-j(i[0])}%);background:${u?.color||"#888"}" title="${m(V(r))}"></span>`}).join("")}
          ${s&&l?`<span class="lane__draft${p?" is-clash":""}" style="left:${j(s[0])}%;width:max(6px,${j(s[1])-j(s[0])}%)"></span>`:""}
        </div>
      </div>`}).join("")}
    <div class="lane lane--axis"><span class="lane__who"></span><div class="lane__track">${o.map(a=>`<small style="left:${j(a*60)}%">${a}h</small>`).join("")}</div></div>
  </div>`}function Dt(e,t){if(!e.date)return"";let s=oe(e,{isNew:t}),o=s.filter(v=>v.level==="block"),a=s.filter(v=>v.level==="warn"),n=s.filter(v=>v.level==="info"),l=he(e,{limit:4}),p=ve(e),r=(e.assignees||[]).length===1?e.assignees[0]:null,i=o.length&&r?c.team.find(v=>v.id!==r&&p.includes(v.id)):null,u=g[e.type],h=v=>`<li class="issue issue--${v.level}">${f(v.level==="block"?"alert":v.level==="warn"?"flag":v.code==="partner"?"user":"bulb",15)}<div><strong>${m(v.title)}</strong><p>${m(v.text)}</p></div></li>`;return`
  <section class="assist">
    <header class="assist__head">${f("sparkle",16)} Assistente</header>
    ${Ot(e,s)}
    ${s.length?`<ul class="issues">${[...o,...a,...n].map(h).join("")}</ul>`:e.time?`<p class="assist__ok">${f("check",15)} Hor\xE1rio livre para ${m(ae(e.assignees))}, sem conflitos.</p>`:""}
    ${i?`<button type="button" class="tchip tchip--wide" data-setwho="${i.id}">${K(i.id,18)} Passar para ${m(i.name)} (est\xE1 livre)</button>`:""}
    <div class="assist__sugg">
      <p>${m(u.tip)}</p>
      ${l.length?`<div class="hintbox__times">${l.map(v=>`<button type="button" class="tchip${e.time===v.time?" is-on":""}" data-settime="${v.time}">${k(v.time)}${v.peak?"<small>pico</small>":"<small>livre</small>"}</button>`).join("")}</div>`:`<p class="muted">Nenhum hor\xE1rio livre nesse dia${(e.assignees||[]).length?" para "+m(ae(e.assignees)):""}. Tente outro dia ou outra pessoa.</p>`}
    </div>
  </section>`}async function qe(e,t,s,o){let n=oe(e,{isNew:t}).filter(h=>h.level==="block");if(!n.length)return!0;let l=he(e,{limit:2}),p=(e.assignees||[]).length===1?e.assignees[0]:null,r=p&&c.team.find(h=>h.id!==p&&ve(e).includes(h.id)),i=[...l.map(h=>({label:`Mudar para ${k(h.time)} (livre)`,value:"time:"+h.time,primary:!0})),...r?[{label:`Passar para ${r.name} (est\xE1 livre)`,value:"who:"+r.id,primary:!l.length}]:[],{label:"Marcar mesmo assim",value:"force"}],u=await W({title:n[0].code==="duplicate"?"Isso j\xE1 est\xE1 na agenda":"J\xE1 tem compromisso nesse hor\xE1rio",bodyHtml:`<ul class="issues issues--dialog">${n.map(h=>`<li class="issue issue--block">${f("alert",15)}<div><strong>${m(h.title)}</strong><p>${m(h.text)}</p></div></li>`).join("")}</ul>`,options:i});return u?u==="force"?!0:(u.startsWith("time:")&&(e.time=u.slice(5)),u.startsWith("who:")&&(e.assignees=[u.slice(4)]),o(),qe(e,t,s,o)):!1}async function qt(e,t){let s={...e,...t},o=oe(s).filter(n=>n.level==="block");return o.length?await W({title:"J\xE1 tem compromisso nesse hor\xE1rio",bodyHtml:`<ul class="issues issues--dialog">${o.map(n=>`<li class="issue issue--block">${f("alert",15)}<div><strong>${m(n.title)}</strong><p>${m(n.text)}</p></div></li>`).join("")}</ul>`,options:[{label:"Mover mesmo assim",value:"force",primary:!0}]})==="force":!0}function Pt(e,t){let s=[],o=e,a=t.until&&t.until>=e?t.until:M(e,28);for(;o<=a&&s.length<150;){let n=B(o).getDay();(t.mode==="daily"||t.mode==="weekdays"&&n>=1&&n<=5||t.mode==="weekly"&&B(o).getDay()===B(e).getDay())&&s.push(o),o=M(o,1)}return s}var jt=["type","companyId","title","time","duration","assignees","location","description","internalNote","reminder","visibleToClient"];async function Bt(e,t){let s=jt.filter(o=>JSON.stringify(e[o])!==JSON.stringify(t[o]));if(e.seriesId&&s.length){let o=c.state.events.filter(a=>a.seriesId===e.seriesId&&a.date>t.date);if(o.length){let a=await W({title:"Evento repetido",text:"Aplicar as altera\xE7\xF5es a quais eventos?",options:[{label:"S\xF3 a este",value:"one",primary:!0},{label:`A este e aos pr\xF3ximos (${o.length+1})`,value:"next"}]});if(!a)return;if(a==="next"){let n=Object.fromEntries(s.map(l=>[l,e[l]]));await c.upsertMany("events",[{...e},...o.map(l=>({...l,...n}))],{activity:{kind:"series-edit",count:o.length+1,label:`${g[e.type].label} \xB7 a partir de ${e.date.slice(8)}/${e.date.slice(5,7)}`,sample:{companyId:e.companyId,date:e.date}}}),_("S\xE9rie atualizada");return}}}await c.upsert("events",{...e}),_("Altera\xE7\xF5es salvas")}export{ha as a,va as b,lt as c,K as d,$t as e,L as f,_e as g,Ee as h,q as i,Wt as j,H as k,_ as l,U as m,W as n,N as o,Ft as p,Te as q,O as r,V as s,he as t,wt as u,ta as v,aa as w,st as x,Va as y,mt as z,qt as A,Ma as B,Ta as C,Ne as D};
