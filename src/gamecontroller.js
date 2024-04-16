// 21130385_PhamHoangHuy_0774073023_DH21DTB
var startGame;
var fallingSpeed = 1000; //milisecond
var game = null
var keyEvent = null

$(document).ready(() => {
  startGame = function () {
    let gameScreen = $(".game-wrapper__game-screen");
    let gameMenu = $(".game-wrapper__game-screen__game-menu");
    gameMenu.hide();
    gameScreen.append(`<div class="game-wrapper__game-screen__game-canvas"></div>
        <!-- /Close tag .game-wrapper__game-screen__game-canvas -->`);
    
    keyEvent = $(document).on("keydown", (e)=>{
      switch(e.which){
        case 37: //Phim trai
          console.log("left")
        break
        case 39: //Phim phai
          console.log("right")
        break
        case 40: //Phim xuong
          console.log("down")
        break

      }
    })
    game = new Game()
    game.start()
  };
});


class Game {
  //private
  #matrix = [];
  #currentBrick = null;
  isOverGame = false

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

  async start(level=1) {
    switch(level){
      case 1:
        while(!this.isOverGame){

          await new Promise(r => setTimeout(()=>{
            this.#insertBrick()
          }, 1000)).then(()=>{
            new Promise(r => setTimeout(()=>{
              this.#fallingBrick()
            }, 1000)).then(()=>{
              new Promise(r => setTimeout(()=>{
                this.#printMatrix()
              }, 1000))
            })
          })

          
    
          console.log(this.isOverGame)
          
        }
        console.log(this.isOverGame)
        break
    }
  }

  #insertBrick(brick = new BrickCube()) {
    console.log("insert...")
    if (this.#currentBrick != null){
      
      if (this.isOverGame){
        this.#gameOver()
        return
      }
    }else{
      this.#currentBrick = brick
    }
  }

  #gameOver(){
    this.#releaseBrick()
    keyEvent.off()
    console.log("game over")
  }

  #fallingBrick() {
    console.log("falling...")
    if (this.#currentBrick != null){
      if (!this.isOverGame){
        this.#move(new Position(this.#currentBrick.currentPos.x+1, this.#currentBrick.currentPos.y))
      }
    }
  }


  #releaseBrick() {
    this.#currentBrick = null;
  }

  //ham nay tra ve false neu khong di chuyen duoc vao vi tri moi (newPosition) hoac khong ton tai this.#currentBrick
  #move(newPosition=this.#currentBrick.currentPos){
    let res = true
    let tempMatrix = this.#matrix.map(e=>e.slice())
    let oldX = this.#currentBrick.currentPos.x
    let oldY = this.#currentBrick.currentPos.y

    if (this.#currentBrick == null){
      return false
    }

    //Xoa matrix brick di tren this.#matrix
    for(let x in this.#currentBrick.getMatrix()){
      for (let y in this.#currentBrick.getMatrix()[x]){
        tempMatrix[Number(x)+oldX][Number(y)+oldY] = 0
      }
    }

    if (res = this.#checkCollide(newPosition, tempMatrix)){
      this.#matrix = tempMatrix
    }
    

    return res
  }


  #checkCollide(newPosition=this.#currentBrick.currentPos, tempMatrix=[]){
      let res = true
      //Thu xem co di chuyen brick qua vi tri moi duoc khong
      for(let x in this.#currentBrick.getMatrix()){
        for (let y in this.#currentBrick.getMatrix()[x]){
          if (tempMatrix[Number(x)+newPosition.x][Number(y)+newPosition.y] == 1){
            return false
          }
        } 
      }
      return res
  }

  #printMatrix(){
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
  #matrix;
  constructor(matrix=[], position = new Position(0, 4)) {
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
