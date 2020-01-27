const canvas = document.getElementById("graphClockCanvas");

var intervar = setInterval(drawGraphClockCanvas, 1000/60)

function drawGraphClockCanvas() {
    const time = Date();
    drawCoordinateSystem(canvas);
    drawTimeDot(time, canvas);
    drawGrid(canvas);
    drawHourLine(time, canvas);
    drawMinuteLines(time, canvas);
    drawSecondDots(time, canvas);
    checkAlignment(time)
}