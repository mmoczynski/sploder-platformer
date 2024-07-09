import creator from "./creator.js";
import Modal from "./modal.js";

/**
 * Options for top menu
 */


document.querySelector("#load-game-menu-item").addEventListener("click", function(){

});

document.querySelector("#save-game-menu-item").addEventListener("click", function(){

});

document.querySelector("#save-game-as-menu-item").addEventListener("click", function(){

});

document.querySelector("#new-game-menu-item").addEventListener("click", function(){
    Modal.confirm("Creating a new game will erase any unsaved game you are working on. Do you want to do this?")
});

document.querySelector("#test-game-menu-item").addEventListener("click", function(){
    Modal.alert("Testing games is not available right now.");
});

document.querySelector("#publish-game-menu-item").addEventListener("click", function(){
    Modal.alert("Publishing games is not available right now.");
});

document.querySelector("#rename-level-button").addEventListener("click", function(){

    Modal.prompt(

        "Enter in new name for level:", 

        function(input) {
            creator.gameInstance.level.name = input;
        }, 

        function() {}, 

        creator.gameInstance.level.name

    );

});