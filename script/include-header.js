(function () {
  // 1. Bepaal dynamisch de absolute root van de repository/site op basis van de locatie van dit script
  var scripts = document.getElementsByTagName('script');
  var currentScript = document.currentScript || scripts[scripts.length - 1];
  
  // Dit haalt het pad op tot aan de hoofdmap (verwijdert 'script/include-header.js')
  var baseUrl = currentScript.src.replace(/script\/include-header\.js(\?.*)?$/, '');

  function loadHeader() {
    var headerContainer = document.getElementById('site-header');
    if (!headerContainer) return;

    // 2. Haal header.html op vanaf het exact berekende basispad
    fetch(baseUrl + 'header.html')
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Header niet gevonden op: ' + baseUrl + 'header.html (Status ' + response.status + ')');
        }
        return response.text();
      })
      .then(function (html) {
        headerContainer.innerHTML = html;
      })
      .catch(function (err) {
        console.error('Header Load Error:', err);
      });
  }

  // 3. Zorg dat de DOM geladen is voordat het element wordt gezocht
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadHeader);
  } else {
    loadHeader();
  }
})();
