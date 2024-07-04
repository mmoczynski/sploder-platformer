Some of the Tile, RampTile, Stair Tile, Texture Block, BackWall, BackWindow, and some other objects use an algorithm that takes in a seed and then generates an image that looks like a rock texture. 

Files used for the tiles:

* [/client/fuz2d/util/TileDefinition.as)](/client/fuz2d/util/TileDefinition.as)
* [/client/fuz2d/util/TileGenerator.as)](/client/fuz2d/util/TileDefinition.as)
* [/client/fuz2d/util/TileSet.as)](/client/fuz2d/util/TileDefinition.as)

These files need to be ported to JavaScript. However, this is not a trivial task.

It appears that the generator uses an algorithm based on perlin nose, flash bitmap, and voronoi diagrams.

Until this is completely ported, a while shape (the "stamp" for such objects) will stand in place for the object. 

Maybe these things will help:

*[https://joeiddon.github.io/projects/javascript/perlin.html](https://joeiddon.github.io/projects/javascript/perlin.html)
*[https://cfbrasz.github.io/Voronoi.html](https://cfbrasz.github.io/Voronoi.html)