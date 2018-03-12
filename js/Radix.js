/* copyright information:
FILE: Radix.js
AUTHOR: Dayan Petrov
UNIVERSITY: The University of Sheffield
WEB: dissertation.dayanpetrow.eu
DESCRIPTION: Radix and Bucket Objects constructors, accessors, mutators, functionality for RadixSort
LAST UPDATED: 28-04-2017
*/

/* GLOBAL VARIABLES */
var allowActionTracker = true;
var keepVisualHistory = false;
var canvas = document.getElementById('myCanvas');
canvas.width  = 800; canvas.height = 500;
var ctx = canvas.getContext('2d');
var BUCKETS = [];
var RADIX_OBJECTS = [];
var ARRAY_OF_NUMBERS = [];
var number_length = 3; //default value
var arraySize = 16; //default value
var radix_width = number_length*10+1; //default value
var bucket_width = 60; //default value
var number_floor = 1000; //default value
var initial_xs = [];
document.getElementById("runAnimation").disabled = true;

/**
 * Creates an instance of Bucket
 *
 * @constructor
 * @this {Bucket}
 * @param {number} number Index of bucket
 * @param {number} x The x-position of the Bucket object on the canvas
 * @param {number} y The y-position of the Bucket object on the canvas
 * @param {array} indexes Content of the Bucket
 */
function Bucket(number, x, y) {
	this.number = number;
	this.x = x;
	this.y = y;
	this.indexes = [];
}

/**
 * Displays a Bucket object on the Canvas
 *
 * @this {Bucket}
 */
Bucket.prototype.update = function() {
	ctx.beginPath();
	ctx.save();
	ctx.translate(this.x,this.y);
	ctx.moveTo(1, 1);
	ctx.lineTo(1, 15);
	ctx.lineTo(bucket_width, 15);
	ctx.lineTo(bucket_width, 1);
	ctx.fillText(this.number, 28, 30);
	ctx.stroke();
	ctx.restore();
	ctx.closePath();
}

/**
 * Add content to a bucket 
 *
 * @param {index} index The index of a Radix object
 * @this {Bucket}
 */
Bucket.prototype.addIndex = function(index) {
	this.indexes.push(index);
}

/**
 * Create buckets
 *
 */
function createBuckets() {
	var INITIAL_SPACE = 50;
	for(var i = 0; i<10; i++) {
		BUCKETS.push(new Bucket(i, i*70+INITIAL_SPACE, 430));
	}
}

/**
 * Display buckets
 *
 */
function displayBuckets() {
	for(var i = 0; i < BUCKETS.length; i++) {
		BUCKETS[i].update();
	}
}

/**
 * Creates an instance of Radix
 *
 * @constructor
 * @this {Radix}
 * @param {number} number The value of the element
 * @param {array} digits Individual digits that compose the number
 * @param {number} x The x-position of the Radix object on the canvas
 * @param {number} y The y-position of the Radix object on the canvas
 */
function Radix(number, digits, x, y) {
	this.number = number;
	this.digits = digits;
	this.x = x;
	this.y = y;
	this.width = 0;
	this._status = "normal";
	this.selected_digit = undefined;
}

/**
 * Displays a Radix object on the Canvas
 *
 * @this {Radix}
 */
Radix.prototype.update = function() {
	ctx.save();
	if(this._status == "normal") {
		ctx.strokeStyle='black';
	} else if(this._status == "selected") {
		ctx.strokeStyle='green';
	} else if(this._status == "sorted") {
		ctx.strokeStyle="blue";
	}
	ctx.font = "13px Arial";
	ctx.strokeRect(this.x,this.y,radix_width,20);
	for(var i=0; i<this.digits.length; i++) {
		if(i == this.selected_digit) {
			ctx.fillStyle = 'red';
		} else {
			ctx.fillStyle = 'black';
		}
		ctx.fillText(this.digits[i], this.x+(i*8)+4, this.y+15);
	}
	ctx.restore();
}

