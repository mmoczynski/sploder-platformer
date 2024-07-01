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

export default creator;