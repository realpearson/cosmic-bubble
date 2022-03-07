var bubbles = [];
var pops = [];

var nInc = 0;

var c1 = 0;
var c2 = 0;
var c3 = 0;
var c4 = 0;

var verb;
var lpf;

var bassLoop, note1, note2, note3, note4, pop1, pop2, pop3, hit1, hit2, hit3, hit4;
var pauseButton;

var started = true;
var paused = false;

function preload() {
  bassLoop = loadSound("assets/bassLoop.wav");
  note1 = loadSound("assets/note1.wav");
  note2 = loadSound("assets/note2.wav");
  note3 = loadSound("assets/note3.wav");
  note4 = loadSound("assets/note4.wav");
  pop1 = loadSound("assets/pop1.wav");
  pop2 = loadSound("assets/pop2.wav");
  pop3 = loadSound("assets/pop3.wav");
  hit1 = loadSound("assets/hit1.wav");
  hit2 = loadSound("assets/hit2.wav");
  hit3 = loadSound("assets/hit3.wav");
  hit4 = loadSound("assets/hit4.wav");

  pauseButton = loadImage("assets/pause.png");
  unpauseButton = loadImage("assets/unpause.png");
}

function setup() {
  //createCanvas(640, 360);
  createCanvas(200, 200);
  lpf = new p5.LowPass();
  lpf.freq(150);
  lpf.res(5);

  verb = new p5.Reverb();
  verb.process(bassLoop, 6, 10);
  verb.process(hit1, 6, 10);
  verb.process(hit2, 6, 10);
  verb.process(hit3, 6, 10);
  verb.process(hit4, 6, 10);
}

function mousePressed() {

  if (mouseX > (width - pauseButton.width) / 2 && mouseX < (width - pauseButton.width) / 2 + pauseButton.width &&
    mouseY > height - 55 && mouseY < height - 55 + pauseButton.height) {

    paused = !paused;
    //started = !started;

    if (paused) {
      bassLoop.stop();
      started = true;
      bubbles.length = 0;
      pops.length = 0;
    }

  } else if (!paused) {
    var bubb = new Bubble(mouseX, mouseY, random(2, 4));
    random(0, 3) < 2 ? bubb.type = 0 : bubb.type = 1;
    bubbles.push(bubb);
    pop2.rate(random(0.8, 1.2));
    pop2.play();

    if (started) {
      //bassLoop.disconnect();
      //bassLoop.connect(lpf);
      //bassLoop.rate(0.5);
      bassLoop.loop();
      started = false;
    }
  }
}



function draw() {
  //background(255, 150, 150);
  background(150);
  boarders();
  if (paused) image(unpauseButton, (width - unpauseButton.width) / 2, height - 55);
  else image(pauseButton, (width - pauseButton.width) / 2, height - 55)
  if (!paused) update();


}

function update() {
  //create global forces

  //var someForce = createVector(dirX, dirY);
  //var gravity = createVector(0, 0);
  //var wind....

  for (var i = 0; i < bubbles.length; i++) {

    // create unique object forces
    let rando = createVector(random(-1, 1), random(-1, 1));
    rando.setMag(0.05);

    //apply forces
    //bubbles[i].applyForce(gravity);

    if (bubbles[i].collided) {
      bubbles.splice(i, 1);
    } else {
      bubbles[i].applyForce(rando);

      //Logic & rendering update cycles
      bubbles[i].update();
      bubbles[i].render();
    }
  }

  for (var i = 0; i < pops.length; i++) {
    if (pops[i].done) {
      pops.splice(i, 1);
    } else {
      pops[i].render();
    }
  }
}

