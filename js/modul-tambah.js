// ====== MODUL PENJUMLAHAN — integrasi tanpa mengubah mesin inti ======
// Menambahkan: StateTambah (progres di p.tambah), LeitnerTambah,
// renderer bingkai-10 / garis bilangan 0-20 / papan linear (Siegler & Ramani),
// 13 generator A2-A5, layar V.*Tambah, Pulau Penjumlahan di registry peta,
// dan PERLUASAN snapshotProgres agar sinkronisasi Google Sheets memuat
// kartu + progres KETIGA modul (kali, bagi, tambah).
// Muat SETELAH modul-bagi.js dan SEBELUM app.js.
(function(){
  const scr = () => document.getElementById("screen");
  const esc = s => String(s??"").replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const rnd = (lo,hi) => lo + Math.floor(Math.random()*(hi-lo+1));
  const acak = arr => arr.slice().sort(()=>Math.random()-.5);
  const KT = window.KURIKULUM_TAMBAH;

  // ---------- STATE (namespace p.tambah) ----------
  const T = () => {
    const p = State.P();
    p.tambah ||= { sesiLulus:{}, misi:{}, levelDibuka4:[], kartu:{}, rekor:[] };
    p.tambah.rekor ||= [];
    return p.tambah;
  };

  const StateT = {
    modulTerbuka(){ return true; }, // syaratModul: null — selalu terbuka (kelas 1-2)
    catatSesiLulus(id){
      const arr = (T().sesiLulus[id] ||= []);
      const t = State.todayStr();
      if(State.raw.testMode || !arr.includes(t)) arr.push(t);
      State.save();
    },
    jumlahSesiLulus(id){
      const arr = T().sesiLulus[id] || [];
      return State.raw.testMode ? arr.length : new Set(arr).size;
    },
    levelLulus(id){
      const lv = KT.level[id];
      if(lv.tipe==="misi") return !!(T().misi[id] && T().misi[id].selesai);
      if(lv.tipe==="asesmen_misi") return !!(T().misi[id] && T().misi[id].lulus);
      if(lv.fase===5) return true;
      return this.jumlahSesiLulus(id) >= State.sesiDibutuhkan();
    },
    levelTerbuka(id){
      if(State.raw.testMode) return true; // Mode Uji Coba: semua terbuka
      const lv = KT.level[id];
      const idx = KT.urutan.indexOf(id);
      if(idx===0) return true;
      if(lv.fase===5) return this.levelLulus("A4.9");
      return this.levelLulus(KT.urutan[idx-1]);
    },
    levelAktif(){
      for(const id of KT.urutan){ if(!this.levelLulus(id)) return id; }
      return "A5.1";
    },
    bukaKartuLevel(id){
      const t = T();
      if(t.levelDibuka4.includes(id)) return;
      t.levelDibuka4.push(id);
      (KARTU_TAMBAH_PER_LEVEL[id]||[]).forEach(cid=>{
        if(!t.kartu[cid]) t.kartu[cid] = { kotak:1, jatuhTempo: State.todayStr(), br:0, bs:0, baru:true };
      });
      State.save();
    },
    jawabKartu(cid, benar){
      const k = T().kartu[cid];
      if(!k) return;
      k.baru = false;
      if(benar){ k.br++; k.kotak = Math.min(5, k.kotak+1); }
      else     { k.bs++; k.kotak = 1; }
      k.jatuhTempo = State.addDays(State.todayStr(), KT.leitner.intervalHari[k.kotak]);
      State.save();
    },
    kartuJatuhTempo(){
      const t = State.todayStr();
      return Object.entries(T().kartu).filter(([,k])=>!k.baru && k.jatuhTempo<=t).map(([id])=>id);
    },
    kartuBaru(){ return Object.entries(T().kartu).filter(([,k])=>k.baru).map(([id])=>id); }
  };
  window.StateTambah = StateT;

  // ---------- LEITNER ----------
  const URUTAN_A4 = ["A4.1","A4.2","A4.3","A4.4","A4.5","A4.6","A4.7","A4.8","A4.9"];
  const LeitnerT = {
    susunSesi(){
      const L = KT.leitner;
      const due = acak(StateT.kartuJatuhTempo());
      const baru = acak(StateT.kartuBaru()).slice(0, L.maksKartuBaru);
      return due.concat(baru).slice(0, L.maksKartuSesi);
    },
    // dua arah a+b / b+a, seperti kartu perkalian
    soalKartu(id){
      const k = KARTU_TAMBAH_MAP[id];
      const balik = Math.random() < .5 && k.a !== k.b;
      return { id, teks: balik ? `${k.b} + ${k.a}` : `${k.a} + ${k.b}`,
               jawaban: k.jawaban, strategi: k.strategi };
    },
    susunAsesmen(levelId){
      const milik = (KARTU_TAMBAH_PER_LEVEL[levelId]||[]).slice();
      const sebelum = URUTAN_A4.slice(0, URUTAN_A4.indexOf(levelId))
        .flatMap(l => KARTU_TAMBAH_PER_LEVEL[l]||[]);
      const tambahan = acak(sebelum).slice(0, KT.asesmen4.acakSebelumnya);
      return acak(milik.concat(tambahan));
    }
  };
  window.LeitnerTambah = LeitnerT;

  // ---------- RENDERER VISUAL BARU ----------
  // Bingkai-10: kotak 2x5; titik biru (a) lalu merah (b); 2 bingkai bila >10.
  function tenframeHTML(a, b, opts={}){
    const total = a + b;
    const frames = total > 10 ? 2 : 1;
    let html = `<div class="${opts.samar?'array-wrap faded':''}" style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin:12px 0">`;
    for(let f=0; f<frames; f++){
      let cells = "";
      for(let c=0; c<10; c++){
        const i = f*10 + c;
        const isi = i < a ? "🔵" : i < total ? "🔴" : "";
        cells += `<div style="width:34px;height:34px;border:2px solid #5A6B94;border-radius:8px;
          display:flex;align-items:center;justify-content:center;font-size:20px;background:#fff">${isi}</div>`;
      }
      html += `<div style="display:grid;grid-template-columns:repeat(5,34px);gap:4px">${cells}</div>`;
    }
    return html + `</div>`;
  }
  // Garis bilangan 0-20: kelinci mulai di a, melompat b kali satu-satuan.
  function garis20HTML(a, b){
    const maxV=20, w=480, h=110, pad=20;
    const x = v => pad + (v/maxV)*(w-2*pad);
    let ticks="", hops="";
    for(let v=0; v<=maxV; v++){
      const besar = v%5===0;
      ticks += `<line x1="${x(v)}" y1="${besar?68:71}" x2="${x(v)}" y2="80" stroke="#5A6B94" stroke-width="${besar?2:1}"/>`;
      if(besar) ticks += `<text x="${x(v)}" y="98" font-size="12" text-anchor="middle" fill="#1D2B50" font-weight="bold">${v}</text>`;
    }
    ticks += `<text x="${x(a)}" y="${a%5===0?110:96}" font-size="12" text-anchor="middle" fill="#FF9F43" font-weight="bold">${a}</text>`;
    for(let i=0;i<b;i++){
      const x1=x(a+i), x2=x(a+i+1), mx=(x1+x2)/2;
      hops += `<path d="M ${x1} 72 Q ${mx} ${38} ${x2} 72" fill="none" stroke="#FF9F43" stroke-width="3"/>`;
    }
    return `<svg class="numline" viewBox="0 0 ${w} ${h+4}">
      <line x1="${pad-8}" y1="75" x2="${w-pad+8}" y2="75" stroke="#1D2B50" stroke-width="3"/>
      ${ticks}${hops}
      <text x="${x(a)-8}" y="30" font-size="20">🐇</text>
    </svg>`;
  }
  // Papan LINEAR 1-20 (Siegler & Ramani): strip berurutan, bidak di posisi a.
  function papanHTML(a, b){
    let cells = "";
    for(let v=1; v<=20; v++){
      const bidak = v===a;
      cells += `<div style="width:38px;height:44px;border:2px solid ${bidak?'#FF9F43':'#C9D4EF'};border-radius:8px;
        display:flex;flex-direction:column;align-items:center;justify-content:center;background:${bidak?'#FFF3E0':'#fff'}">
        <span style="font-size:11px;color:#5A6B94;font-weight:bold">${v}</span>
        <span style="font-size:16px">${bidak?"🔵":""}</span></div>`;
    }
    return `<div style="margin:12px 0">
      <div style="display:grid;grid-template-columns:repeat(10,38px);gap:3px;justify-content:center">${cells}</div>
      <div class="small center" style="margin-top:8px">🎲 Dadu: <b style="font-size:18px">${b}</b> — bidak maju ${b} kotak</div>
    </div>`;
  }

  // ---------- GENERATOR ----------
  function pilihanNum(jawab){ return Gen.pilihan(jawab); }

  function tenframe(){ // A2.1 · bingkai-10: gabungkan dua warna
    const kecil = Math.random() < .6;
    const a = kecil ? rnd(2,6) : rnd(6,9);
    const b = kecil ? rnd(1, 10-a) : rnd(2, Math.min(9, 20-a));
    return { tipe:"tf", a, b,
      teks:`Ada <b>${a} biru</b> dan <b>${b} merah</b> di bingkai-10. Berapa semuanya?`,
      jawaban:a+b, mode:"keypad",
      strategi: a+b>10 ? `Bingkai pertama penuh = 10, sisanya ${a+b-10} → ${a+b}!` : `Hitung lanjut dari ${Math.max(a,b)}!` };
  }
  function garisTambah(){ // A2.2 · hitung lanjut di garis bilangan
    const a = rnd(3,15), b = rnd(1, Math.min(5, 20-a));
    return { tipe:"garis20", a, b,
      teks:`Kelinci mulai di <b>${a}</b> lalu melompat <b>${b}</b> kali. Mendarat di angka berapa?`,
      jawaban:a+b, mode:"keypad",
      strategi:`Mulai dari ${a}, lanjutkan ${b} langkah: ${Array.from({length:b},(_,i)=>a+i+1).join(", ")}.` };
  }
  function pasangan10(){ // A2.3 · sahabat 10
    const n = rnd(1,9);
    return { tipe:"tf", a:n, b:0,
      teks:`Bingkai terisi <b>${n}</b>. Berapa lagi supaya <b>penuh 10</b>?`,
      jawaban:10-n, mode:"pilihan", opsi:pilihanNum(10-n),
      strategi:`Sahabat 10: ${n} berpasangan dengan ${10-n}. Lihat kotak yang kosong!` };
  }
  function papanLinear(){ // A2.4 · papan ular linear (Siegler & Ramani)
    const a = rnd(1,14), b = rnd(1, Math.min(6, 20-a));
    return { tipe:"papan", a, b,
      teks:`Bidak ada di kotak <b>${a}</b>. Dadu menunjukkan <b>${b}</b>. Bidak mendarat di kotak berapa?`,
      jawaban:a+b, mode:"keypad",
      strategi:`Maju satu-satu dari ${a}: ${Array.from({length:b},(_,i)=>a+i+1).join(", ")}.` };
  }
  function campurA2(){ return [tenframe, garisTambah, pasangan10, papanLinear][rnd(0,3)](); }

  function pasangTambah(){ // A3.1 · cocokkan representasi
    const v = rnd(0,2);
    if(v===0){ // bingkai -> kalimat (pengecoh dijamin salah)
      const a = rnd(2,7), b = rnd(2, Math.min(9, 20-a));
      const benar = `${a} + ${b} = ${a+b}`;
      const opsi = acak([benar, `${a} + ${b+1} = ${a+b}`, `${a+1} + ${b} = ${a+b}`, `${a} + ${b} = ${a+b+1}`]);
      return { tipe:"tf", a, b, teks:"Bingkai ini cocok dengan kalimat yang mana?",
        jawaban:benar, mode:"pilihanTeks", opsi };
    }
    if(v===1){ // make-ten: bentuk 10-an yang senilai
      const a = rnd(8,9), b = rnd(3, 7);
      const benar = `10 + ${a+b-10}`;
      // pengecoh dijamin salah & tak ada duplikat untuk semua a (8-9), b (3-7)
      const opsi = acak([benar, `${a} + 10`, `10 + ${a+b-10+2}`, `10 + ${a+b-10-1}`]);
      return { tipe:"polos", teksBesar:`${a} + ${b}`, teks:"Mana bentuk SEPULUHAN yang nilainya sama?",
        jawaban:benar, mode:"pilihanTeks", opsi,
        strategi:`${a} minta ${10-a}! Ambil ${10-a} dari ${b} → 10 + ${a+b-10} = ${a+b}.` };
    }
    const a = rnd(2,7), b = rnd(2, Math.min(9, 20-a));
    return { tipe:"tf", a, b, teksBesar:`${a} + ${b}`, teks:"Berapa hasilnya? (lihat bingkainya!)",
      jawaban:a+b, mode:"pilihan", opsi:pilihanNum(a+b) };
  }
  function simbolBantuTambah(){ // A3.2 · simbol + bingkai samar
    const a = rnd(3,9), b = rnd(2, Math.min(9, 20-a));
    return { tipe:"tf", a, b, samar:true, teksBesar:`${a} + ${b} = ?`,
      teks:`<span class="small">Gambar bantuannya samar — coba jawab dulu tanpa melihat!</span>
        <div class="center"><button class="btn btn-ghost btn-sm" onclick="R.tampilkanArraySamar(this)">👀 Lihat Gambar</button></div>`,
      jawaban:a+b, mode:"keypad" };
  }
  function simbolTambah(){ // A3.3 · simbol murni + rumpang (bagian-keseluruhan)
    const a = rnd(2,9), b = rnd(1, Math.min(9, 20-a)), c = a+b;
    const v = rnd(0,2);
    const s = a>=8 && b>=3 ? `${a} minta ${10-a}: 10 + ${c-10} = ${c}.` : `Hitung lanjut dari ${Math.max(a,b)}.`;
    if(v===0) return { tipe:"polos", teksBesar:`${a} + ${b} = ?`, jawaban:c, mode:"keypad", strategi:s };
    if(v===1) return { tipe:"polos", teksBesar:`${a} + ? = ${c}`, jawaban:b, mode:"keypad",
      strategi:`Hitung lanjut dari ${a} sampai ${c} — berapa langkah?` };
    return { tipe:"polos", teksBesar:`? + ${b} = ${c}`, jawaban:a, mode:"keypad",
      strategi:`Bagian yang hilang: ${c} itu ${b} dan berapa lagi?` };
  }
  function gerbangTambah(i){ // A3.4 · 12 soal terstruktur
    const a = rnd(2,9), b = rnd(1, Math.min(9, 20-a));
    if(i<8) return { tipe:"polos", teksBesar:`${a} + ${b} = ?`, jawaban:a+b, mode:"keypad" };
    if(i<10) return pasangTambah();
    return { tipe:"polos", teksBesar:`${a} + ? = ${a+b}`, jawaban:b, mode:"keypad" };
  }

  // A5 — dari kartu yang sudah dipelajari
  function soalDariKartuTambah(){
    const ids = Object.keys(T().kartu);
    const pool = ids.length ? ids : Object.keys(KARTU_TAMBAH_MAP);
    const s = LeitnerT.soalKartu(pool[rnd(0,pool.length-1)]);
    return { tipe:"polos", teksBesar:`${s.teks} = ?`, jawaban:s.jawaban, mode:"keypad", strategi:s.strategi };
  }
  function campurTambah(){
    const q = soalDariKartuTambah();
    if(Math.random()<.25){ // rumpang: bagian-keseluruhan
      const m = q.teksBesar.match(/^(\d+) \+ (\d+) = \?$/);
      if(m){ const A=+m[1], B=+m[2];
        return { tipe:"polos", teksBesar:`${A} + ? = ${A+B}`, jawaban:B, mode:"keypad", strategi:q.strategi };
      }
    }
    return q;
  }
  function ceritaTambah(){ // A5.3 · 4 skema (gabung/ubah/banding/lengkap)
    const t = SOAL_CERITA_TAMBAH[rnd(0, SOAL_CERITA_TAMBAH.length-1)];
    const a = rnd(t.a[0], t.a[1]), b = rnd(t.b[0], t.b[1]);
    if(t.tipe === "lengkap"){
      const teks = t.t.replace("{total}", a+b).replace("{a}", a);
      return { tipe:"polos", teks:`<span class="q-text">${teks}</span>`, jawaban:b, mode:"keypad",
        strategi:`${a} + ? = ${a+b}. Hitung lanjut dari ${a} sampai ${a+b}: ${b} langkah!` };
    }
    const teks = t.t.replace("{a}", a).replace("{b}", b);
    const nama = {gabung:"MENGGABUNG dua bagian", ubah:"BERTAMBAH", banding:"LEBIH BANYAK"}[t.tipe];
    return { tipe:"polos", teks:`<span class="q-text">${teks}</span>`, jawaban:a+b, mode:"keypad",
      strategi:`Skema ${nama}: ${a} + ${b} = ${a+b}.` };
  }

  const petaGenTambah = { tenframe, garisTambah, pasangan10, papanLinear, campurA2,
    pasangTambah, simbolBantuTambah, simbolTambah, gerbangTambah,
    campurTambah, rekorTambah: campurTambah, ceritaTambah };

  const genAsli = Gen.buat;
  Gen.buat = function(gen, i){
    if(petaGenTambah[gen]) return petaGenTambah[gen](i);
    return genAsli(gen, i);
  };

  // Alat peraga bantu Fase A2: dua dadu/kartu titik yang menyesuaikan soal.
  // Membuka bantuan menandai pakaiBantuan (bintang soal itu tidak diberikan).
  function bantuDadu(q){
    if(q.samar || !window.MPT) return ""; // soal samar sudah punya tombol "Lihat Gambar"
    let isi = "";
    if(q.tipe==="tf"){
      isi = q.b===0
        ? MPT.dadu2(q.a, "?", `Dadu kiri terisi ${q.a}. Berapa titik dadu "?" supaya semuanya 10?`)
        : MPT.dadu2(q.a, q.b, "Hitung titik kedua dadu ini — atau LIHAT polanya tanpa menghitung!");
    } else if(q.tipe==="garis20"){
      isi = MPT.dadu2(q.b, null, `Titik dadu = banyaknya lompatan. Mulai dari ${q.a}, maju sebanyak titik dadu.`);
    } else if(q.tipe==="papan"){
      isi = MPT.dadu2(q.b, null, "Titik dadu = banyaknya langkah bidak. Maju satu-satu!");
    }
    if(!isi) return "";
    return `<div class="center" style="margin-top:6px">
        <button class="btn btn-ghost btn-sm" onclick="MPT.bukaBantu(this)">🎲 Alat Peraga Bantu</button>
      </div><div class="mpt-bantu" style="display:none">${isi}</div>`;
  }

  // Visual tipe baru dipetakan ke "polos" lewat pembungkus mulaiSesi (dirantai
  // setelah pembungkus modul pembagian).
  const mulaiSesiAsli = V.mulaiSesi;
  V.mulaiSesi = function(cfg){
    const buatAsli = cfg.buatSoal;
    cfg.buatSoal = function(i){
      const q = buatAsli(i);
      if(q.tipe==="tf")      return Object.assign({}, q, { tipe:"polos", teks:(q.teks||"") + tenframeHTML(q.a, q.b, {samar:q.samar}) + bantuDadu(q) });
      if(q.tipe==="garis20") return Object.assign({}, q, { tipe:"polos", teks:(q.teks||"") + garis20HTML(q.a, q.b) + bantuDadu(q) });
      if(q.tipe==="papan")   return Object.assign({}, q, { tipe:"polos", teks:(q.teks||"") + papanHTML(q.a, q.b) + bantuDadu(q) });
      return q;
    };
    return mulaiSesiAsli(cfg);
  };

  // ---------- PETA: PULAU PENJUMLAHAN ----------
  function ruteTambah(id){
    const t = KT.level[id].tipe;
    if(t==="misi") return "misiTambah";
    if(t==="asesmen_misi") return "asesmenMisiTambah";
    if(t==="leitner") return "hubA4";
    if(t==="fluensi") return "faseA5";
    return "sesiTambah";
  }
  function tipeLabelT(t){
    return {misi:"Misi benda nyata 🏠", asesmen_misi:"Dinilai orang tua",
      latihan:"Latihan 10 soal", asesmen:"Ujian fase", gerbang:"Ujian gerbang 12 soal",
      leitner:"Strategi + kartu pintar", fluensi:"Mode bebas"}[t] || "";
  }

  function htmlPulauTambah(){
    const aktif = StateT.levelAktif();
    const due = StateT.kartuJatuhTempo().length;
    let html = `
      <div class="fase-header" style="margin-top:14px"><span class="badge">➕</span>
        <span><b>Pulau Penjumlahan</b> — number sense & fakta sampai 20 (kelas 1–2)</span></div>
      <div class="card">
        <p class="small">Misi penjumlahanmu: <b>${KT.level[aktif].nama}</b>${due?` · 🔔 ${due} kartu + menunggu`:""}</p>
        <button class="btn btn-accent btn-sm" onclick="App.go('${ruteTambah(aktif)}','${aktif}')">▶️ Main Penjumlahan</button>
      </div>`;
    KT.fase.forEach(f=>{
      html += `<div class="fase-header"><span class="badge">${f.emoji}</span><span>${f.nama} — ${f.desc}</span></div><div class="level-path">`;
      KT.urutan.filter(id=>KT.level[id].fase===f.id).forEach(id=>{
        const lv = KT.level[id];
        const buka = StateT.levelTerbuka(id);
        const lulus = lv.fase===5 ? false : StateT.levelLulus(id);
        const isAktif = id===aktif;
        const status = lulus ? "✅" : !buka ? "🔒" : lv.fase===5 ? "🏆" : (isAktif?"⭐":"🟡");
        const sesi = ["latihan","asesmen","gerbang","leitner"].includes(lv.tipe) && lv.fase!==5
          ? `<span class="small"> · sesi lulus ${StateT.jumlahSesiLulus(id)}/${State.sesiDibutuhkan()}</span>` : "";
        html += `<button class="level-node ${lulus?'done':isAktif?'active':buka?'':'locked'}"
            ${buka?`onclick="App.go('${ruteTambah(id)}','${id}')"`:"disabled"}>
          <div class="bubble">${id}</div>
          <div class="info"><div class="name">${lv.nama}</div><div class="desc">${tipeLabelT(lv.tipe)}${sesi}</div></div>
          <div class="status">${status}</div>
        </button>`;
      });
      html += `</div>`;
    });
    return html;
  }
  window.PULAU = window.PULAU || {};
  window.PULAU.tambah = { label:"Penjumlahan", emoji:"➕", html: htmlPulauTambah };

  // ---------- LAYAR: MISI KONKRET A1 ----------
  V.misiTambah = function(id){
    const m = MISI_TAMBAH[id];
    const sudah = T().misi[id];
    document.getElementById("topbar-title").textContent = `Misi ${id}`;
    const punyaWidget = !!(window.MPT_CONFIG && MPT_CONFIG[id]);
    const widgetCard = punyaWidget ? `
      <div class="card">
        <h3>Pilih cara bermain:</h3>
        <div class="btn-row">
          <button class="btn btn-ghost btn-sm" onclick="V._misiTambahMode('nyata','${id}')">🏠 Benda Nyata</button>
          <button class="btn btn-accent btn-sm" onclick="V._misiTambahMode('digital','${id}')">📱 ${MPT_CONFIG[id].label}</button>
        </div>
        <div id="mpt-mount" style="margin-top:10px"><p class="small">Paling seru pakai benda sungguhan di rumah! Kalau bendanya tidak ada, tekan <b>📱 ${MPT_CONFIG[id].label}</b> untuk bermain di layar.</p></div>
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
        <button class="btn btn-success" style="margin-top:8px" onclick="V._misiTambahSelesai('${id}')">
          ${sudah ? "✅ Sudah selesai — perbarui" : "Misi Selesai! ✅"}</button>
      </div>`;
  };
  V._misiTambahMode = function(mode, id){
    const mount = document.getElementById("mpt-mount");
    if(!mount) return;
    if(mode === "digital"){ MPT.mount(id, mount); }
    else { mount.innerHTML = `<p class="small">Gunakan benda sungguhan di rumah — sentuhan tangan membuat konsep makin menempel! 🖐️</p>`; }
  };
  V._misiTambahSelesai = function(id){
    const jawab = document.getElementById("misi-jawab").value.trim();
    if(!jawab){ R.toast("Tulis dulu hasilnya ya 😊"); return; }
    T().misi[id] = { selesai:true, jawaban:jawab, tgl: State.todayStr() };
    State.save();
    State.sentuhStreak(); State.tambahBintang(5); window.updateHud();
    Sync.sesiSelesai("misi_konkret", id, 1, 1, 0, {jawaban:jawab});
    R.konfeti(); R.toast("Hebat! +5 ⭐");
    setTimeout(()=>App.go("peta"), 900);
  };

  V.asesmenMisiTambah = function(id){
    const m = MISI_TAMBAH[id];
    document.getElementById("topbar-title").textContent = m.judul;
    scr().innerHTML = `
      <div class="card center"><div style="font-size:56px">${m.emoji}</div><h2>${m.judul}</h2>
        <p class="small">${m.instruksi}</p></div>
      <div class="card">
        ${m.tugas.map((t,i)=>`<label class="check-row"><input type="checkbox" id="amt-${i}"><span>${t}</span></label>`).join("")}
        <p class="small">🎯 ${m.target}</p>
        <button class="btn btn-success" onclick="V._asesmenMisiTambahSelesai('${id}',${m.tugas.length})">Nilai Hasilnya</button>
      </div>`;
  };
  V._asesmenMisiTambahSelesai = function(id, n){
    let benar = 0;
    for(let i=0;i<n;i++) if(document.getElementById("amt-"+i).checked) benar++;
    const lulus = benar >= KT.level[id].lulusMin;
    T().misi[id] = { selesai:true, lulus, benar, dari:n, tgl: State.todayStr() };
    State.save();
    State.sentuhStreak(); window.updateHud();
    Sync.sesiSelesai("misi_konkret", id, n, benar, 0, {lulus});
    if(lulus){ State.tambahBintang(10); R.konfeti(); R.toast(`Lulus Fase A1! ${benar}/${n} benar 🎉 +10 ⭐`); setTimeout(()=>App.go("peta"),1200); }
    else { R.toast(`${benar}/${n} benar. Ulangi Misi A1.4 dan A1.5 dulu ya, lalu coba lagi 💪`); }
  };

  // ---------- LAYAR: SESI LEVEL A2 & A3 ----------
  V.sesiTambah = function(levelId){
    const lv = KT.level[levelId];
    V.mulaiSesi({
      judul: `${levelId} · ${lv.nama}`,
      total: lv.soal,
      buatSoal: (i)=> Gen.buat(lv.gen, i),
      onSelesai: (h)=>{
        const lulus = h.benar >= lv.lulus;
        if(lulus){ StateT.catatSesiLulus(levelId); State.tambahBintang(10); }
        State.sentuhStreak(); window.updateHud();
        Sync.sesiSelesai(lv.tipe, levelId, h.total, h.benar, h.durasi, {salah:h.salah});
        const sisa = State.sesiDibutuhkan() - StateT.jumlahSesiLulus(levelId);
        let pesan;
        if(StateT.levelLulus(levelId)){ pesan = "Level TAMAT! Level berikutnya terbuka 🔓"; R.konfeti(); }
        else if(lulus) pesan = `Sesi lulus! Ulangi lagi <b>besok</b> (${sisa} sesi lagi) untuk menamatkan level ini 📅`;
        else pesan = `Butuh ${lv.lulus} benar untuk lulus. Ayo coba lagi, kamu pasti bisa 💪`;
        scr().innerHTML = `
          <div class="card center">
            <div class="celebrate">${lulus?"🌟":"🌱"}</div>
            <h2>${h.benar} / ${h.total} benar</h2>
            <p>${pesan}</p>
            <div class="btn-row" style="margin-top:10px">
              <button class="btn btn-ghost" onclick="App.go('peta')">Peta 🗺️</button>
              <button class="btn btn-accent" onclick="App.go('sesiTambah','${levelId}')">Main Lagi 🔁</button>
            </div>
          </div>`;
      }
    });
  };

  // ---------- LAYAR: FASE A4 (LEITNER) ----------
  V.hubA4 = function(levelId){
    StateT.bukaKartuLevel(levelId);
    const lv = KT.level[levelId];
    const t = T();
    const ids = KARTU_TAMBAH_PER_LEVEL[levelId]||[];
    const due = StateT.kartuJatuhTempo().length + Math.min(StateT.kartuBaru().length, KT.leitner.maksKartuBaru);
    const sisa = State.sesiDibutuhkan() - StateT.jumlahSesiLulus(levelId);
    document.getElementById("topbar-title").textContent = `${levelId} · ${lv.nama}`;

    const kartuHtml = ids.map(id=>{
      const k = KARTU_TAMBAH_MAP[id], st = t.kartu[id];
      return `<div class="box-badge ${st && st.kotak>=3?'on':''}">${k.a}+${k.b} · kotak ${st?st.kotak:1}</div>`;
    }).join("");

    scr().innerHTML = `
      <div class="card">
        <h2>➕ ${lv.nama}</h2>
        <div class="strategy-box">💡 <b>Strategi jitu:</b> ${lv.strategiUmum}</div>
        <p class="small" style="margin-top:8px">Kartu level ini:</p>
        <div class="box-badges">${kartuHtml}</div>
      </div>
      <div class="card">
        <h3>🃏 Latihan Kartu Pintar</h3>
        <p class="small">Kartu + yang siap dilatih hari ini: <b>${due}</b>. Salah → kembali ke Kotak 1 + lihat strateginya.</p>
        <button class="btn btn-accent" onclick="App.go('latihanKartuTambah')" ${due?"":"disabled"}>${due?`Latihan Sekarang (${due} kartu)`:"Semua kartu sudah dilatih — kembali besok! 🌙"}</button>
      </div>
      <div class="card">
        <h3>🎓 Ujian Level</h3>
        <p class="small">Semua kartu level ini + ${KT.asesmen4.acakSebelumnya} kartu acak level sebelumnya. Lulus 90% pada ${State.sesiDibutuhkan()} sesi beda hari. Sisa: <b>${Math.max(sisa,0)} sesi</b>.</p>
        <button class="btn btn-success" onclick="App.go('ujianA4','${levelId}')">Mulai Ujian Level</button>
      </div>`;
  };

  V.latihanKartuTambah = function(){
    const ids = LeitnerT.susunSesi();
    if(!ids.length){ R.toast("Tidak ada kartu + jatuh tempo hari ini 🌙"); return App.go("peta"); }
    V.mulaiSesi({
      judul: "🃏 Latihan Kartu Penjumlahan",
      total: ids.length,
      buatSoal: (i)=> { const s = LeitnerT.soalKartu(ids[i]); return { tipe:"polos", teksBesar:`${s.teks} = ?`, jawaban:s.jawaban, mode:"keypad", strategi:s.strategi, id:s.id }; },
      onJawabPertama: (q, benar)=> StateT.jawabKartu(q.id, benar),
      onSelesai: (h)=>{
        State.sentuhStreak(); window.updateHud();
        Sync.sesiSelesai("leitner", StateT.levelAktif(), h.total, h.benar, h.durasi, {salah:h.salah});
        scr().innerHTML = `
          <div class="card center">
            <div class="celebrate">🃏</div>
            <h2>${h.benar} / ${h.total} kartu benar</h2>
            <p class="small">Kartu yang benar naik kotak — muncul makin jarang. Yang salah akan sering muncul sampai kamu jago!</p>
            <button class="btn" style="margin-top:10px" onclick="App.go('peta')">Kembali ke Peta 🗺️</button>
          </div>`;
      }
    });
  };

  V.ujianA4 = function(levelId){
    const ids = LeitnerT.susunAsesmen(levelId);
    const lulusMin = Math.ceil(ids.length * KT.asesmen4.persenLulus);
    V.mulaiSesi({
      judul: `🎓 Ujian ${levelId}`,
      total: ids.length,
      tanpaUlang: true,
      buatSoal: (i)=> { const s = LeitnerT.soalKartu(ids[i]); return { tipe:"polos", teksBesar:`${s.teks} = ?`, jawaban:s.jawaban, mode:"keypad", id:s.id }; },
      onSelesai: (h)=>{
        const lulus = h.benar >= lulusMin;
        if(lulus){ StateT.catatSesiLulus(levelId); State.tambahBintang(15); }
        State.sentuhStreak(); window.updateHud();
        Sync.sesiSelesai("asesmen", levelId, h.total, h.benar, h.durasi, {salah:h.salah, lulus});
        const tamat = StateT.levelLulus(levelId);
        if(tamat && levelId==="A4.9") return V.sertifikatTambah();
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
              <button class="btn btn-accent" onclick="App.go('hubA4','${levelId}')">Kembali ke Level</button>
            </div>
          </div>`;
      }
    });
  };

  // ---------- LAYAR: FASE A5 ----------
  V.faseA5 = function(levelId){
    const lv = KT.level[levelId];
    if(levelId==="A5.4") return V.pemeliharaanTambah();
    const timer = levelId==="A5.2";
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
          const rk = T().rekor;
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
              <button class="btn btn-accent" onclick="App.go('faseA5','${levelId}')">Main Lagi 🔁</button>
            </div>
          </div>`;
      }
    });
  };

  V.pemeliharaanTambah = function(){
    const ids = StateT.kartuJatuhTempo();
    if(!ids.length){
      scr().innerHTML = `<div class="card center"><div class="celebrate">🌙</div>
        <h2>Semua kartu + aman!</h2><p>Tidak ada kartu penjumlahan jatuh tempo hari ini.</p>
        <button class="btn" onclick="App.go('peta')">Kembali 🗺️</button></div>`;
      return;
    }
    V.latihanKartuTambah();
  };

  // ---------- SERTIFIKAT PENJUMLAHAN ----------
  V.sertifikatTambah = function(){
    R.konfeti();
    const p = State.P();
    scr().innerHTML = `
      <div class="certificate">
        <div style="font-size:56px">➕🏆</div>
        <h1>SERTIFIKAT JUARA PENJUMLAHAN</h1>
        <p>diberikan kepada</p>
        <h1 style="font-size:34px">${esc(p.nama)}</h1>
        <p>yang telah menguasai <b>seluruh fakta penjumlahan sampai 20</b><br>
        dengan strategi hebat: hitung lanjut, sahabat 10, dobel, dan make-ten!</p>
        <p class="small">${new Date().toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"})}</p>
      </div>
      <div class="btn-row" style="margin-top:12px">
        <button class="btn btn-ghost" onclick="window.print()">🖨️ Cetak</button>
        <button class="btn" onclick="App.go('peta')">Peta 🗺️</button>
      </div>`;
  };

  // ---------- SINKRONISASI GOOGLE SHEETS: 3 MODUL ----------
  // Kartu semua modul masuk satu sheet Kartu (kartu_id: "6x7" / "6:7" / "6+7");
  // asesmen_json memuat sesiLulus ketiga modul. Backend Code.gs TIDAK berubah.
  const snapAsli = State.snapshotProgres;
  State.snapshotProgres = function(){
    const s = snapAsli();
    const p = State.P();
    const petik = (m)=>Object.entries((m&&m.kartu)||{}).map(([id,k])=>
      ({ kartu_id:id, kotak:k.kotak, jatuh_tempo:k.jatuhTempo, benar:k.br, salah:k.bs }));
    s.kartu = s.kartu.concat(petik(p.bagi), petik(p.tambah));
    s.asesmen_json = JSON.stringify({
      kali: p.sesiLulus,
      bagi: (p.bagi && p.bagi.sesiLulus) || {},
      tambah: (p.tambah && p.tambah.sesiLulus) || {}
    });
    s.level_aktif = `×${State.levelAktif()}` +
      (window.StateBagi ? ` ÷${StateBagi.modulTerbuka()?StateBagi.levelAktif():"🔒"}` : "") +
      ` +${StateT.levelAktif()}`;
    return s;
  };

  // ---------- RESET PROFIL: hapus progres SEMUA modul ----------
  V._resetProfil = function(){
    if(!confirm("Yakin menghapus SELURUH progres anak ini? Tidak bisa dibatalkan.")) return;
    const p = State.P();
    const baru = { nama: p.nama, kelas: p.kelas, id: p.id };
    Object.assign(p, { bintang:0, streak:0, lastPlayDate:null, sesiLulus:{}, misi:{}, levelDibuka4:[], kartu:{}, rekor:[], pemeliharaanTerakhir:null }, baru);
    delete p.bagi;
    delete p.tambah;
    State.save(); R.toast("Progres direset"); App.go("ortu");
  };
})();