/* RADIX MUTATORS */
Radix.prototype.setNormal = function() {
	this._status = "normal";
}

Radix.prototype.setSelected = function() {
	this._status = "selected";
}

Radix.prototype.setSorted = function() {
	this._status = "sorted";
}

Radix.prototype.selectDigit = function(number) {
	this.selected_digit = number;
}

Radix.prototype.clearDigit = function() {
	this.selected_digit = undefined;
}

Radix.prototype.moveRight = function(number) {
	this.x += number;
}

Radix.prototype.moveLeft = function(number) {
	this.x -= number;
}

Radix.prototype.moveUp = function(number) {
	this.y -= number;
}

Radix.prototype.moveDown = function(number) {
	this.y += number;
}

function color_k_digit() {
	var digit = number_length-k_iteration-1;
	for(var i=0; i<RADIX_OBJECTS.length; i++) {
		RADIX_OBJECTS[i].selectDigit(digit);
	}
}

/* ========================================== */
/* CREATES AN ARRAY OF RADIXES */
function createArray(arr) {
	var initial_spacing = (800-(16*(radix_width) + 15*8))/2;
	RADIX_OBJECTS = [];
	BUCKETS = [];
	initial_xs = [];
	for(var i = 0; i<arraySize; i++) {
		var digits = [];
		var current_string = arr[i] + "";
		if(current_string.length < number_length) {
			for(var j = current_string.length; j < number_length; j++) {
				current_string = "0" + current_string;
			}
		}
		for(var k = 0; k<current_string.length; k++) {
			digits.push(parseInt(current_string[k]));
		}
		RADIX_OBJECTS.push(new Radix(parseInt(current_string), digits, i*(radix_width+8)+initial_spacing, 50));
		initial_xs.push(i*(radix_width+8)+initial_spacing);
		digits = [];
	}
	document.getElementById("runAnimation").disabled = false;
	createBuckets();
	displayScene();
}

/**
 * Displays the Radix objects on the canvas
 *
 */
function displayRadixes() {
	for(var i = 0; i<RADIX_OBJECTS.length; i++) {
		RADIX_OBJECTS[i].update();
	}
}

/**
 * Displays the RadixSort scene on the canvas
 *
 */
function displayScene() {
	clear();
	displayBuckets();
	displayRadixes();
}

/**
 * Clears the scene on the canvas
 *
 */
function clear() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Enable popovers
 *
 */
$(function () {
  $('[data-toggle="popover"]').popover()
})
	
/**
 * Changes the arrow in a panel that can be collapsed
 *
 * @param {string} divId The id of the panel
 * @param {string} spanId The id of the arrow (span element)
 */
function collapse_icon(divId,spanId) {
	if(document.getElementById(divId).className == "collapse") {
		document.getElementById(spanId).className = "glyphicon glyphicon-chevron-up";
	} else {
		document.getElementById(spanId).className = "glyphicon glyphicon-chevron-down";
	}
}

/**
 * Set a button to selected style
 *
 * @param {string} id The button id
 */
function selected_button(id) {
	document.getElementById(id).className = 
		"animation-sidebar-block-button button-selected";
}

/**
 * Set a button to default style
 *
 * @param {string} id The button id
 */
function clearSelected(id) {
	document.getElementById(id).className = 
		"animation-sidebar-block-button";
}

/**
 * Disable button
 *
 * @param {string} id The button id
 */
function disableButton(id) {
	document.getElementById(id).disabled = true;
}

/**
 * Clear disabled from a button
 *
 * @param {string} id The button id
 */
function clearDisabled(id) {
	document.getElementById(id).disabled = false;
}

/**
 * Event listener for button with id="radix_1"
 *
 */
