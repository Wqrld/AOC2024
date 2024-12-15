const fs = require("fs");
const input = fs.readFileSync("inputs_prod/15.txt", "utf8");

const [fieldInput, taskinput]: [string, string] = input.split("\n\n");

const field = fieldInput.replaceAll("#", "##").replaceAll("O", "[]").replaceAll(".", "..").replaceAll("@", "@.").split("\n").map((row) => row.split(""));

const DEV = false;

let visited: [number, number][] = [];
let alreadyReplaced: [number, number][] = [];
let alreadyPushedFromBottom: [number, number][] = [];

const tasks = taskinput.replace(/\n/g, "");

if (DEV) console.log(field, tasks)

const mapping = { '^': [0, -1], 'v': [0, 1], '<': [-1, 0], '>': [1, 0] };

let robotPos = field.map((row) => row.indexOf("@")).reduce((acc, val, i) => val !== -1 ? [val, i] : acc, [-1, -1]); 
if (DEV) console.log(robotPos)
field[robotPos[1]][robotPos[0]] = ".";

for (const task of tasks) {
    const [dx, dy] = mapping[task];
    const [x, y] = robotPos;
    const [nx, ny] = [x + dx, y + dy];
    if (task === "^" || task === "v") {
        if (DEV) console.log(printField(robotPos, field), task, canMoveUpDown(task === "^" ? -1 : 1, [nx, ny], field, true));
    } else {
        if (DEV) console.log(printField(robotPos, field), task);
    }
    if (field[ny][nx] === "#") {
        robotPos = [x, y]; // if wall reached, do nothing
    } else if ((field[ny][nx] === "[" || field[ny][nx] === "]") && (task == ">" || task == "<")) {

        let [bx, by] = [nx + dx, ny + dy];

        while (true) {
            if (field[by][bx] === "#") {
                break;
            }
            else if (field[by][bx] == "[" || field[by][bx] == "]") {
                bx += dx;
                by += dy;
            }
            else if (field[by][bx] == ".") {
                while (bx != x || by != y) {
                    field[by][bx] = field[by - dy][bx - dx];
                    bx -= dx;
                    by -= dy;
                }

                robotPos = [nx, ny];
                break;
            }
        }
    } else if ((field[ny][nx] === "[" || field[ny][nx] === "]") && (task == "^" || task == "v")) {
        if (canMoveUpDown(task === "^" ? -1 : 1, [nx, ny], field, true)) {
            moveUpDown(task == "^" ? -1 : 1, [nx, ny], ".", structuredClone(field), "push");
            visited = [];
            alreadyPushedFromBottom = [];
            robotPos = [nx, ny];
        }

    }
    else if (field[ny][nx] === ".") {
        robotPos = [nx, ny];
    }
}

function canMoveUpDown(direction: -1 | 1, [x, y]: [number, number], field: string[][], needCheckOther): boolean {
    if (field[y][x] === "#") return false; // walls cannot move
    else if (field[y + direction][x] === "#" && field[y][x] !== ".") return false; // if we have a wall above we cannot move
    else if (field[y][x] === ".") return true;

    else if (field[y][x] == "[") return canMoveUpDown(direction, [x, y + direction], field, true) && (!needCheckOther || canMoveUpDown(direction, [x + 1, y], field, false));

    else if (field[y][x] == "]") return canMoveUpDown(direction, [x, y + direction], field, true) && (!needCheckOther || canMoveUpDown(direction, [x - 1, y], field, false));

    else if (field[y + direction][x] === ".") return true; // if item above me is a gap, i can move up

    throw new Error(`Canmoveupdown on invalid field {${x}, ${y}} ${field[y][x]}`);

}



function moveUpDown(direction: -1 | 1, [x, y]: [number, number], fillWith: string, originalField: string[][], type: "sameblock" | "push"): void {

    if (!alreadyPushedFromBottom.some(([cx, cy]) => cx === x && cy === y)) {
        if (type == "push") {
            alreadyPushedFromBottom.push([x, y]);
        }
        field[y][x] = fillWith;
    }

    if (originalField[y][x] == "[") {
        if (originalField[y][x + 1] == "]" && !visited.some(([cx, cy]) => cx === x + 1 && cy === y)) {
            visited.push([x + 1, y]);
            moveUpDown(direction, [x + 1, y], ".", originalField, "sameblock");
        }
        moveUpDown(direction, [x, y + direction], "[", originalField, "push");
    }
    else if (originalField[y][x] == "]") {
        if (originalField[y][x - 1] == "[" && !visited.some(([cx, cy]) => cx === x - 1 && cy === y)) {
            visited.push([x - 1, y]);
            moveUpDown(direction, [x - 1, y], ".", originalField, "sameblock");
        }
        moveUpDown(direction, [x, y + direction], "]", originalField, "push");
    }
    else if (originalField[y][x] !== ".") {
        console.log("==========")
        console.log(printField([x, y], field));
        throw new Error(`moveupdown on invalid field {${x}, ${y}} ${field[y][x]}`);
    }

}

function printField(robotPos, field) {
    return field.map((row, y) => row.map((cell, x) => x === robotPos[0] && y === robotPos[1] ? "@" : cell).join("")).join("\n");
}

function sumGPSCoordinates(field) {
    return field.reduce((acc, row, y) => acc + row.reduce((acc, cell, x) => acc + (cell === "[" ? x + (100 * y) : 0), 0), 0);
}


console.log(sumGPSCoordinates(field));