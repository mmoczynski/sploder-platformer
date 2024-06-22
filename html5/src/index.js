import definitionTree from "./definitionTree";
import Game from "./game";
import generateDefintionsHTML from "./generateDefinitionsHTML";

var img1 = document.createElement("img");
img1.src = "./799.svg";

// Creator object
const Creator = {
    gridSize: 60,
    zoomFactor: 1,
    deltaX: 0,
    deltaY: 0,

    debugConfig: {
        enabled: true,
        selectedPointValue: 10
    },

    mouseTool: "transform-object"
}

/**
 * Object for representing a point as relative to the world.
 * @param {*} x 
 * @param {*} y 
 */

function WorldPoint(x,y) {
    this.x = x;
    this.y = y;
}

/**
 * 
 * @returns Vector measuring point relative to canvas instead of world
 * 
 * Formula:
 * 
 * x_c = x_w + d_x + w/2
 * y_c = -y_w + d_y + h/2
 * 
 */

WorldPoint.prototype.toCanvasPoint = function() {

    return new CanvasPoint(
        this.x + Creator.deltaX + Creator.canvas.width/2, 
        -this.y + Creator.deltaY + Creator.canvas.height/2
    );

}

/**  
 * Point that is relative to canvas
 * @param {*} x 
 * @param {*} y 
 */

function CanvasPoint(x,y) {
    this.x = x;
    this.y = y;
}


/*
* Change canvas point to world point 
* Formula (based on solving in algebra for world point in canvas point)
*
* x_w = x_c - d_x - w/2
* y_w = -(y_c - h/2 - d_y)
*
*/
CanvasPoint.prototype.toWorldPoint = function() {

    return new WorldPoint(
        this.x - Creator.deltaX - Creator.canvas.width / 2,
        -(this.y - Creator.deltaY - Creator.canvas.height / 2)
    )

}

/**
 * Constructor for grid cell object
 */

