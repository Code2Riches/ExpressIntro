// Bring in Express code
const express = require("express");

// Bring in body parser so that we can parse the POST request body
const bodyParser = require('body-parser')

// Initiallize the Server and Port
const app = express();
const port = 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Global scope variables so that all routes can gain access to them
let queryParamFirstName = null;
let queryParamLastName = null;
let favoriteMovieList = [];
let newMovie = null;

// For the assignment, make sure favoriteMovieList is in the global scope
// const favoriteMovieList = []
const myName = "Christian Benites";
const today = new Date();
const todayBasic = today.toLocaleDateString();
favoriteMovieList = ["Matrix", "Bourne", "Another Movie"];

// Define the default server route (aka "/") for our server
app.get("/", (req, res) => {
  console.log("Default Route");
  res.send(`My Name is ${myName}. Today is ${todayBasic}`);
});

// An example route for sending a simple string
app.get("/hello-class", (req, res) => {
  console.log("Hello Class Route");
  res.send("Hello Class!!!");
});

app.get("/list-movies", (req, res) => {
  let movieString = favoriteMovieList.join(", ");
  console.log(`Some of my favorite movies are ${movieString}`);
  res.send(`Some of my favorite movies are ${movieString}`);
});

// This route will get the user's info from the query params and assign those values to the global variables
// Example url: http://localhost:4000/save-user-info?firstName=Timmy&lastName=Turner

app.post("/save-user-info", (req, res) => {
  // req.query is an object containing key/value pairs of the query params entered into the url after the ?
  console.log(req.query);

  // These lines are getting the firstName and lastName query param values from req.query
  queryParamFirstName = req.query.firstName;
  queryParamLastName = req.query.lastName;
  console.log("queryParamFirstName ", queryParamFirstName);
  console.log("queryParamLastName ", queryParamLastName);

  // This res.send() will always send the user info since queryParamFirstName and queryParamLastName are in this route handler function scope
  res.send(
    "User Info => " + "Name: " + queryParamFirstName + " " + queryParamLastName
  );
});

app.get("/show-user-info", (req, res) => {
  // This route will only work AFTER /save-user-info has been run
  res.send(`User Info => ${queryParamFirstName} ${queryParamLastName}`);
});

app.get("/add-movie", (req, res) => {
  console.log("add movie route");
  newMovie = req.query.newMovie;
  console.log(newMovie);
  favoriteMovieList.push(newMovie);
  console.log(favoriteMovieList);
  movieString = favoriteMovieList.join(", ");
  console.log(req.query);
  res.send(`Saved New Movie`);
});

// Finally, run the server
app.listen(port, () => {
  // Console.log app listening on port when the server is running
  console.log(`Example app listening on port ${port}`);
});

// We need these lines in order to make the query param first and last names global so that other routes can access the user inputted values
//   globalFirstName = queryParamFirstName;
//   globalLastName = queryParamLastName;
