//world.js
//Contains the generation of the level
//Possible map in the making
/* var MAPARRAY =
	[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,1,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,1,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];
*/
var PI = Math.PI
var DIAMETER = PI * 2;

//Imageloader object
function Imageloader(source, width, height) {
    this.image = new Image();
    this.width = width;
    this.height = height;
    this.image.src = source;  
}

//Level object
function Level(size) {

    this.get = function(x, y) {
        x = Math.floor(x);
        y = Math.floor(y);
        if (x < 0 || x > this.size - 1 || y < 0 || y > this.size - 1) {
            return -1;
        }
        return this.wallgridarray[y * this.size + x];
    }

    this.randomize = function() {
        var i = 0;
        while (i < this.size * this.size) {
            this.wallgridarray[i] = Math.random() < 0.45 ? 1 : 0;
            i++;
        }
    }

    this.cast = function(point, angle, range) {
        var self = this;
        var sin = Math.sin(angle);
        var cos = Math.cos(angle);
        var nowall = {
            length2: Infinity
        };
        return viewbeam({
            x: point.x
            , y: point.y
            , height: 0
            , distance: 0
        });

        function viewbeam(origin) {
            var stepx = step(sin, cos, origin.x, origin.y);
            var stepy = step(cos, sin, origin.y, origin.x, true);
            var nextstep = stepx.length2 < stepy.length2 ? inspect(stepx, 1, 0, origin.distance, stepx.y) : inspect(stepy, 0, 1, origin.distance, stepy.x);
            if (nextstep.distance > range) return [origin];
            return [origin].concat(viewbeam(nextstep));
        }

        function step(rise, run, x, y, inverted) {
            if (run === 0) {
                return nowall;
            }
            var distancex = run > 0 ? Math.floor(x + 1) - x : Math.ceil(x - 1) - x;
            var distancey = distancex * (rise / run);
            return {
                x: inverted ? y + distancey : x + distancex
                , y: inverted ? x + distancex : y + distancey
                , length2: distancex * distancex + distancey * distancey
            };
        }

        function inspect(step, shiftx, shifty, distance, offset) {
            var distancex = cos < 0 ? shiftx : 0;
            var distancey = sin < 0 ? shifty : 0;
            step.height = self.get(step.x - distancex, step.y - distancey);
            step.distance = distance + Math.sqrt(step.length2);
            if (shiftx) {
                step.shading = cos < 0 ? 2 : 0;
            } else {
                step.shading = sin < 0 ? 2 : 1;
            }
            step.offset = offset - Math.floor(offset);
            return step;
        }
    }

    this.update = function(elapsedtime) {
        if (this.light > 0) {
            this.light = Math.max(this.light - 10 * elapsedtime, 0);
        }
    }

    this.size = size;
    this.wallgridarray = new Array(size * size);
    this.skybox = new Imageloader('img/skybox.jpg', 1024, 512);
    this.walltexture = new Imageloader('img/quakewall.png', 512, 512);
    this.light = 0;
}
