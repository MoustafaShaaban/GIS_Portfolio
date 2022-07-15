require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/widgets/Search",
    "esri/widgets/Locate",
    "esri/rest/locator",
    "esri/Graphic"
], function (
    esriConfig,     // Used to configue the API key
    Map,            // Used to create a basemap
    MapView,        // Used to create a MapView
    Search,         // Used to search for a place
    Locate,         // Used to locate the User Geolocation
    locator,        // Used to locat nearby places
    Graphic,        // Used to create graphics on the map
){
    // Insert the API Key here (inside the double quotes) to use it for ArcgGIS JS API services: (basemap, routing, ...):
    esriConfig.apiKey = "";

    // Create the basemap:
    const map = new Map({
        basemap: "arcgis-navigation"
    });

    // Create a MapView to display the map inside it
    const view = new MapView({
        container: "viewDiv",   // The container that will hold the MapView (here it is a Div with ID viewDiv)
        map: map,   // The Map to view
        center: [-40, 20],  // The center coordinates of the MapView
        zoom: 2     // The Zoom level
    });
    
    // Search for a place:
    const search = new Search({
        view: view
    });
    
    // Place the search bar on the top-right of the screen:
    view.ui.add(search, "top-right");

    // Create the Locate functionality:
    const locate = new Locate({
        view: view,
        useHeadingEnabled: false,
        goToOverride: function(view, options) {
            options.target.scale = 1500;
            return view.goTo(options.target);
        }
    });
    // Place the locate button on the top-left of the screen:
    view.ui.add(locate, "top-left");


    /* 
        Create a place category selector:

        You filter place search results by providing a location and category.
        Places can be filtered by categories such as coffee shop, gas stations, and hotels.
        Use an HTML <select> element to provide a list of several categories from which to choose.

    */

    // Create an array of places for the categories that will be used to make a selection:
    const places = [
        "Choose a place type...",
        "Parks and Outdoors",
        "Coffee shop",
        "Gas station",
        "Food",
        "Hotel",
        "Library",
        "Park",
        "Hospital"
    ];

    // Create a parent select element for the search categories and assign some styles:
    const select = document.createElement("select", "");
        select.setAttribute("class", "esri-widget esri-select");
        select.setAttribute("style", "width: 175px; font-family: 'Avenir Next W00'; font-size: 1em");

    
    // Create an option element for each category and add it to the select element.
    places.forEach(function(p) {
        const option = document.createElement("option");
        option.value = p;
        option.innerHTML = p;
        select.appendChild(option);
    });

    // Add the select element to the top-right corner of the view:
    view.ui.add(select, "top-right");

    /*
        Define the service url:

        You can use a locator to access the Geocoding service:
    */

    // Define a varialbe, locatorUrl, to the URL for the Geocoding service:
    const locatorUrl = "http://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer";


    /* 
        Search for places:

        To find places, you can use the 'locator' 'addressToLocations' function.
        Performing a local search based on a category requires a location from which to search and a category name.
        The function sends a request to the Geocoding service and the service returns place candidates with a name, address and location information.
        Use the function to perform a search and add the results to the map as graphics.
    */

    // Create a findPlaces function and call 'addressToLocations. Set the location, categories, and ontFields properties.
    // Find places and add them to the map:
    function findPlaces(category, pt) {
        locator.addressToLocations(locatorUrl, {
            location: pt,
            categories: [category],
            maxLocations: 25,
            outFields: ['Place_addr', "PlaceName"]
        })

        // Clear the view of existing pop-ups and graphics:
        .then(function(results) {
            view.popup.close();
            view.graphics.removeAll();

            // Create a Graphic for each result returned. 
            // Set the attributes, geometry, symbol and popupTempleate properties for each.
            // Add each graphic to the view
            results.forEach(function(result) {
                view.graphics.add(
                    new Graphic({
                        attributes: result.attributes,  // Data attributes returned
                        geometry: result.location,  // Point returned
                        symbol: {
                            type: "simple-marker",
                            color: "red",
                            size: "12px",
                            outline: {
                                color: "#ffffff",
                                width: "2px"
                            }
                        },

                        popupTemplate: {
                            title: "{PlaceName}",   // Data attribute names
                            content: "{Place_addr}"
                        }
                    })
                );
            });
        });
    }
    
    // Call the findPlaces function when the view loads and each time the view changes and become stationary:
    view.watch("stationary", function(val) {
        if (val) {
            findPlaces(select.value, view.center);
        }
    });

    /*
        Add a handler to select a category:

        Use an event handler to call the findPlaces function when the category is changed.
    */

    // Add an event listener to listen for category changes:
    select.addEventListener('change', function (event) {
        findPlaces(event.target.value, view.center);
    });
})