const fs = require('fs');
const { performance } = require('perf_hooks');

const input = fs.readFileSync('../inputs_prod/7.txt', 'utf-8');
const rules = input.split('\n').map(rule => rule.split(': ')).map(([out, input]) => [Number(out), input.split(' ').map(Number)])


function sumPossible(i, o, accumulator = 0) {
    if (i.length == 0) return o == accumulator;
    const [head, ...tail] = i;
    return sumPossible(tail, o, accumulator + head) || sumPossible(tail, o, accumulator * head)
}

const concat = (a, b) => a * Math.pow(10, Math.floor(Math.log10(b)) + 1) + b;

function sumPossible2(i, o, accumulator = 0) {
    if (i.length == 0) return o == accumulator;
    const [head, ...tail] = i;
    return sumPossible2(tail, o, accumulator + head) || sumPossible2(tail, o, accumulator * head) || sumPossible2(tail, o, concat(accumulator, head))
}
const startTime1 = performance.now()
console.log("PT 1:", rules.reduce((acc, [o, i]) => acc + (sumPossible(i, o) ? o : 0), 0))
const endTime1 = performance.now()
console.log("Time 1:", endTime1 - startTime1)
const startTime2 = performance.now()
console.log("PT 2:", rules.reduce((acc, [o, i]) => acc + (sumPossible2(i, o) ? o : 0), 0))
const endTime2 = performance.now()
console.log("Time 2:", endTime2 - startTime2)

