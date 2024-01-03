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
      <h2>
        <div>Trip Name</div>
        <button @click="calculateRoute" class="calculate-route-button">Calculate Route</button>
      </h2>

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
        <div v-if="markers.length < 2" >Total Length in Kilometers: 0</div>
        <div v-else> Total Length in Kilometers: {{ totalLength }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import markerIcon from "../assets/output-onlinepngtools.png"
import {onMounted, ref} from "vue";
import axios from 'axios';
import {useRoute} from 'vue-router';
import {GeoJSON} from 'ol/format';
import {arcgisToGeoJSON} from "@terraformer/arcgis"


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
    const routeFeatureRef = ref([]);
    const vectors = ref([]);
    const trips = ref([])
    let totalLength = ref(0);

    //load data from database, based on the id in the url
    onMounted(async () => {
      let path = window.location.pathname;
      let id = path.substring(path.lastIndexOf('/') + 1);
      await axios.get(`http://localhost:8080/apiTrip/trips/${id}`)
          .then((response) => {
            trips.value = response.data;
            for(let dataFromDb of trips.value.markers){
              const newMarker = {
                id: dataFromDb.id, // Use the id from the database
                name: `Marker ${markers.value.length + 1}`,
                latitude: dataFromDb.lat, // Use the latitude from the database
                longitude: dataFromDb.lng, // Use the longitude from the database
              };
              markers.value.push(newMarker);
            }
            totalLength.value = trips.value.totalDistance
          })
      console.log(trips)
      console.log(markers)
    })

    const drawstart = async (event) => {

      // vectors.value.source.addFeatures(event)
      setTimeout(() => {
        for(let feature of vectors.value.source.getFeatures()){
          markerFeatures.value.push(feature)
          markerFeatures.value.splice(0,1)
      }}, 0);

      const markerCoordinates = event.feature.getGeometry().getCoordinates();
      markerCoordinates.value = {
        latitude: markerCoordinates[0],
        longitude: markerCoordinates[1],
      };

      const newMarker = {
        id: markersId.value.length + 1, // Assign a unique ID
        name: `Marker ${markers.value.length + 1}`,
        latitude: markerCoordinates.value.latitude,
        longitude: markerCoordinates.value.longitude,
      };

      markerFeatures.value.push(vectors.value.source.addFeatures(event))
      markers.value.push(newMarker);

      const sendCoordinates = async () => {
        const response = await axios.post(`http://localhost:8080/apiMarker/markers?tripId=${tripId}`, {
          lat: markerCoordinates.value.latitude,
          lng: markerCoordinates.value.longitude,
          tripId: tripId
        });
        markersId.value.push(response.data.id);
      };

      await sendCoordinates();
    };

    const calculateRoute = async () => {
      if (markers.value.length >= 2) {
        await fetchRouteData();
      } else {
        alert("Please add at least two markers to calculate the route.");
      }
    };

    const fetchRouteData = async () => {
      await clearRoutes()
      const apiKey = "api_key"; // Replace with your actual API key
      const stops = markers.value.map(marker => `${marker.latitude},${marker.longitude}`).join(';');

      try {
        const response = await axios.get(`https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve?f=json&token=${apiKey}&stops=${stops}`);

        const routeData = response.data;

        let routeDistance = routeData.directions[0].summary.totalLength;

        routeDistance = Math.round(routeDistance * 100)/100;

        totalLength.value = routeDistance

        await saveTotalDistance(routeDistance)

        const geoJsonRoutes = arcgisToGeoJSON(routeData.routes);

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

    const saveTotalDistance = async(totalDistance) => {
      let path = window.location.pathname;
      let id = path.substring(path.lastIndexOf('/') + 1);
      try {
        await axios
            .post(`http://localhost:8080/apiTrip/trips/${id}`, totalDistance, {
              headers: {
                'Content-Type': 'application/json'
              }
            })
            .then(() => {
              totalDistance = 0;
            });
      } catch (error) {
        console.error('Error saving total distance: ', error);
      }
    }

    const deleteMarker = async (key) => {
      await clearRoutes()
      console.log(markers)

      const markerId = markersId.value[key];
      markers.value.splice(key,1);
      markersId.value.splice(key, 1);
      vectors.value.source.removeFeature(markerFeatures.value[key])
      markerFeatures.value.splice(key, 1)

      try {
        await axios.delete(`http://localhost:8080/apiMarker/markers/${markerId}`);
      } catch (error) {
        console.error('Error deleting marker:', error);
      }
    };

    console.log(markers)


    const clearRoutes = async () => {

      if (routeFeatureRef.value) {
        routeFeatureRef.value.forEach(feature => {
          vectors.value.source.removeFeature(feature);
        });

        routeFeatureRef.value = [];
      }

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
      deleteMarker,
      calculateRoute,
      totalLength
    }
  },
}
</script>



<style scoped>

.calculate-route-button {
  margin-left: 10px;
  cursor: pointer;
}
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