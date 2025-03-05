(function() {
  var mode_value = "{{ session['mode'] }}";
  console.log("mode_value:", mode_value);
  if (mode_value === "Dunkel") {
    document.body.classList.add('dark-mode');
  }
})();
