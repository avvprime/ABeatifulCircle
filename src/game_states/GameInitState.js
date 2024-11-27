import GameState from "./GameState";
import { EventBus } from "../Global";
import { isMobile } from "../Utils";


export default class GameInitState extends GameState{
    

    enter()
    {
        super.enter();

        const _isMobile = isMobile();

        this.game.domCanvas = document.getElementById("game-canvas");
        this.game.offscreen = this.game.domCanvas.transferControlToOffscreen();

        window.onresize = () => { EventBus.emit("windowResize", {width: window.innerWidth, height: window.innerHeight}) };


        this.game.renderWorker = new Worker(new URL("../workers/renderWorker.js", import.meta.url), { type: "module" });
        this.game.renderWorker.postMessage({
            eventName: "init",
            canvas: this.game.offscreen,
            width: window.innerWidth,
            height: window.innerHeight,
            isMobile: _isMobile }, 
            [this.game.offscreen]
        );
        this.game.renderWorker.onmessage = (msg) => { EventBus.emit(msg.data.eventName, msg.data) };

        // Notify render worker when assets loaded
        EventBus.subscribe("imageAssetsLoaded", (data) => {
            this.game.renderWorker.postMessage({eventName: "imageAssetsLoaded", assets: data.assets});
        });
        // Notify render worker when window size change
        EventBus.subscribe("windowResize", (data) => { this.game.renderWorker.postMessage({eventName: "windowResize", dimensions: new Uint16Array([window.innerWidth, window.innerHeight])}) })
        
        
        this.game.assetWorker = new Worker(new URL("../workers/assetWorker.js", import.meta.url), { type: "module"});
        this.game.assetWorker.postMessage({
            eventName: "init",
            origin: window.location.origin,
            assets:[
                {key: "bg", fileName: _isMobile ? "bg_mobile.webp" : "bg_desktop.webp"},
                {key: "dot", fileName: "dot.png"}
            ],
        });
        this.game.assetWorker.onmessage = (msg) => { EventBus.emit(msg.data.eventName, msg.data) };
        
    
    }
}