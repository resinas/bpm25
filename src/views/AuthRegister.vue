<template>
  <ion-page>
    <HeaderBar name="Register" />
    <ion-content>
      <form @submit.prevent="sendUserInformation">
        <ion-header>
          <ion-toolbar>
            <ion-title>Please verify the information below</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-list>
          <ion-item>
            <ion-input v-model="userInformation.firstname" label="First name:"></ion-input>
          </ion-item>
          <ion-item>
            <ion-input v-model="userInformation.lastname" label="Second name:"></ion-input>
          </ion-item>
          <ion-item>
            <ion-input v-model="userInformation.email" label="Email:"></ion-input>
          </ion-item>
          <ion-item>
            <ion-input type="password" v-model="userInformation.password" label="Password:"></ion-input>
          </ion-item>
          <ion-item>
            <ion-input type="password" v-model="userInformation.confirmPassword" label="Confirm password:"></ion-input>
          </ion-item>
        </ion-list>
        <ion-button type="submit" expand="block" shape="round">Login</ion-button>
      </form>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {IonPage, IonContent, IonInput, IonButton, IonHeader, IonItem, IonTitle, IonToolbar, IonList} from "@ionic/vue";
import HeaderBar from "@/components/HeaderBar.vue";
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
    const response = await axios.get("http://localhost:8080/api/v1/account/userDetails", {
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
    await axios.post("http://localhost:8080/api/v1/account/update", userInformation.value);
    localStorage.setItem('accessToken', '');
    loginInformation.value.email = userInformation.value.email;
    loginInformation.value.password = userInformation.value.password
    const response = await axios.post("http://localhost:8080/api/v1/auth/signin", loginInformation.value);
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
</style>