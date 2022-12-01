const _ = require('lodash')
const assert = require('assert')
const {} = require('mathjs')
const fs = require('fs')

const puzzleInput = fs.readFileSync('./13.input').toString()

const testData1 = `6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5`
// PART 1

const generate = (dots) => {
    const field = []
    for (const pointStr of dots) {
        const [x, y] = pointStr.split(',')
        field[y] = field[y] ?? []
        field[y][x] = true
    }
    return field
}

const mergeLines = (a, b) => {
    if (!a) return b
    if (!b) return a
    const len = Math.max(a.length, b.length)
    return _.range(len).map((i) => a[i] || b[i])
}

const mergeCols = () => {

}

const foldHor = (field, y) => {
    field[y] = undefined
    for (let i = 1; i <= y; i++) {
        field[y - i] = mergeLines(field[y + i], field[y - i])
        field[y + i] = undefined
    }
}

const foldVer = (field, x) => {
    for (const line of field) {
        if (!line) continue
        line[x] = undefined
        for (let i = 1; i <= x; i++) {
            line[x - i] = line[x - i] || line[x + i]
            line[x + i] = undefined
        }
    }
}

const runFolds = (field, folds) => {
    for (const fold of folds) {
        const def = fold.split('fold along ')[1]
        const [type, val] = def.split('=')
        if (type === 'x') {
            foldVer(field, Number(val))
        }
        if (type === 'y') {
            foldHor(field, Number(val))
        }
    }
}

const visualize = (field, maxX, maxY) => {
    let str = ''
    for (const [y, line] of field.entries()) {
        if (y > maxY || !line) break
        for (const [x, cell] of line.entries()) {
            if (x > maxX) break
            str += cell ? '#' : '.'
        }
        str += '\n'
    }
    return str
}

const [dots, folds] = puzzleInput.split('\n\n').map(sect => sect.split('\n'))
//console.log(dots, folds)
let field = generate(dots)
//foldVer(field, 655)
runFolds(field, folds)
const sum = field.reduce((acc, line) => {return acc + _.compact(line).length}, 0)
console.log(visualize(field, 40, 6), sum)


// PART 2

	