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
          <!-- Bereich für den Trip-Namen -->
          <input v-model="tripName" placeholder="Enter Trip name">
          <button type="submit">Create Trip</button>
        </div>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <!-- Fehlermeldung, die angezeigt wird, wenn ein Fehler auftritt -->
      </form>
    </div>
    <table>
      <!-- Eine Tabelle für die Trip-Namen und IDs -->
      <thead>
      <!-- Der Kopf der Tabelle -->
      <tr>
        <!-- Tabellenüberschriften -->
        <th>ID</th>
        <th>Name</th>
      </tr>
      </thead>
      <tbody>
      <!-- Der Hauptinhalt der Tabelle -->
      <!-- Eine Schleife, die über alle Trips iteriert und eine Zeile für jeden Trip erstellt -->
      <tr v-for="trip in trips" :key="trip.id">

        <!-- Einträge für jede Trip-ID und Trip-Namen -->
        <td>{{ trip.id }}</td>
        <td>
          <!-- Ein Container für den Trip-Namen mit Bearbeitungsfunktion -->
          <div class="trip-name-container">
            <span>{{ trip.name }}</span>
            <!--Icon zum Bearbeiten des Trip-Namens -->
            <span class="edit-icon" @click="openPopup(trip.id)">&#9881;</span>
            <!-- Popup für die Bearbeitung des Trip-Namens -->
            <div :id="'popup-' + trip.id" class="popup">
              <input v-model="editedTripNames[trip.id]" placeholder="Enter New Trip Name">
              <!-- Ein Eingabefeld für den neuen Trip-Namen -->
              <button @click="updateTripName(trip.id)">Update Trip Name</button>
              <!-- Ein Button, um den Trip-Namen zu aktualisieren -->
            </div>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { Ref, ref } from 'vue';
import { useRouter } from 'vue-router';

// Definition eines Typs für einen Trip der erstellt wird
type Trip = {
  id: string;
  name: string;
}

//reaktive Variablen
let trips: Ref<Trip[]> = ref([]);
let tripName: Ref<string> = ref('');
let errorMessage: Ref<string> = ref('');
let router = useRouter();
let editedTripNames: Record<string, string> = {};


// ruft eine Liste von Trips ab, welche vom Server gezogen werden (GetRequest)
axios
    .get('http://localhost:8080/apiTrip/trips')
    .then((response) => {
      trips.value = response.data;
    });

// Funktion, um ein Popup für die Bearbeitung eines Trip-Namens zu öffnen
function openPopup(tripId: string) {
  if (!editedTripNames[tripId]) {
    editedTripNames[tripId] = '';
  }
  const popup = document.getElementById(`popup-${tripId}`);
  if (popup) {
    popup.classList.add('active'); //'active' zeigt das PopUp an
  }
}

// Funktion zum Aktualisieren des Trip-Namens
function updateTripName(tripId: string) {
  const newTripName = editedTripNames[tripId].trim();
  if (newTripName === '') {
    return;
  }
  const tripIndex = trips.value.findIndex((trip) => trip.id === tripId);
  if (tripIndex !== -1) {
    trips.value[tripIndex].name = newTripName;

    //Active Befehl nochmal besprechen, PopUp lässt sich nämlich nicht schließen
    //aktualisiert den TripNamen auf dem Server
    axios
        .patch(`http://localhost:8080/apiTrip/trips/${tripId}`, { name: newTripName })
        .then(() => {
          const popup = document.getElementById(`popup-${tripId}`);
          if (popup) {
            popup.classList.remove('active'); // Entfernt die 'active'-Klasse, um das Popup zu schließen
          }
        })
        .catch((error) => {
          console.error('Error updating trip name:', error);
        });
  }
}


//Evtl. muss hier die
// Funktion zum Erstellen eines neuen Trips
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
        console.error('Error creating trip:', error);
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

/* Stil für das Bearbeitungssymbol */
.edit-icon {
  cursor: pointer;
  color: #45a049;
  margin-left: 5px;
}

/* Stil für das Popup-Fenster */
.popup {
  display: none;
  position: absolute;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 10px;
  z-index: 999;
}

.popup.active {
  display: block;
}
</style>
