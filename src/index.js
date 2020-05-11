// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import {elements, renderLoader, clearLoader} from './views/base';
/* Global state of the app
* - Search object
* - Current recipe object 
* - SHopping list object
* - likes Recipe
*/
const state = {};


// Search controller
const controlSearch = async () => {
    // 1. Get query from view
    const query = searchView.getInput(); // TO DO
    
    if (query){
        //2. New search object and add to state
        state.search = new Search(query);

        //3. Prepare UI for results
        searchView.clearRecipe();
        renderLoader(elements.searchRes);
        try{
        //4. search for recipes and parse ingridients
        await state.search.getResults();
        
        //5. Render results on UI
        clearLoader();
        searchView.renderResults(state.search.result);
        }catch (err){
            //console.log(err);
            alert('Something went wrong with the search...')
        }//5. Render results on UI
        clearLoader();
    }
}

    elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const button = e.target.closest('.btn-inline');
    if(button) {
        const goToPage = parseInt(button.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);

        //console.log(goToPage);
    }
});

// Recipe controller 

const controlRecipe = async () => {
    // Get ID from url
const id = window.location.hash.replace('#', '');
//const id = 47746;
console.log(id);


if (id){
    // prepare Ui for changes 
    //recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // HIghlightselected search item
    if (state.search) searchView.highlightSelected(id);

    //Create new recipe object 
    state.Recipe = new Recipe(id);
    console.log(state.Recipe)
    try{

    
    // Get recipe data
    await state.Recipe.getRecipe();
    console.log(state.Recipe.getRecipe());
    state.Recipe.parseIngredient();

    // Calculate servings and time 
    state.Recipe.calcTime();
    state.Recipe.calcServings();

    //render recipe
    clearLoader();
    recipeView.renderRecipe(
        state.Recipe,
        state.likes.isLiked(id)
        );
    console.log(state.recipe);
        }catch (err){
            alert('error processing recipe');
            console.log(err);
        }
    }
};



['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// List controller

const controlList = () => {
    // Create new list if there is none yet
    if (!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    state.Recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //Handle delete button
    if(e.target.matches('.shopping__delete', 'shopping__delete *')){
        // Delete from state 
        state.list.deleteItem(id);

        // Delete from UI 
        listView.deleteItem(id);

        // Handle the count update
    } else if(e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount (id, val);
    }
});

//Like Controller
const controlLike = () =>{
    if (!state.likes) state.likes = new Likes();

    const currentID = state.recipe.id;

    //User has not yet liked current recipe
    if (!state.likes.isLiked(currentID)){
        // Add like to state
        const newLike = state.Likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        
        // Toggle like button
        likesView.toggleLikeBtn(true);

        // Add like to Ui list 
        likesView.renderLike(newLike);

        // User has liked current recipe
        }else {
        // Remove like to state
        state.likes.deleteLike(currentID);
            console.log(state.likes);
        // Toggle like button
        likesView.toggleLikeBtn(false);

        // Remove like from Ui list 
        likesView.deleteLike(currentID);
        
    }
    console.log(state.likes);
    likesView.toggleLikeMenu(state.likes.getNumLikes);
};

    // Restore liked recipes on page load
    window.addEventListener('load', () => {
     state.likes = new Likes();

     //Restore likes
    state.likes.readStorage();

     //Toggle like menu button
     likesView.toggleLikeMenu(state.likes.getNumLikes());   

     //Render the existing likes
     state.likes.likes.forEach( likes => likesView.renderLike(likes));
    });

// Handling recepe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')){
        //Decrease button is clicked
        if(state.recipe.servings > 1){
        state.recipe.updateServings('dec');
        recipeView.updateServingsIng(state.recipe);
        }
    }else if (e.target.matches('.btn-increase, .btn-increase *')){
        //increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIng(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        
    //Add to ingredients to list
    controlList();
    }else if (e.target.matches('.recipe__love', '.recipe__love *')){
        // Like controller
        controlLike();
    }
});

