async function loadImageAsset(url){
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

async function loadImageAssets(origin, assets)
{
    const _assets = [];
    for (let i = 0; i < assets.length; i++)
    {
        const url = `${origin}/${assets[i].fileName}`
        _assets.push({key: assets[i].key, asset: await loadImageAsset(url)})
    }

    return _assets;
}





async function onInit(data){
    const assets = await loadImageAssets(data.origin, data.assets);
    postMessage({eventName: "imageAssetsLoaded", assets: assets});
}

const events = {
    init: onInit,
}

onmessage = (msg) => {
    events[msg.data.eventName](msg.data);
}