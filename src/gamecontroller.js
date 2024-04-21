// 21130385_PhamHoangHuy_0774073023_DH21DTB

const speedDefault = 0.5 //default: 0.5 (2 khối/s)
const speedMax = 0.1 //speed toi da khi dat maxSpeedAfter
const maxSpeedAfter = 5000 // toc do roi dat toi da khi score = maxSpeedAfter
const Color = {
  BACKGROUND: 0,
  RED: 1,
  GREEN: 2,
  AQUA: 3,
  ORANGE: 4,
  BLUE: 5,
  YELLOW: 6,
  PURPLE: 7,
  BRONZE: 8
}
const sizeOfGame = 15
const sizeOfNextScreen = 7

//GLOBAL
var startGame;
var fallingSpeed = speedDefault; 
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
var isPause = false
var rotating = false
var chanceToBronze = 0.2  //Ty le 1 khoi spawn xuat hien bronze (o level 2)


//


$(document).ready(() => {
  $('.popup-screen').hide()
  $('.about-me__content__close').on("click", (e)=>{
    $('.popup-screen').hide()
  })
  $('.game-wrapper__game-panel__about-me').on("click", (e)=>{
    $('.popup-screen').show()
  })

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

    $('.game-wrapper__game-panel__change-level').show()
    $('.game-wrapper__game-panel__pause').show()
    $('.game-wrapper__game-panel__content').show()


    changeLevel = function(){
      if (game){
        game.pauseGame(true)
        let lv = prompt("Level muốn đổi: ")
        game.level = Number(lv)
        game.pauseGame()
        game.updateGamePanel()
      }
    }


    keyEvent = $(document).on("keydown", (e)=>{
      switch(e.which){
        case 37: //Phim trai
          if (game && game.getCurrentBrick()&&!isPause){
            game.move(new Position(game.getCurrentBrick().currentPos.x, game.getCurrentBrick().currentPos.y-1))
            game.draw()
          }
        break
        case 38: //Phim len
          if (game && game.getCurrentBrick()&&!isPause){
            game.rotateBrick(game.getCurrentBrick())
            game.draw()
          }
        break
        case 39: //Phim phai
          if (game && game.getCurrentBrick()&&!isPause){
            game.move(new Position(game.getCurrentBrick().currentPos.x, game.getCurrentBrick().currentPos.y+1))
            game.draw()
          }
        break
        case 40: //Phim xuong
          if (game && game.getCurrentBrick()&&!isPause){
            fallInstant = true
          }
        break

      }
    })
    game = new Game()
    game.start()
    game.updateGamePanel()
  
  };

  

  
  pauseGame = function(pause){
    if (game)
      game.pauseGame(pause)
  }

});


class Game {
  //private
  #matrix = [];
  #currentBrick = null;
  #nextBrick = null
  //public
  isOverGame = false
  score = 0
  level = 1

  constructor() {
    //Tao 1 ma tran 2 chieu cho game
    this.#matrix = new Array(sizeOfGame*2).fill().map(()=> new Array(sizeOfGame).fill(0))
    this.#currentBrick = null
  }

  #updateGameSpeed(){

