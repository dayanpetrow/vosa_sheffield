/* copyright information:
FILE: RadixSort.js
AUTHOR: Dayan Petrov
UNIVERSITY: The University of Sheffield
WEB: dissertation.dayanpetrow.eu
DESCRIPTION: RadixSort Visualisation
LAST UPDATED: 28-04-2017
*/

/* VARIABLES */
var k_iteration = 0;
var place = 0;
var selected_bucket = 0;
var state = 0;
var END_OF_ITERATION_RADIX = [];
var _history = [];
var _textHistory = [];
var save_initial = true;
var frame_id;

/* generate random input by default */
generateRandomArray();

/**
 * Reset RadixSort Animation
 */
function resetAnimation() {
	save_initial = true;
	place = 0;
	clear();
	BUCKETS = [];
	RADIX_OBJECTS = [];
	ARRAY_OF_NUMBERS = [];
	initial_xs = [];
	_textHistory = [];
	_history = [];
	END_OF_ITERATION_RADIX = [];
	state = 0;
	k_iteration = 0;
	selected_bucket = 0;
	isPaused = true;
	document.getElementById("runAnimation").disabled = true; /* the play button becomes unclickable as input needs to be selected first */
	document.getElementById("selected_animation_progress").innerHTML = "Animation: Not started";
	document.getElementById("selected_array_type").style.display="none";
	return;
}

/**
 * Run RadixSort Animation
 */
function runAnimation() {
	isPaused = false;
	if(keepHistory() && save_initial) {
		saveAnimationState();
		_textHistory.push("Displaying the initial array");
		save_initial = false;
	}
	document.getElementById("selected_animation_progress").style.display="block";
	document.getElementById("selected_animation_progress").innerHTML = "Animation: In progress";
	document.getElementById("visual_history").disabled = true;
	color_k_digit();
	animate();
}

/**
 * RadixSort animation controller
 */
function animate() {
	if(isPaused) {return;}
	
	if(state == 0) {
		setTimeout(function() {
			//returns the digit that corresponds to the k_iteration value 
			var current_digit = RADIX_OBJECTS[place].digits[RADIX_OBJECTS[place].digits.length-1-k_iteration];
			var toX = BUCKETS[current_digit].x+((bucket_width-radix_width)/2);
			var toY = BUCKETS[current_digit].y-15 - (BUCKETS[current_digit].indexes.length*25);
			var speed = parseInt(getSpeed());
			
			RADIX_OBJECTS[place].setSelected();
			updateActionTracker("BucketSort: ", "Moving " + RADIX_OBJECTS[place].number + " to bucket " + current_digit);
			
			if(RADIX_OBJECTS[place].x < toX) {
				RADIX_OBJECTS[place].moveRight(speed);
				if(RADIX_OBJECTS[place].x > toX) {
					RADIX_OBJECTS[place].x = toX;
				}
			}
			if(RADIX_OBJECTS[place].y < toY) {
				RADIX_OBJECTS[place].moveDown(speed);
				if(RADIX_OBJECTS[place].y > toY) {
					RADIX_OBJECTS[place].y = toY;
				}
			}
			if(RADIX_OBJECTS[place].x > toX) {
				RADIX_OBJECTS[place].moveLeft(speed);
				if(RADIX_OBJECTS[place].x < toX) {
					RADIX_OBJECTS[place].x = toX;
				}
			}
			
			if(RADIX_OBJECTS[place].x == toX && RADIX_OBJECTS[place].y == toY) {
				BUCKETS[current_digit].addIndex(place);
				RADIX_OBJECTS[place].setNormal();
				if(keepHistory()) {
					saveAnimationState();
					_textHistory.push("BucketSort: " + RADIX_OBJECTS[place].number + " is being moved to bucket " + current_digit);
				}
				place++;
			} else {
				if(keepHistory()) {
					saveAnimationState();
					_textHistory.push("BucketSort: " + RADIX_OBJECTS[place].number + " is being moved to bucket " + current_digit);
				}
			}
			
			
			displayScene();
			
			if(place == RADIX_OBJECTS.length) {
				place = 0; state = 1;
			}

			frame_id = requestAnimationFrame(animate);
		}, 1);
	} else {
		setTimeout( function() {
			if(BUCKETS[selected_bucket].indexes.length > 0) {
				var toX = initial_xs[place];
				var toY = 50;
				var speed = parseInt(getSpeed());
				var _element = BUCKETS[selected_bucket].indexes[0];
				
				updateActionTracker("Sorting: ", "Moving " + RADIX_OBJECTS[_element].number + " back to the array at index " + (place+1));
				
				if(RADIX_OBJECTS[_element].x < toX) {
					RADIX_OBJECTS[_element].moveRight(speed);
					if(RADIX_OBJECTS[_element].x > toX) {
						RADIX_OBJECTS[_element].x = toX;
					}
				}
				if(RADIX_OBJECTS[_element].y > toY) {
					RADIX_OBJECTS[_element].moveUp(speed);
					if(RADIX_OBJECTS[_element].y < toY) {
						RADIX_OBJECTS[_element].y = toY;
					}
				}
				if(RADIX_OBJECTS[_element].x > toX) {
					RADIX_OBJECTS[_element].moveLeft(speed);
					if(RADIX_OBJECTS[_element].x < toX) {
						RADIX_OBJECTS[_element].x = toX;
					}
				}
				
				if(RADIX_OBJECTS[_element].x == toX && RADIX_OBJECTS[_element].y == toY) {
					BUCKETS[selected_bucket].indexes.shift();
					if(k_iteration+1 == number_length) {
						RADIX_OBJECTS[_element].setSorted();
						RADIX_OBJECTS[_element].clearDigit();
					}
					if(keepHistory()) {
						saveAnimationState();
						_textHistory.push("Sorting: " + RADIX_OBJECTS[_element].number + " is being moved back to the array at index " + (place+1));
					}
					pushToTemp(_element);
					place++;
				} else {
					if(keepHistory()) {
						saveAnimationState();
						_textHistory.push("Sorting: " + RADIX_OBJECTS[_element].number + " is being moved back to the array at index " + (place+1));
					}
				}
					
				displayScene();
				
			} else {
				selected_bucket++;
			}
			

			if(place < RADIX_OBJECTS.length) {
				frame_id = requestAnimationFrame(animate);
			} else {
				fixElements();
				selected_bucket = 0;
				place = 0;
				state = 0;
				k_iteration++;
				color_k_digit();
				if(k_iteration == number_length) {
					document.getElementById("runAnimation").disabled = true;
					document.getElementById("selected_animation_progress").innerHTML = "Animation: Finished";
					if(keepHistory()) {
						saveAnimationState();
						_textHistory.push("Displaying the sorted array");
						toggleHistoryPlayer();
						
					}
					updateActionTracker("Animation completed: ", "Displaying the sorted array");
					for(var i=0; i<RADIX_OBJECTS.length; i++) {
						RADIX_OBJECTS[i].setSorted();
					}
					displayScene();
					
					return;
				}
				frame_id = requestAnimationFrame(animate);
			}
		}, 1);
	}
}

