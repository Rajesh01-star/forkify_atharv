import { getJson, sendJson } from './helper';
import { URL, RES_PER_PAGE } from './config';
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createId = function () {
  const random = Math.ceil(Math.random() * 100);
  const id = `5ed6604591c37cdc${random}4bcd${random}`;
  return id;
};

const createRecipeObject = function (data) {
  let { recipe } = data.data;
  return {
    ...(recipe.id && { id: recipe.id }),
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJson(`${URL}/${id}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadResults = async function (query) {
  try {
    const data = await getJson(`${URL}?search=${query}`);
    const { recipes } = data.data;

    state.search.results = recipes.map(res => {
      return {
        id: res.id,
        title: res.title,
        publisher: res.publisher,
        image: res.image_url,
      };
    });
  } catch (err) {
    throw err;
  }
};

export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultPerPage;
  const end = page * state.search.resultPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

const persistBookmark = function () {
  localStorage.setItem('Bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // pushes the recipe into the bookmark array(state)
  state.bookmarks.push(recipe);

  // if the current recipe is the one which was clicked then add an extra property of bookmarked as true
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmark();
};

export const removeBookmark = function (id) {
  // removes the bookmark id from the state(bookmarks) array
  const index = state.bookmarks.findIndex(el => (el.id = id));
  state.bookmarks.splice(index, 1);

  // and if the current recipe page was that page which was clicked then render it as a nonBookMarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmark();
};

// this function will get the recipes from the localStorage and render it to the view
const init = function () {
  const storage = localStorage.getItem('Bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

const clearBookmark = function () {
  localStorage.clear();
};
// clearBookmark();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format. Please use the correct format'
          );

        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      data: {
        recipe: {
          id: createId(),
          title: newRecipe.title,
          source_url: newRecipe.sourceUrl,
          image_url: newRecipe.image,
          publisher: newRecipe.publisher,
          cooking_time: +newRecipe.cookingTime,
          servings: +newRecipe.servings,
          ingredients,
        },
      },
    };

    state.recipe = createRecipeObject(recipe);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
