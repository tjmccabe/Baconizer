const express = require('express')
const app = express()
const path = require('path')
const fetch = require('node-fetch')
const keys = require('./config/keys')
const PORT = process.env.PORT || 8000; // process.env accesses heroku's environment variables

app.use(express.static('public'))
app.use((req, res, next) => {
  req.header("Access-Control-Allow-Origin", "*");
  next();
})

app.get('/', (request, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'))
})

// // create route to get single movie by its TMDB id
app.get('/movies/:movieId', (request, response) => {
  // make api call using fetch
  fetch(`https://api.themoviedb.org/3/movie/${request.params.movieId}?append_to_response=credits`, {
    headers: {
    'Authorization': 'Bearer ' + keys.TMDBReadAccessToken,
    'Content-Type': `application/json;charset=utf-8`,
  }})
    .then((response) => {
      return response.text();
    }).then((body) => {
      let results = JSON.parse(body)
      response.send(results) // sends to frontend
    }).catch(err => {
      console.log(err)
    })
});

app.get('/actors/:actorId', (request, response) => {
  fetch(`https://api.themoviedb.org/3/person/${request.params.actorId}?append_to_response=movie_credits`, {
    headers: {
    'Authorization': 'Bearer ' + keys.TMDBReadAccessToken,
    'Content-Type': `application/json;charset=utf-8`,
  }})
    .then((response) => {
      return response.text();
    }).then((body) => {
      let results = JSON.parse(body)
      response.send(results)
    }).catch(err => {
      console.log(err)
    })
});


app.listen(PORT, () => {
  console.log(__dirname);
  console.log(`listening on ${PORT}`)
})