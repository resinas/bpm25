<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="signup-container">
        <div class="signup-header">
          <h1>Sign up</h1>
        </div>
        <form id="form" @submit.prevent="sendUserInformation">
          <label for="Firstname" class="input-label">First name</label>
          <ion-input
              id="Firstname"
              v-model="userInformation.firstname"
              required
          ></ion-input>
          <label  for="Surname" class="input-label">Surname</label>
          <ion-input
              id="Surname"
              v-model="userInformation.lastname"
              required
          ></ion-input>
          <label for="emailInput" class="input-label">Email</label>
          <ion-input
              id="emailInput"
              type="email"
              v-model="userInformation.email"
              required
          ></ion-input>
          <label for="password" class="input-label">Password</label>
          <ion-input
              id="password"
              type="password" v-model="userInformation.password"
              required
          ></ion-input>
          <label for="ConfPassword" class="input-label">Confirm password</label>
          <ion-input
              id="ConfPassword"
              type="password"
              v-model="userInformation.confirmPassword"
              required
          ></ion-input>
          <ion-toggle :checked="true" label-placement="end">
            Share user information with other attendees
          </ion-toggle><br /><br />
          <ion-button type="submit" expand="block" shape="round">Sign up</ion-button>
        </form>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {IonPage, IonContent, IonInput, IonButton, IonToggle} from "@ionic/vue";
import {computed, onMounted, ref} from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const userInformation = ref({
  email: '',
  firstname: '',
  lastname: '',
  password: '',
  confirmPassword: ''

})

const loginInformation = ref({
  email: '',
  password: ''
})

const token = route.params.token;

const hasToken = computed(() => token !== '');

onMounted(() => {
  if (hasToken.value) {
    getUserInformation();
  }
});

const getUserInformation = async () => {
  try {
    const setUpToken = Array.isArray(token) ? token[0] : token;
    localStorage.setItem('setUpToken', setUpToken);
    const response = await axios.get("https://localhost:8080/api/v1/account/userDetails", {
      headers: { Authorization: `Bearer ${setUpToken}` }});
    localStorage.setItem('setUpToken', '');
    console.log(response.data);
    userInformation.value.email = response.data.email;
    userInformation.value.firstname = response.data.firstname;
    userInformation.value.lastname = response.data.lastname;
  } catch (error) {
    console.error("Failed to fetch user settings:", error);
    await router.push('/auth/login');
  }
};

const sendUserInformation = async () => {
  try {
    const accessToken = Array.isArray(token) ? token[0] : token;
    localStorage.setItem('accessToken', accessToken);
    await axios.post("https://localhost:8080/api/v1/account/update", userInformation.value, { headers: { Authorization: `Bearer ${accessToken}` } });
    localStorage.setItem('accessToken', '');
    loginInformation.value.email = userInformation.value.email;
    loginInformation.value.password = userInformation.value.password
    const response = await axios.post("https://localhost:8080/api/v1/auth/signin", loginInformation.value);
    console.log(response.data);
    // Handle success response, e.g., navigate to another route or display a success message
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    await router.push('/tabs/home');
  } catch (error) {
    console.error("Failed send user information:", error);
  }
};

</script>

<style scoped>
.signup-container {
  display: flex;
  flex-direction: column;
  max-width: 500px;
  margin: auto;
  text-align: center;
}
.signup-header{
  margin-top: 2rem;
}
#form {
  text-align: left;
  margin-top: 2rem;
}

ion-input {
  --padding-start: 5px;
  --placeholder-color: rgba(255, 255, 255, 0.6);
  --color: #fff;
  border: 1px solid #fff;
  border-radius: 4px;
  margin-bottom: 2rem;
}
ion-toggle {
  font-size: 0.8em;
}
</style>