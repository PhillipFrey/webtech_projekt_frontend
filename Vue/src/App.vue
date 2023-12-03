<template>
  <div id="app">

    <!-- Aufruf der HelloWorld-Komponente -->
    <hello-world/>

  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style>

</style>
