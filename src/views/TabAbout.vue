<template>
  <ion-page>
    <HeaderBar name="About this app" />

    <ion-content id="main-content" :fullscreen="true">
      <div class="ion-padding">
        <p>This application has been developed at the Technical University of Denmark (DTU) ...</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="js">
import {IonPage, IonContent} from '@ionic/vue';
import HeaderBar from "@/components/HeaderBar.vue";
</script>
