/* Runde 122 (Simon 14.11.2026): fünf Optik-Varianten für „Deine Finanzbildung“. Nur Mockup, nicht live.
   ?m=v1  Apple-Weg: Umschalter „Akademie | Institut“ unter dem Titel, Kurse als Karten mit Raumbild in einem Blatt, das von unten hochfährt (wie apple.com „Entdecke alle Modelle“)
   ?m=v2  Glas-Kachel unter dem Titel in der Bildmitte; zu: „Für dein Geld“ / „Für dein Vermögen“; auf: dazu „R&F Akademie“ / „R&F Institut“; kein „Schließen“
   ?m=v3  wie Runde 120 (Glas-Kachel unten, Titel oben); zu: „Akademie“ + „Für dein Geld“; auf: fährt hoch bis die Liste am roten Strich endet, Kopf „R&F Akademie“; kein „Schließen“
   ?m=v4  wie Variante E (nur Schrift) unter dem Titel in der Bildmitte; Texte wie v2
   ?m=v5  Titel grün-blau ineinander verlaufend mit Aufklapp-Pfeil; auf: links Akademie, rechts Institut, darunter die Kurse mit Preisen
   Ein Tipp auf einen Kurs öffnet direkt die Welt mit diesem Kurs (wie preise.html?w=g&e=…). */
