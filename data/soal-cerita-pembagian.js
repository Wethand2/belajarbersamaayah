// Bank soal cerita PEMBAGIAN untuk gen "ceritaBagi" (Fase P5.3).
// Prinsip schema-based instruction (Powell & Fuchs 2018): anak mengenali
// STRUKTUR masalah, bukan kata kunci. Maka tiap soal diberi tipe eksplisit:
//   tipe:"partitif"  → diketahui banyak kelompok {a}; jawaban = isi per kelompok ({b})
//   tipe:"kuotitif"  → diketahui isi per kelompok {b}; jawaban = banyak kelompok ({a})
//   tipe:"sisa"      → jawaban = sisa (total = a*b + sisa; sisa 1..b-1)
// Placeholder {hasil} = a × b. Rentang a/b dijaga agar sesuai keluarga fakta 1–10.
// Saran UI: sebelum keypad, anak memilih dulu model masalahnya
//   ("bagi rata ke ... " vs "kelompok isi ...") — lihat README-integrasi.md.
window.SOAL_CERITA_BAGI = [
  // ---- PARTITIF (bagi rata; jawaban = isi per kelompok) ----
  { t:"Ibu punya {hasil} kue. Kue dibagi rata ke {a} piring. Setiap piring berisi berapa kue?", a:[3,8], b:[3,9], tipe:"partitif" },
  { t:"{hasil} kelereng dibagi sama banyak kepada {a} anak. Setiap anak dapat berapa kelereng?", a:[2,9], b:[3,9], tipe:"partitif" },
  { t:"Bu guru membagikan {hasil} buku sama rata ke {a} kelompok belajar. Setiap kelompok menerima berapa buku?", a:[3,8], b:[4,9], tipe:"partitif" },
  { t:"Ayah memetik {hasil} jeruk, dimasukkan sama banyak ke {a} keranjang. Berapa jeruk di setiap keranjang?", a:[3,7], b:[4,9], tipe:"partitif" },
  { t:"Uang Rp{hasil}.000 dibagi rata untuk {a} hari sekolah. Berapa ribu rupiah jajan Andi sehari?", a:[3,6], b:[2,5], tipe:"partitif" },
  { t:"{hasil} bibit cabai ditanam sama banyak dalam {a} baris. Berapa bibit setiap barisnya?", a:[3,8], b:[4,9], tipe:"partitif" },
  { t:"Panitia lomba membagi {hasil} peserta menjadi {a} regu sama banyak. Berapa anak dalam satu regu?", a:[4,9], b:[4,8], tipe:"partitif" },

  // ---- KUOTITIF (pengelompokan; jawaban = banyak kelompok) ----
  { t:"Ada {hasil} telur. Satu wadah memuat {b} telur. Berapa wadah yang dibutuhkan?", a:[3,9], b:[4,10], tipe:"kuotitif" },
  { t:"{hasil} siswa akan naik angkot. Satu angkot memuat {b} siswa. Berapa angkot yang diperlukan?", a:[3,8], b:[5,10], tipe:"kuotitif" },
  { t:"Pedagang punya {hasil} permen. Setiap bungkus diisi {b} permen. Berapa bungkus yang bisa dibuat?", a:[3,9], b:[3,8], tipe:"kuotitif" },
  { t:"Satu mobil mainan butuh {b} roda. Dari {hasil} roda, berapa mobil yang bisa dirakit?", a:[3,8], b:[3,6], tipe:"kuotitif" },
  { t:"Kakak menabung Rp{b}.000 setiap hari. Berapa hari sampai tabungannya Rp{hasil}.000?", a:[3,9], b:[2,5], tipe:"kuotitif" },
  { t:"{hasil} kursi disusun berbaris, setiap baris {b} kursi. Berapa baris yang terbentuk?", a:[3,8], b:[4,9], tipe:"kuotitif" },
  { t:"Ada {hasil} rambutan. Setiap piring diisi {b} rambutan. Berapa piring yang penuh?", a:[3,9], b:[4,8], tipe:"kuotitif" },

  // ---- SISA (jawaban = sisa; total = a×b + sisa) ----
  { t:"{total} kelereng dibagi rata kepada {a} anak. Setiap anak dapat {b}. Berapa kelereng yang TERSISA?", a:[3,6], b:[3,7], tipe:"sisa" },
  { t:"{total} kue dimasukkan ke kotak isi {b}. Ada {a} kotak penuh. Berapa kue yang tidak kebagian kotak?", a:[3,6], b:[4,8], tipe:"sisa" }
];
