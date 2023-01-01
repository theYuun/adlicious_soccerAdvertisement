var dev = false;

const pageWidth = document.body.clientWidth;
const pageHeight = document.body.clientHeight;

const canvas = document.getElementById('canvas');
const canvasWidth = canvas.width = 300;
const canvasHeight = canvas.height = 600;

const sizeMultiplier = 0.5;

const ctx = canvas.getContext('2d');

let score = 0;
ctx.font = "bold 30px Trebuchet MS";
ctx.textAlign = "center";
ctx.fillStyle = "white";

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
    size: [180, 240],
    hitboxHeight: 10,
    kickStrength: 5,
  },
  opponents: {
    graphic: document.getElementById('character'),
    players: [
      {
        position: [100, 60],
        size: [180, 240],
        speed: 2,
        speedDecrementor: 0.2,
        travelTime: 1.5,
        travelTimeDecrementor: 0.2,
      },
      /*
      {
        position: [200, 200],
        size: [180, 240],
        speed: 10,
      },
      */
    ],
  }
};


class Goal{
  constructor(graphic, position, size){
    
    this.graphic = graphic;
    this.position = position;
    this.size = size;

    this.xOffset = this.size[0] / 2;
    this.yOffset = this.size[1] / 2;

    this.CalculateHitbox();
  }
  
  graphic;
  position;
  size;

  xOffset;
  yOffset;

  hitBox = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };

  CalculateHitbox(){
    this.hitBox =
    {
      top:
        this.position[1] - this.yOffset,
      right:
        this.position[0] + this.xOffset - 5,
      bottom:
        this.position[1] + this.yOffset - 5,
      left:
        this.position[0] - this.xOffset + 5,
    };
  }

  DrawGoal(){
    this.CalculateHitbox();
    
    if(dev)
    {
      ctx.beginPath();
      ctx.moveTo(this.hitBox.left, this.hitBox.top);
      ctx.lineTo(this.hitBox.right, this.hitBox.top);
      ctx.lineTo(this.hitBox.right, this.hitBox.bottom);
      ctx.lineTo(this.hitBox.left, this.hitBox.bottom);
      ctx.closePath();
      ctx.stroke();
    }

    ctx.drawImage(this.graphic, this.position[0] - this.xOffset, this.position[1] - this.yOffset, this.size[0], this.size[1]);
  }

}

class Player{
  constructor(graphic, size, hitboxHeight, kickStrength){
    this.graphic = graphic;
    this.size = size;
    this.hitboxHeight = hitboxHeight;
    this.kickStrength = kickStrength;

    this.CalculateHitBox();
  }

  graphic;
  size;
  hitboxHeight = 10;
  kicking = false;
  holding = false;
  kickStrength;

  hitbox = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  }

  CalculateHitBox(){
    this.hitbox = {
      top: mouse.y - this.hitboxHeight * sizeMultiplier,
      right: mouse.x + this.size[0] / 2 * 0.6 * sizeMultiplier,
      bottom: mouse.y,
      left: mouse.x - this.size[0] / 2 * 0.6 * sizeMultiplier,
    }
  }

  DrawPlayer() {

    this.CalculateHitBox();
    if(dev)
    {
      // hitbox
      ctx.beginPath();
      ctx.moveTo(this.hitbox.left, this.hitbox.top);
      ctx.lineTo(this.hitbox.right, this.hitbox.top);
      ctx.lineTo(this.hitbox.right, this.hitbox.bottom);
      ctx.lineTo(this.hitbox.left, this.hitbox.bottom);
      ctx.closePath();
      ctx.stroke();
  
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'orange';
      ctx.fill();
    }

    ctx.drawImage(this.graphic, (mouse.x - this.size[0] / 2 * sizeMultiplier), (mouse.y - this.size[1] * sizeMultiplier), this.size[0] * sizeMultiplier, this.size[1] * sizeMultiplier)
  }

  Kick(ballObject){
    console.log(ballObject.position);
    ballObject.speed = -this.kickStrength;

    this.holding = false;
    this.kicking = true;
    setTimeout(() => this.kicking = false, 100);
  }
}

