let highThemeInterval = null;

// Für High-Theme: Bei mouseenter wird eine zufällige Regenbogenfarbe gesetzt.
function randomRainbowEffect(e) {
  e.currentTarget.dataset.hover = "true";
  const rainbowColors = ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#8F00FF"];
  const randomColor = rainbowColors[Math.floor(Math.random() * rainbowColors.length)];
  e.currentTarget.style.backgroundColor = randomColor;
}
// Bei mouseleave: setze Hover-Flag auf false.
function resetHoverFlag(e) {
  e.currentTarget.dataset.hover = "false";
}

// Themes in folgender Reihenfolge:
// Standard: Dark, White
// Special: Coruscant, Dagobah, Mustafa, High
const themes = [
  {
    name: "Dark",
    animated: false,
    special: false,
    properties: {
      "--bg-body": "#f5f5f5",
      "--bg-calculator": "#1e1e1e",
      "--bg-display": "#292929",
      "--bg-key": "#333333",
      "--bg-key-hover": "#444444",
      "--bg-key-special": "#5a5a5a",
      "--bg-key-special-hover": "#6e6e6e",
      "--bg-key-equals": "#c0392b",
      "--bg-key-equals-hover": "#e74c3c",
      "--color-text": "#ffffff",
      "--color-operator": "#c0392b",
      "--color-placeholder": "#b0b0b0",
      "--selection-bg": "#c0392b",
      "--selection-color": "#ffffff"
    }
  },
  {
    name: "White",
    animated: false,
    special: false,
    properties: {
      "--bg-body": "#f5f5f5",
      "--bg-calculator": "#ffffff",
      "--bg-display": "#e0e0e0",
      "--bg-key": "#f0f0f0",
      "--bg-key-hover": "#e8e8e8",
      "--bg-key-special": "#dcdcdc",
      "--bg-key-special-hover": "#cfcfcf",
      "--bg-key-equals": "#2980b9",
      "--bg-key-equals-hover": "#3498db",
      "--color-text": "#333333",
      "--color-operator": "#2980b9",
      "--color-placeholder": "#7f8c8d",
      "--selection-bg": "#2980b9",
      "--selection-color": "#ffffff"
    }
  },
  {
    name: "Coruscant",
    animated: true,
    special: true,
    properties: {
      "--bg-body": "#121212",
      "--bg-calculator": "linear-gradient(135deg, #666666, #888888)",
      "--bg-display": "linear-gradient(135deg, #555555, #777777)",
      "--bg-key": "#666666",
      "--bg-key-hover": "#777777",
      "--bg-key-special": "#666666",
      "--bg-key-special-hover": "#777777",
      "--bg-key-equals": "#999999",
      "--bg-key-equals-hover": "#bbbbbb",
      "--color-text": "#ffffff",
      "--color-operator": "#cccccc",
      "--color-placeholder": "#dddddd",
      "--selection-bg": "#888888",
      "--selection-color": "#ffffff"
    }
  },
  {
    name: "Dagobah",
    animated: true,
    special: true,
    properties: {
      "--bg-body": "#1a1a1a",
      "--bg-calculator": "linear-gradient(45deg, #4b3621, #556b2f)",
      "--bg-display": "linear-gradient(45deg, #4b5320, #3e3a1e)",
      "--bg-key": "#2a2a2a",
      "--bg-key-hover": "#3a3a3a",
      "--bg-key-special": "#2a2a2a",
      "--bg-key-special-hover": "#3a3a3a",
      "--bg-key-equals": "#7c8b6f",
      "--bg-key-equals-hover": "#6a7a5c",
      "--color-text": "#d0d7c0",
      "--color-operator": "#7c8b6f",
      "--color-placeholder": "#a0a8a0",
      "--selection-bg": "#7c8b6f",
      "--selection-color": "#d0d7c0"
    }
  },
  {
    name: "Mustafa",
    animated: true,
    special: true,
    properties: {
      "--bg-body": "#1a0a0a",
      "--bg-calculator": "linear-gradient(135deg, #3a0000, #8b0000)",
      "--bg-display": "linear-gradient(135deg, #a62c2c, #ff4500, #e25822)",
      "--bg-key": "#2a2a2a",
      "--bg-key-hover": "#3a3a3a",
      "--bg-key-special": "#2a2a2a",
      "--bg-key-special-hover": "#3a3a3a",
      "--bg-key-equals": "#ff6f61",
      "--bg-key-equals-hover": "#ff8a65",
      "--color-text": "#ffe5e0",
      "--color-operator": "#ff6f61",
      "--color-placeholder": "#d1a3a0",
      "--selection-bg": "#ff6f61",
      "--selection-color": "#ffe5e0"
    }
  },
  {
    name: "High",
    animated: true,
    special: true,
    properties: {
      "--bg-body": "#0d0d0d",
      "--bg-calculator": "linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8f00ff)",
      "--bg-display": "linear-gradient(45deg, #8f00ff, #4b0082, #0000ff, #00ff00, #ffff00, #ff7f00, #ff0000)",
      "--bg-key": "#333333",
      "--bg-key-hover": "#444444",
      "--bg-key-special": "#333333",
      "--bg-key-special-hover": "#444444",
      "--bg-key-equals": "#ff4081",
      "--bg-key-equals-hover": "#f50057",
      "--color-text": "#ffffff",
      "--color-operator": "#ff4081",
      "--color-placeholder": "#aaaaaa",
      "--selection-bg": "#ff4081",
      "--selection-color": "#ffffff"
    }
  }
];

