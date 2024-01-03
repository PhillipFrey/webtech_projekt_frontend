<template>
  <div class="container">
    <header>
      <h1>Welcome to our Trip Planner!</h1>
    </header>
    <div class="description-box">
      <p class="description">
        Our trip planner offers you the opportunity to plan your journey, calculate routes from A to B, place markers on the map, and conveniently save your destinations! Start your journey by giving your trip a name
      </p>
    </div>
    <div class="start-journey">
      <form @submit.prevent="submitTrip">
        <div class="trip-name">
          <input v-model="tripName" placeholder="Enter Trip name">
          <button type="submit">Create Trip</button>
        </div>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>
    </div>
    <table>
      <tr>
        <th>ID</th>
        <th>Name</th>
      </tr>
      <tr v-for="trip in trips.values()" :key="trip.id">
        <td>{{ trip.id }}</td>
        <td><a :href="`/TripCreation/${trip.id}`">{{ trip.name }}</a></td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { Ref, ref } from 'vue';
import { useRouter } from 'vue-router';

type Trip = {
  id: string;
  name: string;
}

let trips: Ref<Trip[]> = ref([]);
let tripName: Ref<string> = ref('');
let errorMessage: Ref<string> = ref('');
let router = useRouter();

axios
    .get('http://localhost:8080/apiTrip/trips')
    .then((response) => {
      trips.value = response.data;
    });

function submitTrip(event: Event) {
  event.preventDefault();

  if (tripName.value === '') {
    return errorMessage.value = 'Please provide a name to create a trip';
  }

  axios
      .post('http://localhost:8080/apiTrip/trips', { name: tripName.value })
      .then((response) => {
        tripName.value = '';
        trips.value = [...trips.value, response.data];
        router.push(`/TripCreation/${response.data.id}`);
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
}
</script>

<style scoped>
body {
  background-color: #ffffff;
  font-family: 'Arial', sans-serif;
}

header {
  text-align: center;
  margin-bottom: 20px;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #000000;
}

.description-box {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

p.description {
  margin: 0;
  color: #000000;
}

input {
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 250px;
}

button {
  padding: 10px 10px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  background-color:  #45a049;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #45a049;
}

.error-message {
  color: red;
  margin-bottom: 15px;
}

table {
  width: 80%;
  border-collapse: separate;
  border-spacing: 0;
  max-height: 200px;
  overflow-y: auto;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  margin: 20px auto;
}

th, td {
  border: none;
  padding: 15px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
  font-weight: bold;
}

tr:nth-child(even) {
  background-color: #fafafa;
}

td:last-child a {
  display: inline-block;
  color:  #45a049;
  text-decoration: none;
  transition: color 0.3s ease;
}

td:last-child a:hover {
  color: #3e7939;
}

td:first-child {
  pointer-events: none;
}
</style>
