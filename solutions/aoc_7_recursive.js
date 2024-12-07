const fs = require('fs');
const { performance } = require('perf_hooks');

/**
 * Optimizations:
 * Use list index to avoid copying the array
 * Use inline math.power for concatenation instead of string conversion
 * Use recursion instead of cartesian product
 * Do not measure time for console.log
 * Use ternary in the return statement
 * 
 * Measures 10ms for pt 1, 650ms for pt 2
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

// Part 2
function sumPossible2(i, index, o, accumulator = 0) {
    if (accumulator > o) return false;
    return (index == i.length) ?
        o == accumulator :
        (
            sumPossible2(i, index + 1, o, accumulator + i[index]) // add
            || sumPossible2(i, index + 1, o, accumulator * i[index]) // multiply
            || sumPossible2(i, index + 1, o, accumulator * Math.pow(10, Math.floor(Math.log10(i[index])) + 1) + i[index]) // concatenate
        )
}

const startTime2 = performance.now()
const two = rules.reduce((acc, [o, i]) => (sumPossible2(i, 0, o) ? acc + o : acc), 0)
const endTime2 = performance.now()
console.log("PT 2:", two)
console.log("Time 2:", (endTime2 - startTime2).toFixed(), "ms")