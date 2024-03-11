<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>{{ name }}</ion-title>
      <div
          v-if="name != 'Home'"
          slot="end"
          id="logo" />
      <ion-buttons slot="end" v-if="name == 'Home'">
        <ion-menu-button></ion-menu-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <SettingsMenu />
</template>

<script setup lang="ts">
import {IonButtons, IonHeader, IonMenuButton, IonTitle, IonToolbar} from "@ionic/vue";
import SettingsMenu from "@/components/SettingsMenu.vue";

defineProps({
  name: String,
});
</script>

<style scoped>
#logo {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: right;
  height: 30px;
  width: 100px;
  margin-right: 10px;
}
@media (prefers-color-scheme: light) {
  #logo {
    background-image: url("@/assets/images/icpm-logo-1.png");
  }
}
@media (prefers-color-scheme: dark) {
  #logo {
    background-image: url("@/assets/images/icpm-logo-2.png");
  }
}
</style>