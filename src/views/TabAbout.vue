<template>
  <ion-page>
    <HeaderBar name="About this app" />

    <ion-content id="main-content" :fullscreen="true">
      <div class="ion-padding">
        <p>The original version of this application has been developed at the Technical University of Denmark (DTU) by Anders Fuglsang, Sigurd Valentin Flach de Neergaard during their BSc project entitled <em>"<a href="https://findit.dtu.dk/en/catalog/668f22de1713b1dc48f78e49" target="_blank">Development of web application with robustness guarantees</a>"</em>. The application has then been updated and extended by Andrea Burattin and Giovanni Meroni.</p>
        <p>For questions, please send an email to Andrea Burattin andbur@dtu.dk.</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="js">
import {IonPage, IonContent} from '@ionic/vue';
import HeaderBar from "@/components/HeaderBar.vue";
</script>
