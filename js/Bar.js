/* copyright information:
FILE: Bar.js
AUTHOR: Dayan Petrov
UNIVERSITY: The University of Sheffield
WEB: dissertation.dayanpetrow.eu
DESCRIPTION: Bar and CountingBar Object constructors, accessors, mutators
LAST UPDATED: 28-04-2017
*/

var height_multiplier = 4;
var top_display_padding = 0;
var top_text_padding = 450;


/**
 * Creates an instance of Bar.
 *
 * @constructor
 * @this {Bar}
 * @param {number} number The value of the element
 * @param {number} width The width of a Bar object
 * @param {number} x The x-position of the Bar object on the canvas
 * @param {number} y The y-position of the Bar object on the canvas
 * @param {number} opacity The level of transparency of the displayed Bar object (values from 0 to 1)
 * @param {string} status The status of the object is responsible for the color of the Bar object
 */
function Bar(number, width, x, y, opacity, status) {
    this.number = number;
    this.x = x;
    this.y = y; 
    this.width = width;
    this.opacity = opacity;
    this.status = status;
    this.height = this.number*height_multiplier;
}

/**
 * Displays a Bar object on the Canvas
 *
 * @this {Bar}
 */
Bar.prototype.update = function() {
		ctx.save();
		if(this.width == 40) {	
			var text_pos = 15;
			if(this.number > 9) {
				text_pos = 12;
			}
		} else if (this.width == 25) {
			var text_pos = 8;
			if(this.number > 9) {
				text_pos = 5;
			}
		} else {
			var text_pos = 2;
			if(this.number > 9) {
				text_pos = 0;
			}
		}
        ctx.beginPath();
		ctx.globalAlpha = this.opacity;
		if(arraySize <= 8) {
			ctx.lineWidth = 3;
		} else if (arraySize <= 16) {
			ctx.lineWidth = 2;
		} else {
			ctx.lineWidth = 0;
		}
    	if (this.status == "unsorted") { //blue
			ctx.fillStyle = "#006bb3"; 
			ctx.strokeStyle = '#004d80';
		} 
    	else if (this.status == "read") { //green
			ctx.fillStyle = "#00cc66"; 
			ctx.strokeStyle = '#00994d';
		} 
		else if (this.status == "written") { //
			ctx.fillStyle = "#00b3b3"; 
			ctx.strokeStyle = '#009999';
		} 
		else if (this.status == "sorted") { 
			ctx.fillStyle = "#ff9933"; 
			ctx.strokeStyle = '#e67300';
			
		}
		else if (this.status == "smaller") {
			ctx.fillStyle = "#ff471a"; 
			ctx.strokeStyle = '#e62e00';
		}
    	else { 
			ctx.fillStyle = "#9933ff"; 
			ctx.strokeStyle = '#6600cc';
		}
        ctx.rect(this.x, this.y, this.width, this.calculateHeight(), this.opacity);
		ctx.fill();
		ctx.stroke();
        ctx.fillText(this.number, this.x+text_pos, this.y + this.calculateHeight() + 13);
		ctx.restore();
}

/**
 * Calculates the height of a Bar object
 *
 * @this {Bar}
 * @return {number} The height of the Bar object
 */
Bar.prototype.calculateHeight = function() {
	return this.number != 0 ? this.number*height_multiplier : 1;
}

/**
 * Sets Bar.status to "read"
 *
 * @this {Bar}
 */
Bar.prototype.setRead = function() {
	this.status = "read";
}

/**
 * Sets Bar.status to "sorted"
 *
 * @this {Bar}
 */
Bar.prototype.setSorted = function() {
	this.status = "sorted";
}

/**
 * Sets Bar.status to "unsorted"
 *
 * @this {Bar}
 */
Bar.prototype.setUnsorted = function() {
	this.status = "unsorted";
}

/**
 * Sets Bar.status to "pivot"
 *
 * @this {Bar}
 */
Bar.prototype.setPivot = function() {
	this.status = "pivot";
}

/**
 * Sets Bar.status to "written"
 *
 * @this {Bar}
 */
Bar.prototype.setWritten = function() {
	this.status = "written";
}

