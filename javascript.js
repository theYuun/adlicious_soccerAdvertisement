const pageWidth = document.body.clientWidth;
const pageHeight = document.body.clientHeight;

const canvas = document.getElementById('canvas');
const canvasWidth = canvas.width = 300;
const canvasHeight = canvas.height = 600;

const sizeMultiplier = 0.5;

const ctx = canvas.getContext('2d');

const mouse = {
    x: 0,
    y: 0,
};

const graphics = {
  field: {
    graphic: document.getElementById('field'),
    size: [300, 600],
    position: [0, 0],
  },
  goal: {
    graphic: document.getElementById('goal'),
    size: [150, 70],
    position: [150, 35],
  },
  ball: {
    graphic: document.getElementById('ball'),
    size: [100, 100],
    position: [canvasWidth / 2, canvasHeight / 2],
  },
  player: {
    graphic: document.getElementById('character'),
    width: 180,
    height: 240,
    size: [180, 240],
  },
  characters: {
    graphic: document.getElementById('character'),
    players: [
      {
        position: [100, 60],
        size: [180, 240],
        localSizeMultiplier: 1,
        patrol: [70, 120],
        speed: [5, 5],
      },
      /*
      {
        position: [200, 200],
        size: [180, 240],
        localSizeMultiplier: 1,
        patrol: [100, 180],
        speed: [10, 10],
      },
      */
    ],
  }
};

class Goal{
  constructor(graphic, position, size, localSize){
    
    this.graphic = graphic;
    this.position = position;
    this.size = size;

    this.localSizeMultiplier = localSize;
    this.xOffset = this.size[0] / 2 * this.localSizeMultiplier;
    this.yOffset = this.size[1] / 2 * this.localSizeMultiplier;

    this.CalculateHitbox();
    this.DrawGoal();
  }
  
  graphic;
  position;
  size;

  localSizeMultiplier;
  xOffset;
  yOffset;

  hitBox = {
    tl: [],
    tr: [],
    br: [],
    bl: [],
  };

  CalculateHitbox(){
    this.hitBox =
    {
      tl:[
        this.position[0] - this.xOffset + 5,
        this.position[1] - this.yOffset],
      tr:[
        this.position[0] + this.xOffset - 5,
        this.position[1] - this.yOffset],
      br:[
        this.position[0] + this.xOffset - 5,
        this.position[1] + this.yOffset - 5],
      bl:[
        this.position[0] - this.xOffset + 5,
        this.position[1] + this.yOffset - 5],
    };
  }

  DrawGoal(){
    
    ctx.beginPath();
    ctx.moveTo(this.hitBox.tl[0], this.hitBox.tl[1]);
    ctx.lineTo(this.hitBox.tr[0], this.hitBox.tr[1]);
    ctx.lineTo(this.hitBox.br[0], this.hitBox.br[1]);
    ctx.lineTo(this.hitBox.bl[0], this.hitBox.bl[1]);
    ctx.closePath();
    ctx.stroke();

    ctx.drawImage(graphics.goal.graphic, this.position[0] - this.xOffset, this.position[1] - this.yOffset, this.size[0], this.size[1]);
  }

}

class Player{
  constructor(){
    this.width = graphics.player.width;
    this.height = graphics.player.height;

    this.CalculateHitBox();
  }

  width;
  height;
  hitboxHeight = 10;
  kicking = false;
  holding = false;
  kickStrength = -5;

  hitbox = {
    tl: null,
    tr: null,
    br: null,
    bl: null,
  }

  CalculateHitBox(){
    this.hitbox.tl = [mouse.x - this.width/3 * sizeMultiplier, mouse.y - this.hitboxHeight * sizeMultiplier]
    this.hitbox.tr = [mouse.x + this.width/3 * sizeMultiplier, mouse.y - this.hitboxHeight * sizeMultiplier]
    this.hitbox.br = [mouse.x + this.width/3 * sizeMultiplier, mouse.y]
    this.hitbox.bl = [mouse.x - this.width/3 * sizeMultiplier, mouse.y]
  }

