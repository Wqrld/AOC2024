// let input = `AAAA
// BBCD
// BBCC
// EEEC`
const fs = require('fs');
let input = fs.readFileSync('./inputs_prod/12.txt', 'utf-8');

let field = input.split("\n").map(item => item.split(""));

let seen = Array(field.length).fill().map(() => Array(field[0].length).fill(false));


function findNeighbours(x, y) {
    let reachable = seen[x][y] ? [] : [[x, y]];
    let perimeters = 0;
    seen[x][y] = true;
    let directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];
    for (const [dx, dy] of directions) {
        let nx = x + dx;
        let ny = y + dy;
        if (nx >= 0 && nx < field[0].length && ny >= 0 && ny < field.length && field[ny][nx] == field[y][x]) {
            // console.log("found neighbour", nx, ny)
            if (!seen[nx][ny]) {
                seen[nx][ny] = true;
                reachable.push([nx, ny]);
                let [r, p] = findNeighbours(nx, ny)
                perimeters += p;
                reachable.push(...r);
            }
        } else {
            // console.log("found wall", nx, ny)
            perimeters++;

        }
    }
    return [reachable, perimeters];
}

// console.log(findNeighbours(0, 0)) 

let partitions = {};
let sum = 0;

for (let y = 0; y < field.length; y++) {
    for (let x = 0; x < field[0].length; x++) {
        if (!seen[x][y]) {
            let [nb, perimeter] = findNeighbours(x, y);
            // console.log("found new group", x, y, field[y][x], nb, perimeter)
            sum += nb.length * perimeter;
            // console.log(findNeighbours(x, y))
        }
    }
}

console.log("Total sum", sum)

