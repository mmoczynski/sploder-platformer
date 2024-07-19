import Game from "./game.js";
import creator from "./creator.js";
import "./mouseTools.js";
import "./top-menu.js";
import loop from "./loop.js";
import { preloadSpriteImages, generateDefinitionHTML } from "./definitionTree.js";
import { createBlankFile } from "./file.js";

/**
 * Constructor for grid cell object
 */

window.SploderPlatformerCreator = creator;

new Promise(function(resolve, reject){

    preloadSpriteImages(resolve, reject);

}).then(function(){

    return new Promise(function(){
        generateDefinitionHTML();
        createBlankFile();
        setInterval(loop,16.66);
    }) 

})

/**
 * @type {Game}
 */

/*** Test code for showing locations of objects as circles***/

creator.canvasPositionX = creator.canvas.getBoundingClientRect().x;
creator.canvasPositionY = creator.canvas.getBoundingClientRect().y;

creator.setCanvasDimensions();

window.addEventListener("resize", creator.setCanvasDimensions)

creator.ctx = creator.canvas.getContext("2d");

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