const fs = require("fs");
const input = fs.readFileSync("inputs_prod/15.txt", "utf8");

const [fieldInput, taskinput] = input.split("\n\n");

const field = fieldInput.split("\n").map((row) => row.split(""));
const tasks = taskinput.replace(/\n/g, "");

console.log(field, tasks)

const mapping = { '^': [0, -1], 'v': [0, 1], '<': [-1, 0], '>': [1, 0] };

let robotPos = field.map((row) => row.indexOf("@")).reduce((acc, val, i) => val !== -1 ? [val, i] : acc, [-1, -1]); // always centered, but this is more generic
console.log(robotPos)
field[robotPos[1]][robotPos[0]] = ".";

for (const task of tasks) {
    const [dx, dy] = mapping[task];
    const [x, y] = robotPos;
    const [nx, ny] = [x + dx, y + dy];
    if (field[ny][nx] === "#") {
        robotPos = [x, y]; // if wall reached, do nothing
    } else if (field[ny][nx] === "O") {
        // Block reached. move it
        let [bx, by] = [nx + dx, ny + dy];
        // loop over all fields in that direction until we see a ., then move the block there and the robot to the block
        while (true) {
            if (field[by][bx] === "#") {
                break;
            }
            else if (field[by][bx] == "O") {
                bx += dx;
                by += dy;
            }
            else if (field[by][bx] == ".") {
                field[by][bx] = "O";
                field[ny][nx] = ".";
                robotPos = [nx, ny];
                break;
            }
        }
    } else if (field[ny][nx] === ".") {
        robotPos = [nx, ny];
    }
   // console.log(printField(robotPos, field), task)
}

function printField(robotPos, field) {
    return field.map((row, y) => row.map((cell, x) => x === robotPos[0] && y === robotPos[1] ? "@" : cell).join("")).join("\n");
}

function sumGPSCoordinates(field) {
    return field.reduce((acc, row, y) => acc + row.reduce((acc, cell, x) => acc + (cell === "O" ? x + (100*y) : 0), 0), 0);
}

console.log(sumGPSCoordinates(field));