const fs = require("fs");

// let input = `....#.....
// .........#
// ..........
// ..#.......
// .......#..
// ..........
// .#..^.....
// ........#.
// #.........
// ......#...`
 let input = fs.readFileSync("./6.txt", "utf8");

let field = input.split("\n").map(l => l.split(""));

let x = field.map(r => r.findIndex((i) => i == "^")).find((e) => e != -1);
let y = field.map(r => r.findIndex((i) => i == "^")).findIndex((e) => e != -1);

/**
 * Attempts a path from a given position in a given direction
 * @param {Array<Array<String>>} infield 
 * @param {Number} x 
 * @param {Number} y 
 * @param {"up"|"down"|"left"|"right"} direction 
 * @returns [gotOut, steps, outfield]
 */
function tryPath(infield, x, y, direction) {
    let field = structuredClone(infield);
    // We want to know, for every position, have we been here while looking in this direction

    let count = 0;

    for (let i = 0; i < 15000; i++) {
        if (y >= field.length || x >= field[0].length || y < 0 || x < 0) {
            return [true, count, field]
        }

        if (direction == "up") {
            if (y - 1 != -1 && field[y - 1][x] == "#") { // 
                // if (field[y][x] == "O") {
                //     return [false, count, field];
                // }
                direction = "right";
            } else {
                field[y][x] = "O";
                y = y - 1;
                count++;
            }
        } else if (direction == "right") {
            if (x + 1 != field[0].length && field[y][x + 1] == "#") {
                // if (field[y][x] == "O") {
                //     return [false, count, field];
                // }
                direction = "down";
            } else {
                field[y][x] = "O";
                x = x + 1;
                count++;
            }
        } else if (direction == "down") {
            if (y + 1 != field.length && field[y + 1][x] == "#") {
                // if (field[y][x] == "O") {
                //     return [false, count, field];
                // }
                direction = "left";
            } else {
                field[y][x] = "O";
                y = y + 1;
                count++;
            }
        } else if (direction == "left") {
            if (x - 1 != -1 && field[y][x - 1] == "#") {
                // if (field[y][x] == "O") {
                //     return [false, count, field];
                // }
                direction = "up";
            } else {
                field[y][x] = "O";
                x = x - 1;
                count++;
            }
        }
       // fs.writeFileSync("./steps/" + i + ".txt", field.map(l => l.join("")).join("\n"));
        // console.log(" ");
    }
    return [false, count, field];

}

const attemptOne = tryPath(field, x, y, "up");

console.log("1. Amount of steps needed in original:", attemptOne[2].reduce((acc, val) => acc + val.filter((i) => i == "O").length, 0));

// Part 2 idea:
// for every position with a .
// run the algorithm, and determine if the exit is reached or not
// If a guard is in front of an obstacle, and has already been there, we know it's a loop
let possibleObstructions = 0;
for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[0].length; j++) {
        if (field[i][j] == ".") {
            let obstructedField = structuredClone(field);
            obstructedField[i][j] = "#";
            let attempt = tryPath(obstructedField, x, y, "up");
            if (!attempt[0]) {
              //  console.log(i, j);
             //   obstructedField[i][j] = "O";
               // console.log(obstructedField.map(l => l.join("")).join("\n"));
                possibleObstructions++;
            }
        }
    }
}
console.log("2: Possible obstructions:", possibleObstructions);

// field[4][5] = "#";
// const attemptOne = tryPath(field, x, y, "up");

// console.log(attemptOne[0])
// console.log(attemptOne[1])
// console.log(attemptOne[2].map(l => l.join("")).join("\n"));

// //console.log("1. Amount of steps needed in original:", attemptOne[2].reduce((acc, val) => acc + val.filter((i) => i == "O").length, 0));