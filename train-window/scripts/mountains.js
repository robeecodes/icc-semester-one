// set sunrise to 4am
const sunrise = 4;

// Object containing the sky gradient colours at different times of day - sunChange represents sunrise and sunset
const skyColours = {
  "sunChange": ["#4C339D", "#FB7B6A"],
  "dayTime": ["#0091FF", "#ECFBFF"],
  "nightTime": ["#00177D", "#9245C2"]
};

// Object containing the three mountain colours at different times of day - sunChange represents sunrise and sunset
const mountainColours = {
  "sunChange": ["#712F79", "#974276", "#B14E85"],
  "dayTime": ["#2B458B", "#225CBB", "#00ACFF"],
  "nightTime": ["#40184C", "#5C2770", "#8845B8"]
}

// Timestamps for each period of time in a day given over a period of 24 hours.
const timestamps = {
  "sunToDay": [0, asMinutes(2)],
  "dayTime": [asMinutes(2), asMinutes(14)], 
  "dayToSun": [asMinutes(14), asMinutes(15)],
  "sunToNight": [asMinutes(15), asMinutes(16)],
  "nightTime": [asMinutes(16), asMinutes(23)],
  "nightToSun": [asMinutes(23), asMinutes(24)]
}


// inc and start determine how the perlin noise draws mountains to the screen (Shiffman, 2016)
let inc = 0.075;
let start = 0;

// Three seeds are created for the three mountains, so they all make different shapes
let seed1, seed2, seed3;

let mountainPainting;

function setupMountains(w, h) {
  mountainPainting = createGraphics(w, h);
      
  seed1 = random(500);
  seed2 = random(500);
  seed3 = random(500);
}

function renderMountains() {
  // Calculates the current time of day in minutes relative to the sunrise variable, so the value can be used to get the correct timestamp
  let currHour = (hour() - sunrise + 24) % 24;
  let elapsedDay = asMinutes(currHour) + minute();
    
  // step is the current time of day reduced to a range between 0 and 1 based on the two times in the given timestamp
  let step;
  
  // Control structure determines which timestamps the current time of day falls between. Once found, the sky and mountains for that time of day are drawn.
  // Please refer to the functions for descriptions of what they do
  if (inRange(elapsedDay, ...timestamps.sunToDay)) {
    step = timeStep(elapsedDay, ...timestamps.sunToDay);
    drawGradient(skyColours.sunChange, skyColours.dayTime, step);
    drawMountains(...mountainColours.sunChange, ...mountainColours.dayTime, step);
  } else if (inRange(elapsedDay, ...timestamps.dayTime)) {
    step = timeStep(elapsedDay, ...timestamps.dayTime);
    drawGradient(skyColours.dayTime, skyColours.dayTime, step);
    drawMountains(...mountainColours.dayTime, ...mountainColours.dayTime, step);
  } else if (inRange(elapsedDay, ...timestamps.dayToSun)) {
    step = timeStep(elapsedDay, ...timestamps.dayToSun);
    drawGradient(skyColours.dayTime, skyColours.sunChange, step);
    drawMountains(...mountainColours.dayTime, ...mountainColours.sunChange, step);
  } else if (inRange(elapsedDay, ...timestamps.sunToNight)) {
    step = timeStep(elapsedDay, ...timestamps.sunToNight);
    drawGradient(skyColours.sunChange, skyColours.nightTime, step);
    drawMountains(...mountainColours.sunChange, ...mountainColours.nightTime, step);
  } else if (inRange(elapsedDay, ...timestamps.nightTime)) {
    step = timeStep(elapsedDay, ...timestamps.nightTime);
    drawGradient(skyColours.nightTime, skyColours.nightTime, step);
    drawMountains(...mountainColours.nightTime, ...mountainColours.nightTime, step);
  } else if (inRange(elapsedDay, ...timestamps.nightToSun)) {
    step = timeStep(elapsedDay, ...timestamps.nightToSun);
    drawGradient(skyColours.nightTime, skyColours.sunChange, step);
    drawMountains(...mountainColours.nightTime, ...mountainColours.sunChange, step);
  }
    
  start += inc;
  
  // Draw the mountains to the main canvas
  image(mountainPainting, 4 * width / 18, 4 * height / 18);
}

// return a given hour as the current amount of minutes elapsed in the day
function asMinutes(h) {
  return h * 60;
}


// Check if a number is in a given range
function inRange(num, lower, upper) {
  return (num >= lower && num < upper)
}

// Calculate the correct amount of colour interpolation for the given time
function timeStep(time, lower, upper) {
  return map(time, lower, upper, 0, 1);
}

// Draws the sky gradient
function drawGradient(g1, g2, step) {
  for (let y = 0; y < mountainPainting.height; y ++) {
    
    // Firstly, the start and endpoint colours of the gradient are interpolated based on the time of day
    let colour1 = lerpColor(color(g1[0]), color(g2[0]), step);
    let colour2 = lerpColor(color(g1[1]), color(g2[1]), step);
    
    // stepDown calculates the current y position as a value between 1 and 0
    let stepDown = map(y, 0, mountainPainting.height, 0, 1);
    // colour1 and colour2 are then interpolated baased on their y-position to create the gradient effect
    let colour = lerpColor(colour1, colour2, stepDown);
    
    // A line is drawn across the screen using the final interpolated colour
    mountainPainting.stroke(colour);
    mountainPainting.line(0, y, mountainPainting.width, y);
  }
}

// Draw the three mountains moving across the screen
function drawMountains(c1, c2, c3, next1, next2, next3, step) {
  mountainPainting.noStroke();
  
  // Three different x-offsets for the mountains to create the parallax effect
  let xOff1 = start * 12;
  let xOff2 = start * 4;
  let xOff3 = start;
  
  // The pixel-effect of the mountains is created by drawing many small rects next to each other
  let rectWidth = width / 100;
  
  // Calculate the colours of each mountains relative to time of day
  let colour1 = lerpColor(color(c1), color(next1), step);
  let colour2 = lerpColor(color(c2), color(next2), step);
  let colour3 = lerpColor(color(c3), color(next3), step); 
  
  
  // for-loop to draw each mountain
  for (let x = 0; x < mountainPainting.width; x += rectWidth) {
    // set the seed for the specified mountain
    noiseSeed(seed1);
    // calculate the y-value for the current x-position of the mountain using noise()
    let y1 = (noise(xOff1) * 125) + (6 * mountainPainting.height / 9);
    noiseSeed(seed2);
    let y2 = (noise(xOff2) * 125) + (4 * mountainPainting.height / 9);
    noiseSeed(seed3);
    let y3 = (noise(xOff3) * 100) + (3 * mountainPainting.height / 9);
    
    // Draw the mountain to the screen using the calculated variables
    mountainPainting.fill(colour3);
    mountainPainting.rect(x, y3, rectWidth, mountainPainting.height);
    mountainPainting.fill(colour2);
    mountainPainting.rect(x, y2, rectWidth, mountainPainting.height);
    mountainPainting.fill(colour1);
    mountainPainting.rect(x, y1, rectWidth, mountainPainting.height);
    
    // Increase the x-offset of each mountain so they move
    xOff1 += inc;
    xOff2 += inc;
    xOff3 += inc;
  }
}

// References
// Daniel Shiffman (2016). I.4: Graphing 1D Perlin Noise - Perlin Noise and p5.js Tutorial. Youtube [video]. June 24. Available from https://www.youtube.com/watch?v=y7sgcFhk6ZM [Accessed 01 December 2023].