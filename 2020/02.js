const _ = require('lodash')
const assert = require('assert')
const {} = require('mathjs')
const fs = require('fs')

const puzzleInput = fs.readFileSync('./02.input').toString().split('\n')


// PART 1
let validCount1 = 0

for (const line of puzzleInput) {
	const [rule, string] = line.split(': ')
	const [cardinality, letter] = rule.split(' ')
	const [min, max] = cardinality.split('-')

	const regex = new RegExp(`^([^${letter}]*?[${letter}][^${letter}]*?){${min},${max}}\$`)
	const res = regex.test(string)
	if(res) {
		validCount1++
	}
}

// console.log(validCount1)

// PART 2
let validCount2 = 0

for (const line of puzzleInput) {
	const [rule, string] = line.split(': ')
	const [positions, letter] = rule.split(' ')
	const [first, second] = positions.split('-')

	if (string[first - 1] === letter ^ string[second - 1] === letter) {
		validCount2++
	}
}

// console.log(validCount2)
