<template>
  <ion-app>
    <OfflinePopup />
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import OfflinePopup from './components/OfflineComponent.vue';
</script>
