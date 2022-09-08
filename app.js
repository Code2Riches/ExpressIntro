// Bring in Express code
const express = require("express");

// Bring in body parser so that we can parse the POST request body
const bodyParser = require("body-parser");

// Initiallize the Server and Port
const app = express();
const port = 3000;

// The following 2 lines are called middleware and they modify the request before it gets to our routes
// so that we can properly access the values in the request body (req.body)
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })); //******  Why is this set to False?
// parse application/json
app.use(bodyParser.json());

// Global scope variables so that all routes can gain access to them
let globalFirstName = 2;
let globalLastName = null;

// Define the default server ROUTE (aka "/") for our server
app.get("/", (req, res) => {
  //req stands for request and has the request user info on it such as the url params and http headers
  //res stands for response and has the methods used for responding to a request on it
  console.log("Default Route");

  const myName = "Christian Benites";
  const today = new Date();
  const todayBasic = today.toLocaleDateString();
  console.log("Today ", today);
  res.send(`My Name is ${myName}. Today is ${todayBasic}`);
});

// This route will get the user's info from the query params and assign those values to the global variables
// Example url: http://localhost:4000/save-user-info?firstName=Timmy&lastName=Turner
app.post("/save-user-info", (req, res) => {
  // req.query is an object containing key/value pairs of the query params entered into the url after the ?
  console.log(req.query);

  // These lines are getting the firstName and lastName query param values from req.query
  const queryParamFirstName = req.query.firstName;
  const queryParamLastName = req.query.lastName;

  // We need these lines in order to make the query param first and last names global so that other routes can access the user inputted values
  globalFirstName = queryParamFirstName;
  globalLastName = queryParamLastName;

  // This res.send() will always send the user info since queryParamFirstName and queryParamLastName are in this route handler function scope
  res.send("User Info => " + "Name: " + queryParamFirstName + " " + queryParamLastName);
});

app.get("/show-user-info", (req, res) => {
  // This route will only work AFTER /save-user-info has been run
  res.send("User Info => " + "Name: " + globalFirstName + " " + globalLastName);
});

// An example route for sending a simple string
app.get("/hello-class", (req, res) => {
  console.log("Hello Class Route");
  res.send("Hello Class!!!");
});

//get all movies in our movie list
app.get("/all-movies", (req, res) => {
  //res.send only sends strings. From now on, we want to use res.json to send JSON objects or JS arrays
  res.json(favoriteMovieList);
});

// For the assignment, make sure favoriteMovieList is in the global scope
const favoriteMovieList = ["Matrix", "Bourne", "Another Movie"];

// Movie CRUD Functions
// Create

// Post a new movie into the movies array
app.post("/new-movie", (req, res) => {
  //We'll use req.body to get the body payload from the post request that contains our new movie
  console.log(req.body);

  const newMovieTitle = req.body.title;
  favoriteMovieList.push(newMovieTitle);

  // We must respond to the request, so for now we'll send back a hardcoded object
  res.json({
    // success: true
  });
});

// Read

// Get all the movies in our movie list
app.get("/all-movies", (req, res) => {
  //res.send only sends strings. From now on, we want to use res.json to send JSON objects or JS arrays

  res.json(favoriteMovieList);
});

// Update

// Find a movie and update the title
app.put("/update-movie/:titleToUpdate", (req, res) => {
  // We have a route parameter /:titleToUpdate to specify which movie in our list to update
  // The value of this route parameter will come through the req.params object
  console.log("req params ", req.params);

  const titleToUpdate = req.params.titleToUpdate;
  const newTitle = req.body.newTitle;

  console.log(titleToUpdate);
  console.log(newTitle);

  console.log("favoriteMovieList before ", favoriteMovieList);

  // In order to update the movie title we're targeting, first we find the index of the movie title in the array
  const indexOfMovie = favoriteMovieList.indexOf(titleToUpdate);
  console.log(indexOfMovie);

  // Overwrite the value of favoriteMovieList at indexOfMovie with newTitle
  favoriteMovieList[indexOfMovie] = newTitle;
  console.log(favoriteMovieList);

  console.log("favoriteMovieList after ", favoriteMovieList);

  res.json({
    success: true,
  });
});

