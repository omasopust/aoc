const _ = require('lodash')
const assert = require('assert')
const {} = require('mathjs')
const fs = require('fs')

const puzzleInput = fs.readFileSync('./08.input').toString().split('\n')

const testData1 = `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`.split('\n')


// PART 1

// console.log(_.flatten(puzzleInput.map(l => l.split('|')[1].split(' '))).filter(i => i.length === 2 || i.length=== 3 || i.length === 4 || i.length === 7).length)


// PART 2

const alphabet = 'abcdefg'.split('')
const numbers = {
    0: 'abcefg',    // 6
    1: 'cf',        // 2 <-
    2: 'acdeg',     // 5
    3: 'acdfg',     // 5
    4: 'bcdf',      // 4 <-
    5: 'abdfg',     // 5
    6: 'abdefg',    // 6
    7: 'acf',       // 3 <-
    8: 'abcdefg',   // 7 <-
    9: 'abcdfg',    // 6
}
const inverseNumbers = _.invert(numbers)

const testData2 = `acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf`.split('\n')

const equals = (aStr, bStr) => {
    const a = aStr.split('')
    const b = bStr.split('')
    return !_.difference(a, b).length && !_.difference(b, a).length
}

const getMap = (nums) => {
    const codeLengths = _.groupBy(nums, 'length')
    const segMap = {}

    const numbs = {
        1: codeLengths[2][0].split(''),
        4: codeLengths[4][0].split(''),
        7: codeLengths[3][0].split(''),
        8: codeLengths[7][0].split(''),
    }

    // Get A
    const a = _.difference(numbs[7], numbs[1])
    segMap.a = a

    // Get C, D, E
    const len6 = codeLengths[6].map(i => i.split(''))
    const len6common = _.intersection(...len6)
    const cde = _.difference(_.union(...len6), _.intersection(...len6))

    // get e
    const e = _.difference(cde, numbs[4])
    segMap.e = e

    // get c
    const c = _.intersection(cde, numbs[7])
    segMap.c = c

    //get d
    const d = _.difference(cde, c, e)
    segMap.d = d


    // GET F
    const f = _.difference(numbs[1], segMap.c)
    segMap.f = f

    // GET G
    const acdef = _.union(segMap.a, segMap.c, segMap.d, segMap.e, segMap.f)
    const candid = codeLengths[5].map(n => _.difference(n.split(''), acdef))
    const g = _.intersection(candid[0], candid[1])
    segMap.g = g

    // GET B
    const b = _.difference(alphabet, _.flatten(Object.values(segMap)))
    segMap.b = b

    // console.log(segMap)

    return _.mapValues(segMap, i => i[0])
}

const getOutput = (input) => {
    const [left, right] = input.split(' | ').map(side => side.split(' '))

    const map = getMap(left)
    const inverseMap = _.invert(map)

    const translated = right.map(word => word.split('').map(char => inverseMap[char]).sort().join(''))
    const output = Number(translated.map(word => inverseNumbers[word]).join(''))

    return output
}

const res2 = getOutput(testData2[0])

const res1 = testData1.map(getOutput).reduce((a, b) => a + b)

const res = puzzleInput.map(getOutput).reduce((a, b) => a + b)


console.log(res)

