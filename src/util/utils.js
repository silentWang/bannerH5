export function getUrlVars(key){
    let url = window.location.href;
    let ourl = url.split('#')[0];
    let vurl = ourl.split('?')[1];
    let arr = vurl.split('&');
    let kv = {};
    for(let i = 0;i < arr.length;i++){
        kv[arr[i].split('=')[0]] = arr[i].split('=')[1]
    }
    return kv[key];
}
export function getPxToVW(px,base = 750){
    let vw = 100 * px/base;
    return vw;
}

export function loadFont(fonturl){
    let fontName = 'font_' + Math.random().toString().slice(3,12);
    let style = document.createElement('style'); 
    let text = `@font-face {font-family:'${fontName}';src:url('${fonturl}')}`
    style.innerText = text;
    document.getElementsByTagName('head')[0].appendChild(style)
    return fontName
}