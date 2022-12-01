const _ = require('lodash')
const assert = require('assert')
const {} = require('mathjs')
const fs = require('fs')

const program = fs.readFileSync('./08.input').toString().split('\n')

const read = (str) => {
	const [instruction, arg] = str.split(' ')
	return [instruction, parseInt(arg, 10)]
}

const runProgram = (swapPosition) => {
	let carrier = 0
	let acc = 0
	const visitedIns = new Set()

	while(!visitedIns.has(carrier)) {
		const instruction = program[carrier]
		if (!instruction) {
			return [true, acc] // correct termination
		}
		let [op, arg] = read(instruction)

		// part 2 changes
		if (carrier === parseInt(swapPosition) && ['jmp', 'nop'].includes(op)) {
			op = op === 'jmp' ? 'nop' : 'jmp'
		}

		visitedIns.add(carrier)
		switch (op) {
			case 'acc':
				acc += arg
				carrier++
				break
			case 'jmp':
				carrier += arg
				break
			case 'nop':
				carrier++
				break
		}
	}
	return [false, acc] // would loop
}

// PART 1

const [, acc] = runProgram('')
// console.log(acc)

// PART 2
for (const i of Object.keys(program)) {
	const [finished, acc] = runProgram(i)
	if (finished) {
		// console.log(acc)
		return
	}
}
