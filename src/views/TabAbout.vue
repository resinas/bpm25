<template>
  <ion-page>
    <HeaderBar name="About this app" />

    <ion-content id="main-content" :fullscreen="true">
      <div class="ion-padding">
        <p>This application has been developed at the Technical University of Denmark (DTU) by Anders Fuglsang, Sigurd Valentin Flach de Neergaard during their BSc project entitled <em>"<a href="https://findit.dtu.dk/en/catalog/668f22de1713b1dc48f78e49" target="_blank">Development of web application with robustness guarantees</a>"</em>.</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="js">
import {IonPage, IonContent} from '@ionic/vue';
import HeaderBar from "@/components/HeaderBar.vue";
</script>
