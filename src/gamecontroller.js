var startGame

$(document).ready(()=>{
    startGame =  function(){
        let gameScreen = $('.game-wrapper__game-screen')
        let gameMenu = $('.game-wrapper__game-screen__game-menu')
        gameMenu.hide()
        gameScreen.append(`<div class="game-wrapper__game-screen__game-canvas"></div>
        <!-- /Close tag .game-wrapper__game-screen__game-canvas -->`)
        new Game().start()
        console.log(new BrickI().getMatrix())
    }
})

class Game{
    #currentBrick = null
    //private
    #matrix = null
    
    constructor(){
        this.#matrix = [
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0]
        ]
    }


    start(level){
        setInterval(this.#startGame(level), 1000)
    }

    #fallBrick(brick){
        if (this.currentBrick != null || this.currentBrick != undefined){
            this.currentBrick
        }
    }

    #addBrick(brick){
        this.currentBrick = brick
    }

    #releaseBrick(){
        this.currentBrick = null
    }

    #startGame(level){
        // alert(`Level game: ${level}`)
        console.clear()
        console.log(this.#matrix)
    }
}
class Position{
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

class Brick{
    #matrix = null
    #currentPos = null
    constructor(matrix, position){
        this.#matrix = matrix
        this.#currentPos = position
    }
    getMatrix(){
        return this.#matrix
    }
}

class BrickI extends Brick{
    constructor(position){
        let arr = [
            [1],
            [1],
            [1],
            [1]
        ]
        super(arr, position)
    }
}


class BrickCube extends Brick{
    constructor(position){
        let arr = [
            [1, 1],
            [1, 1],
        ]
        super(arr)
    }
}

class BrickT extends Brick{
    constructor(position){
        let arr = [
            [1, 1, 1],
            [0, 1],
        ]
        super(arr)
    }
}

class BrickLR extends Brick{
    constructor(position){
        let arr = [
            [1],
            [1],
            [1, 1],
        ]
        super(arr)
    }
}

class BrickLL extends Brick{
    constructor(position){
        let arr = [
            [0, 1],
            [0, 1],
            [1, 1],
        ]
        super(arr)
    }
}

class BrickZR extends Brick{
    constructor(position){
        let arr = [
            [0, 1, 1],
            [1, 1],
        ]
        super(arr)
    }
}

class BrickZL extends Brick{
    constructor(position){
        let arr = [
            [1, 1],
            [0, 1, 1],
        ]
        super(arr)
    }
}