class Character {
  constructor(graphic, position, size, speed, speedDecrementor, travelTime, travelTimeDecrementor)
  {
    this.graphic = graphic;
    this.position = position;
    this.patrolPosition = canvasWidth - position[0];
    this.size = size;
    this.speed = speed;
    this.tempSpeed = speed;
    this.speedDecrementor = speedDecrementor;
    this.travelTime = travelTime;
    this.travelTimeDecrementor = travelTimeDecrementor;

    this.xOffset = this.size[0] / 2 * sizeMultiplier;
    this.yOffset = this.size[1] / 2 * sizeMultiplier;
    this.CalculateHitbox();
  }

  graphic;
  position = [];
  size = [];
  speed = 0;

  xOffset = 0;
  yOffset = 0;
  
  hitBox = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };

  patrolPosition = 0;
  tempSpeed = 0;

  travelTime = 2;
  travelTimeTemp = this.travelTime;
  travelTimeDecrementor = 0.1;
  speedDecrementor = 0.2;

  CalculateHitbox(){
    this.hitBox =
    {
      top:
        this.position[1] - this.yOffset,
      right:
        this.position[0] + this.xOffset,
      bottom:
        this.position[1] + this.yOffset,
      left:
        this.position[0] - this.xOffset,
    }
  }

  DrawCharacter(){
    this.CalculateHitbox();
    
    if(dev)
    {
      // hitbox
      ctx.beginPath();
      ctx.moveTo(this.hitBox.left, this.hitBox.top);
      ctx.lineTo(this.hitBox.right, this.hitBox.top);
      ctx.lineTo(this.hitBox.right, this.hitBox.bottom);
      ctx.lineTo(this.hitBox.left, this.hitBox.bottom);
      ctx.closePath();
      ctx.stroke();
    }

    ctx.drawImage(this.graphic, this.position[0] - this.xOffset, this.position[1] - this.yOffset, this.size[0] * sizeMultiplier, this.size[1] * sizeMultiplier);
  }
  PatrolCharacter(){

    this.position[0] += this.tempSpeed;
    this.travelTimeTemp -= this.travelTimeDecrementor;

    if(this.travelTimeTemp < 0)
    {
      if(this.tempSpeed > 0)
      {
        this.tempSpeed -= this.speedDecrementor;
        if(this.tempSpeed < 0)
        {
          this.tempSpeed = -this.speed;
        }
      }
      else if(this.tempSpeed < 0)
      {
        this.tempSpeed += this.speedDecrementor;
        if(this.tempSpeed > 0)
        {
          this.tempSpeed = this.speed;
        }
      }
      this.travelTimeTemp = this.travelTime;
    }
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
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };

  speedDecelerator = 0.1;
  scoring = false;

  ballRotation = 0;

  DrawBall()
  {
    this.CalculateHitbox();
    //console.log(this.hitBox);

    if(dev)
    {
      // Draw Hitbox
      ctx.beginPath();
      ctx.moveTo(this.hitBox.left, this.hitBox.top);
      ctx.lineTo(this.hitBox.right, this.hitBox.top);
      ctx.lineTo(this.hitBox.right, this.hitBox.bottom);
      ctx.lineTo(this.hitBox.left, this.hitBox.bottom);
      ctx.closePath();
      ctx.stroke();
    }
    /*
    ctx.save();
    ctx.translate(this.position[0] - this.xOffset, this.position[1] - this.yOffset);
    
    ctx.rotate(5 * this.ballRotation * Math.PI / 180);
    ctx.drawImage(this.graphic, -this.xOffset, -this.yOffset, graphics.ball.size[0] * sizeMultiplier, graphics.ball.size[1]*sizeMultiplier);
    ctx.restore();
    */
    
    ctx.drawImage(this.graphic, this.position[0] - this.xOffset, this.position[1] - this.yOffset, this.size[0] * sizeMultiplier, this.size[1] * sizeMultiplier);
  }

  MoveBall()
  {
    if(player.holding)
    {
      this.speed = 0;
      this.position = [mouse.x, mouse.y - this.size[1]/2 * sizeMultiplier];
      if(!player.kicking)
      {
        this.holding = false;
      }
    }
    else
    {
      this.position[1] += this.speed;
      //this.ballRotation = 5;
      
      if(this.speed > 0)
      {
        this.speed -= this.speedDecelerator;
        //this.ballRotation -= 1;
        if(this.speed < 0)
        this.speed = 0;
      }
      else if(this.speed < 0)
      {
        this.speed += this.speedDecelerator;
        //this.ballRotation += 1;
        if(this.speed > 0)
        this.speed = 0;
      }
      
      if(this.hitBox.top < goal.hitBox.bottom &&
        this.hitBox.right > goal.hitBox.left &&
        this.hitBox.left < goal.hitBox.right)
      {
        if(this.scoring)
          return;
        this.scoring = true;
        this.Score();
      }
    }
  }

  CatchBall()
  {
    if(!player.kicking)
    {
      if(player.hitbox.bottom > this.hitBox.top &&
      player.hitbox.right > this.hitBox.left &&
      player.hitbox.top < this.hitBox.bottom &&
      player.hitbox.left < this.hitBox.right)
      {
        player.holding = true;
      }
    }
  }

  CalculateHitbox()
  {
    this.hitBox =
    {
      top:
        this.position[1] - this.yOffset,
      right:
        this.position[0] + this.xOffset,
      bottom:
        this.position[1] + this.yOffset,
      left:
        this.position[0] - this.xOffset,
    }
  }
  Score()
  {
    setTimeout(() => {
      player.kicking = true;
      score += 1;
      UpdateScore();
      this.speedDecelerator = 0.2;
      console.log(4);
      setTimeout(() => {
        this.speed = -10;
        console.log(3);
        setTimeout(() => {
          this.speed = 0;
          this.speedDecelerator = 0.1;
          this.position = [canvasWidth / 2, canvasHeight / 2];
          console.log(2);
          setTimeout(() => {
            console.log(1);
            this.scoring = false;
            player.kicking = false;
          },500);
        },500);
      },500);
    },500);
  }
}

