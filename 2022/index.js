const _ = require('lodash')
const fs = require('fs')

const TIME = true
const END_PUZZLE = 2
const START_PUZZLE = 1
const FORCE_SKIP = []

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
                createInputFile(puzzle)
            } else throw err
        }
        if (TIME) console.timeEnd(label)
    }
}

const createInputFile = (puzzle) => {
    const filename = `${puzzle}.input`
    if (fs.existsSync(filename)) return console.error('skipped creating ' + filename)
    fs.writeFileSync(filename, '')
}

const createPuzzleFile = (puzzle) => {
    const filename = `${puzzle}.js`
    if (fs.existsSync(filename)) return console.error('skipped creating ' + filename)
    fs.writeFileSync(filename, `const _ = require('lodash')
const assert = require('assert')
const {} = require('mathjs')
const fs = require('fs')

const puzzleInput = fs.readFileSync('./${puzzle}.input').toString().split('\\n')

const testData1 = \`\`.split('\\n')
// PART 1


// PART 2

	`)


}

run()

