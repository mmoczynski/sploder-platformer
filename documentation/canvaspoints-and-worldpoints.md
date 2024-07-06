The port of the Platformer creator makes a distinction between `CanvasPoints` and `WorldPoints`. The former is used to represent a point relative to the creator canvas and the later is used to represent a point in the world. To utilize them, use the [`html5/src/point.js`](../html5/src/point.js) module.

A point is measured relative to the world using the vector $ (w_x, w_y) $. A point is measured relative to the canvas using the vector $ (c_x, c_y) $

1. $ c_x = w_x k + d_x + \frac {w}{2} $
2. $ c_y = -w_y k + d_y + \frac {h}{2} $

Where:

* $ k $ is the zoom factor
* $ d_x $ is the amount by which the creator viewport has been transformed by the mouse in the x-direction.
* $ w $ is the canvas width.
* $ h $ is the canvas height.

In both formulas, the world point is scaled. For example, zooming in increases $ k $ and therefore scales the world point vector positively. Zooming out decreases it and therefore makes it appear smaller . This scaled vector is then displaced by the mouse and the halves of the canvas dimensions. 

The y-direction of the canvas frame of refernce and the y-direction of the world's frame of refrence are opposites.

By defaut, $ k = 1 $, $ d_x = 0 $, and $ d_y = 0 $. This means that if the user does not zoom in/out or navigate using the mouse, the formulas reduce to the following:

1. $ c_x = w_x + \frac {w}{2} $
2. $ c_y = -w_y + \frac {h}{2} $

This means the world point $ (0, 0) $ is located in the center of the canvas $ (\frac {w}{2}, \frac {h}{2}) $ by default.

Solving for $ w_x $ and $ w_y $ using algebra reveals the inverse. Here is the formula for getting $ w_x $

1. $ c_x = w_x k + d_x + \frac {w}{2} $
2. $ c_x - d_x = (w_x k + d_x + \frac {w}{2}) - d_x $
3. $ c_x - d_x = w_x k + \frac {w}{2} $
4. $ c_x - d_x - \frac {w}{2} = (w_x k + \frac {w}{2}) - \frac {w}{2} $ 
5. $ c_x - d_x - \frac {w}{2} = w_x k $ 
6. $ \frac{c_x - d_x - \frac {w}{2}}{k} = \frac{w_x k}{k} $ 
7. $ \frac{c_x - d_x - \frac {w}{2}}{k} = w_x $ 
8. $ w_x = \frac{c_x - d_x - \frac {w}{2}}{k} $ 

A simular procedure is used to derive this formula:

$ w_y = \frac{-(c_y - d_y - \frac {h}{2})}{k} $
