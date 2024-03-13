

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>User Information</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-list>
        <ion-item>
          <ion-label>
            <p><strong>First Name:</strong> {{ user.firstname }}</p>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label>
            <p><strong>Last Name:</strong> {{ user.lastname }}</p>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label>
            <p><strong>Email:</strong> {{ user.email }}</p>
          </ion-label>
        </ion-item>
        <!-- Optionally display the password; usually not recommended for security reasons -->
        <ion-item>
          <ion-label>
            <p><strong>Password:</strong> {{ user.password }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel } from '@ionic/vue';
import { useRoute } from 'vue-router';
import axios from "axios";
import { onMounted } from 'vue';

onMounted(() => {
  fetchUserSettings();
});

const route = useRoute();

const user = ref({
  email: '',
  password: '',
  firstname: '',
  lastname: ''
})

// Example function to fetch user settings (replace with actual API call)
async function fetchUserSettings() {
  try {
    const response = await axios.get("http://localhost:8080/api/v1/user/settings");
    console.log(response.data);
    user.value.email = response.data.email;
    user.value.password = response.data.password;
    user.value.firstname = response.data.firstname;
    user.value.lastname = response.data.lastname;
  } catch (error) {
    console.error("Failed to fetch user settings:", error);
  }
}
</script>

<style scoped>

</style>