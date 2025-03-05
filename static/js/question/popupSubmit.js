// static/js/question/popupSubmit.js
function submitText() {
  let inputText = document.getElementById("Meldung-input").value;
  fetch("/save_text", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: inputText })
  })
  .then(response => response.json())
  .then(data => {
    document.getElementById("Meldung-input").value = "";
    document.getElementById("Meldung-container").style.display = "none";
  })
  .catch(error => console.error("Fehler:", error));
}
