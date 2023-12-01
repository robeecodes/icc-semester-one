// this is the abstract Pattern class, providing the framework for the Pattern subclasses
// Creating abstract class functionality: (O'Kane and Possamai 2018)
class Pattern {
  constructor(offsetX, offsetY) {
    // If someone tries to instantiate this class, it throws an error
    if (this.constructor == Pattern) {
      throw new Error("Abstract classes cannot be instantiated");
    }

    // offsetX provides the x-axis position of the Pattern
    this.offsetX = offsetX;
    // offsetY provides the y-axis position of the Pattern
    this.offsetY = offsetY;

    // The backgroundColour of the Pattern is randomly generated with contraints on saturation and luminosity to prevent colours being too dull or too bright
    this.backgroundColour = color(random(360), random(60, 70), random(70, 85));

    // the colour of the pattern on the background is calculated using createComplement() - providing a complementary colour to the background
    this.patternColour = this.createComplement();

    // patternSurface is the Canvas created for the Pattern to be drawn in
    this.patternSurface = createGraphics(patternSize, patternSize);
    // set the background of the patternSurface Canvas to backgroundColour
    this.patternSurface.background(this.backgroundColour);
    // by default, the patterns drawn in the patternSurface Canvas have no stroke
    this.patternSurface.noStroke();
  }

  // createComplement() creates a colour complementary to the backgroundColour
  createComplement() {
    // return a new colour which complements the backgroundColour
    return color(
      // the hue of backgroundColour is increased by a random value between 150 and 210
      // a perfect complement would always increase by 180, but the use of a range produces more variance in the results while still creating a colour with good contrast
      // using % 360 allows the hue value to wrap around if it exceeds 360
      (hue(this.backgroundColour) + random(150, 210)) % 360,
      // saturation and luminosity are restricted to prevent colours from being too bright or too dull
      random(75, 85), random(70, 80)
    );
  }

  // drawPattern() draws the pattern to the main Canvas
  drawPattern() {
    // generatePattern() draws the pattern in the patternSurface Canvas
    this.generatePattern();
    // image() draws the patternSurface canvas to the main Canvas, using offsetX and offsetY for positioning
    image(this.patternSurface, this.offsetX, this.offsetY);
    // drawGradient() creates the gradient overlay on top of each pattern
    this.drawGradient();
    // the stroke colour of the main Canvas is set so a rect() can be drawn on top of the pattern, giving it a border
    stroke(brushColour);
    // the position of the rect() uses offsetX and offsetY, while its width and height are the same size as the pattern's
    rect(this.offsetX, this.offsetY, patternSize);
  }

  // generatePattern() draws the pattern in the patternSurface Canvas
  generatePattern() {
    // It isn't implemented in the main abstract Pattern class as each Pattern subclass will have a unique pattern
    throw new Error("Method 'generatePattern()' must be implemented.");
  }

  // drawGradient() draws the gradient overlay for each pattern
  drawGradient() {
    // blendMode(OVERLAY) is used so the gradient has a subtle effect without the grey colours dulling the pattern
    blendMode(OVERLAY);
    // The gradient is created by drawing rectangles that decrease in size and opacity until opacity reaches 0
    let opacity = 60;
    // count is used to determine the x and y position each smaller rect() should be drawn at
    let count = 0;

    // for-loop increments i down from patternSize to determine the width and height of each smaller rect()
    for (let i = patternSize; i > 0; i--) {
      // The stroke is set to a grey colour with the alpha determined by the decrementing opacity variable
      stroke(color(0, 0, 40, opacity));
      // the smaller rectangle is drawn, utilising the count variable to position it correctly
      rect(this.offsetX + count, this.offsetY + count, i);
      // the opacity decreased by 1.5 with each iteration
      opacity -= 1.5;

      // stop the loop if the rect() would be transparent
      if (opacity <= 0) {
        break;
      }

      // count increments by brushSize / 2 each iteration, which creates a very smooth gradient as each rect will overlap slightly
      count += brushSize / 2;
    }

    // Ensures blendMode is returned to BLEND when done to prevent performance and display issues
    blendMode(BLEND);
  }

}

