const _ = require('lodash')
const assert = require('assert')
const {} = require('mathjs')
const fs = require('fs')

const puzzleInput = fs.readFileSync('./10.input').toString().split('\n')
const data = puzzleInput.map(i => parseInt(i, 10)).sort((a, b) => a - b)

// PART 1
const reduceAdapters = (data) => data.reduce((acc, val) => {
	if (!acc.valid) return acc
	if (acc.last === val || (val - acc.last) > 3) {
		acc.valid = false
		return acc
	}

	const diff = (val - acc.last)
	acc[diff]++
	acc.steps.push(diff)
	acc.last = val
	return acc

}, {1: 0, 2: 0, 3: 1, valid: true, last: 0, steps: []})

const res = reduceAdapters(data)

// PART 2
const combination = (dato) => dato.join('').split('3').filter(i => i.length > 1).map(i => i.length).map(i => {
	switch(i) {
		case 2: return 2
		case 3: return 4
		case 4: return 7
		case 5: return 13
	}
}).reduce((a, b) => a*b)

const res2 = combination(res.steps)

// console.log(res2)
	