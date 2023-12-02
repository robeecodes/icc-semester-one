class Snowflake {
  // Create a Snowflake using the calculated x, y and radius variables in setup
  constructor(x, y, radius) {
    this.radius = radius;
    this.x = x;
    this.y = y;
    // Choose a shape to act as the centrepiece
    this.centrePiece = random(shapes);
    // Choose the pieces which extend out of the centre
    this.extensionPieces = this.extendSnowflake(Math.ceil(random(3, 5)));
    // Set a random amount of rotation for each snowflake
    this.rotation = random(360);
    // Assign the amount of shapes to orbit around the centre
    this.pieces = Math.ceil(random(4,15));
  }
  
  drawSnowflake() {
    // Draw the snowflake at its assigned position
    push();
    translate(this.x, this.y);
  
    rotate(radians(this.rotation));
    
    // Calculate the size of each piece
    let pieceSize = this.calculatePieceSize();
    
    
    // Call a different polar function depending on the name of the centrepiece
    switch(this.centrePiece) {
      case "ellipse":
        polarEllipse(0, pieceSize, pieceSize);
        break;
      case "hexagon":
        polarHexagon(0, pieceSize);
        break;
      case "triangle":
        polarTriangle(0, pieceSize);
        break;
    }
    
    // Call a different polar function depending on the name of each extensionPiece. Index i is used to determine the distance of the circle from the centre
    this.extensionPieces.forEach((piece, i) => {
      switch(piece) {
      case "ellipse":
        polarEllipses(this.pieces, pieceSize, pieceSize, i * pieceSize * 2);
        break;
      case "hexagon":
        polarHexagons(this.pieces, pieceSize, i * pieceSize * 2);
        break;
      case "triangle":
        polarTriangles(this.pieces, pieceSize, i * pieceSize * 2);
        break;
      }
    });
    pop();
  }
  
  // Create an array of shapes with length num
  extendSnowflake(num) {
    // Initialise array arr
    let arr = [];

    // Fill it with random shape names
    for (let i = 0; i < num; i++) {
      arr[i] = random(shapes);
    }

    // Return arr
    return arr;
  }
  
  // Return the radius to use to get the correct piece sizes
  calculatePieceSize() {
    return this.radius / this.extensionPieces.length / 2;
  }
}