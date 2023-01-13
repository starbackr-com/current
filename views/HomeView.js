import { View, Text, Button, StyleSheet } from "react-native";
import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { loginToWallet } from "../utils/wallet";
import globalStyles from "../styles/globalStyles";
import { createStackNavigator } from "@react-navigation/stack";

const HomeStack = createStackNavigator();
const TestStack = createStackNavigator();

const HomeScreen = ({ navigation }) => {
    const { privKey, pubKey, walletExpires } = useSelector(
        (state) => state.auth
    );

    const twitterModalShown = useSelector(
        (state) => state.intro.twitterModalShown
    );
    const onLayoutView = useCallback(() => {
        if (!twitterModalShown) {
            console.log(twitterModalShown);
            navigation.navigate("TwitterModal");
        }
    }, []);

    return (
        <View style={styles.container} onLayout={onLayoutView}>
            <Text style={styles.createKeyText}>Feed will go here...</Text>
            <Text style={globalStyles.textBody}>
                Wallet expires in{" "}
                {Math.round(walletExpires - new Date()) / 1000}
            </Text>
            <Button
                title="Testing"
                onPress={() => {
                    navigation.navigate("TwitterModal");
                }}
            />
        </View>
    );
};

const HomeView = () => {
    return (
        <HomeStack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
        </HomeStack.Navigator>
    );
};

export default HomeView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#18181b",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
    },

    createKeyText: {
        color: "white",
        textAlign: "center",
        margin: 12,
    },
});
