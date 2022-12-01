const _ = require('lodash')
const assert = require('assert')
const {} = require('mathjs')
const fs = require('fs')

const puzzleInput = fs.readFileSync('./03.input').toString().split('\n')

// PART 1
const countNumberOfTrees = (map, vector) => {
	const mapMaxX = map[0].length
	const mapMaxY = map.length

	let posX = 0
	let posY = 0
	let treeCount = 0
	// going down
	while (posY < mapMaxY) {
		if (map[posY][posX] === '#') {
			treeCount++
		}
		// make move
		posX = (posX + vector[0]) % mapMaxX
		posY += vector[1]
	}
	return treeCount
}

// console.log(countNumberOfTrees(puzzleInput, [3, 1]))

// PART 2

const res =
	countNumberOfTrees(puzzleInput, [1, 1]) *
	countNumberOfTrees(puzzleInput, [3, 1]) *
	countNumberOfTrees(puzzleInput, [5, 1]) *
	countNumberOfTrees(puzzleInput, [7, 1]) *
	countNumberOfTrees(puzzleInput, [1, 2])

// console.log(res)
