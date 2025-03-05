// Funktion zum Öffnen des Hinweis-Popups
function openhinweis() {
  fetch('/show_hint')
    .then(response => {
      if (!response.ok) throw new Error('Netzwerkantwort war nicht ok');
      return response.json();
    })
    .then(data => {
      const hintText = document.getElementById('hint-text');
      const infoPopup = document.querySelector('.popup-overlay');
      hintText.textContent = data.hinweis; // Der Hinweis wird hier eingefügt
      infoPopup.style.display = 'flex'; // Popup anzeigen
    })
    .catch(error => {
      console.error('Fehler:', error);
      alert('Hinweis konnte nicht geladen werden');
    });
}

// Schließen des Hinweis-Popups
document.addEventListener('DOMContentLoaded', function() {
  const popupOverlay = document.querySelector('.popup-overlay');
  const popupOk = document.querySelector('.popup-ok');

  // Wenn der "OK"-Button geklickt wird, Popup schließen
  if (popupOk) {
    popupOk.addEventListener('click', function() {
      popupOverlay.style.display = 'none';
    });
  }

  // Wenn auf das Overlay (außerhalb des Popups) geklickt wird, Popup schließen
  popupOverlay.addEventListener('click', function(e) {
    if (e.target === popupOverlay) {
      popupOverlay.style.display = 'none';
    }
  });

  // Hinzufügen des Event-Listeners für das Info-Icon
  const infoIcon = document.querySelector('.info-icon');
  if (infoIcon) {
    infoIcon.addEventListener('click', openhinweis); // Hinweis öffnen bei Klick
  }

  // Keydown-Listener für "Enter" und "Escape"
  document.addEventListener('keydown', function(event) {
    if (event.key === "Enter") {
      if (popupOverlay.style.display === 'flex') {
        popupOk.click(); // OK-Button programmatisch klicken
      }
    } else if (event.key === "Escape") {
      if (popupOverlay.style.display === 'flex') {
        popupOverlay.style.display = 'none';
      }
    }
  });
});
