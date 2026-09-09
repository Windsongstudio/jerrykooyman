document.addEventListener("DOMContentLoaded", () => {
  const headerContainer = document.getElementById("site-header");
  if (headerContainer) {
    // Relatief pad gebruiken (zonder / vooraan)
    fetch("header.html")
      .then(response => {
        if (!response.ok) throw new Error("Netwerkfout bij laden header");
        return response.text();
      })
      .then(html => {
        headerContainer.innerHTML = html;
      })
      .catch(err => console.error("Header kon niet worden geladen:", err));
  }
});
