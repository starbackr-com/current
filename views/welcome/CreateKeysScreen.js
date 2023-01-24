import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import globalStyles from "../../styles/globalStyles";
import Input from "../../components/Input";
import { generateMnemonic } from "../../utils/keys";
import { useCheckUsernameQuery } from "../../services/walletApi";
import CustomButton from "../../components/CustomButton";
import LoadingSpinner from "../../components/LoadingSpinner";

const CreateKeysScreen = ({ navigation: { navigate } }) => {
    const [skip, setSkip] = useState(true);
    const [username, setUsername] = useState("");
    const [available, setAvailable] = useState();
    const [isFetching, setIsFetching] = useState();
    const { data, error, isLoading } = useCheckUsernameQuery(username, {
        skip,
    });

    const fetchAvailableUsernames = async (username) => {
        const response = await fetch(
            `https://getcurrent.io/checkuser?name=${username}`
        );
        const data = await response.json();
        setAvailable(data.available);
        setIsFetching(false);
    };

    useEffect(() => {
        setIsFetching(true);
        let timer = setTimeout(() => {
            fetchAvailableUsernames(username);
        }, 1000);
        return () => {
            clearTimeout(timer);
        };
    }, [username]);

    const createKeysHandler = async (address) => {
        const mem = await generateMnemonic();
        navigate("ShowBackup", { mem, address });
    };

    return (
        <View style={globalStyles.screenContainer}>
            <Text style={globalStyles.textH1}>Choose your username</Text>
            <Text style={globalStyles.textBody}>
                Your username can be used to find you on nostr, but also to send
                you Tips on the Lightning Network.{" "}
            </Text>
            <View>
                
            </View>
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
            <View style={{width:'100%', alignItems: 'center'}}>
                {available && !isFetching ? (
                    <Text style={[globalStyles.textBody, {marginBottom: 32}]}>
                        Select your username
                    </Text>
                ) : undefined}
                {available && !isFetching
                    ? available.map((nip05) => (
                          <CustomButton
                              text={nip05}
                              containerStyles={{
                                  width: "80%",
                                  marginBottom: 18,
                              }}
                              buttonConfig={{
                                  onPress: createKeysHandler.bind(this, nip05),
                              }}
                          />
                      ))
                    : undefined}
            </View>
        </View>
    );
};

export default CreateKeysScreen;
