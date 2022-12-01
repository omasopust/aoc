const _ = require('lodash')
const assert = require('assert')
const {} = require('mathjs')
const fs = require('fs')

const puzzleInput = fs.readFileSync('./09.input').toString().split('\n')

const testData = `35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576`.split('\n').map(i => parseInt(i, 10))

const data = puzzleInput.map(i => parseInt(i, 10))

const findSummand = (array, sumPosition, lookback) => {
	assert(sumPosition >= lookback)

	let cursor = sumPosition - lookback
	while (cursor < sumPosition) {
		const posToCheck = [...(new Array(sumPosition - cursor - 1).keys())]
		if(posToCheck.some((pos) => array[cursor] + array[cursor + pos + 1] === array[sumPosition])) {
			return true
		}
		cursor++
	}
	return false
}


// PART 1
const findInvalid = (array, preamble) => {
	const lookback = preamble

	for (const pos of Object.keys(array)) {
		if (pos < preamble) continue

		if (findSummand(array, pos, lookback)) {
			continue
		}
		return pos
	}
	return false
}

assert.equal(testData[findInvalid(testData, 5)], 127)

const res = findInvalid(data, 25)
// console.log(res, data[res])
// 508 26796446



// PART 2
const findContSet = (array, targetSum) => {

	for (const i of Object.keys(array)) {
		let cursor = parseInt(i, 10) + 1
		let workingSum = array[i]
		while (cursor < array.length) {
			workingSum += array[cursor]

			if (workingSum === targetSum) {
				return [i, cursor]
			}

			if (workingSum > targetSum) {
				break
			}

			cursor++
		}
	}
	return false
}

const getSetSum = (array, setRange) => {
	const set = array.slice(setRange[0], setRange[1] + 1)
	const max = Math.max(...set)
	const min = Math.min(...set)
	return max + min
}

assert.equal(getSetSum(testData , findContSet(testData, 127)), 62)
const set = findContSet(data, 26796446)
const res2 = getSetSum(data, set)

// console.log(res2)
	