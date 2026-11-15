/* Runde 118 (Simons Abschicken 14.11.2026, 16:47): D = Titel wie B, Namen unten weg, die Kachel steht unten an der Naht;
   Tipp auf eine Hälfte: sie wandert weich in die Mitte und klappt dort auf; zu: klappt zu und fährt wieder hinunter.
   Runde 117 (Simons Abschicken 14.11.2026, 16:40): Titel viel kleiner (A klein, B kleiner), Kachel kompakt direkt unter dem Titel,
   C = wie A, am Handy Leuchtturm und Hochhaus tiefer gesetzt (Lücke oben). Immer Tagesversion (die Nachtfassung ändert sich noch).
   Davor Runde 116 (Simons Abschicken 14.11.2026, 16:33): Titel „Deine Finanzbildung“, darunter auf Höhe des Lichtkegels
   EINE waagrechte Kachel, geteilt genau an der Bildnaht: links Akademie (grün, nur in der grünen Welt),
   rechts Institut (blau, nur in der blauen Welt). Jede Hälfte klappt ihre vier Kurse in ihrer eigenen Hälfte auf.
   Klick auf einen Kurs öffnet direkt die Welt mit diesem Kurs (wie preise.html?w=g&e=…). Nur Mockup, nicht live.
   Varianten 1b (Drachen/Ballon) und 2 (Fenster) hat Simon verworfen; Stand Runde 115 in der Git-Historie. */
(function(){
if(/^v[1-5]$/i.test(new URLSearchParams(location.search).get('m')||''))return;   /* Runde 122: v1–v5 stehen in mock_v.js */
var M=(new URLSearchParams(location.search).get('m')||'a').toLowerCase();if('abcde'.indexOf(M)<0)M='a';var D=M==='d'||M==='e';   /* Runde 121: E = wie D, aber ohne Kachel, nur Schrift */
document.documentElement.dataset.mk=M;
var wahl=document.getElementById('wahl'),h1=wahl.querySelector('h1');
if(h1)h1.textContent='Deine Finanzbildung';
var NAME={0:['Akademie','fürs Geld'],1:['Institut','fürs Vermögen']},WK={0:'g',1:'b'};
var band=document.createElement('div');band.className='mk-band';band.textContent='Mockup '+M.toUpperCase()+' · nicht live';document.body.appendChild(band);

function kurse(wi){return WELT[wi].stufen.map(function(s,j){return {j:j,a:s.a};}).reverse();}   /* wie in der Welt: oben teuer */
function geheZu(wi,j){zu();akt=wi;mitte(wi);lage();anzeige();oeffne(wi);waehleEtage(j);}

var K=document.createElement('div');K.className='mk-leiste';document.body.appendChild(K);
var HALB=[0,1].map(function(wi){
  var h=document.createElement('div');h.className='mk-halb';h.dataset.w=WK[wi];
  var kopf=document.createElement('button');kopf.className='mk-kopf';kopf.setAttribute('aria-expanded','false');
  kopf.innerHTML='<span class="mk-nm"><b>'+NAME[wi][0]+'</b><small>'+NAME[wi][1]+'<span class="mk-n"> · 4 Kurse</span></small></span><span class="mk-pfeil" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 4 L6 8 L10 4" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg></span>';
  var li=document.createElement('div');li.className='mk-liste';
  kurse(wi).forEach(function(c){var a=W[WK[wi]].a[c.a],b=document.createElement('button');b.className='mk-kurs';
    b.innerHTML='<b>'+a[0]+'</b><span>'+a[3]+'</span>';b.onclick=function(e){e.stopPropagation();geheZu(wi,c.j);};li.appendChild(b);});
  var x=document.createElement('button');x.className='mk-zu';x.textContent='Schließen';li.appendChild(x);
  h.appendChild(kopf);h.appendChild(li);K.appendChild(h);
  function auf(an){h.classList.toggle('auf',an);kopf.setAttribute('aria-expanded',an?'true':'false');}
  kopf.onclick=function(e){e.stopPropagation();if(D)tippD(h);else auf(!h.classList.contains('auf'));};
  x.onclick=function(e){e.stopPropagation();if(D)tippD(h,true);else auf(false);};
  h.auf=auf;return h;});
function zu(){HALB.forEach(function(h){h.auf(false);});hoch=false;anim=null;}

/* D: weiche Fahrt zwischen unten und Mitte. Zeit über window.__mkZeit steuerbar (für die Videoaufnahme Bild für Bild). */
var hoch=false,anim=null,pos=null;
function jetzt(){return window.__mkZeit!=null?window.__mkZeit:performance.now();}
function weich(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;}
function yUnten(){var d=wahl.querySelector('.duo').getBoundingClientRect(),kh=K.querySelector('.mk-kopf').offsetHeight;return d.bottom-kh-26;}
function yMitte(hk){var tb=h1.getBoundingClientRect();return Math.max(tb.bottom+10,(innerHeight-hk)/2);}
function offenHoehe(h){var war=h.classList.contains('auf');h.classList.add('auf');var hk=K.offsetHeight;if(!war)h.classList.remove('auf');return hk;}
function bewege(nach,dauer,fertig){if(pos==null)pos=nach;anim={von:pos,nach:nach,t0:jetzt(),dauer:dauer,fertig:fertig};lauf();}
function lauf(){if(!anim)return;var p=Math.min(1,(jetzt()-anim.t0)/anim.dauer);pos=anim.von+(anim.nach-anim.von)*weich(p);K.style.top=(pos+scrollY)+'px';
  if(p>=1){var f=anim.fertig;anim=null;if(f)f();}else if(window.__mkZeit==null)requestAnimationFrame(lauf);}
function tippD(h,schliessen){var offen=h.classList.contains('auf');
  if(!hoch){hoch=true;var hk=offenHoehe(h);bewege(yMitte(hk),650,function(){h.auf(true);});return;}
  h.auf(schliessen?false:!offen);
  if(!HALB.some(function(x){return x.classList.contains('auf');})){hoch=false;bewege(yUnten(),650);}
  else bewege(yMitte(K.offsetHeight),300);}
window.__mkD={lauf:lauf,tipp:function(i,s){tippD(HALB[i],s);}};

/* Lage: Naht = Mitte der beiden Welten; Höhe = Lichtkegel des Leuchtturms (Bildrahmen v≈0,18), mindestens unter dem Titel */
function rahmen(i){var t=document.querySelectorAll('.d-teil')[i];if(!t)return null;
  var m=[].slice.call(t.querySelectorAll('video,img')).filter(function(e){return getComputedStyle(e).objectFit==='cover';})[0];
  return m?m.getBoundingClientRect():null;}
function setze(){K.hidden=wahl.hidden;band.hidden=wahl.hidden;if(wahl.hidden){zu();return;}
  var d=wahl.querySelector('.duo').getBoundingClientRect(),r=rahmen(0),tb=h1.getBoundingClientRect();
  var naht=d.left+d.width/2,y=tb.bottom+8;   /* Runde 117: direkt unter dem Titel, Leuchtturm und Hochhaus bleiben frei */
  K.style.left=(naht+scrollX)+'px';
  if(D){if(!anim){pos=hoch?yMitte(K.offsetHeight):yUnten();K.style.top=(pos+scrollY)+'px';}return;}   /* D: unten oder Mitte */
  K.style.top=(y+scrollY)+'px';}
addEventListener('resize',setze);addEventListener('load',setze);setInterval(setze,400);setze();
new MutationObserver(setze).observe(wahl,{attributes:true,attributeFilter:['hidden']});
})();
