let canvas   = undefined,
    ctx      = undefined,
    isMobile = false;

let bgImageBitmap = undefined;


async function onInit(data)
{
    canvas   = data.canvas;
    ctx      = canvas.getContext('2d');
    isMobile = data.isMobile;

    ctx.fillStyle = "#ffff00";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function onBgImageLoaded(data)
{
    bgImageBitmap = data.asset;
    ctx.drawImage(bgImageBitmap, 0, 0, canvas.width, canvas.height);
}

function onWindowResize(data)
{
    canvas.width = data.width;
    canvas.height = data.height;
}


const events = {
    "init": onInit,
    "windowResize": onWindowResize,
    "bgImgLoaded": onBgImageLoaded,
}

self.onmessage = (msg) => {
    events[msg.data.eventName](msg.data);
}

