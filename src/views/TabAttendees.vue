<template>
  <ion-page>
    <HeaderBar name="Attendees" />
    <ion-content :fullscreen="true">
      <ion-searchbar v-model="state.searchQuery" @ionChange="fetchAttendees" placeholder="Search attendees..."></ion-searchbar>
      <ion-list lines="full">
        <ion-item v-for="person in state.persons" :key="person.id" :router-link="`/attendee/${person.id}`" button>
          <ion-avatar slot="start">
            <ion-icon v-if="!person.avatar_path" :icon="personCircle" class="avatar-icon" size="large"></ion-icon>
            <img v-else :src="person.imageURL" :alt="`${person.firstname} ${person.lastname}`" />
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
import { IonIcon, IonPage, IonContent, IonList, IonItem, IonAvatar, IonLabel, IonSearchbar, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/vue';
import HeaderBar from "@/components/HeaderBar.vue";
import { watch, reactive, onMounted } from 'vue';
import { debounce } from 'lodash';
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
    const response = await axios.get(`https://localhost:8080/api/v1/attendees?page=${state.page}&size=50&search=${state.searchQuery}`, {
      headers: { 'Authorization': `Bearer ${token}`}
    });
    const persons = response.data.content;
    await Promise.all(persons.map(async person => {
      if (person.avatar_path) {
        person.imageURL = await getImage(person);
      }
    }));
    if (state.page === 0) {
      state.persons = persons;
    } else {
      state.persons.push(...persons);
    }
    state.page++;
    state.loading = false;
  } catch (error) {
    console.error("Failed to fetch attendees:", error);
    state.loading = false;
  }
};

const debouncedFetchAttendees = debounce(fetchAttendees, 300);  // 300ms delay

watch(() => state.searchQuery, async (newQuery, oldQuery) => {
  if (newQuery !== oldQuery) {
    state.page = 0;
    debouncedFetchAttendees();
  }
}, { immediate: false });

const getImage = async (person) => {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await axios.get(`https://localhost:8080/api/v1/account/getProfilePicture/${person.id}`, {
      headers: { 'Authorization': `Bearer ${token}` },
      params: {
        format: 'webp'
      },
      responseType: 'blob'  // This tells axios to expect a binary response instead of JSON
    });
    return URL.createObjectURL(response.data);  // Convert the blob to a URL and return it
  } catch (error) {
    console.error("Error fetching image:", error);
    return '';  // Return an empty string or a default image path in case of error
  }
}


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


<style scoped>
.ion-avatar {
  display: grid;
  place-items: center; /* This centers the child element */
  width: 2.5em; /* Adjust to fit your design */
  height: 2.5em;
  border-radius: 50%;
  overflow: hidden;
}

.ion-avatar img {
  width: 100%; /* Full container width */
  height: 100%; /* Full container height */
  object-fit: cover; /* Ensure no distortion */
}

.ion-avatar ion-icon {
  width: 300%; /* Scaled to fit, modify if needed */
  height: auto; /* Maintain aspect ratio */
}
</style>






