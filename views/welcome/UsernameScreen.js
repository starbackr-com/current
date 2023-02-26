import { View, Text, Keyboard } from "react-native";
import React, { useState } from "react";
import globalStyles from "../../styles/globalStyles";
import Input from "../../components/Input";
import CustomButton from "../../components/CustomButton";
import LoadingSpinner from "../../components/LoadingSpinner";

const UsernameScreen = ({ navigation, route }) => {
    const [error, setError] = useState(false);
    const [username, setUsername] = useState("");
    const [available, setAvailable] = useState();
    const [isFetching, setIsFetching] = useState();

    const { privKey, isImport, publishProfile, updateData, oldData } = route.params;
    console.log(oldData)

    const fetchAvailableUsernames = async () => {
        setError(false)
        if (!username.match(/^[a-z0-9]{4,32}$/i)) {
            setError(true)
            return;
        }
        Keyboard.dismiss();
        setIsFetching(true);
        const response = await fetch(
            `https://getcurrent.io/checkuser?name=${username}`
        );
        const data = await response.json();
        setAvailable(data.available);
        setIsFetching(false);
    };

    const nextHandler = (address) => {
        if (isImport && updateData === 'none') {
            navigation.navigate("LoadingProfileScreen", {
                privKey,
                address,
                publishProfile: false,
            });
            return;
        } else if (isImport && updateData === 'ln') {
            navigation.navigate("CreateProfileScreen", {
                privKey,
                address,
                publishProfile: true,
                oldData,
                updateData
            });
            return;
        }
        navigation.navigate("CreateProfileScreen", { privKey, address });
    };

    return (
        <View style={globalStyles.screenContainer}>
            <Text style={[globalStyles.textBodyBold, { textAlign: "center" }]}>
                Choose your username
            </Text>
            <Text style={globalStyles.textBody}>
                Your username can be used to find you on nostr, but also to
                receive payments on the Lightning Network.
            </Text>
            <View></View>
            <View style={{ width: "100%", alignItems: "center", margin: 32 }}>
                <View style={{ width: "60%", flexDirection: "row", alignItems: 'center', justifyContent: 'center' }}>
                    <Input
                        textInputConfig={{
                            value: username,
                            onChangeText: (value) => {
                                setUsername(value.toLowerCase());
                            },
                            autoCapitalize: "none",
                            autoCorrect: false,
                        }}
                    />
                    <CustomButton
                        icon="search"
                        containerStyles={{ marginLeft: 6 }}
                        buttonConfig={{ onPress: fetchAvailableUsernames }}
                    />
                </View>
            </View>
            {isFetching ? <LoadingSpinner size={50} /> : undefined}
            <View style={{ width: "100%", alignItems: "center" }}>
                {available && available.length > 0 && !isFetching && !error ? (
                    <Text style={[globalStyles.textBody, { marginBottom: 32 }]}>
                        Choose one from the list below
                    </Text>
                ) : undefined}
                {available && available.length > 0 && !isFetching && !error
                    ? available.map((nip05) => (
                          <CustomButton
                              key={nip05}
                              text={nip05}
                              containerStyles={{
                                  width: "80%",
                                  marginBottom: 18,
                              }}
                              buttonConfig={{
                                  onPress: nextHandler.bind(this, nip05),
                              }}
                          />
                      ))
                    : undefined}
                    {available && available.length === 0 && !isFetching && !error ? <Text style={globalStyles.textBody}>That username is taken...</Text> : undefined}
                    {error ? <Text style={globalStyles.textBodyError}>Usernames must be between 4 and 32 chars and can only contain a-z, 0-9</Text> : undefined}
            </View>
        </View>
    );
};

export default UsernameScreen;