  DrawPlayer() {

    this.CalculateHitBox();
    // hitbox
    ctx.beginPath();
    ctx.moveTo(this.hitbox.tl[0], this.hitbox.tl[1]);
    ctx.lineTo(this.hitbox.tr[0], this.hitbox.tr[1]);
    ctx.lineTo(this.hitbox.br[0], this.hitbox.br[1]);
    ctx.lineTo(this.hitbox.bl[0], this.hitbox.bl[1]);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'orange';
    ctx.fill();

    ctx.drawImage(graphics.player.graphic, (mouse.x - this.width/2 * sizeMultiplier), (mouse.y - this.height*sizeMultiplier), this.width * sizeMultiplier, this.height * sizeMultiplier)
  }

  CatchBall(ballObject){
    if(!this.kicking)
    {
      if(this.hitbox.tr[0] > ballObject.hitBox.tl[0] && this.hitbox.bl[1] > ballObject.hitBox.tl[1] && this.hitbox.tl[0] < ballObject.hitBox.tr[0] && this.hitbox.tl[1] < ballObject.hitBox.br[1])
      {
        /*
        ctx.beginPath();
        ctx.arc(ballObject.position[0], ballObject.position[1], 3, 0, Math.PI * 2);
        ctx.fillStyle = 'orange';
        ctx.fill();
*/
        player.holding = true;
        ballObject.speed = [0, 0];
      }
    }
  }

  HoldBall(ballObject)
  {
    if(this.kicking)
    {
      this.holding = false;
    }

    if(this.holding)
    {
      ballObject.position = [mouse.x, mouse.y - ballObject.size[1]/2 * sizeMultiplier];
    }
  }

  Kick(ballObject){
    console.log(ballObject.position);
    ballObject.speed = this.kickStrength;
    //ballObject.MoveBall();
    this.holding = false;
    this.kicking = true;
    setTimeout(() => this.kicking = false, 100);
  }
}

class Character {
  constructor(graphic, position, size, localSize = 1)
  {
    this.graphic = graphic;
    this.position = position;
    this.size = size;
    this.localSizeMultiplier = localSize;

    this.xOffset = this.size[0] / 2 * this.localSizeMultiplier * sizeMultiplier;
    this.yOffset = this.size[1] / 2 * this.localSizeMultiplier * sizeMultiplier;
    this.CalculateHitbox();
  }

  graphic;
  size;
  localSizeMultiplier;
  position;
  xOffset;
  yOffset;
  kickStrength;
  
  hitBox;
  kicking = false; // a short delay after the player clicks for the ball not to instantly snap to the cursor again
  holding = false; // is the ball stuck to the player character

  CalculateHitbox(){
    this.hitBox =
    {
      tl:[
        this.position[0] - this.xOffset,
        this.position[1] - this.yOffset],
      tr:[
        this.position[0] + this.xOffset,
        this.position[1] - this.yOffset],
      br:[
        this.position[0] + this.xOffset,
        this.position[1] + this.yOffset],
      bl:[
        this.position[0] - this.xOffset,
        this.position[1] + this.yOffset],
    }
  }

  DrawCharacter(){
    // hitbox
    ctx.beginPath();
    ctx.moveTo(this.hitBox.tl[0], this.hitBox.tl[1]);
    ctx.lineTo(this.hitBox.tr[0], this.hitBox.tr[1]);
    ctx.lineTo(this.hitBox.br[0], this.hitBox.br[1]);
    ctx.lineTo(this.hitBox.bl[0], this.hitBox.bl[1]);
    ctx.closePath();
    ctx.stroke();

    this.CalculateHitbox();
    ctx.drawImage(this.graphic, this.hitBox.tl[0], this.hitBox.tl[1], this.size[0] * sizeMultiplier * this.localSizeMultiplier, this.size[1] * sizeMultiplier * this.localSizeMultiplier)
  }

  PatrolCharacter(){

  }
}
  
