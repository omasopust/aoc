const _ = require('lodash')
const assert = require('assert')
const {} = require('mathjs')
const fs = require('fs')

const puzzleInput = fs.readFileSync('./15.input').toString().split('\n')

const testData1 = `1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`.split('\n')
// PART 1

const prepare = (input) => {
    const riskMap = input.map(line => line.split('').map(Number))
    const xLen = riskMap[0].length
    const yLen = riskMap.length

    const add = (a, b) => {
        return ((a + b - 1) % 9) + 1
    }

    const riskMapExtended = [
        ...riskMap,
        ...riskMap.map(line => line.map(i => add(i, 1))),
        ...riskMap.map(line => line.map(i => add(i, 2))),
        ...riskMap.map(line => line.map(i => add(i, 3))),
        ...riskMap.map(line => line.map(i => add(i, 4))),
    ]

    for (const [y, line] of riskMapExtended.entries()) {
        riskMapExtended[y] = [
            ...line,
            ...line.map(i => add(i, 1)),
            ...line.map(i => add(i, 2)),
            ...line.map(i => add(i, 3)),
            ...line.map(i => add(i, 4)),
        ]
    }

    // console.log(riskMapExtended)
    return riskMapExtended
}


const generatePath = (input) => {
    const pathMap = [[0]]
    let toProcess = ['0-0']
    const processed = new Set()


    while (toProcess.length) {
        const processing = _.minBy(toProcess, (coords) => {
            const [x, y] = coords.split('-')
            const val = pathMap[y]?.[x]
            return val ? val : Infinity
        })

        // console.log('processing', processing)
        _.pull(toProcess, processing)
        // console.log(sorted)
        processed.add(processing)

        // console.log('processing', processing)

        const [xStr, yStr] = processing.split('-')
        const x = Number(xStr)
        const y = Number(yStr)

        // const p =

        const around = [
            {x: x, y: y-1},
            // {x: x+1, y: y-1},
            {x: x+1, y: y},
            // {x: x+1, y: y+1},
            {x: x, y: y+1},
            // {x: x-1, y: y+1},
            {x: x-1, y: y},
            // {x: x-1, y: y-1},
        ]

        for (const p of around) {
            if (!input[p.y]?.[p.x]) continue

            const pId = `${p.x}-${p.y}`
            if (!processed.has(pId)) toProcess.push(pId)

            const currentMby = pathMap[p.y]?.[p.x]
            const current = currentMby || currentMby === 0 ? currentMby : Infinity

            const risk = input[p.y][p.x]
            const path = pathMap[y][x] + risk
            if (path < current) {
                pathMap[p.y] = pathMap[p.y] ?? []
                pathMap[p.y][p.x] = path
            }
        }
    }

    return pathMap
}


const input = prepare(puzzleInput)
console.log('map generated')
const path = generatePath(input)
console.log(path, path[path.length - 1][path[0].length - 1])


// PART 2

	