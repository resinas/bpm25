<template>
  <ion-page>
    <HeaderBar name="Register" />
    <ion-content>
      <div v-if="!hasToken">
        <form id="form" @submit.prevent="sendConfirmationEmail">
          <ion-input placeholder="Email" v-model="userEmail.receiver"></ion-input>
          <ion-button type="submit" expand="block" shape="round">Send Confirmation Email</ion-button>
          <p>Already have an account? <router-link to="/auth/login">Login</router-link></p>
        </form>
      </div>
      <form v-else @submit.prevent="sendUserInformation">
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
import {
  IonPage, IonContent, IonInput, IonButton, IonHeader,
  IonItem,
  IonTitle,
  IonToolbar,
  IonList
} from "@ionic/vue";
import HeaderBar from "@/components/HeaderBar.vue";
import {computed, onMounted, ref} from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const userEmail = ref({
  receiver: ''
});

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

const hasToken = computed(() => token !== undefined);
const pageTitle = computed(() => hasToken.value ? "Verify Email" : "Register");

onMounted(() => {
  if (hasToken.value) {
    getUserInformation();
  }
});

const sendConfirmationEmail = async () => {
  try {
    localStorage.setItem('accessToken', '');
    await axios.post("http://localhost:8080/api/v1/auth/email", userEmail.value);
    userEmail.value.receiver = '';
    await router.push('/auth/login');

  } catch (error:unknown) {
    // Handle error, e.g., display a message to the user
      // Assume error to be of type AxiosError for type checking. AxiosError is a type exported by axios.
      if (axios.isAxiosError(error)) {
        // Now TypeScript knows error is an AxiosError, allowing access to error.response safely
        const message = error.response?.data.message || "An unknown error occurred";
        console.error("Registration error:", message);
        // Display the message to the user
        alert(message);
      } else {
        // If the error is not an Axios error, it could be a network issue or something else
        console.error("An unexpected error occurred", error);
        alert("An unexpected error occurred. Please try again.");
      }
    }
};

const getUserInformation = async () => {
  try {
    const accessToken = Array.isArray(token) ? token[0] : token;
    localStorage.setItem('accessToken', accessToken);
    const response = await axios.get("http://localhost:8080/api/v1/inactive/getUser");
    localStorage.setItem('accessToken', '');
    console.log(response.data);
    userInformation.value.email = response.data.email;
    userInformation.value.firstname = response.data.firstname;
    userInformation.value.lastname = response.data.lastname;
  } catch (error) {
    console.error("Failed to fetch user settings:", error);
    await router.push('/auth/register');
  }
};

const sendUserInformation = async () => {
  try {
    const accessToken = Array.isArray(token) ? token[0] : token;
    localStorage.setItem('accessToken', accessToken);
    await axios.post("http://localhost:8080/api/v1/inactive/setUser", userInformation.value);
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
ion-content {
  #form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0 30px;
    height: 100%;
  }
}
</style>