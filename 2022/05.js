const _ = require('lodash')
const assert = require('assert')
const {} = require('mathjs')
const fs = require('fs')

const puzzleInput = fs.readFileSync('./05.input').toString()

const testData1 = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`

// PART 1 

const parse = (input) => {
    const [stateRaw, stepsRaw] = input.split('\n\n').map(p => p.split('\n'))
    stateRaw.reverse()
    const stacksCount = stateRaw.shift().split('   ').length

    const state = []
    for (const line of stateRaw) {
        for (let i = 0; i < stacksCount; i++) {
            state[i] ??= []
            const crate = line.substring(4*i, 4*i + 3)
            if (crate !== '   ') state[i].push(crate)
        }
    }

    const steps = stepsRaw.map(s => s.match(/[0-9]+/g).map(Number))

    return {state, steps}
}

const part1 = (input) => {
    const data = parse(input)
    data.steps.forEach(s => {
        const moving = data.state[s[1]-1].splice(-s[0])
        data.state[s[2]-1].push(...moving.reverse())
    })
    return data.state.map(s => _.last(s).substring(1,2)).join('')
}

// console.log(part1(testData1))
console.assert(part1(testData1) === 'CMZ')
// console.log(part1(puzzleInput))

// PART 2

const part2 = (input) => {
    const data = parse(input)
    data.steps.forEach(s => {
        const moving = data.state[s[1]-1].splice(-s[0])
        data.state[s[2]-1].push(...moving)
    })
    return data.state.map(s => _.last(s).substring(1,2)).join('')
}

// console.log(part2(testData1))
console.assert(part2(testData1) === 'MCD')
console.log(part2(puzzleInput))

	