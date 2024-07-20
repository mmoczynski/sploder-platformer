import creator from "../creator.js";

function generateRightButton(id, hoverText, onclick) {

    let b = document.createElement("span");

    b.addEventListener("mouseover", function(){
        document.querySelector("#mouse-info").innerText = hoverText
    });

    b.addEventListener("click", onclick);

    b.className = "right-button";
    b.id = id;
    return b;

}

const rightButtons = document.createElement("div");
rightButtons.id = "right-buttons";

rightButtons.append(

    generateRightButton(

        "delete-selection",
        "Click to delete the selected objects",

        function() {
            for(let i = 0; i < creator.selectedObjects.length; i++) {
                creator.gameInstance.level.deleteObject(creator.selectedObjects[i]);
            }
        }

    ),

    generateRightButton(

        "activate-viewport-transform",
        "Click to make it so dragging the mouse drags the playfield",

        function() {
            creator.mouseTool = "transform-viewport";
        }

    ),

    generateRightButton(

        "activate-object-transform", 
        "Click to make it so dragging the mouse creates a rectangle that selects objects inside it",

        function() {
            creator.mouseTool = "select-objects";
        }

    ),

    generateRightButton(

        "zoom-in", 
        "Click to zoom in playfield",

        function() {
            creator.zoomFactor += 0.1
        }
        
    ),

    generateRightButton(

        "zoom-out", 
        "Click to zoom out playfield",
        
        function() {
            creator.zoomFactor -= 0.1
        }

    ),

    generateRightButton(
        "reset-delta", 
        "Click to see all of playfield",
        function() {}
    ),

    generateRightButton(
        "settings", 
        "Click to edit level background and colors.",
        function() {}
    )

)


export default rightButtons;