// Create Objects:
// Goal
const goal = new Goal(graphics.goal.graphic, graphics.goal.position, graphics.goal.size, 1);
// Player
const player = new Player(
  graphics.player.graphic, 
  graphics.player.size, 
  graphics.player.hitboxHeight, 
  graphics.player.kickStrength);
// Opponents
const opposingPlayers = [];
for(let i = 0; i < graphics.opponents.players.length; i++)
{
  opposingPlayers.push(new Character(
    graphics.opponents.graphic, 
    graphics.opponents.players[i].position, 
    graphics.opponents.players[i].size, 
    graphics.opponents.players[i].speed,
    graphics.opponents.players[i].speedDecrementor,
    graphics.opponents.players[i].travelTime,
    graphics.opponents.players[i].travelTimeDecrementor));
  console.log("Opponent Added: " + opposingPlayers[i], opposingPlayers[i].position[0] + " : " + opposingPlayers[i].position[1]);
}
// Ball
const ball = new Ball(graphics.ball.graphic, graphics.ball.position, graphics.ball.size, 0);

// Update function that runs once per frame, running functions that updates positions, triggers actions and renders results
function Update() {
  // Need to clear the canvas lest a "hall of mirrors" effect results from previous frames bleeding over the current frame
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Run all positional function updates
  // Run function for movement logic for the ball object
  ball.MoveBall();
  // Check if the ball object entered the player object's hitbox
  ball.CatchBall();
  // Iterate through opposing characters and update their positions
  for(let i = 0; i < opposingPlayers.length; i++)
  {
    opposingPlayers[i].PatrolCharacter();
  }
  
  // Render
  // Background "field" graphic first
  ctx.drawImage(graphics.field.graphic, graphics.field.position[0], graphics.field.position[1], graphics.field.size[0], graphics.field.size[1]);
  // "Goal post" object's graphic
  goal.DrawGoal();

  for(let i = 0; i < opposingPlayers.length; i++)
  {
    opposingPlayers[i].DrawCharacter();
  }

  
  // Ball object's graphic
  ball.DrawBall();
  // Player object's graphic
  player.DrawPlayer();

  // Score
  ctx.fillText("Score: " + score, canvasWidth / 2, canvasHeight - 22);
  
  requestAnimationFrame(Update); // reruns the update for animatability as opposed to running the update from here which would near instantly overflow the call stack.
}

function UpdateScore(){
}

// Event Listeners
addEventListener("mousemove", (event) => {
  
  mouse.x = event.clientX - (pageWidth - canvasWidth) / 2;
  mouse.y = (event.clientY - (pageHeight - canvasHeight) / 2) - 40; // Not sure what the 40 is about, I suspect it's for the h1 element

});

addEventListener('click', () => {
  
    console.log(ball.speed);
    
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