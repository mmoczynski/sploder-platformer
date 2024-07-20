import fileMenu from "./fileMenu.js";
import {sideMenu} from "./generateSideMenu.js";
import levelEditingMenu from "./levelEditingMenu.js";
import rightButtons from "./rightButtons.js";

let mouseInfo = document.createElement("div");
mouseInfo.id = "mouse-info";

export function generateStructure(container) {

    container.append(
        fileMenu,
        //creator.canvas,
        levelEditingMenu,
        sideMenu,
        rightButtons,
        mouseInfo
    );

    return container;

}