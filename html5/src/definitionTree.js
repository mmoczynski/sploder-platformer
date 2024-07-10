import dictionary from "../definitions/definitions.js"
import { CanvasColorTransformFixedPoint } from "./colorTransforms.js";
import creator from "./creator.js";
import { GameLevel, GameObject } from "./gameLevel.js";
import Ghost from "./ghost.js";
import objectSprites from "./objectSprites.js";

export const definitionTree = {
    categories: {},
}

function populateURLset(o, urlSet) {

    if(typeof o === "string") {
        urlSet.add(o);
    }

    else if (o.src && typeof o.src === "string") {
        urlSet.add(o.src);
    }

    else if(Array.isArray(o.stack)) {
        for(let key in o.stack) {
            populateURLset(o.stack[key], urlSet)
        }
    }

}

export function preloadSpriteImages(onload, onerror) {
    
    let urlSet = new Set();

    for(let key in objectSprites) {
        populateURLset(objectSprites[key], urlSet);
    }

    let imageData = creator.preloadedImages;
    let imagesLoaded = 0;
    let imagesToLoad = urlSet.size;

    urlSet.forEach(function(urlStr){

        let preloadedImage = document.createElement("img");
        preloadedImage._relativeSrc = urlStr;
    
        preloadedImage.addEventListener("load", function(){
    
            imagesLoaded++;
    
            let canvas = document.createElement("canvas");
            let ctx = canvas.getContext("2d");
    
            canvas.width = this.width;
            canvas.height = this.height;
    
            ctx.drawImage(this,0,0);
    
            imageData.set(this._relativeSrc, canvas);

            if(imagesLoaded === imagesToLoad) {
                onload(imageData);
            }
    
        });

        preloadedImage.addEventListener("error", function(error){
            onerror(error);
        })

        preloadedImage.src = urlStr;
    
    });
}

//preloadSpriteImages(function(o) { console.log(o); generateDefinitionHTML(); }, function(e) { console.log(e) })

// Objects that will be used for storing cache

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

export function generatePreviewCanvas(img) {

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

        //var img = new Image();

        //img.onerror = function() {
        //    this._broken = true;
        //}

        //img.src = sprite;
        //definition.svgSprite = img;

        //img.addEventListener("load", function(){
        //    definition.gridDividesX = (img.width % creator.gridSize === 0);
        //    definition.gridDividesY = (img.height % creator.gridSize === 0);
        //    elm.appendChild(generatePreviewCanvas(img));
        //});

        //img.draggable = false;

        definition.svgSprite = creator.preloadedImages.get(sprite)
        elm.appendChild(definition.svgSprite);

    }

    // Simple stack of images

    else if(typeof sprite === "object" && Array.isArray(sprite.stack) ){
        
        let canvas = document.createElement("canvas");

        let ctx = canvas.getContext("2d");

        canvas.width = sprite.width;
        canvas.height = sprite.height;

        for(let i = 0; i < sprite.stack.length; i++) {

            let img;
            let ct;

            if(typeof sprite.stack[i] === "string") {
                img = creator.preloadedImages.get(sprite.stack[i]);
            }

            if(typeof sprite.stack[i] === "object" && typeof sprite.stack[i].src === "string") {
                img = creator.preloadedImages.get(sprite.stack[i].src);
            }

            /*if(typeof sprite.stack[i] === "object" && typeof sprite.stack[i].width === "number") {
                img.width = sprite.stack[i].width;
            }

            if(typeof sprite.stack[i] === "object" && typeof sprite.stack[i].height === "number") {
                img.height = sprite.stack[i].height;
            }*/

            if(typeof sprite.stack[i] === "object" && typeof sprite.stack[i].colorTransform === "object" ) {
                
                ct = new CanvasColorTransformFixedPoint();

                ct.redAddTerm = sprite.stack[i].colorTransform.redAddTerm;
                ct.blueAddTerm = sprite.stack[i].colorTransform.blueAddTerm;
                ct.greenAddTerm = sprite.stack[i].colorTransform.greenAddTerm;
                ct.alphaAddTerm = sprite.stack[i].colorTransform.alphaAddTerm,

                ct.redMultTerm = sprite.stack[i].colorTransform.redMultTerm;
                ct.greenMultTerm = sprite.stack[i].colorTransform.greenMultTerm;
                ct.blueMultTerm = sprite.stack[i].colorTransform.blueMultTerm;
                ct.alphaMultTerm = sprite.stack[i].colorTransform.alphaMultTerm;

            }

            /*img.addEventListener("load", function(){

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

            });*/


            // Copy image to canvas

            let imgCanvas = document.createElement("canvas");
            let imgCanvasCtx = imgCanvas.getContext("2d");

            imgCanvas.width = img.width;
            imgCanvas.height = img.height;

            imgCanvasCtx.drawImage(img, 0, 0);

            // Perform any color transformations that are defined

            if(ct) {

                ct.applyToUntransformedCanvas(
                    imgCanvasCtx
                );

            } 
          
            ctx.drawImage(
                imgCanvas,
                canvas.width / 2 - imgCanvas.width / 2,
                canvas.height / 2 - imgCanvas.height / 2
            );


        }

        definition.svgSprite = canvas;

        elm.appendChild(generatePreviewCanvas(canvas));

    }

    else if(typeof sprite === "object" && typeof sprite.src === "string") {

        let img = creator.preloadedImages.get(sprite.src);
        let canvas = document.createElement("canvas");

        // Used for turning sprite by 90 degrees or so

        let scaleX = sprite.scaleX || 1
        let scaleY = sprite.scaleY || 1

        let ctx = canvas.getContext("2d");

        definition.svgSprite = canvas;

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

       /** let img = new Image();

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

        });**/

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