/**
 * Point class. Based off this flash library:
 * https://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/geom/Point.html
 * 
 * 
 */

import Creator from "./creator";

/*
 * @param {Number} x 
 * @param {Number} y 
 */

export function Point(x, y) {
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

/**
 * Object for representing a point as relative to the world.
 * @extends {Point}
 * @param {*} x 
 * @param {*} y 
 */

export function WorldPoint(x,y) {
    Point.apply(this, arguments);
}

Object.assign(WorldPoint.prototype, Point.prototype);


/**
 * 
 * @returns Vector measuring point relative to canvas instead of world
 * 
 * Formula:
 * 
 * x_c = x_w * k + d_x + w/2
 * y_c = -y_w * k + d_y + h/2
 * 
 */

WorldPoint.prototype.toCanvasPoint = function() {

    return new CanvasPoint(
        (this.x * Creator.zoomFactor + Creator.deltaX + Creator.canvas.width/2), 
        (-this.y * Creator.zoomFactor + Creator.deltaY + Creator.canvas.height/2)
    );

}

/**  
 * Point that is relative to canvas
 * @extends {Point}
 * @param {*} x 
 * @param {*} y 
 */

export function CanvasPoint(x,y) {
    Point.apply(this, arguments)
}

Object.assign(CanvasPoint.prototype, Point.prototype);


/*
* Change canvas point to world point 
* Formula (based on solving in algebra for world point in canvas point)
*
* x_w = (x_c - d_x - w/2)/k
* y_w = -(y_c - h/2 - d_y)/k
*
*
*/

CanvasPoint.prototype.toWorldPoint = function() {

    return new WorldPoint(
        (this.x - Creator.deltaX - Creator.canvas.width / 2) / Creator.zoomFactor,
        -(this.y - Creator.deltaY - Creator.canvas.height / 2) / Creator.zoomFactor
    )

}