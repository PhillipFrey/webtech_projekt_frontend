<template>
  <div class="container">
    <div class="header">
      <div class="logo">
        <img src="../assets/Logo.png" alt="CompanyLogo" />
        <h1>TripPlaner</h1>
      </div>
    </div>
    <ol-map :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" style="height:700px">
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
      </ol-vector-layer>
      <ol-vector-layer>
        <ol-source-vector>
          <ol-feature v-for="(marker, index) in markers" :key="index">
            <ol-geom-point :coordinates="[marker.latitude, marker.longitude]"></ol-geom-point>
            <ol-style>
              <ol-style-icon
                  :src="markerIcon"
                  :scale="0.025"
                  :anchor="[0.5, 0.85]"
              ></ol-style-icon>
              <ol-style-text :offsetY="-35" :text="marker.name"></ol-style-text>
            </ol-style>
          </ol-feature>
        </ol-source-vector>
      </ol-vector-layer>
    </ol-map>
    <div class="header-container">
      <div id="loader" class="loader"></div>
      <h2>
        <div class="TripName">{{ tripName }}</div>
      </h2>
    </div>
    <div class="notification">{{ notification }}</div>
    <div class="calculate-route-button" @click="calculateRoute">Calculate Route </div>
    <div class="info-box">
      <h3>Marker</h3>
      <ul>
        <li v-for="(marker, index) in markers" :key="index">
          <h4>{{ marker.name }}</h4>
          <p>Latitude: {{ marker.latitude }}, Longitude: {{ marker.longitude }}</p>
          <button id="deleteButton" @click="deleteMarker(marker)">Delete</button>
        </li>
      </ul>
    </div>
    <div class="info-box">
      <h3>Total distance</h3>
      <div v-if="markers.length < 2">Total Length in Kilometers: 0</div>
      <div v-else>Total Length in Kilometers: {{ totalLength }}</div>
    </div>
  </div>
</template>

