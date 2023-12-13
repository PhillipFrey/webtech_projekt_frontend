<template>
  <div class="container">
    <h1>Welcome to our Trip Planner!</h1>
    <div class="description-box">
      <p class="description">
        Our trip planner offers you the opportunity to plan your journey, calculate routes from A to B, place markers on the map, and conveniently save your destinations! Start your journey by giving your trip a name
      </p>
    </div>
    <div class="start-journey">
      <div class="trip-name">
        <p>Your trip name is: {{ name }}</p>
        <input v-model="name" placeholder="Enter Trip name">
        <router-link to="/TripCreation">
          <button>Create Trip</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: ''
    };
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.description-box {
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  /* Box eingrenzen */
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

p.description {
  margin: 0;
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
  background-color: #4CAF50;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #45a049;
}
</style>
