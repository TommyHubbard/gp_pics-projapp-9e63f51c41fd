$(window).on("orientationchange", function () {
     alert("Orientation is: " + event.orientation);
    if (window.orientation === 0) {                    // Portrait
        $("div#login").css( {
            "background-image" :  "url(images/pt-background-image.jpg)",
            "background-position" : "center center",
            "background-repeat" : "no-repeat",
            "background-attachment" : "fixed",
            "background-size" : "cover",
            "opacity" : "0.9",
            "height" : "100%"
            } );
        } else {                                                        // Landscape
             alert("Orientation is: " + event.orientation); 
            $("div#login").css( {
            "background-image":  "url(images/pt-background-image.jpg)",
            "background-position": "center center",
            "background-repeat" : "no-repeat",
            "background-attachment" : "fixed",
            "background-size" : "cover",
            "opacity": "0.9",
            "width" : "100%"     
            } );
            
            }
    } )
} ); 
