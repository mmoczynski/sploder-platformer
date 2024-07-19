import creator from "./creator.js";
import Game from "./game.js";
import "./mouseTools.js";
import "./top-menu.js";
import loop from "./loop.js";
import { preloadSpriteImages, generateDefinitionHTML } from "./definitionTree.js";
import { createBlankFile } from "./file.js";

/**
 * Constructor for grid cell object
 */

window.SploderPlatformerCreator = creator;

creator.ctx = creator.canvas.getContext("2d");

document.querySelector("#canvas-container").appendChild(creator.canvas);
creator.canvas.id = "main-canvas";

/*** Test code for showing locations of objects as circles***/

creator.canvasPositionX = creator.canvas.getBoundingClientRect().x;
creator.canvasPositionY = creator.canvas.getBoundingClientRect().y;

creator.setCanvasDimensions();

let loadingLoopInteger = setInterval(function(){
    creator.ctx.clearRect(0,0, creator.canvas.width, creator.canvas.height)
    creator.ctx.beginPath();
    creator.ctx.font = "50px sans-serif";
    creator.ctx.fillText(creator.loadingTxt, creator.canvas.width / 2, creator.canvas.height / 2);
    creator.ctx.stroke();
}, 16.666);

new Promise(function(resolve, reject){

    preloadSpriteImages(resolve, reject);

}).then(function(){

    return new Promise(function(){
        generateDefinitionHTML();
        createBlankFile();
        clearInterval(loadingLoopInteger);
        setInterval(loop,16.66);
    }) 

})

/**
 * @type {Game}
 */

window.addEventListener("resize", creator.setCanvasDimensions)