/**
 * Sets Bar.status to "smaller"
 *
 * @this {Bar}
 */
Bar.prototype.setSmaller = function() {
	this.status = "smaller";
}

/**
 * Sets Bar.number to the parameter value
 *
 * @this {Bar}
 * @param {number} number The new value of Bar.number
 */
Bar.prototype.setNumber = function(number) { 
	this.number = number; 
}

/**
 * Sets Bar.y to the parameter value
 *
 * @this {Bar}
 * @param {number} number The new value of Bar.y
 */
Bar.prototype.setY = function(number) {
	this.y = number;
}

/**
 * Sets Bar.x to the parameter value
 *
 * @this {Bar}
 * @param {number} number The new value of Bar.x
 */
Bar.prototype.setX = function(number) {
	this.x = number;
}

/**
 * Sets Bar.opacity to the parameter value
 *
 * @this {Bar}
 * @param {number} number The new value of Bar.opacity
 */
Bar.prototype.setOpacity = function(number) {
	this.opacity = number;
}

/**
 * Adds the function paramter to Bar.x
 *
 * @this {Bar}
 * @param {number} number The value to be added to Bar.x
 */
Bar.prototype.right = function(number) {
	this.x += number;
}

/**
 * Subtracts the function paramter from Bar.x
 *
 * @this {Bar}
 * @param {number} number The value to be subtracted from Bar.x
 */
Bar.prototype.left = function(number) {
	this.x -= number;
}

/**
 * Swaps 2 Bar objects
 *
 * @param {Bar} bar1 The Bar to be swapped with bar2
 * @param {Bar} bar2 The Bar to be swapped with bar1
 */
function swapBars(bar1,bar2) {
	var bar1_number = bar1.number;
	var bar2_number = bar2.number;
	var bar1_y = bar1.y;
	var bar2_y = bar2.y;
	bar1.setNumber(bar2_number);
	bar2.setNumber(bar1_number);
	bar1.setY(bar2_y);
	bar2.setY(bar1_y);
}

/**
 * Updates the proporties of ARRAY_OF_OBJECTS so that they can be displayed at the top half of the Canvas
 *
 */
function topDisplay() {
	top_display_padding = 230;
	top_text_padding = 222;
	height_multiplier = 2;
	if(NUMBER_FLOOR == 10) {
		height_multiplier = 16;
	}
	for(var i = 0; i < ARRAY_OF_OBJECTS.length; i++) {
		ARRAY_OF_OBJECTS[i].y = (440 - (height_multiplier * ARRAY_OF_OBJECTS[i].number))-top_display_padding;
		if(NUMBER_FLOOR == 10) {
			initial_xs.push(ARRAY_OF_OBJECTS[i].x);
		}
	}
}

/**
 * Updates the proporties of ARRAY_OF_OBJECTS so that they can be displayed at the top half of the Canvas for MergeSort
 *
 */
function mergeDisplay() {
	top_display_padding = 230;
	top_text_padding = 222;
	height_multiplier = 2;
	if(NUMBER_FLOOR == 10) {
		height_multiplier = 16;
	}
	for(var i = 0; i < ARRAY_OF_OBJECTS.length; i++) {
		ARRAY_OF_OBJECTS[i].y = (440 - (height_multiplier * ARRAY_OF_OBJECTS[i].number))-top_display_padding;
		initial_xs.push(ARRAY_OF_OBJECTS[i].x);
	}
}

/**
 * Updates the proporties of ARRAY_OF_OBJECTS so that they can be displayed by default
 *
 */
function defaultDisplay() {
	top_display_padding = 0;
	top_text_padding = 450;
	height_multiplier = 4;
	if(NUMBER_FLOOR == 10) {
		height_multiplier = 20;
	}
	for(var i = 0; i < ARRAY_OF_OBJECTS.length; i++) {
		ARRAY_OF_OBJECTS[i].y = 440 - (height_multiplier * ARRAY_OF_OBJECTS[i].number);
	}
}

/**
 * Adds the function paramter to Bar.x
 *
 * @this {Bar}
 * @param {number} number The value to be added to Bar.x
 */
Bar.prototype.moveRight = function(number) {
	this.x += number;
}

