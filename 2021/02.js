const _ = require('lodash')
const assert = require('assert')
const {} = require('mathjs')
const fs = require('fs')

const puzzleInput = fs.readFileSync('./02.input').toString().split('\n')

// PART 1
const testData = `forward 5
down 5
forward 8
up 3
down 8
forward 2`.split('\n')

const getPosition = (initial, path) => {
    let forward = 0
    let depth = 0

    for (const movement of path) {
        const [direction, valStr] = movement.split(' ')
        const val = parseInt(valStr, 10)
        switch(direction) {
            case 'forward':
                forward += val
                break
            case 'down':
                depth += val
                break
            case 'up':
                depth -= val
                break
        }
    }

    return [forward, depth]
}

const testPos = getPosition([0, 0], testData)
assert(testPos[0] * testPos[1] === 150)

const pos = getPosition([0, 0], puzzleInput)
// console.log(pos[0] * pos[1])

// PART 2
const getAimPosition = (initial, path) => {
    let forward = 0
    let depth = 0
    let aim = 0

    for (const movement of path) {
        const [direction, valStr] = movement.split(' ')
        const val = parseInt(valStr, 10)
        switch(direction) {
            case 'forward':
                forward += val
                depth += val * aim
                break
            case 'down':
                aim += val
                break
            case 'up':
                aim -= val
                break
        }
    }

    return [forward, depth]
}

const testPos2 = getAimPosition([0, 0], testData)
// console.log(testPos2)
assert(testPos2[0] * testPos2[1] === 900)

const pos2 = getAimPosition([0, 0], puzzleInput)
console.log(pos2[0] * pos2[1])


	