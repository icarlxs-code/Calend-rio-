import{a as Ve,b as Ge}from"./c-QKQCUBO2.js";import{b as me,c as We,d as V,e as te,f as be}from"./c-ZP5NGN3L.js";import{a as Fe,b as He,c as ze,d as K,h as ee,j as A,k as Je,l as Ue,m as pe,n as ue,o as M,q as D,r as k,s as P,t as F}from"./c-TLOBOSAR.js";import{a as Se}from"./c-6PVVLET6.js";import{d as Ke}from"./c-JUFNEOMC.js";import{b as d}from"./c-DWBEWQEH.js";import{a as ie,b as Ie,d as Ne,e as Oe,f as n}from"./c-TISDOUMX.js";import{a as xe}from"./c-4G6P2CFT.js";import{B as r,D as z,G as Le,c as Q,d as q,e as E,f as Ee,g as Y,k as qe,l as Ce,m as R,r as Te,t as Ae,u as H,v as B,w as le,z as j}from"./c-ZUAJ4OTH.js";import{A as de,B as Z,h,i as J,j as _,l as je,m as S,o as Me,p as U,q as De,s as x,t as Pe,u as Re,v as re,w as ce,y as X,z as Be}from"./c-TPZLRKKC.js";var fe=null;function ve({title:a="Marcado!",sub:e="",sound:o=!0}={}){if(typeof document>"u")return;document.querySelectorAll(".okfx").forEach(s=>s.remove()),clearTimeout(fe);let l=document.createElement("div");l.className="okfx",l.setAttribute("role","status"),l.innerHTML=`<div class="okfx__card">
      <svg class="okfx__ring" viewBox="0 0 120 120" aria-hidden="true">
        <circle class="okfx__halo" cx="60" cy="60" r="50"/>
        <circle class="okfx__track" cx="60" cy="60" r="46"/>
        <circle class="okfx__prog" cx="60" cy="60" r="46"/>
        <path class="okfx__check" d="M40 61.5 54 75 81 46"/>
      </svg>
      <b class="okfx__t">${r(a)}</b>${e?`<small class="okfx__s">${r(e)}</small>`:""}
      <span class="okfx__brand">${Se("simbolo",{h:18})}</span>
    </div>`,document.body.appendChild(l),requestAnimationFrame(()=>requestAnimationFrame(()=>l.classList.add("is-in"))),o&&import("./c-GSTGWK7Z.js").then(s=>s.softOk()).catch(()=>{});try{navigator.vibrate&&navigator.vibrate(12)}catch{}let t=()=>{l.classList.add("is-out"),setTimeout(()=>l.remove(),420)};fe=setTimeout(t,1500),l.addEventListener("click",()=>{clearTimeout(fe),t()})}var W=(()=>{try{return JSON.parse(localStorage.getItem("pauta.ui")||"{}")}catch{return{}}})(),C={tab:W.tab==="pessoal"?"hoje":W.tab||"hoje",space:W.space==="personal"?"personal":"work",ptab:W.ptab||"p-hoje",pMonth:null,pSel:null,pView:"mes",person:W.person||"all",date:q(),month:Y(q()),monthSel:q(),monthCompany:null,showAllTips:!1};function xt(){try{localStorage.setItem("pauta.ui",JSON.stringify({tab:C.tab,person:C.person,space:C.space,ptab:C.ptab}))}catch{}}var Qe=new Set(["fazer","criar","postar","subir","publicar","gravar","post","postagem","publicacao","publica\xE7\xE3o","o","a","um","uma","no","na","do","da","de","dos","das","pro","pra","para","feed","reels","reel","story","stories","storie","storys","carrossel","carosel","carossel","instagram","insta","ig","sobre","com","e"]),it=[[/\bcouve flor\b/gi,"couve-flor"],[/\bpromocao\b/gi,"promo\xE7\xE3o"],[/\bpromoçao\b/gi,"promo\xE7\xE3o"],[/\bacao\b/gi,"a\xE7\xE3o"],[/\bpao\b/gi,"p\xE3o"],[/\blimao\b/gi,"lim\xE3o"],[/\bmamao\b/gi,"mam\xE3o"],[/\bmelao\b/gi,"mel\xE3o"],[/\bfeijao\b/gi,"feij\xE3o"],[/\bmaca\b/gi,"ma\xE7\xE3"],[/\bmaça\b/gi,"ma\xE7\xE3"],[/\babobora\b/gi,"ab\xF3bora"],[/\bpessego\b/gi,"p\xEAssego"],[/\bmaracuja\b/gi,"maracuj\xE1"],[/\babacate\b/gi,"abacate"],[/\babacaxi\b/gi,"abacaxi"],[/\bcafe\b/gi,"caf\xE9"],[/\bpromo\b/gi,"promo"],[/\bblack friday\b/gi,"Black Friday"],[/\bnatal\b/gi,"Natal"],[/\bano novo\b/gi,"Ano Novo"],[/\bdia das maes\b/gi,"Dia das M\xE3es"],[/\bdia dos pais\b/gi,"Dia dos Pais"],[/\bhamburguer\b/gi,"hamb\xFArguer"],[/\bhamburguers\b/gi,"hamb\xFArgueres"],[/\blancamento\b/gi,"lan\xE7amento"],[/\bcolecao\b/gi,"cole\xE7\xE3o"],[/\bvideo\b/gi,"v\xEDdeo"],[/\bsabado\b/gi,"s\xE1bado"],[/\bpromocoes\b/gi,"promo\xE7\xF5es"]],Ye=a=>a.toLowerCase().replace(/[.,:;!]+$/,""),rt={feed:"Post no feed",carrossel:"Carrossel",reels:"Reels",story:"Stories"},Xe=/^(post no feed|carrossel|reels|stories|story)\s+—\s+/i;function Ze(a,e=null){let o=String(a||"").replace(/\s+/g," ").trim();if(!o)return o;let l=rt[e];if(!l)return $e(he(o));if(Xe.test(o))return`${l} \u2014 ${$e(he(o.replace(Xe,"")))}`;let t=o.split(" ");for(;t.length>1&&Qe.has(Ye(t[0]));)t.shift();return o=t.join(" ").replace(/\s+(no|pro|pra|para o)\s+(instagram|insta|ig|feed)\s*$/i,"").trim(),Qe.has(Ye(o))?l:`${l} \u2014 ${$e(he(o))}`}var he=a=>{for(let[e,o]of it)a=a.replace(e,o);return a},$e=a=>a&&a.charAt(0).toLocaleUpperCase("pt-BR")+a.slice(1);var ct={Empresa:"Pura Vida",Local:"Hospital Santa Clara",Turma:"9\xBA ano B",Obra:"Residencial Aurora",Cliente:"Maria Silva",Setor:"Linha de produ\xE7\xE3o 2",Unidade:"3\xBA Batalh\xE3o",Projeto:"Novo site",Plataforma:"iFood",\u00C1rea:"Talh\xE3o 3",Mat\u00E9ria:"Matem\xE1tica"};function Rt(){let a=n.companiesSorted(),e=q(),o=Ee(e),l=E(o,6);return`
  <header class="hdr">
    <div class="hdr__row">
      <div class="hdr__titles"><p class="hdr__eyebrow">${a.length} ${a.length===1?x(!1,!0):x(!0,!0)}</p><h1>${x(!0)}</h1></div>
      <div class="hdr__actions"><button class="btn btn--primary btn--sm" data-action="new-company">${d("plus",16)} ${U()}</button></div>
    </div>
  </header>
  <div class="page">
    ${a.length?"":ue(`${De()} ${x(!1,!0)} ainda`,`Cadastre ${_.entity.hint} com nome, cor e foto. Assim cada compromisso fica organizado no lugar certo.`,`<button class="btn btn--primary" data-action="new-company">${d("plus",18)} Cadastrar ${x(!1,!0)}</button>`)}
    <div class="colist">
      ${a.map(t=>{let s=n.eventsBetween(o,l,{companyId:t.id}),c=s.filter(m=>Pe(m.type)).length,u=s.filter(m=>m.type==="captacao").length,i=n.state.events.filter(m=>m.companyId===t.id&&m.date>=e&&m.status!=="feito").sort((m,$)=>(m.date+m.time).localeCompare($.date+$.time))[0];return`<button class="cocard" style="--cc:${t.color};--cc-soft:${z(t.color,.1)}" data-action="open-company" data-id="${t.id}">
          <div class="cocard__top">
            ${A(t,48)}
            <div class="cocard__name"><strong>${r(t.name)}</strong>${t.instagram?`<small>${d("insta",12)} @${r(t.instagram)}</small>`:""}</div>
            ${d("right",18,"muted")}
          </div>
          <div class="cocard__stats">
            ${S()?`<span><b>${c}</b> posts</span><span><b>${u}</b> capta\xE7${u===1?"\xE3o":"\xF5es"}</span>`:`<span><b>${s.length}</b> compromisso${s.length===1?"":"s"}</span>`}<span class="muted">nesta semana</span>
          </div>
          ${i?`<div class="cocard__next">${d(h[i.type].icon,14)} <b>${r(H(i.date))}${i.time?" "+i.time:""}</b> \xB7 ${r(h[i.type].label)} \u2014 ${r(i.title||"")}</div>`:'<div class="cocard__next muted">Nada agendado</div>'}
        </button>`}).join("")}
    </div>
  </div>`}function Bt(a){let e=M({className:"sheet--tall",html:et(a),onMount:o=>dt(o,a)});e.refresh=()=>n.company(a)?e.set(et(a)):e.close()}function et(a){let e=n.company(a);if(!e)return"";let o=q(),l=Y(o),t=n.eventsBetween(`${l}-01`,`${l}-31`,{companyId:a}),s=n.eventsBetween(o,E(o,30),{companyId:a}),c=n.eventsBetween(E(o,-14),E(o,-1),{companyId:a}).reverse(),u=f=>t.filter(v=>f.includes(v.type)).length,i=t.filter(f=>f.status==="feito").length,m="",$=s.map(f=>{let v=f.date!==m?`<h4 class="dayhead">${r(B(f.date))}</h4>`:"";return m=f.date,v+pe(f)}).join("");return`
  ${D("",{right:n.canEdit("companies",e)?'<button class="btn-text" data-act="edit">Editar</button>':""})}
  <div class="cohero" style="--cc:${e.color};--cc-soft:${z(e.color,.14)}">
    ${A(e,72,20)}
    <h2>${r(e.name)}</h2>
    ${e.instagram?`<a class="cohero__ig" href="https://instagram.com/${encodeURIComponent(e.instagram)}" target="_blank" rel="noopener">${d("insta",14)} @${r(e.instagram)}</a>`:""}
    <div class="cohero__btns">
      <button class="btn btn--primary btn--sm" data-act="new">${d("plus",16)} Evento</button>
      ${_.clientLike?`<button class="btn btn--soft btn--sm" data-act="clientview">${d("eye",16)} P\xE1gina do cliente</button>`:""}
      <button class="btn btn--soft btn--sm" data-act="share">${d("share",16)} Enviar</button>
    </div>
  </div>

  <div class="page page--sheet">
    <section class="block">
      <h2 class="block__title">${r(Ae(l))}</h2>
      <div class="mstats mstats--5">
        <div><b>${u(["feed","carrossel"])}</b><span>feed</span></div>
        <div><b>${u(["reels"])}</b><span>reels</span></div>
        <div><b>${u(["story"])}</b><span>stories</span></div>
        <div><b>${u(["captacao"])}</b><span>capta\xE7\xF5es</span></div>
        <div><b>${t.length?Math.round(i/t.length*100):0}%</b><span>feito</span></div>
      </div>
    </section>

    ${e.address||e.contact||e.notes?`<ul class="rows">
      ${e.address?`<li><span class="rows__k">${d("pin",16)} Endere\xE7o</span><a class="rows__v link" href="https://maps.apple.com/?q=${encodeURIComponent(e.address)}" target="_blank" rel="noopener">${r(e.address)}</a></li>`:""}
      ${e.contact?`<li><span class="rows__k">${d("user",16)} Contato</span><span class="rows__v">${r(e.contact)}</span></li>`:""}
      ${e.notes?`<li><span class="rows__k">${d("note",16)} Observa\xE7\xF5es</span><span class="rows__v">${r(e.notes)}</span></li>`:""}
    </ul>`:""}

    <section class="block">
      <h2 class="block__title">Pr\xF3ximos 30 dias</h2>
      ${$||ue("Nada agendado","Toque em + para marcar o primeiro compromisso aqui.")}
    </section>

    ${c.length?`<section class="block">
      <h2 class="block__title">\xDAltimas 2 semanas</h2>
      ${c.map(f=>pe(f,{showDate:!0,compact:!0})).join("")}
    </section>`:""}
  </div>`}function dt(a,e){let o=a.el;(o.querySelector('[data-act="edit"]')||{}).onclick=()=>ge(e),o.querySelector('[data-act="new"]').onclick=async()=>{let{openEventEditor:l}=await import("./c-24XKNKGB.js");l({companyId:e})},o.querySelector('[data-act="share"]').onclick=()=>ye(e),o.querySelector('[data-act="clientview"]').onclick=()=>pt(e)}function ge(a=null,e=null){let o=a?n.company(a):null,l=n.state.companies.map(u=>u.color),t=o?{...o}:{id:j("c_"),name:"",color:X.find(u=>!l.includes(u))||X[0],logo:null,instagram:"",address:"",contact:"",notes:"",shareToken:null},s=()=>`
    ${D(o?`Editar ${x(!1,!0)}`:`${U()} ${x(!1,!0)}`,{left:'<button class="btn-text" data-close>Cancelar</button>',right:'<button class="btn btn--primary btn--sm" data-save>Salvar</button>'})}
    <form class="form" onsubmit="return false">
      <div class="logopick">
        <div data-preview>${A({...t,name:t.name||"?"},88,24)}</div>
        <div class="logopick__btns">
          <label class="btn btn--soft btn--sm">${d("image",16)} ${t.logo?"Trocar logo":"Enviar logomarca"}<input type="file" accept="image/*" data-file hidden></label>
          ${t.logo?'<button type="button" class="btn-text btn-text--sm" data-rmlogo>Remover logo</button>':'<p class="fhelp">Opcional. Sem logo, usamos as iniciais na cor escolhida.</p>'}
        </div>
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-name">Nome (${r(_.entity.hint)})</label>
        <input id="c-name" class="input" name="name" value="${r(t.name)}" placeholder="Ex.: ${r(ct[_.entity.one]||"Pura Vida")}" autocomplete="off" maxlength="60">
      </div>
      <div class="fgroup">
        <label class="flabel">Cor no calend\xE1rio</label>
        <div class="palette">
          ${X.map(u=>`<button type="button" class="swatch${t.color===u?" is-on":""}" style="background:${u}" data-color="${u}" aria-label="Cor ${u}">${d("check",16)}</button>`).join("")}
          <label class="swatch swatch--custom" title="Outra cor"><input type="color" value="${t.color}" data-customcolor>${d("plus",16)}</label>
        </div>
      </div>
      <div class="fgroup"${S()?"":" hidden"}>
        <label class="flabel" for="c-ig">Instagram</label>
        <div class="input-prefix"><span>@</span><input id="c-ig" class="input" name="instagram" value="${r(t.instagram||"")}" placeholder="usuario" autocomplete="off" autocapitalize="none"></div>
      </div>
      <div class="fgroup"${n.team.length>1?"":" hidden"}>
        <label class="flabel">Notifica\xE7\xF5es daqui v\xE3o para</label>
        <div class="seg seg--notify">${[["",n.team.length===2?"Os dois":"Todos"],...n.team.map(u=>[u.id,u.name])].map(([u,i])=>`<button type="button" class="seg__btn${(t.notifyOnly||"")===u?" is-on":""}" data-only="${u}">${r(i)}</button>`).join("")}</div>
        <p class="fhelp">${S()?"Avisos, lembretes, \u201CJ\xE1 postou?\u201D, cobran\xE7as de atraso e dicas desta empresa":`Avisos, lembretes e cobran\xE7as de atraso ${Me()?"desta":"deste"} ${r(x(!1,!0))}`} chegam s\xF3 para quem estiver marcado.</p>
      </div>
      <div class="fgroup"${S()?"":" hidden"}>
        <label class="flabel" for="c-niche">O que a empresa faz (para as dicas)</label>
        <input id="c-niche" class="input" name="niche" value="${r(t.niche||Ge(t))}" placeholder="Ex.: hamburgueria artesanal, loja de roupas femininas" autocomplete="off" maxlength="160">
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-addr">Endere\xE7o</label>
        <input id="c-addr" class="input" name="address" value="${r(t.address||"")}" placeholder="Rua, n\xFAmero \u2013 bairro" autocomplete="off">
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-contact">Contato</label>
        <input id="c-contact" class="input" name="contact" value="${r(t.contact||"")}" placeholder="${S()?"Nome e WhatsApp do respons\xE1vel":"Telefone, respons\xE1vel, hor\xE1rio\u2026"}" autocomplete="off">
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-notes">${S()?"Observa\xE7\xF5es internas":"Observa\xE7\xF5es"}</label>
        <textarea id="c-notes" class="input" name="notes" rows="3" placeholder="${S()?"Tom de voz, o que evitar, prefer\xEAncias\u2026":"Tudo o que voc\xEA precisa lembrar sobre esse lugar\u2026"}">${r(t.notes||"")}</textarea>
      </div>
      ${o?`<button type="button" class="btn btn--danger-soft btn--block" data-delete>${d("trash",18)} Excluir ${x(!1,!0)}</button>`:""}
      <div class="form__spacer"></div>
    </form>`,c=u=>{let i=u.el,m=i.querySelector("form"),$=()=>{t.name=m.name.value.trim(),t.instagram=m.instagram.value.trim().replace(/^@/,""),t.niche=m.niche.value.trim(),t.notifyOnly=i.querySelector("[data-only].is-on")?.dataset.only||null,t.address=m.address.value.trim(),t.contact=m.contact.value.trim(),t.notes=m.notes.value.trim()},f=()=>i.querySelector("[data-preview]").innerHTML=A({...t,name:m.name.value||"?"},88,24);m.name.addEventListener("input",f),i.querySelectorAll("[data-only]").forEach(y=>y.onclick=()=>i.querySelectorAll("[data-only]").forEach(p=>p.classList.toggle("is-on",p===y))),i.querySelectorAll("[data-color]").forEach(y=>y.onclick=()=>{t.color=y.dataset.color,i.querySelectorAll("[data-color]").forEach(p=>p.classList.toggle("is-on",p===y)),f()}),i.querySelector("[data-customcolor]").oninput=y=>{t.color=y.target.value,i.querySelectorAll("[data-color]").forEach(p=>p.classList.remove("is-on")),f()},i.querySelector("[data-file]").onchange=async y=>{let p=y.target.files[0];if(p)try{$(),t.logo=await Le(p,160),u.set(s())}catch{k("N\xE3o foi poss\xEDvel ler essa imagem")}};let v=i.querySelector("[data-rmlogo]");v&&(v.onclick=()=>{$(),t.logo=null,u.set(s())});let T=i.querySelector("[data-delete]");T&&(T.onclick=async()=>{let y=n.state.events.filter(b=>b.companyId===t.id);await P({title:`Excluir ${t.name}?`,text:y.length?`Os ${y.length} compromissos daqui tamb\xE9m ser\xE3o apagados e o link do cliente deixar\xE1 de funcionar.`:"O link do cliente deixar\xE1 de funcionar.",ok:"Excluir",danger:!0})&&(await n.removeMany("events",y.map(b=>b.id)),await n.remove("companies",t.id),u.close(),k("Exclu\xEDdo"))}),i.querySelector("[data-save]").onclick=async()=>{if($(),!t.name)return m.name.focus(),k("Digite o nome");await n.upsert("companies",{...t}),u.close(),k(o?"Atualizado":"Cadastrado"),e&&e(n.company(t.id))}};M({className:"sheet--tall",html:s(),onMount:c})}async function ye(a){let e=n.company(a),o=n.mode==="cloud",l="";o?(await n.ensureShareToken(e),await n.publishCompany(a),l=Ne(n.company(a).shareToken)):l=Oe(await Ie(ie(e,n.state.events,{maxFuture:90})));let t=`
    ${D("Link do cliente")}
    <div class="share">
      <div class="share__co">${A(e,56)}<div><strong>${r(e.name)}</strong><small>v\xEA somente o pr\xF3prio cronograma</small></div></div>
      <ul class="checks">
        <li>${d("check",16)} Somente os eventos da ${r(e.name)}</li>
        <li>${d("check",16)} Sem notas internas e sem outras empresas</li>
        <li>${d("check",16)} Somente leitura: o cliente n\xE3o consegue alterar nada</li>
        <li>${d(o?"check":"alert",16)} ${o?"Sempre atualizado: tudo que voc\xEAs mudarem aparece para o cliente":"Foto do cronograma atual (pr\xF3ximos 90 dias). Quando mudar algo, envie o link de novo"}</li>
      </ul>
      <div class="share__link"><input readonly value="${r(l)}" data-link></div>
      <div class="share__btns">
        <button class="btn btn--primary btn--block" data-sharebtn>${d("share",18)} Enviar para o cliente</button>
        <button class="btn btn--soft btn--block" data-copy>${d("copy",18)} Copiar link</button>
        <a class="btn btn--ghost btn--block" href="${r(l)}" target="_blank" rel="noopener">${d("eye",18)} Ver como o cliente v\xEA</a>
      </div>
      ${o?'<button class="btn-text btn-text--sm btn-text--danger" data-revoke>Gerar novo link (o antigo para de funcionar)</button>':'<p class="fhelp">Dica: ative a sincroniza\xE7\xE3o na nuvem (Ajustes) para o link ficar sempre atualizado automaticamente.</p>'}
    </div>`;M({html:t,onMount:s=>{let c=s.el;c.querySelector("[data-copy]").onclick=async()=>{try{await navigator.clipboard.writeText(l),k("Link copiado")}catch{c.querySelector("[data-link]").select(),k("Selecione e copie o link")}},c.querySelector("[data-sharebtn]").onclick=async()=>{let i=`Ol\xE1! Este \xE9 o cronograma de conte\xFAdo da ${e.name}. Por aqui voc\xEAs acompanham tudo o que est\xE1 planejado: posts, stories, reels e capta\xE7\xF5es.`;if(navigator.share)try{await navigator.share({title:`Cronograma \xB7 ${e.name}`,text:i,url:l})}catch{}else await navigator.clipboard?.writeText(`${i}
${l}`),k("Mensagem copiada")};let u=c.querySelector("[data-revoke]");u&&(u.onclick=async()=>{await P({title:"Gerar um novo link?",text:"Quem tiver o link antigo n\xE3o conseguir\xE1 mais ver o cronograma.",ok:"Gerar novo link",danger:!0})&&(await n.regenerateShareToken(n.company(a)),s.close(),ye(a))})}})}async function pt(a){let e=n.company(a);if(!e)return;let{showClient:o}=await import("./c-FEDFV46I.js"),{sanitizePayload:l}=await import("./c-NMLAOALZ.js"),t=l(ie(e,n.state.events)),s=document.createElement("div");s.className="client-preview",s.innerHTML=`<div class="client-preview__bar"><button class="btn btn--soft btn--sm" data-closepv>${d("left",16)} Voltar</button><span>Assim o cliente v\xEA</span><button class="btn btn--primary btn--sm" data-sendpv>${d("share",16)} Enviar</button></div><div class="client-preview__body"></div>`,document.body.appendChild(s),document.body.classList.add("has-sheet"),o(s.querySelector(".client-preview__body"),t,{canGoBack:!1,preview:!0});let c=()=>{s.remove(),document.body.classList.toggle("has-sheet",!!document.querySelector(".sheet-wrap"))};s.querySelector("[data-closepv]").onclick=c,s.querySelector("[data-sendpv]").onclick=()=>{c(),ye(a)}}function na(a){let e=M({html:tt(a),className:"sheet--tall",onMount:o=>ut(o,a)});e.refresh=()=>{if(!n.event(a))return e.close();e.set(tt(a))}}function tt(a){let e=n.event(a);if(!e)return"";let o=n.company(e.companyId),l=o?.color||"#666",t=de.find(i=>i.v===(e.reminder??30)),s=e.seriesId?n.state.events.filter(i=>i.seriesId===e.seriesId).length:0,c=n.canEdit("events",e),u=n.member(n.ownerOf("events",e))?.name||"o parceiro";return`
  ${D("",{right:c?'<button class="btn-text" data-act="edit">Editar</button>':""})}
  <div class="detail">
    <div class="detail__hero" style="--cc:${l};--cc-soft:${z(l,.12)}">
      <div class="detail__co">${A(o,40)}<div><strong>${r(o?.name||"Sem "+x(!1,!0))}</strong>${o?.instagram?`<small>@${r(o.instagram)}</small>`:""}</div>${Je(e.type,{solid:!0})}</div>
      <h2><span class="pfrow">${ze(e,24)}</span>${r(e.title||h[e.type].label)}</h2>
      <p class="detail__when">${d("calendar",15)} ${r(H(e.date))}, ${r(Te(e.date).split(", ")[1])} \xB7 ${d("clock",15)} ${r(Ue(e))}</p>
    </div>

    ${c?"":`<p class="detail__lock">${d("eye",14)} Cadastrado por ${r(u)} \u2014 ${n.canComplete(e)?"voc\xEA \xE9 respons\xE1vel: pode marcar o andamento, mas n\xE3o editar.":"voc\xEA s\xF3 pode ver. Use \u201CDuplicar\u201D para criar uma c\xF3pia sua."}</p>`}
    <div class="seg seg--status"${c||n.canComplete(e)?"":" hidden"}>
      ${ce.map(i=>`<button class="seg__btn${e.status===i?" is-on":""} st-${i}" data-status="${i}">${i==="feito"?d("check",14):""}${re[i].label}</button>`).join("")}
    </div>

    <ul class="rows">
      ${ne()?"":`<li><span class="rows__k">${d("users",16)} Respons\xE1vel</span><span class="rows__v">${(e.assignees||[]).map(i=>K(i,22)).join("")} ${r(ee(e.assignees))}</span></li>`}
      ${e.location?`<li><span class="rows__k">${d("pin",16)} Local</span><a class="rows__v link" href="https://maps.apple.com/?q=${encodeURIComponent(e.location)}" target="_blank" rel="noopener">${r(e.location)}</a></li>`:""}
      ${h[e.type].kind!=="post"||e.duration?`<li><span class="rows__k">${d("clock",16)} Dura\xE7\xE3o</span><span class="rows__v">${r(le(Re(e)))}</span></li>`:""}
      <li><span class="rows__k">${d("bell",16)} Lembrete</span><span class="rows__v">${r(t?.label||"\u2014")}</span></li>
      ${s?`<li><span class="rows__k">${d("repeat",16)} Repeti\xE7\xE3o</span><span class="rows__v">${s} eventos na s\xE9rie</span></li>`:""}
      ${_.clientLike?`<li><span class="rows__k">${d(e.visibleToClient===!1?"eyeoff":"eye",16)} Cliente</span><span class="rows__v">${e.visibleToClient===!1?"N\xE3o aparece para o cliente":"Aparece no link do cliente"}</span></li>`:""}
    </ul>

    ${e.description?`<div class="textbox"><h4>${r(_.form.desc[0])}</h4><p>${r(e.description)}</p></div>`:""}
    ${e.internalNote?`<div class="textbox textbox--note"><h4>${d("eyeoff",13)} ${r(_.form.note[0])} (${nt()})</h4><p>${r(e.internalNote)}</p></div>`:""}

    <div class="actions">
      <button data-act="ics">${d("bell",20)}<span>Lembrete no iPhone</span></button>
      ${c?`<button data-act="tomorrow">${d("right",20)}<span>Passar p/ amanh\xE3</span></button>`:""}
      <button data-act="dup">${d("copy",20)}<span>Duplicar</span></button>
      ${c?`<button data-act="del" class="is-danger">${d("trash",20)}<span>Excluir</span></button>`:""}
    </div>
    <p class="detail__meta">Criado por ${r(n.member(e.createdBy)?.name||"\u2014")}${e.updatedAt?" \xB7 atualizado "+new Date(e.updatedAt).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):""}</p>
  </div>`}function ut(a,e){let o=a.el;o.querySelectorAll("[data-status]").forEach(t=>t.onclick=async()=>{let s=n.event(e),c=t.getBoundingClientRect();if(await n.upsert("events",{...s,status:t.dataset.status}),t.dataset.status==="feito"&&s.status!=="feito"&&n.event(e)?.status==="feito"){let u=s.date===q()?n.eventsOn(s.date,{person:n.me}).filter(i=>i.status!=="feito").length:null;k(Ke({el:c,left:u}))}});let l=(t,s)=>{let c=o.querySelector(`[data-act="${t}"]`);c&&(c.onclick=s)};l("edit",()=>at({id:e})),l("dup",async()=>{let s={...n.event(e),id:j("e_"),status:"pendente",seriesId:null,createdAt:null,createdBy:null};await n.upsert("events",s),a.close(),k(`${oe()} duplicado`),at({id:s.id})}),l("tomorrow",async()=>{let t=n.event(e);await vt(t,{date:E(t.date,1)})&&(await n.upsert("events",{...t,date:E(t.date,1)}),k("Movido para "+H(E(t.date,1)).toLowerCase(),{action:"Desfazer",onAction:()=>n.upsert("events",{...n.event(e),date:t.date})}))}),l("ics",()=>{let t=n.event(e);Ve([t],`${h[t.type].label}-${t.date}.ics`,xe.appName)}),l("del",()=>ot(e,a))}async function ot(a,e){let o=n.event(a),l=[a];if(o.seriesId){let s=n.state.events.filter(c=>c.seriesId===o.seriesId&&c.date>=o.date).map(c=>c.id);if(s.length>1){let c=await F({title:`Excluir ${L()} repetido`,options:[{label:"S\xF3 este",value:"one",danger:!0},{label:`Este e os pr\xF3ximos (${s.length})`,value:"next",danger:!0}]});if(!c)return;c==="next"&&(l=s)}else if(!await P({title:`Excluir este ${L()}?`,ok:"Excluir",danger:!0}))return}else if(!await P({title:`Excluir este ${L()}?`,text:n.team.length>1?"Ele some da agenda de todos.":"Ele some da sua agenda.",ok:"Excluir",danger:!0}))return;let t=l.map(s=>({...n.event(s)}));await n.removeMany("events",l),e&&e.close(),k(l.length>1?`${l.length} ${L()}s exclu\xEDdos`:`${oe()} exclu\xEDdo`,{action:"Desfazer",onAction:()=>n.upsertMany("events",t),ms:4500})}function at({id:a=null,date:e=null,companyId:o=null,type:l=null,time:t=null,assignees:s=null}={}){let c=a?n.event(a):null;if(c&&!n.canEdit("events",c)){n._denied("events",c);return}let u=n.companiesSorted(),i=l||(J.includes("feed")?"feed":J[0]),m=c?JSON.parse(JSON.stringify(c)):{id:j("e_"),type:i,companyId:o||C.monthCompany||(u.length===1?u[0].id:null),title:"",date:e||(C.tab==="mes"?C.monthSel:C.date)||q(),time:t||h[i].best[0]||"12:00",duration:["shoot","meeting","work","other"].includes(h[i].kind)?h[i].dur:null,assignees:s||(C.person!=="all"?[C.person]:n.me?[n.me]:[]),location:"",description:"",internalNote:"",reminder:30,visibleToClient:h[i].client,status:"pendente"};if(!c&&!t&&!S()){let T=te(m,{limit:6}).map(y=>y.time).sort();if(T.length)m.time=T[0];else if(m.date===q()){let y=Math.ceil((Ce()+30)/30)*30;y<1440&&(m.time=qe(y))}}let $=c?JSON.parse(JSON.stringify(c)):null,f={mode:"none",until:E(m.date,28)};return M({className:"sheet--tall",html:lt(m,!!c,f),onMount:T=>mt(T,m,$,f)})}function _e(a,e){let o=(a.assignees||[]).includes(e.id);return a.notifyPartner===!1?o?`Sem aviso agora. Como ${e.name} \xE9 respons\xE1vel, ele ainda recebe os lembretes do hor\xE1rio.`:`${e.name} n\xE3o recebe aviso nem lembretes deste evento. Fica s\xF3 na agenda.`:`${e.name} recebe o aviso de que voc\xEA marcou e os lembretes do hor\xE1rio.`}var L=()=>S()?"evento":"compromisso",oe=()=>S()?"Evento":"Compromisso",ne=()=>n.team.length<2,nt=()=>ne()?"s\xF3 voc\xEA v\xEA":`s\xF3 ${n.team.length>2?"a equipe":"voc\xEAs"} veem`,se=a=>["shoot","meeting","work","other"].includes(h[a].kind),G=a=>["shoot","meeting"].includes(h[a].kind);function lt(a,e,o){let l=n.companiesSorted();return`
  ${D(e?`Editar ${L()}`:`Novo ${L()}`,{left:'<button class="btn-text" data-close>Cancelar</button>',right:'<button class="btn btn--primary btn--sm" data-save>Salvar</button>'})}
  <form class="form" data-editor onsubmit="return false">
    <div class="fgroup">
      <label class="flabel">O que \xE9?</label>
      <div class="typegrid">
        ${J.map(t=>`<button type="button" class="typebtn tbadge--${t}${a.type===t?" is-on":""}"${je(t)} data-type="${t}">${d(h[t].icon,20)}<span>${h[t].label}</span></button>`).join("")}
      </div>
    </div>

    <div class="fgroup">
      <label class="flabel">${x()}${S()?"":' <em class="tag">opcional</em>'}</label>
      <div class="cogrid">
        ${l.map(t=>`<button type="button" class="cobtn${a.companyId===t.id?" is-on":""}" style="--cc:${t.color}" data-company="${t.id}">${A(t,26,7)}<span>${r(t.name)}</span></button>`).join("")}
        <button type="button" class="cobtn cobtn--add" data-newco>${d("plus",18)}<span>${U()} ${x(!1,!0)}</span></button>
      </div>
    </div>

    ${J.some(t=>h[t].kind==="post")||h[a.type].kind==="post"?`<div class="fgroup" data-when="net" ${h[a.type].kind==="post"?"":"hidden"}>
      <label class="flabel">Onde vai postar?</label>
      <div class="netgrid">${Fe.map(t=>{let s=He(t);return s?`<button type="button" class="netbtn${(a.platform||"instagram")===t?" is-on":""}" data-net="${t}"><span class="pf" style="width:22px;height:22px">${s.svg}</span><span>${r(s.name.replace(" (Twitter)",""))}</span></button>`:""}).join("")}</div>
    </div>`:""}

    <div class="fgroup">
      <label class="flabel" for="f-title">T\xEDtulo</label>
      <input id="f-title" class="input" name="title" value="${r(a.title)}" placeholder="${r(h[a.type].placeholder)}" autocomplete="off" maxlength="120">
    </div>

    <div class="fgroup row2">
      <div><label class="flabel" for="f-date">Dia</label><input id="f-date" class="input" type="date" name="date" value="${a.date}" required></div>
      <div><label class="flabel" for="f-time">Hor\xE1rio</label><input id="f-time" class="input" type="time" name="time" value="${a.time||""}" step="300"></div>
    </div>

    <div class="fgroup" data-when="duration" ${se(a.type)?"":"hidden"}>
      <label class="flabel" for="f-dur">Dura\xE7\xE3o</label>
      <select id="f-dur" class="input" name="duration">
        ${Be.map(t=>`<option value="${t}"${(a.duration||h[a.type].dur)===t?" selected":""}>${le(t)}</option>`).join("")}
      </select>
    </div>

    <div data-hint></div>

    <div class="fgroup"${ne()?" hidden":""}>
      <label class="flabel">Quem vai fazer?</label>
      <div class="whogrid">
        ${n.team.map(t=>`<button type="button" class="whobtn${(a.assignees||[]).includes(t.id)?" is-on":""}" style="--mc:${t.color}" data-who="${t.id}">${K(t.id,30)}<span>${r(t.name)}</span><i class="whobtn__check">${d("check",14)}</i></button>`).join("")}
      </div>
      <p class="fhelp">${n.team.length>2?"Marque todos que v\xE3o juntos.":"Marque os dois se forem juntos."}</p>
      ${n.team.filter(t=>t.id!==n.me).map(t=>`<label class="list__row notifyrow"><span><b>${d("bell",15)} Avisar ${t.name==="Matheus"||t.name==="Henrique"?"o ":""}${r(t.name)}</b><small data-notifyhelp>${_e(a,t)}</small></span><input type="checkbox" class="switch" name="notifyPartner" ${a.notifyPartner!==!1?"checked":""}></label>`).join("")}
    </div>

    <div class="fgroup" data-when="location" ${G(a.type)?"":"hidden"}>
      <label class="flabel" for="f-loc">Local</label>
      <input id="f-loc" class="input" name="location" value="${r(a.location||"")}" placeholder="Endere\xE7o ou nome do lugar" autocomplete="off">
      <button type="button" class="btn-text btn-text--sm" data-useaddr hidden>${d("pin",14)} Usar o endere\xE7o cadastrado</button>
    </div>

    <div class="fgroup">
      <label class="flabel" for="f-desc">${r(_.form.desc[0])}${_.clientLike?` <em class="tag">${d("eye",12)} cliente v\xEA</em>`:""}</label>
      <textarea id="f-desc" class="input" name="description" rows="3" placeholder="${r(_.form.desc[1])}">${r(a.description||"")}</textarea>
    </div>
    <div class="fgroup">
      <label class="flabel" for="f-note">${r(_.form.note[0])} <em class="tag tag--note">${d("eyeoff",12)} ${nt()}</em></label>
      <textarea id="f-note" class="input" name="internalNote" rows="2" placeholder="${r(_.form.note[1])}">${r(a.internalNote||"")}</textarea>
    </div>

    <div class="list">
      <label class="list__row"><span>${d("bell",18)} Lembrete</span>
        <select name="reminder">${de.map(t=>`<option value="${t.v}"${(a.reminder??30)===t.v?" selected":""}>${t.label}</option>`).join("")}</select>
      </label>
      ${e?"":`<label class="list__row"><span>${d("repeat",18)} Repetir</span>
        <select name="repeat">${Z.map(t=>`<option value="${t.v}"${o.mode===t.v?" selected":""}>${t.label}</option>`).join("")}</select>
      </label>
      <label class="list__row" data-when="until" hidden><span>${d("calendar",18)} At\xE9</span>
        <input type="date" name="until" value="${o.until}">
      </label>`}
      <label class="list__row"${_.clientLike?"":" hidden"}><span>${d("eye",18)} Aparece no link do cliente</span>
        <input type="checkbox" class="switch" name="visibleToClient" ${a.visibleToClient!==!1?"checked":""}>
      </label>
      ${e?`<label class="list__row"><span>${d("check",18)} Status</span>
        <select name="status">${ce.map(t=>`<option value="${t}"${a.status===t?" selected":""}>${re[t].label}</option>`).join("")}</select>
      </label>`:""}
    </div>

    ${e?`<button type="button" class="btn btn--danger-soft btn--block" data-delete>${d("trash",18)} Excluir ${L()}</button>`:""}
    <div class="form__spacer"></div>
  </form>`}function mt(a,e,o,l){let t=a.el,s=t.querySelector("[data-editor]"),c=p=>t.querySelector(p),u=()=>{let p=c("[data-hint]");p.innerHTML=ft(e,!o),p.querySelectorAll("[data-settime]").forEach(b=>b.onclick=()=>{e.time=b.dataset.settime,s.time.value=e.time,u()}),p.querySelectorAll("[data-setwho]").forEach(b=>b.onclick=()=>{e.assignees=[b.dataset.setwho],t.querySelectorAll("[data-who]").forEach(g=>g.classList.toggle("is-on",e.assignees.includes(g.dataset.who))),u()})},i=()=>{t.querySelector('[data-when="duration"]').hidden=!se(e.type);let p=t.querySelector('[data-when="net"]');p&&(p.hidden=h[e.type].kind!=="post"),t.querySelector('[data-when="location"]').hidden=!G(e.type);let b=n.company(e.companyId),g=c("[data-useaddr]");g.hidden=!(b&&b.address&&s.location.value!==b.address);let N=t.querySelector('[data-when="until"]');N&&(N.hidden=l.mode==="none")};t.querySelectorAll("[data-type]").forEach(p=>p.onclick=()=>{let b=e.type;if(e.type=p.dataset.type,t.querySelectorAll("[data-type]").forEach(g=>g.classList.toggle("is-on",g===p)),s.title.placeholder=h[e.type].placeholder,(!o||b!==e.type)&&(e.duration=se(e.type)?h[e.type].dur:null,s.duration.value=String(h[e.type].dur),o||(e.visibleToClient=h[e.type].client,s.visibleToClient.checked=e.visibleToClient)),G(e.type)&&!s.location.value){let g=n.company(e.companyId);g?.address&&(s.location.value=g.address,e.location=g.address)}i(),u()}),t.querySelectorAll("[data-company]").forEach(p=>p.onclick=()=>{e.companyId=p.dataset.company,t.querySelectorAll("[data-company]").forEach(g=>g.classList.toggle("is-on",g===p));let b=n.company(e.companyId);G(e.type)&&b?.address&&!s.location.value&&(s.location.value=b.address,e.location=b.address),i()}),c("[data-newco]").onclick=()=>{ge(null,p=>{e.companyId=p.id,$(),a.set(lt(e,!!o,l))})},t.querySelectorAll("[data-who]").forEach(p=>p.onclick=()=>{let b=p.dataset.who;e.assignees=e.assignees.includes(b)?e.assignees.filter(w=>w!==b):[...e.assignees,b],p.classList.toggle("is-on",e.assignees.includes(b)),u();let g=t.querySelector("[data-notifyhelp]"),N=n.team.find(w=>w.id!==n.me);g&&N&&(g.textContent=_e(e,N))});let m=t.querySelector('input[name="notifyPartner"]');m&&(m.onchange=()=>{e.notifyPartner=m.checked;let p=t.querySelector("[data-notifyhelp]"),b=n.team.find(g=>g.id!==n.me);p&&b&&(p.textContent=_e(e,b))}),c("[data-useaddr]").onclick=()=>{let p=n.company(e.companyId);s.location.value=p.address,e.location=p.address,i()},t.querySelectorAll("[data-net]").forEach(p=>p.onclick=()=>{e.platform=p.dataset.net,t.querySelectorAll("[data-net]").forEach(b=>b.classList.toggle("is-on",b===p))});let $=()=>{e.title=Ze(s.title.value.trim(),e.type),h[e.type].kind==="post"&&!e.platform&&(e.platform="instagram"),h[e.type].kind!=="post"&&(e.platform=null),e.date=s.date.value,e.time=s.time.value||"",e.duration=se(e.type)?Number(s.duration.value):null,e.location=G(e.type)?s.location.value.trim():"",e.description=s.description.value.trim(),e.internalNote=s.internalNote.value.trim(),e.reminder=Number(s.reminder.value),e.visibleToClient=s.visibleToClient.checked,s.status&&(e.status=s.status.value),s.repeat&&(l.mode=s.repeat.value),s.until&&(l.until=s.until.value)};s.addEventListener("input",()=>{$(),i()}),s.addEventListener("change",()=>{$(),i(),u()});let f=c("[data-delete]");f&&(f.onclick=()=>ot(e.id,null).then(()=>!n.event(e.id)&&a.close())),c("[data-save]").onclick=async()=>{if($(),!v){if(!e.companyId&&S()){k("Escolha a empresa"),t.querySelector(".cogrid").scrollIntoView({behavior:"smooth",block:"center"});return}if(!e.date)return k("Escolha o dia");if(ne()&&n.me&&!e.assignees.length&&(e.assignees=[n.me]),!(!e.assignees.length&&!await P({title:"Ningu\xE9m respons\xE1vel?",text:`Este ${L()} ficar\xE1 sem respons\xE1vel. Deseja salvar assim mesmo?`,ok:"Salvar assim"}))&&!v){v=!0;try{await T()}finally{v=!1}}}};let v=!1,T=async()=>{if(o){if(["date","time","duration","type","assignees","companyId"].some(b=>JSON.stringify(e[b])!==JSON.stringify(o[b]))&&!await we(e,!1,a,y))return;await gt(e,o)}else if(l.mode!=="none"){let p=ht(e.date,l),b=p.filter(w=>V({...e,date:w},{isNew:!0}).some(O=>O.level==="block")),g=p;if(b.length){let w=await F({title:`${b.length} de ${p.length} datas j\xE1 t\xEAm compromisso nesse hor\xE1rio`,text:b.slice(0,6).map(O=>B(O)).join(" \xB7 ")+(b.length>6?" \u2026":""),options:[{label:`Criar s\xF3 nas ${p.length-b.length} datas livres`,value:"free",primary:!0},{label:"Criar em todas mesmo assim",value:"all"}]});if(!w)return;if(w==="free"&&(g=p.filter(O=>!b.includes(O))),!g.length)return k("Nenhuma data livre")}let N=j("s_");await n.upsertMany("events",g.map((w,O)=>({...e,id:O===0?e.id:j("e_"),date:w,seriesId:N})),{activity:{notifyPartner:e.notifyPartner,kind:"series",count:g.length,label:`${h[e.type].label} ${Z.find(w=>w.v===l.mode)?.label.toLowerCase()||""} \xE0s ${R(e.time)}`,sample:{companyId:e.companyId,date:g[0]}}}),a.close(),ve({title:`${g.length} ${L()}s marcados`,sub:`${Z.find(w=>w.v===l.mode)?.label||""}${e.time?" \xB7 "+R(e.time):""}`.replace(/^ · /,"")});return}else{if(!await we(e,!0,a,y))return;await n.upsert("events",{...e}),a.close(),ve({title:`${oe()} marcado`,sub:`${B(e.date)}${e.time?" \xB7 "+R(e.time):""}`});return}a.close()};function y(){s.time.value=e.time||"",s.date.value=e.date,t.querySelectorAll("[data-who]").forEach(p=>p.classList.toggle("is-on",e.assignees.includes(p.dataset.who))),i(),u()}i(),u()}var ke=420,st=1380,I=a=>(Math.min(Math.max(a,ke),st)-ke)/(st-ke)*100;function bt(a,e){let o=a.time?me(a):null,l=[8,10,12,14,16,18,20,22];return`<div class="lanes">
    <div class="lanes__head"><strong>${n.team.length>1?`Agenda ${n.team.length===2?"dos dois":"de todos"}`:"Sua agenda"} em ${r(B(a.date))}</strong></div>
    ${n.team.map(t=>{let s=n.eventsOn(a.date,{person:t.id}).filter(i=>i.id!==a.id&&i.time),c=(a.assignees||[]).includes(t.id),u=e.some(i=>i.level==="block"&&i.person===t.id);return`<div class="lane">
        <span class="lane__who">${K(t.id,22)}</span>
        <div class="lane__track">
          ${l.map(i=>`<i class="lane__tick" style="left:${I(i*60)}%"></i>`).join("")}
          ${s.map(i=>{let m=me(i),$=n.company(i.companyId);return`<span class="lane__ev" style="left:${I(m[0])}%;width:max(4px,${I(m[1])-I(m[0])}%);background:${$?.color||"#888"}" title="${r(We(i))}"></span>`}).join("")}
          ${o&&c?`<span class="lane__draft${u?" is-clash":""}" style="left:${I(o[0])}%;width:max(6px,${I(o[1])-I(o[0])}%)"></span>`:""}
        </div>
      </div>`}).join("")}
    <div class="lane lane--axis"><span class="lane__who"></span><div class="lane__track">${l.map(t=>`<small style="left:${I(t*60)}%">${t}h</small>`).join("")}</div></div>
  </div>`}function ft(a,e){if(!a.date)return"";let o=V(a,{isNew:e}),l=o.filter(v=>v.level==="block"),t=o.filter(v=>v.level==="warn"),s=o.filter(v=>v.level==="info"),c=te(a,{limit:4}),u=be(a),i=(a.assignees||[]).length===1?a.assignees[0]:null,m=l.length&&i?n.team.find(v=>v.id!==i&&u.includes(v.id)):null,$=h[a.type],f=v=>`<li class="issue issue--${v.level}">${d(v.level==="block"?"alert":v.level==="warn"?"flag":v.code==="partner"?"user":"bulb",15)}<div><strong>${r(v.title)}</strong><p>${r(v.text)}</p></div></li>`;return`
  <section class="assist">
    <header class="assist__head">${d("sparkle",16)} Assistente</header>
    ${bt(a,o)}
    ${o.length?`<ul class="issues">${[...l,...t,...s].map(f).join("")}</ul>`:a.time?`<p class="assist__ok">${d("check",15)} Hor\xE1rio livre para ${r(ee(a.assignees))}, sem conflitos.</p>`:""}
    ${m?`<button type="button" class="tchip tchip--wide" data-setwho="${m.id}">${K(m.id,18)} Passar para ${r(m.name)} (est\xE1 livre)</button>`:""}
    <div class="assist__sugg">
      <p>${r($.tip)}</p>
      ${c.length?`<div class="hintbox__times">${c.map(v=>`<button type="button" class="tchip${a.time===v.time?" is-on":""}" data-settime="${v.time}">${R(v.time)}${v.peak?"<small>pico</small>":"<small>livre</small>"}</button>`).join("")}</div>`:`<p class="muted">Nenhum hor\xE1rio livre nesse dia${(a.assignees||[]).length?" para "+r(ee(a.assignees)):""}. Tente outro dia${n.team.length>1?" ou outra pessoa":""}.</p>`}
    </div>
  </section>`}async function we(a,e,o,l){let s=V(a,{isNew:e}).filter(f=>f.level==="block");if(!s.length)return!0;let c=te(a,{limit:2}),u=(a.assignees||[]).length===1?a.assignees[0]:null,i=u&&n.team.find(f=>f.id!==u&&be(a).includes(f.id)),m=[...c.map(f=>({label:`Mudar para ${R(f.time)} (livre)`,value:"time:"+f.time,primary:!0})),...i?[{label:`Passar para ${i.name} (est\xE1 livre)`,value:"who:"+i.id,primary:!c.length}]:[],{label:"Marcar mesmo assim",value:"force"}],$=await F({title:s[0].code==="duplicate"?"Isso j\xE1 est\xE1 na agenda":"J\xE1 tem compromisso nesse hor\xE1rio",bodyHtml:`<ul class="issues issues--dialog">${s.map(f=>`<li class="issue issue--block">${d("alert",15)}<div><strong>${r(f.title)}</strong><p>${r(f.text)}</p></div></li>`).join("")}</ul>`,options:m});return $?$==="force"?!0:($.startsWith("time:")&&(a.time=$.slice(5)),$.startsWith("who:")&&(a.assignees=[$.slice(4)]),l(),we(a,e,o,l)):!1}async function vt(a,e){let o={...a,...e},l=V(o).filter(s=>s.level==="block");return l.length?await F({title:"J\xE1 tem compromisso nesse hor\xE1rio",bodyHtml:`<ul class="issues issues--dialog">${l.map(s=>`<li class="issue issue--block">${d("alert",15)}<div><strong>${r(s.title)}</strong><p>${r(s.text)}</p></div></li>`).join("")}</ul>`,options:[{label:"Mover mesmo assim",value:"force",primary:!0}]})==="force":!0}function ht(a,e){let o=[],l=a,t=e.until&&e.until>=a?e.until:E(a,28);for(;l<=t&&o.length<150;){let s=Q(l).getDay();(e.mode==="daily"||e.mode==="weekdays"&&s>=1&&s<=5||e.mode==="weekly"&&Q(l).getDay()===Q(a).getDay())&&o.push(l),l=E(l,1)}return o}var $t=["type","companyId","title","time","duration","assignees","location","description","internalNote","reminder","visibleToClient"];async function gt(a,e){let o=$t.filter(l=>JSON.stringify(a[l])!==JSON.stringify(e[l]));if(a.seriesId&&o.length){let l=n.state.events.filter(t=>t.seriesId===a.seriesId&&t.date>e.date);if(l.length){let t=await F({title:`${oe()} repetido`,text:"Aplicar as altera\xE7\xF5es a quais eventos?",options:[{label:"S\xF3 a este",value:"one",primary:!0},{label:`A este e aos pr\xF3ximos (${l.length+1})`,value:"next"}]});if(!t)return;if(t==="next"){let s=Object.fromEntries(o.map(c=>[c,a[c]]));await n.upsertMany("events",[{...a},...l.map(c=>({...c,...s}))],{activity:{kind:"series-edit",count:l.length+1,label:`${h[a.type].label} \xB7 a partir de ${a.date.slice(8)}/${a.date.slice(5,7)}`,sample:{companyId:a.companyId,date:a.date}}}),k("S\xE9rie atualizada");return}}}await n.upsert("events",{...a}),k("Altera\xE7\xF5es salvas")}export{Ze as a,ve as b,C as c,xt as d,na as e,at as f,vt as g,Rt as h,Bt as i,ge as j};
