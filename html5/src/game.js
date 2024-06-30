import {GameLevel} from "./gameLevel.js";

/**
 * This library is a partial port of the Game.as file created by Geoff.
 * 
 */

/**
 * 
 * @param {XMLDocument} xmlDocument 
 */

function Game(xmlDocument) {
    this.xmlDocument = xmlDocument;
    this.level = new GameLevel(this,this.xmlDocument.getElementsByTagName("level")[0]);
    this.extractGraphicsFromXMLDocument();
}

Game.createFromXMLString = function(str) {
    let domParser = new DOMParser();
    return new Game(domParser.parseFromString(str,"text/xml"));
}

Game.prototype.convertOldXMLToNew = function() {

}

Game.prototype.extractGraphicsFromXMLDocument = function() {

    let graphicsNodes = this.xmlDocument.getElementsByTagName("graphic");

    this.graphics = [];
    
    for(var i = 0; i < graphicsNodes.length; i++) {

        let byteArr = [];

        let binStr = atob(graphicsNodes[i].innerHTML);

        for(var j = 0; j < binStr.length; j++) {
            byteArr.push(binStr.charCodeAt(j))
        }

        let uint8arr = new Uint8Array(byteArr);

        let blob = new Blob([uint8arr],{
            type: "image/png"
        });

        let img = document.createElement("img");
        img.src = URL.createObjectURL(blob);

        this.graphics.push({
            htmlElement: img,
            xmlNode: graphicsNodes[i],
            name: graphicsNodes[i].getAttribute("name"),
            size: img.height,
            frameCount: img.width / img.height 
        });

    }

}

Game.prototype.selectLevelByIndex = function(i) {
    this.level = new GameLevel(this,this.xmlDocument.getElementsByTagName("level")[i]);
}

export default Game;