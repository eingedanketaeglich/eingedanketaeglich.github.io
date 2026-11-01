/* Sternstunde · Platz anfragen (Simon 31.10.2026: Formular, Nachricht per Brevo).
   Das Formular sendet direkt an ein in Brevo angelegtes Formular (sibforms). Brevo legt den Kontakt an und schickt die
   Bestätigung bzw. Double-Opt-in-Mail; dafür braucht die Seite weder Server noch API-Schlüssel.
   Einrichtung: in Brevo ein Formular mit den Feldern unten anlegen, dessen Ziel-Adresse (Formular-Code, action="…sibforms.com/serve/…")
   bei BREVO.url eintragen und die Attributnamen bei BREVO.felder angleichen. Solange url leer ist, zeigt die Seite einen Vorschau-Hinweis. */
(function(){
  var BREVO = {
    url: 'https://ce6de19f.sibforms.com/serve/MUIFAL01KeROBb0lPX-rxyRo3edNc_hEGXQIuc_RGpV7y9hlFG_s7LJaG1FjFws-XyrEAm9NwNFlYiCe8e3-4-FUY-awbYplYYwkZ96KNncOGlwdZbK0P8vP47X05OsK3mdSRDT9KUM6bYEUjYghBC8ViXyVutC9l6sf9g8HNxW-DfgIBpScAPJnRzDnEAZ3TTbCi3FHZOtBUU_3HQ==',  // Brevo-Formular „Sternstunde Platz anfragen“ → Liste „Sternstunde 2026“, Double-Opt-in (31.10.2026)
    felder: { email:'EMAIL', name:'VORNAME', zeit:'WUNSCHZEIT', kinder:'ANZAHL_KINDER', alter:'ALTER_KINDER' }
  };
  var box = document.getElementById('anfrage'), form = document.getElementById('anfrage-formular'),
      danke = document.getElementById('anfrage-danke'), fehler = document.getElementById('anfrage-fehler');
  function auf(){ box.hidden = false; requestAnimationFrame(function(){ box.classList.add('da'); }); document.documentElement.classList.add('anfrage-offen');
    var e = document.getElementById('a-name'); if (e) setTimeout(function(){ e.focus({preventScroll:true}); }, 250); }
  function zu(){ box.classList.remove('da'); document.documentElement.classList.remove('anfrage-offen'); setTimeout(function(){ box.hidden = true; }, 250); }
  document.addEventListener('click', function(e){
    if (e.target.closest('.station .knopf.gold')) { e.preventDefault(); auf(); }
  });
  document.getElementById('anfrage-zu').addEventListener('click', zu);
  document.getElementById('anfrage-fertig').addEventListener('click', zu);
  box.addEventListener('click', function(e){ if (e.target === box) zu(); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && !box.hidden) zu(); });

  form.addEventListener('submit', function(e){
    e.preventDefault(); fehler.textContent = '';
    if (!form.checkValidity()) { form.reportValidity(); return; }
    if (form.email_address_check.value) return;                // Falle für Bots
    if (!BREVO.url) { fehler.textContent = 'Vorschau: Das Formular ist noch nicht mit Brevo verbunden. Es wurde nichts gesendet.'; return; }
    var d = new FormData(), f = BREVO.felder;
    d.append(f.email, form.email.value.trim()); d.append(f.name, form.name.value.trim());
    d.append(f.zeit, form.zeit.value); d.append(f.kinder, form.kinder.value);
    if (form.alter.value.trim()) d.append(f.alter, form.alter.value.trim());
    d.append('email_address_check', ''); d.append('locale', 'de'); d.append('html_type', 'simple');
    var knopf = form.querySelector('.anfrage-senden'); knopf.disabled = true; knopf.textContent = 'Wird gesendet …';
    fetch(BREVO.url, { method:'POST', body:d, mode:'no-cors' })
      .then(function(){ form.hidden = true; danke.hidden = false; })
      .catch(function(){ fehler.textContent = 'Das hat nicht geklappt. Bitte versuch es noch einmal oder schreib an info@rf-institut.de.'; })
      .then(function(){ knopf.disabled = false; knopf.textContent = 'Platz anfragen'; });
  });

  // Impressum und Datenschutz stehen seit 01.11.2026 in der Fußzeile der Website, nicht mehr unter der letzten Karte (Simon)
})();
