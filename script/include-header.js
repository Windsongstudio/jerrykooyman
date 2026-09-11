function loadHeader() {
  const headerContainer = document.getElementById("site-header");

  if (!headerContainer) {
    console.error("Fout: <div id='site-header'></div> is niet gevonden in de HTML!");
    return;
  }

  fetch("header.html")
    .then(response => {
      if (!response.ok) {
        throw new Error("Kan header.html niet ophalen. Status: " + response.status);
      }
      return response.text();
    })
    .then(html => {
      headerContainer.innerHTML = html;
      console.log("Header succesvol geladen!");
      // Laat de rest van de pagina weten dat de header (en dus de nav) nu in de DOM staat
      document.dispatchEvent(new Event("headerLoaded"));
    })
    .catch(err => console.error("Netwerkfout bij laden header:", err));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadHeader);
} else {
  loadHeader();
}
