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
        detail.innerHTML = "<p>Chargement...</p>";

        const lookupUrl = API_LOOKUP + encodeURIComponent(drink.idDrink);

        try {
          const response = await fetch(lookupUrl);
          if (!response.ok) throw new Error("Erreur API (lookup)");

          const data = await response.json();
          let d;

          if (data.drinks && data.drinks.length > 0) {
            d = data.drinks[0];
          } else {
            d = null; // ou undefined
          }

          const ingredients = [];
          for (let i = 1; i <= 15; i++) {
            const ing = d["strIngredient" + i];
            const meas = d["strMeasure" + i];

            if (ing && ing.trim() !== "") {
             
              const parts = [];
              if (meas && meas.trim() !== "") parts.push(meas.trim());
              parts.push(ing.trim());
            
              const line = parts.join(" ");
              ingredients.push(`<li>${line}</li>`);
            }
          }

          if (!d) {
            detail.innerHTML = "<p>Détail introuvable.</p>";
            return;
          }

          const instructions = (d.strInstructionsFR || d.strInstructions || "").trim();

          detail.innerHTML = `
            <h3>${d.strDrink}</h3>
            <h4>Ingrédients</h4>
            <ul>${ingredients.join("")}</ul>
            <h4>Instructions</h4>
            <p>${instructions || "—"}</p>
          `;
        } catch (error) {
          console.error(error);
          detail.innerHTML = "<p>Erreur lors du chargement du détail.</p>";
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



  








