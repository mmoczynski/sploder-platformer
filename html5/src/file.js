import creator from "./creator.js";
import Game from "./game.js";
import Modal from "./modal.js";

/**
 * Download XML save file
 *  
 */

export function downloadXML(gamename) {

    var e = document.createElement("a");
    var text = new XMLSerializer().serializeToString(creator.gameInstance.xmlDocument);

    e.href = URL.createObjectURL(new Blob([text], {
        type: "application/xml"
    }));

    e.download = gamename + ".xml";
    e.click();

}

export function createBlankFile() {
    let s = `<project title="" comments="1" bitview="0" id="noid-unsaved-project" mode="2" date="Saturday, March 16, 2024" pubkey="" isprivate="0" fast="0" g="1" author="demo"><levels id="levels"><level name="" music="" avatar="0" env="8,6600cc,333333,100">3,210,210|3,90,90|3,30,30|3,150,150|3,270,270|3,330,330|3,390,330|3,450,330|3,390,270|3,390,210|1,-329,239</level></levels><graphics /><textures lastid="0" /></project>`;
    creator.gameInstance = Game.createFromXMLString(s);
}

document.querySelector("#new-game-menu-item").addEventListener("click", function(){

    Modal.confirm(
        "Creating a new game will erase any unsaved game you are working on. Do you want to do this?",
        createBlankFile
    );

});

document.querySelector("#save-game-as-menu-item").addEventListener("click", function(){

    Modal.prompt("Please enter in the game name to download XML file:", function(gamename){
        downloadXML(gamename)
    });

});

document.querySelector("#test-game-menu-item").addEventListener("click", function(){
    Modal.alert("Testing games is not available right now.");
});

document.querySelector("#publish-game-menu-item").addEventListener("click", function(){
    Modal.alert("Publishing games is not available right now.");
});

document.querySelector("#load-game-menu-item").addEventListener("click", function(){

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
    

});