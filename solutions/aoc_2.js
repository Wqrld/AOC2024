// let input = `7 6 4 2 1
// 1 2 7 8 9
// 9 7 6 2 1
// 1 3 2 4 5
// 8 6 4 4 1
// 1 3 6 7 9
// `
const input = await fetch('https://adventofcode.com/2024/day/2/input').then(r => r.text());

const split = input
  .split(/\n/)
  .filter(l => l != '')
  .map(l => l.split(" "))
  .map(a => a.map((Number)));

const allDecreasing = (list) => list.every(
  (e,i) => i==0 || e == list[i-1] - 1 || e == list[i-1] - 2 || e == list[i-1] - 3);
const allIncreasing = (list) => list.every(
  (e,i) => i==0 || e == list[i-1] + 1 || e == list[i-1] + 2 || e == list[i-1] + 3);

const one = split.map(
  (s) => (allDecreasing(s) || allIncreasing(s))
).reduce(
  (acc, val) => acc + val, 0)
console.log("Challenge 1: ", one)

const permutations = split.map(
  (report) => report.map(
    (_, levelindex) => report.filter(
      (_, levelindex2) => levelindex != levelindex2 )))

const two = permutations.map(
  (permlist) => permlist.some(
    (perm) => (allDecreasing(perm) || allIncreasing(perm))
  ))
   .reduce((acc, val) => acc + val, 0);
console.log("Challenge 2:", two)