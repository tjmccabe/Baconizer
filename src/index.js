const axios = require('axios')

// import {search} from './search'
import Search from './search';

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("degree");
  const ctx = canvas.getContext('2d');
  
  const render = () => {
    canvas.width = window.innerWidth - 20;
    canvas.height = window.innerHeight - 200;
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }
  
  const watchWindow = () => {
    window.addEventListener("resize", render, false);
    render();
  }
  
  watchWindow();
  
  Search()

  // let movieId = 550
  // axios.get(`/movies/${movieId}`)
  //   .then(res => console.log(res))
  //   .catch(err => console.log(err))

  // let actorId = 11157
  let actorId = 287
  axios.get(`/actors/${actorId}`)
    .then(res => console.log(res))
    .catch(err => console.log(err))
})
