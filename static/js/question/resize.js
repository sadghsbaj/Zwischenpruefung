document.addEventListener("DOMContentLoaded", function() {
  // Funktion, die die Schriftgröße eines Elements so anpasst, dass der Text nicht umbricht
  function adjustFontSize(el) {
    // Ermitteln der Breite des übergeordneten Elements als Container-Breite
    let containerWidth = el.parentElement.clientWidth;
    // Aktuelle Schriftgröße aus den berechneten Styles
    let computedStyle = window.getComputedStyle(el);
    let fontSize = parseFloat(computedStyle.fontSize);
    const minFontSize = 10; // Minimale Schriftgröße in px

    // Erstellen eines Klons zur Messung ohne Zeilenumbruch
    let clone = el.cloneNode(true);
    clone.style.visibility = 'hidden';
    clone.style.whiteSpace = 'nowrap';  // Erzwingt, dass der Text in einer Zeile bleibt
    clone.style.position = 'absolute';
    clone.style.fontSize = fontSize + "px";
    document.body.appendChild(clone);

    let textWidth = clone.offsetWidth;

    // Solange der Text breiter ist als der Container und noch nicht die minimale Schriftgröße erreicht ist:
    while (textWidth > containerWidth && fontSize > minFontSize) {
      fontSize -= 1;
      clone.style.fontSize = fontSize + "px";
      textWidth = clone.offsetWidth;
    }

    // Angepasste Schriftgröße auf das Originalelement anwenden
    el.style.fontSize = fontSize + "px";
    document.body.removeChild(clone);
  }

  // Anpassung für alle Elemente mit der Klasse "question-text"
  let elements = document.querySelectorAll('.question-text');
  elements.forEach(function(el) {
    adjustFontSize(el);
  });

  // Optional: Neu anpassen beim Ändern der Fenstergröße
  window.addEventListener("resize", function() {
    elements.forEach(function(el) {
      // Es kann sinnvoll sein, vor der Neuberechnung den ursprünglichen Wert wiederherzustellen.
      // Hier wird direkt die adjustFontSize-Funktion aufgerufen.
      adjustFontSize(el);
    });
  });
});
