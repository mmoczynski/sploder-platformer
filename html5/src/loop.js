import creator from "./creator.js";
import { WorldPoint, CanvasPoint } from "./point.js";
import {definitionTree} from "./definitionTree.js";
import Ghost from "./ghost.js";

let ctx = creator.canvas.getContext("2d");

export default function loop(){

    creator.gameInstance.level.levelNode.innerHTML = "";

    // Default value for Creator.selectedObjectPointedToExists.
    creator.selectedObjectPointedToExists = false;

    // Reset objects in grid array
    creator.mousePosition.objectsContainingMousePoint = [];

    ctx.clearRect(0, 0, creator.canvas.width, creator.canvas.height);

    // Draw sky color
    ctx.fillStyle = "#" + creator.gameInstance.level.skyColor;

    let centerWorldPointAsCanvasPoint = new WorldPoint(0, 0).toCanvasPoint();

    ctx.fillRect(
        0,
        0,
        creator.canvas.width,
        centerWorldPointAsCanvasPoint.y
    );

    // Draw underground
    ctx.fillStyle = "#000000";
    
    ctx.fillRect(
        0,
        centerWorldPointAsCanvasPoint.y, 
        creator.canvas.width, 
        creator.canvas.height - creator.deltaY
    );

    for(var i = 0; i < creator.gameInstance.level.objects.length; i++) {

        /**
         * @type {GameObject}
         */

        let o = creator.gameInstance.level.objects[i];

        let separator = "|"

        if(i === creator.gameInstance.level.objects.length - 1) {
            separator = "";
        }

        // Write object data to level XML

        creator.gameInstance.level.levelNode.innerHTML += (o.toString() + separator);

        let objCanvasPoint = new WorldPoint(o.x, o.y).toCanvasPoint();

        /**
         * Check if object is in the grid cell pointed to by mouse
         * By default, this is set to false.
         * 
         * However, if the creator.mousePosition.gridCell is a GridCell object,
         * then it checks if it is in the grid.
         */

        let isInGrid = false;

        //if(creator.mousePosition.gridCell instanceof GridCell) {
        //    isInGrid = creator.mousePosition.gridCell.pointInGrid(o.x, o.y)
        //}

        if(creator.mousePosition.world) {
            isInGrid = o.worldPointInObject(creator.mousePosition.world.x, creator.mousePosition.world.y);
        }

        // Check if object is in selection array
        let isSelected = creator.selectedObjects.includes(o);

        // If object is pointed to and also in selection, set variable

        if(isInGrid && isSelected) {
            creator.selectedObjectPointedToExists = true;
            console.log(creator.selectedObjectPointedToExists);
        }

        // If object is in grid, put it in array for list of objects in grid cell

        if(isInGrid) {
            creator.mousePosition.objectsContainingMousePoint.push(o);
        }

        let img1 = definitionTree[creator.gameInstance.level.objects[i].objectID]._svgSprite;

        if( (img1 && img1.complete && !img1._broken) || img1 instanceof HTMLCanvasElement ) {

            ctx.beginPath();

            ctx.drawImage(
                img1,
                objCanvasPoint.x - (img1.width * 0.5) * creator.zoomFactor,
                objCanvasPoint.y - (img1.height * 0.5) * creator.zoomFactor,
                img1.width * creator.zoomFactor,
                img1.height * creator.zoomFactor
            );

            ctx.stroke();

        }


        else {
            //console.warn("Image not defined");
        }

        // If object is selected

        if(isSelected) {
            
            ctx.lineWidth = 10 * creator.zoomFactor;
            ctx.strokeStyle = "blue";

            ctx.beginPath();

            ctx.rect(
                objCanvasPoint.x - (img1.width * 0.5) * creator.zoomFactor,
                objCanvasPoint.y - (img1.height * 0.5) * creator.zoomFactor,
                img1.width * creator.zoomFactor,
                img1.height * creator.zoomFactor
            );

            ctx.stroke();

        };

        // If ghost exists

        if(o.ghost instanceof Ghost && creator.selectedObjects.includes(o) && creator.transformingObjects) {

            creator.ctx.beginPath();

            creator.ctx.lineWidth = 2;

            creator.ctx.strokeStyle = "orange";
        
            creator.ctx.rect(
                o.ghost.centerPoint.toCanvasPoint().x - (o.ghost.width * creator.zoomFactor) * 0.5,
                o.ghost.centerPoint.toCanvasPoint().y - (o.ghost.height * creator.zoomFactor) * 0.5,
                o.ghost.width * creator.zoomFactor,
                o.ghost.height * creator.zoomFactor
            )
        
            creator.ctx.stroke();

            /*creator.ctx.beginPath();

            creator.ctx.arc(
                o.ghost.centerPoint.toCanvasPoint().x, 
                o.ghost.centerPoint.toCanvasPoint().y, 
                70, 
                0, 
                2 * Math.PI)

            creator.ctx.stroke();*/

        }
        
    }

    /**ctx.beginPath();

    let gridcellCanvasPoint = creator.mousePosition.gridCell.topLeft.toCanvasPoint();

    ctx.rect(
        gridcellCanvasPoint.x,
        gridcellCanvasPoint.y,
        creator.gridSize * creator.zoomFactor,
        creator.gridSize * creator.zoomFactor
    )

    ctx.stroke(); 

    ***/

    // Draw selection rectangle, if it exists

    if(creator.selectionRect.topLeft instanceof CanvasPoint && 
        creator.selectionRect.bottomRight instanceof CanvasPoint) {

        ctx.lineWidth = 1;

        ctx.strokeStyle = "rgb(0,255,255)";

        ctx.fillStyle = "rgb(0,255,255,0.5)"

        ctx.beginPath();

        ctx.rect(
            creator.selectionRect.topLeft.x,
            creator.selectionRect.topLeft.y,
            creator.selectionRect.bottomRight.x - creator.selectionRect.topLeft.x,
            creator.selectionRect.bottomRight.y - creator.selectionRect.topLeft.y
        );

        ctx.fill();

        ctx.stroke();
    }

}