const input = await fetch('https://adventofcode.com/2024/day/3/input').then(r => r.text());

let pt1 = [...input.matchAll(/mul\(\d\d?\d?,\d\d?\d?\)/g)].map(a => a[0]).map(l => l.replace("mul(", "").replace(")","").split(",")).map(l => l.map(Number)).map(l => l[0] * l[1]).reduce((acc,val) => acc + val, 0)

console.log("PT1:", pt1)
let pt2 = [...input.matchAll(/mul\((\d+),(\d+)\)|do\(\)|don't\(\)/g)].reduce((acc,val) => {
    if (val[0] == "don't()") {
      return [acc[0], false]
    } else if (val[0] == "do()") {
      return [acc[0], true]
    } else if (acc[1]) {
      return [acc[0] + (Number(val[1]) * Number(val[2])),true]
    } else {
      return acc
    }
}, [0,true])
console.log("PT2:", pt2[0])