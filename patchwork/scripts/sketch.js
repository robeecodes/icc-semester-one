// Array of the different possible Pattern classes which will be drawn to the canvas
const patternStyles = [ShapesPattern, CrossesPattern, DashesPattern, LinesPattern, TartanPattern, RosesPattern, CrosshairPattern, ShrinkingPattern, BubblesPattern];

// patternSize, brushSize and brushColour are global variables so they can be accessed by the Pattern classes as needed
let patternSize, brushSize, brushColour;

function setup() {
  // Create the canvas
  createCanvas(500, 500);
  
  // colorMode set to HSL to help calculate complementary colours using the hue
  colorMode(HSL, 360, 100, 100, 100);
  
  // Background is slightly purple so contrast between patterns and gutters is less harsh
  background(295, 7, 97);
  
  // brushColour is the colour of strokes
  brushColour = color(288, 87, 21);
  
  // The patternSize represents the width and height of each square
  patternSize = width / 6;
  // brushSize variable will be the strokeWeight, so that, if needed, it's easier to update the strokeWeight() and make calculations relative to its size
  brushSize = 1;
  
  // strokeWeight for the main canvas - used to draw the rectangles overlaying the patterns
  strokeWeight(brushSize);
  
  // noLoop() because it's a static image
  noLoop();
  
  // noFill() is applied so the gradient overlays don't cover the patterns
  noFill();
}

function draw() {
  // Move the origin to the centre of the canvas
  translate((width / 2), (height / 2));
  // Rotate the canvas -45 degrees
  rotate(radians(-45));
  
  // The xCount and yCount variables count how many patterns have been drawn along the x and y axes respectively. This is used to determine when gutter should be drawn
  // gutterSide and cornerCount are used to determine the direction of the diagonal lines in the corner patterns
  let xCount = 0, yCount = 0, gutterSide = "right", cornerCount = 0;
  
  // Nested for-loop represents the x and y positions of the top-left corner of each pattern
  for (let x = (-width / 2) - patternSize; x < (width / 2) + patternSize; x += patternSize) {
    yCount = 0;
    cornerCount = 0;
    // Because the y for-loop is nested, patterns are drawn downwards along the y-axis
    for (let y = (-height / 2) - patternSize; y < (height / 2) + patternSize; y += patternSize) {
      
      // patternStyle is set to a random Pattern class from the patternStyles array
      let patternStyle = random(patternStyles);
      // patternStyle constructs the random Pattern using the current values of x and y
      patternStyle = new patternStyle(x, y);
      // The drawPattern method of the random Pattern is called to draw the generated pattern to the screen
      patternStyle.drawPattern();
      
      // Every time a pattern is drawn, the number of patterns down the y-axis increases
      yCount++;
      
      // If yCount is divisible by two (i.e, every two patterns drawn on the y-axis), y is incremented additionally to create a gap between squares
      // A gutter is created between every two squares
      if (yCount % 2 == 0) {
        if (xCount % 2 != 0) {
          // Draw the pattern in each corner
          drawCorner(x + patternSize, y + patternSize, gutterSide, cornerCount);
          cornerCount++;
        }
        // The gutter is one third the size of each pattern
        y += patternSize / 3;
      }
    }
    // If xCount is divisible by two (i.e, every two patterns drawn on the x-axis), x is incremented additionally to create a gap between squares
    // A gutter is created between every two squares
    xCount++;
    if (xCount % 2 == 0) {
      // the gutter is one third the size of each pattern
      x += patternSize / 3;
      // The gutter side changes each time a gutter is drawn
      if (gutterSide == "right") {
        gutterSide = "left";
      } else {
        gutterSide = "right";
      }
    }
  }
}

// Draws the diagonal patterns in the corner of every group of four patterns
function drawCorner(x, y, gutterSide, cornerCount) {
  // Create a canvas to draw the corner pattern
  let corner = createGraphics(patternSize / 3, patternSize / 3);
  
  // Set stroke and fill of corner canvas
  corner.stroke(brushColour);
  corner.noFill();
  
  // corner origin translated to the centre to make rotation easier
  corner.push();
  corner.translate(corner.width / 2, corner.height / 2);
  
  // The rotation of the diagonal lines depends of the placement of the corner pattern
  switch (gutterSide) {
    case "right":
      if (cornerCount % 2 == 0) {
        corner.rotate(radians(45));
      } else {
        corner.rotate(radians(-45));
      }
      break;  
    default:
      if (cornerCount % 2 == 0) {
        corner.rotate(radians(-45));
      } else {
        corner.rotate(radians(45));
      }
      break;
  }
  
  // Draw the lines in the corner canvas
  for (let pos = -corner.width; pos < corner.width; pos += corner.width / 3) {
    corner.line(pos, -corner.height, pos, corner.height);
  }
  corner.pop();
  
  // Draw the border around the lines
  corner.rect(0 + brushSize / 2, 0 + brushSize / 2, corner.width - brushSize);
  
  // Draw the corner pattern to the canvas
  image(corner, x, y);
}