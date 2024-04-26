<template>
  <ion-page>
    <HeaderBar name="Gallery" />
    <ion-content :fullscreen="true" ref="content">
      <ion-grid>
        <ion-row>
          <ion-col size="4" v-for="(image, index) in images" :key="index">
            <ion-img :src="getImageUrl(image)" class="gallery-image"></ion-img>
          </ion-col>
        </ion-row>
      </ion-grid>
      <!-- Infinite Scroll -->
      <ion-infinite-scroll @ionInfinite="loadMore" threshold="100px">
        <ion-infinite-scroll-content
            loading-spinner="bubbles"
            loading-text="Loading more photos...">
        </ion-infinite-scroll-content>
      </ion-infinite-scroll>

      <ion-fab vertical="bottom" horizontal="center" slot="fixed" class="custom-fab">
        <ion-fab-button @click="uploadGalleryImage">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
        <ion-fab-button :routerLink="'/tabs/images/myGallery'">
          <ion-icon :icon="folder"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>


  </ion-page>
</template>
<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from '@ionic/vue';
import {add, folder} from "ionicons/icons";
</script>

<style scoped>

</style>