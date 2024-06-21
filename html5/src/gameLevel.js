/**
 * This is a port of some of the functions from the client/GameLevel.as script
 */


import definitionTree from "./definitionTree";

const DEGREES_TO_RADIANS = 0;

function GameLevel(game,levelNode) {
    this.game = game;
    this.levelNode = levelNode;
    this.objects = [];
    this.populateGame();

    // Enviornment argument array
    this.envArgs = this.levelNode.getAttribute("env").split(",");

    // Integer representing background image
    this.bgImage = parseInt(this.envArgs[0]);

    // RGB string representing sky color
    this.skyColor = this.envArgs[1];

    // Ground color
    this.groundColor = this.envArgs[2];

    // Value between 0 and 100 representing brightness
    this.brightness = parseInt(this.envArgs[3]);

    // Level name
    this.name = this.levelNode.getAttribute("name");

    // Avatar for player
    this.avatar = parseInt(this.levelNode.getAttribute("avatar"));

    // Music information
    this.musicInfo = this.levelNode.getAttribute("music");
}

GameLevel.prototype.populateGame = function (str) {

    /**
     * Get contents of level object in XML.
     * Since the objects are seperated by a pipe symbol, the contents should be split by that symbol
     * into an array of strings representing
     */

    var objectStrings = this.levelNode.innerHTML.split("|");

    for(var i = 0; i < objectStrings.length; i++) {

        /**
         * Split attributes of objects.
         * These are seperated by commas.
         * 
         * For example, "1,30,30" is used to define the player (objectID is 1 for player) at position (30,30)
         * 
         */

        let objectArguments = objectStrings[i].split(",");

        // Get type of object
        let objectID = parseInt(objectArguments[0]);

        // Category object

        let category = definitionTree[objectID];

        // Get x coordinate
        let x = parseInt(objectArguments[1]);

        // Get y coordinate
        let y = parseInt(objectArguments[2]);

        // Get rotation
        let rotation = parseInt(objectArguments[3]) * DEGREES_TO_RADIANS;

        // Get tile ID
        let tileID = undefined;

        if(objectArguments.length > 3) {
            tileID = parseInt(objectArguments[4]);
        }

        // Get graphics information

        let graphic = undefined;
        let graphicVersion = undefined;
        let graphicAnimation = undefined;

        if(objectArguments.length > 4) {
            graphic = parseInt(objectArguments[5]);
            graphicVersion = parseInt(objectArguments[6]);
            graphicAnimation = parseInt(objectArguments[7]);
        }

        let o = {
            objectID: objectID,
            category: category,
            x: x,
            y: y,
            rotation: rotation,
            tileID: tileID,
            graphic: graphic,
            graphicVersion: graphicVersion,
            graphicAnimation: graphicAnimation,
            data: objectStrings[i].split(","),
        }

        /**
         * Convert back to xml data string
         * @returns string
         */

        o.toString = function() {
            let str = this.objectID + "," + this.x + "," + this.y;
            return str;
        }

        this.objects.push(o)

    }
}

export default GameLevel;