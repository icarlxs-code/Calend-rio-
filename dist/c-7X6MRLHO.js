import{g as I,i as q}from"./c-MPQC26Q2.js";import{c as S,d as $,e as A,p as E}from"./c-OS5IACYG.js";import{b as u}from"./c-6LZWOCXP.js";import{g as i}from"./c-XWG5M3AQ.js";import{B as m}from"./c-MPTN5RTT.js";var w="lembra.vip.seen",_=()=>i.billing&&i.billing.plan==="lifetime"&&i.billing.vip||null,O=()=>{let e=_();if(!e)return!1;if(Number(i.profile?.vipSeen)===e.no)return!0;try{return localStorage.getItem(w)===String(e.no)}catch{return!1}},R=()=>{let e=_();if(e){try{localStorage.setItem(w,String(e.no))}catch{}import("./c-E5PYTQVP.js").then(t=>t.saveProfileQuiet&&t.saveProfileQuiet({vipSeen:e.no})).catch(()=>{})}},P=e=>`N\xBA ${String(e||0).padStart(3,"0")}`,T=()=>$()==="granted"&&E(),M=()=>String(i.profile?.name||i.member(i.me)?.name||"").trim().slice(0,40),d=()=>String(i.profile?.nickname||i.member(i.me)?.name||M()).trim().split(/\s+/)[0]||"",k=()=>!!document.querySelector(".sheet-wrap.is-open, .paywall.is-open, .photogate, .avgate, .ficha, .ob, .guide, .termsgate, .gx, .vip");function Y({force:e=!1}={}){if(!_()||!e&&O())return;let t=0,r=()=>{if(k()){++t<40&&setTimeout(r,1500);return}B()};setTimeout(r,e?300:900)}function z(){return _()&&i.mode==="cloud"&&S()&&!T()?`<button class="trialbar vipbar" data-action="notify-enable">
      <span class="trialbar__ic">${u("bell",16)}</span>
      <span><b>Seus avisos est\xE3o desligados</b><small>Sem eles, o Lembra n\xE3o consegue te lembrar na hora certa</small></span>
      <span class="trialbar__go">Ativar</span>
    </button>`:""}function C(e){return`<div class="vcard" data-vcard>
    <div class="vcard__in">
      <span class="vcard__word" aria-label="Lembra"></span><span class="vcard__tier">VITAL\xCDCIO</span>
      <span class="vcard__sym" aria-hidden="true"></span>
      <div class="vcard__nm">${m(M()||"Membro")}</div>
      <div class="vcard__no">MEMBRO ${P(e.no)}</div><div class="vcard__ed">DESDE ${new Date(e.at||Date.now()).getFullYear()}</div>
      <i class="vcard__sheen"></i>
    </div>
  </div>`}function V(e){let t=e.querySelector("[data-vcard]");if(!t)return;let r=(l,o)=>{t.style.setProperty("--rx",`${(10-o*22).toFixed(1)}deg`),t.style.setProperty("--ry",`${(-14+l*28).toFixed(1)}deg`)};t.addEventListener("pointermove",l=>{let o=t.getBoundingClientRect();r((l.clientX-o.left)/o.width,(l.clientY-o.top)/o.height)}),t.addEventListener("pointerleave",()=>{t.style.removeProperty("--rx"),t.style.removeProperty("--ry")})}async function B({cardOnly:e=!1}={}){let t=_();if(!t||document.querySelector(".vip"))return;let{badgeById:r,badgeArt:l}=await import("./c-BBVO3FY2.js");if(document.querySelector(".vip"))return;let o=Math.max(t.total||t.no||1,t.no||1),f=!e&&i.mode==="cloud"&&S()&&!T(),L=$()==="denied",x=r("vitalicio"),N=Array.from({length:28},(a,n)=>{let c=(Math.sin(n*12.99)*43758.5%1+1)%1,y=(Math.sin(n*78.23)*12345.6%1+1)%1;return`<i style="left:${(c*100).toFixed(1)}%;top:${(4+y*60).toFixed(1)}%;--d:${n%7*.6}s;--s:${1+n%3}px"></i>`}).join(""),s=document.createElement("div");s.className="vip",s.setAttribute("role","dialog"),s.setAttribute("aria-modal","true"),s.setAttribute("aria-label","Lembra Vital\xEDcio"),s.innerHTML=`<div class="vip__glow"></div><div class="vip__dust">${N}</div>
    ${e?'<button class="vip__x" data-vclose aria-label="Fechar">'+u("x",20)+"</button>":`
    <section class="vip__s vip__intro" data-step="intro">
      <span class="vip__halo"></span><span class="vip__sym" aria-hidden="true"></span>
      ${d()?`<div class="vip__nm">${m(d().toUpperCase())}</div>`:""}
      <div class="vip__ln">Isto n\xE3o acontece<br>com quase ningu\xE9m.</div>
      <div class="vip__tap">TOQUE PARA CONTINUAR</div>
    </section>`}
    <section class="vip__s vip__rv" data-step="card">
      <div class="vip__kick">LEMBRA VITAL\xCDCIO</div>
      <h1 class="vip__h1">${d()?`<b>${m(d())}.</b> `:""}Para sempre.</h1>
      ${C(t)}
      <div class="vip__rare">${o>1?`<div class="vip__n">1 em ${o}</div><div class="vip__t">pessoas no mundo com o Lembra para sempre</div>`:'<div class="vip__n">A primeira</div><div class="vip__t">pessoa no mundo com o Lembra para sempre</div>'}</div>
      <p class="vip__p">Sem mensalidade. Sem prazo. Sem fim.<br>Tudo liberado, hoje e sempre.</p>
      ${e?"":'<button class="vip__btn" data-next>Continuar</button>'}
    </section>
    ${e?"":`<section class="vip__s vip__md" data-step="medal">
      <div class="vip__kick">NOVO EMBLEMA</div>
      <div class="vip__medal">${x?l(x,220):""}</div>
      <h2 class="vip__h2">Vital\xEDcio</h2>
      <div class="vip__rar">LEND\xC1RIO \xB7 O MAIS RARO DO LEMBRA</div>
      <ul class="vip__list">
        <li><span>${u("infinity",18)}</span><div><b>Tudo do Profissional</b><small>Para sempre, sem pagar nada</small></div></li>
        <li><span>${u("user",18)}</span><div><b>Anel Vital\xEDcio na sua foto</b><small>Quem divide a agenda com voc\xEA v\xEA</small></div></li>
        <li><span>#</span><div><b>Membro ${P(t.no)}</b><small>Seu n\xFAmero nunca vai se repetir</small></div></li>
      </ul>
      <p class="vip__terms">Presente de cortesia do Lembra, nas regras dos <a href="termos/" target="_blank" rel="noopener">Termos de Uso</a>.</p>
      <button class="vip__btn" data-next>${f?"Continuar":"Entrar no Lembra"}</button>
    </section>`}
    ${f?`<section class="vip__s vip__nf" data-step="notif">
      <div class="vip__sheet">
        <div class="vip__bell"><span class="vip__sym vip__sym--sm" aria-hidden="true"></span></div>
        <h3>Um \xFAltimo detalhe${d()?`, ${m(d())}`:""}.</h3>
        <p>${L?"Os avisos est\xE3o bloqueados neste celular. Para o Lembra te lembrar na hora certa, ative em <b>Ajustes do iPhone \u2192 Notifica\xE7\xF5es \u2192 Lembra</b> (no Android: segure o \xEDcone \u2192 Informa\xE7\xF5es do app \u2192 Notifica\xE7\xF5es).":A()?"Para receber os avisos, instale o Lembra na Tela de In\xEDcio: no Safari, toque em <b>Compartilhar</b> \u2192 <b>Adicionar \xE0 Tela de In\xEDcio</b>.":"Ative os avisos para o Lembra cuidar dos seus compromissos na hora certa. Voc\xEA escolhe o que recebe nos Ajustes."}</p>
        ${L||A()?'<button class="vip__btn" data-vclose>Entendi</button>':'<button class="vip__btn" data-enable>Ativar avisos</button><button class="vip__later" data-vclose>Agora n\xE3o</button>'}
      </div>
    </section>`:""}`,document.body.appendChild(s),f&&(window.__vipAskedNotif=!0),document.documentElement.classList.add("has-vip");let p=[...s.querySelectorAll("[data-step]")],v=-1,h=()=>{s.classList.add("is-out"),document.documentElement.classList.remove("has-vip"),setTimeout(()=>s.remove(),450),i.emit&&i.emit()},b=a=>{if(a>=p.length)return h();p.forEach((c,y)=>c.classList.toggle("is-on",y===a)),v=a;let n=p[a].dataset.step;if(n==="intro"){try{I()}catch{}setTimeout(()=>v===a&&b(a+1),6500)}if(n==="card"){try{q()}catch{}e||(R(),import("./c-S2AUIQ46.js").then(c=>c.quietSettle&&c.quietSettle()).catch(()=>{}))}};p.forEach(a=>{a.dataset.step==="intro"&&a.addEventListener("click",()=>v===p.indexOf(a)&&b(v+1))}),s.querySelectorAll("[data-next]").forEach(a=>a.onclick=()=>b(v+1)),s.querySelectorAll("[data-vclose]").forEach(a=>a.onclick=h);let g=s.querySelector("[data-enable]");return g&&(g.onclick=async()=>{g.disabled=!0;let{settingsActions:a}=await import("./c-K6K5SB2O.js");await a.notifyEnable(),h()}),V(s),requestAnimationFrame(()=>{s.classList.add("is-in"),b(0)}),s}export{_ as a,O as b,P as c,T as d,Y as e,z as f,B as g};
