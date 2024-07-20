import creator from "../creator.js";
import Modal from "../modal.js";

function generateLevelEditingButton(id) {
    var b = document.createElement("li");
    b.className = "level-editing-button";
    b.id = id;
    return b;
}

const levelEditingMenu = document.createElement("ul");

levelEditingMenu.id = "level-editing-menu";

// Selection menu

let selectionMenuItem = document.createElement("li");
levelEditingMenu.appendChild(selectionMenuItem);

let selectionMenu = document.createElement("select");
selectionMenu.id = "level-selection";
selectionMenuItem.appendChild(selectionMenu);

// Level editing buttons

levelEditingMenu.append(
    generateLevelEditingButton("add-level-button"),
    generateLevelEditingButton("remove-level-button"),
    generateLevelEditingButton("move-level-up-button"),
    generateLevelEditingButton("clone-level-button"),
    generateLevelEditingButton("rename-level-button"),
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



levelEditingMenu.querySelector("#rename-level-button").addEventListener("click", function(){

    Modal.prompt(

        "Enter in new name for level:", 

        function(input) {
            creator.gameInstance.level.name = input;
        }, 

        function() {}, 

        creator.gameInstance.level.name

    );

});

export default levelEditingMenu;