// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCb8riZvb8Jlnep5_bSG3_BvseXedeH7HE",
  authDomain: "recipe-app-74786.firebaseapp.com",
  databaseURL: "https://recipe-app-74786.firebaseio.com",
  projectId: "recipe-app-74786",
  storageBucket: "recipe-app-74786.appspot.com",
  appId: "1:588767138515:web:00bcab0cd40afe4c"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// make auth and firestore references
const auth = firebase.auth();
const db = firebase.firestore();

// listen for auth status changes
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    console.log("User id: " + user.uid);
    self.location.href = ("meal-horizontal-grid.html"), event.preventDefault()
  } else {
    console.log("no one is signed in")
    // No user is signed in.
  }
});

$("#signup").on("click", function (e) {

  e.preventDefault();

  email = $("#inputUsername").val().trim();
  password = $("#inputPassword").val().trim();
  console.log(email + " " + password);
  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
  });

})

// Capture Button Click login
$("#login").on("click", function (event) {

  event.preventDefault();
  console.log("login clicked")


  email = $("#loginUsername").val().trim();
  password = $("#loginPassword").val().trim();
  console.log(email)
  console.log(password)

  firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
  })

});