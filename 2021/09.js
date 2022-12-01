const _ = require('lodash')
const assert = require('assert')
const {} = require('mathjs')
const fs = require('fs')

const puzzleInput = fs.readFileSync('./09.input').toString().split('\n')

const testData1 = `2199943210
3987894921
9856789892
8767896789
9899965678`.split('\n')
// PART 1

const input = puzzleInput.map(line => line.split(''))
// console.log(input)

let risk = 0

for (const [y, line] of input.entries()) {
    for (const [x, cell] of line.entries()) {
        let minimum = true
        if (y > 0 && input[y-1][x] <= cell) {
            minimum = false
        }
        if (y < input.length - 1 && input[y+1][x] <= cell) {
            minimum = false
        }
        if (x > 0 && input[y][x-1] <= cell) {
            minimum = false
        }
        if (x < line.length - 1 && input[y][x+1] <= cell) {
            minimum = false
        }

        if (minimum) {
            risk += 1 + Number(cell)
        }
    }
}

// console.log(risk)

// PART 2
const findMins = (input) => {
    const mins = []
    for (const [y, line] of input.entries()) {
        for (const [x, cell] of line.entries()) {
            let minimum = true
            if (y > 0 && input[y-1][x] <= cell) {
                minimum = false
            }
            if (y < input.length - 1 && input[y+1][x] <= cell) {
                minimum = false
            }
            if (x > 0 && input[y][x-1] <= cell) {
                minimum = false
            }
            if (x < line.length - 1 && input[y][x+1] <= cell) {
                minimum = false
            }

            if (minimum) {
                mins.push({
                    x,
                    y,
                    v: Number(cell),
                })
            }
        }
    }
    return mins
}

const getBasinSize = (input, minPoint) => {
    // console.log('getBasin', minPoint)
    const points = []

    const expand = (point) => {
        points.push(`${point.x}-${point.y}`)
        const {x, y, v} = point
        const adjacent = [
            {x, y: y-1, v: Number(input[y-1]?.[x])},
            {x, y: y+1, v: Number(input[y+1]?.[x])},
            {x: x-1, y, v: Number(input[y]?.[x-1])},
            {x: x+1, y, v: Number(input[y]?.[x+1])},
        ]
        for (const p of adjacent) {
            if (p.v && p.v !== 9 && p.v > v && !points.includes(`${p.x}-${p.y}`)) {
                // console.log('expanding', p)
                expand(p)
            }
        }
    }

    expand(minPoint)
    return points.length
}

const input2 = puzzleInput.map(line => line.split(''))

const mins = findMins(input2)
const sizes = mins.map((p) => getBasinSize(input2, p))
console.log(sizes)


const res = _.takeRight(_.sortBy(sizes), 3).reduce((a, b) => a * b)


console.log(res)


	