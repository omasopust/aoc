const _ = require('lodash')
const assert = require('assert')

// min 108457 => 111111
// max 562041 => 559999
const isValidPass = (number) => {
	const chars = number.toString().split('')
	let last = parseInt(chars[0])
	for (let char of chars.slice(1)) {
		char = parseInt(char)
		if (char < last) return false
		if (char > last) last = char
	}
	const digits = _.countBy(chars, e => e)
	if(!Object.values(digits).includes(2)) return false // doesnt have group of 2 same digits
	return true
}

const generator = function* (start, end) {

	let i = start
	while (i <= end) {
		if (isValidPass(i)) {
			yield i
		}
		i++
	}
}

const gen = generator(111111, 559999)
const pwds = []

let next = gen.next()
while(!next.done) {
	pwds.push(next.value)
	next = gen.next()
}

assert.strictEqual(pwds.length, 1972)

