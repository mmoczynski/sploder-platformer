/**
 * This is a port of some of the functions from the client/GameLevel.as script
 */


import { definitionTree } from "./definitionTree.js";
import Ghost from "./ghost.js";
import { selectionMenu } from "./ui/levelEditingMenu.js";

/**
 * 
 * @param {Game} game 
 * @param {Element} levelNode 
 */

export function GameLevel(game,levelNode) {

    this.game = game;

    /**
     * @type {Element}
     */

    this.levelNode = levelNode;

    levelNode._levelObject = this;

    // Option html element for level selection menu

    this.selectionOption = document.createElement("option");
    this.selectionOption.innerHTML = "Level " + (selectionMenu.children.length + 1);
    this.selectionOption._gameLevel = this;

    selectionMenu.appendChild(this.selectionOption);

    this.objects = [];
    this.populateGame();

    this.env = this.levelNode.getAttribute("env").split(",");

    let self = this;

    // Music information
    this.musicInfo = this.levelNode.getAttribute("music");

    Object.defineProperties(this,{

        // Integer representing background image
        bgImage: self.defineEnvProperty(0),

        // RGB string representing sky color
        skyColor: self.defineEnvProperty(1),

        // Ground color
        groundColor: self.defineEnvProperty(2),

        // Value between 0 and 100 representing brightness
        brightness: self.defineEnvProperty(3),

        name: {

            get: function() {
                return self.levelNode.getAttribute("name")
            },

            set: function(value) {
                return self.levelNode.setAttribute("name", value);
            }

        },

        avatar: {

            get: function() {
                return self.levelNode.getAttribute("avatar")
            },

            set: function(value) {
                return self.levelNode.setAttribute("avatar", value);
            }

        }
    });

}

GameLevel.prototype.deleteObject = function(object) {
    return this.objects.splice(
        this.objects.indexOf(object),
        1
    );
}

/**
 * 
 * @param {*} index - Index for XML env property argument
 * @returns {PropertyDescriptorMap & ThisType<any>}
 */

GameLevel.prototype.defineEnvProperty = function(index) {

    let self = this;

    return {

        get: function() {
            return self.env[index];
        },

        set: function(value) {
            self.env[index] = value;
            self.levelNode.setAttribute("env", self.env.join(","))
        }

    }
}

GameLevel.prototype.populateGame = function (str) {

    /**
     * Get contents of level object in XML.
     * Since the objects are seperated by a pipe symbol, the contents should be split by that symbol
     * into an array of strings representing
     */

    var objectStrings = this.levelNode.innerHTML.split("|");

    for(var i = 0; i < objectStrings.length; i++) {
        if(objectStrings[i].includes(",")) {
            this.objects.push(new GameObject(...objectStrings[i].split(",")));
        }
    }
}

/**
 * @param {...Integer} 
 * @param x - X
 */

export function GameObject() {

    let self = this;

    /**
     * Split attributes of objects.
     * These are seperated by commas.
     * 
     * For example, "1,30,30" is used to define the player (objectID is 1 for player) at position (30,30)
     * 
     */

    this.data = Array.from(arguments);

    // Get type of object
    //let objectID = parseInt(objectArguments[0]);

    // Category object

    /*

      data: objectStrings[i].split(","),

    // Get x coordinate
    let x = parseInt(objectArguments[1]);

    // Get y coordinate
    let y = parseInt(objectArguments[2]);

    // Get rotation
    let rotation = parseInt(objectArguments[3]) * DEGREES_TO_RADIANS;

    */

    // Get tile ID
    /*let tileID = undefined;

    if(objectArguments.length > 3) {
        tileID = parseInt(objectArguments[4]);
    }*/

    // Get graphics information

    /*let graphic = undefined;
    let graphicVersion = undefined;
    let graphicAnimation = undefined;

    if(objectArguments.length > 4) {
        graphic = parseInt(objectArguments[5]);
        graphicVersion = parseInt(objectArguments[6]);
        graphicAnimation = parseInt(objectArguments[7]);
    }*/

    Object.defineProperties(this, {
        objectID: self.defineArgumentInteger(0),
        x: self.defineArgumentInteger(1),
        y: self.defineArgumentInteger(2),
        rotation: self.defineArgumentInteger(3),
        tileID: self.defineArgumentInteger(4),
        graphic: self.defineArgumentInteger(5),
        graphicVersion: self.defineArgumentInteger(6),
        graphicAnimation: self.defineArgumentInteger(7),
    });

    this.objectClass = definitionTree[this.objectID]
    
    if(this.objectClass._svgSprite) this.ghost = new Ghost(this);
    
}

GameObject.prototype.defineArgumentInteger = function(index) {
    
    let self = this;

    return {

        get: function() {
            return parseInt(self.data[index])
        },

        set: function(value) {
            self.data[index] = value
        }
    }
}

GameObject.prototype.getDefinitionObject = function() {
    return definitionTree[this.objectID];
}

GameObject.prototype.toString = function() {
    return this.data.join(",");
}

GameObject.prototype.worldPointInObject = function(x, y) {

    if(!this.objectClass._svgSprite) return false;

    var width = this.objectClass._svgSprite.width;
    var height = this.objectClass._svgSprite.height;

    var bottomRightCornerX = this.x - width * 0.5;
    var bottomRightCornerY = this.y - height * 0.5;

    var inXinterval = bottomRightCornerX < x && x < bottomRightCornerX + width;
    var inYinterval = bottomRightCornerY < y && y < bottomRightCornerY + height; 
    
    return inXinterval && inYinterval;
}