// ShapesPattern will either draw a circle or triangle-based pattern
class ShapesPattern extends Pattern {
  generatePattern() {
    // state is a random number between 0 and 1
    let state = random();

    // shapeWidth represents the full width of each shape
    let shapeWidth = patternSize / 9;
    // shapeRadius represents half the width of each shape
    let shapeRadius = shapeWidth / 2;

    // Colour the shapes using the patternColour variable
    this.patternSurface.fill(this.patternColour);

    // Switch statement uses the state variable, so there is a 50% chance of circles or triangles being drawn
    switch (state >= 0.5) {
      case true:
        this.drawTriangles(shapeWidth, shapeRadius);
        break;
      default:
        this.drawCircles(shapeWidth, shapeRadius);
    }
  }

  // drawTriangles draws the pattern of triangles 
  drawTriangles(shapeWidth, shapeRadius) {
    // for-loop determines the x-position of each triangle
    for (let x = -shapeWidth / 2; x < patternSize + shapeWidth; x += shapeWidth * 2) {
      // for-loop determines the y-position of each triangle
      for (let y = 0; y < patternSize + shapeWidth; y += shapeWidth * 4) {
        // triangle is drawn to the patternSurface
        this.patternSurface.triangle(
          x - shapeWidth, y - shapeWidth,
          x - shapeRadius, y - shapeWidth * 2,
          x, y - shapeWidth
        );
        // and a staggered triangle is drawn on the row beneath
        this.patternSurface.triangle(
          x, y + shapeWidth,
          x + shapeRadius, y,
          x + shapeWidth, y + shapeWidth
        );
      }
    }
  }

  // drawCircles draws the pattern of circles
  drawCircles(shapeWidth) {
    // for-loop determines the x-position of each circle
    for (let x = 0; x < patternSize; x += shapeWidth * 2) {
      // for-loop determines the y-position of each circle
      for (let y = 0; y < patternSize; y += shapeWidth * 4) {
        // a circle is drawn at x, y
        this.patternSurface.circle(x, y, shapeWidth);
        // a staggered circle is drawn on the row below
        this.patternSurface.circle(x + shapeWidth, y + shapeWidth * 2, shapeWidth);
      }
    }
  }
}

// CrossesPattern draws xs or +s in horizontal lines
class CrossesPattern extends Pattern {
  generatePattern() {
    // state is a random number between 0 and 1
    let state = random();

    // shapeWidth is the width of each cross
    let shapeWidth = patternSize / 9;

    // Set the stroke to be the generated patternColour
    this.patternSurface.stroke(this.patternColour);

    // state is used to randomly draw + or x shapes
    switch (state >= 0.5) {
      case true:
        this.drawCrosses(shapeWidth, 0);
        break;
      default:
        this.drawCrosses(shapeWidth, 45);
    }
  }

  drawCrosses(shapeWidth, rotation) {
    // Translate origin to the centre of patternSurface
    this.patternSurface.translate(patternSize / 2, patternSize / 2);
    // Rotate about the rotation parameter
    this.patternSurface.rotate(radians(rotation));

    // x for-loop determines x position of each cross
    for (let x = -patternSize; x < patternSize + shapeWidth / 2; x += shapeWidth) {
      // y for-loop determines y position of each cross
      for (let y = -patternSize; y < patternSize; y += shapeWidth * 2) {
        // push() and pop() allows translation to the centre of each cross drawn
        this.patternSurface.push();
        this.patternSurface.translate(x, y);

        // Draw a cross
        this.patternSurface.line(
          x - shapeWidth / 2, y,
          x + shapeWidth / 2, y
        );
        this.patternSurface.line(
          x, y - shapeWidth / 2,
          x, y + shapeWidth / 2
        );

        // Draw a staggered cross on the row below
        this.patternSurface.line(
          x + shapeWidth / 2, y + shapeWidth * 2,
          x + 3 * shapeWidth / 2, y + shapeWidth * 2
        );
        this.patternSurface.line(
          x + shapeWidth, y + shapeWidth * 2 - shapeWidth / 2,
          x + shapeWidth, y + shapeWidth * 2 + shapeWidth / 2
        );
        this.patternSurface.pop();
      }
    }
  }
}

