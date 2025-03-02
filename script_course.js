document.addEventListener("DOMContentLoaded", function() {
    const item = JSON.parse(localStorage.getItem("selectedItem"));
    if (!item) {
        window.location.href = "page_calendrier.html";
        return;
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////// Affichage du nom et image GP //////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    document.getElementById("nom").textContent = item.nom;
    document.getElementById("photo").src = item.photo;
    document.getElementById("photo").alt = item.nom;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////// Affichage en grand horraire course ///////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const today = new Date();
    today.setHours(0, 0, 0, 0); // On enlève les heures/minutes pour comparer uniquement les dates

    console.log("Date du jour :", today);

    function formatDate(dateStr) {
        if (!dateStr) return null; // Vérifie que la date n'est pas undefined ou null
        const parts = dateStr.split("-"); // Séparer "JJ-MM-AAAA"
        if (parts.length !== 3) return null; // Vérifier que la date est correcte
        return `${parts[2]}-${parts[1]}-${parts[0]}`; // Transformer en "AAAA-MM-JJ"
    }

// Vérifier que item existe et a des dates avant de les formater
    if (item && item.dateDebut && item.dateFin) {
        const dateDebutStr = formatDate(item.dateDebut);
        const dateFinStr = formatDate(item.dateFin);

        const dateDebutGP = dateDebutStr ? new Date(dateDebutStr) : null;
        const dateFinGP = dateFinStr ? new Date(dateFinStr) : null;

        const raceTimeContainer = document.getElementById("race-time-container");
        const raceTimeElement = document.getElementById("race-time");

        if (today >= dateDebutGP && today <= dateFinGP) {
            raceTimeElement.innerHTML = `<strong>🏁 Début de la course : ${item.course}</strong>`;
            raceTimeContainer.style.display = "block";
        } else {
            raceTimeContainer.style.display = "none";
        }

    } else {
        console.error("Les dates du GP ne sont pas disponibles :", item);
    }



    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////// Affichage tableau horraires ///////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    let tableHTML = "";
    if (item.sprint === "true") {
        tableHTML = `
            <tr><th>Essais Libres 1</th><td>${item.fp1}</td></tr>
            <tr><th>Qualifications Sprint</th><td>${item.sprintQualif}</td></tr>
            <tr><th>Course Sprint</th><td>${item.sprintRace}</td></tr>
            <tr><th>Qualifications</th><td>${item.qualif}</td></tr>
            <tr><th>Course</th><td>${item.course}</td></tr>
        `;
    } else {
        tableHTML = `
            <tr><th>Essais Libres 1</th><td>${item.fp1}</td></tr>
            <tr><th>Essais Libres 2</th><td>${item.fp2}</td></tr>
            <tr><th>Essais Libres 3</th><td>${item.fp3}</td></tr>
            <tr><th>Qualifications</th><td>${item.qualif}</td></tr>
            <tr><th>Course</th><td>${item.course}</td></tr>
        `;
    }

    document.getElementById("scheduleTable").innerHTML = tableHTML;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////// Affichage panneau info circuit //////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    if (item.circuit) {
        document.getElementById("circuit-info").innerHTML = `
            <p><strong>${item.circuit.nomCircuit}</strong></p>
            <img src="${item.circuit.schemaCircuit}" alt="Schéma du circuit" class="circuit-schema">
            <p><strong>Nombre de tours :</strong> ${item.circuit.laps} tours</p>
            <p><strong>Longueur :</strong> ${item.circuit.longueur} km</p>
            <p><strong>Distance :</strong> ${item.circuit.distance} km</p>
            <p><strong>Record du circuit :</strong> ${item.circuit.record} par ${item.circuit.nomRecord}</p>
        `;
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////// Recup info panneau grille qualif //////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const qualifsFile = `fichiers_json/qualifs/${item.fichier}_qualifs.json`;
    const pilotesFile = "fichiers_json/pilotes.json";

    Promise.all([
        fetch(qualifsFile).then(response => response.json()),
        fetch(pilotesFile).then(response => response.json())
    ])
        .then(([qualifsData, pilotesData]) => {
            // Créer une map pour accéder rapidement aux pilotes par leur nom
            const pilotesMap = {};
            pilotesData.forEach(pilote => {
                pilotesMap[pilote.nom] = pilote;
            });

            // Associer les données de qualification avec les pilotes
            const grille = qualifsData
                .filter(q => q.position) // On enlève ceux qui n'ont pas de position
                .map(q => ({
                    position: q.position,
                    ecart: q.ecart,
                    pilote: pilotesMap[q.nom] || null // Associe le pilote s'il existe
                }))
                .filter(entry => entry.pilote); // On enlève ceux qui ne matchent pas

            // Trier par position sur la grille (ordre croissant)
            grille.sort((a, b) => a.position - b.position);

            // Générer l'affichage HTML
            displayGridQualif(grille);
        })
        .catch(error => console.error("Erreur de chargement des fichiers JSON", error));

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////// Affichage panneau grille qualif ///////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function displayGridQualif(grille) {
        const gridContainer = document.getElementById("grid-container-qualifications");
        gridContainer.innerHTML = "";

        if (grille.length === 0)
        {
            gridContainer.innerHTML = '<p class="no-data-message"> ⏳ Pas encore assez d\'informations pour afficher la grille.</p>';
            return;
        }

        let row;
        grille.forEach((entry, index) => {
            if (index % 2 === 0) {
                // Nouvelle ligne toutes les 2 voitures
                row = document.createElement("div");
                row.classList.add("grid-row");
                gridContainer.appendChild(row);
            }

            // Création de la case pilote
            const pilotBox = document.createElement("div");
            pilotBox.classList.add("pilot-box");

            pilotBox.innerHTML = `
            <img class="voiture" src="${entry.pilote.voiture}" alt="Voiture de ${entry.pilote.nom}">
            <p class="nom">${entry.pilote.prenom} ${entry.pilote.nom}</p>
            <p class="ecart">${entry.ecart || "—"}</p>
        `;

            row.appendChild(pilotBox);
        });
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////// Recup info panneau grille course //////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    const courseFile = `fichiers_json/courses/${item.fichier}_course.json`;

    Promise.all([
        fetch(courseFile).then(response => response.json()),
        fetch(pilotesFile).then(response => response.json())
    ])
        .then(([courseData, pilotesData]) => {
            // Créer une map pour accéder rapidement aux pilotes par leur nom
            const pilotesMap = {};
            pilotesData.forEach(pilote => {
                pilotesMap[pilote.nom] = pilote;
            });

            // Associer les données de qualification avec les pilotes
            const grille = courseData
                .filter(q => q.position) // On enlève ceux qui n'ont pas de position
                .map(q => ({
                    position: q.position,
                    ecart: q.ecart,
                    pilote: pilotesMap[q.nom] || null // Associe le pilote s'il existe
                }))
                .filter(entry => entry.pilote); // On enlève ceux qui ne matchent pas

            // Trier par position sur la grille (ordre croissant)
            grille.sort((a, b) => a.position - b.position);

            // Générer l'affichage HTML
            displayGridCourse(grille);
        })
        .catch(error => console.error("Erreur de chargement des fichiers JSON", error));

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////// Affichage panneau grille course //////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function displayGridCourse(grille) {
        const gridContainer = document.getElementById("grid-container-course");
        gridContainer.innerHTML = "";

        if (grille.length === 0)
        {
            gridContainer.innerHTML = '<p class="no-data-message"> ⏳ Pas encore assez d\'informations pour afficher la grille.</p>';
            return;
        }

        let row;
        grille.forEach((entry, index) => {
            if (index % 2 === 0) {
                // Nouvelle ligne toutes les 2 voitures
                row = document.createElement("div");
                row.classList.add("grid-row");
                gridContainer.appendChild(row);
            }

            // Création de la case pilote
            const pilotBox = document.createElement("div");
            pilotBox.classList.add("pilot-box");

            pilotBox.innerHTML = `
            <img class="voiture" src="${entry.pilote.voiture}" alt="Voiture de ${entry.pilote.nom}">
            <p class="nom">${entry.pilote.prenom} ${entry.pilote.nom}</p>
            <p class="ecart">${entry.ecart || "—"}</p>
        `;

            row.appendChild(pilotBox);
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////// Decalage position grille //////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    document.querySelectorAll(".grid-row").forEach((row, index) => {
        const leftPilot = row.querySelector(".pilot-box:first-child");
        if (index % 2 === 0) {
            leftPilot.style.transform = "translateY(40px)";
        }
    });



    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////// Systeme affichage des panneaux //////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    document.querySelectorAll(".accordion-header").forEach(button => {
        button.addEventListener("click", function () {
            const content = this.nextElementSibling;
            const parent = this.parentElement;

            if (parent.classList.contains("active")) {
                parent.classList.remove("active");
                content.style.maxHeight = "0px";
            } else {
                parent.classList.add("active");
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////// Bouton retour haut gauche //////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    document.getElementById("backButton").addEventListener("click", function() {
        window.history.back();
    });
});
