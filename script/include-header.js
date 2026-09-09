document.addEventListener("DOMContentLoaded", () => {
  const headerContainer = document.getElementById("site-header");
  if (!headerContainer) return;

  // Gebruik direct een relatief pad zonder schuine strepen vooraan
  fetch("header.html")
    .then(response => {
      if (!response.ok) {
        throw new Error("HTTP fout! Status: " + response.status);
      }
      return response.text();
    })
    .then(html => {
      headerContainer.innerHTML = html;
    })
    .catch(err => {
      console.error("Fout bij laden van header.html:", err);
    });
});
