import Creator from "./creator";
import { GridCell } from "./grid";
import { WorldPoint, CanvasPoint } from "./point";

Creator.canvas.addEventListener("mousemove",function(event){

    Creator.mousePosition.canvasOffset = new CanvasPoint(
        event.offsetX, 
        event.offsetY
    );

    if(Creator.mouseTool === "transform-viewport" && !Creator.mousePosition.objectsInGrid.length) {
         document.querySelector("#mouse-info").innerText = "Drag to move the playfield"
    }

    if(Creator.mouseTool === "select-objects" && !Creator.mousePosition.objectsInGrid.length) {
         document.querySelector("#mouse-info").innerText = "Drag to select objects"
    }

    if(Creator.mousePosition.objectsInGrid.length && !Creator.selectedObjects.length) {
         document.querySelector("#mouse-info").innerText = "Click to select object"
    }

});

/**
 * 
 * Mouse Tools
 */

function transformViewportByMouse(event) {
    Creator.deltaX += event.movementX;
    Creator.deltaY += event.movementY;
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
        Creator.leadObject.object.x,
        Creator.leadObject.object.y
    )

    Creator.leadObject.object.x = Creator.mousePosition.world.x - Creator.leadObject.offset.x;
    Creator.leadObject.object.y = Creator.mousePosition.world.y - Creator.leadObject.offset.y;

    let dx = Creator.leadObject.object.x - oldPos.x;
    let dy = Creator.leadObject.object.y - oldPos.y;

    for(let i = 0; i < Creator.selectedObjects.length; i++) {

        if(Creator.selectedObjects[i] !== Creator.leadObject.object) {
            Creator.selectedObjects[i].x += dx;
            Creator.selectedObjects[i].y += dy;
        }

    }
}

function changeSelectionRectByMouse() {
    Creator.selectionRect.bottomRight.x = Creator.mousePosition.canvasOffset.x
    Creator.selectionRect.bottomRight.y = Creator.mousePosition.canvasOffset.y
}

Creator.selectionRect.bottomRight = null;

Creator.leadObject.object = null;

Creator.canvas.addEventListener("mousedown", function(event){

    /**
     * Note: Avoid overusing nested if-then statements to avoid hard to follow logic.
     *
 */

    if(Creator.selectedObjectPointedToExists) {

        Creator.canvas.addEventListener("mousemove", transformObjByMouse);

        Creator.leadObject.object = Creator.mousePosition.objectsInGrid[
            Creator.mousePosition.objectsInGrid.length - 1
        ];
        
        Creator.leadObject.offset.x = Creator.mousePosition.world.x - Creator.leadObject.object.x
        Creator.leadObject.offset.y = Creator.mousePosition.world.y - Creator.leadObject.object.y

    }

    /**
     * Add objects to selectedObjects array or set array to singleton
     * array given that there are objects in gridcell pointed to by mouse
     * 
     */

    if(!Creator.selectedObjectPointedToExists && Creator.mousePosition.objectsInGrid.length) {

        if(event.shiftKey) {
            Creator.selectedObjects.push(
                Creator.mousePosition.objectsInGrid[Creator.mousePosition.objectsInGrid.length - 1]
            )
        }

        else {
            Creator.selectedObjects = [
                Creator.mousePosition.objectsInGrid[Creator.mousePosition.objectsInGrid.length - 1]
            ];
            //console.log("Selected Object Reset")
        }

    }

    if(!Creator.selectedObjectPointedToExists && !Creator.mousePosition.objectsInGrid.length) {

        Creator.selectedObjects = [];

        if(Creator.mouseTool === "transform-viewport") {
            Creator.canvas.addEventListener("mousemove", transformViewportByMouse);
        }

        else if(Creator.mouseTool === "select-objects") {

            Creator.selectionRect.topLeft = new CanvasPoint(
                Creator.mousePosition.canvasOffset.x,
                Creator.mousePosition.canvasOffset.y
            );

            Creator.selectionRect.bottomRight = new CanvasPoint(
                Creator.mousePosition.canvasOffset.x,
                Creator.mousePosition.canvasOffset.y
            );

            Creator.canvas.addEventListener("mousemove", changeSelectionRectByMouse);

        }   

    }
        

});

window.addEventListener("mouseup", function(){

    // Disable mousemove events

    Creator.canvas.removeEventListener("mousemove", transformViewportByMouse)
    Creator.canvas.removeEventListener("mousemove", transformObjByMouse)
    Creator.canvas.removeEventListener("mousemove", changeSelectionRectByMouse);


    if(Creator.selectionRect.topLeft && Creator.selectionRect.bottomRight) {

        let selectionCanvasWidth = Creator.selectionRect.bottomRight.x - Creator.selectionRect.topLeft.x;
        let selectionCanvasHeight = Creator.selectionRect.bottomRight.y - Creator.selectionRect.topLeft.y;

        // Get bottom left corner of selection rectangle and convert it to point in world

        let bottomLeftWorldCorner = new CanvasPoint(
            Creator.selectionRect.topLeft.x,
            Creator.selectionRect.topLeft.y + selectionCanvasHeight
        ).toWorldPoint();

        // Get top left corner of selection rectangle and convert it to point in world

        let topRightWorldCorner = new CanvasPoint(
            Creator.selectionRect.topLeft.x + selectionCanvasWidth,
            Creator.selectionRect.topLeft.y
        ).toWorldPoint();

        // Select all objects found in selection

        for(let i = 0; i < Creator.gameInstance.level.objects.length; i++) {

            let x = Creator.gameInstance.level.objects[i].x;
            let y = Creator.gameInstance.level.objects[i].y;

            let inXInterval = bottomLeftWorldCorner.x < x && x < topRightWorldCorner.x;
            let inYInterval = bottomLeftWorldCorner.y < y && y < topRightWorldCorner.y;

            if(inXInterval && inYInterval) {
                Creator.selectedObjects.push(Creator.gameInstance.level.objects[i])
            }


        }

    }

    // Clear selection rectangle objects

    Creator.selectionRect.topLeft = null
    Creator.selectionRect.bottomRight = null

    // Snap objects to grid

    for(let i = 0; i < Creator.selectedObjects.length; i++) {
    let gridCell = new GridCell(Creator.selectedObjects[i].x, Creator.selectedObjects[i].y); 
    Creator.selectedObjects[i].x = gridCell.center.x;
    Creator.selectedObjects[i].y = gridCell.center.y;
    }

    // Clear selected objects
    // Set length to zero instead of initalizing new array to preserve reference to single object
    //selectedObjects.length = 0

    // Set selection rectangle corner to null

});

document.querySelector("#activate-viewport-transform").addEventListener("click", function(){
    Creator.mouseTool = "transform-viewport";
});

document.querySelector("#activate-object-transform").addEventListener("click", function(){
    Creator.mouseTool = "select-objects";
});