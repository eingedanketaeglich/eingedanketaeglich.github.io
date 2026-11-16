/* Runde 191/192 (Simon 16.11.2026: V1 gewählt, „ich muss es einmal als Mockup sehen, damit ich dort drin wischen kann, und wie es in der Mac-Version aussieht“):
   „Deine Termine. Deine Metropole.“ als Karussell: eine Stadt groß in der Mitte, die Nachbarn kleiner und verblasst dahinter, Online als siebte Karte.
   Wischen oder Pfeile drehen weiter, Antippen einer Nachbarkarte holt sie nach vorne, Antippen der Mitte öffnet die Stadt wie bisher. Nur Mockup. */
(function(){
var css='.kz{position:absolute;left:0;right:0;top:92px;bottom:10px;display:flex;flex-direction:column;align-items:center;user-select:none;-webkit-user-select:none}'
+'.kz-ring{position:relative;width:100%;flex:1;min-height:0;perspective:1100px;touch-action:pan-y;cursor:grab;overflow:hidden}'
+'.kz-k{position:absolute;left:50%;top:50%;margin-top:0;transform-origin:50% 50%;border:0;padding:0;border-radius:20px;background:#20304A center/cover no-repeat;box-shadow:0 18px 40px rgba(0,0,0,.55);transition:transform .6s cubic-bezier(.2,.8,.2,1),opacity .6s,filter .6s;overflow:hidden;cursor:pointer;color:#FFFFFF;-webkit-tap-highlight-color:transparent}'
+'.kz-k::after{content:"";position:absolute;inset:auto 0 0;height:45%;background:linear-gradient(transparent,rgba(5,10,20,.88))}'
+'.kz-t{position:absolute;left:16px;right:16px;bottom:14px;z-index:1;display:flex;flex-direction:column;text-align:left}.kz-t b{font:700 clamp(22px,3vw,30px)/1.1 "Jost",system-ui,sans-serif}.kz-t small{color:#DCE4F0;font:500 14px/1.3 "Jost",system-ui,sans-serif}'
+'.kz-on{background:linear-gradient(160deg,#2A66A8 0%,#1D4F45 100%)}.kz-ic{position:absolute;left:0;right:0;top:30%;display:flex;justify-content:center}.kz-ic svg{width:42%;height:auto}'
+'.kz-fuss{display:flex;align-items:center;gap:16px;margin:10px 0 2px}.kz-pf{width:42px;height:42px;border-radius:50%;border:1.5px solid rgba(255,255,255,.7);background:rgba(10,20,34,.6);color:#FFFFFF;font:700 20px/1 system-ui;cursor:pointer}'
+'.kz-punkte{display:flex;gap:7px}.kz-punkte i{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.3)}.kz-punkte i.an{background:#FFFFFF}'
+'.kz-los{margin-top:10px;border:0;border-radius:999px;background:#FFFFFF;color:#0C1420;font:700 16px "Jost",system-ui,sans-serif;padding:12px 26px;cursor:pointer}'
+'.kz-blatt{position:fixed;left:50%;bottom:0;transform:translate(-50%,105%);width:min(560px,100%);max-height:80svh;overflow:auto;background:#FFFFFF;color:#0C1420;border-radius:22px 22px 0 0;padding:18px 18px 28px;box-sizing:border-box;z-index:2147483000;transition:transform .35s ease;box-shadow:0 -10px 40px rgba(0,0,0,.4);font:500 15px/1.45 "Jost",system-ui,sans-serif}'
+'.kz-blatt.auf{transform:translate(-50%,0)}.kz-blatt h3{margin:0 0 4px;font:700 22px "Jost",system-ui,sans-serif}.kz-blatt p{margin:0 0 12px;color:#4B5563}.kz-blatt .kz-x{position:absolute;right:14px;top:14px;width:36px;height:36px;border-radius:50%;border:0;background:#EEF1F6;font:700 20px/1 system-ui;cursor:pointer}'
+'.kz-z{display:flex;align-items:center;gap:10px;border:1.5px solid #E2E6EE;border-radius:14px;padding:10px 12px;margin-bottom:8px}.kz-z i{width:9px;height:9px;border-radius:50%;flex:none}.kz-z div{flex:1}.kz-z b{display:block}.kz-z small{color:#6B7280}.kz-z em{font-style:normal;font-weight:700}'
+'.kz-ring.zieht{cursor:grabbing}.kz-ring.zieht .kz-k{transition:none}'+'.kz-seg{display:flex;background:rgba(30,42,62,.9);border-radius:999px;padding:4px;margin:2px 0 4px;flex:none}.kz-seg button{border:0;background:none;color:#C9D3E3;font:700 15px "Jost",system-ui,sans-serif;padding:8px 22px;border-radius:999px;cursor:pointer}.kz-seg button.an{background:#FFFFFF;color:#0C1420}'+'.kz-onfeld{display:none;flex:1;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 22px}.kz-onfeld p{color:#C9D3E3;margin:14px 0 0;max-width:420px;font:500 15px/1.45 "Jost",system-ui,sans-serif}'+'.kz-fest{position:relative;left:auto;top:auto;width:min(60vw,240px);height:auto;aspect-ratio:7/10;transform:none!important;opacity:1!important}'+'.kz.online .kz-ring,.kz.online .kz-fuss,.kz.online>.kz-los{display:none}.kz.online .kz-onfeld{display:flex}'+'.kz>.kz-los{display:none!important}'+'@media (min-width:900px){.kz{top:100px;bottom:18px}}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
var ON='<span class="kz-ic"><svg viewBox="0 0 64 48" aria-hidden="true"><rect x="8" y="6" width="48" height="30" rx="3" fill="none" stroke="#FFFFFF" stroke-width="3"/><circle cx="32" cy="18" r="5" fill="#FFFFFF"/><path d="M23 31c2-5 5-7 9-7s7 2 9 7" fill="none" stroke="#FFFFFF" stroke-width="3"/><path d="M2 42h60" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/></svg></span>';
function sams(n){var d=new Date(2026,11,5),L=[];for(var i=0;i<n;i++){L.push(new Date(d.getTime()+i*7*864e5));}return L;}
function dt(d){return ['So','Mo','Di','Mi','Do','Fr','Sa'][d.getDay()]+'. '+('0'+d.getDate()).slice(-2)+'.'+('0'+(d.getMonth()+1)).slice(-2)+'.';}
function blatt(){var B=document.querySelector('.kz-blatt');if(B)return B;B=document.createElement('div');B.className='kz-blatt';document.body.appendChild(B);return B;}
function online(){var B=blatt(),K=[],W_=window.W||{};['g','b'].forEach(function(w){((W_[w]||{}).a||[]).forEach(function(a){if(a[4])K.push([w,a[0],a[4].replace(' live online','')]);});});
  var tage=sams(8),h='<button class="kz-x" aria-label="Schließen">×</button><h3>Online · von überall</h3><p>Live per Video, egal wo du wohnst. Beispieltermine.</p>';
  tage.forEach(function(d,i){var k=K[i%Math.max(1,K.length)]||['g','Dein erster Tag','159 €'];h+='<div class="kz-z"><i style="background:'+(k[0]==='g'?'#2F7A55':'#2E5AA8')+'"></i><div><b>'+dt(d)+' · '+k[1]+'</b><small>live per Video</small></div><em>'+k[2]+'</em></div>';});
  B.innerHTML=h;B.querySelector('.kz-x').onclick=function(){B.classList.remove('auf');};requestAnimationFrame(function(){B.classList.add('auf');});}
/* Runde 192 (Simon 16.11.2026: „ich brauche es wie Mockup V2 … mit dem Finger wischen, am Mac mit der Maus wischen, nicht nur per Klick“):
   Standard ist jetzt V2 (Umschalter „Vor Ort | Online“ über den Städten), ?kz=1 zeigt V1 (Online als siebte Karte).
   Ziehen: Die Karten folgen Finger bzw. Maus stufenlos und rasten beim Loslassen auf der nächsten Stadt ein. */
var V1=new URLSearchParams(location.search).get('kz')==='1';
function baue(RS){if(RS.dataset.kz)return;RS.dataset.kz='1';var U=document.querySelector('.mk6-unter');if(U)U.textContent=V1?'Wische zu deiner Stadt oder zu Online.':'Wische zu deiner Stadt.';var ORIG=[].slice.call(RS.querySelectorAll('.mk7-bild'));RS.style.display='none';
  var box=document.createElement('div');box.className='kz';box.innerHTML=(V1?'':'<div class="kz-seg"><button type="button" class="an">Vor Ort</button><button type="button">Online</button></div>')
    +'<div class="kz-ring"></div><div class="kz-fuss"><button class="kz-pf" aria-label="Zurück">‹</button><div class="kz-punkte"></div><button class="kz-pf" aria-label="Weiter">›</button></div><button class="kz-los"></button>'
    ;
  RS.parentNode.insertBefore(box,RS.nextSibling);var R=box.querySelector('.kz-ring'),P=box.querySelector('.kz-punkte'),LOS=box.querySelector('.kz-los');
  ORIG.forEach(function(o){var k=document.createElement('button');k.className='kz-k';k.style.backgroundImage=o.style.backgroundImage;k.innerHTML='<span class="kz-t">'+o.querySelector('span').innerHTML+'</span>';k._o=o;R.appendChild(k);});
  var on=null;if(V1){on=document.createElement('button');on.className='kz-k kz-on';on.innerHTML=ON+'<span class="kz-t"><b>Online</b><small>live per Video, von überall</small></span>';R.appendChild(on);}
  var K=[].slice.call(R.children),n=K.length,cur=0,zug=0,M={kw:200,o1:120,o2:180};K.forEach(function(){P.appendChild(document.createElement('i'));});
  function mass(){var w=R.clientWidth,h=R.clientHeight,gross=w>=700,kw=Math.min(w*(gross?.3:.6),h*.9*.7);M={kw:kw,o1:gross?kw*.95:kw*.6,o2:gross?kw*1.7:kw*.92};
    K.forEach(function(k){k.style.width=kw+'px';k.style.height=(kw/.7)+'px';k.style.marginTop=(-kw/.7/2)+'px';});}
  function lage(){if(!R.clientHeight||!R.clientWidth)return;mass();var pos=cur-zug;
    K.forEach(function(k,i){var d=((i-pos)%n+n)%n;if(d>n/2)d-=n;var a=Math.abs(d),sg=d<0?-1:1,
      x=sg*(a<=1?a*M.o1:a<=2?M.o1+(a-1)*(M.o2-M.o1):M.o2+(a-2)*M.o1*.15),
      sc=a<=1?1-.22*a:a<=2?.78-.18*(a-1):Math.max(.4,.6-.15*(a-2)),
      op=a<=1?1-.38*a:a<=2?.62-.32*(a-1):Math.max(0,.3-.3*(a-2));
      k.style.transform='translateX(-50%) translateX('+x+'px) translateZ('+(-a*110)+'px) rotateY('+(-d*22)+'deg) scale('+sc+')';k.style.opacity=op;k.style.zIndex=Math.round(100-a*10);
      k.style.filter=a>.05?'brightness('+(1-.4*Math.min(a,1))+') blur('+Math.min(1.6,a*.6)+'px)':'none';k.style.pointerEvents=a<=2.2?'auto':'none';});
    var ci=((Math.round(pos)%n)+n)%n;[].slice.call(P.children).forEach(function(p,i){p.classList.toggle('an',i===ci);});var c=K[ci];LOS.textContent=c===on?'Online-Termine ›':'Termine in '+c.querySelector('b').textContent+' ›';}
  function geh(s){cur=((cur+s)%n+n)%n;lage();}
  function oeffne(k){if(k===on||!k){if(window.rfOnlineKal){window.rfOnlineKal('Dein erster Tag');setTimeout(function(){var f=document.querySelector('.pt-filter [data-f="alle"]');if(f)f.click();},60);}else online();return;}else if(k._o)k._o.click();}
  /* Ziehen mit Finger und Maus: Karten folgen stufenlos, beim Loslassen einrasten; kurzer Tipp = Antippen */
  var x0=null,t0=0,bewegt=false;
  R.addEventListener('pointerdown',function(e){if(e.button>0)return;x0=e.clientX;t0=Date.now();bewegt=false;zug=0;R.classList.add('zieht');try{R.setPointerCapture(e.pointerId);}catch(x){}});
  R.addEventListener('pointermove',function(e){if(x0===null)return;var dx=e.clientX-x0;if(Math.abs(dx)>6)bewegt=true;if(!bewegt)return;zug=dx/M.o1;lage();});
  function ende(e){if(x0===null)return;var dx=e.clientX-x0,v=dx/Math.max(1,Date.now()-t0);x0=null;R.classList.remove('zieht');
    if(bewegt){var schritt=Math.round(dx/M.o1);if(!schritt&&Math.abs(v)>.35)schritt=dx>0?1:-1;zug=0;cur=((cur-schritt)%n+n)%n;lage();return;}
    zug=0;var t=document.elementsFromPoint(e.clientX,e.clientY).filter(function(x){return x.classList&&x.classList.contains('kz-k');})[0];if(!t)return;var i=K.indexOf(t),d=((i-cur)%n+n)%n;if(d>n/2)d-=n;if(d)geh(d);else oeffne(t);}
  R.addEventListener('pointerup',ende);R.addEventListener('pointercancel',function(){x0=null;zug=0;R.classList.remove('zieht');lage();});
  R.addEventListener('dragstart',function(e){e.preventDefault();});
  /* Simon 16.11.2026: „auf dem MacBook-Trackpad wischen können“: Zwei-Finger-Wischen kommt als waagerechtes Scrollen (wheel, deltaX).
     Die Karten folgen dem Wischen stufenlos und rasten ein, sobald die Finger kurz ruhen. Senkrechtes Scrollen bleibt fürs Blättern der Seite. */
  var rad=0,radUhr=null;
  R.addEventListener('wheel',function(e){var dx=e.deltaX,dy=e.deltaY;if(e.shiftKey&&!dx){dx=dy;dy=0;}if(Math.abs(dx)<=Math.abs(dy))return;e.preventDefault();
    rad-=dx*(e.deltaMode===1?16:1);zug=rad/M.o1;if(Math.abs(zug)>1.6){var st=zug>0?1:-1;cur=((cur-st)%n+n)%n;rad-=st*M.o1;zug=rad/M.o1;}
    R.classList.add('zieht');lage();clearTimeout(radUhr);radUhr=setTimeout(function(){var st=Math.round(zug);cur=((cur-st)%n+n)%n;rad=0;zug=0;R.classList.remove('zieht');lage();},140);},{passive:false});
  K.forEach(function(k){k.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();});});
  box.querySelectorAll('.kz-pf')[0].onclick=function(e){e.stopPropagation();geh(-1);};box.querySelectorAll('.kz-pf')[1].onclick=function(e){e.stopPropagation();geh(1);};
  LOS.onclick=function(e){e.stopPropagation();oeffne(K[((Math.round(cur)%n)+n)%n]);};
  
  /* Runde 193 (Simon: „Hier kann direkt das Online-Fenster aufklappen, das es derzeit gibt“): „Online“ öffnet das bestehende Online-Blatt mit Kalender
     (alle Kurse); das Karussell bleibt dahinter stehen. Schließen oder „Vor Ort“ im Blatt schaltet zurück auf „Vor Ort“. */
  var S=box.querySelectorAll('.kz-seg button');
  function seg(i){S.forEach(function(c,j){c.classList.toggle('an',j===i);});}
  function onlineAuf(){seg(1);if(!window.rfOnlineKal){online();return;}window.rfOnlineKal('Dein erster Tag');
    setTimeout(function(){var f=document.querySelector('.pt-filter [data-f="alle"]');if(f)f.click();
      var o=document.querySelector('.pt-seg [data-x="ort"]');if(o)o.addEventListener('click',function(e){e.stopPropagation();e.preventDefault();var x=[].filter.call(document.querySelectorAll('button'),function(q){return q.textContent.trim()==='×'&&q.offsetParent&&q.closest('[class*="sh"]');})[0];if(x)x.click();seg(0);},true);
      var uhr=setInterval(function(){var offen=[].some.call(document.querySelectorAll('.pt-kal-box'),function(k){return k.offsetParent!==null;});if(!offen){clearInterval(uhr);seg(0);}},300);},60);}
  S.forEach(function(b,i){b.onclick=function(e){e.stopPropagation();if(i===1)onlineAuf();else seg(0);};});
  document.addEventListener('keydown',function(e){if(!box.offsetParent)return;if(e.key==='ArrowRight')geh(1);if(e.key==='ArrowLeft')geh(-1);});
  addEventListener('resize',lage);if('ResizeObserver' in window)new ResizeObserver(lage).observe(R);lage();}
function suche(){var RS=document.querySelector('.mk7-raster');if(RS)baue(RS);}
new MutationObserver(suche).observe(document.documentElement,{childList:true,subtree:true});suche();
})();
