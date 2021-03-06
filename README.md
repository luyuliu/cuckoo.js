# cuckoo.js

A cuckoo search JavaScript library. Read more about [Cuckoo Search Algorithm](https://ieeexplore.ieee.org/abstract/document/5393690).

## Feature
 * Implement basic cuckoo search algorithm.
 * Support integer and real number optimization.
 * Support upperBound and lowerBound array.
 * Support WebWorker, node.js, and browser.
 
## Import
Please be aware that this library depends on [underscore.js](https://underscorejs.org/). Make sure install underscore.js before using.

Web browser environment: 
```HTML
<script src="cuckoo.js"></script>
<script src="underscore.js"></script>
```

Node.js environment:
```bash
$ npm install cuckoo-search
$ npm install underscore
```
and

```js
Cuckoo = require("cuckoo-search"); // Add to the first line.
```

## API usage
```js
var cuckoo = new Cuckoo(objectiveFunction, // Objective Function to be **minimized**.
    nestCount, // The number of nests.
    dimension, // The dimension of the optimization problem.
    Pa, // The rate of nests replacement. Default to 0.25.
    lowerBound, // The lower bound array. The demension of this array should be equal to dimension.
    upperBound, // The upper bound array. The demension of this array should be equal to dimension.
    intFlag, // True if the problem is an integer problem; False otherwise.
    uniqueFlag // True if each dimension's value should be different; False otherwise. e.g.: If true, the solution [0, 0, 0, 0] here is not allowed.
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
### Live demo: 
https://luyuliu.github.io/cuckoo.js/example/graph/

### Node.js example
```js
Cuckoo = require("cuckoo-research");

var objectiveFunction = function (x) {
    var result = 0;
    for (var i in x) {
        result += (x[i])
    }
    return result;
}

var upperBound = [99, 99, 99, 99];
var lowerBound = [0, 0, 0, 0];
var cuckoo = new Cuckoo(objectiveFunction, 10, 4, 0.25, lowerBound, upperBound, true, false);
cuckoo.init();
var maxgen = 100;

for (var i = 0; i < maxgen; i++) {
    cuckoo.next(false);
    console.log(cuckoo.output());
}
```
## Acknowledgement
 * The basic CS algorithm is based on [@Xin-She Yang](https://www.mathworks.com/matlabcentral/fileexchange/29809-cuckoo-search-cs-algorithm)'s Matlab script. 
 * I also referred to [@Ningchuan Xiao](https://github.com/ncxiao)'s Python script. 
 * This is a final project for OSU GEOG8200.
