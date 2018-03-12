/* copyright information:
FILE: RQuickSort.js
AUTHOR: Dayan Petrov
UNIVERSITY: The University of Sheffield
WEB: dissertation.dayanpetrow.eu
DESCRIPTION: Randomised-QuickSort Visualisation
LAST UPDATED: 28-04-2017
*/

/* VARIABLES */
var NUMBER_FLOOR = 100;
var initial_positions = [];
var state = "select_pivot"
var partition_state = "select_element";
var bigger_found = false;
var smaller_found = false;
var next_state;
var pivot;
var PARTITION_END;
var PARTITION_START;
var partition_selected;
var swap_element1, swap_element2;
var first_run = true;
var _history = [];
var _textHistory = [];
var frame_id;

/* generate random input by default */
generateRandomArray();

/**
 * Reset QuickSort Animation
 */
function resetAnimation() {
	clear();
	ARRAY_OF_OBJECTS = [];
	ARRAY_OF_NUMBERS = [];
	_history = [];
	_textHistory = [];
	isPaused = true;
	initial_positions = [];
	state = "select_pivot"
	partition_state = "select_element";
	bigger_found = false;
	smaller_found = false;
	next_state = undefined;
	pivot = undefined;
	PARTITION_END = undefined;
	PARTITION_START = undefined;
	partition_selected = undefined;
	swap_element1 = undefined;
	swap_element2 = undefined;
	first_run = true;
	document.getElementById("runAnimation").disabled = true; /* the play button becomes unclickable as input needs to be selected first */
	document.getElementById("selected_animation_progress").innerHTML = "Animation: Not started";
	document.getElementById("selected_array_type").style.display="none";
}

/**
 * Run QuickSort Animation
 */
function runAnimation() {
	isPaused = false;
	if(first_run) {
		for(var i = 0; i < ARRAY_OF_OBJECTS.length; i++) {
			initial_positions.push(ARRAY_OF_OBJECTS[i].x);
		}
		PARTITION_START = 0;
		partition_selected = 0;
		PARTITION_END = ARRAY_OF_OBJECTS.length-1
		if(keepHistory()) {
			saveAnimationState();
			_textHistory.push("Displaying the sorted array");
		}
		first_run = false;
	}
	document.getElementById("selected_animation_progress").style.display="block";
	document.getElementById("selected_animation_progress").innerHTML = "Animation: In progress";
	document.getElementById("visual_history").disabled = true;
	animate();
}

/**
 * QuickSort animation controller
 */