(function(){
var M=(new URLSearchParams(location.search).get('m')||'').toLowerCase();if(!/^v[1-5]$/.test(M))return;
var DOC=document.documentElement;DOC.dataset.mk=M;
var wahl=document.getElementById('wahl'),h1=wahl.querySelector('h1');h1.textContent='Deine Finanzbildung';
var band=document.createElement('div');band.className='mv-band';band.textContent='Mockup Variante '+M.slice(1)+' · nicht live';document.body.appendChild(band);
var WK={0:'g',1:'b'},TXT={0:{kurz:'Akademie',lang:'R&F Akademie',fuer:'Für dein Geld'},1:{kurz:'Institut',lang:'R&F Institut',fuer:'Für dein Vermögen'}};
/* Runde 124 (Simon): Kartenbild = Raum im Gebäude, von weiter weg, Himmel links und rechts (erzeugt mit _arbeit/r124_karten.py) */
var BILD={'Dein erster Tag':'karte_erstertag.jpg','Investmenttag':'karte_investmenttag.jpg','Börsentag':'karte_boersentag.jpg','Einzelner Workshop':'karte_workshop.jpg',
          'Modul 1A':'karte_modul1a.jpg','Investment Zirkel':'karte_investment.jpg','Rainmaker Zirkel':'karte_rainmaker.jpg','Mentoring':'karte_mentoring.jpg'};
/* Runde 140 (Simon: Räume 20/30/50 % größer zeigen): ?g=20|30|50 nimmt die enger geschnittenen Kartenbilder karte_<kurs>_gNN.jpg */
(function(){var g=(location.search.match(/[?&]g=(20|30|35|50)\b/)||[])[1];if(g)for(var n in BILD)BILD[n]=BILD[n].replace('.jpg','_g'+g+'.jpg');})();
function kurse(wi){return WELT[wi].stufen.map(function(s,j){var a=W[WK[wi]].a[s.a];return {j:j,name:a[0],kurz:a[2],preis:a[3]};}).reverse();}   /* wie in der Welt: oben teuer */
function geheZu(wi,j){zu();akt=wi;mitte(wi);lage();anzeige();oeffne(wi);waehleEtage(j);}
function el(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;}
var PFEIL='<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4 L6 8 L10 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
var L=el('div','mv-ebene');document.body.appendChild(L);
var zu=function(){};

/* ---------- v2, v3, v4: geteilte Kachel (v4 ohne Kachel) ---------- */
if(M==='v2'||M==='v3'||M==='v4'){
  var K=el('div','mv-leiste');L.appendChild(K);
  var HALB=[0,1].map(function(wi){
    var h=el('div','mv-halb');h.dataset.w=WK[wi];
    var kopfZu=M==='v3'?'<b>'+TXT[wi].kurz+'</b><small>'+TXT[wi].fuer+'</small>':'<b>'+TXT[wi].fuer+'</b>';
    var kopfAuf=M==='v3'?'<b>'+TXT[wi].lang+'</b><small>'+TXT[wi].fuer+'</small>':'<b>'+TXT[wi].fuer+'</b><small>'+TXT[wi].lang+'</small>';
    var kopf=el('button','mv-kopf','<span class="mv-nm"><span class="mv-z">'+kopfZu+'</span><span class="mv-a">'+kopfAuf+'</span></span><span class="mv-pfeil">'+PFEIL+'</span>');
    var li=el('div','mv-liste');
    kurse(wi).forEach(function(c){var b=el('button','mv-kurs','<b>'+c.name+'</b><span>'+c.preis+'</span>');b.onclick=function(e){e.stopPropagation();geheZu(wi,c.j);};li.appendChild(b);});
    h.appendChild(kopf);h.appendChild(li);K.appendChild(h);
    h.auf=function(an){h.classList.toggle('auf',an);kopf.setAttribute('aria-expanded',an?'true':'false');};
    kopf.onclick=function(e){e.stopPropagation();tipp(h);};
    return h;});
  var hoch=false,anim=null,pos=null;
  var offen=function(){return HALB.some(function(x){return x.classList.contains('auf');});};
  zu=function(){HALB.forEach(function(x){x.auf(false);});hoch=false;anim=null;};
  function jetzt(){return window.__mkZeit!=null?window.__mkZeit:performance.now();}
  function weich(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;}
  function unten(){var d=wahl.querySelector('.duo').getBoundingClientRect();return d.bottom-K.querySelector('.mv-kopf').offsetHeight-26;}
  function oben(hk){var tb=h1.getBoundingClientRect();return Math.max(tb.bottom+10,innerHeight*0.837-hk);}   /* v3: Liste endet am roten Strich (Simons Markierung: 83,7 % der Höhe) */
  function hoeheOffen(h){var war=h.classList.contains('auf');h.classList.add('auf');var hk=K.offsetHeight;if(!war)h.classList.remove('auf');return hk;}
  function bewege(nach,dauer,fertig){if(pos==null)pos=nach;anim={von:pos,nach:nach,t0:jetzt(),dauer:dauer,fertig:fertig};lauf();}
  function lauf(){if(!anim)return;var p=Math.min(1,(jetzt()-anim.t0)/anim.dauer);pos=anim.von+(anim.nach-anim.von)*weich(p);K.style.top=(pos+scrollY)+'px';
    if(p>=1){var f=anim.fertig;anim=null;if(f)f();}else if(window.__mkZeit==null)requestAnimationFrame(lauf);}
  function tipp(h){var war=h.classList.contains('auf');
    if(M!=='v3'){h.auf(!war);return;}
    if(!hoch){hoch=true;var hk=hoeheOffen(h);bewege(oben(hk),650,function(){h.auf(true);});return;}
    h.auf(!war);
    if(!offen()){hoch=false;bewege(unten(),650);}else bewege(oben(K.offsetHeight),300);}
  window.__mv={lauf:lauf,tipp:function(i){tipp(HALB[i]);},K:K};
  var setzeK=function(){var d=wahl.querySelector('.duo').getBoundingClientRect(),tb=h1.getBoundingClientRect();
    K.style.left=(d.left+d.width/2+scrollX)+'px';
    if(M==='v3'){if(!anim){pos=hoch?oben(K.offsetHeight):unten();K.style.top=(pos+scrollY)+'px';}}
    else K.style.top=(tb.bottom+12+scrollY)+'px';};
}

/* ---------- v5: Titel grün-blau mit Aufklapp-Pfeil, darunter zwei Spalten ---------- */
if(M==='v5'){
  var knopf=el('button','mv-titelknopf','<span class="mv-pfeil">'+PFEIL+'</span>');knopf.setAttribute('aria-label','Kurse zeigen');
  var S=el('div','mv-spalten');
  [0,1].forEach(function(wi){var sp=el('div','mv-spalte');sp.dataset.w=WK[wi];
    sp.appendChild(el('div','mv-skopf','<b>'+TXT[wi].fuer+'</b><small>'+TXT[wi].lang+'</small>'));
    kurse(wi).forEach(function(c){var b=el('button','mv-kurs','<b>'+c.name+'</b><span>'+c.preis+'</span>');b.onclick=function(e){e.stopPropagation();geheZu(wi,c.j);};sp.appendChild(b);});
    S.appendChild(sp);});
  L.appendChild(knopf);L.appendChild(S);
  var auf5=function(an){DOC.classList.toggle('mv-offen',an);knopf.setAttribute('aria-expanded',an?'true':'false');};
  knopf.onclick=h1.onclick=function(e){e.stopPropagation();auf5(!DOC.classList.contains('mv-offen'));};
  zu=function(){auf5(false);};window.__mv={tipp:function(){knopf.click();}};
  var setze5=function(){var tb=h1.getBoundingClientRect(),d=wahl.querySelector('.duo').getBoundingClientRect(),r=h1.firstChild?(function(){var g=document.createRange();g.selectNodeContents(h1);return g.getBoundingClientRect();})():tb;
    knopf.style.left=(r.right+10+scrollX)+'px';knopf.style.top=(r.top+r.height/2-16+scrollY)+'px';
    S.style.left=(d.left+d.width/2+scrollX)+'px';S.style.top=(tb.bottom+14+scrollY)+'px';};
}

/* ---------- v1: Apple-Weg ---------- */
/* Runde 126 (Simon): Umschalter „Für dein Geld“ / „Für dein Vermögen“; Blatt-Kopf andersherum (fett „Für dein …“, darunter „R&F …“);
   Blatt am Griff mit Finger oder Maus ziehbar: hoch = groß, runter = mittel bzw. zu (wie ein iOS-Blatt). */
if(M==='v1'){
  var U=el('div','mv-umschalter');var SEG=[0,1].map(function(wi){var b=el('button','mv-seg','<i></i>'+TXT[wi].fuer);b.dataset.w=WK[wi];U.appendChild(b);return b;});
  /* Runde 127 (Simon): oben im Blatt ein durchgehender Streifen in der Weltfarbe mit dem Logo „R&F | Institut“ bzw. „R&F | Akademie“ (weiß);
     „Für dein Vermögen“ steht nur noch im Umschalter. */
  var B=el('div','mv-blatt','<div class="mv-zieh mv-streifen"><div class="mv-griff"></div><div class="mv-logo"><b>R&amp;F</b><span class="mv-lw"></span></div></div><button class="mv-x" aria-label="Schließen">×</button><div class="mv-hinweis" hidden></div><div class="mv-reihe"></div>');
  L.appendChild(U);L.appendChild(B);var aktiv=-1;
  function stufe(s){B.classList.toggle('gross',s==='gross');B.style.height='';B.style.transform='';}
  function zeige(wi){aktiv=wi;SEG.forEach(function(s,i){s.classList.toggle('an',i===wi);});
    if(wi<0){B.classList.remove('auf');stufe('mittel');return;}
    B.dataset.w=WK[wi];B.querySelector('.mv-lw').textContent=TXT[wi].kurz;B.querySelector('.mv-hinweis').hidden=true;
    var R=B.querySelector('.mv-reihe');R.innerHTML='';R.scrollLeft=0;R.scrollTop=0;
    kurse(wi).forEach(function(c){var k=el('button','mv-karte','<span class="mv-bild" style="background-image:url(bilder/preise/'+BILD[c.name]+'?v=139)"></span><span class="mv-ktext"><b>'+c.name+'</b><small>'+(c.kurz||'')+'</small><em>'+c.preis+'</em><span class="mv-mehr">Raum ansehen ›</span></span>');
      k.onclick=function(e){e.stopPropagation();geheZu(wi,c.j);};R.appendChild(k);});
    B.classList.add('auf');}
  SEG.forEach(function(s,i){s.onclick=function(e){e.stopPropagation();zeige(aktiv===i?-1:i);};});
  B.querySelector('.mv-x').onclick=function(e){e.stopPropagation();zeige(-1);};
  /* Ziehen am Griff-Bereich: Zeiger-Ereignisse gelten für Finger und Maus */
  var Z=B.querySelector('.mv-zieh'),zug=null;
  Z.addEventListener('pointerdown',function(e){zug={y:e.clientY,h:B.offsetHeight,gross:B.classList.contains('gross'),dy:0};B.classList.add('zieht');Z.setPointerCapture(e.pointerId);e.preventDefault();});
  Z.addEventListener('pointermove',function(e){if(!zug)return;var dy=e.clientY-zug.y;zug.dy=dy;
    if(dy<0){B.style.transform='';B.style.height=Math.min(innerHeight*0.92,zug.h-dy)+'px';}   /* hoch: Blatt wächst */
    else{B.style.height=zug.gross?Math.max(zug.h-dy,zug.h*0.5)+'px':'';if(!zug.gross)B.style.transform='translate(-50%,'+dy+'px)';}});   /* runter: schrumpft bzw. fährt raus */
  function los(){if(!zug)return;var dy=zug.dy,g=zug.gross;zug=null;B.classList.remove('zieht');
    if(Math.abs(dy)<6){stufe(g?'mittel':'gross');return;}   /* kurzer Tipp auf den Griff: Stufe wechseln */
    if(dy<-50)stufe('gross');else if(dy>220||(!g&&dy>80))zeige(-1);else if(g&&dy>60)stufe('mittel');else stufe(g?'gross':'mittel');}
  Z.addEventListener('pointerup',los);Z.addEventListener('pointercancel',los);
  /* Runde 127 (Simon): Perspektivenwechsel über „Termine“ oben. Titel „Deine Termine. Deine Metropole.“, darunter die sechs Städte
     als Auswahl wie „Für dein Geld“ / „Für dein Vermögen“; Tipp auf eine Stadt öffnet dasselbe Blatt mit den fünf Präsenztagen
     und je den drei nächsten Terminen (3 × 5 = 15 je Stadt).
     PLATZHALTER: Städte und Termine liegen mir nicht vor (nirgends im Projekt). Annahme für die fünf Präsenztage: die Tagesangebote
     aus der Preisseite (Dein erster Tag, Investmenttag, Börsentag, Investment Zirkel, Rainmaker Zirkel). */
  /* Runde 128 (Simons Diktat): München, Stuttgart, Düsseldorf, Frankfurt, Berlin; die sechste Stadt ist noch nicht gestartet, Name offen */
  /* Runde 130 (Simon): obere Reihe Düsseldorf · Hamburg · Berlin, darunter Frankfurt · Stuttgart · München (grob wie auf der Karte, Nord oben) */
  var STAEDTE=['Düsseldorf','Hamburg','Berlin','Frankfurt','Stuttgart','München'];
  var TAGE=[[0,'Dein erster Tag'],[0,'Investmenttag'],[0,'Börsentag'],[1,'Investment Zirkel'],[1,'Rainmaker Zirkel']];
  var U2=el('div','mv-umschalter mv-staedte');var SEG2=STAEDTE.map(function(n,i){var b=el('button','mv-seg',n);b.dataset.w='n';U2.appendChild(b);return b;});
  L.appendChild(U2);var modus='welt',aktivStadt=-1;
  function zeigeStadt(i){aktivStadt=i;SEG2.forEach(function(s,k){s.classList.toggle('an',k===i);});
    if(i<0){B.classList.remove('auf');stufe('mittel');return;}
    B.dataset.w='n';B.querySelector('.mv-lw').textContent=STAEDTE[i];
    var H=B.querySelector('.mv-hinweis');H.hidden=false;H.textContent='Platzhalter: Termine fehlen noch, die fünf Produkte sind meine Annahme.';
    if(STAEDTE[i]==='Hamburg')H.textContent='Hamburg startet bald. Termine, Adresse und Anmeldung sind Platzhalter.';   /* Runde 130: Hamburg zeigt dieselben Kurse */
    var R=B.querySelector('.mv-reihe');R.innerHTML='';R.scrollLeft=0;R.scrollTop=0;
    TAGE.forEach(function(t){var wi=t[0],c=kurse(wi).filter(function(k){return k.name===t[1];})[0];if(!c)return;
      /* Runde 130 (Simon): je Kurs nur der nächste Termin sichtbar, zwei weitere aufklappbar; statt „Raum ansehen“ zwei Knöpfe „Location“ und „Anmeldung“ */
      var zeile=function(n){return '<span class="mv-termin"><i></i><span><b>Wo., TT.MM.JJJJ · hh:mm Uhr</b><small>vor Ort · auch live online</small></span></span>';};
      var termine=zeile(1)+'<button type="button" class="mv-weitere" aria-expanded="false">2 weitere Termine <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4 L6 8 L10 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button><span class="mv-mehrt" hidden>'+zeile(2)+zeile(3)+'</span>';
      var k=el('div','mv-karte mv-tkarte','<span class="mv-bild" style="background-image:url(bilder/preise/'+BILD[c.name]+'?v=139)"></span><span class="mv-ktext"><small class="mv-welt" data-w="'+WK[wi]+'">'+TXT[wi].lang+'</small><b>'+c.name+'</b>'+termine+'<em>'+c.preis+'</em>'
        +'<span class="mv-ort" hidden>Location in '+STAEDTE[i]+': Adresse folgt (Platzhalter)</span><span class="mv-zwei"><button type="button" class="mv-k2 mv-loc">Location</button><button type="button" class="mv-k2 mv-anm">Anmeldung</button></span><span class="mv-stripe" hidden>Hier öffnet sich dein Stripe-Link (folgt)</span></span>');
      k.querySelector('.mv-weitere').onclick=function(e){e.stopPropagation();var m=k.querySelector('.mv-mehrt'),an=m.hidden;m.hidden=!an;this.setAttribute('aria-expanded',an?'true':'false');this.firstChild.textContent=an?'Weniger anzeigen ':'2 weitere Termine ';};
      k.querySelector('.mv-loc').onclick=function(e){e.stopPropagation();var o=k.querySelector('.mv-ort');o.hidden=!o.hidden;};
      k.querySelector('.mv-anm').onclick=function(e){e.stopPropagation();var o=k.querySelector('.mv-stripe');o.hidden=!o.hidden;};
      R.appendChild(k);});
    B.classList.add('auf');}
  SEG2.forEach(function(s,i){s.onclick=function(e){e.stopPropagation();zeigeStadt(aktivStadt===i?-1:i);};});
  function setzeModus(m){modus=m;DOC.classList.toggle('mv-termine',m==='termine');zeige(-1);zeigeStadt(-1);
    h1.textContent=m==='termine'?'Deine Termine. Deine Metropole.':'Deine Finanzbildung';
    var kn=document.querySelector('.leiste .knopf');if(kn)kn.classList.toggle('mv-an',m==='termine');}
  document.addEventListener('click',function(e){var kn=e.target.closest&&e.target.closest('.leiste .knopf');if(!kn||wahl.hidden)return;
    e.preventDefault();e.stopPropagation();setzeModus(modus==='termine'?'welt':'termine');},true);
  B.querySelector('.mv-x').onclick=function(e){e.stopPropagation();zeige(-1);zeigeStadt(-1);};
  var zuWelt=function(){zeige(-1);zeigeStadt(-1);};
  zu=zuWelt;window.__mv={tipp:function(i){zeige(aktiv===i?-1:i);},stadt:function(i){zeigeStadt(i);},modus:setzeModus,gross:function(){stufe('gross');},B:B};
  var setze1=function(){var tb=h1.getBoundingClientRect();U.style.top=(tb.bottom+12+scrollY)+'px';U2.style.top=(tb.bottom+12+scrollY)+'px';};
}

/* Runde 126 (Simon): Im Kopf „R&F | Institut“ das Wort „Institut“ weg, der Strich bleibt */
function marke(){var mm=document.querySelector('.marke-mehr');if(mm&&/^\s*Institut\s*$/i.test(mm.textContent))mm.textContent='​';}
function setze(){marke();L.hidden=wahl.hidden;band.hidden=wahl.hidden;if(wahl.hidden){zu();return;}
  if(typeof setzeK==='function')setzeK();if(typeof setze5==='function')setze5();if(typeof setze1==='function')setze1();}
addEventListener('resize',setze);addEventListener('load',setze);setInterval(setze,400);setze();
new MutationObserver(setze).observe(wahl,{attributes:true,attributeFilter:['hidden']});
})();
