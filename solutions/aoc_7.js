const fs = require('fs');

// Stolen from https://stackoverflow.com/questions/12303989/cartesian-product-of-multiple-arrays-in-javascript#43053803
// Generate all possible options for combining the operators and numbers
let cartesian =
    (a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));

//  https://stackoverflow.com/questions/31879576/what-is-the-most-elegant-way-to-insert-objects-between-array-elements#55387306
// Used to intervleave the array of numbers with the operators
const interleave = (arr, thing) => [].concat(...arr.map(n => [n, thing])).slice(0, -1)

const input = fs.readFileSync('aoc/7.txt', 'utf-8');
const rules = input.split('\n').map(rule => rule.split(': ')).map(([out, input]) => [Number(out), input.split(' ').map(Number)])

/**
 * Calculates the calibration results
 * @param {[output, input]} rules tuple of an output value and an input array of numbers
 * @param {Array} operators allowed operators, e.g. ['+', '*']
 * @returns Sum of all outputs that can be calculated from the input and operators
 */
function calculateCalibrationResults(rules, operators) {

    let total = 0;
    for (const [output, input] of rules) {
        let found = false;
        const combinations = cartesian(interleave(input.map(n => [n]), operators));

        for (const combination of combinations) {
            const [sum] = combination.reduce((acc, val) => {
                if (acc[1] == "+") {
                    return [acc[0] + val, null]
                } else if (acc[1] == "*") {
                    return [acc[0] * val, null]
                } else if (acc[1] == "||") {
                    return [Number('' + acc[0] + val), null]
                } else {
                    return [acc[0], val]
                }

            }, [0, '+'])

            if (sum == output) {
                found = true;
                break;
            }

        }
        if (found) {
            total += output
        }
    }
    return total;
}

console.log("PT 1:", calculateCalibrationResults(rules, ['+', '*']))
console.log("PT 2:", calculateCalibrationResults(rules, ['+', '*', '||']))