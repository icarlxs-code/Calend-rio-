import{a as d}from"./c-6PVVLET6.js";import{c as m}from"./c-5KDN44MS.js";import{B as i}from"./c-MPTN5RTT.js";var c=null;function p({title:s="Marcado!",sub:o="",sound:u=!0,item:a=null}={}){if(typeof document>"u")return;document.querySelectorAll(".okfx").forEach(t=>t.remove()),clearTimeout(c);let r=window.__motion;if(a&&r&&r.pronto()){let t=document.createElement("div");t.className="okfx okfx--motion",t.setAttribute("role","status"),t.textContent=`${s} ${o}`,document.body.appendChild(t);let l=()=>t.remove();setTimeout(()=>{r.agendado({titulo:a.title||s,quando:o,dia:a.date,frase:m(a.title||"","c")}).catch(()=>{}).then(l)},240),c=setTimeout(l,6500);return}let e=document.createElement("div");e.className="okfx",e.setAttribute("role","status"),e.innerHTML=`<div class="okfx__card">
      <svg class="okfx__ring" viewBox="0 0 120 120" aria-hidden="true">
        <circle class="okfx__halo" cx="60" cy="60" r="50"/>
        <circle class="okfx__track" cx="60" cy="60" r="46"/>
        <circle class="okfx__prog" cx="60" cy="60" r="46"/>
        <path class="okfx__check" d="M40 61.5 54 75 81 46"/>
      </svg>
      <b class="okfx__t">${i(s)}</b>${o?`<small class="okfx__s">${i(o)}</small>`:""}
      <span class="okfx__brand">${d("simbolo",{h:18})}</span>
    </div>`,document.body.appendChild(e),requestAnimationFrame(()=>requestAnimationFrame(()=>e.classList.add("is-in"))),u&&import("./c-NFC3SKGJ.js").then(t=>t.softOk()).catch(()=>{});try{navigator.vibrate&&navigator.vibrate(12)}catch{}let n=()=>{e.classList.add("is-out"),setTimeout(()=>e.remove(),420)};c=setTimeout(n,1500),e.addEventListener("click",()=>{clearTimeout(c),n()})}export{p as a};
