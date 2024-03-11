<template>
  <ion-page>
    <HeaderBar name="Login" />
    <ion-content>
      <form id="form" @submit.prevent="login">
        <ion-input placeholder="Email" v-model="user.email"></ion-input>
        <ion-input type="password" placeholder="Password" v-model="user.password"></ion-input>
        <ion-button type="submit" expand="block" shape="round">Login</ion-button>
        <p>Don't have an account? <router-link to="/auth/register">Register</router-link></p>
        <!-- Display error message if login fails -->
        <p v-if="loginError" style="color: red;">{{ loginError }}</p>
      </form>
    </ion-content>
  </ion-page>
</template>

<script setup lang="js">
import {IonPage, IonContent,IonButton,IonInput} from "@ionic/vue";
import HeaderBar from "@/components/HeaderBar.vue";
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

const loginError = ref('');

const user = ref({
  email: '',
  password: ''
})

const login = async () => {
  try {
    // Here you would replace the URL with your server endpoint
    const response = await axios.post("http://localhost:8080/api/v1/auth/signin", user.value);
    console.log(response.data);
    // Handle success response, e.g., navigate to another route or display a success message
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    await router.push('/tabs/home');
    loginError.value = '';
    user.value.email = '';
    user.value.password = '';

  } catch (error) {
    // Handle error, e.g., display an error message
    console.error("Login error:", error.response ? error.response.data : error.message);
    loginError.value = 'Incorrect password or email';
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