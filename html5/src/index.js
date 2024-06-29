import definitionTree from "./definitionTree";
import Game from "./game";
import generateDefintionsHTML from "./generateDefinitionsHTML";
import Creator from "./creator";
import { WorldPoint, CanvasPoint } from "./point";

var img1 = document.createElement("img");
img1.src = "./799.svg";
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

/**
 * @type {Game}
 */

Creator.gameInstance = Game.createFromXMLString(str1)

Creator.drawRectangle = function(x, y, w, h) {

}

/*** Test code for showing locations of objects as circles***/

window.addEventListener("load",function(){

    let canvasOffsetX;
    let canvasOffsetY;

    let canvas = document.querySelector("#main-canvas");

    let canvasPositionX = canvas.getBoundingClientRect().x;
    let canvasPositionY = canvas.getBoundingClientRect().y;

    function setCanvasDim() {
        canvas.width = window.innerWidth - canvasPositionX;
        canvas.height = window.innerHeight - canvasPositionY;
    }

    setCanvasDim();

    window.addEventListener("resize", setCanvasDim)

    let ctx = canvas.getContext("2d");

    Creator.canvas = canvas;

    //ctx.translate(canvas.width / 2,canvas.height / 2);
    //ctx.scale(1,-1);

    Creator.objectMenuItems = generateDefintionsHTML();

    this.setInterval(function(){

        Creator.gameInstance.level.levelNode.innerHTML = "";

        // Default value for Creator.selectedObjectPointedToExists.
        Creator.selectedObjectPointedToExists = false;

        Creator.mousePosition = {

            /**
             * Get point of mous relative to canvas
             */

            /*canvasOffset: {
                x: canvasOffsetX,
                y: canvasOffsetY
            },*/

            canvasOffset: new CanvasPoint(canvasOffsetX, canvasOffsetY),

            objectsInGrid: []
        }

        /**
         * Get point of mouse relative to world
         */

        
        /*Creator.mousePosition.world = new WorldPoint(
            (canvasOffsetX  - Creator.deltaX - canvas.width /2)/Creator.zoomFactor,
            -(canvasOffsetY - Creator.deltaY - canvas.height/2)/Creator.zoomFactor
        )*/

        Creator.mousePosition.world = Creator.mousePosition.canvasOffset.toWorldPoint();

        /**
         * Get grid cell the mouse is hovering over
         */

        Creator.mousePosition.gridCell = new Creator.GridCell(
            Creator.mousePosition.world.x,
            Creator.mousePosition.world.y
        ),

        /**document.querySelector("#mouse-info").innerHTML = "World Position:" +
        "(" + Creator.mousePosition.world.x + ", " + Creator.mousePosition.world.y + ") " +
        "Gridcell Bottom Left: (" + Creator.mousePosition.gridCell.bottomLeft.x + ", " + 
        Creator.mousePosition.gridCell.bottomLeft.y + ")" + "Canvas Position: " + "(" +
        canvasOffsetX + ", " + canvasOffsetY + ")";**/

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw sky color
        ctx.fillStyle = "#" + Creator.gameInstance.level.skyColor;

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
            canvas.height - Creator.deltaY
        );

        for(var i = 0; i < Creator.gameInstance.level.objects.length; i++) {

            /**
             * @type {GameObject}
             */

            let o = Creator.gameInstance.level.objects[i];

            // Write object data to level XML

            Creator.gameInstance.level.levelNode.innerHTML += (o.toString() + "|");

            let objCanvasPoint = new WorldPoint(o.x, o.y).toCanvasPoint();

            // Check if object is in the grid cell pointed to by mouse
            let isInGrid = Creator.mousePosition.gridCell.pointInGrid(o.x, o.y);

            // Check if object is in selection array
            let isSelected = Creator.selectedObjects.includes(o);

            // If object is pointed to and also in selection, set variable

            if(isInGrid && isSelected) {
                Creator.selectedObjectPointedToExists = true;
                console.log(Creator.selectedObjectPointedToExists);
            }

            if(isInGrid) {
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
                objCanvasPoint.x - 30 * Creator.zoomFactor,
                objCanvasPoint.y - 30 * Creator.zoomFactor,
                img1.width * Creator.zoomFactor,
                img1.height * Creator.zoomFactor
            )

            ctx.stroke();

            // If object is selected

            if(isSelected) {
                
                ctx.lineWidth = 10 * Creator.zoomFactor;
                ctx.strokeStyle = "blue";

                ctx.beginPath();

                ctx.rect(
                    objCanvasPoint.x - 30 * Creator.zoomFactor,
                    objCanvasPoint.y - 30 * Creator.zoomFactor,
                    60 * Creator.zoomFactor,
                    60 * Creator.zoomFactor
                );

                ctx.stroke();

            };
            
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
            Creator.gridSize * Creator.zoomFactor,
            Creator.gridSize * Creator.zoomFactor
        )

        ctx.stroke(); 

        // Draw selection rectangle, if it exists

        if(Creator.selectionRect.topLeft && Creator.selectionRect.bottomRight) {

            ctx.lineWidth = 1;

            ctx.strokeStyle = "rgb(0,255,255)";

            ctx.fillStyle = "rgb(0,255,255,0.5)"

            ctx.beginPath();

            ctx.rect(
                Creator.selectionRect.topLeft.x,
                Creator.selectionRect.topLeft.y,
                Creator.selectionRect.bottomRight.x - Creator.selectionRect.topLeft.x,
                Creator.selectionRect.bottomRight.y - Creator.selectionRect.topLeft.y
            );

            ctx.fill();

            ctx.stroke();
        }

        /**
         * Used to see if objects in grid really do have a center
         * (Comment out for debugging)
         */

        /**if(Creator.mousePosition.objectsInGrid.length) {

            ctx.beginPath()

            ctx.arc(
                selectedObjCanvasPoint.x, 
                selectedObjCanvasPoint.y, 
                Creator.debugConfig.selectedPointValue * Creator.zoomFactor, 
                0, 
                Math.PI * 2
            );

            ctx.stroke(); 
        }**/

    },16.66);

    canvas.addEventListener("mousemove",function(event){

       // Set new offset
       canvasOffsetX = event.offsetX;
       canvasOffsetY = event.offsetY;

       Creator.mouseDeltaX = canvasOffsetX - event.offsetX;
       Creator.mouseDeltaY = canvasOffsetY - event.offsetY;

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
        Creator.deltaX += Creator.mouseDeltaX;
        Creator.deltaY += Creator.mouseDeltaY;
    }

    function transformObjByMouse(event) {
        for(let i = 0; i < Creator.selectedObjects.length; i++) {
            Creator.selectedObjects[i].x += event.movementX / Creator.zoomFactor;
            Creator.selectedObjects[i].y += -event.movementY / Creator.zoomFactor;
        }
    }

    function changeSelectionRectByMouse() {
        Creator.selectionRect.bottomRight.x = Creator.mousePosition.canvasOffset.x
        Creator.selectionRect.bottomRight.y = Creator.mousePosition.canvasOffset.y
    }

    Creator.selectionRect.bottomRight = null;
    
    canvas.addEventListener("mousedown", function(event){

        /**
         * Note: Avoid overusing nested if-then statements to avoid hard to follow logic.
         *
        */

        if(Creator.selectedObjectPointedToExists) {
            canvas.addEventListener("mousemove", transformObjByMouse);
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
                canvas.addEventListener("mousemove", transformViewportByMouse);
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

                canvas.addEventListener("mousemove", changeSelectionRectByMouse);

            }   

        }
            

    });

    window.addEventListener("mouseup", function(){

        // Disable mousemove events

        canvas.removeEventListener("mousemove", transformViewportByMouse)
        canvas.removeEventListener("mousemove", transformObjByMouse)
        canvas.removeEventListener("mousemove", changeSelectionRectByMouse);


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

            // Select all objects found in selection rectangle

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
           let gridCell = new Creator.GridCell(Creator.selectedObjects[i].x, Creator.selectedObjects[i].y); 
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

    document.querySelector("#zoom-in").addEventListener("click", function(){
        Creator.zoomFactor += 0.1
    });

    document.querySelector("#zoom-out").addEventListener("click", function(){
        Creator.zoomFactor -= 0.1
    });
    
});
