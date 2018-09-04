var test = require('tape');
var createDiceCup = require('../dicecup');
var fixtures = require('./fixtures');

test('No opts', function testNoOps(t) {
  t.plan(2);

  var cup = createDiceCup();
  t.equal(typeof cup, 'object', 'Cup object is created even without opts.');

  var result = cup.roll('2d4');
  t.ok(result[0].total >= 2 && result[0].total <=8, 'Result is valid.');
});

test('No dice in string', function noDiceInString(t) {
  t.plan(1);

  var cup = createDiceCup({
    probable: fixtures.mockProbable
  });

  t.deepEqual(cup.roll('fhqwhgads'), []);
});


test('Just numbers, no dice', function noDiceJustNumbersTest(t) {
  t.plan(1);
  
  var cup = createDiceCup({
    probable: fixtures.mockProbable
  });

  var results = cup.roll('justnumbers+600');
  t.deepEqual(results, [], 
    'If there are no dice in the string, returns an empty array.'
  );
});

test('Face limits', function testFaceLimits(t) {
  t.plan(6);

  var cup = createDiceCup({
    probable: fixtures.mockProbable,
    numberOfFacesOnLargestDie: 50000,
    numberOfRollsLimit: 125000
  });

  var results = cup.roll('2d4 125000d50001');

  t.equal(results[0].total, 8, 'The first result is fine and has a total.');
  t.deepEqual(results[0].rolls, [4, 4], 'The first result has rolls.');

  t.equal(
    results[1].error.name,
    'Not enough faces',
    'It returns a "Not enough faces" error.'
  );
  t.equal(
    results[1].error.message, 
    'I don\'t have a die with that many faces.',
    'It returns an error that says it can\'t roll a die with that many faces.'
  );
  t.deepEqual(results[1].rolls, [], 'It returns no rolls.');
  t.ok(isNaN(results[1].total), 'It returns a total of NaN.');

});

test('Number of rolls limits', function numberOfRollsLimits(t) {
  t.plan(6);
  
  var cup = createDiceCup({
    probable: fixtures.mockProbable,
    numberOfFacesOnLargestDie: 50000,
    numberOfRollsLimit: 125000
  });

  var results = cup.roll('125001d50000 10d6');

  t.equal(
    results[0].error.name, 
    'Too many rolls',
    'It returns a "Too many rolls" error.'
  );
  t.equal(
    results[0].error.message, 
    'I can\'t roll that many times.',
    'It returns an error that says it can\'t roll that many times.'
  );
  t.deepEqual(results[0].rolls, [], 'It returns no rolls.');
  t.ok(isNaN(results[0].total), 'It returns a total of NaN.');

  t.equal(results[1].total, 60, 'The second result is fine and has a total.');
  t.deepEqual(results[1].rolls, [6, 6, 6, 6, 6, 6, 6, 6, 6, 6], 
    'The second result has rolls.'
  );

});
