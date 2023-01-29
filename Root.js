import { View } from "react-native";
import React from "react";
import { getValue } from "./utils/secureStore";
import { useState, useCallback, useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useSelector, useDispatch } from "react-redux";
import { logIn } from "./features/authSlice";
import UnauthedNavigator from "./nav/UnauthedNavigator";
import { loadAsync } from "expo-font";
import AuthedNavigator from "./nav/AuthedNavigator";
import { loginToWallet } from "./utils/wallet";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { hydrateFromDatabase, init } from "./utils/database";
import { getEvents } from "./utils/nostr";
import { updateUsers } from "./utils/nostr/getNotes";
import { getPublicKey } from "nostr-tools";

SplashScreen.preventAutoHideAsync();

const Root = () => {
    const [appIsReady, setAppIsReady] = useState();
    const dispatch = useDispatch();
    const { isLoggedIn, walletExpires } = useSelector((state) => state.auth);

    useEffect(() => {
        const prepare = async () => {
            try {
                const privKey = await getValue("privKey");
                const username = await getValue("username");
                await loadAsync({
                    "Montserrat-Regular": require("./assets/Montserrat-Regular.ttf"),
                    "Montserrat-Bold": require("./assets/Montserrat-Bold.ttf"),
                    "Satoshi-Symbol": require("./assets/Satoshi-Symbol.ttf"),
                });
                if (privKey) {
                    console.log("Initialising from storage...");
                    const { access_token } = await loginToWallet(
                        privKey
                    );
                    const pubKey = await getPublicKey(privKey)
                    dispatch(logIn({ bearer: access_token, username, pubKey }));
                }
                await init();
                await hydrateFromDatabase();
                updateUsers();
            } catch (e) {
                console.warn(e);
            } finally {
                setAppIsReady(true);
            }
        };
        prepare();
    }, []);

    const onLayoutRootView = useCallback(() => {
        if (appIsReady) {
            SplashScreen.hideAsync();
        }
    }, [appIsReady]);

    if (!appIsReady) {
        return null;
    }
    return (
        <NavigationContainer
            onStateChange={async () => {
                if (isLoggedIn && new Date() > walletExpires) {
                    const privKey = await getValue("privKey");
                    const username = await getValue("username");
                    const { access_token } = loginToWallet(privKey, username);
                    dispatch(
                        logIn({ bearer: access_token, username: username })
                    );
                    console.log("Token refreshed");
                }
            }}
        >
            <StatusBar style="light" />
            <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
                {isLoggedIn == false ? (
                    <UnauthedNavigator />
                ) : (
                    <AuthedNavigator />
                )}
            </View>
        </NavigationContainer>
    );
};

export default Root;
