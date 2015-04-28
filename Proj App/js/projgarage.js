/*
globals $, kendo, _, pt */

( function( pt ) {
    "use strict";
   
    //below you place anything private you don't want exposed in the viewModel
    //var $getForm;
       
    //below we create the viewModel
    pt.Projgarage = {
        
        //create viewModel namespace in global i.e. namespace.[viewModel Name], to expose to global
        viewModel: kendo.observable ( {
            errorMessage: "",
            generator: pt.searchgenerator,
            //other properties or functions you want to observe and expose to html
            init: function() {
                
            },
            show: function( e ) {
                var me = this,
                    dataItem,
                    paramId = e.view.params.id;

                if ( paramId ) {

                    //Find the form data
                    if ( pt.Home.viewModel.dataSource ) {
                        dataItem = _.findWhere ( pt.Home.viewModel.dataSource.data (),
                            { id: kendo.parseInt ( paramId ) } );

                        //If the form is found then display the name in the view title
                        if ( dataItem ) {
                            $ ( "#form-name" ).text ( dataItem.name );
                        }
                    }

                    pt.alerts.showLoading ();

                    //Load existing form
                    pt.datastore.getForm( paramId ).then( function ( data ) {
                        me.generator.formName = paramId;
                        me.generator.generate ( data.response.fields );
                        pt.alerts.hideLoading ();                    
                    } ).catch ( function() {
                        pt.alerts.hideLoading ();
                    } );
                             
                }   
                
            }
        
          })
    };

} ( pt ) ); //pass in global namespace