# cuckoo.js

An cuckoo search JavaScript library.

## Feature
 * Integer and real number optimization.
 * upperBound and lowerBound array.
 * Support WebWorker, node.js, and browser.
 
## Import
Please be aware that this library depends on [underscore.js](https://underscorejs.org/). Make sure install underscore.js before using.

Web browser environment: 
```HTML
<script src="cuckoo.js"></script>
```

Node.js environment:
```bash
$ npm install cuckoo
```
and

```js
Cuckoo = require("cuckoo"); // Add to the first line.
```

## API usage
```js
var cuckoo = new Cuckoo(objectiveFunction,
    nestCount, // The number of nests.
    dimension, // The dimension of the optimization problem.
    Pa, // The rate of nests replacement. Default to 0.25.
    lowerBound, // The lower bound array. The demension of this array should be equal to dimension.
    upperBound, // The upper bound array. The demension of this array should be equal to dimension.
    intFlag, // True if the problem is an integer problem; False otherwise.
    uniqueFlag // True if each dimension should be different from each other; False otherwise.
);

// Initialization
cuckoo.init(); // Init the cuckoo search process.

// Next iteration
cuckoo.next(); // Proceed to the next iteration.

// Output
cuckoo.output(outputFlag); // Output the result. Print the result after this iteration if outputFlag is true.

// The output is a JSON object:
//{ 
//  solution: [ 0, 0, 0, 0 ], 
//  objective: 0 
//}
```

## Example
Live demo: https://luyuliu.github.io/cuckoo.js/example/graph/

```js
Cuckoo = require("../cuckoo.js");

var objectiveFunction1 = function (x) {
    var result = 0;
    for (var i in x) {
        result += (x[i])
    }
    return result;
}

var upperBound = [99, 99, 99, 99];
var lowerBound = [0, 0, 0, 0];
var cuckoo = new Cuckoo(objectiveFunction1, 10, 4, 0.25, lowerBound, upperBound, true, false);
cuckoo.init();
var maxgen = 100;

for (var i = 0; i < maxgen; i++) {
    cuckoo.next(false);
    console.log(cuckoo.output());
}


```
