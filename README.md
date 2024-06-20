This is an unoffical fork of the original code of the Sploder Platformer Creator. The purpose of this fork is to port some features of the orignal code into HTML5 and JavaScript. This fork utlizes Webpack to combine all of the JavaScript files into one compact script for the creator. To learn more, [please read the orignal README file by Geoff](README.old.md).

Currently, this fork aims to create an editor that can read and generate XML data that can be played on Sploder's Platformer Creator. I am not intending to port everything right now.

Apparently, the original Sploder website has been recently shut down. This might make it harder to develop this.

## Resources

The Sploder Platformer creator had resources like audio in the [client/assets/sounds](client/assets/sounds) directory.

The graphics, materials and animations for the Sploder Platformer creator are stored in [client/assets/library_new.swf](client/assets/library_new.swf). A program like [JPEXS](https://github.com/jindrapetrik/jpexs-decompiler) is recommended to extract them.

Some of the shapes have been already extracted and can be seen in the [shapes](/shapes) directory. They are SVG files used to construct objects in the game.