const fs = require("fs");

let input = fs.readFileSync("inputs_prod/18.txt", "utf8").split("\n").map((line) => line.split(",").map(Number));

let field = new Array(71).fill(".").map(() => new Array(71).fill("."));

// console.log(field);

// find x, y positions of S and E symbols in field
let [startX, startY] = [0, 0]

let [endX, endY] = [70, 70]

// field[startY][startX] = ".";



const graph = {}

for (let i = 0; i < input.length && i < 1024; i++) {
    const [x, y] = input[i];
    field[y][x] = "#";
}

drawField(field);

const offsets = [[0, -1], [1, 0], [0, 1], [-1, 0]];

buildGraph(field, [startX, startY]);
console.log("Graph built with", Object.keys(graph).length, "vertices");

// console.log(graph)

graph['start'] = {};
graph['start'][`${startX},${startY}`] = 1;
graph[`${endX},${endY}`]['end'] = 1;
graph['end'] = {};

function drawField(field) {
    for (let row of field) {
        console.log(row.join(""));
    }
}



// next to dijkstra, we may use lee algorithm or A*


function buildGraph(field, [x, y]) {
    if (graph[`${x},${y}`]) return;
    // console.log(x, y)
    graph[`${x},${y}`] = {}

    for (const [dx, dy] of offsets) {
        const [newX, newY] = [x + dx, y + dy];
        if (field[newY]?.[newX] === ".") {
            graph[`${x},${y}`][`${newX},${newY}`] = 1;
            buildGraph(field, [newX, newY]);
        }
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
