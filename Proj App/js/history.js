/*
globals $, kendo, pt */

( function ( pt ) {
    "use strict";

    //below you place anything private you don't want exposed in the viewModel

        var primarykey,
        secondarykey,
        vars;
    
    //below we create the viewModel

    pt.History= {
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
            
            var d = new Date();
            var month = d.getMonth()+1;
            var day = d.getDate();
            var minutes = d.getMinutes();
                if (minutes > 9) {
                    var addZero = "0";
                    addZero + minutes;
                }
            var hours = d.getHours();
            var aMpM = (hours >= 12) ? "PM" : "AM";
            var timeStamp = "<div class='timeStamp'>" +  ((''+month).length<2 ? '0' : '') + month + '/' + ((''+day).length<2 ? '0' : '') + day + '/' + d.getFullYear() + "&nbsp;&nbsp;" + hours + ":" + minutes + aMpM +"</div>";
            $("#history-header").html(timeStamp);
                
            primarykey = getUrlVars()["primarykey"];
            secondarykey= getUrlVars()["secondarykey"];
            if (primarykey !== 'undefined') {
                var data = "<div class='historyResults'>" + primarykey + "</div>";  
            }
            if (secondarykey !== 'undefined') {
                alert(secondarykey);
                data += "<div class='historyResults'>" + secondarykey + "</div>";  
            }
            $("#history-container").html(data);
            },
            emptyAndGoBack: function() {
           
            }
                        
        } )
    };


}( pt ) ); //pass in global namespace