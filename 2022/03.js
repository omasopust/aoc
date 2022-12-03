const _ = require('lodash')
const assert = require('assert')
const {} = require('mathjs')
const fs = require('fs')

const puzzleInput = fs.readFileSync('./03.input').toString().split('\n')

const testData1 = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`.split('\n')
// PART 1

const charToPrio = (char) => {
    const code = char.charCodeAt(0)
    if (code >= 97) return code - 96
    return code - 38
}

const part1 = (input) => 
    input.map((line) => {
        const [comp1, comp2] = [line.slice(0, line.length/2), line.slice(line.length/2)]
        const [item] = _.intersection(comp1.split(''), comp2.split(''))
        return charToPrio(item)
    })
    .reduce((a, b) => a+b)

console.assert(part1(testData1) === 157)
// console.log(part1(puzzleInput))

// PART 2

const part2 = (input) => {
    return (() => {
        const arr = []
        for (let i = 0; i < input.length; i += 3) {
            arr.push(_.first(_.intersection(input[i].split(''), input[i+1].split(''), input[i+2].split(''))))
        }   
        return arr     
    })().map(charToPrio).reduce((a, b) => a+b)
}

console.assert(part2(testData1) === 70)
// console.log(part2(puzzleInput))
