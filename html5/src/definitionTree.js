import dictionary from "../definitions/definitions.js"
import creator from "./creator.js";
import { GameLevel, GameObject } from "./gameLevel.js";
import Ghost from "./ghost.js";

const definitionTree = {
    categories: {}
}

function CompoundSprite(parts) {

}

const objectSprites = {
    3: "images/sprites/3.svg",
    4: "images/sprites/4.svg",
    6: "images/sprites/6.svg",
    8: "images/sprites/8.svg",
    15: "images/sprites/15.svg",
    16:  "images/sprites/16.svg",
    17: "images/sprites/4.svg",
    18: "images/sprites/18.svg",
    19: "images/sprites/19.svg",
    20: "images/sprites/20.svg",
    21: "images/sprites/21.svg",
    49: "images/sprites/49.svg",
    55: "images/sprites/55.svg",
    56: "images/sprites/56.svg",
    57: "images/sprites/57.svg",
    58: "images/sprites/58.svg",
    60: "images/sprites/60.svg",
    289: "images/sprites/289.svg",
    401: "images/sprites/401.svg",
    402: "images/sprites/402.svg",
    403: "images/sprites/403.svg",
    404: "images/sprites/404.svg",
    405: "images/sprites/405.svg",
    406: "images/sprites/406.svg",
    407: "images/sprites/407.svg",
    408: "images/sprites/408.svg",
    409: "images/sprites/409.svg",
    410:  "images/sprites/410.svg",
    411: "images/sprites/411.svg",
    412: "images/sprites/412.svg",
    413: "images/sprites/413.svg",
    459: "images/sprites/459.svg",
    463: "images/sprites/463.svg",
    353: "images/sprites/sageowl.svg",
    352: "images/sprites/sagegeneral.svg",
    351: "images/sprites/sagewizard.svg"
}

function Sprite(objectID) {

    /**
     * @type {HTMLImageElement[]}
     */

    this.frames = [];

    /**
     * Width
     */
    this.width = width;

    /**
     * Height
     */

    this.height = height;

    this.objectID = objectID;
}



let a = dictionary.objects.playobj

for(var i = 0; i < a.length; i++) {

    // Assign objectID to dictionary entry
    definitionTree[a[i]["@_cid"]] = a[i];

    // Create category if it does not exist
    if(!definitionTree.categories[a[i]["@_ctype"]]) {
        definitionTree.categories[a[i]["@_ctype"]] = []
    }

    // Put object definition in category
    definitionTree.categories[a[i]["@_ctype"]].push(a[i]);

    // Get sprite

}

function createMenuItem(definition) {

    var elm = document.createElement("div");
    elm.classList.add("object");

    elm._creator_dictionary_entry = definition;

    if(typeof objectSprites[definition['@_cid']] === "string") {

        var img = new Image();

        img.onerror = function() {
            this._broken = true;
        }

        img.src = objectSprites[definition['@_cid']];
        definition.svgSprite = img;

        img.addEventListener("load", function(){
            definition.gridDividesX = (img.width % creator.gridSize === 0);
            definition.gridDividesY = (img.height % creator.gridSize === 0)
        });

        img.draggable = false;

        elm.appendChild(img);

    }

    var span = document.createElement("span");
    span.innerText = definition["@_cname"];
    elm.appendChild(span);

    elm.addEventListener("mousedown", function(){

        //var newElm = document.createElement("img");
        //newElm.style.position = "absolute";
        //newElm.src = elm._creator_dictionary_entry.svgSprite.src;
        //newElm.style.zIndex = 300;
        //newElm.draggable = false;

        // Game object

        var newGameObject = new GameObject(
            this._creator_dictionary_entry['@_cid'],
            creator.mousePosition.world.x,
            creator.mousePosition.world.y
        );

        newGameObject.ghost = new Ghost(newGameObject);

        if(creator.gameInstance.level instanceof GameLevel) {
            creator.gameInstance.level.objects.push(newGameObject);
        }

        //newElm.width = Math.floor(newElm.width * creator.zoomFactor);
        //newElm.height = Math.floor(newElm.height * creator.zoomFactor);

        //document.body.appendChild(newElm);

        var move = function(event){

            //let x = (event.x - newElm.width * creator.zoomFactor * 0.5);
            //let y = (event.y - newElm.height * creator.zoomFactor * 0.5);

            newGameObject.x = creator.mousePosition.world.x;
            newGameObject.y = creator.mousePosition.world.y;

            newGameObject.ghost.updatePoints();

            //console.log(creator.mousePosition.world);

            //console.log(newGameObject);

            //newElm.style.left = x + "px";
            //newElm.style.top = y + "px";
        }

        var disable = function() {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", disable);
            //document.body.removeChild(newElm);

            newGameObject.x = newGameObject.ghost.centerPoint.x;
            newGameObject.y = newGameObject.ghost.centerPoint.y;

        }

        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", disable);

    });

    return elm;
}

function changeSelectionClass(targetElement) {
    var oldElm = document.querySelector("#navigation").querySelector(".selected");
    oldElm.classList.remove("selected");
    targetElement.classList.add("selected");
}

var o = {
    blocks_and_tiles: document.createElement("div"),
    walls_and_decoration: document.createElement("div"),
    switches_and_doors: document.createElement("div"),
    powerups: document.createElement("div"),
    hazards: document.createElement("div")
};

for(let i = 0; i < definitionTree.categories.block.length; i++) {

    let elm = createMenuItem(definitionTree.categories.block[i])


    o.blocks_and_tiles.appendChild(elm);

}

for(let i = 0; i < definitionTree.categories.blockbehind.length; i++) {
    o.walls_and_decoration.appendChild(createMenuItem(definitionTree.categories.blockbehind[i]));
}

for(let i = 0; i < definitionTree.categories.trigger.length; i++) {
    o.switches_and_doors.appendChild(createMenuItem(definitionTree.categories.trigger[i]));
}

for(let i = 0; i < definitionTree.categories.powerup.length; i++) {
    o.powerups.appendChild(createMenuItem(definitionTree.categories.powerup[i]));
}

for(let i = 0; i < definitionTree.categories.hazard.length; i++) {
    o.hazards.appendChild(createMenuItem(definitionTree.categories.hazard[i]));
}

// Event Listener for Blocks and Tiles

document.querySelector(".obj-menu-item.blocks-and-tiles").addEventListener("click", function(){
    document.querySelector("#elements").innerHTML = "";
    document.querySelector("#elements").appendChild(o.blocks_and_tiles);
    changeSelectionClass(this);
    o.blocks_and_tiles.scrollTo(0,this.scrollTop);
});

document.querySelector(".obj-menu-item.walls-and-decoration").addEventListener("click", function(){
    document.querySelector("#elements").innerHTML = "";
    document.querySelector("#elements").appendChild(o.walls_and_decoration);
    changeSelectionClass(this);
});

document.querySelector(".obj-menu-item.switches-and-doors").addEventListener("click", function(){
    document.querySelector("#elements").innerHTML = "";
    document.querySelector("#elements").appendChild(o.switches_and_doors);
    changeSelectionClass(this);
});

document.querySelector(".obj-menu-item.powerups").addEventListener("click", function(){
    document.querySelector("#elements").innerHTML = "";
    document.querySelector("#elements").appendChild(o.powerups);
    changeSelectionClass(this);
});

document.querySelector(".obj-menu-item.enemies-and-hazards").addEventListener("click", function(){
    document.querySelector("#elements").innerHTML = "";
    document.querySelector("#elements").appendChild(o.hazards);
    changeSelectionClass(this);
});

export default definitionTree;