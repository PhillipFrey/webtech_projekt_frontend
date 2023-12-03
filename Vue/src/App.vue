<template>
  <div id="app">

    <!-- Aufruf der HelloWorld-Komponente -->
    <HomeView/>

  </div>
</template>

<script>
import HomeView from "@/views/HomeView.vue";

export default {
  name: 'App',
  components: {
    HomeView
  }
}
</script>

<style>

</style>
