dicecup
==================

Interprets strings (e.g. '1d6+1') to roll dice. This module uses the parser from the excellent [node-dice](https://github.com/NickMele/node-dice) with a few tweaks to interpret strings in [http://en.wikipedia.org/wiki/Dice_notation](dice notation) to make die rolls and report the results as JSON.

It will apply modifiers (pluses and minuses) and will provide a total for each space-separated group in the string. For example, the results for the `dicecup.roll('3d6 3d6 1d52 1d4')` will be something like:

    [
      {
        rolls: [
          4,
          6,
          5
        ],
        total: 15
      },
      {
        rolls: [
          4,
          3,
          4
        ],
        total: 11
      },
      {
        rolls: [
          22
        ],
        total: 22
      },
      {
        rolls: [
          3
        ],
        total: 3
      }
    ]

By default, there's no limits on the number of dice you want to roll. `node cup.js 999999d6` works on my machine. It's up to you to to limit the resources taken up by `roll` by creating diceCup with the `numberOfFacesOnLargestDie` and `numberOfRollsLimit` opts like so: 

    var cup = createDiceCup({
      probable: mockProbable,
      numberOfFacesOnLargestDie: 50000,
      numberOfRollsLimit: 125000
    });

Installation
------------

    npm install dicecup

Usage
-----

    var createDiceCup = require('dicecup');
    var cup = createDiceCup();
    console.log(cup.roll('2d4'));

As a command:

    npm -g dicecup
    cup "3d6 3d6 1d52 1d4"

Tests
-----

Run tests with `make test`.

License
-------

MIT.
