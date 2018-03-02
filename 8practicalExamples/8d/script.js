// done basic formating but code still looks messy and slows down at:
// 12000ms. Really 6000ms linear. Maybe make 2 arrays, make maxFlakes 200
// performance monitor says draw function intensive
var canvas = null;
var context = null;
var bufferCanvas = null; // created off screen
var bufferCanvasCtx = null; // created off screen
var flakeArray = [];
var flakeTimer = null;
var maxFlakes = 200;

function Flake() {
    // gives random point for snowflake to falldown
    this.x = Math.round(Math.random() * context.canvas.width);
    this.y = -10;
    this.drift = Math.random(); // different flake falls with a drift
    // different flake speeds. Need + 1 otherwise some will be 0 and not fall
    this.speed = Math.round(Math.random() * 5) + 1;
    this.width = (Math.random() * 3) + 2;
    this.height = this.height = this.width;
}

function init() {
    canvas = document.getElementById('testCanvas');
    context = canvas.getContext('2d');

    bufferCanvas = document.createElement('canvas');
    bufferCanvasCtx = bufferCanvas.getContext('2d');
    bufferCanvasCtx.canvas.width = context.canvas.width;
    bufferCanvasCtx.canvas.height = context.canvas.height;

    // initialize the rects
    flakeTimer = setInterval(addFlake, 200);
    Draw();
    setInterval(animate, 30);
}

function addFlake() {
    flakeArray[flakeArray.length] = new Flake();
    if (flakeArray.length == maxFlakes) {
        clearInterval(flakeTimer);
    }
}

function blank() {
    bufferCanvasCtx.fillStyle = '#303';
    bufferCanvasCtx.fillRect(
        0,
        0,
        bufferCanvasCtx.canvas.width,
        bufferCanvasCtx.canvas.width
    );
}

function animate() {
    Update();
    Draw();
}

function Update() {
    for (var i = 0; i < flakeArray.length; i++) {

        if (flakeArray[i].y < context.canvas.height) {
            flakeArray[i].y += flakeArray[i].speed;

            if (flakeArray[i].y > context.canvas.height) {
                flakeArray[i].y = -5;
            }

            flakeArray[i].x += flakeArray[i].drift;

            if (flakeArray[i].x > context.canvas.width) {
                flakeArray[i].x = 0;
            }
        }
    }
}

function Draw() {
    context.save();

    // create a clipping region. This is the circle!
    bufferCanvasCtx.beginPath();
    bufferCanvasCtx.fillStyle = 'black';

    bufferCanvasCtx.fillRect(
        0,
        0,
        bufferCanvas.width,
        bufferCanvas.height
    );

    bufferCanvasCtx.arc(
        bufferCanvas.width / 2,
        bufferCanvas.height / 2,
        bufferCanvas.height / 3,
        0,
        2 * Math.PI
    );

    bufferCanvasCtx.clip();

    blank();

    for (var i = 0; i < flakeArray.length; i++) {
        bufferCanvasCtx.fillStyle = 'white';

        bufferCanvasCtx.fillRect(
            flakeArray[i].x,
            flakeArray[i].y,
            flakeArray[i].width,
            flakeArray[i].height
        );
    }

    // copy the entire rendered image from the buffer canvas to the visible canvas
    context.drawImage(
        bufferCanvas,
        0,
        0,
        bufferCanvas.width,
        bufferCanvas.height
    );

    context.restore();
}