import * as FileSystem from "expo-file-system";

const imgDir = FileSystem.cacheDirectory + "img/";
const imgFileUri = async (imgUrl) => {
    let id = imgUrl.splice(0, 20);
    let ending = imgUrl.split(".").pop();
    console.log(`image_${imgHash}_200.${ending}`);
    return imgDir + `image_${id}_200.${ending}`;
};

async function ensureDirExists() {
    const dirInfo = await FileSystem.getInfoAsync(imgDir);
    if (!dirInfo.exists) {
        console.log("Image directory doesn't exist, creating...");
        await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true });
    }
}

export async function getSingleImage(imgUrl) {
    await ensureDirExists();

    const fileUri = imgFileUri(imgUrl);
    const fileInfo = await FileSystem.getInfoAsync(fileUri);

    if (!fileInfo.exists) {
        console.log("Image isn't cached locally. Downloading...");
        await FileSystem.downloadAsync(imgUrl, fileUri);
    }

    return fileUri;
}