Creator.GridCell = function(x,y) {

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

Creator.GridCell.prototype.pointInGrid = function(x, y) {

    if( (this.bottomLeft.x < x && x < this.bottomLeft.x + Creator.gridSize) && 
        (this.bottomLeft.y < y && y < this.bottomLeft.y + Creator.gridSize)
    ) {
        return true;
    }

    else {
        return false;
    }

}

window.SploderPlatformerCreator = Creator;

Creator.Game = Game;
Creator.definitionTree = definitionTree;


var str1 = `<project title="" comments="1" bitview="0" id="noid-unsaved-project" mode="2" date="Saturday, March 16, 2024" pubkey="" isprivate="0" fast="0" g="1" author="demo"><levels id="levels"><level name="" music="" avatar="0" env="8,6600cc,333333,100">3,210,210|3,90,90|3,30,30|3,150,150|3,270,270|3,330,330|3,390,330|3,450,330|3,390,270|3,390,210|1,-329,239</level></levels><graphics /><textures lastid="0" /></project>`

Creator.gameInstance = Game.createFromXMLString(str1)

Creator.drawRectangle = function(x, y, w, h) {

}

/*** Test code for showing locations of objects as circles***/

window.addEventListener("load",function(){

    let canvasOffsetX;
    let canvasOffsetY;

    let canvas = document.querySelector("#main-canvas");
    let ctx = canvas.getContext("2d");

    Creator.canvas = canvas;

    //ctx.translate(canvas.width / 2,canvas.height / 2);
    //ctx.scale(1,-1);

    Creator.objectMenuItems = generateDefintionsHTML();

    this.setInterval(function(){

        Creator.mousePosition = {

            /**
             * Get point of mous relative to canvas
             */

            canvasOffset: {
                x: canvasOffsetX,
                y: canvasOffsetY
            },

            objectsInGrid: []
        }

        /**
         * Get point of mouse relative to world
         */

        Creator.mousePosition.world = new WorldPoint(
            canvasOffsetX - Creator.deltaX - canvas.width/2,
            -(canvasOffsetY - Creator.deltaY - canvas.height/2)
        )

        /**
         * Get grid cell the mouse is hovering over
         */

        Creator.mousePosition.gridCell = new Creator.GridCell(
            Creator.mousePosition.world.x,
            Creator.mousePosition.world.y
        ),

        document.querySelector("#mouse-info").innerHTML = "World Position:" +
        "(" + Creator.mousePosition.world.x + ", " + Creator.mousePosition.world.y + ") " +
        "Gridcell Bottom Left: (" + Creator.mousePosition.gridCell.bottomLeft.x + ", " + 
        Creator.mousePosition.gridCell.bottomLeft.y + ")";

        ctx.clearRect(0, 0, canvas.width, canvas.height);


        // Draw sky color
        ctx.fillStyle = "#" + Creator.gameInstance.level1.skyColor;

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height * 0.5 + Creator.deltaY
        );

        // Draw underground
        ctx.fillStyle = "#000000";
        
        ctx.fillRect(
            0,
            canvas.height * 0.5 + Creator.deltaY, 
            canvas.width, 
            canvas.height - Creator.deltaY
        );

        for(var i = 0; i < Creator.gameInstance.level1.objects.length; i++) {

            let o = Creator.gameInstance.level1.objects[i];

            let objCanvasPoint = new WorldPoint(o.x, o.y).toCanvasPoint();

            if(Creator.mousePosition.gridCell.pointInGrid(o.x, o.y)) {
                Creator.mousePosition.objectsInGrid.push(o);
            }

            /*ctx.rect(
                (o.x - 30) + Creator.deltaX + canvas.width/2,
                ((-o.y - 30) + Creator.deltaY + canvas.height /2),
                60,
                60
            );*/

            ctx.drawImage(
                img1,
                objCanvasPoint.x - 30,
                objCanvasPoint.y - 30,
            )

            ctx.stroke();
        }

        ctx.beginPath();

        let selectedObjCanvasPoint;

        /** Get selected object point */

        if(Creator.mousePosition.objectsInGrid.length) {

            selectedObjCanvasPoint = new WorldPoint(
                Creator.mousePosition.objectsInGrid[Creator.mousePosition.objectsInGrid.length - 1].x,
                Creator.mousePosition.objectsInGrid[Creator.mousePosition.objectsInGrid.length - 1].y
            ).toCanvasPoint();

        }

        let gridcellCanvasPoint = Creator.mousePosition.gridCell.topLeft.toCanvasPoint();

        ctx.rect(
            gridcellCanvasPoint.x,
            gridcellCanvasPoint.y,
            Creator.gridSize,
            Creator.gridSize
        )

        ctx.stroke(); 

        /**
         * Used to see if objects in grid really do have a center
         */

        if(Creator.mousePosition.objectsInGrid.length) {

            ctx.beginPath()

            ctx.arc(
                selectedObjCanvasPoint.x, 
                selectedObjCanvasPoint.y, 
                Creator.debugConfig.selectedPointValue, 
                0, 
                Math.PI * 2
            );

            ctx.stroke(); 
        }

    },16.66);

    canvas.addEventListener("mousemove",function(event){

       // Set new offset
       canvasOffsetX = event.offsetX;
       canvasOffsetY = event.offsetY;


    });

    /**
     * 
     * Mouse Tools
     */

    function transformViewportByMouse(event) {
        Creator.deltaX += event.movementX;
        Creator.deltaY += event.movementY;
    }

    function transformObjByMouse(event) {
        transformingObject.x = Creator.mousePosition.gridCell.center.x;
        transformingObject.y = Creator.mousePosition.gridCell.center.y;
    }

    let transformingObject;

    canvas.addEventListener("mousedown", function(){

        if(Creator.mouseTool === "transform-viewport") {
            canvas.addEventListener("mousemove", transformViewportByMouse)
        }

        if(Creator.mouseTool === "transform-object") {
            transformingObject = Creator.mousePosition.objectsInGrid[Creator.mousePosition.objectsInGrid.length - 1];
            canvas.addEventListener("mousemove", transformObjByMouse)
        }

    });

    canvas.addEventListener("mouseup", function(){
        canvas.removeEventListener("mousemove", transformViewportByMouse)
        canvas.removeEventListener("mousemove", transformObjByMouse)
    });

    document.querySelector("#activate-viewport-transform").addEventListener("click", function(){
        Creator.mouseTool = "transform-viewport";
    });

    document.querySelector("#activate-object-transform").addEventListener("click", function(){
        Creator.mouseTool = "transform-object";
    });
    
})