    if (!isOverGame && game){
      if (this.score <= maxSpeedAfter){
        fallingSpeed = speedDefault - ((speedDefault - speedMax)/maxSpeedAfter*this.score)
      }
      if (this.score >= 1000 && this.level < 2)
        this.level = 2
    }
    
  }

  #turnBrickTo(brick){
    if (this.level >= 2){
      for (let x in brick.getMatrix()){
        for (let y in brick.getMatrix()[x]){
          if (brick.getMatrix()[Number(x)][Number(y)]>0){
            
              if (Math.floor(Math.random() * 10) > (10 - chanceToBronze*10 - 1)){  
                brick.getMatrix()[Number(x)][Number(y)] = Color.BRONZE
              }
          }
        }
      }
    }else{
      return brick
    }
    return brick
  }

  async #runLoop(){
    while(!this.isOverGame){
      let speed = fallingSpeed*1000
      if (!isPause){
        this.#insertBrick()
        this.draw()
        await new Promise(r => setTimeout(r, speed)).then(()=>{this.#fallingBrick()})
        .then(()=>this.#updateGameSpeed())
        .then(()=>this.updateGamePanel())
      }else{
        await new Promise(r => setTimeout(r, 500))
      }
    }
    this.#gameOver()
  }

  start(level=1) {
    
    switch(level){
      case 1:
        this.level = 1
        this.#runLoop()
        break
      case 2:
        this.level = 2
        this.#runLoop()
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
      case Color.BRONZE:
        return "#d46d44"
      default:
        return "#000000"
    }
  }

  updateGamePanel(){
    if ($('.score__value').get(0))
    $('.score__value').get(0).innerHTML = this.score
    if ($('.level_value').get(0))
    $('.level_value').get(0).innerHTML = this.level
    if ($('.speed__value').get(0))
    $('.speed__value').get(0).innerHTML = Math.floor(1 / fallingSpeed * 100)/100
  }

  pauseGame(forcePause){
    if (!game)
      return
    isPause = !isPause
    if (forcePause)
      isPause = true
    if (isPause){
      $('.fa-pause').hide()
      $('.fa-play').show()
    }else{
      $('.fa-play').hide()
      $('.fa-pause').show()
    }
  }


  rotateBrick(brick=this.#currentBrick){
    rotating = true
    let tempMatrix = Game.cloneMatrix(this.#matrix)
    let brickMatrix = brick.getMatrix()
    let brickClone = brick.clone()

    let brickMatrixRes = new Array(brickMatrix[0].length).fill().map(e=>new Array(brickMatrix.length).fill())


    //Doan nay dung de xoay ma tran cua bien brick
    for(let x=0;x<brickMatrix[0].length; x++){
      for (let y=0; y<brickMatrix.length; y++){
        brickMatrixRes[x][y] = brickMatrix[y][brickMatrix[0].length- x-1]
      }
    }
    //

    brickClone.setMatrix(brickMatrixRes)
    if (!this.#checkCollideRotate(tempMatrix, brickClone)|| this.#checkEndLine(brickClone.currentPos, brickClone)){
      rotating = false
      return
    }

    this.#matrix = tempMatrix
    this.#currentBrick = brickClone
    

    rotating = false
    return brick
  }


  #checkCollideRotate(tempMatrix, tempBrick){
    let res = true
    if (tempMatrix && tempBrick){
      let tempPos = tempBrick.currentPos
      this.removeGhost(tempMatrix, this.#currentBrick)
      for (let x in tempBrick.getMatrix()){
        for (let y in tempBrick.getMatrix()[x]){
          if (tempBrick.getMatrix()[x][y] > 0){
            if (tempMatrix[Number(x)+tempPos.x][Number(y)+tempPos.y] > 0){
              return false
            }
          }
        }
      }
    }
    return res
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
          if (this.#nextBrick.getMatrix()[x][y]>0){
             this.drawBlock(ctxNextBrick, new Position(x+2, y+2), this.#nextBrick.getMatrix()[x][y])
          }
        }
      }
      
    }
  }

  drawBlock(context = ctx, position = new Position(0, Math.floor(this.#matrix.length/2)-1), color = Color.RED){
    let width= context == ctx?Math.floor(widthCanvas)/this.#matrix[0].length:Math.floor(widthCanvasNextBrick/sizeOfNextScreen)
    let height= context == ctx?Math.floor(heightCanvas)/this.#matrix.length:Math.floor(heightCanvasNextBrick/sizeOfNextScreen)
    context.fillStyle = this.colorToHex(color)
    context.strokeStyle = color == Color.BACKGROUND?"#909090": color == Color.BRONZE?"#eb1059": "#f5f5f5"
    context.lineWidth = color == Color.BACKGROUND?1:color == Color.BRONZE?2:2
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

  #gameOver(showPopup=true){
    this.isOverGame = true
    isOverGame = true
    this.#updateHighestScore()
    fallingSpeed = speedDefault
    game = null
    ctx = null
    ctxNextBrick = null
    this.#releaseBrick()
    keyEvent.off()
    keyEvent = null

    if (showPopup){
      if ($('.highest-score__value').get(0))
      $('.highest-score__value').get(0).innerHTML = localStorage.getItem("highestScore")?localStorage.getItem("highestScore"):this.score
      $('.gameover-menu').show()
    }

  }

  #fallingBrick() {
    if (this.#currentBrick != null && !rotating){
      if (!this.isOverGame){
        if (fallInstant){
          while(this.move(new Position(this.#currentBrick.currentPos.x+1, this.#currentBrick.currentPos.y))){}
          this.draw()
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

  static cloneMatrix(matrix){
    return matrix.map(e=>e.slice())
  }


  #releaseBrick() {
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
  #checkEndLine(newPosition=this.#currentBrick.currentPos, tempBrick=this.#currentBrick){
    if (!this.#currentBrick)
      return true
    return newPosition.x + tempBrick.getMatrix().length > this.#matrix.length ||
    newPosition.y + tempBrick.getMatrix()[0].length > this.#matrix[0].length ||
    newPosition.y < 0
  }

  //ham nay se tra 1 tempMatrix neu no ko collide o vi tri moi (newPosition)
  #checkCollide(newPosition=this.#currentBrick.currentPos, tempMatrix, tempBrick){  
      if (!tempMatrix)
        tempMatrix = Game.cloneMatrix(this.#matrix)
      
      if (this.#checkEndLine(newPosition)){
        return null
      }   


      //Xoa di brick current matrix
      if (newPosition != this.#currentBrick.currentPos){
          this.removeGhost(tempMatrix, tempBrick)
      }


      //Thu xem co di chuyen brick qua vi tri moi duoc khong
      if (!tempBrick)
        tempBrick = this.#currentBrick
    
      for(let x in tempBrick.getMatrix()){
        for (let y in tempBrick.getMatrix()[x]){
          if (tempMatrix){
           
            if (tempBrick.getMatrix()[Number(x)][Number(y)] > 0){
              if (tempMatrix[Number(x)+newPosition.x][Number(y)+newPosition.y] > 0){
                return null
              }
            }
            //neu khong va cham voi brick nao thi no dich chuyen theo vi tri moi cho brick hien tai
            if (tempBrick.getMatrix()[x][y] > 0){
              tempMatrix[Number(x)+newPosition.x][Number(y)+newPosition.y] = tempBrick.getMatrix()[Number(x)][Number(y)]
            }
          }
          
        } 
      }
      return tempMatrix
  }

  #updateHighestScore(){
    let hScore = null
    if (hScore= localStorage.getItem("highestScore")){
      if (hScore < this.score){
        localStorage.setItem("highestScore", this.score)
      }
    }else{
      localStorage.setItem("highestScore", this.score)
    }
  }

  //update ma tran cua currentBrick len tempMatrix
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
        return this.#turnBrickTo(new BrickCube())
      case 1:
        return this.#turnBrickTo(new BrickI())
      case 2:
        return this.#turnBrickTo(new BrickLL())
      case 3:
        return this.#turnBrickTo(new BrickLR())
      case 4:
        return this.#turnBrickTo(new BrickZL())
      case 5:
        return this.#turnBrickTo(new BrickZR())
      default:
        return this.#turnBrickTo(new BrickT())
    }
      
  }
  

  async #removeLine(){
    if (!game || isOverGame) return
    let tempMatrix = Game.cloneMatrix(this.#matrix)

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
          rotating = true

          for (y in tempMatrix[x]){
            await new Promise(r=>setTimeout(r, 50)).then(()=>{
              if (tempMatrix[x][y] == Color.BRONZE){
                //Neu day la khoi bronze, se co hieu ung mau xanh khi quet line so voi khoi thuong
                this.drawBlock(ctx, new Position(x,y), Color.BLUE)
              }else{
                this.drawBlock(ctx, new Position(x,y), Color.RED)
              }
            
            })

            if (this.level >= 2){
              //doan nay giup block broze ko bi xoa sau khi quet line
              if (tempMatrix[x][y] == Color.BRONZE){
                let rd =  Math.floor(Math.random() * 7) + 1 // doan nay de random tu 1-7
                tempMatrix[x][y] = rd
              }else{
                tempMatrix[x][y] = 0
              }
            }else{
              tempMatrix[x][y] = 0
            }
            
            this.score++
            
          }

          this.updateGamePanel()
          this.#dropBrick(tempMatrix, x)
          this.#matrix = tempMatrix
          this.draw()
          this.#removeLine()
        }
      }
      
  }

  #dropBrick(tempMatrix = this.#matrix, endX=0){
    if (!tempMatrix)
      return
    for (let x=endX; x>0; x--){
      for (let y=0; y<tempMatrix[x].length; y++){
        if (x+1 >= tempMatrix.length)
          continue
        if (tempMatrix[x][y] > 0 && tempMatrix[x+1][y]==0){
          for (let x1=x; x1<tempMatrix.length; x1++){
            if (x1==tempMatrix.length-1)
              break
            if (tempMatrix[x1+1][y] == 0){
              tempMatrix[x1+1][y] = tempMatrix[x1][y]
              tempMatrix[x1][y] = 0
            }else{
              break
            }
          }
        }
      }
    }
    rotating = false
  }



  removeGhost(tempMatrix = this.#matrix, tempBrick= this.#currentBrick){
    //Xoa matrix brick di tren tempMatrix
    if (!tempBrick)
      return
      let oldX = tempBrick.currentPos.x
      let oldY = tempBrick.currentPos.y

    for(let x in tempBrick.getMatrix()){
      for (let y in tempBrick.getMatrix()[x]){
        if (tempBrick.getMatrix()[x][y]>0){
          tempMatrix[Number(x)+oldX][Number(y)+oldY] = 0
        }
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
  setMatrix(matrix){
    this.#matrix = matrix
  }
  clone(){
    return new Brick(Game.cloneMatrix(this.getMatrix()), new Position(this.currentPos.x, this.currentPos.y), this.color)
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
