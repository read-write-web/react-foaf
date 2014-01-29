var httpUtils = {};


/**
 * Check the validity of an img Url
 * @param url
 * @returns => Bool
 */
httpUtils.checkImgURL = function(url) {
    if (url.indexOf("file:", 0) !== -1) return false;
    if (url.match(/\.(jpeg|jpg|gif|png)$/) != null) return true
    return false;
}