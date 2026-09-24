(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function e(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(n){if(n.ep)return;n.ep=!0;const i=e(n);fetch(n.href,i)}})();const Et="modulepreload",St=function(t,s){return new URL(t,s).href},Q={},q=function(s,e,a){let n=Promise.resolve();if(e&&e.length>0){const o=document.getElementsByTagName("link"),r=document.querySelector("meta[property=csp-nonce]"),p=r?.nonce||r?.getAttribute("nonce");n=Promise.allSettled(e.map(d=>{if(d=St(d,a),d in Q)return;Q[d]=!0;const c=d.endsWith(".css"),u=c?'[rel="stylesheet"]':"";if(!!a)for(let g=o.length-1;g>=0;g--){const $=o[g];if($.href===d&&(!c||$.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${d}"]${u}`))return;const m=document.createElement("link");if(m.rel=c?"stylesheet":Et,c||(m.as="script"),m.crossOrigin="",m.href=d,p&&m.setAttribute("nonce",p),document.head.appendChild(m),c)return new Promise((g,$)=>{m.addEventListener("load",g),m.addEventListener("error",()=>$(new Error(`Unable to preload CSS for ${d}`)))})}))}function i(o){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=o,window.dispatchEvent(r),!r.defaultPrevented)throw o}return n.then(o=>{for(const r of o||[])r.status==="rejected"&&i(r.reason);return s().catch(i)})},P="cenomer:",k={get(t,s=null){try{const e=localStorage.getItem(P+t);return e?JSON.parse(e):s}catch(e){return console.warn("[storage] get failed",t,e),s}},set(t,s){try{return localStorage.setItem(P+t,JSON.stringify(s)),!0}catch(e){return console.warn("[storage] set failed",t,e),!1}},remove(t){localStorage.removeItem(P+t)},has(t){return localStorage.getItem(P+t)!==null}},tt={dark:"M12 3v2M12 19v2M5 12H3M21 12h-2M6 6l-1.5-1.5M19.5 19.5 18 18M6 18l-1.5 1.5M19.5 4.5 18 6M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z",light:"M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"},V=document.documentElement;function U(t){V.setAttribute("data-theme",t);const s=document.getElementById("themeIcon");s&&s.setAttribute("d",t==="dark"?tt.dark:tt.light);let e=document.querySelector('meta[name="theme-color"]');e||(e=document.createElement("meta"),e.name="theme-color",document.head.appendChild(e)),e.content=t==="dark"?"#0B0B0D":"#FAFAFA"}function Mt(){const t=k.get("theme"),s=window.matchMedia("(prefers-color-scheme: dark)").matches;U(t||(s?"dark":"light"));const e=document.getElementById("themeToggle");if(!e){console.warn("[Theme] #themeToggle not found");return}e.addEventListener("click",()=>{const a=V.getAttribute("data-theme")==="dark"?"light":"dark";U(a),k.set("theme",a)})}function Tt(){const t=V.getAttribute("data-theme")==="dark"?"light":"dark";return U(t),k.set("theme",t),t}const ct=[];let C=null,x=null;function Bt(t){return{path:(t||"").replace(/^#/,"")||"/"}}function Pt(t,s){const e=t.split("/").filter(Boolean),a=s.split("/").filter(Boolean);if(e.length!==a.length)return null;const n={};for(let i=0;i<e.length;i++)if(e[i].startsWith(":"))n[e[i].slice(1)]=decodeURIComponent(a[i]);else if(e[i]!==a[i])return null;return n}function Ct(t){for(const s of ct){const e=Pt(s.pattern,t);if(e)return{route:s,params:e}}return null}function _(t,s){ct.push({pattern:t,handler:s})}function At(t){document.querySelectorAll("[data-route]").forEach(s=>{const e=s.dataset.route;s.classList.toggle("active",e===t)})}async function et(){const{path:t}=Bt(location.hash),s=Ct(t);if(x)try{if(C&&C.destroy&&C.destroy(),x.innerHTML="",C=s?s.route:null,At(t),s)await s.route.handler({outlet:x,params:s.params,path:t});else{const{render:e}=await q(async()=>{const{render:a}=await import("./not-found-DA8OlcH4.js");return{render:a}},[],import.meta.url);await e({outlet:x,params:{},path:t})}window.scrollTo({top:0,behavior:"instant"})}catch(e){console.error("[Router] render error:",e),x.innerHTML=`
      <div class="container" style="padding:80px 24px;text-align:center">
        <h1 style="font-size:32px;margin-bottom:12px">Ошибка</h1>
        <p style="color:var(--text-2)">${e.message}</p>
      </div>`}}function Ht(t){x=t,window.addEventListener("hashchange",et),et()}function dt(t){const s="#"+t;location.hash!==s&&(location.hash=s)}const Y="onboarding-seen",F=3;let l=null,w=0,st=0,nt=0,M=null;function Ot(){return{step:"Шаг 1 — Возможности",title:'Все магазины<br>в <span class="grad">одном месте</span>',text:"Сравниваем цены на <b>Ozon</b>, <b>Wildberries</b>, <b>DNS</b> и <b>Яндекс Маркете</b> — без переключения между вкладками.",features:["Актуальные цены каждые 15 минут","История цен за 90 дней","Никакой рекламы — только цифры"],visual:`
      <div class="demo-card">
        <div class="mp-grid">
          <div class="mp-tile mp-ozon-tile"><div class="mp-name">Ozon</div><div class="mp-sub">64 990 ₽</div></div>
          <div class="mp-tile mp-wb-tile"><div class="mp-name">Wildberries</div><div class="mp-sub">67 490 ₽</div></div>
          <div class="mp-tile mp-dns-tile"><div class="mp-name">DNS</div><div class="mp-sub">69 990 ₽</div></div>
          <div class="mp-tile mp-yandex-tile"><div class="mp-name">Я.Маркет</div><div class="mp-sub">66 490 ₽</div></div>
        </div>
        <div class="mp-connect">
          <span class="dot-live"></span>
          Подключено 4 магазина · обновление каждые 15 мин
        </div>
      </div>
    `}}function jt(){return{step:"Шаг 2 — Как работает",title:'Один поиск —<br><span class="grad">сравнение цен</span>',text:"Введите название товара. Мы найдём его на всех площадках, сопоставим позиции и покажем, где дешевле — с учётом доставки и рейтинга продавца.",features:["Умное сопоставление одинаковых товаров","Учёт доставки и рейтинга продавца","Сортировка по цене, наличию, отзывам"],visual:`
      <div class="demo-card">
        <div class="search-demo">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <span>iPhone 15 128GB<span class="caret"></span></span>
        </div>
        <div class="price-compare">
          <div class="price-compare-row best">
            <div class="mp-logo" style="background:var(--ozon)">O</div>
            <span class="mp-name">Ozon</span>
            <span class="val tabular">64 990 ₽</span>
          </div>
          <div class="price-compare-row">
            <div class="mp-logo" style="background:var(--yandex)">Я</div>
            <span class="mp-name">Я.Маркет</span>
            <span class="val tabular">66 490 ₽</span>
          </div>
          <div class="price-compare-row">
            <div class="mp-logo" style="background:var(--wb)">W</div>
            <span class="mp-name">Wildberries</span>
            <span class="val tabular">67 490 ₽</span>
          </div>
          <div class="price-compare-row">
            <div class="mp-logo" style="background:var(--dns)">D</div>
            <span class="mp-name">DNS</span>
            <span class="val tabular">69 990 ₽</span>
          </div>
        </div>
      </div>
    `}}function It(){return{step:"Шаг 3 — Выгода",title:'Экономьте<br><span class="grad">до 30%</span> на заказе',text:"Отслеживайте цены на нужные товары — пришлём уведомление, когда цена упадёт. Средняя экономия наших пользователей — <b>2 340 ₽</b> на заказе.",features:["Push-уведомления о снижении цены","График истории за 90 дней","Список отслеживаемых в один клик"],visual:`
      <div class="demo-card">
        <div class="savings-demo">
          <div class="label">Экономия за месяц</div>
          <div class="amount tabular">2 340 ₽</div>
          <div class="sub">на 8 заказах</div>
          <div class="bar"><div class="bar-fill"></div></div>
          <div class="bar-meta">
            <span>Без Ценомера</span>
            <span>С Ценомером</span>
          </div>
        </div>
      </div>
    `}}const it=[Ot,jt,It];function qt(){const t=it.map((e,a)=>{const n=e();return`
      <div class="slide ${a===0?"active":""}" data-slide="${a}">
        <div class="slide-text">
          <div class="slide-step">${n.step}</div>
          <h2>${n.title}</h2>
          <p>${n.text}</p>
          <div class="slide-features">
            ${n.features.map(i=>`
              <div class="slide-feature">
                <span class="check">✓</span>
                <span>${i}</span>
              </div>
            `).join("")}
          </div>
        </div>
        <div class="slide-visual">${n.visual}</div>
      </div>
    `}).join(""),s=it.map((e,a)=>`<div class="dot ${a===0?"active":""}" data-dot="${a}"></div>`).join("");l=document.createElement("div"),l.className="onboarding",l.id="onboarding",l.innerHTML=`
    <div class="onboard-top">
      <div class="onboard-brand">
        <div class="logo-mark">Ц</div>
        <span>Ценомер</span>
      </div>
      <button class="onboard-skip" id="onboardSkip" type="button">Пропустить</button>
    </div>

    <div class="onboard-stage">
      <div class="slides-viewport" id="slidesViewport">${t}</div>
    </div>

    <div class="onboard-bottom">
      <div class="dots" id="dots">${s}</div>
      <div class="onboard-nav">
        <button class="btn btn-ghost btn-lg hidden" id="onboardPrev" type="button">Назад</button>
        <button class="btn btn-primary btn-lg" id="onboardNext" type="button">Далее →</button>
      </div>
    </div>
  `,document.body.appendChild(l),document.body.style.overflow="hidden",Dt()}function X(t){if(t<0||t>=F)return;const s=l.querySelectorAll(".slide"),e=l.querySelectorAll(".dot");s.forEach((a,n)=>{a.classList.remove("active","prev"),n===t?a.classList.add("active"):n<t&&a.classList.add("prev")}),e.forEach((a,n)=>a.classList.toggle("active",n===t)),w=t,_t()}function _t(){const t=l.querySelector("#onboardPrev"),s=l.querySelector("#onboardNext"),e=l.querySelector("#onboardSkip");t.classList.toggle("hidden",w===0),w===F-1?(s.textContent="Начать",e.classList.add("hidden")):(s.textContent="Далее →",e.classList.remove("hidden"))}function N(){if(w===F-1)return lt();X(w+1)}function R(){X(w-1)}function lt(){k.set(Y,!0),M&&(document.removeEventListener("keydown",M),M=null),l&&(l.classList.add("closing"),document.body.style.overflow="",setTimeout(()=>{l&&(l.remove(),l=null),location.hash&&location.hash!=="#/"&&(location.hash="#/")},300))}function at(){lt()}function Dt(){l.querySelector("#onboardNext").addEventListener("click",N),l.querySelector("#onboardPrev").addEventListener("click",R),l.querySelector("#onboardSkip").addEventListener("click",at),l.querySelector("#dots").addEventListener("click",s=>{const e=s.target.closest("[data-dot]");e&&X(Number(e.dataset.dot))}),M=s=>{l&&(s.key==="ArrowRight"&&N(),s.key==="ArrowLeft"&&R(),s.key==="Escape"&&at())},document.addEventListener("keydown",M);const t=l.querySelector("#slidesViewport");t.addEventListener("touchstart",s=>{st=s.touches[0].clientX,nt=s.touches[0].clientY},{passive:!0}),t.addEventListener("touchend",s=>{const e=s.changedTouches[0].clientX-st,a=s.changedTouches[0].clientY-nt;Math.abs(e)<50||Math.abs(a)>Math.abs(e)||(e<0?N():R())},{passive:!0})}function vt(){if(l){console.warn("[Onboarding] already shown");return}w=0,qt()}function Nt(){return!k.get(Y)}function Rt(){k.remove(Y)}const L={ozon:{id:"ozon",name:"Ozon",short:"O"},wb:{id:"wb",name:"Wildberries",short:"W"},dns:{id:"dns",name:"DNS",short:"D"},yandex:{id:"yandex",name:"Я.Маркет",short:"Я"}},D=[{id:1,emoji:"📱",title:"Apple iPhone 15 128GB, чёрный",rating:4.8,reviews:1240,inStock:!0,offers:[{mp:"ozon",price:64990},{mp:"wb",price:67490},{mp:"dns",price:69990},{mp:"yandex",price:66490}]},{id:2,emoji:"📱",title:"Apple iPhone 15 128GB, синий",rating:4.7,reviews:862,inStock:!0,offers:[{mp:"wb",price:65990},{mp:"ozon",price:66990},{mp:"yandex",price:68490}]},{id:3,emoji:"📱",title:"Apple iPhone 15 256GB, чёрный",rating:4.9,reviews:2140,inStock:!0,offers:[{mp:"ozon",price:74990},{mp:"dns",price:76990},{mp:"wb",price:77990}]}],pt=[70,72,68,65,63,60,58,55,57,54,50,48,45,47,44,42,40,38,41,39,36,34,32,30],ut=[{id:1,productId:1,emoji:"📱",title:"Apple iPhone 15 128GB, чёрный",tags:["Ozon","WB","DNS"],currentPrice:64990,startPrice:70990,history:[70,72,71,68,67,65,66,64,63,65,64,62,63,61,60,62,61,59,60,58,60,59,61,62]},{id:2,productId:3,emoji:"📱",title:"Apple iPhone 15 256GB, чёрный",tags:["Ozon","DNS"],currentPrice:74990,startPrice:72990,history:[73,72,71,72,74,75,73,72,74,75,76,74,73,75,76,77,75,74,76,78,77,76,75,74]},{id:3,productId:2,emoji:"📱",title:"Apple iPhone 15 128GB, синий",tags:["WB","Я.Маркет"],currentPrice:65990,startPrice:65990,history:[66,66,65,66,66,65,66,66,65,66,66,65,66,66,65,66,66,65,66,66,65,66,66,66]}],ht={1:{id:1,emoji:"📱",title:"Apple iPhone 15 128GB, чёрный",rating:4.8,reviews:1240,inStock:!0,gallery:["📱","📲","🔋","📦"],specs:{Бренд:"Apple",Модель:"iPhone 15",Память:"128 ГБ",Цвет:"Чёрный",Экран:'6.1" OLED',Процессор:"A16 Bionic",Камера:"48 МП + 12 МП",Аккумулятор:"3349 мА·ч"},offers:[{mp:"ozon",price:64990,delivery:"Завтра",seller:"Ozon",rating:4.9},{mp:"yandex",price:66490,delivery:"Послезавтра",seller:"М.Видео",rating:4.7},{mp:"wb",price:67490,delivery:"1–2 дня",seller:"WB",rating:4.6},{mp:"dns",price:69990,delivery:"Сегодня",seller:"DNS",rating:4.8}],history:[70,72,68,65,63,60,58,55,57,54,50,48,45,47,44,42,40,38,41,39,36,34,32,30]}};function K(t){const s=Number(t);return ht[s]||D.find(e=>e.id===s)}const zt=Object.freeze(Object.defineProperty({__proto__:null,MARKETPLACES:L,PRICE_HISTORY:pt,PRODUCTS:D,PRODUCT_DETAILS:ht,TRACKED:ut,findProduct:K},Symbol.toStringTag,{value:"Module"}));function f(t){return t.toLocaleString("ru-RU")+" ₽"}function mt(t){return t.toLocaleString("ru-RU")}function bt(t,s){return Math.round((t-s)/s*100)}function T(t){return[...t].sort((s,e)=>s.price-e.price)}function z(t,s,e,a){const n=t%10,i=t%100;return n===1&&i!==11?s:n>=2&&n<=4&&(i<10||i>=20)?e:a}function ft(t){const n=584/(t.length-1),i=Math.min(...t),o=Math.max(...t),r=u=>8+(140-8*2)*(1-(u-i)/(o-i||1)),p=t.map((u,b)=>`${b===0?"M":"L"} ${8+b*n} ${r(u)}`).join(" "),d=p+` L ${8+(t.length-1)*n} 132 L 8 132 Z`,c="g"+Math.random().toString(36).slice(2,8);return`
    <svg class="chart-svg" viewBox="0 0 600 140" preserveAspectRatio="none">
      <defs>
        <linearGradient id="${c}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="var(--accent)" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <path d="${d}" fill="url(#${c})"/>
      <path d="${p}" fill="none" stroke="var(--accent)"
            stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `}function Gt(t,s=""){const i=84/(t.length-1),o=Math.min(...t),r=Math.max(...t),p=c=>3+(36-3*2)*(1-(c-o)/(r-o||1)),d=t.map((c,u)=>`${u===0?"M":"L"} ${3+u*i} ${p(c)}`).join(" ");return`
    <div class="sparkline">
      <svg viewBox="0 0 90 36" preserveAspectRatio="none">
        <path class="line ${s}" d="${d}"/>
      </svg>
    </div>
  `}function Wt(t){const s=T(t),e=s[0].price;return s.map((a,n)=>{const i=n===0,o=i?"":"+"+bt(a.price,e)+"%",r=L[a.mp];return`
      <div class="price-row ${i?"best":""}">
        <span class="mp mp-${a.mp}">
          <span class="mp-logo">${r.short}</span>
          ${r.name}
        </span>
        ${i?'<span class="badge-best">★ Лучшая</span>':""}
        <span class="val tabular">${f(a.price)}</span>
        <span class="delta tabular">${o}</span>
      </div>
    `}).join("")}function Ut(t,s){const e=T(t.offers),a=e[0].price,n=e[e.length-1].price,i=n-a,o=Math.round(i/n*100);return`
    <article class="card" data-id="${t.id}" style="animation-delay:${s*40}ms">
      <div class="card-main">
        <div class="thumb">
          ${t.inStock?'<span class="thumb-badge">В наличии</span>':""}
          ${t.emoji}
        </div>

        <div class="info">
          <h3><a href="#/product/${t.id}" data-link>${t.title}</a></h3>
          <div class="meta">
            <span class="star">★ ${t.rating}</span>
            <span>${mt(t.reviews)} отзывов</span>
            ${t.inStock?'<span class="stock">В наличии</span>':""}
          </div>
          <div class="prices">${Wt(t.offers)}</div>
        </div>

        <div class="card-side">
          <div class="savings">
            <div class="savings-label">Экономия</div>
            <div class="savings-val tabular">${f(i)}</div>
            <div class="savings-sub">до ${o}% на этом товаре</div>
          </div>
          <button class="btn btn-primary" data-action="compare-card" type="button">
            Сравнить
          </button>
          <button class="btn btn-ghost" data-action="toggle-chart" type="button">
            История цен
          </button>
        </div>
      </div>

      <div class="card-footer">
        <span>Разброс цен: <b class="tabular">${f(i)}</b> · экономия до <b>${o}%</b></span>
        <a href="#/product/${t.id}" data-link class="link">Все предложения →</a>
      </div>

      <div class="chart">
        <div class="chart-inner">
          <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-2);margin-bottom:8px">
            <span>История за 90 дней</span>
            <span style="color:var(--success)">↓ 8% за месяц</span>
          </div>
          ${ft(pt)}
        </div>
      </div>
    </article>
  `}function Vt(){return`
    <div class="skeleton-card">
      <div class="skeleton-box sk-thumb"></div>
      <div>
        <div class="skeleton-box sk-line"></div>
        <div class="skeleton-box sk-line mid"></div>
        <div class="skeleton-box sk-line short"></div>
      </div>
      <div>
        <div class="skeleton-box sk-price"></div>
        <div class="skeleton-box sk-price"></div>
        <div class="skeleton-box sk-price"></div>
      </div>
    </div>
  `}function gt(t){return!Array.isArray(t)||t.length===0?`
      <div class="empty-state">
        <div class="icon">🔍</div>
        <h2>Ничего не найдено</h2>
        <p>Попробуйте изменить запрос или посмотрите популярные товары</p>
      </div>
    `:t.map(Ut).join("")}function yt(t=3){return Array.from({length:t},Vt).join("")}const Yt=Object.freeze(Object.defineProperty({__proto__:null,productsHTML:gt,skeletonsHTML:yt},Symbol.toStringTag,{value:"Module"}));let A=null;function kt(t,s={}){const{wide:e=!1,onClose:a=null}=s,n=document.createElement("div");n.className="modal-overlay",n.innerHTML=`
    <div class="modal ${e?"modal-wide":""}" role="dialog" aria-modal="true">
      ${t}
    </div>
  `,document.body.appendChild(n),document.body.style.overflow="hidden",requestAnimationFrame(()=>n.classList.add("open"));const i=()=>{n.classList.remove("open"),document.removeEventListener("keydown",A),A=null,document.body.style.overflow="",setTimeout(()=>{n.remove(),typeof a=="function"&&a()},200)};return A=o=>{o.key==="Escape"&&i()},document.addEventListener("keydown",A),n.addEventListener("click",o=>{o.target===n&&i()}),n.addEventListener("click",o=>{o.target.closest("[data-modal-close]")&&i()}),{overlay:n,close:i}}function y(t,s=2200){const e=document.createElement("div");e.textContent=t,e.style.cssText=`
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: var(--text);
    color: var(--bg);
    padding: 12px 20px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    z-index: 200;
    box-shadow: var(--shadow-lg);
    opacity: 0;
    transition: all 0.25s;
    pointer-events: none;
  `,document.body.appendChild(e),requestAnimationFrame(()=>{e.style.opacity="1",e.style.transform="translateX(-50%) translateY(0)"}),setTimeout(()=>{e.style.opacity="0",e.style.transform="translateX(-50%) translateY(20px)",setTimeout(()=>e.remove(),300)},s)}function Ft(t){const s=T(t.offers),e=s[0].price,a=s[s.length-1].price,n=a-e,i=Math.round(n/a*100),o=s.map((c,u)=>{const b=L[c.mp],m=u===0,g=m?"":"+"+bt(c.price,e)+"%";return`
      <div class="compare-card ${m?"best":""}">
        <div class="compare-mp-logo ${c.mp}">${b.short}</div>
        <div class="compare-info">
          <div class="mp-name">
            ${b.name}
            ${m?'<span class="badge-best">★ Лучшая цена</span>':""}
          </div>
          <div class="compare-details">
            ${c.delivery?`<span class="detail">🚚 ${c.delivery}</span>`:""}
            ${c.seller?`<span class="detail">🏪 ${c.seller}</span>`:""}
            ${c.rating?`<span class="detail">★ ${c.rating}</span>`:""}
          </div>
        </div>
        <div class="compare-price">
          <span class="price tabular">${f(c.price)}</span>
          ${g?`<span class="delta tabular">${g}</span>`:""}
        </div>
      </div>
    `}).join(""),r=L[s[0].mp],p=t.offers.length,d=p===1?"магазин":p<5?"магазина":"магазинов";return`
    <div class="modal-header">
      <div>
        <h2>Сравнение предложений</h2>
        <div class="sub">${p} ${d} · цены обновлены 2 минуты назад</div>
      </div>
      <button class="modal-close" data-modal-close type="button" aria-label="Закрыть">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <div class="modal-body">
      <div class="compare-head">
        <div class="thumb-sm">${t.emoji||"📦"}</div>
        <div class="info">
          <h3>${t.title}</h3>
          <div class="meta">
            ${t.rating?`<span class="star">★ ${t.rating}</span>`:""}
            ${t.reviews?`<span>${t.reviews.toLocaleString("ru-RU")} отзывов</span>`:""}
            ${t.inStock?"<span>В наличии</span>":""}
          </div>
        </div>
      </div>

      <div class="compare-grid">${o}</div>

      <div class="compare-summary">
        <div class="saving-info">
          <div class="label">Экономия</div>
          <div class="amount tabular">${f(n)}</div>
          <div class="sub">до ${i}% на этом товаре</div>
        </div>
        <button class="btn btn-primary" id="compareBuyBest" type="button">
          Купить в ${r.name}
        </button>
      </div>
    </div>
  `}function $t(t){if(!t||!t.offers){console.warn("[CompareModal] product is invalid");return}const{overlay:s}=kt(Ft(t),{wide:!0}),e=s.querySelector("#compareBuyBest");e&&e.addEventListener("click",()=>{y("Переход в магазин (демо)")})}function Xt(){return`
    <section class="hero">
      <div class="container">
        <div class="hero-badge">
          <span class="pulse"></span>
          Обновляем цены каждые 15 минут
        </div>

        <h1>Один поиск — <span class="grad">четыре магазина</span></h1>

        <p class="hero-sub">
          Сравниваем цены на Ozon, Wildberries, DNS и Яндекс Маркете.
          Средняя экономия — <b>2 340 ₽</b> на заказе.
        </p>

        <div class="hero-stats">
          <div class="hero-stat"><b>2.4M</b> товаров</div>
          <div class="hero-stat"><b>4</b> магазина</div>
          <div class="hero-stat"><b>15 мин</b> обновление</div>
        </div>

        <div class="search-wrap">
          <div class="search-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input type="text" id="searchInput" placeholder="Введите название товара…"
                   value="iPhone 15 128GB" autocomplete="off" />
            <button class="btn btn-primary" id="searchBtn" type="button">Сравнить</button>
          </div>

          <div class="search-dropdown" id="searchDropdown">
            <div class="dd-section">Популярное сейчас</div>
            <div class="dd-item" data-value="iPhone 15"><div class="dd-icon">📱</div><span>iPhone 15</span><span class="dd-meta">12 400 запросов</span></div>
            <div class="dd-item" data-value="PlayStation 5"><div class="dd-icon">🎮</div><span>PlayStation 5</span><span class="dd-meta">8 200 запросов</span></div>
            <div class="dd-item" data-value="Dyson V15"><div class="dd-icon">🧹</div><span>Dyson V15</span><span class="dd-meta">5 100 запросов</span></div>
            <div class="dd-divider"></div>
            <div class="dd-section">Категории</div>
            <div class="dd-item" data-value="Смартфоны"><div class="dd-icon">📱</div><span>Смартфоны</span></div>
            <div class="dd-item" data-value="Ноутбуки"><div class="dd-icon">💻</div><span>Ноутбуки</span></div>
            <div class="dd-item" data-value="Бытовая техника"><div class="dd-icon">🏠</div><span>Бытовая техника</span></div>
          </div>
        </div>

        <div class="chips">
          <button class="chip" type="button">iPhone 15</button>
          <button class="chip" type="button">PlayStation 5</button>
          <button class="chip" type="button">Dyson V15</button>
          <button class="chip" type="button">MacBook Air M3</button>
          <button class="chip" type="button">Samsung S24</button>
        </div>
      </div>
    </section>
  `}function Kt(){return`
    <div class="toolbar" id="toolbar">
      <div class="toolbar-inner">
        <div class="toolbar-count">
          Найдено <span id="resultCount">${D.length}</span> товара
          <span>· по запросу «<b id="queryLabel">iPhone 15 128GB</b>»</span>
        </div>
        <div class="live"><span class="dot"></span>обновлено 2 мин назад</div>
        <div class="filters">
          <button class="filter active" type="button">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M3 6h18M6 12h12M10 18h4"/>
            </svg>
            Сначала дешёвые
          </button>
          <button class="filter" type="button">В наличии</button>
          <button class="filter" type="button">Рейтинг 4+</button>
        </div>
      </div>
    </div>
  `}let H=null;function Jt({outlet:t}){H&&(H(),H=null),t.innerHTML=`
    ${Xt()}
    ${Kt()}
    <div class="container">
      <div class="results" id="cards">
        ${yt(3)}
      </div>
    </div>
  `,setTimeout(()=>{const s=document.getElementById("cards");s&&(s.innerHTML=gt(D)),Zt()},400)}function Zt(){const t=document.getElementById("searchInput"),s=document.getElementById("searchDropdown"),e=document.getElementById("searchBtn"),a=document.getElementById("cards"),n=document.getElementById("queryLabel");if(!t||!s||!a)return;const i=()=>s.classList.add("open"),o=()=>s.classList.remove("open"),r=()=>i(),p=v=>{v.target.closest(".search-wrap")||o()},d=v=>{const h=v.target.closest(".dd-item");h&&(t.value=h.dataset.value,n&&(n.textContent=h.dataset.value),o())},c=()=>o(),u=v=>{v.key==="Enter"&&o(),v.key==="Escape"&&o()},b=v=>{const h=v.target.closest('[data-action="toggle-chart"]');if(h){const E=h.closest(".card")?.querySelector(".chart");if(!E)return;E.classList.toggle("open"),h.textContent=E.classList.contains("open")?"Скрыть историю":"История цен";return}const B=v.target.closest('[data-action="compare-card"]');if(B){const E=B.closest(".card"),Lt=Number(E.dataset.id),Z=K(Lt);Z&&$t(Z)}};t.addEventListener("focus",r),document.addEventListener("click",p),s.addEventListener("click",d),e.addEventListener("click",c),t.addEventListener("keydown",u),a.addEventListener("click",b);const m=document.querySelectorAll(".chip"),g=[];m.forEach(v=>{const h=()=>{t.value=v.textContent.trim(),n&&(n.textContent=t.value)};v.addEventListener("click",h),g.push([v,h])});const $=document.querySelectorAll(".filter"),J=[];$.forEach(v=>{const h=()=>{$.forEach(B=>B.classList.remove("active")),v.classList.add("active")};v.addEventListener("click",h),J.push([v,h])}),H=()=>{t.removeEventListener("focus",r),document.removeEventListener("click",p),s.removeEventListener("click",d),e.removeEventListener("click",c),t.removeEventListener("keydown",u),a.removeEventListener("click",b),g.forEach(([v,h])=>v.removeEventListener("click",h)),J.forEach(([v,h])=>v.removeEventListener("click",h))}}function Qt(t){const s=t.gallery[0],e=t.gallery.map((a,n)=>`
    <button class="gallery-thumb ${n===0?"active":""}" data-idx="${n}" type="button">
      ${a}
    </button>
  `).join("");return`
    <div class="gallery">
      <div class="gallery-main" id="galleryMain">
        ${t.inStock?'<span class="thumb-badge">В наличии</span>':""}
        ${s}
      </div>
      <div class="gallery-thumbs">${e}</div>
    </div>
  `}function te(t){const e=T(t)[0],a=L[e.mp];return`
    <div class="best-offer">
      <div class="best-offer-label">★ Лучшая цена</div>
      <div class="best-offer-row">
        <span class="mp mp-${e.mp}">
          <span class="mp-logo">${a.short}</span>
          ${a.name}
        </span>
        <span class="price tabular">${f(e.price)}</span>
      </div>
      <button class="btn btn-primary" type="button">Перейти в ${a.name}</button>
    </div>
  `}function ee(t){return T(t).map(e=>{const a=L[e.mp];return`
      <div class="offer-row">
        <span class="mp mp-${e.mp}">
          <span class="mp-logo">${a.short}</span>
          ${a.name}
        </span>
        <span class="delivery">${e.delivery||""} · ${e.seller||""}</span>
        <span class="price tabular">${f(e.price)}</span>
        <button class="btn btn-ghost" type="button">Открыть</button>
      </div>
    `}).join("")}function se(t){return Object.entries(t).map(([s,e])=>`
    <div class="spec-row">
      <span class="key">${s}</span>
      <span class="val">${e}</span>
    </div>
  `).join("")}function ne(){return`
    <div class="product">
      <div class="skeleton-box" style="height:14px;width:280px;margin-bottom:20px"></div>
      <div class="product-grid">
        <div>
          <div class="skeleton-box" style="aspect-ratio:1;border-radius:var(--radius)"></div>
          <div style="display:flex;gap:8px;margin-top:12px">
            ${Array.from({length:4},()=>'<div class="skeleton-box" style="width:68px;height:68px;border-radius:12px"></div>').join("")}
          </div>
        </div>
        <div>
          <div class="skeleton-box" style="height:26px;width:90%;margin-bottom:12px"></div>
          <div class="skeleton-box" style="height:26px;width:60%;margin-bottom:20px"></div>
          <div class="skeleton-box" style="height:14px;width:70%;margin-bottom:24px"></div>
          <div class="skeleton-box" style="height:130px;border-radius:14px;margin-bottom:20px"></div>
          <div class="skeleton-box" style="height:50px;border-radius:12px;margin-bottom:8px"></div>
          <div class="skeleton-box" style="height:50px;border-radius:12px;margin-bottom:8px"></div>
          <div class="skeleton-box" style="height:50px;border-radius:12px"></div>
        </div>
      </div>
    </div>
  `}let O=null;function ie({outlet:t,params:s}){O&&(O(),O=null),t.innerHTML=ne(),setTimeout(()=>{const e=K(s.id);if(!e||!e.specs){q(async()=>{const{render:a}=await import("./not-found-DA8OlcH4.js");return{render:a}},[],import.meta.url).then(({render:a})=>{a({outlet:t,params:{},path:s.id})});return}t.innerHTML=`
      <div class="product">
        <div class="breadcrumbs">
          <a href="#/" data-link>Поиск</a>
          <span class="sep">/</span>
          <span>Смартфоны</span>
          <span class="sep">/</span>
          <span>${e.title}</span>
        </div>

        <div class="product-grid">
          <div>${Qt(e)}</div>

          <div class="product-info">
            <h1>${e.title}</h1>
            <div class="product-meta">
              <span class="star">★ ${e.rating}</span>
              <span>${mt(e.reviews)} отзывов</span>
              ${e.inStock?'<span class="stock">В наличии</span>':""}
              <span>Артикул: APL-${e.id}0001</span>
            </div>

            ${te(e.offers)}

            <div class="all-offers-title">
              Все предложения (${e.offers.length})
            </div>
            <div class="all-offers">${ee(e.offers)}</div>

            <div class="product-actions">
              <button class="btn btn-primary" data-action="compare" type="button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path d="M3 6h18M6 12h12M10 18h4"/>
                </svg>
                Сравнить
              </button>
              <button class="btn btn-ghost" data-action="track" type="button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                  <path d="M10 21a2 2 0 0 0 4 0"/>
                </svg>
                Отслеживать
              </button>
            </div>
          </div>
        </div>

        <div class="specs">
          <h2>Характеристики</h2>
          <div class="specs-grid">${se(e.specs)}</div>
        </div>

        <div class="price-history">
          <div class="price-history-head">
            <h2>История цены</h2>
            <div class="period-tabs">
              <button class="period-tab active" type="button">30 дней</button>
              <button class="period-tab" type="button">90 дней</button>
              <button class="period-tab" type="button">Год</button>
            </div>
          </div>
          <div class="price-history-chart">
            ${ft(e.history)}
          </div>
        </div>
      </div>
    `,ae(e)},400)}function ae(t){const s=document.querySelectorAll(".gallery-thumb"),e=[];s.forEach(d=>{const c=()=>{s.forEach(m=>m.classList.remove("active")),d.classList.add("active");const u=Number(d.dataset.idx),b=document.getElementById("galleryMain");b&&(b.innerHTML=`
          ${t.inStock?'<span class="thumb-badge">В наличии</span>':""}
          ${t.gallery[u]}
        `)};d.addEventListener("click",c),e.push([d,c])});const a=document.querySelectorAll(".period-tab"),n=[];a.forEach(d=>{const c=()=>{a.forEach(u=>u.classList.remove("active")),d.classList.add("active")};d.addEventListener("click",c),n.push([d,c])});const i=document.querySelector('[data-action="compare"]'),o=()=>$t(t);i&&i.addEventListener("click",o);const r=document.querySelector('[data-action="track"]');let p=null;r&&(p=()=>{const d=r.classList.toggle("btn-primary");r.classList.toggle("btn-ghost",!d),r.innerHTML=d?"★ Отслеживается":`<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round">
             <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
             <path d="M10 21a2 2 0 0 0 4 0"/>
           </svg> Отслеживать`,y(d?"Добавлено в отслеживаемые":"Убрано из отслеживаемых")},r.addEventListener("click",p)),O=()=>{e.forEach(([d,c])=>d.removeEventListener("click",c)),n.forEach(([d,c])=>d.removeEventListener("click",c)),i&&i.removeEventListener("click",o),r&&p&&r.removeEventListener("click",p)}}const wt="notif-settings",G={threshold:10,channels:{push:!0,email:!0,telegram:!1}};function oe(){const t=k.get(wt);return t&&typeof t=="object"?{threshold:t.threshold??G.threshold,channels:{...G.channels,...t.channels||{}}}:JSON.parse(JSON.stringify(G))}function re(t){k.set(wt,t)}function ce(t){const e=[5,10,15,20].map(i=>`
    <button class="threshold-tab ${i===t.threshold?"active":""}"
            data-threshold="${i}" type="button">
      <div class="pct">${i}%</div>
      <div class="label">${i===5?"мин.":i===20?"макс.":""}</div>
    </button>
  `).join(""),n=[{id:"push",icon:"🔔",name:"Push-уведомления",desc:"В браузере, если открыт сайт"},{id:"email",icon:"📧",name:"Email",desc:"Письмо на привязанную почту"},{id:"telegram",icon:"✈️",name:"Telegram",desc:"Сообщение в боте @cenomer_bot"}].map(i=>`
    <label class="channel">
      <span class="channel-icon">${i.icon}</span>
      <span class="channel-info">
        <span class="name">${i.name}</span>
        <span class="desc">${i.desc}</span>
      </span>
      <button class="toggle ${t.channels[i.id]?"on":""}"
              data-channel="${i.id}" type="button"
              aria-label="Переключить ${i.name}"></button>
    </label>
  `).join("");return`
    <div class="modal-header">
      <div>
        <h2>Уведомления</h2>
        <div class="sub">Настроим, когда и как сообщать о снижении цены</div>
      </div>
      <button class="modal-close" data-modal-close type="button" aria-label="Закрыть">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <div class="modal-body">
      <div class="notif-section">
        <div class="notif-section-head">
          <div>
            <h3>Порог снижения цены</h3>
            <p>Уведомим, если цена упадёт на выбранный процент или больше</p>
          </div>
        </div>
        <div class="threshold-tabs" id="thresholdTabs">${e}</div>
        <div class="threshold-hint">
          <span class="icon">💡</span>
          <span>Чем ниже порог, тем больше уведомлений. Оптимально — 10%.</span>
        </div>
      </div>

      <div class="notif-section">
        <div class="notif-section-head">
          <div>
            <h3>Каналы доставки</h3>
            <p>Выберите, куда присылать уведомления</p>
          </div>
        </div>
        <div class="channel-list" id="channelList">${n}</div>
      </div>
    </div>

    <div class="modal-footer">
      <button class="btn btn-ghost" data-modal-close type="button">Отмена</button>
      <button class="btn btn-primary" id="notifSave" type="button">Сохранить</button>
    </div>
  `}function xt(){const t=oe(),{overlay:s,close:e}=kt(ce(t)),a=s.querySelectorAll(".threshold-tab");a.forEach(i=>{i.addEventListener("click",()=>{a.forEach(o=>o.classList.remove("active")),i.classList.add("active"),t.threshold=Number(i.dataset.threshold)})}),s.querySelectorAll("[data-channel]").forEach(i=>{i.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation();const r=i.dataset.channel;t.channels[r]=!t.channels[r],i.classList.toggle("on",t.channels[r])})}),s.querySelector("#notifSave").addEventListener("click",()=>{re(t),e(),y("Настройки уведомлений сохранены")})}function W(t,s,e,a=""){return`
    <div class="stat-card">
      <div class="stat-label">${t}</div>
      <div class="stat-value ${a} tabular">${s}</div>
      ${e?`<div class="stat-sub">${e}</div>`:""}
    </div>
  `}function de(t){const s=t.currentPrice-t.startPrice,e=Math.round(Math.abs(s)/t.startPrice*100);return s<0?{cls:"down",icon:"↓",text:`−${f(Math.abs(s))} · ${e}%`,sparkCls:"",hasChange:!0}:s>0?{cls:"up",icon:"↑",text:`+${f(s)} · ${e}%`,sparkCls:"up",hasChange:!0}:{cls:"flat",icon:"—",text:"Без изменений",sparkCls:"flat",hasChange:!1}}function le(t,s){const e=de(t),a=e.cls==="down";return`
    <div class="tracked-item" data-id="${t.id}"
         style="animation-delay:${s*40}ms">
      <div class="tracked-thumb">${t.emoji}</div>

      <div class="tracked-info">
        <h3>${t.title}</h3>
        <div class="tracked-meta">
          ${t.tags.map(n=>`<span class="tag">${n}</span>`).join("")}
        </div>
      </div>

      ${Gt(t.history,e.sparkCls)}

      <div class="tracked-price">
        <div class="now tabular">${f(t.currentPrice)}</div>
        <div class="change ${e.cls}">
          ${e.icon} ${e.text}
        </div>
        ${a?`<div class="was tabular">${f(t.startPrice)}</div>`:""}
      </div>

      <div class="tracked-actions">
        <button class="toggle on" data-action="toggle" type="button" aria-label="Уведомления"></button>
        <button class="icon-btn" data-action="open" type="button" title="Открыть товар">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
        <button class="icon-btn" data-action="remove" type="button" title="Удалить">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  `}function ve(){return`
    <div class="empty-state">
      <div class="icon">🔔</div>
      <h2>Пока ничего не отслеживается</h2>
      <p>Добавляйте товары в отслеживание — мы будем следить за ценой и пришлём уведомление, когда она упадёт.</p>
      <a href="#/" data-link class="btn btn-primary">Найти товары →</a>
    </div>
  `}function pe(t=3){return Array.from({length:t},()=>`
    <div class="tracked-item" style="animation:none">
      <div class="skeleton-box" style="width:80px;height:80px;border-radius:12px"></div>
      <div>
        <div class="skeleton-box" style="height:16px;width:70%;margin-bottom:8px"></div>
        <div class="skeleton-box" style="height:12px;width:40%"></div>
      </div>
      <div class="skeleton-box" style="width:90px;height:36px;border-radius:8px"></div>
      <div>
        <div class="skeleton-box" style="height:20px;width:100px;margin-bottom:6px"></div>
        <div class="skeleton-box" style="height:14px;width:70px"></div>
      </div>
    </div>
  `).join("")}let j=null;function ue({outlet:t}){j&&(j(),j=null),t.innerHTML=`
    <div class="tracking">
      <div class="tracking-head">
        <div class="tracking-title">
          <div class="skeleton-box" style="height:32px;width:220px;margin-bottom:8px"></div>
          <div class="skeleton-box" style="height:16px;width:300px"></div>
        </div>
      </div>
      <div class="tracking-stats">
        ${Array.from({length:3},()=>'<div class="skeleton-box" style="height:100px;border-radius:14px"></div>').join("")}
      </div>
      <div class="tracked-list">${pe(3)}</div>
    </div>
  `,setTimeout(()=>{const s=ut||[],e=s.length===0;let a=0,n=0,i=0;s.forEach(o=>{const r=o.currentPrice-o.startPrice;r<0?(a+=Math.abs(r),n++):r>0&&i++}),t.innerHTML=`
      <div class="tracking">
        <div class="tracking-head">
          <div class="tracking-title">
            <h1>Отслеживаемые</h1>
            <p>${s.length} ${z(s.length,"товар","товара","товаров")} · уведомления при снижении цены</p>
          </div>
          <button class="btn btn-primary" ${e?'disabled style="opacity:0.5;pointer-events:none"':""} type="button">
            + Добавить товар
          </button>
        </div>

        ${e?"":`
          <div class="tracking-stats">
            ${W("Активных",s.length,"товаров отслеживается")}
            ${W("Экономия",f(a),`${n} ${z(n,"товар","товара","товаров")} подешевел`,"down")}
            ${W("Подорожало",i,i===0?"всё стабильно":`${i} ${z(i,"товар","товара","товаров")}`,i>0?"up":"")}
          </div>

          <div class="notify-banner">
            <span class="bell">🔔</span>
            <div class="text">
              <b>Уведомления включены</b> — пришлём, когда цена упадёт больше чем на 5%.
            </div>
            <button class="btn btn-ghost" id="openNotifSettings" type="button">Настроить</button>
          </div>
        `}

        <div class="tracked-list" id="trackedList">
          ${e?ve():s.map(le).join("")}
        </div>
      </div>
    `,e||he()},400)}function he(){const t=document.getElementById("trackedList");if(!t)return;const s=n=>{const i=n.target.closest(".tracked-item");if(!i)return;const o=n.target.closest('[data-action="toggle"]');if(o){o.classList.toggle("on");return}if(n.target.closest('[data-action="remove"]')){i.style.transition="all 0.3s",i.style.opacity="0",i.style.transform="translateX(-20px)",setTimeout(()=>i.remove(),300);return}n.target.closest('[data-action="open"]')&&dt("/product/"+i.dataset.id)};t.addEventListener("click",s);const e=document.getElementById("openNotifSettings"),a=()=>xt();e&&e.addEventListener("click",a),j=()=>{t.removeEventListener("click",s),e&&e.removeEventListener("click",a)}}const S={name:"Иван Петров",email:"ivan@example.com",initials:"ИП",trackedCount:3,historyCount:47},ot=[{query:"iPhone 15 128GB",emoji:"📱",count:12,when:"2 часа назад"},{query:"PlayStation 5 Slim",emoji:"🎮",count:8,when:"вчера"},{query:"Dyson V15 Detect",emoji:"🧹",count:5,when:"3 дня назад"},{query:'MacBook Air M3 13"',emoji:"💻",count:4,when:"5 дней назад"},{query:"Samsung Galaxy S24",emoji:"📱",count:3,when:"неделю назад"}];function me(){return`
    <div class="profile-head">
      <div class="profile-avatar">${S.initials}</div>
      <div class="profile-info">
        <h1>${S.name}</h1>
        <div class="email">${S.email}</div>
        <div class="stats">
          <span class="stat"><b>${S.trackedCount}</b> отслеживается</span>
          <span class="stat"><b>${S.historyCount}</b> запросов</span>
        </div>
      </div>
    </div>
  `}function be(){return`
    <div class="profile-section">
      <h2>Настройки</h2>
      <div class="settings-list">${[{icon:"🔔",name:"Уведомления",desc:"Порог снижения цены, каналы",action:"notifications"},{icon:"🎨",name:"Оформление",desc:"Тема, язык",action:"theme"},{icon:"🔒",name:"Безопасность",desc:"Пароль, привязанные сервисы",action:"security"},{icon:"📤",name:"Экспорт данных",desc:"Скачать историю и отслеживаемые",action:"export"}].map(e=>`
    <div class="setting-row" data-action="${e.action}">
      <div class="setting-icon">${e.icon}</div>
      <div class="setting-text">
        <div class="name">${e.name}</div>
        <div class="desc">${e.desc}</div>
      </div>
      <svg class="setting-arrow" width="16" height="16" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </div>
  `).join("")}</div>
    </div>
  `}function fe(){return ot.length===0?`
      <div class="profile-section">
        <h2>История поиска</h2>
        <div class="history-list" style="padding:32px;text-align:center;color:var(--text-2)">
          Пока ничего не искали
        </div>
      </div>
    `:`
    <div class="profile-section">
      <h2>История поиска</h2>
      <div class="history-list">${ot.map(s=>`
    <div class="history-row" data-query="${s.query}">
      <div class="history-icon">${s.emoji}</div>
      <div class="history-text">
        <div class="query">${s.query}</div>
        <div class="meta">${s.when}</div>
      </div>
      <span class="history-count">${s.count} раз</span>
    </div>
  `).join("")}</div>
    </div>
  `}function ge(){return`
    <div class="profile-section">
      <h2>Аккаунт</h2>
      <div class="settings-list">
        <div class="setting-row" data-action="logout">
          <div class="setting-icon">🚪</div>
          <div class="setting-text">
            <div class="name">Выйти из аккаунта</div>
            <div class="desc">Данные сохранятся в облаке</div>
          </div>
          <svg class="setting-arrow" width="16" height="16" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
        <div class="setting-row" data-action="delete">
          <div class="setting-icon">🗑️</div>
          <div class="setting-text">
            <div class="name" style="color:var(--danger)">Удалить аккаунт</div>
            <div class="desc">Безвозвратно. Все данные будут удалены.</div>
          </div>
          <svg class="setting-arrow" width="16" height="16" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
               style="color:var(--danger)">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
      </div>
    </div>
  `}let I=null;function ye({outlet:t}){I&&(I(),I=null),t.innerHTML=`
    <div class="profile">
      ${me()}
      ${be()}
      ${fe()}
      ${ge()}
    </div>
  `,ke()}function ke(){const t=document.querySelector(".profile");if(!t)return;const s=e=>{const a=e.target.closest(".setting-row");if(a){$e(a.dataset.action);return}const n=e.target.closest(".history-row");n&&y(`Поиск: ${n.dataset.query} (демо)`)};t.addEventListener("click",s),I=()=>{t.removeEventListener("click",s)}}function $e(t){switch(t){case"notifications":xt();break;case"theme":{const s=Tt();y(s==="dark"?"Тёмная тема":"Светлая тема");break}case"security":y("Раздел в разработке");break;case"export":y("Экспорт данных (демо)");break;case"logout":y("Выход из аккаунта (демо)");break;case"delete":y("Удаление аккаунта (демо)");break}}_("/",Jt);_("/product/:id",ie);_("/tracking",ue);_("/profile",ye);function we(){document.addEventListener("click",e=>{const a=e.target.closest("[data-link]");if(!a)return;const n=a.getAttribute("href");n&&n.startsWith("#")&&(e.preventDefault(),dt(n.slice(1)))}),window.addEventListener("scroll",()=>{const e=document.getElementById("toolbar");e&&e.classList.toggle("scrolled",window.scrollY>40)},{passive:!0});const t=document.getElementById("resetOnboarding");t&&t.addEventListener("click",()=>{Rt(),vt()});const s=document.getElementById("demoToggle");s&&s.addEventListener("click",()=>{const e=document.getElementById("cards");if(!e)return;s.classList.toggle("on")&&q(async()=>{const{skeletonsHTML:n,productsHTML:i}=await Promise.resolve().then(()=>Yt);return{skeletonsHTML:n,productsHTML:i}},void 0,import.meta.url).then(({skeletonsHTML:n,productsHTML:i})=>{q(async()=>{const{PRODUCTS:o}=await Promise.resolve().then(()=>zt);return{PRODUCTS:o}},void 0,import.meta.url).then(({PRODUCTS:o})=>{e.innerHTML=n(3),setTimeout(()=>{e.innerHTML=i(o),s.classList.remove("on")},1800)})})})}function rt(){Mt();const t=document.getElementById("app");if(!t){console.error("[main] #app not found");return}Ht(t),we(),Nt()&&vt(),console.log("[Cenomer] booted — full ES-modules, Vite ✨")}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",rt):rt();
