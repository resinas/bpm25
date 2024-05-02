<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="reset-password-container">
        <div class="signup-header">
          <h2>Reset password</h2>
          <p>Please type something you'll remember</p>
        </div>
        <form id="form" @submit.prevent="resetPassword">
            <label
              for="firstPassword">
              Password
            </label>
            <ion-input
                id="firstPassword"
                type="password"
                placeholder="Password"
                v-model="resetInformation.password"
                required
            ></ion-input>
            <label
                for="secondPassword">
                Confirm Password
            </label>
            <ion-input
                id="secondPassword"
                type="password"
                placeholder="Repeat password"
                v-model="resetInformation.confirmPassword"
                required
            ></ion-input>

          <ion-button
              type="submit"
              expand="block">
              Reset password
          </ion-button>
          <p v-if="resetError" class="error-message">{{ resetError }}</p>
        </form>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {IonPage, IonContent,IonButton,IonInput} from "@ionic/vue";
import {ref} from "vue";
import {useRoute, useRouter} from 'vue-router';
import axios from "axios";

const route = useRoute();
const router = useRouter();

const resetInformation = ref({
  password: '',
  confirmPassword: ''
})

const token = route.params.token;
const resetError = ref('');

const resetPassword = async () => {
  try {
    if (resetInformation.value.password !== resetInformation.value.confirmPassword) {
      resetError.value = "The passwords do not match.";
      return false;
    }
    const resetToken = Array.isArray(token) ? token[0] : token;
    localStorage.setItem('resetToken', resetToken);
    const response = await axios.post("https://localhost:8080/api/v1/account/resetPassword", resetInformation.value, { headers: { Authorization: `Bearer ${resetToken}` } });
    localStorage.setItem('resetToken', '');

    await router.push('/auth/login');
  } catch (error) {
    resetError.value = "Failed to reset password"
    console.error("Failed to reset password", error);

  }



}
</script>

<style scoped>
.reset-password-container {
  display: flex;
  flex-direction: column;
  max-width: 500px;
  margin: auto;
  text-align: center;
}
.signup-header{
  margin-top: 2rem;
}
h2 {
  font-size: 1.5em;
  margin-bottom: 0.5em;
}

p {
  margin-bottom: 2em;
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
ion-item {
  --padding-start: 0;
  --inner-padding-start: 0;
  --inner-padding-end: 0;
  --min-height: auto; /* Adjust the height as needed */
  position: relative; /* For proper positioning of the label and input */
  text-align: left;
}

ion-button {
  --color: white;
  margin-top: 2.5rem;
  --border-radius: 4px;
}
</style>