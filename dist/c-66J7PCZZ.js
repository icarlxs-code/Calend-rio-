import{o as l,q as c}from"./c-FP2WTFCC.js";import{b as t}from"./c-DWBEWQEH.js";import{f as s,j as u}from"./c-LYRHY74K.js";var d="lembra.iaConsent";function p(){let a=s.profile&&s.profile.iaConsent;if(a===!0||a===!1)return a;try{let e=localStorage.getItem(d);return e==="1"?!0:e==="0"?!1:null}catch{return null}}var A=()=>p()===!0;async function m(a){try{localStorage.setItem(d,a?"1":"0")}catch{}try{s.mode==="cloud"&&s.user&&await u({iaConsent:!!a,iaConsentAt:Date.now()})}catch{}}function C({motivo:a="usar o assistente"}={}){let e=p();return e!==null?Promise.resolve(e):new Promise(r=>{let n=!1,i=o=>{n||(n=!0,m(o),f.close(),r(o))},f=l({className:"sheet--dialog",onClose:()=>{n||(n=!0,r(!1))},html:`${c("Intelig\xEAncia artificial",{left:'<button class="btn-text" data-close>Fechar</button>'})}
      <div class="page page--sheet iacons">
        <p>Para ${a}, o Lembra usa intelig\xEAncia artificial. Antes, voc\xEA precisa saber:</p>
        <ul class="iacons__l">
          <li>${t("upload",16)}<span><b>O que \xE9 enviado:</b> a sua pergunta e s\xF3 o necess\xE1rio da agenda (t\xEDtulos, datas e hor\xE1rios dos compromissos, nomes dos grupos e a sua profiss\xE3o). Nunca senha, CPF ou fotos.</span></li>
          <li>${t("cloud",16)}<span><b>Para quem:</b> Cloudflare Workers AI (modelo Llama, da Meta), pelo nosso servidor. Quando dispon\xEDvel, tamb\xE9m a Anthropic (modelo Claude).</span></li>
          <li>${t("lock",16)}<span><b>Como:</b> a chave da IA fica no nosso servidor, a conversa vai criptografada e n\xE3o \xE9 usada para treinar modelos.</span></li>
          <li>${t("alert",16)}<span>A IA pode errar: confira antes de confirmar. Ela n\xE3o substitui orienta\xE7\xE3o m\xE9dica, jur\xEDdica ou financeira.</span></li>
        </ul>
        <button class="btn btn--primary btn--block" data-sim>Aceitar e continuar</button>
        <button class="btn btn--soft btn--block" data-nao>Agora n\xE3o</button>
        <p class="fhelp">Voc\xEA pode mudar isso quando quiser em Ajustes \u2192 Intelig\xEAncia artificial.</p>
      </div>`,onMount:o=>{o.el.querySelector("[data-sim]").onclick=()=>i(!0),o.el.querySelector("[data-nao]").onclick=()=>i(!1)}})})}export{p as a,A as b,m as c,C as d};
