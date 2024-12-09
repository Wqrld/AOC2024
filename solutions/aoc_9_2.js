const fs = require('fs');
let rawInput = fs.readFileSync('./inputs_prod/9.txt', 'utf-8');
// let rawInput = "23331331214141314020";
if (rawInput % 2 != 0) rawInput += "0";
let input = rawInput.split("").map(Number)
const { performance } = require('perf_hooks');

let inputIndex = input.length - 2;
// outputIndex = sum of all numbers before that

let checksum = 0;

function mapToDisk(input, index, disk = [], counter = 0) {
    if (index >= input.length) return disk; // todo check
    // console.log(index, input.length - 1);


    const file = { e: counter, c: input[index] }
    const spacers = { e: '.', c: input[index + 1] }
    return mapToDisk(input, index + 2, disk.concat([file]).concat([spacers]), counter + 1);
}

function diskprint(disk) {
    if (disk.length == 0) return "";
    let [head, ...tail] = disk;
    return ("" + head.e).repeat(head.c) + diskprint(tail)
}

// console.log(mapToDisk(input, 0, [], 0))

let disk = mapToDisk(input, 0, [], 0);
// pick last character group
// look from start to end where there is space
for (let i = disk.length - 1; i >= 0; i -= 1) {
    // console.log(diskprint(disk))
    // console.log(mapToDisk(input, 0, [], 0))
    if (disk[i].e == '.') continue;
    for (let j = 1; j < i; j += 1) {
        if (disk[j].e != ".") continue
        if (disk[j].c >= disk[i].c) {
            disk[j].c -= disk[i].c; // reduce gap size
            disk.splice(j, 0, { e: disk[i].e, c: disk[i].c }) // add back in correct place
            disk[i + 1].e = "."
            //disk.splice(i, 1, { e: '.',       c: disk[i].c }) // replace text with spacer
            //disk.splice(i, 1)
            break;
        }
    }
}

let sum = 0;
let counter = 0;
while (disk.length > 0) {
    if (disk[0].c == 0) {
        disk.splice(0, 1);
    } else {
        if (disk[0].e != ".") {
            sum += counter * disk[0].e;
        }
        disk[0].c--;
        counter++;
    }
}

console.log(sum)



// while(true) {
//     if (input[inputIndex] == 0) {
//         inputIndex--;
//     } else {
//         // find a gap large enough for this number
//         let found = false;
//         for (let i = inputIndex - 1; i > 0; i-= 2) {
//             if (input[i] >= input[inputIndex]) {
//                 found = true;
//                 input[i] -= 1 // shrink gap
//                 input[inputIndex] -= 1 // shrink number
//                 checksum += ()

//             }
//         }
//     }
// }
//edgecase: a gap is leftover. these should be counted correctly.
// every time we add a number to the checksum, 1 should be added to the counter.

// pt 2. For every even character block, look back for space that might fit it.


// picking last number is easy
// then finding a place to put it is easy
// but then, the numbering will be all fucked up