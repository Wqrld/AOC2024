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

const cache: {[k: string]: [number, boolean]} = {}

// console.log(combinations.reduce((acc, combination) => acc + (fitRecursiveCaching(combination, parts, 0)), 0));

/**
 * 
 * @param toGenerate string to generate
 * @param parts list of string parts to use
 * @param possibilitiesUntilThisPoint how many 
 * @returns 
 */
function fitRecursiveCaching(toGenerate: string, parts: string[]): [number, boolean] {
    if (toGenerate in cache) {
        return cache[toGenerate];
    }
    if (toGenerate == "") {
        return [1, true]
    }
    let possibilities = 0

    // 
    for (const part of parts) {
        if (toGenerate.startsWith(part)) {
            const sliced = toGenerate.slice(part.length);
            const [possibilitiesCount, success] = fitRecursiveCaching(sliced, parts);
            cache[sliced] = [possibilitiesCount, success];
            if (success) {
                possibilities += possibilitiesCount;
            }
        }
    }
    if (possibilities > 0) {
        cache[toGenerate] = [possibilities, true];
        return [possibilities, true];
    }

    cache[toGenerate] = [999999, false];
    return [999999, false];
}

for (const combination of combinations) {
    console.log(fitRecursiveCaching(combination, parts));
}

console.log(combinations.reduce((acc, combi) => {
    const [count, success] = fitRecursiveCaching(combi, parts);
    return acc + (success ? count : 0);
}, 0))