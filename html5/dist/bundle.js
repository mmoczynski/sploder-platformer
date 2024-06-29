/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./html5/src/creator.js":
/*!******************************!*\
  !*** ./html5/src/creator.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Creator object

const creator = {
    gridSize: 60,
    zoomFactor: 1,
    deltaX: 0,
    deltaY: 0,

    debugConfig: {
        enabled: true,
        selectedPointValue: 10
    },


    /**
     * @type {"select-objects"|"select-objects"}
     */

    mouseTool: "select-objects",

    canvas: document.querySelector("#main-canvas"),

    /**
    * Variable to see if there exists a selected object that is pointed to by mouse
    * If it does exist, then this is set to true in the object loop.
    * Otherwise, it is kept as "false"
    */

    selectedObjectPointedToExists: false,

    /**
     * Array of selected objects
     * @type {GameObject[]}
     */

    selectedObjects: [],

    selectionRect: {
        topLeft: null,
        bottomRight: null,
    },

    mousePosition: {

        /**
         * @type {GameObject[]}
         */

        objectsInGrid: [],

        /**
         * @type {GridCell|null}
         */

        gridCell: null
    },

    leadObject: {

        /**
         * @type {GameObject|Null}
         */

        object: null,

        offset: {
            x: null,
            y: null
        }

    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (creator);

/***/ }),

/***/ "./html5/src/definitionTree.js":
/*!*************************************!*\
  !*** ./html5/src/definitionTree.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _definitions_definitions_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../definitions/definitions.json */ "./html5/definitions/definitions.json");


const definitionTree = {
    categories: {}
}

function Sprite(objectID) {

    /**
     * @type {HTMLImageElement[]}
     */

    this.frames = [];

    /**
     * Width
     */
    this.width = width;

    /**
     * Height
     */

    this.height = height;

    this.objectID = objectID;
}



let a = _definitions_definitions_json__WEBPACK_IMPORTED_MODULE_0__.objects.playobj

for(var i = 0; i < a.length; i++) {

    // Assign objectID to dictionary entry
    definitionTree[a[i]["@_cid"]] = a[i];

    // Create category if it does not exist
    if(!definitionTree.categories[a[i]["@_ctype"]]) {
        definitionTree.categories[a[i]["@_ctype"]] = []
    }

    // Put object definition in category
    definitionTree.categories[a[i]["@_ctype"]].push(a[i]);

    
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (definitionTree);

/***/ }),

/***/ "./html5/src/game.js":
/*!***************************!*\
  !*** ./html5/src/game.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _gameLevel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameLevel */ "./html5/src/gameLevel.js");


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
    this.level = new _gameLevel__WEBPACK_IMPORTED_MODULE_0__["default"](this,this.xmlDocument.getElementsByTagName("level")[0]);
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
    this.level = new _gameLevel__WEBPACK_IMPORTED_MODULE_0__["default"](this,this.xmlDocument.getElementsByTagName("level")[i]);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Game);

/***/ }),

/***/ "./html5/src/gameLevel.js":
/*!********************************!*\
  !*** ./html5/src/gameLevel.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _definitionTree__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./definitionTree */ "./html5/src/definitionTree.js");
/**
 * This is a port of some of the functions from the client/GameLevel.as script
 */




/**
 * 
 * @param {Game} game 
 * @param {Element} levelNode 
 */

function GameLevel(game,levelNode) {

    this.game = game;

    /**
     * @type {Element}
     */

    this.levelNode = levelNode;
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
    });

    this.name = this.levelNode.getAttribute("name");

    this.avatar = this.levelNode.getAttribute("avatar");
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
        this.objects.push(new GameObject(...objectStrings[i].split(",")));
    }
}

/**
 * @param {...Integer} 
 * @param x - X
 */

function GameObject() {

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
    return _definitionTree__WEBPACK_IMPORTED_MODULE_0__["default"][this.objectID];
}

GameObject.prototype.toString = function() {
    return this.data.join(",");
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GameLevel);

/***/ }),

/***/ "./html5/src/generateDefinitionsHTML.js":
/*!**********************************************!*\
  !*** ./html5/src/generateDefinitionsHTML.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _definitionTree__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./definitionTree */ "./html5/src/definitionTree.js");


function createMenuItem(definition) {

    var elm = document.createElement("div");
    elm.classList.add("object");

    var span = document.createElement("span");
    span.innerText = definition["@_cname"];
    elm.appendChild(span);

    return elm;
}

function changeSelectionClass(targetElement) {
    var oldElm = document.querySelector("#navigation").querySelector(".selected");
    oldElm.classList.remove("selected");
    targetElement.classList.add("selected");
}

function generateDefintionsHTML() {

    var o = {
        blocks_and_tiles: document.createElement("div"),
        walls_and_decoration: document.createElement("div"),
        switches_and_doors: document.createElement("div"),
        powerups: document.createElement("div"),
        hazards: document.createElement("div")
    };

    for(let i = 0; i < _definitionTree__WEBPACK_IMPORTED_MODULE_0__["default"].categories.block.length; i++) {

        var elm = createMenuItem(_definitionTree__WEBPACK_IMPORTED_MODULE_0__["default"].categories.block[i]);

        // Closure for 

        (function(e) {

            e.addEventListener("mousedown", function(){

                var newElm = document.createElement("img");
                newElm.style.position = "absolute";
                newElm.src = "799.svg";
                newElm.style.zIndex = 300;

                document.body.appendChild(newElm);

                var move = function(event){
                    newElm.style.left = event.x + "px";
                    newElm.style.top = event.y + "px";
                }

                var disable = function() {
                    document.body.removeEventListener("mousemove", move);
                    document.body.removeEventListener("mouseup", disable);
                    document.body.removeChild(newElm);
                }

                document.body.addEventListener("mousemove", move);
                document.body.addEventListener("mouseup", disable);

            });

            

        })(elm);

    
        o.blocks_and_tiles.appendChild(elm);

    }

    for(let i = 0; i < _definitionTree__WEBPACK_IMPORTED_MODULE_0__["default"].categories.blockbehind.length; i++) {
        o.walls_and_decoration.appendChild(createMenuItem(_definitionTree__WEBPACK_IMPORTED_MODULE_0__["default"].categories.blockbehind[i]));
    }

    for(let i = 0; i < _definitionTree__WEBPACK_IMPORTED_MODULE_0__["default"].categories.trigger.length; i++) {
        o.switches_and_doors.appendChild(createMenuItem(_definitionTree__WEBPACK_IMPORTED_MODULE_0__["default"].categories.trigger[i]));
    }

    for(let i = 0; i < _definitionTree__WEBPACK_IMPORTED_MODULE_0__["default"].categories.powerup.length; i++) {
        o.powerups.appendChild(createMenuItem(_definitionTree__WEBPACK_IMPORTED_MODULE_0__["default"].categories.powerup[i]));
    }

    for(let i = 0; i < _definitionTree__WEBPACK_IMPORTED_MODULE_0__["default"].categories.hazard.length; i++) {
        o.hazards.appendChild(createMenuItem(_definitionTree__WEBPACK_IMPORTED_MODULE_0__["default"].categories.hazard[i]));
    }

    // Event Listener for Blocks and Tiles

    document.querySelector(".obj-menu-item.blocks-and-tiles").addEventListener("click", function(){
        document.querySelector("#elements").innerHTML = "";
        document.querySelector("#elements").appendChild(o.blocks_and_tiles);
        changeSelectionClass(this);
        o.blocks_and_tiles.scrollTo(0,-temp1.scrollTop);
    });

    document.querySelector(".obj-menu-item.walls-and-decoration").addEventListener("click", function(){
        document.querySelector("#elements").innerHTML = "";
        document.querySelector("#elements").appendChild(o.walls_and_decoration);
        changeSelectionClass(this);
    });

    document.querySelector(".obj-menu-item.switches-and-doors").addEventListener("click", function(){
        document.querySelector("#elements").innerHTML = "";
        document.querySelector("#elements").appendChild(o.switches_and_doors);
        changeSelectionClass(this);
    });

    document.querySelector(".obj-menu-item.powerups").addEventListener("click", function(){
        document.querySelector("#elements").innerHTML = "";
        document.querySelector("#elements").appendChild(o.powerups);
        changeSelectionClass(this);
    });

    document.querySelector(".obj-menu-item.enemies-and-hazards").addEventListener("click", function(){
        document.querySelector("#elements").innerHTML = "";
        document.querySelector("#elements").appendChild(o.hazards);
        changeSelectionClass(this);
    });

    return o;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (generateDefintionsHTML);

/***/ }),

/***/ "./html5/src/grid.js":
/*!***************************!*\
  !*** ./html5/src/grid.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GridCell: () => (/* binding */ GridCell)
/* harmony export */ });
/* harmony import */ var _creator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./creator */ "./html5/src/creator.js");
/* harmony import */ var _point__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./point */ "./html5/src/point.js");



function GridCell(x,y) {

    this.numberOfGridsX = Math.floor(x/_creator__WEBPACK_IMPORTED_MODULE_0__["default"].gridSize);

    this.numberofGridsY = Math.floor(y/_creator__WEBPACK_IMPORTED_MODULE_0__["default"].gridSize);


    this.bottomLeft = new _point__WEBPACK_IMPORTED_MODULE_1__.WorldPoint(
        this.numberOfGridsX * _creator__WEBPACK_IMPORTED_MODULE_0__["default"].gridSize,
        this.numberofGridsY * _creator__WEBPACK_IMPORTED_MODULE_0__["default"].gridSize,
    )

    this.bottomRight = new _point__WEBPACK_IMPORTED_MODULE_1__.WorldPoint(
        this.bottomLeft.x + _creator__WEBPACK_IMPORTED_MODULE_0__["default"].gridSize,
        this.bottomLeft.y
    )

    this.topLeft = new _point__WEBPACK_IMPORTED_MODULE_1__.WorldPoint(
        this.bottomLeft.x,
        this.bottomLeft.y + _creator__WEBPACK_IMPORTED_MODULE_0__["default"].gridSize
    )

    this.topRight = new _point__WEBPACK_IMPORTED_MODULE_1__.WorldPoint(
        this.bottomLeft.x + _creator__WEBPACK_IMPORTED_MODULE_0__["default"].gridSize,
        this.bottomLeft.y + _creator__WEBPACK_IMPORTED_MODULE_0__["default"].gridSize
    )

    this.center = new _point__WEBPACK_IMPORTED_MODULE_1__.WorldPoint(
        this.bottomLeft.x + _creator__WEBPACK_IMPORTED_MODULE_0__["default"].gridSize / 2,
        this.bottomLeft.y + _creator__WEBPACK_IMPORTED_MODULE_0__["default"].gridSize / 2
    )

}

GridCell.prototype.pointInGrid = function(x, y) {

    if( (this.bottomLeft.x < x && x < this.bottomLeft.x + _creator__WEBPACK_IMPORTED_MODULE_0__["default"].gridSize) && 
        (this.bottomLeft.y < y && y < this.bottomLeft.y + _creator__WEBPACK_IMPORTED_MODULE_0__["default"].gridSize)
    ) {
        return true;
    }

    else {
        return false;
    }

}

/***/ }),

/***/ "./html5/src/mouseTools.js":
/*!*********************************!*\
  !*** ./html5/src/mouseTools.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _creator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./creator */ "./html5/src/creator.js");
/* harmony import */ var _grid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./grid */ "./html5/src/grid.js");
/* harmony import */ var _point__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./point */ "./html5/src/point.js");




_creator__WEBPACK_IMPORTED_MODULE_0__["default"].canvas.addEventListener("mousemove",function(event){

    _creator__WEBPACK_IMPORTED_MODULE_0__["default"].mousePosition.canvasOffset = new _point__WEBPACK_IMPORTED_MODULE_2__.CanvasPoint(
        event.offsetX, 
        event.offsetY
    );

    if(_creator__WEBPACK_IMPORTED_MODULE_0__["default"].mouseTool === "transform-viewport" && !_creator__WEBPACK_IMPORTED_MODULE_0__["default"].mousePosition.objectsInGrid.length) {
         document.querySelector("#mouse-info").innerText = "Drag to move the playfield"
    }

    if(_creator__WEBPACK_IMPORTED_MODULE_0__["default"].mouseTool === "select-objects" && !_creator__WEBPACK_IMPORTED_MODULE_0__["default"].mousePosition.objectsInGrid.length) {
         document.querySelector("#mouse-info").innerText = "Drag to select objects"
    }

    if(_creator__WEBPACK_IMPORTED_MODULE_0__["default"].mousePosition.objectsInGrid.length && !_creator__WEBPACK_IMPORTED_MODULE_0__["default"].selectedObjects.length) {
         document.querySelector("#mouse-info").innerText = "Click to select object"
    }

});

/**
 * 
 * Mouse Tools
 */

function transformViewportByMouse(event) {
    _creator__WEBPACK_IMPORTED_MODULE_0__["default"].deltaX += event.movementX;
    _creator__WEBPACK_IMPORTED_MODULE_0__["default"].deltaY += event.movementY;
}

/**
 * A naive solution might be to transform objects by mouse delta.
 * However, in that method, if an object is shaked extremely fast, then it abnormally shifts.
 * This might be due to floating point numbers
 * Therefore, all objects transform in respect to one being moved to by the mouse.
 * 
 * @param {*} event 
 */

function transformObjByMouse(event) {

    let oldPos = new _point__WEBPACK_IMPORTED_MODULE_2__.WorldPoint(
        _creator__WEBPACK_IMPORTED_MODULE_0__["default"].leadObject.object.x,
        _creator__WEBPACK_IMPORTED_MODULE_0__["default"].leadObject.object.y
    )

    _creator__WEBPACK_IMPORTED_MODULE_0__["default"].leadObject.object.x = _creator__WEBPACK_IMPORTED_MODULE_0__["default"].mousePosition.world.x - _creator__WEBPACK_IMPORTED_MODULE_0__["default"].leadObject.offset.x;
    _creator__WEBPACK_IMPORTED_MODULE_0__["default"].leadObject.object.y = _creator__WEBPACK_IMPORTED_MODULE_0__["default"].mousePosition.world.y - _creator__WEBPACK_IMPORTED_MODULE_0__["default"].leadObject.offset.y;

    let dx = _creator__WEBPACK_IMPORTED_MODULE_0__["default"].leadObject.object.x - oldPos.x;
    let dy = _creator__WEBPACK_IMPORTED_MODULE_0__["default"].leadObject.object.y - oldPos.y;

    for(let i = 0; i < _creator__WEBPACK_IMPORTED_MODULE_0__["default"].selectedObjects.length; i++) {

        if(_creator__WEBPACK_IMPORTED_MODULE_0__["default"].selectedObjects[i] !== _creator__WEBPACK_IMPORTED_MODULE_0__["default"].leadObject.object) {
            _creator__WEBPACK_IMPORTED_MODULE_0__["default"].selectedObjects[i].x += dx;
            _creator__WEBPACK_IMPORTED_MODULE_0__["default"].selectedObjects[i].y += dy;
        }

    }
}

function changeSelectionRectByMouse() {
    _creator__WEBPACK_IMPORTED_MODULE_0__["default"].selectionRect.bottomRight.x = _creator__WEBPACK_IMPORTED_MODULE_0__["default"].mousePosition.canvasOffset.x
    _creator__WEBPACK_IMPORTED_MODULE_0__["default"].selectionRect.bottomRight.y = _creator__WEBPACK_IMPORTED_MODULE_0__["default"].mousePosition.canvasOffset.y
}

_creator__WEBPACK_IMPORTED_MODULE_0__["default"].selectionRect.bottomRight = null;

_creator__WEBPACK_IMPORTED_MODULE_0__["default"].leadObject.object = null;

_creator__WEBPACK_IMPORTED_MODULE_0__["default"].canvas.addEventListener("mousedown", function(event){

    /**
     * Note: Avoid overusing nested if-then statements to avoid hard to follow logic.
     *
 */

    if(_creator__WEBPACK_IMPORTED_MODULE_0__["default"].selectedObjectPointedToExists) {

        _creator__WEBPACK_IMPORTED_MODULE_0__["default"].canvas.addEventListener("mousemove", transformObjByMouse);

        _creator__WEBPACK_IMPORTED_MODULE_0__["default"].leadObject.object = _creator__WEBPACK_IMPORTED_MODULE_0__["default"].mousePosition.objectsInGrid[
            _creator__WEBPACK_IMPORTED_MODULE_0__["default"].mousePosition.objectsInGrid.length - 1
        ];
        
        _creator__WEBPACK_IMPORTED_MODULE_0__["default"].leadObject.offset.x = _creator__WEBPACK_IMPORTED_MODULE_0__["default"].mousePosition.world.x - _creator__WEBPACK_IMPORTED_MODULE_0__["default"].leadObject.object.x
        _creator__WEBPACK_IMPORTED_MODULE_0__["default"].leadObject.offset.y = _creator__WEBPACK_IMPORTED_MODULE_0__["default"].mousePosition.world.y - _creator__WEBPACK_IMPORTED_MODULE_0__["default"].leadObject.object.y

    }

    /**
     * Add objects to selectedObjects array or set array to singleton
     * array given that there are objects in gridcell pointed to by mouse
     * 
     */

    if(!_creator__WEBPACK_IMPORTED_MODULE_0__["default"].selectedObjectPointedToExists && _creator__WEBPACK_IMPORTED_MODULE_0__["default"].mousePosition.objectsInGrid.length) {

        if(event.shiftKey) {
            _creator__WEBPACK_IMPORTED_MODULE_0__["default"].selectedObjects.push(
                _creator__WEBPACK_IMPORTED_MODULE_0__["default"].mousePosition.objectsInGrid[_creator__WEBPACK_IMPORTED_MODULE_0__["default"].mousePosition.objectsInGrid.length - 1]
            )
        }

        else {
            _creator__WEBPACK_IMPORTED_MODULE_0__["default"].selectedObjects = [
                _creator__WEBPACK_IMPORTED_MODULE_0__["default"].mousePosition.objectsInGrid[_creator__WEBPACK_IMPORTED_MODULE_0__["default"].mousePosition.objectsInGrid.length - 1]
            ];
            //console.log("Selected Object Reset")
        }

    }

    if(!_creator__WEBPACK_IMPORTED_MODULE_0__["default"].selectedObjectPointedToExists && !_creator__WEBPACK_IMPORTED_MODULE_0__["default"].mousePosition.objectsInGrid.length) {

        _creator__WEBPACK_IMPORTED_MODULE_0__["default"].selectedObjects = [];

        if(_creator__WEBPACK_IMPORTED_MODULE_0__["default"].mouseTool === "transform-viewport") {
            _creator__WEBPACK_IMPORTED_MODULE_0__["default"].canvas.addEventListener("mousemove", transformViewportByMouse);
        }

        else if(_creator__WEBPACK_IMPORTED_MODULE_0__["default"].mouseTool === "select-objects") {

            _creator__WEBPACK_IMPORTED_MODULE_0__["default"].selectionRect.topLeft = new _point__WEBPACK_IMPORTED_MODULE_2__.CanvasPoint(
                _creator__WEBPACK_IMPORTED_MODULE_0__["default"].mousePosition.canvasOffset.x,
                _creator__WEBPACK_IMPORTED_MODULE_0__["default"].mousePosition.canvasOffset.y
            );

            _creator__WEBPACK_IMPORTED_MODULE_0__["default"].selectionRect.bottomRight = new _point__WEBPACK_IMPORTED_MODULE_2__.CanvasPoint(
                _creator__WEBPACK_IMPORTED_MODULE_0__["default"].mousePosition.canvasOffset.x,
                _creator__WEBPACK_IMPORTED_MODULE_0__["default"].mousePosition.canvasOffset.y
            );

            _creator__WEBPACK_IMPORTED_MODULE_0__["default"].canvas.addEventListener("mousemove", changeSelectionRectByMouse);

        }   

    }
        

});

