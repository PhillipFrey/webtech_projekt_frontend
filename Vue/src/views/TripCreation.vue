<template>

  <div class="map-container">
    <div class="map">


      <l-map ref="map" v-model:zoom="zoom" v-model:center="center" :useGlobalLeaflet="false">

        <l-tile-layer url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                      layer-type="base"
                      name="Stadia Maps Basemap">
        </l-tile-layer>

        <l-marker :lat-lng="markerLatLng"></l-marker>

        <l-control-layers position="topright"></l-control-layers>
        <l-tile-layer
            v-for="tileProvider in tileProviders"
            :key="tileProvider.name"
            :name="tileProvider.name"
            :visible="tileProvider.visible"
            :url="tileProvider.url"
            :attribution="tileProvider.attribution"
            layer-type="base"/>

      </l-map>


    </div>
    <div class="info-panel">
      <h2>Trip Name</h2>
      <p>{{ tripName }}</p>
      <div class="info-box">
        <h3>Marker</h3>
      </div>
      <div class="info-box">
        <h3>Orte</h3>
      </div>
      <div class="info-box">
        <h3>Gesamtdistanz</h3>
      </div>
    </div>
  </div>
</template>

<script setup>

let markerLatLng = ref([52.5200, 13.4050]);

import "leaflet/dist/leaflet.css"
import {LMap, LTileLayer, LMarker, LControlLayers} from "@vue-leaflet/vue-leaflet"
import { ref } from "vue";

let zoom = ref(6)
let center = ref([52.5200, 13.4050]);
let tripName = ref('My Trip')

</script>



<style scoped>
/* Stile für das Layout */
.map-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

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
</style>