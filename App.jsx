import React from 'react';
import 'text-encoding-polyfill';
import { Provider } from 'react-redux';
import PolyfillCrypto from 'react-native-webview-crypto';
// eslint-disable-next-line import/no-extraneous-dependencies
import { RootSiblingParent } from 'react-native-root-siblings';
import 'react-native-gesture-handler';
import * as Sentry from 'sentry-expo';
import 'react-native-url-polyfill/auto';
import { store } from './store/store';
import Root from './Root';
import { injectStore } from './utils/nostrV2/Event';

Sentry.init({
  dsn: 'https://6eeb5d8293007168f999426b87babb1f@o4505690316406784.ingest.sentry.io/4505703093960704',
  enableInExpoDevelopment: true,
  debug: true,
});

const App = () => {
  injectStore(store);
  return (
    <Provider store={store}>
      <RootSiblingParent>
        <PolyfillCrypto />
        <Root />
      </RootSiblingParent>
    </Provider>
  );
};

export default App;
