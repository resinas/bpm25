<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>{{ name }}</ion-title>
      <div
          v-if="name != 'Home'"
          slot="start"
          id="logo" />

      <ion-buttons slot="end" v-if="name == 'Home'">
        <ion-menu-button></ion-menu-button>
      </ion-buttons>
      <ion-buttons v-if="name == 'Gallery' || name== 'My Gallery'" slot="end" id="click-trigger" class="gallery-dropdown">
        <ion-icon :icon="ellipsisVertical" style="font-size: 26px;"></ion-icon>
      </ion-buttons>
      <ion-popover trigger="click-trigger" trigger-action="click">
        <slot></slot>
      </ion-popover>
    </ion-toolbar>
  </ion-header>
  <SettingsMenu />
</template>

<script setup lang="ts">
import {IonButtons, IonHeader, IonMenuButton, IonTitle, IonToolbar, IonPopover, IonIcon} from "@ionic/vue";
import SettingsMenu from "@/components/SettingsMenu.vue";
import { ellipsisVertical } from 'ionicons/icons';

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
  margin-left: 8px;
  margin-top: 4px;
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
.gallery-dropdown {
  margin-right: 15px;
  color: #3880ff
}

</style>