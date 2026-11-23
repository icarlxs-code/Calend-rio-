import{a as Ue,b as Ve}from"./c-ZSMQYZNH.js";import{b as pe,c as Je,d as V,e as Z,f as ue}from"./c-6FTBGISG.js";import{a as de,b as M}from"./c-27OGDYDV.js";import{f as Fe}from"./c-O6B67QCZ.js";import{C as We}from"./c-IJZBX5N6.js";import{a as Me,b as Pe,c as Re,d as W,g as Y,h as q,i as Be,j as ze,k as re,l as ce,m as O,o as j,p as k,q as D,r as B}from"./c-XO2DSTE4.js";import{b as c}from"./c-DWBEWQEH.js";import{d as He}from"./c-6ARZ6OV6.js";import{a as oe,b as Ce,d as Le,e as Ae,f as s}from"./c-4WOSBQTX.js";import{a as ye}from"./c-3VF3KZPI.js";import{B as r,D as F,G as qe,c as G,d as T,e as E,f as ke,g as we,k as _e,l as Se,m as P,r as xe,t as Ee,u as H,v as R,w as se,z as N}from"./c-MPTN5RTT.js";import{a as h,b as J,c as w,e as Ie,f as S,h as Te,i as U,j as Ne,l as x,m as Oe,n as je,o as ne,p as le,r as X,s as De,t as ie,u as Q}from"./c-JRZKGWYQ.js";var Ke=new Set(["fazer","criar","postar","subir","publicar","gravar","post","postagem","publicacao","publica\xE7\xE3o","o","a","um","uma","no","na","do","da","de","dos","das","pro","pra","para","feed","reels","reel","story","stories","storie","storys","carrossel","carosel","carossel","instagram","insta","ig","sobre","com","e"]),lt=[[/\bcouve flor\b/gi,"couve-flor"],[/\bpromocao\b/gi,"promo\xE7\xE3o"],[/\bpromoçao\b/gi,"promo\xE7\xE3o"],[/\bacao\b/gi,"a\xE7\xE3o"],[/\bpao\b/gi,"p\xE3o"],[/\blimao\b/gi,"lim\xE3o"],[/\bmamao\b/gi,"mam\xE3o"],[/\bmelao\b/gi,"mel\xE3o"],[/\bfeijao\b/gi,"feij\xE3o"],[/\bmaca\b/gi,"ma\xE7\xE3"],[/\bmaça\b/gi,"ma\xE7\xE3"],[/\babobora\b/gi,"ab\xF3bora"],[/\bpessego\b/gi,"p\xEAssego"],[/\bmaracuja\b/gi,"maracuj\xE1"],[/\babacate\b/gi,"abacate"],[/\babacaxi\b/gi,"abacaxi"],[/\bcafe\b/gi,"caf\xE9"],[/\bpromo\b/gi,"promo"],[/\bblack friday\b/gi,"Black Friday"],[/\bnatal\b/gi,"Natal"],[/\bano novo\b/gi,"Ano Novo"],[/\bdia das maes\b/gi,"Dia das M\xE3es"],[/\bdia dos pais\b/gi,"Dia dos Pais"],[/\bhamburguer\b/gi,"hamb\xFArguer"],[/\bhamburguers\b/gi,"hamb\xFArgueres"],[/\blancamento\b/gi,"lan\xE7amento"],[/\bcolecao\b/gi,"cole\xE7\xE3o"],[/\bvideo\b/gi,"v\xEDdeo"],[/\bsabado\b/gi,"s\xE1bado"],[/\bpromocoes\b/gi,"promo\xE7\xF5es"]],Ge=a=>a.toLowerCase().replace(/[.,:;!]+$/,""),it={feed:"Post no feed",carrossel:"Carrossel",reels:"Reels",story:"Stories"},Xe=/^(post no feed|carrossel|reels|stories|story)\s+—\s+/i;function Ye(a,e=null){let o=String(a||"").replace(/\s+/g," ").trim();if(!o)return o;let l=it[e];if(!l)return be(me(o));if(Xe.test(o))return`${l} \u2014 ${be(me(o.replace(Xe,"")))}`;let t=o.split(" ");for(;t.length>1&&Ke.has(Ge(t[0]));)t.shift();return o=t.join(" ").replace(/\s+(no|pro|pra|para o)\s+(instagram|insta|ig|feed)\s*$/i,"").trim(),Ke.has(Ge(o))?l:`${l} \u2014 ${be(me(o))}`}var me=a=>{for(let[e,o]of lt)a=a.replace(e,o);return a},be=a=>a&&a.charAt(0).toLocaleUpperCase("pt-BR")+a.slice(1);var rt={Empresa:"Pura Vida",Local:"Hospital Santa Clara",Turma:"9\xBA ano B",Obra:"Residencial Aurora",Cliente:"Maria Silva",Setor:"Linha de produ\xE7\xE3o 2",Unidade:"3\xBA Batalh\xE3o",Projeto:"Novo site",Plataforma:"iFood",\u00C1rea:"Talh\xE3o 3",Mat\u00E9ria:"Matem\xE1tica"};function At(){let a=s.companiesSorted(),e=T(),o=ke(e),l=E(o,6);return`
  <header class="hdr">
    <div class="hdr__row">
      <div class="hdr__titles"><p class="hdr__eyebrow">${a.length} ${a.length===1?x(!1,!0):x(!0,!0)}</p><h1>${x(!0)}</h1></div>
      <div class="hdr__actions"><button class="btn btn--primary btn--sm" data-action="new-company">${c("plus",16)} ${U()}</button></div>
    </div>
  </header>
  <div class="page">
    ${a.length?"":ce(`${Ne()} ${x(!1,!0)} ainda`,`Cadastre ${w.entity.hint} com nome, cor e foto. Assim cada compromisso fica organizado no lugar certo.`,`<button class="btn btn--primary" data-action="new-company">${c("plus",18)} Cadastrar ${x(!1,!0)}</button>`)}
    <div class="colist">
      ${a.map(t=>{let n=s.eventsBetween(o,l,{companyId:t.id}),u=n.filter(m=>Oe(m.type)).length,d=n.filter(m=>m.type==="captacao").length,i=s.state.events.filter(m=>m.companyId===t.id&&m.date>=e&&m.status!=="feito").sort((m,f)=>(m.date+m.time).localeCompare(f.date+f.time))[0];return`<button class="cocard" style="--cc:${t.color};--cc-soft:${F(t.color,.1)}" data-action="open-company" data-id="${t.id}">
          <div class="cocard__top">
            ${q(t,48)}
            <div class="cocard__name"><strong>${r(t.name)}</strong>${t.instagram?`<small>${c("insta",12)} @${r(t.instagram)}</small>`:""}</div>
            ${c("right",18,"muted")}
          </div>
          <div class="cocard__stats">
            ${S()?`<span><b>${u}</b> posts</span><span><b>${d}</b> capta\xE7${d===1?"\xE3o":"\xF5es"}</span>`:`<span><b>${n.length}</b> compromisso${n.length===1?"":"s"}</span>`}<span class="muted">nesta semana</span>
          </div>
          ${i?`<div class="cocard__next">${c(h[i.type].icon,14)} <b>${r(H(i.date))}${i.time?" "+i.time:""}</b> \xB7 ${r(h[i.type].label)} \u2014 ${r(i.title||"")}</div>`:'<div class="cocard__next muted">Nada agendado</div>'}
        </button>`}).join("")}
    </div>
  </div>`}function It(a){let e=O({className:"sheet--tall",html:Ze(a),onMount:o=>ct(o,a)});e.refresh=()=>s.company(a)?e.set(Ze(a)):e.close()}function Ze(a){let e=s.company(a);if(!e)return"";let o=T(),l=we(o),t=s.eventsBetween(`${l}-01`,`${l}-31`,{companyId:a}),n=s.eventsBetween(o,E(o,30),{companyId:a}),u=s.eventsBetween(E(o,-14),E(o,-1),{companyId:a}).reverse(),d=$=>t.filter(v=>$.includes(v.type)).length,i=t.filter($=>$.status==="feito").length,m="",f=n.map($=>{let v=$.date!==m?`<h4 class="dayhead">${r(R($.date))}</h4>`:"";return m=$.date,v+re($)}).join("");return`
  ${j("",{right:s.canEdit("companies",e)?'<button class="btn-text" data-act="edit">Editar</button>':""})}
  <div class="cohero" style="--cc:${e.color};--cc-soft:${F(e.color,.14)}">
    ${q(e,72,20)}
    <h2>${r(e.name)}</h2>
    ${e.instagram?`<a class="cohero__ig" href="https://instagram.com/${encodeURIComponent(e.instagram)}" target="_blank" rel="noopener">${c("insta",14)} @${r(e.instagram)}</a>`:""}
    <div class="cohero__btns">
      <button class="btn btn--primary btn--sm" data-act="new">${c("plus",16)} Evento</button>
      ${w.clientLike?`<button class="btn btn--soft btn--sm" data-act="clientview">${c("eye",16)} P\xE1gina do cliente</button>`:""}
      <button class="btn btn--soft btn--sm" data-act="share">${c("share",16)} Enviar</button>
    </div>
  </div>

  <div class="page page--sheet">
    <section class="block">
      <h2 class="block__title">${r(Ee(l))}</h2>
      <div class="mstats mstats--5">
        <div><b>${d(["feed","carrossel"])}</b><span>feed</span></div>
        <div><b>${d(["reels"])}</b><span>reels</span></div>
        <div><b>${d(["story"])}</b><span>stories</span></div>
        <div><b>${d(["captacao"])}</b><span>capta\xE7\xF5es</span></div>
        <div><b>${t.length?Math.round(i/t.length*100):0}%</b><span>feito</span></div>
      </div>
    </section>

    ${e.address||e.contact||e.notes?`<ul class="rows">
      ${e.address?`<li><span class="rows__k">${c("pin",16)} Endere\xE7o</span><a class="rows__v link" href="https://maps.apple.com/?q=${encodeURIComponent(e.address)}" target="_blank" rel="noopener">${r(e.address)}</a></li>`:""}
      ${e.contact?`<li><span class="rows__k">${c("user",16)} Contato</span><span class="rows__v">${r(e.contact)}</span></li>`:""}
      ${e.notes?`<li><span class="rows__k">${c("note",16)} Observa\xE7\xF5es</span><span class="rows__v">${r(e.notes)}</span></li>`:""}
    </ul>`:""}

    <section class="block">
      <h2 class="block__title">Pr\xF3ximos 30 dias</h2>
      ${f||ce("Nada agendado","Toque em + para marcar o primeiro compromisso aqui.")}
    </section>

    ${u.length?`<section class="block">
      <h2 class="block__title">\xDAltimas 2 semanas</h2>
      ${u.map($=>re($,{showDate:!0,compact:!0})).join("")}
    </section>`:""}
  </div>`}function ct(a,e){let o=a.el;(o.querySelector('[data-act="edit"]')||{}).onclick=()=>ve(e),o.querySelector('[data-act="new"]').onclick=async()=>{let{openEventEditor:l}=await import("./c-FN2ICTUX.js");l({companyId:e})},o.querySelector('[data-act="share"]').onclick=()=>fe(e),o.querySelector('[data-act="clientview"]').onclick=()=>dt(e)}function ve(a=null,e=null){let o=a?s.company(a):null,l=s.state.companies.map(d=>d.color),t=o?{...o}:{id:N("c_"),name:"",color:X.find(d=>!l.includes(d))||X[0],logo:null,instagram:"",address:"",contact:"",notes:"",shareToken:null},n=()=>`
    ${j(o?`Editar ${x(!1,!0)}`:`${U()} ${x(!1,!0)}`,{left:'<button class="btn-text" data-close>Cancelar</button>',right:'<button class="btn btn--primary btn--sm" data-save>Salvar</button>'})}
    <form class="form" onsubmit="return false">
      <div class="logopick">
        <div data-preview>${q({...t,name:t.name||"?"},88,24)}</div>
        <div class="logopick__btns">
          <label class="btn btn--soft btn--sm">${c("image",16)} ${t.logo?"Trocar logo":"Enviar logomarca"}<input type="file" accept="image/*" data-file hidden></label>
          ${t.logo?'<button type="button" class="btn-text btn-text--sm" data-rmlogo>Remover logo</button>':'<p class="fhelp">Opcional. Sem logo, usamos as iniciais na cor escolhida.</p>'}
        </div>
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-name">Nome (${r(w.entity.hint)})</label>
        <input id="c-name" class="input" name="name" value="${r(t.name)}" placeholder="Ex.: ${r(rt[w.entity.one]||"Pura Vida")}" autocomplete="off" maxlength="60">
      </div>
      <div class="fgroup">
        <label class="flabel">Cor no calend\xE1rio</label>
        <div class="palette">
          ${X.map(d=>`<button type="button" class="swatch${t.color===d?" is-on":""}" style="background:${d}" data-color="${d}" aria-label="Cor ${d}">${c("check",16)}</button>`).join("")}
          <label class="swatch swatch--custom" title="Outra cor"><input type="color" value="${t.color}" data-customcolor>${c("plus",16)}</label>
        </div>
      </div>
      <div class="fgroup"${S()?"":" hidden"}>
        <label class="flabel" for="c-ig">Instagram</label>
        <div class="input-prefix"><span>@</span><input id="c-ig" class="input" name="instagram" value="${r(t.instagram||"")}" placeholder="usuario" autocomplete="off" autocapitalize="none"></div>
      </div>
      <div class="fgroup"${s.team.length>1?"":" hidden"}>
        <label class="flabel">Notifica\xE7\xF5es daqui v\xE3o para</label>
        <div class="seg seg--notify">${[["",s.team.length===2?"Os dois":"Todos"],...s.team.map(d=>[d.id,d.name])].map(([d,i])=>`<button type="button" class="seg__btn${(t.notifyOnly||"")===d?" is-on":""}" data-only="${d}">${r(i)}</button>`).join("")}</div>
        <p class="fhelp">${S()?"Avisos, lembretes, \u201CJ\xE1 postou?\u201D, cobran\xE7as de atraso e dicas desta empresa":`Avisos, lembretes e cobran\xE7as de atraso ${Te()?"desta":"deste"} ${r(x(!1,!0))}`} chegam s\xF3 para quem estiver marcado.</p>
      </div>
      <div class="fgroup"${S()?"":" hidden"}>
        <label class="flabel" for="c-niche">O que a empresa faz (para as dicas)</label>
        <input id="c-niche" class="input" name="niche" value="${r(t.niche||Ve(t))}" placeholder="Ex.: hamburgueria artesanal, loja de roupas femininas" autocomplete="off" maxlength="160">
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
      ${o?`<button type="button" class="btn btn--danger-soft btn--block" data-delete>${c("trash",18)} Excluir ${x(!1,!0)}</button>`:""}
      <div class="form__spacer"></div>
    </form>`,u=d=>{let i=d.el,m=i.querySelector("form"),f=()=>{t.name=m.name.value.trim(),t.instagram=m.instagram.value.trim().replace(/^@/,""),t.niche=m.niche.value.trim(),t.notifyOnly=i.querySelector("[data-only].is-on")?.dataset.only||null,t.address=m.address.value.trim(),t.contact=m.contact.value.trim(),t.notes=m.notes.value.trim()},$=()=>i.querySelector("[data-preview]").innerHTML=q({...t,name:m.name.value||"?"},88,24);m.name.addEventListener("input",$),i.querySelectorAll("[data-only]").forEach(y=>y.onclick=()=>i.querySelectorAll("[data-only]").forEach(p=>p.classList.toggle("is-on",p===y))),i.querySelectorAll("[data-color]").forEach(y=>y.onclick=()=>{t.color=y.dataset.color,i.querySelectorAll("[data-color]").forEach(p=>p.classList.toggle("is-on",p===y)),$()}),i.querySelector("[data-customcolor]").oninput=y=>{t.color=y.target.value,i.querySelectorAll("[data-color]").forEach(p=>p.classList.remove("is-on")),$()},i.querySelector("[data-file]").onchange=async y=>{let p=y.target.files[0];if(p)try{f(),t.logo=await qe(p,160),d.set(n())}catch{k("N\xE3o foi poss\xEDvel ler essa imagem")}};let v=i.querySelector("[data-rmlogo]");v&&(v.onclick=()=>{f(),t.logo=null,d.set(n())});let z=i.querySelector("[data-delete]");z&&(z.onclick=async()=>{let y=s.state.events.filter(b=>b.companyId===t.id);await D({title:`Excluir ${t.name}?`,text:y.length?`Os ${y.length} compromissos daqui tamb\xE9m ser\xE3o apagados e o link do cliente deixar\xE1 de funcionar.`:"O link do cliente deixar\xE1 de funcionar.",ok:"Excluir",danger:!0})&&(await s.removeMany("events",y.map(b=>b.id)),await s.remove("companies",t.id),d.close(),k("Exclu\xEDdo"))}),i.querySelector("[data-save]").onclick=async()=>{if(f(),!t.name)return m.name.focus(),k("Digite o nome");await s.upsert("companies",{...t}),d.close(),k(o?"Atualizado":"Cadastrado"),e&&e(s.company(t.id))}};O({className:"sheet--tall",html:n(),onMount:u})}async function fe(a){let e=s.company(a),o=s.mode==="cloud",l="";o?(await s.ensureShareToken(e),await s.publishCompany(a),l=Le(s.company(a).shareToken)):l=Ae(await Ce(oe(e,s.state.events,{maxFuture:90})));let t=`
    ${j("Link do cliente")}
    <div class="share">
      <div class="share__co">${q(e,56)}<div><strong>${r(e.name)}</strong><small>v\xEA somente o pr\xF3prio cronograma</small></div></div>
      <ul class="checks">
        <li>${c("check",16)} Somente os eventos da ${r(e.name)}</li>
        <li>${c("check",16)} Sem notas internas e sem outras empresas</li>
        <li>${c("check",16)} Somente leitura: o cliente n\xE3o consegue alterar nada</li>
        <li>${c(o?"check":"alert",16)} ${o?"Sempre atualizado: tudo que voc\xEAs mudarem aparece para o cliente":"Foto do cronograma atual (pr\xF3ximos 90 dias). Quando mudar algo, envie o link de novo"}</li>
      </ul>
      <div class="share__link"><input readonly value="${r(l)}" data-link></div>
      <div class="share__btns">
        <button class="btn btn--primary btn--block" data-sharebtn>${c("share",18)} Enviar para o cliente</button>
        <button class="btn btn--soft btn--block" data-copy>${c("copy",18)} Copiar link</button>
        <a class="btn btn--ghost btn--block" href="${r(l)}" target="_blank" rel="noopener">${c("eye",18)} Ver como o cliente v\xEA</a>
      </div>
      ${o?'<button class="btn-text btn-text--sm btn-text--danger" data-revoke>Gerar novo link (o antigo para de funcionar)</button>':'<p class="fhelp">Dica: ative a sincroniza\xE7\xE3o na nuvem (Ajustes) para o link ficar sempre atualizado automaticamente.</p>'}
    </div>`;O({html:t,onMount:n=>{let u=n.el;u.querySelector("[data-copy]").onclick=async()=>{try{await navigator.clipboard.writeText(l),k("Link copiado")}catch{u.querySelector("[data-link]").select(),k("Selecione e copie o link")}},u.querySelector("[data-sharebtn]").onclick=async()=>{let i=`Ol\xE1! Este \xE9 o cronograma de conte\xFAdo da ${e.name}. Por aqui voc\xEAs acompanham tudo o que est\xE1 planejado: posts, stories, reels e capta\xE7\xF5es.`;if(navigator.share)try{await navigator.share({title:`Cronograma \xB7 ${e.name}`,text:i,url:l})}catch{}else await navigator.clipboard?.writeText(`${i}
${l}`),k("Mensagem copiada")};let d=u.querySelector("[data-revoke]");d&&(d.onclick=async()=>{await D({title:"Gerar um novo link?",text:"Quem tiver o link antigo n\xE3o conseguir\xE1 mais ver o cronograma.",ok:"Gerar novo link",danger:!0})&&(await s.regenerateShareToken(s.company(a)),n.close(),fe(a))})}})}async function dt(a){let e=s.company(a);if(!e)return;let{showClient:o}=await import("./c-B2B33C7X.js"),{sanitizePayload:l}=await import("./c-4SHHHDNP.js"),t=l(oe(e,s.state.events)),n=document.createElement("div");n.className="client-preview",n.innerHTML=`<div class="client-preview__bar"><button class="btn btn--soft btn--sm" data-closepv>${c("left",16)} Voltar</button><span>Assim o cliente v\xEA</span><button class="btn btn--primary btn--sm" data-sendpv>${c("share",16)} Enviar</button></div><div class="client-preview__body"></div>`,document.body.appendChild(n),document.body.classList.add("has-sheet"),o(n.querySelector(".client-preview__body"),t,{canGoBack:!1,preview:!0});let u=()=>{n.remove(),document.body.classList.toggle("has-sheet",!!document.querySelector(".sheet-wrap"))};n.querySelector("[data-closepv]").onclick=u,n.querySelector("[data-sendpv]").onclick=()=>{u(),fe(a)}}function Yt(a){let e=O({html:et(a),className:"sheet--tall",onMount:o=>pt(o,a)});e.refresh=()=>{if(!s.event(a))return e.close();e.set(et(a))}}function et(a){let e=s.event(a);if(!e)return"";let o=s.company(e.companyId),l=o?.color||"#666",t=ie.find(i=>i.v===(e.reminder??30)),n=e.seriesId?s.state.events.filter(i=>i.seriesId===e.seriesId).length:0,u=s.canEdit("events",e),d=s.member(s.ownerOf("events",e))?.name||"o parceiro";return`
  ${j("",{right:u?'<button class="btn-text" data-act="edit">Editar</button>':""})}
  <div class="detail">
    <div class="detail__hero" style="--cc:${l};--cc-soft:${F(l,.12)}">
      <div class="detail__co">${q(o,40)}<div><strong>${r(o?.name||"Sem "+x(!1,!0))}</strong>${o?.instagram?`<small>@${r(o.instagram)}</small>`:""}</div>${Be(e.type,{solid:!0})}</div>
      <h2><span class="pfrow">${Re(e,24)}</span>${r(e.title||h[e.type].label)}</h2>
      <p class="detail__when">${c("calendar",15)} ${r(H(e.date))}, ${r(xe(e.date).split(", ")[1])} \xB7 ${c("clock",15)} ${r(ze(e))}</p>
    </div>

    ${u?"":`<p class="detail__lock">${c("eye",14)} Cadastrado por ${r(d)} \u2014 ${s.canComplete(e)?"voc\xEA \xE9 respons\xE1vel: pode marcar o andamento, mas n\xE3o editar.":"voc\xEA s\xF3 pode ver. Use \u201CDuplicar\u201D para criar uma c\xF3pia sua."}</p>`}
    <div class="seg seg--status"${u||s.canComplete(e)?"":" hidden"}>
      ${le.map(i=>`<button class="seg__btn${e.status===i?" is-on":""} st-${i}" data-status="${i}">${i==="feito"?c("check",14):""}${ne[i].label}</button>`).join("")}
    </div>

    ${e.status==="feito"&&(e.assignees||[]).concat(e.createdBy).includes(s.me)&&s.mode==="cloud"?`<button class="storybtn" data-act="story"><span class="storybtn__ic">${c("camera",20)}</span>${(()=>{let i=We("w",`e:${e.id}`);return i.ja?"<span><b>Postar outro story</b><small>O b\xF4nus dessa voc\xEA j\xE1 ganhou \u2714\uFE0F \xB7 some em 24 h</small></span></button>":`<span><b>Postar story do que voc\xEA fez</b><small>${i.got?`+${i.total} XP agora`:"Foto tirada agora"}${i.badges[0]?` \xB7 desbloqueia \u201C${r(i.badges[0].name())}\u201D`:i.lv1>i.lv0?` \xB7 sobe pro n\xEDvel ${i.lv1}`:" \xB7 XP em dobro"} \xB7 some em 24 h</small></span><i class="storybtn__x2">2\xD7</i></button>`})()}`:""}
    <ul class="rows">
      ${ae()?"":`<li><span class="rows__k">${c("users",16)} Respons\xE1vel</span><span class="rows__v">${(e.assignees||[]).map(i=>W(i,22)).join("")} ${r(Y(e.assignees))}</span></li>`}
      ${e.location?`<li><span class="rows__k">${c("pin",16)} Local</span><a class="rows__v link" href="https://maps.apple.com/?q=${encodeURIComponent(e.location)}" target="_blank" rel="noopener">${r(e.location)}</a></li>`:""}
      ${h[e.type].kind!=="post"||e.duration?`<li><span class="rows__k">${c("clock",16)} Dura\xE7\xE3o</span><span class="rows__v">${r(se(je(e)))}</span></li>`:""}
      <li><span class="rows__k">${c("bell",16)} Lembrete</span><span class="rows__v">${r(t?.label||"\u2014")}</span></li>
      ${n?`<li><span class="rows__k">${c("repeat",16)} Repeti\xE7\xE3o</span><span class="rows__v">${n} eventos na s\xE9rie</span></li>`:""}
      ${w.clientLike?`<li><span class="rows__k">${c(e.visibleToClient===!1?"eyeoff":"eye",16)} Cliente</span><span class="rows__v">${e.visibleToClient===!1?"N\xE3o aparece para o cliente":"Aparece no link do cliente"}</span></li>`:""}
    </ul>

    ${e.description?`<div class="textbox"><h4>${r(w.form.desc[0])}</h4><p>${r(e.description)}</p></div>`:""}
    ${e.internalNote?`<div class="textbox textbox--note"><h4>${c("eyeoff",13)} ${r(w.form.note[0])} (${ot()})</h4><p>${r(e.internalNote)}</p></div>`:""}

    <div class="actions">
      <button data-act="ics">${c("bell",20)}<span>Lembrete no iPhone</span></button>
      ${u?`<button data-act="tomorrow">${c("right",20)}<span>Passar p/ amanh\xE3</span></button>`:""}
      <button data-act="dup">${c("copy",20)}<span>Duplicar</span></button>
      ${u?`<button data-act="del" class="is-danger">${c("trash",20)}<span>Excluir</span></button>`:""}
    </div>
    <p class="detail__meta">Criado por ${r(s.member(e.createdBy)?.name||"\u2014")}${e.updatedAt?" \xB7 atualizado "+new Date(e.updatedAt).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):""}</p>
  </div>`}function pt(a,e){let o=a.el;o.querySelectorAll("[data-status]").forEach(t=>t.onclick=async()=>{let n=s.event(e),u=t.getBoundingClientRect();if(await s.upsert("events",{...n,status:t.dataset.status}),t.dataset.status==="feito"&&n.status!=="feito"&&s.event(e)?.status==="feito"){let d=n.date===T()?s.eventsOn(n.date,{person:s.me}).filter(i=>i.status!=="feito").length:null;k(He({el:u,left:d}))}});let l=(t,n)=>{let u=o.querySelector(`[data-act="${t}"]`);u&&(u.onclick=n)};l("edit",()=>tt({id:e})),l("story",()=>{let t=s.event(e);Fe({title:t.title||h[t.type]?.label||"",ref:`e:${e}`,kind:"w"})}),l("dup",async()=>{let n={...s.event(e),id:N("e_"),status:"pendente",seriesId:null,createdAt:null,createdBy:null};await s.upsert("events",n),a.close(),k(`${te()} duplicado`),tt({id:n.id})}),l("tomorrow",async()=>{let t=s.event(e);await vt(t,{date:E(t.date,1)})&&(await s.upsert("events",{...t,date:E(t.date,1)}),k("Movido para "+H(E(t.date,1)).toLowerCase(),{action:"Desfazer",onAction:()=>s.upsert("events",{...s.event(e),date:t.date})}))}),l("ics",()=>{let t=s.event(e);Ue([t],`${h[t.type].label}-${t.date}.ics`,ye.appName)}),l("del",()=>st(e,a))}async function st(a,e){let o=s.event(a),l=[a];if(o.seriesId){let n=s.state.events.filter(u=>u.seriesId===o.seriesId&&u.date>=o.date).map(u=>u.id);if(n.length>1){let u=await B({title:`Excluir ${C()} repetido`,options:[{label:"S\xF3 este",value:"one",danger:!0},{label:`Este e os pr\xF3ximos (${n.length})`,value:"next",danger:!0}]});if(!u)return;u==="next"&&(l=n)}else if(!await D({title:`Excluir este ${C()}?`,ok:"Excluir",danger:!0}))return}else if(!await D({title:`Excluir este ${C()}?`,text:s.team.length>1?"Ele some da agenda de todos.":"Ele some da sua agenda.",ok:"Excluir",danger:!0}))return;let t=l.map(n=>({...s.event(n)}));await s.removeMany("events",l),e&&e.close(),k(l.length>1?`${l.length} ${C()}s exclu\xEDdos`:`${te()} exclu\xEDdo`,{action:"Desfazer",onAction:()=>s.upsertMany("events",t),ms:4500})}function tt({id:a=null,date:e=null,companyId:o=null,type:l=null,time:t=null,assignees:n=null,title:u=""}={}){let d=a?s.event(a):null;if(d&&!s.canEdit("events",d)){s._denied("events",d);return}let i=s.companiesSorted(),m=l||(J.includes("feed")?"feed":J[0]),f=d?JSON.parse(JSON.stringify(d)):{id:N("e_"),type:m,companyId:o||M.monthCompany||(i.length===1?i[0].id:null),title:u||"",date:e||(M.tab==="mes"?M.monthSel:M.date)||T(),time:t||h[m].best[0]||"12:00",duration:["shoot","meeting","work","other"].includes(h[m].kind)?h[m].dur:null,assignees:n||(M.person!=="all"?[M.person]:s.me?[s.me]:[]),location:"",description:"",internalNote:"",reminder:30,visibleToClient:h[m].client,status:"pendente"};if(!d&&!t&&!S()){let y=Z(f,{limit:6}).map(p=>p.time).sort();if(y.length)f.time=y[0];else if(f.date===T()){let p=Math.ceil((Se()+30)/30)*30;p<1440&&(f.time=_e(p))}}let $=d?JSON.parse(JSON.stringify(d)):null,v={mode:"none",until:E(f.date,28)};return O({className:"sheet--tall",html:nt(f,!!d,v),onMount:y=>ut(y,f,$,v)})}function he(a,e){let o=(a.assignees||[]).includes(e.id);return a.notifyPartner===!1?o?`Sem aviso agora. Como ${e.name} \xE9 respons\xE1vel, ele ainda recebe os lembretes do hor\xE1rio.`:`${e.name} n\xE3o recebe aviso nem lembretes deste evento. Fica s\xF3 na agenda.`:`${e.name} recebe o aviso de que voc\xEA marcou e os lembretes do hor\xE1rio.`}var C=()=>S()?"evento":"compromisso",te=()=>S()?"Evento":"Compromisso",ae=()=>s.team.length<2,ot=()=>ae()?"s\xF3 voc\xEA v\xEA":`s\xF3 ${s.team.length>2?"a equipe":"voc\xEAs"} veem`,ee=a=>["shoot","meeting","work","other"].includes(h[a].kind),K=a=>["shoot","meeting"].includes(h[a].kind);function nt(a,e,o){let l=s.companiesSorted();return`
  ${j(e?`Editar ${C()}`:`Novo ${C()}`,{left:'<button class="btn-text" data-close>Cancelar</button>',right:'<button class="btn btn--primary btn--sm" data-save>Salvar</button>'})}
  <form class="form" data-editor onsubmit="return false">
    <div class="fgroup">
      <label class="flabel">O que \xE9?</label>
      <div class="typegrid">
        ${J.map(t=>`<button type="button" class="typebtn tbadge--${t}${a.type===t?" is-on":""}"${Ie(t)} data-type="${t}">${c(h[t].icon,20)}<span>${h[t].label}</span></button>`).join("")}
      </div>
    </div>

    <div class="fgroup">
      <label class="flabel">${x()}${S()?"":' <em class="tag">opcional</em>'}</label>
      <div class="cogrid">
        ${l.map(t=>`<button type="button" class="cobtn${a.companyId===t.id?" is-on":""}" style="--cc:${t.color}" data-company="${t.id}">${q(t,26,7)}<span>${r(t.name)}</span></button>`).join("")}
        <button type="button" class="cobtn cobtn--add" data-newco>${c("plus",18)}<span>${U()} ${x(!1,!0)}</span></button>
      </div>
    </div>

    ${J.some(t=>h[t].kind==="post")||h[a.type].kind==="post"?`<div class="fgroup" data-when="net" ${h[a.type].kind==="post"?"":"hidden"}>
      <label class="flabel">Onde vai postar?</label>
      <div class="netgrid">${Me.map(t=>{let n=Pe(t);return n?`<button type="button" class="netbtn${(a.platform||"instagram")===t?" is-on":""}" data-net="${t}"><span class="pf" style="width:22px;height:22px">${n.svg}</span><span>${r(n.name.replace(" (Twitter)",""))}</span></button>`:""}).join("")}</div>
    </div>`:""}

    <div class="fgroup">
      <label class="flabel" for="f-title">T\xEDtulo</label>
      <input id="f-title" class="input" name="title" value="${r(a.title)}" placeholder="${r(h[a.type].placeholder)}" autocomplete="off" maxlength="120">
    </div>

    <div class="fgroup row2">
      <div><label class="flabel" for="f-date">Dia</label><input id="f-date" class="input" type="date" name="date" value="${a.date}" required></div>
      <div><label class="flabel" for="f-time">Hor\xE1rio</label><input id="f-time" class="input" type="time" name="time" value="${a.time||""}" step="300"></div>
    </div>

    <div class="fgroup" data-when="duration" ${ee(a.type)?"":"hidden"}>
      <label class="flabel" for="f-dur">Dura\xE7\xE3o</label>
      <select id="f-dur" class="input" name="duration">
        ${De.map(t=>`<option value="${t}"${(a.duration||h[a.type].dur)===t?" selected":""}>${se(t)}</option>`).join("")}
      </select>
    </div>

    <div data-hint></div>

    <div class="fgroup"${ae()?" hidden":""}>
      <label class="flabel">Quem vai fazer?</label>
      <div class="whogrid">
        ${s.team.map(t=>`<button type="button" class="whobtn${(a.assignees||[]).includes(t.id)?" is-on":""}" style="--mc:${t.color}" data-who="${t.id}">${W(t.id,30)}<span>${r(t.name)}</span><i class="whobtn__check">${c("check",14)}</i></button>`).join("")}
      </div>
      <p class="fhelp">${s.team.length>2?"Marque todos que v\xE3o juntos.":"Marque os dois se forem juntos."}</p>
      ${s.team.filter(t=>t.id!==s.me).map(t=>`<label class="list__row notifyrow"><span><b>${c("bell",15)} Avisar ${t.name==="Matheus"||t.name==="Henrique"?"o ":""}${r(t.name)}</b><small data-notifyhelp>${he(a,t)}</small></span><input type="checkbox" class="switch" name="notifyPartner" ${a.notifyPartner!==!1?"checked":""}></label>`).join("")}
    </div>

    <div class="fgroup" data-when="location" ${K(a.type)?"":"hidden"}>
      <label class="flabel" for="f-loc">Local</label>
      <input id="f-loc" class="input" name="location" value="${r(a.location||"")}" placeholder="Endere\xE7o ou nome do lugar" autocomplete="off">
      <button type="button" class="btn-text btn-text--sm" data-useaddr hidden>${c("pin",14)} Usar o endere\xE7o cadastrado</button>
    </div>

    <div class="fgroup">
      <label class="flabel" for="f-desc">${r(w.form.desc[0])}${w.clientLike?` <em class="tag">${c("eye",12)} cliente v\xEA</em>`:""}</label>
      <textarea id="f-desc" class="input" name="description" rows="3" placeholder="${r(w.form.desc[1])}">${r(a.description||"")}</textarea>
    </div>
    <div class="fgroup">
      <label class="flabel" for="f-note">${r(w.form.note[0])} <em class="tag tag--note">${c("eyeoff",12)} ${ot()}</em></label>
      <textarea id="f-note" class="input" name="internalNote" rows="2" placeholder="${r(w.form.note[1])}">${r(a.internalNote||"")}</textarea>
    </div>

    <div class="list">
      <label class="list__row"><span>${c("bell",18)} Lembrete</span>
        <select name="reminder">${ie.map(t=>`<option value="${t.v}"${(a.reminder??30)===t.v?" selected":""}>${t.label}</option>`).join("")}</select>
      </label>
      ${e?"":`<label class="list__row"><span>${c("repeat",18)} Repetir</span>
        <select name="repeat">${Q.map(t=>`<option value="${t.v}"${o.mode===t.v?" selected":""}>${t.label}</option>`).join("")}</select>
      </label>
      <label class="list__row" data-when="until" hidden><span>${c("calendar",18)} At\xE9</span>
        <input type="date" name="until" value="${o.until}">
      </label>`}
      <label class="list__row"${w.clientLike?"":" hidden"}><span>${c("eye",18)} Aparece no link do cliente</span>
        <input type="checkbox" class="switch" name="visibleToClient" ${a.visibleToClient!==!1?"checked":""}>
      </label>
      ${e?`<label class="list__row"><span>${c("check",18)} Status</span>
        <select name="status">${le.map(t=>`<option value="${t}"${a.status===t?" selected":""}>${ne[t].label}</option>`).join("")}</select>
      </label>`:""}
    </div>

    ${e?`<button type="button" class="btn btn--danger-soft btn--block" data-delete>${c("trash",18)} Excluir ${C()}</button>`:""}
    <div class="form__spacer"></div>
  </form>`}function ut(a,e,o,l){let t=a.el,n=t.querySelector("[data-editor]"),u=p=>t.querySelector(p),d=()=>{let p=u("[data-hint]");p.innerHTML=bt(e,!o),p.querySelectorAll("[data-settime]").forEach(b=>b.onclick=()=>{e.time=b.dataset.settime,n.time.value=e.time,d()}),p.querySelectorAll("[data-setwho]").forEach(b=>b.onclick=()=>{e.assignees=[b.dataset.setwho],t.querySelectorAll("[data-who]").forEach(g=>g.classList.toggle("is-on",e.assignees.includes(g.dataset.who))),d()})},i=()=>{t.querySelector('[data-when="duration"]').hidden=!ee(e.type);let p=t.querySelector('[data-when="net"]');p&&(p.hidden=h[e.type].kind!=="post"),t.querySelector('[data-when="location"]').hidden=!K(e.type);let b=s.company(e.companyId),g=u("[data-useaddr]");g.hidden=!(b&&b.address&&n.location.value!==b.address);let A=t.querySelector('[data-when="until"]');A&&(A.hidden=l.mode==="none")};t.querySelectorAll("[data-type]").forEach(p=>p.onclick=()=>{let b=e.type;if(e.type=p.dataset.type,t.querySelectorAll("[data-type]").forEach(g=>g.classList.toggle("is-on",g===p)),n.title.placeholder=h[e.type].placeholder,(!o||b!==e.type)&&(e.duration=ee(e.type)?h[e.type].dur:null,n.duration.value=String(h[e.type].dur),o||(e.visibleToClient=h[e.type].client,n.visibleToClient.checked=e.visibleToClient)),K(e.type)&&!n.location.value){let g=s.company(e.companyId);g?.address&&(n.location.value=g.address,e.location=g.address)}i(),d()}),t.querySelectorAll("[data-company]").forEach(p=>p.onclick=()=>{e.companyId=p.dataset.company,t.querySelectorAll("[data-company]").forEach(g=>g.classList.toggle("is-on",g===p));let b=s.company(e.companyId);K(e.type)&&b?.address&&!n.location.value&&(n.location.value=b.address,e.location=b.address),i()}),u("[data-newco]").onclick=()=>{ve(null,p=>{e.companyId=p.id,f(),a.set(nt(e,!!o,l))})},t.querySelectorAll("[data-who]").forEach(p=>p.onclick=()=>{let b=p.dataset.who;e.assignees=e.assignees.includes(b)?e.assignees.filter(_=>_!==b):[...e.assignees,b],p.classList.toggle("is-on",e.assignees.includes(b)),d();let g=t.querySelector("[data-notifyhelp]"),A=s.team.find(_=>_.id!==s.me);g&&A&&(g.textContent=he(e,A))});let m=t.querySelector('input[name="notifyPartner"]');m&&(m.onchange=()=>{e.notifyPartner=m.checked;let p=t.querySelector("[data-notifyhelp]"),b=s.team.find(g=>g.id!==s.me);p&&b&&(p.textContent=he(e,b))}),u("[data-useaddr]").onclick=()=>{let p=s.company(e.companyId);n.location.value=p.address,e.location=p.address,i()},t.querySelectorAll("[data-net]").forEach(p=>p.onclick=()=>{e.platform=p.dataset.net,t.querySelectorAll("[data-net]").forEach(b=>b.classList.toggle("is-on",b===p))});let f=()=>{e.title=Ye(n.title.value.trim(),e.type),h[e.type].kind==="post"&&!e.platform&&(e.platform="instagram"),h[e.type].kind!=="post"&&(e.platform=null),e.date=n.date.value,e.time=n.time.value||"",e.duration=ee(e.type)?Number(n.duration.value):null,e.location=K(e.type)?n.location.value.trim():"",e.description=n.description.value.trim(),e.internalNote=n.internalNote.value.trim(),e.reminder=Number(n.reminder.value),e.visibleToClient=n.visibleToClient.checked,n.status&&(e.status=n.status.value),n.repeat&&(l.mode=n.repeat.value),n.until&&(l.until=n.until.value)};n.addEventListener("input",()=>{f(),i()}),n.addEventListener("change",()=>{f(),i(),d()});let $=u("[data-delete]");$&&($.onclick=()=>st(e.id,null).then(()=>!s.event(e.id)&&a.close())),u("[data-save]").onclick=async()=>{if(f(),!v){if(!e.companyId&&S()){k("Escolha a empresa"),t.querySelector(".cogrid").scrollIntoView({behavior:"smooth",block:"center"});return}if(!e.date)return k("Escolha o dia");if(ae()&&s.me&&!e.assignees.length&&(e.assignees=[s.me]),!(!e.assignees.length&&!await D({title:"Ningu\xE9m respons\xE1vel?",text:`Este ${C()} ficar\xE1 sem respons\xE1vel. Deseja salvar assim mesmo?`,ok:"Salvar assim"}))&&!v){v=!0;try{await z()}finally{v=!1}}}};let v=!1,z=async()=>{if(o){if(["date","time","duration","type","assignees","companyId"].some(b=>JSON.stringify(e[b])!==JSON.stringify(o[b]))&&!await ge(e,!1,a,y))return;await ht(e,o)}else if(l.mode!=="none"){let p=ft(e.date,l),b=p.filter(_=>V({...e,date:_},{isNew:!0}).some(I=>I.level==="block")),g=p;if(b.length){let _=await B({title:`${b.length} de ${p.length} datas j\xE1 t\xEAm compromisso nesse hor\xE1rio`,text:b.slice(0,6).map(I=>R(I)).join(" \xB7 ")+(b.length>6?" \u2026":""),options:[{label:`Criar s\xF3 nas ${p.length-b.length} datas livres`,value:"free",primary:!0},{label:"Criar em todas mesmo assim",value:"all"}]});if(!_)return;if(_==="free"&&(g=p.filter(I=>!b.includes(I))),!g.length)return k("Nenhuma data livre")}let A=N("s_");await s.upsertMany("events",g.map((_,I)=>({...e,id:I===0?e.id:N("e_"),date:_,seriesId:A})),{activity:{notifyPartner:e.notifyPartner,kind:"series",count:g.length,label:`${h[e.type].label} ${Q.find(_=>_.v===l.mode)?.label.toLowerCase()||""} \xE0s ${P(e.time)}`,sample:{companyId:e.companyId,date:g[0]}}}),a.close(),de({title:`${g.length} ${C()}s marcados`,sub:`${Q.find(_=>_.v===l.mode)?.label||""}${e.time?" \xB7 "+P(e.time):""}`.replace(/^ · /,"")});return}else{if(!await ge(e,!0,a,y))return;await s.upsert("events",{...e}),a.close(),de({title:`${te()} marcado`,sub:`${R(e.date)}${e.time?" \xB7 "+P(e.time):""}`});return}a.close()};function y(){n.time.value=e.time||"",n.date.value=e.date,t.querySelectorAll("[data-who]").forEach(p=>p.classList.toggle("is-on",e.assignees.includes(p.dataset.who))),i(),d()}i(),d()}var $e=420,at=1380,L=a=>(Math.min(Math.max(a,$e),at)-$e)/(at-$e)*100;function mt(a,e){let o=a.time?pe(a):null,l=[8,10,12,14,16,18,20,22];return`<div class="lanes">
    <div class="lanes__head"><strong>${s.team.length>1?`Agenda ${s.team.length===2?"dos dois":"de todos"}`:"Sua agenda"} em ${r(R(a.date))}</strong></div>
    ${s.team.map(t=>{let n=s.eventsOn(a.date,{person:t.id}).filter(i=>i.id!==a.id&&i.time),u=(a.assignees||[]).includes(t.id),d=e.some(i=>i.level==="block"&&i.person===t.id);return`<div class="lane">
        <span class="lane__who">${W(t.id,22)}</span>
        <div class="lane__track">
          ${l.map(i=>`<i class="lane__tick" style="left:${L(i*60)}%"></i>`).join("")}
          ${n.map(i=>{let m=pe(i),f=s.company(i.companyId);return`<span class="lane__ev" style="left:${L(m[0])}%;width:max(4px,${L(m[1])-L(m[0])}%);background:${f?.color||"#888"}" title="${r(Je(i))}"></span>`}).join("")}
          ${o&&u?`<span class="lane__draft${d?" is-clash":""}" style="left:${L(o[0])}%;width:max(6px,${L(o[1])-L(o[0])}%)"></span>`:""}
        </div>
      </div>`}).join("")}
    <div class="lane lane--axis"><span class="lane__who"></span><div class="lane__track">${l.map(t=>`<small style="left:${L(t*60)}%">${t}h</small>`).join("")}</div></div>
  </div>`}function bt(a,e){if(!a.date)return"";let o=V(a,{isNew:e}),l=o.filter(v=>v.level==="block"),t=o.filter(v=>v.level==="warn"),n=o.filter(v=>v.level==="info"),u=Z(a,{limit:4}),d=ue(a),i=(a.assignees||[]).length===1?a.assignees[0]:null,m=l.length&&i?s.team.find(v=>v.id!==i&&d.includes(v.id)):null,f=h[a.type],$=v=>`<li class="issue issue--${v.level}">${c(v.level==="block"?"alert":v.level==="warn"?"flag":v.code==="partner"?"user":"bulb",15)}<div><strong>${r(v.title)}</strong><p>${r(v.text)}</p></div></li>`;return`
  <section class="assist">
    <header class="assist__head">${c("sparkle",16)} Assistente</header>
    ${mt(a,o)}
    ${o.length?`<ul class="issues">${[...l,...t,...n].map($).join("")}</ul>`:a.time?`<p class="assist__ok">${c("check",15)} Hor\xE1rio livre para ${r(Y(a.assignees))}, sem conflitos.</p>`:""}
    ${m?`<button type="button" class="tchip tchip--wide" data-setwho="${m.id}">${W(m.id,18)} Passar para ${r(m.name)} (est\xE1 livre)</button>`:""}
    <div class="assist__sugg">
      <p>${r(f.tip)}</p>
      ${u.length?`<div class="hintbox__times">${u.map(v=>`<button type="button" class="tchip${a.time===v.time?" is-on":""}" data-settime="${v.time}">${P(v.time)}${v.peak?"<small>pico</small>":"<small>livre</small>"}</button>`).join("")}</div>`:`<p class="muted">Nenhum hor\xE1rio livre nesse dia${(a.assignees||[]).length?" para "+r(Y(a.assignees)):""}. Tente outro dia${s.team.length>1?" ou outra pessoa":""}.</p>`}
    </div>
  </section>`}async function ge(a,e,o,l){let n=V(a,{isNew:e}).filter($=>$.level==="block");if(!n.length)return!0;let u=Z(a,{limit:2}),d=(a.assignees||[]).length===1?a.assignees[0]:null,i=d&&s.team.find($=>$.id!==d&&ue(a).includes($.id)),m=[...u.map($=>({label:`Mudar para ${P($.time)} (livre)`,value:"time:"+$.time,primary:!0})),...i?[{label:`Passar para ${i.name} (est\xE1 livre)`,value:"who:"+i.id,primary:!u.length}]:[],{label:"Marcar mesmo assim",value:"force"}],f=await B({title:n[0].code==="duplicate"?"Isso j\xE1 est\xE1 na agenda":"J\xE1 tem compromisso nesse hor\xE1rio",bodyHtml:`<ul class="issues issues--dialog">${n.map($=>`<li class="issue issue--block">${c("alert",15)}<div><strong>${r($.title)}</strong><p>${r($.text)}</p></div></li>`).join("")}</ul>`,options:m});return f?f==="force"?!0:(f.startsWith("time:")&&(a.time=f.slice(5)),f.startsWith("who:")&&(a.assignees=[f.slice(4)]),l(),ge(a,e,o,l)):!1}async function vt(a,e){let o={...a,...e},l=V(o).filter(n=>n.level==="block");return l.length?await B({title:"J\xE1 tem compromisso nesse hor\xE1rio",bodyHtml:`<ul class="issues issues--dialog">${l.map(n=>`<li class="issue issue--block">${c("alert",15)}<div><strong>${r(n.title)}</strong><p>${r(n.text)}</p></div></li>`).join("")}</ul>`,options:[{label:"Mover mesmo assim",value:"force",primary:!0}]})==="force":!0}function ft(a,e){let o=[],l=a,t=e.until&&e.until>=a?e.until:E(a,28);for(;l<=t&&o.length<150;){let n=G(l).getDay();(e.mode==="daily"||e.mode==="weekdays"&&n>=1&&n<=5||e.mode==="weekly"&&G(l).getDay()===G(a).getDay())&&o.push(l),l=E(l,1)}return o}var $t=["type","companyId","title","time","duration","assignees","location","description","internalNote","reminder","visibleToClient"];async function ht(a,e){let o=$t.filter(l=>JSON.stringify(a[l])!==JSON.stringify(e[l]));if(a.seriesId&&o.length){let l=s.state.events.filter(t=>t.seriesId===a.seriesId&&t.date>e.date);if(l.length){let t=await B({title:`${te()} repetido`,text:"Aplicar as altera\xE7\xF5es a quais eventos?",options:[{label:"S\xF3 a este",value:"one",primary:!0},{label:`A este e aos pr\xF3ximos (${l.length+1})`,value:"next"}]});if(!t)return;if(t==="next"){let n=Object.fromEntries(o.map(u=>[u,a[u]]));await s.upsertMany("events",[{...a},...l.map(u=>({...u,...n}))],{activity:{kind:"series-edit",count:l.length+1,label:`${h[a.type].label} \xB7 a partir de ${a.date.slice(8)}/${a.date.slice(5,7)}`,sample:{companyId:a.companyId,date:a.date}}}),k("S\xE9rie atualizada");return}}}await s.upsert("events",{...a}),k("Altera\xE7\xF5es salvas")}export{Ye as a,At as b,It as c,ve as d,Yt as e,tt as f,vt as g};