window.addEventListener("mouseup", function(){

    // Disable mousemove events

    _creator__WEBPACK_IMPORTED_MODULE_0__["default"].canvas.removeEventListener("mousemove", transformViewportByMouse)
    _creator__WEBPACK_IMPORTED_MODULE_0__["default"].canvas.removeEventListener("mousemove", transformObjByMouse)
    _creator__WEBPACK_IMPORTED_MODULE_0__["default"].canvas.removeEventListener("mousemove", changeSelectionRectByMouse);


    if(_creator__WEBPACK_IMPORTED_MODULE_0__["default"].selectionRect.topLeft && _creator__WEBPACK_IMPORTED_MODULE_0__["default"].selectionRect.bottomRight) {

        let selectionCanvasWidth = _creator__WEBPACK_IMPORTED_MODULE_0__["default"].selectionRect.bottomRight.x - _creator__WEBPACK_IMPORTED_MODULE_0__["default"].selectionRect.topLeft.x;
        let selectionCanvasHeight = _creator__WEBPACK_IMPORTED_MODULE_0__["default"].selectionRect.bottomRight.y - _creator__WEBPACK_IMPORTED_MODULE_0__["default"].selectionRect.topLeft.y;

        // Get bottom left corner of selection rectangle and convert it to point in world

        let bottomLeftWorldCorner = new _point__WEBPACK_IMPORTED_MODULE_2__.CanvasPoint(
            _creator__WEBPACK_IMPORTED_MODULE_0__["default"].selectionRect.topLeft.x,
            _creator__WEBPACK_IMPORTED_MODULE_0__["default"].selectionRect.topLeft.y + selectionCanvasHeight
        ).toWorldPoint();

        // Get top left corner of selection rectangle and convert it to point in world

        let topRightWorldCorner = new _point__WEBPACK_IMPORTED_MODULE_2__.CanvasPoint(
            _creator__WEBPACK_IMPORTED_MODULE_0__["default"].selectionRect.topLeft.x + selectionCanvasWidth,
            _creator__WEBPACK_IMPORTED_MODULE_0__["default"].selectionRect.topLeft.y
        ).toWorldPoint();

        // Select all objects found in selection

        for(let i = 0; i < _creator__WEBPACK_IMPORTED_MODULE_0__["default"].gameInstance.level.objects.length; i++) {

            let x = _creator__WEBPACK_IMPORTED_MODULE_0__["default"].gameInstance.level.objects[i].x;
            let y = _creator__WEBPACK_IMPORTED_MODULE_0__["default"].gameInstance.level.objects[i].y;

            let inXInterval = bottomLeftWorldCorner.x < x && x < topRightWorldCorner.x;
            let inYInterval = bottomLeftWorldCorner.y < y && y < topRightWorldCorner.y;

            if(inXInterval && inYInterval) {
                _creator__WEBPACK_IMPORTED_MODULE_0__["default"].selectedObjects.push(_creator__WEBPACK_IMPORTED_MODULE_0__["default"].gameInstance.level.objects[i])
            }


        }

    }

    // Clear selection rectangle objects

    _creator__WEBPACK_IMPORTED_MODULE_0__["default"].selectionRect.topLeft = null
    _creator__WEBPACK_IMPORTED_MODULE_0__["default"].selectionRect.bottomRight = null

    // Snap objects to grid

    for(let i = 0; i < _creator__WEBPACK_IMPORTED_MODULE_0__["default"].selectedObjects.length; i++) {
    let gridCell = new _grid__WEBPACK_IMPORTED_MODULE_1__.GridCell(_creator__WEBPACK_IMPORTED_MODULE_0__["default"].selectedObjects[i].x, _creator__WEBPACK_IMPORTED_MODULE_0__["default"].selectedObjects[i].y); 
    _creator__WEBPACK_IMPORTED_MODULE_0__["default"].selectedObjects[i].x = gridCell.center.x;
    _creator__WEBPACK_IMPORTED_MODULE_0__["default"].selectedObjects[i].y = gridCell.center.y;
    }

    // Clear selected objects
    // Set length to zero instead of initalizing new array to preserve reference to single object
    //selectedObjects.length = 0

    // Set selection rectangle corner to null

});

document.querySelector("#activate-viewport-transform").addEventListener("click", function(){
    _creator__WEBPACK_IMPORTED_MODULE_0__["default"].mouseTool = "transform-viewport";
});

document.querySelector("#activate-object-transform").addEventListener("click", function(){
    _creator__WEBPACK_IMPORTED_MODULE_0__["default"].mouseTool = "select-objects";
});

/***/ }),

/***/ "./html5/src/point.js":
/*!****************************!*\
  !*** ./html5/src/point.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CanvasPoint: () => (/* binding */ CanvasPoint),
/* harmony export */   Point: () => (/* binding */ Point),
/* harmony export */   WorldPoint: () => (/* binding */ WorldPoint)
/* harmony export */ });
/* harmony import */ var _creator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./creator */ "./html5/src/creator.js");
/**
 * Point class. Based off this flash library:
 * https://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/geom/Point.html
 * 
 * 
 */



/*
 * @param {Number} x 
 * @param {Number} y 
 */

function Point(x, y) {
    this.x = x;
    this.y = y;

    var self = this;

    Object.defineProperties(this,{

        length: {
            
            get: function() {
                return Math.sqrt(
                    Math.pow(self.x, 2) + Math.pow(self.y, 2)
                );
            }

        }

    })
}

/**
 * 
 * @param {Point} point1 
 * @param {Point} point2 
 */

Point.distance = function(point1, point2) {

}

Point.interPolate = function(point1, point2, f) {

}

/*** Generate point given polar coordinates for angle and length ***/

Point.polar = function() {

}

Point.prototype.add = function(point) {

}

Point.prototype.clone = function() {

}

Point.prototype.copyFrom = function() {

}

Point.prototype.equals = function() {

}

Point.prototype.normalize = function() {

}

Point.prototype.offset = function() {

}

Point.prototype.setTo = function() {

}

Point.prototype.toString = function() {

}

/**
 * Object for representing a point as relative to the world.
 * @extends {Point}
 * @param {*} x 
 * @param {*} y 
 */

function WorldPoint(x,y) {
    Point.apply(this, arguments);
}

Object.assign(WorldPoint.prototype, Point.prototype);


/**
 * 
 * @returns Vector measuring point relative to canvas instead of world
 * 
 * Formula:
 * 
 * x_c = x_w * k + d_x + w/2
 * y_c = -y_w * k + d_y + h/2
 * 
 */

WorldPoint.prototype.toCanvasPoint = function() {

    return new CanvasPoint(
        (this.x * _creator__WEBPACK_IMPORTED_MODULE_0__["default"].zoomFactor + _creator__WEBPACK_IMPORTED_MODULE_0__["default"].deltaX + _creator__WEBPACK_IMPORTED_MODULE_0__["default"].canvas.width/2), 
        (-this.y * _creator__WEBPACK_IMPORTED_MODULE_0__["default"].zoomFactor + _creator__WEBPACK_IMPORTED_MODULE_0__["default"].deltaY + _creator__WEBPACK_IMPORTED_MODULE_0__["default"].canvas.height/2)
    );

}

/**  
 * Point that is relative to canvas
 * @extends {Point}
 * @param {*} x 
 * @param {*} y 
 */

function CanvasPoint(x,y) {
    Point.apply(this, arguments)
}

Object.assign(CanvasPoint.prototype, Point.prototype);


/*
* Change canvas point to world point 
* Formula (based on solving in algebra for world point in canvas point)
*
* x_w = (x_c - d_x - w/2)/k
* y_w = -(y_c - h/2 - d_y)/k
*
*
*/

CanvasPoint.prototype.toWorldPoint = function() {

    return new WorldPoint(
        (this.x - _creator__WEBPACK_IMPORTED_MODULE_0__["default"].deltaX - _creator__WEBPACK_IMPORTED_MODULE_0__["default"].canvas.width / 2) / _creator__WEBPACK_IMPORTED_MODULE_0__["default"].zoomFactor,
        -(this.y - _creator__WEBPACK_IMPORTED_MODULE_0__["default"].deltaY - _creator__WEBPACK_IMPORTED_MODULE_0__["default"].canvas.height / 2) / _creator__WEBPACK_IMPORTED_MODULE_0__["default"].zoomFactor
    )

}

/***/ }),

