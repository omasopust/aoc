const Program = require('./intcode-computer')
const _ = require('lodash')
const assert = require('assert')

const programCode = '3,8,1001,8,10,8,105,1,0,0,21,46,59,84,93,110,191,272,353,434,99999,3,9,101,2,9,9,102,3,9,9,1001,9,5,9,102,4,9,9,1001,9,4,9,4,9,99,3,9,101,3,9,9,102,5,9,9,4,9,99,3,9,1001,9,4,9,1002,9,2,9,101,2,9,9,102,2,9,9,1001,9,3,9,4,9,99,3,9,1002,9,2,9,4,9,99,3,9,102,2,9,9,1001,9,5,9,1002,9,3,9,4,9,99,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,99,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,2,9,4,9,99,3,9,101,1,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,99,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,99,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,99'.split(',')

// StackOverflow cheatz
// https://stackoverflow.com/questions/9960908/permutations-in-javascript/37580979#37580979
function permute(permutation) {
	let length = permutation.length,
		result = [permutation.slice()],
		c = new Array(length).fill(0),
		i = 1, k, p;

	while (i < length) {
		if (c[i] < i) {
			k = i % 2 && c[i];
			p = permutation[i];
			permutation[i] = permutation[k];
			permutation[k] = p;
			++c[i];
			i = 1;
			result.push(permutation.slice());
		} else {
			c[i] = 0;
			++i;
		}
	}
	return result;
}

const chainProgram = (program, config, subResult = 0) => {
	for (let conf of config) {
		subResult = _.last(program.run([conf, subResult]).stdout)
	}
	return subResult
}

assert.strictEqual(chainProgram(new Program('3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0'), [4,3,2,1,0]), 43210)
assert.strictEqual(chainProgram(new Program('3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0'), [0,1,2,3,4]), 54321)
assert.strictEqual(chainProgram(new Program('3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0'), [1,0,4,3,2]), 65210)

const program = new Program(programCode)

const highest = permute([0, 1, 2, 3, 4]).reduce((acc, val) => {
	const res = chainProgram(program, val)
	if (res > acc) return res
	return acc
}, 0)

assert.strictEqual(highest, 19650)

// PART 2
const loopBack = (program, config, subResult = 0) => {
	const runningBoxes = []
	let i = 0
	let done = false
	let subResultRaw
	while (!(done && (i % config.length) === 0)) {
		if (i < config.length) runningBoxes.push(program.runSteps([config[i], subResult]))
		subResultRaw = runningBoxes[i % config.length].next(subResult)
		subResult = _.last(subResultRaw.value.stdout)
		done = subResultRaw.value.done
		i++
	}
	return subResult
}

// TEST
assert.strictEqual(loopBack(new Program('3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5'), [9,8,7,6,5]), 139629729)
assert.strictEqual(loopBack(new Program('3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10'), [9,7,8,5,6]), 18216)


// PUZZLE SOLUTION
const highestLoop = permute([5, 6, 7, 8, 9]).reduce((acc, val) => {
	const res = loopBack(program, val)
	if (res > acc) return res
	return acc
}, 0)

assert.strictEqual(highestLoop, 35961106)
// assert.strictEqual(highestLoop)