document.getElementById("radix_1").addEventListener("click", function() {
	number_length = 1;
	number_floor = 10;
	radix_width = number_length*10+5;
	selected_button("radix_1");
	clearSelected("radix_2");
	clearSelected("radix_3");
	clearSelected("radix_4");
	clearSelected("nearlySortedArrayRadix");
	clearSelected("randomArrayRadix");
	clearSelected("sortedArrayRadix");
	clearSelected("revSortedArrayRadix");
	clearDisabled("randomArrayRadix");
	clearDisabled("nearlySortedArrayRadix");
	clearDisabled("revSortedArrayRadix");
	clearDisabled("sortedArrayRadix");
	console.log("Word length: 1");
});

/**
 * Event listener for button with id="radix_2"
 *
 */
document.getElementById("radix_2").addEventListener("click", function() {
	number_length = 2;
	number_floor = 100;
	radix_width = number_length*10+2;
	selected_button("radix_2");
	clearSelected("radix_1");
	clearSelected("radix_3");
	clearSelected("radix_4");
	clearSelected("nearlySortedArrayRadix");
	clearSelected("randomArrayRadix");
	clearSelected("sortedArrayRadix");
	clearSelected("revSortedArrayRadix");
	clearDisabled("randomArrayRadix");
	clearDisabled("nearlySortedArrayRadix");
	clearDisabled("revSortedArrayRadix");
	clearDisabled("sortedArrayRadix");
	console.log("Word length: 2");
});

/**
 * Event listener for button with id="radix_3"
 *
 */
document.getElementById("radix_3").addEventListener("click", function() {
	number_length = 3;
	number_floor = 1000;
	radix_width = number_length*10+1;
	selected_button("radix_3");
	clearSelected("radix_1");
	clearSelected("radix_2");
	clearSelected("radix_4");
	clearSelected("nearlySortedArrayRadix");
	clearSelected("randomArrayRadix");
	clearSelected("sortedArrayRadix");
	clearSelected("revSortedArrayRadix");
	clearDisabled("randomArrayRadix");
	clearDisabled("nearlySortedArrayRadix");
	clearDisabled("revSortedArrayRadix");
	clearDisabled("sortedArrayRadix");
	console.log("Word length: 3");
});

/**
 * Event listener for button with id="radix_4"
 *
 */
document.getElementById("radix_4").addEventListener("click", function() {
	number_length = 4;
	number_floor = 10000;
	radix_width = number_length*10-1;
	selected_button("radix_4");
	clearSelected("radix_1");
	clearSelected("radix_2");
	clearSelected("radix_3");
	clearSelected("nearlySortedArrayRadix");
	clearSelected("randomArrayRadix");
	clearSelected("sortedArrayRadix");
	clearSelected("revSortedArrayRadix");
	clearDisabled("randomArrayRadix");
	clearDisabled("nearlySortedArrayRadix");
	clearDisabled("revSortedArrayRadix");
	clearDisabled("sortedArrayRadix");
	console.log("Word length: 4");
});

/**
 * Event listener for button with id="randomArrayRadix"
 *
 */
document.getElementById("randomArrayRadix").addEventListener("click", function() {
	generateRandomArray();
	selected_button("randomArrayRadix");
	clearSelected("sortedArrayRadix");
	clearSelected("revSortedArrayRadix");
	clearSelected("nearlySortedArrayRadix");
	console.log("Array type: Random");
});

/**
 * Event listener for button with id="sortedArrayRadix"
 *
 */
document.getElementById("sortedArrayRadix").addEventListener("click", function() {
	generateSortedArray();
	selected_button("sortedArrayRadix");
	clearSelected("randomArrayRadix");
	clearSelected("revSortedArrayRadix");
	clearSelected("nearlySortedArrayRadix");
	console.log("Array type: Sorted");
});

/**
 * Event listener for button with id="revSortedArrayRadix"
 *
 */
document.getElementById("revSortedArrayRadix").addEventListener("click", function() {
	generateRevSortedArray();
	selected_button("revSortedArrayRadix");
	clearSelected("randomArrayRadix");
	clearSelected("sortedArrayRadix");
	clearSelected("nearlySortedArrayRadix");
	console.log("Array type: Reverse Sorted");
});

