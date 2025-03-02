////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// Bouton retour haut gauche //////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

document.getElementById("backButton").addEventListener("click", function() {
    window.history.back();
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////// Infos ////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", function () {
    const ecurie = JSON.parse(localStorage.getItem("selectedEcurie"));

    if (!ecurie) {
        console.error("Aucune écurie trouvée !");
        window.location.href = "classement_ecuries.html"; // Redirige si problème
        return;
    }

    // Mise à jour des éléments HTML
    document.getElementById("ecurie-logo").src = ecurie.logo;
    document.getElementById("ecurie-nom").textContent = ecurie.nomComplet;
    document.getElementById("ecurie-points").textContent = `${ecurie.points} points`;

    document.getElementById("voiture-photo").src = ecurie.voiture;
    document.getElementById("nom-voiture").textContent = ecurie.nomVoiture;
    document.getElementById("motoriste").textContent = `Motoriste: ${ecurie.motoriste}`;

    // Charger les pilotes
    fetch("fichiers_json/pilotes.json")
        .then(response => response.json())
        .then(pilotes => {
            const pilote1 = pilotes.find(p => p.nom === ecurie.pilote1);
            const pilote2 = pilotes.find(p => p.nom === ecurie.pilote2);

            afficherPilote(pilote1, "pilote1-container");
            afficherPilote(pilote2, "pilote2-container");
        })
        .catch(error => console.error("Erreur chargement pilotes", error));

    // Mettre à jour les stats
    document.getElementById("nb-championnats").textContent = ecurie.champion;
    document.getElementById("nb-victoires").textContent = ecurie.raceFinish;
    document.getElementById("nb-poles").textContent = ecurie.pole;
    document.getElementById("nb-tours-rapides").textContent = ecurie.fastestLap;
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////// Afficher Pilotes ///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function afficherPilote(pilote, containerId) {
    if (!pilote) return;

    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="pilote-card" data-pilote-id="${pilote.id}">
            <img class="pilote-photo" src="${pilote.photo}" alt="${pilote.nom}">
            <div class="pilote-info">
                <div class="pilote-nom">${pilote.prenom} ${pilote.nom}</div>
                <div class="pilote-numero">#${pilote.numero}</div>
            </div>
        </div>
    `;

    // Rendre la boîte cliquable
    container.querySelector(".pilote-card").addEventListener("click", function () {
        localStorage.setItem("selectedPilot", JSON.stringify(pilote));
        window.location.href = "page_pilote.html";
    });
}





