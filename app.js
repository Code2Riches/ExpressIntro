// Bring in Express code
const express = require('express')

// Initiallize the Server and Port
const app = express()
const port = 3000

const today = new Date();
const favoriteMovieList = ["Matrix", "Bourne"];
let movieString = favoriteMovieList.join(',');

// Define the default server route (aka "/") for our server
// app.get('/', (req, res) => {
//     console.log("Default Route")
//     res.send('Hello World!')
// })

app.get('/', (req, res) => {
  res.send(`My Name is Christian Benites. Today is: ${today}`)
})

app.get('/list-movies', (req, res) => {
  console.log("Two of my favorite movies are ")  
  res.send(`${movieString}`);
})

// Finally, run the server
app.listen(port, () => {
  // Console.log app listening on port when the server is running  
  console.log(`Example app listening on port ${port}`)
})
