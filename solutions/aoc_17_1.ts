const fs = require('fs');

const [registerText, ProgramText] = fs.readFileSync('inputs_prod/17.txt', 'utf-8').split('\n\n');
const registerlist = registerText.split('\n').map((line) => Number(line.split(' ')[2]));
let A = registerlist[0];
let B = registerlist[1];
let C = registerlist[2];

const instructions = ProgramText.split(" ")[1].split(",").map(Number)

console.log(A, B, C, instructions);

let output: number[] = [];

let IP = 0;
let instruction = instructions?.[IP];
let operand = instructions?.[IP + 1];

const opCodeMap = { 0: "ADV", 1: "BXL", 2: "BST", 3: "JNZ", 4: "BXC", 5: "OUT", 6: "BDV", 7: "CDV" }

while (instruction != undefined) {
    const decoded = opCodeMap[instruction];
    console.log(decoded, operand);

    if (decoded == "ADV") {
        // division
        let numerator = A;
        let denominator = Math.pow(2, decodeComboOperand(operand));
        A = Math.floor(numerator / denominator);

        IP += 2;
    } else if (decoded == "BXL") {
        // bitwise XOR
        B = B ^ operand;
        IP += 2;
    } else if (decoded == "BST") {
        // modulo
        B = decodeComboOperand(operand) % 8;
        IP += 2;
    } else if (decoded == "JNZ") {
        // Jump
        if (A != 0) {
            IP = operand;
        } else {
            IP += 2;
        }
    } else if (decoded == "BXC") {
        // bitwise xor
        B = B ^ C;
        IP += 2;
    } else if (decoded == "OUT") {
        // output
        output.push(decodeComboOperand(operand) % 8);
        IP += 2;
    } else if (decoded == "BDV") {
        // division
        let numerator = A;
        let denominator = Math.pow(2, decodeComboOperand(operand));
        B = Math.floor(numerator / denominator);

        IP += 2;
    } else if (decoded == "CDV") {
        // division
        let numerator = A;
        let denominator = Math.pow(2, decodeComboOperand(operand));
        C = Math.floor(numerator / denominator);

        IP += 2;
    } else {
        throw new Error("Unknown instruction");
    }

    instruction = instructions?.[IP];
    operand = instructions?.[IP + 1];
}

console.log(output.join(","));

function decodeComboOperand(operand): number {
    if (operand == 0 || operand == 1 || operand == 2 || operand == 3) {
        return operand;
    } else if (operand == 4) {
        return A;
    } else if (operand == 5) {
        return B;
    } else if (operand == 6) {
        return C;
    } else {
        throw new Error("Unknown operand");
    }
}
