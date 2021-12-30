const boids = [];


function setup() {
  for(let i =0;i<100;i++){
    boids[i] = new Boid(random(0,1280),random(0,580))
  }
  createCanvas(1280, 580)
}
function draw(){
  background(0);
  boids.forEach(boid =>{
    boid.flock(boids)
    boid.move()
    boid.boidCheck()
    boid.draw()
  })
}
