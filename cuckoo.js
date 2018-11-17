require("underscore");

(function () {
    //'use strict';

    function objectiveFunction(x) {
        var result = 0;
        for (var i in x) {
            result += x[i]
        }
        return result;
    }

    function Cuckoo(nestCount, dimension, Pa, Lb, Ub) {
        // nestCount: The number of nests;
        // dimension: The dimension of x;
        // maxGeneration: Maximum generation of enumeration;
        // Pa: Discover rate;
        // lb: Lower bound;
        // ub: Upper bound;

        _ = require("underscore")
        this.beta = 3 / 2; // recommended parameter
        this.sigma = 0.6965745025576967; // recommended parameter

        //--------------------------need to fix to Lb and Ub--------------------------
        var lb, ub, n, d, maxgen, pa, nests, fitness, best, k;
        this.lb = Lb;// lower bound
        this.ub = Ub;// upper bound

        //----------------------------------------------------------------------------

        this.nestCount = nestCount;  // number of nests
        this.dimension = dimension;   // number of dimensions (number of facilities)
        this.pa = Pa;
    }

    Cuckoo.prototype = {
        output: function(){
            return [this.best, this.fitness[this.k]]
        },

        init: function () {
            this.nests = [];
            this.fitness = [];

            for (var ii = 0; ii < this.nestCount; ii++) {
                this.nests.push(_.sample(Array.from(new Array(this.ub - this.lb + 1), (x, i) => i + this.lb), this.dimension));
            }
            for (var ii = 0; ii < this.nests.length; ii++) {
                this.fitness.push(10000000);
            }

            var tempObject = this._getBestNest(this.nests, this.nests, this.fitness);
            this.best = tempObject[0];
            this.k = tempObject[1];
        },

        next: function(outputFlag){//outputFlag: If yes, print results during the loop.

            var newNests = this._getCuckoos(this.nests, this.best)
            var tempObject = this._getBestNest(this.nests, newNests, this.fitness)
            this.best = tempObject[0];
            this.k = tempObject[1];
            if(outputFlag){
                console.log("GetCuckoos: ", this.best, this.fitness[this.k]);
            }
    
            newNests = this._emptyNests(this.nests, this.lb, this.ub, this.pa)
            var tempObject = this._getBestNest(this.nests, newNests, this.fitness)
            this.best = tempObject[0];
            this.k = tempObject[1];
            if(outputFlag){
                console.log("EmptyNests: ", this.best, this.fitness[this.k]);
            }
        },

        _randNorm: function () {
            var u = 0, v = 0;
            while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
            while (v === 0) v = Math.random();
            return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        },

        _simpleBounds: function (s, Lb, Ub) {
            for (var i = 0; i < s.length; i++) {
                if (s[i] < Lb) {
                    s[i] = Lb
                }
                else {
                    if (s[i] > Ub) {
                        s[i] = Ub
                    }
                }
            }
            return s;
        },

        _makeFeasible: function (s, Lb, Ub) {
            var all, s1;
            all = Array.from(new Array(Ub - Lb + 1), (x, i) => i + Lb);
            s1 = _.uniq(s);
            if (s1.length == s.length) {
                return s
            }
            diff = _.difference(all, s1);

            var concatR = s1.concat(_.sample(diff, s.length - s1.length))
            return concatR;
        },

        _getBestNest: function (nests, nests_new, fitness) {
            var n = nests.length;
            var fbest = fitness[0];
            var k = 0;
            var fnew;

            for (var i = 0; i < n; i++) {
                // ____________________
                fnew = objectiveFunction(nests_new[i])
                if (fnew < fitness[i]) {
                    fitness[i] = fnew;
                    nests[i] = nests_new[i];
                }
                if (fitness[i] < fbest) {
                    fbest = fitness[i];
                    k = i;
                }
            }
            return [nests[k], k];
        },

        _getCuckoos: function (nests, best) {
            var n, d, u, v, step, stepSize, s1, newNests, s;
            n = nests.length;
            d = best.length;
            newNests = [];
            for (var i = 0; i < n; i++) {
                s = nests[i];
                u = [];
                v = [];
                step = [];
                stepSize = [];
                s1 = [];
                for (var j = 0; j < d; j++) {
                    u.push(this._randNorm() * this.sigma);
                    v.push(this._randNorm());
                    step.push(u[j] / Math.pow(Math.abs(v[j]), (1 / this.beta)));
                    stepSize.push(0.01 * step[j] * (s[j] - best[j]));
                    s1.push(parseInt(s[j] + stepSize[j] * this._randNorm()));
                }
                this._simpleBounds(s1, this.lb, this.ub);
                s1 = this._makeFeasible(s1, this.lb, this.ub);
                newNests.push(s1);
            }

            return newNests;
        },

        _emptyNests: function (nests, lb, ub, pa) {
            var n, k, sample1, sample2, s1, s2, stepSize, s, newNests, tag;
            n = nests.length;
            k = [];
            //Discovered or not -- a status vector
            //determine which nest get to discover
            for (var i = 0; i < n; i++) {
                tag = Math.random();
                if (tag > pa) {
                    k.push(1);
                }
                else {
                    k.push(0);
                }

            }

            sampleAll = [];
            for (var a = 0; a < n; a++) {
                sampleAll.push(a)
            }
            sample1 = _.sample(sampleAll, n);
            sample2 = _.sample(sampleAll, n);
            //those in sample1 difference sample2, then apply stepsize
            newNests = []

            for (var i = 0; i < n; i++) {
                s1 = nests[sample1[i]];
                s2 = nests[sample2[i]];
                stepsize = [];
                s = [];
                for (var j = 0; j < s1.length; j++) {
                    stepsize.push(Math.random() * (s1[j] - s2[j]));
                    s.push(parseInt(nests[i][j] + stepsize[j] * k[j]));
                }
                this._simpleBounds(s, this.lb, this.ub);
                s = this._makeFeasible(s, this.lb, this.ub)
                newNests.push(s)
            }
            return newNests;
        }


    }

    var cuckoo = new Cuckoo(10, 5, 0.25, 0, 99);
    cuckoo.init();
    var maxgen=100;
    
    for (var i = 0; i < maxgen; i++) {
        cuckoo.next();
    }




})()

