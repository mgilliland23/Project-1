// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCb8riZvb8Jlnep5_bSG3_BvseXedeH7HE",
    authDomain: "recipe-app-74786.firebaseapp.com",
    databaseURL: "https://recipe-app-74786.firebaseio.com",
    projectId: "recipe-app-74786",
    storageBucket: "recipe-app-74786.appspot.com",
    messagingSenderId: "588767138515",
    appId: "1:588767138515:web:00bcab0cd40afe4c"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();// Initialize Firebase (YOUR OWN APP)
const auth = firebase.auth();

//Global variable used to hold the current users unique ID
var userID;

//Global variable used to keep track of the day the user is currently viewing
var currentDay = "Monday";

//Get the user id of the current user
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        userID = user.uid;
        console.log("User id: " + userID);
        getSavedRecipes(currentDay);
        getFavorites()

    } else {
        console.log("no one is signed in")
        self.location.href = ("index.html"), event.preventDefault();
    }
});

// click handler for logout
$("#logout").on("click", function (event) {
    event.preventDefault();
    auth.signOut().then(() => {
        console.log('user signed out');
    })
    self.location.href = ("index.html"), event.preventDefault()
});

//click handler for weekday buttons
$(".ks-weekButtons").on("click", function () {
    console.log($(this).attr("id"));
    currentDay = $(this).attr("id");

    $("#breakfast").empty();
    $("#lunch").empty();
    $("#dinner").empty();

    getSavedRecipes(currentDay);

})

//Add event listener to our global drake variable to remove recipes from database
drake.on('remove', function (el, container, source) {
    //This is the element (card) that is being removed
    console.log(el);
    //This gives us the id of the container that we removed the card from
    console.log(source.id);

    removeRecipeFromDB(source.id);
    console.log("removed");
});

//Add event listener to our global drake variable to add recipes to database
drake.on('drop', function (el, target) {
    console.log("dropped");
    console.log(el);
    console.log(target.id);
    //this is the ID of the container the card was dropped in
    //target.id

    getRecipeFromCard(el);
})

var meals = ['breakfast', 'lunch', 'dinner'];
//retrieve the current user's recipes from the database for the given day
function getSavedRecipes(day) {
    meals.forEach(function (meal) {
        firebase.database().ref(userID + '/' + day + '/' + meal).once('value').then(function (snapshot) {
            snapshot.forEach(function (child) {
                //This is the recipe object that we use through out the application
                var recipe = child.val();
                console.log(recipe);
                console.log(meal);
                buildSavedRecipeCard(recipe, meal);
            });
        });
    })
}

function buildSavedRecipeCard(recipe, meal) {
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
        // $(".modalDump").empty();
        // $(".recipe-dump").empty(); //recipe link
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

    /* Ingredients Modal Logic */


    if (meal === 'breakfast') {
        $("#breakfast").append(recipeCard);
    }
    else if (meal === 'lunch') {
        $("#lunch").append(recipeCard);
    }
    else if (meal === 'dinner') {
        $("#dinner").append(recipeCard);
    }
}

function removeRecipeFromDB(meal) {
    console.log("removing saved recipe from database...");
    firebase.database().ref(userID + '/' + currentDay).child(meal).remove();
}

function getRecipeFromCard(card) {

    var ingredients = [];

    //build an array of the ingredients for the recipe that was clicked
    $(card).find(".list-group-item").each(function () {
        ingredients.push($(this).text());
    });

    var recipe = {
        image: $(card).find(".card-img-top").attr("src"),
        label: $(card).find(".card-title").text(),
        ingredientLines: ingredients,
        url: $(card).find("a").attr("href")
    };

    var meal = $(card).parent().attr("id");

    addRecipeToDB(recipe, meal);
}



//Save the recipe that the user has selected to the database 
function addRecipeToDB(recipe, meal) {
    //Save the recipe to Firebase
    database.ref(userID + '/' + currentDay + "/" + meal).set({
        recipe: recipe
    });

}

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

/* var favorites = [];
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
}  */
