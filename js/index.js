function Graph() {
  var neighbors = this.neighbors = {}; // Key = vertex, value = array of neighbors.

  this.addEdge = function (u, v) {
    if (neighbors[u] === undefined) {  // Add the edge u -> v.
      neighbors[u] = [];
    }
    neighbors[u].push(v);
    if (neighbors[v] === undefined) {  // Also add the edge v -> u in order
      neighbors[v] = [];               // to implement an undirected graph.
    }                                  // For a directed graph, delete
    neighbors[v].push(u);              // these four lines.
  };

  return this;
}

function shortestPath(graph, source, target) {
  if (source == target) {   // Delete these four lines if
    console.log(source, 'source == target');          // you want to look for a cycle
    return;                 // when the source is equal to
  }                         // the target.
  var queue = [ source ],
      visited = { source: true },
      predecessor = {},
      tail = 0;
  while (tail < queue.length) {
    var u = queue[tail++],  // Pop a vertex off the queue.
        neighbors = graph.neighbors[u];
    for (var i = 0; i < neighbors.length; ++i) {
      var v = neighbors[i];
      if (visited[v]) {
        continue;
      }
      visited[v] = true;
      if (v === target) {   // Check if the path is complete.
        var path = [ v ];   // If so, backtrack through the path.
        while (u !== source) {
          path.push(u);
          u = predecessor[u];
        }
        path.push(u);
        path.reverse();
        console.log(path, 'return path');
        return path;
      }
      predecessor[v] = u;
      queue.push(v);
    }
  }
  console.log('there is no path from ' + source + ' to ' + target);
  return false;
}

class DrawMatrix {
  constructor() {
    this.style      = {
      background     : 'grey',
      wallBackground : 'BlanchedAlmond',
      wall           : 'IndianRed',
      lineWidth      : 8
    };
    this.step       = 20;
    this.extraSpace = 40;
  }

  draw(matrix, s, e) {

    this.matrix     = matrix;
    this.w          = this.matrix.length * this.step + this.extraSpace;
    this.h          = this.matrix[this.matrix.length - 1].length * this.step + this.extraSpace;
    this.setCanvas('canvas');
    this.drawBorder();

    this.vertexsCoordinate = [];
    this.matrix.map((row, rowX) => {
      row.map((value, columnY)=> {
          if (value === 1) {
            this.vertexsCoordinate.push({
                x : rowX,
                y : columnY,
            });
          }
      });
    });

    let graph = new Graph();

    this.vertexsCoordinate.map((coordinate, nodeId) => {
      let x = coordinate.x;
      let y = coordinate.y;

      //left
      if (this.matrix[x][y-1] === 1) {
        graph.addEdge(
          nodeId,
          this.vertexsCoordinate.findIndex(o => o.x === x && o.y === y-1)
        );
      }

      //Right
      if (this.matrix[x][y+1] === 1) {
        graph.addEdge(
          nodeId,
          this.vertexsCoordinate.findIndex(o => o.x === x && o.y === y+1)
        );
      }
      //Down
      if (this.matrix[x+1] && this.matrix[x+1][y] === 1) {
        graph.addEdge(
          nodeId,
          this.vertexsCoordinate.findIndex(o => o.x === x+1 && o.y === y)
        );
      }
      //Up
      if (this.matrix[x-1] && this.matrix[x-1][y] === 1) {
        graph.addEdge(
          nodeId,
          this.vertexsCoordinate.findIndex(o => o.x === x-1 && o.y === y)
        );
      }

    });

    this.setPath(graph,s,e);
    this.drawMatrix(this.start, this.end);
  }
  
  setPath(graph, s, e) {
    this.path = this.start = this.end = null;
    if (s === null || e === null) {
      return false;
    }
    this.start = s;
    this.end   = e;
    this.path = shortestPath(
      graph,
      this.vertexsCoordinate.findIndex(o => o.x === s.x && o.y === s.y),
      this.vertexsCoordinate.findIndex(o => o.x === e.x && o.y === e.y)
    );
  }
  
  drawBorder() {
    this.ctx.fillStyle = this.style.background;
    this.ctx.fillRect(0,0,this.w,this.h)
    this.ctx.rect(this.step,this.step,this.step * this.matrix.length , this.step * this.matrix.length);
    this.ctx.stroke();
  }
  setCanvas(elementId) {
    let canvas    = document.getElementById(elementId);
    canvas.width  = this.w;
    canvas.height = this.h;
    this.ctx = canvas.getContext('2d');
  }

