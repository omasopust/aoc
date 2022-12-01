const _ = require('lodash')
const assert = require('assert')
const {} = require('mathjs')
const fs = require('fs')

const puzzleInput = fs.readFileSync('./03.input').toString().split('\n')

const testData1 = `00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`.split('\n')
// PART 1

const getRates = (data) => {
    let gammaRate = ''
    let epsilonRate = ''

    for (const pos of _.range(data[0].length)) {
        const counts = _.countBy(data.map(i => i[pos]))
        if (counts[0] > counts[1]) {
            gammaRate += 0
            epsilonRate += 1
        } else {
            gammaRate += 1
            epsilonRate += 0
        }
        // console.log(gammaRate, epsilonRate)
    }

    return [parseInt(gammaRate, 2), parseInt(epsilonRate, 2)]
}

// console.log(getRates(testData1), [22, 9])
const res = getRates(puzzleInput)
//console.log(res)
//console.log(res[0] * res[1])

// PART 2

const getRates2 = (data) => {
    const filterRecursive = (data, oxygen, bit = 0) => {
        if (data.length <= 1) return data[0]

        const counts = _.countBy(data.map(i => i[bit]))
        let lookingFor
        if (counts[1] >= counts[0]) {
            lookingFor = oxygen ? 1 : 0
        } else {
            lookingFor = oxygen ? 0 : 1
        }

        const newData = data.filter(i => i[bit] === lookingFor.toString())
        // console.log(newData)
        return filterRecursive(newData, oxygen, bit + 1)
    }

    return [
        parseInt(filterRecursive(data, true), 2),
        parseInt(filterRecursive(data, false), 2),
    ]
}

// console.log(getRates2(testData1), [23, 10])
const res2 = getRates2(puzzleInput)
console.log(res2)
console.log(res2[0] * res2[1])

	