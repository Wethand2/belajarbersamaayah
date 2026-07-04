// ====== APP ROUTER & INIT ======
window.App = (function(){
  function go(view, param){
    if(typeof V[view] !== "function"){ console.warn("View tidak ada:", view); return; }
    clearInterval(window._sesi && window._sesi._t);
    V[view](param);
  }
  function init(){
    State.load();
    document.getElementById("btn-home").addEventListener("click", ()=>go("peta"));
    if(!State.P()) go("onboarding");
    else { go("peta"); Sync.flush(); }
  }
  document.addEventListener("DOMContentLoaded", init);
  return { go };
})();
