// --- SVG ICONEN CONFIGURATIE ---
const icons = {
    shutter: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px; display: inline-block;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
    aperture: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px; display: inline-block;"><circle cx="12" cy="12" r="10"></circle><line x1="14.31" y1="8" x2="20.05" y2="17.94"></line><line x1="9.69" y1="8" x2="21.17" y2="8"></line><line x1="7.38" y1="12" x2="13.12" y2="2.06"></line><line x1="9.69" y1="16" x2="3.95" y2="6.06"></line><line x1="14.31" y1="16" x2="2.83" y2="16"></line><line x1="16.62" y1="12" x2="10.88" y2="21.94"></line></svg>`,
    camera: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px; display: inline-block;"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>`
};

// --- HULPFUNCTIES ---
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

// --- OPENFOTO MET EXIF INTEGRATIE ---
/**
 * Deze overschrijft de standaard openFoto en laadt direct de EXIF-data erbij
 * @param {number} index
 */
window.openFoto = function openFoto(index) {
    huidigeIndex = index;
    const wrapper = alleWrappers[huidigeIndex];
    if (!wrapper) return;
    
    const img = wrapper.querySelector('img');
    if (!img) return;
    
    lightbox.style.display = 'flex';
    lightboxImg.src = img.src;
    lightboxCaption.innerHTML = "<em>Metadata laden...</em>";
    
    exifr.parse(img, { iptc: true, tiff: true, xmp: true, wholeFile: true })
        .then(output => {
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

            // Fallbacks
            if (!titel) titel = img.getAttribute('data-title') || img.getAttribute('alt') || "";
            if (!omschrijving) omschrijving = img.getAttribute('data-description') || "";

            // HTML samenstellen
            let completeTekst = "";
            if (titel) completeTekst += `<strong>${titel}</strong>`;
            
            if (omschrijving) {
                completeTekst += (completeTekst ? '<span style="display: block; margin-top: 2px;"></span>' : "") + omschrijving;
            }
            
            if (cameraInfo || settingsInfo) {
            //    completeTekst += (completeTekst ? '<span style="display: block; margin-top: 4px;"></span>' : "") + `<div style="opacity: 0.7; font-size: 13px; line-height: 1.4;">`;
            //    if (cameraInfo) completeTekst += `<div>${icons.camera}${cameraInfo}</div>`;
            //    if (settingsInfo) completeTekst += `<div>${settingsInfo}</div>`;
                completeTekst += `</div>`;
            }

            lightboxCaption.innerHTML = completeTekst;
        })
        .catch(error => {
            console.error("Fout bij uitlezen EXIF:", error);
            const fallbackTitel = img.getAttribute('data-title') || img.getAttribute('alt') || "";
            const fallbackDesc = img.getAttribute('data-description') || "";
            lightboxCaption.innerHTML = fallbackDesc ? `<strong>${fallbackTitel}</strong><br>${fallbackDesc}` : `<strong>${fallbackTitel}</strong>`;
        });
}