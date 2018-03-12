/* copyright information:
FILE: CountingSort.js
AUTHOR: Dayan Petrov
UNIVERSITY: The University of Sheffield
WEB: dissertation.dayanpetrow.eu
DESCRIPTION: CountingSort Visualisation
LAST UPDATED: 28-04-2017
*/

/* VARIABLES */
var NUMBER_FLOOR = 10; /* means that 9 is the maximum possible number when generating input */
var COUNTING_BARS = []; /* filled with counting bar objects */
var initial_xs = [];
var place = 0;
var isPaused = false;
var display = true;
var current_counter = 0;
var state = 0;
var _history = [];
var _textHistory = [];
var _countingHistory = [];
var frame_id;

/* generate random input by default */
generateRandomArray();

/**
 * Create CountingBar objects to use as counters in CountingSort
 */
function createCounter() {
	var height;
	if(ARRAY_OF_OBJECTS.length <= 8) {
		BAR_WIDTH = 40, BAR_SPACING = 55;
	} else if (ARRAY_OF_OBJECTS.length <= 16) {
		BAR_WIDTH = 25, BAR_SPACING = 35;
	} else if (ARRAY_OF_OBJECTS.length <= 32) {
		BAR_WIDTH = 13, BAR_SPACING = 22;
	}
	var initial_space = (800-(10*BAR_WIDTH + (9*(BAR_SPACING-BAR_WIDTH))))/2;
	console.log(initial_space);
	for(var i = 0; i<10; i++) {
		i == 0 ? height = 1 : height = i * 16;
		COUNTING_BARS.push(new CountingBar(i, i*BAR_SPACING+initial_space, 440-height, BAR_WIDTH, height, 0));
	}
}

/**
 * Display the CountingSort counters
 */
function updateCounter() {
	for(var i = 0; i < COUNTING_BARS.length; i++) {
		COUNTING_BARS[i].update();
	}
}

/**
 * CountingSort animation speed controller
 */
function getSpeed() {
	var speed = document.getElementById("speed_range").value;
	document.getElementById("selected_speed").style.display="block";
	document.getElementById("selected_speed").innerHTML = "Animation speed: "+speed;
	return document.getElementById("speed_range").value;
}

/**
 * Run CountingSort visualisation
 */
function runAnimation() {
	isPaused = false;
	if(display) {
		createCounter();
		topDisplay();
		displayBars();
		updateCounter();
		display = false;
		if(keepHistory()) {
			saveAnimationState();
			saveCounterState();
			_textHistory.push("Displaying the initial array");
		}
	}
	document.getElementById("selected_animation_progress").style.display="block";
	document.getElementById("selected_animation_progress").innerHTML = "Animation: In progress";
	document.getElementById("visual_history").disabled = true;
	animate();
}

/**
 * Reset CountingSort visualisation
 */
function resetAnimation() {
	clearDisabled("speed_range");
	clear();
	ARRAY_OF_NUMBERS = [];
	ARRAY_OF_OBJECTS = [];
	COUNTING_BARS = [];
	_history = [];
	_textHistory = [];
	_countingHistory = [];
	isPaused = true;
	initial_xs = [];
	display = true;
	place = 0;
	state = 0;
	current_counter = 0;
	document.getElementById("runAnimation").disabled = true; /* the play button becomes unclickable as input needs to be selected first */
	document.getElementById("selected_animation_progress").innerHTML = "Animation: Not started";
	document.getElementById("selected_array_type").style.display="none";
}

/**
 * CountingSort visualisation controller
 */
