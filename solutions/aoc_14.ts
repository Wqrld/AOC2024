const fs = require("fs");

// let input = `p=0,4 v=3,-3
// p=6,3 v=-1,-3
// p=10,3 v=-1,2
// p=2,0 v=2,-1
// p=0,0 v=1,3
// p=3,0 v=-2,-2
// p=7,6 v=-1,-3
// p=3,0 v=-1,-2
// p=9,3 v=2,3
// p=7,3 v=-1,2
// p=2,4 v=2,-3
// p=9,5 v=-3,-3`
let input: string = fs.readFileSync("inputs_prod/14.txt", "utf8");

// In production
const yMax = 103;
const xMax = 101;

// Example
// const yMax = 7;
// const xMax = 11;

type robot = { px: number, py: number, vx: number, vy: number };

let robots: robot[] = input.split("\n").map(
    (line) => line.split(" ").map(
        (part) => part.slice(2).split(",").map(Number)
    )
).map(([[px, py], [vx, vy]] ) => ({px, py, vx, vy}))

console.log(robots)
let safetyFactor = 0;

// 100 seconds (steps)
for (let s = 0; s < 10000; s++) {
    for (let r of robots) {
        r.px = (r.px + r.vx + xMax) % xMax;
        r.py = (r.py + r.vy + yMax) % yMax;
    }
    if (s==99) safetyFactor = calculateSafetyFactor(robots);
    if (printGrid(robots).includes("###############################")) { // outline of the christmas tree. Started by just checking for #### but that was very common.
        console.log("\n".repeat(5))
        console.log(printGrid(robots))
        console.log(s+1)
    }
}

function calculateSafetyFactor(robots: robot[]) {
    // find how many robots are in each quadrant, and then multiply those counts.
    let quadrants = [0, 0, 0, 0];
    for (const r of robots.filter((r) => r.px != ((xMax-1) /2) && r.py != ((yMax-1) / 2))) {
        let q = (r.px < xMax / 2 ? 0 : 1) + (r.py < yMax / 2 ? 0 : 2);
        quadrants[q]++;
    }
    console.log(quadrants)
    return quadrants.reduce((a, b) => a * b, 1);

}

function printGrid(robots: robot[]) {
    let grid = Array(yMax).fill(0).map(() => Array(xMax).fill("."));
    for (let r of robots) {
        if(!grid[r.py]) console.log(r.py)
        grid[r.py][r.px] = "#";
    }
    return grid.map((row) => row.join("")).join("\n");
}

console.log("Safety factor:", safetyFactor);