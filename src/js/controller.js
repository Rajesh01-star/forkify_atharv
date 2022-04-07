import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { timeout } from './helper.js';

// if (module.hot) {
//   module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    resultsView.update(model.getSearchResultPage());

    bookmarksView.update(model.state.bookmarks);

    // loading recipe
    await model.loadRecipe(id);

    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};
controlRecipe();

const controlSearchResults = async function () {
  try {
    // get the query
    const query = searchView.getQuery();
    if (!query) return;

    // load the search results
    await model.loadResults(query);

    // render the data into the data field
    resultsView.render(model.getSearchResultPage());

    // render pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    recipeView.renderError(err);
  }
};

const controlPagination = function (goToPage) {
  // rendering the new pages
  resultsView.render(model.getSearchResultPage(goToPage));
  // rendering the new pagination buttons
  paginationView.render(model.state.search);
};

controlSearchResults();

const controlServings = function (newServings) {
  // Update the servings in the state
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // add/ remove bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);

  // it'll update the bookmark-icon
  recipeView.update(model.state.recipe);

  // show it in the bookmark view on the right
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmark = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show the renderSpinner
    addRecipeView.renderSpinner();

    // Upload the recipe to the API
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // render the uploaded recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, 2500);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmark);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
