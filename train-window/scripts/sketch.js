// trainWindow is an object containing the dimensions and position of the windw
let trainWindow;

// trainMovement is provided to noise in the bounce variable
let trainMovement = 0;

function setup() {
  createCanvas(500, 500);
  
  trainWindow = {
    w: 2 * width / 3,
    h: 2 * height / 3,
    x: width / 6,
    y: height / 6
  }
    
  noStroke();
  
  // Initialise the mountains. The mountain canvas is slightly larger than the rounded rectangle frame so it has some leeway to bounce
  setupMountains(5.5 * width / 9, 5.5 * height / 9);
}

function draw() {
  background(color("#83310c"));
  
  // Bounce uses perlin noise to move the window slightly on the y-axis, giving the illusion of the train rumbling
  let bounce = noise(trainMovement) * 10;
  
  // Draw the train window
  fill(color("#4f1d07"));
  rect(trainWindow.x, trainWindow.y + bounce, trainWindow.w, trainWindow.h);
  
  // Mountains are drawn clipped to a rounded rect
  push();
  beginClip();
  rect(2 * width / 9, 2 * height / 9 + bounce, 5 * width / 9, 5 * height / 9, mountainPainting.width / 12);
  endClip();
  // Draws the mountains to the main canvas
  renderMountains();
  pop();

  
  // Create the blinds
  fill(color("#E4B7A4"));
  stroke(color("#5D2913"));

  let blindHeight = trainWindow.h / 12;
  rect(trainWindow.x, trainWindow.y + bounce, trainWindow.w, blindHeight);
  rect(trainWindow.x, trainWindow.y + blindHeight + bounce, trainWindow.w, blindHeight);
  rect(trainWindow.x, trainWindow.y + blindHeight * 2 + bounce, trainWindow.w, blindHeight / 15);
  
  trainMovement += 0.05;
}