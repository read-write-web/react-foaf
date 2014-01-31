function loadScript(sScriptSrc, callback, type) {
    var oHead = document.getElementsByTagName('head')[0];
    var oScript = document.createElement('script');
    if (!type) type = 'text/javascript';
    oScript.type = type;
    oScript.src = sScriptSrc;

    // Then bind the event to the callback function.
    oScript.onreadystatechange = callback;   // IE 6 & 7
    oScript.onload = callback;

    oHead.appendChild(oScript);
}