class Ball{
  // Will contain all properties and functions for the ball object
  constructor(graphic, pos, size, speed)
  {
    this.graphic = graphic; // document.getElementById();
    this.size = size; // [x, y]
    this.position = pos; // [x, y]
    this.speed = speed; // y
    this.xOffset = this.size[0] / 2 * sizeMultiplier;
    this.yOffset = this.size[1] / 2 * sizeMultiplier;
    this.CalculateHitbox();
  }

  graphic;
  size;
  position;
  speed;
  xOffset;
  yOffset;
  hitBox = {
    tl: null,
    tr: null,
    br: null,
    bl: null,
  };

  speedDecelerator = 0.1;
  scoring = false;

  DrawBall()
  {
    this.CalculateHitbox();
    //console.log(this.hitBox);

    // Draw Hitbox
    ctx.beginPath();
    ctx.moveTo(this.hitBox.tl[0], this.hitBox.tl[1]);
    ctx.lineTo(this.hitBox.tr[0], this.hitBox.tr[1]);
    ctx.lineTo(this.hitBox.br[0], this.hitBox.br[1]);
    ctx.lineTo(this.hitBox.bl[0], this.hitBox.bl[1]);
    ctx.closePath();
    ctx.stroke();

    ctx.drawImage(this.graphic, this.position[0] - this.xOffset, this.position[1] - this.yOffset, this.size[0] * sizeMultiplier, this.size[1] * sizeMultiplier);
  }

  MoveBall(){
    if(!player.holding){
      this.position[1] += this.speed;
      if(this.speed > 0)
      {
        this.speed -= this.speedDecelerator;
        if(this.speed < 0)
          this.speed = 0;
      }
      else if(this.speed < 0)
      {
        this.speed += this.speedDecelerator;
        if(this.speed > 0)
          this.speed = 0;
      }
    }

  }

  CalculateHitbox(){
    this.hitBox =
    {
      tl:[
        this.position[0] - this.xOffset,
        this.position[1] - this.yOffset],
      tr:[
        this.position[0] + this.xOffset,
        this.position[1] - this.yOffset],
      br:[
        this.position[0] + this.xOffset,
        this.position[1] + this.yOffset],
      bl:[
        this.position[0] - this.xOffset,
        this.position[1] + this.yOffset],
    }
  }

  Score(goalObject, playerObject){
    if(!playerObject.holding)
    {
      // Match boundaries with hitbox to 'detect' boundaries and invert speed for that axis if needed
      if(this.hitBox.tl[1] < goalObject.hitBox.bl[1] && this.hitBox.tl[0] > goalObject.hitBox.tl[0] && this.hitBox.tr[0] < goalObject.hitBox.tr[0])
      {
        console.log('goal');
        this.speedDecelerator = 0.2;
        //this.speed *= -1;
        this.scoring = true;
        setTimeout(() => this.speed = -10, 500);
        setTimeout(() => this.ResetBall(), 1000);
      }
    }
  }
  
  ResetBall(){
    this.speed = 0;
    this.speedDecelerator = 0.1;
    this.position = [canvasWidth/2, canvasHeight/2]
    this.scoring = false;
  }
}

/*
function drawBall() {
  ctx.drawImage(ball.graphic, ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();
}

function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
}

function bounceBall() {
  // Detect boundaries
  if(ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0)
  {
    ball.dx *= -1;
  }
  
  if(ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0)
  {
    ball.dy *= -1;
  }
}

function holdBall() {
  
  if(graphics.kicking)
  {
    graphics.holding = false;
  }

  if(graphics.holding)
  {
    if(mouse.x > ball.radius)
    {
      if(mouse.x < width - ball.radius)
      {
        ball.x = mouse.x + 20;
      }
      else
      {
        ball.x = width - ball.radius;
      }
    }
    else
    {
      ball.x = ball.radius;
    }

    if(mouse.y > ball.radius)
    {
      if(mouse.y < height - ball.radius)
      {
        ball.y = mouse.y - ball.radius;
      }
      else
      {
        ball.y = height - ball.radius;
      }
    }
    else
    {
      ball.y = ball.radius;
    }
  }

  if(!graphics.kicking)
  {
    // hitbox
    ctx.beginPath();
    ctx.moveTo(mouse.x - 30, mouse.y - 10);
    ctx.lineTo(mouse.x + 30, mouse.y - 10);
    ctx.lineTo(mouse.x + 30, mouse.y);
    ctx.lineTo(mouse.x - 30, mouse.y);
    ctx.closePath();
    ctx.stroke();

    if(ball.x + ball.radius > mouse.x - ball.radius && ball.x - ball.radius < mouse.x + ball.radius)
    {
      if(ball.y + ball.radius > mouse.y - ball.radius && ball.y - ball.radius < mouse.y + ball.radius)
      {
        graphics.holding = true;
        ball.dx = 0;
        ball.dy = 0;
      }
    }
  }
}
*/

