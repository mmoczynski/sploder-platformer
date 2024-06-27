/**
* Fuz2d: 2d Gaming Engine
* ----------------------------------------------------------------
* ----------------------------------------------------------------
* Copyright (C) 2008 Geoffrey P. Gaudreault
*
* ---
* Partially Ported by @mmoczynski
* Original: https://github.com/neurofuzzy/sploder-platformer/blob/master/client/fuz2d/util/Voronoi.as
*
* Might contain things that are not avilable in JavaScript for now.
* 
* This library needs a JavaScript equivalent of the following:
*
* flash.display.BitmapData [Might be replaceable using JavaScript canvas]: 
* https://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/display/BitmapData.html
*
* flash.display.Graphics [Might be replaceable using JavaScript canvas]:
* https://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/display/Graphics.html
*
* flash.display.Sprite:
* https://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/display/Sprite.html
*
* flash.geom.Point [Might be replaceable using a JavaScript library for simple geometry]:
* https://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/geom/Point.html
*
*/

class Voronoi {
    
    /** Replacement object for flash sprite object */

    _clip;

    /*** Replacement object for Flash Graphics */
    g;
    
    mapWidth = 100;
    mapHeight = 100;
    bgColor = 0x000000;
    fgColor = 0xcccccc;
    _thickness = 1;
    _alpha = 1;
    cellsX = 4;
    cellsY = 4;
    totalCells = 24;
    perturb = 0.3;
    bond = false;
    
    _points;
    
    PI;
    PI2;
    
    distance;
    sx;
    sy;
    ex;
    ey;
    cache;
    ox;
    oy;
    
    //protected var noiseMap:BitmapData;
    randomSeed = 1;
    
    background = true;
    
    get seed() { return this.randomSeed; }
    
    get thickness() { return this._thickness; }
    set thickness(value) { this._thickness = value;	}
    
    get alpha() { return this._alpha; }
    set alpha(value) { this._alpha = value; }
    
    get points() { return this._points; }
    
    get topPoints () {
        
        var pts = [];

        var ymax = (this.cellsY >= 4) ? 1 : 0;
        
        for (var y = 0; y <= ymax; y++) {
            for (var x = 0; x <= this.cellsX + 1; x++) {
                pts.push(this._points[y * (this.cellsX + 2) + x]);
            }
        }
        
        return pts;
        
    }
    
    get leftPoints () {
        
        var pts = [];
        
        var xmax = (this.cellsX >= 4) ? 1 : 0;

        for (var y = 0; y <= cellsY + 1; y++) {
            for (var x = 0; x <= xmax; x++) {
                pts.push(this._points[y * (cellsX + 2) + x]);
            }
        }
        
        return pts;
        
    }
    
    get bottomPoints () {
        
        var pts = [];
        
        var ymin = (cellsY >= 4) ? cellsY : cellsY + 1;

        for (var y = ymin; y <= cellsY + 1; y++) {
            for (var x = 0; x <= cellsX + 1; x++) {
                pts.push(_points[y * (cellsX + 2) + x]);
            }
        }
        
        return pts;
        
    }
    
    get rightPoints () {
        
        var pts = [];

        var xmin = (cellsX >= 4) ? cellsX : cellsX + 1;
        
        for (var y = 0; y <= cellsY + 1; y++) {
            for (var x = xmin; x <= cellsX + 1; x++) {
                pts.push(_points[y * (cellsX + 2) + x]);
            }
        }
        
        return pts;
        
    }
    
    get topLeftPoints () {
        
        var pts = [];
        
        var ymax = (this.cellsY >= 4) ? 1 : 0;
        var xmax = (this.cellsX >= 4) ? 1 : 0;

        for (var y = 0; y <= ymax; y++) {
            for (var x = 0; x <= xmax; x++) {
                pts.push(this._points[y * (this.cellsX + 2) + x]);
            }
        }
        
        return pts;
        
    }
    
