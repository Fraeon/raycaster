
//"constants"
var CIRCLE = Math.PI * 2;
var MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)


//Controls object
function Controls() {
  this.codes  = { 37: 'left', 39: 'right', 38: 'forward', 40: 'backward' };
  this.states = { 'left': false, 'right': false, 'forward': false, 'backward': false };
  document.addEventListener('keydown', this.onKey.bind(this, true), false);
  document.addEventListener('keyup', this.onKey.bind(this, false), false);
  document.addEventListener('touchstart', this.onTouch.bind(this), false);
  document.addEventListener('touchmove', this.onTouch.bind(this), false);
  document.addEventListener('touchend', this.onTouchEnd.bind(this), false);
}
Controls.prototype.onTouch = function(e) {
  var t = e.touches[0];
  this.onTouchEnd(e);
  if (t.pageY < window.innerHeight * 0.5) this.onKey(true, { keyCode: 38 });
  else if (t.pageX < window.innerWidth * 0.5) this.onKey(true, { keyCode: 37 });
  else if (t.pageY > window.innerWidth * 0.5) this.onKey(true, { keyCode: 39 });
};
Controls.prototype.onTouchEnd = function(e) {
  this.states = { 'left': false, 'right': false, 'forward': false, 'backward': false };
  e.preventDefault();
  e.stopPropagation();
};
Controls.prototype.onKey = function(val, e) {
  var state = this.codes[e.keyCode];
  if (typeof state === 'undefined') return;
  this.states[state] = val;
  e.preventDefault && e.preventDefault();
  e.stopPropagation && e.stopPropagation();
};

//Bitmap object
function Bitmap(src, width, height) {
  this.image = new Image();
  this.image.src = src;
  this.width = width;
  this.height = height;
}

//Player object
function Player(x, y, direction) {
  this.x = x;
  this.y = y;
  this.direction = direction;
  this.weapon = new Bitmap('assets/doomknockoff2.png', 480, 252);
  this.paces = 0;
}
Player.prototype.rotate = function(angle) {
  this.direction = (this.direction + angle + CIRCLE) % (CIRCLE);
};
Player.prototype.walk = function(distance, map) {
  var dx = Math.cos(this.direction) * distance;
  var dy = Math.sin(this.direction) * distance;
  if (map.get(this.x + dx, this.y) <= 0) this.x += dx;
  if (map.get(this.x, this.y + dy) <= 0) this.y += dy;
  this.paces += distance;
};
Player.prototype.update = function(controls, map, seconds) {
  if (controls.left) this.rotate(-Math.PI * seconds);
  if (controls.right) this.rotate(Math.PI * seconds);
  if (controls.forward) this.walk(3 * seconds, map);
  if (controls.backward) this.walk(-3 * seconds, map);
};

//Gameloop object
function GameLoop() {
  this.frame = this.frame.bind(this);
  this.lastTime = 0;
  this.callback = function() {};
}
GameLoop.prototype.start = function(callback) {
  this.callback = callback;
  requestAnimationFrame(this.frame);
};
GameLoop.prototype.frame = function(time) {
  var seconds = (time - this.lastTime) / 1000;
  this.lastTime = time;
  if (seconds < 0.2) this.callback(seconds);
  requestAnimationFrame(this.frame);
};
var display = document.getElementById('display');
var player = new Player(15.3, -1.2, Math.PI * 0.3);
var map = new Map(32);
var controls = new Controls();
var camera = new Camera(display, MOBILE ? 360 : 640, 0.8);
var loop = new GameLoop();
map.randomize();

loop.start(function frame(seconds) {
  map.update(seconds);
  player.update(controls.states, map, seconds);
  camera.render(player, map);
});
