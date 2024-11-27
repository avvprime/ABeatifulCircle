
import GameInitState from "./game_states/GameInitState";

export default class Game{

    States = {
        INIT: new GameInitState(this, "Game Init State"),
    };

    state = undefined;

    constructor()
    {
        this.state = this.States.INIT;
        this.state.enter();
    }

    changeState(newState)
    {
        this.state.exit();
        this.state = newState;
        this.state.enter();
    }



}