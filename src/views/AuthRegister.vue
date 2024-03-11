<template>
  <ion-page>
    <HeaderBar name="Register" />
    <ion-content>
      <form id="form" @submit.prevent="register">
        <ion-input placeholder="First name" v-model="user.firstname"></ion-input>
        <ion-input placeholder="Last name" v-model="user.lastname"></ion-input>
        <ion-input placeholder="Email" v-model="user.email"></ion-input>
        <ion-input type="password" placeholder="Password" v-model="user.password"></ion-input>
        <ion-input type="password" placeholder="Confirm Password" v-model="user.confirmPassword"></ion-input>
        <ion-button type="submit" expand="block" shape="round">Register</ion-button>
        <p>Already have an account? <router-link to="/auth/login">Login</router-link></p>
      </form>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {IonPage, IonContent, IonInput, IonButton} from "@ionic/vue";
import HeaderBar from "@/components/HeaderBar.vue";
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

const user = ref({
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const register = async () => {
  if (user.value.password !== user.value.confirmPassword) {
    alert("Passwords do not match");
    return;
  }
  try {
    await axios.post("http://localhost:8080/api/v1/auth/signup", {
      firstname: user.value.firstname,
      lastname: user.value.lastname,
      email: user.value.email,
      password: user.value.password
    });

    const loginResponse = await axios.post("http://localhost:8080/api/v1/auth/signin", {
      email: user.value.email,
      password: user.value.password
    });
    localStorage.setItem('accessToken', loginResponse.data.accessToken);
    localStorage.setItem('refreshToken', loginResponse.data.refreshToken);
    await router.push('/tabs/home');

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
</script>

<style scoped>
ion-content {
  #form {
    place-content: center;
    padding-top: 10rem;
    padding-left: 30px;
    padding-right: 30px
  }
}
</style>