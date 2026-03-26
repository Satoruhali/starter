# Cocktail Explorer (JS) — Récap des étapes

Petit mémo des étapes implémentées dans `script.js` pour construire l’app de recherche de cocktails avec [TheCocktailDB].

## 1) Connexion au DOM
- Récupération des éléments :
  - `#search-form` (formulaire)
  - `#query` (champ de recherche)
  - `#status` (message utilisateur)
  - `#results` (zone des résultats)
  - `#detail` (zone détail)

## 2) Validation de la saisie (avant tout appel API)
- Au `submit` du formulaire :
  - `event.preventDefault()`
  - `query = input.value.trim()`
  - Si vide ou trop court (`< 3`) :
    - message clair dans `#status`
    - `return` pour éviter un appel API inutile

## 3) Appel API de recherche (SEARCH)
- Construction de l’URL :
  - `API_SEARCH + encodeURIComponent(query)`
- `fetch` avec `async/await` dans un `try/catch`
- Vérification de `response.ok`
- Conversion JSON : `await response.json()`
- Gestion du cas “aucun résultat” :
  - l’API renvoie `data.drinks === null`
  - on affiche “Aucun cocktail trouvé”

## 4) Affichage des résultats sous forme de cards
- Nettoyage avant rendu :
  - `results.innerHTML = ""`
  - `status` remis à vide
- Pour chaque cocktail (`data.drinks.forEach`) :
  - création d’une card (`article.card`)
  - image (`strDrinkThumb`) + titre (`strDrink`)
  - stockage de l’identifiant `idDrink` via `data-id`

## 5) Clic sur une card → appel API de détail (LOOKUP)
- Ajout d’un `click` sur chaque card
- Au clic :
  - affichage immédiat de “Chargement...” dans `#detail`
  - construction de l’URL :
    - `API_LOOKUP + encodeURIComponent(idDrink)`
  - 2ᵉ `fetch` dans un **nouveau** `try/catch`
  - récupération du 1er élément de `data.drinks` (souvent un tableau de 1)

## 6) Affichage du détail (ingrédients + instructions)
- Ingrédients :
  - boucle de 1 à 15 (format de l’API : `strIngredient1..15`, `strMeasure1..15`)
  - on ignore les champs vides
  - création d’une liste `<ul><li>...</li></ul>`
- Instructions :
  - priorité à `strInstructionsFR`, sinon `strInstructions`
- Injection dans `#detail` via `innerHTML`

## 7) Gestion des erreurs (UX + console)
- `try/catch` pour la recherche et pour le détail
- En cas d’erreur :
  - `console.error(error)`
  - message utilisateur dans `#results` ou `#detail`

## Tester rapidement
1. Ouvrir `index.html` dans le navigateur
2. Taper un terme (ex. `margarita`) puis **Rechercher**
3. Cliquer une card → le détail s’affiche (ingrédients + instructions)

[TheCocktailDB]: https://www.thecocktaildb.com/
