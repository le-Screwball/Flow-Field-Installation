// references : https://www.youtube.com/watch?v=NCCHQwNAN6Y&list=PLRqwX-V7Uu6aFcVjlDAkkGIixw70s7jpW&index=4
//              https://www.youtube.com/watch?v=BjoM9oKOAKY&list=PLRqwX-V7Uu6bgPNQAdxQZpJuJCjeOr7VD



let inc = 0.1;            //rate of change of noise seed
let j;
let scl = 10;             //size of cells
let cols, rows;
let fr;
let zoff = 0;             //movement causing noise parameter - map this to music somehow
let particles = [];       //for the particles that flow in the field
let flowfield;
let moosic; 
let amp;

function preload() {
  moosic = loadSound("assets/Antagonistic Chris Cardena.mp3");
  // moosic = loadSound("assets/DanceMonkey.mp3");
  // moosic = loadSound("assets/Test.mp3");
}

function setup() {
  createCanvas(200, 200);

  moosic.play();
  amp = new p5.Amplitude();

  cols = floor(width / scl);          //change scl for varying complexity
  rows = floor(height / scl);         //change scl for varying complexity

  

  fr = createP('');                   //to see if its working

  flowfield = new Array(cols * rows);      //to create a field as big as the canvas

  for (let i = 0; i < 5000; i++) {           //change i for varying density of particles

    particles[i] = new Particle();         

  }

}

function draw() {
  background(50, 100);               //change alpha to control how long line residues stay
  // noStroke();
  
  let vol = amp.getLevel();

  let syncMag = map(vol, 0, 0.4, -0.4, 1.5);
  
  let yoff = 0;
  
  
  for (let y = 0; y < rows; y++) {
    let xoff = 0;

    for (let x = 0; x < cols; x++) {
      
      let index = x + y * cols;            //AoE of the field
      noiseDetail(4);
      let angle = map(noise(xoff, yoff, zoff), 0, 1, 0, TWO_PI * 4);  
      var v = p5.Vector.fromAngle(angle);      //the flow of the field
      
      v.setMag(syncMag);                       //set the strength of the vectors

      flowfield[index] = v;                 //flow now affects the AoE of the field
      
      xoff += inc;
      stroke(0, 30);                       //control how long line residues take to look full black
 
  
      // push();                        //to see the flow of the field
      // translate(x * scl, y * scl);      //to see the flow of the field
      // rotate(v.heading());                 //to see the flow of the field
      // line(0, 0, scl, 0);         //to see the flow of the field
      // pop();                       //to see the flow of the field

      
    }
    yoff += inc;
    zoff += 0.0004;             //map to music somehow
  }
  for (let i = 0; i < particles.length; i++) {
    
    particles[i].follow(flowfield);           //particles now flow in the field
    particles[i].warp();
    particles[i].show();
    particles[i].update();
   
  }
  // noLoop();
  fr.html(floor(frameRate()));
  // print(amp.getLevel());
}

function Particle() {

  this.pos = createVector(random(width), random(height));  //particles start at random places
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);
  
  this.vol = amp.getLevel();
  
  this.syncSpd = map(this.vol, 0.09, 0.4, -4, 4);

  
  this.maxspeed = 4;                                //set the max speed of the particles

  this.prevPos = this.pos.copy();

  this.update = function() {
    // this.vel.setMag(this.syncSpd);
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.acc.setMag(this.syncSpd);
    
}
  
  this.applyForce = function(force) {
    this.acc.add(force);
  }
  
  this.follow = function(vectors) {
    let x = floor(this.pos.x / scl);
    let y = floor(this.pos.y / scl);
    let index = x + y * cols;
    let force = vectors[index];
    this.applyForce(force);
  }
  
  this.show = function() {
    stroke(random(60, 120), random(150, 230), random(110, 230), 50);
    strokeWeight(1);
    // ellipse(this.pos.x, this.pos.y, 0.01, 0.01);
    line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);

    this.noWarplines();

  }

  this.noWarplines = function() {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }

  this.warp = function() {
    if (this.pos.x > width) {
      this.pos.x = 0;
      
      this.noWarplines();
    }

    if (this.pos.x < 0) {
      this.pos.x = width;
      this.noWarplines();
    }
    
    if (this.pos.y > height) {
      this.pos.y = 0;
      this.noWarplines();
    }
    
    if (this.pos.y < 0) {
      this.pos.y = height;
      this.noWarplines();
    }
  }

}