<template>
  <ion-page>
    <HeaderBar name="Agenda" />

    <ion-toolbar>
      <ion-segment value="all" v-model="state.agendaType">
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
              @click="day.hasSession ? selectDay(day.value) : null"
          >
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
              button
          >
            <ion-icon
                :icon="session.isLiked ? heart : heartOutline"
                :color="session.isLiked ? 'danger' : 'medium'"
                slot="end"
                @click.stop="toggleLike(session)"
            ></ion-icon>
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
import {
  reactive,
  onMounted,
  computed,
  watch
} from 'vue';
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
import {
  useRouter,
  useRoute
} from 'vue-router';
import axios from "axios";

const router = useRouter();
const route = useRoute();

const calendarIcon = calendarNumber;
const token = localStorage.getItem("accessToken");
const state = reactive({
  sessions: [],
  uniqueDays: [],
  selectedDay: null,
  weekStart: new Date,
  weekEnd: new Date,
  agendaType: 'all', // Agenda type defaults to 'all'
  likedSessionIds: new Set(),
  currentUserId: null,
  passedUserId: route.params.id || null, // Capture user ID from URL params (if provided)
});

async function fetchSessions() {
  try {
    if (state.passedUserId) {
      // Load the agenda for a specific user passed via URL
      await fetchPersonalAgenda(state.passedUserId);
    } else if (state.agendaType === 'all') {
      await fetchICPMAgenda();
    } else {
      // Ensure currentUserId is fetched before loading the current user's personalized agenda
      if (!state.currentUserId) {
        await fetchCurrentUserId();
      }
      if (state.currentUserId) {
        await fetchPersonalAgenda(state.currentUserId);
      }
    }
    uniqueDays();
  } catch (error) {
    console.error('Failed to fetch sessions:', error);
  }
}

