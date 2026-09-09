(function() {
  function loadHeader() {
    const headerContainer = document.getElementById("site-header");
    if (!headerContainer) return;

    // Zoek uit waar 'include-header.js' staat op deze specifieke server/hosting
    const scripts = document.getElementsByTagName("script");
    let scriptPath = "";
    
    for (let i = 0; i < scripts.length; i++) {
      if (scripts[i].src && scripts[i].src.includes("include-header.js")) {
        // Haal de map 'script/' eraf om de hoofdmap van de site te krijgen
        scriptPath = scripts[i].src.replace("script/include-header.js", "");
        break;
      }
    }

    // Haal header.html op vanuit exact dezelfde hoofdmap op ELK platform
    fetch(scriptPath + "header.html")
      .then(response => {
        if (!response.ok) {
          throw new Error("HTTP fout! status: " + response.status);
        }
        return response.text();
      })
      .then(html => {
        headerContainer.innerHTML = html;
      })
      .catch(err => console.error("Header kon niet worden geladen:", err));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadHeader);
  } else {
    loadHeader();
  }
})();
