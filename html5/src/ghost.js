/**
 * Library loosely based on client/com/sploder/builder/CreatorObjectGhost.as
 */

import creator from "./creator.js";
import { WorldPoint } from "./point.js";

function Ghost(object) {
    this.object = object;
    this.initalPoint = new WorldPoint(object.x, object.y)
    this.updatePoints();
}

Ghost.prototype.updatePoints = function(worldMousePoint) {

    //worldMousePoint = worldMousePoint || creator.mousePosition.world;

    worldMousePoint = this.object

    // Code copied from client/com/sploder/builder and modified
    // Original code by @neurofuzzy.

    var w = this.object.objectClass.svgSprite.width;
    var h = this.object.objectClass.svgSprite.height;

    var xoffset = (Math.floor(w / creator.gridSize) % 2 == 1) ? creator.gridSize / 2 : 0;
    var yoffset = (Math.floor(h / creator.gridSize) % 2 == 1) ? creator.gridSize / 2 : 0;
    
    var newx;

    if (xoffset == 0) newx = Math.round(worldMousePoint.x / creator.gridSize) * creator.gridSize + xoffset;
    else newx = Math.floor(worldMousePoint.x / creator.gridSize) * creator.gridSize + xoffset;
    
    var newy;

    if (yoffset == 0) newy = Math.round(worldMousePoint.y / creator.gridSize) * creator.gridSize + yoffset;
    else newy = Math.floor(worldMousePoint.y / creator.gridSize) * creator.gridSize + yoffset;

    // New position relative to mouse position

    var rx = newx - worldMousePoint.x;
    var ry = newy - worldMousePoint.y;

    this.rx = rx;
    this.ry = ry;

    // New code

    this.centerPoint = new WorldPoint(newx, newy);

    let centerPoint = this.centerPoint

    this.width = w;
    this.height = h;

    this.bottomLeft = new WorldPoint(
        centerPoint.x - w * 0.5,
        centerPoint.y - h * 0.5
    );

    this.topLeft = new WorldPoint(
        centerPoint.x - w * 0.5,
        centerPoint.y + h * 0.5
    );

    this.bottomRight = new WorldPoint(
        centerPoint.x + w * 0.5,
        centerPoint.y - h * 0.5
    );

    this.topRight = new WorldPoint(
        centerPoint.x + w * 0.5,
        centerPoint.y + h * 0.5
    );

    this.deltaX = newx - this.initalPoint.x;
    this.deltaY = newy - this.initalPoint.y;

}

export default Ghost;