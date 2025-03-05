// Melden-Button: Der zweite Button in der Menüleiste (Index 1)
document.querySelectorAll('.menu-button')[1].addEventListener('click', function(e) {
  e.preventDefault();
  const meldungContainer = document.getElementById("Meldung-container");
  meldungContainer.style.display = "flex";
  document.getElementById("Meldung-input").focus(); // Automatisches Fokussieren des Input-Feldes
});

// Event-Listener für den "Absenden"-Button im Meldung-Popup
document.querySelector('.popup-submit').addEventListener('click', function(e) {
  e.preventDefault();
  submitText();
});

// Optionaler Event-Listener für einen Cancel-Button, falls dieser im HTML vorhanden ist
var cancelButton = document.querySelector('.popup-cancel');
if (cancelButton) {
  cancelButton.addEventListener('click', function() {
    document.getElementById("Meldung-input").value = "";
    document.getElementById("Meldung-container").style.display = "none";
  });
}

// Klick außerhalb des Pop-ups (auf dem Overlay) schließt das Pop-up
document.getElementById("Meldung-container").addEventListener('click', function(e) {
  if (e.target === this) { // Nur wenn der Klick direkt auf dem Overlay stattfindet
    document.getElementById("Meldung-input").value = "";
    this.style.display = "none";
  }
});

// Keydown-Event: Enter zum Absenden und Esc zum Schließen des Pop-ups
document.addEventListener('keydown', function(e) {
  const meldungContainer = document.getElementById("Meldung-container");
  if (meldungContainer.style.display === "flex") {
    if (e.key === "Enter") {
      e.preventDefault();
      submitText();
    } else if (e.key === "Escape") {
      e.preventDefault();
      document.getElementById("Meldung-input").value = "";
      meldungContainer.style.display = "none";
    }
  }
});

function submitText() {
  let inputText = document.getElementById("Meldung-input").value;
  fetch("/save_text", {  // Text wird an die /save_text Route gesendet
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: inputText })
  })
  .then(response => response.json())
  .then(data => {
    // Nach erfolgreichem Absenden wird das Input-Feld geleert und das Pop-up geschlossen
    document.getElementById("Meldung-input").value = "";
    document.getElementById("Meldung-container").style.display = "none";
  })
  .catch(error => console.error("Fehler:", error));
}
