/* Sternstunde · stehender Baum (Runde 2, 31.10.2026; seit Runde 12 Nano-Banana-Fassung als WebP, 1800 × 5616, zwei Schnitte montiert).
   Der Baum ist fertig gerendert (Blender, zwei Ebenen). Sieben Halte: Wurzeln · fünf Äste · Krone mit Stern.
   Die Kamera (Zoom + Mittelpunkt) wird zwischen den Halten weich bewegt; am Halt rastet die Seite ein, die Flamme läuft einmal ein,
   atmet dann; Rinde/Handy und Stern spielen einmal. Jeder Zustand hängt an p (0–1), rückwärts läuft alles rückwärts.
   Look (pixar | foto | buch) kommt aus data-look am body. */
(function(){
  var LOOK=document.body.dataset.look||'pixar', q=new URLSearchParams(location.search), STILL=q.get('still')==='1';
  var ZOOM_HANDY=1.55, ZOOM_DESK=1.0, BV='?v=17';  /* BV: Bildversion gegen Browser-Cache (langer Baum ohne Höhle, 31.10. abends) */
  /* Scrollen 1:1 (Simon 31.10. abends): der Baum bewegt sich so weit wie der Finger. Jeder Anker ist genau so hoch wie der Kameraweg
     zum nächsten Halt (S[]), mindestens 0,45 Bildschirme; mehr Baum zwischen den Halten kommt aus dem längeren Render (--lang 1.3). */   /* 2,3 war zu nah: Stamm füllte alles, Äste und Flammen lagen außerhalb (Test 31.10.) */
  var H=[  /* Halte; cx/cy werden aus anker.json gesetzt. Texte: Fassung E, Textrunde 31.10.2026 (Simon: 'E gilt') */
    {id:'wurzeln',fig:'sparky',pose:'freude',seite:'links',mono:"Sternstunde · Für Kinder. Für Eltern.",titel:"Eine Stunde im Baum",satz:"Hallo! Ich bin <b>Sparky</b>. Da oben wohnt ein Stern, kommst du mit?",text:"Eine Stunde Spielen im 21. Stock über Frankfurt. Für Kinder von 6 bis 9, jedes mit einem Erwachsenen. Kostenlos, 19 € Pfand je Kind, am Kindertag zurück."},
    {id:'stunde',fig:'bo',pose:'ruhe',mono:"So läuft die Stunde",titel:"Drei Spiele, eine Stunde",satz:"<b>Bo</b>: Erst verdienen wir Geld. Dann füttern wir den Baum. Dann geben wir aus.",text:"Station 1 Geld verdienen · Station 2 Zuerst der Baum · Station 3 Ausgeben und wachsen. Probier es gleich hier:",spiel:true},
    {id:'spross',fig:'lumi',pose:'ruhe',mono:"Zum Abschluss",titel:"Dein Spross",satz:"<b>Lumi</b>: Ich gieße, ich schütze, ich warte. Dein Spross kommt mit nach Hause.",text:"Jedes Kind nimmt am Ende einen Spross mit nach Hause. Gießen, warten, zuschauen."},
    {id:'app',fig:'ferno',pose:'ruhe',mono:"Kostenlos dazu",titel:"Die Sternstunde-App",satz:"<b>Ferno</b>: Guck mal, meine App! Am Kindertag bekommst du sie kostenlos. Damit spielst du mit Geld weiter.",text:"Gibt es am Kindertag kostenlos dazu. Spielerisch Finanzen lernen, auch zu Hause. Susanne erklärt dir gleich das Pfand."},
    {id:'eltern',fig:'susanne',pose:'ruhe',mono:"Für Eltern",titel:"Was dich erwartet",satz:"<b>Susanne</b>: Kurz für dich: Die 19 Euro sind ein Pfand. Am Kindertag bekommst du sie zurück.",fakten:[['0 €','Teilnahme kostenlos'],['19 €','Pfand je Kind, am Kindertag zurück'],['8','Kinder je Gruppe, jedes mit einem Erwachsenen']],text:"Kein Verkauf, keine Werbung im Spiel. Keine Fotos von Kindergesichtern. Gleich sucht ihr euch eine Zeit aus."},
    {id:'termine',fig:'sparky',pose:'verstehen',mono:"Eure Zeit",titel:"Fünf Gruppen am Kindertag",satz:"<b>Sparky</b>: Fünf Gruppen, fünf Zeiten. Welche passt zu euch?",zeiten:['9:30','11:00','12:30','14:00','15:30'],text:"Acht Kinder je Gruppe, jedes mit einem Erwachsenen. Den Tag sagen wir noch."},
    {id:'krone',fig:null,mono:"Ganz oben",titel:"Fast geschafft",satz:"<b>Sparky</b>: Puh, die Krone! Den Stern sehe ich schon. Du auch?",text:"Eine Stunde, drei Spiele, ein Spross für zu Hause. Oben am Stern könnt ihr in Ruhe einen Platz anfragen."},
    {id:'stern',fig:null,mono:"Sternstunde",titel:"Jeder Baum fängt klein an.",nacht:true,stern:true,satz:"<b>Sparky</b>: Da bist du ja! Drei Spiele, ein Spross, fünf Zeiten. Kommst du zur Sternstunde?",text:"Eine Stunde, drei Spiele, ein Spross für zu Hause. Erst der Baum, dann die Wünsche. Wenn es für euch passt: Platz anfragen.",preis:"Kostenlos · 19 € Pfand je Kind, am Kindertag zurück"}
  ];
  var N=H.length;
  var welt=document.getElementById('welt'),buehne=document.getElementById('buehne'),himmel=document.getElementById('himmel'),sterne=document.getElementById('sterne'),baum=document.getElementById('baum'),punkte=document.getElementById('punkte'),kopf=document.getElementById('kopf');
  for(var i=0;i<N;i++){var a=document.createElement('div');a.className='anker';welt.appendChild(a);}
  var seed=7;function rnd(){seed=(seed*9301+49297)%233280;return seed/233280;}
  for(var k=0;k<90;k++){var st=document.createElement('i');st.style.left=(rnd()*100)+'%';st.style.top=(rnd()*100)+'%';st.style.animationDelay=(rnd()*2.6)+'s';sterne.appendChild(st);}
  if(punkte)for(var j=0;j<N;j++)punkte.appendChild(document.createElement('i'));

  /* Baum-Bild aufbauen: Stamm, Blätter (zweimal, leicht versetzt für Tiefe), Nachtschleier, Flammen, Handy, Stern */
  /* Mac (Simon 01.11.): ab 760 px eigenes Breitbild. Mitte = das Handy-Bild unverändert (2400 × 7489 bei x 1318, y 18),
     links und rechts von Higgsfield ergänzt (Sternstunde-Mac_2026-11-01/komposit_mac.py). Figuren behalten ihre Größe zum Baum. */
  var MAC=innerWidth>=760,SK=1,STAMM='baum/'+LOOK+(MAC?'_mac':'_stamm')+'.webp'+BV;
  function macMeta(m){var W=5036,Hh=7507,X=1318,Y=18,QW=2400,QH=7489;
    function p(o){var n={};for(var k in o)n[k]=o[k];n.x=(X+o.x*QW)/W;n.y=(Y+o.y*QH)/Hh;return n;}
    var n={};for(var k in m)n[k]=m[k];
    if(m.anker)n.anker=m.anker.map(p);if(m.sitz)n.sitz=m.sitz.map(p);n.rinde=p(m.rinde);n.krone=p(m.krone);
    n.breite=W;n.hoehe=Hh;if(m.sicht)n.sicht=m.sicht*Hh/QH;SK=QW/W;baum.style.setProperty('--sk',SK);return n;}
  baum.innerHTML='<div class="boden"></div><div class="ebene stammebene"><img class="stamm" src="'+STAMM+'" alt=""></div>'+
    /* Blattebene entfällt (31.10. spät): das Higgsfield-Bild steht als Ganzes, damit die Blätter scharf bleiben */
    '<div class="ebene gras" id="gras"></div><div class="erdkante"></div><div class="stammschatten"></div><div class="ebene nachtschleier"></div><div class="ebene figuren"></div>';
  var fig=baum.querySelector('.figuren'),schleier=baum.querySelector('.nachtschleier');
  var META=null,flammen=[],handy,sternEl;
  function bauen(meta){if(MAC)meta=macMeta(meta);META=meta;
    /* Sitzpunkte (sitz_messen.py): gemessene Astoberkante nahe am Stamm; Sitz 0 ist die Wurzel für Sparky. Ohne Messung: Anker. */
    var sitz=meta.sitz||[{x:.29,y:.9}].concat(meta.anker);
    H[0].cx=.5;H[0].cy=.93;  /* Wurzeln: so tief, dass Bo auf Ast 1 oben aus dem Bild ist */
    for(var i=0;i<5;i++){var s=sitz[i+1];H[i+1].cx=s.x;H[i+1].cy=s.y;H[i+1].seite=s.x<.5?'links':'rechts';}
    H[6].cx=meta.krone.x;H[6].cy=meta.krone.y+.08;          /* Krone */
    H[7].cx=meta.krone.x;H[7].cy=meta.krone.y-.11;          /* Stern: über der Krone, im Himmel; Stern selbst sitzt höher als die Kameramitte */
    var html='';
    for(var i=0;i<N;i++){var h=H[i];if(!h.fig)continue;var s=sitz[i];if(!s)continue;
      html+='<div class="flamme" data-i="'+i+'" style="left:'+(s.x*100)+'%;top:'+(s.y*100)+'%"><i class="schatten"></i><div class="fig"><img src="bilder/frei/'+h.fig+'_'+h.pose+'.png" alt="'+h.fig+'">'+(h.id==='app'?'<img class="app-handy" src="baum/iphone.webp'+BV+'" alt="Sternstunde-App">':'')+'</div></div>';}
    html+='<svg class="stern-gross" id="stern" viewBox="0 0 200 200" style="left:'+(meta.krone.x*100)+'%;top:'+(meta.krone.y*100-17)+'%"><defs><radialGradient id="sg"><stop offset="0" stop-color="#FFF8DC" stop-opacity=".95"/><stop offset=".3" stop-color="#F6CF5A" stop-opacity=".45"/><stop offset="1" stop-color="#F6CF5A" stop-opacity="0"/></radialGradient><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF4C8"/><stop offset=".55" stop-color="#F6CF5A"/><stop offset="1" stop-color="#D99A1E"/></linearGradient></defs><circle cx="100" cy="100" r="98" fill="url(#sg)"/><g transform="translate(43 40) scale(1.14)"><path d="M50 4 L61 36 L96 38 L68 60 L78 94 L50 74 L22 94 L32 60 L4 38 L39 36 Z" fill="url(#sk)" stroke="#FFF4C8" stroke-width="7" stroke-linejoin="round"/><path d="M50 4 L61 36 L96 38 L68 60 L78 94 L50 74 L22 94 L32 60 L4 38 L39 36 Z" fill="url(#sk)"/><ellipse cx="42" cy="34" rx="9" ry="5" fill="#FFFBEA" opacity=".8" transform="rotate(-25 42 34)"/></g><g fill="#FFF8DC"><path d="M160 48 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3z"/><path d="M34 140 l2.5 6.5 6.5 2.5 -6.5 2.5 -2.5 6.5 -2.5 -6.5 -6.5 -2.5 6.5 -2.5z"/><path d="M168 150 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z"/></g></svg>';
    fig.innerHTML=html;flammen=Array.prototype.slice.call(fig.querySelectorAll('.flamme'));handy=document.getElementById('handy');sternEl=document.getElementById('stern');
    groesse();}
  /* Rinde auf dem Handy: die Haut trägt exakt die Stamm-Textur ihrer Stelle (bei Ruhe unsichtbar), das Gehäuse die Rinde daneben.
     Beim Herauskommen wächst das Element aus der Mitte; die Haut dehnt sich wie eine Wölbung und löst sich dann auf. */
  function rinde(){if(!META||!handy)return;var Wp=.19*SK*BW,Hp=Wp*1.75,L=META.rinde.x*BW-Wp/2+.15*Wp,T=META.rinde.y*BH-Hp/2+.13*Hp,url='url('+STAMM+')',size=BW+'px '+BH+'px';
    /* Rindenhaut über dem Handykörper: exakt die Stamm-Textur dieser Stelle, löst sich beim Herauskommen auf */
    var haut=handy.querySelector('.haut');haut.style.backgroundImage=url;haut.style.backgroundSize=size;haut.style.backgroundPosition=(-L)+'px '+(-T)+'px';}
  /* Graskante vor den Wurzeln: unregelmäßige Büschel, einmal gewürfelt */
  function grasKante(){var g=document.getElementById('gras');if(!g)return;var pts=[],r=31;function z(){r=(r*9301+49297)%233280;return r/233280;}
    /* Bodenlinie aus der Messung: Sparky steht 0,2 m über dem Boden (z = -1,5); Gras, Stammschatten und Hügel hängen daran */
    if(META&&META.sitz&&META.sicht){var S0=META.sitz[0].y-0.2/META.sicht;g.style.top=(S0*100)+'%';
      var ss=baum.querySelector('.stammschatten'),bo=baum.querySelector('.boden');if(bo)bo.style.top='97.4%';}
    for(var x=-2;x<=102;x+=1.1){pts.push(x.toFixed(1)+'% '+(1.2+z()*3.2+(z()<.25?3.5:0)).toFixed(1)+'%');}
    g.style.clipPath='polygon('+pts.join(',')+',102% 100%,-2% 100%)';}

  /* Stationen (Text) */
  var stationen=H.map(function(h,i){var el=document.createElement('section');el.className='station '+(h.seite||'links')+(h.nacht?' nacht':'');el.dataset.i=i;
    var k='<div class="blase">'+h.satz+'</div><div class="karte"><div class="mono">'+h.mono+'</div><h2>'+h.titel+'</h2>';
    if(h.fakten)k+='<ul class="fakten">'+h.fakten.map(function(f){return '<li><b>'+f[0]+'</b><span>'+f[1]+'</span></li>'}).join('')+'</ul>';
    if(h.zeiten)k+='<div class="zeiten">'+h.zeiten.map(function(z){return '<span>'+z+'</span>'}).join('')+'</div>';
    k+='<p>'+h.text+'</p>'+(h.preis?'<p class="preis">'+h.preis+'</p>':'');
    if(h.spiel)k+='<p style="color:var(--green);font-size:17px">Du hast 5 Euro Taschengeld. Was machst du damit?</p><div class="reihe spiel"><button class="knopf leise" data-a="aus">Alles für Süßes</button><button class="knopf leise" data-a="teil">Ein Teil in den Baum</button><button class="knopf leise" data-a="alles">Alles in den Baum</button></div><p class="antwort" style="min-height:1.3em"></p>';
    k+='<div class="reihe">'+(h.stern?'<button class="knopf gold">Platz anfragen</button>':'')+(i<N-1?'<button class="knopf haupt weiter" data-ziel="'+(i+1)+'">Weiter ↑</button>':'')+'</div></div><div class="untertitel"></div>';
    el.innerHTML=k;buehne.appendChild(el);return el;});

  function klemm(x,a,b){return Math.max(a,Math.min(b,x))}
  function weich(x){return x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2}
  var vw=innerWidth,vh=innerHeight,zoom=1,BW=1,BH=3,zielP=0,p=0,aktiv=-1,handyAn=false,sternAn=false,audio=null,S=[0];
  function camY(i){var y=klemm(H[i].cy*BH-versatz(i),-vh*.55,Math.max(0,BH-vh*.42));
    /* Stern: ganz unter der Kopfleiste der Website (Simon 01.11.: oben abgeschnitten) */
    if(i===N-1&&META){var l=document.querySelector('.leiste'),oben=(l?l.offsetHeight:0)+12;y=Math.min(y,(META.krone.y-.17)*BH-.19*SK*BW-oben);}  /* Sternmitte wie im Markup, Breite 38 % */
    return y;}
  function anker(){S=[0];for(var i=0;i<N-1;i++){S.push(S[i]+Math.max(Math.abs(camY(i+1)-camY(i)),vh*.45));}
    var el=welt.querySelectorAll('.anker');for(var j=0;j<N;j++){el[j].style.height=(j<N-1?S[j+1]-S[j]:vh)+'px';}}
  /* Scrollposition → Haltindex mit Bruchteil (linear, damit der Baum 1:1 mitfährt) */
  function haltIndex(y){for(var i=0;i<N-1;i++){if(y<S[i+1])return i+klemm((y-S[i])/(S[i+1]-S[i]),0,1);}return N-1;}
  function groesse(){vw=buehne.clientWidth;vh=innerHeight;zoom=vw<760?ZOOM_HANDY:ZOOM_DESK;
    BW=vw*zoom;BH=BW*(META?META.hoehe/META.breite:3);baum.style.width=BW+'px';baum.style.height=BH+'px';
    /* Desktop: Baum passt in die Höhe von etwa 2,4 Bildschirmen, damit die Kamera noch fährt (Proportionen wie am Handy).
       Das Mac-Breitbild füllt die Fensterbreite; ist das Fenster noch breiter, wird es leicht größer, nie schmaler als das Fenster */
    if(zoom===ZOOM_DESK){var r=META?META.breite/META.hoehe:1/3;BH=vh*2.6*(MAC?7507/7489:1);BW=BH*r;if(BW<vw){BW=vw;BH=BW/r;}baum.style.width=BW+'px';baum.style.height=BH+'px';}
    rinde();grasKante();anker();stelle(true);}
  function lies(){zielP=haltIndex(scrollY)/(N-1);}
  /* Wie weit unter der Oberkante die Flamme sitzt: 30 % der Höhe, bei hohen Karten (Spiel, Eltern) höher, damit die
     Flamme nie hinter Blase oder Karte verschwindet; nie in den Kopf hinein. */
  function versatz(i){var el=stationen[i];if(!el)return vh*.3;var fl=flammen.filter(function(f){return +f.dataset.i===i})[0];
    var h=el.offsetHeight,fh=(fl&&fl.offsetHeight)||vh*.16;return klemm(vh-h-10,Math.min(vh*.3,58+fh),vh*.3);}
  function kamera(pp){ /* Mittelpunkt zwischen den Halten, weich */
    var f=pp*(N-1),i=Math.floor(f),t=klemm(f-i,0,1),a=H[Math.min(i,N-1)],b=H[Math.min(i+1,N-1)];
    var cx=a.cx+(b.cx-a.cx)*t,cy=a.cy+(b.cy-a.cy)*t;
    /* am Handy: Mittelpunkt zur Flamme hin, aber Stamm bleibt im Bild */
    if(zoom>1){cx=.5+(cx-.5)*.8;}
    /* Flamme sitzt bei 30 % der Höhe, über Blase und Karte; am Stern darf die Kamera über das Bild hinaus in den Himmel,
       an den Wurzeln unter das Bild auf den Hügel (sonst hängt der erste Halt am Bildrand und Sparky liegt hinter der Karte) */
    var x=BW<vw?(BW-vw)/2:klemm(cx*BW-vw/2,0,BW-vw),y=camY(Math.min(i,N-1))*(1-t)+camY(Math.min(i+1,N-1))*t;
    baum.style.transform='translate('+(-x)+'px,'+(-y)+'px)';}
  function stelle(sofort){
    if(sofort||STILL)p=zielP;else p+=(zielP-p)*0.5;
    if(!META)return;
    kamera(p);
    /* Licht (Simon 31.10.): bis zur Krone Tag; erst über der Krone wird es Abend, am Stern Nacht */
    himmel.style.transform='translateY('+((2*vh)*p)+'px)';
    sterne.style.opacity=klemm((p-.8)/.15,0,1);
    schleier.style.opacity=klemm((p-.78)/.18,0,1);
    var nah=Math.round(p*(N-1));
    stationen.forEach(function(el,i){el.classList.toggle('sichtbar',Math.abs(p*(N-1)-i)<0.5);});
    if(nah!==aktiv){aktiv=nah;
      if(punkte)Array.prototype.forEach.call(punkte.children,function(x,i){x.classList.toggle('an',i===nah)});
      var dunkel=p>.84;if(kopf)kopf.classList.toggle('hell',dunkel);if(punkte)punkte.classList.toggle('hell',dunkel);
      flammen.forEach(function(fl){var i=+fl.dataset.i;fl.classList.remove('einlauf','idle');if(i===nah){void fl.offsetWidth;fl.classList.add(STILL?'idle':'einlauf');}else if(i<nah){fl.classList.add('idle');}});
      
      if(nah===7&&!sternAn){sternAn=true;sternEl.classList.add('an');}
      if(audio){speechSynthesis.cancel();audio=null;}
    }
    if(!sofort&&Math.abs(zielP-p)>0.0004)requestAnimationFrame(function(){stelle(false)});
  }
  var laeuft=false;
  function anScroll(){lies();if(!laeuft){laeuft=true;requestAnimationFrame(function(){laeuft=false;stelle(false)});}
  }
  addEventListener('scroll',anScroll,{passive:true});addEventListener('resize',groesse);
  /* Rasten übernimmt CSS scroll-snap (proximity) auf html; das JS-Rasten per scrollTo kämpfte auf iOS gegen die Trägheit (Simon 31.10.) */
  buehne.addEventListener('click',function(e){
    var w=e.target.closest('.weiter');if(w){scrollTo({top:S[+w.dataset.ziel],behavior:'smooth'});return;}
    var sp=e.target.closest('.sprechen');if(sp){sprich(+sp.dataset.i);return;}
    var a=e.target.closest('.spiel button');if(a){var ant={aus:'Jetzt ist es weg. Morgen ist der Baum genauso klein wie heute.',teil:'Ein Teil für heute, ein Teil wächst. So bleibt beides möglich.',alles:'Alles wächst. Aber ein kleines Eis heute wäre auch in Ordnung gewesen.'};
      a.parentNode.querySelectorAll('button').forEach(function(x){x.style.background='';x.style.color=''});a.style.background='var(--green)';a.style.color='var(--cream)';a.closest('.karte').querySelector('.antwort').textContent=ant[a.dataset.a];}
  });
  function sprich(i){var h=H[i],text=h.satz.replace(/<[^>]+>/g,''),ut=stationen[i].querySelector('.untertitel');
    if(!('speechSynthesis' in window)){ut.textContent=text;ut.classList.add('an');return;}
    speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(text);u.lang='de-DE';u.rate=0.95;u.pitch=h.fig==='susanne'?1:h.fig==='ferno'?0.9:1.25;
    var vs=speechSynthesis.getVoices().filter(function(v){return v.lang&&v.lang.toLowerCase().indexOf('de')===0});if(vs.length)u.voice=vs[0];
    ut.textContent=text;ut.classList.add('an');audio=u;u.onend=function(){ut.classList.remove('an');audio=null;};speechSynthesis.speak(u);}

  fetch('baum/anker.json').then(function(r){return r.json()}).then(function(m){bauen(m);start();}).catch(function(){
    bauen({breite:1000,hoehe:3000,anker:[{x:.11,y:.715},{x:.86,y:.58},{x:.16,y:.45},{x:.81,y:.315},{x:.21,y:.19}],rinde:{x:.5,y:.545},krone:{x:.5,y:.06}});start();});
  function start(){var p0=parseFloat(q.get('p')),h0=parseInt(q.get('halt'),10);if(!isNaN(h0))p0=h0/(N-1);if(!isNaN(p0)){scrollTo(0,S[Math.floor(p0*(N-1))]+(p0*(N-1)%1)*((S[Math.min(Math.ceil(p0*(N-1)),N-1)]||S[N-1])-S[Math.floor(p0*(N-1))]));lies();stelle(true);
      if(STILL){var nah=Math.round(p*(N-1));if(nah>=7)sternEl.classList.add('an');}}
    else{document.documentElement.style.scrollSnapType='y proximity';lies();stelle(true);}}
})();
