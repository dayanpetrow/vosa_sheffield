/* copyright information:
FILE: HeapSort.js
AUTHOR: Dayan Petrov
UNIVERSITY: The University of Sheffield
WEB: dissertation.dayanpetrow.eu
DESCRIPTION: HeapSort Visualisation
LAST UPDATED: 28-04-2017
*/

/* VARIABLES */
var place = arraySize-1;
var unsorted = arraySize-1;
var state = "max-heapify";
var max_heapify_state = "select_element";
var bigger_child, sibling, _parent;
var child_found = false;
var isPlaced;
var parent_swap, child_swap;
var max_heapify = false;
var remove_root = false;
var simulation_counter = 0;
var idframe;
var idframe2;
var save_initial = true;
var first_run = true;

/**
 * Reset HeapSort Animation
 */
function resetAnimation() {
	clear();
	place = arraySize-1;
	unsorted = arraySize-1;
	state = "max-heapify";
	max_heapify_state = "select_element";
	bigger_child, sibling, _parent;
	child_found = false;
	isPlaced;
	parent_swap, child_swap;
	max_heapify = false;
	remove_root = false;
	first_run = true;
	arraySize = 31;
	ARRAY_OF_HEAPS = [];
	ARRAY_OF_HEAPBOXES = [];
	ARRAY_OF_NUMBERS = [];
	CONNECTIONS = [];
	box_positions = [];
	_heaps_history = [];
	_connections_history = [];
	_boxes_history = [];
	_text_history = [];
	isPaused = true;
	save_initial = true;
	document.getElementById("runAnimation").disabled = true; 
	document.getElementById("selected_animation_progress").innerHTML = "Animation: Not started";
	document.getElementById("selected_array_type").style.display="none";
	document.getElementById("selected_array_size").innerHTML = "Array size: " + arraySize;
	return;
}

/**
 * Run HeapSort Animation
 */
function runAnimation() {
	isPaused = false;
	if(first_run) {
		place = ARRAY_OF_HEAPS.length-1;
		unsorted = ARRAY_OF_HEAPS.length-1;
		arraySize = ARRAY_OF_HEAPS.length;
		document.getElementById("array_size_quantity").value = arraySize;
		first_run = false;
	}
	if(keepHistory() && save_initial) {
		saveScene();
		save_initial = false;
	}
	document.getElementById("selected_animation_progress").style.display="block";
	document.getElementById("selected_animation_progress").innerHTML = "Animation: In progress";
	document.getElementById("visual_history").disabled = true;
	animate();
}

/**
 * HeapSort Animation controller
 */
