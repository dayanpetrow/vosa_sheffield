/* copyright information:
FILE: SelectionSort.js
AUTHOR: Dayan Petrov
UNIVERSITY: The University of Sheffield
WEB: dissertation.dayanpetrow.eu
DESCRIPTION: SelectionSort Visualisation
LAST UPDATED: 27-04-2017
*/

/* VARIABLES */
var NUMBER_FLOOR = 100; /* means that 99 is the maximum possible number when generating input */
var outer_loop = 0; /* to represent the outer loop of the nested for loop version of BubbleSort */
var inner_loop = 0; /* to represent the inner loop of the nested for loop version of BubbleSort */
var outer_loop = 0; /* the position of the element to be read */
var isSorted = false; /* true of the array is sorted */
var isPaused = false;
var smallest;
var save_initial = true;
var _history = [];
var _textHistory = [];
var state = "select_element"
document.getElementById("runAnimation").disabled = true;
var frame_id, frame_id2;
var initial_positions = [];
var simulation_counter = 0;

/* generate random input by default */
generateRandomArray();

/**
 * Reset SelectionSort Animation
 */
function resetAnimation() {
	state = "select_element";
	initial_positions = [];
	isPaused = true;
	clear();
	ARRAY_OF_NUMBERS = [];
	ARRAY_OF_OBJECTS = [];
	_history = [];
	_textHistory = [];
	outer_loop = 0;
	inner_loop = 0;
	outer_loop = 0;
	allowIteration = true;
	allowSwap = false;
	isSorted = false;
	newSmallest = false;
	document.getElementById("runAnimation").disabled = true; /* the play button becomes unclickable as input needs to be selected first */
	document.getElementById("selected_animation_progress").innerHTML = "Animation: Not started";
	document.getElementById("selected_array_type").style.display="none";
}

/**
 * Reset SelectionSort Animation
 */
function runAnimation() {
	isPaused = false;
	for(var i = 0; i < ARRAY_OF_OBJECTS.length; i++) {
			initial_positions.push(ARRAY_OF_OBJECTS[i].x);
		}
	if(keepHistory() && save_initial) {
		saveAnimationState();
		_textHistory.push("Displaying the initial state of the array");
	}
	document.getElementById("selected_animation_progress").style.display="block";
	document.getElementById("selected_animation_progress").innerHTML = "Animation: In progress";
	document.getElementById("visual_history").disabled = true;
	animate();
}

/**
 * SelectionSort animation controller
 */
