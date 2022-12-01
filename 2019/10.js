const {Coord, World} = require('./utils')
const _ = require('lodash')
const assert = require('assert')

const puzzleInput =
`.###..#######..####..##...#
########.#.###...###.#....#
###..#...#######...#..####.
.##.#.....#....##.#.#.....#
###.#######.###..##......#.
#..###..###.##.#.#####....#
#.##..###....#####...##.##.
####.##..#...#####.#..###.#
#..#....####.####.###.#.###
#..#..#....###...#####..#..
##...####.######....#.####.
####.##...###.####..##....#
#.#..#.###.#.##.####..#...#
..##..##....#.#..##..#.#..#
##.##.#..######.#..#..####.
#.....#####.##........#####
###.#.#######..#.#.##..#..#
###...#..#.#..##.##..#####.
.##.#..#...#####.###.##.##.
...#.#.######.#####.#.####.
#..##..###...###.#.#..#.#.#
.#..#.#......#.###...###..#
#.##.#.#..#.#......#..#..##
.##.##.##.#...##.##.##.#..#
#.###.#.#...##..#####.###.#
#.####.#..#.#.##.######.#..
.#.#####.##...#...#.##...#.`

const gcdBinary = (x, y) => {
	if ((typeof x !== 'number') || (typeof y !== 'number')) return false
	x = Math.abs(x)
	y = Math.abs(y)
	let temp
	while(y) {
		temp = y
		y = x % y
		x = temp
	}
	return x
}


const isAsteroid = (map, coord) => {
	return map.get(coord) === '#'
}

const getBaseVector = (from, to) => {
	if (from.is(to)) return false
	const x = to.x - from.x
	const y = to.y - from.y
	const gdc = gcdBinary(x, y)
	const baseX = (x / gdc)
	const baseY = (y / gdc)
	return new Coord(baseX, baseY)
}

const getClosestAsteroidInLine = (map, from, to) => {
	const base = getBaseVector(from, to)
	let current = new Coord(from.x, from.y)

	// positive
	while (true) {
		current = current.add(base)
		if (map.isInside(current)) {
			if (isAsteroid(map, current)) {
				return current.toString()
			}
			continue
		}
		return false
	}
}

const getBestLocation = (map) => {
	const out = {}
	// N
	let best = [0]
	for (const [coordStr] of map) {
		const origin = new Coord(coordStr)
		if (!isAsteroid(map, origin)) continue

		// scan
		const visibleAsteroids = {}
		for (const [targetStr] of map) {
			const target = new Coord(targetStr)
			if (target.is(origin) || visibleAsteroids[target]) continue
			const asteroid = getClosestAsteroidInLine(map, origin, target)
			if (asteroid) visibleAsteroids[asteroid] = true
		}
		const asteroids = Object.keys(visibleAsteroids)
		out[origin] = {
			asteroids,
			count: asteroids.length,
		}
		if (asteroids.length > best[0]) best = [asteroids.length, origin.toString()]
	}
	return {data: out, best: {[best[1]]: best[0]}}
}

// DEBUG
// const map = new Map(puzzleInput)
// console.log(getBestLocation(map))
// console.log('base', getBaseVector(new Coord('2_0'), new Coord('6_0')))

// TESTs
const test1 =
`......#.#.
#..#.#....
..#######.
.#.#.###..
.#..#.....
..#....#.#
#..#....#.
.##.#..###
##...#..#.
.#....####`
const test2 =
`#.#...#.#.
.###....#.
.#....#...
##.#.#.#.#
....#.#.#.
.##..###.#
..#...##..
..##....##
......#...
.####.###.`
const test3 =
`.#..#..###
####.###.#
....###.#.
..###.##.#
##.##.#.#.
....###..#
..#.#..#.#
#..#.#.###
.##...##.#
.....#.#..`
const test4 =
`.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##`

//console.log(getBestLocation(new Map(test1)))
assert.deepEqual(getBestLocation(new World(test1)).best, {'5_8': 33})
assert.deepEqual(getBestLocation(new World(test2)).best, {'1_2': 35})
assert.deepEqual(getBestLocation(new World(test3)).best, {'6_3': 41})
const test4res = getBestLocation(new World(test4))
assert.deepEqual(test4res.best, {'11_13': 210})


// PART 1
const puzzleMap = new World(puzzleInput)
const res = getBestLocation(puzzleMap)
assert.deepEqual(res.best, { '17_23': 296 })

// PART 2
const vectorToAngle = (vector) => ((Math.atan2(vector.x, -vector.y) * 180 / Math.PI) + 360) % 360
const getTargetListFirstWave = (station, asteroids) => _.sortBy(asteroids, (str) => vectorToAngle((new Coord(str)).sub(station)))

// TEST

const test4station  = new Coord('11_13')
const test4targets = getTargetListFirstWave(test4station, test4res.data[test4station].asteroids)
assert.strictEqual(test4targets[0], '11_12')
assert.strictEqual(test4targets[9], '12_8')
assert.strictEqual(test4targets[199], '8_2')



const station = new Coord('17_23')
const targets = getTargetListFirstWave(station, res.data[station].asteroids)

assert.strictEqual(targets[199], '2_4')
