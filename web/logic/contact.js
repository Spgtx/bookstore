document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contact-form");
    const socialsContainer = document.getElementById("social-links");
    const mapContainer = document.getElementById("map-container");

    fetch("/api/contact")
        .then(res => res.json())
        .then(data => {
            const { socials, location } = data;

            for (const [platform, url] of Object.entries(socials)) {
                const link = document.createElement("a");
                link.href = url;
                link.target = "_blank";
                link.innerHTML = `<i class="fab fa-${platform}"></i>`;
                socialsContainer.appendChild(link);
            }

            const mapIframe = document.createElement("iframe");
            mapIframe.src = `https://www.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`;
            mapIframe.width = "100%";
            mapIframe.height = "300";
            mapIframe.style.border = "0";
            mapContainer.appendChild(mapIframe);
        });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = {
            name: form.name.value,
            email: form.email.value,
            message: form.message.value
        };

        const res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        const result = await res.json();
        alert(result.message);
        form.reset();
    });
});
