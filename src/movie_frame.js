import * as d3 from 'd3';
// import { throttle, debounce } from "throttle-debounce"
const axios = require('axios')
import ActorFrame from './actor_frame'
// const actors = require('../assets/actorz.json');

class MovieFrame {
  constructor(center) {
    this.center = Object.assign({}, center, {
      text: center.title,
      frameId: `c${center.id}`,
      imgLink: center.poster_path ? `https://image.tmdb.org/t/p/w92${center.poster_path}` : "https://raw.githubusercontent.com/tjmccabe/Baconizer/master/assets/camera.png"
    });

    this.localActors = null

    axios.get(`/actorsbymovie/${center.id}`)
      .then(res => {
        this.localActors = res.data

        this.nodes = [this.center]
          .concat(Object.keys(this.localActors).map(id => {
            const text = this.localActors[id].name.length > 20 ? (
              this.localActors[id].name.slice(0, 20) + '...'
            ) : (this.localActors[id].name);
    
            return Object.assign({}, this.localActors[id], {
              text: text,
              frameId: id,
              imgLink: this.localActors[id].profile_path ? `https://image.tmdb.org/t/p/w154${this.localActors[id].profile_path}` : "https://raw.githubusercontent.com/tjmccabe/Baconizer/master/assets/profile.png"
            })
          })
          .sort((a, b) => {
            return (a.popularity > b.popularity) ? -1 : 1
          }))
    
        this.links = [];
    
        this.nodes.forEach((node, idx) => {
          if (idx === 0) return;
          this.links.push({ source: this.center.frameId, target: node.frameId })
        })
    
        // console.log(this.center)
        // console.log(this.nodes)
        // console.log(this.links)
        this.currCenterX = this.width / 2;
        this.currCenterY = this.height / 2;
        this.nodes[0].fx = this.currCenterX;
        this.nodes[0].fy = this.currCenterY;
        
        this.render();
        
      })
      
    this.width = window.innerWidth;
    this.height = window.innerHeight - 70;

    let g
    
    this.g = g = d3.select("svg")
    .append("g")
    .attr("id", "thisg")
    .attr("width", this.width)
    .attr("height", this.height)

    this.zoom = d3.zoom()
      .scaleExtent([0.5, 4])
      .on("zoom", function () {
        g.attr("transform", d3.event.transform)
      })
    
    d3.select("svg").call(this.zoom)
    this.zoom.transform(d3.select("svg"), d3.zoomIdentity.scale(1))
  }
  
  render() {
    let las = this.localActors

    this.sim = d3.forceSimulation()
      // .force("x", d3.forceX(this.width / 2).strength(.05))
      .force("y", d3.forceY(this.height / 2).strength(.2))
      .force("charge", d3.forceManyBody().strength(-3000))
      .force("link", d3.forceLink().id(d => d.frameId))
      // .force("center", d3.forceCenter(this.width / 2, this.height / 2))
      .force("collide", d3.forceCollide().radius(55))

    var link = this.g.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(this.links)
      .enter()
      .append("line")

    var node = this.g
      .selectAll("g.node")
      .data(this.nodes)
      .enter()
      .append("g")
      .attr("class", "node")

    var images = node
      .append("image")
      .attr("xlink:href", d => d.imgLink)
      .attr("class", d => d.frameId[0])
      .attr("x", -25)
      .attr("y", -38)
      .attr("height", 75)
      .attr("width", 50)

    var text = node
      .append("text")
      .attr("class", "nodetext")
      .attr("text-anchor", "middle")
      .attr("y", 50)
      .attr("font-size", 12)
      .text(d => d.text)

    var cImage = images.filter((img, idx) => idx === 0)
      .attr("x", -30)
      .attr("y", -45)
      .attr("width", 60)
      .attr("height", 90)

    var cText = text.filter((txt, idx) => idx === 0)
      .attr("y", 58)
      .attr("font-size", 13)

    this.sim
      .nodes(this.nodes)
      .on("tick", ticked);

    this.sim.force("link")
      .links(this.links);

    const bound = this.g
    const zoom = this.zoom

    var setNodeEvents = images.filter((img, idx) => idx !== 0)
      // go to Actor Frame
      .on('click', function (d) {
        // bound.transition()
          // .duration(750)
          // .call(zoom.transform, d3.zoomIdentity);
        bound.remove()
        // window.removeEventListener("resize", () => {
        //   this.width = window.innerWidth;
        //   this.height = window.innerHeight - 200;
        //   this.render();
        // }, false);
        new ActorFrame(las[d.id])
      })

      .on('mouseenter', function () {
        // select element in current context
        d3.select(this)
          .transition()
          .attr("x", function (d) { return -33; })
          .attr("y", function (d) { return -60; })
          .attr("height", 100)
          .attr("width", 66);
      })
      // set back
      .on('mouseleave', function () {
        d3.select(this)
          .transition()
          .attr("x", function (d) { return -25; })
          .attr("y", function (d) { return -38; })
          .attr("height", 75)
          .attr("width", 50);
      });

    function ticked() {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node.attr("transform", d => "translate(" + d.x + "," + d.y + ")");
    }
  }

  // watchWindow() {
  //   // DEFINITELY debounce this
  //   window.addEventListener("resize", () => {
  //     this.g.remove()
  //     this.width = window.innerWidth;
  //     this.height = window.innerHeight - 200;
  //     this.render();
  //   }, false);
  // }
}

export default MovieFrame;