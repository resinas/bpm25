<template>
  <ion-page>
    <HeaderBar name="My Gallery">
      <template v-slot>
        <ion-content>
          <ion-list>
            <ion-item button :routerLink="'/tabs/images'">
              <ion-label>
                <ion-icon :icon="images" slot="start" />
                Gallery
              </ion-label>
            </ion-item>
          </ion-list>
        </ion-content>
      </template>
    </HeaderBar>

    <ion-content :fullscreen="true" ref="content">
      <ion-grid>
        <ion-row>
          <ion-col size="4" v-for="(image, index) in imagesList" :key="index">
            <ion-img :src="getImageUrl(image)" class="gallery-image"></ion-img>
          </ion-col>
        </ion-row>
      </ion-grid>

      <ion-fab vertical="bottom" horizontal="center" slot="fixed" class="custom-fab">
        <ion-fab-button @click="uploadGalleryImage">
          <ion-icon :icon="add"></ion-icon>
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
  IonLabel, IonList, IonItem,
} from '@ionic/vue';
import {add, images} from "ionicons/icons";
import axios from "axios";
import {usePhotoGallery} from "@/composables/usePhotoGallery";
import {onMounted, ref} from "vue";
import HeaderBar from "@/components/HeaderBar.vue";

const { takePhotoGallery } = usePhotoGallery();
const token = ref(localStorage.getItem("accessToken"))

const imagesList = ref<string[]>([]);
const hasMore = ref(true);
const pageNr =ref(0);
const pageSize = 100;

onMounted(() => {
  fetchMyGalleryMetadata()
});

const fetchMyGalleryMetadata = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/api/v1/gallery/myImages`, {headers: {Authorization: `Bearer ${token.value}`}});
    console.log("This is the response data: " + response.data);
    if (response.data.imagePaths.length > 0) {
      imagesList.value = [...imagesList.value, ...response.data.imagePaths];
      pageNr.value++;
    }
  } catch (error) {
    console.error('Error fetching gallery images:', error);
  }
};

const getImageUrl = (filepath:string) => {
  return `http://localhost:8080/api/v1/gallery/images/${filepath}?format=webp`;
};


</script>

<style scoped>

</style>