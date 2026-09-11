document.addEventListener("DOMContentLoaded", function() {

    // Haalt het laatste deel van het pad op (de bestandsnaam), negeert subfolders
    function getPageName(path) {
        // Verwijder query strings (?x=y) en hash (#section)
        path = path.split('?')[0].split('#')[0];
        // Haal laatste segment na de laatste "/"
        let segment = path.substring(path.lastIndexOf('/') + 1);
        // Verwijder .html of .php extensie
        segment = segment.replace(/\.(html|php)$/i, '');
        // Lege string (homepage zonder bestandsnaam) wordt "index"
        return segment === '' ? 'index' : segment;
    }

    const currentPage = getPageName(window.location.pathname);
    const menuLinks = document.querySelectorAll('nav ul li a');

    menuLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;

        const linkPage = getPageName(href);

        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
});
