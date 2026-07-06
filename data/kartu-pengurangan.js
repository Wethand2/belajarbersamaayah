// 52 kartu pengurangan — DITURUNKAN OTOMATIS dari keluarga fakta penjumlahan.
// Prinsip riset (dokumen Riset 4 operasi, Bab 3.3):
//   · Menghitung mundur adalah beban kognitif & sumber kesalahan; strategi
//     yang terbukti adalah SUBTRACTION-AS-ADDITION ("13 − 8 = ? → 8 + ? = 13")
//     lewat keluarga fakta (8, 5, 13).
//   · Maka: kartu pengurangan = sisi lain kartu penjumlahan, level K4.x
//     berpasangan 1:1 dengan A4.x, dan strategi SELALU menampilkan fakta
//     penjumlahan pasangannya.
// Satu kartu = satu keluarga (id "a-b"); ditanya dua arah:
//   (a+b) − a = b   dan   (a+b) − b = a
// MUAT SETELAH data/kartu-penjumlahan.js (butuh window.KARTU_TAMBAH).
(function(){
  // Kail strategi per level (pintu masuk sebelum "berpikir penjumlahan")
  const HOOK = {
    "K4.1": k => `Kurang 1 = angka SEBELUMNYA. Sebelum ${k.hasil} adalah ${k.hasil-1}.`,
    "K4.2": k => `Kurang 2 = mundur dua langkah: ${k.hasil} → ${k.hasil-1} → ${k.hasil-2}.`,
    "K4.3": k => `Sahabat 10! ${k.hasil===10?`10 pecah jadi ${k.a} dan ${k.b}.`:`Ingat pasangan 10-nya.`}`,
    "K4.4": k => k.a===0 ? `Kurang 0 = tetap. Kurang angkanya sendiri = 0.`
                         : `Belasan kurang 10 = satuannya saja: ${k.hasil} − 10 = ${k.hasil-10}.`,
    "K4.5": k => `${k.hasil} itu DOBEL ${k.a}. Setengahnya!`,
    "K4.6": k => `${k.hasil} itu hampir-dobel: ${k.a} + ${k.b} (tetangga).`,
    "K4.7": k => `LEWAT 10! ${k.hasil} − 9: mundur ke 10 dulu (${k.hasil-10} langkah), lalu 1 lagi.`,
    "K4.8": k => `LEWAT 10! ${k.hasil} − 8: mundur ke 10 dulu, lalu 2 lagi.`,
    "K4.9": k => `Pakai batu loncatanmu: dobel di tengah atau lewat 10.`
  };

  window.KARTU_KURANG = window.KARTU_TAMBAH.map(t => {
    const k = { id:`${t.a}-${t.b}`, a:t.a, b:t.b, hasil:t.jawaban,
                level: t.level.replace("A","K") };
    const inti = `Pikirkan penjumlahannya: ${t.a} + ${t.b} = ${t.jawaban}. ` +
                 `Jadi ${t.jawaban} − ${t.a} = ${t.b} dan ${t.jawaban} − ${t.b} = ${t.a}.`;
    k.strategi = `${HOOK[k.level](k)} ${inti}`;
    return k;
  });

  window.KARTU_KURANG_MAP = Object.fromEntries(window.KARTU_KURANG.map(k=>[k.id,k]));
  window.KARTU_KURANG_PER_LEVEL = {};
  window.KARTU_KURANG.forEach(k=>{ (window.KARTU_KURANG_PER_LEVEL[k.level] ||= []).push(k.id); });
})();
