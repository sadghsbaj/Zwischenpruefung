document.addEventListener("DOMContentLoaded", function () {
    const sideMenu = document.querySelector(".side-menu");
    const toggleIcon = document.querySelector(".toggle-icon");
    const container = document.querySelector(".container");

    // Funktion zum Öffnen und Schließen des Menüs
    function toggleMenu() {
        // Menü-Status toggeln
        sideMenu.classList.toggle("open");

        // Toggle-Button Hervorhebung
        toggleIcon.classList.toggle("active");

        // Optional: Container anpassen
        if (sideMenu.classList.contains("open")) {
            container.style.marginRight = `calc(${getComputedStyle(sideMenu).width} + ${getComputedStyle(document.documentElement).getPropertyValue('--container-margin')})`;
        } else {
            container.style.marginRight = "var(--container-margin)";
        }
    }

    // Event für den Toggle-Button
    toggleIcon.addEventListener("click", toggleMenu);

    // Event für die Pfeiltasten (Links und Rechts)
    document.addEventListener("keydown", function (event) {
        if (event.key === "ArrowLeft") {
            // Menü öffnen bei Pfeil nach links
            if (!sideMenu.classList.contains("open")) {
                toggleMenu();
            }
        } else if (event.key === "ArrowRight") {
            // Menü schließen bei Pfeil nach rechts
            if (sideMenu.classList.contains("open")) {
                toggleMenu();
            }
        }
    });
});
