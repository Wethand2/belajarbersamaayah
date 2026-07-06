// Kurikulum modul PENGURANGAN (fakta sampai 20) — format sama dengan modul lain.
// Dasar riset (dokumen Riset 4 operasi, Bab 3.3 & 8.2):
//   · Pengurangan diajarkan sebagai "BERPIKIR PENJUMLAHAN" lewat keluarga
//     fakta — bukan menghitung mundur sebagai strategi utama.
//   · TIGA makna pengurangan wajib dialami: mengambil (take away),
//     membandingkan (berapa lebihnya?), melengkapi (berapa lagi?).
//   · Kartu K4.x terkunci oleh level penjumlahan pasangannya (syaratTambah):
//     kartu 13−8 baru muncul setelah keluarga 8+5 mastered.
//   · Representasi kunci: bingkai-10 yang dikosongkan, bar model
//     (bagian-keseluruhan), garis bilangan (mundur vs maju-untuk-selisih).
window.KURIKULUM_KURANG = {
  syaratModul: "A4.2", // pulau terbuka setelah fakta +1/+2 dikuasai — langsung "panen" −1/−2

  fase: [
    { id: 1, nama: "Fase K1 · Konkret", emoji: "🫳", desc: "Tiga makna pengurangan lewat benda nyata" },
    { id: 2, nama: "Fase K2 · Gambar", emoji: "📊", desc: "Bingkai-10 dikosongkan, bar model, dan garis bilangan" },
    { id: 3, nama: "Fase K3 · Simbol", emoji: "➖", desc: "Nyaman dengan tulisan a − b dan segitiga fakta" },
    { id: 4, nama: "Fase K4 · Hapalan", emoji: "⚡", desc: "Kartu pengurangan menumpang keluarga fakta penjumlahan (9 level)" },
    { id: 5, nama: "Fase K5 · Jago!", emoji: "🏆", desc: "Campuran tambah-kurang, rekor, dan soal cerita" }
  ],

  urutan: [
    "K1.1","K1.2","K1.3","K1.4","K1.5","K1.6","K1.7","K1.8",
    "K2.1","K2.2","K2.3","K2.4","K2.5",
    "K3.1","K3.2","K3.3","K3.4",
    "K4.1","K4.2","K4.3","K4.4","K4.5","K4.6","K4.7","K4.8","K4.9",
    "K5.1","K5.2","K5.3","K5.4"
  ],

  level: {
    "K1.1": { fase:1, tipe:"misi", nama:"Mengambil (Take Away)" },
    "K1.2": { fase:1, tipe:"misi", nama:"Berapa Lebihnya? (Membandingkan)" },
    "K1.3": { fase:1, tipe:"misi", nama:"Berapa Lagi? (Melengkapi)" },
    "K1.4": { fase:1, tipe:"misi", nama:"Tambah dan Kurang Bersaudara" },
    "K1.5": { fase:1, tipe:"misi", nama:"Lewat 10!" },
    "K1.6": { fase:1, tipe:"misi", nama:"Nol dan Kembar" },
    "K1.7": { fase:1, tipe:"misi", nama:"Cerita Buatanku" },
    "K1.8": { fase:1, tipe:"asesmen_misi", nama:"Ujian Kecil Fase K1", lulusMin:3, dari:4 },

    // gen baru — spesifikasi di Riset/Panduan modul pengurangan.md
    "K2.1": { fase:2, tipe:"latihan", nama:"Bingkai-10 Dikosongkan",       soal:10, lulus:9, gen:"tenframeKurang" },
    "K2.2": { fase:2, tipe:"latihan", nama:"Bandingkan Dua Baris",         soal:10, lulus:9, gen:"bandingBaris" },
    "K2.3": { fase:2, tipe:"latihan", nama:"Bar Model: Bagian yang Hilang", soal:10, lulus:9, gen:"barModel" },
    "K2.4": { fase:2, tipe:"latihan", nama:"Garis Bilangan: Mundur / Maju", soal:10, lulus:9, gen:"garisKurang" },
    "K2.5": { fase:2, tipe:"asesmen", nama:"Ujian Fase K2",                soal:10, lulus:9, gen:"campurK2" },

    "K3.1": { fase:3, tipe:"latihan", nama:"Pasangkan!",                   soal:10, lulus:9, gen:"pasangKurang" },
    "K3.2": { fase:3, tipe:"latihan", nama:"Segitiga Fakta",               soal:10, lulus:9, gen:"segitigaKurang" },
    "K3.3": { fase:3, tipe:"latihan", nama:"Simbol Mandiri",               soal:10, lulus:9, gen:"simbolKurang" },
    "K3.4": { fase:3, tipe:"gerbang", nama:"Gerbang Hapalan",              soal:12, lulus:11, gen:"gerbangKurang" },

    // syaratTambah: level Leitner PENJUMLAHAN yang harus mastered lebih dulu.
    "K4.1": { fase:4, tipe:"leitner", syaratTambah:"A4.1", nama:"Fakta −1 — Angka Sebelumnya",
      strategiUmum:"Kurang 1 = sebut angka SEBELUMNYA. 8 − 1? Sebelum 8 adalah 7. Dan ingat: 8 − 7 = 1, karena 7 + 1 = 8!" },
    "K4.2": { fase:4, tipe:"leitner", syaratTambah:"A4.2", nama:"Fakta −2 — Mundur Dua",
      strategiUmum:"Kurang 2 = mundur dua langkah: 9 → 8 → 7. Kalau yang dikurangi hampir sama besar (9 − 7), pikirkan: 7 + ? = 9!" },
    "K4.3": { fase:4, tipe:"leitner", syaratTambah:"A4.3", nama:"Sahabat 10 Pecah",
      strategiUmum:"10 pecah jadi pasangan sahabatnya: 10 − 3 = 7, 10 − 4 = 6, 10 − 6 = 4. Kalau hafal sahabat 10, ini gratis!" },
    "K4.4": { fase:4, tipe:"leitner", syaratTambah:"A4.4", nama:"Aturan −0, n−n, dan −10",
      strategiUmum:"Kurang 0 = tetap. Kurang angkanya sendiri = 0. Belasan kurang 10 = tinggal satuannya: 17 − 10 = 7." },
    "K4.5": { fase:4, tipe:"leitner", syaratTambah:"A4.5", nama:"Dobel Dibelah",
      strategiUmum:"14 − 7? Ingat 14 itu DOBEL 7 → jawabannya 7! Angka dobel dibelah dua sama besar." },
    "K4.6": { fase:4, tipe:"leitner", syaratTambah:"A4.6", nama:"Hampir Dobel",
      strategiUmum:"13 − 6? Ingat 13 = 6 + 7 (hampir dobel). Jadi 13 − 6 = 7 dan 13 − 7 = 6." },
    "K4.7": { fase:4, tipe:"leitner", syaratTambah:"A4.7", nama:"Lewat 10 (dari 9)",
      strategiUmum:"14 − 9: MAJU dari 9! 9 + 1 = 10, 10 + 4 = 14 → jawabannya 1 + 4 = 5. Atau ingat keluarganya: 9 + 5 = 14." },
    "K4.8": { fase:4, tipe:"leitner", syaratTambah:"A4.8", nama:"Lewat 10 (dari 8)",
      strategiUmum:"13 − 8: MAJU dari 8! 8 + 2 = 10, 10 + 3 = 13 → jawabannya 2 + 3 = 5. Keluarganya: 8 + 5 = 13." },
    "K4.9": { fase:4, tipe:"leitner", syaratTambah:"A4.9", nama:"Empat Keluarga Terakhir!",
      strategiUmum:"8, 9, 11, 12 — keluarga 3+5, 3+6, 4+7, 5+7. Selalu tanya: berapa TAMBAH berapa?" },

    "K5.1": { fase:5, tipe:"fluensi", nama:"Kuis Campur Tambah-Kurang", soal:20, gen:"campurTambahKurang" },
    "K5.2": { fase:5, tipe:"fluensi", nama:"Kalahkan Rekormu!",         soal:20, gen:"rekorKurang" },
    "K5.3": { fase:5, tipe:"fluensi", nama:"Soal Cerita 3 Makna",       soal:8,  gen:"ceritaKurang" },
    "K5.4": { fase:5, tipe:"fluensi", nama:"Misi Kilat Pemeliharaan",   gen:"peliharaKurang" }
  },

  // Aturan sama dengan modul lain.
  mastery: { sesiLulus: 2 },
  leitner: { intervalHari: {1:0, 2:1, 3:3, 4:7, 5:14}, maksKartuBaru: 5, maksKartuSesi: 20 },
  asesmen4: { acakSebelumnya: 5, persenLulus: 0.9 }
};
