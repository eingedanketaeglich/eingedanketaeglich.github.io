/* Flammen-Szene der Startseite
   Fassung 7 (Simon 05.11.2026): Die Szene läuft von selbst ab, sobald sie im Bild steht – wie die Produktvideos bei Apple.
   Vorher hing jeder Zustand am Scrollen; wer an der falschen Stelle stehen blieb, sah ein halbes Zwischenbild.
   Ablauf, einmal, ohne Scrollen:
     1. Lauf: echtes Video (bilder/szene/lauf_hoch.mp4 bzw. lauf_quer.mp4, aus den freigestellten Kling-Bildern, ohne Ton, ohne Bedienelemente)
     2. Kamerafahrt ins Handy (wie bisher, jetzt zeitgesteuert)
     3. Echte App im Handy, kleine Flamme spricht, die Sprechblasen wechseln von selbst, am Ende der Knopf
   Grundregeln wie bei Apple: muted + playsinline (sonst kein Autoplay am iPhone), Start erst bei 60 % Sichtbarkeit, Video lädt erst kurz vorher,
   außerhalb des Bildes wird pausiert. Rückweg: Wer über die Szene hinaus nach oben scrollt, sieht sie beim nächsten Mal wieder von vorn;
   wer nach unten weiterscrollt, findet beim Zurückkommen den fertigen Schluss, nie ein Zwischenbild.
   Rückfall: Blockiert das Gerät das Abspielen (iPhone-Stromsparmodus) oder fehlt das Video, steht sofort das Schlussbild des Laufs da
   und es geht mit der Kamerafahrt weiter. Weniger Bewegung (Systemeinstellung): gleich der Schlusszustand.
   Tippt jemand in die App, hören die Sprechblasen auf zu wechseln und der Schluss steht. */
