document.addEventListener("DOMContentLoaded", function() {
    const classementContainer = document.getElementById("classement-container");

    fetch("fichiers_json/pilotes.json")
        .then(response => response.json())
        .then(pilotes => {
            // Trier les pilotes par nombre de points
            pilotes.sort((a, b) => b.points - a.points);

            // Générer l'affichage HTML
            pilotes.forEach(pilote => {
                const piloteCard = document.createElement("div");
                piloteCard.classList.add("pilote-card");

                // Ajouter un ID au pilote pour l'identifier dans l'URL
                piloteCard.dataset.piloteId = pilote.id;

                piloteCard.innerHTML = `
                    <div class="pilote-points">${pilote.points}</div>
                    <img class="pilote-photo" src="${pilote.photo}" alt="${pilote.nom}">
                    <div class="pilote-info">
                        <div class="pilote-nom">${pilote.prenom} ${pilote.nom}</div>
                        <div class="pilote-ecurie">${pilote.ecurie}</div>
                    </div>
                    <div class="pilote-numero">${pilote.numero}</div>
                `;


                piloteCard.addEventListener("click", function() {
                    localStorage.setItem("selectedPilot", JSON.stringify(pilote));
                    window.location.href = `page_pilote.html`;
                });

                classementContainer.appendChild(piloteCard);
            });
        })
        .catch(error => console.error("Erreur de chargement des pilotes", error));
});
