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
// Initialize Firebase database
var database = firebase.database();
const auth = firebase.auth();

//Global variable used to hold the current users unique ID
var userID;

//Get the user id of the current user
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        userID = user.uid;
        console.log("User id: " + userID);
        buildShoppingList();

    } else {
        console.log("no one is signed in")
        self.location.href = ("index.html"), event.preventDefault();
    }
});

var weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Satruday', 'Sunday'];
var shoppingList = [];


//Create a shopping list from all the recipes saved for each day of the week
function buildShoppingList() {
    var index = 0;
    weekdays.forEach(function (weekday) {
        retrieveRecipesFromDB(weekday);
        index++;
        console.log(index);
    });
    if (index === 7) {
        printShoppingList();
    }
}

//Display the Shopping List on the page
function printShoppingList() {
    var list = $("<ul>");

    console.log("Shopping list: " + shoppingList);
    shoppingList.forEach(function (groceryItem) {
        var li = $("<li>").text(groceryItem);
        list.append(li);
    });

    $("#listContainer").append(list);
}

//Retrieve all of the recipes the user has saved for each day
function retrieveRecipesFromDB(day) {

    firebase.database().ref('Users/' + userID + '/weeklyPlan/' + day).once('value').then(function (snapshot) {
        snapshot.forEach(function (child) {
            //This is the recipe object that we use through out the application
            var recipe = child.val().recipe
            console.log(recipe);

            parseIngredients(recipe.ingredientLines);
        });

    });

}

//Parse the ingredient line from the recipe to make it more readable
function parseIngredients(ingredients) {

    ingredients.forEach(function (ingredient) {
        var parsedIngredient = '';
        //Strip out the measurements and additional instructions for each ingredient line
        var ingredientWords = ingredient.split(' ');
        for (var i = 2; i < ingredientWords.length; i++) {
            parsedIngredient += ingredientWords[i] + " ";

        }
        parsedIngredient = parsedIngredient.split(',')[0];
        addToShoppingList(parsedIngredient);
    });

}

//check if this item is already on the list, if not then add it to the list
function addToShoppingList(item) {
    var duplicate = false;
    shoppingList.forEach(function (listItem) {
        if (item === listItem) {
            duplicate = true;;
        }
    });
    if (!duplicate) {
        shoppingList.push(item);
    }
}