/***/ "./html5/definitions/definitions.json":
/*!********************************************!*\
  !*** ./html5/definitions/definitions.json ***!
  \********************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"?xml":{"@_version":"1.0","@_encoding":"utf-8"},"objects":{"playobj":[{"obj":{"@_type":"symbol","@_symbolname":"floor","@_castshadow":"1","@_receiveshadow":"0","@_cache":"1","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"@_id":"floor","@_map":"1","@_cid":"3","@_ctype":"block","@_cname":"Floor"},{"obj":{"@_type":"symbol","@_castshadow":"1","@_receiveshadow":"0","@_cache":"1","@_z":"10"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"BOUNCE"},"@_id":"pipe","@_map":"1","@_cid":"4","@_ctype":"block","@_cname":"Pipe"},{"obj":{"@_type":"tile","@_tile":"119","@_castshadow":"1","@_receiveshadow":"0","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.9"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"@_id":"stonewall","@_map":"1","@_cid":"5","@_ctype":"block","@_cname":"Tile","@_calt":"You can change a tile block texture by clicking the arrows below"},{"obj":{"@_type":"tile","@_tile":"119","@_stamp":"rampstamp","@_castshadow":"1","@_receiveshadow":"0","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.9"},"simobj":{"@_type":"sim","@_ct":"RAMP","@_rt":"BOUNCE"},"@_id":"ramp","@_cid":"6","@_ctype":"block","@_cname":"RampTile"},{"obj":{"@_type":"tile","@_tile":"119","@_stamp":"rampstamp","@_castshadow":"1","@_receiveshadow":"0","@_z":"10","@_r":"-90"},"material":{"@_cor":"0.5","@_cof":"0.9"},"simobj":{"@_type":"sim","@_ct":"RAMP","@_rt":"BOUNCE"},"@_id":"ramp","@_cid":"7","@_ctype":"block","@_cname":"RampTile"},{"obj":{"@_type":"tile","@_tile":"119","@_stamp":"rampstamp","@_castshadow":"1","@_receiveshadow":"0","@_z":"10","@_r":"90"},"material":{"@_cor":"0.5","@_cof":"0.9"},"simobj":{"@_type":"sim","@_ct":"RAMP","@_rt":"BOUNCE"},"@_id":"ramp","@_cid":"456","@_ctype":"block","@_cname":"RampTile"},{"obj":{"@_type":"tile","@_tile":"119","@_stamp":"rampstamp","@_castshadow":"1","@_receiveshadow":"0","@_z":"10","@_r":"180"},"material":{"@_cor":"0.5","@_cof":"0.9"},"simobj":{"@_type":"sim","@_ct":"RAMP","@_rt":"BOUNCE"},"@_id":"ramp","@_cid":"457","@_ctype":"block","@_cname":"RampTile"},{"obj":{"@_type":"tile","@_tile":"119","@_stamp":"stairstamp","@_castshadow":"1","@_receiveshadow":"0","@_z":"10"},"simobj":{"@_type":"sim","@_ct":"STAIR","@_rt":"BOUNCE"},"@_id":"stair","@_cid":"8","@_ctype":"block","@_cname":"StairTile"},{"obj":{"@_type":"tile","@_tile":"119","@_stamp":"stairstamp","@_castshadow":"1","@_receiveshadow":"0","@_z":"10","@_r":"-90"},"simobj":{"@_type":"sim","@_ct":"STAIR","@_rt":"BOUNCE"},"@_id":"stair","@_cid":"9","@_ctype":"block","@_cname":"StairTile"},{"obj":{"@_type":"tile","@_tile":"119","@_castshadow":"1","@_tilescale":"2","@_receiveshadow":"0","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.9"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"@_id":"stonewall_large","@_version":"2","@_map":"1","@_cid":"90","@_ctype":"block","@_cname":"Large Tile","@_calt":"You can change a tile block texture by clicking the arrows below"},{"obj":{"@_type":"textureblock","@_tile":"0","@_castshadow":"1","@_receiveshadow":"0","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.9"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"@_id":"textureblock_large","@_version":"2","@_map":"1","@_cid":"800","@_ctype":"block","@_cname":"TextureBlock","@_calt":"You can change a tile block texture by clicking the button below"},{"obj":{"@_type":"symbol","@_castshadow":"1","@_receiveshadow":"0","@_cache":"1","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"@_id":"bricka2x1","@_version":"2","@_map":"1","@_cid":"401","@_ctype":"block","@_cname":"Brick"},{"obj":{"@_type":"symbol","@_castshadow":"1","@_receiveshadow":"0","@_cache":"1","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"@_id":"bricka2x2","@_version":"2","@_map":"1","@_cid":"402","@_ctype":"block","@_cname":"Brick"},{"obj":{"@_type":"symbol","@_castshadow":"1","@_receiveshadow":"0","@_cache":"1","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"@_id":"bricka3x1","@_version":"2","@_map":"1","@_cid":"403","@_ctype":"block","@_cname":"Brick"},{"obj":{"@_type":"symbol","@_castshadow":"1","@_receiveshadow":"0","@_cache":"1","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"@_id":"brickb2x2a","@_version":"2","@_map":"1","@_cid":"404","@_ctype":"block","@_cname":"Brick"},{"obj":{"@_type":"symbol","@_castshadow":"1","@_receiveshadow":"0","@_cache":"1","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"@_id":"brickb2x2b","@_version":"2","@_map":"1","@_cid":"405","@_ctype":"block","@_cname":"Brick"},{"obj":{"@_type":"symbol","@_castshadow":"1","@_receiveshadow":"0","@_cache":"1","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"@_id":"brickb2x2c","@_version":"2","@_map":"1","@_cid":"406","@_ctype":"block","@_cname":"Brick"},{"obj":{"@_type":"symbol","@_castshadow":"1","@_receiveshadow":"0","@_cache":"0","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"@_id":"brickc2x1","@_version":"2","@_map":"1","@_cid":"407","@_ctype":"block","@_cname":"Brick"},{"obj":{"@_type":"symbol","@_castshadow":"1","@_receiveshadow":"0","@_cache":"1","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"@_id":"brickc2x2a","@_version":"2","@_map":"1","@_cid":"408","@_ctype":"block","@_cname":"Brick"},{"obj":{"@_type":"symbol","@_castshadow":"1","@_receiveshadow":"0","@_cache":"1","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"@_id":"brickc2x2b","@_version":"2","@_map":"1","@_cid":"409","@_ctype":"block","@_cname":"Brick"},{"obj":{"@_type":"symbol","@_castshadow":"1","@_receiveshadow":"0","@_cache":"0","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"@_id":"brickc3x1","@_version":"2","@_map":"1","@_cid":"410","@_ctype":"block","@_cname":"Brick"},{"obj":{"@_type":"symbol","@_castshadow":"1","@_receiveshadow":"0","@_cache":"1","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"@_id":"brickd2x1","@_version":"2","@_map":"1","@_cid":"411","@_ctype":"block","@_cname":"Brick"},{"obj":{"@_type":"symbol","@_castshadow":"1","@_receiveshadow":"0","@_cache":"1","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"@_id":"brickd2x2","@_version":"2","@_map":"1","@_cid":"412","@_ctype":"block","@_cname":"Brick"},{"obj":{"@_type":"symbol","@_castshadow":"1","@_receiveshadow":"0","@_cache":"1","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"@_id":"brickd3x1","@_version":"2","@_map":"1","@_cid":"413","@_ctype":"block","@_cname":"Brick"},{"obj":{"@_type":"symbol","@_castshadow":"1","@_receiveshadow":"0","@_cache":"1","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"@_id":"woodpost","@_version":"2","@_map":"1","@_cid":"289","@_ctype":"block","@_cname":"WoodPost"},{"obj":{"@_type":"tile","@_tile":"119","@_back":"1","@_castshadow":"0","@_z":"-10"},"material":{"@_cor":"0.5","@_cof":"0.5"},"@_id":"highwall","@_cid":"10","@_ctype":"blockbehind","@_cname":"BackWall","@_calt":"You can walk in front of back walls and windows"},{"obj":{"@_type":"tile","@_tile":"119","@_back":"1","@_stamp":"windowtrianglestamp","@_castshadow":"0","@_z":"-10"},"material":{"@_cor":"0.5","@_cof":"0.5"},"@_id":"highwall_windowtriangle","@_cid":"11","@_ctype":"blockbehind","@_cname":"BackWindow"},{"obj":{"@_type":"tile","@_tile":"119","@_back":"1","@_stamp":"windowcirclestamp","@_castshadow":"0","@_z":"-10"},"@_id":"highwall_windowcircle","@_cid":"12","@_ctype":"blockbehind","@_cname":"BackWindow"},{"obj":{"#text":"{\\"perturbation\\": \\"0\\"}","@_type":"tile","@_tile":"131","@_back":"1","@_castshadow":"0","@_z":"-10"},"@_id":"wall","@_cid":"13","@_ctype":"blockbehind","@_cname":"BackWall","@_calt":"You can walk in front of back walls and windows"},{"obj":{"@_type":"tile","@_tile":"119","@_back":"1","@_tilescale":"2","@_castshadow":"0","@_z":"-10"},"material":{"@_cor":"0.5","@_cof":"0.5"},"@_id":"highwall_large","@_version":"2","@_cid":"91","@_ctype":"blockbehind","@_cname":"LargeBack","@_calt":"You can walk in front of back walls and windows"},{"obj":{"@_type":"textureblock","@_tile":"0","@_back":"1","@_castshadow":"0","@_z":"-10"},"@_id":"texturewall_large","@_version":"2","@_cid":"801","@_ctype":"blockbehind","@_cname":"TextureWall","@_calt":"You can change a tile wall texture by clicking the button below"},{"obj":{"@_type":"tile","@_tile":"119","@_back":"1","@_stamp":"windowarchstamp","@_tilescale":"2","@_castshadow":"0","@_z":"-10"},"@_id":"highwall_windowcircle_large","@_version":"2","@_cid":"92","@_ctype":"blockbehind","@_cname":"LargeWindow"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"-10"},"@_id":"backwalltemple","@_version":"2","@_cid":"117","@_ctype":"blockbehind","@_cname":"BackWall","@_calt":"You can walk in front of back walls and windows"},{"obj":{"@_type":"symbol","@_symbolname":"wall_light","@_light":"0xcccccc","@_cache":"1","@_z":"-9"},"material":{"@_self_illuminate":"1"},"@_id":"wall_light","@_cid":"14","@_ctype":"blockbehind","@_cname":"BackLight","@_calt":"Use this light to illuminate dark areas"},{"obj":{"@_type":"symbol","@_light":"0xcccccc","@_z":"-9"},"material":"","simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"REPORT_ONLY"},"ctrl":{"@_type":"light","@_method":"cpu"},"@_id":"nearlight","@_cid":"48","@_ctype":"blockbehind","@_cname":"NearLight","@_calt":"This light turns on when you are near it"},{"obj":{"@_type":"symbol","@_light":"0xff6600","@_z":"-9"},"material":{"@_self_illuminate":"1"},"@_id":"torchlight","@_version":"2","@_cid":"115","@_ctype":"blockbehind","@_ccache":"1","@_cname":"TorchLight","@_calt":"Use this light to illuminate dark areas"},{"obj":{"@_type":"symbol","@_light":"0xff6600","@_z":"-9"},"material":{"@_self_illuminate":"1"},"@_id":"tikitorch","@_version":"2","@_cid":"116","@_ctype":"blockbehind","@_ccache":"1","@_cname":"TikiTorch","@_calt":"Use this light to illuminate dark areas"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"-10"},"@_id":"brickabehind","@_version":"2","@_cid":"501","@_ctype":"blockbehind","@_cname":"BackBrick"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"-10"},"@_id":"brickbbehind","@_version":"2","@_cid":"502","@_ctype":"blockbehind","@_cname":"BackBrick"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"-10"},"@_id":"brickcbehind","@_version":"2","@_cid":"503","@_ctype":"blockbehind","@_cname":"BackBrick"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"-10"},"@_id":"brickdbehind","@_version":"2","@_cid":"504","@_ctype":"blockbehind","@_cname":"BackBrick"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"-10"},"@_id":"lamwall1","@_cid":"22","@_ctype":"blockbehind","@_cname":"LamWall"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"-10"},"@_id":"lamwall2","@_cid":"23","@_ctype":"blockbehind","@_cname":"LamWall"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"-10"},"@_id":"lamwall3","@_cid":"24","@_ctype":"blockbehind","@_cname":"LamWall"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"-10"},"@_id":"lamwall4","@_cid":"25","@_ctype":"blockbehind","@_cname":"LamWall"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"-10"},"@_id":"lamwall5","@_cid":"26","@_ctype":"blockbehind","@_cname":"LamWall"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"-10"},"@_id":"lamwall6","@_cid":"27","@_ctype":"blockbehind","@_cname":"LamWall"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"-10"},"@_id":"lamwall7","@_cid":"28","@_ctype":"blockbehind","@_cname":"LamWall"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"-10"},"@_id":"lamwall8","@_cid":"29","@_ctype":"blockbehind","@_cname":"LamWall"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"-10"},"@_id":"lamwall9","@_cid":"30","@_ctype":"blockbehind","@_cname":"LamWall"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"-10"},"@_id":"lamwall10","@_cid":"31","@_ctype":"blockbehind","@_cname":"LamWall"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"-10"},"@_id":"lamwall11","@_cid":"32","@_ctype":"blockbehind","@_cname":"LamWall"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"-10"},"@_id":"lamwall12","@_cid":"33","@_ctype":"blockbehind","@_cname":"LamWall"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"-10"},"@_id":"panelrosetta","@_version":"2","@_cid":"69","@_ctype":"blockbehind","@_cname":"GoldPanel"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"-10"},"@_id":"panelcluster","@_version":"2","@_cid":"70","@_ctype":"blockbehind","@_cname":"GoldPanel"},{"obj":{"@_type":"symbol","@_cache":"0","@_z":"-10"},"@_id":"panelglitterred","@_version":"2","@_cid":"71","@_ctype":"blockbehind","@_ccache":"1","@_cname":"CyberPanel"},{"obj":{"@_type":"symbol","@_cache":"0","@_z":"-10"},"@_id":"panelglitterpurple","@_version":"2","@_cid":"72","@_ctype":"blockbehind","@_ccache":"1","@_cname":"CyberPanel"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"-10"},"@_id":"panelspines","@_version":"2","@_cid":"73","@_ctype":"blockbehind","@_ccache":"1","@_cname":"Wire Wall"},{"obj":{"@_type":"symbol","@_cache":"0","@_z":"-10"},"@_id":"panelspinesglow","@_version":"2","@_cid":"74","@_ctype":"blockbehind","@_ccache":"1","@_cname":"HotWire Wall"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"-10"},"@_id":"panelscallops","@_version":"2","@_cid":"75","@_ctype":"blockbehind","@_ccache":"1","@_cname":"Angular Wall"},{"obj":{"@_type":"symbol","@_cache":"0","@_z":"-10"},"@_id":"panelmesa","@_version":"2","@_cid":"76","@_ctype":"blockbehind","@_ccache":"1","@_cname":"Rainbow Wall"},{"obj":{"@_type":"symbol","@_cache":"0","@_z":"-10"},"@_id":"panelbubbles","@_version":"2","@_cid":"77","@_ctype":"blockbehind","@_ccache":"1","@_cname":"Aqua Wall"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"-10"},"material":{"@_self_illuminate":"1"},"@_id":"techwall","@_cid":"34","@_ctype":"blockbehind","@_cname":"TechWall","@_cframe":"50"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"-10"},"material":{"@_self_illuminate":"1"},"@_id":"techwallscreen","@_cid":"35","@_ctype":"blockbehind","@_cname":"TechWall","@_cframe":"50"},{"obj":{"@_type":"symbol","@_z":"-10"},"material":{"@_self_illuminate":"1"},"@_id":"ledwall1","@_cid":"36","@_ctype":"blockbehind","@_ccache":"1","@_cname":"LEDWall","@_cframe":"50"},{"obj":{"@_type":"symbol","@_z":"-10"},"material":{"@_self_illuminate":"1"},"@_id":"ledwall2","@_cid":"37","@_ctype":"blockbehind","@_ccache":"1","@_cname":"LEDWall","@_cframe":"50"},{"obj":{"@_type":"symbol","@_z":"-10"},"material":{"@_self_illuminate":"1"},"@_id":"ledwall3","@_cid":"38","@_ctype":"blockbehind","@_ccache":"1","@_cname":"LEDWall","@_cframe":"50"},{"obj":{"@_type":"symbol","@_z":"-10"},"material":{"@_self_illuminate":"1"},"@_id":"ledwall4","@_cid":"39","@_ctype":"blockbehind","@_ccache":"1","@_cname":"LEDWall","@_cframe":"50"},{"obj":{"@_type":"symbol","@_receiveshadow":"0","@_z":"9"},"material":{"@_cor":"0.2","@_cof":"0.5"},"ctrl":{"@_type":"speech","@_method":"cpu"},"@_id":"inscription","@_version":"2","@_type":"control","@_cid":"288","@_ctype":"blockbehind","@_textentry":"true","@_cname":"Inscription","@_calt":"This block can display a message of your choosing"},{"obj":{"@_type":"symbol","@_receiveshadow":"0","@_z":"9"},"material":{"@_cor":"0.2","@_cof":"0.5"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"REPORT_ONLY"},"ctrl":{"@_type":"speech","@_method":"cpu"},"sounds":{"@_speak":"aa_mumble"},"@_id":"sagewizard","@_version":"2","@_type":"control","@_cid":"351","@_ctype":"blockbehind","@_textentry":"true","@_cname":"Wizard","@_calt":"This character can speak a message of your choosing"},{"obj":{"@_type":"symbol","@_receiveshadow":"0","@_z":"9"},"material":{"@_cor":"0.2","@_cof":"0.5"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"REPORT_ONLY"},"ctrl":{"@_type":"speech","@_method":"cpu"},"sounds":{"@_speak":"aa_mumble"},"@_id":"sagegeneral","@_version":"2","@_type":"control","@_cid":"352","@_ctype":"blockbehind","@_textentry":"true","@_cname":"General","@_calt":"This character can speak a message of your choosing"},{"obj":{"@_type":"symbol","@_receiveshadow":"0","@_z":"9"},"material":{"@_cor":"0.2","@_cof":"0.5"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"REPORT_ONLY"},"ctrl":{"@_type":"speech","@_method":"cpu"},"sounds":{"@_speak":"aa_mumble"},"@_id":"sageowl","@_version":"2","@_type":"control","@_cid":"353","@_ctype":"blockbehind","@_textentry":"true","@_cname":"Owl","@_calt":"This character can speak a message of your choosing"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"910"},"@_id":"bush","@_version":"2","@_cid":"601","@_ctype":"blockbehind","@_cname":"FrontPlant"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"-8"},"@_id":"bushbehind","@_version":"2","@_cid":"602","@_ctype":"blockbehind","@_cname":"Plant"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"910"},"@_id":"bushthin","@_version":"2","@_cid":"603","@_ctype":"blockbehind","@_cname":"FrontPlant"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"910"},"@_id":"grass","@_version":"2","@_cid":"604","@_ctype":"blockbehind","@_cname":"FrontGrass"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"-8"},"@_id":"grassbehind","@_version":"2","@_cid":"605","@_ctype":"blockbehind","@_cname":"Grass"},{"obj":{"@_type":"symbol","@_z":"-7"},"@_id":"woodpostback","@_version":"2","@_cid":"618","@_ctype":"blockbehind","@_cname":"WoodPostBehind"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"-8"},"@_id":"etchingdemona","@_version":"2","@_cid":"606","@_ctype":"blockbehind","@_cname":"Etching"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"-8"},"@_id":"etchingdemonb","@_version":"2","@_cid":"607","@_ctype":"blockbehind","@_cname":"Etching"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"-8"},"@_id":"statue1","@_cid":"40","@_ctype":"blockbehind","@_cname":"Statue"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"-8"},"@_id":"statue2","@_cid":"41","@_ctype":"blockbehind","@_cname":"Statue"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"-8"},"@_id":"statue3","@_cid":"42","@_ctype":"blockbehind","@_cname":"Statue"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"900"},"@_id":"oni","@_version":"2","@_cid":"608","@_ctype":"blockbehind","@_cname":"FrontStatue"},{"obj":{"@_type":"symbol","@_z":"-9"},"@_id":"sign1","@_cid":"43","@_ctype":"blockbehind","@_ccache":"1","@_cname":"Sign"},{"obj":{"@_type":"symbol","@_z":"-9"},"@_id":"sign2","@_cid":"44","@_ctype":"blockbehind","@_ccache":"1","@_cname":"Sign"},{"obj":{"@_type":"symbol","@_z":"-9"},"@_id":"sign3","@_cid":"45","@_ctype":"blockbehind","@_ccache":"1","@_cname":"Sign"},{"obj":{"@_type":"symbol","@_z":"-9"},"@_id":"sign4","@_cid":"46","@_ctype":"blockbehind","@_ccache":"1","@_cname":"Sign"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"-9"},"@_id":"rocky1","@_version":"2","@_cid":"78","@_ctype":"blockbehind","@_cname":"Rock Pile"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"-9"},"@_id":"rocky2","@_version":"2","@_cid":"79","@_ctype":"blockbehind","@_cname":"Rock Pile"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"910"},"@_id":"screen","@_version":"2","@_cid":"609","@_ctype":"blockbehind","@_cname":"FrontScreen"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"-6"},"@_id":"skulls","@_version":"2","@_cid":"610","@_ctype":"blockbehind","@_cname":"Skulls"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"-5"},"@_id":"spiderweb","@_version":"2","@_cid":"611","@_ctype":"blockbehind","@_cname":"SpiderWeb"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"-5"},"@_id":"spiderweb_mirror","@_version":"2","@_cid":"617","@_ctype":"blockbehind","@_cname":"SpiderWeb"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"-7"},"material":{"@_self_illuminate":"1"},"@_id":"stainedglasswindow","@_version":"2","@_cid":"612","@_ctype":"blockbehind","@_cname":"Window"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"1001"},"@_id":"truss","@_version":"2","@_cid":"613","@_rotate":"true","@_ctype":"blockbehind","@_cname":"Truss"},{"obj":{"@_type":"symbol","@_z":"-8"},"@_id":"waterspoutfront","@_version":"2","@_cid":"614","@_ctype":"blockbehind","@_ccache":"1","@_cname":"Waterspout"},{"obj":{"@_type":"symbol","@_z":"-7"},"@_id":"waterspoutside","@_version":"2","@_cid":"615","@_ctype":"blockbehind","@_ccache":"1","@_cname":"Waterspout"},{"obj":{"@_type":"symbol","@_z":"-7"},"@_id":"waterspoutside_mirror","@_version":"2","@_cid":"616","@_ctype":"blockbehind","@_ccache":"1","@_cname":"Waterspout"},{"material":{"@_emissivity":"0x0000cc"},"obj":{"@_type":"symbol","@_symbolname":"water","@_z":"180"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"FLOAT"},"@_id":"water","@_cid":"15","@_ctype":"block","@_cname":"Water","@_calt":"Use these to create areas you can float in"},{"material":{"@_emissivity":"0x0000cc"},"obj":{"@_type":"symbol","@_symbolname":"waterlarge","@_z":"180"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"FLOAT"},"@_id":"waterlarge","@_version":"2","@_cid":"68","@_ctype":"block","@_cname":"Large Water","@_calt":"A larger block of water to make large areas faster"},{"material":{"@_emissivity":"0x0000cc"},"obj":{"@_type":"symbol","@_symbolname":"waterwaves","@_z":"180"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"FLOAT"},"@_id":"waterwaves","@_cid":"16","@_ctype":"block","@_ccache":"1","@_cname":"WaterTop","@_calt":"Put these on top of your water pools"},{"material":{"@_emissivity":"0xff0000"},"obj":{"@_type":"symbol","@_z":"180"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"FLOAT"},"ctrl":{"@_type":"harmtouch","@_method":"cpu","@_strength":"1","@_effect":"burneffect"},"@_id":"lava","@_version":"2","@_cid":"451","@_ctype":"block","@_ccache":"1","@_cname":"Lava","@_calt":"Deadly lava kills almost instantly!"},{"material":{"@_emissivity":"0xff0000"},"obj":{"@_type":"symbol","@_z":"180"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"FLOAT"},"ctrl":{"@_type":"harmtouch","@_method":"cpu","@_strength":"10","@_effect":"burneffect"},"sounds":{"@_collide":"aa_lava"},"@_id":"lavawaves","@_version":"2","@_cid":"452","@_ctype":"block","@_ccache":"1","@_cname":"LavaTop","@_calt":"Put these on top of your lava pools"},{"obj":{"@_type":"symbol","@_symbolname":"ladder","@_z":"-8"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"CLIMB"},"@_id":"ladder","@_version":"2","@_cid":"49","@_ctype":"block","@_cname":"Ladder","@_calt":"Use these to create paths you can climb up and down"},{"obj":{"@_type":"symbol","@_symbolname":"log","@_z":"10"},"material":{"@_cor":"0.1","@_cof":"0.8"},"simobj":{"@_type":"vel","@_ct":"CIRCLE","@_rt":"BOUNCE"},"ctrl":{"@_type":"spring","@_method":"cpu","@_k":"8","@_lockx":"1"},"@_id":"log","@_type":"control","@_map":"1","@_cid":"17","@_ctype":"block","@_cname":"Log","@_calt":"These logs are bouncy and are hard to walk on"},{"obj":{"@_type":"symbol","@_symbolname":"bounceblock","@_z":"10"},"material":{"@_cor":"0.1","@_cof":"0"},"simobj":{"@_type":"vel","@_ct":"OBB","@_rt":"BOUNCE"},"ctrl":{"@_type":"spring","@_method":"cpu","@_k":"10","@_bounce":"1","@_lockx":"1"},"@_id":"bounceblock","@_type":"control","@_map":"1","@_cid":"18","@_ctype":"block","@_cname":"Bouncer"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"@_id":"iceblock","@_map":"1","@_cid":"19","@_ctype":"block","@_cname":"IceBlock","@_calt":"These are slippery and hard to walk on"},{"obj":{"@_type":"symbol","@_symbolname":"weakfloor","@_receiveshadow":"0","@_z":"10"},"material":{"@_cor":"0.6","@_cof":"0.5"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"behavior":{"@_type":"weakblock","@_strength":"8","@_damage":"weight"},"@_id":"weakfloor","@_type":"control","@_map":"1","@_cid":"20","@_ctype":"block","@_cname":"WeakFloor","@_calt":"This floor will break under your weight"},{"obj":{"@_type":"symbol","@_receiveshadow":"0","@_z":"10"},"material":{"@_cor":"0.7","@_cof":"0.5"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"behavior":{"@_type":"weakblock","@_strength":"8","@_damage":"hit"},"@_id":"sandblock","@_type":"control","@_map":"1","@_cid":"21","@_ctype":"block","@_cname":"Sandblock","@_calt":"This block is breakable if you hit it"},{"obj":{"@_type":"symbol","@_receiveshadow":"0","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"behavior":{"@_type":"weakblock","@_strength":"8","@_damage":"heat"},"@_id":"meltblock","@_type":"control","@_map":"1","@_cid":"47","@_ctype":"block","@_cname":"Meltblock","@_calt":"This block can be melted by the flame thrower."},{"obj":{"@_type":"symbol","@_receiveshadow":"0","@_z":"10"},"material":{"@_cor":"0.7","@_cof":"0.5"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"behavior":{"@_type":"weakblock","@_strength":"4","@_damage":"hit","@_resilience":"29","@_damageby":"mace"},"@_id":"cinderblock","@_version":"2","@_type":"control","@_map":"1","@_cid":"287","@_ctype":"block","@_cname":"Cinderblock","@_calt":"This block is only breakable with the mace."},{"obj":{"@_type":"symbol","@_z":"10"},"material":{"@_cor":"0.7","@_cof":"0.5"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"behavior":{"@_type":"weakblock","@_strength":"40","@_damage":"hit","@_resilience":"41","@_damageby":"grenade"},"@_id":"cavein","@_version":"2","@_type":"control","@_map":"1","@_cid":"286","@_ctype":"block","@_cname":"CaveIn","@_calt":"This block can only be destroyed by a grenade."},{"obj":{"@_type":"symbol","@_z":"-12","@_cache":"1","@_overlay":"1"},"material":{"@_cor":"0.5","@_cof":"0.5","@_emissivity":"0x999999"},"simobj":{"#text":"[[false, 149.9, 150], [true, -150, 150], [true, -150, 90], [true, 149.9, 90], [true, 149.9, 150], [false, 150, -90], [true, -149.9, -90], [true, -149.9, -150], [true, 150, -150], [true, 150, -90]]","@_type":"sim","@_ct":"POLYGON","@_rt":"BOUNCE"},"@_id":"tunnelstraight","@_version":"2","@_map":"0","@_submap":"1","@_rotate":"true","@_cid":"80","@_ctype":"block","@_cname":"Tunnel"},{"obj":{"@_type":"symbol","@_z":"-12","@_cache":"1","@_overlay":"1"},"material":{"@_cor":"0.5","@_cof":"0.5","@_emissivity":"0x999999"},"simobj":{"#text":"[[false, 150, 90], [true, 150, 150], [true, -150.15, 150], [true, -150.15, -150], [true, -90.15, -150], [true, -90.15, -76.55], [true, -40, 40], [true, 66.55, 90], [true, 150, 90], [false, 150, -150], [true, 150, -90], [true, 109.95, -100], [true, 89.95, -150], [true, 150, -150]]","@_type":"sim","@_ct":"POLYGON","@_rt":"BOUNCE"},"@_id":"tunnelcorner","@_version":"2","@_map":"0","@_submap":"1","@_rotate":"true","@_cid":"81","@_ctype":"block","@_cname":"Tunnel Corner"},{"obj":{"@_type":"symbol","@_z":"-12","@_cache":"1","@_overlay":"1"},"material":{"@_cor":"0.5","@_cof":"0.5","@_emissivity":"0x999999"},"simobj":{"#text":"[[false, -150, 150.05], [true, -150, 90.05], [true, -110, 110.05], [true, -90, 150.05], [true, -150, 150.05], [false, 90, 150.05], [true, 110, 110.05], [true, 150, 90.05], [true, 150, 150.05], [true, 90, 150.05], [false, 150, -90], [true, -149.9, -90], [true, -149.9, -150], [true, 150, -150], [true, 150, -90]]","@_type":"sim","@_ct":"POLYGON","@_rt":"BOUNCE"},"@_id":"tunneljunction3","@_version":"2","@_map":"0","@_submap":"1","@_rotate":"true","@_cid":"82","@_ctype":"block","@_cname":"Tunnel Junction"},{"obj":{"@_type":"symbol","@_z":"-12","@_cache":"1","@_overlay":"1"},"material":{"@_cor":"0.5","@_cof":"0.5","@_emissivity":"0x999999"},"simobj":{"#text":"[\\n\\t\\t[false, -90, 150], [true, -150, 150], [true, -150, 90], [true, -110, 110], [true, -90, 150], \\n\\t\\t[false, -90, -150], [true, -110, -110], [true, -150, -90], [true, -150, -150], [true, -90, -150], \\n\\t\\t[false, 90, 150], [true, 110, 110], [true, 150, 90], [true, 150, 150], [true, 90, 150], \\n\\t\\t[false, 150, -150], [true, 150, -90], [true, 110, -110], [true, 90, -150], [true, 150, -150]]","@_type":"sim","@_ct":"POLYGON","@_rt":"BOUNCE"},"@_id":"tunneljunction4","@_version":"2","@_map":"0","@_submap":"1","@_rotate":"true","@_cid":"83","@_ctype":"block","@_cname":"Tunnel Junction"},{"obj":{"@_type":"symbol","@_z":"-12","@_cache":"1","@_overlay":"1"},"material":{"@_cor":"0.5","@_cof":"0.5","@_emissivity":"0x999999"},"simobj":{"#text":"[[false, 150, -150], [true, 150, 150], [true, -150, 150], [true, -150, -150], [true, -90, -150], [true, -90, 90], [true, 90, 90], [true, 90, -150], [true, 150, -150]]","@_type":"sim","@_ct":"POLYGON","@_rt":"BOUNCE"},"@_id":"tunnelend","@_version":"2","@_map":"0","@_submap":"1","@_buttress":"1","@_rotate":"true","@_cid":"84","@_ctype":"block","@_cname":"Tunnel End"},{"obj":{"@_type":"symbol","@_z":"-12","@_overlay":"1"},"material":{"@_cor":"0.5","@_cof":"0.5","@_emissivity":"0x999999"},"simobj":{"#text":"[[false, 149.9, 150], [true, -150, 150], [true, -150, 90], [true, 149.9, 90], [true, 149.9, 150], [false, 150, -90], [true, -149.9, -90], [true, -149.9, -150], [true, 150, -150], [true, 150, -90]]","@_type":"sim","@_ct":"POLYGON","@_rt":"BOUNCE"},"@_id":"tunnelstraight_jewel","@_version":"2","@_map":"0","@_submap":"1","@_rotate":"true","@_cid":"85","@_ctype":"block","@_cname":"Tunnel"},{"obj":{"@_type":"symbol","@_z":"-12","@_overlay":"1"},"material":{"@_cor":"0.5","@_cof":"0.5","@_emissivity":"0x999999"},"simobj":{"#text":"[[false, 150, 90], [true, 150, 150], [true, -150.15, 150], [true, -150.15, -150], [true, -90.15, -150], [true, -90.15, -76.55], [true, -40, 40], [true, 66.55, 90], [true, 150, 90], [false, 150, -150], [true, 150, -90], [true, 109.95, -100], [true, 89.95, -150], [true, 150, -150]]","@_type":"sim","@_ct":"POLYGON","@_rt":"BOUNCE"},"@_id":"tunnelcorner_jewel","@_version":"2","@_map":"0","@_submap":"1","@_rotate":"true","@_cid":"86","@_ctype":"block","@_cname":"Tunnel Corner"},{"obj":{"@_type":"symbol","@_z":"-12","@_overlay":"1"},"material":{"@_cor":"0.5","@_cof":"0.5","@_emissivity":"0x999999"},"simobj":{"#text":"[[false, -150, 150.05], [true, -150, 90.05], [true, -110, 110.05], [true, -90, 150.05], [true, -150, 150.05], [false, 90, 150.05], [true, 110, 110.05], [true, 150, 90.05], [true, 150, 150.05], [true, 90, 150.05], [false, 150, -90], [true, -149.9, -90], [true, -149.9, -150], [true, 150, -150], [true, 150, -90]]","@_type":"sim","@_ct":"POLYGON","@_rt":"BOUNCE"},"@_id":"tunneljunction3_jewel","@_version":"2","@_map":"0","@_submap":"1","@_rotate":"true","@_cid":"87","@_ctype":"block","@_cname":"Tunnel Junction"},{"obj":{"@_type":"symbol","@_z":"-12","@_overlay":"1"},"material":{"@_cor":"0.5","@_cof":"0.5","@_emissivity":"0x999999"},"simobj":{"#text":"[\\n\\t\\t[false, -90, 150], [true, -150, 150], [true, -150, 90], [true, -110, 110], [true, -90, 150], \\n\\t\\t[false, -90, -150], [true, -110, -110], [true, -150, -90], [true, -150, -150], [true, -90, -150], \\n\\t\\t[false, 90, 150], [true, 110, 110], [true, 150, 90], [true, 150, 150], [true, 90, 150], \\n\\t\\t[false, 150, -150], [true, 150, -90], [true, 110, -110], [true, 90, -150], [true, 150, -150]]","@_type":"sim","@_ct":"POLYGON","@_rt":"BOUNCE"},"@_id":"tunneljunction4_jewel","@_version":"2","@_map":"0","@_submap":"1","@_rotate":"true","@_cid":"88","@_ctype":"block","@_cname":"Tunnel Junction"},{"obj":{"@_type":"symbol","@_z":"-12","@_overlay":"1"},"material":{"@_cor":"0.5","@_cof":"0.5","@_emissivity":"0x999999"},"simobj":{"#text":"[[false, 150, -150], [true, 150, 150], [true, -150, 150], [true, -150, -150], [true, -90, -150], [true, -90, 90], [true, 90, 90], [true, 90, -150], [true, 150, -150]]","@_type":"sim","@_ct":"POLYGON","@_rt":"BOUNCE"},"@_id":"tunnelend_jewel","@_version":"2","@_map":"0","@_submap":"1","@_buttress":"1","@_rotate":"true","@_cid":"89","@_ctype":"block","@_cname":"Tunnel End"},{"obj":{"@_type":"symbol","@_receiveshadow":"0","@_z":"9"},"material":{"@_cor":"0.2","@_cof":"0.5","@_self_illuminate":"1"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"REPORT_ONLY"},"ctrl":{"@_type":"teleporter","@_group":"green"},"@_id":"teleportergreen","@_type":"control","@_map":"1","@_cid":"61","@_ctype":"block","@_cname":"Teleporter","@_calt":"Teleports you to the nearest green teleporter"},{"obj":{"@_type":"symbol","@_receiveshadow":"0","@_z":"9"},"material":{"@_cor":"0.2","@_cof":"0.5","@_self_illuminate":"1"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"REPORT_ONLY"},"ctrl":{"@_type":"teleporter","@_group":"orange"},"@_id":"teleporterorange","@_type":"control","@_map":"1","@_cid":"62","@_ctype":"block","@_cname":"Teleporter","@_calt":"This block will teleport you to the nearest orange teleporter"},{"obj":{"@_type":"symbol","@_receiveshadow":"0","@_z":"9"},"material":{"@_cor":"0.2","@_cof":"0.5","@_self_illuminate":"1"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"REPORT_ONLY"},"ctrl":{"@_type":"teleporter","@_group":"purple"},"@_id":"teleporterpurple","@_type":"control","@_map":"1","@_cid":"63","@_ctype":"block","@_cname":"Teleporter","@_calt":"This block will teleport you to the nearest purple teleporter"},{"obj":{"@_type":"symbol","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.1"},"simobj":{"@_type":"vel","@_ct":"CAPSULE","@_rt":"BOUNCE","@_pen":"15"},"ctrl":{"@_type":"platform","@_method":"cpu","@_vx":"30","@_vy":"0"},"@_id":"platform","@_type":"control","@_map":"1","@_cid":"50","@_ctype":"block","@_cname":"Slider","@_calt":"Moves right to left.  Add other blocks nearby to stop it"},{"obj":{"@_type":"symbol","@_symbolname":"platform","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.1"},"simobj":{"@_type":"vel","@_ct":"CAPSULE","@_rt":"BOUNCE","@_pen":"15"},"ctrl":{"@_type":"platform","@_method":"cpu","@_vx":"0","@_vy":"30"},"@_id":"elevator","@_type":"control","@_map":"1","@_cid":"51","@_ctype":"block","@_cname":"Elevator","@_calt":"Moves up and down. Add other blocks above and below to stop it"},{"obj":{"@_type":"symbol","@_symbolname":"platform3","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.1"},"simobj":{"@_type":"vel","@_ct":"OBB","@_rt":"BOUNCE","@_pen":"15"},"ctrl":{"@_type":"platform","@_method":"cpu","@_vx":"0","@_vy":"20"},"@_id":"elevator2","@_version":"2","@_type":"control","@_map":"1","@_cid":"218","@_ctype":"block","@_cname":"Big Elevator","@_calt":"Moves up and down. Add other blocks above and below to stop it"},{"obj":{"@_type":"symbol","@_symbolname":"platform2","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.1"},"simobj":{"@_type":"vel","@_ct":"OBB","@_rt":"BOUNCE","@_pen":"15"},"ctrl":{"@_type":"platform","@_method":"cpu","@_vx":"20","@_vy":"20"},"@_id":"platavator","@_version":"2","@_type":"control","@_map":"1","@_cid":"219","@_ctype":"block","@_cname":"2way Platform","@_calt":"Moves in 4 directions. Add other blocks around it to change its direction"},{"obj":{"@_type":"symbol","@_symbolname":"gear","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"#text":"[[false, 23.05, -87.25], [true, 53.85, -140.65], [true, 94.85, -117], [true, 63.95, -63.45], [true, 81.3, -45.95, 87.1, -23.65], [true, 58.8, -23.65], [true, 58.8, 23.7], [true, 87.1, 23.7], [true, 81.25, 45.9, 63.95, 63.4], [true, 114.95, 147], [true, 73.95, 170.7], [true, 23.05, 87.2], [true, 12.1, 90, 0, 90], [true, -12.1, 90, -23.05, 87.2], [true, -53.9, 140.7], [true, -94.95, 117.05], [true, -63.95, 63.4], [true, -81.25, 45.95, -87.05, 23.7], [true, -58.75, 23.7], [true, -58.75, -23.65], [true, -87.05, -23.65], [true, -81.3, -46, -63.9, -63.45], [true, -94.85, -117], [true, -53.85, -140.7], [true, -23, -87.25], [true, -12.1, -90.05, 0, -90], [true, 12.1, -90.05, 23.05, -87.25]]","@_type":"sim","@_ct":"POLYGON2","@_rt":"BOUNCE"},"ctrl":{"@_type":"spin","@_method":"cpu","@_dir":"1"},"@_id":"gear","@_map":"1","@_cid":"52","@_ctype":"block","@_cname":"Dynamo"},{"obj":{"@_type":"symbol","@_symbolname":"pushbox","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"vel","@_ct":"OBB","@_rt":"BOUNCE"},"ctrl":{"@_type":"push","@_locky":"1"},"@_id":"pushbox","@_type":"control","@_map":"1","@_cid":"64","@_ctype":"block","@_cname":"Crate","@_calt":"You can push this crate around to help you climb"},{"obj":{"@_type":"symbol","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"#text":"[[false, 24, -124], [true, -24, -124], [true, -24, -24], [true, -124, -24], [true, -124, 24], [true, -24, 24], [true, -24, 124], [true, 24, 124], [true, 24, 24], [true, 124, 24], [true, 124, -24], [true, 24, -24], [true, 24, -124]]","@_type":"sim","@_ct":"POLYGON2","@_rt":"BOUNCE"},"ctrl":{"@_type":"spin","@_method":"cpu","@_dir":"1"},"@_id":"windmill","@_map":"1","@_cid":"53","@_ctype":"block","@_cname":"Windmill","@_calt":"Turns clockwise and pushes you"},{"obj":{"@_type":"symbol","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"#text":"[[false, 24, -124], [true, -24, -124], [true, -24, -24], [true, -124, -24], [true, -124, 24], [true, -24, 24], [true, -24, 124], [true, 24, 124], [true, 24, 24], [true, 124, 24], [true, 124, -24], [true, 24, -24], [true, 24, -124]]","@_type":"sim","@_ct":"POLYGON2","@_rt":"BOUNCE"},"ctrl":{"@_type":"spin","@_method":"cpu","@_dir":"-1"},"@_id":"windmill2","@_map":"1","@_cid":"54","@_ctype":"block","@_cname":"Windmill","@_calt":"Turns counter-clockwise and pushes you"},{"obj":{"@_type":"symbol","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"BOUNCE"},"ctrl":{"@_type":"spin","@_method":"cpu","@_dir":"2"},"@_id":"cog","@_map":"1","@_cid":"55","@_ctype":"block","@_cname":"Gear","@_calt":"Turns clockwise and pushes you"},{"obj":{"@_type":"symbol","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"BOUNCE"},"ctrl":{"@_type":"spin","@_method":"cpu","@_dir":"-2"},"@_id":"cog2","@_map":"1","@_cid":"56","@_ctype":"block","@_cname":"Gear","@_calt":"Turns counter-clockwise and pushes you"},{"obj":{"@_type":"symbol","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"BOUNCE"},"ctrl":{"@_type":"spin","@_method":"cpu","@_dir":"2"},"@_id":"coglarge","@_map":"1","@_cid":"57","@_ctype":"block","@_cname":"BigGear","@_calt":"Turns clockwise and pushes you"},{"obj":{"@_type":"symbol","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"BOUNCE"},"ctrl":{"@_type":"spin","@_method":"cpu","@_dir":"-2"},"@_id":"coglarge2","@_map":"1","@_cid":"58","@_ctype":"block","@_cname":"BigGear","@_calt":"Turns counter-clockwise and pushes you"},{"obj":{"@_type":"symbol","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.1"},"simobj":{"#text":"[[false, 150.1, -8], [true, 150.1, 8], [true, 130.1, 19.7], [true, -130.1, 19.7], [true, -150.1, 8], [true, -150.1, -8], [true, -130.1, -19.6], [true, 130.1, -19.6], [true, 150.1, -8]]","@_type":"sim","@_ct":"POLYGON2","@_rt":"BOUNCE"},"ctrl":{"@_type":"spin","@_method":"cpu","@_dir":"1","@_freespin":"1"},"@_id":"rod","@_map":"1","@_cid":"59","@_ctype":"block","@_cname":"Rod","@_calt":"Rotates on contact"},{"obj":{"@_type":"symbol","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.2"},"simobj":{"#text":"[[false, 8.9, -92.9], [true, -92.9, 8.9], [true, -84.85, 35.95], [true, 51.75, 72.55], [true, 72.45, 51.55], [true, 36.05, -84.4], [true, 8.9, -92.9]]","@_type":"sim","@_ct":"POLYGON2","@_rt":"BOUNCE"},"ctrl":{"@_type":"spin","@_method":"cpu","@_dir":"1","@_freespin":"1"},"@_id":"triangle","@_map":"1","@_cid":"60","@_ctype":"block","@_cname":"TriGear","@_calt":"Rotates on contact"},{"options":{"@_skeleton":"simple_skeleton"},"obj":{"@_type":"biped","@_symbolname":"player","@_creatorsymbolname":"player_creator","@_skeleton":"simple_skeleton","@_z":"205"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"mot","@_ct":"CAPSULE","@_rt":"BOUNCE","@_m":"0.5","@_damp":"1","@_rdamp":"0","@_nosleep":"1"},"ctrl":{"@_type":"bipedobj","@_method":"kbd"},"behavior":[{"@_type":"collide"},{"@_type":"stand","@_prio":"30"},{"@_type":"walk","@_sound":"1","@_prio":"20"},{"@_type":"swim","@_prio":"10"},{"@_type":"death","@_style":"bloom","@_prio":"5"}],"sounds":{"@_harm":"boy3,ouch6","@_defend":"boy2","@_die":"die1","@_attackstrong":"aa_boy_yah","@_rightstep":"step1","@_leftstep":"step2","@_rightrun":"aa_run1","@_leftrun":"aa_run2,step2","@_switchfeet":"aa_switchfeet","@_startjump":"aa_switchfeet","@_stomp":"aa_stomp","@_doublejump":"aa_doublejump,aa_doublejump,aa_boy_hee","@_rebirth":"aa_hallelujah","@_whip":"aa_whip","@_strike_middle":"boy4,none","@_strike_high":"boy1,none","@_fall":"punch2","@_hard_landing":"boy2","@_strike_middle_hit":"slash2,slash3,slash4","@_strike_high_hit":"slash1,slash5,slash6","@_strike_middle_defend":"whap2,whap3","@_strike_high_defend":"whap2,whap3","@_bash_middle_hit":"aa_bash_metal","@_bash_low_hit":"aa_bash_metal","@_bash_high_hit":"aa_bash_metal"},"@_id":"player","@_group":"good","@_type":"biped","@_jump":"350","@_health":"200","@_cid":"1","@_ctype":"player","@_cname":"Player"},{"obj":{"@_type":"symbol","@_symbolname":"bat","@_z":"200"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"mot","@_ct":"CIRCLE","@_rt":"BOUNCE","@_m":"0.25","@_damp":"1","@_g":"0","@_rdamp":"0.8"},"ctrl":{"@_type":"flyingenemy","@_method":"cpu","@_range":"0","@_aggression":"100","@_bank":"1","@_speed":"3"},"behavior":[{"@_type":"collide"},{"@_type":"death","@_style":"bloom","@_prio":"5"}],"sounds":{"@_random":"bat1","@_collide":"bite1"},"@_id":"bat","@_group":"evil","@_type":"movable","@_jump":"700","@_health":"10","@_speed":"1","@_strength":"1","@_global":"1","@_cid":"300","@_ctype":"hazard","@_cname":"VampireBat","@_calt":"Flying enemy with a venomous bite"},{"options":{"@_skeleton":"simple_skeleton"},"obj":{"@_type":"biped","@_symbolname":"ninja","@_skeleton":"simple_skeleton","@_z":"200"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"mot","@_ct":"CAPSULE","@_rt":"BOUNCE","@_m":"0.5","@_damp":"1","@_rdamp":"0.8"},"ctrl":{"@_type":"enemy","@_method":"cpu","@_range":"190"},"behavior":[{"@_type":"collide"},{"@_type":"stand","@_prio":"30"},{"@_type":"walk","@_prio":"20"},{"@_type":"swim","@_prio":"10"},{"@_type":"death","@_style":"bloom","@_prio":"5"}],"sounds":{"@_see":"yell1","@_die":"die2","@_jump":"highgrunt1,yell1","@_fall":"punch2","@_strike_middle_hit":"slash2,slash3,slash4","@_strike_high_hit":"slash1,slash5,slash6","@_strike_middle_defend":"whap2,whap3","@_strike_high_defend":"whap2,whap3"},"@_id":"ninja","@_group":"evil","@_type":"biped","@_jump":"400","@_health":"40","@_speed":"1.2","@_strength":"1","@_global":"1","@_cid":"301","@_ctype":"hazard","@_cname":"NinjaBoy","@_calt":"Small enemy with mad skillz"},{"options":{"@_skeleton":"simple_skeleton"},"obj":{"@_type":"biped","@_symbolname":"brute","@_skeleton":"simple_skeleton","@_z":"200"},"material":{"@_cor":"0.5","@_cof":"0.5","@_color":"0xffffff"},"simobj":{"@_type":"mot","@_ct":"CAPSULE","@_rt":"BOUNCE","@_m":"0.5","@_damp":"1","@_rdamp":"0.8"},"ctrl":{"@_type":"enemy","@_method":"cpu"},"behavior":[{"@_type":"collide"},{"@_type":"stand","@_prio":"30"},{"@_type":"walk","@_prio":"20"},{"@_type":"swim","@_prio":"10"},{"@_type":"death","@_style":"bloom","@_prio":"5"}],"sounds":{"@_die":"die2,ouch3","@_fall":"punch2","@_recover":"aa_dizzy_recover","@_harm":"ouch2,ouch5","@_strike_middle_hit":"slash2,slash3,slash4","@_strike_high_hit":"slash1,slash5,slash6","@_strike_middle_defend":"whap2,whap3","@_strike_high_defend":"whap2,whap3"},"@_id":"brute","@_group":"evil","@_type":"biped","@_jump":"700","@_health":"70","@_speed":"1","@_strength":"1","@_global":"1","@_cid":"302","@_ctype":"hazard","@_cname":"Thug","@_calt":"Medium sized enemy with a big machete"},{"options":{"@_skeleton":"simple_skeleton"},"obj":{"@_type":"biped","@_symbolname":"gator","@_skeleton":"simple_skeleton","@_z":"200"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"mot","@_ct":"CAPSULE","@_rt":"BOUNCE","@_m":"0.5","@_damp":"1","@_rdamp":"0.8"},"ctrl":{"@_type":"enemy","@_method":"cpu","@_range":"190"},"behavior":[{"@_type":"collide"},{"@_type":"stand","@_prio":"30"},{"@_type":"walk","@_prio":"20"},{"@_type":"swim","@_prio":"10"},{"@_type":"death","@_style":"bloom","@_prio":"5"}],"sounds":{"@_see":"growl1,lizard2","@_die":"roar2,roar3","@_jump":"lizard4","@_harm":"lizard1,lizard3","@_fall":"punch2"},"@_id":"gator","@_group":"evil","@_type":"biped","@_jump":"700","@_health":"100","@_speed":"0.75","@_strength":"1","@_global":"1","@_cid":"303","@_ctype":"hazard","@_cname":"Snarley","@_calt":"Large enemy with very bad breath"},{"options":{"@_skeleton":"simple_skeleton"},"obj":{"@_type":"biped","@_symbolname":"bull","@_skeleton":"simple_skeleton","@_z":"200"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"mot","@_ct":"CAPSULE","@_rt":"BOUNCE","@_m":"0.5","@_damp":"1","@_rdamp":"0.8"},"ctrl":{"@_type":"enemy","@_method":"cpu","@_range":"60"},"behavior":[{"@_type":"collide"},{"@_type":"stand","@_prio":"30"},{"@_type":"walk","@_prio":"20"},{"@_type":"swim","@_prio":"10"},{"@_type":"death","@_style":"bloom","@_prio":"5"}],"sounds":{"@_see":"grunt2","@_die":"groan1","@_recover":"aa_dizzy_recover","@_jump":"grunt1,none","@_harm":"growl3","@_fall":"punch2","@_strike_middle_hit":"slash1,slash5,slash6","@_strike_high_hit":"slash1,slash5,slash6","@_strike_middle_defend":"whap2,whap3","@_strike_high_defend":"whap2,whap3"},"@_id":"bull","@_group":"evil","@_type":"biped","@_jump":"500","@_health":"100","@_speed":"0.5","@_strength":"1","@_global":"1","@_cid":"304","@_ctype":"hazard","@_cname":"Thor","@_calt":"Large enemy with a deadly mallot"},{"options":{"@_skeleton":"skeleton_longhand"},"obj":{"@_type":"biped","@_symbolname":"ape","@_skeleton":"skeleton_longhand","@_z":"200"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"mot","@_ct":"CAPSULE","@_rt":"BOUNCE","@_m":"1.5","@_damp":"1","@_rdamp":"0.8"},"ctrl":{"@_type":"enemy","@_method":"cpu","@_range":"60"},"behavior":[{"@_type":"collide"},{"@_type":"stand","@_prio":"30"},{"@_type":"walk","@_prio":"20"},{"@_type":"swim","@_prio":"10"},{"@_type":"death","@_style":"bloom","@_prio":"5"}],"sounds":{"@_see":"grunt2","@_die":"groan1","@_jump":"grunt1,none","@_harm":"growl3","@_fall":"punch2","@_punch_middle_hit":"punch4,punch5","@_punch_high_hit":"punch4,punch5"},"@_id":"ape","@_group":"evil","@_type":"biped","@_jump":"1500","@_health":"180","@_speed":"3","@_strength":"1","@_global":"1","@_cid":"305","@_ctype":"hazard","@_cname":"George","@_calt":"Large enemy with a strong punch"},{"options":{"@_skeleton":"skeleton_longhand"},"obj":{"@_type":"biped","@_symbolname":"archer","@_skeleton":"skeleton_longhand","@_z":"200"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"mot","@_ct":"CAPSULE","@_rt":"BOUNCE","@_m":"1.5","@_damp":"1","@_rdamp":"0.8"},"ctrl":{"@_type":"enemy","@_method":"cpu","@_range":"1000"},"behavior":[{"@_type":"collide"},{"@_type":"stand","@_prio":"30"},{"@_type":"walk","@_prio":"20"},{"@_type":"swim","@_prio":"10"},{"@_type":"death","@_style":"bloom","@_prio":"5"}],"sounds":{"@_see":"halt1","@_die":"die2","@_jump":"grunt4,none","@_harm":"grunt3","@_fall":"punch2","@_strike_middle_defend":"whap2,whap3","@_strike_high_defend":"whap2,whap3"},"@_id":"archer","@_group":"evil","@_type":"biped","@_jump":"1500","@_health":"80","@_speed":"3","@_strength":"1","@_global":"1","@_cid":"306","@_ctype":"hazard","@_cname":"Archie","@_calt":"Small Enemy with bow and arrow"},{"options":{"@_skeleton":"skeleton_longhand"},"obj":{"@_type":"biped","@_symbolname":"samurai","@_skeleton":"skeleton_longhand","@_z":"200"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"mot","@_ct":"CAPSULE","@_rt":"BOUNCE","@_m":"1.25","@_damp":"1","@_rdamp":"0.8"},"ctrl":{"@_type":"enemy","@_method":"cpu","@_range":"0"},"behavior":[{"@_type":"collide"},{"@_type":"stand","@_prio":"30"},{"@_type":"walk","@_prio":"20"},{"@_type":"swim","@_prio":"10"},{"@_type":"death","@_style":"bloom","@_prio":"5"}],"sounds":{"@_see":"halt1","@_die":"die2","@_jump":"grunt4,none","@_harm":"grunt3","@_fall":"punch2","@_strike_middle_defend":"whap2,whap3","@_strike_high_defend":"whap2,whap3"},"@_id":"samurai","@_group":"evil","@_type":"biped","@_jump":"1500","@_health":"200","@_speed":"6","@_strength":"1","@_global":"1","@_cid":"308","@_ctype":"hazard","@_cname":"Kikuchiyo","@_calt":"Large samurai warrior"},{"options":{"@_skeleton":"simple_skeleton"},"obj":{"@_type":"biped","@_symbolname":"mongol","@_skeleton":"simple_skeleton","@_z":"200"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"mot","@_ct":"CAPSULE","@_rt":"BOUNCE","@_m":"0.8","@_damp":"1","@_rdamp":"0.8"},"ctrl":{"@_type":"enemy","@_method":"cpu","@_range":"0"},"behavior":[{"@_type":"collide"},{"@_type":"stand","@_prio":"30"},{"@_type":"walk","@_prio":"20"},{"@_type":"swim","@_prio":"10"},{"@_type":"death","@_style":"bloom","@_prio":"5"}],"sounds":{"@_see":"halt1","@_die":"die2","@_recover":"aa_dizzy_recover","@_jump":"grunt4,none","@_harm":"grunt3","@_fall":"punch2","@_strike_middle_defend":"whap2,whap3","@_strike_high_defend":"whap2,whap3"},"@_id":"mongol","@_group":"evil","@_type":"biped","@_jump":"1500","@_health":"50","@_speed":"10","@_strength":"1","@_global":"1","@_cid":"309","@_ctype":"hazard","@_cname":"Mongol","@_calt":"Small Enemy with great speed"},{"options":{"@_skeleton":"simple_skeleton"},"obj":{"@_type":"biped","@_symbolname":"skell","@_skeleton":"simple_skeleton","@_z":"200"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"mot","@_ct":"CAPSULE","@_rt":"BOUNCE","@_m":"0.8","@_damp":"1","@_rdamp":"0.8"},"ctrl":{"@_type":"enemy","@_method":"cpu","@_range":"0"},"behavior":[{"@_type":"collide"},{"@_type":"stand","@_prio":"30"},{"@_type":"walk","@_prio":"20"},{"@_type":"swim","@_prio":"10"},{"@_type":"death","@_style":"bloom","@_prio":"5"}],"sounds":{"@_see":"aa_skell_yah,aa_skell_hah","@_die":"die2","@_recover":"aa_dizzy_recover","@_jump":"aa_skell_ow,none","@_harm":"aa_skell_doh","@_fall":"punch2","@_strike_middle_defend":"whap2,whap3","@_strike_high_defend":"whap2,whap3"},"@_id":"skell","@_group":"evil","@_type":"biped","@_jump":"1200","@_health":"50","@_speed":"5","@_strength":"1","@_global":"1","@_cid":"349","@_ctype":"hazard","@_cname":"Skelly","@_calt":"Small Enemy with great speed"},{"options":{"@_skeleton":"skeleton_longhand"},"obj":{"@_type":"biped","@_symbolname":"firetroll","@_skeleton":"skeleton_longhand","@_z":"200"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"mot","@_ct":"CAPSULE","@_rt":"BOUNCE","@_m":"1.5","@_damp":"1","@_rdamp":"0.8"},"ctrl":{"@_type":"enemy","@_method":"cpu","@_range":"400"},"behavior":[{"@_type":"collide"},{"@_type":"stand","@_prio":"30"},{"@_type":"walk","@_prio":"20"},{"@_type":"swim","@_prio":"10"},{"@_type":"death","@_style":"bloom","@_prio":"5"}],"sounds":{"@_see":"grunt2","@_die":"groan1","@_jump":"grunt1,none","@_harm":"growl3","@_fall":"punch2","@_strike_middle_hit":"slash1,slash5,slash6","@_strike_high_hit":"slash1,slash5,slash6","@_strike_middle_defend":"whap2,whap3","@_strike_high_defend":"whap2,whap3"},"@_id":"firetroll","@_group":"evil","@_type":"biped","@_jump":"1500","@_health":"250","@_speed":"3","@_strength":"1","@_global":"1","@_cid":"310","@_ctype":"hazard","@_cname":"FireTroll","@_calt":"Large enemy with a giant cannon"},{"obj":{"@_type":"symbol","@_z":"200"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"mot","@_ct":"CIRCLE","@_rt":"BOUNCE","@_m":"0.5","@_damp":"0.9","@_g":"0.01","@_rdamp":"0.8"},"ctrl":{"@_type":"flyingenemyprobe","@_method":"cpu","@_range":"300","@_aggression":"100","@_fire":"laser","@_firedelay":"250","@_firepower":"100","@_bank":"1","@_speed":"3"},"behavior":[{"@_type":"collide"},{"@_type":"death","@_style":"shatter","@_radius":"20","@_prio":"5"}],"sounds":"","@_id":"probe","@_group":"evil","@_type":"movable","@_health":"20","@_speed":"1","@_strength":"1","@_global":"1","@_cid":"307","@_ctype":"hazard","@_cname":"Probe","@_calt":"Flying robotic enemy with a deadly laser."},{"obj":{"@_type":"turretsymbol","@_symbolname":"gunbot","@_z":"100"},"material":{"@_cor":"0.5","@_cof":"0.5","@_color":"0x666666"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"behavior":{"@_type":"death","@_style":"shatter","@_radius":"20","@_prio":"5"},"ctrl":{"@_type":"turretenemy","@_method":"cpu","@_range":"500","@_aggression":"100","@_fire":"laser","@_firedelay":"300","@_firepower":"100","@_speed":"1"},"sounds":{"@_die":"aa_small_shatter"},"@_id":"turret","@_version":"2","@_group":"evil","@_type":"control","@_health":"10","@_map":"1","@_rotate":"true","@_speed":"1","@_strength":"1","@_cid":"311","@_ctype":"hazard","@_cname":"Turret","@_calt":"Stationary enemy with a deadly laser."},{"obj":{"@_type":"mech","@_symbolname":"enemymech","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.9","@_color":"0xff0000"},"simobj":{"@_type":"mot","@_ct":"CAPSULE","@_rt":"BOUNCE","@_m":"2","@_damp":"0.15","@_rdamp":"0","@_buoyancy":"-200"},"behavior":{"@_type":"death","@_style":"shatter","@_radius":"80","@_prio":"5","@_effect":"explosionbig"},"ctrl":{"@_type":"mech","@_method":"cpu","@_fire":"laser","@_speed":"20","@_aggression":"100","@_range":"120","@_firedelay":"250","@_firepower":"10"},"sounds":{"@_die":"aa_big_shatter","@_see":"aa_mech_active","@_walk":"aa_mechwalk","@_step":"aa_mechstep","@_punch":"aa_mech_punch","@_miss":"whoosh1"},"@_id":"enemymech","@_version":"2","@_group":"evil","@_cid":"313","@_ctype":"hazard","@_cname":"EnemyMech","@_type":"movable","@_global":"1","@_health":"250","@_calt":"The enemy mech gives a powerful punch!"},{"obj":{"@_type":"segsymbol","@_creatorsymbolname":"segunit_creator","@_z":"200"},"material":{"@_cor":"0.5","@_cof":"0.5","@_color":"0xccb501"},"simobj":{"@_type":"mot","@_ct":"CIRCLE","@_rt":"BOUNCE","@_m":"0.5","@_damp":"1","@_g":"0.01","@_rdamp":"0"},"ctrl":{"@_type":"seg","@_method":"cpu","@_range":"300","@_aggression":"100"},"behavior":{"@_type":"death","@_style":"shatter","@_radius":"20","@_prio":"5"},"sounds":{"@_see":"aa_segunit3","@_harm":"aa_segunit4","@_die":"aa_small_shatter"},"@_id":"segunit","@_version":"2","@_group":"evil","@_type":"movable","@_health":"20","@_speed":"1","@_strength":"1","@_global":"1","@_cid":"312","@_ctype":"hazard","@_cname":"SegFault","@_calt":"Roaming enemy that causes mischief."},{"obj":{"@_type":"symbol","@_z":"200"},"material":{"@_cor":"0.5","@_cof":"0.5","@_color":"0xccb501"},"simobj":{"@_type":"mot","@_ct":"CAPSULE","@_rt":"BOUNCE","@_m":"0.5","@_damp":"1","@_g":"1","@_rdamp":"0","@_buoyancy":"100"},"behavior":{"@_type":"death","@_style":"bloom","@_prio":"5"},"ctrl":{"@_type":"swim","@_method":"cpu","@_speed":"10","@_firedelay":"500","@_aggression":"100","@_range":"100"},"sounds":{"@_bite":"aa_bite"},"@_id":"shark","@_version":"2","@_group":"evil","@_global":"1","@_type":"movable","@_health":"80","@_speed":"1","@_strength":"1","@_cid":"314","@_ctype":"hazard","@_cname":"Shark","@_calt":"Sharks must stay in water to live"},{"obj":{"@_type":"symbol","@_z":"200"},"material":{"@_cor":"0.5","@_cof":"0.5","@_color":"0xccb501"},"simobj":{"@_type":"mot","@_ct":"CAPSULE","@_rt":"BOUNCE","@_m":"0.5","@_damp":"1","@_g":"1","@_rdamp":"0","@_buoyancy":"100"},"behavior":{"@_type":"death","@_style":"bloom","@_prio":"5"},"ctrl":{"@_type":"swim","@_method":"cpu","@_speed":"3","@_firedelay":"1000","@_aggression":"100","@_range":"100"},"sounds":{"@_bite":"aa_bite"},"@_id":"grouperfish","@_version":"2","@_group":"evil","@_global":"1","@_type":"movable","@_health":"240","@_speed":"1","@_strength":"1","@_cid":"315","@_ctype":"hazard","@_cname":"Leonard","@_calt":"Leonard is slow, but he\'s hungry!"},{"options":{"@_skeleton":"simple_skeleton"},"obj":{"@_type":"biped","@_symbolname":"mutant","@_skeleton":"simple_skeleton","@_z":"200"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"mot","@_ct":"CAPSULE","@_rt":"BOUNCE","@_m":"0.5","@_damp":"1","@_rdamp":"0.8"},"ctrl":{"@_type":"enemy","@_method":"cpu","@_range":"15","@_aggression":"100"},"behavior":[{"@_type":"collide"},{"@_type":"stand","@_prio":"30"},{"@_type":"walk","@_prio":"20"},{"@_type":"swim","@_prio":"10"},{"@_type":"death","@_style":"bloom","@_prio":"5"}],"sounds":{"@_see":"aa_mutant1,aa_growl","@_die":"aa_mutant2","@_jump":"grunt4","@_harm":"growl2,growl4,aa_growl","@_fall":"punch2","@_scratch_high_hit":"slash1,slash5,slash6","@_scratch_middle_hit":"slash1,slash5,slash6"},"@_id":"mutant","@_version":"2","@_group":"evil","@_type":"biped","@_jump":"500","@_health":"60","@_speed":"2","@_strength":"1","@_global":"1","@_cid":"316","@_ctype":"hazard","@_cname":"Mutant"},{"options":{"@_skeleton":"simple_skeleton"},"obj":{"@_type":"biped","@_symbolname":"mutant2","@_skeleton":"simple_skeleton","@_z":"200"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"mot","@_ct":"CAPSULE","@_rt":"BOUNCE","@_m":"0.5","@_damp":"1","@_rdamp":"0.8"},"ctrl":{"@_type":"enemy","@_method":"cpu","@_range":"15","@_aggression":"100"},"behavior":[{"@_type":"collide"},{"@_type":"stand","@_prio":"30"},{"@_type":"walk","@_prio":"20"},{"@_type":"swim","@_prio":"10"},{"@_type":"death","@_style":"bloom","@_prio":"5"}],"sounds":{"@_see":"aa_mutant1","@_die":"aa_mutant2","@_jump":"grunt4","@_harm":"growl2,growl4,aa_growl","@_fall":"punch2","@_scratch_high_hit":"slash1,slash5,slash6","@_scratch_middle_hit":"slash1,slash5,slash6"},"@_id":"mutant2","@_version":"2","@_group":"evil","@_type":"biped","@_jump":"500","@_health":"60","@_speed":"1","@_strength":"1","@_global":"1","@_cid":"317","@_ctype":"hazard","@_cname":"Mutant"},{"options":{"@_skeleton":"simple_skeleton"},"obj":{"@_type":"biped","@_symbolname":"mutant3","@_skeleton":"simple_skeleton","@_z":"200"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"mot","@_ct":"CAPSULE","@_rt":"BOUNCE","@_m":"0.75","@_damp":"1","@_rdamp":"0.8"},"ctrl":{"@_type":"enemy","@_method":"cpu","@_range":"15","@_aggression":"100"},"behavior":[{"@_type":"collide"},{"@_type":"stand","@_prio":"30"},{"@_type":"walk","@_prio":"20"},{"@_type":"swim","@_prio":"10"},{"@_type":"death","@_style":"bloom","@_prio":"5"}],"sounds":{"@_see":"aa_deep_growl","@_die":"groan4","@_jump":"aa_deep_yeah","@_harm":"aa_meah,aa_deep_oof","@_fall":"punch2","@_scratch_high_hit":"slash1,slash5,slash6","@_scratch_middle_hit":"slash1,slash5,slash6"},"@_id":"mutant3","@_version":"2","@_group":"evil","@_type":"biped","@_jump":"500","@_health":"60","@_speed":"0.6","@_strength":"1","@_global":"1","@_cid":"318","@_ctype":"hazard","@_cname":"Big Mutant"},{"options":{"@_skeleton":"skeleton_longhand"},"obj":{"@_type":"biped","@_symbolname":"native","@_skeleton":"simple_skeleton","@_z":"200"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"mot","@_ct":"CAPSULE","@_rt":"BOUNCE","@_m":"0.5","@_damp":"1","@_rdamp":"0.8"},"ctrl":{"@_type":"rangedenemy","@_method":"cpu","@_range":"600"},"behavior":[{"@_type":"collide"},{"@_type":"stand","@_prio":"30"},{"@_type":"walk","@_prio":"20"},{"@_type":"swim","@_prio":"10"},{"@_type":"death","@_style":"bloom","@_prio":"5"}],"sounds":{"@_see":"aa_native1,aa_native2","@_die":"aa_scream2","@_jump":"aa_guy_eee","@_harm":"aa_native3,aa_guy_ooh","@_fall":"punch2","@_strike_middle_defend":"whap2,whap3","@_strike_high_defend":"whap2,whap3"},"@_id":"native","@_version":"2","@_group":"evil","@_type":"biped","@_jump":"1500","@_health":"40","@_speed":"3","@_strength":"1","@_global":"1","@_cid":"319","@_ctype":"hazard","@_cname":"Native","@_calt":"Small enemy with a spear"},{"options":{"@_skeleton":"simple_skeleton"},"obj":{"@_type":"biped","@_symbolname":"merc","@_skeleton":"simple_skeleton","@_z":"200"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"mot","@_ct":"CAPSULE","@_rt":"BOUNCE","@_m":"0.8","@_damp":"0.1","@_rdamp":"0.8"},"ctrl":{"@_type":"rangedenemy","@_method":"cpu","@_range":"500","@_aggression":"100"},"behavior":[{"@_type":"collide"},{"@_type":"stand","@_prio":"30"},{"@_type":"walk","@_prio":"20"},{"@_type":"swim","@_prio":"10"},{"@_type":"death","@_style":"bloom","@_prio":"5"}],"sounds":{"@_see":"aa_guymasked_halt","@_die":"aa_scream","@_jump":"aa_guymasked_eee","@_kick":"whoosh1","@_harm":"aa_guymasked_ow,aa_guymasked_ooh,aa_guymasked_aah","@_fall":"punch2","@_strike_middle_defend":"whap2,whap3","@_strike_high_defend":"whap2,whap3"},"@_id":"merc","@_version":"2","@_group":"evil","@_type":"biped","@_jump":"1500","@_health":"50","@_speed":"1","@_strength":"1","@_global":"1","@_cid":"320","@_ctype":"hazard","@_cname":"Mercenary","@_calt":"Futuristic enemy with a laser gun"},{"options":{"@_skeleton":"simple_skeleton"},"obj":{"@_type":"biped","@_symbolname":"minion","@_skeleton":"simple_skeleton","@_z":"200"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"mot","@_ct":"CAPSULE","@_rt":"BOUNCE","@_m":"0.8","@_damp":"0.2","@_rdamp":"0.8"},"ctrl":{"@_type":"rangedenemy","@_method":"cpu","@_range":"400","@_speed":"1","@_aggression":"400","@_firedelay":"200"},"behavior":[{"@_type":"collide"},{"@_type":"stand","@_prio":"30"},{"@_type":"walk","@_prio":"20"},{"@_type":"swim","@_prio":"10"},{"@_type":"death","@_style":"bloom","@_prio":"5"}],"sounds":{"@_see":"aa_guymasked_halt","@_die":"aa_scream","@_kick":"whoosh1","@_jump":"aa_guymasked_eee","@_harm":"aa_guymasked_ow,aa_guymasked_ooh,aa_guymasked_aah","@_fall":"punch2","@_strike_middle_defend":"whap2,whap3","@_strike_high_defend":"whap2,whap3"},"@_id":"minion","@_version":"2","@_group":"evil","@_type":"biped","@_jump":"1500","@_health":"50","@_speed":"0.5","@_strength":"1","@_global":"1","@_cid":"321","@_ctype":"hazard","@_cname":"Minion","@_calt":"Futuristic enemy with a staff weapon"},{"options":{"@_skeleton":"skeleton_longhand"},"obj":{"@_type":"biped","@_symbolname":"rocky","@_skeleton":"skeleton_longhand","@_z":"200"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"mot","@_ct":"CAPSULE","@_rt":"BOUNCE","@_m":"1.5","@_damp":"1","@_rdamp":"0.8"},"ctrl":{"@_type":"enemy","@_method":"cpu","@_range":"130"},"behavior":[{"@_type":"collide"},{"@_type":"stand","@_prio":"30"},{"@_type":"walk","@_prio":"20"},{"@_type":"swim","@_prio":"10"},{"@_type":"death","@_style":"bloom","@_prio":"5"}],"sounds":{"@_see":"aa_rocky1","@_die":"groan1","@_jump":"grunt1,woahdeep1","@_kick":"whoosh1","@_harm":"growl3,aa_rocky2","@_fall":"punch2","@_punch_middle_hit":"aa_punch6","@_punch_high_hit":"aa_punch6"},"@_id":"rocky","@_version":"2","@_group":"evil","@_type":"biped","@_jump":"1500","@_health":"500","@_speed":"2","@_strength":"1","@_global":"1","@_cid":"322","@_ctype":"hazard","@_cname":"Rocky","@_calt":"Large enemy with a strong punch"},{"options":{"@_skeleton":"simple_skeleton"},"obj":{"@_type":"biped","@_symbolname":"robot2","@_skeleton":"simple_skeleton","@_z":"200"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"mot","@_ct":"CAPSULE","@_rt":"BOUNCE","@_m":"0.5","@_damp":"1","@_rdamp":"0.8"},"ctrl":{"@_type":"enemy","@_method":"cpu","@_range":"15","@_aggression":"100"},"behavior":[{"@_type":"collide"},{"@_type":"stand","@_prio":"30"},{"@_type":"walk","@_prio":"20"},{"@_type":"swim","@_prio":"10"},{"@_type":"death","@_style":"shatter","@_radius":"40","@_prio":"5"}],"sounds":{"@_see":"aa_robot1,aa_segunit1","@_die":"aa_small_shatter","@_jump":"aa_segunit2","@_harm":"aa_robot2,aa_segunit2,aa_tiny_shatter","@_fall":"punch2","@_scratch_high_hit":"slash1,slash5,slash6","@_scratch_middle_hit":"slash1,slash5,slash6"},"@_id":"robot2","@_version":"2","@_group":"evil","@_type":"biped","@_jump":"500","@_health":"60","@_speed":"2","@_strength":"1","@_global":"1","@_cid":"323","@_ctype":"hazard","@_cname":"Robot"},{"obj":{"@_type":"mech","@_symbolname":"robot1","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.9","@_color":"0x999999"},"simobj":{"@_type":"mot","@_ct":"CAPSULE","@_rt":"BOUNCE","@_m":"1.5","@_damp":"0.15","@_rdamp":"0","@_buoyancy":"-200"},"behavior":{"@_type":"death","@_style":"shatter","@_radius":"80","@_prio":"5","@_effect":"explosionbig"},"ctrl":{"@_type":"mech","@_method":"cpu","@_fire":"laser","@_speed":"1","@_aggression":"100","@_range":"120","@_firedelay":"250","@_firepower":"5"},"sounds":{"@_see":"aa_robot3","@_die":"aa_big_shatter","@_walk":"aa_mechwalk3","@_step":"aa_mechstep","@_punch":"aa_mech_punch","@_miss":"whoosh1"},"@_id":"robot1","@_version":"2","@_group":"evil","@_cid":"324","@_ctype":"hazard","@_cname":"Big Robot","@_speed":"0.5","@_type":"movable","@_global":"1","@_health":"250","@_calt":"The big robot gives a powerful punch!"},{"obj":{"@_type":"symbol","@_symbolname":"hotblock","@_castshadow":"1","@_receiveshadow":"0","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.5","@_self_illuminate":"1"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"ctrl":{"@_type":"harmtouch","@_method":"cpu","@_strength":"1","@_effect":"burneffect"},"sounds":{"@_collide":"burning1"},"@_id":"hotblock","@_map":"1","@_cid":"100","@_ctype":"hazard","@_cname":"HotBlock","@_calt":"Causes damage when touched"},{"obj":{"@_type":"symbol","@_symbolname":"icicle","@_z":"30"},"simobj":{"@_type":"vel","@_ct":"CAPSULE","@_rt":"REPORT_ONLY"},"ctrl":{"@_type":"drop","@_method":"cpu","@_strength":"10","@_effect":"droptoucheffect"},"@_id":"icicle","@_type":"control","@_cid":"101","@_ctype":"hazard","@_cname":"Spike","@_calt":"Will fall and cause damage if walked under"},{"obj":{"@_type":"symbol","@_castshadow":"1","@_receiveshadow":"0","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"ctrl":{"@_type":"harmtouch","@_method":"cpu","@_strength":"20","@_pressure":"1","@_effect":"droptoucheffect"},"@_id":"spikeblock","@_map":"1","@_cid":"106","@_ctype":"hazard","@_cname":"SpikeBlock","@_calt":"Causes damage when you fall on it"},{"obj":{"@_type":"symbol","@_receiveshadow":"1","@_z":"10"},"material":{"@_cor":"0.7","@_cof":"0.5"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"behavior":{"@_type":"weakblock","@_strength":"8","@_damage":"hit","@_explode":"1","@_radius":"100"},"sounds":{"@_explode":"explosion_bigger"},"@_id":"barrel","@_type":"control","@_map":"1","@_cid":"107","@_ctype":"hazard","@_cname":"Barrel","@_calt":"Shoot this and it explodes"},{"obj":{"@_type":"symbol","@_symbolname":"beam_harmer","@_z":"10"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"SLOW"},"ctrl":{"@_type":"beam","@_strength":"1","@_sound":"beam1"},"@_id":"beam_harmer","@_map":"0","@_cid":"102","@_ctype":"hazard","@_cname":"EnergyBeam","@_calt":"Causes damage when walked through"},{"obj":{"@_type":"symbol","@_z":"10","@_r":"-90"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"BOUNCE"},"ctrl":{"@_type":"proximity","@_method":"cpu","@_spawn":"steam","@_range":"300","@_delay":"5000"},"@_id":"steamer","@_type":"control","@_cid":"103","@_ctype":"hazard","@_cname":"Steamer","@_calt":"Slight damage with vertical force"},{"obj":{"@_type":"symbol","@_symbolname":"crusher","@_creatorsymbolname":"crusher_creator","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"IGNORE","@_pen":"15"},"ctrl":{"@_type":"crusher","@_method":"cpu","@_speed":"3"},"@_id":"crusher","@_version":"2","@_type":"control","@_map":"1","@_rotate":"true","@_cid":"220","@_ctype":"hazard","@_cname":"Crusher","@_calt":"Large motorized compactor that causes damage if it closes on you"},{"obj":{"@_type":"symbol","@_symbolname":"wheel","@_z":"20"},"material":{"@_cor":"1","@_cof":"0.1","@_self_illuminate":"1"},"simobj":{"@_type":"mot","@_ct":"CIRCLE","@_rt":"BOUNCE","@_m":"0.4","@_g":"0.5","@_damp":"1","@_rdamp":"0.1"},"@_id":"wheel","@_cid":"104","@_ctype":"hazard","@_cname":"Wheel"},{"obj":{"@_type":"symbol","@_symbolname":"wheelsmall","@_z":"20"},"material":{"@_cor":"1","@_cof":"0.1"},"simobj":{"@_type":"mot","@_ct":"CIRCLE","@_rt":"BOUNCE","@_m":"0.4","@_g":"0.5","@_damp":"1","@_rdamp":"0.1"},"@_id":"wheelsmall","@_cid":"105","@_ctype":"hazard","@_cname":"SmallWheel"},{"obj":{"@_type":"symbol","@_z":"300"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"PASSTHROUGH"},"ctrl":{"@_type":"power","@_method":"cpu","@_attrib":"extralife","@_power":"1","@_sound":"aa_powerup_chime"},"@_id":"extralife","@_version":"2","@_cid":"216","@_ccache":"1","@_ctype":"powerup","@_cname":"Extra Life","@_calt":""},{"obj":{"@_type":"symbol","@_z":"100"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"PASSTHROUGH"},"ctrl":{"@_type":"power","@_method":"cpu","@_attrib":"checkpoint","@_power":"1","@_restore":"5000","@_sound":"clash11"},"@_id":"checkpoint","@_version":"2","@_cid":"217","@_ctype":"powerup","@_ccache":"1","@_cname":"Checkpoint","@_calt":"When touched, it sets the place where extra lives respawn."},{"obj":{"@_type":"symbol","@_z":"300"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"PASSTHROUGH"},"ctrl":{"@_type":"power","@_method":"cpu","@_attrib":"torch","@_addtobelt":"1","@_restore":"20000"},"@_id":"newtorch","@_cid":"150","@_ctype":"tool","@_ccache":"1","@_cname":"Torch","@_calt":"Allows you to see in the dark"},{"obj":{"@_type":"symbol","@_z":"300"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"PASSTHROUGH"},"ctrl":{"@_type":"power","@_method":"cpu","@_attrib":"shield","@_power":"15","@_addtobelt":"1","@_restore":"20000"},"@_id":"newshield","@_cid":"151","@_ctype":"tool","@_ccache":"1","@_cname":"Shield","@_calt":"Get strong defense by holding down the SHIFT key"},{"obj":{"@_type":"symbol","@_z":"300"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"PASSTHROUGH"},"ctrl":{"@_type":"power","@_method":"cpu","@_attrib":"armor","@_power":"1","@_sound":"aa_sword_scrape","@_restore":"20000"},"@_id":"armor1","@_cid":"208","@_ctype":"powerup","@_ccache":"1","@_cname":"Armor I"},{"obj":{"@_type":"symbol","@_z":"300"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"PASSTHROUGH"},"ctrl":{"@_type":"power","@_method":"cpu","@_attrib":"armor","@_power":"2","@_sound":"aa_sword_scrape","@_restore":"20000"},"@_id":"armor2","@_cid":"209","@_ctype":"powerup","@_ccache":"1","@_cname":"Armor II"},{"obj":{"@_type":"symbol","@_z":"300"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"PASSTHROUGH"},"ctrl":{"@_type":"power","@_method":"cpu","@_attrib":"armor","@_power":"3","@_sound":"aa_sword_scrape","@_restore":"20000"},"@_id":"armor3","@_cid":"210","@_ctype":"powerup","@_ccache":"1","@_cname":"Armor III"},{"obj":{"@_type":"symbol","@_z":"300"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"PASSTHROUGH"},"ctrl":{"@_type":"power","@_method":"cpu","@_attrib":"stomp","@_power":"1","@_restore":"30000","@_sound":"aa_ability"},"@_id":"abilitystomp","@_version":"2","@_cid":"213","@_ctype":"powerup","@_ccache":"1","@_cname":"Stomp Ability","@_calt":"Allows you to stomp by pressing down after a jump."},{"obj":{"@_type":"symbol","@_z":"300"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"PASSTHROUGH"},"ctrl":{"@_type":"power","@_method":"cpu","@_attrib":"roll","@_power":"1","@_restore":"30000","@_sound":"aa_ability"},"@_id":"abilityroll","@_version":"2","@_cid":"214","@_ctype":"powerup","@_ccache":"1","@_cname":"Roll Ability","@_calt":"Allows you to roll by pressing down after a flip."},{"obj":{"@_type":"symbol","@_z":"300"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"PASSTHROUGH"},"ctrl":{"@_type":"power","@_method":"cpu","@_attrib":"smash","@_power":"1","@_restore":"30000","@_sound":"aa_ability"},"@_id":"abilitysmash","@_version":"2","@_cid":"215","@_ctype":"powerup","@_ccache":"1","@_cname":"Smash Ability","@_calt":"Allows you to smash by pressing down after a jump and swing of your sword."},{"obj":{"@_type":"symbol","@_z":"300"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"PASSTHROUGH"},"ctrl":{"@_type":"power","@_method":"cpu","@_attrib":"doublejump","@_power":"1","@_restore":"30000","@_sound":"aa_ability"},"@_id":"abilitydoublejump","@_version":"2","@_cid":"221","@_ctype":"powerup","@_ccache":"1","@_cname":"DoubleJump","@_calt":"Allows you to double jump by pressing up after a jump."},{"obj":{"@_type":"symbol","@_z":"300"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"PASSTHROUGH"},"ctrl":{"@_type":"power","@_method":"cpu","@_attrib":"backpack","@_power":"150","@_addtobelt":"1","@_restore":"20000"},"@_id":"newjetpack","@_cid":"152","@_ctype":"tool","@_cname":"JetPack","@_ccache":"1","@_calt":"Allows you to fly by holding the C key"},{"obj":{"@_type":"symbol","@_z":"300"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"PASSTHROUGH"},"ctrl":{"@_type":"power","@_method":"cpu","@_attrib":"gun","@_power":"15","@_addtobelt":"1","@_restore":"40000"},"@_id":"newgun","@_cid":"153","@_ctype":"tool","@_cname":"Gun","@_ccache":"1","@_calt":"Rapid fire laser weapon"},{"obj":{"@_type":"symbol","@_z":"300"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"PASSTHROUGH"},"ctrl":{"@_type":"power","@_method":"cpu","@_attrib":"guntriple","@_power":"15","@_addtobelt":"1"},"@_id":"newguntriple","@_cid":"158","@_ctype":"tool","@_ccache":"1","@_cname":"BlastGun","@_calt":"Triple-fire laser action"},{"obj":{"@_type":"symbol","@_z":"300"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"PASSTHROUGH"},"ctrl":{"@_type":"power","@_method":"cpu","@_attrib":"blaster","@_power":"5","@_addtobelt":"1"},"@_id":"newblaster","@_cid":"154","@_ctype":"tool","@_ccache":"1","@_cname":"RailGun","@_calt":"High power pulse weapon"},{"obj":{"@_type":"symbol","@_z":"300"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"PASSTHROUGH"},"ctrl":{"@_type":"power","@_method":"cpu","@_attrib":"mousegun","@_power":"20","@_addtobelt":"1"},"@_id":"newmousegun","@_version":"2","@_cid":"163","@_ctype":"tool","@_ccache":"1","@_cname":"Mouse Gun","@_calt":"High precision laser weapon controlled by the mouse. 20 shots per powerup."},{"obj":{"@_type":"symbol","@_z":"300"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"PASSTHROUGH"},"ctrl":{"@_type":"power","@_method":"cpu","@_attrib":"flamethrower","@_power":"10","@_addtobelt":"1"},"@_id":"newflamethrower","@_cid":"159","@_ctype":"tool","@_ccache":"1","@_cname":"FlameThrower","@_calt":"Your favorite propane accessory"},{"obj":{"@_type":"symbol","@_z":"300"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"PASSTHROUGH"},"ctrl":{"@_type":"power","@_method":"cpu","@_attrib":"grenade","@_power":"3","@_addtobelt":"1"},"@_id":"newgrenade","@_cid":"155","@_ctype":"tool","@_ccache":"1","@_cname":"Grenades","@_calt":"High power explosives"},{"obj":{"@_type":"symbol","@_z":"300"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"PASSTHROUGH"},"ctrl":{"@_type":"power","@_method":"cpu","@_attrib":"grapple","@_power":"300","@_addtobelt":"1","@_restore":"20000"},"@_id":"newgrapplegun","@_cid":"156","@_ctype":"tool","@_ccache":"1","@_cname":"Grapple","@_calt":"Allows you to hook onto objects and swing by holding the SHIFT key"},{"obj":{"@_type":"symbol","@_z":"300"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"PASSTHROUGH"},"ctrl":{"@_type":"power","@_method":"cpu","@_attrib":"powerglove","@_power":"150","@_addtobelt":"1","@_restore":"20000"},"@_id":"newpowerglove","@_cid":"157","@_ctype":"tool","@_ccache":"1","@_cname":"PowerGluv","@_calt":"Allows you to move objects with your mind by holding the SHIFT key"},{"obj":{"@_type":"symbol","@_z":"300"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"PASSTHROUGH"},"ctrl":{"@_type":"power","@_method":"cpu","@_attrib":"bigsword","@_power":"20","@_addtobelt":"1"},"@_id":"newbigsword","@_version":"2","@_cid":"160","@_ctype":"tool","@_ccache":"1","@_cname":"Big Sword","@_calt":"A more powerful sword you can bash with, 20 swings per powerup"},{"obj":{"@_type":"symbol","@_z":"300"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"PASSTHROUGH"},"ctrl":{"@_type":"power","@_method":"cpu","@_attrib":"mace","@_power":"20","@_addtobelt":"1"},"@_id":"newmace","@_version":"2","@_cid":"161","@_ctype":"tool","@_ccache":"1","@_cname":"Mace","@_calt":"A very powerful melee weapon, 20 swings per powerup"},{"obj":{"@_type":"symbol","@_z":"300"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"PASSTHROUGH"},"ctrl":{"@_type":"power","@_method":"cpu","@_attrib":"whip","@_power":"0","@_addtobelt":"1"},"@_id":"newwhip","@_version":"2","@_cid":"162","@_ctype":"tool","@_ccache":"1","@_cname":"Whip","@_calt":"Oh snap! No you didn\'t!"},{"obj":{"@_type":"symbol","@_z":"300"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"REPORT_ONLY"},"ctrl":{"@_type":"power","@_method":"cpu","@_attrib":"health","@_power":"10"},"@_id":"nugget","@_cid":"200","@_ctype":"powerup","@_ccache":"1","@_cname":"Cookie","@_calt":"Gives you +5 health"},{"obj":{"@_type":"symbol","@_z":"300"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"REPORT_ONLY"},"ctrl":{"@_type":"power","@_method":"cpu","@_attrib":"health","@_power":"50"},"@_id":"megahealth","@_cid":"201","@_ctype":"powerup","@_ccache":"1","@_cname":"MedKit","@_calt":"Gives you +50 health"},{"obj":{"@_type":"symbol","@_z":"300"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"REPORT_ONLY"},"ctrl":{"@_type":"power","@_method":"cpu","@_attrib":"crystal","@_global":"1","@_power":"1","@_spendatend":"1","@_sound":"crystal"},"@_id":"crystal","@_goal":"1","@_cid":"202","@_ctype":"powerup","@_ccache":"1","@_cname":"Crystal","@_calt":"Adding this object to your game will change it to a \'Capture the Crystal\' game"},{"obj":{"@_type":"symbol","@_z":"300"},"material":"","simobj":{"@_type":"vel","@_ct":"CIRCLE","@_rt":"REPORT_ONLY"},"ctrl":{"@_type":"escapepod","@_method":"cpu"},"@_id":"escapepod","@_goal":"1","@_unique":"1","@_cid":"212","@_ctype":"powerup","@_cname":"EscapePod","@_calt":"Adding this object to your game will change it to a \'Find the Escape Pod\' game"},{"obj":{"@_type":"symbol","@_z":"300"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"REPORT_ONLY"},"ctrl":{"@_type":"power","@_method":"cpu","@_attrib":"powerglove","@_power":"150"},"@_id":"canisterblue","@_cid":"203","@_ctype":"powerup","@_ccache":"1","@_cname":"GluvEnergy"},{"obj":{"@_type":"symbol","@_z":"300"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"PASSTHROUGH"},"ctrl":{"@_type":"power","@_method":"cpu","@_attrib":"grapple","@_power":"150"},"@_id":"canistergreen","@_cid":"204","@_ctype":"powerup","@_ccache":"1","@_cname":"GrappleEnergy"},{"obj":{"@_type":"symbol","@_z":"300"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"PASSTHROUGH"},"ctrl":{"@_type":"power","@_method":"cpu","@_attrib":"blaster","@_power":"20"},"@_id":"canisterpurple","@_cid":"205","@_ctype":"powerup","@_ccache":"1","@_cname":"RailGunAmmo"},{"obj":{"@_type":"symbol","@_z":"300"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"REPORT_ONLY"},"ctrl":{"@_type":"power","@_method":"cpu","@_attrib":"gun","@_power":"50"},"@_id":"canisterred","@_cid":"206","@_ctype":"powerup","@_ccache":"1","@_cname":"GunAmmo"},{"obj":{"@_type":"symbol","@_z":"300"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"PASSTHROUGH"},"ctrl":{"@_type":"power","@_method":"cpu","@_attrib":"backpack","@_power":"300"},"@_id":"fuelcan","@_cid":"207","@_ctype":"powerup","@_ccache":"1","@_cname":"JetFuel"},{"obj":{"@_type":"symbol","@_z":"300"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"REPORT_ONLY"},"ctrl":{"@_type":"power","@_method":"cpu","@_attrib":"atomic","@_modifier":"1","@_sound":"atomic"},"@_id":"atomic","@_cid":"211","@_ctype":"powerup","@_ccache":"1","@_cname":"Atomic","@_calt":"Makes you 3x stronger"},{"obj":{"@_type":"symbol","@_symbolname":"rover","@_subsymbolname":"rovertire","@_creatorsymbolname":"rover_creator","@_z":"10","@_graphicsrects":"body,wheel_lt,wheel_rt"},"material":{"@_cor":"0.5","@_cof":"0.5","@_damage":"1"},"simobj":{"#text":"[[false, -70, 40], [true, 70, 40]]","@_type":"compound","@_ct":"CIRCLE","@_rt":"BOUNCE_ALL_BUT_FOCUSOBJ","@_radius":"50","@_m":"0.75","@_g":"0.5","@_damp":"0.25","@_rdamp":"0.8","@_buoyancy":"400","@_leakage":"0","@_nosleep":"1"},"behavior":{"@_type":"death","@_style":"shatter","@_radius":"40","@_prio":"5","@_effect":"explosionbig"},"ctrl":{"@_type":"drive","@_method":"kbd"},"sounds":{"@_die":"aa_big_shatter","@_board":"aa_motor_start","@_unboard":"aa_motor_exit","@_rev":"aa_motor_rev","@_juice":"aa_motor_juice"},"@_id":"rover","@_version":"2","@_cid":"65","@_ctype":"powerup","@_cname":"Rover","@_type":"movable","@_health":"300","@_calt":"Get in and drive!"},{"obj":{"@_type":"turretsymbol","@_symbolname":"jeep","@_subsymbolname":"jeeptire","@_creatorsymbolname":"jeep_creator","@_z":"10","@_graphicsrects":"body,wheel_lt,wheel_rt"},"material":{"@_cor":"0.5","@_cof":"0.5","@_damage":"1"},"simobj":{"#text":"[[false, -70, 40], [true, 70, 40]]","@_type":"compound","@_ct":"CIRCLE","@_rt":"BOUNCE_ALL_BUT_FOCUSOBJ","@_radius":"50","@_m":"0.75","@_g":"0.5","@_damp":"0.25","@_rdamp":"0.8","@_buoyancy":"300","@_leakage":"0.25","@_nosleep":"1"},"behavior":{"@_type":"death","@_style":"shatter","@_radius":"40","@_prio":"5","@_effect":"explosionbig"},"ctrl":{"@_type":"drive","@_method":"kbd","@_projectile":"laser","@_firedelay":"250"},"sounds":{"@_die":"aa_big_shatter","@_hit":"mortar","@_board":"aa_motor_start","@_unboard":"aa_motor_exit","@_rev":"aa_motor_rev","@_juice":"aa_motor_juice"},"@_id":"jeep","@_version":"2","@_cid":"66","@_ctype":"powerup","@_cname":"Jeep","@_type":"movable","@_health":"400","@_calt":"Get in and drive!"},{"obj":{"@_type":"symbol","@_symbolname":"saucer","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"mot","@_ct":"CAPSULE","@_rt":"BOUNCE_ALL_BUT_FOCUSOBJ","@_m":"2","@_damp":"0.15","@_rdamp":"0","@_buoyancy":"-200"},"behavior":{"@_type":"death","@_style":"shatter","@_radius":"40","@_prio":"5","@_effect":"explosionbig"},"ctrl":{"@_type":"fly","@_method":"kbd","@_projectile":"laserbig","@_firedelay":"250"},"sounds":{"@_die":"aa_big_shatter","@_board":"aa_saucer_start","@_unboard":"aa_motor_exit","@_rev":"aa_saucer_rev","@_juice":"aa_saucer_rev"},"@_id":"saucer","@_version":"2","@_cid":"348","@_ctype":"powerup","@_cname":"Hovership","@_type":"movable","@_health":"100","@_calt":"Get in and fly!"},{"obj":{"@_type":"mech","@_symbolname":"mech","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.9"},"simobj":{"@_type":"mot","@_ct":"CAPSULE","@_rt":"BOUNCE_ALL_BUT_FOCUSOBJ","@_m":"2","@_damp":"0.15","@_rdamp":"0","@_buoyancy":"-200"},"behavior":{"@_type":"death","@_style":"shatter","@_radius":"80","@_prio":"5","@_effect":"explosionbig"},"ctrl":{"@_type":"mech","@_method":"kbd","@_projectile":"laser","@_firedelay":"250"},"sounds":{"@_die":"aa_big_shatter","@_hit":"mortar","@_walk":"aa_mechwalk3","@_step":"aa_mechstep","@_punch":"aa_mech_punch","@_miss":"whoosh1","@_board":"aa_floop"},"@_id":"mech","@_version":"2","@_cid":"67","@_ctype":"powerup","@_cname":"PowerSuit","@_type":"movable","@_health":"500","@_calt":"Get in and KA-CHUNK!"},{"obj":{"@_type":"symbol","@_z":"200"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"mot","@_ct":"CIRCLE","@_rt":"BOUNCE","@_m":"0.5","@_damp":"0.9","@_g":"0.01","@_rdamp":"0.8"},"ctrl":{"@_type":"flyingally","@_method":"cpu","@_range":"300","@_aggression":"100","@_fire":"laser","@_firedelay":"250","@_firepower":"100","@_bank":"1","@_speed":"3"},"behavior":[{"@_type":"collide"},{"@_type":"death","@_style":"bloom","@_radius":"20","@_prio":"5"}],"sounds":"","@_id":"allyprobe","@_group":"good","@_type":"movable","@_health":"20","@_speed":"1","@_strength":"1","@_global":"1","@_cid":"325","@_ctype":"powerup","@_cname":"Ally","@_calt":"Flying robotic ally with a deadly laser."},{"obj":{"@_type":"symbol","@_symbolname":"door","@_z":"10"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"ctrl":{"@_type":"door","@_method":"cpu","@_near":"1"},"sounds":{"@_open":"electric_door","@_close":"electric_door_reverse"},"@_id":"neardoor","@_map":"1","@_cid":"250","@_ctype":"trigger","@_cname":"AutoDoor"},{"obj":{"@_type":"symbol","@_z":"10"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"ctrl":{"@_type":"door","@_method":"cpu"},"sounds":{"@_open":"electric_door","@_close":"electric_door_reverse"},"@_id":"touchdoor","@_map":"1","@_cid":"251","@_ctype":"trigger","@_cname":"TouchDoor"},{"obj":{"@_type":"symbol","@_z":"10"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"ctrl":{"@_type":"door","@_method":"cpu"},"sounds":{"@_open":"electric_door","@_close":"electric_door_reverse"},"@_id":"touchdoorhorizontal","@_map":"1","@_cid":"252","@_ctype":"trigger","@_cname":"TouchFloor"},{"obj":{"@_type":"symbol","@_z":"300"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"REPORT_ONLY"},"ctrl":{"@_type":"power","@_method":"cpu","@_attrib":"blue","@_power":"1"},"@_id":"keyblue","@_cid":"253","@_ctype":"trigger","@_cname":"BlueKey"},{"obj":{"@_type":"symbol","@_z":"300"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"REPORT_ONLY"},"ctrl":{"@_type":"power","@_method":"cpu","@_attrib":"green","@_power":"1"},"@_id":"keygreen","@_cid":"254","@_ctype":"trigger","@_cname":"GreenKey"},{"obj":{"@_type":"symbol","@_z":"300"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"REPORT_ONLY"},"ctrl":{"@_type":"power","@_method":"cpu","@_attrib":"yellow","@_power":"1"},"@_id":"keyyellow","@_cid":"255","@_ctype":"trigger","@_cname":"YellowKey"},{"obj":{"@_type":"symbol","@_z":"300"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"REPORT_ONLY"},"ctrl":{"@_type":"power","@_method":"cpu","@_attrib":"purple","@_power":"1"},"@_id":"keypurple","@_version":"2","@_cid":"283","@_ctype":"trigger","@_cname":"PurpleKey"},{"obj":{"@_type":"symbol","@_z":"10"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"ctrl":{"@_type":"door","@_method":"cpu","@_key":"blue"},"sounds":{"@_open":"electric_door","@_close":"electric_door_reverse","@_locked":"locked1"},"@_id":"touchdoorblue","@_map":"1","@_rotate":"true","@_cid":"256","@_ctype":"trigger","@_cname":"BlueDoor"},{"obj":{"@_type":"symbol","@_z":"10"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"ctrl":{"@_type":"door","@_method":"cpu","@_key":"green"},"sounds":{"@_open":"electric_door","@_close":"electric_door_reverse","@_locked":"locked1"},"@_id":"touchdoorgreen","@_map":"1","@_rotate":"true","@_cid":"257","@_ctype":"trigger","@_cname":"GreenDoor"},{"obj":{"@_type":"symbol","@_z":"10"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"ctrl":{"@_type":"door","@_method":"cpu","@_key":"yellow"},"sounds":{"@_open":"electric_door","@_close":"electric_door_reverse","@_locked":"locked1"},"@_id":"touchdooryellow","@_map":"1","@_rotate":"true","@_cid":"258","@_ctype":"trigger","@_cname":"YellowDoor"},{"obj":{"@_type":"symbol","@_z":"10"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"ctrl":{"@_type":"door","@_method":"cpu","@_key":"purple"},"sounds":{"@_open":"electric_door","@_close":"electric_door_reverse","@_locked":"locked1"},"@_id":"touchdoorhorizontalpurple","@_version":"2","@_map":"1","@_cid":"279","@_ctype":"trigger","@_cname":"PurpleDoor"},{"obj":{"@_type":"symbol","@_z":"10"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"ctrl":{"@_type":"door","@_method":"cpu","@_oneway":"270"},"sounds":{"@_open":"electric_door","@_close":"electric_door_reverse","@_locked":"locked1"},"@_id":"onewaydoor","@_version":"2","@_rotate":"true","@_map":"1","@_cid":"277","@_ctype":"trigger","@_cname":"OneWayDoor"},{"obj":{"@_type":"symbol","@_z":"10"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"ctrl":{"@_type":"door","@_method":"cpu","@_oneway":"0"},"sounds":{"@_open":"electric_door","@_close":"electric_door_reverse","@_locked":"locked1"},"@_id":"trapdoordown","@_version":"2","@_map":"1","@_cid":"280","@_ctype":"trigger","@_cname":"TrapDoor","@_calt":"This is a trap door you can only fall down through."},{"obj":{"@_type":"symbol","@_z":"10"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"ctrl":{"@_type":"door","@_method":"cpu","@_oneway":"180"},"sounds":{"@_open":"electric_door","@_close":"electric_door_reverse","@_locked":"locked1"},"@_id":"trapdoorup","@_version":"2","@_map":"1","@_cid":"281","@_ctype":"trigger","@_cname":"TrapDoor","@_calt":"This is a trap door you can only jump up through."},{"obj":{"@_type":"symbol","@_z":"10"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"@_id":"trapdoorfake","@_version":"2","@_map":"1","@_cid":"282","@_ctype":"trigger","@_cname":"FakeDoor","@_calt":"This looks like a trap door but is really solid floor."},{"obj":{"@_type":"tile","@_tile":"119","@_castshadow":"1","@_tilescale":"2","@_receiveshadow":"0","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.9"},"ctrl":{"@_type":"burst","@_method":"cpu","@_near":"1"},"behavior":{"@_type":"death","@_style":"remove","@_radius":"20","@_prio":"5","@_effect":"burst"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"sounds":{"@_die":"explosion"},"@_id":"stonewall_large","@_version":"2","@_linkable":"1","@_map":"1","@_cid":"285","@_ctype":"trigger","@_cname":"BurstTile","@_calt":"This is a linkable item that it will burst when its link is activated"},{"obj":{"@_type":"symbol","@_symbolname":"permaclosedoor","@_creatorsymbolname":"permaclosedoor_creator","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"IGNORE","@_pen":"15"},"ctrl":{"@_type":"crusher","@_method":"cpu","@_mode":"close","@_speed":"1","@_started":"0","@_yoyo":"0"},"@_id":"permaclosedoor","@_version":"2","@_type":"control","@_rotate":"true","@_linkable":"1","@_cid":"278","@_ctype":"trigger","@_cname":"Closer","@_calt":"Large wall that closes permanently when triggered"},{"obj":{"@_type":"symbol","@_creatorsymbolname":"doorswitch_creator","@_z":"-7"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"PASSTHROUGH"},"ctrl":{"@_type":"link","@_method":"cpu"},"sounds":{"@_switch":"switch1"},"@_id":"doorswitch","@_version":"2","@_type":"control","@_map":"0","@_cid":"275","@_ctype":"trigger","@_cname":"RemoteSwitch","@_calt":"Drag links onto this linkable switch to link them."},{"obj":{"@_type":"symbol","@_creatorsymbolname":"invisibleswitch_creator","@_z":"-7"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"PASSTHROUGH"},"ctrl":{"@_type":"link","@_method":"cpu"},"sounds":{"@_switch":"switch1"},"@_id":"invisibleswitch","@_version":"2","@_type":"control","@_map":"0","@_cid":"284","@_ctype":"trigger","@_cname":"InvisibleSwitch","@_calt":"This switch is invisible in the game. Drag links onto this linkable switch to link them."},{"obj":{"@_type":"symbol","@_creatorsymbolname":"magiclock_creator","@_z":"-7"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"PASSTHROUGH"},"ctrl":{"@_type":"link","@_method":"cpu"},"sounds":{"@_switch":"switch1"},"@_id":"magiclock","@_version":"2","@_type":"control","@_map":"0","@_cid":"276","@_ctype":"trigger","@_cname":"MagicSwitch","@_calt":"Drag links onto this linkable switch to link them."},{"obj":{"@_type":"symbol","@_z":"-8"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"PASSTHROUGH"},"ctrl":{"@_type":"leveldoor","@_method":"cpu","@_delay":"0"},"sounds":{"@_locked":"locked1","@_open":"materialize1","@_enter":"aa_ability","@_leave":"aa_boy_hee"},"@_id":"leveldoor1","@_version":"2","@_type":"control","@_map":"0","@_cid":"269","@_ctype":"trigger","@_cname":"Level Door","@_calt":"This is a door to the next level, which will open when the level mission is complete."},{"obj":{"@_type":"symbol","@_z":"-8"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"PASSTHROUGH"},"ctrl":{"@_type":"leveldoor","@_method":"cpu","@_delay":"0"},"sounds":{"@_locked":"locked1","@_open":"materialize1","@_enter":"aa_ability","@_leave":"aa_boy_hee"},"@_id":"leveldoor2","@_version":"2","@_type":"control","@_map":"0","@_cid":"270","@_ctype":"trigger","@_cname":"Level Door","@_calt":"This is a door to the next level, which will open when the level mission is complete."},{"obj":{"@_type":"symbol","@_z":"-8"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"PASSTHROUGH"},"ctrl":{"@_type":"leveldoor","@_method":"cpu","@_delay":"0"},"sounds":{"@_locked":"locked1","@_open":"materialize1","@_enter":"aa_ability","@_leave":"aa_boy_hee"},"@_id":"leveldoor3","@_version":"2","@_type":"control","@_map":"0","@_cid":"271","@_ctype":"trigger","@_cname":"Level Door","@_calt":"This is a door to the next level, which will open when the level mission is complete."},{"obj":{"@_type":"symbol","@_z":"-8"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"PASSTHROUGH"},"ctrl":{"@_type":"leveldoor","@_method":"cpu","@_delay":"0"},"sounds":{"@_locked":"locked1","@_open":"materialize1","@_enter":"aa_ability","@_leave":"aa_boy_hee"},"@_id":"leveldoor4","@_version":"2","@_type":"control","@_map":"0","@_cid":"272","@_ctype":"trigger","@_cname":"Level Door","@_calt":"This is a door to the next level, which will open when the level mission is complete."},{"obj":{"@_type":"symbol","@_z":"-8"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"PASSTHROUGH"},"ctrl":{"@_type":"leveldoor","@_method":"cpu","@_delay":"0"},"sounds":{"@_locked":"locked1","@_open":"materialize1","@_enter":"aa_ability","@_leave":"aa_boy_hee"},"@_id":"leveldoor5","@_version":"2","@_type":"control","@_map":"0","@_cid":"273","@_ctype":"trigger","@_cname":"Level Door","@_calt":"This is a door to the next level, which will open when the level mission is complete."},{"obj":{"@_type":"symbol","@_z":"-8"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"PASSTHROUGH"},"ctrl":{"@_type":"leveldoor","@_method":"cpu","@_delay":"0"},"sounds":{"@_locked":"locked1","@_open":"materialize1","@_enter":"aa_ability","@_leave":"aa_boy_hee"},"@_id":"leveldoor6","@_version":"2","@_type":"control","@_map":"0","@_cid":"274","@_ctype":"trigger","@_cname":"Level Door","@_calt":"This is a door to the next level, which will open when the level mission is complete."},{"obj":{"@_type":"symbol","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"ctrl":{"@_type":"switch","@_method":"cpu","@_name":"blue","@_local":"1","@_delay":"2000"},"sounds":{"@_switch":"switch1","@_trigger":"materialize1"},"@_id":"temporalblockswitchblue","@_type":"control","@_map":"1","@_cid":"259","@_ctype":"trigger","@_cname":"BlueSwitch"},{"obj":{"@_type":"symbol","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.5","@_flicker":"1"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"BOUNCE"},"ctrl":{"@_type":"trigger","@_method":"cpu","@_name":"blue","@_delay":"6000"},"sounds":{"@_trigger":"materialize1","@_untrigger":"dematerialize1"},"@_id":"temporalblockblue","@_type":"control","@_map":"1","@_cid":"260","@_ctype":"trigger","@_cframe":"14","@_cname":"BlueRing"},{"obj":{"@_type":"symbol","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"ctrl":{"@_type":"switch","@_method":"cpu","@_name":"green","@_local":"1","@_delay":"2000"},"sounds":{"@_switch":"switch1","@_trigger":"materialize1"},"@_id":"temporalblockswitchgreen","@_type":"control","@_map":"1","@_cid":"261","@_ctype":"trigger","@_cname":"GreenSwitch"},{"obj":{"@_type":"symbol","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.5","@_flicker":"1"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"BOUNCE"},"ctrl":{"@_type":"trigger","@_method":"cpu","@_name":"green","@_delay":"6000"},"sounds":{"@_trigger":"materialize1","@_untrigger":"dematerialize1"},"@_id":"temporalblockgreen","@_type":"control","@_map":"1","@_cid":"262","@_ctype":"trigger","@_cframe":"14","@_cname":"GreenRing"},{"obj":{"@_type":"symbol","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"ctrl":{"@_type":"switch","@_method":"cpu","@_name":"yellow","@_local":"1","@_delay":"2000"},"sounds":{"@_switch":"switch1","@_trigger":"materialize1"},"@_id":"temporalblockswitchyellow","@_type":"control","@_map":"1","@_cid":"263","@_ctype":"trigger","@_cname":"YellowSwitch"},{"obj":{"@_type":"symbol","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.5","@_flicker":"1"},"simobj":{"@_type":"sim","@_ct":"CIRCLE","@_rt":"BOUNCE"},"ctrl":{"@_type":"trigger","@_method":"cpu","@_name":"yellow","@_delay":"6000"},"sounds":{"@_trigger":"materialize1","@_untrigger":"dematerialize1"},"@_id":"temporalblockyellow","@_type":"control","@_map":"1","@_cid":"264","@_ctype":"trigger","@_cframe":"14","@_cname":"YellowRing"},{"obj":{"@_type":"symbol","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"ctrl":{"@_type":"switch","@_method":"cpu","@_name":"yellowgreen","@_delay":"2000","@_toggle":"1"},"sounds":{"@_switch":"switch1","@_trigger":"materialize1"},"@_id":"triggerblockswitchyellowgreen","@_type":"control","@_map":"1","@_cid":"265","@_ctype":"trigger","@_cname":"PermSwitch"},{"obj":{"@_type":"symbol","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.5","@_flicker":"1"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"ctrl":{"@_type":"trigger","@_method":"cpu","@_name":"yellowgreen","@_delay":"0"},"sounds":{"@_trigger":"materialize1","@_untrigger":"dematerialize1"},"@_id":"triggerblockyellowgreen","@_type":"control","@_map":"1","@_cid":"266","@_ctype":"trigger","@_cframe":"11","@_cname":"PermBlock"},{"obj":{"@_type":"symbol","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.5"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"ctrl":{"@_type":"switch","@_method":"cpu","@_name":"orange","@_delay":"2000","@_toggle":"1"},"sounds":{"@_switch":"switch1","@_trigger":"materialize1"},"@_id":"triggerblockswitchorange","@_type":"control","@_map":"1","@_cid":"267","@_ctype":"trigger","@_cname":"PermSwitch"},{"obj":{"@_type":"symbol","@_z":"10"},"material":{"@_cor":"0.5","@_cof":"0.5","@_flicker":"1"},"simobj":{"@_type":"sim","@_ct":"OBB","@_rt":"BOUNCE"},"ctrl":{"@_type":"trigger","@_method":"cpu","@_name":"orange","@_delay":"0","@_onatstart":"1"},"sounds":{"@_trigger":"materialize1","@_untrigger":"dematerialize1"},"@_id":"triggerblockorange","@_type":"control","@_map":"1","@_cid":"268","@_ctype":"trigger","@_cname":"PermBlock","@_calt":"This block will start in the ON position in the game."},{"material":{"@_self_illuminate":"1"},"obj":{"@_type":"symbol","@_symbolname":"ray"},"@_id":"ray","@_cid":"0","@_ctype":"none"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"400"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"vel","@_ct":"CIRCLE","@_rt":"PASSTHROUGH","@_bound":"1"},"ctrl":{"@_type":"projectile","@_method":"cpu","@_lifespan":"3","@_strength":"5","@_speed":"600","@_hiteffect":"bullethiteffect"},"sounds":{"@_create":"gun1","@_hit":"gun1_hit"},"@_id":"bullet","@_type":"control","@_cid":"0","@_ctype":"none"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"400"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"vel","@_ct":"CIRCLE","@_rt":"PASSTHROUGH","@_bound":"1"},"ctrl":{"@_type":"projectile","@_method":"cpu","@_lifespan":"3","@_strength":"7","@_push":"0.25","@_speed":"600","@_hiteffect":"laserhiteffect"},"sounds":{"@_create":"gun1","@_hit":"gun1_hit"},"@_id":"laser","@_type":"control","@_cid":"0","@_ctype":"none"},{"obj":{"@_type":"symbol","@_cache":"1","@_z":"400"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"vel","@_ct":"CIRCLE","@_rt":"PASSTHROUGH","@_bound":"1"},"ctrl":{"@_type":"projectile","@_method":"cpu","@_lifespan":"3","@_strength":"10","@_push":"0.25","@_speed":"600","@_hiteffect":"laserhiteffect"},"sounds":{"@_create":"gun1","@_hit":"gun1_hit"},"@_id":"laserbig","@_type":"control","@_cid":"0","@_ctype":"none"},{"obj":{"@_type":"symbol","@_z":"400"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"vel","@_ct":"CIRCLE","@_rt":"PASSTHROUGH","@_bound":"1"},"ctrl":{"@_type":"projectile","@_method":"cpu","@_lifespan":"4","@_strength":"7","@_push":"1","@_speed":"300","@_hiteffect":"epulsehiteffect"},"sounds":{"@_create":"aa_epulse","@_hit":"gun1_hit"},"@_id":"epulse","@_type":"control","@_cid":"0","@_ctype":"none"},{"obj":{"@_type":"symbol","@_z":"400"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"vel","@_ct":"CIRCLE","@_rt":"PASSTHROUGH","@_bound":"1"},"ctrl":{"@_type":"projectile","@_method":"cpu","@_lifespan":"4","@_strength":"12","@_push":"1","@_speed":"450","@_hiteffect":"laserhiteffect"},"sounds":{"@_create":"aa_epulse2","@_hit":"gun1_hit"},"@_id":"epulse2","@_type":"control","@_cid":"0","@_ctype":"none"},{"obj":{"@_type":"symbol","@_z":"400"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"vel","@_ct":"CIRCLE","@_rt":"PASSTHROUGH","@_bound":"1"},"ctrl":{"@_type":"projectile","@_method":"cpu","@_lifespan":"10","@_strength":"20","@_drop":"15","@_speed":"600","@_hiteffect":"clasheffect2","@_bounceffect":"clasheffect3","@_bounce":"1"},"sounds":{"@_create":"whip1","@_hit":"whap2","@_bounce":"whap3"},"@_id":"arrow","@_type":"control","@_cid":"0","@_ctype":"none"},{"obj":{"@_type":"symbol","@_z":"400"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"vel","@_ct":"CIRCLE","@_rt":"PASSTHROUGH"},"ctrl":{"@_type":"projectile","@_method":"cpu","@_lifespan":"10","@_strength":"20","@_drop":"15","@_speed":"600","@_hiteffect":"clasheffect2","@_bounceffect":"clasheffect3","@_bounce":"1"},"sounds":{"@_create":"whip1","@_hit":"whap2","@_bounce":"whap3"},"@_id":"spear","@_type":"control","@_cid":"0","@_ctype":"none"},{"obj":{"@_type":"symbol","@_z":"400"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"vel","@_ct":"CIRCLE","@_rt":"PASSTHROUGH","@_bound":"1"},"ctrl":{"@_type":"projectile","@_method":"cpu","@_lifespan":"10","@_strength":"60","@_drop":"5","@_speed":"250","@_hiteffect":"fireballhiteffect","@_bounceffect":"fireballhiteffect"},"sounds":{"@_create":"mortar","@_hit":"explosion_bigger","@_bounce":"explosion"},"@_id":"fireball","@_type":"control","@_cid":"0","@_ctype":"none"},{"obj":{"@_type":"symbol","@_symbolname":"iceblast","@_z":"400"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"vel","@_ct":"CIRCLE","@_rt":"PASSTHROUGH","@_bound":"1"},"ctrl":{"@_type":"projectile","@_method":"cpu","@_lifespan":"3","@_speed":"3"},"@_id":"iceblast","@_type":"control","@_cid":"0","@_ctype":"none"},{"obj":{"@_type":"symbol","@_symbolname":"fireblast","@_z":"400"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"vel","@_ct":"CIRCLE","@_rt":"PASSTHROUGH","@_bound":"1"},"ctrl":{"@_type":"projectile","@_method":"cpu","@_lifespan":"3","@_speed":"2"},"@_id":"fireblast","@_type":"control","@_cid":"0","@_ctype":"none"},{"obj":{"@_type":"symbol","@_symbolname":"plasmablast","@_z":"400"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"vel","@_ct":"CIRCLE","@_rt":"PASSTHROUGH","@_bound":"1"},"ctrl":{"@_type":"projectile","@_method":"cpu","@_lifespan":"3","@_speed":"2"},"@_id":"plasmablast","@_type":"control","@_cid":"0","@_ctype":"none"},{"obj":{"@_type":"symbol","@_symbolname":"flameshoot","@_z":"400"},"material":{"@_self_illuminate":"1","@_effects":"false"},"simobj":{"@_type":"vel","@_ct":"CIRCLE","@_rt":"PASSTHROUGH"},"ctrl":{"@_type":"spray","@_method":"cpu","@_lifespan":"2","@_strength":"3","@_sound":"firebreath1"},"@_id":"flameshoot","@_type":"control","@_cid":"0","@_ctype":"none"},{"obj":{"@_type":"symbol","@_symbolname":"flameshoot","@_z":"400"},"material":{"@_self_illuminate":"1","@_effects":"false"},"simobj":{"@_type":"vel","@_ct":"CIRCLE","@_rt":"PASSTHROUGH"},"ctrl":{"@_type":"spray","@_method":"cpu","@_lifespan":"2","@_strength":"4","@_sound":"firebreath1"},"@_id":"flameshoot2","@_type":"control","@_cid":"0","@_ctype":"none"},{"obj":{"@_type":"symbol","@_symbolname":"steamshoot","@_z":"400"},"material":{"@_self_illuminate":"1"},"simobj":{"@_type":"vel","@_ct":"CIRCLE","@_rt":"PASSTHROUGH"},"ctrl":{"@_type":"spray","@_method":"cpu","@_lifespan":"3","@_strength":"0.5","@_force":"3","@_sound":"steam","@_loop":"1"},"@_id":"steam","@_type":"control","@_cid":"0","@_ctype":"none"},{"obj":{"@_type":"symbol","@_symbolname":"grenade"},"material":{"@_cor":"0.5","@_cof":"0.5","@_self_illuminate":"1"},"simobj":{"@_type":"mot","@_ct":"CIRCLE","@_rt":"BOUNCE","@_only":"1","@_m":"0.4","@_g":"0.5","@_damp":"0.29","@_rdamp":"0.1","@_nosleep":"1"},"ctrl":{"@_type":"bomb","@_method":"cpu","@_strength":"30","@_radius":"400","@_lifespan":"9","@_speed":"0"},"sounds":{"@_destroy":"explosion_bigger","@_tick":"claymore_beep"},"@_id":"grenade","@_type":"control","@_cid":"0","@_ctype":"none"},{"obj":{"@_type":"symbol","@_symbolname":"throwingstar"},"material":{"@_cor":"1","@_cof":"0.1"},"simobj":{"@_type":"vel","@_ct":"CIRCLE","@_rt":"PASSTHROUGH","@_bound":"1"},"ctrl":{"@_type":"projectile","@_method":"cpu","@_lifespan":"3","@_strength":"10","@_speed":"300","@_hiteffect":"clasheffect2"},"sounds":{"@_create":"throw1","@_hit":"hit1"},"@_id":"throwingstar","@_type":"control","@_cid":"0","@_ctype":"none"}],"skeleton":[{"bone":{"bone":[{"@_name":"torso"},{"@_name":"head","@_a":"-45","@_b":"45","@_t":"1","@_p":"1"},{"bone":{"@_name":"hand_rt","@_a":"-45","@_b":"45","@_t":"1","@_p":"1"},"@_name":"arm_rt","@_a":"-180","@_b":"180","@_t":"1"},{"bone":{"@_name":"hand_lt","@_a":"-45","@_b":"45","@_t":"1","@_p":"1"},"@_name":"arm_lt","@_a":"-180","@_b":"180","@_t":"1"},{"@_name":"leg_rt","@_a":"-30","@_b":"90","@_t":"1"},{"@_name":"leg_lt","@_a":"-90","@_b":"30","@_t":"1"}],"@_name":"body","@_t":"1","@_p":"1"},"@_id":"simple_skeleton"},{"bone":{"bone":[{"@_name":"torso"},{"@_name":"head","@_a":"-45","@_b":"45","@_t":"1","@_p":"1"},{"bone":{"@_name":"hand_rt","@_a":"-180","@_b":"180","@_t":"1","@_p":"1"},"@_name":"arm_rt","@_a":"-180","@_b":"180","@_t":"1"},{"bone":{"@_name":"hand_lt","@_a":"-180","@_b":"180","@_t":"1","@_p":"1"},"@_name":"arm_lt","@_a":"-180","@_b":"180","@_t":"1"},{"@_name":"leg_rt","@_a":"-30","@_b":"90","@_t":"1"},{"@_name":"leg_lt","@_a":"-90","@_b":"30","@_t":"1"}],"@_name":"body","@_t":"1","@_p":"1"},"@_id":"skeleton_longhand"}]}}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!****************************!*\
  !*** ./html5/src/index.js ***!
  \****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _definitionTree__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./definitionTree */ "./html5/src/definitionTree.js");
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./game */ "./html5/src/game.js");
/* harmony import */ var _generateDefinitionsHTML__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./generateDefinitionsHTML */ "./html5/src/generateDefinitionsHTML.js");
/* harmony import */ var _creator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./creator */ "./html5/src/creator.js");
/* harmony import */ var _point__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./point */ "./html5/src/point.js");
/* harmony import */ var _grid__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./grid */ "./html5/src/grid.js");
/* harmony import */ var _mouseTools__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./mouseTools */ "./html5/src/mouseTools.js");








