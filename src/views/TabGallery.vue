<template>
  <ion-page>
    <HeaderBar name="Gallery" @openActionSheet="openActionSheet" @reloadPage="reloadPage"></HeaderBar>

    <ion-content :fullscreen="true" ref="content">
      <ion-grid>
        <ion-row>
          <ion-col size="4" v-for="(image, index) in images" :key="index">
            <ion-img :src="getImageUrl(image)" class="gallery-image" :class="{ 'selected-image': imagesSelectedList.includes(image) }" @click="selectMultiple ? selectImage(image) : goToImage(image)"></ion-img>
          </ion-col>
        </ion-row>
      </ion-grid>
      <!-- Infinite Scroll -->
      <ion-infinite-scroll @ionInfinite="loadMore" threshold="10%">
        <ion-infinite-scroll-content
            loading-spinner="bubbles"
            loading-text="Loading more photos...">
        </ion-infinite-scroll-content>
      </ion-infinite-scroll>

      <ion-fab v-if="selectMultiple" vertical="bottom" horizontal="center" slot="fixed" class="custom-fab">
        <ion-fab-button  @click="untoggleSelectImage">
          <ion-icon :icon="close"></ion-icon>
        </ion-fab-button>
        <ion-fab-button  @click="downloadImages">
          <ion-icon :icon="download"></ion-icon>
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
  InfiniteScrollCustomEvent,  actionSheetController,
} from '@ionic/vue';
import {close, download} from 'ionicons/icons';
import { usePhotoGallery } from '@/composables/usePhotoGallery';
import HeaderBar from "@/components/HeaderBar.vue";
import axios from "axios";
import {onMounted, Ref, ref} from "vue";
import router from "@/router";

const { takePhotoGallery } = usePhotoGallery();
const token = ref(localStorage.getItem("accessToken"))

const images = ref<string[]>([]);
const hasMore = ref(true);
const pageNr =ref(0);
const pageSize = 100;

const selectMultiple = ref(false);
const imagesSelectedList = ref<string[]>([]);

const content: Ref<InstanceType<typeof IonContent> | null> = ref(null);

onMounted(() => {
  fetchGalleryMetadata()
});


const actionSheet = ref<HTMLIonActionSheetElement | null>(null);
const openActionSheet = async () => {
  actionSheet.value = await actionSheetController.create({
    header: 'Gallery Options',
    buttons: [{
      text: 'Go to My Gallery',
      handler: () => {
        router.push('/tabs/images/myGallery');
      }
    }, {
      text: 'Select Images',
      handler: () => {
        selectMultiple.value = true;
      }
    }, {
      text: 'Upload image',
      handler: () => {
        uploadGalleryImage();
      }
    }]
  });
  return actionSheet.value.present();
};

const reloadPage = async () => {
  images.value = [];
  hasMore.value = true;
  pageNr.value = 0;
  await fetchGalleryMetadata();
}

const fetchGalleryMetadata = async () => {
  if (!hasMore.value) return;
  try {
    const response = await axios.get(`https://localhost:8080/api/v1/gallery/images`, {
      params: {
        pageNr: pageNr.value,
        pageSize: pageSize
      },
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    });
    if (response.data.imagePaths.length > 0) {
      images.value = [...images.value, ...response.data.imagePaths];
      pageNr.value++;
    } else {
      hasMore.value = false;
    }
  } catch (error) {
    console.error('Error fetching gallery images:', error);
  }
}

const getImageUrl = (filepath:string) => {
  return `https://localhost:8080/api/v1/gallery/images/${filepath}?format=webp`;
};

const getImageJPG = (filepath:string) => {
  return `https://localhost:8080/api/v1/gallery/images/${filepath}?format=jpg`;
};

const loadMore = async (event?:InfiniteScrollCustomEvent) => {
  await fetchGalleryMetadata();
  if (event) {
    await event.target.complete();
  }
};

const uploadGalleryImage = async () => {
  try {
    const photoBlob = await takePhotoGallery();
    const formData = new FormData();

    // Append the photo blob to the form data, the 'file' key should match the name expected in the backend
    formData.append('file', photoBlob as Blob);

    // Make the POST request with the form data and proper headers
    const uploadResponse = await axios.post("https://localhost:8080/api/v1/gallery/images", formData, {
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'multipart/form-data' // This might be optional as axios sets it automatically with the correct boundary
      }
    });
    if (uploadResponse.status === 200) {
      console.log('Upload successful');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
  }
}

const downloadImage = (filePath:string) => {
  const image = getImageJPG(filePath);
  fetch(image)
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filePath;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        self.postMessage('Download complete');
      })
      .catch(() => self.postMessage('Download failed'));
}

const downloadImages = () => {
  if (imagesSelectedList.value.length === 0) {
    console.log("Zero elements selected")
    return;
  }
  for (const image of imagesSelectedList.value) {
    downloadImage(image)
  }
  imagesSelectedList.value = [];
}

const selectImage = (imageId:string) => {
  if (imagesSelectedList.value.includes(imageId)) {
    imagesSelectedList.value = imagesSelectedList.value.filter(image => image !== imageId);
    return;
  }
  imagesSelectedList.value.push(imageId);
}

const untoggleSelectImage = () => {
  selectMultiple.value = false;
  imagesSelectedList.value = [];
}

const goToImage = (imageId:string) => {
  router.push(`/tabs/singleimage/${imageId}`);
}
</script>

<style scoped>
.selected-image {
  border: 2px solid #3880ff; /* Adjust as needed */
}
.gallery-image {
  width: 100%; /* Responsive width */
  height: 100px; /* Fixed height */
  object-fit: cover; /* Cover the container without distorting the aspect ratio */
}
.custom-fab {
  display: flex;
  flex-direction: row; /* Aligns children (fab buttons) in a row */
  justify-content: center; /* Centers the buttons horizontally */
  align-items: center; /* Aligns the buttons vertically at the center */
}
.custom-fab ion-fab-button:not(:last-child) {
  margin-right: 10px; /* Adds space to the right of each button except the last one */
}
</style>
