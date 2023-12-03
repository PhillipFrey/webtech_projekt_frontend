import axios from 'axios';

<template>
  <div class="container">
    <h1 class="title">Frontend/Backend Connection</h1>
    <form @submit.prevent="getData" class="form">
      <div class="form-group">
        <label for="nameField" class="label">name:</label>
        <input type="text" id="landField" v-model="nameField" class="input">
      </div>

      <div class="form-group">
        <label for="ttField" class="label">total distance:</label>
        <input type="text" id="hauptstadtField" v-model="ttField" class="input">
      </div>

      <button type="submit" class="button">get Data</button>
    </form>
  </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  data() {
    return {
      nameField: '',
      ttField: '',
    };
  },
  methods: {
    async getData() {
      try {
        const endpoint = 'http://localhost:8080/'; // der Endpunkt, an den die Daten gesendet werden
        const data = {
          name: this.nameField, // Initialisiert eine Variable für das Land-Eingabefeld
          tt: this.ttField // Initialisiert eine Variable für das Hauptstadt-Eingabefeld
        };
        // Hier wird die POST-Anfrage an das Backend gesendet, um die Daten zu speichern
        const response = await axios.post(endpoint, data);
        console.log('Data saved:', response.data);

      } catch (error) { // Fallls ein Fehler aufkommt, wird dieser in der konsole über den catch block behandelt
        console.error('Error saving data:', error);
      }
    },
  },
});
</script>

<style scoped>
.container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
}

.form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

.label {
  font-weight: bold;
}

.input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.button {
  width: 100%;
  padding: 10px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #2980b9;
}
</style>
