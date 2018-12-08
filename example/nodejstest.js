Cuckoo = require("../cuckoo.min.js");


var objectiveFunction1 = function (x) {
    var result = 0;
    for (var i in x) {
        result += (x[i])
    }
    return result;
}

var upperBound = [99, 99, 99, 99];
var lowerBound = [0, 1, 3, 2];
var cuckoo = new Cuckoo(objectiveFunction1, 10, 4, 0.25, lowerBound, upperBound, false);
cuckoo.init();
console.log(cuckoo.output());
var maxgen = 100;

for (var i = 0; i < maxgen; i++) {
    cuckoo.next(false);
    console.log("loop",i,":",cuckoo.output());
}



