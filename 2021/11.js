const _ = require('lodash')
const assert = require('assert')
const {} = require('mathjs')
const fs = require('fs')

const puzzleInput = fs.readFileSync('./11.input').toString().split('\n')

const testData1 = `5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`.split('\n')

const testData2 = `11111
19991
19191
19991
11111`.split('\n')
// PART 1

const prepare = (input) => input.map(line => line.split('').map(Number))
const toString = (input) => input.map(line => line.join('')).join('\n')

const getId = (x, y) => `${x}-${y}`
const getCoord = (str) => ({x: Number(str.split('-')[0]), y: Number(str.split('-')[1])})

const flash = (input, x, y, flashed) => {
    // console.log('flashing', y, x)
    // console.log(input)
    const around = [
        {x: x, y: y-1},
        {x: x+1, y: y-1},
        {x: x+1, y: y},
        {x: x+1, y: y+1},
        {x: x, y: y+1},
        {x: x-1, y: y+1},
        {x: x-1, y: y},
        {x: x-1, y: y-1},
    ]

    flashed.add(getId(x, y))

    for (const p of around) {
        if (input[p.y]?.[p.x] !== undefined) {
            input[p.y][p.x]++

            // flash too if > 9
            if (input[p.y][p.x] > 9 && !flashed.has(getId(p.x, p.y))) {
                flash(input, p.x, p.y, flashed)
            }
        }
    }
}

const round = (input) => {
    const flashed = new Set()

    for (const [y, line] of input.entries()) {
        for (const [x, cell] of line.entries()) {
            // add 1
            input[y][x]++

            // if > 9 flash
            if (input[y][x] > 9 && !flashed.has(getId(x, y))) {
                flash(input, x, y, flashed)
            }
        }
    }

    // set flashed to 0
    // console.log(flashed.size)
    for (const id of Array.from(flashed)) {
        const c = getCoord(id)
        input[c.y][c.x] = 0
    }
    return flashed.size
}

const step5 = `4484144000
2044144000
2253333493
1152333274
1187303285
1164633233
1153472231
6643352233
2643358322
2243341322`

const input = prepare(puzzleInput)
let num = 0
// part 1
// _.range(193).forEach(() => { num += round(input) })

// part2
let i = 0
while (true) {
    i++
    if (round(input) === 100) {
        break
    }
}
console.log(toString(input), i)


	