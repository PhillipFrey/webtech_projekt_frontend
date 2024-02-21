// Import CSS
import './assets/main.css';

// Import Vue and the main app component
import { createApp } from 'vue';
import App from './App.vue';

// Import the router
import router from './router';

// Import OpenLayersMap and its styles
import OpenLayersMap from 'vue3-openlayers';
import 'vue3-openlayers/styles.css';

// Create the Vue app instance
const app = createApp(App);

// Use the router and OpenLayersMap in the app
app.use(router);
app.use(OpenLayersMap);

// Mount the app to the DOM
app.mount('#app');
