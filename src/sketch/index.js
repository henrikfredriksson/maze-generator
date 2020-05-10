export default function sketch (s) {
  let cols = 0
  let rows = 0
  const grid = []
  const stack = []
  const w = 25

  let current = 0

  s.setup = () => {
    s.createCanvas(500, 500)
    // s.frameRate(10)
    cols = s.floor(s.width / w)
    rows = s.floor(s.height / w)

    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        grid.push(new Cell(i, j))
      }
    }

    current = grid[0]
  }

  s.draw = () => {
    s.background(51)
    grid.forEach(cell => cell.show())

    current.visited = true
    current.highlight()

    const next = current.checkNeighbours()

    if (next) {
      next.visited = true
      stack.push(current)

      removeWalls(current, next)
      current = next
    } else if (stack.length > 0) {
      current = stack.pop()
    } else {
      console.log('Done')
      current.show()
      console.log(grid)
      s.noLoop()
    }
  }

  function Cell (i, j) {
    this.i = i
    this.j = j
    this.visited = false
    this.walls = [true, true, true, true]

    const index = (i, j) => {
      if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
        return -1
      }
      return i + j * cols
    }

    this.highlight = function () {
      const x = this.i * w
      const y = this.j * w
      s.noStroke()
      s.fill(254, 106, 106)
      s.rect(x, y, w, w)
    }

    this.show = function () {
      const x = this.i * w
      const y = this.j * w

      s.stroke(0)

      if (this.walls[0]) s.line(x, y, x + w, y)
      if (this.walls[1]) s.line(x + w, y, x + w, y + w)
      if (this.walls[2]) s.line(x + w, y + w, x, y + w)
      if (this.walls[3]) s.line(x, y + w, x, y)

      if (this.visited) {
        s.noStroke()
        s.fill(64, 199, 199, 90)
        s.rect(x, y, w, w)
      }
    }

    this.checkNeighbours = function () {
      const neighbours = []
      const top = grid[index(i, j - 1)]
      const right = grid[index(i + 1, j)]
      const bottom = grid[index(i, j + 1)]
      const left = grid[index(i - 1, j)]

      if (top && !top.visited) { neighbours.push(top) }
      if (right && !right.visited) { neighbours.push(right) }
      if (bottom && !bottom.visited) { neighbours.push(bottom) }
      if (left && !left.visited) { neighbours.push(left) }

      if (neighbours.length > 0) {
        const r = s.floor(s.random(0, neighbours.length))
        return neighbours[r]
      }
      return undefined
    }
  }

  function removeWalls (current, next) {
    const x = current.i - next.i

    if (x === 1) {
      current.walls[3] = false
      next.walls[1] = false
    } else if (x === -1) {
      current.walls[1] = false
      next.walls[3] = false
    }

    const y = current.j - next.j
    if (y === 1) {
      current.walls[0] = false
      next.walls[2] = false
    } else if (y === -1) {
      current.walls[2] = false
      next.walls[0] = false
    }
  }
}
