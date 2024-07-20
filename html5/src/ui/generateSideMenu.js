import { GameLevel, GameObject } from "../gameLevel.js";
import Ghost from "../ghost.js";
import creator from "../creator.js";
import { definitionTree } from "../definitionTree.js";
import objectSprites from "../objectSprites.js";

function createNavItem(className, text, onclick) {

    let e = document.createElement("li");
    e.innerText = text;

    e.classList.add("obj-menu-item")
    e.classList.add(className);

    e.addEventListener("click", onclick)

    return e;
}

export const sideMenu = document.createElement("div");

sideMenu.id = "side-menu";

let nav_list = document.createElement("ul");
nav_list.id = "navigation";
sideMenu.appendChild(nav_list);

nav_list.append(

    createNavItem("blocks-and-tiles", "Blocks and Tiles", function(){
        elements.innerHTML = "";
        elements.appendChild(o.blocks_and_tiles);
        changeSelectionClass(this);
        o.blocks_and_tiles.scrollTo(0,this.scrollTop);
    }),

    createNavItem("walls-and-decoration", "Walls and Decoration", function(){
        elements.innerHTML = "";
        elements.appendChild(o.walls_and_decoration);
        changeSelectionClass(this);
    }),

    createNavItem("switches-and-doors", "Switches and Doors", function(){
        elements.innerHTML = "";
        elements.appendChild(o.switches_and_doors);
        changeSelectionClass(this);
    }),

    createNavItem("powerups", "Powerups", function(){
        elements.innerHTML = "";
        elements.appendChild(o.powerups);
        changeSelectionClass(this);
    }),

    createNavItem("enemies-and-hazards", "Enemies and Hazards", function(){
        elements.innerHTML = "";
        elements.appendChild(o.hazards);
        changeSelectionClass(this);
    })

)

nav_list.querySelector(".blocks-and-tiles.obj-menu-item").classList.add("selected");

const elements = document.createElement("div");
elements.id = "elements";
sideMenu.appendChild(elements);

function generatePreviewCanvas(img) {

    var previewCanvas = document.createElement("canvas");
    previewCanvas.width = 100;
    previewCanvas.height = 100;
    previewCanvas.classList.add("preview-canvas");

    var ctx = previewCanvas.getContext("2d");

    let aspectRatio = img.width / img.height;


    ctx.drawImage(img, 0, 0, 90, 90 / aspectRatio); 

    return previewCanvas;

}

var o = {
    blocks_and_tiles: document.createElement("div"),
    walls_and_decoration: document.createElement("div"),
    switches_and_doors: document.createElement("div"),
    powerups: document.createElement("div"),
    hazards: document.createElement("div")
};

function createMenuItem(definition) {

    var elm = document.createElement("div");
    elm.classList.add("object");

    elm._creator_dictionary_entry = definition;

    let sprite = objectSprites[definition['@_cid']]

    if(sprite) {
        elm.appendChild(definition.svgSprite);
    }

    var span = document.createElement("span");
    span.innerText = definition["@_cname"];
    elm.appendChild(span);

    elm.addEventListener("mousedown", function(){

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

        var move = function(event){
            newGameObject.x = creator.mousePosition.world.x;
            newGameObject.y = creator.mousePosition.world.y;

            newGameObject.ghost.updatePoints();

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

export function generateDefinitionHTML() {

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
}

// Event Listener for Blocks and Tiles

//sideMenu.querySelector(".obj-menu-item.blocks-and-tiles").addEventListener("click", );

//sideMenu.querySelector(".obj-menu-item.walls-and-decoration").addEventListener("click", );

//sideMenu.querySelector(".obj-menu-item.switches-and-doors").addEventListener("click", );

//sideMenu.querySelector(".obj-menu-item.powerups").addEventListener("click", );

//sideMenu.querySelector(".obj-menu-item.enemies-and-hazards").addEventListener("click", );