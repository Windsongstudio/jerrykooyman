document.addEventListener("DOMContentLoaded", async () => {
    const wrappers = document.querySelectorAll(".foto-wrapper");

    for (const wrapper of wrappers) {
        const img = wrapper.querySelector("img");
        if (!img) continue;

        try {
            // EXIF / IPTC data uitlezen met exifr
            const data = await exifr.parse(img.src, { iptc: true, xmp: true, tiff: true });

            if (data) {
                // Haal titel en beschrijving op uit EXIF, IPTC of val terug op data-attributen/alt
                const title = data.ObjectName || data.ImageDescription || img.getAttribute("data-title") || "";
                const description = data.Caption || data.ImageDescription || img.getAttribute("data-description") || "";

                // Plaats titel onder de foto indien aanwezig
                if (title) {
                    const titleDiv = document.createElement("div");
                    titleDiv.className = "foto-title";
                    titleDiv.textContent = title;
                    wrapper.appendChild(titleDiv);
                }

                // Plaats omschrijving onder de foto indien aanwezig
                if (description && description !== title) {
                    const descDiv = document.createElement("div");
                    descDiv.className = "foto-description";
                    descDiv.textContent = description;
                    wrapper.appendChild(descDiv);
                }
            }
        } catch (error) {
            console.error("Fout bij het uitlezen van EXIF/IPTC voor: " + img.src, error);
        }
    }
});