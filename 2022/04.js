const _ = require('lodash')
const assert = require('assert')
const {} = require('mathjs')
const fs = require('fs')

const puzzleInput = fs.readFileSync('./04.input').toString().split('\n')

const testData1 = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`.split('\n')
// PART 1

const parseLine = (line) => line.split(',').map(s => s.split('-').map(n => parseInt(n, 10))).flat()

const part1 = (input) => {
    const parsed = input.map(parseLine)
    
    const overlaps = parsed.map(l => {
        if (l[0] >= l[2] && l[1] <= l[3]) return true
        if (l[2] >= l[0] && l[3] <= l[1]) return true
        return false
    })
    
    return overlaps.filter(Boolean).length
}

// console.log(part1(testData1))
console.assert(part1(testData1) === 2)
// console.log(part1(puzzleInput))

// PART 2

const part2 = (input) => {
    const parsed = input.map(parseLine)

    const overlaps = parsed.map(l => {
        if (l[1] >= l[2] && l[0] <= l[3]) return true
        if (l[2] >= l[1] && l[3] <= l[0]) return true
        return false
    })
    
    return overlaps.filter(Boolean).length
}

// console.log(part2(testData1))
console.assert(part2(testData1) === 4)
// console.log(part2(puzzleInput))

	