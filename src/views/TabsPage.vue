<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/tabs/home">
          <ion-icon aria-hidden="true" :icon="home" />
          <ion-label>Home</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="calendar" href="/tabs/calendar">
          <ion-icon aria-hidden="true" :icon="calendar" />
          <ion-label>Agenda</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="attendees" href="/tabs/attendees">
          <ion-icon aria-hidden="true" :icon="people" />
          <ion-label>Attendees</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="images" href="/tabs/images">
          <ion-icon aria-hidden="true" :icon="images" />
          <ion-label>Gallery</ion-label>
          <ion-badge color="danger">6</ion-badge>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet, IonBadge } from '@ionic/vue';
import { home, calendar, people, images } from 'ionicons/icons';
</script>
