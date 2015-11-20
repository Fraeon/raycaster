//view.js
//Contains the player's view
var USERAGENTS = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
var PI = Math.PI
var FULLCIRCLE = PI * 2;

function View(canvas, focal, resolution) {

    this.render = function(player, level) {
        this.drawsky(player.direction, level.skybox, level.light);
        this.drawcolumns(player, level);
    }

    this.drawsky = function(direction, sky, ambient) {
        var width = sky.width * (this.height / sky.height) * 2;
        var left = (direction / FULLCIRCLE) * -width;

        this.context.save();
        this.context.drawImage(sky.image, left, 0, width, this.height);
        if (left < width - this.width) {
            this.context.drawImage(sky.image, left + width, 0, width, this.height);
        }
        this.context.restore();
    }

    this.drawonecolumn = function(column, viewbeam, angle, level) {
        var hit = -1;
        var context = this.context;
        var texture = level.walltexture;
        var left = Math.floor(column * this.spacing);
        var width = Math.ceil(this.spacing);

        while (++hit < viewbeam.length && viewbeam[hit].height <= 0);

        for (var beamlength = viewbeam.length - 1; beamlength >= 0; beamlength--) {
            var step = viewbeam[beamlength];

            if (beamlength === hit) {
                var textureRemainder = Math.floor(texture.width * step.offset);
                var wall = this.project(step.height, angle, step.distance);
                context.globalalpha = 1;
                context.drawImage(texture.image, textureRemainder, 0, 1, texture.height, left, wall.top, width, wall.height);
            }
        }
    }

    this.drawcolumns = function(player, level) {
        this.context.save();
        for (var column = 0; column < this.resolution; column++) {
            var x = column / this.resolution - 0.5;
            var angle = Math.atan2(x, this.focal);
            var viewbeam = level.cast(player, player.direction + angle, this.range);
            this.drawonecolumn(column, viewbeam, angle, level);
        }
        this.context.restore();
    }

    this.project = function(height, angle, distance) {
        var z = distance * Math.cos(angle);
        var wallheight = this.height * 1.4 * height / z;
        var floor = this.height / 2 * (1 + 1 / z);
        return {
            top: floor - wallheight,
            height: wallheight
        };
    }

    this.context = canvas.getContext('2d');
    this.width = canvas.width = window.innerWidth * 0.5;
    this.height = canvas.height = window.innerHeight * 0.5;
    this.resolution = resolution;
    this.spacing = this.width / resolution;
    this.focal = 0.6;
    this.range = USERAGENTS ? 8 : 14;
    this.lightRange = 5;
    this.scale = (this.width + this.height) / 1200;
}
