document.addEventListener("DOMContentLoaded", function() {
    // Haal het pad op en haal eventueel .php aan het einde weg
    let currentLocation = window.location.pathname.replace('.php', '');
    
    // Zorg dat een lege URL of alleen een slash wordt gezien als de homepage ('/')
    if (currentLocation === "" || currentLocation === "./") {
        currentLocation = "./";
    }

    const menuLinks = document.querySelectorAll('nav ul li a');
    
    menuLinks.forEach(link => {
        let href = link.getAttribute('href');
        
        // Haal ook bij de href eventueel .php weg voor de zekerheid
        if (href) {
            href = href.replace('.php', '');
        }
        
        // Check voor de homepage
        if (currentLocation === "./" && (href === "/" || href === "" || href === "index")) {
            link.classList.add('active');
        } 
        // Check voor alle andere pagina's (bijv. /portfolio matcht met portfolio)
        else if (href && href !== "./" && currentLocation.includes(href)) {
            link.classList.add('active');
        }
    });
});
