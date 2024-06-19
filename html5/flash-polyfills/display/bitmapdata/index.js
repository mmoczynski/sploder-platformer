/**
 * Polyfill for ActionScript BitmapData library in Flash
 * https://open-flash.github.io/mirrors/as2-language-reference/flash/display/BitmapData.html
 */

const Rectangle = require("../../geom/rectangle");

function BitmapData(width, height, transparent = true, fillColor = 0xFFFFFFFF) {
    this.width = width;
    this.height = height;
    this.rectangle = new Rectangle(0, 0, width, height);
}

BitmapData.loadBitmap = function() {}

BitmapData.prototype.applyFilter = function() {}

BitmapData.prototype.clone = function() {}

BitmapData.prototype.colorTransform = function() {}

BitmapData.prototype.compare = function() {}

BitmapData.prototype.copyChannel = function() {}

BitmapData.prototype.copyPixels = function() {}

BitmapData.prototype.dispose = function() {}

BitmapData.prototype.draw = function() {}

BitmapData.prototype.fillRect = function() {}

BitmapData.prototype.foodFill = function() {}

BitmapData.prototype.generateFilterRect = function() {}

BitmapData.prototype.getColorBoundsRect = function() {}

BitmapData.prototype.getPixel = function() {}

BitmapData.prototype.getPixel32 = function() {}

BitmapData.prototype.hitTest = function() {}

BitmapData.prototype.merge = function() {}

BitmapData.prototype.noise = function() {}

BitmapData.prototype.paletteMap = function() {}

BitmapData.prototype.perlinNoise = function() {}

BitmapData.prototype.pixelDissolve = function() {}

BitmapData.prototype.scroll = function() {}

BitmapData.prototype.setPixel = function() {}

BitmapData.prototype.setPixel32 = function() {}

BitmapData.prototype.threshold = function() {}

module.exports = BitmapData;