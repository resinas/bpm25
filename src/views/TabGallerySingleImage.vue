<template>
  <ion-page>
    <HeaderBar name="" />
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/images"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ imagePath }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-img :src="image"></ion-img>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {IonPage, IonContent, IonImg, IonButtons, IonBackButton} from "@ionic/vue";
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import HeaderBar from "@/components/HeaderBar.vue";

const route = useRoute();
const image = ref('');
const imagePath = route.params.imageId as string;

onMounted(() => {
  image.value = getImageUrl(imagePath);
});

const getImageUrl = (filepath:string) => {
  return `http://localhost:8080/api/v1/gallery/image/${filepath}?format=jpg`;
};


</script>

<style scoped>

</style>