// ====== LAYAR: ONBOARDING, PETA, MISI, SESI SOAL ======
window.V = window.V || {};
(function(){
  const scr = () => document.getElementById("screen");
  const esc = s => String(s??"").replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

  function hud(){
    const p = State.P();
    document.getElementById("hud-bintang").textContent = p ? p.bintang : 0;
    document.getElementById("hud-streak").textContent = p ? p.streak : 0;
  }
  window.updateHud = hud;

  // ---------- ONBOARDING ----------
  V.onboarding = function(){
    document.getElementById("topbar").classList.add("hidden");
    scr().innerHTML = `
      <div class="card center" style="margin-top:40px">
        <div style="font-size:64px">🚀</div>
        <h1>Petualangan Perkalian</h1>
        <p>Belajar perkalian 1–10, dari benda di rumah sampai hafal lancar!</p>
      </div>
      <div class="card">
        <h3>Siapa nama petualangnya?</h3>
        <label>Nama panggilan anak</label>
        <input type="text" id="ob-nama" maxlength="20" placeholder="contoh: Raka">
        <label>Kelas</label>
        <select id="ob-kelas"><option value="2">Kelas 2</option><option value="3" selected>Kelas 3</option><option value="4">Kelas 4</option></select>
        <button class="btn btn-accent" style="margin-top:10px" onclick="V._buatProfil()">Mulai Petualangan! 🎒</button>
      </div>`;
  };
  V._buatProfil = function(){
    const nama = document.getElementById("ob-nama").value.trim();
    if(!nama){ R.toast("Isi dulu nama panggilannya ya 😊"); return; }
    State.addProfile(nama, document.getElementById("ob-kelas").value);
    App.go("peta");
  };

  // ---------- PETA PETUALANGAN ----------
  V.peta = function(){
    document.getElementById("topbar").classList.remove("hidden");
    document.getElementById("topbar-title").textContent = "Peta Petualangan";
    hud();
    const p = State.P();
    const aktif = State.levelAktif();
    const due = State.kartuJatuhTempo().length;

    let html = `
      <div class="card">
        <h2>Halo, ${esc(p.nama)}! 👋</h2>
        <p class="small">Misi hari ini: <b>${KURIKULUM.level[aktif].nama}</b>${due?` · 🔔 ${due} kartu menunggu latihan`:""}</p>
        <div class="btn-row" style="margin-top:8px">
          <button class="btn btn-accent btn-sm" onclick="App.go('${rute(aktif)}','${aktif}')">▶️ Main Sekarang</button>
          <button class="btn btn-ghost btn-sm" onclick="App.go('ortuPin')">👨‍👩‍👧 Orang Tua</button>
        </div>
      </div>
      <div class="card">
        <h3>✨ Tabel Ajaibku</h3>${R.heatmap()}
      </div>`;

    KURIKULUM.fase.forEach(f=>{
      html += `<div class="fase-header"><span class="badge">${f.emoji}</span><span>${f.nama} — ${f.desc}</span></div><div class="level-path">`;
      KURIKULUM.urutan.filter(id=>KURIKULUM.level[id].fase===f.id).forEach(id=>{
        const lv = KURIKULUM.level[id];
        const buka = State.levelTerbuka(id);
        const lulus = lv.fase===5 ? false : State.levelLulus(id);
        const isAktif = id===aktif;
        const status = lulus ? "✅" : !buka ? "🔒" : lv.fase===5 ? "🏆" : (isAktif?"⭐":"🟡");
        const sesi = ["latihan","asesmen","gerbang","leitner"].includes(lv.tipe) && lv.fase!==5
          ? `<span class="small"> · sesi lulus ${State.jumlahSesiLulus(id)}/${State.sesiDibutuhkan()}</span>` : "";
        html += `<button class="level-node ${lulus?'done':isAktif?'active':buka?'':'locked'}"
            ${buka?`onclick="App.go('${rute(id)}','${id}')"`:"disabled"}>
          <div class="bubble">${id}</div>
          <div class="info"><div class="name">${lv.nama}</div><div class="desc">${tipeLabel(lv.tipe)}${sesi}</div></div>
          <div class="status">${status}</div>
        </button>`;
      });
      html += `</div>`;
    });
    scr().innerHTML = html;
    window.scrollTo(0,0);
  };
  function rute(id){
    const t = KURIKULUM.level[id].tipe;
    if(t==="misi") return "misi";
    if(t==="asesmen_misi") return "asesmenMisi";
    if(t==="leitner") return "hub4";
    if(t==="fluensi") return "fase5";
    return "sesi";
  }
  function tipeLabel(t){
    return {misi:"Misi benda nyata 🏠", asesmen_misi:"Dinilai orang tua",
      latihan:"Latihan 10 soal", asesmen:"Ujian fase", gerbang:"Ujian gerbang 12 soal",
      leitner:"Strategi + kartu pintar", fluensi:"Mode bebas"}[t] || "";
  }

  // ---------- MISI KONKRET (Fase 1) ----------
  V.misi = function(id){
    const m = MISI[id];
    const sudah = State.P().misi[id];
    document.getElementById("topbar-title").textContent = `Misi ${id}`;
    const punyaWidget = !!(window.MP_CONFIG && MP_CONFIG[id]);
    const widgetCard = punyaWidget ? `
      <div class="card">
        <h3>Pilih cara bermain:</h3>
        <div class="btn-row">
          <button class="btn btn-ghost btn-sm" id="mode-nyata" onclick="V._misiMode('nyata','${id}')">🏠 Benda Nyata</button>
          <button class="btn btn-accent btn-sm" id="mode-digital" onclick="V._misiMode('digital','${id}')">📱 Benda Geser</button>
        </div>
        <div id="mp-mount" style="margin-top:10px"><p class="small">Paling seru pakai benda sungguhan di rumah! Tapi kalau bendanya tidak ada, tekan <b>📱 Benda Geser</b> untuk bermain di layar.</p></div>
      </div>` : "";
    scr().innerHTML = `
      <div class="card center"><div style="font-size:56px">${m.emoji}</div><h2>${m.judul}</h2></div>
      <div class="card">
        <div class="misi-quote">${m.instruksi}</div>
        <div class="misi-tip">💡 <b>Untuk Ayah/Ibu:</b> ${m.pancingan}</div>
        <p class="small" style="margin-top:8px">🎯 Target: ${m.target}</p>
      </div>
      ${widgetCard}
      <div class="card">
        <h3>Selesai bermain?</h3>
        <label>${m.inputLabel}</label>
        <input type="text" id="misi-jawab" value="${sudah?esc(sudah.jawaban):""}" placeholder="tulis di sini...">
        <button class="btn btn-success" style="margin-top:8px" onclick="V._misiSelesai('${id}')">
          ${sudah ? "✅ Sudah selesai — perbarui" : "Misi Selesai! ✅"}</button>
      </div>`;
  };
  V._misiMode = function(mode, id){
    const mount = document.getElementById("mp-mount");
    if(mode === "digital"){ MP.mount(id, mount); }
    else { mount.innerHTML = `<p class="small">Gunakan benda sungguhan di rumah — sentuhan tangan membuat konsep makin menempel! 🖐️</p>`; }
  };
  V._misiSelesai = function(id){
    const jawab = document.getElementById("misi-jawab").value.trim();
    if(!jawab){ R.toast("Tulis dulu hasilnya ya 😊"); return; }
    State.selesaikanMisi(id, jawab);
    State.sentuhStreak(); State.tambahBintang(5); hud();
    Sync.sesiSelesai("misi_konkret", id, 1, 1, 0, {jawaban:jawab});
    R.konfeti(); R.toast("Hebat! +5 ⭐");
    setTimeout(()=>App.go("peta"), 900);
  };

  V.asesmenMisi = function(id){
    const m = MISI[id];
    document.getElementById("topbar-title").textContent = m.judul;
    scr().innerHTML = `
      <div class="card center"><div style="font-size:56px">${m.emoji}</div><h2>${m.judul}</h2>
        <p class="small">${m.instruksi}</p></div>
      <div class="card">
        ${m.tugas.map((t,i)=>`<label class="check-row"><input type="checkbox" id="am-${i}"><span>${t}</span></label>`).join("")}
        <p class="small">🎯 ${m.target}</p>
        <button class="btn btn-success" onclick="V._asesmenMisiSelesai('${id}',${m.tugas.length})">Nilai Hasilnya</button>
      </div>`;
  };
  V._asesmenMisiSelesai = function(id, n){
    let benar = 0;
    for(let i=0;i<n;i++) if(document.getElementById("am-"+i).checked) benar++;
    const lulus = benar >= KURIKULUM.level[id].lulusMin;
    State.selesaikanAsesmenMisi(id, benar, n, lulus);
    State.sentuhStreak(); hud();
    Sync.sesiSelesai("misi_konkret", id, n, benar, 0, {lulus});
    if(lulus){ State.tambahBintang(10); R.konfeti(); R.toast(`Lulus Fase 1! ${benar}/${n} benar 🎉 +10 ⭐`); setTimeout(()=>App.go("peta"),1200); }
    else { R.toast(`${benar}/${n} benar. Ulangi Misi 1.2, 1.3, dan 1.5 dulu ya, lalu coba lagi 💪`); }
  };

  // ---------- MESIN SESI SOAL (dipakai Fase 2, 3, 5 & kartu) ----------
  // cfg: {judul, total, lulusMin|null, buatSoal(i), tipeLog, level, timer, onJawabPertama(soal,benar), onSelesai(hasil), tanpaUlang}
  V.mulaiSesi = function(cfg){
    const s = window._sesi = {
      cfg, antre: [], i: 0, benar: 0, dijawab: 0,
      salahIds: [], mulai: Date.now(), pakaiBantuan:false
    };
    for(let i=0;i<cfg.total;i++) s.antre.push({ soal: cfg.buatSoal(i), ulang:false });
    document.getElementById("topbar-title").textContent = cfg.judul;
    tampilSoal();
  };

  function tampilSoal(){
    const s = window._sesi;
    if(s.i >= s.antre.length) return selesaiSesi();
    const item = s.antre[s.i], q = item.soal;
    s.pakaiBantuan = false;

    let visual = "";
    if(q.tipe==="kelompok") visual = R.kelompokVisual(q.a,q.b,q.emoji||"🔵");
    if(q.tipe==="array") visual = R.arrayVisual(q.a,q.b,{bisaPutar:q.bisaPutar});
    if(q.tipe==="arraySamar") visual = R.arrayVisual(q.a,q.b,{samar:true}) +
      `<div class="center"><button class="btn btn-ghost btn-sm" onclick="R.tampilkanArraySamar(this)">👀 Lihat Gambar</button></div>`;
    if(q.tipe==="lompat") visual = R.garisLompat(q.b,q.n);

    let jawabArea = "";
    if(q.mode==="pilihan") jawabArea = `<div class="choices">${q.opsi.map(o=>`<button class="choice" onclick="V._jawab(${o},this)">${o}</button>`).join("")}</div>`;
    else if(q.mode==="pilihanTeks") jawabArea = `<div class="choices" style="grid-template-columns:1fr">${q.opsi.map(o=>`<button class="choice" style="font-size:19px" onclick="V._jawab('${esc(o)}',this)">${esc(o)}</button>`).join("")}</div>`;
    else jawabArea = R.keypad(v=>V._jawab(v));

    const timer = s.cfg.timer ? `<div class="center small" id="stopwatch" style="font-weight:800">⏱️ 0 detik</div>` : "";
    scr().innerHTML = `
      ${R.progressBar(s.dijawab, s.cfg.total)}
      ${timer}
      <div class="card center">
        ${item.ulang?'<div class="small">🔁 soal ulangan — pasti bisa!</div>':""}
        ${q.teksBesar?`<div class="q-big">${q.teksBesar}</div>`:""}
        ${q.teks?`<div class="q-text">${q.teks}</div>`:""}
        ${visual}
        ${jawabArea}
        <div id="fb"></div>
      </div>`;
    if(s.cfg.timer) jalanTimer();
    window.scrollTo(0,0);
  }
  function jalanTimer(){
    const s = window._sesi;
    clearInterval(s._t);
    s._t = setInterval(()=>{
      const el = document.getElementById("stopwatch");
      if(el) el.textContent = `⏱️ ${Math.floor((Date.now()-s.mulai)/1000)} detik`;
    }, 500);
  }

  V._jawab = function(v, btnEl){
    const s = window._sesi, item = s.antre[s.i], q = item.soal;
    const benar = String(v) === String(q.jawaban);
    // kunci input
    document.querySelectorAll(".choice,.key").forEach(b=>b.disabled=true);
    if(btnEl) btnEl.classList.add(benar?"correct":"wrong");

    if(!item.ulang){
      s.dijawab++;
      if(benar){ s.benar++; State.tambahBintang(s.pakaiBantuan?0:1); }
      else s.salahIds.push(q.teksBesar||q.teks||q.id||"");
      if(s.cfg.onJawabPertama) s.cfg.onJawabPertama(q, benar);
      if(!benar && !s.cfg.tanpaUlang) s.antre.push({ soal:q, ulang:true });
    }
    hud();

    const fb = document.getElementById("fb");
    if(benar){
      fb.innerHTML = `<div class="feedback good">Betul! 🎉</div>`;
      setTimeout(()=>{ s.i++; tampilSoal(); }, 750);
    } else {
      const strategi = q.strategi ? `<div class="strategy-box">💡 ${q.strategi}</div>` : "";
      fb.innerHTML = `<div class="feedback help">Belum tepat — jawabannya <b>${q.jawaban}</b>.</div>${strategi}
        <button class="btn btn-sm" style="margin-top:10px" onclick="V._lanjut()">Lanjut ▶️</button>`;
    }
  };
  V._lanjut = function(){ window._sesi.i++; tampilSoal(); };

  function selesaiSesi(){
    const s = window._sesi; clearInterval(s._t);
    const durasi = Math.round((Date.now()-s.mulai)/1000);
    const hasil = { benar:s.benar, total:s.cfg.total, durasi, salah:s.salahIds };
    if(s.cfg.onSelesai) return s.cfg.onSelesai(hasil);
  }

  // ---------- SESI LEVEL FASE 2 & 3 ----------
  V.sesi = function(levelId){
    const lv = KURIKULUM.level[levelId];
    V.mulaiSesi({
      judul: `${levelId} · ${lv.nama}`,
      total: lv.soal,
      buatSoal: (i)=> Gen.buat(lv.gen, i),
      onSelesai: (h)=>{
        const lulus = h.benar >= lv.lulus;
        if(lulus){ State.catatSesiLulus(levelId); State.tambahBintang(10); }
        State.sentuhStreak(); hud();
        Sync.sesiSelesai(lv.tipe, levelId, h.total, h.benar, h.durasi, {salah:h.salah});
        const sisa = State.sesiDibutuhkan() - State.jumlahSesiLulus(levelId);
        let pesan;
        if(State.levelLulus(levelId)){ pesan = "Level TAMAT! Level berikutnya terbuka 🔓"; R.konfeti(); }
        else if(lulus) pesan = `Sesi lulus! Ulangi lagi <b>besok</b> (${sisa} sesi lagi) untuk menamatkan level ini 📅`;
        else pesan = `Butuh ${lv.lulus} benar untuk lulus. Ayo coba lagi, kamu pasti bisa 💪`;
        scr().innerHTML = `
          <div class="card center">
            <div class="celebrate">${lulus?"🌟":"🌱"}</div>
            <h2>${h.benar} / ${h.total} benar</h2>
            <p>${pesan}</p>
            <div class="btn-row" style="margin-top:10px">
              <button class="btn btn-ghost" onclick="App.go('peta')">Peta 🗺️</button>
              <button class="btn btn-accent" onclick="App.go('sesi','${levelId}')">Main Lagi 🔁</button>
            </div>
          </div>`;
      }
    });
  };
})();