/**
 * Event listener for button with id="nearlySortedArrayRadix"
 *
 */
document.getElementById("nearlySortedArrayRadix").addEventListener("click", function() {
	generateNearlySortedArray();
	selected_button("nearlySortedArrayRadix");
	clearSelected("randomArrayRadix");
	clearSelected("sortedArrayRadix");
	clearSelected("revSortedArrayRadix");
	console.log("Array type: Nearly Sorted");
});

/**
 * Pause RadixSort visualisation
 *
 */
function pauseAnimation() {
	isPaused = true;
	document.getElementById("selected_animation_progress").innerHTML = "Animation: Paused";
}

/**
 * Generates an array of random numbers
 *
 */
function generateRandomArray() {
	var i, number;
	ARRAY_OF_NUMBERS = [];
	for(i=0; i<arraySize; i++) {
		number = Math.floor(Math.random() * number_floor);
		ARRAY_OF_NUMBERS.push(number);
	}
	createArray(ARRAY_OF_NUMBERS);
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
		number = Math.floor(Math.random() * number_floor);
		ARRAY_OF_NUMBERS.push(number);
	}
	ARRAY_OF_NUMBERS.sort(function(a, b){return a-b});
	createArray(ARRAY_OF_NUMBERS);
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
		number = Math.floor(Math.random() * number_floor);
		ARRAY_OF_NUMBERS.push(number);
	}
	ARRAY_OF_NUMBERS.sort(function(a, b){return b-a});
	createArray(ARRAY_OF_NUMBERS);
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
		number = Math.floor(Math.random() * number_floor);
		ARRAY_OF_NUMBERS.push(number);
	}
	ARRAY_OF_NUMBERS.sort(function(a, b){return a-b});
	for(j=0; j<3; j++) {
		number = Math.floor(Math.random() * ARRAY_OF_NUMBERS.length);
		swap = Math.floor(Math.random() * ARRAY_OF_NUMBERS.length);
		temp = ARRAY_OF_NUMBERS[number];
		ARRAY_OF_NUMBERS[number] = ARRAY_OF_NUMBERS[swap];
		ARRAY_OF_NUMBERS[swap] = temp;
	}
	createArray(ARRAY_OF_NUMBERS);
	document.getElementById("selected_array_type").style.display="block";
	document.getElementById("selected_array_type").innerHTML = "Array type: Nearly sorted";
}

/**
 * Event listener for button with id="runAnimation"
 *
 */
document.getElementById("runAnimation").addEventListener("click", function() {
	disableButton("randomArrayRadix");
	disableButton("nearlySortedArrayRadix");
	disableButton("revSortedArrayRadix");
	disableButton("sortedArrayRadix");
	disableButton("radix_1");
	disableButton("radix_2");
	disableButton("radix_3");
	disableButton("radix_4");
	var _button = document.getElementById("runAnimation");
	var icon = document.getElementById("play-icon");
	if (_button.className == "animation-sidebar-block-button") {
		isPaused = false;
		console.log("Run Animation");
		icon.className = "glyphicon glyphicon-pause";
		_button.className = "animation-sidebar-block-button allow-pause";
		runAnimation();
	} 
	else if (_button.className == "animation-sidebar-block-button allow-pause") {
		console.log("Pause Animation");
		icon.className = "glyphicon glyphicon-play";
		_button.className = "animation-sidebar-block-button";
		pauseAnimation();
	}
});

/**
 * Event listener for button with id="resetAnimation"
 *
 */
