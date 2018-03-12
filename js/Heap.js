/* copyright information:
FILE: Heap.js
AUTHOR: Dayan Petrov
UNIVERSITY: The University of Sheffield
WEB: dissertation.dayanpetrow.eu
DESCRIPTION: Heap Objects constructors, accessors, mutators, building HeapSort input, functionality for HeapSort 
LAST UPDATED: 28-04-2017
*/

/* VARIABLES */
var canvas = document.getElementById('myCanvas');
canvas.width  = 800; canvas.height = 500;
var ctx = canvas.getContext('2d');
var radius = 17;
var arraySize = 31;
var ARRAY_OF_HEAPS = [];
var ARRAY_OF_HEAPBOXES = [];
var ARRAY_OF_NUMBERS = [];
var box_width = 20;
var NUMBER_FLOOR = 100;
var CONNECTIONS = [];
var box_positions = [];
var _heaps_history = [];
var _connections_history = [];
var _boxes_history = [];
var _text_history = [];
document.getElementById("runAnimation").disabled = true;

/**
 * Creates an instance of HeapBox
 *
 * @constructor
 * @this {HeapBox}
 * @param {number} number The value of the element
 * @param {number} x The x-position of the HeapBox object on the canvas
 * @param {number} y The y-position of the HeapBox object on the canvas
 * @param {string} status The status of the object is responsible for the color of the HeapBox object
 */
function HeapBox(number, x, y, _status) {
	this.number = number;
	this.x = x;
	this.y = y;
	this._status = _status;
}	

/**
 * Displays a HeapBox object on the Canvas
 *
 * @this {HeapBox}
 */
HeapBox.prototype.update = function() {
	ctx.save();
	if(this._status == "normal") {
		ctx.strokeStyle = 'black';
	} else if(this._status == "selected") {
		ctx.strokeStyle ='blue';
	} else if(this._status == "swap") {
		ctx.strokeStyle = 'red';
	} else if(this._status == "sorted") {
		ctx.strokeStyle = 'green';
	}
	ctx.font = "13px Arial";
	ctx.strokeRect(this.x,this.y,box_width,25);
	ctx.fillStyle = 'black';
	if(this.number > 9) {
		ctx.fillText(this.number, this.x+3, this.y+17);
	} else {
		ctx.fillText(this.number, this.x+7, this.y+17);
	}
	ctx.restore();
}

/**
 * Sets HeapBox.number to the parameter value
 *
 * @this {HeapBox}
 * @param {number} number The new value of HeapBox.number
 */
HeapBox.prototype.setNumber = function(number) {
	this.number = number;
}

/**
 * Adds the function paramter to HeapBox.x
 *
 * @this {HeapBox}
 * @param {number} number The value to be added to HeapBox.x
 */
HeapBox.prototype.moveRight = function(number) {
	this.x += number;
}

/**
 * Subtracts the function paramter from HeapBox.x
 *
 * @this {HeapBox}
 * @param {number} number The value to be subtracted from HeapBox.x
 */
HeapBox.prototype.moveLeft = function(number) {
	this.x -= number;
}

/**
 * Sets HeapBox.status to "selected"
 *
 * @this {HeapBox}
 */
HeapBox.prototype.setSelected = function() {
	this._status = "selected";
}

/**
 * Sets HeapBox.status to "sorted"
 *
 * @this {HeapBox}
 */
HeapBox.prototype.setSorted = function() {
	this._status = "sorted";
}

/**
 * Sets HeapBox.status to "normal"
 *
 * @this {HeapBox}
 */
HeapBox.prototype.setNormal = function() {
	this._status = "normal";
}

/**
 * Sets HeapBox.status to "swap"
 *
 * @this {HeapBox}
 */
HeapBox.prototype.setSwap = function() {
	this._status = "swap";
}

/**
 * Creates an instance of Heap.
 *
 * @constructor
 * @this {Heap}
 * @param {number} number The value of the element
 * @param {number} sx The x-position of the Heap object
 * @param {number} sy The y-position of the Heap object
 * @param {number} _parent The parent of the Heap object
 * @param {number} leftchild The left child of the Heap object
 * @param {number} rightchild The right child of the Heap object
 * @param {string} _status Responsible for the color of the Heap object
 */
