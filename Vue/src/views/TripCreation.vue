<template>
  <ol-map
      :loadTilesWhileAnimating="true"
      :loadTilesWhileInteracting="true"
      style="height: 400px"
  >
    <ol-view
        ref="view"
        :center="center"
        :rotation="rotation"
        :zoom="zoom"
        :projection="projection"
    />

    <ol-tile-layer>
      <ol-source-osm />
    </ol-tile-layer>
  </ol-map>


  <div>
    <div class="info-panel">
      <h2>Trip Name</h2>
<!--      <p>{{ tripName }}</p>-->
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

import {ref} from "vue";

const center = ref([40, 40]);
const projection = ref("EPSG:4326");
const zoom = ref(1);
const rotation = ref(0);


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