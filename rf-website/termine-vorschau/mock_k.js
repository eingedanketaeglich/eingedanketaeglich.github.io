/* Runde 128 (Simons Diktat 14.11.2026): Mockup 2 „Termine als Deutschlandkarte“. Nur Mockup, nicht live.
   Tipp auf „Termine“ oben: statt Leuchtturm und Hochhaus erscheint eine Deutschlandkarte mit den Städten.
   Tipp auf eine Stadt: Fenster mit je einem nächsten Termin pro Kurs, „Noch einen Termin“ zeigt den nächsten.
   ?m=v1&k=1  Bild an der Stadt (Medaillon direkt am Ort)
   ?m=v1&k=2  Bilder am Rand (oben, unten, links, rechts), feine Linie zum Ort
   ?m=v1&k=3  Karte nur mit Punkten, Städte als Leiste darunter (Handy) bzw. daneben (Mac)
   ?m=v1&k=4  Runde 129 (Simon: „Mac gut, warum am Handy nicht in der Karte?“ + „zeig mir, was du meinst“): Bild am Ort wie Karte 1,
              dazu am Handy die Städte als Leiste darunter, damit jede Stadt ein großes, sicheres Tippziel hat
   &t=1       öffnet direkt in der Termin-Ansicht (Simon: eigene Seite zum Verlinken, termine.html)
   Runde 129 (Simons Antworten): sechste Stadt Hamburg (startet bald); Termin = Datum + Uhrzeit, live vor Ort und am selben Tag
   auch live online (online ohne Teilnehmerzahl); die Adresse steht einmal je Stadt oben im Fenster; Tipp auf einen Termin öffnet
   später einen Stripe-Link (Simon hinterlegt ihn); Karte blendet beim Öffnen einmal sanft ein, sonst ruhig.
   Umriss: Natural Earth 1:10 Mio. (gemeinfrei), eigene Projektion, siehe _arbeit/r128_karte. Symbole: eigene Strichzeichnungen.
   PLATZHALTER: Termine („TT.MM.JJJJ“) und die sechste Stadt; die fünf Kurse sind meine Annahme (Tagesangebote der Preisseite). */
