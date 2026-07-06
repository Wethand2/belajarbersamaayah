// ====== STATE MANAGER (offline-first, localStorage) ======
window.State = (function(){
  const KEY = "pp_state_v1";
  const todayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  };
  const addDays = (dateStr, n) => {
    const d = new Date(dateStr + "T00:00:00");
    d.setDate(d.getDate()+n);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  };

  let S = null;

  function blankProfile(nama, kelas, pin){
    return {
      id: "anak_" + Math.random().toString(36).slice(2,8),
      nama, kelas,
      pin: pin || null, // PIN login 4 angka (dibuat saat daftar / login pertama)
      bintang: 0,
      streak: 0,
      lastPlayDate: null,
      // sesi lulus per level: {"2.1": ["2026-07-01","2026-07-03"]}
      sesiLulus: {},
      // misi konkret: {"1.1": {selesai:true, jawaban:"...", tgl:"..."}}
      misi: {},
      // level fase 4 yang kartunya sudah diperkenalkan
      levelDibuka4: [],
      // state kartu leitner: {"6x7": {kotak, jatuhTempo, br, bs, riwayatBaru:false}}
      kartu: {},
      rekor: [], // [{tgl, detik, benar}]
      pemeliharaanTerakhir: null
    };
  }

  function load(){
    try { S = JSON.parse(localStorage.getItem(KEY)); } catch(e){ S = null; }
    if(!S){
      S = { profils: [], activeId: null, pinOrtu: null, testMode: false, syncQueue: [] };
    }
    S.syncQueue ||= [];
    save();
  }
  function save(){ localStorage.setItem(KEY, JSON.stringify(S)); }

  const P = () => S.profils.find(p => p.id === S.activeId) || null;

  function addProfile(nama, kelas, pin){
    const p = blankProfile(nama, kelas, pin);
    S.profils.push(p);
    S.activeId = p.id;
    save();
    Sync.queue("addProfil", { anak_id:p.id, nama, kelas });
    return p;
  }

  // ---- Mastery & unlocking ----
  function sesiDibutuhkan(){ return S.testMode ? 1 : KURIKULUM.mastery.sesiLulus; }

  function catatSesiLulus(levelId){
    const p = P();
    const arr = (p.sesiLulus[levelId] ||= []);
    const t = todayStr();
    if(S.testMode || !arr.includes(t)) arr.push(t); // hari berbeda saja, kecuali test mode
    save();
  }
  function jumlahSesiLulus(levelId){
    const arr = (P().sesiLulus[levelId] || []);
    return S.testMode ? arr.length : new Set(arr).size;
  }
  function levelLulus(levelId){
    const lv = KURIKULUM.level[levelId];
    if(lv.tipe === "misi") return !!(P().misi[levelId] && P().misi[levelId].selesai);
    if(lv.tipe === "asesmen_misi") return !!(P().misi[levelId] && P().misi[levelId].lulus);
    if(lv.fase === 5) return true; // Fase 5 = mode bebas, tidak menggerbang apa pun
    return jumlahSesiLulus(levelId) >= sesiDibutuhkan();
  }
  function levelTerbuka(levelId){
    // Mode Uji Coba: SEMUA level terbuka agar orang tua bisa mencoba seluruh alur
    if(S.testMode) return true;
    const idx = KURIKULUM.urutan.indexOf(levelId);
    if(idx === 0) return true;
    // Seluruh Fase 5 terbuka bersama begitu 4.9 lulus
    if(KURIKULUM.level[levelId].fase === 5) return levelLulus("4.9");
    return levelLulus(KURIKULUM.urutan[idx-1]);
  }
  function levelAktif(){
    for(const id of KURIKULUM.urutan){
      if(!levelLulus(id)) return id;
    }
    return "5.1";
  }

  // ---- Bintang & streak ----
  function tambahBintang(n){
    P().bintang += n; save();
  }
  function sentuhStreak(){
    const p = P(), t = todayStr();
    if(p.lastPlayDate === t) return;
    p.streak = (p.lastPlayDate === addDays(t,-1)) ? p.streak + 1 : 1;
    p.lastPlayDate = t;
    save();
  }

  // ---- Misi konkret ----
  function selesaikanMisi(levelId, jawaban){
    P().misi[levelId] = { selesai:true, jawaban, tgl: todayStr() };
    save();
  }
  function selesaikanAsesmenMisi(levelId, benar, dari, lulus){
    P().misi[levelId] = { selesai:true, lulus, benar, dari, tgl: todayStr() };
    save();
  }

  // ---- Leitner ----
  function bukaKartuLevel(levelId){
    const p = P();
    if(p.levelDibuka4.includes(levelId)) return;
    p.levelDibuka4.push(levelId);
    (KARTU_PER_LEVEL[levelId]||[]).forEach(id=>{
      if(!p.kartu[id]) p.kartu[id] = { kotak:1, jatuhTempo: todayStr(), br:0, bs:0, baru:true };
    });
    save();
  }
  function jawabKartu(id, benar){
    const p = P(), k = p.kartu[id];
    if(!k) return;
    k.baru = false;
    if(benar){ k.br++; k.kotak = Math.min(5, k.kotak+1); }
    else     { k.bs++; k.kotak = 1; }
    k.jatuhTempo = addDays(todayStr(), KURIKULUM.leitner.intervalHari[k.kotak]);
    save();
  }
  function kartuJatuhTempo(){
    const p = P(), t = todayStr();
    return Object.entries(p.kartu)
      .filter(([id,k]) => !k.baru && k.jatuhTempo <= t)
      .map(([id]) => id);
  }
  function kartuBaru(){
    return Object.entries(P().kartu).filter(([id,k]) => k.baru).map(([id])=>id);
  }
  function selKuasai(a,b){
    // untuk heatmap: 1 = mulai bisa (kotak>=3), 2 = hafal (kotak 5)
    const p = P();
    if(a===1 || b===1) return levelLulus("4.4") ? 2 : 0;
    const id = `${Math.min(a,b)}x${Math.max(a,b)}`;
    const k = p.kartu[id];
    if(!k) return 0;
    if(k.kotak >= 5) return 2;
    if(k.kotak >= 3) return 1;
    return 0;
  }

  function snapshotProgres(){
    const p = P();
    return {
      anak_id: p.id, nama: p.nama,
      fase_aktif: KURIKULUM.level[levelAktif()].fase,
      level_aktif: levelAktif(),
      bintang: p.bintang, streak: p.streak,
      asesmen_json: JSON.stringify(p.sesiLulus),
      kartu: Object.entries(p.kartu).map(([id,k])=>({ kartu_id:id, kotak:k.kotak, jatuh_tempo:k.jatuhTempo, benar:k.br, salah:k.bs })),
      updated_at: new Date().toISOString()
    };
  }

  return {
    load, save, todayStr, addDays,
    get raw(){ return S; },
    P, addProfile,
    catatSesiLulus, jumlahSesiLulus, sesiDibutuhkan, levelLulus, levelTerbuka, levelAktif,
    tambahBintang, sentuhStreak,
    selesaikanMisi, selesaikanAsesmenMisi,
    bukaKartuLevel, jawabKartu, kartuJatuhTempo, kartuBaru, selKuasai,
    snapshotProgres
  };
})();
