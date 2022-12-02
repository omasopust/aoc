const _ = require('lodash')
const assert = require('assert')
const {} = require('mathjs')
const fs = require('fs')

const puzzleInput = fs.readFileSync('./02.input').toString().split('\n')

const testData1 = `A Y
B X
C Z`.split('\n')
// PART 1

const winners = ['A Y', 'B Z', 'C X']
const draws = ['A X', 'B Y', 'C Z']
const values = { X: 1, Y: 2, Z: 3 }

const part1 = (input) => input.map((line) => {
    let lineVal = 0
    if (winners.includes(line)) lineVal += 6
    if (draws.includes(line)) lineVal += 3
    lineVal += values[line[2]]
    return lineVal
}).reduce((a,b) => a+b)

console.assert(part1(testData1) === 15, 'part1')
// console.log(part1(puzzleInput))

// PART 2

// w/e, this is fastest
const toNumbers = {
    'A X': 3,   'B X': 1,   'C X': 2,
    'A Y': 1+3, 'B Y': 2+3, 'C Y': 3+3,
    'A Z': 2+6, 'B Z': 3+6, 'C Z': 1+6,
}

const part2 = (input) => input.map((line) => toNumbers[line]).reduce((a,b) => a+b)

console.assert(part2(testData1) === 12)

// console.log(part2(puzzleInput))
