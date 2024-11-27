async function loadBgImage(origin)
{
    const url = `${origin}/public/bg.webp`;
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to load image: ${response.statusText}`);
        }

        const blob = await response.blob();

        const assetBitmap = await createImageBitmap(blob);

        return assetBitmap;

    } catch (error) {
        console.error(error);
        return false;
    }
    
}





async function onInit(data){
    const asset = await loadBgImage(data.origin);
    postMessage({eventName: "bgImgLoaded", data: asset});
}

const events = {
    init: onInit,
}

self.onmessage = (msg) => {
    events[msg.data.eventName](msg.data);
}