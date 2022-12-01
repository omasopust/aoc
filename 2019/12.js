const _ = require('lodash')
const assert = require('assert')
const {lcm} = require('mathjs')
const {Moon} = require('./utils')
const Program = require('./intcode-computer')

const puzzleInput =
`<x=17, y=-7, z=-11>
<x=1, y=4, z=-1>
<x=6, y=-2, z=-6>
<x=19, y=11, z=9>`

const parseXYZ = /<x=\s*(-?\d*),\sy=\s*(-?\d*),\sz=\s*(-?\d*)>/
const parsePos = /pos=<x=\s*(-?\d*),\sy=\s*(-?\d*),\sz=\s*(-?\d*)>/
const parseVel = /vel=<x=\s*(-?\d*),\sy=\s*(-?\d*),\sz=\s*(-?\d*)>/

const test1Input =
`pos=<x= -1, y=  0, z=  2>, vel=<x=  0, y=  0, z=  0>
pos=<x=  2, y=-10, z= -7>, vel=<x=  0, y=  0, z=  0>
pos=<x=  4, y= -8, z=  8>, vel=<x=  0, y=  0, z=  0>
pos=<x=  3, y=  5, z= -1>, vel=<x=  0, y=  0, z=  0>`

const DIM = ['x', 'y', 'z']

const createPairs = (array) => {
	const out = []
	for (const i of _.range(array.length - 1)) {
		for (const j of _.range(i + 1, array.length)) {
			out.push([array[i], array[j]])
		}
	}
	return out
}

const compare = (self, other) => {
	return self < other ? 1 : self > other ? -1 : 0
}

const step = (moons) => {
	const pairs = createPairs(moons)
	// 1) apply gravity
	pairs.forEach(([one, two]) => {
		DIM.forEach(dim => {
			const cpmRes = compare(one[dim], two[dim])
			one[dim + 'Vel'] += cpmRes
			two[dim + 'Vel'] -= cpmRes
		})
	})

	// 2) move
	moons.forEach(moon => {
		DIM.forEach(dim => {
			moon[dim] += moon[dim + 'Vel']
		})
	})
}

const getEnergy = (moons) => {
	const abs = Math.abs
	return moons.map(moon => {
		return (abs(moon.x) + abs(moon.y) + abs(moon.z)) * (abs(moon.xVel) + abs(moon.yVel) + abs(moon.zVel))
	}).reduce((acc, val) => {
		return acc + val
	}, 0)
}

const moons = puzzleInput.split('\n').map(row => {
	const [, x, y, z] = row.match(parseXYZ)
	return new Moon(parseInt(x), parseInt(y), parseInt(z))
})

const testMoons = (test1Input.split('\n').map(row => {
	const [, x, y, z] = row.match(parsePos)
	return new Moon(parseInt(x), parseInt(y), parseInt(z))
}))

const run = (moons) => {
	const moonsCopy = moons.map(moon => new Moon(moon.toString()))
	const cycle = {}
	_.range(1000000).forEach((val, i) => {
		step(moons, cycle)
		DIM.forEach(dim => {
			if (cycle[dim]) return true
			const same = moons.every((moon, moonKey) => {
				const moonCpy = moonsCopy[moonKey]
				return moon[dim] === moonCpy[dim] && moon[dim + 'Vel'] === moonCpy[dim + 'Vel']
			})
			if (same) {
				console.log('setting', dim, i + 1)
				cycle[dim] = i + 1
			}
		})
	})
	return cycle
}

// const cycle = run(moons)
// console.log(cycle)
// console.log(getEnergy(moons))
// console.log(lcm(cycle.x, cycle.y, cycle.z))
