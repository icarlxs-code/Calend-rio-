import{a as i}from"./c-6PVVLET6.js";import{B as r,d as a,g as p}from"./c-ZUAJ4OTH.js";var c=null;function x({title:m="Marcado!",sub:l="",sound:u=!0}={}){if(typeof document>"u")return;document.querySelectorAll(".okfx").forEach(s=>s.remove()),clearTimeout(c);let e=document.createElement("div");e.className="okfx",e.setAttribute("role","status"),e.innerHTML=`<div class="okfx__card">
      <svg class="okfx__ring" viewBox="0 0 120 120" aria-hidden="true">
        <circle class="okfx__halo" cx="60" cy="60" r="50"/>
        <circle class="okfx__track" cx="60" cy="60" r="46"/>
        <circle class="okfx__prog" cx="60" cy="60" r="46"/>
        <path class="okfx__check" d="M40 61.5 54 75 81 46"/>
      </svg>
      <b class="okfx__t">${r(m)}</b>${l?`<small class="okfx__s">${r(l)}</small>`:""}
      <span class="okfx__brand">${i("simbolo",{h:18})}</span>
    </div>`,document.body.appendChild(e),requestAnimationFrame(()=>requestAnimationFrame(()=>e.classList.add("is-in"))),u&&import("./c-MHZGZLXA.js").then(s=>s.softOk()).catch(()=>{});try{navigator.vibrate&&navigator.vibrate(12)}catch{}let n=()=>{e.classList.add("is-out"),setTimeout(()=>e.remove(),420)};c=setTimeout(n,1500),e.addEventListener("click",()=>{clearTimeout(c),n()})}var t=(()=>{try{return JSON.parse(localStorage.getItem("pauta.ui")||"{}")}catch{return{}}})(),o={tab:t.tab==="pessoal"?"hoje":t.tab||"hoje",space:t.space==="personal"?"personal":"work",ptab:t.ptab||"p-hoje",pMonth:null,pSel:null,pView:"mes",person:t.person||"all",date:a(),month:p(a()),monthSel:a(),monthCompany:null,showAllTips:!1};function v(){try{localStorage.setItem("pauta.ui",JSON.stringify({tab:o.tab,person:o.person,space:o.space,ptab:o.ptab}))}catch{}}export{x as a,o as b,v as c};
