/*
globals pt */

( function( pt ) {

    "use strict";

    pt.config = {
        settings: {
            "version": "1.0"
        },
        messages: {
            "loginFailed": "We couldn't recognize your username or password",
            "submitFormTitle": "Form Submission",
            "submitFormSuccess": "Data has been submitted successfully.",
            "submitFormError": "There was an error submitting your data.",
            "submitSearchError": "There was an error in your search query."
        },
        views: {
            "login": "views/login.html",
            "home": "views/home.html",
            "openexp": "views/openexp.html",
            "projgarage": "views/projgarage.html",
            "current": "views/current.html",
            "history": "views/history.html",
        }

    };

} ( pt ) );