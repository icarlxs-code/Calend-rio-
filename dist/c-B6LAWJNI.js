import{b as he,c as Ke,d as J,e as $e,f as ge}from"./c-RTMXEMCY.js";import{b as Ge}from"./c-G4P7AEWA.js";import{a as oe,g as ve}from"./c-X652N5W6.js";import{a as He,b as Ve,c as ze,d as F,f as se,h as A,i as Fe,j as Je,k as fe,l as be,m as O,o as M,p as w,q as j,r as P}from"./c-B5GJXJUS.js";import{a as ce,b as De,d as Oe,e as Me,f as l}from"./c-A32SP4L4.js";import{a as p}from"./c-AUSHTMPE.js";import{B as c,D as H,G as Le,c as Q,d as x,e as _,f as Ce,g as X,i as Ae,j as Z,k as Ie,m as ee,r as Ne,t as qe,u as B,v as U,w as re,z as D}from"./c-YEARXB46.js";import{a as Y}from"./c-BYHTQNTY.js";import{A as me,g as b,h as V,i as y,k as je,l as S,n as Re,o as z,p as Pe,r as E,s as Be,t as te,u as de,v as pe,x as ae,y as Ue,z as ue}from"./c-U53RW4YL.js";var G=(()=>{try{return JSON.parse(localStorage.getItem("pauta.ui")||"{}")}catch{return{}}})(),C={tab:G.tab==="pessoal"?"hoje":G.tab||"hoje",space:G.space==="personal"?"personal":"work",ptab:G.ptab||"p-hoje",pMonth:null,pSel:null,pView:"mes",person:G.person||"all",date:x(),month:X(x()),monthSel:x(),monthCompany:null,showAllTips:!1};function Nt(){try{localStorage.setItem("pauta.ui",JSON.stringify({tab:C.tab,person:C.person,space:C.space,ptab:C.ptab}))}catch{}}var dt={feed:"\u{1F5BC}\uFE0F",carrossel:"\u{1F5C2}\uFE0F",reels:"\u{1F3AC}",story:"\u2B55",captacao:"\u{1F4F8}",reuniao:"\u{1F91D}",producao:"\u2702\uFE0F",outro:"\u2022"},K=a=>String(a||"").replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\r?\n/g,"\\n"),pt=a=>{let e=[];for(;a.length>74;)e.push(a.slice(0,74)),a=" "+a.slice(74);return e.push(a),e.join(`\r
`)},We=(a,e)=>a.replace(/-/g,"")+"T"+e.replace(":","")+"00",ut=()=>new Date().toISOString().replace(/[-:]/g,"").replace(/\.\d+/,"");function mt(a,e){let o=["BEGIN:VCALENDAR","VERSION:2.0",`PRODID:-//${Y.appName}//PT-BR`,"CALSCALE:GREGORIAN","METHOD:PUBLISH",`X-WR-CALNAME:${K(e)}`];return a.forEach(n=>{let t=l.company(n.companyId),s=(n.assignees||[]).map(m=>l.member(m)?.name).filter(Boolean).join(" e "),r=`${dt[n.type]||""} ${b[n.type]?.label||"Evento"} \xB7 ${t?.name||""}${n.title?" \u2014 "+n.title:""}`.trim(),d=[s&&`Respons\xE1vel: ${s}`,n.description,n.internalNote&&`Nota interna: ${n.internalNote}`].filter(Boolean).join(`
`);if(o.push("BEGIN:VEVENT",`UID:${n.id}@pauta`,`DTSTAMP:${ut()}`),n.time){let m=Z(n.time)+te(n),$=m>=1440?_(n.date,1):n.date;o.push(`DTSTART:${We(n.date,n.time)}`,`DTEND:${We($,Ie(m%1440))}`)}else o.push(`DTSTART;VALUE=DATE:${n.date.replace(/-/g,"")}`,`DTEND;VALUE=DATE:${_(n.date,1).replace(/-/g,"")}`);o.push(`SUMMARY:${K(r)}`),d&&o.push(`DESCRIPTION:${K(d)}`),n.location&&o.push(`LOCATION:${K(n.location)}`);let i=n.reminder??30;i>=0&&o.push("BEGIN:VALARM","ACTION:DISPLAY",`DESCRIPTION:${K(r)}`,`TRIGGER:-PT${i}M`,"END:VALARM"),o.push("END:VEVENT")}),o.push("END:VCALENDAR"),o.map(pt).join(`\r
`)}async function Ye(a,e,o){let n=mt(a,o),t=oe();if(t){let i=document.createElement("form");i.method="POST",i.action=t.replace(/\/$/,"")+"/ics",i.target="_blank",i.style.display="none";let m=document.createElement("textarea");m.name="ics",m.value=n,i.appendChild(m),document.body.appendChild(i),i.submit(),i.remove();return}let s=new File([n],e,{type:"text/calendar"});if(navigator.canShare&&navigator.canShare({files:[s]}))try{await navigator.share({files:[s],title:o});return}catch(i){if(i&&i.name==="AbortError")return}let r=URL.createObjectURL(s),d=document.createElement("a");d.href=r,d.download=e,document.body.appendChild(d),d.click(),d.remove(),setTimeout(()=>URL.revokeObjectURL(r),4e3)}var Qe=new Set(["fazer","criar","postar","subir","publicar","gravar","post","postagem","publicacao","publica\xE7\xE3o","o","a","um","uma","no","na","do","da","de","dos","das","pro","pra","para","feed","reels","reel","story","stories","storie","storys","carrossel","carosel","carossel","instagram","insta","ig","sobre","com","e"]),ft=[[/\bcouve flor\b/gi,"couve-flor"],[/\bpromocao\b/gi,"promo\xE7\xE3o"],[/\bpromoçao\b/gi,"promo\xE7\xE3o"],[/\bacao\b/gi,"a\xE7\xE3o"],[/\bpao\b/gi,"p\xE3o"],[/\blimao\b/gi,"lim\xE3o"],[/\bmamao\b/gi,"mam\xE3o"],[/\bmelao\b/gi,"mel\xE3o"],[/\bfeijao\b/gi,"feij\xE3o"],[/\bmaca\b/gi,"ma\xE7\xE3"],[/\bmaça\b/gi,"ma\xE7\xE3"],[/\babobora\b/gi,"ab\xF3bora"],[/\bpessego\b/gi,"p\xEAssego"],[/\bmaracuja\b/gi,"maracuj\xE1"],[/\babacate\b/gi,"abacate"],[/\babacaxi\b/gi,"abacaxi"],[/\bcafe\b/gi,"caf\xE9"],[/\bpromo\b/gi,"promo"],[/\bblack friday\b/gi,"Black Friday"],[/\bnatal\b/gi,"Natal"],[/\bano novo\b/gi,"Ano Novo"],[/\bdia das maes\b/gi,"Dia das M\xE3es"],[/\bdia dos pais\b/gi,"Dia dos Pais"],[/\bhamburguer\b/gi,"hamb\xFArguer"],[/\bhamburguers\b/gi,"hamb\xFArgueres"],[/\blancamento\b/gi,"lan\xE7amento"],[/\bcolecao\b/gi,"cole\xE7\xE3o"],[/\bvideo\b/gi,"v\xEDdeo"],[/\bsabado\b/gi,"s\xE1bado"],[/\bpromocoes\b/gi,"promo\xE7\xF5es"]],Xe=a=>a.toLowerCase().replace(/[.,:;!]+$/,""),bt={feed:"Post no feed",carrossel:"Carrossel",reels:"Reels",story:"Stories"},Ze=/^(post no feed|carrossel|reels|stories|story)\s+—\s+/i;function et(a,e=null){let o=String(a||"").replace(/\s+/g," ").trim();if(!o)return o;let n=bt[e];if(!n)return we(ye(o));if(Ze.test(o))return`${n} \u2014 ${we(ye(o.replace(Ze,"")))}`;let t=o.split(" ");for(;t.length>1&&Qe.has(Xe(t[0]));)t.shift();return o=t.join(" ").replace(/\s+(no|pro|pra|para o)\s+(instagram|insta|ig|feed)\s*$/i,"").trim(),Qe.has(Xe(o))?n:`${n} \u2014 ${we(ye(o))}`}var ye=a=>{for(let[e,o]of ft)a=a.replace(e,o);return a},we=a=>a&&a.charAt(0).toLocaleUpperCase("pt-BR")+a.slice(1);var vt=[[/pura vida|hortifruti|jg garcia/i,"hortifruti: frutas, verduras e legumes frescos"],[/bbq|burger|hamb/i,"hamburgueria e churrasco (BBQ)"],[/multimarcas|moda|roupa/i,"loja de roupas multimarcas"],[/festa/i,"loja de artigos e decora\xE7\xE3o de festas"]];function ke(a){if(a?.niche)return a.niche;let e=vt.find(([o])=>o.test(a?.name||""));return e?e[1]:""}function ht(){let a=x();return l.state.companies.map(e=>{let o=l.state.events.filter(r=>r.companyId===e.id&&b[r.type]?.kind==="post"),n=o.filter(r=>r.date<=a&&(r.status==="feito"||r.date<a)).map(r=>r.date).sort(),t=o.filter(r=>r.date>=a&&r.status!=="feito").map(r=>r.date).sort(),s=n[n.length-1]||"";return{onlyFor:e.notifyOnly||null,name:e.name,niche:ke(e)||"pequena empresa local",lastPost:s,nextPost:t[0]||"",daysSincePost:s?Ae(s,a):null}})}function $t(){let a=x(),e=new Date,o=e.getHours()*60+e.getMinutes(),n=l.state.events.filter(s=>s.status!=="feito"&&s.date>=a).sort((s,r)=>(s.date+(s.time||"")).localeCompare(r.date+(r.time||""))),t=l.state.events.filter(s=>s.status!=="feito"&&s.time&&(s.date<a||s.date===a&&Z(s.time)<o)).length;return{arch:y.arch,profession:y.profession||"",entity:y.entity.many,tips:S()?[]:(y.tips||[]).slice(0,12),next:n.slice(0,5).map(s=>({date:s.date,time:s.time||"",label:b[s.type]?.label||"Compromisso",title:(s.title||"").slice(0,60),who:(s.assignees||[])[0]||""})),late:t}}var tt=null,at="";function Ft(){l.mode!=="cloud"||!oe()||!l.ready||(clearTimeout(tt),tt=setTimeout(()=>{let a=ht(),e=$t(),o=JSON.stringify([a,e]);o!==at&&ve("/coach",{companies:a,work:e}).then(()=>at=o).catch(()=>{})},4e3))}var Jt=()=>ve("/coach-test",{});var gt={Empresa:"Pura Vida",Local:"Hospital Santa Clara",Turma:"9\xBA ano B",Obra:"Residencial Aurora",Cliente:"Maria Silva",Setor:"Linha de produ\xE7\xE3o 2",Unidade:"3\xBA Batalh\xE3o",Projeto:"Novo site",Plataforma:"iFood",\u00C1rea:"Talh\xE3o 3",Mat\u00E9ria:"Matem\xE1tica"};function sa(){let a=l.companiesSorted(),e=x(),o=Ce(e),n=_(o,6);return`
  <header class="hdr">
    <div class="hdr__row">
      <div class="hdr__titles"><p class="hdr__eyebrow">${a.length} ${a.length===1?E(!1,!0):E(!0,!0)}</p><h1>${E(!0)}</h1></div>
      <div class="hdr__actions"><button class="btn btn--primary btn--sm" data-action="new-company">${p("plus",16)} ${z()}</button></div>
    </div>
  </header>
  <div class="page">
    ${a.length?"":be(`${Pe()} ${E(!1,!0)} ainda`,`Cadastre ${y.entity.hint} com nome, cor e foto. Assim cada compromisso fica organizado no lugar certo.`,`<button class="btn btn--primary" data-action="new-company">${p("plus",18)} Cadastrar ${E(!1,!0)}</button>`)}
    <div class="colist">
      ${a.map(t=>{let s=l.eventsBetween(o,n,{companyId:t.id}),r=s.filter(m=>Be(m.type)).length,d=s.filter(m=>m.type==="captacao").length,i=l.state.events.filter(m=>m.companyId===t.id&&m.date>=e&&m.status!=="feito").sort((m,$)=>(m.date+m.time).localeCompare($.date+$.time))[0];return`<button class="cocard" style="--cc:${t.color};--cc-soft:${H(t.color,.1)}" data-action="open-company" data-id="${t.id}">
          <div class="cocard__top">
            ${A(t,48)}
            <div class="cocard__name"><strong>${c(t.name)}</strong>${t.instagram?`<small>${p("insta",12)} @${c(t.instagram)}</small>`:""}</div>
            ${p("right",18,"muted")}
          </div>
          <div class="cocard__stats">
            ${S()?`<span><b>${r}</b> posts</span><span><b>${d}</b> capta\xE7${d===1?"\xE3o":"\xF5es"}</span>`:`<span><b>${s.length}</b> compromisso${s.length===1?"":"s"}</span>`}<span class="muted">nesta semana</span>
          </div>
          ${i?`<div class="cocard__next">${p(b[i.type].icon,14)} <b>${c(B(i.date))}${i.time?" "+i.time:""}</b> \xB7 ${c(b[i.type].label)} \u2014 ${c(i.title||"")}</div>`:'<div class="cocard__next muted">Nada agendado</div>'}
        </button>`}).join("")}
    </div>
  </div>`}function oa(a){let e=O({className:"sheet--tall",html:st(a),onMount:o=>yt(o,a)});e.refresh=()=>l.company(a)?e.set(st(a)):e.close()}function st(a){let e=l.company(a);if(!e)return"";let o=x(),n=X(o),t=l.eventsBetween(`${n}-01`,`${n}-31`,{companyId:a}),s=l.eventsBetween(o,_(o,30),{companyId:a}),r=l.eventsBetween(_(o,-14),_(o,-1),{companyId:a}).reverse(),d=v=>t.filter(h=>v.includes(h.type)).length,i=t.filter(v=>v.status==="feito").length,m="",$=s.map(v=>{let h=v.date!==m?`<h4 class="dayhead">${c(U(v.date))}</h4>`:"";return m=v.date,h+fe(v)}).join("");return`
  ${M("",{right:l.canEdit("companies",e)?'<button class="btn-text" data-act="edit">Editar</button>':""})}
  <div class="cohero" style="--cc:${e.color};--cc-soft:${H(e.color,.14)}">
    ${A(e,72,20)}
    <h2>${c(e.name)}</h2>
    ${e.instagram?`<a class="cohero__ig" href="https://instagram.com/${encodeURIComponent(e.instagram)}" target="_blank" rel="noopener">${p("insta",14)} @${c(e.instagram)}</a>`:""}
    <div class="cohero__btns">
      <button class="btn btn--primary btn--sm" data-act="new">${p("plus",16)} Evento</button>
      ${y.clientLike?`<button class="btn btn--soft btn--sm" data-act="clientview">${p("eye",16)} P\xE1gina do cliente</button>`:""}
      <button class="btn btn--soft btn--sm" data-act="share">${p("share",16)} Enviar</button>
    </div>
  </div>

  <div class="page page--sheet">
    <section class="block">
      <h2 class="block__title">${c(qe(n))}</h2>
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
      ${$||be("Nada agendado","Toque em + para marcar o primeiro compromisso aqui.")}
    </section>

    ${r.length?`<section class="block">
      <h2 class="block__title">\xDAltimas 2 semanas</h2>
      ${r.map(v=>fe(v,{showDate:!0,compact:!0})).join("")}
    </section>`:""}
  </div>`}function yt(a,e){let o=a.el;(o.querySelector('[data-act="edit"]')||{}).onclick=()=>_e(e),o.querySelector('[data-act="new"]').onclick=async()=>{let{openEventEditor:n}=await import("./c-NPPFPZCA.js");n({companyId:e})},o.querySelector('[data-act="share"]').onclick=()=>Se(e),o.querySelector('[data-act="clientview"]').onclick=()=>wt(e)}function _e(a=null,e=null){let o=a?l.company(a):null,n=l.state.companies.map(d=>d.color),t=o?{...o}:{id:D("c_"),name:"",color:ae.find(d=>!n.includes(d))||ae[0],logo:null,instagram:"",address:"",contact:"",notes:"",shareToken:null},s=()=>`
    ${M(o?`Editar ${E(!1,!0)}`:`${z()} ${E(!1,!0)}`,{left:'<button class="btn-text" data-close>Cancelar</button>',right:'<button class="btn btn--primary btn--sm" data-save>Salvar</button>'})}
    <form class="form" onsubmit="return false">
      <div class="logopick">
        <div data-preview>${A({...t,name:t.name||"?"},88,24)}</div>
        <div class="logopick__btns">
          <label class="btn btn--soft btn--sm">${p("image",16)} ${t.logo?"Trocar logo":"Enviar logomarca"}<input type="file" accept="image/*" data-file hidden></label>
          ${t.logo?'<button type="button" class="btn-text btn-text--sm" data-rmlogo>Remover logo</button>':'<p class="fhelp">Opcional. Sem logo, usamos as iniciais na cor escolhida.</p>'}
        </div>
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-name">Nome (${c(y.entity.hint)})</label>
        <input id="c-name" class="input" name="name" value="${c(t.name)}" placeholder="Ex.: ${c(gt[y.entity.one]||"Pura Vida")}" autocomplete="off" maxlength="60">
      </div>
      <div class="fgroup">
        <label class="flabel">Cor no calend\xE1rio</label>
        <div class="palette">
          ${ae.map(d=>`<button type="button" class="swatch${t.color===d?" is-on":""}" style="background:${d}" data-color="${d}" aria-label="Cor ${d}">${p("check",16)}</button>`).join("")}
          <label class="swatch swatch--custom" title="Outra cor"><input type="color" value="${t.color}" data-customcolor>${p("plus",16)}</label>
        </div>
      </div>
      <div class="fgroup"${S()?"":" hidden"}>
        <label class="flabel" for="c-ig">Instagram</label>
        <div class="input-prefix"><span>@</span><input id="c-ig" class="input" name="instagram" value="${c(t.instagram||"")}" placeholder="usuario" autocomplete="off" autocapitalize="none"></div>
      </div>
      <div class="fgroup"${l.team.length>1?"":" hidden"}>
        <label class="flabel">Notifica\xE7\xF5es daqui v\xE3o para</label>
        <div class="seg seg--notify">${[["",l.team.length===2?"Os dois":"Todos"],...l.team.map(d=>[d.id,d.name])].map(([d,i])=>`<button type="button" class="seg__btn${(t.notifyOnly||"")===d?" is-on":""}" data-only="${d}">${c(i)}</button>`).join("")}</div>
        <p class="fhelp">${S()?"Avisos, lembretes, \u201CJ\xE1 postou?\u201D, cobran\xE7as de atraso e dicas desta empresa":`Avisos, lembretes e cobran\xE7as de atraso ${Re()?"desta":"deste"} ${c(E(!1,!0))}`} chegam s\xF3 para quem estiver marcado.</p>
      </div>
      <div class="fgroup"${S()?"":" hidden"}>
        <label class="flabel" for="c-niche">O que a empresa faz (para as dicas)</label>
        <input id="c-niche" class="input" name="niche" value="${c(t.niche||ke(t))}" placeholder="Ex.: hamburgueria artesanal, loja de roupas femininas" autocomplete="off" maxlength="160">
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-addr">Endere\xE7o</label>
        <input id="c-addr" class="input" name="address" value="${c(t.address||"")}" placeholder="Rua, n\xFAmero \u2013 bairro" autocomplete="off">
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-contact">Contato</label>
        <input id="c-contact" class="input" name="contact" value="${c(t.contact||"")}" placeholder="${S()?"Nome e WhatsApp do respons\xE1vel":"Telefone, respons\xE1vel, hor\xE1rio\u2026"}" autocomplete="off">
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-notes">${S()?"Observa\xE7\xF5es internas":"Observa\xE7\xF5es"}</label>
        <textarea id="c-notes" class="input" name="notes" rows="3" placeholder="${S()?"Tom de voz, o que evitar, prefer\xEAncias\u2026":"Tudo o que voc\xEA precisa lembrar sobre esse lugar\u2026"}">${c(t.notes||"")}</textarea>
      </div>
      ${o?`<button type="button" class="btn btn--danger-soft btn--block" data-delete>${p("trash",18)} Excluir ${E(!1,!0)}</button>`:""}
      <div class="form__spacer"></div>
    </form>`,r=d=>{let i=d.el,m=i.querySelector("form"),$=()=>{t.name=m.name.value.trim(),t.instagram=m.instagram.value.trim().replace(/^@/,""),t.niche=m.niche.value.trim(),t.notifyOnly=i.querySelector("[data-only].is-on")?.dataset.only||null,t.address=m.address.value.trim(),t.contact=m.contact.value.trim(),t.notes=m.notes.value.trim()},v=()=>i.querySelector("[data-preview]").innerHTML=A({...t,name:m.name.value||"?"},88,24);m.name.addEventListener("input",v),i.querySelectorAll("[data-only]").forEach(k=>k.onclick=()=>i.querySelectorAll("[data-only]").forEach(u=>u.classList.toggle("is-on",u===k))),i.querySelectorAll("[data-color]").forEach(k=>k.onclick=()=>{t.color=k.dataset.color,i.querySelectorAll("[data-color]").forEach(u=>u.classList.toggle("is-on",u===k)),v()}),i.querySelector("[data-customcolor]").oninput=k=>{t.color=k.target.value,i.querySelectorAll("[data-color]").forEach(u=>u.classList.remove("is-on")),v()},i.querySelector("[data-file]").onchange=async k=>{let u=k.target.files[0];if(u)try{$(),t.logo=await Le(u,160),d.set(s())}catch{w("N\xE3o foi poss\xEDvel ler essa imagem")}};let h=i.querySelector("[data-rmlogo]");h&&(h.onclick=()=>{$(),t.logo=null,d.set(s())});let R=i.querySelector("[data-delete]");R&&(R.onclick=async()=>{let k=l.state.events.filter(f=>f.companyId===t.id);await j({title:`Excluir ${t.name}?`,text:k.length?`Os ${k.length} compromissos daqui tamb\xE9m ser\xE3o apagados e o link do cliente deixar\xE1 de funcionar.`:"O link do cliente deixar\xE1 de funcionar.",ok:"Excluir",danger:!0})&&(await l.removeMany("events",k.map(f=>f.id)),await l.remove("companies",t.id),d.close(),w("Exclu\xEDdo"))}),i.querySelector("[data-save]").onclick=async()=>{if($(),!t.name)return m.name.focus(),w("Digite o nome");await l.upsert("companies",{...t}),d.close(),w(o?"Atualizado":"Cadastrado"),e&&e(l.company(t.id))}};O({className:"sheet--tall",html:s(),onMount:r})}async function Se(a){let e=l.company(a),o=l.mode==="cloud",n="";o?(await l.ensureShareToken(e),await l.publishCompany(a),n=Oe(l.company(a).shareToken)):n=Me(await De(ce(e,l.state.events,{maxFuture:90})));let t=`
    ${M("Link do cliente")}
    <div class="share">
      <div class="share__co">${A(e,56)}<div><strong>${c(e.name)}</strong><small>v\xEA somente o pr\xF3prio cronograma</small></div></div>
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
    </div>`;O({html:t,onMount:s=>{let r=s.el;r.querySelector("[data-copy]").onclick=async()=>{try{await navigator.clipboard.writeText(n),w("Link copiado")}catch{r.querySelector("[data-link]").select(),w("Selecione e copie o link")}},r.querySelector("[data-sharebtn]").onclick=async()=>{let i=`Ol\xE1! Este \xE9 o cronograma de conte\xFAdo da ${e.name}. Por aqui voc\xEAs acompanham tudo o que est\xE1 planejado: posts, stories, reels e capta\xE7\xF5es.`;if(navigator.share)try{await navigator.share({title:`Cronograma \xB7 ${e.name}`,text:i,url:n})}catch{}else await navigator.clipboard?.writeText(`${i}
${n}`),w("Mensagem copiada")};let d=r.querySelector("[data-revoke]");d&&(d.onclick=async()=>{await j({title:"Gerar um novo link?",text:"Quem tiver o link antigo n\xE3o conseguir\xE1 mais ver o cronograma.",ok:"Gerar novo link",danger:!0})&&(await l.regenerateShareToken(l.company(a)),s.close(),Se(a))})}})}async function wt(a){let e=l.company(a);if(!e)return;let{showClient:o}=await import("./c-YGRRTMLY.js"),{sanitizePayload:n}=await import("./c-UL2LDEZV.js"),t=n(ce(e,l.state.events)),s=document.createElement("div");s.className="client-preview",s.innerHTML=`<div class="client-preview__bar"><button class="btn btn--soft btn--sm" data-closepv>${p("left",16)} Voltar</button><span>Assim o cliente v\xEA</span><button class="btn btn--primary btn--sm" data-sendpv>${p("share",16)} Enviar</button></div><div class="client-preview__body"></div>`,document.body.appendChild(s),document.body.classList.add("has-sheet"),o(s.querySelector(".client-preview__body"),t,{canGoBack:!1,preview:!0});let r=()=>{s.remove(),document.body.classList.toggle("has-sheet",!!document.querySelector(".sheet-wrap"))};s.querySelector("[data-closepv]").onclick=r,s.querySelector("[data-sendpv]").onclick=()=>{r(),Se(a)}}function ka(a){let e=O({html:ot(a),className:"sheet--tall",onMount:o=>kt(o,a)});e.refresh=()=>{if(!l.event(a))return e.close();e.set(ot(a))}}function ot(a){let e=l.event(a);if(!e)return"";let o=l.company(e.companyId),n=o?.color||"#666",t=ue.find(i=>i.v===(e.reminder??30)),s=e.seriesId?l.state.events.filter(i=>i.seriesId===e.seriesId).length:0,r=l.canEdit("events",e),d=l.member(l.ownerOf("events",e))?.name||"o parceiro";return`
  ${M("",{right:r?'<button class="btn-text" data-act="edit">Editar</button>':""})}
  <div class="detail">
    <div class="detail__hero" style="--cc:${n};--cc-soft:${H(n,.12)}">
      <div class="detail__co">${A(o,40)}<div><strong>${c(o?.name||"Sem "+E(!1,!0))}</strong>${o?.instagram?`<small>@${c(o.instagram)}</small>`:""}</div>${Fe(e.type,{solid:!0})}</div>
      <h2><span class="pfrow">${ze(e,24)}</span>${c(e.title||b[e.type].label)}</h2>
      <p class="detail__when">${p("calendar",15)} ${c(B(e.date))}, ${c(Ne(e.date).split(", ")[1])} \xB7 ${p("clock",15)} ${c(Je(e))}</p>
    </div>

    ${r?"":`<p class="detail__lock">${p("eye",14)} Cadastrado por ${c(d)} \u2014 voc\xEA s\xF3 pode ver. Use \u201CDuplicar\u201D para criar uma c\xF3pia sua.</p>`}
    <div class="seg seg--status"${r?"":" hidden"}>
      ${pe.map(i=>`<button class="seg__btn${e.status===i?" is-on":""} st-${i}" data-status="${i}">${i==="feito"?p("check",14):""}${de[i].label}</button>`).join("")}
    </div>

    <ul class="rows">
      ${ie()?"":`<li><span class="rows__k">${p("users",16)} Respons\xE1vel</span><span class="rows__v">${(e.assignees||[]).map(i=>F(i,22)).join("")} ${c(se(e.assignees))}</span></li>`}
      ${e.location?`<li><span class="rows__k">${p("pin",16)} Local</span><a class="rows__v link" href="https://maps.apple.com/?q=${encodeURIComponent(e.location)}" target="_blank" rel="noopener">${c(e.location)}</a></li>`:""}
      ${b[e.type].kind!=="post"||e.duration?`<li><span class="rows__k">${p("clock",16)} Dura\xE7\xE3o</span><span class="rows__v">${c(re(te(e)))}</span></li>`:""}
      <li><span class="rows__k">${p("bell",16)} Lembrete</span><span class="rows__v">${c(t?.label||"\u2014")}</span></li>
      ${s?`<li><span class="rows__k">${p("repeat",16)} Repeti\xE7\xE3o</span><span class="rows__v">${s} eventos na s\xE9rie</span></li>`:""}
      ${y.clientLike?`<li><span class="rows__k">${p(e.visibleToClient===!1?"eyeoff":"eye",16)} Cliente</span><span class="rows__v">${e.visibleToClient===!1?"N\xE3o aparece para o cliente":"Aparece no link do cliente"}</span></li>`:""}
    </ul>

    ${e.description?`<div class="textbox"><h4>${c(y.form.desc[0])}</h4><p>${c(e.description)}</p></div>`:""}
    ${e.internalNote?`<div class="textbox textbox--note"><h4>${p("eyeoff",13)} ${c(y.form.note[0])} (${rt()})</h4><p>${c(e.internalNote)}</p></div>`:""}

    <div class="actions">
      <button data-act="ics">${p("bell",20)}<span>Lembrete no iPhone</span></button>
      ${r?`<button data-act="tomorrow">${p("right",20)}<span>Passar p/ amanh\xE3</span></button>`:""}
      <button data-act="dup">${p("copy",20)}<span>Duplicar</span></button>
      ${r?`<button data-act="del" class="is-danger">${p("trash",20)}<span>Excluir</span></button>`:""}
    </div>
    <p class="detail__meta">Criado por ${c(l.member(e.createdBy)?.name||"\u2014")}${e.updatedAt?" \xB7 atualizado "+new Date(e.updatedAt).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):""}</p>
  </div>`}function kt(a,e){let o=a.el;o.querySelectorAll("[data-status]").forEach(t=>t.onclick=async()=>{let s=l.event(e),r=t.getBoundingClientRect();if(await l.upsert("events",{...s,status:t.dataset.status}),t.dataset.status==="feito"&&s.status!=="feito"&&l.event(e)?.status==="feito"){let d=s.date===x()?l.eventsOn(s.date,{person:l.me}).filter(i=>i.status!=="feito").length:null;w(Ge({el:r,left:d}))}});let n=(t,s)=>{let r=o.querySelector(`[data-act="${t}"]`);r&&(r.onclick=s)};n("edit",()=>nt({id:e})),n("dup",async()=>{let s={...l.event(e),id:D("e_"),status:"pendente",seriesId:null,createdAt:null,createdBy:null};await l.upsert("events",s),a.close(),w(`${le()} duplicado`),nt({id:s.id})}),n("tomorrow",async()=>{let t=l.event(e);await xt(t,{date:_(t.date,1)})&&(await l.upsert("events",{...t,date:_(t.date,1)}),w("Movido para "+B(_(t.date,1)).toLowerCase(),{action:"Desfazer",onAction:()=>l.upsert("events",{...l.event(e),date:t.date})}))}),n("ics",()=>{let t=l.event(e);Ye([t],`${b[t.type].label}-${t.date}.ics`,Y.appName)}),n("del",()=>it(e,a))}async function it(a,e){let o=l.event(a),n=[a];if(o.seriesId){let s=l.state.events.filter(r=>r.seriesId===o.seriesId&&r.date>=o.date).map(r=>r.id);if(s.length>1){let r=await P({title:`Excluir ${N()} repetido`,options:[{label:"S\xF3 este",value:"one",danger:!0},{label:`Este e os pr\xF3ximos (${s.length})`,value:"next",danger:!0}]});if(!r)return;r==="next"&&(n=s)}else if(!await j({title:`Excluir este ${N()}?`,ok:"Excluir",danger:!0}))return}else if(!await j({title:`Excluir este ${N()}?`,text:l.team.length>1?"Ele some da agenda de todos.":"Ele some da sua agenda.",ok:"Excluir",danger:!0}))return;let t=n.map(s=>({...l.event(s)}));await l.removeMany("events",n),e&&e.close(),w(n.length>1?`${n.length} ${N()}s exclu\xEDdos`:`${le()} exclu\xEDdo`,{action:"Desfazer",onAction:()=>l.upsertMany("events",t),ms:4500})}function nt({id:a=null,date:e=null,companyId:o=null,type:n=null,time:t=null,assignees:s=null}={}){let r=a?l.event(a):null;if(r&&!l.canEdit("events",r)){l._denied("events",r);return}let d=l.companiesSorted(),i=n||(V.includes("feed")?"feed":V[0]),m=r?JSON.parse(JSON.stringify(r)):{id:D("e_"),type:i,companyId:o||C.monthCompany||(d.length===1?d[0].id:null),title:"",date:e||(C.tab==="mes"?C.monthSel:C.date)||x(),time:t||b[i].best[0]||"12:00",duration:["shoot","meeting","work","other"].includes(b[i].kind)?b[i].dur:null,assignees:s||(C.person!=="all"?[C.person]:l.me?[l.me]:[]),location:"",description:"",internalNote:"",reminder:30,visibleToClient:b[i].client,status:"pendente"},$=r?JSON.parse(JSON.stringify(r)):null,v={mode:"none",until:_(m.date,28)};return O({className:"sheet--tall",html:ct(m,!!r,v),onMount:R=>_t(R,m,$,v)})}function xe(a,e){let o=(a.assignees||[]).includes(e.id);return a.notifyPartner===!1?o?`Sem aviso agora. Como ${e.name} \xE9 respons\xE1vel, ele ainda recebe os lembretes do hor\xE1rio.`:`${e.name} n\xE3o recebe aviso nem lembretes deste evento. Fica s\xF3 na agenda.`:`${e.name} recebe o aviso de que voc\xEA marcou e os lembretes do hor\xE1rio.`}var N=()=>S()?"evento":"compromisso",le=()=>S()?"Evento":"Compromisso",ie=()=>l.team.length<2,rt=()=>ie()?"s\xF3 voc\xEA v\xEA":`s\xF3 ${l.team.length>2?"a equipe":"voc\xEAs"} veem`,ne=a=>["shoot","meeting","work","other"].includes(b[a].kind),W=a=>["shoot","meeting"].includes(b[a].kind);function ct(a,e,o){let n=l.companiesSorted();return`
  ${M(e?`Editar ${N()}`:`Novo ${N()}`,{left:'<button class="btn-text" data-close>Cancelar</button>',right:'<button class="btn btn--primary btn--sm" data-save>Salvar</button>'})}
  <form class="form" data-editor onsubmit="return false">
    <div class="fgroup">
      <label class="flabel">O que \xE9?</label>
      <div class="typegrid">
        ${V.map(t=>`<button type="button" class="typebtn tbadge--${t}${a.type===t?" is-on":""}"${je(t)} data-type="${t}">${p(b[t].icon,20)}<span>${b[t].label}</span></button>`).join("")}
      </div>
    </div>

    <div class="fgroup">
      <label class="flabel">${E()}${S()?"":' <em class="tag">opcional</em>'}</label>
      <div class="cogrid">
        ${n.map(t=>`<button type="button" class="cobtn${a.companyId===t.id?" is-on":""}" style="--cc:${t.color}" data-company="${t.id}">${A(t,26,7)}<span>${c(t.name)}</span></button>`).join("")}
        <button type="button" class="cobtn cobtn--add" data-newco>${p("plus",18)}<span>${z()} ${E(!1,!0)}</span></button>
      </div>
    </div>

    ${V.some(t=>b[t].kind==="post")||b[a.type].kind==="post"?`<div class="fgroup" data-when="net" ${b[a.type].kind==="post"?"":"hidden"}>
      <label class="flabel">Onde vai postar?</label>
      <div class="netgrid">${He.map(t=>{let s=Ve(t);return s?`<button type="button" class="netbtn${(a.platform||"instagram")===t?" is-on":""}" data-net="${t}"><span class="pf" style="width:22px;height:22px">${s.svg}</span><span>${c(s.name.replace(" (Twitter)",""))}</span></button>`:""}).join("")}</div>
    </div>`:""}

    <div class="fgroup">
      <label class="flabel" for="f-title">T\xEDtulo</label>
      <input id="f-title" class="input" name="title" value="${c(a.title)}" placeholder="${c(b[a.type].placeholder)}" autocomplete="off" maxlength="120">
    </div>

    <div class="fgroup row2">
      <div><label class="flabel" for="f-date">Dia</label><input id="f-date" class="input" type="date" name="date" value="${a.date}" required></div>
      <div><label class="flabel" for="f-time">Hor\xE1rio</label><input id="f-time" class="input" type="time" name="time" value="${a.time||""}" step="300"></div>
    </div>

    <div class="fgroup" data-when="duration" ${ne(a.type)?"":"hidden"}>
      <label class="flabel" for="f-dur">Dura\xE7\xE3o</label>
      <select id="f-dur" class="input" name="duration">
        ${Ue.map(t=>`<option value="${t}"${(a.duration||b[a.type].dur)===t?" selected":""}>${re(t)}</option>`).join("")}
      </select>
    </div>

    <div data-hint></div>

    <div class="fgroup"${ie()?" hidden":""}>
      <label class="flabel">Quem vai fazer?</label>
      <div class="whogrid">
        ${l.team.map(t=>`<button type="button" class="whobtn${(a.assignees||[]).includes(t.id)?" is-on":""}" style="--mc:${t.color}" data-who="${t.id}">${F(t.id,30)}<span>${c(t.name)}</span><i class="whobtn__check">${p("check",14)}</i></button>`).join("")}
      </div>
      <p class="fhelp">${l.team.length>2?"Marque todos que v\xE3o juntos.":"Marque os dois se forem juntos."}</p>
      ${l.team.filter(t=>t.id!==l.me).map(t=>`<label class="list__row notifyrow"><span><b>${p("bell",15)} Avisar ${t.name==="Matheus"||t.name==="Henrique"?"o ":""}${c(t.name)}</b><small data-notifyhelp>${xe(a,t)}</small></span><input type="checkbox" class="switch" name="notifyPartner" ${a.notifyPartner!==!1?"checked":""}></label>`).join("")}
    </div>

    <div class="fgroup" data-when="location" ${W(a.type)?"":"hidden"}>
      <label class="flabel" for="f-loc">Local</label>
      <input id="f-loc" class="input" name="location" value="${c(a.location||"")}" placeholder="Endere\xE7o ou nome do lugar" autocomplete="off">
      <button type="button" class="btn-text btn-text--sm" data-useaddr hidden>${p("pin",14)} Usar o endere\xE7o cadastrado</button>
    </div>

    <div class="fgroup">
      <label class="flabel" for="f-desc">${c(y.form.desc[0])}${y.clientLike?` <em class="tag">${p("eye",12)} cliente v\xEA</em>`:""}</label>
      <textarea id="f-desc" class="input" name="description" rows="3" placeholder="${c(y.form.desc[1])}">${c(a.description||"")}</textarea>
    </div>
    <div class="fgroup">
      <label class="flabel" for="f-note">${c(y.form.note[0])} <em class="tag tag--note">${p("eyeoff",12)} ${rt()}</em></label>
      <textarea id="f-note" class="input" name="internalNote" rows="2" placeholder="${c(y.form.note[1])}">${c(a.internalNote||"")}</textarea>
    </div>

    <div class="list">
      <label class="list__row"><span>${p("bell",18)} Lembrete</span>
        <select name="reminder">${ue.map(t=>`<option value="${t.v}"${(a.reminder??30)===t.v?" selected":""}>${t.label}</option>`).join("")}</select>
      </label>
      ${e?"":`<label class="list__row"><span>${p("repeat",18)} Repetir</span>
        <select name="repeat">${me.map(t=>`<option value="${t.v}"${o.mode===t.v?" selected":""}>${t.label}</option>`).join("")}</select>
      </label>
      <label class="list__row" data-when="until" hidden><span>${p("calendar",18)} At\xE9</span>
        <input type="date" name="until" value="${o.until}">
      </label>`}
      <label class="list__row"${y.clientLike?"":" hidden"}><span>${p("eye",18)} Aparece no link do cliente</span>
        <input type="checkbox" class="switch" name="visibleToClient" ${a.visibleToClient!==!1?"checked":""}>
      </label>
      ${e?`<label class="list__row"><span>${p("check",18)} Status</span>
        <select name="status">${pe.map(t=>`<option value="${t}"${a.status===t?" selected":""}>${de[t].label}</option>`).join("")}</select>
      </label>`:""}
    </div>

    ${e?`<button type="button" class="btn btn--danger-soft btn--block" data-delete>${p("trash",18)} Excluir ${N()}</button>`:""}
    <div class="form__spacer"></div>
  </form>`}function _t(a,e,o,n){let t=a.el,s=t.querySelector("[data-editor]"),r=u=>t.querySelector(u),d=()=>{let u=r("[data-hint]");u.innerHTML=Et(e,!o),u.querySelectorAll("[data-settime]").forEach(f=>f.onclick=()=>{e.time=f.dataset.settime,s.time.value=e.time,d()}),u.querySelectorAll("[data-setwho]").forEach(f=>f.onclick=()=>{e.assignees=[f.dataset.setwho],t.querySelectorAll("[data-who]").forEach(g=>g.classList.toggle("is-on",e.assignees.includes(g.dataset.who))),d()})},i=()=>{t.querySelector('[data-when="duration"]').hidden=!ne(e.type);let u=t.querySelector('[data-when="net"]');u&&(u.hidden=b[e.type].kind!=="post"),t.querySelector('[data-when="location"]').hidden=!W(e.type);let f=l.company(e.companyId),g=r("[data-useaddr]");g.hidden=!(f&&f.address&&s.location.value!==f.address);let q=t.querySelector('[data-when="until"]');q&&(q.hidden=n.mode==="none")};t.querySelectorAll("[data-type]").forEach(u=>u.onclick=()=>{let f=e.type;if(e.type=u.dataset.type,t.querySelectorAll("[data-type]").forEach(g=>g.classList.toggle("is-on",g===u)),s.title.placeholder=b[e.type].placeholder,(!o||f!==e.type)&&(e.duration=ne(e.type)?b[e.type].dur:null,s.duration.value=String(b[e.type].dur),o||(e.visibleToClient=b[e.type].client,s.visibleToClient.checked=e.visibleToClient)),W(e.type)&&!s.location.value){let g=l.company(e.companyId);g?.address&&(s.location.value=g.address,e.location=g.address)}i(),d()}),t.querySelectorAll("[data-company]").forEach(u=>u.onclick=()=>{e.companyId=u.dataset.company,t.querySelectorAll("[data-company]").forEach(g=>g.classList.toggle("is-on",g===u));let f=l.company(e.companyId);W(e.type)&&f?.address&&!s.location.value&&(s.location.value=f.address,e.location=f.address),i()}),r("[data-newco]").onclick=()=>{_e(null,u=>{e.companyId=u.id,$(),a.set(ct(e,!!o,n))})},t.querySelectorAll("[data-who]").forEach(u=>u.onclick=()=>{let f=u.dataset.who;e.assignees=e.assignees.includes(f)?e.assignees.filter(T=>T!==f):[...e.assignees,f],u.classList.toggle("is-on",e.assignees.includes(f)),d();let g=t.querySelector("[data-notifyhelp]"),q=l.team.find(T=>T.id!==l.me);g&&q&&(g.textContent=xe(e,q))});let m=t.querySelector('input[name="notifyPartner"]');m&&(m.onchange=()=>{e.notifyPartner=m.checked;let u=t.querySelector("[data-notifyhelp]"),f=l.team.find(g=>g.id!==l.me);u&&f&&(u.textContent=xe(e,f))}),r("[data-useaddr]").onclick=()=>{let u=l.company(e.companyId);s.location.value=u.address,e.location=u.address,i()},t.querySelectorAll("[data-net]").forEach(u=>u.onclick=()=>{e.platform=u.dataset.net,t.querySelectorAll("[data-net]").forEach(f=>f.classList.toggle("is-on",f===u))});let $=()=>{e.title=et(s.title.value.trim(),e.type),b[e.type].kind==="post"&&!e.platform&&(e.platform="instagram"),b[e.type].kind!=="post"&&(e.platform=null),e.date=s.date.value,e.time=s.time.value||"",e.duration=ne(e.type)?Number(s.duration.value):null,e.location=W(e.type)?s.location.value.trim():"",e.description=s.description.value.trim(),e.internalNote=s.internalNote.value.trim(),e.reminder=Number(s.reminder.value),e.visibleToClient=s.visibleToClient.checked,s.status&&(e.status=s.status.value),s.repeat&&(n.mode=s.repeat.value),s.until&&(n.until=s.until.value)};s.addEventListener("input",()=>{$(),i()}),s.addEventListener("change",()=>{$(),i(),d()});let v=r("[data-delete]");v&&(v.onclick=()=>it(e.id,null).then(()=>!l.event(e.id)&&a.close())),r("[data-save]").onclick=async()=>{if($(),!h){if(!e.companyId&&S()){w("Escolha a empresa"),t.querySelector(".cogrid").scrollIntoView({behavior:"smooth",block:"center"});return}if(!e.date)return w("Escolha o dia");if(ie()&&l.me&&!e.assignees.length&&(e.assignees=[l.me]),!(!e.assignees.length&&!await j({title:"Ningu\xE9m respons\xE1vel?",text:`Este ${N()} ficar\xE1 sem respons\xE1vel. Deseja salvar assim mesmo?`,ok:"Salvar assim"}))&&!h){h=!0;try{await R()}finally{h=!1}}}};let h=!1,R=async()=>{if(o){if(["date","time","duration","type","assignees","companyId"].some(f=>JSON.stringify(e[f])!==JSON.stringify(o[f]))&&!await Te(e,!1,a,k))return;await At(e,o)}else if(n.mode!=="none"){let u=Tt(e.date,n),f=u.filter(T=>J({...e,date:T},{isNew:!0}).some(L=>L.level==="block")),g=u;if(f.length){let T=await P({title:`${f.length} de ${u.length} datas j\xE1 t\xEAm compromisso nesse hor\xE1rio`,text:f.slice(0,6).map(L=>U(L)).join(" \xB7 ")+(f.length>6?" \u2026":""),options:[{label:`Criar s\xF3 nas ${u.length-f.length} datas livres`,value:"free",primary:!0},{label:"Criar em todas mesmo assim",value:"all"}]});if(!T)return;if(T==="free"&&(g=u.filter(L=>!f.includes(L))),!g.length)return w("Nenhuma data livre")}let q=D("s_");await l.upsertMany("events",g.map((T,L)=>({...e,id:L===0?e.id:D("e_"),date:T,seriesId:q})),{activity:{notifyPartner:e.notifyPartner,kind:"series",count:g.length,label:`${b[e.type].label} ${me.find(T=>T.v===n.mode)?.label.toLowerCase()||""} \xE0s ${ee(e.time)}`,sample:{companyId:e.companyId,date:g[0]}}}),w(`${g.length} eventos criados`)}else{if(!await Te(e,!0,a,k))return;await l.upsert("events",{...e}),w(`${le()} salvo \u2713`)}a.close()};function k(){s.time.value=e.time||"",s.date.value=e.date,t.querySelectorAll("[data-who]").forEach(u=>u.classList.toggle("is-on",e.assignees.includes(u.dataset.who))),i(),d()}i(),d()}var Ee=420,lt=1380,I=a=>(Math.min(Math.max(a,Ee),lt)-Ee)/(lt-Ee)*100;function St(a,e){let o=a.time?he(a):null,n=[8,10,12,14,16,18,20,22];return`<div class="lanes">
    <div class="lanes__head"><strong>${l.team.length>1?`Agenda ${l.team.length===2?"dos dois":"de todos"}`:"Sua agenda"} em ${c(U(a.date))}</strong></div>
    ${l.team.map(t=>{let s=l.eventsOn(a.date,{person:t.id}).filter(i=>i.id!==a.id&&i.time),r=(a.assignees||[]).includes(t.id),d=e.some(i=>i.level==="block"&&i.person===t.id);return`<div class="lane">
        <span class="lane__who">${F(t.id,22)}</span>
        <div class="lane__track">
          ${n.map(i=>`<i class="lane__tick" style="left:${I(i*60)}%"></i>`).join("")}
          ${s.map(i=>{let m=he(i),$=l.company(i.companyId);return`<span class="lane__ev" style="left:${I(m[0])}%;width:max(4px,${I(m[1])-I(m[0])}%);background:${$?.color||"#888"}" title="${c(Ke(i))}"></span>`}).join("")}
          ${o&&r?`<span class="lane__draft${d?" is-clash":""}" style="left:${I(o[0])}%;width:max(6px,${I(o[1])-I(o[0])}%)"></span>`:""}
        </div>
      </div>`}).join("")}
    <div class="lane lane--axis"><span class="lane__who"></span><div class="lane__track">${n.map(t=>`<small style="left:${I(t*60)}%">${t}h</small>`).join("")}</div></div>
  </div>`}function Et(a,e){if(!a.date)return"";let o=J(a,{isNew:e}),n=o.filter(h=>h.level==="block"),t=o.filter(h=>h.level==="warn"),s=o.filter(h=>h.level==="info"),r=$e(a,{limit:4}),d=ge(a),i=(a.assignees||[]).length===1?a.assignees[0]:null,m=n.length&&i?l.team.find(h=>h.id!==i&&d.includes(h.id)):null,$=b[a.type],v=h=>`<li class="issue issue--${h.level}">${p(h.level==="block"?"alert":h.level==="warn"?"flag":h.code==="partner"?"user":"bulb",15)}<div><strong>${c(h.title)}</strong><p>${c(h.text)}</p></div></li>`;return`
  <section class="assist">
    <header class="assist__head">${p("sparkle",16)} Assistente</header>
    ${St(a,o)}
    ${o.length?`<ul class="issues">${[...n,...t,...s].map(v).join("")}</ul>`:a.time?`<p class="assist__ok">${p("check",15)} Hor\xE1rio livre para ${c(se(a.assignees))}, sem conflitos.</p>`:""}
    ${m?`<button type="button" class="tchip tchip--wide" data-setwho="${m.id}">${F(m.id,18)} Passar para ${c(m.name)} (est\xE1 livre)</button>`:""}
    <div class="assist__sugg">
      <p>${c($.tip)}</p>
      ${r.length?`<div class="hintbox__times">${r.map(h=>`<button type="button" class="tchip${a.time===h.time?" is-on":""}" data-settime="${h.time}">${ee(h.time)}${h.peak?"<small>pico</small>":"<small>livre</small>"}</button>`).join("")}</div>`:`<p class="muted">Nenhum hor\xE1rio livre nesse dia${(a.assignees||[]).length?" para "+c(se(a.assignees)):""}. Tente outro dia${l.team.length>1?" ou outra pessoa":""}.</p>`}
    </div>
  </section>`}async function Te(a,e,o,n){let s=J(a,{isNew:e}).filter(v=>v.level==="block");if(!s.length)return!0;let r=$e(a,{limit:2}),d=(a.assignees||[]).length===1?a.assignees[0]:null,i=d&&l.team.find(v=>v.id!==d&&ge(a).includes(v.id)),m=[...r.map(v=>({label:`Mudar para ${ee(v.time)} (livre)`,value:"time:"+v.time,primary:!0})),...i?[{label:`Passar para ${i.name} (est\xE1 livre)`,value:"who:"+i.id,primary:!r.length}]:[],{label:"Marcar mesmo assim",value:"force"}],$=await P({title:s[0].code==="duplicate"?"Isso j\xE1 est\xE1 na agenda":"J\xE1 tem compromisso nesse hor\xE1rio",bodyHtml:`<ul class="issues issues--dialog">${s.map(v=>`<li class="issue issue--block">${p("alert",15)}<div><strong>${c(v.title)}</strong><p>${c(v.text)}</p></div></li>`).join("")}</ul>`,options:m});return $?$==="force"?!0:($.startsWith("time:")&&(a.time=$.slice(5)),$.startsWith("who:")&&(a.assignees=[$.slice(4)]),n(),Te(a,e,o,n)):!1}async function xt(a,e){let o={...a,...e},n=J(o).filter(s=>s.level==="block");return n.length?await P({title:"J\xE1 tem compromisso nesse hor\xE1rio",bodyHtml:`<ul class="issues issues--dialog">${n.map(s=>`<li class="issue issue--block">${p("alert",15)}<div><strong>${c(s.title)}</strong><p>${c(s.text)}</p></div></li>`).join("")}</ul>`,options:[{label:"Mover mesmo assim",value:"force",primary:!0}]})==="force":!0}function Tt(a,e){let o=[],n=a,t=e.until&&e.until>=a?e.until:_(a,28);for(;n<=t&&o.length<150;){let s=Q(n).getDay();(e.mode==="daily"||e.mode==="weekdays"&&s>=1&&s<=5||e.mode==="weekly"&&Q(n).getDay()===Q(a).getDay())&&o.push(n),n=_(n,1)}return o}var Ct=["type","companyId","title","time","duration","assignees","location","description","internalNote","reminder","visibleToClient"];async function At(a,e){let o=Ct.filter(n=>JSON.stringify(a[n])!==JSON.stringify(e[n]));if(a.seriesId&&o.length){let n=l.state.events.filter(t=>t.seriesId===a.seriesId&&t.date>e.date);if(n.length){let t=await P({title:`${le()} repetido`,text:"Aplicar as altera\xE7\xF5es a quais eventos?",options:[{label:"S\xF3 a este",value:"one",primary:!0},{label:`A este e aos pr\xF3ximos (${n.length+1})`,value:"next"}]});if(!t)return;if(t==="next"){let s=Object.fromEntries(o.map(r=>[r,a[r]]));await l.upsertMany("events",[{...a},...n.map(r=>({...r,...s}))],{activity:{kind:"series-edit",count:n.length+1,label:`${b[a.type].label} \xB7 a partir de ${a.date.slice(8)}/${a.date.slice(5,7)}`,sample:{companyId:a.companyId,date:a.date}}}),w("S\xE9rie atualizada");return}}}await l.upsert("events",{...a}),w("Altera\xE7\xF5es salvas")}export{Ft as a,Jt as b,et as c,C as d,Nt as e,Ye as f,ka as g,nt as h,xt as i,sa as j,oa as k,_e as l};
