/* Leben am Hochhaus (Simon 13.11.2026, Runden 89–95): Autos und Menschen bewegen sich eigenständig nach Regeln, Dichte „ruhig“.
   Niemand fährt eine feste Schleife: Abstand halten, Tempo streut, Pausen, eigene Ziele. Figuren aus Blender (gleiche Schrägsicht, Abendlicht).
   Nachts: dunkler, mit Scheinwerfern und Rücklichtern, die auf die Straße leuchten.
   Aufruf: rfLeben(n-bild-Element). */
(function(){
var P='bilder/preise/leben/',SIN_E=Math.sin(38*Math.PI/180),FA=64,FM=48,OBEN=860;
var DICHTE={autoAbstand:6,menschen:8};   /* Runde 97: Simon möchte etwa fünf Autos gleichzeitig */
function ppm(y){return 6.4+(y-930)*0.009;}           /* Pixel je Meter, gemessen an den Fotoautos */
function weg(p){var t=[],g=0;for(var i=1;i<p.length;i++){var l=Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]);t.push([p[i-1],p[i],l]);g+=l;}return{t:t,l:g};}
function ort(w,s){for(var i=0;i<w.t.length;i++){var a=w.t[i];if(s<=a[2]){var f=s/a[2];return{x:a[0][0]+(a[1][0]-a[0][0])*f,y:a[0][1]+(a[1][1]-a[0][1])*f,dx:a[1][0]-a[0][0],dy:a[1][1]-a[0][1]};}s-=a[2];}var b=w.t[w.t.length-1];return{x:b[1][0],y:b[1][1],dx:b[1][0]-b[0][0],dy:b[1][1]-b[0][1]};}
/* Nur freie Spuren: Im Bild stehen links und rechts Autos fest auf der Fahrbahn. Autos kommen hinter dem Hochhaus hervor und verschwinden hinter dem Haus links. */
var WEGE=[[[weg([[470,926],[700,934],[872,937],[965,912]])],9.5,0,1e9],
          [[weg([[965,926],[872,949],[700,945],[470,940]]),weg([[965,926],[872,949],[700,945],[600,947],[562,962],[553,995],[582,1040],[616,1102]])],9,0.4,260]];
var FARBEN=['weiss','schwarz','silber','blau','rot','grau'],JACKEN=['dunkel','beige','blau','rot'];
var KNOTEN=[[980,1017],[650,975],[720,1000],[800,1040],[760,1070],[700,1062],[900,1048],[1000,1045],[1060,1062],[1080,1020],[1110,975],[1095,925],[1150,950],[1170,1000],[1060,905]];
var TORE=[[640,1105],[850,1105],[1000,1105],[1060,880]],TURM=[878,1042,1014];
/* Eingang im Sockel (gemessen 13.11.): Türöffnung x 967–993, y 983–1008, davor ein freier Weg zum Platz */
var TUER={x0:967,x1:993,y0:983,y1:1008},VOR_TUER=[980,1017],DRIN=[980,1004];
function frei(a,b){if((a[0]===VOR_TUER[0]&&a[1]===VOR_TUER[1])||(b[0]===VOR_TUER[0]&&b[1]===VOR_TUER[1]))return true;for(var i=0;i<=10;i++){var x=a[0]+(b[0]-a[0])*i/10,y=a[1]+(b[1]-a[1])*i/10;if(x>TURM[0]-4&&x<TURM[1]+4&&y<TURM[2]+4)return false;}return true;}
function nachbarn(p){return KNOTEN.filter(function(k){var d=Math.hypot(k[0]-p[0],k[1]-p[1]);return d>30&&d<190&&frei(p,k);});}
var bild={};
function lade(n,dat){if(bild[n])return;var i=new Image();i.decoding='async';i.src=P+(dat||n+'.webp');bild[n]=i;}
FARBEN.forEach(function(f){lade('auto_'+f+'_l');lade('auto_'+f+'_k');});JACKEN.forEach(function(j){lade('mensch_'+j);});
lade('deckel_tag');lade('deckel_nacht');

