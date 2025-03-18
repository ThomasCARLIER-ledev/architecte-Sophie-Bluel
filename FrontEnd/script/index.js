// aller chercher l'ID portfolio //
const portfolio = document.getElementById("portfolio");
console.log(portfolio);

//////////////////////////////////////////////////////////////////////////////////////////////////

// Début de la création de la div avec la classe gallery-title //
const galleryTitle = document.createElement("div");
galleryTitle.classList.add("gallery-title");
portfolio.appendChild(galleryTitle);

// Création de h2 mes projets //
const h2 = document.createElement("h2");
h2.textContent = "Mes projets";
galleryTitle.appendChild(h2);

// Création du button modifier //
const button = document.createElement("button");
button.classList.add("open-modal", "hidden");

// Créer un élément image pour l'icône
const icon = document.createElement("img");
icon.src = "../FrontEnd/assets/icons/Group.svg";
icon.alt = "Modifier";

// Créer un élément span pour le texte
const text = document.createElement("span");
text.textContent = "Modifier";

// Ajouter l'icône et le texte au bouton
button.appendChild(icon);
button.appendChild(text);
galleryTitle.appendChild(button);

// Gestion du bouton modifier//
function updateButtonVisibility() {
  if (localStorage.getItem("token")) {
      // Utilisateur connecté, afficher le bouton
      button.classList.remove("hidden");
  } else {
      // Utilisateur non connecté, masquer le bouton
      button.classList.add("hidden");
  }
}

// Appeler la fonction au chargement de la page et lors des changements d'état de connexion
updateButtonVisibility();
galleryTitle.appendChild(button);


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Création de la div "filters"//
const divFilters = document.createElement("div");

divFilters.classList.add("filters");
console.log(divFilters);

portfolio.appendChild(divFilters);
console.log(divFilters);

// Variable pour stocker le bouton sélectionné
let boutonSelectionne = null;
let buttons; // Déclarer buttons dans une portée plus large

// Fonction pour créer les boutons de filtres
function creerBoutonsFiltres(categories) {
    divFilters.innerHTML = ""; // Effacer les boutons précédents

    // Tableau des noms de boutons
    const buttonNames = ["Tous", ...categories]; // Utilisation de l'opérateur spread (...)

    // Création des boutons et ajout à la div "filters"
    buttonNames.forEach((buttonName, index) => {
      const button = document.createElement("button");
      button.textContent = buttonName;
      divFilters.appendChild(button);
    
      if (index === 0) {
        button.classList.add("selected"); // Ajout de la classe "selected"
      }
    });

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Ajouter la classe "selected" quand un bouton est cliqué //

    // Sélectionner les boutons après leur création
    buttons = document.querySelectorAll(".filters button"); // Initialiser buttons

    // Ajouter les écouteurs d'événements
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            // Supprimer la classe "selected" de tous les boutons
            buttons.forEach(btn => btn.classList.remove("selected"));
            // Ajouter la classe "selected" au bouton cliqué
            button.classList.add("selected");
            boutonSelectionne = button; // Stocker le bouton sélectionné
            afficherTravaux(button.textContent); // Appelle afficherTravaux avec la catégorie
        });
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Création de la div avec la classe gallery //
const gallery = document.createElement("div");
gallery.classList.add("gallery");
portfolio.appendChild(gallery);

// Début de la récupération des données de l'API et les affiches dans la console//
(async () => {
    const works = await getWorks(); // Appel de la fonction getWorks() //
    console.log(works);
    if (works) {
        afficherTravaux(); // Appel de la fonction pour afficher tous les travaux par défaut
    }
})();

async function getWorks() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        return response.json();
    } catch (error) {
        console.error(error);
        return null; // Ajout d'un retour en cas d'erreur
    }
}

// Afficher les travaux dans le DOM //
function afficherTravauxDansLeDom(travaux) {
    gallery.innerHTML = ""; // Nettoyer la galerie avant d'ajouter les travaux
    for (let i = 0; i < travaux.length; i++) {
        const travail = travaux[i];
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const figcaption = document.createElement("figcaption");

        img.src = travail.imageUrl;
        img.alt = travail.title;
        figcaption.textContent = travail.title;

        gallery.appendChild(figure);
        figure.appendChild(img);
        figure.appendChild(figcaption);
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Fonction pour afficher les travaux
async function afficherTravaux(categorie = "Tous") {
    const works = await getWorks();
    if (works) {
        // Utilisation de Set pour extraire les catégories uniques
        const categories = new Set(works.map(travail => travail.category.name));
        if (divFilters.innerHTML === "") {
            creerBoutonsFiltres(Array.from(categories)); // Créer les boutons de filtres uniquement si ils n'existent pas
        }

        let travauxFiltres = works; // Par défaut, tous les travaux

        // Appliquer les filtres
        if (categorie !== "Tous") {
            travauxFiltres = works.filter(travail => travail.category.name === categorie);
        }

        afficherTravauxDansLeDom(travauxFiltres);

        if (boutonSelectionne) {
            buttons.forEach(btn => btn.classList.remove("selected")); // Maintenant buttons est accessible
            boutonSelectionne.classList.add("selected");
        }
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Récupérer les éléments login et logout
const loginLink = document.getElementById("login");
const logoutLink = document.getElementById("logout");

// Fonction pour mettre à jour l'affichage en fonction de l'état de connexion
function updateLoginStatus() {
    if (localStorage.getItem("token")) {
        // Utilisateur connecté
        loginLink.classList.add("hidden");
        logoutLink.classList.remove("hidden");
        divFilters.style.display = "none"; // Masquer les boutons de filtre
        afficherTravaux(); // Afficher tous les travaux
    } else {
        // Utilisateur non connecté
        loginLink.classList.remove("hidden");
        logoutLink.classList.add("hidden");
        divFilters.style.display = "flex"; // Afficher les boutons de filtre
        afficherTravaux(); // Appliquer les filtres
    }
}

// Appeler la fonction au chargement de la page
updateLoginStatus();

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Ajouter un écouteur d'événements pour la déconnexion
logoutLink.addEventListener("click", () => {
    // Supprimer le token du localStorage
    localStorage.removeItem("token");
    // Mettre à jour l'affichage
    updateLoginStatus();
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
