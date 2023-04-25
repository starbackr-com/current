import 'text-encoding-polyfill';
import { Provider } from 'react-redux';
import PolyfillCrypto from 'react-native-webview-crypto';
import { store } from './store/store';
import 'react-native-url-polyfill/auto';
import Root from './Root';
import { injectStore } from './utils/nostrV2/Event';
import React, { useRef, useEffect, useState } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';



function App() {
  const notificationListener = useRef();
  const responseListener = useRef();

  const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

  TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error, executionInfo }) => {
    console.log('Received a notification in the background!');
    if (error) {
      report.log("error occurred");
    }

      console.log('Notification in background received: ' + JSON.stringify(data))
      let newNotification = new MyNotification(
        getFormattedDate(new Date()),
        data?.notification.data.title || 'Title',
        data?.notification.data.message || 'Message'
      )
  });

  /*
  Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
  });

  */





  Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);





  //const [notification, setNotification] = useState(false);

  //const lastNotificationResponse = Notifications.useLastNotificationResponse();

  useEffect(() => {


    //this is triggered when the user touches the notification to open the app
     const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('response: ', response.notification.request.content);
      //set the badge count to 0
      Notifications.setBadgeCountAsync(0);
    });

    console.log('badge', Notifications.getBadgeCountAsync());

    //this receives notification when the app is on the foreground
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
    console.log('nostidy: ', notification.request.content.data);
  });




  }, []);


  injectStore(store);
  return (
    <Provider store={store}>
      <PolyfillCrypto />
      <Root />
    </Provider>
  );
};



export default App;
