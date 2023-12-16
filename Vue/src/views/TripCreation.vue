<template>
  <ol-map style="height: 800px">
    <ol-view ref="view" :center="center" :zoom="zoom" />
    <ol-layer-group :opacity="0.4">

      <ol-tile-layer>
        <ol-source-osm />
      </ol-tile-layer>

      <ol-tile-layer>
        <ol-source-tile-json :url="url" crossOrigin="anonymous" ref="tile" />
        <ol-interaction-pointer @click="addMarker" />
      </ol-tile-layer>

      <ol-layer-vector>
        <ol-source-vector :features="markers" />
      </ol-layer-vector>

    </ol-layer-group>
  </ol-map>


  <div>
    <div class="info-panel">
      <h2>Trip Name</h2>
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
import { ref } from "vue";
import markerIcon from "../assets/output-onlinepngtools.png"
import {Icon, Style} from "ol/style";
import {Point} from "ol/geom";
import {Feature} from "ol";

const center = ref([54.1966794, 31.8797732])
const zoom = ref(6)
const url = "https://a.tile.openstreetmap.org/4/6/6.png";

const markers = ref([])

const addMarker = (event) => {
  const coordinates = event.coordinate;
  const marker = new Feature({
    geometry: new Point(coordinates),
    name: 'Marker',
  });
  marker.setStyle(new Style({
    image: new Icon({
      src: markerIcon,
      scale: 2,
    }),
  }));
  markers.value.push(marker);
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