  drawPath(x,y, rowIndex, columnIndex) {
    if (this.path === null) {
      return false;
    }
    let cellIndex = this.vertexsCoordinate.findIndex(o => o.x === rowIndex && o.y === columnIndex);
    let pathIndex = this.path.indexOf(cellIndex);
    if (pathIndex !== -1) {
      this.ctx.fillStyle = 'green';
      if ( (this.path.length - 1) === pathIndex || pathIndex === 0) {
        this.ctx.fillStyle = pathIndex === 0 ? 'red' : 'blue';
      }
      
      this.ctx.fillRect(x + this.step / 3,y + this.step /3 ,this.step / 5,this.step / 5)
      this.ctx.stroke();
    }
  }
  
  drawMatrix() {
    this.vertices = [];
    this.matrix.map((row, rowIndex) => {
      row.map((value, columnIndex)=> {
          let x = this.step + (columnIndex * this.step);
          let y = this.step + (rowIndex * this.step);
          if (value === 1) {
            this.checkNeighborhood(x,y,rowIndex,columnIndex);
            this.drawPath(x,y,rowIndex, columnIndex);
          }
          else {
            this.drawWallBackground(x,y);
          }
      });
    });
  }

  checkNeighborhood(x,y,rowIndex,columnIndex) {
    this.ctx.strokeStyle = this.style.wall;
    if (this.matrix[rowIndex] && this.matrix[rowIndex][columnIndex - 1] === 0) {
      this.drawWall(x, y, x, y + this.step); // Left wall
    }
    if (this.matrix[rowIndex + 1] && this.matrix[rowIndex + 1][columnIndex] === 0) {
      this.drawWall(x, y + this.step, x + this.step, y + this.step); // Bottom wall 
    }
    if (this.matrix[rowIndex] && this.matrix[rowIndex][columnIndex + 1] === 0) {
      this.drawWall(x + this.step, y + this.step, x + this.step, y); // Right wall
    }
    if (this.matrix[rowIndex - 1] && this.matrix[rowIndex - 1][columnIndex] === 0) {
      this.drawWall(x + this.step, y, x, y); // Up wall
    }
  }

  drawWallBackground(x,y) {
    this.ctx.fillStyle = this.style.wallBackground;
    this.ctx.fillRect(x,y,this.step,this.step)
    this.ctx.stroke();
  }

  drawWall(x, y,lineX, lineY) {
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineWidth = this.style.lineWidth;
    this.ctx.lineTo(lineX, lineY);
    this.ctx.stroke();
  }
}

class Generate {
  constructor() {
    this.drawMatrix = new DrawMatrix();
    this.generateTable();
  };
  
  generateTable() {
    document.getElementById('path').textContent = '';
    this.start = this.end = null;
    this.wallRange = document.getElementById('wallRange').value;
    document.getElementById('wallRangeValue').textContent = this.wallRange;
    this.wallRange = (100 - this.wallRange) / 100;
    this.range  = document.getElementById('range').value;
    document.getElementById('rangeValue').textContent = this.range;
    this.matrix = [];
    var tbl = document.createElement("table");
    var tblBody = document.createElement("tbody");
    for (var i = 0; i < this.range; i++) {
      var matrixRow = [];
      var row = document.createElement("tr");
      for (var j = 0; j < this.range; j++) {
        var cell = document.createElement("td");
        var checkbox = this.createInputNode(i,j);
        matrixRow.push(checkbox.disabled === true ? 0 : 1);
        cell.appendChild(checkbox);
        row.appendChild(cell);
      }
      tblBody.appendChild(row);
      this.matrix.push(matrixRow);
    }
    tbl.appendChild(tblBody);
    tbl.setAttribute("border", "2");
    document.getElementById('editor').innerHTML = "";
    document.getElementById('editor').appendChild(tbl);
    this.drawMatrix.draw(this.matrix, this.start, this.end);
  }
  
  createInputNode(x, y) {
    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.x    = x;
    checkbox.y    = y;
    checkbox.id   = 'x' + x + 'y' + y;
    if ( Math.random() > this.wallRange ) {
      checkbox.disabled = true;
      checkbox.checked = true;      
    }
    else {
      checkbox.onclick = () => {this.setPoints(x, y);};
    }
    return checkbox;
  }

  setPoints(x,y) {
    if (this.start !== null && this.end !== null) {
      document.getElementById('x' + this.start.x + 'y' + this.start.y).checked = false;
      document.getElementById('x' + this.end.x + 'y' + this.end.y).checked = false;
      this.start = null;
      this.end = null;
      document.getElementById('path').textContent = '';
    }
    this[this.start === null ? 'start' : 'end'] = {
        x: x,
        y: y
    };
    document.getElementById('path').textContent = 'Start Point: x=' + this.start.x + ' y=' + this.start.y + ';';
    if (this.end !== null) {
      document.getElementById('path').textContent = 
        document.getElementById('path').textContent + 
        ' End point x=' + this.end.x + ' y=' + this.end.y + ';';
      this.drawMatrix.draw(this.matrix, this.start, this.end);
    }
  }
}

var g = new Generate();
