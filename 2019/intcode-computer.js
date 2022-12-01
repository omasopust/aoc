const _ = require('lodash')

const get = (tape, pos) => {
	const posVal = tape[pos]
	return posVal === undefined ? 0 : posVal
}

const YIELD = 'yield-now'

const createOperation = (fn, shallOutput = true, shallYield = false) => {
	const arity = fn.length
	const argRange = [...Array(arity).keys()]
	return (runtime, mode = []) => {
		const args = argRange.map(i => {
			const memVal = get(runtime.memory, runtime.headPos + i + 1)
			// if mode[i] === truthy: use immediate mode
			switch (mode[i]) {
				case '0':
				case undefined:
					return get(runtime.memory, memVal)
				case '1':
					return memVal
				case '2':
					return get(runtime.memory, memVal + runtime.relBase)
				default:
					throw new Error('Invalid op mode ' + mode[i])
			}
		})
		const outputVal = get(runtime.memory, runtime.headPos + 1 + arity)
		const outputPos = mode[arity] === '2' ? outputVal + runtime.relBase : outputVal
		// set head before execution in case of head moving
		runtime.headPos += arity + 1 + (shallOutput ? 1 : 0)

		const result = fn.bind(runtime)(...args)
		if (shallOutput) {
			runtime.memory[outputPos] = result
		}
		const continues = !runtime.done
		return shallYield && runtime.stepping ? (continues && YIELD) : continues
	}
}

const INSTRUCTIONS = {
	ADD: {
		code: 1,
		fn: createOperation((a, b) => a + b),
	},
	MLTPLY: {
		code: 2,
		fn: createOperation((a, b) => a * b),
	},
	STDIN: {
		code: 3,
		fn: createOperation(function ()  {
			return this.stdin.splice(0, 1)[0]
		}),
	},
	STDOUT: {
		code: 4,
		fn: createOperation(function (a) { this.stdout.push(a) }, false, true),
	},
	JMP_TRUE: {
		code: 5,
		fn: createOperation(function (a, b) {
			if (a !== 0) this.headPos = b
		}, false),
	},
	JMP_FALSE: {
		code: 6,
		fn: createOperation(function (a, b) {
			if (a === 0) this.headPos = b
		}, false),
	},
	LT: {
		code: 7,
		fn: createOperation(function (a, b) {
			return (a < b) ? 1 : 0
		}),
	},
	EQL: {
		code: 8,
		fn: createOperation(function (a, b) {
			return (a === b) ? 1 : 0
		}),
	},
	BASE_ADJ: {
		code: 9,
		fn: createOperation(function(a) {
			this.relBase += a
		}, false)
	},
	HALT: {
		code: 99,
		fn: createOperation(function () { this.done = true }, false),
	}
}

insByCode = _.keyBy(_.mapValues(INSTRUCTIONS, (obj, key) => {
	obj.name = key
	return obj
}), 'code')

class Program {
	constructor(program) {
		if (typeof program === 'string') {
			program = program.split(',')
		}
		this.program = program.map((str) => parseInt(str))
	}

	run(input) {
		const run = this._runSteps(input)
		let out
		while (!(out = run.next()).done) {}
		return out.value
	}

	runSteps(input) {
		return this._runSteps(input, true)
	}

	*_runSteps(input, stepping = false) {
		const runtime = {
			stdin: (input !== undefined && _.castArray(input)) || [],
			stdout: [],
			memory: [...this.program],
			headPos: 0,
			relBase: 0,
			stepping,
			done: false,
		}
		let execRes
		while (execRes = this._execPos(runtime)) {
			if (execRes === YIELD) {
				const nextInput = yield runtime
				if (typeof nextInput !== 'undefined') {
					runtime.stdin.push(..._.castArray(nextInput))
				}
			}
		}
		return runtime
	}

	_execPos(rt) {
		const insString = rt.memory[rt.headPos] && rt.memory[rt.headPos].toString()
		if (!insString) throw new Error('Out of memory scope!')
		const [one, two, ...modeFlags] = insString.split('').reverse()
		const insCode = parseInt([one, two].reverse().join(''))

		const ins = insByCode[insCode]
		if (!ins) throw new Error('Unknown instruction code ' + insCode)

		// Call instruction
		return ins.fn(rt, modeFlags)
	}
}

module.exports = Program
