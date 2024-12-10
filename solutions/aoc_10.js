const fs = require('fs');
let input = fs.readFileSync('./inputs_prod/10.txt', 'utf-8');

let field = input.split("\n").map(l => l.split("").map(Number));

let trailHeads = [];
field.forEach((line, y) => line.forEach((c, x) => {
    if (field[y][x] == 0) {
        trailHeads.push([x, y])
    }
}))

const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];


/**
 * Find all positions with 9's reachable from a given start point recursively.
 * @param {number[][]} field Matrix of numbers representing the field 
 * @param {[number, number]} start [x,y] starting point
 * @param {number} nextNumber the next number to look for in neighbours
 * @returns [number, number][] list of [x,y] coordinates with reachable 9's
 */
function findReachableEnds(field, start, nextNumber) {
    if (nextNumber == 10) {
        return [start];
    }

    let list = [];
    for (const [dx, dy] of directions) {
        let x = start[0] + dx;
        let y = start[1] + dy;
        if (field[y] && field[y][x] == nextNumber) {
            list.push(findReachableEnds(field, [x, y], nextNumber + 1));
        }
    }
    return list.flat();

}

console.log("PT 1", trailHeads.reduce((acc, trailHead) => acc + findReachableEnds(field, trailHead, 1).filter((v, i, a) => a.findIndex((val, ind, obj) => val[0] == v[0] && val[1] == v[1]) === i).length, 0))

console.log("PT 2", trailHeads.reduce((acc, trailHead) => acc + findReachableEnds(field, trailHead, 1).length, 0))