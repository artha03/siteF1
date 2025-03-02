////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// Bouton retour haut gauche //////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

document.getElementById("backButton").addEventListener("click", function() {
    window.history.back();
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////// Infos ////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    document.addEventListener("DOMContentLoaded", function() {
        const pilote = JSON.parse(localStorage.getItem("selectedPilot"));

        if (!pilote) {
            console.error("Aucun pilote trouvé !");
            window.location.href = "page_classement_pilotes.html"; // Redirection si aucun pilote
            return;
        }

        if (pilote) {
            document.getElementById("pilote-nom").textContent = `${pilote.prenom} ${pilote.nom}`;
            document.getElementById("pilote-photo").src = pilote.photo;
            document.getElementById("pilote-photo").alt = pilote.nom;
            document.getElementById("pilote-ecurie").textContent = pilote.ecurie;
            document.getElementById("pilote-points").textContent = pilote.points;
            if (pilote.numero) {
                document.getElementById("pilote-numero").textContent = pilote.numero;
            } else {
                document.getElementById("pilote-numero").textContent = "N/A";
            }
            document.getElementById("pilote-nationalite").src = pilote.photoNationalite;

            // Informations supplémentaires
            document.getElementById("pilote-naissance").textContent = pilote.dateNaissance;
            document.getElementById("pilote-gp").textContent = pilote.grandPrix;
            document.getElementById("pilote-podiums").textContent = pilote.podium;
            document.getElementById("pilote-victoires").textContent = pilote.raceFinish;
            document.getElementById("pilote-grille").textContent = pilote.gridFinish;
            document.getElementById("pilote-championnats").textContent = pilote.champion;
        } else {
            document.querySelector(".container").innerHTML = "<p>Pilote introuvable.</p>";
        }
    });


