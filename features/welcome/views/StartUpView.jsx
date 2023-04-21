import { View, Text } from 'react-native';
import React from 'react';
import { Image } from 'expo-image';
import globalStyles from '../../../styles/globalStyles';
import CustomButton from '../../../components/CustomButton';
import { generateRandomString } from '../../../utils/cache/asyncStorage';

const logo = require('../../../assets/lightning_logo_negativ.png');

const StartUpView = ({ navigation }) => {
  const importHandler = async () => {
    generateRandomString(12);
    navigation.navigate('EULA', { isImport: true });
  };

  const createHandler = async () => {
    generateRandomString(12);
    navigation.navigate('Introduction');
  };

  return (
    <View
      style={[globalStyles.screenContainer, { justifyContent: 'space-around' }]}
    >
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Image
          source={logo}
          style={{
            height: 100,
            width: 100,
            borderRadius: 10,
          }}
        />
        <Text style={globalStyles.textH1}>Welcome, stranger!</Text>
        <Text style={globalStyles.textBody}>
          Do you want to create a new key-pair or import an existing one?
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <CustomButton
          text="Start fresh"
          buttonConfig={{ onPress: createHandler }}
          containerStyles={{
            margin: 16,
            minWidth: '80%',
            justifyContent: 'center',
          }}
        />
        <CustomButton
          text="Import keys/backup"
          buttonConfig={{ onPress: importHandler }}
          containerStyles={{
            margin: 16,
            minWidth: '80%',
            justifyContent: 'center',
          }}
        />
      </View>
    </View>
  );
};

export default StartUpView;
