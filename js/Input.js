/* copyright information:
FILE: Input.js
AUTHOR: Dayan Petrov
UNIVERSITY: The University of Sheffield
WEB: dissertation.dayanpetrow.eu
DESCRIPTION: Functions for building the input for any Bar animation
LAST UPDATED: 28-04-2017
*/

/* VARIABLES */
var ARRAY_OF_NUMBERS = [];
var ARRAY_OF_OBJECTS = [];
var arraySize = 16; /* 16 is the default value */
var canvas = document.getElementById('myCanvas');
canvas.width  = 800; canvas.height = 500;
var ctx = canvas.getContext('2d');
var BAR_WIDTH = 25, BAR_SPACING = 35; /* default values */


/**
 * Generates an array of random numbers
 *
 */
function generateRandomArray() {
	var i, number;
	ARRAY_OF_NUMBERS = [];
	for(i=0; i<arraySize; i++) {
		number = Math.floor(Math.random() * NUMBER_FLOOR);
		ARRAY_OF_NUMBERS.push(number);
	}
	generateCanvasInput(ARRAY_OF_NUMBERS);
	document.getElementById("selected_array_type").style.display="block";
	document.getElementById("selected_array_type").innerHTML = "Array type: Random";
}

/**
 * Generates an array of sorted numbers
 *
 */
function generateSortedArray() {
	var i, number;
	ARRAY_OF_NUMBERS = [];
	for(i=0; i<arraySize; i++) {
		number = Math.floor(Math.random() * NUMBER_FLOOR);
		ARRAY_OF_NUMBERS.push(number);
	}
	ARRAY_OF_NUMBERS.sort(function(a, b){return a-b});
	generateCanvasInput(ARRAY_OF_NUMBERS);
	document.getElementById("selected_array_type").style.display="block";
	document.getElementById("selected_array_type").innerHTML = "Array type: Sorted";
}

/**
 * Generates an array of reverse sorted numbers
 *
 */
function generateRevSortedArray() {
	var i, number;
	ARRAY_OF_NUMBERS = [];
	for(i=0; i<arraySize; i++) {
		number = Math.floor(Math.random() * NUMBER_FLOOR);
		ARRAY_OF_NUMBERS.push(number);
	}
	ARRAY_OF_NUMBERS.sort(function(a, b){return b-a});
	generateCanvasInput(ARRAY_OF_NUMBERS);
	document.getElementById("selected_array_type").style.display="block";
	document.getElementById("selected_array_type").innerHTML = "Array type: Reverse-sorted";
}

/**
 * Generates an array of nearly sorted numbers
 *
 */
function generateNearlySortedArray() {
	var i, j, number, swap, temp;
	ARRAY_OF_NUMBERS = [];
	for(i=0; i<arraySize; i++) {
		number = Math.floor(Math.random() * NUMBER_FLOOR);
		ARRAY_OF_NUMBERS.push(number);
	}
	ARRAY_OF_NUMBERS.sort(function(a, b){return a-b});
	var number_of_swaps = 1;
	if(ARRAY_OF_NUMBERS.length == 8) {
		number_of_swaps = 1;
	} else if (ARRAY_OF_NUMBERS.length == 16) {
		number_of_swaps = 2;
	} else {
		number_of_swaps = 3;
	}
	for(j=0; j<number_of_swaps; j++) {
		number = Math.floor(Math.random() * ARRAY_OF_NUMBERS.length);
		swap = Math.floor(Math.random() * ARRAY_OF_NUMBERS.length);
		temp = ARRAY_OF_NUMBERS[number];
		ARRAY_OF_NUMBERS[number] = ARRAY_OF_NUMBERS[swap];
		ARRAY_OF_NUMBERS[swap] = temp;
	}
	generateCanvasInput(ARRAY_OF_NUMBERS);
	document.getElementById("selected_array_type").style.display="block";
	document.getElementById("selected_array_type").innerHTML = "Array type: Nearly sorted";
}

/**
 * Displays a scene on the canvas composed of Bar objects
 *
 * @param {array} arr The array of numbers to be represented
 */
function generateCanvasInput(arr) {
	if(arr.length <= 8) {
		BAR_WIDTH = 40, BAR_SPACING = 55;
	} else if (arr.length <= 16) {
		BAR_WIDTH = 25, BAR_SPACING = 35;
	} else if (arr.length <= 32) {
		BAR_WIDTH = 13, BAR_SPACING = 22;
	}
	var initial_spacing = centerCanvas(BAR_WIDTH,BAR_SPACING);
	document.getElementById("runAnimation").disabled = false;
	var i, CANVAS_HEIGHT = 440, HEIGHT_MULTIPLIER = 4;
	if(NUMBER_FLOOR == 10) {
		HEIGHT_MULTIPLIER = 16;
		height_multiplier = 16;
	}
	ARRAY_OF_OBJECTS = [];
	for(i=0; i<arr.length; i++) {
		var bar_height = (HEIGHT_MULTIPLIER * arr[i]);
		ARRAY_OF_OBJECTS.push(new Bar(arr[i], BAR_WIDTH,i*BAR_SPACING+initial_spacing,
			(CANVAS_HEIGHT - bar_height),1,"unsorted"));
	}
	displayBars();
}

/**
 * Displays the scene of Bar objects on the canvas
 *
 */