function Heap(number, sx, sy, _parent, leftchild, rightchild, _status) {
	this.number = number;
	this.square_x = sx;
	this.square_y = sy;
	this._parent = _parent;
	this.leftchild = leftchild;
	this.rightchild = rightchild;
	this._status = _status;
}

/**
 * Displays a Heap object on the Canvas
 *
 * @this {Heap}
 */
Heap.prototype.update = function() {
	if(this._status != "hide") {
		ctx.save();
		ctx.beginPath();
		ctx.arc(this.square_x, this.square_y, radius, 0, 2 * Math.PI, false);
		if(this._status == "normal") {
			ctx.fillStyle = '#e6e8bb';
		} else if(this._status == "selected") {
			ctx.fillStyle = '#9bbbef';
		} else if(this._status == "swap") {
			ctx.fillStyle = '#e89c92';
		} else if(this._status == "sorted") {
			ctx.fillStyle = '#bdcea3';
		}
		ctx.fill();
		ctx.lineWidth = 2;
		if(this._status == "normal") {
			ctx.strokeStyle = 'black';
		} else if(this._status == "selected") {
			ctx.strokeStyle ='blue';
		} else if(this._status == "swap") {
			ctx.strokeStyle = 'red';
		} else if(this._status == "sorted") {
			ctx.strokeStyle = 'green';
		}
		ctx.stroke();
		ctx.font = "13px Arial";
		ctx.fillStyle = 'black';
		if(this.number > 9) {
			ctx.fillText(this.number, this.square_x-7, this.square_y+5);
		} else {
			ctx.fillText(this.number, this.square_x-3, this.square_y+5);
		}
		ctx.closePath();
		ctx.restore();
	}
}

/**
 * Sets Heap._status to "selected"
 *
 * @this {Heap}
 */
Heap.prototype.setSelected = function() {
	this._status = "selected";
}

/**
 * Sets Heap._status to "swap"
 *
 * @this {Heap}
 */
Heap.prototype.setSwap = function() {
	this._status = "swap";
}

/**
 * Sets Heap._status to "normal"
 *
 * @this {Heap}
 */
Heap.prototype.setNormal = function() {
	this._status = "normal";
}

/**
 * Sets Heap._status to "sorted"
 *
 * @this {Heap}
 */
Heap.prototype.setSorted = function() {
	this._status = "sorted";
}

/**
 * Sets Heap.rightchild to the parameter
 *
 * @this {Heap}
* @param {number} number The new value of Heap.rightchild
 */
Heap.prototype.setRight = function(number) {
	this.rightchild = number;
}

/**
 * Sets Heap.leftchild to the parameter
 *
 * @this {Heap}
* @param {number} number The new value of Heap.leftchild
 */
Heap.prototype.setLeft = function(number) {
	this.leftchild = number;
}

/**
 * Sets Heap._parent to the parameter
 *
 * @this {Heap}
* @param {number} number The new value of Heap._parent
 */
Heap.prototype.setParent = function(number) {
	this._parent = number;
}

/**
 * Sets Heap.square_x to the parameter
 *
 * @this {Heap}
* @param {number} number The new value of Heap.square_x
 */
Heap.prototype.setX = function(number) {
	this.square_x = number;
}

/**
 * Sets Heap.square_y to the parameter
 *
 * @this {Heap}
* @param {number} number The new value of Heap.square_y
 */
Heap.prototype.setY = function(number) {
	this.square_y = number;
}

/**
 * Sets Heap.number to the parameter
 *
 * @this {Heap}
* @param {number} number The new value of Heap.number
 */
Heap.prototype.setNumber = function(number) {
	this.number = number;
}

/**
 * Adds the function paramter to Heap.x
 *
 * @this {Heap}
 * @param {number} number The value to be added to Heap.square_x
 */
Heap.prototype.moveRight = function(number) {
	this.square_x += number;
}

/**
 * Subtracts the function paramter from Heap.x
 *
 * @this {Heap}
 * @param {number} number The value to be subtracted from Heap.square_x
 */
