// Bank soal cerita PENGURANGAN untuk gen "ceritaKurang" (Fase K5.3).
// Schema-based instruction (Powell & Fuchs 2018) — tiga makna pengurangan:
//   tipe:"ambil"   → mula-mula {total}, diambil/hilang {a}; jawaban = b (sisa)
//   tipe:"banding" → {total} vs {a}; jawaban = b (selisih / berapa lebihnya)
//   tipe:"bagian"  → keseluruhan {total}, satu bagian {a}; jawaban = b (bagian lain)
// Placeholder {total} = a + b (selalu bilangan terbesar). Semua ≤ 20.
// TANPA kata kunci — kata "sisa" sengaja TIDAK selalu muncul di soal ambil,
// dan soal banding tidak memuat kata "kurang"; anak memilih model dulu.
window.SOAL_CERITA_KURANG = [
  // ---- AMBIL (change - remove) ----
  { t:"Ibu menggoreng {total} bakwan. {a} bakwan dimakan keluarga. Berapa bakwan yang masih ada?", a:[3,9], b:[2,9], tipe:"ambil" },
  { t:"Di dahan ada {total} burung. {a} burung terbang pergi. Berapa burung di dahan sekarang?", a:[2,9], b:[2,9], tipe:"ambil" },
  { t:"Rudi punya {total} kelereng, lalu {a} kelereng diberikan kepada adiknya. Berapa kelereng Rudi sekarang?", a:[3,9], b:[2,9], tipe:"ambil" },
  { t:"Di bus ada {total} penumpang. Di halte, {a} penumpang turun. Berapa penumpang di bus sekarang?", a:[3,9], b:[3,9], tipe:"ambil" },
  { t:"Tabungan Nina Rp{total}.000. Ia membeli buku Rp{a}.000. Berapa ribu rupiah uang Nina sekarang?", a:[3,9], b:[2,9], tipe:"ambil" },
  { t:"Dari {total} balon, {a} balon meletus. Berapa balon yang masih menggelembung?", a:[2,8], b:[2,9], tipe:"ambil" },

  // ---- BANDING (compare - selisih) ----
  { t:"Ayam kakek {total} ekor, ayam nenek {a} ekor. Berapa ekor lebih banyak ayam kakek?", a:[3,9], b:[2,8], tipe:"banding" },
  { t:"Tinggi pohon mangga {total} meter, pohon jambu {a} meter. Berapa meter selisihnya?", a:[3,9], b:[2,8], tipe:"banding" },
  { t:"Skor tim merah {total}, skor tim biru {a}. Berapa poin tim biru tertinggal?", a:[4,10], b:[2,9], tipe:"banding" },
  { t:"Umur kakak {total} tahun, umur adik {a} tahun. Berapa tahun kakak lebih tua?", a:[4,10], b:[2,9], tipe:"banding" },
  { t:"Buku Sari {total} halaman sudah dibaca, buku Dina baru {a} halaman. Berapa halaman Sari lebih jauh?", a:[4,10], b:[2,9], tipe:"banding" },

  // ---- BAGIAN (part-part-whole - bagian yang tidak diketahui) ----
  { t:"Di kandang ada {total} kelinci: {a} berwarna putih, sisanya cokelat. Berapa kelinci cokelat?", a:[3,9], b:[2,9], tipe:"bagian" },
  { t:"{total} siswa ikut lomba: {a} anak laki-laki. Berapa anak perempuan?", a:[4,10], b:[3,9], tipe:"bagian" },
  { t:"Ibu membeli {total} telur: {a} sudah direbus. Berapa telur yang belum direbus?", a:[3,9], b:[2,9], tipe:"bagian" },
  { t:"Dari {total} soal ulangan, Bima sudah mengerjakan {a}. Berapa soal yang belum dikerjakan?", a:[4,10], b:[2,9], tipe:"bagian" },
  { t:"{total} kursi di kelas: {a} sudah diduduki. Berapa kursi yang masih kosong?", a:[4,10], b:[3,9], tipe:"bagian" }
];