// Goal
const goal = new Goal(graphics.goal.graphic, graphics.goal.position, graphics.goal.size, 1);

// Player Character
const player = new Player();

// Opponent Characters
const opposingPlayers = [];
for(let i = 0; i < graphics.characters.players.length; i++)
{
  opposingPlayers.push(new Character(graphics.characters.graphic, graphics.characters.players[i].position[0], graphics.characters.players[i].position[1], graphics.characters.players[i].size[0] * graphics.characters.players[i].localSizeMultiplier * sizeMultiplier, graphics.characters.players[i].size[1] * graphics.characters.players[i].localSizeMultiplier * sizeMultiplier));
  console.log("Opponent Added: " + opposingPlayers[i].position[0] + " : " + opposingPlayers[i].position[1]);
}

// Ball
const ball = new Ball(graphics.ball.graphic, graphics.ball.position, graphics.ball.size, 0);

function Update() {
  // Clears canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(graphics.field.graphic, graphics.field.position[0], graphics.field.position[1], graphics.field.size[0], graphics.field.size[1]);
  goal.DrawGoal();
  
  ball.DrawBall();
  
  // Update Player Character position and Draw
  player.DrawPlayer();
  
  // Iterate through opposing characters, Update their positions and Draw
  for(let i = 0; i < opposingPlayers.length; i++)
  {
    opposingPlayers[i].position = [graphics.characters.players[i].position[0], graphics.characters.players[i].position[1]];
    opposingPlayers[i].DrawCharacter();
    opposingPlayers[i].PatrolCharacter();
  }

  player.CatchBall(ball);

  player.HoldBall(ball);

  ball.MoveBall();

  ball.Score(goal, player);
  
  requestAnimationFrame(Update); // reruns the update for animatability as opposed to running the update from here which would near instantly overflow the call stack.
}

// Event Listeners
addEventListener("mousemove", (event) => {
  
  mouse.x = event.clientX - (pageWidth - canvasWidth) / 2;
  mouse.y = (event.clientY - (pageHeight - canvasHeight) / 2) - 40; // Not sure what the 40 is about, I suspect it's for the h1 element

});

addEventListener('click', () => {
    if(player.holding)
    {
      player.Kick(ball);
    }
});

Update();

