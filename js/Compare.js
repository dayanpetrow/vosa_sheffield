/* copyright information:
FILE: Compare.js
AUTHOR: Dayan Petrov
UNIVERSITY: The University of Sheffield
WEB: dissertation.dayanpetrow.eu
DESCRIPTION: Comparison of sorting algorithms
LAST UPDATED: 28-04-2017
*/
var quick_array = [];
var merge_array = [];
var counting_array = [];
var copy_array = [];

var AN =   ["BubbleSort", //id = 0
			"SelectionSort", //id = 1
			"InsertionSort", //id = 2
			"RadixSort", //id = 3
			"MergeSort", //id = 4
			"HeapSort", //id = 5
			"QuickSort", //id = 6
			"CountingSort" //id = 7
			]
			
var INPUT_SIZE = 1000; //default value
var INPUT_TYPE = "random"; //default value
var ALGORITHMS = [];
var ARRAY_OF_NUMBERS = [];
var MAX_SELECTED = 3;
var current_selected = 0;
var chart_filter = "all";
var _all, _comparisons, _swaps, _distance, _time;

/**
 * Creates an instance of Algorithm.
 *
 * @constructor
 * @this {Algorithm}
 * @param {string} name The name of the Algorithm
 * @param {number} comparisons The comparisons made by the Algorithm (default value of 0)
 * @param {number} swaps The swaps made by the Algorithm (default value of 0)
 * @param {number} distance The distance traveled by the elements that were sorted (default value of 0)
 * @param {number} time The time it took for the Algorithm to execute (default value of 0)
 * @param {boolean} use States whether the Algorithm should be used in the comparison
 */
function Algorithm(name, comparisons, swaps, distance, time, use) {
	this.name = name;
	this.comparisons = comparisons;
	this.swaps = swaps;
	this.distance = distance;
	this.time = time;
	this.use = use;
}

/**
 * Adds a number to Algorithm.time
 *
 * @this {Algorithm}
 * @param {number} time Value to be added to Algorithm.time
 */
Algorithm.prototype.addTime = function(time) {
	this.time += time;
}

/**
 * Increments the the value of Algorithm.comparisons
 *
 * @this {Algorithm}
 */
Algorithm.prototype.addComparison = function() {
	this.comparisons += 1;
}

/**
 * Increments the the value of Algorithm.comparisons
 *
 * @this {Algorithm}
 */
Algorithm.prototype.addSwap = function() {
	this.swaps += 1;
}

/**
 * Adds a number to Algorithm.distance
 *
 * @this {Algorithm}
 * @param {number} time Value to be added to Algorithm.distance
 */
Algorithm.prototype.addDistance = function(num) {
	this.distance += num;
}

/**
 * Sets the value of Algorithm.use to the parameter
 *
 * @this {Algorithm}
 * @param {boolean} bool Updates the value of Algorithm.use to the parameter
 */
Algorithm.prototype.active = function(bool) {
	this.use = bool;
}

/**
 * Constructs the array of Algorithm objects
 */
function algo_init() {
	for(var i=0; i < AN.length; i++) {
		ALGORITHMS.push(new Algorithm(AN[i],0,0,0,0,false));
	}
}

/* fill the ALGORITHMS array */
algo_init();

/**
 * Generates an array of numbers
 */
function generateArray() {
	var i, number;
	ARRAY_OF_NUMBERS = [];
	for(i=0; i<INPUT_SIZE; i++) {
		number = Math.floor(Math.random() * 10000);
		ARRAY_OF_NUMBERS.push(number);
	}
	if(INPUT_TYPE == "sorted") {
		ARRAY_OF_NUMBERS.sort(function(a, b){return a-b});
	}
	if(INPUT_TYPE == "revered") {
		ARRAY_OF_NUMBERS.sort(function(a, b){return b-a});
	}
}

/**
 * Uses the created Algorithm objects to run a comparison on those who have their use property to true
 */
