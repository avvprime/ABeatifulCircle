export default class Game{
    constructor()
    {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');

        window.onresize = this.handleResize.bind(this);
    }

    initGameLoop()
    {
        requestAnimationFrame(this.firstFrame.bind(this));
    }

    frameId = 0;
    acc = 0;
    lastTime = 0;
    step = 1 / 60;

    firstFrame(elapsedtime)
    {
        this.frameId = requestAnimationFrame(this.loopCallback.bind(this));
        this.lastTime = elapsedtime;
    }

    loopCallback(elapsedtime)
    {
        this.frameId = requestAnimationFrame(this.loopCallback.bind(this));
        const dt = (elapsedtime - this.lastTime) / 1000;
        this.acc += dt;
        while(this.acc > this.step)
        {
            this.update(this.step);
            this.acc -= this.step;
        }
        this.draw();
        this.lastTime = elapsedtime;
    }

    update()
    {

    }

    draw()
    {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "#008DBE";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawFrame();

        this.ctx.beginPath();
        this.ctx.arc(this.canvas.width / 2, this.canvas.height / 3, 40, 0, 6.28);
        this.ctx.fill();
        this.ctx.stroke();
    }

    drawFrame()
    {
        this.ctx.strokeStyle = "#ffffff";
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2 - 50, 10);
        this.ctx.lineTo(20, 10);
        this.ctx.lineTo(20, 20);
        this.ctx.lineTo(10, 20);
        this.ctx.lineTo(10, this.canvas.height - 20);
        this.ctx.lineTo(20, this.canvas.height - 20);
        this.ctx.lineTo(20, this.canvas.height - 10);
        this.ctx.lineTo(this.canvas.width - 20, this.canvas.height - 10);
        this.ctx.lineTo(this.canvas.width - 20, this.canvas.height - 20);
        this.ctx.lineTo(this.canvas.width - 10, this.canvas.height - 20);
        this.ctx.lineTo(this.canvas.width - 10, 20);
        this.ctx.lineTo(this.canvas.width - 20, 20);
        this.ctx.lineTo(this.canvas.width - 20, 10);
        this.ctx.lineTo(this.canvas.width / 2 + 50, 10);
        this.ctx.stroke();
    }

    handleResize()
    {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
}