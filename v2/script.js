// global variables
var canvas;
var label;
var intervar;
var context;
var timeOffset = 0;

// settings object
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
    secondDotRadius: 2,
    minuteDotRadius: 1.5,
    hourDotRadius: 2,

    normalLineWidth: 1,
    hourLineWidth: 3,
    minuteLineWidth: 1.5,
    secondLineWidth: 1.25,
    coordLineWidth: 1,
    gridLineWidth: 1
};

function init() {

    s.gridpx = (window.innerWidth-150)/12

    s.coord_height = s.gridpx*4;
    s.coord_width = s.gridpx*12;
    
    canvas = document.getElementById("graphClockCanvas");

    canvas.width = s.coord_width + s.edge * 2;
    canvas.height = s.coord_height + s.edge * 2;
    context = canvas.getContext("2d");
    context.translate(0.5, 0.5);
    stopInterval();
    startInterval();

    window.addEventListener('resize', init);

    s.hourLineColour = '#97FF26';
    s.minuteLinesColour = '#FF3800';
    s.secondDotColour = getVar("--secondary");
    s.timeDotColour = '#E05D38';
    s.gridColour = getVar("--light-");
    s.coordColour = getVar("--light");
}

function getVar(cssVar) {
    return getComputedStyle(document.documentElement).getPropertyValue(cssVar)
}

function x(number) {
    return s.edge+number*s.gridpx;                                              // calculates canvas x coordinates from "coordinate system" x coordinates
}

function y(number) {
    return s.coord_height+s.edge-number*s.gridpx;                               // calculates canvas y coordinates from "coordinate system" y coordinates
}

function startInterval() {
    intervar = setInterval(drawGraphClockCanvas, s.refresh_time);               // start the interval
}

function stopInterval() {
    clearInterval(intervar);                                                    // stop the interval
}

function drawOnce() {
    drawGraphClockCanvas();                                                     // draw one frame
}

function drawGraphClockCanvas() {
    let time = new Date(Date.now() + timeOffset);                               // get current time
    let hours = time.getHours()>=12?time.getHours()-12:time.getHours();         // get hours in 12h format
    let minutes = time.getMinutes();
    let seconds = time.getSeconds();
    let milliseconds = time.getMilliseconds();
    let timeX = hours + (minutes / 60) + (seconds / 3600) + (milliseconds / 3600000);       // the time's x-value on the grid
    let ctx = context;
    ctx.clearRect(0, 0, canvas.width, canvas.height);                           // reset before drawing again
    ctx.lineWidth = s.normalLineWidth;
    ctx.textAlign = "left";
    drawCoordinateSystem(ctx);                                                  // draw coordinate system
    drawGrid(ctx);                                                              // draw grid
    drawTimeDot(timeX, time, ctx)
    drawMinuteCurve(timeX, ctx)
    drawHourCurve(timeX, ctx)
    drawSecondsDot(timeX, ctx);
}

function drawCoordinateSystem(ctx) {
    ctx.beginPath();
    ctx.strokeStyle = s.coordColour;                                            // set strokestyle of coordinate system
    ctx.lineWidth = s.coordLineWidth;
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
                ctx.moveTo(x(i+o/12), y(0));
                ctx.lineTo(x(i+o/12), y(0)+s.small_dash);
            }
        ctx.moveTo(x(i), y(0)-s.big_dash);
        ctx.lineTo(x(i), y(0)+s.big_dash);                                      // draw big dashes every hour
    }
    ctx.stroke();

    for (let i = 0; i <= 2; i++) {                                              // y-axis
        text = `${(2 - i) * 90}°`;
        if (i == 1)
            text = `±${(2 - i) * 90}°`;
        ctx.fillText(text, x(0) - s.text_size * (text.length * .65), y(i * 2) + s.text_size * 0.25);    // draw numbers
        if (i != 2)
            for (let o = 0; o <= 30; o++) {
                ctx.moveTo(x(0), y(i * 2 + o / 15));
                ctx.lineTo(x(0) - s.small_dash, y(i * 2 + o / 15));
            }
        ctx.moveTo(x(0) - s.big_dash, y(i * 2));
        ctx.lineTo(x(0) + s.big_dash, y(i * 2));
    }
    ctx.stroke();
}

