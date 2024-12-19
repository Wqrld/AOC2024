import * as fs from 'fs';

// Prepare input
let [inputParts, inputCombinations] = fs.readFileSync("inputs_prod/19.txt", "utf8").split("\n\n");
const parts = inputParts.split(", ");
const combinations = inputCombinations.split("\n");

/**
 * Check if the set of parts is able to generate the fullt arget set
 * @param combinationset Target set
 * @param parts set of parts
 * @returns true/false
 */
function isGeneratingSet(combinationset: string[], parts: string[]): boolean {
    return combinationset.every(combination => fitRecursive(combination, parts));
}

/**
 * Calculate a generating set of parts
 * @param parts target set
 * @returns smaller set (not necessarily minimal) that can generate the target set
 */
function calculateGeneratingSet(parts: string[]): string[] {
    return parts.filter((_, index) => {
        const remainingParts = parts.slice(0, index).concat(parts.slice(index + 1));
        return !isGeneratingSet(parts, remainingParts);
    });
}

/**
 * Recursively check if toGenerate can be generated by concatenating parts
 * @param targetString  string to generate
 * @param parts  list of string parts to use
 * @returns wheter or not toGenerate can be generated by concatenating parts
 */
function fitRecursive(targetString: string, parts: string[]): boolean {
    if (targetString == "") {
        return true;
    }
    for (const part of parts) {
        if (targetString.startsWith(part)) {
            const sliced = targetString.slice(part.length);
            if (fitRecursive(sliced, parts)) {
                return true;
            }
        }
    }

    return false;
}

const generatingSet = calculateGeneratingSet(parts);
const startTime1 = performance.now();
const possibleTargets = combinations.reduce((acc, combination) => acc + (fitRecursive(combination, generatingSet) ? 1 : 0), 0);
const endTime1 = performance.now();
console.log("PT 1:", possibleTargets);
console.log("PT 1 Time:", (endTime1 - startTime1).toFixed(), "ms")

/**
 * Recursively test how many ways there are to build toGenerate by concatenating parts
 * @param toGenerate string to generate
 * @param parts list of string parts to use
 * @returns [possibilities, success] where possibilities is the number of ways to generate toGenerate and success is whether it is possible to generate toGenerate
 */
function fitRecursiveCaching(toGenerate: string, parts: string[]): number {
    if (cache.has(toGenerate)) return cache.get(toGenerate)!;
    if (toGenerate == "") return 1

    let possibilities = 0
    const candidateParts = parts.filter(part => toGenerate.startsWith(part))

    for (const part of candidateParts) {
        const sliced = toGenerate.slice(part.length);
        const possibilitiesCount = fitRecursiveCaching(sliced, parts);
        cache.set(sliced, possibilitiesCount);
        possibilities += possibilitiesCount;
    }

    return possibilities
}

// Memoization cache for part 2
const cache = new Map<string, number>();

// Calculate and time part 2
const startTime2 = performance.now();
const sum = combinations.reduce((acc, combi) => acc +  fitRecursiveCaching(combi, parts), 0);
const endTime2 = performance.now();

console.log("PT 2:", sum);
console.log("PT 2 Time:", (endTime2 - startTime2).toFixed(), "ms")