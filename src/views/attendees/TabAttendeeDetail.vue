<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Attendee Details</ion-title>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/home"></ion-back-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <!-- Avatar and Name -->
      <div class="profile-picture-container">
        <ion-avatar>
          <img :src="attendee.imageURL || 'https://ionicframework.com/docs/img/demos/avatar.svg'" alt="Profile picture" />
        </ion-avatar>
      </div>

      <!-- Personal Details -->
      <div class="personal-details">
        <h2>{{ attendee.firstname }} {{ attendee.lastname }}</h2>
        <p v-if="attendee.email">{{ attendee.email }}</p>
        <div class="work-country">
          <p v-if="attendee.company">{{ attendee.company }}</p>
          <p v-if="attendee.country">{{ attendee.country }}</p>
        </div>
      </div>

      <!-- Navigation Boxes -->
      <ion-card @click="goToPersonalizedAgenda">
        <ion-card-header>
          <ion-card-title>Personalized Agenda</ion-card-title>
        </ion-card-header>
      </ion-card>
      <ion-card @click="goToPersonalGallery">
        <ion-card-header>
          <ion-card-title>Personal Gallery</ion-card-title>
        </ion-card-header>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { reactive, onMounted} from 'vue';
import { useRouter, useRoute} from 'vue-router';
import axios from 'axios';
import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonAvatar } from '@ionic/vue';
import backend from "/backend.config.ts";


const router = useRouter();
const route = useRoute();
const attendeeId = route.params.id;
const token = localStorage.getItem("accessToken");

const attendee = reactive({
  firstname: '',
  lastname: '',
  company: '',
  country: '',
  email: '',
  imageURL: ''
});

async function fetchAttendeeDetails() {
  try {
    const response = await axios.get(backend.construct(`attendees/${attendeeId}`), {
      headers: {'Authorization': `Bearer ${token}`}
    });
    Object.assign(attendee, response.data);
    if (attendee.avatar_path) {
      attendee.imageURL = await getImage(attendee);
    }
  } catch (error) {
    console.error("Failed to fetch attendee details:", error);
  }
}

async function getImage(person) {
  try {
    const response = await axios.get(backend.construct(`account/getProfilePicture/${person.id}`), {
      headers: {'Authorization': `Bearer ${token}`},
      params: {
        format: 'webp'
      },
      responseType: 'blob'
    });
    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error("Error fetching image:", error);
    return 'https://ionicframework.com/docs/img/demos/avatar.svg';
  }
}

function goToPersonalizedAgenda() {
  router.push({ path: `/tabs/calendar/${attendeeId}` });
}


function goToPersonalGallery() {
  router.push({ path: `/tabs/images/${attendeeId}` });
}

onMounted(fetchAttendeeDetails);
</script>

<style scoped>
.profile-picture-container {
  margin-left: auto;
  margin-right: auto;
  align-items: center;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  width: 150px;
  height: 150px;
}

.profile-picture-container ion-avatar {
  width: 100%;
  height: 100%;
}

.profile-picture-container ion-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.personal-details {
  text-align: center;
  margin-bottom: 20px;
}

.personal-details h2 {
  margin: 10px 0;
}

.work-country {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  padding: 0 20px;
}

ion-card {
  cursor: pointer;
}

ion-card-header {
  text-align: center;
}
</style>