function animate() {
	if(isPaused){return;}
	
	if(state == "select_pivot") {
		setTimeout(function() {
			if(isPaused){return;}
			if(PARTITION_START == PARTITION_END) {
				pivot = PARTITION_START;
				ARRAY_OF_OBJECTS[pivot].setPivot();
				updateActionTracker("Only one element in this partition: ", ARRAY_OF_OBJECTS[pivot].number);
				displayBars();
				if(keepHistory()) {
					saveAnimationState();
					_textHistory.push("Only one element in this partition: " + ARRAY_OF_OBJECTS[pivot].number);
				}
				state = "only_pivot";
			} else {
				pivot = Math.floor(Math.random() * (PARTITION_END - PARTITION_START+1) + PARTITION_START);
				ARRAY_OF_OBJECTS[pivot].setPivot();
				updateActionTracker("The random pivot is: ", ARRAY_OF_OBJECTS[pivot].number);
				displayBars();
				if(keepHistory()) {
					saveAnimationState();
					_textHistory.push("The random pivot is: " + ARRAY_OF_OBJECTS[pivot].number);
				}
				if(pivot == 0) {
					partition_selected = PARTITION_START;
					pivot = partition_selected;
					partition_selected++;
					state = "sort_partition";
				} else (
					state = "select_first_element"
				)
			}
			frame_id = requestAnimationFrame(animate);
		}, 1000 - (animationSpeed()*100));
	}
	
	else if (state == "only_pivot") {
		setTimeout(function() {
			if(isPaused){return;}
			ARRAY_OF_OBJECTS[pivot].setSorted();
			updateActionTracker("Only one element in this partition: ", ARRAY_OF_OBJECTS[pivot].number + " is sorted");
			displayBars();
			if(keepHistory()) {
					saveAnimationState();
					_textHistory.push("Only one element in this partition: " + ARRAY_OF_OBJECTS[pivot].number + " is sorted");
				}
			state = "wait";
			next_state = "make_partitions";
			frame_id = requestAnimationFrame(animate);
		}, 1000 - (animationSpeed()*100));
	}
	
	else if (state == "select_first_element") {
		setTimeout(function() {
			if(isPaused){return;}
			ARRAY_OF_OBJECTS[PARTITION_START].setRead();
			updateActionTracker("First element selected: ", ARRAY_OF_OBJECTS[PARTITION_START].number);
			if(keepHistory()) {
				saveAnimationState();
				_textHistory.push("First element selected: " + ARRAY_OF_OBJECTS[PARTITION_START].number);
			}
			displayBars();
			state = "put_pivot_first"
			frame_id = requestAnimationFrame(animate);
			partition_selected = PARTITION_START;
		}, 300);
	}
	
	else if (state == "put_pivot_first") {
		setTimeout(function() {
			if(isPaused){return;}
			updateActionTracker("Swap: ", ARRAY_OF_OBJECTS[partition_selected].number + " is being swapped with the pivot " + ARRAY_OF_OBJECTS[pivot].number);
			var toX = initial_positions[partition_selected];
			var fromX = initial_positions[pivot];
			var speed = animationSpeed();
			
			if(ARRAY_OF_OBJECTS[pivot].x > toX) {
				ARRAY_OF_OBJECTS[pivot].left(speed);
				ARRAY_OF_OBJECTS[partition_selected].right(speed);
				if(ARRAY_OF_OBJECTS[pivot].x < toX) {
					ARRAY_OF_OBJECTS[pivot].setX(toX);
					ARRAY_OF_OBJECTS[partition_selected].setX(fromX);
				}
			}
			
			if(keepHistory()) {
				saveAnimationState();
				_textHistory.push("Swap: " + ARRAY_OF_OBJECTS[partition_selected].number + " is being swapped with the pivot " + ARRAY_OF_OBJECTS[pivot].number);
			}
			
			if(ARRAY_OF_OBJECTS[pivot].x == toX) {
				ARRAY_OF_OBJECTS[pivot].setX(fromX);
				ARRAY_OF_OBJECTS[partition_selected].setX(toX);
				swapBars(ARRAY_OF_OBJECTS[pivot],ARRAY_OF_OBJECTS[partition_selected]);
				ARRAY_OF_OBJECTS[pivot].setUnsorted();
				ARRAY_OF_OBJECTS[partition_selected].setPivot();
				pivot = partition_selected;
				partition_selected++;
				state = "sort_partition";
			}
			
			
			displayBars();
			frame_id = requestAnimationFrame(animate);
			
		}, 10);
	}
	
	else if (state == "sort_partition") {
		setTimeout(function() {
			if(isPaused){return;}
			if(partition_state == "select_element") {
				ARRAY_OF_OBJECTS[partition_selected].setRead();
				partition_state = "select_element_result";
				updateActionTracker("Selection: ", ARRAY_OF_OBJECTS[partition_selected].number + " is being compared to the pivot " + ARRAY_OF_OBJECTS[pivot].number);
				if(keepHistory()) {
					saveAnimationState();
					_textHistory.push("Selection: " + ARRAY_OF_OBJECTS[partition_selected].number + " is being compared to the pivot " + ARRAY_OF_OBJECTS[pivot].number);
				}
			}
			else if (partition_state == "select_element_result") {
				if(ARRAY_OF_OBJECTS[partition_selected].number >= ARRAY_OF_OBJECTS[pivot].number) {
					ARRAY_OF_OBJECTS[partition_selected].setWritten();
					bigger_found = true;
				} else {
					ARRAY_OF_OBJECTS[partition_selected].setSmaller();
					smaller_found = true;
				}
				
				first_bigger = getFirstBigger(PARTITION_START,partition_selected);
				last_smaller = getLastSmaller(PARTITION_START,partition_selected);
				
				if(keepHistory()) {
					saveAnimationState();
					_textHistory.push("Selection: " + ARRAY_OF_OBJECTS[partition_selected].number + " was compared to the pivot " + ARRAY_OF_OBJECTS[pivot].number);
				}
				
				if(smaller_found && bigger_found && last_smaller > first_bigger) {
						state = "partition_swap";
						swap_element1 = getFirstBigger(PARTITION_START,partition_selected);
						swap_element2 = getLastSmaller(PARTITION_START,partition_selected);
				} else {
					partition_selected++;
					partition_state = "select_element";
				}
				
				
			}
			
			displayBars();
			
			if(partition_selected > PARTITION_END) {
				swap_element2 = getLastSmaller(PARTITION_START,partition_selected-1);
				swap_element1 = pivot;
				state = "wait";
				next_state = "pivot_fix";
			}
			
			frame_id = requestAnimationFrame(animate);
		}, 1000 - (animationSpeed()*100));
	}
	
	else if (state == "partition_swap") {
		setTimeout(function() {
			if(isPaused){return;}
			updateActionTracker("Swap: ", ARRAY_OF_OBJECTS[swap_element1].number + " is being swapped with " + ARRAY_OF_OBJECTS[swap_element2].number);
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
			
			if(keepHistory()) {
				saveAnimationState();
				_textHistory.push("Swap: " + ARRAY_OF_OBJECTS[swap_element1].number + " is being swapped with " + ARRAY_OF_OBJECTS[swap_element2].number);
			}
			
			if(ARRAY_OF_OBJECTS[swap_element2].x == toX) {
				ARRAY_OF_OBJECTS[swap_element2].setX(fromX);
				ARRAY_OF_OBJECTS[swap_element1].setX(toX);
				swapBars(ARRAY_OF_OBJECTS[swap_element2],ARRAY_OF_OBJECTS[swap_element1]);
				ARRAY_OF_OBJECTS[swap_element2].setWritten();
				ARRAY_OF_OBJECTS[swap_element1].setSmaller();
				partition_selected++;
				first_bigger++;
				partition_state = "select_element";
				state = "sort_partition";
			}
			
			displayBars();
			
			if(partition_selected > PARTITION_END) {
				swap_element2 = getLastSmaller(PARTITION_START,partition_selected-1);
				swap_element1 = pivot;
				state = "wait";
				next_state = "pivot_fix";
			}
			
			frame_id = requestAnimationFrame(animate);
		}, 10);
	}
	
	else if (state == "wait") {
		setTimeout(function() {
			if(isPaused){return;}
			state = next_state;
			frame_id = requestAnimationFrame(animate);
		}, 1500 - (animationSpeed()*150));
	}
	
	else if (state == "pivot_fix") {
		setTimeout(function() {
			if(isPaused){return;}
			updateActionTracker("Swap: ", "The pivot " + ARRAY_OF_OBJECTS[swap_element1].number + " is being moved to its sorted position");
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
			
			if(keepHistory()) {
				saveAnimationState();
				_textHistory.push("Swap: " + "The pivot " + ARRAY_OF_OBJECTS[swap_element1].number + " is being moved to its sorted position");
			}
			
			if(ARRAY_OF_OBJECTS[swap_element2].x == toX) {
				ARRAY_OF_OBJECTS[swap_element2].setX(fromX);
				ARRAY_OF_OBJECTS[swap_element1].setX(toX);
				swapBars(ARRAY_OF_OBJECTS[swap_element2],ARRAY_OF_OBJECTS[swap_element1]);
				for(var i = PARTITION_START; i <= PARTITION_END; i++) {
					if(i == swap_element2) {
						ARRAY_OF_OBJECTS[swap_element2].setSorted();
					} else {
						ARRAY_OF_OBJECTS[i].setUnsorted();
					}
				}
				state = "wait";
				next_state = "make_partitions";
				if(keepHistory()) {
					saveAnimationState();
					_textHistory.push("Swap: " + "The pivot " + ARRAY_OF_OBJECTS[swap_element2].number + " is now sorted");
				}
			}
			
			displayBars();
			
			frame_id = requestAnimationFrame(animate);
		}, 10);
		
	}
	
	else if (state == "make_partitions") {
		if(isPaused){return;}
		PARTITION_START = getNextPartitionStart(); 
		
		updateActionTracker
		
		/* end the recursion if sorted */
		if(PARTITION_START == -1) {
			updateActionTracker("Animation finished: ", "Displaying the sorted array");
			document.getElementById("runAnimation").disabled = true;
			document.getElementById("selected_animation_progress").innerHTML = "Animation: Finished";
			if(keepHistory()) {
				saveAnimationState();
				_textHistory.push("Animation finished: " + "Displaying the sorted array");
				toggleHistoryPlayer();
			}
			return;
		}
		
		PARTITION_END = getNextPartitionEnd(PARTITION_START)-1;
		if(PARTITION_END < PARTITION_START) {
			PARTION_END = PARTITION_START;
		}
		
		updateActionTracker("New partition:", " The next partition to sort is " + (PARTITION_START+1) + " to " + (PARTITION_END+1));
		if(keepHistory()) {
			saveAnimationState();
			_textHistory.push("New partition:" + " The next partition to sort is " + (PARTITION_START+1) + " to " + (PARTITION_END+1));
		}

		state = "wait";
		next_state = "select_pivot";
		partition_state = "select_element" 
		frame_id = requestAnimationFrame(animate);
	}
}