function boarders() {

  this.boarderWidth = height / 15;

  stroke(0);


  for (let i = 0; i < 7; i++) {
    push();
    translate(this.boarderWidth, (i / 7) * height);
    push();
    rotate(1.5 * PI + noise(nInc) * 0.05 * PI - .025 * PI);
    strokeWeight(4);
    stroke(40, 45, 45, 100);
    line(0, 0, 0, width);
    pop();
    pop();

    nInc += 0.0005;
  }

  for (let i = 0; i < 7; i++) {
    push();
    translate((i / 7) * width, this.boarderWidth);
    push();
    rotate(noise(nInc + 2) * 0.05 * PI - .025 * PI);
    strokeWeight(4);
    stroke(50, 45, 45, 100);
    line(0, 0, 0, height);
    pop();
    pop();

    nInc += 0.0005;
  }

  for (let i = 0; i < 7; i++) {
    push();
    translate(this.width - this.boarderWidth, (i / 7) * height);
    push();
    rotate(0.5 * PI + noise(nInc + 4) * 0.05 * PI - .025 * PI);
    strokeWeight(4);
    stroke(45, 50, 45, 100);
    line(0, 0, 0, width);
    pop();
    pop();

    nInc += 0.0005;
  }

  for (let i = 0; i < 7; i++) {
    push();
    translate((i / 7) * width, this.height - this.boarderWidth);
    push();
    rotate(PI + noise(nInc + 6) * 0.05 * PI - .025 * PI);
    strokeWeight(4);
    stroke(45, 45, 45, 100);
    line(0, 0, 0, height);
    pop();
    pop();

    nInc += 0.0005;
  }

  fill(150, 200, 150);
  noStroke();
  rect(0, 0, this.boarderWidth, this.innerHeight);
  rect(width - this.boarderWidth, 0, this.boarderWidth, height);

  fill(45 + c1);
  rect(this.boarderWidth, 0, width - this.boarderWidth * 2, this.boarderWidth);
  fill(45 + c2);
  rect(0, this.boarderWidth, this.boarderWidth, height - this.boarderWidth * 2);
  fill(45 + c3);
  rect(width - this.boarderWidth, this.boarderWidth, this.boarderWidth, height - this.boarderWidth * 2);
  fill(45 + c4);
  rect(this.boarderWidth, height - this.boarderWidth, width - this.boarderWidth * 2, this.boarderWidth);


  c1 = c2 = c3 = c4 = 0;

  noFill();
  strokeWeight(5);
  stroke(245, 140, 0);
  rect(0, 0, width, height);

}

function Bubble(x, y, m) {
  this.pos = createVector(x, y);
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);
  this.mass = m;

  this.type = 0;

  this.nInc = 0;

  this.collided = false;

  this.applyForce = function(force) {
    var f = force.copy();
    //f.div(this.mass); //Comment in for mass
    this.acc.add(f);
  }

  this.update = function() {
    this.vel.add(this.acc); //acceleration added to velocity
    this.pos.add(this.vel); //velocity added to position
    this.acc.set(0, 0); //acceleration resets between every frame
    this.collision();
  }

  this.render = function() {
    this.type == 0 ? fill(150, 150, 255, 90) : fill(200, 100, 255, 90);
    stroke(255);
    strokeWeight(2);
    ellipse(this.pos.x, this.pos.y, this.mass * 10, this.mass * 10);

    stroke(255, 255, 255, noise(this.nInc) * 255);
    fill(255, 255, 255, noise(this.nInc) * 255);
    let off = noise(this.nInc) * 8 - 4;
    rect(this.pos.x - this.mass + off, this.pos.y - this.mass + off, this.mass, this.mass);
    rect((this.pos.x - this.mass * 2) + off, (this.pos.y - this.mass * 2) + off, this.mass / 1.5, this.mass / 1.5);

    this.nInc += .025;
  }

  this.collision = function() {

    //Check boundaries

    let offset = 7;

    if (this.pos.x > (width - this.mass * 10) - offset) {
      c3 = 100;
      if (this.type == 0) note1.play();
      else hit1.play();
      this.collide();
      //print(this.type);
    }
    if (this.pos.x < this.mass * 10 + offset) {
      c2 = 100;
      if (this.type == 0) note2.play();
      else {
        hit2.play();
        hit2.rate(0.5);
      } 
      this.collide();
      //print(this.type);
    }
    if (this.pos.y > (height - this.mass * 10) - offset) {
      c4 = 100;
      if (this.type == 0) note3.play();
      else hit3.play();
      this.collide();
      //print(this.type);
    }
    if (this.pos.y < this.mass * 10 + offset) {
      c1 = 100;
      if (this.type == 0) note4.play();
      else hit4.play();
      this.collide();
      //print(this.type);
    }
  }

  this.collide = function() {
    //print("pop");
    pop1.play();
    pop1.rate(random(1.8, 2.2));
    pops.push(new popAnim(this.pos.x, this.pos.y));
    this.collided = true;
  }


}

function popAnim(_pX, _pY) {
  this.pos = createVector(_pX, _pY);
  this.startTime = millis();
  this.lifeSpan = 125;
  this.done = false;
  this.generation = 0;

  this.angles = [];

  this.numLines = 10;
  this.doOnce = true;


  this.render = function() {
    if (millis() < this.startTime + this.lifeSpan) {
      //Render
      push();
      translate(this.pos.x, this.pos.y);
      this.pop();
      pop();

    } else {
      this.done = true;
    }
  }

  this.pop = function() {

    if (this.doOnce) this.init();

    for (let i = 0; i < this.numLines; i++) {
      stroke(255 - random(59), 255, 255, 100);

      push();
      strokeWeight(1);
      rotate(this.angles[i]);
      line(0, 0, 0, 5 + this.generation);
      ellipse(0, 5 + this.generation, 3, 3);
      pop();
    }


    this.generation++;

  }

  this.drawLines = function() {


  }

  this.init = function() {
    this.doOnce = false;
    for (let i = 0; i < this.numLines; i++) {
      this.angles.push(random(-1 * PI, 1 * PI));
    }
  }
}