/* Terminseite im Unterordner termine/ (Simon 15.11.2026): Links auf die übrigen Website-Seiten zeigen eine Ebene höher,
   ohne die Mockup-Parameter (?m=v1&k=6…). Gilt für alle Links, auch die erst später erzeugten (Menü, Fenster, Formular). */
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;var h=a.getAttribute('href');
  if(!h||/^(https?:|mailto:|tel:|#|\.\.\/|\/)/.test(h))return;var datei=h.split(/[?#]/)[0];
  if(!/\.html$/.test(datei)||datei==='termine.html'||datei==='preise-v1.html'||datei==='index.html')return;
  e.preventDefault();var anker=h.indexOf('#')>=0?h.slice(h.indexOf('#')):'';location.href='../'+datei+anker;},true);