/**
 * Returns the first element that is bigger and already compared to the pivot
 *
 * @param {number} start Partition start index
 * @param {number} end Partition end index
 * @returns {number} i Element index
 */
function getFirstBigger(start, end) {
	for(var i = start; i <= end; i++) {
		if(ARRAY_OF_OBJECTS[pivot].number < ARRAY_OF_OBJECTS[i].number) {
			return i;
		}
	}
}

/**
 * Returns the index of the last element that is smaller and already compared to the pivot
 *
 * @param {number} start Partition start index
 * @param {number} end Partition end index
 * @returns {number} last_smaller Element index
 */
function getLastSmaller(start, end) {
	var last_smaller;
	for(var i = start; i <= end; i++) {
		if(ARRAY_OF_OBJECTS[pivot].number >= ARRAY_OF_OBJECTS[i].number) {
			last_smaller = i;
		}
	}
	return last_smaller;
}

/**
 * Returns the first unsorted element in the array
 *
 * @param {number} start Partition start index
 * @param {number} end Partition end index
 * @returns {number} i Element index
 */
function getNextPartitionStart() {
	for(var i = 0; i < ARRAY_OF_OBJECTS.length; i++) {
		if(ARRAY_OF_OBJECTS[i].status == "unsorted") {
			return i;
		}
	}
	return -1;
}

/**
 * Returns the end index of the next partition
 *
 * @param {number} start Partition start index
 * @param {number} end Partition end index
 * @returns {number} i Element index
 */
function getNextPartitionEnd(start) {
	for(var i = start; i < ARRAY_OF_OBJECTS.length; i++) {
		if(ARRAY_OF_OBJECTS[i].status == "sorted") {
			return i;
		}
	}
	return ARRAY_OF_OBJECTS.length;
}

/* END OF FILE */