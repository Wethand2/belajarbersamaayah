// ====== GENERATOR SOAL ======
window.Gen = (function(){
  const rnd = (lo,hi) => lo + Math.floor(Math.random()*(hi-lo+1));
  const acak = arr => arr.slice().sort(()=>Math.random()-.5);
  const EMOJI = ["🍎","🐟","🍬","⚽","🍪","🌸","🐤","🍊"];
  const WADAH = ["keranjang","akuarium","toples","kotak","piring","vas","sangkar","kantong"];

  // pilihan ganda: jawaban benar + 3 pengecoh masuk akal
  function pilihan(jawab){
    const set = new Set([jawab]);
    const kandidat = [jawab+1, jawab-1, jawab+2, jawab-2, jawab+5, jawab-5, jawab+10, jawab-10];
    for(const c of acak(kandidat)){
      if(set.size>=4) break;
      if(c>=0 && !set.has(c)) set.add(c);
    }
    while(set.size<4) set.add(jawab + set.size + 2);
    return acak([...set]);
  }

  // ------- FASE 2 -------
  function kelompok(){ // 2.1: a=2-5 kelompok, b=2-5 isi
    const a=rnd(2,5), b=rnd(2,5), e=rnd(0,EMOJI.length-1);
    return { tipe:"kelompok", a, b, emoji:EMOJI[e], wadah:WADAH[e],
      teks:`Ada <b>${a} ${WADAH[e]}</b>. Setiap ${WADAH[e]} berisi <b>${b}</b>. Berapa semuanya?`,
      jawaban:a*b, mode:"pilihan", opsi:pilihan(a*b) };
  }
  function berulang(){ // 2.2
    const a=rnd(2,5), b=rnd(2,10), e=rnd(0,EMOJI.length-1);
    const deret = Array(a).fill(b).join(" + ");
    return { tipe:"kelompok", a, b, emoji:EMOJI[e], wadah:WADAH[e],
      teks:`${deret} = ...?<br><span class="small">(${a} kelompok isi ${b})</span>`,
      jawaban:a*b, mode:"keypad" };
  }
  function arraySoal(){ // 2.3
    const a=rnd(2,6), b=rnd(2,6);
    return { tipe:"array", a, b,
      teks:`Ada <b>${a} baris</b>, setiap baris <b>${b}</b>. Berapa semuanya?`,
      jawaban:a*b, mode:"keypad", bisaPutar:true };
  }
  function lompat(){ // 2.4: lompat 2,5,10,3,4
    const b = [2,5,10,3,4][rnd(0,4)];
    const n = rnd(3,5); // isi kotak ke-n
    const deret = Array.from({length:n}, (_,i)=>b*(i+1));
    const tampil = deret.map((v,i)=> i===n-1 ? "?" : v).join(", ");
    return { tipe:"lompat", b, n,
      teks:`Kelinci melompat ${b} demi ${b}:<br><b style="font-size:24px">${tampil}</b><br>Angka berapa yang ditutup?`,
      jawaban:b*n, mode:"keypad" };
  }
  function campur2(){
    return [kelompok, arraySoal, lompat][rnd(0,2)]();
  }

  // ------- FASE 3 -------
  function pasang(){ // 3.1: cocokkan representasi
    const a=rnd(2,6), b=rnd(2,6);
    const variasi = rnd(0,2);
    if(variasi===0){ // array -> simbol
      const opsi = acak([`${a} × ${b}`, `${a} + ${b}`, `${b} × ${b}`, `${a+1} × ${b}`]);
      return { tipe:"array", a, b, teks:"Susunan ini cocok dengan tulisan yang mana?",
        jawaban:`${a} × ${b}`, mode:"pilihanTeks", opsi };
    }
    if(variasi===1){ // simbol -> penjumlahan berulang
      const benar = Array(a).fill(b).join(" + ");
      const salah1 = Array(b).fill(a+1).join(" + ");
      const salah2 = Array(Math.max(2,a-1)).fill(b).join(" + ");
      const salah3 = `${a} + ${b}`;
      return { tipe:"polos", teksBesar:`${a} × ${b}`, teks:"Sama artinya dengan...?",
        jawaban:benar, mode:"pilihanTeks", opsi:acak([benar,salah1,salah2,salah3]) };
    }
    // simbol -> hasil
    return { tipe:"array", a, b, teksBesar:`${a} × ${b}`, teks:"Berapa hasilnya? (lihat susunannya!)",
      jawaban:a*b, mode:"pilihan", opsi:pilihan(a*b) };
  }
  function simbolBantu(){ // 3.2: simbol + array samar
    const a=rnd(2,5), b=rnd(2,5);
    return { tipe:"arraySamar", a, b, teksBesar:`${a} × ${b} = ?`,
      teks:`<span class="small">Gambar bantuannya samar — coba jawab dulu tanpa melihat!</span>`,
      jawaban:a*b, mode:"keypad" };
  }
  function simbol(){ // 3.3: simbol murni + rumpang dua arah
    const a=rnd(2,5), b=rnd(2,5);
    const v = rnd(0,2);
    if(v===0) return { tipe:"polos", teksBesar:`${a} × ${b} = ?`, jawaban:a*b, mode:"keypad", bantuArray:{a,b} };
    if(v===1) return { tipe:"polos", teksBesar:`${a*b} = ${a} × ?`, jawaban:b, mode:"keypad", bantuArray:{a,b} };
    return { tipe:"polos", teksBesar:`? × ${b} = ${a*b}`, jawaban:a, mode:"keypad", bantuArray:{a,b} };
  }
  function gerbang(i){ // 3.4: 12 soal terstruktur
    const a=rnd(2,5), b=rnd(2,5);
    if(i<8) return { tipe:"polos", teksBesar:`${a} × ${b} = ?`, jawaban:a*b, mode:"keypad" };
    if(i<10){ // pilih array yang cocok
      const opsi = acak([`${a} baris isi ${b}`, `${b} baris isi ${b}`, `${a} + ${b} benda`, `${a+1} baris isi ${b}`]);
      return { tipe:"array", a, b, teks:`Mana yang menggambarkan susunan ini?`, jawaban:`${a} baris isi ${b}`, mode:"pilihanTeks", opsi };
    }
    return { tipe:"polos", teksBesar:`${a*b} = ${a} × ?`, jawaban:b, mode:"keypad" };
  }

  // ------- FASE 5 -------
  function faktaAcakDikuasai(){
    const p = State.P();
    const ids = Object.keys(p.kartu);
    const pool = ids.length ? ids : Object.keys(KARTU_MAP);
    const id = pool[rnd(0,pool.length-1)];
    return Leitner.soalKartu(id);
  }
  function campurSemua(){ // 5.1 & 5.2: fakta + rumpang
    const s = faktaAcakDikuasai();
    if(Math.random()<.25){
      const k = KARTU_MAP[s.id];
      if(k.a>0){
        return { tipe:"polos", teksBesar:`${k.jawaban} = ${k.a} × ?`, jawaban:k.b, mode:"keypad", strategi:k.strategi };
      }
    }
    return { tipe:"polos", teksBesar:`${s.teks} = ?`, jawaban:s.jawaban, mode:"keypad", strategi:s.strategi };
  }
  function cerita(){ // 5.3
    const t = SOAL_CERITA[rnd(0,SOAL_CERITA.length-1)];
    const a = rnd(t.a[0], t.a[1]);
    const b = rnd(t.b[0], t.b[1]);
    if(t.balik){
      const teks = t.t.replace("{hasil}", a*b).replace("{a}", a);
      return { tipe:"polos", teks:`<span class="q-text">${teks}</span>`, jawaban:b, mode:"keypad",
        strategi:`${a*b} = ${a} × ${b}, jadi setiap kelompok berisi ${b}.` };
    }
    const teks = t.t.replace("{a}", a).replace("{b}", b);
    return { tipe:"polos", teks:`<span class="q-text">${teks}</span>`, jawaban:a*b, mode:"keypad",
      strategi:`${a} kelompok isi ${b} → ${a} × ${b} = ${a*b}.` };
  }

  const peta = { kelompok, berulang, array:arraySoal, lompat, campur2,
                 pasang, simbolBantu, simbol, gerbang, campurSemua, rekor:campurSemua, cerita };
  function buat(gen, i){ return peta[gen](i); }

  return { buat, pilihan };
})();
