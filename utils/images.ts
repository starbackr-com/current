import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, ImageResult } from 'expo-image-manipulator';

export async function pickSingleImage() {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 1,
  });
  if (result.canceled) {
    throw new Error('User cancelled');
  }
  return result.assets[0];
}

export async function resizeImageSmall(image: ImagePicker.ImagePickerAsset) {
  if (image.width < 1080 && image.height < 1080) {
    const manipResult = await manipulateAsync(image.uri, [], { compress: 1 });
    return manipResult;
  }
  const manipResult = await manipulateAsync(
    image.uri,
    [
      image.width > image.height
        ? { resize: { width: 1080 } }
        : { resize: { height: 1080 } },
    ],
    { compress: 0.5 },
  );
  return manipResult;
}

export async function uploadJpeg(
  image: ImageResult,
  pubkey: string,
  bearerToken: string,
) {
  const filename = image.uri.split('/').pop();
  const formData = new FormData();
  //@ts-ignore
  formData.append('asset', {
    uri: image.uri,
    name: filename,
    type: 'image/jpeg',
  });
  formData.append(
    'name',
    `${pubkey.slice(0, 16)}/uploads/image${Math.floor(
      Math.random() * 10000000,
    )}.jpg`,
  );
  formData.append('type', 'image');
  const response = await fetch(`${process.env.BASEURL}/upload`, {
    method: 'POST',
    body: formData,
    headers: {
      'content-type': 'multipart/form-data',
      Authorization: `Bearer ${bearerToken}`,
    },
  });
  const data = await response.json();
  if (data.error || !data.data) {
    throw new Error('Could not upload image')
  }
  return data.data;
}
