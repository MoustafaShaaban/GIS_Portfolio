require([
    "esri/Map",
    "esri/views/MapView",
    "esri/widgets/Directions",
    "esri/layers/RouteLayer",
    "esri/widgets/Expand",
    "esri/widgets/Search",
    "esri/widgets/Locate"
], function(Map, MapView, Directions, RouteLayer, Expand, Search, Locate) {
    
    // Insert the API Key here (inside the double quotes) to use it for ArcgGIS JS API Routing services:
    const apiKey = "";

    // Create a RouteLayer, required for Directions widget:
    const routeLayer = new RouteLayer();

    // Create a basemap and add the RouteLayer to it:
    const map = new Map({
        basemap: "topo-vector",
        layers: [routeLayer]
    });

    // Create a MapView:
    const view = new MapView({
        center: [-40, 20],
        zoom: 2,
        container: "viewDiv",
        map: map
    });

    // Add the RouteLayer to the Directions widget:
    let directionsWidget = new Directions({
        layer: routeLayer,
        apiKey,
        view
    });

    // Create a Search Widget to use it for searching for places:
    const searchWidget = new Search({
        view: view
    })

    // Create an Expand Widget to toggle the Directions Widget on and off:
    const expandDirections = new Expand({
        view: view,
        content: directionsWidget
    });

    // Add the Expand Directions widget to the bottom right of the MapView:
    view.ui.add(expandDirections, "bottom-right");


    // Create an Expand Widget to toggle the Search Widget on and off:
    const expandSearch = new Expand({
        view: view,
        content: searchWidget
    });

    // Add the Expand Search widget to the top right of the MapView:
    view.ui.add(expandSearch, "top-right");

    // Create a Locate button to get the Geolocation of the user:
    const locate = new Locate({
        view: view
    });
    // Add the Locate button to the top left of the MapView:
    view.ui.add(locate, "top-left");
});