document.addEventListener("DOMContentLoaded", function() {
    const classementContainer = document.getElementById("classement-container");

    fetch("fichiers_json/ecuries.json")
        .then(response => response.json())
        .then(ecuries => {
            ecuries.sort((a, b) => b.points - a.points);

            ecuries.forEach(ecurie => {
                const ecurieCard = document.createElement("div");
                ecurieCard.classList.add("ecurie-card");

                ecurieCard.dataset.ecurieID = ecurie.id;

                ecurieCard.innerHTML = `
                    <div class="ecurie-points">${ecurie.points}</div>
                    <img class="ecurie-photo" src="${ecurie.logo}" alt="${ecurie.nom}">
                    <div class="ecurie-info">
                        <div class="ecurie-nom">${ecurie.nom}</div>
                    </div>
                    <img class="ecurie-voiture" src="${ecurie.voiture}" alt="${ecurie.nom}">
                `;


                ecurieCard.addEventListener("click", function() {
                    localStorage.setItem("selectedEcurie", JSON.stringify(ecurie));
                    window.location.href = `page_ecurie.html`;
                });

                classementContainer.appendChild(ecurieCard);
            });
        })
        .catch(error => console.error("Erreur de chargement des ecuries", error));
});
