var test = require('tape');
var createDiceCup = require('../dicecup');
var fixtures = require('./fixtures');

test('Single-series', function singleSeriesTests(t) {
  var cup = createDiceCup({
    probable: fixtures.mockProbable
  });

  var outcomesForDiceStrings = {
    '1d6': [
      {
        rolls: [6],
        total: 6
      }
    ],
    'd4': [
      {
        rolls: [4],
        total: 4
      }
    ],
    '3d6': [
      {
        rolls: [6, 6, 6],
        total: 18
      }
    ],
    '2d8+3': [
      {
        rolls: [8, 8],
        total: 19
      }
    ],
    'd20': [
      {
        rolls: [20],
        total: 20
      }
    ],
    '10d6-10': [
      {
        rolls: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        total: 50
      }
    ],
    '1d2-3': [
      {
        rolls: [2],
        total: -1
      }
    ],
    'asdf8d12': [
      {
        rolls: fixtures.createRepeatArray(12, 8),
        total: 96
      }
    ],
    '23d0': [
      {
        rolls: fixtures.createRepeatArray(0, 23),
        total: 0
      }
    ],
    '3d0-1': [
      {
        rolls: [0, 0, 0],
        total: -1
      }
    ],
    '124345d46456': [
      {
        rolls: fixtures.createRepeatArray(46456, 124345),
        total: 5776571320
      }
    ],
    '@r0llb0t d20!!!': [
      {
        rolls: [20],
        total: 20
      }
    ]
  }

  var diceStrings = Object.keys(outcomesForDiceStrings);
  
  t.plan(diceStrings.length * 3);
  
  diceStrings.forEach(function rollString(diceString) {
    var results = cup.roll(diceString);
    var expectedResults = outcomesForDiceStrings[diceString];

    results.forEach(function checkResult(result, i) { 
      t.deepEqual(result.rolls, expectedResults[i].rolls);
      t.equal(result.total, expectedResults[i].total);
      t.equal(typeof result.source, 'object');
    });
  });

});
