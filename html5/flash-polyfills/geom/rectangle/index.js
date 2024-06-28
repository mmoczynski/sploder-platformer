/**
 * 
 * JS Implementation of: 
 * https://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/geom/Rectangle.html
 * 
 * @author @mmoczynski
 * 
 * @param {*} x 
 * @param {*} y 
 * @param {*} width 
 * @param {*} height 
 */

const Point = require("../point/index.js");

function Rectangle(x = 0, y = 0, width = 0, height = 0) {

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    var self = this;

    Object.defineProperties(this, {

        bottom: {
            get: function() {
                return self.this.y + this.height;
            }
        },

        bottomRight: {

            get: function() {
                return new Point(
                    self.x + self.height,
                    self.y + self.height
                )
            }

        },

        left: {

            get: function() {
                return self.x;
            }

        },

        right: {
            get: function() {
                return self.x + self.width;
            }
        },

        size: {
            get: function() {
                return new Point(self.width, self.height)
            }
        },

        top: {
            get: function() {
                return self.y;
            }
        },

        topLeft: {
            get: function() {
                return new Point(self.x, self.y);
            }
        }

    })

    Object.defineProperties()
}

Rectangle.prototype.clone = function() {

}

Rectangle.prototype.contains = function(x, y) {
    
}

Rectangle.prototype.containsPoint = function(point) {
    
}

Rectangle.prototype.containsRect = function(rect) {

}

Rectangle.prototype.copyFrom = function() {

}

Rectangle.prototype.equals = function() {
    
}

Rectangle.prototype.inflate = function() {
    
}

Rectangle.prototype.inflatePoint = function() {
    
}

Rectangle.prototype.intersection = function(rectangle) {

}

Rectangle.prototype.intersects = function() {
    
}

Rectangle.prototype.isEmpty = function() {
    
}

Rectangle.prototype.offset = function() {
    
}

Rectangle.prototype.offsetPoint = function() {
    
}

Rectangle.prototype.setEmpty = function() {
    
}

Rectangle.prototype.setTo = function() {
    
}

Rectangle.prototype.toString = function() {
    
}

Rectangle.prototype.union = function() {
    
}

module.exports = Rectangle;