function runComparison() {
	generateArray();
	for(var j = 0; j < ALGORITHMS.length; j++) {
		if(ALGORITHMS[j].use == true) {
			run(ALGORITHMS[j].name);
		}
	}
	_all = [['Algorithm', 'Comparisons', 'Swaps', 'Distance', 'Time (ms)']];
	_comparisons = [['Algorithm', 'Comparisons']];
	_swaps = [['Algorithm', 'Swaps']];
	_distance = [['Algorithm', 'Distance']];
	_time = [['Algorithm', 'Time (ms)']];
				
	for(var j = 0; j < ALGORITHMS.length; j++) {
		if(ALGORITHMS[j].use == true) {
			_all.push([ALGORITHMS[j].name, ALGORITHMS[j].comparisons, ALGORITHMS[j].swaps, ALGORITHMS[j].distance, Math.round(ALGORITHMS[j].time)]);
			_comparisons.push([ALGORITHMS[j].name, ALGORITHMS[j].comparisons]);
			_swaps.push([ALGORITHMS[j].name, ALGORITHMS[j].swaps]);
			_time.push([ALGORITHMS[j].name, Math.round(ALGORITHMS[j].time)]);
			_distance.push([ALGORITHMS[j].name, ALGORITHMS[j].distance]);
		}
	}
}

/**
 * Executes the run function of a particular sorting algorithms
 *
 * @param {string} string The name of the algorithm to be executed
 */
function run(string) {
	copy_array = ARRAY_OF_NUMBERS.slice(0);
	if(string == "BubbleSort") {
		runBubbleSort(copy_array);
	} else if(string == "SelectionSort") {
		runSelectionSort(copy_array);
	} else if(string == "InsertionSort") {
		runInsertionSort(copy_array);
	} else if(string == "CountingSort") {
		runCountingSort(copy_array);
	} else if(string == "MergeSort") {
		runMergeSort(copy_array);
	} else if(string == "QuickSort") {
		runQuickSort(copy_array);
	} else if(string == "HeapSort") {
		runHeapSort(copy_array);
	} else if(string == "RadixSort") {
		runRadixSort(copy_array);
	}
}

/**
 * Executes BubbleSort
 *
 * @param {array} arr The array to be sorted
 */
function runBubbleSort(arr){
	var copy = arr.slice(0);
	var len = copy.length;
	var start = performance.now();
	
	for (var i = len-1; i>=0; i--){
		swapped = false;
		for(var j = 1; j<=i; j++){
			ALGORITHMS[0].addComparison();
			if(copy[j-1]>copy[j]){
				swapped = true;
				ALGORITHMS[0].addSwap();
				var temp = copy[j-1];
				copy[j-1] = copy[j];
				copy[j] = temp;
				ALGORITHMS[0].addDistance(2);
			}
		}
		if(!swapped) {
			break;
		}
	}
	var end = performance.now();
	ALGORITHMS[0].addTime(end.toFixed(2)-start.toFixed(2));
}

/**
 * Executes SelectionSort
 *
 * @param {array} arr The array to be sorted
 */
function runSelectionSort(arr){
	var copy = arr.slice(0);
	var len = copy.length;
	var smallest, temp;
	var start = performance.now();
	for(var i = 0; i < len; i++){
		smallest = i;
		for(var  j = i+1; j<len; j++){
			ALGORITHMS[1].addComparison();
			if(copy[j]<copy[smallest]){
				smallest = j;
			}
		}
		if(smallest != i) {
			ALGORITHMS[1].addSwap();
			ALGORITHMS[1].addDistance((smallest-i)*2);
		}
		temp = copy[i];
		copy[i] = copy[smallest];
		copy[smallest] = temp;
	}
	var end = performance.now();
	ALGORITHMS[1].addTime(end.toFixed(2)-start.toFixed(2));
}

/**
 * Executes InsertionSort
 *
 * @param {array} arr The array to be sorted
 */
function runInsertionSort(arr){
	var copy = arr.slice(0);
	var selected, j, i;
	var len = copy.length;
	var start = performance.now();
	for(i = 1; i<len; i++){
		selected = copy[i];
		j = i;
		ALGORITHMS[2].addComparison();
		while(j>0 && copy[j-1]>selected){
			ALGORITHMS[2].addSwap();
			ALGORITHMS[2].addComparison();
			ALGORITHMS[2].addDistance(2);
			copy[j] = copy[j-1];
			j--;
		}
		copy[j] = selected;
	}
	var end = performance.now();
	ALGORITHMS[2].addTime(end.toFixed(2)-start.toFixed(2));
}

/**
 * Executes CountingSort
 *
 * @param {array} arr The array to be sorted
 */
