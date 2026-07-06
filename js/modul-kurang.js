// ====== MODUL PENGURANGAN — melengkapi empat operasi ======
// Pola sama dengan modul-bagi & modul-tambah: StateKurang (p.kurang),
// LeitnerKurang, generator K2-K5, layar V.*Kurang, dan pendaftaran
// PULAU.kurang (tombol ➖ di peta otomatis aktif).
// Gerbang antarmodul: pulau terbuka setelah A4.2 penjumlahan; tiap K4.x
// terkunci oleh level penjumlahan pasangannya (syaratTambah) — kartu 13−8
// "memanen" keluarga fakta 8+5 yang sudah dihafal.
// Muat SETELAH modul-tambah.js dan SEBELUM app.js.
(function(){
  const scr = () => document.getElementById("screen");
  const esc = s => String(s??"").replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const rnd = (lo,hi) => lo + Math.floor(Math.random()*(hi-lo+1));
  const acak = arr => arr.slice().sort(()=>Math.random()-.5);
  const KK = window.KURIKULUM_KURANG;
  const EMOJI = ["🍎","🐟","🍬","⚽","🍪","🌸","🐤","🍊"];

  // ---------- STATE (namespace p.kurang) ----------
  const K = () => {
    const p = State.P();
    p.kurang ||= { sesiLulus:{}, misi:{}, levelDibuka4:[], kartu:{}, rekor:[] };
    p.kurang.rekor ||= [];
    return p.kurang;
  };

  const StateK = {
    modulTerbuka(){ return State.raw.testMode || StateTambah.levelLulus(KK.syaratModul); },
    catatSesiLulus(id){
      const arr = (K().sesiLulus[id] ||= []);
      const t = State.todayStr();
      if(State.raw.testMode || !arr.includes(t)) arr.push(t);
      State.save();
    },
    jumlahSesiLulus(id){
      const arr = K().sesiLulus[id] || [];
      return State.raw.testMode ? arr.length : new Set(arr).size;
    },
    levelLulus(id){
      const lv = KK.level[id];
      if(lv.tipe==="misi") return !!(K().misi[id] && K().misi[id].selesai);
      if(lv.tipe==="asesmen_misi") return !!(K().misi[id] && K().misi[id].lulus);
      if(lv.fase===5) return true;
      return this.jumlahSesiLulus(id) >= State.sesiDibutuhkan();
    },
    levelTerbuka(id){
      if(State.raw.testMode) return true;
      if(!this.modulTerbuka()) return false;
      const lv = KK.level[id];
      // gerbang antarmodul: kartu − menumpang keluarga fakta + yang mastered
      if(lv.syaratTambah && !StateTambah.levelLulus(lv.syaratTambah)) return false;
      const idx = KK.urutan.indexOf(id);
      if(idx===0) return true;
      if(lv.fase===5) return this.levelLulus("K4.9");
      return this.levelLulus(KK.urutan[idx-1]);
    },
    levelAktif(){
      for(const id of KK.urutan){ if(!this.levelLulus(id)) return id; }
      return "K5.1";
    },
    bukaKartuLevel(id){
      const k = K();
      if(k.levelDibuka4.includes(id)) return;
      k.levelDibuka4.push(id);
      (KARTU_KURANG_PER_LEVEL[id]||[]).forEach(cid=>{
        if(!k.kartu[cid]) k.kartu[cid] = { kotak:1, jatuhTempo: State.todayStr(), br:0, bs:0, baru:true };
      });
      State.save();
    },
    jawabKartu(cid, benar){
      const k = K().kartu[cid];
      if(!k) return;
      k.baru = false;
      if(benar){ k.br++; k.kotak = Math.min(5, k.kotak+1); }
      else     { k.bs++; k.kotak = 1; }
      k.jatuhTempo = State.addDays(State.todayStr(), KK.leitner.intervalHari[k.kotak]);
      State.save();
    },
    kartuJatuhTempo(){
      const t = State.todayStr();
      return Object.entries(K().kartu).filter(([,k])=>!k.baru && k.jatuhTempo<=t).map(([id])=>id);
    },
    kartuBaru(){ return Object.entries(K().kartu).filter(([,k])=>k.baru).map(([id])=>id); }
  };
  window.StateKurang = StateK;

  // ---------- LEITNER ----------
  const URUTAN_K4 = ["K4.1","K4.2","K4.3","K4.4","K4.5","K4.6","K4.7","K4.8","K4.9"];
  const LeitnerK = {
    susunSesi(){
      const L = KK.leitner;
      const due = acak(StateK.kartuJatuhTempo());
      const baru = acak(StateK.kartuBaru()).slice(0, L.maksKartuBaru);
      return due.concat(baru).slice(0, L.maksKartuSesi);
    },
    // Satu kartu = satu keluarga fakta, dua arah: (a+b)−a dan (a+b)−b.
    soalKartu(id){
      const k = KARTU_KURANG_MAP[id];
      const tanyaB = k.a === k.b || Math.random() < .5;
      return { id,
        teks: tanyaB ? `${k.hasil} − ${k.a}` : `${k.hasil} − ${k.b}`,
        jawaban: tanyaB ? k.b : k.a, strategi: k.strategi };
    },
    susunAsesmen(levelId){
      const milik = (KARTU_KURANG_PER_LEVEL[levelId]||[]).slice();
      const sebelum = URUTAN_K4.slice(0, URUTAN_K4.indexOf(levelId))
        .flatMap(l => KARTU_KURANG_PER_LEVEL[l]||[]);
      const tambahan = acak(sebelum).slice(0, KK.asesmen4.acakSebelumnya);
      return acak(milik.concat(tambahan));
    }
  };
  window.LeitnerKurang = LeitnerK;

  // ---------- RENDERER VISUAL BARU ----------
  // Bingkai-10 dikosongkan: total titik, `ambil` terakhir dicoret.
  function tenframeKurangHTML(total, ambil){
    const frames = total > 10 ? 2 : 1;
    let html = `<div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin:12px 0">`;
    for(let f=0; f<frames; f++){
      let cells = "";
      for(let c=0; c<10; c++){
        const i = f*10 + c;
        let isi = "";
        if(i < total) isi = i < total-ambil ? "🔵" : "❌";
        cells += `<div style="width:34px;height:34px;border:2px solid #5A6B94;border-radius:8px;
          display:flex;align-items:center;justify-content:center;font-size:19px;background:#fff">${isi}</div>`;
      }
      html += `<div style="display:grid;grid-template-columns:repeat(5,34px);gap:4px">${cells}</div>`;
    }
    return html + `</div>`;
  }
  // Dua baris sejajar untuk membandingkan (selisih = yang tak berpasangan).
  function bandingHTML(besar, kecil, emoji){
    const baris = (n, em) => `<div style="display:flex;gap:4px;justify-content:flex-start;flex-wrap:wrap">${
      Array.from({length:n},()=>`<span style="font-size:22px">${em}</span>`).join("")}</div>`;
    return `<div style="display:inline-block;text-align:left;margin:12px auto">
      ${baris(besar, emoji)}
      <div style="height:6px"></div>
      ${baris(kecil, "🔘")}
    </div>`;
  }
  // Bar model bagian-keseluruhan: keseluruhan di atas, dua bagian di bawah.
  function barModelHTML(total, bagian, tandaTanya){
    const kotak = (isi, w, warna) => `<div style="flex:${w};padding:10px 6px;border:2px solid #5A6B94;
      border-radius:10px;background:${warna};font-weight:800;font-size:20px;color:#1D2B50;text-align:center">${isi}</div>`;
    return `<div style="max-width:320px;margin:12px auto">
      <div style="display:flex">${kotak(total, 1, "#EDF1FB")}</div>
      <div style="display:flex;gap:4px;margin-top:4px">
        ${kotak(bagian, bagian, "#D8F5E3")}${kotak(tandaTanya, Math.max(total-bagian,1), "#FFF3C4")}
      </div>
    </div>`;
  }
  // Garis bilangan 0-20: mundur `n` dari `mulai`, ATAU maju dari `mulai` ke `target`.
  function garisKurangHTML(mulai, n, arah){
    const maxV=20, w=480, h=114, pad=20;
    const x = v => pad + (v/maxV)*(w-2*pad);
    let ticks="", hops="";
    for(let v=0; v<=maxV; v++){
      const besar = v%5===0;
      ticks += `<line x1="${x(v)}" y1="${besar?68:71}" x2="${x(v)}" y2="80" stroke="#5A6B94" stroke-width="${besar?2:1}"/>`;
      if(besar) ticks += `<text x="${x(v)}" y="98" font-size="12" text-anchor="middle" fill="#1D2B50" font-weight="bold">${v}</text>`;
    }
    ticks += `<text x="${x(mulai)}" y="${mulai%5===0?112:96}" font-size="12" text-anchor="middle" fill="#FF9F43" font-weight="bold">${mulai}</text>`;
    if(arah==="mundur"){
      for(let i=0;i<n;i++){
        const x1=x(mulai-i), x2=x(mulai-i-1), mx=(x1+x2)/2;
        hops += `<path d="M ${x1} 72 Q ${mx} ${38} ${x2} 72" fill="none" stroke="#E05B5B" stroke-width="3"/>`;
      }
    } else { // maju dari mulai sebanyak n
      for(let i=0;i<n;i++){
        const x1=x(mulai+i), x2=x(mulai+i+1), mx=(x1+x2)/2;
        hops += `<path d="M ${x1} 72 Q ${mx} ${38} ${x2} 72" fill="none" stroke="#2FB673" stroke-width="3"/>`;
      }
    }
    return `<svg class="numline" viewBox="0 0 ${w} ${h+4}">
      <line x1="${pad-8}" y1="75" x2="${w-pad+8}" y2="75" stroke="#1D2B50" stroke-width="3"/>
      ${ticks}${hops}
      <text x="${x(mulai)-8}" y="30" font-size="20">🐇</text>
    </svg>`;
  }
  // Segitiga fakta versi tambah-kurang.
  function segitigaKurangHTML(atas, kiri, kanan){
    const kotak = v => `<div style="display:inline-block;min-width:52px;padding:10px 12px;border-radius:12px;
      background:${v==="?"?"#FFD34D":"#EDF1FB"};font-weight:800;font-size:24px;color:#1D2B50">${v}</div>`;
    return `<div style="margin:12px auto;max-width:260px">
      <div>${kotak(atas)}</div>
      <div class="small" style="margin:4px 0">➕ &nbsp;⟷&nbsp; ➖</div>
      <div style="display:flex;justify-content:space-around">${kotak(kiri)}${kotak(kanan)}</div>
    </div>`;
  }

  // ---------- GENERATOR ----------
  // Pasangan (a kecil, b besar-ish) dengan c = a+b ≤ 20, keduanya ≥ 1.
  const pasangAB = () => { const a=rnd(1,9), b=rnd(1, Math.min(9, 20-a)); return [a,b,a+b]; };

  function tenframeKurang(){ // K2.1 · ambil dari bingkai
    const total = Math.random()<.6 ? rnd(5,10) : rnd(11,20);
    const ambil = rnd(1, total-1);
    return { tipe:"tfk", total, ambil,
      teks:`Ada <b>${total}</b> titik. <b>${ambil}</b> dicoret. Berapa yang tersisa?`,
      jawaban: total-ambil, mode:"keypad",
      strategi:`Hitung yang masih biru! Atau pikirkan: ${ambil} + ? = ${total}.` };
  }
  function bandingBaris(){ // K2.2 · selisih dengan menjodohkan
    const kecil = rnd(2,8), selisih = rnd(1, Math.min(6, 12-kecil));
    const besar = kecil + selisih, e = EMOJI[rnd(0,EMOJI.length-1)];
    return { tipe:"banding", besar, kecil, emoji:e,
      teks:`Baris atas <b>${besar}</b>, baris bawah <b>${kecil}</b>. Berapa yang TIDAK punya pasangan?`,
      jawaban: selisih, mode:"pilihan", opsi:Gen.pilihan(selisih),
      strategi:`Jodohkan satu-satu! ${besar} − ${kecil} = ${selisih}, karena ${kecil} + ${selisih} = ${besar}.` };
  }
  function barModel(){ // K2.3 · bagian yang hilang
    const [a,b,c] = pasangAB();
    return { tipe:"bar", total:c, bagian:a,
      teks:`Keseluruhan <b>${c}</b>. Satu bagian <b>${a}</b>. Berapa bagian yang lain?`,
      jawaban:b, mode:"keypad",
      strategi:`Bagian + bagian = keseluruhan: ${a} + ? = ${c} → ${b}.` };
  }
  function garisKurang(){ // K2.4 · dua arah di garis yang sama
    if(Math.random()<.5){ // mundur (makna ambil)
      const n = rnd(1,4), mulai = rnd(n+1, 20);
      return { tipe:"garisK", mulai, n, arah:"mundur",
        teks:`Kelinci mulai di <b>${mulai}</b> dan melompat MUNDUR <b>${n}</b> kali. Mendarat di angka berapa?`,
        jawaban: mulai-n, mode:"keypad",
        strategi:`Mundur ${n} langkah dari ${mulai}: ${Array.from({length:n},(_,i)=>mulai-i-1).join(", ")}.` };
    }
    // maju untuk selisih (makna melengkapi)
    const mulai = rnd(3,15), n = rnd(1, Math.min(5, 20-mulai));
    return { tipe:"garisK", mulai, n, arah:"maju",
      teks:`Kelinci di <b>${mulai}</b>, ingin sampai ke <b>${mulai+n}</b>. Berapa lompatan? (Ini juga ${mulai+n} − ${mulai}!)`,
      jawaban:n, mode:"keypad",
      strategi:`MAJU dari ${mulai} sampai ${mulai+n} — hitung lompatannya: ${n}. Selisih tidak harus mundur!` };
  }
  function campurK2(){ return [tenframeKurang, bandingBaris, barModel, garisKurang][rnd(0,3)](); }

  function pasangKurang(){ // K3.1 · cocokkan representasi
    const [a,b,c] = pasangAB();
    const v = rnd(0,2);
    if(v===0){ // bar model -> kalimat (pengecoh dijamin salah, tanpa duplikat)
      const benar = `${c} − ${a} = ${b}`;
      const opsi = acak([benar, `${c} − ${a} = ${b+1}`, `${c+1} − ${a} = ${b}`, `${c} − ${a+1} = ${b}`]);
      return { tipe:"bar", total:c, bagian:a, teks:"Bar ini cocok dengan kalimat pengurangan yang mana?",
        jawaban:benar, mode:"pilihanTeks", opsi };
    }
    if(v===1){ // simbol kurang -> makna penjumlahan rumpang
      const benar = `${a} + ? = ${c}`;
      const opsi = acak([benar, `${c} + ? = ${a}`, `${a} + ? = ${c+1}`, `${a} − ? = ${c}`]);
      return { tipe:"polos", teksBesar:`${c} − ${a}`, teks:"Sama artinya dengan mencari...?",
        jawaban:benar, mode:"pilihanTeks", opsi,
        strategi:`Kurang = cari pasangan tambahnya! ${a} + ${b} = ${c}.` };
    }
    return { tipe:"bar", total:c, bagian:a, teksBesar:`${c} − ${a}`, teks:"Berapa hasilnya? (lihat bar-nya!)",
      jawaban:b, mode:"pilihan", opsi:Gen.pilihan(b) };
  }
  function segitigaKurang(){ // K3.2 · keluarga fakta tambah-kurang
    const [a,b,c] = pasangAB();
    const v = rnd(0,2);
    if(v===0) return { tipe:"segitigaK", visual:segitigaKurangHTML("?", a, b),
      teks:`Kakinya ${a} dan ${b}. Angka puncaknya (keseluruhan) berapa?`,
      jawaban:c, mode:"keypad", strategi:`Naik = TAMBAH: ${a} + ${b} = ${c}. Turun = KURANG: ${c} − ${a} = ${b}.` };
    if(v===1) return { tipe:"segitigaK", visual:segitigaKurangHTML(c, "?", b),
      teks:`Puncaknya ${c}, satu kakinya ${b}. Kaki yang tertutup berapa?`,
      jawaban:a, mode:"keypad", strategi:`Turun = KURANG: ${c} − ${b} = ${a}. Cek: ${a} + ${b} = ${c}.` };
    return { tipe:"segitigaK", visual:segitigaKurangHTML(c, a, "?"),
      teks:`Puncaknya ${c}, satu kakinya ${a}. Kaki yang tertutup berapa?`,
      jawaban:b, mode:"keypad", strategi:`Turun = KURANG: ${c} − ${a} = ${b}. Cek: ${a} + ${b} = ${c}.` };
  }
  function simbolKurang(){ // K3.3 · simbol murni + rumpang dua arah
    const [a,b,c] = pasangAB();
    const v = rnd(0,2);
    const s = `Pikirkan penjumlahannya: ${a} + ${b} = ${c}.`;
    if(v===0) return { tipe:"polos", teksBesar:`${c} − ${a} = ?`, jawaban:b, mode:"keypad", strategi:s };
    if(v===1) return { tipe:"polos", teksBesar:`${c} − ? = ${b}`, jawaban:a, mode:"keypad", strategi:s };
    return { tipe:"polos", teksBesar:`? − ${a} = ${b}`, jawaban:c, mode:"keypad",
      strategi:`Yang dikurangi pasti paling besar! ${a} + ${b} = ${c}. ${s}` };
  }
  function gerbangKurang(i){ // K3.4 · 12 soal terstruktur
    const [a,b,c] = pasangAB();
    if(i<8) return { tipe:"polos", teksBesar:`${c} − ${a} = ?`, jawaban:b, mode:"keypad" };
    if(i<10) return pasangKurang();
    return { tipe:"polos", teksBesar:`${c} − ? = ${b}`, jawaban:a, mode:"keypad" };
  }

  // K5 — campuran tambah-kurang dari kartu yang SUDAH dipelajari kedua modul
  function soalDariKartuKurang(){
    const ids = Object.keys(K().kartu);
    const pool = ids.length ? ids : Object.keys(KARTU_KURANG_MAP);
    const s = LeitnerK.soalKartu(pool[rnd(0,pool.length-1)]);
    return { tipe:"polos", teksBesar:`${s.teks} = ?`, jawaban:s.jawaban, mode:"keypad", strategi:s.strategi };
  }
  function soalDariKartuTambahK(){
    const p = State.P();
    const ids = Object.keys((p.tambah&&p.tambah.kartu)||{});
    const pool = ids.length ? ids : Object.keys(KARTU_TAMBAH_MAP);
    const s = LeitnerTambah.soalKartu(pool[rnd(0,pool.length-1)]);
    return { tipe:"polos", teksBesar:`${s.teks} = ?`, jawaban:s.jawaban, mode:"keypad", strategi:s.strategi };
  }
  function campurTambahKurang(){ return Math.random()<.5 ? soalDariKartuTambahK() : soalDariKartuKurang(); }

  function ceritaKurang(){ // K5.3 · tiga makna (ambil/banding/bagian)
    const t = SOAL_CERITA_KURANG[rnd(0, SOAL_CERITA_KURANG.length-1)];
    const a = rnd(t.a[0], t.a[1]), b = rnd(t.b[0], t.b[1]), total = a+b;
    const teks = t.t.replace("{total}", total).replace("{a}", a);
    const strategi = {
      ambil:   `Diambil ${a} dari ${total}: pikirkan ${a} + ? = ${total} → ${b}.`,
      banding: `Selisih! MAJU dari ${a} ke ${total}: ${b} langkah. ${total} − ${a} = ${b}.`,
      bagian:  `Bagian + bagian = keseluruhan: ${a} + ? = ${total} → ${b}.`
    }[t.tipe];
    return { tipe:"polos", teks:`<span class="q-text">${teks}</span>`, jawaban:b, mode:"keypad", strategi };
  }

  const petaGenKurang = { tenframeKurang, bandingBaris, barModel, garisKurang, campurK2,
    pasangKurang, segitigaKurang, simbolKurang, gerbangKurang,
    campurTambahKurang, rekorKurang: campurTambahKurang, ceritaKurang };

  const genAsli = Gen.buat;
  Gen.buat = function(gen, i){
    if(petaGenKurang[gen]) return petaGenKurang[gen](i);
    return genAsli(gen, i);
  };

  // Pemetaan visual tipe baru → "polos" (dirantai setelah pembungkus modul lain).
  const mulaiSesiAsli = V.mulaiSesi;
  V.mulaiSesi = function(cfg){
    const buatAsli = cfg.buatSoal;
    cfg.buatSoal = function(i){
      const q = buatAsli(i);
      if(q.tipe==="tfk")       return Object.assign({}, q, { tipe:"polos", teks:(q.teks||"") + tenframeKurangHTML(q.total, q.ambil) });
      if(q.tipe==="banding")   return Object.assign({}, q, { tipe:"polos", teks:(q.teks||"") + bandingHTML(q.besar, q.kecil, q.emoji) });
      if(q.tipe==="bar")       return Object.assign({}, q, { tipe:"polos", teks:(q.teks||"") + barModelHTML(q.total, q.bagian, "?") });
      if(q.tipe==="garisK")    return Object.assign({}, q, { tipe:"polos", teks:(q.teks||"") + garisKurangHTML(q.mulai, q.n, q.arah) });
      if(q.tipe==="segitigaK") return Object.assign({}, q, { tipe:"polos", teks:(q.visual||"") + `<div class="q-text">${q.teks||""}</div>` });
      return q;
    };
    return mulaiSesiAsli(cfg);
  };

  // ---------- PETA: PULAU PENGURANGAN ----------
  function ruteKurang(id){
    const t = KK.level[id].tipe;
    if(t==="misi") return "misiKurang";
    if(t==="asesmen_misi") return "asesmenMisiKurang";
    if(t==="leitner") return "hubK4";
    if(t==="fluensi") return "faseK5";
    return "sesiKurang";
  }
  function tipeLabelK(t){
    return {misi:"Misi benda nyata 🏠", asesmen_misi:"Dinilai orang tua",
      latihan:"Latihan 10 soal", asesmen:"Ujian fase", gerbang:"Ujian gerbang 12 soal",
      leitner:"Strategi + kartu pintar", fluensi:"Mode bebas"}[t] || "";
  }

  function htmlPulauKurang(){
    if(!StateK.modulTerbuka()){
      return `<div class="fase-header" style="margin-top:14px"><span class="badge">➖</span>
          <span><b>Pulau Pengurangan</b></span></div>
        <div class="card">
          <p>🔒 Pulau ini terbuka setelah level <b>${KK.syaratModul}</b> penjumlahan (Fakta +2) tamat.
          Begitu keluarga fakta tambahmu hafal, fakta kurangnya tinggal dipanen! 🌾</p>
        </div>`;
    }
    const aktif = StateK.levelAktif();
    const due = StateK.kartuJatuhTempo().length;
    let html = `
      <div class="fase-header" style="margin-top:14px"><span class="badge">➖</span>
        <span><b>Pulau Pengurangan</b> — tambah dan kurang bersaudara</span></div>
      <div class="card">
        <p class="small">Misi penguranganmu: <b>${KK.level[aktif].nama}</b>${due?` · 🔔 ${due} kartu − menunggu`:""}</p>
        <button class="btn btn-accent btn-sm" onclick="App.go('${ruteKurang(aktif)}','${aktif}')">▶️ Main Pengurangan</button>
      </div>`;
    KK.fase.forEach(f=>{
      html += `<div class="fase-header"><span class="badge">${f.emoji}</span><span>${f.nama} — ${f.desc}</span></div><div class="level-path">`;
      KK.urutan.filter(id=>KK.level[id].fase===f.id).forEach(id=>{
        const lv = KK.level[id];
        const buka = StateK.levelTerbuka(id);
        const lulus = lv.fase===5 ? false : StateK.levelLulus(id);
        const isAktif = id===aktif;
        const kunci = lv.syaratTambah && !StateTambah.levelLulus(lv.syaratTambah)
          ? `<span class="small"> · butuh level +${lv.syaratTambah} tamat</span>` : "";
        const status = lulus ? "✅" : !buka ? "🔒" : lv.fase===5 ? "🏆" : (isAktif?"⭐":"🟡");
        const sesi = ["latihan","asesmen","gerbang","leitner"].includes(lv.tipe) && lv.fase!==5
          ? `<span class="small"> · sesi lulus ${StateK.jumlahSesiLulus(id)}/${State.sesiDibutuhkan()}</span>` : "";
        html += `<button class="level-node ${lulus?'done':isAktif?'active':buka?'':'locked'}"
            ${buka?`onclick="App.go('${ruteKurang(id)}','${id}')"`:"disabled"}>
          <div class="bubble">${id}</div>
          <div class="info"><div class="name">${lv.nama}</div><div class="desc">${tipeLabelK(lv.tipe)}${sesi}${kunci}</div></div>
          <div class="status">${status}</div>
        </button>`;
      });
      html += `</div>`;
    });
    return html;
  }
  window.PULAU = window.PULAU || {};
  window.PULAU.kurang = { label:"Pengurangan", emoji:"➖", html: htmlPulauKurang };

  // ---------- LAYAR: MISI KONKRET K1 ----------
  V.misiKurang = function(id){
    const m = MISI_KURANG[id];
    const sudah = K().misi[id];
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
        <button class="btn btn-success" style="margin-top:8px" onclick="V._misiKurangSelesai('${id}')">
          ${sudah ? "✅ Sudah selesai — perbarui" : "Misi Selesai! ✅"}</button>
      </div>`;
  };
  V._misiKurangSelesai = function(id){
    const jawab = document.getElementById("misi-jawab").value.trim();
    if(!jawab){ R.toast("Tulis dulu hasilnya ya 😊"); return; }
    K().misi[id] = { selesai:true, jawaban:jawab, tgl: State.todayStr() };
    State.save();
    State.sentuhStreak(); State.tambahBintang(5); window.updateHud();
    Sync.sesiSelesai("misi_konkret", id, 1, 1, 0, {jawaban:jawab});
    R.konfeti(); R.toast("Hebat! +5 ⭐");
    setTimeout(()=>App.go("peta"), 900);
  };

  V.asesmenMisiKurang = function(id){
    const m = MISI_KURANG[id];
    document.getElementById("topbar-title").textContent = m.judul;
    scr().innerHTML = `
      <div class="card center"><div style="font-size:56px">${m.emoji}</div><h2>${m.judul}</h2>
        <p class="small">${m.instruksi}</p></div>
      <div class="card">
        ${m.tugas.map((t,i)=>`<label class="check-row"><input type="checkbox" id="amk-${i}"><span>${t}</span></label>`).join("")}
        <p class="small">🎯 ${m.target}</p>
        <button class="btn btn-success" onclick="V._asesmenMisiKurangSelesai('${id}',${m.tugas.length})">Nilai Hasilnya</button>
      </div>`;
  };
  V._asesmenMisiKurangSelesai = function(id, n){
    let benar = 0;
    for(let i=0;i<n;i++) if(document.getElementById("amk-"+i).checked) benar++;
    const lulus = benar >= KK.level[id].lulusMin;
    K().misi[id] = { selesai:true, lulus, benar, dari:n, tgl: State.todayStr() };
    State.save();
    State.sentuhStreak(); window.updateHud();
    Sync.sesiSelesai("misi_konkret", id, n, benar, 0, {lulus});
    if(lulus){ State.tambahBintang(10); R.konfeti(); R.toast(`Lulus Fase K1! ${benar}/${n} benar 🎉 +10 ⭐`); setTimeout(()=>App.go("peta"),1200); }
    else { R.toast(`${benar}/${n} benar. Ulangi Misi K1.3 dan K1.4 dulu ya, lalu coba lagi 💪`); }
  };

  // ---------- LAYAR: SESI LEVEL K2 & K3 ----------
  V.sesiKurang = function(levelId){
    const lv = KK.level[levelId];
    V.mulaiSesi({
      judul: `${levelId} · ${lv.nama}`,
      total: lv.soal,
      buatSoal: (i)=> Gen.buat(lv.gen, i),
      onSelesai: (h)=>{
        const lulus = h.benar >= lv.lulus;
        if(lulus){ StateK.catatSesiLulus(levelId); State.tambahBintang(10); }
        State.sentuhStreak(); window.updateHud();
        Sync.sesiSelesai(lv.tipe, levelId, h.total, h.benar, h.durasi, {salah:h.salah});
        const sisa = State.sesiDibutuhkan() - StateK.jumlahSesiLulus(levelId);
        let pesan;
        if(StateK.levelLulus(levelId)){ pesan = "Level TAMAT! Level berikutnya terbuka 🔓"; R.konfeti(); }
        else if(lulus) pesan = `Sesi lulus! Ulangi lagi <b>besok</b> (${sisa} sesi lagi) untuk menamatkan level ini 📅`;
        else pesan = `Butuh ${lv.lulus} benar untuk lulus. Ayo coba lagi, kamu pasti bisa 💪`;
        scr().innerHTML = `
          <div class="card center">
            <div class="celebrate">${lulus?"🌟":"🌱"}</div>
            <h2>${h.benar} / ${h.total} benar</h2>
            <p>${pesan}</p>
            <div class="btn-row" style="margin-top:10px">
              <button class="btn btn-ghost" onclick="App.go('peta')">Peta 🗺️</button>
              <button class="btn btn-accent" onclick="App.go('sesiKurang','${levelId}')">Main Lagi 🔁</button>
            </div>
          </div>`;
      }
    });
  };

  // ---------- LAYAR: FASE K4 (LEITNER) ----------
  V.hubK4 = function(levelId){
    StateK.bukaKartuLevel(levelId);
    const lv = KK.level[levelId];
    const kk = K();
    const ids = KARTU_KURANG_PER_LEVEL[levelId]||[];
    const due = StateK.kartuJatuhTempo().length + Math.min(StateK.kartuBaru().length, KK.leitner.maksKartuBaru);
    const sisa = State.sesiDibutuhkan() - StateK.jumlahSesiLulus(levelId);
    document.getElementById("topbar-title").textContent = `${levelId} · ${lv.nama}`;

    const kartuHtml = ids.map(id=>{
      const k = KARTU_KURANG_MAP[id], st = kk.kartu[id];
      return `<div class="box-badge ${st && st.kotak>=3?'on':''}">${k.hasil}−${k.a} · kotak ${st?st.kotak:1}</div>`;
    }).join("");

    scr().innerHTML = `
      <div class="card">
        <h2>➖ ${lv.nama}</h2>
        <div class="strategy-box">💡 <b>Strategi jitu:</b> ${lv.strategiUmum}</div>
        <p class="small" style="margin-top:8px">Kartu level ini (keluarga fakta +${lv.syaratTambah} yang sudah kamu hafal!):</p>
        <div class="box-badges">${kartuHtml}</div>
      </div>
      <div class="card">
        <h3>🃏 Latihan Kartu Pintar</h3>
        <p class="small">Kartu − yang siap dilatih hari ini: <b>${due}</b>. Salah → kembali ke Kotak 1 + lihat fakta penjumlahan pasangannya.</p>
        <button class="btn btn-accent" onclick="App.go('latihanKartuKurang')" ${due?"":"disabled"}>${due?`Latihan Sekarang (${due} kartu)`:"Semua kartu sudah dilatih — kembali besok! 🌙"}</button>
      </div>
      <div class="card">
        <h3>🎓 Ujian Level</h3>
        <p class="small">Semua kartu level ini + ${KK.asesmen4.acakSebelumnya} kartu acak level sebelumnya. Lulus 90% pada ${State.sesiDibutuhkan()} sesi beda hari. Sisa: <b>${Math.max(sisa,0)} sesi</b>.</p>
        <button class="btn btn-success" onclick="App.go('ujianK4','${levelId}')">Mulai Ujian Level</button>
      </div>`;
  };

  V.latihanKartuKurang = function(){
    const ids = LeitnerK.susunSesi();
    if(!ids.length){ R.toast("Tidak ada kartu − jatuh tempo hari ini 🌙"); return App.go("peta"); }
    V.mulaiSesi({
      judul: "🃏 Latihan Kartu Pengurangan",
      total: ids.length,
      buatSoal: (i)=> { const s = LeitnerK.soalKartu(ids[i]); return { tipe:"polos", teksBesar:`${s.teks} = ?`, jawaban:s.jawaban, mode:"keypad", strategi:s.strategi, id:s.id }; },
      onJawabPertama: (q, benar)=> StateK.jawabKartu(q.id, benar),
      onSelesai: (h)=>{
        State.sentuhStreak(); window.updateHud();
        Sync.sesiSelesai("leitner", StateK.levelAktif(), h.total, h.benar, h.durasi, {salah:h.salah});
        scr().innerHTML = `
          <div class="card center">
            <div class="celebrate">🃏</div>
            <h2>${h.benar} / ${h.total} kartu benar</h2>
            <p class="small">Setiap kartu pengurangan adalah keluarga fakta penjumlahan yang sudah kamu kenal. Naik kotak = makin jarang muncul!</p>
            <button class="btn" style="margin-top:10px" onclick="App.go('peta')">Kembali ke Peta 🗺️</button>
          </div>`;
      }
    });
  };

  V.ujianK4 = function(levelId){
    const ids = LeitnerK.susunAsesmen(levelId);
    const lulusMin = Math.ceil(ids.length * KK.asesmen4.persenLulus);
    V.mulaiSesi({
      judul: `🎓 Ujian ${levelId}`,
      total: ids.length,
      tanpaUlang: true,
      buatSoal: (i)=> { const s = LeitnerK.soalKartu(ids[i]); return { tipe:"polos", teksBesar:`${s.teks} = ?`, jawaban:s.jawaban, mode:"keypad", id:s.id }; },
      onSelesai: (h)=>{
        const lulus = h.benar >= lulusMin;
        if(lulus){ StateK.catatSesiLulus(levelId); State.tambahBintang(15); }
        State.sentuhStreak(); window.updateHud();
        Sync.sesiSelesai("asesmen", levelId, h.total, h.benar, h.durasi, {salah:h.salah, lulus});
        const tamat = StateK.levelLulus(levelId);
        if(tamat && levelId==="K4.9") return V.sertifikatKurang();
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
              <button class="btn btn-accent" onclick="App.go('hubK4','${levelId}')">Kembali ke Level</button>
            </div>
          </div>`;
      }
    });
  };

  // ---------- LAYAR: FASE K5 ----------
  V.faseK5 = function(levelId){
    const lv = KK.level[levelId];
    if(levelId==="K5.4") return V.pemeliharaanKurang();
    const timer = levelId==="K5.2";
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
          const rk = K().rekor;
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
              <button class="btn btn-accent" onclick="App.go('faseK5','${levelId}')">Main Lagi 🔁</button>
            </div>
          </div>`;
      }
    });
  };

  V.pemeliharaanKurang = function(){
    const ids = StateK.kartuJatuhTempo();
    if(!ids.length){
      scr().innerHTML = `<div class="card center"><div class="celebrate">🌙</div>
        <h2>Semua kartu − aman!</h2><p>Tidak ada kartu pengurangan jatuh tempo hari ini.</p>
        <button class="btn" onclick="App.go('peta')">Kembali 🗺️</button></div>`;
      return;
    }
    V.latihanKartuKurang();
  };

  // ---------- SERTIFIKAT PENGURANGAN ----------
  V.sertifikatKurang = function(){
    R.konfeti();
    const p = State.P();
    scr().innerHTML = `
      <div class="certificate">
        <div style="font-size:56px">➖🏆</div>
        <h1>SERTIFIKAT JUARA PENGURANGAN</h1>
        <p>diberikan kepada</p>
        <h1 style="font-size:34px">${esc(p.nama)}</h1>
        <p>yang telah menguasai <b>seluruh fakta pengurangan sampai 20</b><br>
        dengan rahasia para juara: tambah dan kurang itu bersaudara!</p>
        <p class="small">${new Date().toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"})}</p>
      </div>
      <div class="btn-row" style="margin-top:12px">
        <button class="btn btn-ghost" onclick="window.print()">🖨️ Cetak</button>
        <button class="btn" onclick="App.go('peta')">Peta 🗺️</button>
      </div>`;
  };

  // ---------- SINKRONISASI: tambahkan modul kurang (rantai ke-2) ----------
  const snapAsli = State.snapshotProgres;
  State.snapshotProgres = function(){
    const s = snapAsli(); // sudah memuat kali + bagi + tambah
    const p = State.P();
    const kurang = p.kurang || {};
    s.kartu = s.kartu.concat(Object.entries(kurang.kartu||{}).map(([id,k])=>
      ({ kartu_id:id, kotak:k.kotak, jatuh_tempo:k.jatuhTempo, benar:k.br, salah:k.bs })));
    try{
      const aj = JSON.parse(s.asesmen_json);
      aj.kurang = kurang.sesiLulus || {};
      s.asesmen_json = JSON.stringify(aj);
    }catch(e){}
    s.level_aktif += ` −${StateK.modulTerbuka()?StateK.levelAktif():"🔒"}`;
    return s;
  };

  // ---------- RESET PROFIL: hapus progres KEEMPAT modul ----------
  V._resetProfil = function(){
    if(!confirm("Yakin menghapus SELURUH progres anak ini? Tidak bisa dibatalkan.")) return;
    const p = State.P();
    const baru = { nama: p.nama, kelas: p.kelas, id: p.id };
    Object.assign(p, { bintang:0, streak:0, lastPlayDate:null, sesiLulus:{}, misi:{}, levelDibuka4:[], kartu:{}, rekor:[], pemeliharaanTerakhir:null }, baru);
    delete p.bagi;
    delete p.tambah;
    delete p.kurang;
    State.save(); R.toast("Progres direset"); App.go("ortu");
  };
})();
