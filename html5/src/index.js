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

new Promise(function(resolve, reject){

    preloadSpriteImages(resolve, reject);

}).then(function(){

    return new Promise(function(){

        generateSprites();
        createBlankFile();

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