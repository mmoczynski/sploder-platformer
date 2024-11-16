const tempTile = document.createElement("canvas");
tempTile.width = 60;
tempTile.height = 60;

const temptile_ctx = tempTile.getContext("2d");
temptile_ctx.fillStyle = "white";
temptile_ctx.fillRect(0,0,tempTile.width, tempTile.height);

// Large tile

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
    17: "images/sprites/17.svg",
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
    610: "images/sprites/skulls.svg",
    161: "images/sprites/mace.svg",
    154: "images/sprites/railgun.svg",
    162: "images/sprites/whip.svg",
    157: "images/sprites/powergluv.svg",
    156: "images/sprites/grapple.svg",
    155: "images/sprites/grenades.svg",
    163: "images/sprites/mousegun.svg",
    158: "images/sprites/blastgun.svg",
    160: "images/sprites/big-sword.svg",
    153: "images/sprites/gun.svg",
    152: "images/sprites/jetpack.svg",
    278: "images/sprites/closer.svg",
    266: "images/sprites/permblock-1.svg",
    268: "images/sprites/permblock-2.svg",
    208: "images/sprites/armor/armor-1.svg",
    209: "images/sprites/armor/armor-2.svg",
    210: "images/sprites/armor/armor-3.svg",
    159: "images/sprites/flamethrower.svg",

    66: {

        stack: [
            "images/sprites/jeep-body.svg",
            "images/sprites/car-wheel.svg",
        ],

        height: 218.95,
        width: 253.60
    },

    301: "images/sprites/ninja/ninjaboy.svg",

    302: "images/sprites/thug/thug.svg",

    212: "images/sprites/escapepod/escapepod.svg",
    303: "images/sprites/snarley/creator.svg",
    308: "images/sprites/kikuchiyo/creator.svg",
    306: "images/sprites/archer/creator.svg",
    305: "images/sprites/george/creator.svg",
    304: "images/sprites/thor/creator.svg",

    259: {

        stack: [
            "images/sprites/blueswitch-1.svg",
            "images/sprites/blueswitch-2.svg"
        ],

        width: 60,
        height: 60
    },

    261: {

        stack: [
            "images/sprites/greenswitch-1.svg",
            "images/sprites/greenswitch-2.svg"
        ],

        width: 60,
        height: 60
    },


    263: {

        stack: [
            "images/sprites/yellowswitch-1.svg",
            "images/sprites/yellowswitch-2.svg"
        ],

        width: 60,
        height: 60
    },

    213: "images/sprites/ablity/stomp.svg",
    214: "images/sprites/ablity/roll.svg",
    215: "images/sprites/ablity/smash.svg",
    221: "images/sprites/ablity/jump.svg",

    67: "images/sprites/powersuit/creator.svg",

    65: "images/sprites/rover-creator.svg",

    // Blue key

    253: {

        stack: [

            {
                src: "images/sprites/key/bg.svg",

                colorTransform: {

                    redAddTerm: 0,
                    greenAddTerm: 153,
                    blueAddTerm: 238,
                    alphaAddTerm: 0,

                    redMultTerm: 0,
                    greenMultTerm: 0,
                    blueMultTerm: 0,
                    alphaMultTerm: 256,
                }
            },

            "images/sprites/key/gradient.svg",
            "images/sprites/key/lines.svg"
        ],

        height: 63.5,
        width: 49.6
    },

    // Green key

    254: {
        stack: [
            {
                src: "images/sprites/key/bg.svg",

                colorTransform: {

                    redAddTerm: 0,
                    greenAddTerm: 238,
                    blueAddTerm: 102,
                    alphaAddTerm: 0,

                    redMultTerm: 0,
                    greenMultTerm: 0,
                    blueMultTerm: 0,
                    alphaMultTerm: 256,
                }
            },
            
            "images/sprites/key/gradient.svg",
            "images/sprites/key/lines.svg"
        ],

        height: 63.5,
        width: 49.6
    },

    // Yellow key

    255: {

        stack: [
            {
                src: "images/sprites/key/bg.svg",

                colorTransform: {

                    redAddTerm: 238,
                    greenAddTerm: 221,
                    blueAddTerm: 0,
                    alphaAddTerm: 0,

                    redMultTerm: 0,
                    greenMultTerm: 0,
                    blueMultTerm: 0,
                    alphaMultTerm: 256,
                }
            },
            
            "images/sprites/key/gradient.svg",
            "images/sprites/key/lines.svg"
        ],

        height: 63.5,
        width: 49.6
    },

    // Purple key

    283: {

        stack: [
            {
                src: "images/sprites/key/bg.svg",

                colorTransform: {

                    redAddTerm: 204,
                    greenAddTerm: 0,
                    blueAddTerm: 255,
                    alphaAddTerm: 0,

                    redMultTerm: 0,
                    greenMultTerm: 0,
                    blueMultTerm: 0,
                    alphaMultTerm: 256,
                }
            },
            
            "images/sprites/key/gradient.svg",
            "images/sprites/key/lines.svg"
        ],

        height: 63.5,
        width: 49.6
    },

    269: "images/sprites/leveldoors/leveldoor-1.svg",
    270: "images/sprites/leveldoors/leveldoor-2.svg",
    271: "images/sprites/leveldoors/leveldoor-3.svg",
    272: "images/sprites/leveldoors/leveldoor-4.svg",
    273: "images/sprites/leveldoors/leveldoor-5.svg",
    274: "images/sprites/leveldoors/leveldoor-6.svg",

    260: {
        stack: [
            "images/sprites/bluering-1.svg",
            "images/sprites/bluering-2.svg"
        ],

        width: 60,
        height: 60
    },

    262: {
        stack: [
            "images/sprites/greenring-1.svg",
            "images/sprites/greenring-2.svg"
        ],

        width: 60,
        height: 60
    },


    264: {
        stack: [
            "images/sprites/yellowring-1.svg",
            "images/sprites/yellowring-2.svg"
        ],

        width: 60,
        height: 60
    },

    312: "images/sprites/segfault/creator.svg",
    309: "images/sprites/mongol/mongol.svg",
    319: "images/sprites/native/native.svg",
    322: "images/sprites/rocky/rocky.svg",
    313: "images/sprites/enemymech/creator.svg",
    310: "images/sprites/firetroll/firetroll.svg",
    320: "images/sprites/mercenary/creator.svg",
    321: "images/sprites/minion/creator.svg",
    324: "images/sprites/robot1/creator.svg",
    323: "images/sprites/robot2/creator.svg",
    316: "images/sprites/mutant1/creator.svg",
    317: "images/sprites/mutant2/creator.svg",
    318: "images/sprites/big-mutant/creator.svg",
    300: "images/sprites/vampire-bat/creator.svg",
    100: "images/sprites/hotblock.svg",
    101: "images/sprites/spike.svg",
    106: "images/sprites/spikeblock.svg",
    314: "images/sprites/shark/shark.svg",
    315: "images/sprites/grouperfish/1.svg",
}