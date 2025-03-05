// static/js/question/popupHinweis.js
function openhinweis() {
  fetch('/show_hint')
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      const hintText = document.getElementById('hint-text');
      const infoPopup = document.querySelector('.popup-overlay');
      hintText.textContent = data.hinweis;
      infoPopup.style.display = 'flex';
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
  if (popupOk) {
    popupOk.addEventListener('click', function() {
      popupOverlay.style.display = 'none';
    });
  }
  popupOverlay.addEventListener('click', function(e) {
    if (e.target === popupOverlay) {
      popupOverlay.style.display = 'none';
    }
  });
});
