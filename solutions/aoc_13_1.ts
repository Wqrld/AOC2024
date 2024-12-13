const fs = require('fs');
// let input = `Button A: X+94, Y+34
// Button B: X+22, Y+67
// Prize: X=8400, Y=5400`

let input = fs.readFileSync('./inputs_prod/13.txt', 'utf-8');

let machines = input.split('\n\n').map(
    (machine) => machine.split('\n').map(
        (field) => field.split(": ")[1]
    ).map(
        (field) => field.split(', ').map(
            (elem) => Number(elem.slice(2))
        )
    )
).map((machine) => { return { A: { x: machine[0][0], y: machine[0][1] }, B: { x: machine[1][0], y: machine[1][1] }, P: { x: machine[2][0], y: machine[2][1] } } });

// console.log(machines)

// find all possible factorizations of the price numbers

// AX + BX = TargetX
// AY + BY = TargetY
// minimize 3A + B

// A: [ 42, 17 ], B: [ 31, 62 ], P: [ 17600, 6945 ] },

// okay we need early stopping and caching. how do we do this... recursion?
// Can we filter out numbers that dont factor the target?

function findOptimalCombination({ A: MA, B: MB, P: MP }) {
    let optimal = { A: 0, B: 0, Cost: Infinity };
    for (let A = 0; A < 100; A++) {
        for (let B = 0; B < 100; B++) {
            // we can early stop if B is too big or A is too big. Is that more efficient?
            if (A * MA.x + B * MB.x === MP.x && A * MA.y + B * MB.y === MP.y) {
                if (3 * A + B < optimal.Cost) {
                    optimal = { A, B, Cost: 3 * A + B }
                }
            }
        }
    }
    return optimal
}

// {A: [ 42, 17 ], B: [ 31, 62 ], P: [ 17600, 6945 ] }
// console.log(findOptimalCombination(machines[0]))
console.log(machines.map(findOptimalCombination).filter((e) => e.Cost != Infinity).map((e) => e.Cost).reduce((acc, cost) => acc + cost, 0))