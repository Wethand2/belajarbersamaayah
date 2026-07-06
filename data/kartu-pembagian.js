// 49 kartu pembagian — SATU kartu per KELUARGA FAKTA (id = "min:max").
// Prinsip riset (Mauro/LeFevre 2003; Robinson 2013): fakta pembagian diambil
// otak lewat mediasi perkalian ("63 ÷ 7 → 7 × ? = 63"), maka:
//   1) kartu pembagian = sisi lain kartu perkalian, kelompoknya SAMA;
//   2) strategi saat salah SELALU menampilkan fakta perkalian pasangannya;
//   3) satu kartu ditanya dua arah (hasil ÷ a dan hasil ÷ b), seperti
//      komutatif pada kartu perkalian.
// Kartu dengan field `tetap` hanya punya satu arah soal (aturan ÷1, 0÷n, n÷n).
// TIDAK ADA pembagian dengan 0 — tidak terdefinisi, jangan pernah dibuat soalnya.
(function(){
  const K = [];
  const add = (a,b,level,hook,extra)=>{
    const lo=Math.min(a,b), hi=Math.max(a,b), h=lo*hi;
    const inti = `Pikirkan perkaliannya: ${lo} × ${hi} = ${h}. Jadi ${h} ÷ ${lo} = ${hi} dan ${h} ÷ ${hi} = ${lo}.`;
    K.push(Object.assign(
      { id:`${lo}:${hi}`, a:lo, b:hi, hasil:h, level, strategi: hook ? `${hook} ${inti}` : inti },
      extra||{}
    ));
  };

  // P4.1 — ÷2 (9 kartu) · pasangan kelompok ×2
  for(let b=2;b<=10;b++) add(2,b,"P4.1",`Dibagi 2 = SETENGAHNYA! ${2*b} ÷ 2 = ${b}.`);

  // P4.2 — ÷10 (8 kartu) · pasangan ×10
  for(let b=3;b<=10;b++) add(10,b,"P4.2",`${10*b} itu ${b} puluhan, jadi ${10*b} ÷ 10 = ${b}.`);

  // P4.3 — ÷5 (7 kartu) · pasangan ×5
  [3,4,5,6,7,8,9].forEach(b=> add(5,b,"P4.3",`Hitung lompat 5 sampai ${5*b}: berapa lompatan?`));

  // P4.4 — aturan ÷1, n÷n, 0÷n (4 kartu satu arah)
  K.push({ id:"1:7",  a:1, b:7,  hasil:7,  level:"P4.4", tetap:{ teks:"7 ÷ 1",  jawaban:7 },
    strategi:"Dibagi 1 = angkanya sendiri. 7 permen untuk 1 anak → anak itu dapat semuanya: 7." });
  K.push({ id:"1:10", a:1, b:10, hasil:10, level:"P4.4", tetap:{ teks:"10 ÷ 1", jawaban:10 },
    strategi:"Dibagi 1 = angkanya sendiri. 10 ÷ 1 = 10." });
  K.push({ id:"n:n",  a:9, b:9,  hasil:9,  level:"P4.4", tetap:{ teks:"9 ÷ 9",  jawaban:1 },
    strategi:"Dibagi angkanya sendiri = 1. 9 kelereng untuk 9 anak → tiap anak dapat 1." });
  K.push({ id:"0:6",  a:0, b:6,  hasil:0,  level:"P4.4", tetap:{ teks:"0 ÷ 6",  jawaban:0 },
    strategi:"Nol dibagi berapa pun = 0. Tidak ada permen dibagi 6 anak → semua dapat 0. (Tapi dibagi NOL tidak boleh!)" });

  // P4.5 — kuadrat (6 kartu, satu arah alami karena a = b)
  [3,4,6,7,8,9].forEach(n=> add(n,n,"P4.5",`${n*n} adalah angka persegi. Akar dari persegi ${n}×${n}!`));

  // P4.6 — ÷4 (5 kartu) · pasangan ×4
  [3,6,7,8,9].forEach(b=> add(4,b,"P4.6",`Dibagi 4 = setengah dua kali: ${4*b} → ${2*b} → ${b}.`));

  // P4.7 — ÷3 (3 kartu) · pasangan ×3
  [6,7,8].forEach(b=> add(3,b,"P4.7"));

  // P4.8 — ÷9 (4 kartu) · pasangan ×9
  [3,6,7,8].forEach(b=> add(9,b,"P4.8",`Cek dulu: digit ${9*b} berjumlah 9, pasti keluarga ×9!`));

  // P4.9 — tiga keluarga terakhir (3 kartu)
  add(6,7,"P4.9","Keluarga paling terkenal: 42 = 6 × 7!");
  add(6,8,"P4.9","48 = 6 × 8.");
  add(7,8,"P4.9","Ingat 5,6,7,8 → 56 = 7 × 8!");

  window.KARTU_BAGI = K;
  window.KARTU_BAGI_MAP = Object.fromEntries(K.map(k=>[k.id,k]));
  window.KARTU_BAGI_PER_LEVEL = {};
  K.forEach(k=>{ (window.KARTU_BAGI_PER_LEVEL[k.level] ||= []).push(k.id); });
})();
