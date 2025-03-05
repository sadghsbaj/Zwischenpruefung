document.addEventListener("DOMContentLoaded", function () {
  const exitBtn = document.querySelector(".exit-btn"); // Beenden-Button
  const overlay = document.getElementById("confirm-overlay");
  const confirmYes = document.getElementById("confirm-yes");
  const confirmNo = document.getElementById("confirm-no");
  const body = document.body;

  if (exitBtn && overlay && confirmYes && confirmNo) {
    // Pop-up beim Laden verstecken (nur zur Sicherheit)
    overlay.style.display = "none";

    // Beenden-Button klickt -> Pop-up anzeigen und Menü abdunkeln
    exitBtn.addEventListener("click", function (event) {
      event.preventDefault(); // Verhindert direkte Weiterleitung
      overlay.style.display = "flex"; // Pop-up anzeigen
      body.classList.add("popup-active"); // Menü bleibt weiß, Rest wird abgedunkelt
    });

    // Ja-Button klickt -> Weiterleitung zur Flask-Route
    confirmYes.addEventListener("click", function () {
      window.location.href = "/submit_back"; // Flask-Route aufrufen
    });

    // Nein-Button klickt -> Pop-up schließen und Menü zurückholen
    confirmNo.addEventListener("click", function () {
      overlay.style.display = "none";
      body.classList.remove("popup-active"); // Menü bleibt weiterhin weiß
    });

    // Escape-Taste schließt das Pop-up
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        overlay.style.display = "none";
        body.classList.remove("popup-active"); // Menü bleibt weiterhin weiß
      }

      // Enter-Taste als Bestätigung (anstatt auf "Ja"-Button zu klicken)
      if (event.key === "Enter") {
        // Nur reagieren, wenn das Pop-up sichtbar ist
        if (overlay.style.display === "flex") {
          window.location.href = "/submit_back"; // Flask-Route aufrufen
        }
      }
    });

    // Klick außerhalb des Pop-ups schließt es
    overlay.addEventListener("click", function (event) {
      // Verhindern, dass das Pop-up schließt, wenn der Klick auf den inneren Bereich (z.B. "Ja" oder "Nein") war
      if (event.target === overlay) {
        overlay.style.display = "none";
        body.classList.remove("popup-active"); // Menü bleibt weiterhin weiß
      }
    });
  }
});
