// Kurikulum modul PEMBAGIAN — 5 fase, format sama dengan KURIKULUM perkalian.
// Dasar riset:
//   · Dua makna pembagian (partitif = bagi rata; kuotitif = pengelompokan)
//     keduanya WAJIB dialami anak (Fase P1–P2 memuat keduanya secara eksplisit).
//   · Pembagian diajarkan BERDAMPINGAN dengan perkalian: level P4.x terbuka
//     bila level perkalian pasangannya (syaratKali) sudah MASTERED — bukan
//     menunggu seluruh tabel perkalian selesai.
//   · Modul terbuka (syaratModul) setelah 4.3 perkalian lulus: anak sudah
//     menguasai ×2, ×10, ×5 dan langsung "memanen" fakta itu jadi pembagian.
window.KURIKULUM_BAGI = {
  syaratModul: "4.3", // level perkalian yang harus lulus sebelum pulau pembagian terbuka

  fase: [
    { id: 1, nama: "Fase P1 · Konkret", emoji: "🍽️", desc: "Paham dua makna pembagian lewat benda nyata" },
    { id: 2, nama: "Fase P2 · Gambar", emoji: "🖼️", desc: "Bagi rata, pengelompokan, dan array dibaca dua arah" },
    { id: 3, nama: "Fase P3 · Simbol", emoji: "➗", desc: "Nyaman dengan tulisan a ÷ b dan segitiga fakta" },
    { id: 4, nama: "Fase P4 · Hapalan", emoji: "⚡", desc: "Kartu pembagian menumpang fakta perkalian (9 level)" },
    { id: 5, nama: "Fase P5 · Jago!", emoji: "🏆", desc: "Campuran kali-bagi, rekor, dan soal cerita dua tipe" }
  ],

  urutan: [
    "P1.1","P1.2","P1.3","P1.4","P1.5","P1.6","P1.7","P1.8",
    "P2.1","P2.2","P2.3","P2.4","P2.5",
    "P3.1","P3.2","P3.3","P3.4",
    "P4.1","P4.2","P4.3","P4.4","P4.5","P4.6","P4.7","P4.8","P4.9",
    "P5.1","P5.2","P5.3","P5.4"
  ],

  level: {
    "P1.1": { fase:1, tipe:"misi", nama:"Bagi Rata (Partitif)" },
    "P1.2": { fase:1, tipe:"misi", nama:"Isi Kantong (Kuotitif)" },
    "P1.3": { fase:1, tipe:"misi", nama:"Bahasa Pembagian" },
    "P1.4": { fase:1, tipe:"misi", nama:"Kali dan Bagi Bersaudara" },
    "P1.5": { fase:1, tipe:"misi", nama:"Ada Sisa!" },
    "P1.6": { fase:1, tipe:"misi", nama:"Satu, Sendiri, dan Nol" },
    "P1.7": { fase:1, tipe:"misi", nama:"Cerita Buatanku" },
    "P1.8": { fase:1, tipe:"asesmen_misi", nama:"Ujian Kecil Fase P1", lulusMin:3, dari:4 },

    // gen baru yang perlu ditambahkan ke Gen (lihat README-integrasi.md)
    "P2.1": { fase:2, tipe:"latihan", nama:"Bagi Rata Bergambar",        soal:10, lulus:9, gen:"bagiRata" },
    "P2.2": { fase:2, tipe:"latihan", nama:"Berapa Kelompok?",           soal:10, lulus:9, gen:"bagiKelompok" },
    "P2.3": { fase:2, tipe:"latihan", nama:"Array Dibaca Dua Arah",      soal:10, lulus:9, gen:"arrayBagi" },
    "P2.4": { fase:2, tipe:"latihan", nama:"Lompat Mundur",              soal:10, lulus:9, gen:"lompatMundur" },
    "P2.5": { fase:2, tipe:"asesmen", nama:"Ujian Fase P2",              soal:10, lulus:9, gen:"campurP2" },

    "P3.1": { fase:3, tipe:"latihan", nama:"Pasangkan!",                 soal:10, lulus:9, gen:"pasangBagi" },
    "P3.2": { fase:3, tipe:"latihan", nama:"Segitiga Fakta",             soal:10, lulus:9, gen:"segitigaFakta" },
    "P3.3": { fase:3, tipe:"latihan", nama:"Simbol Mandiri",             soal:10, lulus:9, gen:"simbolBagi" },
    "P3.4": { fase:3, tipe:"gerbang", nama:"Gerbang Hapalan",            soal:12, lulus:11, gen:"gerbangBagi" },

    // syaratKali: level Leitner PERKALIAN yang harus mastered lebih dulu.
    "P4.1": { fase:4, tipe:"leitner", syaratKali:"4.1", nama:"Fakta ÷2 — Si Setengah",
      strategiUmum:"Dibagi 2 = setengahnya! 16 ÷ 2: pikirkan 2 × ? = 16. Setengah dari 16 adalah 8." },
    "P4.2": { fase:4, tipe:"leitner", syaratKali:"4.2", nama:"Fakta ÷10 — Berapa Puluhan?",
      strategiUmum:"Dibagi 10 = berapa puluhan? 70 itu 7 puluhan, jadi 70 ÷ 10 = 7." },
    "P4.3": { fase:4, tipe:"leitner", syaratKali:"4.3", nama:"Fakta ÷5 — Lompat Lima",
      strategiUmum:"Dibagi 5: hitung lompat 5 sampai ketemu! 35 ÷ 5 → 5, 10, 15, 20, 25, 30, 35 → 7 lompatan." },
    "P4.4": { fase:4, tipe:"leitner", syaratKali:"4.4", nama:"Aturan ÷1, n÷n, dan 0",
      strategiUmum:"Dibagi 1 = angkanya sendiri. Dibagi angkanya sendiri = 1. Nol dibagi apa pun = 0. Dan ingat: DIBAGI NOL TIDAK BOLEH!" },
    "P4.5": { fase:4, tipe:"leitner", syaratKali:"4.5", nama:"Kuadrat Balik — Cari Akarnya",
      strategiUmum:"Angka persegi dibagi akarnya: 49 ÷ 7 = 7. Hafal deret persegi: 9, 16, 25, 36, 49, 64, 81!" },
    "P4.6": { fase:4, tipe:"leitner", syaratKali:"4.6", nama:"Fakta ÷4 — Setengah Dua Kali",
      strategiUmum:"Dibagi 4 = setengah, lalu setengah lagi. 32 ÷ 4: setengah 32 = 16, setengah 16 = 8." },
    "P4.7": { fase:4, tipe:"leitner", syaratKali:"4.7", nama:"Fakta ÷3",
      strategiUmum:"Pikirkan perkaliannya: 21 ÷ 3 → 3 × ? = 21 → 7." },
    "P4.8": { fase:4, tipe:"leitner", syaratKali:"4.8", nama:"Fakta ÷9 — Digit Berjumlah 9",
      strategiUmum:"Kalau digitnya berjumlah 9 (54: 5+4=9), itu keluarga ×9! 54 ÷ 9 → 9 × ? = 54 → 6." },
    "P4.9": { fase:4, tipe:"leitner", syaratKali:"4.9", nama:"Tiga Keluarga Terakhir!",
      strategiUmum:"42, 48, 56 — keluarga 6×7, 6×8, 7×8. Ingat: 5,6,7,8 → 56 = 7 × 8!" },

    "P5.1": { fase:5, tipe:"fluensi", nama:"Kuis Campur Kali-Bagi", soal:20, gen:"campurKaliBagi" },
    "P5.2": { fase:5, tipe:"fluensi", nama:"Kalahkan Rekormu!",     soal:20, gen:"rekorBagi" },
    "P5.3": { fase:5, tipe:"fluensi", nama:"Soal Cerita Dua Tipe",  soal:8,  gen:"ceritaBagi" },
    "P5.4": { fase:5, tipe:"fluensi", nama:"Misi Kilat Pemeliharaan", gen:"peliharaBagi" }
  },

  // Aturan sama dengan modul perkalian.
  mastery: { sesiLulus: 2 },
  leitner: { intervalHari: {1:0, 2:1, 3:3, 4:7, 5:14}, maksKartuBaru: 5, maksKartuSesi: 20 },
  asesmen4: { acakSebelumnya: 5, persenLulus: 0.9 }
};
