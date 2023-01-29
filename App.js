import "text-encoding-polyfill";
import { store } from "./store/store";
import { Provider } from "react-redux";
import PolyfillCrypto from "react-native-webview-crypto";
import Root from "./Root";
import { injectStore } from "./utils/nostr/Event";



const App = () => {
    injectStore(store);
    return (
        <Provider store={store}>
            <PolyfillCrypto />
                <Root/>
        </Provider>
    );
};

export default App;
