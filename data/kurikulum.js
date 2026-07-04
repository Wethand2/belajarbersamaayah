// Definisi kurikulum: fase, level, tipe, dan kriteria kelulusan.
// tipe: misi | asesmen_misi | latihan | asesmen | gerbang | leitner | fluensi
window.KURIKULUM = {
  fase: [
    { id: 1, nama: "Fase 1 · Konkret", emoji: "🧺", desc: "Paham perkalian lewat benda nyata di rumah" },
    { id: 2, nama: "Fase 2 · Gambar", emoji: "🖼️", desc: "Kelompok bergambar, array, dan lompat bilangan" },
    { id: 3, nama: "Fase 3 · Simbol", emoji: "✖️", desc: "Nyaman dengan tulisan a × b" },
    { id: 4, nama: "Fase 4 · Hapalan", emoji: "⚡", desc: "Kartu pintar & strategi jitu (9 level)" },
    { id: 5, nama: "Fase 5 · Jago!", emoji: "🏆", desc: "Cepat, campuran, dan soal cerita" }
  ],
  // Urutan linear. Level terbuka saat level sebelumnya lulus.
  urutan: [
    "1.1","1.2","1.3","1.4","1.5","1.6","1.7","1.8",
    "2.1","2.2","2.3","2.4","2.5",
    "3.1","3.2","3.3","3.4",
    "4.1","4.2","4.3","4.4","4.5","4.6","4.7","4.8","4.9",
    "5.1","5.2","5.3","5.4"
  ],
  level: {
    "1.1": { fase:1, tipe:"misi",  nama:"Kelompok Sama Banyak" },
    "1.2": { fase:1, tipe:"misi",  nama:"Penjumlahan Berulang" },
    "1.3": { fase:1, tipe:"misi",  nama:"Bahasa Perkalian" },
    "1.4": { fase:1, tipe:"misi",  nama:"Berburu Perkalian di Rumah" },
    "1.5": { fase:1, tipe:"misi",  nama:"Susun Baris (Pra-Array)" },
    "1.6": { fase:1, tipe:"misi",  nama:"Nol dan Satu" },
    "1.7": { fase:1, tipe:"misi",  nama:"Cerita Buatanku" },
    "1.8": { fase:1, tipe:"asesmen_misi", nama:"Ujian Kecil Fase 1", lulusMin:3, dari:4 },

    "2.1": { fase:2, tipe:"latihan", nama:"Hitung Kelompok Bergambar", soal:10, lulus:9, gen:"kelompok" },
    "2.2": { fase:2, tipe:"latihan", nama:"Penjumlahan Berulang Bergambar", soal:10, lulus:9, gen:"berulang" },
    "2.3": { fase:2, tipe:"latihan", nama:"Array Baris × Kolom", soal:10, lulus:9, gen:"array" },
    "2.4": { fase:2, tipe:"latihan", nama:"Lompat Bilangan", soal:10, lulus:9, gen:"lompat" },
    "2.5": { fase:2, tipe:"asesmen", nama:"Ujian Fase 2", soal:10, lulus:9, gen:"campur2" },

    "3.1": { fase:3, tipe:"latihan", nama:"Pasangkan!", soal:10, lulus:9, gen:"pasang" },
    "3.2": { fase:3, tipe:"latihan", nama:"Simbol + Gambar Bantuan", soal:10, lulus:9, gen:"simbolBantu" },
    "3.3": { fase:3, tipe:"latihan", nama:"Simbol Mandiri", soal:10, lulus:9, gen:"simbol" },
    "3.4": { fase:3, tipe:"gerbang", nama:"Gerbang Hapalan", soal:12, lulus:11, gen:"gerbang" },

    "4.1": { fase:4, tipe:"leitner", nama:"Fakta ×2 — Si Dobel", strategiUmum:"Kali 2 artinya DOBEL! 2 × 7 = 7 + 7 = 14." },
    "4.2": { fase:4, tipe:"leitner", nama:"Fakta ×10 — Si Puluhan", strategiUmum:"Kali 10 = jadikan puluhan. 10 × 6 = 6 puluhan = 60." },
    "4.3": { fase:4, tipe:"leitner", nama:"Fakta ×5 — Setengah dari 10", strategiUmum:"Kali 5 = kali 10 lalu dibagi dua. 5 × 8: 10×8=80, setengahnya 40. Jawaban selalu berakhiran 0 atau 5!" },
    "4.4": { fase:4, tipe:"leitner", nama:"Fakta ×1 dan ×0", strategiUmum:"Kali 1 = angkanya sendiri. Kali 0 = selalu 0. Ingat piring kosong!" },
    "4.5": { fase:4, tipe:"leitner", nama:"Fakta Kuadrat — Angka Persegi", strategiUmum:"Angka kembar membentuk PERSEGI: 9, 16, 25, 36, 49, 64, 81, 100. Ini angka spesial!" },
    "4.6": { fase:4, tipe:"leitner", nama:"Fakta ×4 — Dobel-Dobel", strategiUmum:"Kali 4 = dobel dua kali! 4 × 6: dobel 6 = 12, dobel lagi = 24." },
    "4.7": { fase:4, tipe:"leitner", nama:"Fakta ×3 — Dobel + Sekali Lagi", strategiUmum:"Kali 3 = dobel lalu tambah sekali lagi. 3 × 7 = 14 + 7 = 21." },
    "4.8": { fase:4, tipe:"leitner", nama:"Fakta ×9 — Hampir Sepuluh", strategiUmum:"Kali 9 = kali 10 kurangi satu kali. 9 × 6 = 60 − 6 = 54. Cek: digit jawaban selalu berjumlah 9!" },
    "4.9": { fase:4, tipe:"leitner", nama:"Tiga Fakta Terakhir!", strategiUmum:"Tinggal 6×7, 6×8, 7×8! Pakai batu loncatan ×5 dan ×7. Ingat: 5,6,7,8 → 56 = 7×8!" },

    "5.1": { fase:5, tipe:"fluensi", nama:"Kuis Campuran", soal:20, gen:"campurSemua" },
    "5.2": { fase:5, tipe:"fluensi", nama:"Kalahkan Rekormu!", soal:20, gen:"rekor" },
    "5.3": { fase:5, tipe:"fluensi", nama:"Soal Cerita", soal:8, gen:"cerita" },
    "5.4": { fase:5, tipe:"fluensi", nama:"Misi Kilat Pemeliharaan", gen:"pelihara" }
  },
  // Aturan mastery: butuh N sesi lulus pada hari BERBEDA.
  mastery: { sesiLulus: 2 },
  leitner: {
    intervalHari: {1:0, 2:1, 3:3, 4:7, 5:14},
    maksKartuBaru: 5,
    maksKartuSesi: 20
  },
  asesmen4: { acakSebelumnya: 5, persenLulus: 0.9 }
};
