import {
    storage,
    STORAGE_BUCKET_ID,
    ID
} from '@/lib/appwrite';

export async function uploadImage(file, userId) {

    try {

        const fileId = ID.unique();

        const result = await storage.createFile(
            STORAGE_BUCKET_ID,
            fileId,
            file
        );
const projectId = '698b2fb9001ae3002d3a';
        const imageUrl = `https://fra.cloud.appwrite.io/v1/storage/buckets/${STORAGE_BUCKET_ID}/files/${result.$id}/view?project=${projectId}`;

        return {
            success: true,
            fileId: result.$id,
            imageUrl:imageUrl
        };

    } catch (error) {
console.error("Upload error:", error);
        return {
            success: false,
            error: error.message
        };

    }

}

export function previewImage(file) {

    return new Promise((resolve) => {

        const reader = new FileReader();

        reader.onloadend = () => {
            resolve(reader.result);
        };

        reader.readAsDataURL(file);

    });

}