document.getElementById("resetAnimation").addEventListener("click", function() {
	clearSelected("nearlySortedArrayRadix");
	clearSelected("randomArrayRadix");
	clearSelected("sortedArrayRadix");
	clearSelected("revSortedArrayRadix");
	clearSelected("radix_1");
	clearSelected("radix_2");
	clearSelected("radix_3");
	clearSelected("radix_4");
	resetAnimation();
	number_length = 3; //default value
	radix_width = number_length*10+1; //default value
	bucket_width = 60; //default value
	number_floor = 1000; //default value
	console.log("The animation has been reset");
	document.getElementById("runAnimation").className = "animation-sidebar-block-button";
	document.getElementById("play-icon").className = "glyphicon glyphicon-play";
	document.getElementById("history_player").style.display="none";
	clearInterval(id);
	document.getElementById("autoplay_backward").name = "play";
	document.getElementById("span_backward").className = "glyphicon glyphicon-backward";
	document.getElementById("autoplay_forward").name = "play";
	document.getElementById("span_forward").className = "glyphicon glyphicon-forward";
	clearDisabled("step_backward");
	clearDisabled("step_forward");
	clearDisabled("autoplay_forward");
	clearDisabled("autoplay_backward");
	clearDisabled("history_slider");
	clearDisabled("slider_container");
	clearDisabled("randomArrayRadix");
	clearDisabled("nearlySortedArrayRadix");
	clearDisabled("revSortedArrayRadix");
	clearDisabled("sortedArrayRadix");
	clearDisabled("radix_1");
	clearDisabled("radix_2");
	clearDisabled("radix_3");
	clearDisabled("radix_4");
	document.getElementById("visual_history").disabled = false;
	updateActionTracker("Tip: ", "You can allow or disable the Action Tracker from the left sidebar.");
});

/**
 * The value of the animation speed slider
 *
 * @return {number} value The value of the animation speed slider
 */
function getSpeed() {
	var speed = document.getElementById("speed_range").value;
	document.getElementById("selected_speed").style.display="block";
	document.getElementById("selected_speed").innerHTML = "Animation speed: "+speed;
	return document.getElementById("speed_range").value;
}

/**
 * Update Action Tracker
 *
 * @param {string} status_string Main event
 * @param {string} message_string Description of event
 */
function updateActionTracker(status_string, message_string) {
	var _checkbox = document.getElementById("checkActionTracker");
	_checkbox.checked == true ? allowActionTracker = true : allowActionTracker = false; 
	if(allowActionTracker) {
		document.getElementById("action-tracker").innerHTML = 
			"<span class="+"status"+">"+status_string+"</span>" +  message_string;
	} else if (!allowActionTracker) {
		document.getElementById("action-tracker").innerHTML = "The Action Tracker has been disabled";
	}
}

/**
 * Checks whether to keep animation history
 *
 * @return {boolean} keepVisualHistory Whether to keep animation history
 */
function keepHistory() {
	var _checkbox = document.getElementById("visual_history");
	_checkbox.checked == true ? keepVisualHistory = true : keepVisualHistory = false;
	return keepVisualHistory;
}

/**
 * Display the video player interface
 *
 */
function toggleHistoryPlayer() {
	document.getElementById("history_player").style.display="block";
	var history_slider = document.getElementById("history_slider");
	history_slider.min = 0;
	history_slider.max = _history.length-1;
	history_slider.value = _history.length-1;
}

/**
 * EvenListener for input element with id="history_slider"
 */
$('#history_slider').on("change", function() {
	displayMomentVal();
	displayBuckets();
});

/**
 * Displays an "animation history" frame depending on the history_slider value
 *
 */
function displayMomentVal() {
	var entry = document.getElementById("history_slider").value;
    displayMoment(_history[parseInt(entry)]);
	updateActionTracker(_textHistory[parseInt(entry)]," (history)");
}

/**
 * Save RadixSort animation state (whole)
 *
 */
function saveAnimationState() {
	var jsonArray = JSON.parse(JSON.stringify(RADIX_OBJECTS));
	_history.push(convertJSONtoRadix(jsonArray));
}

/**
 * Displays an "animation history" frame (Radix-based visualisation)
 *
 * @param {array} arr The index of the frame to be produced
 */
function displayMoment(arr) {
	clear(); var i;
	for(i=0; i<arr.length; i++) {
		arr[i].update();
	}
	displayBuckets();
}


