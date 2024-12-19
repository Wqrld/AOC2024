const fs = require("fs");

let [inputParts, inputCombinations] = fs.readFileSync("inputs_prod/19.txt", "utf8").split("\n\n");
const parts = inputParts.split(", ");
const combinations = inputCombinations.split("\n");

let count = 0;


function isGeneratingSet(combinationset, parts) {
    return combinationset.every(combination => fitRecursive(combination, parts));
}


let tryParts = structuredClone(parts);

for (let i = 0; i < 1000; i++) {
    let first = tryParts.shift();
    if (!isGeneratingSet(parts, tryParts)) {
        tryParts.push(first); // if removing this part makes it impossible to generate the full set, we need to keep it.
    }
}

console.log(isGeneratingSet(parts, tryParts));




console.log(combinations.reduce((acc, combination) => acc + (fitRecursive(combination, tryParts) ? 1 : 0), 0));

function fitRecursive(toGenerate, parts) {
    if (toGenerate == "") {
        return true;
    }
    for (const part of parts) {
        if (toGenerate.startsWith(part)) {
            const sliced = toGenerate.slice(part.length);
            if (fitRecursive(sliced, parts)) {
                return true;
            }
        }
    }

    return false;
}