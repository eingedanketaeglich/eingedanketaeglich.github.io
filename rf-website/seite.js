/* Gemeinsame Bausteine aller Seiten · Stand 28.10.2026 abends
   Kopf und Fuß (eine Quelle für alle Seiten), Handy-Menü, Kundenansicht/Entwurf,
   Erscheinen beim Scrollen, Zähler, Wechsler, Personen-Bühne. Alte Fassung: seite_2026-10-28_vor-umbau.js */
(function(){
  var H=document.documentElement;
  H.classList.add('js');
  if(!H.dataset.r||H.dataset.r==='A'||H.dataset.r==='C')H.dataset.r='B';
  if(/[?&]entwurf/.test(location.search))H.classList.add('entwurf');
  var v=(location.search.match(/[?&]v=(\d)/)||[])[1];H.dataset.v=v||H.dataset.v||'1';
  var hier=(location.pathname.split('/').pop()||'start.html');
  var zusatz=location.search;
  var WELT={'welt-gruen.html':'gruen','welt-blau.html':'blau','kinder.html':'gold'};if(WELT[hier])H.dataset.welt=WELT[hier];H.dataset.seite=hier.replace('.html','');   /* 10.11.2026: Kopfleiste hat je Seite eine feste Farbe */
  var tc=document.createElement('meta');tc.name='theme-color';tc.content=H.dataset.welt==='gruen'?'#143426':H.dataset.welt==='gold'?'#F6CF5A':hier==='firestarter.html'?'#E06400':'#102444';document.head.appendChild(tc);

  /* ---------- Kopf und Fuß ---------- */
  /* Simon 29.10. (Gesprächsrunde Punkt 3+4): Firestarter-App zuerst, Goldene Welt heißt Sternstunde,
     „Über uns“ klappt an der Institutszeile aus und steht im Fuß */
  var MENUE=[['firestarter.html','Firestarter-App'],['welt-gruen.html','<span class="rf">R&amp;F</span> Akademie'],['welt-blau.html','<span class="rf">R&amp;F</span> Institut'],['preise.html','Preise &amp; Geschenke'],['kinder.html','Sternstunde'],['kontakt.html','Kontakt mit den Gründern']];
  function link(h){return h+zusatz;}
  var WER_SATZ='Wer wir sind, ist eigentlich nicht das Wichtigste. Wichtig ist, welches Problem wir für dich lösen.';
  /* Vorschau beim Überfahren der Kopfleiste (Simon 01.11.2026): Bild je Menüpunkt, Stile in effekte.css und sternstunde/rahmen.css */
  var FL='<svg viewBox="0 0 62 76" aria-hidden="true"><path d="M31 4 C40 16 50 24 50 42 C50 56 41 66 31 66 C21 66 12 56 12 42 C12 30 19 25 22 18 C23 26 27 28 29 25 C27 18 28 10 31 4 Z" fill="#FF7A00"/><path d="M31 30 C36 36 40 40 40 49 C40 56 36 60 31 60 C26 60 22 56 22 49 C22 43 26 40 27 36 C28 40 30 41 31 39 C30 36 30 33 31 30 Z" fill="#FFD9A8"/></svg>';
  /* Simon 07.11.2026: Leuchtturm (Akademie) und Hochhaus (Institut) statt R und F, dieselben Bauwerke wie auf der Preisseite */
  var HH='<svg viewBox="0 0 48 48" aria-hidden="true">'+'<g class="vs-wolke" fill="#C9D6E6"><ellipse cx="8" cy="12" rx="7" ry="3.2"/><ellipse cx="12" cy="10" rx="4.5" ry="3"/></g><g class="vs-wolke w2" fill="#DDE6F0"><ellipse cx="6" cy="24" rx="5.5" ry="2.4"/><ellipse cx="9" cy="22.6" rx="3.4" ry="2.2"/></g>'+'<rect x="17" y="6" width="14" height="39" fill="#6F8AA8"/><rect x="17" y="6" width="5" height="39" fill="#8FA6C0"/>'+'<path d="M17 12h14M17 16.5h14M17 21h14M17 25.5h14M17 30h14M17 34.5h14M17 39h14M20.5 8v37M24 8v37M27.5 8v37" stroke="#DDE6F0" stroke-width=".6" opacity=".75"/>'+'<rect x="18.5" y="3" width="11" height="3.2" fill="#C6CBD1"/><rect x="18.5" y="2.4" width="11" height="0.9" fill="#FFE2B0"/>'+'<rect x="6" y="44.6" width="36" height="3.4" rx=".6" fill="#B9B2A3"/><rect x="6" y="44.6" width="36" height="1" fill="#D9D4CA"/></svg>';
  var LT='<svg viewBox="0 0 48 48" aria-hidden="true">'+'<circle cx="24" cy="11.6" r="7" fill="#FFF3B8" class="vs-blitz"/><g class="vs-dreh"><path d="M24 11.6 L47 7.8 L47 15.4 Z" fill="#F2B705" opacity=".9"/><path d="M24 11.6 L1 7.8 L1 15.4 Z" fill="#F2B705" opacity=".9"/></g>'+'<path d="M16 43 L19.6 17 L28.4 17 L32 43 Z" fill="#B8322A"/>'+'<path d="M18.2 27.5 L29.8 27.5 L30.6 33.5 L17.4 33.5 Z" fill="#F2EFE8"/><path d="M19.2 20.5 L28.8 20.5 L29.3 24.5 L18.7 24.5 Z" fill="#F2EFE8"/><path d="M17 37 L31 37 L31.6 40.5 L16.4 40.5 Z" fill="#F2EFE8"/>'+'<rect x="17" y="14.6" width="14" height="2.6" fill="#2B2F36"/><rect x="20.2" y="8.6" width="7.6" height="6" fill="#FFE38A"/>'+'<path d="M19.2 8.6 Q24 2 28.8 8.6 Z" fill="#B8322A"/>'+'<g class="vs-welle"><path d="M5 45 Q8 39.5 11 44 Q15 33.8 20 43.6 Q23 41.8 26 44.2 Q30 37.5 34 43.8 Q37 42.6 39.5 44 Q41.5 40.5 43 45 L43 48 L5 48 Z" fill="#8FB0E3"/></g><g class="vs-welle w2"><path d="M7 46 Q10 41.5 13 45.5 Q17 43.5 21 45.8 Q25 40 29 45.2 Q32 44 35 45.6 Q38 42.5 41 46 L41 48 L7 48 Z" fill="#5E8ACB"/></g></svg>';
  var VS={'firestarter.html':'<span class="vs vs-flamme" aria-hidden="true">'+FL+'</span>','welt-gruen.html':'<span class="vs vs-bau vs-akademie" aria-hidden="true">'+LT+'</span>',
    'welt-blau.html':'<span class="vs vs-bau vs-institut" aria-hidden="true">'+HH+'</span>',
    'start.html':'<span class="vs" aria-hidden="true"><svg viewBox="0 0 48 48" aria-hidden="true"><path d="M13 22 V41 H35 V22" fill="#F2EFE8" stroke="#102444" stroke-width="2.4" stroke-linejoin="round"/><path d="M7 24 L24 9 L41 24" fill="none" stroke="#102444" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><rect x="20.5" y="29" width="7" height="12" rx="1" fill="#FF7A00"/></svg></span>','preise.html':'<span class="vs" aria-hidden="true"><svg viewBox="0 0 48 48" aria-hidden="true"><rect x="9" y="21" width="30" height="20" rx="2" fill="#F6CF5A"/><rect x="21.5" y="21" width="5" height="20" fill="#C8102E"/><g class="vs-glanz"><circle cx="24" cy="19" r="7" fill="#FFF3B8" opacity=".9"/><path d="M24 9v-4M31 12l3-3M17 12l-3-3" stroke="#F6CF5A" stroke-width="1.8" stroke-linecap="round"/></g><g class="vs-deckel"><rect x="7" y="15" width="34" height="8" rx="2" fill="#E9B824"/><rect x="21.5" y="15" width="5" height="8" fill="#C8102E"/><path class="vs-schleife" d="M24 15 C19 6 10 8 15 15 Z M24 15 C29 6 38 8 33 15 Z" fill="#C8102E"/></g></svg></span>','kontakt.html':'<span class="vs" aria-hidden="true"><svg viewBox="0 0 48 48" aria-hidden="true"><path class="vs-ring" d="M8 14 Q4 24 8 34 M40 14 Q44 24 40 34" fill="none" stroke="#FF7A00" stroke-width="2" stroke-linecap="round"/><path class="vs-ring r2" d="M4 10 Q-1 24 4 38 M44 10 Q49 24 44 38" fill="none" stroke="#FF7A00" stroke-width="1.6" stroke-linecap="round" opacity=".7"/><g class="vs-handy"><rect x="13" y="4" width="22" height="40" rx="4.5" fill="#102444"/><rect x="15.5" y="9" width="17" height="28" rx="1.5" fill="#BFD8E4"/><circle cx="24" cy="40.5" r="1.6" fill="#BFD8E4"/><text x="24" y="28" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" font-size="14" fill="#102444">@</text></g></svg></span>','kinder.html':'<span class="vs vs-stern" aria-hidden="true"><svg viewBox="0 0 48 48" aria-hidden="true"><defs><radialGradient id="vs-himmel"><stop offset="0" stop-color="#0B1A38"/><stop offset=".4" stop-color="#0B1A38" stop-opacity=".92"/><stop offset=".62" stop-color="#0B1A38" stop-opacity=".35"/><stop offset="1" stop-color="#0B1A38" stop-opacity="0"/></radialGradient></defs><ellipse cx="24.3" cy="24" rx="51.3" ry="41.8" fill="url(#vs-himmel)"/><g fill="#FFF3C4" class="vs-sterne"><circle cx="5" cy="13" r=".9"/><circle cx="42" cy="10" r=".8"/><circle cx="44" cy="33" r=".9"/><circle cx="6" cy="34" r=".7"/><circle cx="24" cy="3" r=".7"/><circle cx="14" cy="43" r=".6"/><circle cx="35" cy="43" r=".6"/></g><g class="vs-st"><path d="M24 8l4.6 9.8 10.8 1.3-8 7.4 2.2 10.6L24 31.8l-9.6 5.3 2.2-10.6-8-7.4 10.8-1.3z" fill="#F6CF5A" stroke="#FFF3C4" stroke-width="1.5" stroke-linejoin="round"/></g></svg></span>'};
  /* Simon 06.11.2026: in den Welten steht der ganze Name unter R&F, sonst nur R&F */
  var WELTNAME={'welt-gruen.html':'Akademie für<br>Finanzkompetenz','welt-blau.html':'Institut für<br>Vermögenskompetenz'};   /* 11.11.2026: Wortmarke wie das Logo, sonst „R&F | Institut“ */
  var kopf=document.getElementById('kopf');
  if(kopf){
    kopf.outerHTML='<header class="leiste"><div class="marke-wrap"><a class="marke" href="'+link('start.html')+'" aria-label="R&amp;F, Startseite"><b>R&amp;F</b>'+(WELTNAME[hier]?'<small class="marke-mehr">'+WELTNAME[hier]+'</small>':'<small class="marke-mehr eins">'+({'firestarter.html':'Firestarter','kinder.html':'Sternstunde'}[hier]||'Institut')+'</small>')+'</a>'+
      '<div class="wer-fenster" id="wer-fenster" hidden></div></div>'+
      '<nav class="menue" aria-label="Hauptmenü">'+MENUE.map(function(m){return '<a href="'+link(m[0])+'"'+(m[0]===hier?' aria-current="page"':'')+'>'+m[1]+(VS[m[0]]||'')+'</a>'}).join('')+'</nav>'+
      '<a class="knopf" href="'+link('preise.html')+'">Termine</a><button class="burger" type="button" aria-label="Menü öffnen" aria-expanded="false"><i></i></button></header>';
  }
  var fuss=document.getElementById('fuss');
  if(fuss){
    fuss.outerHTML='<footer class="fuss"><div class="gross" aria-label="R&amp;F"><b>R&amp;F</b></div><div class="fuss-spalten">'+
      '<div><b>R&amp;F Akademie</b><a href="'+link('welt-gruen.html')+'#erster-tag">Dein erster Tag</a><a href="'+link('welt-gruen.html')+'#investmenttag">Investmenttag</a><a href="'+link('welt-gruen.html')+'#boersentag">Börsentag</a></div>'+
      '<div><b>R&amp;F Institut</b><a href="'+link('welt-blau.html')+'#investment">Investment Zirkel</a><a href="'+link('welt-blau.html')+'#rainmaker">Rainmaker Zirkel</a><a href="'+link('welt-blau.html')+'#mentoring">Mentoring</a><a href="'+link('start.html')+'#webinar">Webinar</a></div>'+
      '<div><b>Mehr</b><a href="'+link('kinder.html')+'">Sternstunde</a><a href="'+link('firestarter.html')+'">Firestarter-App</a><a href="'+link('kontakt.html')+'">Wer wir sind</a><a href="'+link('preise.html')+'">Preise</a><a href="'+link('kontakt.html')+'">Kontakt</a></div>'+
      '<div><b>Rechtliches</b><a href="'+link('recht.html')+'#impressum">Impressum</a><a href="'+link('recht.html')+'#datenschutz">Datenschutz</a><a href="'+link('recht.html')+'#agb">AGB</a></div></div>'+
      '<div class="fuss-unten"><span class="mono">R&amp;F · Frankfurt am Main</span><span>Bildung, keine Anlageberatung · info@rf-institut.de</span></div></footer>';
  }
  /* Interne Links tragen ?entwurf / ?v weiter */
  if(zusatz)document.querySelectorAll('main a[href$=".html"],main a[href*=".html#"]').forEach(function(a){var h=a.getAttribute('href');if(/^https?:/.test(h)||h.indexOf('?')>=0)return;var t=h.split('#');a.setAttribute('href',t[0]+zusatz+(t[1]?'#'+t[1]:''));});

  /* ---------- Handy-Menü ---------- */
  var burger=document.querySelector('.burger'),menue=document.querySelector('.menue');
  if(burger&&menue){
    var deckel=document.createElement('div');deckel.className='deckel';deckel.setAttribute('role','dialog');deckel.setAttribute('aria-modal','true');deckel.setAttribute('aria-label','Menü');
    deckel.innerHTML='<button class="zu" type="button" aria-label="Menü schließen">×</button><nav class="deckel-nav"><a href="'+link('start.html')+'">Start</a>'+menue.innerHTML+'</nav>';
    /* Zeichen je Welt im Handy-Menü (Gesprächsrunde Punkt 4, Variante A) */
    var KUGEL=function(meer,land){return '<svg viewBox="0 0 28 28" aria-hidden="true"><circle cx="14" cy="14" r="12.5" fill="'+meer+'"/><path d="M10 5.5c2.6-.9 5.6-.4 6.6 1.6.9 1.8-1.3 2.6.4 4.6 1.6 1.9 3.6 3.2 2.3 6.2-1.2 2.8-3.8 4.4-5.1 2.4-1-1.6-.4-3.6-2.2-4.6-1.9-1-4.2-1.2-4.3-3.9-.1-2.6.6-5.4 2.3-6.3z" fill="'+land+'"/><circle cx="14" cy="14" r="12.5" fill="none" stroke="rgba(16,36,68,.25)"/></svg>';};
    var ZEICHEN={'firestarter.html':'<svg viewBox="0 0 62 76" aria-hidden="true"><path d="M31 4 C40 16 50 24 50 42 C50 56 41 66 31 66 C21 66 12 56 12 42 C12 30 19 25 22 18 C23 26 27 28 29 25 C27 18 28 10 31 4 Z" fill="#FF7A00"/></svg>',
      'welt-gruen.html':KUGEL('#BFD8E4','#4C8A3E'),'welt-blau.html':KUGEL('#1F5C8F','#6E9466'),
      'kinder.html':'<svg viewBox="0 0 50 50" aria-hidden="true"><path d="M25 3 L30.5 18.5 L47 19 L34 29 L38.5 45 L25 35.5 L11.5 45 L16 29 L3 19 L19.5 18.5 Z" fill="#D9A21E"/></svg>'};
    deckel.querySelectorAll('.deckel-nav a > .vs').forEach(function(v){v.remove();});
    deckel.querySelectorAll('.deckel-nav a').forEach(function(a){var h=(a.getAttribute('href')||'').split(/[?#]/)[0];a.insertAdjacentHTML('afterbegin','<span class="ic">'+(VS[h]||ZEICHEN[h]||'').replace(/vs-himmel/g,'vs-himmel-d')+'</span>'   /* eigener Verlaufsname: der Verlauf im ausgeblendeten Kopfmenü würde am Handy nicht zeichnen */);});
    deckel.querySelectorAll('.deckel-nav > a').forEach(function(a){var ic=a.querySelector('.ic'),z=document.createElement('span');z.className='zt';[].slice.call(a.childNodes).forEach(function(n){if(n!==ic)z.appendChild(n);});a.appendChild(z);a.dataset.ziel=(a.getAttribute('href')||'').split(/[?#]/)[0].replace('.html','');});   /* 11.11.2026: Zeilenfarbe je Welt */
    /* Simon 12.11.2026, Menü Mockup 2n: Welten als Wortmarke „R&F | Name“, übrige Zeilen mit festem Text */
    var MZ={'start':'Start','firestarter':'@Firestarter','welt-gruen':'@Akademie','welt-blau':'@Institut','preise':'Preise &amp; Geschenke','kinder':'@Sternstunde','kontakt':'Kontakt mit den Gründern'};
    deckel.querySelectorAll('.deckel-nav > a').forEach(function(a){var t=MZ[a.dataset.ziel],z=a.querySelector('.zt');if(!t||!z)return;z.innerHTML=t.charAt(0)==='@'?'<span class="lgo"><b>R&amp;F</b><i></i><small>'+t.slice(1)+'</small></span>':t;});
    deckel.querySelector('.deckel-nav').insertAdjacentHTML('beforeend','<div class="deckel-wer"><button class="deckel-wer-knopf" type="button" aria-expanded="false">Wer steckt dahinter? <span aria-hidden="true">▾</span></button>'+
      '<div class="deckel-wer-text" hidden><p>'+WER_SATZ+'</p><p><b>Willst du es trotzdem wissen?</b> <a href="'+link('kontakt.html')+'#wer'+'">Hier entlang →</a></p></div></div>');
    var dw=deckel.querySelector('.deckel-wer-knopf');dw.addEventListener('click',function(){var t=dw.nextElementSibling,o=t.hidden;t.hidden=!o;dw.setAttribute('aria-expanded',o?'true':'false');dw.querySelector('span').textContent=o?'▴':'▾';});
    document.body.appendChild(deckel);
    var auf=function(o){deckel.classList.toggle('offen',o);document.body.style.overflow=o?'hidden':'';burger.setAttribute('aria-expanded',o?'true':'false');if(o){deckel.querySelector('.zu').focus();}else{burger.focus();}};
    burger.addEventListener('click',function(){auf(true)});deckel.querySelector('.zu').addEventListener('click',function(){auf(false)});
    deckel.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){auf(false)})});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')auf(false)});
  }

  /* ---------- „Wer steckt dahinter?“ (Simon 01.11.2026, Variante C): Klick auf R&F oder die Institutszeile führt immer zur Startseite.
     Überfahren zeigt René und Simon klein mit der Frage, ein Klick darauf das Fenster mit dem Satz und dem Weg zu „Über uns“. ---------- */
  var wrap=document.querySelector('.marke-wrap'),fen=document.getElementById('wer-fenster');
  if(wrap&&fen){
    var PFX=document.querySelector('base')?'../':'',DUO=PFX+'bilder/web/duo_studio_3x2.jpg',offen=0,zuT=null;
    var schliessen=function(){fen.hidden=true;fen.innerHTML='';offen=0;};
    var pille=function(){if(offen)return;offen=1;fen.innerHTML='<button class="wer-pille" type="button"><img src="'+DUO+'" alt="">Wer steckt dahinter? <i aria-hidden="true">↓</i></button>';fen.hidden=false;};
    var fenster=function(){offen=2;fen.innerHTML='<div class="wer-karte" role="dialog" aria-label="Wer steckt dahinter?"><button class="zu" type="button" aria-label="Schließen">×</button>'+
      '<div class="kopf"><img src="'+DUO+'" alt="René Flé und Simon Schlerf"><b>René und Simon</b></div><p>'+WER_SATZ+'</p><p class="frage">Willst du es trotzdem wissen?</p>'+
      '<a href="'+PFX+link('kontakt.html')+'#wer'+'">Hier entlang zu Wer wir sind →</a></div>';fen.hidden=false;};
    if(window.matchMedia('(hover:hover) and (pointer:fine)').matches){
      wrap.addEventListener('mouseenter',function(){clearTimeout(zuT);pille();});
      wrap.addEventListener('mouseleave',function(){if(offen===2)return;zuT=setTimeout(schliessen,380);});
      wrap.querySelector('.marke').addEventListener('focus',pille);}
    fen.addEventListener('click',function(e){var t=e.target.closest('.wer-pille,.zu');if(!t)return;e.stopPropagation();if(t.classList.contains('wer-pille'))fenster();else schliessen();});
    document.addEventListener('click',function(e){if(offen&&!wrap.contains(e.target))schliessen();});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&offen)schliessen();});
  }

  /* ---------- Telefon-Rahmen: App-Ansicht (390 × 794) passend skalieren ---------- */
  document.querySelectorAll('.telefon[data-auto]').forEach(function(tel){
    var f=tel.querySelector('iframe');
    function sk(){var g=tel.querySelector('.rahmen');var w=g.clientWidth,h=g.clientHeight;if(!w||!h)return;var s=w/390;f.style.width='390px';f.style.height=(h/s)+'px';f.style.transformOrigin='0 0';f.style.transform='scale('+s+')';} /* randlos: App füllt das Handy (Simon 29.10.) */
    if('ResizeObserver' in window)new ResizeObserver(sk).observe(tel);sk();f.addEventListener('load',sk);
  });

  var still=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Erscheinen beim Scrollen ---------- */
  var AUTO='.ab-kopf,.angebot,.weltkarte,.saeule,.zitat,.raum-raster figure,.stimme,.zahlen>div,.klein-karte,.fehler>div,.stufe,.raeume>div,.teaser .zoom,.teaser .text,.raum-fakten>div,.fakten-gold span,.gruender .text,.app-hinweis';
  document.querySelectorAll(AUTO).forEach(function(el){if(el.closest('.ps-buehne'))return;el.classList.add('auf');var g=[].slice.call(el.parentNode.children).filter(function(x){return x.matches(AUTO)});el.style.setProperty('--i',Math.min(g.indexOf(el),5));});
  var auftritte=document.querySelectorAll('.auf');
  if(still||!('IntersectionObserver' in window)){auftritte.forEach(function(e){e.classList.add('sicht')});}
  else{var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('sicht');io.unobserve(e.target);}})},{rootMargin:'0px 0px -8% 0px',threshold:.12});auftritte.forEach(function(e){io.observe(e)});}

  /* ---------- Zähler ---------- */
  document.querySelectorAll('[data-zahl]').forEach(function(el){
    var ziel=parseFloat(el.dataset.zahl),nk=(el.dataset.zahl.split('.')[1]||'').length,vor=el.dataset.vor||'',nach=el.dataset.nach||'';
    function fmt(x){return vor+x.toLocaleString('de-DE',{minimumFractionDigits:nk,maximumFractionDigits:nk})+nach;}
    if(still||!('IntersectionObserver' in window)){el.textContent=fmt(ziel);return;}
    el.textContent=fmt(0);
    var o=new IntersectionObserver(function(es){if(!es[0].isIntersecting)return;o.disconnect();var t0=performance.now(),D=1600;(function lauf(t){var p=Math.min(1,(t-t0)/D);p=1-Math.pow(1-p,3);el.textContent=fmt(ziel*p);if(p<1)requestAnimationFrame(lauf);})(t0);},{threshold:.6});o.observe(el);
  });

  /* ---------- Wechsler: Bild folgt der Scroll-Position, in beide Richtungen ----------
     Aktiv ist der letzte Schritt, dessen Oberkante die Bildschirmmitte überschritten hat; davor immer Schritt 1. */
  var wechsler=[].slice.call(document.querySelectorAll('.wechsler')).map(function(w){
    var bilder=[].slice.call(w.querySelectorAll('.w-bilder img')),titel=w.querySelector('.w-titel'),schritte=[].slice.call(w.querySelectorAll('.w-schritt')),akt=-1;
    function setze(i){if(i===akt)return;akt=i;bilder.forEach(function(b,j){b.classList.toggle('an',j===i)});schritte.forEach(function(s,j){s.classList.toggle('an',j===i)});if(titel)titel.textContent=schritte[i].dataset.titel||'';}
    function lies(){var mitte=innerHeight*0.55,i=0;schritte.forEach(function(s,j){if(s.getBoundingClientRect().top<mitte)i=j;});setze(Math.min(i,bilder.length-1));}
    setze(0);return lies;
  });

  /* ---------- Kopf: weiße Schrift über dunklen Flächen ---------- */
  var leiste=document.querySelector('.leiste'),dunkle=[].slice.call(document.querySelectorAll('.einstieg,.welt-held,.kontakt-teaser,.w-bilder'));
  function kopfFarbe(){if(!leiste)return;var y=leiste.getBoundingClientRect().height/2,x=innerWidth/2,d=false;dunkle.forEach(function(el){var r=el.getBoundingClientRect();if(r.top<=y&&r.bottom>=y&&r.left<=x&&r.right>=x)d=true;});leiste.classList.toggle('dunkel',d);}

  /* ---------- Scroll-gesteuerte Werte: Zoom im Seitenkopf, Personen-Bühne ---------- */
  var held=document.querySelector('.welt-held,.einstieg'),szenen=[].slice.call(document.querySelectorAll('.person-szene'));
  szenen.forEach(function(s){var sz=[].slice.call(s.querySelectorAll('.satz'));s._saetze=sz;});
  function lies(){
    if(held&&!still){var r=held.getBoundingClientRect();held.style.setProperty('--sp',Math.min(1,Math.max(0,-r.top/Math.max(1,r.height))).toFixed(3));}
    szenen.forEach(function(s){
      var r=s.getBoundingClientRect(),lang=s.offsetHeight-innerHeight,p=Math.min(1,Math.max(0,-r.top/Math.max(1,lang)));
      var rein=Math.min(1,Math.max(0,(innerHeight-r.top)/innerHeight));
      var auftritt=still?1:Math.min(1,rein*1.4);
      var fokus=still?1:Math.min(1,Math.max(0,rein*1.6-.4))*(p>.92?Math.max(0,1-(p-.92)/.08):1);
      s.style.setProperty('--auftritt',auftritt.toFixed(3));s.style.setProperty('--fokus',fokus.toFixed(3));s.style.setProperty('--blase',Math.min(1,Math.max(0,rein*2-1)).toFixed(3));
      var n=s._saetze.length,zeigen=Math.max(rein>.75?1:0,Math.ceil(p*n*1.15));
      s._saetze.forEach(function(el,k){el.classList.toggle('da',k<zeigen)});
    });
  }
  function alles(){lies();wechsler.forEach(function(f){f()});kopfFarbe();}
  var tick=false;window.addEventListener('scroll',function(){if(tick)return;tick=true;requestAnimationFrame(function(){alles();tick=false;})},{passive:true});window.addEventListener('resize',alles);alles();
})();
