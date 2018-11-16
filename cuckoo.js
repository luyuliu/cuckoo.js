(function(){
    'use strict';

    function objectiveFunction(x){
        return Math.sin(x)
    }

    function Cuckoo(nestCount, dimension, maxGeneration, Pa, Lb, Ub ){
        // nestCount: The number of nests;
        // dimension: The dimension of x;
        // maxGeneration: Maximum generation of enumeration;
        // Pa: Discover rate;
        // lb: Lower bound;
        // ub: Upper bound;

        this.beta = 3/2; // recommended parameter
        this.sigma = 0.6965745025576967; // recommended parameter

        this.nests = []

        


    }

    Cuckoo.prototype = {
        simpleBounds: function (s, Lb, Ub){
            for (var i=0; i< s.length; i++){
                if (s[i]<Lb){
                    s[i]=Lb
                }
                else{
                    if (s[i]>Ub){
                        s[i]=Ub
                    }
                }
            }
            return s;
        },

        makeFeasible: function (s, Lb, Ub){// need to fix 
            all = Array.from(new Array(Ub-Lb+1), (x,i) => i + Lb);
            s1 = _.uniq(s);
            if (s1 == s){
                return s
            }
            diff = _.difference(all,s1);
            return s1.concat(_.sample(diff, s.length - s1.length));
        },

        getBestNest: function(nests, nests_new, fitness){
            n = len(nests)
            fbest = fitness[0]
            k = 0
            for (var i in range(n)){

                fnew = fobj(nests_new[i])
                if fnew < fitness[i]:
                    fitness[i] = fnew
                    nests[i] = nests_new[i]
                if fitness[i] < fbest:
                    fbest = fitness[i]
                    k = i

            }
            return [nests[k], k];
        },

        getCuckoos: function(nests, best){
            n = len(nests)
            d = len(best)
            new_nests = []
            for i in range(n):
                s = nests[i]
                u = [gauss(0, 1) * sigma for _ in range(d)]
                v = [gauss(0, 1) for _ in range(d)]
                step = [ u[j] / abs(v[j]) ** (1/beta) for j in range(d)]
                stepsize = [0.01 * step[j] * (s[j]-best[j]) for j in range(d)]
                s1 = [int(s[j]+stepsize[j]*gauss(0, 1)) for j in range(d)]
                simplebounds(s1, lb, ub)
                s1 = make_feasible(s1, lb, ub)
                new_nests.append(s1)
            return new_nests
        },

        emptyNests: function(nests, lb, ub, pa){
            n = len(nests)
            //Discovered or not -- a status vector
            //determine which nest get to discover
            k = [ 1 if random.random() > pa else 0 for _ in range(n)]
            sample1 = random.sample(range(n), n)
            sample2 = random.sample(range(n), n)
            //those in sample1 difference sample2, then apply stepsize
            new_nests = []
            for i in range(n):
                s1 = nests[sample1[i]]
                s2 = nests[sample2[i]]
                stepsize = [random.random() * (s1[j]-s2[j]) for j in range(len(s1)) ]
                s = [int(nests[i][j] + stepsize[j] * k[j]) for j in range(len(s1))]
                simplebounds(s, lb, ub)
                s = make_feasible(s, lb, ub)
                new_nests.append(s)
            return new_nests
        }


    }

})()