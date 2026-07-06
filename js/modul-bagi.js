// ====== MODUL PEMBAGIAN — integrasi tanpa mengubah mesin inti ======
// Menambahkan: StateBagi (progres terpisah di p.bagi), LeitnerBagi,
// generator P2–P5 (via pembungkus Gen.buat), layar V.*Bagi, dan
// Pulau Pembagian di peta (via pembungkus V.peta).
// Muat SETELAH screens2.js dan SEBELUM app.js.
(function(){
  const scr = () => document.getElementById("screen");
  const esc = s => String(s??"").replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const rnd = (lo,hi) => lo + Math.floor(Math.random()*(hi-lo+1));
  const acak = arr => arr.slice().sort(()=>Math.random()-.5);
  const KB = window.KURIKULUM_BAGI;
  const EMOJI = ["🍎","🐟","🍬","⚽","🍪","🌸","🐤","🍊"];
  const WADAH = ["keranjang","akuarium","toples","kotak","piring","vas","sangkar","kantong"];

  // ---------- STATE (namespace p.bagi) ----------
  const B = () => {
    const p = State.P();
    p.bagi ||= { sesiLulus:{}, misi:{}, levelDibuka4:[], kartu:{}, rekor:[] };
    p.bagi.rekor ||= [];
    return p.bagi;
  };

  const StateB = {
    modulTerbuka(){ return State.raw.testMode || State.levelLulus(KB.syaratModul); },
    catatSesiLulus(id){
      const arr = (B().sesiLulus[id] ||= []);
      const t = State.todayStr();
      if(State.raw.testMode || !arr.includes(t)) arr.push(t);
      State.save();
    },
    jumlahSesiLulus(id){
      const arr = B().sesiLulus[id] || [];
      return State.raw.testMode ? arr.length : new Set(arr).size;
    },
    levelLulus(id){
      const lv = KB.level[id];
      if(lv.tipe==="misi") return !!(B().misi[id] && B().misi[id].selesai);
      if(lv.tipe==="asesmen_misi") return !!(B().misi[id] && B().misi[id].lulus);
      if(lv.fase===5) return true;
      return this.jumlahSesiLulus(id) >= State.sesiDibutuhkan();
    },
    levelTerbuka(id){
      // Mode Uji Coba: semua level terbuka agar seluruh alur bisa dicoba
      if(State.raw.testMode) return true;
      if(!this.modulTerbuka()) return false;
      const lv = KB.level[id];
      // gerbang antarmodul: kartu ÷ menumpang kelompok × yang sudah mastered
      if(lv.syaratKali && !State.levelLulus(lv.syaratKali)) return false;
      const idx = KB.urutan.indexOf(id);
      if(idx===0) return true;
      if(lv.fase===5) return this.levelLulus("P4.9");
      return this.levelLulus(KB.urutan[idx-1]);
    },
    levelAktif(){
      for(const id of KB.urutan){ if(!this.levelLulus(id)) return id; }
      return "P5.1";
    },
    bukaKartuLevel(id){
      const b = B();
      if(b.levelDibuka4.includes(id)) return;
      b.levelDibuka4.push(id);
      (KARTU_BAGI_PER_LEVEL[id]||[]).forEach(cid=>{
        if(!b.kartu[cid]) b.kartu[cid] = { kotak:1, jatuhTempo: State.todayStr(), br:0, bs:0, baru:true };
      });
      State.save();
    },
    jawabKartu(cid, benar){
      const k = B().kartu[cid];
      if(!k) return;
      k.baru = false;
      if(benar){ k.br++; k.kotak = Math.min(5, k.kotak+1); }
      else     { k.bs++; k.kotak = 1; }
      k.jatuhTempo = State.addDays(State.todayStr(), KB.leitner.intervalHari[k.kotak]);
      State.save();
    },
    kartuJatuhTempo(){
      const t = State.todayStr();
      return Object.entries(B().kartu).filter(([,k])=>!k.baru && k.jatuhTempo<=t).map(([id])=>id);
    },
    kartuBaru(){ return Object.entries(B().kartu).filter(([,k])=>k.baru).map(([id])=>id); }
  };
  window.StateBagi = StateB;

  // ---------- LEITNER ----------
  const URUTAN_P4 = ["P4.1","P4.2","P4.3","P4.4","P4.5","P4.6","P4.7","P4.8","P4.9"];
  const LeitnerB = {
    susunSesi(){
      const L = KB.leitner;
      const due = acak(StateB.kartuJatuhTempo());
      const baru = acak(StateB.kartuBaru()).slice(0, L.maksKartuBaru);
      return due.concat(baru).slice(0, L.maksKartuSesi);
    },
    // Satu kartu = satu keluarga fakta, ditanya dua arah (hasil ÷ a dan hasil ÷ b).
    soalKartu(id){
      const k = KARTU_BAGI_MAP[id];
      if(k.tetap) return { id, teks:k.tetap.teks, jawaban:k.tetap.jawaban, strategi:k.strategi };
      const tanyaB = k.a === k.b || Math.random() < .5;
      return {
        id,
        teks: tanyaB ? `${k.hasil} ÷ ${k.a}` : `${k.hasil} ÷ ${k.b}`,
        jawaban: tanyaB ? k.b : k.a,
        strategi: k.strategi
      };
    },
    susunAsesmen(levelId){
      const milik = (KARTU_BAGI_PER_LEVEL[levelId]||[]).slice();
      const sebelum = URUTAN_P4.slice(0, URUTAN_P4.indexOf(levelId))
        .flatMap(l => KARTU_BAGI_PER_LEVEL[l]||[]);
      const tambahan = acak(sebelum).slice(0, KB.asesmen4.acakSebelumnya);
      return acak(milik.concat(tambahan));
    }
  };
  window.LeitnerBagi = LeitnerB;

  // ---------- VISUAL TAMBAHAN ----------
  // Garis bilangan mundur: kelinci melompat dari `hasil` turun `b` demi `b` sampai 0.
  function garisMundur(b, n){
    const maxV = b*n, w=480, h=110, pad=24;
    const x = v => pad + (v/maxV)*(w-2*pad);
    let ticks="", hops="";
    for(let v=0; v<=maxV; v+=b){
      ticks += `<line x1="${x(v)}" y1="70" x2="${x(v)}" y2="80" stroke="#5A6B94" stroke-width="2"/>
                <text x="${x(v)}" y="98" font-size="13" text-anchor="middle" fill="#1D2B50" font-weight="bold">${v}</text>`;
    }
    for(let i=n;i>0;i--){
      const x1=x(i*b), x2=x((i-1)*b), mx=(x1+x2)/2;
      hops += `<path d="M ${x1} 72 Q ${mx} ${20} ${x2} 72" fill="none" stroke="#FF9F43" stroke-width="3"/>`;
    }
    return `<svg class="numline" viewBox="0 0 ${w} ${h}">
      <line x1="${pad-8}" y1="75" x2="${w-pad+8}" y2="75" stroke="#1D2B50" stroke-width="3"/>
      ${ticks}${hops}
      <text x="${x(maxV)-24}" y="30" font-size="20">🐇</text>
    </svg>`;
  }
  // Segitiga fakta: hasil di puncak, dua faktor di kaki; satu angka ditutup.
  function segitigaVisual(atas, kiri, kanan){
    const kotak = v => `<div style="display:inline-block;min-width:52px;padding:10px 12px;border-radius:12px;
      background:${v==="?"?"#FFD34D":"#EDF1FB"};font-weight:800;font-size:24px;color:#1D2B50">${v}</div>`;
    return `<div style="margin:12px auto;max-width:260px">
      <div>${kotak(atas)}</div>
      <div class="small" style="margin:4px 0">✖️ &nbsp;⟷&nbsp; ➗</div>
      <div style="display:flex;justify-content:space-around">${kotak(kiri)}${kotak(kanan)}</div>
    </div>`;
  }

  // ---------- GENERATOR (pembungkus Gen.buat) ----------
  function bagiRata(){ // P2.1 · partitif: bagi rata, hitung isi satu wadah
    const a=rnd(2,5), b=rnd(2,5), e=rnd(0,EMOJI.length-1);
    return { tipe:"kelompok", a, b, emoji:EMOJI[e],
      teks:`<b>${a*b}</b> ${EMOJI[e]} dibagi RATA ke <b>${a} ${WADAH[e]}</b>. Setiap ${WADAH[e]} berisi berapa?`,
      jawaban:b, mode:"pilihan", opsi:Gen.pilihan(b),
      strategi:`Bagikan satu-satu bergiliran! ${a} × ${b} = ${a*b}, jadi ${a*b} ÷ ${a} = ${b}.` };
  }
  function bagiKelompok(){ // P2.2 · kuotitif: kelompokkan isi b, hitung banyak kelompok
    const a=rnd(2,5), b=rnd(2,5), e=rnd(0,EMOJI.length-1);
    return { tipe:"kelompok", a, b, emoji:EMOJI[e],
      teks:`Ada <b>${a*b}</b> ${EMOJI[e]}. Setiap ${WADAH[e]} diisi <b>${b}</b>. Berapa ${WADAH[e]} yang terisi?`,
      jawaban:a, mode:"pilihan", opsi:Gen.pilihan(a),
      strategi:`Hitung kelompoknya! ${b} × ${a} = ${a*b}, jadi ${a*b} ÷ ${b} = ${a}.` };
  }
  function arrayBagi(){ // P2.3 · array yang sama dibaca sebagai pembagian
    const a=rnd(2,6), b=rnd(2,6);
    return { tipe:"array", a, b, teksBesar:`${a*b} ÷ ${a} = ?`,
      teks:`${a*b} titik disusun dalam <b>${a} baris</b>. Setiap baris berisi berapa?`,
      jawaban:b, mode:"keypad",
      strategi:`Susunan yang sama dengan perkalian! ${a} × ${b} = ${a*b}, jadi ${a*b} ÷ ${a} = ${b}.` };
  }
  function lompatMundur(){ // P2.4 · kebalikan lompat bilangan
    const b = [2,5,10,3,4][rnd(0,4)];
    const n = rnd(3,5);
    return { tipe:"mundur", b, n,
      teks:`Kelinci mulai dari <b>${b*n}</b> dan melompat MUNDUR ${b} demi ${b} sampai 0.<br>Berapa kali ia melompat?`,
      jawaban:n, mode:"keypad",
      strategi:`Hitung lengkungannya! ${b*n} ÷ ${b} = ${n}, karena ${n} × ${b} = ${b*n}.` };
  }
  function campurP2(){ return [bagiRata, bagiKelompok, arrayBagi, lompatMundur][rnd(0,3)](); }

  function pasangBagi(){ // P3.1 · cocokkan representasi
    const a=rnd(2,6), b=rnd(2,6);
    const v = rnd(0,2);
    if(v===0){ // array -> kalimat pembagian (hindari pengecoh yang juga benar!)
      const benar = `${a*b} ÷ ${a} = ${b}`;
      // pengecoh dijamin salah untuk semua a,b (hindari kebetulan benar spt a=b=2)
      const opsi = acak([benar, `${a*b} ÷ ${a+1} = ${b}`, `${a*b+a} ÷ ${a} = ${b}`, `${a*b} ÷ ${a} = ${b+1}`]);
      return { tipe:"array", a, b, teks:"Susunan ini cocok dengan kalimat pembagian yang mana?",
        jawaban:benar, mode:"pilihanTeks", opsi };
    }
    if(v===1){ // simbol bagi -> makna perkalian rumpang
      const benar = `${a} × ? = ${a*b}`;
      const opsi = acak([benar, `${a} + ? = ${a*b}`, `? ÷ ${a} = ${a*b}`, `${a} × ${a*b} = ?`]);
      return { tipe:"polos", teksBesar:`${a*b} ÷ ${a}`, teks:"Sama artinya dengan mencari...?",
        jawaban:benar, mode:"pilihanTeks", opsi };
    }
    return { tipe:"array", a, b, teksBesar:`${a*b} ÷ ${b}`, teks:"Berapa hasilnya? (lihat susunannya!)",
      jawaban:a, mode:"pilihan", opsi:Gen.pilihan(a) };
  }
  function segitigaFakta(){ // P3.2 · relasi invers dalam satu gambar
    const a=rnd(2,9), b=rnd(2,9), h=a*b;
    const v = rnd(0,2);
    if(v===0) return { tipe:"segitiga", visual:segitigaVisual("?", a, b),
      teks:`Satu keluarga fakta: ${a} dan ${b} di bawah. Angka puncaknya berapa?`,
      jawaban:h, mode:"keypad", strategi:`Naik = KALI: ${a} × ${b} = ${h}. Turun = BAGI: ${h} ÷ ${a} = ${b}.` };
    if(v===1) return { tipe:"segitiga", visual:segitigaVisual(h, "?", b),
      teks:`Puncaknya ${h}, satu kakinya ${b}. Kaki yang tertutup berapa?`,
      jawaban:a, mode:"keypad", strategi:`Turun = BAGI: ${h} ÷ ${b} = ${a}. Cek: ${a} × ${b} = ${h}.` };
    return { tipe:"segitiga", visual:segitigaVisual(h, a, "?"),
      teks:`Puncaknya ${h}, satu kakinya ${a}. Kaki yang tertutup berapa?`,
      jawaban:b, mode:"keypad", strategi:`Turun = BAGI: ${h} ÷ ${a} = ${b}. Cek: ${a} × ${b} = ${h}.` };
  }
  function simbolBagi(){ // P3.3 · simbol murni + rumpang dua arah
    const a=rnd(2,9), b=rnd(2,9), h=a*b;
    const v = rnd(0,2);
    const s = `Pikirkan perkaliannya: ${a} × ${b} = ${h}.`;
    if(v===0) return { tipe:"polos", teksBesar:`${h} ÷ ${a} = ?`, jawaban:b, mode:"keypad", strategi:s };
    if(v===1) return { tipe:"polos", teksBesar:`${h} ÷ ? = ${b}`, jawaban:a, mode:"keypad", strategi:s };
    return { tipe:"polos", teksBesar:`? ÷ ${a} = ${b}`, jawaban:h, mode:"keypad",
      strategi:`Yang dibagi pasti paling besar! ${a} × ${b} = ${h}. ${s}` };
  }
  function gerbangBagi(i){ // P3.4 · 12 soal terstruktur
    const a=rnd(2,6), b=rnd(2,6), h=a*b;
    if(i<8) return { tipe:"polos", teksBesar:`${h} ÷ ${a} = ?`, jawaban:b, mode:"keypad" };
    if(i<10) return pasangBagi();
    return { tipe:"polos", teksBesar:`${h} ÷ ? = ${b}`, jawaban:a, mode:"keypad" };
  }

  // P5 — campuran kali-bagi dari kartu yang SUDAH dipelajari kedua modul
  function soalDariKartuKali(){
    const ids = Object.keys(State.P().kartu);
    const pool = ids.length ? ids : Object.keys(KARTU_MAP);
    const s = Leitner.soalKartu(pool[rnd(0,pool.length-1)]);
    return { tipe:"polos", teksBesar:`${s.teks} = ?`, jawaban:s.jawaban, mode:"keypad", strategi:s.strategi };
  }
  function soalDariKartuBagi(){
    const ids = Object.keys(B().kartu);
    const pool = ids.length ? ids : Object.keys(KARTU_BAGI_MAP);
    const s = LeitnerB.soalKartu(pool[rnd(0,pool.length-1)]);
    return { tipe:"polos", teksBesar:`${s.teks} = ?`, jawaban:s.jawaban, mode:"keypad", strategi:s.strategi };
  }
  function campurKaliBagi(){ return Math.random()<.5 ? soalDariKartuKali() : soalDariKartuBagi(); }

  function ceritaBagi(){ // P5.3 · partitif / kuotitif / sisa (schema-based)
    const t = SOAL_CERITA_BAGI[rnd(0, SOAL_CERITA_BAGI.length-1)];
    const a = rnd(t.a[0], t.a[1]), b = rnd(t.b[0], t.b[1]);
    if(t.tipe === "sisa"){
      const sisa = rnd(1, b-1), total = a*b + sisa;
      const teks = t.t.replace("{total}", total).replace("{a}", a).replace("{b}", b);
      return { tipe:"polos", teks:`<span class="q-text">${teks}</span>`, jawaban:sisa, mode:"keypad",
        strategi:`${a} × ${b} = ${a*b}, dan ${total} − ${a*b} = ${sisa}. Sisa selalu lebih kecil dari ${b}!` };
    }
    const teks = t.t.replace("{hasil}", a*b).replace("{a}", a).replace("{b}", b);
    const jawab = t.tipe === "partitif" ? b : a;
    return { tipe:"polos", teks:`<span class="q-text">${teks}</span>`, jawaban:jawab, mode:"keypad",
      strategi:`Pikirkan perkaliannya: ${t.tipe==="partitif"?a:b} × ? = ${a*b} → ${jawab}.` };
  }

  const petaGenBagi = { bagiRata, bagiKelompok, arrayBagi, lompatMundur, campurP2,
    pasangBagi, segitigaFakta, simbolBagi, gerbangBagi,
    campurKaliBagi, rekorBagi: campurKaliBagi, ceritaBagi };

  const genAsli = Gen.buat;
  Gen.buat = function(gen, i){
    if(petaGenBagi[gen]) return petaGenBagi[gen](i);
    return genAsli(gen, i);
  };

  // Visual tipe baru ("mundur" & "segitiga") disisipkan lewat pembungkus mulaiSesi:
  // soal bertipe baru dipetakan ke tipe "polos" + html visual di teks.
  const mulaiSesiAsli = V.mulaiSesi;
  V.mulaiSesi = function(cfg){
    const buatAsli = cfg.buatSoal;
    cfg.buatSoal = function(i){
      const q = buatAsli(i);
      if(q.tipe==="mundur"){
        return Object.assign({}, q, { tipe:"polos", teks:(q.teks||"") + garisMundur(q.b, q.n) });
      }
      if(q.tipe==="segitiga"){
        return Object.assign({}, q, { tipe:"polos", teks:(q.visual||"") + `<div class="q-text">${q.teks||""}</div>` });
      }
      return q;
    };
    return mulaiSesiAsli(cfg);
  };

  // ---------- PETA: PULAU PEMBAGIAN ----------
  function ruteBagi(id){
    const t = KB.level[id].tipe;
    if(t==="misi") return "misiBagi";
    if(t==="asesmen_misi") return "asesmenMisiBagi";
    if(t==="leitner") return "hubP4";
    if(t==="fluensi") return "faseP5";
    return "sesiBagi";
  }
  function tipeLabelBagi(t){
    return {misi:"Misi benda nyata 🏠", asesmen_misi:"Dinilai orang tua",
      latihan:"Latihan 10 soal", asesmen:"Ujian fase", gerbang:"Ujian gerbang 12 soal",
      leitner:"Strategi + kartu pintar", fluensi:"Mode bebas"}[t] || "";
  }

  function htmlPulauBagi(){
    if(!StateB.modulTerbuka()){
      return `<div class="fase-header" style="margin-top:20px"><span class="badge">➗</span>
          <span><b>Pulau Pembagian</b></span></div>
        <div class="card">
          <p>🔒 Pulau ini terbuka setelah level <b>${KB.syaratModul}</b> (Fakta ×5) tamat.
          Begitu kamu hafal fakta ×2, ×10, dan ×5 — fakta pembagiannya tinggal dipanen! 🌾</p>
        </div>`;
    }
    const aktif = StateB.levelAktif();
    const due = StateB.kartuJatuhTempo().length;
    let html = `
      <div class="fase-header" style="margin-top:20px"><span class="badge">➗</span>
        <span><b>Pulau Pembagian</b> — kali dan bagi bersaudara</span></div>
      <div class="card">
        <p class="small">Misi pembagianmu: <b>${KB.level[aktif].nama}</b>${due?` · 🔔 ${due} kartu ÷ menunggu`:""}</p>
        <button class="btn btn-accent btn-sm" onclick="App.go('${ruteBagi(aktif)}','${aktif}')">▶️ Main Pembagian</button>
      </div>`;
    KB.fase.forEach(f=>{
      html += `<div class="fase-header"><span class="badge">${f.emoji}</span><span>${f.nama} — ${f.desc}</span></div><div class="level-path">`;
      KB.urutan.filter(id=>KB.level[id].fase===f.id).forEach(id=>{
        const lv = KB.level[id];
        const buka = StateB.levelTerbuka(id);
        const lulus = lv.fase===5 ? false : StateB.levelLulus(id);
        const isAktif = id===aktif;
        const kunciKali = lv.syaratKali && !State.levelLulus(lv.syaratKali)
          ? `<span class="small"> · butuh level ×${lv.syaratKali} tamat</span>` : "";
        const status = lulus ? "✅" : !buka ? "🔒" : lv.fase===5 ? "🏆" : (isAktif?"⭐":"🟡");
        const sesi = ["latihan","asesmen","gerbang","leitner"].includes(lv.tipe) && lv.fase!==5
          ? `<span class="small"> · sesi lulus ${StateB.jumlahSesiLulus(id)}/${State.sesiDibutuhkan()}</span>` : "";
        html += `<button class="level-node ${lulus?'done':isAktif?'active':buka?'':'locked'}"
            ${buka?`onclick="App.go('${ruteBagi(id)}','${id}')"`:"disabled"}>
          <div class="bubble">${id}</div>
          <div class="info"><div class="name">${lv.nama}</div><div class="desc">${tipeLabelBagi(lv.tipe)}${sesi}${kunciKali}</div></div>
          <div class="status">${status}</div>
        </button>`;
      });
      html += `</div>`;
    });
    return html;
  }

  // Daftarkan ke registry peta multi-operasi (didefinisikan screens.js)
  window.PULAU = window.PULAU || {};
  window.PULAU.bagi = { label:"Pembagian", emoji:"➗", html: htmlPulauBagi };

  // ---------- LAYAR: MISI KONKRET P1 ----------
  V.misiBagi = function(id){
    const m = MISI_BAGI[id];
    const sudah = B().misi[id];
    document.getElementById("topbar-title").textContent = `Misi ${id}`;
    scr().innerHTML = `
      <div class="card center"><div style="font-size:56px">${m.emoji}</div><h2>${m.judul}</h2></div>
      <div class="card">
        <div class="misi-quote">${m.instruksi}</div>
        <div class="misi-tip">💡 <b>Untuk Ayah/Ibu:</b> ${m.pancingan}</div>
        <p class="small" style="margin-top:8px">🎯 Target: ${m.target}</p>
      </div>
      <div class="card">
        <h3>Selesai bermain?</h3>
        <label>${m.inputLabel}</label>
        <input type="text" id="misi-jawab" value="${sudah?esc(sudah.jawaban):""}" placeholder="tulis di sini...">
        <button class="btn btn-success" style="margin-top:8px" onclick="V._misiBagiSelesai('${id}')">
          ${sudah ? "✅ Sudah selesai — perbarui" : "Misi Selesai! ✅"}</button>
      </div>`;
  };
  V._misiBagiSelesai = function(id){
    const jawab = document.getElementById("misi-jawab").value.trim();
    if(!jawab){ R.toast("Tulis dulu hasilnya ya 😊"); return; }
    B().misi[id] = { selesai:true, jawaban:jawab, tgl: State.todayStr() };
    State.save();
    State.sentuhStreak(); State.tambahBintang(5); window.updateHud();
    Sync.sesiSelesai("misi_konkret", id, 1, 1, 0, {jawaban:jawab});
    R.konfeti(); R.toast("Hebat! +5 ⭐");
    setTimeout(()=>App.go("peta"), 900);
  };

  V.asesmenMisiBagi = function(id){
    const m = MISI_BAGI[id];
    document.getElementById("topbar-title").textContent = m.judul;
    scr().innerHTML = `
      <div class="card center"><div style="font-size:56px">${m.emoji}</div><h2>${m.judul}</h2>
        <p class="small">${m.instruksi}</p></div>
      <div class="card">
        ${m.tugas.map((t,i)=>`<label class="check-row"><input type="checkbox" id="amb-${i}"><span>${t}</span></label>`).join("")}
        <p class="small">🎯 ${m.target}</p>
        <button class="btn btn-success" onclick="V._asesmenMisiBagiSelesai('${id}',${m.tugas.length})">Nilai Hasilnya</button>
      </div>`;
  };
  V._asesmenMisiBagiSelesai = function(id, n){
    let benar = 0;
    for(let i=0;i<n;i++) if(document.getElementById("amb-"+i).checked) benar++;
    const lulus = benar >= KB.level[id].lulusMin;
    B().misi[id] = { selesai:true, lulus, benar, dari:n, tgl: State.todayStr() };
    State.save();
    State.sentuhStreak(); window.updateHud();
    Sync.sesiSelesai("misi_konkret", id, n, benar, 0, {lulus});
    if(lulus){ State.tambahBintang(10); R.konfeti(); R.toast(`Lulus Fase P1! ${benar}/${n} benar 🎉 +10 ⭐`); setTimeout(()=>App.go("peta"),1200); }
    else { R.toast(`${benar}/${n} benar. Ulangi Misi P1.1, P1.2, dan P1.4 dulu ya, lalu coba lagi 💪`); }
  };

  // ---------- LAYAR: SESI LEVEL P2 & P3 ----------
  V.sesiBagi = function(levelId){
    const lv = KB.level[levelId];
    V.mulaiSesi({
      judul: `${levelId} · ${lv.nama}`,
      total: lv.soal,
      buatSoal: (i)=> Gen.buat(lv.gen, i),
      onSelesai: (h)=>{
        const lulus = h.benar >= lv.lulus;
        if(lulus){ StateB.catatSesiLulus(levelId); State.tambahBintang(10); }
        State.sentuhStreak(); window.updateHud();
        Sync.sesiSelesai(lv.tipe, levelId, h.total, h.benar, h.durasi, {salah:h.salah});
        const sisa = State.sesiDibutuhkan() - StateB.jumlahSesiLulus(levelId);
        let pesan;
        if(StateB.levelLulus(levelId)){ pesan = "Level TAMAT! Level berikutnya terbuka 🔓"; R.konfeti(); }
        else if(lulus) pesan = `Sesi lulus! Ulangi lagi <b>besok</b> (${sisa} sesi lagi) untuk menamatkan level ini 📅`;
        else pesan = `Butuh ${lv.lulus} benar untuk lulus. Ayo coba lagi, kamu pasti bisa 💪`;
        scr().innerHTML = `
          <div class="card center">
            <div class="celebrate">${lulus?"🌟":"🌱"}</div>
            <h2>${h.benar} / ${h.total} benar</h2>
            <p>${pesan}</p>
            <div class="btn-row" style="margin-top:10px">
              <button class="btn btn-ghost" onclick="App.go('peta')">Peta 🗺️</button>
              <button class="btn btn-accent" onclick="App.go('sesiBagi','${levelId}')">Main Lagi 🔁</button>
            </div>
          </div>`;
      }
    });
  };

  // ---------- LAYAR: FASE P4 (LEITNER) ----------
  V.hubP4 = function(levelId){
    StateB.bukaKartuLevel(levelId);
    const lv = KB.level[levelId];
    const b = B();
    const ids = KARTU_BAGI_PER_LEVEL[levelId]||[];
    const due = StateB.kartuJatuhTempo().length + Math.min(StateB.kartuBaru().length, KB.leitner.maksKartuBaru);
    const sisa = State.sesiDibutuhkan() - StateB.jumlahSesiLulus(levelId);
    document.getElementById("topbar-title").textContent = `${levelId} · ${lv.nama}`;

    const kartuHtml = ids.map(id=>{
      const k = KARTU_BAGI_MAP[id], st = b.kartu[id];
      const label = k.tetap ? k.tetap.teks : `${k.hasil}÷${k.a}`;
      return `<div class="box-badge ${st && st.kotak>=3?'on':''}">${label} · kotak ${st?st.kotak:1}</div>`;
    }).join("");

    scr().innerHTML = `
      <div class="card">
        <h2>➗ ${lv.nama}</h2>
        <div class="strategy-box">💡 <b>Strategi jitu:</b> ${lv.strategiUmum}</div>
        <p class="small" style="margin-top:8px">Kartu level ini (keluarga fakta ×${lv.syaratKali} yang sudah kamu hafal!):</p>
        <div class="box-badges">${kartuHtml}</div>
      </div>
      <div class="card">
        <h3>🃏 Latihan Kartu Pintar</h3>
        <p class="small">Kartu ÷ yang siap dilatih hari ini: <b>${due}</b>. Salah → kembali ke Kotak 1 + lihat fakta perkalian pasangannya.</p>
        <button class="btn btn-accent" onclick="App.go('latihanKartuBagi')" ${due?"":"disabled"}>${due?`Latihan Sekarang (${due} kartu)`:"Semua kartu sudah dilatih — kembali besok! 🌙"}</button>
      </div>
      <div class="card">
        <h3>🎓 Ujian Level</h3>
        <p class="small">Semua kartu level ini + ${KB.asesmen4.acakSebelumnya} kartu acak level sebelumnya. Lulus 90% pada ${State.sesiDibutuhkan()} sesi beda hari. Sisa: <b>${Math.max(sisa,0)} sesi</b>.</p>
        <button class="btn btn-success" onclick="App.go('ujianP4','${levelId}')">Mulai Ujian Level</button>
      </div>`;
  };

  V.latihanKartuBagi = function(){
    const ids = LeitnerB.susunSesi();
    if(!ids.length){ R.toast("Tidak ada kartu ÷ jatuh tempo hari ini 🌙"); return App.go("peta"); }
    V.mulaiSesi({
      judul: "🃏 Latihan Kartu Pembagian",
      total: ids.length,
      buatSoal: (i)=> { const s = LeitnerB.soalKartu(ids[i]); return { tipe:"polos", teksBesar:`${s.teks} = ?`, jawaban:s.jawaban, mode:"keypad", strategi:s.strategi, id:s.id }; },
      onJawabPertama: (q, benar)=> StateB.jawabKartu(q.id, benar),
      onSelesai: (h)=>{
        State.sentuhStreak(); window.updateHud();
        Sync.sesiSelesai("leitner", StateB.levelAktif(), h.total, h.benar, h.durasi, {salah:h.salah});
        scr().innerHTML = `
          <div class="card center">
            <div class="celebrate">🃏</div>
            <h2>${h.benar} / ${h.total} kartu benar</h2>
            <p class="small">Setiap kartu pembagian adalah keluarga fakta perkalian yang sudah kamu kenal. Naik kotak = makin jarang muncul!</p>
            <button class="btn" style="margin-top:10px" onclick="App.go('peta')">Kembali ke Peta 🗺️</button>
          </div>`;
      }
    });
  };

  V.ujianP4 = function(levelId){
    const ids = LeitnerB.susunAsesmen(levelId);
    const lulusMin = Math.ceil(ids.length * KB.asesmen4.persenLulus);
    V.mulaiSesi({
      judul: `🎓 Ujian ${levelId}`,
      total: ids.length,
      tanpaUlang: true,
      buatSoal: (i)=> { const s = LeitnerB.soalKartu(ids[i]); return { tipe:"polos", teksBesar:`${s.teks} = ?`, jawaban:s.jawaban, mode:"keypad", id:s.id }; },
      onSelesai: (h)=>{
        const lulus = h.benar >= lulusMin;
        if(lulus){ StateB.catatSesiLulus(levelId); State.tambahBintang(15); }
        State.sentuhStreak(); window.updateHud();
        Sync.sesiSelesai("asesmen", levelId, h.total, h.benar, h.durasi, {salah:h.salah, lulus});
        const tamat = StateB.levelLulus(levelId);
        if(tamat && levelId==="P4.9") return V.sertifikatBagi();
        let pesan;
        if(tamat){ R.konfeti(); pesan = "Level TAMAT! Level berikutnya terbuka 🔓"; }
        else if(lulus) pesan = `Sesi ujian lulus! Ulangi <b>besok</b> untuk menamatkan level 📅`;
        else pesan = `Butuh ${lulusMin} benar. Latihan kartu dulu, lalu coba lagi 💪`;
        scr().innerHTML = `
          <div class="card center">
            <div class="celebrate">${lulus?"🏅":"🌱"}</div>
            <h2>${h.benar} / ${h.total} benar</h2>
            <p>${pesan}</p>
            <div class="btn-row" style="margin-top:10px">
              <button class="btn btn-ghost" onclick="App.go('peta')">Peta 🗺️</button>
              <button class="btn btn-accent" onclick="App.go('hubP4','${levelId}')">Kembali ke Level</button>
            </div>
          </div>`;
      }
    });
  };

  // ---------- LAYAR: FASE P5 ----------
  V.faseP5 = function(levelId){
    const lv = KB.level[levelId];
    if(levelId==="P5.4") return V.pemeliharaanBagi();
    const timer = levelId==="P5.2";
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
          const rk = B().rekor;
          const rekorLama = rk.filter(r=>r.benar>=h.total*0.9).reduce((m,r)=>Math.min(m,r.detik), Infinity);
          rk.push({tgl: State.todayStr(), detik: h.durasi, benar: h.benar});
          State.save();
          const pecah = h.benar>=h.total*0.9 && h.durasi < rekorLama;
          if(pecah) R.konfeti();
          ekstra = `<h3>${pecah ? "🏆 REKOR BARU!" : rekorLama<Infinity ? `Hampir! Rekormu: ${rekorLama} detik` : "Rekor pertamamu tercatat!"}</h3>
            <p class="small">⏱️ ${h.durasi} detik — lawan rekormu sendiri, bukan temanmu 😉</p>`;
        }
        scr().innerHTML = `
          <div class="card center">
            <div class="celebrate">🏆</div>
            <h2>${h.benar} / ${h.total} benar</h2>
            ${ekstra}
            <div class="btn-row" style="margin-top:10px">
              <button class="btn btn-ghost" onclick="App.go('peta')">Peta 🗺️</button>
              <button class="btn btn-accent" onclick="App.go('faseP5','${levelId}')">Main Lagi 🔁</button>
            </div>
          </div>`;
      }
    });
  };

  V.pemeliharaanBagi = function(){
    const ids = StateB.kartuJatuhTempo();
    if(!ids.length){
      scr().innerHTML = `<div class="card center"><div class="celebrate">🌙</div>
        <h2>Semua kartu ÷ aman!</h2><p>Tidak ada kartu pembagian jatuh tempo hari ini.</p>
        <button class="btn" onclick="App.go('peta')">Kembali 🗺️</button></div>`;
      return;
    }
    V.latihanKartuBagi();
  };

  // ---------- SERTIFIKAT PEMBAGIAN ----------
  V.sertifikatBagi = function(){
    R.konfeti();
    const p = State.P();
    scr().innerHTML = `
      <div class="certificate">
        <div style="font-size:56px">➗🏆</div>
        <h1>SERTIFIKAT JUARA PEMBAGIAN</h1>
        <p>diberikan kepada</p>
        <h1 style="font-size:34px">${esc(p.nama)}</h1>
        <p>yang telah menguasai <b>seluruh fakta pembagian 1 – 100</b><br>
        dengan memahami dua makna pembagian dan kekuatan keluarga fakta perkalian.</p>
        <p class="small">${new Date().toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"})}</p>
      </div>
      <div class="btn-row" style="margin-top:12px">
        <button class="btn btn-ghost" onclick="window.print()">🖨️ Cetak</button>
        <button class="btn" onclick="App.go('peta')">Peta 🗺️</button>
      </div>`;
  };

  // ---------- RESET PROFIL: ikut menghapus progres pembagian ----------
  V._resetProfil = function(){
    if(!confirm("Yakin menghapus SELURUH progres anak ini? Tidak bisa dibatalkan.")) return;
    const p = State.P();
    const baru = { nama: p.nama, kelas: p.kelas, id: p.id };
    Object.assign(p, { bintang:0, streak:0, lastPlayDate:null, sesiLulus:{}, misi:{}, levelDibuka4:[], kartu:{}, rekor:[], pemeliharaanTerakhir:null }, baru);
    delete p.bagi;
    State.save(); R.toast("Progres direset"); App.go("ortu");
  };
})();