Heap.prototype.moveLeft = function(number) {
	this.square_x -= number;
}

/**
 * Subtracts the function paramter from Heap.y
 *
 * @this {Heap}
 * @param {number} number The value to be subtracted from Heap.square_y
 */
Heap.prototype.moveUp = function(number) {
	this.square_y -= number;
}

/**
 * Adds the function paramter to Heap.y
 *
 * @this {Heap}
 * @param {number} number The value to be added to Heap.square_y
 */
Heap.prototype.moveDown = function(number) {
	this.square_y += number;
}

/**
 * Creates an instance of HeapConnection
 *
 * @constructor
 * @this {HeapConnection}
 * @param {number} index Defines the position of a connection between 2 Heap objects
 * @param {boolean} visible Whether to display or hide the HeapConnection
 */
function HeapConnection(index,visible) {
	this.index = index;
	this.visible = visible;
}

/**
 * Hides a HeapConnection object
 *
 * @this {HeapConnection}
 */
HeapConnection.prototype.hide = function() {
	this.visible = false;
}

/**
 * Displays a HeapConnection object on the Canvas
 *
 * @this {HeapConnection}
 */
HeapConnection.prototype.update = function() {
	if(this.visible) {
		var _parent = Math.floor((this.index-1)/2);
		ctx.beginPath();
		ctx.moveTo(HEAP_POSITIONS[this.index][0],HEAP_POSITIONS[this.index][1]);
		ctx.lineTo(HEAP_POSITIONS[_parent][0],HEAP_POSITIONS[_parent][1]);
		ctx.stroke();
	}
}

/* =============================================== */
/* Predefined positions for the heaps */
var HEAP_POSITIONS = [
	[400,100], //root
	[210,150],[590,150], //second level
	[120,200],[300,200],[500,200],[680,200], //third level
	[75,300],[165,300],[255,300],[345,300],[455,300],[545,300],[635,300],[725,300], //fourth level
	[55,400],[95,400],[145,400],[185,400],[235,400],[275,400],[325,400],[365,400],[435,400],[475,400],
	[525,400],[565,400],[615,400],[655,400],[705,400],[745,400] //fifth level
];

/**
 * Displays a scene on the canvas composed of HeapBoxes, Heaps and HeapConnections
 *
 * @param {array} arr The array of numbers to be represented
 */
function createScene(arr) {
	ARRAY_OF_HEAPBOXES = [];
	ARRAY_OF_HEAPS = [];
	CONNECTIONS = [];
	box_positions = [];
	var initial_spacing = (800-(arraySize*(box_width) + (arraySize-1)*3))/2;
	for(var i = 0; i < arraySize; i++) {
		var _parent, leftchild, rightchild;
		if(i == 0) {
			_parent = undefined;
		} else {
			_parent = Math.floor((i-1) / 2);
		}
		leftchild = 2*i + 1;
		rightchild = 2*i + 2;
		if(leftchild >= arraySize) {leftchild = undefined;}
		if(rightchild >= arraySize) {rightchild = undefined;}
		ARRAY_OF_HEAPS.push(new Heap(arr[i],HEAP_POSITIONS[i][0],HEAP_POSITIONS[i][1],_parent,leftchild,rightchild,"normal"));
		ARRAY_OF_HEAPBOXES.push(new HeapBox(arr[i], i*(box_width+3)+initial_spacing, 30, "normal"));
		CONNECTIONS.push(new HeapConnection(i, true));
		box_positions.push(i*(box_width+3)+initial_spacing);
		displayScene();
		document.getElementById("runAnimation").disabled = false;
	}
}

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
	createScene(ARRAY_OF_NUMBERS);
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
	createScene(ARRAY_OF_NUMBERS);
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
	createScene(ARRAY_OF_NUMBERS);
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
	for(j=0; j<3; j++) {
		number = Math.floor(Math.random() * ARRAY_OF_NUMBERS.length);
		swap = Math.floor(Math.random() * ARRAY_OF_NUMBERS.length);
		temp = ARRAY_OF_NUMBERS[number];
		ARRAY_OF_NUMBERS[number] = ARRAY_OF_NUMBERS[swap];
		ARRAY_OF_NUMBERS[swap] = temp;
	}
	createScene(ARRAY_OF_NUMBERS);
	document.getElementById("selected_array_type").style.display="block";
	document.getElementById("selected_array_type").innerHTML = "Array type: Nearly sorted";
}

