const form = document.getElementById("loginForm");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("mail").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      const token = data.token;
      localStorage.setItem("token", token);
    //   updateLoginStatus(); // Mettre à jour l'affichage après la connexion
      window.location.href = "./index.html";
    } else {
      const errorMessage = document.createElement("p");
      errorMessage.textContent = "Erreur d'authentification. Veuillez vérifier vos identifiants.";
      errorMessage.classList.add("error-message"); // Ajout de la classe CSS
      form.appendChild(errorMessage);
    }
  } catch (error) {
    console.error(error);
    const errorMessage = document.createElement("p");
    errorMessage.textContent = "Une erreur s'est produite. Veuillez réessayer plus tard.";
    form.appendChild(errorMessage);
  }
});


