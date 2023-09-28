import * as StoreReview from 'expo-store-review';

export function requestReview() {
  StoreReview.isAvailableAsync().then((isAvailable) => {
    if (isAvailable) {
      StoreReview.requestReview();
    }
  });
}
