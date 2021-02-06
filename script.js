
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

  