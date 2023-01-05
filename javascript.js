const pageWidth = document.body.clientWidth;
const pageHeight = document.body.clientHeight;

const canvas = document.getElementById('canvas');
const canvasWidth = canvas.width = 300;
const canvasHeight = canvas.height = 600;

const sizeMultiplier = 0.4;

const ctx = canvas.getContext('2d');

let score = 0;
ctx.font = "bold 30px Trebuchet MS";
ctx.textAlign = "center";
ctx.fillStyle = "white";

// Reference to the mouse position
const mouse = {
    x: 0,
    y: 0,
};

// An object that holds all the details for objects that will spawn onto the field
const graphics = {
  field: {
    graphic: document.getElementById('field'),
    size: [300, 600],
    position: [0, 0],
    isDynamic: false,
    resistance: 0.1,
  },
  goal: {
    graphic: document.getElementById('goal'),
    size: [150, 70],
    position: [150, 35],
    isDynamic: true,
    resistance: 0.3,
  },
  ball: {
    graphic: document.getElementById('ball'),
    size: [100, 100],
    position: [canvasWidth / 2, canvasHeight / 2],
  },
  player: {
    graphic: document.getElementById('character'),
    size: [180, 240],
    hitboxHeight: 50,
    kickStrength: 5,
    resistance: 0,
  },
  opponents: {
    graphic: document.getElementById('character'),
    resistance: 2,
    players: [
      {
        position: [100, 60],
        size: [180, 240],
        speed: 2,
        speedDecrementor: 0.2,
        travelTime: 0.8,
        travelTimeDecrementor: 0.1,
        hitboxHeight: 100, // This will have to function as a percentage
      },
      {
        position: [50, 200],
        size: [180, 240],
        speed: 2,
        speedDecrementor: 0.5,
        travelTime: 4,
        travelTimeDecrementor: 0.1,
        hitboxHeight: 30 // This will have to function as a percentage
      },
    ],
  }
};

// Determines whether the ball is intersecting with another object
let ballIsIntersecting = ((intersector) => 
{
  if(intersector.hitbox.bottom > ball.hitbox.top &&
    intersector.hitbox.right > ball.hitbox.left &&
    intersector.hitbox.top < ball.hitbox.bottom &&
    intersector.hitbox.left < ball.hitbox.right)
    {
      return true;
    }
    return false;
});

// Drawing the hitbox for the object calling the function
function DrawHitbox(coords, color = [0,255,0])
{
  ctx.beginPath();
  ctx.moveTo(coords.left, coords.top);
  ctx.lineTo(coords.right, coords.top);
  ctx.lineTo(coords.right, coords.bottom);
  ctx.lineTo(coords.left, coords.bottom);
  ctx.closePath();
  ctx.strokeStyle = "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", 1)";
  ctx.fillStyle = "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", 0.3)";
  ctx.stroke();
  ctx.fill();
}

// Extender class to allow for function bundling, like Draw() and CalculateHitBox()
class BasicFunctions{
  constructor(graphic, size, position, isDynamic)
  {
    this.graphic = graphic;
    this.size = size;
    this.position = position;
    
    if(isDynamic)
    {
      this.isDynamic = isDynamic;
      
      //this.size = [size[0] * sizeMultiplier, size[1] * sizeMultiplier];
      this.xOffset = this.size[0] / 2;
      this.yOffset = this.size[1] / 2;

      this.CalculateHitbox();
    }
  }

  graphic;
  size;
  position;

  isDynamic = false;

  xOffset = 0;
  yOffset = 0;

  hitbox;

