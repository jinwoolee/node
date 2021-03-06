function Rectangle(width, height) {
   this.width = width;
   this.height = height;
}

Rectangle.prototype.isSquare = function() { 
    return this.width == this.height;
}

Rectangle.prototype.size = function() {
   return this.width * this.height;
}

module.exports = Rectangle;