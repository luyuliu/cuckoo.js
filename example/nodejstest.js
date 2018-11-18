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
var cuckoo = new Cuckoo(objectiveFunction1, 10, 4, 0.25, lowerBound, upperBound);
cuckoo.init();
var maxgen = 100;

for (var i = 0; i < maxgen; i++) {
    cuckoo.next(false);
    console.log(cuckoo.output());
}



