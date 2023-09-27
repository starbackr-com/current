import * as FileSystem from 'expo-file-system';

export async function downloadFileAndGetUri(url: string): Promise<string> {
  const filename = url.split('/').pop();
  try {
    const result = await FileSystem.downloadAsync(
      url,
      FileSystem.documentDirectory + filename,
    );
    return result.uri;
  } catch(e) {
    console.log(e);
    throw new Error('Could not download file');
  }
}
