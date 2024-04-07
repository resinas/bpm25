<template>
  <ion-page>
    <HeaderBar name="Agenda" />

    <ion-toolbar>
      <ion-segment value="all" v-model="state.selectedDay">
        <ion-segment-button v-for="day in state.uniqueDays" :value="day.value" :key="day.value">
          <ion-label>
            <span class="day-name">{{ day.label.split(', ')[0] }}</span>
            <span class="day-date">{{ day.label.split(', ')[1] }}</span>
          </ion-label>
        </ion-segment-button>
      </ion-segment>
      <ion-buttons slot="end">
        <ion-button @click="goToCalendar">
          <ion-icon :icon="calendarIcon" class="larger-icon" />
        </ion-button>
      </ion-buttons>
    </ion-toolbar>


    <ion-content id="main-content">
      <div v-if="state.selectedDay">
        <div v-for="(group, timeSlot) in groupedSessionsByTimeSlot" :key="timeSlot">
          <ion-item-divider color="light">
            <ion-label>
              <h2>{{ timeSlot }}</h2> <!-- Time slot headline -->
            </ion-label>
          </ion-item-divider>
          <!-- Updated to use 'routerLink' for navigation -->
          <ion-item
              v-for="session in group"
              :key="session.id"
              :routerLink="`/session/${session.id}`"
              button>
            <ion-label>
              <h3>{{ session.session_name }}</h3>
              <p>{{ session.session_host }}</p>
              <p>{{ session.session_location }}</p>
            </ion-label>
          </ion-item>
        </div>
      </div>
      <div v-else>
        <p class="ion-padding select-day">Select a day from the top to see the agenda.</p>
      </div>
    </ion-content>

  </ion-page>
</template>


<script setup>
import { reactive, onMounted, computed } from 'vue';
import {
  IonPage,
  IonToolbar,
  IonContent,
  IonButton,
  IonIcon,
  IonItem,
  IonButtons,
  IonItemDivider,
  IonSegment,
  IonSegmentButton,
  IonLabel
} from '@ionic/vue';
import HeaderBar from "@/components/HeaderBar.vue";
import { useRouter, useRoute } from 'vue-router';
import { calendarNumber } from 'ionicons/icons';
import axios from "axios";

const router = useRouter();
const route = useRoute();


const calendarIcon = calendarNumber;
const token = localStorage.getItem("accessToken")
const state = reactive({
  sessions: [],
  uniqueDays: [],
  selectedDay: null,
  weekStart: null,
  weekEnd: null,
})
async function fetchSessions() {
  try {
    const response = await axios.get('http://localhost:8080/api/v1/agenda/sessions', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = response.data;

    state.sessions = data.map(session => ({
      id: session.id.toString(),
      session_name: session.name,
      session_host: session.host,
      session_location: session.location,
      start_time: session.startTime.replace('T', ' ').slice(0, -3),
      end_time: session.endTime.replace('T', ' ').slice(0, -3),
    }));

    // After sessions are fetched, compute uniqueDays
    uniqueDays();
  } catch (error) {
    console.error('Failed to fetch sessions:', error);
  }
}

// Function to determine the week range based on a given date
function setWeekRange(date) {
  const currentDate = date || new Date();
  const first = currentDate.getDate() - currentDate.getDay();
  const last = first + 6;

  state.weekStart = new Date(currentDate.setDate(first));
  state.weekEnd = new Date(currentDate.setDate(last));

  // After setting the week range, update the uniqueDays to reflect the new range
  uniqueDays();
}

function uniqueDays() {
  const dates = state.sessions.map(session => session.start_time.split(' ')[0]);
  const uniqueDates = [...new Set(dates)];
  state.uniqueDays = uniqueDates.map(date => {
    const [year, month, day] = date.split('-');
    const dateObj = new Date(year, month - 1, day);
    return {
      value: date,
      label: `${dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`,
    };
  });
  if (state.uniqueDays.length > 0) {
    state.selectedDay = state.uniqueDays[0].value;
  }
}

onMounted(fetchSessions);

// Compute sessions for the selected day
const filteredSessions = computed(() => {
  return state.sessions.filter(session => {
    return session.start_time.startsWith(state.selectedDay);
  }).sort((a, b) => new Date(a.start_time) - new Date(b.start_time)); // Ensure sorted by start time
});


const groupedSessionsByTimeSlot = computed(() => {
  const groups = {};
  for (const session of filteredSessions.value) {
    const timeSlot = `${session.start_time.split(' ')[1]}-${session.end_time.split(' ')[1]}`; // Extracts "HH:MM-HH:MM"
    if (!groups[timeSlot]) {
      groups[timeSlot] = [];
    }
    groups[timeSlot].push(session);
  }
  return groups;
});

function goToCalendar() {
  router.push({name: 'CalendarView'});
}

function goToSession(sessionId) {
  router.push({name: 'SessionDetail', params: {id: sessionId}});
}

</script>

<style scoped>
.day-name, .day-date {
  display: block; /* This makes each element take up the full width available, forcing a line break between them */
}

.day-name {
  /* Additional styling for the day name */
  font-weight: bold;
}

.day-date {
  /* Additional styling for the date */
  font-size: 0.75em; /* Smaller than the day name */
  color: #686868; /* A grey tint for lower contrast */
  margin-top: 4px; /* Adds space between the day name and the date */
}

.larger-icon {
  font-size: 24px; /* or any size you prefer */
  width: 26px; /* Ensure width and height match the font-size for alignment */
  height: 26px;
}

</style>