// DashesPattern draws the pattern of dashes in the shape of an x or a +
class DashesPattern extends Pattern {
  generatePattern() {
    // state is a random number between 0 and 1
    let state = random();

    // dashLength is the length of each dash
    let dashLength = patternSize / 9;

    // the stroke of the patternSurface Canvas is set to the patternColour
    this.patternSurface.stroke(this.patternColour);

    // the origin of the patternSurface Canvas is moved to the centre to make rotation easier
    this.patternSurface.translate(patternSize / 2, patternSize / 2);

    // the patternSurface Canvas is scaled a small amount to help the pattern fill it better
    this.patternSurface.scale(1.15);

    // there is a 50% chance of drawing an x or a + shape
    switch (state >= 0.5) {
      case true:
        // Draw vertical cross
        this.drawCross(dashLength, 0);
        break;
      default:
        // Draw diagonal cross
        this.drawCross(dashLength, -45);
        break;
    }
  }

  // drawCross will draw the dashes in a + shape
  drawCross(dashLength, rotation) {
    // the patternSurface canvas is rotated by the rotation parameter
    this.patternSurface.rotate(radians(rotation));
    // this for-loop draws the vertical dashes
    for (let y = -patternSize / 2; y < patternSize / 2; y += dashLength * 2) {
      this.patternSurface.line(0, y, 0, y + dashLength);
    }
    // this for-loop draws the horizontal dashes
    for (let x = -patternSize / 2; x < patternSize / 2; x += dashLength * 2) {
      this.patternSurface.line(x, 0, x + dashLength, 0);
    }
  }

}

// LinesPattern draws the pattern of colourful horizontal or vertical rectangles
class LinesPattern extends Pattern {
  generatePattern() {
    // The colour of each rectangle is generated by interpolating between the backgroundColour and patternColour
    const rectColours = [
      this.backgroundColour,
      lerpColor(this.backgroundColour, this.patternColour, 0.33),
      lerpColor(this.backgroundColour, this.patternColour, 0.66),
      this.patternColour
    ];

    // state is a random number between 0 and 1
    let state = random();
    // rectwidth is how thick the rectangles will be
    let rectWidth = patternSize / rectColours.length;

    // Set the stroke colour
    this.patternSurface.stroke(brushColour);

    // Translate to the centre of patternSurface to make rotation easier
    this.patternSurface.translate(patternSize / 2, patternSize / 2);

    // 50% chance the pattern is drawn horizontally or vertically
    switch (state >= 0.5) {
      case true:
        // Vertical
        this.drawLines(rectColours, rectWidth, 0);
        break;
      default:
        // Horizontal
        this.drawLines(rectColours, rectWidth, 90);
        break;
    }
  }

  drawLines(rectColours, rectWidth, rotation) {
    // Rotate by the rotation parameter
    this.patternSurface.rotate(radians(rotation));
    // Count tracks which colour to make the rectangle
    let count = 0;
    // Position rectangles along the x-axis
    for (let x = -patternSize / 2; x < patternSize / 2; x += patternSize / rectColours.length) {
      // Set the fill of the current rectangle
      this.patternSurface.fill(rectColours[count]);
      // Draw the rectangle
      this.patternSurface.rect(x, -patternSize / 2, rectWidth, patternSize);
      count++;
    }
  }
}

