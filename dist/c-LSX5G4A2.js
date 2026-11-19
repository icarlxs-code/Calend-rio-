import{a as ge,b as Ge,d as Ve,e as Ye,f as l,i as pe,o as ke}from"./c-N7ZMKEZW.js";import{a as f}from"./c-DA3WSDQL.js";import{A as R,C as m,D as Fe,E as F,F as He,H as Ue,c as B,d as S,e as T,f as qe,g as le,i as Pe,j as $,k as P,l as Q,m as w,n as je,s as Be,u as Re,v as X,w as Z,x as J}from"./c-DOOMBXLW.js";import{a as b,b as Je,c as E,d as M,e as ce,f as $e,h as de,i as ze,j as ye,k as we}from"./c-3GA6RSWB.js";import{a as re}from"./c-LUBY74EX.js";var ee=(()=>{try{return JSON.parse(localStorage.getItem("pauta.ui")||"{}")}catch{return{}}})(),N={tab:ee.tab==="pessoal"?"hoje":ee.tab||"hoje",space:ee.space==="personal"?"personal":"work",ptab:ee.ptab||"p-hoje",pMonth:null,pSel:null,pView:"mes",person:ee.person||"all",date:S(),month:le(S()),monthSel:S(),monthCompany:null,showAllTips:!1};function jt(){try{localStorage.setItem("pauta.ui",JSON.stringify({tab:N.tab,person:N.person,space:N.space,ptab:N.ptab}))}catch{}}var C=(e,t,s="#fff")=>`<svg viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="6" fill="${e}"/><g fill="none" stroke="${s}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${t}</g></svg>`,ft="url(#pf-ig)",me=[{id:"instagram",name:"Instagram",words:["instagram","insta"," ig ","feed","reels","reel","carrossel"],svg:`<svg viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="pf-ig" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#FEDA75"/><stop offset=".35" stop-color="#FA7E1E"/><stop offset=".6" stop-color="#D62976"/><stop offset="1" stop-color="#4F5BD5"/></linearGradient></defs><rect width="24" height="24" rx="6" fill="${ft}"/><g fill="none" stroke="#fff" stroke-width="1.9"><rect x="5" y="5" width="14" height="14" rx="4"/><circle cx="12" cy="12" r="3.3"/></g><circle cx="16.3" cy="7.7" r="1" fill="#fff"/></svg>`},{id:"tiktok",name:"TikTok",words:["tiktok","tik tok","tik-tok"],svg:C("#000",'<path d="M13 5v9.5a3 3 0 1 1-3-3" stroke="#25F4EE" transform="translate(-.7 -.5)"/><path d="M13 5v9.5a3 3 0 1 1-3-3" stroke="#FE2C55" transform="translate(.7 .5)"/><path d="M13 5v9.5a3 3 0 1 1-3-3M13 5c.4 2.2 1.8 3.6 4 3.8"/>')},{id:"youtube",name:"YouTube",words:["youtube","you tube","shorts"," yt "],svg:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="6" fill="#FF0000"/><path d="M10 8.5v7l6-3.5z" fill="#fff"/></svg>'},{id:"facebook",name:"Facebook",words:["facebook"," face "," fb "],svg:C("#1877F2",'<path d="M14.5 6.5H13a2.5 2.5 0 0 0-2.5 2.5v11M8.5 12h6"/>')},{id:"whatsapp",name:"WhatsApp",words:["whatsapp","whats","zap","wpp","status do whats"],svg:C("#25D366",'<path d="M6 18l1-3a6 6 0 1 1 2.3 2.2z"/><path d="M10 9.5c0 2 2.5 4.5 4.5 4.5" />')},{id:"linkedin",name:"LinkedIn",words:["linkedin","linked in"],svg:C("#0A66C2",'<path d="M8 10.5V17M8 7.3v.1M11.5 17v-6.5M11.5 13a2.5 2.5 0 0 1 5 0v4"/>')},{id:"x",name:"X (Twitter)",words:["twitter","tweet"," x "],svg:C("#000",'<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>')},{id:"threads",name:"Threads",words:["threads"],svg:C("#000",'<path d="M15.5 10.5c-.5-2.5-2-3.5-3.8-3.5C9 7 7.5 9.2 7.5 12s1.6 5 4.4 5c2.4 0 4-1.4 4-3.2 0-2-2.2-2.8-4-2.3-1.3.4-1.7 1.6-1 2.3.9.9 3.3.4 3.6-2.3"/>')},{id:"pinterest",name:"Pinterest",words:["pinterest","pin "],svg:C("#E60023",'<path d="M11 11l-2 8M9.5 14.5c.4.9 1.4 1.5 2.6 1.5 2.5 0 4-2.2 4-4.7C16.1 8.6 14.3 7 12 7a4.5 4.5 0 0 0-4.3 5.8"/>')},{id:"google",name:"Google Meu Neg\xF3cio",words:["google","meu neg\xF3cio","meu negocio","gmb","maps"],svg:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="6" fill="#fff" stroke="#ddd"/><g fill="none" stroke-width="2.4"><path d="M17.5 12.2H12" stroke="#4285F4"/><path d="M17.5 12.2a5.6 5.6 0 0 1-9.9 3.3" stroke="#34A853"/><path d="M7.6 15.5a5.6 5.6 0 0 1 0-7" stroke="#FBBC05"/><path d="M7.6 8.5a5.6 5.6 0 0 1 8.3-.6" stroke="#EA4335"/></g></svg>'},{id:"kwai",name:"Kwai",words:["kwai"],svg:C("#FF7E00",'<rect x="5" y="9" width="10" height="8" rx="2"/><path d="M15 12l4-2v6l-4-2"/><circle cx="8" cy="6.5" r="1.5"/><circle cx="12" cy="6.5" r="1.5"/>')},{id:"spotify",name:"Spotify",words:["spotify","podcast"],svg:C("#1DB954",'<path d="M7 9.5c3.5-1 7-.6 10 1M7.7 12.6c2.8-.7 5.6-.4 8 .9M8.4 15.5c2.2-.5 4.3-.3 6.1.7"/>')},{id:"telegram",name:"Telegram",words:["telegram"],svg:C("#26A5E4",'<path d="M5.5 11.5l12-5-2 11-4-3-2 2v-3.5l6-5"/>')},{id:"email",name:"E-mail",words:["e-mail","email","newsletter"],svg:C("#6B7280",'<rect x="5" y="7" width="14" height="10" rx="2"/><path d="m5.5 8 6.5 5 6.5-5"/>')},{id:"site",name:"Site / Blog",words:["site","blog","landing"],svg:C("#334155",'<circle cx="12" cy="12" r="6.5"/><path d="M5.5 12h13M12 5.5c2 2 2 11 0 13M12 5.5c-2 2-2 11 0 13"/>')}];function ht(e){let t=` ${[e?.title,e?.description,e?.internalNote].filter(Boolean).join(" ").toLowerCase()} `.replace(/[.,;:!?()/\-]/g," "),s=me.filter(a=>!["instagram"].includes(a.id)&&a.words.some(n=>t.includes((n.startsWith(" "),n))));return me[0].words.slice(0,3).some(a=>t.includes(a))&&s.unshift(me[0]),s}var Ke=["instagram","tiktok","facebook","youtube","linkedin","whatsapp","pinterest","x"],ue=e=>me.find(t=>t.id===e);function vt(e){let t=ht(e),s=e?.platform?ue(e.platform):b[e?.type]?.kind==="post"?ue("instagram"):null;return s?[s,...t.filter(o=>o.id!==s.id)]:t}function fe(e,t=18){return(Array.isArray(e)?e:vt(e)).map(o=>`<span class="pf" style="width:${t}px;height:${t}px" title="${o.name}">${o.svg}</span>`).join("")}function z(e,t=26){let s=l.member(e);return s?s.photo?`<span class="avatar avatar--photo" style="--s:${t}px;background:${s.color}" title="${m(s.name)}"><img src="${s.photo}" alt="" loading="lazy"></span>`:`<span class="avatar" style="--s:${t}px;background:${s.color}" title="${m(s.name)}">${m(s.name[0])}</span>`:""}function bt(e=[],t=24){return e.length?`<span class="avatars">${e.map(s=>z(s,t)).join("")}</span>`:`<span class="avatar avatar--empty" style="--s:${t}px" title="Sem respons\xE1vel">?</span>`}var ae=(e=[])=>{let t=e.map(s=>l.member(s)?.name).filter(Boolean);return t.length?t.length===l.team.length&&t.length>1?"Os dois":t.join(" e "):"Sem respons\xE1vel"};function D(e,t=36,s=null){let o=s??Math.round(t*.28);return e?e.logo?`<span class="logo logo--img" style="--s:${t}px;--r:${o}px"><img src="${m(e.logo)}" alt=""></span>`:`<span class="logo" style="--s:${t}px;--r:${o}px;background:${e.color};color:${He(e.color)}">${m(Fe(e.name))}</span>`:`<span class="logo" style="--s:${t}px;--r:${o}px;background:#999">?</span>`}function xe(e,{solid:t=!1}={}){let s=b[e]||b.outro;return`<span class="tbadge tbadge--${e}${t?" is-solid":""}">${f(s.icon,13)}${s.label}</span>`}function Qe(e){if(!e.time)return"Dia todo";let t=b[e.type];return t&&(t.kind==="shoot"||t.kind==="meeting"||t.kind==="work"||e.duration)?t.kind==="post"&&!e.duration?w(e.time):`${w(e.time)}\u2013${w(P($(e.time)+M(e)))}`:w(e.time)}function _e(e,{showDate:t=!1,compact:s=!1,highlight:o=[]}={}){let a=l.company(e.companyId),n=a?.color||"#888",i=e.status==="feito",r=e.date===S()&&e.time&&$(e.time)+M(e)<Q()&&e.status==="pendente",u=o.includes(e.id);return`
  <article class="ecard${i?" is-done":""}${r?" is-late":""}${u?" is-flagged":""}${s?" is-compact":""}"
    style="--cc:${n};--cc-soft:${F(n,.1)}" data-action="open-event" data-id="${e.id}">
    <div class="ecard__time">
      <strong>${e.time?w(e.time):"\u2014"}</strong>
      ${t?`<small>${m(e.date.slice(8))}/${m(e.date.slice(5,7))}</small>`:e.time&&(b[e.type]?.kind!=="post"||e.duration)?`<small>${w(P($(e.time)+M(e)))}</small>`:""}
    </div>
    <div class="ecard__body">
      <div class="ecard__top">
        ${D(a,20,6)}
        <span class="ecard__company">${m(a?.name||"Sem empresa")}</span>
        ${xe(e.type)}
      </div>
      <div class="ecard__title"><span class="pfrow">${fe(e,17)}</span>${m(e.title||b[e.type]?.label||"Evento")}</div>
      ${s?"":`<div class="ecard__meta">
        ${bt(e.assignees,20)}<span>${m(ae(e.assignees))}</span>
        ${e.location?`<span class="ecard__loc">${f("pin",12)}${m(e.location)}</span>`:""}
        ${r?'<span class="ecard__late">Atrasado</span>':""}
        ${e.visibleToClient===!1?`<span class="ecard__private" title="N\xE3o aparece para o cliente">${f("eyeoff",12)}</span>`:""}
      </div>`}
    </div>
    ${l.canEdit("events",e)?`<button class="ecard__check${i?" is-on":""}" data-action="toggle-done" data-id="${e.id}" aria-label="${i?"Desmarcar":"Marcar como feito"}">
      ${f("check",16)}
    </button>`:""}
  </article>`}function Ee(e,t,s=""){return`<div class="empty">${f("sparkle",28)}<h3>${m(e)}</h3><p>${m(t)}</p>${s}</div>`}var te=[];function q({html:e,onMount:t,className:s="",onClose:o}){let a=document.getElementById("sheets"),n=document.createElement("div");n.className="sheet-wrap",n.innerHTML=`<div class="sheet-backdrop" data-close></div>
    <section class="sheet ${s}" role="dialog" aria-modal="true">
      <div class="sheet__grab" data-grab><span></span></div>
      <div class="sheet__inner"></div>
    </section>`,a.appendChild(n);let i=n.querySelector(".sheet__inner"),p=n.querySelector(".sheet"),c={el:i,panel:p,set(d){i.innerHTML=d,t&&t(c)},close(){if(c.closed)return;c.closed=!0,n.classList.remove("is-open");let d=te.indexOf(c);d>=0&&te.splice(d,1),setTimeout(()=>n.remove(),280),o&&o(),document.body.classList.toggle("has-sheet",te.length>0)}};te.push(c),c.set(e),document.body.classList.add("has-sheet"),requestAnimationFrame(()=>requestAnimationFrame(()=>n.classList.add("is-open"))),n.addEventListener("click",d=>{d.target.closest("[data-close]")&&c.close()});let r=null,u=0,v=n.querySelector("[data-grab]"),g=d=>{!d.target.closest("[data-grab], .sheet__head")||d.target.closest("button, input, select, textarea")||(r=d.touches[0].clientY,u=0,p.style.transition="none")},I=d=>{r!=null&&(u=Math.max(0,d.touches[0].clientY-r),p.style.transform=`translateY(${u}px)`)},k=()=>{r!=null&&(p.style.transition="",p.style.transform="",u>110&&c.close(),r=null)};return p.addEventListener("touchstart",g,{passive:!0}),p.addEventListener("touchmove",I,{passive:!0}),p.addEventListener("touchend",k),v&&v.addEventListener("click",()=>{}),c}var Jt=()=>te;function H(e,{left:t="",right:s=""}={}){return`<header class="sheet__head">
    <div class="sheet__head-l">${t||'<button class="btn-text" data-close>Fechar</button>'}</div>
    <h2>${m(e)}</h2>
    <div class="sheet__head-r">${s}</div>
  </header>`}var We;function _(e,{action:t,onAction:s,ms:o=2600}={}){let a=document.getElementById("toast");a.innerHTML=`<span>${m(e)}</span>${t?`<button>${m(t)}</button>`:""}`,a.classList.add("is-on"),t&&(a.querySelector("button").onclick=()=>{a.classList.remove("is-on"),s&&s()}),clearTimeout(We),We=setTimeout(()=>a.classList.remove("is-on"),o)}function U({title:e,text:t="",ok:s="Confirmar",danger:o=!1}){return new Promise(a=>q({className:"sheet--dialog",html:`<div class="dialog">
        <h3>${m(e)}</h3>${t?`<p>${m(t)}</p>`:""}
        <button class="btn ${o?"btn--danger":"btn--primary"} btn--block" data-ok>${m(s)}</button>
        <button class="btn btn--ghost btn--block" data-close>Cancelar</button>
      </div>`,onClose:()=>a(!1),onMount:i=>{i.el.querySelector("[data-ok]").onclick=()=>{a(!0),i.close()}}}))}function K({title:e,text:t="",bodyHtml:s="",options:o}){return new Promise(a=>{let n=null;q({className:"sheet--dialog",html:`<div class="dialog">
        <h3>${m(e)}</h3>${t?`<p>${m(t)}</p>`:""}${s}
        ${o.map((i,p)=>`<button class="btn ${i.danger?"btn--danger":i.primary?"btn--primary":"btn--soft"} btn--block" data-i="${p}">${m(i.label)}</button>`).join("")}
        <button class="btn btn--ghost btn--block" data-close>Cancelar</button>
      </div>`,onClose:()=>a(n),onMount:i=>{i.el.querySelectorAll("[data-i]").forEach(p=>p.onclick=()=>{n=o[+p.dataset.i].value,i.close()})}})})}var gt={workStart:"08:00",workEnd:"19:00",lunchStart:"12:00",lunchEnd:"13:00",daysOff:[0],travelMin:45,maxTasks:8},Me=()=>({...gt,...l.state.settings.find(e=>e.id==="routine")||{}}),L=e=>{let t=$(e.time);return t==null?null:[t,t+M(e)]},Y=(e,t)=>e&&t&&e[0]<t[1]&&t[0]<e[1],W=e=>["shoot","meeting"].includes(b[e.type]?.kind),Xe=e=>!E(e.type),Te=e=>l.company(e.companyId)?.name||"",V=e=>`${b[e.type]?.label||"Evento"}${Te(e)?" \xB7 "+Te(e):""}`,G=e=>l.member(e)?.name||"\u2014",Se=e=>E(e.type)&&!e.duration?`\xE0s ${w(e.time)}`:`das ${w(e.time)} \xE0s ${w(P(L(e)[1]))}`,Ze=(e,t)=>(e.location||e.companyId)===(t.location||t.companyId),se=(e,t,s)=>l.state.events.filter(o=>o.date===t&&o.id!==s&&o.time&&o.status!=="feito"&&(o.assignees||[]).includes(e));function oe(e,{isNew:t=!1}={}){let s=[];if(!e.date)return s;let o=Me(),a=e.time?[$(e.time),$(e.time)+M(e)]:null,n=e.assignees||[];if(a){n.forEach(r=>{se(r,e.date,e.id).forEach(u=>{if(!Y(a,L(u)))return;let v=E(e.type)!==E(u.type)&&(E(e.type)||E(u.type));s.push({level:"block",code:"overlap",person:r,eventIds:[u.id],title:`${G(r)} j\xE1 tem compromisso nesse hor\xE1rio`,text:`${V(u)} ${Se(u)}${u.createdBy?` (marcado por ${u.createdBy===l.me?"voc\xEA":G(u.createdBy)})`:""}.`+(v?" Se for manter, deixe o post programado antes.":"")})})}),l.state.events.filter(r=>r.id!==e.id&&r.date===e.date&&r.companyId===e.companyId&&r.type===e.type&&r.time&&Math.abs($(r.time)-a[0])<=30).forEach(r=>{s.some(u=>u.eventIds?.includes(r.id))||s.push({level:"block",code:"duplicate",eventIds:[r.id],title:"Parece que isso j\xE1 foi marcado",text:`J\xE1 existe ${V(r)} ${Se(r)}, com ${(r.assignees||[]).map(G).join(" e ")||"ningu\xE9m"}${r.createdBy?`, marcado por ${r.createdBy===l.me?"voc\xEA":G(r.createdBy)}`:""}.`})}),W(e)&&n.forEach(r=>{se(r,e.date,e.id).filter(W).forEach(u=>{let v=L(u),g=a[0]>=v[1]?a[0]-v[1]:v[0]>=a[1]?v[0]-a[1]:-1;g>=0&&g<o.travelMin&&!Ze(e,u)&&s.push({level:"warn",code:"travel",person:r,eventIds:[u.id],title:`Pouco tempo de deslocamento para ${G(r)}`,text:`S\xF3 ${g} min entre isto e ${V(u)} (${w(u.time)}). O combinado \xE9 ${o.travelMin} min.`})})});let p=$(o.workStart),c=$(o.workEnd);Xe(e)&&(a[0]<p||a[1]>c)?s.push({level:"warn",code:"hours",title:"Fora do expediente",text:`O hor\xE1rio de trabalho de voc\xEAs \xE9 das ${w(o.workStart)} \xE0s ${w(o.workEnd)}. Preservar o tempo livre evita esgotamento.`}):E(e.type)&&(a[0]<p||a[0]>=c)&&s.push({level:"info",code:"hours",title:"Post fora do expediente",text:"Deixe programado no Meta Business Suite para ningu\xE9m precisar parar o descanso para postar."}),Xe(e)&&Y(a,[$(o.lunchStart),$(o.lunchEnd)])&&s.push({level:"warn",code:"lunch",title:"Invade o almo\xE7o",text:`O almo\xE7o de voc\xEAs \xE9 das ${w(o.lunchStart)} \xE0s ${w(o.lunchEnd)}.`}),a[1]>1440&&s.push({level:"warn",code:"midnight",title:"Passa da meia-noite",text:"Confira a dura\xE7\xE3o."}),t&&(e.date<S()||e.date===S()&&a[0]<Q()-5)&&s.push({level:"warn",code:"past",title:"Esse hor\xE1rio j\xE1 passou",text:"Confira o dia e a hora."}),["feed","reels","carrossel"].includes(e.type)&&l.state.events.filter(r=>r.id!==e.id&&r.date===e.date&&r.companyId===e.companyId&&["feed","reels","carrossel"].includes(r.type)&&r.time).forEach(r=>{let u=Math.abs($(r.time)-a[0]);u>30&&u<180&&s.push({level:"warn",code:"spacing",eventIds:[r.id],title:"Posts da mesma empresa muito pr\xF3ximos",text:`${V(r)} \xE0s ${w(r.time)}. Espacem pelo menos 3 h.`})}),l.team.filter(r=>!n.includes(r.id)).forEach(r=>{se(r.id,e.date,e.id).filter(u=>Y(a,L(u))).forEach(u=>{s.push({level:"info",code:"partner",person:r.id,eventIds:[u.id],title:`${r.name} nesse hor\xE1rio`,text:`${V(u)} ${Se(u)}${u.location?" \xB7 "+u.location:""}.`})})})}let i=B(e.date).getDay();return o.daysOff.includes(i)&&!E(e.type)&&s.push({level:"warn",code:"dayoff",title:`${je[i]} \xE9 dia de folga`,text:"Se der, mude para um dia \xFAtil. Posts podem ficar programados."}),n.forEach(p=>{let c=l.state.events.filter(r=>r.date===e.date&&r.id!==e.id&&(r.assignees||[]).includes(p)).length+1;c>o.maxTasks&&s.push({level:"warn",code:"load",person:p,title:`${G(p)} ficaria sobrecarregado`,text:`${c} tarefas nesse dia (limite combinado: ${o.maxTasks}).`})}),s}function he(e,{limit:t=3,people:s=null}={}){if(!e.date)return[];let o=Me(),a=s||(e.assignees?.length?e.assignees:[]),n=M(e),i=E(e.type),p=i?420:$(o.workStart),c=i?1320:$(o.workEnd),r=[$(o.lunchStart),$(o.lunchEnd)],u=(b[e.type]?.best||[]).map($),v=e.date===S()?Math.ceil((Q()+15)/15)*15:0,g=l.state.events.filter(d=>d.id!==e.id&&d.date===e.date&&d.companyId&&d.companyId===e.companyId&&d.time&&(d.type===e.type||i&&E(d.type)&&d.type!=="story"&&e.type!=="story")).map(d=>({t:$(d.time),gap:d.type===e.type&&e.type==="story"?45:d.type===e.type?180:120})),I=[];for(let d=Math.max(p,v);d+n<=c;d+=15){let h=[d,d+n];if(!i&&Y(h,r)||g.some(x=>Math.abs(x.t-d)<x.gap)||a.some(x=>se(x,e.date,e.id).some(A=>{let Oe=L(A);return Y(h,Oe)?!0:W(e)&&W(A)&&!Ze(e,A)?Y([h[0]-o.travelMin,h[1]+o.travelMin],Oe):!1})))continue;let O=u.length?Math.min(...u.map(x=>Math.abs(x-d))):Math.abs(d-$(o.workStart)-60);I.push({time:P(d),score:O})}I.sort((d,h)=>d.score-h.score);let k=[];for(let d of I)if(k.every(h=>Math.abs($(h.time)-$(d.time))>=60)&&k.push(d),k.length>=t)break;return k.sort((d,h)=>$(d.time)-$(h.time)).map(d=>({...d,peak:d.score<=30}))}function ve(e){if(!e.time)return l.team.map(s=>s.id);let t=[$(e.time),$(e.time)+M(e)];return l.team.filter(s=>!se(s.id,e.date,e.id).some(o=>Y(t,L(o)))).map(s=>s.id)}function $t(e,t){let s=Me();if(s.daysOff.includes(B(t).getDay()))return{minutes:null,longest:null,dayOff:!0};let o=$(s.workStart),a=$(s.workEnd),n=[[$(s.lunchStart),$(s.lunchEnd)]];l.eventsOn(t,{person:e}).filter(r=>r.time).forEach(r=>{let u=L(r);n.push([u[0],E(r.type)?u[0]+15:u[1]+(W(r)?30:0)])}),n.sort((r,u)=>r[0]-u[0]);let i=o,p=0,c=0;return n.forEach(([r,u])=>{if(r>=a||u<=o)return;let v=Math.max(r,o),g=Math.min(u,a);g<=i||(v>i&&(p+=v-i,c=Math.max(c,v-i)),i=Math.max(i,g))}),a>i&&(p+=a-i,c=Math.max(c,a-i)),{minutes:p,longest:c,dayOff:!1}}function Xt(e,t,s){let o=[],a=E(t.type)&&!E(s.type)?t:E(s.type)&&!E(t.type)?s:(t.createdAt||0)>(s.createdAt||0)?t:s,n=l.team.find(p=>p.id!==e);n&&ve(a).includes(n.id)&&(a.assignees||[]).length===1&&o.push({label:`Passar para ${n.name}`,eventId:a.id,patch:{assignees:[n.id]}});let i=he(a,{limit:1})[0];return i&&o.push({label:`Mover ${b[a.type].label.toLowerCase()} para ${w(i.time)}`,eventId:a.id,patch:{time:i.time}}),o}function Zt(e,t="all"){let s=t==="all"?l.team:l.team.filter(n=>n.id===t),o=[];return l.eventsOn(e,{person:t}).length?(s.forEach(n=>{let i=l.eventsOn(e,{person:n.id}),p=$t(n.id,e),c=i.filter(W),r=[`${i.length} tarefa${i.length===1?"":"s"}`];c.length&&r.push(`sai para ${c.map(u=>`${Te(u)} \xE0s ${w(u.time)}`).join(" e ")}`),p.dayOff?r.push("\xE9 dia de folga"):p.minutes!=null&&r.push(p.minutes>=30?`${J(p.minutes)} livres no expediente (maior intervalo: ${J(p.longest)})`:"quase sem tempo livre"),o.push(`${n.name}: ${r.join(", ")}.`)}),o):[`Nenhum compromisso${t==="all"?"":" para "+G(t)}. Bom dia para planejar a pauta ou adiantar edi\xE7\xF5es.`]}var yt={feed:"\u{1F5BC}\uFE0F",carrossel:"\u{1F5C2}\uFE0F",reels:"\u{1F3AC}",story:"\u2B55",captacao:"\u{1F4F8}",reuniao:"\u{1F91D}",producao:"\u2702\uFE0F",outro:"\u2022"},ne=e=>String(e||"").replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\r?\n/g,"\\n"),wt=e=>{let t=[];for(;e.length>74;)t.push(e.slice(0,74)),e=" "+e.slice(74);return t.push(e),t.join(`\r
`)},et=(e,t)=>e.replace(/-/g,"")+"T"+t.replace(":","")+"00",kt=()=>new Date().toISOString().replace(/[-:]/g,"").replace(/\.\d+/,"");function xt(e,t){let s=["BEGIN:VCALENDAR","VERSION:2.0",`PRODID:-//${re.appName}//PT-BR`,"CALSCALE:GREGORIAN","METHOD:PUBLISH",`X-WR-CALNAME:${ne(t)}`];return e.forEach(o=>{let a=l.company(o.companyId),n=(o.assignees||[]).map(r=>l.member(r)?.name).filter(Boolean).join(" e "),i=`${yt[o.type]||""} ${b[o.type]?.label||"Evento"} \xB7 ${a?.name||""}${o.title?" \u2014 "+o.title:""}`.trim(),p=[n&&`Respons\xE1vel: ${n}`,o.description,o.internalNote&&`Nota interna: ${o.internalNote}`].filter(Boolean).join(`
`);if(s.push("BEGIN:VEVENT",`UID:${o.id}@pauta`,`DTSTAMP:${kt()}`),o.time){let r=$(o.time)+M(o),u=r>=1440?T(o.date,1):o.date;s.push(`DTSTART:${et(o.date,o.time)}`,`DTEND:${et(u,P(r%1440))}`)}else s.push(`DTSTART;VALUE=DATE:${o.date.replace(/-/g,"")}`,`DTEND;VALUE=DATE:${T(o.date,1).replace(/-/g,"")}`);s.push(`SUMMARY:${ne(i)}`),p&&s.push(`DESCRIPTION:${ne(p)}`),o.location&&s.push(`LOCATION:${ne(o.location)}`);let c=o.reminder??30;c>=0&&s.push("BEGIN:VALARM","ACTION:DISPLAY",`DESCRIPTION:${ne(i)}`,`TRIGGER:-PT${c}M`,"END:VALARM"),s.push("END:VEVENT")}),s.push("END:VCALENDAR"),s.map(wt).join(`\r
`)}async function tt(e,t,s){let o=xt(e,s),a=pe();if(a){let c=document.createElement("form");c.method="POST",c.action=a.replace(/\/$/,"")+"/ics",c.target="_blank",c.style.display="none";let r=document.createElement("textarea");r.name="ics",r.value=o,c.appendChild(r),document.body.appendChild(c),c.submit(),c.remove();return}let n=new File([o],t,{type:"text/calendar"});if(navigator.canShare&&navigator.canShare({files:[n]}))try{await navigator.share({files:[n],title:s});return}catch(c){if(c&&c.name==="AbortError")return}let i=URL.createObjectURL(n),p=document.createElement("a");p.href=i,p.download=t,document.body.appendChild(p),p.click(),p.remove(),setTimeout(()=>URL.revokeObjectURL(i),4e3)}var at=new Set(["fazer","criar","postar","subir","publicar","gravar","post","postagem","publicacao","publica\xE7\xE3o","o","a","um","uma","no","na","do","da","de","dos","das","pro","pra","para","feed","reels","reel","story","stories","storie","storys","carrossel","carosel","carossel","instagram","insta","ig","sobre","com","e"]),_t=[[/\bcouve flor\b/gi,"couve-flor"],[/\bpromocao\b/gi,"promo\xE7\xE3o"],[/\bpromoçao\b/gi,"promo\xE7\xE3o"],[/\bacao\b/gi,"a\xE7\xE3o"],[/\bpao\b/gi,"p\xE3o"],[/\blimao\b/gi,"lim\xE3o"],[/\bmamao\b/gi,"mam\xE3o"],[/\bmelao\b/gi,"mel\xE3o"],[/\bfeijao\b/gi,"feij\xE3o"],[/\bmaca\b/gi,"ma\xE7\xE3"],[/\bmaça\b/gi,"ma\xE7\xE3"],[/\babobora\b/gi,"ab\xF3bora"],[/\bpessego\b/gi,"p\xEAssego"],[/\bmaracuja\b/gi,"maracuj\xE1"],[/\babacate\b/gi,"abacate"],[/\babacaxi\b/gi,"abacaxi"],[/\bcafe\b/gi,"caf\xE9"],[/\bpromo\b/gi,"promo"],[/\bblack friday\b/gi,"Black Friday"],[/\bnatal\b/gi,"Natal"],[/\bano novo\b/gi,"Ano Novo"],[/\bdia das maes\b/gi,"Dia das M\xE3es"],[/\bdia dos pais\b/gi,"Dia dos Pais"],[/\bhamburguer\b/gi,"hamb\xFArguer"],[/\bhamburguers\b/gi,"hamb\xFArgueres"],[/\blancamento\b/gi,"lan\xE7amento"],[/\bcolecao\b/gi,"cole\xE7\xE3o"],[/\bvideo\b/gi,"v\xEDdeo"],[/\bsabado\b/gi,"s\xE1bado"],[/\bpromocoes\b/gi,"promo\xE7\xF5es"]],st=e=>e.toLowerCase().replace(/[.,:;!]+$/,"");function nt(e){let t=String(e||"").replace(/\s+/g," ").trim();if(!t)return t;let s=t.split(" ");for(;s.length>1&&at.has(st(s[0]));)s.shift();if(t=s.join(" ").replace(/\s+(no|pro|pra|para o)\s+(instagram|insta|ig|feed)\s*$/i,"").trim(),at.has(st(t)))return ot(String(e).trim());for(let[o,a]of _t)t=t.replace(o,a);return ot(t)}var ot=e=>e&&e.charAt(0).toLocaleUpperCase("pt-BR")+e.slice(1);var Et=[[/pura vida|hortifruti|jg garcia/i,"hortifruti: frutas, verduras e legumes frescos"],[/bbq|burger|hamb/i,"hamburgueria e churrasco (BBQ)"],[/multimarcas|moda|roupa/i,"loja de roupas multimarcas"],[/festa/i,"loja de artigos e decora\xE7\xE3o de festas"]];function Ie(e){if(e?.niche)return e.niche;let t=Et.find(([s])=>s.test(e?.name||""));return t?t[1]:""}function St(){let e=S();return l.state.companies.map(t=>{let s=l.state.events.filter(i=>i.companyId===t.id&&b[i.type]?.kind==="post"),o=s.filter(i=>i.date<=e&&(i.status==="feito"||i.date<e)).map(i=>i.date).sort(),a=s.filter(i=>i.date>=e&&i.status!=="feito").map(i=>i.date).sort(),n=o[o.length-1]||"";return{name:t.name,niche:Ie(t)||"pequena empresa local",lastPost:n,nextPost:a[0]||"",daysSincePost:n?Pe(n,e):null}})}var it=null,rt="";function ma(){l.mode!=="cloud"||!pe()||!l.ready||(clearTimeout(it),it=setTimeout(()=>{let e=St(),t=JSON.stringify(e);t!==rt&&ke("/coach",{companies:e}).then(()=>rt=t).catch(()=>{})},4e3))}var ua=()=>ke("/coach-test",{});function _a(){let e=l.companiesSorted(),t=S(),s=qe(t),o=T(s,6);return`
  <header class="hdr">
    <div class="hdr__row">
      <div class="hdr__titles"><p class="hdr__eyebrow">${e.length} cliente${e.length===1?"":"s"}</p><h1>Empresas</h1></div>
      <div class="hdr__actions"><button class="btn btn--primary btn--sm" data-action="new-company">${f("plus",16)} Nova</button></div>
    </div>
  </header>
  <div class="page">
    ${e.length?"":Ee("Nenhuma empresa ainda","Cadastre os clientes com nome, cor e logomarca. Cada um ganha um link pr\xF3prio para ver s\xF3 o seu cronograma.",`<button class="btn btn--primary" data-action="new-company">${f("plus",18)} Cadastrar empresa</button>`)}
    <div class="colist">
      ${e.map(a=>{let n=l.eventsBetween(s,o,{companyId:a.id}),i=n.filter(r=>E(r.type)).length,p=n.filter(r=>r.type==="captacao").length,c=l.state.events.filter(r=>r.companyId===a.id&&r.date>=t&&r.status!=="feito").sort((r,u)=>(r.date+r.time).localeCompare(u.date+u.time))[0];return`<button class="cocard" style="--cc:${a.color};--cc-soft:${F(a.color,.1)}" data-action="open-company" data-id="${a.id}">
          <div class="cocard__top">
            ${D(a,48)}
            <div class="cocard__name"><strong>${m(a.name)}</strong>${a.instagram?`<small>${f("insta",12)} @${m(a.instagram)}</small>`:""}</div>
            ${f("right",18,"muted")}
          </div>
          <div class="cocard__stats">
            <span><b>${i}</b> posts</span><span><b>${p}</b> capta\xE7${p===1?"\xE3o":"\xF5es"}</span><span class="muted">nesta semana</span>
          </div>
          ${c?`<div class="cocard__next">${f(b[c.type].icon,14)} <b>${m(X(c.date))}${c.time?" "+c.time:""}</b> \xB7 ${m(b[c.type].label)} \u2014 ${m(c.title||"")}</div>`:'<div class="cocard__next muted">Nada agendado</div>'}
        </button>`}).join("")}
    </div>
  </div>`}function Ea(e){let t=q({className:"sheet--tall",html:lt(e),onMount:s=>Tt(s,e)});t.refresh=()=>l.company(e)?t.set(lt(e)):t.close()}function lt(e){let t=l.company(e);if(!t)return"";let s=S(),o=le(s),a=l.eventsBetween(`${o}-01`,`${o}-31`,{companyId:e}),n=l.eventsBetween(s,T(s,30),{companyId:e}),i=l.eventsBetween(T(s,-14),T(s,-1),{companyId:e}).reverse(),p=v=>a.filter(g=>v.includes(g.type)).length,c=a.filter(v=>v.status==="feito").length,r="",u=n.map(v=>{let g=v.date!==r?`<h4 class="dayhead">${m(Z(v.date))}</h4>`:"";return r=v.date,g+_e(v)}).join("");return`
  ${H("",{right:l.canEdit("companies",t)?'<button class="btn-text" data-act="edit">Editar</button>':""})}
  <div class="cohero" style="--cc:${t.color};--cc-soft:${F(t.color,.14)}">
    ${D(t,72,20)}
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
      <h2 class="block__title">${m(Re(o))}</h2>
      <div class="mstats mstats--5">
        <div><b>${p(["feed","carrossel"])}</b><span>feed</span></div>
        <div><b>${p(["reels"])}</b><span>reels</span></div>
        <div><b>${p(["story"])}</b><span>stories</span></div>
        <div><b>${p(["captacao"])}</b><span>capta\xE7\xF5es</span></div>
        <div><b>${a.length?Math.round(c/a.length*100):0}%</b><span>feito</span></div>
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

    ${i.length?`<section class="block">
      <h2 class="block__title">\xDAltimas 2 semanas</h2>
      ${i.map(v=>_e(v,{showDate:!0,compact:!0})).join("")}
    </section>`:""}
  </div>`}function Tt(e,t){let s=e.el;(s.querySelector('[data-act="edit"]')||{}).onclick=()=>Ce(t),s.querySelector('[data-act="new"]').onclick=async()=>{let{openEventEditor:o}=await import("./c-YX2II257.js");o({companyId:t})},s.querySelector('[data-act="share"]').onclick=()=>Ae(t),s.querySelector('[data-act="clientview"]').onclick=()=>Mt(t)}function Ce(e=null,t=null){let s=e?l.company(e):null,o=l.state.companies.map(p=>p.color),a=s?{...s}:{id:R("c_"),name:"",color:de.find(p=>!o.includes(p))||de[0],logo:null,instagram:"",address:"",contact:"",notes:"",shareToken:null},n=()=>`
    ${H(s?"Editar empresa":"Nova empresa",{left:'<button class="btn-text" data-close>Cancelar</button>',right:'<button class="btn btn--primary btn--sm" data-save>Salvar</button>'})}
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
        <label class="flabel" for="c-niche">O que a empresa faz (para as dicas)</label>
        <input id="c-niche" class="input" name="niche" value="${m(a.niche||Ie(a))}" placeholder="Ex.: hamburgueria artesanal, loja de roupas femininas" autocomplete="off" maxlength="160">
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
    </form>`,i=p=>{let c=p.el,r=c.querySelector("form"),u=()=>{a.name=r.name.value.trim(),a.instagram=r.instagram.value.trim().replace(/^@/,""),a.niche=r.niche.value.trim(),a.address=r.address.value.trim(),a.contact=r.contact.value.trim(),a.notes=r.notes.value.trim()},v=()=>c.querySelector("[data-preview]").innerHTML=D({...a,name:r.name.value||"?"},88,24);r.name.addEventListener("input",v),c.querySelectorAll("[data-color]").forEach(k=>k.onclick=()=>{a.color=k.dataset.color,c.querySelectorAll("[data-color]").forEach(d=>d.classList.toggle("is-on",d===k)),v()}),c.querySelector("[data-customcolor]").oninput=k=>{a.color=k.target.value,c.querySelectorAll("[data-color]").forEach(d=>d.classList.remove("is-on")),v()},c.querySelector("[data-file]").onchange=async k=>{let d=k.target.files[0];if(d)try{u(),a.logo=await Ue(d,160),p.set(n())}catch{_("N\xE3o foi poss\xEDvel ler essa imagem")}};let g=c.querySelector("[data-rmlogo]");g&&(g.onclick=()=>{u(),a.logo=null,p.set(n())});let I=c.querySelector("[data-delete]");I&&(I.onclick=async()=>{let k=l.state.events.filter(h=>h.companyId===a.id);await U({title:`Excluir ${a.name}?`,text:k.length?`Os ${k.length} eventos desta empresa tamb\xE9m ser\xE3o apagados e o link do cliente deixar\xE1 de funcionar.`:"O link do cliente deixar\xE1 de funcionar.",ok:"Excluir empresa",danger:!0})&&(await l.removeMany("events",k.map(h=>h.id)),await l.remove("companies",a.id),p.close(),_("Empresa exclu\xEDda"))}),c.querySelector("[data-save]").onclick=async()=>{if(u(),!a.name)return r.name.focus(),_("Digite o nome da empresa");await l.upsert("companies",{...a}),p.close(),_(s?"Empresa atualizada":"Empresa cadastrada"),t&&t(l.company(a.id))}};q({className:"sheet--tall",html:n(),onMount:i})}async function Ae(e){let t=l.company(e),s=l.mode==="cloud",o="";s?(await l.ensureShareToken(t),await l.publishCompany(e),o=Ve(l.company(e).shareToken)):o=Ye(await Ge(ge(t,l.state.events,{maxFuture:90})));let a=`
    ${H("Link do cliente")}
    <div class="share">
      <div class="share__co">${D(t,56)}<div><strong>${m(t.name)}</strong><small>v\xEA somente o pr\xF3prio cronograma</small></div></div>
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
    </div>`;q({html:a,onMount:n=>{let i=n.el;i.querySelector("[data-copy]").onclick=async()=>{try{await navigator.clipboard.writeText(o),_("Link copiado")}catch{i.querySelector("[data-link]").select(),_("Selecione e copie o link")}},i.querySelector("[data-sharebtn]").onclick=async()=>{let c=`Ol\xE1! Este \xE9 o cronograma de conte\xFAdo da ${t.name}. Por aqui voc\xEAs acompanham tudo o que est\xE1 planejado: posts, stories, reels e capta\xE7\xF5es.`;if(navigator.share)try{await navigator.share({title:`Cronograma \xB7 ${t.name}`,text:c,url:o})}catch{}else await navigator.clipboard?.writeText(`${c}
${o}`),_("Mensagem copiada")};let p=i.querySelector("[data-revoke]");p&&(p.onclick=async()=>{await U({title:"Gerar um novo link?",text:"Quem tiver o link antigo n\xE3o conseguir\xE1 mais ver o cronograma.",ok:"Gerar novo link",danger:!0})&&(await l.regenerateShareToken(l.company(e)),n.close(),Ae(e))})}})}async function Mt(e){let t=l.company(e);if(!t)return;let{showClient:s}=await import("./c-3ZGAM64U.js"),{sanitizePayload:o}=await import("./c-U2ROPY3W.js"),a=o(ge(t,l.state.events)),n=document.createElement("div");n.className="client-preview",n.innerHTML=`<div class="client-preview__bar"><button class="btn btn--soft btn--sm" data-closepv>${f("left",16)} Voltar</button><span>Assim o cliente v\xEA</span><button class="btn btn--primary btn--sm" data-sendpv>${f("share",16)} Enviar</button></div><div class="client-preview__body"></div>`,document.body.appendChild(n),document.body.classList.add("has-sheet"),s(n.querySelector(".client-preview__body"),a,{canGoBack:!1,preview:!0});let i=()=>{n.remove(),document.body.classList.toggle("has-sheet",!!document.querySelector(".sheet-wrap"))};n.querySelector("[data-closepv]").onclick=i,n.querySelector("[data-sendpv]").onclick=()=>{i(),Ae(e)}}function Ha(e){let t=q({html:ct(e),className:"sheet--tall",onMount:s=>It(s,e)});t.refresh=()=>{if(!l.event(e))return t.close();t.set(ct(e))}}function ct(e){let t=l.event(e);if(!t)return"";let s=l.company(t.companyId),o=s?.color||"#666",a=ye.find(c=>c.v===(t.reminder??30)),n=t.seriesId?l.state.events.filter(c=>c.seriesId===t.seriesId).length:0,i=l.canEdit("events",t),p=l.member(l.ownerOf("events",t))?.name||"o parceiro";return`
  ${H("",{right:i?'<button class="btn-text" data-act="edit">Editar</button>':""})}
  <div class="detail">
    <div class="detail__hero" style="--cc:${o};--cc-soft:${F(o,.12)}">
      <div class="detail__co">${D(s,40)}<div><strong>${m(s?.name||"Sem empresa")}</strong>${s?.instagram?`<small>@${m(s.instagram)}</small>`:""}</div>${xe(t.type,{solid:!0})}</div>
      <h2><span class="pfrow">${fe(t,24)}</span>${m(t.title||b[t.type].label)}</h2>
      <p class="detail__when">${f("calendar",15)} ${m(X(t.date))}, ${m(Be(t.date).split(", ")[1])} \xB7 ${f("clock",15)} ${m(Qe(t))}</p>
    </div>

    ${i?"":`<p class="detail__lock">${f("eye",14)} Cadastrado por ${m(p)} \u2014 voc\xEA s\xF3 pode ver. Use \u201CDuplicar\u201D para criar uma c\xF3pia sua.</p>`}
    <div class="seg seg--status"${i?"":" hidden"}>
      ${$e.map(c=>`<button class="seg__btn${t.status===c?" is-on":""} st-${c}" data-status="${c}">${c==="feito"?f("check",14):""}${ce[c].label}</button>`).join("")}
    </div>

    <ul class="rows">
      <li><span class="rows__k">${f("users",16)} Respons\xE1vel</span><span class="rows__v">${(t.assignees||[]).map(c=>z(c,22)).join("")} ${m(ae(t.assignees))}</span></li>
      ${t.location?`<li><span class="rows__k">${f("pin",16)} Local</span><a class="rows__v link" href="https://maps.apple.com/?q=${encodeURIComponent(t.location)}" target="_blank" rel="noopener">${m(t.location)}</a></li>`:""}
      ${b[t.type].kind!=="post"||t.duration?`<li><span class="rows__k">${f("clock",16)} Dura\xE7\xE3o</span><span class="rows__v">${m(J(M(t)))}</span></li>`:""}
      <li><span class="rows__k">${f("bell",16)} Lembrete</span><span class="rows__v">${m(a?.label||"\u2014")}</span></li>
      ${n?`<li><span class="rows__k">${f("repeat",16)} Repeti\xE7\xE3o</span><span class="rows__v">${n} eventos na s\xE9rie</span></li>`:""}
      <li><span class="rows__k">${f(t.visibleToClient===!1?"eyeoff":"eye",16)} Cliente</span><span class="rows__v">${t.visibleToClient===!1?"N\xE3o aparece para o cliente":"Aparece no calend\xE1rio do cliente"}</span></li>
    </ul>

    ${t.description?`<div class="textbox"><h4>Descri\xE7\xE3o / legenda</h4><p>${m(t.description)}</p></div>`:""}
    ${t.internalNote?`<div class="textbox textbox--note"><h4>${f("eyeoff",13)} Nota interna (s\xF3 a equipe v\xEA)</h4><p>${m(t.internalNote)}</p></div>`:""}

    <div class="actions">
      <button data-act="ics">${f("bell",20)}<span>Lembrete no iPhone</span></button>
      ${i?`<button data-act="tomorrow">${f("right",20)}<span>Passar p/ amanh\xE3</span></button>`:""}
      <button data-act="dup">${f("copy",20)}<span>Duplicar</span></button>
      ${i?`<button data-act="del" class="is-danger">${f("trash",20)}<span>Excluir</span></button>`:""}
    </div>
    <p class="detail__meta">Criado por ${m(l.member(t.createdBy)?.name||"\u2014")}${t.updatedAt?" \xB7 atualizado "+new Date(t.updatedAt).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):""}</p>
  </div>`}function It(e,t){let s=e.el;s.querySelectorAll("[data-status]").forEach(a=>a.onclick=async()=>{let n=l.event(t);await l.upsert("events",{...n,status:a.dataset.status})});let o=(a,n)=>{let i=s.querySelector(`[data-act="${a}"]`);i&&(i.onclick=n)};o("edit",()=>dt({id:t})),o("dup",async()=>{let n={...l.event(t),id:R("e_"),status:"pendente",seriesId:null,createdAt:null,createdBy:null};await l.upsert("events",n),e.close(),_("Evento duplicado"),dt({id:n.id})}),o("tomorrow",async()=>{let a=l.event(t);await Dt(a,{date:T(a.date,1)})&&(await l.upsert("events",{...a,date:T(a.date,1)}),_("Movido para "+X(T(a.date,1)).toLowerCase(),{action:"Desfazer",onAction:()=>l.upsert("events",{...l.event(t),date:a.date})}))}),o("ics",()=>{let a=l.event(t);tt([a],`${b[a.type].label}-${a.date}.ics`,re.appName)}),o("del",()=>mt(t,e))}async function mt(e,t){let s=l.event(e),o=[e];if(s.seriesId){let n=l.state.events.filter(i=>i.seriesId===s.seriesId&&i.date>=s.date).map(i=>i.id);if(n.length>1){let i=await K({title:"Excluir evento repetido",options:[{label:"S\xF3 este",value:"one",danger:!0},{label:`Este e os pr\xF3ximos (${n.length})`,value:"next",danger:!0}]});if(!i)return;i==="next"&&(o=n)}else if(!await U({title:"Excluir este evento?",ok:"Excluir",danger:!0}))return}else if(!await U({title:"Excluir este evento?",text:"Ele some para a dupla e para o cliente.",ok:"Excluir",danger:!0}))return;let a=o.map(n=>({...l.event(n)}));await l.removeMany("events",o),t&&t.close(),_(o.length>1?`${o.length} eventos exclu\xEDdos`:"Evento exclu\xEDdo",{action:"Desfazer",onAction:()=>l.upsertMany("events",a),ms:4500})}function dt({id:e=null,date:t=null,companyId:s=null,type:o=null,time:a=null,assignees:n=null}={}){let i=e?l.event(e):null;if(i&&!l.canEdit("events",i)){l._denied("events",i);return}let p=l.companiesSorted(),c=o||"feed",r=i?JSON.parse(JSON.stringify(i)):{id:R("e_"),type:c,companyId:s||N.monthCompany||(p.length===1?p[0].id:null),title:"",date:t||(N.tab==="mes"?N.monthSel:N.date)||S(),time:a||b[c].best[0]||"12:00",duration:["shoot","meeting","work","other"].includes(b[c].kind)?b[c].dur:null,assignees:n||(N.person!=="all"?[N.person]:l.me?[l.me]:[]),location:"",description:"",internalNote:"",reminder:30,visibleToClient:b[c].client,status:"pendente"},u=i?JSON.parse(JSON.stringify(i)):null,v={mode:"none",until:T(r.date,28)};return q({className:"sheet--tall",html:ut(r,!!i,v),onMount:I=>Ct(I,r,u,v)})}function De(e,t){let s=(e.assignees||[]).includes(t.id);return e.notifyPartner===!1?s?`Sem aviso agora. Como ${t.name} \xE9 respons\xE1vel, ele ainda recebe os lembretes do hor\xE1rio.`:`${t.name} n\xE3o recebe aviso nem lembretes deste evento. Fica s\xF3 na agenda.`:`${t.name} recebe o aviso de que voc\xEA marcou e os lembretes do hor\xE1rio.`}var be=e=>["shoot","meeting","work","other"].includes(b[e].kind),ie=e=>["shoot","meeting"].includes(b[e].kind);function ut(e,t,s){let o=l.companiesSorted();return`
  ${H(t?"Editar evento":"Novo evento",{left:'<button class="btn-text" data-close>Cancelar</button>',right:'<button class="btn btn--primary btn--sm" data-save>Salvar</button>'})}
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
        ${o.map(a=>`<button type="button" class="cobtn${e.companyId===a.id?" is-on":""}" style="--cc:${a.color}" data-company="${a.id}">${D(a,26,7)}<span>${m(a.name)}</span></button>`).join("")}
        <button type="button" class="cobtn cobtn--add" data-newco>${f("plus",18)}<span>Nova empresa</span></button>
      </div>
    </div>

    <div class="fgroup" data-when="net" ${b[e.type].kind==="post"?"":"hidden"}>
      <label class="flabel">Onde vai postar?</label>
      <div class="netgrid">${Ke.map(a=>{let n=ue(a);return n?`<button type="button" class="netbtn${(e.platform||"instagram")===a?" is-on":""}" data-net="${a}"><span class="pf" style="width:22px;height:22px">${n.svg}</span><span>${m(n.name.replace(" (Twitter)",""))}</span></button>`:""}).join("")}</div>
    </div>

    <div class="fgroup">
      <label class="flabel" for="f-title">T\xEDtulo</label>
      <input id="f-title" class="input" name="title" value="${m(e.title)}" placeholder="${m(b[e.type].placeholder)}" autocomplete="off" maxlength="120">
    </div>

    <div class="fgroup row2">
      <div><label class="flabel" for="f-date">Dia</label><input id="f-date" class="input" type="date" name="date" value="${e.date}" required></div>
      <div><label class="flabel" for="f-time">Hor\xE1rio</label><input id="f-time" class="input" type="time" name="time" value="${e.time||""}" step="300"></div>
    </div>

    <div class="fgroup" data-when="duration" ${be(e.type)?"":"hidden"}>
      <label class="flabel" for="f-dur">Dura\xE7\xE3o</label>
      <select id="f-dur" class="input" name="duration">
        ${ze.map(a=>`<option value="${a}"${(e.duration||b[e.type].dur)===a?" selected":""}>${J(a)}</option>`).join("")}
      </select>
    </div>

    <div data-hint></div>

    <div class="fgroup">
      <label class="flabel">Quem vai fazer?</label>
      <div class="whogrid">
        ${l.team.map(a=>`<button type="button" class="whobtn${(e.assignees||[]).includes(a.id)?" is-on":""}" style="--mc:${a.color}" data-who="${a.id}">${z(a.id,30)}<span>${m(a.name)}</span><i class="whobtn__check">${f("check",14)}</i></button>`).join("")}
      </div>
      <p class="fhelp">Marque os dois se forem juntos.</p>
      ${l.team.filter(a=>a.id!==l.me).map(a=>`<label class="list__row notifyrow"><span><b>${f("bell",15)} Avisar ${a.name==="Matheus"||a.name==="Henrique"?"o ":""}${m(a.name)}</b><small data-notifyhelp>${De(e,a)}</small></span><input type="checkbox" class="switch" name="notifyPartner" ${e.notifyPartner!==!1?"checked":""}></label>`).join("")}
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
  </form>`}function Ct(e,t,s,o){let a=e.el,n=a.querySelector("[data-editor]"),i=d=>a.querySelector(d),p=()=>{let d=i("[data-hint]");d.innerHTML=Nt(t,!s),d.querySelectorAll("[data-settime]").forEach(h=>h.onclick=()=>{t.time=h.dataset.settime,n.time.value=t.time,p()}),d.querySelectorAll("[data-setwho]").forEach(h=>h.onclick=()=>{t.assignees=[h.dataset.setwho],a.querySelectorAll("[data-who]").forEach(y=>y.classList.toggle("is-on",t.assignees.includes(y.dataset.who))),p()})},c=()=>{a.querySelector('[data-when="duration"]').hidden=!be(t.type);let d=a.querySelector('[data-when="net"]');d&&(d.hidden=b[t.type].kind!=="post"),a.querySelector('[data-when="location"]').hidden=!ie(t.type);let h=l.company(t.companyId),y=i("[data-useaddr]");y.hidden=!(h&&h.address&&n.location.value!==h.address);let O=a.querySelector('[data-when="until"]');O&&(O.hidden=o.mode==="none")};a.querySelectorAll("[data-type]").forEach(d=>d.onclick=()=>{let h=t.type;if(t.type=d.dataset.type,a.querySelectorAll("[data-type]").forEach(y=>y.classList.toggle("is-on",y===d)),n.title.placeholder=b[t.type].placeholder,(!s||h!==t.type)&&(t.duration=be(t.type)?b[t.type].dur:null,n.duration.value=String(b[t.type].dur),s||(t.visibleToClient=b[t.type].client,n.visibleToClient.checked=t.visibleToClient)),ie(t.type)&&!n.location.value){let y=l.company(t.companyId);y?.address&&(n.location.value=y.address,t.location=y.address)}c(),p()}),a.querySelectorAll("[data-company]").forEach(d=>d.onclick=()=>{t.companyId=d.dataset.company,a.querySelectorAll("[data-company]").forEach(y=>y.classList.toggle("is-on",y===d));let h=l.company(t.companyId);ie(t.type)&&h?.address&&!n.location.value&&(n.location.value=h.address,t.location=h.address),c()}),i("[data-newco]").onclick=()=>{Ce(null,d=>{t.companyId=d.id,u(),e.set(ut(t,!!s,o))})},a.querySelectorAll("[data-who]").forEach(d=>d.onclick=()=>{let h=d.dataset.who;t.assignees=t.assignees.includes(h)?t.assignees.filter(x=>x!==h):[...t.assignees,h],d.classList.toggle("is-on",t.assignees.includes(h)),p();let y=a.querySelector("[data-notifyhelp]"),O=l.team.find(x=>x.id!==l.me);y&&O&&(y.textContent=De(t,O))});let r=a.querySelector('input[name="notifyPartner"]');r&&(r.onchange=()=>{t.notifyPartner=r.checked;let d=a.querySelector("[data-notifyhelp]"),h=l.team.find(y=>y.id!==l.me);d&&h&&(d.textContent=De(t,h))}),i("[data-useaddr]").onclick=()=>{let d=l.company(t.companyId);n.location.value=d.address,t.location=d.address,c()},a.querySelectorAll("[data-net]").forEach(d=>d.onclick=()=>{t.platform=d.dataset.net,a.querySelectorAll("[data-net]").forEach(h=>h.classList.toggle("is-on",h===d))});let u=()=>{t.title=nt(n.title.value.trim()),b[t.type].kind==="post"&&!t.platform&&(t.platform="instagram"),b[t.type].kind!=="post"&&(t.platform=null),t.date=n.date.value,t.time=n.time.value||"",t.duration=be(t.type)?Number(n.duration.value):null,t.location=ie(t.type)?n.location.value.trim():"",t.description=n.description.value.trim(),t.internalNote=n.internalNote.value.trim(),t.reminder=Number(n.reminder.value),t.visibleToClient=n.visibleToClient.checked,n.status&&(t.status=n.status.value),n.repeat&&(o.mode=n.repeat.value),n.until&&(o.until=n.until.value)};n.addEventListener("input",()=>{u(),c()}),n.addEventListener("change",()=>{u(),c(),p()});let v=i("[data-delete]");v&&(v.onclick=()=>mt(t.id,null).then(()=>!l.event(t.id)&&e.close())),i("[data-save]").onclick=async()=>{if(u(),!g){if(!t.companyId){_("Escolha a empresa"),a.querySelector(".cogrid").scrollIntoView({behavior:"smooth",block:"center"});return}if(!t.date)return _("Escolha o dia");if(!(!t.assignees.length&&!await U({title:"Ningu\xE9m respons\xE1vel?",text:"Este evento ficar\xE1 sem respons\xE1vel. Deseja salvar assim mesmo?",ok:"Salvar assim"}))&&!g){g=!0;try{await I()}finally{g=!1}}}};let g=!1,I=async()=>{if(s){if(["date","time","duration","type","assignees","companyId"].some(h=>JSON.stringify(t[h])!==JSON.stringify(s[h]))&&!await Le(t,!1,e,k))return;await qt(t,s)}else if(o.mode!=="none"){let d=Lt(t.date,o),h=d.filter(x=>oe({...t,date:x},{isNew:!0}).some(A=>A.level==="block")),y=d;if(h.length){let x=await K({title:`${h.length} de ${d.length} datas j\xE1 t\xEAm compromisso nesse hor\xE1rio`,text:h.slice(0,6).map(A=>Z(A)).join(" \xB7 ")+(h.length>6?" \u2026":""),options:[{label:`Criar s\xF3 nas ${d.length-h.length} datas livres`,value:"free",primary:!0},{label:"Criar em todas mesmo assim",value:"all"}]});if(!x)return;if(x==="free"&&(y=d.filter(A=>!h.includes(A))),!y.length)return _("Nenhuma data livre")}let O=R("s_");await l.upsertMany("events",y.map((x,A)=>({...t,id:A===0?t.id:R("e_"),date:x,seriesId:O})),{activity:{notifyPartner:t.notifyPartner,kind:"series",count:y.length,label:`${b[t.type].label} ${we.find(x=>x.v===o.mode)?.label.toLowerCase()||""} \xE0s ${w(t.time)}`,sample:{companyId:t.companyId,date:y[0]}}}),_(`${y.length} eventos criados`)}else{if(!await Le(t,!0,e,k))return;await l.upsert("events",{...t}),_("Evento salvo")}e.close()};function k(){n.time.value=t.time||"",n.date.value=t.date,a.querySelectorAll("[data-who]").forEach(d=>d.classList.toggle("is-on",t.assignees.includes(d.dataset.who))),c(),p()}c(),p()}var Ne=420,pt=1380,j=e=>(Math.min(Math.max(e,Ne),pt)-Ne)/(pt-Ne)*100;function At(e,t){let s=e.time?L(e):null,o=[8,10,12,14,16,18,20,22];return`<div class="lanes">
    <div class="lanes__head"><strong>Agenda dos dois em ${m(Z(e.date))}</strong></div>
    ${l.team.map(a=>{let n=l.eventsOn(e.date,{person:a.id}).filter(c=>c.id!==e.id&&c.time),i=(e.assignees||[]).includes(a.id),p=t.some(c=>c.level==="block"&&c.person===a.id);return`<div class="lane">
        <span class="lane__who">${z(a.id,22)}</span>
        <div class="lane__track">
          ${o.map(c=>`<i class="lane__tick" style="left:${j(c*60)}%"></i>`).join("")}
          ${n.map(c=>{let r=L(c),u=l.company(c.companyId);return`<span class="lane__ev" style="left:${j(r[0])}%;width:max(4px,${j(r[1])-j(r[0])}%);background:${u?.color||"#888"}" title="${m(V(c))}"></span>`}).join("")}
          ${s&&i?`<span class="lane__draft${p?" is-clash":""}" style="left:${j(s[0])}%;width:max(6px,${j(s[1])-j(s[0])}%)"></span>`:""}
        </div>
      </div>`}).join("")}
    <div class="lane lane--axis"><span class="lane__who"></span><div class="lane__track">${o.map(a=>`<small style="left:${j(a*60)}%">${a}h</small>`).join("")}</div></div>
  </div>`}function Nt(e,t){if(!e.date)return"";let s=oe(e,{isNew:t}),o=s.filter(g=>g.level==="block"),a=s.filter(g=>g.level==="warn"),n=s.filter(g=>g.level==="info"),i=he(e,{limit:4}),p=ve(e),c=(e.assignees||[]).length===1?e.assignees[0]:null,r=o.length&&c?l.team.find(g=>g.id!==c&&p.includes(g.id)):null,u=b[e.type],v=g=>`<li class="issue issue--${g.level}">${f(g.level==="block"?"alert":g.level==="warn"?"flag":g.code==="partner"?"user":"bulb",15)}<div><strong>${m(g.title)}</strong><p>${m(g.text)}</p></div></li>`;return`
  <section class="assist">
    <header class="assist__head">${f("sparkle",16)} Assistente</header>
    ${At(e,s)}
    ${s.length?`<ul class="issues">${[...o,...a,...n].map(v).join("")}</ul>`:e.time?`<p class="assist__ok">${f("check",15)} Hor\xE1rio livre para ${m(ae(e.assignees))}, sem conflitos.</p>`:""}
    ${r?`<button type="button" class="tchip tchip--wide" data-setwho="${r.id}">${z(r.id,18)} Passar para ${m(r.name)} (est\xE1 livre)</button>`:""}
    <div class="assist__sugg">
      <p>${m(u.tip)}</p>
      ${i.length?`<div class="hintbox__times">${i.map(g=>`<button type="button" class="tchip${e.time===g.time?" is-on":""}" data-settime="${g.time}">${w(g.time)}${g.peak?"<small>pico</small>":"<small>livre</small>"}</button>`).join("")}</div>`:`<p class="muted">Nenhum hor\xE1rio livre nesse dia${(e.assignees||[]).length?" para "+m(ae(e.assignees)):""}. Tente outro dia ou outra pessoa.</p>`}
    </div>
  </section>`}async function Le(e,t,s,o){let n=oe(e,{isNew:t}).filter(v=>v.level==="block");if(!n.length)return!0;let i=he(e,{limit:2}),p=(e.assignees||[]).length===1?e.assignees[0]:null,c=p&&l.team.find(v=>v.id!==p&&ve(e).includes(v.id)),r=[...i.map(v=>({label:`Mudar para ${w(v.time)} (livre)`,value:"time:"+v.time,primary:!0})),...c?[{label:`Passar para ${c.name} (est\xE1 livre)`,value:"who:"+c.id,primary:!i.length}]:[],{label:"Marcar mesmo assim",value:"force"}],u=await K({title:n[0].code==="duplicate"?"Isso j\xE1 est\xE1 na agenda":"J\xE1 tem compromisso nesse hor\xE1rio",bodyHtml:`<ul class="issues issues--dialog">${n.map(v=>`<li class="issue issue--block">${f("alert",15)}<div><strong>${m(v.title)}</strong><p>${m(v.text)}</p></div></li>`).join("")}</ul>`,options:r});return u?u==="force"?!0:(u.startsWith("time:")&&(e.time=u.slice(5)),u.startsWith("who:")&&(e.assignees=[u.slice(4)]),o(),Le(e,t,s,o)):!1}async function Dt(e,t){let s={...e,...t},o=oe(s).filter(n=>n.level==="block");return o.length?await K({title:"J\xE1 tem compromisso nesse hor\xE1rio",bodyHtml:`<ul class="issues issues--dialog">${o.map(n=>`<li class="issue issue--block">${f("alert",15)}<div><strong>${m(n.title)}</strong><p>${m(n.text)}</p></div></li>`).join("")}</ul>`,options:[{label:"Mover mesmo assim",value:"force",primary:!0}]})==="force":!0}function Lt(e,t){let s=[],o=e,a=t.until&&t.until>=e?t.until:T(e,28);for(;o<=a&&s.length<150;){let n=B(o).getDay();(t.mode==="daily"||t.mode==="weekdays"&&n>=1&&n<=5||t.mode==="weekly"&&B(o).getDay()===B(e).getDay())&&s.push(o),o=T(o,1)}return s}var Ot=["type","companyId","title","time","duration","assignees","location","description","internalNote","reminder","visibleToClient"];async function qt(e,t){let s=Ot.filter(o=>JSON.stringify(e[o])!==JSON.stringify(t[o]));if(e.seriesId&&s.length){let o=l.state.events.filter(a=>a.seriesId===e.seriesId&&a.date>t.date);if(o.length){let a=await K({title:"Evento repetido",text:"Aplicar as altera\xE7\xF5es a quais eventos?",options:[{label:"S\xF3 a este",value:"one",primary:!0},{label:`A este e aos pr\xF3ximos (${o.length+1})`,value:"next"}]});if(!a)return;if(a==="next"){let n=Object.fromEntries(s.map(i=>[i,e[i]]));await l.upsertMany("events",[{...e},...o.map(i=>({...i,...n}))],{activity:{kind:"series-edit",count:o.length+1,label:`${b[e.type].label} \xB7 a partir de ${e.date.slice(8)}/${e.date.slice(5,7)}`,sample:{companyId:e.companyId,date:e.date}}}),_("S\xE9rie atualizada");return}}}await l.upsert("events",{...e}),_("Altera\xE7\xF5es salvas")}export{ma as a,ua as b,nt as c,z as d,bt as e,D as f,_e as g,Ee as h,q as i,Jt as j,H as k,_ as l,U as m,K as n,N as o,jt as p,Me as q,L as r,V as s,he as t,$t as u,Xt as v,Zt as w,tt as x,Ha as y,dt as z,Dt as A,_a as B,Ea as C,Ce as D};
