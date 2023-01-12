import { StatusBar } from "expo-status-bar";
import "text-encoding-polyfill";
import { NavigationContainer } from "@react-navigation/native";
import { store } from "./store/store";
import { Provider } from "react-redux";
import "react-native-get-random-values";
import PolyfillCrypto from "react-native-webview-crypto";
import Root from "./Root";



const App = () => {
    return (
        <Provider store={store}>
            <PolyfillCrypto />
            <NavigationContainer>
                <StatusBar style="light" />
                <Root/>
            </NavigationContainer>
        </Provider>
    );
};

export default App;
