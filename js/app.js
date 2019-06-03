//constructor function for enemies
var Enemy = function(startRow, spd, isLeft) {
    this.isLeft = isLeft
    if (this.isLeft === 1){
        this.x = 909;
        this.sprite = 'images/enemy-bug-left.png';
        this.spd = spd * -1;
    }else{
        this.x = -200;
        this.sprite = 'images/enemy-bug.png'
        this.spd = spd;
    }
    this.y = startRow;
}

// function that selects a random index on an array
function random(array){
    return array[Math.floor((Math.random() * array.length))];
}

const enemyPos = [57, 140, 223, 380, 461, 542] // positions that enemies can spawn in corresponding to the stone rows

const enemySpdArray = [100, 800, 200, 450, 370, 600, 150, 400, 350, 700] // enemy spd

//for loops that generates enemy objects
let allEnemies = [];
for (let x = 0; x < 10; x++){
    allEnemies[x] = new Enemy(random(enemyPos), enemySpdArray[x], random([0,1]));
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x += (this.spd * dt); // how fast enemy moves
    if (this.isLeft && this.x < -200){
        this.x = 909; // resets position of enemy once it moves off-screen
        this.spd = -random(enemySpdArray); // randomizes enemy speed after it moves off-screen
        this.y = random(enemyPos); // randmizes enemy position after it moves off-screen
    }else if (!this.isLeft && this.x > 909){
        this.x = -200;
        this.spd = random(enemySpdArray);
        this.y = random(enemyPos);
    }
   
    this.checkCollision(this.x, this.y); // calls collision method
};

// method that checks collision with player object
Enemy.prototype.checkCollision = function(x , y){
    if (x >= (player.x - 73) && // if statement that triggers reset function if enemy comes into contact with a 73x73 square around player object
    x <= (player.x + 73) &&
    y >= (player.y - 73) &&
    y <= (player.y + 73)){
        reset();
        score.innerHTML = 0; // resets score upon collision
    }
}

// function to reset player position
function reset(){ 
    player.x = 404;
    player.y = 623;
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// constructor function for the player object
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = 404;
    this.y = 623;
}

// variable to keep track of score
const score = document.querySelector('.points');

Player.prototype.update = function(dt) {
    if (this.y < 0){ // if statement that triggers when player reaches water tile
        reset(); // resets player position
        score.innerHTML ++; // adds 1 to score
    }
    if (this.y > 623){ // if statements that prevent player from moving out of game area
        this.y = 623;
    }else if (this.x > 808){
        this.x = 808;
    }else if(this.x < 0){
       this.x = 0;
    }
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// method that controls player movement
Player.prototype.handleInput = function(input){
    if (input === 'left'){
        this.x -= 101;
    }else if (input === 'right'){
        this.x += 101;
    }else if (input === 'up'){
        this.y -= 81;
    }else{
        this.y += 81;
    }
};

// arrays containing all x, y coordinates for stopwatch spawn (excludes grass and water tiles)
const xArray = [0, 101, 202, 303, 404, 505, 606, 707, 808];
const yArray = [592, 511, 430, 268, 187, 106];

// function that updates the position of the stopwatch
updatePos = function(){
    buff.x = random(xArray);
    buff.y = random(yArray);
};

// constructor function for the stopwatch buff
var TimeSlow = function() {
    this.sprite = 'images/stopwatch.png';
    this.x = -200; // coordinates that spawn the stopwatch off-screen
    this.y = -200;
};


TimeSlow.prototype.update = function(dt) {
    this.checkCollision(this.x, this.y);
};

// Draw the stopwatch on the screen, required method for game
TimeSlow.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// function that resets enemy speed back to normal after time slow effect is done
function resetSpd() {
    let count = 0;
    allEnemies.forEach(function(element){
        if (element.isLeft === 0){
            element.spd = enemySpdArray[count];
            count++;
        }else{
            element.spd = (enemySpdArray[count] * -1);
            count++;
        }
    }
)}

// method that checks collision with player object
TimeSlow.prototype.checkCollision = function(x , y) {
    if (x >= (player.x - 73) && 
        x <= (player.x + 73) &&
        y >= (player.y - 20) &&
        y <= (player.y + 73)){
            allEnemies.forEach(function(element){ // for each loop that reduces all enemy's speed by a factor of 4 when stopwatch is triggered
                element.spd /= 4;
                buff.x = -100; // moves stopwatch off-screen after collision with player
                buff.y = -100;
            });
    }
    if (buff.x === -100){ // if statement that adds original speed back to all enemies
        buff.x = -200;
        setTimeout(resetSpd, 5000); // time slow is active for 5 seconds before triggering resetSpd function
        clearInterval(buffTimer); // removes spawning interval of stopwatch
        buffTimer = setInterval(updatePos, random(timeArray)); // re-adds spawning interval of stopwatch
    }
}    

// function that lets user select character sprite
document.addEventListener('click', function(){
    if (event.target.className.substring(0,4) === 'char'){
        player.sprite = `images/${event.target.className}.png`;
    }
});


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// array containing potential spawn times for the stopwatch
const timeArray = [10000, 15000, 20000, 25000];

// setInterval that causes the stopwatch to spawn at random times
let buffTimer = setInterval(updatePos, random(timeArray));

const player = new Player();
const buff = new TimeSlow;

