import React, {useRef, useState, useEffect} from 'react';
import {AppState, StyleSheet, Text, View} from 'react-native';
import { disconnectRelays, reconnectRelays } from '../utils/nostrV2';

const AppStateChecker = () => {
    const appState = useRef(AppState.currentState);
    let timer; 
    useEffect(() => {
      const subscription = AppState.addEventListener('change', nextAppState => {
        clearTimeout(timer)
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
            console.log('Runs!')
          reconnectRelays();
        }

        if (nextAppState === 'background') {
            timer = setTimeout(() => {
                console.log('In background for 30 seconds... disconnecting from relays...')
                disconnectRelays();
            }, 30000)
        }
  
        appState.current = nextAppState;
      });
  
      return () => {
        subscription.remove();
      };
    }, []);
  return (
    <>
    </>
  )
}

export default AppStateChecker