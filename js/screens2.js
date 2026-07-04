// ====== LAYAR: FASE 4 (LEITNER), FASE 5, ORANG TUA, SERTIFIKAT ======
(function(){
  const scr = () => document.getElementById("screen");
  const esc = s => String(s??"").replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

  // ---------- HUB LEVEL FASE 4 ----------
  V.hub4 = function(levelId){
    State.bukaKartuLevel(levelId);
    const lv = KURIKULUM.level[levelId];
    const p = State.P();
    const ids = KARTU_PER_LEVEL[levelId]||[];
    const due = State.kartuJatuhTempo().length + Math.min(State.kartuBaru().length, KURIKULUM.leitner.maksKartuBaru);
    const sisa = State.sesiDibutuhkan() - State.jumlahSesiLulus(levelId);
    document.getElementById("topbar-title").textContent = `${levelId} · ${lv.nama}`;

    const kartuHtml = ids.map(id=>{
      const k = KARTU_MAP[id], st = p.kartu[id];
      return `<div class="box-badge ${st && st.kotak>=3?'on':''}">${k.a}×${k.b} · kotak ${st?st.kotak:1}</div>`;
    }).join("");

    scr().innerHTML = `
      <div class="card">
        <h2>⚡ ${lv.nama}</h2>
        <div class="strategy-box">💡 <b>Strategi jitu:</b> ${lv.strategiUmum}</div>
        <p class="small" style="margin-top:8px">Kartu level ini:</p>
        <div class="box-badges">${kartuHtml}</div>
      </div>
      <div class="card">
        <h3>🃏 Latihan Kartu Pintar</h3>
        <p class="small">Kartu yang siap dilatih hari ini: <b>${due}</b>. Jawab benar → kartu naik kotak (muncul makin jarang). Salah → kembali ke Kotak 1 + lihat strateginya.</p>
        <button class="btn btn-accent" onclick="App.go('latihanKartu')" ${due?"":"disabled"}>${due?`Latihan Sekarang (${due} kartu)`:"Semua kartu sudah dilatih — kembali besok! 🌙"}</button>
      </div>
      <div class="card">
        <h3>🎓 Ujian Level</h3>
        <p class="small">Semua kartu level ini + 5 kartu acak level sebelumnya. Lulus 90% pada ${State.sesiDibutuhkan()} sesi beda hari. Sisa: <b>${Math.max(sisa,0)} sesi</b>.</p>
        <button class="btn btn-success" onclick="App.go('ujian4','${levelId}')">Mulai Ujian Level</button>
      </div>`;
  };

  // ---------- SESI LATIHAN KARTU (LEITNER) ----------
  V.latihanKartu = function(){
    const ids = Leitner.susunSesi();
    if(!ids.length){ R.toast("Tidak ada kartu jatuh tempo hari ini 🌙"); return App.go("peta"); }
    V.mulaiSesi({
      judul: "🃏 Latihan Kartu Pintar",
      total: ids.length,
      buatSoal: (i)=> { const s = Leitner.soalKartu(ids[i]); return { tipe:"polos", teksBesar:`${s.teks} = ?`, jawaban:s.jawaban, mode:"keypad", strategi:s.strategi, id:s.id }; },
      onJawabPertama: (q, benar)=> State.jawabKartu(q.id, benar),
      onSelesai: (h)=>{
        State.sentuhStreak(); window.updateHud();
        Sync.sesiSelesai("leitner", State.levelAktif(), h.total, h.benar, h.durasi, {salah:h.salah});
        scr().innerHTML = `
          <div class="card center">
            <div class="celebrate">🃏</div>
            <h2>${h.benar} / ${h.total} kartu benar</h2>
            <p class="small">Kartu yang benar naik kotak — akan muncul lagi saat waktunya. Yang salah akan sering muncul sampai kamu jago!</p>
            ${R.heatmap()}
            <button class="btn" style="margin-top:10px" onclick="App.go('peta')">Kembali ke Peta 🗺️</button>
          </div>`;
      }
    });
  };

  // ---------- UJIAN LEVEL FASE 4 ----------
  V.ujian4 = function(levelId){
    const ids = Leitner.susunAsesmen(levelId);
    const lulusMin = Math.ceil(ids.length * KURIKULUM.asesmen4.persenLulus);
    V.mulaiSesi({
      judul: `🎓 Ujian ${levelId}`,
      total: ids.length,
      tanpaUlang: true,
      buatSoal: (i)=> { const s = Leitner.soalKartu(ids[i]); return { tipe:"polos", teksBesar:`${s.teks} = ?`, jawaban:s.jawaban, mode:"keypad", id:s.id }; },
      onSelesai: (h)=>{
        const lulus = h.benar >= lulusMin;
        if(lulus){ State.catatSesiLulus(levelId); State.tambahBintang(15); }
        State.sentuhStreak(); window.updateHud();
        Sync.sesiSelesai("asesmen", levelId, h.total, h.benar, h.durasi, {salah:h.salah, lulus});
        const tamat = State.levelLulus(levelId);
        if(tamat && levelId==="4.9") return V.sertifikat();
        let pesan;
        if(tamat){
          R.konfeti();
          pesan = levelId==="4.4"
            ? "🎉 LUAR BIASA! Lebih dari SEPARUH tabel perkalian sudah kamu kuasai! Lihat tabel ajaibmu menyala!"
            : "Level TAMAT! Level berikutnya terbuka 🔓";
        }
        else if(lulus) pesan = `Sesi ujian lulus! Ulangi <b>besok</b> untuk menamatkan level 📅`;
        else pesan = `Butuh ${lulusMin} benar. Latihan kartu dulu, lalu coba lagi 💪`;
        scr().innerHTML = `
          <div class="card center">
            <div class="celebrate">${lulus?"🏅":"🌱"}</div>
            <h2>${h.benar} / ${h.total} benar</h2>
            <p>${pesan}</p>
            ${tamat ? R.heatmap() : ""}
            <div class="btn-row" style="margin-top:10px">
              <button class="btn btn-ghost" onclick="App.go('peta')">Peta 🗺️</button>
              <button class="btn btn-accent" onclick="App.go('hub4','${levelId}')">Kembali ke Level</button>
            </div>
          </div>`;
      }
    });
  };

  // ---------- FASE 5 ----------
  V.fase5 = function(levelId){
    const lv = KURIKULUM.level[levelId];
    if(levelId==="5.4") return V.pemeliharaan();
    const timer = levelId==="5.2";
    V.mulaiSesi({
      judul: `${lv.nama}`,
      total: lv.soal,
      timer,
      tanpaUlang: timer,
      buatSoal: ()=> Gen.buat(lv.gen),
      onSelesai: (h)=>{
        State.sentuhStreak(); State.tambahBintang(5); window.updateHud();
        Sync.sesiSelesai("fluensi", levelId, h.total, h.benar, h.durasi, {salah:h.salah});
        let ekstra = "";
        if(timer){
          const p = State.P();
          const rekorLama = p.rekor.filter(r=>r.benar>=h.total*0.9).reduce((m,r)=>Math.min(m,r.detik), Infinity);
          p.rekor.push({tgl: State.todayStr(), detik: h.durasi, benar: h.benar});
          State.save();
          const pecah = h.benar>=h.total*0.9 && h.durasi < rekorLama;
          if(pecah) R.konfeti();
          ekstra = `<h3>${pecah ? "🏆 REKOR BARU!" : rekorLama<Infinity ? `Hampir! Rekormu: ${rekorLama} detik` : "Rekor pertamamu tercatat!"}</h3>
            <p class="small">⏱️ ${h.durasi} detik · grafik rekor ada di halaman Orang Tua</p>`;
        }
        scr().innerHTML = `
          <div class="card center">
            <div class="celebrate">🏆</div>
            <h2>${h.benar} / ${h.total} benar</h2>
            ${ekstra}
            <div class="btn-row" style="margin-top:10px">
              <button class="btn btn-ghost" onclick="App.go('peta')">Peta 🗺️</button>
              <button class="btn btn-accent" onclick="App.go('fase5','${levelId}')">Main Lagi 🔁</button>
            </div>
          </div>`;
      }
    });
  };

  V.pemeliharaan = function(){
    const ids = State.kartuJatuhTempo();
    if(!ids.length){
      scr().innerHTML = `<div class="card center"><div class="celebrate">🌙</div>
        <h2>Semua kartu aman!</h2><p>Tidak ada kartu jatuh tempo hari ini. Kembali lagi nanti untuk misi kilat 5 menit.</p>
        <button class="btn" onclick="App.go('peta')">Kembali 🗺️</button></div>`;
      return;
    }
    V.latihanKartu();
  };

  // ---------- SERTIFIKAT ----------
  V.sertifikat = function(){
    R.konfeti();
    const p = State.P();
    scr().innerHTML = `
      <div class="certificate">
        <div style="font-size:56px">🏆</div>
        <h1>SERTIFIKAT JUARA PERKALIAN</h1>
        <p>diberikan kepada</p>
        <h1 style="font-size:34px">${esc(p.nama)}</h1>
        <p>yang telah menguasai <b>seluruh tabel perkalian 1 – 10</b><br>
        melalui petualangan 5 fase: benda nyata, gambar, simbol, strategi, dan kartu pintar.</p>
        <p class="small">${new Date().toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"})}</p>
        ${R.heatmap()}
      </div>
      <div class="btn-row" style="margin-top:12px">
        <button class="btn btn-ghost" onclick="window.print()">🖨️ Cetak</button>
        <button class="btn" onclick="App.go('peta')">Peta 🗺️</button>
      </div>`;
  };

  // ---------- ORANG TUA ----------
  V.ortuPin = function(){
    const S = State.raw;
    document.getElementById("topbar-title").textContent = "Area Orang Tua";
    scr().innerHTML = `
      <div class="card">
        <h2>👨‍👩‍👧 Area Orang Tua</h2>
        <label>${S.pinOrtu ? "Masukkan PIN (4 angka)" : "Buat PIN baru (4 angka)"}</label>
        <input type="password" id="pin" inputmode="numeric" maxlength="4" placeholder="••••">
        <button class="btn" onclick="V._cekPin()">Masuk</button>
      </div>`;
  };
  V._cekPin = function(){
    const S = State.raw;
    const v = document.getElementById("pin").value.trim();
    if(!/^\d{4}$/.test(v)){ R.toast("PIN harus 4 angka"); return; }
    if(!S.pinOrtu){ S.pinOrtu = v; State.save(); R.toast("PIN tersimpan ✅"); return App.go("ortu"); }
    if(S.pinOrtu === v) return App.go("ortu");
    R.toast("PIN salah");
  };

  V.ortu = function(){
    const S = State.raw, p = State.P();
    const aktif = State.levelAktif();
    const dist = {1:0,2:0,3:0,4:0,5:0};
    Object.values(p.kartu).forEach(k=>dist[k.kotak]++);
    const totalKartu = Object.keys(p.kartu).length;
    const rekorChart = grafikRekor(p.rekor);
    document.getElementById("topbar-title").textContent = "Dashboard Orang Tua";

    scr().innerHTML = `
      <div class="card">
        <h2>📊 ${esc(p.nama)}</h2>
        <div class="stat-grid">
          <div class="stat"><div class="num">${aktif}</div><div class="lbl">Level aktif</div></div>
          <div class="stat"><div class="num">${p.streak} hari</div><div class="lbl">Streak belajar</div></div>
          <div class="stat"><div class="num">${p.bintang}</div><div class="lbl">Bintang</div></div>
          <div class="stat"><div class="num">${dist[4]+dist[5]}/${totalKartu||"–"}</div><div class="lbl">Kartu lancar (kotak 4–5)</div></div>
        </div>
        <p class="small" style="margin-top:8px">Distribusi kartu: ${[1,2,3,4,5].map(k=>`Kotak ${k}: <b>${dist[k]}</b>`).join(" · ")}</p>
      </div>
      <div class="card"><h3>Peta penguasaan tabel</h3>${R.heatmap()}</div>
      ${p.rekor.length?`<div class="card"><h3>Rekor "Kalahkan Rekormu"</h3>${rekorChart}</div>`:""}
      <div class="card">
        <h3>Profil anak</h3>
        ${S.profils.map(pr=>`<label class="check-row"><input type="radio" name="prof" ${pr.id===S.activeId?"checked":""} onclick="V._gantiProfil('${pr.id}')"><span><b>${esc(pr.nama)}</b> · kelas ${esc(pr.kelas)}</span></label>`).join("")}
        <div class="btn-row"><input type="text" id="np-nama" placeholder="nama anak baru" style="flex:2">
        <button class="btn btn-ghost btn-sm" style="flex:1" onclick="V._tambahProfil()">+ Tambah</button></div>
      </div>
      <div class="card">
        <h3>Pengaturan</h3>
        <label class="check-row"><input type="checkbox" id="tm" ${S.testMode?"checked":""} onclick="V._toggleTest()"><span><b>Mode Uji Coba</b> — lulus level cukup 1 sesi (untuk mencoba aplikasi; matikan saat anak belajar sungguhan)</span></label>
        <p class="small">Sinkronisasi: ${Sync.aktif() ? `aktif ✅ (antrean: ${S.syncQueue.length})` : "nonaktif — isi WEBAPP_URL di js/config.js untuk mengaktifkan backup Google Sheets"}</p>
        <div class="btn-row">
          <button class="btn btn-ghost btn-sm" onclick="Sync.flush();R.toast('Sinkronisasi dijalankan')">🔄 Sinkron Sekarang</button>
          <button class="btn btn-ghost btn-sm" onclick="V._resetProfil()" style="color:var(--danger)">⚠️ Reset Progres Anak Ini</button>
        </div>
      </div>
      <button class="btn" onclick="App.go('peta')">Kembali ke Peta 🗺️</button>`;
  };
  V._gantiProfil = function(id){ State.raw.activeId = id; State.save(); App.go("ortu"); };
  V._tambahProfil = function(){
    const nama = document.getElementById("np-nama").value.trim();
    if(!nama) return R.toast("Isi nama dulu");
    State.addProfile(nama, 3); App.go("ortu");
  };
  V._toggleTest = function(){ State.raw.testMode = document.getElementById("tm").checked; State.save(); };
  V._resetProfil = function(){
    if(!confirm("Yakin menghapus SELURUH progres anak ini? Tidak bisa dibatalkan.")) return;
    const S = State.raw, p = State.P();
    const baru = { nama: p.nama, kelas: p.kelas, id: p.id };
    Object.assign(p, { bintang:0, streak:0, lastPlayDate:null, sesiLulus:{}, misi:{}, levelDibuka4:[], kartu:{}, rekor:[], pemeliharaanTerakhir:null }, baru);
    State.save(); R.toast("Progres direset"); App.go("ortu");
  };

  function grafikRekor(rekor){
    const data = rekor.slice(-12);
    if(!data.length) return "";
    const w=480,h=160,pad=30;
    const maxD = Math.max(...data.map(r=>r.detik))*1.15;
    const x = i => pad + i*( (w-2*pad) / Math.max(data.length-1,1) );
    const y = d => h-pad - (d/maxD)*(h-2*pad);
    const pts = data.map((r,i)=>`${x(i)},${y(r.detik)}`).join(" ");
    const dots = data.map((r,i)=>`<circle cx="${x(i)}" cy="${y(r.detik)}" r="5" fill="#FF9F43"/><text x="${x(i)}" y="${y(r.detik)-9}" font-size="11" text-anchor="middle" fill="#1D2B50" font-weight="bold">${r.detik}s</text>`).join("");
    return `<svg class="chart-svg" viewBox="0 0 ${w} ${h}">
      <polyline points="${pts}" fill="none" stroke="#3B63D8" stroke-width="3"/>
      ${dots}
      <text x="${pad}" y="${h-8}" font-size="11" fill="#5A6B94">lama → baru (makin rendah makin cepat)</text>
    </svg>`;
  }
})();
