import{a as l}from"./c-X3PB6JZ2.js";import{B as o,C as T,D as k,E as q,b as j,d as h,e as g,g as A,h as C,j as E,k as N,m as x,p as P,t as w,v as L}from"./c-YEARXB46.js";import{a as S}from"./c-BYHTQNTY.js";import{g as D,k as K,s as R,t as H,w as O}from"./c-S6VVKE3W.js";var n={data:null,tab:"proximos",month:A(h()),sel:h()};function st(t,a,{canGoBack:s=!1,preview:r=!1}={}){if(n.data=a,n.tab="proximos",!r){document.title=`${a.company.name} \xB7 Cronograma`;let c=document.querySelector('meta[name="theme-color"]');c&&c.setAttribute("content",a.company.color),document.body.classList.add("is-client")}let m=()=>{t.innerHTML=Y(s),t.querySelectorAll("[data-c]").forEach(c=>c.onclick=()=>{let i=c.dataset.c;if(i==="tab"&&(n.tab=c.dataset.v),i==="month"&&(n.month=C(n.month,Number(c.dataset.v))),i==="sel"&&(n.sel=c.dataset.v),i==="back"){location.hash="",location.reload();return}m()})};m()}function ot(t,a){document.body.classList.add("is-client"),t.innerHTML=`<div class="client-error">${l("link",36)}<h2>Link indispon\xEDvel</h2><p>${o(a)}</p></div>`}function W(t,a){return t.logo?`<span class="logo logo--img" style="--s:${a}px;--r:${Math.round(a*.28)}px"><img src="${o(t.logo)}" alt=""></span>`:`<span class="logo" style="--s:${a}px;--r:${Math.round(a*.28)}px;background:#fff;color:${t.color}">${o(T(t.name))}</span>`}function G(t){let a=D[t.type]||D.outro,s=O(t),r=!R(t.type)&&t.time;return`<article class="ccard ccard--${t.status}">
    <div class="ccard__time"><strong>${t.time?x(t.time):"\u2014"}</strong>${r?`<small>${x(N(E(t.time)+H(t)))}</small>`:""}</div>
    <div class="ccard__body">
      <div class="ccard__top"><span class="tbadge tbadge--${t.type}"${K(t.type)}>${l(a.icon,13)}${a.label}</span><span class="cstatus cstatus--${t.status}">${t.status==="feito"?l("check",12):""}${s}</span></div>
      <h4>${o(t.title||a.label)}</h4>
      ${t.description?`<p>${o(t.description)}</p>`:""}
      ${t.location?`<p class="ccard__loc">${l("pin",13)} ${o(t.location)}</p>`:""}
    </div>
  </article>`}function F(t){let a="";return t.map(s=>{let r=s.date!==a?`<h3 class="dayhead${s.date===h()?" is-today":""}">${o(L(s.date))}</h3>`:"";return a=s.date,r+G(s)}).join("")}function Y(t){let{company:a,events:s,updatedAt:r}=n.data,m=h(),c=a.color||"#333",i=n.month,v=s.filter(d=>d.date.slice(0,7)===i),b=d=>v.filter($=>d.includes($.type)).length,B=v.filter(d=>d.status==="feito").length,y;if(n.tab==="proximos"){let d=s.filter(p=>p.date>=m),$=s.filter(p=>p.date<m&&p.date>=g(m,-14)).reverse();y=`
      ${d.length?F(d):`<div class="empty">${l("calendar",28)}<h3>Nada programado ainda</h3><p>Assim que o cronograma for montado, ele aparece aqui.</p></div>`}
      ${$.length?`<h2 class="csection">\xDAltimos 14 dias</h2>${F($)}`:""}`}else{let[d,$]=i.split("-").map(Number),p=new Date(d,$-1,1),I=g(j(p),-p.getDay()),_=Array.from({length:42},(e,f)=>g(I,f)),V=_.slice(35).some(e=>e.slice(0,7)===i)?_:_.slice(0,35),M=s.filter(e=>e.date===n.sel);y=`
      <div class="cmonth__nav">
        <button class="iconbtn" data-c="month" data-v="-1" aria-label="M\xEAs anterior">${l("left",20)}</button>
        <strong>${o(w(i))}</strong>
        <button class="iconbtn" data-c="month" data-v="1" aria-label="Pr\xF3ximo m\xEAs">${l("right",20)}</button>
      </div>
      <div class="month month--client">
        <div class="month__wd">${P.map(e=>`<span>${e}</span>`).join("")}</div>
        <div class="month__grid">
          ${V.map(e=>{let f=s.filter(u=>u.date===e);return`<button class="mday${e.slice(0,7)===i?"":" is-out"}${e===m?" is-today":""}${e===n.sel?" is-sel":""}" data-c="sel" data-v="${e}">
              <span class="mday__n">${Number(e.slice(8))}</span>
              ${f.length?`<span class="mday__types">${[...new Set(f.map(u=>u.type))].slice(0,3).map(u=>`<i class="tdot tdot--${u}"></i>`).join("")}</span>`:""}
            </button>`}).join("")}
        </div>
      </div>
      <h2 class="csection">${o(L(n.sel))}</h2>
      ${M.length?M.map(G).join(""):'<p class="muted center">Nada programado neste dia.</p>'}`}return`
  <div class="client" style="--cc:${c};--cc-on:${q(c)};--cc-soft:${k(c,.1)}">
    <header class="client__hero">
      ${t?`<button class="client__back" data-c="back">${l("left",18)} Voltar ao app</button>`:""}
      ${W(a,76)}
      <h1>${o(a.name)}</h1>
      <p>Cronograma de conte\xFAdo${a.instagram?` \xB7 @${o(a.instagram)}`:""}</p>
    </header>
    <div class="client__body">
      <div class="cstats">
        <div><b>${b(["feed","carrossel"])}</b><span>Feed</span></div>
        <div><b>${b(["reels"])}</b><span>Reels</span></div>
        <div><b>${b(["story"])}</b><span>Stories</span></div>
        <div><b>${b(["captacao"])}</b><span>Capta\xE7\xF5es</span></div>
      </div>
      <p class="cstats__cap">${o(w(i))} \xB7 ${B} de ${v.length} j\xE1 publicados/realizados</p>

      <div class="seg seg--client">
        <button class="seg__btn${n.tab==="proximos"?" is-on":""}" data-c="tab" data-v="proximos">${l("clock",15)} Pr\xF3ximos</button>
        <button class="seg__btn${n.tab==="mes"?" is-on":""}" data-c="tab" data-v="mes">${l("calendar",15)} Calend\xE1rio</button>
      </div>

      ${y}

      <div class="clegend">
        <span><i class="cstatus cstatus--pendente"></i>Planejado</span>
        <span><i class="cstatus cstatus--pronto"></i>Agendado / confirmado</span>
        <span><i class="cstatus cstatus--feito"></i>Publicado / realizado</span>
      </div>
      <footer class="client__foot">
        Atualizado em ${new Date(r||Date.now()).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}<br>
        Gest\xE3o de conte\xFAdo: <b>${o(S.agencyName)}</b>
      </footer>
    </div>
  </div>`}export{st as a,ot as b};
