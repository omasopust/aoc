const _ = require('lodash')
const fs = require('fs')

const TIME = true
const END_PUZZLE = 14
const START_PUZZLE = 1
const FORCE_SKIP = [3]

const puzzles = [..._.range(START_PUZZLE,END_PUZZLE + 1).map(n => n < 10 ? `0${n}` : n.toString())]

const run = () => {
	for (const puzzle of puzzles) {
		const label = `Puzzle ${puzzle}`
		if (FORCE_SKIP.includes(parseInt(puzzle))) {
			if (TIME) console.log(label, 'skipped')
			continue
		}
		if (TIME) console.time(label)
		try {
			// run puzzle
			require(`./${puzzle}`)
		} catch (err) {
			if (err.message.startsWith('Cannot find module')) {
				createPuzzleFile(puzzle)
			} else throw err
		}
		if (TIME) console.timeEnd(label)
	}
}

const createPuzzleFile = (puzzle) => {
	const filename = `${puzzle}.js`
	if (fs.existsSync(filename)) return console.error('skipped creating ' + filename)
	fs.writeFileSync(`${puzzle}.js`, `const _ = require('lodash')
const assert = require('assert')
const {} = require('mathjs')
const {} = require('./utils')
const Program = require('./intcode-computer')

const puzzleInput = ''

// PART 1

// PART 2

`)


}

run()

