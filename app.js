/* FICTIONAL WORLD LIBRARY — SHARED BROWSER FUNCTIONS */

(() => {
  "use strict";

  const root = document.documentElement;

  function applyTheme(theme) {
    const chosenTheme = theme === "light" ? "light" : "dark";
    root.dataset.theme = chosenTheme;

    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.setAttribute("aria-pressed", String(chosenTheme === "light"));
      button.textContent =
        chosenTheme === "light" ? "Switch to dark mode" : "Switch to light mode";
    });
  }

  let savedTheme = "dark";

  try {
    savedTheme = localStorage.getItem("fwl-theme") || "dark";
  } catch (_) {
    // Keep the default theme if browser storage is unavailable.
  }

  applyTheme(savedTheme);

  document.addEventListener("click", (event) => {
    const themeButton = event.target.closest("[data-theme-toggle]");

    if (themeButton) {
      const nextTheme = root.dataset.theme === "light" ? "dark" : "light";
      applyTheme(nextTheme);

      try {
        localStorage.setItem("fwl-theme", nextTheme);
      } catch (_) {
        // Theme still changes for the current page.
      }
    }

    const menuButton = event.target.closest("[data-more-toggle]");
    const moreMenu = document.querySelector("[data-more-menu]");

    if (menuButton && moreMenu) {
      const opening = moreMenu.hidden;
      moreMenu.hidden = !opening;
      menuButton.setAttribute("aria-expanded", String(opening));
    } else if (
      moreMenu &&
      !event.target.closest("[data-more-menu]")
    ) {
      moreMenu.hidden = true;

      document.querySelectorAll("[data-more-toggle]").forEach((button) => {
        button.setAttribute("aria-expanded", "false");
      });
    }

    const dismissButton = event.target.closest("[data-dismiss]");

    if (dismissButton) {
      const target = document.querySelector(dismissButton.dataset.dismiss);
      if (target) target.hidden = true;
    }
  });

  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  window.FictionalWorld = {
    applyTheme
  };
})();
