This is an unoffical fork of the original code of the Sploder Platformer Creator. To learn more about the original, [please read the orignal README file by Geoff](README.old.md). 

The purpose of this fork is to port some features of the orignal code into HTML5 and JavaScript. This JavaScript fork divides the script into parts using [ECMA 6 Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules). This requires something like a server to test. It is recommended to use [Microsoft Visual Studio code](https://visualstudio.microsoft.com/) and the [live server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) to develop this.

If one does not want to use visual studio code or does not want to use a live server plugin, this fork includes Webpack to combine all of the JavaScript files into one compact script for the creator.

Currently, this fork aims to create an editor that can read and generate XML data that can be played on Sploder's Platformer Creator. I am not intending to port everything right now.

Apparently, the original Sploder website has been recently shut down. This might make it harder to develop this.

## Resources

The Sploder Platformer creator had resources like audio in the [client/assets/sounds](client/assets/sounds) directory.

The graphics, materials and animations for the Sploder Platformer creator are stored in [client/assets/library_new.swf](client/assets/library_new.swf). A program like [JPEXS](https://github.com/jindrapetrik/jpexs-decompiler) is recommended to extract them.

Some of the shapes have been already extracted and can be seen in the [shapes](/shapes) directory. They are SVG files used to construct objects in the game.

## Testing Server

There is a testing server located in [flashTestingServer](flashTestingServer) that is used to test the creator in flash or [ruffle](https://ruffle.rs/).