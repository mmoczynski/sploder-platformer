/**
* Fuz2d: 2d Gaming Engine
* ----------------------------------------------------------------
* ----------------------------------------------------------------
* Copyright (C) 2008 Geoffrey P. Gaudreault
* ------------------
* Ported by @mmoczynski
* 
*/

/**
 * Voronoi constructor
 */

function Voronoi() {

    let self = this;

    // Define getters and setters

    Object.defineProperties(this, {

        seed: {
            get: function(){  return self.randomSeed; }
        },

        thickness: {
            get: function () { return self._thickness; },
            set: function(value) { self._thickness = value;	}
        },

        alpha: {
            get: function() { return self._alpha; },
            set: function(value) { self._alpha = value; }
        },

        points: {
            get: function() { return self._points; }
        },

        topPoints: {

            get: function () {
    
                var pts = [];
            
                var ymax = (self.cellsY >= 4) ? 1 : 0;
                
                for (var y = 0; y <= ymax; y++) {
                    for (var x = 0; x <= self.cellsX + 1; x++) {
                        pts.push(self._points[y * (self.cellsX + 2) + x]);
                    }
                }
                
                return pts;
                
            }

        },

        leftPoints: {

            get: function() {

                var pts = [];
            
                var xmax = (self.cellsX >= 4) ? 1 : 0;
            
                for (var y = 0; y <= self.cellsY + 1; y++) {
                    for (var x = 0; x <= xmax; x++) {
                        pts.push(self._points[y * (self.cellsX + 2) + x]);
                    }
                }
                
                return pts;

            }

        },

        bottomPoints: {
            get: function() {

                var pts = [];
    
                var ymin = (self.cellsY >= 4) ? self.cellsY : self.cellsY + 1;
            
                for (var y = ymin; y <= self.cellsY + 1; y++) {
                    for (var x = 0; x <= self.cellsX + 1; x++) {
                        pts.push(self._points[y * (self.cellsX + 2) + x]);
                    }
                }
                
                return pts;

            }
        },

        rightPoints: { 

            get: function () {
            
                var pts = [];
        
                var xmin = (self.cellsX >= 4) ? self.cellsX : self.cellsX + 1;
                
                for (var y = 0; y <= self.cellsY + 1; y++) {
                    for (var x = xmin; x <= self.cellsX + 1; x++) {
                        pts.push(self._points[y * (self.cellsX + 2) + x]);
                    }
                }
                
                return pts;
            
            },
        
        },
        
        topLeftPoints: {
            
            get: function () {
            
                var pts = [];
                
                var ymax = (self.cellsY >= 4) ? 1 : 0;
                var xmax = (self.cellsX >= 4) ? 1 : 0;
        
                for (var y = 0; y <= ymax; y++) {
                    for (var x = 0; x <= xmax; x++) {
                        pts.push(self._points[y * (self.cellsX + 2) + x]);
                    }
                }
                
                return pts;
            
            }
        },
        
        topRightPoints: {
        
            get: function  () {
            
                var pts = [];
                
                var ymax = (self.cellsY >= 4) ? 1 : 0;
                var xmin = (self.cellsX >= 4) ? self.cellsX : self.cellsX + 1;
        
                for (var y = 0; y <= ymax; y++) {
                    for (var x = xmin; x <= self.cellsX + 1; x++) {
                        pts.push(self._points[y * (self.cellsX + 2) + x]);
                    }
                }
                
                return pts;
            
            }
        },
        
        bottomLeftPoints: {
        
            get: function () {
                
                var pts = [];
                
                var ymin = (self.cellsY >= 4) ? self.cellsY : self.cellsY + 1;
                var xmax = (self.cellsX >= 4) ? 1 : 0;
        
                for (var y = ymin; y <= self.cellsY + 1; y++) {
                    for (var x = 0; x <= xmax; x++) {
                        pts.push(self._points[y * (self.cellsX + 2) + x]);
                    }
                }
                
                return pts;
                
            }
        },
        
        bottomRightPoints: { 
            
            get: function() {
            
                var pts = [];
                
                var ymin = (self.cellsY >= 4) ? self.cellsY : self.cellsY + 1;
                var xmin = (self.cellsX >= 4) ? self.cellsX : self.cellsX + 1;
        
                for (var y = ymin; y <= self.cellsY + 1; y++) {
                    for (var x = xmin; x <= self.cellsX + 1; x++) {
                        pts.push(self._points[y * (self.cellsX + 2) + x]);
                    }
                }
            
            return pts;
        
            }
        },

        centerPoints: { 
    
            get: function () {
            
                var pts = [];
                
                var ymin = (self.cellsY >= 4) ? 2 : 1;
                var xmin = (self.cellsX >= 4) ? 2 : 1;
                var ymax = (self.cellsY >= 4) ? self.cellsY - 1 : self.cellsY - 2;
                var xmax = (self.cellsX >= 4) ? self.cellsX - 1 : self.cellsX - 2;
        
                for (var y = ymin; y <= ymax; y++) {
                    for (var x = xmin; x <= xmax; x++) {
                        pts.push(self._points[y * (self.cellsX + 2) + x]);
                    }
                }
                
                return pts;
            
            }
        },
        
        clip: { 
            get: function () { return self._clip; } 
        }
        
        

    });
}

// JavaScript replacement for clip

Voronoi.prototype._clip = undefined;

// JavaScript replacement for Graphics
// See: https://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/display/Sprite.html 

Voronoi.prototype.g = undefined;

Voronoi.prototype.mapWidth = 100;
Voronoi.prototype.mapHeight = 100;
Voronoi.prototype.bgColor = 0x000000;
Voronoi.prototype.fgColor = 0xcccccc;
Voronoi.prototype._thickness = 1;
Voronoi.prototype._alpha = 1;
Voronoi.prototype.cellsX = 4;
Voronoi.prototype.cellsY = 4;
Voronoi.prototype.totalCells = 24;
Voronoi.prototype.perturb = 0.3;
Voronoi.prototype.bond = false;

/**
 * @type {Array}
 */

Voronoi.prototype._points = undefined;

Voronoi.prototype.PI;
Voronoi.prototype.PI2;

/**
 * @type {Array}
 */

Voronoi.prototype.distance  = undefined;

/**
 * @type {Array}
 */

Voronoi.prototype.sx = undefined;

/**
 * @type {Array}
 */

Voronoi.prototype.sy = undefined;

/**
 * @type {Array}
 */

Voronoi.prototype.ex = undefined;

/**
 * @type {Array}
 */

Voronoi.prototype.ey = undefined;

/**
 * @type {Number}
 */
Voronoi.prototype.cache = undefined;

/**
 * @type {Number}
 */

Voronoi.prototype.ox = undefined;

/**
 * @type {Number}
 */

Voronoi.prototype.oy = undefined;

/**
 * Bitmap data object
 */

Voronoi.prototype.noiseMap = undefined;
Voronoi.prototype.randomSeed = 1;

Voronoi.background = true;

export default Voronoi;