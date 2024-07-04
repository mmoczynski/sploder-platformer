/**
* Fuz2d: 2d Gaming Engine
* ----------------------------------------------------------------
* ----------------------------------------------------------------
* Copyright (C) 2008 Geoffrey P. Gaudreault
* Ported by @mmoczynski.
* 
*/

/**
 * Constructor function for tile definition
 */

/**
 * 
 * @param {Number} id 
 * @param {Boolean} back 
 * @param {String} json 
 * @param {Number} width 
 * @param {Number} height 
 * @param {Number} backgroundColor 
 * @param {Number} edgeColor 
 * @param {Number} edgeThickness 
 * @param {Number} cellsX 
 * @param {Number} cellsY 
 * @param {Number} perturbation 
 * @param {Number} randomSeed 
 * @param {Boolean} bond 
 * @param {Number} noiseLevel 
 * @param {Boolean} bevel 
 * @param {Boolean} cap 
 * @param {Boolean} edgeDepth 
 * @param {Boolean} recess 
 * @param {Boolean} smooth 
 * @param {Array} tileMap 
 */

function TileDefinition(
    id = 0,
    back = false,
    json = "",
    width = 0, 
    height = 0, 
    backgroundColor = 0xff998844, 
    edgeColor = 0xff660000, 
    edgeThickness = 2,
    cellsX = 4, 
    cellsY = 4, 
    perturbation = 0.3, 
    randomSeed = 1, 
    bond = false, 
    noiseLevel = 7, 
    bevel = false,
    cap = false,
    edgeDepth = 1,
    recess = false,
    smooth = false,
    tileMap = null 
) {

    this.back = back;
			
    if (width == 0 || height == 0) {
        this.width = Math.floor(TileDefinition.grid_width * TileDefinition.scale);
        this.height = Math.floor(TileDefinition.grid_height * TileDefinition.scale);
    } else {
        this.width = width;
        this.height = height;
    }

    if (id > 0) {
				
        this.randomize(id);
        
    } else if (json != null && json.length > 0) {
        
        this.parse(json);
        
    } else {
        
        this.backgroundColor = backgroundColor;
        this.edgeColor = edgeColor;
        this.edgeThickness = edgeThickness;
        this.cellsX = cellsX;
        this.cellsY = cellsY;
        this.perturbation = perturbation;
        this.randomSeed = randomSeed;
        this.bond = bond;
        this.noiseLevel = noiseLevel;
        this.bevel = bevel;
        this.cap = cap;
        this.edgeDepth = edgeDepth;
        this.recess = recess;
        this.smooth = smooth;
        
        if (smooth) cap = true;
        if (smooth) recess = true;
    }

    if (tileMap != null) this.tileMap = tileMap;
    else {
        this.tileMap = [
            1, 1, 1,
            1, 1, 1,
            1, 1, 1
        ];
    }
    
    if (width > grid_width) cap = true;
    
    if (backgroundColor < 0xff000000) backgroundColor += 0xff000000;
    if (edgeColor < 0xff000000) edgeColor += 0xff000000;

}

/**
 * 
 * @param {Number} seed 
 */

TileDefinition.prototype.randomize = function(seed = 1) {

    var sn = seed;
    sn = 29475.967 * sn;
    sn = Math.sqrt(sn);
    sn = sn - Math.floor(sn);

    var ss = sn.toString().split("0.").join("") + sn.toString().split("0.").join("");

    this.backgroundColor = Math.min(0xffffffff, parseInt("0xff" + ss.substr(0, 6), 16) + this.ambientColor);

    if (this.back) {

        this.backgroundColor -= 0xff000000;
        this.backgroundColor = ColorTools.getTintedColor(this.backgroundColor, 0x000000, 0.7);
        this.backgroundColor += 0xff000000;	
        
    } else {

        this.backgroundColor -= 0xff000000;
        this.backgroundColor = ColorTools.getTintedColor(this.backgroundColor, 0xffffff, 0.4);
        this.backgroundColor += 0xff000000;					
        
    }

    this.edgeColor = parseInt("0xff" + ss.substr(6, 6), 16);

    this.edgeThickness = Math.max(
        3 - (TileGenerator.sampleScale - 1), 
        Math.min(6, Math.floor(parseInt(ss.charAt(13)) / 2))
    );

    this.cellsX = 2 + Math.floor(parseInt(ss.charAt(14)) / 2);
    this.cellsY = 2 + Math.floor(parseInt(ss.charAt(15)) / 2);
    this.perturbation = Math.max(0, parseInt(ss.charAt(16)) / 10 - 0.1);
    this.randomSeed = seed;
    this.bond = parseInt(ss.charAt(17)) < 4;
    this.cap = (parseInt(ss.charAt(18)) > 5 || this.cellsX < 4 || this.cellsY < 4);
    this.noiseLevel = Math.floor(parseInt(ss.charAt(19)));
    this.edgeDepth = Math.floor(parseInt(ss.charAt(20)) / 2);
    this.recess = parseInt(ss.charAt(21)) > 3;
    this.smooth = parseInt(ss.charAt(22)) < 5;

    if (this.width == 0) this.width = Math.floor(this.grid_width * this.scale);
    if (this.height == 0) this.height = Math.floor(this.grid_height * this.scale);
    
    if (this.smooth) this.cap = true;
    if (this.smooth) this.recess = true;
    if (this.bond) this.perturbation *= 0.5;
    if (this.width > this.grid_width) this.cap = true;
}

TileDefinition.prototype.parse = function() {

    var def = JSON.parse(jsonString);
			
    for (var param in def) {
        try {
            this[param] = def[param];
        } catch (e) {
            console.error("ERROR: Parameter " + param + " not defined in TileDefinition");
        }
    }

}

// Public, static members of TileDefinition class

TileDefinition.ambientColor = 0x000000;
TileDefinition.grid_width = 60;
TileDefinition.grid_height = 60;
TileDefinition.scale = 1;

// Public members of TileDefinition class

TileDefinition.prototype.width = 0;
TileDefinition.prototype.height = 0;
TileDefinition.prototype.backgroundColor = 0xff998844; 
TileDefinition.prototype.edgeColor = 0xff660000; 
TileDefinition.prototype.edgeThickness = 2;
TileDefinition.prototype.cellsX = 4;
TileDefinition.prototype.cellsY = 4; 
TileDefinition.prototype.perturbation = 0.3; 
TileDefinition.prototype.randomSeed = 1;
TileDefinition.prototype.bond = false;
TileDefinition.prototype.noiseLevel = 7;
TileDefinition.prototype.bevel = false;
TileDefinition.prototype.cap = false;
TileDefinition.prototype.edgeDepth = 1;
TileDefinition.prototype.recess = false;
TileDefinition.prototype.smooth = false;
TileDefinition.prototype.back = false;

/**
 * @type {Array}
 */

TileDefinition.prototype.tileMap = undefined;

export default TileDefinition;