var img1 = document.createElement("img");
img1.src = "./799.svg";
/**
 * Constructor for grid cell object
 */

window.SploderPlatformerCreator = _creator__WEBPACK_IMPORTED_MODULE_3__["default"];


var str1 = `<project title="" comments="1" bitview="0" id="noid-unsaved-project" mode="2" date="Saturday, March 16, 2024" pubkey="" isprivate="0" fast="0" g="1" author="demo"><levels id="levels"><level name="" music="" avatar="0" env="8,6600cc,333333,100">3,210,210|3,90,90|3,30,30|3,150,150|3,270,270|3,330,330|3,390,330|3,450,330|3,390,270|3,390,210|1,-329,239</level></levels><graphics /><textures lastid="0" /></project>`

/**
 * @type {Game}
 */

_creator__WEBPACK_IMPORTED_MODULE_3__["default"].gameInstance = _game__WEBPACK_IMPORTED_MODULE_1__["default"].createFromXMLString(str1)

/*** Test code for showing locations of objects as circles***/

let canvas = _creator__WEBPACK_IMPORTED_MODULE_3__["default"].canvas;

let canvasPositionX = canvas.getBoundingClientRect().x;
let canvasPositionY = canvas.getBoundingClientRect().y;

function setCanvasDim() {
    canvas.width = window.innerWidth - canvasPositionX;
    canvas.height = window.innerHeight - canvasPositionY;
}

