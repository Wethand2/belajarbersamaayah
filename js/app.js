// ====== APP ROUTER & INIT (dengan login/logout) ======
window.App = (function(){
  function go(view, param){
    if(typeof V[view] !== "function"){ console.warn("View tidak ada:", view); return; }
    clearInterval(window._sesi && window._sesi._t);
    V[view](param);
  }
  function init(){
    State.load();
    document.getElementById("btn-home").addEventListener("click", ()=>{
      if(State.raw.loggedIn && State.P()) go("peta");
    });
    if(!State.raw.profils.length) go("signup");                 // belum ada anak → daftar
    else if(!State.raw.loggedIn || !State.P()) go("login");     // ada anak, belum masuk
    else { go("peta"); Sync.flush(); }                          // sudah masuk
  }
  document.addEventListener("DOMContentLoaded", init);
  return { go };
})();
