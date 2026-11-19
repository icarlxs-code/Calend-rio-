import{b as me,c as Ue,d as z,e as fe,f as be}from"./c-TYQH25BT.js";import{a as ae,g as ue}from"./c-DPI7YGL5.js";import{a as je,b as Re,c as Me,d as H,f as te,h as T,i as Pe,j as Be,k as de,l as pe,m as L,o as O,p as $,q as j,r as M}from"./c-E7AVQA72.js";import{a as ne,b as Ce,d as Ae,e as qe,f as l}from"./c-6ROM2BX7.js";import{a as p}from"./c-CWX5SWSY.js";import{B as c,D as U,G as Te,c as K,d as E,e as k,f as Se,g as W,i as Ee,j as Y,k as xe,m as Q,r as Ie,t as Ne,u as P,v as B,w as oe,z as D}from"./c-YEARXB46.js";import{a as G}from"./c-UCBOIM2G.js";import{f as h,g as X,h as I,j as De,k as N,m as _,n as Le,o as Z,p as le,q as ie,s as ee,t as Oe,u as re,v as ce}from"./c-35N3UWZE.js";var V=(()=>{try{return JSON.parse(localStorage.getItem("pauta.ui")||"{}")}catch{return{}}})(),x={tab:V.tab==="pessoal"?"hoje":V.tab||"hoje",space:V.space==="personal"?"personal":"work",ptab:V.ptab||"p-hoje",pMonth:null,pSel:null,pView:"mes",person:V.person||"all",date:E(),month:W(E()),monthSel:E(),monthCompany:null,showAllTips:!1};function kt(){try{localStorage.setItem("pauta.ui",JSON.stringify({tab:x.tab,person:x.person,space:x.space,ptab:x.ptab}))}catch{}}var at={feed:"\u{1F5BC}\uFE0F",carrossel:"\u{1F5C2}\uFE0F",reels:"\u{1F3AC}",story:"\u2B55",captacao:"\u{1F4F8}",reuniao:"\u{1F91D}",producao:"\u2702\uFE0F",outro:"\u2022"},J=t=>String(t||"").replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\r?\n/g,"\\n"),st=t=>{let e=[];for(;t.length>74;)e.push(t.slice(0,74)),t=" "+t.slice(74);return e.push(t),e.join(`\r
`)},He=(t,e)=>t.replace(/-/g,"")+"T"+e.replace(":","")+"00",ot=()=>new Date().toISOString().replace(/[-:]/g,"").replace(/\.\d+/,"");function nt(t,e){let o=["BEGIN:VCALENDAR","VERSION:2.0",`PRODID:-//${G.appName}//PT-BR`,"CALSCALE:GREGORIAN","METHOD:PUBLISH",`X-WR-CALNAME:${J(e)}`];return t.forEach(n=>{let a=l.company(n.companyId),s=(n.assignees||[]).map(m=>l.member(m)?.name).filter(Boolean).join(" e "),r=`${at[n.type]||""} ${h[n.type]?.label||"Evento"} \xB7 ${a?.name||""}${n.title?" \u2014 "+n.title:""}`.trim(),d=[s&&`Respons\xE1vel: ${s}`,n.description,n.internalNote&&`Nota interna: ${n.internalNote}`].filter(Boolean).join(`
`);if(o.push("BEGIN:VEVENT",`UID:${n.id}@pauta`,`DTSTAMP:${ot()}`),n.time){let m=Y(n.time)+Z(n),g=m>=1440?k(n.date,1):n.date;o.push(`DTSTART:${He(n.date,n.time)}`,`DTEND:${He(g,xe(m%1440))}`)}else o.push(`DTSTART;VALUE=DATE:${n.date.replace(/-/g,"")}`,`DTEND;VALUE=DATE:${k(n.date,1).replace(/-/g,"")}`);o.push(`SUMMARY:${J(r)}`),d&&o.push(`DESCRIPTION:${J(d)}`),n.location&&o.push(`LOCATION:${J(n.location)}`);let i=n.reminder??30;i>=0&&o.push("BEGIN:VALARM","ACTION:DISPLAY",`DESCRIPTION:${J(r)}`,`TRIGGER:-PT${i}M`,"END:VALARM"),o.push("END:VEVENT")}),o.push("END:VCALENDAR"),o.map(st).join(`\r
`)}async function ze(t,e,o){let n=nt(t,o),a=ae();if(a){let i=document.createElement("form");i.method="POST",i.action=a.replace(/\/$/,"")+"/ics",i.target="_blank",i.style.display="none";let m=document.createElement("textarea");m.name="ics",m.value=n,i.appendChild(m),document.body.appendChild(i),i.submit(),i.remove();return}let s=new File([n],e,{type:"text/calendar"});if(navigator.canShare&&navigator.canShare({files:[s]}))try{await navigator.share({files:[s],title:o});return}catch(i){if(i&&i.name==="AbortError")return}let r=URL.createObjectURL(s),d=document.createElement("a");d.href=r,d.download=e,document.body.appendChild(d),d.click(),d.remove(),setTimeout(()=>URL.revokeObjectURL(r),4e3)}var Ve=new Set(["fazer","criar","postar","subir","publicar","gravar","post","postagem","publicacao","publica\xE7\xE3o","o","a","um","uma","no","na","do","da","de","dos","das","pro","pra","para","feed","reels","reel","story","stories","storie","storys","carrossel","carosel","carossel","instagram","insta","ig","sobre","com","e"]),lt=[[/\bcouve flor\b/gi,"couve-flor"],[/\bpromocao\b/gi,"promo\xE7\xE3o"],[/\bpromoçao\b/gi,"promo\xE7\xE3o"],[/\bacao\b/gi,"a\xE7\xE3o"],[/\bpao\b/gi,"p\xE3o"],[/\blimao\b/gi,"lim\xE3o"],[/\bmamao\b/gi,"mam\xE3o"],[/\bmelao\b/gi,"mel\xE3o"],[/\bfeijao\b/gi,"feij\xE3o"],[/\bmaca\b/gi,"ma\xE7\xE3"],[/\bmaça\b/gi,"ma\xE7\xE3"],[/\babobora\b/gi,"ab\xF3bora"],[/\bpessego\b/gi,"p\xEAssego"],[/\bmaracuja\b/gi,"maracuj\xE1"],[/\babacate\b/gi,"abacate"],[/\babacaxi\b/gi,"abacaxi"],[/\bcafe\b/gi,"caf\xE9"],[/\bpromo\b/gi,"promo"],[/\bblack friday\b/gi,"Black Friday"],[/\bnatal\b/gi,"Natal"],[/\bano novo\b/gi,"Ano Novo"],[/\bdia das maes\b/gi,"Dia das M\xE3es"],[/\bdia dos pais\b/gi,"Dia dos Pais"],[/\bhamburguer\b/gi,"hamb\xFArguer"],[/\bhamburguers\b/gi,"hamb\xFArgueres"],[/\blancamento\b/gi,"lan\xE7amento"],[/\bcolecao\b/gi,"cole\xE7\xE3o"],[/\bvideo\b/gi,"v\xEDdeo"],[/\bsabado\b/gi,"s\xE1bado"],[/\bpromocoes\b/gi,"promo\xE7\xF5es"]],Je=t=>t.toLowerCase().replace(/[.,:;!]+$/,""),it={feed:"Post no feed",carrossel:"Carrossel",reels:"Reels",story:"Stories"},Fe=/^(post no feed|carrossel|reels|stories|story)\s+—\s+/i;function Ge(t,e=null){let o=String(t||"").replace(/\s+/g," ").trim();if(!o)return o;let n=it[e];if(!n)return he(ve(o));if(Fe.test(o))return`${n} \u2014 ${he(ve(o.replace(Fe,"")))}`;let a=o.split(" ");for(;a.length>1&&Ve.has(Je(a[0]));)a.shift();return o=a.join(" ").replace(/\s+(no|pro|pra|para o)\s+(instagram|insta|ig|feed)\s*$/i,"").trim(),Ve.has(Je(o))?n:`${n} \u2014 ${he(ve(o))}`}var ve=t=>{for(let[e,o]of lt)t=t.replace(e,o);return t},he=t=>t&&t.charAt(0).toLocaleUpperCase("pt-BR")+t.slice(1);var rt=[[/pura vida|hortifruti|jg garcia/i,"hortifruti: frutas, verduras e legumes frescos"],[/bbq|burger|hamb/i,"hamburgueria e churrasco (BBQ)"],[/multimarcas|moda|roupa/i,"loja de roupas multimarcas"],[/festa/i,"loja de artigos e decora\xE7\xE3o de festas"]];function ge(t){if(t?.niche)return t.niche;let e=rt.find(([o])=>o.test(t?.name||""));return e?e[1]:""}function ct(){let t=E();return l.state.companies.map(e=>{let o=l.state.events.filter(r=>r.companyId===e.id&&h[r.type]?.kind==="post"),n=o.filter(r=>r.date<=t&&(r.status==="feito"||r.date<t)).map(r=>r.date).sort(),a=o.filter(r=>r.date>=t&&r.status!=="feito").map(r=>r.date).sort(),s=n[n.length-1]||"";return{onlyFor:e.notifyOnly||null,name:e.name,niche:ge(e)||"pequena empresa local",lastPost:s,nextPost:a[0]||"",daysSincePost:s?Ee(s,t):null}})}function dt(){let t=E(),e=new Date,o=e.getHours()*60+e.getMinutes(),n=l.state.events.filter(s=>s.status!=="feito"&&s.date>=t).sort((s,r)=>(s.date+(s.time||"")).localeCompare(r.date+(r.time||""))),a=l.state.events.filter(s=>s.status!=="feito"&&s.time&&(s.date<t||s.date===t&&Y(s.time)<o)).length;return{arch:I.arch,profession:I.profession||"",entity:I.entity.many,tips:N()?[]:(I.tips||[]).slice(0,12),next:n.slice(0,5).map(s=>({date:s.date,time:s.time||"",label:h[s.type]?.label||"Compromisso",title:(s.title||"").slice(0,60),who:(s.assignees||[])[0]||""})),late:a}}var Ke=null,We="";function jt(){l.mode!=="cloud"||!ae()||!l.ready||(clearTimeout(Ke),Ke=setTimeout(()=>{let t=ct(),e=dt(),o=JSON.stringify([t,e]);o!==We&&ue("/coach",{companies:t,work:e}).then(()=>We=o).catch(()=>{})},4e3))}var Rt=()=>ue("/coach-test",{});function Kt(){let t=l.companiesSorted(),e=E(),o=Se(e),n=k(o,6);return`
  <header class="hdr">
    <div class="hdr__row">
      <div class="hdr__titles"><p class="hdr__eyebrow">${t.length} ${t.length===1?_(!1,!0):_(!0,!0)}</p><h1>${_(!0)}</h1></div>
      <div class="hdr__actions"><button class="btn btn--primary btn--sm" data-action="new-company">${p("plus",16)} Nova</button></div>
    </div>
  </header>
  <div class="page">
    ${t.length?"":pe(`Nenhum(a) ${_(!1,!0)} ainda`,`Cadastre ${I.entity.hint} com nome, cor e foto. Assim cada compromisso fica organizado no lugar certo.`,`<button class="btn btn--primary" data-action="new-company">${p("plus",18)} Cadastrar ${_(!1,!0)}</button>`)}
    <div class="colist">
      ${t.map(a=>{let s=l.eventsBetween(o,n,{companyId:a.id}),r=s.filter(m=>Le(m.type)).length,d=s.filter(m=>m.type==="captacao").length,i=l.state.events.filter(m=>m.companyId===a.id&&m.date>=e&&m.status!=="feito").sort((m,g)=>(m.date+m.time).localeCompare(g.date+g.time))[0];return`<button class="cocard" style="--cc:${a.color};--cc-soft:${U(a.color,.1)}" data-action="open-company" data-id="${a.id}">
          <div class="cocard__top">
            ${T(a,48)}
            <div class="cocard__name"><strong>${c(a.name)}</strong>${a.instagram?`<small>${p("insta",12)} @${c(a.instagram)}</small>`:""}</div>
            ${p("right",18,"muted")}
          </div>
          <div class="cocard__stats">
            ${N()?`<span><b>${r}</b> posts</span><span><b>${d}</b> capta\xE7${d===1?"\xE3o":"\xF5es"}</span>`:`<span><b>${s.length}</b> compromisso${s.length===1?"":"s"}</span>`}<span class="muted">nesta semana</span>
          </div>
          ${i?`<div class="cocard__next">${p(h[i.type].icon,14)} <b>${c(P(i.date))}${i.time?" "+i.time:""}</b> \xB7 ${c(h[i.type].label)} \u2014 ${c(i.title||"")}</div>`:'<div class="cocard__next muted">Nada agendado</div>'}
        </button>`}).join("")}
    </div>
  </div>`}function Wt(t){let e=L({className:"sheet--tall",html:Ye(t),onMount:o=>pt(o,t)});e.refresh=()=>l.company(t)?e.set(Ye(t)):e.close()}function Ye(t){let e=l.company(t);if(!e)return"";let o=E(),n=W(o),a=l.eventsBetween(`${n}-01`,`${n}-31`,{companyId:t}),s=l.eventsBetween(o,k(o,30),{companyId:t}),r=l.eventsBetween(k(o,-14),k(o,-1),{companyId:t}).reverse(),d=b=>a.filter(v=>b.includes(v.type)).length,i=a.filter(b=>b.status==="feito").length,m="",g=s.map(b=>{let v=b.date!==m?`<h4 class="dayhead">${c(B(b.date))}</h4>`:"";return m=b.date,v+de(b)}).join("");return`
  ${O("",{right:l.canEdit("companies",e)?'<button class="btn-text" data-act="edit">Editar</button>':""})}
  <div class="cohero" style="--cc:${e.color};--cc-soft:${U(e.color,.14)}">
    ${T(e,72,20)}
    <h2>${c(e.name)}</h2>
    ${e.instagram?`<a class="cohero__ig" href="https://instagram.com/${encodeURIComponent(e.instagram)}" target="_blank" rel="noopener">${p("insta",14)} @${c(e.instagram)}</a>`:""}
    <div class="cohero__btns">
      <button class="btn btn--primary btn--sm" data-act="new">${p("plus",16)} Evento</button>
      ${I.clientLike?`<button class="btn btn--soft btn--sm" data-act="clientview">${p("eye",16)} P\xE1gina do cliente</button>`:""}
      <button class="btn btn--soft btn--sm" data-act="share">${p("share",16)} Enviar</button>
    </div>
  </div>

  <div class="page page--sheet">
    <section class="block">
      <h2 class="block__title">${c(Ne(n))}</h2>
      <div class="mstats mstats--5">
        <div><b>${d(["feed","carrossel"])}</b><span>feed</span></div>
        <div><b>${d(["reels"])}</b><span>reels</span></div>
        <div><b>${d(["story"])}</b><span>stories</span></div>
        <div><b>${d(["captacao"])}</b><span>capta\xE7\xF5es</span></div>
        <div><b>${a.length?Math.round(i/a.length*100):0}%</b><span>feito</span></div>
      </div>
    </section>

    ${e.address||e.contact||e.notes?`<ul class="rows">
      ${e.address?`<li><span class="rows__k">${p("pin",16)} Endere\xE7o</span><a class="rows__v link" href="https://maps.apple.com/?q=${encodeURIComponent(e.address)}" target="_blank" rel="noopener">${c(e.address)}</a></li>`:""}
      ${e.contact?`<li><span class="rows__k">${p("user",16)} Contato</span><span class="rows__v">${c(e.contact)}</span></li>`:""}
      ${e.notes?`<li><span class="rows__k">${p("note",16)} Observa\xE7\xF5es</span><span class="rows__v">${c(e.notes)}</span></li>`:""}
    </ul>`:""}

    <section class="block">
      <h2 class="block__title">Pr\xF3ximos 30 dias</h2>
      ${g||pe("Nada agendado","Toque em + para marcar o primeiro compromisso aqui.")}
    </section>

    ${r.length?`<section class="block">
      <h2 class="block__title">\xDAltimas 2 semanas</h2>
      ${r.map(b=>de(b,{showDate:!0,compact:!0})).join("")}
    </section>`:""}
  </div>`}function pt(t,e){let o=t.el;(o.querySelector('[data-act="edit"]')||{}).onclick=()=>ye(e),o.querySelector('[data-act="new"]').onclick=async()=>{let{openEventEditor:n}=await import("./c-VUASVVW7.js");n({companyId:e})},o.querySelector('[data-act="share"]').onclick=()=>$e(e),o.querySelector('[data-act="clientview"]').onclick=()=>ut(e)}function ye(t=null,e=null){let o=t?l.company(t):null,n=l.state.companies.map(d=>d.color),a=o?{...o}:{id:D("c_"),name:"",color:ee.find(d=>!n.includes(d))||ee[0],logo:null,instagram:"",address:"",contact:"",notes:"",shareToken:null},s=()=>`
    ${O(o?`Editar ${_(!1,!0)}`:`Novo(a) ${_(!1,!0)}`,{left:'<button class="btn-text" data-close>Cancelar</button>',right:'<button class="btn btn--primary btn--sm" data-save>Salvar</button>'})}
    <form class="form" onsubmit="return false">
      <div class="logopick">
        <div data-preview>${T({...a,name:a.name||"?"},88,24)}</div>
        <div class="logopick__btns">
          <label class="btn btn--soft btn--sm">${p("image",16)} ${a.logo?"Trocar logo":"Enviar logomarca"}<input type="file" accept="image/*" data-file hidden></label>
          ${a.logo?'<button type="button" class="btn-text btn-text--sm" data-rmlogo>Remover logo</button>':'<p class="fhelp">Opcional. Sem logo, usamos as iniciais na cor escolhida.</p>'}
        </div>
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-name">Nome (${c(I.entity.hint)})</label>
        <input id="c-name" class="input" name="name" value="${c(a.name)}" placeholder="Ex.: Pura Vida" autocomplete="off" maxlength="60">
      </div>
      <div class="fgroup">
        <label class="flabel">Cor no calend\xE1rio</label>
        <div class="palette">
          ${ee.map(d=>`<button type="button" class="swatch${a.color===d?" is-on":""}" style="background:${d}" data-color="${d}" aria-label="Cor ${d}">${p("check",16)}</button>`).join("")}
          <label class="swatch swatch--custom" title="Outra cor"><input type="color" value="${a.color}" data-customcolor>${p("plus",16)}</label>
        </div>
      </div>
      <div class="fgroup"${N()?"":" hidden"}>
        <label class="flabel" for="c-ig">Instagram</label>
        <div class="input-prefix"><span>@</span><input id="c-ig" class="input" name="instagram" value="${c(a.instagram||"")}" placeholder="usuario" autocomplete="off" autocapitalize="none"></div>
      </div>
      <div class="fgroup">
        <label class="flabel">Notifica\xE7\xF5es daqui v\xE3o para</label>
        <div class="seg seg--notify">${[["","Os dois"],...l.team.map(d=>[d.id,d.name])].map(([d,i])=>`<button type="button" class="seg__btn${(a.notifyOnly||"")===d?" is-on":""}" data-only="${d}">${c(i)}</button>`).join("")}</div>
        <p class="fhelp">Avisos, lembretes, \u201CJ\xE1 postou?\u201D, cobran\xE7as de atraso e dicas desta empresa chegam s\xF3 para quem estiver marcado.</p>
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-niche">${N()?"O que a empresa faz (para as dicas)":"Observa\xE7\xE3o (para as dicas)"}</label>
        <input id="c-niche" class="input" name="niche" value="${c(a.niche||ge(a))}" placeholder="Ex.: hamburgueria artesanal, loja de roupas femininas" autocomplete="off" maxlength="160">
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-addr">Endere\xE7o</label>
        <input id="c-addr" class="input" name="address" value="${c(a.address||"")}" placeholder="Rua, n\xFAmero \u2013 bairro" autocomplete="off">
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-contact">Contato</label>
        <input id="c-contact" class="input" name="contact" value="${c(a.contact||"")}" placeholder="Nome e WhatsApp do respons\xE1vel" autocomplete="off">
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-notes">Observa\xE7\xF5es internas</label>
        <textarea id="c-notes" class="input" name="notes" rows="3" placeholder="Tom de voz, o que evitar, prefer\xEAncias\u2026">${c(a.notes||"")}</textarea>
      </div>
      ${o?`<button type="button" class="btn btn--danger-soft btn--block" data-delete>${p("trash",18)} Excluir ${_(!1,!0)}</button>`:""}
      <div class="form__spacer"></div>
    </form>`,r=d=>{let i=d.el,m=i.querySelector("form"),g=()=>{a.name=m.name.value.trim(),a.instagram=m.instagram.value.trim().replace(/^@/,""),a.niche=m.niche.value.trim(),a.notifyOnly=i.querySelector("[data-only].is-on")?.dataset.only||null,a.address=m.address.value.trim(),a.contact=m.contact.value.trim(),a.notes=m.notes.value.trim()},b=()=>i.querySelector("[data-preview]").innerHTML=T({...a,name:m.name.value||"?"},88,24);m.name.addEventListener("input",b),i.querySelectorAll("[data-only]").forEach(w=>w.onclick=()=>i.querySelectorAll("[data-only]").forEach(u=>u.classList.toggle("is-on",u===w))),i.querySelectorAll("[data-color]").forEach(w=>w.onclick=()=>{a.color=w.dataset.color,i.querySelectorAll("[data-color]").forEach(u=>u.classList.toggle("is-on",u===w)),b()}),i.querySelector("[data-customcolor]").oninput=w=>{a.color=w.target.value,i.querySelectorAll("[data-color]").forEach(u=>u.classList.remove("is-on")),b()},i.querySelector("[data-file]").onchange=async w=>{let u=w.target.files[0];if(u)try{g(),a.logo=await Te(u,160),d.set(s())}catch{$("N\xE3o foi poss\xEDvel ler essa imagem")}};let v=i.querySelector("[data-rmlogo]");v&&(v.onclick=()=>{g(),a.logo=null,d.set(s())});let R=i.querySelector("[data-delete]");R&&(R.onclick=async()=>{let w=l.state.events.filter(f=>f.companyId===a.id);await j({title:`Excluir ${a.name}?`,text:w.length?`Os ${w.length} compromissos daqui tamb\xE9m ser\xE3o apagados e o link do cliente deixar\xE1 de funcionar.`:"O link do cliente deixar\xE1 de funcionar.",ok:"Excluir",danger:!0})&&(await l.removeMany("events",w.map(f=>f.id)),await l.remove("companies",a.id),d.close(),$("Exclu\xEDdo"))}),i.querySelector("[data-save]").onclick=async()=>{if(g(),!a.name)return m.name.focus(),$("Digite o nome");await l.upsert("companies",{...a}),d.close(),$(o?"Atualizado":"Cadastrado"),e&&e(l.company(a.id))}};L({className:"sheet--tall",html:s(),onMount:r})}async function $e(t){let e=l.company(t),o=l.mode==="cloud",n="";o?(await l.ensureShareToken(e),await l.publishCompany(t),n=Ae(l.company(t).shareToken)):n=qe(await Ce(ne(e,l.state.events,{maxFuture:90})));let a=`
    ${O("Link do cliente")}
    <div class="share">
      <div class="share__co">${T(e,56)}<div><strong>${c(e.name)}</strong><small>v\xEA somente o pr\xF3prio cronograma</small></div></div>
      <ul class="checks">
        <li>${p("check",16)} Somente os eventos da ${c(e.name)}</li>
        <li>${p("check",16)} Sem notas internas e sem outras empresas</li>
        <li>${p("check",16)} Somente leitura: o cliente n\xE3o consegue alterar nada</li>
        <li>${p(o?"check":"alert",16)} ${o?"Sempre atualizado: tudo que voc\xEAs mudarem aparece para o cliente":"Foto do cronograma atual (pr\xF3ximos 90 dias). Quando mudar algo, envie o link de novo"}</li>
      </ul>
      <div class="share__link"><input readonly value="${c(n)}" data-link></div>
      <div class="share__btns">
        <button class="btn btn--primary btn--block" data-sharebtn>${p("share",18)} Enviar para o cliente</button>
        <button class="btn btn--soft btn--block" data-copy>${p("copy",18)} Copiar link</button>
        <a class="btn btn--ghost btn--block" href="${c(n)}" target="_blank" rel="noopener">${p("eye",18)} Ver como o cliente v\xEA</a>
      </div>
      ${o?'<button class="btn-text btn-text--sm btn-text--danger" data-revoke>Gerar novo link (o antigo para de funcionar)</button>':'<p class="fhelp">Dica: ative a sincroniza\xE7\xE3o na nuvem (Ajustes) para o link ficar sempre atualizado automaticamente.</p>'}
    </div>`;L({html:a,onMount:s=>{let r=s.el;r.querySelector("[data-copy]").onclick=async()=>{try{await navigator.clipboard.writeText(n),$("Link copiado")}catch{r.querySelector("[data-link]").select(),$("Selecione e copie o link")}},r.querySelector("[data-sharebtn]").onclick=async()=>{let i=`Ol\xE1! Este \xE9 o cronograma de conte\xFAdo da ${e.name}. Por aqui voc\xEAs acompanham tudo o que est\xE1 planejado: posts, stories, reels e capta\xE7\xF5es.`;if(navigator.share)try{await navigator.share({title:`Cronograma \xB7 ${e.name}`,text:i,url:n})}catch{}else await navigator.clipboard?.writeText(`${i}
${n}`),$("Mensagem copiada")};let d=r.querySelector("[data-revoke]");d&&(d.onclick=async()=>{await j({title:"Gerar um novo link?",text:"Quem tiver o link antigo n\xE3o conseguir\xE1 mais ver o cronograma.",ok:"Gerar novo link",danger:!0})&&(await l.regenerateShareToken(l.company(t)),s.close(),$e(t))})}})}async function ut(t){let e=l.company(t);if(!e)return;let{showClient:o}=await import("./c-X5YAXWNJ.js"),{sanitizePayload:n}=await import("./c-OHC7RKLG.js"),a=n(ne(e,l.state.events)),s=document.createElement("div");s.className="client-preview",s.innerHTML=`<div class="client-preview__bar"><button class="btn btn--soft btn--sm" data-closepv>${p("left",16)} Voltar</button><span>Assim o cliente v\xEA</span><button class="btn btn--primary btn--sm" data-sendpv>${p("share",16)} Enviar</button></div><div class="client-preview__body"></div>`,document.body.appendChild(s),document.body.classList.add("has-sheet"),o(s.querySelector(".client-preview__body"),a,{canGoBack:!1,preview:!0});let r=()=>{s.remove(),document.body.classList.toggle("has-sheet",!!document.querySelector(".sheet-wrap"))};s.querySelector("[data-closepv]").onclick=r,s.querySelector("[data-sendpv]").onclick=()=>{r(),$e(t)}}function ma(t){let e=L({html:Qe(t),className:"sheet--tall",onMount:o=>mt(o,t)});e.refresh=()=>{if(!l.event(t))return e.close();e.set(Qe(t))}}function Qe(t){let e=l.event(t);if(!e)return"";let o=l.company(e.companyId),n=o?.color||"#666",a=re.find(i=>i.v===(e.reminder??30)),s=e.seriesId?l.state.events.filter(i=>i.seriesId===e.seriesId).length:0,r=l.canEdit("events",e),d=l.member(l.ownerOf("events",e))?.name||"o parceiro";return`
  ${O("",{right:r?'<button class="btn-text" data-act="edit">Editar</button>':""})}
  <div class="detail">
    <div class="detail__hero" style="--cc:${n};--cc-soft:${U(n,.12)}">
      <div class="detail__co">${T(o,40)}<div><strong>${c(o?.name||"Sem "+_(!1,!0))}</strong>${o?.instagram?`<small>@${c(o.instagram)}</small>`:""}</div>${Pe(e.type,{solid:!0})}</div>
      <h2><span class="pfrow">${Me(e,24)}</span>${c(e.title||h[e.type].label)}</h2>
      <p class="detail__when">${p("calendar",15)} ${c(P(e.date))}, ${c(Ie(e.date).split(", ")[1])} \xB7 ${p("clock",15)} ${c(Be(e))}</p>
    </div>

    ${r?"":`<p class="detail__lock">${p("eye",14)} Cadastrado por ${c(d)} \u2014 voc\xEA s\xF3 pode ver. Use \u201CDuplicar\u201D para criar uma c\xF3pia sua.</p>`}
    <div class="seg seg--status"${r?"":" hidden"}>
      ${ie.map(i=>`<button class="seg__btn${e.status===i?" is-on":""} st-${i}" data-status="${i}">${i==="feito"?p("check",14):""}${le[i].label}</button>`).join("")}
    </div>

    <ul class="rows">
      <li><span class="rows__k">${p("users",16)} Respons\xE1vel</span><span class="rows__v">${(e.assignees||[]).map(i=>H(i,22)).join("")} ${c(te(e.assignees))}</span></li>
      ${e.location?`<li><span class="rows__k">${p("pin",16)} Local</span><a class="rows__v link" href="https://maps.apple.com/?q=${encodeURIComponent(e.location)}" target="_blank" rel="noopener">${c(e.location)}</a></li>`:""}
      ${h[e.type].kind!=="post"||e.duration?`<li><span class="rows__k">${p("clock",16)} Dura\xE7\xE3o</span><span class="rows__v">${c(oe(Z(e)))}</span></li>`:""}
      <li><span class="rows__k">${p("bell",16)} Lembrete</span><span class="rows__v">${c(a?.label||"\u2014")}</span></li>
      ${s?`<li><span class="rows__k">${p("repeat",16)} Repeti\xE7\xE3o</span><span class="rows__v">${s} eventos na s\xE9rie</span></li>`:""}
      <li><span class="rows__k">${p(e.visibleToClient===!1?"eyeoff":"eye",16)} Cliente</span><span class="rows__v">${e.visibleToClient===!1?"N\xE3o aparece para o cliente":"Aparece no calend\xE1rio do cliente"}</span></li>
    </ul>

    ${e.description?`<div class="textbox"><h4>Descri\xE7\xE3o / legenda</h4><p>${c(e.description)}</p></div>`:""}
    ${e.internalNote?`<div class="textbox textbox--note"><h4>${p("eyeoff",13)} Nota interna (s\xF3 a equipe v\xEA)</h4><p>${c(e.internalNote)}</p></div>`:""}

    <div class="actions">
      <button data-act="ics">${p("bell",20)}<span>Lembrete no iPhone</span></button>
      ${r?`<button data-act="tomorrow">${p("right",20)}<span>Passar p/ amanh\xE3</span></button>`:""}
      <button data-act="dup">${p("copy",20)}<span>Duplicar</span></button>
      ${r?`<button data-act="del" class="is-danger">${p("trash",20)}<span>Excluir</span></button>`:""}
    </div>
    <p class="detail__meta">Criado por ${c(l.member(e.createdBy)?.name||"\u2014")}${e.updatedAt?" \xB7 atualizado "+new Date(e.updatedAt).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):""}</p>
  </div>`}function mt(t,e){let o=t.el;o.querySelectorAll("[data-status]").forEach(a=>a.onclick=async()=>{let s=l.event(e);await l.upsert("events",{...s,status:a.dataset.status})});let n=(a,s)=>{let r=o.querySelector(`[data-act="${a}"]`);r&&(r.onclick=s)};n("edit",()=>Xe({id:e})),n("dup",async()=>{let s={...l.event(e),id:D("e_"),status:"pendente",seriesId:null,createdAt:null,createdBy:null};await l.upsert("events",s),t.close(),$("Evento duplicado"),Xe({id:s.id})}),n("tomorrow",async()=>{let a=l.event(e);await ht(a,{date:k(a.date,1)})&&(await l.upsert("events",{...a,date:k(a.date,1)}),$("Movido para "+P(k(a.date,1)).toLowerCase(),{action:"Desfazer",onAction:()=>l.upsert("events",{...l.event(e),date:a.date})}))}),n("ics",()=>{let a=l.event(e);ze([a],`${h[a.type].label}-${a.date}.ics`,G.appName)}),n("del",()=>et(e,t))}async function et(t,e){let o=l.event(t),n=[t];if(o.seriesId){let s=l.state.events.filter(r=>r.seriesId===o.seriesId&&r.date>=o.date).map(r=>r.id);if(s.length>1){let r=await M({title:"Excluir evento repetido",options:[{label:"S\xF3 este",value:"one",danger:!0},{label:`Este e os pr\xF3ximos (${s.length})`,value:"next",danger:!0}]});if(!r)return;r==="next"&&(n=s)}else if(!await j({title:"Excluir este evento?",ok:"Excluir",danger:!0}))return}else if(!await j({title:"Excluir este evento?",text:l.team.length>1?"Ele some da agenda de todos.":"Ele some da sua agenda.",ok:"Excluir",danger:!0}))return;let a=n.map(s=>({...l.event(s)}));await l.removeMany("events",n),e&&e.close(),$(n.length>1?`${n.length} eventos exclu\xEDdos`:"Evento exclu\xEDdo",{action:"Desfazer",onAction:()=>l.upsertMany("events",a),ms:4500})}function Xe({id:t=null,date:e=null,companyId:o=null,type:n=null,time:a=null,assignees:s=null}={}){let r=t?l.event(t):null;if(r&&!l.canEdit("events",r)){l._denied("events",r);return}let d=l.companiesSorted(),i=n||(X.includes("feed")?"feed":X[0]),m=r?JSON.parse(JSON.stringify(r)):{id:D("e_"),type:i,companyId:o||x.monthCompany||(d.length===1?d[0].id:null),title:"",date:e||(x.tab==="mes"?x.monthSel:x.date)||E(),time:a||h[i].best[0]||"12:00",duration:["shoot","meeting","work","other"].includes(h[i].kind)?h[i].dur:null,assignees:s||(x.person!=="all"?[x.person]:l.me?[l.me]:[]),location:"",description:"",internalNote:"",reminder:30,visibleToClient:h[i].client,status:"pendente"},g=r?JSON.parse(JSON.stringify(r)):null,b={mode:"none",until:k(m.date,28)};return L({className:"sheet--tall",html:tt(m,!!r,b),onMount:R=>ft(R,m,g,b)})}function ke(t,e){let o=(t.assignees||[]).includes(e.id);return t.notifyPartner===!1?o?`Sem aviso agora. Como ${e.name} \xE9 respons\xE1vel, ele ainda recebe os lembretes do hor\xE1rio.`:`${e.name} n\xE3o recebe aviso nem lembretes deste evento. Fica s\xF3 na agenda.`:`${e.name} recebe o aviso de que voc\xEA marcou e os lembretes do hor\xE1rio.`}var se=t=>["shoot","meeting","work","other"].includes(h[t].kind),F=t=>["shoot","meeting"].includes(h[t].kind);function tt(t,e,o){let n=l.companiesSorted();return`
  ${O(e?"Editar evento":"Novo evento",{left:'<button class="btn-text" data-close>Cancelar</button>',right:'<button class="btn btn--primary btn--sm" data-save>Salvar</button>'})}
  <form class="form" data-editor onsubmit="return false">
    <div class="fgroup">
      <label class="flabel">O que \xE9?</label>
      <div class="typegrid">
        ${X.map(a=>`<button type="button" class="typebtn tbadge--${a}${t.type===a?" is-on":""}"${De(a)} data-type="${a}">${p(h[a].icon,20)}<span>${h[a].label}</span></button>`).join("")}
      </div>
    </div>

    <div class="fgroup">
      <label class="flabel">${_()}${N()?"":' <em class="tag">opcional</em>'}</label>
      <div class="cogrid">
        ${n.map(a=>`<button type="button" class="cobtn${t.companyId===a.id?" is-on":""}" style="--cc:${a.color}" data-company="${a.id}">${T(a,26,7)}<span>${c(a.name)}</span></button>`).join("")}
        <button type="button" class="cobtn cobtn--add" data-newco>${p("plus",18)}<span>Novo(a) ${_(!1,!0)}</span></button>
      </div>
    </div>

    <div class="fgroup" data-when="net" ${h[t.type].kind==="post"?"":"hidden"}>
      <label class="flabel">Onde vai postar?</label>
      <div class="netgrid">${je.map(a=>{let s=Re(a);return s?`<button type="button" class="netbtn${(t.platform||"instagram")===a?" is-on":""}" data-net="${a}"><span class="pf" style="width:22px;height:22px">${s.svg}</span><span>${c(s.name.replace(" (Twitter)",""))}</span></button>`:""}).join("")}</div>
    </div>

    <div class="fgroup">
      <label class="flabel" for="f-title">T\xEDtulo</label>
      <input id="f-title" class="input" name="title" value="${c(t.title)}" placeholder="${c(h[t.type].placeholder)}" autocomplete="off" maxlength="120">
    </div>

    <div class="fgroup row2">
      <div><label class="flabel" for="f-date">Dia</label><input id="f-date" class="input" type="date" name="date" value="${t.date}" required></div>
      <div><label class="flabel" for="f-time">Hor\xE1rio</label><input id="f-time" class="input" type="time" name="time" value="${t.time||""}" step="300"></div>
    </div>

    <div class="fgroup" data-when="duration" ${se(t.type)?"":"hidden"}>
      <label class="flabel" for="f-dur">Dura\xE7\xE3o</label>
      <select id="f-dur" class="input" name="duration">
        ${Oe.map(a=>`<option value="${a}"${(t.duration||h[t.type].dur)===a?" selected":""}>${oe(a)}</option>`).join("")}
      </select>
    </div>

    <div data-hint></div>

    <div class="fgroup">
      <label class="flabel">Quem vai fazer?</label>
      <div class="whogrid">
        ${l.team.map(a=>`<button type="button" class="whobtn${(t.assignees||[]).includes(a.id)?" is-on":""}" style="--mc:${a.color}" data-who="${a.id}">${H(a.id,30)}<span>${c(a.name)}</span><i class="whobtn__check">${p("check",14)}</i></button>`).join("")}
      </div>
      <p class="fhelp">Marque os dois se forem juntos.</p>
      ${l.team.filter(a=>a.id!==l.me).map(a=>`<label class="list__row notifyrow"><span><b>${p("bell",15)} Avisar ${a.name==="Matheus"||a.name==="Henrique"?"o ":""}${c(a.name)}</b><small data-notifyhelp>${ke(t,a)}</small></span><input type="checkbox" class="switch" name="notifyPartner" ${t.notifyPartner!==!1?"checked":""}></label>`).join("")}
    </div>

    <div class="fgroup" data-when="location" ${F(t.type)?"":"hidden"}>
      <label class="flabel" for="f-loc">Local</label>
      <input id="f-loc" class="input" name="location" value="${c(t.location||"")}" placeholder="Endere\xE7o ou nome do lugar" autocomplete="off">
      <button type="button" class="btn-text btn-text--sm" data-useaddr hidden>${p("pin",14)} Usar o endere\xE7o cadastrado</button>
    </div>

    <div class="fgroup">
      <label class="flabel" for="f-desc">Descri\xE7\xE3o / legenda <em class="tag">${p("eye",12)} cliente v\xEA</em></label>
      <textarea id="f-desc" class="input" name="description" rows="3" placeholder="Ideia do post, legenda, roteiro\u2026">${c(t.description||"")}</textarea>
    </div>
    <div class="fgroup">
      <label class="flabel" for="f-note">Nota interna <em class="tag tag--note">${p("eyeoff",12)} s\xF3 a equipe</em></label>
      <textarea id="f-note" class="input" name="internalNote" rows="2" placeholder="Equipamento, observa\xE7\xF5es, combinados\u2026">${c(t.internalNote||"")}</textarea>
    </div>

    <div class="list">
      <label class="list__row"><span>${p("bell",18)} Lembrete</span>
        <select name="reminder">${re.map(a=>`<option value="${a.v}"${(t.reminder??30)===a.v?" selected":""}>${a.label}</option>`).join("")}</select>
      </label>
      ${e?"":`<label class="list__row"><span>${p("repeat",18)} Repetir</span>
        <select name="repeat">${ce.map(a=>`<option value="${a.v}"${o.mode===a.v?" selected":""}>${a.label}</option>`).join("")}</select>
      </label>
      <label class="list__row" data-when="until" hidden><span>${p("calendar",18)} At\xE9</span>
        <input type="date" name="until" value="${o.until}">
      </label>`}
      <label class="list__row"><span>${p("eye",18)} Aparece para o cliente</span>
        <input type="checkbox" class="switch" name="visibleToClient" ${t.visibleToClient!==!1?"checked":""}>
      </label>
      ${e?`<label class="list__row"><span>${p("check",18)} Status</span>
        <select name="status">${ie.map(a=>`<option value="${a}"${t.status===a?" selected":""}>${le[a].label}</option>`).join("")}</select>
      </label>`:""}
    </div>

    ${e?`<button type="button" class="btn btn--danger-soft btn--block" data-delete>${p("trash",18)} Excluir evento</button>`:""}
    <div class="form__spacer"></div>
  </form>`}function ft(t,e,o,n){let a=t.el,s=a.querySelector("[data-editor]"),r=u=>a.querySelector(u),d=()=>{let u=r("[data-hint]");u.innerHTML=vt(e,!o),u.querySelectorAll("[data-settime]").forEach(f=>f.onclick=()=>{e.time=f.dataset.settime,s.time.value=e.time,d()}),u.querySelectorAll("[data-setwho]").forEach(f=>f.onclick=()=>{e.assignees=[f.dataset.setwho],a.querySelectorAll("[data-who]").forEach(y=>y.classList.toggle("is-on",e.assignees.includes(y.dataset.who))),d()})},i=()=>{a.querySelector('[data-when="duration"]').hidden=!se(e.type);let u=a.querySelector('[data-when="net"]');u&&(u.hidden=h[e.type].kind!=="post"),a.querySelector('[data-when="location"]').hidden=!F(e.type);let f=l.company(e.companyId),y=r("[data-useaddr]");y.hidden=!(f&&f.address&&s.location.value!==f.address);let A=a.querySelector('[data-when="until"]');A&&(A.hidden=n.mode==="none")};a.querySelectorAll("[data-type]").forEach(u=>u.onclick=()=>{let f=e.type;if(e.type=u.dataset.type,a.querySelectorAll("[data-type]").forEach(y=>y.classList.toggle("is-on",y===u)),s.title.placeholder=h[e.type].placeholder,(!o||f!==e.type)&&(e.duration=se(e.type)?h[e.type].dur:null,s.duration.value=String(h[e.type].dur),o||(e.visibleToClient=h[e.type].client,s.visibleToClient.checked=e.visibleToClient)),F(e.type)&&!s.location.value){let y=l.company(e.companyId);y?.address&&(s.location.value=y.address,e.location=y.address)}i(),d()}),a.querySelectorAll("[data-company]").forEach(u=>u.onclick=()=>{e.companyId=u.dataset.company,a.querySelectorAll("[data-company]").forEach(y=>y.classList.toggle("is-on",y===u));let f=l.company(e.companyId);F(e.type)&&f?.address&&!s.location.value&&(s.location.value=f.address,e.location=f.address),i()}),r("[data-newco]").onclick=()=>{ye(null,u=>{e.companyId=u.id,g(),t.set(tt(e,!!o,n))})},a.querySelectorAll("[data-who]").forEach(u=>u.onclick=()=>{let f=u.dataset.who;e.assignees=e.assignees.includes(f)?e.assignees.filter(S=>S!==f):[...e.assignees,f],u.classList.toggle("is-on",e.assignees.includes(f)),d();let y=a.querySelector("[data-notifyhelp]"),A=l.team.find(S=>S.id!==l.me);y&&A&&(y.textContent=ke(e,A))});let m=a.querySelector('input[name="notifyPartner"]');m&&(m.onchange=()=>{e.notifyPartner=m.checked;let u=a.querySelector("[data-notifyhelp]"),f=l.team.find(y=>y.id!==l.me);u&&f&&(u.textContent=ke(e,f))}),r("[data-useaddr]").onclick=()=>{let u=l.company(e.companyId);s.location.value=u.address,e.location=u.address,i()},a.querySelectorAll("[data-net]").forEach(u=>u.onclick=()=>{e.platform=u.dataset.net,a.querySelectorAll("[data-net]").forEach(f=>f.classList.toggle("is-on",f===u))});let g=()=>{e.title=Ge(s.title.value.trim(),e.type),h[e.type].kind==="post"&&!e.platform&&(e.platform="instagram"),h[e.type].kind!=="post"&&(e.platform=null),e.date=s.date.value,e.time=s.time.value||"",e.duration=se(e.type)?Number(s.duration.value):null,e.location=F(e.type)?s.location.value.trim():"",e.description=s.description.value.trim(),e.internalNote=s.internalNote.value.trim(),e.reminder=Number(s.reminder.value),e.visibleToClient=s.visibleToClient.checked,s.status&&(e.status=s.status.value),s.repeat&&(n.mode=s.repeat.value),s.until&&(n.until=s.until.value)};s.addEventListener("input",()=>{g(),i()}),s.addEventListener("change",()=>{g(),i(),d()});let b=r("[data-delete]");b&&(b.onclick=()=>et(e.id,null).then(()=>!l.event(e.id)&&t.close())),r("[data-save]").onclick=async()=>{if(g(),!v){if(!e.companyId&&N()){$("Escolha a empresa"),a.querySelector(".cogrid").scrollIntoView({behavior:"smooth",block:"center"});return}if(!e.date)return $("Escolha o dia");if(!(!e.assignees.length&&!await j({title:"Ningu\xE9m respons\xE1vel?",text:"Este evento ficar\xE1 sem respons\xE1vel. Deseja salvar assim mesmo?",ok:"Salvar assim"}))&&!v){v=!0;try{await R()}finally{v=!1}}}};let v=!1,R=async()=>{if(o){if(["date","time","duration","type","assignees","companyId"].some(f=>JSON.stringify(e[f])!==JSON.stringify(o[f]))&&!await _e(e,!1,t,w))return;await $t(e,o)}else if(n.mode!=="none"){let u=gt(e.date,n),f=u.filter(S=>z({...e,date:S},{isNew:!0}).some(q=>q.level==="block")),y=u;if(f.length){let S=await M({title:`${f.length} de ${u.length} datas j\xE1 t\xEAm compromisso nesse hor\xE1rio`,text:f.slice(0,6).map(q=>B(q)).join(" \xB7 ")+(f.length>6?" \u2026":""),options:[{label:`Criar s\xF3 nas ${u.length-f.length} datas livres`,value:"free",primary:!0},{label:"Criar em todas mesmo assim",value:"all"}]});if(!S)return;if(S==="free"&&(y=u.filter(q=>!f.includes(q))),!y.length)return $("Nenhuma data livre")}let A=D("s_");await l.upsertMany("events",y.map((S,q)=>({...e,id:q===0?e.id:D("e_"),date:S,seriesId:A})),{activity:{notifyPartner:e.notifyPartner,kind:"series",count:y.length,label:`${h[e.type].label} ${ce.find(S=>S.v===n.mode)?.label.toLowerCase()||""} \xE0s ${Q(e.time)}`,sample:{companyId:e.companyId,date:y[0]}}}),$(`${y.length} eventos criados`)}else{if(!await _e(e,!0,t,w))return;await l.upsert("events",{...e}),$("Evento salvo")}t.close()};function w(){s.time.value=e.time||"",s.date.value=e.date,a.querySelectorAll("[data-who]").forEach(u=>u.classList.toggle("is-on",e.assignees.includes(u.dataset.who))),i(),d()}i(),d()}var we=420,Ze=1380,C=t=>(Math.min(Math.max(t,we),Ze)-we)/(Ze-we)*100;function bt(t,e){let o=t.time?me(t):null,n=[8,10,12,14,16,18,20,22];return`<div class="lanes">
    <div class="lanes__head"><strong>Agenda dos dois em ${c(B(t.date))}</strong></div>
    ${l.team.map(a=>{let s=l.eventsOn(t.date,{person:a.id}).filter(i=>i.id!==t.id&&i.time),r=(t.assignees||[]).includes(a.id),d=e.some(i=>i.level==="block"&&i.person===a.id);return`<div class="lane">
        <span class="lane__who">${H(a.id,22)}</span>
        <div class="lane__track">
          ${n.map(i=>`<i class="lane__tick" style="left:${C(i*60)}%"></i>`).join("")}
          ${s.map(i=>{let m=me(i),g=l.company(i.companyId);return`<span class="lane__ev" style="left:${C(m[0])}%;width:max(4px,${C(m[1])-C(m[0])}%);background:${g?.color||"#888"}" title="${c(Ue(i))}"></span>`}).join("")}
          ${o&&r?`<span class="lane__draft${d?" is-clash":""}" style="left:${C(o[0])}%;width:max(6px,${C(o[1])-C(o[0])}%)"></span>`:""}
        </div>
      </div>`}).join("")}
    <div class="lane lane--axis"><span class="lane__who"></span><div class="lane__track">${n.map(a=>`<small style="left:${C(a*60)}%">${a}h</small>`).join("")}</div></div>
  </div>`}function vt(t,e){if(!t.date)return"";let o=z(t,{isNew:e}),n=o.filter(v=>v.level==="block"),a=o.filter(v=>v.level==="warn"),s=o.filter(v=>v.level==="info"),r=fe(t,{limit:4}),d=be(t),i=(t.assignees||[]).length===1?t.assignees[0]:null,m=n.length&&i?l.team.find(v=>v.id!==i&&d.includes(v.id)):null,g=h[t.type],b=v=>`<li class="issue issue--${v.level}">${p(v.level==="block"?"alert":v.level==="warn"?"flag":v.code==="partner"?"user":"bulb",15)}<div><strong>${c(v.title)}</strong><p>${c(v.text)}</p></div></li>`;return`
  <section class="assist">
    <header class="assist__head">${p("sparkle",16)} Assistente</header>
    ${bt(t,o)}
    ${o.length?`<ul class="issues">${[...n,...a,...s].map(b).join("")}</ul>`:t.time?`<p class="assist__ok">${p("check",15)} Hor\xE1rio livre para ${c(te(t.assignees))}, sem conflitos.</p>`:""}
    ${m?`<button type="button" class="tchip tchip--wide" data-setwho="${m.id}">${H(m.id,18)} Passar para ${c(m.name)} (est\xE1 livre)</button>`:""}
    <div class="assist__sugg">
      <p>${c(g.tip)}</p>
      ${r.length?`<div class="hintbox__times">${r.map(v=>`<button type="button" class="tchip${t.time===v.time?" is-on":""}" data-settime="${v.time}">${Q(v.time)}${v.peak?"<small>pico</small>":"<small>livre</small>"}</button>`).join("")}</div>`:`<p class="muted">Nenhum hor\xE1rio livre nesse dia${(t.assignees||[]).length?" para "+c(te(t.assignees)):""}. Tente outro dia ou outra pessoa.</p>`}
    </div>
  </section>`}async function _e(t,e,o,n){let s=z(t,{isNew:e}).filter(b=>b.level==="block");if(!s.length)return!0;let r=fe(t,{limit:2}),d=(t.assignees||[]).length===1?t.assignees[0]:null,i=d&&l.team.find(b=>b.id!==d&&be(t).includes(b.id)),m=[...r.map(b=>({label:`Mudar para ${Q(b.time)} (livre)`,value:"time:"+b.time,primary:!0})),...i?[{label:`Passar para ${i.name} (est\xE1 livre)`,value:"who:"+i.id,primary:!r.length}]:[],{label:"Marcar mesmo assim",value:"force"}],g=await M({title:s[0].code==="duplicate"?"Isso j\xE1 est\xE1 na agenda":"J\xE1 tem compromisso nesse hor\xE1rio",bodyHtml:`<ul class="issues issues--dialog">${s.map(b=>`<li class="issue issue--block">${p("alert",15)}<div><strong>${c(b.title)}</strong><p>${c(b.text)}</p></div></li>`).join("")}</ul>`,options:m});return g?g==="force"?!0:(g.startsWith("time:")&&(t.time=g.slice(5)),g.startsWith("who:")&&(t.assignees=[g.slice(4)]),n(),_e(t,e,o,n)):!1}async function ht(t,e){let o={...t,...e},n=z(o).filter(s=>s.level==="block");return n.length?await M({title:"J\xE1 tem compromisso nesse hor\xE1rio",bodyHtml:`<ul class="issues issues--dialog">${n.map(s=>`<li class="issue issue--block">${p("alert",15)}<div><strong>${c(s.title)}</strong><p>${c(s.text)}</p></div></li>`).join("")}</ul>`,options:[{label:"Mover mesmo assim",value:"force",primary:!0}]})==="force":!0}function gt(t,e){let o=[],n=t,a=e.until&&e.until>=t?e.until:k(t,28);for(;n<=a&&o.length<150;){let s=K(n).getDay();(e.mode==="daily"||e.mode==="weekdays"&&s>=1&&s<=5||e.mode==="weekly"&&K(n).getDay()===K(t).getDay())&&o.push(n),n=k(n,1)}return o}var yt=["type","companyId","title","time","duration","assignees","location","description","internalNote","reminder","visibleToClient"];async function $t(t,e){let o=yt.filter(n=>JSON.stringify(t[n])!==JSON.stringify(e[n]));if(t.seriesId&&o.length){let n=l.state.events.filter(a=>a.seriesId===t.seriesId&&a.date>e.date);if(n.length){let a=await M({title:"Evento repetido",text:"Aplicar as altera\xE7\xF5es a quais eventos?",options:[{label:"S\xF3 a este",value:"one",primary:!0},{label:`A este e aos pr\xF3ximos (${n.length+1})`,value:"next"}]});if(!a)return;if(a==="next"){let s=Object.fromEntries(o.map(r=>[r,t[r]]));await l.upsertMany("events",[{...t},...n.map(r=>({...r,...s}))],{activity:{kind:"series-edit",count:n.length+1,label:`${h[t.type].label} \xB7 a partir de ${t.date.slice(8)}/${t.date.slice(5,7)}`,sample:{companyId:t.companyId,date:t.date}}}),$("S\xE9rie atualizada");return}}}await l.upsert("events",{...t}),$("Altera\xE7\xF5es salvas")}export{jt as a,Rt as b,Ge as c,x as d,kt as e,ze as f,ma as g,Xe as h,ht as i,Kt as j,Wt as k,ye as l};
