/* HEAP SORT TEST */
/* copy this code under "//paste the test function here" in HeapSort.js */
/* The test automatically starts a new animation after the previous one has finished */
/* the simulation only ends if HeapSort ever fails */
/* remember to uncomment "var simulation_counter = 0" at the top */
		var nums = [];
		for(var i = 0; i < ARRAY_OF_HEAPS.length; i++) {
			nums.push(ARRAY_OF_HEAPS[i].number);
		}
						
		var corrected = true;
		for(var i = 0; i < nums.length; i++) {
			if(nums[i] > nums[i+1]) {
				corrected = false;
				break;
			}
		}
		
		simulation_counter++;
		console.log("Simulation: " + simulation_counter + " ===================== ");
		console.log("Array size: " + arraySize);
		console.log("Result: " + nums);
		console.log("Succes: " + corrected);
		console.log("========================================");
		
		if(!corrected) {
			return;
		}
		
		cancelAnimationFrame(idframe);
		cancelAnimationFrame(idframe2);
		arraySize = Math.floor(Math.random() * 31);
		
		if(arraySize < 10) {
			arraySize = 10;
		}
		
		resetAnimation();
		generateRandomArray();
		idframe2 = requestAnimationFrame(runAnimation);
/* HEAP SORT TEST ENDS */

/* BAR ANIMATION TEST */
/* copy this code under "//paste the test function here" in any Bar animation */
/* The test automatically starts a new animation after the previous one has finished */
/* the simulation only ends if the animation ever fails (does not sort the numbers correctly)*/
/* remember to uncomment "var simulation_counter = 0" at the top */
		var nums = [];
		for(var i = 0; i < ARRAY_OF_OBJECTS.length; i++) {
			nums.push(ARRAY_OF_OBJECTS[i].number);
		}
				
		var corrected = true;
		for(var i = 0; i < nums.length; i++) {
			if(nums[i] > nums[i+1]) {
				corrected = false;
				break;
			}
		}
		
		simulation_counter++;
		console.log("Simulation: " + simulation_counter + " ===================== ");
		console.log("Array size: " + arraySize);
		console.log("Result: " + nums);
		console.log("Succes: " + corrected);
		console.log("========================================");
		
		if(!corrected) {
			return;
		}
		
		arraySize = Math.floor(Math.random() * (32 - 5+1) + 5); // random arraySize from 5 to 32
		
		cancelAnimationFrame(frame_id);
		cancelAnimationFrame(frame_id2);
		resetAnimation();
		generateRandomArray();
		frame_id2 = requestAnimationFrame(runAnimation);
/* BAR TEST ENDS */


