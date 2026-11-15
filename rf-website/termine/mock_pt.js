/* Runde 180 (Simon 15.11.2026): „Die drei Varianten als richtiges Mockup zum Durchklicken.“
   Weg von der Preis-Kachel zur Anmeldung, auf einer Kopie der echten Preise-Seite (Apple-Fassung).
   ?pt=1  V1: Knopf „Termine & Anmeldung“ → erst Stadt (gemerkt), dann Termin-Blatt
   ?pt=2  V2: Stadt einmal oben im Fenster wählen, jede Karte zeigt ihren nächsten Termin und „Anmelden“
   ?pt=3  V3: Knopf „Wann und wo?“ → sechs Stadtbilder mit nächstem Termin, darunter Online
   Alle Termine sind Beispiele (gleiche Rechnung wie auf der Terminseite). Nur Mockup. */
(function(){
var Q=new URLSearchParams(location.search),STD=window.RF_PT||{},PT=Q.get('pt')||STD.pt,WT=(Q.get('wt')||STD.wt||'').toLowerCase();if(!/^[abc]$/.test(WT))WT='';var ON=Q.get('on')||STD.on||'1',OK=Q.get('ok')||STD.ok||'';if(!/^[123]$/.test(OK))OK='';if(!/^[123]$/.test(ON))ON='1';
/* Runde 182 (Simon: A gesetzt; Online-Leiste, Termine unter Städten, Monat/Jahr, „du sparst“ raus; Online deutlich machen, Ort egal): on=1 Kachel „Online“ im Städte-Raster · on=2 Umschalter Vor Ort/Online · on=3 erst fragen „Wie bist du dabei?“ */
/* Runde 181 (Simon: V3 gesetzt, „weitere Termine muss prägnanter sein“, drei Varianten): wt=a Datums-Knöpfe in einer Reihe · wt=b Pfeile durch die Termine · wt=c Auswahlfeld „Termin ▾“ */if(!/^[123]$/.test(PT))return;
var STAEDTE=['Hamburg','Berlin','Düsseldorf','Frankfurt','Stuttgart','München'];
var BILDNAME={'Hamburg':'hamburg','Berlin':'berlin','Düsseldorf':'duesseldorf','Frankfurt':'frankfurt','Stuttgart':'stuttgart','München':'muenchen'};
var ORT={'Hamburg':'Alter Wall','Berlin':'Upper West','Düsseldorf':'Kö-Quartier','Frankfurt':'WINX Tower','Stuttgart':'Kronprinzenpalais','München':'Palais an der Oper'};
var STADTNR={'Berlin':0,'Düsseldorf':1,'Frankfurt':2,'Hamburg':3,'München':4,'Stuttgart':5};
var KURSNR={'Dein erster Tag':0,'Investmenttag':1,'Börsentag':2,'Investment Zirkel':0,'Rainmaker Zirkel':2,'Einzelner Workshop':3,'3 Std-Workshop':1};
var ZEIT_TAG='9:30–16:30 Uhr',ZEIT_WS='9:30–12:30 Uhr',WS_NAMEN={'Einzelner Workshop':1,'3 Std-Workshop':1};
var KEY='rf-stadt-mockup';
function merke(s){try{localStorage.setItem(KEY,s);}catch(e){}}
function gemerkt(){try{return localStorage.getItem(KEY)||'';}catch(e){return '';}}
function weltVon(name){if(W.g.a.some(function(x){return x[0]===name;}))return 'g';if(W.b.a.some(function(x){return x[0]===name;}))return 'b';return '';}
function kurs(name){var w=weltVon(name);return w?(W[w].a.filter(function(x){return x[0]===name;})[0]):null;}
function buchbar(name){return KURSNR.hasOwnProperty(name);}
function tdat(stadt,name,w,n){return new Date(2026,11,5+7*((STADTNR[stadt]||0)%4+KURSNR[name]*2+(w==='b'?1:0)+n*4));}
function dtext(d){var z=function(v){return (v<10?'0':'')+v;};return ['So.','Mo.','Di.','Mi.','Do.','Fr.','Sa.'][d.getDay()]+' '+z(d.getDate())+'.'+z(d.getMonth()+1)+'.'+d.getFullYear();}
function kurz(d){return dtext(d).slice(0,10);}
function kommende(stadt,name,w,k){var h=new Date();h.setHours(0,0,0,0);var L=[];for(var n=0;n<40&&L.length<k;n++){var d=tdat(stadt,name,w,n);if(d>=h)L.push(d);}return L;}
function online6(name,w){var L=[],gesehen={};STAEDTE.forEach(function(s){kommende(s,name,w,3).forEach(function(d){if(!gesehen[d.getTime()]){gesehen[d.getTime()]=1;L.push({d:d,stadt:''});}});});L.sort(function(a,b){return a.d-b.d;});return L.slice(0,6);}
function el(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;}
function sheet(html){var alt=document.querySelector('.mv-sh-hg');if(alt)alt.remove();
  var hg=el('div','mv-sh-hg','<div class="mv-sh" role="dialog" aria-modal="true"><div class="mv-sh-kopf"><span class="mv-sh-griff"></span><button type="button" class="mv-sh-x" aria-label="Schließen">×</button></div><div class="mv-sh-in">'+html+'</div></div>');
  hg.dataset.welt=html.indexOf('R&amp;F Institut')>=0?'b':'g';
  hg.addEventListener('click',function(e){e.stopPropagation();if(e.target===hg)hg.remove();});hg.querySelector('.mv-sh-x').onclick=function(e){e.stopPropagation();hg.remove();};
  document.body.appendChild(hg);return hg.querySelector('.mv-sh-in');}
function weltText(w){return w==='g'?'R&amp;F Akademie':'R&amp;F Institut';}

/* ---------- Stadt wählen (V1) ---------- */
function stadtwahl(name,weiter){var w=weltVon(name),a=kurs(name),on=(a[4]||'').replace(' live online','');
  var I=sheet('<p class="mv-sh-klein">'+(name)+' · '+weltText(w)+'</p><h3 class="mv-sh-h">Wo bist du dabei?</h3><div class="pt-staedte">'
    +STAEDTE.map(function(s){return '<button type="button" class="pt-stadt" data-s="'+s+'">'+s+'</button>';}).join('')
    +(on?'<button type="button" class="pt-stadt pt-onl" data-s="online">Online · '+on+'</button>':'')+'</div><p class="mv-sh-klein">Wir merken uns deine Stadt für die anderen Kurse.</p>');
  I.querySelectorAll('.pt-stadt').forEach(function(b){b.onclick=function(e){e.stopPropagation();var s=b.dataset.s;if(s!=='online')merke(s);weiter(s);};});}

/* ---------- Termin-Blatt (wie Terminseite) ---------- */
function blatt(name,stadt,startOnline){var w=weltVon(name),a=kurs(name),istWs=!!WS_NAMEN[name],mitWs=w==='g'&&['Dein erster Tag','Investmenttag','Börsentag'].indexOf(name)>=0,ws=kurs('Einzelner Workshop');
  var heim=stadt&&stadt!=='online'?stadt:(PT!=='3'?(gemerkt()||''):'');
  var on=(a[4]||'').replace(' live online',''),vo=parseInt((a[3]||'').replace(/\D/g,''),10),onz=parseInt(on.replace(/\D/g,''),10),spar=(!/^ab /.test(a[3])&&vo>onz)?' · du sparst '+(vo-onz)+' €':'';
  var opts=[];if(mitWs)opts.push({art:'ws',auge:'Dein erster Schritt',t:'Vormittag',u:ZEIT_WS+' · 3 Std-Workshop',p:ws[3]});
  opts.push(istWs?{art:'ws',t:'Vor Ort',u:ZEIT_WS+' · 3 Std-Workshop',p:a[3]}:{art:'tag',t:'Der ganze Tag',u:ZEIT_TAG+' · inkl. 1 Std. Mittagspause',p:a[3]});
  if(on)opts.push({art:'online',t:'Online',u:(istWs?ZEIT_WS:ZEIT_TAG)+' · live per Video, von überall',p:on});
  var aktiv=startOnline&&on?opts.length-1:(mitWs?1:0),offen=false;
  var cur=startOnline||!heim?(online6(name,w)[0]||{}):{d:kommende(heim,name,w,1)[0],stadt:heim};
  var I=sheet('<p class="mv-sh-klein">'+name+' · '+weltText(w)+(heim?'<span class="pt-ae-w"> · <button type="button" class="pt-aendern">'+heim+' ändern</button></span>':'')+'</p><h3 class="mv-sh-h"></h3>'+(WT?'<div class="pt-wt pt-wt-'+WT+'"></div>':'')
    +'<div class="mv-sh-opts">'+opts.map(function(o,i){return '<button type="button" class="mv-opt" data-i="'+i+'"><i></i><span>'+(o.auge?'<em>'+o.auge+'</em>':'')+'<b>'+o.t+'</b><small>'+o.u+'</small></span><strong>'+o.p+'</strong></button>';}).join('')+'</div>'
    +'<p class="mv-sh-ort"></p><button type="button" class="mv-sh-knopf mv-sh-anm">Anmelden</button><p class="mv-sh-hinw" hidden>Hier öffnet sich die Anmeldung (Stripe-Link folgt)</p>'
    +'<button type="button" class="mv-sh-link mv-sh-weitere">Weitere Termine</button><div class="mv-sh-oliste" hidden></div>');
  function liste(){if(opts[aktiv].art==='online'){var L=online6(name,w);if(cur&&cur.d&&!L.some(function(x){return x.d.getTime()===cur.d.getTime();})){L.push({d:cur.d,stadt:''});L.sort(function(a,b){return a.d-b.d;});}return L;}return kommende(heim||cur.stadt,name,w,6).map(function(d){return {d:d,stadt:heim||cur.stadt};});}
  function zeichne(){var o=opts[aktiv],onl=o.art==='online';
    I.querySelectorAll('.mv-opt').forEach(function(b){b.classList.toggle('an',+b.dataset.i===aktiv);});
    I.querySelector('.mv-sh-h').textContent=dtext(cur.d)+(onl?' · live online':' in '+cur.stadt);
    I.querySelector('.mv-sh-ort').textContent=onl?'Du bist live per Video dabei, egal wo du wohnst. Den Link bekommst du mit der Anmeldung.':'Location: '+ORT[cur.stadt]+' · '+cur.stadt;
    I.querySelector('.mv-sh-hinw').hidden=true;var aeL=I.querySelector('.pt-ae-w');if(aeL)aeL.hidden=onl;
    var L=I.querySelector('.mv-sh-oliste'),bt=I.querySelector('.mv-sh-weitere'),LL=liste();L.hidden=!offen;bt.textContent=offen?'Weitere Termine ausblenden':'Weitere Termine';
    L.innerHTML=LL.map(function(x,i){var g=x.d.getTime()===cur.d.getTime()&&x.stadt===cur.stadt;return '<button type="button" class="mv-oz'+(g?' an':'')+'" data-i="'+i+'"><b>'+dtext(x.d)+'<span class="mv-ozp">'+(g?'gewählt':'wählen')+'</span></b><small>'+(o.art==='ws'?ZEIT_WS:ZEIT_TAG)+(onl?' · live online aus '+x.stadt:' · '+x.stadt)+'</small></button>';}).join('')
      +'<button type="button" class="mv-sh-link mv-sh-kein">Kein Termin passt?</button>';
    L.querySelectorAll('.mv-oz').forEach(function(b){b.onclick=function(e){e.stopPropagation();cur=LL[+b.dataset.i];offen=false;zeichne();};});
    L.querySelector('.mv-sh-kein').onclick=function(e){e.stopPropagation();wunsch(name,cur.stadt||heim);};
    if(WT){var T=I.querySelector('.pt-wt'),idx=0;LL.forEach(function(x,i){if(x.d.getTime()===cur.d.getTime()&&(onl||x.stadt===cur.stadt))idx=i;});
      bt.hidden=true;I.classList.add('pt-wt-an');var kein=I.querySelector('.pt-kein');if(!kein){kein=el('button','mv-sh-link mv-sh-kein pt-kein','Kein Termin passt?');I.appendChild(kein);kein.onclick=function(e){e.stopPropagation();wunsch(name,cur.stadt||heim);};}
      var zeit=o.art==='ws'?ZEIT_WS:ZEIT_TAG;
      if(WT==='a'){I.querySelector('.mv-sh-h').textContent=(onl?'Live online':'In '+cur.stadt)+' · '+zeit;L.hidden=true;
        T.innerHTML='<p class="pt-wt-lab">Wähl deinen Termin</p><div class="pt-wt-reihe">'+LL.map(function(x,i){return '<button type="button" class="pt-wt-chip'+(i===idx?' an':'')+'" data-i="'+i+'"><b>'+kurz(x.d)+'</b></button>';}).join('')+'</div>';
        T.querySelectorAll('.pt-wt-chip').forEach(function(b){b.onclick=function(e){e.stopPropagation();cur=LL[+b.dataset.i];zeichne();};});
        var an=T.querySelector('.pt-wt-chip.an');if(an)an.scrollIntoView({block:'nearest',inline:'center'});}
      else if(WT==='b'){I.querySelector('.mv-sh-h').hidden=true;L.hidden=true;
        T.innerHTML='<button type="button" class="pt-pf" data-d="-1" aria-label="Früherer Termin"'+(idx<=0?' disabled':'')+'>‹</button><div class="pt-pf-mitte"><b>'+dtext(cur.d)+'</b><small>'+(onl?'live online aus '+cur.stadt:cur.stadt)+' · Termin '+(idx+1)+' von '+LL.length+'</small></div><button type="button" class="pt-pf" data-d="1" aria-label="Späterer Termin"'+(idx>=LL.length-1?' disabled':'')+'>›</button>';
        T.querySelectorAll('.pt-pf').forEach(function(b){b.onclick=function(e){e.stopPropagation();var j=idx+(+b.dataset.d);if(j<0||j>=LL.length)return;cur=LL[j];zeichne();};});}
      else{I.querySelector('.mv-sh-h').hidden=true;
        T.innerHTML='<button type="button" class="pt-feld" aria-expanded="'+offen+'"><span class="pt-feld-lab">Termin</span><b>'+dtext(cur.d)+'</b><small>'+(onl?'live online aus '+cur.stadt:cur.stadt)+' · noch '+(LL.length-1)+' weitere</small><i>'+(offen?'▴':'▾')+'</i></button>';
        T.querySelector('.pt-feld').onclick=function(e){e.stopPropagation();offen=!offen;zeichne();};
        if(T.nextSibling!==L)T.parentNode.insertBefore(L,T.nextSibling);}
    }}
  I.querySelectorAll('.mv-opt').forEach(function(b){b.onclick=function(e){e.stopPropagation();var vor=opts[aktiv].art;aktiv=+b.dataset.i;var nach=opts[aktiv].art;
    if(nach!=='online'&&(vor==='online'||!heim)){if(!heim){stadtwahl(name,function(s){if(s==='online')blatt(name,'',true);else blatt(name,s);});return;}if(cur.stadt!==heim){var ab=kommende(heim,name,w,12).filter(function(d){return d>=cur.d;})[0]||kommende(heim,name,w,1)[0];cur={d:ab,stadt:heim};}}
    if(nach==='online'){if(PT==='3'){var LO=alleOnline(name,w),tr=LO.filter(function(x){return x.getTime()===cur.d.getTime();})[0];blattOnline(name,tr);return;}cur={d:cur.d,stadt:''};}
    zeichne();};});
  var ae=I.querySelector('.pt-aendern');if(ae)ae.onclick=function(e){e.stopPropagation();if(PT==='3'){wannwo(name);return;}stadtwahl(name,function(s){if(s==='online')blatt(name,'',true);else blatt(name,s);});};
  I.querySelector('.mv-sh-anm').onclick=function(e){e.stopPropagation();I.querySelector('.mv-sh-hinw').hidden=false;};
  I.querySelector('.mv-sh-weitere').onclick=function(e){e.stopPropagation();offen=!offen;zeichne();};
  zeichne();}
/* Runde 183 (Simon: O2 gesetzt): Online hat ein eigenes Blatt. Kein Vormittag, kein ganzer Tag, nur alle Online-Termine, Preis und „von überall“. */
function alleOnline(name,w){var L=[],g={};STAEDTE.forEach(function(s){kommende(s,name,w,8).forEach(function(d){if(!g[d.getTime()]){g[d.getTime()]=1;L.push(d);}});});L.sort(function(a,b){return a-b;});return L;}
function blattOnline(name,startD){if(OK)return blattKal(name,startD);var w=weltVon(name),a=kurs(name),on=(a[4]||'').replace(' live online',''),istWs=!!WS_NAMEN[name],LL=alleOnline(name,w),d=startD||LL[0];
  var I=sheet('<p class="mv-sh-klein">'+name+' · '+weltText(w)+'</p>'
    +'<div class="pt-seg" role="tablist"><button type="button" data-x="ort">Vor Ort</button><button type="button" class="an" data-x="online">Online · von überall</button></div>'
    +'<div class="pt-onl-kopf"><div><h3 class="mv-sh-h">Live online</h3><p class="mv-sh-klein">'+(istWs?ZEIT_WS:ZEIT_TAG+' · inkl. 1 Std. Mittagspause')+'</p></div><strong>'+on+'</strong></div>'
    +'<p class="pt-onl-text">Du bist live per Video dabei, egal wo du wohnst. Den Link bekommst du mit der Anmeldung.</p>'
    +'<p class="pt-wt-lab">Alle Online-Termine</p><div class="pt-onl-raster"></div>'
    +'<div class="pt-fuss"><button type="button" class="mv-sh-knopf mv-sh-anm">Anmelden</button><p class="mv-sh-hinw" hidden>Hier öffnet sich die Anmeldung (Stripe-Link folgt)</p>'
    +'<button type="button" class="mv-sh-link mv-sh-kein">Kein Termin passt?</button></div>');
  function zeichne(){var R=I.querySelector('.pt-onl-raster');R.innerHTML=LL.map(function(x,i){return '<button type="button" class="pt-wt-chip'+(x.getTime()===d.getTime()?' an':'')+'" data-i="'+i+'"><b>'+kurz(x)+'</b></button>';}).join('');
    R.querySelectorAll('.pt-wt-chip').forEach(function(b){b.onclick=function(e){e.stopPropagation();d=LL[+b.dataset.i];I.querySelector('.mv-sh-hinw').hidden=true;zeichne();};});
    I.querySelector('.mv-sh-anm').textContent='Anmelden für '+kurz(d);}
  I.querySelector('.pt-seg [data-x="ort"]').onclick=function(e){e.stopPropagation();wannwo(name);};
  I.querySelector('.mv-sh-anm').onclick=function(e){e.stopPropagation();I.querySelector('.mv-sh-hinw').hidden=false;};
  I.querySelector('.mv-sh-kein').onclick=function(e){e.stopPropagation();wunsch(name,'',true);};
  zeichne();}
/* Runde 185 (Simon: Kalender mit Punkten im Online-Blatt, umschalten „nur mein Kurs | alle Kurse“, wenig Klicks): ok=1 Monatskalender · ok=2 alle Monate klein untereinander · ok=3 Kalender plus Liste */
var MONATE=['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
function onlineEintraege(){var L=[];['g','b'].forEach(function(w){W[w].a.forEach(function(x){var n=x[0];if(!buchbar(n)||!x[4])return;alleOnline(n,w).forEach(function(d){L.push({d:d,n:n,w:w,p:x[4].replace(' live online',''),ws:!!WS_NAMEN[n]});});});});
  L.sort(function(a,b){return a.d-b.d||a.n.localeCompare(b.n);});return L;}
function blattKal(name,startD){var w0=weltVon(name),ALLE=onlineEintraege(),modus='kurs',sel=null,monat=null;
  function liste(){return modus==='kurs'?ALLE.filter(function(e){return e.n===name;}):ALLE;}
  function tagKey(d){return d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate();}
  var I=sheet('<p class="mv-sh-klein">'+name+' · '+weltText(w0)+'</p>'
    +'<div class="pt-seg" role="tablist"><button type="button" data-x="ort">Vor Ort</button><button type="button" class="an" data-x="online">Online · von überall</button></div>'
    +'<div class="pt-onl-kopf"><div><h3 class="mv-sh-h">Live online</h3><p class="mv-sh-klein">Live per Video, egal wo du wohnst</p></div></div>'
    +'<div class="pt-filter"><button type="button" data-f="kurs" class="an">Nur '+name+'</button><button type="button" data-f="alle">Alle Kurse</button></div>'
    +'<p class="pt-legende"><span><i style="background:#2F7A55"></i>Akademie</span><span><i style="background:#2E5AA8"></i>Institut</span></p>'
    +'<div class="pt-kal-box"></div>'
    +'<div class="pt-fuss"><div class="pt-wahl"></div><button type="button" class="mv-sh-knopf mv-sh-anm">Anmelden</button><p class="mv-sh-hinw" hidden>Hier öffnet sich die Anmeldung (Stripe-Link folgt)</p>'
    +'<button type="button" class="mv-sh-link mv-sh-kein">Kein Termin passt?</button></div>');
  I.parentNode.parentNode.dataset.welt=w0;
  function monatsKal(j,mo,L,klein){var erster=(new Date(j,mo,1).getDay()+6)%7,tage=new Date(j,mo+1,0).getDate(),pro={};
    L.forEach(function(e){if(e.d.getFullYear()===j&&e.d.getMonth()===mo)(pro[e.d.getDate()]=pro[e.d.getDate()]||[]).push(e);});
    var h='<div class="pt-kal'+(klein?' klein':'')+'">'+['Mo','Di','Mi','Do','Fr','Sa','So'].map(function(t){return '<span class="wt">'+t+'</span>';}).join('');
    for(var i=0;i<erster;i++)h+='<span></span>';
    for(var t=1;t<=tage;t++){var P=pro[t],farben={};(P||[]).forEach(function(e){farben[e.w]=1;});var an=sel&&P&&sel.d.getFullYear()===j&&sel.d.getMonth()===mo&&sel.d.getDate()===t;
      h+=P?'<button type="button" class="hat'+(an?' an':'')+'" data-k="'+j+'-'+mo+'-'+t+'">'+t+'<span class="pk">'+(farben.g?'<i style="background:#2F7A55"></i>':'')+(farben.b?'<i style="background:#2E5AA8"></i>':'')+'</span></button>':'<span class="leer">'+t+'</span>';}
    return h+'</div>';}
  function zeile(e,an){return '<button type="button" class="pt-tz'+(an?' an':'')+'" data-i="'+ALLE.indexOf(e)+'"><i class="pt-p" style="background:'+(e.w==='g'?'#2F7A55':'#2E5AA8')+'"></i><span><b>'+kurz(e.d)+' · '+e.n+'</b><small>'+(e.ws?ZEIT_WS:ZEIT_TAG)+' · live per Video</small></span><strong>'+e.p+'</strong></button>';}
  function amTag(k){return liste().filter(function(e){return tagKey(e.d)===k;});}
  function waehleTag(k){var T=amTag(k);sel=T.filter(function(e){return e.n===name;})[0]||T[0];zeichne();}
  function zeichne(){var L=liste();if(!sel||L.indexOf(sel)<0)sel=(startD&&L.filter(function(e){return e.d.getTime()===startD.getTime()&&e.n===name;})[0])||L.filter(function(e){return e.n===name;})[0]||L[0];
    if(!monat&&sel)monat=new Date(sel.d.getFullYear(),sel.d.getMonth(),1);
    I.querySelectorAll('.pt-filter button').forEach(function(b){b.classList.toggle('an',b.dataset.f===modus);});
    var B=I.querySelector('.pt-kal-box'),h='';
    if(OK==='1'||OK==='3'){var j=monat.getFullYear(),mo=monat.getMonth();
      h+='<div class="pt-kal-kopf"><button type="button" data-m="-1" aria-label="Voriger Monat">‹</button><b>'+MONATE[mo]+' '+j+'</b><button type="button" data-m="1" aria-label="Nächster Monat">›</button></div>'+monatsKal(j,mo,L,OK==='3');
      if(OK==='1'&&sel){var T=amTag(tagKey(sel.d));h+='<p class="pt-wt-lab">Am '+kurz(sel.d)+'</p>'+T.map(function(e){return zeile(e,e===sel);}).join('');}
      if(OK==='3'){var M=L.filter(function(e){return e.d.getFullYear()===j&&e.d.getMonth()===mo;});h+='<p class="pt-wt-lab">Alle Online-Termine im '+MONATE[mo]+'</p>'+(M.length?M.map(function(e){return zeile(e,e===sel);}).join(''):'<p class="mv-sh-klein">Keine Termine in diesem Monat.</p>');}}
    else{var mon={};L.forEach(function(e){var k=e.d.getFullYear()*12+e.d.getMonth();mon[k]=1;});Object.keys(mon).map(Number).sort(function(a,b){return a-b;}).slice(0,8).forEach(function(k){var jj=Math.floor(k/12),mm=k%12;h+='<p class="pt-wt-lab">'+MONATE[mm]+' '+jj+'</p>'+monatsKal(jj,mm,L,true);});}
    B.innerHTML=h;
    B.querySelectorAll('.pt-kal button.hat').forEach(function(b){b.onclick=function(e){e.stopPropagation();waehleTag(b.dataset.k);};});
    B.querySelectorAll('.pt-kal-kopf button').forEach(function(b){b.onclick=function(e){e.stopPropagation();monat=new Date(monat.getFullYear(),monat.getMonth()+(+b.dataset.m),1);zeichne();};});
    B.querySelectorAll('.pt-tz').forEach(function(b){b.onclick=function(e){e.stopPropagation();sel=ALLE[+b.dataset.i];zeichne();};});
    var Wz=I.querySelector('.pt-wahl');Wz.innerHTML=sel?'<b>'+sel.n+'</b> · '+kurz(sel.d)+' · '+(sel.ws?ZEIT_WS:ZEIT_TAG)+'<strong>'+sel.p+'</strong>':'';
    if(OK==='2'&&sel){var TT=amTag(tagKey(sel.d));if(TT.length>1){Wz.insertAdjacentHTML('beforeend','<div class="pt-wahl-k">'+TT.map(function(e){return '<button type="button" data-i="'+ALLE.indexOf(e)+'" class="'+(e===sel?'an':'')+'"><i style="background:'+(e.w==='g'?'#2F7A55':'#2E5AA8')+'"></i>'+e.n+'</button>';}).join('')+'</div>');Wz.querySelectorAll('.pt-wahl-k button').forEach(function(b){b.onclick=function(ev){ev.stopPropagation();sel=ALLE[+b.dataset.i];zeichne();};});}}
    I.querySelector('.mv-sh-anm').textContent=sel?'Anmelden für '+kurz(sel.d):'Anmelden';I.querySelector('.mv-sh-hinw').hidden=true;}
  I.querySelectorAll('.pt-filter button').forEach(function(b){b.onclick=function(e){e.stopPropagation();modus=b.dataset.f;zeichne();};});
  I.querySelector('.pt-seg [data-x="ort"]').onclick=function(e){e.stopPropagation();wannwo(name);};
  I.querySelector('.mv-sh-anm').onclick=function(e){e.stopPropagation();I.querySelector('.mv-sh-hinw').hidden=false;};
  I.querySelector('.mv-sh-kein').onclick=function(e){e.stopPropagation();wunsch(sel?sel.n:name,'',true);};
  zeichne();}
var WUNSCH_AN='info@rf-institut.de',WUNSCH_ZIEL='';   /* Empfänger-Skript auf rf-institut.de, leer = noch nicht angeschlossen */
function wunsch(name,stadt,online){var w=weltVon(name);
  var chip=function(t,g){return '<button type="button" class="mv-wchip" data-g="'+g+'" aria-pressed="false">'+t+'</button>';};
  var I=sheet('<p class="mv-sh-klein">'+name+' · '+(online?'Online':stadt||weltText(w))+'</p><h3 class="mv-sh-h">Wann würde es dir passen?</h3>'
    +'<form class="mv-wf" novalidate><p class="mv-wl">Welcher Tag?</p><div class="mv-wchips">'+['Mo','Di','Mi','Do','Fr','Sa','So'].map(function(t){return chip(t,'tag');}).join('')+'</div>'
    +'<label class="mv-wl" for="pt-wdat">oder ein bestimmtes Datum (freiwillig)</label><input id="pt-wdat" type="date" class="mv-wfeld">'
    +'<p class="mv-wl">Welche Tageszeit?</p><div class="mv-wchips">'+chip('Vormittag','zeit')+chip('Nachmittag','zeit')+chip('Abend','zeit')+chip('Auch online','online')+'</div>'
    +'<label class="mv-wl" for="pt-wtext">Was noch wichtig ist (freiwillig)</label><textarea id="pt-wtext" class="mv-wfeld" rows="2" maxlength="500"></textarea>'
    +'<label class="mv-wl" for="pt-wmail">Deine E-Mail-Adresse</label><input id="pt-wmail" type="email" class="mv-wfeld" autocomplete="email" required placeholder="name@beispiel.de">'
    +'<p class="mv-wfehler" hidden></p><button type="submit" class="mv-sh-knopf">Wunsch senden</button>'
    +'<p class="mv-sh-klein">Wir nutzen deine Adresse nur, um dir auf diesen Wunsch zu antworten. <a href="recht.html">Datenschutz</a></p></form>'
    +'<button type="button" class="mv-sh-link pt-zur">‹ Zurück zu den Terminen</button>');
  I.querySelectorAll('.mv-wchip').forEach(function(b){b.onclick=function(e){e.stopPropagation();var an=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',an);b.classList.toggle('an',an);};});
  I.querySelector('.pt-zur').onclick=function(e){e.stopPropagation();if(online)blattOnline(name);else blatt(name,stadt);};
  I.querySelector('form').onsubmit=function(e){e.preventDefault();e.stopPropagation();
    var gew=function(g){return [].slice.call(I.querySelectorAll('.mv-wchip.an[data-g="'+g+'"]')).map(function(b){return b.textContent;});};
    var tage=gew('tag'),dat=I.querySelector('#pt-wdat').value,mail=I.querySelector('#pt-wmail').value.trim(),F=I.querySelector('.mv-wfehler');
    if(!tage.length&&!dat){F.hidden=false;F.textContent='Bitte wähl mindestens einen Tag oder ein Datum.';return;}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)){F.hidden=false;F.textContent='Bitte trag deine E-Mail-Adresse ein, damit wir dir antworten können.';I.querySelector('#pt-wmail').focus();return;}
    F.hidden=true;
    var inhalt={kurs:name,welt:w==='g'?'Akademie':'Institut',stadt:online?'Online':(stadt||''),tage:tage.join(', '),datum:dat,zeit:gew('zeit').join(', '),online:(online||gew('online').length)?'ja':'nein',text:I.querySelector('#pt-wtext').value.trim(),mail:mail,website:''};
    var fertig=function(ok){I.innerHTML=ok?'<div class="mv-wok"><b>Dein Wunsch ist bei uns angekommen.</b><br>René oder Simon meldet sich innerhalb von zwei Werktagen persönlich bei dir. Deine Angabe hilft uns bei der Planung: Wünschen sich mehrere denselben Zeitraum, legen wir einen zusätzlichen Termin an, und du erfährst ihn zuerst.</div>'
        +(WUNSCH_ZIEL?'':'<p class="mv-sh-klein mv-vorschau">Vorschau: Das Formular ist noch nicht angeschlossen, dieser Wunsch wurde nicht verschickt.</p>')
        :'<p class="mv-wfehler">Das hat nicht geklappt. Schreib uns bitte direkt an '+WUNSCH_AN+'.</p>';};
    if(!WUNSCH_ZIEL){fertig(true);return;}
    fetch(WUNSCH_ZIEL,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(inhalt)}).then(function(x){fertig(x.ok);}).catch(function(){fertig(false);});};}

/* ---------- V3: Wann und wo? ---------- */
function wannwo(name){var w=weltVon(name),a=kurs(name),on=(a[4]||'').replace(' live online','');
  var raster='<div class="pt-bilder">'+STAEDTE.map(function(s){return '<button type="button" class="pt-bild" data-s="'+s+'" style="background-image:url(bilder/preise/hg_'+BILDNAME[s]+'.jpg)"><b>'+s+'</b></button>';}).join('')
    +(on&&ON==='1'?'<button type="button" class="pt-bild pt-bild-onl" data-s="online"><span class="pt-onl-ic" aria-hidden="true"></span><b>Online</b><small>live per Video, von überall · '+on+'</small></button>':'')+'</div>';
  var kopf='<p class="mv-sh-klein">'+name+' · '+weltText(w)+'</p>';
  if(ON==='3'&&on){var I0=sheet(kopf+'<h3 class="mv-sh-h">Wie bist du dabei?</h3><div class="pt-wie">'
      +'<button type="button" class="pt-wie-k" data-x="ort"><b>Vor Ort</b><small>In einer von sechs Städten, gemeinsam im Raum</small><span>'+(w==='g'&&['Dein erster Tag','Investmenttag','Börsentag'].indexOf(name)>=0?kurs('Einzelner Workshop')[3]:a[3])+'</span></button>'
      +'<button type="button" class="pt-wie-k pt-wie-onl" data-x="online"><b>Online</b><small>Live per Video, egal wo du wohnst</small><span>'+on+'</span></button></div>');
    I0.querySelector('[data-x="ort"]').onclick=function(e){e.stopPropagation();staedte();};
    I0.querySelector('[data-x="online"]').onclick=function(e){e.stopPropagation();blatt(name,'',true);};return;}
  staedte();
  function staedte(){var I=sheet(kopf+'<h3 class="mv-sh-h">Wann und wo?</h3>'
      +(ON==='2'&&on?'<div class="pt-seg" role="tablist"><button type="button" class="an" data-x="ort">Vor Ort</button><button type="button" data-x="online">Online · von überall</button></div>':'')
      +(ON==='3'?'<p class="mv-sh-klein">Vor Ort · wähl deine Stadt</p>':'')+raster);
    I.querySelectorAll('.pt-bild').forEach(function(b){b.onclick=function(e){e.stopPropagation();if(b.dataset.s==='online')blatt(name,'',true);else blatt(name,b.dataset.s);};});
    var so=I.querySelector('.pt-seg [data-x="online"]');if(so)so.onclick=function(e){e.stopPropagation();blattOnline(name);};}}

/* ---------- Einstieg je Variante ---------- */
function start(name){if(!buchbar(name))return false;
  if(PT==='1'){var g=gemerkt();if(g)blatt(name,g);else stadtwahl(name,function(s){if(s==='online')blatt(name,'',true);else blatt(name,s);});}
  else if(PT==='2'){var g2=gemerkt();if(g2)blatt(name,g2);else{var bar=document.querySelector('.pt-bar');if(bar){bar.classList.add('pt-blink');setTimeout(function(){bar.classList.remove('pt-blink');},1200);}else stadtwahl(name,function(s){if(s==='online')blatt(name,'',true);else{blatt(name,s);karten();}});}}
  else wannwo(name);return true;}
var KNOPF={1:'Termine & Anmeldung',2:'Anmelden',3:'Wann und wo?'}[PT];

/* Karten im Fenster (Apple-Blatt) ergänzen */
function karten(){var B=document.querySelector('.mv-blatt');if(!B)return;var w=B.dataset.w==='b'?'b':'g',stadt=gemerkt();
  if(PT==='2'){var bar=B.querySelector('.pt-bar');if(!bar){bar=el('div','pt-bar');var R=B.querySelector('.mv-reihe');R.parentNode.insertBefore(bar,R);}
    bar.innerHTML=stadt?'<span>Deine Stadt: <b>'+stadt+'</b></span><button type="button" class="pt-aendern">ändern</button>'
      :'<span>Wähl deine Stadt, dann siehst du die Termine:</span><div class="pt-chips">'+STAEDTE.map(function(s){return '<button type="button" data-s="'+s+'">'+s+'</button>';}).join('')+'</div>';
    bar.querySelectorAll('[data-s]').forEach(function(b){b.onclick=function(e){e.stopPropagation();merke(b.dataset.s);karten();};});
    var ae=bar.querySelector('.pt-aendern');if(ae)ae.onclick=function(e){e.stopPropagation();merke('');try{localStorage.removeItem(KEY);}catch(x){}karten();};}
  B.querySelectorAll('.mv-karte').forEach(function(k){var name=(k.querySelector('.mv-ktext b')||{}).textContent;if(!buchbar(name))return;
    var alt=k.querySelector('.pt-k');if(alt)alt.remove();var info=k.querySelector('.pt-info');if(info)info.remove();
    var t=k.querySelector('.mv-ktext');
    if(PT==='2'&&stadt){var d=kommende(stadt,name,w,1)[0];t.insertBefore(el('span','pt-info','<b>Nächster Termin: '+kurz(d)+'</b><small>'+stadt+' · '+(WS_NAMEN[name]?ZEIT_WS:ZEIT_TAG)+'</small>'),t.querySelector('em').nextSibling);}
    var kn=el('span','pt-k',PT==='2'&&!stadt?'Erst Stadt wählen':KNOPF);kn.setAttribute('role','button');kn.tabIndex=0;
    kn.onclick=function(e){e.stopPropagation();e.preventDefault();start(name);};t.appendChild(kn);});}
new MutationObserver(function(){var B=document.querySelector('.mv-blatt');if(!B)return;var n=[].filter.call(B.querySelectorAll('.mv-karte'),function(k){return buchbar((k.querySelector('.mv-ktext b')||{}).textContent);}).length,m=B.querySelectorAll('.mv-karte .pt-k').length;if(n&&m<n)karten();})
  .observe(document.documentElement,{childList:true,subtree:true});

/* Knopf in der Detailkarte („Anfragen“) umleiten */
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('#detail a.knopf, .raum a.knopf');if(!a)return;
  var box=a.closest('#detail')||a.closest('.raum');var h=box&&box.querySelector('h2,h3');var name=h&&h.textContent.trim();
  if(name&&buchbar(name)){e.preventDefault();e.stopPropagation();start(name);}},true);
function beschrifte(){document.querySelectorAll('#detail a.knopf, .raum a.knopf').forEach(function(a){var box=a.closest('#detail')||a.closest('.raum');var h=box&&box.querySelector('h2,h3');
  var ziel=PT==='2'?'Termine & Anmeldung':KNOPF;if(h&&buchbar(h.textContent.trim())&&a.textContent!==ziel)a.textContent=ziel;});}
new MutationObserver(beschrifte).observe(document.documentElement,{childList:true,subtree:true});
})();
