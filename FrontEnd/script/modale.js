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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Début de l'affichage de la modale 1 quand je clique sur le bouton modifier //
const modalContainer = document.querySelector("#modal-container");
console.log(modalContainer);

const openModal = document.querySelector(".open-modal");
console.log(openModal);

const modalWrapper = document.querySelector(".modal-wrapper");

// Ajouter un écouteur d'événement au bouton "modifier"
openModal.addEventListener("click", () => {
    modalContainer.style.display = "block";
});

// Ajouter un écouteur d'événement sur modalContainer
modalContainer.addEventListener("click", (event) => {
    // Masquer modalContainer en ajoutant la classe "hidden"
    modalContainer.style.display = "none";
});

// Empêcher la propagation de l'événement lorsqu'on clique sur modal 1
modalWrapper.addEventListener("click", (event) => {
    event.stopPropagation();
});

// suppression de modal-container quand je clique sur la croix 

const boutonFermer = document.querySelector("button .fa-xmark");
console.log(boutonFermer);

boutonFermer.addEventListener("click", () => {
    modalContainer.style.display = "none";
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Afficher les images des travaux dans .modal-gallery //

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
        const trashBtn = document.createElement("span");

        image.src = travail.imageUrl;
        trashBtn.classList.add("bin-container");
        trashBtn.id = travail.id;
        trashBtn.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;

        // Ajout de l'écouteur d'événements
        trashBtn.addEventListener("click", function (event) { // Ajout de l'argument event
            event.preventDefault(); // Empêche le rechargement de la page
            const idTravail = this.id;
            console.log("Bouton de suppression cliqué pour l'ID :", idTravail);
            supprimerTravail(idTravail);
        });

        figure.appendChild(image);
        figure.appendChild(trashBtn);
        modalGallery.appendChild(figure);
    }
}

async function supprimerTravail(idTravail) {
    const token = localStorage.getItem("token");
    console.log("Token:", token);
    const url = `http://localhost:5678/api/works/${idTravail}`;
    console.log("URL de la requête :", url);
    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.ok) {
            console.log(`Travail ${idTravail} supprimé avec succès.`);
            supprimerTravailDuDOM(idTravail);
            supprimerTravailDeLaGalerie(idTravail);
        } else {
            console.error("Erreur lors de la suppression du travail :", response.status);
        }
    } catch (error) {
        console.error("Erreur lors de la suppression du travail :", error);
    }
}

function supprimerTravailDuDOM(idTravail) {
    const elementTravail = document.getElementById(idTravail).parentElement;
    if (elementTravail) {
        elementTravail.remove();
    }
}

function supprimerTravailDeLaGalerie(idTravail) {
    const elementGalerie = document.querySelector(`.gallery [data-id="${idTravail}"]`);
    if (elementGalerie) {
        elementGalerie.remove();
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Afficher la modale 2 (modal2-container) quand je clique sur "ajouter une photo"

const ajouterPhoto = document.querySelector(".btn-modal");
const formulaire = document.getElementById("modal2-container");

console.log(ajouterPhoto);
console.log(formulaire);

ajouterPhoto.addEventListener("click", () => {
    console.log("Le bouton ajouterPhoto a été cliqué !");
    formulaire.style.display = "block";
});

formulaire.addEventListener("click", (event) => {
    // Empêcher la propagation de l'événement
    event.stopPropagation();
});

// Retour sur la modale 1 quand je clique sur la flèche gauche //
const modal2Container = document.getElementById("modal2-container");

const boutonRetour = modal2Container.querySelector(".fa-arrow-left");
console.log(boutonRetour);

const fermeture = modal2Container.querySelector(".fa-xmark");
console.log(fermeture);

boutonRetour.addEventListener("click", () => {
    modal2Container.style.display = "none";
});

// fermeture modale au clic de la croix fermeture //

fermeture.addEventListener("click", () => {
    modalContainer.style.display = "none";
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Afficher l'image sélectionnée dans la modale 2 //

const inputImg = document.getElementById("input-img");
const previewImg = document.querySelector(".upload-img img");
const imagePreview = document.querySelector(".image-preview");


inputImg.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
        const imageUrl = URL.createObjectURL(file);
        previewImg.src = imageUrl;
        previewImg.style.display = "block"; // Affiche l'image
        document.querySelector(".img-placeholder").style.display = "none"; // Cache le placeholder
        document.querySelector(".upload-img label").style.display = "none"; // Cache le label
        document.querySelector(".upload-img p").style.display = "none"; // Cache le paragraphe
    } else {
        previewImg.src = "#";
        previewImg.style.display = "none";
        document.querySelector(".img-placeholder").style.display = "block";
        document.querySelector(".upload-img label").style.display = "block";
        document.querySelector(".upload-img p").style.display = "block";
        alert("Veuillez sélectionner un fichier image valide.");
    }
});

previewImg.addEventListener("click", () => {
    inputImg.click(); // Déclenche un clic sur l'input file
});

// Affichage de la catégorie dans le select //

async function getCategories() {
    try {
        const response = await fetch("http://localhost:5678/api/categories");
        const categories = await response.json();
        const selectCat = document.getElementById("addCat");

        categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            selectCat.appendChild(option);
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
    }
}

getCategories(); // Appel de la fonction au chargement de la page

// Envoi du formulaire //

const uploadForm = document.querySelector(".upload-works");
const errorMessage = document.querySelector(".error-modal");

uploadForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.getElementById("addTitle").value;
    const category = document.getElementById("addCat").value;
    const image = document.getElementById("input-img").files[0];

    if (!title || !category || !image) {
        errorMessage.textContent = "Veuillez remplir tous les champs.";
        return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", image);

    const token = localStorage.getItem("token");

    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (response.ok) {
            errorMessage.textContent = "";
            const newWork = await response.json();
            ajouterTravailAGalerie(newWork); // Mettre à jour la galerie
            uploadForm.reset(); // Réinitialiser le formulaire
            previewImg.src = "#";
            previewImg.style.display = "none";
            document.querySelector(".img-placeholder").style.display = "block";
            document.querySelector(".upload-img label").style.display = "block";
            document.querySelector(".upload-img p").style.display = "block";
            alert("Travail ajouté avec succès !");
        } else {
            errorMessage.textContent = "Erreur lors de l'ajout du travail.";
        }
    } catch (error) {
        console.error("Erreur lors de l'envoi du formulaire :", error);
        errorMessage.textContent = "Erreur lors de l'envoi du formulaire.";
    }
});

function ajouterTravailAGalerie(travail) {
    const gallery = document.querySelector(".gallery");
    const figure = document.createElement("figure");
    figure.dataset.id = travail.id;
    const image = document.createElement("img");
    image.src = travail.imageUrl;
    image.alt = travail.title;
    const figcaption = document.createElement("figcaption");
    figcaption.textContent = travail.title;

    figure.appendChild(image);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
}


// Vérifier la validité du formulaire //

const titleInput = document.getElementById("addTitle");
const categorySelect = document.getElementById("addCat");
const submitButton = document.getElementById("upload-form-submit");

function checkFormValidity() {
    if (inputImg.files.length > 0 && titleInput.value && categorySelect.value) {
        submitButton.classList.remove("btn-grey");
    } else {
        submitButton.classList.add("btn-grey");
    }
}

// Vérifier la validité du formulaire au chargement de la page
checkFormValidity();

inputImg.addEventListener("change", checkFormValidity);
titleInput.addEventListener("input", checkFormValidity);
categorySelect.addEventListener("change", checkFormValidity);