function animate() {
	if(isPaused) {return;}
	
	if(state == "max-heapify") {
		
		setTimeout( function() {
			if(place >= 0) {
				//select element
				if(max_heapify_state == "select_element") {
					updateActionTracker("Max-heapify: ", ARRAY_OF_HEAPS[place].number + " is selected");
					ARRAY_OF_HEAPS[place].setSelected();
					ARRAY_OF_HEAPBOXES[place].setSelected();
					if(keepHistory()) {
						saveScene();
						_text_history.push("Max-heapify: " + ARRAY_OF_HEAPS[place].number + " is selected");
					}
					displayScene();
					max_heapify_state = "select_sibling";
				}

				//if the element is not the root run the max-heapify function
				else if(ARRAY_OF_HEAPS[place]._parent != undefined) {
					sibling = getSibling(place);
					_parent = ARRAY_OF_HEAPS[place]._parent;
					
					//get the bigger child, or the only child
					if(ARRAY_OF_HEAPS[sibling] != undefined) {
						if(!child_found) {
							if (max_heapify_state == "select_sibling") {
								updateActionTracker("Max-heapify: ", ARRAY_OF_HEAPS[place].number + " is being compared to its sibling " + ARRAY_OF_HEAPS[sibling].number);
								ARRAY_OF_HEAPS[sibling].setSelected();
								ARRAY_OF_HEAPBOXES[sibling].setSelected();
								if(keepHistory()) {
									saveScene();
								}
								displayScene();
								max_heapify_state = "compare_siblings";
							} else if (max_heapify_state == "compare_siblings") {
								if (ARRAY_OF_HEAPS[place].number >= ARRAY_OF_HEAPS[sibling].number) {
									updateActionTracker("Max-heapify: ", ARRAY_OF_HEAPS[place].number + " is the bigger sibling");
									ARRAY_OF_HEAPS[sibling].setNormal();
									ARRAY_OF_HEAPBOXES[sibling].setNormal();
									bigger_child = place;
								} else {
									updateActionTracker("Max-heapify: ", ARRAY_OF_HEAPS[sibling].number + " is the bigger sibling");
									ARRAY_OF_HEAPS[place].setNormal();
									ARRAY_OF_HEAPBOXES[place].setNormal();
									bigger_child = sibling;
								}
								child_found = true;
								if(keepHistory()) {
									saveScene();
								}
								displayScene();
								max_heapify_state = "select_parent";
							}
						}
					} else if (ARRAY_OF_HEAPS[sibling] == undefined && max_heapify_state != "compare_parent" ) {
						child_found = true;
						bigger_child = place;
						max_heapify_state = "select_parent";
					}
					
					if(child_found) {
						if(max_heapify_state == "select_parent") {
							updateActionTracker("Max-heapify: ", ARRAY_OF_HEAPS[bigger_child].number + " is being compared to its parent " + ARRAY_OF_HEAPS[_parent].number);
							ARRAY_OF_HEAPS[_parent].setSelected();
							ARRAY_OF_HEAPBOXES[_parent].setSelected()
							if(keepHistory()) {
								saveScene();
							}
							displayScene();
							max_heapify_state = "compare_parent";
						}
						else if (max_heapify_state == "compare_parent") {
							if(ARRAY_OF_HEAPS[_parent].number >= ARRAY_OF_HEAPS[bigger_child].number) {
								child_found = false
								isPlaced = true;
								if(place % 2 == 0) {
									place = place - 2;
								} else {
									place = place - 1;
								}
								updateActionTracker("Max-heapify: ", "No swap is needed in this heap");
								max_heapify_state = "select_element";
								ARRAY_OF_HEAPS[_parent].setNormal();
								ARRAY_OF_HEAPS[bigger_child].setNormal();
								ARRAY_OF_HEAPBOXES[_parent].setNormal();
								ARRAY_OF_HEAPBOXES[bigger_child].setNormal();
								if(keepHistory()) {
									saveScene();
								}
								displayScene();
							} else {
								updateActionTracker("Max-heapify: ", ARRAY_OF_HEAPS[bigger_child].number + " is bigger than its parent thus a swap is required");
								parent_swap = _parent;
								child_swap = bigger_child;
								state = "wait";
								if(keepHistory()) {
									saveScene();
								}
								displayScene();
							}
						}
					}
							
				} else {
					//console.log("Max-Heapfiy finished.");
					updateActionTracker("Max-heapify: ", " Max-heapify completed");
					remove_root = true;
					max_heapify = true;
					state = "remove_root";
					ARRAY_OF_HEAPS[place].setNormal();
					ARRAY_OF_HEAPBOXES[place].setNormal();
					if(keepHistory()) {
						saveScene();
					}
					displayScene();
				}	
			}
			if(isPaused) {return;}
			idframe = requestAnimationFrame(animate);
		}, 1500-getSpeed()*150);
	} 
	
	else if (state == "wait") {
		setTimeout(function() {
			state = "swap";
			if(isPaused) {return;}
			idframe = requestAnimationFrame(animate);
		}, 1500-getSpeed()*150);
	}
	else if (state == "swap")  {
		setTimeout(function() {
			//controlling the swap movement
			updateActionTracker("Swap: ", ARRAY_OF_HEAPS[parent_swap].number + " and " + ARRAY_OF_HEAPS[child_swap].number + " are being swapped");
			ARRAY_OF_HEAPS[parent_swap].setSwap();
			ARRAY_OF_HEAPS[child_swap].setSwap();
			ARRAY_OF_HEAPBOXES[parent_swap].setSwap();
			ARRAY_OF_HEAPBOXES[child_swap].setSwap();

			var fromX = HEAP_POSITIONS[child_swap][0];
			var fromY = HEAP_POSITIONS[child_swap][1];
			var toX = HEAP_POSITIONS[parent_swap][0];
			var toY = HEAP_POSITIONS[parent_swap][1];
			var from_box = box_positions[child_swap];
			var to_box = box_positions[parent_swap];
			var speed = parseInt(getSpeed()/2);
			var box_speed_factor = 4

			/* moving the boxes */
			if(ARRAY_OF_HEAPBOXES[child_swap].x < to_box) {
				ARRAY_OF_HEAPBOXES[child_swap].moveRight(speed*box_speed_factor);
				ARRAY_OF_HEAPBOXES[parent_swap].moveLeft(speed*box_speed_factor);
				if(ARRAY_OF_HEAPBOXES[child_swap].x > to_box) {
					ARRAY_OF_HEAPBOXES[child_swap].x = to_box;
					ARRAY_OF_HEAPBOXES[parent_swap].x = from_box;
				}
			}
			
			if(ARRAY_OF_HEAPBOXES[child_swap].x > to_box) {
				ARRAY_OF_HEAPBOXES[child_swap].moveLeft(speed*box_speed_factor);
				ARRAY_OF_HEAPBOXES[parent_swap].moveRight(speed*box_speed_factor);
				if(ARRAY_OF_HEAPBOXES[child_swap].x < to_box) {
					ARRAY_OF_HEAPBOXES[child_swap].x = to_box;
					ARRAY_OF_HEAPBOXES[parent_swap].x = from_box;
				}
			}
			
			/* moving the heaps */
			if(ARRAY_OF_HEAPS[child_swap].square_x < toX) {
				ARRAY_OF_HEAPS[child_swap].moveRight(speed);
				ARRAY_OF_HEAPS[parent_swap].moveLeft(speed);
				if(ARRAY_OF_HEAPS[child_swap].square_x > toX) {
					ARRAY_OF_HEAPS[child_swap].square_x = toX;
					ARRAY_OF_HEAPS[parent_swap].square_x = fromX;
				}
			}
						
			if(ARRAY_OF_HEAPS[child_swap].square_y > toY) {
				ARRAY_OF_HEAPS[child_swap].moveUp(speed);
				ARRAY_OF_HEAPS[parent_swap].moveDown(speed);
				if(ARRAY_OF_HEAPS[child_swap].square_y < toY) {
					ARRAY_OF_HEAPS[child_swap].square_y = toY;
					ARRAY_OF_HEAPS[parent_swap].square_y = fromY;
				}
			}
			
			if(ARRAY_OF_HEAPS[child_swap].square_y < toY) {
				ARRAY_OF_HEAPS[child_swap].moveDown(speed);
				ARRAY_OF_HEAPS[parent_swap].moveUp(speed);
				if(ARRAY_OF_HEAPS[child_swap].square_y > toY) {
					ARRAY_OF_HEAPS[child_swap].square_y = toY;
					ARRAY_OF_HEAPS[parent_swap].square_y = fromY;
				}
			}
			
			if(ARRAY_OF_HEAPS[child_swap].square_x > toX) {
				ARRAY_OF_HEAPS[child_swap].moveLeft(speed);
				ARRAY_OF_HEAPS[parent_swap].moveRight(speed);
				if(ARRAY_OF_HEAPS[child_swap].square_x < toX) {
					ARRAY_OF_HEAPS[child_swap].square_x = toX;
					ARRAY_OF_HEAPS[parent_swap].square_x = fromX;
				}
			}
			
			if(keepHistory()) {
				saveScene();
			}
			displayScene();		
			
			/* boxes and heaps are swapped */
			if(ARRAY_OF_HEAPS[child_swap].square_x == toX && ARRAY_OF_HEAPS[child_swap].square_y == toY) {
				_text_history.push("Swap: ", ARRAY_OF_HEAPS[parent_swap].number + " and " + ARRAY_OF_HEAPS[child_swap].number + " were swapped");
				ARRAY_OF_HEAPS[child_swap].square_x = fromX;
				ARRAY_OF_HEAPS[parent_swap].square_x = toX;
				ARRAY_OF_HEAPS[child_swap].square_y = fromY;
				ARRAY_OF_HEAPS[parent_swap].square_y = toY;
				ARRAY_OF_HEAPBOXES[child_swap].x = from_box;
				ARRAY_OF_HEAPBOXES[parent_swap].x = to_box;
				swapheaps(ARRAY_OF_HEAPS[child_swap],ARRAY_OF_HEAPS[parent_swap]);
				swapheaps(ARRAY_OF_HEAPBOXES[child_swap],ARRAY_OF_HEAPBOXES[parent_swap]);
				
				
				if(keepHistory()) {
					saveScene();
				}
				displayScene();
				
				if(ARRAY_OF_HEAPS[child_swap].leftchild == undefined || unsorted < ARRAY_OF_HEAPS[child_swap].leftchild ) {
					ARRAY_OF_HEAPS[child_swap].setNormal();
					ARRAY_OF_HEAPS[parent_swap].setNormal();
					ARRAY_OF_HEAPBOXES[child_swap].setNormal();
					ARRAY_OF_HEAPBOXES[parent_swap].setNormal();
					isPlaced = true;
				}
				
				else {
					updateActionTracker("Further swap required: ", ARRAY_OF_HEAPS[parent_swap].number + " and " + ARRAY_OF_HEAPS[child_swap].number + " are being swapped");
					ARRAY_OF_HEAPS[child_swap].setNormal();
					ARRAY_OF_HEAPS[parent_swap].setNormal();
					ARRAY_OF_HEAPBOXES[child_swap].setNormal();
					ARRAY_OF_HEAPBOXES[parent_swap].setNormal();
					isPlaced = false;
					var new_leftchild = ARRAY_OF_HEAPS[child_swap].leftchild;
					var new_rightchild = ARRAY_OF_HEAPS[child_swap].rightchild;
					var new_bigger_child;
					
					if(ARRAY_OF_HEAPS[child_swap].rightchild == undefined ) {
						new_bigger_child = new_leftchild;
					} else if (ARRAY_OF_HEAPS[new_leftchild].number > ARRAY_OF_HEAPS[new_rightchild].number || 
									ARRAY_OF_HEAPS[child_swap].rightchild > unsorted ) {
						new_bigger_child = new_leftchild;
					} else {
						new_bigger_child = new_rightchild;
					}
					
					if(ARRAY_OF_HEAPS[child_swap].number < ARRAY_OF_HEAPS[new_bigger_child].number) {
						parent_swap = child_swap;
						child_swap = new_bigger_child;
					} else {
						isPlaced = true;
					}
				}
				
				if(isPlaced) {
					child_found = false;
					if(place % 2 == 0) {
						place = place - 2;
					} else {
						place = place - 1;
					}
					max_heapify_state = "select_element";
					if(!max_heapify) {
						state = "max-heapify";
					} else {
						state = "remove_root";
					}
				} else {
					state = "wait";
				}
				
				if(unsorted+1 < arraySize) {
					ARRAY_OF_HEAPS[unsorted+1].setSorted();
					ARRAY_OF_HEAPBOXES[unsorted+1].setSorted();
				}
				
			}	
			idframe = requestAnimationFrame(animate);
		}, 20-getSpeed()*2);
	}
	else if (state == "remove_root") {
		setTimeout(function() {
			updateActionTracker("Remove root: ", ARRAY_OF_HEAPS[0].number + " is the biggest element in the tree");
			ARRAY_OF_HEAPS[0].setSelected();
			ARRAY_OF_HEAPS[unsorted].setSelected();
			ARRAY_OF_HEAPBOXES[0].setSelected();
			ARRAY_OF_HEAPBOXES[unsorted].setSelected();
			parent_swap = unsorted;
			child_swap = 0;
			CONNECTIONS[unsorted].hide();
			if(keepHistory()) {
				saveScene();
			}
			unsorted = unsorted - 1;
			if(unsorted < 0) {
				//paste the test function here
				
				//to here
				
				if(unsorted+1 < arraySize) {
					ARRAY_OF_HEAPS[unsorted+1].setSorted();
					ARRAY_OF_HEAPBOXES[unsorted+1].setSorted();
				}
				displayScene();
				console.log("Animation finished");
				document.getElementById("runAnimation").disabled = true;
				updateActionTracker("Animation completed: ", "Displaying the sorted array");
				if(keepHistory()) {
					saveScene();
					toggleHistoryPlayer();
				}
				return;
			}
			state = "wait";
			displayScene();
			idframe = requestAnimationFrame(animate);
		}, 50);
	}
}

/**
 * Returns the sibling of a Heap object
 *
 * @param {number} number The index of the Heap object
 * @return {number} number The index of Heap object sibling
 */
function getSibling(number) {
	if(number % 2 == 0) {
		number = number-1;
	} else {
		number = place+1;
	}
	return number;
}

/**
 * Swap 2 Heap objects
 *
 * @param {Heap} heap1 Heap object to be swapped
 * @param {Heap} heap2 Second Heap object to be swapped
 */
function swapheaps(heap1,heap2) {
	var heap1_number = heap1.number;
	var heap2_number = heap2.number;
	heap1.setNumber(heap2_number);
	heap2.setNumber(heap1_number);
}

/* END OF FILE */