// 21130385_PhamHoangHuy_0774073023_DH21DTB
var startGame;
var fallingSpeed = 0.3; //second
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
    let speed = fallingSpeed * 1000 / 3
    switch(level){
      case 1:
        while(!this.isOverGame){

          await new Promise(r => setTimeout(()=>{
            this.#insertBrick()
            r()
          }, speed))

          await new Promise(r => setTimeout(()=>{
            this.#printMatrix()
            r()
          }, speed))

          await new Promise(r => setTimeout(()=>{
            this.#fallingBrick()
            r()
          }, speed))
        }
        this.#gameOver()
        break
    }
  }

  #insertBrick(brick = new BrickCube()) {
    if (this.#currentBrick != null){
      return
    }else{
      this.#currentBrick = brick
      if (!this.#checkCollide()){
        this.isOverGame = true
      }
        
    }
    
  }

  #gameOver(){
    this.isOverGame = true
    this.#releaseBrick()
    keyEvent.off()
    console.log("game over")
  }

  #fallingBrick() {
    if (this.#currentBrick != null){
      if (!this.isOverGame){
        if(!this.#move(new Position(this.#currentBrick.currentPos.x+1, this.#currentBrick.currentPos.y))){
          this.#releaseBrick()
        }
      }
    }
  }

  cloneMatrix(){
    return this.#matrix.map(e=>e.slice())
  }


  #releaseBrick() {
    this.#currentBrick = null;
  }

  //ham nay tra ve false neu khong di chuyen duoc vao vi tri moi (newPosition) hoac khong ton tai this.#currentBrick
  #move(newPosition=this.#currentBrick.currentPos){
    let res = true
  
    if (this.#currentBrick == null){
      return false
    }

    let tempMatrix = this.#checkCollide(newPosition)

    if (tempMatrix){
      this.#matrix = tempMatrix
      this.#currentBrick.currentPos = newPosition
    }else{
      res = false
    }

    return res
  }

  //ham nay kiem tra xem brick co con roi xuong hang cuoi cung chua
  #checkEndLine(){
    return this.#currentBrick.currentPos.x + this.#currentBrick.getMatrix().length >= this.#matrix.length
  }

  //ham nay se tra 1 tempMatrix neu no ko collide o vi tri moi (newPosition)
  #checkCollide(newPosition=this.#currentBrick.currentPos){  
      let tempMatrix = this.cloneMatrix()
      let oldX = this.#currentBrick.currentPos.x
      let oldY = this.#currentBrick.currentPos.y

      if (this.#checkEndLine()){
        return null
      }   


      if (newPosition != this.#currentBrick.currentPos){
        //Xoa matrix brick di tren tempMatrix
        for(let x in this.#currentBrick.getMatrix()){
          for (let y in this.#currentBrick.getMatrix()[x]){
           tempMatrix[Number(x)+oldX][Number(y)+oldY] = 0
        }
      }
      }

      //Thu xem co di chuyen brick qua vi tri moi duoc khong
      for(let x in this.#currentBrick.getMatrix()){
        for (let y in this.#currentBrick.getMatrix()[x]){
          if (tempMatrix[Number(x)+newPosition.x][Number(y)+newPosition.y] == 1){
            return null
          }else{
            //neu khong va chham voi brick nao thi no dich chuyen theo vi tri moi cho brick hien tai
            tempMatrix[Number(x)+newPosition.x][Number(y)+newPosition.y] = 1
          }
        } 
      }
      return tempMatrix
  }

  #updateCurrentBrick(){
    if (this.#currentBrick)
    for(let x in this.#currentBrick.getMatrix()){
      for (let y in this.#currentBrick.getMatrix()[x]){
          this.#matrix[Number(x)+this.#currentBrick.currentPos.x][Number(y)+this.#currentBrick.currentPos.y] = 1
        }
      } 
  }

  #printMatrix(){
    console.clear();
    this.#updateCurrentBrick()
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
