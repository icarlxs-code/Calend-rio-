import{a as Je,b as We}from"./c-J4YWSCB6.js";import{b as pe,c as Fe,d as V,e as Z,f as ue}from"./c-XZB3KUNW.js";import{a as de,b as D}from"./c-7VNEFV7Q.js";import{f as He}from"./c-DSRWVS5F.js";import{C as Ue}from"./c-YAFITVBN.js";import{a as Me,b as De,c as Pe,d as W,g as Y,h as C,i as Re,j as Be,k as re,m as ce,n as O,p as j,q as w,r as M,s as B}from"./c-Q6DHGZF5.js";import{b as p}from"./c-DWBEWQEH.js";import{d as ze}from"./c-AP3P4QYF.js";import{a as oe,b as Ce,d as Ae,e as Le,f as s}from"./c-DXNZ5F63.js";import{a as ye}from"./c-3VF3KZPI.js";import{B as c,D as F,G as qe,c as G,d as T,e as E,f as we,g as ke,k as _e,l as Se,m as P,r as xe,t as Ee,u as H,v as R,w as se,z as N}from"./c-MPTN5RTT.js";import{a as $,b as J,c as k,e as Ie,f as x,h as Te,i as U,j as Ne,l as S,n as Oe,o as ne,p as le,r as X,s as je,t as ie,u as Q}from"./c-JRZKGWYQ.js";var Ve=new Set(["fazer","criar","postar","subir","publicar","gravar","post","postagem","publicacao","publica\xE7\xE3o","o","a","um","uma","no","na","do","da","de","dos","das","pro","pra","para","feed","reels","reel","story","stories","storie","storys","carrossel","carosel","carossel","instagram","insta","ig","sobre","com","e"]),nt=[[/\bcouve flor\b/gi,"couve-flor"],[/\bpromocao\b/gi,"promo\xE7\xE3o"],[/\bpromoçao\b/gi,"promo\xE7\xE3o"],[/\bacao\b/gi,"a\xE7\xE3o"],[/\bpao\b/gi,"p\xE3o"],[/\blimao\b/gi,"lim\xE3o"],[/\bmamao\b/gi,"mam\xE3o"],[/\bmelao\b/gi,"mel\xE3o"],[/\bfeijao\b/gi,"feij\xE3o"],[/\bmaca\b/gi,"ma\xE7\xE3"],[/\bmaça\b/gi,"ma\xE7\xE3"],[/\babobora\b/gi,"ab\xF3bora"],[/\bpessego\b/gi,"p\xEAssego"],[/\bmaracuja\b/gi,"maracuj\xE1"],[/\babacate\b/gi,"abacate"],[/\babacaxi\b/gi,"abacaxi"],[/\bcafe\b/gi,"caf\xE9"],[/\bpromo\b/gi,"promo"],[/\bblack friday\b/gi,"Black Friday"],[/\bnatal\b/gi,"Natal"],[/\bano novo\b/gi,"Ano Novo"],[/\bdia das maes\b/gi,"Dia das M\xE3es"],[/\bdia dos pais\b/gi,"Dia dos Pais"],[/\bhamburguer\b/gi,"hamb\xFArguer"],[/\bhamburguers\b/gi,"hamb\xFArgueres"],[/\blancamento\b/gi,"lan\xE7amento"],[/\bcolecao\b/gi,"cole\xE7\xE3o"],[/\bvideo\b/gi,"v\xEDdeo"],[/\bsabado\b/gi,"s\xE1bado"],[/\bpromocoes\b/gi,"promo\xE7\xF5es"]],Ke=a=>a.toLowerCase().replace(/[.,:;!]+$/,""),lt={feed:"Post no feed",carrossel:"Carrossel",reels:"Reels",story:"Stories"},Ge=/^(post no feed|carrossel|reels|stories|story)\s+—\s+/i;function Qe(a,e=null){let o=String(a||"").replace(/\s+/g," ").trim();if(!o)return o;let i=lt[e];if(!i)return be(me(o));if(Ge.test(o))return`${i} \u2014 ${be(me(o.replace(Ge,"")))}`;let t=o.split(" ");for(;t.length>1&&Ve.has(Ke(t[0]));)t.shift();return o=t.join(" ").replace(/\s+(no|pro|pra|para o)\s+(instagram|insta|ig|feed)\s*$/i,"").trim(),Ve.has(Ke(o))?i:`${i} \u2014 ${be(me(o))}`}var me=a=>{for(let[e,o]of nt)a=a.replace(e,o);return a},be=a=>a&&a.charAt(0).toLocaleUpperCase("pt-BR")+a.slice(1);var it={Empresa:"Pura Vida",Local:"Hospital Santa Clara",Turma:"9\xBA ano B",Obra:"Residencial Aurora",Cliente:"Maria Silva",Setor:"Linha de produ\xE7\xE3o 2",Unidade:"3\xBA Batalh\xE3o",Projeto:"Novo site",Plataforma:"iFood",\u00C1rea:"Talh\xE3o 3",Mat\u00E9ria:"Matem\xE1tica"};function Lt(){let a=s.companiesSorted(),e=T(),o=we(e),i=E(o,6);return`
  <header class="hdr">
    <div class="hdr__row">
      <div class="hdr__titles"><p class="hdr__eyebrow">${a.length} ${a.length===1?S(!1,!0):S(!0,!0)}</p><h1>${S(!0)}</h1></div>
      <div class="hdr__actions"><button class="btn btn--primary btn--sm" data-action="new-company">${p("plus",16)} ${U()}</button></div>
    </div>
  </header>
  <div class="page">
    ${a.length?"":ce(`${Ne()} ${S(!1,!0)} ainda`,`Cadastre ${k.entity.hint} com nome, cor e foto. Assim cada compromisso fica organizado no lugar certo.`,`<button class="btn btn--primary" data-action="new-company">${p("plus",18)} Cadastrar ${S(!1,!0)}</button>`)}
    <div class="colist">
      ${a.map(t=>{let n=s.eventsBetween(o,i,{companyId:t.id}),u=s.state.events.filter(r=>r.companyId===t.id&&r.date>=e&&r.status!=="feito").sort((r,l)=>(r.date+r.time).localeCompare(l.date+l.time))[0];return`<button class="cocard" style="--cc:${t.color};--cc-soft:${F(t.color,.1)}" data-action="open-company" data-id="${t.id}">
          <div class="cocard__top">
            ${C(t,48)}
            <div class="cocard__name"><strong>${c(t.name)}</strong><small>${u?`<b>${c(H(u.date))}${u.time?" "+u.time:""}</b> \xB7 ${c(u.title||$[u.type].label)}`:"Nada agendado"}</small></div>${n.length?`<em class="cocard__n" title="nesta semana">${n.length}</em>`:""}
            ${p("right",18,"muted")}
          </div>
        </button>`}).join("")}
    </div>
  </div>`}function It(a){let e=O({className:"sheet--tall",html:Ye(a),onMount:o=>rt(o,a)});e.refresh=()=>s.company(a)?e.set(Ye(a)):e.close()}function Ye(a){let e=s.company(a);if(!e)return"";let o=T(),i=ke(o),t=s.eventsBetween(`${i}-01`,`${i}-31`,{companyId:a}),n=s.eventsBetween(o,E(o,30),{companyId:a}),u=s.eventsBetween(E(o,-14),E(o,-1),{companyId:a}).reverse(),r=v=>t.filter(b=>v.includes(b.type)).length,l=t.filter(v=>v.status==="feito").length,f="",h=n.map(v=>{let b=v.date!==f?`<h4 class="dayhead">${c(R(v.date))}</h4>`:"";return f=v.date,b+re(v)}).join("");return`
  ${j("",{right:s.canEdit("companies",e)?'<button class="btn-text" data-act="edit">Editar</button>':""})}
  <div class="cohero" style="--cc:${e.color};--cc-soft:${F(e.color,.14)}">
    ${C(e,72,20)}
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
      <h2 class="block__title">${c(Ee(i))}</h2>
      <div class="mstats mstats--5">
        <div><b>${r(["feed","carrossel"])}</b><span>feed</span></div>
        <div><b>${r(["reels"])}</b><span>reels</span></div>
        <div><b>${r(["story"])}</b><span>stories</span></div>
        <div><b>${r(["captacao"])}</b><span>capta\xE7\xF5es</span></div>
        <div><b>${t.length?Math.round(l/t.length*100):0}%</b><span>feito</span></div>
      </div>
    </section>

    ${e.address||e.contact||e.notes?`<ul class="rows">
      ${e.address?`<li><span class="rows__k">${p("pin",16)} Endere\xE7o</span><a class="rows__v link" href="https://maps.apple.com/?q=${encodeURIComponent(e.address)}" target="_blank" rel="noopener">${c(e.address)}</a></li>`:""}
      ${e.contact?`<li><span class="rows__k">${p("user",16)} Contato</span><span class="rows__v">${c(e.contact)}</span></li>`:""}
      ${e.notes?`<li><span class="rows__k">${p("note",16)} Observa\xE7\xF5es</span><span class="rows__v">${c(e.notes)}</span></li>`:""}
    </ul>`:""}

    <section class="block">
      <h2 class="block__title">Pr\xF3ximos 30 dias</h2>
      ${h||ce("Nada agendado","Toque em + para marcar o primeiro compromisso aqui.")}
    </section>

    ${u.length?`<section class="block">
      <h2 class="block__title">\xDAltimas 2 semanas</h2>
      ${u.map(v=>re(v,{showDate:!0,compact:!0})).join("")}
    </section>`:""}
  </div>`}function rt(a,e){let o=a.el;(o.querySelector('[data-act="edit"]')||{}).onclick=()=>fe(e),o.querySelector('[data-act="new"]').onclick=async()=>{let{openEventEditor:i}=await import("./c-6MDWPZEW.js");i({companyId:e})},o.querySelector('[data-act="share"]').onclick=()=>ve(e),o.querySelector('[data-act="clientview"]').onclick=()=>ct(e)}function fe(a=null,e=null){let o=a?s.company(a):null,i=s.state.companies.map(r=>r.color),t=o?{...o}:{id:N("c_"),name:"",color:X.find(r=>!i.includes(r))||X[0],logo:null,instagram:"",address:"",contact:"",notes:"",shareToken:null},n=()=>`
    ${j(o?`Editar ${S(!1,!0)}`:`${U()} ${S(!1,!0)}`,{left:'<button class="btn-text" data-close>Cancelar</button>',right:'<button class="btn btn--primary btn--sm" data-save>Salvar</button>'})}
    <form class="form" onsubmit="return false">
      <div class="logopick">
        <div data-preview>${C({...t,name:t.name||"?"},88,24)}</div>
        <div class="logopick__btns">
          <label class="btn btn--soft btn--sm">${p("image",16)} ${t.logo?"Trocar logo":"Enviar logomarca"}<input type="file" accept="image/*" data-file hidden></label>
          ${t.logo?'<button type="button" class="btn-text btn-text--sm" data-rmlogo>Remover logo</button>':'<p class="fhelp">Opcional. Sem logo, usamos as iniciais na cor escolhida.</p>'}
        </div>
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-name">Nome (${c(k.entity.hint)})</label>
        <input id="c-name" class="input" name="name" value="${c(t.name)}" placeholder="Ex.: ${c(it[k.entity.one]||"Pura Vida")}" autocomplete="off" maxlength="60">
      </div>
      <div class="fgroup">
        <label class="flabel">Cor no calend\xE1rio</label>
        <div class="palette">
          ${X.map(r=>`<button type="button" class="swatch${t.color===r?" is-on":""}" style="background:${r}" data-color="${r}" aria-label="Cor ${r}">${p("check",16)}</button>`).join("")}
          <label class="swatch swatch--custom" title="Outra cor"><input type="color" value="${t.color}" data-customcolor>${p("plus",16)}</label>
        </div>
      </div>
      <div class="fgroup"${x()?"":" hidden"}>
        <label class="flabel" for="c-ig">Instagram</label>
        <div class="input-prefix"><span>@</span><input id="c-ig" class="input" name="instagram" value="${c(t.instagram||"")}" placeholder="usuario" autocomplete="off" autocapitalize="none"></div>
      </div>
      <div class="fgroup"${s.team.length>1?"":" hidden"}>
        <label class="flabel">Notifica\xE7\xF5es daqui v\xE3o para</label>
        <div class="seg seg--notify">${[["",s.team.length===2?"Os dois":"Todos"],...s.team.map(r=>[r.id,r.name])].map(([r,l])=>`<button type="button" class="seg__btn${(t.notifyOnly||"")===r?" is-on":""}" data-only="${r}">${c(l)}</button>`).join("")}</div>
        <p class="fhelp">${x()?"Avisos, lembretes, \u201CJ\xE1 postou?\u201D, cobran\xE7as de atraso e dicas desta empresa":`Avisos, lembretes e cobran\xE7as de atraso ${Te()?"desta":"deste"} ${c(S(!1,!0))}`} chegam s\xF3 para quem estiver marcado.</p>
      </div>
      <div class="fgroup"${x()?"":" hidden"}>
        <label class="flabel" for="c-niche">O que a empresa faz (para as dicas)</label>
        <input id="c-niche" class="input" name="niche" value="${c(t.niche||We(t))}" placeholder="Ex.: hamburgueria artesanal, loja de roupas femininas" autocomplete="off" maxlength="160">
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
      ${o?`<button type="button" class="btn btn--danger-soft btn--block" data-delete>${p("trash",18)} Excluir ${S(!1,!0)}</button>`:""}
      <div class="form__spacer"></div>
    </form>`,u=r=>{let l=r.el,f=l.querySelector("form"),h=()=>{t.name=f.name.value.trim(),t.instagram=f.instagram.value.trim().replace(/^@/,""),t.niche=f.niche.value.trim(),t.notifyOnly=l.querySelector("[data-only].is-on")?.dataset.only||null,t.address=f.address.value.trim(),t.contact=f.contact.value.trim(),t.notes=f.notes.value.trim()},v=()=>l.querySelector("[data-preview]").innerHTML=C({...t,name:f.name.value||"?"},88,24);f.name.addEventListener("input",v),l.querySelectorAll("[data-only]").forEach(y=>y.onclick=()=>l.querySelectorAll("[data-only]").forEach(d=>d.classList.toggle("is-on",d===y))),l.querySelectorAll("[data-color]").forEach(y=>y.onclick=()=>{t.color=y.dataset.color,l.querySelectorAll("[data-color]").forEach(d=>d.classList.toggle("is-on",d===y)),v()}),l.querySelector("[data-customcolor]").oninput=y=>{t.color=y.target.value,l.querySelectorAll("[data-color]").forEach(d=>d.classList.remove("is-on")),v()},l.querySelector("[data-file]").onchange=async y=>{let d=y.target.files[0];if(d)try{h(),t.logo=await qe(d,160),r.set(n())}catch{w("N\xE3o foi poss\xEDvel ler essa imagem")}};let b=l.querySelector("[data-rmlogo]");b&&(b.onclick=()=>{h(),t.logo=null,r.set(n())});let z=l.querySelector("[data-delete]");z&&(z.onclick=async()=>{let y=s.state.events.filter(m=>m.companyId===t.id);await M({title:`Excluir ${t.name}?`,text:y.length?`Os ${y.length} compromissos daqui tamb\xE9m ser\xE3o apagados e o link do cliente deixar\xE1 de funcionar.`:"O link do cliente deixar\xE1 de funcionar.",ok:"Excluir",danger:!0})&&(await s.removeMany("events",y.map(m=>m.id)),await s.remove("companies",t.id),r.close(),w("Exclu\xEDdo"))}),l.querySelector("[data-save]").onclick=async()=>{if(h(),!t.name)return f.name.focus(),w("Digite o nome");await s.upsert("companies",{...t}),r.close(),w(o?"Atualizado":"Cadastrado"),e&&e(s.company(t.id))}};O({className:"sheet--tall",html:n(),onMount:u})}async function ve(a){let e=s.company(a),o=s.mode==="cloud",i="";o?(await s.ensureShareToken(e),await s.publishCompany(a),i=Ae(s.company(a).shareToken)):i=Le(await Ce(oe(e,s.state.events,{maxFuture:90})));let t=`
    ${j("Link do cliente")}
    <div class="share">
      <div class="share__co">${C(e,56)}<div><strong>${c(e.name)}</strong><small>v\xEA somente o pr\xF3prio cronograma</small></div></div>
      <ul class="checks">
        <li>${p("check",16)} Somente os eventos da ${c(e.name)}</li>
        <li>${p("check",16)} Sem notas internas e sem outras empresas</li>
        <li>${p("check",16)} Somente leitura: o cliente n\xE3o consegue alterar nada</li>
        <li>${p(o?"check":"alert",16)} ${o?"Sempre atualizado: tudo que voc\xEAs mudarem aparece para o cliente":"Foto do cronograma atual (pr\xF3ximos 90 dias). Quando mudar algo, envie o link de novo"}</li>
      </ul>
      <div class="share__link"><input readonly value="${c(i)}" data-link></div>
      <div class="share__btns">
        <button class="btn btn--primary btn--block" data-sharebtn>${p("share",18)} Enviar para o cliente</button>
        <button class="btn btn--soft btn--block" data-copy>${p("copy",18)} Copiar link</button>
        <a class="btn btn--ghost btn--block" href="${c(i)}" target="_blank" rel="noopener">${p("eye",18)} Ver como o cliente v\xEA</a>
      </div>
      ${o?'<button class="btn-text btn-text--sm btn-text--danger" data-revoke>Gerar novo link (o antigo para de funcionar)</button>':'<p class="fhelp">Dica: ative a sincroniza\xE7\xE3o na nuvem (Ajustes) para o link ficar sempre atualizado automaticamente.</p>'}
    </div>`;O({html:t,onMount:n=>{let u=n.el;u.querySelector("[data-copy]").onclick=async()=>{try{await navigator.clipboard.writeText(i),w("Link copiado")}catch{u.querySelector("[data-link]").select(),w("Selecione e copie o link")}},u.querySelector("[data-sharebtn]").onclick=async()=>{let l=`Ol\xE1! Este \xE9 o cronograma de conte\xFAdo da ${e.name}. Por aqui voc\xEAs acompanham tudo o que est\xE1 planejado: posts, stories, reels e capta\xE7\xF5es.`;if(navigator.share)try{await navigator.share({title:`Cronograma \xB7 ${e.name}`,text:l,url:i})}catch{}else await navigator.clipboard?.writeText(`${l}
${i}`),w("Mensagem copiada")};let r=u.querySelector("[data-revoke]");r&&(r.onclick=async()=>{await M({title:"Gerar um novo link?",text:"Quem tiver o link antigo n\xE3o conseguir\xE1 mais ver o cronograma.",ok:"Gerar novo link",danger:!0})&&(await s.regenerateShareToken(s.company(a)),n.close(),ve(a))})}})}async function ct(a){let e=s.company(a);if(!e)return;let{showClient:o}=await import("./c-I6IRRO7G.js"),{sanitizePayload:i}=await import("./c-KKFR4PWL.js"),t=i(oe(e,s.state.events)),n=document.createElement("div");n.className="client-preview",n.innerHTML=`<div class="client-preview__bar"><button class="btn btn--soft btn--sm" data-closepv>${p("left",16)} Voltar</button><span>Assim o cliente v\xEA</span><button class="btn btn--primary btn--sm" data-sendpv>${p("share",16)} Enviar</button></div><div class="client-preview__body"></div>`,document.body.appendChild(n),document.body.classList.add("has-sheet"),o(n.querySelector(".client-preview__body"),t,{canGoBack:!1,preview:!0});let u=()=>{n.remove(),document.body.classList.toggle("has-sheet",!!document.querySelector(".sheet-wrap"))};n.querySelector("[data-closepv]").onclick=u,n.querySelector("[data-sendpv]").onclick=()=>{u(),ve(a)}}function Yt(a){let e=O({html:Ze(a),className:"sheet--tall",onMount:o=>dt(o,a)});e.refresh=()=>{if(!s.event(a))return e.close();e.set(Ze(a))}}function Ze(a){let e=s.event(a);if(!e)return"";let o=s.company(e.companyId),i=o?.color||"#666",t=ie.find(l=>l.v===(e.reminder??30)),n=e.seriesId?s.state.events.filter(l=>l.seriesId===e.seriesId).length:0,u=s.canEdit("events",e),r=s.member(s.ownerOf("events",e))?.name||"o parceiro";return`
  ${j("",{right:u?'<button class="btn-text" data-act="edit">Editar</button>':""})}
  <div class="detail">
    <div class="detail__hero" style="--cc:${i};--cc-soft:${F(i,.12)}">
      <div class="detail__co">${C(o,40)}<div><strong>${c(o?.name||"Sem "+S(!1,!0))}</strong>${o?.instagram?`<small>@${c(o.instagram)}</small>`:""}</div>${Re(e.type,{solid:!0})}</div>
      <h2><span class="pfrow">${Pe(e,24)}</span>${c(e.title||$[e.type].label)}</h2>
      <p class="detail__when">${p("calendar",15)} ${c(H(e.date))}, ${c(xe(e.date).split(", ")[1])} \xB7 ${p("clock",15)} ${c(Be(e))}</p>
    </div>

    ${u?"":`<p class="detail__lock">${p("eye",14)} Cadastrado por ${c(r)} \u2014 ${s.canComplete(e)?"voc\xEA \xE9 respons\xE1vel: pode marcar o andamento, mas n\xE3o editar.":"voc\xEA s\xF3 pode ver. Use \u201CDuplicar\u201D para criar uma c\xF3pia sua."}</p>`}
    <div class="seg seg--status"${u||s.canComplete(e)?"":" hidden"}>
      ${le.map(l=>`<button class="seg__btn${e.status===l?" is-on":""} st-${l}" data-status="${l}">${l==="feito"?p("check",14):""}${ne[l].label}</button>`).join("")}
    </div>

    ${e.status==="feito"&&(e.assignees||[]).concat(e.createdBy).includes(s.me)&&s.mode==="cloud"?`<button class="storybtn" data-act="story"><span class="storybtn__ic">${p("camera",20)}</span>${(()=>{let l=Ue("w",`e:${e.id}`);return l.ja?"<span><b>Postar outro story</b><small>O b\xF4nus dessa voc\xEA j\xE1 ganhou \u2714\uFE0F \xB7 some em 24 h</small></span></button>":`<span><b>Postar story do que voc\xEA fez</b><small>${l.got?`+${l.total} XP agora`:"Foto tirada agora"}${l.badges[0]?` \xB7 desbloqueia \u201C${c(l.badges[0].name())}\u201D`:l.lv1>l.lv0?` \xB7 sobe pro n\xEDvel ${l.lv1}`:" \xB7 XP em dobro"} \xB7 some em 24 h</small></span><i class="storybtn__x2">2\xD7</i></button>`})()}`:""}
    <ul class="rows">
      ${ae()?"":`<li><span class="rows__k">${p("users",16)} Respons\xE1vel</span><span class="rows__v">${(e.assignees||[]).map(l=>W(l,22)).join("")} ${c(Y(e.assignees))}</span></li>`}
      ${e.location?`<li><span class="rows__k">${p("pin",16)} Local</span><a class="rows__v link" href="https://maps.apple.com/?q=${encodeURIComponent(e.location)}" target="_blank" rel="noopener">${c(e.location)}</a></li>`:""}
      ${$[e.type].kind!=="post"||e.duration?`<li><span class="rows__k">${p("clock",16)} Dura\xE7\xE3o</span><span class="rows__v">${c(se(Oe(e)))}</span></li>`:""}
      <li><span class="rows__k">${p("bell",16)} Lembrete</span><span class="rows__v">${c(t?.label||"\u2014")}</span></li>
      ${n?`<li><span class="rows__k">${p("repeat",16)} Repeti\xE7\xE3o</span><span class="rows__v">${n} eventos na s\xE9rie</span></li>`:""}
      ${k.clientLike?`<li><span class="rows__k">${p(e.visibleToClient===!1?"eyeoff":"eye",16)} Cliente</span><span class="rows__v">${e.visibleToClient===!1?"N\xE3o aparece para o cliente":"Aparece no link do cliente"}</span></li>`:""}
    </ul>

    ${e.description?`<div class="textbox"><h4>${c(k.form.desc[0])}</h4><p>${c(e.description)}</p></div>`:""}
    ${e.internalNote?`<div class="textbox textbox--note"><h4>${p("eyeoff",13)} ${c(k.form.note[0])} (${st()})</h4><p>${c(e.internalNote)}</p></div>`:""}

    <div class="actions">
      <button data-act="ics">${p("bell",20)}<span>Lembrete no iPhone</span></button>
      ${u?`<button data-act="tomorrow">${p("right",20)}<span>Passar p/ amanh\xE3</span></button>`:""}
      <button data-act="dup">${p("copy",20)}<span>Duplicar</span></button>
      ${u?`<button data-act="del" class="is-danger">${p("trash",20)}<span>Excluir</span></button>`:""}
    </div>
    <p class="detail__meta">Criado por ${c(s.member(e.createdBy)?.name||"\u2014")}${e.updatedAt?" \xB7 atualizado "+new Date(e.updatedAt).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):""}</p>
  </div>`}function dt(a,e){let o=a.el;o.querySelectorAll("[data-status]").forEach(t=>t.onclick=async()=>{let n=s.event(e),u=t.getBoundingClientRect();if(await s.upsert("events",{...n,status:t.dataset.status}),t.dataset.status==="feito"&&n.status!=="feito"&&s.event(e)?.status==="feito"){let r=n.date===T()?s.eventsOn(n.date,{person:s.me}).filter(l=>l.status!=="feito").length:null;w(ze({el:u,left:r}))}});let i=(t,n)=>{let u=o.querySelector(`[data-act="${t}"]`);u&&(u.onclick=n)};i("edit",()=>et({id:e})),i("story",()=>{let t=s.event(e);He({title:t.title||$[t.type]?.label||"",ref:`e:${e}`,kind:"w"})}),i("dup",async()=>{let n={...s.event(e),id:N("e_"),status:"pendente",seriesId:null,createdAt:null,createdBy:null};await s.upsert("events",n),a.close(),w(`${te()} duplicado`),et({id:n.id})}),i("tomorrow",async()=>{let t=s.event(e);await bt(t,{date:E(t.date,1)})&&(await s.upsert("events",{...t,date:E(t.date,1)}),w("Movido para "+H(E(t.date,1)).toLowerCase(),{action:"Desfazer",onAction:()=>s.upsert("events",{...s.event(e),date:t.date})}))}),i("ics",()=>{let t=s.event(e);Je([t],`${$[t.type].label}-${t.date}.ics`,ye.appName)}),i("del",()=>at(e,a))}async function at(a,e){let o=s.event(a),i=[a];if(o.seriesId){let r=s.state.events.filter(l=>l.seriesId===o.seriesId&&l.date>=o.date).map(l=>l.id);if(r.length>1){let l=await B({title:`Excluir ${q()} repetido`,options:[{label:"S\xF3 este",value:"one",danger:!0},{label:`Este e os pr\xF3ximos (${r.length})`,value:"next",danger:!0}]});if(!l)return;l==="next"&&(i=r)}else if(!await M({title:`Excluir este ${q()}?`,ok:"Excluir",danger:!0}))return}else if(!await M({title:`Excluir este ${q()}?`,text:s.team.length>1?"Ele some da agenda de todos.":"Ele some da sua agenda.",ok:"Excluir",danger:!0}))return;let t=i.map(r=>({...s.event(r)})),n=window.__motion,u=n&&n.guardar([...document.querySelectorAll("#view .ecard")].find(r=>r.dataset.id===a));await s.removeMany("events",i),n&&!s.event(a)&&n.excluido(u),e&&e.close(),w(i.length>1?`${i.length} ${q()}s exclu\xEDdos`:`${te()} exclu\xEDdo`,{action:"Desfazer",onAction:()=>s.upsertMany("events",t),ms:4500})}function et({id:a=null,date:e=null,companyId:o=null,type:i=null,time:t=null,assignees:n=null,title:u=""}={}){let r=a?s.event(a):null;if(r&&!s.canEdit("events",r)){s._denied("events",r);return}let l=s.companiesSorted(),f=i||(J.includes("feed")?"feed":J[0]),h=r?JSON.parse(JSON.stringify(r)):{id:N("e_"),type:f,companyId:o||D.monthCompany||(l.length===1?l[0].id:null),title:u||"",date:e||(D.tab==="mes"?D.monthSel:D.date)||T(),time:t||$[f].best[0]||"12:00",duration:["shoot","meeting","work","other"].includes($[f].kind)?$[f].dur:null,assignees:n||(D.person!=="all"?[D.person]:s.me?[s.me]:[]),location:"",description:"",internalNote:"",reminder:30,visibleToClient:$[f].client,status:"pendente"};if(!r&&!t&&!x()){let y=Z(h,{limit:6}).map(d=>d.time).sort();if(y.length)h.time=y[0];else if(h.date===T()){let d=Math.ceil((Se()+30)/30)*30;d<1440&&(h.time=_e(d))}}let v=r?JSON.parse(JSON.stringify(r)):null,b={mode:"none",until:E(h.date,28)};return O({className:"sheet--tall",html:ot(h,!!r,b),onMount:y=>pt(y,h,v,b)})}function he(a,e){let o=(a.assignees||[]).includes(e.id);return a.notifyPartner===!1?o?`Sem aviso agora. Como ${e.name} \xE9 respons\xE1vel, ele ainda recebe os lembretes do hor\xE1rio.`:`${e.name} n\xE3o recebe aviso nem lembretes deste evento. Fica s\xF3 na agenda.`:`${e.name} recebe o aviso de que voc\xEA marcou e os lembretes do hor\xE1rio.`}var q=()=>x()?"evento":"compromisso",te=()=>x()?"Evento":"Compromisso",ae=()=>s.team.length<2,st=()=>ae()?"s\xF3 voc\xEA v\xEA":`s\xF3 ${s.team.length>2?"a equipe":"voc\xEAs"} veem`,ee=a=>["shoot","meeting","work","other"].includes($[a].kind),K=a=>["shoot","meeting"].includes($[a].kind);function ot(a,e,o){let i=s.companiesSorted();return`
  ${j(e?`Editar ${q()}`:`Novo ${q()}`,{left:'<button class="btn-text" data-close>Cancelar</button>',right:'<button class="btn btn--primary btn--sm" data-save>Salvar</button>'})}
  <form class="form" data-editor onsubmit="return false">
    <div class="fgroup">
      <label class="flabel">O que \xE9?</label>
      <div class="typegrid">
        ${J.map(t=>`<button type="button" class="typebtn tbadge--${t}${a.type===t?" is-on":""}"${Ie(t)} data-type="${t}">${p($[t].icon,20)}<span>${$[t].label}</span></button>`).join("")}
      </div>
    </div>

    <div class="fgroup">
      <label class="flabel">${S()}${x()?"":' <em class="tag">opcional</em>'}</label>
      <div class="cogrid">
        ${i.map(t=>`<button type="button" class="cobtn${a.companyId===t.id?" is-on":""}" style="--cc:${t.color}" data-company="${t.id}">${C(t,26,7)}<span>${c(t.name)}</span></button>`).join("")}
        <button type="button" class="cobtn cobtn--add" data-newco>${p("plus",18)}<span>${U()} ${S(!1,!0)}</span></button>
      </div>
    </div>

    ${J.some(t=>$[t].kind==="post")||$[a.type].kind==="post"?`<div class="fgroup" data-when="net" ${$[a.type].kind==="post"?"":"hidden"}>
      <label class="flabel">Onde vai postar?</label>
      <div class="netgrid">${Me.map(t=>{let n=De(t);return n?`<button type="button" class="netbtn${(a.platform||"instagram")===t?" is-on":""}" data-net="${t}"><span class="pf" style="width:22px;height:22px">${n.svg}</span><span>${c(n.name.replace(" (Twitter)",""))}</span></button>`:""}).join("")}</div>
    </div>`:""}

    <div class="fgroup">
      <label class="flabel" for="f-title">T\xEDtulo</label>
      <input id="f-title" class="input" name="title" value="${c(a.title)}" placeholder="${c($[a.type].placeholder)}" autocomplete="off" maxlength="120">
    </div>

    <div class="fgroup row2">
      <div><label class="flabel" for="f-date">Dia</label><input id="f-date" class="input" type="date" name="date" value="${a.date}" required></div>
      <div><label class="flabel" for="f-time">Hor\xE1rio</label><input id="f-time" class="input" type="time" name="time" value="${a.time||""}" step="300"></div>
    </div>

    <div class="fgroup" data-when="duration" ${ee(a.type)?"":"hidden"}>
      <label class="flabel" for="f-dur">Dura\xE7\xE3o</label>
      <select id="f-dur" class="input" name="duration">
        ${je.map(t=>`<option value="${t}"${(a.duration||$[a.type].dur)===t?" selected":""}>${se(t)}</option>`).join("")}
      </select>
    </div>

    <div data-hint></div>

    <div class="fgroup"${ae()?" hidden":""}>
      <label class="flabel">Quem vai fazer?</label>
      <div class="whogrid">
        ${s.team.map(t=>`<button type="button" class="whobtn${(a.assignees||[]).includes(t.id)?" is-on":""}" style="--mc:${t.color}" data-who="${t.id}">${W(t.id,30)}<span>${c(t.name)}</span><i class="whobtn__check">${p("check",14)}</i></button>`).join("")}
      </div>
      <p class="fhelp">${s.team.length>2?"Marque todos que v\xE3o juntos.":"Marque os dois se forem juntos."}</p>
      ${s.team.filter(t=>t.id!==s.me).map(t=>`<label class="list__row notifyrow"><span><b>${p("bell",15)} Avisar ${t.name==="Matheus"||t.name==="Henrique"?"o ":""}${c(t.name)}</b><small data-notifyhelp>${he(a,t)}</small></span><input type="checkbox" class="switch" name="notifyPartner" ${a.notifyPartner!==!1?"checked":""}></label>`).join("")}
    </div>

    <div class="fgroup" data-when="location" ${K(a.type)?"":"hidden"}>
      <label class="flabel" for="f-loc">Local</label>
      <input id="f-loc" class="input" name="location" value="${c(a.location||"")}" placeholder="Endere\xE7o ou nome do lugar" autocomplete="off">
      <button type="button" class="btn-text btn-text--sm" data-useaddr hidden>${p("pin",14)} Usar o endere\xE7o cadastrado</button>
    </div>

    <div class="fgroup">
      <label class="flabel" for="f-desc">${c(k.form.desc[0])}${k.clientLike?` <em class="tag">${p("eye",12)} cliente v\xEA</em>`:""}</label>
      <textarea id="f-desc" class="input" name="description" rows="3" placeholder="${c(k.form.desc[1])}">${c(a.description||"")}</textarea>
    </div>
    <div class="fgroup">
      <label class="flabel" for="f-note">${c(k.form.note[0])} <em class="tag tag--note">${p("eyeoff",12)} ${st()}</em></label>
      <textarea id="f-note" class="input" name="internalNote" rows="2" placeholder="${c(k.form.note[1])}">${c(a.internalNote||"")}</textarea>
    </div>

    <div class="list">
      <label class="list__row"><span>${p("bell",18)} Lembrete</span>
        <select name="reminder">${ie.map(t=>`<option value="${t.v}"${(a.reminder??30)===t.v?" selected":""}>${t.label}</option>`).join("")}</select>
      </label>
      ${e?"":`<label class="list__row"><span>${p("repeat",18)} Repetir</span>
        <select name="repeat">${Q.map(t=>`<option value="${t.v}"${o.mode===t.v?" selected":""}>${t.label}</option>`).join("")}</select>
      </label>
      <label class="list__row" data-when="until" hidden><span>${p("calendar",18)} At\xE9</span>
        <input type="date" name="until" value="${o.until}">
      </label>`}
      <label class="list__row"${k.clientLike?"":" hidden"}><span>${p("eye",18)} Aparece no link do cliente</span>
        <input type="checkbox" class="switch" name="visibleToClient" ${a.visibleToClient!==!1?"checked":""}>
      </label>
      ${e?`<label class="list__row"><span>${p("check",18)} Status</span>
        <select name="status">${le.map(t=>`<option value="${t}"${a.status===t?" selected":""}>${ne[t].label}</option>`).join("")}</select>
      </label>`:""}
    </div>

    ${e?`<button type="button" class="btn btn--danger-soft btn--block" data-delete>${p("trash",18)} Excluir ${q()}</button>`:""}
    <div class="form__spacer"></div>
  </form>`}function pt(a,e,o,i){let t=a.el,n=t.querySelector("[data-editor]"),u=d=>t.querySelector(d),r=()=>{let d=u("[data-hint]");d.innerHTML=mt(e,!o),d.querySelectorAll("[data-settime]").forEach(m=>m.onclick=()=>{e.time=m.dataset.settime,n.time.value=e.time,r()}),d.querySelectorAll("[data-setwho]").forEach(m=>m.onclick=()=>{e.assignees=[m.dataset.setwho],t.querySelectorAll("[data-who]").forEach(g=>g.classList.toggle("is-on",e.assignees.includes(g.dataset.who))),r()})},l=()=>{t.querySelector('[data-when="duration"]').hidden=!ee(e.type);let d=t.querySelector('[data-when="net"]');d&&(d.hidden=$[e.type].kind!=="post"),t.querySelector('[data-when="location"]').hidden=!K(e.type);let m=s.company(e.companyId),g=u("[data-useaddr]");g.hidden=!(m&&m.address&&n.location.value!==m.address);let L=t.querySelector('[data-when="until"]');L&&(L.hidden=i.mode==="none")};t.querySelectorAll("[data-type]").forEach(d=>d.onclick=()=>{let m=e.type;if(e.type=d.dataset.type,t.querySelectorAll("[data-type]").forEach(g=>g.classList.toggle("is-on",g===d)),n.title.placeholder=$[e.type].placeholder,(!o||m!==e.type)&&(e.duration=ee(e.type)?$[e.type].dur:null,n.duration.value=String($[e.type].dur),o||(e.visibleToClient=$[e.type].client,n.visibleToClient.checked=e.visibleToClient)),K(e.type)&&!n.location.value){let g=s.company(e.companyId);g?.address&&(n.location.value=g.address,e.location=g.address)}l(),r()}),t.querySelectorAll("[data-company]").forEach(d=>d.onclick=()=>{e.companyId=d.dataset.company,t.querySelectorAll("[data-company]").forEach(g=>g.classList.toggle("is-on",g===d));let m=s.company(e.companyId);K(e.type)&&m?.address&&!n.location.value&&(n.location.value=m.address,e.location=m.address),l()}),u("[data-newco]").onclick=()=>{fe(null,d=>{e.companyId=d.id,h(),a.set(ot(e,!!o,i))})},t.querySelectorAll("[data-who]").forEach(d=>d.onclick=()=>{let m=d.dataset.who;e.assignees=e.assignees.includes(m)?e.assignees.filter(_=>_!==m):[...e.assignees,m],d.classList.toggle("is-on",e.assignees.includes(m)),r();let g=t.querySelector("[data-notifyhelp]"),L=s.team.find(_=>_.id!==s.me);g&&L&&(g.textContent=he(e,L))});let f=t.querySelector('input[name="notifyPartner"]');f&&(f.onchange=()=>{e.notifyPartner=f.checked;let d=t.querySelector("[data-notifyhelp]"),m=s.team.find(g=>g.id!==s.me);d&&m&&(d.textContent=he(e,m))}),u("[data-useaddr]").onclick=()=>{let d=s.company(e.companyId);n.location.value=d.address,e.location=d.address,l()},t.querySelectorAll("[data-net]").forEach(d=>d.onclick=()=>{e.platform=d.dataset.net,t.querySelectorAll("[data-net]").forEach(m=>m.classList.toggle("is-on",m===d))});let h=()=>{e.title=Qe(n.title.value.trim(),e.type),$[e.type].kind==="post"&&!e.platform&&(e.platform="instagram"),$[e.type].kind!=="post"&&(e.platform=null),e.date=n.date.value,e.time=n.time.value||"",e.duration=ee(e.type)?Number(n.duration.value):null,e.location=K(e.type)?n.location.value.trim():"",e.description=n.description.value.trim(),e.internalNote=n.internalNote.value.trim(),e.reminder=Number(n.reminder.value),e.visibleToClient=n.visibleToClient.checked,n.status&&(e.status=n.status.value),n.repeat&&(i.mode=n.repeat.value),n.until&&(i.until=n.until.value)};n.addEventListener("input",()=>{h(),l()}),n.addEventListener("change",()=>{h(),l(),r()});let v=u("[data-delete]");v&&(v.onclick=()=>at(e.id,null).then(()=>!s.event(e.id)&&a.close())),u("[data-save]").onclick=async()=>{if(h(),!b){if(!e.companyId&&x()){w("Escolha a empresa"),t.querySelector(".cogrid").scrollIntoView({behavior:"smooth",block:"center"});return}if(!e.date)return w("Escolha o dia");if(ae()&&s.me&&!e.assignees.length&&(e.assignees=[s.me]),!(!e.assignees.length&&!await M({title:"Ningu\xE9m respons\xE1vel?",text:`Este ${q()} ficar\xE1 sem respons\xE1vel. Deseja salvar assim mesmo?`,ok:"Salvar assim"}))&&!b){b=!0;try{await z()}finally{b=!1}}}};let b=!1,z=async()=>{if(o){if(["date","time","duration","type","assignees","companyId"].some(m=>JSON.stringify(e[m])!==JSON.stringify(o[m]))&&!await ge(e,!1,a,y))return;await $t(e,o)}else if(i.mode!=="none"){let d=ft(e.date,i),m=d.filter(_=>V({...e,date:_},{isNew:!0}).some(I=>I.level==="block")),g=d;if(m.length){let _=await B({title:`${m.length} de ${d.length} datas j\xE1 t\xEAm compromisso nesse hor\xE1rio`,text:m.slice(0,6).map(I=>R(I)).join(" \xB7 ")+(m.length>6?" \u2026":""),options:[{label:`Criar s\xF3 nas ${d.length-m.length} datas livres`,value:"free",primary:!0},{label:"Criar em todas mesmo assim",value:"all"}]});if(!_)return;if(_==="free"&&(g=d.filter(I=>!m.includes(I))),!g.length)return w("Nenhuma data livre")}let L=N("s_");await s.upsertMany("events",g.map((_,I)=>({...e,id:I===0?e.id:N("e_"),date:_,seriesId:L})),{activity:{notifyPartner:e.notifyPartner,kind:"series",count:g.length,label:`${$[e.type].label} ${Q.find(_=>_.v===i.mode)?.label.toLowerCase()||""} \xE0s ${P(e.time)}`,sample:{companyId:e.companyId,date:g[0]}}}),a.close(),de({title:`${g.length} ${q()}s marcados`,sub:`${Q.find(_=>_.v===i.mode)?.label||""}${e.time?" \xB7 "+P(e.time):""}`.replace(/^ · /,""),item:{title:`${g.length} ${q()}s`,date:g[0]}});return}else{if(!await ge(e,!0,a,y))return;await s.upsert("events",{...e}),a.close(),de({title:`${te()} marcado`,sub:`${R(e.date)}${e.time?" \xB7 "+P(e.time):""}`,item:{title:e.title||$[e.type]?.label,date:e.date}});return}a.close()};function y(){n.time.value=e.time||"",n.date.value=e.date,t.querySelectorAll("[data-who]").forEach(d=>d.classList.toggle("is-on",e.assignees.includes(d.dataset.who))),l(),r()}l(),r()}var $e=420,tt=1380,A=a=>(Math.min(Math.max(a,$e),tt)-$e)/(tt-$e)*100;function ut(a,e){let o=a.time?pe(a):null,i=[8,10,12,14,16,18,20,22];return`<div class="lanes">
    <div class="lanes__head"><strong>${s.team.length>1?`Agenda ${s.team.length===2?"dos dois":"de todos"}`:"Sua agenda"} em ${c(R(a.date))}</strong></div>
    ${s.team.map(t=>{let n=s.eventsOn(a.date,{person:t.id}).filter(l=>l.id!==a.id&&l.time),u=(a.assignees||[]).includes(t.id),r=e.some(l=>l.level==="block"&&l.person===t.id);return`<div class="lane">
        <span class="lane__who">${W(t.id,22)}</span>
        <div class="lane__track">
          ${i.map(l=>`<i class="lane__tick" style="left:${A(l*60)}%"></i>`).join("")}
          ${n.map(l=>{let f=pe(l),h=s.company(l.companyId);return`<span class="lane__ev" style="left:${A(f[0])}%;width:max(4px,${A(f[1])-A(f[0])}%);background:${h?.color||"#888"}" title="${c(Fe(l))}"></span>`}).join("")}
          ${o&&u?`<span class="lane__draft${r?" is-clash":""}" style="left:${A(o[0])}%;width:max(6px,${A(o[1])-A(o[0])}%)"></span>`:""}
        </div>
      </div>`}).join("")}
    <div class="lane lane--axis"><span class="lane__who"></span><div class="lane__track">${i.map(t=>`<small style="left:${A(t*60)}%">${t}h</small>`).join("")}</div></div>
  </div>`}function mt(a,e){if(!a.date)return"";let o=V(a,{isNew:e}),i=o.filter(b=>b.level==="block"),t=o.filter(b=>b.level==="warn"),n=o.filter(b=>b.level==="info"),u=Z(a,{limit:4}),r=ue(a),l=(a.assignees||[]).length===1?a.assignees[0]:null,f=i.length&&l?s.team.find(b=>b.id!==l&&r.includes(b.id)):null,h=$[a.type],v=b=>`<li class="issue issue--${b.level}">${p(b.level==="block"?"alert":b.level==="warn"?"flag":b.code==="partner"?"user":"bulb",15)}<div><strong>${c(b.title)}</strong><p>${c(b.text)}</p></div></li>`;return`
  <section class="assist">
    <header class="assist__head">${p("sparkle",16)} Assistente</header>
    ${ut(a,o)}
    ${o.length?`<ul class="issues">${[...i,...t,...n].map(v).join("")}</ul>`:a.time?`<p class="assist__ok">${p("check",15)} Hor\xE1rio livre para ${c(Y(a.assignees))}, sem conflitos.</p>`:""}
    ${f?`<button type="button" class="tchip tchip--wide" data-setwho="${f.id}">${W(f.id,18)} Passar para ${c(f.name)} (est\xE1 livre)</button>`:""}
    <div class="assist__sugg">
      <p>${c(h.tip)}</p>
      ${u.length?`<div class="hintbox__times">${u.map(b=>`<button type="button" class="tchip${a.time===b.time?" is-on":""}" data-settime="${b.time}">${P(b.time)}${b.peak?"<small>pico</small>":"<small>livre</small>"}</button>`).join("")}</div>`:`<p class="muted">Nenhum hor\xE1rio livre nesse dia${(a.assignees||[]).length?" para "+c(Y(a.assignees)):""}. Tente outro dia${s.team.length>1?" ou outra pessoa":""}.</p>`}
    </div>
  </section>`}async function ge(a,e,o,i){let n=V(a,{isNew:e}).filter(v=>v.level==="block");if(!n.length)return!0;let u=Z(a,{limit:2}),r=(a.assignees||[]).length===1?a.assignees[0]:null,l=r&&s.team.find(v=>v.id!==r&&ue(a).includes(v.id)),f=[...u.map(v=>({label:`Mudar para ${P(v.time)} (livre)`,value:"time:"+v.time,primary:!0})),...l?[{label:`Passar para ${l.name} (est\xE1 livre)`,value:"who:"+l.id,primary:!u.length}]:[],{label:"Marcar mesmo assim",value:"force"}],h=await B({title:n[0].code==="duplicate"?"Isso j\xE1 est\xE1 na agenda":"J\xE1 tem compromisso nesse hor\xE1rio",bodyHtml:`<ul class="issues issues--dialog">${n.map(v=>`<li class="issue issue--block">${p("alert",15)}<div><strong>${c(v.title)}</strong><p>${c(v.text)}</p></div></li>`).join("")}</ul>`,options:f});return h?h==="force"?!0:(h.startsWith("time:")&&(a.time=h.slice(5)),h.startsWith("who:")&&(a.assignees=[h.slice(4)]),i(),ge(a,e,o,i)):!1}async function bt(a,e){let o={...a,...e},i=V(o).filter(n=>n.level==="block");return i.length?await B({title:"J\xE1 tem compromisso nesse hor\xE1rio",bodyHtml:`<ul class="issues issues--dialog">${i.map(n=>`<li class="issue issue--block">${p("alert",15)}<div><strong>${c(n.title)}</strong><p>${c(n.text)}</p></div></li>`).join("")}</ul>`,options:[{label:"Mover mesmo assim",value:"force",primary:!0}]})==="force":!0}function ft(a,e){let o=[],i=a,t=e.until&&e.until>=a?e.until:E(a,28);for(;i<=t&&o.length<150;){let n=G(i).getDay();(e.mode==="daily"||e.mode==="weekdays"&&n>=1&&n<=5||e.mode==="weekly"&&G(i).getDay()===G(a).getDay())&&o.push(i),i=E(i,1)}return o}var vt=["type","companyId","title","time","duration","assignees","location","description","internalNote","reminder","visibleToClient"];async function $t(a,e){let o=vt.filter(i=>JSON.stringify(a[i])!==JSON.stringify(e[i]));if(a.seriesId&&o.length){let i=s.state.events.filter(t=>t.seriesId===a.seriesId&&t.date>e.date);if(i.length){let t=await B({title:`${te()} repetido`,text:"Aplicar as altera\xE7\xF5es a quais eventos?",options:[{label:"S\xF3 a este",value:"one",primary:!0},{label:`A este e aos pr\xF3ximos (${i.length+1})`,value:"next"}]});if(!t)return;if(t==="next"){let n=Object.fromEntries(o.map(u=>[u,a[u]]));await s.upsertMany("events",[{...a},...i.map(u=>({...u,...n}))],{activity:{kind:"series-edit",count:i.length+1,label:`${$[a.type].label} \xB7 a partir de ${a.date.slice(8)}/${a.date.slice(5,7)}`,sample:{companyId:a.companyId,date:a.date}}}),w("S\xE9rie atualizada");return}}}await s.upsert("events",{...a}),w("Altera\xE7\xF5es salvas")}export{Qe as a,Lt as b,It as c,fe as d,Yt as e,et as f,bt as g};