// TartanPattern draws the tartan pattern
class TartanPattern extends Pattern {
  generatePattern() {

    // The colours of the tartan pattern are either a lighter or darker version of the backgroundColour or a translucent version of the patternColour variable for contrast
    const tartanColours = [
      color(hue(this.backgroundColour), saturation(this.backgroundColour), 40, 70),
      color(hue(this.backgroundColour), saturation(this.backgroundColour), 90, 70),
      color(hue(this.patternColour), saturation(this.patternColour), lightness(this.patternColour), 70)
    ]

    // Remove the stroke
    this.patternSurface.noStroke();

    // Initialise the position of the first horizontal rectangle
    let y = this.posCalculator();

    // Draw full-width horizontal rectangles of variable heights and random colours down the y-axis
    while (y < patternSize) {
      // Choose a random fill colour
      this.patternSurface.fill(random(tartanColours));
      // Create a height for the rectangle
      let rectHeight = this.posCalculator();

      // Draw rectangle with height of rectHeight and origin at 0, y
      this.patternSurface.rect(0, y, patternSize, rectHeight);

      // Move y to the bottom of the rectangle and then set it to a random point below that
      y += rectHeight + this.posCalculator();
    }

    let x = this.posCalculator();

    // Draw full-height vertical rectangles of variable widths and random colours across the x-axis
    while (x < patternSize) {
      // Choose a random fill colour
      this.patternSurface.fill(random(tartanColours));

      // Create a width for the rectangle
      let rectWidth = this.posCalculator();

      // Draw rectangle with width of rectWidth and origin at x, 0
      this.patternSurface.rect(x, 0, rectWidth, patternSize);

      // Move x to the right edge of the rectangle and then set it to a random point further to the right
      x += rectWidth + this.posCalculator();
    }
  }

  // posCalculator is used to generate the widths, heights and positions of the tartan stripes. It uses a restricted range so a good combination of thick and thin stripes are produced without producing enormous or tiny stripes or gaps
  posCalculator() {
    return random((patternSize / 200), (patternSize / 8));
  }
}

// RosesPattern draws the roses pattern
// Mathematical Roses Overview (Wikipedia, 2023)
class RosesPattern extends Pattern {
  constructor(offsetX, offsetY) {
    super(offsetX, offsetY);
    // Stores each rose for comparison
    this.roses = [];
    // This stores how many times the program has attempted to create a rose that doesn't intersect
    this.verifications = 0;
    this.patternSurface.fill(this.patternColour);
    this.patternSurface.stroke(brushColour);
    this.patternSurface.strokeWeight(0.25);
  }

  generatePattern() {
    // Create up to ten roses
    while (this.roses.length < 10) {
      // If the same rose has been attempted more than ten times, stop
      if (this.verifications > 10) {
        break;
      }
      // Creates a rose
      this.createRose();
    }

    // Draw each rose
    this.roses.forEach(rose => {
      this.drawRose(rose);
    });
  }

  // Creates a new rose to add to the roses array
  createRose() {
    // Numerator of the angular frequency
    let n = 0;
    // Denominator of the angular frequency
    let d = 0;

    // Update numerator and denominator so they are not equal
    while (n == d) {
      n = Math.ceil(random(3, 9));
      d = Math.ceil(random(3, 9));
    }

    // The angular frequency
    let k = n / d;

    // The amount of revolutions required to draw the rose
    let revolutions = this.reduceDenominator(n, d) * TWO_PI;

    // The current rose is an object containing a random x and y value with the angular frequency, k, the radius, a, and number of revolutions needed to draw it
    let currRose = {
      x: random(this.patternSurface.width),
      y: random(this.patternSurface.height),
      k: k,
      a: random(this.patternSurface.width / 6, this.patternSurface.width / 4),
      revolutions: revolutions
    }

    // The rose will be added to the roses array if it doesn't intersect another rose
    this.verifyRose(currRose);
  }

  // Adds the currRose to the roses array if it doesn't intersect another rose
  verifyRose(currRose) {
    // For-of loop to compare currRose to every other rose
    for (const rose of this.roses) {
      // If currRose intersects another rose, increase the verification attempts by one and return
      if (this.compareRoses(currRose, rose)) {
        this.verifications++;
        return;
      }
    }

    // If the currRose doesn't intersect another rose, reset verification attempts and add to roses array
    this.verifications = 0;
    this.roses.push(currRose);
  }

  // Returns true if the two roses intersect (Shiffman, 2015)
  compareRoses(r1, r2) {
    return (dist(r1.x, r1.y, r2.x, r2.y) < r1.a + r2.a);
  }

