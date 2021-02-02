function Monad () {
  var prototype = Object.create(null);
  function unit(value) {
    var monad = Object.create(prototype);
    monad.bind = function(func, args) {
      return func(value, ...args);
    }
    return monad;
  }

  unit.method = function(name, func) {
    prototype[name] = func;
    return unit;
  }

  unit.lift = function(name, func) {
    prototype[name] = function (...args) {
      return unit(this.bind(func, args));
    };
    return unit;
  }

  return unit;
}

function Monad2 (modifier) {
  var prototype = Object.create(null);
  function unit(value) {
    var monad = Object.create(prototype);
    monad.bind = function(func, args) {
      return func(value, ...args);
    }

    if (typeof modifier === 'function') {
      modifier(monad, value);
    }

    return monad;
  }

  unit.method = function(name, func) {
    prototype[name] = func;
    return unit;
  }

  unit.lift = function(name, func) {
    prototype[name] = function (...args) {
      return unit(this.bind(func, args));
    };
    return unit;
  }

  return unit;
}

var maybe = Monad2(function(monad, value) {
  if (value === null || value === undefined) {
    monad.is_null = true;
    monad.bind = function() {
      return monad;
    }
  }
});

var monad2 = maybe(null);
console.log(monad2)
monad2.bind(alert);

// var ajax = Monad().lift('alert', alert);
// var monad = ajax('hello world');
// monad.alert();


// var identity = Monad();
// var monad = identity("hello world");
// var test = monad.bind(alert);
// console.log(test)