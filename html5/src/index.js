const DefinitionTree = require("./definitionTree");
const Game = require("./game");
const generateDefintionsHTML = require("./generateDefinitionsHTML");

var img1 = document.createElement("img");
img1.src = "./799.svg";

// Creator object
const Creator = {
    gridSize: 60,
    zoomFactor: 1,
    deltaX: 0,
    deltaY: 0,
}

/**
 * Constructor for grid cell object
 */

Creator.GridCell = function(x,y) {

    this.numberOfGridsX = Math.floor(x/Creator.gridSize);

    this.numberofGridsY = Math.floor(y/Creator.gridSize);

    /**
    * x-coordinate of the bottom left corner of the grid cell
    */

    this.x = this.numberOfGridsX * Creator.gridSize;

    /**
    * y-coordinate of the bottom left corner of the grid cell
    */

    this.y = this.numberofGridsY * Creator.gridSize;

}

Creator.GridCell.prototype.pointInGrid = function(x, y) {

    if((this.x < x && x < this.x + Creator.gridSize) && ((this.y < y && y < this.y + Creator.gridSize))) {
        return true;
    }

    else {
        return false;
    }

}

window.SploderPlatformerCreator = Creator;

Creator.Game = Game;
Creator.DefinitionTree = DefinitionTree;


var str1 = `<project title="" comments="1" bitview="0" id="noid-unsaved-project" mode="2" date="Saturday, March 16, 2024" pubkey="" isprivate="0" fast="0" g="1" author="demo"><levels id="levels"><level name="" music="" avatar="0" env="8,6600cc,333333,100">3,210,210|3,90,90|3,30,30|3,150,150|3,270,270|3,330,330|3,390,330|3,450,330|3,390,270|3,390,210|1,-329,239</level></levels><graphics /><textures lastid="0" /></project>`

Creator.gameInstance = Game.createFromXMLString(str1)

/*** Test code for showing locations of objects as circles***/

window.addEventListener("load",function(){

    let canvasOffsetX;
    let canvasOffsetY;

    let canvas = document.querySelector("#main-canvas");
    let ctx = canvas.getContext("2d");

    ctx.translate(canvas.width / 2,canvas.height / 2);
    ctx.scale(1,-1);

    Creator.objectMenuItems = generateDefintionsHTML();

    this.setInterval(function(){

        Creator.mousePosition = {

            canvasOffset: {
                x: canvasOffsetX,
                y: canvasOffsetY
            },

            objectsInGrid: []
        }

        Creator.mousePosition.world = {
            x: canvasOffsetX - canvas.width/2 - Creator.deltaX,
            y: -(canvasOffsetY - canvas.height/2) - Creator.deltaY
        }

        document.querySelector("#mouse-info").innerHTML = "World Position:" +
        "(" + Creator.mousePosition.world.x + ", " + Creator.mousePosition.world.y + ")"

        Creator.mousePosition.gridCell = new Creator.GridCell(
            Creator.mousePosition.world.x,
            Creator.mousePosition.world.y
        ),

        ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

        for(var i = 0; i < Creator.gameInstance.level1.objects.length; i++) {

            let o = Creator.gameInstance.level1.objects[i];
    
            let k = Creator.zoomFactor;

            if(Creator.mousePosition.gridCell.pointInGrid(o.x, o.y)) {
                Creator.mousePosition.objectsInGrid.push(o);
            }
    
            ctx.beginPath();
            //ctx.arc(o.x,o.y,1,0,2 * Math.PI);

            ctx.rect(
                (o.x - 30)*k + Creator.deltaX ,
                (o.y - 30)*k + Creator.deltaY,
                60*k,
                60*k
            );

            ctx.drawImage(img1,(o.x - 30) + Creator.deltaX,(o.x - 30) + Creator.deltaY)
            ctx.stroke();
        }

        ctx.beginPath();
 
        ctx.rect(
            Creator.mousePosition.gridCell.x,
            Creator.mousePosition.gridCell.y,
            Creator.gridSize,
            Creator.gridSize
        );

        ctx.stroke(); 

    },16.66);

    canvas.addEventListener("mousemove",function(event){

       // Set new offset
       canvasOffsetX = event.offsetX;
       canvasOffsetY = event.offsetY;


    });

    function transformByMouseDelta(event) {

        Creator.deltaX += event.movementX;

        // This is set to the addive inverse/negative of the movement 
        // because the x direction goes up in the creator, not down
        // The browser tracks the mouse using an x axis that goes down 

        Creator.deltaY += -event.movementY;
    }

    canvas.addEventListener("mousedown", function(){
        canvas.addEventListener("mousemove", transformByMouseDelta)
    });

    canvas.addEventListener("mouseup", function(){
        canvas.removeEventListener("mousemove", transformByMouseDelta)
    })
    
})