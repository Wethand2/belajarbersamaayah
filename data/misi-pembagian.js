// Misi konkret Fase P1 — benda nyata, divalidasi orang tua.
// Riset: anak wajib mengalami DUA makna pembagian —
//   partitif  = bagi rata ("12 permen untuk 3 anak, tiap anak dapat berapa?")
//   kuotitif  = pengelompokan ("12 permen, tiap kantong isi 3, jadi berapa kantong?")
// — plus pengalaman SISA dan hubungan kali-bagi (keluarga fakta).
window.MISI_BAGI = {
  "P1.1": {
    emoji:"🍽️",
    judul:"Bagi Rata (Partitif)",
    instruksi:"Ambil 12 benda kecil dan 3 piring. Bagikan SATU-SATU bergiliran ke setiap piring (seperti membagi kartu) sampai habis. Setiap piring berisi berapa?",
    pancingan:"Ucapkan bersama: '12 dibagi 3 sama dengan 4.' Coba ulangi: 12 benda ke 4 piring, lalu 10 benda ke 2 piring.",
    target:"Anak membagi rata sampai habis dan menyebut isi tiap piring dengan yakin.",
    inputLabel:"Jawaban anak untuk 12 benda ke 3 piring:"
  },
  "P1.2": {
    emoji:"🛍️",
    judul:"Isi Kantong (Kuotitif)",
    instruksi:"Sekarang kebalikannya! Ambil 12 benda. Isikan ke kantong (atau gelas), SETIAP KANTONG HARUS BERISI 3. Berapa kantong yang terisi?",
    pancingan:"Ini juga '12 dibagi 3', tapi maknanya beda: tadi membagi rata ke 3 piring, sekarang mengelompokkan isi 3-3. Dua-duanya jawabannya 4!",
    target:"Anak mengelompokkan isi sama dan menghitung banyak kelompok.",
    inputLabel:"Berapa kantong yang terisi?"
  },
  "P1.3": {
    emoji:"🗣️",
    judul:"Bahasa Pembagian",
    instruksi:"Ucapkan bersama: 'DUA BELAS DIBAGI TIGA'. Minta anak memperagakan DUA cara: (1) bagi rata ke 3 piring, (2) kelompokkan isi 3-3. Lalu tanya: apa bedanya? Apa samanya?",
    pancingan:"Ulangi untuk '10 dibagi 2' dan '15 dibagi 5'. Anak yang mengucapkan, orang tua yang memperagakan — sesekali sengaja salah, biarkan anak mengoreksi!",
    target:"Anak paham satu kalimat 'a dibagi b' punya dua peragaan yang benar.",
    inputLabel:"Jawaban anak untuk '15 dibagi 5':"
  },
  "P1.4": {
    emoji:"👯",
    judul:"Kali dan Bagi Bersaudara — MISI PENTING!",
    instruksi:"Susun kancing jadi 3 baris isi 4 (array, seperti barisan upacara). Tanya: 3 × 4 berapa? Lalu TANPA mengubah susunan: 12 dibagi 3 berapa? 12 dibagi 4 berapa? Semua jawabannya ada di susunan yang sama!",
    pancingan:"Tulis 'keluarga fakta' di kertas: 3 × 4 = 12, 4 × 3 = 12, 12 ÷ 3 = 4, 12 ÷ 4 = 3. Satu gambar, empat kalimat!",
    target:"Anak melihat sendiri bahwa pembagian adalah kebalikan perkalian pada susunan yang sama.",
    inputLabel:"Apa kata anak saat menyadari jawabannya satu susunan?"
  },
  "P1.5": {
    emoji:"🍬",
    judul:"Ada Sisa!",
    instruksi:"Ambil 13 benda, bagikan rata ke 4 piring. Habis tidak? Berapa isi tiap piring, dan berapa yang TIDAK kebagian piring?",
    pancingan:"Ucapkan: '13 dibagi 4 = 3 SISA 1.' Coba juga 14 dan 15 benda ke 4 piring. Kapan sisanya nol?",
    target:"Anak paham kadang pembagian tidak habis, dan sisa selalu LEBIH KECIL dari pembaginya.",
    inputLabel:"Jawaban anak untuk 13 dibagi 4 (isi + sisa):"
  },
  "P1.6": {
    emoji:"🥇",
    judul:"Satu, Sendiri, dan Nol",
    instruksi:"Tiga percobaan: (1) 7 permen untuk 1 anak — dapat berapa? (2) 7 permen untuk 7 anak — masing-masing dapat berapa? (3) 0 permen untuk 4 anak — dapat berapa?",
    pancingan:"Dibagi 1 = semuanya untuk dia. Dibagi angkanya sendiri = 1. Nol dibagi berapa pun = 0. Lalu tanya iseng: '5 permen dibagi 0 anak?' — tidak bisa dibagikan ke siapa-siapa! Dibagi nol TIDAK BOLEH.",
    target:"Anak menjawab ketiganya dengan yakin dan tahu dibagi nol tidak boleh.",
    inputLabel:"Jawaban anak untuk 7 permen 7 anak:"
  },
  "P1.7": {
    emoji:"📖",
    judul:"Cerita Buatanku",
    instruksi:"Giliran anak! Minta anak membuat DUA soal cerita pembagian dengan mainannya: satu cerita 'bagi rata' dan satu cerita 'isi kantong'. AYAH/IBU yang menjawab.",
    pancingan:"Sengaja jawab salah sesekali — biarkan anak mengoreksi! Kalau anak kesulitan tipe kedua, contohkan: 'Ada 8 roda, satu mobil butuh 4 roda. Bisa untuk berapa mobil?'",
    target:"Anak membuat 1 soal partitif dan 1 soal kuotitif yang benar.",
    inputLabel:"Tulis soal cerita favorit buatan anak:"
  },
  "P1.8": {
    emoji:"🎓",
    judul:"Ujian Kecil Fase P1",
    instruksi:"Berikan 4 tugas ini TANPA bantuan. Centang yang berhasil dijawab/diperagakan anak dengan benar.",
    tugas:[
      "Bagikan 10 benda rata ke 2 piring — tiap piring berapa? (5)",
      "12 benda, tiap kelompok isi 4 — berapa kelompok? (3)",
      "Susun 2 baris isi 5, lalu jawab: 10 ÷ 2 = ? dan 10 ÷ 5 = ? (5 dan 2)",
      "9 kelereng dibagi 4 anak — dapat berapa, sisa berapa? (2 sisa 1)"
    ],
    target:"Lulus jika minimal 3 dari 4 benar."
  }
};
