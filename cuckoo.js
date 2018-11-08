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
                if (s[i]<Lb[i]){
                    s[i]=Lb[i]
                }
                else{
                    if (s[i]>Ub[i]){
                        s[i]=Ub[i]
                    }
                }
            }
            return s;
        },

        makeFeasible: function (s, Lb, Ub){// need to fix 
            all = new Set(Array.from(new Array(Ub-Lb+1), (x,i) => i + lb))
            s1 = set(s)
            if (s1 == s)
            {                
                return s
            }
            diff = list(all.difference(s1))
            return list(s1) + random.sample(diff, len(s)-len(s1))

        }







    }

    

    function 





})()