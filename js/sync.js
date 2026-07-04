// ====== SYNC (GET-only ke Apps Script, antrean offline-first) ======
window.Sync = (function(){
  const MAX_URL = 7500; // batas aman panjang URL

  function aktif(){ return !!(window.CONFIG && CONFIG.WEBAPP_URL); }

  function queue(action, payload){
    if(!aktif()) return;
    State.raw.syncQueue.push({ action, payload, ts: Date.now() });
    State.save();
    flush();
  }

  let flushing = false;
  async function flush(){
    if(!aktif() || flushing || !navigator.onLine) return;
    flushing = true;
    try{
      while(State.raw.syncQueue.length){
        const item = State.raw.syncQueue[0];
        const ok = await kirim(item.action, item.payload);
        if(!ok) break; // coba lagi nanti
        State.raw.syncQueue.shift();
        State.save();
      }
    } finally { flushing = false; }
  }

  async function kirim(action, payload){
    const base = `${CONFIG.WEBAPP_URL}?action=${encodeURIComponent(action)}`;
    const enc = encodeURIComponent(JSON.stringify(payload||{}));
    // chunking bila terlalu panjang
    if(base.length + enc.length + 20 <= MAX_URL){
      return await hit(`${base}&payload=${enc}`);
    }
    const potong = MAX_URL - base.length - 60;
    const total = Math.ceil(enc.length / potong);
    const gid = Math.random().toString(36).slice(2,10);
    for(let i=0;i<total;i++){
      const bagian = enc.slice(i*potong, (i+1)*potong);
      const ok = await hit(`${base}&gid=${gid}&chunk=${i+1}&totalChunk=${total}&payload=${bagian}`);
      if(!ok) return false;
    }
    return true;
  }

  async function hit(url){
    try{
      const r = await fetch(url, { method:"GET" });
      const j = await r.json();
      return !!(j && j.ok);
    }catch(e){ return false; }
  }

  // Panggil di akhir sesi
  function sesiSelesai(tipe, level, jumlah, benar, durasi, detail){
    const p = State.P(); if(!p) return;
    queue("logSesi", {
      anak_id: p.id, tipe, level,
      jumlah_soal: jumlah, benar, durasi_detik: durasi,
      detail_json: JSON.stringify(detail||{}),
      timestamp: new Date().toISOString()
    });
    queue("syncProgres", State.snapshotProgres());
  }

  window.addEventListener("online", flush);
  return { aktif, queue, flush, sesiSelesai };
})();
