// Notify
// State: "success", "warning", "error"


define([], function() {
    var notify = function (state, text, length) {
        var timeout;

        if (length) {
            timeout = length;
        } else {
            timeout = 2000;
        }

        return notification = noty({
            text: text,
            type: state,
            layout: "topCenter",
            timeout: timeout
        });
    };

    return notify;
});


