// static/js/question/buttonState.js
document.addEventListener('DOMContentLoaded', function() {
  const checkButton = document.querySelector('.check-button');
  const checkTextSpan = checkButton.querySelector('.check-text');

  function updateButtonStyle() {
    if (checkTextSpan.textContent.trim() === 'Weiter') {
      checkButton.classList.add('active');
    } else {
      checkButton.classList.remove('active');
    }
  }
  updateButtonStyle();

  const observer = new MutationObserver(updateButtonStyle);
  observer.observe(checkTextSpan, { characterData: true, childList: true, subtree: true });

  checkButton.addEventListener('click', function() {
    setTimeout(updateButtonStyle, 10);
  });
});
