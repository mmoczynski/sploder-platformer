import creator from "./creator.js";
import "./ui/index.js";
import Game from "./game.js";
import "./top-menu.js";
import loop from "./loop.js";
import { generateSprites, preloadSpriteImages } from "./definitionTree.js";
import { createBlankFile } from "./file.js";
import { generateDefinitionHTML } from "./ui/generateSideMenu.js";
import { generateStructure } from "./ui/generateStructure.js";

/**
 * Constructor for grid cell object
 */

window.SploderPlatformerCreator = creator;

creator.ctx = creator.canvas.getContext("2d");

creator.canvas.id = "main-canvas";

/*** Test code for showing locations of objects as circles***/

let loadingLoopInteger = setInterval(function(){
    //creator.ctx.clearRect(0,0, creator.canvas.width, creator.canvas.height)
    //creator.ctx.beginPath();
    //creator.ctx.font = "50px sans-serif";
    //creator.ctx.fillText(creator.loadingTxt, creator.canvas.width / 2, creator.canvas.height / 2);
    //creator.ctx.stroke();
    //document.body.innerText = creator.loadingTxt;
}, 16.666);

new Promise(function(resolve, reject){

    preloadSpriteImages(resolve, reject);

}).then(function(){

    return new Promise(function(){

        generateSprites();

        document.body.innerHTML = "";

        createBlankFile();
        clearInterval(loadingLoopInteger);
        generateStructure(document.body);
        generateDefinitionHTML();

        document.body.appendChild(creator.canvas);

        creator.canvasPositionX = creator.canvas.getBoundingClientRect().x;
        creator.canvasPositionY = creator.canvas.getBoundingClientRect().y;
        creator.setCanvasDimensions();

        setInterval(loop,16.66);
    }) 

})

/**
 * @type {Game}
 */

window.addEventListener("resize", creator.setCanvasDimensions)