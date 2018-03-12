/* copyright information:
FILE: CompareEventListeners.js
AUTHOR: Dayan Petrov
UNIVERSITY: The University of Sheffield
WEB: dissertation.dayanpetrow.eu
DESCRIPTION: EventListeners for the page "Compare Algorithms"
LAST UPDATED: 28-04-2017
*/
/**
 * Add an Algorithm to the selection for comparison
 *
 * @param {string} btn The ID of the button to attach the EventListener to
 * @param {number} id The ID of the Algorithm
 */
function selectAlgorithm(btn, id) {
	if(btn.className == "compare_button") {
		if(current_selected < MAX_SELECTED) {
			btn.className = "compare_button_selected";
			console.log(ALGORITHMS[id].name + " was added to selection");
			ALGORITHMS[id].active(true);
			current_selected++;
			document.getElementById("error").style.display = "none";
		} else {
			document.getElementById("error").style.display = "block";
			document.getElementById("compare_error").innerHTML = "Cannot select more than 3 algorithms";
		}
	} else if (btn.className == "compare_button_selected") {
		document.getElementById("error").style.display = "none";
		btn.className = "compare_button";
		ALGORITHMS[id].active(false);
		console.log(ALGORITHMS[id].name + " was removed from selection");
		current_selected--;
	}
}

/**
 * EventListener for "compare_bubble_sort"
 */
document.getElementById("compare_bubble_sort").addEventListener("click", function() {
	var btn = document.getElementById("compare_bubble_sort");
	selectAlgorithm(btn, 0);
});

/**
 * EventListener for "compare_selection_sort"
 */
document.getElementById("compare_selection_sort").addEventListener("click", function() {
	var btn = document.getElementById("compare_selection_sort");
	selectAlgorithm(btn, 1);
});

/**
 * EventListener for "compare_insertion_sort"
 */
document.getElementById("compare_insertion_sort").addEventListener("click", function() {
	var btn = document.getElementById("compare_insertion_sort");
	selectAlgorithm(btn, 2);
});

/**
 * EventListener for "compare_radix_sort"
 */
document.getElementById("compare_radix_sort").addEventListener("click", function() {
	var btn = document.getElementById("compare_radix_sort");
	selectAlgorithm(btn, 3);
});

/**
 * EventListener for "compare_merge_sort"
 */
document.getElementById("compare_merge_sort").addEventListener("click", function() {
	var btn = document.getElementById("compare_merge_sort");
	selectAlgorithm(btn, 4);
});

/**
 * EventListener for "compare_heap_sort"
 */
document.getElementById("compare_heap_sort").addEventListener("click", function() {
	var btn = document.getElementById("compare_heap_sort");
	selectAlgorithm(btn, 5);
});

/**
 * EventListener for "compare_quick_sort"
 */
document.getElementById("compare_quick_sort").addEventListener("click", function() {
	var btn = document.getElementById("compare_quick_sort");
	selectAlgorithm(btn, 6);
});

/**
 * EventListener for "compare_counting_sort"
 */
document.getElementById("compare_counting_sort").addEventListener("click", function() {
	var btn = document.getElementById("compare_counting_sort");
	selectAlgorithm(btn, 7)
});

/**
 * EventListener for "select_input_size"
 */
$('#select_input_size').on("change", function() {
	var _element = document.getElementById("select_input_size");
    var _selected = _element.selectedIndex;
    INPUT_SIZE = parseInt(_element.options[_selected].value);
	console.log("Input size is set to " + INPUT_SIZE);
});

/**
 * EventListener for "select_input_type"
 */
$('#select_input_type').on("change", function() {
	var _element = document.getElementById("select_input_type");
    var _selected = _element.selectedIndex;
    INPUT_TYPE = _element.options[_selected].value;
	console.log("Input type is set to " + INPUT_TYPE);
});

/**
 * Create a GoogleChart visualisation
 */
function createChart() {
	/* DRAWING A GOOGLE CHART == https://google-developers.appspot.com/chart/ */
			google.load("visualization", "1", {packages:["bar"], callback: drawChart});
			function drawChart() {
				
				if(chart_filter == "all") {
					var data = google.visualization.arrayToDataTable(_all);
				} else if (chart_filter == "comparisons") {
					var data = google.visualization.arrayToDataTable(_comparisons);
				} else if (chart_filter == "swaps") {
					var data = google.visualization.arrayToDataTable(_swaps);
				} else if (chart_filter == "distance") {
					var data = google.visualization.arrayToDataTable(_distance);
				} else if (chart_filter == "time") {
					var data = google.visualization.arrayToDataTable(_time);
				} 
				
				var options = {
				  chart: {
					title: 'Algorithm comparison results',
					subtitle: 'Input size: ' + INPUT_SIZE + " Input type: " + INPUT_TYPE,
				  }
				};

				var chart = new google.charts.Bar(document.getElementById('chart'));

				chart.draw(data, google.charts.Bar.convertOptions(options));
			}
			/* END DRAWING GOOGLE CHART */
}

/**
 * EventListener for "run_comparison"
 */
document.getElementById("run_comparison").addEventListener("click", function() {
	if(current_selected == 0) {
		document.getElementById("error").style.display = "block";
		document.getElementById("compare_error").innerHTML = "No algorithms are selected";
	} else {
		document.getElementById("error").style.display = "block";
		document.getElementById("compare_error").innerHTML = "Comparing selected algorithms, please wait";
		setTimeout(function() {
			runComparison();
			createChart();
			/* Display results */
			document.getElementById("user_selection").style.display = "none";
			document.getElementById("results").style.display = "block";
		}, 100);
	}
});

/**
 * EventListener for "filter_chart"
 */
$('#filter_chart').on("change", function() {
	var _element = document.getElementById("filter_chart");
    var _selected = _element.selectedIndex;
    chart_filter = _element.options[_selected].value;
	createChart();
});

/* END OF FILE */
