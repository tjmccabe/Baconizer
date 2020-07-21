const axios = require('axios')

// import {search} from './search'
import addSearchListeners from './search';

document.addEventListener("DOMContentLoaded", () => {
  // const modal = document.getElementById("modal")
  // modal.classList.add("loaded");

  const canvas = document.getElementById("degree");

  canvas.width = window.innerWidth - 20;
  canvas.height = window.innerHeight - 200;
  // const ctx = canvas.getContext('2d');
  
  // const render = () => {
  //   canvas.width = window.innerWidth - 20;
  //   canvas.height = window.innerHeight - 200;
  //   // ctx.globalCompositeOperation = 'destination-over'
  //   // ctx.fillStyle = "gray";
  //   // ctx.fillRect(0, 0, canvas.width, canvas.height)
  //   // ctx.fillStyle = "black";
  //   // ctx.font = '50px Impact'
  //   // ctx.rotate(-0.1)
  //   // ctx.fillText('Awesome!', (canvas.width/2), canvas.height/2)
  // }
  
  // const watchWindow = () => {
  //   // maybe throttle or debounce this
  //   window.addEventListener("resize", render, false);
  //   render();
  // }
  
  // watchWindow();

  addSearchListeners()
  
  let movieId = 550
  // let movieId = 252406
  axios.get(`/movies/${movieId}`)
  .then(res => console.log(res))
  .catch(err => console.log(err))
  
  let actorId = 11157
  // let actorId = 287
  axios.get(`/actors/${actorId}`)
    .then(res => console.log(res))
    .catch(err => console.log(err))
})
