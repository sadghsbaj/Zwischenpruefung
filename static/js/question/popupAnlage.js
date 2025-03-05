// static/js/question/popupAnlage.js
function openAnlage() {
  fetch('/show_anlage')
    .then(response => response.json())
    .then(data => {
      const anlageDateiname = data.anlagebezeichnung;
      const popupImg = document.getElementById('popup-img');
      // Achte darauf, dass die URL ggf. serverseitig angepasst wird
      popupImg.src = "{{ url_for('static', filename='images/anlagen/') }}" + anlageDateiname;
      popupImg.onload = function() {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const targetWidth = vw * 0.7;
        const targetHeight = vh * 0.7;
        const naturalWidth = popupImg.naturalWidth;
        const naturalHeight = popupImg.naturalHeight;
        const imageRatio = naturalWidth / naturalHeight;
        const targetRatio = targetWidth / targetHeight;
        if (targetRatio > imageRatio) {
          popupImg.style.height = targetHeight + "px";
          popupImg.style.width = (targetHeight * imageRatio) + "px";
        } else {
          popupImg.style.width = targetWidth + "px";
          popupImg.style.height = (targetWidth / imageRatio) + "px";
        }
      };
      document.getElementById('popup-anlage').style.display = 'flex';
    })
    .catch(error => console.error('Fehler beim Abrufen der Anlage:', error));
}

function closeAnlage() {
  document.getElementById('popup-anlage').style.display = 'none';
}
