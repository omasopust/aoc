const _ = require('lodash')
const assert = require('assert')
const {} = require('mathjs')
const fs = require('fs')

const input = fs.readFileSync('./04.input').toString()

const parseInput = (input) => {
    const [drawnStr, ...boardsStrs] = input.split('\n\n')
    const drawn = drawnStr.split(',').map(n => parseInt(n, 10))
    const boards = boardsStrs.map(boardStr => boardStr.split('\n').map(row => row.split(' ').filter(Boolean).map(cell => parseInt(cell, 10))))

    // console.log(drawn, boards)
    return [drawn, boards]
}

const testData1 = `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`

// PART 1

class Board {
    constructor(boardInput) {
        this.data = boardInput
        this.drawn = {}

        this.isWinning.bind(this)
        this.markNumber.bind(this)
    }

    isWinning() {
        for(const drawnLine of Object.keys(this.drawn)) {
            if (this.drawn[drawnLine].length >= 5) {
                // console.log('winning line', drawnLine, this.drawn[drawnLine])
                return true
            }
        }
        return false
    }

    markNumber(n) {
        for(const [rowIx, row] of this.data.entries()) {
            for(const [cellIx, cell] of row.entries()) {
                if (n === cell) {
                    this.drawn['r' + rowIx] = this.drawn['r' + rowIx] ?? []
                    this.drawn['r' + rowIx].push(n)
                    this.drawn['c' + cellIx] = this.drawn['c' + cellIx] ?? []
                    this.drawn['c' + cellIx].push(n)
                }
            }
        }
    }

    sumNotMarked() {
        let sum = 0
        for(const row of this.data) {
            for (const cell of row) {
                if (!this._isMarked(cell)) {
                    sum += cell
                }
            }
        }
        return sum
    }

    _isMarked(n) {
        for(const line of Object.values(this.drawn)) {
            if (line.includes(n)) {
                return true
            }
        }
        return false
    }
}

const [drawn, boardsInput] = parseInput(input)

const boards = boardsInput.map(input => new Board(input))
// console.log(boards)

const findWinner = (first = true) => {
    let lastWin
    const alreadyWinningIndexes = []
    for (const drawnN of drawn) {
        // console.log('drawing', drawnN)
        // mark
        boards.forEach(board => {
            board.markNumber(drawnN)
        })

        // check win
        for (const [i, board] of boards.entries()) {
            const winning = !alreadyWinningIndexes.includes(i) && board.isWinning()
            if (winning) {
                if (first) return [i, drawnN]
                // console.log('winning board', i)
                alreadyWinningIndexes.push(i)
                lastWin = [i, drawnN]
            }
        }

        // stop if all boards won
        if (alreadyWinningIndexes.length >= boards.length) {
            break
        }
    }
    return lastWin
}
const [winnerIx, lastDrawnN] = findWinner(false)
console.log([winnerIx, lastDrawnN])

// console.log(boards[winnerIx].drawn)
// console.log(boards[winnerIx].data)
const score = boards[winnerIx].sumNotMarked() * lastDrawnN
// console.log(score)


	