    get topRightPoints () {
        
        var pts = [];
        
        var ymax = (this.cellsY >= 4) ? 1 : 0;
        var xmin = (this.cellsX >= 4) ? this.cellsX : this.cellsX + 1;

        for (var y = 0; y <= ymax; y++) {
            for (var x = xmin; x <= cellsX + 1; x++) {
                pts.push(this._points[y * (this.cellsX + 2) + x]);
            }
        }
        
        return pts;
        
    }
    
    get bottomLeftPoints () {
        
        var pts = [];
        
        var ymin = (cellsY >= 4) ? cellsY : cellsY + 1;
        var xmax = (cellsX >= 4) ? 1 : 0;

        for (var y = ymin; y <= cellsY + 1; y++) {
            for (var x = 0; x <= xmax; x++) {
                pts.push(_points[y * (cellsX + 2) + x]);
            }
        }
        
        return pts;
        
    }
    
    get bottomRightPoints () {
        
        var pts = [];
        
        var ymin = (cellsY >= 4) ? cellsY : cellsY + 1;
        var xmin = (cellsX >= 4) ? cellsX : cellsX + 1;

        for (var y = ymin; y <= cellsY + 1; y++) {
            for (var x = xmin; x <= cellsX + 1; x++) {
                pts.push(_points[y * (cellsX + 2) + x]);
            }
        }
        
        return pts;
        
    }
    
    
    get centerPoints () {
        
        var pts = [];
        
        var ymin = (cellsY >= 4) ? 2 : 1;
        var xmin = (cellsX >= 4) ? 2 : 1;
        var ymax = (cellsY >= 4) ? cellsY - 1 : cellsY - 2;
        var xmax = (cellsX >= 4) ? cellsX - 1 : cellsX - 2;

        for (var y = ymin; y <= ymax; y++) {
            for (var x = xmin; x <= xmax; x++) {
                pts.push(_points[y * (cellsX + 2) + x]);
            }
        }
        
        return pts;
        
    }
    
    get clip() { return _clip; }
    
    /**
     * 
     * @param {Sprite} clip 
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
     */

    constructor (
        clip, 
        width = 100, 
        height = 100, 
        backgroundColor = 0x33cccc, 
        edgeColor = 0xcccc33, 
        edgeThickness = 2, 
        cellsX = 4, 
        cellsY = 4, 
        perturbation = 0.3, 
        randomSeed = 1, 
        bond = false
    ) {
        init(
            clip, 
            width, 
            height, 
            backgroundColor, 
            edgeColor, 
            edgeThickness, 
            cellsX, 
            cellsY, 
            perturbation, 
            randomSeed, 
            bond
        );
    }
    
    //
    //
    init (
        clip, 
        width = 100, 
        height = 100, 
        backgroundColor = 0x33cccc, 
        edgeColor = 0xcccc33, 
        edgeThickness = 2, 
        cellsX = 4, 
        cellsY = 4, 
        perturbation = 0.3, 
        randomSeed = 1, 
        bond = false
    ) {
        
        _clip = clip;
        g = _clip.graphics;
        bgColor = backgroundColor;
        fgColor = edgeColor;
        thickness = edgeThickness;
        this.cellsX = cellsX;
        this.cellsY = cellsY;
        this.totalCells = (cellsX + 2) * (cellsY + 2);
        perturb = Math.max(0, Math.min(1, perturbation));
        this.randomSeed = randomSeed;
        this.bond = bond
        this.mapWidth = width;
        mapHeight = height;
        
        ox = Math.floor(mapWidth / (cellsX + 2));
        oy = Math.floor(mapHeight / (cellsY + 2));
        
        cache = totalCells + 4;

        _points = [];
        PI = Math.PI;
        PI2 = 2*PI;

        distance = [];
        
        sx = [];
        sy = [];
        ex = [];
        ey = [];

        noiseMap = new BitmapData(width, height, false);
        noiseMap.perlinNoise(width / 2, height / 2, 4, randomSeed, false, true, 7, true);
        
        this.initPoints();
        
    }
    
