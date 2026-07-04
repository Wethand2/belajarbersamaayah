// ====== MANIPULATIF DIGITAL (Benda Geser) — Fase 1 ======
// Objek virtual yang bisa digeser anak ke kotak kelompok (pointer events: jalan di HP & desktop).
window.MP = (function(){
  const TERBILANG = {1:"SATU",2:"DUA",3:"TIGA",4:"EMPAT",5:"LIMA",6:"ENAM",7:"TUJUH",8:"DELAPAN",9:"SEMBILAN",10:"SEPULUH"};

  // Konfigurasi per misi
  window.MP_CONFIG = {
    "1.1": { objek:"🔵", pilihan:["🔵","🔘","🍬","🍪"], nObjek:12, kotakAwal:2, min:2, max:6, label:"Kelompok", cariCara:true,
             petunjuk:"Geser semua kelereng ke kotak sampai isinya SAMA BANYAK. Coba temukan beberapa cara!" },
    "1.2": { objek:"🥄", pilihan:["🥄","🍬","🔵"], nObjek:15, kotakAwal:3, min:2, max:5, label:"Piring", berulang:true,
             petunjuk:"Isi 3 piring, masing-masing 5 sendok. Lihat kalimat penjumlahannya muncul!" },
    "1.3": { objek:"🔘", pilihan:["🔘","🔵","🍬"], nObjek:12, kotakAwal:4, min:2, max:6, label:"Kelompok", bahasa:true,
             petunjuk:"Buat 4 kelompok isi 3, lalu ucapkan kalimat perkaliannya bersama!" },
    "1.5": { objek:"🔘", pilihan:["🔘","🔵","🍬"], nObjek:15, kotakAwal:3, min:2, max:6, label:"Baris", baris:true,
             petunjuk:"Setiap kotak = satu BARIS. Isi semua baris sama banyak seperti barisan upacara!" },
    "1.6": { objek:"🍬", pilihan:["🍬","🔵","🍪"], nObjek:8, kotakAwal:4, min:2, max:6, label:"Piring", nolSatu:true,
             petunjuk:"Isi setiap piring 1 permen — lalu kosongkan semua dan lihat apa yang terjadi!" }
  };

  let cfg = null, wadah = null, caraDitemukan = null;

  function mount(levelId, kontainer){
    cfg = MP_CONFIG[levelId]; wadah = kontainer; caraDitemukan = new Set();
    kontainer.innerHTML = `
      <p class="small">🖐️ ${cfg.petunjuk}</p>
      <div class="mp-toolbar">
        <span class="small"><b>Benda:</b></span>
        ${cfg.pilihan.map(e=>`<button class="mp-pick" onclick="MP.gantiObjek('${e}')">${e}</button>`).join("")}
        <span style="flex:1"></span>
        <button class="btn btn-ghost btn-sm" onclick="MP.aturKotak(-1)">➖ ${cfg.label}</button>
        <button class="btn btn-ghost btn-sm" onclick="MP.aturKotak(1)">➕ ${cfg.label}</button>
      </div>
      <div class="mp-pool mp-isi" id="mp-pool"></div>
      <div class="mp-boxes" id="mp-boxes"></div>
      <div id="mp-fb"></div>
      ${cfg.cariCara?'<div id="mp-cara" class="mp-cara"></div>':""}`;
    const pool = kontainer.querySelector("#mp-pool");
    for(let i=0;i<cfg.nObjek;i++) pool.appendChild(buatObjek(cfg.objek));
    for(let i=0;i<cfg.kotakAwal;i++) tambahKotak();
    update();
  }

  function buatObjek(emoji){
    const o = document.createElement("div");
    o.className = "mp-obj"; o.textContent = emoji;
    o.addEventListener("pointerdown", mulaiDrag);
    return o;
  }

  function mulaiDrag(e){
    e.preventDefault();
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    const r = el.getBoundingClientRect();
    const ofX = e.clientX - r.left, ofY = e.clientY - r.top;
    // placeholder agar layout tidak melompat
    const ph = document.createElement("div");
    ph.className = "mp-obj mp-ph";
    el.parentNode.insertBefore(ph, el);
    el.classList.add("mp-drag");
    document.body.appendChild(el);
    el.style.left = (e.clientX-ofX)+"px"; el.style.top = (e.clientY-ofY)+"px";

    const move = ev => { el.style.left = (ev.clientX-ofX)+"px"; el.style.top = (ev.clientY-ofY)+"px"; };
    const up = ev => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.classList.remove("mp-drag");
      el.style.left = el.style.top = "";
      el.style.visibility = "hidden";
      const target = document.elementFromPoint(ev.clientX, ev.clientY);
      el.style.visibility = "";
      const drop = target && target.closest(".mp-isi");
      (drop || ph.parentNode).insertBefore(el, drop ? null : ph);
      ph.remove();
      update();
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
  }

  function tambahKotak(){
    const boxes = wadah.querySelector("#mp-boxes");
    const b = document.createElement("div");
    b.className = "mp-box";
    b.innerHTML = `<div class="mp-count">${cfg.label} · isi 0</div><div class="mp-isi mp-box-isi"></div>`;
    boxes.appendChild(b);
  }
  function aturKotak(delta){
    const boxes = [...wadah.querySelectorAll(".mp-box")];
    if(delta>0 && boxes.length < cfg.max) tambahKotak();
    if(delta<0 && boxes.length > cfg.min){
      const akhir = boxes[boxes.length-1];
      const pool = wadah.querySelector("#mp-pool");
      [...akhir.querySelectorAll(".mp-obj")].forEach(o=>pool.appendChild(o));
      akhir.remove();
    }
    update();
  }
  function gantiObjek(emoji){
    cfg.objek = emoji;
    wadah.querySelectorAll(".mp-obj:not(.mp-ph)").forEach(o=>o.textContent=emoji);
  }

  function update(){
    if(!wadah) return;
    const boxes = [...wadah.querySelectorAll(".mp-box")];
    const isi = boxes.map(b=>{
      const n = b.querySelectorAll(".mp-obj").length;
      b.querySelector(".mp-count").textContent = `${cfg.label} · isi ${n}`;
      b.classList.toggle("mp-penuh", n>0);
      return n;
    });
    const sisaPool = wadah.querySelectorAll("#mp-pool .mp-obj").length;
    const fb = wadah.querySelector("#mp-fb");
    const a = isi.length, b = isi[0];
    const sama = isi.every(n=>n===b);
    const total = a*b;

    // Misi 1.6: nilai kondisi apa pun asal sama (termasuk 0)
    if(cfg.nolSatu && sama){
      fb.innerHTML = `<div class="feedback good">✨ ${a} piring isi ${b} → <b>${a} × ${b} = ${total}</b>${b===0?" — piring kosong semua, hasilnya NOL!":""}</div>`;
      return;
    }
    if(sisaPool>0){
      fb.innerHTML = `<div class="feedback help">Masih ada <b>${sisaPool}</b> benda di atas — geser semuanya ke ${cfg.label.toLowerCase()}!</div>`;
      return;
    }
    if(!sama || b===0){
      fb.innerHTML = `<div class="feedback help">Belum sama banyak: isi tiap ${cfg.label.toLowerCase()} = ${isi.join(", ")}. Geser lagi supaya SAMA!</div>`;
      return;
    }
    // Semua benda terpakai & sama banyak 🎉
    let kalimat = `🎉 <b>${a} ${cfg.label.toLowerCase()} isi ${b} — SAMA BANYAK!</b><br>${a} × ${b} = ${total}`;
    if(cfg.berulang) kalimat = `🎉 ${Array(a).fill(b).join(" + ")} = ${total}<br><b>${a} × ${b} = ${total}</b>`;
    if(cfg.bahasa)   kalimat = `🎉 Ucapkan: <b>"${TERBILANG[a]||a} KALI ${TERBILANG[b]||b}"</b><br>${a} kelompok isi ${b} → ${a} × ${b} = ${total}`;
    if(cfg.baris)    kalimat = `🎉 <b>${a} baris isi ${b} → ${a} × ${b} = ${total}</b><br>Kalau diputar: ${b} baris isi ${a} → ${b} × ${a} = tetap ${total}!`;
    fb.innerHTML = `<div class="feedback good">${kalimat}</div>`;

    if(cfg.cariCara){
      caraDitemukan.add(`${a} × ${b}`);
      wadah.querySelector("#mp-cara").innerHTML =
        `<p class="small"><b>Cara yang sudah kamu temukan (${caraDitemukan.size}):</b></p>
         <div class="box-badges">${[...caraDitemukan].map(c=>`<span class="box-badge on">${c} ✔</span>`).join("")}</div>
         ${caraDitemukan.size<3?'<p class="small">Coba ubah jumlah kotak (➕/➖) lalu susun ulang — masih ada cara lain!</p>':'<p class="small">🌟 Hebat, penjelajah perkalian!</p>'}`;
    }
  }

  return { mount, aturKotak, gantiObjek, update };
})();
