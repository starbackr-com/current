import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";
import HomeView from "../views/HomeView";
import { createStackNavigator } from "@react-navigation/stack";
import TwitterModal from "../views/welcome/TwitterModal";
import colors from "../styles/colors";
import WalletNavigator from "./WalletNavigator";
import Input from "../components/Input";
import CustomButton from "../components/CustomButton";
import { postEvent } from "../utils/nostr";
import SettingsNavigator from "./SettingsNavigator";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import ProfileScreen from "../views/ProfileScreen";
import SearchScreen from "../views/SearchScreen";
import globalStyles from "../styles/globalStyles";
import { useGetWalletBalanceQuery } from "../services/walletApi";
import { useIsFocused } from "@react-navigation/native";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = ({ navigation }) => {

    const { data, refetch } = useGetWalletBalanceQuery(null, {
        refetchOnFocus: true,
        skip: !useIsFocused(),
    });
    console.log(data)
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === "Home") {
                        iconName = focused ? "home-sharp" : "home-outline";
                    } else if (route.name === "Wallet") {
                        iconName = focused ? "wallet" : "wallet-outline";
                    } else if (route.name === "Settings") {
                        iconName = focused ? "settings" : "settings-outline";
                    } else if (route.name === "Search") {
                        iconName = focused
                            ? "heart-circle"
                            : "heart-circle-outline";
                    } else if (route.name === "New") {
                        iconName = focused
                            ? "add-circle"
                            : "add-circle-outline";
                    }
                    return (
                        <Ionicons name={iconName} size={size} color={color} />
                    );
                },
                headerStyle: { backgroundColor: "#222222" },
                headerTitleStyle: { color: "white", fontFamily: 'Montserrat-Bold', },
                headerTintColor: "red",
                tabBarActiveTintColor: colors.primary500,
                tabBarInactiveTintColor: "gray",
                tabBarStyle: {
                    backgroundColor: "#222222",
                    borderTopColor: colors.primary50,
                },
                tabBarShowLabel: false,
                headerShadowVisible: false,
                headerRight: () => <View style={{flexDirection:'row', marginRight: 12, alignItems: 'center', justifyContent: 'center'}}><Text style={globalStyles.textBody}>{data ? `${data.BTC.AvailableBalance}` : '----'}</Text><Text style={[globalStyles.textBody, {fontFamily: 'Satoshi-Symbol', marginLeft: 6, fontSize: 20}]}>S</Text></View>
            })}
        >
            <Tab.Screen name="Home" component={HomeView} />
            <Tab.Screen name="Wallet" component={WalletNavigator} />
            <Tab.Screen
                name="New"
                component={WalletNavigator}
                options={({ navigation }) => ({
                    tabBarButton: (props) => (
                        <Pressable
                            {...props}
                            onPress={() => navigation.navigate("PostModal")}
                        />
                    ),
                })}
            />
            <Tab.Screen name="Search" component={SearchScreen} />
            <Tab.Screen name="Settings" component={SettingsNavigator} />
        </Tab.Navigator>
    );
};

const PostModal = ({ navigation }) => {
    const [content, setContent] = useState();
    return (
        <View style={[globalStyles.screenContainer]}>
            <Text style={globalStyles.textH1}>Create a post</Text>
            <Input
                inputStyle={{ flex: 3 }}
                textInputConfig={{ onChangeText: setContent }}
            />
            <View style={{ flex: 1, justifyContent: "center" }}>
                <CustomButton
                    text="Send"
                    buttonConfig={{
                        onPress: async () => {
                            const result = await postEvent(content);
                            navigation.goBack();
                        },
                    }}
                />
            </View>
        </View>
    );
};

const AuthedNavigator = () => {
    return (
        <>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="MainTabNav" component={TabNavigator} />
                <Stack.Screen
                    name="TwitterModal"
                    component={TwitterModal}
                    options={{ presentation: "modal" }}
                />
                <Stack.Screen
                    name="PostModal"
                    component={PostModal}
                    options={{ presentation: "modal" }}
                />
                <Stack.Screen
                    name="ProfileModal"
                    component={ProfileScreen}
                    options={{ presentation: "modal" }}
                />
            </Stack.Navigator>
        </>
    );
};

export default AuthedNavigator;
