document.addEventListener('DOMContentLoaded', () => {
    const galerieGrid = document.getElementById('galerie-grid');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const sluitBtn = document.getElementById('js-lightbox-close');
    const volgendeBtn = document.getElementById('js-lightbox-next');
    const vorigeBtn = document.getElementById('js-lightbox-prev');

    let alleWrappers = [];
    let huidigeIndex = 0;

    // --- SVG ICONEN CONFIGURATIE ---
    const icons = {
        shutter: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px; display: inline-block;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
        aperture: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px; display: inline-block;"><circle cx="12" cy="12" r="10"></circle><line x1="14.31" y1="8" x2="20.05" y2="17.94"></line><line x1="9.69" y1="8" x2="21.17" y2="8"></line><line x1="7.38" y1="12" x2="13.12" y2="2.06"></line><line x1="9.69" y1="16" x2="3.95" y2="6.06"></line><line x1="14.31" y1="16" x2="2.83" y2="16"></line><line x1="16.62" y1="12" x2="10.88" y2="21.94"></line></svg>`,
        camera: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px; display: inline-block;"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>`
    };

    function formatteerSluitertijd(expTime) {
        if (!expTime) return "";
        if (expTime >= 1) return `${Math.round(expTime * 10) / 10}s`;
        return `1/${Math.round(1 / expTime)}s`;
    }

    function bepaalCameraInfo(output) {
        const camera = output.Model || "";
        const lens = output.LensModel || "";
        if (camera && lens) return `${camera} + ${lens}`;
        return camera || lens;
    }

    // --- FLICKR LAYOUT ALGORITME (Met Firefox sub-pixel afrondingscorrectie) ---
    function pasFlickrLayoutToe() {
        if (!galerieGrid) return;

        // OP MOBIEL (<= 768px): Laat de CSS het werk doen, geen JavaScript pixel-berekeningen!
        if (window.innerWidth <= 768) {
            alleWrappers = Array.from(galerieGrid.querySelectorAll('.foto-wrapper'));
            alleWrappers.forEach(wrapper => {
                wrapper.style.height = ''; // Wis geforceerde inline hoogtes
                wrapper.style.width = '';  // Wis geforceerde inline breedtes
                const img = wrapper.querySelector('img');
                if (img) img.classList.add('geladen');
            });
            return;
        }

        const targetHoogte = 200; // --- HOOGTE THUMBNAILS INSTELLEN (grote schermen) ---
        const gap = 12;
        
        // Firefox sub-pixel correctie om gaten aan de rechterkant te voorkomen
        const totaleBreedte = Math.floor(galerieGrid.clientWidth) - 1;
        
        alleWrappers = Array.from(galerieGrid.querySelectorAll('.foto-wrapper'));
        if (alleWrappers.length === 0) return;

        let huidigeRij = [];
        let huidigeRijBreedte = 0;

        alleWrappers.forEach((wrapper) => {
            const img = wrapper.querySelector('img');
            if (!img) return;
            
            if (!img.complete || img.naturalWidth === 0) {
                img.onload = () => pasFlickrLayoutToe();
            }

            const aspect = (img.naturalWidth && img.naturalHeight) 
                ? (img.naturalWidth / img.naturalHeight) 
                : (parseFloat(wrapper.dataset.aspect) || 1.5);
            
            wrapper.dataset.aspect = aspect;
            
            const geprojecteerdeBreedte = targetHoogte * aspect;
            const tussenruimtes = huidigeRij.length * gap;

            if (huidigeRijBreedte + geprojecteerdeBreedte + tussenruimtes > totaleBreedte) {
                maakRijSluitend(huidigeRij, huidigeRijBreedte, totaleBreedte, gap, false, targetHoogte);
                huidigeRij = [wrapper];
                huidigeRijBreedte = geprojecteerdeBreedte;
            } else {
                huidigeRij.push(wrapper);
                huidigeRijBreedte += geprojecteerdeBreedte;
            }
        });

        if (huidigeRij.length > 0) {
            const isLaatsteOnvolledigeRij = huidigeRij.length < 3; 
            maakRijSluitend(huidigeRij, huidigeRijBreedte, totaleBreedte, gap, isLaatsteOnvolledigeRij, targetHoogte);
        }
    }

    function maakRijSluitend(rij, rijBreedte, totaleBreedte, gap, isLaatsteRij, targetHoogte) {
        let perfecteHoogte;

        if (isLaatsteRij) {
            // Bereken wat de hoogte zou zijn als we deze laatste rij wél over de breedte uitsmeren,
            // maar stel een maximum in (bijv. 1.5x de targetHoogte) zodat ze niet enorm uitslaan bij 1 foto.
            const beschikbareBreedte = totaleBreedte - ((rij.length - 1) * gap);
            const totaleAspect = rij.reduce((som, wrapper) => som + parseFloat(wrapper.dataset.aspect), 0);
            const berekendeHoogte = beschikbareBreedte / totaleAspect;
            
            // Als er maar 1 of 2 foto's op de laatste rij staan, begrenzen we de hoogte 
            // zodat een losse foto niet het hele scherm vult, maar we rekken hem wel uit tot maximaal 280px 
            // (of pas dit getal naar wens aan) om het gat op te lossen.
            const maxLaatsteHoogte = 280;
            perfecteHoogte = Math.min(berekendeHoogte, maxLaatsteHoogte);
        } else {
            const beschikbareBreedte = totaleBreedte - ((rij.length - 1) * gap);
            const totaleAspect = rij.reduce((som, wrapper) => som + parseFloat(wrapper.dataset.aspect), 0);
            perfecteHoogte = beschikbareBreedte / totaleAspect;
        }

        rij.forEach(wrapper => {
            const aspect = parseFloat(wrapper.dataset.aspect);
            wrapper.style.height = `${perfecteHoogte}px`;
            wrapper.style.width = `${perfecteHoogte * aspect}px`;
            
            const img = wrapper.querySelector('img');
            if (img) img.classList.add('geladen');
        });
    }

    // --- LIGHTBOX & EXIF LOGICA MET VLOEIBARE CROSSFADE ---
    async function openFoto(index) {
        huidigeIndex = index;
        const wrapper = alleWrappers[huidigeIndex];
        if (!wrapper) return;
        const img = wrapper.querySelector('img');
        if (!img) return;

        const isOpen = lightbox.style.display === 'flex';

        if (!isOpen) {
            lightbox.style.display = 'flex';
            lightboxImg.style.opacity = '0';
            lightboxCaption.style.opacity = '0';
            lightboxImg.src = img.src;
            
            lightboxImg.style.transition = 'opacity 0.5s ease-in-out';
            lightboxCaption.style.transition = 'opacity 0.5s ease-in-out';
            
            await new Promise(resolve => setTimeout(resolve, 20));
            lightboxImg.style.opacity = '1';
            lightboxCaption.style.opacity = '1';
        } else {
            lightboxImg.style.transition = 'opacity 0.5s ease-in-out';
            lightboxCaption.style.transition = 'opacity 0.5s ease-in-out';
            lightboxImg.style.opacity = '0';
            lightboxCaption.style.opacity = '0';

            await new Promise(resolve => setTimeout(resolve, 250)); 
            lightboxImg.src = img.src;
            lightboxImg.style.opacity = '1';
            lightboxCaption.style.opacity = '1';
        }

        lightboxCaption.innerHTML = "<em>Metadata laden...</em>";
        lightboxCaption.style.opacity = '1';

        try {
            const output = await exifr.parse(img, { iptc: true, tiff: true, xmp: true, wholeFile: true });
            
            let titel = "";
            let omschrijving = "";
            let cameraInfo = "";
            let settingsInfo = "";

            if (output) {
                titel = output.Title || output.ObjectName || (output.iptc ? (output.iptc.ObjectName || output.iptc.Title) : "") || "";
                omschrijving = output.ImageDescription || output.description || (output.iptc ? output.iptc.Caption : "") || "";
                cameraInfo = bepaalCameraInfo(output);

                const sluitertijd = formatteerSluitertijd(output.ExposureTime);
                const diafragma = output.FNumber ? `f/${output.FNumber}` : "";
                const iso = output.ISOSpeedRatings || "";

                let settingsArray = [];
                if (sluitertijd) settingsArray.push(`${icons.shutter}${sluitertijd}`);
                if (diafragma) settingsArray.push(`${icons.aperture}${diafragma}`);
                if (iso) settingsArray.push(`<span style="font-size: 10px; font-weight: bold; border: 1px solid currentColor; padding: 1px 3px; border-radius: 3px; margin-right: 4px; vertical-align: middle; display: inline-block; line-height: 1;">ISO</span>${iso}`);

                if (settingsArray.length > 0) {
                    settingsInfo = settingsArray.join(' <span style="margin: 0 8px; opacity: 0.4;">|</span> ');
                }
            }

            if (!titel) titel = img.getAttribute('data-title') || img.getAttribute('alt') || "";
            if (!omschrijving) omschrijving = img.getAttribute('data-description') || "";

            let completeTekst = "";
            if (titel) completeTekst += `<strong>${titel}</strong>`;
            if (omschrijving) completeTekst += (completeTekst ? '<span style="display: block; margin-top: 2px;"></span>' : "") + omschrijving;
            
            if (cameraInfo || settingsInfo) {
                completeTekst += `<div style="margin-top: 4px;">`;
                completeTekst += `</div>`;
            }

            lightboxCaption.innerHTML = completeTekst;
        } catch (error) {
            console.error("Fout bij uitlezen EXIF:", error);
            const fallbackTitel = img.getAttribute('data-title') || img.getAttribute('alt') || "";
            const fallbackDesc = img.getAttribute('data-description') || "";
            lightboxCaption.innerHTML = fallbackDesc ? `<strong>${fallbackTitel}</strong><br>${fallbackDesc}` : `<strong>${fallbackTitel}</strong>`;
        }
    }

    function sluitFoto() {
        lightbox.style.display = 'none';
        lightboxImg.src = '';
        lightboxCaption.innerHTML = '';
    }

    function volgendeFoto() {
        huidigeIndex = (huidigeIndex + 1) % alleWrappers.length;
        openFoto(huidigeIndex);
    }

    function vorigeFoto() {
        huidigeIndex = (huidigeIndex - 1 + alleWrappers.length) % alleWrappers.length;
        openFoto(huidigeIndex);
    }

    // --- EVENT LISTENERS ---
    if (galerieGrid) {
        galerieGrid.addEventListener('click', (e) => {
            const img = e.target.closest('.foto-wrapper img');
            if (!img) return;
            const wrapper = img.closest('.foto-wrapper');
            const index = alleWrappers.indexOf(wrapper);
            if (index !== -1) openFoto(index);
        });
    }

    if (sluitBtn) sluitBtn.addEventListener('click', sluitFoto);
    if (volgendeBtn) volgendeBtn.addEventListener('click', volgendeFoto);
    if (vorigeBtn) vorigeBtn.addEventListener('click', vorigeFoto);

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) sluitFoto();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (lightbox && lightbox.style.display === 'flex') {
            if (e.key === 'ArrowRight') volgendeFoto();
            if (e.key === 'ArrowLeft') vorigeFoto();
            if (e.key === 'Escape') sluitFoto();
        }
    });

    window.addEventListener('load', pasFlickrLayoutToe);
    window.addEventListener('resize', pasFlickrLayoutToe);
    pasFlickrLayoutToe();
});