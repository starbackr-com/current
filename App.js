import "text-encoding-polyfill";
import { store } from "./store/store";
import { Provider } from "react-redux";
import PolyfillCrypto from "react-native-webview-crypto";
import 'react-native-url-polyfill/auto';
import Root from "./Root";
import { injectStore } from "./utils/nostrV2/Event";
import AppStateChecker from "./components/AppStateChecker";

const App = () => {
    injectStore(store);
    return (
        <Provider store={store}>
            <AppStateChecker/>
            <PolyfillCrypto />
            <Root />
        </Provider>
    );
};

export default App;
