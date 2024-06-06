/**
* ...
* @author Default
* @version 0.1
* Ported by @mmoczynski
*
* Original: https://github.com/neurofuzzy/sploder-platformer/blob/master/client/fuz2d/util/ColorTools.as
* 
*/

const ColorTools = {}

/**
 * Get red component of color integer
 * @param {Number} color - Unsigned Integer 
 * @returns 
 */

ColorTools.getRedComponent = function(color) {
    return color >> 16;
}

ColorTools.getGreenComponent = function(color) {
    return color >> 8 & 0xff;
}

ColorTools.getBlueComponent = function(color) {
    return color & 0xff;
}

ColorTools.getRedOffset = function(tintColor, amount) {
    var tintRed = ColorTools.getRedComponent(tintColor);
    return tintRed * amount;
}

ColorTools.getGreenOffset = function(tintColor, amount) {
    var tintGreen = ColorTools.getGreenComponent(tintColor);
    return tintGreen * amount;
}

ColorTools.getBlueOffset = function(tintColor, amount) {
    var tintBlue = ColorTools.getBlueComponent(tintColor);
    return tintBlue * amount;
}

ColorTools.getTintedColor = function (baseColor, tintColor, amount) {
		
    var red = ColorTools.getRedComponent(baseColor);
    var green = ColorTools.getGreenComponent(baseColor);
    var blue = ColorTools.getBlueComponent(baseColor);
    
    var tintRed = ColorTools.getRedComponent(tintColor);
    var tintGreen = ColorTools.getGreenComponent(tintColor);
    var tintBlue = ColorTools.getBlueComponent(tintColor);
    
    return (red + (tintRed - red) * amount) << 16 | (green + (tintGreen - green) * amount) << 8 | (blue + (tintBlue - blue) * amount);
    
}

ColorTools.getInverseColor = function (baseColor) {
        
    var red = ColorTools.getRedComponent(baseColor);
    var green = ColorTools.getGreenComponent(baseColor);
    var blue = ColorTools.getBlueComponent(baseColor);
    
    return (255 - red) << 16 | (255 - green) << 8 | (255 - blue);
    
}

ColorTools.getBrightness = function(color) {
            
    var redLevel = ColorTools.getRedComponent(color);
    var greenLevel = ColorTools.getGreenComponent(color);
    var blueLevel = ColorTools.getBlueComponent(color);
    
    return Math.floor((redLevel + greenLevel + blueLevel) / 3);
    
}

ColorTools.getSaturatedColor = function(color, amount) {
            
    amount = amount / 100;

    var redLevel = ColorTools.getRedComponent(color) / 255;
    var greenLevel = ColorTools.getGreenComponent(color) / 255;
    var blueLevel = ColorTools.getBlueComponent(color) / 255;

    var red = ColorTools.interpolate(0.5, redLevel, amount) * 255;
    var green = ColorTools.interpolate(0.5, greenLevel, amount) * 255;
    var blue = ColorTools.interpolate(0.5, blueLevel, amount) * 255;
    
    return (red) << 16 | (green) << 8 | (blue);
    
}

ColorTools.interpolate = function(luma, comp, t) {
    return Math.min(1, Math.max(0, luma + (comp - luma) * t));
}

ColorTools.numberToHTMLColor = function (col) {
    var c = col.toString(16);
    while (c.length < 6) c = "0" + c;
    return "#" + c;
}

ColorTools.HTMLColorToNumber = function(html) {
    return parseInt("0x" + html.split("#").join("").split("0x").join(""), 16);
}

module.exports = ColorTools;