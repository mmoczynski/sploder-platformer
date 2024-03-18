var m = require("../definitions/definitions.json");

function Object(id, x, y, rotation, tileID, ) {

}

function Graphic(graphic, graphicVersion, graphicAnimation) {

}

/**
 * Creates data string from
 */

Object.prototype.toString = function() {
    let str = this.id + "," + this.x + "," + this.y
}

/**
 * 
 * @param {string} str - String for defining object. 
 * Format:
 * 
 * id,x,y,rotation,tile_id,
 * 
 */