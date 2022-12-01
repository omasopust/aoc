const _ = require('lodash')
const assert = require('assert')
const {} = require('mathjs')
const fs = require('fs')

const puzzleInput = fs.readFileSync('./07.input').toString().split(',').map(Number)

const testData1 = `16,1,2,0,4,2,7,1,2,14`.split(',').map(Number)
// console.log(testData1)
// PART 1

const countFuelConsumption = (state, position) => {
    let sum = 0
    for (const iPos of state) {
        const diff = Math.abs(iPos - position)
        // 1
        // sum += diff
        // 2
        sum += (diff + 1) * (diff / 2)
    }
    return sum
}

const input = puzzleInput
const range = _.range(_.min(input), _.max(input))
let minimal = Infinity
let pos = null
for (const candidate of range) {
    const res = countFuelConsumption(input, candidate)
    // console.log(candidate, res)
    if (res < minimal) {
        minimal = res
        pos = candidate
    } else {
        break
    }
}

console.log(minimal, pos)

	