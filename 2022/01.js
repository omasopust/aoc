const _ = require('lodash')
const assert = require('assert')
const {} = require('mathjs')
const fs = require('fs')

const puzzleInput = fs.readFileSync('./01.input').toString().split('\n\n')

const testData1 = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`.split('\n\n')
// PART 1

const getElfSumsArray = (input) => input.map((elf) => elf.split('\n').reduce((a, b) => +a + +b, 0))

const mostCaloriesSum = (input) => {
    const array = getElfSumsArray(input)
    return array.reduce((acc, val) => {
        return Math.max(val, acc)
    }, 0)
}


assert(mostCaloriesSum(testData1) === 24000)

// console.log(mostCaloriesSum(puzzleInput))

// PART 2

const topThreeSum = (input) => {
    return _(getElfSumsArray(input)).sortBy().takeRight(3).sum()
}

assert(topThreeSum(testData1) === 45000)

// console.log(topThreeSum(puzzleInput))
	