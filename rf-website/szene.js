/* Flammen-Szene der Startseite (Storyboard Fassung 2, Simon 29.10.2026)
   Fassung 5 (Simon 01.11.2026): Kapitel statt Daumenkino. Der Finger wählt nur das Kapitel, das Kapitel läuft in eigenem Tempo ab,
   die Seite rastet an der Kapitelstelle ein, an einer Blase gestikuliert Sparky leise weiter. Schärfer: kleiner Sparky aus den Originalbildern (960 px),
   Zeichnen in doppelter Auflösung, beim Flug ins Handy liegt eine scharfe Bildschirm-Ebene über dem Film.
   Ablauf über den Scroll-Fortschritt p (0–1) des hohen Abschnitts:
   0–0,40 Lauf (Bildfolge) · 0,40–0,60 Kamerafahrt ins Handy und zurück · 0,62–1 echte App, kleine Flamme, Sprechblase, Knopf.
   Jeder Zustand hängt nur von p ab, deshalb läuft beim Zurückscrollen alles rückwärts.
   Fassung 2 (Simons Test 29.10.): lädt erst kurz vor der Szene, zeichnet aus vorentschlüsselten Bildern, App füllt das Handy randlos. */
(function(){
  var FR={quer:193,hoch:193,klein:241},K=6;
  var CFG={
    quer:{n:FR.quer,pfad:'bilder/szene/quer_leiste/l_',still:'bilder/szene/schluss_quer.jpg',w:16,h:9,handy:[.6315,.3984,.6904,.6126],zielH:.80,zielX:.64,zielY:.53},
    hoch:{n:FR.hoch,pfad:'bilder/szene/hoch_leiste/l_',still:'bilder/szene/schluss_hoch.jpg',w:9,h:16,handy:[.7656,.5453,.8978,.6898],zielH:.52,zielX:.5,zielY:.635} /* Simon 29.10. Gesprächsrunde: Handy kleiner und tiefer, Blase hat darüber Platz */
  };
  var PUNKTE=[
    {ab:.66,tab:'start',t:'In der App lernst du in <b>Lektionen von sechs Minuten</b>: Video, Aufgabe, Anker.'},
    {ab:.76,tab:'weg',t:'<b>Neun Bausteine</b>, und der nächste Schritt ist immer klein.'},
    {ab:.85,tab:'werk',t:'<b>Rechner und Steckbrief</b> mit deinen eigenen Zahlen.'},
    {ab:.92,tab:'start',t:'Klick dich selbst durch die App. <b>Die Testversion ist kostenlos.</b>'}
  ];
  var sek=document.getElementById('fs-szene');if(!sek)return;
  var st=sek.querySelector('.fs-sticky'),bu=document.getElementById('fs-buehne'),cv=document.getElementById('fs-canvas'),ctx=cv.getContext('2d'),still=document.getElementById('fs-still');
  var tel=document.getElementById('fs-tel'),rahmen=tel.querySelector('.rahmen'),app=document.getElementById('fs-app'),splash=document.getElementById('fs-splash');
  var klein=document.getElementById('fs-klein'),kcv=document.getElementById('fs-klein-cv'),kctx=kcv.getContext('2d');
  var blase=document.getElementById('fs-blase'),knopf=document.getElementById('fs-knopf'),titel=document.getElementById('fs-titel'),hinw=document.getElementById('fs-hinweis');
  var DPR=Math.min(2,window.devicePixelRatio||1);
  /* Scharfe Bildschirm-Ebene beim Flug ins Handy: derselbe Bildschirm wie der Startbildschirm der App, gezeichnet statt vergrößert */
  var scharf=document.createElement('div');scharf.className='fs-scharf';scharf.setAttribute('aria-hidden','true');scharf.innerHTML=splash.innerHTML;st.appendChild(scharf);
  var modus=null,C,leisten=[],ziel=0,jetzt=0,gezeigt=-1,letzterPunkt=-1,geladen=false;
  var kL=[],kZiel=0,kJetzt=0,kGezeigt=-1,blaseB=0;

  /* Bildleisten laden; entschlüsselt bleiben nur die Leiste am aktuellen Bild und ihre zwei Nachbarn.
     Fassung 3 (Simons Test 29.10.: Chrome-Absturz „Fehlercode 11“, iPad ohne kleine Flamme): vorher lagen alle Leisten
     entschlüsselt im Speicher (rund 1,4 GB). */
  function holeLeisten(pfad,n){var ls=[];for(var i=0;i<Math.ceil(n/K);i++){var im=new Image();im.decoding='async';im.src=pfad+String(i+1).padStart(3,'0')+'.jpg';ls.push({img:im,bm:null,laeuft:false});}return ls;}
  /* Fassung 4 (Gesprächsrunde 29.10., Absturz nach Sprung in der Vorschau nachgestellt): höchstens eine Leiste wird gleichzeitig
     entschlüsselt, die aktuelle zuerst. Vorher lief für jede überquerte Leiste eine eigene Entschlüsselung. */
  function fenster(ls,i){var mitte=Math.floor(i/K),belegt=false;
    for(var j=0;j<ls.length;j++){var e=ls[j];if(Math.abs(j-mitte)<=1){e.weg=false;if(e.laeuft)belegt=true;}else{if(e.bm){e.bm.close&&e.bm.close();e.bm=null;}if(e.laeuft)e.weg=true;}}
    if(belegt||!window.createImageBitmap)return;
    [mitte,mitte+1,mitte-1].some(function(j){var e=ls[j];if(!e||e.bm||e.laeuft||!e.img.complete||!e.img.naturalWidth)return false;e.laeuft=true;
      createImageBitmap(e.img).then(function(b){e.laeuft=false;if(e.weg){b.close&&b.close();e.weg=false;return;}e.bm=b;gezeigt=-1;kGezeigt=-1;}).catch(function(){e.laeuft=false});return true;});}
  /* Ohne fertige Leiste bleibt das letzte Bild stehen, statt die große Leiste beim Zeichnen nebenbei zu entschlüsseln.
     Nur das allererste Bild darf aus der rohen Leiste kommen, sonst bliebe die Fläche leer. */
  function male(c,el,ls,i){var e=ls[Math.floor(i/K)];if(!e)return false;fenster(ls,i);if(!e.bm&&window.createImageBitmap&&c.__hat)return false;
    var q=e.bm||e.img;var w=e.bm?e.bm.width:e.img.naturalWidth,hh=e.bm?e.bm.height:e.img.naturalHeight;if(!w)return false;
    var fh=hh/K,r=i%K;c.drawImage(q,0,r*fh,w,fh,0,0,el.width,el.height);c.__hat=true;return true;}

  function lade(){var m=innerWidth<=760?'hoch':'quer';if(m===modus)return;modus=m;C=CFG[m];still.src=C.still;leisten=geladen?holeLeisten(C.pfad,C.n):[];gezeigt=-1;groesse();}
  function starteLaden(){if(geladen)return;geladen=true;leisten=holeLeisten(C.pfad,C.n);kL=holeLeisten('bilder/szene/klein_leiste2/l_',FR.klein);}
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){if(es[0].isIntersecting){starteLaden();io.disconnect();}},{rootMargin:'150% 0px'});io.observe(sek);}else starteLaden();

  var B={x:0,y:0,w:0,h:0};
  function groesse(){var W=st.clientWidth,H=st.clientHeight,r=C.w/C.h;var bw=Math.min(W,H*r),bh=bw/r;if(bh>H){bh=H;bw=bh*r;}
    B={x:(W-bw)/2,y:(H-bh)/2+(modus==='quer'?H*.03:0),w:bw,h:bh};bu.style.width=bw+'px';bu.style.height=bh+'px';
    cv.width=Math.round(bw*DPR);cv.height=Math.round(bh*DPR);ctx.__hat=false;
    var kr=kcv.getBoundingClientRect();kcv.width=Math.round((kr.width||400)*DPR);kcv.height=Math.round((kr.height||225)*DPR);kctx.__hat=false;

    gezeigt=-1;kGezeigt=-1;stelle();}

  /* App füllt das Handy randlos: Breite 390 px wie ein iPhone, Höhe passend zum Bildschirm, kein Rand links, rechts oder oben */
  function appFuellen(){var w=rahmen.clientWidth,h=rahmen.clientHeight;if(!w||!h)return;var s=w/390;app.style.width='390px';app.style.height=(h/s)+'px';app.style.transformOrigin='0 0';app.style.transform='scale('+s+')';}

  function klemm(x,a,b){return Math.max(a,Math.min(b,x))}
  function weich(x){return x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2}
  var tabTimer=null;
  function zeige(p){
    ziel=klemm(p/.40,0,1)*(C.n-1);
    var W=st.clientWidth,H=st.clientHeight,hb=C.handy;
    var hx=(hb[0]+hb[2])/2*B.w,hy=(hb[1]+hb[3])/2*B.h,hw0=(hb[2]-hb[0])*B.w,hh0=(hb[3]-hb[1])*B.h;
    var sCover=Math.max(1.25*W/(hw0*.86),1.25*H/(hh0*.9));
    var pz=weich(klemm((p-.40)/.12,0,1)),s=Math.pow(sCover,pz);
    var cx=(B.x+hx)+(W/2-(B.x+hx))*pz,cy=(B.y+hy)+(H/2-(B.y+hy))*pz;
    bu.style.transform='translate('+(cx-hx*s)+'px,'+(cy-hy*s)+'px) scale('+s+')';
    still.style.opacity=klemm((p-.40)/.03,0,1);bu.style.opacity=p<.52?1:0;
    var coverW=hw0*sCover,coverH=hh0*sCover,fH=H*C.zielH,fW=fH*(hw0/hh0),fX=W*C.zielX-fW/2,fY=H*C.zielY-fH/2;
    /* Simon 29.10. Gesprächsrunde: am Mac endet die Blase 40 px vor dem Handy (gleiche Maße wie das Handy, linker Rand wie in szene.css) */
    if(modus==='quer'){var bl=Math.min(56,Math.max(24,innerWidth*.04)),bb=Math.round(Math.max(220,Math.min(620,fX-bl-40)));if(bb!==blaseB){blaseB=bb;blase.style.width=bb+'px';}}else if(blaseB){blaseB=0;blase.style.width='';}
    var pr=weich(klemm((p-.52)/.08,0,1));
    var tw=coverW+(fW-coverW)*pr,th=coverH+(fH-coverH)*pr,tcx=W/2+(fX+fW/2-W/2)*pr,tcy=H/2+(fY+fH/2-H/2)*pr;
    tel.style.width=tw+'px';tel.style.height=th+'px';tel.style.left=(tcx-tw/2)+'px';tel.style.top=(tcy-th/2)+'px';
    if(p>=.40&&p<.53){var sw=hw0*s,sh=hh0*s,ein=sw*.032;scharf.style.left=(cx-sw/2+ein)+'px';scharf.style.top=(cy-sh/2+ein)+'px';scharf.style.width=(sw-2*ein)+'px';scharf.style.height=(sh-2*ein)+'px';
      scharf.style.opacity=klemm((p-.40)/.025,0,1)*(1-klemm((p-.515)/.015,0,1));}else scharf.style.opacity=0;
    var sichtbar=p>=.515;tel.style.opacity=sichtbar?1:0;tel.classList.toggle('an',p>.62);if(sichtbar)appFuellen();
    splash.style.opacity=1-klemm((p-.60)/.03,0,1);
    titel.style.opacity=1-klemm((p-.40)/.06,0,1);hinw.style.opacity=1-klemm((p-.30)/.1,0,1);
    klein.style.opacity=klemm((p-.62)/.02,0,1);kBasis=klemm((p-.62)/.34,0,1)*(FR.klein-1);kZiel=kBasis;
    var k=-1;PUNKTE.forEach(function(q,i){if(p>=q.ab)k=i});
    blase.style.opacity=k>=0?1:0;blase.style.transform=k>=0?'none':'translateY(8px)';
    if(k!==letzterPunkt){letzterPunkt=k;if(k>=0){blase.innerHTML='<span>'+PUNKTE[k].t+'</span>';clearTimeout(tabTimer);var q=PUNKTE[k];tabTimer=setTimeout(function(){tab(q)},180);}}
    var pb=klemm((p-.92)/.03,0,1);knopf.style.opacity=pb;knopf.classList.toggle('an',pb>.9);
  }
  /* ---------- Kapitel: Fingerweg wählt das Kapitel, das Kapitel spielt in eigenem Tempo ---------- */
  var S=[0,.40,.66,.76,.85,.96];            /* Anfang · Lauf fertig · App + Blase 1 · Blase 2 · Blase 3 · Testversion + Knopf */
  var TEMPO=[0,5.5,6.9,10,10,9];            /* Sekunden je Fortschrittseinheit: Lauf 2,2 s, Kamerafahrt 1,8 s, Blasen je 1 s */
  var cur=0,pv=0,tw=null,kBasis=0,rastT=null,schnapp=0,richtung=0,letzterY=scrollY,ruhig=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function roh(){var r=sek.getBoundingClientRect(),l=sek.offsetHeight-st.clientHeight;return {p:-(r.top-52)/Math.max(1,l),oben:r.top+scrollY,lauf:l};}
  function geheZu(i){i=klemm(i,0,S.length-1);if(i===cur)return;var sprung=Math.abs(i-cur)>1;cur=i;
    if(ruhig){pv=S[i];tw=null;zeige(pv);return;}
    if(sprung)pv=S[i>0&&S[i]>pv?i-1:Math.min(i+1,S.length-1)];
    var d=Math.min(2.4,Math.abs(S[i]-pv)*TEMPO[Math.max(1,S[i]>pv?i:i+1)]||.6);tw={von:pv,nach:S[i],t0:performance.now(),d:Math.max(.35,d)*1000};}
  function stelle(){var R=roh(),p=R.p;
    if(performance.now()<schnapp){letzterY=scrollY;if(!tw)zeige(pv);return;}
    if(scrollY!==letzterY){richtung=scrollY>letzterY?1:-1;letzterY=scrollY;}
    var ch=cur;while(ch<S.length-1&&p>S[ch]+.22*(S[ch+1]-S[ch]))ch++;while(ch>0&&p<S[ch]-.22*(S[ch]-S[ch-1]))ch--;
    if(p<=0)ch=0;if(ch!==cur)geheZu(ch);
    /* Einrasten: ruht der Finger in der Szene, gleitet die Seite auf die Kapitelstelle; ein kleiner Wisch zählt als ganzes Kapitel */
    clearTimeout(rastT);
    if(p>.004&&p<S[S.length-1]+.01){rastT=setTimeout(function(){var Q=roh();if(Q.p<=.004||Q.p>=S[S.length-1]+.01)return;
      /* nur in Scrollrichtung weiterschalten; liegt die Kapitelstelle noch vor dem Finger, gleitet die Seite einfach dorthin */
      if(richtung>0&&Q.p>S[cur]+.006&&cur<S.length-1)geheZu(cur+1);else if(richtung<0&&Q.p<S[cur]-.006&&cur>0)geheZu(cur-1);
      var y=Q.oben-52+S[cur]*Q.lauf;if(Math.abs(y-scrollY)>3){schnapp=performance.now()+900;scrollTo({top:y,behavior:ruhig?'auto':'smooth'});}},200);}
    if(!tw)zeige(pv);}
  /* Reiter der App erst wechseln, wenn das Scrollen kurz ruht: verhindert Ruckeln in der App */
  function tab(q){try{var d=app.contentDocument;if(!d)return;var n=d.querySelector('.nav button[data-tab="'+q.tab+'"]');if(n)n.click();}catch(e){}}
  /* weiches Nachführen: das angezeigte Bild gleitet zum Zielbild, gezeichnet wird nur bei neuem Bild */
  function lauf(){
    var jetztT=performance.now();
    if(tw){var t=(jetztT-tw.t0)/tw.d;if(t>=1){pv=tw.nach;tw=null;}else pv=tw.von+(tw.nach-tw.von)*weich(t);zeige(pv);}
    /* An einer Blase gestikuliert Sparky leise weiter: sanftes Hin und Her über die letzten Bilder vor der Ruhepose */
    else if(cur>=2&&!ruhig){kZiel=Math.max(0,kBasis-9*(.5-.5*Math.cos(jetztT/1000*2*Math.PI/2.6)));}
    /* Großer Sprung (schnelles Wischen, Sprungmarke): direkt ans Ziel statt durch alle Zwischenbilder gleiten */
    var d=ziel-jetzt;if(Math.abs(d)>K*2)jetzt=ziel;else if(Math.abs(d)>.01)jetzt+=d*.22;var i=Math.round(jetzt);if(i!==gezeigt&&male(ctx,cv,leisten,i))gezeigt=i;
    var e=kZiel-kJetzt;if(Math.abs(e)>K*2)kJetzt=kZiel;else if(Math.abs(e)>.01)kJetzt+=e*.22;var j=Math.round(kJetzt);if(j!==kGezeigt&&male(kctx,kcv,kL,j))kGezeigt=j;
    requestAnimationFrame(lauf);}
  var tick=false;addEventListener('scroll',function(){if(tick)return;tick=true;requestAnimationFrame(function(){stelle();tick=false})},{passive:true});
  addEventListener('resize',function(){var m=modus;modus=null;lade();if(m===modus)groesse();});
  if('ResizeObserver' in window)new ResizeObserver(appFuellen).observe(rahmen);
  app.addEventListener('load',appFuellen);
  lade();requestAnimationFrame(lauf);
  window.__fsStelle=stelle;
})();
