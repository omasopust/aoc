const _ = require('lodash')
const assert = require('assert')
const {} = require('mathjs')
const fs = require('fs')

const puzzleInput = fs.readFileSync('./07.input').toString().split('\n')

const rules = {}
for (const row of puzzleInput) {
	const [keyStr, valuesStr] = row.split(' bags contain ')
	if (valuesStr === 'no other bags.') {
		rules[keyStr] = false
		continue
	}
	const values = valuesStr.replace('.', '').split(', ').reduce((acc, val) => {
		const [count, ...rest] = val.split(' ')
		acc[rest[0] + ' ' + rest[1]] = count
		return acc
	}, {})
	rules[keyStr] = values
}

const reverseIndex = {}
Object.keys(rules).forEach(parent => {
	const children = Object.keys(rules[parent])
	children.forEach((child) => {
		reverseIndex[child] = reverseIndex[child] || []
		reverseIndex[child].push(parent)
	})
})

// PART 1
const possibilities = []

const addPossibilities = (child) => {
	const toCheck = _.difference(reverseIndex[child], possibilities)
	possibilities.push(...toCheck)
	toCheck.forEach(name => addPossibilities(name))
}

addPossibilities('shiny gold')
// console.log(possibilities.length)


// PART 2

let buyCount = 0

const registerContents = (bagKey, count) => {
	const rule = rules[bagKey]
	if (rule === false) {
		return
	}
	Object.keys(rule).forEach(bag => {
		const required = rule[bag] * count
		buyCount += required
		registerContents(bag, required)
	})
}

registerContents('shiny gold', 1)
// console.log(buyCount)
	