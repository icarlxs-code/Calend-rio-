import{b as ge,c as We,d as J,e as le,f as ye}from"./c-QQDDAYQI.js";import{h as Ke}from"./c-6ZK6KJM3.js";import{a as ne,g as $e}from"./c-QGCP777H.js";import{a as Ve,b as ze,c as Fe,d as F,f as oe,h as I,i as Je,j as Ge,k as ve,l as he,m as M,o as j,p as k,q as R,r as P}from"./c-E5A4TQYE.js";import{a as pe,b as Oe,d as Me,e as je,f as l}from"./c-EIA4XOOJ.js";import{a as p}from"./c-CIJP7VMQ.js";import{B as c,D as H,G as De,c as Q,d as E,e as S,f as Ae,g as X,i as Ie,j as Z,k as ee,l as Ne,m as te,r as qe,t as Le,u as B,v as U,w as de,z as O}from"./c-YEARXB46.js";import{a as Y}from"./c-MYDFTVQQ.js";import{A as be,g as b,h as V,i as w,k as Re,l as _,n as Pe,o as z,p as Be,r as x,s as Ue,t as ae,u as ue,v as me,x as se,y as He,z as fe}from"./c-U53RW4YL.js";var G=(()=>{try{return JSON.parse(localStorage.getItem("pauta.ui")||"{}")}catch{return{}}})(),C={tab:G.tab==="pessoal"?"hoje":G.tab||"hoje",space:G.space==="personal"?"personal":"work",ptab:G.ptab||"p-hoje",pMonth:null,pSel:null,pView:"mes",person:G.person||"all",date:E(),month:X(E()),monthSel:E(),monthCompany:null,showAllTips:!1};function qt(){try{localStorage.setItem("pauta.ui",JSON.stringify({tab:C.tab,person:C.person,space:C.space,ptab:C.ptab}))}catch{}}var pt={feed:"\u{1F5BC}\uFE0F",carrossel:"\u{1F5C2}\uFE0F",reels:"\u{1F3AC}",story:"\u2B55",captacao:"\u{1F4F8}",reuniao:"\u{1F91D}",producao:"\u2702\uFE0F",outro:"\u2022"},K=a=>String(a||"").replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\r?\n/g,"\\n"),ut=a=>{let e=[];for(;a.length>74;)e.push(a.slice(0,74)),a=" "+a.slice(74);return e.push(a),e.join(`\r
`)},Ye=(a,e)=>a.replace(/-/g,"")+"T"+e.replace(":","")+"00",mt=()=>new Date().toISOString().replace(/[-:]/g,"").replace(/\.\d+/,"");function ft(a,e){let o=["BEGIN:VCALENDAR","VERSION:2.0",`PRODID:-//${Y.appName}//PT-BR`,"CALSCALE:GREGORIAN","METHOD:PUBLISH",`X-WR-CALNAME:${K(e)}`];return a.forEach(n=>{let t=l.company(n.companyId),s=(n.assignees||[]).map(u=>l.member(u)?.name).filter(Boolean).join(" e "),r=`${pt[n.type]||""} ${b[n.type]?.label||"Evento"} \xB7 ${t?.name||""}${n.title?" \u2014 "+n.title:""}`.trim(),d=[s&&`Respons\xE1vel: ${s}`,n.description,n.internalNote&&`Nota interna: ${n.internalNote}`].filter(Boolean).join(`
`);if(o.push("BEGIN:VEVENT",`UID:${n.id}@pauta`,`DTSTAMP:${mt()}`),n.time){let u=Z(n.time)+ae(n),$=u>=1440?S(n.date,1):n.date;o.push(`DTSTART:${Ye(n.date,n.time)}`,`DTEND:${Ye($,ee(u%1440))}`)}else o.push(`DTSTART;VALUE=DATE:${n.date.replace(/-/g,"")}`,`DTEND;VALUE=DATE:${S(n.date,1).replace(/-/g,"")}`);o.push(`SUMMARY:${K(r)}`),d&&o.push(`DESCRIPTION:${K(d)}`),n.location&&o.push(`LOCATION:${K(n.location)}`);let i=n.reminder??30;i>=0&&o.push("BEGIN:VALARM","ACTION:DISPLAY",`DESCRIPTION:${K(r)}`,`TRIGGER:-PT${i}M`,"END:VALARM"),o.push("END:VEVENT")}),o.push("END:VCALENDAR"),o.map(ut).join(`\r
`)}async function Qe(a,e,o){let n=ft(a,o),t=ne();if(t){let i=document.createElement("form");i.method="POST",i.action=t.replace(/\/$/,"")+"/ics",i.target="_blank",i.style.display="none";let u=document.createElement("textarea");u.name="ics",u.value=n,i.appendChild(u),document.body.appendChild(i),i.submit(),i.remove();return}let s=new File([n],e,{type:"text/calendar"});if(navigator.canShare&&navigator.canShare({files:[s]}))try{await navigator.share({files:[s],title:o});return}catch(i){if(i&&i.name==="AbortError")return}let r=URL.createObjectURL(s),d=document.createElement("a");d.href=r,d.download=e,document.body.appendChild(d),d.click(),d.remove(),setTimeout(()=>URL.revokeObjectURL(r),4e3)}var Xe=new Set(["fazer","criar","postar","subir","publicar","gravar","post","postagem","publicacao","publica\xE7\xE3o","o","a","um","uma","no","na","do","da","de","dos","das","pro","pra","para","feed","reels","reel","story","stories","storie","storys","carrossel","carosel","carossel","instagram","insta","ig","sobre","com","e"]),bt=[[/\bcouve flor\b/gi,"couve-flor"],[/\bpromocao\b/gi,"promo\xE7\xE3o"],[/\bpromoçao\b/gi,"promo\xE7\xE3o"],[/\bacao\b/gi,"a\xE7\xE3o"],[/\bpao\b/gi,"p\xE3o"],[/\blimao\b/gi,"lim\xE3o"],[/\bmamao\b/gi,"mam\xE3o"],[/\bmelao\b/gi,"mel\xE3o"],[/\bfeijao\b/gi,"feij\xE3o"],[/\bmaca\b/gi,"ma\xE7\xE3"],[/\bmaça\b/gi,"ma\xE7\xE3"],[/\babobora\b/gi,"ab\xF3bora"],[/\bpessego\b/gi,"p\xEAssego"],[/\bmaracuja\b/gi,"maracuj\xE1"],[/\babacate\b/gi,"abacate"],[/\babacaxi\b/gi,"abacaxi"],[/\bcafe\b/gi,"caf\xE9"],[/\bpromo\b/gi,"promo"],[/\bblack friday\b/gi,"Black Friday"],[/\bnatal\b/gi,"Natal"],[/\bano novo\b/gi,"Ano Novo"],[/\bdia das maes\b/gi,"Dia das M\xE3es"],[/\bdia dos pais\b/gi,"Dia dos Pais"],[/\bhamburguer\b/gi,"hamb\xFArguer"],[/\bhamburguers\b/gi,"hamb\xFArgueres"],[/\blancamento\b/gi,"lan\xE7amento"],[/\bcolecao\b/gi,"cole\xE7\xE3o"],[/\bvideo\b/gi,"v\xEDdeo"],[/\bsabado\b/gi,"s\xE1bado"],[/\bpromocoes\b/gi,"promo\xE7\xF5es"]],Ze=a=>a.toLowerCase().replace(/[.,:;!]+$/,""),vt={feed:"Post no feed",carrossel:"Carrossel",reels:"Reels",story:"Stories"},et=/^(post no feed|carrossel|reels|stories|story)\s+—\s+/i;function tt(a,e=null){let o=String(a||"").replace(/\s+/g," ").trim();if(!o)return o;let n=vt[e];if(!n)return ke(we(o));if(et.test(o))return`${n} \u2014 ${ke(we(o.replace(et,"")))}`;let t=o.split(" ");for(;t.length>1&&Xe.has(Ze(t[0]));)t.shift();return o=t.join(" ").replace(/\s+(no|pro|pra|para o)\s+(instagram|insta|ig|feed)\s*$/i,"").trim(),Xe.has(Ze(o))?n:`${n} \u2014 ${ke(we(o))}`}var we=a=>{for(let[e,o]of bt)a=a.replace(e,o);return a},ke=a=>a&&a.charAt(0).toLocaleUpperCase("pt-BR")+a.slice(1);var ht=[[/pura vida|hortifruti|jg garcia/i,"hortifruti: frutas, verduras e legumes frescos"],[/bbq|burger|hamb/i,"hamburgueria e churrasco (BBQ)"],[/multimarcas|moda|roupa/i,"loja de roupas multimarcas"],[/festa/i,"loja de artigos e decora\xE7\xE3o de festas"]];function _e(a){if(a?.niche)return a.niche;let e=ht.find(([o])=>o.test(a?.name||""));return e?e[1]:""}function $t(){let a=E();return l.state.companies.map(e=>{let o=l.state.events.filter(r=>r.companyId===e.id&&b[r.type]?.kind==="post"),n=o.filter(r=>r.date<=a&&(r.status==="feito"||r.date<a)).map(r=>r.date).sort(),t=o.filter(r=>r.date>=a&&r.status!=="feito").map(r=>r.date).sort(),s=n[n.length-1]||"";return{onlyFor:e.notifyOnly||null,name:e.name,niche:_e(e)||"pequena empresa local",lastPost:s,nextPost:t[0]||"",daysSincePost:s?Ie(s,a):null}})}function gt(){let a=E(),e=new Date,o=e.getHours()*60+e.getMinutes(),n=l.state.events.filter(s=>s.status!=="feito"&&s.date>=a).sort((s,r)=>(s.date+(s.time||"")).localeCompare(r.date+(r.time||""))),t=l.state.events.filter(s=>s.status!=="feito"&&s.time&&(s.date<a||s.date===a&&Z(s.time)<o)).length;return{arch:w.arch,profession:w.profession||"",entity:w.entity.many,tips:_()?[]:(w.tips||[]).slice(0,12),next:n.slice(0,5).map(s=>({date:s.date,time:s.time||"",label:b[s.type]?.label||"Compromisso",title:(s.title||"").slice(0,60),who:(s.assignees||[])[0]||""})),late:t}}var at=null,st="";function Jt(){l.mode!=="cloud"||!ne()||!l.ready||(clearTimeout(at),at=setTimeout(()=>{let a=$t(),e=gt(),o=JSON.stringify([a,e]);o!==st&&$e("/coach",{companies:a,work:e}).then(()=>st=o).catch(()=>{})},4e3))}var Gt=()=>$e("/coach-test",{});var yt={Empresa:"Pura Vida",Local:"Hospital Santa Clara",Turma:"9\xBA ano B",Obra:"Residencial Aurora",Cliente:"Maria Silva",Setor:"Linha de produ\xE7\xE3o 2",Unidade:"3\xBA Batalh\xE3o",Projeto:"Novo site",Plataforma:"iFood",\u00C1rea:"Talh\xE3o 3",Mat\u00E9ria:"Matem\xE1tica"};function oa(){let a=l.companiesSorted(),e=E(),o=Ae(e),n=S(o,6);return`
  <header class="hdr">
    <div class="hdr__row">
      <div class="hdr__titles"><p class="hdr__eyebrow">${a.length} ${a.length===1?x(!1,!0):x(!0,!0)}</p><h1>${x(!0)}</h1></div>
      <div class="hdr__actions"><button class="btn btn--primary btn--sm" data-action="new-company">${p("plus",16)} ${z()}</button></div>
    </div>
  </header>
  <div class="page">
    ${a.length?"":he(`${Be()} ${x(!1,!0)} ainda`,`Cadastre ${w.entity.hint} com nome, cor e foto. Assim cada compromisso fica organizado no lugar certo.`,`<button class="btn btn--primary" data-action="new-company">${p("plus",18)} Cadastrar ${x(!1,!0)}</button>`)}
    <div class="colist">
      ${a.map(t=>{let s=l.eventsBetween(o,n,{companyId:t.id}),r=s.filter(u=>Ue(u.type)).length,d=s.filter(u=>u.type==="captacao").length,i=l.state.events.filter(u=>u.companyId===t.id&&u.date>=e&&u.status!=="feito").sort((u,$)=>(u.date+u.time).localeCompare($.date+$.time))[0];return`<button class="cocard" style="--cc:${t.color};--cc-soft:${H(t.color,.1)}" data-action="open-company" data-id="${t.id}">
          <div class="cocard__top">
            ${I(t,48)}
            <div class="cocard__name"><strong>${c(t.name)}</strong>${t.instagram?`<small>${p("insta",12)} @${c(t.instagram)}</small>`:""}</div>
            ${p("right",18,"muted")}
          </div>
          <div class="cocard__stats">
            ${_()?`<span><b>${r}</b> posts</span><span><b>${d}</b> capta\xE7${d===1?"\xE3o":"\xF5es"}</span>`:`<span><b>${s.length}</b> compromisso${s.length===1?"":"s"}</span>`}<span class="muted">nesta semana</span>
          </div>
          ${i?`<div class="cocard__next">${p(b[i.type].icon,14)} <b>${c(B(i.date))}${i.time?" "+i.time:""}</b> \xB7 ${c(b[i.type].label)} \u2014 ${c(i.title||"")}</div>`:'<div class="cocard__next muted">Nada agendado</div>'}
        </button>`}).join("")}
    </div>
  </div>`}function na(a){let e=M({className:"sheet--tall",html:ot(a),onMount:o=>wt(o,a)});e.refresh=()=>l.company(a)?e.set(ot(a)):e.close()}function ot(a){let e=l.company(a);if(!e)return"";let o=E(),n=X(o),t=l.eventsBetween(`${n}-01`,`${n}-31`,{companyId:a}),s=l.eventsBetween(o,S(o,30),{companyId:a}),r=l.eventsBetween(S(o,-14),S(o,-1),{companyId:a}).reverse(),d=v=>t.filter(h=>v.includes(h.type)).length,i=t.filter(v=>v.status==="feito").length,u="",$=s.map(v=>{let h=v.date!==u?`<h4 class="dayhead">${c(U(v.date))}</h4>`:"";return u=v.date,h+ve(v)}).join("");return`
  ${j("",{right:l.canEdit("companies",e)?'<button class="btn-text" data-act="edit">Editar</button>':""})}
  <div class="cohero" style="--cc:${e.color};--cc-soft:${H(e.color,.14)}">
    ${I(e,72,20)}
    <h2>${c(e.name)}</h2>
    ${e.instagram?`<a class="cohero__ig" href="https://instagram.com/${encodeURIComponent(e.instagram)}" target="_blank" rel="noopener">${p("insta",14)} @${c(e.instagram)}</a>`:""}
    <div class="cohero__btns">
      <button class="btn btn--primary btn--sm" data-act="new">${p("plus",16)} Evento</button>
      ${w.clientLike?`<button class="btn btn--soft btn--sm" data-act="clientview">${p("eye",16)} P\xE1gina do cliente</button>`:""}
      <button class="btn btn--soft btn--sm" data-act="share">${p("share",16)} Enviar</button>
    </div>
  </div>

  <div class="page page--sheet">
    <section class="block">
      <h2 class="block__title">${c(Le(n))}</h2>
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
      ${$||he("Nada agendado","Toque em + para marcar o primeiro compromisso aqui.")}
    </section>

    ${r.length?`<section class="block">
      <h2 class="block__title">\xDAltimas 2 semanas</h2>
      ${r.map(v=>ve(v,{showDate:!0,compact:!0})).join("")}
    </section>`:""}
  </div>`}function wt(a,e){let o=a.el;(o.querySelector('[data-act="edit"]')||{}).onclick=()=>Se(e),o.querySelector('[data-act="new"]').onclick=async()=>{let{openEventEditor:n}=await import("./c-6XQSVF63.js");n({companyId:e})},o.querySelector('[data-act="share"]').onclick=()=>Ee(e),o.querySelector('[data-act="clientview"]').onclick=()=>kt(e)}function Se(a=null,e=null){let o=a?l.company(a):null,n=l.state.companies.map(d=>d.color),t=o?{...o}:{id:O("c_"),name:"",color:se.find(d=>!n.includes(d))||se[0],logo:null,instagram:"",address:"",contact:"",notes:"",shareToken:null},s=()=>`
    ${j(o?`Editar ${x(!1,!0)}`:`${z()} ${x(!1,!0)}`,{left:'<button class="btn-text" data-close>Cancelar</button>',right:'<button class="btn btn--primary btn--sm" data-save>Salvar</button>'})}
    <form class="form" onsubmit="return false">
      <div class="logopick">
        <div data-preview>${I({...t,name:t.name||"?"},88,24)}</div>
        <div class="logopick__btns">
          <label class="btn btn--soft btn--sm">${p("image",16)} ${t.logo?"Trocar logo":"Enviar logomarca"}<input type="file" accept="image/*" data-file hidden></label>
          ${t.logo?'<button type="button" class="btn-text btn-text--sm" data-rmlogo>Remover logo</button>':'<p class="fhelp">Opcional. Sem logo, usamos as iniciais na cor escolhida.</p>'}
        </div>
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-name">Nome (${c(w.entity.hint)})</label>
        <input id="c-name" class="input" name="name" value="${c(t.name)}" placeholder="Ex.: ${c(yt[w.entity.one]||"Pura Vida")}" autocomplete="off" maxlength="60">
      </div>
      <div class="fgroup">
        <label class="flabel">Cor no calend\xE1rio</label>
        <div class="palette">
          ${se.map(d=>`<button type="button" class="swatch${t.color===d?" is-on":""}" style="background:${d}" data-color="${d}" aria-label="Cor ${d}">${p("check",16)}</button>`).join("")}
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
        <p class="fhelp">${_()?"Avisos, lembretes, \u201CJ\xE1 postou?\u201D, cobran\xE7as de atraso e dicas desta empresa":`Avisos, lembretes e cobran\xE7as de atraso ${Pe()?"desta":"deste"} ${c(x(!1,!0))}`} chegam s\xF3 para quem estiver marcado.</p>
      </div>
      <div class="fgroup"${_()?"":" hidden"}>
        <label class="flabel" for="c-niche">O que a empresa faz (para as dicas)</label>
        <input id="c-niche" class="input" name="niche" value="${c(t.niche||_e(t))}" placeholder="Ex.: hamburgueria artesanal, loja de roupas femininas" autocomplete="off" maxlength="160">
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
      ${o?`<button type="button" class="btn btn--danger-soft btn--block" data-delete>${p("trash",18)} Excluir ${x(!1,!0)}</button>`:""}
      <div class="form__spacer"></div>
    </form>`,r=d=>{let i=d.el,u=i.querySelector("form"),$=()=>{t.name=u.name.value.trim(),t.instagram=u.instagram.value.trim().replace(/^@/,""),t.niche=u.niche.value.trim(),t.notifyOnly=i.querySelector("[data-only].is-on")?.dataset.only||null,t.address=u.address.value.trim(),t.contact=u.contact.value.trim(),t.notes=u.notes.value.trim()},v=()=>i.querySelector("[data-preview]").innerHTML=I({...t,name:u.name.value||"?"},88,24);u.name.addEventListener("input",v),i.querySelectorAll("[data-only]").forEach(y=>y.onclick=()=>i.querySelectorAll("[data-only]").forEach(m=>m.classList.toggle("is-on",m===y))),i.querySelectorAll("[data-color]").forEach(y=>y.onclick=()=>{t.color=y.dataset.color,i.querySelectorAll("[data-color]").forEach(m=>m.classList.toggle("is-on",m===y)),v()}),i.querySelector("[data-customcolor]").oninput=y=>{t.color=y.target.value,i.querySelectorAll("[data-color]").forEach(m=>m.classList.remove("is-on")),v()},i.querySelector("[data-file]").onchange=async y=>{let m=y.target.files[0];if(m)try{$(),t.logo=await De(m,160),d.set(s())}catch{k("N\xE3o foi poss\xEDvel ler essa imagem")}};let h=i.querySelector("[data-rmlogo]");h&&(h.onclick=()=>{$(),t.logo=null,d.set(s())});let A=i.querySelector("[data-delete]");A&&(A.onclick=async()=>{let y=l.state.events.filter(f=>f.companyId===t.id);await R({title:`Excluir ${t.name}?`,text:y.length?`Os ${y.length} compromissos daqui tamb\xE9m ser\xE3o apagados e o link do cliente deixar\xE1 de funcionar.`:"O link do cliente deixar\xE1 de funcionar.",ok:"Excluir",danger:!0})&&(await l.removeMany("events",y.map(f=>f.id)),await l.remove("companies",t.id),d.close(),k("Exclu\xEDdo"))}),i.querySelector("[data-save]").onclick=async()=>{if($(),!t.name)return u.name.focus(),k("Digite o nome");await l.upsert("companies",{...t}),d.close(),k(o?"Atualizado":"Cadastrado"),e&&e(l.company(t.id))}};M({className:"sheet--tall",html:s(),onMount:r})}async function Ee(a){let e=l.company(a),o=l.mode==="cloud",n="";o?(await l.ensureShareToken(e),await l.publishCompany(a),n=Me(l.company(a).shareToken)):n=je(await Oe(pe(e,l.state.events,{maxFuture:90})));let t=`
    ${j("Link do cliente")}
    <div class="share">
      <div class="share__co">${I(e,56)}<div><strong>${c(e.name)}</strong><small>v\xEA somente o pr\xF3prio cronograma</small></div></div>
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
    </div>`;M({html:t,onMount:s=>{let r=s.el;r.querySelector("[data-copy]").onclick=async()=>{try{await navigator.clipboard.writeText(n),k("Link copiado")}catch{r.querySelector("[data-link]").select(),k("Selecione e copie o link")}},r.querySelector("[data-sharebtn]").onclick=async()=>{let i=`Ol\xE1! Este \xE9 o cronograma de conte\xFAdo da ${e.name}. Por aqui voc\xEAs acompanham tudo o que est\xE1 planejado: posts, stories, reels e capta\xE7\xF5es.`;if(navigator.share)try{await navigator.share({title:`Cronograma \xB7 ${e.name}`,text:i,url:n})}catch{}else await navigator.clipboard?.writeText(`${i}
${n}`),k("Mensagem copiada")};let d=r.querySelector("[data-revoke]");d&&(d.onclick=async()=>{await R({title:"Gerar um novo link?",text:"Quem tiver o link antigo n\xE3o conseguir\xE1 mais ver o cronograma.",ok:"Gerar novo link",danger:!0})&&(await l.regenerateShareToken(l.company(a)),s.close(),Ee(a))})}})}async function kt(a){let e=l.company(a);if(!e)return;let{showClient:o}=await import("./c-YGVPVHL5.js"),{sanitizePayload:n}=await import("./c-UL2LDEZV.js"),t=n(pe(e,l.state.events)),s=document.createElement("div");s.className="client-preview",s.innerHTML=`<div class="client-preview__bar"><button class="btn btn--soft btn--sm" data-closepv>${p("left",16)} Voltar</button><span>Assim o cliente v\xEA</span><button class="btn btn--primary btn--sm" data-sendpv>${p("share",16)} Enviar</button></div><div class="client-preview__body"></div>`,document.body.appendChild(s),document.body.classList.add("has-sheet"),o(s.querySelector(".client-preview__body"),t,{canGoBack:!1,preview:!0});let r=()=>{s.remove(),document.body.classList.toggle("has-sheet",!!document.querySelector(".sheet-wrap"))};s.querySelector("[data-closepv]").onclick=r,s.querySelector("[data-sendpv]").onclick=()=>{r(),Ee(a)}}function ka(a){let e=M({html:nt(a),className:"sheet--tall",onMount:o=>_t(o,a)});e.refresh=()=>{if(!l.event(a))return e.close();e.set(nt(a))}}function nt(a){let e=l.event(a);if(!e)return"";let o=l.company(e.companyId),n=o?.color||"#666",t=fe.find(i=>i.v===(e.reminder??30)),s=e.seriesId?l.state.events.filter(i=>i.seriesId===e.seriesId).length:0,r=l.canEdit("events",e),d=l.member(l.ownerOf("events",e))?.name||"o parceiro";return`
  ${j("",{right:r?'<button class="btn-text" data-act="edit">Editar</button>':""})}
  <div class="detail">
    <div class="detail__hero" style="--cc:${n};--cc-soft:${H(n,.12)}">
      <div class="detail__co">${I(o,40)}<div><strong>${c(o?.name||"Sem "+x(!1,!0))}</strong>${o?.instagram?`<small>@${c(o.instagram)}</small>`:""}</div>${Je(e.type,{solid:!0})}</div>
      <h2><span class="pfrow">${Fe(e,24)}</span>${c(e.title||b[e.type].label)}</h2>
      <p class="detail__when">${p("calendar",15)} ${c(B(e.date))}, ${c(qe(e.date).split(", ")[1])} \xB7 ${p("clock",15)} ${c(Ge(e))}</p>
    </div>

    ${r?"":`<p class="detail__lock">${p("eye",14)} Cadastrado por ${c(d)} \u2014 voc\xEA s\xF3 pode ver. Use \u201CDuplicar\u201D para criar uma c\xF3pia sua.</p>`}
    <div class="seg seg--status"${r?"":" hidden"}>
      ${me.map(i=>`<button class="seg__btn${e.status===i?" is-on":""} st-${i}" data-status="${i}">${i==="feito"?p("check",14):""}${ue[i].label}</button>`).join("")}
    </div>

    <ul class="rows">
      ${ce()?"":`<li><span class="rows__k">${p("users",16)} Respons\xE1vel</span><span class="rows__v">${(e.assignees||[]).map(i=>F(i,22)).join("")} ${c(oe(e.assignees))}</span></li>`}
      ${e.location?`<li><span class="rows__k">${p("pin",16)} Local</span><a class="rows__v link" href="https://maps.apple.com/?q=${encodeURIComponent(e.location)}" target="_blank" rel="noopener">${c(e.location)}</a></li>`:""}
      ${b[e.type].kind!=="post"||e.duration?`<li><span class="rows__k">${p("clock",16)} Dura\xE7\xE3o</span><span class="rows__v">${c(de(ae(e)))}</span></li>`:""}
      <li><span class="rows__k">${p("bell",16)} Lembrete</span><span class="rows__v">${c(t?.label||"\u2014")}</span></li>
      ${s?`<li><span class="rows__k">${p("repeat",16)} Repeti\xE7\xE3o</span><span class="rows__v">${s} eventos na s\xE9rie</span></li>`:""}
      ${w.clientLike?`<li><span class="rows__k">${p(e.visibleToClient===!1?"eyeoff":"eye",16)} Cliente</span><span class="rows__v">${e.visibleToClient===!1?"N\xE3o aparece para o cliente":"Aparece no link do cliente"}</span></li>`:""}
    </ul>

    ${e.description?`<div class="textbox"><h4>${c(w.form.desc[0])}</h4><p>${c(e.description)}</p></div>`:""}
    ${e.internalNote?`<div class="textbox textbox--note"><h4>${p("eyeoff",13)} ${c(w.form.note[0])} (${ct()})</h4><p>${c(e.internalNote)}</p></div>`:""}

    <div class="actions">
      <button data-act="ics">${p("bell",20)}<span>Lembrete no iPhone</span></button>
      ${r?`<button data-act="tomorrow">${p("right",20)}<span>Passar p/ amanh\xE3</span></button>`:""}
      <button data-act="dup">${p("copy",20)}<span>Duplicar</span></button>
      ${r?`<button data-act="del" class="is-danger">${p("trash",20)}<span>Excluir</span></button>`:""}
    </div>
    <p class="detail__meta">Criado por ${c(l.member(e.createdBy)?.name||"\u2014")}${e.updatedAt?" \xB7 atualizado "+new Date(e.updatedAt).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):""}</p>
  </div>`}function _t(a,e){let o=a.el;o.querySelectorAll("[data-status]").forEach(t=>t.onclick=async()=>{let s=l.event(e),r=t.getBoundingClientRect();if(await l.upsert("events",{...s,status:t.dataset.status}),t.dataset.status==="feito"&&s.status!=="feito"&&l.event(e)?.status==="feito"){let d=s.date===E()?l.eventsOn(s.date,{person:l.me}).filter(i=>i.status!=="feito").length:null;k(Ke({el:r,left:d}))}});let n=(t,s)=>{let r=o.querySelector(`[data-act="${t}"]`);r&&(r.onclick=s)};n("edit",()=>lt({id:e})),n("dup",async()=>{let s={...l.event(e),id:O("e_"),status:"pendente",seriesId:null,createdAt:null,createdBy:null};await l.upsert("events",s),a.close(),k(`${re()} duplicado`),lt({id:s.id})}),n("tomorrow",async()=>{let t=l.event(e);await Tt(t,{date:S(t.date,1)})&&(await l.upsert("events",{...t,date:S(t.date,1)}),k("Movido para "+B(S(t.date,1)).toLowerCase(),{action:"Desfazer",onAction:()=>l.upsert("events",{...l.event(e),date:t.date})}))}),n("ics",()=>{let t=l.event(e);Qe([t],`${b[t.type].label}-${t.date}.ics`,Y.appName)}),n("del",()=>rt(e,a))}async function rt(a,e){let o=l.event(a),n=[a];if(o.seriesId){let s=l.state.events.filter(r=>r.seriesId===o.seriesId&&r.date>=o.date).map(r=>r.id);if(s.length>1){let r=await P({title:`Excluir ${q()} repetido`,options:[{label:"S\xF3 este",value:"one",danger:!0},{label:`Este e os pr\xF3ximos (${s.length})`,value:"next",danger:!0}]});if(!r)return;r==="next"&&(n=s)}else if(!await R({title:`Excluir este ${q()}?`,ok:"Excluir",danger:!0}))return}else if(!await R({title:`Excluir este ${q()}?`,text:l.team.length>1?"Ele some da agenda de todos.":"Ele some da sua agenda.",ok:"Excluir",danger:!0}))return;let t=n.map(s=>({...l.event(s)}));await l.removeMany("events",n),e&&e.close(),k(n.length>1?`${n.length} ${q()}s exclu\xEDdos`:`${re()} exclu\xEDdo`,{action:"Desfazer",onAction:()=>l.upsertMany("events",t),ms:4500})}function lt({id:a=null,date:e=null,companyId:o=null,type:n=null,time:t=null,assignees:s=null}={}){let r=a?l.event(a):null;if(r&&!l.canEdit("events",r)){l._denied("events",r);return}let d=l.companiesSorted(),i=n||(V.includes("feed")?"feed":V[0]),u=r?JSON.parse(JSON.stringify(r)):{id:O("e_"),type:i,companyId:o||C.monthCompany||(d.length===1?d[0].id:null),title:"",date:e||(C.tab==="mes"?C.monthSel:C.date)||E(),time:t||b[i].best[0]||"12:00",duration:["shoot","meeting","work","other"].includes(b[i].kind)?b[i].dur:null,assignees:s||(C.person!=="all"?[C.person]:l.me?[l.me]:[]),location:"",description:"",internalNote:"",reminder:30,visibleToClient:b[i].client,status:"pendente"};if(!r&&!t&&!_()){let A=le(u,{limit:6}).map(y=>y.time).sort();if(A.length)u.time=A[0];else if(u.date===E()){let y=Math.ceil((Ne()+30)/30)*30;y<1440&&(u.time=ee(y))}}let $=r?JSON.parse(JSON.stringify(r)):null,v={mode:"none",until:S(u.date,28)};return M({className:"sheet--tall",html:dt(u,!!r,v),onMount:A=>St(A,u,$,v)})}function Te(a,e){let o=(a.assignees||[]).includes(e.id);return a.notifyPartner===!1?o?`Sem aviso agora. Como ${e.name} \xE9 respons\xE1vel, ele ainda recebe os lembretes do hor\xE1rio.`:`${e.name} n\xE3o recebe aviso nem lembretes deste evento. Fica s\xF3 na agenda.`:`${e.name} recebe o aviso de que voc\xEA marcou e os lembretes do hor\xE1rio.`}var q=()=>_()?"evento":"compromisso",re=()=>_()?"Evento":"Compromisso",ce=()=>l.team.length<2,ct=()=>ce()?"s\xF3 voc\xEA v\xEA":`s\xF3 ${l.team.length>2?"a equipe":"voc\xEAs"} veem`,ie=a=>["shoot","meeting","work","other"].includes(b[a].kind),W=a=>["shoot","meeting"].includes(b[a].kind);function dt(a,e,o){let n=l.companiesSorted();return`
  ${j(e?`Editar ${q()}`:`Novo ${q()}`,{left:'<button class="btn-text" data-close>Cancelar</button>',right:'<button class="btn btn--primary btn--sm" data-save>Salvar</button>'})}
  <form class="form" data-editor onsubmit="return false">
    <div class="fgroup">
      <label class="flabel">O que \xE9?</label>
      <div class="typegrid">
        ${V.map(t=>`<button type="button" class="typebtn tbadge--${t}${a.type===t?" is-on":""}"${Re(t)} data-type="${t}">${p(b[t].icon,20)}<span>${b[t].label}</span></button>`).join("")}
      </div>
    </div>

    <div class="fgroup">
      <label class="flabel">${x()}${_()?"":' <em class="tag">opcional</em>'}</label>
      <div class="cogrid">
        ${n.map(t=>`<button type="button" class="cobtn${a.companyId===t.id?" is-on":""}" style="--cc:${t.color}" data-company="${t.id}">${I(t,26,7)}<span>${c(t.name)}</span></button>`).join("")}
        <button type="button" class="cobtn cobtn--add" data-newco>${p("plus",18)}<span>${z()} ${x(!1,!0)}</span></button>
      </div>
    </div>

    ${V.some(t=>b[t].kind==="post")||b[a.type].kind==="post"?`<div class="fgroup" data-when="net" ${b[a.type].kind==="post"?"":"hidden"}>
      <label class="flabel">Onde vai postar?</label>
      <div class="netgrid">${Ve.map(t=>{let s=ze(t);return s?`<button type="button" class="netbtn${(a.platform||"instagram")===t?" is-on":""}" data-net="${t}"><span class="pf" style="width:22px;height:22px">${s.svg}</span><span>${c(s.name.replace(" (Twitter)",""))}</span></button>`:""}).join("")}</div>
    </div>`:""}

    <div class="fgroup">
      <label class="flabel" for="f-title">T\xEDtulo</label>
      <input id="f-title" class="input" name="title" value="${c(a.title)}" placeholder="${c(b[a.type].placeholder)}" autocomplete="off" maxlength="120">
    </div>

    <div class="fgroup row2">
      <div><label class="flabel" for="f-date">Dia</label><input id="f-date" class="input" type="date" name="date" value="${a.date}" required></div>
      <div><label class="flabel" for="f-time">Hor\xE1rio</label><input id="f-time" class="input" type="time" name="time" value="${a.time||""}" step="300"></div>
    </div>

    <div class="fgroup" data-when="duration" ${ie(a.type)?"":"hidden"}>
      <label class="flabel" for="f-dur">Dura\xE7\xE3o</label>
      <select id="f-dur" class="input" name="duration">
        ${He.map(t=>`<option value="${t}"${(a.duration||b[a.type].dur)===t?" selected":""}>${de(t)}</option>`).join("")}
      </select>
    </div>

    <div data-hint></div>

    <div class="fgroup"${ce()?" hidden":""}>
      <label class="flabel">Quem vai fazer?</label>
      <div class="whogrid">
        ${l.team.map(t=>`<button type="button" class="whobtn${(a.assignees||[]).includes(t.id)?" is-on":""}" style="--mc:${t.color}" data-who="${t.id}">${F(t.id,30)}<span>${c(t.name)}</span><i class="whobtn__check">${p("check",14)}</i></button>`).join("")}
      </div>
      <p class="fhelp">${l.team.length>2?"Marque todos que v\xE3o juntos.":"Marque os dois se forem juntos."}</p>
      ${l.team.filter(t=>t.id!==l.me).map(t=>`<label class="list__row notifyrow"><span><b>${p("bell",15)} Avisar ${t.name==="Matheus"||t.name==="Henrique"?"o ":""}${c(t.name)}</b><small data-notifyhelp>${Te(a,t)}</small></span><input type="checkbox" class="switch" name="notifyPartner" ${a.notifyPartner!==!1?"checked":""}></label>`).join("")}
    </div>

    <div class="fgroup" data-when="location" ${W(a.type)?"":"hidden"}>
      <label class="flabel" for="f-loc">Local</label>
      <input id="f-loc" class="input" name="location" value="${c(a.location||"")}" placeholder="Endere\xE7o ou nome do lugar" autocomplete="off">
      <button type="button" class="btn-text btn-text--sm" data-useaddr hidden>${p("pin",14)} Usar o endere\xE7o cadastrado</button>
    </div>

    <div class="fgroup">
      <label class="flabel" for="f-desc">${c(w.form.desc[0])}${w.clientLike?` <em class="tag">${p("eye",12)} cliente v\xEA</em>`:""}</label>
      <textarea id="f-desc" class="input" name="description" rows="3" placeholder="${c(w.form.desc[1])}">${c(a.description||"")}</textarea>
    </div>
    <div class="fgroup">
      <label class="flabel" for="f-note">${c(w.form.note[0])} <em class="tag tag--note">${p("eyeoff",12)} ${ct()}</em></label>
      <textarea id="f-note" class="input" name="internalNote" rows="2" placeholder="${c(w.form.note[1])}">${c(a.internalNote||"")}</textarea>
    </div>

    <div class="list">
      <label class="list__row"><span>${p("bell",18)} Lembrete</span>
        <select name="reminder">${fe.map(t=>`<option value="${t.v}"${(a.reminder??30)===t.v?" selected":""}>${t.label}</option>`).join("")}</select>
      </label>
      ${e?"":`<label class="list__row"><span>${p("repeat",18)} Repetir</span>
        <select name="repeat">${be.map(t=>`<option value="${t.v}"${o.mode===t.v?" selected":""}>${t.label}</option>`).join("")}</select>
      </label>
      <label class="list__row" data-when="until" hidden><span>${p("calendar",18)} At\xE9</span>
        <input type="date" name="until" value="${o.until}">
      </label>`}
      <label class="list__row"${w.clientLike?"":" hidden"}><span>${p("eye",18)} Aparece no link do cliente</span>
        <input type="checkbox" class="switch" name="visibleToClient" ${a.visibleToClient!==!1?"checked":""}>
      </label>
      ${e?`<label class="list__row"><span>${p("check",18)} Status</span>
        <select name="status">${me.map(t=>`<option value="${t}"${a.status===t?" selected":""}>${ue[t].label}</option>`).join("")}</select>
      </label>`:""}
    </div>

    ${e?`<button type="button" class="btn btn--danger-soft btn--block" data-delete>${p("trash",18)} Excluir ${q()}</button>`:""}
    <div class="form__spacer"></div>
  </form>`}function St(a,e,o,n){let t=a.el,s=t.querySelector("[data-editor]"),r=m=>t.querySelector(m),d=()=>{let m=r("[data-hint]");m.innerHTML=xt(e,!o),m.querySelectorAll("[data-settime]").forEach(f=>f.onclick=()=>{e.time=f.dataset.settime,s.time.value=e.time,d()}),m.querySelectorAll("[data-setwho]").forEach(f=>f.onclick=()=>{e.assignees=[f.dataset.setwho],t.querySelectorAll("[data-who]").forEach(g=>g.classList.toggle("is-on",e.assignees.includes(g.dataset.who))),d()})},i=()=>{t.querySelector('[data-when="duration"]').hidden=!ie(e.type);let m=t.querySelector('[data-when="net"]');m&&(m.hidden=b[e.type].kind!=="post"),t.querySelector('[data-when="location"]').hidden=!W(e.type);let f=l.company(e.companyId),g=r("[data-useaddr]");g.hidden=!(f&&f.address&&s.location.value!==f.address);let L=t.querySelector('[data-when="until"]');L&&(L.hidden=n.mode==="none")};t.querySelectorAll("[data-type]").forEach(m=>m.onclick=()=>{let f=e.type;if(e.type=m.dataset.type,t.querySelectorAll("[data-type]").forEach(g=>g.classList.toggle("is-on",g===m)),s.title.placeholder=b[e.type].placeholder,(!o||f!==e.type)&&(e.duration=ie(e.type)?b[e.type].dur:null,s.duration.value=String(b[e.type].dur),o||(e.visibleToClient=b[e.type].client,s.visibleToClient.checked=e.visibleToClient)),W(e.type)&&!s.location.value){let g=l.company(e.companyId);g?.address&&(s.location.value=g.address,e.location=g.address)}i(),d()}),t.querySelectorAll("[data-company]").forEach(m=>m.onclick=()=>{e.companyId=m.dataset.company,t.querySelectorAll("[data-company]").forEach(g=>g.classList.toggle("is-on",g===m));let f=l.company(e.companyId);W(e.type)&&f?.address&&!s.location.value&&(s.location.value=f.address,e.location=f.address),i()}),r("[data-newco]").onclick=()=>{Se(null,m=>{e.companyId=m.id,$(),a.set(dt(e,!!o,n))})},t.querySelectorAll("[data-who]").forEach(m=>m.onclick=()=>{let f=m.dataset.who;e.assignees=e.assignees.includes(f)?e.assignees.filter(T=>T!==f):[...e.assignees,f],m.classList.toggle("is-on",e.assignees.includes(f)),d();let g=t.querySelector("[data-notifyhelp]"),L=l.team.find(T=>T.id!==l.me);g&&L&&(g.textContent=Te(e,L))});let u=t.querySelector('input[name="notifyPartner"]');u&&(u.onchange=()=>{e.notifyPartner=u.checked;let m=t.querySelector("[data-notifyhelp]"),f=l.team.find(g=>g.id!==l.me);m&&f&&(m.textContent=Te(e,f))}),r("[data-useaddr]").onclick=()=>{let m=l.company(e.companyId);s.location.value=m.address,e.location=m.address,i()},t.querySelectorAll("[data-net]").forEach(m=>m.onclick=()=>{e.platform=m.dataset.net,t.querySelectorAll("[data-net]").forEach(f=>f.classList.toggle("is-on",f===m))});let $=()=>{e.title=tt(s.title.value.trim(),e.type),b[e.type].kind==="post"&&!e.platform&&(e.platform="instagram"),b[e.type].kind!=="post"&&(e.platform=null),e.date=s.date.value,e.time=s.time.value||"",e.duration=ie(e.type)?Number(s.duration.value):null,e.location=W(e.type)?s.location.value.trim():"",e.description=s.description.value.trim(),e.internalNote=s.internalNote.value.trim(),e.reminder=Number(s.reminder.value),e.visibleToClient=s.visibleToClient.checked,s.status&&(e.status=s.status.value),s.repeat&&(n.mode=s.repeat.value),s.until&&(n.until=s.until.value)};s.addEventListener("input",()=>{$(),i()}),s.addEventListener("change",()=>{$(),i(),d()});let v=r("[data-delete]");v&&(v.onclick=()=>rt(e.id,null).then(()=>!l.event(e.id)&&a.close())),r("[data-save]").onclick=async()=>{if($(),!h){if(!e.companyId&&_()){k("Escolha a empresa"),t.querySelector(".cogrid").scrollIntoView({behavior:"smooth",block:"center"});return}if(!e.date)return k("Escolha o dia");if(ce()&&l.me&&!e.assignees.length&&(e.assignees=[l.me]),!(!e.assignees.length&&!await R({title:"Ningu\xE9m respons\xE1vel?",text:`Este ${q()} ficar\xE1 sem respons\xE1vel. Deseja salvar assim mesmo?`,ok:"Salvar assim"}))&&!h){h=!0;try{await A()}finally{h=!1}}}};let h=!1,A=async()=>{if(o){if(["date","time","duration","type","assignees","companyId"].some(f=>JSON.stringify(e[f])!==JSON.stringify(o[f]))&&!await Ce(e,!1,a,y))return;await It(e,o)}else if(n.mode!=="none"){let m=Ct(e.date,n),f=m.filter(T=>J({...e,date:T},{isNew:!0}).some(D=>D.level==="block")),g=m;if(f.length){let T=await P({title:`${f.length} de ${m.length} datas j\xE1 t\xEAm compromisso nesse hor\xE1rio`,text:f.slice(0,6).map(D=>U(D)).join(" \xB7 ")+(f.length>6?" \u2026":""),options:[{label:`Criar s\xF3 nas ${m.length-f.length} datas livres`,value:"free",primary:!0},{label:"Criar em todas mesmo assim",value:"all"}]});if(!T)return;if(T==="free"&&(g=m.filter(D=>!f.includes(D))),!g.length)return k("Nenhuma data livre")}let L=O("s_");await l.upsertMany("events",g.map((T,D)=>({...e,id:D===0?e.id:O("e_"),date:T,seriesId:L})),{activity:{notifyPartner:e.notifyPartner,kind:"series",count:g.length,label:`${b[e.type].label} ${be.find(T=>T.v===n.mode)?.label.toLowerCase()||""} \xE0s ${te(e.time)}`,sample:{companyId:e.companyId,date:g[0]}}}),k(`${g.length} eventos criados`)}else{if(!await Ce(e,!0,a,y))return;await l.upsert("events",{...e}),k(`${re()} salvo \u2713`)}a.close()};function y(){s.time.value=e.time||"",s.date.value=e.date,t.querySelectorAll("[data-who]").forEach(m=>m.classList.toggle("is-on",e.assignees.includes(m.dataset.who))),i(),d()}i(),d()}var xe=420,it=1380,N=a=>(Math.min(Math.max(a,xe),it)-xe)/(it-xe)*100;function Et(a,e){let o=a.time?ge(a):null,n=[8,10,12,14,16,18,20,22];return`<div class="lanes">
    <div class="lanes__head"><strong>${l.team.length>1?`Agenda ${l.team.length===2?"dos dois":"de todos"}`:"Sua agenda"} em ${c(U(a.date))}</strong></div>
    ${l.team.map(t=>{let s=l.eventsOn(a.date,{person:t.id}).filter(i=>i.id!==a.id&&i.time),r=(a.assignees||[]).includes(t.id),d=e.some(i=>i.level==="block"&&i.person===t.id);return`<div class="lane">
        <span class="lane__who">${F(t.id,22)}</span>
        <div class="lane__track">
          ${n.map(i=>`<i class="lane__tick" style="left:${N(i*60)}%"></i>`).join("")}
          ${s.map(i=>{let u=ge(i),$=l.company(i.companyId);return`<span class="lane__ev" style="left:${N(u[0])}%;width:max(4px,${N(u[1])-N(u[0])}%);background:${$?.color||"#888"}" title="${c(We(i))}"></span>`}).join("")}
          ${o&&r?`<span class="lane__draft${d?" is-clash":""}" style="left:${N(o[0])}%;width:max(6px,${N(o[1])-N(o[0])}%)"></span>`:""}
        </div>
      </div>`}).join("")}
    <div class="lane lane--axis"><span class="lane__who"></span><div class="lane__track">${n.map(t=>`<small style="left:${N(t*60)}%">${t}h</small>`).join("")}</div></div>
  </div>`}function xt(a,e){if(!a.date)return"";let o=J(a,{isNew:e}),n=o.filter(h=>h.level==="block"),t=o.filter(h=>h.level==="warn"),s=o.filter(h=>h.level==="info"),r=le(a,{limit:4}),d=ye(a),i=(a.assignees||[]).length===1?a.assignees[0]:null,u=n.length&&i?l.team.find(h=>h.id!==i&&d.includes(h.id)):null,$=b[a.type],v=h=>`<li class="issue issue--${h.level}">${p(h.level==="block"?"alert":h.level==="warn"?"flag":h.code==="partner"?"user":"bulb",15)}<div><strong>${c(h.title)}</strong><p>${c(h.text)}</p></div></li>`;return`
  <section class="assist">
    <header class="assist__head">${p("sparkle",16)} Assistente</header>
    ${Et(a,o)}
    ${o.length?`<ul class="issues">${[...n,...t,...s].map(v).join("")}</ul>`:a.time?`<p class="assist__ok">${p("check",15)} Hor\xE1rio livre para ${c(oe(a.assignees))}, sem conflitos.</p>`:""}
    ${u?`<button type="button" class="tchip tchip--wide" data-setwho="${u.id}">${F(u.id,18)} Passar para ${c(u.name)} (est\xE1 livre)</button>`:""}
    <div class="assist__sugg">
      <p>${c($.tip)}</p>
      ${r.length?`<div class="hintbox__times">${r.map(h=>`<button type="button" class="tchip${a.time===h.time?" is-on":""}" data-settime="${h.time}">${te(h.time)}${h.peak?"<small>pico</small>":"<small>livre</small>"}</button>`).join("")}</div>`:`<p class="muted">Nenhum hor\xE1rio livre nesse dia${(a.assignees||[]).length?" para "+c(oe(a.assignees)):""}. Tente outro dia${l.team.length>1?" ou outra pessoa":""}.</p>`}
    </div>
  </section>`}async function Ce(a,e,o,n){let s=J(a,{isNew:e}).filter(v=>v.level==="block");if(!s.length)return!0;let r=le(a,{limit:2}),d=(a.assignees||[]).length===1?a.assignees[0]:null,i=d&&l.team.find(v=>v.id!==d&&ye(a).includes(v.id)),u=[...r.map(v=>({label:`Mudar para ${te(v.time)} (livre)`,value:"time:"+v.time,primary:!0})),...i?[{label:`Passar para ${i.name} (est\xE1 livre)`,value:"who:"+i.id,primary:!r.length}]:[],{label:"Marcar mesmo assim",value:"force"}],$=await P({title:s[0].code==="duplicate"?"Isso j\xE1 est\xE1 na agenda":"J\xE1 tem compromisso nesse hor\xE1rio",bodyHtml:`<ul class="issues issues--dialog">${s.map(v=>`<li class="issue issue--block">${p("alert",15)}<div><strong>${c(v.title)}</strong><p>${c(v.text)}</p></div></li>`).join("")}</ul>`,options:u});return $?$==="force"?!0:($.startsWith("time:")&&(a.time=$.slice(5)),$.startsWith("who:")&&(a.assignees=[$.slice(4)]),n(),Ce(a,e,o,n)):!1}async function Tt(a,e){let o={...a,...e},n=J(o).filter(s=>s.level==="block");return n.length?await P({title:"J\xE1 tem compromisso nesse hor\xE1rio",bodyHtml:`<ul class="issues issues--dialog">${n.map(s=>`<li class="issue issue--block">${p("alert",15)}<div><strong>${c(s.title)}</strong><p>${c(s.text)}</p></div></li>`).join("")}</ul>`,options:[{label:"Mover mesmo assim",value:"force",primary:!0}]})==="force":!0}function Ct(a,e){let o=[],n=a,t=e.until&&e.until>=a?e.until:S(a,28);for(;n<=t&&o.length<150;){let s=Q(n).getDay();(e.mode==="daily"||e.mode==="weekdays"&&s>=1&&s<=5||e.mode==="weekly"&&Q(n).getDay()===Q(a).getDay())&&o.push(n),n=S(n,1)}return o}var At=["type","companyId","title","time","duration","assignees","location","description","internalNote","reminder","visibleToClient"];async function It(a,e){let o=At.filter(n=>JSON.stringify(a[n])!==JSON.stringify(e[n]));if(a.seriesId&&o.length){let n=l.state.events.filter(t=>t.seriesId===a.seriesId&&t.date>e.date);if(n.length){let t=await P({title:`${re()} repetido`,text:"Aplicar as altera\xE7\xF5es a quais eventos?",options:[{label:"S\xF3 a este",value:"one",primary:!0},{label:`A este e aos pr\xF3ximos (${n.length+1})`,value:"next"}]});if(!t)return;if(t==="next"){let s=Object.fromEntries(o.map(r=>[r,a[r]]));await l.upsertMany("events",[{...a},...n.map(r=>({...r,...s}))],{activity:{kind:"series-edit",count:n.length+1,label:`${b[a.type].label} \xB7 a partir de ${a.date.slice(8)}/${a.date.slice(5,7)}`,sample:{companyId:a.companyId,date:a.date}}}),k("S\xE9rie atualizada");return}}}await l.upsert("events",{...a}),k("Altera\xE7\xF5es salvas")}export{Jt as a,Gt as b,tt as c,C as d,qt as e,Qe as f,ka as g,lt as h,Tt as i,oa as j,na as k,Se as l};
