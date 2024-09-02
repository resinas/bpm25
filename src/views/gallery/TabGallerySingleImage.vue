<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/images"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ imagePath }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-card>
        <img :src="image" />
        <ion-card-content class="Published-text">
          Published by:
          <ion-chip :router-link="`/attendee/${imageData.authorId}`" >
            <ion-avatar>
              <img :src="imageData.imageAuthorAvatar || 'https://ionicframework.com/docs/img/demos/avatar.svg'" alt="Profile picture" />
            </ion-avatar>
            <ion-label>{{ imageData.imageAuthor }}</ion-label>
          </ion-chip>
        </ion-card-content>
        <ion-card-content class="Likes-text">
          Likes: {{ imageData.imageLikes }}
        </ion-card-content>
        <ion-card-content >
          <ion-icon v-if="imageData.imageIsLiked" :icon="thumbsUp" class="like-icon" @click="changeLikeStatus"></ion-icon>
          <ion-icon v-else :icon="thumbsUpOutline" class="like-icon" @click="changeLikeStatus"></ion-icon>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonImg,
  IonButtons,
  IonBackButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonTitle,
  IonToolbar,
  IonHeader,
  IonAvatar, IonLabel, IonChip,
} from "@ionic/vue";
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
  imageIsLiked: false,
  authorId: 0,
  imageAuthorAvatar: ''
});
const image = ref('');
const imagePath = route.params.imageId as string;

onMounted(() => {
  getImageData(imagePath);
  image.value = getImageUrl(imagePath);
});

const getImageData = async (filepath:string) => {
  try {
    const response = await axios.get(`https://localhost:8080/api/v1/gallery/image/${filepath}?format=jpg`, { headers: { Authorization: `Bearer ${token.value}` } });
    imageData.value.imageAuthor = response.data.imageAuthor;
    imageData.value.imageLikes = response.data.imageLikes;
    imageData.value.imageIsLiked = response.data.hasLiked;
    imageData.value.authorId = response.data.authorId;
    imageData.value.imageAuthorAvatar = await getAvatarImage(response.data.authorId);

  } catch (e) {
    console.error('Error fetching image data:', e);
  }
};

const getImageUrl = (filepath:string) => {
  return `https://localhost:8080/api/v1/gallery/images/${filepath}?format=webp`;
};

const changeLikeStatus = async () => {
  try{
    console.log(imagePath);
    await axios.put(`https://localhost:8080/api/v1/gallery/changeLikeStatusGalleyImage`, {
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

const getAvatarImage = async (id:number) => {
  try {
    const response = await axios.get(`https://localhost:8080/api/v1/account/getProfilePicture/${id}`, {
      headers: { Authorization: `Bearer ${token.value}` },
      params: {
        format: 'webp'
      },
      responseType: 'blob'  // This tells axios to expect a binary response instead of JSON
    });
    if (response.data.size === 0) {
      return '';
    }
    return URL.createObjectURL(response.data);  // Convert the blob to a URL and return it
  } catch (error) {
    console.error("Error fetching image:", error);
    return '';  // Return an empty string or a default image path in case of error
  }
}

</script>

<style scoped>
.like-icon{
  font-size: 32px;
}

.Published-text{
  font-size: 18px;
}
.Likes-text{
  font-size: 16px;
  margin-top: -8%;
}
</style>