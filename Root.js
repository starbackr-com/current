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
import { getPublicKey } from "nostr-tools";
import { updateFollowedUsers } from "./utils/nostrV2/getUserData";
import { hydrateStore } from "./utils/cache/asyncStorage";
import { initRelayPool } from "./utils/nostrV2/relayPool";

SplashScreen.preventAutoHideAsync();

const Root = () => {
    const [appIsReady, setAppIsReady] = useState(false);
    const dispatch = useDispatch();
    const { isLoggedIn, walletExpires } = useSelector((state) => state.auth);

    const refreshToken = async () => {
        if (isLoggedIn && Date.now() > walletExpires) {
            const sk = await getValue("privKey");
            const pk = getPublicKey(sk);
            const {
                data: { access_token, username },
            } = await loginToWallet(sk);
            dispatch(logIn({ bearer: access_token, username, pubKey: pk }));
        }
    };

    useEffect(() => {
        const prepare = async () => {
            try {
                await initRelayPool();
                await init();
                await hydrateFromDatabase();
                await hydrateStore();
                const privKey = await getValue("privKey");
                await loadAsync({
                    "Montserrat-Regular": require("./assets/Montserrat-Regular.ttf"),
                    "Montserrat-Bold": require("./assets/Montserrat-Bold.ttf"),
                    "Satoshi-Symbol": require("./assets/Satoshi-Symbol.ttf"),
                });
                if (privKey) {
                    const {
                        data: { access_token, username },
                    } = await loginToWallet(privKey);
                    const pubKey = await getPublicKey(privKey);
                    dispatch(logIn({ bearer: access_token, username, pubKey }));
                    await updateFollowedUsers();
                }
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
        <NavigationContainer onStateChange={refreshToken}>
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