  // Draws the provided rose object to the canvas
  drawRose(rose) {
    // Push so translation can be reset
    this.patternSurface.push();
    // Translate to the x and y position of the rose
    this.patternSurface.translate(rose.x, rose.y);
    // Draw the rose as a shape
    this.patternSurface.beginShape();
    // For-loop to draw the rose. Angle increases slowly for fidelity
    for (let angle = 0; angle < rose.revolutions; angle += 0.01) {
      // Calculate the polar coordinates to draw the rose at
      let r = rose.a * cos(rose.k * angle);
      let x = r * cos(angle);
      let y = r * sin(angle);
      this.patternSurface.vertex(x, y);
    }
    this.patternSurface.endShape(CLOSE);
    this.patternSurface.pop();
  }

  // Reduces the provided fraction and returns the denominator
  reduceDenominator(n, d) {
    // Initialise the greatest common factor as the smaller number between the numerator and denominator
    let gcf = Math.min(n, d);

    // Decrement gcf
    while (gcf) {
      // If both numerator and demoninator are divisble by gcf, return denominator / gcf
      if ((n % gcf == 0) && (d % gcf == 0)) {
        return d / gcf;
      }
      gcf--;
    }

    // If no gcf is found, return the denominator
    return d;
  }
}

// CrosshairPattern draws the crosshair pattern
class CrosshairPattern extends Pattern {
  generatePattern() {
    // Move the origin of patternSurface to the centre
    this.patternSurface.translate(patternSize / 2, patternSize / 2);

    // Set the patternSurface stroke colour to the colour of the pattern
    this.patternSurface.stroke(this.patternColour);
    // noFill() so the circle isn't filled in
    this.patternSurface.noFill();

    // state is a random number between 0 and 1
    let state = random();

    // circleWidth is the width of the crosshair circle
    let circleWidth = patternSize / 9;
    // circleRadius is the radius of the crosshair circle
    let circleRadius = circleWidth / 2;

    // Randomly draw the crosshair either vertically or diagonally
    switch (state >= 0.5) {
      case true:
        // Draw vertically
        this.drawCrosshair(circleWidth, circleRadius, 0);
        break;
      default:
        // Draw diagonally
        this.drawCrosshair(circleWidth, circleRadius, 45);
        break;
    }
  }

  drawCrosshair(circleWidth, circleRadius, rotation) {
    // Rotate the patternSurface canvas by the rotation value
    this.patternSurface.rotate(radians(rotation));
    // Draw the circle in the centre
    this.patternSurface.circle(0, 0, circleWidth);
    // Draw the lines of the crosshair
    this.patternSurface.line(
      -circleRadius, 0,
      -circleWidth * 2, 0
    );
    this.patternSurface.line(
      circleRadius, 0,
      circleWidth * 2, 0
    );
    this.patternSurface.line(
      0, -circleRadius,
      0, -circleWidth * 2
    );
    this.patternSurface.line(
      0, circleRadius,
      0, circleWidth * 2
    );
  }
}

class ShrinkingPattern extends Pattern {
  generatePattern() {
    // Draw rectangles from the centre
    this.patternSurface.rectMode(CENTER);
    // Translate to the centre of the patternSurface canvas
    this.patternSurface.translate(patternSize / 2, patternSize / 2);
    // Set the stroke colour of the patternSurface canvas
    this.patternSurface.stroke(brushColour);


    // Create the colours for each rectangle by interpolating between the background colour and the generated pattern colour
    const colours = [
      this.backgroundColour,
      lerpColor(this.backgroundColour, this.patternColour, 0.25),
      lerpColor(this.backgroundColour, this.patternColour, 0.5),
      lerpColor(this.backgroundColour, this.patternColour, 0.75),
      this.patternColour
    ];

    // Set the index of the first rectangle's colour
    let currentColour = 0;

    // Draw rectangles that decrease in size
    for (let i = patternSize; i >= patternSize / colours.length; i -= patternSize / colours.length) {
      // Set the fill to the current colour in the colours array
      this.patternSurface.fill(colours[currentColour]);
      // Increment currentColour by 1
      // currentColour = (currentColour + 1) % colours.length;
      currentColour++;

      // Draw the rectangle with width i at the centre
      this.patternSurface.rect(0, 0, i);
    }
  // Draw the cross over the rectangles
    this.patternSurface.line(
      -patternSize / 2, -patternSize / 2,
      patternSize / 2, patternSize / 2
    );
    this.patternSurface.line(
      patternSize / 2, -patternSize / 2,
      -patternSize / 2, patternSize / 2
    );
  }
}

