# Leaflet - Mapping [![Leaflet-map](https://img.shields.io/badge/Belly-Dashboard-black?style=flat&logo=atandt)](https://kokolipa.github.io/leaflet-challenge/) 
### Project description:
Creating a visual map representation of earthquake data from the United States Geological Survey, **USGS** for short, using Leaflet, D3, and Leaflet plugins. 

#### Map Creation Process & Notes:
1. **Data collection:** 
    * Calling USGS API to collect global earthquake data from the past seven days. 
    * Calling GeoJSON API from GitHub to collect the tectonic plate data. 
2. **Creating functions:** 
    * **Circle Leaflet chart** - A function to adjust the size of a circle (earthquake object) to the map zoom level. The function takes a magnitude component and multiplies its value by 100,000. 
    * **Circle Leaflet chart** - A function to modify the colour of a circle (earthquake object) **based on the depth component** of the earthquake object. 
    * **Tooltip** - A function to collect the tooltip information on each earthquake object. The tooltip includes the following information:
        * Place - The place where the earthquake occurred. 
        * The time & and date of the earthquake.
        * The magnitude of the earthquake.
        * Depth - The depth of the earth. 
    * **Legend** - A function to fit an earthquake's depth to the depth range. 
3. **Visualising**: Leaflet Heatmap (to show the density of earthquakes within a particular area), circles (each circle in the map represent an earthquake), and tectonic plates (to identify areas with high density of earthquakes). 
4. **Creating the base and overlay maps**: 
    * Basemaps: Open street map, topographic map (open street map). 
    * Overlay maps: Tectonic plates, Earthquakes, and Density Heatmap. 

### Libraries & Plugins: 
1. Leaflet
2. D3
3. Leaflet Heatmap

### Languages used: 
1. HTML - Frontend
2. JavaScript - Backend
3. CSS

### Map Images:
Earthquakes & Tectonic plates
![]()
Heatmap & Tectonic plates
![]()
Global Topographic 
![]()

#### Folder structure:
``` yml
.
├── Images
│   ├── earthquakes.png
│   ├── heatmap.png
│   ├── topo_global.jpeg
├── static
│   ├── CSS 
│   |   ├── belly_dashboard.png
│   ├── JS   
│   |   ├── leaflet-heat.js # This is the Leaflet Plugin
│   |   ├── logic.js # This is an inclusive solution of both part 1 and part 2 of this challenge. 
├── index.html                   
|___.gitignore               
|___README.md
``` 


