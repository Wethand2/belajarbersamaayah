// Kurikulum modul PENJUMLAHAN (fakta sampai 20) — format sama dengan KURIKULUM.
// Dasar riset (dokumen Riset 4 operasi, Bab 3):
//   · Number sense dulu: subitizing, pola jari, ten-frame, garis bilangan
//     (meta-analisis numerasi dini ES 0,64; Siegler & Ramani: papan LINEAR).
//   · Progresi strategi diajarkan EKSPLISIT: hitung lanjut → make-ten →
//     fakta turunan — anak jangan dibiarkan terjebak menghitung satu-satu.
//   · Representasi kunci: ten-frame (bingkai 10), pola jari, garis bilangan.
// Pulau ini TERBUKA SEJAK AWAL (syaratModul: null) — untuk kelas 1–2;
// anak yang mulai dari perkalian tidak wajib melewatinya.
window.KURIKULUM_TAMBAH = {
  syaratModul: null, // selalu terbuka; sasaran Fase A Kurikulum Merdeka (kelas 1-2)

  fase: [
    { id: 1, nama: "Fase A1 · Konkret", emoji: "🖐️", desc: "Number sense & makna penjumlahan lewat benda dan jari" },
    { id: 2, nama: "Fase A2 · Gambar", emoji: "🔟", desc: "Bingkai-10, garis bilangan, dan papan ular linear" },
    { id: 3, nama: "Fase A3 · Simbol", emoji: "➕", desc: "Nyaman dengan tulisan a + b" },
    { id: 4, nama: "Fase A4 · Hapalan", emoji: "⚡", desc: "Kartu pintar: dari hitung lanjut ke make-ten (9 level)" },
    { id: 5, nama: "Fase A5 · Jago!", emoji: "🏆", desc: "Campuran, rekor pribadi, dan soal cerita 3 skema" }
  ],

  urutan: [
    "A1.1","A1.2","A1.3","A1.4","A1.5","A1.6","A1.7","A1.8",
    "A2.1","A2.2","A2.3","A2.4","A2.5",
    "A3.1","A3.2","A3.3","A3.4",
    "A4.1","A4.2","A4.3","A4.4","A4.5","A4.6","A4.7","A4.8","A4.9",
    "A5.1","A5.2","A5.3","A5.4"
  ],

  level: {
    "A1.1": { fase:1, tipe:"misi", nama:"Cepat Lihat (Subitizing)" },
    "A1.2": { fase:1, tipe:"misi", nama:"Pola Jari Kilat" },
    "A1.3": { fase:1, tipe:"misi", nama:"Menggabung (Makna Tambah)" },
    "A1.4": { fase:1, tipe:"misi", nama:"Hitung Lanjut, Jangan Ulang!" },
    "A1.5": { fase:1, tipe:"misi", nama:"Sahabat 10" },
    "A1.6": { fase:1, tipe:"misi", nama:"Dobel di Tubuhku" },
    "A1.7": { fase:1, tipe:"misi", nama:"Cerita Buatanku" },
    "A1.8": { fase:1, tipe:"asesmen_misi", nama:"Ujian Kecil Fase A1", lulusMin:3, dari:4 },

    // gen baru — spesifikasi di Riset/Panduan modul penjumlahan.md
    "A2.1": { fase:2, tipe:"latihan", nama:"Bingkai-10",                    soal:10, lulus:9, gen:"tenframe" },
    "A2.2": { fase:2, tipe:"latihan", nama:"Lompat di Garis Bilangan",      soal:10, lulus:9, gen:"garisTambah" },
    "A2.3": { fase:2, tipe:"latihan", nama:"Lengkapi Sahabat 10",           soal:10, lulus:9, gen:"pasangan10" },
    "A2.4": { fase:2, tipe:"latihan", nama:"Papan Ular Linear",             soal:10, lulus:9, gen:"papanLinear" },
    "A2.5": { fase:2, tipe:"asesmen", nama:"Ujian Fase A2",                 soal:10, lulus:9, gen:"campurA2" },

    "A3.1": { fase:3, tipe:"latihan", nama:"Pasangkan!",                    soal:10, lulus:9, gen:"pasangTambah" },
    "A3.2": { fase:3, tipe:"latihan", nama:"Simbol + Gambar Bantuan",       soal:10, lulus:9, gen:"simbolBantuTambah" },
    "A3.3": { fase:3, tipe:"latihan", nama:"Simbol Mandiri",                soal:10, lulus:9, gen:"simbolTambah" },
    "A3.4": { fase:3, tipe:"gerbang", nama:"Gerbang Hapalan",               soal:12, lulus:11, gen:"gerbangTambah" },

    "A4.1": { fase:4, tipe:"leitner", nama:"Fakta +1 — Angka Berikutnya",
      strategiUmum:"Tambah 1 = sebut angka BERIKUTNYA. 7 + 1? Setelah 7 adalah 8. Tidak perlu menghitung dari awal!" },
    "A4.2": { fase:4, tipe:"leitner", nama:"Fakta +2 — Loncat Dua",
      strategiUmum:"Tambah 2 = loncat dua langkah: 6 → 7 → 8. Mulai dari angka yang BESAR, lanjutkan dua langkah." },
    "A4.3": { fase:4, tipe:"leitner", nama:"Sahabat 10",
      strategiUmum:"Pasangan yang jadi 10: 1-9, 2-8, 3-7, 4-6, 5-5. Hafalkan seperti nama sahabat — ini kunci SEMUA fakta besar!" },
    "A4.4": { fase:4, tipe:"leitner", nama:"Fakta +10 dan +0",
      strategiUmum:"Tambah 10 = naik satu puluhan (6 jadi 16). Tambah 0 = tidak berubah sama sekali." },
    "A4.5": { fase:4, tipe:"leitner", nama:"Dobel — Angka Kembar",
      strategiUmum:"Dobel itu spesial: 3+3=6, 4+4=8, 6+6=12, 7+7=14, 8+8=16, 9+9=18. Bayangkan benda kembarnya!" },
    "A4.6": { fase:4, tipe:"leitner", nama:"Hampir Dobel",
      strategiUmum:"6 + 7 = dobel 6 tambah 1 = 13. Kalau dua angka bertetangga, pakai dobel yang kecil lalu + 1!" },
    "A4.7": { fase:4, tipe:"leitner", nama:"9 Minta 1 (Make-Ten)",
      strategiUmum:"9 selalu minta 1 supaya genap 10! 9 + 5: ambil 1 dari 5 → 10 + 4 = 14. Lihat di bingkai-10!" },
    "A4.8": { fase:4, tipe:"leitner", nama:"8 Minta 2 (Make-Ten)",
      strategiUmum:"8 minta 2 supaya genap 10! 8 + 5: ambil 2 dari 5 → 10 + 3 = 13." },
    "A4.9": { fase:4, tipe:"leitner", nama:"Empat Fakta Terakhir!",
      strategiUmum:"Tinggal 3+5, 3+6, 4+7, 5+7. Semua bisa pakai batu loncatan: dobel di tengah atau make-ten!" },

    "A5.1": { fase:5, tipe:"fluensi", nama:"Kuis Campuran",        soal:20, gen:"campurTambah" },
    "A5.2": { fase:5, tipe:"fluensi", nama:"Kalahkan Rekormu!",    soal:20, gen:"rekorTambah" },
    "A5.3": { fase:5, tipe:"fluensi", nama:"Soal Cerita 3 Skema",  soal:8,  gen:"ceritaTambah" },
    "A5.4": { fase:5, tipe:"fluensi", nama:"Misi Kilat Pemeliharaan", gen:"peliharaTambah" }
  },

  // Aturan sama dengan modul lain.
  mastery: { sesiLulus: 2 },
  leitner: { intervalHari: {1:0, 2:1, 3:3, 4:7, 5:14}, maksKartuBaru: 5, maksKartuSesi: 20 },
  asesmen4: { acakSebelumnya: 5, persenLulus: 0.9 }
};
