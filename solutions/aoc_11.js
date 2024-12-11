// let input = `125 17`
const fs = require('fs');
const { performance } = require('perf_hooks');
let input = fs.readFileSync('./inputs_prod/11.txt', 'utf-8');
let i = input.split(" ").map(Number)

let childCache = {}

function countChildren(number, depth) {
    if (childCache[depth]?.[number]) return childCache[depth][number];

    if (depth == 0) return 1;
    let len = ("" + number).length;
    while (len % 2 != 0 && depth > 0) {

        if (number == 0) {
            number = 1;
        } else {
            number = number * 2024;
        }
        depth = depth - 1;
        len = ("" + number).length;
    }
    if (depth == 0) return 1;

    let num1 = Number(("" + number).slice(0, len / 2));
    let num2 = Number(("" + number).slice(len / 2, len));
    let n1 = childCache[depth-1]?.[num1] ?? countChildren(num1, depth - 1);
    let n2 = childCache[depth-1]?.[num2] ?? countChildren(num2, depth - 1);
    if (!childCache[depth-1]) childCache[depth-1] = {};
    childCache[depth-1][num1] = n1;
    childCache[depth-1][num2] = n2;
    return n1 + n2;

}

console.log("PT1", i.reduce((acc, item) => acc + countChildren(item, 25), 0))

const startTime1 = performance.now()
let a = i.reduce((acc, item) => acc + countChildren(item, 75), 0)
const endTime1 = performance.now()
console.log("Time 2:", (endTime1 - startTime1).toFixed(), "ms")

console.log("PT2", i.reduce((acc, item) => acc + countChildren(item, 75), 0))
