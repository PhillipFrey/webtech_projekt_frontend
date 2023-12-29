<template>
  <div>
    <ol-map :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" style="height:800px">
      <ol-view ref="view" :center="center" :rotation="rotation" :zoom="zoom" :projection="projection"/>

      <ol-layer-group :opacity="0.4">
        <ol-tile-layer>
          <ol-source-osm/>
        </ol-tile-layer>

      </ol-layer-group>

      <ol-vector-layer>
        <ol-source-vector ref="vectors">
          <ol-interaction-draw @drawstart="drawstart" :type="drawType">
          </ol-interaction-draw>
        </ol-source-vector>

        <ol-style-stroke :color="ffcc33" :width="1000"/>
        <ol-style-fill :color="ffff00"/>
      </ol-vector-layer>

    </ol-map>

    <div class="info-panel">
      <h2>Trip Name</h2>
      <div class="info-box">
        <h3>Marker</h3>
        <ul>
          <li v-for="(marker, index) in markers" :key="index">
            <h4>{{ marker.name }}</h4>
            <p>Latitude: {{ marker.latitude }}, Longitude: {{ marker.longitude }}</p>
            <button @click="deleteMarker(index)">Delete</button>
          </li>
        </ul>
      </div>

      <div class="info-box">
        <h3>Gesamtdistanz</h3>
      </div>
    </div>
  </div>
</template>

<script>
import markerIcon from "../assets/output-onlinepngtools.png"
import {ref} from "vue";
import axios from 'axios';
import {Fill, Icon, Stroke, Style} from "ol/style";
import Text from "ol/style/Text";
import {Feature} from "ol";
import {Point} from "ol/geom";
import {useRoute} from 'vue-router';
import {GeoJSON} from 'ol/format';
import {arcgisToGeoJSON} from "@terraformer/arcgis"
import VectorSource from "ol/source/Vector";


export default {
  setup() {
    const route = useRoute();
    const tripId = route.params.id;
    const center = ref([13.563296821630995, 52.49659015553675])
    const projection = ref('EPSG:4326')
    const zoom = ref(6)
    const rotation = ref(0)
    const url = "https://a.tile.openstreetmap.org/4/6/6.png"
    const markerFeatures = ref([]);
    const markers = ref([]);
    const drawType = ref("Point")
    const markersId = ref([])
    const routeFeatureRef = ref(null);


    const drawedMarker = ref()
    const vectors = ref(null);

    const drawstart = async (event) => {
      drawedMarker.value = event.feature;

      const markerCoordinates = event.feature.getGeometry().getCoordinates();
      markerCoordinates.value = {
        latitude: markerCoordinates[0],
        longitude: markerCoordinates[1],
      };

      const newMarker = {
        name: `Marker ${markers.value.length + 1}`,
        latitude: markerCoordinates.value.latitude,
        longitude: markerCoordinates.value.longitude,
      };
      markers.value.push(newMarker);

      const markerFeature = new Feature(new Point([newMarker.latitude, newMarker.longitude]));

      markerFeature.setStyle(new Style({
        image: new Icon({
          src: markerIcon,
          scale: 1,
        }),
        text: new Text({
          text: newMarker.name,
          offsetY: -10,
          stroke: new Stroke({
            color: '#000',
          }),
          fill: new Fill({
            color: '#fff',
          }),
        }),
      }));
      vectors.value.source.addFeature(markerFeature);
      markerFeatures.value.push(markerFeature);


      const sendCoordinates = async () => {
        const response = await axios.post(`http://localhost:8080/apiMarker/markers?tripId=${tripId}`, {
          lat: markerCoordinates.value.latitude,
          lng: markerCoordinates.value.longitude,
          tripId: tripId
        });
        markersId.value.push(response.data.id);

      }

      await sendCoordinates();

      if (markers.value.length >= 2) {
        await fetchRouteData(markers.value);
      }

    }

    const fetchRouteData = async () => {
      const apiKey = "AAPK875c4cfc8ef74d53b6410c01faf21657owa1Pp6ZJaMO-dkfVRW0G7ulWeiWzVJ1nPPMavr9mLViODjBHA6n1sMboT-f9ezc"; // Replace with your actual API key
      // Convert markers to string format required by the API
      const stops = markers.value.map(marker => `${marker.latitude},${marker.longitude}`).join(';');

      try {
        const response = await axios.get(`https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve?f=json&token=${apiKey}&stops=${stops}`);

        const routeData = response.data;

        const geoJsonRoutes = arcgisToGeoJSON(routeData.routes);

        vectors.value.source = new VectorSource();

        const geoJsonFormat = new GeoJSON();
        routeFeatureRef.value = geoJsonFormat.readFeatures(geoJsonRoutes);


        if (vectors.value && vectors.value.source) {
          routeFeatureRef.value.forEach(feature => {
            vectors.value.source.addFeature(feature);
          });
        }

      } catch (error) {
        console.error('Failed to fetch route data:', error);
      }
    };


    const deleteMarker = async (key) => {
      const markerId = markersId.value[key];
      markersId.value.splice(key, 1);
      markers.value.splice(key, 1);

      // Get the corresponding markerFeature
      const markerFeatureToRemove = markerFeatures.value[key];

      // Remove the markerFeature from the vector source
      vectors.value.source.removeFeature(markerFeatureToRemove);

      // Remove the markerFeature from the markerFeatures array
      markerFeatures.value.splice(key, 1);

      await axios.delete(`http://localhost:8080/apiMarker/markers/${markerId}`);

      // Remove the route feature
      if (routeFeatureRef.value) {
        routeFeatureRef.value.forEach(feature => {
          vectors.value.source.removeFeature(feature);
        });
      }

      await fetchRouteData(markers.value);
    };



    return {
      vectors,
      drawstart,
      center,
      projection,
      zoom,
      rotation,
      markerIcon,
      markers,
      drawType,
      url,
      tripId,
      deleteMarker
    }
  },
}
</script>



<style scoped>
/* Stile für das Layout */
.map {
  grid-column: 1 / 2;
  height: 90vh;
}

.info-panel {
  grid-column: 2 / 3;
  display: flex;
  flex-direction: column;
}

/* Stile für die grauen Info-Boxen */
.info-box {
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

h3 {
  font-size: 1.2rem;
  margin-bottom: 5px;
}

p {
  margin: 0;
}
body{

  margin: 0;
  padding: 0;
}

#map{
  width: 100%;
  height: 70vh;

}


/* Container Design für die Überschrift */
.info-container {
  background-color: #f2f2f2;
  padding: 20px;
  text-align: center;
}

.content {
  max-width: 80%;
  margin: 0 auto;
}
</style>