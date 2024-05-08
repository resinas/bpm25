<template>
  <ion-page>
    <HeaderBar :name="pageData.name" />

    <ion-content id="main-content" :fullscreen="true">
      <div class="ion-padding">
        <p>Hosted by: {{ pageData.host }}</p>
        <p>Location: {{ pageData.location }}</p>
        <p>Start Time: {{ formatDateTime(pageData.startTime) }}</p>
        <p>End Time: {{ formatDateTime(pageData.endTime) }}</p>
        <div v-html="pageData.content || 'No further information'"></div>
      </div>
    </ion-content>
  </ion-page>
</template>



<script setup>
import { IonPage, IonContent } from '@ionic/vue';
import HeaderBar from "@/components/HeaderBar.vue";
import { useRoute } from 'vue-router';
import { onMounted, reactive } from 'vue';
import axios from 'axios';

const route = useRoute();
const pageData = reactive({
  name: '', // Session name for the header
  host: '',
  location: '',
  startTime: '',
  endTime: '',
  content: '' // Session content
});

const token = localStorage.getItem("accessToken")

// Function to format date and time strings
const formatDateTime = (dateTimeString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateTimeString).toLocaleString('en-US', options);
}

onMounted(async () => {
  try {
    const response = await axios.get(`https://localhost:8080/api/v1/agenda/session/${route.params.id}`, { headers: { Authorization: `Bearer ${token}` } });
    Object.assign(pageData, response.data);
  } catch (error) {
    console.error('Failed to fetch session data', error);
    // Handle error appropriately
  }
});
</script>

