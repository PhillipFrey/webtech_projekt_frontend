<template>

  <div id="map"></div>


</template>

<script>
const apiKey = "";

const map = new ol.Map({
  target: "map"
});

const view = new ol.View({

  center: ol.proj.fromLonLat([-79.3832, 43.6532]), // Toronto

  zoom: 13
});
map.setView(view);

let startLayer, endLayer, routeLayer;
function addCircleLayers() {

  startLayer = new ol.layer.Vector({
    style: new ol.style.Style({
      image: new ol.style.Circle({
        radius: 6,
        fill: new ol.style.Fill({ color: "white" }),
        stroke: new ol.style.Stroke({ color: "black", width: 2 })
      })
    })
  });
  map.addLayer(startLayer);
  endLayer = new ol.layer.Vector({
    style: new ol.style.Style({
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({ color: "black" }),
        stroke: new ol.style.Stroke({ color: "white", width: 2 })
      })
    })
  });

  map.addLayer(endLayer);

}

let currentStep = "start";
let startCoords, endCoords;

const geojson = new ol.format.GeoJSON({
  defaultDataProjection: "EPSG:4326",
  featureProjection: "EPSG:3857"
});

function updateRoute() {

  const authentication = arcgisRest.ApiKeyManager.fromKey(apiKey);

  arcgisRest

      .solveRoute({
        stops: [startCoords, endCoords],
        authentication
      })

      .then((response) => {

        routeLayer.setSource(
            new ol.source.Vector({
              features: geojson.readFeatures(response.routes.geoJson)
            })
        );

      })

      .catch((error) => {
        alert("There was a problem using the geocoder. See the console for details.");
        console.error(error);
      });
}

map.on("click", (e) => {

  const coordinates = ol.proj.transform(e.coordinate, "EPSG:3857", "EPSG:4326");
  const point = {
    type: "Point",
    coordinates
  };

  if (currentStep === "start") {

    startLayer.setSource(
        new ol.source.Vector({
          features: geojson.readFeatures(point)
        })
    );
    startCoords = coordinates;

    // clear endCoords and route if they were already set
    if (endCoords) {
      endCoords = null;
      endLayer.getSource().clear();

      routeLayer.getSource().clear();

    }
    currentStep = "end";
  } else {

    endLayer.setSource(
        new ol.source.Vector({
          features: geojson.readFeatures(point)
        })
    );
    endCoords = coordinates;
    currentStep = "start";

    updateRoute(startCoords, endCoords);
  }
});

function addRouteLayer() {
  routeLayer = new ol.layer.Vector({
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({ color: "hsl(205, 100%, 50%)", width: 4, opacity: 0.6 })
    })
  });

  map.addLayer(routeLayer);
}




const basemapId = "arcgis/navigation";
const basemapURL = `https://basemapstyles-api.arcgis.com/arcgis/rest/services/styles/v2/styles/${basemapId}?token=${apiKey}`;

olms.apply(map, basemapURL)
    .then(function (map) {
      addCircleLayers();
      addRouteLayer();
    });
</script>

<style>
html,
body,
#map {
    padding: 0;
    margin: 0;
    height: 100%;
    width: 100%;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 14px;
    color: #323232;
}
</style>
