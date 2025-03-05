document.addEventListener('DOMContentLoaded', function() {
  const anlageButton = document.getElementById('anlageButton');
  if (anlageButton) {
    anlageButton.addEventListener('click', function() {
      console.log('Anlage Button wurde geklickt.');
      fetch('/show_anlage')
        .then(response => response.json())
        .then(data => {
          console.log('Empfangene Daten:', data);
          const filename = data.anlagebezeichnung;
          if (filename) {
            const imageUrl = '/static/images/anlagen/' + filename.trim();
            document.getElementById('anlageImage').src = imageUrl;
            document.getElementById('anlageModal').style.display = 'block';
          } else {
            console.error('Kein Anlagenbild in der Session gefunden.');
          }
        })
        .catch(error => console.error('Fehler beim Abrufen des Bildnamens:', error));
    });
  } else {
    console.error('Element mit ID "anlageButton" nicht gefunden.');
  }

  // Schließ-Button im Modal
  const closeBtn = document.querySelector('#anlageModal .close');
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      document.getElementById('anlageModal').style.display = 'none';
    });
  }

  // Schließen des Modals, wenn außerhalb des Inhalts geklickt wird
  window.addEventListener('click', function(event) {
    const modal = document.getElementById('anlageModal');
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Keydown-Listener für "Escape" zum Schließen des Modals
  document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
      const modal = document.getElementById('anlageModal');
      if (modal && modal.style.display === 'block') {
        modal.style.display = 'none';
      }
    }
  });
});
