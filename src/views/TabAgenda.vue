<template>
  <ion-page>
    <HeaderBar name="Agenda" />

    <ion-toolbar>
      <ion-segment value="all" v-model="selectedDay">
        <ion-segment-button v-for="day in uniqueDays" :value="day.value" :key="day.value">
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
      <div v-if="selectedDay">
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
import {ref, computed} from 'vue';
import {
  IonPage,
  IonToolbar,
  IonContent,
  IonList,
  IonItemGroup,
  IonItemDivider,
  IonSegment,
  IonSegmentButton,
  IonLabel
} from '@ionic/vue';
import HeaderBar from "@/components/HeaderBar.vue";
import {useRoute, useRouter} from 'vue-router';
import {calendarNumber} from 'ionicons/icons';

const route = useRoute();
const router = useRouter();

const calendarIcon = calendarNumber;
const sessionId = ref(route.params.id);

function goToSession(sessionId) {
  router.push({name: 'SessionDetail', params: {id: sessionId}});
}

function goToCalendar() {
  router.push({name: 'CalendarView'});
}

// Simulated sessions data
const sessions = ref([
  {
    id: '1',
    session_name: 'Session A',
    session_host: 'Host 1',
    session_location: 'Location 1',
    start_time: '2024-03-27 09:00',
    end_time: '2024-03-27 10:00'
  },
  {
    id: '2',
    session_name: 'Session D',
    session_host: 'Host 1',
    session_location: 'Location 1',
    start_time: '2024-03-28 09:00',
    end_time: '2024-03-28 10:00'
  },
  {
    id: '3',
    session_name: 'Session C',
    session_host: 'Host 3',
    session_location: 'Location 3',
    start_time: '2024-03-27 09:00',
    end_time: '2024-03-27 10:00'
  },
  {
    id: '4',
    session_name: 'Session B',
    session_host: 'Host 2',
    session_location: 'Location 2',
    start_time: '2024-03-27 11:00',
    end_time: '2024-03-27 12:30'
  },
  {
    id: '5',
    session_name: 'Session B',
    session_host: 'Host 2',
    session_location: 'Location 2',
    start_time: '2024-03-27 09:00',
    end_time: '2024-03-27 17:30'
  },
]);


// Compute unique dates from sessions for the segment buttons
const uniqueDays = computed(() => {
  const dates = sessions.value.map(session => session.start_time.split(' ')[0]); // Extract date part
  const uniqueDates = [...new Set(dates)]; // Remove duplicates
  return uniqueDates.map(date => {
    const [year, month, day] = date.split('-');
    const dateObj = new Date(year, month - 1, day); // Month is 0-indexed
    return {
      value: date, // "YYYY-MM-DD" format
      label: `${dateObj.toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: 'numeric'})}`, // E.g., "Mon, Mar 27"
    };
  });
});

// Selected day for filtering sessions
const selectedDay = ref(null);

// Compute sessions for the selected day
const filteredSessions = computed(() => {
  return sessions.value.filter(session => {
    return session.start_time.startsWith(selectedDay.value);
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