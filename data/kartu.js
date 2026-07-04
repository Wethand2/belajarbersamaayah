// 49 kartu unik (fakta komutatif digabung, id = "min x max").
// Dibangun terprogram agar konsisten dengan kurikulum Fase 4.
(function(){
  const K = [];
  const add = (a,b,level,strategi)=>{
    const lo=Math.min(a,b), hi=Math.max(a,b);
    K.push({ id:`${lo}x${hi}`, a:lo, b:hi, jawaban:a*b, level, strategi });
  };

  // 4.1 — ×2 (9 kartu)
  for(let b=2;b<=10;b++) add(2,b,"4.1",`2 × ${b} = dobel! ${b} + ${b} = ${2*b}.`);

  // 4.2 — ×10 (8 kartu)
  for(let b=3;b<=10;b++) add(10,b,"4.2",`10 × ${b} = ${b} puluhan = ${10*b}.`);

  // 4.3 — ×5 (7 kartu)
  [3,4,5,6,7,8,9].forEach(b=> add(5,b,"4.3",`5 × ${b}: dulu 10 × ${b} = ${10*b}, lalu setengahnya = ${5*b}.`));

  // 4.4 — ×1 dan ×0 (4 kartu aturan)
  add(1,7,"4.4","Kali 1 = angkanya sendiri. 1 × 7 = 7.");
  add(1,10,"4.4","Kali 1 = angkanya sendiri. 1 × 10 = 10.");
  add(0,6,"4.4","Kali 0 = piring kosong! 0 × 6 = 0.");
  add(0,9,"4.4","Kali 0 = piring kosong! 0 × 9 = 0.");

  // 4.5 — kuadrat (6 kartu)
  [3,4,6,7,8,9].forEach(n=> add(n,n,"4.5",`${n} × ${n} membentuk persegi. Angka persegi: ${n*n}.`));

  // 4.6 — ×4 (5 kartu)
  [3,6,7,8,9].forEach(b=> add(4,b,"4.6",`4 × ${b} = dobel-dobel: dobel ${b} = ${2*b}, dobel lagi = ${4*b}.`));

  // 4.7 — ×3 (3 kartu)
  [6,7,8].forEach(b=> add(3,b,"4.7",`3 × ${b} = dobel + sekali lagi: ${2*b} + ${b} = ${3*b}.`));

  // 4.8 — ×9 (4 kartu, termasuk 3×9)
  [3,6,7,8].forEach(b=> add(9,b,"4.8",`9 × ${b} = (10 × ${b}) − ${b} = ${10*b} − ${b} = ${9*b}. Cek: ${Math.floor(9*b/10)} + ${9*b%10} = 9!`));

  // 4.9 — tiga fakta terakhir (3 kartu)
  add(6,7,"4.9","6 × 7 = (5 × 7) + 7 = 35 + 7 = 42.");
  add(6,8,"4.9","6 × 8 = (5 × 8) + 8 = 40 + 8 = 48.");
  add(7,8,"4.9","7 × 8 = 56. Ingat: 5, 6, 7, 8 → 56 = 7 × 8! Atau (7 × 7) + 7 = 49 + 7.");

  window.KARTU = K;
  window.KARTU_MAP = Object.fromEntries(K.map(k=>[k.id,k]));
  window.KARTU_PER_LEVEL = {};
  K.forEach(k=>{ (window.KARTU_PER_LEVEL[k.level] ||= []).push(k.id); });
})();
