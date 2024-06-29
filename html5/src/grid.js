import Creator from "./creator";
import { WorldPoint } from "./point";

export function GridCell(x,y) {

    this.numberOfGridsX = Math.floor(x/Creator.gridSize);

    this.numberofGridsY = Math.floor(y/Creator.gridSize);


    this.bottomLeft = new WorldPoint(
        this.numberOfGridsX * Creator.gridSize,
        this.numberofGridsY * Creator.gridSize,
    )

    this.bottomRight = new WorldPoint(
        this.bottomLeft.x + Creator.gridSize,
        this.bottomLeft.y
    )

    this.topLeft = new WorldPoint(
        this.bottomLeft.x,
        this.bottomLeft.y + Creator.gridSize
    )

    this.topRight = new WorldPoint(
        this.bottomLeft.x + Creator.gridSize,
        this.bottomLeft.y + Creator.gridSize
    )

    this.center = new WorldPoint(
        this.bottomLeft.x + Creator.gridSize / 2,
        this.bottomLeft.y + Creator.gridSize / 2
    )

}

GridCell.prototype.pointInGrid = function(x, y) {

    if( (this.bottomLeft.x < x && x < this.bottomLeft.x + Creator.gridSize) && 
        (this.bottomLeft.y < y && y < this.bottomLeft.y + Creator.gridSize)
    ) {
        return true;
    }

    else {
        return false;
    }

}