window.rfLeben=function(nb,saat){
  var grund=nb.querySelector('.hh-grund');if(!grund)return;
  var c=document.createElement('canvas');c.className='hh-leben';c.width=1920;c.height=1080;grund.insertAdjacentElement('afterend',c);
  var g=c.getContext('2d'),a0=saat||((Math.random()*1e9)|0);
  var zufall=(function(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};})(a0);
  function z(a,b){return a+(b-a)*zufall();}
  var spuren=WEGE.map(function(w){return{wege:w[0],v:w[1],teil:w[2],gemeinsam:w[3],naechster:z(0,DICHTE.autoAbstand)};});
  var autos=[],leute=[],tuer={auf:0,offen:0};   /* offen: Sekunden, die die Tür noch offen bleibt */
  function neuerMensch(start){var ausTuer=!start&&zufall()<0.4,p=ausTuer?DRIN:((!start||zufall()<0.4)?TORE[Math.floor(zufall()*TORE.length)]:KNOTEN[Math.floor(zufall()*KNOTEN.length)]);if(ausTuer){tuer.offen=2.2;}
    return{x:p[0],y:p[1],ziel:ausTuer?VOR_TUER.slice():null,blass:0,v:z(1.15,1.5),pause:start?z(0,4):0,jacke:JACKEN[Math.floor(zufall()*4)],phase:z(0,8),schritte:Math.floor(z(3,9)),richt:0,weg:false};}
  for(var i=0;i<DICHTE.menschen;i++)leute.push(neuerMensch(true));
  function nacht(){return document.documentElement.getAttribute('data-modus')==='dunkel';}
  /* Das Bild darunter wechselt seite.js selbst auf die Nachtfassung (bilder/nacht/preise/), passend zu Wolken und Skyline */
  function schritt(dt){
    spuren.forEach(function(s){s.naechster-=dt;
      var leer=autos.filter(function(a){return a.s===s&&a.pos<40;}).length===0;
      if(s.naechster<=0&&leer){var w=s.wege.length>1&&zufall()<s.teil?s.wege[1]:s.wege[0],wu=s.v*z(0.85,1.12);
        autos.push({s:s,w:w,pos:0,v:wu,wunsch:wu,farbe:FARBEN[Math.floor(zufall()*6)],form:zufall()<0.3?'k':'l'});s.naechster=Math.max(2.5,-Math.log(1-zufall())*DICHTE.autoAbstand);}});
    autos.forEach(function(a){var o=ort(a.w,a.pos),m=ppm(o.y),vor=null;
      autos.forEach(function(b){if(b!==a&&b.s===a.s&&b.pos>a.pos&&(b.w===a.w||b.pos<a.s.gemeinsam)&&(!vor||b.pos<vor.pos))vor=b;});
      var ziel=a.wunsch;if(vor){var lu=(vor.pos-a.pos)/m-4.6,si=2.5+a.v*1.1;if(lu<si)ziel=Math.max(0,Math.min(vor.v,a.wunsch*(lu-1)/si));}
      a.v+=Math.max(-4.5,Math.min(1.8,ziel-a.v))*dt*1.6;if(a.v<0)a.v=0;a.pos+=a.v*m*dt;});
    autos=autos.filter(function(a){return a.pos<a.w.l;});
    tuer.offen=Math.max(0,tuer.offen-dt);tuer.auf+=((tuer.offen>0?1:0)-tuer.auf)*Math.min(1,dt*4);
    leute.forEach(function(p){if(p.pause>0){p.pause-=dt;return;}
      if(p.hinein){tuer.offen=Math.max(tuer.offen,0.8);p.y-=p.v*ppm(p.y)*dt*0.6;p.richt=Math.PI/2;p.phase+=dt*p.v*5.3;p.blass+=dt*1.6;   /* geht durch die Tür und verschwindet in der Lobby */
        if(p.blass>=1){Object.assign(p,neuerMensch(false));p.hinein=false;p.pause=z(4,14);}return;}
      if(!p.ziel){if(p.schritte<=0){if(zufall()<0.5){p.ziel=VOR_TUER.slice();p.zurTuer=true;}else{p.ziel=TORE.slice().sort(function(a,b){return Math.hypot(a[0]-p.x,a[1]-p.y)-Math.hypot(b[0]-p.x,b[1]-p.y);})[0];p.weg=true;}}
        else{var n=nachbarn([p.x,p.y]);if(!n.length)n=KNOTEN;p.ziel=n[Math.floor(zufall()*n.length)].slice();p.ziel[0]+=z(-14,14);p.ziel[1]+=z(-8,8);p.schritte--;}}
      var dx=p.ziel[0]-p.x,dy=p.ziel[1]-p.y,d=Math.hypot(dx,dy),sp=p.v*ppm(p.y)*dt;p.richt=Math.atan2(-dy/SIN_E,dx);
      if(d<=sp&&p.zurTuer){p.x=p.ziel[0];p.y=p.ziel[1];p.ziel=null;p.zurTuer=false;tuer.offen=1.6;p.hinein=true;p.pause=0.5;return;}
      if(d<=sp){p.x=p.ziel[0];p.y=p.ziel[1];p.ziel=null;if(p.weg){Object.assign(p,neuerMensch(false));p.pause=z(3,12);}else if(zufall()<0.35)p.pause=z(1.5,7);}
      else{p.x+=dx/d*sp;p.y+=dy/d*sp;p.phase+=dt*p.v*5.3;}});
  }
  function licht(x,y,r,farbe,a){var gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba('+farbe+','+a+')');gr.addColorStop(1,'rgba('+farbe+',0)');g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,7);g.fill();}
  function zeichne(){
    var n=nacht();g.clearRect(0,0,1920,1080);var alle=[];
    if(grund.complete&&grund.naturalWidth&&tuer.auf>0.01){var T=TUER,w=T.x1-T.x0,h=T.y1-T.y0,sx=grund.naturalWidth/1920,o=tuer.auf*w*0.3;
      g.filter=n?'brightness(0.8) sepia(0.7) saturate(1.6)':'brightness(0.62) sepia(0.55) saturate(1.3)';   /* dahinter: dieselbe Lobby, dunkler und warm beleuchtet */
      g.drawImage(grund,(T.x0-3)*sx,(T.y0-3)*sx,(w+6)*sx,(h+6)*sx,T.x0,T.y0,w,h);g.filter='none';
      g.save();g.beginPath();g.rect(T.x0,T.y0,w,h);g.clip();
      g.drawImage(grund,T.x0*sx,T.y0*sx,w/2*sx,h*sx,T.x0-o,T.y0,w/2,h);                            /* linker Flügel gleitet nach links */
      g.drawImage(grund,(T.x0+w/2)*sx,T.y0*sx,w/2*sx,h*sx,T.x0+w/2+o,T.y0,w/2,h);g.restore();}      /* rechter Flügel nach rechts */
    autos.forEach(function(a){var o=ort(a.w,a.pos);alle.push({y:o.y,f:function(){
      var phi=Math.atan2(-o.dy/SIN_E,o.dx),r=((Math.round(phi/(Math.PI/8))%16)+16)%16,k=ppm(o.y)*6.4;
      g.filter=n?'brightness(0.42) saturate(0.75)':'contrast(1.25) saturate(1.15) brightness(0.86)';
      g.drawImage(bild['auto_'+a.farbe+'_'+a.form],r*FA,0,FA,FA,o.x-k/2,o.y-k*91.8/160,k,k);g.filter='none';
      if(n){var l=Math.hypot(o.dx,o.dy)||1,ux=o.dx/l,uy=o.dy/l,m=ppm(o.y),h=2.3*m*Math.hypot(ux,uy*SIN_E);
        g.globalCompositeOperation='lighter';
        licht(o.x+ux*(h+5*m),o.y+uy*(h+5*m)*0.9,4.2*m,'255,214,150',0.28);    /* Lichtkegel vorn auf der Straße */
        licht(o.x+ux*h,o.y+uy*h-0.4*m,0.9*m,'255,244,220',0.9);              /* Scheinwerfer */
        licht(o.x-ux*h,o.y-uy*h-0.4*m,0.7*m,'255,40,30',0.75);               /* Rücklichter */
        g.globalCompositeOperation='source-over';}}});});
    leute.forEach(function(p){if(p.pause>0&&p.weg)return;alle.push({y:p.y,f:function(){
      var r=((Math.round(p.richt/(Math.PI/4))%8)+8)%8,fr=p.pause>0?0:Math.floor(p.phase)%8,k=ppm(p.y)*2.6;
      if(n)g.filter='brightness(0.45)';g.globalAlpha=1-Math.min(1,p.blass||0);g.drawImage(bild['mensch_'+p.jacke],fr*FM,r*FM,FM,FM,p.x-k/2,p.y-k*109/160,k,k);g.filter='none';g.globalAlpha=1;}});});
    alle.sort(function(a,b){return a.y-b.y;}).forEach(function(e){e.f();});
    var dk=bild[n?'deckel_nacht':'deckel_tag'];if(dk.complete)g.drawImage(dk,0,OBEN);
  }
  var letzt=0,ruhig=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function lauf(ts){if(!c.isConnected)return;var dt=Math.min(0.1,(ts-letzt)/1000||0);letzt=ts;if(!c.__aufnahme){if(!ruhig)schritt(dt);zeichne();}requestAnimationFrame(lauf);}
  for(var v=0;v<24*25;v++)schritt(1/24);   /* 25 s vorlaufen: die Szene ist beim Öffnen schon belebt */
  requestAnimationFrame(lauf);
  c.__tuer=tuer;c.__leute=leute;c.__vor=function(k){for(var i=0;i<k;i++)schritt(1/24);zeichne();};
};
})();
