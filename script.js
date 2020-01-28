var canvas;
var intervar;
var context;

const s = {
    gridpx: 120,
    coord_height: 100,
    coord_width: 100,
    edge: 50,
    refresh_time: 1000/60,
    text_size: 18,
    big_dash: 4,
    small_dash: 2,
    
    debug: true,
};

_init();

function _init() {
    s.coord_height = s.gridpx*4;
    s.coord_width = s.gridpx*12;
    canvas = document.getElementById("graphClockCanvas");

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
    const time = Date();
    const ctx = context;
    ctx.clearRect(0, 0, canvas.width, canvas.height) // reset before drawing again
    drawCoordinateSystem(ctx);
    drawGrid(ctx);
    //drawTimeDot(time, ctx);
    //drawHourLine(time, ctx);
    //drawMinuteLines(time, ctx);
    //drawSecondDots(time, ctx);
    //checkAlignment(time);
}

function drawCoordinateSystem(ctx) {
    console.log("draw coordinate system")
    ctx.moveTo(x(0), y(4));
    ctx.lineTo(x(0), y(0));
    ctx.lineTo(x(12), y(0));
    ctx.stroke();

    ctx.font = s.text_size+"px Courier New";
    ctx.fillText("0", x(0)-s.text_size, y(0)+s.text_size);

    for (let i = 0; i <= 12; i++) {
        if (i != 0)
            ctx.fillText(i, x(i)-s.text_size*0.3, y(0)+s.text_size);
        if (i != 12)
            for (let o = 0; o <= 60; o++) {
                ctx.moveTo(x(i+o/60), y(0))
                ctx.lineTo(x(i+o/60), y(0)+s.small_dash)
            }
        ctx.moveTo(x(i), y(0)-s.big_dash)
        ctx.lineTo(x(i), y(0)+s.big_dash)
    }
    ctx.stroke();

    for (let i = 0; i <= 4; i++) {
        if (i != 0)
            ctx.fillText(i*15, x(0)-s.text_size*1.5, y(i)+s.text_size*0.25);
        if (i != 4)
            for (let o = 0; o <= 15; o++) {
                ctx.moveTo(x(0), y(i+o/15))
                ctx.lineTo(x(0)-s.small_dash, y(i+o/15))
            }
        ctx.moveTo(x(0)-s.big_dash, y(i))
        ctx.lineTo(x(0)+s.big_dash, y(i))
    }
    ctx.stroke();
}


function drawGrid(ctx) {

}