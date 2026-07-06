// ====== ALAT PERAGA DIGITAL — MODUL PENJUMLAHAN ======
// 1) Widget interaktif per MISI Fase A1 (padanan MP "Benda Geser" perkalian,
//    tapi berbasis KETUK — cocok untuk anak kelas 1-2 di HP).
// 2) Alat bantu DADU/KARTU TITIK untuk sesi Fase A2 (dua dadu, menyesuaikan
//    soal; memakai bantuan = bintang soal itu tidak diberikan, seperti
//    tombol "Lihat Gambar" pada perkalian).
// Muat SEBELUM modul-tambah.js.
window.MPT = (function(){
  const rnd = (lo,hi) => lo + Math.floor(Math.random()*(hi-lo+1));
  const el = id => document.getElementById(id);
  const acak = arr => arr.slice().sort(()=>Math.random()-.5);

  // ---------- DADU / KARTU TITIK (1-10) ----------
  const PIP6 = {1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};
  function dadu(n){
    if(n==="?") return `<div style="width:64px;height:64px;border:3px solid #1D2B50;border-radius:12px;
      display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:800;background:#FFF3C4">?</div>`;
    if(typeof n !== "number") return "";
    if(n<=6){
      const cells = Array.from({length:9},(_,i)=>
        `<div style="width:13px;height:13px;border-radius:50%;background:${PIP6[n].includes(i)?"#1D2B50":"transparent"}"></div>`).join("");
      return `<div style="display:grid;grid-template-columns:repeat(3,13px);gap:6px;padding:9px;
        border:3px solid #1D2B50;border-radius:12px;background:#fff">${cells}</div>`;
    }
    // 7-10: kartu titik 2 kolom × 5 (pola bingkai-10, tetap bisa "dilihat" cepat)
    const cells = Array.from({length:10},(_,i)=>
      `<div style="width:11px;height:11px;border-radius:50%;background:${i<n?"#1D2B50":"#E3E9F7"}"></div>`).join("");
    return `<div style="display:grid;grid-template-columns:repeat(2,11px);gap:5px;padding:9px;
      border:3px solid #1D2B50;border-radius:12px;background:#fff">${cells}</div>`;
  }
  function dadu2(x, y, label){
    const kanan = (y===null || y===undefined) ? "" :
      `<div style="font-size:24px;font-weight:800;color:#1D2B50">+</div>${dadu(y)}`;
    return `<div style="display:flex;gap:10px;align-items:center;justify-content:center;margin:10px 0">${dadu(x)}${kanan}</div>` +
      (label ? `<p class="small center">${label}</p>` : "");
  }
  // Tombol "Alat Peraga Bantu" pada sesi A2: membuka dadu + menandai pakai bantuan.
  function bukaBantu(btn){
    const d = btn.parentNode.nextElementSibling;
    if(d) d.style.display = "block";
    btn.disabled = true;
    if(window._sesi) window._sesi.pakaiBantuan = true; // soal ini tanpa bintang
  }

  // ---------- WIDGET MISI A1 ----------
  window.MPT_CONFIG = {
    "A1.1": { mount: wSubitizing, label:"Kartu Titik Kilat" },
    "A1.2": { mount: wJari,       label:"Pola Jari" },
    "A1.3": { mount: wGabung,     label:"Piring Gabung" },
    "A1.4": { mount: wLanjut,     label:"Gelas Tertutup" },
    "A1.5": { mount: wSahabat,    label:"Wadah Telur 10" },
    "A1.6": { mount: wDobel,      label:"Cermin Dobel" }
  };
  function mount(id, kontainer){
    const c = window.MPT_CONFIG[id];
    if(c) c.mount(kontainer);
  }

  // A1.1 — Subitizing: kartu titik muncul sebentar, jawab tanpa menghitung.
  let subN = 0;
  function wSubitizing(k){
    k.innerHTML = `
      <p class="small">🎲 Tekan LEMPAR — kartu titik muncul <b>sebentar saja</b>. Sebutkan banyaknya TANPA menghitung satu-satu!</p>
      <div id="mpt-area" style="min-height:92px;display:flex;align-items:center;justify-content:center"></div>
      <div class="center"><button class="btn btn-accent btn-sm" onclick="MPT._lempar()">🎲 Lempar!</button></div>
      <div class="choices" id="mpt-opsi"></div><div id="mpt-fb"></div>`;
  }
  function _lempar(){
    subN = rnd(1,6);
    el("mpt-opsi").innerHTML = ""; el("mpt-fb").innerHTML = "";
    el("mpt-area").innerHTML = dadu(subN);
    setTimeout(()=>{
      const area = el("mpt-area");
      if(area) area.innerHTML = `<div style="font-size:44px">🙈</div>`;
      const ops = new Set([subN]);
      while(ops.size<3) ops.add(rnd(1,6));
      const opsi = el("mpt-opsi");
      if(opsi) opsi.innerHTML = acak([...ops]).map(o=>`<button class="choice" onclick="MPT._subJawab(${o})">${o}</button>`).join("");
    }, 1600);
  }
  function _subJawab(v){
    el("mpt-fb").innerHTML = v===subN
      ? `<div class="feedback good">Betul, <b>${subN}</b>! Kamu MELIHATNYA tanpa menghitung 🎉 Lempar lagi!</div>`
      : `<div class="feedback help">Tadi <b>${subN}</b>. Lempar lagi — lihat POLANYA, jangan hitung satu-satu 😊</div>`;
  }

  // A1.2 — Pola jari: satu tangan penuh (5) + sisanya.
  function wJari(k){
    k.innerHTML = `
      <p class="small">🖐️ Tekan angka — lihat pola jarinya: <b>satu tangan penuh (5) + sisanya</b>. Jangan dihitung satu-satu!</p>
      <div class="btn-row" style="flex-wrap:wrap">${Array.from({length:10},(_,i)=>
        `<button class="btn btn-ghost btn-sm" onclick="MPT._jari(${i+1})">${i+1}</button>`).join("")}</div>
      <div class="center" id="mpt-area"></div>`;
  }
  function _jari(n){
    const tangan = t => `<div style="display:flex;gap:4px;align-items:flex-end;padding:6px 10px;border:2px solid #C9D4EF;border-radius:12px">${
      Array.from({length:5},(_,i)=>`<div style="width:16px;height:${i===0?24:32}px;border-radius:8px;background:${i<t?"#FF9F43":"#E3E9F7"}"></div>`).join("")}</div>`;
    const kiri = Math.min(n,5), kanan = Math.max(0, n-5);
    el("mpt-area").innerHTML = `
      <div style="display:flex;gap:16px;justify-content:center;margin:10px 0">${tangan(kiri)}${tangan(kanan)}</div>
      <p><b style="font-size:22px">${n}</b>${n>5?` &nbsp;=&nbsp; 5 + ${kanan} — satu tangan penuh, tambah ${kanan}!`:n===5?" — satu tangan penuh!":""}</p>`;
  }

  // A1.3 — Menggabung dua piring.
  let gb = {a:0, b:0};
  function wGabung(k){
    k.innerHTML = `
      <p class="small">🫐 Dua piring muncul. GABUNGKAN, lalu jawab banyaknya!</p>
      <div class="center"><button class="btn btn-accent btn-sm" onclick="MPT._acakGabung()">🔀 Piring Baru</button></div>
      <div id="mpt-area"></div><div class="choices" id="mpt-opsi"></div><div id="mpt-fb"></div>`;
    _acakGabung();
  }
  const isiPiring = (n,em)=>`<div class="group-box">${Array(n).fill(`<span class="item">${em}</span>`).join("")}</div>`;
  function _acakGabung(){
    gb = { a:rnd(2,5), b:rnd(2,5) };
    el("mpt-opsi").innerHTML=""; el("mpt-fb").innerHTML="";
    el("mpt-area").innerHTML = `
      <div class="groups-area">${isiPiring(gb.a,"🔵")}${isiPiring(gb.b,"🔴")}</div>
      <div class="center"><button class="btn btn-sm" onclick="MPT._gabungkan()">⬇️ GABUNGKAN!</button></div>`;
  }
  function _gabungkan(){
    const t = gb.a + gb.b;
    el("mpt-area").innerHTML = `
      <div class="groups-area"><div class="group-box">${Array(gb.a).fill('<span class="item">🔵</span>').join("")}${Array(gb.b).fill('<span class="item">🔴</span>').join("")}</div></div>
      <p class="center" style="font-weight:800;font-size:20px">${gb.a} + ${gb.b} = ?</p>`;
    const ops = new Set([t]);
    while(ops.size<3){ const c = t + rnd(-3,3); if(c>=1) ops.add(c); }
    el("mpt-opsi").innerHTML = acak([...ops]).map(o=>`<button class="choice" onclick="MPT._gabJawab(${o})">${o}</button>`).join("");
  }
  function _gabJawab(v){
    const t = gb.a + gb.b;
    el("mpt-fb").innerHTML = v===t
      ? `<div class="feedback good">🎉 <b>${gb.a} + ${gb.b} = ${t}</b> — dua warna jadi satu piring!</div>`
      : `<div class="feedback help">Belum tepat. Hitung lanjut dari ${Math.max(gb.a,gb.b)} ya: jawabannya <b>${t}</b>.</div>`;
  }

  // A1.4 — Hitung lanjut: gelas tertutup + kelereng ketuk.
  let hl = {a:0, b:0, ke:0};
  function wLanjut(k){
    k.innerHTML = `
      <p class="small">🧠 Gelas tertutup berisi angka — JANGAN dihitung ulang! KETUK kelereng di luar satu-satu sambil melanjutkan hitungan.</p>
      <div class="center"><button class="btn btn-accent btn-sm" onclick="MPT._acakLanjut()">🔀 Gelas Baru</button></div>
      <div id="mpt-area"></div><div id="mpt-fb"></div>`;
    _acakLanjut();
  }
  function _acakLanjut(){
    hl = { a:rnd(5,9), b:rnd(2,4), ke:0 };
    el("mpt-fb").innerHTML = "";
    el("mpt-area").innerHTML = `
      <div style="display:flex;gap:16px;align-items:center;justify-content:center;margin:10px 0">
        <div title="gelas tertutup" style="width:72px;height:84px;border:3px solid #1D2B50;border-radius:6px 6px 18px 18px;
          display:flex;align-items:center;justify-content:center;font-weight:800;font-size:28px;background:#DCE9F5">${hl.a}</div>
        <div style="display:flex;gap:8px">${Array.from({length:hl.b},(_,i)=>
          `<button id="mpt-k${i}" onclick="MPT._ketuk(${i})" style="width:42px;height:42px;border-radius:50%;font-size:22px;border:2px solid #C9D4EF;background:#fff;cursor:pointer">🔵</button>`).join("")}</div>
      </div>
      <div class="center" id="mpt-hitung" style="font-size:26px;font-weight:800;color:#1D2B50">${hl.a} ...</div>`;
  }
  function _ketuk(i){
    const b = el("mpt-k"+i);
    if(!b || b.disabled) return;
    b.disabled = true; b.style.background = "#D8F5E3";
    hl.ke++;
    el("mpt-hitung").textContent = `${hl.a} ... ${Array.from({length:hl.ke},(_,j)=>hl.a+j+1).join(", ")}`;
    if(hl.ke===hl.b) el("mpt-fb").innerHTML =
      `<div class="feedback good">🎉 <b>${hl.a} + ${hl.b} = ${hl.a+hl.b}</b> — kamu MELANJUTKAN dari ${hl.a}, bukan mengulang dari 1!</div>`;
  }

  // A1.5 — Sahabat 10: wadah telur 10 lubang.
  let s10 = {isi:0, tambah:0};
  function wSahabat(k){
    k.innerHTML = `
      <p class="small">🥚 Wadah telur muat 10. KETUK lubang kosong untuk mengisinya — berapa lagi supaya penuh?</p>
      <div class="center"><button class="btn btn-accent btn-sm" onclick="MPT._acak10()">🔀 Acak Ulang</button></div>
      <div id="mpt-area"></div>
      <div class="center" id="mpt-hitung" style="font-size:24px;font-weight:800"></div>
      <div id="mpt-fb"></div>`;
    _acak10();
  }
  function _acak10(){
    s10 = { isi:rnd(1,9), tambah:0 };
    el("mpt-fb").innerHTML = "";
    el("mpt-hitung").innerHTML = `${s10.isi} + <b>0</b> = ${s10.isi}`;
    el("mpt-area").innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(5,46px);gap:6px;justify-content:center;margin:10px 0;
        padding:10px;border:3px solid #C9A36B;border-radius:14px;background:#F5E8D0;max-width:280px;margin-inline:auto">
        ${Array.from({length:10},(_,i)=> i < s10.isi
          ? `<div style="width:46px;height:46px;border-radius:50%;background:#fff;border:2px solid #C9A36B;display:flex;align-items:center;justify-content:center;font-size:24px">🥚</div>`
          : `<button id="mpt-e${i}" onclick="MPT._isiTelur(${i})" style="width:46px;height:46px;border-radius:50%;background:#EADFC8;border:2px dashed #C9A36B;font-size:22px;cursor:pointer"></button>`
        ).join("")}
      </div>`;
  }
  function _isiTelur(i){
    const b = el("mpt-e"+i);
    if(!b || b.disabled) return;
    b.disabled = true; b.textContent = "🐣"; b.style.background = "#fff";
    s10.tambah++;
    const tot = s10.isi + s10.tambah;
    el("mpt-hitung").innerHTML = `${s10.isi} + <b>${s10.tambah}</b> = ${tot}`;
    if(tot===10) el("mpt-fb").innerHTML =
      `<div class="feedback good">🎉 SAHABAT 10: <b>${s10.isi} dan ${10-s10.isi}</b>! ${s10.isi} + ${10-s10.isi} = 10. Acak ulang dan cari pasangan lain!</div>`;
  }

  // A1.6 — Dobel: cermin.
  function wDobel(k){
    k.innerHTML = `
      <p class="small">🦋 Tekan angka — lihat DOBELNYA muncul seperti cermin!</p>
      <div class="btn-row" style="flex-wrap:wrap">${Array.from({length:10},(_,i)=>
        `<button class="btn btn-ghost btn-sm" onclick="MPT._dobel(${i+1})">${i+1}</button>`).join("")}</div>
      <div class="center" id="mpt-area"></div>`;
  }
  function _dobel(n){
    const baris = em => `<div style="display:flex;gap:4px;justify-content:center;flex-wrap:wrap">${
      Array(n).fill(`<span style="font-size:24px">${em}</span>`).join("")}</div>`;
    el("mpt-area").innerHTML = `
      <div style="margin:10px 0">${baris("🔵")}<div style="height:3px;background:#C9D4EF;margin:6px 20%"></div>${baris("🔴")}</div>
      <p style="font-weight:800;font-size:22px">${n} + ${n} = ${2*n}</p>`;
  }

  return { mount, dadu, dadu2, bukaBantu,
    _lempar, _subJawab, _jari, _acakGabung, _gabungkan, _gabJawab,
    _acakLanjut, _ketuk, _acak10, _isiTelur, _dobel };
})();
