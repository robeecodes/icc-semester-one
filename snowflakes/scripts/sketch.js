// This programme uses p5.Polar (Peng, 2020)

// Possible shapes for each part of the snowflake
const shapes = ["ellipse", "hexagon", "triangle"];

// Array to store each snowflake
const snowflakes = [];

function setup() {
  createCanvas(500, 500);
  
  
  // Set the maximum and minimum possible radii of the snowflakes
  let maxRadius = width / 5;
  let minRadius = width / 20;
  
  
  // Fit many snowflakes onto the screen without intersecting (Bohnacker, Groß, Laub and Lazzeroni, 2018)
  for (let i = 0; i < 100; i++) {
    // x and y positions for a new snowflake are generated
    let newX = random(width);
    let newY = random(height);
    // A radius value is incremented down from maxRadius until the snowflake either doesn't inersect any other or minRadius is reached
    for (let newR = maxRadius; newR >= minRadius; newR--) {
      let intersection = snowflakes.some(snowflake => {
        return dist(newX, newY, snowflake.x, snowflake.y) < snowflake.radius + newR;
      });
      // If there is no intersection at the current radius, a new snowflake is added to the snowflakes array
      if (!intersection) {
        snowflakes.push(new Snowflake(newX, newY, newR));
        break;
      }
    }
  }
  
  noLoop();
}

function draw() {
  background(220);
  
  // Draws the background gradient
  drawGradient(color("#7BC6FE"), color("#ECFBFF"));
  
  stroke(210, 233, 255, 200);
  fill(255, 255, 255, 200);
  
  // Draw each snowflake in the array
  snowflakes.forEach(snowflake => {
    snowflake.drawSnowflake();
  })
}

// Draws the background gradient
function drawGradient(c1, c2) {
  for (let y = 0; y < height; y ++) {

    // stepDown calculates the current y position as a value between 1 and 0
    let stepDown = map(y, 0, height, 0, 1);
    
    // colour1 and colour2 are then interpolated baased on their y-position to create the gradient effect
    let colour = lerpColor(c1, c2, stepDown);
    
    // A line is drawn across the screen using the final interpolated colour
    stroke(colour);
    line(0, y, width, y);
  }
}

// References
// Bohnacker, H., Groß, B., Laub, J and Lazzeroni, C (2018) Generative Gestaltung – Creative Coding im Web - P_2_2_5_02 [online]. Available from: https://editor.p5js.org/generative-design/sketches/P_2_2_5_02. [Accessed 02 December 2023].
// Peng, L (2020) p5.Polar [online]. Available from: https://github.com/liz-peng/p5.Polar [Accessed 02 December 2023].