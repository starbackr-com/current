import React from 'react';
import 'text-encoding-polyfill';
import { Provider } from 'react-redux';
import PolyfillCrypto from 'react-native-webview-crypto';
// eslint-disable-next-line import/no-extraneous-dependencies
import { RootSiblingParent } from 'react-native-root-siblings';
import 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto';
import { store } from './store/store';
import Root from './Root';
import { injectStore } from './utils/nostrV2/Event';

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
