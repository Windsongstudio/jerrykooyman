document.addEventListener("headerLoaded", function() {
    // Haal het pad op en haal eventueel .html aan het einde weg
    let currentLocation = window.location.pathname.replace(/\.html$/, '');

    // Haal trailing slash weg (behalve als het pad exact "/" is), en pak laatste segment
    let currentPage = currentLocation.replace(/\/$/, '').split('/').pop();

    // Lege string (homepage) wordt "index"
    if (currentPage === "") {
        currentPage = "index";
    }

    const menuLinks = document.querySelectorAll('nav ul li a');

    menuLinks.forEach(link => {
        let href = link.getAttribute('href');
        if (!href) return;

        // Haal .html weg en pak laatste segment van de href
        let linkPage = href.replace(/\.html$/, '').replace(/\/$/, '').split('/').pop();
        if (linkPage === "") {
            linkPage = "index";
        }

        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
});
