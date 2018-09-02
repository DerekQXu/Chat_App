#!/usr/bin/env node

var createDiceCup = require('./dicecup');

if (process.argv.length < 3) {
  console.log('Usage: node cup.js 3d6');
  process.exit();
}

var diceString = process.argv[2];

var cup = createDiceCup();

console.log(JSON.stringify(cup.roll(diceString), null, '  '));
