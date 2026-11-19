import{a as pe,b as Le,d as Oe,e as qe,f as c,i as Re}from"./c-5UDHGMRO.js";import{a as f}from"./c-SMTRSMWP.js";import{A as u,B as Me,C as P,D as De,F as Ae,b as q,c as E,d as x,e as Ie,f as ne,i as g,j as L,k as K,l as k,m as Te,q as Ne,s as Ce,t as z,u as W,v as F,y as j}from"./c-UWUJNFLO.js";import{a as y,b as je,c as _,d as T,e as oe,f as ue,h as le,i as Pe,j as me,k as fe}from"./c-3GA6RSWB.js";import{a as se}from"./c-W6W2IM5K.js";var Be=(()=>{try{return JSON.parse(localStorage.getItem("pauta.ui")||"{}")}catch{return{}}})(),D={tab:Be.tab||"hoje",person:Be.person||"all",date:E(),month:ne(E()),monthSel:E(),monthCompany:null,showAllTips:!1};function $t(){try{localStorage.setItem("pauta.ui",JSON.stringify({tab:D.tab,person:D.person}))}catch{}}function J(e,t=26){let s=c.member(e);return s?`<span class="avatar" style="--s:${t}px;background:${s.color}" title="${u(s.name)}">${u(s.name[0])}</span>`:""}function Ze(e=[],t=24){return e.length?`<span class="avatars">${e.map(s=>J(s,t)).join("")}</span>`:`<span class="avatar avatar--empty" style="--s:${t}px" title="Sem respons\xE1vel">?</span>`}var X=(e=[])=>{let t=e.map(s=>c.member(s)?.name).filter(Boolean);return t.length?t.length===c.team.length&&t.length>1?"Os dois":t.join(" e "):"Sem respons\xE1vel"};function C(e,t=36,s=null){let n=s??Math.round(t*.28);return e?e.logo?`<span class="logo logo--img" style="--s:${t}px;--r:${n}px"><img src="${u(e.logo)}" alt=""></span>`:`<span class="logo" style="--s:${t}px;--r:${n}px;background:${e.color};color:${De(e.color)}">${u(Me(e.name))}</span>`:`<span class="logo" style="--s:${t}px;--r:${n}px;background:#999">?</span>`}function ve(e,{solid:t=!1}={}){let s=y[e]||y.outro;return`<span class="tbadge tbadge--${e}${t?" is-solid":""}">${f(s.icon,13)}${s.label}</span>`}function He(e){if(!e.time)return"Dia todo";let t=y[e.type];return t&&(t.kind==="shoot"||t.kind==="meeting"||t.kind==="work"||e.duration)?t.kind==="post"&&!e.duration?k(e.time):`${k(e.time)}\u2013${k(L(g(e.time)+T(e)))}`:k(e.time)}function he(e,{showDate:t=!1,compact:s=!1,highlight:n=[]}={}){let a=c.company(e.companyId),o=a?.color||"#888",r=e.status==="feito",l=e.date===E()&&e.time&&g(e.time)+T(e)<K()&&e.status==="pendente",m=n.includes(e.id);return`
  <article class="ecard${r?" is-done":""}${l?" is-late":""}${m?" is-flagged":""}${s?" is-compact":""}"
    style="--cc:${o};--cc-soft:${P(o,.1)}" data-action="open-event" data-id="${e.id}">
    <div class="ecard__time">
      <strong>${e.time?k(e.time):"\u2014"}</strong>
      ${t?`<small>${u(e.date.slice(8))}/${u(e.date.slice(5,7))}</small>`:e.time&&(y[e.type]?.kind!=="post"||e.duration)?`<small>${k(L(g(e.time)+T(e)))}</small>`:""}
    </div>
    <div class="ecard__body">
      <div class="ecard__top">
        ${C(a,20,6)}
        <span class="ecard__company">${u(a?.name||"Sem empresa")}</span>
        ${ve(e.type)}
      </div>
      <div class="ecard__title">${u(e.title||y[e.type]?.label||"Evento")}</div>
      ${s?"":`<div class="ecard__meta">
        ${Ze(e.assignees,20)}<span>${u(X(e.assignees))}</span>
        ${e.location?`<span class="ecard__loc">${f("pin",12)}${u(e.location)}</span>`:""}
        ${l?'<span class="ecard__late">Atrasado</span>':""}
        ${e.visibleToClient===!1?`<span class="ecard__private" title="N\xE3o aparece para o cliente">${f("eyeoff",12)}</span>`:""}
      </div>`}
    </div>
    ${c.canEdit("events",e)?`<button class="ecard__check${r?" is-on":""}" data-action="toggle-done" data-id="${e.id}" aria-label="${r?"Desmarcar":"Marcar como feito"}">
      ${f("check",16)}
    </button>`:""}
  </article>`}function $e(e,t,s=""){return`<div class="empty">${f("sparkle",28)}<h3>${u(e)}</h3><p>${u(t)}</p>${s}</div>`}var Q=[];function A({html:e,onMount:t,className:s="",onClose:n}){let a=document.getElementById("sheets"),o=document.createElement("div");o.className="sheet-wrap",o.innerHTML=`<div class="sheet-backdrop" data-close></div>
    <section class="sheet ${s}" role="dialog" aria-modal="true">
      <div class="sheet__grab" data-grab><span></span></div>
      <div class="sheet__inner"></div>
    </section>`,a.appendChild(o);let r=o.querySelector(".sheet__inner"),d=o.querySelector(".sheet"),i={el:r,panel:d,set(p){r.innerHTML=p,t&&t(i)},close(){if(i.closed)return;i.closed=!0,o.classList.remove("is-open");let p=Q.indexOf(i);p>=0&&Q.splice(p,1),setTimeout(()=>o.remove(),280),n&&n(),document.body.classList.toggle("has-sheet",Q.length>0)}};Q.push(i),i.set(e),document.body.classList.add("has-sheet"),requestAnimationFrame(()=>requestAnimationFrame(()=>o.classList.add("is-open"))),o.addEventListener("click",p=>{p.target.closest("[data-close]")&&i.close()});let l=null,m=0,h=o.querySelector("[data-grab]"),$=p=>{!p.target.closest("[data-grab], .sheet__head")||p.target.closest("button, input, select, textarea")||(l=p.touches[0].clientY,m=0,d.style.transition="none")},I=p=>{l!=null&&(m=Math.max(0,p.touches[0].clientY-l),d.style.transform=`translateY(${m}px)`)},v=()=>{l!=null&&(d.style.transition="",d.style.transform="",m>110&&i.close(),l=null)};return d.addEventListener("touchstart",$,{passive:!0}),d.addEventListener("touchmove",I,{passive:!0}),d.addEventListener("touchend",v),h&&h.addEventListener("click",()=>{}),i}var _t=()=>Q;function R(e,{left:t="",right:s=""}={}){return`<header class="sheet__head">
    <div class="sheet__head-l">${t||'<button class="btn-text" data-close>Fechar</button>'}</div>
    <h2>${u(e)}</h2>
    <div class="sheet__head-r">${s}</div>
  </header>`}var Ue;function w(e,{action:t,onAction:s,ms:n=2600}={}){let a=document.getElementById("toast");a.innerHTML=`<span>${u(e)}</span>${t?`<button>${u(t)}</button>`:""}`,a.classList.add("is-on"),t&&(a.querySelector("button").onclick=()=>{a.classList.remove("is-on"),s&&s()}),clearTimeout(Ue),Ue=setTimeout(()=>a.classList.remove("is-on"),n)}function B({title:e,text:t="",ok:s="Confirmar",danger:n=!1}){return new Promise(a=>A({className:"sheet--dialog",html:`<div class="dialog">
        <h3>${u(e)}</h3>${t?`<p>${u(t)}</p>`:""}
        <button class="btn ${n?"btn--danger":"btn--primary"} btn--block" data-ok>${u(s)}</button>
        <button class="btn btn--ghost btn--block" data-close>Cancelar</button>
      </div>`,onClose:()=>a(!1),onMount:r=>{r.el.querySelector("[data-ok]").onclick=()=>{a(!0),r.close()}}}))}function G({title:e,text:t="",bodyHtml:s="",options:n}){return new Promise(a=>{let o=null;A({className:"sheet--dialog",html:`<div class="dialog">
        <h3>${u(e)}</h3>${t?`<p>${u(t)}</p>`:""}${s}
        ${n.map((r,d)=>`<button class="btn ${r.danger?"btn--danger":r.primary?"btn--primary":"btn--soft"} btn--block" data-i="${d}">${u(r.label)}</button>`).join("")}
        <button class="btn btn--ghost btn--block" data-close>Cancelar</button>
      </div>`,onClose:()=>a(o),onMount:r=>{r.el.querySelectorAll("[data-i]").forEach(d=>d.onclick=()=>{o=n[+d.dataset.i].value,r.close()})}})})}var et={workStart:"08:00",workEnd:"19:00",lunchStart:"12:00",lunchEnd:"13:00",daysOff:[0],travelMin:45,maxTasks:8},ge=()=>({...et,...c.state.settings.find(e=>e.id==="routine")||{}}),M=e=>{let t=g(e.time);return t==null?null:[t,t+T(e)]},V=(e,t)=>e&&t&&e[0]<t[1]&&t[0]<e[1],Y=e=>["shoot","meeting"].includes(y[e.type]?.kind),Ve=e=>!_(e.type),ye=e=>c.company(e.companyId)?.name||"",H=e=>`${y[e.type]?.label||"Evento"}${ye(e)?" \xB7 "+ye(e):""}`,U=e=>c.member(e)?.name||"\u2014",be=e=>_(e.type)&&!e.duration?`\xE0s ${k(e.time)}`:`das ${k(e.time)} \xE0s ${k(L(M(e)[1]))}`,Fe=(e,t)=>(e.location||e.companyId)===(t.location||t.companyId),Z=(e,t,s)=>c.state.events.filter(n=>n.date===t&&n.id!==s&&n.time&&n.status!=="feito"&&(n.assignees||[]).includes(e));function ee(e,{isNew:t=!1}={}){let s=[];if(!e.date)return s;let n=ge(),a=e.time?[g(e.time),g(e.time)+T(e)]:null,o=e.assignees||[];if(a){o.forEach(l=>{Z(l,e.date,e.id).forEach(m=>{if(!V(a,M(m)))return;let h=_(e.type)!==_(m.type)&&(_(e.type)||_(m.type));s.push({level:"block",code:"overlap",person:l,eventIds:[m.id],title:`${U(l)} j\xE1 tem compromisso nesse hor\xE1rio`,text:`${H(m)} ${be(m)}${m.createdBy?` (marcado por ${m.createdBy===c.me?"voc\xEA":U(m.createdBy)})`:""}.`+(h?" Se for manter, deixe o post programado antes.":"")})})}),c.state.events.filter(l=>l.id!==e.id&&l.date===e.date&&l.companyId===e.companyId&&l.type===e.type&&l.time&&Math.abs(g(l.time)-a[0])<=30).forEach(l=>{s.some(m=>m.eventIds?.includes(l.id))||s.push({level:"block",code:"duplicate",eventIds:[l.id],title:"Parece que isso j\xE1 foi marcado",text:`J\xE1 existe ${H(l)} ${be(l)}, com ${(l.assignees||[]).map(U).join(" e ")||"ningu\xE9m"}${l.createdBy?`, marcado por ${l.createdBy===c.me?"voc\xEA":U(l.createdBy)}`:""}.`})}),Y(e)&&o.forEach(l=>{Z(l,e.date,e.id).filter(Y).forEach(m=>{let h=M(m),$=a[0]>=h[1]?a[0]-h[1]:h[0]>=a[1]?h[0]-a[1]:-1;$>=0&&$<n.travelMin&&!Fe(e,m)&&s.push({level:"warn",code:"travel",person:l,eventIds:[m.id],title:`Pouco tempo de deslocamento para ${U(l)}`,text:`S\xF3 ${$} min entre isto e ${H(m)} (${k(m.time)}). O combinado \xE9 ${n.travelMin} min.`})})});let d=g(n.workStart),i=g(n.workEnd);Ve(e)&&(a[0]<d||a[1]>i)?s.push({level:"warn",code:"hours",title:"Fora do expediente",text:`O hor\xE1rio de trabalho de voc\xEAs \xE9 das ${k(n.workStart)} \xE0s ${k(n.workEnd)}. Preservar o tempo livre evita esgotamento.`}):_(e.type)&&(a[0]<d||a[0]>=i)&&s.push({level:"info",code:"hours",title:"Post fora do expediente",text:"Deixe programado no Meta Business Suite para ningu\xE9m precisar parar o descanso para postar."}),Ve(e)&&V(a,[g(n.lunchStart),g(n.lunchEnd)])&&s.push({level:"warn",code:"lunch",title:"Invade o almo\xE7o",text:`O almo\xE7o de voc\xEAs \xE9 das ${k(n.lunchStart)} \xE0s ${k(n.lunchEnd)}.`}),a[1]>1440&&s.push({level:"warn",code:"midnight",title:"Passa da meia-noite",text:"Confira a dura\xE7\xE3o."}),t&&(e.date<E()||e.date===E()&&a[0]<K()-5)&&s.push({level:"warn",code:"past",title:"Esse hor\xE1rio j\xE1 passou",text:"Confira o dia e a hora."}),["feed","reels","carrossel"].includes(e.type)&&c.state.events.filter(l=>l.id!==e.id&&l.date===e.date&&l.companyId===e.companyId&&["feed","reels","carrossel"].includes(l.type)&&l.time).forEach(l=>{let m=Math.abs(g(l.time)-a[0]);m>30&&m<180&&s.push({level:"warn",code:"spacing",eventIds:[l.id],title:"Posts da mesma empresa muito pr\xF3ximos",text:`${H(l)} \xE0s ${k(l.time)}. Espacem pelo menos 3 h.`})}),c.team.filter(l=>!o.includes(l.id)).forEach(l=>{Z(l.id,e.date,e.id).filter(m=>V(a,M(m))).forEach(m=>{s.push({level:"info",code:"partner",person:l.id,eventIds:[m.id],title:`${l.name} nesse hor\xE1rio`,text:`${H(m)} ${be(m)}${m.location?" \xB7 "+m.location:""}.`})})})}let r=q(e.date).getDay();return n.daysOff.includes(r)&&!_(e.type)&&s.push({level:"warn",code:"dayoff",title:`${Te[r]} \xE9 dia de folga`,text:"Se der, mude para um dia \xFAtil. Posts podem ficar programados."}),o.forEach(d=>{let i=c.state.events.filter(l=>l.date===e.date&&l.id!==e.id&&(l.assignees||[]).includes(d)).length+1;i>n.maxTasks&&s.push({level:"warn",code:"load",person:d,title:`${U(d)} ficaria sobrecarregado`,text:`${i} tarefas nesse dia (limite combinado: ${n.maxTasks}).`})}),s}function ie(e,{limit:t=3,people:s=null}={}){if(!e.date)return[];let n=ge(),a=s||(e.assignees?.length?e.assignees:[]),o=T(e),r=_(e.type),d=r?420:g(n.workStart),i=r?1320:g(n.workEnd),l=[g(n.lunchStart),g(n.lunchEnd)],m=(y[e.type]?.best||[]).map(g),h=e.date===E()?Math.ceil((K()+15)/15)*15:0,$=c.state.events.filter(p=>p.id!==e.id&&p.date===e.date&&p.companyId&&p.companyId===e.companyId&&p.time&&(p.type===e.type||r&&_(p.type)&&p.type!=="story"&&e.type!=="story")).map(p=>({t:g(p.time),gap:p.type===e.type&&e.type==="story"?45:p.type===e.type?180:120})),I=[];for(let p=Math.max(d,h);p+o<=i;p+=15){let b=[p,p+o];if(!r&&V(b,l)||$.some(S=>Math.abs(S.t-p)<S.gap)||a.some(S=>Z(S,e.date,e.id).some(de=>{let Se=M(de);return V(b,Se)?!0:Y(e)&&Y(de)&&!Fe(e,de)?V([b[0]-n.travelMin,b[1]+n.travelMin],Se):!1})))continue;let N=m.length?Math.min(...m.map(S=>Math.abs(S-p))):Math.abs(p-g(n.workStart)-60);I.push({time:L(p),score:N})}I.sort((p,b)=>p.score-b.score);let v=[];for(let p of I)if(v.every(b=>Math.abs(g(b.time)-g(p.time))>=60)&&v.push(p),v.length>=t)break;return v.sort((p,b)=>g(p.time)-g(b.time)).map(p=>({...p,peak:p.score<=30}))}function re(e){if(!e.time)return c.team.map(s=>s.id);let t=[g(e.time),g(e.time)+T(e)];return c.team.filter(s=>!Z(s.id,e.date,e.id).some(n=>V(t,M(n)))).map(s=>s.id)}function tt(e,t){let s=ge();if(s.daysOff.includes(q(t).getDay()))return{minutes:null,longest:null,dayOff:!0};let n=g(s.workStart),a=g(s.workEnd),o=[[g(s.lunchStart),g(s.lunchEnd)]];c.eventsOn(t,{person:e}).filter(l=>l.time).forEach(l=>{let m=M(l);o.push([m[0],_(l.type)?m[0]+15:m[1]+(Y(l)?30:0)])}),o.sort((l,m)=>l[0]-m[0]);let r=n,d=0,i=0;return o.forEach(([l,m])=>{if(l>=a||m<=n)return;let h=Math.max(l,n),$=Math.min(m,a);$<=r||(h>r&&(d+=h-r,i=Math.max(i,h-r)),r=Math.max(r,$))}),a>r&&(d+=a-r,i=Math.max(i,a-r)),{minutes:d,longest:i,dayOff:!1}}function Tt(e,t,s){let n=[],a=_(t.type)&&!_(s.type)?t:_(s.type)&&!_(t.type)?s:(t.createdAt||0)>(s.createdAt||0)?t:s,o=c.team.find(d=>d.id!==e);o&&re(a).includes(o.id)&&(a.assignees||[]).length===1&&n.push({label:`Passar para ${o.name}`,eventId:a.id,patch:{assignees:[o.id]}});let r=ie(a,{limit:1})[0];return r&&n.push({label:`Mover ${y[a.type].label.toLowerCase()} para ${k(r.time)}`,eventId:a.id,patch:{time:r.time}}),n}function Nt(e,t="all"){let s=t==="all"?c.team:c.team.filter(o=>o.id===t),n=[];return c.eventsOn(e,{person:t}).length?(s.forEach(o=>{let r=c.eventsOn(e,{person:o.id}),d=tt(o.id,e),i=r.filter(Y),l=[`${r.length} tarefa${r.length===1?"":"s"}`];i.length&&l.push(`sai para ${i.map(m=>`${ye(m)} \xE0s ${k(m.time)}`).join(" e ")}`),d.dayOff?l.push("\xE9 dia de folga"):d.minutes!=null&&l.push(d.minutes>=30?`${F(d.minutes)} livres no expediente (maior intervalo: ${F(d.longest)})`:"quase sem tempo livre"),n.push(`${o.name}: ${l.join(", ")}.`)}),n):[`Nenhum compromisso${t==="all"?"":" para "+U(t)}. Bom dia para planejar a pauta ou adiantar edi\xE7\xF5es.`]}var at={feed:"\u{1F5BC}\uFE0F",carrossel:"\u{1F5C2}\uFE0F",reels:"\u{1F3AC}",story:"\u2B55",captacao:"\u{1F4F8}",reuniao:"\u{1F91D}",producao:"\u2702\uFE0F",outro:"\u2022"},te=e=>String(e||"").replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\r?\n/g,"\\n"),st=e=>{let t=[];for(;e.length>74;)t.push(e.slice(0,74)),e=" "+e.slice(74);return t.push(e),t.join(`\r
`)},Je=(e,t)=>e.replace(/-/g,"")+"T"+t.replace(":","")+"00",nt=()=>new Date().toISOString().replace(/[-:]/g,"").replace(/\.\d+/,"");function ot(e,t){let s=["BEGIN:VCALENDAR","VERSION:2.0",`PRODID:-//${se.appName}//PT-BR`,"CALSCALE:GREGORIAN","METHOD:PUBLISH",`X-WR-CALNAME:${te(t)}`];return e.forEach(n=>{let a=c.company(n.companyId),o=(n.assignees||[]).map(l=>c.member(l)?.name).filter(Boolean).join(" e "),r=`${at[n.type]||""} ${y[n.type]?.label||"Evento"} \xB7 ${a?.name||""}${n.title?" \u2014 "+n.title:""}`.trim(),d=[o&&`Respons\xE1vel: ${o}`,n.description,n.internalNote&&`Nota interna: ${n.internalNote}`].filter(Boolean).join(`
`);if(s.push("BEGIN:VEVENT",`UID:${n.id}@pauta`,`DTSTAMP:${nt()}`),n.time){let l=g(n.time)+T(n),m=l>=1440?x(n.date,1):n.date;s.push(`DTSTART:${Je(n.date,n.time)}`,`DTEND:${Je(m,L(l%1440))}`)}else s.push(`DTSTART;VALUE=DATE:${n.date.replace(/-/g,"")}`,`DTEND;VALUE=DATE:${x(n.date,1).replace(/-/g,"")}`);s.push(`SUMMARY:${te(r)}`),d&&s.push(`DESCRIPTION:${te(d)}`),n.location&&s.push(`LOCATION:${te(n.location)}`);let i=n.reminder??30;i>=0&&s.push("BEGIN:VALARM","ACTION:DISPLAY",`DESCRIPTION:${te(r)}`,`TRIGGER:-PT${i}M`,"END:VALARM"),s.push("END:VEVENT")}),s.push("END:VCALENDAR"),s.map(st).join(`\r
`)}async function Ge(e,t,s){let n=ot(e,s),a=Re();if(a){let i=document.createElement("form");i.method="POST",i.action=a.replace(/\/$/,"")+"/ics",i.target="_blank",i.style.display="none";let l=document.createElement("textarea");l.name="ics",l.value=n,i.appendChild(l),document.body.appendChild(i),i.submit(),i.remove();return}let o=new File([n],t,{type:"text/calendar"});if(navigator.canShare&&navigator.canShare({files:[o]}))try{await navigator.share({files:[o],title:s});return}catch(i){if(i&&i.name==="AbortError")return}let r=URL.createObjectURL(o),d=document.createElement("a");d.href=r,d.download=t,document.body.appendChild(d),d.click(),d.remove(),setTimeout(()=>URL.revokeObjectURL(r),4e3)}function Jt(){let e=c.companiesSorted(),t=E(),s=Ie(t),n=x(s,6);return`
  <header class="hdr">
    <div class="hdr__row">
      <div class="hdr__titles"><p class="hdr__eyebrow">${e.length} cliente${e.length===1?"":"s"}</p><h1>Empresas</h1></div>
      <div class="hdr__actions"><button class="btn btn--primary btn--sm" data-action="new-company">${f("plus",16)} Nova</button></div>
    </div>
  </header>
  <div class="page">
    ${e.length?"":$e("Nenhuma empresa ainda","Cadastre os clientes com nome, cor e logomarca. Cada um ganha um link pr\xF3prio para ver s\xF3 o seu cronograma.",`<button class="btn btn--primary" data-action="new-company">${f("plus",18)} Cadastrar empresa</button>`)}
    <div class="colist">
      ${e.map(a=>{let o=c.eventsBetween(s,n,{companyId:a.id}),r=o.filter(l=>_(l.type)).length,d=o.filter(l=>l.type==="captacao").length,i=c.state.events.filter(l=>l.companyId===a.id&&l.date>=t&&l.status!=="feito").sort((l,m)=>(l.date+l.time).localeCompare(m.date+m.time))[0];return`<button class="cocard" style="--cc:${a.color};--cc-soft:${P(a.color,.1)}" data-action="open-company" data-id="${a.id}">
          <div class="cocard__top">
            ${C(a,48)}
            <div class="cocard__name"><strong>${u(a.name)}</strong>${a.instagram?`<small>${f("insta",12)} @${u(a.instagram)}</small>`:""}</div>
            ${f("right",18,"muted")}
          </div>
          <div class="cocard__stats">
            <span><b>${r}</b> posts</span><span><b>${d}</b> capta\xE7${d===1?"\xE3o":"\xF5es"}</span><span class="muted">nesta semana</span>
          </div>
          ${i?`<div class="cocard__next">${f(y[i.type].icon,14)} <b>${u(z(i.date))}${i.time?" "+i.time:""}</b> \xB7 ${u(y[i.type].label)} \u2014 ${u(i.title||"")}</div>`:'<div class="cocard__next muted">Nada agendado</div>'}
        </button>`}).join("")}
    </div>
  </div>`}function Gt(e){let t=A({className:"sheet--tall",html:Ye(e),onMount:s=>lt(s,e)});t.refresh=()=>c.company(e)?t.set(Ye(e)):t.close()}function Ye(e){let t=c.company(e);if(!t)return"";let s=E(),n=ne(s),a=c.eventsBetween(`${n}-01`,`${n}-31`,{companyId:e}),o=c.eventsBetween(s,x(s,30),{companyId:e}),r=c.eventsBetween(x(s,-14),x(s,-1),{companyId:e}).reverse(),d=h=>a.filter($=>h.includes($.type)).length,i=a.filter(h=>h.status==="feito").length,l="",m=o.map(h=>{let $=h.date!==l?`<h4 class="dayhead">${u(W(h.date))}</h4>`:"";return l=h.date,$+he(h)}).join("");return`
  ${R("",{right:c.canEdit("companies",t)?'<button class="btn-text" data-act="edit">Editar</button>':""})}
  <div class="cohero" style="--cc:${t.color};--cc-soft:${P(t.color,.14)}">
    ${C(t,72,20)}
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
      <h2 class="block__title">${u(Ce(n))}</h2>
      <div class="mstats mstats--5">
        <div><b>${d(["feed","carrossel"])}</b><span>feed</span></div>
        <div><b>${d(["reels"])}</b><span>reels</span></div>
        <div><b>${d(["story"])}</b><span>stories</span></div>
        <div><b>${d(["captacao"])}</b><span>capta\xE7\xF5es</span></div>
        <div><b>${a.length?Math.round(i/a.length*100):0}%</b><span>feito</span></div>
      </div>
    </section>

    ${t.address||t.contact||t.notes?`<ul class="rows">
      ${t.address?`<li><span class="rows__k">${f("pin",16)} Endere\xE7o</span><a class="rows__v link" href="https://maps.apple.com/?q=${encodeURIComponent(t.address)}" target="_blank" rel="noopener">${u(t.address)}</a></li>`:""}
      ${t.contact?`<li><span class="rows__k">${f("user",16)} Contato</span><span class="rows__v">${u(t.contact)}</span></li>`:""}
      ${t.notes?`<li><span class="rows__k">${f("note",16)} Observa\xE7\xF5es</span><span class="rows__v">${u(t.notes)}</span></li>`:""}
    </ul>`:""}

    <section class="block">
      <h2 class="block__title">Pr\xF3ximos 30 dias</h2>
      ${m||$e("Nada agendado","Crie o cronograma de postagens desta empresa.")}
    </section>

    ${r.length?`<section class="block">
      <h2 class="block__title">\xDAltimas 2 semanas</h2>
      ${r.map(h=>he(h,{showDate:!0,compact:!0})).join("")}
    </section>`:""}
  </div>`}function lt(e,t){let s=e.el;(s.querySelector('[data-act="edit"]')||{}).onclick=()=>ke(t),s.querySelector('[data-act="new"]').onclick=async()=>{let{openEventEditor:n}=await import("./c-T4WC5SQC.js");n({companyId:t})},s.querySelector('[data-act="share"]').onclick=()=>we(t),s.querySelector('[data-act="clientview"]').onclick=()=>it(t)}function ke(e=null,t=null){let s=e?c.company(e):null,n=c.state.companies.map(d=>d.color),a=s?{...s}:{id:j("c_"),name:"",color:le.find(d=>!n.includes(d))||le[0],logo:null,instagram:"",address:"",contact:"",notes:"",shareToken:null},o=()=>`
    ${R(s?"Editar empresa":"Nova empresa",{left:'<button class="btn-text" data-close>Cancelar</button>',right:'<button class="btn btn--primary btn--sm" data-save>Salvar</button>'})}
    <form class="form" onsubmit="return false">
      <div class="logopick">
        <div data-preview>${C({...a,name:a.name||"?"},88,24)}</div>
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
    </form>`,r=d=>{let i=d.el,l=i.querySelector("form"),m=()=>{a.name=l.name.value.trim(),a.instagram=l.instagram.value.trim().replace(/^@/,""),a.address=l.address.value.trim(),a.contact=l.contact.value.trim(),a.notes=l.notes.value.trim()},h=()=>i.querySelector("[data-preview]").innerHTML=C({...a,name:l.name.value||"?"},88,24);l.name.addEventListener("input",h),i.querySelectorAll("[data-color]").forEach(v=>v.onclick=()=>{a.color=v.dataset.color,i.querySelectorAll("[data-color]").forEach(p=>p.classList.toggle("is-on",p===v)),h()}),i.querySelector("[data-customcolor]").oninput=v=>{a.color=v.target.value,i.querySelectorAll("[data-color]").forEach(p=>p.classList.remove("is-on")),h()},i.querySelector("[data-file]").onchange=async v=>{let p=v.target.files[0];if(p)try{m(),a.logo=await Ae(p,160),d.set(o())}catch{w("N\xE3o foi poss\xEDvel ler essa imagem")}};let $=i.querySelector("[data-rmlogo]");$&&($.onclick=()=>{m(),a.logo=null,d.set(o())});let I=i.querySelector("[data-delete]");I&&(I.onclick=async()=>{let v=c.state.events.filter(b=>b.companyId===a.id);await B({title:`Excluir ${a.name}?`,text:v.length?`Os ${v.length} eventos desta empresa tamb\xE9m ser\xE3o apagados e o link do cliente deixar\xE1 de funcionar.`:"O link do cliente deixar\xE1 de funcionar.",ok:"Excluir empresa",danger:!0})&&(await c.removeMany("events",v.map(b=>b.id)),await c.remove("companies",a.id),d.close(),w("Empresa exclu\xEDda"))}),i.querySelector("[data-save]").onclick=async()=>{if(m(),!a.name)return l.name.focus(),w("Digite o nome da empresa");await c.upsert("companies",{...a}),d.close(),w(s?"Empresa atualizada":"Empresa cadastrada"),t&&t(c.company(a.id))}};A({className:"sheet--tall",html:o(),onMount:r})}async function we(e){let t=c.company(e),s=c.mode==="cloud",n="";s?(await c.ensureShareToken(t),await c.publishCompany(e),n=Oe(c.company(e).shareToken)):n=qe(await Le(pe(t,c.state.events,{maxFuture:90})));let a=`
    ${R("Link do cliente")}
    <div class="share">
      <div class="share__co">${C(t,56)}<div><strong>${u(t.name)}</strong><small>v\xEA somente o pr\xF3prio cronograma</small></div></div>
      <ul class="checks">
        <li>${f("check",16)} Somente os eventos da ${u(t.name)}</li>
        <li>${f("check",16)} Sem notas internas e sem outras empresas</li>
        <li>${f("check",16)} Somente leitura: o cliente n\xE3o consegue alterar nada</li>
        <li>${f(s?"check":"alert",16)} ${s?"Sempre atualizado: tudo que voc\xEAs mudarem aparece para o cliente":"Foto do cronograma atual (pr\xF3ximos 90 dias). Quando mudar algo, envie o link de novo"}</li>
      </ul>
      <div class="share__link"><input readonly value="${u(n)}" data-link></div>
      <div class="share__btns">
        <button class="btn btn--primary btn--block" data-sharebtn>${f("share",18)} Enviar para o cliente</button>
        <button class="btn btn--soft btn--block" data-copy>${f("copy",18)} Copiar link</button>
        <a class="btn btn--ghost btn--block" href="${u(n)}" target="_blank" rel="noopener">${f("eye",18)} Ver como o cliente v\xEA</a>
      </div>
      ${s?'<button class="btn-text btn-text--sm btn-text--danger" data-revoke>Gerar novo link (o antigo para de funcionar)</button>':'<p class="fhelp">Dica: ative a sincroniza\xE7\xE3o na nuvem (Ajustes) para o link ficar sempre atualizado automaticamente.</p>'}
    </div>`;A({html:a,onMount:o=>{let r=o.el;r.querySelector("[data-copy]").onclick=async()=>{try{await navigator.clipboard.writeText(n),w("Link copiado")}catch{r.querySelector("[data-link]").select(),w("Selecione e copie o link")}},r.querySelector("[data-sharebtn]").onclick=async()=>{let i=`Ol\xE1! Este \xE9 o cronograma de conte\xFAdo da ${t.name}. Por aqui voc\xEAs acompanham tudo o que est\xE1 planejado: posts, stories, reels e capta\xE7\xF5es.`;if(navigator.share)try{await navigator.share({title:`Cronograma \xB7 ${t.name}`,text:i,url:n})}catch{}else await navigator.clipboard?.writeText(`${i}
${n}`),w("Mensagem copiada")};let d=r.querySelector("[data-revoke]");d&&(d.onclick=async()=>{await B({title:"Gerar um novo link?",text:"Quem tiver o link antigo n\xE3o conseguir\xE1 mais ver o cronograma.",ok:"Gerar novo link",danger:!0})&&(await c.regenerateShareToken(c.company(e)),o.close(),we(e))})}})}async function it(e){let t=c.company(e);if(!t)return;let{showClient:s}=await import("./c-3UELI7VQ.js"),{sanitizePayload:n}=await import("./c-JBFK46OY.js"),a=n(pe(t,c.state.events)),o=document.createElement("div");o.className="client-preview",o.innerHTML=`<div class="client-preview__bar"><button class="btn btn--soft btn--sm" data-closepv>${f("left",16)} Voltar</button><span>Assim o cliente v\xEA</span><button class="btn btn--primary btn--sm" data-sendpv>${f("share",16)} Enviar</button></div><div class="client-preview__body"></div>`,document.body.appendChild(o),document.body.classList.add("has-sheet"),s(o.querySelector(".client-preview__body"),a,{canGoBack:!1,preview:!0});let r=()=>{o.remove(),document.body.classList.toggle("has-sheet",!!document.querySelector(".sheet-wrap"))};o.querySelector("[data-closepv]").onclick=r,o.querySelector("[data-sendpv]").onclick=()=>{r(),we(e)}}function la(e){let t=A({html:Ke(e),className:"sheet--tall",onMount:s=>rt(s,e)});t.refresh=()=>{if(!c.event(e))return t.close();t.set(Ke(e))}}function Ke(e){let t=c.event(e);if(!t)return"";let s=c.company(t.companyId),n=s?.color||"#666",a=me.find(i=>i.v===(t.reminder??30)),o=t.seriesId?c.state.events.filter(i=>i.seriesId===t.seriesId).length:0,r=c.canEdit("events",t),d=c.member(c.ownerOf("events",t))?.name||"o parceiro";return`
  ${R("",{right:r?'<button class="btn-text" data-act="edit">Editar</button>':""})}
  <div class="detail">
    <div class="detail__hero" style="--cc:${n};--cc-soft:${P(n,.12)}">
      <div class="detail__co">${C(s,40)}<div><strong>${u(s?.name||"Sem empresa")}</strong>${s?.instagram?`<small>@${u(s.instagram)}</small>`:""}</div>${ve(t.type,{solid:!0})}</div>
      <h2>${u(t.title||y[t.type].label)}</h2>
      <p class="detail__when">${f("calendar",15)} ${u(z(t.date))}, ${u(Ne(t.date).split(", ")[1])} \xB7 ${f("clock",15)} ${u(He(t))}</p>
    </div>

    ${r?"":`<p class="detail__lock">${f("eye",14)} Cadastrado por ${u(d)} \u2014 voc\xEA s\xF3 pode ver. Use \u201CDuplicar\u201D para criar uma c\xF3pia sua.</p>`}
    <div class="seg seg--status"${r?"":" hidden"}>
      ${ue.map(i=>`<button class="seg__btn${t.status===i?" is-on":""} st-${i}" data-status="${i}">${i==="feito"?f("check",14):""}${oe[i].label}</button>`).join("")}
    </div>

    <ul class="rows">
      <li><span class="rows__k">${f("users",16)} Respons\xE1vel</span><span class="rows__v">${(t.assignees||[]).map(i=>J(i,22)).join("")} ${u(X(t.assignees))}</span></li>
      ${t.location?`<li><span class="rows__k">${f("pin",16)} Local</span><a class="rows__v link" href="https://maps.apple.com/?q=${encodeURIComponent(t.location)}" target="_blank" rel="noopener">${u(t.location)}</a></li>`:""}
      ${y[t.type].kind!=="post"||t.duration?`<li><span class="rows__k">${f("clock",16)} Dura\xE7\xE3o</span><span class="rows__v">${u(F(T(t)))}</span></li>`:""}
      <li><span class="rows__k">${f("bell",16)} Lembrete</span><span class="rows__v">${u(a?.label||"\u2014")}</span></li>
      ${o?`<li><span class="rows__k">${f("repeat",16)} Repeti\xE7\xE3o</span><span class="rows__v">${o} eventos na s\xE9rie</span></li>`:""}
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
  </div>`}function rt(e,t){let s=e.el;s.querySelectorAll("[data-status]").forEach(a=>a.onclick=async()=>{let o=c.event(t);await c.upsert("events",{...o,status:a.dataset.status})});let n=(a,o)=>{let r=s.querySelector(`[data-act="${a}"]`);r&&(r.onclick=o)};n("edit",()=>ze({id:t})),n("dup",async()=>{let o={...c.event(t),id:j("e_"),status:"pendente",seriesId:null,createdAt:null,createdBy:null};await c.upsert("events",o),e.close(),w("Evento duplicado"),ze({id:o.id})}),n("tomorrow",async()=>{let a=c.event(t);await ut(a,{date:x(a.date,1)})&&(await c.upsert("events",{...a,date:x(a.date,1)}),w("Movido para "+z(x(a.date,1)).toLowerCase(),{action:"Desfazer",onAction:()=>c.upsert("events",{...c.event(t),date:a.date})}))}),n("ics",()=>{let a=c.event(t);Ge([a],`${y[a.type].label}-${a.date}.ics`,se.appName)}),n("del",()=>Qe(t,e))}async function Qe(e,t){let s=c.event(e),n=[e];if(s.seriesId){let o=c.state.events.filter(r=>r.seriesId===s.seriesId&&r.date>=s.date).map(r=>r.id);if(o.length>1){let r=await G({title:"Excluir evento repetido",options:[{label:"S\xF3 este",value:"one",danger:!0},{label:`Este e os pr\xF3ximos (${o.length})`,value:"next",danger:!0}]});if(!r)return;r==="next"&&(n=o)}else if(!await B({title:"Excluir este evento?",ok:"Excluir",danger:!0}))return}else if(!await B({title:"Excluir este evento?",text:"Ele some para a dupla e para o cliente.",ok:"Excluir",danger:!0}))return;let a=n.map(o=>({...c.event(o)}));await c.removeMany("events",n),t&&t.close(),w(n.length>1?`${n.length} eventos exclu\xEDdos`:"Evento exclu\xEDdo",{action:"Desfazer",onAction:()=>c.upsertMany("events",a),ms:4500})}function ze({id:e=null,date:t=null,companyId:s=null,type:n=null,time:a=null,assignees:o=null}={}){let r=e?c.event(e):null;if(r&&!c.canEdit("events",r)){c._denied("events",r);return}let d=c.companiesSorted(),i=n||"feed",l=r?JSON.parse(JSON.stringify(r)):{id:j("e_"),type:i,companyId:s||D.monthCompany||(d.length===1?d[0].id:null),title:"",date:t||(D.tab==="mes"?D.monthSel:D.date)||E(),time:a||y[i].best[0]||"12:00",duration:["shoot","meeting","work","other"].includes(y[i].kind)?y[i].dur:null,assignees:o||(D.person!=="all"?[D.person]:c.me?[c.me]:[]),location:"",description:"",internalNote:"",reminder:30,visibleToClient:y[i].client,status:"pendente"},m=r?JSON.parse(JSON.stringify(r)):null,h={mode:"none",until:x(l.date,28)};return A({className:"sheet--tall",html:Xe(l,!!r,h),onMount:I=>ct(I,l,m,h)})}var ce=e=>["shoot","meeting","work","other"].includes(y[e].kind),ae=e=>["shoot","meeting"].includes(y[e].kind);function Xe(e,t,s){let n=c.companiesSorted();return`
  ${R(t?"Editar evento":"Novo evento",{left:'<button class="btn-text" data-close>Cancelar</button>',right:'<button class="btn btn--primary btn--sm" data-save>Salvar</button>'})}
  <form class="form" data-editor onsubmit="return false">
    <div class="fgroup">
      <label class="flabel">O que \xE9?</label>
      <div class="typegrid">
        ${je.map(a=>`<button type="button" class="typebtn tbadge--${a}${e.type===a?" is-on":""}" data-type="${a}">${f(y[a].icon,20)}<span>${y[a].label}</span></button>`).join("")}
      </div>
    </div>

    <div class="fgroup">
      <label class="flabel">Empresa</label>
      <div class="cogrid">
        ${n.map(a=>`<button type="button" class="cobtn${e.companyId===a.id?" is-on":""}" style="--cc:${a.color}" data-company="${a.id}">${C(a,26,7)}<span>${u(a.name)}</span></button>`).join("")}
        <button type="button" class="cobtn cobtn--add" data-newco>${f("plus",18)}<span>Nova empresa</span></button>
      </div>
    </div>

    <div class="fgroup">
      <label class="flabel" for="f-title">T\xEDtulo</label>
      <input id="f-title" class="input" name="title" value="${u(e.title)}" placeholder="${u(y[e.type].placeholder)}" autocomplete="off" maxlength="120">
    </div>

    <div class="fgroup row2">
      <div><label class="flabel" for="f-date">Dia</label><input id="f-date" class="input" type="date" name="date" value="${e.date}" required></div>
      <div><label class="flabel" for="f-time">Hor\xE1rio</label><input id="f-time" class="input" type="time" name="time" value="${e.time||""}" step="300"></div>
    </div>

    <div class="fgroup" data-when="duration" ${ce(e.type)?"":"hidden"}>
      <label class="flabel" for="f-dur">Dura\xE7\xE3o</label>
      <select id="f-dur" class="input" name="duration">
        ${Pe.map(a=>`<option value="${a}"${(e.duration||y[e.type].dur)===a?" selected":""}>${F(a)}</option>`).join("")}
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

    <div class="fgroup" data-when="location" ${ae(e.type)?"":"hidden"}>
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
        <select name="reminder">${me.map(a=>`<option value="${a.v}"${(e.reminder??30)===a.v?" selected":""}>${a.label}</option>`).join("")}</select>
      </label>
      ${t?"":`<label class="list__row"><span>${f("repeat",18)} Repetir</span>
        <select name="repeat">${fe.map(a=>`<option value="${a.v}"${s.mode===a.v?" selected":""}>${a.label}</option>`).join("")}</select>
      </label>
      <label class="list__row" data-when="until" hidden><span>${f("calendar",18)} At\xE9</span>
        <input type="date" name="until" value="${s.until}">
      </label>`}
      <label class="list__row"><span>${f("eye",18)} Aparece para o cliente</span>
        <input type="checkbox" class="switch" name="visibleToClient" ${e.visibleToClient!==!1?"checked":""}>
      </label>
      ${t?`<label class="list__row"><span>${f("check",18)} Status</span>
        <select name="status">${ue.map(a=>`<option value="${a}"${e.status===a?" selected":""}>${oe[a].label}</option>`).join("")}</select>
      </label>`:""}
    </div>

    ${t?`<button type="button" class="btn btn--danger-soft btn--block" data-delete>${f("trash",18)} Excluir evento</button>`:""}
    <div class="form__spacer"></div>
  </form>`}function ct(e,t,s,n){let a=e.el,o=a.querySelector("[data-editor]"),r=v=>a.querySelector(v),d=()=>{let v=r("[data-hint]");v.innerHTML=pt(t,!s),v.querySelectorAll("[data-settime]").forEach(p=>p.onclick=()=>{t.time=p.dataset.settime,o.time.value=t.time,d()}),v.querySelectorAll("[data-setwho]").forEach(p=>p.onclick=()=>{t.assignees=[p.dataset.setwho],a.querySelectorAll("[data-who]").forEach(b=>b.classList.toggle("is-on",t.assignees.includes(b.dataset.who))),d()})},i=()=>{a.querySelector('[data-when="duration"]').hidden=!ce(t.type),a.querySelector('[data-when="location"]').hidden=!ae(t.type);let v=c.company(t.companyId),p=r("[data-useaddr]");p.hidden=!(v&&v.address&&o.location.value!==v.address);let b=a.querySelector('[data-when="until"]');b&&(b.hidden=n.mode==="none")};a.querySelectorAll("[data-type]").forEach(v=>v.onclick=()=>{let p=t.type;if(t.type=v.dataset.type,a.querySelectorAll("[data-type]").forEach(b=>b.classList.toggle("is-on",b===v)),o.title.placeholder=y[t.type].placeholder,(!s||p!==t.type)&&(t.duration=ce(t.type)?y[t.type].dur:null,o.duration.value=String(y[t.type].dur),s||(t.visibleToClient=y[t.type].client,o.visibleToClient.checked=t.visibleToClient)),ae(t.type)&&!o.location.value){let b=c.company(t.companyId);b?.address&&(o.location.value=b.address,t.location=b.address)}i(),d()}),a.querySelectorAll("[data-company]").forEach(v=>v.onclick=()=>{t.companyId=v.dataset.company,a.querySelectorAll("[data-company]").forEach(b=>b.classList.toggle("is-on",b===v));let p=c.company(t.companyId);ae(t.type)&&p?.address&&!o.location.value&&(o.location.value=p.address,t.location=p.address),i()}),r("[data-newco]").onclick=()=>{ke(null,v=>{t.companyId=v.id,l(),e.set(Xe(t,!!s,n))})},a.querySelectorAll("[data-who]").forEach(v=>v.onclick=()=>{let p=v.dataset.who;t.assignees=t.assignees.includes(p)?t.assignees.filter(b=>b!==p):[...t.assignees,p],v.classList.toggle("is-on",t.assignees.includes(p)),d()}),r("[data-useaddr]").onclick=()=>{let v=c.company(t.companyId);o.location.value=v.address,t.location=v.address,i()};let l=()=>{t.title=o.title.value.trim(),t.date=o.date.value,t.time=o.time.value||"",t.duration=ce(t.type)?Number(o.duration.value):null,t.location=ae(t.type)?o.location.value.trim():"",t.description=o.description.value.trim(),t.internalNote=o.internalNote.value.trim(),t.reminder=Number(o.reminder.value),t.visibleToClient=o.visibleToClient.checked,o.status&&(t.status=o.status.value),o.repeat&&(n.mode=o.repeat.value),o.until&&(n.until=o.until.value)};o.addEventListener("input",()=>{l(),i()}),o.addEventListener("change",()=>{l(),i(),d()});let m=r("[data-delete]");m&&(m.onclick=()=>Qe(t.id,null).then(()=>!c.event(t.id)&&e.close())),r("[data-save]").onclick=async()=>{if(l(),!h){if(!t.companyId){w("Escolha a empresa"),a.querySelector(".cogrid").scrollIntoView({behavior:"smooth",block:"center"});return}if(!t.date)return w("Escolha o dia");if(!(!t.assignees.length&&!await B({title:"Ningu\xE9m respons\xE1vel?",text:"Este evento ficar\xE1 sem respons\xE1vel. Deseja salvar assim mesmo?",ok:"Salvar assim"}))&&!h){h=!0;try{await $()}finally{h=!1}}}};let h=!1,$=async()=>{if(s){if(["date","time","duration","type","assignees","companyId"].some(p=>JSON.stringify(t[p])!==JSON.stringify(s[p]))&&!await Ee(t,!1,e,I))return;await vt(t,s)}else if(n.mode!=="none"){let v=mt(t.date,n),p=v.filter(N=>ee({...t,date:N},{isNew:!0}).some(S=>S.level==="block")),b=v;if(p.length){let N=await G({title:`${p.length} de ${v.length} datas j\xE1 t\xEAm compromisso nesse hor\xE1rio`,text:p.slice(0,6).map(S=>W(S)).join(" \xB7 ")+(p.length>6?" \u2026":""),options:[{label:`Criar s\xF3 nas ${v.length-p.length} datas livres`,value:"free",primary:!0},{label:"Criar em todas mesmo assim",value:"all"}]});if(!N)return;if(N==="free"&&(b=v.filter(S=>!p.includes(S))),!b.length)return w("Nenhuma data livre")}let xe=j("s_");await c.upsertMany("events",b.map((N,S)=>({...t,id:S===0?t.id:j("e_"),date:N,seriesId:xe})),{activity:{kind:"series",count:b.length,label:`${y[t.type].label} ${fe.find(N=>N.v===n.mode)?.label.toLowerCase()||""} \xE0s ${k(t.time)}`,sample:{companyId:t.companyId,date:b[0]}}}),w(`${b.length} eventos criados`)}else{if(!await Ee(t,!0,e,I))return;await c.upsert("events",{...t}),w("Evento salvo")}e.close()};function I(){o.time.value=t.time||"",o.date.value=t.date,a.querySelectorAll("[data-who]").forEach(v=>v.classList.toggle("is-on",t.assignees.includes(v.dataset.who))),i(),d()}i(),d()}var _e=420,We=1380,O=e=>(Math.min(Math.max(e,_e),We)-_e)/(We-_e)*100;function dt(e,t){let s=e.time?M(e):null,n=[8,10,12,14,16,18,20,22];return`<div class="lanes">
    <div class="lanes__head"><strong>Agenda dos dois em ${u(W(e.date))}</strong></div>
    ${c.team.map(a=>{let o=c.eventsOn(e.date,{person:a.id}).filter(i=>i.id!==e.id&&i.time),r=(e.assignees||[]).includes(a.id),d=t.some(i=>i.level==="block"&&i.person===a.id);return`<div class="lane">
        <span class="lane__who">${J(a.id,22)}</span>
        <div class="lane__track">
          ${n.map(i=>`<i class="lane__tick" style="left:${O(i*60)}%"></i>`).join("")}
          ${o.map(i=>{let l=M(i),m=c.company(i.companyId);return`<span class="lane__ev" style="left:${O(l[0])}%;width:max(4px,${O(l[1])-O(l[0])}%);background:${m?.color||"#888"}" title="${u(H(i))}"></span>`}).join("")}
          ${s&&r?`<span class="lane__draft${d?" is-clash":""}" style="left:${O(s[0])}%;width:max(6px,${O(s[1])-O(s[0])}%)"></span>`:""}
        </div>
      </div>`}).join("")}
    <div class="lane lane--axis"><span class="lane__who"></span><div class="lane__track">${n.map(a=>`<small style="left:${O(a*60)}%">${a}h</small>`).join("")}</div></div>
  </div>`}function pt(e,t){if(!e.date)return"";let s=ee(e,{isNew:t}),n=s.filter($=>$.level==="block"),a=s.filter($=>$.level==="warn"),o=s.filter($=>$.level==="info"),r=ie(e,{limit:4}),d=re(e),i=(e.assignees||[]).length===1?e.assignees[0]:null,l=n.length&&i?c.team.find($=>$.id!==i&&d.includes($.id)):null,m=y[e.type],h=$=>`<li class="issue issue--${$.level}">${f($.level==="block"?"alert":$.level==="warn"?"flag":$.code==="partner"?"user":"bulb",15)}<div><strong>${u($.title)}</strong><p>${u($.text)}</p></div></li>`;return`
  <section class="assist">
    <header class="assist__head">${f("sparkle",16)} Assistente</header>
    ${dt(e,s)}
    ${s.length?`<ul class="issues">${[...n,...a,...o].map(h).join("")}</ul>`:e.time?`<p class="assist__ok">${f("check",15)} Hor\xE1rio livre para ${u(X(e.assignees))}, sem conflitos.</p>`:""}
    ${l?`<button type="button" class="tchip tchip--wide" data-setwho="${l.id}">${J(l.id,18)} Passar para ${u(l.name)} (est\xE1 livre)</button>`:""}
    <div class="assist__sugg">
      <p>${u(m.tip)}</p>
      ${r.length?`<div class="hintbox__times">${r.map($=>`<button type="button" class="tchip${e.time===$.time?" is-on":""}" data-settime="${$.time}">${k($.time)}${$.peak?"<small>pico</small>":"<small>livre</small>"}</button>`).join("")}</div>`:`<p class="muted">Nenhum hor\xE1rio livre nesse dia${(e.assignees||[]).length?" para "+u(X(e.assignees)):""}. Tente outro dia ou outra pessoa.</p>`}
    </div>
  </section>`}async function Ee(e,t,s,n){let o=ee(e,{isNew:t}).filter(h=>h.level==="block");if(!o.length)return!0;let r=ie(e,{limit:2}),d=(e.assignees||[]).length===1?e.assignees[0]:null,i=d&&c.team.find(h=>h.id!==d&&re(e).includes(h.id)),l=[...r.map(h=>({label:`Mudar para ${k(h.time)} (livre)`,value:"time:"+h.time,primary:!0})),...i?[{label:`Passar para ${i.name} (est\xE1 livre)`,value:"who:"+i.id,primary:!r.length}]:[],{label:"Marcar mesmo assim",value:"force"}],m=await G({title:o[0].code==="duplicate"?"Isso j\xE1 est\xE1 na agenda":"J\xE1 tem compromisso nesse hor\xE1rio",bodyHtml:`<ul class="issues issues--dialog">${o.map(h=>`<li class="issue issue--block">${f("alert",15)}<div><strong>${u(h.title)}</strong><p>${u(h.text)}</p></div></li>`).join("")}</ul>`,options:l});return m?m==="force"?!0:(m.startsWith("time:")&&(e.time=m.slice(5)),m.startsWith("who:")&&(e.assignees=[m.slice(4)]),n(),Ee(e,t,s,n)):!1}async function ut(e,t){let s={...e,...t},n=ee(s).filter(o=>o.level==="block");return n.length?await G({title:"J\xE1 tem compromisso nesse hor\xE1rio",bodyHtml:`<ul class="issues issues--dialog">${n.map(o=>`<li class="issue issue--block">${f("alert",15)}<div><strong>${u(o.title)}</strong><p>${u(o.text)}</p></div></li>`).join("")}</ul>`,options:[{label:"Mover mesmo assim",value:"force",primary:!0}]})==="force":!0}function mt(e,t){let s=[],n=e,a=t.until&&t.until>=e?t.until:x(e,28);for(;n<=a&&s.length<150;){let o=q(n).getDay();(t.mode==="daily"||t.mode==="weekdays"&&o>=1&&o<=5||t.mode==="weekly"&&q(n).getDay()===q(e).getDay())&&s.push(n),n=x(n,1)}return s}var ft=["type","companyId","title","time","duration","assignees","location","description","internalNote","reminder","visibleToClient"];async function vt(e,t){let s=ft.filter(n=>JSON.stringify(e[n])!==JSON.stringify(t[n]));if(e.seriesId&&s.length){let n=c.state.events.filter(a=>a.seriesId===e.seriesId&&a.date>t.date);if(n.length){let a=await G({title:"Evento repetido",text:"Aplicar as altera\xE7\xF5es a quais eventos?",options:[{label:"S\xF3 a este",value:"one",primary:!0},{label:`A este e aos pr\xF3ximos (${n.length+1})`,value:"next"}]});if(!a)return;if(a==="next"){let o=Object.fromEntries(s.map(r=>[r,e[r]]));await c.upsertMany("events",[{...e},...n.map(r=>({...r,...o}))],{activity:{kind:"series-edit",count:n.length+1,label:`${y[e.type].label} \xB7 a partir de ${e.date.slice(8)}/${e.date.slice(5,7)}`,sample:{companyId:e.companyId,date:e.date}}}),w("S\xE9rie atualizada");return}}}await c.upsert("events",{...e}),w("Altera\xE7\xF5es salvas")}export{D as a,$t as b,J as c,Ze as d,C as e,he as f,$e as g,A as h,_t as i,R as j,w as k,B as l,G as m,ge as n,M as o,H as p,ie as q,tt as r,Tt as s,Nt as t,Ge as u,la as v,ze as w,ut as x,Jt as y,Gt as z,ke as A};
