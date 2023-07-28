import 'text-encoding-polyfill';
import { Provider } from 'react-redux';
import PolyfillCrypto from 'react-native-webview-crypto';
import { store } from './store/store';
import 'react-native-url-polyfill/auto';
import Root from './Root';
import { injectStore } from './utils/nostrV2/Event';
import 'react-native-gesture-handler';
import React from 'react';
import { RootSiblingParent } from 'react-native-root-siblings';

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
