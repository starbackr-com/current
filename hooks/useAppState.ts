import { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

const useAppState = (): AppStateStatus => {
  const [appState, setAppState] = useState(AppState.currentState);
  function handleStateChange(newState: AppStateStatus) {
    setAppState(newState);
  }
  useEffect(() => {
    const appStateListener = AppState.addEventListener(
      'change',
      handleStateChange,
    );
    return () => {
      appStateListener.remove();
    };
  });
  return appState;
};

export default useAppState;
