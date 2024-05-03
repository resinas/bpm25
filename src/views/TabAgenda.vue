<template>
  <ion-page>
    <HeaderBar name="Agenda" />

    <ion-toolbar>
      <ion-segment value="all" v-model="agendaType">
        <ion-segment-button value="all">
          <ion-label>ICPM Agenda</ion-label>
        </ion-segment-button>
        <ion-segment-button value="personal">
          <ion-label>Personalized Agenda</ion-label>
        </ion-segment-button>
      </ion-segment>
      <div class="segment-wrapper">
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
      </div>
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
            <ion-icon
                :icon="session.isLiked ? heart : heartOutline"
                :color="session.isLiked ? 'danger' : 'medium'"
                slot="end"
                @click.stop="toggleLike(session)">
            </ion-icon>
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
import {
  heart,
  heartOutline,
  calendarNumber,
  cafeOutline,
  fastFoodOutline,
  alertCircleOutline,
  idCardOutline,
  helpCircleOutline,
} from 'ionicons/icons';
import HeaderBar from "@/components/HeaderBar.vue";
import { useRouter, useRoute } from 'vue-router';
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
  weekEnd: new Date,
  agendaType: 'all',
})
async function fetchSessions() {
  try {
    await fetchLikedSessions();

    // Fetch all sessions first.
    const response = await axios.get('http://localhost:8080/api/v1/agenda/sessions', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const sessionsData = response.data;

    // Process sessions data.
    const processedSessions = sessionsData.map(session => {
      const sessionIdAsString = session.id.toString();
      const isLikedCheck = state.likedSessionIds.has(sessionIdAsString);
      // console.log(`Session ID: ${sessionIdAsString} (Type: ${typeof sessionIdAsString}) Is liked: ${isLikedCheck}`);
      return {
        id: sessionIdAsString,
        session_name: session.name,
        session_host: session.host,
        session_location: session.location,
        start_time: session.startTime.replace('T', ' ').slice(0, -3),
        end_time: session.endTime.replace('T', ' ').slice(0, -3),
        type: session.type,
        isLiked: isLikedCheck,
      };
    });
    /* console.log("Liked Session IDs in the Set:");
    state.likedSessionIds.forEach(id => console.log(`ID: ${id}, Type: ${typeof id}`)); */

    // console.log("Processed sessions with isLiked property:", processedSessions);

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

async function toggleLike(session) {
  const previouslyLiked = session.isLiked;
  session.isLiked = !session.isLiked;  // Optimistically update the UI
  try {
    await axios.post(`http://localhost:8080/api/v1/agenda/session/like`, {
      likes: session.isLiked,
      id: session.id
    }, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (session.isLiked) {
      state.likedSessionIds.add(session.id);
    } else {
      state.likedSessionIds.delete(session.id);
    }
  } catch (error) {
    console.error('Failed to change like status:', error);
    session.isLiked = previouslyLiked;  // Revert on failure
  }
}


async function fetchLikedSessions() {
  try {
    const response = await axios.get('http://localhost:8080/api/v1/agenda/session/hearts', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    // Convert each ID from the response into a string before creating the set
    state.likedSessionIds = new Set(response.data.map(id => id.toString()));
    // console.log("Liked Session IDs Set after fetching and converting:", Array.from(state.likedSessionIds));
  } catch (error) {
    console.error('Failed to fetch liked sessions:', error);
    state.likedSessionIds = new Set();
  }
}




onMounted(async () => {
  await fetchSessions();
});

watch(() => state.agendaType, async () => {
  await fetchSessions(); // Refetch sessions whenever the agenda type changes
});

function determineWeek(date) {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + (startOfWeek.getDay() === 0 ? -6 : 1)); // Adjust to set Monday as the first day of the week
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  return { startOfWeek, endOfWeek };
}

function iconForSessionType(type) {
  switch (type) {
    case 'FOOD':
      return fastFoodOutline;
    case 'COFFEE':
      return cafeOutline;
    case 'KEYNOTE':
      return alertCircleOutline;
    case 'PRACTICAL':
      return idCardOutline;
    case 'QnA':
      return helpCircleOutline;
    default:
      return; // Optionally return a default icon
  }
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

</script>

<style scoped>
/* Segment wrapper specific styles */
.segment-wrapper {
  overflow-x: auto; /* Enables horizontal scrolling for the segment */
  white-space: nowrap; /* Keeps segment buttons in a single line */
  -webkit-overflow-scrolling: touch; /* Smooths scrolling on touch devices */
  background-color: var(--background-color); /* Use variable for background */
}

/* Segment button styles */
ion-segment-button {
  display: inline-flex; /* Uses flexbox to center content */
  justify-content: center; /* Centers content horizontally */
  min-width: 60px; /* Sets a minimum width for each segment button */
  max-width: 100px; /* Limits the maximum width to ensure visibility on small screens */
  margin: 0 2px; /* Adds horizontal spacing between buttons */
  white-space: normal; /* Allows text wrapping within the button */
  color: var(--text-color); /* Use variable for text color */
}

/* Styles for labels within the segment buttons */
.segment-wrapper ion-label {
  font-size: 0.8em; /* Smaller font size for the segment labels */
  text-align: center; /* Centers the text within the segment */
  color: var(--text-color); /* Use variable for text color */
}

/* Styling day names and dates within segment buttons */
.segment-wrapper .day-name,
.segment-wrapper .day-date {
  display: block; /* Forces a new line for each element within the label */
  color: var(--text-color); /* Use variable for text color */
}

.segment-wrapper .day-name {
  font-weight: bold; /* Bold for day names to distinguish from dates */
}

.segment-wrapper .day-date {
  font-size: 0.75em; /* Smaller font size for dates */
  color: var(--secondary-text-color); /* Use variable for less emphasized text */
  margin-top: 4px; /* Space between day name and date */
}

/* Icon sizing for clarity and emphasis */
.larger-icon {
  font-size: 24px; /* Increases icon size for visibility */
  width: 26px; /* Width matching font size to maintain aspect ratio */
  height: 26px; /* Height matching font size to maintain aspect ratio */
  color: var(--icon-color); /* Use variable for icon color */
}

/* Style modifications for days without sessions */
.day-without-session {
  opacity: 0.5; /* Semi-transparent for days without any sessions */
  pointer-events: none; /* Disables interactions for days without sessions */
}

/* Enhances visibility for labels on days with sessions */
.day-with-session ion-label {
  color: var(--text-color); /* White color for active day labels */
}

/* Session item styles - revert any global changes that might have affected sessions */
ion-item {
  text-align: left; /* Ensures session information aligns to the left */
  color: var(--text-color); /* Use variable for text color */
}

/* Define basic color scheme variables */
:root {
  --text-color: #ffffff; /* Default text color */
  --secondary-text-color: #686868; /* Less emphasized text */
  --background-color: #2a2a2a; /* Dark background */
  --icon-color: #098BFF; /* Icon color */

  --light-text-color: #000000; /* Light mode text color */
  --light-background-color: #ffffff; /* Light mode background */
  --light-icon-color: #000000; /* Light mode icon color */
}

/* Media query for light mode */
@media (prefers-color-scheme: light) {
  :root {
    --text-color: var(--light-text-color);
    --background-color: var(--light-background-color);
    --icon-color: var(--light-icon-color);
    --secondary-text-color: var(--light-text-color); /* Adjust if needed */
  }
}

ion-icon[icon="heart"] {
  --ionicon-color: red !important;
}

ion-icon[icon="heart-outline"] {
  --ionicon-color: grey !important;
}





</style>


