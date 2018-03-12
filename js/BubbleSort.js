/* copyright information:
FILE: BubbleSort.js
AUTHOR: Dayan Petrov
UNIVERSITY: The University of Sheffield
WEB: dissertation.dayanpetrow.eu
DESCRIPTION: BubbleSort Visualisation
LAST UPDATED: 26-04-2017
*/

/* VARIABLES */
var NUMBER_FLOOR = 100; /* means that 99 is the maximum possible number when generating input */
var outer_loop = 0; /* to represent the outer loop of the nested for loop version of BubbleSort */
var inner_loop = 0; /* to represent the inner loop of the nested for loop version of BubbleSort */
var place = 0; /* the position of the element to be read */
var isSorted = false; /* true of the array is sorted */
var isPaused = false; //animation is paused if true
var _history = []; //for reviewing the animation
var _textHistory = []; //action tracker history
var state = "select_bubble"; //default start state
var initial_positions = []; //array with the initial positions of the bars
var frame_id, frame_id2; //animation frame ids, frame_id2 is for testing
var simulation_counter = 0; //for testing
var first_start = true; //allows functions to fire only on the first run and not after a pause

/* generate random input by default */
generateRandomArray();

/**
 * Reset BubbleSort Animation
 */
function resetAnimation() {
	first_start = true;
	state = "select_bubble";
	initial_positions = [];
	isPaused = true;
	clear();
	ARRAY_OF_NUMBERS = [];
	ARRAY_OF_OBJECTS = [];
	_history = [];
	_textHistory = [];
	outer_loop = 0;
	inner_loop = 0;
	place = 0;
	isSorted = false;
	document.getElementById("runAnimation").disabled = true; /* the play button becomes unclickable as input needs to be selected first */
	document.getElementById("selected_animation_progress").innerHTML = "Animation: Not started";
	document.getElementById("selected_array_type").style.display="none";
}

/**
 * Run BubbleSort Animation
 */
function runAnimation() {
	if(first_start) {
		for(var i = 0; i < ARRAY_OF_OBJECTS.length; i++) {
			initial_positions.push(ARRAY_OF_OBJECTS[i].x);
		}
		if(keepHistory()) {
			saveAnimationState();
			_textHistory.push("Displaying the initial array");
		}
	}
	isPaused = false;
	document.getElementById("selected_animation_progress").style.display="block";
	document.getElementById("selected_animation_progress").innerHTML = "Animation: In progress";
	document.getElementById("visual_history").disabled = true;
	animate();
}

/**
 * BubbleSort animation controller
 */