  // At the moment only the field and the goal posts are using the extender class to reduce the number of the same functions being fired off, so the hitbox is rather specific to the goal post
  CalculateHitbox(){
    this.hitbox =
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

  // Draw the object and it's hitbox based on whether it is a dynamic object
  Draw()
  {
    if(this.isDynamic)
    {
      this.CalculateHitbox();
      DrawHitbox(this.hitbox, [100, 255, 100]);
    }
    
    ctx.drawImage(this.graphic, this.position[0] - this.xOffset, this.position[1] - this.yOffset, this.size[0], this.size[1]);
  }
}

// Testing efficacy of BasicFunctions extender function
// It uses and extender function to reduce variable and function repetition across multiple classes
// At this point only the Goal and Field classes use this method of repetition reduction
class Field extends BasicFunctions{
  constructor(graphic, size, position, isDynamic, resistance) {
    super(graphic, size, position, isDynamic);
  }
}

// Class that holds important values and functions specific to goal management
// It uses and extender function to reduce variable and function repetition across multiple classes
// At this point only the Goal and Field classes use this method of repetition reduction
class Goal extends BasicFunctions{
  constructor(graphic, position, size, isDynamic, resistance){
    super(graphic, size, position, isDynamic)
    /*
    this.graphic = graphic;
    this.position = position;
    this.size = size;

    this.xOffset = this.size[0] / 2;
    this.yOffset = this.size[1] / 2;
    this.CalculateHitbox();
    */
  }
  /*
  graphic;
  position;
  size;

  xOffset;
  yOffset;
  
  hitbox;
  
  CalculateHitbox(){
    this.hitbox =
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
      ctx.moveTo(this.hitbox.left, this.hitbox.top);
      ctx.lineTo(this.hitbox.right, this.hitbox.top);
      ctx.lineTo(this.hitbox.right, this.hitbox.bottom);
      ctx.lineTo(this.hitbox.left, this.hitbox.bottom);
      ctx.closePath();
      ctx.stroke();
    }
    
    ctx.drawImage(this.graphic, this.position[0] - this.xOffset, this.position[1] - this.yOffset, this.size[0], this.size[1]);
  }
  */
}

// Class that holds important values and functions specific to player management
class Player{
  constructor(graphic, size, hitboxHeight, kickStrength){
    this.graphic = graphic;
    this.size = size;
    this.hitboxHeight = hitboxHeight;
    this.kickStrength = kickStrength;

    this.MovePlayer();
    this.CalculateHitbox();
  }

  graphic;
  size;
  position;
  hitboxHeight = 10;
  cantTouch = false;
  holding = false;
  kickStrength;

  hitbox;

  CalculateHitbox(){
    this.hitbox = {
      top:
      this.position[1] - this.hitboxHeight * sizeMultiplier,
      right:
      this.position[0] + this.size[0] / 2 * 0.75 * sizeMultiplier,
      bottom:
      this.position[1],
      left:
      this.position[0] - this.size[0] / 2 * 0.75 * sizeMultiplier,
    }
  }
  
  // Keep the player object stuck on the mouse position
  MovePlayer() {
    this.position = [mouse.x, mouse.y];
    this.CalculateHitbox();
  }
  
  // Draw the player
  DrawPlayer() {

    DrawHitbox(this.hitbox, [50, 50, 255])

    ctx.drawImage(this.graphic, (mouse.x - this.size[0] / 2 * sizeMultiplier), (mouse.y - this.size[1] * sizeMultiplier), this.size[0] * sizeMultiplier, this.size[1] * sizeMultiplier)
  }

  // The user clicks the mouse an the ball is moved upwards
  Kick(ballObject){
    ballObject.speed = -this.kickStrength;

    this.holding = false;
    this.cantTouch = true;
    if(!ball.resetting)
      setTimeout(() => this.cantTouch = false, 300);
  }
}

class Opponent{
  constructor(graphic, position, size, speed, speedDecrementor, travelTime, travelTimeDecrementor, hitboxHeight)
  {
    this.graphic = graphic;
    this.position = position;
    this.patrolPosition = canvasWidth - position[0];
    this.size = size;
    this.speed = speed;
    this.tempSpeed = speed;
    this.speedDecrementor = speedDecrementor;
    this.travelTime = travelTime;
    this.travelTimeTemp = travelTime;
    this.travelTimeDecrementor = travelTimeDecrementor;

    this.xOffset = this.size[0] / 2 * sizeMultiplier;
    this.yOffset = this.size[1] / 2 * sizeMultiplier;
    this.hitboxHeight = hitboxHeight;
    this.CalculateHitbox();

  }

