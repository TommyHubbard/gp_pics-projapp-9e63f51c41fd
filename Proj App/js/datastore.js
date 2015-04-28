/*globals RSVP, amplify, _, pt */

( function ( pt ) {

    "use strict";

    var baseUrl = "https://mobiledev.ptsupply.com:8443/portal";

    pt.datastore = {
        restUrl: baseUrl + "/rest/mobile/",
        springUrl: baseUrl + "/static/auth/j_spring_security_check",
        sessionToken: "sessionToken",
        init: function () {
            var me = this;

            //Define the requests

            //Login request
            amplify.request.decoders.appEnvelope =
                function ( data, status, xhr, success, error ) {

                    if ( status === "success" ) {
                        data.status = status;
                        success( data );
                    } else if ( status === "fail" || status === "error" ) {
                        error( error, status );
                    } else {
                        error( error, "fatal" );
                    }
                };


            amplify.request.define( "login", "ajax", {
                url: this.springUrl,
                type: "POST",
                dataType: "json",
                crossDomain: true,
                headers: {
                    "Accept": "application/json"
                }
            } );

            //Forms request
            amplify.request.define( "forms", "ajax", {
                url: this.restUrl + 'application',
                type: "GET",
                dataType: "json",
                crossDomain: true,
                headers: {
                    "Accept": "application/json"
                },
                decoder: "appEnvelope"
            } );

            //Single form request
            amplify.request.define( "form", "ajax", {
                url: this.restUrl + "form",
                type: "GET",
                decoder: "appEnvelope"
            } );

            amplify.request.define( "submitForm", "ajax", {
                url: this.restUrl + "form",
                type: "POST",
                crossDomain: true,
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                dataType: "json",
                decoder: "appEnvelope"
            } );
            
            amplify.request.define( "submitSearch", "ajax", {
                url: this.restUrl + "master", 
                type: "GET",
                crossDomain: true,
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                dataType: "json",
                decoder: "appEnvelope"
            } );
            
            amplify.request.define( "submitHistory", "ajax", {
                url: this.restUrl + "history", 
                type: "GET",
                crossDomain: true,
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                dataType: "json",
                decoder: "appEnvelope"
            } );
       
            amplify.subscribe( "request.ajax.preprocess", function ( resource, settings, ajaxSettings, xhr ) {
                var authToken = me.getBaseAuth();

                //if ( authToken ) {
                    //xhr.setRequestHeader( "Authorization", authToken );
                //}

            } );

        },
        makeBaseAuth: function ( username, password ) {
            var tok = username + ":" + password;
            var hash = btoa( tok );
            return "Basic " + hash;
        },
        getBaseAuth: function() {
            return amplify.store.sessionStorage( this.sessionToken );
        },
        setBaseAuth: function( token ) {
            amplify.store.sessionStorage( this.sessionToken, token )
        },
        login: function ( username, password ) {
            var me = this;
            var promise = new RSVP.Promise( function ( resolve, reject ) {
                amplify.request( {
                    resourceId: "login",
                    data: { j_username: username, j_password: password },
                    success: function ( data, status ) {

                        var authToken = me.makeBaseAuth( username, password );
                        me.setBaseAuth( authToken );

                        resolve( data, status );
                    },
                    error: function ( data, status ) {
                        me.setBaseAuth( null );
                        reject( data, status );
                    }
                } );

            } );

            return promise;
        },
        logout: function() {
            this.setBaseAuth( null );
        },
        getForms: function () {

            var promise = new RSVP.Promise( function ( resolve, reject ) {
                amplify.request( {
                    resourceId: "forms",
                    cache: true,
                    success: function ( data, status ) {
                        resolve( data, status );
                    },
                    error: function ( data, status ) {
                        reject( data, status );
                    }
                } );

            } );

            return promise;

        },
        getForm: function ( id ) {

            var promise = new RSVP.Promise( function ( resolve, reject ) {
                amplify.request( {
                    resourceId: "form",
                    cache: false,
                    data: { app: id },
                    success: function ( data, status ) {
                        resolve( data, status );
                    },
                    error: function ( data, status ) {
                        reject( data, status );
                    }
                } );

            } );

            return promise;

        },
        submitForm: function ( data ) {

            var promise = new RSVP.Promise( function ( resolve, reject ) {
                amplify.request( {
                    resourceId: "submitForm",
                    data: JSON.stringify( data ),
                    success: function ( data, status ) {
                        resolve( data, status );
                    },
                    error: function ( data, status ) {
                        reject( data, status );
                    }
                } );

            } );

            return promise;

        },
        submitSearch: function ( id ) {
            var promise = new RSVP.Promise( function ( resolve, reject ) {
                amplify.request( {
                    resourceId: "submitSearch",
                    cache: false, 
                    data: { app: id },
                    success: function ( data, status ) {
                        resolve( data, status );
                    },
                    error: function ( data, status ) {
                        reject( data, status );
                    }
                } );

            } );

            return promise;

        },
        submitHistory: function ( id ) {
            var promise = new RSVP.Promise( function ( resolve, reject ) {
                amplify.request( {
                    resourceId: "submitHistory",
                    cache: false, 
                    data: { app: id },
                    success: function ( data, status ) {
                        resolve( data, status );
                    },
                    error: function ( data, status ) {
                        reject( data, status );
                    }
                } );

            } );

            return promise;

        }

    };

}( pt ) );