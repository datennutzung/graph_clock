var canvas;
var label;
var intervar;
var context;
var frameNumber = 0;

const s = {
    gridpx: 120,
    coord_height: 100,
    coord_width: 100,
    edge: 50,
    refresh_time: 1000/60,
    text_size: 18,
    big_dash: 4,
    small_dash: 2,
    timeDotRadius: 4,
    
    secondDotsCount: 15,
    
    hourLineColour: '#00ff00',
    minuteLineColour: '#ff0000',
    secondDotsColour: '#ffff00',
    timeDotColour: '#ff0000',
    gridColour: '#cccccc',
    coordColour: '#000000',
};

_init();

function _init() {
    s.coord_height = s.gridpx*4;
    s.coord_width = s.gridpx*12;
    canvas = document.getElementById("graphClockCanvas");
    label = document.getElementById("frameTimeLabel");
    canvas.width = s.coord_width + s.edge * 2
    canvas.height = s.coord_height + s.edge * 2
    context = canvas.getContext("2d");
    context.translate(0.5, 0.5);
    drawOnce(); // remove. --> startInterval();
}

function x(number) {
    return s.edge+number*s.gridpx
}

function y(number) {
    return s.coord_height+s.edge-number*s.gridpx
}

function startInterval() {
    intervar = setInterval(drawGraphClockCanvas, s.refresh_time)
}

function stopInterval() {
    clearInterval(intervar);
}

function drawOnce() {
    drawGraphClockCanvas();
}

function drawGraphClockCanvas() {
    let time = new Date();
    let hours = time.getHours()>12?time.getHours()-12:time.getHours();          // get hours in 12h format
    let minutes = time.getMinutes();
    let seconds = time.getSeconds();
    let ctx = context;
    ctx.clearRect(0, 0, canvas.width, canvas.height)                            // reset before drawing again
    ctx.lineWidth = 1;
    drawCoordinateSystem(ctx);
    drawGrid(ctx);
    drawTimeDot(hours, minutes, seconds, ctx);
    drawHourLine(hours, minutes, seconds , ctx);
    drawMinuteLines(hours, minutes, seconds, ctx);
    drawSecondDots(hours, minutes, seconds, ctx);
    frameNumber++;
    let timeEnd = new Date();
    label.innerText = "Frame Time: "+(timeEnd.getTime()-time.getTime())+" / Frame Number: "+frameNumber;
}

function drawCoordinateSystem(ctx) {
    ctx.beginPath();
    ctx.strokeStyle = s.coordColour;                                            // set strokestyle of coordinate system

    ctx.moveTo(x(0), y(4));
    ctx.lineTo(x(0), y(0));                                                     // draw y-axis
    ctx.lineTo(x(12), y(0));                                                    // draw x-axis
    ctx.stroke();

    ctx.font = s.text_size+"px Courier New";
    ctx.fillStyle = s.coordColour;
    ctx.fillText("0", x(0)-s.text_size, y(0)+s.text_size);

    for (let i = 0; i <= 12; i++) {                                             // x-axis
        if (i != 0)
            ctx.fillText(i, x(i)-s.text_size*0.3, y(0)+s.text_size);            // draw numbers
        if (i != 12)
            for (let o = 0; o <= 12; o++) {                                     // draw small dashes every 5 minutes
                ctx.moveTo(x(i+o/12), y(0))
                ctx.lineTo(x(i+o/12), y(0)+s.small_dash)
            }
        ctx.moveTo(x(i), y(0)-s.big_dash)                                       // draw big dashes every hour
        ctx.lineTo(x(i), y(0)+s.big_dash)
    }
    ctx.stroke();

    for (let i = 0; i <= 4; i++) {                                              // y-axis
        if (i != 0)
            ctx.fillText(i*15, x(0)-s.text_size*1.5, y(i)+s.text_size*0.25);    // draw numbers
        if (i != 4)
            for (let o = 0; o <= 15; o++) {                                     // draw the small dashes for every minute
                ctx.moveTo(x(0), y(i+o/15))
                ctx.lineTo(x(0)-s.small_dash, y(i+o/15))
            }
        ctx.moveTo(x(0)-s.big_dash, y(i))                                       // draw big dashes for every quarter hour
        ctx.lineTo(x(0)+s.big_dash, y(i))
    }
    ctx.stroke();
}


function drawGrid(ctx) {
    ctx.beginPath();
    ctx.strokeStyle = s.gridColour;                                             // set strokestyle of grid
    for (let i = 1; i <= 12; i++) {                                             // x-axis
        ctx.moveTo(x(i), y(0));
        ctx.lineTo(x(i), y(4));                                                 // draw vertical grid line
    }
    for (let i = 1; i <= 4; i++) {                                              // y-axis
        ctx.moveTo(x(0), y(i));
        ctx.lineTo(x(12), y(i));                                                // draw horizontal grid line
    }
    ctx.stroke();
}

function drawTimeDot(hours, minutes, seconds, ctx) {
    ctx.beginPath();
    ctx.strokeStyle = s.timeDotColour;
    ctx.fillStyle = s.timeDotColour;
    let timeX = hours+(minutes/60)+(seconds/3600);
    ctx.arc(x(timeX), y(0), s.timeDotRadius, 0, 2*Math.PI);
    ctx.fill();
    ctx.stroke();
}

function drawHourLine(hours, minutes, seconds, ctx) {
    ctx.beginPath();
    ctx.strokeStyle = s.hourLineColour;                                         // set strokestyle of hour line
    ctx.lineWidth = 2;                                                          // the hour line is thicker
    let timeX = hours+(minutes/60)+(seconds/3600);                              // x position of the line end is the same as the time dot
    let timeY = timeX/3                                                         // y position of the line end is 1/3 of x-pso because line is linear
    ctx.moveTo(x(0), y(0))                                                      //      and coordinate system has a aspect ratio of 1:3
    ctx.lineTo(x(timeX), y(timeY));                                             // draw the hour line
    ctx.stroke();
}

function drawMinuteLines(hours, minutes, seconds, ctx) {
    // TODO: Draw Minute Line
}

function drawSecondDots(hours, minutes, seconds, ctx) {
    // TODO: Draw Second Dots
}