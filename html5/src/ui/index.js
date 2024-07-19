import creator from "../creator.js";
import Ghost from "../ghost.js";
import { GridCell } from "../grid.js";
import { WorldPoint, CanvasPoint } from "../point.js";

document.addEventListener("mousemove", function(event){

    /***console.log(
        event.clientX - creator.canvasPositionX, 
        event.clientY - creator.canvasPositionY
    );**/

    creator.mousePosition.canvasOffset = new CanvasPoint(
        event.clientX - creator.canvasPositionX, 
        event.clientY - creator.canvasPositionY
    );

    creator.mousePosition.world = creator.mousePosition.canvasOffset.toWorldPoint();

    creator.mousePosition.gridCell = new GridCell(
        creator.mousePosition.world.x,
        creator.mousePosition.world.y
    );


})

creator.canvas.addEventListener("mousemove",function(event){

    if(creator.mouseTool === "transform-viewport" && !creator.mousePosition.objectsContainingMousePoint.length) {
         document.querySelector("#mouse-info").innerText = "Drag to move the playfield"
    }

    if(creator.mouseTool === "select-objects" && !creator.mousePosition.objectsContainingMousePoint.length) {
         document.querySelector("#mouse-info").innerText = "Drag to select objects"
    }

    if(creator.mousePosition.objectsContainingMousePoint.length && !creator.selectedObjects.length) {
         document.querySelector("#mouse-info").innerText = "Click to select object"
    }

});

/**
 * 
 * Mouse Tools
 */

function transformViewportByMouse(event) {
    creator.deltaX += event.movementX;
    creator.deltaY += event.movementY;
}

/**
 * A naive solution might be to transform objects by mouse delta.
 * However, in that method, if an object is shaked extremely fast, then it abnormally shifts.
 * This might be due to floating point numbers
 * Therefore, all objects transform in respect to one being moved to by the mouse.
 * 
 * @param {*} event 
 */

function transformObjByMouse(event) {

    let oldPos = new WorldPoint(
        creator.leadObject.object.x,
        creator.leadObject.object.y
    )

    creator.leadObject.object.x = creator.mousePosition.world.x - creator.leadObject.offset.x;
    creator.leadObject.object.y = creator.mousePosition.world.y - creator.leadObject.offset.y;

    let dx = creator.leadObject.object.x - oldPos.x;
    let dy = creator.leadObject.object.y - oldPos.y;

    creator.leadObject.object.ghost.updatePoints();

    // Loop through other objects

    for(let i = 0; i < creator.selectedObjects.length; i++) {

        if(creator.selectedObjects[i] !== creator.leadObject.object) {

            creator.selectedObjects[i].ghost.updatePoints();

            creator.selectedObjects[i].x += dx;
            creator.selectedObjects[i].y += dy;
        }

    }
}

function changeSelectionRectByMouse() {
    creator.selectionRect.bottomRight.x = creator.mousePosition.canvasOffset.x
    creator.selectionRect.bottomRight.y = creator.mousePosition.canvasOffset.y
}

creator.selectionRect.bottomRight = null;

creator.leadObject.object = null;

creator.canvas.addEventListener("mousedown", function(event){

    /**
     * Note: Avoid overusing nested if-then statements to avoid hard to follow logic.
     *
 */

    if(creator.selectedObjectPointedToExists) {

        creator.canvas.addEventListener("mousemove", transformObjByMouse);

        creator.leadObject.object = creator.mousePosition.objectsContainingMousePoint[
            creator.mousePosition.objectsContainingMousePoint.length - 1
        ];
        
        creator.leadObject.offset.x = creator.mousePosition.world.x - creator.leadObject.object.x
        creator.leadObject.offset.y = creator.mousePosition.world.y - creator.leadObject.object.y

    }

    /**
     * Add objects to selectedObjects array or set array to singleton
     * array given that there are objects in gridcell pointed to by mouse
     * 
     */

    if(!creator.selectedObjectPointedToExists && creator.mousePosition.objectsContainingMousePoint.length) {

        if(event.shiftKey) {
            creator.selectedObjects.push(
                creator.mousePosition.objectsContainingMousePoint[creator.mousePosition.objectsContainingMousePoint.length - 1]
            )
        }

        else {
            creator.selectedObjects = [
                creator.mousePosition.objectsContainingMousePoint[creator.mousePosition.objectsContainingMousePoint.length - 1]
            ];
        }

    }

    if(!creator.selectedObjectPointedToExists && !creator.mousePosition.objectsContainingMousePoint.length) {

        creator.selectedObjects = [];

        if(creator.mouseTool === "transform-viewport") {
            creator.canvas.addEventListener("mousemove", transformViewportByMouse);
        }

        else if(creator.mouseTool === "select-objects") {

            creator.selectionRect.topLeft = new CanvasPoint(
                creator.mousePosition.canvasOffset.x,
                creator.mousePosition.canvasOffset.y
            );

            creator.selectionRect.bottomRight = new CanvasPoint(
                creator.mousePosition.canvasOffset.x,
                creator.mousePosition.canvasOffset.y
            );

            creator.canvas.addEventListener("mousemove", changeSelectionRectByMouse);

        }   

    }
        

});

