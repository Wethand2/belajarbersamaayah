// Bank soal cerita PENJUMLAHAN untuk gen "ceritaTambah" (Fase A5.3).
// Schema-based instruction (Powell & Fuchs 2018) — anak mengenali STRUKTUR:
//   tipe:"gabung"  → dua bagian digabung (part-part-whole); jawaban = a + b
//   tipe:"ubah"    → mula-mula a, bertambah b (change/add-to); jawaban = a + b
//   tipe:"banding" → b lebih banyak dari a; jawaban = a + b
//   tipe:"lengkap" → ada a, berapa lagi supaya {total}? (missing addend,
//                    jembatan ke pengurangan); {total} = a + b, jawaban = b
// Semua rentang dijaga agar jumlah ≤ 20 (fakta dasar Fase A Kurikulum Merdeka).
// TANPA kata kunci ("semuanya" tidak selalu berarti tambah!) — anak memilih
// model masalah dulu sebelum menjawab (lihat Panduan).
window.SOAL_CERITA_TAMBAH = [
  // ---- GABUNG (part-part-whole) ----
  { t:"Di piring ada {a} kue bolu dan {b} kue lapis. Berapa kue di piring itu?", a:[3,9], b:[3,9], tipe:"gabung" },
  { t:"Rina punya {a} kelereng merah dan {b} kelereng biru. Berapa kelereng Rina?", a:[4,10], b:[3,9], tipe:"gabung" },
  { t:"Di kandang ada {a} ayam dan {b} bebek. Berapa unggas di kandang?", a:[3,9], b:[4,9], tipe:"gabung" },
  { t:"Kakak membawa {a} buku cerita, adik membawa {b} buku gambar. Berapa buku yang dibawa keduanya?", a:[2,8], b:[3,9], tipe:"gabung" },
  { t:"Di parkiran ada {a} sepeda dan {b} sepeda motor. Berapa kendaraan roda dua semuanya?", a:[4,10], b:[3,8], tipe:"gabung" },

  // ---- UBAH / BERTAMBAH (change / add-to) ----
  { t:"Di dahan hinggap {a} burung. Datang lagi {b} burung. Berapa burung di dahan sekarang?", a:[3,9], b:[2,8], tipe:"ubah" },
  { t:"Andi sudah menabung Rp{a}.000. Hari ini ia menabung Rp{b}.000 lagi. Berapa ribu rupiah tabungannya sekarang?", a:[4,10], b:[2,9], tipe:"ubah" },
  { t:"Di bus ada {a} penumpang. Di halte naik {b} penumpang lagi. Berapa penumpang di bus sekarang?", a:[5,10], b:[3,9], tipe:"ubah" },
  { t:"Ibu merebus {a} telur, lalu merebus {b} telur lagi. Berapa telur yang direbus Ibu?", a:[3,8], b:[2,7], tipe:"ubah" },
  { t:"Skor Dodi mula-mula {a}. Ia mendapat {b} poin lagi. Berapa skor Dodi sekarang?", a:[5,10], b:[4,10], tipe:"ubah" },

  // ---- BANDING (compare - lebih banyak) ----
  { t:"Sari punya {a} stiker. Stiker Wati {b} lebih banyak dari Sari. Berapa stiker Wati?", a:[4,10], b:[2,8], tipe:"banding" },
  { t:"Pohon jambu setinggi {a} meter. Pohon kelapa {b} meter lebih tinggi. Berapa meter tinggi pohon kelapa?", a:[3,9], b:[2,8], tipe:"banding" },
  { t:"Adik berumur {a} tahun. Kakak {b} tahun lebih tua. Berapa umur kakak?", a:[5,10], b:[2,8], tipe:"banding" },

  // ---- LENGKAP (missing addend — jembatan ke pengurangan) ----
  { t:"Di wadah telur muat {total}. Sudah terisi {a}. Berapa telur lagi supaya penuh?", a:[2,8], b:[2,8], tipe:"lengkap" },
  { t:"Fikri ingin mengumpulkan {total} kartu. Ia sudah punya {a}. Berapa kartu lagi yang ia butuhkan?", a:[3,9], b:[2,9], tipe:"lengkap" },
  { t:"Tim butuh {total} poin untuk menang. Skornya sekarang {a}. Berapa poin lagi?", a:[4,10], b:[2,9], tipe:"lengkap" }
];
