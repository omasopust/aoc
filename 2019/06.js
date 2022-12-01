const fs = require('fs')
const assert = require('assert')
const _ = require('lodash')

const orbitsInput = fs.readFileSync('./06.input').toString().split('\n')

const objects = {}

const getObject = (objects, key) => {
	if (typeof key !== 'string') throw new Error('invalid key ' + key)
	let obj = objects[key]
	if (!obj) objects[key] = obj = {
		key: key,
		orbiters: [],
	}
	return obj
}

const registerOrbit = (objects, orbit) => {
	const [orbiteeStr, orbiterStr] = orbit.split(')')
	const orbitee = getObject(objects, orbiteeStr)
	const orbiter = getObject(objects, orbiterStr)
	orbitee.orbiters.push(orbiter)
	orbiter.orbitee = orbitee
}

// Count orbits

const countObjectsPaths = (startObj) => {
	const countObjectOrbits = (object, distance = 0, path = []) => {
		if (!object) return false
		if (distance) object.path = path
		path = [...path, object.key]
		object.orbiters.forEach((orbiter) => {
			countObjectOrbits(orbiter, distance + 1, path)
		})
	}
	countObjectOrbits(startObj)
}

orbitsInput.forEach((orbit) => {
	registerOrbit(objects, orbit)
})

countObjectsPaths(getObject(objects, 'COM'))
const {val: orbitCount} = _.transform(objects, (acc, val) => {
	if (val.path) acc.val += val.path.length
}, {val: 0})

assert.strictEqual(orbitCount, 251208)

// PART 2
const getDistance = (start, end) => {
	const path = _.xor(start.path, end.path)
	return path.length
}

// TEST
const testObjects = {}
const testOrbits = ['COM)B', 'B)C', 'C)D', 'D)E', 'E)F', 'B)G', 'G)H', 'D)I', 'E)J', 'J)K', 'K)L', 'K)YOU', 'I)SAN']
	.forEach((o) => registerOrbit(testObjects, o))

countObjectsPaths(getObject(testObjects, 'COM'))
assert.strictEqual(getDistance(getObject(testObjects, 'YOU'), getObject(testObjects, 'SAN')), 4)

// PUZZLE OUTPUT
const distance = getDistance(getObject(objects, 'YOU'), getObject(objects, 'SAN'))
assert.strictEqual(distance, 397)

