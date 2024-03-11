<template>
  <ion-menu side="end" contentId="main-content">
    <ion-header>
      <ion-toolbar>
        <ion-title>Account</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="ion-padding">
<!--        <img src="@/assets/images/icpm-logo-1.png" />-->
        <div id="logo-large" />
        <p>Welcome</p>
      </div>
      <ion-list lines="full">
        <ion-item button :routerLink="'/auth/register/'">
          <ion-label>
            <ion-icon :icon="settingsOutline" slot="start" />
            Settings
          </ion-label>
        </ion-item>
        <ion-item button :routerLink="'/tabs/about/'">
          <ion-label>
            <ion-icon :icon="informationCircleOutline" slot="start" />
            About the app
          </ion-label>
        </ion-item>
        <ion-item button @click="logout">
          <ion-label>
            <ion-icon :icon="logOutOutline" slot="start" />
            Logout
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-menu>
</template>

<script setup lang="ts">
import {informationCircleOutline, logOutOutline, settingsOutline} from "ionicons/icons";
import {IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonTitle, IonToolbar} from "@ionic/vue";
import {useRouter} from 'vue-router';

const router = useRouter();
const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');

  router.push('/auth/login');
}

</script>

<style scoped>
#logo-large {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  height: 50px;
  width: 100%;
  margin-bottom: 10px;
}
@media (prefers-color-scheme: light) {
  #logo-large {
    background-image: url("@/assets/images/icpm-logo-1.png");
  }
}
@media (prefers-color-scheme: dark) {
  #logo-large {
    background-image: url("@/assets/images/icpm-logo-2.png");
  }
}
</style>