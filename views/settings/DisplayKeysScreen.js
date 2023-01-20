import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import globalStyles from "../../styles/globalStyles";
import CustomButton from "../../components/CustomButton";
import { getValue } from "../../utils/secureStore";

const Word = ({ word, index }) => {
    return (
        <View
            style={[
                {
                    padding: 12,
                    backgroundColor: "#222222",
                    borderRadius: 5,
                    width: "45%",
                    margin: 6,
                    textAlign: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "space-between",
                },
            ]}
        >
            <Text style={globalStyles.textBody}>{index + 1}</Text>
            <Text style={globalStyles.textBody}>{word}</Text>
        </View>
    );
};

const DisplayKeysScreen = () => {

    const [mem, setMem] = useState(['****','****','****','****','****','****','****','****','****','****','****','****',]);

    showHandler = async () => {
        const keys = await getValue('mem');
        setMem(JSON.parse(keys))
    }

    return (
        <View style={globalStyles.screenContainer}>
            <View style={{flex: 2}}>
                <Text style={globalStyles.textH1}>
                    This is your Backup... Write it down!
                </Text>
                <FlatList
                    data={mem}
                    renderItem={({ item, index }) => (
                        <Word word={item} index={index} />
                    )}
                    style={{ width: "100%", flexGrow: 0 }}
                    columnWrapperStyle={{ justifyContent: "space-between" }}
                    numColumns={2}
                />
            </View>
            <View style={{flex: 1, justifyContent: 'center'}}>
                <CustomButton
                    text={'Show keys'}
                    buttonConfig={{ onPress: showHandler }}
                />
            </View>
        </View>
    );
};

export default DisplayKeysScreen;
