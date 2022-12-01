const _ = require('lodash')
const assert = require('assert')
const {} = require('mathjs')
const fs = require('fs')

const puzzleInput = fs.readFileSync('./12.input').toString().split('\n')

const testData1 = `start-A
start-b
A-c
A-b
b-d
A-end
b-end`.split('\n')

const testData2 = `dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc`.split('\n')

// PART 1

const prepare = (input) => {
    const def = {}
    for (const line of input) {
        const [a, b] = line.split('-')
        def[a] = def[a] ?? []
        def[b] = def[b] ?? []
        def[a].push(b)
        def[b].push(a)
    }
    return def
}

const exploreRoutes = (input, current, path = [], smallVisitedTwice = false) => {
    path.push(current)
    let paths = []

    if (current === 'end') {
        return [path]
    }

    for (const target of input[current]) {
        if (target === 'start') {
            continue
        }

        const isSmall = target === _.toLower(target)
        let visitedTwiceNow = smallVisitedTwice

        if (isSmall && path.includes(target)) {
            if (smallVisitedTwice) {
                continue
            } else {
                visitedTwiceNow = true
            }
        }

        paths = [...paths, ...exploreRoutes(input, target, _.clone(path), visitedTwiceNow)]
    }

    return paths
}


const input = prepare(puzzleInput)
const r = exploreRoutes(input, 'start', [], false)
console.log(r, r.length)
