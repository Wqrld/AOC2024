const fs = require("fs");

let input = fs.readFileSync("inputs_prod/18.txt", "utf8").split("\n").map((line) => line.split(",").map(Number));

const offsets = [[0, -1], [1, 0], [0, 1], [-1, 0]];
// find x, y positions of Start and End
const [startX, startY] = [0, 0]

const [endX, endY] = [70, 70]

function attemptEscape(iterations) {


    let field = new Array(71).fill(".").map(() => new Array(71).fill("."));

    const graph = {}

    for (let i = 0; i < input.length && i < iterations; i++) {
        const [x, y] = input[i];
        field[y][x] = "#";
    }

    // drawField(field);

    //todo optimization: we can get away with not rebuilding the graph every time
    // instead, we can loop over all vertices and delete the paths to the blocked vertex
    buildGraph(graph, field, [startX, startY]);
    console.log("Graph built with", Object.keys(graph).length, "vertices");
    if (!graph[`${endX},${endY}`]) {
        drawField(field)
        console.log("No path to end")
        console.log("Problematic block", input[iterations - 1]);
        return 0;
    }

    graph['start'] = {};
    graph['start'][`${startX},${startY}`] = 1;
    graph[`${endX},${endY}`]['end'] = 1;
    graph['end'] = {};

    const { distance, path } = dijkstraAlgorithm(graph)
    // console.log(path)
    // console.log(distance - 2)
    return distance - 2;
}

// Linear search
// for (let i = 1024; i < 10000; i++) {
//     let attempt = attemptEscape(i);
//     if (attempt == 0) break;
//     console.log(i, attemptEscape(i))
// }

// try a binary search
let Low = 1024;
let High = input.length;
let Mid = Math.floor((Low + High) / 2);
while (High - Low > 1) {
    let attempt = attemptEscape(Mid);
    console.log(High, Low, Mid, attempt)
    if (attempt == 0) {
        // our guess is too high
        High = Mid;
    } else {
        // our guess is too low
        Low = Mid;
    }
    Mid = Math.floor((Low + High) / 2);
}


function drawField(field) {
    for (let row of field) {
        console.log(row.join(""));
    }
}



// next to dijkstra, we may use lee algorithm or A*


function buildGraph(graph, field, [x, y]) {
    if (graph[`${x},${y}`]) return;
    // console.log(x, y)
    graph[`${x},${y}`] = {}

    for (const [dx, dy] of offsets) {
        const [newX, newY] = [x + dx, y + dy];
        if (field[newY]?.[newX] === ".") {
            graph[`${x},${y}`][`${newX},${newY}`] = 1;
            buildGraph(graph, field, [newX, newY]);
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

        // console.log("Processed", Object.keys(unprocessedcosts).length, "vertices");
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

