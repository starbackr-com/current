import { useWindowDimensions, View } from "react-native";
import React from "react";
import { getPublicKey } from "nostr-tools";
import { getValue, saveValue } from "./utils/secureStore";
import { useState, useCallback, useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useSelector, useDispatch } from "react-redux";
import { logIn, setBearer } from "./features/authSlice";
import UnauthedNavigator from "./nav/UnauthedNavigator";
import { loadAsync } from "expo-font";
import AuthedNavigator from "./nav/AuthedNavigator";
import { usePostLoginMutation } from "./services/walletApi";
import { loginToWallet } from "./utils/wallet";

SplashScreen.preventAutoHideAsync();

const RootNav = () => {
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

    return (
        <>{isLoggedIn == false ? <UnauthedNavigator /> : <AuthedNavigator />}</>
    );
};

const Root = () => {
    const [appIsReady, setAppIsReady] = useState();
    const dispatch = useDispatch();
    const [login] = usePostLoginMutation();

    useEffect(() => {
        const prepare = async () => {
            try {
                const privKey = await getValue("privKey");
                await loadAsync({
                    "Montserrat-Regular": require("./assets//Montserrat-Regular.ttf"),
                    "Montserrat-Bold": require("./assets//Montserrat-Bold.ttf"),
                });
                if (privKey) {
                    console.log('Initialising from storage...')
                    const { access_token } = loginToWallet(privKey)
                    dispatch(logIn({bearer: access_token}));
                }
                await new Promise((resolve) => setTimeout(resolve, 4000));
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
        <View style={{flex: 1}} onLayout={onLayoutRootView}>
            <RootNav />
        </View>
    );
};

export default Root;