function drawGrid(ctx) {
    ctx.beginPath();
    ctx.strokeStyle = s.gridColour;                                             // set strokestyle of grid
    ctx.lineWidth = s.gridLineWidth;
    for (let i = 1; i <= 12; i++) {                                             // x-axis
        ctx.moveTo(x(i), y(0));
        ctx.lineTo(x(i), y(4));                                                 // draw vertical grid line
    }
    for (let i = 1; i <= 2; i++) {                                              // y-axis
        ctx.moveTo(x(0), y(i * 2));
        ctx.lineTo(x(12), y(i * 2));                                            // draw horizontal grid line
    }
    ctx.stroke();
}

function calcSineY(cX, freq) {
    cX = cX - s.edge
    let freqFrac = freq / s.coord_width
    let amp = (y(0) - y(4)) / 2
    let cY = amp - amp * Math.sin(cX * 2 * Math.PI * freqFrac + (Math.PI / 2))
    return cY + s.edge;
}

function drawCurve(timeX, freq, strokeStyle, lineWidth, dotRadius, ctx) {
    ctx.beginPath();
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    let cY = y(4)
    for (let cX = x(0); cX < x(timeX); cX++) {
        ctx.moveTo(cX, cY);
        cY = calcSineY(cX, freq)
        ctx.lineTo(cX, cY)
    }
    cX = x(timeX)
    cY = calcSineY(cX, freq)
    ctx.lineTo(cX, cY)
    ctx.arc(cX, cY, dotRadius, 0, 2 * Math.PI);
    ctx.stroke();
}

function drawHourCurve(timeX, ctx) {
    drawCurve(timeX, 1, s.hourLineColour, s.hourLineWidth, s.hourDotRadius, ctx)
}

function drawMinuteCurve(timeX, ctx) {
    drawCurve(timeX, 12, s.minuteLinesColour, s.minuteLineWidth, s.minuteDotRadius, ctx)
}

function drawSecondsDot(timeX, ctx) {
    ctx.beginPath();
    ctx.strokeStyle = s.secondDotColour;                                        // set strokestyle of second dot
    ctx.lineWidth = s.secondLineWidth;
    let timeY = calcSineY(x(timeX), 720);                                         // calculate the y position of the second dot
    ctx.arc(x(timeX), timeY, s.secondDotRadius, 0, 2 * Math.PI)              // draw the second dot
    ctx.stroke();
}

function drawTimeDot(timeX, time, ctx) {
    ctx.beginPath();
    ctx.strokeStyle = s.timeDotColour;                                          // set strokestyle of time dot
    ctx.fillStyle = s.timeDotColour;                                            // set fillstyle of time dot
    ctx.lineWidth = s.secondLineWidth;
    ctx.arc(x(timeX), y(0), s.timeDotRadius, 0, 2*Math.PI);                     // draw a small circle at the time dot
    ctx.fill();                                                                 // fill the circle
    ctx.moveTo(x(timeX), y(4));
    ctx.lineTo(x(timeX), y(0)+s.text_size*1.5);
    ctx.stroke();
    ctx.textAlign = "center";
    let hours = time.getHours()>=10?
            ""+time.getHours():"0"+time.getHours();
    let minutes = time.getMinutes()>=10?
            ""+time.getMinutes():"0"+time.getMinutes();
    let seconds = time.getSeconds() >= 10 ?
        "" + time.getSeconds() : "0" + time.getSeconds();
    let timeText = hours + ":" + minutes + ":" + seconds
    ctx.fillText(timeText, x(timeX), y(0) + s.text_size * 2.25);           // write the current time under the time dot
}

init()

// stopInterval()
// drawOnce()