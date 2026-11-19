import{e as ue}from"./c-UCGQCTUQ.js";import{A as m,B as Ue,C as F,D as He,E as Je,F as Ve,H as f,b as j,c as _,d as E,e as Re,f as ce,i as $,j as R,k as Y,l as w,m as Be,q as je,s as Fe,t as Z,u as ee,v as z,y as N,z as $e}from"./c-SIJUFJQD.js";import{a as g,b as Ge,c as x,d as I,e as de,f as we,h as pe,i as Ye,j as ke,k as _e}from"./c-3GA6RSWB.js";import{a as P}from"./c-W6W2IM5K.js";var gt=30,$t=180;function te(e,t,{maxFuture:s=$t}={}){let o=E(_(),-gt),a=E(_(),s),i=t.filter(n=>n.companyId===e.id&&n.visibleToClient!==!1&&n.date>=o&&n.date<=a).sort((n,c)=>(n.date+(n.time||"")).localeCompare(c.date+(c.time||""))).map(n=>({date:n.date,time:n.time||"",type:n.type,title:n.title||"",description:n.description||"",status:n.status||"pendente",duration:n.duration||0,location:(n.type==="captacao"||n.type==="reuniao")&&n.location||""}));return{v:1,company:{name:e.name,color:e.color,logo:e.logo||null,instagram:e.instagram||""},events:i,updatedAt:Date.now()}}var ze=e=>{let t="";return e.forEach(s=>t+=String.fromCharCode(s)),btoa(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")},wt=e=>{let t=atob(e.replace(/-/g,"+").replace(/_/g,"/"));return Uint8Array.from(t,s=>s.charCodeAt(0))};async function Ke(e,t){let s=new Response(new Blob([e]).stream().pipeThrough(t));return new Uint8Array(await s.arrayBuffer())}var We=["date","time","type","title","description","status","duration","location"];function kt(e,t=72){return new Promise(s=>{if(!e)return s(null);let o=new Image;o.onload=()=>{let a=document.createElement("canvas");a.width=a.height=t;let i=a.getContext("2d");i.fillStyle="#fff",i.fillRect(0,0,t,t),i.drawImage(o,0,0,t,t);let n=a.toDataURL("image/jpeg",.8);s(n.length<12e3?n:null)},o.onerror=()=>s(null),o.src=e})}async function Qe(e){let t=await kt(e.company.logo),s={v:1,c:[e.company.name,e.company.color,e.company.instagram,t],e:e.events.map(a=>We.map(i=>a[i])),u:e.updatedAt},o=new TextEncoder().encode(JSON.stringify(s));if("CompressionStream"in window)try{return"z"+ze(await Ke(o,new CompressionStream("deflate-raw")))}catch{}return"j"+ze(o)}async function Ht(e){let t=e[0],s=wt(e.slice(1));t==="z"&&(s=await Ke(s,new DecompressionStream("deflate-raw")));let o=JSON.parse(new TextDecoder().decode(s));return{v:o.v,company:{name:o.c[0],color:o.c[1],instagram:o.c[2],logo:o.c[3]},events:o.e.map(a=>Object.fromEntries(We.map((i,n)=>[i,a[n]]))),updatedAt:o.u}}var Xe=()=>location.href.split("#")[0].split("?")[0],Ze=e=>`${Xe()}#/c/${e}`,et=e=>`${Xe()}#/v/${e}`;var st="pauta.data.v1",ot="pauta.me",ae=["companies","events","notes","settings"],Ee=new Set,k=null,_t=()=>{try{return JSON.parse(localStorage.getItem(st)||"null")}catch{return null}},r={state:{companies:[],events:[],notes:[],settings:[]},hooks:{eventChange:null,activity:null},mode:"local",me:null,demo:!1,user:null,on(e){return Ee.add(e),()=>Ee.delete(e)},emit(){Ee.forEach(e=>e())},team:P.team,member:e=>P.team.find(t=>t.id===e),company(e){return this.state.companies.find(t=>t.id===e)},event(e){return this.state.events.find(t=>t.id===e)},companiesSorted(){return[...this.state.companies].sort((e,t)=>e.name.localeCompare(t.name,"pt-BR"))},eventsOn(e,{person:t="all",companyId:s=null}={}){return this.state.events.filter(o=>o.date===e).filter(o=>t==="all"||(o.assignees||[]).includes(t)).filter(o=>!s||o.companyId===s).sort((o,a)=>($(o.time)??-1)-($(a.time)??-1))},eventsBetween(e,t,s={}){return this.state.events.filter(o=>o.date>=e&&o.date<=t).filter(o=>!s.person||s.person==="all"||(o.assignees||[]).includes(s.person)).filter(o=>!s.companyId||o.companyId===s.companyId).sort((o,a)=>(o.date+(o.time||"")).localeCompare(a.date+(a.time||"")))},notesOn(e){return this.state.notes.filter(t=>t.date===e).sort((t,s)=>t.createdAt-s.createdAt)},async upsert(e,t){let s=e==="events"?this.state.events.find(a=>a.id===t.id):null,o=s?{...s}:null;return t.updatedAt=Date.now(),this.me&&(t.updatedBy=this.me),t.createdAt||(t.createdAt=t.updatedAt),!t.createdBy&&this.me&&(t.createdBy=this.me),Se(e,t),C(()=>k.write(e,t)),fe(e,t),this.emit(),e==="events"&&this.hooks.eventChange&&this.hooks.eventChange(o,{...t}),t},async upsertMany(e,t,{activity:s=null}={}){let o=Date.now();t.forEach(a=>{a.updatedAt=o,a.bulkAt=o,this.me&&(a.updatedBy=this.me),a.createdAt||(a.createdAt=o),!a.createdBy&&this.me&&(a.createdBy=this.me),Se(e,a)}),C(()=>k.writeMany(t.map(a=>({col:e,item:a})))),t.forEach(a=>fe(e,a)),s&&me(s),this.emit()},async remove(e,t){let s=this.state[e].find(o=>o.id===t);e==="events"&&s&&me({kind:"deleted",events:[tt(s)]}),this.state[e]=this.state[e].filter(o=>o.id!==t),C(()=>k.del(e,t)),e==="companies"&&s?.shareToken&&k.unpublish&&C(()=>k.unpublish(s.shareToken)),s&&fe(e,s),this.emit()},async removeMany(e,t,s={}){let o=this.state[e].filter(a=>t.includes(a.id));e==="events"&&o.length&&!s.silent&&me({kind:"deleted",events:o.slice(0,20).map(tt)}),this.state[e]=this.state[e].filter(a=>!t.includes(a.id)),t.length&&C(()=>k.delMany(e,t)),o.forEach(a=>fe(e,a)),this.emit()},async idToken(){return this.mode==="cloud"&&k.idToken?k.idToken():null},async askAssistant(e,t=[]){if(this.hooks.ask)return this.hooks.ask(e,t);if(this.mode!=="cloud"||!k.ask){let s=new Error("O assistente precisa da sincroniza\xE7\xE3o na nuvem.");throw s.code="local",s}return k.ask(e,t)},writeRaw(e,t){return this.mode!=="cloud"?!1:(C(()=>k.write(e,t)),!0)},async readDoc(e){if(this.mode!=="cloud"||!k.getDoc)return null;try{return await k.getDoc(e)}catch{return null}},setMe(e){this.me=e,localStorage.setItem(ot,e),this.emit()},async ensureShareToken(e){return e.shareToken||(e.shareToken=$e(),await this.upsert("companies",e)),e.shareToken},async regenerateShareToken(e){let t=e.shareToken;e.shareToken=$e(),await this.upsert("companies",e),t&&k.unpublish&&C(()=>k.unpublish(t)),await this.publishCompany(e.id)},async publishCompany(e){if(this.mode!=="cloud")return;let t=this.company(e);!t||!t.shareToken||C(()=>k.publish(t.shareToken,te(t,this.state.events)))},exportData(){return JSON.stringify({app:"pauta",version:1,exportedAt:new Date().toISOString(),...this.state},null,2)},async importData(e,{replace:t=!1}={}){let s=typeof e=="string"?JSON.parse(e):e;if(!s||!Array.isArray(s.events)||!Array.isArray(s.companies))throw new Error("Arquivo inv\xE1lido");t&&await this.clearAll();for(let o of ae){let a=(s[o]||[]).filter(n=>n&&typeof n.id=="string").map(n=>ue(o,n)).filter(Boolean),i=Date.now();a.forEach(n=>n.updatedAt=n.bulkAt=i),a.length&&(a.forEach(n=>Se(o,n)),C(()=>k.writeMany(a.map(n=>({col:o,item:n})))))}this.demo=!1,at(),me({kind:"import",count:(s.events||[]).length}),this.state.companies.forEach(o=>o.shareToken&&he.add(o.id)),nt(),this.emit()},async clearAll(){for(let e of ae){let t=this.state[e].map(s=>s.id);this.state[e]=[],t.length&&C(()=>k.delMany(e,t))}this.demo=!1,at(),this.emit()},async clearDemo(){await this.clearAll()}};function C(e){try{let t=e();t&&t.catch&&t.catch(s=>{console.error("Falha ao salvar",s),r.onError&&r.onError(s)})}catch(t){console.error("Falha ao salvar",t),r.onError&&r.onError(t)}}var tt=e=>({id:e.id,type:e.type,companyId:e.companyId||"",date:e.date,time:e.time||"",title:e.title||"",assignees:e.assignees||[]});function me(e){if(r.mode!=="cloud"||!k.write)return;let t={id:N("a_"),by:r.me||"",at:Date.now(),...e};r.hooks.activity?r.hooks.activity(t):C(()=>k.write("activity",t))}function Se(e,t){let s=r.state[e],o=s.findIndex(a=>a.id===t.id);o>=0?s[o]={...t}:s.push({...t})}var he=new Set,nt=Je(async()=>{let e=[...he];he.clear();for(let t of e)try{await r.publishCompany(t)}catch(s){console.warn("Falha ao publicar link do cliente",s)}},1200);function fe(e,t){if(r.mode!=="cloud")return;let s=e==="events"?t.companyId:e==="companies"?t.id:null,o=s&&r.company(s);o&&o.shareToken&&(he.add(s),nt())}function K(){try{localStorage.setItem(st,JSON.stringify({...r.state,demo:r.demo}))}catch(e){throw r.onError&&r.onError(e),e}}function at(){r.mode==="local"&&K()}var Et={async write(){K()},async writeMany(){K()},async del(){K()},async delMany(){K()}};async function Kt(){r.mode="local",k=Et,r.me=localStorage.getItem(ot);let e=_t();e&&!e.demo?(ae.forEach(t=>r.state[t]=(Array.isArray(e[t])?e[t]:[]).map(s=>ue(t,s)).filter(Boolean)),r.demo=!1):(ae.forEach(t=>r.state[t]=[]),r.demo=!1,K()),r.ready=!0}async function Wt(e,t){r.mode="cloud",r.user=t;let s=P.team.find(o=>o.email&&o.email.toLowerCase()===(t.email||"").toLowerCase());r.me=s?s.id:null,k=e,r.ready=!1,await e.subscribe(ae,(o,a)=>{r.state[o]=a.map(i=>ue(o,i)).filter(Boolean),r.emit()},o=>r.onError&&r.onError(o)),r.ready=!0}var it=(()=>{try{return JSON.parse(localStorage.getItem("pauta.ui")||"{}")}catch{return{}}})(),O={tab:it.tab||"hoje",person:it.person||"all",date:_(),month:ce(_()),monthSel:_(),monthCompany:null,showAllTips:!1};function Zt(){try{localStorage.setItem("pauta.ui",JSON.stringify({tab:O.tab,person:O.person}))}catch{}}function W(e,t=26){let s=r.member(e);return s?`<span class="avatar" style="--s:${t}px;background:${s.color}" title="${m(s.name)}">${m(s.name[0])}</span>`:""}function St(e=[],t=24){return e.length?`<span class="avatars">${e.map(s=>W(s,t)).join("")}</span>`:`<span class="avatar avatar--empty" style="--s:${t}px" title="Sem respons\xE1vel">?</span>`}var oe=(e=[])=>{let t=e.map(s=>r.member(s)?.name).filter(Boolean);return t.length?t.length===r.team.length&&t.length>1?"Os dois":t.join(" e "):"Sem respons\xE1vel"};function L(e,t=36,s=null){let o=s??Math.round(t*.28);return e?e.logo?`<span class="logo logo--img" style="--s:${t}px;--r:${o}px"><img src="${m(e.logo)}" alt=""></span>`:`<span class="logo" style="--s:${t}px;--r:${o}px;background:${e.color};color:${He(e.color)}">${m(Ue(e.name))}</span>`:`<span class="logo" style="--s:${t}px;--r:${o}px;background:#999">?</span>`}function xe(e,{solid:t=!1}={}){let s=g[e]||g.outro;return`<span class="tbadge tbadge--${e}${t?" is-solid":""}">${f(s.icon,13)}${s.label}</span>`}function lt(e){if(!e.time)return"Dia todo";let t=g[e.type];return t&&(t.kind==="shoot"||t.kind==="meeting"||t.kind==="work"||e.duration)?t.kind==="post"&&!e.duration?w(e.time):`${w(e.time)}\u2013${w(R($(e.time)+I(e)))}`:w(e.time)}function Ae(e,{showDate:t=!1,compact:s=!1,highlight:o=[]}={}){let a=r.company(e.companyId),i=a?.color||"#888",n=e.status==="feito",l=e.date===_()&&e.time&&$(e.time)+I(e)<Y()&&e.status==="pendente",u=o.includes(e.id);return`
  <article class="ecard${n?" is-done":""}${l?" is-late":""}${u?" is-flagged":""}${s?" is-compact":""}"
    style="--cc:${i};--cc-soft:${F(i,.1)}" data-action="open-event" data-id="${e.id}">
    <div class="ecard__time">
      <strong>${e.time?w(e.time):"\u2014"}</strong>
      ${t?`<small>${m(e.date.slice(8))}/${m(e.date.slice(5,7))}</small>`:e.time&&(g[e.type]?.kind!=="post"||e.duration)?`<small>${w(R($(e.time)+I(e)))}</small>`:""}
    </div>
    <div class="ecard__body">
      <div class="ecard__top">
        ${L(a,20,6)}
        <span class="ecard__company">${m(a?.name||"Sem empresa")}</span>
        ${xe(e.type)}
      </div>
      <div class="ecard__title">${m(e.title||g[e.type]?.label||"Evento")}</div>
      ${s?"":`<div class="ecard__meta">
        ${St(e.assignees,20)}<span>${m(oe(e.assignees))}</span>
        ${e.location?`<span class="ecard__loc">${f("pin",12)}${m(e.location)}</span>`:""}
        ${l?'<span class="ecard__late">Atrasado</span>':""}
        ${e.visibleToClient===!1?`<span class="ecard__private" title="N\xE3o aparece para o cliente">${f("eyeoff",12)}</span>`:""}
      </div>`}
    </div>
    <button class="ecard__check${n?" is-on":""}" data-action="toggle-done" data-id="${e.id}" aria-label="${n?"Desmarcar":"Marcar como feito"}">
      ${f("check",16)}
    </button>
  </article>`}function Te(e,t,s=""){return`<div class="empty">${f("sparkle",28)}<h3>${m(e)}</h3><p>${m(t)}</p>${s}</div>`}var se=[];function q({html:e,onMount:t,className:s="",onClose:o}){let a=document.getElementById("sheets"),i=document.createElement("div");i.className="sheet-wrap",i.innerHTML=`<div class="sheet-backdrop" data-close></div>
    <section class="sheet ${s}" role="dialog" aria-modal="true">
      <div class="sheet__grab" data-grab><span></span></div>
      <div class="sheet__inner"></div>
    </section>`,a.appendChild(i);let n=i.querySelector(".sheet__inner"),c=i.querySelector(".sheet"),d={el:n,panel:c,set(p){n.innerHTML=p,t&&t(d)},close(){if(d.closed)return;d.closed=!0,i.classList.remove("is-open");let p=se.indexOf(d);p>=0&&se.splice(p,1),setTimeout(()=>i.remove(),280),o&&o(),document.body.classList.toggle("has-sheet",se.length>0)}};se.push(d),d.set(e),document.body.classList.add("has-sheet"),requestAnimationFrame(()=>requestAnimationFrame(()=>i.classList.add("is-open"))),i.addEventListener("click",p=>{p.target.closest("[data-close]")&&d.close()});let l=null,u=0,v=i.querySelector("[data-grab]"),y=p=>{!p.target.closest("[data-grab], .sheet__head")||p.target.closest("button, input, select, textarea")||(l=p.touches[0].clientY,u=0,c.style.transition="none")},T=p=>{l!=null&&(u=Math.max(0,p.touches[0].clientY-l),c.style.transform=`translateY(${u}px)`)},h=()=>{l!=null&&(c.style.transition="",c.style.transform="",u>110&&d.close(),l=null)};return c.addEventListener("touchstart",y,{passive:!0}),c.addEventListener("touchmove",T,{passive:!0}),c.addEventListener("touchend",h),v&&v.addEventListener("click",()=>{}),d}var na=()=>se;function U(e,{left:t="",right:s=""}={}){return`<header class="sheet__head">
    <div class="sheet__head-l">${t||'<button class="btn-text" data-close>Fechar</button>'}</div>
    <h2>${m(e)}</h2>
    <div class="sheet__head-r">${s}</div>
  </header>`}var rt;function S(e,{action:t,onAction:s,ms:o=2600}={}){let a=document.getElementById("toast");a.innerHTML=`<span>${m(e)}</span>${t?`<button>${m(t)}</button>`:""}`,a.classList.add("is-on"),t&&(a.querySelector("button").onclick=()=>{a.classList.remove("is-on"),s&&s()}),clearTimeout(rt),rt=setTimeout(()=>a.classList.remove("is-on"),o)}function H({title:e,text:t="",ok:s="Confirmar",danger:o=!1}){return new Promise(a=>q({className:"sheet--dialog",html:`<div class="dialog">
        <h3>${m(e)}</h3>${t?`<p>${m(t)}</p>`:""}
        <button class="btn ${o?"btn--danger":"btn--primary"} btn--block" data-ok>${m(s)}</button>
        <button class="btn btn--ghost btn--block" data-close>Cancelar</button>
      </div>`,onClose:()=>a(!1),onMount:n=>{n.el.querySelector("[data-ok]").onclick=()=>{a(!0),n.close()}}}))}function Q({title:e,text:t="",bodyHtml:s="",options:o}){return new Promise(a=>{let i=null;q({className:"sheet--dialog",html:`<div class="dialog">
        <h3>${m(e)}</h3>${t?`<p>${m(t)}</p>`:""}${s}
        ${o.map((n,c)=>`<button class="btn ${n.danger?"btn--danger":n.primary?"btn--primary":"btn--soft"} btn--block" data-i="${c}">${m(n.label)}</button>`).join("")}
        <button class="btn btn--ghost btn--block" data-close>Cancelar</button>
      </div>`,onClose:()=>a(i),onMount:n=>{n.el.querySelectorAll("[data-i]").forEach(c=>c.onclick=()=>{i=o[+c.dataset.i].value,n.close()})}})})}var xt={workStart:"08:00",workEnd:"19:00",lunchStart:"12:00",lunchEnd:"13:00",daysOff:[0],travelMin:45,maxTasks:8},De=()=>({...xt,...r.state.settings.find(e=>e.id==="routine")||{}}),M=e=>{let t=$(e.time);return t==null?null:[t,t+I(e)]},G=(e,t)=>e&&t&&e[0]<t[1]&&t[0]<e[1],X=e=>["shoot","meeting"].includes(g[e.type]?.kind),ct=e=>!x(e.type),Ce=e=>r.company(e.companyId)?.name||"",V=e=>`${g[e.type]?.label||"Evento"}${Ce(e)?" \xB7 "+Ce(e):""}`,J=e=>r.member(e)?.name||"\u2014",Ie=e=>x(e.type)&&!e.duration?`\xE0s ${w(e.time)}`:`das ${w(e.time)} \xE0s ${w(R(M(e)[1]))}`,dt=(e,t)=>(e.location||e.companyId)===(t.location||t.companyId),ne=(e,t,s)=>r.state.events.filter(o=>o.date===t&&o.id!==s&&o.time&&o.status!=="feito"&&(o.assignees||[]).includes(e));function ie(e,{isNew:t=!1}={}){let s=[];if(!e.date)return s;let o=De(),a=e.time?[$(e.time),$(e.time)+I(e)]:null,i=e.assignees||[];if(a){i.forEach(l=>{ne(l,e.date,e.id).forEach(u=>{if(!G(a,M(u)))return;let v=x(e.type)!==x(u.type)&&(x(e.type)||x(u.type));s.push({level:"block",code:"overlap",person:l,eventIds:[u.id],title:`${J(l)} j\xE1 tem compromisso nesse hor\xE1rio`,text:`${V(u)} ${Ie(u)}${u.createdBy?` (marcado por ${u.createdBy===r.me?"voc\xEA":J(u.createdBy)})`:""}.`+(v?" Se for manter, deixe o post programado antes.":"")})})}),r.state.events.filter(l=>l.id!==e.id&&l.date===e.date&&l.companyId===e.companyId&&l.type===e.type&&l.time&&Math.abs($(l.time)-a[0])<=30).forEach(l=>{s.some(u=>u.eventIds?.includes(l.id))||s.push({level:"block",code:"duplicate",eventIds:[l.id],title:"Parece que isso j\xE1 foi marcado",text:`J\xE1 existe ${V(l)} ${Ie(l)}, com ${(l.assignees||[]).map(J).join(" e ")||"ningu\xE9m"}${l.createdBy?`, marcado por ${l.createdBy===r.me?"voc\xEA":J(l.createdBy)}`:""}.`})}),X(e)&&i.forEach(l=>{ne(l,e.date,e.id).filter(X).forEach(u=>{let v=M(u),y=a[0]>=v[1]?a[0]-v[1]:v[0]>=a[1]?v[0]-a[1]:-1;y>=0&&y<o.travelMin&&!dt(e,u)&&s.push({level:"warn",code:"travel",person:l,eventIds:[u.id],title:`Pouco tempo de deslocamento para ${J(l)}`,text:`S\xF3 ${y} min entre isto e ${V(u)} (${w(u.time)}). O combinado \xE9 ${o.travelMin} min.`})})});let c=$(o.workStart),d=$(o.workEnd);ct(e)&&(a[0]<c||a[1]>d)?s.push({level:"warn",code:"hours",title:"Fora do expediente",text:`O hor\xE1rio de trabalho de voc\xEAs \xE9 das ${w(o.workStart)} \xE0s ${w(o.workEnd)}. Preservar o tempo livre evita esgotamento.`}):x(e.type)&&(a[0]<c||a[0]>=d)&&s.push({level:"info",code:"hours",title:"Post fora do expediente",text:"Deixe programado no Meta Business Suite para ningu\xE9m precisar parar o descanso para postar."}),ct(e)&&G(a,[$(o.lunchStart),$(o.lunchEnd)])&&s.push({level:"warn",code:"lunch",title:"Invade o almo\xE7o",text:`O almo\xE7o de voc\xEAs \xE9 das ${w(o.lunchStart)} \xE0s ${w(o.lunchEnd)}.`}),a[1]>1440&&s.push({level:"warn",code:"midnight",title:"Passa da meia-noite",text:"Confira a dura\xE7\xE3o."}),t&&(e.date<_()||e.date===_()&&a[0]<Y()-5)&&s.push({level:"warn",code:"past",title:"Esse hor\xE1rio j\xE1 passou",text:"Confira o dia e a hora."}),["feed","reels","carrossel"].includes(e.type)&&r.state.events.filter(l=>l.id!==e.id&&l.date===e.date&&l.companyId===e.companyId&&["feed","reels","carrossel"].includes(l.type)&&l.time).forEach(l=>{let u=Math.abs($(l.time)-a[0]);u>30&&u<180&&s.push({level:"warn",code:"spacing",eventIds:[l.id],title:"Posts da mesma empresa muito pr\xF3ximos",text:`${V(l)} \xE0s ${w(l.time)}. Espacem pelo menos 3 h.`})}),r.team.filter(l=>!i.includes(l.id)).forEach(l=>{ne(l.id,e.date,e.id).filter(u=>G(a,M(u))).forEach(u=>{s.push({level:"info",code:"partner",person:l.id,eventIds:[u.id],title:`${l.name} nesse hor\xE1rio`,text:`${V(u)} ${Ie(u)}${u.location?" \xB7 "+u.location:""}.`})})})}let n=j(e.date).getDay();return o.daysOff.includes(n)&&!x(e.type)&&s.push({level:"warn",code:"dayoff",title:`${Be[n]} \xE9 dia de folga`,text:"Se der, mude para um dia \xFAtil. Posts podem ficar programados."}),i.forEach(c=>{let d=r.state.events.filter(l=>l.date===e.date&&l.id!==e.id&&(l.assignees||[]).includes(c)).length+1;d>o.maxTasks&&s.push({level:"warn",code:"load",person:c,title:`${J(c)} ficaria sobrecarregado`,text:`${d} tarefas nesse dia (limite combinado: ${o.maxTasks}).`})}),s}function ve(e,{limit:t=3,people:s=null}={}){if(!e.date)return[];let o=De(),a=s||(e.assignees?.length?e.assignees:[]),i=I(e),n=x(e.type),c=n?420:$(o.workStart),d=n?1320:$(o.workEnd),l=[$(o.lunchStart),$(o.lunchEnd)],u=(g[e.type]?.best||[]).map($),v=e.date===_()?Math.ceil((Y()+15)/15)*15:0,y=r.state.events.filter(p=>p.id!==e.id&&p.date===e.date&&p.companyId&&p.companyId===e.companyId&&p.time&&(p.type===e.type||n&&x(p.type)&&p.type!=="story"&&e.type!=="story")).map(p=>({t:$(p.time),gap:p.type===e.type&&e.type==="story"?45:p.type===e.type?180:120})),T=[];for(let p=Math.max(c,v);p+i<=d;p+=15){let b=[p,p+i];if(!n&&G(b,l)||y.some(A=>Math.abs(A.t-p)<A.gap)||a.some(A=>ne(A,e.date,e.id).some(ge=>{let Pe=M(ge);return G(b,Pe)?!0:X(e)&&X(ge)&&!dt(e,ge)?G([b[0]-o.travelMin,b[1]+o.travelMin],Pe):!1})))continue;let D=u.length?Math.min(...u.map(A=>Math.abs(A-p))):Math.abs(p-$(o.workStart)-60);T.push({time:R(p),score:D})}T.sort((p,b)=>p.score-b.score);let h=[];for(let p of T)if(h.every(b=>Math.abs($(b.time)-$(p.time))>=60)&&h.push(p),h.length>=t)break;return h.sort((p,b)=>$(p.time)-$(b.time)).map(p=>({...p,peak:p.score<=30}))}function ye(e){if(!e.time)return r.team.map(s=>s.id);let t=[$(e.time),$(e.time)+I(e)];return r.team.filter(s=>!ne(s.id,e.date,e.id).some(o=>G(t,M(o)))).map(s=>s.id)}function At(e,t){let s=De();if(s.daysOff.includes(j(t).getDay()))return{minutes:null,longest:null,dayOff:!0};let o=$(s.workStart),a=$(s.workEnd),i=[[$(s.lunchStart),$(s.lunchEnd)]];r.eventsOn(t,{person:e}).filter(l=>l.time).forEach(l=>{let u=M(l);i.push([u[0],x(l.type)?u[0]+15:u[1]+(X(l)?30:0)])}),i.sort((l,u)=>l[0]-u[0]);let n=o,c=0,d=0;return i.forEach(([l,u])=>{if(l>=a||u<=o)return;let v=Math.max(l,o),y=Math.min(u,a);y<=n||(v>n&&(c+=v-n,d=Math.max(d,v-n)),n=Math.max(n,y))}),a>n&&(c+=a-n,d=Math.max(d,a-n)),{minutes:c,longest:d,dayOff:!1}}function da(e,t,s){let o=[],a=x(t.type)&&!x(s.type)?t:x(s.type)&&!x(t.type)?s:(t.createdAt||0)>(s.createdAt||0)?t:s,i=r.team.find(c=>c.id!==e);i&&ye(a).includes(i.id)&&(a.assignees||[]).length===1&&o.push({label:`Passar para ${i.name}`,eventId:a.id,patch:{assignees:[i.id]}});let n=ve(a,{limit:1})[0];return n&&o.push({label:`Mover ${g[a.type].label.toLowerCase()} para ${w(n.time)}`,eventId:a.id,patch:{time:n.time}}),o}function pa(e,t="all"){let s=t==="all"?r.team:r.team.filter(i=>i.id===t),o=[];return r.eventsOn(e,{person:t}).length?(s.forEach(i=>{let n=r.eventsOn(e,{person:i.id}),c=At(i.id,e),d=n.filter(X),l=[`${n.length} tarefa${n.length===1?"":"s"}`];d.length&&l.push(`sai para ${d.map(u=>`${Ce(u)} \xE0s ${w(u.time)}`).join(" e ")}`),c.dayOff?l.push("\xE9 dia de folga"):c.minutes!=null&&l.push(c.minutes>=30?`${z(c.minutes)} livres no expediente (maior intervalo: ${z(c.longest)})`:"quase sem tempo livre"),o.push(`${i.name}: ${l.join(", ")}.`)}),o):[`Nenhum compromisso${t==="all"?"":" para "+J(t)}. Bom dia para planejar a pauta ou adiantar edi\xE7\xF5es.`]}var Tt={feed:"\u{1F5BC}\uFE0F",carrossel:"\u{1F5C2}\uFE0F",reels:"\u{1F3AC}",story:"\u2B55",captacao:"\u{1F4F8}",reuniao:"\u{1F91D}",producao:"\u2702\uFE0F",outro:"\u2022"},re=e=>String(e||"").replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\r?\n/g,"\\n"),It=e=>{let t=[];for(;e.length>74;)t.push(e.slice(0,74)),e=" "+e.slice(74);return t.push(e),t.join(`\r
`)},pt=(e,t)=>e.replace(/-/g,"")+"T"+t.replace(":","")+"00",Ct=()=>new Date().toISOString().replace(/[-:]/g,"").replace(/\.\d+/,"");function Dt(e,t){let s=["BEGIN:VCALENDAR","VERSION:2.0",`PRODID:-//${P.appName}//PT-BR`,"CALSCALE:GREGORIAN","METHOD:PUBLISH",`X-WR-CALNAME:${re(t)}`];return e.forEach(o=>{let a=r.company(o.companyId),i=(o.assignees||[]).map(l=>r.member(l)?.name).filter(Boolean).join(" e "),n=`${Tt[o.type]||""} ${g[o.type]?.label||"Evento"} \xB7 ${a?.name||""}${o.title?" \u2014 "+o.title:""}`.trim(),c=[i&&`Respons\xE1vel: ${i}`,o.description,o.internalNote&&`Nota interna: ${o.internalNote}`].filter(Boolean).join(`
`);if(s.push("BEGIN:VEVENT",`UID:${o.id}@pauta`,`DTSTAMP:${Ct()}`),o.time){let l=$(o.time)+I(o),u=l>=1440?E(o.date,1):o.date;s.push(`DTSTART:${pt(o.date,o.time)}`,`DTEND:${pt(u,R(l%1440))}`)}else s.push(`DTSTART;VALUE=DATE:${o.date.replace(/-/g,"")}`,`DTEND;VALUE=DATE:${E(o.date,1).replace(/-/g,"")}`);s.push(`SUMMARY:${re(n)}`),c&&s.push(`DESCRIPTION:${re(c)}`),o.location&&s.push(`LOCATION:${re(o.location)}`);let d=o.reminder??30;d>=0&&s.push("BEGIN:VALARM","ACTION:DISPLAY",`DESCRIPTION:${re(n)}`,`TRIGGER:-PT${d}M`,"END:VALARM"),s.push("END:VEVENT")}),s.push("END:VCALENDAR"),s.map(It).join(`\r
`)}async function ut(e,t,s){let o=Dt(e,s),a=new File([o],t,{type:"text/calendar"});if(navigator.canShare&&navigator.canShare({files:[a]}))try{await navigator.share({files:[a],title:s});return}catch(c){if(c&&c.name==="AbortError")return}let i=URL.createObjectURL(a),n=document.createElement("a");n.href=i,n.download=t,document.body.appendChild(n),n.click(),n.remove(),setTimeout(()=>URL.revokeObjectURL(i),4e3)}function xa(){let e=r.companiesSorted(),t=_(),s=Re(t),o=E(s,6);return`
  <header class="hdr">
    <div class="hdr__row">
      <div class="hdr__titles"><p class="hdr__eyebrow">${e.length} cliente${e.length===1?"":"s"}</p><h1>Empresas</h1></div>
      <div class="hdr__actions"><button class="btn btn--primary btn--sm" data-action="new-company">${f("plus",16)} Nova</button></div>
    </div>
  </header>
  <div class="page">
    ${e.length?"":Te("Nenhuma empresa ainda","Cadastre os clientes com nome, cor e logomarca. Cada um ganha um link pr\xF3prio para ver s\xF3 o seu cronograma.",`<button class="btn btn--primary" data-action="new-company">${f("plus",18)} Cadastrar empresa</button>`)}
    <div class="colist">
      ${e.map(a=>{let i=r.eventsBetween(s,o,{companyId:a.id}),n=i.filter(l=>x(l.type)).length,c=i.filter(l=>l.type==="captacao").length,d=r.state.events.filter(l=>l.companyId===a.id&&l.date>=t&&l.status!=="feito").sort((l,u)=>(l.date+l.time).localeCompare(u.date+u.time))[0];return`<button class="cocard" style="--cc:${a.color};--cc-soft:${F(a.color,.1)}" data-action="open-company" data-id="${a.id}">
          <div class="cocard__top">
            ${L(a,48)}
            <div class="cocard__name"><strong>${m(a.name)}</strong>${a.instagram?`<small>${f("insta",12)} @${m(a.instagram)}</small>`:""}</div>
            ${f("right",18,"muted")}
          </div>
          <div class="cocard__stats">
            <span><b>${n}</b> posts</span><span><b>${c}</b> capta\xE7${c===1?"\xE3o":"\xF5es"}</span><span class="muted">nesta semana</span>
          </div>
          ${d?`<div class="cocard__next">${f(g[d.type].icon,14)} <b>${m(Z(d.date))}${d.time?" "+d.time:""}</b> \xB7 ${m(g[d.type].label)} \u2014 ${m(d.title||"")}</div>`:'<div class="cocard__next muted">Nada agendado</div>'}
        </button>`}).join("")}
    </div>
  </div>`}function Aa(e){let t=q({className:"sheet--tall",html:mt(e),onMount:s=>Lt(s,e)});t.refresh=()=>r.company(e)?t.set(mt(e)):t.close()}function mt(e){let t=r.company(e);if(!t)return"";let s=_(),o=ce(s),a=r.eventsBetween(`${o}-01`,`${o}-31`,{companyId:e}),i=r.eventsBetween(s,E(s,30),{companyId:e}),n=r.eventsBetween(E(s,-14),E(s,-1),{companyId:e}).reverse(),c=v=>a.filter(y=>v.includes(y.type)).length,d=a.filter(v=>v.status==="feito").length,l="",u=i.map(v=>{let y=v.date!==l?`<h4 class="dayhead">${m(ee(v.date))}</h4>`:"";return l=v.date,y+Ae(v)}).join("");return`
  ${U("",{right:'<button class="btn-text" data-act="edit">Editar</button>'})}
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
      <h2 class="block__title">${m(Fe(o))}</h2>
      <div class="mstats mstats--5">
        <div><b>${c(["feed","carrossel"])}</b><span>feed</span></div>
        <div><b>${c(["reels"])}</b><span>reels</span></div>
        <div><b>${c(["story"])}</b><span>stories</span></div>
        <div><b>${c(["captacao"])}</b><span>capta\xE7\xF5es</span></div>
        <div><b>${a.length?Math.round(d/a.length*100):0}%</b><span>feito</span></div>
      </div>
    </section>

    ${t.address||t.contact||t.notes?`<ul class="rows">
      ${t.address?`<li><span class="rows__k">${f("pin",16)} Endere\xE7o</span><a class="rows__v link" href="https://maps.apple.com/?q=${encodeURIComponent(t.address)}" target="_blank" rel="noopener">${m(t.address)}</a></li>`:""}
      ${t.contact?`<li><span class="rows__k">${f("user",16)} Contato</span><span class="rows__v">${m(t.contact)}</span></li>`:""}
      ${t.notes?`<li><span class="rows__k">${f("note",16)} Observa\xE7\xF5es</span><span class="rows__v">${m(t.notes)}</span></li>`:""}
    </ul>`:""}

    <section class="block">
      <h2 class="block__title">Pr\xF3ximos 30 dias</h2>
      ${u||Te("Nada agendado","Crie o cronograma de postagens desta empresa.")}
    </section>

    ${n.length?`<section class="block">
      <h2 class="block__title">\xDAltimas 2 semanas</h2>
      ${n.map(v=>Ae(v,{showDate:!0,compact:!0})).join("")}
    </section>`:""}
  </div>`}function Lt(e,t){let s=e.el;s.querySelector('[data-act="edit"]').onclick=()=>Le(t),s.querySelector('[data-act="new"]').onclick=async()=>{let{openEventEditor:o}=await import("./c-QFRLXA2V.js");o({companyId:t})},s.querySelector('[data-act="share"]').onclick=()=>Me(t),s.querySelector('[data-act="clientview"]').onclick=()=>Mt(t)}function Le(e=null,t=null){let s=e?r.company(e):null,o=r.state.companies.map(c=>c.color),a=s?{...s}:{id:N("c_"),name:"",color:pe.find(c=>!o.includes(c))||pe[0],logo:null,instagram:"",address:"",contact:"",notes:"",shareToken:null},i=()=>`
    ${U(s?"Editar empresa":"Nova empresa",{left:'<button class="btn-text" data-close>Cancelar</button>',right:'<button class="btn btn--primary btn--sm" data-save>Salvar</button>'})}
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
          ${pe.map(c=>`<button type="button" class="swatch${a.color===c?" is-on":""}" style="background:${c}" data-color="${c}" aria-label="Cor ${c}">${f("check",16)}</button>`).join("")}
          <label class="swatch swatch--custom" title="Outra cor"><input type="color" value="${a.color}" data-customcolor>${f("plus",16)}</label>
        </div>
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-ig">Instagram</label>
        <div class="input-prefix"><span>@</span><input id="c-ig" class="input" name="instagram" value="${m(a.instagram||"")}" placeholder="usuario" autocomplete="off" autocapitalize="none"></div>
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
    </form>`,n=c=>{let d=c.el,l=d.querySelector("form"),u=()=>{a.name=l.name.value.trim(),a.instagram=l.instagram.value.trim().replace(/^@/,""),a.address=l.address.value.trim(),a.contact=l.contact.value.trim(),a.notes=l.notes.value.trim()},v=()=>d.querySelector("[data-preview]").innerHTML=L({...a,name:l.name.value||"?"},88,24);l.name.addEventListener("input",v),d.querySelectorAll("[data-color]").forEach(h=>h.onclick=()=>{a.color=h.dataset.color,d.querySelectorAll("[data-color]").forEach(p=>p.classList.toggle("is-on",p===h)),v()}),d.querySelector("[data-customcolor]").oninput=h=>{a.color=h.target.value,d.querySelectorAll("[data-color]").forEach(p=>p.classList.remove("is-on")),v()},d.querySelector("[data-file]").onchange=async h=>{let p=h.target.files[0];if(p)try{u(),a.logo=await Ve(p,160),c.set(i())}catch{S("N\xE3o foi poss\xEDvel ler essa imagem")}};let y=d.querySelector("[data-rmlogo]");y&&(y.onclick=()=>{u(),a.logo=null,c.set(i())});let T=d.querySelector("[data-delete]");T&&(T.onclick=async()=>{let h=r.state.events.filter(b=>b.companyId===a.id);await H({title:`Excluir ${a.name}?`,text:h.length?`Os ${h.length} eventos desta empresa tamb\xE9m ser\xE3o apagados e o link do cliente deixar\xE1 de funcionar.`:"O link do cliente deixar\xE1 de funcionar.",ok:"Excluir empresa",danger:!0})&&(await r.removeMany("events",h.map(b=>b.id)),await r.remove("companies",a.id),c.close(),S("Empresa exclu\xEDda"))}),d.querySelector("[data-save]").onclick=async()=>{if(u(),!a.name)return l.name.focus(),S("Digite o nome da empresa");await r.upsert("companies",{...a}),c.close(),S(s?"Empresa atualizada":"Empresa cadastrada"),t&&t(r.company(a.id))}};q({className:"sheet--tall",html:i(),onMount:n})}async function Me(e){let t=r.company(e),s=r.mode==="cloud",o="";s?(await r.ensureShareToken(t),await r.publishCompany(e),o=Ze(r.company(e).shareToken)):o=et(await Qe(te(t,r.state.events,{maxFuture:90})));let a=`
    ${U("Link do cliente")}
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
    </div>`;q({html:a,onMount:i=>{let n=i.el;n.querySelector("[data-copy]").onclick=async()=>{try{await navigator.clipboard.writeText(o),S("Link copiado")}catch{n.querySelector("[data-link]").select(),S("Selecione e copie o link")}},n.querySelector("[data-sharebtn]").onclick=async()=>{let d=`Ol\xE1! Este \xE9 o cronograma de conte\xFAdo da ${t.name}. Por aqui voc\xEAs acompanham tudo o que est\xE1 planejado: posts, stories, reels e capta\xE7\xF5es.`;if(navigator.share)try{await navigator.share({title:`Cronograma \xB7 ${t.name}`,text:d,url:o})}catch{}else await navigator.clipboard?.writeText(`${d}
${o}`),S("Mensagem copiada")};let c=n.querySelector("[data-revoke]");c&&(c.onclick=async()=>{await H({title:"Gerar um novo link?",text:"Quem tiver o link antigo n\xE3o conseguir\xE1 mais ver o cronograma.",ok:"Gerar novo link",danger:!0})&&(await r.regenerateShareToken(r.company(e)),i.close(),Me(e))})}})}async function Mt(e){let t=r.company(e);if(!t)return;let{showClient:s}=await import("./c-TYCTILQS.js"),{sanitizePayload:o}=await import("./c-K6MNJDD7.js"),a=o(te(t,r.state.events)),i=document.createElement("div");i.className="client-preview",i.innerHTML=`<div class="client-preview__bar"><button class="btn btn--soft btn--sm" data-closepv>${f("left",16)} Voltar</button><span>Assim o cliente v\xEA</span><button class="btn btn--primary btn--sm" data-sendpv>${f("share",16)} Enviar</button></div><div class="client-preview__body"></div>`,document.body.appendChild(i),document.body.classList.add("has-sheet"),s(i.querySelector(".client-preview__body"),a,{canGoBack:!1,preview:!0});let n=()=>{i.remove(),document.body.classList.toggle("has-sheet",!!document.querySelector(".sheet-wrap"))};i.querySelector("[data-closepv]").onclick=n,i.querySelector("[data-sendpv]").onclick=()=>{n(),Me(e)}}function Fa(e){let t=q({html:ft(e),className:"sheet--tall",onMount:s=>Nt(s,e)});t.refresh=()=>{if(!r.event(e))return t.close();t.set(ft(e))}}function ft(e){let t=r.event(e);if(!t)return"";let s=r.company(t.companyId),o=s?.color||"#666",a=ke.find(n=>n.v===(t.reminder??30)),i=t.seriesId?r.state.events.filter(n=>n.seriesId===t.seriesId).length:0;return`
  ${U("",{right:'<button class="btn-text" data-act="edit">Editar</button>'})}
  <div class="detail">
    <div class="detail__hero" style="--cc:${o};--cc-soft:${F(o,.12)}">
      <div class="detail__co">${L(s,40)}<div><strong>${m(s?.name||"Sem empresa")}</strong>${s?.instagram?`<small>@${m(s.instagram)}</small>`:""}</div>${xe(t.type,{solid:!0})}</div>
      <h2>${m(t.title||g[t.type].label)}</h2>
      <p class="detail__when">${f("calendar",15)} ${m(Z(t.date))}, ${m(je(t.date).split(", ")[1])} \xB7 ${f("clock",15)} ${m(lt(t))}</p>
    </div>

    <div class="seg seg--status">
      ${we.map(n=>`<button class="seg__btn${t.status===n?" is-on":""} st-${n}" data-status="${n}">${n==="feito"?f("check",14):""}${de[n].label}</button>`).join("")}
    </div>

    <ul class="rows">
      <li><span class="rows__k">${f("users",16)} Respons\xE1vel</span><span class="rows__v">${(t.assignees||[]).map(n=>W(n,22)).join("")} ${m(oe(t.assignees))}</span></li>
      ${t.location?`<li><span class="rows__k">${f("pin",16)} Local</span><a class="rows__v link" href="https://maps.apple.com/?q=${encodeURIComponent(t.location)}" target="_blank" rel="noopener">${m(t.location)}</a></li>`:""}
      ${g[t.type].kind!=="post"||t.duration?`<li><span class="rows__k">${f("clock",16)} Dura\xE7\xE3o</span><span class="rows__v">${m(z(I(t)))}</span></li>`:""}
      <li><span class="rows__k">${f("bell",16)} Lembrete</span><span class="rows__v">${m(a?.label||"\u2014")}</span></li>
      ${i?`<li><span class="rows__k">${f("repeat",16)} Repeti\xE7\xE3o</span><span class="rows__v">${i} eventos na s\xE9rie</span></li>`:""}
      <li><span class="rows__k">${f(t.visibleToClient===!1?"eyeoff":"eye",16)} Cliente</span><span class="rows__v">${t.visibleToClient===!1?"N\xE3o aparece para o cliente":"Aparece no calend\xE1rio do cliente"}</span></li>
    </ul>

    ${t.description?`<div class="textbox"><h4>Descri\xE7\xE3o / legenda</h4><p>${m(t.description)}</p></div>`:""}
    ${t.internalNote?`<div class="textbox textbox--note"><h4>${f("eyeoff",13)} Nota interna (s\xF3 a equipe v\xEA)</h4><p>${m(t.internalNote)}</p></div>`:""}

    <div class="actions">
      <button data-act="ics">${f("bell",20)}<span>Lembrete no iPhone</span></button>
      <button data-act="tomorrow">${f("right",20)}<span>Passar p/ amanh\xE3</span></button>
      <button data-act="dup">${f("copy",20)}<span>Duplicar</span></button>
      <button data-act="del" class="is-danger">${f("trash",20)}<span>Excluir</span></button>
    </div>
    <p class="detail__meta">Criado por ${m(r.member(t.createdBy)?.name||"\u2014")}${t.updatedAt?" \xB7 atualizado "+new Date(t.updatedAt).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):""}</p>
  </div>`}function Nt(e,t){let s=e.el;s.querySelectorAll("[data-status]").forEach(a=>a.onclick=async()=>{let i=r.event(t);await r.upsert("events",{...i,status:a.dataset.status})});let o=(a,i)=>{let n=s.querySelector(`[data-act="${a}"]`);n&&(n.onclick=i)};o("edit",()=>ht({id:t})),o("dup",async()=>{let i={...r.event(t),id:N("e_"),status:"pendente",seriesId:null,createdAt:null,createdBy:null};await r.upsert("events",i),e.close(),S("Evento duplicado"),ht({id:i.id})}),o("tomorrow",async()=>{let a=r.event(t);await Rt(a,{date:E(a.date,1)})&&(await r.upsert("events",{...a,date:E(a.date,1)}),S("Movido para "+Z(E(a.date,1)).toLowerCase(),{action:"Desfazer",onAction:()=>r.upsert("events",{...r.event(t),date:a.date})}))}),o("ics",()=>{let a=r.event(t);ut([a],`${g[a.type].label}-${a.date}.ics`,P.appName)}),o("del",()=>yt(t,e))}async function yt(e,t){let s=r.event(e),o=[e];if(s.seriesId){let i=r.state.events.filter(n=>n.seriesId===s.seriesId&&n.date>=s.date).map(n=>n.id);if(i.length>1){let n=await Q({title:"Excluir evento repetido",options:[{label:"S\xF3 este",value:"one",danger:!0},{label:`Este e os pr\xF3ximos (${i.length})`,value:"next",danger:!0}]});if(!n)return;n==="next"&&(o=i)}else if(!await H({title:"Excluir este evento?",ok:"Excluir",danger:!0}))return}else if(!await H({title:"Excluir este evento?",text:"Ele some para a dupla e para o cliente.",ok:"Excluir",danger:!0}))return;let a=o.map(i=>({...r.event(i)}));await r.removeMany("events",o),t&&t.close(),S(o.length>1?`${o.length} eventos exclu\xEDdos`:"Evento exclu\xEDdo",{action:"Desfazer",onAction:()=>r.upsertMany("events",a),ms:4500})}function ht({id:e=null,date:t=null,companyId:s=null,type:o=null,time:a=null,assignees:i=null}={}){let n=e?r.event(e):null,c=r.companiesSorted(),d=o||"feed",l=n?JSON.parse(JSON.stringify(n)):{id:N("e_"),type:d,companyId:s||O.monthCompany||(c.length===1?c[0].id:null),title:"",date:t||(O.tab==="mes"?O.monthSel:O.date)||_(),time:a||g[d].best[0]||"12:00",duration:["shoot","meeting","work","other"].includes(g[d].kind)?g[d].dur:null,assignees:i||(O.person!=="all"?[O.person]:r.me?[r.me]:[]),location:"",description:"",internalNote:"",reminder:30,visibleToClient:g[d].client,status:"pendente"},u=n?JSON.parse(JSON.stringify(n)):null,v={mode:"none",until:E(l.date,28)};return q({className:"sheet--tall",html:bt(l,!!n,v),onMount:T=>Ot(T,l,u,v)})}var be=e=>["shoot","meeting","work","other"].includes(g[e].kind),le=e=>["shoot","meeting"].includes(g[e].kind);function bt(e,t,s){let o=r.companiesSorted();return`
  ${U(t?"Editar evento":"Novo evento",{left:'<button class="btn-text" data-close>Cancelar</button>',right:'<button class="btn btn--primary btn--sm" data-save>Salvar</button>'})}
  <form class="form" data-editor onsubmit="return false">
    <div class="fgroup">
      <label class="flabel">O que \xE9?</label>
      <div class="typegrid">
        ${Ge.map(a=>`<button type="button" class="typebtn tbadge--${a}${e.type===a?" is-on":""}" data-type="${a}">${f(g[a].icon,20)}<span>${g[a].label}</span></button>`).join("")}
      </div>
    </div>

    <div class="fgroup">
      <label class="flabel">Empresa</label>
      <div class="cogrid">
        ${o.map(a=>`<button type="button" class="cobtn${e.companyId===a.id?" is-on":""}" style="--cc:${a.color}" data-company="${a.id}">${L(a,26,7)}<span>${m(a.name)}</span></button>`).join("")}
        <button type="button" class="cobtn cobtn--add" data-newco>${f("plus",18)}<span>Nova empresa</span></button>
      </div>
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
        ${Ye.map(a=>`<option value="${a}"${(e.duration||g[e.type].dur)===a?" selected":""}>${z(a)}</option>`).join("")}
      </select>
    </div>

    <div data-hint></div>

    <div class="fgroup">
      <label class="flabel">Quem vai fazer?</label>
      <div class="whogrid">
        ${r.team.map(a=>`<button type="button" class="whobtn${(e.assignees||[]).includes(a.id)?" is-on":""}" style="--mc:${a.color}" data-who="${a.id}">${W(a.id,30)}<span>${m(a.name)}</span><i class="whobtn__check">${f("check",14)}</i></button>`).join("")}
      </div>
      <p class="fhelp">Marque os dois se forem juntos.</p>
    </div>

    <div class="fgroup" data-when="location" ${le(e.type)?"":"hidden"}>
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
        <select name="reminder">${ke.map(a=>`<option value="${a.v}"${(e.reminder??30)===a.v?" selected":""}>${a.label}</option>`).join("")}</select>
      </label>
      ${t?"":`<label class="list__row"><span>${f("repeat",18)} Repetir</span>
        <select name="repeat">${_e.map(a=>`<option value="${a.v}"${s.mode===a.v?" selected":""}>${a.label}</option>`).join("")}</select>
      </label>
      <label class="list__row" data-when="until" hidden><span>${f("calendar",18)} At\xE9</span>
        <input type="date" name="until" value="${s.until}">
      </label>`}
      <label class="list__row"><span>${f("eye",18)} Aparece para o cliente</span>
        <input type="checkbox" class="switch" name="visibleToClient" ${e.visibleToClient!==!1?"checked":""}>
      </label>
      ${t?`<label class="list__row"><span>${f("check",18)} Status</span>
        <select name="status">${we.map(a=>`<option value="${a}"${e.status===a?" selected":""}>${de[a].label}</option>`).join("")}</select>
      </label>`:""}
    </div>

    ${t?`<button type="button" class="btn btn--danger-soft btn--block" data-delete>${f("trash",18)} Excluir evento</button>`:""}
    <div class="form__spacer"></div>
  </form>`}function Ot(e,t,s,o){let a=e.el,i=a.querySelector("[data-editor]"),n=h=>a.querySelector(h),c=()=>{let h=n("[data-hint]");h.innerHTML=Pt(t,!s),h.querySelectorAll("[data-settime]").forEach(p=>p.onclick=()=>{t.time=p.dataset.settime,i.time.value=t.time,c()}),h.querySelectorAll("[data-setwho]").forEach(p=>p.onclick=()=>{t.assignees=[p.dataset.setwho],a.querySelectorAll("[data-who]").forEach(b=>b.classList.toggle("is-on",t.assignees.includes(b.dataset.who))),c()})},d=()=>{a.querySelector('[data-when="duration"]').hidden=!be(t.type),a.querySelector('[data-when="location"]').hidden=!le(t.type);let h=r.company(t.companyId),p=n("[data-useaddr]");p.hidden=!(h&&h.address&&i.location.value!==h.address);let b=a.querySelector('[data-when="until"]');b&&(b.hidden=o.mode==="none")};a.querySelectorAll("[data-type]").forEach(h=>h.onclick=()=>{let p=t.type;if(t.type=h.dataset.type,a.querySelectorAll("[data-type]").forEach(b=>b.classList.toggle("is-on",b===h)),i.title.placeholder=g[t.type].placeholder,(!s||p!==t.type)&&(t.duration=be(t.type)?g[t.type].dur:null,i.duration.value=String(g[t.type].dur),s||(t.visibleToClient=g[t.type].client,i.visibleToClient.checked=t.visibleToClient)),le(t.type)&&!i.location.value){let b=r.company(t.companyId);b?.address&&(i.location.value=b.address,t.location=b.address)}d(),c()}),a.querySelectorAll("[data-company]").forEach(h=>h.onclick=()=>{t.companyId=h.dataset.company,a.querySelectorAll("[data-company]").forEach(b=>b.classList.toggle("is-on",b===h));let p=r.company(t.companyId);le(t.type)&&p?.address&&!i.location.value&&(i.location.value=p.address,t.location=p.address),d()}),n("[data-newco]").onclick=()=>{Le(null,h=>{t.companyId=h.id,l(),e.set(bt(t,!!s,o))})},a.querySelectorAll("[data-who]").forEach(h=>h.onclick=()=>{let p=h.dataset.who;t.assignees=t.assignees.includes(p)?t.assignees.filter(b=>b!==p):[...t.assignees,p],h.classList.toggle("is-on",t.assignees.includes(p)),c()}),n("[data-useaddr]").onclick=()=>{let h=r.company(t.companyId);i.location.value=h.address,t.location=h.address,d()};let l=()=>{t.title=i.title.value.trim(),t.date=i.date.value,t.time=i.time.value||"",t.duration=be(t.type)?Number(i.duration.value):null,t.location=le(t.type)?i.location.value.trim():"",t.description=i.description.value.trim(),t.internalNote=i.internalNote.value.trim(),t.reminder=Number(i.reminder.value),t.visibleToClient=i.visibleToClient.checked,i.status&&(t.status=i.status.value),i.repeat&&(o.mode=i.repeat.value),i.until&&(o.until=i.until.value)};i.addEventListener("input",()=>{l(),d()}),i.addEventListener("change",()=>{l(),d(),c()});let u=n("[data-delete]");u&&(u.onclick=()=>yt(t.id,null).then(()=>!r.event(t.id)&&e.close())),n("[data-save]").onclick=async()=>{if(l(),!v){if(!t.companyId){S("Escolha a empresa"),a.querySelector(".cogrid").scrollIntoView({behavior:"smooth",block:"center"});return}if(!t.date)return S("Escolha o dia");if(!(!t.assignees.length&&!await H({title:"Ningu\xE9m respons\xE1vel?",text:"Este evento ficar\xE1 sem respons\xE1vel. Deseja salvar assim mesmo?",ok:"Salvar assim"}))&&!v){v=!0;try{await y()}finally{v=!1}}}};let v=!1,y=async()=>{if(s){if(["date","time","duration","type","assignees","companyId"].some(p=>JSON.stringify(t[p])!==JSON.stringify(s[p]))&&!await Oe(t,!1,e,T))return;await Ft(t,s)}else if(o.mode!=="none"){let h=Bt(t.date,o),p=h.filter(D=>ie({...t,date:D},{isNew:!0}).some(A=>A.level==="block")),b=h;if(p.length){let D=await Q({title:`${p.length} de ${h.length} datas j\xE1 t\xEAm compromisso nesse hor\xE1rio`,text:p.slice(0,6).map(A=>ee(A)).join(" \xB7 ")+(p.length>6?" \u2026":""),options:[{label:`Criar s\xF3 nas ${h.length-p.length} datas livres`,value:"free",primary:!0},{label:"Criar em todas mesmo assim",value:"all"}]});if(!D)return;if(D==="free"&&(b=h.filter(A=>!p.includes(A))),!b.length)return S("Nenhuma data livre")}let qe=N("s_");await r.upsertMany("events",b.map((D,A)=>({...t,id:A===0?t.id:N("e_"),date:D,seriesId:qe})),{activity:{kind:"series",count:b.length,label:`${g[t.type].label} ${_e.find(D=>D.v===o.mode)?.label.toLowerCase()||""} \xE0s ${w(t.time)}`,sample:{companyId:t.companyId,date:b[0]}}}),S(`${b.length} eventos criados`)}else{if(!await Oe(t,!0,e,T))return;await r.upsert("events",{...t}),S("Evento salvo")}e.close()};function T(){i.time.value=t.time||"",i.date.value=t.date,a.querySelectorAll("[data-who]").forEach(h=>h.classList.toggle("is-on",t.assignees.includes(h.dataset.who))),d(),c()}d(),c()}var Ne=420,vt=1380,B=e=>(Math.min(Math.max(e,Ne),vt)-Ne)/(vt-Ne)*100;function qt(e,t){let s=e.time?M(e):null,o=[8,10,12,14,16,18,20,22];return`<div class="lanes">
    <div class="lanes__head"><strong>Agenda dos dois em ${m(ee(e.date))}</strong></div>
    ${r.team.map(a=>{let i=r.eventsOn(e.date,{person:a.id}).filter(d=>d.id!==e.id&&d.time),n=(e.assignees||[]).includes(a.id),c=t.some(d=>d.level==="block"&&d.person===a.id);return`<div class="lane">
        <span class="lane__who">${W(a.id,22)}</span>
        <div class="lane__track">
          ${o.map(d=>`<i class="lane__tick" style="left:${B(d*60)}%"></i>`).join("")}
          ${i.map(d=>{let l=M(d),u=r.company(d.companyId);return`<span class="lane__ev" style="left:${B(l[0])}%;width:max(4px,${B(l[1])-B(l[0])}%);background:${u?.color||"#888"}" title="${m(V(d))}"></span>`}).join("")}
          ${s&&n?`<span class="lane__draft${c?" is-clash":""}" style="left:${B(s[0])}%;width:max(6px,${B(s[1])-B(s[0])}%)"></span>`:""}
        </div>
      </div>`}).join("")}
    <div class="lane lane--axis"><span class="lane__who"></span><div class="lane__track">${o.map(a=>`<small style="left:${B(a*60)}%">${a}h</small>`).join("")}</div></div>
  </div>`}function Pt(e,t){if(!e.date)return"";let s=ie(e,{isNew:t}),o=s.filter(y=>y.level==="block"),a=s.filter(y=>y.level==="warn"),i=s.filter(y=>y.level==="info"),n=ve(e,{limit:4}),c=ye(e),d=(e.assignees||[]).length===1?e.assignees[0]:null,l=o.length&&d?r.team.find(y=>y.id!==d&&c.includes(y.id)):null,u=g[e.type],v=y=>`<li class="issue issue--${y.level}">${f(y.level==="block"?"alert":y.level==="warn"?"flag":y.code==="partner"?"user":"bulb",15)}<div><strong>${m(y.title)}</strong><p>${m(y.text)}</p></div></li>`;return`
  <section class="assist">
    <header class="assist__head">${f("sparkle",16)} Assistente</header>
    ${qt(e,s)}
    ${s.length?`<ul class="issues">${[...o,...a,...i].map(v).join("")}</ul>`:e.time?`<p class="assist__ok">${f("check",15)} Hor\xE1rio livre para ${m(oe(e.assignees))}, sem conflitos.</p>`:""}
    ${l?`<button type="button" class="tchip tchip--wide" data-setwho="${l.id}">${W(l.id,18)} Passar para ${m(l.name)} (est\xE1 livre)</button>`:""}
    <div class="assist__sugg">
      <p>${m(u.tip)}</p>
      ${n.length?`<div class="hintbox__times">${n.map(y=>`<button type="button" class="tchip${e.time===y.time?" is-on":""}" data-settime="${y.time}">${w(y.time)}${y.peak?"<small>pico</small>":"<small>livre</small>"}</button>`).join("")}</div>`:`<p class="muted">Nenhum hor\xE1rio livre nesse dia${(e.assignees||[]).length?" para "+m(oe(e.assignees)):""}. Tente outro dia ou outra pessoa.</p>`}
    </div>
  </section>`}async function Oe(e,t,s,o){let i=ie(e,{isNew:t}).filter(v=>v.level==="block");if(!i.length)return!0;let n=ve(e,{limit:2}),c=(e.assignees||[]).length===1?e.assignees[0]:null,d=c&&r.team.find(v=>v.id!==c&&ye(e).includes(v.id)),l=[...n.map(v=>({label:`Mudar para ${w(v.time)} (livre)`,value:"time:"+v.time,primary:!0})),...d?[{label:`Passar para ${d.name} (est\xE1 livre)`,value:"who:"+d.id,primary:!n.length}]:[],{label:"Marcar mesmo assim",value:"force"}],u=await Q({title:i[0].code==="duplicate"?"Isso j\xE1 est\xE1 na agenda":"J\xE1 tem compromisso nesse hor\xE1rio",bodyHtml:`<ul class="issues issues--dialog">${i.map(v=>`<li class="issue issue--block">${f("alert",15)}<div><strong>${m(v.title)}</strong><p>${m(v.text)}</p></div></li>`).join("")}</ul>`,options:l});return u?u==="force"?!0:(u.startsWith("time:")&&(e.time=u.slice(5)),u.startsWith("who:")&&(e.assignees=[u.slice(4)]),o(),Oe(e,t,s,o)):!1}async function Rt(e,t){let s={...e,...t},o=ie(s).filter(i=>i.level==="block");return o.length?await Q({title:"J\xE1 tem compromisso nesse hor\xE1rio",bodyHtml:`<ul class="issues issues--dialog">${o.map(i=>`<li class="issue issue--block">${f("alert",15)}<div><strong>${m(i.title)}</strong><p>${m(i.text)}</p></div></li>`).join("")}</ul>`,options:[{label:"Mover mesmo assim",value:"force",primary:!0}]})==="force":!0}function Bt(e,t){let s=[],o=e,a=t.until&&t.until>=e?t.until:E(e,28);for(;o<=a&&s.length<150;){let i=j(o).getDay();(t.mode==="daily"||t.mode==="weekdays"&&i>=1&&i<=5||t.mode==="weekly"&&j(o).getDay()===j(e).getDay())&&s.push(o),o=E(o,1)}return s}var jt=["type","companyId","title","time","duration","assignees","location","description","internalNote","reminder","visibleToClient"];async function Ft(e,t){let s=jt.filter(o=>JSON.stringify(e[o])!==JSON.stringify(t[o]));if(e.seriesId&&s.length){let o=r.state.events.filter(a=>a.seriesId===e.seriesId&&a.date>t.date);if(o.length){let a=await Q({title:"Evento repetido",text:"Aplicar as altera\xE7\xF5es a quais eventos?",options:[{label:"S\xF3 a este",value:"one",primary:!0},{label:`A este e aos pr\xF3ximos (${o.length+1})`,value:"next"}]});if(!a)return;if(a==="next"){let i=Object.fromEntries(s.map(n=>[n,e[n]]));await r.upsertMany("events",[{...e},...o.map(n=>({...n,...i}))],{activity:{kind:"series-edit",count:o.length+1,label:`${g[e.type].label} \xB7 a partir de ${e.date.slice(8)}/${e.date.slice(5,7)}`,sample:{companyId:e.companyId,date:e.date}}}),S("S\xE9rie atualizada");return}}}await r.upsert("events",{...e}),S("Altera\xE7\xF5es salvas")}export{Ht as a,r as b,Kt as c,Wt as d,O as e,Zt as f,W as g,St as h,L as i,Ae as j,Te as k,q as l,na as m,U as n,S as o,H as p,Q as q,De as r,M as s,V as t,ve as u,At as v,da as w,pa as x,ut as y,Fa as z,ht as A,Rt as B,xa as C,Aa as D,Le as E};
