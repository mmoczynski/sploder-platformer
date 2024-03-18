//var levelParser = require("./levelParser");

const DefinitionTree = require("./definitionTree");
const Game = require("./game");

//console.log(new DefinitionTree());

function Creator() {

}

Creator.gridSize = 60;

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

console.log(Creator);

/*** Test code for showing locations of objects as circles***/

window.addEventListener("load",function(){

    let canvasOffsetX;
    let canvasOffsetY;

    let canvas = document.querySelector("#main-canvas");
    let ctx = canvas.getContext("2d");

    ctx.translate(canvas.width / 2,canvas.height / 2);
    ctx.scale(1,-1);

    this.setInterval(function(){

        Creator.mousePosition = {

            canvasOffset: {
                x: canvasOffsetX,
                y: canvasOffsetY
            },

            objectsInGrid: []
        }

        Creator.mousePosition.world = {
            x: canvasOffsetX - canvas.width/2,
            y: -(canvasOffsetY - canvas.height/2)
        }

        Creator.mousePosition.gridCell = new Creator.GridCell(
            Creator.mousePosition.world.x,
            Creator.mousePosition.world.y
        ),

        ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

        for(var i = 0; i < Creator.gameInstance.level1.objects.length; i++) {

            let o = Creator.gameInstance.level1.objects[i];
    
            let k = 1;

            if(Creator.mousePosition.gridCell.pointInGrid(o.x, o.y)) {
                Creator.mousePosition.objectsInGrid.push(o);
            }
    
            ctx.beginPath();
            //ctx.arc(o.x,o.y,1,0,2 * Math.PI);
            ctx.rect((o.x - 30)*k,(o.y - 30)*k,60*k,60*k);
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
       canvasOffsetX = event.offsetX;
       canvasOffsetY = event.offsetY;
    });


    
})