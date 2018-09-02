var test = require('tape');
var createDiceCup = require('../dicecup');
var fixtures = require('./fixtures');

test('Multi-series', function multiSeriesTests(t) {
  var cup = createDiceCup({
    probable: fixtures.mockProbable
  });

  var outcomesForDiceStrings = {
    '3d6, 3d6, 3d6, 3d6, 3d6, 3d6': [
      {
        rolls: [6, 6, 6],
        total: 18
      },
      {
        rolls: [6, 6, 6],
        total: 18
      },      
      {
        rolls: [6, 6, 6],
        total: 18
      },      
      {
        rolls: [6, 6, 6],
        total: 18
      },      
      {
        rolls: [6, 6, 6],
        total: 18
      },      
      {
        rolls: [6, 6, 6],
        total: 18
      }
    ],
    'd4 1d20+5 ': [
      {
        rolls: [4],
        total: 4
      },
      {
        rolls: [20],
        total: 25
      }
    ],
    '7d6 1d100 80d12-32 120d2': [
      {
        rolls: [6, 6, 6, 6, 6, 6, 6],
        total: 42
      },
      {
        rolls: [100],
        total: 100
      },
      {
        rolls: fixtures.createRepeatArray(12, 80),
        total: 928
      },
      {
        rolls: fixtures.createRepeatArray(2, 120),
        total: 240
      }
    ]
  }

  t.plan(36);

  var diceStrings = Object.keys(outcomesForDiceStrings);  

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
