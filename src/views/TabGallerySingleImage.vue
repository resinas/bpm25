<template>
  <ion-page>
    <HeaderBar name="" />
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/images"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ imagePath }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-img :src="image"></ion-img>
      <ion-card>
        <ion-card-content class="Published-text">
          Published by: {{ imageData.imageAuthor }}
        </ion-card-content>
        <ion-card-content class="Likes-text">
          Likes: {{ imageData.imageLikes }}
        </ion-card-content>
        <ion-card-content>
          <ion-icon v-if="imageData.imageIsLiked" :icon="thumbsUp" class="like-icon" @click="changeLikeStatus"></ion-icon>
          <ion-icon v-else :icon="thumbsUpOutline" class="like-icon" @click="changeLikeStatus"></ion-icon>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {IonPage, IonContent, IonImg, IonButtons, IonBackButton, IonIcon} from "@ionic/vue";
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import HeaderBar from "@/components/HeaderBar.vue";
import axios from "axios";
import {thumbsUpOutline, thumbsUp} from "ionicons/icons";

const token = ref(localStorage.getItem("accessToken"))

const route = useRoute();
const imageData = ref({
  imageAuthor: '',
  imageLikes: 0,
  imageIsLiked: false
});
const image = ref('');
const imagePath = route.params.imageId as string;

onMounted(() => {
  getImageData(imagePath);
  image.value = getImageUrl(imagePath);
});

const getImageData = async (filepath:string) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/v1/gallery/image/${filepath}?format=jpg`, { headers: { Authorization: `Bearer ${token.value}` } });
    imageData.value.imageAuthor = response.data.imageAuthor;
    imageData.value.imageLikes = response.data.imageLikes;
    imageData.value.imageIsLiked = response.data.hasLiked;

  } catch (e) {
    console.error('Error fetching image data:', e);
  }
};

const getImageUrl = (filepath:string) => {
  return `http://localhost:8080/api/v1/gallery/images/${filepath}?format=webp`;
};

const changeLikeStatus = async () => {
  try{
    console.log(imagePath);
    await axios.put(`http://localhost:8080/api/v1/account/changeLikeStatusGalleyImage`, {
      likes: !imageData.value.imageIsLiked,
      path: imagePath
    }, { headers: { Authorization: `Bearer ${token.value}` } })
    imageData.value.imageIsLiked = !imageData.value.imageIsLiked;
    if (imageData.value.imageIsLiked) {
      imageData.value.imageLikes = imageData.value.imageLikes + 1;
    } else {
      imageData.value.imageLikes = imageData.value.imageLikes - 1;
    }
  } catch (e) {
    console.error('Error changing like status:', e);
  }
}

</script>

<style scoped>
.like-icon{
  font-size: 32px;
}
ion-card{
  background-color: transparent;
  margin-top: -2%;
  margin-left: -1%;
}

.Published-text{
  font-size: 18px;

}
.Likes-text{
  font-size: 16px;
  margin-top: -10%;
}
</style>