// BubblesPattern draws the bubbles pattern
class BubblesPattern extends Pattern {
  constructor(offsetX, offsetY) {
    super(offsetX, offsetY);

    this.patternSurface.fill(this.patternColour);
    this.patternSurface.stroke(brushColour);
    this.patternSurface.strokeWeight(0.25);

    // Stores each bubble for comparison
    this.bubbles = [];

    // This stores how many times the program has attempted to create a bubble that doesn't intersect
    this.verifications = 0;
  }
  generatePattern() {
    // Create up to ten bubbles
    while (this.bubbles.length < 10) {
      // If the same bubble has been attempted more than ten times, stop
      if (this.verifications > 10) {
        break;
      }
      // Creates a bubble
      this.createBubble();
    }
    // Draw each bubble
    this.bubbles.forEach(bubble => {
      this.drawBubble(bubble);
    });
  }

  // Creates a new bubble to add to the bubbles array, with its x-position, y-position, radius and a random amount of rotation
  createBubble() {
    let bubble = {
      x: random(patternSize),
      y: random(patternSize),
      radius: random(patternSize / 8, patternSize / 4),
      rotation: (random(360))
    }
    this.verifyBubble(bubble);
  }

  // Adds the currBubble to the bubbles array if it doesn't intersect another bubble
  verifyBubble(currBubble) {
    // For-of loop to compare currBubble to every other bubble
    for (const bubble of this.bubbles) {
      // If currBubble intersects another bubble, increase the verification attempts by one and return
      if (this.compareBubbles(currBubble, bubble)) {
        this.verifications++;
        return;
      }
    }

    // If the currBubble doesn't intersect another bubble, reset verification attempts and add to bubbles array
    this.verifications = 0;
    this.bubbles.push(currBubble);
  }

  // Returns true if the two bubbles intersect (Shiffman, 2015)
  compareBubbles(b1, b2) {
    return (dist(b1.x, b1.y, b2.x, b2.y) < b1.radius + b2.radius);
  }

  // Draws the provided bubble object to the canvas
  drawBubble(bubble) {
    // Push so translation can be reset
    this.patternSurface.push();
    // Translate to the x and y position of the bubble
    this.patternSurface.translate(bubble.x, bubble.y);
    this.patternSurface.rotate(radians(bubble.rotation));
    // Draw the dots
    this.patternSurface.circle(bubble.radius / 4, 4 * bubble.radius / 5, bubble.radius / 12);
    this.patternSurface.circle(-bubble.radius / 8, 4 * bubble.radius / 5, bubble.radius / 12);
    // Draw the left bubble
    this.patternSurface.circle(-bubble.radius / 4, 0, bubble.radius);
    this.patternSurface.noFill();
    // Draw the right bubble
    this.patternSurface.circle(bubble.radius / 4, 0, bubble.radius);
    this.patternSurface.pop();
  }
}

// References
// O'Kane, R. and Possamai, D. (2018) How do I create an abstract base class in JavaScript? Stack Overflow, 28 August [online]. Available from: https://stackoverflow.com/questions/597769/how-do-i-create-an-abstract-base-class-in-javascript [Accessed 01 December 2023].
// 7.6: Checking Objects Intersection Part I - p5.js Tutorial (2015) [online]. Directed by Daniel Shiffman. YouTube. Available from https://www.youtube.com/watch?v=uAfw-ko3kB8 [Accessed 01 December 2023].
// Wikipedia (2023) Rose (mathematics) [online] Available from: https://en.wikipedia.org/wiki/Rose_(mathematics) [Accessed 01 December 2023].