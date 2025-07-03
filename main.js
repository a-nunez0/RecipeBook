
import recipes from './recipes.mjs';

// Random function
function random(num) {
  return Math.floor(Math.random() * num);
}

// Random recipe
function getRandomListEntry(list) {
  return list[random(list.length)];
}

function tagsTemplate(tags) {
  return tags.join(", ");
}

// Star
function ratingTemplate(rating) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      html += `<span aria-hidden="true" class="icon-star">⭐</span>`;
    } else {
      html += `<span aria-hidden="true" class="icon-star-empty">☆</span>`;
    }
  }
  return html;
}

function recipeTemplate(recipe) {
  return `
    <img src="${recipe.image}" alt="${recipe.alt || recipe.name}" />
    <div class="recipe-info">
      <span class="category">${tagsTemplate(recipe.tags)}</span>
      <h2>${recipe.name}</h2>
      <span class="rating" role="img" aria-label="Rating: ${recipe.rating} out of 5 stars">
        ${ratingTemplate(recipe.rating)}
      </span>
      <p>${recipe.description}</p>
    </div>
  `;
}

function renderRecipe(recipe) {
  const card = document.querySelector('.recipe-card');
  card.innerHTML = recipeTemplate(recipe);
}

// Render multiple recipes
function renderRecipes(recipeList) {
  const card = document.querySelector('.recipe-card');
  if (recipeList.length === 0) {
    card.innerHTML = `<p>No recipes found matching your search.</p>`;
    return;
  }
  card.innerHTML = recipeList.map(recipeTemplate).join('');
}

function filterRecipes(query) {
  if (!query) return recipes;

  const q = query.toLowerCase();

  return recipes.filter(recipe => {
    const inName = recipe.name.toLowerCase().includes(q);
    const inDescription = recipe.description.toLowerCase().includes(q);
    const inTags = recipe.tags.some(tag => tag.toLowerCase().includes(q));
    const inIngredients = recipe.recipeIngredient.some(ing => ing.toLowerCase().includes(q));
    return inName || inDescription || inTags || inIngredients;
  }).sort((a, b) => a.name.localeCompare(b.name));
}

// Handle search form submission
function searchHandler(event) {
  event.preventDefault();
  const input = document.querySelector('input[aria-label="Search recipes"]');
  const query = input.value.trim();
  const filtered = filterRecipes(query);
  renderRecipes(filtered);
}

// Random recipe and search
function init() {
  renderRecipe(getRandomListEntry(recipes));

  const form = document.querySelector('section.search form');
  form.addEventListener('submit', searchHandler);
}

init();

