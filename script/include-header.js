function loadHeader() {
  const headerContainer = document.getElementById("site-header");
  if (!headerContainer) return;

  // './' betekent: zoek het bestand in DEZELFDE map als waar de pagina staat
  fetch("./header.html")
    .then(response => {
      if (!response.ok) throw new Error("Status " + response.status);
      return response.text();
    })
    .then(html => {
      headerContainer.innerHTML = html;
    })
    .catch(err => console.error("Fout bij laden header:", err));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadHeader);
} else {
  loadHeader();
}
