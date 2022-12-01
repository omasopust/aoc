const _ = require('lodash')
const assert = require('assert')
const {} = require('mathjs')
const fs = require('fs')

const puzzleInput = fs.readFileSync('./04.input').toString().split('\n\n')

let data = puzzleInput.map((pass) => {
	const str = pass.split('\n').join(' ')
	const arr = str.split(' ')
	const obj = {}
	for (const i of arr) {
		const [key, val] = i.split(':')
		obj[key] = val
	}
	return obj
})

// PART 1
const part1 = data.filter((i) => {
	return i['byr'] &&
	i['iyr'] &&
	i['eyr'] &&
	i['hgt'] &&
	i['hcl'] &&
	i['ecl'] &&
	i['pid']
})

//console.log(part1.length)


// PART 2

const part2 = part1.filter((i) => {
	const byr = parseInt(i.byr)
	if (byr < 1920 || byr > 2002) return false

	const iyr = parseInt(i.iyr)
	if (iyr < 2010 || iyr > 2020) return false

	const eyr = parseInt(i.eyr)
	if (eyr < 2020 || eyr > 2030) return false

	if (i.hgt.includes('cm') && i.hgt.length === 5) {
		const val = parseInt(i.hgt.slice(0,3))
		if (val > 193 || val < 150) return false
	} else if (i.hgt.includes('in') && i.hgt.length === 4) {
		const val = parseInt(i.hgt.slice(0,2))
		if (val > 76 || val < 59) return false
	} else return false



	if (!i.hcl.match(/^#[0-9a-f]{6}$/)) return false

	if (!['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(i.ecl)) return false

	if (!i.pid.match(/^[0-9]{9}$/)) return false

	return true
})


// console.log(part2.length)
