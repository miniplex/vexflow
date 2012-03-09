// Vex Flow
// Mohit Muthanna <mohit@muthanna.com>
//
// A rendering context for the Raphael backend.
//
// Copyright Mohit Cheppudira 2010

/** @constructor */
Vex.Flow.JquerySVGContext = function(element) {
  if (arguments.length > 0) this.init(element)
}

Vex.Flow.JquerySVGContext.prototype.init = function(element) {
  this.element = element;
  this.paper = $(element).svg();
  this.paper = $(element).svg('get');
  this.path = "";
  this.pen = {x: 0, y: 0};
  this.lineWidth = 1.0;
  this.state = {
    scale: { x: 1, y: 1 },
    font_family: "Arial",
    font_size: 8,
    font_weight: 800
  };

  this.attributes = {
    "stroke-width": 0.3,
    "fill": "black",
    "stroke": "black",
    "font": "10pt Arial"
  };

  this.background_attributes = {
    "stroke-width": 0,
    "fill": "white",
    "stroke": "white",
    "font": "10pt Arial"
  };

  this.state_stack= [];
}

Vex.Flow.JquerySVGContext.prototype.setFont = function(family, size, weight) {
  this.state.font_family = family;
  this.state.font_size = size;
  this.state.font_weight = weight;
  this.attributes.font = (this.state.font_weight || "") + " " +
    (this.state.font_size * this.state.scale.x) + "pt " +
    this.state.font_family;
  return this;
}

Vex.Flow.JquerySVGContext.prototype.setFillStyle = function(style) {
  this.attributes.fill = style;
  return this;
}

Vex.Flow.JquerySVGContext.prototype.setBackgroundFillStyle = function(style) {
  this.background_attributes.fill = style;
  this.background_attributes.stroke = style;
  return this;
}

Vex.Flow.JquerySVGContext.prototype.setStrokeStyle = function(style) {
  this.attributes.stroke = style;
  return this;
}

Vex.Flow.JquerySVGContext.prototype.scale = function(x, y) {
  this.state.scale = { x: x, y: y };
  this.attributes.scale = x + "," + y + ",0,0";
  this.attributes.font = this.state.font_size * this.state.scale.x + "pt " +
    this.state.font_family;
  this.background_attributes.scale = x + "," + y + ",0,0";
  this.background_attributes.font = this.state.font_size *
    this.state.scale.x + "pt " +
    this.state.font_family;
  return this;
}

Vex.Flow.JquerySVGContext.prototype.clear = function() {
  this.paper.clear();
}

Vex.Flow.JquerySVGContext.prototype.resize = function(width, height) {
  this.element.style.width = width;
  this.paper._svg.setAttribute('width', width);
  this.paper._svg.setAttribute('height', height);
  return this;
}

Vex.Flow.JquerySVGContext.prototype.rect = function(x, y, width, height) {
  if (height < 0) {
    y += height;
    height = -height;
  }

  var r = this.paper.rect(x, y, width - 0.5, height - 0.5)
  for (var key in this.attributes){
  	r.setAttribute(key, this.attributes[key]);
  }
  r.setAttribute("fill", "none");
  r.setAttribute("stroke-width", this.lineWdith);
  return this;

}
Vex.Flow.JquerySVGContext.prototype.fillRect = function(x, y, width, height) {
  if (height < 0) {
    y += height;
    height = -height;
  }

  var r = this.paper.rect(x, y, width - 0.5, height - 0.5);
  for (var key in this.attributes){
  		r.setAttribute(key, this.attributes[key]);
  }
  return this;
}

Vex.Flow.JquerySVGContext.prototype.clearRect = function(x, y, width, height) {
  if (height < 0) {
    y += height;
    height = -height
  }

  var r = this.paper.rect(x, y, width - 0.5, height - 0.5);
  for (var key in this.background_attributes){
  		r.setAttribute(key,this.background_attributes[key]);
  }
  return this;
}

Vex.Flow.JquerySVGContext.prototype.beginPath = function() {
  this.path = "";
  this.pen.x = 0;
  this.pen.y = 0;
  return this;
}

Vex.Flow.JquerySVGContext.prototype.moveTo = function(x, y) {
  this.path += "M" + x + "," + y;
  this.pen.x = x;
  this.pen.y = y;
  return this;
}

Vex.Flow.JquerySVGContext.prototype.lineTo = function(x, y) {
  this.path += "L" + x + "," + y;
  this.pen.x = x;
  this.pen.y = y;
  return this;
}

Vex.Flow.JquerySVGContext.prototype.bezierCurveTo =
  function(x1, y1, x2, y2, x, y) {
  this.path += "C" +
    x1 + "," +
    y1 + "," +
    x2 + "," +
    y2 + "," +
    x + "," +
    y;
  this.pen.x = x;
  this.pen.y = y;
  return this;
}

