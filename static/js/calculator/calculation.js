// Transformiert einen internen Bruch-Ausdruck in eine optisch ansprechende Darstellung:
// Hier belassen wir die Funktion, falls du später noch Anpassungen vornehmen möchtest.
function transformFraction(str) {
  return str;
}

// Hilfsfunktion zum Finden der passenden öffnenden Klammer (rückwärts)
function findMatchingOpenParen(expr, closePos) {
  let balance = 1;
  for (let i = closePos - 1; i >= 0; i--) {
    if (expr[i] === ')') balance++;
    else if (expr[i] === '(') balance--;
    if (balance === 0) return i;
  }
  return -1;
}

// Hilfsfunktion zum Finden der passenden schließenden Klammer (vorwärts)
function findMatchingCloseParen(expr, openPos) {
  let balance = 1;
  for (let i = openPos + 1; i < expr.length; i++) {
    if (expr[i] === '(') balance++;
    else if (expr[i] === ')') balance--;
    if (balance === 0) return i;
  }
  return -1;
}

// Ersetzt Bruchausdrücke im Format "(Zähler) ⁄ (Nenner)" durch "(Zähler)/(Nenner)"
// Diese Funktion berücksichtigt verschachtelte Klammern in Zähler und Nenner.
function replaceFractions(expr) {
  // Entferne Leerzeichen um den Bruchoperator, damit das Parsing funktioniert
  let newExpr = expr.replace(/\s*⁄\s*/g, "⁄");
  let index = newExpr.indexOf('⁄');
  while (index !== -1) {
    // Für den Zähler: Es wird erwartet, dass direkt vor dem Bruchoperator ein ')'
    let numEnd = index - 1;
    if (newExpr[numEnd] !== ')') break; // Formatfehler – verlasse die Schleife
    let numStart = findMatchingOpenParen(newExpr, numEnd);
    if (numStart === -1) break;
    let numerator = newExpr.substring(numStart, numEnd + 1);

    // Für den Nenner: Direkt nach dem Bruchoperator muss ein öffnender Klammerteil folgen
    let denomStart = newExpr.indexOf('(', index);
    if (denomStart === -1) break;
    let denomEnd = findMatchingCloseParen(newExpr, denomStart);
    if (denomEnd === -1) break;
    let denominator = newExpr.substring(denomStart, denomEnd + 1);

    let fractionStr = numerator + "⁄" + denominator;
    let divisionStr = numerator + "/" + denominator;
    newExpr = newExpr.replace(fractionStr, divisionStr);
    index = newExpr.indexOf('⁄');
  }
  return newExpr;
}

// Diese Funktion wandelt Klammergruppen so um, dass bei Gruppen mit mindestens
// zwei aufeinanderfolgenden öffnenden Klammern das korrespondierende Schließen
// als "]" angezeigt wird.
function transformDisplayHistory(str) {
  let output = "";
  let stack = [];
  let i = 0;
  while (i < str.length) {
    let ch = str[i];
    if (ch === '(') {
      // Zähle, wie viele aufeinanderfolgende '(' vorliegen
      let count = 0;
      while (i < str.length && str[i] === '(') {
        count++;
        i++;
      }
      if (count >= 2) {
        // Gib aus: erste Klammer als "[" und die restlichen als normale "("
        output += "[" + "(".repeat(count - 1);
        // Im Stack merken wir uns, dass die erste Klammer "special" ist
        stack.push({ special: true });
        for (let j = 1; j < count; j++) {
          stack.push({ special: false });
        }
      } else {
        output += "(";
        stack.push({ special: false });
      }
    } else if (ch === ')') {
      // Beim Schließen: Hole den zuletzt gepushten Marker
      if (stack.length > 0) {
        let marker = stack.pop();
        output += marker.special ? "]" : ")";
      } else {
        output += ")";
      }
      i++;
    } else {
      output += ch;
      i++;
    }
  }
  return output;
}