<script>
import markerIcon from "../assets/markerIcon.png"
import {onMounted, ref} from "vue";
import axios from 'axios';
import {useRoute, useRouter} from 'vue-router';
import {GeoJSON} from 'ol/format';
import {arcgisToGeoJSON} from "@terraformer/arcgis"
import Swal from 'sweetalert2'


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
    const tripName = ref("");
    const notification = ref('');
    const base_url_backend = import.meta.env.VITE_BACKEND_URL;
    const router = useRouter()

    const getMarkerData = async () => {
      let path = window.location.pathname;
      let id = path.substring(path.lastIndexOf('/') + 1);
      await axios.get(base_url_backend + `/apiTrip/trips/${id}`)
          .then((response) => { trips.value = response.data })
          .catch(function (error){
            if(error.response){
              router.replace({name: 'fallbackBase'})
            }
          })}

    onMounted(async () => {
      vectors.value.source.clear();
      await getMarkerData();
      for(let dataFromDb of trips.value.markers){
        const newMarker = {
          id: dataFromDb.id,
          name: `Marker ${markers.value.length + 1}`,
          latitude: dataFromDb.lat,
          longitude: dataFromDb.lng,
        };
        markers.value.push(newMarker);
        markersId.value.push(dataFromDb.id)
      }
      totalLength.value = trips.value.totalDistance
      tripName.value = trips.value.name
    })


    const renameMarkers = () => {
      markers.value.forEach((marker, index) => {
        marker.name = `Marker ${index + 1}`;
      });
    };

    const drawstart = async (event) => {
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

      const sendCoordinates = async () => {
        const response = await axios.post(base_url_backend + `/apiMarker/markers?tripId=${tripId}`, {
          lat: markerCoordinates.value.latitude,
          lng: markerCoordinates.value.longitude,
          tripId: tripId
        });
        markersId.value.push(response.data.id);
        const newMarker = {
          id: response.data.id,
          name: `Marker ${markers.value.length + 1}`,
          latitude: markerCoordinates.value.latitude,
          longitude: markerCoordinates.value.longitude,
        };
        markers.value.push(newMarker);
      };
      notification.value = 'Conditions have changed. Recalculate route to show new total distance';

      await sendCoordinates();
      vectors.value.source.clear();
    };

    const calculateRoute = async () => {
      if (markers.value.length >= 2) {
        document.getElementById('loader').style.display = 'block';
        notification.value = '';
        await fetchRouteData();
        document.getElementById('loader').style.display = 'none';
      } else {
        await Swal.fire({
          title: 'Error!',
          text: 'Please add at least two markers to calculate the route.',
          icon: 'error',
          confirmationButtonText: 'Cool'
        })
      }
    };

    const fetchRouteData = async () => {
      await clearRoutes()
      const apiKey = import.meta.env.VITE_API_KEY;
      const stops = markers.value.map(marker => `${marker.latitude},${marker.longitude}`).join(';');
      try {
        const response = await axios.get(`https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve?f=json&token=${apiKey}&stops=${stops}`);
        if (response.data.messages.some(message => message.code === -2147201018)) {
          await Swal.fire({
            title: 'Error!',
            text: 'Couldnt calculate route. Please try again :(',
            icon: 'error',
            confirmationButtonText: 'Cool'
          })
        }
        const routeData = response.data;
        let routeDistance = routeData.routes.features[0].attributes.Total_Kilometers;
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
        await Swal.fire({
          title: 'Error!',
          text: 'Failed to fetch route data:', error,
          icon: 'error',
          confirmationButtonText: 'Cool'
        })
        document.getElementById('loader').style.display = 'none';
      }
    };

    const saveTotalDistance = async(totalDistance) => {
      let path = window.location.pathname;
      let id = path.substring(path.lastIndexOf('/') + 1);

      if(markers.value.length < 2){
        totalDistance = 0
      }
      try {
        await axios
            .post(base_url_backend + `/apiTrip/trips/${id}`, totalDistance, {
              headers: {
                'Content-Type': 'application/json'
              }
            })
        } catch (error) {
          console.error('Error saving total distance: ', error);
        }
    }

    const deleteMarker = async (marker) => {
      vectors.value.source.clear();
      await clearRoutes();
      const index = markers.value.findIndex(m => m.id === marker.id);
      if (index !== -1) {
        markers.value.splice(index, 1);
        vectors.value.source.removeFeature(markerFeatures.value[index]);
      }
      renameMarkers();
      try {
        await axios.delete(base_url_backend + `/apiMarker/markers/${marker.id}`);
      } catch (error) {
        console.error('Error deleting marker:', error);
      }
      await saveTotalDistance()
    };

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
      totalLength,
      tripName,
      notification
    }
  },
}
</script>

<style scoped>
.calculate-route-button {
  text-align: center;
  top: 10px;
  right: 10px;
  background-color: #45a049;
  color: #ffffff;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  z-index: 1;
}

h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #333;
  text-align: center;
}

.TripName{
  color: #1a1a1a;
  font-size: 2rem
}

p {
  margin: 0;
}
body{

  margin: 0;
  padding: 0;
}

.info-box {
  background: linear-gradient(to bottom, #ffffff, #d5d5d5);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border: 2px solid #ccc;
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
  max-width: 1800px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  z-index: 999
}

h3 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #45a049;
}

div {
  font-size: 1.2rem;
  color: rgba(0, 0, 0, 0.9);
}

div[v-cloak] {
  display: none;
}

div[v-cloak]:not() {
  display: block;
}

#deleteButton{
  padding: 12px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  background-color: #FF0000;
  color: white;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
}

#deleteButton:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
}

.loader {
  border: 16px solid #f3f3f3;
  border-top: 16px solid #3498db;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  display: none;
  margin-right: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.notification{
  color: #1a1a1a;
  font-size: 1.5rem;
  font-weight: bold;
}

.header .logo {
  display: flex;
  align-items: center;
}

.header {
  top: 0;
  left: 0;
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  box-sizing: border-box;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  transition: background-color 0.3s ease;
}

h1 {
  font-family: monospace;
  font-size: 2.5rem;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
  color: #45a049;
}

.header .logo img {
  height: 100px;
  margin-right: 10px;
}

.header a {
  color: #ffffff;
  text-align: center;
  text-decoration: none;
  margin-left: 10px;
}

.header a:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

html,body{
  padding: 0;
  margin: 0;
}
</style>