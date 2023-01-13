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
import { usePostLoginMutation } from "./services/walletApi";
import { loginToWallet } from "./utils/wallet";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();


const Root = () => {
    const [appIsReady, setAppIsReady] = useState();
    const dispatch = useDispatch();
    const {isLoggedIn, walletExpires} = useSelector((state) => state.auth);


    useEffect(() => {
        const prepare = async () => {
            try {
                const privKey = await getValue("privKey");
                await loadAsync({
                    "Montserrat-Regular": require("./assets//Montserrat-Regular.ttf"),
                    "Montserrat-Bold": require("./assets//Montserrat-Bold.ttf"),
                });
                if (privKey) {
                    console.log("Initialising from storage...");
                    const { access_token } = loginToWallet(privKey);
                    dispatch(logIn({ bearer: access_token }));
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
        <NavigationContainer
            onStateChange={async () => {
                if (isLoggedIn && new Date() > walletExpires) {
                    const privKey = await getValue("privKey");
                    const { access_token } = loginToWallet(privKey);
                    dispatch(logIn({ bearer: access_token }));
                    console.log('Token refreshed')
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
