// Misi konkret Fase K1 — benda nyata, divalidasi orang tua.
// Riset: TIGA makna pengurangan wajib dialami anak —
//   mengambil     ("8 kue dimakan 3, sisa berapa?")
//   membandingkan ("kakak punya 8, adik 5 — berapa lebihnya?")
//   melengkapi    ("sudah 5, berapa lagi supaya 8?")
// — plus hubungan tambah-kurang (keluarga fakta) dan strategi lewat-10.
window.MISI_KURANG = {
  "K1.1": {
    emoji:"🍪",
    judul:"Mengambil (Take Away)",
    instruksi:"Taruh 8 kue (atau kancing) di piring. Anak MENGAMBIL 3 dan menggenggamnya. Sisa berapa di piring? Ucapkan bersama: 'DELAPAN KURANG TIGA SAMA DENGAN LIMA.'",
    pancingan:"Lalu buka genggaman: 5 + 3 = 8 lagi! Tunjukkan bahwa yang diambil + yang sisa = semula. Ini bibit keluarga fakta.",
    target:"Anak memperagakan mengambil dan menyebut kalimat pengurangannya.",
    inputLabel:"Jawaban anak untuk 8 kurang 3:"
  },
  "K1.2": {
    emoji:"⚖️",
    judul:"Berapa Lebihnya? (Membandingkan)",
    instruksi:"Susun DUA baris kancing sejajar dan rapat: baris kakak 9, baris adik 6. JANGAN dihitung ulang — lihat saja: berapa kancing kakak yang TIDAK punya pasangan?",
    pancingan:"Ini juga pengurangan: 9 − 6 = 3, padahal tidak ada yang diambil! Kata kuncinya bukan 'sisa', tapi 'berapa lebihnya'. Ulangi dengan 7 vs 4, 10 vs 6.",
    target:"Anak menemukan selisih dengan menjodohkan, tanpa menghitung ulang semua.",
    inputLabel:"Jawaban anak untuk 9 banding 6:"
  },
  "K1.3": {
    emoji:"🎯",
    judul:"Berapa Lagi? (Melengkapi)",
    instruksi:"Wadah telur isi 10: masukkan 7 kancing. Tanya: 'Berapa lagi supaya penuh?' Lalu variasi tanpa wadah: 'Kamu punya 5 stiker, ingin 8 — berapa lagi yang harus dikumpulkan?'",
    pancingan:"'Berapa lagi' dijawab dengan MAJU dari angka kecil: 5 → 6, 7, 8 = 3 langkah. Ini pengurangan (8 − 5) yang diselesaikan dengan PENJUMLAHAN — persis strategi terbaik!",
    target:"Anak menjawab 'berapa lagi' dengan maju, bukan mundur.",
    inputLabel:"Jawaban anak untuk 'dari 5 ke 8':"
  },
  "K1.4": {
    emoji:"👯",
    judul:"Tambah dan Kurang Bersaudara — MISI PENTING!",
    instruksi:"Taruh 8 kancing merah dan 5 kancing biru dalam satu lingkaran tali (semuanya 13). Tutup kelompok biru dengan tangan: 13 − 5 = ? Tutup yang merah: 13 − 8 = ? Semua jawabannya sudah ada di depan mata!",
    pancingan:"Tulis 'keluarga fakta' di kertas: 8 + 5 = 13, 5 + 8 = 13, 13 − 5 = 8, 13 − 8 = 5. Satu gambar, empat kalimat! Ulangi dengan keluarga 7, 3, 10.",
    target:"Anak melihat sendiri bahwa pengurangan adalah kebalikan penjumlahan pada kelompok yang sama.",
    inputLabel:"Apa kata anak saat menyadari jawabannya satu keluarga?"
  },
  "K1.5": {
    emoji:"🌉",
    judul:"Lewat 10!",
    instruksi:"Susun 13 kancing: 10 di wadah telur penuh + 3 di luar. Ambil 8 dengan cara pintar: ambil dulu 3 yang di luar (sisa 10), lalu ambil 5 dari wadah. Sisa berapa? Ucapkan: '13 kurang 8... lewat 10... sisa 5!'",
    pancingan:"Jembatan 10 membuat pengurangan besar jadi dua langkah kecil. Coba juga 12 − 9 dan 15 − 8. Jangan biarkan anak mundur satu-satu 8 kali!",
    target:"Anak mengurangkan lewat 10 dalam dua langkah, bukan mundur satu-satu.",
    inputLabel:"Jawaban anak untuk 13 kurang 8:"
  },
  "K1.6": {
    emoji:"🪞",
    judul:"Nol dan Kembar",
    instruksi:"Tiga percobaan: (1) 6 permen, tidak ada yang diambil — sisa? (2) 6 permen, diambil semuanya — sisa? (3) 14 kancing = dobel 7: belah dua sama besar — masing-masing berapa?",
    pancingan:"Kurang 0 = tetap. Kurang angkanya sendiri = 0. Dan angka dobel (14 = 7+7) kalau dikurangi setengahnya, jawabannya setengahnya juga!",
    target:"Anak menjawab ketiganya dengan yakin tanpa menghitung.",
    inputLabel:"Jawaban anak untuk 14 dibelah dua:"
  },
  "K1.7": {
    emoji:"📖",
    judul:"Cerita Buatanku",
    instruksi:"Giliran anak! Minta anak membuat 3 soal cerita pengurangan dengan mainannya — satu cerita MENGAMBIL, satu cerita MEMBANDINGKAN, satu cerita BERAPA LAGI. AYAH/IBU yang menjawab.",
    pancingan:"Sengaja jawab salah sesekali — biarkan anak mengoreksi! Cerita membandingkan biasanya paling sulit; bantu dengan contoh: 'Ayam kakek 9, ayam nenek 6...'",
    target:"Anak membuat minimal 2 dari 3 makna dengan benar.",
    inputLabel:"Tulis cerita favorit buatan anak:"
  },
  "K1.8": {
    emoji:"🎓",
    judul:"Ujian Kecil Fase K1",
    instruksi:"Berikan 4 tugas ini TANPA bantuan. Centang yang berhasil dijawab/diperagakan anak dengan benar.",
    tugas:[
      "9 kancing, ambil 4 — sisa berapa? (5)",
      "Baris 8 vs baris 5 — berapa lebihnya? (3, dengan menjodohkan)",
      "Punya 6, ingin 10 — berapa lagi? (4, dengan maju)",
      "Susun keluarga fakta dari 7, 3, dan 10 (7+3=10, 3+7=10, 10−3=7, 10−7=3)"
    ],
    target:"Lulus jika minimal 3 dari 4 benar."
  }
};
