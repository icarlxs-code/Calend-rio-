import{a as We,b as Ge}from"./c-MNCYKSVR.js";import{a as Fe,b as Je}from"./c-I7JIKRYT.js";import{a as Ke}from"./c-FQ3DTYVO.js";import{b as me,c as Ve,d as W,e as Z,f as ve}from"./c-IEKSAGMW.js";import{a as ue,b as D}from"./c-PZQLNNS6.js";import{e as ee,g as te}from"./c-EYQLKLV7.js";import{g as Ue}from"./c-PGHLFVNL.js";import{D as Qe}from"./c-RI3KL5PA.js";import{d as ze}from"./c-2NRRIKNO.js";import{a as De,b as Pe,c as Re,d as V,g as Y,h as I,i as He,j as Be,k as de,m as pe,n as N,q as j,r as w,s as M,t as H}from"./c-JAI6M6PY.js";import{a as le,b as Ce,d as Ie,e as Ae,f as s}from"./c-DO7SGJNJ.js";import{c as Me}from"./c-CIEJVWQB.js";import{a as ge}from"./c-WWTNKPRM.js";import{a as y,b as J,c as k,e as Te,f as x,h as Le,i as U,j as Oe,l as S,n as Ne,o as ie,p as re,r as Q,s as je,t as ce,u as X}from"./c-JRZKGWYQ.js";import{B as r,D as F,G as qe,c as G,d as L,e as E,f as we,g as ke,k as _e,l as Se,m as P,r as xe,t as Ee,u as z,v as R,w as ne,z as O}from"./c-MPTN5RTT.js";import{b as p}from"./c-DWBEWQEH.js";var nt={Empresa:"Pura Vida",Local:"Hospital Santa Clara",Turma:"9\xBA ano B",Obra:"Residencial Aurora",Cliente:"Maria Silva",Setor:"Linha de produ\xE7\xE3o 2",Unidade:"3\xBA Batalh\xE3o",Projeto:"Novo site",Plataforma:"iFood",\u00C1rea:"Talh\xE3o 3",Mat\u00E9ria:"Matem\xE1tica"};function Ct(){let a=s.companiesSorted(),e=L(),n=we(e),i=E(n,6);return`
  <header class="hdr">
    <div class="hdr__row">
      <div class="hdr__titles"><p class="hdr__eyebrow">${a.length} ${a.length===1?S(!1,!0):S(!0,!0)}</p><h1>${S(!0)}</h1></div>
      <div class="hdr__actions"><button class="btn btn--primary btn--sm" data-action="new-company">${p("plus",16)} ${U()}</button></div>
    </div>
  </header>
  <div class="page">
    ${a.length?"":pe(`${Oe()} ${S(!1,!0)} ainda`,`Cadastre ${k.entity.hint} com nome, cor e foto. Assim cada compromisso fica organizado no lugar certo.`,`<button class="btn btn--primary" data-action="new-company">${p("plus",18)} Cadastrar ${S(!1,!0)}</button>`)}
    <div class="colist">
      ${a.map(t=>{let o=s.eventsBetween(n,i,{companyId:t.id}),u=s.state.events.filter(c=>c.companyId===t.id&&c.date>=e&&c.status!=="feito").sort((c,l)=>(c.date+c.time).localeCompare(l.date+l.time))[0];return`<button class="cocard" style="--cc:${t.color};--cc-soft:${F(t.color,.1)}" data-action="open-company" data-id="${t.id}">
          <div class="cocard__top">
            ${I(t,48)}
            <div class="cocard__name"><strong>${r(t.name)}</strong><small>${u?`<b>${r(z(u.date))}${u.time?" "+u.time:""}</b> \xB7 ${r(u.title||y[u.type].label)}`:"Nada agendado"}</small></div>${o.length?`<em class="cocard__n" title="nesta semana">${o.length}</em>`:""}
            ${p("right",18,"muted")}
          </div>
        </button>`}).join("")}
    </div>
  </div>`}function It(a){let e=N({className:"sheet--tall",html:Xe(a),onMount:n=>lt(n,a)});e.refresh=()=>s.company(a)?e.set(Xe(a)):e.close()}function Xe(a){let e=s.company(a);if(!e)return"";let n=L(),i=ke(n),t=s.eventsBetween(`${i}-01`,`${i}-31`,{companyId:a}),o=s.eventsBetween(n,E(n,30),{companyId:a}),u=s.eventsBetween(E(n,-14),E(n,-1),{companyId:a}).reverse(),c=b=>t.filter(f=>b.includes(f.type)).length,l=t.filter(b=>b.status==="feito").length,m="",$=o.map(b=>{let f=b.date!==m?`<h4 class="dayhead">${r(R(b.date))}</h4>`:"";return m=b.date,f+de(b)}).join("");return`
  ${j("",{right:s.canEdit("companies",e)?'<button class="btn-text" data-act="edit">Editar</button>':""})}
  <div class="cohero" style="--cc:${e.color};--cc-soft:${F(e.color,.14)}">
    ${I(e,72,20)}
    <h2>${r(e.name)}</h2>
    ${e.instagram?`<a class="cohero__ig" href="https://instagram.com/${encodeURIComponent(e.instagram)}" target="_blank" rel="noopener">${p("insta",14)} @${r(e.instagram)}</a>`:""}
    <div class="cohero__btns">
      <button class="btn btn--primary btn--sm" data-act="new">${p("plus",16)} Evento</button>
      ${k.clientLike?`<button class="btn btn--soft btn--sm" data-act="clientview">${p("eye",16)} P\xE1gina do cliente</button>`:""}
      <button class="btn btn--soft btn--sm" data-act="share">${p("share",16)} Enviar</button>
    </div>
  </div>

  <div class="page page--sheet">
    <section class="block">
      <h2 class="block__title">${r(Ee(i))}</h2>
      <div class="mstats mstats--5">
        <div><b>${c(["feed","carrossel"])}</b><span>feed</span></div>
        <div><b>${c(["reels"])}</b><span>reels</span></div>
        <div><b>${c(["story"])}</b><span>stories</span></div>
        <div><b>${c(["captacao"])}</b><span>capta\xE7\xF5es</span></div>
        <div><b>${t.length?Math.round(l/t.length*100):0}%</b><span>feito</span></div>
      </div>
    </section>

    ${e.address||e.contact||e.notes?`<ul class="rows">
      ${e.address?`<li><span class="rows__k">${p("pin",16)} Endere\xE7o</span><a class="rows__v link" href="https://maps.apple.com/?q=${encodeURIComponent(e.address)}" target="_blank" rel="noopener">${r(e.address)}</a></li>`:""}
      ${e.contact?`<li><span class="rows__k">${p("user",16)} Contato</span><span class="rows__v">${r(e.contact)}</span></li>`:""}
      ${e.notes?`<li><span class="rows__k">${p("note",16)} Observa\xE7\xF5es</span><span class="rows__v">${r(e.notes)}</span></li>`:""}
    </ul>`:""}

    <section class="block">
      <h2 class="block__title">Pr\xF3ximos 30 dias</h2>
      ${$||pe("Nada agendado","Toque em + para marcar o primeiro compromisso aqui.")}
    </section>

    ${u.length?`<section class="block">
      <h2 class="block__title">\xDAltimas 2 semanas</h2>
      ${u.map(b=>de(b,{showDate:!0,compact:!0})).join("")}
    </section>`:""}
  </div>`}function lt(a,e){let n=a.el;(n.querySelector('[data-act="edit"]')||{}).onclick=()=>fe(e),n.querySelector('[data-act="new"]').onclick=async()=>{let{openEventEditor:i}=await import("./c-DG7QUTUH.js");i({companyId:e})},n.querySelector('[data-act="share"]').onclick=()=>$e(e),n.querySelector('[data-act="clientview"]').onclick=()=>it(e)}function fe(a=null,e=null){let n=a?s.company(a):null,i=s.state.companies.map(c=>c.color),t=n?{...n}:{id:O("c_"),name:"",color:Q.find(c=>!i.includes(c))||Q[0],logo:null,instagram:"",address:"",contact:"",notes:"",shareToken:null},o=()=>`
    ${j(n?`Editar ${S(!1,!0)}`:`${U()} ${S(!1,!0)}`,{left:'<button class="btn-text" data-close>Cancelar</button>',right:'<button class="btn btn--primary btn--sm" data-save>Salvar</button>'})}
    <form class="form" onsubmit="return false">
      <div class="logopick">
        <div data-preview>${I({...t,name:t.name||"?"},88,24)}</div>
        <div class="logopick__btns">
          <label class="btn btn--soft btn--sm">${p("image",16)} ${t.logo?"Trocar logo":"Enviar logomarca"}<input type="file" accept="image/*" data-file hidden></label>
          ${t.logo?'<button type="button" class="btn-text btn-text--sm" data-rmlogo>Remover logo</button>':'<p class="fhelp">Opcional. Sem logo, usamos as iniciais na cor escolhida.</p>'}
        </div>
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-name">Nome (${r(k.entity.hint)})</label>
        <input id="c-name" class="input" name="name" value="${r(t.name)}" placeholder="Ex.: ${r(nt[k.entity.one]||"Pura Vida")}" autocomplete="off" maxlength="60">
      </div>
      <div class="fgroup">
        <label class="flabel">Cor no calend\xE1rio</label>
        <div class="palette">
          ${Q.map(c=>`<button type="button" class="swatch${t.color===c?" is-on":""}" style="background:${c}" data-color="${c}" aria-label="Cor ${c}">${p("check",16)}</button>`).join("")}
          <label class="swatch swatch--custom" title="Outra cor"><input type="color" value="${t.color}" data-customcolor>${p("plus",16)}</label>
        </div>
      </div>
      <div class="fgroup"${x()?"":" hidden"}>
        <label class="flabel" for="c-ig">Instagram</label>
        <div class="input-prefix"><span>@</span><input id="c-ig" class="input" name="instagram" value="${r(t.instagram||"")}" placeholder="usuario" autocomplete="off" autocapitalize="none"></div>
      </div>
      <div class="fgroup"${s.team.length>1?"":" hidden"}>
        <label class="flabel">Notifica\xE7\xF5es daqui v\xE3o para</label>
        <div class="seg seg--notify">${[["",s.team.length===2?"Os dois":"Todos"],...s.team.map(c=>[c.id,c.name])].map(([c,l])=>`<button type="button" class="seg__btn${(t.notifyOnly||"")===c?" is-on":""}" data-only="${c}">${r(l)}</button>`).join("")}</div>
        <p class="fhelp">${x()?"Avisos, lembretes, \u201CJ\xE1 postou?\u201D, cobran\xE7as de atraso e dicas desta empresa":`Avisos, lembretes e cobran\xE7as de atraso ${Le()?"desta":"deste"} ${r(S(!1,!0))}`} chegam s\xF3 para quem estiver marcado.</p>
      </div>
      <div class="fgroup"${x()?"":" hidden"}>
        <label class="flabel" for="c-niche">O que a empresa faz (para as dicas)</label>
        <input id="c-niche" class="input" name="niche" value="${r(t.niche||Ge(t))}" placeholder="Ex.: hamburgueria artesanal, loja de roupas femininas" autocomplete="off" maxlength="160">
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-addr">Endere\xE7o</label>
        <input id="c-addr" class="input" name="address" value="${r(t.address||"")}" placeholder="Rua, n\xFAmero \u2013 bairro" autocomplete="off">
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-contact">Contato</label>
        <input id="c-contact" class="input" name="contact" value="${r(t.contact||"")}" placeholder="${x()?"Nome e WhatsApp do respons\xE1vel":"Telefone, respons\xE1vel, hor\xE1rio\u2026"}" autocomplete="off">
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-notes">${x()?"Observa\xE7\xF5es internas":"Observa\xE7\xF5es"}</label>
        <textarea id="c-notes" class="input" name="notes" rows="3" placeholder="${x()?"Tom de voz, o que evitar, prefer\xEAncias\u2026":"Tudo o que voc\xEA precisa lembrar sobre esse lugar\u2026"}">${r(t.notes||"")}</textarea>
      </div>
      ${n?`<button type="button" class="btn btn--danger-soft btn--block" data-delete>${p("trash",18)} Excluir ${S(!1,!0)}</button>`:""}
      <div class="form__spacer"></div>
    </form>`,u=c=>{let l=c.el,m=l.querySelector("form"),$=()=>{t.name=m.name.value.trim(),t.instagram=m.instagram.value.trim().replace(/^@/,""),t.niche=m.niche.value.trim(),t.notifyOnly=l.querySelector("[data-only].is-on")?.dataset.only||null,t.address=m.address.value.trim(),t.contact=m.contact.value.trim(),t.notes=m.notes.value.trim()},b=()=>l.querySelector("[data-preview]").innerHTML=I({...t,name:m.name.value||"?"},88,24);m.name.addEventListener("input",b),l.querySelectorAll("[data-only]").forEach(g=>g.onclick=()=>l.querySelectorAll("[data-only]").forEach(d=>d.classList.toggle("is-on",d===g))),l.querySelectorAll("[data-color]").forEach(g=>g.onclick=()=>{t.color=g.dataset.color,l.querySelectorAll("[data-color]").forEach(d=>d.classList.toggle("is-on",d===g)),b()}),l.querySelector("[data-customcolor]").oninput=g=>{t.color=g.target.value,l.querySelectorAll("[data-color]").forEach(d=>d.classList.remove("is-on")),b()},l.querySelector("[data-file]").onchange=async g=>{let d=g.target.files[0];if(d)try{$(),t.logo=await qe(d,160),c.set(o())}catch{w("N\xE3o foi poss\xEDvel ler essa imagem")}};let f=l.querySelector("[data-rmlogo]");f&&(f.onclick=()=>{$(),t.logo=null,c.set(o())});let B=l.querySelector("[data-delete]");B&&(B.onclick=async()=>{let g=s.state.events.filter(h=>h.companyId===t.id);if(!await M({title:`Excluir ${t.name}?`,text:g.length?`${g.length===1?"O compromisso daqui vai":`Os ${g.length} compromissos daqui v\xE3o`} junto para a lixeira por 24 horas. O link do cliente deixa de funcionar.`:"Vai para a lixeira por 24 horas. O link do cliente deixa de funcionar.",html:g.length?te([...g].sort((h,C)=>h.date<C.date?-1:1)):"",ok:"Excluir",danger:!0}))return;if(!s.canEdit("companies",s.company(t.id)||{})){s._denied("companies",s.company(t.id));return}let v=Me();g.length&&await s.removeMany("events",g.map(h=>h.id),{via:"empresa",lote:v}),await s.remove("companies",t.id,{via:"empresa",lote:v}),c.close(),ee(v,`${t.name} exclu\xEDda${g.length?` com ${g.length} ${g.length===1?"compromisso":"compromissos"}`:""}`)}),l.querySelector("[data-save]").onclick=async()=>{if($(),!t.name)return m.name.focus(),w("Digite o nome");await s.upsert("companies",{...t}),c.close(),w(n?"Atualizado":"Cadastrado"),e&&e(s.company(t.id))}};N({className:"sheet--tall",html:o(),onMount:u})}async function $e(a){let e=s.company(a),n=s.mode==="cloud",i="";n?(await s.ensureShareToken(e),await s.publishCompany(a),i=Ie(s.company(a).shareToken)):i=Ae(await Ce(le(e,s.state.events,{maxFuture:90})));let t=`
    ${j("Link do cliente")}
    <div class="share">
      <div class="share__co">${I(e,56)}<div><strong>${r(e.name)}</strong><small>v\xEA somente o pr\xF3prio cronograma</small></div></div>
      <ul class="checks">
        <li>${p("check",16)} Somente os eventos da ${r(e.name)}</li>
        <li>${p("check",16)} Sem notas internas e sem outras empresas</li>
        <li>${p("check",16)} Somente leitura: o cliente n\xE3o consegue alterar nada</li>
        <li>${p(n?"check":"alert",16)} ${n?"Sempre atualizado: tudo que voc\xEAs mudarem aparece para o cliente":"Foto do cronograma atual (pr\xF3ximos 90 dias). Quando mudar algo, envie o link de novo"}</li>
      </ul>
      <div class="share__link"><input readonly value="${r(i)}" data-link></div>
      <div class="share__btns">
        <button class="btn btn--primary btn--block" data-sharebtn>${p("share",18)} Enviar para o cliente</button>
        <button class="btn btn--soft btn--block" data-copy>${p("copy",18)} Copiar link</button>
        <a class="btn btn--ghost btn--block" href="${r(i)}" target="_blank" rel="noopener">${p("eye",18)} Ver como o cliente v\xEA</a>
      </div>
      ${n?'<button class="btn-text btn-text--sm btn-text--danger" data-revoke>Gerar novo link (o antigo para de funcionar)</button>':'<p class="fhelp">Dica: ative a sincroniza\xE7\xE3o na nuvem (Ajustes) para o link ficar sempre atualizado automaticamente.</p>'}
    </div>`;N({html:t,onMount:o=>{let u=o.el;u.querySelector("[data-copy]").onclick=async()=>{try{await navigator.clipboard.writeText(i),w("Link copiado")}catch{u.querySelector("[data-link]").select(),w("Selecione e copie o link")}},u.querySelector("[data-sharebtn]").onclick=async()=>{let l=`Ol\xE1! Este \xE9 o cronograma de conte\xFAdo da ${e.name}. Por aqui voc\xEAs acompanham tudo o que est\xE1 planejado: posts, stories, reels e capta\xE7\xF5es.`;if(navigator.share)try{await navigator.share({title:`Cronograma \xB7 ${e.name}`,text:l,url:i})}catch{}else await navigator.clipboard?.writeText(`${l}
${i}`),w("Mensagem copiada")};let c=u.querySelector("[data-revoke]");c&&(c.onclick=async()=>{await M({title:"Gerar um novo link?",text:"Quem tiver o link antigo n\xE3o conseguir\xE1 mais ver o cronograma.",ok:"Gerar novo link",danger:!0})&&(await s.regenerateShareToken(s.company(a)),o.close(),$e(a))})}})}async function it(a){let e=s.company(a);if(!e)return;let{showClient:n}=await import("./c-Z4XTQYQQ.js"),{sanitizePayload:i}=await import("./c-H6PM4QRI.js"),t=i(le(e,s.state.events)),o=document.createElement("div");o.className="client-preview",o.innerHTML=`<div class="client-preview__bar"><button class="btn btn--soft btn--sm" data-closepv>${p("left",16)} Voltar</button><span>Assim o cliente v\xEA</span><button class="btn btn--primary btn--sm" data-sendpv>${p("share",16)} Enviar</button></div><div class="client-preview__body"></div>`,document.body.appendChild(o),document.body.classList.add("has-sheet"),n(o.querySelector(".client-preview__body"),t,{canGoBack:!1,preview:!0});let u=()=>{o.remove(),document.body.classList.toggle("has-sheet",!!document.querySelector(".sheet-wrap"))};o.querySelector("[data-closepv]").onclick=u,o.querySelector("[data-sendpv]").onclick=()=>{u(),$e(a)}}function Yt(a){let e=N({html:Ye(a),className:"sheet--tall",onMount:n=>rt(n,a)});e.refresh=()=>{if(!s.event(a))return e.close();e.set(Ye(a))}}function Ye(a){let e=s.event(a);if(!e)return"";let n=s.company(e.companyId),i=n?.color||"#666",t=ce.find(l=>l.v===(e.reminder??30)),o=e.seriesId?s.state.events.filter(l=>l.seriesId===e.seriesId).length:0,u=s.canEdit("events",e),c=s.member(s.ownerOf("events",e))?.name||"o parceiro";return`
  ${j("",{right:u?'<button class="btn-text" data-act="edit">Editar</button>':""})}
  <div class="detail">
    <div class="detail__hero" style="--cc:${i};--cc-soft:${F(i,.12)}">
      <div class="detail__co">${I(n,40)}<div><strong>${r(n?.name||"Sem "+S(!1,!0))}</strong>${n?.instagram?`<small>@${r(n.instagram)}</small>`:""}</div>${He(e.type,{solid:!0})}</div>
      <h2><span class="pfrow">${Re(e,24)}</span>${r(e.title||y[e.type].label)}</h2>
      <p class="detail__when">${p("calendar",15)} ${r(z(e.date))}, ${r(xe(e.date).split(", ")[1])} \xB7 ${p("clock",15)} ${r(Be(e))}</p>
    </div>

    ${u?"":`<p class="detail__lock">${p("eye",14)} Cadastrado por ${r(c)} \u2014 ${s.canComplete(e)?"voc\xEA \xE9 respons\xE1vel: pode marcar o andamento, mas n\xE3o editar.":"voc\xEA s\xF3 pode ver. Use \u201CDuplicar\u201D para criar uma c\xF3pia sua."}</p>`}
    <div class="seg seg--status"${u||s.canComplete(e)?"":" hidden"}>
      ${re.map(l=>`<button class="seg__btn${e.status===l?" is-on":""} st-${l}" data-status="${l}">${l==="feito"?p("check",14):""}${ie[l].label}</button>`).join("")}
    </div>

    ${e.status==="feito"&&(e.assignees||[]).concat(e.createdBy).includes(s.me)&&s.mode==="cloud"?`<button class="storybtn" data-act="story"><span class="storybtn__ic">${p("camera",20)}</span>${(()=>{let l=Qe("w",`e:${e.id}`);return l.ja?"<span><b>Postar outro story</b><small>O b\xF4nus dessa voc\xEA j\xE1 ganhou \u2714\uFE0F \xB7 some em 24 h</small></span></button>":`<span><b>Postar story do que voc\xEA fez</b><small>${l.got?`+${l.total} XP agora`:"Foto tirada agora"}${l.badges[0]?` \xB7 desbloqueia \u201C${r(l.badges[0].name())}\u201D`:l.lv1>l.lv0?` \xB7 sobe pro n\xEDvel ${l.lv1}`:" \xB7 XP em dobro"} \xB7 some em 24 h</small></span><i class="storybtn__x2">2\xD7</i></button>`})()}`:""}
    <ul class="rows">
      ${oe()?"":`<li><span class="rows__k">${p("users",16)} Respons\xE1vel</span><span class="rows__v">${(e.assignees||[]).map(l=>V(l,22)).join("")} ${r(Y(e.assignees))}</span></li>`}
      ${e.location?`<li><span class="rows__k">${p("pin",16)} Local</span><a class="rows__v link" href="https://maps.apple.com/?q=${encodeURIComponent(e.location)}" target="_blank" rel="noopener">${r(e.location)}</a></li>`:""}
      ${y[e.type].kind!=="post"||e.duration?`<li><span class="rows__k">${p("clock",16)} Dura\xE7\xE3o</span><span class="rows__v">${r(ne(Ne(e)))}</span></li>`:""}
      <li><span class="rows__k">${p("bell",16)} Lembrete</span><span class="rows__v">${r(t?.label||"\u2014")}</span></li>
      ${o?`<li><span class="rows__k">${p("repeat",16)} Repeti\xE7\xE3o</span><span class="rows__v">${o} eventos na s\xE9rie</span></li>`:""}
      ${k.clientLike?`<li><span class="rows__k">${p(e.visibleToClient===!1?"eyeoff":"eye",16)} Cliente</span><span class="rows__v">${e.visibleToClient===!1?"N\xE3o aparece para o cliente":"Aparece no link do cliente"}</span></li>`:""}
    </ul>

    ${e.description?`<div class="textbox"><h4>${r(k.form.desc[0])}</h4><p>${r(e.description)}</p></div>`:""}
    ${e.internalNote?`<div class="textbox textbox--note"><h4>${p("eyeoff",13)} ${r(k.form.note[0])} (${at()})</h4><p>${r(e.internalNote)}</p></div>`:""}

    <div class="actions">
      <button data-act="ics">${p("bell",20)}<span>Lembrete no iPhone</span></button>
      ${u?`<button data-act="tomorrow">${p("right",20)}<span>Passar p/ amanh\xE3</span></button>`:""}
      <button data-act="dup">${p("copy",20)}<span>Duplicar</span></button>
      ${u?`<button data-act="del" class="is-danger">${p("trash",20)}<span>Excluir</span></button>`:""}
    </div>
    <p class="detail__meta">Criado por ${r(s.member(e.createdBy)?.name||"\u2014")}${e.updatedAt?" \xB7 atualizado "+new Date(e.updatedAt).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):""}</p>
  </div>`}function rt(a,e){let n=a.el;n.querySelectorAll("[data-status]").forEach(t=>t.onclick=async()=>{let o=s.event(e),u=t.getBoundingClientRect();if(await s.upsert("events",{...o,status:t.dataset.status}),t.dataset.status==="feito"&&o.status!=="feito"&&s.event(e)?.status==="feito"){let c=o.date===L()?s.eventsOn(o.date,{person:s.me}).filter(l=>l.status!=="feito").length:null;w(ze({el:u,left:c}))}});let i=(t,o)=>{let u=n.querySelector(`[data-act="${t}"]`);u&&(u.onclick=o)};i("edit",()=>Ze({id:e})),i("story",()=>{let t=s.event(e);Ue({title:t.title||y[t.type]?.label||"",ref:`e:${e}`,kind:"w"})}),i("dup",async()=>{let o={...s.event(e),id:O("e_"),status:"pendente",seriesId:null,createdAt:null,createdBy:null};await s.upsert("events",o),a.close(),w(`${se()} duplicado`),Ze({id:o.id})}),i("tomorrow",async()=>{let t=s.event(e);await ut(t,{date:E(t.date,1)})&&(await s.upsert("events",{...t,date:E(t.date,1)}),w("Movido para "+z(E(t.date,1)).toLowerCase(),{action:"Desfazer",onAction:()=>s.upsert("events",{...s.event(e),date:t.date})}))}),i("ics",()=>{let t=s.event(e);We([t],`${y[t.type].label}-${t.date}.ics`,ge.appName)}),i("del",()=>tt(e,a))}async function tt(a,e){let n=s.event(a),i=[a];if(n.seriesId){let l=s.state.events.filter(m=>m.seriesId===n.seriesId&&m.date>=n.date).map(m=>m.id);if(l.length>1){let m=await H({title:`Excluir ${q()} repetido`,bodyHtml:te(s.state.events.filter($=>$.seriesId===n.seriesId&&$.date>=n.date).sort(($,b)=>$.date<b.date?-1:1)),options:[{label:"S\xF3 este",value:"one",danger:!0},{label:`Este e os pr\xF3ximos (${l.length})`,value:"next",danger:!0}]});if(!m)return;m==="next"&&(i=l)}else if(!await M({title:`Excluir este ${q()}?`,ok:"Excluir",danger:!0}))return}else if(!await M({title:`Excluir este ${q()}?`,text:s.team.length>1?"Ele some da agenda de todos.":"Ele some da sua agenda.",ok:"Excluir",danger:!0}))return;let t=i.map(l=>s.event(l)).filter(Boolean),o=window.__motion,u=o&&o.guardar([...document.querySelectorAll("#view .ecard")].find(l=>l.dataset.id===a)),c=await s.removeMany("events",i,{via:t.length>1?"lote":"manual"});o&&!s.event(a)&&o.excluido(u),e&&e.close(),ee(c,i.length>1?`${i.length} ${q()}s exclu\xEDdos`:`${se()} exclu\xEDdo`)}function Ze({id:a=null,date:e=null,companyId:n=null,type:i=null,time:t=null,assignees:o=null,title:u=""}={}){let c=a?s.event(a):null;if(c&&!s.canEdit("events",c)){s._denied("events",c);return}let l=s.companiesSorted(),m=i||(J.includes("feed")?"feed":J[0]),$=c?JSON.parse(JSON.stringify(c)):{id:O("e_"),type:m,companyId:n||D.monthCompany||(l.length===1?l[0].id:null),title:u||"",date:e||(D.tab==="mes"?D.monthSel:D.date)||L(),time:t||y[m].best[0]||"12:00",duration:["shoot","meeting","work","other"].includes(y[m].kind)?y[m].dur:null,assignees:o||(D.person!=="all"?[D.person]:s.me?[s.me]:[]),location:"",description:"",internalNote:"",reminder:30,visibleToClient:y[m].client,status:"pendente"};if(!c&&!t&&!x()){let g=Z($,{limit:6}).map(d=>d.time).sort();if(g.length)$.time=g[0];else if($.date===L()){let d=Math.ceil((Se()+30)/30)*30;d<1440&&($.time=_e(d))}}let b=c?JSON.parse(JSON.stringify(c)):null,f={mode:"none",until:E($.date,28)};return N({className:"sheet--tall",html:st($,!!c,f),onMount:g=>ct(g,$,b,f)})}function he(a,e){let n=(a.assignees||[]).includes(e.id);return a.notifyPartner===!1?n?`Sem aviso agora. Como ${e.name} \xE9 respons\xE1vel, ele ainda recebe os lembretes do hor\xE1rio.`:`${e.name} n\xE3o recebe aviso nem lembretes deste evento. Fica s\xF3 na agenda.`:`${e.name} recebe o aviso de que voc\xEA marcou e os lembretes do hor\xE1rio.`}var q=()=>x()?"evento":"compromisso",se=()=>x()?"Evento":"Compromisso",oe=()=>s.team.length<2,at=()=>oe()?"s\xF3 voc\xEA v\xEA":`s\xF3 ${s.team.length>2?"a equipe":"voc\xEAs"} veem`,ae=a=>["shoot","meeting","work","other"].includes(y[a].kind),K=a=>["shoot","meeting"].includes(y[a].kind);function st(a,e,n){let i=s.companiesSorted();return`
  ${j(e?`Editar ${q()}`:`Novo ${q()}`,{left:'<button class="btn-text" data-close>Cancelar</button>',right:'<button class="btn btn--primary btn--sm" data-save>Salvar</button>'})}
  <form class="form" data-editor onsubmit="return false">
    ${e?"":Fe()}
    <div class="fgroup">
      <label class="flabel" for="f-title">T\xEDtulo</label>
      <input id="f-title" class="input" name="title" value="${r(a.title)}" placeholder="${r(y[a.type].placeholder)}" autocomplete="off" maxlength="120">
    </div>
    <div class="fgroup">
      <label class="flabel">O que \xE9?</label>
      <div class="typegrid">
        ${J.map(t=>`<button type="button" class="typebtn tbadge--${t}${a.type===t?" is-on":""}"${Te(t)} data-type="${t}">${p(y[t].icon,20)}<span>${y[t].label}</span></button>`).join("")}
      </div>
    </div>

    <div class="fgroup">
      <label class="flabel">${S()}${x()?"":' <em class="tag">opcional</em>'}</label>
      <div class="cogrid">
        ${i.map(t=>`<button type="button" class="cobtn${a.companyId===t.id?" is-on":""}" style="--cc:${t.color}" data-company="${t.id}">${I(t,26,7)}<span>${r(t.name)}</span></button>`).join("")}
        <button type="button" class="cobtn cobtn--add" data-newco>${p("plus",18)}<span>${U()} ${S(!1,!0)}</span></button>
      </div>
    </div>

    ${J.some(t=>y[t].kind==="post")||y[a.type].kind==="post"?`<div class="fgroup" data-when="net" ${y[a.type].kind==="post"?"":"hidden"}>
      <label class="flabel">Onde vai postar?</label>
      <div class="netgrid">${De.map(t=>{let o=Pe(t);return o?`<button type="button" class="netbtn${(a.platform||"instagram")===t?" is-on":""}" data-net="${t}"><span class="pf" style="width:22px;height:22px">${o.svg}</span><span>${r(o.name.replace(" (Twitter)",""))}</span></button>`:""}).join("")}</div>
    </div>`:""}

    <div class="fgroup row2">
      <div><label class="flabel" for="f-date">Dia</label><input id="f-date" class="input" type="date" name="date" value="${a.date}" required></div>
      <div><label class="flabel" for="f-time">Hor\xE1rio</label><input id="f-time" class="input" type="time" name="time" value="${a.time||""}" step="300"></div>
    </div>

    <div class="fgroup" data-when="duration" ${ae(a.type)?"":"hidden"}>
      <label class="flabel" for="f-dur">Dura\xE7\xE3o</label>
      <select id="f-dur" class="input" name="duration">
        ${je.map(t=>`<option value="${t}"${(a.duration||y[a.type].dur)===t?" selected":""}>${ne(t)}</option>`).join("")}
      </select>
    </div>

    <div data-hint></div>

    <div class="fgroup"${oe()?" hidden":""}>
      <label class="flabel">Quem vai fazer?</label>
      <div class="whogrid">
        ${s.team.map(t=>`<button type="button" class="whobtn${(a.assignees||[]).includes(t.id)?" is-on":""}" style="--mc:${t.color}" data-who="${t.id}">${V(t.id,30)}<span>${r(t.name)}</span><i class="whobtn__check">${p("check",14)}</i></button>`).join("")}
      </div>
      <p class="fhelp">${s.team.length>2?"Marque todos que v\xE3o juntos.":"Marque os dois se forem juntos."}</p>
      ${s.team.filter(t=>t.id!==s.me).map(t=>`<label class="list__row notifyrow"><span><b>${p("bell",15)} Avisar ${t.name==="Matheus"||t.name==="Henrique"?"o ":""}${r(t.name)}</b><small data-notifyhelp>${he(a,t)}</small></span><input type="checkbox" class="switch" name="notifyPartner" ${a.notifyPartner!==!1?"checked":""}></label>`).join("")}
    </div>

    <div class="fgroup" data-when="location" ${K(a.type)?"":"hidden"}>
      <label class="flabel" for="f-loc">Local</label>
      <input id="f-loc" class="input" name="location" value="${r(a.location||"")}" placeholder="Endere\xE7o ou nome do lugar" autocomplete="off">
      <button type="button" class="btn-text btn-text--sm" data-useaddr hidden>${p("pin",14)} Usar o endere\xE7o cadastrado</button>
    </div>

    <div class="fgroup">
      <label class="flabel" for="f-desc">${r(k.form.desc[0])}${k.clientLike?` <em class="tag">${p("eye",12)} cliente v\xEA</em>`:""}</label>
      <textarea id="f-desc" class="input" name="description" rows="3" placeholder="${r(k.form.desc[1])}">${r(a.description||"")}</textarea>
    </div>
    <div class="fgroup">
      <label class="flabel" for="f-note">${r(k.form.note[0])} <em class="tag tag--note">${p("eyeoff",12)} ${at()}</em></label>
      <textarea id="f-note" class="input" name="internalNote" rows="2" placeholder="${r(k.form.note[1])}">${r(a.internalNote||"")}</textarea>
    </div>

    <div class="list">
      <label class="list__row"><span>${p("bell",18)} Lembrete</span>
        <select name="reminder">${ce.map(t=>`<option value="${t.v}"${(a.reminder??30)===t.v?" selected":""}>${t.label}</option>`).join("")}</select>
      </label>
      ${e?"":`<label class="list__row"><span>${p("repeat",18)} Repetir</span>
        <select name="repeat">${X.map(t=>`<option value="${t.v}"${n.mode===t.v?" selected":""}>${t.label}</option>`).join("")}</select>
      </label>
      <label class="list__row" data-when="until" hidden><span>${p("calendar",18)} At\xE9</span>
        <input type="date" name="until" value="${n.until}">
      </label>`}
      <label class="list__row"${k.clientLike?"":" hidden"}><span>${p("eye",18)} Aparece no link do cliente</span>
        <input type="checkbox" class="switch" name="visibleToClient" ${a.visibleToClient!==!1?"checked":""}>
      </label>
      ${e?`<label class="list__row"><span>${p("check",18)} Status</span>
        <select name="status">${re.map(t=>`<option value="${t}"${a.status===t?" selected":""}>${ie[t].label}</option>`).join("")}</select>
      </label>`:""}
    </div>

    ${e?`<button type="button" class="btn btn--danger-soft btn--block" data-delete>${p("trash",18)} Excluir ${q()}</button>`:""}
    <div class="form__spacer"></div>
  </form>`}function ct(a,e,n,i){let t=a.el,o=t.querySelector("[data-editor]"),u=d=>t.querySelector(d);n||Je(t,o);let c=()=>{let d=u("[data-hint]");d.innerHTML=pt(e,!n),d.querySelectorAll("[data-settime]").forEach(v=>v.onclick=()=>{e.time=v.dataset.settime,o.time.value=e.time,c()}),d.querySelectorAll("[data-setwho]").forEach(v=>v.onclick=()=>{e.assignees=[v.dataset.setwho],t.querySelectorAll("[data-who]").forEach(h=>h.classList.toggle("is-on",e.assignees.includes(h.dataset.who))),c()})},l=()=>{t.querySelector('[data-when="duration"]').hidden=!ae(e.type);let d=t.querySelector('[data-when="net"]');d&&(d.hidden=y[e.type].kind!=="post"),t.querySelector('[data-when="location"]').hidden=!K(e.type);let v=s.company(e.companyId),h=u("[data-useaddr]");h.hidden=!(v&&v.address&&o.location.value!==v.address);let C=t.querySelector('[data-when="until"]');C&&(C.hidden=i.mode==="none")};t.querySelectorAll("[data-type]").forEach(d=>d.onclick=()=>{let v=e.type;if(e.type=d.dataset.type,t.querySelectorAll("[data-type]").forEach(h=>h.classList.toggle("is-on",h===d)),o.title.placeholder=y[e.type].placeholder,(!n||v!==e.type)&&(e.duration=ae(e.type)?y[e.type].dur:null,o.duration.value=String(y[e.type].dur),n||(e.visibleToClient=y[e.type].client,o.visibleToClient.checked=e.visibleToClient)),K(e.type)&&!o.location.value){let h=s.company(e.companyId);h?.address&&(o.location.value=h.address,e.location=h.address)}l(),c()}),t.querySelectorAll("[data-company]").forEach(d=>d.onclick=()=>{e.companyId=d.dataset.company,t.querySelectorAll("[data-company]").forEach(h=>h.classList.toggle("is-on",h===d));let v=s.company(e.companyId);K(e.type)&&v?.address&&!o.location.value&&(o.location.value=v.address,e.location=v.address),l()}),u("[data-newco]").onclick=()=>{fe(null,d=>{e.companyId=d.id,$(),a.set(st(e,!!n,i))})},t.querySelectorAll("[data-who]").forEach(d=>d.onclick=()=>{let v=d.dataset.who;e.assignees=e.assignees.includes(v)?e.assignees.filter(_=>_!==v):[...e.assignees,v],d.classList.toggle("is-on",e.assignees.includes(v)),c();let h=t.querySelector("[data-notifyhelp]"),C=s.team.find(_=>_.id!==s.me);h&&C&&(h.textContent=he(e,C))});let m=t.querySelector('input[name="notifyPartner"]');m&&(m.onchange=()=>{e.notifyPartner=m.checked;let d=t.querySelector("[data-notifyhelp]"),v=s.team.find(h=>h.id!==s.me);d&&v&&(d.textContent=he(e,v))}),u("[data-useaddr]").onclick=()=>{let d=s.company(e.companyId);o.location.value=d.address,e.location=d.address,l()},t.querySelectorAll("[data-net]").forEach(d=>d.onclick=()=>{e.platform=d.dataset.net,t.querySelectorAll("[data-net]").forEach(v=>v.classList.toggle("is-on",v===d))});let $=()=>{e.title=Ke(o.title.value.trim(),e.type),y[e.type].kind==="post"&&!e.platform&&(e.platform="instagram"),y[e.type].kind!=="post"&&(e.platform=null),e.date=o.date.value,e.time=o.time.value||"",e.duration=ae(e.type)?Number(o.duration.value):null,e.location=K(e.type)?o.location.value.trim():"",e.description=o.description.value.trim(),e.internalNote=o.internalNote.value.trim(),e.reminder=Number(o.reminder.value),e.visibleToClient=o.visibleToClient.checked,o.status&&(e.status=o.status.value),o.repeat&&(i.mode=o.repeat.value),o.until&&(i.until=o.until.value)};o.addEventListener("input",()=>{$(),l()}),o.addEventListener("change",()=>{$(),l(),c()});let b=u("[data-delete]");b&&(b.onclick=()=>tt(e.id,null).then(()=>!s.event(e.id)&&a.close())),u("[data-save]").onclick=async()=>{if($(),!f){if(!e.companyId&&x()){w("Escolha a empresa"),t.querySelector(".cogrid").scrollIntoView({behavior:"smooth",block:"center"});return}if(!e.date)return w("Escolha o dia");if(oe()&&s.me&&!e.assignees.length&&(e.assignees=[s.me]),!(!e.assignees.length&&!await M({title:"Ningu\xE9m respons\xE1vel?",text:`Este ${q()} ficar\xE1 sem respons\xE1vel. Deseja salvar assim mesmo?`,ok:"Salvar assim"}))&&!f){f=!0;try{await B()}finally{f=!1}}}};let f=!1,B=async()=>{if(n){if(["date","time","duration","type","assignees","companyId"].some(v=>JSON.stringify(e[v])!==JSON.stringify(n[v]))&&!await ye(e,!1,a,g))return;await ft(e,n)}else if(i.mode!=="none"){let d=mt(e.date,i),v=d.filter(_=>W({...e,date:_},{isNew:!0}).some(T=>T.level==="block")),h=d;if(v.length){let _=await H({title:`${v.length} de ${d.length} datas j\xE1 t\xEAm compromisso nesse hor\xE1rio`,text:v.slice(0,6).map(T=>R(T)).join(" \xB7 ")+(v.length>6?" \u2026":""),options:[{label:`Criar s\xF3 nas ${d.length-v.length} datas livres`,value:"free",primary:!0},{label:"Criar em todas mesmo assim",value:"all"}]});if(!_)return;if(_==="free"&&(h=d.filter(T=>!v.includes(T))),!h.length)return w("Nenhuma data livre")}let C=O("s_");await s.upsertMany("events",h.map((_,T)=>({...e,id:T===0?e.id:O("e_"),date:_,seriesId:C})),{activity:{notifyPartner:e.notifyPartner,kind:"series",count:h.length,label:`${y[e.type].label} ${X.find(_=>_.v===i.mode)?.label.toLowerCase()||""} \xE0s ${P(e.time)}`,sample:{companyId:e.companyId,date:h[0]}}}),a.close(),ue({title:`${h.length} ${q()}s marcados`,sub:`${X.find(_=>_.v===i.mode)?.label||""}${e.time?" \xB7 "+P(e.time):""}`.replace(/^ · /,""),item:{title:`${h.length} ${q()}s`,date:h[0]}});return}else{if(!await ye(e,!0,a,g))return;await s.upsert("events",{...e}),a.close(),ue({title:`${se()} marcado`,sub:`${R(e.date)}${e.time?" \xB7 "+P(e.time):""}`,item:{title:e.title||y[e.type]?.label,date:e.date}});return}a.close()};function g(){o.time.value=e.time||"",o.date.value=e.date,t.querySelectorAll("[data-who]").forEach(d=>d.classList.toggle("is-on",e.assignees.includes(d.dataset.who))),l(),c()}l(),c()}var be=420,et=1380,A=a=>(Math.min(Math.max(a,be),et)-be)/(et-be)*100;function dt(a,e){let n=a.time?me(a):null,i=[8,10,12,14,16,18,20,22];return`<div class="lanes">
    <div class="lanes__head"><strong>${s.team.length>1?`Agenda ${s.team.length===2?"dos dois":"de todos"}`:"Sua agenda"} em ${r(R(a.date))}</strong></div>
    ${s.team.map(t=>{let o=s.eventsOn(a.date,{person:t.id}).filter(l=>l.id!==a.id&&l.time),u=(a.assignees||[]).includes(t.id),c=e.some(l=>l.level==="block"&&l.person===t.id);return`<div class="lane">
        <span class="lane__who">${V(t.id,22)}</span>
        <div class="lane__track">
          ${i.map(l=>`<i class="lane__tick" style="left:${A(l*60)}%"></i>`).join("")}
          ${o.map(l=>{let m=me(l),$=s.company(l.companyId);return`<span class="lane__ev" style="left:${A(m[0])}%;width:max(4px,${A(m[1])-A(m[0])}%);background:${$?.color||"#888"}" title="${r(Ve(l))}"></span>`}).join("")}
          ${n&&u?`<span class="lane__draft${c?" is-clash":""}" style="left:${A(n[0])}%;width:max(6px,${A(n[1])-A(n[0])}%)"></span>`:""}
        </div>
      </div>`}).join("")}
    <div class="lane lane--axis"><span class="lane__who"></span><div class="lane__track">${i.map(t=>`<small style="left:${A(t*60)}%">${t}h</small>`).join("")}</div></div>
  </div>`}function pt(a,e){if(!a.date)return"";let n=W(a,{isNew:e}),i=n.filter(f=>f.level==="block"),t=n.filter(f=>f.level==="warn"),o=n.filter(f=>f.level==="info"),u=Z(a,{limit:4}),c=ve(a),l=(a.assignees||[]).length===1?a.assignees[0]:null,m=i.length&&l?s.team.find(f=>f.id!==l&&c.includes(f.id)):null,$=y[a.type],b=f=>`<li class="issue issue--${f.level}">${p(f.level==="block"?"alert":f.level==="warn"?"flag":f.code==="partner"?"user":"bulb",15)}<div><strong>${r(f.title)}</strong><p>${r(f.text)}</p></div></li>`;return`
  <section class="assist">
    <header class="assist__head">${p("sparkle",16)} Assistente</header>
    ${dt(a,n)}
    ${n.length?`<ul class="issues">${[...i,...t,...o].map(b).join("")}</ul>`:a.time?`<p class="assist__ok">${p("check",15)} Hor\xE1rio livre para ${r(Y(a.assignees))}, sem conflitos.</p>`:""}
    ${m?`<button type="button" class="tchip tchip--wide" data-setwho="${m.id}">${V(m.id,18)} Passar para ${r(m.name)} (est\xE1 livre)</button>`:""}
    <div class="assist__sugg">
      <p>${r($.tip)}</p>
      ${u.length?`<div class="hintbox__times">${u.map(f=>`<button type="button" class="tchip${a.time===f.time?" is-on":""}" data-settime="${f.time}">${P(f.time)}${f.peak?"<small>pico</small>":"<small>livre</small>"}</button>`).join("")}</div>`:`<p class="muted">Nenhum hor\xE1rio livre nesse dia${(a.assignees||[]).length?" para "+r(Y(a.assignees)):""}. Tente outro dia${s.team.length>1?" ou outra pessoa":""}.</p>`}
    </div>
  </section>`}async function ye(a,e,n,i){let o=W(a,{isNew:e}).filter(b=>b.level==="block");if(!o.length)return!0;let u=Z(a,{limit:2}),c=(a.assignees||[]).length===1?a.assignees[0]:null,l=c&&s.team.find(b=>b.id!==c&&ve(a).includes(b.id)),m=[...u.map(b=>({label:`Mudar para ${P(b.time)} (livre)`,value:"time:"+b.time,primary:!0})),...l?[{label:`Passar para ${l.name} (est\xE1 livre)`,value:"who:"+l.id,primary:!u.length}]:[],{label:"Marcar mesmo assim",value:"force"}],$=await H({title:o[0].code==="duplicate"?"Isso j\xE1 est\xE1 na agenda":"J\xE1 tem compromisso nesse hor\xE1rio",bodyHtml:`<ul class="issues issues--dialog">${o.map(b=>`<li class="issue issue--block">${p("alert",15)}<div><strong>${r(b.title)}</strong><p>${r(b.text)}</p></div></li>`).join("")}</ul>`,options:m});return $?$==="force"?!0:($.startsWith("time:")&&(a.time=$.slice(5)),$.startsWith("who:")&&(a.assignees=[$.slice(4)]),i(),ye(a,e,n,i)):!1}async function ut(a,e){let n={...a,...e},i=W(n).filter(o=>o.level==="block");return i.length?await H({title:"J\xE1 tem compromisso nesse hor\xE1rio",bodyHtml:`<ul class="issues issues--dialog">${i.map(o=>`<li class="issue issue--block">${p("alert",15)}<div><strong>${r(o.title)}</strong><p>${r(o.text)}</p></div></li>`).join("")}</ul>`,options:[{label:"Mover mesmo assim",value:"force",primary:!0}]})==="force":!0}function mt(a,e){let n=[],i=a,t=e.until&&e.until>=a?e.until:E(a,28);for(;i<=t&&n.length<150;){let o=G(i).getDay();(e.mode==="daily"||e.mode==="weekdays"&&o>=1&&o<=5||e.mode==="weekly"&&G(i).getDay()===G(a).getDay())&&n.push(i),i=E(i,1)}return n}var vt=["type","companyId","title","time","duration","assignees","location","description","internalNote","reminder","visibleToClient"];async function ft(a,e){let n=vt.filter(i=>JSON.stringify(a[i])!==JSON.stringify(e[i]));if(a.seriesId&&n.length){let i=s.state.events.filter(t=>t.seriesId===a.seriesId&&t.date>e.date);if(i.length){let t=await H({title:`${se()} repetido`,text:"Aplicar as altera\xE7\xF5es a quais eventos?",options:[{label:"S\xF3 a este",value:"one",primary:!0},{label:`A este e aos pr\xF3ximos (${i.length+1})`,value:"next"}]});if(!t)return;if(t==="next"){let o=Object.fromEntries(n.map(u=>[u,a[u]]));await s.upsertMany("events",[{...a},...i.map(u=>({...u,...o}))],{activity:{kind:"series-edit",count:i.length+1,label:`${y[a.type].label} \xB7 a partir de ${a.date.slice(8)}/${a.date.slice(5,7)}`,sample:{companyId:a.companyId,date:a.date}}}),w("S\xE9rie atualizada");return}}}await s.upsert("events",{...a}),w("Altera\xE7\xF5es salvas")}export{Ct as a,It as b,fe as c,Yt as d,Ze as e,ut as f};
