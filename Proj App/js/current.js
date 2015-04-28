/*
globals $, kendo, pt */

( function ( pt ) {
    "use strict";

    //below you place anything private you don't want exposed in the viewModel

        var primaryKey,
              secondaryKey,
              vars;
    
    //below we create the viewModel

    pt.Current = {
        //create viewModel namespace in global i.e. namespace.[viewModel Name], to expose to global
        viewModel: kendo.observable( {
            errorMessage: "",
            //other properties or functions you want to observe and expose to html
            init: function () {
            },
            show: function () {
           function getUrlVars() {
                vars = {};
                window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
                    vars[key] = value;
                });
                return vars;
            }
            primaryKey = getUrlVars()["primarykey"];
            secondaryKey= getUrlVars()["secondarykey"];
                if (typeof primaryKey !== 'undefined') {
                    var data = "<div class='searchResults'>" + primaryKey + "</div>";  
                }
                if (typeof secondaryKey !== 'undefined') {
                    data += "<div class='searchResults'>" + secondaryKey + "</div>";  
                }
            $("#results-container").html(data);
            },
            loadHistory: function() {
                    function getUrlVars() {
                        vars = {};
                        window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
                            vars[key] = value;
                        });
                        return vars;
                    }
                var appId = getUrlVars()["id"];
                var primaryKey = "&primarykey=" + getUrlVars()["primarykey"];
                var secondaryKey= "&secondarykey=" + getUrlVars()["secondarykey"];
                var keyFormFields;
                
                if (secondaryKey !== "&secondarykey=undefined") {
                   keyFormFields = primaryKey + secondaryKey;
                    } else {
                       keyFormFields = primaryKey;
                    }
                
                // Full string to pass to master
                var fullUrlString = appId + keyFormFields;
                
                //Submit search criteria
                pt.datastore.submitHistory( fullUrlString ).then( function (data) {
                    pt.app.navigate ( pt.config.views.history + "?id=" + appId + keyFormFields, "slide" );
                    })
            },
            emptyAndGoBack: function() {
                // $(".searchResults").empty();
                vars = {};
                primaryKey = "";
                secondaryKey = "";                
            }
                        
        } )
    };


}( pt ) ); //pass in global namespace