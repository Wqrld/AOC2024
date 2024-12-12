// let input = `AAAA
// BBCD
// BBCC
// EEEC`
// let input = `RRRRIICCFF
// RRRRIICCCF
// VVRRRCCFFF
// VVRCCCJFFF
// VVVVCJJCFE
// VVIVCCJJEE
// VVIIICJJEE
// MIIIIIJJEE
// MIIISIJEEE
// MMMISSJEEE`
// let input = `EEEEE
// EXXXX
// EEEEE
// EXXXX
// EEEEE`
// let input = `AAAAAA
// AAABBA
// AAABBA
// ABBAAA
// ABBAAA
// AAAAAA`
const fs = require('fs');
let input = fs.readFileSync('./inputs_prod/12.txt', 'utf-8');

let field = input.split("\n").map(item => item.split(""));

let seen = Array(field.length).fill([]).map(() => Array(field[0].length).fill(false));


function findNeighbours(x: number, y: number): [[number, number][], number] {
  let reachable: [number, number][] = seen[x][y] ? [] : [[x, y]];
  let perimeters = 0;
  //let sides = 0;
  seen[x][y] = true;
  let directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];
  for (const [dx, dy] of directions) {
    let nx = x + dx;
    let ny = y + dy;
    if (nx >= 0 && nx < field[0].length && ny >= 0 && ny < field.length && field[ny][nx] == field[y][x]) {
      // console.log("found neighbour", nx, ny)
      if (!seen[nx][ny]) {
        seen[nx][ny] = true;
        reachable.push([nx, ny]);
        let [r, p] = findNeighbours(nx, ny)
        perimeters += p;
        //  sides += s;
        for (let item of r) {
          reachable.push(item)
        }
      }
    } else {
      // console.log("found wall", nx, ny)

      // todo: check if we are the last in a sequence of blocks.
      // if we are the last in a sequence of blocks, then we are a side

      // if looking to the right, check if the element below has the same value and that is not equal to the value to it's right
      // if (dx == 1 && field[y][x] == field[y-1][x] && field[y-1][x] != field[y-1][x+1]) sides++;

      // field below must be different, OR the field below and to the rightbelow must be the same

      // seems correct
      // if (dx == 1 && (y - 1 < 0                || (field[y - 1][x] != field[y][x]) || (field[y - 1][x] == field[y][x] && field[y - 1][x] == field[y - 1][x + 1]))) sides++; // Look for edges on the right

      // if (dy == 1 && (x + 1 == field[0].length || field[y][x] != field[y][x + 1]) && (y + 1 == field.length || field[y + 1][x] != field[y][x])) sides++; // Look for edges on the bottom

      // if (dx == -1 && (y + 1 == field.length   || field[y][x] != field[y + 1][x]) && (x - 1 < 0 || field[y][x - 1] != field[y][x])) sides++; // Look for edges on the left

      // // if (dy == -1 && (y - 1 < 0               || field[y - 1][x] != field[y][x] && (x - 1 < 0 || field[y][x - 1] != field[y][x]))) sides++; // Look for edges on the top

      // if (dy == -1 && (x + 1 == field[0].length || field[y][x] != field[y][x + 1]) && (y - 1 == -1 || field[y - 1][x] != field[y][x])) sides++


      // expected for E:
      // top 3
      // right 5
      // bottom 3
      // left 1
      // total 12

      // if (dx == -1 && field[y][x] == field[y+1][x] && field[y+1][x] != field[y+1][x-1]) sides++;

      perimeters++;

    }
  }

  return [reachable, perimeters];
}

// console.log(findNeighbours(0, 0)) 

// let partitions = {};
// let sum = 0;
// let sumsides = 0;

type Area = { char: string; plots: Array<{ x: number; y: number }> };
let areas: Array<Area> = [];

for (let y = 0; y < field.length; y++) {
  for (let x = 0; x < field[0].length; x++) {
    if (!seen[x][y]) {
      let [nb, perimeter] = findNeighbours(x, y);
      // console.log("found new group", x, y, field[y][x], nb, perimeter)
      // sum += nb.length * perimeter;
      // sumsides += nb.length * sides;
      // console.log("sides", field[y][x], nb)
      areas.push({ char: field[y][x], plots: nb.map(([x, y]) => ({ x, y })).toSorted((a, b) => 10 * (a.x - b.x) - (a.y - b.y)) }); // okay this works by pure luck. Why the hell do i have to sort it (contiguus helps i guess, but why)
      // console.log(findNeighbours(x, y))
    }
  }
}

// console.log(areas.reduce((acc, item) => acc + item.plots.length, 0))
// areas.forEach((area) => {
//   if (area.char == "J" || area.char == 'V') {
//     console.log(area.char, area.plots)
//   }
// })

