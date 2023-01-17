import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import globalStyles from "../../styles/globalStyles";
import Input from "../../components/Input";
import { generateMnemonic } from "../../utils/keys";
import { useCheckUsernameQuery } from "../../services/walletApi";
import CustomButton from "../../components/CustomButton";

const CreateKeysScreen = ({ navigation: { navigate } }) => {
    const [skip, setSkip] = useState(true);
    const [username, setUsername] = useState("");
    const [isFetching, setIsFetching] = useState();
    const { data, error, isLoading } = useCheckUsernameQuery(username, {
        skip,
    });

    console.log(data)

    useEffect(() => {
        setIsFetching(true)
        setSkip(true)
        let timer = setTimeout(() => {
            setSkip(false)
            setIsFetching(false)
        }, 1000);
        return () => {
            clearTimeout(timer);
        };
    }, [username]);

    const createKeysHandler = async () => {
        const mem = await generateMnemonic();
        navigate("ShowBackup", { mem, username });
    };

    return (
        <View style={globalStyles.screenContainer}>
            <Text style={globalStyles.textH1}>Choose your username</Text>
            <View style={{ width: "100%", alignItems: "center", margin: 32 }}>
                <Input
                    label="Choose Username"
                    inputStyle={{ width: "50%" }}
                    textInputConfig={{
                        value: username,
                        onChangeText: (value) => {
                            setUsername(value);
                        },
                        autoCapitalize: 'none'
                    }}
                />
                {data?.names ? <Text style={[globalStyles.textBody, {color: 'red', fontSize: 12, marginTop:8}]}>Username already taken!</Text> : undefined}
            </View>
            <CustomButton text='Create Keys' buttonConfig={{onPress: createKeysHandler}} disabled={ isFetching || isLoading || username.length === 0 || data?.names}/>
        </View>
    );
};

export default CreateKeysScreen;
