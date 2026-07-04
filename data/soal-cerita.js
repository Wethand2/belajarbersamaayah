// Bank soal cerita. {a} dan {b} diacak dalam rentang; jawaban = a×b.
// tipe "balik": soal pembagian terbalik (total = a × ___).
window.SOAL_CERITA = [
  { t:"Di kelas ada {a} meja. Setiap meja diduduki {b} siswa. Berapa siswa semuanya?", a:[4,8], b:[3,6] },
  { t:"Ibu membeli {a} bungkus permen. Setiap bungkus berisi {b} permen. Berapa permen semuanya?", a:[2,6], b:[5,10] },
  { t:"Satu sepeda punya 2 roda. Berapa roda pada {b} sepeda?", a:[2,2], b:[3,10] },
  { t:"Ayah menanam {a} baris pohon cabai, setiap baris {b} pohon. Berapa pohon semuanya?", a:[3,7], b:[4,9] },
  { t:"Satu kotak telur berisi 10 telur. Ibu membeli {b} kotak. Berapa telur semuanya?", a:[10,10], b:[2,9] },
  { t:"Setiap hari Andi menabung Rp{b}.000. Berapa ribu rupiah tabungan Andi setelah {a} hari?", a:[3,9], b:[1,5] },
  { t:"Satu tim futsal berisi 5 pemain. Ada {b} tim di turnamen. Berapa pemain semuanya?", a:[5,5], b:[2,10] },
  { t:"Kue disusun di {a} piring, setiap piring {b} kue. Berapa kue semuanya?", a:[4,9], b:[4,8] },
  { t:"Satu minggu ada 7 hari. Berapa hari dalam {b} minggu?", a:[7,7], b:[2,9] },
  { t:"Setiap ayat dibaca {a} kali. Jika ada {b} ayat, berapa kali membaca?", a:[2,4], b:[5,9] },
  { t:"Satu becak punya 3 roda. Berapa roda pada {b} becak?", a:[3,3], b:[3,10] },
  { t:"Kakak membeli {a} buku. Harga satu buku Rp{b}.000. Berapa ribu rupiah harganya semua?", a:[3,8], b:[2,9] },
  { t:"Satu rak berisi {b} buku. Ada {a} rak di perpustakaan kelas. Berapa buku semuanya?", a:[3,7], b:[6,10] },
  { t:"Setiap kandang berisi {b} ayam. Ada {a} kandang. Berapa ayam semuanya?", a:[4,8], b:[5,9] },
  { t:"Bus kecil memuat 10 penumpang. Berapa penumpang dalam {b} bus?", a:[10,10], b:[3,9] },
  { t:"Adik menyusun balok {a} tingkat, setiap tingkat {b} balok. Berapa balok semuanya?", a:[3,6], b:[3,6] },
  { t:"Satu hari Ani minum {b} gelas air. Berapa gelas dalam {a} hari?", a:[3,7], b:[6,8] },
  { t:"Pedagang menyusun jeruk dalam {a} keranjang, setiap keranjang {b} jeruk. Berapa jeruk semuanya?", a:[5,9], b:[5,9] },
  { t:"Setiap siswa membawa {a} buku tulis. Ada {b} siswa. Berapa buku tulis semuanya?", a:[2,4], b:[6,10] },
  { t:"Ada {a} vas bunga, setiap vas berisi {b} tangkai. Berapa tangkai bunga semuanya?", a:[4,8], b:[4,8] },
  // Soal terbalik (fondasi pembagian): jawab isi per kelompok.
  { t:"Ada {hasil} kue dibagi rata ke {a} piring. Setiap piring berisi berapa kue?", a:[3,8], b:[3,8], balik:true },
  { t:"{hasil} kelereng dimasukkan sama banyak ke {a} kantong. Berapa kelereng tiap kantong?", a:[2,9], b:[2,9], balik:true },
  { t:"Bu guru membagikan {hasil} pensil sama rata kepada {a} siswa. Setiap siswa dapat berapa?", a:[3,9], b:[2,8], balik:true }
];
