/*
globals pt*/

( function( pt ) {

    "use strict";

    pt.alerts = {
        alert: function (title, message, callback) {
            navigator.notification.alert (
                message,
                callback || function() {},
                title,
                "OK"
            );
        },
        showLoading: function() {
            pt.app.showLoading ();
        },
        hideLoading: function() {
            pt.app.hideLoading ();
        }
    };

} ( pt ) );