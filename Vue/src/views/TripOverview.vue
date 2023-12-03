<script setup lang="ts">
import axios from 'axios';
import { Ref, ref } from 'vue';
type Trip = {
  id: string;
  name: string;
  totalDistance: bigint;
}
let trips: Ref<Trip[]> = ref([]);
axios
    .get('http://localhost:8080/apiTrip/trips')
    .then((response) => {
      trips.value = response.data;
    });

</script>

<template>
  <table>
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Total Distance</th>

    </tr>
    <tr v-for="trip in trips.values()" :key="trip.id">
      <td>{{ trip.id }}</td>1
      <td>{{ trip.name }}</td>
      <td>{{ trip.totalDistance}}</td>
    </tr>
  </table>

</template>

<style scoped>
table, th, td {
  border: 1px solid;
}
</style>