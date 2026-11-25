import{a as Je,b as We}from"./c-BRDOKCEL.js";import{a as He,b as ze}from"./c-LNTKFI4M.js";import{g as Be}from"./c-T7TLJ33D.js";import{D as Ve}from"./c-URTTKGAY.js";import{a as Ue}from"./c-FQ3DTYVO.js";import{b as ue,c as Fe,d as W,e as Z,f as pe}from"./c-FKPXEK3U.js";import{a as de,b as D}from"./c-2AGRA3DN.js";import{d as Re}from"./c-CK2PLVTZ.js";import{a as Oe,b as je,c as Me,d as V,g as Y,h as C,i as De,j as Pe,k as re,m as ce,n as O,p as j,q as w,r as M,s as H}from"./c-3SDCPSHR.js";import{b as u}from"./c-DWBEWQEH.js";import{a as oe,b as xe,d as qe,e as Ce,f as s}from"./c-Q3T7H5ZM.js";import{a as Ee}from"./c-3VF3KZPI.js";import{B as c,D as F,G as Se,c as G,d as L,e as x,f as he,g as ye,k as ge,l as we,m as P,r as ke,t as _e,u as B,v as R,w as se,z as N}from"./c-MPTN5RTT.js";import{a as $,b as J,c as k,e as Ie,f as E,h as Te,i as U,j as Ae,l as S,n as Le,o as ne,p as le,r as Q,s as Ne,t as ie,u as X}from"./c-JRZKGWYQ.js";var at={Empresa:"Pura Vida",Local:"Hospital Santa Clara",Turma:"9\xBA ano B",Obra:"Residencial Aurora",Cliente:"Maria Silva",Setor:"Linha de produ\xE7\xE3o 2",Unidade:"3\xBA Batalh\xE3o",Projeto:"Novo site",Plataforma:"iFood",\u00C1rea:"Talh\xE3o 3",Mat\u00E9ria:"Matem\xE1tica"};function _t(){let a=s.companiesSorted(),e=L(),l=he(e),i=x(l,6);return`
  <header class="hdr">
    <div class="hdr__row">
      <div class="hdr__titles"><p class="hdr__eyebrow">${a.length} ${a.length===1?S(!1,!0):S(!0,!0)}</p><h1>${S(!0)}</h1></div>
      <div class="hdr__actions"><button class="btn btn--primary btn--sm" data-action="new-company">${u("plus",16)} ${U()}</button></div>
    </div>
  </header>
  <div class="page">
    ${a.length?"":ce(`${Ae()} ${S(!1,!0)} ainda`,`Cadastre ${k.entity.hint} com nome, cor e foto. Assim cada compromisso fica organizado no lugar certo.`,`<button class="btn btn--primary" data-action="new-company">${u("plus",18)} Cadastrar ${S(!1,!0)}</button>`)}
    <div class="colist">
      ${a.map(t=>{let o=s.eventsBetween(l,i,{companyId:t.id}),p=s.state.events.filter(r=>r.companyId===t.id&&r.date>=e&&r.status!=="feito").sort((r,n)=>(r.date+r.time).localeCompare(n.date+n.time))[0];return`<button class="cocard" style="--cc:${t.color};--cc-soft:${F(t.color,.1)}" data-action="open-company" data-id="${t.id}">
          <div class="cocard__top">
            ${C(t,48)}
            <div class="cocard__name"><strong>${c(t.name)}</strong><small>${p?`<b>${c(B(p.date))}${p.time?" "+p.time:""}</b> \xB7 ${c(p.title||$[p.type].label)}`:"Nada agendado"}</small></div>${o.length?`<em class="cocard__n" title="nesta semana">${o.length}</em>`:""}
            ${u("right",18,"muted")}
          </div>
        </button>`}).join("")}
    </div>
  </div>`}function St(a){let e=O({className:"sheet--tall",html:Ke(a),onMount:l=>st(l,a)});e.refresh=()=>s.company(a)?e.set(Ke(a)):e.close()}function Ke(a){let e=s.company(a);if(!e)return"";let l=L(),i=ye(l),t=s.eventsBetween(`${i}-01`,`${i}-31`,{companyId:a}),o=s.eventsBetween(l,x(l,30),{companyId:a}),p=s.eventsBetween(x(l,-14),x(l,-1),{companyId:a}).reverse(),r=b=>t.filter(v=>b.includes(v.type)).length,n=t.filter(b=>b.status==="feito").length,f="",h=o.map(b=>{let v=b.date!==f?`<h4 class="dayhead">${c(R(b.date))}</h4>`:"";return f=b.date,v+re(b)}).join("");return`
  ${j("",{right:s.canEdit("companies",e)?'<button class="btn-text" data-act="edit">Editar</button>':""})}
  <div class="cohero" style="--cc:${e.color};--cc-soft:${F(e.color,.14)}">
    ${C(e,72,20)}
    <h2>${c(e.name)}</h2>
    ${e.instagram?`<a class="cohero__ig" href="https://instagram.com/${encodeURIComponent(e.instagram)}" target="_blank" rel="noopener">${u("insta",14)} @${c(e.instagram)}</a>`:""}
    <div class="cohero__btns">
      <button class="btn btn--primary btn--sm" data-act="new">${u("plus",16)} Evento</button>
      ${k.clientLike?`<button class="btn btn--soft btn--sm" data-act="clientview">${u("eye",16)} P\xE1gina do cliente</button>`:""}
      <button class="btn btn--soft btn--sm" data-act="share">${u("share",16)} Enviar</button>
    </div>
  </div>

  <div class="page page--sheet">
    <section class="block">
      <h2 class="block__title">${c(_e(i))}</h2>
      <div class="mstats mstats--5">
        <div><b>${r(["feed","carrossel"])}</b><span>feed</span></div>
        <div><b>${r(["reels"])}</b><span>reels</span></div>
        <div><b>${r(["story"])}</b><span>stories</span></div>
        <div><b>${r(["captacao"])}</b><span>capta\xE7\xF5es</span></div>
        <div><b>${t.length?Math.round(n/t.length*100):0}%</b><span>feito</span></div>
      </div>
    </section>

    ${e.address||e.contact||e.notes?`<ul class="rows">
      ${e.address?`<li><span class="rows__k">${u("pin",16)} Endere\xE7o</span><a class="rows__v link" href="https://maps.apple.com/?q=${encodeURIComponent(e.address)}" target="_blank" rel="noopener">${c(e.address)}</a></li>`:""}
      ${e.contact?`<li><span class="rows__k">${u("user",16)} Contato</span><span class="rows__v">${c(e.contact)}</span></li>`:""}
      ${e.notes?`<li><span class="rows__k">${u("note",16)} Observa\xE7\xF5es</span><span class="rows__v">${c(e.notes)}</span></li>`:""}
    </ul>`:""}

    <section class="block">
      <h2 class="block__title">Pr\xF3ximos 30 dias</h2>
      ${h||ce("Nada agendado","Toque em + para marcar o primeiro compromisso aqui.")}
    </section>

    ${p.length?`<section class="block">
      <h2 class="block__title">\xDAltimas 2 semanas</h2>
      ${p.map(b=>re(b,{showDate:!0,compact:!0})).join("")}
    </section>`:""}
  </div>`}function st(a,e){let l=a.el;(l.querySelector('[data-act="edit"]')||{}).onclick=()=>me(e),l.querySelector('[data-act="new"]').onclick=async()=>{let{openEventEditor:i}=await import("./c-5NTHXFVM.js");i({companyId:e})},l.querySelector('[data-act="share"]').onclick=()=>ve(e),l.querySelector('[data-act="clientview"]').onclick=()=>ot(e)}function me(a=null,e=null){let l=a?s.company(a):null,i=s.state.companies.map(r=>r.color),t=l?{...l}:{id:N("c_"),name:"",color:Q.find(r=>!i.includes(r))||Q[0],logo:null,instagram:"",address:"",contact:"",notes:"",shareToken:null},o=()=>`
    ${j(l?`Editar ${S(!1,!0)}`:`${U()} ${S(!1,!0)}`,{left:'<button class="btn-text" data-close>Cancelar</button>',right:'<button class="btn btn--primary btn--sm" data-save>Salvar</button>'})}
    <form class="form" onsubmit="return false">
      <div class="logopick">
        <div data-preview>${C({...t,name:t.name||"?"},88,24)}</div>
        <div class="logopick__btns">
          <label class="btn btn--soft btn--sm">${u("image",16)} ${t.logo?"Trocar logo":"Enviar logomarca"}<input type="file" accept="image/*" data-file hidden></label>
          ${t.logo?'<button type="button" class="btn-text btn-text--sm" data-rmlogo>Remover logo</button>':'<p class="fhelp">Opcional. Sem logo, usamos as iniciais na cor escolhida.</p>'}
        </div>
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-name">Nome (${c(k.entity.hint)})</label>
        <input id="c-name" class="input" name="name" value="${c(t.name)}" placeholder="Ex.: ${c(at[k.entity.one]||"Pura Vida")}" autocomplete="off" maxlength="60">
      </div>
      <div class="fgroup">
        <label class="flabel">Cor no calend\xE1rio</label>
        <div class="palette">
          ${Q.map(r=>`<button type="button" class="swatch${t.color===r?" is-on":""}" style="background:${r}" data-color="${r}" aria-label="Cor ${r}">${u("check",16)}</button>`).join("")}
          <label class="swatch swatch--custom" title="Outra cor"><input type="color" value="${t.color}" data-customcolor>${u("plus",16)}</label>
        </div>
      </div>
      <div class="fgroup"${E()?"":" hidden"}>
        <label class="flabel" for="c-ig">Instagram</label>
        <div class="input-prefix"><span>@</span><input id="c-ig" class="input" name="instagram" value="${c(t.instagram||"")}" placeholder="usuario" autocomplete="off" autocapitalize="none"></div>
      </div>
      <div class="fgroup"${s.team.length>1?"":" hidden"}>
        <label class="flabel">Notifica\xE7\xF5es daqui v\xE3o para</label>
        <div class="seg seg--notify">${[["",s.team.length===2?"Os dois":"Todos"],...s.team.map(r=>[r.id,r.name])].map(([r,n])=>`<button type="button" class="seg__btn${(t.notifyOnly||"")===r?" is-on":""}" data-only="${r}">${c(n)}</button>`).join("")}</div>
        <p class="fhelp">${E()?"Avisos, lembretes, \u201CJ\xE1 postou?\u201D, cobran\xE7as de atraso e dicas desta empresa":`Avisos, lembretes e cobran\xE7as de atraso ${Te()?"desta":"deste"} ${c(S(!1,!0))}`} chegam s\xF3 para quem estiver marcado.</p>
      </div>
      <div class="fgroup"${E()?"":" hidden"}>
        <label class="flabel" for="c-niche">O que a empresa faz (para as dicas)</label>
        <input id="c-niche" class="input" name="niche" value="${c(t.niche||We(t))}" placeholder="Ex.: hamburgueria artesanal, loja de roupas femininas" autocomplete="off" maxlength="160">
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-addr">Endere\xE7o</label>
        <input id="c-addr" class="input" name="address" value="${c(t.address||"")}" placeholder="Rua, n\xFAmero \u2013 bairro" autocomplete="off">
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-contact">Contato</label>
        <input id="c-contact" class="input" name="contact" value="${c(t.contact||"")}" placeholder="${E()?"Nome e WhatsApp do respons\xE1vel":"Telefone, respons\xE1vel, hor\xE1rio\u2026"}" autocomplete="off">
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-notes">${E()?"Observa\xE7\xF5es internas":"Observa\xE7\xF5es"}</label>
        <textarea id="c-notes" class="input" name="notes" rows="3" placeholder="${E()?"Tom de voz, o que evitar, prefer\xEAncias\u2026":"Tudo o que voc\xEA precisa lembrar sobre esse lugar\u2026"}">${c(t.notes||"")}</textarea>
      </div>
      ${l?`<button type="button" class="btn btn--danger-soft btn--block" data-delete>${u("trash",18)} Excluir ${S(!1,!0)}</button>`:""}
      <div class="form__spacer"></div>
    </form>`,p=r=>{let n=r.el,f=n.querySelector("form"),h=()=>{t.name=f.name.value.trim(),t.instagram=f.instagram.value.trim().replace(/^@/,""),t.niche=f.niche.value.trim(),t.notifyOnly=n.querySelector("[data-only].is-on")?.dataset.only||null,t.address=f.address.value.trim(),t.contact=f.contact.value.trim(),t.notes=f.notes.value.trim()},b=()=>n.querySelector("[data-preview]").innerHTML=C({...t,name:f.name.value||"?"},88,24);f.name.addEventListener("input",b),n.querySelectorAll("[data-only]").forEach(g=>g.onclick=()=>n.querySelectorAll("[data-only]").forEach(d=>d.classList.toggle("is-on",d===g))),n.querySelectorAll("[data-color]").forEach(g=>g.onclick=()=>{t.color=g.dataset.color,n.querySelectorAll("[data-color]").forEach(d=>d.classList.toggle("is-on",d===g)),b()}),n.querySelector("[data-customcolor]").oninput=g=>{t.color=g.target.value,n.querySelectorAll("[data-color]").forEach(d=>d.classList.remove("is-on")),b()},n.querySelector("[data-file]").onchange=async g=>{let d=g.target.files[0];if(d)try{h(),t.logo=await Se(d,160),r.set(o())}catch{w("N\xE3o foi poss\xEDvel ler essa imagem")}};let v=n.querySelector("[data-rmlogo]");v&&(v.onclick=()=>{h(),t.logo=null,r.set(o())});let z=n.querySelector("[data-delete]");z&&(z.onclick=async()=>{let g=s.state.events.filter(m=>m.companyId===t.id);await M({title:`Excluir ${t.name}?`,text:g.length?`Os ${g.length} compromissos daqui tamb\xE9m ser\xE3o apagados e o link do cliente deixar\xE1 de funcionar.`:"O link do cliente deixar\xE1 de funcionar.",ok:"Excluir",danger:!0})&&(await s.removeMany("events",g.map(m=>m.id)),await s.remove("companies",t.id),r.close(),w("Exclu\xEDdo"))}),n.querySelector("[data-save]").onclick=async()=>{if(h(),!t.name)return f.name.focus(),w("Digite o nome");await s.upsert("companies",{...t}),r.close(),w(l?"Atualizado":"Cadastrado"),e&&e(s.company(t.id))}};O({className:"sheet--tall",html:o(),onMount:p})}async function ve(a){let e=s.company(a),l=s.mode==="cloud",i="";l?(await s.ensureShareToken(e),await s.publishCompany(a),i=qe(s.company(a).shareToken)):i=Ce(await xe(oe(e,s.state.events,{maxFuture:90})));let t=`
    ${j("Link do cliente")}
    <div class="share">
      <div class="share__co">${C(e,56)}<div><strong>${c(e.name)}</strong><small>v\xEA somente o pr\xF3prio cronograma</small></div></div>
      <ul class="checks">
        <li>${u("check",16)} Somente os eventos da ${c(e.name)}</li>
        <li>${u("check",16)} Sem notas internas e sem outras empresas</li>
        <li>${u("check",16)} Somente leitura: o cliente n\xE3o consegue alterar nada</li>
        <li>${u(l?"check":"alert",16)} ${l?"Sempre atualizado: tudo que voc\xEAs mudarem aparece para o cliente":"Foto do cronograma atual (pr\xF3ximos 90 dias). Quando mudar algo, envie o link de novo"}</li>
      </ul>
      <div class="share__link"><input readonly value="${c(i)}" data-link></div>
      <div class="share__btns">
        <button class="btn btn--primary btn--block" data-sharebtn>${u("share",18)} Enviar para o cliente</button>
        <button class="btn btn--soft btn--block" data-copy>${u("copy",18)} Copiar link</button>
        <a class="btn btn--ghost btn--block" href="${c(i)}" target="_blank" rel="noopener">${u("eye",18)} Ver como o cliente v\xEA</a>
      </div>
      ${l?'<button class="btn-text btn-text--sm btn-text--danger" data-revoke>Gerar novo link (o antigo para de funcionar)</button>':'<p class="fhelp">Dica: ative a sincroniza\xE7\xE3o na nuvem (Ajustes) para o link ficar sempre atualizado automaticamente.</p>'}
    </div>`;O({html:t,onMount:o=>{let p=o.el;p.querySelector("[data-copy]").onclick=async()=>{try{await navigator.clipboard.writeText(i),w("Link copiado")}catch{p.querySelector("[data-link]").select(),w("Selecione e copie o link")}},p.querySelector("[data-sharebtn]").onclick=async()=>{let n=`Ol\xE1! Este \xE9 o cronograma de conte\xFAdo da ${e.name}. Por aqui voc\xEAs acompanham tudo o que est\xE1 planejado: posts, stories, reels e capta\xE7\xF5es.`;if(navigator.share)try{await navigator.share({title:`Cronograma \xB7 ${e.name}`,text:n,url:i})}catch{}else await navigator.clipboard?.writeText(`${n}
${i}`),w("Mensagem copiada")};let r=p.querySelector("[data-revoke]");r&&(r.onclick=async()=>{await M({title:"Gerar um novo link?",text:"Quem tiver o link antigo n\xE3o conseguir\xE1 mais ver o cronograma.",ok:"Gerar novo link",danger:!0})&&(await s.regenerateShareToken(s.company(a)),o.close(),ve(a))})}})}async function ot(a){let e=s.company(a);if(!e)return;let{showClient:l}=await import("./c-I62NBY6Y.js"),{sanitizePayload:i}=await import("./c-C6JFG7NX.js"),t=i(oe(e,s.state.events)),o=document.createElement("div");o.className="client-preview",o.innerHTML=`<div class="client-preview__bar"><button class="btn btn--soft btn--sm" data-closepv>${u("left",16)} Voltar</button><span>Assim o cliente v\xEA</span><button class="btn btn--primary btn--sm" data-sendpv>${u("share",16)} Enviar</button></div><div class="client-preview__body"></div>`,document.body.appendChild(o),document.body.classList.add("has-sheet"),l(o.querySelector(".client-preview__body"),t,{canGoBack:!1,preview:!0});let p=()=>{o.remove(),document.body.classList.toggle("has-sheet",!!document.querySelector(".sheet-wrap"))};o.querySelector("[data-closepv]").onclick=p,o.querySelector("[data-sendpv]").onclick=()=>{p(),ve(a)}}function Vt(a){let e=O({html:Ge(a),className:"sheet--tall",onMount:l=>nt(l,a)});e.refresh=()=>{if(!s.event(a))return e.close();e.set(Ge(a))}}function Ge(a){let e=s.event(a);if(!e)return"";let l=s.company(e.companyId),i=l?.color||"#666",t=ie.find(n=>n.v===(e.reminder??30)),o=e.seriesId?s.state.events.filter(n=>n.seriesId===e.seriesId).length:0,p=s.canEdit("events",e),r=s.member(s.ownerOf("events",e))?.name||"o parceiro";return`
  ${j("",{right:p?'<button class="btn-text" data-act="edit">Editar</button>':""})}
  <div class="detail">
    <div class="detail__hero" style="--cc:${i};--cc-soft:${F(i,.12)}">
      <div class="detail__co">${C(l,40)}<div><strong>${c(l?.name||"Sem "+S(!1,!0))}</strong>${l?.instagram?`<small>@${c(l.instagram)}</small>`:""}</div>${De(e.type,{solid:!0})}</div>
      <h2><span class="pfrow">${Me(e,24)}</span>${c(e.title||$[e.type].label)}</h2>
      <p class="detail__when">${u("calendar",15)} ${c(B(e.date))}, ${c(ke(e.date).split(", ")[1])} \xB7 ${u("clock",15)} ${c(Pe(e))}</p>
    </div>

    ${p?"":`<p class="detail__lock">${u("eye",14)} Cadastrado por ${c(r)} \u2014 ${s.canComplete(e)?"voc\xEA \xE9 respons\xE1vel: pode marcar o andamento, mas n\xE3o editar.":"voc\xEA s\xF3 pode ver. Use \u201CDuplicar\u201D para criar uma c\xF3pia sua."}</p>`}
    <div class="seg seg--status"${p||s.canComplete(e)?"":" hidden"}>
      ${le.map(n=>`<button class="seg__btn${e.status===n?" is-on":""} st-${n}" data-status="${n}">${n==="feito"?u("check",14):""}${ne[n].label}</button>`).join("")}
    </div>

    ${e.status==="feito"&&(e.assignees||[]).concat(e.createdBy).includes(s.me)&&s.mode==="cloud"?`<button class="storybtn" data-act="story"><span class="storybtn__ic">${u("camera",20)}</span>${(()=>{let n=Ve("w",`e:${e.id}`);return n.ja?"<span><b>Postar outro story</b><small>O b\xF4nus dessa voc\xEA j\xE1 ganhou \u2714\uFE0F \xB7 some em 24 h</small></span></button>":`<span><b>Postar story do que voc\xEA fez</b><small>${n.got?`+${n.total} XP agora`:"Foto tirada agora"}${n.badges[0]?` \xB7 desbloqueia \u201C${c(n.badges[0].name())}\u201D`:n.lv1>n.lv0?` \xB7 sobe pro n\xEDvel ${n.lv1}`:" \xB7 XP em dobro"} \xB7 some em 24 h</small></span><i class="storybtn__x2">2\xD7</i></button>`})()}`:""}
    <ul class="rows">
      ${ae()?"":`<li><span class="rows__k">${u("users",16)} Respons\xE1vel</span><span class="rows__v">${(e.assignees||[]).map(n=>V(n,22)).join("")} ${c(Y(e.assignees))}</span></li>`}
      ${e.location?`<li><span class="rows__k">${u("pin",16)} Local</span><a class="rows__v link" href="https://maps.apple.com/?q=${encodeURIComponent(e.location)}" target="_blank" rel="noopener">${c(e.location)}</a></li>`:""}
      ${$[e.type].kind!=="post"||e.duration?`<li><span class="rows__k">${u("clock",16)} Dura\xE7\xE3o</span><span class="rows__v">${c(se(Le(e)))}</span></li>`:""}
      <li><span class="rows__k">${u("bell",16)} Lembrete</span><span class="rows__v">${c(t?.label||"\u2014")}</span></li>
      ${o?`<li><span class="rows__k">${u("repeat",16)} Repeti\xE7\xE3o</span><span class="rows__v">${o} eventos na s\xE9rie</span></li>`:""}
      ${k.clientLike?`<li><span class="rows__k">${u(e.visibleToClient===!1?"eyeoff":"eye",16)} Cliente</span><span class="rows__v">${e.visibleToClient===!1?"N\xE3o aparece para o cliente":"Aparece no link do cliente"}</span></li>`:""}
    </ul>

    ${e.description?`<div class="textbox"><h4>${c(k.form.desc[0])}</h4><p>${c(e.description)}</p></div>`:""}
    ${e.internalNote?`<div class="textbox textbox--note"><h4>${u("eyeoff",13)} ${c(k.form.note[0])} (${Ze()})</h4><p>${c(e.internalNote)}</p></div>`:""}

    <div class="actions">
      <button data-act="ics">${u("bell",20)}<span>Lembrete no iPhone</span></button>
      ${p?`<button data-act="tomorrow">${u("right",20)}<span>Passar p/ amanh\xE3</span></button>`:""}
      <button data-act="dup">${u("copy",20)}<span>Duplicar</span></button>
      ${p?`<button data-act="del" class="is-danger">${u("trash",20)}<span>Excluir</span></button>`:""}
    </div>
    <p class="detail__meta">Criado por ${c(s.member(e.createdBy)?.name||"\u2014")}${e.updatedAt?" \xB7 atualizado "+new Date(e.updatedAt).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):""}</p>
  </div>`}function nt(a,e){let l=a.el;l.querySelectorAll("[data-status]").forEach(t=>t.onclick=async()=>{let o=s.event(e),p=t.getBoundingClientRect();if(await s.upsert("events",{...o,status:t.dataset.status}),t.dataset.status==="feito"&&o.status!=="feito"&&s.event(e)?.status==="feito"){let r=o.date===L()?s.eventsOn(o.date,{person:s.me}).filter(n=>n.status!=="feito").length:null;w(Re({el:p,left:r}))}});let i=(t,o)=>{let p=l.querySelector(`[data-act="${t}"]`);p&&(p.onclick=o)};i("edit",()=>Qe({id:e})),i("story",()=>{let t=s.event(e);Be({title:t.title||$[t.type]?.label||"",ref:`e:${e}`,kind:"w"})}),i("dup",async()=>{let o={...s.event(e),id:N("e_"),status:"pendente",seriesId:null,createdAt:null,createdBy:null};await s.upsert("events",o),a.close(),w(`${te()} duplicado`),Qe({id:o.id})}),i("tomorrow",async()=>{let t=s.event(e);await ct(t,{date:x(t.date,1)})&&(await s.upsert("events",{...t,date:x(t.date,1)}),w("Movido para "+B(x(t.date,1)).toLowerCase(),{action:"Desfazer",onAction:()=>s.upsert("events",{...s.event(e),date:t.date})}))}),i("ics",()=>{let t=s.event(e);Je([t],`${$[t.type].label}-${t.date}.ics`,Ee.appName)}),i("del",()=>Ye(e,a))}async function Ye(a,e){let l=s.event(a),i=[a];if(l.seriesId){let r=s.state.events.filter(n=>n.seriesId===l.seriesId&&n.date>=l.date).map(n=>n.id);if(r.length>1){let n=await H({title:`Excluir ${q()} repetido`,options:[{label:"S\xF3 este",value:"one",danger:!0},{label:`Este e os pr\xF3ximos (${r.length})`,value:"next",danger:!0}]});if(!n)return;n==="next"&&(i=r)}else if(!await M({title:`Excluir este ${q()}?`,ok:"Excluir",danger:!0}))return}else if(!await M({title:`Excluir este ${q()}?`,text:s.team.length>1?"Ele some da agenda de todos.":"Ele some da sua agenda.",ok:"Excluir",danger:!0}))return;let t=i.map(r=>({...s.event(r)})),o=window.__motion,p=o&&o.guardar([...document.querySelectorAll("#view .ecard")].find(r=>r.dataset.id===a));await s.removeMany("events",i),o&&!s.event(a)&&o.excluido(p),e&&e.close(),w(i.length>1?`${i.length} ${q()}s exclu\xEDdos`:`${te()} exclu\xEDdo`,{action:"Desfazer",onAction:()=>s.upsertMany("events",t),ms:4500})}function Qe({id:a=null,date:e=null,companyId:l=null,type:i=null,time:t=null,assignees:o=null,title:p=""}={}){let r=a?s.event(a):null;if(r&&!s.canEdit("events",r)){s._denied("events",r);return}let n=s.companiesSorted(),f=i||(J.includes("feed")?"feed":J[0]),h=r?JSON.parse(JSON.stringify(r)):{id:N("e_"),type:f,companyId:l||D.monthCompany||(n.length===1?n[0].id:null),title:p||"",date:e||(D.tab==="mes"?D.monthSel:D.date)||L(),time:t||$[f].best[0]||"12:00",duration:["shoot","meeting","work","other"].includes($[f].kind)?$[f].dur:null,assignees:o||(D.person!=="all"?[D.person]:s.me?[s.me]:[]),location:"",description:"",internalNote:"",reminder:30,visibleToClient:$[f].client,status:"pendente"};if(!r&&!t&&!E()){let g=Z(h,{limit:6}).map(d=>d.time).sort();if(g.length)h.time=g[0];else if(h.date===L()){let d=Math.ceil((we()+30)/30)*30;d<1440&&(h.time=ge(d))}}let b=r?JSON.parse(JSON.stringify(r)):null,v={mode:"none",until:x(h.date,28)};return O({className:"sheet--tall",html:et(h,!!r,v),onMount:g=>lt(g,h,b,v)})}function be(a,e){let l=(a.assignees||[]).includes(e.id);return a.notifyPartner===!1?l?`Sem aviso agora. Como ${e.name} \xE9 respons\xE1vel, ele ainda recebe os lembretes do hor\xE1rio.`:`${e.name} n\xE3o recebe aviso nem lembretes deste evento. Fica s\xF3 na agenda.`:`${e.name} recebe o aviso de que voc\xEA marcou e os lembretes do hor\xE1rio.`}var q=()=>E()?"evento":"compromisso",te=()=>E()?"Evento":"Compromisso",ae=()=>s.team.length<2,Ze=()=>ae()?"s\xF3 voc\xEA v\xEA":`s\xF3 ${s.team.length>2?"a equipe":"voc\xEAs"} veem`,ee=a=>["shoot","meeting","work","other"].includes($[a].kind),K=a=>["shoot","meeting"].includes($[a].kind);function et(a,e,l){let i=s.companiesSorted();return`
  ${j(e?`Editar ${q()}`:`Novo ${q()}`,{left:'<button class="btn-text" data-close>Cancelar</button>',right:'<button class="btn btn--primary btn--sm" data-save>Salvar</button>'})}
  <form class="form" data-editor onsubmit="return false">
    ${e?"":He()}
    <div class="fgroup">
      <label class="flabel" for="f-title">T\xEDtulo</label>
      <input id="f-title" class="input" name="title" value="${c(a.title)}" placeholder="${c($[a.type].placeholder)}" autocomplete="off" maxlength="120">
    </div>
    <div class="fgroup">
      <label class="flabel">O que \xE9?</label>
      <div class="typegrid">
        ${J.map(t=>`<button type="button" class="typebtn tbadge--${t}${a.type===t?" is-on":""}"${Ie(t)} data-type="${t}">${u($[t].icon,20)}<span>${$[t].label}</span></button>`).join("")}
      </div>
    </div>

    <div class="fgroup">
      <label class="flabel">${S()}${E()?"":' <em class="tag">opcional</em>'}</label>
      <div class="cogrid">
        ${i.map(t=>`<button type="button" class="cobtn${a.companyId===t.id?" is-on":""}" style="--cc:${t.color}" data-company="${t.id}">${C(t,26,7)}<span>${c(t.name)}</span></button>`).join("")}
        <button type="button" class="cobtn cobtn--add" data-newco>${u("plus",18)}<span>${U()} ${S(!1,!0)}</span></button>
      </div>
    </div>

    ${J.some(t=>$[t].kind==="post")||$[a.type].kind==="post"?`<div class="fgroup" data-when="net" ${$[a.type].kind==="post"?"":"hidden"}>
      <label class="flabel">Onde vai postar?</label>
      <div class="netgrid">${Oe.map(t=>{let o=je(t);return o?`<button type="button" class="netbtn${(a.platform||"instagram")===t?" is-on":""}" data-net="${t}"><span class="pf" style="width:22px;height:22px">${o.svg}</span><span>${c(o.name.replace(" (Twitter)",""))}</span></button>`:""}).join("")}</div>
    </div>`:""}

    <div class="fgroup row2">
      <div><label class="flabel" for="f-date">Dia</label><input id="f-date" class="input" type="date" name="date" value="${a.date}" required></div>
      <div><label class="flabel" for="f-time">Hor\xE1rio</label><input id="f-time" class="input" type="time" name="time" value="${a.time||""}" step="300"></div>
    </div>

    <div class="fgroup" data-when="duration" ${ee(a.type)?"":"hidden"}>
      <label class="flabel" for="f-dur">Dura\xE7\xE3o</label>
      <select id="f-dur" class="input" name="duration">
        ${Ne.map(t=>`<option value="${t}"${(a.duration||$[a.type].dur)===t?" selected":""}>${se(t)}</option>`).join("")}
      </select>
    </div>

    <div data-hint></div>

    <div class="fgroup"${ae()?" hidden":""}>
      <label class="flabel">Quem vai fazer?</label>
      <div class="whogrid">
        ${s.team.map(t=>`<button type="button" class="whobtn${(a.assignees||[]).includes(t.id)?" is-on":""}" style="--mc:${t.color}" data-who="${t.id}">${V(t.id,30)}<span>${c(t.name)}</span><i class="whobtn__check">${u("check",14)}</i></button>`).join("")}
      </div>
      <p class="fhelp">${s.team.length>2?"Marque todos que v\xE3o juntos.":"Marque os dois se forem juntos."}</p>
      ${s.team.filter(t=>t.id!==s.me).map(t=>`<label class="list__row notifyrow"><span><b>${u("bell",15)} Avisar ${t.name==="Matheus"||t.name==="Henrique"?"o ":""}${c(t.name)}</b><small data-notifyhelp>${be(a,t)}</small></span><input type="checkbox" class="switch" name="notifyPartner" ${a.notifyPartner!==!1?"checked":""}></label>`).join("")}
    </div>

    <div class="fgroup" data-when="location" ${K(a.type)?"":"hidden"}>
      <label class="flabel" for="f-loc">Local</label>
      <input id="f-loc" class="input" name="location" value="${c(a.location||"")}" placeholder="Endere\xE7o ou nome do lugar" autocomplete="off">
      <button type="button" class="btn-text btn-text--sm" data-useaddr hidden>${u("pin",14)} Usar o endere\xE7o cadastrado</button>
    </div>

    <div class="fgroup">
      <label class="flabel" for="f-desc">${c(k.form.desc[0])}${k.clientLike?` <em class="tag">${u("eye",12)} cliente v\xEA</em>`:""}</label>
      <textarea id="f-desc" class="input" name="description" rows="3" placeholder="${c(k.form.desc[1])}">${c(a.description||"")}</textarea>
    </div>
    <div class="fgroup">
      <label class="flabel" for="f-note">${c(k.form.note[0])} <em class="tag tag--note">${u("eyeoff",12)} ${Ze()}</em></label>
      <textarea id="f-note" class="input" name="internalNote" rows="2" placeholder="${c(k.form.note[1])}">${c(a.internalNote||"")}</textarea>
    </div>

    <div class="list">
      <label class="list__row"><span>${u("bell",18)} Lembrete</span>
        <select name="reminder">${ie.map(t=>`<option value="${t.v}"${(a.reminder??30)===t.v?" selected":""}>${t.label}</option>`).join("")}</select>
      </label>
      ${e?"":`<label class="list__row"><span>${u("repeat",18)} Repetir</span>
        <select name="repeat">${X.map(t=>`<option value="${t.v}"${l.mode===t.v?" selected":""}>${t.label}</option>`).join("")}</select>
      </label>
      <label class="list__row" data-when="until" hidden><span>${u("calendar",18)} At\xE9</span>
        <input type="date" name="until" value="${l.until}">
      </label>`}
      <label class="list__row"${k.clientLike?"":" hidden"}><span>${u("eye",18)} Aparece no link do cliente</span>
        <input type="checkbox" class="switch" name="visibleToClient" ${a.visibleToClient!==!1?"checked":""}>
      </label>
      ${e?`<label class="list__row"><span>${u("check",18)} Status</span>
        <select name="status">${le.map(t=>`<option value="${t}"${a.status===t?" selected":""}>${ne[t].label}</option>`).join("")}</select>
      </label>`:""}
    </div>

    ${e?`<button type="button" class="btn btn--danger-soft btn--block" data-delete>${u("trash",18)} Excluir ${q()}</button>`:""}
    <div class="form__spacer"></div>
  </form>`}function lt(a,e,l,i){let t=a.el,o=t.querySelector("[data-editor]"),p=d=>t.querySelector(d);l||ze(t,o);let r=()=>{let d=p("[data-hint]");d.innerHTML=rt(e,!l),d.querySelectorAll("[data-settime]").forEach(m=>m.onclick=()=>{e.time=m.dataset.settime,o.time.value=e.time,r()}),d.querySelectorAll("[data-setwho]").forEach(m=>m.onclick=()=>{e.assignees=[m.dataset.setwho],t.querySelectorAll("[data-who]").forEach(y=>y.classList.toggle("is-on",e.assignees.includes(y.dataset.who))),r()})},n=()=>{t.querySelector('[data-when="duration"]').hidden=!ee(e.type);let d=t.querySelector('[data-when="net"]');d&&(d.hidden=$[e.type].kind!=="post"),t.querySelector('[data-when="location"]').hidden=!K(e.type);let m=s.company(e.companyId),y=p("[data-useaddr]");y.hidden=!(m&&m.address&&o.location.value!==m.address);let T=t.querySelector('[data-when="until"]');T&&(T.hidden=i.mode==="none")};t.querySelectorAll("[data-type]").forEach(d=>d.onclick=()=>{let m=e.type;if(e.type=d.dataset.type,t.querySelectorAll("[data-type]").forEach(y=>y.classList.toggle("is-on",y===d)),o.title.placeholder=$[e.type].placeholder,(!l||m!==e.type)&&(e.duration=ee(e.type)?$[e.type].dur:null,o.duration.value=String($[e.type].dur),l||(e.visibleToClient=$[e.type].client,o.visibleToClient.checked=e.visibleToClient)),K(e.type)&&!o.location.value){let y=s.company(e.companyId);y?.address&&(o.location.value=y.address,e.location=y.address)}n(),r()}),t.querySelectorAll("[data-company]").forEach(d=>d.onclick=()=>{e.companyId=d.dataset.company,t.querySelectorAll("[data-company]").forEach(y=>y.classList.toggle("is-on",y===d));let m=s.company(e.companyId);K(e.type)&&m?.address&&!o.location.value&&(o.location.value=m.address,e.location=m.address),n()}),p("[data-newco]").onclick=()=>{me(null,d=>{e.companyId=d.id,h(),a.set(et(e,!!l,i))})},t.querySelectorAll("[data-who]").forEach(d=>d.onclick=()=>{let m=d.dataset.who;e.assignees=e.assignees.includes(m)?e.assignees.filter(_=>_!==m):[...e.assignees,m],d.classList.toggle("is-on",e.assignees.includes(m)),r();let y=t.querySelector("[data-notifyhelp]"),T=s.team.find(_=>_.id!==s.me);y&&T&&(y.textContent=be(e,T))});let f=t.querySelector('input[name="notifyPartner"]');f&&(f.onchange=()=>{e.notifyPartner=f.checked;let d=t.querySelector("[data-notifyhelp]"),m=s.team.find(y=>y.id!==s.me);d&&m&&(d.textContent=be(e,m))}),p("[data-useaddr]").onclick=()=>{let d=s.company(e.companyId);o.location.value=d.address,e.location=d.address,n()},t.querySelectorAll("[data-net]").forEach(d=>d.onclick=()=>{e.platform=d.dataset.net,t.querySelectorAll("[data-net]").forEach(m=>m.classList.toggle("is-on",m===d))});let h=()=>{e.title=Ue(o.title.value.trim(),e.type),$[e.type].kind==="post"&&!e.platform&&(e.platform="instagram"),$[e.type].kind!=="post"&&(e.platform=null),e.date=o.date.value,e.time=o.time.value||"",e.duration=ee(e.type)?Number(o.duration.value):null,e.location=K(e.type)?o.location.value.trim():"",e.description=o.description.value.trim(),e.internalNote=o.internalNote.value.trim(),e.reminder=Number(o.reminder.value),e.visibleToClient=o.visibleToClient.checked,o.status&&(e.status=o.status.value),o.repeat&&(i.mode=o.repeat.value),o.until&&(i.until=o.until.value)};o.addEventListener("input",()=>{h(),n()}),o.addEventListener("change",()=>{h(),n(),r()});let b=p("[data-delete]");b&&(b.onclick=()=>Ye(e.id,null).then(()=>!s.event(e.id)&&a.close())),p("[data-save]").onclick=async()=>{if(h(),!v){if(!e.companyId&&E()){w("Escolha a empresa"),t.querySelector(".cogrid").scrollIntoView({behavior:"smooth",block:"center"});return}if(!e.date)return w("Escolha o dia");if(ae()&&s.me&&!e.assignees.length&&(e.assignees=[s.me]),!(!e.assignees.length&&!await M({title:"Ningu\xE9m respons\xE1vel?",text:`Este ${q()} ficar\xE1 sem respons\xE1vel. Deseja salvar assim mesmo?`,ok:"Salvar assim"}))&&!v){v=!0;try{await z()}finally{v=!1}}}};let v=!1,z=async()=>{if(l){if(["date","time","duration","type","assignees","companyId"].some(m=>JSON.stringify(e[m])!==JSON.stringify(l[m]))&&!await $e(e,!1,a,g))return;await pt(e,l)}else if(i.mode!=="none"){let d=dt(e.date,i),m=d.filter(_=>W({...e,date:_},{isNew:!0}).some(A=>A.level==="block")),y=d;if(m.length){let _=await H({title:`${m.length} de ${d.length} datas j\xE1 t\xEAm compromisso nesse hor\xE1rio`,text:m.slice(0,6).map(A=>R(A)).join(" \xB7 ")+(m.length>6?" \u2026":""),options:[{label:`Criar s\xF3 nas ${d.length-m.length} datas livres`,value:"free",primary:!0},{label:"Criar em todas mesmo assim",value:"all"}]});if(!_)return;if(_==="free"&&(y=d.filter(A=>!m.includes(A))),!y.length)return w("Nenhuma data livre")}let T=N("s_");await s.upsertMany("events",y.map((_,A)=>({...e,id:A===0?e.id:N("e_"),date:_,seriesId:T})),{activity:{notifyPartner:e.notifyPartner,kind:"series",count:y.length,label:`${$[e.type].label} ${X.find(_=>_.v===i.mode)?.label.toLowerCase()||""} \xE0s ${P(e.time)}`,sample:{companyId:e.companyId,date:y[0]}}}),a.close(),de({title:`${y.length} ${q()}s marcados`,sub:`${X.find(_=>_.v===i.mode)?.label||""}${e.time?" \xB7 "+P(e.time):""}`.replace(/^ · /,""),item:{title:`${y.length} ${q()}s`,date:y[0]}});return}else{if(!await $e(e,!0,a,g))return;await s.upsert("events",{...e}),a.close(),de({title:`${te()} marcado`,sub:`${R(e.date)}${e.time?" \xB7 "+P(e.time):""}`,item:{title:e.title||$[e.type]?.label,date:e.date}});return}a.close()};function g(){o.time.value=e.time||"",o.date.value=e.date,t.querySelectorAll("[data-who]").forEach(d=>d.classList.toggle("is-on",e.assignees.includes(d.dataset.who))),n(),r()}n(),r()}var fe=420,Xe=1380,I=a=>(Math.min(Math.max(a,fe),Xe)-fe)/(Xe-fe)*100;function it(a,e){let l=a.time?ue(a):null,i=[8,10,12,14,16,18,20,22];return`<div class="lanes">
    <div class="lanes__head"><strong>${s.team.length>1?`Agenda ${s.team.length===2?"dos dois":"de todos"}`:"Sua agenda"} em ${c(R(a.date))}</strong></div>
    ${s.team.map(t=>{let o=s.eventsOn(a.date,{person:t.id}).filter(n=>n.id!==a.id&&n.time),p=(a.assignees||[]).includes(t.id),r=e.some(n=>n.level==="block"&&n.person===t.id);return`<div class="lane">
        <span class="lane__who">${V(t.id,22)}</span>
        <div class="lane__track">
          ${i.map(n=>`<i class="lane__tick" style="left:${I(n*60)}%"></i>`).join("")}
          ${o.map(n=>{let f=ue(n),h=s.company(n.companyId);return`<span class="lane__ev" style="left:${I(f[0])}%;width:max(4px,${I(f[1])-I(f[0])}%);background:${h?.color||"#888"}" title="${c(Fe(n))}"></span>`}).join("")}
          ${l&&p?`<span class="lane__draft${r?" is-clash":""}" style="left:${I(l[0])}%;width:max(6px,${I(l[1])-I(l[0])}%)"></span>`:""}
        </div>
      </div>`}).join("")}
    <div class="lane lane--axis"><span class="lane__who"></span><div class="lane__track">${i.map(t=>`<small style="left:${I(t*60)}%">${t}h</small>`).join("")}</div></div>
  </div>`}function rt(a,e){if(!a.date)return"";let l=W(a,{isNew:e}),i=l.filter(v=>v.level==="block"),t=l.filter(v=>v.level==="warn"),o=l.filter(v=>v.level==="info"),p=Z(a,{limit:4}),r=pe(a),n=(a.assignees||[]).length===1?a.assignees[0]:null,f=i.length&&n?s.team.find(v=>v.id!==n&&r.includes(v.id)):null,h=$[a.type],b=v=>`<li class="issue issue--${v.level}">${u(v.level==="block"?"alert":v.level==="warn"?"flag":v.code==="partner"?"user":"bulb",15)}<div><strong>${c(v.title)}</strong><p>${c(v.text)}</p></div></li>`;return`
  <section class="assist">
    <header class="assist__head">${u("sparkle",16)} Assistente</header>
    ${it(a,l)}
    ${l.length?`<ul class="issues">${[...i,...t,...o].map(b).join("")}</ul>`:a.time?`<p class="assist__ok">${u("check",15)} Hor\xE1rio livre para ${c(Y(a.assignees))}, sem conflitos.</p>`:""}
    ${f?`<button type="button" class="tchip tchip--wide" data-setwho="${f.id}">${V(f.id,18)} Passar para ${c(f.name)} (est\xE1 livre)</button>`:""}
    <div class="assist__sugg">
      <p>${c(h.tip)}</p>
      ${p.length?`<div class="hintbox__times">${p.map(v=>`<button type="button" class="tchip${a.time===v.time?" is-on":""}" data-settime="${v.time}">${P(v.time)}${v.peak?"<small>pico</small>":"<small>livre</small>"}</button>`).join("")}</div>`:`<p class="muted">Nenhum hor\xE1rio livre nesse dia${(a.assignees||[]).length?" para "+c(Y(a.assignees)):""}. Tente outro dia${s.team.length>1?" ou outra pessoa":""}.</p>`}
    </div>
  </section>`}async function $e(a,e,l,i){let o=W(a,{isNew:e}).filter(b=>b.level==="block");if(!o.length)return!0;let p=Z(a,{limit:2}),r=(a.assignees||[]).length===1?a.assignees[0]:null,n=r&&s.team.find(b=>b.id!==r&&pe(a).includes(b.id)),f=[...p.map(b=>({label:`Mudar para ${P(b.time)} (livre)`,value:"time:"+b.time,primary:!0})),...n?[{label:`Passar para ${n.name} (est\xE1 livre)`,value:"who:"+n.id,primary:!p.length}]:[],{label:"Marcar mesmo assim",value:"force"}],h=await H({title:o[0].code==="duplicate"?"Isso j\xE1 est\xE1 na agenda":"J\xE1 tem compromisso nesse hor\xE1rio",bodyHtml:`<ul class="issues issues--dialog">${o.map(b=>`<li class="issue issue--block">${u("alert",15)}<div><strong>${c(b.title)}</strong><p>${c(b.text)}</p></div></li>`).join("")}</ul>`,options:f});return h?h==="force"?!0:(h.startsWith("time:")&&(a.time=h.slice(5)),h.startsWith("who:")&&(a.assignees=[h.slice(4)]),i(),$e(a,e,l,i)):!1}async function ct(a,e){let l={...a,...e},i=W(l).filter(o=>o.level==="block");return i.length?await H({title:"J\xE1 tem compromisso nesse hor\xE1rio",bodyHtml:`<ul class="issues issues--dialog">${i.map(o=>`<li class="issue issue--block">${u("alert",15)}<div><strong>${c(o.title)}</strong><p>${c(o.text)}</p></div></li>`).join("")}</ul>`,options:[{label:"Mover mesmo assim",value:"force",primary:!0}]})==="force":!0}function dt(a,e){let l=[],i=a,t=e.until&&e.until>=a?e.until:x(a,28);for(;i<=t&&l.length<150;){let o=G(i).getDay();(e.mode==="daily"||e.mode==="weekdays"&&o>=1&&o<=5||e.mode==="weekly"&&G(i).getDay()===G(a).getDay())&&l.push(i),i=x(i,1)}return l}var ut=["type","companyId","title","time","duration","assignees","location","description","internalNote","reminder","visibleToClient"];async function pt(a,e){let l=ut.filter(i=>JSON.stringify(a[i])!==JSON.stringify(e[i]));if(a.seriesId&&l.length){let i=s.state.events.filter(t=>t.seriesId===a.seriesId&&t.date>e.date);if(i.length){let t=await H({title:`${te()} repetido`,text:"Aplicar as altera\xE7\xF5es a quais eventos?",options:[{label:"S\xF3 a este",value:"one",primary:!0},{label:`A este e aos pr\xF3ximos (${i.length+1})`,value:"next"}]});if(!t)return;if(t==="next"){let o=Object.fromEntries(l.map(p=>[p,a[p]]));await s.upsertMany("events",[{...a},...i.map(p=>({...p,...o}))],{activity:{kind:"series-edit",count:i.length+1,label:`${$[a.type].label} \xB7 a partir de ${a.date.slice(8)}/${a.date.slice(5,7)}`,sample:{companyId:a.companyId,date:a.date}}}),w("S\xE9rie atualizada");return}}}await s.upsert("events",{...a}),w("Altera\xE7\xF5es salvas")}export{_t as a,St as b,me as c,Vt as d,Qe as e,ct as f};
