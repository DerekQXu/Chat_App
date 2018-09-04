// For reduced test confusion, we're using a mock version of probable that 
// doesn't actually return random results. This way we can easily predict what 
// the results should be.

var mockProbable = {
  rollDie: function rollDie(sides) {
    return sides;
  }
};

function createRepeatArray(value, times) {
  var array = [];
  for (var i = 0; i < times; ++i) {
    array.push(value);
  }
  return array;
}

module.exports = {
  mockProbable: mockProbable,
  createRepeatArray: createRepeatArray
};