/**
 * Subtracts the function paramter from Bar.x
 *
 * @this {Bar}
 * @param {number} number The value to be subtracted from Bar.x
 */
Bar.prototype.moveLeft = function(number) {
	this.x -= number;
}

/**
 * Subtracts the function paramter from Bar.y
 *
 * @this {Bar}
 * @param {number} number The value to be subtracted from Bar.y
 */
Bar.prototype.moveUp = function(number) {
	this.y -= number;
}

/**
 * Adds the function paramter to Bar.y
 *
 * @this {Bar}
 * @param {number} number The value to be added to Bar.y
 */
Bar.prototype.moveDown = function(number) {
	this.y += number;
}



/**
 * Creates an instance of CountingBar. (CountingSort)
 *
 * @constructor
 * @this {Bar}
 * @param {number} number The value of the CountingBar
 * @param {number} x The x-position of the CountingBar object on the canvas
 * @param {number} y The y-position of the CountingBar object on the canvas
 * @param {number} width The width of a CountingBar object
 * @param {number} height The height of a CountingBar object
 * @param {numbers} numbers Counter of elements
 */
function CountingBar(number, x, y, width, height, counter) {
	this.number = number;
	this.x = x;
	this.y = y;
	this.height = height;
	this.width = width;
	this.counter = counter;
	this.opacity = 1;
	this.indexes = [];
	this.sorted_y = 0;
	this.exists_sorted_y = false;
}

/**
 * Pushes and index to CountingBar.indexes
 *
 * @this {Bar}
 * @param {number} number The value to be pushed
 */
CountingBar.prototype.addIndex = function(index) {
	this.indexes.push(index);
}

/**
 * Changes the value of CountingBar.sorted_y
 *
 * @this {Bar}
 * @param {number} number The value to be set as CountingBar.sorted_y
 */
CountingBar.prototype.setSortedY = function(number) {
	this.sorted_y = number;
}

/**
 * Changes the value of CountingBar.exists_sorted_y to true
 *
 * @this {Bar}
 */
CountingBar.prototype.existsY = function() {
	this.exists_sorted_y = true;
}

/**
 * Display a CountingSort object on the Canvas
 *
 * @this {Bar}
 */
CountingBar.prototype.update = function() {
	if(this.width == 40) {	
		var counter_pos = 15;
		var text_pos = 15;
		if(this.counter > 9) {
			counter_pos = 12;
		}
	} else if (this.width == 25) {
		var counter_pos = 8;
		var text_pos = 8;
		if(this.counter > 9) {
			counter_pos = 5;
		}
	} else {
		var counter_pos = 2;
		var text_pos = 2;
		if(this.counter > 9) {
			counter_pos = 0;
		}
	}
    ctx.beginPath();
	ctx.globalAlpha = 1;
	ctx.fillStyle = "red"; 
	ctx.fillText(this.counter, this.x+counter_pos, 450 - this.height - 20);
	if(this.counter == 0) {
		this.opacity = 0.2;
	} else {
		this.opacity = 1;
	}
	ctx.globalAlpha = this.opacity;
	ctx.fillStyle = "#004d80"; 
    ctx.fillRect(this.x, this.y, this.width, this.height, this.opacity);
    ctx.fillText(this.number, this.x+text_pos, 453);
}

/**
 * Increments the value of CountingSort.counter by 1
 *
 * @this {Bar}
 */
CountingBar.prototype.add = function() {
    this.counter += 1;
}

/**
 * Decrements the value of CountingSort.counter by 1
 *
 * @this {Bar}
 */
CountingBar.prototype.remove = function() {
    this.counter -= 1;
	if(this.counter == 0) {
		this.opacity = 0.5;
	}
}

/**
 * Returns the value of CountingSort.counter
 *
 * @this {Bar}
 * @return {number} the value of CountingBar.counter
 */
CountingBar.prototype.getCount = function() {
	return this.counter;
}

/**
 * Changes the value of CountingBar.opacity
 *
 * @this {Bar}
 * @param {number} new_opacity Sets CountingBar.opacity to the parameter
 */
CountingBar.prototype.setOpacity = function(new_opacity) {
	this.opacity = new_opacity;
}

/* END OF FILE */