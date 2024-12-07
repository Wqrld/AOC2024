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
let directions = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];

let count = 0;
let field = input.split("\n").map(l => l.split(""));
for (let y = 0; y < field.length; y++) {
    for (let x = 0; x < field[y].length; x++) {
        for (const [dx, dy] of directions) {
            let found = true;
            for (let i = 0; i < 4; i++) {
                let nx = x + dx * i;
                let ny = y + dy * i;
                if (nx < 0 || ny < 0 || nx >= field[0].length || ny >= field.length || field[ny][nx] != "XMAS"[i]) {
                    found = false;
                    break;
                }
            }
            if (found) {
                console.log("Found XMAS at", x, y);
                count++;
            }
        }
    }
}
console.log("PT 1", count);