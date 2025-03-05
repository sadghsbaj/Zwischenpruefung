(function () {
  history.pushState(null, null, location.href);
  window.onpopstate = function () {
    const confirmLeave = confirm("Du kannst nicht zur vorherigen Frage zurückkehren! Möchtest du das lernen beenden?");
    if (confirmLeave) {
      window.location.href = '/ergebnis';
    } else {
      history.pushState(null, null, location.href);
    }
  };
})();
