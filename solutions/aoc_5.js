const input = await fetch('https://adventofcode.com/2024/day/5/input').then(r => r.text());

// stolen from https://stackoverflow.com/questions/4856717/javascript-equivalent-of-pythons-zip-function
const zip= rows=>rows[0].map((_,c)=>rows.map(row=>row[c]))

let dependencies = input.split("\n\n")[0].split("\n").map(l => l.split("|").map(Number))

let originals = input.split("\n\n")[1].split("\n").map(l => l.split(",").map(Number))

let corrected = originals.map(original => original.toSorted((x,y) => {
    // If x should be before y, return -1
    for (let [a,b] of dependencies) {
        if (x == a && y == b) return -1
    }
    // If y should be before x, return 1
    for (let [a,b] of dependencies) {
        if (x == b && y == a) return 1
    }
    // If no dependency, return 0
    return 0
    
}));

let correct = zip([corrected, originals]).filter(([a,b]) => a.join(",") == b.join(",")).map(([a, b]) => a);
let incorrect = zip([corrected, originals]).filter(([a,b]) => a.join(",") != b.join(",")).map(([a, b]) => a);


let correctsum = correct.map(l => l[Math.floor(l.length/2)]).reduce((acc, val) => acc + val, 0);
console.log("PT 1", correctsum);


let incorrectsum = incorrect.map(l => l[Math.floor(l.length/2)]).reduce((acc, val) => acc + val, 0);
console.log("PT 2", incorrectsum);