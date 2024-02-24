<template>
  <div class="container">
    <div class="header">
      <div class="logo">
        <img src="../assets/Logo.png" alt="CompanyLogo" />
        <h1 class="heading">TripPlaner</h1>
      </div>
    </div>
    <div class="description-box-wrapper">
      <div class="description-box">
        <img src="../assets/Logo.png" alt="CompanyLogo" class="logo-small" />
        <p class="description">
          We offer you the opportunity to plan your journey, calculate routes, place markers and conveniently save your destinations! Start with your first trip
        </p>
      </div>
    </div>
    <form @submit.prevent="submitTrip" class="create-trip-form">
      <div class="trip-name">
        <input v-model="tripName" placeholder="Enter Trip name">
        <button type="submit">Create Trip</button>
      </div>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
    <div>
      <table>
        <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="trip in trips" :key="trip.id">
          <td>{{ trip.id }}</td>
          <td>
            <div class="trip-name-container">
              <router-link :to="`/TripCreation/${trip.id}`">{{ trip.name }}</router-link>
              <span class="edit-icon" @click="openPopup(trip.id)">&#9881;</span>
              <div :id="'popup-' + trip.id" class="popup">
                <input v-model="editedTripNames[trip.id]" placeholder="Enter New Trip Name">
                <button @click="updateTripName(trip.id)">Update Trip Name</button>
                <button id="delete_button" @click="deleteTrip(trip.id)">Delete Trip</button>
              </div>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
  <h1 class="authors">Developed by Phillip Frey (https://github.com/PhillipFrey) and Alexander Bürklen (https://github.com/AlexBuerklenHTW)</h1>
</template>

<script>
import { ref, reactive, watchEffect } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

export default {
  setup() {
    const trips = ref([]);
    const tripName = ref('');
    const errorMessage = ref('');
    const router = useRouter();
    const editedTripNames = reactive({});
    const base_url_backend = import.meta.env.VITE_BACKEND_URL;

    watchEffect(() => {
      axios.get(base_url_backend + '/apiTrip/trips')
          .then((response) => {
            trips.value = response.data;
          });
    });

    function updateTripName(tripId) {
      const newTripName = editedTripNames[tripId].trim();
      if (newTripName === '') {
        return Swal.fire({
          title: 'Error!',
          text: 'Please enter a name for the trip',
          icon: 'error'
        });
      }
      const tripIndex = trips.value.findIndex((trip) => trip.id === tripId);
      if (tripIndex !== -1) {
        axios.post(base_url_backend + `/apiTrip/tripsName/${tripId}`, newTripName)
            .then(() => {
              trips.value[tripIndex].name = newTripName;
              closePopup(tripId);
              console.log(trips);
            })
            .catch((error) => {
              console.error('Error updating trip name:', error);
            });
      }
    }

    function closePopup(tripId) {
      const popup = document.getElementById(`popup-${tripId}`);
      if (popup) {
        popup.classList.remove('active');
      }
    }

    function openPopup(tripId) {
      const popup = document.getElementById(`popup-${tripId}`);
      if (popup) {
        if (popup.classList.contains('active')) {
          popup.classList.remove('active');
        } else {
          const popups = document.querySelectorAll('.popup');
          popups.forEach((popup) => {
            popup.classList.remove('active');
          });
          popup.classList.add('active');
        }
      }
    }

    function deleteTrip(tripId) {
      const tripIndex = trips.value.findIndex((trip) => trip.id === tripId);
      if (tripIndex !== -1) {
        try {
          axios.delete(base_url_backend + `/apiTrip/trips/${tripId}`);
          trips.value.splice(tripIndex,  1);
        } catch (error) {
          alert("Delete trip was not successful");
        }
        closePopup(tripId);
      }
    }

    // Function to create a new trip
    function submitTrip(event) {
      event.preventDefault();
      //regex = check if whitespace is in tripName.value
      if (tripName.value === '' || /^\s*$/) {
        return Swal.fire({
          title: 'Error!',
          text: 'Please enter a name for the trip',
          icon: 'error'
        });
      }

      axios.post(base_url_backend + '/apiTrip/trips', { name: tripName.value })
          .then((response) => {
            tripName.value = '';
            trips.value = [...trips.value, response.data];
            router.push(`/TripCreation/${response.data.id}`);
          })
          .catch((error) => {
            console.error('Error creating trip:', error);
          });
    }

    return {
      trips,
      tripName,
      errorMessage,
      router,
      editedTripNames,
      base_url_backend,
      updateTripName,
      closePopup,
      openPopup,
      deleteTrip,
      submitTrip
    };
  }
};
</script>

<style scoped>
body {
  background-color: #d90000;
  font-family: 'Arial', sans-serif;
}

header {
  text-align: center;
  margin-bottom: 20px;
}

.heading {
  font-family: monospace;
  font-size: 2.5rem;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
  color: #45a049;
}
.description-box-wrapper{
  padding-top: 10rem;
}
.description-box {
  background: linear-gradient(to bottom, #ffffff, #eeeeee);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border: 2px solid #ccc;
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
  max-width: 50%;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  font-family: monospace;
  font-size: 1.1rem;
  line-height: 1.6;
  color: #333;
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
}

.error-message {
  color: red;
  margin-bottom: 15px;
}

.create-trip-form {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
  margin-bottom: 20px;
}

.trip-name input {
  padding: 8px;
  margin-bottom: 0;
  margin-right: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 250px;
}

.create-trip-form button {
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  background-color: #45a049;
  color: white;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.create-trip-form button:hover {
  transform: scale(1.02);
}

table {
  font-family: monospace;
  background-color: white;
  width: 80%;
  margin-left: 200px;
  border-collapse: separate;
  border-spacing: 0;
  max-height: 200px;
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

table,
th,
td {
  border: none;
  padding: 15px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
  font-weight: bold;
}

td:last-child a {
  display: inline-block;
  color: #45a049;
  text-decoration: none;
  transition: color 0.3s ease;
}

td:last-child a:hover {
  color: #3e7939;
}

td:first-child {
  pointer-events: none;
}

.edit-icon {
  cursor: pointer;
  color: #45a049;
  margin-left: 5px;
  font-size: 1.5em;
}

#delete_button{
  background: #d90000;
}

.popup {
  display: none;
  position: absolute;
  background-color: #f2f2f2;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px;
  z-index: 999;
}

.popup.active {
  display: block;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  box-sizing: border-box;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  transition: background-color 0.3s ease;
}

.header .logo {
  display: flex;
  align-items: center;
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

.header a.active {
  color: #000000;
}

.container {
  background-color: #ffffff;
  margin-top: 60px;
  z-index: 1;
}

.trip-name {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: monospace;
}

.trip-name input {
  margin-bottom: 10px;
  font-family: monospace;
}

.logo-small {
  height: 100px;
  margin-right: 10px;
}

.description-box {
  display: flex;
  align-items: center;
}

.authors{
  font-family: monospace;
  font-size: 2.5rem;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
}
</style>
