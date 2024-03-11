<template>
  <ion-page>
    <HeaderBar name="Agenda" />

    <ion-toolbar>
      <ion-segment value="all" v-model="this.selectedDay">
        <ion-segment-button value="mon"><ion-label>Mon</ion-label></ion-segment-button>
        <ion-segment-button value="tue"><ion-label>Tue</ion-label></ion-segment-button>
        <ion-segment-button value="wed"><ion-label>Wed</ion-label></ion-segment-button>
        <ion-segment-button value="thu"><ion-label>Thu</ion-label></ion-segment-button>
        <ion-segment-button value="fri"><ion-label>Fri</ion-label></ion-segment-button>
      </ion-segment>
    </ion-toolbar>

    <ion-content id="main-content">
      <ion-list v-if="selectedDay">
        <ion-item-group v-for="(session, sindex) in sessions" v-bind:key="sindex">
          <ion-item-divider color="light" sticky>
            <ion-label>
              <h2>{{ session.time }}</h2>
              <p v-if="session.line2">{{ session.line2 }}</p>
              <p v-if="session.line3">{{ session.line3 }}</p>
            </ion-label>
          </ion-item-divider>
          <ion-item-sliding>
            <ion-item v-for="(subsession, index) in session.subsessions" v-bind:key="index">
              <ion-icon slot="end" v-if="subsession.icon == 'coffee'" :icon="icons.cafeOutline" />
              <ion-icon slot="end" v-if="subsession.icon == 'registration'" :icon="icons.idCardOutline" />
              <ion-icon slot="end" v-if="subsession.icon == 'lunch'" :icon="icons.fastFoodOutline" />
              <ion-icon slot="end" v-if="subsession.icon == 'alert'" :icon="icons.alertCircleOutline" />
              <ion-label>
                <h3 class="ion-text-wrap" v-html="subsession.name"></h3>
                <p class="ion-text-wrap" v-if="subsession.line2">{{ subsession.line2 }}</p>
                <p class="ion-text-wrap" v-if="subsession.line3">{{ subsession.line3 }}</p>
              </ion-label>
            </ion-item>
          </ion-item-sliding>
        </ion-item-group>
      </ion-list>
      <div v-else>
        <p class="ion-padding select-day">Select a day from the top to see the agenda.</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="js">
import {
  IonPage, IonToolbar, IonContent, IonList, IonItemGroup, IonItemSliding, IonItem, IonItemDivider, IonIcon, IonSegment,
  IonSegmentButton, IonLabel } from '@ionic/vue';
import * as icons from 'ionicons/icons'
import HeaderBar from "@/components/HeaderBar.vue";
</script>

<script lang="js">
export default {
  data() {
    return {
      selectedDay: null,
      sessions: [
        {
          time: '08:00',
          subsessions: [
            {name: 'Registration', line2: 'Building 116 - Foyer', icon: 'registration'},
          ]
        },
        {
          time: '09:00 - 10:30',
          subsessions: [
            {name: 'COMINDS', line2: 'Building 116 - Workshop Room 1'},
            {name: 'EdbA', line2: 'Building 116 - Workshop Room 2'},
            {name: 'EduPM', line2: 'Building 116 - Workshop Room 3'},
            {name: 'ML4PM', line2: 'Building 116 - Workshop Room 4'},
            {name: 'PODS4H', line2: 'Building 116 - Workshop Room 5'}
          ]
        },
        {
          time: '10:30 – 11:15',
          subsessions: [
            {name: 'Coffee break', line2: 'Building 116 - Foyer', icon: 'coffee'},
          ]
        },
        {
          time: '10:30 - 12:30',
          line2: 'Chair: Name Surname',
          line3: 'Building 116 - Main Auditorium',
          subsessions: [
            {name: '<strong>Keynote</strong><br>Everything there is to Know about Stochastically Known Logs', line2: 'Avi Gal', icon: 'alert'},
          ]
        },
        {
          time: '12:30 – 14:00',
          subsessions: [
            {name: 'Lunch', line2: '12:30 – 14:00', line3: 'Building 101 - Glass Salen', icon: 'lunch'},
          ]
        },
        {
          time: '14:00 - 15:30 - AI in Process Mining',
          line2: 'Session chair: Chiara Di Francescomarino',
          line3: 'Building 116 - Main Auditorium',
          subsessions: [
            {
              name: 'Data-Driven Goal Recognition in Transhumeral Prostheses Using Process Mining Techniques',
              line2: 'Zihang Su, Tianshi Yu, Nir Lipovetzky, Alireza Mohammadi, Denny Oetomo, Artem Polyvyanyy, Sebastian Sardina, Ying Tan and Nick van Beest',
            },
            {
              name: 'Plan Recognition as Probabilistic Trace Alignment',
              line2: 'Jonghyeon Ko, Fabrizio Maggi, Marco Montali, Rafael Peñaloza and Ramon Fraga Pereira',
            },
          ]
        },
        {
          time: '15:30 – 16:00',
          subsessions: [
            {name: 'Coffee break', line2: 'Building 116 - Foyer', icon: 'coffee'},
          ]
        },
        {
          time: '14:00 - 15:30 - AI in Process Mining',
          line2: 'Session chair: Chiara Di Francescomarino',
          line3: 'Building 116 - Main Auditorium',
          subsessions: [
            {
              name: 'Data-Driven Goal Recognition in Transhumeral Prostheses Using Process Mining Techniques',
              line2: 'Zihang Su, Tianshi Yu, Nir Lipovetzky, Alireza Mohammadi, Denny Oetomo, Artem Polyvyanyy, Sebastian Sardina, Ying Tan and Nick van Beest',
            },
            {
              name: 'Plan Recognition as Probabilistic Trace Alignment',
              line2: 'Jonghyeon Ko, Fabrizio Maggi, Marco Montali, Rafael Peñaloza and Ramon Fraga Pereira',
            },
          ]
        },
      ]
    }
  }
}
</script>

<style scoped>
.select-day {
  text-align: center;

  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
</style>