// console.log("Total sum", sum)
// console.log("Total sides", sumsides)

function calculateTotalSides(area) {
  const plotVisibility = area.plots.map((plot) => { // loop over all plots in the area

    // within the current area, find the plot to the left, right, up and down
    const left = area.plots.find((p) => p.x === plot.x - 1 && p.y === plot.y);
    const right = area.plots.find((p) => p.x === plot.x + 1 && p.y === plot.y);
    const down = area.plots.find((p) => p.x === plot.x && p.y === plot.y + 1);
    const up = area.plots.find((p) => p.x === plot.x && p.y === plot.y - 1);

    // for every plot, keep track for each side if it neighbours a plot in the same area
    const visibility = { right: true, left: true, top: true, bottom: true, x: plot.x, y: plot.y };

    if (left) visibility.left = false;
    if (right) visibility.right = false;
    if (down) visibility.bottom = false;
    if (up) visibility.top = false;

    return visibility;
  });

  // Run findverticalsides on all plots where the specific side is visible.
  const rightSides = findVerticalSides(plotVisibility.filter((p) => p.right));
  const leftSides = findVerticalSides(plotVisibility.filter((p) => p.left));
  const topSides = findHorizontalSides(plotVisibility.filter((p) => p.top));
  const bottomSides = findHorizontalSides(plotVisibility.filter((p) => p.bottom));

  const totalSides = bottomSides + leftSides + rightSides + topSides;

  console.log(area.char, area.plots.length, bottomSides, leftSides, rightSides, topSides); // totalsides is one too high for V, one too low for J
  return totalSides
}
// should be V 13 3 2 3 2
// is V 13 3 3 3 2
console.log(areas.filter((a) => a.char == "V")[0])
console.log(calculateTotalSides({
  char: 'V',
  plots: [
    { x: 0, y: 2 }, { x: 1, y: 2 },
    { x: 0, y: 3 }, { x: 1, y: 3 },
    { x: 0, y: 4 }, { x: 1, y: 4 },
    { x: 2, y: 4 }, { x: 3, y: 4 },
    { x: 0, y: 5 }, { x: 1, y: 5 },
    { x: 3, y: 5 }, { x: 0, y: 6 },
    { x: 1, y: 6 }
  ]
}))
console.log(calculateTotalSides({
  char: 'V',
  plots: [
    { x: 0, y: 2 }, { x: 1, y: 2 },
    { x: 1, y: 3 }, { x: 1, y: 4 },
    { x: 2, y: 4 }, { x: 3, y: 4 },
    { x: 3, y: 5 }, { x: 1, y: 5 },
    { x: 1, y: 6 }, { x: 0, y: 6 },
    { x: 0, y: 5 }, { x: 0, y: 4 },
    { x: 0, y: 3 }
  ].toSorted((a, b) => 10 * (a.x - b.x) - (a.y - b.y))
}))
console.log(calculateTotalSides(areas.filter((a) => a.char == "V")[0]))


// preprocessing for calculating sides
let total = 0;
for (const area of areas.filter((a) => a.plots.length > 0)) { // loop over all areas

  const totalSides = calculateTotalSides(area);
  total += area.plots.length * totalSides;
}

function findVerticalSides(plots: Array<{ x: number; y: number }>) { // 
  const sides: Array<{ x: number; ys: Array<number> }> = []; // keep list of all y's on every x

  // loop over all the plots
  for (const plot of plots) {

    // Check if we already have a side of the same x coordinate and an y above or below the current plot
    const side = sides.findIndex(
      (side) => side.x === plot.x && (side.ys.includes(plot.y + 1) || side.ys.includes(plot.y - 1))
    );

    // if we don't have a side yet, create a new one
    if (side === -1) {
      sides.push({ ys: [plot.y], x: plot.x });
      continue;
    }

    // if we have a side, add the y to the list of y's
    sides[side].ys.push(plot.y);
  }

  return sides.length;
}

function findHorizontalSides(plots: Array<{ x: number; y: number }>) {
  const sides: Array<{ y: number; xs: Array<number> }> = [];
  for (const plot of plots) {
    const side = sides.findIndex((s) => s.y === plot.y && (s.xs.includes(plot.x + 1) || s.xs.includes(plot.x - 1)));

    if (side === -1) {
      sides.push({ y: plot.y, xs: [plot.x] });
      continue;
    }

    sides[side].xs.push(plot.x);
  }

  return sides.length;
}

console.log(total);

// To calculate the number of sides instead of the perimeter
// if direction is left or right. then only count if you are the lowest
// if the direction is top or down, only count if you are the leftmost
// this is the case if the item to the left is not the same as the current item 
// or the item below is not the same as the current item
