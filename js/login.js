/*
globals $, kendo, pt */

( function ( pt ) {
    "use strict";

    //below you place anything private you don't want exposed in the viewModel
    var $loginUsername,
        $loginPassword;

    //below we create the viewModel

    pt.Login = {
        //create viewModel namespace in global i.e. namespace.[viewModel Name], to expose to global
        viewModel: kendo.observable( {
            errorMessage: "",
            //other properties or functions you want to observe and expose to html
            init: function () {
                $loginUsername = $( "#loginUsername" );
                $loginPassword = $( "#loginPassword" );
            },
            show: function () {
                $loginUsername.val( "" );
                $loginPassword.val( "" );
            },
            getVersion: function () {
                return pt.config.settings.version;
            },
            login: function () {
                
                /* var me = this,
                    username = $loginUsername.val(),
                    password = $loginPassword.val();
                me.set( "errorMessage", "" );
                pt.alerts.showLoading();
                pt.datastore.login( username, password ).then( function ( data ) {
                    pt.alerts.hideLoading();
                    me.set( "errorMessage", "" );
                    //Navigate to the home page
                    pt.app.navigate( pt.config.views.home, "slide" );
                } ).catch( function ( error ) {
                    me.set( "errorMessage", pt.config.messages.loginFailed );
                    pt.alerts.hideLoading();
                } );
                */
                pt.app.navigate ( pt.config.views.home, "slide" );
            }
        } )
    };


}( pt ) ); //pass in global namespace