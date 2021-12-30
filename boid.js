class Boid{
    constructor(x,y){
        this.position =  createVector(x,y);
        this.velocity = createVector(random(-5),random(5));
        this.acceleration = createVector(random(-2),random(2));
        this.maxAcceleration = 0.05;
        this.maxSpeed = 5;
        this.visualRange = 200;
        this.avoidanceRange = 50;
    }
    draw(){
        circle(this.position.x,this.position.y,10)
    }
    move(){
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }
    moveToAverage(boids){
        let averagePos = createVector(0,0);
        let steeringToAverage = createVector(0,0);
        let counter = 0;
        boids.forEach(boid => {
            let distance = this.position.dist(boid.position);
            if(distance > 0 && distance < 50){
                averagePos.add(boid.position);
                counter++
            }
        })
        if(counter > 0){ 
        averagePos.div(counter)
        let difference = p5.Vector.sub(averagePos,this.position);
        difference.normalize();
        difference.mult(this.maxSpeed);
        steeringToAverage = p5.Vector.sub(difference,this.velocity);
        steeringToAverage.limit(this.maxAcceleration);
        }
        return steeringToAverage;

    }
    avoidOthers(boids){
        const seprationCoeff = 50;
        let steering = createVector(0,0);
        let counter = 0;
        boids.forEach(boid => {
            let distance = this.position.dist(boid.position);
            if(distance > 0 && distance < seprationCoeff){
                let difference = p5.Vector.sub(this.position,boid.position)
                difference.normalize();
                difference.div(distance)
                steering.add(difference);
                counter++;
            }
        })
        if(counter > 0){
        steering.div(counter)}
        if(steering.mag() > 0 ){
        steering.normalize();
        steering.mult(this.maxSpeed);
        steering.sub(this.velocity);
        steering.limit(this.maxAcceleration);}
        return steering;
    }
    align(boids) {
        let neighbordist = 50;
        let sum = createVector(0, 0);
        let count = 0;
        boids.forEach(boid => {
            let d = p5.Vector.dist(this.position, boid.position);
            if ((d > 0) && (d < neighbordist)) {
              sum.add(boid.velocity);
              count++;
            }
        })
        if (count > 0) {
          sum.div(count);
          sum.normalize();
          sum.mult(this.maxSpeed);
          let steer = p5.Vector.sub(sum, this.velocity);
          steer.limit(this.maxforce);
          return steer;
        } 
      }
    accelerate(force){
        this.acceleration.add(force)
    }
    boidCheck(){
        if (this.position.x < -10) this.position.x = width + 10;
        if (this.position.y < -10) this.position.y = height + 10;
        if (this.position.x > width + 10) this.position.x = -10;
        if (this.position.y > height + 10) this.position.y = -10;
    }
    flock(boids){
        let avoidance = this.avoidOthers(boids);
        let average = this.moveToAverage(boids)
        let alignment = this.align(boids);
        avoidance.mult(1);
        this.accelerate(alignment)
        this.accelerate(avoidance)
        this.accelerate(average)
    }
}