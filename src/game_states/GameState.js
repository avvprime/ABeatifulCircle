export default class GameState{
    constructor(game, name)
    {
        this.game = game;
        this.name = name;
    }

    enter() {console.log(this.name + " entered")}
    exit() {console.log(this.name + " exited")}
}