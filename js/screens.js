// ====== LAYAR: ONBOARDING, PETA (MULTI-OPERASI), MISI, SESI SOAL ======
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

  // ---------- SIGNUP (DAFTAR PETUALANG BARU) ----------
  const opsiKelas = terpilih => [1,2,3,4,5,6].map(k=>
    `<option value="${k}" ${k===terpilih?"selected":""}>Kelas ${k}</option>`).join("");

  V.signup = function(){
    document.getElementById("topbar").classList.add("hidden");
    scr().innerHTML = `
      <div class="card center" style="margin-top:40px">
        <div style="font-size:64px">🚀</div>
        <h1>Petualangan Berhitung</h1>
        <p>Belajar penjumlahan, pengurangan, perkalian, dan pembagian — dari benda di rumah sampai hafal lancar!</p>
      </div>
      <div class="card">
        <h3>Daftar petualang baru 🎒</h3>
        <label>Nama panggilan anak</label>
        <input type="text" id="ob-nama" maxlength="20" placeholder="contoh: Raka">
        <label>Kelas</label>
        <select id="ob-kelas">${opsiKelas(3)}</select>
        <label>Buat PIN rahasia (4 angka)</label>
        <input type="password" id="ob-pin" inputmode="numeric" maxlength="4" placeholder="••••">
        <label>Ulangi PIN</label>
        <input type="password" id="ob-pin2" inputmode="numeric" maxlength="4" placeholder="••••">
        <button class="btn btn-accent" style="margin-top:10px" onclick="V._buatProfil()">Mulai Petualangan! 🚀</button>
        ${State.raw.profils.length ? `<button class="btn btn-ghost btn-sm" style="margin-top:8px" onclick="App.go('login')">← Sudah punya akun? Masuk</button>` : ""}
      </div>`;
  };
  V.onboarding = function(){ V.signup(); }; // kompatibilitas rute lama

  V._buatProfil = function(){
    const nama = document.getElementById("ob-nama").value.trim();
    if(!nama){ R.toast("Isi dulu nama panggilannya ya 😊"); return; }
    if(State.raw.profils.some(p => p.nama.toLowerCase() === nama.toLowerCase())){
      R.toast("Nama itu sudah dipakai — pilih nama panggilan lain ya 😊"); return;
    }
    const pin  = document.getElementById("ob-pin").value.trim();
    const pin2 = document.getElementById("ob-pin2").value.trim();
    if(!/^\d{4}$/.test(pin)){ R.toast("PIN harus 4 angka ya 🔢"); return; }
    if(pin !== pin2){ R.toast("PIN-nya belum sama — coba ulangi 😊"); return; }
    const kelas = document.getElementById("ob-kelas").value;
    State.addProfile(nama, kelas, pin);
    // kelas 1-2 mulai di Pulau Penjumlahan, kelas 3+ di Pulau Perkalian
    State.raw.opAktif = (parseInt(kelas,10) <= 2 && window.PULAU && window.PULAU.tambah) ? "tambah" : "kali";
    State.raw.loggedIn = true;
    State.save();
    R.konfeti();
    App.go("peta");
  };

  // ---------- LOGIN ----------
  V.login = function(){
    document.getElementById("topbar").classList.add("hidden");
    const anak = State.raw.profils;
    scr().innerHTML = `
      <div class="card center" style="margin-top:40px">
        <div style="font-size:64px">🚀</div>
        <h1>Petualangan Berhitung</h1>
        <p>Siapa yang mau berpetualang hari ini?</p>
      </div>
      <div class="card">
        ${anak.map(p=>`
          <button class="btn btn-ghost" style="width:100%;margin-bottom:8px;text-align:left" onclick="V._loginAnak('${p.id}')">
            🧒 <b>${esc(p.nama)}</b> · kelas ${esc(p.kelas)}</button>`).join("")}
        <button class="btn btn-accent btn-sm" style="margin-top:6px" onclick="App.go('signup')">➕ Petualang Baru (Daftar)</button>
      </div>`;
  };

  V._loginAnak = function(id){
    const p = State.raw.profils.find(x=>x.id===id);
    if(!p) return;
    if(!p.pin){ // profil lama (dibuat sebelum ada PIN): buat PIN sekali
      scr().innerHTML = `
        <div class="card center" style="margin-top:40px">
          <div style="font-size:56px">🧒</div>
          <h2>Halo, ${esc(p.nama)}!</h2>
          <p class="small">Kamu belum punya PIN. Buat PIN rahasiamu dulu (sekali saja):</p>
          <label>PIN baru (4 angka)</label>
          <input type="password" id="login-pin" inputmode="numeric" maxlength="4" placeholder="••••" style="text-align:center;font-size:24px">
          <label>Ulangi PIN</label>
          <input type="password" id="login-pin2" inputmode="numeric" maxlength="4" placeholder="••••" style="text-align:center;font-size:24px">
          <div class="btn-row" style="margin-top:10px">
            <button class="btn btn-ghost" onclick="App.go('login')">← Kembali</button>
            <button class="btn btn-accent" onclick="V._buatPinLama('${p.id}')">Simpan & Masuk 🎒</button>
          </div>
        </div>`;
      return;
    }
    scr().innerHTML = `
      <div class="card center" style="margin-top:40px">
        <div style="font-size:56px">🧒</div>
        <h2>Halo, ${esc(p.nama)}!</h2>
        <p class="small">Masukkan PIN rahasiamu:</p>
        <input type="password" id="login-pin" inputmode="numeric" maxlength="4" placeholder="••••" style="text-align:center;font-size:24px">
        <div class="btn-row" style="margin-top:10px">
          <button class="btn btn-ghost" onclick="App.go('login')">← Kembali</button>
          <button class="btn btn-accent" onclick="V._loginCek('${p.id}')">Masuk 🎒</button>
        </div>
        <p class="small" style="margin-top:8px">Lupa PIN? Minta Ayah/Ibu membukanya lewat Area Orang Tua di dalam.</p>
      </div>`;
  };

  V._loginCek = function(id){
    const p = State.raw.profils.find(x=>x.id===id);
    const v = document.getElementById("login-pin").value.trim();
    if(!p || p.pin !== v){ R.toast("PIN salah — coba lagi ya 😊"); return; }
    State.raw.activeId = id;
    State.raw.loggedIn = true;
    State.save();
    App.go("peta");
    Sync.flush();
  };

  V._buatPinLama = function(id){
    const p = State.raw.profils.find(x=>x.id===id);
    const pin  = document.getElementById("login-pin").value.trim();
    const pin2 = document.getElementById("login-pin2").value.trim();
    if(!/^\d{4}$/.test(pin)){ R.toast("PIN harus 4 angka ya 🔢"); return; }
    if(pin !== pin2){ R.toast("PIN-nya belum sama — coba ulangi 😊"); return; }
    p.pin = pin;
    State.raw.activeId = id;
    State.raw.loggedIn = true;
    State.save();
    R.toast("PIN tersimpan! Jangan lupa ya 🤫");
    App.go("peta");
  };

  V._logout = function(){
    State.raw.loggedIn = false;
    State.save();
    App.go("login");
  };

  // ---------- PETA PETUALANGAN (MULTI-OPERASI) ----------
  // Registry pulau: tiap modul mendaftar { label, emoji, html() }.
  window.PULAU = window.PULAU || {};

  function opAktif(){
    const S = State.raw;
    return (S.opAktif && window.PULAU[S.opAktif]) ? S.opAktif : "kali";
  }
  V._pilihOp = function(op){
    if(!window.PULAU[op]){ R.toast("Pulau ini sedang dibangun — segera hadir! 🚧"); return; }
    State.raw.opAktif = op; State.save();
    V.peta();
  };

  V.peta = function(){
    document.getElementById("topbar").classList.remove("hidden");
    document.getElementById("topbar-title").textContent = "Peta Petualangan";
    hud();
    const p = State.P();
    const op = opAktif();
    const daftar = [
      ["tambah","➕","Tambah"], ["kurang","➖","Kurang"],
      ["kali","✖️","Kali"], ["bagi","➗","Bagi"]
    ];
    const tombol = daftar.map(([id,em,lbl])=>{
      const ada = !!window.PULAU[id];
      const cls = op===id ? "btn-accent" : "btn-ghost";
      return `<button class="btn btn-sm ${cls}" style="flex:1;min-width:72px" ${ada?`onclick="V._pilihOp('${id}')"`:"disabled"}>${em} ${lbl}${ada?"":" 🚧"}</button>`;
    }).join("");
    let html = `
      <div class="card">
        <h2>Halo, ${esc(p.nama)}! 👋</h2>
        <p class="small">Pilih operasi hitungmu:</p>
        <div class="btn-row" style="margin-top:8px;flex-wrap:wrap">${tombol}</div>
        <div class="btn-row" style="margin-top:8px">
          <button class="btn btn-ghost btn-sm" onclick="App.go('ortuPin')">👨‍👩‍👧 Orang Tua</button>
          <button class="btn btn-ghost btn-sm" onclick="V._logout()">🚪 Keluar</button>
        </div>
      </div>`;
    html += window.PULAU[op].html();
    scr().innerHTML = html;
    window.scrollTo(0,0);
  };

  // ---------- PULAU PERKALIAN ----------
  function htmlPulauKali(){
    const aktif = State.levelAktif();
    const due = State.kartuJatuhTempo().length;
    let html = `
      <div class="fase-header" style="margin-top:14px"><span class="badge">✖️</span>
        <span><b>Pulau Perkalian</b> — dari benda nyata sampai hafal 1–10</span></div>
      <div class="card">
        <p class="small">Misi perkalianmu: <b>${KURIKULUM.level[aktif].nama}</b>${due?` · 🔔 ${due} kartu menunggu latihan`:""}</p>
        <button class="btn btn-accent btn-sm" onclick="App.go('${rute(aktif)}','${aktif}')">▶️ Main Perkalian</button>
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
    return html;
  }
  window.PULAU.kali = { label:"Perkalian", emoji:"✖️", html: htmlPulauKali };

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

  // ---------- MESIN SESI SOAL (dipakai semua modul) ----------
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

  // ---------- SESI LEVEL FASE 2 & 3 (PERKALIAN) ----------
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
