$(document).on("click", ".toggleFavBut", function () {
    console.log("favorited")
    $(this).toggleClass('favoriteButton far');
    $(this).toggleClass('favoritedButton fas fa-2x');


    var ingredients = [];

    //build an array of the ingredients for the recipe that was clicked
    $(this).parent().find(".list-group-item").each(function () {
        ingredients.push($(this).parent().parent().text())
    })
    var recipe = {
        image: $(this).parent().parent().find(".card-img-top").attr("src"),
        label: $(this).parent().parent().find(".card-title").text(),
        ingredientLines: ingredients,
        url: $(this).parent().parent().find("a").attr("href")
    };
    pushFavorites(recipe);
});

var favorites = "";
//Save the recipe that the user has selected to the database 
function pushFavorites(recipe) {
    //Save the recipe to Firebase
    database.ref(userID + "/favorites").push({
        recipe: recipe
    });

}

var favorites = [];
//retrieve the current user's recipes from the database for the given day
function getFavorites() {
    //  favorites.forEach(function (favorite) {
    //   console.log("hope its started building favs")
    //  firebase.database().ref(userID + "/favorites" + favorite).once('value').then(function (snapshot) {
    firebase.database().ref(userID + "/favorites").once('value').then(function (snapshot) {
        //   console.log("hope it got to here")
        snapshot.forEach(function (child) {
            //This is the recipe object that we use through out the application
            var recipe = child.val();
            console.log(recipe);
            //        console.log("hope its about to build the card")
            buildSavedFavoriteCard(recipe);
            console.log("hope its finished building favs")
        });
    });
    //  })
}

function buildSavedFavoriteCard(recipe) {
    console.log("started building favorite cards")
    $("#favorite-dump").empty();
    favorites.forEach(function (recipe, index) {
        var recipeCard = $("<div>").addClass("card ks-card");

        var img = $("<img>").addClass("card-img-top").attr("src", recipe.image);

        var cardBody = $("<div>").addClass("card-body");

        var title = $("<h5>").addClass("card-title").text(recipe.label);

        var heartButton = $("<button>").addClass("far fa-heart favoriteButton fa-lg toggleFavBut mb-2");

        var recipeButtonHolder = $("<span>").addClass("recipe-link")
        console.log("recipe url: " + recipe.url);
        var recipeButton = $("<a>").addClass("ks-button-close").attr("href", recipe.url).attr("target", "_blank").text("Recipe ");


        var externalSite = $("<i>").addClass("fas fa-external-link-alt fa-xs");

        var ingredients = $("<ul>").addClass("list-group list-group-flush hiddenIngredientList");

        recipeButtonHolder.append(recipeButton)

        recipe.ingredientLines.forEach(function (ingredient) {
            console.log("ingredients: " + ingredient);
            var li = $("<li>").addClass("list-group-item").text(ingredient);
            ingredients.append(li);
        });

        var ingredientsButton = $("<button>").addClass("ks-button-recipe ingredientsButtonClick").attr("data-toggle", "modal").attr("data-target", "#ingredientsModal").text("Ingredients");
        ingredientsButton.on("click", function () {
            console.log("ingredient button clicked")
            $(".modalDump").empty();
            $(".recipe-dump").empty(); //recipe link
            var clickedRecipeCard = $(this).parent();

            console.log(ingredients);
            $(".modalDump").html(ingredients);
            $(".modalDump").find(".hiddenIngredientList").removeClass("hiddenIngredientList");
            var recipeButtonHolder = clickedRecipeCard.find(".recipe-link").html(); //recipe link
            console.log("recipe link " + recipe.url); //recipe link
            $(".recipe-dump").html(recipeButtonHolder); //recipe link
        });

        cardBody.append(title, heartButton, ingredients, ingredientsButton, recipeButtonHolder);

        recipeButton.append(externalSite);

        recipeCard.append(img, cardBody);

        // Appending to page

        $("#favorite-dump").append(recipeCard);
    });
} 
