var startGame;
var fallingSpeed = 1000; //milisecond

$(document).ready(() => {
  startGame = function () {
    let gameScreen = $(".game-wrapper__game-screen");
    let gameMenu = $(".game-wrapper__game-screen__game-menu");
    gameMenu.hide();
    gameScreen.append(`<div class="game-wrapper__game-screen__game-canvas"></div>
        <!-- /Close tag .game-wrapper__game-screen__game-canvas -->`);
    new Game().start();
  };
});

var k = 1;
class Game {
  #currentBrick = null;
  //private
  #matrix = null;

  constructor() {
    this.#matrix = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
  }

  start(level) {
    setInterval(() => {
        this.#addBrick(new BrickCube())
    }, 100);
    setInterval(() => {
      this.#startGame(level);
    }, 1000);
    setInterval(() => {
      this.#updateGame();
    }, 100);
    setInterval(() => {
      this.#fallingBrick();
    }, 1000);
  }

  #updateGame(isremove) {
    if (this.#currentBrick != null) {
      let m = this.#currentBrick.getMatrix();
      if (isremove){
        for (let x = 0; x < m.length; x++) {
            for (let y = 0; y < m[x].length; y++) {
                
                this.#matrix[x + this.#currentBrick.currentPos.x][y + this.#currentBrick.currentPos.y] = 0;
              // console.log(this.#currentBrick.currentPos.x)
            }
          }
      }else{
        for (let x = 0; x < m.length; x++) {
            for (let y = 0; y < m[x].length; y++) {
                
                this.#matrix[x + this.#currentBrick.currentPos.x][y + this.#currentBrick.currentPos.y] = m[x][y];
              // console.log(this.#currentBrick.currentPos.x)
            }
          }
      }
    }
  }

  #fallingBrick() {
    if (this.#currentBrick != null) {
      if (this.#legitMove()) {
        this.#updateGame(true)
        this.#currentBrick.currentPos.x += 1;
      } else {
        this.#releaseBrick();
      }
    }
  }

  #legitMove(){
        // Check xem con roi xuong duoc khong
        let isTheEnd = this.#currentBrick.currentPos.x + this.#currentBrick.getMatrix().length < this.#matrix.length
        let isCollide = false
        


        return 
  }

  #addBrick(brick) {
    if (this.#currentBrick == null) this.#currentBrick = brick;
  }

  #releaseBrick() {
    this.#currentBrick = null;
  }

  #startGame(level) {
    // alert(`Level game: ${level}`)
    console.clear();
    let str = "";
    this.#matrix.forEach((e) => {
      e.forEach((e1) => {
        str += e1 + " ";
      });
      str += "\n";
    });
    console.log(str);
  }
}
class Position {
  constructor(x = 0, y = 4) {
    this.x = x;
    this.y = y;
  }
}

class Brick {
  #matrix = null;
  constructor(matrix, position = new Position(0, 4)) {
    this.#matrix = matrix;
    this.currentPos = position;
  }
  getMatrix() {
    return this.#matrix;
  }
}

class BrickI extends Brick {
  constructor(position) {
    let arr = [[1], [1], [1], [1]];
    super(arr, position);
  }
}

class BrickCube extends Brick {
  constructor(position) {
    let arr = [
      [1, 1],
      [1, 1],
    ];
    super(arr, position);
  }
}

class BrickT extends Brick {
  constructor(position) {
    let arr = [
      [1, 1, 1],
      [0, 1],
    ];
    super(arr, position);
  }
}

class BrickLR extends Brick {
  constructor(position) {
    let arr = [[1], [1], [1, 1]];
    super(arr, position);
  }
}

class BrickLL extends Brick {
  constructor(position) {
    let arr = [
      [0, 1],
      [0, 1],
      [1, 1],
    ];
    super(arr, position);
  }
}

class BrickZR extends Brick {
  constructor(position) {
    let arr = [
      [0, 1, 1],
      [1, 1],
    ];
    super(arr, position);
  }
}

class BrickZL extends Brick {
  constructor(position) {
    let arr = [
      [1, 1],
      [0, 1, 1],
    ];
    super(arr, position);
  }
}
