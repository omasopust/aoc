const _ = require('lodash')
const assert = require('assert')
const {} = require('mathjs')
const fs = require('fs')

const puzzleInput = fs.readFileSync('./06.input').toString().split(',')

const testData1 = `3,4,3,1,2`.split(',')
// PART 1
const progressDay = (state) => {
    const newState = {}
    for (const [i, val] of Object.entries(state)) {
        if (i === '0') {
            newState[8] = val
            newState[6] = val
        } else {
            newState[i - 1] = newState[i - 1] ?? 0
            newState[i - 1] += val
        }
    }
    return newState
}

const sumState = (state) => {
    let sum = 0
    for (const val of Object.values(state)) {
        sum += val
    }
    return sum
}

let currentState = _.countBy(puzzleInput.map(n => parseInt(n, 10)))
for (const day of _.range(256)) {
    currentState = progressDay(currentState)
    // console.log('day', day, sumState(currentState))
}

// console.log(sumState(currentState), 5934)
// console.log(sumState(currentState), 26984457539)
// console.log(sumState(currentState))
	