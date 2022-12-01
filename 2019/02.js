const Program = require('./intcode-computer')

const tapeInput = [1,0,0,3,1,1,2,3,1,3,4,3,1,5,0,3,2,1,10,19,1,6,19,23,1,10,23,27,2,27,13,31,1,31,6,35,2,6,35,39,1,39,5,43,1,6,43,47,2,6,47,51,1,51,5,55,2,55,9,59,1,6,59,63,1,9,63,67,1,67,10,71,2,9,71,75,1,6,75,79,1,5,79,83,2,83,10,87,1,87,5,91,1,91,9,95,1,6,95,99,2,99,10,103,1,103,5,107,2,107,6,111,1,111,5,115,1,9,115,119,2,119,10,123,1,6,123,127,2,13,127,131,1,131,6,135,1,135,10,139,1,13,139,143,1,143,13,147,1,5,147,151,1,151,2,155,1,155,5,0,99,2,0,14,0]
const assert = require('assert')

const copy = (tape) => JSON.parse(JSON.stringify(tape))


// test
assert.deepStrictEqual((new Program([1,0,0,0,99])).run().memory, [2,0,0,0,99])
assert.deepStrictEqual((new Program([2,3,0,3,99])).run().memory, [2,3,0,6,99])
assert.deepStrictEqual((new Program([2,4,4,5,99,0])).run().memory, [2,4,4,5,99,9801])
assert.deepStrictEqual((new Program([1,1,1,4,99,5,6,0,99])).run().memory, [30,1,1,4,2,5,6,0,99])
assert.deepStrictEqual((new Program([1,9,10,3,2,3,11,0,99,30,40,50])).run().memory, [3500,9,10,70,2,3,11,0,99,30,40,50])

const tape = copy(tapeInput)
tape[1] = 12
tape[2] = 2
assert.strictEqual((new Program(copy(tape))).run().memory[0], 6327510)

//PART 2

const wanted = 19690720
const range = [...Array(100).keys()]

for (let noun of range) {
	for (let verb of range) {

		const tapeCpy = copy(tapeInput)
		tapeCpy[1] = noun
		tapeCpy[2] = verb
		// console.log(tapeCpy)

		const res = (new Program(tapeCpy)).run().memory
		if (res[0] === wanted) {
			assert.strictEqual(res[1] * 100 + res[2], 4112)
		}
	}
}
