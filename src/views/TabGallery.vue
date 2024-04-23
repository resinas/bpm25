<template>
  <ion-page>
    <HeaderBar name="Gallery" />
    <ion-content :fullscreen="true">
      <ion-grid>
        <ion-row>
        </ion-row>
      </ion-grid>

      <ion-fab vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button @click="takePhotoGallery()">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>


  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonIcon, IonGrid, IonRow, IonCol, IonImg } from '@ionic/vue';
import { add } from 'ionicons/icons';
import { usePhotoGallery, UserPhoto } from '@/composables/usePhotoGallery';
import HeaderBar from "@/components/HeaderBar.vue";

const { takePhotoGallery } = usePhotoGallery();

</script>
