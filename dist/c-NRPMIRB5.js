import{a as We,b as Ge}from"./c-XEXZKSEF.js";import{a as Ke}from"./c-FQ3DTYVO.js";import{a as Fe,b as Je}from"./c-D6XQ4GHN.js";import{a as D}from"./c-3OASPHKA.js";import{e as ee,g as te}from"./c-MXTHWCCC.js";import{b as me,c as Ue,d as W,e as Z,f as ve}from"./c-PR4MQRKU.js";import{g as Ve}from"./c-O6QC77BZ.js";import{D as Qe}from"./c-CGK3QC54.js";import{a as pe}from"./c-BGSOZY67.js";import{d as ze}from"./c-H576GF4M.js";import{a as De,b as Pe,c as Re,d as V,h as Y,j as C,k as He,m as Be,n as de,p as ue,q as N,u as j,v as w,w as M,x as H}from"./c-WXK25V52.js";import{b as u}from"./c-6LZWOCXP.js";import{a as le,b as Ce,d as Ie,e as Ae,g as s}from"./c-UUCDJQE5.js";import{c as Me}from"./c-CIEJVWQB.js";import{a as ge}from"./c-AQ2ADUWO.js";import{a as h,b as J,c as k,e as Te,f as x,h as Le,i as U,j as Oe,l as _,n as Ne,o as ie,p as re,r as Q,s as je,t as ce,u as X}from"./c-JRZKGWYQ.js";import{B as c,D as F,G as qe,c as G,d as L,e as E,f as we,g as ke,k as _e,l as Se,m as P,r as xe,t as Ee,u as z,v as R,w as ne,z as O}from"./c-MPTN5RTT.js";var lt={Empresa:"Pura Vida",Local:"Hospital Santa Clara",Turma:"9\xBA ano B",Obra:"Residencial Aurora",Cliente:"Maria Silva",Setor:"Linha de produ\xE7\xE3o 2",Unidade:"3\xBA Batalh\xE3o",Projeto:"Novo site",Plataforma:"iFood",\u00C1rea:"Talh\xE3o 3",Mat\u00E9ria:"Matem\xE1tica"};function It(){let a=s.companiesSorted(),e=L(),l=we(e),n=E(l,6);return`
  <header class="hdr">
    <div class="hdr__row">
      <div class="hdr__titles"><p class="hdr__eyebrow">${a.length} ${a.length===1?_(!1,!0):_(!0,!0)}</p><h1>${_(!0)}</h1></div>
      <div class="hdr__actions"><button class="btn btn--primary btn--sm" data-action="new-company">${u("plus",16)} ${U()}</button></div>
    </div>
  </header>
  <div class="page">
    ${a.length?"":ue(`${Oe()} ${_(!1,!0)} ainda`,`Cadastre ${k.entity.hint} com nome, cor e foto. Assim cada compromisso fica organizado no lugar certo.`,`<button class="btn btn--primary" data-action="new-company">${u("plus",18)} Cadastrar ${_(!1,!0)}</button>`)}
    <div class="colist">
      ${a.map(t=>{let o=s.eventsBetween(l,n,{companyId:t.id}),d=s.state.events.filter(r=>r.companyId===t.id&&r.date>=e&&r.status!=="feito").sort((r,i)=>(r.date+r.time).localeCompare(i.date+i.time))[0];return`<button class="cocard" style="--cc:${t.color};--cc-soft:${F(t.color,.1)}" data-action="open-company" data-id="${t.id}">
          <div class="cocard__top">
            ${C(t,48)}
            <div class="cocard__name"><strong>${c(t.name)}</strong><small>${d?`<b>${c(z(d.date))}${d.time?" "+d.time:""}</b> \xB7 ${c(d.title||h[d.type].label)}`:"Nada agendado"}</small></div>${o.length?`<em class="cocard__n" title="nesta semana">${o.length}</em>`:""}
            ${u("right",18,"muted")}
          </div>
        </button>`}).join("")}
    </div>
  </div>`}function At(a){let e=N({className:"sheet--tall",html:Xe(a),onMount:l=>it(l,a)});e.refresh=()=>s.company(a)?e.set(Xe(a)):e.close()}function Xe(a){let e=s.company(a);if(!e)return"";let l=L(),n=ke(l),t=s.eventsBetween(`${n}-01`,`${n}-31`,{companyId:a}),o=s.eventsBetween(l,E(l,30),{companyId:a}),d=s.eventsBetween(E(l,-14),E(l,-1),{companyId:a}).reverse(),r=$=>t.filter(f=>$.includes(f.type)).length,i=t.filter($=>$.status==="feito").length,m="",b=o.map($=>{let f=$.date!==m?`<h4 class="dayhead">${c(R($.date))}</h4>`:"";return m=$.date,f+de($)}).join("");return`
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
      <h2 class="block__title">${c(Ee(n))}</h2>
      <div class="mstats mstats--5">
        <div><b>${r(["feed","carrossel"])}</b><span>feed</span></div>
        <div><b>${r(["reels"])}</b><span>reels</span></div>
        <div><b>${r(["story"])}</b><span>stories</span></div>
        <div><b>${r(["captacao"])}</b><span>capta\xE7\xF5es</span></div>
        <div><b>${t.length?Math.round(i/t.length*100):0}%</b><span>feito</span></div>
      </div>
    </section>

    ${e.address||e.contact||e.notes?`<ul class="rows">
      ${e.address?`<li><span class="rows__k">${u("pin",16)} Endere\xE7o</span><a class="rows__v link" href="https://maps.apple.com/?q=${encodeURIComponent(e.address)}" target="_blank" rel="noopener">${c(e.address)}</a></li>`:""}
      ${e.contact?`<li><span class="rows__k">${u("user",16)} Contato</span><span class="rows__v">${c(e.contact)}</span></li>`:""}
      ${e.notes?`<li><span class="rows__k">${u("note",16)} Observa\xE7\xF5es</span><span class="rows__v">${c(e.notes)}</span></li>`:""}
    </ul>`:""}

    <section class="block">
      <h2 class="block__title">Pr\xF3ximos 30 dias</h2>
      ${b||ue("Nada agendado","Toque em + para marcar o primeiro compromisso aqui.")}
    </section>

    ${d.length?`<section class="block">
      <h2 class="block__title">\xDAltimas 2 semanas</h2>
      ${d.map($=>de($,{showDate:!0,compact:!0})).join("")}
    </section>`:""}
    ${s.canEdit("companies",e)?`<button type="button" class="btn btn--danger-soft btn--block" data-act="delete">${u("trash",18)} Excluir ${_(!1,!0)}</button>`:""}
  </div>`}function it(a,e){let l=a.el;(l.querySelector('[data-act="edit"]')||{}).onclick=()=>fe(e),l.querySelector('[data-act="new"]').onclick=async()=>{let{openEventEditor:t}=await import("./c-72WONJN6.js");t({companyId:e})};let n=(t,o)=>{let d=l.querySelector(`[data-act="${t}"]`);d&&(d.onclick=o)};n("share",()=>be(e)),n("clientview",()=>rt(e)),n("delete",()=>Ye(e,{onDone:()=>a.close()}))}async function Ye(a,{onDone:e}={}){let l=s.company(a);if(!l)return!1;let n=s.state.events.filter(r=>r.companyId===a);if(!await M({title:`Excluir ${l.name}?`,text:n.length?`${n.length===1?"O compromisso daqui vai":`Os ${n.length} compromissos daqui v\xE3o`} junto para a lixeira por 24 horas. O link do cliente deixa de funcionar.`:"Vai para a lixeira por 24 horas. O link do cliente deixa de funcionar.",html:n.length?te([...n].sort((r,i)=>r.date<i.date?-1:1)):"",ok:"Excluir",danger:!0}))return!1;let o=s.company(a);if(!o)return!1;if(!s.canEdit("companies",o))return s._denied("companies",o),!1;let d=Me();return n.length&&await s.removeMany("events",n.map(r=>r.id),{via:"empresa",lote:d}),await s.remove("companies",a,{via:"empresa",lote:d}),e&&e(),ee(d,`${l.name} exclu\xEDda${n.length?` com ${n.length} ${n.length===1?"compromisso":"compromissos"}`:""}`),!0}function fe(a=null,e=null){let l=a?s.company(a):null,n=s.state.companies.map(r=>r.color),t=l?{...l}:{id:O("c_"),name:"",color:Q.find(r=>!n.includes(r))||Q[0],logo:null,instagram:"",address:"",contact:"",notes:"",shareToken:null},o=()=>`
    ${j(l?`Editar ${_(!1,!0)}`:`${U()} ${_(!1,!0)}`,{left:'<button class="btn-text" data-close>Cancelar</button>',right:'<button class="btn btn--primary btn--sm" data-save>Salvar</button>'})}
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
        <input id="c-name" class="input" name="name" value="${c(t.name)}" placeholder="Ex.: ${c(lt[k.entity.one]||"Pura Vida")}" autocomplete="off" maxlength="60">
      </div>
      <div class="fgroup">
        <label class="flabel">Cor no calend\xE1rio</label>
        <div class="palette">
          ${Q.map(r=>`<button type="button" class="swatch${t.color===r?" is-on":""}" style="background:${r}" data-color="${r}" aria-label="Cor ${r}">${u("check",16)}</button>`).join("")}
          <label class="swatch swatch--custom" title="Outra cor"><input type="color" value="${t.color}" data-customcolor>${u("plus",16)}</label>
        </div>
      </div>
      <div class="fgroup"${x()?"":" hidden"}>
        <label class="flabel" for="c-ig">Instagram</label>
        <div class="input-prefix"><span>@</span><input id="c-ig" class="input" name="instagram" value="${c(t.instagram||"")}" placeholder="usuario" autocomplete="off" autocapitalize="none"></div>
      </div>
      <div class="fgroup"${s.team.length>1?"":" hidden"}>
        <label class="flabel">Notifica\xE7\xF5es daqui v\xE3o para</label>
        <div class="seg seg--notify">${[["",s.team.length===2?"Os dois":"Todos"],...s.team.map(r=>[r.id,r.name])].map(([r,i])=>`<button type="button" class="seg__btn${(t.notifyOnly||"")===r?" is-on":""}" data-only="${r}">${c(i)}</button>`).join("")}</div>
        <p class="fhelp">${x()?"Avisos, lembretes, \u201CJ\xE1 postou?\u201D, cobran\xE7as de atraso e dicas desta empresa":`Avisos, lembretes e cobran\xE7as de atraso ${Le()?"desta":"deste"} ${c(_(!1,!0))}`} chegam s\xF3 para quem estiver marcado.</p>
      </div>
      <div class="fgroup"${x()?"":" hidden"}>
        <label class="flabel" for="c-niche">O que a empresa faz (para as dicas)</label>
        <input id="c-niche" class="input" name="niche" value="${c(t.niche||Ge(t))}" placeholder="Ex.: hamburgueria artesanal, loja de roupas femininas" autocomplete="off" maxlength="160">
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-addr">Endere\xE7o</label>
        <input id="c-addr" class="input" name="address" value="${c(t.address||"")}" placeholder="Rua, n\xFAmero \u2013 bairro" autocomplete="off">
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-contact">Contato</label>
        <input id="c-contact" class="input" name="contact" value="${c(t.contact||"")}" placeholder="${x()?"Nome e WhatsApp do respons\xE1vel":"Telefone, respons\xE1vel, hor\xE1rio\u2026"}" autocomplete="off">
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-notes">${x()?"Observa\xE7\xF5es internas":"Observa\xE7\xF5es"}</label>
        <textarea id="c-notes" class="input" name="notes" rows="3" placeholder="${x()?"Tom de voz, o que evitar, prefer\xEAncias\u2026":"Tudo o que voc\xEA precisa lembrar sobre esse lugar\u2026"}">${c(t.notes||"")}</textarea>
      </div>
      ${l?`<button type="button" class="btn btn--danger-soft btn--block" data-delete>${u("trash",18)} Excluir ${_(!1,!0)}</button>`:""}
      <div class="form__spacer"></div>
    </form>`,d=r=>{let i=r.el,m=i.querySelector("form"),b=()=>{t.name=m.name.value.trim(),t.instagram=m.instagram.value.trim().replace(/^@/,""),t.niche=m.niche.value.trim(),t.notifyOnly=i.querySelector("[data-only].is-on")?.dataset.only||null,t.address=m.address.value.trim(),t.contact=m.contact.value.trim(),t.notes=m.notes.value.trim()},$=()=>i.querySelector("[data-preview]").innerHTML=C({...t,name:m.name.value||"?"},88,24);m.name.addEventListener("input",$),i.querySelectorAll("[data-only]").forEach(g=>g.onclick=()=>i.querySelectorAll("[data-only]").forEach(p=>p.classList.toggle("is-on",p===g))),i.querySelectorAll("[data-color]").forEach(g=>g.onclick=()=>{t.color=g.dataset.color,i.querySelectorAll("[data-color]").forEach(p=>p.classList.toggle("is-on",p===g)),$()}),i.querySelector("[data-customcolor]").oninput=g=>{t.color=g.target.value,i.querySelectorAll("[data-color]").forEach(p=>p.classList.remove("is-on")),$()},i.querySelector("[data-file]").onchange=async g=>{let p=g.target.files[0];if(p)try{b(),t.logo=await qe(p,160),r.set(o())}catch{w("N\xE3o foi poss\xEDvel ler essa imagem")}};let f=i.querySelector("[data-rmlogo]");f&&(f.onclick=()=>{b(),t.logo=null,r.set(o())});let B=i.querySelector("[data-delete]");B&&(B.onclick=()=>Ye(t.id,{onDone:()=>r.close()})),i.querySelector("[data-save]").onclick=async()=>{if(b(),!t.name)return m.name.focus(),w("Digite o nome");await s.upsert("companies",{...t}),r.close(),w(l?"Atualizado":"Cadastrado"),e&&e(s.company(t.id))}};N({className:"sheet--tall",html:o(),onMount:d})}async function be(a){let e=s.company(a),l=s.mode==="cloud",n="";l?(await s.ensureShareToken(e),await s.publishCompany(a),n=Ie(s.company(a).shareToken)):n=Ae(await Ce(le(e,s.state.events,{maxFuture:90})));let t=`
    ${j("Link do cliente")}
    <div class="share">
      <div class="share__co">${C(e,56)}<div><strong>${c(e.name)}</strong><small>v\xEA somente o pr\xF3prio cronograma</small></div></div>
      <ul class="checks">
        <li>${u("check",16)} Somente os eventos da ${c(e.name)}</li>
        <li>${u("check",16)} Sem notas internas e sem outras empresas</li>
        <li>${u("check",16)} Somente leitura: o cliente n\xE3o consegue alterar nada</li>
        <li>${u(l?"check":"alert",16)} ${l?"Sempre atualizado: tudo que voc\xEAs mudarem aparece para o cliente":"Foto do cronograma atual (pr\xF3ximos 90 dias). Quando mudar algo, envie o link de novo"}</li>
      </ul>
      <div class="share__link"><input readonly value="${c(n)}" data-link></div>
      <div class="share__btns">
        <button class="btn btn--primary btn--block" data-sharebtn>${u("share",18)} Enviar para o cliente</button>
        <button class="btn btn--soft btn--block" data-copy>${u("copy",18)} Copiar link</button>
        <a class="btn btn--ghost btn--block" href="${c(n)}" target="_blank" rel="noopener">${u("eye",18)} Ver como o cliente v\xEA</a>
      </div>
      ${l?'<button class="btn-text btn-text--sm btn-text--danger" data-revoke>Gerar novo link (o antigo para de funcionar)</button>':'<p class="fhelp">Dica: ative a sincroniza\xE7\xE3o na nuvem (Ajustes) para o link ficar sempre atualizado automaticamente.</p>'}
    </div>`;N({html:t,onMount:o=>{let d=o.el;d.querySelector("[data-copy]").onclick=async()=>{try{await navigator.clipboard.writeText(n),w("Link copiado")}catch{d.querySelector("[data-link]").select(),w("Selecione e copie o link")}},d.querySelector("[data-sharebtn]").onclick=async()=>{let i=`Ol\xE1! Este \xE9 o cronograma de conte\xFAdo da ${e.name}. Por aqui voc\xEAs acompanham tudo o que est\xE1 planejado: posts, stories, reels e capta\xE7\xF5es.`;if(navigator.share)try{await navigator.share({title:`Cronograma \xB7 ${e.name}`,text:i,url:n})}catch{}else await navigator.clipboard?.writeText(`${i}
${n}`),w("Mensagem copiada")};let r=d.querySelector("[data-revoke]");r&&(r.onclick=async()=>{await M({title:"Gerar um novo link?",text:"Quem tiver o link antigo n\xE3o conseguir\xE1 mais ver o cronograma.",ok:"Gerar novo link",danger:!0})&&(await s.regenerateShareToken(s.company(a)),o.close(),be(a))})}})}async function rt(a){let e=s.company(a);if(!e)return;let{showClient:l}=await import("./c-WSTZE5TF.js"),{sanitizePayload:n}=await import("./c-A2K3DQIA.js"),t=n(le(e,s.state.events)),o=document.createElement("div");o.className="client-preview",o.innerHTML=`<div class="client-preview__bar"><button class="btn btn--soft btn--sm" data-closepv>${u("left",16)} Voltar</button><span>Assim o cliente v\xEA</span><button class="btn btn--primary btn--sm" data-sendpv>${u("share",16)} Enviar</button></div><div class="client-preview__body"></div>`,document.body.appendChild(o),document.body.classList.add("has-sheet"),l(o.querySelector(".client-preview__body"),t,{canGoBack:!1,preview:!0});let d=()=>{o.remove(),document.body.classList.toggle("has-sheet",!!document.querySelector(".sheet-wrap"))};o.querySelector("[data-closepv]").onclick=d,o.querySelector("[data-sendpv]").onclick=()=>{d(),be(a)}}function Zt(a){let e=N({html:Ze(a),className:"sheet--tall",onMount:l=>ct(l,a)});e.refresh=()=>{if(!s.event(a))return e.close();e.set(Ze(a))}}function Ze(a){let e=s.event(a);if(!e)return"";let l=s.company(e.companyId),n=l?.color||"#666",t=ce.find(i=>i.v===(e.reminder??30)),o=e.seriesId?s.state.events.filter(i=>i.seriesId===e.seriesId).length:0,d=s.canEdit("events",e),r=s.member(s.ownerOf("events",e))?.name||"o parceiro";return`
  ${j("",{right:d?'<button class="btn-text" data-act="edit">Editar</button>':""})}
  <div class="detail">
    <div class="detail__hero" style="--cc:${n};--cc-soft:${F(n,.12)}">
      <div class="detail__co">${C(l,40)}<div><strong>${c(l?.name||"Sem "+_(!1,!0))}</strong>${l?.instagram?`<small>@${c(l.instagram)}</small>`:""}</div>${He(e.type,{solid:!0})}</div>
      <h2><span class="pfrow">${Re(e,24)}</span>${c(e.title||h[e.type].label)}</h2>
      <p class="detail__when">${u("calendar",15)} ${c(z(e.date))}, ${c(xe(e.date).split(", ")[1])} \xB7 ${u("clock",15)} ${c(Be(e))}</p>
    </div>

    ${d?"":`<p class="detail__lock">${u("eye",14)} Cadastrado por ${c(r)} \u2014 ${s.canComplete(e)?"voc\xEA \xE9 respons\xE1vel: pode marcar o andamento, mas n\xE3o editar.":"voc\xEA s\xF3 pode ver. Use \u201CDuplicar\u201D para criar uma c\xF3pia sua."}</p>`}
    <div class="seg seg--status"${d||s.canComplete(e)?"":" hidden"}>
      ${re.map(i=>`<button class="seg__btn${e.status===i?" is-on":""} st-${i}" data-status="${i}">${i==="feito"?u("check",14):""}${ie[i].label}</button>`).join("")}
    </div>

    ${e.status==="feito"&&(e.assignees||[]).concat(e.createdBy).includes(s.me)&&s.mode==="cloud"?`<button class="storybtn" data-act="story"><span class="storybtn__ic">${u("camera",20)}</span>${(()=>{let i=Qe("w",`e:${e.id}`);return i.ja?"<span><b>Postar outro story</b><small>O b\xF4nus dessa voc\xEA j\xE1 ganhou \u2714\uFE0F \xB7 some em 24 h</small></span></button>":`<span><b>Postar story do que voc\xEA fez</b><small>${i.got?`+${i.total} XP agora`:"Foto tirada agora"}${i.badges[0]?` \xB7 desbloqueia \u201C${c(i.badges[0].name())}\u201D`:i.lv1>i.lv0?` \xB7 sobe pro n\xEDvel ${i.lv1}`:" \xB7 XP em dobro"} \xB7 some em 24 h</small></span><i class="storybtn__x2">2\xD7</i></button>`})()}`:""}
    <ul class="rows">
      ${oe()?"":`<li><span class="rows__k">${u("users",16)} Respons\xE1vel</span><span class="rows__v">${(e.assignees||[]).map(i=>V(i,22)).join("")} ${c(Y(e.assignees))}</span></li>`}
      ${e.location?`<li><span class="rows__k">${u("pin",16)} Local</span><a class="rows__v link" href="https://maps.apple.com/?q=${encodeURIComponent(e.location)}" target="_blank" rel="noopener">${c(e.location)}</a></li>`:""}
      ${h[e.type].kind!=="post"||e.duration?`<li><span class="rows__k">${u("clock",16)} Dura\xE7\xE3o</span><span class="rows__v">${c(ne(Ne(e)))}</span></li>`:""}
      <li><span class="rows__k">${u("bell",16)} Lembrete</span><span class="rows__v">${c(t?.label||"\u2014")}</span></li>
      ${o?`<li><span class="rows__k">${u("repeat",16)} Repeti\xE7\xE3o</span><span class="rows__v">${o} eventos na s\xE9rie</span></li>`:""}
      ${k.clientLike?`<li><span class="rows__k">${u(e.visibleToClient===!1?"eyeoff":"eye",16)} Cliente</span><span class="rows__v">${e.visibleToClient===!1?"N\xE3o aparece para o cliente":"Aparece no link do cliente"}</span></li>`:""}
    </ul>

    ${e.description?`<div class="textbox"><h4>${c(k.form.desc[0])}</h4><p>${c(e.description)}</p></div>`:""}
    ${e.internalNote?`<div class="textbox textbox--note"><h4>${u("eyeoff",13)} ${c(k.form.note[0])} (${st()})</h4><p>${c(e.internalNote)}</p></div>`:""}

    <div class="actions">
      <button data-act="ics">${u("bell",20)}<span>Lembrete no iPhone</span></button>
      ${d?`<button data-act="tomorrow">${u("right",20)}<span>Passar p/ amanh\xE3</span></button>`:""}
      <button data-act="dup">${u("copy",20)}<span>Duplicar</span></button>
      ${d?`<button data-act="del" class="is-danger">${u("trash",20)}<span>Excluir</span></button>`:""}
    </div>
    <p class="detail__meta">Criado por ${c(s.member(e.createdBy)?.name||"\u2014")}${e.updatedAt?" \xB7 atualizado "+new Date(e.updatedAt).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):""}</p>
  </div>`}function ct(a,e){let l=a.el;l.querySelectorAll("[data-status]").forEach(t=>t.onclick=async()=>{let o=s.event(e),d=t.getBoundingClientRect();if(await s.upsert("events",{...o,status:t.dataset.status}),t.dataset.status==="feito"&&o.status!=="feito"&&s.event(e)?.status==="feito"){let r=o.date===L()?s.eventsOn(o.date,{person:s.me}).filter(i=>i.status!=="feito").length:null;w(ze({el:d,left:r}))}});let n=(t,o)=>{let d=l.querySelector(`[data-act="${t}"]`);d&&(d.onclick=o)};n("edit",()=>et({id:e})),n("story",()=>{let t=s.event(e);Ve({title:t.title||h[t.type]?.label||"",ref:`e:${e}`,kind:"w"})}),n("dup",async()=>{let o={...s.event(e),id:O("e_"),status:"pendente",seriesId:null,createdAt:null,createdBy:null};await s.upsert("events",o),a.close(),w(`${se()} duplicado`),et({id:o.id})}),n("tomorrow",async()=>{let t=s.event(e);await mt(t,{date:E(t.date,1)})&&(await s.upsert("events",{...t,date:E(t.date,1)}),w("Movido para "+z(E(t.date,1)).toLowerCase(),{action:"Desfazer",onAction:()=>s.upsert("events",{...s.event(e),date:t.date})}))}),n("ics",()=>{let t=s.event(e);We([t],`${h[t.type].label}-${t.date}.ics`,ge.appName)}),n("del",()=>at(e,a))}async function at(a,e){let l=s.event(a),n=[a];if(l.seriesId){let i=s.state.events.filter(m=>m.seriesId===l.seriesId&&m.date>=l.date).map(m=>m.id);if(i.length>1){let m=await H({title:`Excluir ${q()} repetido`,bodyHtml:te(s.state.events.filter(b=>b.seriesId===l.seriesId&&b.date>=l.date).sort((b,$)=>b.date<$.date?-1:1)),options:[{label:"S\xF3 este",value:"one",danger:!0},{label:`Este e os pr\xF3ximos (${i.length})`,value:"next",danger:!0}]});if(!m)return;m==="next"&&(n=i)}else if(!await M({title:`Excluir este ${q()}?`,ok:"Excluir",danger:!0}))return}else if(!await M({title:`Excluir este ${q()}?`,text:s.team.length>1?"Ele some da agenda de todos.":"Ele some da sua agenda.",ok:"Excluir",danger:!0}))return;let t=n.map(i=>s.event(i)).filter(Boolean),o=window.__motion,d=o&&o.guardar([...document.querySelectorAll("#view .ecard")].find(i=>i.dataset.id===a)),r=await s.removeMany("events",n,{via:t.length>1?"lote":"manual"});o&&!s.event(a)&&o.excluido(d),e&&e.close(),ee(r,n.length>1?`${n.length} ${q()}s exclu\xEDdos`:`${se()} exclu\xEDdo`)}function et({id:a=null,date:e=null,companyId:l=null,type:n=null,time:t=null,assignees:o=null,title:d=""}={}){let r=a?s.event(a):null;if(r&&!s.canEdit("events",r)){s._denied("events",r);return}let i=s.companiesSorted(),m=n||(J.includes("feed")?"feed":J[0]),b=r?JSON.parse(JSON.stringify(r)):{id:O("e_"),type:m,companyId:l||D.monthCompany||(i.length===1?i[0].id:null),title:d||"",date:e||(D.tab==="mes"?D.monthSel:D.date)||L(),time:t||h[m].best[0]||"12:00",duration:["shoot","meeting","work","other"].includes(h[m].kind)?h[m].dur:null,assignees:o||(D.person!=="all"?[D.person]:s.me?[s.me]:[]),location:"",description:"",internalNote:"",reminder:30,visibleToClient:h[m].client,status:"pendente"};if(!r&&!t&&!x()){let g=Z(b,{limit:6}).map(p=>p.time).sort();if(g.length)b.time=g[0];else if(b.date===L()){let p=Math.ceil((Se()+30)/30)*30;p<1440&&(b.time=_e(p))}}let $=r?JSON.parse(JSON.stringify(r)):null,f={mode:"none",until:E(b.date,28)};return N({className:"sheet--tall",html:ot(b,!!r,f),onMount:g=>dt(g,b,$,f)})}function he(a,e){let l=(a.assignees||[]).includes(e.id);return a.notifyPartner===!1?l?`Sem aviso agora. Como ${e.name} \xE9 respons\xE1vel, ele ainda recebe os lembretes do hor\xE1rio.`:`${e.name} n\xE3o recebe aviso nem lembretes deste evento. Fica s\xF3 na agenda.`:`${e.name} recebe o aviso de que voc\xEA marcou e os lembretes do hor\xE1rio.`}var q=()=>x()?"evento":"compromisso",se=()=>x()?"Evento":"Compromisso",oe=()=>s.team.length<2,st=()=>oe()?"s\xF3 voc\xEA v\xEA":`s\xF3 ${s.team.length>2?"a equipe":"voc\xEAs"} veem`,ae=a=>["shoot","meeting","work","other"].includes(h[a].kind),K=a=>["shoot","meeting"].includes(h[a].kind);function ot(a,e,l){let n=s.companiesSorted();return`
  ${j(e?`Editar ${q()}`:`Novo ${q()}`,{left:'<button class="btn-text" data-close>Cancelar</button>',right:'<button class="btn btn--primary btn--sm" data-save>Salvar</button>'})}
  <form class="form" data-editor onsubmit="return false">
    ${e?"":Fe()}
    <div class="fgroup">
      <label class="flabel" for="f-title">T\xEDtulo</label>
      <input id="f-title" class="input" name="title" value="${c(a.title)}" placeholder="${c(h[a.type].placeholder)}" autocomplete="off" maxlength="120">
    </div>
    <div class="fgroup">
      <label class="flabel">O que \xE9?</label>
      <div class="typegrid">
        ${J.map(t=>`<button type="button" class="typebtn tbadge--${t}${a.type===t?" is-on":""}"${Te(t)} data-type="${t}">${u(h[t].icon,20)}<span>${h[t].label}</span></button>`).join("")}
      </div>
    </div>

    <div class="fgroup">
      <label class="flabel">${_()}${x()?"":' <em class="tag">opcional</em>'}</label>
      <div class="cogrid">
        ${n.map(t=>`<button type="button" class="cobtn${a.companyId===t.id?" is-on":""}" style="--cc:${t.color}" data-company="${t.id}">${C(t,26,7)}<span>${c(t.name)}</span></button>`).join("")}
        <button type="button" class="cobtn cobtn--add" data-newco>${u("plus",18)}<span>${U()} ${_(!1,!0)}</span></button>
      </div>
    </div>

    ${J.some(t=>h[t].kind==="post")||h[a.type].kind==="post"?`<div class="fgroup" data-when="net" ${h[a.type].kind==="post"?"":"hidden"}>
      <label class="flabel">Onde vai postar?</label>
      <div class="netgrid">${De.map(t=>{let o=Pe(t);return o?`<button type="button" class="netbtn${(a.platform||"instagram")===t?" is-on":""}" data-net="${t}"><span class="pf" style="width:22px;height:22px">${o.svg}</span><span>${c(o.name.replace(" (Twitter)",""))}</span></button>`:""}).join("")}</div>
    </div>`:""}

    <div class="fgroup row2">
      <div><label class="flabel" for="f-date">Dia</label><input id="f-date" class="input" type="date" name="date" value="${a.date}" required></div>
      <div><label class="flabel" for="f-time">Hor\xE1rio</label><input id="f-time" class="input" type="time" name="time" value="${a.time||""}" step="300"></div>
    </div>

    <div class="fgroup" data-when="duration" ${ae(a.type)?"":"hidden"}>
      <label class="flabel" for="f-dur">Dura\xE7\xE3o</label>
      <select id="f-dur" class="input" name="duration">
        ${je.map(t=>`<option value="${t}"${(a.duration||h[a.type].dur)===t?" selected":""}>${ne(t)}</option>`).join("")}
      </select>
    </div>

    <div data-hint></div>

    <div class="fgroup"${oe()?" hidden":""}>
      <label class="flabel">Quem vai fazer?</label>
      <div class="whogrid">
        ${s.team.map(t=>`<button type="button" class="whobtn${(a.assignees||[]).includes(t.id)?" is-on":""}" style="--mc:${t.color}" data-who="${t.id}">${V(t.id,30)}<span>${c(t.name)}</span><i class="whobtn__check">${u("check",14)}</i></button>`).join("")}
      </div>
      <p class="fhelp">${s.team.length>2?"Marque todos que v\xE3o juntos.":"Marque os dois se forem juntos."}</p>
      ${s.team.filter(t=>t.id!==s.me).map(t=>`<label class="list__row notifyrow"><span><b>${u("bell",15)} Avisar ${t.name==="Matheus"||t.name==="Henrique"?"o ":""}${c(t.name)}</b><small data-notifyhelp>${he(a,t)}</small></span><input type="checkbox" class="switch" name="notifyPartner" ${a.notifyPartner!==!1?"checked":""}></label>`).join("")}
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
      <label class="flabel" for="f-note">${c(k.form.note[0])} <em class="tag tag--note">${u("eyeoff",12)} ${st()}</em></label>
      <textarea id="f-note" class="input" name="internalNote" rows="2" placeholder="${c(k.form.note[1])}">${c(a.internalNote||"")}</textarea>
    </div>

    <div class="list">
      <label class="list__row"><span>${u("bell",18)} Lembrete</span>
        <select name="reminder">${ce.map(t=>`<option value="${t.v}"${(a.reminder??30)===t.v?" selected":""}>${t.label}</option>`).join("")}</select>
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
        <select name="status">${re.map(t=>`<option value="${t}"${a.status===t?" selected":""}>${ie[t].label}</option>`).join("")}</select>
      </label>`:""}
    </div>

    ${e?`<button type="button" class="btn btn--danger-soft btn--block" data-delete>${u("trash",18)} Excluir ${q()}</button>`:""}
    <div class="form__spacer"></div>
  </form>`}function dt(a,e,l,n){let t=a.el,o=t.querySelector("[data-editor]"),d=p=>t.querySelector(p);l||Je(t,o);let r=()=>{let p=d("[data-hint]");p.innerHTML=pt(e,!l),p.querySelectorAll("[data-settime]").forEach(v=>v.onclick=()=>{e.time=v.dataset.settime,o.time.value=e.time,r()}),p.querySelectorAll("[data-setwho]").forEach(v=>v.onclick=()=>{e.assignees=[v.dataset.setwho],t.querySelectorAll("[data-who]").forEach(y=>y.classList.toggle("is-on",e.assignees.includes(y.dataset.who))),r()})},i=()=>{t.querySelector('[data-when="duration"]').hidden=!ae(e.type);let p=t.querySelector('[data-when="net"]');p&&(p.hidden=h[e.type].kind!=="post"),t.querySelector('[data-when="location"]').hidden=!K(e.type);let v=s.company(e.companyId),y=d("[data-useaddr]");y.hidden=!(v&&v.address&&o.location.value!==v.address);let A=t.querySelector('[data-when="until"]');A&&(A.hidden=n.mode==="none")};t.querySelectorAll("[data-type]").forEach(p=>p.onclick=()=>{let v=e.type;if(e.type=p.dataset.type,t.querySelectorAll("[data-type]").forEach(y=>y.classList.toggle("is-on",y===p)),o.title.placeholder=h[e.type].placeholder,(!l||v!==e.type)&&(e.duration=ae(e.type)?h[e.type].dur:null,o.duration.value=String(h[e.type].dur),l||(e.visibleToClient=h[e.type].client,o.visibleToClient.checked=e.visibleToClient)),K(e.type)&&!o.location.value){let y=s.company(e.companyId);y?.address&&(o.location.value=y.address,e.location=y.address)}i(),r()}),t.querySelectorAll("[data-company]").forEach(p=>p.onclick=()=>{e.companyId=p.dataset.company,t.querySelectorAll("[data-company]").forEach(y=>y.classList.toggle("is-on",y===p));let v=s.company(e.companyId);K(e.type)&&v?.address&&!o.location.value&&(o.location.value=v.address,e.location=v.address),i()}),d("[data-newco]").onclick=()=>{fe(null,p=>{e.companyId=p.id,b(),a.set(ot(e,!!l,n))})},t.querySelectorAll("[data-who]").forEach(p=>p.onclick=()=>{let v=p.dataset.who;e.assignees=e.assignees.includes(v)?e.assignees.filter(S=>S!==v):[...e.assignees,v],p.classList.toggle("is-on",e.assignees.includes(v)),r();let y=t.querySelector("[data-notifyhelp]"),A=s.team.find(S=>S.id!==s.me);y&&A&&(y.textContent=he(e,A))});let m=t.querySelector('input[name="notifyPartner"]');m&&(m.onchange=()=>{e.notifyPartner=m.checked;let p=t.querySelector("[data-notifyhelp]"),v=s.team.find(y=>y.id!==s.me);p&&v&&(p.textContent=he(e,v))}),d("[data-useaddr]").onclick=()=>{let p=s.company(e.companyId);o.location.value=p.address,e.location=p.address,i()},t.querySelectorAll("[data-net]").forEach(p=>p.onclick=()=>{e.platform=p.dataset.net,t.querySelectorAll("[data-net]").forEach(v=>v.classList.toggle("is-on",v===p))});let b=()=>{e.title=Ke(o.title.value.trim(),e.type),h[e.type].kind==="post"&&!e.platform&&(e.platform="instagram"),h[e.type].kind!=="post"&&(e.platform=null),e.date=o.date.value,e.time=o.time.value||"",e.duration=ae(e.type)?Number(o.duration.value):null,e.location=K(e.type)?o.location.value.trim():"",e.description=o.description.value.trim(),e.internalNote=o.internalNote.value.trim(),e.reminder=Number(o.reminder.value),e.visibleToClient=o.visibleToClient.checked,o.status&&(e.status=o.status.value),o.repeat&&(n.mode=o.repeat.value),o.until&&(n.until=o.until.value)};o.addEventListener("input",()=>{b(),i()}),o.addEventListener("change",()=>{b(),i(),r()});let $=d("[data-delete]");$&&($.onclick=()=>at(e.id,null).then(()=>!s.event(e.id)&&a.close())),d("[data-save]").onclick=async()=>{if(b(),!f){if(!e.companyId&&x()){w("Escolha a empresa"),t.querySelector(".cogrid").scrollIntoView({behavior:"smooth",block:"center"});return}if(!e.date)return w("Escolha o dia");if(oe()&&s.me&&!e.assignees.length&&(e.assignees=[s.me]),!(!e.assignees.length&&!await M({title:"Ningu\xE9m respons\xE1vel?",text:`Este ${q()} ficar\xE1 sem respons\xE1vel. Deseja salvar assim mesmo?`,ok:"Salvar assim"}))&&!f){f=!0;try{await B()}finally{f=!1}}}};let f=!1,B=async()=>{if(l){if(["date","time","duration","type","assignees","companyId"].some(v=>JSON.stringify(e[v])!==JSON.stringify(l[v]))&&!await ye(e,!1,a,g))return;await bt(e,l)}else if(n.mode!=="none"){let p=vt(e.date,n),v=p.filter(S=>W({...e,date:S},{isNew:!0}).some(T=>T.level==="block")),y=p;if(v.length){let S=await H({title:`${v.length} de ${p.length} datas j\xE1 t\xEAm compromisso nesse hor\xE1rio`,text:v.slice(0,6).map(T=>R(T)).join(" \xB7 ")+(v.length>6?" \u2026":""),options:[{label:`Criar s\xF3 nas ${p.length-v.length} datas livres`,value:"free",primary:!0},{label:"Criar em todas mesmo assim",value:"all"}]});if(!S)return;if(S==="free"&&(y=p.filter(T=>!v.includes(T))),!y.length)return w("Nenhuma data livre")}let A=O("s_");await s.upsertMany("events",y.map((S,T)=>({...e,id:T===0?e.id:O("e_"),date:S,seriesId:A})),{activity:{notifyPartner:e.notifyPartner,kind:"series",count:y.length,label:`${h[e.type].label} ${X.find(S=>S.v===n.mode)?.label.toLowerCase()||""} \xE0s ${P(e.time)}`,sample:{companyId:e.companyId,date:y[0]}}}),a.close(),pe({title:`${y.length} ${q()}s marcados`,sub:`${X.find(S=>S.v===n.mode)?.label||""}${e.time?" \xB7 "+P(e.time):""}`.replace(/^ · /,""),item:{title:`${y.length} ${q()}s`,date:y[0]}});return}else{if(!await ye(e,!0,a,g))return;await s.upsert("events",{...e}),a.close(),pe({title:`${se()} marcado`,sub:`${R(e.date)}${e.time?" \xB7 "+P(e.time):""}`,item:{title:e.title||h[e.type]?.label,date:e.date}});return}a.close()};function g(){o.time.value=e.time||"",o.date.value=e.date,t.querySelectorAll("[data-who]").forEach(p=>p.classList.toggle("is-on",e.assignees.includes(p.dataset.who))),i(),r()}i(),r()}var $e=420,tt=1380,I=a=>(Math.min(Math.max(a,$e),tt)-$e)/(tt-$e)*100;function ut(a,e){let l=a.time?me(a):null,n=[8,10,12,14,16,18,20,22];return`<div class="lanes">
    <div class="lanes__head"><strong>${s.team.length>1?`Agenda ${s.team.length===2?"dos dois":"de todos"}`:"Sua agenda"} em ${c(R(a.date))}</strong></div>
    ${s.team.map(t=>{let o=s.eventsOn(a.date,{person:t.id}).filter(i=>i.id!==a.id&&i.time),d=(a.assignees||[]).includes(t.id),r=e.some(i=>i.level==="block"&&i.person===t.id);return`<div class="lane">
        <span class="lane__who">${V(t.id,22)}</span>
        <div class="lane__track">
          ${n.map(i=>`<i class="lane__tick" style="left:${I(i*60)}%"></i>`).join("")}
          ${o.map(i=>{let m=me(i),b=s.company(i.companyId);return`<span class="lane__ev" style="left:${I(m[0])}%;width:max(4px,${I(m[1])-I(m[0])}%);background:${b?.color||"#888"}" title="${c(Ue(i))}"></span>`}).join("")}
          ${l&&d?`<span class="lane__draft${r?" is-clash":""}" style="left:${I(l[0])}%;width:max(6px,${I(l[1])-I(l[0])}%)"></span>`:""}
        </div>
      </div>`}).join("")}
    <div class="lane lane--axis"><span class="lane__who"></span><div class="lane__track">${n.map(t=>`<small style="left:${I(t*60)}%">${t}h</small>`).join("")}</div></div>
  </div>`}function pt(a,e){if(!a.date)return"";let l=W(a,{isNew:e}),n=l.filter(f=>f.level==="block"),t=l.filter(f=>f.level==="warn"),o=l.filter(f=>f.level==="info"),d=Z(a,{limit:4}),r=ve(a),i=(a.assignees||[]).length===1?a.assignees[0]:null,m=n.length&&i?s.team.find(f=>f.id!==i&&r.includes(f.id)):null,b=h[a.type],$=f=>`<li class="issue issue--${f.level}">${u(f.level==="block"?"alert":f.level==="warn"?"flag":f.code==="partner"?"user":"bulb",15)}<div><strong>${c(f.title)}</strong><p>${c(f.text)}</p></div></li>`;return`
  <section class="assist">
    <header class="assist__head">${u("sparkle",16)} Assistente</header>
    ${ut(a,l)}
    ${l.length?`<ul class="issues">${[...n,...t,...o].map($).join("")}</ul>`:a.time?`<p class="assist__ok">${u("check",15)} Hor\xE1rio livre para ${c(Y(a.assignees))}, sem conflitos.</p>`:""}
    ${m?`<button type="button" class="tchip tchip--wide" data-setwho="${m.id}">${V(m.id,18)} Passar para ${c(m.name)} (est\xE1 livre)</button>`:""}
    <div class="assist__sugg">
      <p>${c(b.tip)}</p>
      ${d.length?`<div class="hintbox__times">${d.map(f=>`<button type="button" class="tchip${a.time===f.time?" is-on":""}" data-settime="${f.time}">${P(f.time)}${f.peak?"<small>pico</small>":"<small>livre</small>"}</button>`).join("")}</div>`:`<p class="muted">Nenhum hor\xE1rio livre nesse dia${(a.assignees||[]).length?" para "+c(Y(a.assignees)):""}. Tente outro dia${s.team.length>1?" ou outra pessoa":""}.</p>`}
    </div>
  </section>`}async function ye(a,e,l,n){let o=W(a,{isNew:e}).filter($=>$.level==="block");if(!o.length)return!0;let d=Z(a,{limit:2}),r=(a.assignees||[]).length===1?a.assignees[0]:null,i=r&&s.team.find($=>$.id!==r&&ve(a).includes($.id)),m=[...d.map($=>({label:`Mudar para ${P($.time)} (livre)`,value:"time:"+$.time,primary:!0})),...i?[{label:`Passar para ${i.name} (est\xE1 livre)`,value:"who:"+i.id,primary:!d.length}]:[],{label:"Marcar mesmo assim",value:"force"}],b=await H({title:o[0].code==="duplicate"?"Isso j\xE1 est\xE1 na agenda":"J\xE1 tem compromisso nesse hor\xE1rio",bodyHtml:`<ul class="issues issues--dialog">${o.map($=>`<li class="issue issue--block">${u("alert",15)}<div><strong>${c($.title)}</strong><p>${c($.text)}</p></div></li>`).join("")}</ul>`,options:m});return b?b==="force"?!0:(b.startsWith("time:")&&(a.time=b.slice(5)),b.startsWith("who:")&&(a.assignees=[b.slice(4)]),n(),ye(a,e,l,n)):!1}async function mt(a,e){let l={...a,...e},n=W(l).filter(o=>o.level==="block");return n.length?await H({title:"J\xE1 tem compromisso nesse hor\xE1rio",bodyHtml:`<ul class="issues issues--dialog">${n.map(o=>`<li class="issue issue--block">${u("alert",15)}<div><strong>${c(o.title)}</strong><p>${c(o.text)}</p></div></li>`).join("")}</ul>`,options:[{label:"Mover mesmo assim",value:"force",primary:!0}]})==="force":!0}function vt(a,e){let l=[],n=a,t=e.until&&e.until>=a?e.until:E(a,28);for(;n<=t&&l.length<150;){let o=G(n).getDay();(e.mode==="daily"||e.mode==="weekdays"&&o>=1&&o<=5||e.mode==="weekly"&&G(n).getDay()===G(a).getDay())&&l.push(n),n=E(n,1)}return l}var ft=["type","companyId","title","time","duration","assignees","location","description","internalNote","reminder","visibleToClient"];async function bt(a,e){let l=ft.filter(n=>JSON.stringify(a[n])!==JSON.stringify(e[n]));if(a.seriesId&&l.length){let n=s.state.events.filter(t=>t.seriesId===a.seriesId&&t.date>e.date);if(n.length){let t=await H({title:`${se()} repetido`,text:"Aplicar as altera\xE7\xF5es a quais eventos?",options:[{label:"S\xF3 a este",value:"one",primary:!0},{label:`A este e aos pr\xF3ximos (${n.length+1})`,value:"next"}]});if(!t)return;if(t==="next"){let o=Object.fromEntries(l.map(d=>[d,a[d]]));await s.upsertMany("events",[{...a},...n.map(d=>({...d,...o}))],{activity:{kind:"series-edit",count:n.length+1,label:`${h[a.type].label} \xB7 a partir de ${a.date.slice(8)}/${a.date.slice(5,7)}`,sample:{companyId:a.companyId,date:a.date}}}),w("S\xE9rie atualizada");return}}}await s.upsert("events",{...a}),w("Altera\xE7\xF5es salvas")}export{It as a,At as b,fe as c,Zt as d,et as e,mt as f};
