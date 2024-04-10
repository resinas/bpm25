<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="login-container">
        <div class="login-header">
          <img :src="logo" alt="ICPM Logo" class="logo"/>
          <div class="login-toggle">
            <ion-button expand="block" class="toggle-button" :class="{ 'active': isActiveLogin }" @click="toggleActive">Log in</ion-button>
            <ion-button expand="block" class="toggle-button" :class="{ 'active': !isActiveLogin }" @click="toggleActive">Register</ion-button>
          </div>
        </div>
        <form @submit.prevent="login" v-if="isActiveLogin">
          <label for="emailInput" class="input-label">Email</label>
          <!-- type="email" missing in ion-input right below this line, literally the one on the next line: "15", this line is line: "14" for reference -->
          <ion-input
              id="emailInput"
              placeholder="Your email"
              v-model="loginUser.email"
              required>
          </ion-input>
          <label for="passwordInput" class="input-label">Password</label>
          <ion-input
              id="passwordInput"
              placeholder="Password"
              type="password"
              v-model="loginUser.password"
              required>
          </ion-input>
          <router-link to="/auth/login/resetpassword" class="forgot-password">Forgot password?</router-link>
          <ion-button type="submit" expand="block" class="login-button">Sign in</ion-button>
          <!-- Display error message if login fails -->
          <p v-if="loginError" class="error-message">{{ loginError }}</p>
        </form>
        <form @submit.prevent="sendConfirmationEmail" v-else>
          <label for="emailInput" class="input-label">Email</label>
          <ion-input
              id="emailInput"
              placeholder="Your email"
              type="email"
              v-model="registerUser.receiver"
              required>
          </ion-input>
          <ion-button type="submit" expand="block" shape="round">Send Confirmation Email</ion-button>
          <p v-if="registerError" class="error-message">{{ registerError }}</p>
          <p v-if="registerSuccess" class="success-message">{{ registerSuccess }}</p>
        </form>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="js">
import {IonPage, IonContent,IonButton,IonInput} from "@ionic/vue";
import { ref, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
// Import the logos
import logoLight from '@/assets/images/icpm-logo-1.png';
import logoDark from '@/assets/images/icpm-logo-2.png';

// Create a computed property to switch logo based on user's color scheme preference
const logo = computed(() => {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? logoDark
      : logoLight;
});

const router = useRouter();

const loginError = ref('');
const registerError = ref('');
const registerSuccess = ref('');
const isActiveLogin = ref(true);

const loginUser = ref({
  email: '',
  password: ''
})
const registerUser = ref( {
  receiver: ''
})

const toggleActive = () => {
  isActiveLogin.value = !isActiveLogin.value;
  registerSuccess.value = '';
};
const login = async () => {
  try {
    // Here you would replace the URL with your server endpoint
    const response = await axios.post("http://localhost:8080/api/v1/auth/signin", loginUser.value);
    console.log(response.data);
    // Handle success response, e.g., navigate to another route or display a success message
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    await router.push('/tabs/home');
    loginError.value = '';
    loginUser.value.email = '';
    loginUser.value.password = '';

  } catch (error) {
    // Handle error, e.g., display an error message
    console.error("Login error:", error.response ? error.response.data : error.message);
    loginError.value = 'Incorrect password or email';
  }
};

const sendConfirmationEmail = async () => {
  try {
    localStorage.setItem('accessToken', '');
    await axios.post("http://localhost:8080/api/v1/auth/email", registerUser.value);
    registerUser.value.receiver = '';
    await router.push('/auth/login');
    registerSuccess.value = 'Email send successfully'

  } catch (error) {
    // Handle error, e.g., display an error message
    console.error("Register error:", error.response ? error.response.data : error.message);
    registerError.value = 'Email is not in participant list, please contact conference personal';
  }
};

</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  max-width: 500px;
  margin: auto;
  text-align: center;
}

.login-header h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.login-toggle {
  background: #383a3e; /* Dark background for the inactive state */
  /*border: 1px solid #ffff; #428cff; Blue border */
  display: flex; /* Align buttons horizontally */
  align-items: center; /* Center the buttons vertically */
  border-radius: 4px; /* Rounded corners for the container */
  max-width: 20rem;
  max-height: 60px;
  margin: auto; /* Center the container */
  overflow: hidden; /* Prevents children from overflowing rounded corners */
  margin-top: 2.5rem;
}

.toggle-button {
  padding:0 2px;
  --background: 0; /* Dark background for the inactive state */
  --border-radius: 4px; /* Rounded corners for the container */
  color: white;
  font-size: 0.8rem;
  flex: 1; /* Optional: make buttons share the space equally */
}

.toggle-button.active {
  --background: #428cff; /* Blue background for the active state */
  color: white; /* Ensure text is visible on the blue background */
}

form {
  text-align: left;
  margin-top: 2rem;
}

ion-input {
  --padding-start: 5px;
  --placeholder-color: rgba(255, 255, 255, 0.6);
  --color: #fff;
  background: #000;
  border: 1px solid #fff;
  border-radius: 4px;
  margin-bottom: 2rem;
}

.forgot-password {
  display: block;
  margin-top: -1.5rem;
  color: var(--ion-color-primary);
  text-decoration: none;
  text-align: right;
}
.login-button {
  --background: #428cff;
  --color: white;
  margin-top: 2.5rem;
  --border-radius: 4px;
}

.error-message {
  color: red;
  margin-top: 1rem;
}

.success-message {
  color: #428cff;
  margin-top: 1rem;
}
.logo {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  height: 45px;
  width: 150px;
  margin-right: 10px;
  margin-top: 20%;
  margin-bottom: 15px;
}

</style>