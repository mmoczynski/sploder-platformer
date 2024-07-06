import dictionary from "../definitions/definitions.js"
import { CanvasColorTransformFixedPoint } from "./colorTransforms.js";
import creator from "./creator.js";
import { GameLevel, GameObject } from "./gameLevel.js";
import Ghost from "./ghost.js";

const definitionTree = {
    categories: {}
}

function CompoundSprite(parts) {

}

const tempTile = document.createElement("canvas");
tempTile.width = 60;
tempTile.height = 60;

const temptile_ctx = tempTile.getContext("2d");
temptile_ctx.fillStyle = "white";
temptile_ctx.fillRect(0,0,tempTile.width, tempTile.height);


const tempLargeTile = document.createElement("canvas");
tempLargeTile.width = 120;
tempLargeTile.height = 120;

const largetemptile_ctx = tempLargeTile.getContext("2d");
largetemptile_ctx.fillStyle = "white";
largetemptile_ctx.fillRect(0,0,tempTile.width, tempTile.height);

const objectSprites = {

    3: "images/sprites/3.svg",
    4: "images/sprites/4.svg",

    5: tempTile,

    6: "images/sprites/6.svg",

    7: {
        src: "images/sprites/6.svg",
        scaleX: -1
    },

    456: {
        src: "images/sprites/6.svg",
        scaleY: -1
    },

    457: {
        src: "images/sprites/6.svg",
        scaleX: -1,
        scaleY: -1
    },

    8: "images/sprites/8.svg",

    9: {
        src: "images/sprites/8.svg",
        scaleX: -1
    },

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
    353: "images/sprites/sageowl.svg",
    352: "images/sprites/sagegeneral.svg",
    351: "images/sprites/sagewizard.svg",
    202: "images/sprites/crystal.svg",
    216: "images/sprites/extra-life.svg",
    217: "images/sprites/checkpoint.svg",
    150: "images/sprites/torch.svg",
    207: "images/sprites/jetfuel.svg",
    104: "images/sprites/wheel.svg",
    105: "images/sprites/smallwheel.svg",

    53: {

        stack: [
            "images/sprites/windmill/windmill1.svg",
            "images/sprites/windmill/windmill1-dots.svg",
        ],

        width: 248,
        height:248

    },

    54: {

        stack: [
            "images/sprites/windmill/windmill2.svg",
            "images/sprites/windmill/windmill2-dots.svg",
        ],

        width: 248,
        height:248

    },

    220: {

        stack: [
            "images/sprites/crusher/crusher.svg",
            "images/sprites/crusher/arrows.svg",
        ],

        width: 240,
        height: 240,
    }, 

    107: "images/sprites/barrel.svg",
    59: "images/sprites/rod.svg",
    64: "images/sprites/crate.svg",
    201: "images/sprites/medkit.svg",
    200: "images/sprites/cookie.svg",
    211: "images/sprites/atomic.svg",
    287: "images/sprites/cinderblock.svg",
    80: "images/sprites/tunnels/tunnel.svg",
    81: "images/sprites/tunnels/tunnel-curve.svg",
    82: "images/sprites/tunnels/tunnel-t-junction.svg",
    83: "images/sprites/tunnels/tunnel-4way-junction.svg",
    84: "images/sprites/tunnels/tunnel-end.svg",

    85: {

        stack: [
            "images/sprites/tunnels/tunnel-blue-1.svg",
            "images/sprites/tunnels/tunnel-blue-middle.svg",
            "images/sprites/tunnels/tunnel-blue-2.svg"
        ],

        width: 300,
        height: 300
    },

    86: {

        stack: [
            "images/sprites/tunnels/tunnel-curve-blue-1.svg", // needs resizing feature
            "images/sprites/tunnels/tunnel-blue-middle.svg",
            "images/sprites/tunnels/tunnel-curve-blue-2.svg"
        ],

        width: 300,
        height: 300,

    },

    87: {

        stack: [
            "images/sprites/tunnels/tunnel-t-junction-blue-1.svg",
            "images/sprites/tunnels/tunnel-blue-middle.svg",
            "images/sprites/tunnels/tunnel-t-junction-blue-2.svg"
        ],

        width: 300,
        height: 300


    },


    88: {

        stack: [
            "images/sprites/tunnels/tunnel-4way-junction-blue-1.svg",
            "images/sprites/tunnels/tunnel-blue-middle.svg",
            "images/sprites/tunnels/tunnel-4way-junction-blue-2.svg"
        ],

        width: 300,
        height: 300


    },

    89: {

        stack: [
            "images/sprites/tunnels/tunnel-end-blue-1.svg",
            "images/sprites/tunnels/tunnel-blue-middle.svg",
            "images/sprites/tunnels/tunnel-end-blue-2.svg"
        ],

        width: 300,
        height: 300


    },

    151: "images/sprites/shield.svg",

    22: "images/sprites/lamwalls/1.svg",
    23: "images/sprites/lamwalls/2.svg",
    24: "images/sprites/lamwalls/3.svg",
    25: "images/sprites/lamwalls/4.svg",
    26: "images/sprites/lamwalls/5.svg",
    27: "images/sprites/lamwalls/6.svg",
    28: "images/sprites/lamwalls/7.svg",
    29: "images/sprites/lamwalls/8.svg",
    30: "images/sprites/lamwalls/9.svg",
    31: "images/sprites/lamwalls/10.svg",
    32: "images/sprites/lamwalls/11.svg",
    33: "images/sprites/lamwalls/12.svg",

    69: "images/sprites/goldpanel1.svg",
    70: "images/sprites/goldpanel2.svg",

    250: "images/sprites/doors/autodoor.svg",
    251: "images/sprites/doors/touchdoor.svg",
    256: "images/sprites/doors/bluedoor.svg",
    257: "images/sprites/doors/greendoor.svg",
    258: "images/sprites/doors/yellowdoor.svg",
    277: "images/sprites/doors/onewaydoor.svg",

    601: "images/sprites/frontplant.svg",
    602: "images/sprites/plant.svg",
    603: "images/sprites/frontplant2.svg",
    604: "images/sprites/frontgrass.svg",
    605: "images/sprites/grass.svg",

    613: "images/sprites/truss.svg",

    611: "images/sprites/spiderweb.svg",

    617: {
        scaleX: -1,
        src: "images/sprites/spiderweb.svg"
    },

    606: "images/sprites/etching1.svg",
    607: "images/sprites/etching2.svg",

    40: "images/sprites/statues/statue1.svg",
    41: "images/sprites/statues/statue2.svg",
    42: "images/sprites/statues/statue3.svg",

    608: "images/sprites/statues/frontstatue.svg",
    14: "images/sprites/backlight.svg",
    117: "images/sprites/backwall.svg",

    501: "images/sprites/backbrick-1.svg",
    502: "images/sprites/backbrick-2.svg",
    503: "images/sprites/backbrick-3.svg",
    504: "images/sprites/backbrick-4.svg",

    61: {

        stack: [

            "images/sprites/teleporter/bg.svg",
            
            {
                src: "images/sprites/teleporter/ring.svg",

                colorTransform: {

                    redAddTerm: 255,
                    blueAddTerm: 255,
                    greenAddTerm: 0,
                    alphaAddTerm: 0,

                    redMultTerm: 0,
                    greenMultTerm: 0,
                    blueMultTerm: 0,
                    alphaMultTerm: 256,
                }

            }

        ],

        width: 180,
        height: 180
    },

    62: {

        stack: [
            "images/sprites/teleporter/bg.svg",
            "images/sprites/teleporter/ring.svg"
        ],

        width: 180,
        height: 180
    },

    63: {

        stack: [
            "images/sprites/teleporter/bg.svg",
            "images/sprites/teleporter/ring.svg"
        ],

        width: 180,
        height: 180
    }

}