function displayBars() {
	clear(); var i;
	for(i=0; i<ARRAY_OF_OBJECTS.length; i++) {
		ARRAY_OF_OBJECTS[i].update();
	}
}

/**
 * Creates new Bar objects from JSON array
 *
 * @param {array} _obj JSON array to be converted to Bar objects
 */
function convertJSONtoBar(_obj) {
	var barArray = []; var i;
	for(i=0; i<_obj.length; i++) {
		barArray.push(new Bar(_obj[i].number, _obj[i].width, 
			_obj[i].x, _obj[i].y, _obj[i].opacity, _obj[i].status));
	}
	return barArray;
}

/**
 * Creates new CountingBar objects from JSON array
 *
 * @param {array} _obj JSON array to be converted to CountingBar objects
 */
function convertJSONtoCountingBar(_obj) {
	var barArray = []; var i;
	for(i=0; i<_obj.length; i++) {
		barArray.push(new CountingBar(_obj[i].number, _obj[i].x, _obj[i].y,
			_obj[i].width,  _obj[i].height, _obj[i].counter));
		barArray[barArray.length-1].indexes = _obj[i].indexes;
		barArray[barArray.length-1].sorted_y = _obj[i].sorted_y;
		barArray[barArray.length-1].exists_sorted_y = _obj[i].exists_sorted_y;
	}
	return barArray;
}

/**
 * Displays an "animation history" frame (Bar-based visualisation)
 *
 * @param {array} arr The index of the frame to be produced
 */
function displayMoment(arr) {
	clear(); var i;
	for(i=0; i<arr.length; i++) {
		arr[i].update();
	}
}

/**
 * Displays an "animation history" frame (Bar-based visualisation)
 *
 * @param {array} arr The index of the frame to be produced
 */
function displayCounterMoment(arr) {
	for(i=0; i<arr.length; i++) {
		arr[i].update();
	}
}

/**
 * Clears the scene on the canvas
 *
 */
function clear() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}
	
/**
 * The value of the animation speed slider
 *
 * @return {number} speed The value of the animation speed slider
 */
function animationSpeed() {
	var speed = document.getElementById("speed_range").value;
	document.getElementById("selected_speed").style.display="block";
	document.getElementById("selected_speed").innerHTML = "Animation speed: "+speed;
	return parseInt(speed);
}

/**
 * Pause Bar visualisation
 *
 */
function pauseAnimation() {
	isPaused = true;
	document.getElementById("selected_animation_progress").innerHTML = "Animation: Paused";
}

/**
 * Construct custom input
 *
 */
function generateCustomArray() {
	ARRAY_OF_OBJECTS = [];
	ARRAY_OF_NUMBERS = [];
	clear();
	var i;
	var validInput = true;
	var fieldString = document.getElementById("custom_element").value;
	ARRAY_OF_NUMBERS = fieldString.split(",");
	for(i=0; i<ARRAY_OF_NUMBERS.length; i++) {
		ARRAY_OF_NUMBERS[i] = parseInt(ARRAY_OF_NUMBERS[i]);
		if(isNaN(ARRAY_OF_NUMBERS[i]) || ARRAY_OF_NUMBERS[i]>(NUMBER_FLOOR-1) || ARRAY_OF_NUMBERS[i]<0 ) {
			document.getElementById("custom_element").placeholder = "Illegal entry: only integers between 0 and " + (NUMBER_FLOOR-1) + " are allowed";
			document.getElementById("custom_element").value = "";
			ARRAY_OF_NUMBERS = [];
			validInput = false;
			break;
		}
	}
	if(validInput) {
		if(ARRAY_OF_NUMBERS.length > 32) {
			document.getElementById("custom_element").placeholder = "The array is too long to be displayed";
			document.getElementById("custom_element").value = "";
			ARRAY_OF_NUMBERS = [];
			validInput = false;
		} else if (ARRAY_OF_NUMBERS.length < 2) {
			document.getElementById("custom_element").placeholder = "Arrays of size 1 are already sorted";
			document.getElementById("custom_element").value = "";
			ARRAY_OF_NUMBERS = [];
			validInput = false;
		}
	}
	if(validInput) {
		document.getElementById("custom_element").placeholder = "The array has been displayed";
		document.getElementById("custom_element").value = "";
		generateCanvasInput(ARRAY_OF_NUMBERS);
	}
	document.getElementById("selected_array_type").style.display="block";
	document.getElementById("selected_array_type").innerHTML = "Array type: Custom";
}

/**
 * Find the space between left border to first Bar so that the representation is centered
 *
 * @return {number} Initial spacing
 */
function centerCanvas() {
	return (800-(ARRAY_OF_NUMBERS.length*BAR_WIDTH + ((ARRAY_OF_NUMBERS.length-1)*(BAR_SPACING-BAR_WIDTH))))/2;
}

/**
 * Change the array size for the input
 *
 * @param {number} size The new array size
 */
function setArraySize(size) {
	arraySize = size;
	document.getElementById("selected_array_size").style.display="block";
	document.getElementById("selected_array_size").innerHTML = "Array size: " + arraySize;
}

/**
 * Extracts the numbers from a Bar array
 *
 * @deprecated
 * @return {array} arr An array of numbers
 */
function showNumbers() {
	var arr = [];
	for(var i = 0; i<ARRAY_OF_OBJECTS.length; i++) {
		arr.push(ARRAY_OF_OBJECTS[i].number);
	}
	return arr;
}

/* END OF FILE */