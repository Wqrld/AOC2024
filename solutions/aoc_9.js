const fs = require('fs');
let rawInput = fs.readFileSync('./inputs_prod/9.txt', 'utf-8');
//let rawInput = "23331331214141314020";
if (rawInput % 2 != 0) rawInput += "0";
let input = rawInput.split("").map(Number)



let firstIndex = 0
let lastIndex = input.length - 2;
let checksum = 0;
let counter = 0;
let output = [];
while (true) {
    if (firstIndex % 100 == 0) {
        console.log(`Progress ${firstIndex}/${input.length}`)
    }
    if (firstIndex > input.length || lastIndex < 0) break;
    if (firstIndex % 2 == 0) {
        // we're dealing with a character
        if (input[firstIndex] == 0) {
            // depleted this character, move on
            firstIndex++;
            continue;
        } else {
            // add character to output
           // output.push(firstIndex / 2) // no! this should be dependend on the location (division blabla)
            checksum += (counter * (firstIndex / 2))
            counter++;
            input[firstIndex]--;
        }
    } else {
        // We're dealing with a gap
        if (input[lastIndex] == 0) {
            // depleted this end character, move on
            lastIndex -= 2;
            continue;
        } else if (input[firstIndex] == 0) {
            // depleted this gap, move on
            firstIndex++;
            continue;
        } else {
            // add character to place of gap
           // output.push(lastIndex / 2)  // no! this should be dependend on the location (division blabla)`
            checksum += (counter * (lastIndex / 2))
            counter++;

            input[lastIndex]--;
            input[firstIndex]--;
        }
    }
   // console.log(input);
}
//console.log(output)
console.log(checksum)

//edgecase: a gap is leftover. these should be counted correctly.
// every time we add a number to the checksum, 1 should be added to the counter.