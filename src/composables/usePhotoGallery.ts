import {ref} from 'vue';
import {Camera, CameraResultType, CameraSource} from '@capacitor/camera';

const photos = ref<UserPhoto[]>([]);

export const usePhotoGallery = () => {
    const takePhotoGallery = async () => {
        const photo = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            quality: 100,
        });
        const fileName = Date.now() + '.jpeg';
        const savedFileImage = {
            filepath: fileName,
            webviewPath: photo.webPath,
        };

        photos.value = [savedFileImage, ...photos.value];
    };

    const takePhotoProfile = async() => {
        const cameraPhoto = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            quality: 100,
        });
        if (!cameraPhoto.webPath) {
            throw new Error('Photo path is undefined');
        }

        const response = await fetch(cameraPhoto.webPath);
        return await response.blob();

    }
    const choosePhotoFromPhone = async() => {
        const photo = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Photos,
            quality: 100 // Set the quality (0-100)
        });
        const fileName = new Date().getTime() + '.jpeg';
        const savedFileImage = {
            filepath: fileName,
            webviewPath: photo.webPath
        };

        if (!photo.webPath) {
            throw new Error('Gallery photo path is undefined');
        }

        const response = await fetch(photo.webPath);
        return await response.blob();
    };

    return {
        photos,
        takePhotoGallery,
        takePhotoProfile,
        choosePhotoFromPhone
    };
};

export interface UserPhoto {
    filepath: string;
    webviewPath?: string;
}
