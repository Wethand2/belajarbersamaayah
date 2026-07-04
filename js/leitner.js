// ====== MESIN LEITNER ======
window.Leitner = (function(){
  const acak = arr => arr.slice().sort(()=>Math.random()-.5);

  // Susun sesi: kartu jatuh tempo + maks 5 kartu baru, total <= 20
  function susunSesi(){
    const L = KURIKULUM.leitner;
    const due = acak(State.kartuJatuhTempo());
    const baru = acak(State.kartuBaru()).slice(0, L.maksKartuBaru);
    return due.concat(baru).slice(0, L.maksKartuSesi);
  }

  // Soal untuk kartu: bergantian a×b / b×a (komutatif satu kartu)
  function soalKartu(id){
    const k = KARTU_MAP[id];
    const balik = Math.random() < .5 && k.a !== k.b;
    return {
      id,
      teks: balik ? `${k.b} × ${k.a}` : `${k.a} × ${k.b}`,
      jawaban: k.jawaban,
      strategi: k.strategi
    };
  }

  // Asesmen level 4.x: semua kartu level + N acak dari level sebelumnya
  function susunAsesmen(levelId){
    const milik = (KARTU_PER_LEVEL[levelId]||[]).slice();
    const idx4 = ["4.1","4.2","4.3","4.4","4.5","4.6","4.7","4.8","4.9"];
    const sebelum = idx4.slice(0, idx4.indexOf(levelId))
      .flatMap(l => KARTU_PER_LEVEL[l]||[]);
    const tambahan = acak(sebelum).slice(0, KURIKULUM.asesmen4.acakSebelumnya);
    return acak(milik.concat(tambahan));
  }

  return { susunSesi, soalKartu, susunAsesmen };
})();
