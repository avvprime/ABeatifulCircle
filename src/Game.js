class Spring{

    x = 0;
    y = 0;
    height = 0;
    targetHeight = 0;
    ox = 0;
    oy = 0;

    velocity = 0;

    constructor(_x, _y, _ox, _oy)
    {
        this.x = _x;
        this.y = _y;
        this.ox = _ox;
        this.oy = _oy;

        const dx = _x - _ox;
        const dy = _y - _oy;

        const dist = Math.sqrt(dx * dx + dy * dy);

        this.height = 0;
        this.targetHeight = dist;

        this.dirx = dx / dist;
        this.diry = dy / dist;
    }

    // k = spring constant / stiffnes value
    // d = damp value
    wave_update(k, d)
    {
        const dx = this.x - this.ox;
        const dy = this.y - this.oy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // x = spring's displacement
        const x = dist - this.targetHeight;

        // f = force / acceleration
        const f = -k * x + this.velocity * -d;

        const mx = this.dirx * this.velocity;
        const my = this.diry * this.velocity;

        this.x += mx;
        this.y += my;

        this.velocity += f;

        this.height = dist;
    }

    draw(ctx)
    {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 4, 0, 6.28);
        ctx.fill();
    }

}



export default class Game{


    springs = [];

    constructor()
    {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');

        window.onresize = this.handleResize.bind(this);

        this.handleResize();

        this.center = {
            x: Math.round(this.canvas.width / 2),
            y: Math.round(this.canvas.height / 3)
        };

        this.generateRing();

        this.springs[7].velocity -= 2;
    }

    initGame()
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


    generateRing()
    {
        const res = 64;
        const step = 6.28 / res;
        const rad  = 64;
        for (let i = 0; i < res; i++)
        {
            const angle = i * step;
            const point = {
                x: this.center.x + (rad * Math.cos(angle)),
                y: this.center.y + (rad * Math.sin(angle))
            };
            this.springs.push(new Spring(point.x, point.y, this.center.x, this.center.y));
        }
    }

    update()
    {
        this.updateRings();
        
    }

    // current phase only have one ring so 
    updateRings()
    {
        for (let i = 0; i < this.springs.length; i++) this.springs[i].wave_update(0.025, 0.05);

        const leftDeltas = [];
        const rightDeltas = [];

        for (let i = 0; i < this.springs.length; i++)
        {
            leftDeltas.push(0);
            rightDeltas.push(0);
        }

        const spread = 0.001;

        // p = passes value
        for (let p = 0; p < 4; p++)
        {
            for (let i = 0; i < this.springs.length; i++)
            {
                if (i > 0)
                {
                    leftDeltas[i] = spread * (this.springs[i].height - this.springs[i - 1].height);
                    this.springs[i - 1].velocity += leftDeltas[i];
                }
                if (i < this.springs.length - 1)
                {
                    rightDeltas[i] = spread * (this.springs[i].height - this.springs[i + 1].height);
                    this.springs[i + 1].velocity += rightDeltas[i];
                }
            }

            for (let i = 0; i < this.springs.length; i++)
            {
                if (i > 0) this.springs[i - 1].height += leftDeltas[i];

                if (i > this.springs.length - 1) this.springs[i + 1].height += rightDeltas[i];
            }
        }

        
    }

    draw()
    {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "#efefef";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawFrame();
        this.drawRing();

        
        this.ctx.fillStyle = "#212121";
        this.ctx.beginPath();
        this.ctx.arc(this.center.x, this.center.y, 32, 0, 6.28);
        this.ctx.fill();
        
        // fore circle
        this.ctx.fillStyle = "#ffffff";
        this.ctx.beginPath();
        this.ctx.arc(this.center.x, this.center.y, 4, 0, 6.28);
        this.ctx.fill();
        
    }

    drawFrame()
    {
        this.ctx.strokeStyle = "#212121";
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 10);
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
        this.ctx.lineTo(this.canvas.width / 2, 10);
        this.ctx.stroke();
    }

    drawRing()
    {
        this.ctx.strokeStyle = "#212121";
        //this.ctx.fillStyle = "#47ADD0";
        this.ctx.beginPath();
        this.ctx.moveTo(this.springs[0].x, this.springs[0].y);
        for (let i = 1; i < this.springs.length; i++)
        {
            this.ctx.lineTo(this.springs[i].x, this.springs[i].y);
        }
        this.ctx.lineTo(this.springs[0].x, this.springs[0].y);
        this.ctx.stroke();
        //this.ctx.fill();

        /*
        this.ctx.fillStyle = "#212121";
        for (let i = 0; i < this.springs.length; i++)
        {
            this.springs[i].draw(this.ctx);
        }
        */
    }

    handleResize()
    {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
}