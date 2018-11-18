# cuckoo.js

An Javascript library to implement cuckoo search (basic version).

## Import
Please be aware that this library depends on [underscore.js](https://underscorejs.org/).

Web browser environment: 
```HTML
<script src="cuckoo.js"></script>
```

Node.js environment (not available yet):
```bash
$ npm install cuckoo
```

## Usage
```js
// New
var cuckoo = new Cuckoo(objectiveFunction1, nestCount, dimension, Pa, lowerBound, upperBound, uniqueFlag);

// Initialization
cuckoo.init();

// Next iteration
cuckoo.next();

// Output
cuckoo.output();

// The output is:
//{ 
//  solution: [ 0, 0, 0, 0 ], 
//  objective: 0 
//}
```

## Example
```js
var objectiveFunction1 = function (x) {
    var result = 0;
    for (var i in x) {
        result += (x[i])
    }
    return result;
}

var upperBound = [99, 99, 99, 99];
var lowerBound = [0, 0, 0, 0];
var cuckoo = new Cuckoo(objectiveFunction1, 10, 4, 0.25, lowerBound, upperBound);
cuckoo.init();
var maxgen = 100;

for (var i = 0; i < maxgen; i++) {
    cuckoo.next(false);
    console.log(cuckoo.output());
}
```