window.addEventListener("mouseup", function(){

    // Disable mousemove events

    creator.canvas.removeEventListener("mousemove", transformViewportByMouse)
    creator.canvas.removeEventListener("mousemove", transformObjByMouse)
    creator.canvas.removeEventListener("mousemove", changeSelectionRectByMouse);


    if(creator.selectionRect.topLeft && creator.selectionRect.bottomRight) {

        let selectionCanvasWidth = creator.selectionRect.bottomRight.x - creator.selectionRect.topLeft.x;
        let selectionCanvasHeight = creator.selectionRect.bottomRight.y - creator.selectionRect.topLeft.y;

        // Get bottom left corner of selection rectangle and convert it to point in world

        let bottomLeftWorldCorner = new CanvasPoint(
            creator.selectionRect.topLeft.x,
            creator.selectionRect.topLeft.y + selectionCanvasHeight
        ).toWorldPoint();

        // Get top left corner of selection rectangle and convert it to point in world

        let topRightWorldCorner = new CanvasPoint(
            creator.selectionRect.topLeft.x + selectionCanvasWidth,
            creator.selectionRect.topLeft.y
        ).toWorldPoint();

        // Select all objects found in selection

        for(let i = 0; i < creator.gameInstance.level.objects.length; i++) {

            let x = creator.gameInstance.level.objects[i].x;
            let y = creator.gameInstance.level.objects[i].y;

            let inXInterval = bottomLeftWorldCorner.x < x && x < topRightWorldCorner.x;
            let inYInterval = bottomLeftWorldCorner.y < y && y < topRightWorldCorner.y;

            if(inXInterval && inYInterval) {

                creator.selectedObjects.push(creator.gameInstance.level.objects[i]);

                //creator.gameInstance.level.objects[i].ghost = new Ghost(
                //    creator.gameInstance.level.objects[i]
                //);

            }


        }

    }

    // Clear selection rectangle objects

    creator.selectionRect.topLeft = null
    creator.selectionRect.bottomRight = null

    // Snap objects to grid

    for(let i = 0; i < creator.selectedObjects.length; i++) {
        creator.selectedObjects[i].x = creator.selectedObjects[i].ghost.centerPoint.x;
        creator.selectedObjects[i].y = creator.selectedObjects[i].ghost.centerPoint.y;
    }

});

document.querySelector("#activate-viewport-transform").addEventListener("click", function(){
    creator.mouseTool = "transform-viewport";
});

document.querySelector("#activate-object-transform").addEventListener("click", function(){
    creator.mouseTool = "select-objects";
});

/*** Right side buttons info ***/

document.querySelector("#delete-selection").addEventListener("mouseover", function(){
    document.querySelector("#mouse-info").innerText = "Click to delete the selected objects"
});

document.querySelector("#activate-viewport-transform").addEventListener("mouseover", function(){
    document.querySelector("#mouse-info").innerText = "Click to make it so dragging the mouse creates a rectangle that selects objects inside it."
});

document.querySelector("#activate-object-transform").addEventListener("mouseover", function(){
    document.querySelector("#mouse-info").innerText = "Click to make it so dragging the mouse drags the playfield."
});

document.querySelector("#zoom-in").addEventListener("mouseover", function(){
    document.querySelector("#mouse-info").innerText = "Click to zoom in playfield."
});

document.querySelector("#zoom-out").addEventListener("mouseover", function(){
    document.querySelector("#mouse-info").innerText = "Click to zoom out playfield."
});

document.querySelector("#reset-delta").addEventListener("mouseover", function(){
    document.querySelector("#mouse-info").innerText = "Click to see all of playfield."
});

document.querySelector("#settings").addEventListener("mouseover", function(){
    document.querySelector("#mouse-info").innerText = "Click to edit level background and colors."
});

document.querySelector("#zoom-in").addEventListener("click", function(){
    creator.zoomFactor += 0.1
});

document.querySelector("#zoom-out").addEventListener("click", function(){
    creator.zoomFactor -= 0.1
});

document.querySelector("#delete-selection").addEventListener("click", function(){

    for(let i = 0; i < creator.selectedObjects.length; i++) {
        creator.gameInstance.level.deleteObject(creator.selectedObjects[i]);
    }
    
});