const _ = require('lodash')
const assert = require('assert')
const {} = require('mathjs')
const fs = require('fs')

const puzzleInput = fs.readFileSync('./05.input').toString().split('\n')

const codeToCoords = (code) => {
	const rowCode = Array.from(code.slice(0,7)).map(char => char === 'F' ? '0' : '1').join('')
	const colCode = Array.from(code.slice(7, 10)).map(char => char === 'L' ? '0' : '1').join('')
	return [parseInt(rowCode, 2), parseInt(colCode, 2)]
}

const codeToId = (code) => {
	const [row, col] = codeToCoords(code)
	return row * 8 + col
}

assert.equal(codeToId('BFFFBBFRRR'), 567)
assert.equal(codeToId('FFFBBBFRRR'), 119)
assert.equal(codeToId('BBFFBBFRLL'), 820)

// PART 1
const maxVal = puzzleInput.reduce((acc, val) => Math.max(acc, codeToId(val)), 0)
// console.log(maxVal)

// PART 2
const map = [...Array(128).keys()].map(i => [...Array(8).keys()].map(i => ' '))
puzzleInput.forEach((code) => {
	const [row, col] = codeToCoords(code)
	map[row][col] = 'X'
})

// console.log(map.map((cell, i) => `${String(i).padStart(3)} ${cell.join('')}`).join('\n'))
