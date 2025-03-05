// static/js/question/formEvents.js
document.addEventListener('DOMContentLoaded', function() {
  // Anlage-Button: Popup öffnen (Funktion in popup-open-anlage.js)
  document.querySelector('.btn-anlage').addEventListener('click', function() {
    openAnlage();
  });

  // Melden-Button: Popup anzeigen
  document.querySelector('.btn-melden').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById("Meldung-container").style.display = "flex";
  });

  // Popup-Submit-Button: Text absenden (Funktion in popupSubmit.js)
  document.querySelector('.popup-submit').addEventListener('click', function(e) {
    e.preventDefault();
    submitText();
  });

  // Popup-Cancel-Button: Popup schließen
  document.querySelector('.popup-cancel').addEventListener('click', function() {
    document.getElementById("Meldung-input").value = "";
    document.getElementById("Meldung-container").style.display = "none";
  });

  // Popup schließen, wenn außerhalb des Inhalts geklickt wird
  document.getElementById("Meldung-container").addEventListener('click', function(e) {
    if (e.target === this) {
      document.getElementById("Meldung-input").value = "";
      this.style.display = "none";
    }
  });

  // Laden der offenen Aufgaben (Funktion in popupUpdate.js)
  window.onload = updateOpenTasks;
});
