<template>

  <div id="map"></div>

<!--  <div class="map-container">-->
<!--    <div class="map">-->


<!--      <l-map ref="map" v-model:zoom="zoom" v-model:center="center" :useGlobalLeaflet="false">-->

<!--        <l-tile-layer url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"-->
<!--                      layer-type="base"-->
<!--                      name="Stadia Maps Basemap">-->
<!--        </l-tile-layer>-->

<!--        <l-marker :lat-lng="markerLatLng"></l-marker>-->

<!--        <l-control-layers position="topright"></l-control-layers>-->
<!--        <l-tile-layer-->
<!--            v-for="tileProvider in tileProviders"-->
<!--            :key="tileProvider.name"-->
<!--            :name="tileProvider.name"-->
<!--            :visible="tileProvider.visible"-->
<!--            :url="tileProvider.url"-->
<!--            :attribution="tileProvider.attribution"-->
<!--            layer-type="base"/>-->

<!--      </l-map>-->


<!--    </div>-->
  <div>
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

<!--<script>-->

<!--// Map initialization-->
<!--var map = L.map('map').setView([52.5200, 13.4050], 13);-->

<!--// osm Layer-->
<!--var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {-->
<!--  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'-->
<!--});-->

<!--//osm.addTo(map);-->

<!--// OPVN Map-->
<!--var OPNVKarte = L.tileLayer('https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png', {-->
<!--  maxZoom: 18,-->
<!--  attribution: 'Map <a href="https://memomaps.de/">memomaps.de</a> <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'-->
<!--});-->
<!--// OPNVKarte.addTo(map)-->


<!--//GoogleMaps Ansichten-->
<!--googleSat = L.tileLayer('http://{s}.google.com/vt?lyrs=s&x={x}&y={y}&z={z}',{-->
<!--  maxZoom: 20,-->
<!--  subdomains:['mt0','mt1','mt2','mt3']-->
<!--});-->
<!--//googleSat.addTo(map);-->

<!--googleStreets = L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}',{-->
<!--  maxZoom: 20,-->
<!--  subdomains:['mt0','mt1','mt2','mt3']-->
<!--});-->

<!--googleStreets.addTo(map);-->



<!--//Marker mit PopUp-->
<!--var myIcon = L.icon({-->
<!--  iconUrl: 'markerIcon.png',-->
<!--  iconSize: [40, 40],-->

<!--});-->
<!--var singleMarker = L.marker([52.5200, 13.4050],{icon : myIcon, draggable: true});-->
<!--var popup = singleMarker.bindPopup('Hier sehen Sie das Zentrum von Berlin').openPopup()-->
<!--popup.addTo(map)-->

<!--//Layer controller listet alle unsere hinzugefügten Maps auf-->
<!--var baseMaps = {-->
<!--  "osm": osm,-->
<!--  'OPNVKarte': OPNVKarte,-->
<!--  'googleSat' : googleSat,-->
<!--  'googleStreets' : googleStreets-->
<!--};-->
<!--// bezieht sich auf unseren Marker, welcher aktiviert und deaktiviert werden kann-->
<!--var overlayMaps = {-->
<!--  "Marker": singleMarker-->
<!--};-->
<!--// fügt unsere LayerControl zur Map hinzu-->
<!--var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);-->
<!--// let markerLatLng = ref([52.5200, 13.4050]);-->
<!--//-->
<!--// import "leaflet/dist/leaflet.css"-->
<!--// import {LMap, LTileLayer, LMarker, LControlLayers} from "@vue-leaflet/vue-leaflet"-->
<!--// import { ref } from "vue";-->
<!--//-->
<!--// let zoom = ref(6)-->
<!--// let center = ref([52.5200, 13.4050]);-->
<!--// let tripName = ref('My Trip')-->

<!--</script>-->



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
body{

  margin: 0;
  padding: 0;
}



#map{
  width: 100%;
  height: 70vh;

}


/* Container Design für die Überschrift  */
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