/**
 * Clears the scene on the canvas
 *
 */
function clear() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Displays the HeapSort scene on the canvas
 *
 */
function displayScene() {
	clear();
	for(var i = 1; i<CONNECTIONS.length; i++) {
		CONNECTIONS[i].update();
	}
	for(var i = 0; i<ARRAY_OF_HEAPBOXES.length; i++) {
		ARRAY_OF_HEAPBOXES[i].update();
		ARRAY_OF_HEAPS[i].update();
	}
}


/**
 * Enable popovers (bootstrap)
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
 * Event listener for button with id="set_array_size"
 *
 */
document.getElementById("set_array_size").addEventListener("click", function() {
	var size = document.getElementById("array_size_quantity").value;
	if (!isNaN(size) && parseInt(size) >= 5 && parseInt(size) <=31) {
		arraySize = size;
		place = arraySize-1;
		unsorted = arraySize-1;
		document.getElementById("selected_array_size").innerHTML = "Array size: " + arraySize;
		console.log("HeapSort: Array size is set to " + arraySize);
	} else {
		console.log("Invalid input for array size");
	}
});

/**
 * Event listener for button with id="randomArray"
 *
 */
document.getElementById("randomArray").addEventListener("click", function() {
	generateRandomArray();
	selected_button("randomArray");
	clearSelected("sortedArray");
	clearSelected("revSortedArray");
	clearSelected("nearlySortedArray");
	console.log("HeapSort: Array type is set to Random");
});

/**
 * Event listener for button with id="sortedArray"
 *
 */
document.getElementById("sortedArray").addEventListener("click", function() {
	generateSortedArray();
	selected_button("sortedArray");
	clearSelected("randomArray");
	clearSelected("revSortedArray");
	clearSelected("nearlySortedArray");
	console.log("HeapSort: Array type is set to Sorted");
});

/**
 * Event listener for button with id="revSortedArray"
 *
 */
document.getElementById("revSortedArray").addEventListener("click", function() {
	generateRevSortedArray();
	selected_button("revSortedArray");
	clearSelected("randomArray");
	clearSelected("sortedArray");
	clearSelected("nearlySortedArray");
	console.log("HeapSort: Array type is set to Reverse-sorted");
});

/**
 * Event listener for button with id="nearlySortedArray"
 *
 */
document.getElementById("nearlySortedArray").addEventListener("click", function() {
	generateNearlySortedArray();
	selected_button("nearlySortedArray");
	clearSelected("randomArray");
	clearSelected("sortedArray");
	clearSelected("revSortedArray");
	console.log("HeapSort: Array type is set to Nearly sorted");
});

/**
 * Pause HeapSort visualisation
 *
 */
function pauseAnimation() {
	isPaused = true;
	document.getElementById("selected_animation_progress").innerHTML = "Animation: Paused";
}

/**
 * Event listener for button with id="runAnimation"
 *
 */
