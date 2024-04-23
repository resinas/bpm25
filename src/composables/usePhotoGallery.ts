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
        const originalBlob = await response.blob();

        try {
            console.log("I am running the processImage function now")
            return await processImage(originalBlob, 0.2, 800, 600);
        }catch (e) {
            console.log("Wasn't able to resize image with error:" + e);
            return originalBlob;
        }


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

    async function processImage(imageBlob:Blob, maxSize:number, maxHeight:number, maxWidth:number) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            console.log("This is before calling img.onload")
            img.onload = () => {
                console.log("This is after calling the img.onload")
                const canvas = document.createElement('canvas');
                let {width, height} = img;
                const scale = Math.min(maxWidth / width, maxHeight / height)
                console.log("This is in the beginning of the processImage function")

                // Only scales if the image is larger than given max sizes
                if (scale < 1) { // Only resize if the image is larger than the max dimensions
                    width *= scale;
                    height *= scale;
                }
                canvas.width = width;
                canvas.height = height;

                const convertedMaxSize = maxSize*1024*1024;

                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(img, 0, 0, width, height);
                }
                let quality = 1; // Start with 100% quality
                const step = 0.1; // Reduce quality by 10% each step

                console.log("This is before entering the recursion for downscaling")

                const reduceQualityParameter =  () => {
                    console.log("Resizing image with quality parameter: " + quality);
                    canvas.toBlob(blob => {
                        if (!blob) {
                            reject(new Error('Failed to convert canvas to blob'));
                            return;
                        }
                        if (blob.size <= convertedMaxSize || quality <= 0.6) {
                            resolve(blob); // Resolve if size is under limit or quality too low
                        } else {
                            quality -= step; // Reduce quality
                            reduceQualityParameter();
                        }
                    }, 'image/jpeg', quality);
                };
                reduceQualityParameter(); // Start the quality reduction process
            }
            img.onerror = () => {
                console.log("This is the img.onerror event");
                reject(new Error('Image load error'));
            }

            img.src = URL.createObjectURL(imageBlob);
            console.log("Image source is set, loading should begin");
        })

    }

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