const themeButton = document.getElementById("themeButton");
const themeDropdown = document.getElementById("themeDropdown");
const themeList = document.getElementById("themeList");
const calculatorEl = document.getElementById("calculator");
const displayEl = document.querySelector('.display');
const yodaIcon = document.getElementById("yodaIcon");
const lightsaberIcon = document.getElementById("lightsaberIcon");
const coruscantIcon = document.getElementById("coruscantIcon");
const separator = document.getElementById("separator");

// Dropdown-Menü füllen: Überschriften "Standard" und "Special" bleiben klickinaktiv
function populateThemeDropdown() {
  themeList.innerHTML = "";

  const standardHeading = document.createElement("li");
  standardHeading.textContent = "Standard";
  standardHeading.classList.add("theme-heading");
  themeList.appendChild(standardHeading);

  themes.filter(t => !t.special).forEach(theme => {
    const li = document.createElement("li");
    li.textContent = theme.name;
    li.dataset.index = themes.indexOf(theme);
    li.addEventListener("click", (e) => {
      e.stopPropagation();
      applyTheme(themes[li.dataset.index]);
      themeDropdown.style.display = "none";
    });
    themeList.appendChild(li);
  });

  const specialHeading = document.createElement("li");
  specialHeading.textContent = "Special";
  specialHeading.classList.add("theme-heading");
  themeList.appendChild(specialHeading);

  themes.filter(t => t.special).forEach(theme => {
    const li = document.createElement("li");
    li.textContent = theme.name;
    li.dataset.index = themes.indexOf(theme);
    li.addEventListener("click", (e) => {
      e.stopPropagation();
      applyTheme(themes[li.dataset.index]);
      themeDropdown.style.display = "none";
    });
    themeList.appendChild(li);
  });
}
populateThemeDropdown();

themeButton.addEventListener("click", (e) => {
  e.stopPropagation();
  themeDropdown.style.display = themeDropdown.style.display === "block" ? "none" : "block";
});
document.addEventListener("click", () => {
  themeDropdown.style.display = "none";
});

function applyTheme(theme) {
  const root = document.documentElement;
  for (let key in theme.properties) {
    root.style.setProperty(key, theme.properties[key]);
  }
  root.style.setProperty('--separator-color', theme.special ? "#333333" : "#444444");

  theme.animated ? calculatorEl.classList.add("animated") : calculatorEl.classList.remove("animated");
  theme.special ? calculatorEl.classList.add("special") : calculatorEl.classList.remove("special");

  displayEl.classList.remove('display-cosmic', 'display-mustafa', 'display-dagobah');
  if (theme.name === 'High') {
    displayEl.classList.add('display-cosmic');
  } else if (theme.name === 'Mustafa') {
    displayEl.classList.add('display-mustafa');
  } else if (theme.name === 'Dagobah') {
    displayEl.classList.add('display-dagobah');
  }

  separator.style.display = theme.special ? "block" : "none";

  // Icons: jeweils nur eines sichtbar, alle unten links
  yodaIcon.style.display = "none";
  lightsaberIcon.style.display = "none";
  coruscantIcon.style.display = "none";
  if (theme.name === 'Dagobah') {
    yodaIcon.style.display = "block";
  } else if (theme.name === 'Mustafa') {
    lightsaberIcon.style.display = "block";
  } else if (theme.name === 'Coruscant') {
    coruscantIcon.style.display = "block";
  }

  // High-Theme: Regenbogen-Hover-Effekt
  if (theme.name === 'High') {
    if (highThemeInterval) {
      clearInterval(highThemeInterval);
      highThemeInterval = null;
    }
    document.querySelectorAll('.keys button').forEach(button => {
      button.addEventListener('mouseenter', randomRainbowEffect);
      button.addEventListener('mouseleave', resetHoverFlag);
      button.dataset.hover = "false";
    });
    highThemeInterval = setInterval(() => {
      document.querySelectorAll('.keys button').forEach(button => {
        if (button.dataset.hover !== "true") {
          button.style.removeProperty("background-color");
        }
      });
    }, 300);
  } else {
    if (highThemeInterval) {
      clearInterval(highThemeInterval);
      highThemeInterval = null;
    }
    document.querySelectorAll('.keys button').forEach(button => {
      button.removeEventListener('mouseenter', randomRainbowEffect);
      button.removeEventListener('mouseleave', resetHoverFlag);
      button.style.removeProperty("background-color");
      button.dataset.hover = "false";
    });
  }
}

applyTheme(themes[0]);

// Sound-Logik: Beim Klick auf eines der Icons wird entweder ein zufälliger Sound (aus brother.mp3, doit.mp3, power.mp3, senate.mp3, under.mp3, hate.mp3, general.mp3)
// abgespielt oder, falls bereits ein Sound läuft, dieser gestoppt.
const soundFiles = ["brother.mp3", "doit.mp3", "power.mp3", "senate.mp3", "under.mp3", "hate.mp3", "general.mp3"];
let currentAudio = null;

function toggleSound() {
  if (currentAudio && !currentAudio.paused) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    return;
  }
  const randomSound = soundFiles[Math.floor(Math.random() * soundFiles.length)];
  currentAudio = new Audio("/static/sounds/" + randomSound);
  currentAudio.play();
  currentAudio.onended = function() {
    currentAudio = null;
  };
}

// Alle Icons lösen denselben Sound aus.
yodaIcon.addEventListener("click", toggleSound);
lightsaberIcon.addEventListener("click", toggleSound);
coruscantIcon.addEventListener("click", toggleSound);
