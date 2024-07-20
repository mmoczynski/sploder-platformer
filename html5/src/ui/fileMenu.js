import creator from "../creator.js";
import { createBlankFile } from "../file.js";
import Game from "../game.js";
import Modal from "../modal.js";

/**
 * Download XML save file
 *  
 */

function downloadXML(gamename) {

    var e = document.createElement("a");
    var text = new XMLSerializer().serializeToString(creator.gameInstance.xmlDocument);

    e.href = URL.createObjectURL(new Blob([text], {
        type: "application/xml"
    }));

    e.download = gamename + ".xml";
    e.click();

}

function generateFileMenuOption(innerText, id, onclick) {

    let e = document.createElement("li");
    e.addEventListener("click", onclick)
    e.id = id;
    e.innerText = innerText;

    return e;
}

const fileMenu = document.createElement("ul");

fileMenu.className = "file-menu" 
fileMenu.id = "menu"

fileMenu.append(

    // New file button

    generateFileMenuOption("New", "new-game-menu-item", function(){

        Modal.confirm(
            "Creating a new game will erase any unsaved game you are working on. Do you want to do this?",
            createBlankFile
        );
    
    }),

    // Load file button

    generateFileMenuOption("Load",  "load-game-menu-item", function(){

        var fileForm = document.createElement("input");
        fileForm.type = "file";
        fileForm.click();
    
        fileForm.addEventListener("change", function(){
    
            // File reader: https://developer.mozilla.org/en-US/docs/Web/API/FileReader
    
            var fileReader = new FileReader();
    
            // When file reader is complete
    
            fileReader.addEventListener("load", function(){
                creator.gameInstance = Game.createFromXMLString(fileReader.result);
            });
    
            // Start file reader
    
            fileReader.readAsText(fileForm.files[0]);
    
        });
        
    
    }),

    // Save button

    generateFileMenuOption("Save", "save-game-menu-item", function(){

        Modal.prompt("Please enter in the game name to download XML file:", function(gamename){
            downloadXML(gamename)
        });
    
    }),

    // Same game as button

    generateFileMenuOption("Save As", "save-game-as-menu-item", function() {} ),

    // Test game button

    generateFileMenuOption("Test", "test-game-menu-item", function(){
        Modal.alert("Testing games is not available right now.");
    }),

    // Publish game button

    generateFileMenuOption("Publish", "publish-game-menu-item", function(){
        Modal.alert("Publishing games is not available right now.");
    }),

)

export default fileMenu;