// static/js/question/popupUpdate.js
function updateOpenTasks() {
  fetch('/open_tasks')
    .then(response => response.json())
    .then(data => {
      document.getElementById('open-tasks').textContent = data.open_tasks;
    })
    .catch(error => console.error('Fehler beim Abrufen der offenen Aufgaben:', error));
}