// Objects that will be used for storing cache

let urlSet = new Set();

function populateURLset(o) {

    if(typeof o === "string") {
        urlSet.add(o);
    }

    else if (o.src && typeof o.src === "string") {
        urlSet.add(o.src);
    }

    else if(Array.isArray(o.stack)) {
        for(let x in o.stack) {
            populateURLset(x)
        }
    }

}

for(let o in objectSprites) {
    populateURLset(o);
}

var o = {
    blocks_and_tiles: document.createElement("div"),
    walls_and_decoration: document.createElement("div"),
    switches_and_doors: document.createElement("div"),
    powerups: document.createElement("div"),
    hazards: document.createElement("div")
};

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

function createMenuItem(definition) {

    var elm = document.createElement("div");
    elm.classList.add("object");

    elm._creator_dictionary_entry = definition;

    let sprite = objectSprites[definition['@_cid']]

    if(typeof sprite === "string") {

        var img = new Image();

        img.onerror = function() {
            this._broken = true;
        }

        img.src = sprite;
        definition.svgSprite = img;

        img.addEventListener("load", function(){
            definition.gridDividesX = (img.width % creator.gridSize === 0);
            definition.gridDividesY = (img.height % creator.gridSize === 0);
            elm.appendChild(generatePreviewCanvas(img));
        });

        img.draggable = false;

    }

    // Simple stack of images

    else if(typeof sprite === "object" && Array.isArray(sprite.stack) ){
        
        let canvas = document.createElement("canvas");

        let ctx = canvas.getContext("2d");

        canvas.width = sprite.width;
        canvas.height = sprite.height;

        canvas._images_loaded = 0;

        let images = [];

        for(let i = 0; i < sprite.stack.length; i++) {

            let img = new Image();
            images.push(img);

            if(typeof sprite.stack[i] === "string") {
                img.src = sprite.stack[i];
            }

            if(typeof sprite.stack[i] === "object" && typeof sprite.stack[i].src === "string") {
                img.src = sprite.stack[i].src;
            }

            if(typeof sprite.stack[i] === "object" && typeof sprite.stack[i].width === "number") {
                img.width = sprite.stack[i].width;
            }

            if(typeof sprite.stack[i] === "object" && typeof sprite.stack[i].height === "number") {
                img.height = sprite.stack[i].height;
            }

            if(typeof sprite.stack[i] === "object" && typeof sprite.stack[i].colorTransform === "object" ) {
                
                let ct = new CanvasColorTransformFixedPoint();

                ct.redAddTerm = sprite.stack[i].colorTransform.redAddTerm;
                ct.blueAddTerm = sprite.stack[i].colorTransform.blueAddTerm;
                ct.greenAddTerm = sprite.stack[i].colorTransform.greenAddTerm;
                ct.alphaAddTerm = sprite.stack[i].colorTransform.alphaAddTerm,

                ct.redMultTerm = sprite.stack[i].colorTransform.redMultTerm;
                ct.greenMultTerm = sprite.stack[i].colorTransform.greenMultTerm;
                ct.blueMultTerm = sprite.stack[i].colorTransform.blueMultTerm;
                ct.alphaMultTerm = sprite.stack[i].colorTransform.alphaMultTerm;

                img._colorTransform = ct;

            }

            img.addEventListener("load", function(){

                canvas._images_loaded++;

                // Copy image to canvas

                this._imgCanvas = document.createElement("canvas");
                this._imgCanvasCtx = img._imgCanvas.getContext("2d");

                this._imgCanvas.width = this.width;
                this._imgCanvas.height = this.height;

                this._imgCanvasCtx.drawImage(this, 0, 0);

                // Perform any color transformations that are defined

                if(this._colorTransform) {

                    this._colorTransform.applyToUntransformedCanvas(
                        this._imgCanvasCtx
                    );

                } 

                if(canvas._images_loaded === sprite.stack.length) {

                    images.forEach(function(stackImage){
                        
                        ctx.drawImage(
                            stackImage._imgCanvas,
                            canvas.width / 2 - stackImage._imgCanvas.width / 2,
                            canvas.height / 2 - stackImage._imgCanvas.height / 2
                        );

                    });

                    elm.appendChild(generatePreviewCanvas(canvas));

                }

            });

        }

        definition.svgSprite = canvas;

    }

    else if(typeof sprite === "object" && typeof sprite.src === "string") {
        
        let canvas = document.createElement("canvas");

        let scaled = (typeof sprite.scaleX === "number" || typeof sprite.scaleX === "number");

        // Used for turning sprite by 90 degrees or so

        let scaleX = sprite.scaleX || 1
        let scaleY = sprite.scaleY || 1

        let ctx = canvas.getContext("2d");

        definition.svgSprite = canvas;

        let img = new Image();

        img.addEventListener("load", function(){

            canvas.width = sprite.width || img.width;
            canvas.height = sprite.height || img.height;

            ctx.translate(canvas.width * 0.5, canvas.height * 0.5);

            ctx.scale(scaleX, scaleY);

            ctx.drawImage(
                img,
                 - img.width / 2,
                 - img.height / 2 
            );

            elm.appendChild(generatePreviewCanvas(canvas));

        });

        img.src = sprite.src;

    }

    else if(sprite instanceof HTMLCanvasElement) {
        definition.svgSprite = sprite;
        elm.appendChild(sprite);
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