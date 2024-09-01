<template>
  <ion-page>
    <HeaderBar name="Messages" @reloadPage="reloadPage" />
    <ion-content id="main-content" :fullscreen="true">
      <ion-list lines="full">
        <ion-item button v-for="message in messages" :key="message.id" @click="setVisibleMessage(message.id)">
          <ion-label>
            <h2>{{ message.title }}</h2>
            <p>By {{ message.author }}</p>
          </ion-label>
          <ion-note slot="end">{{ dayjs(message.date).fromNow() }}</ion-note>
        </ion-item>
      </ion-list>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed" class="custom-fab">
        <ion-fab-button>
          <ion-icon :icon="add" @click="openPostMessage()"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <ion-modal :is-open="isOpen">
        <ion-header>
          <ion-toolbar>
            <ion-title>Message</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeMessage()">Close</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <p style="font-size: .8em" class="ion-text-right">
            Message by: {{ activeMessage.author }}<br>
            Posted {{ dayjs(activeMessage.date).fromNow() }} ({{ dayjs(activeMessage.date).format('D MMM, HH:mm') }})
          </p>
          <h1>{{ activeMessage.title }}</h1>
          <p>{{ activeMessage.message }}</p>
        </ion-content>
      </ion-modal>

      <ion-modal :is-open="isOpenPost">
        <ion-header>
          <ion-toolbar>
            <ion-title>Post new message</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeMessage()">Cancel</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">

          <!-- Form Starts Here -->
          <form @submit.prevent="submitForm">
            <ion-item>
              <ion-input v-model="formData.title" type="text" required label="Title" label-placement="stacked"></ion-input>
            </ion-item>
            <ion-item>
              <ion-textarea v-model="formData.message" required rows="10" label="Message" label-placement="stacked"></ion-textarea>
            </ion-item>
            <ion-button expand="block" type="submit" class="ion-margin-top">Post Message</ion-button>
          </form>

        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="js">
import {
  IonPage,
  IonContent,
  IonButton,
  IonToolbar,
  IonHeader,
  IonTitle,
  IonButtons,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonModal,
  IonText, IonFab, IonIcon, IonFabButton, IonTextarea, IonInput
} from '@ionic/vue';
import { ref } from 'vue';
import HeaderBar from "@/components/HeaderBar.vue";
import { onMounted, reactive } from 'vue';
import axios from 'axios';
import {onBeforeRouteLeave} from "vue-router";
import {add} from "ionicons/icons";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);


const messages = reactive([]);
const token = localStorage.getItem("accessToken");
const isOpen = ref(false);
const isOpenPost = ref(false);
const activeMessage = {};
const formData = ref({
  title: '',
  message: ''
});

function setVisibleMessage(id) {
  this.activeMessage = messages.find(message => message.id === id);
  this.isOpen = true;
}

function openPostMessage() {
  this.isOpenPost = true;
}

function closeMessage() {
  this.isOpen = false;
  this.isOpenPost = false;
}

const reloadPage = async () => {
  await fetchAttendees();
}

const fetchAttendees = async () => {
  try {
    const response = await axios.get('https://localhost:8080/api/v1/message',{ headers: { Authorization: `Bearer ${token}` } });
    messages.splice(0, response.data.length, ...response.data);
  } catch (error) {
    console.error('Failed to fetch pages', error);
  }
};

onMounted(fetchAttendees);

</script>

<style scoped>

</style>
