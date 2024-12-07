const input = await fetch('https://adventofcode.com/2024/day/1/input').then(r => r.text());

// Shared
let lists = input
    .split(/\n/)
    .filter(l => l != '')
    .map(l => l.split("   "))
    .reduce((acc, val) => [[...acc[0], Number(val[0])], [...acc[1], Number(val[1])]], [[], []]);

// Part 1
let sortedlist = lists.map(arr => arr.sort());

let part1 = sortedlist[0].reduce((acc, val, i) => acc + Math.abs(sortedlist[0][i] - sortedlist[1][i]), 0);
console.log("Part 1", part1);

// Part 2
let groupedlist = Object.groupBy(lists[1], (e) => e)

let part2 = lists[0].reduce((acc, val) => acc + (val * (groupedlist[val]?.length || 0)), 0)

console.log("Part 2", part2)