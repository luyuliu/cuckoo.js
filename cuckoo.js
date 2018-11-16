require("underscore");

(function () {
    //'use strict';

    function objectiveFunction(x) {
        return Math.sin(x)
    }

    function Cuckoo(nestCount, dimension, maxGeneration, Pa, Lb, Ub) {
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
        Lb = 0; // lower bound
        Ub = 99;// upper bound
        this.lb = Lb;
        this.ub = Ub;

        //----------------------------------------------------------------------------

        n = 10;  // number of nests
        d = 5;   // number of dimensions (number of facilities)
        maxgen = 100;


        pa = 0.25; // Discovery rate of alien eggs/solutions

        nests = [];
        fitness = [];

        for (var ii = 0; ii < n; ii++) {
            nests.push(_.sample(Array.from(new Array(Ub - Lb + 1), (x, i) => i + Lb), d));
        }
        for (var ii = 0; ii < nests.length; ii++) {
            fitness.push(10000000);
        }

        var a = [1, 2, 3, 4]
        var tempObject = this._getBestNest(nests, nests, fitness);
        best = tempObject[0];
        k = tempObject[1];

        for (var i=0; i < maxgen; i++) {
            newNests = this._getCuckoos(nests, best)
            var tempObject = this._getBestNest(nests, newNests, fitness)
            best = tempObject[0];
            k = tempObject[1];
            newNests = this._emptyNests(nests, lb, ub, pa)
            var tempObject = this._getBestNest(nests, newNests, fitness)
            best = tempObject[0];
            k = tempObject[1];
            console.log("loop: ",best, fitness)
        }

        console.log(best, fitness[k])


    }

    Cuckoo.prototype = {

        init: function () {

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
            all = Array.from(new Array(this.ub - this.lb + 1), (x, i) => i + Lb);
            s1 = _.uniq(s);
            if (s1 == s) {
                return s
            }
            diff = _.difference(all, s1);
            return s1.concat(_.sample(diff, s.length - s1.length));
        },

        _getBestNest: function (nests, nests_new, fitness) {
            var n = nests.length;
            var fbest = fitness[0];
            var k = 0;
            var fnew;
            
            console.log(nests_new)
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
            var n, d, u, v, step, stepSize, s1, newNests,s;
            n = nests.length;
            d = best.length;
            newNests = [];
            for (var i = 0; i < n; i++) {
                s = nests[i];
                u = [];
                v = [];
                step = [];
                stepSize = [];
                s1=[];
                for (var j = 0; j < d; j++) {
                    u.push(this._randNorm() * this.sigma);
                    v.push(this._randNorm());
                    step.push(u[j] / Math.pow(Math.abs(v[j]) , (1 / this.beta)));
                    stepSize.push(0.01 * step[j] * (s[j] - best[j]));
                    s1.push(parseInt(s[j] + stepSize[j] *this. _randNorm()));
                }
                this._simpleBounds(s1, this.Lb, this.Ub);
                s1 = this._makeFeasible(s1, this.Lb, this.Ub);
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

            sampleAll=[];
            for (var a=0;a<n;a++){
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
                s=[];
                for (var j = 0; j < s1.length; j++) {
                    stepsize.push(Math.random() * (s1[j] - s2[j]));
                    s.push(parseInt(nests[i][j] + stepsize[j] * k[j]));
                }
                this._simpleBounds(s1, this.Lb, this.Ub);
                s = this._makeFeasible(s, this.Lb, this.Ub)
                newNests.push(s)
            }
            return newNests;
        }


    }

    var cuckoo = new Cuckoo();

})()

