// Starting text
document.body.innerText = "Starting..."

// Creator object

const creator = {

    // Size for snap grid for creator
    gridSize: 60,

    // Zoom factor for creator viewport
    zoomFactor: 1,

    // Creator viewport offset in the X direction
    deltaX: 0,

    // Creator viewport offset in the Y direction.
    deltaY: 0,
    loadingTxt: "",

    debugConfig: {
        enabled: true,
        selectedPointValue: 10
    },

    // Function used to set width and height of canvas

    setCanvasDimensions: function() {
        creator.canvas.width = window.innerWidth - creator.canvasPositionX;
        creator.canvas.height = window.innerHeight - creator.canvasPositionY;
    },

    canvasPositionX: null,
    canvasPositionY: null,

    /**
     * @type {"select-objects"|"select-objects"}
     */

    mouseTool: "select-objects",

    canvas: document.createElement("canvas"),

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

        objectsContainingMousePoint: [],

        /**
         * @type {GridCell|null}
         */

        gridCell: null
    },

    /**
     * This is used to move a collection of objects
     * When a collection of objects is transformed, there is one special item that 
     */

    leadObject: {

        /**
         * @type {GameObject|Null}
         */

        object: null,

        offset: {
            x: null,
            y: null
        }

    },

    /*
    * Map object used for preloading images
    * It maps URL strings to HTML Canvas JavaScript Objects.
    */

    preloadedImages: new Map(),

    // Boolean for transforming objects

    transformingObjects: false,
    
}

export default creator;