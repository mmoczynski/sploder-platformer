import Game from "./game.js";
import generateDefintionsHTML from "./generateDefinitionsHTML.js";
import creator from "./creator.js";
import { WorldPoint, CanvasPoint } from "./point.js";
import { GridCell } from "./grid.js";
import "./mouseTools.js";
import Modal from "./modal.js";
import definitionTree from "./definitionTree.js";
import Ghost from "./ghost.js";

creator.Modal = Modal;

/**
 * Constructor for grid cell object
 */

window.SploderPlatformerCreator = creator;


var str1 = `<project title="" comments="1" bitview="0" id="noid-unsaved-project" mode="2" date="Saturday, March 16, 2024" pubkey="" isprivate="0" fast="0" g="1" author="demo"><levels id="levels"><level name="" music="" avatar="0" env="8,6600cc,333333,100">3,210,210|3,90,90|3,30,30|3,150,150|3,270,270|3,330,330|3,390,330|3,450,330|3,390,270|3,390,210|1,-329,239</level></levels><graphics /><textures lastid="0" /></project>`

/**
 * @type {Game}
 */

creator.gameInstance = Game.createFromXMLString(str1)

/*** Test code for showing locations of objects as circles***/

creator.canvasPositionX = creator.canvas.getBoundingClientRect().x;
creator.canvasPositionY = creator.canvas.getBoundingClientRect().y;

creator.setCanvasDimensions();

window.addEventListener("resize", creator.setCanvasDimensions)

let ctx = creator.canvas.getContext("2d");

creator.ctx = ctx;

creator.objectMenuItems = generateDefintionsHTML();

setInterval(function(){

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

        // Write object data to level XML

        creator.gameInstance.level.levelNode.innerHTML += (o.toString() + "|");

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

        isInGrid = o.worldPointInObject(creator.mousePosition.world.x, creator.mousePosition.world.y);

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

        let img1 = definitionTree[creator.gameInstance.level.objects[i].objectID].svgSprite;

        if(img1 && img1.complete && !img1._broken) {

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

        if(o.ghost instanceof Ghost) {

            creator.ctx.beginPath();

            creator.ctx.lineWidth = 2;

            creator.ctx.strokeStyle = "orange";
        
            creator.ctx.rect(
                o.ghost.centerPoint.toCanvasPoint().x - o.ghost.width * 0.5,
                o.ghost.centerPoint.toCanvasPoint().y - o.ghost.height * 0.5,
                o.ghost.width,
                o.ghost.height
            )
        
            creator.ctx.stroke();

            creator.ctx.beginPath();

            creator.ctx.arc(
                o.ghost.centerPoint.toCanvasPoint().x, 
                o.ghost.centerPoint.toCanvasPoint().y, 
                70, 
                0, 
                2 * Math.PI)

            creator.ctx.stroke();

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

},16.66);

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

document.querySelector("#new-game-menu-item").addEventListener("click", function(){
    Modal.confirm("Creating a new game will erase any unsaved game you are working on. Do you want to do this?")
});

document.querySelector("#test-game-menu-item").addEventListener("click", function(){
    Modal.alert("Testing games is not available right now.");
});

document.querySelector("#publish-game-menu-item").addEventListener("click", function(){
    Modal.alert("Publishing games is not available right now.");
});

document.querySelector("#rename-level-button").addEventListener("click", function(){

    Modal.prompt(

        "Enter in new name for level:", 

        function(input) {
            creator.gameInstance.level.name = input;
        }, 

        function() {}, 

        creator.gameInstance.level.name

    );

});