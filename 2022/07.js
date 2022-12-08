const _ = require('lodash')
const assert = require('assert')
const {} = require('mathjs')
const fs = require('fs')

const puzzleInput = fs.readFileSync('./07.input').toString().split('\n')

const testData1 = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`.split('\n')
// PART 1


/*
{
    name: String
    parent: Object
    size: Number
    children?: <Object>Array
}
*/

const parse = (input) => {
    const root = {
        name: '/',
    }
    let curPath = root

    for (const line of input) {
        if (line === '$ cd /') {
            // nothing
        } else if (line === '$ ls') {
            // nothing
        } else if (line === '$ cd ..') {
            curPath = curPath.parent
        } else if (line.startsWith('$ cd')) {
            const [,, name] = line.split(' ')
            curPath = _.find(curPath.children, {name})
        } else if (line.startsWith('dir')) {
            const [, name] = line.split(' ')
            curPath.children ??= []
            curPath.children.push({
                name,
                parent: curPath,
            })
        } else {
            const [sizeStr, name] = line.split(' ')
            curPath.children ??= []
            curPath.children.push({
                name,
                size: Number(sizeStr)
            })
        }
    }
    return root
}

const calcSizes = (obj) => {
    if (!obj.children) {
        return obj.size
    }
    const size = obj.children.reduce((prev, child) => prev + calcSizes(child), 0)
    obj.size = size
    return size
}

const part1 = (input) => {
    const model = parse(input)
    calcSizes(model)

    const smallDirs = []
    const addAllSmallDirs = (obj) => {
        if (!obj.children) return
        if (obj.size <= 100000) smallDirs.push(obj)
        obj.children.forEach(addAllSmallDirs)
    }
    addAllSmallDirs(model)
    return smallDirs.reduce((prev, obj) => prev + obj.size, 0)
}

// console.log(part1(testData1))
// console.log(part1(puzzleInput))

// PART 2

const part2 = (input) => {
    const model = parse(input)
    calcSizes(model)

    const minDelete = model.size - 40000000
    console.log(minDelete)

    let curClosest = model
    const findClosest = (obj) => {
        if (!obj.children) return
        if (obj.size < minDelete) return
        if (obj.size < curClosest.size) {
            curClosest = obj
        }
        obj.children.forEach(findClosest)
    }
    findClosest(model)

    return curClosest
}

// console.log(part2(testData1))
// console.log(part2(puzzleInput))
