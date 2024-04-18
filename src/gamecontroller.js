// 21130385_PhamHoangHuy_0774073023_DH21DTB
var startGame;
var fallingSpeed = 0.5; //second
var game = null
var keyEvent = null
var ctx = null


$(document).ready(() => {
  startGame = function () {
    let gameScreen = $(".game-wrapper__game-screen");
    let gameMenu = $(".game-wrapper__game-screen__game-menu");
    let gameCanvas = $(".game-wrapper__game-screen__game-canvas")
    ctx = gameCanvas.get(0).getContext("2d")

    ctx.fillStyle = "red"
    ctx.fillRect(0, 0, 100, 100)

    gameMenu.attr("hidden", true)
    gameCanvas.removeAttr("hidden")

    
    
    keyEvent = $(document).on("keydown", (e)=>{
      switch(e.which){
        case 37: //Phim trai
          if (game && game.getCurrentBrick()){
            game.move(new Position(game.getCurrentBrick().currentPos.x, game.getCurrentBrick().currentPos.y-1))
          }
        break
        case 39: //Phim phai
          if (game && game.getCurrentBrick()){
            game.move(new Position(game.getCurrentBrick().currentPos.x, game.getCurrentBrick().currentPos.y+1))
          }
        break
        case 40: //Phim xuong
          if (game && game.getCurrentBrick()){
            game.move(new Position(game.getCurrentBrick().currentPos.x+1, game.getCurrentBrick().currentPos.y))
          }
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
  #currentBrick = new Brick();
  isOverGame = false
  score = 0

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
    this.#currentBrick = null
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

  #insertBrick(brick = new BrickLR()) {
    if (this.#currentBrick != null){
      return
    }else{
      this.#currentBrick = brick
      if (!this.#checkCollide()){
        this.isOverGame = true
      }
        
    }
    
  }

  getCurrentBrick(){
    return this.#currentBrick
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
        if(!this.move(new Position(this.#currentBrick.currentPos.x+1, this.#currentBrick.currentPos.y))){
          this.#releaseBrick()
          this.removeLine()
        }
      }
    }
  }

  cloneMatrix(){
    return this.#matrix.map(e=>e.slice())
  }


  #releaseBrick() {
    console.log("just release")
    this.#currentBrick = null;
  }

  //ham nay tra ve false neu khong di chuyen duoc vao vi tri moi (newPosition) hoac khong ton tai this.#currentBrick
  move(newPosition=this.#currentBrick.currentPos){
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
  #checkEndLine(newPosition=this.#currentBrick.currentPos){
    if (!this.#currentBrick)
      return true
    return newPosition.x + this.#currentBrick.getMatrix().length > this.#matrix.length ||
    newPosition.y + this.#currentBrick.getMatrix()[0].length > this.#matrix[0].length ||
    newPosition.y < 0
  }

  //ham nay se tra 1 tempMatrix neu no ko collide o vi tri moi (newPosition)
  #checkCollide(newPosition=this.#currentBrick.currentPos){  
      let tempMatrix = this.cloneMatrix()
      
      if (this.#checkEndLine(newPosition)){
        return null
      }   


      //Xoa di brick current matrix
      if (newPosition != this.#currentBrick.currentPos){
        this.removeGhost(tempMatrix)
      }


      //Thu xem co di chuyen brick qua vi tri moi duoc khong
    
      for(let x in this.#currentBrick.getMatrix()){
        for (let y in this.#currentBrick.getMatrix()[x]){
          if (tempMatrix)
          if (tempMatrix[Number(x)+newPosition.x][Number(y)+newPosition.y] == 1){
            return null
          }else{
            //neu khong va cham voi brick nao thi no dich chuyen theo vi tri moi cho brick hien tai
            if (this.#currentBrick.getMatrix()[x][y]== 1)
            tempMatrix[Number(x)+newPosition.x][Number(y)+newPosition.y] = 1
          }
        } 
      }
      return tempMatrix
  }

  #updateCurrentBrick(tempMatrix = this.#matrix){
    if (this.#currentBrick)
    for(let x in this.#currentBrick.getMatrix()){
      for (let y in this.#currentBrick.getMatrix()[x]){
          if (this.#currentBrick.getMatrix()[x][y]== 1)
          tempMatrix[Number(x)+this.#currentBrick.currentPos.x][Number(y)+this.#currentBrick.currentPos.y] = 1
        }
      } 
  }
  

  removeLine(){
    let tempMatrix = this.cloneMatrix()
    
    if (this.#currentBrick){
      let x = 0, y=0
      for (x in tempMatrix){
        let isLine = true
        for (y in tempMatrix[x]){
          if (tempMatrix[x][y]==0 || this.#checkCollide(new Position(x, y))){
            isLine = false
            break
          }
        }
        if (isLine){
          for (y1 in tempMatrix[x]){
            tempMatrix[x][y1] = 0
            this.score++
          }
          this.#matrix = tempMatrix
        }
      }

      // for (x in tempMatrix){
      //   let isLine = true
      //   for (y in tempMatrix[x]){
      //     if (!this.#checkCollide(new Position(x, y))){
      //       isLine = false
      //       break
      //     }
      //   }
      // }
    }else{
      let x = 0, y=0, y1=0
      for (x in tempMatrix){
        let isLine = true
        for (y in tempMatrix[x]){
          if (tempMatrix[x][y]==0 || this.#checkCollide(new Position(x, y))){
            isLine = false
            break
          }
        }
        if (isLine){
          console.log("its good")
          for (y1 in tempMatrix[x]){
            tempMatrix[x][y1] = 0
            this.score++
          }
          this.#matrix = tempMatrix
        }
      }
    }
  }

  //Ham nay dung de check xem position co trung voi vi tri nao cua currentBrick tren tempMatrix ko
  #checkCollideWithCurrentBrick(position){
    let x,y=0
    if (!this.#currentBrick)
      return false
    for(x in this.#currentBrick.getMatrix()){
      for (y in this.#currentBrick.getMatrix()[x]){
        if ((x + this.#currentBrick.currentPos.x) == position.x && (y + this.#currentBrick.currentPos.y) == position.y){
          if (this.#matrix[position.x][position.y] == 1){
            return true
          }
        }
      }
    }
  }

  removeGhost(tempMatrix = this.#matrix){
    let oldX = this.#currentBrick.currentPos.x
    let oldY = this.#currentBrick.currentPos.y
    //Xoa matrix brick di tren tempMatrix
    for(let x in this.#currentBrick.getMatrix()){
      for (let y in this.#currentBrick.getMatrix()[x]){
       tempMatrix[Number(x)+oldX][Number(y)+oldY] = 0
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
      [0, 1, 0],
    ];
    super(arr, position);
  }
}

class BrickLR extends Brick {
  constructor(position) {
    let arr = [
      [1, 0], 
      [1, 0], 
      [1, 1]];
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
      [1, 1, 0],
    ];
    super(arr, position);
  }
}

class BrickZL extends Brick {
  constructor(position) {
    let arr = [
      [1, 1, 0],
      [0, 1, 1],
    ];
    super(arr, position);
  }
}
