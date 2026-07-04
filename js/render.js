// ====== RENDER VISUAL ======
window.R = (function(){
  const el = (html) => { const d=document.createElement("div"); d.innerHTML=html.trim(); return d.firstChild; };

  function kelompokVisual(a,b,emoji,samar){
    let g = `<div class="groups-area${samar?' faded':''}">`;
    for(let i=0;i<a;i++){
      g += `<div class="group-box">` + `<span class="item">${emoji}</span>`.repeat(b) + `</div>`;
    }
    return g + `</div>`;
  }

  function arrayVisual(a,b,opts={}){
    const id = "arr" + Math.random().toString(36).slice(2,7);
    let dots = "";
    for(let i=0;i<a*b;i++) dots += `<div class="array-dot"></div>`;
    const putar = opts.bisaPutar ? `<div><button class="btn btn-ghost btn-sm" onclick="R.putarArray('${id}',${a},${b})">🔄 Putar Array</button></div>` : "";
    return `<div class="array-wrap${opts.samar?' faded':''}" id="w${id}">
      <div class="array-area" id="${id}" data-a="${a}" data-b="${b}" style="grid-template-columns:repeat(${b},22px)">${dots}</div>
      <div class="small" id="lbl${id}">${a} baris × ${b} kolom</div>${putar}
    </div>`;
  }
  function putarArray(id){
    const g = document.getElementById(id);
    const a = +g.dataset.a, b = +g.dataset.b;
    g.dataset.a = b; g.dataset.b = a;
    g.style.gridTemplateColumns = `repeat(${a},22px)`;
    document.getElementById("lbl"+id).innerHTML =
      `${b} baris × ${a} kolom — <b style="color:var(--success)">jumlahnya tetap ${a*b}!</b>`;
  }
  function tampilkanArraySamar(btn){
    const w = btn.closest(".card").querySelector(".array-wrap");
    if(w){ w.classList.remove("faded"); btn.disabled = true; }
    if(window._sesi) window._sesi.pakaiBantuan = true;
  }

  function garisLompat(b,n){
    const maxV = b*n, w=480, h=110, pad=24;
    const x = v => pad + (v/maxV)*(w-2*pad);
    let ticks="", hops="";
    for(let v=0; v<=maxV; v+=b){
      ticks += `<line x1="${x(v)}" y1="70" x2="${x(v)}" y2="80" stroke="#5A6B94" stroke-width="2"/>
                <text x="${x(v)}" y="98" font-size="13" text-anchor="middle" fill="#1D2B50" font-weight="bold">${v===maxV?"?":v}</text>`;
    }
    for(let i=0;i<n;i++){
      const x1=x(i*b), x2=x((i+1)*b), mx=(x1+x2)/2;
      hops += `<path d="M ${x1} 72 Q ${mx} ${20} ${x2} 72" fill="none" stroke="#FF9F43" stroke-width="3"/>`;
    }
    return `<svg class="numline" viewBox="0 0 ${w} ${h}">
      <line x1="${pad-8}" y1="75" x2="${w-pad+8}" y2="75" stroke="#1D2B50" stroke-width="3"/>
      ${ticks}${hops}
      <text x="${x(0)+6}" y="30" font-size="20">🐇</text>
    </svg>`;
  }

  function heatmap(){
    let h = `<div class="heatmap"><div class="hcell hhead">×</div>`;
    for(let b=1;b<=10;b++) h += `<div class="hcell hhead">${b}</div>`;
    for(let a=1;a<=10;a++){
      h += `<div class="hcell hhead">${a}</div>`;
      for(let b=1;b<=10;b++){
        const lv = State.selKuasai(a,b);
        h += `<div class="hcell ${lv===2?'lit2':lv===1?'lit1':''}">${lv===2?a*b:""}</div>`;
      }
    }
    return h + `</div><p class="small center">Sel menyala = fakta yang sudah kamu kuasai ✨</p>`;
  }

  function keypad(onOk){
    window._kpVal = "";
    const tekan = (k) => {
      if(k==="ok"){ if(window._kpVal!=="") onOk(parseInt(window._kpVal,10)); return; }
      if(k==="del"){ window._kpVal = window._kpVal.slice(0,-1); }
      else if(window._kpVal.length<3){ window._kpVal += k; }
      document.getElementById("kp-disp").textContent = window._kpVal || "‥";
    };
    window._kpTekan = tekan;
    const key = (v,cls="",lbl=v) => `<button class="key ${cls}" onclick="_kpTekan('${v}')">${lbl}</button>`;
    return `<div class="answer-display" id="kp-disp">‥</div>
      <div class="keypad">
        ${[1,2,3,4,5,6,7,8,9].map(n=>key(n)).join("")}
        ${key("del","key-del","⌫")}${key(0)}${key("ok","key-ok","OK")}
      </div>`;
  }

  function progressBar(i, total){
    return `<div class="progress-wrap"><div class="progress-bar" style="width:${Math.round(i/total*100)}%"></div></div>`;
  }

  function toast(msg){
    const t = document.getElementById("toast");
    t.textContent = msg; t.classList.remove("hidden");
    clearTimeout(t._h); t._h = setTimeout(()=>t.classList.add("hidden"), 2600);
  }

  function konfeti(){
    const c = document.getElementById("confetti");
    if(matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    c.classList.remove("hidden"); c.innerHTML="";
    const warna = ["#FF9F43","#3B63D8","#2FB673","#FFD34D","#E05B5B","#9B5BE0"];
    for(let i=0;i<70;i++){
      const s = document.createElement("i");
      s.style.left = Math.random()*100+"vw";
      s.style.background = warna[i%warna.length];
      s.style.animationDuration = (2+Math.random()*2)+"s";
      s.style.animationDelay = (Math.random()*0.8)+"s";
      c.appendChild(s);
    }
    setTimeout(()=>c.classList.add("hidden"), 4500);
  }

  return { el, kelompokVisual, arrayVisual, putarArray, tampilkanArraySamar, garisLompat, heatmap, keypad, progressBar, toast, konfeti };
})();
