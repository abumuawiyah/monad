
function ajax(url) {
  const value = { data: {id: 1, name: 'azizi'} }
  const monad = {
    then: (cb) => {
      cb(value);
      return monad;
    }
  }
  return monad;
}

class MaybeIntercept {
    constructor(value) {
      this.__value = value;
    }
    static NonIntercept() {
      return MaybeIntercept.of(null);
    }
    static of(valueToBox){
      return new MaybeIntercept(valueToBox);
    }
    flatMap(fn){
      if(this.isNothing()) return MaybeIntercept.NonIntercept();
      const m = fn(this.__value);

      return m.isNothing() ? 
           MaybeIntercept.NonIntercept() : 
           MaybeIntercept.of(m.__value);
    }
    getOrElse(elseVal) {
      return this.isNothing() ? elseVal : this.__value;
    }
    getOrEmptyArray() {
      return this.getOrElse([]);
    }
    getOrNull() {
      return this.getOrElse(null);
    }
    isNothing() {
      return this.__value === null || this.__value === undefined;
    }
    map(fn) {  
      return this.isNothing()?       
               MaybeIntercept.of(null):
               MaybeIntercept.of(fn(this.__value));
    }
}

class Maybe {
    constructor(value) {
      this.__value = value;
    }
    static Nothing() {
      return Maybe.of(null);
    }
    static of(valueToBox){
      return new Maybe(valueToBox);
    }
    flatMap(fn){
      if(this.isNothing()) return Maybe.Nothing();
      const m = fn(this.__value);

      return m.isNothing() ? 
           Maybe.Nothing() : 
           Maybe.of(m.__value);
    }
    getOrElse(elseVal) {
      return this.isNothing() ? elseVal : this.__value;
    }
    getOrEmptyArray() {
      return this.getOrElse([]);
    }
    getOrNull() {
      return this.getOrElse(null);
    }
    isNothing() {
      return this.__value === null || this.__value === undefined;
    }
    map(fn) {  
      return this.isNothing()?       
               Maybe.of(null):
               Maybe.of(fn(this.__value));
    }
}

const value = 2;
const mbValue = Maybe.of(value);
const mapper = x => Maybe.of(x * 2);

console.log(mbValue.flatMap(mapper));

const mbValue2 = Maybe.of(2);
const mapper2 = x => Maybe.of(x);
console.log(mbValue2.flatMap(mapper2));

const f = val => Maybe.of(val + 1);
const g = val => Maybe.of(val * 2);
const m = Maybe.of(1);

const lhs = m.flatMap(f).flatMap(g);
const rhs = m.flatMap(x => f(x).flatMap(g));

console.log(lhs,rhs);

const aj = ajax('abc')
  .then((v) => console.log(v))
  .then((v) => console.log('my id', v.data.id))
  .then((v) => console.log('name', v.data.name));

if (true) {
  aj.then(v => console.log(v))
}

function identityMonad(value) {
    var monad = Object.create(null);
    
    // func should return a monad
    monad.bind = function (func, ...args) {
        return func(value, ...args);
    };

    // whatever func does, we get our monad back
    monad.call = function (func, ...args) {
        func(value, ...args);

        return identityMonad(value);
    };
    
    // func doesn't have to know anything about monads
    monad.apply = function (func, ...args) {
        return identityMonad(func(value, ...args));
    };

    // Get the value wrapped in this monad
    monad.value = function () {
        return value;
    };
    
    return monad;
};

var add = (x, ...args) => x + args.reduce((r, n) => r + n, 0),
    multiply = (x, ...args) => x * args.reduce((r, n) => r * n, 1),
    divideMonad = (x, ...args) => identityMonad(x / multiply(...args)),
    log = x => console.log(x),
    substract = (x, ...args) => x - add(...args);

identityMonad(100)
    .apply(add, 10, 29, 13)
    .apply(multiply, 2)
    .bind(divideMonad, 2)
    .apply(substract, 67, 34)
    .apply(multiply, 1239)
    .bind(divideMonad, 20, 54, 2)
    .apply(Math.round)
    .call(log); // Logs 29

  