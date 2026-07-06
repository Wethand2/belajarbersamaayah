// 52 kartu penjumlahan (fakta sampai 20) — id = "min+max", komutatif digabung.
// Urutan strategis sesuai riset (dokumen Riset 4 operasi, Bab 3.2 & 8.2):
//   +1/+2 (hitung lanjut) → pasangan-10 → +10 & +0 (aturan) → dobel →
//   near-double → make-ten 9 → make-ten 8 → fakta turunan terakhir.
// Fakta +0 dan +10 selebihnya dikuasai lewat ATURAN (seperti ×1/×0 perkalian),
// jadi hanya kartu sampel yang masuk dek.
// Kartu dijawab dua arah (a+b / b+a) seperti kartu perkalian.
(function(){
  const K = [];
  const add = (a,b,level,strategi)=>{
    const lo=Math.min(a,b), hi=Math.max(a,b);
    K.push({ id:`${lo}+${hi}`, a:lo, b:hi, jawaban:lo+hi, level, strategi });
  };

  // A4.1 — +1 · hitung lanjut satu langkah (9 kartu)
  for(let b=1;b<=9;b++) add(1,b,"A4.1",`Tambah 1 = angka BERIKUTNYA. Setelah ${b} adalah ${b+1}.`);

  // A4.2 — +2 · loncat dua (8 kartu)
  for(let b=2;b<=9;b++) add(2,b,"A4.2",`Tambah 2 = loncat dua: ${b} → ${b+1} → ${b+2}. ${b%2===0?"Genap tetap genap!":"Ganjil tetap ganjil!"}`);

  // A4.3 — pasangan 10 · sahabat sepuluh (3 kartu; 1+9 dan 2+8 sudah di atas)
  add(3,7,"A4.3","Sahabat 10! 3 dan 7 berpasangan jadi 10. Lihat di bingkai-10: 3 terisi, 7 kosong.");
  add(4,6,"A4.3","Sahabat 10! 4 dan 6 berpasangan jadi 10.");
  add(5,5,"A4.3","Sahabat 10 sekaligus dobel: 5 + 5 = 10. Dua tangan penuh!");

  // A4.4 — +10 dan +0 · aturan (5 kartu sampel)
  add(10,2,"A4.4","Tambah 10 = naik satu puluhan: 2 jadi 12. Tulis 1 di depannya!");
  add(10,5,"A4.4","Tambah 10 = naik satu puluhan: 5 jadi 15.");
  add(10,7,"A4.4","Tambah 10 = naik satu puluhan: 7 jadi 17.");
  add(0,6,"A4.4","Tambah 0 = tidak ada yang datang. 6 + 0 tetap 6!");
  add(0,9,"A4.4","Tambah 0 = tidak berubah. 0 + 9 = 9.");

  // A4.5 — dobel (7 kartu; 1+1, 2+2, 5+5 sudah di level sebelumnya)
  [[3,"dua roda sepeda roda tiga? Bukan — 3+3 = 6, seperti kaki serangga!"],
   [4,"4 + 4 = 8, seperti kaki laba-laba."],
   [6,"6 + 6 = 12, seperti sekotak telur."],
   [7,"7 + 7 = 14, dua minggu = 14 hari."],
   [8,"8 + 8 = 16, dua gurita? 16 lengan!"],
   [9,"9 + 9 = 18. Ingat: dobel 9 = dobel 10 kurang 2 → 20 − 2 = 18."],
   [10,"10 + 10 = 20, dua tangan dua kaki: 20 jari!"]]
  .forEach(([n,cerita])=> add(n,n,"A4.5",`DOBEL! ${cerita}`));

  // A4.6 — near-double · dobel + 1 (7 kartu)
  [[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10]]
  .forEach(([a,b])=> add(a,b,"A4.6",`Hampir dobel! ${a} + ${b} = dobel ${a} tambah 1 = ${2*a} + 1 = ${a+b}.`));

  // A4.7 — make-ten dengan 9 (5 kartu; 9+2 & 9+1 & 8+9/9+10 sudah di level lain)
  [3,4,5,6,7].forEach(b=> add(9,b,"A4.7",`9 minta 1! 9 + ${b}: ambil 1 dari ${b} → 10 + ${b-1} = ${9+b}.`));

  // A4.8 — make-ten dengan 8 (4 kartu)
  [3,4,5,6].forEach(b=> add(8,b,"A4.8",`8 minta 2! 8 + ${b}: ambil 2 dari ${b} → 10 + ${b-2} = ${8+b}.`));

  // A4.9 — empat fakta terakhir · pakai batu loncatan (4 kartu)
  add(3,5,"A4.9","3 + 5 = dobel 4! Geser satu: 4 + 4 = 8.");
  add(3,6,"A4.9","3 + 6: pakai sahabat 10 → 3 + 7 = 10, kurang 1 = 9. Atau dobel 3 tambah 3.");
  add(4,7,"A4.9","4 + 7: 7 minta 3! Ambil 3 dari 4 → 10 + 1 = 11.");
  add(5,7,"A4.9","5 + 7 = dobel 6! Geser satu: 6 + 6 = 12.");

  window.KARTU_TAMBAH = K;
  window.KARTU_TAMBAH_MAP = Object.fromEntries(K.map(k=>[k.id,k]));
  window.KARTU_TAMBAH_PER_LEVEL = {};
  K.forEach(k=>{ (window.KARTU_TAMBAH_PER_LEVEL[k.level] ||= []).push(k.id); });
})();
