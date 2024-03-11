<template>
  <ion-page>
    <HeaderBar name="Attendees" />
    <ion-content :fullscreen="true">
      <p class="ion-padding">Here is the list of all attendees:</p>
      <ion-list lines="full">
        <ion-item v-for="(person, index) in persons" :key="person.name">
          <ion-avatar aria-hidden="true" slot="start">
            <img alt="" :src="person.avatar + '?' + index" />
          </ion-avatar>
          <ion-label>
            <h2>{{ person.name }}</h2>
            <p>
              {{ person.email }}<br>
              {{ person.company }}, {{ person.country }}
            </p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="js">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonAvatar, IonLabel } from '@ionic/vue';
import HeaderBar from "@/components/HeaderBar.vue";
</script>

<script lang="js">
export default {
  data() {
    return {
      persons: [
        { name: 'John Doe', email: 'johndoe@gmail.com', company: 'Technical University of Denmark', country: 'Denmark', avatar: 'https://picsum.photos/100' },
        { name: 'Jane Doe', email: 'janedoe@gmail.com', company: 'SAP', country: 'The Netherlands', avatar: 'https://picsum.photos/100' },
        { name: 'John Smith', email: 'johnsmith@gmail.com', company: 'Celonis', country: 'Germany', avatar: 'https://picsum.photos/100' },
        { name: 'John Doe', email: 'johndoe@gmail.com', company: 'Technical University of Denmark', country: 'Denmark', avatar: 'https://picsum.photos/100' },
        { name: 'Jane Doe', email: 'janedoe@gmail.com', company: 'SAP', country: 'The Netherlands', avatar: 'https://picsum.photos/100' },
        { name: 'John Smith', email: 'johnsmith@gmail.com', company: 'Celonis', country: 'Germany', avatar: 'https://picsum.photos/100' },
        { name: 'John Doe', email: 'johndoe@gmail.com', company: 'Technical University of Denmark', country: 'Denmark', avatar: 'https://picsum.photos/100' },
        { name: 'Jane Doe', email: 'janedoe@gmail.com', company: 'SAP', country: 'The Netherlands', avatar: 'https://picsum.photos/100' },
        { name: 'John Smith', email: 'johnsmith@gmail.com', company: 'Celonis', country: 'Germany', avatar: 'https://picsum.photos/100' },
        { name: 'John Doe', email: 'johndoe@gmail.com', company: 'Technical University of Denmark', country: 'Denmark', avatar: 'https://picsum.photos/100' },
        { name: 'Jane Doe', email: 'janedoe@gmail.com', company: 'SAP', country: 'The Netherlands', avatar: 'https://picsum.photos/100' },
        { name: 'John Smith', email: 'johnsmith@gmail.com', company: 'Celonis', country: 'Germany', avatar: 'https://picsum.photos/100' },
        { name: 'John Doe', email: 'johndoe@gmail.com', company: 'Technical University of Denmark', country: 'Denmark', avatar: 'https://picsum.photos/100' },
        { name: 'Jane Doe', email: 'janedoe@gmail.com', company: 'SAP', country: 'The Netherlands', avatar: 'https://picsum.photos/100' },
        { name: 'John Smith', email: 'johnsmith@gmail.com', company: 'Celonis', country: 'Germany', avatar: 'https://picsum.photos/100' },
        { name: 'John Doe', email: 'johndoe@gmail.com', company: 'Technical University of Denmark', country: 'Denmark', avatar: 'https://picsum.photos/100' },
        { name: 'Jane Doe', email: 'janedoe@gmail.com', company: 'SAP', country: 'The Netherlands', avatar: 'https://picsum.photos/100' },
        { name: 'John Smith', email: 'johnsmith@gmail.com', company: 'Celonis', country: 'Germany', avatar: 'https://picsum.photos/100' },
        { name: 'John Doe', email: 'johndoe@gmail.com', company: 'Technical University of Denmark', country: 'Denmark', avatar: 'https://picsum.photos/100' },
        { name: 'Jane Doe', email: 'janedoe@gmail.com', company: 'SAP', country: 'The Netherlands', avatar: 'https://picsum.photos/100' },
        { name: 'John Smith', email: 'johnsmith@gmail.com', company: 'Celonis', country: 'Germany', avatar: 'https://picsum.photos/100' },
        { name: 'John Doe', email: 'johndoe@gmail.com', company: 'Technical University of Denmark', country: 'Denmark', avatar: 'https://picsum.photos/100' },
        { name: 'Jane Doe', email: 'janedoe@gmail.com', company: 'SAP', country: 'The Netherlands', avatar: 'https://picsum.photos/100' },
        { name: 'John Smith', email: 'johnsmith@gmail.com', company: 'Celonis', country: 'Germany', avatar: 'https://picsum.photos/100' },
        { name: 'John Doe', email: 'johndoe@gmail.com', company: 'Technical University of Denmark', country: 'Denmark', avatar: 'https://picsum.photos/100' },
        { name: 'Jane Doe', email: 'janedoe@gmail.com', company: 'SAP', country: 'The Netherlands', avatar: 'https://picsum.photos/100' },
        { name: 'John Smith', email: 'johnsmith@gmail.com', company: 'Celonis', country: 'Germany', avatar: 'https://picsum.photos/100' },
        { name: 'John Doe', email: 'johndoe@gmail.com', company: 'Technical University of Denmark', country: 'Denmark', avatar: 'https://picsum.photos/100' },
        { name: 'Jane Doe', email: 'janedoe@gmail.com', company: 'SAP', country: 'The Netherlands', avatar: 'https://picsum.photos/100' },
        { name: 'John Smith', email: 'johnsmith@gmail.com', company: 'Celonis', country: 'Germany', avatar: 'https://picsum.photos/100' },
        { name: 'John Doe', email: 'johndoe@gmail.com', company: 'Technical University of Denmark', country: 'Denmark', avatar: 'https://picsum.photos/100' },
        { name: 'Jane Doe', email: 'janedoe@gmail.com', company: 'SAP', country: 'The Netherlands', avatar: 'https://picsum.photos/100' },
        { name: 'John Smith', email: 'johnsmith@gmail.com', company: 'Celonis', country: 'Germany', avatar: 'https://picsum.photos/100' },
      ]
    };
  },
};
</script>
