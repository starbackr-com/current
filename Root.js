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
import colors from "./styles/colors";

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

    useEffect(() => {
        const prepare = async () => {
            try {
                const privKey = await getValue("privKey");
                await loadAsync({
                    "Montserrat-Regular": require("./assets//Montserrat-Regular.ttf"),
                    "Montserrat-Bold": require("./assets//Montserrat-Bold.ttf"),
                });
                if (privKey) {
                    const pubKey = getPublicKey(privKey);
                    dispatch(logIn());
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
