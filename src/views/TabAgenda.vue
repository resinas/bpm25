<template>
  <ion-page>
    <HeaderBar name="Agenda" />

    <ion-toolbar>
      <ion-segment value="all" v-model="state.selectedDay">
        <ion-segment-button
            v-for="day in state.uniqueDays"
            :value="day.value"
            :key="day.value"
            :class="{'day-without-session': !day.hasSession, 'day-with-session': day.hasSession}"
            @click="day.hasSession ? selectDay(day.value) : null">
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
import { reactive, onMounted, computed , watch } from 'vue';
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
  weekStart: new Date,
  weekEnd: new Date
})
async function fetchSessions() {
  try {
    // Fetch all sessions first.
    const response = await axios.get('http://localhost:8080/api/v1/agenda/sessions', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const sessionsData = response.data;

    // Process sessions data.
    const processedSessions = sessionsData.map(session => ({
      id: session.id.toString(),
      session_name: session.name,
      session_host: session.host,
      session_location: session.location,
      start_time: session.startTime.replace('T', ' ').slice(0, -3),
      end_time: session.endTime.replace('T', ' ').slice(0, -3),
    }));

    // Determine the week range either based on query date or the earliest session date.
    let weekStart, weekEnd;
    if (route.query.date) {
      const queryDate = new Date(route.query.date);
      const weekRange = determineWeek(queryDate);
      weekStart = weekRange.startOfWeek;
      weekEnd = weekRange.endOfWeek;
    } else {
      // Find the earliest session date from processedSessions.
      const earliestSessionDate = processedSessions.reduce((earliest, session) => {
        const sessionDate = new Date(session.start_time);
        return !earliest || sessionDate < earliest ? sessionDate : earliest;
      }, null);

      // Calculate week range based on the earliest session date.
      if (earliestSessionDate) {
        const weekRange = determineWeek(earliestSessionDate);
        weekStart = weekRange.startOfWeek;
        weekEnd = weekRange.endOfWeek;
      } else {
        // Handle the case where there are no sessions or another default behavior is desired.
        const today = new Date();
        const weekRange = determineWeek(today);
        weekStart = weekRange.startOfWeek;
        weekEnd = weekRange.endOfWeek;
      }
    }

    // Filter sessions that fall within the determined week range.
    state.sessions = processedSessions.filter(session => {
      const sessionDate = new Date(session.start_time);
      return sessionDate >= weekStart && sessionDate <= weekEnd;
    });

    // After sessions are filtered, compute uniqueDays.
    uniqueDays();
  } catch (error) {
    console.error('Failed to fetch sessions:', error);
  }
}

function uniqueDays() {
  state.uniqueDays = []; // Reset uniqueDays

  // Find the earliest and latest session dates within the week
  let earliestDate = null;
  let latestDate = null;

  state.sessions.forEach(session => {
    const sessionDate = new Date(session.start_time.split(' ')[0]);
    if (!earliestDate || sessionDate < earliestDate) {
      earliestDate = sessionDate;
    }
    if (!latestDate || sessionDate > latestDate) {
      latestDate = sessionDate;
    }
  });

  // Guard clause in case there are no sessions in the week
  if (!earliestDate || !latestDate) return;

  // Generate days between earliest and latest session dates
  for (let d = new Date(earliestDate); d <= latestDate; d.setDate(d.getDate() + 1)) {
    const formattedDate = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    state.uniqueDays.push({
      value: formattedDate,
      label: dayLabel,
      hasSession: state.sessions.some(session => session.start_time.startsWith(formattedDate))
    });
  }

  // Auto-select the first day with a session
  const firstDayWithSession = state.uniqueDays.find(day => day.hasSession);
  if (firstDayWithSession) {
    state.selectedDay = firstDayWithSession.value;
  }
}


onMounted(fetchSessions);

function determineWeek(date) {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + (startOfWeek.getDay() === 0 ? -6 : 1)); // Adjust to set Monday as the first day of the week
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  return { startOfWeek, endOfWeek };
}

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

function selectDay(value) {
  state.selectedDay = value;
  // Any additional logic to display the sessions for the selected day
}


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

.day-without-session {
  opacity: 0.5;
  pointer-events: none;
}

.day-with-session ion-label {
  color: #ffffff; /* Brighter color for days with sessions */
}


</style>
