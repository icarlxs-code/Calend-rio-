import{a as me,b as je,d as Pe,e as Re,f as c,i as He}from"./c-5UDHGMRO.js";import{a as f}from"./c-SMTRSMWP.js";import{A as u,B as Le,C as R,D as Oe,F as qe,b as j,c as _,d as E,e as Ce,f as ne,i as y,j as O,k as K,l as w,m as Ae,q as Ne,s as De,t as W,u as Q,v as V,y as P}from"./c-UWUJNFLO.js";import{a as b,b as Be,c as x,d as I,e as ie,f as fe,h as le,i as Fe,j as ve,k as he}from"./c-3GA6RSWB.js";import{a as oe}from"./c-W6W2IM5K.js";var Ue=(()=>{try{return JSON.parse(localStorage.getItem("pauta.ui")||"{}")}catch{return{}}})(),D={tab:Ue.tab||"hoje",person:Ue.person||"all",date:_(),month:ne(_()),monthSel:_(),monthCompany:null,showAllTips:!1};function kt(){try{localStorage.setItem("pauta.ui",JSON.stringify({tab:D.tab,person:D.person}))}catch{}}var T=(e,t,s="#fff")=>`<svg viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="6" fill="${e}"/><g fill="none" stroke="${s}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${t}</g></svg>`,at="url(#pf-ig)",$e=[{id:"instagram",name:"Instagram",words:["instagram","insta"," ig ","feed","reels","reel","carrossel"],svg:`<svg viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="pf-ig" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#FEDA75"/><stop offset=".35" stop-color="#FA7E1E"/><stop offset=".6" stop-color="#D62976"/><stop offset="1" stop-color="#4F5BD5"/></linearGradient></defs><rect width="24" height="24" rx="6" fill="${at}"/><g fill="none" stroke="#fff" stroke-width="1.9"><rect x="5" y="5" width="14" height="14" rx="4"/><circle cx="12" cy="12" r="3.3"/></g><circle cx="16.3" cy="7.7" r="1" fill="#fff"/></svg>`},{id:"tiktok",name:"TikTok",words:["tiktok","tik tok","tik-tok"],svg:T("#000",'<path d="M13 5v9.5a3 3 0 1 1-3-3" stroke="#25F4EE" transform="translate(-.7 -.5)"/><path d="M13 5v9.5a3 3 0 1 1-3-3" stroke="#FE2C55" transform="translate(.7 .5)"/><path d="M13 5v9.5a3 3 0 1 1-3-3M13 5c.4 2.2 1.8 3.6 4 3.8"/>')},{id:"youtube",name:"YouTube",words:["youtube","you tube","shorts"," yt "],svg:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="6" fill="#FF0000"/><path d="M10 8.5v7l6-3.5z" fill="#fff"/></svg>'},{id:"facebook",name:"Facebook",words:["facebook"," face "," fb "],svg:T("#1877F2",'<path d="M14.5 6.5H13a2.5 2.5 0 0 0-2.5 2.5v11M8.5 12h6"/>')},{id:"whatsapp",name:"WhatsApp",words:["whatsapp","whats","zap","wpp","status do whats"],svg:T("#25D366",'<path d="M6 18l1-3a6 6 0 1 1 2.3 2.2z"/><path d="M10 9.5c0 2 2.5 4.5 4.5 4.5" />')},{id:"linkedin",name:"LinkedIn",words:["linkedin","linked in"],svg:T("#0A66C2",'<path d="M8 10.5V17M8 7.3v.1M11.5 17v-6.5M11.5 13a2.5 2.5 0 0 1 5 0v4"/>')},{id:"x",name:"X (Twitter)",words:["twitter","tweet"," x "],svg:T("#000",'<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>')},{id:"threads",name:"Threads",words:["threads"],svg:T("#000",'<path d="M15.5 10.5c-.5-2.5-2-3.5-3.8-3.5C9 7 7.5 9.2 7.5 12s1.6 5 4.4 5c2.4 0 4-1.4 4-3.2 0-2-2.2-2.8-4-2.3-1.3.4-1.7 1.6-1 2.3.9.9 3.3.4 3.6-2.3"/>')},{id:"pinterest",name:"Pinterest",words:["pinterest","pin "],svg:T("#E60023",'<path d="M11 11l-2 8M9.5 14.5c.4.9 1.4 1.5 2.6 1.5 2.5 0 4-2.2 4-4.7C16.1 8.6 14.3 7 12 7a4.5 4.5 0 0 0-4.3 5.8"/>')},{id:"google",name:"Google Meu Neg\xF3cio",words:["google","meu neg\xF3cio","meu negocio","gmb","maps"],svg:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="6" fill="#fff" stroke="#ddd"/><g fill="none" stroke-width="2.4"><path d="M17.5 12.2H12" stroke="#4285F4"/><path d="M17.5 12.2a5.6 5.6 0 0 1-9.9 3.3" stroke="#34A853"/><path d="M7.6 15.5a5.6 5.6 0 0 1 0-7" stroke="#FBBC05"/><path d="M7.6 8.5a5.6 5.6 0 0 1 8.3-.6" stroke="#EA4335"/></g></svg>'},{id:"kwai",name:"Kwai",words:["kwai"],svg:T("#FF7E00",'<rect x="5" y="9" width="10" height="8" rx="2"/><path d="M15 12l4-2v6l-4-2"/><circle cx="8" cy="6.5" r="1.5"/><circle cx="12" cy="6.5" r="1.5"/>')},{id:"spotify",name:"Spotify",words:["spotify","podcast"],svg:T("#1DB954",'<path d="M7 9.5c3.5-1 7-.6 10 1M7.7 12.6c2.8-.7 5.6-.4 8 .9M8.4 15.5c2.2-.5 4.3-.3 6.1.7"/>')},{id:"telegram",name:"Telegram",words:["telegram"],svg:T("#26A5E4",'<path d="M5.5 11.5l12-5-2 11-4-3-2 2v-3.5l6-5"/>')},{id:"email",name:"E-mail",words:["e-mail","email","newsletter"],svg:T("#6B7280",'<rect x="5" y="7" width="14" height="10" rx="2"/><path d="m5.5 8 6.5 5 6.5-5"/>')},{id:"site",name:"Site / Blog",words:["site","blog","landing"],svg:T("#334155",'<circle cx="12" cy="12" r="6.5"/><path d="M5.5 12h13M12 5.5c2 2 2 11 0 13M12 5.5c-2 2-2 11 0 13"/>')}];function st(e){let t=` ${[e?.title,e?.description,e?.internalNote].filter(Boolean).join(" ").toLowerCase()} `.replace(/[.,;:!?()/\-]/g," "),s=$e.filter(a=>!["instagram"].includes(a.id)&&a.words.some(n=>t.includes((n.startsWith(" "),n))));return $e[0].words.slice(0,3).some(a=>t.includes(a))&&s.unshift($e[0]),s}function re(e,t=18){return(Array.isArray(e)?e:st(e)).map(o=>`<span class="pf" style="width:${t}px;height:${t}px" title="${o.name}">${o.svg}</span>`).join("")}function J(e,t=26){let s=c.member(e);return s?`<span class="avatar" style="--s:${t}px;background:${s.color}" title="${u(s.name)}">${u(s.name[0])}</span>`:""}function ot(e=[],t=24){return e.length?`<span class="avatars">${e.map(s=>J(s,t)).join("")}</span>`:`<span class="avatar avatar--empty" style="--s:${t}px" title="Sem respons\xE1vel">?</span>`}var Z=(e=[])=>{let t=e.map(s=>c.member(s)?.name).filter(Boolean);return t.length?t.length===c.team.length&&t.length>1?"Os dois":t.join(" e "):"Sem respons\xE1vel"};function A(e,t=36,s=null){let o=s??Math.round(t*.28);return e?e.logo?`<span class="logo logo--img" style="--s:${t}px;--r:${o}px"><img src="${u(e.logo)}" alt=""></span>`:`<span class="logo" style="--s:${t}px;--r:${o}px;background:${e.color};color:${Oe(e.color)}">${u(Le(e.name))}</span>`:`<span class="logo" style="--s:${t}px;--r:${o}px;background:#999">?</span>`}function ge(e,{solid:t=!1}={}){let s=b[e]||b.outro;return`<span class="tbadge tbadge--${e}${t?" is-solid":""}">${f(s.icon,13)}${s.label}</span>`}function Ve(e){if(!e.time)return"Dia todo";let t=b[e.type];return t&&(t.kind==="shoot"||t.kind==="meeting"||t.kind==="work"||e.duration)?t.kind==="post"&&!e.duration?w(e.time):`${w(e.time)}\u2013${w(O(y(e.time)+I(e)))}`:w(e.time)}function be(e,{showDate:t=!1,compact:s=!1,highlight:o=[]}={}){let a=c.company(e.companyId),n=a?.color||"#888",r=e.status==="feito",i=e.date===_()&&e.time&&y(e.time)+I(e)<K()&&e.status==="pendente",m=o.includes(e.id);return`
  <article class="ecard${r?" is-done":""}${i?" is-late":""}${m?" is-flagged":""}${s?" is-compact":""}"
    style="--cc:${n};--cc-soft:${R(n,.1)}" data-action="open-event" data-id="${e.id}">
    <div class="ecard__time">
      <strong>${e.time?w(e.time):"\u2014"}</strong>
      ${t?`<small>${u(e.date.slice(8))}/${u(e.date.slice(5,7))}</small>`:e.time&&(b[e.type]?.kind!=="post"||e.duration)?`<small>${w(O(y(e.time)+I(e)))}</small>`:""}
    </div>
    <div class="ecard__body">
      <div class="ecard__top">
        ${A(a,20,6)}
        <span class="ecard__company">${u(a?.name||"Sem empresa")}</span>
        ${ge(e.type)}
      </div>
      <div class="ecard__title"><span class="pfrow">${re(e,17)}</span>${u(e.title||b[e.type]?.label||"Evento")}</div>
      ${s?"":`<div class="ecard__meta">
        ${ot(e.assignees,20)}<span>${u(Z(e.assignees))}</span>
        ${e.location?`<span class="ecard__loc">${f("pin",12)}${u(e.location)}</span>`:""}
        ${i?'<span class="ecard__late">Atrasado</span>':""}
        ${e.visibleToClient===!1?`<span class="ecard__private" title="N\xE3o aparece para o cliente">${f("eyeoff",12)}</span>`:""}
      </div>`}
    </div>
    ${c.canEdit("events",e)?`<button class="ecard__check${r?" is-on":""}" data-action="toggle-done" data-id="${e.id}" aria-label="${r?"Desmarcar":"Marcar como feito"}">
      ${f("check",16)}
    </button>`:""}
  </article>`}function ye(e,t,s=""){return`<div class="empty">${f("sparkle",28)}<h3>${u(e)}</h3><p>${u(t)}</p>${s}</div>`}var X=[];function L({html:e,onMount:t,className:s="",onClose:o}){let a=document.getElementById("sheets"),n=document.createElement("div");n.className="sheet-wrap",n.innerHTML=`<div class="sheet-backdrop" data-close></div>
    <section class="sheet ${s}" role="dialog" aria-modal="true">
      <div class="sheet__grab" data-grab><span></span></div>
      <div class="sheet__inner"></div>
    </section>`,a.appendChild(n);let r=n.querySelector(".sheet__inner"),d=n.querySelector(".sheet"),l={el:r,panel:d,set(p){r.innerHTML=p,t&&t(l)},close(){if(l.closed)return;l.closed=!0,n.classList.remove("is-open");let p=X.indexOf(l);p>=0&&X.splice(p,1),setTimeout(()=>n.remove(),280),o&&o(),document.body.classList.toggle("has-sheet",X.length>0)}};X.push(l),l.set(e),document.body.classList.add("has-sheet"),requestAnimationFrame(()=>requestAnimationFrame(()=>n.classList.add("is-open"))),n.addEventListener("click",p=>{p.target.closest("[data-close]")&&l.close()});let i=null,m=0,h=n.querySelector("[data-grab]"),$=p=>{!p.target.closest("[data-grab], .sheet__head")||p.target.closest("button, input, select, textarea")||(i=p.touches[0].clientY,m=0,d.style.transition="none")},M=p=>{i!=null&&(m=Math.max(0,p.touches[0].clientY-i),d.style.transform=`translateY(${m}px)`)},v=()=>{i!=null&&(d.style.transition="",d.style.transform="",m>110&&l.close(),i=null)};return d.addEventListener("touchstart",$,{passive:!0}),d.addEventListener("touchmove",M,{passive:!0}),d.addEventListener("touchend",v),h&&h.addEventListener("click",()=>{}),l}var Ct=()=>X;function B(e,{left:t="",right:s=""}={}){return`<header class="sheet__head">
    <div class="sheet__head-l">${t||'<button class="btn-text" data-close>Fechar</button>'}</div>
    <h2>${u(e)}</h2>
    <div class="sheet__head-r">${s}</div>
  </header>`}var Ge;function k(e,{action:t,onAction:s,ms:o=2600}={}){let a=document.getElementById("toast");a.innerHTML=`<span>${u(e)}</span>${t?`<button>${u(t)}</button>`:""}`,a.classList.add("is-on"),t&&(a.querySelector("button").onclick=()=>{a.classList.remove("is-on"),s&&s()}),clearTimeout(Ge),Ge=setTimeout(()=>a.classList.remove("is-on"),o)}function F({title:e,text:t="",ok:s="Confirmar",danger:o=!1}){return new Promise(a=>L({className:"sheet--dialog",html:`<div class="dialog">
        <h3>${u(e)}</h3>${t?`<p>${u(t)}</p>`:""}
        <button class="btn ${o?"btn--danger":"btn--primary"} btn--block" data-ok>${u(s)}</button>
        <button class="btn btn--ghost btn--block" data-close>Cancelar</button>
      </div>`,onClose:()=>a(!1),onMount:r=>{r.el.querySelector("[data-ok]").onclick=()=>{a(!0),r.close()}}}))}function Y({title:e,text:t="",bodyHtml:s="",options:o}){return new Promise(a=>{let n=null;L({className:"sheet--dialog",html:`<div class="dialog">
        <h3>${u(e)}</h3>${t?`<p>${u(t)}</p>`:""}${s}
        ${o.map((r,d)=>`<button class="btn ${r.danger?"btn--danger":r.primary?"btn--primary":"btn--soft"} btn--block" data-i="${d}">${u(r.label)}</button>`).join("")}
        <button class="btn btn--ghost btn--block" data-close>Cancelar</button>
      </div>`,onClose:()=>a(n),onMount:r=>{r.el.querySelectorAll("[data-i]").forEach(d=>d.onclick=()=>{n=o[+d.dataset.i].value,r.close()})}})})}var nt={workStart:"08:00",workEnd:"19:00",lunchStart:"12:00",lunchEnd:"13:00",daysOff:[0],travelMin:45,maxTasks:8},xe=()=>({...nt,...c.state.settings.find(e=>e.id==="routine")||{}}),N=e=>{let t=y(e.time);return t==null?null:[t,t+I(e)]},G=(e,t)=>e&&t&&e[0]<t[1]&&t[0]<e[1],z=e=>["shoot","meeting"].includes(b[e.type]?.kind),Je=e=>!x(e.type),ke=e=>c.company(e.companyId)?.name||"",U=e=>`${b[e.type]?.label||"Evento"}${ke(e)?" \xB7 "+ke(e):""}`,H=e=>c.member(e)?.name||"\u2014",we=e=>x(e.type)&&!e.duration?`\xE0s ${w(e.time)}`:`das ${w(e.time)} \xE0s ${w(O(N(e)[1]))}`,Ye=(e,t)=>(e.location||e.companyId)===(t.location||t.companyId),ee=(e,t,s)=>c.state.events.filter(o=>o.date===t&&o.id!==s&&o.time&&o.status!=="feito"&&(o.assignees||[]).includes(e));function te(e,{isNew:t=!1}={}){let s=[];if(!e.date)return s;let o=xe(),a=e.time?[y(e.time),y(e.time)+I(e)]:null,n=e.assignees||[];if(a){n.forEach(i=>{ee(i,e.date,e.id).forEach(m=>{if(!G(a,N(m)))return;let h=x(e.type)!==x(m.type)&&(x(e.type)||x(m.type));s.push({level:"block",code:"overlap",person:i,eventIds:[m.id],title:`${H(i)} j\xE1 tem compromisso nesse hor\xE1rio`,text:`${U(m)} ${we(m)}${m.createdBy?` (marcado por ${m.createdBy===c.me?"voc\xEA":H(m.createdBy)})`:""}.`+(h?" Se for manter, deixe o post programado antes.":"")})})}),c.state.events.filter(i=>i.id!==e.id&&i.date===e.date&&i.companyId===e.companyId&&i.type===e.type&&i.time&&Math.abs(y(i.time)-a[0])<=30).forEach(i=>{s.some(m=>m.eventIds?.includes(i.id))||s.push({level:"block",code:"duplicate",eventIds:[i.id],title:"Parece que isso j\xE1 foi marcado",text:`J\xE1 existe ${U(i)} ${we(i)}, com ${(i.assignees||[]).map(H).join(" e ")||"ningu\xE9m"}${i.createdBy?`, marcado por ${i.createdBy===c.me?"voc\xEA":H(i.createdBy)}`:""}.`})}),z(e)&&n.forEach(i=>{ee(i,e.date,e.id).filter(z).forEach(m=>{let h=N(m),$=a[0]>=h[1]?a[0]-h[1]:h[0]>=a[1]?h[0]-a[1]:-1;$>=0&&$<o.travelMin&&!Ye(e,m)&&s.push({level:"warn",code:"travel",person:i,eventIds:[m.id],title:`Pouco tempo de deslocamento para ${H(i)}`,text:`S\xF3 ${$} min entre isto e ${U(m)} (${w(m.time)}). O combinado \xE9 ${o.travelMin} min.`})})});let d=y(o.workStart),l=y(o.workEnd);Je(e)&&(a[0]<d||a[1]>l)?s.push({level:"warn",code:"hours",title:"Fora do expediente",text:`O hor\xE1rio de trabalho de voc\xEAs \xE9 das ${w(o.workStart)} \xE0s ${w(o.workEnd)}. Preservar o tempo livre evita esgotamento.`}):x(e.type)&&(a[0]<d||a[0]>=l)&&s.push({level:"info",code:"hours",title:"Post fora do expediente",text:"Deixe programado no Meta Business Suite para ningu\xE9m precisar parar o descanso para postar."}),Je(e)&&G(a,[y(o.lunchStart),y(o.lunchEnd)])&&s.push({level:"warn",code:"lunch",title:"Invade o almo\xE7o",text:`O almo\xE7o de voc\xEAs \xE9 das ${w(o.lunchStart)} \xE0s ${w(o.lunchEnd)}.`}),a[1]>1440&&s.push({level:"warn",code:"midnight",title:"Passa da meia-noite",text:"Confira a dura\xE7\xE3o."}),t&&(e.date<_()||e.date===_()&&a[0]<K()-5)&&s.push({level:"warn",code:"past",title:"Esse hor\xE1rio j\xE1 passou",text:"Confira o dia e a hora."}),["feed","reels","carrossel"].includes(e.type)&&c.state.events.filter(i=>i.id!==e.id&&i.date===e.date&&i.companyId===e.companyId&&["feed","reels","carrossel"].includes(i.type)&&i.time).forEach(i=>{let m=Math.abs(y(i.time)-a[0]);m>30&&m<180&&s.push({level:"warn",code:"spacing",eventIds:[i.id],title:"Posts da mesma empresa muito pr\xF3ximos",text:`${U(i)} \xE0s ${w(i.time)}. Espacem pelo menos 3 h.`})}),c.team.filter(i=>!n.includes(i.id)).forEach(i=>{ee(i.id,e.date,e.id).filter(m=>G(a,N(m))).forEach(m=>{s.push({level:"info",code:"partner",person:i.id,eventIds:[m.id],title:`${i.name} nesse hor\xE1rio`,text:`${U(m)} ${we(m)}${m.location?" \xB7 "+m.location:""}.`})})})}let r=j(e.date).getDay();return o.daysOff.includes(r)&&!x(e.type)&&s.push({level:"warn",code:"dayoff",title:`${Ae[r]} \xE9 dia de folga`,text:"Se der, mude para um dia \xFAtil. Posts podem ficar programados."}),n.forEach(d=>{let l=c.state.events.filter(i=>i.date===e.date&&i.id!==e.id&&(i.assignees||[]).includes(d)).length+1;l>o.maxTasks&&s.push({level:"warn",code:"load",person:d,title:`${H(d)} ficaria sobrecarregado`,text:`${l} tarefas nesse dia (limite combinado: ${o.maxTasks}).`})}),s}function ce(e,{limit:t=3,people:s=null}={}){if(!e.date)return[];let o=xe(),a=s||(e.assignees?.length?e.assignees:[]),n=I(e),r=x(e.type),d=r?420:y(o.workStart),l=r?1320:y(o.workEnd),i=[y(o.lunchStart),y(o.lunchEnd)],m=(b[e.type]?.best||[]).map(y),h=e.date===_()?Math.ceil((K()+15)/15)*15:0,$=c.state.events.filter(p=>p.id!==e.id&&p.date===e.date&&p.companyId&&p.companyId===e.companyId&&p.time&&(p.type===e.type||r&&x(p.type)&&p.type!=="story"&&e.type!=="story")).map(p=>({t:y(p.time),gap:p.type===e.type&&e.type==="story"?45:p.type===e.type?180:120})),M=[];for(let p=Math.max(d,h);p+n<=l;p+=15){let g=[p,p+n];if(!r&&G(g,i)||$.some(S=>Math.abs(S.t-p)<S.gap)||a.some(S=>ee(S,e.date,e.id).some(ue=>{let Te=N(ue);return G(g,Te)?!0:z(e)&&z(ue)&&!Ye(e,ue)?G([g[0]-o.travelMin,g[1]+o.travelMin],Te):!1})))continue;let C=m.length?Math.min(...m.map(S=>Math.abs(S-p))):Math.abs(p-y(o.workStart)-60);M.push({time:O(p),score:C})}M.sort((p,g)=>p.score-g.score);let v=[];for(let p of M)if(v.every(g=>Math.abs(y(g.time)-y(p.time))>=60)&&v.push(p),v.length>=t)break;return v.sort((p,g)=>y(p.time)-y(g.time)).map(p=>({...p,peak:p.score<=30}))}function de(e){if(!e.time)return c.team.map(s=>s.id);let t=[y(e.time),y(e.time)+I(e)];return c.team.filter(s=>!ee(s.id,e.date,e.id).some(o=>G(t,N(o)))).map(s=>s.id)}function it(e,t){let s=xe();if(s.daysOff.includes(j(t).getDay()))return{minutes:null,longest:null,dayOff:!0};let o=y(s.workStart),a=y(s.workEnd),n=[[y(s.lunchStart),y(s.lunchEnd)]];c.eventsOn(t,{person:e}).filter(i=>i.time).forEach(i=>{let m=N(i);n.push([m[0],x(i.type)?m[0]+15:m[1]+(z(i)?30:0)])}),n.sort((i,m)=>i[0]-m[0]);let r=o,d=0,l=0;return n.forEach(([i,m])=>{if(i>=a||m<=o)return;let h=Math.max(i,o),$=Math.min(m,a);$<=r||(h>r&&(d+=h-r,l=Math.max(l,h-r)),r=Math.max(r,$))}),a>r&&(d+=a-r,l=Math.max(l,a-r)),{minutes:d,longest:l,dayOff:!1}}function Ot(e,t,s){let o=[],a=x(t.type)&&!x(s.type)?t:x(s.type)&&!x(t.type)?s:(t.createdAt||0)>(s.createdAt||0)?t:s,n=c.team.find(d=>d.id!==e);n&&de(a).includes(n.id)&&(a.assignees||[]).length===1&&o.push({label:`Passar para ${n.name}`,eventId:a.id,patch:{assignees:[n.id]}});let r=ce(a,{limit:1})[0];return r&&o.push({label:`Mover ${b[a.type].label.toLowerCase()} para ${w(r.time)}`,eventId:a.id,patch:{time:r.time}}),o}function qt(e,t="all"){let s=t==="all"?c.team:c.team.filter(n=>n.id===t),o=[];return c.eventsOn(e,{person:t}).length?(s.forEach(n=>{let r=c.eventsOn(e,{person:n.id}),d=it(n.id,e),l=r.filter(z),i=[`${r.length} tarefa${r.length===1?"":"s"}`];l.length&&i.push(`sai para ${l.map(m=>`${ke(m)} \xE0s ${w(m.time)}`).join(" e ")}`),d.dayOff?i.push("\xE9 dia de folga"):d.minutes!=null&&i.push(d.minutes>=30?`${V(d.minutes)} livres no expediente (maior intervalo: ${V(d.longest)})`:"quase sem tempo livre"),o.push(`${n.name}: ${i.join(", ")}.`)}),o):[`Nenhum compromisso${t==="all"?"":" para "+H(t)}. Bom dia para planejar a pauta ou adiantar edi\xE7\xF5es.`]}var lt={feed:"\u{1F5BC}\uFE0F",carrossel:"\u{1F5C2}\uFE0F",reels:"\u{1F3AC}",story:"\u2B55",captacao:"\u{1F4F8}",reuniao:"\u{1F91D}",producao:"\u2702\uFE0F",outro:"\u2022"},ae=e=>String(e||"").replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\r?\n/g,"\\n"),rt=e=>{let t=[];for(;e.length>74;)t.push(e.slice(0,74)),e=" "+e.slice(74);return t.push(e),t.join(`\r
`)},ze=(e,t)=>e.replace(/-/g,"")+"T"+t.replace(":","")+"00",ct=()=>new Date().toISOString().replace(/[-:]/g,"").replace(/\.\d+/,"");function dt(e,t){let s=["BEGIN:VCALENDAR","VERSION:2.0",`PRODID:-//${oe.appName}//PT-BR`,"CALSCALE:GREGORIAN","METHOD:PUBLISH",`X-WR-CALNAME:${ae(t)}`];return e.forEach(o=>{let a=c.company(o.companyId),n=(o.assignees||[]).map(i=>c.member(i)?.name).filter(Boolean).join(" e "),r=`${lt[o.type]||""} ${b[o.type]?.label||"Evento"} \xB7 ${a?.name||""}${o.title?" \u2014 "+o.title:""}`.trim(),d=[n&&`Respons\xE1vel: ${n}`,o.description,o.internalNote&&`Nota interna: ${o.internalNote}`].filter(Boolean).join(`
`);if(s.push("BEGIN:VEVENT",`UID:${o.id}@pauta`,`DTSTAMP:${ct()}`),o.time){let i=y(o.time)+I(o),m=i>=1440?E(o.date,1):o.date;s.push(`DTSTART:${ze(o.date,o.time)}`,`DTEND:${ze(m,O(i%1440))}`)}else s.push(`DTSTART;VALUE=DATE:${o.date.replace(/-/g,"")}`,`DTEND;VALUE=DATE:${E(o.date,1).replace(/-/g,"")}`);s.push(`SUMMARY:${ae(r)}`),d&&s.push(`DESCRIPTION:${ae(d)}`),o.location&&s.push(`LOCATION:${ae(o.location)}`);let l=o.reminder??30;l>=0&&s.push("BEGIN:VALARM","ACTION:DISPLAY",`DESCRIPTION:${ae(r)}`,`TRIGGER:-PT${l}M`,"END:VALARM"),s.push("END:VEVENT")}),s.push("END:VCALENDAR"),s.map(rt).join(`\r
`)}async function Ke(e,t,s){let o=dt(e,s),a=He();if(a){let l=document.createElement("form");l.method="POST",l.action=a.replace(/\/$/,"")+"/ics",l.target="_blank",l.style.display="none";let i=document.createElement("textarea");i.name="ics",i.value=o,l.appendChild(i),document.body.appendChild(l),l.submit(),l.remove();return}let n=new File([o],t,{type:"text/calendar"});if(navigator.canShare&&navigator.canShare({files:[n]}))try{await navigator.share({files:[n],title:s});return}catch(l){if(l&&l.name==="AbortError")return}let r=URL.createObjectURL(n),d=document.createElement("a");d.href=r,d.download=t,document.body.appendChild(d),d.click(),d.remove(),setTimeout(()=>URL.revokeObjectURL(r),4e3)}function Xt(){let e=c.companiesSorted(),t=_(),s=Ce(t),o=E(s,6);return`
  <header class="hdr">
    <div class="hdr__row">
      <div class="hdr__titles"><p class="hdr__eyebrow">${e.length} cliente${e.length===1?"":"s"}</p><h1>Empresas</h1></div>
      <div class="hdr__actions"><button class="btn btn--primary btn--sm" data-action="new-company">${f("plus",16)} Nova</button></div>
    </div>
  </header>
  <div class="page">
    ${e.length?"":ye("Nenhuma empresa ainda","Cadastre os clientes com nome, cor e logomarca. Cada um ganha um link pr\xF3prio para ver s\xF3 o seu cronograma.",`<button class="btn btn--primary" data-action="new-company">${f("plus",18)} Cadastrar empresa</button>`)}
    <div class="colist">
      ${e.map(a=>{let n=c.eventsBetween(s,o,{companyId:a.id}),r=n.filter(i=>x(i.type)).length,d=n.filter(i=>i.type==="captacao").length,l=c.state.events.filter(i=>i.companyId===a.id&&i.date>=t&&i.status!=="feito").sort((i,m)=>(i.date+i.time).localeCompare(m.date+m.time))[0];return`<button class="cocard" style="--cc:${a.color};--cc-soft:${R(a.color,.1)}" data-action="open-company" data-id="${a.id}">
          <div class="cocard__top">
            ${A(a,48)}
            <div class="cocard__name"><strong>${u(a.name)}</strong>${a.instagram?`<small>${f("insta",12)} @${u(a.instagram)}</small>`:""}</div>
            ${f("right",18,"muted")}
          </div>
          <div class="cocard__stats">
            <span><b>${r}</b> posts</span><span><b>${d}</b> capta\xE7${d===1?"\xE3o":"\xF5es"}</span><span class="muted">nesta semana</span>
          </div>
          ${l?`<div class="cocard__next">${f(b[l.type].icon,14)} <b>${u(W(l.date))}${l.time?" "+l.time:""}</b> \xB7 ${u(b[l.type].label)} \u2014 ${u(l.title||"")}</div>`:'<div class="cocard__next muted">Nada agendado</div>'}
        </button>`}).join("")}
    </div>
  </div>`}function Zt(e){let t=L({className:"sheet--tall",html:We(e),onMount:s=>pt(s,e)});t.refresh=()=>c.company(e)?t.set(We(e)):t.close()}function We(e){let t=c.company(e);if(!t)return"";let s=_(),o=ne(s),a=c.eventsBetween(`${o}-01`,`${o}-31`,{companyId:e}),n=c.eventsBetween(s,E(s,30),{companyId:e}),r=c.eventsBetween(E(s,-14),E(s,-1),{companyId:e}).reverse(),d=h=>a.filter($=>h.includes($.type)).length,l=a.filter(h=>h.status==="feito").length,i="",m=n.map(h=>{let $=h.date!==i?`<h4 class="dayhead">${u(Q(h.date))}</h4>`:"";return i=h.date,$+be(h)}).join("");return`
  ${B("",{right:c.canEdit("companies",t)?'<button class="btn-text" data-act="edit">Editar</button>':""})}
  <div class="cohero" style="--cc:${t.color};--cc-soft:${R(t.color,.14)}">
    ${A(t,72,20)}
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
      <h2 class="block__title">${u(De(o))}</h2>
      <div class="mstats mstats--5">
        <div><b>${d(["feed","carrossel"])}</b><span>feed</span></div>
        <div><b>${d(["reels"])}</b><span>reels</span></div>
        <div><b>${d(["story"])}</b><span>stories</span></div>
        <div><b>${d(["captacao"])}</b><span>capta\xE7\xF5es</span></div>
        <div><b>${a.length?Math.round(l/a.length*100):0}%</b><span>feito</span></div>
      </div>
    </section>

    ${t.address||t.contact||t.notes?`<ul class="rows">
      ${t.address?`<li><span class="rows__k">${f("pin",16)} Endere\xE7o</span><a class="rows__v link" href="https://maps.apple.com/?q=${encodeURIComponent(t.address)}" target="_blank" rel="noopener">${u(t.address)}</a></li>`:""}
      ${t.contact?`<li><span class="rows__k">${f("user",16)} Contato</span><span class="rows__v">${u(t.contact)}</span></li>`:""}
      ${t.notes?`<li><span class="rows__k">${f("note",16)} Observa\xE7\xF5es</span><span class="rows__v">${u(t.notes)}</span></li>`:""}
    </ul>`:""}

    <section class="block">
      <h2 class="block__title">Pr\xF3ximos 30 dias</h2>
      ${m||ye("Nada agendado","Crie o cronograma de postagens desta empresa.")}
    </section>

    ${r.length?`<section class="block">
      <h2 class="block__title">\xDAltimas 2 semanas</h2>
      ${r.map(h=>be(h,{showDate:!0,compact:!0})).join("")}
    </section>`:""}
  </div>`}function pt(e,t){let s=e.el;(s.querySelector('[data-act="edit"]')||{}).onclick=()=>_e(t),s.querySelector('[data-act="new"]').onclick=async()=>{let{openEventEditor:o}=await import("./c-6MTMWGU3.js");o({companyId:t})},s.querySelector('[data-act="share"]').onclick=()=>Ee(t),s.querySelector('[data-act="clientview"]').onclick=()=>ut(t)}function _e(e=null,t=null){let s=e?c.company(e):null,o=c.state.companies.map(d=>d.color),a=s?{...s}:{id:P("c_"),name:"",color:le.find(d=>!o.includes(d))||le[0],logo:null,instagram:"",address:"",contact:"",notes:"",shareToken:null},n=()=>`
    ${B(s?"Editar empresa":"Nova empresa",{left:'<button class="btn-text" data-close>Cancelar</button>',right:'<button class="btn btn--primary btn--sm" data-save>Salvar</button>'})}
    <form class="form" onsubmit="return false">
      <div class="logopick">
        <div data-preview>${A({...a,name:a.name||"?"},88,24)}</div>
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
          ${le.map(d=>`<button type="button" class="swatch${a.color===d?" is-on":""}" style="background:${d}" data-color="${d}" aria-label="Cor ${d}">${f("check",16)}</button>`).join("")}
          <label class="swatch swatch--custom" title="Outra cor"><input type="color" value="${a.color}" data-customcolor>${f("plus",16)}</label>
        </div>
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-ig">Instagram</label>
        <div class="input-prefix"><span>@</span><input id="c-ig" class="input" name="instagram" value="${u(a.instagram||"")}" placeholder="usuario" autocomplete="off" autocapitalize="none"></div>
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
    </form>`,r=d=>{let l=d.el,i=l.querySelector("form"),m=()=>{a.name=i.name.value.trim(),a.instagram=i.instagram.value.trim().replace(/^@/,""),a.address=i.address.value.trim(),a.contact=i.contact.value.trim(),a.notes=i.notes.value.trim()},h=()=>l.querySelector("[data-preview]").innerHTML=A({...a,name:i.name.value||"?"},88,24);i.name.addEventListener("input",h),l.querySelectorAll("[data-color]").forEach(v=>v.onclick=()=>{a.color=v.dataset.color,l.querySelectorAll("[data-color]").forEach(p=>p.classList.toggle("is-on",p===v)),h()}),l.querySelector("[data-customcolor]").oninput=v=>{a.color=v.target.value,l.querySelectorAll("[data-color]").forEach(p=>p.classList.remove("is-on")),h()},l.querySelector("[data-file]").onchange=async v=>{let p=v.target.files[0];if(p)try{m(),a.logo=await qe(p,160),d.set(n())}catch{k("N\xE3o foi poss\xEDvel ler essa imagem")}};let $=l.querySelector("[data-rmlogo]");$&&($.onclick=()=>{m(),a.logo=null,d.set(n())});let M=l.querySelector("[data-delete]");M&&(M.onclick=async()=>{let v=c.state.events.filter(g=>g.companyId===a.id);await F({title:`Excluir ${a.name}?`,text:v.length?`Os ${v.length} eventos desta empresa tamb\xE9m ser\xE3o apagados e o link do cliente deixar\xE1 de funcionar.`:"O link do cliente deixar\xE1 de funcionar.",ok:"Excluir empresa",danger:!0})&&(await c.removeMany("events",v.map(g=>g.id)),await c.remove("companies",a.id),d.close(),k("Empresa exclu\xEDda"))}),l.querySelector("[data-save]").onclick=async()=>{if(m(),!a.name)return i.name.focus(),k("Digite o nome da empresa");await c.upsert("companies",{...a}),d.close(),k(s?"Empresa atualizada":"Empresa cadastrada"),t&&t(c.company(a.id))}};L({className:"sheet--tall",html:n(),onMount:r})}async function Ee(e){let t=c.company(e),s=c.mode==="cloud",o="";s?(await c.ensureShareToken(t),await c.publishCompany(e),o=Pe(c.company(e).shareToken)):o=Re(await je(me(t,c.state.events,{maxFuture:90})));let a=`
    ${B("Link do cliente")}
    <div class="share">
      <div class="share__co">${A(t,56)}<div><strong>${u(t.name)}</strong><small>v\xEA somente o pr\xF3prio cronograma</small></div></div>
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
    </div>`;L({html:a,onMount:n=>{let r=n.el;r.querySelector("[data-copy]").onclick=async()=>{try{await navigator.clipboard.writeText(o),k("Link copiado")}catch{r.querySelector("[data-link]").select(),k("Selecione e copie o link")}},r.querySelector("[data-sharebtn]").onclick=async()=>{let l=`Ol\xE1! Este \xE9 o cronograma de conte\xFAdo da ${t.name}. Por aqui voc\xEAs acompanham tudo o que est\xE1 planejado: posts, stories, reels e capta\xE7\xF5es.`;if(navigator.share)try{await navigator.share({title:`Cronograma \xB7 ${t.name}`,text:l,url:o})}catch{}else await navigator.clipboard?.writeText(`${l}
${o}`),k("Mensagem copiada")};let d=r.querySelector("[data-revoke]");d&&(d.onclick=async()=>{await F({title:"Gerar um novo link?",text:"Quem tiver o link antigo n\xE3o conseguir\xE1 mais ver o cronograma.",ok:"Gerar novo link",danger:!0})&&(await c.regenerateShareToken(c.company(e)),n.close(),Ee(e))})}})}async function ut(e){let t=c.company(e);if(!t)return;let{showClient:s}=await import("./c-3UELI7VQ.js"),{sanitizePayload:o}=await import("./c-JBFK46OY.js"),a=o(me(t,c.state.events)),n=document.createElement("div");n.className="client-preview",n.innerHTML=`<div class="client-preview__bar"><button class="btn btn--soft btn--sm" data-closepv>${f("left",16)} Voltar</button><span>Assim o cliente v\xEA</span><button class="btn btn--primary btn--sm" data-sendpv>${f("share",16)} Enviar</button></div><div class="client-preview__body"></div>`,document.body.appendChild(n),document.body.classList.add("has-sheet"),s(n.querySelector(".client-preview__body"),a,{canGoBack:!1,preview:!0});let r=()=>{n.remove(),document.body.classList.toggle("has-sheet",!!document.querySelector(".sheet-wrap"))};n.querySelector("[data-closepv]").onclick=r,n.querySelector("[data-sendpv]").onclick=()=>{r(),Ee(e)}}function fa(e){let t=L({html:Qe(e),className:"sheet--tall",onMount:s=>mt(s,e)});t.refresh=()=>{if(!c.event(e))return t.close();t.set(Qe(e))}}function Qe(e){let t=c.event(e);if(!t)return"";let s=c.company(t.companyId),o=s?.color||"#666",a=ve.find(l=>l.v===(t.reminder??30)),n=t.seriesId?c.state.events.filter(l=>l.seriesId===t.seriesId).length:0,r=c.canEdit("events",t),d=c.member(c.ownerOf("events",t))?.name||"o parceiro";return`
  ${B("",{right:r?'<button class="btn-text" data-act="edit">Editar</button>':""})}
  <div class="detail">
    <div class="detail__hero" style="--cc:${o};--cc-soft:${R(o,.12)}">
      <div class="detail__co">${A(s,40)}<div><strong>${u(s?.name||"Sem empresa")}</strong>${s?.instagram?`<small>@${u(s.instagram)}</small>`:""}</div>${ge(t.type,{solid:!0})}</div>
      <h2><span class="pfrow">${re(t,24)}</span>${u(t.title||b[t.type].label)}</h2>
      <p class="detail__when">${f("calendar",15)} ${u(W(t.date))}, ${u(Ne(t.date).split(", ")[1])} \xB7 ${f("clock",15)} ${u(Ve(t))}</p>
    </div>

    ${r?"":`<p class="detail__lock">${f("eye",14)} Cadastrado por ${u(d)} \u2014 voc\xEA s\xF3 pode ver. Use \u201CDuplicar\u201D para criar uma c\xF3pia sua.</p>`}
    <div class="seg seg--status"${r?"":" hidden"}>
      ${fe.map(l=>`<button class="seg__btn${t.status===l?" is-on":""} st-${l}" data-status="${l}">${l==="feito"?f("check",14):""}${ie[l].label}</button>`).join("")}
    </div>

    <ul class="rows">
      <li><span class="rows__k">${f("users",16)} Respons\xE1vel</span><span class="rows__v">${(t.assignees||[]).map(l=>J(l,22)).join("")} ${u(Z(t.assignees))}</span></li>
      ${t.location?`<li><span class="rows__k">${f("pin",16)} Local</span><a class="rows__v link" href="https://maps.apple.com/?q=${encodeURIComponent(t.location)}" target="_blank" rel="noopener">${u(t.location)}</a></li>`:""}
      ${b[t.type].kind!=="post"||t.duration?`<li><span class="rows__k">${f("clock",16)} Dura\xE7\xE3o</span><span class="rows__v">${u(V(I(t)))}</span></li>`:""}
      <li><span class="rows__k">${f("bell",16)} Lembrete</span><span class="rows__v">${u(a?.label||"\u2014")}</span></li>
      ${n?`<li><span class="rows__k">${f("repeat",16)} Repeti\xE7\xE3o</span><span class="rows__v">${n} eventos na s\xE9rie</span></li>`:""}
      <li><span class="rows__k">${f(t.visibleToClient===!1?"eyeoff":"eye",16)} Cliente</span><span class="rows__v">${t.visibleToClient===!1?"N\xE3o aparece para o cliente":"Aparece no calend\xE1rio do cliente"}</span></li>
    </ul>

    ${t.description?`<div class="textbox"><h4>Descri\xE7\xE3o / legenda</h4><p>${u(t.description)}</p></div>`:""}
    ${t.internalNote?`<div class="textbox textbox--note"><h4>${f("eyeoff",13)} Nota interna (s\xF3 a equipe v\xEA)</h4><p>${u(t.internalNote)}</p></div>`:""}

    <div class="actions">
      <button data-act="ics">${f("bell",20)}<span>Lembrete no iPhone</span></button>
      ${r?`<button data-act="tomorrow">${f("right",20)}<span>Passar p/ amanh\xE3</span></button>`:""}
      <button data-act="dup">${f("copy",20)}<span>Duplicar</span></button>
      ${r?`<button data-act="del" class="is-danger">${f("trash",20)}<span>Excluir</span></button>`:""}
    </div>
    <p class="detail__meta">Criado por ${u(c.member(t.createdBy)?.name||"\u2014")}${t.updatedAt?" \xB7 atualizado "+new Date(t.updatedAt).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):""}</p>
  </div>`}function mt(e,t){let s=e.el;s.querySelectorAll("[data-status]").forEach(a=>a.onclick=async()=>{let n=c.event(t);await c.upsert("events",{...n,status:a.dataset.status})});let o=(a,n)=>{let r=s.querySelector(`[data-act="${a}"]`);r&&(r.onclick=n)};o("edit",()=>Xe({id:t})),o("dup",async()=>{let n={...c.event(t),id:P("e_"),status:"pendente",seriesId:null,createdAt:null,createdBy:null};await c.upsert("events",n),e.close(),k("Evento duplicado"),Xe({id:n.id})}),o("tomorrow",async()=>{let a=c.event(t);await $t(a,{date:E(a.date,1)})&&(await c.upsert("events",{...a,date:E(a.date,1)}),k("Movido para "+W(E(a.date,1)).toLowerCase(),{action:"Desfazer",onAction:()=>c.upsert("events",{...c.event(t),date:a.date})}))}),o("ics",()=>{let a=c.event(t);Ke([a],`${b[a.type].label}-${a.date}.ics`,oe.appName)}),o("del",()=>et(t,e))}async function et(e,t){let s=c.event(e),o=[e];if(s.seriesId){let n=c.state.events.filter(r=>r.seriesId===s.seriesId&&r.date>=s.date).map(r=>r.id);if(n.length>1){let r=await Y({title:"Excluir evento repetido",options:[{label:"S\xF3 este",value:"one",danger:!0},{label:`Este e os pr\xF3ximos (${n.length})`,value:"next",danger:!0}]});if(!r)return;r==="next"&&(o=n)}else if(!await F({title:"Excluir este evento?",ok:"Excluir",danger:!0}))return}else if(!await F({title:"Excluir este evento?",text:"Ele some para a dupla e para o cliente.",ok:"Excluir",danger:!0}))return;let a=o.map(n=>({...c.event(n)}));await c.removeMany("events",o),t&&t.close(),k(o.length>1?`${o.length} eventos exclu\xEDdos`:"Evento exclu\xEDdo",{action:"Desfazer",onAction:()=>c.upsertMany("events",a),ms:4500})}function Xe({id:e=null,date:t=null,companyId:s=null,type:o=null,time:a=null,assignees:n=null}={}){let r=e?c.event(e):null;if(r&&!c.canEdit("events",r)){c._denied("events",r);return}let d=c.companiesSorted(),l=o||"feed",i=r?JSON.parse(JSON.stringify(r)):{id:P("e_"),type:l,companyId:s||D.monthCompany||(d.length===1?d[0].id:null),title:"",date:t||(D.tab==="mes"?D.monthSel:D.date)||_(),time:a||b[l].best[0]||"12:00",duration:["shoot","meeting","work","other"].includes(b[l].kind)?b[l].dur:null,assignees:n||(D.person!=="all"?[D.person]:c.me?[c.me]:[]),location:"",description:"",internalNote:"",reminder:30,visibleToClient:b[l].client,status:"pendente"},m=r?JSON.parse(JSON.stringify(r)):null,h={mode:"none",until:E(i.date,28)};return L({className:"sheet--tall",html:tt(i,!!r,h),onMount:M=>ft(M,i,m,h)})}var pe=e=>["shoot","meeting","work","other"].includes(b[e].kind),se=e=>["shoot","meeting"].includes(b[e].kind);function tt(e,t,s){let o=c.companiesSorted();return`
  ${B(t?"Editar evento":"Novo evento",{left:'<button class="btn-text" data-close>Cancelar</button>',right:'<button class="btn btn--primary btn--sm" data-save>Salvar</button>'})}
  <form class="form" data-editor onsubmit="return false">
    <div class="fgroup">
      <label class="flabel">O que \xE9?</label>
      <div class="typegrid">
        ${Be.map(a=>`<button type="button" class="typebtn tbadge--${a}${e.type===a?" is-on":""}" data-type="${a}">${f(b[a].icon,20)}<span>${b[a].label}</span></button>`).join("")}
      </div>
    </div>

    <div class="fgroup">
      <label class="flabel">Empresa</label>
      <div class="cogrid">
        ${o.map(a=>`<button type="button" class="cobtn${e.companyId===a.id?" is-on":""}" style="--cc:${a.color}" data-company="${a.id}">${A(a,26,7)}<span>${u(a.name)}</span></button>`).join("")}
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

    <div class="fgroup" data-when="duration" ${pe(e.type)?"":"hidden"}>
      <label class="flabel" for="f-dur">Dura\xE7\xE3o</label>
      <select id="f-dur" class="input" name="duration">
        ${Fe.map(a=>`<option value="${a}"${(e.duration||b[e.type].dur)===a?" selected":""}>${V(a)}</option>`).join("")}
      </select>
    </div>

    <div data-hint></div>

    <div class="fgroup">
      <label class="flabel">Quem vai fazer?</label>
      <div class="whogrid">
        ${c.team.map(a=>`<button type="button" class="whobtn${(e.assignees||[]).includes(a.id)?" is-on":""}" style="--mc:${a.color}" data-who="${a.id}">${J(a.id,30)}<span>${u(a.name)}</span><i class="whobtn__check">${f("check",14)}</i></button>`).join("")}
      </div>
      <p class="fhelp">Marque os dois se forem juntos.</p>
    </div>

    <div class="fgroup" data-when="location" ${se(e.type)?"":"hidden"}>
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
        <select name="reminder">${ve.map(a=>`<option value="${a.v}"${(e.reminder??30)===a.v?" selected":""}>${a.label}</option>`).join("")}</select>
      </label>
      ${t?"":`<label class="list__row"><span>${f("repeat",18)} Repetir</span>
        <select name="repeat">${he.map(a=>`<option value="${a.v}"${s.mode===a.v?" selected":""}>${a.label}</option>`).join("")}</select>
      </label>
      <label class="list__row" data-when="until" hidden><span>${f("calendar",18)} At\xE9</span>
        <input type="date" name="until" value="${s.until}">
      </label>`}
      <label class="list__row"><span>${f("eye",18)} Aparece para o cliente</span>
        <input type="checkbox" class="switch" name="visibleToClient" ${e.visibleToClient!==!1?"checked":""}>
      </label>
      ${t?`<label class="list__row"><span>${f("check",18)} Status</span>
        <select name="status">${fe.map(a=>`<option value="${a}"${e.status===a?" selected":""}>${ie[a].label}</option>`).join("")}</select>
      </label>`:""}
    </div>

    ${t?`<button type="button" class="btn btn--danger-soft btn--block" data-delete>${f("trash",18)} Excluir evento</button>`:""}
    <div class="form__spacer"></div>
  </form>`}function ft(e,t,s,o){let a=e.el,n=a.querySelector("[data-editor]"),r=v=>a.querySelector(v),d=()=>{let v=r("[data-hint]");v.innerHTML=ht(t,!s),v.querySelectorAll("[data-settime]").forEach(p=>p.onclick=()=>{t.time=p.dataset.settime,n.time.value=t.time,d()}),v.querySelectorAll("[data-setwho]").forEach(p=>p.onclick=()=>{t.assignees=[p.dataset.setwho],a.querySelectorAll("[data-who]").forEach(g=>g.classList.toggle("is-on",t.assignees.includes(g.dataset.who))),d()})},l=()=>{a.querySelector('[data-when="duration"]').hidden=!pe(t.type),a.querySelector('[data-when="location"]').hidden=!se(t.type);let v=c.company(t.companyId),p=r("[data-useaddr]");p.hidden=!(v&&v.address&&n.location.value!==v.address);let g=a.querySelector('[data-when="until"]');g&&(g.hidden=o.mode==="none")};a.querySelectorAll("[data-type]").forEach(v=>v.onclick=()=>{let p=t.type;if(t.type=v.dataset.type,a.querySelectorAll("[data-type]").forEach(g=>g.classList.toggle("is-on",g===v)),n.title.placeholder=b[t.type].placeholder,(!s||p!==t.type)&&(t.duration=pe(t.type)?b[t.type].dur:null,n.duration.value=String(b[t.type].dur),s||(t.visibleToClient=b[t.type].client,n.visibleToClient.checked=t.visibleToClient)),se(t.type)&&!n.location.value){let g=c.company(t.companyId);g?.address&&(n.location.value=g.address,t.location=g.address)}l(),d()}),a.querySelectorAll("[data-company]").forEach(v=>v.onclick=()=>{t.companyId=v.dataset.company,a.querySelectorAll("[data-company]").forEach(g=>g.classList.toggle("is-on",g===v));let p=c.company(t.companyId);se(t.type)&&p?.address&&!n.location.value&&(n.location.value=p.address,t.location=p.address),l()}),r("[data-newco]").onclick=()=>{_e(null,v=>{t.companyId=v.id,i(),e.set(tt(t,!!s,o))})},a.querySelectorAll("[data-who]").forEach(v=>v.onclick=()=>{let p=v.dataset.who;t.assignees=t.assignees.includes(p)?t.assignees.filter(g=>g!==p):[...t.assignees,p],v.classList.toggle("is-on",t.assignees.includes(p)),d()}),r("[data-useaddr]").onclick=()=>{let v=c.company(t.companyId);n.location.value=v.address,t.location=v.address,l()};let i=()=>{t.title=n.title.value.trim(),t.date=n.date.value,t.time=n.time.value||"",t.duration=pe(t.type)?Number(n.duration.value):null,t.location=se(t.type)?n.location.value.trim():"",t.description=n.description.value.trim(),t.internalNote=n.internalNote.value.trim(),t.reminder=Number(n.reminder.value),t.visibleToClient=n.visibleToClient.checked,n.status&&(t.status=n.status.value),n.repeat&&(o.mode=n.repeat.value),n.until&&(o.until=n.until.value)};n.addEventListener("input",()=>{i(),l()}),n.addEventListener("change",()=>{i(),l(),d()});let m=r("[data-delete]");m&&(m.onclick=()=>et(t.id,null).then(()=>!c.event(t.id)&&e.close())),r("[data-save]").onclick=async()=>{if(i(),!h){if(!t.companyId){k("Escolha a empresa"),a.querySelector(".cogrid").scrollIntoView({behavior:"smooth",block:"center"});return}if(!t.date)return k("Escolha o dia");if(!(!t.assignees.length&&!await F({title:"Ningu\xE9m respons\xE1vel?",text:"Este evento ficar\xE1 sem respons\xE1vel. Deseja salvar assim mesmo?",ok:"Salvar assim"}))&&!h){h=!0;try{await $()}finally{h=!1}}}};let h=!1,$=async()=>{if(s){if(["date","time","duration","type","assignees","companyId"].some(p=>JSON.stringify(t[p])!==JSON.stringify(s[p]))&&!await Me(t,!1,e,M))return;await yt(t,s)}else if(o.mode!=="none"){let v=gt(t.date,o),p=v.filter(C=>te({...t,date:C},{isNew:!0}).some(S=>S.level==="block")),g=v;if(p.length){let C=await Y({title:`${p.length} de ${v.length} datas j\xE1 t\xEAm compromisso nesse hor\xE1rio`,text:p.slice(0,6).map(S=>Q(S)).join(" \xB7 ")+(p.length>6?" \u2026":""),options:[{label:`Criar s\xF3 nas ${v.length-p.length} datas livres`,value:"free",primary:!0},{label:"Criar em todas mesmo assim",value:"all"}]});if(!C)return;if(C==="free"&&(g=v.filter(S=>!p.includes(S))),!g.length)return k("Nenhuma data livre")}let Ie=P("s_");await c.upsertMany("events",g.map((C,S)=>({...t,id:S===0?t.id:P("e_"),date:C,seriesId:Ie})),{activity:{kind:"series",count:g.length,label:`${b[t.type].label} ${he.find(C=>C.v===o.mode)?.label.toLowerCase()||""} \xE0s ${w(t.time)}`,sample:{companyId:t.companyId,date:g[0]}}}),k(`${g.length} eventos criados`)}else{if(!await Me(t,!0,e,M))return;await c.upsert("events",{...t}),k("Evento salvo")}e.close()};function M(){n.time.value=t.time||"",n.date.value=t.date,a.querySelectorAll("[data-who]").forEach(v=>v.classList.toggle("is-on",t.assignees.includes(v.dataset.who))),l(),d()}l(),d()}var Se=420,Ze=1380,q=e=>(Math.min(Math.max(e,Se),Ze)-Se)/(Ze-Se)*100;function vt(e,t){let s=e.time?N(e):null,o=[8,10,12,14,16,18,20,22];return`<div class="lanes">
    <div class="lanes__head"><strong>Agenda dos dois em ${u(Q(e.date))}</strong></div>
    ${c.team.map(a=>{let n=c.eventsOn(e.date,{person:a.id}).filter(l=>l.id!==e.id&&l.time),r=(e.assignees||[]).includes(a.id),d=t.some(l=>l.level==="block"&&l.person===a.id);return`<div class="lane">
        <span class="lane__who">${J(a.id,22)}</span>
        <div class="lane__track">
          ${o.map(l=>`<i class="lane__tick" style="left:${q(l*60)}%"></i>`).join("")}
          ${n.map(l=>{let i=N(l),m=c.company(l.companyId);return`<span class="lane__ev" style="left:${q(i[0])}%;width:max(4px,${q(i[1])-q(i[0])}%);background:${m?.color||"#888"}" title="${u(U(l))}"></span>`}).join("")}
          ${s&&r?`<span class="lane__draft${d?" is-clash":""}" style="left:${q(s[0])}%;width:max(6px,${q(s[1])-q(s[0])}%)"></span>`:""}
        </div>
      </div>`}).join("")}
    <div class="lane lane--axis"><span class="lane__who"></span><div class="lane__track">${o.map(a=>`<small style="left:${q(a*60)}%">${a}h</small>`).join("")}</div></div>
  </div>`}function ht(e,t){if(!e.date)return"";let s=te(e,{isNew:t}),o=s.filter($=>$.level==="block"),a=s.filter($=>$.level==="warn"),n=s.filter($=>$.level==="info"),r=ce(e,{limit:4}),d=de(e),l=(e.assignees||[]).length===1?e.assignees[0]:null,i=o.length&&l?c.team.find($=>$.id!==l&&d.includes($.id)):null,m=b[e.type],h=$=>`<li class="issue issue--${$.level}">${f($.level==="block"?"alert":$.level==="warn"?"flag":$.code==="partner"?"user":"bulb",15)}<div><strong>${u($.title)}</strong><p>${u($.text)}</p></div></li>`;return`
  <section class="assist">
    <header class="assist__head">${f("sparkle",16)} Assistente</header>
    ${vt(e,s)}
    ${s.length?`<ul class="issues">${[...o,...a,...n].map(h).join("")}</ul>`:e.time?`<p class="assist__ok">${f("check",15)} Hor\xE1rio livre para ${u(Z(e.assignees))}, sem conflitos.</p>`:""}
    ${i?`<button type="button" class="tchip tchip--wide" data-setwho="${i.id}">${J(i.id,18)} Passar para ${u(i.name)} (est\xE1 livre)</button>`:""}
    <div class="assist__sugg">
      <p>${u(m.tip)}</p>
      ${r.length?`<div class="hintbox__times">${r.map($=>`<button type="button" class="tchip${e.time===$.time?" is-on":""}" data-settime="${$.time}">${w($.time)}${$.peak?"<small>pico</small>":"<small>livre</small>"}</button>`).join("")}</div>`:`<p class="muted">Nenhum hor\xE1rio livre nesse dia${(e.assignees||[]).length?" para "+u(Z(e.assignees)):""}. Tente outro dia ou outra pessoa.</p>`}
    </div>
  </section>`}async function Me(e,t,s,o){let n=te(e,{isNew:t}).filter(h=>h.level==="block");if(!n.length)return!0;let r=ce(e,{limit:2}),d=(e.assignees||[]).length===1?e.assignees[0]:null,l=d&&c.team.find(h=>h.id!==d&&de(e).includes(h.id)),i=[...r.map(h=>({label:`Mudar para ${w(h.time)} (livre)`,value:"time:"+h.time,primary:!0})),...l?[{label:`Passar para ${l.name} (est\xE1 livre)`,value:"who:"+l.id,primary:!r.length}]:[],{label:"Marcar mesmo assim",value:"force"}],m=await Y({title:n[0].code==="duplicate"?"Isso j\xE1 est\xE1 na agenda":"J\xE1 tem compromisso nesse hor\xE1rio",bodyHtml:`<ul class="issues issues--dialog">${n.map(h=>`<li class="issue issue--block">${f("alert",15)}<div><strong>${u(h.title)}</strong><p>${u(h.text)}</p></div></li>`).join("")}</ul>`,options:i});return m?m==="force"?!0:(m.startsWith("time:")&&(e.time=m.slice(5)),m.startsWith("who:")&&(e.assignees=[m.slice(4)]),o(),Me(e,t,s,o)):!1}async function $t(e,t){let s={...e,...t},o=te(s).filter(n=>n.level==="block");return o.length?await Y({title:"J\xE1 tem compromisso nesse hor\xE1rio",bodyHtml:`<ul class="issues issues--dialog">${o.map(n=>`<li class="issue issue--block">${f("alert",15)}<div><strong>${u(n.title)}</strong><p>${u(n.text)}</p></div></li>`).join("")}</ul>`,options:[{label:"Mover mesmo assim",value:"force",primary:!0}]})==="force":!0}function gt(e,t){let s=[],o=e,a=t.until&&t.until>=e?t.until:E(e,28);for(;o<=a&&s.length<150;){let n=j(o).getDay();(t.mode==="daily"||t.mode==="weekdays"&&n>=1&&n<=5||t.mode==="weekly"&&j(o).getDay()===j(e).getDay())&&s.push(o),o=E(o,1)}return s}var bt=["type","companyId","title","time","duration","assignees","location","description","internalNote","reminder","visibleToClient"];async function yt(e,t){let s=bt.filter(o=>JSON.stringify(e[o])!==JSON.stringify(t[o]));if(e.seriesId&&s.length){let o=c.state.events.filter(a=>a.seriesId===e.seriesId&&a.date>t.date);if(o.length){let a=await Y({title:"Evento repetido",text:"Aplicar as altera\xE7\xF5es a quais eventos?",options:[{label:"S\xF3 a este",value:"one",primary:!0},{label:`A este e aos pr\xF3ximos (${o.length+1})`,value:"next"}]});if(!a)return;if(a==="next"){let n=Object.fromEntries(s.map(r=>[r,e[r]]));await c.upsertMany("events",[{...e},...o.map(r=>({...r,...n}))],{activity:{kind:"series-edit",count:o.length+1,label:`${b[e.type].label} \xB7 a partir de ${e.date.slice(8)}/${e.date.slice(5,7)}`,sample:{companyId:e.companyId,date:e.date}}}),k("S\xE9rie atualizada");return}}}await c.upsert("events",{...e}),k("Altera\xE7\xF5es salvas")}export{D as a,kt as b,J as c,ot as d,A as e,be as f,ye as g,L as h,Ct as i,B as j,k,F as l,Y as m,xe as n,N as o,U as p,ce as q,it as r,Ot as s,qt as t,Ke as u,fa as v,Xe as w,$t as x,Xt as y,Zt as z,_e as A};
