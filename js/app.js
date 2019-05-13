// Enemies our player must avoid
var EnemyRight = function() {
    this.x = 0;
    this.y = 0;
    this.sprite = 'images/enemy-bug.png';
    this.spd = 1;
};

var EnemyLeft = function() {
    this.x = 404;
    this.y = 0;
    this.sprite = 'images/enemy-bug-left.png';
    this.spd = 1;
};



const enemy1 = new EnemyRight();
enemy1.y = 57;
enemy1.spd = 100;

const enemy2 = new EnemyRight();
enemy2.y = 140;
enemy2.spd = 300;

const enemy3 = new EnemyRight();
enemy3.y = 223;
enemy3.spd = 200;

const enemy4 = new EnemyLeft();
enemy4.y = 57;
enemy4.spd = -500;

const enemy5 = new EnemyRight();
enemy5.y = 542;
enemy5.spd = 50;

const enemy6 = new EnemyLeft();
enemy6.y = 461;
enemy6.spd = -150;

const enemy7 = new EnemyLeft();
enemy7.y = 380;
enemy7.spd = -400;

const enemy8 = new EnemyLeft();
enemy8.y = 140;
enemy8.spd = -350;

const enemy9 = new EnemyRight();
enemy9.y = 380
enemy9.spd = 200;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
EnemyRight.prototype.update = function(dt) {
    this.x += (this.spd * dt);
    if (this.x > 505){
        this.x = -200;
    }
   
    checkCollision(this.x, this.y);
};
EnemyLeft.prototype.update = function(dt) {
    this.x += (this.spd * dt);
    if (this.x < -200){
        this.x = 505;
    }
   
    checkCollision(this.x, this.y);
};

function checkCollision(x , y){
    if (x >= (player.x - 73) && 
        x <= (player.x + 65) &&
        y >= (player.y - 73) &&
        y <= (player.y + 73)){
            reset();
            score.innerHTML = 0;
    }
}

function reset(){
    player.x = 202;
    player.y = 623;
}

// Draw the enemy on the screen, required method for game
EnemyRight.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

EnemyLeft.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = 202;
    this.y = 623;
}

const score = document.querySelector('.points');

Player.prototype.update = function(dt) {
    if (this.y < 0){
        reset();
        score.innerHTML ++;
    }
    if (this.y > 623){
        this.y = 623;
    }else if (this.x > 404){
        this.x = 404;
    }else if(this.x < 0){
       this.x = 0;
    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

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
// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.



// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

const allEnemies = [enemy1, enemy2, enemy3, enemy4, enemy5, enemy6, enemy7, enemy8, enemy9];
const player = new Player();

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
