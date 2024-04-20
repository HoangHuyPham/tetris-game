// 21130385_PhamHoangHuy_0774073023_DH21DTB
var startGame;
var fallingSpeed = 0.3; //second
var game = null
var keyEvent = null
var ctx = null
var ctxNextBrick = null
var widthCanvas = 0
var heightCanvas = 0
var widthCanvasNextBrick = 0
var heightCanvasNextBrick = 0
var isOverGame = false
var fallInstant = false
const Color = {
  BACKGROUND: 0,
  RED: 1,
  GREEN: 2,
  AQUA: 3,
  ORANGE: 4,
  BLUE: 5,
  YELLOW: 6,
  PURPLE: 7,
}
const sizeOfGame = 12
const sizeOfNextScreen = 7

$(document).ready(() => {
  $('.game-wrapper__game-panel__content').hide()
  startGame = function () {
    let gameScreen = $(".game-wrapper__game-screen");
    let gameMenu = $(".game-wrapper__game-screen__game-menu");
    let gameCanvas = $(".game-wrapper__game-screen__game-canvas")
    let gameCanvasNextBrick = $(".game-wrapper__game-panel__next-brick-screen")

    widthCanvas = $(".game-wrapper__game-screen").width()
    heightCanvas = $(".game-wrapper__game-screen").height()
    widthCanvasNextBrick = $(".game-wrapper__game-panel__content").width()
    heightCanvasNextBrick = $(".game-wrapper__game-panel__content").height()*0.3
    isOverGame = false
    
    ctx = gameCanvas.get(0).getContext("2d")
    ctxNextBrick = gameCanvasNextBrick.get(0).getContext("2d")

   
    gameCanvas.get(0).width = widthCanvas;
    gameCanvas.get(0).height = heightCanvas;

    gameCanvasNextBrick.get(0).width = widthCanvasNextBrick
    gameCanvasNextBrick.get(0).height = heightCanvasNextBrick
  
  
    gameMenu.hide()
    gameCanvas.removeAttr("hidden")
    gameCanvasNextBrick.removeAttr("hidden")
    $('.game-wrapper__game-panel__content').show()

    

    keyEvent = $(document).on("keydown", (e)=>{
      switch(e.which){
        case 37: //Phim trai
          if (game && game.getCurrentBrick()){
            game.move(new Position(game.getCurrentBrick().currentPos.x, game.getCurrentBrick().currentPos.y-1))
            game.draw()
          }
        break
        case 39: //Phim phai
          if (game && game.getCurrentBrick()){
            game.move(new Position(game.getCurrentBrick().currentPos.x, game.getCurrentBrick().currentPos.y+1))
            game.draw()
          }
        break
        case 40: //Phim xuong
          if (game && game.getCurrentBrick()){
            fallInstant = true
          }
        break

      }
    })
    game = new Game()
    game.start()
    game.updateGameInfo()

    game.drawBlock(ctxNextBrick, new Position(0,0), Color.AQUA)
    
  };
});


class Game {
  //private
  #matrix = [];
  #currentBrick = null;
  #nextBrick = null
  //public
  isOverGame = false
  score = 0
  level = 0

  constructor() {
    //Tao 1 ma tran 2 chieu cho game
    this.#matrix = new Array(sizeOfGame*2).fill().map(()=> new Array(sizeOfGame).fill(0))
    this.#currentBrick = null
  }

