//engine.js
//contains the actual game loop and other miscellaneous
var PI = Math.PI
var FULLCIRCLE = PI * 2;

//Gameloop object
//
//Contains mostly the timing logic needed for the game to run
function Game() {

    //Basic gameloop methods
    this.start = function(callback) {
        this.callback = callback;
        requestAnimationFrame(this.frame);
    }

    this.frame = function(time) {
        var elapsedtime = (time - this.lastTime) / 1000;
        this.lastTime = time;
        if (elapsedtime < 0.2) {
            this.callback(elapsedtime);
        }
        requestAnimationFrame(this.frame);
    }
    this.frame = this.frame.bind(this);
    this.lastTime = 0;
    this.callback = function() {};

}

var display = document.getElementById('display');
var player = new Player(4, 10, PI * 0.2);
var level = new Level(50);
var control = new Control();
var view = new View(display, 0.8, 640);
var game = new Game();
level.randomize();

game.start(function frame(elapsedtime) {
    level.update(elapsedtime);
    player.update(control.states, level, elapsedtime);
    view.render(player, level);
});
