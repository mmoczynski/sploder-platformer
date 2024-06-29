import definitionTree from "./definitionTree";
import Game from "./game";
import generateDefintionsHTML from "./generateDefinitionsHTML";
import creator from "./creator";
import { WorldPoint, CanvasPoint } from "./point";
import { GridCell } from "./grid";
import "./mouseTools";

var img1 = document.createElement("img");
img1.src = "./799.svg";
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

let canvas = creator.canvas;

let canvasPositionX = canvas.getBoundingClientRect().x;
let canvasPositionY = canvas.getBoundingClientRect().y;

function setCanvasDim() {
    canvas.width = window.innerWidth - canvasPositionX;
    canvas.height = window.innerHeight - canvasPositionY;
}

setCanvasDim();

window.addEventListener("resize", setCanvasDim)

let ctx = canvas.getContext("2d");

creator.canvas = canvas;

creator.objectMenuItems = generateDefintionsHTML();

setInterval(function(){

    creator.gameInstance.level.levelNode.innerHTML = "";

    // Default value for Creator.selectedObjectPointedToExists.
    creator.selectedObjectPointedToExists = false;

    // Reset objects in grid array
    creator.mousePosition.objectsInGrid = [];

    /**
     * Get point of mouse relative to world
     */

    creator.mousePosition.world = creator.mousePosition.canvasOffset.toWorldPoint();

    /**
     * Get grid cell the mouse is hovering over
     */

    creator.mousePosition.gridCell = new GridCell(
        creator.mousePosition.world.x,
        creator.mousePosition.world.y
    ),

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw sky color
    ctx.fillStyle = "#" + creator.gameInstance.level.skyColor;

    let centerWorldPointAsCanvasPoint = new WorldPoint(0, 0).toCanvasPoint();

    ctx.fillRect(
        0,
        0,
        canvas.width,
        centerWorldPointAsCanvasPoint.y
    );

    // Draw underground
    ctx.fillStyle = "#000000";
    
    ctx.fillRect(
        0,
        centerWorldPointAsCanvasPoint.y, 
        canvas.width, 
        canvas.height - creator.deltaY
    );

    for(var i = 0; i < creator.gameInstance.level.objects.length; i++) {

        /**
         * @type {GameObject}
         */

        let o = creator.gameInstance.level.objects[i];

        // Write object data to level XML

        creator.gameInstance.level.levelNode.innerHTML += (o.toString() + "|");

        let objCanvasPoint = new WorldPoint(o.x, o.y).toCanvasPoint();

        // Check if object is in the grid cell pointed to by mouse
        let isInGrid = creator.mousePosition.gridCell.pointInGrid(o.x, o.y);

        // Check if object is in selection array
        let isSelected = creator.selectedObjects.includes(o);

        // If object is pointed to and also in selection, set variable

        if(isInGrid && isSelected) {
            creator.selectedObjectPointedToExists = true;
            console.log(creator.selectedObjectPointedToExists);
        }

        if(isInGrid) {
            creator.mousePosition.objectsInGrid.push(o);
        }

        ctx.drawImage(
            img1,
            objCanvasPoint.x - 30 * creator.zoomFactor,
            objCanvasPoint.y - 30 * creator.zoomFactor,
            img1.width * creator.zoomFactor,
            img1.height * creator.zoomFactor
        )

        ctx.stroke();

        // If object is selected

        if(isSelected) {
            
            ctx.lineWidth = 10 * creator.zoomFactor;
            ctx.strokeStyle = "blue";

            ctx.beginPath();

            ctx.rect(
                objCanvasPoint.x - 30 * creator.zoomFactor,
                objCanvasPoint.y - 30 * creator.zoomFactor,
                60 * creator.zoomFactor,
                60 * creator.zoomFactor
            );

            ctx.stroke();

        };
        
    }

    ctx.beginPath();

    let selectedObjCanvasPoint;

    /** Get selected object point */

    if(creator.mousePosition.objectsInGrid.length) {

        selectedObjCanvasPoint = new WorldPoint(
            creator.mousePosition.objectsInGrid[creator.mousePosition.objectsInGrid.length - 1].x,
            creator.mousePosition.objectsInGrid[creator.mousePosition.objectsInGrid.length - 1].y
        ).toCanvasPoint();

    }

    let gridcellCanvasPoint = creator.mousePosition.gridCell.topLeft.toCanvasPoint();

    ctx.rect(
        gridcellCanvasPoint.x,
        gridcellCanvasPoint.y,
        creator.gridSize * creator.zoomFactor,
        creator.gridSize * creator.zoomFactor
    )

    ctx.stroke(); 

    // Draw selection rectangle, if it exists

    if(creator.selectionRect.topLeft && creator.selectionRect.bottomRight) {

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