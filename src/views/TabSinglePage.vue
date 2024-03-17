<template>
  <ion-page>
    <HeaderBar :name="pageData.title" />

    <ion-content id="main-content" :fullscreen="true">
      <div v-if = "pageData.layoutId === 1" class="ion-padding" v-html="pageData.content"></div>

      <ion-list v-else-if = "pageData.layoutId === 2">
        <ion-item v-for = "message in pageData.messages" :key="message.id">
          <ion-label>{{ message.content }}</ion-label>
        </ion-item>
      </ion-list>


    </ion-content>
  </ion-page>
</template>

<script setup lang="js">
import {IonPage, IonContent, IonList, IonItem, IonLabel} from '@ionic/vue';
import HeaderBar from "@/components/HeaderBar.vue";
import { useRoute } from 'vue-router';
import { onMounted, reactive } from 'vue';
import axios from 'axios';

const route = useRoute();
const pageData = reactive({title: '', content: '', layoutId: null });
const token = localStorage.getItem("accessToken")

onMounted(async () => {
  try {
    const response = await axios.get(`http://localhost:8080/api/v1/pages/${route.params.id}`,{ headers: { Authorization: `Bearer ${token}` } });
    Object.assign(pageData, response.data);
  } catch (error) {
    console.error('Failed to fetch page data', error);
    // Handle error appropriately
  }
});
</script>

