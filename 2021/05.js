const _ = require('lodash')
const assert = require('assert')
const {} = require('mathjs')
const fs = require('fs')

const puzzleInput = fs.readFileSync('./05.input').toString().split('\n')

const testData1 = `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`.split('\n')

const parseLine = (lineStr) => {
    return lineStr.split(' -> ').map(p => p.split(',').map(n => parseInt(n, 10)))
}

const isNotAngled = (line) => {
    return line[0][0] === line[1][0] || line[0][1] === line[1][1]
}

const drawLineToMap = (map, line) => {
    const xOp = _.clamp(line[1][0] - line[0][0], -1, 1)
    const yOp = _.clamp(line[1][1] - line[0][1], -1, 1)

    const numOps = Math.max(Math.abs(line[0][0] - line[1][0]), Math.abs(line[0][1] - line[1][1])) + 1

    let x = line[0][0]
    let y = line[0][1]
    for (const n of _.range(numOps)) {
        // console.log(x, y)
        map[y] = map[y] ?? []
        map[y][x] = map[y][x] ?? 0
        map[y][x] += 1
        x += xOp
        y += yOp
    }
}

const countOverlaps = (map) => {
    let overlaps = 0
    for (const line of map) {
        if (!line) continue
        for (const item of line) {
            if (item >= 2) {
                overlaps++
            }
        }
    }
    return overlaps
}

// PART 1
const map = []

const lines = puzzleInput.map(parseLine)
console.log(lines)
console.log(lines.forEach((line) => drawLineToMap(map, line)))
console.log(map)
console.log(countOverlaps(map))

// PART 2

	