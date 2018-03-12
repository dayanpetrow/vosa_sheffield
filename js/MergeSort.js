/* copyright information:
FILE: MergeSort.js
AUTHOR: Dayan Petrov
UNIVERSITY: The University of Sheffield
WEB: dissertation.dayanpetrow.eu
DESCRIPTION: MergeSort Visualisation
LAST UPDATED: 28-04-2017
*/

/* VARIABLES */
var NUMBER_FLOOR = 100; /* means that 99 is the maximum possible number when generating input */
var initial_xs = [];
var merged_order = [];
var top_counter = 0;
var bottom_counter = 0;
var isPaused = false;
var display = true;
var state = "select_partition";
var _history = [];
var _textHistory = [];
var _countingHistory = [];
var partition_size = 2;
var PARTITION_START = 0;
var PARTITION_END;
var left_selected = 0;
var right_selected = 0;
var move_element = 0;
var local_partition_size = 0;
var iteration_partition_size = 2;
var initial_right = 0;
var frame_id, frame_id2;
var simulation_counter = 0;
var toY = 0;
var toX = 0;
var END_OF_ITERATION_OBJECTS = [];

/* generate random input by default */
generateRandomArray();

/**
 * Reset MergeSort Animation
 */
function resetAnimation() {
	clear();
	isPaused = true;
	initial_xs = [];
	merged_order = [];
	top_counter = 0;
	bottom_counter = 0;
	display = true;
	state = "select_partition";
	_history = [];
	_textHistory = [];
	_countingHistory = [];
	partition_size = 2;
	PARTITION_START = 0;
	PARTITION_END;
	left_selected = 0;
	right_selected = 0;
	move_element = 0;
	local_partition_size = 0;
	iteration_partition_size = 2;
	initial_right = 0;
	toY = 0;
	toX = 0;
	height_multiplier = 4;
	top_display_padding = 0;
	top_text_padding = 450;
	END_OF_ITERATION_OBJECTS = [];
	document.getElementById("runAnimation").disabled = true; /* the play button becomes unclickable as input needs to be selected first */
	document.getElementById("selected_animation_progress").innerHTML = "Animation: Not started";
	document.getElementById("selected_array_type").style.display="none";
	clearDisabled("set_array_size");
	clearDisabled("array_size_quantity");
	return;
}

/**
 * Run HeapSort Animation
 */
function runAnimation() {
	disableButton("set_array_size");
	disableButton("array_size_quantity");
	if(display) {
		mergeDisplay();
		display = false;
		if(keepHistory()) {
			saveAnimationState();
			_textHistory.push("Displaying the initial array");
		}
	}
	isPaused = false;
	animate();
}

/**
 * MergeSort animation controller
 */
