document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.createElement("button");
  toggleBtn.id = "darkModeToggle";

  const html = document.documentElement;
  const storageKey = "site-theme";

  // Función para actualizar el texto según el estado
  function updateLabel() {
    if (html.getAttribute("theme") === "dark-mode") {
      toggleBtn.innerText = "☀️ Modo Claro";
    } else {
      toggleBtn.innerText = "🌓 Modo Oscuro";
    }
  }

  // Inicializar estado
  if (localStorage.getItem(storageKey) === "dark") {
    html.setAttribute("theme", "dark-mode");
  }

  updateLabel();
  document.body.appendChild(toggleBtn);

  toggleBtn.addEventListener("click", () => {
    if (html.getAttribute("theme") === "dark-mode") {
      html.removeAttribute("theme");
      localStorage.setItem(storageKey, "light");
    } else {
      html.setAttribute("theme", "dark-mode");
      localStorage.setItem(storageKey, "dark");
    }
    updateLabel();
  });
});
