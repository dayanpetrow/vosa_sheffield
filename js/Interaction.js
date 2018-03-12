/* copyright information:
FILE: Interaction.js
AUTHOR: Dayan Petrov
UNIVERSITY: The University of Sheffield
WEB: dissertation.dayanpetrow.eu
DESCRIPTION: Functionality for any Bar animation page
LAST UPDATED: 28-04-2017
*/

/* GLOBAL VARIABLES */
var allowActionTracker = true;
var keepVisualHistory = false;

/**
 * Enable popovers
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
 * Event listener for button with id="small_size"
 *
 */
document.getElementById("small_size").addEventListener("click", function() {
	setArraySize(8);
	selected_button("small_size");
	clearSelected("mid_size");
	clearSelected("large_size");
	clearSelected("custom_size");
	clearSelected("nearlySortedArray");
	clearSelected("randomArray");
	clearSelected("sortedArray");
	clearSelected("revSortedArray");
	clearDisabled("randomArray");
	clearDisabled("nearlySortedArray");
	clearDisabled("revSortedArray");
	clearDisabled("sortedArray");
	console.log("Array size: 8");
	document.getElementById("custom_input_block").style.display = "none";
});

/**
 * Event listener for button with id="mid_size"
 *
 */
document.getElementById("mid_size").addEventListener("click", function() {
	setArraySize(16);
	selected_button("mid_size");
	clearSelected("small_size");
	clearSelected("large_size");
	clearSelected("custom_size");
	clearSelected("nearlySortedArray");
	clearSelected("randomArray");
	clearSelected("sortedArray");
	clearSelected("revSortedArray");
	clearDisabled("randomArray");
	clearDisabled("nearlySortedArray");
	clearDisabled("revSortedArray");
	clearDisabled("sortedArray");
	console.log("Array size: 16");
	document.getElementById("custom_input_block").style.display = "none";
});

/**
 * Event listener for button with id="large_size"
 *
 */
document.getElementById("large_size").addEventListener("click", function() {
	setArraySize(32);
	clearSelected("nearlySortedArray");
	clearSelected("randomArray");
	clearSelected("sortedArray");
	clearSelected("revSortedArray");
	selected_button("large_size");
	clearSelected("mid_size");
	clearSelected("small_size");
	clearSelected("custom_size");
	clearDisabled("randomArray");
	clearDisabled("nearlySortedArray");
	clearDisabled("revSortedArray");
	clearDisabled("sortedArray");
	console.log("Array size: 32");
	document.getElementById("custom_input_block").style.display = "none";
});

/**
 * Event listener for button with id="custom_size"
 *
 */
document.getElementById("custom_size").addEventListener("click", function() {
	selected_button("custom_size");
	clearSelected("mid_size");
	clearSelected("small_size");
	clearSelected("large_size");
	clearSelected("nearlySortedArray");
	clearSelected("randomArray");
	clearSelected("sortedArray");
	clearSelected("revSortedArray");
	disableButton("randomArray");
	disableButton("nearlySortedArray");
	disableButton("revSortedArray");
	disableButton("sortedArray");
	console.log("Array size: Custom");
	document.getElementById("selected_array_size").style.display="block";
	document.getElementById("selected_array_size").innerHTML = "Array size: Custom";
	document.getElementById("custom_input_block").style.display = "table";
});

/**
 * Event listener for button with id="custom_array"
 *
 */
document.getElementById("custom_array").addEventListener("click", function() {
	generateCustomArray();
});

/* Event listener for button with id="randomArray" */
document.getElementById("randomArray").addEventListener("click", function() {
	generateRandomArray();
	selected_button("randomArray");
	clearSelected("sortedArray");
	clearSelected("revSortedArray");
	clearSelected("nearlySortedArray");
	console.log("Array type: Random");
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
	console.log("Array type: Sorted");
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
	console.log("Array type: Reverse Sorted");
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
	console.log("Array type: Nearly Sorted");
});

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
 * Event listener for button with id="resetAnimation"
 *
 */
document.getElementById("resetAnimation").addEventListener("click", function() {
	clearSelected("nearlySortedArray");
	clearSelected("randomArray");
	clearSelected("sortedArray");
	clearSelected("revSortedArray");
	clearSelected("large_size");
	clearSelected("mid_size");
	clearSelected("small_size");
	clearSelected("custom_size");
	document.getElementById("custom_input_block").style.display = "none";
	resetAnimation();
	setArraySize(16);
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
	clearDisabled("custom_array");
	clearDisabled("small_size");
	clearDisabled("mid_size");
	clearDisabled("large_size");
	clearDisabled("custom_size");
	document.getElementById("visual_history").disabled = false;
	updateActionTracker("Tip: ", "You can allow or disable the Action Tracker from the left sidebar.");
});

/**
 * Event listener for button with id="runAnimation"
 *
 */
document.getElementById("runAnimation").addEventListener("click", function() {
	disableButton("randomArray");
	disableButton("nearlySortedArray");
	disableButton("revSortedArray");
	disableButton("sortedArray");
	disableButton("small_size");
	disableButton("mid_size");
	disableButton("large_size");
	disableButton("custom_size");
	disableButton("custom_array");
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
 * Displays an "animation history" frame depending on the history_slider value
 *
 */
function displayMomentVal() {
	var entry = document.getElementById("history_slider").value;
    displayMoment(_history[parseInt(entry)]);
	updateActionTracker(_textHistory[parseInt(entry)]," (history)");
}

/**
 * Displays CoutingSort counters history
 *
 */
function displayCounterHistory() {
	var entry = document.getElementById("history_slider").value;
    displayCounterMoment(_countingHistory[parseInt(entry)]);
}

/**
 * EvenListener for input element with id="history_slider"
 */
$('#history_slider').on("change", function() {
	displayMomentVal();
	if(NUMBER_FLOOR == 10) {
		displayCounterHistory();
	}
});

/**
 * Save Bar scene animation state
 *
 */
function saveAnimationState() {
	var jsonArray = JSON.parse(JSON.stringify(ARRAY_OF_OBJECTS));
	_history.push(convertJSONtoBar(jsonArray));
}

/**
 * Save CountingBar scene animation state
 *
 */
function saveCounterState() {
	var jsonArray = JSON.parse(JSON.stringify(COUNTING_BARS));
	_countingHistory.push(convertJSONtoCountingBar(jsonArray));
}

/**
 * EvenListener for button with id="step_backward"
 */
document.getElementById("step_backward").addEventListener("click", function() {
	var history_slider = document.getElementById("history_slider");
	if(parseInt(history_slider.value)-1 >= 0) {
		history_slider.value = parseInt(history_slider.value)-1;
		displayMomentVal();
		if(NUMBER_FLOOR == 10) {
			displayCounterHistory();
		}
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
		if(NUMBER_FLOOR == 10) {
			displayCounterHistory();
		}
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
		if(NUMBER_FLOOR == 10) {
			id = setInterval(autoplay, 20);
		} else {
			id = setInterval(autoplay, 75);
		}
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
			if(NUMBER_FLOOR == 10) {
				displayCounterHistory();
			}
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
		if(NUMBER_FLOOR == 10) {
			id = setInterval(autoplay, 20);
		} else {
			id = setInterval(autoplay, 75);
		}
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
				if(NUMBER_FLOOR == 10) {
					displayCounterHistory();
				}
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
 * EventListener for button with id="hide_labels"
 */
if(document.getElementById("hide_labels") != null) {
	document.getElementById("hide_labels").addEventListener("click", function() {
		document.getElementById("color_labels").style.display = "none";
	});
}
	
/* END OF FILE */
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	