/*

Canvas boilerplate ( collision detection ) (Canvas Dojo)


 * Created by Canvas Dojo <https://github.com/znxkznxk1030/canvas-dojo>
 *
 * canvas-boilerplate by <https://github.com/christopher4lis/canvas-boilerplate>
 * Learn more https://chriscourses.com/
 

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};

const colors = ["#2185C5", "#7ECEFD", "#FFF6E5", "#FF7F66"];

// Event Listeners
addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  init();
});

// Particle
class Particle {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.velocity = {
      x: (Math.random() - 0.5) * 0.1,
      y: (Math.random() - 0.5) * 0.1,
    };
    this.radius = radius;
    this.color = color;
    this.mass = 0.5;
    this.opacity = 0;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.save();
    c.globalAlpha = this.opacity;
    c.fillStyle = this.color;
    c.fill();
    c.restore();
    c.strokeStyle = this.color;
    c.stroke();
    c.closePath();
  }

  update(particles) {
    this.draw();

    particles.forEach((particle) => {
      if (this === particle) return;

      if (distance(this.x, this.y, particle.x, particle.y) < this.radius * 2) {
        resolveCollision(this, particle);
      }

      if (this.x - this.radius <= 0 || this.x + this.radius >= innerWidth) {
        this.velocity.x *= -1;
      }

      if (this.y - this.radius <= 0 || this.y + this.radius >= innerHeight) {
        this.velocity.y *= -1;
      }

      // mouse collision detection
      if (
        distance(mouse.x, mouse.y, this.x, this.y) < 60 &&
        this.opacity < 0.2
      ) {
        this.opacity += 0.02;
      } else if (this.opacity > 0) {
        this.opacity -= 0.02;
      }

      this.x += this.velocity.x;
      this.y += this.velocity.y;
    });
  }
}

// Implementation
let particles;
function init() {
  particles = [];

  for (let i = 0; i < 150; i++) {
    const radius = 15;
    let x = randomIntFromRange(radius, innerWidth - radius);
    let y = randomIntFromRange(radius, innerHeight - radius);
    const color = randomColor(colors);

    if (i !== 0) {
      for (let j = 0; j < particles.length; j++) {
        const particle = particles[j];

        if (distance(x, y, particle.x, particle.y) < radius * 2) {
          x = randomIntFromRange(radius, innerWidth - radius);
          y = randomIntFromRange(radius, innerHeight - radius);

          j = -1;
        }
      }
    }
    particles.push(new Particle(x, y, radius, color));
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle) => {
    particle.update(particles);
  });
}

init();
animate();


 *  utils.js - <https://github.com/christopher4lis/canvas-boilerplate/blob/master/src/js/utils.js>
 *  @function randomIntFromRange Picks a random integer within a range
 *  @function randomColor Picks a random color
 *  @function dispatch Find the distance between two points
 

function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}

function distance(x1, y1, x2, y2) {
  const xDist = x2 - x1;
  const yDist = y2 - y1;

  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}


 * Rotates coordinate system for velocities
 *
 * Takes velocities and alters them as if the coordinate system they're on was rotated
 *
 * @param  Object | velocity | The velocity of an individual particle
 * @param  Float  | angle    | The angle of collision between two objects in radians
 * @return Object | The altered x and y velocities after the coordinate system has been rotated
 

function rotate(velocity, angle) {
  const rotatedVelocities = {
    x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
    y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle),
  };

  return rotatedVelocities;
}


 * Swaps out two colliding particles's x and y velocities after running through
 * an elastic collision reaction equation
 *
 * @param  Object | particle      | A particle object with x and y coordinates, plus velocity
 * @param  Object | otherParticle | A particle object with x and y coordinates, plus velocity
 * @return Null   | Dose not return a value
 

function resolveCollision(particle, otherParticle) {
  const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
  const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

  const xDist = otherParticle.x - particle.x;
  const yDist = otherParticle.y - particle.y;

  // Prevent accidental overlap of particles
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
    // Grab angle between the two colliding particles
    const angle = -Math.atan2(
      otherParticle.y - particle.y,
      otherParticle.x - particle.x
    );

    // Store mass in var for better readability in collision equation
    const m1 = particle.mass;
    const m2 = otherParticle.mass;

    // Velocity before equation
    const u1 = rotate(particle.velocity, angle);
    const u2 = rotate(otherParticle.velocity, angle);

    // Velocity after 1d collision equation
    const v1 = {
      x: (u1.x * (m1 - m2)) / (m1 + m2) + (u2.x * 2 * m2) / (m1 + m2),
      y: u1.y,
    };
    const v2 = {
      x: (u2.x * (m1 - m2)) / (m1 + m2) + (u1.x * 2 * m2) / (m1 + m2),
      y: u2.y,
    };

    // Final velocity after rotating axis back to original location
    const vFinal1 = rotate(v1, -angle);
    const vFinal2 = rotate(v2, -angle);

    // Swap particle velocites for realistic bounce effect
    particle.velocity.x = vFinal1.x;
    particle.velocity.y = vFinal2.y;

    otherParticle.velocity.x = vFinal2.x;
    otherParticle.velocity.y = vFinal2.y;
  }
}
*/