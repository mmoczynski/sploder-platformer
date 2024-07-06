/**
 * JavaScript implementation of flash color transformations
 * 
 * Based off information in here:
 * 
 * https://lassieadventurestudio.wordpress.com/2012/03/12/color-transform-for-html5-canvas/
 * https://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/geom/ColorTransform.html
 * https://open-flash.github.io/mirrors/swf-spec-19.pdf
 * 
 */


export function CanvasColorTransformFixedPoint() {

    this.redMultTerm = 256;
    this.greenMultTerm = 256;
    this.blueMultTerm = 256;
    this.alphaMultTerm = 256;

    this.redAddTerm = 0;
    this.greenAddTerm = 0;
    this.blueAddTerm = 0;
    this.alphaAddTerm = 0;

}

/**
 * 
 * @param {Number} r - A number between 0 and 255 representing red 
 * @param {Number} g - A number between 0 and 255 representing green 
 * @param {Number} b - A number between 0 and 255 representing blue 
 * @param {Number} a - A number between 0 and 255 representing alpha (transparency) 
 */

CanvasColorTransformFixedPoint.prototype.calculate = function(r,g,b,a) {

    let multipliedRed = (r * this.redMultTerm) / 256;
    let multipliedGreen = (g * this.greenMultTerm) / 256;
    let multipliedBlue = (b * this.blueMultTerm) / 256; 
    let multipliedAlpha = (a * this.alphaMultTerm) / 256; 

    let addedRed = multipliedRed + this.redAddTerm;
    let addedGreen = multipliedGreen + this.greenAddTerm;
    let addedBlue = multipliedBlue + this.blueAddTerm;
    let addedAlpha = multipliedAlpha + this.alphaAddTerm;

    // Make sure red is between 0-255.

    if(addedRed < 0) {
        addedRed = 0;
    }

    if(addedRed > 255) {
        addedRed = 255;
    }

    // Make sure green is between 0-255.

    if(addedGreen < 0) {
        addedGreen = 0;
    }

    if(addedGreen > 255) {
        addedGreen = 255;
    }

    // Make sure blue is between 0-255.

    if(addedBlue < 0) {
        addedBlue = 0;
    }

    if(addedBlue > 255) {
        addedBlue = 255;
    }

    // Make sure alpha is betwen 0-255.

    if(addedAlpha < 0) {
        addedAlpha = 0;
    }

    if(addedAlpha > 255) {
        addedAlpha = 255;
    }

    return {
        r: addedRed,
        g: addedGreen,
        b: addedBlue,
        a: addedAlpha
    }

}

CanvasColorTransformFixedPoint.prototype.applyToUntransformedCanvas = function(ctx) {

    for(let x = 0; x < ctx.canvas.width; x++) {

        for(let y = 0; y < ctx.canvas.height; y++) {

            var imgData = ctx.getImageData(x,y,1,1);

            var o = this.calculate(
                imgData.data[0], 
                imgData.data[1], 
                imgData.data[2], 
                imgData.data[3]
            );

            ctx.fillStyle = `rgb(${o.r}, ${o.g}, ${o.b})`;

            ctx.globalAlpha = o.a / 255;

            ctx.clearRect(x,y,1,1);
            ctx.fillRect(x,y,1,1);

        }

    }

} 