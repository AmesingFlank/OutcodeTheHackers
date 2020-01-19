import {Vec2} from './Vec2.js'
import {Sprite} from '../Frontend/sprite.js'

export const MODE_NEXT_MOVE = 111
export const MODE_ALL_MOVES = 222

export class Messenger{
    constructor(position, direction, invisibilityCount){
        this.position = position
        this.direction = direction
        this.invisibilityCount = invisibilityCount
        this.isInvisible = true;
        this.dead = false;
        this.atDestination = false
        this.getNextMove = (state) => {return {x:0,y:0,goInvisible:false}}
    }

    render(context, board) {
        if(!this.printers){
<<<<<<< Updated upstream
            this.printers = [new Sprite(document.getElementById("Messenger")), new Sprite(document.getElementById("TransparentMessenger"))];
=======
            this.printers = [new Sprite(document.getElementById("Packet")), new Sprite(document.getElementById("TransparentPacket"))];
>>>>>>> Stashed changes
        }
        if(!this.isInvisible) {
            this.printers[0].render(context, this.position, board);
        }
        else {
            this.printers[1].render(context, this.position, board);
        }
    }
}

export class Hacker{
    constructor(position, direction ){
        this.position = position
        this.direction = direction
        
        this.getNextMove = (state) => {
            
            let weights = [0.25, 0.25, 0.25, 0.25] // possibilities of next move in the direction of E, N, W, S respectively
            let random = Math.random()
            let percentile = 0
            for (let i = 0; i < weights.length; i++) {
                percentile += weights[i];
                if (random <= percentile) {
                    if (i === 0) {
                        return {x:1,y:0,goInvisible:false}
                    }
                    if (i === 1) {
                        return {x:0,y:1,goInvisible:false}
                    }
                    if (i === 2) {
                        return {x:-1,y:0,goInvisible:false}
                    }
                    if (i === 3) {
                        return {x:0,y:-1,goInvisible:false}
                    }
                }
            }
        }
        
    }

    render(context, board) {
        if(!this.printer){
            this.printer = new Sprite(document.getElementById("Hacker"));
        }
        this.printer.render(context, this.position, board)
    }
}

export class Game{
    constructor(mapSize,destination,mode,messengerInvisibilityCount,initialCode){
        this.messengers = []
        this.hackers = []
        this.mapSize = mapSize
        this.destination = destination

        this.arrivedMessengers = []
        this.killedMessengers = []

        this.mode = mode
        this.messengerInvisibilityCount = messengerInvisibilityCount

        this.shoudBuildNextMovesUsingAllMoves = mode === MODE_ALL_MOVES

        this.initialCode = initialCode

        this.started = false;

    }
    buildNextMovesUsingAllMoves(){
        for(let i = 0;i<this.messengers.length;++i){
            let allMoves = []
            this.messengers[i].move = (action) =>{
                allMoves.push(action)
            }
            this.messengers[i].getAllMoves(this,this.messengers[i]);


            let moveID = 0

            this.messengers[i].getNextMove = (game) => {
                let result = allMoves[moveID]
                moveID += 1
                return result
            }

        }

        
    }
    step(){
        
        let state = this;

        if(this.started){
            if(this.shoudBuildNextMovesUsingAllMoves){
                this.buildNextMovesUsingAllMoves();
                this.shoudBuildNextMovesUsingAllMoves = false;
            }
            for(let i = 0;i<this.messengers.length;++i){
                if(this.messengers[i].dead || this.messengers[i].atDestination){
                    continue;
                }
                let move = this.messengers[i].getNextMove(state)
                this.applyMessengerMove(this.messengers[i],move)
                if(this.messengers[i].position.equals(this.destination)){
                    this.messengers[i].atDestination = true;
                    this.arrivedMessengers.push(this.messengers[i])
                }
            }
        }
        

        for(let i = 0;i<this.hackers.length;++i){
            let move = this.hackers[i].getNextMove(state)
            this.applyMessengerMove(this.hackers[i],move)

        }
        this.checkKilling();
    }
    applyMessengerMove(messenger, move){
        messenger.position.x += move.x;
        messenger.position.y += move.y;
        messenger.position.x = Math.max(0,Math.min(messenger.position.x,this.mapSize.x))
        messenger.position.y = Math.max(0,Math.min(messenger.position.y,this.mapSize.y))
        messenger.direction.x = move.x
        messenger.direction.y = move.y
        messenger.isInvisible = move.goInvisible
    }
    applyHackerMove(hacker,move){
        hacker.position.x += move.x;
        hacker.position.y += move.y;
        hacker.position.x = Math.max(0,Math.min(hacker.position.x,this.mapSize.x))
        hacker.position.y = Math.max(0,Math.min(hacker.position.y,this.mapSize.y))
        hacker.direction.x = move.x
        hacker.direction.y = move.y
    }
    checkKilling(){
        for (let hacker of this.hackers) {
            for (let messenger of this.messengers) {
                if(messenger.dead || messenger.atDestination || messenger.isInvisible){
                    continue;
                }
                // Kill messenger if the distance between hacker and messenger <= 1
                if (hacker.position.x === messenger.position.x && hacker.position.y === messenger.position.y) {
                    messenger.dead = true
                }
                if(messenger.dead){
                    this.killedMessengers.push(messenger)
                }
            }
        }
    }
}


