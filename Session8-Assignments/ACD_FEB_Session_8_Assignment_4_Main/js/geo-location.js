"use strict";
$(document).ready(function() {

    // get location button functionality
    $("#get-location-btn").click(function(event){
        event.preventDefault();
        $("#location-lat-long").html("Finding location. Please wait...");
        // check if browser supports the geolocation api
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success);			// if geolocation supported, call function
        } else {
            $("#location-lat-long").html('Your browser doesn\'t support the geolocation api.');
        }

    });

    // function to get lat/long and plot on a google map
    function success(position) {
        var latitude		= position.coords.latitude;				// set latitude variable
        var longitude		= position.coords.longitude;			// set longitude variable

        var mapcanvas		= document.createElement('div');		// create div to hold map
        mapcanvas.id = 'map';										// give this div an id of 'map'
        mapcanvas.style.height = '400px';							// set map height
        mapcanvas.style.width = '100%';								// set map width

        document.querySelector('#map-container').appendChild(mapcanvas);	// place new div within the 'map-container' div

        var coords = new google.maps.LatLng(latitude,longitude);	// set lat/long object for new map

        var options = {												// set options for map
            zoom: 18,
            center: coords,
    enableHighAccuracy: true,
            mapTypeControl: false,
            navigationControlOptions: {
                style: google.maps.NavigationControlStyle.SMALL
            },
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("map"), options);	// create new map using settings above

        var marker = new google.maps.Marker({						// place a marker at our lat/long
            position:	coords,
            map:		map
        });

        var latLongResponse	= 'Latitude: ' + latitude + ' / Longitude: ' + longitude;	// build string containing lat/long
        getAddress(latitude,longitude);							// geocode the lat/long into an address

        $("#location-lat-long").html(latLongResponse);									// write lat/long string to input field

    }


    // function to process address data
    function processAddress(address) {
        $("#location-address").html(address);									// write address to field
        var spokenResponse = "I've got you at " + address;						// build string to speak
        speakText(spokenResponse);												// speak the address
    }

    // function to geocode a lat/long
    function getAddress(myLatitude,myLongitude) {

        var geocoder	= new google.maps.Geocoder();							// create a geocoder object
        var location	= new google.maps.LatLng(myLatitude, myLongitude);		// turn coordinates into 
        geocoder.geocode({'latLng': location}, function (results, status) {
            if(status == google.maps.GeocoderStatus.OK) {						// if geocode success
                processAddress(results[0].formatted_address);					// if address found, pass to processing function
            } else {
              alert("Geocode failure: " + status);								// alert any other error(s)
              return false;
            }
        });
    }


    // function to speak a response
    function speakText(response) {

        // setup synthesis
        var msg = new SpeechSynthesisUtterance();
        var voices = window.speechSynthesis.getVoices();
        msg.voice = voices[2];					// Note: some voices don't support altering params
        msg.voiceURI = 'native';
        msg.volume = 1;							// 0 to 1
        msg.rate = 1;							// 0.1 to 10
        msg.pitch = 2;							// 0 to 2
        msg.text = response;
        msg.lang = 'en-US';

        speechSynthesis.speak(msg);
    }
});