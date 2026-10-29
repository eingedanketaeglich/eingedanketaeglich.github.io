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
  var MENUE=[['welt-gruen.html','Grüne Welt'],['welt-blau.html','Blaue Welt'],['kinder.html','Goldene Welt'],['firestarter.html','Firestarter-App'],['ueber-uns.html','Über uns'],['preise.html','Preise'],['kontakt.html','Kontakt']];
  function link(h){return h+zusatz;}
  var kopf=document.getElementById('kopf');
  if(kopf){
    kopf.outerHTML='<header class="leiste"><a class="marke" href="'+link('start.html')+'" aria-label="R&amp;F Institut für Vermögensbildung, Startseite"><b>R&amp;F</b><span>Institut für Vermögensbildung</span></a>'+
      '<nav class="menue" aria-label="Hauptmenü">'+MENUE.map(function(m){return '<a href="'+link(m[0])+'"'+(m[0]===hier?' aria-current="page"':'')+'>'+m[1]+'</a>'}).join('')+'</nav>'+
      '<a class="knopf" href="'+link('preise.html')+'">Termine &amp; Preise</a><button class="burger" type="button" aria-label="Menü öffnen" aria-expanded="false"><i></i></button></header>';
  }
  var fuss=document.getElementById('fuss');
  if(fuss){
    fuss.outerHTML='<footer class="fuss"><div class="gross" aria-label="R&amp;F"><b>R&amp;F</b></div><div class="fuss-spalten">'+
      '<div><b>Grüne Welt</b><a href="'+link('welt-gruen.html')+'#geldtag">Geldtag</a><a href="'+link('welt-gruen.html')+'#wochenende">Wissenswochenende</a></div>'+
      '<div><b>Blaue Welt</b><a href="'+link('welt-blau.html')+'#grundlagen">Grundlagen-Tag</a><a href="'+link('welt-blau.html')+'#zirkel">Investment-Zirkel</a><a href="'+link('welt-blau.html')+'#zirkel">RainMaker-Zirkel</a><a href="'+link('welt-blau.html')+'#mentoring">Mentoring</a><a href="'+link('start.html')+'#webinar">Webinar</a></div>'+
      '<div><b>Mehr</b><a href="'+link('kinder.html')+'">Goldene Welt</a><a href="'+link('firestarter.html')+'">Firestarter-App</a><a href="'+link('ueber-uns.html')+'">Über uns</a><a href="'+link('preise.html')+'">Preise</a><a href="'+link('kontakt.html')+'">Kontakt</a></div>'+
      '<div><b>Rechtliches</b><a href="'+link('recht.html')+'#impressum">Impressum</a><a href="'+link('recht.html')+'#datenschutz">Datenschutz</a><a href="'+link('recht.html')+'#agb">AGB</a></div></div>'+
      '<div class="fuss-unten"><span class="mono">R&amp;F · Institut für Vermögensbildung · Frankfurt am Main</span><span>Bildung, keine Anlageberatung · info@rf-institut.de</span></div></footer>';
  }
  /* Interne Links tragen ?entwurf / ?v weiter */
  if(zusatz)document.querySelectorAll('main a[href$=".html"],main a[href*=".html#"]').forEach(function(a){var h=a.getAttribute('href');if(/^https?:/.test(h)||h.indexOf('?')>=0)return;var t=h.split('#');a.setAttribute('href',t[0]+zusatz+(t[1]?'#'+t[1]:''));});

  /* ---------- Handy-Menü ---------- */
  var burger=document.querySelector('.burger'),menue=document.querySelector('.menue');
  if(burger&&menue){
    var deckel=document.createElement('div');deckel.className='deckel';deckel.setAttribute('role','dialog');deckel.setAttribute('aria-modal','true');deckel.setAttribute('aria-label','Menü');
    deckel.innerHTML='<button class="zu" type="button" aria-label="Menü schließen">×</button><nav class="deckel-nav"><a href="'+link('start.html')+'">Start</a>'+menue.innerHTML+'</nav>';
    document.body.appendChild(deckel);
    var auf=function(o){deckel.classList.toggle('offen',o);document.body.style.overflow=o?'hidden':'';burger.setAttribute('aria-expanded',o?'true':'false');if(o){deckel.querySelector('.zu').focus();}else{burger.focus();}};
    burger.addEventListener('click',function(){auf(true)});deckel.querySelector('.zu').addEventListener('click',function(){auf(false)});
    deckel.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){auf(false)})});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')auf(false)});
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
