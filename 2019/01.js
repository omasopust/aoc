const fs = require('fs')
const assert = require('assert')

const masses = fs.readFileSync('./01.input').toString().split('\n')

const massToFuel = (mass) => {
	const eq = Math.floor(mass / 3) - 2
	return eq < 0 ? 0 : eq
}

const fuelForMasses = (masses) => masses.map(massToFuel).reduce((acc, val) => acc + val)

// == test ==
assert.strictEqual(fuelForMasses ([12]), 2)
assert.strictEqual(fuelForMasses ([14]), 2)
assert.strictEqual(fuelForMasses ([1969]), 654)
assert.strictEqual(fuelForMasses ([100756]), 33583)

assert.strictEqual(fuelForMasses(masses), 3087896)

// part two
const massToFuelDeep = (mass) => {
	const fuelNeeded = massToFuel(mass)
	if (fuelNeeded > 0) {
		return massToFuelDeep(fuelNeeded) + fuelNeeded
	}
	return fuelNeeded
}

const fuelForMassesDeep = (masses) => masses.map(massToFuelDeep).reduce((acc, val) => acc + val)

assert.strictEqual(fuelForMassesDeep([14]), 2)
assert.strictEqual(fuelForMassesDeep([1969]), 966)
assert.strictEqual(fuelForMassesDeep([100756]), 50346)

assert.strictEqual(fuelForMassesDeep(masses), 4628989)
