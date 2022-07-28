require([
    "esri/Map",
    "esri/layers/GeoJSONLayer",
    "esri/views/MapView",
    "esri/widgets/Legend",
    "esri/widgets/BasemapGallery",
    "esri/widgets/Expand",
], (
    Map,
    GeoJSONLayer,
    MapView,
    Legend,
    BasemapGallery,
    Expand
) => {
    // Create variables that will hold the data path: 
    const publicSchools = "./data/Public_Schools.geojson";

    const neighborhoods = "./data/Neighborhood_Map_Atlas_Districts.geojson"


    // Create a variable that contains the Popups template (the data that will be displayed on the Popup)
    const publicSchoolsTemplate = {
        title: "Seattle Public Schools",
        content: "Name: {NAME} | Address: {ADDRESS}",
    };


    let schoolsRenderer = {
        type: "simple", // autocasts as new SimpleRenderer()
        symbol: {
            type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
            size: 8,
            color: "blue",
            outline: {
                width: 1,
                color: "red"
            }
        }
    }

    let neighborhoodsRenderer = {
        type: "simple", // autocasts as new SimpleRenderer()
        symbol: {
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            color: [255, 128, 0, 0.2],
            outline: { // autocasts as new SimpleLineSymbol()
                width: 1,
                color: "black"
            }
        }
    };

    const publicSchools_layer = new GeoJSONLayer({
        url: publicSchools,
        title: "Public Schools",
        copyright: "Seattle GeoData",
        // Data Source: "https://data-seattlecitygis.opendata.arcgis.com/datasets/public-schools/explore"
        renderer: schoolsRenderer,
        popupTemplate: publicSchoolsTemplate,
    });

    const map = new Map({
        basemap: "gray-vector",
        layers: [publicSchools_layer]
    });

    const neighborhoods_layer = new GeoJSONLayer({
        url: neighborhoods,
        title: "Seattle Neighborhoods",
        copyright: "Seattle GeoData",
        renderer: neighborhoodsRenderer
        // Data Source: "https://data-seattlecitygis.opendata.arcgis.com/datasets/neighborhood-map-atlas-districts/explore"

    });

    map.add(neighborhoods_layer);

    const view = new MapView({
        container: "viewDiv",
        center: [-122.3320, 47.6062],
        zoom: 10,
        map: map
    });

    let legend = new Legend({
        view: view,
    });


    legendExpand = new Expand({
        expandIconClass: "esri-icon-legend",
        view: view,
        content: legend
    })
    view.ui.add(legendExpand, "bottom-right");

    // Create the HTML div element programmatically at runtime and set to the widget's container
    const basemapGallery = new BasemapGallery({
        view: view,
        container: document.createElement("div")
    });


    basemapGalleryExpand = new Expand({
        expandIconClass: "esri-icon-basemap",
        view: view,
        content: basemapGallery
    });
    view.ui.add(basemapGalleryExpand, "top-right");
});