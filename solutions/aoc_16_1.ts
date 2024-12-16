const fs = require("fs");

let input = fs.readFileSync("inputs_prod/16.txt", "utf8");
let field = input.split("\n").map((line) => line.split(""));

// console.log(field);

// find x, y positions of S and E symbols in field
let [startX, startY, startDir] = field.reduce((acc, row, y) => {
    let x = row.indexOf("S");
    if (x !== -1) acc = [x, y, ">"];
    return acc;
}, [-1, -1, "E"]);

let [endX, endY] = field.reduce((acc, row, y) => {
    let x = row.indexOf("E");
    if (x !== -1) acc = [x, y];
    return acc;
}, [-1, -1]);

field[startY][startX] = ".";



const mapping = { ">": [1, 0], "v": [0, 1], "<": [-1, 0], "^": [0, -1] };

const inverses = { ">": "<", "<": ">", "^": "v", "v": "^" };
const graph = {}

buildGraph(field, [startX, startY, startDir]);
console.log("Graph built with", Object.keys(graph).length, "vertices");

graph['start'] = {};
graph['start'][`${startX},${startY},${startDir}`] = 1;
graph[`${endX},${endY},>`]['end'] = 1;
graph[`${endX},${endY},^`]['end'] = 1;
graph[`${endX},${endY},<`]['end'] = 1;
graph[`${endX},${endY},v`]['end'] = 1;
graph['end'] = {};


function buildGraph(field, [x, y, direction]) {
    if (graph[`${x},${y},${direction}`]) return;
    graph[`${x},${y},${direction}`] = {}

    for (const candidateDirection of Object.keys(mapping).filter((dir) => dir !== direction && dir !== inverses[direction])) { // loop over all other directions
        graph[`${x},${y},${direction}`][`${x},${y},${candidateDirection}`] = 1000; // turns cost 1000
        buildGraph(field, [x, y, candidateDirection]); // build graph for other directions
    }

    const [dx, dy] = mapping[direction];
    const [newX, newY] = [x + dx, y + dy];
    if (field[newY]?.[newX] === "." || field[newY]?.[newX] === "E") {
        graph[`${x},${y},${direction}`][`${newX},${newY},${direction}`] = 1;
        buildGraph(field, [newX, newY, direction]);
    }

}



function dijkstraAlgorithm(graph) {
    const costs = { end: Infinity, ...graph.start };
    const unprocessedcosts = { end: Infinity, ...graph.start };
    const parents = { end: null };

    let node = findLowestCostNode(unprocessedcosts);

    while (node != "end") {
        let cost = costs[node];
        let children = graph[node];
        for (let n in children) {
            let newCost = cost + children[n];
            if (!costs[n] || costs[n] > newCost) {
                costs[n] = newCost;
                unprocessedcosts[n] = newCost;
                parents[n] = node;
            }
        }
        delete unprocessedcosts[node];

        console.log("Processed", Object.keys(unprocessedcosts).length, "vertices");
        if (Object.keys(unprocessedcosts).length == 245) console.log(node)
        node = findLowestCostNode(unprocessedcosts);
    }

    let optimalPath = ['end'];
    let parent = parents.end;
    while (parent) {
        optimalPath.push(parent);
        parent = parents[parent];
    }
    optimalPath.reverse();

    return { distance: costs.end, path: optimalPath };
};

function findLowestCostNode(unprocessedcosts) {
    return Object.keys(unprocessedcosts).reduce((acc, node) => unprocessedcosts[node] < unprocessedcosts[acc] ? node : acc, "end");
};

const { distance, path } = dijkstraAlgorithm(graph)
console.log(path)
console.log(distance - 2)
