const _ = require('lodash')
const assert = require('assert')
const {} = require('mathjs')
const fs = require('fs')

const puzzleInput = fs.readFileSync('./16.input').toString()

const testData1 = `8A004A801A8002F478`
const testData4 = `A0016C880162017C3686B18A3D4780`
// PART 1

const prepare = (input) => {
    return input.split('').map(char => parseInt(char, 16).toString(2).padStart(4, '0')).join('')
}

const consume = (input, count) => {
    if (input.length < count) {
        console.log('ERROR: cannot consume', count)
    }
    return input.splice(0, count)
}

const readPacket = (input, meta = {}) => {
    const version = parseInt(consume(input, 3).join(''), 2)
    const type = parseInt(consume(input, 3).join(''), 2)

    meta.vSum = meta.vSum ?? 0
    meta.vSum += version

    console.log(version, type)

    if (type === 4) {
        let lastGroupDone = false
        let number = []
        while (!lastGroupDone) {
            const [groupType, ...group] = consume(input, 5)
            number.push(...group)
            if (groupType === '0') {
                lastGroupDone = true
            }
        }
        const numberDec = parseInt(number.join(''), 2)
        return numberDec
    } else {
        const [opMode] = consume(input, 1)
        // console.log('opMode', opMode)
        const numbers = []

        if (opMode === '0') {
            const lengthBits = parseInt(consume(input, 15).join(''), 2)
            const inner = consume(input, lengthBits)
            while (inner.length) {
                numbers.push(readPacket(inner, meta))
            }
        } else {
            const lengthBlock = consume(input, 11)
            const lengthPackets = parseInt(lengthBlock.join(''), 2)
            for (const i of _.range(lengthPackets)) {
                numbers.push(readPacket(input, meta))
            }
        }

        const OP = {
            0: n => n.reduce((a, b) => a + b),
            1: n => n.reduce((a, b) => a * b, 1),
            2: n => _.min(n),
            3: n => _.max(n),
            5: n => n[0] > n[1] ? 1 : 0,
            6: n => n[0] < n[1] ? 1 : 0,
            7: n => n[0] === n[1] ? 1 : 0,
        }

        return OP[type](numbers)
    }
}

const run = (inputStr) => {
    const input = inputStr.split('')

    const meta = {}
    const value = readPacket(input, meta)

    console.log(input.length, meta, value)

}

const test1 = `C200B40A82`
const test2 = `04005AC33890`
const test3 = `880086C3E88112`
const test4 = `CE00C43D881120`
const test5 = `D8005AC2A8F0`

const data = prepare(puzzleInput)
console.log(data)
run(data)



// PART 2

	