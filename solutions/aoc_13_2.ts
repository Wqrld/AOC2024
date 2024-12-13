const fs = require('fs');
// let input = `Button A: X+69, Y+23
// Button B: X+27, Y+71
// Prize: X=10000000018641, Y=100000000102790`

let input = fs.readFileSync('./inputs_prod/13.txt', 'utf-8');

let machines = input.split('\n\n').map(
    (machine) => machine.split('\n').map(
        (field) => field.split(": ")[1]
    ).map(
        (field) => field.split(', ').map(
            (elem) => Number(elem.slice(2))
        )
    )
).map((machine) => { return { A: { x: machine[0][0], y: machine[0][1] }, B: { x: machine[1][0], y: machine[1][1] }, P: { x: machine[2][0] + 10000000000000, y: machine[2][1] + 10000000000000 } } });

function determinant([a, b, c, d]) {
    return a * d - b * c;
}

function inverse ([a, b, c, d]) {
    let det = determinant([a, b, c, d]);
    return [d / det, -b / det, -c / det, a / det];
}


function solve({A, B, P}): [number, number, boolean] {
    let [a, b, c, d] = inverse([A.x, B.x, A.y, B.y]);
    let x = a * P.x + b * P.y;
    let y = c * P.x + d * P.y;
    return [Number(x.toFixed(2)), Number(y.toFixed(2)), Number(x.toFixed(2)) % 1 == 0 && Number(y.toFixed(2)) % 1 == 0]; // floating point correction. We want an integer solution (diophantine?)
}


let sum = 0;
for (const machine of machines) {
    let [a, b, valid] = solve(machine);
    if (valid) {
        sum += a * 3 + b;
    }
}
console.log(sum)

