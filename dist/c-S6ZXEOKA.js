import{a as le,g as ye}from"./c-M3Z7MKXV.js";import{a as He,b as Je,c as Ve,d as Q,f as re,g as q,h as ze,i as Ge,j as ge,k as $e,l as R,n as B,o as S,p as U,q as V}from"./c-OUERQELD.js";import{a as ue,b as Pe,d as Re,e as Be,f as r}from"./c-GKMRURXI.js";import{a as f}from"./c-DA3WSDQL.js";import{B as u,D as Y,G as je,c as M,d as x,e as I,f as Ae,g as oe,i as De,j as g,k as G,l as ne,m as _,n as qe,r as Le,t as Me,u as K,v as W,w as j,z as P}from"./c-YEARXB46.js";import{a as y,b as Ue,c as E,d as C,e as fe,f as ve,h as ie,i as Fe,j as be,k as he}from"./c-3GA6RSWB.js";import{a as se}from"./c-LUBY74EX.js";var X=(()=>{try{return JSON.parse(localStorage.getItem("pauta.ui")||"{}")}catch{return{}}})(),N={tab:X.tab==="pessoal"?"hoje":X.tab||"hoje",space:X.space==="personal"?"personal":"work",ptab:X.ptab||"p-hoje",pMonth:null,pSel:null,pView:"mes",person:X.person||"all",date:x(),month:oe(x()),monthSel:x(),monthCompany:null,showAllTips:!1};function Ct(){try{localStorage.setItem("pauta.ui",JSON.stringify({tab:N.tab,person:N.person,space:N.space,ptab:N.ptab}))}catch{}}var dt={workStart:"08:00",workEnd:"19:00",lunchStart:"12:00",lunchEnd:"13:00",daysOff:[0],travelMin:45,maxTasks:8},ke=()=>({...dt,...r.state.settings.find(e=>e.id==="routine")||{}}),A=e=>{let t=g(e.time);return t==null?null:[t,t+C(e)]},J=(e,t)=>e&&t&&e[0]<t[1]&&t[0]<e[1],z=e=>["shoot","meeting"].includes(y[e.type]?.kind),Ke=e=>!E(e.type),ce=e=>r.company(e.companyId)?.name||"",H=e=>`${y[e.type]?.label||"Evento"}${ce(e)?" \xB7 "+ce(e):""}`,F=e=>r.member(e)?.name||"\u2014",we=e=>E(e.type)&&!e.duration?`\xE0s ${_(e.time)}`:`das ${_(e.time)} \xE0s ${_(G(A(e)[1]))}`,We=(e,t)=>(e.location||e.companyId)===(t.location||t.companyId),Z=(e,t,s)=>r.state.events.filter(o=>o.date===t&&o.id!==s&&o.time&&o.status!=="feito"&&(o.assignees||[]).includes(e));function ee(e,{isNew:t=!1}={}){let s=[];if(!e.date)return s;let o=ke(),a=e.time?[g(e.time),g(e.time)+C(e)]:null,n=e.assignees||[];if(a){n.forEach(i=>{Z(i,e.date,e.id).forEach(d=>{if(!J(a,A(d)))return;let b=E(e.type)!==E(d.type)&&(E(e.type)||E(d.type));s.push({level:"block",code:"overlap",person:i,eventIds:[d.id],title:`${F(i)} j\xE1 tem compromisso nesse hor\xE1rio`,text:`${H(d)} ${we(d)}${d.createdBy?` (marcado por ${d.createdBy===r.me?"voc\xEA":F(d.createdBy)})`:""}.`+(b?" Se for manter, deixe o post programado antes.":"")})})}),r.state.events.filter(i=>i.id!==e.id&&i.date===e.date&&i.companyId===e.companyId&&i.type===e.type&&i.time&&Math.abs(g(i.time)-a[0])<=30).forEach(i=>{s.some(d=>d.eventIds?.includes(i.id))||s.push({level:"block",code:"duplicate",eventIds:[i.id],title:"Parece que isso j\xE1 foi marcado",text:`J\xE1 existe ${H(i)} ${we(i)}, com ${(i.assignees||[]).map(F).join(" e ")||"ningu\xE9m"}${i.createdBy?`, marcado por ${i.createdBy===r.me?"voc\xEA":F(i.createdBy)}`:""}.`})}),z(e)&&n.forEach(i=>{Z(i,e.date,e.id).filter(z).forEach(d=>{let b=A(d),h=a[0]>=b[1]?a[0]-b[1]:b[0]>=a[1]?b[0]-a[1]:-1;h>=0&&h<o.travelMin&&!We(e,d)&&s.push({level:"warn",code:"travel",person:i,eventIds:[d.id],title:`Pouco tempo de deslocamento para ${F(i)}`,text:`S\xF3 ${h} min entre isto e ${H(d)} (${_(d.time)}). O combinado \xE9 ${o.travelMin} min.`})})});let m=g(o.workStart),l=g(o.workEnd);Ke(e)&&(a[0]<m||a[1]>l)?s.push({level:"warn",code:"hours",title:"Fora do expediente",text:`O hor\xE1rio de trabalho de voc\xEAs \xE9 das ${_(o.workStart)} \xE0s ${_(o.workEnd)}. Preservar o tempo livre evita esgotamento.`}):E(e.type)&&(a[0]<m||a[0]>=l)&&s.push({level:"info",code:"hours",title:"Post fora do expediente",text:"Deixe programado no Meta Business Suite para ningu\xE9m precisar parar o descanso para postar."}),Ke(e)&&J(a,[g(o.lunchStart),g(o.lunchEnd)])&&s.push({level:"warn",code:"lunch",title:"Invade o almo\xE7o",text:`O almo\xE7o de voc\xEAs \xE9 das ${_(o.lunchStart)} \xE0s ${_(o.lunchEnd)}.`}),a[1]>1440&&s.push({level:"warn",code:"midnight",title:"Passa da meia-noite",text:"Confira a dura\xE7\xE3o."}),t&&(e.date<x()||e.date===x()&&a[0]<ne()-5)&&s.push({level:"warn",code:"past",title:"Esse hor\xE1rio j\xE1 passou",text:"Confira o dia e a hora."}),["feed","reels","carrossel"].includes(e.type)&&r.state.events.filter(i=>i.id!==e.id&&i.date===e.date&&i.companyId===e.companyId&&["feed","reels","carrossel"].includes(i.type)&&i.time).forEach(i=>{let d=Math.abs(g(i.time)-a[0]);d>30&&d<180&&s.push({level:"warn",code:"spacing",eventIds:[i.id],title:"Posts da mesma empresa muito pr\xF3ximos",text:`${H(i)} \xE0s ${_(i.time)}. Espacem pelo menos 3 h.`})}),r.team.filter(i=>!n.includes(i.id)).forEach(i=>{Z(i.id,e.date,e.id).filter(d=>J(a,A(d))).forEach(d=>{s.push({level:"info",code:"partner",person:i.id,eventIds:[d.id],title:`${i.name} nesse hor\xE1rio`,text:`${H(d)} ${we(d)}${d.location?" \xB7 "+d.location:""}.`})})})}let c=M(e.date).getDay();return o.daysOff.includes(c)&&!E(e.type)&&s.push({level:"warn",code:"dayoff",title:`${qe[c]} \xE9 dia de folga`,text:"Se der, mude para um dia \xFAtil. Posts podem ficar programados."}),n.forEach(m=>{let l=r.state.events.filter(i=>i.date===e.date&&i.id!==e.id&&(i.assignees||[]).includes(m)).length+1;l>o.maxTasks&&s.push({level:"warn",code:"load",person:m,title:`${F(m)} ficaria sobrecarregado`,text:`${l} tarefas nesse dia (limite combinado: ${o.maxTasks}).`})}),s}function pe(e,{limit:t=3,people:s=null}={}){if(!e.date)return[];let o=ke(),a=s||(e.assignees?.length?e.assignees:[]),n=C(e),c=E(e.type),m=c?420:g(o.workStart),l=c?1320:g(o.workEnd),i=[g(o.lunchStart),g(o.lunchEnd)],d=(y[e.type]?.best||[]).map(g),b=e.date===x()?Math.ceil((ne()+15)/15)*15:0,h=r.state.events.filter(p=>p.id!==e.id&&p.date===e.date&&p.companyId&&p.companyId===e.companyId&&p.time&&(p.type===e.type||c&&E(p.type)&&p.type!=="story"&&e.type!=="story")).map(p=>({t:g(p.time),gap:p.type===e.type&&e.type==="story"?45:p.type===e.type?180:120})),O=[];for(let p=Math.max(m,b);p+n<=l;p+=15){let v=[p,p+n];if(!c&&J(v,i)||h.some(k=>Math.abs(k.t-p)<k.gap)||a.some(k=>Z(k,e.date,e.id).some(T=>{let Ce=A(T);return J(v,Ce)?!0:z(e)&&z(T)&&!We(e,T)?J([v[0]-o.travelMin,v[1]+o.travelMin],Ce):!1})))continue;let D=d.length?Math.min(...d.map(k=>Math.abs(k-p))):Math.abs(p-g(o.workStart)-60);O.push({time:G(p),score:D})}O.sort((p,v)=>p.score-v.score);let w=[];for(let p of O)if(w.every(v=>Math.abs(g(v.time)-g(p.time))>=60)&&w.push(p),w.length>=t)break;return w.sort((p,v)=>g(p.time)-g(v.time)).map(p=>({...p,peak:p.score<=30}))}function de(e){if(!e.time)return r.team.map(s=>s.id);let t=[g(e.time),g(e.time)+C(e)];return r.team.filter(s=>!Z(s.id,e.date,e.id).some(o=>J(t,A(o)))).map(s=>s.id)}function Ye(e,t){let s=ke();if(s.daysOff.includes(M(t).getDay()))return{minutes:null,longest:null,dayOff:!0};let o=g(s.workStart),a=g(s.workEnd),n=[[g(s.lunchStart),g(s.lunchEnd)]];r.eventsOn(t,{person:e}).filter(i=>i.time).forEach(i=>{let d=A(i);n.push([d[0],E(i.type)?d[0]+15:d[1]+(z(i)?30:0)])}),n.sort((i,d)=>i[0]-d[0]);let c=o,m=0,l=0;return n.forEach(([i,d])=>{if(i>=a||d<=o)return;let b=Math.max(i,o),h=Math.min(d,a);h<=c||(b>c&&(m+=b-c,l=Math.max(l,b-c)),c=Math.max(c,h))}),a>c&&(m+=a-c,l=Math.max(l,a-c)),{minutes:m,longest:l,dayOff:!1}}function Mt(e,t,s){let o=[],a=E(t.type)&&!E(s.type)?t:E(s.type)&&!E(t.type)?s:(t.createdAt||0)>(s.createdAt||0)?t:s,n=r.team.find(m=>m.id!==e);n&&de(a).includes(n.id)&&(a.assignees||[]).length===1&&o.push({label:`Passar para ${n.name}`,eventId:a.id,patch:{assignees:[n.id]}});let c=pe(a,{limit:1})[0];return c&&o.push({label:`Mover ${y[a.type].label.toLowerCase()} para ${_(c.time)}`,eventId:a.id,patch:{time:c.time}}),o}function jt(e,t="all"){let s=t==="all"?r.team:r.team.filter(a=>a.id===t),o=e===x()?ne():-1;return s.map(a=>{let n=r.eventsOn(e,{person:a.id}),c=n.filter(d=>d.status==="feito").length,m=n.filter(d=>d.status==="pendente"&&d.time&&o>=0&&(E(d.type)?g(d.time):g(d.time)+C(d))<o).length,l=Ye(a.id,e),i=n.find(d=>d.status!=="feito"&&d.time&&g(d.time)>=o);return{id:a.id,name:a.name,total:n.length,done:c,late:m,free:l.dayOff?"Folga":l.minutes==null?null:l.minutes<30?"Dia cheio":`${j(l.minutes)} livre${l.minutes>=120?"s":""}`,busy:!l.dayOff&&l.minutes!=null&&l.minutes<30,next:i?`${_(i.time)} \xB7 ${i.title||ce(i)}`:null}})}function Pt(e,t="all"){let s=t==="all"?r.team:r.team.filter(n=>n.id===t),o=[];return r.eventsOn(e,{person:t}).length?(s.forEach(n=>{let c=r.eventsOn(e,{person:n.id}),m=Ye(n.id,e),l=c.filter(z),i=[`${c.length} tarefa${c.length===1?"":"s"}`];l.length&&i.push(`sai para ${l.map(d=>`${ce(d)} \xE0s ${_(d.time)}`).join(" e ")}`),m.dayOff?i.push("\xE9 dia de folga"):m.minutes!=null&&i.push(m.minutes>=30?`${j(m.minutes)} livres no expediente (maior intervalo: ${j(m.longest)})`:"quase sem tempo livre"),o.push(`${n.name}: ${i.join(", ")}.`)}),o):[`Nenhum compromisso${t==="all"?"":" para "+F(t)}. Bom dia para planejar a pauta ou adiantar edi\xE7\xF5es.`]}var mt={feed:"\u{1F5BC}\uFE0F",carrossel:"\u{1F5C2}\uFE0F",reels:"\u{1F3AC}",story:"\u2B55",captacao:"\u{1F4F8}",reuniao:"\u{1F91D}",producao:"\u2702\uFE0F",outro:"\u2022"},te=e=>String(e||"").replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\r?\n/g,"\\n"),ut=e=>{let t=[];for(;e.length>74;)t.push(e.slice(0,74)),e=" "+e.slice(74);return t.push(e),t.join(`\r
`)},Qe=(e,t)=>e.replace(/-/g,"")+"T"+t.replace(":","")+"00",ft=()=>new Date().toISOString().replace(/[-:]/g,"").replace(/\.\d+/,"");function vt(e,t){let s=["BEGIN:VCALENDAR","VERSION:2.0",`PRODID:-//${se.appName}//PT-BR`,"CALSCALE:GREGORIAN","METHOD:PUBLISH",`X-WR-CALNAME:${te(t)}`];return e.forEach(o=>{let a=r.company(o.companyId),n=(o.assignees||[]).map(i=>r.member(i)?.name).filter(Boolean).join(" e "),c=`${mt[o.type]||""} ${y[o.type]?.label||"Evento"} \xB7 ${a?.name||""}${o.title?" \u2014 "+o.title:""}`.trim(),m=[n&&`Respons\xE1vel: ${n}`,o.description,o.internalNote&&`Nota interna: ${o.internalNote}`].filter(Boolean).join(`
`);if(s.push("BEGIN:VEVENT",`UID:${o.id}@pauta`,`DTSTAMP:${ft()}`),o.time){let i=g(o.time)+C(o),d=i>=1440?I(o.date,1):o.date;s.push(`DTSTART:${Qe(o.date,o.time)}`,`DTEND:${Qe(d,G(i%1440))}`)}else s.push(`DTSTART;VALUE=DATE:${o.date.replace(/-/g,"")}`,`DTEND;VALUE=DATE:${I(o.date,1).replace(/-/g,"")}`);s.push(`SUMMARY:${te(c)}`),m&&s.push(`DESCRIPTION:${te(m)}`),o.location&&s.push(`LOCATION:${te(o.location)}`);let l=o.reminder??30;l>=0&&s.push("BEGIN:VALARM","ACTION:DISPLAY",`DESCRIPTION:${te(c)}`,`TRIGGER:-PT${l}M`,"END:VALARM"),s.push("END:VEVENT")}),s.push("END:VCALENDAR"),s.map(ut).join(`\r
`)}async function Xe(e,t,s){let o=vt(e,s),a=le();if(a){let l=document.createElement("form");l.method="POST",l.action=a.replace(/\/$/,"")+"/ics",l.target="_blank",l.style.display="none";let i=document.createElement("textarea");i.name="ics",i.value=o,l.appendChild(i),document.body.appendChild(l),l.submit(),l.remove();return}let n=new File([o],t,{type:"text/calendar"});if(navigator.canShare&&navigator.canShare({files:[n]}))try{await navigator.share({files:[n],title:s});return}catch(l){if(l&&l.name==="AbortError")return}let c=URL.createObjectURL(n),m=document.createElement("a");m.href=c,m.download=t,document.body.appendChild(m),m.click(),m.remove(),setTimeout(()=>URL.revokeObjectURL(c),4e3)}var Ze=new Set(["fazer","criar","postar","subir","publicar","gravar","post","postagem","publicacao","publica\xE7\xE3o","o","a","um","uma","no","na","do","da","de","dos","das","pro","pra","para","feed","reels","reel","story","stories","storie","storys","carrossel","carosel","carossel","instagram","insta","ig","sobre","com","e"]),bt=[[/\bcouve flor\b/gi,"couve-flor"],[/\bpromocao\b/gi,"promo\xE7\xE3o"],[/\bpromoçao\b/gi,"promo\xE7\xE3o"],[/\bacao\b/gi,"a\xE7\xE3o"],[/\bpao\b/gi,"p\xE3o"],[/\blimao\b/gi,"lim\xE3o"],[/\bmamao\b/gi,"mam\xE3o"],[/\bmelao\b/gi,"mel\xE3o"],[/\bfeijao\b/gi,"feij\xE3o"],[/\bmaca\b/gi,"ma\xE7\xE3"],[/\bmaça\b/gi,"ma\xE7\xE3"],[/\babobora\b/gi,"ab\xF3bora"],[/\bpessego\b/gi,"p\xEAssego"],[/\bmaracuja\b/gi,"maracuj\xE1"],[/\babacate\b/gi,"abacate"],[/\babacaxi\b/gi,"abacaxi"],[/\bcafe\b/gi,"caf\xE9"],[/\bpromo\b/gi,"promo"],[/\bblack friday\b/gi,"Black Friday"],[/\bnatal\b/gi,"Natal"],[/\bano novo\b/gi,"Ano Novo"],[/\bdia das maes\b/gi,"Dia das M\xE3es"],[/\bdia dos pais\b/gi,"Dia dos Pais"],[/\bhamburguer\b/gi,"hamb\xFArguer"],[/\bhamburguers\b/gi,"hamb\xFArgueres"],[/\blancamento\b/gi,"lan\xE7amento"],[/\bcolecao\b/gi,"cole\xE7\xE3o"],[/\bvideo\b/gi,"v\xEDdeo"],[/\bsabado\b/gi,"s\xE1bado"],[/\bpromocoes\b/gi,"promo\xE7\xF5es"]],et=e=>e.toLowerCase().replace(/[.,:;!]+$/,""),ht={feed:"Post no feed",carrossel:"Carrossel",reels:"Reels",story:"Stories"},tt=/^(post no feed|carrossel|reels|stories|story)\s+—\s+/i;function at(e,t=null){let s=String(e||"").replace(/\s+/g," ").trim();if(!s)return s;let o=ht[t];if(!o)return Se(Ee(s));if(tt.test(s))return`${o} \u2014 ${Se(Ee(s.replace(tt,"")))}`;let a=s.split(" ");for(;a.length>1&&Ze.has(et(a[0]));)a.shift();return s=a.join(" ").replace(/\s+(no|pro|pra|para o)\s+(instagram|insta|ig|feed)\s*$/i,"").trim(),Ze.has(et(s))?o:`${o} \u2014 ${Se(Ee(s))}`}var Ee=e=>{for(let[t,s]of bt)e=e.replace(t,s);return e},Se=e=>e&&e.charAt(0).toLocaleUpperCase("pt-BR")+e.slice(1);var yt=[[/pura vida|hortifruti|jg garcia/i,"hortifruti: frutas, verduras e legumes frescos"],[/bbq|burger|hamb/i,"hamburgueria e churrasco (BBQ)"],[/multimarcas|moda|roupa/i,"loja de roupas multimarcas"],[/festa/i,"loja de artigos e decora\xE7\xE3o de festas"]];function _e(e){if(e?.niche)return e.niche;let t=yt.find(([s])=>s.test(e?.name||""));return t?t[1]:""}function gt(){let e=x();return r.state.companies.map(t=>{let s=r.state.events.filter(c=>c.companyId===t.id&&y[c.type]?.kind==="post"),o=s.filter(c=>c.date<=e&&(c.status==="feito"||c.date<e)).map(c=>c.date).sort(),a=s.filter(c=>c.date>=e&&c.status!=="feito").map(c=>c.date).sort(),n=o[o.length-1]||"";return{onlyFor:t.notifyOnly||null,name:t.name,niche:_e(t)||"pequena empresa local",lastPost:n,nextPost:a[0]||"",daysSincePost:n?De(n,e):null}})}var st=null,ot="";function Qt(){r.mode!=="cloud"||!le()||!r.ready||(clearTimeout(st),st=setTimeout(()=>{let e=gt(),t=JSON.stringify(e);t!==ot&&ye("/coach",{companies:e}).then(()=>ot=t).catch(()=>{})},4e3))}var Xt=()=>ye("/coach-test",{});function ca(){let e=r.companiesSorted(),t=x(),s=Ae(t),o=I(s,6);return`
  <header class="hdr">
    <div class="hdr__row">
      <div class="hdr__titles"><p class="hdr__eyebrow">${e.length} cliente${e.length===1?"":"s"}</p><h1>Empresas</h1></div>
      <div class="hdr__actions"><button class="btn btn--primary btn--sm" data-action="new-company">${f("plus",16)} Nova</button></div>
    </div>
  </header>
  <div class="page">
    ${e.length?"":$e("Nenhuma empresa ainda","Cadastre os clientes com nome, cor e logomarca. Cada um ganha um link pr\xF3prio para ver s\xF3 o seu cronograma.",`<button class="btn btn--primary" data-action="new-company">${f("plus",18)} Cadastrar empresa</button>`)}
    <div class="colist">
      ${e.map(a=>{let n=r.eventsBetween(s,o,{companyId:a.id}),c=n.filter(i=>E(i.type)).length,m=n.filter(i=>i.type==="captacao").length,l=r.state.events.filter(i=>i.companyId===a.id&&i.date>=t&&i.status!=="feito").sort((i,d)=>(i.date+i.time).localeCompare(d.date+d.time))[0];return`<button class="cocard" style="--cc:${a.color};--cc-soft:${Y(a.color,.1)}" data-action="open-company" data-id="${a.id}">
          <div class="cocard__top">
            ${q(a,48)}
            <div class="cocard__name"><strong>${u(a.name)}</strong>${a.instagram?`<small>${f("insta",12)} @${u(a.instagram)}</small>`:""}</div>
            ${f("right",18,"muted")}
          </div>
          <div class="cocard__stats">
            <span><b>${c}</b> posts</span><span><b>${m}</b> capta\xE7${m===1?"\xE3o":"\xF5es"}</span><span class="muted">nesta semana</span>
          </div>
          ${l?`<div class="cocard__next">${f(y[l.type].icon,14)} <b>${u(K(l.date))}${l.time?" "+l.time:""}</b> \xB7 ${u(y[l.type].label)} \u2014 ${u(l.title||"")}</div>`:'<div class="cocard__next muted">Nada agendado</div>'}
        </button>`}).join("")}
    </div>
  </div>`}function pa(e){let t=R({className:"sheet--tall",html:nt(e),onMount:s=>$t(s,e)});t.refresh=()=>r.company(e)?t.set(nt(e)):t.close()}function nt(e){let t=r.company(e);if(!t)return"";let s=x(),o=oe(s),a=r.eventsBetween(`${o}-01`,`${o}-31`,{companyId:e}),n=r.eventsBetween(s,I(s,30),{companyId:e}),c=r.eventsBetween(I(s,-14),I(s,-1),{companyId:e}).reverse(),m=b=>a.filter(h=>b.includes(h.type)).length,l=a.filter(b=>b.status==="feito").length,i="",d=n.map(b=>{let h=b.date!==i?`<h4 class="dayhead">${u(W(b.date))}</h4>`:"";return i=b.date,h+ge(b)}).join("");return`
  ${B("",{right:r.canEdit("companies",t)?'<button class="btn-text" data-act="edit">Editar</button>':""})}
  <div class="cohero" style="--cc:${t.color};--cc-soft:${Y(t.color,.14)}">
    ${q(t,72,20)}
    <h2>${u(t.name)}</h2>
    ${t.instagram?`<a class="cohero__ig" href="https://instagram.com/${encodeURIComponent(t.instagram)}" target="_blank" rel="noopener">${f("insta",14)} @${u(t.instagram)}</a>`:""}
    <div class="cohero__btns">
      <button class="btn btn--primary btn--sm" data-act="new">${f("plus",16)} Evento</button>
      <button class="btn btn--soft btn--sm" data-act="clientview">${f("eye",16)} P\xE1gina do cliente</button>
      <button class="btn btn--soft btn--sm" data-act="share">${f("share",16)} Enviar</button>
    </div>
  </div>

  <div class="page page--sheet">
    <section class="block">
      <h2 class="block__title">${u(Me(o))}</h2>
      <div class="mstats mstats--5">
        <div><b>${m(["feed","carrossel"])}</b><span>feed</span></div>
        <div><b>${m(["reels"])}</b><span>reels</span></div>
        <div><b>${m(["story"])}</b><span>stories</span></div>
        <div><b>${m(["captacao"])}</b><span>capta\xE7\xF5es</span></div>
        <div><b>${a.length?Math.round(l/a.length*100):0}%</b><span>feito</span></div>
      </div>
    </section>

    ${t.address||t.contact||t.notes?`<ul class="rows">
      ${t.address?`<li><span class="rows__k">${f("pin",16)} Endere\xE7o</span><a class="rows__v link" href="https://maps.apple.com/?q=${encodeURIComponent(t.address)}" target="_blank" rel="noopener">${u(t.address)}</a></li>`:""}
      ${t.contact?`<li><span class="rows__k">${f("user",16)} Contato</span><span class="rows__v">${u(t.contact)}</span></li>`:""}
      ${t.notes?`<li><span class="rows__k">${f("note",16)} Observa\xE7\xF5es</span><span class="rows__v">${u(t.notes)}</span></li>`:""}
    </ul>`:""}

    <section class="block">
      <h2 class="block__title">Pr\xF3ximos 30 dias</h2>
      ${d||$e("Nada agendado","Crie o cronograma de postagens desta empresa.")}
    </section>

    ${c.length?`<section class="block">
      <h2 class="block__title">\xDAltimas 2 semanas</h2>
      ${c.map(b=>ge(b,{showDate:!0,compact:!0})).join("")}
    </section>`:""}
  </div>`}function $t(e,t){let s=e.el;(s.querySelector('[data-act="edit"]')||{}).onclick=()=>xe(t),s.querySelector('[data-act="new"]').onclick=async()=>{let{openEventEditor:o}=await import("./c-M2AWUQM5.js");o({companyId:t})},s.querySelector('[data-act="share"]').onclick=()=>Ie(t),s.querySelector('[data-act="clientview"]').onclick=()=>wt(t)}function xe(e=null,t=null){let s=e?r.company(e):null,o=r.state.companies.map(m=>m.color),a=s?{...s}:{id:P("c_"),name:"",color:ie.find(m=>!o.includes(m))||ie[0],logo:null,instagram:"",address:"",contact:"",notes:"",shareToken:null},n=()=>`
    ${B(s?"Editar empresa":"Nova empresa",{left:'<button class="btn-text" data-close>Cancelar</button>',right:'<button class="btn btn--primary btn--sm" data-save>Salvar</button>'})}
    <form class="form" onsubmit="return false">
      <div class="logopick">
        <div data-preview>${q({...a,name:a.name||"?"},88,24)}</div>
        <div class="logopick__btns">
          <label class="btn btn--soft btn--sm">${f("image",16)} ${a.logo?"Trocar logo":"Enviar logomarca"}<input type="file" accept="image/*" data-file hidden></label>
          ${a.logo?'<button type="button" class="btn-text btn-text--sm" data-rmlogo>Remover logo</button>':'<p class="fhelp">Opcional. Sem logo, usamos as iniciais na cor escolhida.</p>'}
        </div>
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-name">Nome da empresa</label>
        <input id="c-name" class="input" name="name" value="${u(a.name)}" placeholder="Ex.: Pura Vida" autocomplete="off" maxlength="60">
      </div>
      <div class="fgroup">
        <label class="flabel">Cor da empresa no calend\xE1rio</label>
        <div class="palette">
          ${ie.map(m=>`<button type="button" class="swatch${a.color===m?" is-on":""}" style="background:${m}" data-color="${m}" aria-label="Cor ${m}">${f("check",16)}</button>`).join("")}
          <label class="swatch swatch--custom" title="Outra cor"><input type="color" value="${a.color}" data-customcolor>${f("plus",16)}</label>
        </div>
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-ig">Instagram</label>
        <div class="input-prefix"><span>@</span><input id="c-ig" class="input" name="instagram" value="${u(a.instagram||"")}" placeholder="usuario" autocomplete="off" autocapitalize="none"></div>
      </div>
      <div class="fgroup">
        <label class="flabel">Notifica\xE7\xF5es desta empresa v\xE3o para</label>
        <div class="seg seg--notify">${[["","Os dois"],...r.team.map(m=>[m.id,m.name])].map(([m,l])=>`<button type="button" class="seg__btn${(a.notifyOnly||"")===m?" is-on":""}" data-only="${m}">${u(l)}</button>`).join("")}</div>
        <p class="fhelp">Avisos, lembretes, \u201CJ\xE1 postou?\u201D, cobran\xE7as de atraso e dicas desta empresa chegam s\xF3 para quem estiver marcado.</p>
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-niche">O que a empresa faz (para as dicas)</label>
        <input id="c-niche" class="input" name="niche" value="${u(a.niche||_e(a))}" placeholder="Ex.: hamburgueria artesanal, loja de roupas femininas" autocomplete="off" maxlength="160">
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-addr">Endere\xE7o (para capta\xE7\xF5es)</label>
        <input id="c-addr" class="input" name="address" value="${u(a.address||"")}" placeholder="Rua, n\xFAmero \u2013 bairro" autocomplete="off">
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-contact">Contato</label>
        <input id="c-contact" class="input" name="contact" value="${u(a.contact||"")}" placeholder="Nome e WhatsApp do respons\xE1vel" autocomplete="off">
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-notes">Observa\xE7\xF5es internas</label>
        <textarea id="c-notes" class="input" name="notes" rows="3" placeholder="Tom de voz, o que evitar, prefer\xEAncias\u2026">${u(a.notes||"")}</textarea>
      </div>
      ${s?`<button type="button" class="btn btn--danger-soft btn--block" data-delete>${f("trash",18)} Excluir empresa</button>`:""}
      <div class="form__spacer"></div>
    </form>`,c=m=>{let l=m.el,i=l.querySelector("form"),d=()=>{a.name=i.name.value.trim(),a.instagram=i.instagram.value.trim().replace(/^@/,""),a.niche=i.niche.value.trim(),a.notifyOnly=l.querySelector("[data-only].is-on")?.dataset.only||null,a.address=i.address.value.trim(),a.contact=i.contact.value.trim(),a.notes=i.notes.value.trim()},b=()=>l.querySelector("[data-preview]").innerHTML=q({...a,name:i.name.value||"?"},88,24);i.name.addEventListener("input",b),l.querySelectorAll("[data-only]").forEach(w=>w.onclick=()=>l.querySelectorAll("[data-only]").forEach(p=>p.classList.toggle("is-on",p===w))),l.querySelectorAll("[data-color]").forEach(w=>w.onclick=()=>{a.color=w.dataset.color,l.querySelectorAll("[data-color]").forEach(p=>p.classList.toggle("is-on",p===w)),b()}),l.querySelector("[data-customcolor]").oninput=w=>{a.color=w.target.value,l.querySelectorAll("[data-color]").forEach(p=>p.classList.remove("is-on")),b()},l.querySelector("[data-file]").onchange=async w=>{let p=w.target.files[0];if(p)try{d(),a.logo=await je(p,160),m.set(n())}catch{S("N\xE3o foi poss\xEDvel ler essa imagem")}};let h=l.querySelector("[data-rmlogo]");h&&(h.onclick=()=>{d(),a.logo=null,m.set(n())});let O=l.querySelector("[data-delete]");O&&(O.onclick=async()=>{let w=r.state.events.filter(v=>v.companyId===a.id);await U({title:`Excluir ${a.name}?`,text:w.length?`Os ${w.length} eventos desta empresa tamb\xE9m ser\xE3o apagados e o link do cliente deixar\xE1 de funcionar.`:"O link do cliente deixar\xE1 de funcionar.",ok:"Excluir empresa",danger:!0})&&(await r.removeMany("events",w.map(v=>v.id)),await r.remove("companies",a.id),m.close(),S("Empresa exclu\xEDda"))}),l.querySelector("[data-save]").onclick=async()=>{if(d(),!a.name)return i.name.focus(),S("Digite o nome da empresa");await r.upsert("companies",{...a}),m.close(),S(s?"Empresa atualizada":"Empresa cadastrada"),t&&t(r.company(a.id))}};R({className:"sheet--tall",html:n(),onMount:c})}async function Ie(e){let t=r.company(e),s=r.mode==="cloud",o="";s?(await r.ensureShareToken(t),await r.publishCompany(e),o=Re(r.company(e).shareToken)):o=Be(await Pe(ue(t,r.state.events,{maxFuture:90})));let a=`
    ${B("Link do cliente")}
    <div class="share">
      <div class="share__co">${q(t,56)}<div><strong>${u(t.name)}</strong><small>v\xEA somente o pr\xF3prio cronograma</small></div></div>
      <ul class="checks">
        <li>${f("check",16)} Somente os eventos da ${u(t.name)}</li>
        <li>${f("check",16)} Sem notas internas e sem outras empresas</li>
        <li>${f("check",16)} Somente leitura: o cliente n\xE3o consegue alterar nada</li>
        <li>${f(s?"check":"alert",16)} ${s?"Sempre atualizado: tudo que voc\xEAs mudarem aparece para o cliente":"Foto do cronograma atual (pr\xF3ximos 90 dias). Quando mudar algo, envie o link de novo"}</li>
      </ul>
      <div class="share__link"><input readonly value="${u(o)}" data-link></div>
      <div class="share__btns">
        <button class="btn btn--primary btn--block" data-sharebtn>${f("share",18)} Enviar para o cliente</button>
        <button class="btn btn--soft btn--block" data-copy>${f("copy",18)} Copiar link</button>
        <a class="btn btn--ghost btn--block" href="${u(o)}" target="_blank" rel="noopener">${f("eye",18)} Ver como o cliente v\xEA</a>
      </div>
      ${s?'<button class="btn-text btn-text--sm btn-text--danger" data-revoke>Gerar novo link (o antigo para de funcionar)</button>':'<p class="fhelp">Dica: ative a sincroniza\xE7\xE3o na nuvem (Ajustes) para o link ficar sempre atualizado automaticamente.</p>'}
    </div>`;R({html:a,onMount:n=>{let c=n.el;c.querySelector("[data-copy]").onclick=async()=>{try{await navigator.clipboard.writeText(o),S("Link copiado")}catch{c.querySelector("[data-link]").select(),S("Selecione e copie o link")}},c.querySelector("[data-sharebtn]").onclick=async()=>{let l=`Ol\xE1! Este \xE9 o cronograma de conte\xFAdo da ${t.name}. Por aqui voc\xEAs acompanham tudo o que est\xE1 planejado: posts, stories, reels e capta\xE7\xF5es.`;if(navigator.share)try{await navigator.share({title:`Cronograma \xB7 ${t.name}`,text:l,url:o})}catch{}else await navigator.clipboard?.writeText(`${l}
${o}`),S("Mensagem copiada")};let m=c.querySelector("[data-revoke]");m&&(m.onclick=async()=>{await U({title:"Gerar um novo link?",text:"Quem tiver o link antigo n\xE3o conseguir\xE1 mais ver o cronograma.",ok:"Gerar novo link",danger:!0})&&(await r.regenerateShareToken(r.company(e)),n.close(),Ie(e))})}})}async function wt(e){let t=r.company(e);if(!t)return;let{showClient:s}=await import("./c-JEHUTABW.js"),{sanitizePayload:o}=await import("./c-IY6FCE6X.js"),a=o(ue(t,r.state.events)),n=document.createElement("div");n.className="client-preview",n.innerHTML=`<div class="client-preview__bar"><button class="btn btn--soft btn--sm" data-closepv>${f("left",16)} Voltar</button><span>Assim o cliente v\xEA</span><button class="btn btn--primary btn--sm" data-sendpv>${f("share",16)} Enviar</button></div><div class="client-preview__body"></div>`,document.body.appendChild(n),document.body.classList.add("has-sheet"),s(n.querySelector(".client-preview__body"),a,{canGoBack:!1,preview:!0});let c=()=>{n.remove(),document.body.classList.toggle("has-sheet",!!document.querySelector(".sheet-wrap"))};n.querySelector("[data-closepv]").onclick=c,n.querySelector("[data-sendpv]").onclick=()=>{c(),Ie(e)}}function Ia(e){let t=R({html:it(e),className:"sheet--tall",onMount:s=>kt(s,e)});t.refresh=()=>{if(!r.event(e))return t.close();t.set(it(e))}}function it(e){let t=r.event(e);if(!t)return"";let s=r.company(t.companyId),o=s?.color||"#666",a=be.find(l=>l.v===(t.reminder??30)),n=t.seriesId?r.state.events.filter(l=>l.seriesId===t.seriesId).length:0,c=r.canEdit("events",t),m=r.member(r.ownerOf("events",t))?.name||"o parceiro";return`
  ${B("",{right:c?'<button class="btn-text" data-act="edit">Editar</button>':""})}
  <div class="detail">
    <div class="detail__hero" style="--cc:${o};--cc-soft:${Y(o,.12)}">
      <div class="detail__co">${q(s,40)}<div><strong>${u(s?.name||"Sem empresa")}</strong>${s?.instagram?`<small>@${u(s.instagram)}</small>`:""}</div>${ze(t.type,{solid:!0})}</div>
      <h2><span class="pfrow">${Ve(t,24)}</span>${u(t.title||y[t.type].label)}</h2>
      <p class="detail__when">${f("calendar",15)} ${u(K(t.date))}, ${u(Le(t.date).split(", ")[1])} \xB7 ${f("clock",15)} ${u(Ge(t))}</p>
    </div>

    ${c?"":`<p class="detail__lock">${f("eye",14)} Cadastrado por ${u(m)} \u2014 voc\xEA s\xF3 pode ver. Use \u201CDuplicar\u201D para criar uma c\xF3pia sua.</p>`}
    <div class="seg seg--status"${c?"":" hidden"}>
      ${ve.map(l=>`<button class="seg__btn${t.status===l?" is-on":""} st-${l}" data-status="${l}">${l==="feito"?f("check",14):""}${fe[l].label}</button>`).join("")}
    </div>

    <ul class="rows">
      <li><span class="rows__k">${f("users",16)} Respons\xE1vel</span><span class="rows__v">${(t.assignees||[]).map(l=>Q(l,22)).join("")} ${u(re(t.assignees))}</span></li>
      ${t.location?`<li><span class="rows__k">${f("pin",16)} Local</span><a class="rows__v link" href="https://maps.apple.com/?q=${encodeURIComponent(t.location)}" target="_blank" rel="noopener">${u(t.location)}</a></li>`:""}
      ${y[t.type].kind!=="post"||t.duration?`<li><span class="rows__k">${f("clock",16)} Dura\xE7\xE3o</span><span class="rows__v">${u(j(C(t)))}</span></li>`:""}
      <li><span class="rows__k">${f("bell",16)} Lembrete</span><span class="rows__v">${u(a?.label||"\u2014")}</span></li>
      ${n?`<li><span class="rows__k">${f("repeat",16)} Repeti\xE7\xE3o</span><span class="rows__v">${n} eventos na s\xE9rie</span></li>`:""}
      <li><span class="rows__k">${f(t.visibleToClient===!1?"eyeoff":"eye",16)} Cliente</span><span class="rows__v">${t.visibleToClient===!1?"N\xE3o aparece para o cliente":"Aparece no calend\xE1rio do cliente"}</span></li>
    </ul>

    ${t.description?`<div class="textbox"><h4>Descri\xE7\xE3o / legenda</h4><p>${u(t.description)}</p></div>`:""}
    ${t.internalNote?`<div class="textbox textbox--note"><h4>${f("eyeoff",13)} Nota interna (s\xF3 a equipe v\xEA)</h4><p>${u(t.internalNote)}</p></div>`:""}

    <div class="actions">
      <button data-act="ics">${f("bell",20)}<span>Lembrete no iPhone</span></button>
      ${c?`<button data-act="tomorrow">${f("right",20)}<span>Passar p/ amanh\xE3</span></button>`:""}
      <button data-act="dup">${f("copy",20)}<span>Duplicar</span></button>
      ${c?`<button data-act="del" class="is-danger">${f("trash",20)}<span>Excluir</span></button>`:""}
    </div>
    <p class="detail__meta">Criado por ${u(r.member(t.createdBy)?.name||"\u2014")}${t.updatedAt?" \xB7 atualizado "+new Date(t.updatedAt).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):""}</p>
  </div>`}function kt(e,t){let s=e.el;s.querySelectorAll("[data-status]").forEach(a=>a.onclick=async()=>{let n=r.event(t);await r.upsert("events",{...n,status:a.dataset.status})});let o=(a,n)=>{let c=s.querySelector(`[data-act="${a}"]`);c&&(c.onclick=n)};o("edit",()=>lt({id:t})),o("dup",async()=>{let n={...r.event(t),id:P("e_"),status:"pendente",seriesId:null,createdAt:null,createdBy:null};await r.upsert("events",n),e.close(),S("Evento duplicado"),lt({id:n.id})}),o("tomorrow",async()=>{let a=r.event(t);await xt(a,{date:I(a.date,1)})&&(await r.upsert("events",{...a,date:I(a.date,1)}),S("Movido para "+K(I(a.date,1)).toLowerCase(),{action:"Desfazer",onAction:()=>r.upsert("events",{...r.event(t),date:a.date})}))}),o("ics",()=>{let a=r.event(t);Xe([a],`${y[a.type].label}-${a.date}.ics`,se.appName)}),o("del",()=>ct(t,e))}async function ct(e,t){let s=r.event(e),o=[e];if(s.seriesId){let n=r.state.events.filter(c=>c.seriesId===s.seriesId&&c.date>=s.date).map(c=>c.id);if(n.length>1){let c=await V({title:"Excluir evento repetido",options:[{label:"S\xF3 este",value:"one",danger:!0},{label:`Este e os pr\xF3ximos (${n.length})`,value:"next",danger:!0}]});if(!c)return;c==="next"&&(o=n)}else if(!await U({title:"Excluir este evento?",ok:"Excluir",danger:!0}))return}else if(!await U({title:"Excluir este evento?",text:"Ele some para a dupla e para o cliente.",ok:"Excluir",danger:!0}))return;let a=o.map(n=>({...r.event(n)}));await r.removeMany("events",o),t&&t.close(),S(o.length>1?`${o.length} eventos exclu\xEDdos`:"Evento exclu\xEDdo",{action:"Desfazer",onAction:()=>r.upsertMany("events",a),ms:4500})}function lt({id:e=null,date:t=null,companyId:s=null,type:o=null,time:a=null,assignees:n=null}={}){let c=e?r.event(e):null;if(c&&!r.canEdit("events",c)){r._denied("events",c);return}let m=r.companiesSorted(),l=o||"feed",i=c?JSON.parse(JSON.stringify(c)):{id:P("e_"),type:l,companyId:s||N.monthCompany||(m.length===1?m[0].id:null),title:"",date:t||(N.tab==="mes"?N.monthSel:N.date)||x(),time:a||y[l].best[0]||"12:00",duration:["shoot","meeting","work","other"].includes(y[l].kind)?y[l].dur:null,assignees:n||(N.person!=="all"?[N.person]:r.me?[r.me]:[]),location:"",description:"",internalNote:"",reminder:30,visibleToClient:y[l].client,status:"pendente"},d=c?JSON.parse(JSON.stringify(c)):null,b={mode:"none",until:I(i.date,28)};return R({className:"sheet--tall",html:pt(i,!!c,b),onMount:O=>Et(O,i,d,b)})}function Ne(e,t){let s=(e.assignees||[]).includes(t.id);return e.notifyPartner===!1?s?`Sem aviso agora. Como ${t.name} \xE9 respons\xE1vel, ele ainda recebe os lembretes do hor\xE1rio.`:`${t.name} n\xE3o recebe aviso nem lembretes deste evento. Fica s\xF3 na agenda.`:`${t.name} recebe o aviso de que voc\xEA marcou e os lembretes do hor\xE1rio.`}var me=e=>["shoot","meeting","work","other"].includes(y[e].kind),ae=e=>["shoot","meeting"].includes(y[e].kind);function pt(e,t,s){let o=r.companiesSorted();return`
  ${B(t?"Editar evento":"Novo evento",{left:'<button class="btn-text" data-close>Cancelar</button>',right:'<button class="btn btn--primary btn--sm" data-save>Salvar</button>'})}
  <form class="form" data-editor onsubmit="return false">
    <div class="fgroup">
      <label class="flabel">O que \xE9?</label>
      <div class="typegrid">
        ${Ue.map(a=>`<button type="button" class="typebtn tbadge--${a}${e.type===a?" is-on":""}" data-type="${a}">${f(y[a].icon,20)}<span>${y[a].label}</span></button>`).join("")}
      </div>
    </div>

    <div class="fgroup">
      <label class="flabel">Empresa</label>
      <div class="cogrid">
        ${o.map(a=>`<button type="button" class="cobtn${e.companyId===a.id?" is-on":""}" style="--cc:${a.color}" data-company="${a.id}">${q(a,26,7)}<span>${u(a.name)}</span></button>`).join("")}
        <button type="button" class="cobtn cobtn--add" data-newco>${f("plus",18)}<span>Nova empresa</span></button>
      </div>
    </div>

    <div class="fgroup" data-when="net" ${y[e.type].kind==="post"?"":"hidden"}>
      <label class="flabel">Onde vai postar?</label>
      <div class="netgrid">${He.map(a=>{let n=Je(a);return n?`<button type="button" class="netbtn${(e.platform||"instagram")===a?" is-on":""}" data-net="${a}"><span class="pf" style="width:22px;height:22px">${n.svg}</span><span>${u(n.name.replace(" (Twitter)",""))}</span></button>`:""}).join("")}</div>
    </div>

    <div class="fgroup">
      <label class="flabel" for="f-title">T\xEDtulo</label>
      <input id="f-title" class="input" name="title" value="${u(e.title)}" placeholder="${u(y[e.type].placeholder)}" autocomplete="off" maxlength="120">
    </div>

    <div class="fgroup row2">
      <div><label class="flabel" for="f-date">Dia</label><input id="f-date" class="input" type="date" name="date" value="${e.date}" required></div>
      <div><label class="flabel" for="f-time">Hor\xE1rio</label><input id="f-time" class="input" type="time" name="time" value="${e.time||""}" step="300"></div>
    </div>

    <div class="fgroup" data-when="duration" ${me(e.type)?"":"hidden"}>
      <label class="flabel" for="f-dur">Dura\xE7\xE3o</label>
      <select id="f-dur" class="input" name="duration">
        ${Fe.map(a=>`<option value="${a}"${(e.duration||y[e.type].dur)===a?" selected":""}>${j(a)}</option>`).join("")}
      </select>
    </div>

    <div data-hint></div>

    <div class="fgroup">
      <label class="flabel">Quem vai fazer?</label>
      <div class="whogrid">
        ${r.team.map(a=>`<button type="button" class="whobtn${(e.assignees||[]).includes(a.id)?" is-on":""}" style="--mc:${a.color}" data-who="${a.id}">${Q(a.id,30)}<span>${u(a.name)}</span><i class="whobtn__check">${f("check",14)}</i></button>`).join("")}
      </div>
      <p class="fhelp">Marque os dois se forem juntos.</p>
      ${r.team.filter(a=>a.id!==r.me).map(a=>`<label class="list__row notifyrow"><span><b>${f("bell",15)} Avisar ${a.name==="Matheus"||a.name==="Henrique"?"o ":""}${u(a.name)}</b><small data-notifyhelp>${Ne(e,a)}</small></span><input type="checkbox" class="switch" name="notifyPartner" ${e.notifyPartner!==!1?"checked":""}></label>`).join("")}
    </div>

    <div class="fgroup" data-when="location" ${ae(e.type)?"":"hidden"}>
      <label class="flabel" for="f-loc">Local</label>
      <input id="f-loc" class="input" name="location" value="${u(e.location||"")}" placeholder="Endere\xE7o ou nome do lugar" autocomplete="off">
      <button type="button" class="btn-text btn-text--sm" data-useaddr hidden>${f("pin",14)} Usar endere\xE7o da empresa</button>
    </div>

    <div class="fgroup">
      <label class="flabel" for="f-desc">Descri\xE7\xE3o / legenda <em class="tag">${f("eye",12)} cliente v\xEA</em></label>
      <textarea id="f-desc" class="input" name="description" rows="3" placeholder="Ideia do post, legenda, roteiro\u2026">${u(e.description||"")}</textarea>
    </div>
    <div class="fgroup">
      <label class="flabel" for="f-note">Nota interna <em class="tag tag--note">${f("eyeoff",12)} s\xF3 a equipe</em></label>
      <textarea id="f-note" class="input" name="internalNote" rows="2" placeholder="Equipamento, observa\xE7\xF5es, combinados\u2026">${u(e.internalNote||"")}</textarea>
    </div>

    <div class="list">
      <label class="list__row"><span>${f("bell",18)} Lembrete</span>
        <select name="reminder">${be.map(a=>`<option value="${a.v}"${(e.reminder??30)===a.v?" selected":""}>${a.label}</option>`).join("")}</select>
      </label>
      ${t?"":`<label class="list__row"><span>${f("repeat",18)} Repetir</span>
        <select name="repeat">${he.map(a=>`<option value="${a.v}"${s.mode===a.v?" selected":""}>${a.label}</option>`).join("")}</select>
      </label>
      <label class="list__row" data-when="until" hidden><span>${f("calendar",18)} At\xE9</span>
        <input type="date" name="until" value="${s.until}">
      </label>`}
      <label class="list__row"><span>${f("eye",18)} Aparece para o cliente</span>
        <input type="checkbox" class="switch" name="visibleToClient" ${e.visibleToClient!==!1?"checked":""}>
      </label>
      ${t?`<label class="list__row"><span>${f("check",18)} Status</span>
        <select name="status">${ve.map(a=>`<option value="${a}"${e.status===a?" selected":""}>${fe[a].label}</option>`).join("")}</select>
      </label>`:""}
    </div>

    ${t?`<button type="button" class="btn btn--danger-soft btn--block" data-delete>${f("trash",18)} Excluir evento</button>`:""}
    <div class="form__spacer"></div>
  </form>`}function Et(e,t,s,o){let a=e.el,n=a.querySelector("[data-editor]"),c=p=>a.querySelector(p),m=()=>{let p=c("[data-hint]");p.innerHTML=_t(t,!s),p.querySelectorAll("[data-settime]").forEach(v=>v.onclick=()=>{t.time=v.dataset.settime,n.time.value=t.time,m()}),p.querySelectorAll("[data-setwho]").forEach(v=>v.onclick=()=>{t.assignees=[v.dataset.setwho],a.querySelectorAll("[data-who]").forEach($=>$.classList.toggle("is-on",t.assignees.includes($.dataset.who))),m()})},l=()=>{a.querySelector('[data-when="duration"]').hidden=!me(t.type);let p=a.querySelector('[data-when="net"]');p&&(p.hidden=y[t.type].kind!=="post"),a.querySelector('[data-when="location"]').hidden=!ae(t.type);let v=r.company(t.companyId),$=c("[data-useaddr]");$.hidden=!(v&&v.address&&n.location.value!==v.address);let D=a.querySelector('[data-when="until"]');D&&(D.hidden=o.mode==="none")};a.querySelectorAll("[data-type]").forEach(p=>p.onclick=()=>{let v=t.type;if(t.type=p.dataset.type,a.querySelectorAll("[data-type]").forEach($=>$.classList.toggle("is-on",$===p)),n.title.placeholder=y[t.type].placeholder,(!s||v!==t.type)&&(t.duration=me(t.type)?y[t.type].dur:null,n.duration.value=String(y[t.type].dur),s||(t.visibleToClient=y[t.type].client,n.visibleToClient.checked=t.visibleToClient)),ae(t.type)&&!n.location.value){let $=r.company(t.companyId);$?.address&&(n.location.value=$.address,t.location=$.address)}l(),m()}),a.querySelectorAll("[data-company]").forEach(p=>p.onclick=()=>{t.companyId=p.dataset.company,a.querySelectorAll("[data-company]").forEach($=>$.classList.toggle("is-on",$===p));let v=r.company(t.companyId);ae(t.type)&&v?.address&&!n.location.value&&(n.location.value=v.address,t.location=v.address),l()}),c("[data-newco]").onclick=()=>{xe(null,p=>{t.companyId=p.id,d(),e.set(pt(t,!!s,o))})},a.querySelectorAll("[data-who]").forEach(p=>p.onclick=()=>{let v=p.dataset.who;t.assignees=t.assignees.includes(v)?t.assignees.filter(k=>k!==v):[...t.assignees,v],p.classList.toggle("is-on",t.assignees.includes(v)),m();let $=a.querySelector("[data-notifyhelp]"),D=r.team.find(k=>k.id!==r.me);$&&D&&($.textContent=Ne(t,D))});let i=a.querySelector('input[name="notifyPartner"]');i&&(i.onchange=()=>{t.notifyPartner=i.checked;let p=a.querySelector("[data-notifyhelp]"),v=r.team.find($=>$.id!==r.me);p&&v&&(p.textContent=Ne(t,v))}),c("[data-useaddr]").onclick=()=>{let p=r.company(t.companyId);n.location.value=p.address,t.location=p.address,l()},a.querySelectorAll("[data-net]").forEach(p=>p.onclick=()=>{t.platform=p.dataset.net,a.querySelectorAll("[data-net]").forEach(v=>v.classList.toggle("is-on",v===p))});let d=()=>{t.title=at(n.title.value.trim(),t.type),y[t.type].kind==="post"&&!t.platform&&(t.platform="instagram"),y[t.type].kind!=="post"&&(t.platform=null),t.date=n.date.value,t.time=n.time.value||"",t.duration=me(t.type)?Number(n.duration.value):null,t.location=ae(t.type)?n.location.value.trim():"",t.description=n.description.value.trim(),t.internalNote=n.internalNote.value.trim(),t.reminder=Number(n.reminder.value),t.visibleToClient=n.visibleToClient.checked,n.status&&(t.status=n.status.value),n.repeat&&(o.mode=n.repeat.value),n.until&&(o.until=n.until.value)};n.addEventListener("input",()=>{d(),l()}),n.addEventListener("change",()=>{d(),l(),m()});let b=c("[data-delete]");b&&(b.onclick=()=>ct(t.id,null).then(()=>!r.event(t.id)&&e.close())),c("[data-save]").onclick=async()=>{if(d(),!h){if(!t.companyId){S("Escolha a empresa"),a.querySelector(".cogrid").scrollIntoView({behavior:"smooth",block:"center"});return}if(!t.date)return S("Escolha o dia");if(!(!t.assignees.length&&!await U({title:"Ningu\xE9m respons\xE1vel?",text:"Este evento ficar\xE1 sem respons\xE1vel. Deseja salvar assim mesmo?",ok:"Salvar assim"}))&&!h){h=!0;try{await O()}finally{h=!1}}}};let h=!1,O=async()=>{if(s){if(["date","time","duration","type","assignees","companyId"].some(v=>JSON.stringify(t[v])!==JSON.stringify(s[v]))&&!await Oe(t,!1,e,w))return;await Nt(t,s)}else if(o.mode!=="none"){let p=It(t.date,o),v=p.filter(k=>ee({...t,date:k},{isNew:!0}).some(T=>T.level==="block")),$=p;if(v.length){let k=await V({title:`${v.length} de ${p.length} datas j\xE1 t\xEAm compromisso nesse hor\xE1rio`,text:v.slice(0,6).map(T=>W(T)).join(" \xB7 ")+(v.length>6?" \u2026":""),options:[{label:`Criar s\xF3 nas ${p.length-v.length} datas livres`,value:"free",primary:!0},{label:"Criar em todas mesmo assim",value:"all"}]});if(!k)return;if(k==="free"&&($=p.filter(T=>!v.includes(T))),!$.length)return S("Nenhuma data livre")}let D=P("s_");await r.upsertMany("events",$.map((k,T)=>({...t,id:T===0?t.id:P("e_"),date:k,seriesId:D})),{activity:{notifyPartner:t.notifyPartner,kind:"series",count:$.length,label:`${y[t.type].label} ${he.find(k=>k.v===o.mode)?.label.toLowerCase()||""} \xE0s ${_(t.time)}`,sample:{companyId:t.companyId,date:$[0]}}}),S(`${$.length} eventos criados`)}else{if(!await Oe(t,!0,e,w))return;await r.upsert("events",{...t}),S("Evento salvo")}e.close()};function w(){n.time.value=t.time||"",n.date.value=t.date,a.querySelectorAll("[data-who]").forEach(p=>p.classList.toggle("is-on",t.assignees.includes(p.dataset.who))),l(),m()}l(),m()}var Te=420,rt=1380,L=e=>(Math.min(Math.max(e,Te),rt)-Te)/(rt-Te)*100;function St(e,t){let s=e.time?A(e):null,o=[8,10,12,14,16,18,20,22];return`<div class="lanes">
    <div class="lanes__head"><strong>Agenda dos dois em ${u(W(e.date))}</strong></div>
    ${r.team.map(a=>{let n=r.eventsOn(e.date,{person:a.id}).filter(l=>l.id!==e.id&&l.time),c=(e.assignees||[]).includes(a.id),m=t.some(l=>l.level==="block"&&l.person===a.id);return`<div class="lane">
        <span class="lane__who">${Q(a.id,22)}</span>
        <div class="lane__track">
          ${o.map(l=>`<i class="lane__tick" style="left:${L(l*60)}%"></i>`).join("")}
          ${n.map(l=>{let i=A(l),d=r.company(l.companyId);return`<span class="lane__ev" style="left:${L(i[0])}%;width:max(4px,${L(i[1])-L(i[0])}%);background:${d?.color||"#888"}" title="${u(H(l))}"></span>`}).join("")}
          ${s&&c?`<span class="lane__draft${m?" is-clash":""}" style="left:${L(s[0])}%;width:max(6px,${L(s[1])-L(s[0])}%)"></span>`:""}
        </div>
      </div>`}).join("")}
    <div class="lane lane--axis"><span class="lane__who"></span><div class="lane__track">${o.map(a=>`<small style="left:${L(a*60)}%">${a}h</small>`).join("")}</div></div>
  </div>`}function _t(e,t){if(!e.date)return"";let s=ee(e,{isNew:t}),o=s.filter(h=>h.level==="block"),a=s.filter(h=>h.level==="warn"),n=s.filter(h=>h.level==="info"),c=pe(e,{limit:4}),m=de(e),l=(e.assignees||[]).length===1?e.assignees[0]:null,i=o.length&&l?r.team.find(h=>h.id!==l&&m.includes(h.id)):null,d=y[e.type],b=h=>`<li class="issue issue--${h.level}">${f(h.level==="block"?"alert":h.level==="warn"?"flag":h.code==="partner"?"user":"bulb",15)}<div><strong>${u(h.title)}</strong><p>${u(h.text)}</p></div></li>`;return`
  <section class="assist">
    <header class="assist__head">${f("sparkle",16)} Assistente</header>
    ${St(e,s)}
    ${s.length?`<ul class="issues">${[...o,...a,...n].map(b).join("")}</ul>`:e.time?`<p class="assist__ok">${f("check",15)} Hor\xE1rio livre para ${u(re(e.assignees))}, sem conflitos.</p>`:""}
    ${i?`<button type="button" class="tchip tchip--wide" data-setwho="${i.id}">${Q(i.id,18)} Passar para ${u(i.name)} (est\xE1 livre)</button>`:""}
    <div class="assist__sugg">
      <p>${u(d.tip)}</p>
      ${c.length?`<div class="hintbox__times">${c.map(h=>`<button type="button" class="tchip${e.time===h.time?" is-on":""}" data-settime="${h.time}">${_(h.time)}${h.peak?"<small>pico</small>":"<small>livre</small>"}</button>`).join("")}</div>`:`<p class="muted">Nenhum hor\xE1rio livre nesse dia${(e.assignees||[]).length?" para "+u(re(e.assignees)):""}. Tente outro dia ou outra pessoa.</p>`}
    </div>
  </section>`}async function Oe(e,t,s,o){let n=ee(e,{isNew:t}).filter(b=>b.level==="block");if(!n.length)return!0;let c=pe(e,{limit:2}),m=(e.assignees||[]).length===1?e.assignees[0]:null,l=m&&r.team.find(b=>b.id!==m&&de(e).includes(b.id)),i=[...c.map(b=>({label:`Mudar para ${_(b.time)} (livre)`,value:"time:"+b.time,primary:!0})),...l?[{label:`Passar para ${l.name} (est\xE1 livre)`,value:"who:"+l.id,primary:!c.length}]:[],{label:"Marcar mesmo assim",value:"force"}],d=await V({title:n[0].code==="duplicate"?"Isso j\xE1 est\xE1 na agenda":"J\xE1 tem compromisso nesse hor\xE1rio",bodyHtml:`<ul class="issues issues--dialog">${n.map(b=>`<li class="issue issue--block">${f("alert",15)}<div><strong>${u(b.title)}</strong><p>${u(b.text)}</p></div></li>`).join("")}</ul>`,options:i});return d?d==="force"?!0:(d.startsWith("time:")&&(e.time=d.slice(5)),d.startsWith("who:")&&(e.assignees=[d.slice(4)]),o(),Oe(e,t,s,o)):!1}async function xt(e,t){let s={...e,...t},o=ee(s).filter(n=>n.level==="block");return o.length?await V({title:"J\xE1 tem compromisso nesse hor\xE1rio",bodyHtml:`<ul class="issues issues--dialog">${o.map(n=>`<li class="issue issue--block">${f("alert",15)}<div><strong>${u(n.title)}</strong><p>${u(n.text)}</p></div></li>`).join("")}</ul>`,options:[{label:"Mover mesmo assim",value:"force",primary:!0}]})==="force":!0}function It(e,t){let s=[],o=e,a=t.until&&t.until>=e?t.until:I(e,28);for(;o<=a&&s.length<150;){let n=M(o).getDay();(t.mode==="daily"||t.mode==="weekdays"&&n>=1&&n<=5||t.mode==="weekly"&&M(o).getDay()===M(e).getDay())&&s.push(o),o=I(o,1)}return s}var Tt=["type","companyId","title","time","duration","assignees","location","description","internalNote","reminder","visibleToClient"];async function Nt(e,t){let s=Tt.filter(o=>JSON.stringify(e[o])!==JSON.stringify(t[o]));if(e.seriesId&&s.length){let o=r.state.events.filter(a=>a.seriesId===e.seriesId&&a.date>t.date);if(o.length){let a=await V({title:"Evento repetido",text:"Aplicar as altera\xE7\xF5es a quais eventos?",options:[{label:"S\xF3 a este",value:"one",primary:!0},{label:`A este e aos pr\xF3ximos (${o.length+1})`,value:"next"}]});if(!a)return;if(a==="next"){let n=Object.fromEntries(s.map(c=>[c,e[c]]));await r.upsertMany("events",[{...e},...o.map(c=>({...c,...n}))],{activity:{kind:"series-edit",count:o.length+1,label:`${y[e.type].label} \xB7 a partir de ${e.date.slice(8)}/${e.date.slice(5,7)}`,sample:{companyId:e.companyId,date:e.date}}}),S("S\xE9rie atualizada");return}}}await r.upsert("events",{...e}),S("Altera\xE7\xF5es salvas")}export{Qt as a,Xt as b,at as c,N as d,Ct as e,ke as f,A as g,H as h,pe as i,Ye as j,Mt as k,jt as l,Pt as m,Xe as n,Ia as o,lt as p,xt as q,ca as r,pa as s,xe as t};
