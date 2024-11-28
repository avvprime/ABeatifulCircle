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

        // Add window resize event listener
        window.addEventListener('resize', function(){
            const scale = this.calcScale();
            this.game.renderWorker.postMessage({
                eventName: "windowResize",
                dimensions: new Uint16Array([window.innerWidth, window.innerHeight]),
                scale: scale,
            });
            EventBus.emit("windowResize", {width: window.innerWidth, height: window.innerHeight, scale: scale});
            
        }.bind(this));


        this.game.renderWorker = new Worker(new URL("../workers/renderWorker.js", import.meta.url), { type: "module" });
        this.game.renderWorker.postMessage({
            eventName: "init",
            canvas: this.game.offscreen,
            width: window.innerWidth,
            height: window.innerHeight,
            scale: this.calcScale(),
            isMobile: _isMobile }, 
            [this.game.offscreen]
        );
        this.game.renderWorker.onmessage = (msg) => { EventBus.emit(msg.data.eventName, msg.data) };

        // Notify render worker when assets loaded
        EventBus.subscribe("imageAssetsLoaded", (data) => {
            this.game.renderWorker.postMessage({eventName: "imageAssetsLoaded", assets: data.assets});
        });

        
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

    calcScale()
    {
        // 1080, Short side of logical screen size
        // But I gave arbitrary numbers to adjust appropriate size according to screen dimensions
        return Math.min(window.innerWidth, window.innerHeight) / 1600;
    }
}