function animate() {
	/* custom input allows users to display just one element but */
	/* array of one element is already sorted */
	if(ARRAY_OF_OBJECTS.length == 1) {
		console.log("Arrays with one element are by default sorted!");
		return;
	}
	
	if(isPaused){return;}
	
	if(state == 0) {
		setTimeout( function() {
			updateActionTracker("Counting: ", ARRAY_OF_OBJECTS[place].number + " is being moved to the counting array");
			var toX = COUNTING_BARS[ARRAY_OF_OBJECTS[place].number].x;
			var toY = COUNTING_BARS[ARRAY_OF_OBJECTS[place].number].y;
			var speed = parseInt(getSpeed());
			console.log(getSpeed());
			if(!COUNTING_BARS[ARRAY_OF_OBJECTS[place].number].exists_sorted_y) {
				COUNTING_BARS[ARRAY_OF_OBJECTS[place].number].existsY();
				COUNTING_BARS[ARRAY_OF_OBJECTS[place].number].setSortedY(ARRAY_OF_OBJECTS[place].y);
			}

			if(ARRAY_OF_OBJECTS[place].x < toX) {
				ARRAY_OF_OBJECTS[place].moveRight(speed);
				if(ARRAY_OF_OBJECTS[place].x > toX) {
					ARRAY_OF_OBJECTS[place].x = toX;
				}
			}
			if(ARRAY_OF_OBJECTS[place].y < toY) {
				ARRAY_OF_OBJECTS[place].moveDown(speed);
				if(ARRAY_OF_OBJECTS[place].y > toY) {
					ARRAY_OF_OBJECTS[place].y = toY;
				}
			}
			if(ARRAY_OF_OBJECTS[place].x > toX) {
				ARRAY_OF_OBJECTS[place].moveLeft(speed);
				if(ARRAY_OF_OBJECTS[place].x < toX) {
					ARRAY_OF_OBJECTS[place].x = toX;
				}
			}
			
			if(ARRAY_OF_OBJECTS[place].x == toX && ARRAY_OF_OBJECTS[place].y == toY) {
				COUNTING_BARS[ARRAY_OF_OBJECTS[place].number].add();
				COUNTING_BARS[ARRAY_OF_OBJECTS[place].number].addIndex(place);
				ARRAY_OF_OBJECTS[place].setRead();
				if(keepHistory()) {
					saveAnimationState();
					saveCounterState();
					_textHistory.push("Counting: " + ARRAY_OF_OBJECTS[place].number + " is being moved to the counting array");
				}
				place++;
			} else {
				if(keepHistory()) {
					saveAnimationState();
					saveCounterState();
					_textHistory.push("Counting: " + ARRAY_OF_OBJECTS[place].number + " is being moved to the counting array");
				}
			}
			displayBars();
			updateCounter();
			
			if(place == ARRAY_OF_OBJECTS.length) {state = 1; place = 0;}
			frame_id = requestAnimationFrame(animate);
		}, 1);
	} else {
		setTimeout( function() {
			if(COUNTING_BARS[current_counter].counter > 0) {
				
				var toX = initial_xs[place];
				var toY = COUNTING_BARS[current_counter].sorted_y;
				var speed = parseInt(getSpeed());
				var counter = COUNTING_BARS[current_counter].counter;
				var _element = COUNTING_BARS[current_counter].indexes[counter-1];

				updateActionTracker("Sorting: ", ARRAY_OF_OBJECTS[_element].number + " is being " +
					"moved to the original array at index " + (place+1));
				ARRAY_OF_OBJECTS[_element].setWritten();
				if(ARRAY_OF_OBJECTS[_element].x < toX) {
					ARRAY_OF_OBJECTS[_element].moveRight(speed);
					if(ARRAY_OF_OBJECTS[_element].x > toX) {
						ARRAY_OF_OBJECTS[_element].x = toX;
					}
				}
				if(ARRAY_OF_OBJECTS[_element].y > toY) {
					ARRAY_OF_OBJECTS[_element].moveUp(speed);
					if(ARRAY_OF_OBJECTS[_element].y < toY) {
						ARRAY_OF_OBJECTS[_element].y = toY;
					}
				}
				if(ARRAY_OF_OBJECTS[_element].x > toX) {
					ARRAY_OF_OBJECTS[_element].moveLeft(speed);
					if(ARRAY_OF_OBJECTS[_element].x < toX) {
						ARRAY_OF_OBJECTS[_element].x = toX;
					}
				}
				
				if(ARRAY_OF_OBJECTS[_element].x == toX && ARRAY_OF_OBJECTS[_element].y == toY) {
					COUNTING_BARS[current_counter].remove();
					if(keepHistory()) {
						saveAnimationState();
						saveCounterState();
						_textHistory.push("Sorting: " + ARRAY_OF_OBJECTS[_element].number + " is being " +
					"moved to the original array at index " + (place+1));
					}
					place++;
				} else {
					if(keepHistory()) {
						saveAnimationState();
						saveCounterState();
						_textHistory.push("Sorting: " + ARRAY_OF_OBJECTS[_element].number + " is being " +
					"moved to the original array at index " + (place+1));
					}
				}
				
				displayBars();
				updateCounter();
			
			} else {
				current_counter++;
			}
			
			if(place < ARRAY_OF_OBJECTS.length) {
				frame_id = requestAnimationFrame(animate);
			} else {
				document.getElementById("runAnimation").disabled = true;
				document.getElementById("selected_animation_progress").innerHTML = "Animation: Finished";
				updateActionTracker("Animation finished: ","Displaying the sorted array");
				if(keepHistory()) {
					saveAnimationState();
					saveCounterState();
					_textHistory.push("Displaying the sorted array");
					toggleHistoryPlayer();
				}
				return;
			}
			
		}, 1);
	}
}
		
/* END OF FILE */