(function(){
var Q=new URLSearchParams(location.search),K=Q.get('k')||'';if(!/^[1-6]$/.test(K))return;
/* Runde 137 (Simon: „B + Platte“): ?k=6 = Karte 5 mit der realistischen Higgsfield-Karte B als Grund, Frankfurt auf runder Platte,
   kein grünes/blaues Umland und kein Umschalter auf der Karte – Grün/Blau erst im Fenster. Andere Städte: Platzhalter bis zur Erzeugung. */
var K6=K==='6',K5=K5||K6;
/* Runde 145 (Simons Skizze 14.11.2026, 23:05): f=1 = Hamburg, Berlin, Frankfurt, München auf seine gelben Kreise (bewusst nicht maßstabsgetreu, für ein ruhigeres Gleichgewicht)
   und sechs Fotofelder um Deutschland mit der Location von außen (Contora-Bilder). Felder und Kreise in Karteneinheiten (600 × 746), umgerechnet aus seiner Handy-Skizze. */
var F6=K6&&Q.get('f')==='1';
/* Runde 155 (Simon: „ein Mockup ohne die Deutschlandkarte, nur mit den Bildern“): f=2 = sechs Standortbilder als Raster, Tipp öffnet die Stadt */
var F7=K6&&Q.get('f')==='2';
var POS6={'Hamburg':[288.9,217.0],'Berlin':[435.0,274.3],'Frankfurt':[286.4,434.5],'München':[399.4,614.3]};
/* Runde 146 (Simon 23:35: „falsch verstanden“): Die sechs Bilder sind der HINTERGRUND um Deutschland, geteilt durch seine Striche; Deutschland liegt als
   ausgeschnittene Form obendrauf. Je Feld: Stadt, Bild, Feld x0,x1,y0,y1 in Karteneinheiten, Bereich, in dem das Bild ganz erkennbar sein soll (fx0,fx1),
   Ausrichtung im Bild (ax,ay), Ecke für die Beschriftung, Location laut Simons Liste 23:35. */
var FOTO6=[['Hamburg','hamburg',-1e4,308.2,-1e4,166.7,-1e4,1e4,.5,.42,'lo','Alter Wall'],['Berlin','berlin',308.2,1e4,-1e4,152.2,-1e4,1e4,.5,.3,'ro','Upper West'],
  ['Düsseldorf','duesseldorf',-1e4,300,166.7,608.7,-1e4,112,.12,.5,'lo','Kö-Quartier'],['Frankfurt','frankfurt',300,1e4,152.2,583.3,485,1e4,.92,.5,'ru','WINX Tower'],
  ['Stuttgart','stuttgart',-1e4,340.8,608.7,1e4,-1e4,1e4,.5,.45,'lu','Kronprinzenpalais'],['München','muenchen',340.8,1e4,583.3,1e4,-1e4,1e4,.5,.62,'ru','Palais an der Oper']],FELD6=[],RAND6=null;
var DOC=document.documentElement;DOC.dataset.karte=K;
var ICON={
 'Berlin':'<path d="M6 34H34M8 34V19M13 34V19M18 34V19M22 34V19M27 34V19M32 34V19M6 19H34M8 19V15H32V19M17 15V11H23V15"/>',
 'Düsseldorf':'<path d="M20 3V35M16.5 13H23.5L22 17H18ZM18 24H22M4 36C11 29 29 29 36 36"/>',
 'Frankfurt':'<path d="M4 36H36M6 36V23H11V36M12 36V13H17V36M18 36V7L21 5 24 7V36M25 36V16H30V36M31 36V25H35V36"/>',
 'München':'<path d="M5 36H35M9 36V17M17 36V17M23 36V17M31 36V17M9 17C9 11 17 11 17 17M23 17C23 11 31 11 31 17M13 12V8M27 12V8M17 27H23"/>',
 'Stuttgart':'<path d="M18 36L19 16H21L22 36M15 16H25V11H15ZM20 11V3M13 36H27"/>',
 'Hamburg':'<path d="M6 36H34M8 36V22L13 18 18 22V36M18 36V14L22 8 26 14V36M26 36V24H32V36M22 8V4M10 28H16M20 20H24"/>'};
var STAEDTE=[{n:'Berlin'},{n:'Düsseldorf'},{n:'Frankfurt'},{n:'Hamburg',bald:true},{n:'München'},{n:'Stuttgart'}];
var KURSE=[['Dein erster Tag','g'],['Investmenttag','g'],['Börsentag','g'],['Investment Zirkel','b'],['Rainmaker Zirkel','b']];
var WELT={g:'R&F Akademie',b:'R&F Institut'};
/* Lage der Bilder am Rand (Variante 2): Anteil der Kartenbreite/-höhe, außen um die Karte */
var RAND={'Berlin':[0.86,0.12],'Düsseldorf':[0.04,0.36],'Frankfurt':[0.05,0.66],'Stuttgart':[0.24,0.97],'München':[0.82,0.95],'Hamburg':[0.30,0.03]};
function el(t,c,h){var e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;}
/* Runde 129: Probe 3D-Stadtbild Frankfurt (&b=a Holzsockel, &b=b Glaskuppel); alle anderen Städte bleiben Symbol, bis die Probe entschieden ist */
var PROBE=/^[ab]$/.test(Q.get('b')||'')?Q.get('b'):'';
/* Runde 131 (Simons Notiz 14.11., 20:32): ?k=5 — Karte fest im Bild (kein Schieben, keine Leiste, keine Preisliste darunter),
   Städte stehen als 3D-Figuren auf der Karte wie Spielfiguren bei „Risiko“ (kein Kreis, kein Bildrahmen; Frankfurt ist die
   freigestellte Probe A, die anderen Städte stehen als Platzhalter-Figur, bis sie erzeugt sind). Oben der Umschalter
   „Für dein Geld“ (grün) / „Für dein Vermögen“ (blau): Er färbt das Umland der Karte und bestimmt, welche Kurse das Fenster zeigt;
   im Fenster lässt sich die Welt ebenso wechseln. Karten im Fenster wie bei Apple: Bild, Name, ein Satz „für wen“, nächster Termin,
   Preis, zwei Knöpfe. */
var WW='g',ZEIG={g:['Dein erster Tag','Investmenttag','Börsentag'],b:['Investment Zirkel','Rainmaker Zirkel']};
/* Runde 150 (Simon 14.11.2026: „bei den Kacheln fehlt jeweils immer eine“): Der Workshop ist in beiden Welten eine eigene Kachel und heißt ab jetzt
   „3 Std-Workshop“ (nicht mehr „Modul 1A“). Daten wie auf der Preise-Seite: Institut = bisher Modul 1A (299 €), Akademie = Einzelner Workshop (ab 129 €). */
if(K6){ZEIG.b.unshift('Modul 1A');}   /* Runde 174 (Simon 15.11.): In der grünen Welt steckt der Workshop jetzt oben in jeder Tageskachel, die eigene Workshop-Kachel entfällt dort (Annahme, rückholbar) */   /* Runde 152 (Simon: „Reihenfolge der Preise bei der Akademie beachten“): Kacheln nach Preis aufsteigend, Workshop (ab 129 €) zuerst */
var ANZEIGE={'Einzelner Workshop':'3 Std-Workshop','Modul 1A':'3 Std-Workshop'};
var BILD5={'Dein erster Tag':'karte_erstertag.jpg','Investmenttag':'karte_investmenttag.jpg','Börsentag':'karte_boersentag.jpg','Investment Zirkel':'karte_investment.jpg','Rainmaker Zirkel':'karte_rainmaker.jpg','Einzelner Workshop':'karte_workshop.jpg','Modul 1A':'karte_modul1a.jpg'};
/* Runde 140 (Simon: Räume 20/30/50 % größer zeigen): ?g=20|30|50 nimmt die enger geschnittenen Kartenbilder karte_<kurs>_gNN.jpg */
(function(){var g=(location.search.match(/[?&]g=(20|30|35|50)\b/)||[])[1];if(g)for(var n in BILD5)BILD5[n]=BILD5[n].replace('.jpg','_g'+g+'.jpg');})();
var FUER={g:'Für dein Geld',b:'Für dein Vermögen'};
/* Runde 139: Stadtfiguren auf runder Platte (Higgsfield, Frankfurt-Probe als Vorlage); Hamburg noch offen */
var FIG6={'Frankfurt':'figur_frankfurt_platte.png','Berlin':'figur_berlin_platte.png','Düsseldorf':'figur_duesseldorf_platte.png','München':'figur_muenchen_platte.png','Stuttgart':'figur_stuttgart_platte.png','Hamburg':'figur_hamburg_platte.png'};
function echt(s){return K6?!!FIG6[s.n]:s.n==='Frankfurt';}
function figur(s){if(K6&&s.n==='Hamburg')s.bald=false;   /* Runde 139: Simon „bei Hamburg entfernen“ → „bald“ weg (meine Lesart) */
  var inner=echt(s)?'<img src="bilder/preise/'+(K6?FIG6[s.n]+'?v=139':'figur_frankfurt.png')+'" alt="">':'<span class="mk5-platz"><svg viewBox="0 0 40 40" aria-hidden="true">'+ICON[s.n]+'</svg></span>';
  return el('button','mk5-fig'+(s.bald?' bald':'')+(echt(s)?' echt':''),'<span class="mk5-koerper">'+inner+'</span><span class="mk2-name">'+s.n+(s.bald?'<small>bald</small>':'')+'</span>');}
function med(s){if(K5)return figur(s);var bild=PROBE&&s.n==='Frankfurt'?' style="background-image:url(bilder/preise/stadt_frankfurt_'+PROBE+'.jpg)"':'';return el('button','mk2-med'+(s.bald?' bald':'')+(bild?' foto':''),'<span class="mk2-rund"'+bild+'><svg viewBox="0 0 40 40" aria-hidden="true">'+ICON[s.n]+'</svg></span><span class="mk2-name">'+s.n+(s.bald?'<small>bald</small>':'')+'</span>');}

var L=el('div','mk2');L.hidden=true;document.body.appendChild(L);
var BOX=el('div','mk2-box');L.appendChild(BOX);
var LINIEN=document.createElementNS('http://www.w3.org/2000/svg','svg');LINIEN.setAttribute('class','mk2-linien');BOX.appendChild(LINIEN);
var LEISTE=el('div','mk2-leiste');L.appendChild(LEISTE);
var KARTE=null,MED=[];
var F=el('div','mk2-blatt','<div class="mk2-streifen"><div class="mk2-griff"></div><div class="mv-logo"><b>R&amp;F</b><span class="mv-lw mk2-lw"></span></div><p class="mk2-adresse"></p></div><button class="mk2-x" aria-label="Schließen">×</button><div class="mk2-hinweis"></div><div class="mk2-liste"></div>');
document.body.appendChild(F);

fetch('karte_de.json').then(function(r){return r.json();}).then(function(d){KARTE=d;if(F6)Object.keys(POS6).forEach(function(n){d.staedte[n]=POS6[n];});
  var svg='<svg class="mk2-karte" viewBox="0 0 '+d.W+' '+d.H+'" preserveAspectRatio="xMidYMid meet" aria-label="Deutschlandkarte mit den R&amp;F-Städten">'
   +'<defs><linearGradient id="mk2-land" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#20365F"/><stop offset="1" stop-color="#132644"/></linearGradient>'
   +'<radialGradient id="mk2-licht" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="#F6CF5A" stop-opacity=".10"/><stop offset="1" stop-color="#F6CF5A" stop-opacity="0"/></radialGradient></defs>'
   +'<path d="'+d.nb+'" fill="none" stroke="rgba(255,255,255,.10)" stroke-width="1"/>'
   +'<path d="'+d.de+'" fill="url(#mk2-land)" stroke="rgba(246,207,90,.55)" stroke-width="1.4" stroke-linejoin="round"/>'
   +'<path d="'+d.de+'" fill="url(#mk2-licht)"/>'
   +Object.keys(d.staedte).map(function(n){var p=d.staedte[n];return '<circle class="mk2-punkt" data-n="'+n+'" cx="'+p[0]+'" cy="'+p[1]+'" r="5"/>';}).join('')
   +'</svg>';
  BOX.insertAdjacentHTML('afterbegin',svg);
  if(K6){BOX.insertAdjacentHTML('afterbegin','<img class="mk6-karte" src="bilder/preise/karte_de_b.jpg" alt="">');L.appendChild(el('div','mk5-kopf','<h2>Deine Termine. Deine Metropole.</h2><p class="mk6-unter">Tippe auf deine Stadt.</p>'));
    if(F7){BOX.style.display='none';var RS=el('div','mk7-raster','');
      FOTO6.forEach(function(f){var b=el('button','mk7-bild','<span><b>'+f[0]+'</b><small>'+f[11]+'</small></span>');b.style.backgroundImage='url(bilder/preise/hg_'+f[1]+'.jpg)';
        b.onclick=function(e){e.stopPropagation();var s=STAEDTE.filter(function(x){return x.n===f[0];})[0];if(s)oeffne(s);};RS.appendChild(b);});L.appendChild(RS);}
    if(F6){var im6=BOX.querySelector('.mk6-karte');if(im6)im6.remove();BOX.classList.add('mk6-durch');   /* Runde 149 (Simon: Tipp aufs Bild muss die Stadt öffnen): Kartenfläche lässt Tipps zu den Fotos durch, nur die Figuren fangen sie ab */
      BOX.insertAdjacentHTML('afterbegin','<svg class="mk6-land" viewBox="0 0 600 746" aria-hidden="true"><defs><clipPath id="mk6-de"><path d="'+d.de+'"/></clipPath></defs>'
        +'<image href="bilder/preise/karte_de_b.jpg" x="-25.42" y="-60.9" width="650.85" height="871.67" preserveAspectRatio="none" clip-path="url(#mk6-de)"/>'
        +'<path d="'+d.de+'" fill="none" stroke="rgba(255,255,255,.7)" stroke-width="1.3" stroke-linejoin="round"/></svg>');
      FOTO6.forEach(function(f){var b=el('button','mk6-feld mk6-'+f[10],'<span>'+f[0]+' · '+f[11]+'</span>');b.style.backgroundImage='url(bilder/preise/hg_'+f[1]+'.jpg)';
        var bild=new Image();bild.onload=function(){b._ar=bild.naturalWidth/bild.naturalHeight;setze();};bild.src='bilder/preise/hg_'+f[1]+'.jpg';
        b.onclick=function(e){e.stopPropagation();var s=STAEDTE.filter(function(x){return x.n===f[0];})[0];if(s)oeffne(s);};L.insertBefore(b,BOX);FELD6.push([f,b]);});RAND6=el('div','mk6-rand','');L.insertBefore(RAND6,BOX);}}
  else if(K5){var kopf=el('div','mk5-kopf','<h2>Deine Termine. Deine Metropole.</h2><div class="mv-umschalter mk5-welt"><button class="mv-seg an" data-w="g"><i></i>Für dein Geld</button><button class="mv-seg" data-w="b"><i></i>Für dein Vermögen</button></div>');
    L.insertBefore(el('div','mk5-hof mk5-hof-g'),L.firstChild);L.insertBefore(el('div','mk5-hof mk5-hof-b'),L.firstChild);L.appendChild(kopf);
    kopf.querySelectorAll('.mv-seg').forEach(function(b){b.onclick=function(e){e.stopPropagation();welt(b.dataset.w);};});}
  STAEDTE.forEach(function(s){var m=med(s);m.onclick=function(e){e.stopPropagation();oeffne(s);};MED.push([s,m]);(K==='3'?LEISTE:BOX).appendChild(m);
    if(K==='4'){var l=med(s);l.classList.add('mk2-lmed');l.onclick=m.onclick;LEISTE.appendChild(l);}});
  plane();});

function welt(w){WW=w;DOC.dataset.welt5=w;document.querySelectorAll('.mk5-welt .mv-seg,.mk5-fwelt .mv-seg').forEach(function(b){b.classList.toggle('an',b.dataset.w===w);});
  if(F.classList.contains('auf')&&AKT)oeffne(AKT);}
var AKT=null;
/* Runde 138 (Simon: „füge irgendwelche Termine hinzu, ich will sehen, wie es aussieht“): BEISPIELTERMINE, keine echten.
   Samstage ab 05.12.2026, je Stadt und Kurs um Wochen versetzt, drei Termine im Abstand von vier Wochen; Akademie 10–17 Uhr, Institut 9:30–18 Uhr. */
var STADTNR={'Berlin':0,'Düsseldorf':1,'Frankfurt':2,'Hamburg':3,'München':4,'Stuttgart':5};
var KURSNR={'Dein erster Tag':0,'Investmenttag':1,'Börsentag':2,'Investment Zirkel':0,'Rainmaker Zirkel':2,'Einzelner Workshop':3,'Modul 1A':1};
var ADRESSE={'Frankfurt':'Neue Mainzer Straße 6–10, 60311 Frankfurt am Main'};
/* Runde 174 (Simon 15.11.2026): Ganze Tage IMMER 9:30–16:30 Uhr (1 Std. Mittagspause), 3 Std-Workshops IMMER 9:30–12:30 Uhr. */
var ZEIT_TAG='9:30–16:30 Uhr',ZEIT_WS='9:30–12:30 Uhr';
function tdat(stadt,kurs,welt,n){return new Date(2026,11,5+7*((STADTNR[stadt]||0)%4+KURSNR[kurs]*2+(welt==='b'?1:0)+n*4));}
function dtext(d){var z=function(v){return (v<10?'0':'')+v;};return ['So.','Mo.','Di.','Mi.','Do.','Fr.','Sa.'][d.getDay()]+' '+z(d.getDate())+'.'+z(d.getMonth()+1)+'.'+d.getFullYear();}
function termin(stadt,kurs,welt,n,ws){return dtext(tdat(stadt,kurs,welt,n))+' · '+((ws||ANZEIGE[kurs])?ZEIT_WS:ZEIT_TAG);}
/* Stripe-Links je Kurs und Datum, z. B. STRIPE['Dein erster Tag|online|05.12.2026']='https://buy.stripe.com/…'. Leer = Hinweis „Stripe-Link folgt“. */
var STRIPE={};
var WUNSCH_AN='r.fle@rf-institut.de,s.schlerf@rf-institut.de';
/* Die sechs nächsten Termine eines Kurses aus allen Städten (ohne „startet bald“), für die Online-Teilnahme */
function naechste6(kurs,welt){var L=[];STAEDTE.forEach(function(st){if(st.bald)return;for(var n=0;n<3;n++)L.push([tdat(st.n,kurs,welt,n),st.n]);});
  L.sort(function(a,b){return a[0]-b[0];});return L.slice(0,6);}
/* ---------- Runde 177: Blatt für Termin und Wunsch ---------- */
var WUNSCH_AN='info@rf-institut.de';   /* Simon 15.11.: Empfänger info@ (er schrieb rnf-institut.de, die Domain gibt es nicht; Annahme rf-institut.de) */
var WUNSCH_ZIEL='';                    /* Formular-Empfänger (Skript auf rf-institut.de), leer = noch nicht angeschlossen */
function ortName(stadt){var f=(typeof FOTO6!=='undefined'?FOTO6:[]).filter(function(x){return x[0]===stadt;})[0];return ADRESSE[stadt]||(f?f[11]+' · '+stadt:'Location in '+stadt);}
function sparText(a){if(!a[4])return '';var o=a[4].replace(' live online',''),vo=parseInt(a[3].replace(/\D/g,''),10),on=parseInt(o.replace(/\D/g,''),10);
  return (/^ab /.test(a[3])||/^ab /.test(o)||!(vo>on))?'Live online: '+o:o+' statt '+a[3]+' · du sparst '+(vo-on)+' €';}
function stripeLink(kurs,art,d){return STRIPE[kurs+'|'+art+'|'+dtext(d).slice(4)]||'';}
function sheet(html){var alt=document.querySelector('.mv-sh-hg');if(alt)alt.remove();
  var hg=el('div','mv-sh-hg','<div class="mv-sh" role="dialog" aria-modal="true"><div class="mv-sh-kopf"><span class="mv-sh-griff"></span><button type="button" class="mv-sh-x" aria-label="Schließen">×</button></div><div class="mv-sh-in">'+html+'</div></div>');
  hg.onclick=function(e){e.stopPropagation();if(e.target===hg)hg.remove();};hg.querySelector('.mv-sh-x').onclick=function(e){e.stopPropagation();hg.remove();};
  document.body.appendChild(hg);return hg.querySelector('.mv-sh-in');}
function blattTermin(s,name,n){var a=(W[WW].a.filter(function(x){return x[0]===name;})[0])||[name,'','','',''],w=(W.g.a.filter(function(x){return x[0]==='Einzelner Workshop';})[0]),istWs=!!ANZEIGE[name],mitWs=WW==='g'&&['Dein erster Tag','Investmenttag','Börsentag'].indexOf(name)>=0;
  var d=tdat(s.n,name,WW,n),opts=[];
  if(mitWs)opts.push({art:'ws',auge:'Dein erster Schritt',t:'Nur der Vormittag',u:ZEIT_WS+' · 3 Std-Workshop',p:w[3],a:w});
  if(istWs)opts.push({art:'ws',auge:'',t:'3 Std-Workshop',u:ZEIT_WS,p:a[3],a:a});
  else opts.push({art:'tag',auge:'',t:'Der ganze Tag',u:ZEIT_TAG+' · inkl. 1 Std. Mittagspause',p:a[3],a:a});
  var aktiv=opts.length-1;
  var I=sheet('<p class="mv-sh-klein">'+(ANZEIGE[name]||name)+' · '+(WW==='g'?'R&amp;F Akademie':'R&amp;F Institut')+'</p><h3 class="mv-sh-h">'+dtext(d)+' in '+s.n+'</h3>'
    +'<div class="mv-sh-opts">'+opts.map(function(o,i){return '<button type="button" class="mv-opt'+(i===aktiv?' an':'')+'" data-i="'+i+'"><i></i><span>'+(o.auge?'<em>'+o.auge+'</em>':'')+'<b>'+o.t+'</b><small>'+o.u+'</small></span><strong>'+o.p+'</strong></button>';}).join('')+'</div>'
    +'<p class="mv-sh-ort">Location: '+ortName(s.n)+'</p>'
    +'<button type="button" class="mv-sh-knopf mv-sh-anm">Anmelden</button><p class="mv-sh-hinw" hidden>Hier öffnet sich die Anmeldung (Stripe-Link folgt)</p>'
    +'<button type="button" class="mv-sh-link mv-sh-onl"></button><div class="mv-sh-oliste" hidden></div>'
    +'<button type="button" class="mv-sh-link mv-sh-kein">Kein Termin passt?</button>');
  function zeichne(){var o=opts[aktiv];I.querySelectorAll('.mv-opt').forEach(function(b){b.classList.toggle('an',+b.dataset.i===aktiv);});
    var on=I.querySelector('.mv-sh-onl'),sp=sparText(o.a);on.hidden=!sp;on.textContent='Lieber live online? '+sp.replace('Live online: ','');
    var L=I.querySelector('.mv-sh-oliste');L.hidden=true;L.innerHTML=naechste6(name,WW).map(function(x){var h=stripeLink(name,'online-'+o.art,x[0]);
      return (h?'<a class="mv-oz" href="'+h+'">':'<button type="button" class="mv-oz">')+'<b>'+dtext(x[0])+'<span class="mv-ozp">Anmelden ›</span></b><small>'+(o.art==='ws'?ZEIT_WS:ZEIT_TAG)+' · live online · aus '+x[1]+'</small>'+(h?'</a>':'</button>');}).join('')+'<p class="mv-sh-hinw" hidden>Hier öffnet sich die Anmeldung (Stripe-Link folgt)</p>';
    L.querySelectorAll('button.mv-oz').forEach(function(b){b.onclick=function(e){e.stopPropagation();L.querySelector('.mv-sh-hinw').hidden=false;};});}
  I.querySelectorAll('.mv-opt').forEach(function(b){b.onclick=function(e){e.stopPropagation();aktiv=+b.dataset.i;zeichne();};});
  I.querySelector('.mv-sh-anm').onclick=function(e){e.stopPropagation();var h=stripeLink(name,opts[aktiv].art,d);if(h){location.href=h;return;}I.querySelector('.mv-sh-anm').nextElementSibling.hidden=false;};
  I.querySelector('.mv-sh-onl').onclick=function(e){e.stopPropagation();var L=I.querySelector('.mv-sh-oliste');L.hidden=!L.hidden;};
  I.querySelector('.mv-sh-kein').onclick=function(e){e.stopPropagation();blattWunsch(s,name);};
  zeichne();}
function blattWunsch(s,name){var kurs=ANZEIGE[name]||name;
  var chip=function(t,g){return '<button type="button" class="mv-wchip" data-g="'+g+'" aria-pressed="false">'+t+'</button>';};
  var I=sheet('<p class="mv-sh-klein">'+kurs+' · '+s.n+'</p><h3 class="mv-sh-h">Wann würde es dir passen?</h3>'
    +'<form class="mv-wf" novalidate><p class="mv-wl">Welcher Tag?</p><div class="mv-wchips">'+['Mo','Di','Mi','Do','Fr','Sa','So'].map(function(t){return chip(t,'tag');}).join('')+'</div>'
    +'<label class="mv-wl" for="mv-wdat">oder ein bestimmtes Datum (freiwillig)</label><input id="mv-wdat" type="date" class="mv-wfeld">'
    +'<p class="mv-wl">Welche Tageszeit?</p><div class="mv-wchips">'+chip('Vormittag','zeit')+chip('Nachmittag','zeit')+chip('Abend','zeit')+chip('Auch online','online')+'</div>'
    +'<label class="mv-wl" for="mv-wtext">Was noch wichtig ist (freiwillig)</label><textarea id="mv-wtext" class="mv-wfeld" rows="2" maxlength="500"></textarea>'
    +'<label class="mv-wl" for="mv-wmail">Deine E-Mail-Adresse</label><input id="mv-wmail" type="email" class="mv-wfeld" autocomplete="email" required placeholder="name@beispiel.de">'
    +'<p class="mv-wfehler" hidden></p><button type="submit" class="mv-sh-knopf">Wunsch senden</button>'
    +'<p class="mv-sh-klein">Wir nutzen deine Adresse nur, um dir auf diesen Wunsch zu antworten. <a href="recht.html">Datenschutz</a></p></form>');
  I.querySelectorAll('.mv-wchip').forEach(function(b){b.onclick=function(e){e.stopPropagation();var an=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',an);b.classList.toggle('an',an);};});
  var f=I.querySelector('form');f.onsubmit=function(e){e.preventDefault();e.stopPropagation();
    var gew=function(g){return [].slice.call(I.querySelectorAll('.mv-wchip.an[data-g="'+g+'"]')).map(function(b){return b.textContent;});};
    var tage=gew('tag'),dat=I.querySelector('#mv-wdat').value,mail=I.querySelector('#mv-wmail').value.trim(),F2=I.querySelector('.mv-wfehler');
    if(!tage.length&&!dat){F2.hidden=false;F2.textContent='Bitte wähl mindestens einen Tag oder ein Datum.';return;}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)){F2.hidden=false;F2.textContent='Bitte trag deine E-Mail-Adresse ein, damit wir dir antworten können.';I.querySelector('#mv-wmail').focus();return;}
    F2.hidden=true;
    var inhalt={kurs:kurs,welt:WW==='g'?'Akademie':'Institut',stadt:s.n,tage:tage.join(', '),datum:dat,zeit:gew('zeit').join(', '),online:gew('online').length?'ja':'nein',text:I.querySelector('#mv-wtext').value.trim(),mail:mail,an:WUNSCH_AN};
    var fertig=function(ok){I.innerHTML=ok?'<div class="mv-wok"><b>Dein Wunsch ist bei uns angekommen.</b><br>René oder Simon meldet sich innerhalb von zwei Werktagen persönlich bei dir. Deine Angabe hilft uns bei der Planung: Wünschen sich mehrere denselben Zeitraum, legen wir einen zusätzlichen Termin an, und du erfährst ihn zuerst.</div>'
        +(WUNSCH_ZIEL?'':'<p class="mv-sh-klein mv-vorschau">Vorschau: Das Formular ist noch nicht angeschlossen, dieser Wunsch wurde nicht verschickt.</p>')
        :'<p class="mv-wfehler">Das hat nicht geklappt. Schreib uns bitte direkt an '+WUNSCH_AN+'.</p>';};
    if(!WUNSCH_ZIEL){fertig(true);return;}
    fetch(WUNSCH_ZIEL,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(inhalt)}).then(function(r){fertig(r.ok);}).catch(function(){fertig(false);});};}
/* Codex-Hinweis (Simon-Mockup r175): Wischen allein reicht nicht → „Kurs 1 von 3“ mit Pfeilen über der Reihe */
function zaehler(I,R){var z=I.querySelector('.mv-zaehler');if(!z){z=el('div','mv-zaehler','<button type="button" class="mv-zp" data-d="-1" aria-label="Vorheriger Kurs">‹</button><span></span><button type="button" class="mv-zp" data-d="1" aria-label="Nächster Kurs">›</button>');R.parentNode.insertBefore(z,R);
    z.querySelectorAll('.mv-zp').forEach(function(b){b.onclick=function(e){e.stopPropagation();var k=R.querySelector('.mv-karte');if(k)R.scrollBy({left:+b.dataset.d*(k.offsetWidth+12),behavior:'smooth'});};});
    R.addEventListener('scroll',function(){upd();},{passive:true});}
  function upd(){var ks=R.querySelectorAll('.mv-karte'),k=ks[0];if(!k)return;var i=Math.min(ks.length,Math.round(R.scrollLeft/(k.offsetWidth+12))+1);z.querySelector('span').textContent='Kurs '+i+' von '+ks.length;
    z.hidden=R.scrollWidth<=R.clientWidth+4;}
  z._upd=upd;setTimeout(upd,60);}
function oeffne5(s){AKT=s;F.classList.add('mk5');F.dataset.w=WW;
  F.querySelector('.mk2-lw').textContent=s.n;
  F.querySelector('.mk2-adresse').hidden=K6;   /* Runde 139 (Simon): Location oben raus, steht nur noch hinter dem Knopf „Location“ */
  F.querySelector('.mk2-adresse').textContent=K6?(s.bald?'Startet bald · Location folgt':(ADRESSE[s.n]||'Location in '+s.n+' (Adresse folgt)')):(s.bald?'Startet bald':'Location: Adresse folgt (Platzhalter)');
  var I=F.querySelector('.mk5-inhalt');if(!I){I=el('div','mk5-inhalt',''+(K6?'<div class="mv-umschalter mk5-fwelt mk6-fwelt"><button class="mv-seg" data-w="g"><i></i><span>R&amp;F Akademie<small>Für dein Geld</small></span></button><button class="mv-seg" data-w="b"><i></i><span>R&amp;F Institut<small>Für dein Vermögen</small></span></button></div>':'<div class="mv-umschalter mk5-fwelt"><button class="mv-seg" data-w="g"><i></i>Für dein Geld</button><button class="mv-seg" data-w="b"><i></i>Für dein Vermögen</button></div>')+'<p class="mk5-satz"></p><div class="mv-reihe"></div>');F.appendChild(I);
    I.querySelectorAll('.mv-seg').forEach(function(b){b.onclick=function(e){e.stopPropagation();welt(b.dataset.w);};});}
  I.querySelectorAll('.mv-seg').forEach(function(b){b.classList.toggle('an',b.dataset.w===WW);});
  F.querySelector('.mk2-hinweis').textContent=K6?'Beispieltermine':(s.bald?'Hamburg startet bald. ':'')+'Platzhalter: Termine, Adresse und Anmeldung folgen.';
  I.querySelector('.mk5-satz').textContent=K6?((s.bald?'Startet bald. ':'')+'Die nächsten Kurstage in '+s.n+'. Oben wechselst du zwischen Akademie und Institut.'):((WW==='g'?'R&F Akademie · ':'R&F Institut · ')+ZEIG[WW].length+' Kurstage in '+s.n+'. Der Umschalter zeigt die andere Welt.');
  var R=I.querySelector('.mv-reihe');R.innerHTML='';R.scrollLeft=0;
  var zeileText=function(name,n){return K6?termin(s.n,name,WW,n):'Wo., TT.MM.JJJJ · hh:mm Uhr';};
  /* Runde 177 (Simon 15.11.2026: A3 grün, B1 freigegeben, Uhrzeiten bleiben): Kachel in Ruhe = Titel, Satz, Preis, drei Daten, „Kein Termin passt?“.
     Tipp auf ein Datum öffnet ein Blatt: Vormittag oder ganzer Tag, Anmelden, „Lieber live online?“. „Kein Termin passt?“ öffnet das Wunschformular (B1, Runde 176 mit Wunschtag). */
  var TAGE_G=['Dein erster Tag','Investmenttag','Börsentag'];
  var daten=function(name){return (W[WW].a.filter(function(x){return x[0]===name;})[0])||[name,'','','',''];};
  ZEIG[WW].forEach(function(name,ki){var a=daten(name),istWs=!!ANZEIGE[name],mitWs=K6&&WW==='g'&&TAGE_G.indexOf(name)>=0,w=daten('Einzelner Workshop');
    var preis=mitWs?'Vormittag '+w[3]+'<br>Ganzer Tag '+a[3]:(istWs?'3 Std-Workshop · '+a[3]:'Ganzer Tag · '+a[3]);
    var chips=[0,1,2].map(function(n){return '<button type="button" class="mv-dchip" data-n="'+n+'">'+dtext(tdat(s.n,name,WW,n)).replace(/\.\d{4}$/,'.')+'</button>';}).join('');
    var k=el('div','mv-karte mv-tkarte mv-a3','<span class="mv-bild" style="background-image:url(bilder/preise/'+BILD5[name]+'?v=139)"></span><span class="mv-ktext"><b>'+(ANZEIGE[name]||name)+'</b><small class="mk5-fuer">'+a[2]+'</small>'
      +'<span class="mv-a3preis">'+preis+'</span><span class="mv-a3lab">Nächste Termine in '+s.n+'</span><span class="mv-dchips">'+chips+'</span>'
      +'<button type="button" class="mv-kein">Kein Termin passt?</button></span>');
    k.querySelectorAll('.mv-dchip').forEach(function(bt){bt.onclick=function(e){e.stopPropagation();blattTermin(s,name,+bt.dataset.n);};});
    k.querySelector('.mv-kein').onclick=function(e){e.stopPropagation();blattWunsch(s,name);};
    R.appendChild(k);});
  zaehler(I,R);
  MED.forEach(function(x){x[1].classList.toggle('an',x[0]===s);});
  F.classList.add('auf');}
function oeffne(s){if(K5)return oeffne5(s);
  F.querySelector('.mk2-lw').textContent=s.n;
  F.querySelector('.mk2-adresse').textContent=s.bald?'Startet bald':'Adresse folgt, eine je Stadt (Platzhalter)';
  var H=F.querySelector('.mk2-hinweis'),Li=F.querySelector('.mk2-liste');Li.innerHTML='';
  MED.forEach(function(x){x[1].classList.toggle('an',x[0]===s);});
  if(s.bald){H.textContent='Hamburg startet bald. Die Termine stehen hier, sobald sie feststehen.';F.classList.add('auf');return;}
  H.textContent='Platzhalter: Termine, Uhrzeiten und Adresse legst du mit René fest; die fünf Kurse sind meine Annahme. Ein Tipp auf einen Termin öffnet später deinen Stripe-Link.';
  KURSE.forEach(function(k){
    var z=el('div','mk2-kurs','<div class="mk2-kkopf"><small data-w="'+k[1]+'">'+WELT[k[1]]+'</small><b>'+k[0]+'</b></div><div class="mk2-termine"></div><button class="mk2-mehr">Noch einen Termin</button>');
    var T=z.querySelector('.mk2-termine'),n=0;
    function dazu(){n++;var r=el('button','mk2-termin','<i></i><span><b>Wo., TT.MM.JJJJ · hh:mm Uhr</b><small>vor Ort · auch live online</small></span><em>'+(n===1?'nächster Termin':n+'. Termin')+'</em>');T.appendChild(r);
      if(n>=4){var b=z.querySelector('.mk2-mehr');b.disabled=true;b.textContent='Weitere Termine folgen';}}
    dazu();z.querySelector('.mk2-mehr').onclick=function(e){e.stopPropagation();dazu();};
    Li.appendChild(z);});
  F.classList.add('auf');}
function schliesse(){F.classList.remove('auf');MED.forEach(function(x){x[1].classList.remove('an');});}
F.querySelector('.mk2-x').onclick=function(e){e.stopPropagation();schliesse();};
/* Runde 140 (Simon am Handy: „wichtig, dass man diese Kachel hoch- und runterwischen muss“): Fenster am farbigen Streifen mit Finger
   oder Maus ziehen wie ein iOS-Blatt – hoch = groß (Karten untereinander), runter = zurück bzw. zu; kurzer Tipp wechselt die Größe. Nur Handy. */
(function(){var Z=F.querySelector('.mk2-streifen'),zug=null;
  function stufe(g){F.classList.toggle('gross',g);F.style.height='';F.style.transform='';}
  Z.addEventListener('pointerdown',function(e){if(innerWidth>=900)return;zug={y:e.clientY,h:F.offsetHeight,g:F.classList.contains('gross'),dy:0};F.classList.add('zieht');Z.setPointerCapture(e.pointerId);e.preventDefault();});
  Z.addEventListener('pointermove',function(e){if(!zug)return;var dy=e.clientY-zug.y;zug.dy=dy;
    if(dy<0){F.style.transform='';F.style.height=Math.min(innerHeight*0.92,zug.h-dy)+'px';}
    else if(zug.g){F.style.height=Math.max(zug.h-dy,zug.h*0.5)+'px';}
    else{F.style.transform='translate(-50%,'+dy+'px)';}});
  function los(){if(!zug)return;var dy=zug.dy,g=zug.g;zug=null;F.classList.remove('zieht');
    if(Math.abs(dy)<6){stufe(!g);return;}
    if(dy<-50)stufe(true);else if(dy>220||(!g&&dy>80)){stufe(false);schliesse();}else if(g&&dy>60)stufe(false);else stufe(g);}
  Z.addEventListener('pointerup',los);Z.addEventListener('pointercancel',los);})();
window.__mk2={oeffne:function(i){oeffne(STAEDTE[i]);},zu:schliesse};

function an(){return DOC.classList.contains('mv-termine');}
if(K5)DOC.dataset.welt5='g';
function setze(){
  var wahl=document.getElementById('wahl'),h1=wahl&&wahl.querySelector('h1');
  L.hidden=!an()||!wahl||wahl.hidden;DOC.classList.toggle('mk2-an',!L.hidden);
  if(L.hidden){schliesse();return;}
  if(K5){DOC.classList.add('mk5-an');var hb=(document.querySelector('.leiste')||{getBoundingClientRect:function(){return{bottom:0};}}).getBoundingClientRect().bottom;
    L.style.cssText='position:fixed;left:0;right:0;top:'+Math.max(0,hb)+'px;bottom:0;';
    if(!KARTE)return;var breit=innerWidth>=900,kh=K6?(breit?96:88):(breit?120:116),lh=L.clientHeight-kh-14,lw=L.clientWidth-24,sk=Math.min(lw/KARTE.W,lh/KARTE.H),bw=KARTE.W*sk,bh=KARTE.H*sk;
    BOX.style.width=bw+'px';BOX.style.height=bh+'px';BOX.style.left=((L.clientWidth-bw)/2)+'px';BOX.style.top=(K6?kh+Math.max(0,(lh-bh)*0.42):kh)+'px';   /* Runde 138: Karte 6 senkrecht mittig, am Handy sonst leerer Platz unten */
    if(K6){var u=bw/600/2.065,im=BOX.querySelector('.mk6-karte');if(im){im.style.width=(1344*u)+'px';im.style.left=(-52.5*u)+'px';im.style.top=(-125.75*u)+'px';}}   /* Karte B deckungsgleich: 2,065 Bildpunkte je Karteneinheit, Versatz 52,5/125,75 (gemessen Runde 136) */
    var g=breit?92:58;
    MED.forEach(function(x){var s=x[0],m=x[1],p=KARTE.staedte[s.n],e_=echt(s),w=e_?g*(K6?(breit?1.55:1.3):1.25):g*0.62,h=e_?w*0.88:w;
      m.style.setProperty('--fw',w+'px');m.style.left=(p[0]*sk-w/2)+'px';m.style.top=(p[1]*sk-h*0.86)+'px';});
    if(F6){var bx=parseFloat(BOX.style.left),by=parseFloat(BOX.style.top),LW=L.clientWidth,LH=L.clientHeight,oben=kh-2;
      /* Runde 149 (Simon: „auf dem Mac sieht es nicht gut aus, auf dem Handy schon“): am breiten Bildschirm nur ein Rahmen um die Karte (je Seite 0,5 Kartenbreiten),
         nach außen weich ausgeblendet, damit die Bilder nicht aufgeblasen werden. Am Handy wie bisher die ganze Breite. Jedes Bild füllt sein Feld immer ganz (keine dunklen Lücken). */
      /* Runde 153 (Simon: „Mac noch nicht aufgeräumt, schwarze/blaue Fläche, Fotos anders schneiden“): Rahmen und Auslauf wieder weg, Fotos bis zum Rand;
         am Mac füllt jedes Foto sein ganzes Feld (Motiv an der Außenseite), am Handy wie bisher nach dem Erkennbarkeits-Bereich. */
      var pl=0,pr=LW,pu=LH;
      if(RAND6){RAND6.hidden=true;RAND6.style.cssText='left:'+pl+'px;width:'+(pr-pl)+'px;top:'+oben+'px;height:'+(pu-oben)+'px';}
      FELD6.forEach(function(x){var f=x[0],b=x[1],X=function(u){return Math.max(pl,Math.min(pr,bx+u*sk));},Y=function(u){return Math.max(oben,Math.min(pu,by+u*sk));};
        var l=X(f[2]),r=X(f[3]),t=Y(f[4]),u=Y(f[5]);
        /* Runde 154: am Mac je Seite drei gleich hohe Felder (links H/D/S, rechts B/F/M), die sich unter der Karte in der Mitte treffen */
        if(breit){var zi=FOTO6.indexOf(f)>>1,rh=(LH-oben)/3,mi=bx+300*sk;l=(FOTO6.indexOf(f)&1)?mi:0;r=(FOTO6.indexOf(f)&1)?LW:mi;t=oben+zi*rh;u=t+rh;}
        var dw=Math.max(0,r-l-2),dh=Math.max(0,u-t-2);b.style.left=(l+1)+'px';b.style.top=(t+1)+'px';b.style.width=dw+'px';b.style.height=dh+'px';
        var fl=breit?l:Math.max(l,X(f[6])),fr=breit?r:Math.min(r,X(f[7])),fw=Math.max(1,fr-fl),fh=Math.max(1,u-t),ar=b._ar||1.4,iw=Math.max(fw,fh*ar),ih=iw/ar;if(ih<fh){ih=fh;iw=ih*ar;}
        if(iw<dw){iw=dw;ih=iw/ar;}if(ih<dh){ih=dh;iw=ih*ar;}
        var ax=breit?(f[10][0]==='l'?Math.min(f[8],.3):Math.max(f[8],.7)):f[8],px=Math.min(0,Math.max(dw-iw,(fl-l)-(iw-fw)*ax)),py=Math.min(0,Math.max(dh-ih,-(ih-fh)*f[9]));
        b.style.backgroundSize=iw+'px '+ih+'px';b.style.backgroundPosition=px+'px '+py+'px';
        var sn=fw<120;b.firstChild.classList.toggle('eng',sn);b.firstChild.innerHTML=f[0]+(sn?'<br>':' · ')+f[11];b.firstChild.style.maxWidth=sn?'':Math.max(60,fw-12)+'px';   /* Runde 148: schmale Streifen zweizeilig */
        if(breit){var sp=b.firstChild.style;sp.left=sp.right='';var ein=6;if(f[10][0]==='l')sp.left=(l<=pl+1?ein:6)+'px';else sp.right=(r>=pr-1?ein:6)+'px';if(f[10][1]==='u')sp.bottom='6px';}});}
    return;}
  var w=wahl.getBoundingClientRect(),t=h1.getBoundingClientRect(),oben=t.bottom+10,unten=w.bottom-8;
  L.style.left=(w.left+scrollX)+'px';L.style.top=(oben+scrollY)+'px';L.style.width=w.width+'px';L.style.height=Math.max(260,unten-oben)+'px';
  if(!KARTE)return;
  var breit=innerWidth>=900;
  /* Kartenfläche: Variante 2 braucht Rand für die Bilder, Variante 3 Platz für die Leiste */
  var lh=L.clientHeight,lw=L.clientWidth,rand=K==='2'?(breit?120:58):10,leiste=(K==='3'||K==='4')?(breit?0:K==='4'?150:88):0,seite=K==='3'&&breit?230:0;
  var ah=lh-leiste-(K==='2'?rand*0.9:16),aw=lw-2*rand-seite;var sk=Math.min(aw/KARTE.W,ah/KARTE.H);
  var bw=KARTE.W*sk,bh=KARTE.H*sk;
  BOX.style.width=bw+'px';BOX.style.height=bh+'px';BOX.style.left=((lw-seite-bw)/2)+'px';BOX.style.top=(K==='2'?rand*0.35:4)+'px';
  LEISTE.style.cssText=K==='3'?(breit?'left:'+(lw-seite+10)+'px;top:'+(lh/2-160)+'px;width:'+(seite-20)+'px':'left:0;right:0;bottom:0'):(K==='4'&&!breit?'left:0;right:0;bottom:0':'display:none');
  var gross=breit?72:((K==='1'||K==='4')?44:50);
  LINIEN.setAttribute('width',bw+2*rand*2);LINIEN.setAttribute('height',bh+rand*2);LINIEN.style.left=(-rand*2)+'px';LINIEN.style.top=(-rand)+'px';
  var linien='';
  MED.forEach(function(x){var s=x[0],m=x[1];m.style.setProperty('--g',gross+'px');
    if(K==='3'){m.style.left=m.style.top='';return;}
    if(m.classList.contains('mk2-lmed'))return;
    var p=KARTE.staedte[s.n],px,py;
    if(K==='1'||K==='4'){px=p[0]*sk;py=p[1]*sk-gross/2-(innerWidth>=900?30:26);}
    else{var r=RAND[s.n];px=r[0]*bw;py=r[1]*bh;
      {var qx=p[0]*sk,qy=p[1]*sk;linien+='<line x1="'+(px+rand*2)+'" y1="'+(py+rand)+'" x2="'+(qx+rand*2)+'" y2="'+(qy+rand)+'"/>';}}
    m.style.left=(px-gross/2)+'px';m.style.top=(py-gross/2)+'px';});
  LINIEN.innerHTML=linien;}
/* Runde 131: setze() höchstens einmal je Bild (Karte 5 hing in einer Aufruf-Schleife, sobald die Seite fest stand) */
var geplant=false;function plane(){if(geplant)return;geplant=true;requestAnimationFrame(function(){geplant=false;setze();});}
new MutationObserver(plane).observe(DOC,{attributes:true,attributeFilter:['class']});
addEventListener('resize',plane);addEventListener('load',plane);setInterval(plane,500);plane();
/* Runde 129: eigene Seite zum Verlinken (termine.html bzw. &t=1): öffnet direkt in der Termin-Ansicht */
if(Q.get('t')==='1'||/termine\.html$/.test(location.pathname)){var auf=function(){if(window.__mv&&window.__mv.modus){window.__mv.modus('termine');}else setTimeout(auf,100);};addEventListener('load',function(){setTimeout(auf,50);});}
var band=document.createElement('div');band.className='mk2-band';band.textContent='Mockup 2 · Karte '+K+' · nicht live';if(!K6)document.body.appendChild(band);
})();
