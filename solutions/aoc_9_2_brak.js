const fs = require('fs');
// let rawInput = fs.readFileSync('./inputs_prod/9.txt', 'utf-8');
let rawInput = "23331331214141314020";
if (rawInput % 2 != 0) rawInput += "0";
let input = rawInput.split("").map(Number)

// loop over all characters back to front
// then for each of those, loop over all gaps front to back
// if fit has been found, move number
// well yes, but this doesnt work with the counting...
// we are able to count back to front, is that an option?

let inputIndex = 0; // in input string. NOT output string
let checksum = 0;
let lastOpen = input.length - 2;

let list = [];
let outputIndex = 0;

function mapToDisk(input, index, disk = "", counter = 0) {
    if (index > input.length) return disk; // todo check
   // console.log(index, input.length - 1);

    
    const file = ("" + counter).repeat(input[index]);
    const spacers = ".".repeat(input[index + 1]);
    return mapToDisk(input, index + 2, disk + file + spacers, counter + 1);
}


while (true) {
    console.log(mapToDisk(input, 0, "", 0))
    if (inputIndex >= lastOpen) break;
    if (inputIndex % 2 == 0) {
        // Character
        if (input[inputIndex] == 0) {
            // if this character is depleted, go on
            inputIndex++;
        } else {
            // new character to add to output
            input[inputIndex]--;
            checksum += outputIndex * (inputIndex / 2)
            list.push(inputIndex / 2)
            outputIndex++
        }
    } else {
        // spacer
        if (input[inputIndex] == 0) {
            // no space left. Leave me
            inputIndex++;
        } else {
            // There is some open space here. Look forward if there is anything we can put here
            let found = false;
            for (let i = lastOpen; i > inputIndex; i-= 2) {
                if (input[i] > 0 && input[i] <= input[inputIndex]) {
                    // the item at location i is smaller or equal in size than our gap
                    found = true; // mark as found so we can push an item
                    input[i]--; // decrease the item count
                    input[inputIndex]--; // decrease the gap size
                    checksum += outputIndex * (i / 2) // add the item to our checksum
                    list.push(i / 2)
                    outputIndex++ // move up one
                    break;
                }
            }
            if (!found) {
                // this is a gap, but nothing can be moved into it
                list.push(".")
                outputIndex++
                input[inputIndex]--;
            }
        }
    }
}

// while (true) {
//     if (firstOpen >= lastOpen) break;
//     if (firstOpen % 2 == 0) {
//         // character
//         if (input[firstOpen] == 0) {
//             firstOpen++;
//         } else {
//             list.push(("" + firstOpen).repeat(input[firstOpen]))
//             input[firstOpen] = 0
//         }
//     } else {
//         if (input[firstOpen] == 0) {
//             firstOpen++;
//         } else {
//             // look from back to front if there is anything that fits in this space.
//             let found = false;
//             for (let i = lastOpen; i > firstOpen; i-=2) {
//                 if (input[i] != 0 && input[i] <= input[firstOpen]) {
//                     input[firstOpen] -= input[i];
//                     input[i] = 0;
//                     found = true;
//                     break;
//                 }
//             }
//             if (!found) {
//                 list.push((".").repeat(input[firstOpen]))
//                 firstOpen++;
//             }
//         }
//         // space

//     }
// }

console.log(checksum)
console.log(list)