function runCountingSort(arr) {
	var counter = [], i, write_index = 0;
	var copy = arr.splice(0);
	var len = copy.length;
	
	//calculate the start and end index of the counting array
	var min = Math.min.apply(null,copy);
	var max = Math.max.apply(null,copy);
	var start = performance.now();
	//create the counting array
    for (i = min; i <= max; i++) {
        counter[i] = 0;
    }
	
	//increment the counter for every element in copy
    for (i = 0; i < len; i++) {
        counter[copy[i]]++;
    }
	
	//write back the correct position to the original array
    for (i = min; i <= max; i++) {
        while (counter[i] > 0) {
            copy[write_index] = i;
			write_index++;
			counter[i]--;
        }
    }
	var end = performance.now();
	ALGORITHMS[7].addTime(end.toFixed(2)-start.toFixed(2));
}

/**
 * Executes MergeSort
 *
 * @param {array} arr The array to be sorted
 */
function runMergeSort(arr) {
	var partition_size = 1;
	var copy = arr.splice(0);
	var len = copy.length;
	var start = performance.now();
	while (partition_size < len) {
		var left_element = 0;
		/* this while loop marks one iteration */
		while (left_element + partition_size < len) {
		  merge(copy, left_element, partition_size);
		  left_element += partition_size * 2;
		}
		partition_size *= 2;
	}
	var end = performance.now();
	ALGORITHMS[4].addTime(end.toFixed(2)-start.toFixed(2));
}

/**
 * Merges partition for MergeSort
 *
 * @param {array} arr The array to be sorted
 * @param {number} left_element The start index of the groups to be merged
 * @param {number} partition_size The size of the merged group
 */
function merge(arr, left_element, partition_size) {
	var right_element = left_element + partition_size;
	var partition_end = left_element + partition_size * 2 - 1;
	if (partition_end > arr.length - 1) {
		partition_end = arr.length - 1;
	}
	
	/* right_element and left_element show the starts of the 2 partitions that are being merged */
	var left_Selected = left_element;
	var right_Selected = right_element;
	var translate = [];
	
	/* sort partitions by moving the correct element in translate[] */
	for (var i = left_element; i <= partition_end; i++) {
		ALGORITHMS[4].addComparison();
		if ((arr[left_Selected] <= arr[right_Selected] || right_Selected > partition_end) && left_Selected < right_element) {
			translate[i] = arr[left_Selected];
			ALGORITHMS[4].addDistance(Math.abs((left_Selected-i)*2));
			left_Selected++;
		} else {
			translate[i] = arr[right_Selected];
			ALGORITHMS[4].addDistance(Math.abs((right_Selected-i)*2));
			right_Selected++;
		}
	}

	/* translate the sorted partition back to the original array */
	for (var j = left_element; j <= partition_end; j++) {
		arr[j] = translate[j];
	}
}

/**
 * Executes QuickSort
 *
 * @param {array} arr The array to be sorted
 */
function runQuickSort(arr) {
	var copy = arr.splice(0);
	var partition_start = 0;
	var partition_end = copy.length-1;
	var start = performance.now();
	quickSort(copy, partition_start, partition_end);
	var end = performance.now();
	ALGORITHMS[6].addTime(end.toFixed(2)-start.toFixed(2));
}

/**
 * Executes QuickSort (wrapped inside the other run function)
 *
 * @param {array} arr The array to be sorted
 * @param {number} partition_start The start index of the partition (initialised with 0)
 * @param {number} partition_end The end index of the partition (initialised with arr.length-1;)
 */
function quickSort(arr, partition_start, partition_end){
	var pivot, index;

	if(partition_start < partition_end){
		pivot = partition_end;
		index = partition(arr, pivot, partition_start, partition_end);
    
		//sort the newly formed partitions
		quickSort(arr, partition_start, index - 1);
		quickSort(arr, index + 1, partition_end);
	}

}

/**
 * Partition function for QuickSort
 *
 * @param {array} arr The array to be sorted
 * @param {number} pivot The index of the pivot element
 * @param {number} partition_start The start index of the partition
 * @param {number} partition_end The end index of the partition
 */