    create (seed = -1, offset = true) {
        
        if (seed != -1) {
            randomSeed = seed;
            noiseMap.perlinNoise(mapWidth / 2, mapHeight / 2, 4, randomSeed, false, true);
        }
        
        this.setPoints();
        this.setVoronoi();
        this.draw(0x000000, offset);
        
    }
    
    redraw (color, offset = true) {
        
        g.clear();
        draw(color, offset);
        
    }
    
    //
    //
    initPoints () {

        for (var i = 0; i < totalCells; i++) _points.push(new Point(0,0));

    }
    
    //
    //
    setPoints () {

        var h;
        var col;
        var row;
        var idx;
        var coreCells = cellsX * cellsY;
        
        var pr = 0;
        var px = 0;
        var py = 0;
        
        for (var i = 0; i < coreCells; i++) {
            
            h = (bond) ? i % 2 - 0.5 : 1;

            col = i % cellsX;
            row = Math.floor(i / cellsX);
            idx = ((row + 1) * (cellsX + 2)) + (col + 1);
            
            _points[idx].x = (mapWidth / cellsX) * (0.5 + col + 0.5);
            _points[idx].y = (mapHeight / cellsY) * (0.5 + row + 0.5 * h);

            if (perturb > 0) {
                
                pr = noiseMap.getPixel(_points[idx].x - ox, _points[idx].y - oy) >> 16;
                pr -= 128;
                pr *= (360 / 128) * Math.PI / 180;

                px = Point.polar(1, pr).x;
                py = Point.polar(1, pr).y;
                
                _points[idx].x += (mapWidth / cellsX) * px * perturb;
                _points[idx].y += (mapHeight / cellsY) * py * perturb;
            
            }
            
            if (row == 0) {

                _points[idx + (cellsX + 2) * cellsY].x = _points[idx].x;
                _points[idx + (cellsX + 2) * cellsY].y = _points[idx].y + mapHeight;
                
            } else if (row == cellsY - 1) {

                _points[col + 1].x = _points[idx].x;
                _points[col + 1].y = _points[idx].y - mapHeight;

            }
            
            if (col == 0) {
    
                _points[idx + cellsX].x = _points[idx].x + mapWidth;
                _points[idx + cellsX].y = _points[idx].y;
                    
            } else if (col == cellsX - 1) {
        
                _points[idx - cellsX].x = _points[idx].x - mapWidth;
                _points[idx - cellsX].y = _points[idx].y;	

            }
            
        }
        
        // top left wrapped tile point
        _points[(cellsY) * (cellsX + 2) + (cellsX)].x - mapWidth;
        _points[0].y = _points[(cellsY) * (cellsX + 2) + (cellsX)].y - mapHeight;
        
        // top right wrapped tile point
        _points[cellsX + 1].x = _points[(cellsY) * (cellsX + 2) + 1].x + mapWidth;
        _points[cellsX + 1].y = _points[(cellsY) * (cellsX + 2) + 1].y - mapHeight;
        
        // bottom left wrapped tile point
        _points[(cellsX + 2) * (cellsY + 1)].x = _points[2 * (cellsX + 2) - 2].x - mapWidth;
        _points[(cellsX + 2) * (cellsY + 1)].y = _points[2 * (cellsX + 2) - 2].y + mapHeight;
        
        // bottom right wrapped tile point
        _points[(cellsX + 2) * (cellsY + 2) - 1].x = _points[(cellsX + 2) + 1].x + mapWidth;
        _points[(cellsX + 2) * (cellsY + 2) - 1].y = _points[(cellsX + 2) + 1].y + mapHeight;
            
    }
    
