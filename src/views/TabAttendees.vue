<template>
  <ion-page>
    <HeaderBar name="Attendees" />
    <ion-content :fullscreen="true">
      <ion-searchbar v-model="state.searchQuery" @ionChange="fetchAttendees" placeholder="Search attendees..."></ion-searchbar>
      <ion-list lines="full">
        <ion-item v-for="person in state.persons" :key="person.id" :router-link="`/attendee/${person.id}`" button>
          <ion-avatar slot="start">
            <ion-icon v-if="!person.avatarpath" :icon="personCircle" size="large"></ion-icon>
            <img v-else :src="person.avatarpath" :alt="`${person.firstname} ${person.lastname}`" />
          </ion-avatar>

          <ion-label>
            <h2>{{ person.firstname }} {{ person.lastname }}</h2>
            <p>{{ formatCompanyCountry(person) }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
      <ion-infinite-scroll @ionInfinite="loadMore" threshold="20%">
        <ion-infinite-scroll-content
            loading-spinner="bubbles"
            loading-text="Loading more attendees...">
        </ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>
  </ion-page>
</template>


<script setup>
import { IonPage, IonContent, IonList, IonItem, IonAvatar, IonLabel, IonSearchbar, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/vue';
import HeaderBar from "@/components/HeaderBar.vue";
import { reactive, onMounted } from 'vue';
import axios from 'axios';
import { personCircle } from 'ionicons/icons';


const state = reactive({
  persons: [],
  searchQuery: '',
  page: 0,
  loading: false
});

const fetchAttendees = async () => {
  const token = localStorage.getItem("accessToken");
  try {
    state.loading = true;
    const response = await axios.get(`http://localhost:8080/api/v1/attendees?page=${state.page}&size=50&search=${state.searchQuery}`, {
      headers: { 'Authorization': `Bearer ${token}`}
    });
    const data = response.data;
    if (state.page === 0) {
      state.persons = data.content;
    } else {
      state.persons.push(...data.content);
    }
    state.page++;
    state.loading = false;
  } catch (error) {
    console.error("Failed to fetch attendees:", error);
    state.loading = false;
  }
};

const formatCompanyCountry = (person) => {
  let parts = [];
  if (person.company) parts.push(person.company);
  if (person.country) parts.push(person.country);
  return parts.join(", "); // Only adds a comma if both parts exist
};

const loadMore = async (event) => {
  await fetchAttendees();
  event.target.complete();
};

onMounted(fetchAttendees);

</script>

