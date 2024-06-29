// Creator object
const Creator = {
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
    }
}

export default Creator;