  graphic;
  position;
  size;
  speed;

  xOffset;
  yOffset;
  
  hitboxHeight;
  hitbox;

  patrolPosition;
  tempSpeed;
  speedDecrementor;

  travelTime;
  travelTimeTemp;
  travelTimeDecrementor;

  CalculateHitbox(){
    this.hitbox =
    {
      top:
        (this.position[1] + this.yOffset) - this.yOffset * 2 * this.hitboxHeight * 0.01,
      right:
        this.position[0] + this.xOffset * 0.75,
      bottom:
        this.position[1] + this.yOffset,
      left:
        this.position[0] - this.xOffset * 0.75,
    }
  }

  DrawCharacter(){
    this.CalculateHitbox();
    
    DrawHitbox(this.hitbox, [255, 100, 100]);

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
      else if(this.tempSpeed == 0)
      {
        this.tempSpeed = canvasWidth - this.hitbox.right > this.hitbox.left ? this.speed : -this.speed;
      }
      this.travelTimeTemp = this.travelTime;
    }
  }
}
  
// Will contain all properties and functions for the ball object
class Ball{
  constructor(graphic, pos, size, fieldResistance, opponentResistance, goalResistance)
  {
    this.graphic = graphic; // document.getElementById();
    this.size = [size[0] * sizeMultiplier, size[1] * sizeMultiplier]; // [x, y]
    this.position = pos; // [x, y]
    this.xOffset = this.size[0] / 2;
    this.yOffset = this.size[1] / 2;
    this.fieldResistance = fieldResistance;
    this.opponentResistance = opponentResistance;
    this.goalResistance = goalResistance;
    this.activeResistance = fieldResistance;
    this.CalculateHitbox();
  }

  // Base settings
  graphic;
  size;
  position;

  xOffset;
  yOffset;
  hitbox;
  
  // Resistance settings to determine slow-down ratios
  activeResistance;
  fieldResistance;
  opponentResistance;
  goalResistance;
  
  // determines how fast the ball moves across the field
  speed = 0;
  
  // Rotation settings
  ballRotation = 5;
  ballRotationStep = 0;
  
  // while the resetting function is running we don't want the resetting function to run multiple times and changing values unnecessarily when the ball is still in the net
  resetting = false;
  
  // Draw the ball
  DrawBall()
  {
    this.CalculateHitbox();

    // To rotate the ball, the canvas has to be saved, rotated, drawn and then restored
    ctx.save();
    ctx.translate(this.position[0], this.position[1]);
    this.ballRotation += this.ballRotationStep;
    ctx.rotate(this.ballRotation * Math.PI / 180);
    ctx.drawImage(this.graphic, -this.xOffset, -this.yOffset, this.size[0], this.size[1]);
    ctx.restore();
    
  }

  // The ball should simply move, but there are a few interactions that determine it's movement speed
  MoveBall()
  {
    // Determine when the player holds the ball
    if(!player.cantTouch)
    {
      player.holding = ballIsIntersecting(player);
    }
    
    // When the player holds the ball, it should stick to the mouse position
    if(player.holding)
    {
      /*
      let getDistance = ((num1, num2) => {
        return num1 - num2 < 0 ? -(num1 - num2) : (num1 - num2);
      });

      let arr = getDistance(player.position[0], this.position[0]) + getDistance(player.position[1], this.position[1]);
      */
      this.position = [player.position[0], player.position[1] - this.size[1] / 2];
    }
    else // or it should be moving around based on it's speed and slow-down values
    {
      this.position[1] += this.speed;
      // the rotation stepping looks good with this value
      this.ballRotationStep = this.speed * 2;
      
      // if the ball is moving downwards the following will allow for a slow-down-to-stopping based on the current resistance value on the ball
      if(this.speed > 0)
      {
        this.speed -= this.activeResistance;
        this.ballRotationStep -= this.activeResistance;
        if(this.speed <= 0)
        {
          this.speed = this.ballRotationStep = 0;
          player.cantTouch = false;
        }
      }
      else if(this.speed < 0) // if the ball is moving upwards the following will allow for a slow-down-to-stopping based on the current resistance value on the ball
      {
        this.speed += this.activeResistance;
        this.ballRotationStep += this.activeResistance;
        if(this.speed >= 0)
        {
          this.speed = this.ballRotationStep = 0;
          player.cantTouch = false;
        }
      }
      
      // and when it's interacted with the goal area, should be reset
      if(ballIsIntersecting(goal))
      {
        if(this.resetting)
          return;
        this.ResetBall(true);
      }
    }
    
    // Much like a goal, the ball will be reset, with a few other details changing
    opposingPlayers.forEach(character => {
      if(ballIsIntersecting(character))
      {
        player.cantTouch = true;
        player.holding = false;
        if(this.resetting)
          return;
        this.ResetBall(false);
      }
    });
  }

