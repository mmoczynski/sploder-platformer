/**
* Fuz2d: 2d Gaming Engine
* ----------------------------------------------------------------
* ----------------------------------------------------------------
* Copyright (C) 2008 Geoffrey P. Gaudreault
* ---
* Partially ported by @mmoczynski from ActionScript to JavaScript
* Currently needs JavaScript version of flash.display.BitmapData and flash.display.Sprite
* Also needs fuz2d.util.TileDefinition, fuz2d.util.TileGenerator, and fuz2d.util.Voronoi
*
*/

const TileDefinition = require("./tileDefinition.js");
const Voronoi = require("./Voronoi.js");

class TileSet {
    
    /*** 
     * @type {TileDefinition}
     */

    _def;


    _tiles;
    
    /** @type {Voronoi} */

    _voronoi;
    
    // translate between angle units
    dtr = Math.PI / 180;
    rtd = 180 / Math.PI;


    /**
     * 
     * @param {TileDefinition} def 
     */

    constructor (def) {
        
        init(def);
        
    }
    

    /**
     * 
     * @param {TileDefinition} def 
     */

    init (def) {
        
        this._def = def;
        
        makeTiles();
        
    }
    
    makeTiles () {
        
        this._tiles = { };

        this._voronoi = TileGenerator.makeVoronoi(this._def);
        
        this._def.tileMap = [
            1, 1, 1,
            1, 1, 1, 
            1, 1, 1
        ];
        
        // Orginally of type "BitmapData" in ActionScript

        var tileData = this._tiles["tile_" + this._def.tileMap.join("")] = TileGenerator.makeTile(this._def, null, this._voronoi);

        this._def.tileMap = [
            0, 0, 0,
            0, 1, 0, 
            0, 0, 0
        ];

        // Orginally of type "BitmapData" in ActionScript

        var capData = this_tiles["tile_" + this._def.tileMap.join("")] = TileGenerator.makeTile(this._def, null, this._voronoi);
        
        var nMap = [
            0, 1, 0, 0, 0, 0, 0, 0, 1, 0,
            1, 1, 1, 0, 1, 1, 1, 0, 1, 1,
            0, 0, 0, 0, 1, 1, 1, 0, 1, 0,
            0, 0, 0, 0, 1, 1, 1, 0, 0, 0,
            0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
            0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
            0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
            0, 0, 0, 0, 1, 1, 1, 0, 0, 0,
            0, 0, 0, 0, 1, 1, 1, 0, 1, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 1, 0,
            0, 1, 1, 1, 0, 0, 1, 0, 1, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 1, 0, 0, 0, 0, 0, 0, 1, 0,
            1, 1, 0, 1, 1, 1, 0, 1, 1, 1,
            0, 1, 0, 0, 1, 0, 0, 0, 1, 0,
            0, 0, 0, 0, 0, 0, 1, 0, 1, 0,
            1, 1, 0, 1, 1, 1, 1, 0, 1, 1,
            0, 1, 0, 1, 0, 0, 0, 0, 0, 0,
            ];
            
        for (var y = 1; y < 17; y++) {
            
            for (var x = 1; x < 10; x++) {
                
                this._def.tileMap = [];
                for (var j = y - 1; j <= y + 1; j++) {
                    for (var i = x - 1; i <= x + 1; i++) {
                        this._def.tileMap.push(nMap[j * 10 + i]);
                    }
                }

                //if (_def.cap) {
                    this._def.tileMap[0] = (this._def.tileMap[1] == 0 || this._def.tileMap[3] == 0) ? 0 : this._def.tileMap[0];
                    _def.tileMap[2] = (_def.tileMap[1] == 0 || _def.tileMap[5] == 0) ? 0 : _def.tileMap[2];
                    _def.tileMap[6] = (_def.tileMap[3] == 0 || _def.tileMap[7] == 0) ? 0 : _def.tileMap[6];
                    _def.tileMap[8] = (_def.tileMap[5] == 0 || _def.tileMap[7] == 0) ? 0 : _def.tileMap[8];	
                //}
                
                if (_def.tileMap[4] == 1 && _tiles["tile_" + _def.tileMap.join("")] == null) {
                    if (_def.cap) _tiles["tile_" + _def.tileMap.join("")] = TileGenerator.pasteCapTile(tileData, capData, _def);			
                    else _tiles["tile_" + _def.tileMap.join("")] = TileGenerator.makeTile(_def, null, _voronoi);
                }
                
            }
            
        }
        
        _def.tileMap = [1, 1, 1, 1, 0, 1, 1, 1, 1];
        
        var cap = _def.cap;
        _tiles["tile_" + _def.tileMap.join("")] =  TileGenerator.makeTile(_def, null, _voronoi);
        _def.cap = true;
        _def.cap = cap;
        
        
    }
    
    //
    //

    /**
     * 
     * @param {*} tileMap 
     * @param {*} stampName 
     * @param {FlashSprite} stamp 
     * @param {*} rotation 
     * @returns BitmapData
     */

    getTile (tileMap = null, stampName = "", stamp = null, rotation = 0) {
        
        if (stampName != null && stampName.length > 0 && stamp != null) {
            var tileName = "tile_" + stampName + "_" + Math.floor(rotation * rtd);
            if (_tiles[tileName] == undefined) {
                _def.tileMap = [1, 1, 1, 1, 1, 1, 1, 1, 1];
                _tiles[tileName] = TileGenerator.makeTile(_def, null, _voronoi, stamp, rotation); 
            }
            if (_tiles[tileName] != null) {
                return BitmapData(_tiles[tileName]);
            }
        }
        
        if (tileMap == null) {
            if (_tiles["tile_111111111"] != undefined) return _tiles["tile_111111111"]; 
            return null;
        }
        
        //if (_def.cap) {
            tileMap[0] = (tileMap[1] == 0 || tileMap[3] == 0) ? 0 : tileMap[0];
            tileMap[2] = (tileMap[1] == 0 || tileMap[5] == 0) ? 0 : tileMap[2];
            tileMap[6] = (tileMap[3] == 0 || tileMap[7] == 0) ? 0 : tileMap[6];
            tileMap[8] = (tileMap[5] == 0 || tileMap[7] == 0) ? 0 : tileMap[8];
        //}

        if (_tiles["tile_" + tileMap.join("")] == undefined) {
            if (_tiles["tile_111111111"] != undefined) return _tiles["tile_111111111"]; 
            return null;
        }
        
        return BitmapData(_tiles["tile_" + tileMap.join("")]);
        
    }
    
    end () {
        
        if (_tiles != null) {
            
            for (var tile in _tiles) {
                
                if (_tiles[tile] instanceof BitmapData) {
                    BitmapData(_tiles[tile]).dispose();
                }
                
            }
            
        }
        
    }
    
}

module.exports = TileSet;