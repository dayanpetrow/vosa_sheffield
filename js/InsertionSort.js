/* copyright information:
FILE: InsertionSort.js
AUTHOR: Dayan Petrov
UNIVERSITY: The University of Sheffield
WEB: dissertation.dayanpetrow.eu
DESCRIPTION: InsertionSort Visualisation
LAST UPDATED: 27-04-2017
*/

/* VARIABLES */
var NUMBER_FLOOR = 100; /* means that 99 is the maximum possible number when generating input */
var outer_loop = 0; /* to represent the outer loop of the nested for loop version of BubbleSort */
var isPaused = false;
var _history = [];
var _textHistory = [];
var frame_id, frame_id2;
var state = "select_element";
var swap_element1, swap_element2;
var initial_positions = []; //array with the initial positions of the bars
var toInsert;
var initial_start = true;

/* generate random input by default */
generateRandomArray();

/**
 * Reset InsertionSort Animation
 */
function resetAnimation() {
	initial_positions = [];
	toInsert = undefined;
	swap_element1 = undefined;
	swap_element2 = undefined;
	state = "select_element";
	isPaused = true;
	clear();
	ARRAY_OF_NUMBERS = [];
	ARRAY_OF_OBJECTS = [];
	_history = [];
	_textHistory = [];
	outer_loop = 0; /* to represent the outer loop of the nested for loop version of BubbleSort */
	document.getElementById("runAnimation").disabled = true; /* the play button becomes unclickable as input needs to be selected first */
	document.getElementById("selected_animation_progress").innerHTML = "Animation: Not started";
	document.getElementById("selected_array_type").style.display="none";
}

/**
 * Run InsertionSort Animation
 */
function runAnimation() {
	if(initial_start) {
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
 * InsertionSort Animation controller
 */
function animate() {
	if(state == "select_element") {
		console.log("State: Select element");
		setTimeout( function() {
			if(isPaused){return;}
			if(outer_loop < ARRAY_OF_OBJECTS.length) {
				/* indicate which bar are currently being read and update the action tracker*/
				updateActionTracker("Selection: ", ARRAY_OF_OBJECTS[outer_loop].number + " is currently selected");
				ARRAY_OF_OBJECTS[outer_loop].setRead();
				displayBars();
					
				/* save the state of the animation if the user has enabled the option */
				if(keepHistory()) {
					saveAnimationState();
					_textHistory.push("Selection: " + ARRAY_OF_OBJECTS[outer_loop].number + " is currently selected");
				}
				
				state = "selection_result";
				frame_id = requestAnimationFrame(animate);
			} else {
				document.getElementById("runAnimation").disabled = true;
				document.getElementById("selected_animation_progress").innerHTML = "Animation: Finished";
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
		}, 1300 - animationSpeed()*130);
	}
	
	else if (state == "selection_result") {
		console.log("State: Selection result");
		setTimeout( function() {
			if(isPaused){return;}
			if(outer_loop == 0) {
				state = "inserted";
			}
			else if(ARRAY_OF_OBJECTS[outer_loop].number >= ARRAY_OF_OBJECTS[outer_loop-1].number) {
				state = "inserted";
			}
			else if(ARRAY_OF_OBJECTS[outer_loop].number < ARRAY_OF_OBJECTS[outer_loop-1].number) {
				swap_element1 = outer_loop-1;
				swap_element2 = outer_loop;
				state = "swap";
			}
			frame_id = requestAnimationFrame(animate);
		}, 1300 - animationSpeed()*130);
	}
	
	else if (state == "inserted") {
		console.log("State: Inserted element");
		setTimeout( function() {
			if(isPaused){return;}
				ARRAY_OF_OBJECTS[outer_loop].setSorted();
				updateActionTracker("Inserted: ", ARRAY_OF_OBJECTS[outer_loop].number + 
					" was successfully inserted into the sorted sequence");
				if(keepHistory()) {
					saveAnimationState();
					_textHistory.push("Inserted: " + ARRAY_OF_OBJECTS[outer_loop].number + " was successfully inserted into the sorted sequence");
				}
				outer_loop++;
				displayBars();
				state = "select_element";
				frame_id = requestAnimationFrame(animate);
		}, 1300 - animationSpeed()*130);
	}
	
	else if (state == "swap") {
		console.log("State: Swap");
		setTimeout(function() {
			if(isPaused){return;}
			updateActionTracker("Swap: ", ARRAY_OF_OBJECTS[swap_element1].number + " and " +
						ARRAY_OF_OBJECTS[swap_element2].number + " are being swapped");
			var toX = initial_positions[swap_element1];
			var fromX = initial_positions[swap_element2];
			var speed = animationSpeed();
			
			if(ARRAY_OF_OBJECTS[swap_element2].x > toX) {
				ARRAY_OF_OBJECTS[swap_element2].left(speed);
				ARRAY_OF_OBJECTS[swap_element1].right(speed);
				if(ARRAY_OF_OBJECTS[swap_element2].x < toX) {
					ARRAY_OF_OBJECTS[swap_element2].setX(toX);
					ARRAY_OF_OBJECTS[swap_element1].setX(fromX);
				}
			}
			
			var p1 = swap_element2;
			
			if(keepHistory()) {
				saveAnimationState();
				_textHistory.push("Swap: " + ARRAY_OF_OBJECTS[p1-1].number + " and " +
						ARRAY_OF_OBJECTS[p1].number + " are being swapped");
			}
			
			if(ARRAY_OF_OBJECTS[swap_element2].x == toX) {
				ARRAY_OF_OBJECTS[swap_element2].setX(fromX);
				ARRAY_OF_OBJECTS[swap_element1].setX(toX);
				swapBars(ARRAY_OF_OBJECTS[swap_element2],ARRAY_OF_OBJECTS[swap_element1]);
				ARRAY_OF_OBJECTS[swap_element2].setSorted();
				ARRAY_OF_OBJECTS[swap_element1].setWritten();
				if(swap_element1-1 < 0 || ARRAY_OF_OBJECTS[swap_element1].number >= ARRAY_OF_OBJECTS[swap_element1-1].number) {
					outer_loop++;
					state = "swap_inserted"
					toInsert = swap_element1;
				} else {
					updateActionTracker("Swap: ", ARRAY_OF_OBJECTS[swap_element2].number + " and " +
						ARRAY_OF_OBJECTS[swap_element1].number + " were swapped");
					
					swap_element1 = swap_element1-1;
					swap_element2 = swap_element1+1;
					state = "wait";
				}
			}
			
			displayBars();
			frame_id = requestAnimationFrame(animate);
			
		}, 20);
	}
	
	else if (state == "wait") {
		setTimeout(function() {
			if(isPaused){return;}
			frame_id = requestAnimationFrame(animate);
			state = "swap";
		}, 1500 - animationSpeed()*150);
	}
	
	else if (state == "swap_inserted") {
		console.log("State: Swap");
		setTimeout(function() {
			if(isPaused){return;}
			updateActionTracker("Inserted: ", ARRAY_OF_OBJECTS[toInsert].number + 
					" was successfully inserted into the sorted sequence");
			if(keepHistory()) {
				saveAnimationState();
				_textHistory.push("Inserted: " + ARRAY_OF_OBJECTS[toInsert].number + " was successfully inserted into the sorted sequence");
			}
			ARRAY_OF_OBJECTS[toInsert].setSorted();
			displayBars();
			frame_id = requestAnimationFrame(animate);
			state = "select_element";
		}, 1300 - animationSpeed()*130);
	}

}

/* END OF FILE */