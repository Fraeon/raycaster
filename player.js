//player.js
//contains player movement
var PI = Math.PI
var FULLCIRCLE = PI * 2;

//Control object
//
//Contains the properties required for control
var Control = function () {

    //Poll for key press
    this.keypress = function(v, e) {
        var state = this.codes[e.keyCode];
        if (typeof state === 'undefined') {
            return;
        }
        this.states[state] = v;
        e.preventDefault && e.preventDefault();
        e.stopPropagation && e.stopPropagation();
    }

    //Poll for touch input
    this.touch = function(e) {
        var t = e.touches[0];
        this.touchend(e);
        if (t.pageY < window.innerHeight * 0.5) {
            this.keypress(true, {
                keyCode: 38
            });
        } else if (t.pageX < window.innerWidth * 0.5) {
            this.keypress(true, {
                keyCode: 37
            });
        } else if (t.pageY > window.innerWidth * 0.5) {
            this.keypress(true, {
                keyCode: 39
            });
        }
    }

    //Touch input ends
    this.touchend = function(e) {
        this.states = {
            'left': false
            , 'right': false
            , 'forward': false
            , 'back': false
        };
        e.preventDefault();
        e.stopPropagation();
    }

    this.codes = {
        37: 'left'
        , 39: 'right'
        , 38: 'forward'
        , 40: 'back'
    };
    this.states = {
        'left': false
        , 'right': false
        , 'forward': false
        , 'back': false
    };
    document.addEventListener('keydown', this.keypress.bind(this, true), false);
    document.addEventListener('keyup', this.keypress.bind(this, false), false);
    document.addEventListener('touchstart', this.touch.bind(this), false);
    document.addEventListener('touchmove', this.touch.bind(this), false);
    document.addEventListener('touchend', this.touchend.bind(this), false);

}

//Player object
//
//Contains the properties that have to do with the player character (e.g. movement)
var Player = function(x, y) {

    //Walking method for the player
    this.walk = function(distance, level) {
        var context = Math.cos(this.direction) * distance;
        var distancey = Math.sin(this.direction) * distance;
        //If there's no wall here, move forward till something else happens
        if (level.get(this.x + context, this.y) <= 0) {
            this.x = this.x + context;
        }
        if (level.get(this.x, this.y + distancey) <= 0) {
            this.y = this.y + distancey;
        }
        this.momentum = this.momentum + distance;
    }

    //Rotation method for the player
    this.rotate = function(angle) {
        this.direction = (this.direction + angle + FULLCIRCLE) % FULLCIRCLE;
    }

    //Update the player's position
    this.update = function(control, level, elapsedtime) {
        if (control.forward) {
            this.walk(1.5 * elapsedtime, level);
        }
        if (control.back) {
            this.walk(-1.5 * elapsedtime, level);
        }
        if (control.left) {
            this.rotate(-1 * PI * elapsedtime);
        }
        if (control.right) {
            this.rotate(PI * elapsedtime);
        }
    }

    //Other properties
    this.x = x;
    this.y = y;
    this.momentum = 0;
    this.direction = 0.2*PI;
    this.health = 100;
    //this.weapon = ""; None yet
}
