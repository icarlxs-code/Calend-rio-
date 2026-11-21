import{b as ye,c as Ze,d as K,e as re,f as ke}from"./c-WOY6I3VW.js";import{a as Le}from"./c-6PVVLET6.js";import{a as ie,g as ge}from"./c-YYEZHYZE.js";import{d as Xe}from"./c-QD5CEUMQ.js";import{a as Ge,b as Ke,c as We,d as G,h as le,j as I,k as Ye,l as Qe,m as he,n as $e,o as M,q as j,r as w,s as R,t as F}from"./c-LAHZC5TF.js";import{a as me,b as Pe,d as Be,e as Fe,f as l}from"./c-2AO6QKH7.js";import{B as c,D as V,G as Re,c as Z,d as x,e as S,f as Ne,g as ee,i as Oe,j as te,k as ae,l as De,m as P,r as Me,t as je,u as U,v as B,w as ue,z as D}from"./c-ZUAJ4OTH.js";import{a as X}from"./c-PVDXWGYP.js";import{A as ve,B as ne,h as b,i as z,j as k,l as He,m as _,o as Ue,p as J,q as Ve,s as T,t as ze,u as se,v as fe,w as be,y as oe,z as Je}from"./c-LQRWGXTC.js";import{b as p}from"./c-7BGTL2PK.js";var we=null;function _e({title:a="Marcado!",sub:e="",sound:n=!0}={}){if(typeof document>"u")return;document.querySelectorAll(".okfx").forEach(s=>s.remove()),clearTimeout(we);let o=document.createElement("div");o.className="okfx",o.setAttribute("role","status"),o.innerHTML=`<div class="okfx__card">
      <svg class="okfx__ring" viewBox="0 0 120 120" aria-hidden="true">
        <circle class="okfx__halo" cx="60" cy="60" r="50"/>
        <circle class="okfx__track" cx="60" cy="60" r="46"/>
        <circle class="okfx__prog" cx="60" cy="60" r="46"/>
        <path class="okfx__check" d="M40 61.5 54 75 81 46"/>
      </svg>
      <b class="okfx__t">${c(a)}</b>${e?`<small class="okfx__s">${c(e)}</small>`:""}
      <span class="okfx__brand">${Le("simbolo",{h:18})}</span>
    </div>`,document.body.appendChild(o),requestAnimationFrame(()=>requestAnimationFrame(()=>o.classList.add("is-in"))),n&&import("./c-UNSFT7I3.js").then(s=>s.softOk()).catch(()=>{});try{navigator.vibrate&&navigator.vibrate(12)}catch{}let t=()=>{o.classList.add("is-out"),setTimeout(()=>o.remove(),420)};we=setTimeout(t,1500),o.addEventListener("click",()=>{clearTimeout(we),t()})}var W=(()=>{try{return JSON.parse(localStorage.getItem("pauta.ui")||"{}")}catch{return{}}})(),C={tab:W.tab==="pessoal"?"hoje":W.tab||"hoje",space:W.space==="personal"?"personal":"work",ptab:W.ptab||"p-hoje",pMonth:null,pSel:null,pView:"mes",person:W.person||"all",date:x(),month:ee(x()),monthSel:x(),monthCompany:null,showAllTips:!1};function Bt(){try{localStorage.setItem("pauta.ui",JSON.stringify({tab:C.tab,person:C.person,space:C.space,ptab:C.ptab}))}catch{}}var bt={feed:"\u{1F5BC}\uFE0F",carrossel:"\u{1F5C2}\uFE0F",reels:"\u{1F3AC}",story:"\u2B55",captacao:"\u{1F4F8}",reuniao:"\u{1F91D}",producao:"\u2702\uFE0F",outro:"\u2022"},Y=a=>String(a||"").replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\r?\n/g,"\\n"),vt=a=>{let e=[];for(;a.length>74;)e.push(a.slice(0,74)),a=" "+a.slice(74);return e.push(a),e.join(`\r
`)},et=(a,e)=>a.replace(/-/g,"")+"T"+e.replace(":","")+"00",ht=()=>new Date().toISOString().replace(/[-:]/g,"").replace(/\.\d+/,"");function $t(a,e){let n=["BEGIN:VCALENDAR","VERSION:2.0",`PRODID:-//${X.appName}//PT-BR`,"CALSCALE:GREGORIAN","METHOD:PUBLISH",`X-WR-CALNAME:${Y(e)}`];return a.forEach(o=>{let t=l.company(o.companyId),s=(o.assignees||[]).map(u=>l.member(u)?.name).filter(Boolean).join(" e "),r=`${bt[o.type]||""} ${b[o.type]?.label||"Evento"} \xB7 ${t?.name||""}${o.title?" \u2014 "+o.title:""}`.trim(),d=[s&&`Respons\xE1vel: ${s}`,o.description,o.internalNote&&`Nota interna: ${o.internalNote}`].filter(Boolean).join(`
`);if(n.push("BEGIN:VEVENT",`UID:${o.id}@pauta`,`DTSTAMP:${ht()}`),o.time){let u=te(o.time)+se(o),$=u>=1440?S(o.date,1):o.date;n.push(`DTSTART:${et(o.date,o.time)}`,`DTEND:${et($,ae(u%1440))}`)}else n.push(`DTSTART;VALUE=DATE:${o.date.replace(/-/g,"")}`,`DTEND;VALUE=DATE:${S(o.date,1).replace(/-/g,"")}`);n.push(`SUMMARY:${Y(r)}`),d&&n.push(`DESCRIPTION:${Y(d)}`),o.location&&n.push(`LOCATION:${Y(o.location)}`);let i=o.reminder??30;i>=0&&n.push("BEGIN:VALARM","ACTION:DISPLAY",`DESCRIPTION:${Y(r)}`,`TRIGGER:-PT${i}M`,"END:VALARM"),n.push("END:VEVENT")}),n.push("END:VCALENDAR"),n.map(vt).join(`\r
`)}async function tt(a,e,n){let o=$t(a,n),t=ie();if(t){let i=document.createElement("form");i.method="POST",i.action=t.replace(/\/$/,"")+"/ics",i.target="_blank",i.style.display="none";let u=document.createElement("textarea");u.name="ics",u.value=o,i.appendChild(u),document.body.appendChild(i),i.submit(),i.remove();return}let s=new File([o],e,{type:"text/calendar"});if(navigator.canShare&&navigator.canShare({files:[s]}))try{await navigator.share({files:[s],title:n});return}catch(i){if(i&&i.name==="AbortError")return}let r=URL.createObjectURL(s),d=document.createElement("a");d.href=r,d.download=e,document.body.appendChild(d),d.click(),d.remove(),setTimeout(()=>URL.revokeObjectURL(r),4e3)}var at=new Set(["fazer","criar","postar","subir","publicar","gravar","post","postagem","publicacao","publica\xE7\xE3o","o","a","um","uma","no","na","do","da","de","dos","das","pro","pra","para","feed","reels","reel","story","stories","storie","storys","carrossel","carosel","carossel","instagram","insta","ig","sobre","com","e"]),gt=[[/\bcouve flor\b/gi,"couve-flor"],[/\bpromocao\b/gi,"promo\xE7\xE3o"],[/\bpromoçao\b/gi,"promo\xE7\xE3o"],[/\bacao\b/gi,"a\xE7\xE3o"],[/\bpao\b/gi,"p\xE3o"],[/\blimao\b/gi,"lim\xE3o"],[/\bmamao\b/gi,"mam\xE3o"],[/\bmelao\b/gi,"mel\xE3o"],[/\bfeijao\b/gi,"feij\xE3o"],[/\bmaca\b/gi,"ma\xE7\xE3"],[/\bmaça\b/gi,"ma\xE7\xE3"],[/\babobora\b/gi,"ab\xF3bora"],[/\bpessego\b/gi,"p\xEAssego"],[/\bmaracuja\b/gi,"maracuj\xE1"],[/\babacate\b/gi,"abacate"],[/\babacaxi\b/gi,"abacaxi"],[/\bcafe\b/gi,"caf\xE9"],[/\bpromo\b/gi,"promo"],[/\bblack friday\b/gi,"Black Friday"],[/\bnatal\b/gi,"Natal"],[/\bano novo\b/gi,"Ano Novo"],[/\bdia das maes\b/gi,"Dia das M\xE3es"],[/\bdia dos pais\b/gi,"Dia dos Pais"],[/\bhamburguer\b/gi,"hamb\xFArguer"],[/\bhamburguers\b/gi,"hamb\xFArgueres"],[/\blancamento\b/gi,"lan\xE7amento"],[/\bcolecao\b/gi,"cole\xE7\xE3o"],[/\bvideo\b/gi,"v\xEDdeo"],[/\bsabado\b/gi,"s\xE1bado"],[/\bpromocoes\b/gi,"promo\xE7\xF5es"]],st=a=>a.toLowerCase().replace(/[.,:;!]+$/,""),yt={feed:"Post no feed",carrossel:"Carrossel",reels:"Reels",story:"Stories"},ot=/^(post no feed|carrossel|reels|stories|story)\s+—\s+/i;function nt(a,e=null){let n=String(a||"").replace(/\s+/g," ").trim();if(!n)return n;let o=yt[e];if(!o)return Ee(Se(n));if(ot.test(n))return`${o} \u2014 ${Ee(Se(n.replace(ot,"")))}`;let t=n.split(" ");for(;t.length>1&&at.has(st(t[0]));)t.shift();return n=t.join(" ").replace(/\s+(no|pro|pra|para o)\s+(instagram|insta|ig|feed)\s*$/i,"").trim(),at.has(st(n))?o:`${o} \u2014 ${Ee(Se(n))}`}var Se=a=>{for(let[e,n]of gt)a=a.replace(e,n);return a},Ee=a=>a&&a.charAt(0).toLocaleUpperCase("pt-BR")+a.slice(1);var kt=[[/pura vida|hortifruti|jg garcia/i,"hortifruti: frutas, verduras e legumes frescos"],[/bbq|burger|hamb/i,"hamburgueria e churrasco (BBQ)"],[/multimarcas|moda|roupa/i,"loja de roupas multimarcas"],[/festa/i,"loja de artigos e decora\xE7\xE3o de festas"]];function xe(a){if(a?.niche)return a.niche;let e=kt.find(([n])=>n.test(a?.name||""));return e?e[1]:""}function wt(){let a=x();return l.state.companies.map(e=>{let n=l.state.events.filter(r=>r.companyId===e.id&&b[r.type]?.kind==="post"),o=n.filter(r=>r.date<=a&&(r.status==="feito"||r.date<a)).map(r=>r.date).sort(),t=n.filter(r=>r.date>=a&&r.status!=="feito").map(r=>r.date).sort(),s=o[o.length-1]||"";return{onlyFor:e.notifyOnly||null,name:e.name,niche:xe(e)||"pequena empresa local",lastPost:s,nextPost:t[0]||"",daysSincePost:s?Oe(s,a):null}})}function _t(){let a=x(),e=new Date,n=e.getHours()*60+e.getMinutes(),o=l.state.events.filter(s=>s.status!=="feito"&&s.date>=a).sort((s,r)=>(s.date+(s.time||"")).localeCompare(r.date+(r.time||""))),t=l.state.events.filter(s=>s.status!=="feito"&&s.time&&(s.date<a||s.date===a&&te(s.time)<n)).length;return{arch:k.arch,profession:k.profession||"",entity:k.entity.many,tips:_()?[]:(k.tips||[]).slice(0,12),next:o.slice(0,5).map(s=>({date:s.date,time:s.time||"",label:b[s.type]?.label||"Compromisso",title:(s.title||"").slice(0,60),who:(s.assignees||[])[0]||""})),late:t}}var lt=null,it="";function sa(){l.mode!=="cloud"||!ie()||!l.ready||(clearTimeout(lt),lt=setTimeout(()=>{let a=wt(),e=_t(),n=JSON.stringify([a,e]);n!==it&&ge("/coach",{companies:a,work:e}).then(()=>it=n).catch(()=>{})},4e3))}var oa=()=>ge("/coach-test",{});var St={Empresa:"Pura Vida",Local:"Hospital Santa Clara",Turma:"9\xBA ano B",Obra:"Residencial Aurora",Cliente:"Maria Silva",Setor:"Linha de produ\xE7\xE3o 2",Unidade:"3\xBA Batalh\xE3o",Projeto:"Novo site",Plataforma:"iFood",\u00C1rea:"Talh\xE3o 3",Mat\u00E9ria:"Matem\xE1tica"};function va(){let a=l.companiesSorted(),e=x(),n=Ne(e),o=S(n,6);return`
  <header class="hdr">
    <div class="hdr__row">
      <div class="hdr__titles"><p class="hdr__eyebrow">${a.length} ${a.length===1?T(!1,!0):T(!0,!0)}</p><h1>${T(!0)}</h1></div>
      <div class="hdr__actions"><button class="btn btn--primary btn--sm" data-action="new-company">${p("plus",16)} ${J()}</button></div>
    </div>
  </header>
  <div class="page">
    ${a.length?"":$e(`${Ve()} ${T(!1,!0)} ainda`,`Cadastre ${k.entity.hint} com nome, cor e foto. Assim cada compromisso fica organizado no lugar certo.`,`<button class="btn btn--primary" data-action="new-company">${p("plus",18)} Cadastrar ${T(!1,!0)}</button>`)}
    <div class="colist">
      ${a.map(t=>{let s=l.eventsBetween(n,o,{companyId:t.id}),r=s.filter(u=>ze(u.type)).length,d=s.filter(u=>u.type==="captacao").length,i=l.state.events.filter(u=>u.companyId===t.id&&u.date>=e&&u.status!=="feito").sort((u,$)=>(u.date+u.time).localeCompare($.date+$.time))[0];return`<button class="cocard" style="--cc:${t.color};--cc-soft:${V(t.color,.1)}" data-action="open-company" data-id="${t.id}">
          <div class="cocard__top">
            ${I(t,48)}
            <div class="cocard__name"><strong>${c(t.name)}</strong>${t.instagram?`<small>${p("insta",12)} @${c(t.instagram)}</small>`:""}</div>
            ${p("right",18,"muted")}
          </div>
          <div class="cocard__stats">
            ${_()?`<span><b>${r}</b> posts</span><span><b>${d}</b> capta\xE7${d===1?"\xE3o":"\xF5es"}</span>`:`<span><b>${s.length}</b> compromisso${s.length===1?"":"s"}</span>`}<span class="muted">nesta semana</span>
          </div>
          ${i?`<div class="cocard__next">${p(b[i.type].icon,14)} <b>${c(U(i.date))}${i.time?" "+i.time:""}</b> \xB7 ${c(b[i.type].label)} \u2014 ${c(i.title||"")}</div>`:'<div class="cocard__next muted">Nada agendado</div>'}
        </button>`}).join("")}
    </div>
  </div>`}function ha(a){let e=M({className:"sheet--tall",html:rt(a),onMount:n=>Et(n,a)});e.refresh=()=>l.company(a)?e.set(rt(a)):e.close()}function rt(a){let e=l.company(a);if(!e)return"";let n=x(),o=ee(n),t=l.eventsBetween(`${o}-01`,`${o}-31`,{companyId:a}),s=l.eventsBetween(n,S(n,30),{companyId:a}),r=l.eventsBetween(S(n,-14),S(n,-1),{companyId:a}).reverse(),d=v=>t.filter(h=>v.includes(h.type)).length,i=t.filter(v=>v.status==="feito").length,u="",$=s.map(v=>{let h=v.date!==u?`<h4 class="dayhead">${c(B(v.date))}</h4>`:"";return u=v.date,h+he(v)}).join("");return`
  ${j("",{right:l.canEdit("companies",e)?'<button class="btn-text" data-act="edit">Editar</button>':""})}
  <div class="cohero" style="--cc:${e.color};--cc-soft:${V(e.color,.14)}">
    ${I(e,72,20)}
    <h2>${c(e.name)}</h2>
    ${e.instagram?`<a class="cohero__ig" href="https://instagram.com/${encodeURIComponent(e.instagram)}" target="_blank" rel="noopener">${p("insta",14)} @${c(e.instagram)}</a>`:""}
    <div class="cohero__btns">
      <button class="btn btn--primary btn--sm" data-act="new">${p("plus",16)} Evento</button>
      ${k.clientLike?`<button class="btn btn--soft btn--sm" data-act="clientview">${p("eye",16)} P\xE1gina do cliente</button>`:""}
      <button class="btn btn--soft btn--sm" data-act="share">${p("share",16)} Enviar</button>
    </div>
  </div>

  <div class="page page--sheet">
    <section class="block">
      <h2 class="block__title">${c(je(o))}</h2>
      <div class="mstats mstats--5">
        <div><b>${d(["feed","carrossel"])}</b><span>feed</span></div>
        <div><b>${d(["reels"])}</b><span>reels</span></div>
        <div><b>${d(["story"])}</b><span>stories</span></div>
        <div><b>${d(["captacao"])}</b><span>capta\xE7\xF5es</span></div>
        <div><b>${t.length?Math.round(i/t.length*100):0}%</b><span>feito</span></div>
      </div>
    </section>

    ${e.address||e.contact||e.notes?`<ul class="rows">
      ${e.address?`<li><span class="rows__k">${p("pin",16)} Endere\xE7o</span><a class="rows__v link" href="https://maps.apple.com/?q=${encodeURIComponent(e.address)}" target="_blank" rel="noopener">${c(e.address)}</a></li>`:""}
      ${e.contact?`<li><span class="rows__k">${p("user",16)} Contato</span><span class="rows__v">${c(e.contact)}</span></li>`:""}
      ${e.notes?`<li><span class="rows__k">${p("note",16)} Observa\xE7\xF5es</span><span class="rows__v">${c(e.notes)}</span></li>`:""}
    </ul>`:""}

    <section class="block">
      <h2 class="block__title">Pr\xF3ximos 30 dias</h2>
      ${$||$e("Nada agendado","Toque em + para marcar o primeiro compromisso aqui.")}
    </section>

    ${r.length?`<section class="block">
      <h2 class="block__title">\xDAltimas 2 semanas</h2>
      ${r.map(v=>he(v,{showDate:!0,compact:!0})).join("")}
    </section>`:""}
  </div>`}function Et(a,e){let n=a.el;(n.querySelector('[data-act="edit"]')||{}).onclick=()=>Te(e),n.querySelector('[data-act="new"]').onclick=async()=>{let{openEventEditor:o}=await import("./c-YNTUWSZK.js");o({companyId:e})},n.querySelector('[data-act="share"]').onclick=()=>Ce(e),n.querySelector('[data-act="clientview"]').onclick=()=>xt(e)}function Te(a=null,e=null){let n=a?l.company(a):null,o=l.state.companies.map(d=>d.color),t=n?{...n}:{id:D("c_"),name:"",color:oe.find(d=>!o.includes(d))||oe[0],logo:null,instagram:"",address:"",contact:"",notes:"",shareToken:null},s=()=>`
    ${j(n?`Editar ${T(!1,!0)}`:`${J()} ${T(!1,!0)}`,{left:'<button class="btn-text" data-close>Cancelar</button>',right:'<button class="btn btn--primary btn--sm" data-save>Salvar</button>'})}
    <form class="form" onsubmit="return false">
      <div class="logopick">
        <div data-preview>${I({...t,name:t.name||"?"},88,24)}</div>
        <div class="logopick__btns">
          <label class="btn btn--soft btn--sm">${p("image",16)} ${t.logo?"Trocar logo":"Enviar logomarca"}<input type="file" accept="image/*" data-file hidden></label>
          ${t.logo?'<button type="button" class="btn-text btn-text--sm" data-rmlogo>Remover logo</button>':'<p class="fhelp">Opcional. Sem logo, usamos as iniciais na cor escolhida.</p>'}
        </div>
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-name">Nome (${c(k.entity.hint)})</label>
        <input id="c-name" class="input" name="name" value="${c(t.name)}" placeholder="Ex.: ${c(St[k.entity.one]||"Pura Vida")}" autocomplete="off" maxlength="60">
      </div>
      <div class="fgroup">
        <label class="flabel">Cor no calend\xE1rio</label>
        <div class="palette">
          ${oe.map(d=>`<button type="button" class="swatch${t.color===d?" is-on":""}" style="background:${d}" data-color="${d}" aria-label="Cor ${d}">${p("check",16)}</button>`).join("")}
          <label class="swatch swatch--custom" title="Outra cor"><input type="color" value="${t.color}" data-customcolor>${p("plus",16)}</label>
        </div>
      </div>
      <div class="fgroup"${_()?"":" hidden"}>
        <label class="flabel" for="c-ig">Instagram</label>
        <div class="input-prefix"><span>@</span><input id="c-ig" class="input" name="instagram" value="${c(t.instagram||"")}" placeholder="usuario" autocomplete="off" autocapitalize="none"></div>
      </div>
      <div class="fgroup"${l.team.length>1?"":" hidden"}>
        <label class="flabel">Notifica\xE7\xF5es daqui v\xE3o para</label>
        <div class="seg seg--notify">${[["",l.team.length===2?"Os dois":"Todos"],...l.team.map(d=>[d.id,d.name])].map(([d,i])=>`<button type="button" class="seg__btn${(t.notifyOnly||"")===d?" is-on":""}" data-only="${d}">${c(i)}</button>`).join("")}</div>
        <p class="fhelp">${_()?"Avisos, lembretes, \u201CJ\xE1 postou?\u201D, cobran\xE7as de atraso e dicas desta empresa":`Avisos, lembretes e cobran\xE7as de atraso ${Ue()?"desta":"deste"} ${c(T(!1,!0))}`} chegam s\xF3 para quem estiver marcado.</p>
      </div>
      <div class="fgroup"${_()?"":" hidden"}>
        <label class="flabel" for="c-niche">O que a empresa faz (para as dicas)</label>
        <input id="c-niche" class="input" name="niche" value="${c(t.niche||xe(t))}" placeholder="Ex.: hamburgueria artesanal, loja de roupas femininas" autocomplete="off" maxlength="160">
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-addr">Endere\xE7o</label>
        <input id="c-addr" class="input" name="address" value="${c(t.address||"")}" placeholder="Rua, n\xFAmero \u2013 bairro" autocomplete="off">
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-contact">Contato</label>
        <input id="c-contact" class="input" name="contact" value="${c(t.contact||"")}" placeholder="${_()?"Nome e WhatsApp do respons\xE1vel":"Telefone, respons\xE1vel, hor\xE1rio\u2026"}" autocomplete="off">
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-notes">${_()?"Observa\xE7\xF5es internas":"Observa\xE7\xF5es"}</label>
        <textarea id="c-notes" class="input" name="notes" rows="3" placeholder="${_()?"Tom de voz, o que evitar, prefer\xEAncias\u2026":"Tudo o que voc\xEA precisa lembrar sobre esse lugar\u2026"}">${c(t.notes||"")}</textarea>
      </div>
      ${n?`<button type="button" class="btn btn--danger-soft btn--block" data-delete>${p("trash",18)} Excluir ${T(!1,!0)}</button>`:""}
      <div class="form__spacer"></div>
    </form>`,r=d=>{let i=d.el,u=i.querySelector("form"),$=()=>{t.name=u.name.value.trim(),t.instagram=u.instagram.value.trim().replace(/^@/,""),t.niche=u.niche.value.trim(),t.notifyOnly=i.querySelector("[data-only].is-on")?.dataset.only||null,t.address=u.address.value.trim(),t.contact=u.contact.value.trim(),t.notes=u.notes.value.trim()},v=()=>i.querySelector("[data-preview]").innerHTML=I({...t,name:u.name.value||"?"},88,24);u.name.addEventListener("input",v),i.querySelectorAll("[data-only]").forEach(y=>y.onclick=()=>i.querySelectorAll("[data-only]").forEach(m=>m.classList.toggle("is-on",m===y))),i.querySelectorAll("[data-color]").forEach(y=>y.onclick=()=>{t.color=y.dataset.color,i.querySelectorAll("[data-color]").forEach(m=>m.classList.toggle("is-on",m===y)),v()}),i.querySelector("[data-customcolor]").oninput=y=>{t.color=y.target.value,i.querySelectorAll("[data-color]").forEach(m=>m.classList.remove("is-on")),v()},i.querySelector("[data-file]").onchange=async y=>{let m=y.target.files[0];if(m)try{$(),t.logo=await Re(m,160),d.set(s())}catch{w("N\xE3o foi poss\xEDvel ler essa imagem")}};let h=i.querySelector("[data-rmlogo]");h&&(h.onclick=()=>{$(),t.logo=null,d.set(s())});let A=i.querySelector("[data-delete]");A&&(A.onclick=async()=>{let y=l.state.events.filter(f=>f.companyId===t.id);await R({title:`Excluir ${t.name}?`,text:y.length?`Os ${y.length} compromissos daqui tamb\xE9m ser\xE3o apagados e o link do cliente deixar\xE1 de funcionar.`:"O link do cliente deixar\xE1 de funcionar.",ok:"Excluir",danger:!0})&&(await l.removeMany("events",y.map(f=>f.id)),await l.remove("companies",t.id),d.close(),w("Exclu\xEDdo"))}),i.querySelector("[data-save]").onclick=async()=>{if($(),!t.name)return u.name.focus(),w("Digite o nome");await l.upsert("companies",{...t}),d.close(),w(n?"Atualizado":"Cadastrado"),e&&e(l.company(t.id))}};M({className:"sheet--tall",html:s(),onMount:r})}async function Ce(a){let e=l.company(a),n=l.mode==="cloud",o="";n?(await l.ensureShareToken(e),await l.publishCompany(a),o=Be(l.company(a).shareToken)):o=Fe(await Pe(me(e,l.state.events,{maxFuture:90})));let t=`
    ${j("Link do cliente")}
    <div class="share">
      <div class="share__co">${I(e,56)}<div><strong>${c(e.name)}</strong><small>v\xEA somente o pr\xF3prio cronograma</small></div></div>
      <ul class="checks">
        <li>${p("check",16)} Somente os eventos da ${c(e.name)}</li>
        <li>${p("check",16)} Sem notas internas e sem outras empresas</li>
        <li>${p("check",16)} Somente leitura: o cliente n\xE3o consegue alterar nada</li>
        <li>${p(n?"check":"alert",16)} ${n?"Sempre atualizado: tudo que voc\xEAs mudarem aparece para o cliente":"Foto do cronograma atual (pr\xF3ximos 90 dias). Quando mudar algo, envie o link de novo"}</li>
      </ul>
      <div class="share__link"><input readonly value="${c(o)}" data-link></div>
      <div class="share__btns">
        <button class="btn btn--primary btn--block" data-sharebtn>${p("share",18)} Enviar para o cliente</button>
        <button class="btn btn--soft btn--block" data-copy>${p("copy",18)} Copiar link</button>
        <a class="btn btn--ghost btn--block" href="${c(o)}" target="_blank" rel="noopener">${p("eye",18)} Ver como o cliente v\xEA</a>
      </div>
      ${n?'<button class="btn-text btn-text--sm btn-text--danger" data-revoke>Gerar novo link (o antigo para de funcionar)</button>':'<p class="fhelp">Dica: ative a sincroniza\xE7\xE3o na nuvem (Ajustes) para o link ficar sempre atualizado automaticamente.</p>'}
    </div>`;M({html:t,onMount:s=>{let r=s.el;r.querySelector("[data-copy]").onclick=async()=>{try{await navigator.clipboard.writeText(o),w("Link copiado")}catch{r.querySelector("[data-link]").select(),w("Selecione e copie o link")}},r.querySelector("[data-sharebtn]").onclick=async()=>{let i=`Ol\xE1! Este \xE9 o cronograma de conte\xFAdo da ${e.name}. Por aqui voc\xEAs acompanham tudo o que est\xE1 planejado: posts, stories, reels e capta\xE7\xF5es.`;if(navigator.share)try{await navigator.share({title:`Cronograma \xB7 ${e.name}`,text:i,url:o})}catch{}else await navigator.clipboard?.writeText(`${i}
${o}`),w("Mensagem copiada")};let d=r.querySelector("[data-revoke]");d&&(d.onclick=async()=>{await R({title:"Gerar um novo link?",text:"Quem tiver o link antigo n\xE3o conseguir\xE1 mais ver o cronograma.",ok:"Gerar novo link",danger:!0})&&(await l.regenerateShareToken(l.company(a)),s.close(),Ce(a))})}})}async function xt(a){let e=l.company(a);if(!e)return;let{showClient:n}=await import("./c-RAUBPMD6.js"),{sanitizePayload:o}=await import("./c-ELSGR7RA.js"),t=o(me(e,l.state.events)),s=document.createElement("div");s.className="client-preview",s.innerHTML=`<div class="client-preview__bar"><button class="btn btn--soft btn--sm" data-closepv>${p("left",16)} Voltar</button><span>Assim o cliente v\xEA</span><button class="btn btn--primary btn--sm" data-sendpv>${p("share",16)} Enviar</button></div><div class="client-preview__body"></div>`,document.body.appendChild(s),document.body.classList.add("has-sheet"),n(s.querySelector(".client-preview__body"),t,{canGoBack:!1,preview:!0});let r=()=>{s.remove(),document.body.classList.toggle("has-sheet",!!document.querySelector(".sheet-wrap"))};s.querySelector("[data-closepv]").onclick=r,s.querySelector("[data-sendpv]").onclick=()=>{r(),Ce(a)}}function Ma(a){let e=M({html:ct(a),className:"sheet--tall",onMount:n=>Tt(n,a)});e.refresh=()=>{if(!l.event(a))return e.close();e.set(ct(a))}}function ct(a){let e=l.event(a);if(!e)return"";let n=l.company(e.companyId),o=n?.color||"#666",t=ve.find(i=>i.v===(e.reminder??30)),s=e.seriesId?l.state.events.filter(i=>i.seriesId===e.seriesId).length:0,r=l.canEdit("events",e),d=l.member(l.ownerOf("events",e))?.name||"o parceiro";return`
  ${j("",{right:r?'<button class="btn-text" data-act="edit">Editar</button>':""})}
  <div class="detail">
    <div class="detail__hero" style="--cc:${o};--cc-soft:${V(o,.12)}">
      <div class="detail__co">${I(n,40)}<div><strong>${c(n?.name||"Sem "+T(!1,!0))}</strong>${n?.instagram?`<small>@${c(n.instagram)}</small>`:""}</div>${Ye(e.type,{solid:!0})}</div>
      <h2><span class="pfrow">${We(e,24)}</span>${c(e.title||b[e.type].label)}</h2>
      <p class="detail__when">${p("calendar",15)} ${c(U(e.date))}, ${c(Me(e.date).split(", ")[1])} \xB7 ${p("clock",15)} ${c(Qe(e))}</p>
    </div>

    ${r?"":`<p class="detail__lock">${p("eye",14)} Cadastrado por ${c(d)} \u2014 ${l.canComplete(e)?"voc\xEA \xE9 respons\xE1vel: pode marcar o andamento, mas n\xE3o editar.":"voc\xEA s\xF3 pode ver. Use \u201CDuplicar\u201D para criar uma c\xF3pia sua."}</p>`}
    <div class="seg seg--status"${r||l.canComplete(e)?"":" hidden"}>
      ${be.map(i=>`<button class="seg__btn${e.status===i?" is-on":""} st-${i}" data-status="${i}">${i==="feito"?p("check",14):""}${fe[i].label}</button>`).join("")}
    </div>

    <ul class="rows">
      ${pe()?"":`<li><span class="rows__k">${p("users",16)} Respons\xE1vel</span><span class="rows__v">${(e.assignees||[]).map(i=>G(i,22)).join("")} ${c(le(e.assignees))}</span></li>`}
      ${e.location?`<li><span class="rows__k">${p("pin",16)} Local</span><a class="rows__v link" href="https://maps.apple.com/?q=${encodeURIComponent(e.location)}" target="_blank" rel="noopener">${c(e.location)}</a></li>`:""}
      ${b[e.type].kind!=="post"||e.duration?`<li><span class="rows__k">${p("clock",16)} Dura\xE7\xE3o</span><span class="rows__v">${c(ue(se(e)))}</span></li>`:""}
      <li><span class="rows__k">${p("bell",16)} Lembrete</span><span class="rows__v">${c(t?.label||"\u2014")}</span></li>
      ${s?`<li><span class="rows__k">${p("repeat",16)} Repeti\xE7\xE3o</span><span class="rows__v">${s} eventos na s\xE9rie</span></li>`:""}
      ${k.clientLike?`<li><span class="rows__k">${p(e.visibleToClient===!1?"eyeoff":"eye",16)} Cliente</span><span class="rows__v">${e.visibleToClient===!1?"N\xE3o aparece para o cliente":"Aparece no link do cliente"}</span></li>`:""}
    </ul>

    ${e.description?`<div class="textbox"><h4>${c(k.form.desc[0])}</h4><p>${c(e.description)}</p></div>`:""}
    ${e.internalNote?`<div class="textbox textbox--note"><h4>${p("eyeoff",13)} ${c(k.form.note[0])} (${mt()})</h4><p>${c(e.internalNote)}</p></div>`:""}

    <div class="actions">
      <button data-act="ics">${p("bell",20)}<span>Lembrete no iPhone</span></button>
      ${r?`<button data-act="tomorrow">${p("right",20)}<span>Passar p/ amanh\xE3</span></button>`:""}
      <button data-act="dup">${p("copy",20)}<span>Duplicar</span></button>
      ${r?`<button data-act="del" class="is-danger">${p("trash",20)}<span>Excluir</span></button>`:""}
    </div>
    <p class="detail__meta">Criado por ${c(l.member(e.createdBy)?.name||"\u2014")}${e.updatedAt?" \xB7 atualizado "+new Date(e.updatedAt).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):""}</p>
  </div>`}function Tt(a,e){let n=a.el;n.querySelectorAll("[data-status]").forEach(t=>t.onclick=async()=>{let s=l.event(e),r=t.getBoundingClientRect();if(await l.upsert("events",{...s,status:t.dataset.status}),t.dataset.status==="feito"&&s.status!=="feito"&&l.event(e)?.status==="feito"){let d=s.date===x()?l.eventsOn(s.date,{person:l.me}).filter(i=>i.status!=="feito").length:null;w(Xe({el:r,left:d}))}});let o=(t,s)=>{let r=n.querySelector(`[data-act="${t}"]`);r&&(r.onclick=s)};o("edit",()=>dt({id:e})),o("dup",async()=>{let s={...l.event(e),id:D("e_"),status:"pendente",seriesId:null,createdAt:null,createdBy:null};await l.upsert("events",s),a.close(),w(`${de()} duplicado`),dt({id:s.id})}),o("tomorrow",async()=>{let t=l.event(e);await qt(t,{date:S(t.date,1)})&&(await l.upsert("events",{...t,date:S(t.date,1)}),w("Movido para "+U(S(t.date,1)).toLowerCase(),{action:"Desfazer",onAction:()=>l.upsert("events",{...l.event(e),date:t.date})}))}),o("ics",()=>{let t=l.event(e);tt([t],`${b[t.type].label}-${t.date}.ics`,X.appName)}),o("del",()=>ut(e,a))}async function ut(a,e){let n=l.event(a),o=[a];if(n.seriesId){let s=l.state.events.filter(r=>r.seriesId===n.seriesId&&r.date>=n.date).map(r=>r.id);if(s.length>1){let r=await F({title:`Excluir ${q()} repetido`,options:[{label:"S\xF3 este",value:"one",danger:!0},{label:`Este e os pr\xF3ximos (${s.length})`,value:"next",danger:!0}]});if(!r)return;r==="next"&&(o=s)}else if(!await R({title:`Excluir este ${q()}?`,ok:"Excluir",danger:!0}))return}else if(!await R({title:`Excluir este ${q()}?`,text:l.team.length>1?"Ele some da agenda de todos.":"Ele some da sua agenda.",ok:"Excluir",danger:!0}))return;let t=o.map(s=>({...l.event(s)}));await l.removeMany("events",o),e&&e.close(),w(o.length>1?`${o.length} ${q()}s exclu\xEDdos`:`${de()} exclu\xEDdo`,{action:"Desfazer",onAction:()=>l.upsertMany("events",t),ms:4500})}function dt({id:a=null,date:e=null,companyId:n=null,type:o=null,time:t=null,assignees:s=null}={}){let r=a?l.event(a):null;if(r&&!l.canEdit("events",r)){l._denied("events",r);return}let d=l.companiesSorted(),i=o||(z.includes("feed")?"feed":z[0]),u=r?JSON.parse(JSON.stringify(r)):{id:D("e_"),type:i,companyId:n||C.monthCompany||(d.length===1?d[0].id:null),title:"",date:e||(C.tab==="mes"?C.monthSel:C.date)||x(),time:t||b[i].best[0]||"12:00",duration:["shoot","meeting","work","other"].includes(b[i].kind)?b[i].dur:null,assignees:s||(C.person!=="all"?[C.person]:l.me?[l.me]:[]),location:"",description:"",internalNote:"",reminder:30,visibleToClient:b[i].client,status:"pendente"};if(!r&&!t&&!_()){let A=re(u,{limit:6}).map(y=>y.time).sort();if(A.length)u.time=A[0];else if(u.date===x()){let y=Math.ceil((De()+30)/30)*30;y<1440&&(u.time=ae(y))}}let $=r?JSON.parse(JSON.stringify(r)):null,v={mode:"none",until:S(u.date,28)};return M({className:"sheet--tall",html:ft(u,!!r,v),onMount:A=>Ct(A,u,$,v)})}function Ie(a,e){let n=(a.assignees||[]).includes(e.id);return a.notifyPartner===!1?n?`Sem aviso agora. Como ${e.name} \xE9 respons\xE1vel, ele ainda recebe os lembretes do hor\xE1rio.`:`${e.name} n\xE3o recebe aviso nem lembretes deste evento. Fica s\xF3 na agenda.`:`${e.name} recebe o aviso de que voc\xEA marcou e os lembretes do hor\xE1rio.`}var q=()=>_()?"evento":"compromisso",de=()=>_()?"Evento":"Compromisso",pe=()=>l.team.length<2,mt=()=>pe()?"s\xF3 voc\xEA v\xEA":`s\xF3 ${l.team.length>2?"a equipe":"voc\xEAs"} veem`,ce=a=>["shoot","meeting","work","other"].includes(b[a].kind),Q=a=>["shoot","meeting"].includes(b[a].kind);function ft(a,e,n){let o=l.companiesSorted();return`
  ${j(e?`Editar ${q()}`:`Novo ${q()}`,{left:'<button class="btn-text" data-close>Cancelar</button>',right:'<button class="btn btn--primary btn--sm" data-save>Salvar</button>'})}
  <form class="form" data-editor onsubmit="return false">
    <div class="fgroup">
      <label class="flabel">O que \xE9?</label>
      <div class="typegrid">
        ${z.map(t=>`<button type="button" class="typebtn tbadge--${t}${a.type===t?" is-on":""}"${He(t)} data-type="${t}">${p(b[t].icon,20)}<span>${b[t].label}</span></button>`).join("")}
      </div>
    </div>

    <div class="fgroup">
      <label class="flabel">${T()}${_()?"":' <em class="tag">opcional</em>'}</label>
      <div class="cogrid">
        ${o.map(t=>`<button type="button" class="cobtn${a.companyId===t.id?" is-on":""}" style="--cc:${t.color}" data-company="${t.id}">${I(t,26,7)}<span>${c(t.name)}</span></button>`).join("")}
        <button type="button" class="cobtn cobtn--add" data-newco>${p("plus",18)}<span>${J()} ${T(!1,!0)}</span></button>
      </div>
    </div>

    ${z.some(t=>b[t].kind==="post")||b[a.type].kind==="post"?`<div class="fgroup" data-when="net" ${b[a.type].kind==="post"?"":"hidden"}>
      <label class="flabel">Onde vai postar?</label>
      <div class="netgrid">${Ge.map(t=>{let s=Ke(t);return s?`<button type="button" class="netbtn${(a.platform||"instagram")===t?" is-on":""}" data-net="${t}"><span class="pf" style="width:22px;height:22px">${s.svg}</span><span>${c(s.name.replace(" (Twitter)",""))}</span></button>`:""}).join("")}</div>
    </div>`:""}

    <div class="fgroup">
      <label class="flabel" for="f-title">T\xEDtulo</label>
      <input id="f-title" class="input" name="title" value="${c(a.title)}" placeholder="${c(b[a.type].placeholder)}" autocomplete="off" maxlength="120">
    </div>

    <div class="fgroup row2">
      <div><label class="flabel" for="f-date">Dia</label><input id="f-date" class="input" type="date" name="date" value="${a.date}" required></div>
      <div><label class="flabel" for="f-time">Hor\xE1rio</label><input id="f-time" class="input" type="time" name="time" value="${a.time||""}" step="300"></div>
    </div>

    <div class="fgroup" data-when="duration" ${ce(a.type)?"":"hidden"}>
      <label class="flabel" for="f-dur">Dura\xE7\xE3o</label>
      <select id="f-dur" class="input" name="duration">
        ${Je.map(t=>`<option value="${t}"${(a.duration||b[a.type].dur)===t?" selected":""}>${ue(t)}</option>`).join("")}
      </select>
    </div>

    <div data-hint></div>

    <div class="fgroup"${pe()?" hidden":""}>
      <label class="flabel">Quem vai fazer?</label>
      <div class="whogrid">
        ${l.team.map(t=>`<button type="button" class="whobtn${(a.assignees||[]).includes(t.id)?" is-on":""}" style="--mc:${t.color}" data-who="${t.id}">${G(t.id,30)}<span>${c(t.name)}</span><i class="whobtn__check">${p("check",14)}</i></button>`).join("")}
      </div>
      <p class="fhelp">${l.team.length>2?"Marque todos que v\xE3o juntos.":"Marque os dois se forem juntos."}</p>
      ${l.team.filter(t=>t.id!==l.me).map(t=>`<label class="list__row notifyrow"><span><b>${p("bell",15)} Avisar ${t.name==="Matheus"||t.name==="Henrique"?"o ":""}${c(t.name)}</b><small data-notifyhelp>${Ie(a,t)}</small></span><input type="checkbox" class="switch" name="notifyPartner" ${a.notifyPartner!==!1?"checked":""}></label>`).join("")}
    </div>

    <div class="fgroup" data-when="location" ${Q(a.type)?"":"hidden"}>
      <label class="flabel" for="f-loc">Local</label>
      <input id="f-loc" class="input" name="location" value="${c(a.location||"")}" placeholder="Endere\xE7o ou nome do lugar" autocomplete="off">
      <button type="button" class="btn-text btn-text--sm" data-useaddr hidden>${p("pin",14)} Usar o endere\xE7o cadastrado</button>
    </div>

    <div class="fgroup">
      <label class="flabel" for="f-desc">${c(k.form.desc[0])}${k.clientLike?` <em class="tag">${p("eye",12)} cliente v\xEA</em>`:""}</label>
      <textarea id="f-desc" class="input" name="description" rows="3" placeholder="${c(k.form.desc[1])}">${c(a.description||"")}</textarea>
    </div>
    <div class="fgroup">
      <label class="flabel" for="f-note">${c(k.form.note[0])} <em class="tag tag--note">${p("eyeoff",12)} ${mt()}</em></label>
      <textarea id="f-note" class="input" name="internalNote" rows="2" placeholder="${c(k.form.note[1])}">${c(a.internalNote||"")}</textarea>
    </div>

    <div class="list">
      <label class="list__row"><span>${p("bell",18)} Lembrete</span>
        <select name="reminder">${ve.map(t=>`<option value="${t.v}"${(a.reminder??30)===t.v?" selected":""}>${t.label}</option>`).join("")}</select>
      </label>
      ${e?"":`<label class="list__row"><span>${p("repeat",18)} Repetir</span>
        <select name="repeat">${ne.map(t=>`<option value="${t.v}"${n.mode===t.v?" selected":""}>${t.label}</option>`).join("")}</select>
      </label>
      <label class="list__row" data-when="until" hidden><span>${p("calendar",18)} At\xE9</span>
        <input type="date" name="until" value="${n.until}">
      </label>`}
      <label class="list__row"${k.clientLike?"":" hidden"}><span>${p("eye",18)} Aparece no link do cliente</span>
        <input type="checkbox" class="switch" name="visibleToClient" ${a.visibleToClient!==!1?"checked":""}>
      </label>
      ${e?`<label class="list__row"><span>${p("check",18)} Status</span>
        <select name="status">${be.map(t=>`<option value="${t}"${a.status===t?" selected":""}>${fe[t].label}</option>`).join("")}</select>
      </label>`:""}
    </div>

    ${e?`<button type="button" class="btn btn--danger-soft btn--block" data-delete>${p("trash",18)} Excluir ${q()}</button>`:""}
    <div class="form__spacer"></div>
  </form>`}function Ct(a,e,n,o){let t=a.el,s=t.querySelector("[data-editor]"),r=m=>t.querySelector(m),d=()=>{let m=r("[data-hint]");m.innerHTML=It(e,!n),m.querySelectorAll("[data-settime]").forEach(f=>f.onclick=()=>{e.time=f.dataset.settime,s.time.value=e.time,d()}),m.querySelectorAll("[data-setwho]").forEach(f=>f.onclick=()=>{e.assignees=[f.dataset.setwho],t.querySelectorAll("[data-who]").forEach(g=>g.classList.toggle("is-on",e.assignees.includes(g.dataset.who))),d()})},i=()=>{t.querySelector('[data-when="duration"]').hidden=!ce(e.type);let m=t.querySelector('[data-when="net"]');m&&(m.hidden=b[e.type].kind!=="post"),t.querySelector('[data-when="location"]').hidden=!Q(e.type);let f=l.company(e.companyId),g=r("[data-useaddr]");g.hidden=!(f&&f.address&&s.location.value!==f.address);let N=t.querySelector('[data-when="until"]');N&&(N.hidden=o.mode==="none")};t.querySelectorAll("[data-type]").forEach(m=>m.onclick=()=>{let f=e.type;if(e.type=m.dataset.type,t.querySelectorAll("[data-type]").forEach(g=>g.classList.toggle("is-on",g===m)),s.title.placeholder=b[e.type].placeholder,(!n||f!==e.type)&&(e.duration=ce(e.type)?b[e.type].dur:null,s.duration.value=String(b[e.type].dur),n||(e.visibleToClient=b[e.type].client,s.visibleToClient.checked=e.visibleToClient)),Q(e.type)&&!s.location.value){let g=l.company(e.companyId);g?.address&&(s.location.value=g.address,e.location=g.address)}i(),d()}),t.querySelectorAll("[data-company]").forEach(m=>m.onclick=()=>{e.companyId=m.dataset.company,t.querySelectorAll("[data-company]").forEach(g=>g.classList.toggle("is-on",g===m));let f=l.company(e.companyId);Q(e.type)&&f?.address&&!s.location.value&&(s.location.value=f.address,e.location=f.address),i()}),r("[data-newco]").onclick=()=>{Te(null,m=>{e.companyId=m.id,$(),a.set(ft(e,!!n,o))})},t.querySelectorAll("[data-who]").forEach(m=>m.onclick=()=>{let f=m.dataset.who;e.assignees=e.assignees.includes(f)?e.assignees.filter(E=>E!==f):[...e.assignees,f],m.classList.toggle("is-on",e.assignees.includes(f)),d();let g=t.querySelector("[data-notifyhelp]"),N=l.team.find(E=>E.id!==l.me);g&&N&&(g.textContent=Ie(e,N))});let u=t.querySelector('input[name="notifyPartner"]');u&&(u.onchange=()=>{e.notifyPartner=u.checked;let m=t.querySelector("[data-notifyhelp]"),f=l.team.find(g=>g.id!==l.me);m&&f&&(m.textContent=Ie(e,f))}),r("[data-useaddr]").onclick=()=>{let m=l.company(e.companyId);s.location.value=m.address,e.location=m.address,i()},t.querySelectorAll("[data-net]").forEach(m=>m.onclick=()=>{e.platform=m.dataset.net,t.querySelectorAll("[data-net]").forEach(f=>f.classList.toggle("is-on",f===m))});let $=()=>{e.title=nt(s.title.value.trim(),e.type),b[e.type].kind==="post"&&!e.platform&&(e.platform="instagram"),b[e.type].kind!=="post"&&(e.platform=null),e.date=s.date.value,e.time=s.time.value||"",e.duration=ce(e.type)?Number(s.duration.value):null,e.location=Q(e.type)?s.location.value.trim():"",e.description=s.description.value.trim(),e.internalNote=s.internalNote.value.trim(),e.reminder=Number(s.reminder.value),e.visibleToClient=s.visibleToClient.checked,s.status&&(e.status=s.status.value),s.repeat&&(o.mode=s.repeat.value),s.until&&(o.until=s.until.value)};s.addEventListener("input",()=>{$(),i()}),s.addEventListener("change",()=>{$(),i(),d()});let v=r("[data-delete]");v&&(v.onclick=()=>ut(e.id,null).then(()=>!l.event(e.id)&&a.close())),r("[data-save]").onclick=async()=>{if($(),!h){if(!e.companyId&&_()){w("Escolha a empresa"),t.querySelector(".cogrid").scrollIntoView({behavior:"smooth",block:"center"});return}if(!e.date)return w("Escolha o dia");if(pe()&&l.me&&!e.assignees.length&&(e.assignees=[l.me]),!(!e.assignees.length&&!await R({title:"Ningu\xE9m respons\xE1vel?",text:`Este ${q()} ficar\xE1 sem respons\xE1vel. Deseja salvar assim mesmo?`,ok:"Salvar assim"}))&&!h){h=!0;try{await A()}finally{h=!1}}}};let h=!1,A=async()=>{if(n){if(["date","time","duration","type","assignees","companyId"].some(f=>JSON.stringify(e[f])!==JSON.stringify(n[f]))&&!await qe(e,!1,a,y))return;await Ot(e,n)}else if(o.mode!=="none"){let m=Lt(e.date,o),f=m.filter(E=>K({...e,date:E},{isNew:!0}).some(O=>O.level==="block")),g=m;if(f.length){let E=await F({title:`${f.length} de ${m.length} datas j\xE1 t\xEAm compromisso nesse hor\xE1rio`,text:f.slice(0,6).map(O=>B(O)).join(" \xB7 ")+(f.length>6?" \u2026":""),options:[{label:`Criar s\xF3 nas ${m.length-f.length} datas livres`,value:"free",primary:!0},{label:"Criar em todas mesmo assim",value:"all"}]});if(!E)return;if(E==="free"&&(g=m.filter(O=>!f.includes(O))),!g.length)return w("Nenhuma data livre")}let N=D("s_");await l.upsertMany("events",g.map((E,O)=>({...e,id:O===0?e.id:D("e_"),date:E,seriesId:N})),{activity:{notifyPartner:e.notifyPartner,kind:"series",count:g.length,label:`${b[e.type].label} ${ne.find(E=>E.v===o.mode)?.label.toLowerCase()||""} \xE0s ${P(e.time)}`,sample:{companyId:e.companyId,date:g[0]}}}),a.close(),_e({title:`${g.length} ${q()}s marcados`,sub:`${ne.find(E=>E.v===o.mode)?.label||""}${e.time?" \xB7 "+P(e.time):""}`.replace(/^ · /,"")});return}else{if(!await qe(e,!0,a,y))return;await l.upsert("events",{...e}),a.close(),_e({title:`${de()} marcado`,sub:`${B(e.date)}${e.time?" \xB7 "+P(e.time):""}`});return}a.close()};function y(){s.time.value=e.time||"",s.date.value=e.date,t.querySelectorAll("[data-who]").forEach(m=>m.classList.toggle("is-on",e.assignees.includes(m.dataset.who))),i(),d()}i(),d()}var Ae=420,pt=1380,L=a=>(Math.min(Math.max(a,Ae),pt)-Ae)/(pt-Ae)*100;function At(a,e){let n=a.time?ye(a):null,o=[8,10,12,14,16,18,20,22];return`<div class="lanes">
    <div class="lanes__head"><strong>${l.team.length>1?`Agenda ${l.team.length===2?"dos dois":"de todos"}`:"Sua agenda"} em ${c(B(a.date))}</strong></div>
    ${l.team.map(t=>{let s=l.eventsOn(a.date,{person:t.id}).filter(i=>i.id!==a.id&&i.time),r=(a.assignees||[]).includes(t.id),d=e.some(i=>i.level==="block"&&i.person===t.id);return`<div class="lane">
        <span class="lane__who">${G(t.id,22)}</span>
        <div class="lane__track">
          ${o.map(i=>`<i class="lane__tick" style="left:${L(i*60)}%"></i>`).join("")}
          ${s.map(i=>{let u=ye(i),$=l.company(i.companyId);return`<span class="lane__ev" style="left:${L(u[0])}%;width:max(4px,${L(u[1])-L(u[0])}%);background:${$?.color||"#888"}" title="${c(Ze(i))}"></span>`}).join("")}
          ${n&&r?`<span class="lane__draft${d?" is-clash":""}" style="left:${L(n[0])}%;width:max(6px,${L(n[1])-L(n[0])}%)"></span>`:""}
        </div>
      </div>`}).join("")}
    <div class="lane lane--axis"><span class="lane__who"></span><div class="lane__track">${o.map(t=>`<small style="left:${L(t*60)}%">${t}h</small>`).join("")}</div></div>
  </div>`}function It(a,e){if(!a.date)return"";let n=K(a,{isNew:e}),o=n.filter(h=>h.level==="block"),t=n.filter(h=>h.level==="warn"),s=n.filter(h=>h.level==="info"),r=re(a,{limit:4}),d=ke(a),i=(a.assignees||[]).length===1?a.assignees[0]:null,u=o.length&&i?l.team.find(h=>h.id!==i&&d.includes(h.id)):null,$=b[a.type],v=h=>`<li class="issue issue--${h.level}">${p(h.level==="block"?"alert":h.level==="warn"?"flag":h.code==="partner"?"user":"bulb",15)}<div><strong>${c(h.title)}</strong><p>${c(h.text)}</p></div></li>`;return`
  <section class="assist">
    <header class="assist__head">${p("sparkle",16)} Assistente</header>
    ${At(a,n)}
    ${n.length?`<ul class="issues">${[...o,...t,...s].map(v).join("")}</ul>`:a.time?`<p class="assist__ok">${p("check",15)} Hor\xE1rio livre para ${c(le(a.assignees))}, sem conflitos.</p>`:""}
    ${u?`<button type="button" class="tchip tchip--wide" data-setwho="${u.id}">${G(u.id,18)} Passar para ${c(u.name)} (est\xE1 livre)</button>`:""}
    <div class="assist__sugg">
      <p>${c($.tip)}</p>
      ${r.length?`<div class="hintbox__times">${r.map(h=>`<button type="button" class="tchip${a.time===h.time?" is-on":""}" data-settime="${h.time}">${P(h.time)}${h.peak?"<small>pico</small>":"<small>livre</small>"}</button>`).join("")}</div>`:`<p class="muted">Nenhum hor\xE1rio livre nesse dia${(a.assignees||[]).length?" para "+c(le(a.assignees)):""}. Tente outro dia${l.team.length>1?" ou outra pessoa":""}.</p>`}
    </div>
  </section>`}async function qe(a,e,n,o){let s=K(a,{isNew:e}).filter(v=>v.level==="block");if(!s.length)return!0;let r=re(a,{limit:2}),d=(a.assignees||[]).length===1?a.assignees[0]:null,i=d&&l.team.find(v=>v.id!==d&&ke(a).includes(v.id)),u=[...r.map(v=>({label:`Mudar para ${P(v.time)} (livre)`,value:"time:"+v.time,primary:!0})),...i?[{label:`Passar para ${i.name} (est\xE1 livre)`,value:"who:"+i.id,primary:!r.length}]:[],{label:"Marcar mesmo assim",value:"force"}],$=await F({title:s[0].code==="duplicate"?"Isso j\xE1 est\xE1 na agenda":"J\xE1 tem compromisso nesse hor\xE1rio",bodyHtml:`<ul class="issues issues--dialog">${s.map(v=>`<li class="issue issue--block">${p("alert",15)}<div><strong>${c(v.title)}</strong><p>${c(v.text)}</p></div></li>`).join("")}</ul>`,options:u});return $?$==="force"?!0:($.startsWith("time:")&&(a.time=$.slice(5)),$.startsWith("who:")&&(a.assignees=[$.slice(4)]),o(),qe(a,e,n,o)):!1}async function qt(a,e){let n={...a,...e},o=K(n).filter(s=>s.level==="block");return o.length?await F({title:"J\xE1 tem compromisso nesse hor\xE1rio",bodyHtml:`<ul class="issues issues--dialog">${o.map(s=>`<li class="issue issue--block">${p("alert",15)}<div><strong>${c(s.title)}</strong><p>${c(s.text)}</p></div></li>`).join("")}</ul>`,options:[{label:"Mover mesmo assim",value:"force",primary:!0}]})==="force":!0}function Lt(a,e){let n=[],o=a,t=e.until&&e.until>=a?e.until:S(a,28);for(;o<=t&&n.length<150;){let s=Z(o).getDay();(e.mode==="daily"||e.mode==="weekdays"&&s>=1&&s<=5||e.mode==="weekly"&&Z(o).getDay()===Z(a).getDay())&&n.push(o),o=S(o,1)}return n}var Nt=["type","companyId","title","time","duration","assignees","location","description","internalNote","reminder","visibleToClient"];async function Ot(a,e){let n=Nt.filter(o=>JSON.stringify(a[o])!==JSON.stringify(e[o]));if(a.seriesId&&n.length){let o=l.state.events.filter(t=>t.seriesId===a.seriesId&&t.date>e.date);if(o.length){let t=await F({title:`${de()} repetido`,text:"Aplicar as altera\xE7\xF5es a quais eventos?",options:[{label:"S\xF3 a este",value:"one",primary:!0},{label:`A este e aos pr\xF3ximos (${o.length+1})`,value:"next"}]});if(!t)return;if(t==="next"){let s=Object.fromEntries(n.map(r=>[r,a[r]]));await l.upsertMany("events",[{...a},...o.map(r=>({...r,...s}))],{activity:{kind:"series-edit",count:o.length+1,label:`${b[a.type].label} \xB7 a partir de ${a.date.slice(8)}/${a.date.slice(5,7)}`,sample:{companyId:a.companyId,date:a.date}}}),w("S\xE9rie atualizada");return}}}await l.upsert("events",{...a}),w("Altera\xE7\xF5es salvas")}export{sa as a,oa as b,nt as c,_e as d,C as e,Bt as f,tt as g,Ma as h,dt as i,qt as j,va as k,ha as l,Te as m};
