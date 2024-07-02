import dictionary from "../definitions/definitions.js"
import creator from "./creator.js";
import { GameLevel, GameObject } from "./gameLevel.js";
import Ghost from "./ghost.js";

const definitionTree = {
    categories: {}
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

    var img = new Image();

    img.onerror = function() {
        this._broken = true;
    }

    img.src = "images/sprites/" + definition['@_cid'] + ".svg";
    definition.svgSprite = img;

    img.addEventListener("load", function(){
        definition.gridDividesX = (img.width % creator.gridSize === 0);
        definition.gridDividesY = (img.height % creator.gridSize === 0)
    })

    img.draggable = false;

    elm.appendChild(img);

    var span = document.createElement("span");
    span.innerText = definition["@_cname"];
    elm.appendChild(span);

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

    let elm = createMenuItem(definitionTree.categories.block[i]);

    elm._creator_dictionary_entry = definitionTree.categories.block[i];

    elm.addEventListener("mousedown", function(){

        //var newElm = document.createElement("img");
        //newElm.style.position = "absolute";
        //newElm.src = elm._creator_dictionary_entry.svgSprite.src;
        //newElm.style.zIndex = 300;
        //newElm.draggable = false;

        // Game object

        var newGameObject = new GameObject(
            elm._creator_dictionary_entry['@_cid'],
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