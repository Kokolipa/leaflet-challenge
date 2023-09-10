// ---------------------------LEAFLET PROJECT-------------------------------
// #########################################################################
// #########################################################################

// * Creating the map object
let myMap = L.map("map", {
    center: [27.325938, 120.501360],
    zoom: 4.3,
  });


  
// * BASE  MAP LAYERS
// * --------------------------------
let streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });
let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});



// ! ------------------APIs-------------------
// ! #########################################
// * Assigning the URL of the API to geoData
let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// * Asssigning a URL to the tacktonicplates Data
let tectonicData = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";



// ! ------------------FUNCTIONS-------------------
// ! ##############################################
// ? Defining the circle size function
function circleSize(magnitude) {
    // * Transforming the negative values to positive values using absolute value
    return Math.sqrt(Math.abs(magnitude)) * 100000
}

// ? Defining the color function
function chooseColor(depth) {
    if (depth <= 10) return "#F8B195";
    else if (depth <= 30) return "#F67280";
    else if (depth <= 50) return "#C06C84";
    else if (depth <= 70) return "#6C5B7B";
    else if (depth <= 90) return "#4B3B59";
    else return "black";
}; 

// ? Function to display information when a circle is clicked
function displayInfo(feature, layer) {
    let popupContent = `
      <h2>Place: ${feature.properties.place}</h2><hr />
      <h2>Time & Date Reported: ${new Date(feature.properties.time)}</h2> <hr />
      <h2>Magnitude: ${feature.properties.mag}</h2> <hr />
      <h2>Depth: ${feature.geometry.coordinates[2]}</h2> 
    `;
  
    // Bind the popup content to the layer
    layer.bindPopup(popupContent);
  }

// ? Defining the lagend range
let legendRanges = {
    '-10 - 10': [-10, 10],
    '10 - 30': [10, 30],
    '30 - 50': [30, 50],
    '50 - 70': [50, 70],
    '70 - 90': [70, 90],
    '90+': [90, Infinity]
};
// ? Function to fit the depth to the legend range
function getLegendRange(depth) {
    for (let label in legendRanges){
        if (depth >= legendRanges[label][0] && depth <= legendRanges[label][1]){
            return label;
        };
    }; 
    return 'Unknown';
};


// * Create separate layer groups for baseMaps
let streetMapGroup = L.layerGroup([streetMap]);
let topoGroup = L.layerGroup([topo]);

// * Create a base layer that holds both maps.
let baseMaps = {
    "Street Map": streetMapGroup,
    "Topographic Map": topoGroup
  };

// * Add the layer groups to the map
streetMapGroup.addTo(myMap);
topoGroup.addTo(myMap);

// * Create a layer groups for the overlays
let earthQuakes = new L.layerGroup();
let tectonicPlates = new L.layerGroup();
let densityMap = new L.layerGroup();

let overlays = {
    'Tectonec Plates': tectonicPlates,
    'Earthquakes': earthQuakes,
    'Density Heatmap': densityMap
}

// Pass our map layers into our layers control and add the layers control to the map.
L.control.layers(baseMaps, overlays).addTo(myMap);

// ! EearthQuake Data loading
// ! #########################################################################
d3.json(geoData).then(function (data) {
    console.log("Data loaded successfully", data);
    let features = data.features;

    // * Confirming the data was load successfully
    console.log("Features loaded successfully", features);
    console.log("Maximum magnitude: ", Math.max(...features.map(feature => feature.properties.mag)));

    // ! Creating the heatmap -- Heat Array - Variable
    let heatArray = [];

    for (let i = 0; i < features.length; i++) {
        // * Declaring all the values to alter the color and size of each of the circles by calling the functions created
        let coordinates = features[i].geometry.coordinates;
        let magnitude = features[i].properties.mag;
        let depth = coordinates[2];

        // * Pushing the heatmap values to the heatArray
        // * -------------------------------------------
        let location = features[i].geometry; 
        if (location) {
            //console.log(location);
            heatArray.push([location.coordinates[1], location.coordinates[0]]);
          };

        // * Returning the magnitude value and altering the color(magnitude) and the size(depth)
        if (magnitude) {
            let circle = L.circle([coordinates[1], coordinates[0]], {
                color: chooseColor(depth),
                fillColor: chooseColor(depth),
                fillOpacity: 0.5,
                radius: circleSize(magnitude)
            }).addTo(earthQuakes);

            // * Defining what will happen on click 
            circle.on('click', function () {
                let circleData = features[i];
                myMap.fitBounds(circle.getBounds());
                displayInfo(circleData, circle);
            });

            // * Defining what will happen when user mouseover
            circle.on('mouseover', function () {
                circle.setStyle({
                    fillOpacity: 0.9
                });
            });

            // * Defining what will happen when user mouseout
            circle.on('mouseout', function () {
                circle.setStyle({
                    fillOpacity: 0.5
                });
            });

        // * Returning error OR NaN magnitude values or zero magnitude values as a warning
        } else {
            console.log("Invalid magnitude at index", i, "with value", magnitude);
        };
    };



    // !---------- Adding the LEGEND ----------
    // !#######################################
    // * Create a legend control
    let legend = L.control({ position: 'bottomright' });
    
    // * Define the legend's onAdd function
    legend.onAdd = function (map) {
        let div = L.DomUtil.create('div', 'info legend');
        let labels = [];
            
        // * Loop through the legendRanges and add labels with colors
        for (let label in legendRanges) {
            let color = chooseColor(legendRanges[label][1]);
            labels.push(
                `<div class="legend-item">
                    <div class="legend-color">
                        <li style="background-color:${color}"></li>
                    </div>
                    <div class="legend-value">${label}</div>
                </div>`
                );
            }
    
            div.innerHTML = labels.join('');
            return div;
        };
    
        legend.addTo(myMap); 



        // ! Pushing the heatmap to DensityMap
        // ! #################################################################
        let heat = L.heatLayer(heatArray, {
            radius: 15,
            blur: 4
          }).addTo(densityMap);
});



// ! Tactonic Plates Dataset - Loading the data
// ! #################################################################
let myLineStyle = {
	color: "#000B66",
	weight: 2
}
// * Retrieve tectonic plate GeoJSON data
d3.json(tectonicData).then(function(data){
	console.log(data);

	// Create a GeoJSON layer with retrieved data
	L.geoJson(data,{
		style: myLineStyle
	}).addTo(tectonicPlates);
});


