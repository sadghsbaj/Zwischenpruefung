
  fetch('templates/calculator/calculator.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('calculator-container').innerHTML = html;

      // Jetzt die Scripts aus calculator.html laden und ausführen
      let scripts = document.getElementById('calculator-container').getElementsByTagName('script');
      for (let script of scripts) {
        let newScript = document.createElement('script');
        if (script.src) {
          newScript.src = script.src; // Falls es ein externes Script ist
        } else {
          newScript.textContent = script.textContent; // Falls es Inline-JavaScript ist
        }
        document.body.appendChild(newScript);
      }
    })
    .catch(error => console.error('Fehler beim Laden des Rechners:', error));

