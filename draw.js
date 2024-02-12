const canvas = document.getElementById('drawingCanvas');
const context = canvas.getContext('2d');
let isDrawing = false;
let points = [];
let isPolylineEnded = false;

// Draw axes
function drawAxes() {
  context.beginPath();
  context.moveTo(0, canvas.height / 2);
  context.lineTo(canvas.width, canvas.height / 2);
  context.strokeStyle = 'red';
  context.stroke();

  context.beginPath();
  context.moveTo(canvas.width / 2, 0);
  context.lineTo(canvas.width / 2, canvas.height);
  context.strokeStyle = 'green';
  context.stroke();
}

drawAxes();

// Event listeners for mouse clicks
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);

function handleMouseDown(event) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  if (event.button === 0) { // Left mouse click
    if (isPolylineEnded) {
      // Clear existing points and start a new polyline
      clearCanvas();
      points = [];
      isPolylineEnded = false;
    }
    drawPoint(mouseX, mouseY);
  } else if (event.button === 2) { // Right mouse click
    drawPoint(mouseX, mouseY);
    if (points.length > 0) {
      // Right-click determines the last point of the polyline
      connectPoints(false);
      isPolylineEnded = true;
      logAllPoints(); // Log all points after right-click or finishing the polyline
    }
  }
}

function handleMouseMove(event) {
  if (isDrawing) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Connect the last point to the cursor in real-time
    clearCanvas();
    drawAxes();
    drawExistingLines();

    context.beginPath();
    context.moveTo(points[points.length - 1].x, points[points.length - 1].y);
    context.lineTo(mouseX, mouseY);
    context.strokeStyle = 'black';
    context.stroke();

    // Draw existing points
    for (let i = 0; i < points.length; i++) {
      context.beginPath();
      context.arc(points[i].x, points[i].y, 3, 0, 2 * Math.PI);
      context.fillStyle = 'blue';
      context.fill();
      context.stroke();
    }
  }
}

function drawPoint(x, y) {
  points.push({ x, y });
  isDrawing = true;

  // Draw a point at the cursor's position
  context.beginPath();
  context.arc(x, y, 3, 0, 2 * Math.PI);
  context.fillStyle = 'blue';
  context.fill();
  context.stroke();
}

function drawExistingLines() {
  if (points.length > 1) {
    for (let i = 1; i < points.length; i++) {
      context.beginPath();
      context.moveTo(points[i - 1].x, points[i - 1].y);
      context.lineTo(points[i].x, points[i].y);
      context.strokeStyle = 'black';
      context.stroke();
    }
  }
}

function connectPoints(excludeLastPoint) {
  isDrawing = false;
  if (excludeLastPoint) {
    points.pop(); // Exclude the last point
  }
}

function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawAxes(); // Redraw axes after clearing
}

function logAllPoints() {
  console.log("right clicked -- last point");
  for (let i = 0; i < points.length; i++) {
    console.log(`${i} ${points[i].x} ${points[i].y}`);
  }
}