/**
 * Clone the content of the temporary storage to RADIX_OBJECTS
 *
 */
function fixElements() {
	RADIX_OBJECTS = []
	var jsonArray = JSON.parse(JSON.stringify(END_OF_ITERATION_RADIX));
	END_OF_ITERATION_RADIX = [];
	for(i=0; i<jsonArray.length; i++) {
		RADIX_OBJECTS.push(new Radix(jsonArray[i].number, jsonArray[i].digits, 
			jsonArray[i].x, jsonArray[i].y));
		RADIX_OBJECTS[RADIX_OBJECTS.length-1].setNormal();
		RADIX_OBJECTS[RADIX_OBJECTS.length-1].selected_digit = jsonArray[i].selected_digit;
	}
}

/**
 * Clone a Radix object to a preset array
 *
 * @param {number} _element The current RADIX_OBJECTS
 */
function pushToTemp(_element) {
	var temp_radix = JSON.parse(JSON.stringify(RADIX_OBJECTS[_element]));
	END_OF_ITERATION_RADIX.push(new Radix(temp_radix.number, temp_radix.digits, 
	temp_radix.x, temp_radix.y));
	END_OF_ITERATION_RADIX[END_OF_ITERATION_RADIX.length-1]._status = temp_radix._status;
	END_OF_ITERATION_RADIX[END_OF_ITERATION_RADIX.length-1].selected_digit = temp_radix.selected_digit;
}

/**
 * Creates new Radix objects from JSON array
 *
 * @param {array} _obj JSON array to be converted to Radix objects
 */
function convertJSONtoRadix(_obj) {
	var radixArray = []; var i;
	for(i=0; i<_obj.length; i++) {
		radixArray.push(new Radix(_obj[i].number, _obj[i].digits, 
			_obj[i].x, _obj[i].y));
		radixArray[radixArray.length-1]._status = _obj[i]._status;
		radixArray[radixArray.length-1].selected_digit = _obj[i].selected_digit;
	}
	return radixArray;
}

/* END OF FILE */


























