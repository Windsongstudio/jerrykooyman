document.addEventListener("DOMContentLoaded", () => {
  const headerContainer = document.getElementById("site-header");
  if (headerContainer) {
    fetch("/header.html")
      .then(response => response.text())
      .then(html => {
        headerContainer.innerHTML = html;
      })
      .catch(err => console.error("Header kon niet worden geladen:", err));
  }
});
