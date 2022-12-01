const _ = require('lodash')
const assert = require('assert')
const {} = require('mathjs')
const fs = require('fs')

const testData = [199, 200, 208, 210, 200, 207, 240, 269, 260, 263]
const puzzleInput = fs.readFileSync('./01.input').toString().split('\n')

const puzzleData = puzzleInput.map(i => parseInt(i, 10))

// PART 1
const countNumberofIncreases = (data) => {
    let prev = null
    let increasesCounter = 0

    for (const i of data) {
        if (prev !== null && i > prev) {
            increasesCounter++
        }
        prev = i
    }

    return increasesCounter
}

console.assert(countNumberofIncreases(testData) === 7, 'part1')
console.log('part1', countNumberofIncreases(puzzleData))


// PART 2
const countNumberOfIncreasesSliding = (data, window = 3) => {
    let prev = null
    let increasesCounter = 0

    for (let i = window - 1; i < data.length; i++) {
        const sum = data[i] + data[i - 1] + data[i - 2]
        if (prev !== null && sum > prev) {
            increasesCounter++
        }
        prev = sum
    }

    return increasesCounter
}

console.assert(countNumberOfIncreasesSliding(testData) === 5, 'part2')
console.log('part2', countNumberOfIncreasesSliding(puzzleData))
