function hasPath(maze, start, end) {
  const visited = [];
  maze.map((arr, x) => {
    arr.map((v, y) => {
      if (!visited[x]) {
        visited.push([]);
      }
      visited[x][y] = false;
    });
  });

  const queue = [];
  queue.push(start);
  visited[start[0]][start[1]] = true;

  while(queue.length) {
    const cur = queue.shift();
    let x = cur[0];
    let y = cur[1];

    if (x === end[0] && y === end[1]) {
      return true;
    }

    [
      {x: x-1, y: y}, // up
      {x: x+1, y: y}, // down
      {x: x, y: y-1}, // left
      {x: x, y: y+1}, // right
    ].map(o => {
      if (maze[o.x] && maze[o.x][o.y] === 0 && visited[o.x][o.y] === false) {
          queue.push([o.x,o.y]);
          visited[o.x][o.y] = true;
      }
    });

  }
  return false;
}

const maze = [
 [0,0,1,0],
 [1,0,1,1],
 [1,0,1,0],
 [0,0,0,0],
];

console.log(hasPath(maze, [0,0], [3,3]) === true ? 'PASS' : 'FAIL');
console.log(hasPath(maze, [0,0], [0,3]) === false ? 'PASS' : 'FAIL');
console.log(hasPath(maze, [0,0], [2,3]) === true ? 'PASS' : 'FAIL');
