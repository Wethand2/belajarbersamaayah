// Misi konkret Fase A1 — benda nyata & tubuh anak, divalidasi orang tua.
// Riset: number sense (subitizing, pola jari, garis bilangan) di kelas awal
// memprediksi kelancaran berhitung kelas berikutnya; strategi hitung-lanjut
// dan make-ten harus DIALAMI dengan benda sebelum jadi simbol.
window.MISI_TAMBAH = {
  "A1.1": {
    emoji:"👀",
    judul:"Cepat Lihat (Subitizing)",
    instruksi:"Lempar 3–5 kancing ke meja, TUTUP dengan tangan setelah 2 detik. Tanya: 'Tadi ada berapa?' Anak menjawab TANPA menghitung satu-satu. Ulangi 10 kali dengan 2 sampai 5 benda.",
    pancingan:"Susun juga seperti titik dadu (⚄) — pola dadu lebih mudah 'terlihat'. Kalau anak masih menghitung satu-satu, kecilkan jumlahnya dulu.",
    target:"Anak menyebut banyaknya 1–5 benda secara langsung (tanpa menunjuk satu-satu).",
    inputLabel:"Sampai berapa benda anak bisa 'cepat lihat'?"
  },
  "A1.2": {
    emoji:"🖐️",
    judul:"Pola Jari Kilat",
    instruksi:"Sebut angka 1–10, anak langsung menunjukkan jarinya SECEPAT KILAT — tanpa menghitung jari satu-satu. Lalu bertukar peran: orang tua tunjukkan jari, anak sebut angkanya.",
    pancingan:"Angka 6–10 selalu 'satu tangan penuh + sisanya': 7 = 5 dan 2. Ucapkan begitu setiap kali — ini bibit make-ten!",
    target:"Anak menunjukkan 1–10 jari tanpa menghitung satu-satu.",
    inputLabel:"Angka mana yang paling lancar? Mana yang masih dihitung?"
  },
  "A1.3": {
    emoji:"🫐",
    judul:"Menggabung (Makna Tambah)",
    instruksi:"Dua piring: isi 3 dan 2 kancing. GABUNGKAN ke piring besar. Berapa semuanya? Ucapkan bersama: 'TIGA TAMBAH DUA SAMA DENGAN LIMA.' Ulangi dengan pasangan lain sampai 10.",
    pancingan:"Variasikan dua makna: menggabung (dua piring jadi satu) dan bertambah (burung datang lagi ke dahan). Keduanya 'tambah'!",
    target:"Anak menggabung dua kelompok dan menyebut kalimat penjumlahannya.",
    inputLabel:"Jawaban anak untuk 3 tambah 2:"
  },
  "A1.4": {
    emoji:"🧠",
    judul:"Hitung Lanjut, Jangan Ulang! — MISI PENTING!",
    instruksi:"Taruh 8 kancing di gelas TERTUTUP (anak tahu isinya 8, tapi tak bisa melihatnya). Taruh 3 kancing di luar. Berapa semuanya? Anak harus MULAI dari 8 lalu lanjut: '9, 10, 11' — bukan menghitung ulang dari 1!",
    pancingan:"Kalau anak mau membuka gelas dan menghitung dari 1, tahan dulu: 'Kita sudah TAHU di dalam ada 8. Simpan 8 di kepala, lanjutkan!' Mulai selalu dari angka yang lebih besar.",
    target:"Anak menghitung lanjut dari angka terbesar tanpa mengulang dari 1.",
    inputLabel:"Apakah anak masih menghitung dari 1, atau sudah lanjut?"
  },
  "A1.5": {
    emoji:"🥚",
    judul:"Sahabat 10",
    instruksi:"Pakai wadah telur isi 10 (atau gambar kotak 2×5 = bingkai-10). Isi 7 lubang dengan kancing. Tanya: 'Berapa lagi supaya penuh 10?' Ulangi untuk 9, 8, 6, 5, 4, 3, 2, 1 lubang terisi.",
    pancingan:"Inilah 'sahabat 10': 1-9, 2-8, 3-7, 4-6, 5-5. Buat lagunya, tempel di kulkas! Sahabat 10 adalah kunci semua penjumlahan besar nanti.",
    target:"Anak menyebut pasangan 10 dengan cepat untuk minimal 4 pasangan.",
    inputLabel:"Pasangan 10 mana yang paling lancar?"
  },
  "A1.6": {
    emoji:"🦋",
    judul:"Dobel di Tubuhku",
    instruksi:"Berburu DOBEL di tubuh dan rumah: 2 tangan × 5 jari (5+5), mata (1+1), roda dua sepeda... Peragakan 3+3, 4+4 dengan jari dua tangan sekaligus. Berapa hasilnya?",
    pancingan:"Dobel mudah diingat karena ada 'gambarnya': 4+4 = laba-laba (8 kaki), 6+6 = sekotak telur (12). Cari gambaran versi anak sendiri!",
    target:"Anak hafal dobel 1+1 sampai 5+5 dan menemukan 2 contoh dobel di rumah.",
    inputLabel:"Dobel favorit temuan anak:"
  },
  "A1.7": {
    emoji:"📖",
    judul:"Cerita Buatanku",
    instruksi:"Giliran anak! Minta anak membuat 2 soal cerita penjumlahan dengan mainannya — satu cerita MENGGABUNG (dua kelompok jadi satu) dan satu cerita BERTAMBAH (datang lagi). AYAH/IBU yang menjawab.",
    pancingan:"Sengaja jawab salah sesekali — biarkan anak mengoreksi! Itu tanda ia benar-benar paham.",
    target:"Anak membuat 1 cerita menggabung dan 1 cerita bertambah yang benar.",
    inputLabel:"Tulis cerita favorit buatan anak:"
  },
  "A1.8": {
    emoji:"🎓",
    judul:"Ujian Kecil Fase A1",
    instruksi:"Berikan 4 tugas ini TANPA bantuan. Centang yang berhasil dijawab/diperagakan anak dengan benar.",
    tugas:[
      "Lempar 4 kancing, tutup cepat — anak menyebut '4' tanpa menghitung satu-satu",
      "Tunjukkan 7 jari secepat kilat (5 dan 2, tanpa menghitung)",
      "8 kancing di gelas tertutup + 2 di luar — anak menghitung LANJUT: '9, 10' (10)",
      "Wadah telur terisi 6 — 'berapa lagi supaya 10?' (4)"
    ],
    target:"Lulus jika minimal 3 dari 4 benar."
  }
};
