import Game from "./game.js";
import creator from "./creator.js";
import "./mouseTools.js";
import "./top-menu.js";
import loop from "./loop.js";
import { preloadSpriteImages, generateDefinitionHTML } from "./definitionTree.js";

/**
 * Constructor for grid cell object
 */

window.SploderPlatformerCreator = creator;

new Promise(function(resolve, reject){

    preloadSpriteImages(resolve, reject);

}).then(function(){

    return new Promise(function(){
        generateDefinitionHTML();
        creator.gameInstance = Game.createFromXMLString(str1);
        setInterval(loop,16.66);
    }) 

})


var str1 = `<project title="" comments="1" bitview="0" id="noid-unsaved-project" mode="2" date="Saturday, March 16, 2024" pubkey="" isprivate="0" fast="0" g="1" author="demo"><levels id="levels"><level name="" music="" avatar="0" env="8,6600cc,333333,100">3,210,210|3,90,90|3,30,30|3,150,150|3,270,270|3,330,330|3,390,330|3,450,330|3,390,270|3,390,210|1,-329,239</level></levels><graphics /><textures lastid="0" /></project>`

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