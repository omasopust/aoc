const _ = require('lodash')
const assert = require('assert')
const {} = require('mathjs')
const fs = require('fs')

const puzzleInput = fs.readFileSync('./06.input').toString().split('\n\n')

// PART 1
const groupAnswers1 = puzzleInput.map(group => [...(new Set(group.split('\n').join('')))].join(''))

const sum1 = groupAnswers1.join('').length
// console.log(sum1)


// PART 2
const groupAnswers2 = puzzleInput.map(group => _.intersection(...group.split('\n').map(row => Array.from(row))).join(''))

const sum2 = groupAnswers2.join('').length
//console.log(sum2)