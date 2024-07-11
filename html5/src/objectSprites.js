const tempTile = document.createElement("canvas");
tempTile.width = 60;
tempTile.height = 60;

const temptile_ctx = tempTile.getContext("2d");
temptile_ctx.fillStyle = "white";
temptile_ctx.fillRect(0,0,tempTile.width, tempTile.height);


const tempLargeTile = document.createElement("canvas");
tempLargeTile.width = 120;
tempLargeTile.height = 120;

const largetemptile_ctx = tempLargeTile.getContext("2d");
largetemptile_ctx.fillStyle = "white";
largetemptile_ctx.fillRect(0,0,tempTile.width, tempTile.height);

export default {

    3: "images/sprites/3.svg",
    4: "images/sprites/4.svg",

    5: tempTile,

    6: "images/sprites/6.svg",

    7: {
        src: "images/sprites/6.svg",
        scaleX: -1
    },

    456: {
        src: "images/sprites/6.svg",
        scaleY: -1
    },

    457: {
        src: "images/sprites/6.svg",
        scaleX: -1,
        scaleY: -1
    },

    8: "images/sprites/8.svg",

    9: {
        src: "images/sprites/8.svg",
        scaleX: -1
    },

    15: "images/sprites/15.svg",
    16:  "images/sprites/16.svg",
    17: "images/sprites/4.svg",
    18: "images/sprites/18.svg",
    19: "images/sprites/19.svg",
    20: "images/sprites/20.svg",
    21: "images/sprites/21.svg",
    49: "images/sprites/49.svg",
    55: "images/sprites/55.svg",
    56: "images/sprites/56.svg",
    57: "images/sprites/57.svg",
    58: "images/sprites/58.svg",
    60: "images/sprites/60.svg",
    289: "images/sprites/289.svg",
    401: "images/sprites/401.svg",
    402: "images/sprites/402.svg",
    403: "images/sprites/403.svg",
    404: "images/sprites/404.svg",
    405: "images/sprites/405.svg",
    406: "images/sprites/406.svg",
    407: "images/sprites/407.svg",
    408: "images/sprites/408.svg",
    409: "images/sprites/409.svg",
    410:  "images/sprites/410.svg",
    411: "images/sprites/411.svg",
    412: "images/sprites/412.svg",
    413: "images/sprites/413.svg",
    353: "images/sprites/sageowl.svg",
    352: "images/sprites/sagegeneral.svg",
    351: "images/sprites/sagewizard.svg",
    202: "images/sprites/crystal.svg",
    216: "images/sprites/extra-life.svg",
    217: "images/sprites/checkpoint.svg",
    150: "images/sprites/torch.svg",
    207: "images/sprites/jetfuel.svg",
    104: "images/sprites/wheel.svg",
    105: "images/sprites/smallwheel.svg",

    53: {

        stack: [
            "images/sprites/windmill/windmill1.svg",
            "images/sprites/windmill/windmill1-dots.svg",
        ],

        width: 248,
        height:248

    },

    54: {

        stack: [
            "images/sprites/windmill/windmill2.svg",
            "images/sprites/windmill/windmill2-dots.svg",
        ],

        width: 248,
        height:248

    },

    220: {

        stack: [
            "images/sprites/crusher/crusher.svg",
            "images/sprites/crusher/arrows.svg",
        ],

        width: 240,
        height: 240,
    }, 

    107: "images/sprites/barrel.svg",
    59: "images/sprites/rod.svg",
    64: "images/sprites/crate.svg",
    201: "images/sprites/medkit.svg",
    200: "images/sprites/cookie.svg",
    211: "images/sprites/atomic.svg",
    287: "images/sprites/cinderblock.svg",
    80: "images/sprites/tunnels/tunnel.svg",
    81: "images/sprites/tunnels/tunnel-curve.svg",
    82: "images/sprites/tunnels/tunnel-t-junction.svg",
    83: "images/sprites/tunnels/tunnel-4way-junction.svg",
    84: "images/sprites/tunnels/tunnel-end.svg",

    85: {

        stack: [
            "images/sprites/tunnels/tunnel-blue-1.svg",
            "images/sprites/tunnels/tunnel-blue-middle.svg",
            "images/sprites/tunnels/tunnel-blue-2.svg"
        ],

        width: 300,
        height: 300
    },

    86: {

        stack: [
            "images/sprites/tunnels/tunnel-curve-blue-1.svg", // needs resizing feature
            "images/sprites/tunnels/tunnel-blue-middle.svg",
            "images/sprites/tunnels/tunnel-curve-blue-2.svg"
        ],

        width: 300,
        height: 300,

    },

    87: {

        stack: [
            "images/sprites/tunnels/tunnel-t-junction-blue-1.svg",
            "images/sprites/tunnels/tunnel-blue-middle.svg",
            "images/sprites/tunnels/tunnel-t-junction-blue-2.svg"
        ],

        width: 300,
        height: 300


    },


    88: {

        stack: [
            "images/sprites/tunnels/tunnel-4way-junction-blue-1.svg",
            "images/sprites/tunnels/tunnel-blue-middle.svg",
            "images/sprites/tunnels/tunnel-4way-junction-blue-2.svg"
        ],

        width: 300,
        height: 300


    },

    89: {

        stack: [
            "images/sprites/tunnels/tunnel-end-blue-1.svg",
            "images/sprites/tunnels/tunnel-blue-middle.svg",
            "images/sprites/tunnels/tunnel-end-blue-2.svg"
        ],

        width: 300,
        height: 300


    },

    151: "images/sprites/shield.svg",

    22: "images/sprites/lamwalls/1.svg",
    23: "images/sprites/lamwalls/2.svg",
    24: "images/sprites/lamwalls/3.svg",
    25: "images/sprites/lamwalls/4.svg",
    26: "images/sprites/lamwalls/5.svg",
    27: "images/sprites/lamwalls/6.svg",
    28: "images/sprites/lamwalls/7.svg",
    29: "images/sprites/lamwalls/8.svg",
    30: "images/sprites/lamwalls/9.svg",
    31: "images/sprites/lamwalls/10.svg",
    32: "images/sprites/lamwalls/11.svg",
    33: "images/sprites/lamwalls/12.svg",

    69: "images/sprites/goldpanel1.svg",
    70: "images/sprites/goldpanel2.svg",

    250: "images/sprites/doors/autodoor.svg",
    251: "images/sprites/doors/touchdoor.svg",
    256: "images/sprites/doors/bluedoor.svg",
    257: "images/sprites/doors/greendoor.svg",
    258: "images/sprites/doors/yellowdoor.svg",
    277: "images/sprites/doors/onewaydoor.svg",

    601: "images/sprites/frontplant.svg",
    602: "images/sprites/plant.svg",
    603: "images/sprites/frontplant2.svg",
    604: "images/sprites/frontgrass.svg",
    605: "images/sprites/grass.svg",

    613: "images/sprites/truss.svg",

    611: "images/sprites/spiderweb.svg",

    617: {
        scaleX: -1,
        src: "images/sprites/spiderweb.svg"
    },

    606: "images/sprites/etching1.svg",
    607: "images/sprites/etching2.svg",

    40: "images/sprites/statues/statue1.svg",
    41: "images/sprites/statues/statue2.svg",
    42: "images/sprites/statues/statue3.svg",

    608: "images/sprites/statues/frontstatue.svg",
    14: "images/sprites/backlight.svg",
    117: "images/sprites/backwall.svg",

    501: "images/sprites/backbrick-1.svg",
    502: "images/sprites/backbrick-2.svg",
    503: "images/sprites/backbrick-3.svg",
    504: "images/sprites/backbrick-4.svg",

    61: {

        stack: [

            "images/sprites/teleporter/bg.svg",
            
            {
                src: "images/sprites/teleporter/ring.svg",

                colorTransform: {

                    redAddTerm: 255,
                    blueAddTerm: 255,
                    greenAddTerm: 0,
                    alphaAddTerm: 0,

                    redMultTerm: 0,
                    greenMultTerm: 0,
                    blueMultTerm: 0,
                    alphaMultTerm: 256,
                }

            }

        ],

        width: 180,
        height: 180
    },

    62: {

        stack: [
            "images/sprites/teleporter/bg.svg",
            "images/sprites/teleporter/ring.svg"
        ],

        width: 180,
        height: 180
    },

    63: {

        stack: [
            "images/sprites/teleporter/bg.svg",
            "images/sprites/teleporter/ring.svg"
        ],

        width: 180,
        height: 180
    },

    34: "images/sprites/techwall1.svg",
    35: "images/sprites/techwall2.svg",
    78: "images/sprites/rockpile.svg",
    79: "images/sprites/rockpile1.svg",
    609: "images/sprites/frontscreen.svg",
    610: "images/sprites/skulls.svg"

}