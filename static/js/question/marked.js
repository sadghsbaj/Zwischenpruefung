document.addEventListener("DOMContentLoaded", function () {
  const bookmarkBtn = document.querySelector(".bookmark-btn");
  const bookmarkText = bookmarkBtn.querySelector(".btn-text");
  const bookmarkIcon = bookmarkBtn.querySelector(".btn-icon i");

  // Platzhalter-Variable für den Status
  let isBookmarked = false;

  bookmarkBtn.addEventListener("click", function () {
    this.classList.toggle("active");
    isBookmarked = this.classList.contains("active"); // Status speichern

    if (isBookmarked) {
      bookmarkText.textContent = "Gemerkt";
      bookmarkIcon.classList.replace("far", "fas"); // Wechselt das Symbol zu ausgefüllt
    } else {
      bookmarkText.textContent = "Merken";
      bookmarkIcon.classList.replace("fas", "far"); // Wechselt das Symbol zurück
    }

    // 📌 Hier kann man den Status weiterverarbeiten (z. B. in einer API oder DB speichern)
    console.log("Merken-Status:", isBookmarked);
  });
});
