// Enemies our player must avoid
var tileWidth = 101;
var tileHeight = 83;
var baseSpeed = 100;
var firstRow = 68;
var secondRow = 151;
var thirdRow = 234;
var numCols = 5;
var numRows = 6;
var numEnemies = 4;
var numGems = 3;
var gameOn = false;      

function gameTitle() {
    ctx.font="20px Georgia";
    ctx.fillText('Lives: ', 10, 45);
    ctx.font="30px Verdana";
// Create gradient
    var gradient=ctx.createLinearGradient(0, 0, 606, 0);
    gradient.addColorStop("0","magenta");
    gradient.addColorStop("0.5","blue");
    gradient.addColorStop("1.0","red");
// Fill with gradient
    ctx.fillStyle=gradient;
    ctx.fillText("Bug Smile!", 175, 45);
}

function randomRows() {
    var rows = [firstRow, secondRow, thirdRow];
    return rows[Math.floor(Math.random() * 3)];//return a random y coordinate
}

var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.speed = baseSpeed + Math.floor(Math.random() * 10) * 20;
    this.startX = -tileWidth;
    this.x = this.startX;
    this.y = randomRows();
}
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x +=this.speed * dt;
    if(this.x > tileWidth * numCols) {
        this.x = this.startX;
        this.y = randomRows();
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
Enemy.prototype.reset = function() {
    this.speed = baseSpeed + Math.floor(Math.random() * 10) * 20;
    this.startX = -tileWidth;
    this.x = this.startX;
    this.y = randomRows();
}

// Player class requires an update(), render() and a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.startX = tileWidth * 2;
    this.startY = 400;
    this.x = this.startX;
    this.y = this.startY;
    this.points = 0;
    this.lives = 3;
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.update = function() {
    checkCollisions();
    reachedWater();
}

// Instantiate objects.
// Place all enemy objects in an array called allEnemies
var Lives = function() {
    this.sprite = 'images/Heart.png';
}
Lives.prototype.render = function() {
    for(var i = 0; i < player.lives; i++) {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, tileWidth/2, tileHeight*0.8);
    this.x = 0 + tileWidth*i/2;
    this.y = 40;
    }
}
var lives = new Lives();
var allEnemies = [];
for(var i = 0; i < numEnemies; i++) {
    var enemy = new Enemy();
    allEnemies.push(enemy);
}

// Place the player object in a variable called player
var player = new Player();

Player.prototype.handleInput = function(key){
    switch(key) {
        case 'left':
            if(this.x - tileWidth < 0) return;
                this.x -= tileWidth;
        break;
        case 'right':
            if(this.x + tileWidth > numCols * (tileWidth - 1)) return;
                this.x += tileWidth;
        break;
        case 'up': 
            if (this.y < tileHeight * 0.5) {
                reachedWater();
            }
            else this.y -= tileHeight;
        break;
        case 'down':
            this.y += tileHeight;
            if(this.y > this.startY){
                this.y = this.startY;
            }
        break;
        default:
        break;
    }
}
Player.prototype.reset = function () {
    this.x = this.startX;
    this.y = this.startY;
}
function reachedWater() {
    if(player.lives > 0) {
        if(player.y < tileHeight * 0.5) {
                player.lives--;
                player.reset();
        }
    }else{
        gameOver();
        clearInterval(interval);
    }
}

function randomGemSprite() {
    var gems = [
    'images/gem-orange.png',
    'images/gem-blue.png',
    'images/gem-green.png'
    ];
    return gems[Math.floor(Math.random() * 3)];
}

function gemPoints() {
    var points = [100, 200, 300];
    return points[Math.floor(Math.random() * 3)];
}

var Gem = function() {
    this.sprite = randomGemSprite();
    this.points = gemPoints();
    this.x = Math.floor(Math.random() * numCols)*tileWidth;
    this.y = randomRows();
}

Gem.prototype.render = function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
//Gem.prototype.update = function() {
//}
Gem.prototype.reset = function() {
    this.sprite = randomGemSprite();
    this.points = gemPoints();
    this.x = Math.floor(Math.random() * numCols)*tileWidth;
    this.y = randomRows();
}

var allGems = [];
for(var i = 0; i < 1; i++) {
    var gem = new Gem();
    allGems.push(gem);
}

function collectedGems() {
    allGems.forEach(function(gem) {
        if(player.y === gem.y && player.x < (gem.x + 60)) {
            if(player.x > (gem.x - 60)) {
                player.points += gem.points;
                gem.reset();
            }
        }
    });
}

function checkCollisions() {
    if(player.lives > 0){
        allEnemies.forEach(function(enemy) {
            if(player.y === enemy.y && player.x < (enemy.x + 60)){
                if(player.x > (enemy.x - 60)) {
                    player.reset();
                    player.lives--;
                }
            }
        });
    }else{
        gameOver();
        clearInterval(interval);
        }    
    collectedGems();
}

var Message  = function() {
    this.msgs = [];
    this.size = [36];
}

Message.prototype.render = function() {
    var self = this;
    Y = 0;
    this.x = ctx.canvas.width / 3;
    this.y = ctx.canvas.height / 2;
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.textAlign = 'left';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.8;
        this.msgs.forEach(function(msg) {
            ctx.font = self.size[self.msgs.indexOf(msg)] + 'px Impact, Charcoal, sans-serif';
            ctx.fillText(msg, self.x, self.y + Y);
            ctx.strokeText(msg, self.x, self.y + Y);
            Y = self.size[self.msgs.indexOf(msg)] + 5;
        });
        ctx.restore();
}

Message.prototype.reset = function() {
    this.size = 36;
}
messages = [];

gameOver = function() {
    var state;
    state = new Message();
    state.reset();
    state.size = [36, 56];
    state.msgs.push('Game OVER!', 'You got' + ' ' + player.points);
    messages.push(state);
    gameOn = false;
}

gameReset = function() {
    createTimer(60);
    player.points = 0;
    player.lives = 3;
    player.reset();
    allEnemies.forEach(function(enemy) {
        enemy.reset();
    });
    allGems.forEach(function(gem) {
        gem.reset();
    });
    messages = [];
    gameOn = true;
}
//initial game with click "continue" button
document.getElementById('continue').addEventListener('click',function(){
        if(!gameOn){
            gameReset();
        }
    });

//Create countdown timer for the game
var interval;
function makeWhite(x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fillStyle = "white";
    ctx.fill();
}
function createTimer(seconds) {
    interval = setInterval(function () {
        makeWhite(400, 20, 100, 80);
        if(seconds === 0) {
            clearInterval(interval);
            gameOver();
            ctx.font = "20px Arial";
            ctx.fillStyle = "red";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("Time's UP!", 450, 40);
            return;
        }
        ctx.font = "20px Arial";
        if(seconds <= 10) {
            ctx.fillStyle = "red";
        }else{
            ctx.fillStyle = "blue";
        }
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var minites = Math.floor(seconds / 60);
        var secondsShow = (seconds - minites * 60).toString();
        if(secondsShow.length === 1) {
            secondsShow = "0" + secondsShow;
        }
        ctx.fillText(minites.toString() + ":" + secondsShow, 470, 40);
        seconds--;
    }, 1000);
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