document.addEventListener("DOMContentLoaded", function() {
  // DOM-Elemente des Rechners
  const buttons = document.querySelectorAll(".keys button");
  const inputDisplay = document.querySelector(".display input");
  const historyElements = document.querySelectorAll(".display-line.placeholder");

  // Elemente des Fraction-Popups
  const fractionPopup = document.getElementById("fractionPopup");
  const numeratorInput = document.getElementById("numeratorInput");
  const denominatorInput = document.getElementById("denominatorInput");
  const fractionOkButton = document.getElementById("fractionOkButton");
  const fractionCancelButton = document.getElementById("fractionCancelButton");

  let expression = "";
  let lastAnswer = "";
  let lastCalculation = "";
  let history = [];
  let resultDisplayed = false;
  let openSqrtCount = 0;

  // Merke, welches Fraction-Eingabefeld zuletzt aktiv war
  let lastFractionInput = null;
  numeratorInput.addEventListener("focus", () => { lastFractionInput = numeratorInput; });
  denominatorInput.addEventListener("focus", () => { lastFractionInput = denominatorInput; });

  // Aktualisiert die Anzeige und den Verlauf
  function updateDisplay() {
    if (!resultDisplayed) {
      let displayExpr = expression.replace(/\./g, ",");
      displayExpr = transformDisplayHistory(displayExpr);
      displayExpr = transformFraction(displayExpr);
      inputDisplay.value = displayExpr;
    }
    historyElements.forEach((el, i) => {
      let index = history.length - historyElements.length + i;
      if (index >= 0) {
        let historyDisplay = history[index].replace(/\./g, ",");
        historyDisplay = transformDisplayHistory(historyDisplay);
        historyDisplay = transformFraction(historyDisplay);
        el.textContent = historyDisplay;
      } else {
        el.textContent = "\u00A0";
      }
    });
  }

  // Löscht den aktuellen Ausdruck
  function clearExpression() {
    expression = "";
    resultDisplayed = false;
    openSqrtCount = 0;
    updateDisplay();
  }

  // Keydown-Event (hier nur für die Wurzel-Klammern)
  document.addEventListener('keydown', function(e) {
    if(e.key === "ArrowRight") {
      if(openSqrtCount > 0) {
        expression += ")";
        openSqrtCount--;
        updateDisplay();
        e.preventDefault();
      }
    }
  });

  // --- Fraction-Popup Logik ---
  function openFractionPopup() {
    numeratorInput.value = "";
    denominatorInput.value = "";
    fractionPopup.style.display = "block";
    lastFractionInput = numeratorInput;
    numeratorInput.focus();
  }

  function closeFractionPopup() {
    fractionPopup.style.display = "none";
  }

  fractionOkButton.addEventListener("click", function() {
    const numerator = numeratorInput.value.trim();
    const denominator = denominatorInput.value.trim();
    if (numerator === "" || denominator === "") {
      alert("Bitte Zähler und Nenner eingeben.");
      return;
    }
    expression += "(" + numerator + ") ⁄ (" + denominator + ")";
    closeFractionPopup();
    updateDisplay();
  });

  fractionCancelButton.addEventListener("click", function() {
    closeFractionPopup();
  });

  // --- Tasten-Eventlistener ---
  buttons.forEach(button => {
    button.addEventListener("click", function() {
      // Falls das Fraction-Popup sichtbar ist, leite alle Tastenanschläge an das aktive Eingabefeld weiter.
      if (fractionPopup.style.display !== "none") {
        let activeInput = lastFractionInput || numeratorInput;
        if (button.classList.contains("key-frac")) {
          return;
        }
        if (button.classList.contains("key-back")) {
          activeInput.value = activeInput.value.slice(0, -1);
        }
        else if (button.classList.contains("key-clear")) {
          activeInput.value = "";
        }
        else if (button.classList.contains("key-comma")) {
          activeInput.value += ".";
        }
        else if (button.classList.contains("key-open")) {
          activeInput.value += "(";
        }
        else if (button.classList.contains("key-close")) {
          activeInput.value += ")";
        }
        else if (button.classList.contains("key-plus")) {
          activeInput.value += "+";
        }
        else if (button.classList.contains("key-minus")) {
          activeInput.value += "-";
        }
        else if (button.classList.contains("key-multiply")) {
          activeInput.value += "*";
        }
        else if (button.classList.contains("key-divide")) {
          activeInput.value += "/";
        }
        else if (button.classList.contains("key-ans")) {
          activeInput.value += "ans";
        }
        else if (button.classList.contains("key-wurzel")) {
          activeInput.value += "√(";
        }
        else if (button.classList.contains("key-equals")) {
          // Keine Aktion im Fraction-Modus.
        }
        else {
          let textToInsert = "";
          const iconEl = button.querySelector('.icon');
          if (iconEl) {
            textToInsert = iconEl.textContent.trim();
          } else {
            textToInsert = button.textContent.trim();
          }
          activeInput.value += textToInsert;
        }
        return;
      }

      // --- Normale Berechnung außerhalb des Fraction-Popups ---
      // Falls bereits ein Ergebnis angezeigt wurde:
      // Drückt der Nutzer eine Zahl (0-9) oder das Komma, wird die Zeile komplett gelöscht,
      // andernfalls wird das Ergebnis beibehalten.
      if (resultDisplayed && !button.classList.contains("key-copy")) {
        if (
          button.classList.contains("key-0") ||
          button.classList.contains("key-1") ||
          button.classList.contains("key-2") ||
          button.classList.contains("key-3") ||
          button.classList.contains("key-4") ||
          button.classList.contains("key-5") ||
          button.classList.contains("key-6") ||
          button.classList.contains("key-7") ||
          button.classList.contains("key-8") ||
          button.classList.contains("key-9") ||
          button.classList.contains("key-comma")
        ) {
          expression = "";
        } else {
          expression = lastAnswer;
        }
        resultDisplayed = false;
      }

      if (button.classList.contains("key-close")) {
        expression += ")";
        const closePos = expression.length - 1;
        const openPos = findMatchingOpenParen(expression, closePos);
        if (openPos !== -1) {
          if (openPos >= 1 && expression[openPos - 1] === '√') {
            openSqrtCount = Math.max(openSqrtCount - 1, 0);
          }
        }
      }
      else if (button.classList.contains("key-0")) {
        if(expression.endsWith("ans")) expression += "*";
        expression += "0";
      }
      else if (button.classList.contains("key-1")) {
        if(expression.endsWith("ans")) expression += "*";
        expression += "1";
      }
      else if (button.classList.contains("key-2")) {
        if(expression.endsWith("ans")) expression += "*";
        expression += "2";
      }
      else if (button.classList.contains("key-3")) {
        if(expression.endsWith("ans")) expression += "*";
        expression += "3";
      }
      else if (button.classList.contains("key-4")) {
        if(expression.endsWith("ans")) expression += "*";
        expression += "4";
      }
      else if (button.classList.contains("key-5")) {
        if(expression.endsWith("ans")) expression += "*";
        expression += "5";
      }
      else if (button.classList.contains("key-6")) {
        if(expression.endsWith("ans")) expression += "*";
        expression += "6";
      }
      else if (button.classList.contains("key-7")) {
        if(expression.endsWith("ans")) expression += "*";
        expression += "7";
      }
      else if (button.classList.contains("key-8")) {
        if(expression.endsWith("ans")) expression += "*";
        expression += "8";
      }
      else if (button.classList.contains("key-9")) {
        if(expression.endsWith("ans")) expression += "*";
        expression += "9";
      }
      else if (button.classList.contains("key-plus")) expression += "+";
      else if (button.classList.contains("key-minus")) expression += "-";
      else if (button.classList.contains("key-multiply")) expression += "*";
      else if (button.classList.contains("key-divide")) expression += "/";
      else if (button.classList.contains("key-comma")) expression += ".";
      else if (button.classList.contains("key-open")) expression += "(";
      else if (button.classList.contains("key-ans")) {
        if(expression.endsWith("ans")) expression += "*";
        expression += "ans";
      }
      else if (button.classList.contains("key-wurzel")) {
        if(openSqrtCount > 0) {
          expression += ")";
          openSqrtCount--;
        }
        expression += "√(";
        openSqrtCount++;
      }
      else if (button.classList.contains("key-frac")) {
        openFractionPopup();
      }
      else if (button.classList.contains("key-clear")) {
        clearExpression();
      }
      else if (button.classList.contains("key-back")) {
        expression = expression.slice(0, -1);
      }
      else if (button.classList.contains("key-copy")) {
        const text = resultDisplayed ? lastAnswer : expression;
        navigator.clipboard.writeText(text);
      }
      else if (button.classList.contains("key-equals")) {
        while(openSqrtCount > 0) {
          expression += ")";
          openSqrtCount--;
        }
        try {
          lastCalculation = expression;
          const currentAns = lastAnswer;
          let evalExpr = replaceFractions(expression)
                           .replace(/ans/g, currentAns)
                           .replace(/√\(/g, "Math.sqrt(");
          const result = eval(evalExpr);
          // Hier wird nun das gerundete Ergebnis (auf 2 Nachkommastellen) ermittelt
          let roundedResult = result.toFixed(2);
          lastAnswer = roundedResult;
          history.push(`${transformFraction(lastCalculation.replace(/ans/g, currentAns))} = ${roundedResult.replace('.', ',')}`);
          inputDisplay.value = `= ${roundedResult.replace('.', ',')}`;
          expression = roundedResult;
          resultDisplayed = true;
        } catch (e) {
          expression = "Error";
          updateDisplay();
          setTimeout(clearExpression, 1500);
        }
      }
      updateDisplay();
    });
  });

  updateDisplay();
});

// keyboard.js
document.addEventListener('DOMContentLoaded', function() {
  let lastClickWasInside = false;
  const calculator = document.getElementById('calculator');
  const inputDisplay = document.querySelector('.display input');
  let longPressTimer = null;
  let currentKey = null;
  const LONG_PRESS_DELAY = 1000;

  // Key-Mapping für Long-Press
  const specialKeys = {
    '7': { normal: '7', replace: '/', button: '.key-divide' },
    '+': { normal: '+', replace: '*', button: '.key-multiply' }
  };

  document.addEventListener('click', function(e) {
    lastClickWasInside = calculator.contains(e.target) || document.getElementById('fractionPopup').contains(e.target);
  });

  document.addEventListener('keydown', function(e) {
    if (!lastClickWasInside) return;

    const key = e.key;

    // Strg+C-Handler
    if (e.ctrlKey && key.toLowerCase() === 'c') {
      handleCtrlC(e);
      return;
    }

    // Long-Press-Initialisierung
    if (specialKeys[key] && !e.repeat) {
      currentKey = key;
      longPressTimer = setTimeout(() => {
        handleLongPress();
      }, LONG_PRESS_DELAY);
    }

    // Blockiere Auto-Repeat für Special-Keys
    if (specialKeys[key] && e.repeat) {
      e.preventDefault();
      return;
    }

    // Standard-Tastenverarbeitung
    handleNormalKeyPress(key, e);
  });

  document.addEventListener('keyup', function(e) {
    if (specialKeys[e.key]) {
      clearTimeout(longPressTimer);
      currentKey = null;
    }
  });

  function handleCtrlC(e) {
    const selection = window.getSelection().toString();
    if (!selection.trim()) {
      e.preventDefault();
      document.querySelector('.key-copy').click();
    }
  }

  function handleLongPress() {
    if (!currentKey || !specialKeys[currentKey]) return;

    const replacement = specialKeys[currentKey];
    const currentValue = inputDisplay.value;

    // Ersetze das letzte Zeichen nur wenn es das normale Zeichen ist
    if (currentValue.endsWith(replacement.normal)) {
      inputDisplay.value = currentValue.slice(0, -1) + replacement.replace;
      const button = document.querySelector(replacement.button);
      if (button) button.click();
    }
  }

  function handleNormalKeyPress(key, e) {
    let button = null;

    switch(key) {
      case '0': case '1': case '2': case '3': case '4': case '5':
      case '6': case '7': case '8': case '9':
        button = document.querySelector(`.key-${key}`);
        break;
      case '+': button = document.querySelector('.key-plus'); break;
      case '-': button = document.querySelector('.key-minus'); break;
      case '*': button = document.querySelector('.key-multiply'); break;
      case '/': button = document.querySelector('.key-divide'); break;
      case '(': button = document.querySelector('.key-open'); break;
      case ')': button = document.querySelector('.key-close'); break;
      case ',': case '.': button = document.querySelector('.key-comma'); break;
      case 'Enter': button = document.querySelector('.key-equals'); break;
      case 'Backspace': button = document.querySelector('.key-back'); break;
      case 'Delete': button = document.querySelector('.key-clear'); break;
    }

    if (button) {
      e.preventDefault();
      button.click();
      inputDisplay.focus();
    }
  }
});