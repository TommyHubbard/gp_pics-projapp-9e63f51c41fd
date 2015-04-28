/*globals $, kendo, pt */

( function( pt ) {
    "use strict";

    function init() {

        // Account the for iOS status bar
        if ( window.device.platform === "iOS" ) {
            $ ( "body" ).addClass ( "iOS" );
        }

        //Initialize the mobile application
        pt.app = new kendo.mobile.Application ( document.body, {
            init: function() {
                //fix mouse events in iOS don't do it for android, causes more issues than it fixes
                kendo.UserEvents.defaultThreshold (
                    kendo.support.mobileOS.device === "android" ? 0 : 20 );
            },

            //Force the flat skin
            skin: "flat",

            // the application needs to know which view to load first
            initial: "views/login.html"
        } );

        // hide the splash screen as soon as the app is ready. otherwise
        // Cordova will wait 5 very long seconds to do it for you.
        navigator.splashscreen.hide ();

        //Initialize the data manager
        pt.datastore.init ();

    }

    document.addEventListener ( "deviceready", init, false );

} ( pt ) );