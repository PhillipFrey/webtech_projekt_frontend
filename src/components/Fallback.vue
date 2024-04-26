<template>
  <div>
    <h1>Oops! Something went wrong.</h1>
    <p>Please try again later or return to the Welcome Page.</p>
    <button @click="router.replace({name: 'welcomePage'})">Redirect to Welcome Page</button>
  </div>
</template>

<script setup>
// eslint-disable-next-line no-unused-vars
import welcomePage from "@/views/WelcomePage.vue";
import {useRouter} from "vue-router";
const router = useRouter()
</script>

<style scoped>

h1 {
  font-size: 5rem;
}

p{
  font-size: 2rem;
}

button {
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  background-color: #45a049;
  color: white;
  cursor: pointer;
  transition: transform 0.3s ease;
}

button:hover {
  transform: scale(1.02);
}
</style>