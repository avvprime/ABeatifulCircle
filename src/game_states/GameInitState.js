import GameState from "./GameState";
import { EventBus } from "../Global";
import { isMobile } from "../utils";


export default class GameInitState extends GameState{
    

    enter()
    {
        super.enter();

        this.game.domCanvas = document.getElementById("game-canvas");
        this.game.offscreen = this.game.domCanvas.transferControlToOffscreen();

        this.game.renderWorker = new Worker(new URL("../workers/renderWorker.js", import.meta.url), { type: "module" });
        this.game.renderWorker.postMessage({
            eventName: "init",
            canvas: this.game.offscreen,
            isMobile: isMobile() }, 
            [this.game.offscreen]
        );
        this.game.renderWorker.onmessage = (msg) => { EventBus.emit(msg.data.eventName, msg.data) };
        
        // Currently only loading one asset (bg.png)
        EventBus.subscribe("bgImgLoaded", (data) => {
            this.game.renderWorker.postMessage({eventName: "bgImgLoaded", asset: data.data})
        });
        


        this.game.assetWorker = new Worker(new URL("../workers/assetWorker.js", import.meta.url), { type: "module"});
        this.game.assetWorker.postMessage({
            eventName: "init",
            origin: window.location.origin
        });
        this.game.assetWorker.onmessage = (msg) => { EventBus.emit(msg.data.eventName, msg.data) };
    }
}