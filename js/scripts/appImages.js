define([], function() {

    function image(path) {
        return require.toUrl("img/"+path);
    }

    var images = {
        avatar: image("avatar.png"),
        friendIcon: image("friends_icon_yellow.png"),
        closeIcon: image("close_icon.png"),
        webIdIcon: image("webid.png")
    }

    return images;

});