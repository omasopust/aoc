const _ = require('lodash')
const assert = require('assert')
const {} = require('mathjs')
const fs = require('fs')

const puzzleInput = fs.readFileSync('./08.input').toString().split('\n')

const testData1 = `30373
25512
65332
33549
35390`.split('\n')
// PART 1

const part1 = (input) => {
    const width = input[0].length
    const height = input.length

    const checkTop = (x, y, cur) => input.map(i => i[x]).splice(0, y).every((item) => Number(item) < cur)
    const checkRight = (x, y, cur) => input[y].split('').slice(x + 1).every((item) => Number(item) < cur)
    const checkBottom = (x, y, cur) => input.map(i => i[x]).splice(y + 1).every((item) => Number(item) < cur)
    const checkLeft = (x, y, cur) => input[y].split('').slice(0, x).every((item) => Number(item) < cur)


    let count = 0
    for (const y of _.range(height)) {
        for (const x of _.range(width)) {
            const val = input[y][x]
            const visible = [
                checkTop(x, y, val),
                checkRight(x, y, val),
                checkBottom(x, y, val),
                checkLeft(x, y, val),
            ].some(Boolean)
            if (visible) count++
        }
    }

    return count
}

// console.log(part1(testData1))
console.assert(part1(testData1) === 21, 'part1')
// console.log(part1(puzzleInput))

// PART 2

const part2 = (input) => {
    const width = input[0].length
    const height = input.length

    const countVisible = (array, cur) => {
        const index = _.findIndex(array, (i) => Number(i) >= cur)
        // console.log(array, index, cur)
        if (index === -1) return array.length
        return array.slice(0, index + 1).length
    }

    const lookUp = (x, y, cur) => countVisible(input.map(i => i[x]).splice(0, y).reverse(), cur)
    const lookRight = (x, y, cur) => countVisible(input[y].split('').slice(x + 1), cur)
    const lookDown = (x, y, cur) => countVisible(input.map(i => i[x]).splice(y + 1), cur)
    const lookLeft = (x, y, cur) => countVisible(input[y].split('').slice(0, x).reverse(), cur)

    // const a = ((x,y,val) => [
    //     lookUp(x, y, val),
    //     lookRight(x, y, val),
    //     lookDown(x, y, val),
    //     lookLeft(x, y, val),
    // ])(1, 1, 5)
    // console.log(a)

    let maxScore = 0
    for (const y of _.range(height)) {
        for (const x of _.range(width)) {
            const val = input[y][x]
            const score = [
                lookUp(x, y, val),
                lookRight(x, y, val),
                lookDown(x, y, val),
                lookLeft(x, y, val),
            ].reduce((a,b) => a*b)
            // console.log(score)
            maxScore = Math.max(maxScore, score)
        }
    }

    return maxScore
}

// console.log(part2(testData1))
console.assert(part2(testData1) === 8)
// console.log(part2(puzzleInput))

	