function animate() {
	if(isPaused){return;}
	if(state == "select_partition") {
		setTimeout(function() {
			if(isPaused){return;}
			PARTITION_START = top_counter;
			PARTITION_END = PARTITION_START + partition_size - 1;
			if (PARTITION_END >= ARRAY_OF_OBJECTS.length) {
				PARTITION_END = ARRAY_OF_OBJECTS.length-1;
			}
			
			//console.log("Partition end: " + PARTITION_END);
			
			for(var i = 0; i < ARRAY_OF_OBJECTS.length; i++) {
				if(i < PARTITION_START || i > PARTITION_END) {
					ARRAY_OF_OBJECTS[i].setOpacity(0.2);
				} else {
					ARRAY_OF_OBJECTS[i].setOpacity(1);
				}
			}
			
			updateActionTracker("Selected partition: ", "A partition to be sorted has been selected");
			if(keepHistory()) {
				saveAnimationState();
				_textHistory.push("Selected partition: " + "A partition to be sorted has been selected");
			}
			left_selected = PARTITION_START;
			right_selected = PARTITION_START + (partition_size/2);
			
			displayBars();
			
			//console.log("Partition is formed: " + (PARTITION_START) + " to " + (PARTITION_END));
			//console.log("Left: " + left_selected + " and right: " + right_selected);
			state = "select_elements";
			
			if((PARTITION_END-PARTITION_START)+1 < partition_size) {
				if(PARTITION_END == PARTITION_START) {
					state = "single_element";
				} else {
					if(right_selected > PARTITION_END) {
						right_selected = PARTITION_END;
					}
				}
				partition_size = PARTITION_END-PARTITION_START+1;
			}
			initial_right = right_selected;
			frame_id = requestAnimationFrame(animate);
		}, 1500 - animationSpeed()*150);
	}
	
	else if(state == "single_element") {
		setTimeout(function() {
			if(isPaused){return;}
			updateActionTracker("One element: ", "Elements in partitions of size 1 are sorted");
			ARRAY_OF_OBJECTS[PARTITION_START].setWritten();
			if(keepHistory()) {
				saveAnimationState();
				_textHistory.push("One element: " + "Elements in partitions of size 1 are sorted");
			}
			pushToTemp(ARRAY_OF_OBJECTS[PARTITION_START]);
			state = "end_iteration";
			displayBars();
			frame_id = requestAnimationFrame(animate);
		}, 1500 - animationSpeed()*150);
	}
	
	else if (state == "select_elements") {
		setTimeout(function() {
			if(isPaused){return;}
			updateActionTracker("Composing partitions: ", "The starts of the composing partitions have been selected");
			ARRAY_OF_OBJECTS[left_selected].setRead();
			ARRAY_OF_OBJECTS[right_selected].setRead();
			if(keepHistory()) {
				saveAnimationState();
				_textHistory.push("Composing partitions: " + "The starts of the composing partitions have been selected");
			}
			displayBars();
			state = "compare_elements";
			frame_id = requestAnimationFrame(animate);
		}, 1500 - animationSpeed()*150);
	}
	
	else if (state == "compare_elements") {
		setTimeout(function() {
			if(isPaused){return;}
			updateActionTracker("Selection: ", "Looking for the next element to move down");
			if(left_selected < right_selected) {
				if(right_selected > PARTITION_END || ARRAY_OF_OBJECTS[right_selected] == undefined) {
					move_element = left_selected;
					left_selected++;
				}
				else if (ARRAY_OF_OBJECTS[left_selected].number <= ARRAY_OF_OBJECTS[right_selected].number && !(left_selected >= initial_right)) {
					move_element = left_selected;
					left_selected++;
				}
				else if (ARRAY_OF_OBJECTS[left_selected].number > ARRAY_OF_OBJECTS[right_selected].number) {
					move_element = right_selected;
					right_selected++;
				}
				else if (left_selected >= initial_right) {
					move_element = right_selected;
					right_selected++;
				} else {
					console.log("Are all logical cases covered?");
				}
			
			} else {
				move_element = right_selected;
				right_selected++;
				//console.log("Selected right 2");
			}
			state = "move_element_down";
			ARRAY_OF_OBJECTS[move_element].setWritten();
			toX = initial_xs[bottom_counter];
			toY = ARRAY_OF_OBJECTS[move_element].y+220;
			if(keepHistory()) {
				saveAnimationState();
				_textHistory.push("Selection: " + "Looking for the next element to move down");
			}
			displayBars();
			frame_id = requestAnimationFrame(animate);
		}, 1500 - animationSpeed()*150);
	}
	
	else if (state == "move_element_down") {
		setTimeout(function() {
			if(isPaused){return;}
			updateActionTracker("Merge: ", "Composing partitions are being merged");
			var speed = animationSpeed()*2;
			//console.log("moving " + ARRAY_OF_OBJECTS[move_element].number);
			if(ARRAY_OF_OBJECTS[move_element].x < toX) {
				ARRAY_OF_OBJECTS[move_element].moveRight(speed);
				if(ARRAY_OF_OBJECTS[move_element].x > toX) {
					ARRAY_OF_OBJECTS[move_element].x = toX;
				}
			}
			if(ARRAY_OF_OBJECTS[move_element].y < toY) {
				ARRAY_OF_OBJECTS[move_element].moveDown(speed);
				if(ARRAY_OF_OBJECTS[move_element].y > toY) {
					ARRAY_OF_OBJECTS[move_element].y = toY;
				}
			}
			if(ARRAY_OF_OBJECTS[move_element].x > toX) {
				ARRAY_OF_OBJECTS[move_element].moveLeft(speed);
				if(ARRAY_OF_OBJECTS[move_element].x < toX) {
					ARRAY_OF_OBJECTS[move_element].x = toX;
				}
			}
			
			if(ARRAY_OF_OBJECTS[move_element].x == toX && ARRAY_OF_OBJECTS[move_element].y == toY) {
				//console.log("Bottom counter: " + bottom_counter + " Elements: " + merged_order);
				merged_order.push(move_element);
				bottom_counter++;
				state = "compare_elements";
				
				//console.log(right_selected, PARTITION_END);
				if(right_selected > PARTITION_END && left_selected >= initial_right) {
					state = "move_element_up";
					toX = initial_xs[top_counter];
					toY = ARRAY_OF_OBJECTS[merged_order[top_counter]].y - 220;
				}
			}
			
			if(keepHistory()) {
				saveAnimationState();
				_textHistory.push("Merge: " + "Composing partitions are being merged");
			}
			
			displayBars();
			frame_id = requestAnimationFrame(animate);
		}, 1);
	}
	
	else if (state == "move_element_up") {
		setTimeout(function() {
			if(isPaused){return;}
			updateActionTracker("Translate: ", "Elements are being moved back to the array");
			var speed = animationSpeed()*2;

			if(ARRAY_OF_OBJECTS[merged_order[top_counter]].x < toX) {
				ARRAY_OF_OBJECTS[merged_order[top_counter]].moveRight(speed);
				if(ARRAY_OF_OBJECTS[merged_order[top_counter]].x > toX) {
					ARRAY_OF_OBJECTS[merged_order[top_counter]].x = toX;
				}
			}
			if(ARRAY_OF_OBJECTS[merged_order[top_counter]].y > toY) {
				ARRAY_OF_OBJECTS[merged_order[top_counter]].moveUp(speed);
				if(ARRAY_OF_OBJECTS[merged_order[top_counter]].y < toY) {
					ARRAY_OF_OBJECTS[merged_order[top_counter]].y = toY;
				}
			}
			if(ARRAY_OF_OBJECTS[merged_order[top_counter]].x > toX) {
				ARRAY_OF_OBJECTS[merged_order[top_counter]].moveLeft(speed);
				if(ARRAY_OF_OBJECTS[merged_order[top_counter]].x < toX) {
					ARRAY_OF_OBJECTS[merged_order[top_counter]].x = toX;
				}
			}
			
			if(ARRAY_OF_OBJECTS[merged_order[top_counter]].x == toX && ARRAY_OF_OBJECTS[merged_order[top_counter]].y == toY) {
				pushToTemp(ARRAY_OF_OBJECTS[merged_order[top_counter]]);
				top_counter++;
				//console.log("moved_up");
				
				if(top_counter > PARTITION_END) {
					//console.log("top_sorted");
					state = "select_partition";
					if(top_counter == ARRAY_OF_OBJECTS.length) {
						state = "end_iteration";
					}
				} else {
					state = "move_element_up";
					toX = initial_xs[top_counter];
					//console.log(merged_order, top_counter);
					toY = ARRAY_OF_OBJECTS[merged_order[top_counter]].y - 220;
				}
				
				//console.log("Top counter: " + top_counter);
			}
			
			if(keepHistory()) {
				saveAnimationState();
				_textHistory.push("Translate: " + "Elements are being moved back to the array");
			}
			displayBars();
			frame_id = requestAnimationFrame(animate);
		}, 1);
	}
	
	else if (state == "end_iteration") {
		setTimeout(function() {
			if(isPaused){return;}
			fixElements();
			updateActionTracker("Display: ", "End of iteration");
			for(var i = 0; i < ARRAY_OF_OBJECTS.length; i++) {
				ARRAY_OF_OBJECTS[i].setOpacity(1);
				ARRAY_OF_OBJECTS[i].setUnsorted();
			}
			if(keepHistory()) {
				saveAnimationState();
				_textHistory.push("Display: " + "End of iteration");
			}
			displayBars();
			top_counter = 0;
			bottom_counter = 0;
			merged_order = [];
			iteration_partition_size = iteration_partition_size*2;
			partition_size = iteration_partition_size;
			state = "select_partition";
			if(partition_size >= ARRAY_OF_OBJECTS.length*2) {
				updateActionTracker("Animation finished: ","Displaying the sorted array");
				document.getElementById("runAnimation").disabled = true;
				document.getElementById("selected_animation_progress").innerHTML = "Animation: Finished";
				for(var i = 0; i < ARRAY_OF_OBJECTS.length; i++) {
					ARRAY_OF_OBJECTS[i].setOpacity(1);
					ARRAY_OF_OBJECTS[i].setSorted();
				}
				displayBars();
				if(keepHistory()) {
					saveAnimationState();
					_textHistory.push("Displaying the sorted array");
					toggleHistoryPlayer();
				}
				return;
			}
			frame_id = requestAnimationFrame(animate);
		},1500 - animationSpeed()*150);
	}
	
}

