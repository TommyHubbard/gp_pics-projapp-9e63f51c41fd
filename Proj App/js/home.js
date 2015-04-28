
/*
globals $, kendo, pt */

( function( pt ) {

    "use strict";

    //below you place anything private you don't want exposed in the viewModel
 

    //below we create the viewModel

    pt.Home = {
        //create viewModel namespace in global i.e. namespace.[viewModel Name], to expose to global
        viewModel: kendo.observable ( {
            dataSource: new kendo.data.DataSource ( {
                transport: {
                    read: function ( options ) {
                        //Get forms from the data store
                        pt.datastore.getForms().then( function ( data ) {
                            var result = pt.Home.viewModel.parseAppList( data.response.applist );
                            options.success ( result );
                        } ).catch ( function( error ) {
                            options.error ( error );
                        } );
                    }
                },
                change: function( e ) {
                    if ( e.items.length === 0 ) {

                    }
                }
            } ),
            parseAppList: function ( applist ) {
                var result = [];

                _.forEach( applist, function ( n, i ) {
                    result[i] = { id: i, name: n };
                } );

                return result;
            },
            //other properties or functions you want to observe and expose to html
            init: function( e ) {

                var me = this,
                    listTemplate = $ ( "#form-list-template" ).html (),
                    viewObj = e.view;

                viewObj.element.find ( "#form-list" ).kendoMobileListView ( {
                    dataSource: me.dataSource,
                    template: listTemplate,
                    endlessScroll: true,
                    pullToRefresh: false,
                    virtualViewSize: 10
                } );

            },
            show: function() {

            },
            signout: function() {
                pt.datastore.logout();
                pt.app.navigate ( pt.config.views.login, "slide" );
            },
            loadOpenExp: function() {
                pt.app.navigate ( pt.config.views.openexp, "slide" );
            },
        } )
    };
} ( pt ) ); //pass in global namespace