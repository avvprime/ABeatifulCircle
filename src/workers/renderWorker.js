let canvas   = undefined,
    ctx      = undefined,
    isMobile = false,
    scale    = 1;

const textures = {};


async function onInit(data)
{
    canvas   = data.canvas;
    ctx      = canvas.getContext('2d');
    isMobile = data.isMobile;

    canvas.width  = data.width;
    canvas.height = data.height;

    scale = data.scale;

    ctx.fillStyle = "#ffff00";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function onImageAssetsLoaded(data)
{
    for(let i = 0; i < data.assets.length; i++)
    {
        textures[data.assets[i].key] = data.assets[i].asset;
    }
    
    function draw()
    {
        requestAnimationFrame(draw);
        
        ctx.drawImage(textures.bg, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(textures.dot, canvas.width / 2, canvas.height / 2, textures.dot.width * scale, textures.dot.height * scale);
    }

    requestAnimationFrame(draw);
}

function onWindowResize(data)
{  
    canvas.width = data.dimensions[0];
    canvas.height = data.dimensions[1];
    scale = data.scale;
}


const events = {
    init: onInit,
    windowResize: onWindowResize,
    imageAssetsLoaded: onImageAssetsLoaded,
}

onmessage = (msg) => {
    events[msg.data.eventName](msg.data);
}

