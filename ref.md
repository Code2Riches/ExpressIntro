// Bring in Express code
const express = require('express')

// Bring in body parser so that we can parse the POST request body
const bodyParser = require('body-parser')

// Initialize the Server and Port
const app = express()
const port = 3000

// The following 2 lines are called middleware and they modify the request before it gets to our routes
// so that we can properly access the values in the request body (req.body)
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// Global scope variables so that all routes can gain access to them
let globalFirstName = 2;
let globalLastName = null;
const favoriteMovieList = ["Star Wars", "The Avengers"];

// For the assignment, make sure favoriteMovieList is in the global scope
// const favoriteMovieList = [] 

// Define the default server route (aka "/") for our server
app.get('/', (req, res) => {
	//req stands for request and has the request user info on it such as the url params and http headers
	//res stands for response and has the methods used for responding to a request on it


	console.log("default route")
	
	
	const myName = "James Nissenbaum"
	const today = new Date()
	const todayFormatted = today.toLocaleDateString()
	console.log("Today ", today)
  res.send(`My Name: ${myName}. \n
	Today's date: ${todayFormatted}`)
})

// An example route for sending a simple string
app.get('/hello-class', (req, res) => {
	console.log("hello class route")
  res.send('Hello Class!!!')
})

// This route will get the user's info from the query params and assign those values to the global variables
// Example url: http://localhost:4000/save-user-info?firstName=Timmy&lastName=Turner
app.post("/save-user-info", (req, res)=>{

	/* 
	Note: Query params are being replaced with the request body
	// req.query is an object containing key/value pairs of the query params entered into the url after the ?
	console.log(req.query)

	// These lines are getting the firstName and lastName query param values from req.query
	const queryParamFirstName = req.query.firstName
	const queryParamLastName = req.query.lastName */

	console.log("req body ", req.body)

	const bodyParamFirstName = req.body.firstName
	const bodyParamLastName = req.body.lastName

	// We need these lines in order to make the query param first and last names global so that other routes can access the user inputted values
	globalFirstName = bodyParamFirstName
  globalLastName = bodyParamLastName

	// This res.send() will always send the user info since queryParamFirstName and queryParamLastName are in this route handler function scope
	res.send("User Info => " + "Name: " + bodyParamFirstName + " " + bodyParamLastName)
})

app.get("/show-user-info", (req, res) => {
	// This route will only work AFTER /save-user-info has been run
	res.send("User Info => " + "Name: " + globalFirstName + " " + globalLastName)
})

app.get("/list-movies", (req, res)=> {
	const movieString = favoriteMovieList.join("; ")
	console.log(favoriteMovieList)
	res.send(movieString)
})

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
	/* 
	Note: We do not need to have + symbols in the place of spaces for a url, but if we have a string that has a 
	symbol in the place of a space, we can split on that symbol and then join with a space to convert the symbol
	to spaces.
	const newMovie = "Terminator+2+Judgement+Day"
	const splitMovie = newMovie.split("+")
	const joinedMovie = splitMovie.join(" ")
	console.log("splitMovie ", splitMovie)
	console.log("joinedMovie ", joinedMovie)
	favoriteMovieList.push(joinedMovie) */
	res.send("added movie")
})

// console.log(movieString)

// Finally, run the server
app.listen(port, () => {
	// Console.log app listening on port when the server is running
  console.log(`Example app listening on port ${port}`)
})

/* 
	Rules of HTTP (Hypertext Transfer Protocol)
		1. An exchange of information across the internet MUST start with a Request
		2. A single Request MUST be answered with a SINGLE Response
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