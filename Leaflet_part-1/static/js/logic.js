// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr>Magnitude: ${feature.properties.mag}<p>${new Date(feature.properties.time)}</p>`);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      var color,
          mag,
          radius;

  //color map for depth of earthquake
      if (feature.geometry.coordinates[2] > 90) {color = '#ff0000';}
      else if  (feature.geometry.coordinates[2] > 70) {color = '#ffc000';}
      else if (feature.geometry.coordinates[2] > 50) {color = '#faff00';}
      else if (feature.geometry.coordinates[2] > 30) {color = '#00FF00';}
      else if (feature.geometry.coordinates[2] > 10) {color = '#00d1ff';}
      else {
        color = '#008dff';
      }

  //magnitude and radius calculations
      mag = feature.properties.mag;
      radius = 2 * Math.max(mag, 1);
      
  //circle marker generation
      return L.circleMarker(latlng, {
        color: color,
        radius: radius,
        opacity:0.5,
        fillOpacity:0.5,        
      });
    }
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


  // Create a legend to display legendrmation about our map
  var legend = L.control({
    position: "bottomright"
});
// When the layer control is added, insert a div with the class of "legend"
legend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML=[
        "<h1>Depth</h1>",
        "<p class='l10'>Less than 10</p>",
        "<p class='l30'>Between 10 and 30</p>",
        "<p class='l50'>Between 30 and 50</p>",
        "<p class='l70'>Between 50 and 70</p>",
        "<p class='l90'>Between 70 and 90</p>",
        "<p class='g90'>Greater than 90</p>"
    ].join("");

    return div;
};
// Add the legend legend to the map
legend.addTo(myMap);
  };
