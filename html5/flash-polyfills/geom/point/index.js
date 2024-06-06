/**
 * JavaScript implementation of flash.geom.Point:
 * https://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/geom/Point.html
 * 
 * 

/
 * @param {Number} x 
 * @param {Number} y 
 */

function Point(x, y) {
    this.x = x;
    this.y = y;

    var self = this;

    Object.defineProperties(this,{

        length: {
            
            get: function() {
                return Math.sqrt(
                    Math.pow(self.x, 2) + Math.pow(self.y, 2)
                );
            }

        }

    })
}

/**
 * 
 * @param {Point} point1 
 * @param {Point} point2 
 */

Point.distance = function(point1, point2) {

}

Point.interPolate = function(point1, point2, f) {

}

/*** Generate point given polar coordinates for angle and length ***/

Point.polar = function() {

}

Point.prototype.add = function(point) {

}

Point.prototype.clone = function() {

}

Point.prototype.copyFrom = function() {

}

Point.prototype.equals = function() {

}

Point.prototype.normalize = function() {

}

Point.prototype.offset = function() {

}

Point.prototype.setTo = function() {

}

Point.prototype.toString = function() {

}

module.exports = Point;