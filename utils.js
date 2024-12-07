// Stolen from https://stackoverflow.com/questions/12303989/cartesian-product-of-multiple-arrays-in-javascript#43053803
// Generate all possible options for combining the operators and numbers
let cartesian =
    (a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));

//  https://stackoverflow.com/questions/31879576/what-is-the-most-elegant-way-to-insert-objects-between-array-elements#55387306
// Used to intervleave the array of numbers with the operators
const interleave = (arr, thing) => [].concat(...arr.map(n => [n, thing])).slice(0, -1)

// stolen from https://stackoverflow.com/questions/4856717/javascript-equivalent-of-pythons-zip-function
// zip togeter two arrays
const zip= rows=>rows[0].map((_,c)=>rows.map(row=>row[c]))