function animate() {
	if(isPaused){return;}
	
	if(ARRAY_OF_OBJECTS.length == 1) {
		console.log("An array with one element is already sorted");
		return;
	}
	
	if(isSorted) { 
		document.getElementById("runAnimation").disabled = true;
		document.getElementById("selected_animation_progress").innerHTML = "Animation: Finished";
		ARRAY_OF_OBJECTS[place].setSorted();
		ARRAY_OF_OBJECTS[place+1].setSorted();
		displayBars();
		updateActionTracker("Animation finished:", " The array has been sorted successfully!");
		if(keepHistory()) {
			saveAnimationState();
			_textHistory.push("Animation finished: The array has been sorted successfully!");
			toggleHistoryPlayer();
		}
		
		//paste the test function here
		
		//end test
		
		return;
	}
	
	/* State: Select elements */
	if(state == "select_bubble") {
		if(isPaused){return;}
		setTimeout( function() {
			if(outer_loop < ARRAY_OF_OBJECTS.length) {
				if(inner_loop+1 < ARRAY_OF_OBJECTS.length-outer_loop) {
					updateActionTracker("Selection: ", ARRAY_OF_OBJECTS[place].number + " and " +
						ARRAY_OF_OBJECTS[place+1].number + " are selected to be compared");
					ARRAY_OF_OBJECTS[place].setRead();
					ARRAY_OF_OBJECTS[place+1].setRead();
					displayBars();
					
					if(keepHistory()) {
						saveAnimationState();
						_textHistory.push("Selection: " + ARRAY_OF_OBJECTS[place].number + " and " +
						ARRAY_OF_OBJECTS[place+1].number + " are selected");
					}
					
					state = "compare_bubble";
					frame_id = requestAnimationFrame(animate);
				}
			}
		}, 1500 - animationSpeed()*150);
	}
	
	/* State: Compare elements */
	else if(state == "compare_bubble") {
		if(isPaused){return;}
		setTimeout( function() {
			if(ARRAY_OF_OBJECTS[place].number > ARRAY_OF_OBJECTS[place+1].number) {
				state = "swap_bubble";
			} else {
				state = "deselect_bubble";
			}
			
			if(keepHistory()) {
				saveAnimationState();
				_textHistory.push("Comparison: " + ARRAY_OF_OBJECTS[place].number + " and " +
						ARRAY_OF_OBJECTS[place+1].number + " are being compared");
			}
			frame_id = requestAnimationFrame(animate);
		}, 1500 - animationSpeed()*150);
	}
	
	/* State: Swap elements */
	else if(state == "swap_bubble") {
		if(isPaused){return;}
		setTimeout(function() {
			updateActionTracker("Swap: ", ARRAY_OF_OBJECTS[place].number + " and " +
						ARRAY_OF_OBJECTS[place+1].number + " are being swapped");
			var toX = initial_positions[place];
			var fromX = initial_positions[place+1];
			var speed = animationSpeed();
			
			if(ARRAY_OF_OBJECTS[place+1].x > toX) {
				ARRAY_OF_OBJECTS[place+1].left(speed);
				ARRAY_OF_OBJECTS[place].right(speed);
				if(ARRAY_OF_OBJECTS[place+1].x < toX) {
					ARRAY_OF_OBJECTS[place+1].setX(toX);
					ARRAY_OF_OBJECTS[place].setX(fromX);
				}
			}
			
			var p1 = place;
			
			if(ARRAY_OF_OBJECTS[place+1].x == toX) {
				ARRAY_OF_OBJECTS[place+1].setX(fromX);
				ARRAY_OF_OBJECTS[place].setX(toX);
				swapBars(ARRAY_OF_OBJECTS[place+1],ARRAY_OF_OBJECTS[place]);
				ARRAY_OF_OBJECTS[place+1].setUnsorted();
				ARRAY_OF_OBJECTS[place].setUnsorted();
				place++;
				inner_loop++;
				state = "select_bubble";
			}
			
			if(keepHistory()) {
				saveAnimationState();
				_textHistory.push("Swap: " + ARRAY_OF_OBJECTS[p1].number + " and " +
						ARRAY_OF_OBJECTS[p1+1].number + " are being swapped");
			}
			
			if(inner_loop+1 == ARRAY_OF_OBJECTS.length-outer_loop) {
				outer_loop++;
				place = 0;
				inner_loop = 0;
				if(outer_loop != 0) {
					ARRAY_OF_OBJECTS[ARRAY_OF_OBJECTS.length-outer_loop].setSorted();
				}
			}
			
			if(outer_loop+1 == ARRAY_OF_OBJECTS.length) {
				isSorted = true;
			}
			
			displayBars();
			frame_id = requestAnimationFrame(animate);
			
		}, 20);
	}
	
	/* State: Deselect elements */
	else if(state == "deselect_bubble") {
		if(isPaused){return;}
		setTimeout( function() {
			updateActionTracker("No swap: ", ARRAY_OF_OBJECTS[place].number + " and " +
						ARRAY_OF_OBJECTS[place+1].number + " are in correct order");
						
			ARRAY_OF_OBJECTS[place+1].setUnsorted();
			ARRAY_OF_OBJECTS[place].setUnsorted();
			
			if(keepHistory()) {
				saveAnimationState();
				_textHistory.push("No swap: " + ARRAY_OF_OBJECTS[place].number + " and " +
						ARRAY_OF_OBJECTS[place+1].number + " are in correct order");
			}
			
			displayBars();
			frame_id = requestAnimationFrame(animate);
			state = "select_bubble";
			place++;
			inner_loop++;
			
			if(inner_loop+1 == ARRAY_OF_OBJECTS.length-outer_loop) {
				outer_loop++;
				place = 0;
				inner_loop = 0;
				if(outer_loop != 0) {
					ARRAY_OF_OBJECTS[ARRAY_OF_OBJECTS.length-outer_loop].setSorted();
				}
			}
			
			if(outer_loop+1 == ARRAY_OF_OBJECTS.length) {
				isSorted = true;
			}
		}, 1500 - animationSpeed()*150);
	}
}

/* END OF FILE */