  async start(level=1) {
    let speed = fallingSpeed*1000
    switch(level){
      case 1:
        while(!this.isOverGame){
          this.#insertBrick()
          this.draw()
          await new Promise(r => setTimeout(()=>{this.#fallingBrick();r()}, speed))
        }
        this.#gameOver()
        break
    }
  }

  colorToHex(color){
    switch(color){
      case Color.BLUE:
        return "#001AFF"
      case Color.AQUA:
        return "#00FFFF"
      case Color.RED:
        return "#FF0000"
      case Color.ORANGE:
        return "#FF8A00"
      case Color.GREEN:
        return "#05FF00"
      case Color.PURPLE:
        return "#9520BE"
      case Color.YELLOW:
        return "#CAE236"
      default:
        return "#000000"
    }
  }

  updateGameInfo(){
    $('.score__value').get(0).innerHTML = this.score
    $('.level__value').get(0).innerHTML = this.level
  }

  draw(){
    this.#updateCurrentBrick()
    if (!this.isOverGame && this.#matrix){
      this.clearCanvas(ctx)
      for (let x =0; x<this.#matrix.length; x++){
        for (let y=0; y<this.#matrix[x].length; y++){
          this.drawBlock(ctx, new Position(x, y), this.#matrix[x][y])
        }
      }
      this.clearCanvas(ctxNextBrick)
      for (let x =0; x<this.#nextBrick.getMatrix().length; x++){
        for (let y=0; y<this.#nextBrick.getMatrix()[x].length; y++){
          if (this.#nextBrick.getMatrix()[x][y]>0)
          this.drawBlock(ctxNextBrick, new Position(x+2, y+2), this.#nextBrick.getMatrix()[x][y])
        }
      }
      
    }
  }

  drawBlock(context = ctx, position = new Position(0, Math.floor(this.#matrix.length/2)-1), color = Color.RED){
    let width= context == ctx?Math.floor(widthCanvas)/this.#matrix[0].length:Math.floor(widthCanvasNextBrick/sizeOfNextScreen)
    let height= context == ctx?Math.floor(heightCanvas)/this.#matrix.length:Math.floor(heightCanvasNextBrick/sizeOfNextScreen)
    context.fillStyle = this.colorToHex(color)
    context.strokeStyle = color == Color.BACKGROUND?"#909090":"#f5f5f5"
    context.lineWidth = color == Color.BACKGROUND?1:2
    context.fillRect(position.y*width, position.x*height, width, height)
    context.strokeRect(position.y*width, position.x*height, width, height)
  }

  clearCanvas(context = ctx){
    let h = context == ctx? heightCanvas:heightCanvasNextBrick
    let w = context == ctx? widthCanvas:widthCanvasNextBrick
    context.clearRect(0,0, h, w)
  }

  #insertBrick(brick = this.#currentBrick) {
    if (!this.#nextBrick){
      this.#nextBrick = this.#randomBrick()
      this.#insertBrick()
    }
    if (brick){
      return
    }else{
      this.#currentBrick = this.#nextBrick
      if (!this.#checkCollide()){
        this.isOverGame = true
      }
      this.#nextBrick = this.#randomBrick()
    }
    
  }

  getCurrentBrick(){
    return this.#currentBrick
  }

  #gameOver(){
    this.isOverGame = true
    isOverGame = true
    game = null
    ctx = null
    ctxNextBrick = null
    this.#releaseBrick()
    keyEvent.off()
    keyEvent = null
    console.log("game over")
    $('.gameover-menu').show()
  }

  #fallingBrick() {
    if (this.#currentBrick != null){
      if (!this.isOverGame){
        if (fallInstant){
          while(this.move(new Position(this.#currentBrick.currentPos.x+1, this.#currentBrick.currentPos.y))){

          }
          fallInstant = false
        }
        if(!this.move(new Position(this.#currentBrick.currentPos.x+1, this.#currentBrick.currentPos.y))){
          this.#releaseBrick()
          //Sau khi giai phong currentBrick moi bat dau xoa dong, tinh diem
          this.#removeLine()
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
          if (tempMatrix){
            
            if (this.#currentBrick.getMatrix()[Number(x)][Number(y)] > 0){
              if (tempMatrix[Number(x)+newPosition.x][Number(y)+newPosition.y] > 0){
                return null
              }
            }
            //neu khong va cham voi brick nao thi no dich chuyen theo vi tri moi cho brick hien tai
            if (this.#currentBrick.getMatrix()[x][y] > 0){
              tempMatrix[Number(x)+newPosition.x][Number(y)+newPosition.y] = this.#currentBrick.getMatrix()[Number(x)][Number(y)]
            }
          }
          
        } 
      }
      return tempMatrix
  }

  #updateCurrentBrick(tempMatrix = this.#matrix){
    if (this.#currentBrick)
    for(let x in this.#currentBrick.getMatrix()){
      for (let y in this.#currentBrick.getMatrix()[x]){
          if (this.#currentBrick.getMatrix()[x][y] > 0)
          tempMatrix[Number(x)+this.#currentBrick.currentPos.x][Number(y)+this.#currentBrick.currentPos.y] =  this.#currentBrick.getMatrix()[x][y]
        }
      } 
  }

  #randomBrick(){
    let rd = Math.floor(Math.random() * 10)
    switch(rd){
      case 0:
        return new BrickCube()
      case 1:
        return new BrickI()
      case 2:
        return new BrickLL()
      case 3:
        return new BrickLR()
      case 4:
        return new BrickZL()
      case 5:
        return new BrickZR()
      default:
        return new BrickT()
    }
      
  }
  

  async #removeLine(){
    let tempMatrix = this.cloneMatrix()
    
      let y=0, y1=0
      for (let x = tempMatrix.length-1; x>0; x--){
        let isLine = true
        for (y in tempMatrix[x]){
          if (tempMatrix[x][y]==0){
            isLine = false
            break
          }
        }
        if (isLine){
          console.log("clear line")
          for (y in tempMatrix[x]){
            tempMatrix[x][y] = 0
            this.score++
            await new Promise(r=>setTimeout(r, 20)).then(()=>{ this.drawBlock(ctx, new Position(x,y), Color.RED)})
          }
          this.updateGameInfo()
          this.#dropBrick(tempMatrix, x)
          this.#matrix = tempMatrix
          this.#removeLine()
        }
      }
    
  }

  #dropBrick(tempMatrix = this.#matrix, endX=0){
    for (let x=endX; x>0; x--){
      for (let y=0; y<tempMatrix[x].length; y++){
        if (tempMatrix[x][y] > 0 && tempMatrix[x+1][y]==0){
          tempMatrix[x+1][y] = tempMatrix[x][y]
          tempMatrix[x][y] = 0
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
        if (this.#currentBrick.getMatrix()[x][y]>0)
          tempMatrix[Number(x)+oldX][Number(y)+oldY] = 0
      }
    }

  }

  #printMatrix(tempMatrix = this.#matrix){
    console.clear();
    let str = "";
    tempMatrix.forEach((e) => {
      e.forEach((e1) => {
        str += e1 + " ";
      });
      str += "\n";
    });
    return str
  }

  getMatrix(){
    return this.#matrix
  }
}
class Position {
  constructor(x = 0, y = Math.floor(game.getMatrix()[0].length/2)-1) {
    this.x = x;
    this.y = y;
  }
}

class Brick {
  #matrix;
  constructor(matrix=[], position = new Position(0, Math.floor(game.getMatrix()[0].length/2)-1), color=Color.RED) {
    this.#matrix = matrix;
    this.currentPos = position;
    this.color = color
  }
  getMatrix() {
    return this.#matrix;
  }
}

class BrickI extends Brick {
  constructor(position) {
    let arr = [[1], [1], [1], [1]];
    super(arr, position, Color.AQUA);
  }
}

class BrickCube extends Brick {
  constructor(position) {
    let color = Color.YELLOW
    let arr = [
      [color, color],
      [color, color],
    ];
    super(arr, position, color);
  }
}

class BrickT extends Brick {
  constructor(position) {
    let color = Color.PURPLE
    let arr = [
      [color, color, color],
      [0, color, 0],
    ];
    super(arr, position, color);
  }
}

class BrickLR extends Brick {
  constructor(position) {
    let color = Color.ORANGE
    let arr = [
      [color, 0], 
      [color, 0], 
      [color, color]];
    super(arr, position, color);
  }
}

class BrickLL extends Brick {
  constructor(position) {
    let color = Color.BLUE
    let arr = [
      [0, color],
      [0, color],
      [color, color],
    ];
    super(arr, position, color);
  }
}

class BrickZR extends Brick {
  constructor(position) {
    let color = Color.GREEN
    let arr = [
      [0, color, color],
      [color, color, 0],
    ];
    super(arr, position, color);
  }
}

class BrickZL extends Brick {
  constructor(position) {
    let color = Color.RED
    let arr = [
      [color, color, 0],
      [0, color, color],
    ];
    super(arr, position, color);
  }
}