// Delete

app.delete("/delete-movie/:titleToDelete", (req, res) => {
  // This is the title of the movie we want to find in the movies array and delete
  const titleToDelete = req.params.titleToDelete;

  // Find the index of the movie in the movie list
  const indexOfMovie = favoriteMovieList.indexOf(titleToDelete);
  console.log(indexOfMovie);

  if (indexOfMovie < 0) {
    // If the movie was not found in the array, respond with hasBeenDeleted: false and return so that no code underneath executes
    res.json({
      hasBeenDeleted: false,
    });
    return;
  }

  console.log("Before Delete ", favoriteMovieList);
  // Remove the movie title from the array at the index
  favoriteMovieList.splice(indexOfMovie, 1);
  console.log("After Delete ", favoriteMovieList);

  res.json({
    hasBeenDeleted: true,
  });
});

/* app.get("/list-movies", (req, res) => {
    const movieString = favoriteMovieList.join(", ");
    console.log(`Some of my favorite movies are ${favoriteMovieList}`);
    res.send(`Some of my favorite movies are ${movieString}`);
});
// Requesting a single resource of a set of resources is done with a route param
// The url will be: localhost:3000/single-movie/Star Wars
app.get("/single-movie/:movieName", (req, res)=> {
	console.log("req.params ", req.params)
	// .find will return an item from an array that matches the condition passed into the callback function
	const foundMovie = favoriteMovieList.find((movieName)=>{return movieName === req.params.movieName})
	console.log(foundMovie)
	if (foundMovie) {
		res.send(foundMovie)
	} else {
		res.send("Movie not found!")
	}
})

app.get("/add-movie", (req, res) => {
	//localhost:3000/add-movie?newMovie=Terminator
	console.log(req.query)
	favoriteMovieList.push(req.query.newMovie)
	
	// Note: We do not need to have + symbols in the place of spaces for a url, but if we have a string that has a 
	// symbol in the place of a space, we can split on that symbol and then join with a space to convert the symbol
	// to spaces.
	// const newMovie = "Terminator+2+Judgement+Day"
	// const splitMovie = newMovie.split("+")
	// const joinedMovie = splitMovie.join(" ")
	// console.log("splitMovie ", splitMovie)
	// console.log("joinedMovie ", joinedMovie)
	// favoriteMovieList.push(joinedMovie) 
	res.send("added movie")
}) */

// Finally, run the server
app.listen(port, () => {
  // Console.log app listening on port when the server is running
  console.log(`Example app listening on port ${port}`);
});

/* 
	Rules of HTTP (Hypertext Transfer Protocol)
		1. An exchange of information across the internet MUST start with a Request
		2. A single Request MUST be answered with a SINGLE Response and there must always be a response
		3. The data sent in HTTP requests is always going to be plain text 
			- Note: If we want to send a JSON object, we need to stringify the object first
			- Note: In order for the browser to render the data, it needs an HTML file to tell the browser how to render the data.
				HTML + CSS will tell the browser the structure of a page and how to make it look
			- Note: When you enter a url into the browser that will ALWAYS be a GET request
		4. There are 4 basic types of HTTP request: GET, POST, PUT, DELETE
			- GET is used for fetching data from a server. There cannot be any body payload that goes with it.
			- POST is used to create data on the server. The post request comes with a request body payload.
			- PUT is used to modify data on the server, and acts similarly to the POST request.
			- DELETE is used to delete data from the server.
			- AKA: CRUD (Create, Read, Update, Delete)
		5. There are 3 ways to send user data to the server
			- Query Params: req.query - Used primarily to modify the request parameters
			- Route Params: req.params - Used primarily to request a specfic resource
			- Body: req.body - Used primarily for sending user data
				- Note: In Postman, in order to send a body payload you need to go to the 'body' request tab, select raw and then JSON
*/
