const API_SEARCH = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";
const API_LOOKUP = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=";



const status2 = document.getElementById("status");
const formulaire = document.getElementById("search-form");
const input = document.getElementById("query");
const results = document.getElementById("results");
const detail = document.getElementById("detail");


//Écouter la soumission du formulaire (preventDefault)
// Valider la saisie (vide / trop court → message + return)
formulaire.addEventListener("submit", async (event) => {
  event.preventDefault();

  const query = input.value.trim();

  if (!query || query.length < 3) {
    status2.textContent = "Saisis au moins 3 caractères (champ vide interdit).";
    return; 
  }

  // fetch + async/await, response.ok, try/catch
  const requestUrl = API_SEARCH + encodeURIComponent(query);

  try {
    const response = await fetch(requestUrl);
    if (!response.ok) throw new Error("Erreur API");

    const data = await response.json();

    // Gérer drinks === null ou tableau vide
    if (!data.drinks || data.drinks.length === 0) {
      results.textContent = "Aucun cocktail trouvé";
      return;
    }
    //Rendre les cartes dans #results
    status2.textContent = "";
    results.innerHTML = "";

    data.drinks.forEach((drink) => {
      const card = document.createElement("article");
      card.className = "card";
      card.dataset.id = drink.idDrink;

      const img = document.createElement("img");
      img.src = drink.strDrinkThumb;
      img.alt = drink.strDrink;
      img.loading = "lazy";

      const title = document.createElement("h3");
      title.textContent = drink.strDrink;

      

      card.addEventListener("click", async () => {
        const lookupUrl = API_LOOKUP + encodeURIComponent(drink.idDrink);

        try {
          const response = await fetch(lookupUrl);
          const data = await response.json();

          if (!data.drinks || data.drinks.length === 0) {
            detail.textContent = "Détail introuvable.";
            return;
          }

          const d = data.drinks[0];
          const instructions = d.strInstructionsFR || d.strInstructions || "—";

          detail.innerHTML = "<h3>" + d.strDrink + "</h3><p>" + instructions + "</p>";
        } catch (error) {
          console.error(error);
          detail.textContent = "Erreur lors du chargement du détail.";
        }
      });

      card.append(img, title);
      results.append(card);
    });


  } catch (error) {
    console.error(error);
    results.textContent = "Erreur pendant la recherche";
  }
});



  








