import creator from "./creator.js";
import { WorldPoint } from "./point.js";

export function GridCell(x,y) {

    this.numberOfGridsX = Math.floor(x/creator.gridSize);

    this.numberofGridsY = Math.floor(y/creator.gridSize);


    this.bottomLeft = new WorldPoint(
        this.numberOfGridsX * creator.gridSize,
        this.numberofGridsY * creator.gridSize,
    )

    this.bottomRight = new WorldPoint(
        this.bottomLeft.x + creator.gridSize,
        this.bottomLeft.y
    )

    this.topLeft = new WorldPoint(
        this.bottomLeft.x,
        this.bottomLeft.y + creator.gridSize
    )

    this.topRight = new WorldPoint(
        this.bottomLeft.x + creator.gridSize,
        this.bottomLeft.y + creator.gridSize
    )

    this.center = new WorldPoint(
        this.bottomLeft.x + creator.gridSize / 2,
        this.bottomLeft.y + creator.gridSize / 2
    )

}

GridCell.prototype.pointInGrid = function(x, y) {

    if( (this.bottomLeft.x < x && x < this.bottomLeft.x + creator.gridSize) && 
        (this.bottomLeft.y < y && y < this.bottomLeft.y + creator.gridSize)
    ) {
        return true;
    }

    else {
        return false;
    }

}