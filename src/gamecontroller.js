var startGame

$(document).ready(()=>{
    startGame =  function(){
        let gameScreen = $('.game-wrapper__game-screen')
        let gameMenu = $('.game-wrapper__game-screen__game-menu')
        gameMenu.hide()
        gameScreen.append(`<div class="game-wrapper__game-screen__game-canvas"></div>
        <!-- /Close tag .game-wrapper__game-screen__game-canvas -->`)
    }
})

class Game{
    //Config
    grativy = 1

    static blockI = [
        [1],
        [1],
        [1],
        [1]
    ]
    static blockC = [
        [1, 1],
        [1, 1],
    ]
    static blockT = [
        [1, 1, 1],
        [0, 1],
    ]
    static blockLR = [
        [1],
        [1],
        [1, 1],
    ]
    static blockLL = [
        [0, 1],
        [0, 1],
        [1, 1],
    ]
    static blockZR = [
        [0, 1, 1],
        [1, 1],
    ]
    static blockZL = [
        [1, 1],
        [0, 1, 1],
    ]
    
    constructor(){
        this.matrix = [
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
}