<template>
  <ion-page>
    <HeaderBar name="Register" />
    <ion-content>
      <form id="form" @submit.prevent="register">
        <ion-input placeholder="Email" v-model="user.email"></ion-input>
        <ion-button type="submit" expand="block" shape="round">Send Confirmation Email</ion-button>
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
  email: '',
});

const register = async () => {
  try {
    await axios.post("http://localhost:8080/api/v1/auth/email", {
      email: user.value.email,
    });

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