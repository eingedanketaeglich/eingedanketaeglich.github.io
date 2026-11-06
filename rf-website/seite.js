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
  var WELT={'welt-gruen.html':'gruen','welt-blau.html':'blau','kinder.html':'gold'};if(WELT[hier])H.dataset.welt=WELT[hier];
  var tc=document.createElement('meta');tc.name='theme-color';tc.content=H.dataset.welt==='gruen'?'#143426':'#0C182C';document.head.appendChild(tc);

  /* ---------- Kopf und Fuß ---------- */
  /* Simon 29.10. (Gesprächsrunde Punkt 3+4): Firestarter-App zuerst, Goldene Welt heißt Sternstunde,
     „Über uns“ klappt an der Institutszeile aus und steht im Fuß */
  var MENUE=[['firestarter.html','Firestarter-App'],['welt-gruen.html','R&amp;F Akademie'],['welt-blau.html','R&amp;F Institut'],['kinder.html','Sternstunde'],['preise.html','Preise'],['kontakt.html','Kontakt']];
  function link(h){return h+zusatz;}
  var WER_SATZ='Wer wir sind, ist eigentlich nicht das Wichtigste. Wichtig ist, welches Problem wir für dich lösen.';
  /* Vorschau beim Überfahren der Kopfleiste (Simon 01.11.2026): Bild je Menüpunkt, Stile in effekte.css und sternstunde/rahmen.css */
  var FL='<svg viewBox="0 0 62 76" aria-hidden="true"><path d="M31 4 C40 16 50 24 50 42 C50 56 41 66 31 66 C21 66 12 56 12 42 C12 30 19 25 22 18 C23 26 27 28 29 25 C27 18 28 10 31 4 Z" fill="#FF7A00"/><path d="M31 30 C36 36 40 40 40 49 C40 56 36 60 31 60 C26 60 22 56 22 49 C22 43 26 40 27 36 C28 40 30 41 31 39 C30 36 30 33 31 30 Z" fill="#FFD9A8"/></svg>';
  var VS={'firestarter.html':'<span class="vs vs-flamme" aria-hidden="true">'+FL+'</span>','welt-gruen.html':'<span class="vs vs-zeichen vs-akademie" aria-hidden="true"></span>',
    'welt-blau.html':'<span class="vs vs-zeichen vs-institut" aria-hidden="true"></span>',
    'kinder.html':'<span class="vs vs-stern" aria-hidden="true"><svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 3l6.2 13.2 14.5 1.7-10.7 9.9 2.9 14.3L24 34.9 11.1 42.1 14 27.8 3.3 17.9l14.5-1.7z" fill="#F6CF5A" stroke="#FFF3C4" stroke-width="2" stroke-linejoin="round"/></svg></span>'};
  /* Simon 06.11.2026: in den Welten steht der ganze Name unter R&F, sonst nur R&F */
  var WELTNAME={'welt-gruen.html':'Akademie für Finanzkompetenz','welt-blau.html':'Institut für Vermögenskompetenz'};
  var kopf=document.getElementById('kopf');
  if(kopf){
    kopf.outerHTML='<header class="leiste"><div class="marke-wrap"><a class="marke" href="'+link('start.html')+'" aria-label="R&amp;F, Startseite"><b>R&amp;F</b>'+(WELTNAME[hier]?'<small class="marke-mehr">'+WELTNAME[hier]+'</small>':'')+'</a>'+
      '<div class="wer-fenster" id="wer-fenster" hidden></div></div>'+
      '<nav class="menue" aria-label="Hauptmenü">'+MENUE.map(function(m){return '<a href="'+link(m[0])+'"'+(m[0]===hier?' aria-current="page"':'')+'>'+m[1]+(VS[m[0]]||'')+'</a>'}).join('')+'</nav>'+
      '<a class="knopf" href="'+link('preise.html')+'">Termine &amp; Preise</a><button class="burger" type="button" aria-label="Menü öffnen" aria-expanded="false"><i></i></button></header>';
  }
  var fuss=document.getElementById('fuss');
  if(fuss){
    fuss.outerHTML='<footer class="fuss"><div class="gross" aria-label="R&amp;F"><b>R&amp;F</b></div><div class="fuss-spalten">'+
      '<div><b>R&amp;F Akademie</b><a href="'+link('welt-gruen.html')+'#erster-tag">Dein erster Tag</a><a href="'+link('welt-gruen.html')+'#investmenttag">Investmenttag</a><a href="'+link('welt-gruen.html')+'#boersentag">Börsentag</a></div>'+
      '<div><b>R&amp;F Institut</b><a href="'+link('welt-blau.html')+'#investment">Investment Zirkel</a><a href="'+link('welt-blau.html')+'#rainmaker">Rainmaker Zirkel</a><a href="'+link('welt-blau.html')+'#mentoring">Mentoring</a><a href="'+link('start.html')+'#webinar">Webinar</a></div>'+
      '<div><b>Mehr</b><a href="'+link('kinder.html')+'">Sternstunde</a><a href="'+link('firestarter.html')+'">Firestarter-App</a><a href="'+link('ueber-uns.html')+'">Über uns</a><a href="'+link('preise.html')+'">Preise</a><a href="'+link('kontakt.html')+'">Kontakt</a></div>'+
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
    deckel.querySelectorAll('.deckel-nav a').forEach(function(a){var h=(a.getAttribute('href')||'').split(/[?#]/)[0];a.insertAdjacentHTML('afterbegin','<span class="ic">'+(VS[h]||ZEICHEN[h]||'')+'</span>');});
    deckel.querySelector('.deckel-nav').insertAdjacentHTML('beforeend','<div class="deckel-wer"><button class="deckel-wer-knopf" type="button" aria-expanded="false">Wer steckt dahinter? <span aria-hidden="true">▾</span></button>'+
      '<div class="deckel-wer-text" hidden><p>'+WER_SATZ+'</p><p><b>Willst du es trotzdem wissen?</b> <a href="'+link('ueber-uns.html')+'">Hier entlang →</a></p></div></div>');
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
      '<a href="'+PFX+link('ueber-uns.html')+'">Hier entlang zu Über uns →</a></div>';fen.hidden=false;};
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
