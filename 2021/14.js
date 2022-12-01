const _ = require('lodash')
const assert = require('assert')
const {} = require('mathjs')
const fs = require('fs')

const puzzleInput = fs.readFileSync('./14.input').toString()

const testData1 = `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`
// PART 1

const prepare = (input) => {
    const [templateStr, rulesStr] = input.split('\n\n')
    const template = templateStr.split('')
    const counts = {}
    for (let i = 1; i < template.length; i++) {
        const tuple = `${template[i-1]}${template[i]}`
        counts[tuple] = counts[tuple] ?? 0
        counts[tuple]++
    }

    const rules = {}
    for (const rule of rulesStr.split('\n')) {
        const [from, to] = rule.split(' -> ')
        rules[from] = [from[0] + to, to + from[1]]
    }
    return {counts, rules, template}
}

const runRound = (counts, rules) => {
    const newCounts = {}
    for (const [pair, count] of Object.entries(counts)) {
        for (const newPair of rules[pair]) {
            newCounts[newPair] = newCounts[newPair] ?? 0
            newCounts[newPair] += count
        }
    }

    return newCounts
}

const getCounts = (pairCounts, template) => {

    const charCounts = {}

    for (const [pair, count] of Object.entries(pairCounts)) {
        const [a, b] = pair.split('')
        charCounts[a] = charCounts[a] ?? 0
        charCounts[b] = charCounts[b] ?? 0
        charCounts[a] += count
        charCounts[b] += count
    }

    const first = _.first(template)
    const last = _.last(template)
    charCounts[first]++
    charCounts[last]++

    for (const [char, val] of Object.entries(charCounts)) {
        charCounts[char] = charCounts[char] / 2
    }

    return charCounts
}


const {counts, rules, template} = prepare(puzzleInput)
let pairCounts = counts
console.log(counts)
for (const i of _.range(40)) {
    pairCounts = runRound(pairCounts, rules)
}

const countRes = getCounts(pairCounts, template)
const max = Math.max(..._.values(countRes))
const min = Math.min(..._.values(countRes))
console.log(countRes, max, min, max - min)




// PART 2

	