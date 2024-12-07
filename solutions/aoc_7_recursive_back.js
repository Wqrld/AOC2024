const fs = require('fs');
const { performance } = require('perf_hooks');

/**
 * Optimizations:
 * Use list index to avoid copying the array
 * Use inline math.power for concatenation instead of string conversion
 * Use recursion instead of cartesian product
 * Do not measure time for console.log
 * Use ternary in the return statement
 * Work backwards from the target number to avoid most concatenation paths
 * 
 * Measures 10ms for pt 1, 170 162ms pt 2
 */

const input = fs.readFileSync('../inputs_prod/7.txt', 'utf-8');
const rules = input.split('\n')
    .map(rule => rule.split(': '))
    .map(([out, input]) => [Number(out), input.split(' ').map(Number)])


// Part 1
function sumPossible(i, index, o, accumulator = 0) {
    return (index == i.length) ?
        o == accumulator :
        (
            sumPossible(i, index + 1, o, accumulator + i[index]) // add
            || sumPossible(i, index + 1, o, accumulator * i[index]) // multiply
        )
}

const startTime1 = performance.now()
const one = rules.reduce((acc, [o, i]) => (sumPossible(i, 0, o) ? acc + o : acc), 0);
const endTime1 = performance.now()
console.log("PT 1:", one)
console.log("Time 1:", (endTime1 - startTime1).toFixed(), "ms")

// Okay, so we start with the target number, and divide - subtract - deconcatenate the numbers at the end every time until we reach 0.
// This way, we can far more 

// Part 2
function sumPossible2(tape, index, accumulator) {
    if (index === -1 && accumulator === 0) return true;
    if (accumulator < 0) return false; // tiny optimization
    if (index === -1) return false;
    if (sumPossible2(tape, index - 1, accumulator - tape[index]) || sumPossible2(tape, index - 1, accumulator / tape[index])) {
        return true;
    }
    if (("" + accumulator).endsWith("" + tape[index])) {
        return sumPossible2(tape, index - 1, Number(("" + accumulator).slice(0, -(("" + tape[index]).length)))) // deconcatenate
    }
    return false;
}

const startTime2 = performance.now()
const two = rules.reduce((acc, [o, i]) => (sumPossible2(i, i.length - 1, o) ? acc + o : acc), 0)
const endTime2 = performance.now()
console.log("PT 2:", two)
console.log("Time 2:", (endTime2 - startTime2).toFixed(), "ms")