  // Calculate the area of influence for objects to determine intersection
  CalculateHitbox()
  {
    this.hitbox =
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

  // When the ball hits the goal(scored = true) or an opponent(scored = false) has the ball stop, and be flung off the field and then reset in the center of the field
  // Timeouts create a more animated reset state
  ResetBall(scored)
  {
    // Ball made non-interactive
    this.resetting = true;
    player.cantTouch = true;
    // the slow-down ratio of the ball changes
    this.activeResistance = scored ? this.goalResistance : this.opponentResistance;
    // the score is changed and updated
    score += scored ? 1 : -score;
    setTimeout(() => {
      // Ball taken off field with no slow-down ratio
      this.speed = scored ? -10 : 15;
      this.activeResistance = 0;
      setTimeout(() => {
        // Ball, speed and slow-down ratio are reset
        this.speed = 0;
        this.activeResistance = this.fieldResistance;
        this.position = [canvasWidth / 2, canvasHeight / 2];
        setTimeout(() => {
          // Ball made interactive again
          this.resetting = false;
          player.cantTouch = false;
        }, 500);
      }, 1000);
    }, 500);
  }
}

// Create Objects:
// Field
const field = new Field(graphics.field.graphic, graphics.field.size, graphics.field.position, graphics.field.isDynamic);
// Goal
const goal = new Goal(graphics.goal.graphic, graphics.goal.position, graphics.goal.size, graphics.goal.isDynamic);
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
  opposingPlayers.push(new Opponent(
    graphics.opponents.graphic,
    graphics.opponents.players[i].position, 
    graphics.opponents.players[i].size, 
    graphics.opponents.players[i].speed,
    graphics.opponents.players[i].speedDecrementor,
    graphics.opponents.players[i].travelTime,
    graphics.opponents.players[i].travelTimeDecrementor,
    graphics.opponents.players[i].hitboxHeight));
}
// Ball
const ball = new Ball(graphics.ball.graphic, graphics.ball.position, graphics.ball.size, graphics.field.resistance, graphics.opponents.resistance, graphics.goal.resistance);

// Update function that runs once per frame, running functions that updates positions, triggers actions and renders results
function Update() {
  // Need to clear the canvas lest a "hall of mirrors" effect results from previous frames bleeding over the current frame
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Run all positional function updates
  // Player position
  player.MovePlayer();
  // Ball
  ball.MoveBall();
  // Opponents
  for(let i = 0; i < opposingPlayers.length; i++)
  {
    opposingPlayers[i].PatrolCharacter();
  }
  
  // Render/Draw
  // Background "field" graphic first
  field.Draw();

  // Goal
  goal.Draw();

  // Opponents
  for(let i = 0; i < opposingPlayers.length; i++)
  {
    opposingPlayers[i].DrawCharacter();
  }

  // Ball
  ball.DrawBall();
  
  // Player
  player.DrawPlayer();

  // Score
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillText("Score: " + score, canvasWidth / 2, canvasHeight - 22);
  
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