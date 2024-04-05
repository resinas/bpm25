<template>
  <ion-page>
    <HeaderBar :name="sessionDetails.value ? sessionDetails.value.session_name : 'Loading...'" />
    <ion-content>
      <div v-if="sessionDetails.value">
        <h2>{{ sessionDetails.value.session_name }}</h2>
        <p>Host: {{ sessionDetails.value.session_host }}</p>
        <p>Location: {{ sessionDetails.value.session_location }}</p>
        <!-- Add more session details here -->
      </div>
      <div v-else>
        <p>Loading session details...</p>
      </div>
    </ion-content>
  </ion-page>
</template>


<script setup>
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';

// Access the current route
const route = useRoute();

// Access the session ID from the route parameters
const sessionId = ref(route.params.id);
const sessionDetails = ref(null);

onMounted(async () => {
  if (sessionId.value) {
    // Simulate fetching session details. Replace this with your actual data fetching logic.
    sessionDetails.value = await fetchSessionDetails(sessionId.value);
    console.log(sessionDetails.value); // Just for demonstration.
  }
});

</script>

<style scoped>

</style>