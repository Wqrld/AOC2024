const fs = require('fs');
const input = fs.readFileSync('./inputs_prod/8.txt', 'utf-8');

let field = input.split('\n').map(line => line.split(''));

// Create a 2D array from the input
//let mask = Array.from({ length: field.length }, () => Array.from({ length: field[0].length }, () => '.'));
let mask = structuredClone(field);

const PT = 2;


let uniqueCharacters = new Set();
field.forEach(line => line.forEach(char => uniqueCharacters.add(char)))
// uniqueCharacters.add('A')
uniqueCharacters.delete('.')

console.log(field)
console.log(uniqueCharacters)

// For every character, collect a list of all locations with this character
let characterLocations = {};
uniqueCharacters.forEach(char => {
    characterLocations[char] = [];
    field.forEach((line, y) => line.forEach((c, x) => {
        if (c === char) {
            characterLocations[char].push([x, y])
        }
    }))
})

console.log(characterLocations)
for (const character of uniqueCharacters) {
    const candidates = []
    for (const [x1, y1] of characterLocations[character]) {
        for (const [x2, y2] of characterLocations[character]) {
            if (x1 === x2 && y1 === y2) continue;
            let dx = x2 - x1;
            let dy = y2 - y1;
            if (PT == 2) {
                for (let i = 1; i < (Math.max(field[0].length, field.length)); i++) {
                    candidates.push([x1 + i * dx, y1 + i * dy])
                }
            } else {
                candidates.push([x1 + 2 * dx, y1 + 2 * dy])
            }
        }
    }
    console.log(candidates)
    candidates.filter(([x, y]) => x >= 0 && y >= 0 && x < field[0].length && y < field.length).forEach(([x, y]) => {
        mask[y][x] = '#'
    })
}

console.log("New Mask")
console.log(mask.map(line => line.join('')).join('\n'))
console.log("# Count:", mask.map(line => line.filter(char => char === '#').length).reduce((acc, val) => acc + val, 0))