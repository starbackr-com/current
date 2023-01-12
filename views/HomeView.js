import { View, Text, Button, StyleSheet } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux';
import { loginToWallet } from '../utils/wallet';

const HomeView = () => {
    const { privKey, pubKey } = useSelector((state) => state.auth);

    return (
        <View style={styles.container}>
            <Text style={styles.createKeyText}>
                Feed will go here...
            </Text>
            <Button title='Testing' onPress={() => {
                loginToWallet();
            }}/>
        </View>
    );
}

export default HomeView

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
