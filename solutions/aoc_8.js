const fs = require('fs');
const input = fs.readFileSync('./inputs_prod/8.txt', 'utf-8');

let field = input.split('\n').map(line => line.split(''));
let mask = structuredClone(field);

const PT = 2;

let uniqueCharacters = new Set();
field.forEach(line => line.forEach(char => uniqueCharacters.add(char)))
uniqueCharacters.delete('.')

let characterLocations = {};
uniqueCharacters.forEach(char => {
    characterLocations[char] = [];
    field.forEach((line, y) => line.forEach((c, x) => {
        if (c === char) {
            characterLocations[char].push([x, y])
        }
    }))
})

for (const character of uniqueCharacters) {
    for (const [x1, y1] of characterLocations[character]) {
        for (const [x2, y2] of characterLocations[character]) {
            if (x1 === x2 && y1 === y2) continue;
            let dx = x2 - x1;
            let dy = y2 - y1;
            if (PT == 2) {
                for (let i = 1; (x1 + i * dx >= 0 && y1 + i * dy >= 0 && x1 + i * dx < field[0].length && y1 + i * dy < field.length); i++) {
                    mask[y1 + i * dy][x1 + i * dx] = '#'
                }
            } else if (x1 + 2 * dx >= 0 && y1 + 2 * dy >= 0 && x1 + 2 * dx < field[0].length && y1 + 2 * dy < field.length) {
                mask[y1 + 2 * dy][x1 + 2 * dx] = '#'
            }

        }
    }
}

console.log("New Mask")
console.log(mask.map(line => line.join('')).join('\n'))
console.log("# Count:", mask.map(line => line.filter(char => char === '#').length).reduce((acc, val) => acc + val, 0))