function animate() {
	if(state == "select_element") {
		setTimeout( function() {
			if(isPaused){return;}
			if(outer_loop < ARRAY_OF_OBJECTS.length) {
				if(inner_loop < ARRAY_OF_OBJECTS.length) {
					ARRAY_OF_OBJECTS[inner_loop].setRead();
					displayBars();
					
					updateActionTracker("Selection: ", ARRAY_OF_OBJECTS[inner_loop].number + " is selected and compared to the current smallest element");
					if(keepHistory()) {
						saveAnimationState();
						_textHistory.push("Selection: " + ARRAY_OF_OBJECTS[inner_loop].number + " is selected and compared to the current smallest element");
					}
					
					state = "selection_result";
					frame_id = requestAnimationFrame(animate);
				}
			}
		}, 1000 - animationSpeed()*100);
	}
	
	else if(state == "selection_result") {
		setTimeout( function() {
			if(isPaused){return;}
			if(inner_loop == outer_loop) {
				smallest = inner_loop;
				state = "new_smallest";
			} else if (ARRAY_OF_OBJECTS[inner_loop].number < ARRAY_OF_OBJECTS[smallest].number) {
				state = "new_smallest";
			} else {
				state = "deselect"
			}
			frame_id = requestAnimationFrame(animate);
		}, 1000 - animationSpeed()*100);
	}
	
	else if(state == "new_smallest") {
		setTimeout( function() {
			if(isPaused){return;}
			ARRAY_OF_OBJECTS[smallest].setUnsorted();
			ARRAY_OF_OBJECTS[inner_loop].setPivot();
			smallest = inner_loop;
			inner_loop++;
			if(inner_loop == ARRAY_OF_OBJECTS.length) {
				state = "swap";
			} else {
				state = "select_element"
			}
			updateActionTracker("Selection: ", ARRAY_OF_OBJECTS[smallest].number + " is the new Smallest element");
			if(keepHistory()) {
				saveAnimationState();
				_textHistory.push("Selection: " + ARRAY_OF_OBJECTS[smallest].number + " is the new Smallest element");
			}
			displayBars();
			frame_id = requestAnimationFrame(animate);
		}, 1000 - animationSpeed()*100);
	}
	
	else if(state == "deselect") {
		setTimeout( function() {
			ARRAY_OF_OBJECTS[inner_loop].setUnsorted();
			updateActionTracker("Selection: ", ARRAY_OF_OBJECTS[inner_loop].number + " is bigger than the current Smallest");
			if(keepHistory()) {
				saveAnimationState();
				_textHistory.push("Selection: " + ARRAY_OF_OBJECTS[inner_loop].number + " is bigger than the current Smallest");
			}
			inner_loop++;
			if(inner_loop == ARRAY_OF_OBJECTS.length) {
				state = "swap";
			} else {
				state = "select_element"
			}
			
			displayBars();
			frame_id = requestAnimationFrame(animate);
		}, 1000 - animationSpeed()*100);
	}
	
	else if (state == "swap") {
		if(isPaused){return;}
		setTimeout(function() {
			updateActionTracker("Swap: ", ARRAY_OF_OBJECTS[outer_loop].number + " and " +
						ARRAY_OF_OBJECTS[smallest].number + " are being swapped");
			var toX = initial_positions[outer_loop];
			var fromX = initial_positions[smallest];
			var speed = animationSpeed();
			
			if(ARRAY_OF_OBJECTS[smallest].x > toX) {
				ARRAY_OF_OBJECTS[smallest].left(speed);
				ARRAY_OF_OBJECTS[outer_loop].right(speed);
				if(ARRAY_OF_OBJECTS[smallest].x < toX) {
					ARRAY_OF_OBJECTS[smallest].setX(toX);
					ARRAY_OF_OBJECTS[outer_loop].setX(fromX);
				}
			}
			
			var p1 = outer_loop;
			
			if(smallest != outer_loop) {
			updateActionTracker("Swap smallest: ", ARRAY_OF_OBJECTS[outer_loop].number + " and " + ARRAY_OF_OBJECTS[smallest].number + " are being swapped");
				if(keepHistory()) {
					saveAnimationState();
					_textHistory.push("Swap smallest: " + ARRAY_OF_OBJECTS[outer_loop].number + " and " + ARRAY_OF_OBJECTS[smallest].number + " are being swapped");
				}
			} else {
				updateActionTracker("Last element: ", ARRAY_OF_OBJECTS[outer_loop].number +" is the last element left and is sorted");
				if(keepHistory()) {
					saveAnimationState();
					_textHistory.push("Last element: " + ARRAY_OF_OBJECTS[outer_loop].number +" is the last element left and is sorted");
				}
			}
			
			if(ARRAY_OF_OBJECTS[smallest].x == toX) {
				ARRAY_OF_OBJECTS[smallest].setX(fromX);
				ARRAY_OF_OBJECTS[outer_loop].setX(toX);
				swapBars(ARRAY_OF_OBJECTS[smallest],ARRAY_OF_OBJECTS[outer_loop]);
				ARRAY_OF_OBJECTS[smallest].setUnsorted();
				ARRAY_OF_OBJECTS[outer_loop].setSorted();
				updateActionTracker("Sorted element: ", ARRAY_OF_OBJECTS[outer_loop].number + " is now sorted");
				if(keepHistory()) {
					saveAnimationState();
					_textHistory.push("Sorted element: " + ARRAY_OF_OBJECTS[outer_loop].number + " is now sorted");
						
				}
				outer_loop++;
				inner_loop = outer_loop;
				state = "wait";
				if(outer_loop == ARRAY_OF_OBJECTS.length) {
					state = "finish";
				}
			}
			
			displayBars();
			frame_id = requestAnimationFrame(animate);
			
		}, 20);
	}
	
	else if (state == "wait") {
		setTimeout( function() {
		state = "select_element";
		requestAnimationFrame(animate);
		}, 1000 - animationSpeed()*100);
	}
	
	else if (state == "finish") {
		setTimeout( function() {
			if(isPaused){return;}
			displayBars();
			
			updateActionTracker("Animation finished: ", "Displaying the sorted array");
			if(keepHistory()) {
				saveAnimationState();
				toggleHistoryPlayer();
				_textHistory.push("Animation finished: " + "Displaying the sorted array");
			}
			
			document.getElementById("runAnimation").disabled = true;
			document.getElementById("selected_animation_progress").innerHTML = "Animation: Finished";
			
			//paste the test function here
			//end test
				
			return;
		}, 1000 - animationSpeed()*100);
	}
}

/* END OF FILE */