document.getElementById("runAnimation").addEventListener("click", function() {
	disableButton("set_array_size");
	disableButton("array_size_quantity");
	disableButton("randomArray");
	disableButton("nearlySortedArray");
	disableButton("revSortedArray");
	disableButton("sortedArray");
	var _button = document.getElementById("runAnimation");
	var icon = document.getElementById("play-icon");
	if (_button.className == "animation-sidebar-block-button") {
		console.log("Run Animation");
		icon.className = "glyphicon glyphicon-pause";
		_button.className = "animation-sidebar-block-button allow-pause";
		runAnimation();
		isPaused = false;
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
	clearSelected("nearlySortedArray");
	clearSelected("randomArray");
	clearSelected("sortedArray");
	clearSelected("revSortedArray");
	resetAnimation();
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
	clearDisabled("randomArray");
	clearDisabled("nearlySortedArray");
	clearDisabled("revSortedArray");
	clearDisabled("sortedArray");
	clearDisabled("set_array_size");
	clearDisabled("array_size_quantity");
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
	history_slider.max = _heaps_history.length-1;
	history_slider.value = _heaps_history.length-1;
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
 * Save HeapSort animation state of Heap objects
 *
 */
function saveHeapsState() {
	var jsonArray = JSON.parse(JSON.stringify(ARRAY_OF_HEAPS));
	_heaps_history.push(convertJSONtoHeap(jsonArray));
}

/**
 * Save HeapSort animation state of HeapBox objects
 *
 */
function saveBoxesState() {
	var jsonArray = JSON.parse(JSON.stringify(ARRAY_OF_HEAPBOXES));
	_boxes_history.push(convertJSONtoHeapBox(jsonArray));
}

/**
 * Save HeapSort animation state of HeapConnections
 *
 */
function saveConnectionsState() {
	var jsonArray = JSON.parse(JSON.stringify(CONNECTIONS));
	_connections_history.push(convertJSONtoConnection(jsonArray));
}

/**
 * Save HeapSort animation state (whole)
 *
 */
function saveScene() {
	saveHeapsState();
	saveBoxesState();
	saveConnectionsState();
}

/**
 * Creates new Heap objects from JSON array
 *
 * @param {array} _obj JSON array to be converted to Heap objects
 */
function convertJSONtoHeap(_obj) {
	var heapsArray = []; var i;
	for(i=0; i<_obj.length; i++) {
		heapsArray.push(new Heap(_obj[i].number, _obj[i].square_x, 
			_obj[i].square_y, _obj[i]._parent, _obj[i].leftchild, _obj[i].rightchild, _obj[i]._status));
	}
	return heapsArray;
}

/**
 * Creates new HeapBox objects from JSON array
 *
 * @param {array} _obj JSON array to be converted to HeapBox objects
 */
function convertJSONtoHeapBox(_obj) {
	var boxesArray = []; var i;
	for(i=0; i<_obj.length; i++) {
		boxesArray.push(new HeapBox(_obj[i].number, _obj[i].x, _obj[i].y, _obj[i]._status));
	}
	return boxesArray;
}

/**
 * Creates new HeapConnections objects from JSON array
 *
 * @param {array} _obj JSON array to be converted to HeapConnections objects
 */
function convertJSONtoConnection(_obj) {
	var connectionsArray = []; var i;
	for(i=0; i<_obj.length; i++) {
		connectionsArray.push(new HeapConnection(_obj[i].index, _obj[i].visible));
	}
	return connectionsArray;
}

/**
 * Displays an "animation history" frame (Heap-based visualisation)
 *
 * @param {array} num The index of the frame to be produced
 */
function displayMoment(num) {
	clear(); 
	var i;
	for(i=1; i<_connections_history[num].length; i++) {
		_connections_history[num][i].update();
	}
	for(i=0; i<_boxes_history[num].length; i++) {
		_heaps_history[num][i].update();
		_boxes_history[num][i].update();
	}
	
}

/**
 * Displays an "animation history" frame depending on the history_slider value
 *
 */
function displayMomentVal() {
	var entry = document.getElementById("history_slider").value;
	displayMoment(parseInt(entry));
	updateActionTracker("Animation completed:", " Animation review available");
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
	if(parseInt(history_slider.value)+1 <= _heaps_history.length) {
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
		id = setInterval(autoplay, 40);
		function autoplay() {
			if (parseInt(history_slider.value)+1 == _heaps_history.length) {
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
		id = setInterval(autoplay, 40);
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

/**
 * EvenListener for input element with id="history_slider"
 */
$('#history_slider').on("change", function() {
	displayMomentVal();
});

/**
 * EventListener for button with id="hide_labels"
 */
if(document.getElementById("hide_labels") != null) {
	document.getElementById("hide_labels").addEventListener("click", function() {
		document.getElementById("color_labels").style.display = "none";
	});
}

generateRandomArray();

/* END OF FILE */