setCanvasDim();

window.addEventListener("resize", setCanvasDim)

let ctx = canvas.getContext("2d");

_creator__WEBPACK_IMPORTED_MODULE_3__["default"].canvas = canvas;

_creator__WEBPACK_IMPORTED_MODULE_3__["default"].objectMenuItems = (0,_generateDefinitionsHTML__WEBPACK_IMPORTED_MODULE_2__["default"])();

setInterval(function(){

    _creator__WEBPACK_IMPORTED_MODULE_3__["default"].gameInstance.level.levelNode.innerHTML = "";

    // Default value for Creator.selectedObjectPointedToExists.
    _creator__WEBPACK_IMPORTED_MODULE_3__["default"].selectedObjectPointedToExists = false;

    // Reset objects in grid array
    _creator__WEBPACK_IMPORTED_MODULE_3__["default"].mousePosition.objectsInGrid = [];

    /**
     * Get point of mouse relative to world
     */

    _creator__WEBPACK_IMPORTED_MODULE_3__["default"].mousePosition.world = _creator__WEBPACK_IMPORTED_MODULE_3__["default"].mousePosition.canvasOffset.toWorldPoint();

    /**
     * Get grid cell the mouse is hovering over
     */

    _creator__WEBPACK_IMPORTED_MODULE_3__["default"].mousePosition.gridCell = new _grid__WEBPACK_IMPORTED_MODULE_5__.GridCell(
        _creator__WEBPACK_IMPORTED_MODULE_3__["default"].mousePosition.world.x,
        _creator__WEBPACK_IMPORTED_MODULE_3__["default"].mousePosition.world.y
    ),

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw sky color
    ctx.fillStyle = "#" + _creator__WEBPACK_IMPORTED_MODULE_3__["default"].gameInstance.level.skyColor;

    let centerWorldPointAsCanvasPoint = new _point__WEBPACK_IMPORTED_MODULE_4__.WorldPoint(0, 0).toCanvasPoint();

    ctx.fillRect(
        0,
        0,
        canvas.width,
        centerWorldPointAsCanvasPoint.y
    );

    // Draw underground
    ctx.fillStyle = "#000000";
    
    ctx.fillRect(
        0,
        centerWorldPointAsCanvasPoint.y, 
        canvas.width, 
        canvas.height - _creator__WEBPACK_IMPORTED_MODULE_3__["default"].deltaY
    );

    for(var i = 0; i < _creator__WEBPACK_IMPORTED_MODULE_3__["default"].gameInstance.level.objects.length; i++) {

        /**
         * @type {GameObject}
         */

        let o = _creator__WEBPACK_IMPORTED_MODULE_3__["default"].gameInstance.level.objects[i];

        // Write object data to level XML

        _creator__WEBPACK_IMPORTED_MODULE_3__["default"].gameInstance.level.levelNode.innerHTML += (o.toString() + "|");

        let objCanvasPoint = new _point__WEBPACK_IMPORTED_MODULE_4__.WorldPoint(o.x, o.y).toCanvasPoint();

        // Check if object is in the grid cell pointed to by mouse
        let isInGrid = _creator__WEBPACK_IMPORTED_MODULE_3__["default"].mousePosition.gridCell.pointInGrid(o.x, o.y);

        // Check if object is in selection array
        let isSelected = _creator__WEBPACK_IMPORTED_MODULE_3__["default"].selectedObjects.includes(o);

        // If object is pointed to and also in selection, set variable

        if(isInGrid && isSelected) {
            _creator__WEBPACK_IMPORTED_MODULE_3__["default"].selectedObjectPointedToExists = true;
            console.log(_creator__WEBPACK_IMPORTED_MODULE_3__["default"].selectedObjectPointedToExists);
        }

        if(isInGrid) {
            _creator__WEBPACK_IMPORTED_MODULE_3__["default"].mousePosition.objectsInGrid.push(o);
        }

        ctx.drawImage(
            img1,
            objCanvasPoint.x - 30 * _creator__WEBPACK_IMPORTED_MODULE_3__["default"].zoomFactor,
            objCanvasPoint.y - 30 * _creator__WEBPACK_IMPORTED_MODULE_3__["default"].zoomFactor,
            img1.width * _creator__WEBPACK_IMPORTED_MODULE_3__["default"].zoomFactor,
            img1.height * _creator__WEBPACK_IMPORTED_MODULE_3__["default"].zoomFactor
        )

        ctx.stroke();

        // If object is selected

        if(isSelected) {
            
            ctx.lineWidth = 10 * _creator__WEBPACK_IMPORTED_MODULE_3__["default"].zoomFactor;
            ctx.strokeStyle = "blue";

            ctx.beginPath();

            ctx.rect(
                objCanvasPoint.x - 30 * _creator__WEBPACK_IMPORTED_MODULE_3__["default"].zoomFactor,
                objCanvasPoint.y - 30 * _creator__WEBPACK_IMPORTED_MODULE_3__["default"].zoomFactor,
                60 * _creator__WEBPACK_IMPORTED_MODULE_3__["default"].zoomFactor,
                60 * _creator__WEBPACK_IMPORTED_MODULE_3__["default"].zoomFactor
            );

            ctx.stroke();

        };
        
    }

    /**ctx.beginPath();

    let gridcellCanvasPoint = creator.mousePosition.gridCell.topLeft.toCanvasPoint();

    ctx.rect(
        gridcellCanvasPoint.x,
        gridcellCanvasPoint.y,
        creator.gridSize * creator.zoomFactor,
        creator.gridSize * creator.zoomFactor
    )

    ctx.stroke(); 

    ***/

    // Draw selection rectangle, if it exists

    if(_creator__WEBPACK_IMPORTED_MODULE_3__["default"].selectionRect.topLeft && _creator__WEBPACK_IMPORTED_MODULE_3__["default"].selectionRect.bottomRight) {

        ctx.lineWidth = 1;

        ctx.strokeStyle = "rgb(0,255,255)";

        ctx.fillStyle = "rgb(0,255,255,0.5)"

        ctx.beginPath();

        ctx.rect(
            _creator__WEBPACK_IMPORTED_MODULE_3__["default"].selectionRect.topLeft.x,
            _creator__WEBPACK_IMPORTED_MODULE_3__["default"].selectionRect.topLeft.y,
            _creator__WEBPACK_IMPORTED_MODULE_3__["default"].selectionRect.bottomRight.x - _creator__WEBPACK_IMPORTED_MODULE_3__["default"].selectionRect.topLeft.x,
            _creator__WEBPACK_IMPORTED_MODULE_3__["default"].selectionRect.bottomRight.y - _creator__WEBPACK_IMPORTED_MODULE_3__["default"].selectionRect.topLeft.y
        );

        ctx.fill();

        ctx.stroke();
    }

},16.66);

document.querySelector("#zoom-in").addEventListener("click", function(){
    _creator__WEBPACK_IMPORTED_MODULE_3__["default"].zoomFactor += 0.1
});

document.querySelector("#zoom-out").addEventListener("click", function(){
    _creator__WEBPACK_IMPORTED_MODULE_3__["default"].zoomFactor -= 0.1
});
})();

/******/ })()
;