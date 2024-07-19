import creator from "./creator.js";
import Modal from "./modal.js";

/**
 * Options for top menu
 */

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