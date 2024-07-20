import dictionary from "../definitions/definitions.js"
import creator from "./creator.js";
import objectSprites from "./objectSprites.js";
import { CanvasColorTransformFixedPoint } from "./colorTransforms.js";

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

            document.body.innerText = "Loading Sprites: " + imagesLoaded + "/" + imagesToLoad;

        });

        preloadedImage.addEventListener("error", function(error){
            onerror(error);
        })

        preloadedImage.src = urlStr;
    
    });
}

export function generateSprite(spriteDefinition) {

    if(typeof spriteDefinition === "string") {
        return creator.preloadedImages.get(spriteDefinition)
    }

    else if(typeof spriteDefinition === "object" && Array.isArray(spriteDefinition.stack) ){
        
        let canvas = document.createElement("canvas");

        let ctx = canvas.getContext("2d");

        canvas.width = spriteDefinition.width;
        canvas.height = spriteDefinition.height;

        for(let i = 0; i < spriteDefinition.stack.length; i++) {

            let img;
            let ct;

            if(typeof spriteDefinition.stack[i] === "string") {
                img = creator.preloadedImages.get(spriteDefinition.stack[i]);
            }

            if(typeof spriteDefinition.stack[i] === "object" && typeof spriteDefinition.stack[i].src === "string") {
                img = creator.preloadedImages.get(spriteDefinition.stack[i].src);
            }

            if(typeof spriteDefinition.stack[i] === "object" && typeof spriteDefinition.stack[i].colorTransform === "object" ) {
                
                ct = new CanvasColorTransformFixedPoint();

                ct.redAddTerm = spriteDefinition.stack[i].colorTransform.redAddTerm;
                ct.blueAddTerm = spriteDefinition.stack[i].colorTransform.blueAddTerm;
                ct.greenAddTerm = spriteDefinition.stack[i].colorTransform.greenAddTerm;
                ct.alphaAddTerm = spriteDefinition.stack[i].colorTransform.alphaAddTerm,

                ct.redMultTerm = spriteDefinition.stack[i].colorTransform.redMultTerm;
                ct.greenMultTerm = spriteDefinition.stack[i].colorTransform.greenMultTerm;
                ct.blueMultTerm = spriteDefinition.stack[i].colorTransform.blueMultTerm;
                ct.alphaMultTerm = spriteDefinition.stack[i].colorTransform.alphaMultTerm;

            }

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

        return canvas;

    }

    else if(typeof spriteDefinition === "object" && typeof spriteDefinition.src === "string") {

        let img = creator.preloadedImages.get(spriteDefinition.src);
        let canvas = document.createElement("canvas");

        // Used for turning sprite by 90 degrees or so

        let scaleX = spriteDefinition.scaleX || 1
        let scaleY = spriteDefinition.scaleY || 1

        let ctx = canvas.getContext("2d");

        canvas.width = spriteDefinition.width || img.width;
        canvas.height = spriteDefinition.height || img.height;

        ctx.translate(canvas.width * 0.5, canvas.height * 0.5);

        ctx.scale(scaleX, scaleY);

        ctx.drawImage(
            img,
             - img.width / 2,
             - img.height / 2 
        );

        return canvas;

    }

    else if(spriteDefinition instanceof HTMLCanvasElement) {
        return spriteDefinition;
    }
}

// Objects that will be used for storing cache

let a = dictionary.objects.playobj

for(var i = 0; i < a.length; i++) {

    // Get id

    let id = a[i]["@_cid"];

    // Assign objectID to dictionary entry
    definitionTree[id] = a[i];

    // Create category if it does not exist
    if(!definitionTree.categories[a[i]["@_ctype"]]) {
        definitionTree.categories[a[i]["@_ctype"]] = []
    }

    // Put object definition in category
    definitionTree.categories[a[i]["@_ctype"]].push(a[i]);

    // Get sprite

}

export function generateSprites() {

    a.forEach(function(o){

        let id = o["@_cid"];

        if(objectSprites[id]) {
            definitionTree[id].spriteDefinition = objectSprites[id]
            document.body.innerText = "Generating sprite #" + id;
            definitionTree[id].svgSprite = generateSprite(objectSprites[id]);
        };

    })

}