/* Flammen-Szene der Startseite (Storyboard Fassung 2, Simon 29.10.2026)
   Ablauf über den Scroll-Fortschritt p (0–1) des hohen Abschnitts:
   0–0,40 Lauf (Bildfolge) · 0,40–0,60 Kamerafahrt ins Handy und zurück · 0,62–1 echte App, kleine Flamme, Sprechblase, Knopf.
   Jeder Zustand hängt nur von p ab, deshalb läuft beim Zurückscrollen alles rückwärts.
   Fassung 2 (Simons Test 29.10.): lädt erst kurz vor der Szene, zeichnet aus vorentschlüsselten Bildern, App füllt das Handy randlos. */
(function(){
  var FR={quer:193,hoch:193,klein:241},K=6;
  var CFG={
    quer:{n:FR.quer,pfad:'bilder/szene/quer_leiste/l_',still:'bilder/szene/schluss_quer.jpg',w:16,h:9,handy:[.6315,.3984,.6904,.6126],zielH:.80,zielX:.64,zielY:.53},
    hoch:{n:FR.hoch,pfad:'bilder/szene/hoch_leiste/l_',still:'bilder/szene/schluss_hoch.jpg',w:9,h:16,handy:[.7656,.5453,.8978,.6898],zielH:.62,zielX:.5,zielY:.63}
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
  var DPR=Math.min(1.5,window.devicePixelRatio||1);
  var modus=null,C,leisten=[],ziel=0,jetzt=0,gezeigt=-1,letzterPunkt=-1,geladen=false;
  var kL=[],kZiel=0,kJetzt=0,kGezeigt=-1;

  /* Bildleisten laden; entschlüsselt bleiben nur die Leiste am aktuellen Bild und ihre zwei Nachbarn.
     Fassung 3 (Simons Test 29.10.: Chrome-Absturz „Fehlercode 11“, iPad ohne kleine Flamme): vorher lagen alle Leisten
     entschlüsselt im Speicher (rund 1,4 GB). */
  function holeLeisten(pfad,n){var ls=[];for(var i=0;i<Math.ceil(n/K);i++){var im=new Image();im.decoding='async';im.src=pfad+String(i+1).padStart(3,'0')+'.jpg';ls.push({img:im,bm:null,laeuft:false});}return ls;}
  function fenster(ls,i){var mitte=Math.floor(i/K);for(var j=0;j<ls.length;j++){var e=ls[j],nah=Math.abs(j-mitte)<=1;
      if(nah&&!e.bm&&!e.laeuft&&e.img.complete&&e.img.naturalWidth&&window.createImageBitmap){e.laeuft=true;(function(e){createImageBitmap(e.img).then(function(b){e.laeuft=false;if(e.weg){b.close&&b.close();e.weg=false;return;}e.bm=b;gezeigt=-1;kGezeigt=-1;}).catch(function(){e.laeuft=false});})(e);}
      if(!nah){if(e.bm){e.bm.close&&e.bm.close();e.bm=null;}if(e.laeuft)e.weg=true;}}}
  function male(c,el,ls,i){var e=ls[Math.floor(i/K)];if(!e)return false;fenster(ls,i);var q=e.bm||e.img;var w=e.bm?e.bm.width:e.img.naturalWidth,hh=e.bm?e.bm.height:e.img.naturalHeight;if(!w)return false;
    var fh=hh/K,r=i%K;c.drawImage(q,0,r*fh,w,fh,0,0,el.width,el.height);return true;}

  function lade(){var m=innerWidth<=760?'hoch':'quer';if(m===modus)return;modus=m;C=CFG[m];still.src=C.still;leisten=geladen?holeLeisten(C.pfad,C.n):[];gezeigt=-1;groesse();}
  function starteLaden(){if(geladen)return;geladen=true;leisten=holeLeisten(C.pfad,C.n);kL=holeLeisten('bilder/szene/klein_leiste/l_',FR.klein);}
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){if(es[0].isIntersecting){starteLaden();io.disconnect();}},{rootMargin:'150% 0px'});io.observe(sek);}else starteLaden();

  var B={x:0,y:0,w:0,h:0};
  function groesse(){var W=st.clientWidth,H=st.clientHeight,r=C.w/C.h;var bw=Math.min(W,H*r),bh=bw/r;if(bh>H){bh=H;bw=bh*r;}
    B={x:(W-bw)/2,y:(H-bh)/2+(modus==='quer'?H*.03:0),w:bw,h:bh};bu.style.width=bw+'px';bu.style.height=bh+'px';
    cv.width=Math.round(bw*DPR);cv.height=Math.round(bh*DPR);
    var kr=kcv.getBoundingClientRect();kcv.width=Math.round((kr.width||400)*DPR);kcv.height=Math.round((kr.height||225)*DPR);
    gezeigt=-1;kGezeigt=-1;stelle();}

  /* App füllt das Handy randlos: Breite 390 px wie ein iPhone, Höhe passend zum Bildschirm, kein Rand links, rechts oder oben */
  function appFuellen(){var w=rahmen.clientWidth,h=rahmen.clientHeight;if(!w||!h)return;var s=w/390;app.style.width='390px';app.style.height=(h/s)+'px';app.style.transformOrigin='0 0';app.style.transform='scale('+s+')';}

  function klemm(x,a,b){return Math.max(a,Math.min(b,x))}
  function weich(x){return x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2}
  var tabTimer=null;
  function stelle(){
    var r=sek.getBoundingClientRect(),lauf=sek.offsetHeight-st.clientHeight;var p=klemm(-(r.top-52)/Math.max(1,lauf),0,1);
    ziel=klemm(p/.40,0,1)*(C.n-1);
    var W=st.clientWidth,H=st.clientHeight,hb=C.handy;
    var hx=(hb[0]+hb[2])/2*B.w,hy=(hb[1]+hb[3])/2*B.h,hw0=(hb[2]-hb[0])*B.w,hh0=(hb[3]-hb[1])*B.h;
    var sCover=Math.max(1.25*W/(hw0*.86),1.25*H/(hh0*.9));
    var pz=weich(klemm((p-.40)/.12,0,1)),s=Math.pow(sCover,pz);
    var cx=(B.x+hx)+(W/2-(B.x+hx))*pz,cy=(B.y+hy)+(H/2-(B.y+hy))*pz;
    bu.style.transform='translate('+(cx-hx*s)+'px,'+(cy-hy*s)+'px) scale('+s+')';
    still.style.opacity=klemm((p-.40)/.03,0,1);bu.style.opacity=p<.52?1:0;
    var coverW=hw0*sCover,coverH=hh0*sCover,fH=H*C.zielH,fW=fH*(hw0/hh0),fX=W*C.zielX-fW/2,fY=H*C.zielY-fH/2;
    var pr=weich(klemm((p-.52)/.08,0,1));
    var tw=coverW+(fW-coverW)*pr,th=coverH+(fH-coverH)*pr,tcx=W/2+(fX+fW/2-W/2)*pr,tcy=H/2+(fY+fH/2-H/2)*pr;
    tel.style.width=tw+'px';tel.style.height=th+'px';tel.style.left=(tcx-tw/2)+'px';tel.style.top=(tcy-th/2)+'px';
    var sichtbar=p>=.515;tel.style.opacity=sichtbar?1:0;tel.classList.toggle('an',p>.62);if(sichtbar)appFuellen();
    splash.style.opacity=1-klemm((p-.60)/.03,0,1);
    titel.style.opacity=1-klemm((p-.40)/.06,0,1);hinw.style.opacity=1-klemm((p-.30)/.1,0,1);
    klein.style.opacity=klemm((p-.62)/.02,0,1);kZiel=klemm((p-.62)/.34,0,1)*(FR.klein-1);
    var k=-1;PUNKTE.forEach(function(q,i){if(p>=q.ab)k=i});
    blase.style.opacity=k>=0?1:0;blase.style.transform=k>=0?'none':'translateY(8px)';
    if(k!==letzterPunkt){letzterPunkt=k;if(k>=0){blase.innerHTML=PUNKTE[k].t;clearTimeout(tabTimer);var q=PUNKTE[k];tabTimer=setTimeout(function(){tab(q)},180);}}
    var pb=klemm((p-.92)/.03,0,1);knopf.style.opacity=pb;knopf.classList.toggle('an',pb>.9);
  }
  /* Reiter der App erst wechseln, wenn das Scrollen kurz ruht: verhindert Ruckeln in der App */
  function tab(q){try{var d=app.contentDocument;if(!d)return;var n=d.querySelector('.nav button[data-tab="'+q.tab+'"]');if(n)n.click();}catch(e){}}
  /* weiches Nachführen: das angezeigte Bild gleitet zum Zielbild, gezeichnet wird nur bei neuem Bild */
  function lauf(){
    var d=ziel-jetzt;if(Math.abs(d)>.01)jetzt+=d*.22;var i=Math.round(jetzt);if(i!==gezeigt&&male(ctx,cv,leisten,i))gezeigt=i;
    var e=kZiel-kJetzt;if(Math.abs(e)>.01)kJetzt+=e*.22;var j=Math.round(kJetzt);if(j!==kGezeigt&&male(kctx,kcv,kL,j))kGezeigt=j;
    requestAnimationFrame(lauf);}
  var tick=false;addEventListener('scroll',function(){if(tick)return;tick=true;requestAnimationFrame(function(){stelle();tick=false})},{passive:true});
  addEventListener('resize',function(){var m=modus;modus=null;lade();if(m===modus)groesse();});
  if('ResizeObserver' in window)new ResizeObserver(appFuellen).observe(rahmen);
  app.addEventListener('load',appFuellen);
  lade();requestAnimationFrame(lauf);
  window.__fsStelle=stelle;
})();
