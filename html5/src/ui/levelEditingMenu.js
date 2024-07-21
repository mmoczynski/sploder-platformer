import creator from "../creator.js";
import Modal from "../modal.js";

function generateLevelEditingButton(id, onclick) {
    var b = document.createElement("li");
    b.className = "level-editing-button";
    b.id = id;
    b.addEventListener("click", onclick)
    return b;
}

export const levelEditingMenu = document.createElement("ul");

levelEditingMenu.id = "level-editing-menu";

// Selection menu

export const selectionMenuItem = document.createElement("li");

levelEditingMenu.appendChild(selectionMenuItem);

export const selectionMenu = document.createElement("select");
selectionMenu.id = "level-selection";
selectionMenuItem.appendChild(selectionMenu);

selectionMenu.addEventListener("change", function(){
    creator.gameInstance.level = selectionMenu.selectedOptions[0]._gameLevel;
})

// Level editing buttons

levelEditingMenu.append(

    generateLevelEditingButton("add-level-button", function() {
        creator.gameInstance.createLevel();
    }),

    generateLevelEditingButton("remove-level-button", function() {

    }),

    generateLevelEditingButton("move-level-up-button", function() {

    }),

    generateLevelEditingButton("clone-level-button", function() {

    }),

    generateLevelEditingButton("rename-level-button", function() {

        Modal.prompt(
    
            "Enter in new name for level:", 
    
            function(input) {
                creator.gameInstance.level.name = input;
            }, 
    
            function() {}, 
    
            creator.gameInstance.level.name
    
        );

    }),

)

// Music Button

let musicSelectionButton = document.createElement("li");
musicSelectionButton.id = "music-selection-button";
levelEditingMenu.appendChild(musicSelectionButton);

// Selection count

let selectionCount = document.createElement("li");
selectionCount.id = "selection-count";
levelEditingMenu.appendChild(selectionCount);

// Graphics button

let graphics = document.createElement("li");
graphics.id = "graphics-button";
levelEditingMenu.appendChild(graphics);



//levelEditingMenu.querySelector("#rename-level-button").addEventListener("click", );