import DefinitionTree from "./definitionTree";

let definitionTree = new DefinitionTree();

function createMenuItem(definition) {

    var elm = document.createElement("div");
    elm.classList.add("object");

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

function generateDefintionsHTML() {

    var o = {
        blocks_and_tiles: document.createElement("div"),
        walls_and_decoration: document.createElement("div"),
        switches_and_doors: document.createElement("div"),
        powerups: document.createElement("div"),
        hazards: document.createElement("div")
    };

    for(let i = 0; i < definitionTree.categories.block.length; i++) {
        o.blocks_and_tiles.appendChild(createMenuItem(definitionTree.categories.block[i]));
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
        o.blocks_and_tiles.scrollTo(0,-temp1.scrollTop);
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

    return o;
}

export default generateDefintionsHTML;