import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import globalStyles from "../../styles/globalStyles";
import Input from "../../components/Input";
import { generateMnemonic } from "../../utils/keys";
import { useCheckUsernameQuery } from "../../services/walletApi";
import CustomButton from "../../components/CustomButton";
import LoadingSpinner from "../../components/LoadingSpinner";

const UsernameScreen = ({ navigation,  route }) => {
    const [skip, setSkip] = useState(true);
    const [username, setUsername] = useState("");
    const [available, setAvailable] = useState();
    const [isFetching, setIsFetching] = useState();
    const { data, error, isLoading } = useCheckUsernameQuery(username, {
        skip,
    });

    const {privKey, isImport, publishProfile} = route.params
 
    const fetchAvailableUsernames = async (username) => {
        const response = await fetch(
            `https://getcurrent.io/checkuser?name=${username}`
        );
        const data = await response.json();
        setAvailable(data.available);
        setIsFetching(false);
    };

    useEffect(() => {
        let timer;
        if (username.length >= 4) {
            setIsFetching(true);
            timer = setTimeout(() => {
                fetchAvailableUsernames(username);
            }, 1000);
        }
        return () => {
            clearTimeout(timer);
        };
    }, [username]);

    const createKeysHandler = async (address) => {
        navigate("ShowBackup", { mem, address });
    };

    const nextHandler = (address) => {
        if (isImport && !publishProfile) {
            console.log(privKey)
            navigation.navigate('LoadingProfileScreen', {privKey, address, publishProfile: false})
            return;
        }
        navigation.navigate('CreateProfileScreen', {privKey, address})
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
                <Input
                    label="Choose Username"
                    inputStyle={{ width: "50%" }}
                    textInputConfig={{
                        value: username,
                        onChangeText: (value) => {
                            setUsername(value.toLowerCase());
                        },
                        autoCapitalize: "none",
                        autoCorrect: false
                    }}
                />
                {data?.names ? (
                    <Text
                        style={[
                            globalStyles.textBody,
                            { color: "red", fontSize: 12, marginTop: 8 },
                        ]}
                    >
                        Username already taken!
                    </Text>
                ) : undefined}
            </View>
            {isFetching ? <LoadingSpinner size={50} /> : undefined}
            <View style={{ width: "100%", alignItems: "center" }}>
                {available && !isFetching ? (
                    <Text style={[globalStyles.textBody, { marginBottom: 32 }]}>
                        Select your username
                    </Text>
                ) : undefined}
                {available && !isFetching
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
            </View>
        </View>
    );
};

export default UsernameScreen;