Vex.Flow.JquerySVGContext.prototype.quadraticCurveTo =
  function(x1, y1, x, y) {
  this.path += "Q" +
    x1 + "," +
    y1 + "," +
    x + "," +
    y;
  this.pen.x = x;
  this.pen.y = y;
  return this;
}

// This is an attempt (hack) to simulate the HTML5 canvas
// arc method.
Vex.Flow.JquerySVGContext.prototype.arc =
  function(x, y, radius, startAngle, endAngle, antiClockwise) {

  function normalizeAngle(angle) {
    while (angle < 0) {
      angle += Math.PI * 2;
    }

    while (angle > Math.PI * 2) {
      angle -= Math.PI * 2;
    }
    return angle;
  }

  startAngle = normalizeAngle(startAngle);
  endAngle = normalizeAngle(endAngle);

  if (startAngle > endAngle) {
      var tmp = startAngle;
      startAngle = endAngle;
      endAngle = tmp;
      antiClockwise = !antiClockwise;
  }

  var delta = endAngle - startAngle;

  if (delta > Math.PI) {
      this.arcHelper(x, y, radius, startAngle, startAngle + delta / 2,
                     antiClockwise);
      this.arcHelper(x, y, radius, startAngle + delta / 2, endAngle,
                     antiClockwise);
  }
  else {
      this.arcHelper(x, y, radius, startAngle, endAngle, antiClockwise);
  }
  return this;
}

Vex.Flow.JquerySVGContext.prototype.arcHelper =
  function(x, y, radius, startAngle, endAngle, antiClockwise) {

  Vex.Assert(endAngle > startAngle, "end angle " + endAngle +
             " less than or equal to start angle " + startAngle);
  Vex.Assert(startAngle >= 0 && startAngle <= Math.PI * 2);
  Vex.Assert(endAngle >= 0 && endAngle <= Math.PI * 2);

  var x1 = x + radius * Math.cos(startAngle);
  var y1 = y + radius * Math.sin(startAngle);

  var x2 = x + radius * Math.cos(endAngle);
  var y2 = y + radius * Math.sin(endAngle);

  var largeArcFlag = 0;
  var sweepFlag = 0;
  if (antiClockwise) {
    sweepFlag = 1;
    if (endAngle - startAngle < Math.PI)
      largeArcFlag = 1;
  }
  else if (endAngle - startAngle > Math.PI) {
      largeArcFlag = 1;
  }

  this.path += "M"
    + x1 + ","
    + y1 + ","
    + "A" +
    + radius + ","
    + radius + ","
    + "0,"
    + largeArcFlag + ","
    + sweepFlag + ","
    + x2 + "," + y2
    + "M"
    + this.pen.x + ","
    + this.pen.y;
}



Vex.Flow.JquerySVGContext.prototype.fill = function() {
  var path = this.paper.path(this.path);
  for (var key in this.attributes){
  	path.setAttribute(key, this.attributes[key]);
  }
  path.setAttribute("stroke-width", 0);
  return this;
}

Vex.Flow.JquerySVGContext.prototype.stroke = function() {
  var path = this.paper.path(this.path);
  for (var key in this.attributes){
  	path.setAttribute(key, this.attributes[key]);
  }
  path.setAttribute("fill", "none");
  path.setAttribute("stroke-width", this.lineWidth);
  return this;
}

Vex.Flow.JquerySVGContext.prototype.closePath = function() {
  this.path += "Z";
  return this;
}

Vex.Flow.JquerySVGContext.prototype.measureText = function(text) {
  var txt = this.paper.text(0, 0, text);
  for (var key in this.attributes){
  	txt.setAttribute(key, this.attributes[key]);
  }
  txt.setAttribute("fill", "none");
  txt.setAttribute("stroke", "none");

  return {
    width: txt.getBBox().width,
    height: txt.getBBox().height
  };
}

Vex.Flow.JquerySVGContext.prototype.fillText = function(text, x, y) {
  var txt = this.paper.text(x + (this.measureText(text).width / 2),
      (y - (this.state.font_size / (2.25 * this.state.scale.y))), text)
  for (var key in this.attributes){
  	txt.setAttribute(key, this.attributes[key]);
  }
  return this;
}

Vex.Flow.JquerySVGContext.prototype.save = function() {
  // TODO(mmuthanna): State needs to be deep-copied.
  this.state_stack.push({
    state: {
      font_family: this.state.font_family
    },
    attributes: {
      font: this.attributes.font
    }
  });
  return this;
}

Vex.Flow.JquerySVGContext.prototype.restore = function() {
  // TODO(0xfe): State needs to be deep-restored.
  var state = this.state_stack.pop();
  this.state.font_family = state.state.font_family;
  this.attributes.font = state.attributes.font;
  return this;
}
