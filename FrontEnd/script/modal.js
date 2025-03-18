// Récupération de la section modal-gallery //
const modalGallery=document.querySelector(".modal-gallery");
console.log (modalGallery);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Récupération travaux API //
(async () => {
    const works = await getWorks();
    console.log(works);
    if (works) {
        afficherTravauxDansLaModale(works); // Appel de la fonction pour afficher les images
    }
})();

async function getWorks() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        return response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Afficher les images des travaux et l'icône trash
function afficherTravauxDansLaModale(travaux) {
    const modalGallery = document.querySelector(".modal-gallery"); // Récupérer modalGallery
    if (!modalGallery) {
        console.error("modalGallery non trouvé");
        return;
    }

    modalGallery.innerHTML = ""; // Nettoyer la galerie avant d'ajouter les travaux
    for (let i = 0; i < travaux.length; i++) {
        const travail = travaux[i];
        const figure = document.createElement("figure");
        const image = document.createElement("img");
        const trashBtn = document.createElement ("span");

        image.src = travail.imageUrl; 
        trashBtn.classList.add("bin-container");
        trashBtn.id = travail.id;
        trashBtn.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
        
        figure.appendChild(image);
        figure.appendChild(trashBtn);
        modalGallery.appendChild(figure);
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Début de l'affichage modale_bar (mode édition) //
function afficherOuMasquerModalBar() {
    const modalBar = document.querySelector(".modale_bar");
    if (modalBar) {
        if (localStorage.getItem("token")) {
            // Utilisateur connecté, afficher le bouton
            modalBar.classList.remove("hidden");
        } else {
            // Utilisateur non connecté, masquer le bouton
            modalBar.classList.add("hidden");
        }
    }
}
afficherOuMasquerModalBar();

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

