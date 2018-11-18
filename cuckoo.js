(function () {
    //'use strict';

    function Cuckoo(objectiveFunction, nestCount, dimension, Pa, Lb, Ub, uniqueFlag) {
        // nestCount: The number of nests;
        // dimension: The dimension of x;
        // maxGeneration: Maximum generation of enumeration;
        // Pa: Discover rate;
        // lb: Lower bound;
        // ub: Upper bound;

        if (typeof module !== 'undefined' && module.exports) {
            // + in *node*
            _ = require("underscore")
        }
        this.beta = 3 / 2; // recommended parameter
        this.sigma = 0.6965745025576967; // recommended parameter

        this.objectiveFunction = objectiveFunction;

        this.nestCount = nestCount;  // number of nests
        this.dimension = dimension;   // number of dimensions (number of facilities)
        this.pa = Pa;// cuckoo found rate
        this.lb = Lb;// lower bound
        this.ub = Ub;// upper bound
        if (uniqueFlag === undefined) {
            uniqueFlag = false;
        }
        this.uniqueFlag = uniqueFlag;

    }

    Cuckoo.prototype = {
        output: function () {
            return { "solution": this.best, "objective": this.fitness[this.k] }
        },

        init: function () {
            this.nests = [];
            this.fitness = [];

            var tempArray;
            for (var ii = 0; ii < this.nestCount; ii++) {
                tempArray = [];
                for (var jj = 0; jj < this.dimension; jj++) {
                    tempArray.push(_.sample(Array.from(new Array(this.ub[jj] - this.lb[jj] + 1), (x, i) => i + this.lb[jj]), 1));
                }

                this.nests.push(tempArray);
            }
            for (var ii = 0; ii < this.nests.length; ii++) {
                this.fitness.push(10000000);
            }

            var tempObject = this._getBestNest(this.nests, this.nests, this.fitness);
            this.best = tempObject[0];
            this.k = tempObject[1];
        },

        next: function (outputFlag) {//outputFlag: If yes, print results during the loop.

            var newNests = this._getCuckoos(this.nests, this.best)
            var tempObject = this._getBestNest(this.nests, newNests, this.fitness)
            this.best = tempObject[0];
            this.k = tempObject[1];
            if (outputFlag) {
                console.log("GetCuckoos: ", this.best, this.fitness[this.k]);
            }

            newNests = this._emptyNests(this.nests, this.lb, this.ub, this.pa)
            var tempObject = this._getBestNest(this.nests, newNests, this.fitness)
            this.best = tempObject[0];
            this.k = tempObject[1];
            if (outputFlag) {
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
                if (s[i] < Lb[i]) {
                    s[i] = Lb[i]
                }
                else {
                    if (s[i] > Ub[i]) {
                        s[i] = Ub[i]
                    }
                }
            }
            return s;
        },

        _makeFeasible: function (s, Lb, Ub) {
            var all, s1, diff, samp;

            s1 = _.uniq(s);
            if (s1.length == s.length) {
                return s
            }

            for (var jj = s1.length; jj < s.length; jj++) {
                all = Array.from(new Array(Ub[jj] - Lb[jj] + 1), (x, i) => i + Lb[jj]);
                diff = _.difference(all, s1);
                samp = _.sample(diff, 1)
                s1.push(samp);
            }
            return s1;
        },

        _getBestNest: function (nests, nests_new, fitness) {
            var n = nests.length;
            var fbest = fitness[0];
            var k = 0;
            var fnew;

            for (var i = 0; i < n; i++) {
                // ____________________
                fnew = this.objectiveFunction(nests_new[i])
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
                if (this.uniqueFlag) {
                    s1 = this._makeFeasible(s1, this.lb, this.ub);
                }
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
                if (this.uniqueFlag) {
                    s = this._makeFeasible(s, this.lb, this.ub)
                }
                newNests.push(s)
            }
            return newNests;
        }


    }

    if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
        // + from a *WebWorker*
        self.Cuckoo = Cuckoo;
    } else if (typeof module !== 'undefined' && module.exports) {
        // + in *node*
        module.exports = Cuckoo;
    } else {
        // + or in a plain browser environment
        window.Cuckoo = Cuckoo;
    }
})()