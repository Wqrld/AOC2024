let input = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`

//const input = await fetch('https://adventofcode.com/2024/day/4/input').then(r => r.text());



// search for XMAS
// let directions = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];

let directions = [
    [[-1, -1, "M"], [0, 0, "A"], [1, -1, "S"], [-1, 1, "M"], [1, 1, "S"]],
    [[-1, -1, "S"], [0, 0, "A"], [1, -1, "M"], [-1, 1, "S"], [1, 1, "M"]],
    [[-1, -1, "S"], [0, 0, "A"], [1, -1, "S"], [-1, 1, "M"], [1, 1, "M"]],
    [[-1, -1, "M"], [0, 0, "A"], [1, -1, "M"], [-1, 1, "S"], [1, 1, "S"]],
];
/**
 *   1     2     3    4
 * 
 *  M.S   S.M   S.S  M.M
 *  .A.   .A.   .A.  .A.
 *  M.S   S.M   M.M  S.S
 */

let count = 0;
let field = input.split("\n").map(l => l.split(""));
for (let y = 0; y < field.length; y++) {
    for (let x = 0; x < field[y].length; x++) {
        // for every position, check if any of the directions are correct
        let fails = 0;
        for (const option of directions) {
            for (const [dx, dy, c] of option) {
                let nx = x + dx;
                let ny = y + dy;
                if (nx < 0 || ny < 0 || nx >= field[0].length || ny >= field.length || field[ny][nx] != c) {
                    fails++;
                    break;
                }
            }
        }
        if (fails < directions.length) {
            console.log("Found XMAS at", x, y);
            count++;
        }
    }
}
console.log("PT 2", count);