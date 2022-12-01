const _ = require('lodash')
const assert = require('assert')
const {} = require('mathjs')
const {} = require('./utils')
const Program = require('./intcode-computer')

const puzzleInput = `1 RNQHX, 1 LFKRJ, 1 JNGM => 8 DSRGV
2 HCQGN, 1 XLNC, 4 WRPWG => 7 ZGVZL
172 ORE => 5 WRPWG
7 MXMQ, 1 SLTF => 3 JTBLB
1 DSRGV => 4 SLZF
2 HDVD, 32 LFKRJ => 4 FCZQD
9 LNRS, 18 WKMWF => 8 RNQRM
12 MWSGQ => 9 DCKC
6 SLTF, 5 XLNC => 1 KFBX
4 QNRZ, 1 QHLF, 15 FWSK => 9 SFJC
9 KFBX, 15 RPKGX, 2 QNRZ => 6 LFKRJ
8 SFJC, 6 ZQGL, 4 PFCGF => 3 THPCT
2 RNQHX, 4 PFCGF, 1 ZQGL => 6 LNRS
195 ORE => 4 PTHDF
3 FJKSL => 7 FWSK
12 KBJW, 9 MWSGQ => 9 WKMWF
3 XLNC => 5 RPKGX
188 ORE => 7 FJKSL
6 ZNPNM, 3 KHXPM, 3 TJXB => 2 HSDS
1 DGKW, 17 XLNC => 1 PFCGF
2 VRPJZ, 3 DSRGV => 5 MWSGQ
12 BJBQP, 5 XLNC => 4 HCQGN
1 GFCGF => 3 HDVD
18 TJXB, 2 THPCT, 1 WPGQN => 4 KHXPM
1 ZGVZL => 1 JNGM
3 ZGVZL => 8 KBJW
12 GFCGF => 8 BJBQP
7 MXMQ, 18 WRPWG => 9 XLNC
13 ZGVZL, 1 QNRZ => 6 RNQHX
5 HRBG, 16 QNRZ => 9 WPGQN
5 SFJC, 1 PFCGF, 1 KHXPM => 5 FXDMQ
1 KBJW, 5 BNFV, 16 XLNC, 1 JNGM, 1 PFCGF, 1 ZNPNM, 4 FXDMQ => 5 VBWCM
5 ZGVZL, 5 LFKRJ => 9 QHLF
14 JTBLB => 5 VRPJZ
4 FWSK => 9 RXHC
2 HRBG, 3 FCZQD => 8 DRLBG
9 KLXC, 23 VBWCM, 44 VPTBL, 5 JRKB, 41 PFCGF, 4 WBCRL, 20 QNRZ, 28 SLZF => 1 FUEL
1 DRLBG => 5 VPTBL
13 LNRS => 7 ZNPNM
3 WPGQN => 9 TJXB
5 GFCGF, 3 HCQGN => 5 ZQGL
1 KHXPM, 4 LMCSR, 1 QHLF, 4 WKMWF, 1 DGKW, 3 KBRM, 2 RNQRM => 4 KLXC
171 ORE => 8 ZJGSJ
3 ZJGSJ => 3 MXMQ
124 ORE => 5 SLTF
22 KHXPM, 10 FXDMQ => 6 KBRM
2 FCZQD => 8 LMCSR
7 DCKC, 8 HSDS, 7 PFCGF, 16 ZNPNM, 3 RNQRM, 3 WKMWF, 2 WBCRL, 14 RXHC => 7 JRKB
7 DCKC, 2 MWSGQ => 3 BNFV
2 ZQGL => 9 DGKW
22 WRPWG => 6 HRBG
22 KBJW, 1 KFBX, 1 THPCT => 6 WBCRL
4 WRPWG, 1 RXHC, 21 FWSK => 8 QNRZ
1 PTHDF => 8 GFCGF`

const test1 = `10 ORE => 10 A
1 ORE => 1 B
7 A, 1 B => 1 C
7 A, 1 C => 1 D
7 A, 1 D => 1 E
7 A, 1 E => 1 FUEL`

const parseInput = (str) => {
	const recipes = []
	const products = new Set()
	str.split('\n').forEach(row => {
		const parseCouple = (str) => {
			const [count, elem] = str.trim().split(' ')
			return [elem, parseInt(count)]
		}
		const [matsStr, productStr] = row.split('=>').map(s => s.trim())
		const mats = matsStr.split(',').map(matStr => {
			return parseCouple(matStr)
		})
		const product = parseCouple(productStr)
		if (products.has(product[0])) {
			throw new Error(product[0] + ' already known :(')
		}
		products.add(product[0])
		recipes.push({
			key: product[0],
			count: product[1],
			mats,
		})
	})
	return _.keyBy(recipes, 'key')
}

const subst = (prod, recipes, leftovers) => {
	const recipe = recipes[prod[0]]
	if (!recipe) throw new Error('missing recipe for ' + prod[0])
	const stash = leftovers[prod[0]]
	let takenFromStash = 0
	if (stash) {
		if (prod[1] < stash) {
			takenFromStash = prod[1]
			leftovers[prod[0]] -= prod[1]
		} else if (prod[1] === stash) {
			delete leftovers[prod[0]]
		} else {
			takenFromStash = stash
			delete leftovers[prod[0]]
		}
	}
	const needed = prod[1] - takenFromStash
	const n = Math.ceil(needed / recipe.count)
	const created = n * recipe.count
	const left = created - ((needed % created) || created)
	if (left) {
		leftovers[prod[0]] = (leftovers[prod[0]] || 0) + left
	}

	// console.log('sub', prod[0], {requested: prod[1], needed, created, left})
	// console.log('left', leftovers)
	return recipe.mats.map(mat => [mat[0], mat[1] * n])
}

const simplify = (array) => Object.entries(array.reduce((acc, val) => {
	acc[val[0]] = (acc[val[0]] || 0) + val[1]
	return acc
}, {}))

const substAll = (from, recipes, to) => {
	const leftovers = {}
	let array = _.cloneDeep(from)
	while (true) {
		const [mat] = array.splice(0, 1)
		// substitude
		if (mat[0] !== to) {
			array.push(...subst(mat, recipes, leftovers))
		} else if (mat[0] === to) {
			array.push(mat)
		}
		// simplify
		array = simplify(array)
		// console.log(array)

		if (array.length <= 1 && array[0][0] === to) break
		//console.log(array)
	}
	return array
}

// PART 1
const test1Recipes = parseInput(test1)
const testRes = substAll([['FUEL', 1]], test1Recipes, 'ORE')

const recipes = parseInput(puzzleInput)
const res1 = substAll([['FUEL', 1]], recipes, 'ORE')
assert.strictEqual(res1[0][1], 469536)
// PART 2

// 1e12 / 469536 === 2129762.14xxx <- scam
const res2 = substAll([['FUEL', 3343477]], recipes, 'ORE')
assert.strictEqual(res2[0][1], 999999969227)