async function fetchICPMAgenda() {
  console.log("fetching ICPM")
  try {
    await fetchLikedSessions();
    const response = await axios.get('http://localhost:8080/api/v1/agenda/sessions', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const sessionsData = response.data;
    const processedSessions = await processSessions(sessionsData);
    const { weekStart, weekEnd } = determineWeekRangeFromSessions(processedSessions);
    state.sessions = processedSessions.filter(session => {
      const sessionDate = new Date(session.start_time);
      return sessionDate >= weekStart && sessionDate <= weekEnd;
    });
  } catch (error) {
    console.error('Failed to fetch ICPM agenda:', error);
  }
}

async function fetchPersonalAgenda(userId) {
  try {
    console.log('Fetching personal agenda for user ID:', userId);
    const response = await axios.get(`http://localhost:8080/api/v1/agenda/session/likedlist/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    const sessionsData = response.data;
    console.log('Fetched personal agenda sessions:', sessionsData);
    const processedSessions = await processSessions(sessionsData);
    const { weekStart, weekEnd } = determineWeekRangeFromSessions(processedSessions);

    state.sessions = processedSessions.filter(session => {
      const sessionDate = new Date(session.start_time);
      return sessionDate >= weekStart && sessionDate <= weekEnd;
    });
  } catch (error) {
    console.error(`Failed to fetch personal agenda for user ${userId}:`, error);
  }
}

async function fetchCurrentUserId() {
  try {
    const response = await axios.get('http://localhost:8080/api/v1/account/id', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    state.currentUserId = response.data.id;
    console.log('Fetched current user ID:', state.currentUserId);
  } catch (error) {
    console.error('Failed to fetch current user ID:', error);
    state.currentUserId = null;
  }
}



async function fetchLikedSessions() {
  try {
    const response = await axios.get('http://localhost:8080/api/v1/agenda/session/hearts', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    state.likedSessionIds = new Set(response.data.map(id => id.toString()));
  } catch (error) {
    console.error('Failed to fetch liked sessions:', error);
    state.likedSessionIds = new Set();
  }
}



async function toggleLike(session) {
  const previouslyLiked = session.isLiked;
  session.isLiked = !session.isLiked;
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
    session.isLiked = previouslyLiked;
  }
}

async function processSessions(sessionsData) {
  return sessionsData.map(session => {
    const sessionIdAsString = session.id.toString();
    const isLikedCheck = state.likedSessionIds.has(sessionIdAsString);
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
}

function determineWeekRangeFromSessions(processedSessions) {
  let weekStart, weekEnd;
  if (route.query.date) {
    const queryDate = new Date(route.query.date);
    const weekRange = determineWeek(queryDate);
    weekStart = weekRange.startOfWeek;
    weekEnd = weekRange.endOfWeek;
  } else {
    const earliestSessionDate = processedSessions.reduce((earliest, session) => {
      const sessionDate = new Date(session.start_time);
      return !earliest || sessionDate < earliest ? sessionDate : earliest;
    }, null);
    if (earliestSessionDate) {
      const weekRange = determineWeek(earliestSessionDate);
      weekStart = weekRange.startOfWeek;
      weekEnd = weekRange.endOfWeek;
    } else {
      const today = new Date();
      const weekRange = determineWeek(today);
      weekStart = weekRange.startOfWeek;
      weekEnd = weekRange.endOfWeek;
    }
  }
  return { weekStart, weekEnd };
}

function determineWeek(date) {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + (startOfWeek.getDay() === 0 ? -6 : 1));
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  return { startOfWeek, endOfWeek };
}

function uniqueDays() {
  state.uniqueDays = [];
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
  if (!earliestDate || !latestDate) return;
  for (let d = new Date(earliestDate); d <= latestDate; d.setDate(d.getDate() + 1)) {
    const formattedDate = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    state.uniqueDays.push({
      value: formattedDate,
      label: dayLabel,
      hasSession: state.sessions.some(session => session.start_time.startsWith(formattedDate))
    });
  }
  const firstDayWithSession = state.uniqueDays.find(day => day.hasSession);
  if (firstDayWithSession) {
    state.selectedDay = firstDayWithSession.value;
  }
}

function selectDay(value) {
  state.selectedDay = value;
}

function goToCalendar() {
  router.push({ name: 'CalendarView' });
}

onMounted(async () => {
  await fetchCurrentUserId();
  await fetchSessions();
});

watch(() => state.agendaType, async () => {
  console.log('agendaType changed to:', state.agendaType); // Debug log
  await fetchSessions();
});

const filteredSessions = computed(() => {
  return state.sessions.filter(session => session.start_time.startsWith(state.selectedDay)).sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
});

const groupedSessionsByTimeSlot = computed(() => {
  const groups = {};
  for (const session of filteredSessions.value) {
    const timeSlot = `${session.start_time.split(' ')[1]}-${session.end_time.split(' ')[1]}`;
    if (!groups[timeSlot]) {
      groups[timeSlot] = [];
    }
    groups[timeSlot].push(session);
  }
  return groups;
});
</script>

<style scoped>
.segment-wrapper {
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  background-color: var(--background-color);
}

ion-segment-button {
  display: inline-flex;
  justify-content: center;
  min-width: 60px;
  max-width: 100px;
  margin: 0 2px;
  white-space: normal;
  color: var(--text-color);
}

.segment-wrapper ion-label {
  font-size: 0.8em;
  text-align: center;
  color: var(--text-color);
}

.segment-wrapper .day-name,
.segment-wrapper .day-date {
  display: block;
  color: var(--text-color);
}

.segment-wrapper .day-name {
  font-weight: bold;
}

.segment-wrapper .day-date {
  font-size: 0.75em;
  color: var(--secondary-text-color);
  margin-top: 4px;
}

.larger-icon {
  font-size: 24px;
  width: 26px;
  height: 26px;
  color: var(--icon-color);
}

.day-without-session {
  opacity: 0.5;
  pointer-events: none;
}

.day-with-session ion-label {
  color: var(--text-color);
}

ion-item {
  text-align: left;
  color: var(--text-color);
}

:root {
  --text-color: #ffffff;
  --secondary-text-color: #686868;
  --background-color: #2a2a2a;
  --icon-color: #098BFF;

  --light-text-color: #000000;
  --light-background-color: #ffffff;
  --light-icon-color: #000000;
}

@media (prefers-color-scheme: light) {
  :root {
    --text-color: var(--light-text-color);
    --background-color: var(--light-background-color);
    --icon-color: var(--light-icon-color);
    --secondary-text-color: var(--light-text-color);
  }
}

ion-icon[icon="heart"] {
  --ionicon-color: red !important;
}

ion-icon[icon="heart-outline"] {
  --ionicon-color: grey !important;
}
</style>
