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