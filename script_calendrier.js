document.addEventListener("DOMContentLoaded", function() {
    const collectionContainer = document.getElementById("collection");

    fetch("fichiers_json/calendar.json")
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                const box = document.createElement("div");
                box.classList.add("box");
                box.innerHTML = `
                    <img src="${item.photo}" alt="${item.nom}">
                    <div class="info">
                        <p class="date">${item.date}</p>
                        <h3>${item.nom}</h3>
                    </div>
                `;
                box.addEventListener("click", () => {
                    localStorage.setItem("selectedItem", JSON.stringify(item));
                    window.location.href = "page_courses.html";
                });
                collectionContainer.appendChild(box);
            });
        })
        .catch(error => console.error("Erreur de chargement du JSON", error));

    const header = document.querySelector("header");
    if (header) {
        header.style.width = "100%";
        header.style.boxSizing = "border-box";
    }
});
