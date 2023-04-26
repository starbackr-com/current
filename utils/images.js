import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

async function resizeImage(image) {
  const manipResult = await manipulateAsync(
    image.localUri || image.uri,
    [{ resize: { width: 1080 } }],
    { compress: 1, format: SaveFormat.PNG },
  );
  return manipResult;
}

async function uploadImage(image, pubKey, bearer) {
  const id = pubKey.slice(0, 16);
  const localUri = image.uri;
  const filename = localUri.split('/').pop();
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : 'image';
  const formData = new FormData();
  formData.append('asset', { uri: localUri, name: filename, type });
  formData.append(
    'name',
    `${id}/uploads/image${Math.floor(Math.random() * 10000000)}.${match[1]}`,
  );
  formData.append('type', 'image');
  const response = await fetch(`${process.env.BASEURL}/upload`, {
    method: 'POST',
    body: formData,
    headers: {
      'content-type': 'multipart/form-data',
      Authorization: `Bearer ${bearer}`,
    },
  });
  const data = await response.json();
  return data;
}

async function pickImageResizeAndUpload(pk, bearer) {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    quality: 1,
  });

  if (!result.canceled) {
    result = await resizeImage(result.assets[0]);
    const data = await uploadImage(result, pk, bearer);
    console.log(data);
    return data;
  }
  return { error: true, data: '' };
}

export default pickImageResizeAndUpload;
