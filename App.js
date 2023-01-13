import "text-encoding-polyfill";
import { store } from "./store/store";
import { Provider } from "react-redux";
import "react-native-get-random-values";
import PolyfillCrypto from "react-native-webview-crypto";
import Root from "./Root";



const App = () => {
    return (
        <Provider store={store}>
            <PolyfillCrypto />
                <Root/>
        </Provider>
    );
};

export default App;