/**
 * Clone a Bar object to a preset array
 *
 * @param {number} _obj The current ARRAY_OF_OBJECTS
 */
function pushToTemp(_obj) {
	var temp_bar = JSON.parse(JSON.stringify(_obj));
	END_OF_ITERATION_OBJECTS.push(new Bar(temp_bar.number,temp_bar.width, 
			temp_bar.x, temp_bar.y, temp_bar.opacity, temp_bar.status));
}

/**
 * Clone the content of the temporary storage to ARRAY_OF_OBJECTS
 *
 */
function fixElements() {
	ARRAY_OF_OBJECTS = []
	var jsonArray = JSON.parse(JSON.stringify(END_OF_ITERATION_OBJECTS));
	END_OF_ITERATION_OBJECTS = [];
	for(i=0; i<jsonArray.length; i++) {
		ARRAY_OF_OBJECTS.push(new Bar(jsonArray[i].number, jsonArray[i].width, 
			jsonArray[i].x, jsonArray[i].y, jsonArray[i].opacity, jsonArray[i].status));
	}
}

/**
 * EvenListener for input element with id="set_array_size"
 */
document.getElementById("set_array_size").addEventListener("click", function() {
	var size = document.getElementById("array_size_quantity").value;
	if (!isNaN(size) && parseInt(size) >= 5 && parseInt(size) <=32) {
		clearSelected("large_size");
		clearSelected("mid_size");
		clearSelected("small_size");
		clearSelected("custom_size");
		arraySize = size;
		place = arraySize-1;
		unsorted = arraySize-1;
		document.getElementById("selected_array_size").innerHTML = "Array size: " + arraySize;
		console.log("HeapSort: Array size is set to " + arraySize);
	} else {
		console.log("Invalid input for array size");
	}
});

/* END OF FILE */