(function(){
  var KLEIN_N=241,K=6;
  /* Simon 06.11.: Handy im Schlussbild größer (Mac 0,80→0,90, Handy 0,52→0,58 der Bühnenhöhe) */
  var CFG={
    quer:{video:'bilder/szene/lauf_quer.mp4',poster:'bilder/szene/lauf_quer_poster.jpg',still:'bilder/szene/schluss_quer.jpg',w:16,h:9,handy:[.6315,.3984,.6904,.6126],zielH:.90,zielX:.64,zielY:.53},
    hoch:{video:'bilder/szene/lauf_hoch.mp4',poster:'bilder/szene/lauf_hoch_poster.jpg',still:'bilder/szene/schluss_hoch.jpg',w:9,h:16,handy:[.7656,.5453,.8978,.6898],zielH:.58,zielX:.5,zielY:.605}
  };
  var PUNKTE=[
    {ab:.66,tab:'start',t:'In der App lernst du in <b>Lektionen von sechs Minuten</b>: Video, Aufgabe, Anker.'},
    {ab:.76,tab:'weg',t:'<b>Neun Bausteine</b>, und der nächste Schritt ist immer klein.'},
    {ab:.85,tab:'werk',t:'<b>Rechner und Steckbrief</b> mit deinen eigenen Zahlen.'},
    {ab:.92,tab:'start',t:'Klick dich selbst durch die App. <b>Die Testversion ist kostenlos.</b>'}
  ];
  /* Zeitplan nach dem Lauf: [von p, nach p, Sekunden, weich?]. Die Blasen stehen je gut 3 Sekunden, die kleine Flamme spricht dabei durch. */
  /* Simons Durchsicht 05.11.: das Verkleinern nach dem Flug wirkte wie ein Sprung. Hinein und heraus jetzt getrennt und länger. */
  var PLAN=[[.40,.52,1.8,false],[.52,.62,1.6,true],[.62,.96,14,false]];
  var ENDE=.96;

  var sek=document.getElementById('fs-szene');if(!sek)return;
  var st=sek.querySelector('.fs-sticky'),bu=document.getElementById('fs-buehne'),vid=document.getElementById('fs-video'),still=document.getElementById('fs-still');
  var tel=document.getElementById('fs-tel'),rahmen=tel.querySelector('.rahmen'),app=document.getElementById('fs-app'),splash=document.getElementById('fs-splash');
  var klein=document.getElementById('fs-klein'),kcv=document.getElementById('fs-klein-cv'),kctx=kcv.getContext('2d');
  var blase=document.getElementById('fs-blase'),knopf=document.getElementById('fs-knopf'),titel=document.getElementById('fs-titel');
  var DPR=Math.min(2,window.devicePixelRatio||1),ruhig=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var scharf=document.createElement('div');scharf.className='fs-scharf';scharf.setAttribute('aria-hidden','true');scharf.innerHTML=splash.innerHTML;st.appendChild(scharf);
  var modus=null,C,p=0,letzterPunkt=-1,blaseB=0,kL=[],kZiel=0,kJetzt=0,kGezeigt=-1,geladen=false;
  /* Zustand: 'warten' (vor dem Start) · 'lauf' (Video) · 'fahrt' (Zeitplan) · 'fertig' */
  var zustand='warten',planI=0,planT0=0,sichtbar=false;

  /* ---------- kleine Flamme neben der Blase: Bildleisten wie bisher, nur die aktuelle Leiste entschlüsselt ---------- */
  function holeLeisten(pfad,n){var ls=[];for(var i=0;i<Math.ceil(n/K);i++){(function(e){ls.push(e);fetch(e.url).then(function(r){return r.blob();}).then(function(b){e.blob=b;kGezeigt=-1;}).catch(function(){});})({url:pfad+String(i+1).padStart(3,'0')+'.jpg',blob:null,bm:null,laeuft:false});}return ls;}
  function fenster(ls,i){var mitte=Math.floor(i/K),belegt=false;
    for(var j=0;j<ls.length;j++){var e=ls[j];if(Math.abs(j-mitte)<=1){e.weg=false;if(e.laeuft)belegt=true;}else{if(e.bm){e.bm.close&&e.bm.close();e.bm=null;}if(e.laeuft)e.weg=true;}}
    if(belegt||!window.createImageBitmap)return;
    [mitte,mitte+1,mitte-1].some(function(j){var e=ls[j];if(!e||e.bm||e.laeuft||!e.blob)return false;e.laeuft=true;
      createImageBitmap(e.blob).then(function(b){e.laeuft=false;if(e.weg){b.close&&b.close();e.weg=false;return;}e.bm=b;kGezeigt=-1;}).catch(function(){e.laeuft=false});return true;});}
  function male(c,el,ls,i){var e=ls[Math.floor(i/K)];if(!e)return false;fenster(ls,i);if(!e.bm)return false;var q=e.bm,w=q.width,hh=q.height;if(!w)return false;
    var fh=hh/K;c.drawImage(q,0,(i%K)*fh,w,fh,0,0,el.width,el.height);return true;}

  /* ---------- Laden: Video erst kurz vor der Szene ---------- */
  function lade(){var m=innerWidth<=760?'hoch':'quer';if(m===modus)return;modus=m;C=CFG[m];still.src=C.still;vid.poster=C.poster;
    if(geladen){var t=vid.currentTime;vid.src=C.video;vid.load();if(zustand==='lauf'){try{vid.currentTime=t}catch(e){}spiele();}}groesse();}
  function starteLaden(){if(geladen)return;geladen=true;vid.preload='auto';vid.src=C.video;vid.load();kL=holeLeisten('bilder/szene/klein_leiste2/l_',KLEIN_N);}

  var B={x:0,y:0,w:0,h:0};
  /* Simon 05.11. (Vorbild Apple): Die Bühne füllt den Bildschirm bis an beide Ränder, Sparky läuft vom Bildschirmrand herein.
     Vorher passte sie hinein (contain) und ließ links und rechts Weiß; jetzt deckt sie ab (cover), oben und unten liegt im Clip ohnehin Weiß. */
  function groesse(){var W=st.clientWidth,H=st.clientHeight,r=C.w/C.h;var bw=Math.max(W,H*r),bh=bw/r;if(bh<H){bh=H;bw=bh*r;}
    B={x:(W-bw)/2,y:(H-bh)/2+(modus==='quer'?H*.03:0),w:bw,h:bh};bu.style.width=bw+'px';bu.style.height=bh+'px';
    var kr=kcv.getBoundingClientRect();kcv.width=Math.round((kr.width||400)*DPR);kcv.height=Math.round((kr.height||225)*DPR);kGezeigt=-1;zeige(p);}

  function appFuellen(){var w=rahmen.clientWidth,h=rahmen.clientHeight;if(!w||!h)return;var s=w/390;app.style.width='390px';app.style.height=(h/s)+'px';app.style.transformOrigin='0 0';app.style.transform='scale('+s+')';}
  function klemm(x,a,b){return Math.max(a,Math.min(b,x))}
  function weich(x){return x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2}
  var tabTimer=null;

  /* Bild für einen Fortschritt p (0–1). Unverändert aus Fassung 6, nur ohne Bildfolge für den Lauf: bis .40 zeigt das Video. */
  function zeige(p){
    var W=st.clientWidth,H=st.clientHeight,hb=C.handy;
    var hx=(hb[0]+hb[2])/2*B.w,hy=(hb[1]+hb[3])/2*B.h,hw0=(hb[2]-hb[0])*B.w,hh0=(hb[3]-hb[1])*B.h;
    var sCover=Math.max(1.25*W/(hw0*.86),1.25*H/(hh0*.9));
    var pz=weich(klemm((p-.40)/.12,0,1)),s=Math.pow(sCover,pz);
    var cx=(B.x+hx)+(W/2-(B.x+hx))*pz,cy=(B.y+hy)+(H/2-(B.y+hy))*pz;
    bu.style.transform='translate('+(cx-hx*s)+'px,'+(cy-hy*s)+'px) scale('+s+')';
    still.style.opacity=klemm((p-.40)/.03,0,1);bu.style.opacity=p<.52?1:0;
    var coverW=hw0*sCover,coverH=hh0*sCover,fH=H*C.zielH,fW=fH*(hw0/hh0),fX=W*C.zielX-fW/2,fY=H*C.zielY-fH/2;
    if(modus==='quer'){var bl=Math.min(56,Math.max(24,innerWidth*.04)),bb=Math.round(Math.max(220,Math.min(620,fX-bl-40)));if(bb!==blaseB){blaseB=bb;blase.style.width=bb+'px';}}else if(blaseB){blaseB=0;blase.style.width='';}
    var pr=weich(klemm((p-.52)/.08,0,1));
    var tw=coverW+(fW-coverW)*pr,th=coverH+(fH-coverH)*pr,tcx=W/2+(fX+fW/2-W/2)*pr,tcy=H/2+(fY+fH/2-H/2)*pr;
    tel.style.width=tw+'px';tel.style.height=th+'px';tel.style.left=(tcx-tw/2)+'px';tel.style.top=(tcy-th/2)+'px';
    if(p>=.40&&p<.53){var sw=hw0*s,sh=hh0*s,ein=sw*.032;scharf.style.left=(cx-sw/2+ein)+'px';scharf.style.top=(cy-sh/2+ein)+'px';scharf.style.width=(sw-2*ein)+'px';scharf.style.height=(sh-2*ein)+'px';
      scharf.style.opacity=klemm((p-.40)/.025,0,1)*(1-klemm((p-.515)/.015,0,1));}else scharf.style.opacity=0;
    var zu=p>=.515;tel.style.opacity=zu?1:0;tel.classList.toggle('an',p>.62);if(zu)appFuellen();
    splash.style.opacity=1-klemm((p-.60)/.03,0,1);
    titel.style.opacity=1-klemm((p-.40)/.06,0,1);
    klein.style.opacity=klemm((p-.62)/.02,0,1);kZiel=klemm((p-.62)/.34,0,1)*(KLEIN_N-1);
    var k=-1;PUNKTE.forEach(function(q,i){if(p>=q.ab)k=i});
    blase.style.opacity=k>=0?1:0;blase.style.transform=k>=0?'none':'translateY(8px)';
    if(k!==letzterPunkt){letzterPunkt=k;if(k>=0){blase.innerHTML='<span>'+PUNKTE[k].t+'</span>';clearTimeout(tabTimer);var q=PUNKTE[k];tabTimer=setTimeout(function(){tab(q)},180);}else blase.innerHTML='';}
    var pb=klemm((p-.92)/.03,0,1);knopf.style.opacity=pb;knopf.classList.toggle('an',pb>.9);
  }
  function tab(q){if(appAngefasst)return;try{var d=app.contentDocument;if(!d)return;var n=d.querySelector('.nav button[data-tab="'+q.tab+'"]');if(n)n.click();}catch(e){}}

  /* ---------- Regie: Zeit statt Scrollweg ---------- */
  function setze(np){p=np;zeige(p);}
  function spiele(){var v=vid.play();if(v&&v.catch)v.catch(function(){if(zustand==='lauf')fahrtStarten();});}
  function starten(){if(zustand!=='warten')return;starteLaden();
    if(ruhig){fertig();return;}
    zustand='lauf';setze(0);
    if(!vid.src||vid.error){fahrtStarten();return;}
    try{vid.currentTime=0}catch(e){}spiele();}
  function fahrtStarten(){if(zustand==='fahrt'||zustand==='fertig')return;zustand='fahrt';planI=0;planT0=performance.now();
    /* Das Video bleibt auf seinem letzten Bild stehen, darüber blendet das scharfe Schlussbild ein: kein Sprung */
    setze(.40);}
  function fertig(){zustand='fertig';setze(ENDE);}
  function zurueck(){zustand='warten';vid.pause();try{vid.currentTime=0}catch(e){}appAngefasst=false;letzterPunkt=-2;setze(0);}
  vid.addEventListener('ended',fahrtStarten);
  vid.addEventListener('error',function(){if(zustand==='lauf')fahrtStarten();});
  /* Hängt das Video (Netz), nicht ewig warten: nach 12 s ohne Start geht es mit dem Schlussbild weiter.
     Simon 06.11.: Es hing auch mitten im Lauf. Steht das Bild 2,5 s still, obwohl das Video laufen soll, geht es ebenfalls weiter. */
  var waechter=0,letzteZeit=-1,stehtSeit=0;
  function lauf(){var jetzt=performance.now();
    if(zustand==='lauf'){if(!waechter)waechter=jetzt;if(jetzt-waechter>12000&&vid.currentTime<.5)fahrtStarten();
      if(sichtbar&&vid.currentTime>.3){if(vid.currentTime!==letzteZeit){letzteZeit=vid.currentTime;stehtSeit=jetzt;}else if(jetzt-stehtSeit>2500)fahrtStarten();}
      if(vid.duration&&vid.currentTime>=vid.duration-.05)fahrtStarten();}
    else{waechter=0;letzteZeit=-1;}
    if(zustand==='fahrt'){var z=PLAN[planI],t=(jetzt-planT0)/(z[2]*1000);
      if(t>=1){setze(z[1]);planI++;planT0=jetzt;if(planI>=PLAN.length)zustand='fertig';}
      else setze(z[0]+(z[1]-z[0])*(z[3]?weich(t):t));}
    var e=kZiel-kJetzt;if(Math.abs(e)>K*2)kJetzt=kZiel;else if(Math.abs(e)>.01)kJetzt+=e*.22;var j=Math.round(kJetzt);if(j!==kGezeigt&&male(kctx,kcv,kL,j))kGezeigt=j;
    requestAnimationFrame(lauf);}

  /* Wer in der App tippt, bestimmt selbst: Blasen bleiben stehen, Schluss mit Knopf */
  var appAngefasst=false;
  function angefasst(){if(appAngefasst)return;appAngefasst=true;if(zustand==='fahrt'||zustand==='lauf'){zustand='fertig';vid.pause();setze(ENDE);}}
  app.addEventListener('load',function(){appFuellen();try{var d=app.contentDocument;d.addEventListener('pointerdown',angefasst,true);d.addEventListener('touchstart',angefasst,{capture:true,passive:true});}catch(e){}});

  /* ---------- Sichtbarkeit: Start erst, wenn die Szene fast ganz im Bild steht (Simon 06.11.: bei 60 % lief Sparky am Handy schon, bevor man ihn sah), Pause außerhalb, Rückweg nach oben setzt zurück ---------- */
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(es){if(es[0].isIntersecting)starteLaden();},{rootMargin:'150% 0px'}).observe(sek);
    new IntersectionObserver(function(es){var e=es[0];sichtbar=e.intersectionRatio>0;
      if(e.intersectionRatio>=.95){if(zustand==='warten')starten();else if(zustand==='lauf')spiele();}
      else if(!sichtbar){
        if(zustand==='lauf')vid.pause();
        if(e.boundingClientRect.top>0){if(zustand!=='warten')zurueck();}   /* Szene liegt unter dem Bild: nach oben verlassen, nächstes Mal von vorn */
        else if(zustand==='lauf'||zustand==='fahrt')fertig();              /* nach unten verlassen: beim Zurückkommen steht der Schluss */
      }},{threshold:[0,.6,.95]}).observe(st);
  }else{starteLaden();starten();}

  addEventListener('resize',function(){var m=modus;modus=null;lade();if(m===modus)groesse();});
  if('ResizeObserver' in window)new ResizeObserver(appFuellen).observe(rahmen);
  lade();setze(0);requestAnimationFrame(lauf);
  window.__fsZustand=function(){return {zustand:zustand,p:p,video:vid.currentTime,dauer:vid.duration,papier:vid.paused}};
})();