function partition(arr, pivot, partition_start, partition_end){
	var pivotValue = arr[pivot],
       index = partition_start;
			
	for(var i = partition_start; i < partition_end; i++){
		ALGORITHMS[6].addComparison();
		if(arr[i] < pivotValue){
			ALGORITHMS[6].addSwap();
			ALGORITHMS[6].addDistance(Math.abs((index-i)*2));
			//group smaller and bigger elements
			var temp = arr[i];
			arr[i] = arr[index];
			arr[index] = temp;
			index++;
		}
	}
	
	//sort the pivot element
	ALGORITHMS[6].addSwap();
	ALGORITHMS[6].addDistance(Math.abs((partition_end-index)*2));
	var temp = arr[partition_end];
	arr[partition_end] = arr[index];
	arr[index] = temp;
	return index;
}

/**
 * Executes HeapSort
 *
 * @param {array} arr The array to be sorted
 */
var unsorted_part;
function runHeapSort(arr) {
	var len = arr.length;
	unsorted_part = arr.length;
	var last_parent = Math.floor(len/2);
	var start = performance.now();
	
	/* Build-Max-Heap */
    for (var i = last_parent; i >= 0; i--) {
        max_heapify(arr, i);
    }

	/* keep swapping the root and the last unsorted element */
    for (var i = len - 1; i > 0; i--) {
		ALGORITHMS[5].addSwap();
		var temp = arr[0];
		arr[0] = arr[i];
		arr[i] = temp;
		ALGORITHMS[5].addDistance((Math.abs(i*2)));
        unsorted_part--;
        max_heapify(arr, 0);
    }
	var end = performance.now();
	ALGORITHMS[5].addTime(end.toFixed(2)-start.toFixed(2));
}

/**
 * Executes max-heapify
 *
 * @param {array} arr The array to be sorted
 * @param {number} _parent The parent of the heap to be max-heapified
 */
function max_heapify(arr, _parent) {
    var left_child = 2 * _parent + 1;
    var right_child = 2 * _parent + 2;
    var largest_element = _parent;

	/* check if the left child is the largest_element in the heap */
	ALGORITHMS[5].addComparison();
    if (left_child < unsorted_part && arr[left_child] > arr[largest_element]) {
        largest_element = left_child;
    }
	
	/* check if the right child is the largest_element in the heap */
	ALGORITHMS[5].addComparison();
    if (right_child < unsorted_part && arr[right_child] > arr[largest_element]) {
        largest_element = right_child;
    }
	
	/* put the largest_element as parent */
	ALGORITHMS[5].addComparison();
    if (largest_element != _parent) {
		ALGORITHMS[5].addSwap();
		var temp = arr[_parent];
		arr[_parent] = arr[largest_element];
		arr[largest_element] = temp;
		ALGORITHMS[5].addDistance(Math.abs((_parent-largest_element)*2));
        max_heapify(arr, largest_element);
    }
}

/**
 * Executes RadixSort
 *
 * @param {array} arr The array to be sorted
 */
function runRadixSort(arr) {
	var _max = Math.max.apply(Math,arr);
	var len = arr.length;
	var word_length = _max.toString().length;
	var buckets = [[],[],[],[],[],[],[],[],[],[]];
	var start = performance.now();
	
	/* convert array of ints to array of strings of equal length == add 0s to elements with smaller length */
	for(var i = 0; i < len; i++) {
		arr[i] = arr[i].toString();
		if(arr[i].length < word_length) {
			while(arr[i].length < word_length) {
				arr[i] = "0" + arr[i];
			}
		}
	}
	
	/* for each digit in word_length, move each element to corresponding bucket, then write back to original array */
	for(var i = word_length-1; i >= 0; i--) {
		
		/* fill buckets == e.g. 104 would first go in bucket 4, then in bucket 0, then in bucket 1 */
		for(var j = 0; j < len; j++) {
			buckets[parseInt(arr[j][i])].push(arr[j]);
		}
		
		arr = []; /* empty the original array */
		
		/* translate elements back to the original array */
		for(var n = 0; n < 10; n++) {
			for(var m = 0; m < buckets[n].length; m++) {
				if(i == 0) {
					arr.push(parseInt(buckets[n][m]));
				} else {
					arr.push(buckets[n][m]);
				}
			}
		}
		
		buckets = [[],[],[],[],[],[],[],[],[],[]];	/* empty buckets */
	}
	
	var end = performance.now();
	ALGORITHMS[3].addTime(end.toFixed(2)-start.toFixed(2));
}

/* END OF FILE */
    