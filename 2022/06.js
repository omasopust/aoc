const _ = require('lodash')
const assert = require('assert')
const {} = require('mathjs')
const fs = require('fs')

const puzzleInput = fs.readFileSync('./06.input').toString().split('')

const testData1 = `bvwbjplbgvbhsrlpgdmjqwftvncz`.split('')
const testData2 = `nppdvjthqldpwncqszvftbrmjlhg`.split('')
const testData3 = `nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg`.split('')
const testData4 = `zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`.split('')
// PART 1

const findNdiffCharsIndex = (input, n) => {
    console.log('start')
    for (const i of Object.keys(input)) {
        if (i < (n - 1)) continue
        const set = new Set(input.slice(+i - n + 1, +i + 1))
        if (set.size === n) return +i + 1
    }
}


const part1 = (input) => {
    return findNdiffCharsIndex(input, 4)
}

// console.log(part1(testData1), part1(testData2), part1(testData3), part1(testData4))
// console.assert(part1(testData1))
// console.log(part1(puzzleInput))

// PART 2

const part2 = (input) => {
    return findNdiffCharsIndex(input, 14)
}

// console.log(part2(testData1), part2(testData2), part2(testData3), part2(testData4))
// console.assert(part2(testData1))
// console.log(part2(puzzleInput))

	