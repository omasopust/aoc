const _ = require('lodash')

class Coord {
	constructor (stringOrX, y) {
		if(typeof stringOrX === 'string') {
			const a = stringOrX.split('_')
			this.x = parseInt(a[0])
			this.y = parseInt(a[1])
		} else {
			this.x = stringOrX
			this.y = y
		}
	}
	toString () {
		return `${this.x}_${this.y}`
	}
	add (coord) {
		return new Coord(this.x + coord.x, this.y + coord.y)
	}
	sub (coord) {
		return new Coord(this.x - coord.x, this.y - coord.y)
	}
	is (coord) {
		if (!(coord instanceof Coord)) {
			coord = new Coord(coord)
		}
		return this.x === coord.x && this.y === coord.y
	}
	diff (coord) {
		return [this.x - coord.x, this.y - coord.y]
	}
}

class World {
	constructor (mapStr) {
		this.map = mapStr.split('\n').map(row => row.split(''))
		this.sizeY = this.map.length
		this.sizeX = this.map[0].length
	}

	get (coord) {
		if (!(coord instanceof Coord)) {
			coord = new Coord(coord)
		}
		return this.map[coord.y][coord.x]
	}

	set(coord, val) {
		if (!(coord instanceof Coord)) {
			coord = new Coord(coord)
		}
		return _.set(this.map, `[${coord.y}][${coord.x}]`, val)
	}

	isInside (coord) {
		return (
			coord.x >= 0 &&
			coord.y >= 0 &&
			coord.x < this.sizeX &&
			coord.y < this.sizeY
		)
	}

	*[Symbol.iterator] () {
		let y = 0
		for (const row of this.map) {
			let x = 0
			for (const item of row) {
				yield [[x, y].join('_'), item]
				x++
			}
			y++
		}
	}
}

class Moon {
	constructor(stringOrX, y, z) {
		if (typeof stringOrX === 'string') {
			const a = stringOrX.split('_')
			this.x = parseInt(a[0])
			this.y = parseInt(a[1])
			this.z = parseInt(a[2])
		} else {
			this.x = stringOrX
			this.y = y
			this.z = z
		}
		this.xVel = 0
		this.yVel = 0
		this.zVel = 0
	}

	static from (moon) {
		if(!(moon instanceof Moon)) {
			moon = new Moon(moon)
		}
		return moon
	}

	toString () {
		return `${this.x}_${this.y}_${this.z}`
	}
	add (moon) {
		moon = Moon.from(moon)
		this.x += moon.x
		this.y += moon.y
		this.z += moon.z
		return this
	}
	isSame(moon) {
		moon = Moon.from(moon)
		return this.x === moon.x && this.y === moon.y && this.z === moon.z &&
			this.xVel === moon.xVel && this.yVel === moon.yVel && this.zVel === moon.zVel

	}
}

module.exports = {
	Coord,
	World,
	Moon,
}