    //
    //
    setVoronoi () {
        
        var i, j, k, m, n;
        var a, b, a0, b0, a1, b1, x, y, x0, y0, x1, y1;
            
        for (i = 0; i < totalCells; i++) {

            x0 = _points[i].x;
            y0 = _points[i].y;
            n = i * cache + i + 1;
            
            for (j = i + 1; j < totalCells; j++) {
                
                x1 = _points[j].x;
                y1 = _points[j].y;
                
                if (x1 == x0) {
                    a = 0;
                } else if (y1 == y0) {
                    a = 10000;
                } else {
                    a = -1 / ((y1 - y0) / (x1 - x0));
                }
                
                b = (y0 + y1) / 2-a * (x0 + x1) / 2;

                if (a > -1 && a <= 1) {
                    
                    sx[n] = 0 - ox;
                    sy[n] = a * sx[n] + b;
                    ex[n] = mapWidth + ox + ox - 1;
                    ey[n] = a * ex[n] + b;
                    
                } else {
                    
                    sy[n] = 0 - oy;
                    sx[n] = (sy[n] - b) / a;
                    ey[n] = mapHeight + oy + oy  - 1;
                    ex[n] = (ey[n] - b) / a;
                    
                }
                
                n++;
                
            }


            
        }
        
        for (i = 0; i < totalCells; i++) {
            
            x0 = _points[i].x;
            y0 = _points[i].y;
            
            for (j = 0; j < totalCells + 4; j++) {
                
                if (j != i) {
                    
                    if (j > i) {
                        n = i * cache + j;
                    } else {
                        n = j * cache + i;
                    }
                    
                    if (sx[n] > -Number.MAX_VALUE) {
                        
                        a0 = (ey[n] - sy[n]) / (ex[n] - sx[n]);
                        b0 = sy[n] - a0 * sx[n];
                                        
                        for (k = i + 1; k < totalCells + 4; k++) {
                            
                            if (k != j) {
                                
                                m = i * cache + k;
                                
                                if (sx[m] > -Number.MAX_VALUE) {
                                    
                                    a1 = (ey[m] - sy[m]) / (ex[m] - sx[m]);
                                    b1 = sy[m] - a1 * sx[m];	
                                    x = -(b1 - b0) / (a1 - a0);
                                    y = a0 * x + b0;
                                    
                                    if ((a0 * x0 + b0 - y0) * (a0 * sx[m] + b0 - sy[m]) < 0) {
                                        sx[m] = x;
                                        sy[m] = y;
                                    }
                                    
                                    if ((a0 * x0 + b0 - y0) * (a0 * ex[m] + b0 - ey[m]) < 0) {
                                        if (sx[m] == x) {
                                            sx[m] = -Number.MAX_VALUE;
                                        } else {
                                            ex[m] = x;
                                            ey[m] = y;
                                        }
                                    }
                                    
                                }
                                
                            }
                            
                        }
                        
                    }
                    
                }
                
            }
            
        }
        
    }
    
    //
    //
    draw (c, offset = true) {
        
        var i, j, n;
        
        this.g.clear();
        this.g.lineStyle(2, 0x000000, 1);
        this.g.beginFill(this.bgColor, 1);
        if (this.background) g.drawRect(0, 0, this.mapWidth + this.ox + this.ox, this.mapHeight + this.oy + this.oy);
        this.g.endFill();
        
        this.g.lineStyle(this.thickness, this.fgColor, this._alpha);
        
        for (i = 0; i < this.totalCells; i++) {
            
            n = i * this.cache + i + 1;
            
            for (j = i + 1; j < this.totalCells + 4; j++) {
                
                if (this.sx[n] > -Number.MAX_VALUE) {
                    
                    if (offset) {
                        
                        this.g.moveTo(this.sx[n] - ox, sy[n] - oy);
                        this.g.lineTo(ex[n] - ox, ey[n] - oy);
                    
                    } else {
                        
                        this.g.moveTo(this.sx[n], sy[n]);
                        this.g.lineTo(this.ex[n], ey[n]);
                        
                    }
                    
                    
                }
                
                n++;
                
            }
            
        }
        
    }
    
}

module.exports = Voronoi;