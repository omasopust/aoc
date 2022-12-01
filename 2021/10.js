const _ = require('lodash')
const assert = require('assert')
const {} = require('mathjs')
const fs = require('fs')

const puzzleInput = fs.readFileSync('./10.input').toString().split('\n')

const testData1 = `[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]`.split('\n')
// PART 1
const MAP = {
    ')': '(',
    ']': '[',
    '}': '{',
    '>': '<',
}
const MAP_INVERTED = _.invert(MAP)
const OPENS = Object.values(MAP)

const SCORE = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137,
}

const checkLine = (line) => {
    const stack = []

    for (const char of line.split('')) {
        if (OPENS.includes(char)) {
            stack.push(char)
        } else if (MAP[char] === _.last(stack)) {
            stack.pop()
        } else {
            // corrupted
            throw char
        }
    }
    return stack
}

const part1 = (input) => {
    let score = 0
    for (const line of input) {
        try {
            const openLeft = checkLine(line)
            console.log('ok')
        } catch (e) {
            console.log('corrupted', e)
            score += SCORE[e]
        }
    }
    return score
}

// const res = part1(puzzleInput)
// console.log(res)

// PART 2

const SCORE2 = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4,
}

const part2 = (input) => {
    const scores = []

    for (const line of input) {
        let stackLeft
        try {
            stackLeft = checkLine(line)
        } catch(e) {
            continue
        }

        let score = 0
        for (const char of _.reverse(stackLeft)) {
            const toAdd = MAP_INVERTED[char]

            score *= 5
            score += SCORE2[toAdd]
        }

        // console.log(score)
        scores.push(score)
    }

    const scoresSorted = _.sortBy(scores)
    const middleIndex = (scoresSorted.length - 1) / 2
    const middle = scoresSorted[middleIndex]
    return middle
}

const res2 = part2(puzzleInput)
console.log(res2)



	