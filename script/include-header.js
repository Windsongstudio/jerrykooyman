function injectHeader() {
  const headerContainer = document.getElementById("site-header");

  // Als het element nog niet op het scherm staat, probeer het over 50ms opnieuw
  if (!headerContainer) {
    setTimeout(injectHeader, 50);
    return;
  }

  // Element is gevonden! Haal nu header.html op
  fetch("header.html")
    .then(response => {
      if (!response.ok) {
        throw new Error("Kan header.html niet vinden (Status: " + response.status + ")");
      }
      return response.text();
    })
    .then(html => {
      headerContainer.innerHTML = html;
    })
    .catch(err => {
      console.error("Header laadfout:", err);
    });
}

// Start direct de controle zodra het script wordt aangeroepen
injectHeader();
