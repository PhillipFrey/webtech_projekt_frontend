<template>
  <div>
    <h1>Oops! Something went wrong.</h1>
    <p>Please try again later.</p>
    <button @click="router.replace({name: 'welcomePage'})">Redirect to Welcome Page</button>
  </div>
</template>

<script setup>
import welcomePage from "@/views/WelcomePage.vue";
import {useRouter} from "vue-router";
const router = useRouter()

</script>

<style scoped>

</style>