/**
 * EvenListener for button with id="step_backward"
 */
document.getElementById("step_backward").addEventListener("click", function() {
	var history_slider = document.getElementById("history_slider");
	if(parseInt(history_slider.value)-1 >= 0) {
		history_slider.value = parseInt(history_slider.value)-1;
		displayMomentVal();
	} else {
		console.log("Step backward has been denied");
	}
});

/**
 * EvenListener for button with id="step_forward"
 */
document.getElementById("step_forward").addEventListener("click", function() {
	var history_slider = document.getElementById("history_slider");
	if(parseInt(history_slider.value)+1 <= _history.length) {
		history_slider.value = parseInt(history_slider.value)+1;
		displayMomentVal();
	} else {
		console.log("Step forward has been denied");
	}
});	

/**
 * EvenListener for button with id="autoplay_forward"
 */
var id;
document.getElementById("autoplay_forward").addEventListener("click", function() {
	disableButton("step_backward");
	disableButton("step_forward");
	disableButton("autoplay_backward");
	disableButton("history_slider");
	disableButton("slider_container");
	if (document.getElementById("autoplay_forward").name == "play") {
		document.getElementById("autoplay_forward").name = "pause";
		document.getElementById("span_forward").className = "glyphicon glyphicon-pause";
		var history_slider = document.getElementById("history_slider");   
		id = setInterval(autoplay, 20);
		function autoplay() {
			if (parseInt(history_slider.value)+1 == _history.length) {
				console.log("Forward autoplay finished.");
				clearDisabled("step_backward");
				clearDisabled("step_forward");
				clearDisabled("autoplay_backward");
				clearDisabled("history_slider");
				clearDisabled("slider_container");
				document.getElementById("autoplay_forward").name = "play";
				document.getElementById("span_forward").className = "glyphicon glyphicon-forward";
				clearInterval(id);
			} else {
				history_slider.value = parseInt(history_slider.value)+1;
				displayMomentVal();
			}
		}
	} else {
		console.log("Forward autoplay paused!");
		document.getElementById("autoplay_forward").name = "play";
		document.getElementById("span_forward").className = "glyphicon glyphicon-forward";
		clearDisabled("step_backward");
		clearDisabled("step_forward");
		clearDisabled("autoplay_backward");
		clearDisabled("history_slider");
		clearDisabled("slider_container");
		clearInterval(id);
	}
});

/**
 * EvenListener for button with id="autoplay_backward"
 */
document.getElementById("autoplay_backward").addEventListener("click", function() {
	disableButton("step_backward");
	disableButton("step_forward");
	disableButton("autoplay_forward");
	disableButton("history_slider");
	disableButton("slider_container");
	if (document.getElementById("autoplay_backward").name == "play") {
		document.getElementById("autoplay_backward").name = "pause";
		document.getElementById("span_backward").className = "glyphicon glyphicon-pause";
		var history_slider = document.getElementById("history_slider");   
		id = setInterval(autoplay, 20);
		function autoplay() {
			if (parseInt(history_slider.value)-1 < 0) {
				console.log("Backward autoplay finished.");
				document.getElementById("autoplay_backward").name = "play";
				document.getElementById("span_backward").className = "glyphicon glyphicon-backward";
				clearDisabled("step_backward");
				clearDisabled("step_forward");
				clearDisabled("autoplay_forward");
				clearDisabled("history_slider");
				clearDisabled("slider_container");
				clearInterval(id);
			} else {
				history_slider.value = parseInt(history_slider.value)-1;
				displayMomentVal();
			}
		}
	} else {
		console.log("Backward autoplay paused!");
		document.getElementById("autoplay_backward").name = "play";
		document.getElementById("span_backward").className = "glyphicon glyphicon-backward";
		clearDisabled("step_backward");
		clearDisabled("step_forward");
		clearDisabled("autoplay_forward");
		clearDisabled("history_slider");
		clearDisabled("slider_container");
		clearInterval(id);
	}
});

/* END OF FILE */



















