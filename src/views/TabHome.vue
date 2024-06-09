<template>
  <ion-page>
    <HeaderBar name="Home" />

    <ion-content id="main-content" :fullscreen="true">
      <img src="https://icpmconference.org/2024/wp-content/uploads/sites/9/2023/09/cph.jpg"  alt=""/>

      <ion-card>
        <ion-card-header>
          <div id="logo-large" />
          <ion-card-title>ICPM 2024</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          October 14-18, 2024<br>
          Technical University of Denmark<br>
          Kgs. Lyngby, Denmark
        </ion-card-content>
      </ion-card>
      <p class="ion-padding" style="font-size: 1.5rem; margin-bottom: 0">
        Pages
      </p>
      <ion-list lines="full">
        <ion-item button v-for="page in pages" :key="page.id" :routerLink="`/tabs/page/${page.id}`">
          <ion-label >{{ page.name }}</ion-label>
          <ion-badge v-if="page.label" color="danger">{{ page.label }}</ion-badge>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="js">
import {
  IonPage,
  IonContent,
  IonBadge,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  menuController
} from '@ionic/vue';
import HeaderBar from "@/components/HeaderBar.vue";
import { onMounted, reactive } from 'vue';
import axios from 'axios';
import {onBeforeRouteLeave} from "vue-router";

const pages = reactive([]);
const token = localStorage.getItem("accessToken")

const closeSettingsMenu = async () => {
  await menuController.close('settings-menu');
};

onBeforeRouteLeave((to, from) => {
  closeSettingsMenu();
});

onMounted(async () => {
  try {
    const response = await axios.get('https://localhost:8080/api/v1/pages',{ headers: { Authorization: `Bearer ${token}` } });
    pages.splice(0, pages.length, ...response.data.map(page => ({
      id: page.id,
      name: page.title,

    })));
  } catch (error) {
  console.error('Failed to fetch pages', error);
  }
});
</script>

<style scoped>
#logo-large {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  height: 50px;
  width: 100%;
  margin-bottom: 10px;
}
/* Light Mode */
body:not(.dark) #logo-large {
  background-image: url('@/assets/images/icpm-logo-1.png');
}

/* Dark Mode */
body.dark #logo-large {
  background-image: url('@/assets/images/icpm-logo-2.png');
}
</style>
